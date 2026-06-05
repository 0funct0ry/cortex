use base64::Engine as _;
use cortex_core::collection::{Collection, CollectionItem};
use cortex_core::request::RequestBody;
use cortex_core::variables::Variable;
use pulldown_cmark::{html as cmark_html, Options, Parser};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::{BTreeMap, HashSet};

// ── Option structs ────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(rename_all = "camelCase")]
pub struct HtmlDocOptions {
    pub theme: HtmlTheme,
    pub include_try_it_out: bool,
    pub resolve_non_secret_vars: bool,
    pub include_scripts: bool,
    pub include_tags: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(rename_all = "camelCase")]
pub enum HtmlTheme {
    Cortex,
    Scalar,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(rename_all = "camelCase")]
pub struct MarkdownDocOptions {
    pub resolve_non_secret_vars: bool,
    pub collapse_examples: bool,
    pub include_scripts: bool,
    pub include_tags: bool,
    pub heading_offset: u8,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(rename_all = "camelCase")]
pub struct OpenApiDocOptions {
    pub format: OpenApiFormat,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(rename_all = "camelCase")]
pub enum OpenApiFormat {
    Yaml,
    Json,
}

// ── Internal doc model ────────────────────────────────────────────────────────

struct DocCollection {
    name: String,
    description: Option<String>,
    auth_type_label: Option<String>,
    #[allow(dead_code)]
    default_headers: Vec<(String, String)>,
    variables: Vec<Variable>,
    items: Vec<DocItem>,
    secret_placeholders: Vec<String>,
    warnings: Vec<String>,
}

enum DocItem {
    Folder(DocFolder),
    Request(Box<DocRequest>),
}

struct DocFolder {
    name: String,
    description: Option<String>,
    items: Vec<DocItem>,
}

struct DocRequest {
    name: String,
    method: String,
    url: String,
    description: Option<String>,
    params: Vec<(String, String)>,
    headers: Vec<(String, String)>,
    body: Option<BodyDoc>,
    auth_type_label: Option<String>,
    tags: Vec<String>,
    pre_script: Option<String>,
    post_script: Option<String>,
}

struct BodyDoc {
    content_type: String,
    content: String,
}

// ── Auth label helper ─────────────────────────────────────────────────────────

fn auth_type_label(auth_type: &str) -> &'static str {
    match auth_type {
        "bearer" => "Bearer Token",
        "basic" => "Basic Auth",
        "oauth2" => "OAuth 2.0",
        "api_key" => "API Key",
        "digest" => "Digest Auth",
        "hawk" => "Hawk Auth",
        "aws" => "AWS Signature",
        "ntlm" => "NTLM Auth",
        _ => "Custom Auth",
    }
}

// ── Body rendering ────────────────────────────────────────────────────────────

fn render_body(body: &RequestBody) -> Option<BodyDoc> {
    let active = body.active_type.as_deref().unwrap_or("raw_text");
    match active {
        "raw_text" => {
            let subtype = body.raw_subtype.as_deref().unwrap_or("text");
            let content_type = match subtype {
                "json" => "application/json",
                "xml" => "application/xml",
                "html" => "text/html",
                _ => "text/plain",
            };
            let text = body.raw_text.as_deref().or(body.text.as_deref()).unwrap_or("");
            if text.is_empty() {
                None
            } else {
                Some(BodyDoc { content_type: content_type.to_string(), content: text.to_string() })
            }
        }
        "form_data" => {
            let entries = body.form_data.as_deref().unwrap_or(&[]);
            if entries.is_empty() {
                return None;
            }
            let lines: Vec<String> = entries
                .iter()
                .filter(|e| e.enabled)
                .map(|e| {
                    if e.is_file {
                        format!("{}: <file: {}>", e.key, e.file_path)
                    } else {
                        format!("{}: {}", e.key, e.value)
                    }
                })
                .collect();
            Some(BodyDoc {
                content_type: "multipart/form-data".to_string(),
                content: lines.join("\n"),
            })
        }
        "url_encoded" => {
            let entries = body.url_encoded.as_deref().unwrap_or(&[]);
            if entries.is_empty() {
                return None;
            }
            let pairs: Vec<String> = entries
                .iter()
                .filter(|e| e.enabled)
                .map(|e| format!("{}={}", e.key, e.value))
                .collect();
            Some(BodyDoc {
                content_type: "application/x-www-form-urlencoded".to_string(),
                content: pairs.join("&"),
            })
        }
        "file" => {
            let path = body.file_path.as_deref().unwrap_or("<file>");
            Some(BodyDoc {
                content_type: "application/octet-stream".to_string(),
                content: format!("<binary file: {}>", path),
            })
        }
        _ => {
            // Legacy json/text/form
            if let Some(j) = &body.json {
                return Some(BodyDoc {
                    content_type: "application/json".to_string(),
                    content: j.clone(),
                });
            }
            if let Some(t) = &body.text {
                if !t.is_empty() {
                    return Some(BodyDoc {
                        content_type: "text/plain".to_string(),
                        content: t.clone(),
                    });
                }
            }
            None
        }
    }
}

// ── Secret scanner ────────────────────────────────────────────────────────────

fn collect_secret_names(variables: &[Variable]) -> HashSet<String> {
    variables.iter().filter(|v| v.secret).map(|v| v.name.clone()).collect()
}

fn scan_for_secret_placeholders(text: &str, secret_names: &HashSet<String>) -> Vec<String> {
    let mut found = Vec::new();
    let mut start = 0;
    while let Some(open) = text[start..].find("{{") {
        let abs_open = start + open;
        if let Some(close) = text[abs_open..].find("}}") {
            let name = text[abs_open + 2..abs_open + close].trim();
            if secret_names.contains(name) && !found.contains(&name.to_string()) {
                found.push(name.to_string());
            }
            start = abs_open + close + 2;
        } else {
            break;
        }
    }
    found
}

fn resolve_non_secrets(text: &str, variables: &[Variable]) -> String {
    let mut result = text.to_string();
    for var in variables {
        if !var.secret && var.enabled {
            let token = format!("{{{{{}}}}}", var.name);
            let val = match &var.value {
                serde_json::Value::String(s) => s.clone(),
                other => other.to_string(),
            };
            result = result.replace(&token, &val);
        }
    }
    result
}

// ── Tree collection ───────────────────────────────────────────────────────────

struct CollectionContext<'a> {
    all_vars: &'a [Variable],
    secret_names: &'a HashSet<String>,
    resolve_vars: bool,
    warnings: &'a mut Vec<String>,
    found_secrets: &'a mut HashSet<String>,
}

fn collect_items(
    items: &[CollectionItem],
    parent_headers: &BTreeMap<String, String>,
    parent_auth_label: Option<&str>,
    ctx: &mut CollectionContext,
) -> Vec<DocItem> {
    let mut result = Vec::new();
    for item in items {
        match item {
            CollectionItem::Folder(folder) => {
                let mut folder_headers = parent_headers.clone();
                if let Some(manifest) = &folder.manifest {
                    if let Some(fh) = &manifest.headers {
                        for (k, v) in fh {
                            folder_headers.insert(k.clone(), v.clone());
                        }
                    }
                }
                let folder_auth_label = folder
                    .manifest
                    .as_ref()
                    .and_then(|m| m.auth.as_ref())
                    .map(|a| auth_type_label(&a.r#type))
                    .or(parent_auth_label);

                // FolderManifest has no description field in the current schema

                let children =
                    collect_items(&folder.items, &folder_headers, folder_auth_label, ctx);
                result.push(DocItem::Folder(DocFolder {
                    name: folder.name.clone(),
                    description: None,
                    items: children,
                }));
            }
            CollectionItem::Request(wrapper) => {
                if let Some(err) = &wrapper.error {
                    ctx.warnings.push(format!("{}: {}", wrapper.relative_path.display(), err));
                    continue;
                }
                let rf = match &wrapper.content {
                    Some(rf) => rf,
                    None => {
                        ctx.warnings
                            .push(format!("{}: no content", wrapper.relative_path.display()));
                        continue;
                    }
                };

                let url = if ctx.resolve_vars {
                    resolve_non_secrets(&rf.url, ctx.all_vars)
                } else {
                    rf.url.clone()
                };

                // Collect secret placeholders from URL
                for s in scan_for_secret_placeholders(&url, ctx.secret_names) {
                    ctx.found_secrets.insert(s);
                }

                // Merge headers: parent → request
                let mut merged_headers = parent_headers.clone();
                if let Some(rh) = &rf.headers {
                    for (k, v) in rh {
                        merged_headers.insert(k.clone(), v.clone());
                    }
                }

                let headers: Vec<(String, String)> = merged_headers
                    .into_iter()
                    .map(|(k, v)| {
                        let val = if ctx.resolve_vars {
                            resolve_non_secrets(&v, ctx.all_vars)
                        } else {
                            v
                        };
                        for s in scan_for_secret_placeholders(&val, ctx.secret_names) {
                            ctx.found_secrets.insert(s);
                        }
                        (k, val)
                    })
                    .collect();

                let params: Vec<(String, String)> = rf
                    .params
                    .as_ref()
                    .map(|p| {
                        p.iter()
                            .map(|(k, v)| {
                                let val = if ctx.resolve_vars {
                                    resolve_non_secrets(v, ctx.all_vars)
                                } else {
                                    v.clone()
                                };
                                (k.clone(), val)
                            })
                            .collect()
                    })
                    .unwrap_or_default();

                let body = rf.body.as_ref().and_then(render_body);

                let auth_label = rf
                    .auth
                    .as_ref()
                    .map(|a| auth_type_label(&a.r#type).to_string())
                    .or_else(|| parent_auth_label.map(|s| s.to_string()));

                let tags = rf.tags.clone().unwrap_or_default();

                let pre_script = rf.scripts.as_ref().and_then(|s| s.pre.clone());
                let post_script = rf.scripts.as_ref().and_then(|s| s.post.clone());

                // Use the YAML name when it is a meaningful, user-set value.
                // Fall back to the filename stem (wrapper.name) when the YAML
                // name is still the factory default "New Request" or is empty —
                // this matches what the Cortex sidebar shows.
                let display_name = if rf.name.is_empty() || rf.name == "New Request" {
                    wrapper.name.clone()
                } else {
                    rf.name.clone()
                };

                result.push(DocItem::Request(Box::new(DocRequest {
                    name: display_name,
                    method: rf.method.clone(),
                    url,
                    description: None, // RequestFile has no description field in the current schema
                    params,
                    headers,
                    body,
                    auth_type_label: auth_label,
                    tags,
                    pre_script,
                    post_script,
                })));
            }
        }
    }
    result
}

fn build_doc_collection(
    collection_path: &str,
    resolve_vars: bool,
) -> Result<DocCollection, String> {
    let collection =
        Collection::load(collection_path).map_err(|e| format!("Failed to load collection: {e}"))?;

    let manifest = &collection.manifest;
    let all_vars: Vec<Variable> = manifest.variables.clone().unwrap_or_default();
    let secret_names = collect_secret_names(&all_vars);

    let auth_type_str = manifest.auth.as_ref().map(|a| auth_type_label(&a.r#type).to_string());

    let default_headers: Vec<(String, String)> = manifest
        .headers
        .as_ref()
        .map(|h| h.iter().map(|(k, v)| (k.clone(), v.clone())).collect())
        .unwrap_or_default();

    let parent_headers: BTreeMap<String, String> = manifest.headers.clone().unwrap_or_default();

    let mut warnings = Vec::new();
    let mut found_secrets: HashSet<String> = HashSet::new();

    // Scan collection-level headers for secrets
    for (_, v) in &default_headers {
        for s in scan_for_secret_placeholders(v, &secret_names) {
            found_secrets.insert(s);
        }
    }

    let mut ctx = CollectionContext {
        all_vars: &all_vars,
        secret_names: &secret_names,
        resolve_vars,
        warnings: &mut warnings,
        found_secrets: &mut found_secrets,
    };

    let items = collect_items(
        &collection.items,
        &parent_headers,
        manifest.auth.as_ref().map(|a| auth_type_label(&a.r#type)),
        &mut ctx,
    );

    let mut secret_placeholders: Vec<String> = found_secrets.into_iter().collect();
    secret_placeholders.sort();

    Ok(DocCollection {
        name: manifest.name.clone(),
        description: manifest.description.clone(),
        auth_type_label: auth_type_str,
        default_headers,
        variables: all_vars,
        items,
        secret_placeholders,
        warnings,
    })
}

// ── Slug helper ───────────────────────────────────────────────────────────────

fn slugify(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

// ── Method color ──────────────────────────────────────────────────────────────

fn method_color(method: &str) -> &'static str {
    match method.to_uppercase().as_str() {
        "GET" => "#3b82f6",
        "POST" => "#22c55e",
        "PUT" => "#f97316",
        "PATCH" => "#eab308",
        "DELETE" => "#ef4444",
        "HEAD" => "#8b5cf6",
        "OPTIONS" => "#6b7280",
        _ => "#6b7280",
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

pub fn generate_markdown(
    collection_path: &str,
    opts: MarkdownDocOptions,
) -> Result<String, String> {
    let doc = build_doc_collection(collection_path, opts.resolve_non_secret_vars)?;
    let offset = opts.heading_offset as usize;
    let mut out = String::new();

    let h1 = "#".repeat(1 + offset);
    let h2 = "#".repeat(2 + offset);
    let h3 = "#".repeat(3 + offset);
    let h4 = "#".repeat(4 + offset);

    out.push_str(&format!("{} {}\n\n", h1, doc.name));

    if let Some(desc) = &doc.description {
        out.push_str(&format!("{}\n\n", desc));
    }

    if let Some(auth) = &doc.auth_type_label {
        out.push_str(&format!("> **Authentication:** {}\n", auth));
    }
    out.push('\n');

    // Secrets notice
    if !doc.secret_placeholders.is_empty() {
        let names = doc
            .secret_placeholders
            .iter()
            .map(|n| format!("`{{{{{}}}}}`", n))
            .collect::<Vec<_>>()
            .join(", ");
        out.push_str(&format!(
            "> **Secrets Notice:** {} placeholder(s) in this documentation represent secret variables: {}. Recipients must supply their own values.\n\n",
            doc.secret_placeholders.len(),
            names
        ));
    }

    out.push_str("---\n\n");

    // Variables table
    if !doc.variables.is_empty() {
        out.push_str(&format!("{} Variables\n\n", h2));
        out.push_str("| Name | Description | Default |\n");
        out.push_str("|------|-------------|--------|\n");
        for var in &doc.variables {
            let desc = var.description.as_deref().unwrap_or("");
            let default = if var.secret {
                "*(secret)*".to_string()
            } else {
                match &var.value {
                    serde_json::Value::String(s) => format!("`{}`", s),
                    other => format!("`{}`", other),
                }
            };
            out.push_str(&format!("| {} | {} | {} |\n", var.name, desc, default));
        }
        out.push_str("\n---\n\n");
    }

    // Walk tree
    write_md_items(&doc.items, &h2, &h3, &h4, &opts, 0, &mut out);

    // Warnings
    if !doc.warnings.is_empty() {
        out.push_str("\n---\n\n");
        out.push_str(&format!("{} Generation Warnings\n\n", h2));
        out.push_str(&format!(
            "{} request(s) could not be included due to parse errors.\n\n",
            doc.warnings.len()
        ));
        for w in &doc.warnings {
            out.push_str(&format!("- `{}`\n", w));
        }
    }

    Ok(out)
}

fn write_md_items(
    items: &[DocItem],
    folder_heading: &str,
    req_heading: &str,
    sub_heading: &str,
    opts: &MarkdownDocOptions,
    depth: usize,
    out: &mut String,
) {
    for item in items {
        match item {
            DocItem::Folder(folder) => {
                out.push_str(&format!("{} {}\n\n", folder_heading, folder.name));
                if let Some(desc) = &folder.description {
                    out.push_str(&format!("{}\n\n", desc));
                }
                // Recurse — flatten headings past depth 2 (h4)
                let next_folder = if depth >= 2 { sub_heading } else { req_heading };
                let next_req = sub_heading;
                write_md_items(
                    &folder.items,
                    next_folder,
                    next_req,
                    sub_heading,
                    opts,
                    depth + 1,
                    out,
                );
                out.push_str("---\n\n");
            }
            DocItem::Request(req) => {
                out.push_str(&format!("{} `{}` {}\n\n", req_heading, req.method, req.name));
                out.push_str(&format!("```\n{} {}\n```\n\n", req.method, req.url));

                if let Some(desc) = &req.description {
                    out.push_str(&format!("{}\n\n", desc));
                }

                if opts.include_tags && !req.tags.is_empty() {
                    out.push_str(&format!(
                        "**Tags:** {}\n\n",
                        req.tags.iter().map(|t| format!("`{}`", t)).collect::<Vec<_>>().join(", ")
                    ));
                }

                if let Some(auth) = &req.auth_type_label {
                    out.push_str(&format!("**Auth:** {}\n\n", auth));
                }

                if !req.params.is_empty() {
                    out.push_str("**Parameters**\n\n");
                    out.push_str("| Name | Location | Required | Description | Example |\n");
                    out.push_str("|------|----------|----------|-------------|--------|\n");
                    for (k, v) in &req.params {
                        out.push_str(&format!("| {} | query | | | `{}` |\n", k, v));
                    }
                    out.push('\n');
                }

                if !req.headers.is_empty() {
                    out.push_str("**Headers**\n\n");
                    out.push_str("| Name | Value |\n");
                    out.push_str("|------|-------|\n");
                    for (k, v) in &req.headers {
                        out.push_str(&format!("| {} | `{}` |\n", k, v));
                    }
                    out.push('\n');
                }

                if let Some(body) = &req.body {
                    out.push_str(&format!("**Request Body** *({})*\n\n", body.content_type));
                    let lang = if body.content_type.contains("json") {
                        "json"
                    } else if body.content_type.contains("xml") {
                        "xml"
                    } else {
                        "text"
                    };
                    out.push_str(&format!("```{}\n{}\n```\n\n", lang, body.content));
                }

                if opts.include_scripts {
                    if let Some(pre) = &req.pre_script {
                        if !pre.is_empty() {
                            out.push_str("<details>\n<summary>Pre-request script</summary>\n\n");
                            out.push_str(&format!("```javascript\n{}\n```\n\n</details>\n\n", pre));
                        }
                    }
                    if let Some(post) = &req.post_script {
                        if !post.is_empty() {
                            out.push_str("<details>\n<summary>Post-response script</summary>\n\n");
                            out.push_str(&format!(
                                "```javascript\n{}\n```\n\n</details>\n\n",
                                post
                            ));
                        }
                    }
                }

                out.push('\n');
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML GENERATOR — Cortex theme
// ─────────────────────────────────────────────────────────────────────────────

pub fn generate_html_cortex(collection_path: &str, opts: HtmlDocOptions) -> Result<String, String> {
    let doc = build_doc_collection(collection_path, opts.resolve_non_secret_vars)?;

    let nav_html = build_nav_html(&doc.items, "");
    let content_html = build_content_html(&doc, &opts);
    let right_panel = build_right_panel_html(&doc.items, "");

    let dark_mode_css = r#"
:root {
  --bg: #0f1117;
  --bg2: #1a1d27;
  --bg3: #22263a;
  --border: #2e3347;
  --text: #e2e8f0;
  --text2: #94a3b8;
  --text3: #64748b;
  --accent: #6366f1;
  --nav-w: 260px;
  --panel-w: 340px;
}
body.light {
  --bg: #f8fafc;
  --bg2: #ffffff;
  --bg3: #f1f5f9;
  --border: #e2e8f0;
  --text: #0f172a;
  --text2: #475569;
  --text3: #94a3b8;
}
"#;

    let base_css = r#"
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
pre, code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }
pre { background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
code { background: var(--bg3); padding: 1px 5px; border-radius: 3px; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; padding: 8px 12px; background: var(--bg3); color: var(--text2); font-weight: 600; border-bottom: 1px solid var(--border); }
td { padding: 8px 12px; border-bottom: 1px solid var(--border); vertical-align: top; word-break: break-word; }
tr:last-child td { border-bottom: none; }
details summary { cursor: pointer; padding: 6px 0; color: var(--text2); font-size: 13px; }
details[open] summary { color: var(--text); }
.chip { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; margin-right: 4px; }
"#;

    let layout_css = r#"
header { height: 50px; background: var(--bg2); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; position: sticky; top: 0; z-index: 100; }
header .title { font-weight: 700; font-size: 16px; }
header button { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); padding: 4px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; }
.layout { display: flex; height: calc(100vh - 50px); overflow: hidden; }
nav.left-nav { width: var(--nav-w); background: var(--bg2); border-right: 1px solid var(--border); overflow-y: auto; padding: 16px 0; flex-shrink: 0; position: sticky; top: 50px; height: calc(100vh - 50px); }
nav.left-nav .nav-search { padding: 0 12px 12px; }
nav.left-nav .nav-search input { width: 100%; background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 6px 10px; border-radius: 6px; font-size: 13px; outline: none; }
nav.left-nav .folder-label { padding: 8px 16px 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text3); margin-top: 12px; border-left: 2px solid var(--accent); margin-left: 0; }
nav.left-nav .folder-label:first-child { margin-top: 4px; }
nav.left-nav a { display: flex; align-items: center; gap: 8px; padding: 5px 16px; color: var(--text2); font-size: 13px; line-height: 1.4; }
nav.left-nav .folder-requests a { padding-left: 24px; }
nav.left-nav a:hover, nav.left-nav a.active { background: var(--bg3); color: var(--text); text-decoration: none; }
nav.left-nav .method-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
main.content { flex: 1; overflow-y: auto; padding: 32px 40px; }
aside.right-panel { width: var(--panel-w); background: var(--bg2); border-left: 1px solid var(--border); overflow-y: auto; padding: 16px; flex-shrink: 0; position: sticky; top: 50px; height: calc(100vh - 50px); }
aside.right-panel h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text3); margin-bottom: 8px; }
"#;

    let content_css = r#"
.overview { max-width: 800px; margin-bottom: 40px; }
.overview h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
.overview p { color: var(--text2); line-height: 1.6; margin-bottom: 16px; }
.collection-desc { color: var(--text2); line-height: 1.7; margin-top: 12px; margin-bottom: 16px; font-size: 15px; }
.collection-desc p { color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
.collection-desc h1,.collection-desc h2,.collection-desc h3,.collection-desc h4 { color: var(--text); margin-top: 16px; margin-bottom: 8px; }
.collection-desc code { background: var(--bg3); padding: 2px 6px; border-radius: 3px; font-size: 12px; }
.collection-desc a { color: var(--accent); }
.collection-desc ul,.collection-desc ol { margin: 8px 0 12px 20px; color: var(--text2); line-height: 1.7; }
.collection-desc blockquote { border-left: 3px solid var(--border); padding-left: 12px; color: var(--text3); margin: 8px 0; }
.overview .meta { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; font-size: 13px; }
.overview .meta span { color: var(--text2); }
.overview .meta strong { color: var(--text); }
section.folder-section { margin-bottom: 48px; }
section.folder-section > h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
section.folder-section > p { color: var(--text2); margin-bottom: 24px; }
article.endpoint { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 16px; overflow: hidden; }
article.endpoint .ep-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--bg2); }
article.endpoint .ep-name { font-weight: 600; font-size: 15px; }
.method-badge { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; color: #fff; flex-shrink: 0; }
article.endpoint .ep-body { padding: 16px; }
.ep-section { margin-bottom: 20px; }
.ep-section h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text3); margin-bottom: 8px; }
.ep-section .token-url { font-family: monospace; font-size: 13px; background: var(--bg3); border: 1px solid var(--border); padding: 6px 10px; border-radius: 5px; word-break: break-all; }
.ep-section .token-url .var-chip { background: var(--accent); color: #fff; border-radius: 3px; padding: 1px 5px; font-size: 11px; margin: 0 1px; }
.secrets-notice { background: #dc262622; border: 1px solid #dc262644; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; }
.secrets-notice code { background: transparent; }
.warnings-section { background: #f9731622; border: 1px solid #f9731644; border-radius: 6px; padding: 12px 16px; margin-top: 40px; }
.warnings-section h3 { font-size: 14px; font-weight: 700; margin-bottom: 8px; color: #f97316; }
.tags-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
"#;

    let try_it_css = if opts.include_try_it_out {
        r#"
.try-it-toggle { background: none; border: 1px solid var(--border); color: var(--text2); padding: 4px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; margin-left: auto; }
.try-it-toggle:hover { border-color: var(--accent); color: var(--accent); }
.try-it-panel { background: var(--bg3); border-top: 1px solid var(--border); padding: 16px; display: none; }
.try-it-panel.open { display: block; }
.try-it-panel label { font-size: 12px; color: var(--text2); display: block; margin-bottom: 4px; }
.try-it-panel input, .try-it-panel textarea { width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 6px 10px; border-radius: 5px; font-family: monospace; font-size: 13px; margin-bottom: 10px; outline: none; }
.try-it-panel textarea { min-height: 80px; resize: vertical; }
.try-it-panel button.send-btn { background: var(--accent); color: #fff; border: none; padding: 7px 16px; border-radius: 5px; cursor: pointer; font-weight: 600; font-size: 13px; }
.try-it-response { margin-top: 12px; }
.try-it-response pre { max-height: 300px; overflow-y: auto; }
.status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.status-2xx { background: #16a34a22; color: #16a34a; }
.status-4xx { background: #dc262622; color: #dc2626; }
.status-5xx { background: #9f1e1e22; color: #9f1e1e; }
"#
    } else {
        ""
    };

    let inline_js = build_inline_js(opts.include_try_it_out);

    let html = format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — API Documentation</title>
<style>
{dark_mode_css}{base_css}{layout_css}{content_css}{try_it_css}
</style>
</head>
<body class="dark">
<header>
  <span class="title">📋 {title}</span>
  <button onclick="toggleTheme()" id="theme-btn">☀️ Light</button>
</header>
<div class="layout">
  <nav class="left-nav">
    <div class="nav-search"><input type="text" placeholder="Search endpoints…" oninput="filterNav(this.value)" id="nav-search"></div>
    {nav_html}
  </nav>
  <main class="content" id="main-content">
    {content_html}
  </main>
  <aside class="right-panel" id="right-panel">
    <h4>Code Sample</h4>
    <div id="code-sample-area"><pre style="color:var(--text3);font-style:italic;">Select an endpoint</pre></div>
    {right_panel}
  </aside>
</div>
<script>
{inline_js}
</script>
</body>
</html>"#,
        title = html_escape(&doc.name),
        dark_mode_css = dark_mode_css,
        base_css = base_css,
        layout_css = layout_css,
        content_css = content_css,
        try_it_css = try_it_css,
        nav_html = nav_html,
        content_html = content_html,
        right_panel = right_panel,
        inline_js = inline_js,
    );

    Ok(html)
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

/// Converts a Markdown string to an HTML fragment using pulldown-cmark.
/// Used when rendering description fields that may contain Markdown.
fn markdown_to_html(md: &str) -> String {
    let opts = Options::ENABLE_STRIKETHROUGH
        | Options::ENABLE_TABLES
        | Options::ENABLE_FOOTNOTES
        | Options::ENABLE_TASKLISTS;
    let parser = Parser::new_ext(md, opts);
    let mut html_output = String::new();
    cmark_html::push_html(&mut html_output, parser);
    html_output
}

fn render_url_with_chips(url: &str) -> String {
    let mut result = String::new();
    let mut rest = url;
    while let Some(open) = rest.find("{{") {
        result.push_str(&html_escape(&rest[..open]));
        rest = &rest[open + 2..];
        if let Some(close) = rest.find("}}") {
            let name = &rest[..close];
            result.push_str(&format!(
                r#"<span class="var-chip">{{{{{}}}}}</span>"#,
                html_escape(name)
            ));
            rest = &rest[close + 2..];
        } else {
            result.push_str("{{");
        }
    }
    result.push_str(&html_escape(rest));
    result
}

fn build_nav_html(items: &[DocItem], _prefix: &str) -> String {
    let mut out = String::new();
    for item in items {
        match item {
            DocItem::Folder(folder) => {
                out.push_str(&format!(
                    "<div class=\"folder-label\">{}</div>",
                    html_escape(&folder.name)
                ));
                out.push_str("<div class=\"folder-requests\">");
                out.push_str(&build_nav_html(&folder.items, &slugify(&folder.name)));
                out.push_str("</div>");
            }
            DocItem::Request(req) => {
                let id = slugify(&format!("{}-{}", req.method, req.name));
                let color = method_color(&req.method);
                let name = html_escape(&req.name);
                let method = html_escape(&req.method);
                out.push_str(&format!(
                    "<a href=\"#{}\" onclick=\"setActive(this)\" data-name=\"{} {}\">\n",
                    id, name, method
                ));
                out.push_str(&format!(
                    "  <span class=\"method-dot\" style=\"background:{}\"></span>\n",
                    color
                ));
                out.push_str(&format!(
                    "  <span class=\"nav-method\" style=\"color:{};font-size:10px;font-weight:800;min-width:42px\">{}</span>\n",
                    color, method
                ));
                out.push_str(&format!("  <span class=\"nav-name\">{}</span>\n</a>\n", name));
            }
        }
    }
    out
}

fn build_right_panel_html(_items: &[DocItem], _prefix: &str) -> String {
    // Right panel code samples are injected by JS based on scroll-spy
    String::new()
}

fn build_content_html(doc: &DocCollection, opts: &HtmlDocOptions) -> String {
    let mut out = String::new();

    // Overview
    out.push_str(r#"<div class="overview">"#);
    out.push_str(&format!("<h1>{}</h1>\n", html_escape(&doc.name)));
    if let Some(desc) = &doc.description {
        out.push_str(&format!("<div class=\"collection-desc\">{}</div>\n", markdown_to_html(desc)));
    }
    out.push_str(r#"<div class="meta">"#);
    if let Some(auth) = &doc.auth_type_label {
        out.push_str(&format!(r#"<span><strong>Auth:</strong> {}</span>"#, html_escape(auth)));
    }
    out.push_str("</div>\n");

    // Secrets notice
    if !doc.secret_placeholders.is_empty() {
        let names = doc
            .secret_placeholders
            .iter()
            .map(|n| format!("<code>{{{{{}}}}}</code>", html_escape(n)))
            .collect::<Vec<_>>()
            .join(", ");
        out.push_str(&format!(
            r#"<div class="secrets-notice"><strong>🔒 Secrets Notice:</strong> {} placeholder(s) in this documentation represent secret variables: {}. Recipients must supply their own values.</div>"#,
            doc.secret_placeholders.len(),
            names
        ));
    }

    // Variables table
    if !doc.variables.is_empty() {
        out.push_str("<h3 style='margin:16px 0 8px'>Variables</h3><table><thead><tr><th>Name</th><th>Description</th><th>Default</th></tr></thead><tbody>");
        for var in &doc.variables {
            let desc = var.description.as_deref().unwrap_or("");
            let default = if var.secret {
                "<em>(secret)</em>".to_string()
            } else {
                match &var.value {
                    serde_json::Value::String(s) => format!("<code>{}</code>", html_escape(s)),
                    other => format!("<code>{}</code>", html_escape(&other.to_string())),
                }
            };
            out.push_str(&format!(
                "<tr><td><code>{}</code></td><td>{}</td><td>{}</td></tr>",
                html_escape(&var.name),
                html_escape(desc),
                default
            ));
        }
        out.push_str("</tbody></table>\n");
    }

    out.push_str("</div>\n"); // end overview

    // Items
    build_items_html(&doc.items, &mut out, opts, 0);

    // Warnings
    if !doc.warnings.is_empty() {
        out.push_str(r#"<div class="warnings-section">"#);
        out.push_str(&format!(
            "<h3>⚠️ Generation Warnings ({} request(s) skipped)</h3>\n",
            doc.warnings.len()
        ));
        out.push_str("<ul style='margin-left:16px'>");
        for w in &doc.warnings {
            out.push_str(&format!("<li><code>{}</code></li>", html_escape(w)));
        }
        out.push_str("</ul></div>\n");
    }

    out
}

fn build_items_html(items: &[DocItem], out: &mut String, opts: &HtmlDocOptions, _depth: usize) {
    for item in items {
        match item {
            DocItem::Folder(folder) => {
                let folder_id = slugify(&folder.name);
                out.push_str(&format!(r#"<section class="folder-section" id="{}">"#, folder_id));
                out.push_str(&format!("<h2>{}</h2>\n", html_escape(&folder.name)));
                if let Some(desc) = &folder.description {
                    out.push_str(&format!(
                        "<div class=\"folder-desc\">{}</div>\n",
                        markdown_to_html(desc)
                    ));
                }
                build_items_html(&folder.items, out, opts, _depth + 1);
                out.push_str("</section>\n");
            }
            DocItem::Request(req) => {
                let ep_id = slugify(&format!("{}-{}", req.method, req.name));
                let badge_color = method_color(&req.method);
                let curl_sample = build_curl_sample(req);

                out.push_str(&format!(
                    r#"<article class="endpoint" id="{id}" data-curl="{curl_escaped}">"#,
                    id = ep_id,
                    curl_escaped = html_escape(&curl_sample),
                ));

                // Header
                out.push_str(r#"<div class="ep-header">"#);
                out.push_str(&format!(
                    r#"<span class="method-badge" style="background:{color}">{method}</span>"#,
                    color = badge_color,
                    method = html_escape(&req.method),
                ));
                out.push_str(&format!(
                    r#"<span class="ep-name">{}</span>"#,
                    html_escape(&req.name)
                ));
                // URL is shown with token chips in the body — omit it here to avoid duplication.
                if opts.include_try_it_out {
                    out.push_str(&format!(
                        r#"<button class="try-it-toggle" onclick="toggleTryIt('{id}')">Try it out</button>"#,
                        id = ep_id
                    ));
                }
                out.push_str("</div>\n");

                // Body
                out.push_str(r#"<div class="ep-body">"#);

                // URL with chips
                out.push_str(r#"<div class="ep-section"><h4>URL</h4>"#);
                out.push_str(&format!(
                    r#"<div class="token-url">{}</div>"#,
                    render_url_with_chips(&req.url)
                ));
                out.push_str("</div>\n");

                // Tags
                if opts.include_tags && !req.tags.is_empty() {
                    out.push_str(r#"<div class="ep-section"><h4>Tags</h4><div class="tags-row">"#);
                    for tag in &req.tags {
                        out.push_str(&format!(
                            r#"<span class="chip" style="background:var(--bg3);border:1px solid var(--border)">{}</span>"#,
                            html_escape(tag)
                        ));
                    }
                    out.push_str("</div></div>\n");
                }

                // Auth
                if let Some(auth) = &req.auth_type_label {
                    out.push_str(&format!(
                        r#"<div class="ep-section"><h4>Authentication</h4><span>{}</span></div>"#,
                        html_escape(auth)
                    ));
                }

                // Params
                if !req.params.is_empty() {
                    out.push_str(r#"<div class="ep-section"><h4>Query Parameters</h4><table><thead><tr><th>Name</th><th>Example</th></tr></thead><tbody>"#);
                    for (k, v) in &req.params {
                        out.push_str(&format!(
                            "<tr><td><code>{}</code></td><td><code>{}</code></td></tr>",
                            html_escape(k),
                            html_escape(v)
                        ));
                    }
                    out.push_str("</tbody></table></div>\n");
                }

                // Headers
                if !req.headers.is_empty() {
                    out.push_str(r#"<div class="ep-section"><h4>Headers</h4><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody>"#);
                    for (k, v) in &req.headers {
                        out.push_str(&format!(
                            "<tr><td><code>{}</code></td><td><code>{}</code></td></tr>",
                            html_escape(k),
                            html_escape(v)
                        ));
                    }
                    out.push_str("</tbody></table></div>\n");
                }

                // Body
                if let Some(body) = &req.body {
                    out.push_str(&format!(
                        r#"<div class="ep-section"><h4>Request Body <small style="color:var(--text3)">({})</small></h4>"#,
                        html_escape(&body.content_type)
                    ));
                    out.push_str(&format!("<pre>{}</pre>", html_escape(&body.content)));
                    out.push_str("</div>\n");
                }

                out.push_str("</div>\n"); // end ep-body

                // Try it out panel
                if opts.include_try_it_out {
                    build_try_it_panel(req, &ep_id, out);
                }

                out.push_str("</article>\n");
            }
        }
    }
}

fn build_curl_sample(req: &DocRequest) -> String {
    let mut parts = vec![format!("curl -X {} \\", req.method)];
    parts.push(format!("  '{}'", req.url));
    for (k, v) in &req.headers {
        parts.push(format!("  -H '{}: {}' \\", k, v));
    }
    if let Some(body) = &req.body {
        if body.content_type.contains("json") {
            parts.push("  -H 'Content-Type: application/json' \\".to_string());
            parts.push(format!("  -d '{}'", body.content.replace('\'', "'\\''")));
        }
    }
    parts.join(" \\\n")
}

fn build_try_it_panel(req: &DocRequest, ep_id: &str, out: &mut String) {
    out.push_str(&format!(r#"<div class="try-it-panel" id="try-{id}">"#, id = ep_id));

    out.push_str("<label>URL</label>");
    out.push_str(&format!(
        "<input type=\"text\" id=\"url-{}\" value=\"{}\" />",
        ep_id,
        html_escape(&req.url)
    ));

    if let Some(body) = &req.body {
        out.push_str(r#"<label>Request Body</label>"#);
        out.push_str(&format!(
            r#"<textarea id="body-{id}">{content}</textarea>"#,
            id = ep_id,
            content = html_escape(&body.content)
        ));
    }

    out.push_str(&format!(
        r#"<button class="send-btn" onclick="sendRequest('{id}','{method}')">▶ Send</button>"#,
        id = ep_id,
        method = req.method
    ));

    out.push_str(&format!(r#"<div class="try-it-response" id="resp-{id}"></div>"#, id = ep_id));
    out.push_str("</div>\n");
}

fn build_inline_js(include_try_it: bool) -> String {
    let try_it_js = if include_try_it {
        // Note: single quotes are used for JS strings to avoid escaping issues in Rust strings.
        // The sendRequest and toggleTryIt functions use DOM APIs directly.
        "\
function toggleTryIt(id) {\n\
  var p = document.getElementById('try-' + id);\n\
  if (p) p.classList.toggle('open');\n\
}\n\
function sendRequest(id, method) {\n\
  var url = document.getElementById('url-' + id);\n\
  var bodyEl = document.getElementById('body-' + id);\n\
  var respEl = document.getElementById('resp-' + id);\n\
  if (!respEl || !url) return;\n\
  respEl.innerHTML = '<em style=\"color:var(--text3)\">Sending...</em>';\n\
  var opts = { method: method, headers: {} };\n\
  if (bodyEl && bodyEl.value.trim()) {\n\
    opts.body = bodyEl.value;\n\
    opts.headers['Content-Type'] = 'application/json';\n\
  }\n\
  fetch(url.value, opts)\n\
    .then(function(r) {\n\
      var sc = r.status >= 500 ? 'status-5xx' : r.status >= 400 ? 'status-4xx' : 'status-2xx';\n\
      return r.text().then(function(body) {\n\
        var badge = '<span class=\"status-badge ' + sc + '\">' + r.status + ' ' + r.statusText + '</span>';\n\
        var fmt = body;\n\
        try { fmt = JSON.stringify(JSON.parse(body), null, 2); } catch(e) {}\n\
        respEl.innerHTML = badge + '<pre>' + escH(fmt) + '</pre>';\n\
      });\n\
    })\n\
    .catch(function(e) {\n\
      respEl.innerHTML = '<pre style=\"color:#ef4444\">Error: ' + escH(e.message) + '</pre>';\n\
    });\n\
}\n\
function escH(s) {\n\
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');\n\
}\n"
    } else {
        ""
    };

    // Build scroll-spy JS without "# sequences that would break raw string literals.
    // We avoid putting href="#... directly in querySelector by building the selector with concat.
    let mut js = String::new();
    js.push_str("function toggleTheme() {\n");
    js.push_str("  var body = document.body;\n");
    js.push_str("  var btn = document.getElementById('theme-btn');\n");
    js.push_str("  if (body.classList.contains('light')) {\n");
    js.push_str("    body.classList.remove('light');\n");
    js.push_str("    btn.textContent = '\\u2600\\uFE0F Light';\n");
    js.push_str("    localStorage.setItem('cortex-docs-theme', 'dark');\n");
    js.push_str("  } else {\n");
    js.push_str("    body.classList.add('light');\n");
    js.push_str("    btn.textContent = '\\uD83C\\uDF19 Dark';\n");
    js.push_str("    localStorage.setItem('cortex-docs-theme', 'light');\n");
    js.push_str("  }\n}\n");

    js.push_str("(function() {\n");
    js.push_str("  var t = localStorage.getItem('cortex-docs-theme');\n");
    js.push_str("  if (t === 'light') {\n");
    js.push_str("    document.body.classList.add('light');\n");
    js.push_str("    document.addEventListener('DOMContentLoaded', function() {\n");
    js.push_str("      var b = document.getElementById('theme-btn'); if(b) b.textContent='\\uD83C\\uDF19 Dark';\n");
    js.push_str("    });\n  }\n})();\n\n");

    js.push_str("function setActive(el) {\n");
    js.push_str("  document.querySelectorAll('nav.left-nav a').forEach(function(a) { a.classList.remove('active'); });\n");
    js.push_str("  el.classList.add('active');\n");
    js.push_str("  var href = el.getAttribute('href') || '';\n");
    js.push_str("  var id = href.substring(1);\n");
    js.push_str("  if (id) {\n");
    js.push_str("    var art = document.getElementById(id);\n");
    js.push_str("    if (art) { var curl = art.getAttribute('data-curl'); if (curl) updateCodeSample(curl); }\n");
    js.push_str("  }\n}\n\n");

    js.push_str("function updateCodeSample(curl) {\n");
    js.push_str("  var el = document.getElementById('code-sample-area');\n");
    js.push_str("  if (el) el.innerHTML = '<pre>' + escH2(curl) + '</pre>';\n");
    js.push_str("}\n\n");

    js.push_str("function escH2(s) {\n");
    js.push_str(
        "  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');\n",
    );
    js.push_str("}\n\n");

    js.push_str("function filterNav(q) {\n");
    js.push_str("  q = q.toLowerCase();\n");
    js.push_str("  document.querySelectorAll('nav.left-nav a').forEach(function(a) {\n");
    js.push_str("    var n = (a.getAttribute('data-name') || '').toLowerCase();\n");
    js.push_str("    a.style.display = n.includes(q) ? '' : 'none';\n");
    js.push_str("  });\n}\n\n");

    // Scroll spy — build the querySelector selector string in JS via concatenation to avoid "# in Rust source
    js.push_str("var _obs = new IntersectionObserver(function(entries) {\n");
    js.push_str("  entries.forEach(function(entry) {\n");
    js.push_str("    if (entry.isIntersecting) {\n");
    js.push_str("      var id = entry.target.id;\n");
    // Build selector: 'nav.left-nav a[href="' + '#' + id + '"]'
    js.push_str("      var sel = 'nav.left-nav a[href=\"' + '#' + id + '\"]';\n");
    js.push_str("      var link = document.querySelector(sel);\n");
    js.push_str("      if (link) {\n");
    js.push_str("        document.querySelectorAll('nav.left-nav a').forEach(function(a) { a.classList.remove('active'); });\n");
    js.push_str("        link.classList.add('active');\n");
    js.push_str("        var curl = entry.target.getAttribute('data-curl');\n");
    js.push_str("        if (curl) updateCodeSample(curl);\n");
    js.push_str("      }\n    }\n  });\n");
    js.push_str("}, { threshold: 0.2, rootMargin: '-50px 0px -70% 0px' });\n\n");

    js.push_str("document.querySelectorAll('article.endpoint').forEach(function(el) { _obs.observe(el); });\n");

    js.push_str(try_it_js);
    js
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML GENERATOR — Scalar theme
// ─────────────────────────────────────────────────────────────────────────────

pub fn generate_html_scalar(
    collection_path: &str,
    _opts: HtmlDocOptions,
) -> Result<String, String> {
    // Generate OpenAPI JSON, base64-encode it, embed in Scalar CDN page
    let openapi_json = generate_openapi_json(collection_path)?;
    let encoded = base64::engine::general_purpose::STANDARD.encode(openapi_json.as_bytes());

    let doc = build_doc_collection(collection_path, false)?;

    Ok(format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{title} — API Documentation</title>
</head>
<body>
<script
  id="api-reference"
  type="application/json"
  data-url="data:application/json;base64,{encoded}"
></script>
<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>"#,
        title = html_escape(&doc.name),
        encoded = encoded,
    ))
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENAPI 3.1 GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

fn generate_openapi_json(collection_path: &str) -> Result<String, String> {
    let spec = build_openapi_spec(collection_path)?;
    serde_json::to_string_pretty(&spec).map_err(|e| e.to_string())
}

pub fn generate_openapi(collection_path: &str, opts: OpenApiDocOptions) -> Result<String, String> {
    let spec = build_openapi_spec(collection_path)?;
    match opts.format {
        OpenApiFormat::Json => serde_json::to_string_pretty(&spec).map_err(|e| e.to_string()),
        OpenApiFormat::Yaml => serde_yaml::to_string(&spec).map_err(|e| e.to_string()),
    }
}

fn extract_path_params(url: &str) -> Vec<String> {
    let mut params = Vec::new();
    let mut rest = url;
    // Match {param} and {{param}}
    while let Some(open) = rest.find('{') {
        rest = &rest[open..];
        let is_double = rest.starts_with("{{");
        let start = if is_double { 2 } else { 1 };
        if rest.len() <= start {
            break;
        }
        rest = &rest[start..];
        let close_pat = if is_double { "}}" } else { "}" };
        if let Some(close) = rest.find(close_pat) {
            let name = rest[..close].trim().to_string();
            if !name.is_empty() && !name.contains(' ') {
                params.push(name);
            }
            rest = &rest[close + close_pat.len()..];
        } else {
            break;
        }
    }
    params
}

fn infer_schema(value_str: &str) -> serde_json::Value {
    if let Ok(v) = serde_json::from_str::<serde_json::Value>(value_str) {
        match &v {
            serde_json::Value::Object(_) => {
                serde_json::json!({"type": "object"})
            }
            serde_json::Value::Array(_) => {
                serde_json::json!({"type": "array"})
            }
            serde_json::Value::String(_) => {
                serde_json::json!({"type": "string"})
            }
            serde_json::Value::Number(_) => {
                serde_json::json!({"type": "number"})
            }
            serde_json::Value::Bool(_) => {
                serde_json::json!({"type": "boolean"})
            }
            _ => serde_json::json!({}),
        }
    } else {
        serde_json::json!({"type": "string"})
    }
}

// ── OpenAPI URL helpers ───────────────────────────────────────────────────────

/// Converts a full request URL into a relative OpenAPI path.
///
/// Examples:
///   "https://api.example.com/v1/users"   → "/v1/users"
///   "https://httpbin.org/{{FORMAT}}"     → "/{FORMAT}"
///   "{{base_url}}/customers/{id}"        → "/customers/{id}"  (strips leading var)
///   "/already/relative"                  → "/already/relative"
fn url_to_openapi_path(url: &str) -> String {
    // Convert {{param}} → {param} for OpenAPI style, then strip query string
    let normalized = url.replace("{{", "{").replace("}}", "}");
    let without_query = normalized.split('?').next().unwrap_or(&normalized);

    // Strip explicit scheme://host prefix
    if let Some(idx) = without_query.find("://") {
        let after_scheme = &without_query[idx + 3..];
        if let Some(slash) = after_scheme.find('/') {
            return after_scheme[slash..].to_string();
        }
        return "/".to_string();
    }

    // Strip a leading {variable} token that acts as the base URL placeholder
    // e.g. "{base_url}/v1/users" → "/v1/users"
    if without_query.starts_with('{') {
        if let Some(close) = without_query.find('}') {
            let remainder = &without_query[close + 1..];
            if remainder.starts_with('/') {
                return remainder.to_string();
            }
        }
    }

    // Already a relative path
    if without_query.starts_with('/') {
        without_query.to_string()
    } else {
        format!("/{}", without_query)
    }
}

/// Walk the item tree and return the scheme+host of the first concrete URL found.
/// Used as a fallback server URL when no `base_url` variable is defined.
fn extract_server_base(items: &[DocItem]) -> Option<String> {
    for item in items {
        match item {
            DocItem::Folder(f) => {
                if let Some(base) = extract_server_base(&f.items) {
                    return Some(base);
                }
            }
            DocItem::Request(req) => {
                if let Some(idx) = req.url.find("://") {
                    let after_scheme = &req.url[idx + 3..];
                    // Skip URLs that start with a variable token (no concrete host)
                    if after_scheme.starts_with('{') {
                        continue;
                    }
                    if let Some(slash) = after_scheme.find('/') {
                        return Some(format!("{}://{}", &req.url[..idx], &after_scheme[..slash]));
                    } else {
                        // URL is just scheme+host with no path
                        return Some(req.url.clone());
                    }
                }
            }
        }
    }
    None
}

fn build_openapi_spec(collection_path: &str) -> Result<serde_json::Value, String> {
    let doc = build_doc_collection(collection_path, false)?;

    let mut paths: serde_json::Map<String, serde_json::Value> = serde_json::Map::new();
    let mut tags: Vec<serde_json::Value> = Vec::new();

    collect_openapi_items(&doc.items, &mut paths, &mut tags, "");

    let mut spec = serde_json::json!({
        "openapi": "3.1.0",
        "info": {
            "title": doc.name,
            "version": "1.0.0"
        },
        "paths": paths,
        "tags": tags,
        "x-cortex-limitations": {
            "notice": "JSON schemas are inferred from example values and are not authoritative. Requests without saved examples produce empty schemas."
        }
    });

    if let Some(desc) = &doc.description {
        spec["info"]["description"] = serde_json::Value::String(desc.clone());
    }

    // servers[0].url: prefer the base_url collection variable (non-secret, non-empty),
    // then fall back to the scheme+host extracted from the first concrete request URL,
    // then fall back to a placeholder.
    let server_url = doc
        .variables
        .iter()
        .find(|v| v.name == "base_url" && !v.secret)
        .and_then(|v| match &v.value {
            serde_json::Value::String(s) if !s.is_empty() => Some(s.clone()),
            _ => None,
        })
        .or_else(|| extract_server_base(&doc.items))
        .unwrap_or_else(|| "https://api.example.com".to_string());
    spec["servers"] = serde_json::json!([{"url": server_url}]);

    // security schemes from auth
    if let Some(auth_label) = &doc.auth_type_label {
        let scheme = match auth_label.as_str() {
            "Bearer Token" => serde_json::json!({"type": "http", "scheme": "bearer"}),
            "Basic Auth" => serde_json::json!({"type": "http", "scheme": "basic"}),
            "API Key" => serde_json::json!({"type": "apiKey", "in": "header", "name": "X-API-Key"}),
            _ => serde_json::json!({"type": "http", "scheme": "bearer"}),
        };
        spec["components"] = serde_json::json!({
            "securitySchemes": {
                "defaultAuth": scheme
            }
        });
        spec["security"] = serde_json::json!([{"defaultAuth": []}]);
    }

    Ok(spec)
}

fn collect_openapi_items(
    items: &[DocItem],
    paths: &mut serde_json::Map<String, serde_json::Value>,
    tags: &mut Vec<serde_json::Value>,
    folder_name: &str,
) {
    for item in items {
        match item {
            DocItem::Folder(folder) => {
                let tag = serde_json::json!({"name": folder.name});
                tags.push(tag);
                collect_openapi_items(&folder.items, paths, tags, &folder.name);
            }
            DocItem::Request(req) => {
                // Derive a valid relative OpenAPI path from the full request URL
                let base_path = url_to_openapi_path(&req.url);
                let method = req.method.to_lowercase();

                // Deduplicate: if this method+path combo already exists, append a
                // numeric suffix so all operations stay visible in Scalar.
                let path_only = {
                    let mut candidate = base_path.clone();
                    let mut suffix = 2usize;
                    loop {
                        match paths.get(&candidate) {
                            Some(serde_json::Value::Object(obj)) if obj.contains_key(&method) => {
                                candidate =
                                    format!("{}-{}", base_path.trim_end_matches('/'), suffix);
                                suffix += 1;
                            }
                            _ => break,
                        }
                    }
                    candidate
                };

                let path_params = extract_path_params(&req.url);

                let mut parameters: Vec<serde_json::Value> = Vec::new();

                for pp in &path_params {
                    parameters.push(serde_json::json!({
                        "name": pp,
                        "in": "path",
                        "required": true,
                        "schema": {"type": "string"}
                    }));
                }

                for (k, v) in &req.params {
                    parameters.push(serde_json::json!({
                        "name": k,
                        "in": "query",
                        "schema": infer_schema(v)
                    }));
                }

                for (k, v) in &req.headers {
                    let k_lower = k.to_lowercase();
                    if k_lower == "authorization" || k_lower == "content-type" {
                        continue;
                    }
                    parameters.push(serde_json::json!({
                        "name": k,
                        "in": "header",
                        "schema": {"type": "string"},
                        "example": v
                    }));
                }

                let mut operation = serde_json::json!({
                    "summary": req.name,
                    "operationId": slugify(&format!("{}-{}", req.method, req.name)),
                    "parameters": parameters,
                    "responses": {"200": {"description": "OK"}}
                });

                if let Some(desc) = &req.description {
                    operation["description"] = serde_json::Value::String(desc.clone());
                }

                let mut op_tags: Vec<String> = req.tags.clone();
                if !folder_name.is_empty() {
                    op_tags.insert(0, folder_name.to_string());
                }
                if !op_tags.is_empty() {
                    operation["tags"] = serde_json::json!(op_tags);
                }

                if let Some(body) = &req.body {
                    let schema = infer_schema(&body.content);
                    operation["requestBody"] = serde_json::json!({
                        "content": {
                            body.content_type.clone(): {
                                "schema": schema,
                                "example": body.content
                            }
                        }
                    });
                }

                let path_entry = paths.entry(path_only).or_insert_with(|| serde_json::json!({}));
                if let serde_json::Value::Object(obj) = path_entry {
                    obj.insert(method, operation);
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// API BLUEPRINT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

pub fn generate_api_blueprint(collection_path: &str) -> Result<String, String> {
    let doc = build_doc_collection(collection_path, false)?;

    let mut out = String::new();
    out.push_str("FORMAT: 1A\n\n");
    out.push_str(&format!("# {}\n\n", doc.name));
    if let Some(desc) = &doc.description {
        out.push_str(&format!("{}\n\n", desc));
    }

    write_blueprint_items(&doc.items, &mut out);

    if !doc.warnings.is_empty() {
        out.push_str("\n# Generation Warnings\n\n");
        for w in &doc.warnings {
            out.push_str(&format!("- {}\n", w));
        }
    }

    Ok(out)
}

fn write_blueprint_items(items: &[DocItem], out: &mut String) {
    for item in items {
        match item {
            DocItem::Folder(folder) => {
                out.push_str(&format!("## {} Group\n\n", folder.name));
                write_blueprint_items(&folder.items, out);
            }
            DocItem::Request(req) => {
                // Extract path from URL
                let path = req.url.split('?').next().unwrap_or(&req.url);
                let path = path.replace("{{", "{").replace("}}", "}");

                out.push_str(&format!("### {} [{} {}]\n\n", req.name, req.method, path));
                if let Some(desc) = &req.description {
                    out.push_str(&format!("{}\n\n", desc));
                }

                out.push_str(&format!(
                    "+ Request ({})\n\n",
                    req.body
                        .as_ref()
                        .map(|b| b.content_type.as_str())
                        .unwrap_or("application/json")
                ));

                if !req.headers.is_empty() {
                    out.push_str("    + Headers\n\n");
                    for (k, v) in &req.headers {
                        out.push_str(&format!("            {}: {}\n", k, v));
                    }
                    out.push('\n');
                }

                if let Some(body) = &req.body {
                    out.push_str("    + Body\n\n");
                    for line in body.content.lines() {
                        out.push_str(&format!("            {}\n", line));
                    }
                    out.push('\n');
                }

                out.push_str("+ Response 200\n\n");
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTMAN v2.1 GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

pub fn generate_postman(collection_path: &str) -> Result<String, String> {
    let doc = build_doc_collection(collection_path, false)?;

    let items = build_postman_items(&doc.items);

    let mut collection = serde_json::json!({
        "info": {
            "name": doc.name,
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": items
    });

    if let Some(desc) = &doc.description {
        collection["info"]["description"] = serde_json::Value::String(desc.clone());
    }

    // Auth
    if let Some(auth_label) = &doc.auth_type_label {
        let auth_type = match auth_label.as_str() {
            "Bearer Token" => "bearer",
            "Basic Auth" => "basic",
            "API Key" => "apikey",
            _ => "noauth",
        };
        collection["auth"] = serde_json::json!({"type": auth_type});
    }

    // Variables (secret values as {{name}} references)
    if !doc.variables.is_empty() {
        let vars: Vec<serde_json::Value> = doc
            .variables
            .iter()
            .map(|v| {
                let val = if v.secret {
                    format!("{{{{{}}}}}", v.name)
                } else {
                    match &v.value {
                        serde_json::Value::String(s) => s.clone(),
                        other => other.to_string(),
                    }
                };
                serde_json::json!({
                    "key": v.name,
                    "value": val,
                    "type": if v.secret { "secret" } else { "default" }
                })
            })
            .collect();
        collection["variable"] = serde_json::Value::Array(vars);
    }

    serde_json::to_string_pretty(&collection).map_err(|e| e.to_string())
}

fn build_postman_items(items: &[DocItem]) -> Vec<serde_json::Value> {
    let mut result = Vec::new();
    for item in items {
        match item {
            DocItem::Folder(folder) => {
                let children = build_postman_items(&folder.items);
                result.push(serde_json::json!({
                    "name": folder.name,
                    "item": children
                }));
            }
            DocItem::Request(req) => {
                let headers: Vec<serde_json::Value> = req
                    .headers
                    .iter()
                    .map(|(k, v)| serde_json::json!({"key": k, "value": v}))
                    .collect();

                let mut url_obj = serde_json::json!({
                    "raw": req.url
                });

                // Split url into host + path for Postman format
                if let Ok(without_proto) = req.url.split("://").nth(1).ok_or("") {
                    let parts: Vec<&str> = without_proto.splitn(2, '/').collect();
                    if parts.len() >= 2 {
                        url_obj["host"] = serde_json::json!([parts[0]]);
                        url_obj["path"] =
                            serde_json::json!(parts[1].split('/').collect::<Vec<_>>());
                    }
                }

                // Query params
                if !req.params.is_empty() {
                    let query: Vec<serde_json::Value> = req
                        .params
                        .iter()
                        .map(|(k, v)| serde_json::json!({"key": k, "value": v}))
                        .collect();
                    url_obj["query"] = serde_json::Value::Array(query);
                }

                let mut request = serde_json::json!({
                    "method": req.method,
                    "header": headers,
                    "url": url_obj
                });

                if let Some(body) = &req.body {
                    let mode = if body.content_type.contains("json") {
                        "raw"
                    } else if body.content_type.contains("form-data") {
                        "formdata"
                    } else if body.content_type.contains("urlencoded") {
                        "urlencoded"
                    } else {
                        "raw"
                    };
                    request["body"] = serde_json::json!({
                        "mode": mode,
                        "raw": body.content
                    });
                }

                result.push(serde_json::json!({
                    "name": req.name,
                    "request": request
                }));
            }
        }
    }
    result
}
