use crate::state::{AppSettings, EphemeralStore};
use cortex_core::collection::Collection;
use cortex_core::request::RequestFile;
use cortex_core::variables::Variable;
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
    pub syntax_errors: Vec<cortex_core::variables::TemplateSyntaxError>,
}

#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> GreetResponse {
    GreetResponse { message: format!("Hello, {}! You've been greeted from Rust!", name) }
}

#[tauri::command]
#[specta::specta]
pub async fn load_collection(path: String) -> Result<Collection, String> {
    tauri::async_runtime::spawn_blocking(move || Collection::load(path).map_err(|e| e.to_string()))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn load_collection_manifest(path: String) -> Result<Collection, String> {
    tauri::async_runtime::spawn_blocking(move || {
        Collection::load_manifest(path).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn save_request(request: RequestFile, path: String) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        Collection::save_request(&request, &PathBuf::from(path)).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
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
pub async fn load_workspace(path: String) -> Result<WorkspaceResponse, String> {
    tauri::async_runtime::spawn_blocking(move || load_workspace_blocking(path))
        .await
        .map_err(|e| e.to_string())?
}

fn load_workspace_blocking(path: String) -> Result<WorkspaceResponse, String> {
    // Load only the workspace manifest — skips loading every collection's request tree.
    let workspace = Workspace::load_manifest(&path).map_err(|e| e.to_string())?;

    // Remember this workspace
    let mut settings = AppSettings::load();
    settings.last_workspace_path = Some(path);
    let _ = settings.save();

    let workspace_dir = workspace.path.parent().unwrap_or(std::path::Path::new(".")).to_path_buf();

    // Resolve each collection name with a manifest-only load (no environments, no item tree).
    let collections = workspace
        .manifest
        .collections
        .iter()
        .map(|col_path_str| {
            let col_path = std::path::Path::new(col_path_str);
            let full_path = if col_path.is_absolute() {
                col_path.to_path_buf()
            } else {
                workspace_dir.join(col_path)
            };
            match Collection::load_manifest_no_envs(&full_path) {
                Ok(c) => WorkspaceCollectionResult {
                    path: c.path.to_string_lossy().to_string(),
                    name: Some(c.manifest.name),
                    error: None,
                },
                Err(e) => WorkspaceCollectionResult {
                    path: col_path_str.clone(),
                    name: None,
                    error: Some(e.to_string()),
                },
            }
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
pub fn load_workspace_manifest(path: String) -> Result<WorkspaceResponse, String> {
    let workspace = Workspace::load_manifest(&path).map_err(|e| e.to_string())?;

    let collections = workspace
        .manifest
        .collections
        .iter()
        .map(|c| WorkspaceCollectionResult { path: c.clone(), name: None, error: None })
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
pub async fn update_workspace_variables(
    workspace_path: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let content = std::fs::read_to_string(&workspace_path).map_err(|e| e.to_string())?;
        let mut manifest = WorkspaceManifest::from_yaml(&content).map_err(|e| e.to_string())?;
        manifest.variables = Some(variables);
        manifest.save(&workspace_path).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn update_collection_variables(
    collection_path: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut collection =
            Collection::load_manifest_no_envs(&collection_path).map_err(|e| e.to_string())?;
        collection.manifest.variables = Some(variables);
        collection.save().map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn update_environment_variables(
    collection_path: String,
    environment_name: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        // Resolve the environments directory from the collection path without loading envs.
        let col_path = std::path::PathBuf::from(&collection_path);
        let env_dir = col_path.join("environments");
        if !env_dir.exists() {
            std::fs::create_dir_all(&env_dir).map_err(|e| e.to_string())?;
        }

        let env_path = env_dir.join(format!("{}.yaml", environment_name));

        let mut env = if env_path.exists() {
            let content = std::fs::read_to_string(&env_path).map_err(|e| e.to_string())?;
            cortex_core::environment::EnvironmentFile::from_yaml(&content)
                .map_err(|e| e.to_string())?
        } else {
            cortex_core::environment::EnvironmentFile::new(environment_name)
        };

        env.variables = variables;
        let key = cortex_core::crypto::get_app_key();
        let _ = env.encrypt_secrets(&key);
        let yaml = env.to_yaml().map_err(|e| e.to_string())?;
        std::fs::write(env_path, yaml).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

// ---------------------------------------------------------------------------
// Ephemeral (session) variable commands
// ---------------------------------------------------------------------------

/// Returns all current ephemeral variables ordered by name.
/// The store lives only for the duration of the process — closing the app clears it.
#[tauri::command]
#[specta::specta]
pub fn get_ephemeral_variables(store: tauri::State<EphemeralStore>) -> Vec<Variable> {
    store.0.lock().unwrap().values().cloned().collect()
}

/// Atomically replaces the entire ephemeral variable set.
/// Used by the variable panel "Save Changes" action for the Session scope.
#[tauri::command]
#[specta::specta]
pub fn set_ephemeral_variables(variables: Vec<Variable>, store: tauri::State<EphemeralStore>) {
    let mut locked = store.0.lock().unwrap();
    locked.clear();
    for var in variables {
        locked.insert(var.name.clone(), var);
    }
}

/// Upserts a single ephemeral variable by name.
/// Intended for script use — allows runtime injection of one-time values.
#[tauri::command]
#[specta::specta]
pub fn set_ephemeral_variable(
    name: String,
    value: String,
    secret: bool,
    store: tauri::State<EphemeralStore>,
) {
    let var = Variable {
        name: name.clone(),
        value,
        secret,
        enabled: true,
        prompt: false,
        description: None,
    };
    store.0.lock().unwrap().insert(name, var);
}

/// Removes a single ephemeral variable by name.
/// Intended for script use.
#[tauri::command]
#[specta::specta]
pub fn remove_ephemeral_variable(name: String, store: tauri::State<EphemeralStore>) {
    store.0.lock().unwrap().remove(&name);
}

// ---------------------------------------------------------------------------

/// Returns all enabled prompt variables from the given collection / environment
/// that do not yet have a runtime (ephemeral) override in the current session.
///
/// The frontend calls this before starting a collection run to determine which
/// variables still need user input.
#[tauri::command]
#[specta::specta]
pub async fn get_prompt_variables(
    collection_path: String,
    environment_name: Option<String>,
    store: tauri::State<'_, EphemeralStore>,
) -> Result<Vec<Variable>, String> {
    let ephemeral_vars: Vec<Variable> = store.0.lock().unwrap().values().cloned().collect();
    tauri::async_runtime::spawn_blocking(move || {
        let collection = cortex_core::collection::Collection::load_manifest(&collection_path)
            .map_err(|e| e.to_string())?;

        let mut resolver = cortex_core::variables::VariableResolver::new();

        if let Some(vars) = collection.manifest.variables {
            for var in vars {
                resolver.collection_vars.insert(var.name.clone(), var);
            }
        }

        if let Some(en) = environment_name {
            if let Some(env) = collection.environments.iter().find(|e| e.name == en) {
                for var in &env.variables {
                    resolver.env_vars.insert(var.name.clone(), var.clone());
                }
            }
        }

        for var in ephemeral_vars {
            resolver.runtime_vars.insert(var.name.clone(), var);
        }

        let pending = resolver.pending_prompt_variables().into_iter().cloned().collect::<Vec<_>>();
        Ok(pending)
    })
    .await
    .map_err(|e| e.to_string())?
}

fn populate_resolver(
    resolver: &mut cortex_core::variables::VariableResolver,
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
    ephemeral_vars: Vec<Variable>,
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
        if let Ok(collection) = Collection::load_manifest(&cp) {
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

    // 4. Ephemeral / Session — Runtime scope, highest precedence.
    // These are never read from disk; they come from the in-process EphemeralStore.
    for var in ephemeral_vars {
        resolver.runtime_vars.insert(var.name.clone(), var);
    }

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn get_resolved_variables(
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
    store: tauri::State<'_, EphemeralStore>,
) -> Result<std::collections::BTreeMap<String, cortex_core::variables::ResolvedVariable>, String> {
    // Snapshot the ephemeral store before entering spawn_blocking (State is not Send).
    let ephemeral_vars: Vec<Variable> = store.0.lock().unwrap().values().cloned().collect();
    tauri::async_runtime::spawn_blocking(move || {
        let mut resolver = cortex_core::variables::VariableResolver::new();
        populate_resolver(
            &mut resolver,
            workspace_path,
            collection_path,
            environment_name,
            ephemeral_vars,
        )?;
        Ok(resolver.get_all_resolved())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn preview_template(
    text: String,
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
    store: tauri::State<'_, EphemeralStore>,
) -> Result<PreviewResponse, String> {
    // Snapshot the ephemeral store before entering spawn_blocking (State is not Send).
    let ephemeral_vars: Vec<Variable> = store.0.lock().unwrap().values().cloned().collect();
    tauri::async_runtime::spawn_blocking(move || {
        let mut resolver = cortex_core::variables::VariableResolver::new();
        populate_resolver(
            &mut resolver,
            workspace_path,
            collection_path,
            environment_name,
            ephemeral_vars,
        )?;
        let result = resolver.render_masked(&text);
        Ok(PreviewResponse {
            text: result.text,
            warnings: result.warnings,
            syntax_errors: result.syntax_errors,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}
