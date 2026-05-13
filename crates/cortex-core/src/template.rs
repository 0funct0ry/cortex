/// Template parser for `{{variableName}}` and `{{variableName | default: 'fallback'}}` syntax.
///
/// The parser produces a flat list of [`TemplateSegment`]s that can be rendered
/// by [`crate::variables::VariableResolver::render`].
use std::fmt;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/// A single segment of a parsed template string.
#[derive(Debug, PartialEq, Clone)]
pub enum TemplateSegment {
    /// Plain text with no placeholders.
    Literal(String),
    /// A `{{name}}` or `{{name | default: 'fallback'}}` placeholder.
    Placeholder(PlaceholderSegment),
    /// A malformed placeholder — e.g. an unclosed `{{`.
    SyntaxError(SyntaxErrorSegment),
}

/// A successfully parsed placeholder.
#[derive(Debug, PartialEq, Clone)]
pub struct PlaceholderSegment {
    /// The trimmed variable name (e.g. `"base_url"`).
    pub name: String,
    /// Optional filter expression (e.g. `| default: 'fallback'`).
    pub filter: Option<FilterExpr>,
    /// The original `{{...}}` text, used when re-emitting unresolved placeholders.
    pub raw: String,
}

/// A malformed segment encountered during parsing.
#[derive(Debug, PartialEq, Clone)]
pub struct SyntaxErrorSegment {
    /// The offending raw text (e.g. `"{{unclosed"`).
    pub raw: String,
    /// Human-readable description of the problem.
    pub message: String,
}

/// Filter expressions that can appear after `|` inside a placeholder.
#[derive(Debug, PartialEq, Clone)]
pub enum FilterExpr {
    /// `| default: 'value'` or `| default: "value"` — used when the variable
    /// is undefined.  An empty-string variable is still considered defined and
    /// the fallback is NOT applied.
    Default(String),
}

impl fmt::Display for FilterExpr {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FilterExpr::Default(v) => write!(f, "default: '{v}'"),
        }
    }
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/// Parse `text` into a sequence of [`TemplateSegment`]s.
///
/// Guaranteed properties:
/// - Two consecutive `Literal` segments are never emitted; they are merged.
/// - An unclosed `{{` produces exactly one `SyntaxError` and terminates parsing
///   (remaining text is appended as part of its `raw` field so no text is lost).
/// - A template with no `{{` returns a single `Literal` (or empty `Vec` if the
///   input is empty).
pub fn parse(text: &str) -> Vec<TemplateSegment> {
    let mut segments: Vec<TemplateSegment> = Vec::new();
    let mut rest = text;

    while let Some(open) = rest.find("{{") {
        // Emit everything before `{{` as a literal.
        if open > 0 {
            push_literal(&mut segments, &rest[..open]);
        }

        let after_open = &rest[open + 2..];

        match after_open.find("}}") {
            Some(close) => {
                let inner = &after_open[..close];
                let raw = format!("{{{{{inner}}}}}");
                let seg = parse_placeholder(inner, raw);
                segments.push(seg);
                rest = &after_open[close + 2..];
            }
            None => {
                // Unclosed `{{` — consume the rest as a syntax error.
                let raw = format!("{{{{{after_open}");
                segments.push(TemplateSegment::SyntaxError(SyntaxErrorSegment {
                    raw,
                    message: "unclosed '{{' — missing '}}'".to_string(),
                }));
                return segments;
            }
        }
    }

    // Any remaining text after the last placeholder.
    if !rest.is_empty() {
        push_literal(&mut segments, rest);
    }

    segments
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/// Push `text` as a `Literal`, merging with the previous segment if it too is
/// a `Literal`.
fn push_literal(segments: &mut Vec<TemplateSegment>, text: &str) {
    if let Some(TemplateSegment::Literal(prev)) = segments.last_mut() {
        prev.push_str(text);
    } else {
        segments.push(TemplateSegment::Literal(text.to_string()));
    }
}

/// Parse the inner text of `{{...}}` into a [`TemplateSegment`].
fn parse_placeholder(inner: &str, raw: String) -> TemplateSegment {
    // Split on the first ` | ` to separate name from filter.
    if let Some(pipe_pos) = find_pipe(inner) {
        let name = inner[..pipe_pos].trim().to_string();
        let filter_str = inner[pipe_pos + 1..].trim();

        if name.is_empty() {
            return TemplateSegment::SyntaxError(SyntaxErrorSegment {
                raw,
                message: "placeholder has an empty variable name".to_string(),
            });
        }

        match parse_filter(filter_str) {
            Ok(filter) => {
                TemplateSegment::Placeholder(PlaceholderSegment { name, filter: Some(filter), raw })
            }
            Err(msg) => TemplateSegment::SyntaxError(SyntaxErrorSegment { raw, message: msg }),
        }
    } else {
        let name = inner.trim().to_string();
        if name.is_empty() {
            return TemplateSegment::SyntaxError(SyntaxErrorSegment {
                raw,
                message: "placeholder has an empty variable name".to_string(),
            });
        }
        TemplateSegment::Placeholder(PlaceholderSegment { name, filter: None, raw })
    }
}

/// Find the position of the first bare `|` in `s` that is not inside quotes.
/// Returns the byte offset of the `|` character.
fn find_pipe(s: &str) -> Option<usize> {
    let mut in_single = false;
    let mut in_double = false;
    for (i, ch) in s.char_indices() {
        match ch {
            '\'' if !in_double => in_single = !in_single,
            '"' if !in_single => in_double = !in_double,
            '|' if !in_single && !in_double => return Some(i),
            _ => {}
        }
    }
    None
}

/// Parse a filter expression of the form `default: 'value'` or `default: "value"`.
fn parse_filter(filter_str: &str) -> Result<FilterExpr, String> {
    let s = filter_str.trim();

    if let Some(rest) = s.strip_prefix("default:") {
        let value_str = rest.trim();
        let value = unquote(value_str).ok_or_else(|| {
            format!(
                "invalid default filter value '{value_str}' — expected a quoted string, \
                 e.g. default: 'fallback'"
            )
        })?;
        Ok(FilterExpr::Default(value))
    } else {
        Err(format!("unknown filter '{s}' — only 'default' is supported"))
    }
}

/// Strip surrounding single- or double-quotes from `s`.  Returns `None` if `s`
/// is not properly quoted.
fn unquote(s: &str) -> Option<String> {
    if (s.starts_with('\'') && s.ends_with('\'')) || (s.starts_with('"') && s.ends_with('"')) {
        Some(s[1..s.len() - 1].to_string())
    } else {
        None
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn lit(s: &str) -> TemplateSegment {
        TemplateSegment::Literal(s.to_string())
    }

    fn ph(name: &str) -> TemplateSegment {
        TemplateSegment::Placeholder(PlaceholderSegment {
            name: name.to_string(),
            filter: None,
            raw: format!("{{{{{name}}}}}"),
        })
    }

    fn ph_default(name: &str, fallback: &str) -> TemplateSegment {
        TemplateSegment::Placeholder(PlaceholderSegment {
            name: name.to_string(),
            filter: Some(FilterExpr::Default(fallback.to_string())),
            raw: format!("{{{{{name} | default: '{fallback}'}}}}"),
        })
    }

    #[test]
    fn test_empty_string() {
        assert!(parse("").is_empty());
    }

    #[test]
    fn test_no_placeholders() {
        assert_eq!(parse("hello world"), vec![lit("hello world")]);
    }

    #[test]
    fn test_single_placeholder() {
        assert_eq!(parse("{{foo}}"), vec![ph("foo")]);
    }

    #[test]
    fn test_literal_then_placeholder() {
        assert_eq!(parse("prefix-{{foo}}-suffix"), vec![lit("prefix-"), ph("foo"), lit("-suffix")]);
    }

    #[test]
    fn test_multiple_placeholders() {
        assert_eq!(parse("{{a}} and {{b}}"), vec![ph("a"), lit(" and "), ph("b")]);
    }

    #[test]
    fn test_default_filter_single_quotes() {
        assert_eq!(parse("{{x | default: 'fb'}}"), vec![ph_default("x", "fb")]);
    }

    #[test]
    fn test_default_filter_double_quotes() {
        let segs = parse(r#"{{x | default: "fb"}}"#);
        assert_eq!(segs.len(), 1);
        if let TemplateSegment::Placeholder(p) = &segs[0] {
            assert_eq!(p.name, "x");
            assert_eq!(p.filter, Some(FilterExpr::Default("fb".to_string())));
        } else {
            panic!("expected placeholder");
        }
    }

    #[test]
    fn test_unclosed_braces() {
        let segs = parse("before {{unclosed");
        assert_eq!(segs.len(), 2);
        assert_eq!(segs[0], lit("before "));
        if let TemplateSegment::SyntaxError(e) = &segs[1] {
            assert!(e.message.contains("unclosed"));
        } else {
            panic!("expected syntax error");
        }
    }

    #[test]
    fn test_empty_placeholder_name() {
        let segs = parse("{{}}");
        assert_eq!(segs.len(), 1);
        assert!(matches!(segs[0], TemplateSegment::SyntaxError(_)));
    }

    #[test]
    fn test_whitespace_trimmed_in_name() {
        let segs = parse("{{  foo  }}");
        assert_eq!(segs.len(), 1);
        if let TemplateSegment::Placeholder(p) = &segs[0] {
            assert_eq!(p.name, "foo");
            assert_eq!(p.filter, None);
            // raw preserves the original text verbatim
            assert_eq!(p.raw, "{{  foo  }}");
        } else {
            panic!("expected placeholder, got: {:?}", segs[0]);
        }
    }

    #[test]
    fn test_unknown_filter() {
        let segs = parse("{{x | upper}}");
        assert!(matches!(segs[0], TemplateSegment::SyntaxError(_)));
    }
}
