use crate::collection::{Collection, CollectionError};
use serde::{Deserialize, Serialize};
use specta::Type;
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
}

impl WorkspaceManifest {
    pub fn new(name: String) -> Self {
        Self { version: "1".to_string(), name, collections: Vec::new() }
    }

    /// Serializes the manifest to a YAML string.
    pub fn to_yaml(&self) -> Result<String, serde_yaml::Error> {
        serde_yaml::to_string(self)
    }

    /// Deserializes a manifest from a YAML string.
    pub fn from_yaml(yaml: &str) -> Result<Self, serde_yaml::Error> {
        serde_yaml::from_str(yaml)
    }

    /// Saves the manifest to a file.
    pub fn save<P: AsRef<Path>>(&self, path: P) -> Result<(), std::io::Error> {
        let path = path.as_ref();
        let yaml =
            self.to_yaml().map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;
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
}

impl Workspace {
    /// Loads a workspace from a YAML file.
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self, std::io::Error> {
        let path = path.as_ref().to_path_buf();
        let absolute_path =
            if path.is_absolute() { path.clone() } else { std::env::current_dir()?.join(&path) };

        let content = fs::read_to_string(&absolute_path)?;
        let manifest: WorkspaceManifest = serde_yaml::from_str(&content)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;

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

        Ok(Self { path: absolute_path, manifest, collections })
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
}
