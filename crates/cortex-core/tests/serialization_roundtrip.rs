use cortex_core::collection::CollectionManifest;
use cortex_core::environment::EnvironmentFile;
use cortex_core::request::{AuthRef, RequestBody, RequestFile, Scripts, Settings};
use cortex_core::variables::Variable;
use cortex_core::workspace::WorkspaceManifest;
use std::collections::BTreeMap;

#[test]
fn test_request_file_roundtrip() {
    let mut headers = BTreeMap::new();
    headers.insert("Content-Type".to_string(), "application/json".to_string());
    headers.insert("X-Custom-Header".to_string(), "Value with Unicode: 🚀".to_string());
    headers.insert("Special-Chars".to_string(), "!@#$%^&*()_+=-`~[]\\{}|;':\",./<>?".to_string());

    let mut params = BTreeMap::new();
    params.insert("q".to_string(), "rust serialization".to_string());
    params.insert("lang".to_string(), "🦀".to_string());

    let mut auth_config = BTreeMap::new();
    auth_config.insert("token".to_string(), "{{SECRET_TOKEN}}".to_string());

    let long_string = "A".repeat(10000);

    let mut req = RequestFile::new(
        "Complex Request 🚀".to_string(),
        "POST".to_string(),
        "https://api.example.com/v1/{{resource}}?debug=true".to_string(),
    );
    req.headers = Some(headers);
    req.params = Some(params);
    req.body = Some(RequestBody::Json(format!("{{\"data\": \"{}\"}}", long_string)));
    req.auth = Some(AuthRef { r#type: "bearer".to_string(), config: auth_config });
    req.scripts = Some(Scripts {
        pre: Some("// Pre-request script\nconst x = 'colons: are: tricky';\nconst y = \"dashes-too\";\nconsole.log(x, y);".to_string()),
        post: Some("/* Post-response */\nif (response.status === 200) {\n  // do something\n}".to_string()),
    });
    req.tests = Some(
        "assert(response.status < 400);\n// More tests with 'quotes' and \"double quotes\""
            .to_string(),
    );
    req.tags = Some(vec![
        "test".to_string(),
        "unicode-🚀".to_string(),
        "very-long-tag-".to_string() + &"a".repeat(100),
    ]);
    req.settings = Some(Settings { timeout: Some(5000) });

    let yaml = req.to_yaml().expect("Failed to serialize RequestFile");
    let decoded: RequestFile =
        RequestFile::from_yaml(&yaml).expect("Failed to deserialize RequestFile");

    assert_eq!(req, decoded);
}

#[test]
fn test_collection_manifest_roundtrip() {
    let mut variables = Vec::new();
    variables.push(Variable {
        name: "base_url".to_string(),
        value: "https://api.example.com".to_string(),
        secret: false,
        enabled: true,
    });
    variables.push(Variable {
        name: "api_key".to_string(),
        value: "secret-123".to_string(),
        secret: true,
        enabled: true,
    });

    let mut headers = BTreeMap::new();
    headers.insert("User-Agent".to_string(), "Cortex/1.0".to_string());

    let manifest = CollectionManifest {
        version: "1".to_string(),
        name: "Test Collection 📁".to_string(),
        description: Some("A collection with Unicode 🚀 and special chars: : - \" '".to_string()),
        auth: Some(AuthRef {
            r#type: "basic".to_string(),
            config: {
                let mut m = BTreeMap::new();
                m.insert("username".to_string(), "admin".to_string());
                m
            },
        }),
        headers: Some(headers),
        variables: Some(variables),
    };

    let yaml = manifest.to_yaml().expect("Failed to serialize CollectionManifest");
    let decoded =
        CollectionManifest::from_yaml(&yaml).expect("Failed to deserialize CollectionManifest");

    assert_eq!(manifest, decoded);
}

#[test]
fn test_environment_file_roundtrip_with_secrets() {
    let key = [0u8; 32]; // Test key
    let mut env = EnvironmentFile::new("Production 🌍".to_string());

    env.variables.push(Variable {
        name: "PUBLIC_URL".to_string(),
        value: "https://api.production.com".to_string(),
        secret: false,
        enabled: true,
    });

    let original_secret = "super-secret-password-🚀-!@#";
    env.variables.push(Variable {
        name: "DB_PASSWORD".to_string(),
        value: original_secret.to_string(),
        secret: true,
        enabled: true,
    });

    // 1. Encrypt secrets before serialization
    env.encrypt_secrets(&key).expect("Encryption failed");
    assert!(env.variables[1].value.starts_with("ENC(v1:"));
    assert!(!env.variables[1].value.contains(original_secret));

    // 2. Serialize to YAML
    let yaml = env.to_yaml().expect("Failed to serialize EnvironmentFile");

    // 3. Deserialize from YAML
    let mut decoded =
        EnvironmentFile::from_yaml(&yaml).expect("Failed to deserialize EnvironmentFile");
    assert_eq!(env, decoded);
    assert!(decoded.variables[1].value.starts_with("ENC(v1:"));

    // 4. Decrypt secrets
    decoded.decrypt_secrets(&key).expect("Decryption failed");
    assert_eq!(decoded.variables[0].value, "https://api.production.com");
    assert_eq!(decoded.variables[1].value, original_secret);
}

#[test]
fn test_workspace_manifest_roundtrip() {
    let mut variables = Vec::new();
    variables.push(Variable {
        name: "global_var".to_string(),
        value: "global_val".to_string(),
        secret: false,
        enabled: true,
    });

    let manifest = WorkspaceManifest {
        version: "1".to_string(),
        name: "Main Workspace 🛠️".to_string(),
        collections: vec![
            "./collections/api-tests".to_string(),
            "../other-project/cortex-collection".to_string(),
            "/absolute/path/to/collection".to_string(),
            "./unicode-🚀-path".to_string(),
        ],
        variables: Some(variables),
    };

    let yaml = manifest.to_yaml().expect("Failed to serialize WorkspaceManifest");
    let decoded =
        WorkspaceManifest::from_yaml(&yaml).expect("Failed to deserialize WorkspaceManifest");

    assert_eq!(manifest, decoded);
}

#[test]
fn test_empty_optional_fields_roundtrip() {
    // RequestFile with only required fields
    let req =
        RequestFile::new("Minimal".to_string(), "GET".to_string(), "http://localhost".to_string());
    let yaml = req.to_yaml().unwrap();
    let decoded = RequestFile::from_yaml(&yaml).unwrap();
    assert_eq!(req, decoded);

    // CollectionManifest with only required fields
    let manifest = CollectionManifest::new("Minimal Collection".to_string());
    let yaml = manifest.to_yaml().unwrap();
    let decoded = CollectionManifest::from_yaml(&yaml).unwrap();
    assert_eq!(manifest, decoded);

    // WorkspaceManifest with only required fields
    let ws = WorkspaceManifest::new("Minimal Workspace".to_string());
    let yaml = ws.to_yaml().unwrap();
    let decoded = WorkspaceManifest::from_yaml(&yaml).unwrap();
    assert_eq!(ws, decoded);
}
