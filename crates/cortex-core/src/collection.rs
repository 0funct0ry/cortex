use crate::request::AuthRef;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};

/// Represents the structure of a `cortex.yaml` collection manifest file.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
#[serde(deny_unknown_fields)]
pub struct CollectionManifest {
    /// Schema version (e.g., "1")
    pub version: String,
    /// Human-readable name of the collection
    pub name: String,
    /// Optional description of the collection
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Default authentication settings for all requests in the collection
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auth: Option<AuthRef>,
    /// Default headers for all requests in the collection
    #[serde(skip_serializing_if = "Option::is_none")]
    pub headers: Option<BTreeMap<String, String>>,
    /// Collection-level variables
    #[serde(skip_serializing_if = "Option::is_none")]
    pub variables: Option<BTreeMap<String, String>>,
}

impl CollectionManifest {
    pub fn new(name: String) -> Self {
        Self {
            version: "1".to_string(),
            name,
            description: None,
            auth: None,
            headers: None,
            variables: None,
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
}

/// Represents a loaded collection.
#[derive(Debug, Clone)]
pub struct Collection {
    pub path: PathBuf,
    pub manifest: CollectionManifest,
}

#[derive(Debug)]
pub enum CollectionError {
    NotFound(PathBuf),
    NotADirectory(PathBuf),
    MissingManifest(PathBuf),
    IoError(std::io::Error),
    YamlError(serde_yaml::Error),
}

impl std::fmt::Display for CollectionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CollectionError::NotFound(path) => write!(f, "Collection path not found: {:?}", path),
            CollectionError::NotADirectory(path) => {
                write!(f, "Path is not a directory: {:?}", path)
            }
            CollectionError::MissingManifest(path) => {
                write!(f, "Missing 'cortex.yaml' manifest in collection directory: {:?}", path)
            }
            CollectionError::IoError(err) => write!(f, "IO error: {}", err),
            CollectionError::YamlError(err) => write!(f, "YAML error: {}", err),
        }
    }
}

impl std::error::Error for CollectionError {}

impl From<std::io::Error> for CollectionError {
    fn from(err: std::io::Error) -> Self {
        CollectionError::IoError(err)
    }
}

impl From<serde_yaml::Error> for CollectionError {
    fn from(err: serde_yaml::Error) -> Self {
        CollectionError::YamlError(err)
    }
}

impl Collection {
    /// Loads a collection from a directory.
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self, CollectionError> {
        let path = path.as_ref().to_path_buf();

        if !path.exists() {
            return Err(CollectionError::NotFound(path));
        }

        if !path.is_dir() {
            return Err(CollectionError::NotADirectory(path));
        }

        let manifest_path = path.join("cortex.yaml");
        if !manifest_path.exists() {
            return Err(CollectionError::MissingManifest(path));
        }

        let content = fs::read_to_string(&manifest_path)?;
        let manifest = CollectionManifest::from_yaml(&content)?;

        Ok(Self { path, manifest })
    }

    /// Saves the manifest back to disk.
    pub fn save(&self) -> Result<(), CollectionError> {
        let manifest_path = self.path.join("cortex.yaml");
        let yaml = self.manifest.to_yaml()?;
        fs::write(manifest_path, yaml)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_manifest_roundtrip() {
        let mut variables = BTreeMap::new();
        variables.insert("base_url".to_string(), "https://api.example.com".to_string());

        let manifest = CollectionManifest {
            version: "1".to_string(),
            name: "My Collection".to_string(),
            description: Some("A test collection".to_string()),
            auth: None,
            headers: None,
            variables: Some(variables),
        };

        let yaml = manifest.to_yaml().unwrap();
        let decoded = CollectionManifest::from_yaml(&yaml).unwrap();
        assert_eq!(manifest, decoded);
    }

    #[test]
    fn test_load_collection_success() {
        let dir = tempdir().unwrap();
        let manifest_path = dir.path().join("cortex.yaml");
        let manifest_content = "
version: \"1\"
name: \"Test Collection\"
description: \"Description\"
";
        fs::write(manifest_path, manifest_content).unwrap();

        let collection = Collection::load(dir.path()).unwrap();
        assert_eq!(collection.manifest.name, "Test Collection");
        assert_eq!(collection.manifest.description, Some("Description".to_string()));
    }

    #[test]
    fn test_load_collection_missing_manifest() {
        let dir = tempdir().unwrap();
        let result = Collection::load(dir.path());
        assert!(matches!(result, Err(CollectionError::MissingManifest(_))));
    }

    #[test]
    fn test_load_collection_invalid_yaml() {
        let dir = tempdir().unwrap();
        let manifest_path = dir.path().join("cortex.yaml");
        fs::write(manifest_path, "invalid: yaml: :").unwrap();

        let result = Collection::load(dir.path());
        assert!(matches!(result, Err(CollectionError::YamlError(_))));
    }
}
