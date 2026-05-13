use cortex_core::request::RequestHistoryEntry;
use cortex_core::variables::Variable;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Default)]
pub struct AppSettings {
    pub last_workspace_path: Option<String>,
}

/// In-memory store for ephemeral (session-scoped) variables.
/// These are never written to disk and are cleared when the app exits.
/// Scripts can upsert individual entries; the UI replaces the whole set on save.
pub struct EphemeralStore(pub Mutex<BTreeMap<String, Variable>>);

impl EphemeralStore {
    pub fn new() -> Self {
        Self(Mutex::new(BTreeMap::new()))
    }
}

/// Persistent store for executed request history logs.
pub struct HistoryStore(pub Mutex<Vec<RequestHistoryEntry>>);

impl HistoryStore {
    pub fn new() -> Self {
        let entries = Self::load();
        Self(Mutex::new(entries))
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
        if let Ok(content) = fs::read_to_string(path) {
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            AppSettings::default()
        }
    }

    pub fn save(&self) -> Result<(), std::io::Error> {
        let path = Self::get_settings_path();
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
