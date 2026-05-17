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

        for (key, value) in headers {
            req_builder = req_builder.header(key, value);
        }

        if let Some(b) = body {
            if let Some(text) = b.text {
                req_builder = req_builder.body(text);
            } else if let Some(json) = b.json {
                req_builder = req_builder.header("Content-Type", "application/json");
                req_builder = req_builder.body(json);
            } else if let Some(form) = b.form {
                req_builder = req_builder.form(&form);
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
