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
        digest_auth: Option<(String, String)>,
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

        let mut digest_header_val: Option<String> = None;
        let mut digest_attempted = false;

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
                if key.eq_ignore_ascii_case("authorization") && digest_header_val.is_some() {
                    continue; // Skip user-provided auth if we are injecting our calculated digest header
                }
                req_builder = req_builder.header(key, value);
            }

            if let Some(ref dh) = digest_header_val {
                req_builder = req_builder.header("Authorization", dh);
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

                    // Transparent Digest challenge-response handshake
                    if status == reqwest::StatusCode::UNAUTHORIZED
                        && digest_auth.is_some()
                        && !digest_attempted
                    {
                        if let Some(auth_header) =
                            resp.headers().get(reqwest::header::WWW_AUTHENTICATE)
                        {
                            if let Ok(auth_str) = auth_header.to_str() {
                                if auth_str.to_lowercase().starts_with("digest ") {
                                    if let Some(challenge) = parse_digest_challenge(auth_str) {
                                        let cnonce = format!("{:x}", rand::random::<u32>());
                                        let nc = 1;
                                        let method_str = method_enum.to_string();
                                        let uri = if let Ok(parsed) = Url::parse(&current_url) {
                                            if let Some(q) = parsed.query() {
                                                format!("{}?{}", parsed.path(), q)
                                            } else {
                                                parsed.path().to_string()
                                            }
                                        } else {
                                            "/".to_string()
                                        };
                                        if let Some((uname, pwd)) = digest_auth.as_ref() {
                                            if let Some(digest_header) = compute_digest_response(
                                                uname,
                                                pwd,
                                                &method_str,
                                                &uri,
                                                &challenge,
                                                nc,
                                                &cnonce,
                                            ) {
                                                digest_header_val = Some(digest_header);
                                                digest_attempted = true;
                                                continue; // Retry the request with Authorization header
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

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

fn parse_digest_challenge(header_val: &str) -> Option<BTreeMap<String, String>> {
    if !header_val.to_lowercase().starts_with("digest ") {
        return None;
    }
    let mut params = BTreeMap::new();
    let challenge = &header_val[7..];

    let mut chars = challenge.chars().peekable();
    while let Some(c) = chars.next() {
        if c.is_whitespace() {
            continue;
        }
        let mut key = String::new();
        key.push(c);
        while let Some(&next_c) = chars.peek() {
            if next_c == '=' {
                chars.next();
                break;
            }
            key.push(chars.next().unwrap());
        }
        let key = key.trim().to_string();

        let mut value = String::new();
        let mut in_quotes = false;
        while let Some(&next_c) = chars.peek() {
            if next_c == '"' {
                in_quotes = !in_quotes;
                chars.next();
            } else if next_c == ',' && !in_quotes {
                chars.next();
                break;
            } else {
                value.push(chars.next().unwrap());
            }
        }
        params.insert(key, value.trim().to_string());
    }
    Some(params)
}

fn compute_digest_response(
    username: &str,
    password: &str,
    method: &str,
    uri: &str,
    challenge: &BTreeMap<String, String>,
    nc: u32,
    cnonce: &str,
) -> Option<String> {
    let realm = challenge.get("realm")?;
    let nonce = challenge.get("nonce")?;
    let opaque = challenge.get("opaque");
    let algorithm = challenge.get("algorithm").map(|s| s.as_str()).unwrap_or("MD5");
    let qop = challenge.get("qop");

    let ha1_base = format!("{}:{}:{}", username, realm, password);
    let ha1_hash = format!("{:x}", md5::compute(ha1_base.as_bytes()));
    let ha1 = if algorithm.eq_ignore_ascii_case("md5-sess") {
        let sess_base = format!("{}:{}:{}", ha1_hash, nonce, cnonce);
        format!("{:x}", md5::compute(sess_base.as_bytes()))
    } else {
        ha1_hash
    };

    let ha2_base = format!("{}:{}", method, uri);
    let ha2 = format!("{:x}", md5::compute(ha2_base.as_bytes()));

    let nc_str = format!("{:08x}", nc);
    let response = if let Some(qop_val) = qop {
        if qop_val == "auth" || qop_val == "auth-int" {
            let resp_base = format!("{}:{}:{}:{}:{}:{}", ha1, nonce, nc_str, cnonce, qop_val, ha2);
            format!("{:x}", md5::compute(resp_base.as_bytes()))
        } else {
            let resp_base = format!("{}:{}:{}", ha1, nonce, ha2);
            format!("{:x}", md5::compute(resp_base.as_bytes()))
        }
    } else {
        let resp_base = format!("{}:{}:{}", ha1, nonce, ha2);
        format!("{:x}", md5::compute(resp_base.as_bytes()))
    };

    let mut parts = vec![
        format!("username=\"{}\"", username),
        format!("realm=\"{}\"", realm),
        format!("nonce=\"{}\"", nonce),
        format!("uri=\"{}\"", uri),
        format!("response=\"{}\"", response),
    ];

    if let Some(alg) = challenge.get("algorithm") {
        parts.push(format!("algorithm={}", alg));
    }
    if let Some(op) = opaque {
        parts.push(format!("opaque=\"{}\"", op));
    }
    if let Some(qop_val) = qop {
        parts.push(format!("qop={}", qop_val));
        parts.push(format!("nc={}", nc_str));
        parts.push(format!("cnonce=\"{}\"", cnonce));
    }

    Some(format!("Digest {}", parts.join(", ")))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_digest_challenge() {
        let header = "Digest realm=\"MIA\", nonce=\"abcd\", qop=\"auth\", opaque=\"xyz\"";
        let parsed = parse_digest_challenge(header).unwrap();
        assert_eq!(parsed.get("realm").unwrap(), "MIA");
        assert_eq!(parsed.get("nonce").unwrap(), "abcd");
        assert_eq!(parsed.get("qop").unwrap(), "auth");
        assert_eq!(parsed.get("opaque").unwrap(), "xyz");

        let header_unquoted = "Digest realm=MIA, nonce=1234, algorithm=MD5";
        let parsed_unquoted = parse_digest_challenge(header_unquoted).unwrap();
        assert_eq!(parsed_unquoted.get("realm").unwrap(), "MIA");
        assert_eq!(parsed_unquoted.get("nonce").unwrap(), "1234");
        assert_eq!(parsed_unquoted.get("algorithm").unwrap(), "MD5");
    }

    #[test]
    fn test_compute_digest_response() {
        let mut challenge = BTreeMap::new();
        challenge.insert("realm".to_string(), "test_realm".to_string());
        challenge.insert("nonce".to_string(), "test_nonce".to_string());
        challenge.insert("qop".to_string(), "auth".to_string());
        challenge.insert("opaque".to_string(), "test_opaque".to_string());

        let res = compute_digest_response(
            "user1",
            "pass1",
            "GET",
            "/api/v1/test",
            &challenge,
            1,
            "client_nonce_val",
        )
        .unwrap();

        assert!(res.contains("username=\"user1\""));
        assert!(res.contains("realm=\"test_realm\""));
        assert!(res.contains("nonce=\"test_nonce\""));
        assert!(res.contains("uri=\"/api/v1/test\""));
        assert!(res.contains("response="));
        assert!(res.contains("qop=auth"));
        assert!(res.contains("nc=00000001"));
        assert!(res.contains("cnonce=\"client_nonce_val\""));
    }
}
