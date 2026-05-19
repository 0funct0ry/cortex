use hmac::{Hmac, Mac};
use reqwest::Url;
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;

type HmacSha256 = Hmac<Sha256>;

fn hmac_sha256(key: &[u8], data: &[u8]) -> Vec<u8> {
    let mut mac = HmacSha256::new_from_slice(key).expect("HMAC can take key of any size");
    mac.update(data);
    mac.finalize().into_bytes().to_vec()
}

/// Custom URI encoder compliant with AWS SigV4 specification.
/// Encodes every character except: A-Z, a-z, 0-9, '_', '-', '.', '~'.
/// Slashes '/' are encoded only if `encode_slash` is true.
fn uri_encode(s: &str, encode_slash: bool) -> String {
    let mut encoded = String::new();
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'_' | b'-' | b'.' | b'~' => {
                encoded.push(b as char);
            }
            b'/' => {
                if encode_slash {
                    encoded.push_str("%2F");
                } else {
                    encoded.push('/');
                }
            }
            _ => {
                encoded.push_str(&format!("%{:02X}", b));
            }
        }
    }
    encoded
}

/// Signs an HTTP request using AWS Signature Version 4.
/// Calculates the signature and mutates the `headers` map to inject the correct signing headers:
/// - `Authorization`
/// - `x-amz-date`
/// - `x-amz-security-token` (if `session_token` is present)
/// - `x-amz-content-sha256`
/// - `host` (derived from URL if not already present)
#[allow(clippy::too_many_arguments)]
pub fn sign_request(
    method: &str,
    url_str: &str,
    headers: &mut BTreeMap<String, String>,
    body_bytes: &[u8],
    region: &str,
    service: &str,
    access_key_id: &str,
    secret_access_key: &str,
    session_token: Option<&str>,
) -> Result<(), String> {
    let url = Url::parse(url_str).map_err(|e| format!("Invalid URL: {}", e))?;
    let host = url.host_str().ok_or_else(|| "URL has no host".to_string())?;

    // Determine host header value (including port if custom)
    let host_header_val =
        if let Some(port) = url.port() { format!("{}:{}", host, port) } else { host.to_string() };

    // Determine x-amz-date (Respect override if manually set)
    let amz_date = if let Some(d) = headers.get("x-amz-date") {
        d.clone()
    } else if let Some(d) = headers.get("X-Amz-Date") {
        d.clone()
    } else {
        chrono::Utc::now().format("%Y%m%dT%H%M%SZ").to_string()
    };

    let date_stamp = if amz_date.len() >= 8 {
        amz_date[..8].to_string()
    } else {
        chrono::Utc::now().format("%Y%m%d").to_string()
    };

    // Insert auto-generated/derived headers into our working headers map.
    // AWS headers must be lowercase in canonical headers, but we keep case-insensitive support.
    headers.insert("host".to_string(), host_header_val);
    headers.insert("x-amz-date".to_string(), amz_date.clone());

    if let Some(token) = session_token {
        if !token.trim().is_empty() {
            headers.insert("x-amz-security-token".to_string(), token.to_string());
        }
    }

    let payload_hash = format!("{:x}", Sha256::digest(body_bytes));
    headers.insert("x-amz-content-sha256".to_string(), payload_hash.clone());

    // 1. Canonical URI
    let path = url.path();
    let canonical_uri_str = if path.is_empty() || path == "/" {
        "/".to_string()
    } else {
        let mut segments = Vec::new();
        if let Some(iter) = url.path_segments() {
            for segment in iter {
                segments.push(uri_encode(segment, false));
            }
        }
        let mut joined = segments.join("/");
        if !joined.starts_with('/') {
            joined = format!("/{}", joined);
        }
        joined
    };

    // 2. Canonical Query String
    let mut query_params = Vec::new();
    for (k, v) in url.query_pairs() {
        query_params.push((k.into_owned(), v.into_owned()));
    }

    // Sort query parameters alphabetically by key, then by value
    query_params.sort_by(|a, b| {
        let cmp_k = a.0.cmp(&b.0);
        if cmp_k == std::cmp::Ordering::Equal {
            a.1.cmp(&b.1)
        } else {
            cmp_k
        }
    });

    let canonical_query_str = query_params
        .iter()
        .map(|(k, v)| format!("{}={}", uri_encode(k, true), uri_encode(v, true)))
        .collect::<Vec<String>>()
        .join("&");

    // 3. Canonical Headers & Signed Headers
    let mut canonical_headers = String::new();
    let mut signed_headers_list = Vec::new();
    for (k, v) in headers.iter() {
        let k_lower = k.to_lowercase();
        let v_trimmed = v.trim().to_string();
        let mut v_normalized = String::new();
        let mut last_was_space = false;
        for c in v_trimmed.chars() {
            if c.is_whitespace() {
                if !last_was_space {
                    v_normalized.push(' ');
                    last_was_space = true;
                }
            } else {
                v_normalized.push(c);
                last_was_space = false;
            }
        }
        canonical_headers.push_str(&format!("{}:{}\n", k_lower, v_normalized));
        signed_headers_list.push(k_lower);
    }
    signed_headers_list.sort();
    let signed_headers = signed_headers_list.join(";");

    // 4. Build Canonical Request
    let canonical_request = format!(
        "{}\n{}\n{}\n{}\n{}\n{}",
        method.to_uppercase(),
        canonical_uri_str,
        canonical_query_str,
        canonical_headers,
        signed_headers,
        payload_hash
    );

    let hashed_canonical_request = format!("{:x}", Sha256::digest(canonical_request.as_bytes()));

    // 5. String to Sign
    let credential_scope = format!("{}/{}/{}/aws4_request", date_stamp, region, service);

    let string_to_sign = format!(
        "AWS4-HMAC-SHA256\n{}\n{}\n{}",
        amz_date, credential_scope, hashed_canonical_request
    );

    // 6. Signing Key Derivation
    let secret_key = format!("AWS4{}", secret_access_key);
    let k_date = hmac_sha256(secret_key.as_bytes(), date_stamp.as_bytes());
    let k_region = hmac_sha256(&k_date, region.as_bytes());
    let k_service = hmac_sha256(&k_region, service.as_bytes());
    let k_signing = hmac_sha256(&k_service, b"aws4_request");

    // 7. Calculate Signature
    let signature_bytes = hmac_sha256(&k_signing, string_to_sign.as_bytes());
    let signature = signature_bytes.iter().map(|b| format!("{:02x}", b)).collect::<String>();

    // 8. Authorization Header
    let auth_header = format!(
        "AWS4-HMAC-SHA256 Credential={}/{}, SignedHeaders={}, Signature={}",
        access_key_id, credential_scope, signed_headers, signature
    );

    headers.insert("Authorization".to_string(), auth_header);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_aws_sigv4_canonical_get() {
        let mut headers = BTreeMap::new();
        headers.insert("x-amz-date".to_string(), "20150830T123600Z".to_string());

        let res = sign_request(
            "GET",
            "https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08",
            &mut headers,
            b"",
            "us-east-1",
            "iam",
            "AKIDEXAMPLE",
            "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
            None,
        );

        assert!(res.is_ok());
        let auth = headers.get("Authorization").unwrap();
        assert!(auth.starts_with("AWS4-HMAC-SHA256"));
        assert!(auth.contains("Credential=AKIDEXAMPLE/20150830/us-east-1/iam/aws4_request"));
        assert!(auth.contains("SignedHeaders=host;x-amz-content-sha256;x-amz-date"));
        assert!(auth.contains(
            "Signature=65f031d93b4631aedf16a8f7f830cdc8ce2bc5276c307b5a2cc2143d4b68e323"
        ));
    }
}
