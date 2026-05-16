use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;

/// Represents the structure of a `.crx` request file.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct RequestFile {
    /// Schema version (e.g., "1")
    pub version: String,
    /// Human-readable name of the request
    pub name: String,
    /// HTTP method (e.g., GET, POST, PUT, DELETE)
    pub method: String,
    /// Request URL (may contain environment variables)
    pub url: String,
    /// HTTP headers
    #[serde(skip_serializing_if = "Option::is_none")]
    pub headers: Option<BTreeMap<String, String>>,
    /// Query parameters
    #[serde(skip_serializing_if = "Option::is_none")]
    pub params: Option<BTreeMap<String, String>>,
    /// Request body
    #[serde(skip_serializing_if = "Option::is_none")]
    pub body: Option<RequestBody>,
    /// Authentication configuration
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auth: Option<AuthRef>,
    /// Pre-request and post-response scripts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scripts: Option<Scripts>,
    /// Test scripts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tests: Option<String>,
    /// Tags for categorization
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    /// Per-request settings
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<Settings>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type, Default)]
#[serde(deny_unknown_fields)]
pub struct RequestBody {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub json: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub form: Option<BTreeMap<String, String>>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct AuthRef {
    pub r#type: String,
    #[serde(flatten)]
    pub config: BTreeMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct Scripts {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pre: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub post: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct Settings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<u32>,
}

impl RequestFile {
    pub fn new(name: String, method: String, url: String) -> Self {
        Self {
            version: "1".to_string(),
            name,
            method,
            url,
            headers: None,
            params: None,
            body: None,
            auth: None,
            scripts: None,
            tests: None,
            tags: None,
            settings: None,
        }
    }

    /// Serializes the request to a YAML string.
    pub fn to_yaml(&self) -> Result<String, serde_yaml::Error> {
        serde_yaml::to_string(self)
    }

    /// Deserializes a request from a YAML string.
    pub fn from_yaml(yaml: &str) -> Result<Self, serde_yaml::Error> {
        serde_yaml::from_str(yaml)
    }
}

/// Represents an executed request log entry captured in history.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct RequestHistoryEntry {
    pub id: String,
    pub request_name: String,
    pub method: String,
    pub raw_url: String,
    pub rendered_url: String,
    /// Variables resolved and captured during execution/rendering
    pub captured_variables: BTreeMap<String, String>,
    pub executed_at: String, // ISO 8601 timestamp
    pub duration_ms: Option<u32>,
    pub status_code: Option<u16>,
    pub status_text: Option<String>,
    pub response_body: Option<String>,
    #[serde(default)]
    pub headers: BTreeMap<String, String>,
    pub error: Option<String>,
    #[serde(default)]
    pub warnings: Vec<String>,
}

impl RequestHistoryEntry {
    pub fn now_iso() -> String {
        chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string()
    }

    pub fn random_id() -> String {
        let mut rng = rand::thread_rng();
        format!("hist_{}", rand::Rng::gen_range(&mut rng, 100000..999999))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_serialization_omits_optional_fields() {
        let req = RequestFile::new(
            "Test Request".to_string(),
            "GET".to_string(),
            "https://example.com".to_string(),
        );
        let yaml = req.to_yaml().unwrap();

        assert!(!yaml.contains("headers:"));
        assert!(!yaml.contains("body:"));
        assert!(
            yaml.contains("version: \"1\"")
                || yaml.contains("version: '1'")
                || yaml.contains("version: 1")
        );
        assert!(yaml.contains("name: Test Request"));
    }

    #[test]
    fn test_deterministic_serialization() {
        let mut headers1 = BTreeMap::new();
        headers1.insert("Z-Header".to_string(), "Value1".to_string());
        headers1.insert("A-Header".to_string(), "Value2".to_string());

        let mut req1 = RequestFile::new("Test".to_string(), "GET".to_string(), "URL".to_string());
        req1.headers = Some(headers1);

        let yaml1 = req1.to_yaml().unwrap();

        let mut headers2 = BTreeMap::new();
        headers2.insert("A-Header".to_string(), "Value2".to_string());
        headers2.insert("Z-Header".to_string(), "Value1".to_string());

        let mut req2 = RequestFile::new("Test".to_string(), "GET".to_string(), "URL".to_string());
        req2.headers = Some(headers2);

        let yaml2 = req2.to_yaml().unwrap();

        assert_eq!(yaml1, yaml2);
        // Verify A comes before Z in output
        assert!(yaml1.find("A-Header").unwrap() < yaml1.find("Z-Header").unwrap());
    }

    #[test]
    fn test_deserialization_validation_error() {
        let yaml = "
version: \"1\"
name: \"Invalid\"
method: \"GET\"
url: \"https://example.com\"
unknown_field: \"should fail\"
";
        let result = RequestFile::from_yaml(yaml);
        assert!(result.is_err());
        let err = result.err().unwrap();
        assert!(err.to_string().contains("unknown field `unknown_field`"));
    }

    #[test]
    fn test_full_roundtrip() {
        let mut headers = BTreeMap::new();
        headers.insert("Content-Type".to_string(), "application/json".to_string());

        let mut params = BTreeMap::new();
        params.insert("id".to_string(), "123".to_string());

        let mut req = RequestFile::new(
            "Full Request".to_string(),
            "POST".to_string(),
            "https://api.example.com".to_string(),
        );
        req.headers = Some(headers);
        req.params = Some(params);
        req.body = Some(RequestBody {
            json: Some("{\"key\": \"value\"}".to_string()),
            ..Default::default()
        });
        req.auth = Some(AuthRef {
            r#type: "bearer".to_string(),
            config: {
                let mut m = BTreeMap::new();
                m.insert("token".to_string(), "secret".to_string());
                m
            },
        });
        req.scripts = Some(Scripts { pre: Some("console.log('pre')".to_string()), post: None });
        req.tags = Some(vec!["test".to_string(), "api".to_string()]);
        req.settings = Some(Settings { timeout: Some(30) });

        let yaml = req.to_yaml().unwrap();
        let decoded: RequestFile = RequestFile::from_yaml(&yaml).unwrap();

        assert_eq!(req, decoded);
    }
}
