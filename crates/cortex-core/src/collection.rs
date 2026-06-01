use crate::request::{AuthRef, RequestFile, Scripts};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};

/// A named tag with an associated palette color, stored in the collection registry.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct TagDefinition {
    pub name: String,
    /// One of 12 named palette colors: red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet|pink|gray
    pub color: String,
}

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
    /// Collection-level pre/post-request scripts run for every request
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scripts: Option<Scripts>,
    /// Collection-level test scripts run after every response
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tests: Option<String>,
    /// Collection-level proxy override
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proxy: Option<CollectionProxy>,
    /// Collection-level client certificates
    #[serde(skip_serializing_if = "Option::is_none")]
    pub client_certificates: Option<Vec<CollectionClientCertificate>>,
    /// Named header/parameter presets
    #[serde(skip_serializing_if = "Option::is_none")]
    pub presets: Option<Vec<CollectionPreset>>,
    /// Collection-level protobuf settings
    #[serde(skip_serializing_if = "Option::is_none")]
    pub protobuf: Option<CollectionProtobuf>,
    /// Shared tag registry for this collection (name → color)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tag_registry: Option<Vec<TagDefinition>>,
    /// Custom display/execution order for top-level items (filenames/dirnames).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<Vec<String>>,
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
            scripts: None,
            tests: None,
            proxy: None,
            client_certificates: None,
            presets: None,
            protobuf: None,
            tag_registry: None,
            order: None,
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
    pub fn decrypt_secrets(&mut self, key: &[u8; 32]) -> Result<(), crate::crypto::CryptoError> {
        if let Some(vars) = &mut self.variables {
            for var in vars {
                if var.secret {
                    if let serde_json::Value::String(s) = &var.value {
                        if s.starts_with(crate::crypto::PREFIX) {
                            let decrypted = crate::crypto::decrypt(s, key)?;
                            var.value = serde_json::from_str(&decrypted)
                                .unwrap_or(serde_json::Value::String(decrypted));
                        }
                    }
                }
            }
        }
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
#[serde(tag = "type", content = "data")]
pub enum CollectionItem {
    Request(Box<RequestFileWrapper>),
    Folder(Box<Folder>),
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct RequestFileWrapper {
    pub name: String,
    pub path: PathBuf,
    pub relative_path: PathBuf,
    pub content: Option<RequestFile>,
    pub error: Option<String>,
}

/// Represents the optional `folder.yaml` configuration inside a folder directory.
#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct FolderManifest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub headers: Option<BTreeMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auth: Option<AuthRef>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scripts: Option<Scripts>,
    /// Custom display/execution order for items in this folder (filenames/dirnames).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<Vec<String>>,
}

impl FolderManifest {
    pub fn from_yaml(yaml: &str) -> Result<Self, serde_yaml::Error> {
        serde_yaml::from_str(yaml)
    }
    pub fn to_yaml(&self) -> Result<String, serde_yaml::Error> {
        serde_yaml::to_string(self)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct Folder {
    pub name: String,
    pub path: PathBuf,
    pub relative_path: PathBuf,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub manifest: Option<FolderManifest>,
    pub items: Vec<CollectionItem>,
}

/// Represents a loaded collection.
#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct Collection {
    pub path: PathBuf,
    pub manifest: CollectionManifest,
    pub items: Vec<CollectionItem>,
}

#[derive(Debug)]
pub enum CollectionError {
    NotFound(PathBuf),
    NotADirectory(PathBuf),
    MissingManifest(PathBuf),
    IoError(std::io::Error),
    YamlError(serde_yaml::Error),
    CryptoError(crate::crypto::CryptoError),
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
            CollectionError::CryptoError(err) => write!(f, "Crypto error: {}", err),
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
        let mut manifest = CollectionManifest::from_yaml(&content)?;

        // Decrypt secrets
        let key = crate::crypto::get_app_key();
        let _ = manifest.decrypt_secrets(&key);

        let items = load_tree(&path, &path)?;

        Ok(Self { path, manifest, items })
    }

    /// Loads only the manifest from a collection directory, skipping environments and the items tree.
    /// Use this when only the collection name or manifest-level variables are needed.
    pub fn load_manifest_no_envs<P: AsRef<Path>>(path: P) -> Result<Self, CollectionError> {
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
        let mut manifest = CollectionManifest::from_yaml(&content)?;

        let key = crate::crypto::get_app_key();
        let _ = manifest.decrypt_secrets(&key);

        Ok(Self { path, manifest, items: Vec::new() })
    }

    /// Loads only the manifest and environments from a collection directory, skipping the items tree.
    pub fn load_manifest<P: AsRef<Path>>(path: P) -> Result<Self, CollectionError> {
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
        let mut manifest = CollectionManifest::from_yaml(&content)?;

        // Decrypt secrets
        let key = crate::crypto::get_app_key();
        let _ = manifest.decrypt_secrets(&key);

        Ok(Self { path, manifest, items: Vec::new() })
    }

    /// Saves the manifest back to disk.
    pub fn save(&self) -> Result<(), CollectionError> {
        let manifest_path = self.path.join("cortex.yaml");

        let mut manifest = self.manifest.clone();
        let key = crate::crypto::get_app_key();
        manifest.encrypt_secrets(&key).map_err(CollectionError::CryptoError)?;

        let yaml = manifest.to_yaml()?;
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
    pub fn create_request(
        name: &str,
        parent_path: &Path,
        method: Option<&str>,
    ) -> Result<PathBuf, CollectionError> {
        let file_name =
            if name.ends_with(".crx") { name.to_string() } else { format!("{}.crx", name) };
        let path = parent_path.join(file_name);
        if path.exists() {
            return Err(CollectionError::InvalidPath(format!("File already exists: {:?}", path)));
        }

        let method_str = method.unwrap_or("GET");
        let url_str = if method_str.eq_ignore_ascii_case("WS") { "ws://" } else { "https://" };

        let request =
            RequestFile::new(name.replace(".crx", ""), method_str.to_string(), url_str.to_string());
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
    ///
    /// For `.crx` request files the `name` field inside the YAML is also updated
    /// to match the new filename stem, keeping the file self-consistent (the name
    /// is used for history display and future export/import workflows).
    pub fn rename_item(path: &Path, new_name: &str) -> Result<PathBuf, CollectionError> {
        let parent = path
            .parent()
            .ok_or_else(|| CollectionError::InvalidPath("Cannot rename root".to_string()))?;

        let new_file_name = if path.is_file() && !new_name.ends_with(".crx") {
            format!("{}.crx", new_name)
        } else {
            new_name.to_string()
        };

        let new_path = parent.join(&new_file_name);

        // For request files: update the internal `name` field before renaming so
        // the YAML content stays in sync with the filename stem.
        if path.is_file() && path.extension().and_then(|e| e.to_str()) == Some("crx") {
            let stem = new_file_name.trim_end_matches(".crx");
            if let Ok(content) = fs::read_to_string(path) {
                if let Ok(mut rf) = serde_yaml::from_str::<RequestFile>(&content) {
                    rf.name = stem.to_string();
                    if let Ok(updated) = serde_yaml::to_string(&rf) {
                        let _ = fs::write(path, updated);
                    }
                }
            }
        }

        fs::rename(path, &new_path)?;
        Ok(new_path)
    }

    /// Moves an item to a new parent directory.
    pub fn move_item(path: &Path, new_parent: &Path) -> Result<PathBuf, CollectionError> {
        let file_name = path
            .file_name()
            .ok_or_else(|| CollectionError::InvalidPath("Invalid file name".to_string()))?;
        let new_path = new_parent.join(file_name);
        fs::rename(path, &new_path).map_err(CollectionError::IoError)?;
        Ok(new_path)
    }

    /// Duplicates a request file.
    pub fn duplicate_request(path: &Path) -> Result<PathBuf, CollectionError> {
        if !path.exists() || !path.is_file() {
            return Err(CollectionError::NotFound(path.to_path_buf()));
        }

        let stem = path.file_stem().unwrap_or_default().to_string_lossy();
        let parent = path.parent().unwrap_or_else(|| Path::new("."));

        let mut i = 1;
        let mut new_path = parent.join(format!("{} copy.crx", stem));
        while new_path.exists() {
            new_path = parent.join(format!("{} copy {}.crx", stem, i));
            i += 1;
        }

        fs::copy(path, &new_path)?;

        // Update the name inside the file if possible
        if let Ok(content) = fs::read_to_string(&new_path) {
            if let Ok(mut rf) = RequestFile::from_yaml(&content) {
                rf.name = format!("{} Copy", rf.name);
                let _ = Self::save_request(&rf, &new_path);
            }
        }

        Ok(new_path)
    }

    /// Clones a folder by recursively copying it to a sibling with a "copy" suffix.
    pub fn clone_folder(path: &Path) -> Result<PathBuf, CollectionError> {
        if !path.exists() || !path.is_dir() {
            return Err(CollectionError::NotFound(path.to_path_buf()));
        }

        let name = path.file_name().unwrap_or_default().to_string_lossy();
        let parent = path.parent().unwrap_or_else(|| Path::new("."));

        let mut i = 1;
        let mut new_path = parent.join(format!("{} copy", name));
        while new_path.exists() {
            new_path = parent.join(format!("{} copy {}", name, i));
            i += 1;
        }

        Self::copy_dir_recursive(path, &new_path)?;
        Ok(new_path)
    }

    fn copy_dir_recursive(src: &Path, dst: &Path) -> Result<(), CollectionError> {
        fs::create_dir_all(dst)?;
        for entry in fs::read_dir(src)? {
            let entry = entry?;
            let dst_path = dst.join(entry.file_name());
            if entry.file_type()?.is_dir() {
                Self::copy_dir_recursive(&entry.path(), &dst_path)?;
            } else {
                fs::copy(entry.path(), &dst_path)?;
            }
        }
        Ok(())
    }

    /// Creates a new folder.
    pub fn create_folder(name: &str, parent_path: &Path) -> Result<PathBuf, CollectionError> {
        let path = parent_path.join(name);
        if path.exists() {
            return Err(CollectionError::InvalidPath(format!("Folder already exists: {:?}", path)));
        }

        fs::create_dir_all(&path)?;
        Ok(path)
    }

    /// Reorders `item_path` relative to `target_path` within their shared parent directory.
    /// `position` must be `"before"` or `"after"`. Writes the new order to the parent manifest.
    pub fn reorder_item(
        item_path: &Path,
        target_path: &Path,
        position: &str,
    ) -> Result<(), CollectionError> {
        let parent = item_path
            .parent()
            .ok_or_else(|| CollectionError::InvalidPath("Item has no parent".to_string()))?;
        let target_parent = target_path
            .parent()
            .ok_or_else(|| CollectionError::InvalidPath("Target has no parent".to_string()))?;

        if parent != target_parent {
            return Err(CollectionError::InvalidPath(
                "Item and target must share the same parent directory".to_string(),
            ));
        }

        let item_name = item_path
            .file_name()
            .ok_or_else(|| CollectionError::InvalidPath("Invalid item filename".to_string()))?
            .to_string_lossy()
            .to_string();
        let target_name = target_path
            .file_name()
            .ok_or_else(|| CollectionError::InvalidPath("Invalid target filename".to_string()))?
            .to_string_lossy()
            .to_string();

        if item_name == target_name {
            return Ok(());
        }

        // Build the current ordered list from the parent manifest (or filesystem order).
        let cortex_yaml = parent.join("cortex.yaml");
        let folder_yaml = parent.join("folder.yaml");

        let existing_order: Option<Vec<String>> = if cortex_yaml.exists() {
            fs::read_to_string(&cortex_yaml)
                .ok()
                .and_then(|s| CollectionManifest::from_yaml(&s).ok())
                .and_then(|m| m.order)
        } else if folder_yaml.exists() {
            fs::read_to_string(&folder_yaml)
                .ok()
                .and_then(|s| FolderManifest::from_yaml(&s).ok())
                .and_then(|m| m.order)
        } else {
            None
        };

        // Collect all sibling filenames from the filesystem.
        let mut names: Vec<String> = fs::read_dir(parent)?
            .filter_map(|e| e.ok())
            .map(|e| e.file_name().to_string_lossy().to_string())
            .filter(|n| {
                let p = parent.join(n);
                p.is_dir() || p.extension().is_some_and(|ext| ext == "crx")
            })
            .collect();

        // Apply any existing order so we start from a stable sequence.
        if let Some(ref order) = existing_order {
            names.sort_by(|a, b| {
                let ia = order.iter().position(|s| s == a).unwrap_or(usize::MAX);
                let ib = order.iter().position(|s| s == b).unwrap_or(usize::MAX);
                ia.cmp(&ib).then(a.cmp(b))
            });
        } else {
            names.sort();
        }

        // Ensure both item and target are present.
        if !names.contains(&item_name) {
            names.push(item_name.clone());
        }
        if !names.contains(&target_name) {
            names.push(target_name.clone());
        }

        // Remove the item from its current position.
        names.retain(|n| n != &item_name);

        // Insert before or after the target.
        let target_idx = names.iter().position(|n| n == &target_name).unwrap_or(names.len());

        let insert_at = if position == "before" { target_idx } else { target_idx + 1 };
        names.insert(insert_at, item_name);

        // Persist the new order to the parent manifest.
        if cortex_yaml.exists() {
            let yaml_str = fs::read_to_string(&cortex_yaml)?;
            let mut manifest = CollectionManifest::from_yaml(&yaml_str)?;
            manifest.order = Some(names);
            fs::write(&cortex_yaml, manifest.to_yaml()?)?;
        } else {
            // Read or create a folder.yaml.
            let mut manifest = if folder_yaml.exists() {
                let yaml_str = fs::read_to_string(&folder_yaml)?;
                FolderManifest::from_yaml(&yaml_str)?
            } else {
                FolderManifest { headers: None, auth: None, scripts: None, order: None }
            };
            manifest.order = Some(names);
            fs::write(&folder_yaml, manifest.to_yaml()?)?;
        }

        Ok(())
    }
}

/// Returns the filename (dir name or `.crx` filename) used as the key in order lists.
fn item_filename(item: &CollectionItem) -> String {
    match item {
        CollectionItem::Folder(f) => f.name.clone(),
        CollectionItem::Request(r) => format!("{}.crx", r.name),
    }
}

/// Sorts `items` according to `order` (list of filenames). Items not in `order` fall to the end
/// sorted alphabetically, folders before requests.
fn apply_order(items: &mut [CollectionItem], order: &[String]) {
    items.sort_by(|a, b| {
        let name_a = item_filename(a);
        let name_b = item_filename(b);
        let idx_a = order.iter().position(|s| s == &name_a).unwrap_or(usize::MAX);
        let idx_b = order.iter().position(|s| s == &name_b).unwrap_or(usize::MAX);
        if idx_a != usize::MAX || idx_b != usize::MAX {
            return idx_a.cmp(&idx_b);
        }
        // Both unordered: folders first, then alpha
        match (a, b) {
            (CollectionItem::Folder(_), CollectionItem::Request(_)) => std::cmp::Ordering::Less,
            (CollectionItem::Request(_), CollectionItem::Folder(_)) => std::cmp::Ordering::Greater,
            _ => name_a.cmp(&name_b),
        }
    });
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
            let manifest_path = path.join("folder.yaml");
            let manifest = if manifest_path.exists() {
                fs::read_to_string(&manifest_path)
                    .ok()
                    .and_then(|s| FolderManifest::from_yaml(&s).ok())
            } else {
                None
            };
            items.push(CollectionItem::Folder(Box::new(Folder {
                name,
                path,
                relative_path,
                manifest,
                items: children,
            })));
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

    // Apply stored order from the current directory's manifest, or fall back to alpha sort.
    let stored_order: Option<Vec<String>> = {
        let cortex_yaml = current_path.join("cortex.yaml");
        let folder_yaml = current_path.join("folder.yaml");
        if cortex_yaml.exists() {
            fs::read_to_string(&cortex_yaml)
                .ok()
                .and_then(|s| CollectionManifest::from_yaml(&s).ok())
                .and_then(|m| m.order)
        } else if folder_yaml.exists() {
            fs::read_to_string(&folder_yaml)
                .ok()
                .and_then(|s| FolderManifest::from_yaml(&s).ok())
                .and_then(|m| m.order)
        } else {
            None
        }
    };

    if let Some(order) = stored_order {
        apply_order(&mut items, &order);
    } else {
        // Default: folders first, then requests, each group sorted alphabetically
        items.sort_by(|a, b| match (a, b) {
            (CollectionItem::Folder(_), CollectionItem::Request(_)) => std::cmp::Ordering::Less,
            (CollectionItem::Request(_), CollectionItem::Folder(_)) => std::cmp::Ordering::Greater,
            (CollectionItem::Folder(f1), CollectionItem::Folder(f2)) => f1.name.cmp(&f2.name),
            (CollectionItem::Request(r1), CollectionItem::Request(r2)) => r1.name.cmp(&r2.name),
        });
    }

    Ok(items)
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionProxy {
    pub enabled: bool,
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bypass_list: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionClientCertificate {
    pub hostname: String,
    pub cert_file: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub key_file: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub passphrase: Option<String>,
    pub enabled: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionPresetField {
    pub key: String,
    pub value: String,
    pub enabled: bool,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionPreset {
    pub name: String,
    pub fields: Vec<CollectionPresetField>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionProtoFile {
    pub file: String,
    pub path: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionImportPath {
    pub directory: String,
    pub path: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone, Type)]
pub struct CollectionProtobuf {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proto_files: Option<Vec<CollectionProtoFile>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub import_paths: Option<Vec<CollectionImportPath>>,
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
            value: serde_json::json!("https://api.example.com"),
            secret: false,
            enabled: true,
            prompt: false,
            description: None,
        });

        let manifest = CollectionManifest {
            version: "1".to_string(),
            name: "My Collection".to_string(),
            description: Some("A test collection".to_string()),
            auth: None,
            headers: None,
            variables: Some(variables),
            scripts: None,
            tests: None,
            proxy: None,
            client_certificates: None,
            presets: None,
            protobuf: None,
            tag_registry: None,
            order: None,
        };

        let yaml = manifest.to_yaml().unwrap();
        let decoded = CollectionManifest::from_yaml(&yaml).unwrap();
        assert_eq!(manifest, decoded);
    }

    #[test]
    fn test_save_collection_with_gitignore() {
        let dir = tempdir().unwrap();
        let manifest = CollectionManifest::new("Test Collection".to_string());
        let collection = Collection { path: dir.path().to_path_buf(), manifest, items: Vec::new() };

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
        let path = Collection::create_request("New Request", dir.path(), None).unwrap();
        assert!(path.exists());
        assert!(path.to_str().unwrap().contains("New Request.crx"));

        let content = fs::read_to_string(path).unwrap();
        assert!(content.contains("name: New Request"));
    }

    #[test]
    fn test_folder_manifest_roundtrip() {
        let mut headers = BTreeMap::new();
        headers.insert("X-Folder-Level".to_string(), "true".to_string());
        let manifest =
            FolderManifest { headers: Some(headers), auth: None, scripts: None, order: None };
        let yaml = manifest.to_yaml().unwrap();
        let decoded = FolderManifest::from_yaml(&yaml).unwrap();
        assert_eq!(manifest, decoded);
    }
}
