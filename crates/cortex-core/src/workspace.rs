use crate::collection::{Collection, CollectionError};
use crate::environment::DecryptFailure;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

/// Represents the structure of a `cortex-workspace.yaml` file.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct WorkspaceManifest {
    /// Schema version (e.g., "1")
    pub version: String,
    /// Human-readable name of the workspace
    pub name: String,
    /// List of paths to collection directories (relative to workspace file or absolute)
    pub collections: Vec<String>,
    /// Global variables for the workspace
    #[serde(skip_serializing_if = "Option::is_none")]
    pub variables: Option<Vec<crate::variables::Variable>>,
    /// Environments for the workspace
    #[serde(skip_serializing_if = "Option::is_none")]
    pub environments: Option<Vec<crate::environment::EnvironmentFile>>,
    /// Paths to .env files referenced by this workspace
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub env_files: Option<Vec<String>>,
}

impl WorkspaceManifest {
    pub fn new(name: String) -> Self {
        Self {
            version: "1".to_string(),
            name,
            collections: Vec::new(),
            variables: None,
            environments: None,
            env_files: None,
        }
    }

    /// Serializes the manifest to a YAML string.
    pub fn to_yaml(&self) -> Result<String, serde_yaml::Error> {
        serde_yaml::to_string(self)
    }

    /// Deserializes a manifest from a YAML string.
    pub fn from_yaml(yaml: &str) -> Result<Self, serde_yaml::Error> {
        serde_yaml::from_str(yaml)
    }

    /// Encrypts all variables marked as secrets that are not already encrypted.
    pub fn encrypt_secrets(&mut self, key: &[u8; 32]) -> Result<(), crate::crypto::CryptoError> {
        if let Some(vars) = &mut self.variables {
            for var in vars {
                if var.secret {
                    let s = match &var.value {
                        serde_json::Value::String(str_val) => str_val.clone(),
                        other => serde_json::to_string(other).unwrap_or_default(),
                    };
                    if !s.starts_with(crate::crypto::PREFIX) {
                        let encrypted = crate::crypto::encrypt(&s, key)?;
                        var.value = serde_json::Value::String(encrypted);
                    }
                }
            }
        }
        Ok(())
    }

    /// Decrypts all variables marked as secrets.
    /// Returns a list of variables that failed decryption (e.g. due to tampering).
    pub fn decrypt_secrets(&mut self, key: &[u8; 32]) -> Vec<DecryptFailure> {
        let Some(vars) = &mut self.variables else { return Vec::new() };
        let mut failures = Vec::new();
        for var in vars {
            if var.secret {
                if let serde_json::Value::String(s) = &var.value {
                    if s.starts_with(crate::crypto::PREFIX) {
                        match crate::crypto::decrypt(s, key) {
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

    /// Saves the manifest to a file.
    pub fn save<P: AsRef<Path>>(&self, path: P) -> Result<(), std::io::Error> {
        let path = path.as_ref();

        let mut manifest = self.clone();
        let key = crate::crypto::get_app_key();
        manifest.encrypt_secrets(&key).map_err(std::io::Error::other)?;

        let yaml = manifest
            .to_yaml()
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;
        fs::write(path, yaml)?;

        // Ensure .gitignore exists in the same directory
        if let Some(parent) = path.parent() {
            let _ = crate::gitignore::GitIgnoreManager::ensure_gitignore(parent);
        }

        Ok(())
    }

    /// Adds a collection path to the manifest if it doesn't already exist.
    pub fn add_collection(&mut self, path: String) {
        if !self.collections.contains(&path) {
            self.collections.push(path);
        }
    }

    /// Removes a collection path from the manifest.
    pub fn remove_collection(&mut self, path: &str) {
        self.collections.retain(|c| c != path);
    }
}

/// Represents a loaded workspace and its collections.
#[derive(Debug)]
pub struct Workspace {
    /// Absolute path to the workspace file
    pub path: PathBuf,
    /// The workspace manifest
    pub manifest: WorkspaceManifest,
    /// Loaded collections or errors for each path defined in the manifest
    pub collections: Vec<(String, Result<Collection, CollectionError>)>,
    /// Loaded environments
    pub environments: Vec<crate::environment::EnvironmentFile>,
    /// Per-environment decrypt failures: env name → list of failed variables
    pub environment_decrypt_failures: HashMap<String, Vec<DecryptFailure>>,
}

impl Workspace {
    /// Loads a workspace from a YAML file.
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self, std::io::Error> {
        let path = path.as_ref().to_path_buf();
        let mut absolute_path =
            if path.is_absolute() { path.clone() } else { std::env::current_dir()?.join(&path) };

        if absolute_path.is_dir() {
            absolute_path = absolute_path.join("cortex-workspace.yaml");
        }

        let content = fs::read_to_string(&absolute_path)?;
        let mut manifest: WorkspaceManifest = serde_yaml::from_str(&content)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;

        // Decrypt secrets
        let key = crate::crypto::get_app_key();
        let _ = manifest.decrypt_secrets(&key);

        let workspace_dir = absolute_path.parent().unwrap_or(Path::new("."));

        let collections = manifest
            .collections
            .iter()
            .map(|col_path_str| {
                let col_path = Path::new(col_path_str);
                let full_col_path = if col_path.is_absolute() {
                    col_path.to_path_buf()
                } else {
                    workspace_dir.join(col_path)
                };

                (col_path_str.clone(), Collection::load(full_col_path))
            })
            .collect();

        // Load environments
        let mut environments = Vec::new();
        let mut environment_decrypt_failures: HashMap<String, Vec<DecryptFailure>> = HashMap::new();
        let env_dir = workspace_dir.join("environments");
        if env_dir.exists() && env_dir.is_dir() {
            if let Ok(entries) = fs::read_dir(env_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_file()
                        && (path.extension().is_some_and(|ext| ext == "yaml" || ext == "yml"))
                    {
                        if let Ok(content) = fs::read_to_string(&path) {
                            if let Ok(mut env) =
                                crate::environment::EnvironmentFile::from_yaml(&content)
                            {
                                let key = crate::crypto::get_app_key();
                                let failures = env.decrypt_secrets(&key);
                                if !failures.is_empty() {
                                    environment_decrypt_failures.insert(env.name.clone(), failures);
                                }
                                environments.push(env);
                            }
                        }
                    }
                }
            }
        }
        environments.sort_by(|a, b| a.name.cmp(&b.name));

        Ok(Self {
            path: absolute_path,
            manifest,
            collections,
            environments,
            environment_decrypt_failures,
        })
    }

    /// Loads only the workspace manifest, skipping the collections.
    pub fn load_manifest<P: AsRef<Path>>(path: P) -> Result<Self, std::io::Error> {
        let path = path.as_ref().to_path_buf();
        let mut absolute_path =
            if path.is_absolute() { path.clone() } else { std::env::current_dir()?.join(&path) };

        if absolute_path.is_dir() {
            absolute_path = absolute_path.join("cortex-workspace.yaml");
        }

        let content = fs::read_to_string(&absolute_path)?;
        let mut manifest: WorkspaceManifest = serde_yaml::from_str(&content)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;

        // Decrypt secrets
        let key = crate::crypto::get_app_key();
        let _ = manifest.decrypt_secrets(&key);

        // Load environments
        let mut environments = Vec::new();
        let mut environment_decrypt_failures: HashMap<String, Vec<DecryptFailure>> = HashMap::new();
        let env_dir = absolute_path.parent().unwrap_or(Path::new(".")).join("environments");
        if env_dir.exists() && env_dir.is_dir() {
            if let Ok(entries) = fs::read_dir(env_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_file()
                        && (path.extension().is_some_and(|ext| ext == "yaml" || ext == "yml"))
                    {
                        if let Ok(content) = fs::read_to_string(&path) {
                            if let Ok(mut env) =
                                crate::environment::EnvironmentFile::from_yaml(&content)
                            {
                                let key = crate::crypto::get_app_key();
                                let failures = env.decrypt_secrets(&key);
                                if !failures.is_empty() {
                                    environment_decrypt_failures.insert(env.name.clone(), failures);
                                }
                                environments.push(env);
                            }
                        }
                    }
                }
            }
        }
        environments.sort_by(|a, b| a.name.cmp(&b.name));

        Ok(Self {
            path: absolute_path,
            manifest,
            collections: Vec::new(),
            environments,
            environment_decrypt_failures,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_workspace_manifest_roundtrip() {
        let manifest = WorkspaceManifest {
            version: "1".to_string(),
            name: "My Workspace".to_string(),
            collections: vec!["./col1".to_string(), "/absolute/path/to/col2".to_string()],
            variables: None,
            environments: None,
            env_files: None,
        };

        let yaml = manifest.to_yaml().unwrap();
        let decoded = WorkspaceManifest::from_yaml(&yaml).unwrap();
        assert_eq!(manifest, decoded);
    }

    #[test]
    fn test_load_workspace_success() {
        let dir = tempdir().unwrap();
        let workspace_path = dir.path().join("cortex-workspace.yaml");

        // Create a collection directory
        let col1_dir = dir.path().join("col1");
        fs::create_dir(&col1_dir).unwrap();
        fs::write(col1_dir.join("cortex.yaml"), "version: \"1\"\nname: \"Col 1\"").unwrap();

        let workspace_content = "
version: \"1\"
name: \"Test Workspace\"
collections:
  - ./col1
  - ./missing
";
        fs::write(&workspace_path, workspace_content).unwrap();

        let workspace = Workspace::load(&workspace_path).unwrap();
        assert_eq!(workspace.manifest.name, "Test Workspace");
        assert_eq!(workspace.collections.len(), 2);

        // First collection should be loaded
        assert_eq!(workspace.collections[0].0, "./col1");
        assert!(workspace.collections[0].1.is_ok());
        assert_eq!(workspace.collections[0].1.as_ref().unwrap().manifest.name, "Col 1");

        // Second collection should have an error
        assert_eq!(workspace.collections[1].0, "./missing");
        assert!(workspace.collections[1].1.is_err());
        match workspace.collections[1].1.as_ref().unwrap_err() {
            CollectionError::NotFound(_) => {}
            _ => panic!("Expected NotFound error"),
        }
    }

    #[test]
    fn test_workspace_manifest_management() {
        let mut manifest = WorkspaceManifest::new("Test".to_string());
        manifest.add_collection("./col1".to_string());
        assert_eq!(manifest.collections.len(), 1);
        manifest.add_collection("./col1".to_string()); // Duplicate
        assert_eq!(manifest.collections.len(), 1);
        manifest.add_collection("./col2".to_string());
        assert_eq!(manifest.collections.len(), 2);
        manifest.remove_collection("./col1");
        assert_eq!(manifest.collections.len(), 1);
        assert_eq!(manifest.collections[0], "./col2");
    }

    #[test]
    fn test_save_workspace_manifest_with_gitignore() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("cortex-workspace.yaml");
        let manifest = WorkspaceManifest::new("GitIgnore Test".to_string());
        manifest.save(&path).unwrap();

        assert!(path.exists());
        let gitignore_path = dir.path().join(".gitignore");
        assert!(gitignore_path.exists());
        let content = fs::read_to_string(gitignore_path).unwrap();
        assert!(content.contains("# Cortex local-only files"));
        assert!(content.contains(".env"));
    }

    #[test]
    fn test_load_workspace_from_directory() {
        let dir = tempdir().unwrap();
        let workspace_path = dir.path().join("cortex-workspace.yaml");
        let workspace_content = "version: \"1\"\nname: \"Dir Test\"\ncollections: []";
        fs::write(&workspace_path, workspace_content).unwrap();

        // Load using the directory path instead of the file path
        let workspace = Workspace::load(dir.path()).unwrap();
        assert_eq!(workspace.manifest.name, "Dir Test");
        assert!(workspace.path.ends_with("cortex-workspace.yaml"));
    }
}
