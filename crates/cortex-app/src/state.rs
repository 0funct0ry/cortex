use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Default)]
pub struct AppSettings {
    pub last_workspace_path: Option<String>,
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
