use cortex_core::collection::{Collection, CollectionManifest};
use cortex_core::workspace::Workspace;
use serde::{Deserialize, Serialize};
use specta::Type;

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
pub fn load_collection(path: String) -> Result<CollectionManifest, String> {
    Collection::load(path).map(|c| c.manifest).map_err(|e| e.to_string())
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
