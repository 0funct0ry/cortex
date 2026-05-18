use cortex_core::request::RequestHistoryEntry;
use cortex_core::variables::Variable;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

#[derive(Serialize, Deserialize, Clone, Debug, Type)]
pub struct RecentWorkspace {
    pub name: String,
    pub path: String,
}

fn default_timeout() -> u32 {
    30000
}

fn default_redirect_behavior() -> String {
    "follow".to_string()
}

#[derive(Serialize, Deserialize, Clone, Debug, Type)]
pub struct AppSettings {
    pub last_workspace_path: Option<String>,
    #[serde(default)]
    pub recent_workspaces: Vec<RecentWorkspace>,
    pub active_environment: Option<String>,
    #[serde(default = "default_timeout")]
    pub timeout: u32,
    #[serde(default = "default_redirect_behavior")]
    pub redirect_behavior: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            last_workspace_path: None,
            recent_workspaces: Vec::new(),
            active_environment: None,
            timeout: 30000,
            redirect_behavior: "follow".to_string(),
        }
    }
}

/// In-memory store for ephemeral (session-scoped) variables.
/// These are never written to disk and are cleared when the app exits.
/// Scripts can upsert individual entries; the UI replaces the whole set on save.
#[derive(Clone)]
pub struct EphemeralStore(pub Arc<Mutex<BTreeMap<String, Variable>>>);

impl EphemeralStore {
    pub fn new() -> Self {
        Self(Arc::new(Mutex::new(BTreeMap::new())))
    }
}

#[derive(Clone)]
pub struct AppState {
    pub executor: cortex_core::executor::HttpExecutor,
    pub requests: Arc<Mutex<BTreeMap<String, tokio::task::AbortHandle>>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            executor: cortex_core::executor::HttpExecutor::new(),
            requests: Arc::new(Mutex::new(BTreeMap::new())),
        }
    }
}

/// Persistent store for executed request history logs.
#[derive(Clone)]
pub struct HistoryStore(pub Arc<Mutex<Vec<RequestHistoryEntry>>>);

impl HistoryStore {
    pub fn new() -> Self {
        let entries = Self::load();
        Self(Arc::new(Mutex::new(entries)))
    }

    pub fn load() -> Vec<RequestHistoryEntry> {
        let path = Self::get_history_path();
        if let Ok(content) = fs::read_to_string(path) {
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            Vec::new()
        }
    }

    pub fn save(entries: &[RequestHistoryEntry]) -> Result<(), std::io::Error> {
        let path = Self::get_history_path();
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        let content = serde_json::to_string_pretty(entries)?;
        fs::write(path, content)
    }

    pub fn add_entry(&self, entry: RequestHistoryEntry) {
        let mut locked = self.0.lock().unwrap();
        // Insert at the beginning so newest entries are first
        locked.insert(0, entry);
        // Keep max 100 history items
        locked.truncate(100);
        let _ = Self::save(&locked);
    }

    pub fn get_entries(&self) -> Vec<RequestHistoryEntry> {
        self.0.lock().unwrap().clone()
    }

    pub fn clear(&self) {
        let mut locked = self.0.lock().unwrap();
        locked.clear();
        let _ = Self::save(&locked);
    }

    fn get_history_path() -> PathBuf {
        if let Some(mut path) = dirs::config_dir() {
            path.push("cortex");
            path.push("history.json");
            path
        } else {
            PathBuf::from(".cortex-history.json")
        }
    }
}

impl AppSettings {
    pub fn load() -> Self {
        let path = Self::get_settings_path();
        println!("Loading settings from: {:?}", path);
        if let Ok(content) = fs::read_to_string(path) {
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            AppSettings::default()
        }
    }

    pub fn save(&self) -> Result<(), std::io::Error> {
        let path = Self::get_settings_path();
        println!("Saving settings to: {:?}", path);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        let content = serde_json::to_string_pretty(self)?;
        fs::write(path, content)
    }

    fn get_settings_path() -> PathBuf {
        if let Some(mut path) = dirs::config_dir() {
            path.push("cortex");
            path.push("settings.json");
            path
        } else {
            PathBuf::from(".cortex-settings.json")
        }
    }
}
