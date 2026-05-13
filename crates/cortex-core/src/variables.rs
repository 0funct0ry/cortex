use crate::template::{FilterExpr, TemplateSegment};
use rand::Rng;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::{BTreeMap, HashSet};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Type)]
#[serde(rename_all = "lowercase")]
pub enum VariableScope {
    Global,
    Collection,
    Environment,
    Runtime,
    Dynamic,
}

impl std::fmt::Display for VariableScope {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            VariableScope::Global => write!(f, "global"),
            VariableScope::Collection => write!(f, "collection"),
            VariableScope::Environment => write!(f, "environment"),
            VariableScope::Runtime => write!(f, "runtime"),
            VariableScope::Dynamic => write!(f, "dynamic"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct Variable {
    pub name: String,
    pub value: String,
    #[serde(default)]
    pub secret: bool,
    #[serde(default = "default_true")]
    pub enabled: bool,
    /// If true, the user is asked to supply a value before each collection run.
    /// The `value` field serves as the pre-filled default shown in the prompt dialog.
    #[serde(default)]
    pub prompt: bool,
    /// Optional hint shown beneath the input in the prompt dialog.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

fn default_true() -> bool {
    true
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct ResolvedVariable {
    pub value: String,
    pub scope: VariableScope,
    pub secret: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct UnresolvedVariableWarning {
    pub name: String,
}

/// A template syntax error encountered during parsing or rendering.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct TemplateSyntaxError {
    /// The offending raw text (e.g. `"{{unclosed"`).
    pub raw: String,
    /// Human-readable description of the problem.
    pub message: String,
}

/// The output of [`VariableResolver::render`].
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct RenderResult {
    /// Fully rendered string.
    pub text: String,
    /// Placeholders that could not be resolved and had no default filter.
    pub warnings: Vec<UnresolvedVariableWarning>,
    /// Structural template errors (e.g. unclosed `{{`, unknown filter).
    pub syntax_errors: Vec<TemplateSyntaxError>,
    /// Dynamic and standard variable values captured during this render pass.
    #[serde(default)]
    pub captured_variables: BTreeMap<String, String>,
}

#[derive(Default)]
pub struct VariableResolver {
    pub global_vars: BTreeMap<String, Variable>,
    pub collection_vars: BTreeMap<String, Variable>,
    pub env_vars: BTreeMap<String, Variable>,
    pub runtime_vars: BTreeMap<String, Variable>,
}

impl VariableResolver {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn resolve(&self, key: &str) -> Option<ResolvedVariable> {
        // Intercept built-in dynamic variables first
        match key {
            "$randomInt" => {
                let val = rand::thread_rng().gen_range(0..=1000);
                return Some(ResolvedVariable {
                    value: val.to_string(),
                    scope: VariableScope::Dynamic,
                    secret: false,
                });
            }
            "$timestamp" => {
                let val = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .map(|d| d.as_secs())
                    .unwrap_or(0);
                return Some(ResolvedVariable {
                    value: val.to_string(),
                    scope: VariableScope::Dynamic,
                    secret: false,
                });
            }
            "$isoTimestamp" => {
                let val = chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string();
                return Some(ResolvedVariable {
                    value: val,
                    scope: VariableScope::Dynamic,
                    secret: false,
                });
            }
            "$randomNanoId" => {
                const ALPHABET: &[u8] =
                    b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
                let mut rng = rand::thread_rng();
                let val: String = (0..21)
                    .map(|_| {
                        let idx = rng.gen_range(0..ALPHABET.len());
                        ALPHABET[idx] as char
                    })
                    .collect();
                return Some(ResolvedVariable {
                    value: val,
                    scope: VariableScope::Dynamic,
                    secret: false,
                });
            }
            _ => {}
        }

        // Precedence: Runtime -> Environment -> Collection -> Global
        // Only resolve if enabled
        if let Some(var) = self.runtime_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Runtime,
                    secret: var.secret,
                });
            }
        }
        if let Some(var) = self.env_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Environment,
                    secret: var.secret,
                });
            }
        }
        if let Some(var) = self.collection_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Collection,
                    secret: var.secret,
                });
            }
        }
        if let Some(var) = self.global_vars.get(key) {
            if var.enabled {
                return Some(ResolvedVariable {
                    value: var.value.clone(),
                    scope: VariableScope::Global,
                    secret: var.secret,
                });
            }
        }
        None
    }

    /// Interpolates variables in a string.
    /// Returns the interpolated string and a list of warnings for unresolved variables.
    pub fn interpolate(&self, text: &str) -> (String, Vec<UnresolvedVariableWarning>) {
        let mut result = String::new();
        let mut warnings = Vec::new();
        let mut current = text;

        while let Some(start) = current.find("{{") {
            result.push_str(&current[..start]);
            let remaining = &current[start + 2..];
            if let Some(end) = remaining.find("}}") {
                let key = remaining[..end].trim();
                if let Some(resolved) = self.resolve(key) {
                    result.push_str(&resolved.value);
                } else {
                    // Keep the original placeholder but add a warning
                    result.push_str("{{");
                    result.push_str(&remaining[..end]);
                    result.push_str("}}");
                    warnings.push(UnresolvedVariableWarning { name: key.to_string() });
                }
                current = &remaining[end + 2..];
            } else {
                // No closing }} found, just push the rest and break
                result.push_str("{{");
                current = remaining;
                break;
            }
        }
        result.push_str(current);

        (result, warnings)
    }

    /// Interpolates variables in a string, masking secrets with `********`.
    pub fn interpolate_masked(&self, text: &str) -> (String, Vec<UnresolvedVariableWarning>) {
        let mut result = String::new();
        let mut warnings = Vec::new();
        let mut current = text;

        while let Some(start) = current.find("{{") {
            result.push_str(&current[..start]);
            let remaining = &current[start + 2..];
            if let Some(end) = remaining.find("}}") {
                let key = remaining[..end].trim();
                if let Some(resolved) = self.resolve(key) {
                    if resolved.secret {
                        result.push_str("********");
                    } else {
                        result.push_str(&resolved.value);
                    }
                } else {
                    result.push_str("{{");
                    result.push_str(&remaining[..end]);
                    result.push_str("}}");
                    warnings.push(UnresolvedVariableWarning { name: key.to_string() });
                }
                current = &remaining[end + 2..];
            } else {
                result.push_str("{{");
                current = remaining;
                break;
            }
        }
        result.push_str(current);

        (result, warnings)
    }

    /// Returns all variables that would be available in the current context,
    /// resolved according to precedence.
    pub fn get_all_resolved(&self) -> BTreeMap<String, ResolvedVariable> {
        let mut all = BTreeMap::new();

        // Insert built-in dynamic variables with freshly generated preview values
        if let Some(res) = self.resolve("$randomInt") {
            all.insert("$randomInt".to_string(), res);
        }
        if let Some(res) = self.resolve("$timestamp") {
            all.insert("$timestamp".to_string(), res);
        }
        if let Some(res) = self.resolve("$isoTimestamp") {
            all.insert("$isoTimestamp".to_string(), res);
        }
        if let Some(res) = self.resolve("$randomNanoId") {
            all.insert("$randomNanoId".to_string(), res);
        }

        // Start from lowest precedence and override
        // Only include enabled variables
        for (k, v) in &self.global_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Global,
                        secret: v.secret,
                    },
                );
            }
        }
        for (k, v) in &self.collection_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Collection,
                        secret: v.secret,
                    },
                );
            }
        }
        for (k, v) in &self.env_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Environment,
                        secret: v.secret,
                    },
                );
            }
        }
        for (k, v) in &self.runtime_vars {
            if v.enabled {
                all.insert(
                    k.clone(),
                    ResolvedVariable {
                        value: v.value.clone(),
                        scope: VariableScope::Runtime,
                        secret: v.secret,
                    },
                );
            }
        }

        all
    }

    // -----------------------------------------------------------------------
    // Full-featured template renderer (filter support, nesting, circular-ref detection)
    // -----------------------------------------------------------------------

    /// Render `text` using the full template engine.
    ///
    /// Supports:
    /// - `{{variableName}}` — replaced with the resolved value.
    /// - `{{variableName | default: 'fallback'}}` — uses `fallback` when the
    ///   variable is undefined.
    /// - Nested resolution up to 5 levels deep (variables whose values
    ///   themselves contain `{{...}}` placeholders).
    /// - Circular-reference detection: produces a [`TemplateSyntaxError`] and
    ///   a `<<circular: name>>` marker in the output, then continues.
    /// - Unclosed `{{` and other syntax problems → [`TemplateSyntaxError`].
    ///
    /// Secret values are emitted as-is.  Use [`render_masked`] for display.
    pub fn render(&self, text: &str) -> RenderResult {
        let segments = crate::template::parse(text);
        let mut visited = HashSet::new();
        self.render_segments(&segments, 0, &mut visited, false)
    }

    /// Same as [`render`] but replaces secret variable values with `********`.
    pub fn render_masked(&self, text: &str) -> RenderResult {
        let segments = crate::template::parse(text);
        let mut visited = HashSet::new();
        self.render_segments(&segments, 0, &mut visited, true)
    }

    fn render_segments(
        &self,
        segments: &[TemplateSegment],
        depth: u8,
        visited: &mut HashSet<String>,
        mask_secrets: bool,
    ) -> RenderResult {
        const MAX_DEPTH: u8 = 5;

        let mut text = String::new();
        let mut warnings: Vec<UnresolvedVariableWarning> = Vec::new();
        let mut syntax_errors: Vec<TemplateSyntaxError> = Vec::new();
        let mut captured_variables: BTreeMap<String, String> = BTreeMap::new();

        for seg in segments {
            match seg {
                TemplateSegment::Literal(s) => text.push_str(s),

                TemplateSegment::SyntaxError(e) => {
                    text.push_str(&e.raw);
                    syntax_errors.push(TemplateSyntaxError {
                        raw: e.raw.clone(),
                        message: e.message.clone(),
                    });
                }

                TemplateSegment::Placeholder(p) => {
                    if visited.contains(&p.name) {
                        // Circular reference detected.
                        let marker = format!("<<circular: {}>>", p.name);
                        text.push_str(&marker);
                        syntax_errors.push(TemplateSyntaxError {
                            raw: p.raw.clone(),
                            message: format!(
                                "circular variable reference detected: '{}' references itself",
                                p.name
                            ),
                        });
                        continue;
                    }

                    if let Some(resolved) = self.resolve(&p.name) {
                        captured_variables.insert(p.name.clone(), resolved.value.clone());

                        let value = if mask_secrets && resolved.secret {
                            "********".to_string()
                        } else {
                            resolved.value.clone()
                        };

                        // Nested resolution: if the resolved value itself contains
                        // placeholders and we have not exceeded the depth limit,
                        // recurse.
                        if depth < MAX_DEPTH && value.contains("{{") {
                            let nested_segments = crate::template::parse(&value);
                            visited.insert(p.name.clone());
                            let nested = self.render_segments(
                                &nested_segments,
                                depth + 1,
                                visited,
                                mask_secrets,
                            );
                            visited.remove(&p.name);
                            text.push_str(&nested.text);
                            warnings.extend(nested.warnings);
                            syntax_errors.extend(nested.syntax_errors);
                            captured_variables.extend(nested.captured_variables);
                        } else {
                            text.push_str(&value);
                        }
                    } else {
                        // Variable not found — apply default filter if present.
                        match &p.filter {
                            Some(FilterExpr::Default(fallback)) => {
                                text.push_str(fallback);
                            }
                            None => {
                                text.push_str(&p.raw);
                                warnings.push(UnresolvedVariableWarning { name: p.name.clone() });
                            }
                        }
                    }
                }
            }
        }

        RenderResult { text, warnings, syntax_errors, captured_variables }
    }

    /// Returns all enabled prompt variables from the collection and environment scopes
    /// that do not already have a runtime (ephemeral) override.
    ///
    /// These are the variables the user must be asked to fill in before a collection run.
    pub fn pending_prompt_variables(&self) -> Vec<&Variable> {
        let mut pending = Vec::new();

        // Check collection-scope prompt variables
        for var in self.collection_vars.values() {
            if var.prompt && var.enabled && !self.runtime_vars.contains_key(&var.name) {
                pending.push(var);
            }
        }

        // Check env-scope prompt variables (may overlap with collection; env takes precedence)
        for var in self.env_vars.values() {
            if var.prompt && var.enabled && !self.runtime_vars.contains_key(&var.name) {
                // Replace any collection-level entry for the same name
                if let Some(pos) = pending.iter().position(|v| v.name == var.name) {
                    pending[pos] = var;
                } else {
                    pending.push(var);
                }
            }
        }

        // Sort by name for stable, predictable ordering in the dialog
        pending.sort_by(|a, b| a.name.cmp(&b.name));
        pending
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_precedence() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "global".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.collection_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.collection_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.env_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "env".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.runtime_vars.insert(
            "c".to_string(),
            Variable {
                name: "c".to_string(),
                value: "runtime".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        // a should be collection (overrides global)
        let res_a = resolver.resolve("a").unwrap();
        assert_eq!(res_a.value, "collection");
        assert_eq!(res_a.scope, VariableScope::Collection);
        assert!(!res_a.secret);

        // b should be env (overrides collection)
        let res_b = resolver.resolve("b").unwrap();
        assert_eq!(res_b.value, "env");
        assert_eq!(res_b.scope, VariableScope::Environment);
        assert!(!res_b.secret);

        // c should be runtime
        let res_c = resolver.resolve("c").unwrap();
        assert_eq!(res_c.value, "runtime");
        assert_eq!(res_c.scope, VariableScope::Runtime);
        assert!(!res_c.secret);

        // non-existent
        assert!(resolver.resolve("d").is_none());
    }

    #[test]
    fn test_interpolation() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "base_url".to_string(),
            Variable {
                name: "base_url".to_string(),
                value: "https://api.com".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.env_vars.insert(
            "token".to_string(),
            Variable {
                name: "token".to_string(),
                value: "secret".to_string(),
                secret: true,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        let (interpolated, warnings) =
            resolver.interpolate("{{base_url}}/v1/users?token={{token}}&other={{missing}}");

        assert_eq!(interpolated, "https://api.com/v1/users?token=secret&other={{missing}}");
        assert_eq!(warnings.len(), 1);
        assert_eq!(warnings[0].name, "missing");
    }

    #[test]
    fn test_get_all_resolved() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "global".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.collection_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "collection".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.env_vars.insert(
            "b".to_string(),
            Variable {
                name: "b".to_string(),
                value: "env".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        let all = resolver.get_all_resolved();
        assert_eq!(all.len(), 6);
        assert_eq!(all.get("a").unwrap().value, "collection");
        assert!(!all.get("a").unwrap().secret);
        assert_eq!(all.get("b").unwrap().value, "env");
        assert!(!all.get("b").unwrap().secret);
    }

    #[test]
    fn test_enabled_toggle() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "a".to_string(),
            Variable {
                name: "a".to_string(),
                value: "val".to_string(),
                secret: false,
                enabled: false,
                prompt: false,
                description: None,
            },
        );

        assert!(resolver.resolve("a").is_none());
        let (interpolated, _) = resolver.interpolate("{{a}}");
        assert_eq!(interpolated, "{{a}}");
    }

    #[test]
    fn test_ephemeral_runtime_override() {
        // Ephemeral variables live at Runtime scope and override all other scopes.
        let mut resolver = VariableResolver::new();

        // Same key at every scope level
        let make = |value: &str, enabled: bool| Variable {
            name: "API_KEY".to_string(),
            value: value.to_string(),
            secret: false,
            enabled,
            prompt: false,
            description: None,
        };

        resolver.global_vars.insert("API_KEY".to_string(), make("global-key", true));
        resolver.collection_vars.insert("API_KEY".to_string(), make("collection-key", true));
        resolver.env_vars.insert("API_KEY".to_string(), make("env-key", true));
        // Ephemeral (session) variable sits at runtime level
        resolver.runtime_vars.insert("API_KEY".to_string(), make("ephemeral-key", true));

        let resolved = resolver.resolve("API_KEY").unwrap();
        assert_eq!(resolved.value, "ephemeral-key");
        assert_eq!(resolved.scope, VariableScope::Runtime);

        // When the ephemeral var is disabled, fall through to environment
        resolver.runtime_vars.insert("API_KEY".to_string(), make("ephemeral-key", false));
        let resolved = resolver.resolve("API_KEY").unwrap();
        assert_eq!(resolved.value, "env-key");
        assert_eq!(resolved.scope, VariableScope::Environment);

        // Removing the ephemeral var entirely falls through to environment
        resolver.runtime_vars.clear();
        let resolved = resolver.resolve("API_KEY").unwrap();
        assert_eq!(resolved.value, "env-key");
        assert_eq!(resolved.scope, VariableScope::Environment);

        // Interpolation reflects runtime override
        resolver.runtime_vars.insert("API_KEY".to_string(), make("session-token", true));
        let (text, warnings) = resolver.interpolate("Bearer {{API_KEY}}");
        assert_eq!(text, "Bearer session-token");
        assert!(warnings.is_empty());
    }

    #[test]
    fn test_masked_interpolation() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert(
            "api_key".to_string(),
            Variable {
                name: "api_key".to_string(),
                value: "super-secret".to_string(),
                secret: true,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        resolver.global_vars.insert(
            "public_id".to_string(),
            Variable {
                name: "public_id".to_string(),
                value: "123".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );

        let (interpolated, _) = resolver.interpolate_masked("ID: {{public_id}}, Key: {{api_key}}");
        assert_eq!(interpolated, "ID: 123, Key: ********");

        let (normal, _) = resolver.interpolate("ID: {{public_id}}, Key: {{api_key}}");
        assert_eq!(normal, "ID: 123, Key: super-secret");
    }

    #[test]
    fn test_prompt_variable_field_serialization() {
        // A prompt variable with a description round-trips through YAML correctly.
        let var = Variable {
            name: "region".to_string(),
            value: "us-east-1".to_string(),
            secret: false,
            enabled: true,
            prompt: true,
            description: Some("AWS region to deploy to".to_string()),
        };
        let yaml = serde_yaml::to_string(&var).expect("serialize");
        let back: Variable = serde_yaml::from_str(&yaml).expect("deserialize");
        assert_eq!(back.prompt, true);
        assert_eq!(back.description.as_deref(), Some("AWS region to deploy to"));
        assert_eq!(back.value, "us-east-1");

        // A plain variable (no prompt fields in YAML) deserializes with prompt=false.
        let plain_yaml = "name: token\nvalue: abc\n";
        let plain: Variable = serde_yaml::from_str(plain_yaml).expect("deserialize plain");
        assert!(!plain.prompt);
        assert!(plain.description.is_none());

        // description is omitted from serialized YAML when None (skip_serializing_if).
        let no_desc = Variable {
            name: "x".to_string(),
            value: "y".to_string(),
            secret: false,
            enabled: true,
            prompt: true,
            description: None,
        };
        let no_desc_yaml = serde_yaml::to_string(&no_desc).expect("serialize no_desc");
        assert!(!no_desc_yaml.contains("description"));
    }

    // -----------------------------------------------------------------------
    // render() / render_masked() tests
    // -----------------------------------------------------------------------

    fn make_var(name: &str, value: &str, secret: bool) -> Variable {
        Variable {
            name: name.to_string(),
            value: value.to_string(),
            secret,
            enabled: true,
            prompt: false,
            description: None,
        }
    }

    #[test]
    fn test_render_no_placeholders() {
        let resolver = VariableResolver::new();
        let res = resolver.render("hello world");
        assert_eq!(res.text, "hello world");
        assert!(res.warnings.is_empty());
        assert!(res.syntax_errors.is_empty());
    }

    #[test]
    fn test_render_resolved_variable() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("host".into(), make_var("host", "api.example.com", false));
        let res = resolver.render("https://{{host}}/v1");
        assert_eq!(res.text, "https://api.example.com/v1");
        assert!(res.warnings.is_empty());
        assert!(res.syntax_errors.is_empty());
    }

    #[test]
    fn test_render_unresolved_produces_warning() {
        let resolver = VariableResolver::new();
        let res = resolver.render("https://{{host}}/v1");
        assert_eq!(res.text, "https://{{host}}/v1");
        assert_eq!(res.warnings.len(), 1);
        assert_eq!(res.warnings[0].name, "host");
        assert!(res.syntax_errors.is_empty());
    }

    #[test]
    fn test_render_filter_default_when_undefined() {
        let resolver = VariableResolver::new();
        let res = resolver.render("{{env | default: 'staging'}}");
        assert_eq!(res.text, "staging");
        assert!(res.warnings.is_empty(), "default filter suppresses warnings");
        assert!(res.syntax_errors.is_empty());
    }

    #[test]
    fn test_render_filter_default_not_used_when_defined() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("env".into(), make_var("env", "production", false));
        let res = resolver.render("{{env | default: 'staging'}}");
        assert_eq!(res.text, "production");
        assert!(res.warnings.is_empty());
    }

    #[test]
    fn test_render_filter_default_not_used_when_empty_string() {
        // An empty-string variable IS defined; the default should NOT be applied.
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("env".into(), make_var("env", "", false));
        let res = resolver.render("{{env | default: 'staging'}}");
        assert_eq!(res.text, "");
        assert!(res.warnings.is_empty());
    }

    #[test]
    fn test_render_nested_resolution() {
        let mut resolver = VariableResolver::new();
        // base_url's value itself contains a placeholder.
        resolver
            .global_vars
            .insert("base_url".into(), make_var("base_url", "https://{{host}}", false));
        resolver.global_vars.insert("host".into(), make_var("host", "api.example.com", false));
        let res = resolver.render("{{base_url}}/users");
        assert_eq!(res.text, "https://api.example.com/users");
        assert!(res.warnings.is_empty());
        assert!(res.syntax_errors.is_empty());
    }

    #[test]
    fn test_render_nested_depth_limit() {
        // Build a chain: a→b→c→d→e→f (6 levels, exceeds MAX_DEPTH of 5).
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("a".into(), make_var("a", "{{b}}", false));
        resolver.global_vars.insert("b".into(), make_var("b", "{{c}}", false));
        resolver.global_vars.insert("c".into(), make_var("c", "{{d}}", false));
        resolver.global_vars.insert("d".into(), make_var("d", "{{e}}", false));
        resolver.global_vars.insert("e".into(), make_var("e", "{{f}}", false));
        resolver.global_vars.insert("f".into(), make_var("f", "deepest", false));
        // At depth 5 (zero-indexed), resolving `e` produces `{{f}}` as the value,
        // but we won't recurse further — `{{f}}` is emitted as-is with a warning.
        let res = resolver.render("{{a}}");
        assert!(!res.text.is_empty(), "should produce some output without panicking");
    }

    #[test]
    fn test_render_circular_reference() {
        let mut resolver = VariableResolver::new();
        // a → {{b}}, b → {{a}}
        resolver.global_vars.insert("a".into(), make_var("a", "{{b}}", false));
        resolver.global_vars.insert("b".into(), make_var("b", "{{a}}", false));
        let res = resolver.render("{{a}}");
        // Should not stack-overflow; must produce a syntax error describing the cycle.
        assert!(
            res.syntax_errors.iter().any(|e| e.message.contains("circular")),
            "expected a circular-reference error, got: {:?}",
            res.syntax_errors
        );
    }

    #[test]
    fn test_render_unclosed_brace_syntax_error() {
        let resolver = VariableResolver::new();
        let res = resolver.render("prefix {{ unclosed");
        assert_eq!(res.syntax_errors.len(), 1);
        assert!(res.syntax_errors[0].message.contains("unclosed"));
        // Original text should be present in the output (no data loss).
        assert!(res.text.contains("prefix "));
    }

    #[test]
    fn test_render_masked_secret() {
        let mut resolver = VariableResolver::new();
        resolver.global_vars.insert("key".into(), make_var("key", "super-secret", true));
        resolver.global_vars.insert("id".into(), make_var("id", "123", false));
        let masked = resolver.render_masked("id={{id}}&key={{key}}");
        assert_eq!(masked.text, "id=123&key=********");
        let plain = resolver.render("id={{id}}&key={{key}}");
        assert_eq!(plain.text, "id=123&key=super-secret");
    }

    #[test]
    fn test_render_multiple_warnings() {
        let resolver = VariableResolver::new();
        let res = resolver.render("{{a}} and {{b}}");
        assert_eq!(res.warnings.len(), 2);
        let names: Vec<&str> = res.warnings.iter().map(|w| w.name.as_str()).collect();
        assert!(names.contains(&"a"));
        assert!(names.contains(&"b"));
    }

    #[test]
    fn test_render_empty_input() {
        let resolver = VariableResolver::new();
        let res = resolver.render("");
        assert_eq!(res.text, "");
        assert!(res.warnings.is_empty());
        assert!(res.syntax_errors.is_empty());
    }

    #[test]
    fn test_pending_prompt_variables() {
        let make_prompt = |name: &str, value: &str| Variable {
            name: name.to_string(),
            value: value.to_string(),
            secret: false,
            enabled: true,
            prompt: true,
            description: None,
        };
        let make_plain = |name: &str| Variable {
            name: name.to_string(),
            value: "x".to_string(),
            secret: false,
            enabled: true,
            prompt: false,
            description: None,
        };

        let mut resolver = VariableResolver::new();
        resolver.collection_vars.insert("region".to_string(), make_prompt("region", "us-east-1"));
        resolver.collection_vars.insert("env".to_string(), make_prompt("env", "staging"));
        resolver.collection_vars.insert("plain".to_string(), make_plain("plain"));

        // All prompt vars pending — no runtime override yet
        let pending = resolver.pending_prompt_variables();
        assert_eq!(pending.len(), 2);
        let names: Vec<&str> = pending.iter().map(|v| v.name.as_str()).collect();
        assert!(names.contains(&"region"));
        assert!(names.contains(&"env"));

        // Satisfy "region" via runtime override — it should drop from pending
        resolver.runtime_vars.insert(
            "region".to_string(),
            Variable {
                name: "region".to_string(),
                value: "eu-west-1".to_string(),
                secret: false,
                enabled: true,
                prompt: false,
                description: None,
            },
        );
        let pending2 = resolver.pending_prompt_variables();
        assert_eq!(pending2.len(), 1);
        assert_eq!(pending2[0].name, "env");

        // Env-scope prompt variable overrides collection-scope entry for same name
        resolver.env_vars.insert(
            "env".to_string(),
            Variable {
                name: "env".to_string(),
                value: "production".to_string(),
                secret: false,
                enabled: true,
                prompt: true,
                description: Some("Target environment".to_string()),
            },
        );
        let pending3 = resolver.pending_prompt_variables();
        assert_eq!(pending3.len(), 1);
        assert_eq!(pending3[0].value, "production"); // env-scope value wins
        assert_eq!(pending3[0].description.as_deref(), Some("Target environment"));

        // Disabled prompt vars are excluded
        resolver.collection_vars.insert(
            "disabled".to_string(),
            Variable {
                name: "disabled".to_string(),
                value: "".to_string(),
                secret: false,
                enabled: false,
                prompt: true,
                description: None,
            },
        );
        let pending4 = resolver.pending_prompt_variables();
        assert!(!pending4.iter().any(|v| v.name == "disabled"));
    }
}
