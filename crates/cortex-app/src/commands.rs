use crate::state::AppSettings;
use cortex_core::collection::Collection;
use cortex_core::request::RequestFile;
use cortex_core::workspace::{Workspace, WorkspaceManifest};
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
    pub variables: Option<Vec<cortex_core::variables::Variable>>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct PreviewResponse {
    pub text: String,
    pub warnings: Vec<cortex_core::variables::UnresolvedVariableWarning>,
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
    let workspace = Workspace::load(&path).map_err(|e| e.to_string())?;

    // Remember this workspace
    let mut settings = AppSettings::load();
    settings.last_workspace_path = Some(path);
    let _ = settings.save();

    let collections = workspace
        .collections
        .into_iter()
        .map(|(path, result)| match result {
            Ok(c) => WorkspaceCollectionResult {
                path: c.path.to_string_lossy().to_string(),
                name: Some(c.manifest.name),
                error: None,
            },
            Err(e) => WorkspaceCollectionResult { path, name: None, error: Some(e.to_string()) },
        })
        .collect();

    Ok(WorkspaceResponse {
        name: workspace.manifest.name,
        collections,
        variables: workspace.manifest.variables,
    })
}

#[tauri::command]
#[specta::specta]
pub fn create_workspace(name: String, path: String) -> Result<String, String> {
    let manifest = WorkspaceManifest::new(name);
    let mut path = PathBuf::from(path);
    if path.is_dir() {
        path.push("cortex-workspace.yaml");
    }

    manifest.save(&path).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
#[specta::specta]
pub fn create_collection(name: String, path: String) -> Result<String, String> {
    let manifest = cortex_core::collection::CollectionManifest::new(name);
    let path = PathBuf::from(path);
    if !path.exists() {
        std::fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }

    let collection = cortex_core::collection::Collection {
        path: path.clone(),
        manifest,
        environments: Vec::new(),
        items: Vec::new(),
    };

    collection.save().map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
#[specta::specta]
pub fn add_collection_to_workspace(
    workspace_path: String,
    collection_path: String,
) -> Result<(), String> {
    let content = std::fs::read_to_string(&workspace_path).map_err(|e| e.to_string())?;
    let mut manifest = WorkspaceManifest::from_yaml(&content).map_err(|e| e.to_string())?;

    manifest.add_collection(collection_path);
    manifest.save(&workspace_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn remove_collection_from_workspace(
    workspace_path: String,
    collection_path: String,
) -> Result<(), String> {
    let content = std::fs::read_to_string(&workspace_path).map_err(|e| e.to_string())?;
    let mut manifest = WorkspaceManifest::from_yaml(&content).map_err(|e| e.to_string())?;

    manifest.remove_collection(&collection_path);
    manifest.save(&workspace_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_last_workspace_path() -> Option<String> {
    AppSettings::load().last_workspace_path
}

#[tauri::command]
#[specta::specta]
pub async fn pick_file(
    app: tauri::AppHandle,
    title: String,
    filter_name: String,
    filter_ext: String,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let file = app
        .dialog()
        .file()
        .set_title(&title)
        .add_filter(filter_name, &[&filter_ext])
        .blocking_pick_file();
    Ok(file.map(|p| p.to_string()))
}

#[tauri::command]
#[specta::specta]
pub async fn pick_directory(
    app: tauri::AppHandle,
    title: String,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let dir = app.dialog().file().set_title(&title).blocking_pick_folder();
    Ok(dir.map(|p| p.to_string()))
}

#[tauri::command]
#[specta::specta]
pub fn update_workspace_variables(
    workspace_path: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    let content = std::fs::read_to_string(&workspace_path).map_err(|e| e.to_string())?;
    let mut manifest = WorkspaceManifest::from_yaml(&content).map_err(|e| e.to_string())?;

    manifest.variables = Some(variables);
    manifest.save(&workspace_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn update_collection_variables(
    collection_path: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    let mut collection = Collection::load(&collection_path).map_err(|e| e.to_string())?;
    collection.manifest.variables = Some(variables);
    collection.save().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn update_environment_variables(
    collection_path: String,
    environment_name: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    let collection = Collection::load(&collection_path).map_err(|e| e.to_string())?;
    let env_dir = collection.path.join("environments");
    if !env_dir.exists() {
        std::fs::create_dir_all(&env_dir).map_err(|e| e.to_string())?;
    }

    let env_path = env_dir.join(format!("{}.yaml", environment_name));

    let mut env = if env_path.exists() {
        let content = std::fs::read_to_string(&env_path).map_err(|e| e.to_string())?;
        cortex_core::environment::EnvironmentFile::from_yaml(&content).map_err(|e| e.to_string())?
    } else {
        cortex_core::environment::EnvironmentFile::new(environment_name)
    };

    env.variables = variables;
    let yaml = env.to_yaml().map_err(|e| e.to_string())?;
    std::fs::write(env_path, yaml).map_err(|e| e.to_string())?;
    Ok(())
}

fn populate_resolver(
    resolver: &mut cortex_core::variables::VariableResolver,
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
) -> Result<(), String> {
    // 1. Global (Workspace)
    if let Some(wp) = workspace_path {
        let path = PathBuf::from(wp);
        let abs_path = if path.is_absolute() {
            path
        } else {
            std::env::current_dir().map(|d| d.join(&path)).unwrap_or(path)
        };

        let manifest_path =
            if abs_path.is_dir() { abs_path.join("cortex-workspace.yaml") } else { abs_path };

        if manifest_path.exists() {
            if let Ok(content) = std::fs::read_to_string(&manifest_path) {
                if let Ok(manifest) = WorkspaceManifest::from_yaml(&content) {
                    if let Some(vars) = manifest.variables {
                        for var in vars {
                            resolver.global_vars.insert(var.name.clone(), var);
                        }
                    }
                }
            }
        }
    }

    // 2. Collection
    if let Some(cp) = collection_path {
        if let Ok(collection) = Collection::load(&cp) {
            if let Some(vars) = collection.manifest.variables {
                for var in vars {
                    resolver.collection_vars.insert(var.name.clone(), var);
                }
            }

            // 3. Environment
            if let Some(en) = environment_name {
                if let Some(env) = collection.environments.iter().find(|e| e.name == en) {
                    for var in &env.variables {
                        resolver.env_vars.insert(var.name.clone(), var.clone());
                    }
                }
            }
        }
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_resolved_variables(
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
) -> Result<std::collections::BTreeMap<String, cortex_core::variables::ResolvedVariable>, String> {
    let mut resolver = cortex_core::variables::VariableResolver::new();
    populate_resolver(&mut resolver, workspace_path, collection_path, environment_name)?;
    Ok(resolver.get_all_resolved())
}

#[tauri::command]
#[specta::specta]
pub fn preview_template(
    text: String,
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
) -> Result<PreviewResponse, String> {
    let mut resolver = cortex_core::variables::VariableResolver::new();
    populate_resolver(&mut resolver, workspace_path, collection_path, environment_name)?;
    let (interpolated, warnings) = resolver.interpolate(&text);
    Ok(PreviewResponse { text: interpolated, warnings })
}
