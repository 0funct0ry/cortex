use crate::request::{RequestBody, RequestHistoryEntry};
use reqwest::{Client, Method};
use std::collections::BTreeMap;
use std::time::Instant;

#[derive(Clone)]
pub struct HttpExecutor {
    client: Client,
}

impl Default for HttpExecutor {
    fn default() -> Self {
        Self::new()
    }
}

impl HttpExecutor {
    pub fn new() -> Self {
        Self {
            client: Client::builder()
                .user_agent("Cortex/0.1.0")
                .build()
                .unwrap_or_else(|_| Client::new()),
        }
    }

    pub async fn execute(
        &self,
        request_name: String,
        method: &str,
        url: &str,
        headers: BTreeMap<String, String>,
        body: Option<RequestBody>,
    ) -> RequestHistoryEntry {
        let executed_at = RequestHistoryEntry::now_iso();
        let id = RequestHistoryEntry::random_id();
        let start = Instant::now();

        let method = match Method::from_bytes(method.as_bytes()) {
            Ok(m) => m,
            Err(_) => Method::GET,
        };

        let mut req_builder = self.client.request(method.clone(), url);

        let is_multipart = if let Some(ref b) = body {
            b.active_type.as_deref() == Some("form_data")
        } else {
            false
        };

        let mut has_content_type = false;
        for (key, value) in &headers {
            if key.eq_ignore_ascii_case("content-type") {
                has_content_type = true;
                if is_multipart {
                    continue; // Skip user-provided Content-Type header so reqwest can generate it with the correct boundary parameter
                }
            }
            req_builder = req_builder.header(key, value);
        }

        if let Some(b) = body {
            match b.active_type.as_deref() {
                Some("none") => {
                    // Send no body
                }
                Some("json") => {
                    if let Some(json_str) = b.json {
                        if !has_content_type {
                            req_builder = req_builder.header("Content-Type", "application/json");
                        }
                        req_builder = req_builder.body(json_str);
                    }
                }
                Some("form_data") => {
                    let mut form = reqwest::multipart::Form::new();
                    if let Some(fields) = b.form_data {
                        for field in fields {
                            if field.enabled {
                                if field.is_file {
                                    if !field.file_path.is_empty() {
                                        match std::fs::read(&field.file_path) {
                                            Ok(bytes) => {
                                                let file_name =
                                                    std::path::Path::new(&field.file_path)
                                                        .file_name()
                                                        .and_then(|n| n.to_str())
                                                        .unwrap_or("file")
                                                        .to_string();
                                                let mime = mime_guess::from_path(&field.file_path)
                                                    .first_raw()
                                                    .unwrap_or("application/octet-stream");
                                                let part = reqwest::multipart::Part::bytes(bytes)
                                                    .file_name(file_name)
                                                    .mime_str(mime)
                                                    .unwrap_or_else(|_| {
                                                        reqwest::multipart::Part::bytes(vec![])
                                                    });
                                                form = form.part(field.key, part);
                                            }
                                            Err(_) => {
                                                form = form.part(
                                                    field.key,
                                                    reqwest::multipart::Part::bytes(vec![]),
                                                );
                                            }
                                        }
                                    }
                                } else {
                                    form = form.text(field.key, field.value);
                                }
                            }
                        }
                    }
                    req_builder = req_builder.multipart(form);
                }
                Some("url_encoded") => {
                    let mut params = Vec::new();
                    if let Some(fields) = b.url_encoded {
                        for field in fields {
                            if field.enabled {
                                params.push((field.key, field.value));
                            }
                        }
                    }
                    if !has_content_type {
                        req_builder =
                            req_builder.header("Content-Type", "application/x-www-form-urlencoded");
                    }
                    req_builder = req_builder.form(&params);
                }
                Some("raw") => {
                    if let Some(raw_text) = b.raw_text {
                        if !has_content_type {
                            let subtype = b.raw_subtype.as_deref().unwrap_or("text");
                            let content_type = match subtype {
                                "html" => "text/html",
                                "xml" => "application/xml",
                                "javascript" => "application/javascript",
                                _ => "text/plain",
                            };
                            req_builder = req_builder.header("Content-Type", content_type);
                        }
                        req_builder = req_builder.body(raw_text);
                    }
                }
                Some("file") => {
                    if let Some(file_path) = b.file_path {
                        if !file_path.is_empty() {
                            if !has_content_type {
                                let mime = mime_guess::from_path(&file_path)
                                    .first_raw()
                                    .unwrap_or("application/octet-stream");
                                req_builder = req_builder.header("Content-Type", mime);
                            }
                            if let Ok(bytes) = std::fs::read(&file_path) {
                                req_builder = req_builder.body(bytes);
                            }
                        }
                    }
                }
                _ => {
                    if let Some(text) = b.text {
                        req_builder = req_builder.body(text);
                    } else if let Some(json) = b.json {
                        if !has_content_type {
                            req_builder = req_builder.header("Content-Type", "application/json");
                        }
                        req_builder = req_builder.body(json);
                    } else if let Some(form) = b.form {
                        req_builder = req_builder.form(&form);
                    }
                }
            }
        }

        let response_result = req_builder.send().await;

        let duration_ms = start.elapsed().as_millis() as u32;

        match response_result {
            Ok(resp) => {
                let status_code = resp.status().as_u16();
                let status_text = resp.status().canonical_reason().unwrap_or("").to_string();

                let mut resp_headers = BTreeMap::new();
                for (key, value) in resp.headers().iter() {
                    resp_headers.insert(key.to_string(), value.to_str().unwrap_or("").to_string());
                }

                let response_body = if method == Method::HEAD {
                    Some(String::new())
                } else {
                    resp.text().await.ok()
                };

                RequestHistoryEntry {
                    id,
                    request_name,
                    method: method.to_string(),
                    raw_url: url.to_string(),
                    rendered_url: url.to_string(),
                    captured_variables: BTreeMap::new(),
                    executed_at,
                    duration_ms: Some(duration_ms),
                    status_code: Some(status_code),
                    status_text: Some(status_text),
                    response_body,
                    headers: resp_headers,
                    error: None,
                    warnings: Vec::new(),
                }
            }
            Err(e) => RequestHistoryEntry {
                id,
                request_name,
                method: method.to_string(),
                raw_url: url.to_string(),
                rendered_url: url.to_string(),
                captured_variables: BTreeMap::new(),
                executed_at,
                duration_ms: Some(duration_ms),
                status_code: None,
                status_text: None,
                response_body: None,
                headers: BTreeMap::new(),
                error: Some(e.to_string()),
                warnings: Vec::new(),
            },
        }
    }
}
