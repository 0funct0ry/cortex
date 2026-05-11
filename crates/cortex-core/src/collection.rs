use crate::environment::EnvironmentFile;
use crate::request::{AuthRef, RequestFile};
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
    pub variables: Option<Vec<crate::variables::Variable>>,
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

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(tag = "type", content = "data")]
pub enum CollectionItem {
    Request(Box<RequestFileWrapper>),
    Folder(Folder),
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct RequestFileWrapper {
    pub name: String,
    pub path: PathBuf,
    pub relative_path: PathBuf,
    pub content: Option<RequestFile>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct Folder {
    pub name: String,
    pub path: PathBuf,
    pub relative_path: PathBuf,
    pub items: Vec<CollectionItem>,
}

/// Represents a loaded collection.
#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct Collection {
    pub path: PathBuf,
    pub manifest: CollectionManifest,
    pub environments: Vec<EnvironmentFile>,
    pub items: Vec<CollectionItem>,
}

#[derive(Debug)]
pub enum CollectionError {
    NotFound(PathBuf),
    NotADirectory(PathBuf),
    MissingManifest(PathBuf),
    IoError(std::io::Error),
    YamlError(serde_yaml::Error),
    InvalidPath(String),
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
            CollectionError::InvalidPath(msg) => write!(f, "Invalid path: {}", msg),
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

        let mut environments = Vec::new();
        let env_dir = path.join("environments");
        if env_dir.exists() && env_dir.is_dir() {
            for entry in fs::read_dir(env_dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.is_file()
                    && (path.extension().is_some_and(|ext| ext == "yaml" || ext == "yml"))
                {
                    let content = fs::read_to_string(&path)?;
                    let env = EnvironmentFile::from_yaml(&content)?;
                    environments.push(env);
                }
            }
        }

        let items = load_tree(&path, &path)?;

        Ok(Self { path, manifest, environments, items })
    }

    /// Saves the manifest back to disk.
    pub fn save(&self) -> Result<(), CollectionError> {
        let manifest_path = self.path.join("cortex.yaml");
        let yaml = self.manifest.to_yaml()?;
        fs::write(manifest_path, yaml)?;

        // Ensure .gitignore exists in the collection root
        let _ = crate::gitignore::GitIgnoreManager::ensure_gitignore(&self.path);

        Ok(())
    }

    /// Saves a request to disk.
    pub fn save_request(request: &RequestFile, path: &Path) -> Result<(), CollectionError> {
        let yaml = request.to_yaml()?;
        fs::write(path, yaml)?;
        Ok(())
    }

    /// Creates a new request file.
    pub fn create_request(name: &str, parent_path: &Path) -> Result<PathBuf, CollectionError> {
        let file_name =
            if name.ends_with(".crx") { name.to_string() } else { format!("{}.crx", name) };
        let path = parent_path.join(file_name);
        if path.exists() {
            return Err(CollectionError::InvalidPath(format!("File already exists: {:?}", path)));
        }

        let request =
            RequestFile::new(name.replace(".crx", ""), "GET".to_string(), "https://".to_string());
        let yaml = request.to_yaml()?;
        fs::write(&path, yaml)?;
        Ok(path)
    }

    /// Deletes an item (moves to trash).
    pub fn delete_item(path: &Path) -> Result<(), CollectionError> {
        trash::delete(path).map_err(|e| CollectionError::IoError(std::io::Error::other(e)))?;
        Ok(())
    }

    /// Renames an item on disk.
    pub fn rename_item(path: &Path, new_name: &str) -> Result<PathBuf, CollectionError> {
        let parent = path
            .parent()
            .ok_or_else(|| CollectionError::InvalidPath("Cannot rename root".to_string()))?;

        let new_file_name = if path.is_file() && !new_name.ends_with(".crx") {
            format!("{}.crx", new_name)
        } else {
            new_name.to_string()
        };

        let new_path = parent.join(new_file_name);
        fs::rename(path, &new_path)?;
        Ok(new_path)
    }

    /// Moves an item to a new parent directory.
    pub fn move_item(path: &Path, new_parent: &Path) -> Result<PathBuf, CollectionError> {
        let file_name = path
            .file_name()
            .ok_or_else(|| CollectionError::InvalidPath("Invalid file name".to_string()))?;
        let new_path = new_parent.join(file_name);
        fs::rename(path, &new_path)?;
        Ok(new_path)
    }
}

fn load_tree(
    base_path: &Path,
    current_path: &Path,
) -> Result<Vec<CollectionItem>, CollectionError> {
    let mut items = Vec::new();
    let entries = fs::read_dir(current_path)?;

    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        let name = path.file_name().unwrap_or_default().to_string_lossy().to_string();
        let relative_path = path.strip_prefix(base_path).unwrap_or(&path).to_path_buf();

        if path.is_dir() {
            // Skip environments directory at root
            if name == "environments" && current_path == base_path {
                continue;
            }
            let children = load_tree(base_path, &path)?;
            items.push(CollectionItem::Folder(Folder {
                name,
                path,
                relative_path,
                items: children,
            }));
        } else if path.extension().is_some_and(|ext| ext == "crx") {
            let (content, error) = match fs::read_to_string(&path) {
                Ok(s) => match RequestFile::from_yaml(&s) {
                    Ok(rf) => (Some(rf), None),
                    Err(e) => (None, Some(e.to_string())),
                },
                Err(e) => (None, Some(e.to_string())),
            };
            items.push(CollectionItem::Request(Box::new(RequestFileWrapper {
                name: name.replace(".crx", ""),
                path,
                relative_path,
                content,
                error,
            })));
        }
    }

    // Sort items by name (folders first, then requests)
    items.sort_by(|a, b| match (a, b) {
        (CollectionItem::Folder(_), CollectionItem::Request(_)) => std::cmp::Ordering::Less,
        (CollectionItem::Request(_), CollectionItem::Folder(_)) => std::cmp::Ordering::Greater,
        (CollectionItem::Folder(f1), CollectionItem::Folder(f2)) => f1.name.cmp(&f2.name),
        (CollectionItem::Request(r1), CollectionItem::Request(r2)) => r1.name.cmp(&r2.name),
    });

    Ok(items)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_manifest_roundtrip() {
        let mut variables = Vec::new();
        variables.push(crate::variables::Variable {
            name: "base_url".to_string(),
            value: "https://api.example.com".to_string(),
            secret: false,
            enabled: true,
        });

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
    fn test_save_collection_with_gitignore() {
        let dir = tempdir().unwrap();
        let manifest = CollectionManifest::new("Test Collection".to_string());
        let collection = Collection {
            path: dir.path().to_path_buf(),
            manifest,
            environments: Vec::new(),
            items: Vec::new(),
        };

        collection.save().unwrap();
        let gitignore_path = dir.path().join(".gitignore");
        assert!(gitignore_path.exists());
        let content = fs::read_to_string(gitignore_path).unwrap();
        assert!(content.contains("# Cortex local-only files"));
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
    fn test_load_collection_tree() {
        let dir = tempdir().unwrap();
        fs::write(dir.path().join("cortex.yaml"), "version: \"1\"\nname: \"Test\"").unwrap();

        let sub = dir.path().join("Subfolder");
        fs::create_dir(&sub).unwrap();

        let req_content = "version: \"1\"\nname: \"Req\"\nmethod: \"GET\"\nurl: \"https://\"";
        fs::write(dir.path().join("root_req.crx"), req_content).unwrap();
        fs::write(sub.join("sub_req.crx"), req_content).unwrap();

        let collection = Collection::load(dir.path()).unwrap();
        assert_eq!(collection.items.len(), 2); // Subfolder and root_req

        let folder = match &collection.items[0] {
            CollectionItem::Folder(f) => f,
            _ => panic!("Expected folder"),
        };
        assert_eq!(folder.name, "Subfolder");
        assert_eq!(folder.items.len(), 1);
    }

    #[test]
    fn test_create_request() {
        let dir = tempdir().unwrap();
        let path = Collection::create_request("New Request", dir.path()).unwrap();
        assert!(path.exists());
        assert!(path.to_str().unwrap().contains("New Request.crx"));

        let content = fs::read_to_string(path).unwrap();
        assert!(content.contains("name: New Request"));
    }
}
