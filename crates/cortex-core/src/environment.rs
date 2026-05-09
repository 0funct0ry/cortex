use crate::crypto::{self, CryptoError};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct EnvironmentFile {
    /// Schema version (e.g., "1")
    pub version: String,
    /// Human-readable name of the environment
    pub name: String,
    /// List of environment variables
    pub variables: Vec<EnvironmentVariable>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct EnvironmentVariable {
    /// Variable name
    pub name: String,
    /// Variable value (plaintext or encrypted)
    pub value: String,
    /// Whether the value should be treated as a secret
    #[serde(default, skip_serializing_if = "is_false")]
    pub secret: bool,
}

fn is_false(b: &bool) -> bool {
    !*b
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
            if var.secret && !var.value.starts_with(crypto::PREFIX) {
                var.value = crypto::encrypt(&var.value, key)?;
            }
        }
        Ok(())
    }

    /// Decrypts all variables marked as secrets.
    pub fn decrypt_secrets(&mut self, key: &[u8; 32]) -> Result<(), CryptoError> {
        for var in &mut self.variables {
            if var.secret && var.value.starts_with(crypto::PREFIX) {
                var.value = crypto::decrypt(&var.value, key)?;
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_environment_serialization() {
        let mut env = EnvironmentFile::new("production".to_string());
        env.variables.push(EnvironmentVariable {
            name: "API_URL".to_string(),
            value: "https://api.example.com".to_string(),
            secret: false,
        });
        env.variables.push(EnvironmentVariable {
            name: "API_KEY".to_string(),
            value: "super-secret-token".to_string(),
            secret: true,
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
        env.variables.push(EnvironmentVariable {
            name: "PASSWORD".to_string(),
            value: "mypassword".to_string(),
            secret: true,
        });

        // Encrypt
        env.encrypt_secrets(&key).unwrap();
        assert!(env.variables[0].value.starts_with(crypto::PREFIX));
        assert!(!env.variables[0].value.contains("mypassword"));

        // Serialize/Deserialize
        let yaml = env.to_yaml().unwrap();
        let mut decoded = EnvironmentFile::from_yaml(&yaml).unwrap();

        // Decrypt
        decoded.decrypt_secrets(&key).unwrap();
        assert_eq!(decoded.variables[0].value, "mypassword");
    }

    #[test]
    fn test_mixed_variables() {
        let key = [0u8; 32];
        let mut env = EnvironmentFile::new("mixed".to_string());
        env.variables.push(EnvironmentVariable {
            name: "PUBLIC".to_string(),
            value: "public_val".to_string(),
            secret: false,
        });
        env.variables.push(EnvironmentVariable {
            name: "PRIVATE".to_string(),
            value: "private_val".to_string(),
            secret: true,
        });

        env.encrypt_secrets(&key).unwrap();

        assert_eq!(env.variables[0].value, "public_val");
        assert!(env.variables[1].value.starts_with(crypto::PREFIX));

        let yaml = env.to_yaml().unwrap();
        assert!(yaml.contains("public_val"));
        assert!(!yaml.contains("private_val"));
    }
}
