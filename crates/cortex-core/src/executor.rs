use crate::request::{RequestBody, RequestHistoryEntry};
use reqwest::{Client, Method, Url};
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
                .redirect(reqwest::redirect::Policy::none())
                .build()
                .unwrap_or_else(|_| Client::new()),
        }
    }

    #[allow(clippy::too_many_arguments)]
    pub async fn execute(
        &self,
        request_name: String,
        method: &str,
        url: &str,
        headers: BTreeMap<String, String>,
        body: Option<RequestBody>,
        timeout_ms: Option<u32>,
        follow_redirects: bool,
    ) -> RequestHistoryEntry {
        let executed_at = RequestHistoryEntry::now_iso();
        let id = RequestHistoryEntry::random_id();
        let start = Instant::now();

        let mut current_url = url.to_string();
        let mut current_method = method.to_string();
        let mut current_body = body.clone();
        let mut redirect_chain = Vec::new();
        let mut visited_urls = std::collections::HashSet::new();
        visited_urls.insert(current_url.clone());

        let max_redirects = 10;
        let mut redirect_count = 0;

        loop {
            let method_enum = match Method::from_bytes(current_method.as_bytes()) {
                Ok(m) => m,
                Err(_) => Method::GET,
            };

            let mut req_builder = self.client.request(method_enum.clone(), &current_url);

            let is_multipart = if let Some(ref b) = current_body {
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

            if let Some(b) = &current_body {
                match b.active_type.as_deref() {
                    Some("none") => {
                        // Send no body
                    }
                    Some("json") => {
                        if let Some(json_str) = &b.json {
                            if !has_content_type {
                                req_builder =
                                    req_builder.header("Content-Type", "application/json");
                            }
                            req_builder = req_builder.body(json_str.clone());
                        }
                    }
                    Some("form_data") => {
                        let mut form = reqwest::multipart::Form::new();
                        if let Some(fields) = &b.form_data {
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
                                                    let mime =
                                                        mime_guess::from_path(&field.file_path)
                                                            .first_raw()
                                                            .unwrap_or("application/octet-stream");
                                                    let part =
                                                        reqwest::multipart::Part::bytes(bytes)
                                                            .file_name(file_name)
                                                            .mime_str(mime)
                                                            .unwrap_or_else(|_| {
                                                                reqwest::multipart::Part::bytes(
                                                                    vec![],
                                                                )
                                                            });
                                                    form = form.part(field.key.clone(), part);
                                                }
                                                Err(_) => {
                                                    form = form.part(
                                                        field.key.clone(),
                                                        reqwest::multipart::Part::bytes(vec![]),
                                                    );
                                                }
                                            }
                                        }
                                    } else {
                                        form = form.text(field.key.clone(), field.value.clone());
                                    }
                                }
                            }
                        }
                        req_builder = req_builder.multipart(form);
                    }
                    Some("url_encoded") => {
                        let mut params = Vec::new();
                        if let Some(fields) = &b.url_encoded {
                            for field in fields {
                                if field.enabled {
                                    params.push((field.key.clone(), field.value.clone()));
                                }
                            }
                        }
                        if !has_content_type {
                            req_builder = req_builder
                                .header("Content-Type", "application/x-www-form-urlencoded");
                        }
                        req_builder = req_builder.form(&params);
                    }
                    Some("raw") => {
                        if let Some(raw_text) = &b.raw_text {
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
                            req_builder = req_builder.body(raw_text.clone());
                        }
                    }
                    Some("file") => {
                        if let Some(file_path) = &b.file_path {
                            if !file_path.is_empty() {
                                if !has_content_type {
                                    let mime = mime_guess::from_path(file_path)
                                        .first_raw()
                                        .unwrap_or("application/octet-stream");
                                    req_builder = req_builder.header("Content-Type", mime);
                                }
                                if let Ok(bytes) = std::fs::read(file_path) {
                                    req_builder = req_builder.body(bytes);
                                }
                            }
                        }
                    }
                    _ => {
                        if let Some(text) = &b.text {
                            req_builder = req_builder.body(text.clone());
                        } else if let Some(json) = &b.json {
                            if !has_content_type {
                                req_builder =
                                    req_builder.header("Content-Type", "application/json");
                            }
                            req_builder = req_builder.body(json.clone());
                        } else if let Some(form) = &b.form {
                            req_builder = req_builder.form(form);
                        }
                    }
                }
            }

            if let Some(t) = timeout_ms {
                req_builder = req_builder.timeout(std::time::Duration::from_millis(t as u64));
            }

            let response_result = req_builder.send().await;
            let total_duration_ms = start.elapsed().as_millis() as u32;

            match response_result {
                Ok(resp) => {
                    let status = resp.status();
                    if status.is_redirection() && follow_redirects {
                        if redirect_count >= max_redirects {
                            return RequestHistoryEntry {
                                id,
                                request_name,
                                method: current_method,
                                raw_url: url.to_string(),
                                rendered_url: current_url,
                                captured_variables: BTreeMap::new(),
                                executed_at,
                                duration_ms: Some(total_duration_ms),
                                status_code: Some(status.as_u16()),
                                status_text: Some(
                                    status.canonical_reason().unwrap_or("").to_string(),
                                ),
                                response_body: None,
                                headers: BTreeMap::new(),
                                error: Some("Too many redirects".to_string()),
                                warnings: Vec::new(),
                                redirect_chain,
                            };
                        }

                        if let Some(loc_header) = resp.headers().get(reqwest::header::LOCATION) {
                            if let Ok(loc_str) = loc_header.to_str() {
                                let next_url = match Url::parse(loc_str) {
                                    Ok(parsed) => parsed.to_string(),
                                    Err(_) => {
                                        if let Ok(base) = Url::parse(&current_url) {
                                            match base.join(loc_str) {
                                                Ok(joined) => joined.to_string(),
                                                Err(_) => loc_str.to_string(),
                                            }
                                        } else {
                                            loc_str.to_string()
                                        }
                                    }
                                };

                                if visited_urls.contains(&next_url) {
                                    return RequestHistoryEntry {
                                        id,
                                        request_name,
                                        method: current_method,
                                        raw_url: url.to_string(),
                                        rendered_url: current_url,
                                        captured_variables: BTreeMap::new(),
                                        executed_at,
                                        duration_ms: Some(total_duration_ms),
                                        status_code: Some(status.as_u16()),
                                        status_text: Some(
                                            status.canonical_reason().unwrap_or("").to_string(),
                                        ),
                                        response_body: None,
                                        headers: BTreeMap::new(),
                                        error: Some(format!(
                                            "Redirect loop detected: same URL visited twice ({})",
                                            next_url
                                        )),
                                        warnings: Vec::new(),
                                        redirect_chain,
                                    };
                                }

                                visited_urls.insert(next_url.clone());
                                redirect_chain.push(crate::request::RedirectHop {
                                    method: current_method.clone(),
                                    url: current_url.clone(),
                                    status_code: status.as_u16(),
                                });

                                let next_method = match status.as_u16() {
                                    303 => {
                                        current_body = None;
                                        "GET".to_string()
                                    }
                                    301 | 302 => {
                                        if current_method == "POST" {
                                            current_body = None;
                                            "GET".to_string()
                                        } else {
                                            current_method
                                        }
                                    }
                                    _ => current_method,
                                };

                                current_method = next_method;
                                current_url = next_url;
                                redirect_count += 1;
                                continue;
                            }
                        }
                    }

                    let status_code = resp.status().as_u16();
                    let status_text = resp.status().canonical_reason().unwrap_or("").to_string();

                    let mut resp_headers = BTreeMap::new();
                    for (key, value) in resp.headers().iter() {
                        resp_headers
                            .insert(key.to_string(), value.to_str().unwrap_or("").to_string());
                    }

                    let response_body = if method_enum == Method::HEAD {
                        Some(String::new())
                    } else {
                        resp.text().await.ok()
                    };

                    return RequestHistoryEntry {
                        id,
                        request_name,
                        method: method_enum.to_string(),
                        raw_url: url.to_string(),
                        rendered_url: current_url,
                        captured_variables: BTreeMap::new(),
                        executed_at,
                        duration_ms: Some(total_duration_ms),
                        status_code: Some(status_code),
                        status_text: Some(status_text),
                        response_body,
                        headers: resp_headers,
                        error: None,
                        warnings: Vec::new(),
                        redirect_chain,
                    };
                }
                Err(e) => {
                    let err_msg = if e.is_timeout() {
                        format!("Request timed out after {} ms", timeout_ms.unwrap_or(30000))
                    } else {
                        e.to_string()
                    };

                    return RequestHistoryEntry {
                        id,
                        request_name,
                        method: current_method,
                        raw_url: url.to_string(),
                        rendered_url: current_url,
                        captured_variables: BTreeMap::new(),
                        executed_at,
                        duration_ms: Some(total_duration_ms),
                        status_code: None,
                        status_text: None,
                        response_body: None,
                        headers: BTreeMap::new(),
                        error: Some(err_msg),
                        warnings: Vec::new(),
                        redirect_chain,
                    };
                }
            }
        }
    }
}
