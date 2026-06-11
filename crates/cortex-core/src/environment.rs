use crate::crypto::{self, CryptoError};
use serde::{Deserialize, Serialize};
use specta::Type;

/// Records a variable whose encrypted value could not be decrypted (e.g. due to tampering).
#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct DecryptFailure {
    pub variable_name: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct EnvironmentFile {
    /// Schema version (e.g., "1")
    pub version: String,
    /// Human-readable name of the environment
    pub name: String,
    /// List of environment variables
    pub variables: Vec<crate::variables::Variable>,
}

impl EnvironmentFile {
    pub fn new(name: String) -> Self {
        Self { version: "1".to_string(), name, variables: Vec::new() }
    }

    /// Serializes the environment to a YAML string.
    pub fn to_yaml(&self) -> Result<String, serde_yaml::Error> {
        serde_yaml::to_string(self)
    }

    /// Deserializes an environment from a YAML string.
    pub fn from_yaml(yaml: &str) -> Result<Self, serde_yaml::Error> {
        serde_yaml::from_str(yaml)
    }

    /// Encrypts all variables marked as secrets that are not already encrypted.
    pub fn encrypt_secrets(&mut self, key: &[u8; 32]) -> Result<(), CryptoError> {
        for var in &mut self.variables {
            if var.secret {
                let s = match &var.value {
                    serde_json::Value::String(str_val) => str_val.clone(),
                    other => serde_json::to_string(other).unwrap_or_default(),
                };
                if !s.starts_with(crypto::PREFIX) {
                    let encrypted = crypto::encrypt(&s, key)?;
                    var.value = serde_json::Value::String(encrypted);
                }
            }
        }
        Ok(())
    }

    /// Decrypts all variables marked as secrets.
    /// Returns a list of variables that failed decryption (e.g. due to tampering).
    /// Failed variables retain their raw encrypted string so re-saving preserves them unchanged.
    pub fn decrypt_secrets(&mut self, key: &[u8; 32]) -> Vec<DecryptFailure> {
        let mut failures = Vec::new();
        for var in &mut self.variables {
            if var.secret {
                if let serde_json::Value::String(s) = &var.value {
                    if s.starts_with(crypto::PREFIX) {
                        match crypto::decrypt(s, key) {
                            Ok(decrypted) => {
                                var.value = serde_json::from_str(&decrypted)
                                    .unwrap_or(serde_json::Value::String(decrypted));
                            }
                            Err(_) => {
                                failures.push(DecryptFailure {
                                    variable_name: var.name.clone(),
                                    message: "Decryption failed — this value may have been tampered with.".to_string(),
                                });
                            }
                        }
                    }
                }
            }
        }
        failures
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_environment_serialization() {
        let mut env = EnvironmentFile::new("production".to_string());
        env.variables.push(crate::variables::Variable {
            name: "API_URL".to_string(),
            value: serde_json::json!("https://api.example.com"),
            secret: false,
            enabled: true,
            prompt: false,
            description: None,
        });
        env.variables.push(crate::variables::Variable {
            name: "API_KEY".to_string(),
            value: serde_json::json!("super-secret-token"),
            secret: true,
            enabled: true,
            prompt: false,
            description: None,
        });

        let yaml = env.to_yaml().unwrap();
        assert!(yaml.contains("name: production"));
        assert!(yaml.contains("API_URL"));
        assert!(yaml.contains("super-secret-token"));
        assert!(yaml.contains("secret: true"));
    }

    #[test]
    fn test_encryption_roundtrip() {
        let key = [0u8; 32];
        let mut env = EnvironmentFile::new("test".to_string());
        env.variables.push(crate::variables::Variable {
            name: "PASSWORD".to_string(),
            value: serde_json::json!("mypassword"),
            secret: true,
            enabled: true,
            prompt: false,
            description: None,
        });

        // Encrypt
        env.encrypt_secrets(&key).unwrap();
        if let serde_json::Value::String(s) = &env.variables[0].value {
            assert!(s.starts_with(crypto::PREFIX));
            assert!(!s.contains("mypassword"));
        } else {
            panic!("Expected String value");
        }

        // Serialize/Deserialize
        let yaml = env.to_yaml().unwrap();
        let mut decoded = EnvironmentFile::from_yaml(&yaml).unwrap();

        // Decrypt
        let failures = decoded.decrypt_secrets(&key);
        assert!(failures.is_empty());
        assert_eq!(decoded.variables[0].value, serde_json::json!("mypassword"));
    }

    #[test]
    fn test_mixed_variables() {
        let key = [0u8; 32];
        let mut env = EnvironmentFile::new("mixed".to_string());
        env.variables.push(crate::variables::Variable {
            name: "PUBLIC".to_string(),
            value: serde_json::json!("public_val"),
            secret: false,
            enabled: true,
            prompt: false,
            description: None,
        });
        env.variables.push(crate::variables::Variable {
            name: "PRIVATE".to_string(),
            value: serde_json::json!("private_val"),
            secret: true,
            enabled: true,
            prompt: false,
            description: None,
        });

        env.encrypt_secrets(&key).unwrap();

        assert_eq!(env.variables[0].value, serde_json::json!("public_val"));
        if let serde_json::Value::String(s) = &env.variables[1].value {
            assert!(s.starts_with(crypto::PREFIX));
        } else {
            panic!("Expected String value");
        }

        let yaml = env.to_yaml().unwrap();
        assert!(yaml.contains("public_val"));
        assert!(!yaml.contains("private_val"));
    }

    #[test]
    fn test_tampered_secret_returns_failure() {
        let key = [0u8; 32];
        let mut env = EnvironmentFile::new("tamper-test".to_string());
        // A syntactically valid ENC prefix but corrupted base64 payload
        env.variables.push(crate::variables::Variable {
            name: "BAD_SECRET".to_string(),
            value: serde_json::json!("ENC(v1:aGVsbG8tdGhpcy1pcy10YW1wZXJlZA==)"),
            secret: true,
            enabled: true,
            prompt: false,
            description: None,
        });
        env.variables.push(crate::variables::Variable {
            name: "GOOD_VAR".to_string(),
            value: serde_json::json!("not-a-secret"),
            secret: false,
            enabled: true,
            prompt: false,
            description: None,
        });

        let failures = env.decrypt_secrets(&key);

        // One failure for the tampered variable
        assert_eq!(failures.len(), 1);
        assert_eq!(failures[0].variable_name, "BAD_SECRET");

        // Tampered variable retains raw encrypted string (not modified)
        assert_eq!(
            env.variables[0].value,
            serde_json::json!("ENC(v1:aGVsbG8tdGhpcy1pcy10YW1wZXJlZA==)")
        );

        // Non-secret variable is untouched
        assert_eq!(env.variables[1].value, serde_json::json!("not-a-secret"));
    }
}
