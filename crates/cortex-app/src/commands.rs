use cortex_core::collection::Collection;
use cortex_core::request::RequestFile;
use cortex_core::workspace::Workspace;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Type)]
pub struct GreetResponse {
    pub message: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct WorkspaceCollectionResult {
    pub path: String,
    pub name: Option<String>,
    pub error: Option<String>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct WorkspaceResponse {
    pub name: String,
    pub collections: Vec<WorkspaceCollectionResult>,
}

#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> GreetResponse {
    GreetResponse { message: format!("Hello, {}! You've been greeted from Rust!", name) }
}

#[tauri::command]
#[specta::specta]
pub fn load_collection(path: String) -> Result<Collection, String> {
    Collection::load(path).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn save_request(request: RequestFile, path: String) -> Result<(), String> {
    Collection::save_request(&request, &PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn create_request(name: String, parent_path: String) -> Result<String, String> {
    Collection::create_request(&name, &PathBuf::from(parent_path))
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn delete_item(path: String) -> Result<(), String> {
    Collection::delete_item(&PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn rename_item(path: String, new_name: String) -> Result<String, String> {
    Collection::rename_item(&PathBuf::from(path), &new_name)
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn move_item(path: String, new_parent: String) -> Result<String, String> {
    Collection::move_item(&PathBuf::from(path), &PathBuf::from(new_parent))
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn load_workspace(path: String) -> Result<WorkspaceResponse, String> {
    let workspace = Workspace::load(path).map_err(|e| e.to_string())?;

    let collections = workspace
        .collections
        .into_iter()
        .map(|(path, result)| match result {
            Ok(c) => WorkspaceCollectionResult { path, name: Some(c.manifest.name), error: None },
            Err(e) => WorkspaceCollectionResult { path, name: None, error: Some(e.to_string()) },
        })
        .collect();

    Ok(WorkspaceResponse { name: workspace.manifest.name, collections })
}
