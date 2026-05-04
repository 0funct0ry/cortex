use cortex_core::collection::{Collection, CollectionManifest};
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct GreetResponse {
    pub message: String,
}

#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> GreetResponse {
    GreetResponse { message: format!("Hello, {}! You've been greeted from Rust!", name) }
}
#[tauri::command]
#[specta::specta]
pub fn load_collection(path: String) -> Result<CollectionManifest, String> {
    Collection::load(path).map(|c| c.manifest).map_err(|e| e.to_string())
}
