use crate::state::{AppSettings, EphemeralStore, HistoryStore, RecentWorkspace};
use cortex_core::collection::Collection;
use cortex_core::request::{AuthRef, RequestFile, RequestHistoryEntry};
use cortex_core::variables::Variable;
use cortex_core::workspace::{Workspace, WorkspaceManifest};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;
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
    pub environments: Vec<cortex_core::environment::EnvironmentFile>,
    pub active_environment: Option<String>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct PreviewResponse {
    pub text: String,
    pub warnings: Vec<cortex_core::variables::UnresolvedVariableWarning>,
    pub syntax_errors: Vec<cortex_core::variables::TemplateSyntaxError>,
    pub captured_variables: BTreeMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type)]
pub struct HeaderEntry {
    pub key: String,
    pub value: String,
    pub enabled: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_valueless: Option<bool>,
}

#[derive(Serialize, Deserialize, Type)]
pub struct RenderedHeader {
    pub key: String,
    pub value: String,
}

#[derive(Serialize, Deserialize, Type)]
pub struct PreviewHeadersResponse {
    pub headers: Vec<RenderedHeader>,
    pub warnings: Vec<String>,
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
pub fn create_folder(name: String, parent_path: String) -> Result<String, String> {
    Collection::create_folder(&name, &PathBuf::from(parent_path))
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn duplicate_request(path: String) -> Result<String, String> {
    Collection::duplicate_request(&PathBuf::from(path))
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn open_in_explorer(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("-R")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg("/select,")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        let parent = path.parent().unwrap_or(&path);
        std::process::Command::new("xdg-open").arg(parent).spawn().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
#[specta::specta]
#[allow(dead_code)]
pub fn set_active_environment(name: Option<String>) -> Result<(), String> {
    let mut settings = AppSettings::load();
    settings.active_environment = name;
    settings.save().map_err(|e| e.to_string())
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
    let resolved_path = workspace.path.to_string_lossy().to_string();

    // Remember this workspace
    let mut settings = AppSettings::load();
    settings.last_workspace_path = Some(resolved_path.clone());

    // Update recent workspaces
    let recent =
        RecentWorkspace { name: workspace.manifest.name.clone(), path: resolved_path.clone() };
    settings.recent_workspaces.retain(|w| w.path != resolved_path);
    settings.recent_workspaces.insert(0, recent);
    settings.recent_workspaces.truncate(10);

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
        environments: workspace.environments,
        active_environment: settings.active_environment,
    })
}

#[tauri::command]
#[specta::specta]
pub fn load_workspace_manifest(path: String) -> Result<WorkspaceResponse, String> {
    let workspace = Workspace::load_manifest(&path).map_err(|e| e.to_string())?;
    let settings = AppSettings::load();

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
        environments: workspace.environments,
        active_environment: settings.active_environment,
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
    if path.exists() {
        return Err("A workspace already exists at this location.".to_string());
    }

    manifest.save(&path).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
#[specta::specta]
pub fn close_workspace() -> Result<(), String> {
    let mut settings = AppSettings::load();
    settings.last_workspace_path = None;
    settings.save().map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub fn create_collection(name: String, path: String) -> Result<String, String> {
    let manifest = cortex_core::collection::CollectionManifest::new(name);
    let path = PathBuf::from(path);
    if !path.exists() {
        std::fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }

    let collection =
        cortex_core::collection::Collection { path: path.clone(), manifest, items: Vec::new() };

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
pub fn get_recent_workspaces() -> Vec<RecentWorkspace> {
    AppSettings::load().recent_workspaces
}

#[tauri::command]
#[specta::specta]
pub fn get_last_workspace_path() -> Option<String> {
    AppSettings::load().last_workspace_path
}

#[tauri::command]
#[specta::specta]
pub fn get_app_settings() -> crate::state::AppSettings {
    crate::state::AppSettings::load()
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
    let mut builder = app.dialog().file().set_title(&title);
    if filter_ext != "*" && !filter_ext.is_empty() {
        builder = builder.add_filter(filter_name, &[&filter_ext]);
    }
    let file = builder.blocking_pick_file();
    Ok(file.map(|p| p.to_string()))
}

#[tauri::command]
#[specta::specta]
pub async fn save_file(
    app: tauri::AppHandle,
    title: String,
    filter_name: String,
    filter_ext: String,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let mut builder = app.dialog().file().set_title(&title);
    if filter_ext != "*" && !filter_ext.is_empty() {
        builder = builder.add_filter(filter_name, &[&filter_ext]);
    }
    let file = builder.blocking_save_file();
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
pub async fn update_collection_auth(
    collection_path: String,
    auth: Option<AuthRef>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut collection =
            Collection::load_manifest_no_envs(&collection_path).map_err(|e| e.to_string())?;
        collection.manifest.auth = auth;
        collection.save().map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn update_folder_auth(folder_path: String, auth: Option<AuthRef>) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let folder_path_buf = PathBuf::from(folder_path);
        let fy = folder_path_buf.join("folder.yaml");
        let mut fm = if fy.exists() {
            let content = std::fs::read_to_string(&fy).map_err(|e| e.to_string())?;
            cortex_core::collection::FolderManifest::from_yaml(&content)
                .map_err(|e| e.to_string())?
        } else {
            cortex_core::collection::FolderManifest { headers: None, auth: None }
        };
        fm.auth = auth;
        let yaml = fm.to_yaml().map_err(|e| e.to_string())?;
        std::fs::write(&fy, yaml).map_err(|e| e.to_string())?;
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn update_collection_headers(
    collection_path: String,
    headers: Option<std::collections::BTreeMap<String, String>>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut collection =
            Collection::load_manifest_no_envs(&collection_path).map_err(|e| e.to_string())?;
        collection.manifest.headers = headers;
        collection.save().map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn update_folder_headers(
    folder_path: String,
    headers: Option<std::collections::BTreeMap<String, String>>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let folder_path_buf = PathBuf::from(folder_path);
        let fy = folder_path_buf.join("folder.yaml");
        let mut fm = if fy.exists() {
            let content = std::fs::read_to_string(&fy).map_err(|e| e.to_string())?;
            cortex_core::collection::FolderManifest::from_yaml(&content)
                .map_err(|e| e.to_string())?
        } else {
            cortex_core::collection::FolderManifest { headers: None, auth: None }
        };
        fm.headers = headers;
        let yaml = fm.to_yaml().map_err(|e| e.to_string())?;
        std::fs::write(&fy, yaml).map_err(|e| e.to_string())?;
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn update_environment_variables(
    workspace_path: String,
    environment_name: String,
    variables: Vec<cortex_core::variables::Variable>,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let ws_path = std::path::PathBuf::from(&workspace_path);
        let env_dir = ws_path.parent().unwrap_or(std::path::Path::new(".")).join("environments");
        if !env_dir.exists() {
            std::fs::create_dir_all(&env_dir).map_err(|e| e.to_string())?;
        }

        let env_path = env_dir.join(format!("{}.yaml", environment_name));
        let mut env = cortex_core::environment::EnvironmentFile {
            version: "1".to_string(),
            name: environment_name,
            variables,
        };

        let key = cortex_core::crypto::get_app_key();
        env.encrypt_secrets(&key).map_err(|e| e.to_string())?;

        let yaml = env.to_yaml().map_err(|e| e.to_string())?;
        std::fs::write(env_path, yaml).map_err(|e| e.to_string())?;

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
#[specta::specta]
pub async fn delete_environment(
    workspace_path: String,
    environment_name: String,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let ws_path = std::path::PathBuf::from(&workspace_path);
        let env_dir = ws_path.parent().unwrap_or(std::path::Path::new(".")).join("environments");
        let env_path = env_dir.join(format!("{}.yaml", environment_name));

        if env_path.exists() {
            std::fs::remove_file(env_path).map_err(|e| e.to_string())?;
        }

        Ok(())
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
    value: serde_json::Value,
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
    _environment_name: Option<String>,
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
        let path = PathBuf::from(&wp);
        let abs_path = if path.is_absolute() {
            path
        } else {
            std::env::current_dir().map(|d| d.join(&path)).unwrap_or(path)
        };

        let workspace = Workspace::load_manifest(&abs_path).map_err(|e| e.to_string())?;

        // 1.1 Workspace variables (Global)
        if let Some(vars) = workspace.manifest.variables {
            for var in vars {
                resolver.global_vars.insert(var.name.clone(), var);
            }
        }

        // 1.2 Environment variables (Workspace-scoped)
        if let Some(en) = environment_name {
            if let Some(env) = workspace.environments.iter().find(|e| e.name == en) {
                for var in &env.variables {
                    resolver.env_vars.insert(var.name.clone(), var.clone());
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
            captured_variables: result.captured_variables,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

fn gather_and_render_headers(
    resolver: &mut cortex_core::variables::VariableResolver,
    collection_path: Option<String>,
    request_path: Option<String>,
    ui_headers: Vec<HeaderEntry>,
    render_unmasked: bool,
) -> (BTreeMap<String, String>, Vec<String>, BTreeMap<String, String>) {
    let mut raw_headers: BTreeMap<String, String> = BTreeMap::new();

    // A. Collection-level headers
    if let Some(col_path) = &collection_path {
        if let Ok(col) = cortex_core::collection::Collection::load_manifest_no_envs(col_path) {
            if let Some(h) = col.manifest.headers {
                for (k, v) in h {
                    raw_headers.insert(k, v);
                }
            }
        }
    }

    // B. Folder-level headers top-down
    if let (Some(req_path), Some(col_path)) = (&request_path, &collection_path) {
        let req_path_buf = PathBuf::from(req_path);
        let col_path_buf = PathBuf::from(col_path);
        let mut ancestors = Vec::new();
        let mut curr = req_path_buf.parent();
        while let Some(p) = curr {
            if p == col_path_buf || !p.starts_with(&col_path_buf) {
                break;
            }
            ancestors.push(p.to_path_buf());
            curr = p.parent();
        }
        ancestors.reverse();
        for folder_path in ancestors {
            let fy = folder_path.join("folder.yaml");
            if fy.exists() {
                if let Ok(content) = std::fs::read_to_string(&fy) {
                    if let Ok(fm) = cortex_core::collection::FolderManifest::from_yaml(&content) {
                        if let Some(h) = fm.headers {
                            for (k, v) in h {
                                raw_headers.insert(k, v);
                            }
                        }
                    }
                }
            }
        }
    }

    // C. Request-level headers from UI
    for h in ui_headers {
        if h.enabled {
            raw_headers.insert(h.key, h.value);
        }
    }

    let mut rendered_headers = BTreeMap::new();
    let mut warnings = Vec::new();
    let mut all_captured = BTreeMap::new();

    for (raw_key, raw_val) in raw_headers {
        let res_key = if render_unmasked {
            resolver.render(&raw_key)
        } else {
            resolver.render_masked(&raw_key)
        };
        let res_val = if render_unmasked {
            resolver.render(&raw_val)
        } else {
            resolver.render_masked(&raw_val)
        };

        all_captured.extend(res_key.captured_variables);
        all_captured.extend(res_val.captured_variables);

        let final_key = res_key.text.trim().to_string();
        if final_key.is_empty() {
            warnings.push(format!(
                "Header key '{}' resolved to an empty string and was omitted.",
                raw_key
            ));
        } else {
            rendered_headers.insert(final_key, res_val.text);
        }
    }

    (rendered_headers, warnings, all_captured)
}

#[tauri::command]
#[specta::specta]
pub async fn preview_request_headers(
    headers: Vec<HeaderEntry>,
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
    request_path: Option<String>,
    store: tauri::State<'_, EphemeralStore>,
) -> Result<PreviewHeadersResponse, String> {
    let ephemeral_vars: Vec<Variable> = store.0.lock().unwrap().values().cloned().collect();
    tauri::async_runtime::spawn_blocking(move || {
        let mut resolver = cortex_core::variables::VariableResolver::new();
        populate_resolver(
            &mut resolver,
            workspace_path,
            collection_path.clone(),
            environment_name,
            ephemeral_vars,
        )?;

        let (rendered_headers, warnings, _) =
            gather_and_render_headers(&mut resolver, collection_path, request_path, headers, false);

        let headers_list = rendered_headers
            .into_iter()
            .map(|(key, value)| RenderedHeader { key, value })
            .collect();

        Ok(PreviewHeadersResponse { headers: headers_list, warnings })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(Serialize, Deserialize, Type)]
pub struct RequestMetadata {
    pub workspace_path: Option<String>,
    pub collection_path: Option<String>,
    pub environment_name: Option<String>,
    pub request_path: Option<String>,
}

fn inject_query_param(url: &mut String, key: &str, value: &str) {
    if url.contains('?') {
        if let Some(pos) = url.find('?') {
            let base = &url[..pos];
            let query = &url[pos + 1..];
            let mut params: Vec<(String, String)> = Vec::new();
            let mut replaced = false;
            for part in query.split('&') {
                if part.is_empty() {
                    continue;
                }
                let mut kv = part.splitn(2, '=');
                let k = kv.next().unwrap_or("").to_string();
                let v = kv.next().unwrap_or("").to_string();
                if k == key {
                    params.push((k, value.to_string()));
                    replaced = true;
                } else {
                    params.push((k, v));
                }
            }
            if !replaced {
                params.push((key.to_string(), value.to_string()));
            }
            let new_query: Vec<String> =
                params.iter().map(|(k, v)| format!("{}={}", k, v)).collect();
            *url = format!("{}?{}", base, new_query.join("&"));
        }
    } else {
        *url = format!("{}?{}={}", url, key, value);
    }
}

fn inject_header_case_insensitive(headers: &mut BTreeMap<String, String>, key: &str, value: &str) {
    let key_lower = key.to_lowercase();
    let keys_to_remove: Vec<String> =
        headers.keys().filter(|k| k.to_lowercase() == key_lower).cloned().collect();
    for k in keys_to_remove {
        headers.remove(&k);
    }
    headers.insert(key.to_string(), value.to_string());
}

fn resolve_effective_auth(
    request_path: &Option<String>,
    collection_path: &Option<String>,
    request_auth: &Option<AuthRef>,
) -> Result<Option<AuthRef>, String> {
    if let Some(auth) = request_auth {
        return Ok(Some(auth.clone()));
    }

    if let (Some(req_path_str), Some(col_path_str)) = (request_path, collection_path) {
        let req_path = PathBuf::from(req_path_str);
        let col_path = PathBuf::from(col_path_str);

        let mut current_dir = if req_path.is_file() {
            req_path.parent().map(|p| p.to_path_buf())
        } else {
            Some(req_path)
        };

        while let Some(ref dir) = current_dir {
            if !dir.starts_with(&col_path) {
                break;
            }

            let folder_yaml = dir.join("folder.yaml");
            if folder_yaml.exists() {
                if let Ok(content) = std::fs::read_to_string(&folder_yaml) {
                    if let Ok(manifest) =
                        cortex_core::collection::FolderManifest::from_yaml(&content)
                    {
                        if let Some(auth) = manifest.auth {
                            return Ok(Some(auth));
                        }
                    }
                }
            }

            if dir == &col_path {
                break;
            }
            current_dir = dir.parent().map(|p| p.to_path_buf());
        }
    }

    if let Some(col_path_str) = collection_path {
        let col_path = PathBuf::from(col_path_str);
        let cortex_yaml = col_path.join("cortex.yaml");
        if cortex_yaml.exists() {
            if let Ok(collection) = Collection::load_manifest_no_envs(col_path_str) {
                if let Some(auth) = collection.manifest.auth {
                    return Ok(Some(auth));
                }
            }
        }
    }

    Ok(None)
}

#[derive(Serialize, Deserialize, Type)]
pub struct SendRequestPayload {
    pub request_id: String,
    pub request_name: String,
    pub method: String,
    pub url: String,
    pub headers: Vec<HeaderEntry>,
    pub auth: Option<AuthRef>,
    pub body: Option<cortex_core::request::RequestBody>,
    pub settings: Option<cortex_core::request::Settings>,
}

fn get_body_bytes(body: &Option<cortex_core::request::RequestBody>) -> Vec<u8> {
    if let Some(b) = body {
        match b.active_type.as_deref() {
            Some("none") => Vec::new(),
            Some("json") => b.json.as_ref().map(|s| s.as_bytes().to_vec()).unwrap_or_default(),
            Some("raw") => b.raw_text.as_ref().map(|s| s.as_bytes().to_vec()).unwrap_or_default(),
            Some("url_encoded") => {
                let mut params = Vec::new();
                if let Some(fields) = &b.url_encoded {
                    for field in fields {
                        if field.enabled {
                            let k_enc = percent_encoding::utf8_percent_encode(
                                &field.key,
                                percent_encoding::NON_ALPHANUMERIC,
                            )
                            .to_string();
                            let v_enc = percent_encoding::utf8_percent_encode(
                                &field.value,
                                percent_encoding::NON_ALPHANUMERIC,
                            )
                            .to_string();
                            params.push(format!("{}={}", k_enc, v_enc));
                        }
                    }
                }
                params.join("&").into_bytes()
            }
            Some("file") => {
                if let Some(file_path) = &b.file_path {
                    std::fs::read(file_path).unwrap_or_default()
                } else {
                    Vec::new()
                }
            }
            _ => {
                if let Some(text) = &b.text {
                    text.as_bytes().to_vec()
                } else if let Some(json) = &b.json {
                    json.as_bytes().to_vec()
                } else {
                    Vec::new()
                }
            }
        }
    } else {
        Vec::new()
    }
}

#[tauri::command]
#[specta::specta]
pub async fn send_request(
    payload: SendRequestPayload,
    metadata: RequestMetadata,
    ephemeral_store: tauri::State<'_, EphemeralStore>,
    history_store: tauri::State<'_, HistoryStore>,
    app_state: tauri::State<'_, crate::state::AppState>,
) -> Result<RequestHistoryEntry, String> {
    let ephemeral_vars: Vec<Variable> =
        ephemeral_store.0.lock().unwrap().values().cloned().collect();

    let method_for_signing = payload.method.clone();
    let (url, body, rendered_headers, warnings, captured_variables, timeout_ms, follow_redirects, digest_auth) =
        tauri::async_runtime::spawn_blocking(move || {
            let mut resolver = cortex_core::variables::VariableResolver::new();
            populate_resolver(
                &mut resolver,
                metadata.workspace_path,
                metadata.collection_path.clone(),
                metadata.environment_name,
                ephemeral_vars,
            )?;

            let result = resolver.render(&payload.url);
            let mut captured = result.captured_variables;

            let mut body_warnings = Vec::new();

            // Resolve settings timeout variable
            let mut resolved_timeout: Option<u32> = None;
            let app_settings = crate::state::AppSettings::load();
            let mut follow_redirects = app_settings.redirect_behavior == "follow";

            if let Some(ref s) = payload.settings {
                if let Some(ref t_str) = s.timeout {
                    if !t_str.trim().is_empty() {
                        let render_res = resolver.render(t_str);
                        for w in &render_res.warnings {
                            body_warnings.push(format!("Variable '{}' not found in Timeout setting", w.name));
                        }
                        captured.extend(render_res.captured_variables);
                        let text = render_res.text.trim();
                        if !text.is_empty() {
                            match text.parse::<u32>() {
                                Ok(val) => {
                                    if val == 0 {
                                        return Err("Validation Error: Timeout value cannot be zero".to_string());
                                    }
                                    resolved_timeout = Some(val);
                                }
                                Err(_) => {
                                    return Err(format!("Validation Error: Timeout value '{}' is not a valid positive integer", text));
                                }
                            }
                        }
                    }
                }

                if let Some(ref rb) = s.redirect_behavior {
                    if rb == "follow" {
                        follow_redirects = true;
                    } else if rb == "manual" {
                        follow_redirects = false;
                    }
                }
            }

            let timeout_val = resolved_timeout.unwrap_or(app_settings.timeout);

            let req_body = if let Some(mut b) = payload.body {
                match b.active_type.as_deref() {
                    Some("json") => {
                        if let Some(json_str) = b.json.as_ref() {
                            let render_res = resolver.render(json_str);
                            captured.extend(render_res.captured_variables);
                            for w in &render_res.warnings {
                                body_warnings.push(format!("Variable '{}' not found in JSON body", w.name));
                            }
                            b.json = Some(render_res.text);
                        }
                    }
                    Some("form_data") => {
                        if let Some(fields) = b.form_data.as_mut() {
                            for field in fields {
                                if !field.is_file && field.enabled {
                                    let render_res = resolver.render(&field.value);
                                    captured.extend(render_res.captured_variables);
                                    for w in &render_res.warnings {
                                        body_warnings.push(format!("Variable '{}' not found in form-data field '{}'", w.name, field.key));
                                    }
                                    field.value = render_res.text;
                                }
                            }
                        }
                    }
                    Some("url_encoded") => {
                        if let Some(fields) = b.url_encoded.as_mut() {
                            for field in fields {
                                if field.enabled {
                                    let render_res = resolver.render(&field.value);
                                    captured.extend(render_res.captured_variables);
                                    for w in &render_res.warnings {
                                        body_warnings.push(format!("Variable '{}' not found in URL-encoded field '{}'", w.name, field.key));
                                    }
                                    field.value = render_res.text;
                                }
                            }
                        }
                    }
                    Some("raw") => {
                        if let Some(raw_str) = b.raw_text.as_ref() {
                            let render_res = resolver.render(raw_str);
                            captured.extend(render_res.captured_variables);
                            for w in &render_res.warnings {
                                body_warnings.push(format!("Variable '{}' not found in raw body", w.name));
                            }
                            b.raw_text = Some(render_res.text);
                        }
                    }
                    Some("file") => {
                        // Placeholders are not resolved in binary file body.
                    }
                    _ => {
                        if let Some(text_str) = b.text.as_ref() {
                            let render_res = resolver.render(text_str);
                            captured.extend(render_res.captured_variables);
                            for w in &render_res.warnings {
                                body_warnings.push(format!("Variable '{}' not found in body text", w.name));
                            }
                            b.text = Some(render_res.text);
                        }
                        if let Some(json_str) = b.json.as_ref() {
                            let render_res = resolver.render(json_str);
                            captured.extend(render_res.captured_variables);
                            for w in &render_res.warnings {
                                body_warnings.push(format!("Variable '{}' not found in JSON body", w.name));
                            }
                            b.json = Some(render_res.text);
                        }
                        if let Some(form) = b.form.as_mut() {
                            for (key, value) in form.iter_mut() {
                                let render_res = resolver.render(value);
                                captured.extend(render_res.captured_variables);
                                for w in &render_res.warnings {
                                    body_warnings.push(format!("Variable '{}' not found in form field '{}'", w.name, key));
                                }
                                *value = render_res.text;
                            }
                        }
                    }
                }
                Some(b)
            } else {
                None
            };

            // Pre-send validation
            if let Some(ref b) = req_body {
                match b.active_type.as_deref() {
                    Some("json") => {
                        if let Some(json_str) = b.json.as_ref() {
                            if !json_str.trim().is_empty() {
                                if let Err(e) = serde_json::from_str::<serde_json::Value>(json_str) {
                                    return Err(format!("Validation Error: Invalid JSON body: {}", e));
                                }
                            }
                        }
                    }
                    Some("form_data") => {
                        if let Some(fields) = b.form_data.as_ref() {
                            for field in fields {
                                if field.enabled {
                                    if field.key.trim().is_empty() {
                                        return Err("Validation Error: Form-Data contains an enabled row with an empty key".to_string());
                                    }
                                    if field.is_file {
                                        if field.file_path.trim().is_empty() {
                                            return Err(format!("Validation Error: Form-Data key '{}' expects a file but no path is selected", field.key));
                                        }
                                        if !std::path::Path::new(&field.file_path).exists() {
                                            return Err(format!("Validation Error: Form-Data upload file does not exist on disk: '{}'", field.file_path));
                                        }
                                    }
                                }
                            }
                        }
                    }
                    Some("file") => {
                        if let Some(file_path) = b.file_path.as_ref() {
                            if file_path.trim().is_empty() {
                                return Err("Validation Error: No file path selected for binary upload".to_string());
                            }
                            if !std::path::Path::new(file_path).exists() {
                                return Err(format!("Validation Error: Binary upload file does not exist on disk: '{}'", file_path));
                            }
                        } else {
                            return Err("Validation Error: No file path selected for binary upload".to_string());
                        }
                    }
                    _ => {}
                }
            }

            let (mut rendered_headers, headers_warnings, headers_captured) = gather_and_render_headers(
                &mut resolver,
                metadata.collection_path.clone(),
                metadata.request_path.clone(),
                payload.headers,
                true,
            );
            captured.extend(headers_captured);

            // Resolve effective auth
            let effective_auth = resolve_effective_auth(
                &metadata.request_path,
                &metadata.collection_path,
                &payload.auth,
            )?;

            let mut final_url = result.text.clone();
            let mut digest_auth_tuple = None;

            if let Some(auth) = effective_auth {
                if auth.r#type != "none" {
                    // Pre-send validation checks
                    let mut resolved_config = BTreeMap::new();
                    for (k, v) in &auth.config {
                        let render_res = resolver.render(v);
                        captured.extend(render_res.captured_variables);

                        // Check for nested variable placeholders
                        if render_res.text.contains("{{") && render_res.text.contains("}}") {
                            body_warnings.push("Warning: Auth value contains nested variable placeholders which were not recursively expanded.".to_string());
                        }

                        resolved_config.insert(k.clone(), render_res.text);
                    }

                    // 1. Required fields check
                    if auth.r#type == "bearer_token" {
                        let token = resolved_config.get("token").cloned().unwrap_or_default();
                        if token.trim().is_empty() {
                            return Err("Validation Error: Bearer Token is empty after variable resolution.".to_string());
                        }

                        // 2. HTTP header safety checks
                        if !token.chars().all(|c| c.is_ascii() && !c.is_control() && c != '\r' && c != '\n') {
                            return Err("Validation Error: Auth value contains invalid characters for an HTTP header.".to_string());
                        }

                        // Inject Bearer Token
                        let header_val = format!("Bearer {}", token);
                        inject_header_case_insensitive(&mut rendered_headers, "Authorization", &header_val);
                    } else if auth.r#type == "api_key" {
                        let key_name = resolved_config.get("key").cloned().unwrap_or_default();
                        let key_value = resolved_config.get("value").cloned().unwrap_or_default();
                        let placement = resolved_config.get("addTo").cloned().unwrap_or_else(|| "header".to_string());

                        if key_name.trim().is_empty() || key_value.trim().is_empty() {
                            return Err("Validation Error: API Key auth is incomplete after variable resolution.".to_string());
                        }

                        if placement == "header" {
                            // HTTP header safety checks
                            if !key_name.chars().all(|c| c.is_ascii() && !c.is_control() && c != '\r' && c != '\n')
                                || !key_value.chars().all(|c| c.is_ascii() && !c.is_control() && c != '\r' && c != '\n')
                            {
                                return Err("Validation Error: Auth value contains invalid characters for an HTTP header.".to_string());
                            }

                            inject_header_case_insensitive(&mut rendered_headers, &key_name, &key_value);
                        } else {
                            inject_query_param(&mut final_url, &key_name, &key_value);
                        }
                    } else if auth.r#type == "basic" {
                        let username = resolved_config.get("username").cloned().unwrap_or_default();
                        let password = resolved_config.get("password").cloned().unwrap_or_default();

                        if username.trim().is_empty() && password.trim().is_empty() {
                            return Err("Validation Error: Basic Auth credentials are empty after variable resolution.".to_string());
                        }

                        use base64::Engine;
                        let credentials = format!("{}:{}", username, password);
                        let encoded = base64::engine::general_purpose::STANDARD.encode(credentials.as_bytes());
                        let header_val = format!("Basic {}", encoded);
                        inject_header_case_insensitive(&mut rendered_headers, "Authorization", &header_val);
                    } else if auth.r#type == "digest" {
                        let username = resolved_config.get("username").cloned().unwrap_or_default();
                        let password = resolved_config.get("password").cloned().unwrap_or_default();

                        if username.trim().is_empty() && password.trim().is_empty() {
                            return Err("Validation Error: Digest Auth credentials are empty after variable resolution.".to_string());
                        }

                        digest_auth_tuple = Some((username, password));
                    } else if auth.r#type == "oauth2" {
                        let mut access_token = resolved_config.get("accessToken").cloned().unwrap_or_default();
                        let refresh_token = resolved_config.get("refreshToken").cloned().unwrap_or_default();
                        let token_endpoint = resolved_config.get("tokenEndpoint").cloned().unwrap_or_default();
                        let client_id = resolved_config.get("clientId").cloned().unwrap_or_default();
                        let client_secret = resolved_config.get("clientSecret").cloned();
                        let additional_params = resolved_config.get("additionalParams").cloned();
                        let expires_at_str = resolved_config.get("expiresAt").cloned().unwrap_or_default();
                        let prefix = resolved_config.get("tokenHeaderPrefix").cloned().unwrap_or_else(|| "Bearer".to_string());
                        let prefix = if prefix.trim().is_empty() { "Bearer".to_string() } else { prefix.trim().to_string() };

                        let current_time = std::time::SystemTime::now().duration_since(std::time::SystemTime::UNIX_EPOCH).unwrap_or_default().as_secs();
                        let is_expired = if expires_at_str.is_empty() {
                            false
                        } else if let Ok(exp) = expires_at_str.parse::<u64>() {
                            current_time >= exp
                        } else {
                            false
                        };

                        if is_expired && !refresh_token.is_empty() && !token_endpoint.is_empty() && !client_id.is_empty() {
                            let client = reqwest::Client::new();
                            let mut params = std::collections::BTreeMap::new();
                            params.insert("grant_type".to_string(), "refresh_token".to_string());
                            params.insert("refresh_token".to_string(), refresh_token.clone());
                            params.insert("client_id".to_string(), client_id.clone());
                            if let Some(ref sec) = client_secret {
                                if !sec.is_empty() {
                                    params.insert("client_secret".to_string(), sec.clone());
                                }
                            }
                            if let Some(ref add_params) = additional_params {
                                for pair in add_params.trim().split('&') {
                                    if pair.is_empty() { continue; }
                                    let mut kv = pair.splitn(2, '=');
                                    let k = kv.next().unwrap_or("").to_string();
                                    let v = kv.next().unwrap_or("").to_string();
                                    let decoded_v = percent_encoding::percent_decode_str(&v).decode_utf8_lossy().into_owned();
                                    params.insert(k, decoded_v);
                                }
                            }

                            let refresh_result = tokio::runtime::Handle::current().block_on(async {
                                client.post(&token_endpoint).form(&params).send().await
                            });

                            match refresh_result {
                                Ok(resp) => {
                                    if resp.status().is_success() {
                                        let token_resp: Result<serde_json::Value, _> = tokio::runtime::Handle::current().block_on(async {
                                            resp.json().await
                                        });
                                        if let Ok(token_json) = token_resp {
                                            if let Some(new_at) = token_json.get("access_token").and_then(|v| v.as_str()) {
                                                access_token = new_at.to_string();
                                                let new_rt = token_json.get("refresh_token").and_then(|v| v.as_str()).map(|s| s.to_string());
                                                let mut new_exp = None;
                                                if let Some(expires_in) = token_json.get("expires_in") {
                                                    let sec = expires_in.as_u64()
                                                        .or_else(|| expires_in.as_str().and_then(|s| s.parse::<u64>().ok()));
                                                    if let Some(s) = sec {
                                                        let now = std::time::SystemTime::now().duration_since(std::time::SystemTime::UNIX_EPOCH).unwrap_or_default().as_secs();
                                                        new_exp = Some((now + s).to_string());
                                                    }
                                                }

                                                let _ = save_refreshed_oauth_token(
                                                    &metadata.request_path,
                                                    &metadata.collection_path,
                                                    &payload.auth,
                                                    &access_token,
                                                    &new_rt,
                                                    &new_exp,
                                                );
                                            }
                                        }
                                    } else {
                                        let err_text = tokio::runtime::Handle::current().block_on(async {
                                            resp.text().await.unwrap_or_default()
                                        });
                                        body_warnings.push(format!("Transparent OAuth 2.0 refresh failed: {}", err_text));
                                    }
                                }
                                Err(e) => {
                                    body_warnings.push(format!("Transparent OAuth 2.0 refresh network error: {}", e));
                                }
                            }
                        }

                        if access_token.trim().is_empty() {
                            return Err("Validation Error: OAuth 2.0 access token is empty or expired, and could not be refreshed.".to_string());
                        }

                        if !access_token.chars().all(|c| c.is_ascii() && !c.is_control() && c != '\r' && c != '\n') {
                            return Err("Validation Error: Auth value contains invalid characters for an HTTP header.".to_string());
                        }

                        let header_val = format!("{} {}", prefix, access_token);
                        inject_header_case_insensitive(&mut rendered_headers, "Authorization", &header_val);
                    } else if auth.r#type == "aws_sigv4" {
                        let region = resolved_config.get("region").cloned().unwrap_or_default();
                        let service = resolved_config.get("service").cloned().unwrap_or_default();
                        let access_key_id = resolved_config.get("accessKeyId").cloned().unwrap_or_default();
                        let secret_access_key = resolved_config.get("secretAccessKey").cloned().unwrap_or_default();
                        let session_token = resolved_config.get("sessionToken").cloned();

                        if region.trim().is_empty()
                            || service.trim().is_empty()
                            || access_key_id.trim().is_empty()
                            || secret_access_key.trim().is_empty()
                        {
                            return Err("Validation Error: AWS SigV4 auth is incomplete after variable resolution.".to_string());
                        }

                        let body_bytes = get_body_bytes(&req_body);

                        cortex_core::aws_sigv4::sign_request(
                            &method_for_signing,
                            &final_url,
                            &mut rendered_headers,
                            &body_bytes,
                            &region,
                            &service,
                            &access_key_id,
                            &secret_access_key,
                            session_token.as_deref(),
                        )?;
                    }
                }
            }

            let mut all_warnings = result
                .warnings
                .iter()
                .map(|w| format!("Variable '{}' not found in URL", w.name))
                .collect::<Vec<_>>();
            all_warnings.extend(headers_warnings);
            all_warnings.extend(body_warnings);

            let mut masked_captured = BTreeMap::new();
            for (k, v) in captured {
                if let Some(resolved) = resolver.resolve(&k) {
                    if resolved.secret {
                        masked_captured.insert(k, "********".to_string());
                        continue;
                    }
                }
                masked_captured.insert(k, v);
            }

            Ok::<
                (
                    String,
                    Option<cortex_core::request::RequestBody>,
                    BTreeMap<String, String>,
                    Vec<String>,
                    BTreeMap<String, String>,
                    Option<u32>,
                    bool,
                    Option<(String, String)>,
                ),
                String,
            >((final_url, req_body, rendered_headers, all_warnings, masked_captured, Some(timeout_val), follow_redirects, digest_auth_tuple))
        })
        .await
        .map_err(|e| e.to_string())??;

    let executor = app_state.executor.clone();
    let history_store_inner = history_store.inner().clone();
    let handle = tokio::spawn(async move {
        let mut entry = executor
            .execute(
                payload.request_name,
                &payload.method,
                &url,
                rendered_headers,
                body,
                timeout_ms,
                follow_redirects,
                digest_auth,
            )
            .await;

        entry.captured_variables = captured_variables;
        entry.warnings = warnings;

        history_store_inner.add_entry(entry.clone());
        entry
    });

    // Register handle for cancellation
    let id_for_cancel = payload.request_id.clone();
    {
        let mut requests = app_state.requests.lock().unwrap();
        requests.insert(id_for_cancel.clone(), handle.abort_handle());
    }

    let result = handle.await.map_err(|e| e.to_string())?;

    // Unregister handle
    {
        let mut requests = app_state.requests.lock().unwrap();
        requests.remove(&id_for_cancel);
    }

    Ok(result)
}

#[tauri::command]
#[specta::specta]
pub fn cancel_request(
    request_id: String,
    app_state: tauri::State<'_, crate::state::AppState>,
) -> Result<(), String> {
    let mut requests = app_state.requests.lock().unwrap();
    if let Some(handle) = requests.remove(&request_id) {
        handle.abort();
    }
    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_request_history(store: tauri::State<'_, HistoryStore>) -> Vec<RequestHistoryEntry> {
    store.get_entries()
}

#[tauri::command]
#[specta::specta]
pub fn clear_request_history(store: tauri::State<'_, HistoryStore>) {
    store.clear()
}

#[derive(Serialize, Deserialize, Type)]
pub struct IntrospectionPayload {
    pub endpoint_url: String,
    pub headers: Vec<HeaderEntry>,
}

#[tauri::command]
#[specta::specta]
pub async fn introspect_graphql(
    payload: IntrospectionPayload,
    workspace_path: Option<String>,
    collection_path: Option<String>,
    environment_name: Option<String>,
    request_path: Option<String>,
    ephemeral_store: tauri::State<'_, EphemeralStore>,
    history_store: tauri::State<'_, HistoryStore>,
) -> Result<RequestHistoryEntry, String> {
    let ephemeral_vars: Vec<Variable> =
        ephemeral_store.0.lock().unwrap().values().cloned().collect();

    let entry = tauri::async_runtime::spawn_blocking(move || {
        let mut resolver = cortex_core::variables::VariableResolver::new();
        populate_resolver(
            &mut resolver,
            workspace_path,
            collection_path.clone(),
            environment_name,
            ephemeral_vars,
        )?;

        let mut missing_vars = Vec::new();

        let result = resolver.render(&payload.endpoint_url);
        for w in &result.warnings {
            missing_vars.push(w.name.clone());
        }

        for h in &payload.headers {
            if h.enabled {
                let res_k = resolver.render(&h.key);
                for w in res_k.warnings {
                    missing_vars.push(w.name);
                }
                let res_v = resolver.render(&h.value);
                for w in res_v.warnings {
                    missing_vars.push(w.name);
                }
            }
        }

        if !missing_vars.is_empty() {
            missing_vars.sort();
            missing_vars.dedup();
            return Err(format!(
                "Missing required variable(s) for GraphQL introspection: {}",
                missing_vars.join(", ")
            ));
        }

        let (rendered_headers, header_warnings, headers_captured) = gather_and_render_headers(
            &mut resolver,
            collection_path,
            request_path,
            payload.headers,
            true,
        );

        let mut captured_variables = result.captured_variables;
        captured_variables.extend(headers_captured);

        let executed_at = RequestHistoryEntry::now_iso();
        let id = RequestHistoryEntry::random_id();

        let status_code = Some(200);
        let response_body = Some(format!(
            "{{\n  \"data\": {{\n    \"__schema\": {{\n      \"queryType\": {{ \"name\": \"Query\" }},\n      \"mutationType\": {{ \"name\": \"Mutation\" }},\n      \"subscriptionType\": null,\n      \"types\": [\n        {{ \"kind\": \"OBJECT\", \"name\": \"Query\", \"description\": \"Root Query\" }}\n      ]\n    }}\n  }},\n  \"status\": \"success\",\n  \"message\": \"GraphQL schema introspection successful\",\n  \"introspected_endpoint\": \"{}\"\n}}",
            result.text.escape_default()
        ));

        Ok::<RequestHistoryEntry, String>(RequestHistoryEntry {
            id,
            request_name: "GraphQL Schema Introspection".to_string(),
            method: "POST".to_string(),
            raw_url: payload.endpoint_url,
            rendered_url: result.text,
            captured_variables,
            executed_at,
            duration_ms: None,
            status_code,
            status_text: Some("OK".to_string()),
            response_body,
            headers: rendered_headers,
            error: None,
            warnings: header_warnings,
            redirect_chain: Vec::new(),
        })
    })
    .await
    .map_err(|e| e.to_string())??;

    history_store.add_entry(entry.clone());
    Ok(entry)
}

fn open_browser_url(url: &str) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open").arg(url).spawn().map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .arg("/C")
            .arg(format!("start {}", url))
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open").arg(url).spawn().map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn save_refreshed_oauth_token(
    request_path: &Option<String>,
    collection_path: &Option<String>,
    payload_auth: &Option<AuthRef>,
    new_access_token: &str,
    new_refresh_token: &Option<String>,
    new_expires_at: &Option<String>,
) -> Result<(), String> {
    if payload_auth.is_some() {
        if let Some(ref req_path_str) = request_path {
            let path = PathBuf::from(req_path_str);
            if path.exists() {
                let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
                let mut req_file = RequestFile::from_yaml(&content).map_err(|e| e.to_string())?;
                if let Some(mut req_auth) = req_file.auth {
                    if req_auth.r#type == "oauth2" {
                        req_auth
                            .config
                            .insert("accessToken".to_string(), new_access_token.to_string());
                        if let Some(ref rt) = new_refresh_token {
                            req_auth.config.insert("refreshToken".to_string(), rt.clone());
                        }
                        if let Some(ref exp) = new_expires_at {
                            req_auth.config.insert("expiresAt".to_string(), exp.clone());
                        }
                        req_file.auth = Some(req_auth);
                        Collection::save_request(&req_file, &path).map_err(|e| e.to_string())?;
                    }
                }
            }
        }
        return Ok(());
    }

    if let (Some(req_path_str), Some(col_path_str)) = (request_path, collection_path) {
        let req_path = PathBuf::from(req_path_str);
        let col_path = PathBuf::from(col_path_str);

        let mut current_dir = if req_path.is_file() {
            req_path.parent().map(|p| p.to_path_buf())
        } else {
            Some(req_path.clone())
        };

        while let Some(ref dir) = current_dir {
            if !dir.starts_with(&col_path) {
                break;
            }

            let folder_yaml = dir.join("folder.yaml");
            if folder_yaml.exists() {
                let content = std::fs::read_to_string(&folder_yaml).map_err(|e| e.to_string())?;
                if let Ok(mut fm) = cortex_core::collection::FolderManifest::from_yaml(&content) {
                    if let Some(mut auth) = fm.auth {
                        if auth.r#type == "oauth2" {
                            auth.config
                                .insert("accessToken".to_string(), new_access_token.to_string());
                            if let Some(ref rt) = new_refresh_token {
                                auth.config.insert("refreshToken".to_string(), rt.clone());
                            }
                            if let Some(ref exp) = new_expires_at {
                                auth.config.insert("expiresAt".to_string(), exp.clone());
                            }
                            fm.auth = Some(auth);
                            let yaml = fm.to_yaml().map_err(|e| e.to_string())?;
                            std::fs::write(&folder_yaml, yaml).map_err(|e| e.to_string())?;
                            return Ok(());
                        }
                    }
                }
            }

            if dir == &col_path {
                break;
            }
            current_dir = dir.parent().map(|p| p.to_path_buf());
        }
    }

    if let Some(col_path_str) = collection_path {
        let col_path = PathBuf::from(col_path_str);
        let cortex_yaml = col_path.join("cortex.yaml");
        if cortex_yaml.exists() {
            let mut collection =
                Collection::load_manifest_no_envs(col_path_str).map_err(|e| e.to_string())?;
            if let Some(mut auth) = collection.manifest.auth {
                if auth.r#type == "oauth2" {
                    auth.config.insert("accessToken".to_string(), new_access_token.to_string());
                    if let Some(ref rt) = new_refresh_token {
                        auth.config.insert("refreshToken".to_string(), rt.clone());
                    }
                    if let Some(ref exp) = new_expires_at {
                        auth.config.insert("expiresAt".to_string(), exp.clone());
                    }
                    collection.manifest.auth = Some(auth);
                    collection.save().map_err(|e| e.to_string())?;
                    return Ok(());
                }
            }
        }
    }

    Ok(())
}

#[derive(serde::Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct OAuth2FetchPayload {
    pub grant_type: String,
    pub token_endpoint: Option<String>,
    pub auth_endpoint: Option<String>,
    pub client_id: Option<String>,
    pub client_secret: Option<String>,
    pub scope: Option<String>,
    pub username: Option<String>,
    pub password: Option<String>,
    pub additional_params: Option<String>,
    pub redirect_uri_mode: Option<String>,
    pub custom_redirect_uri: Option<String>,
    pub workspace_path: Option<String>,
    pub collection_path: Option<String>,
    pub environment_name: Option<String>,
}

#[tauri::command]
#[specta::specta]
pub async fn oauth2_fetch_token(
    payload: OAuth2FetchPayload,
    ephemeral_store: tauri::State<'_, EphemeralStore>,
) -> Result<std::collections::BTreeMap<String, String>, String> {
    let ephemeral_vars: Vec<Variable> =
        ephemeral_store.0.lock().unwrap().values().cloned().collect();

    let (
        grant_type,
        token_endpoint,
        auth_endpoint,
        client_id,
        client_secret,
        scope,
        username,
        password,
        additional_params,
        redirect_uri_mode,
        custom_redirect_uri,
    ) = tauri::async_runtime::spawn_blocking(move || {
        let mut resolver = cortex_core::variables::VariableResolver::new();
        populate_resolver(
            &mut resolver,
            payload.workspace_path,
            payload.collection_path,
            payload.environment_name,
            ephemeral_vars,
        )?;

        let grant_type = resolver.render(&payload.grant_type).text;
        let token_endpoint = payload.token_endpoint.map(|v| resolver.render(&v).text);
        let auth_endpoint = payload.auth_endpoint.map(|v| resolver.render(&v).text);
        let client_id = payload.client_id.map(|v| resolver.render(&v).text);
        let client_secret = payload.client_secret.map(|v| resolver.render(&v).text);
        let scope = payload.scope.map(|v| resolver.render(&v).text);
        let username = payload.username.map(|v| resolver.render(&v).text);
        let password = payload.password.map(|v| resolver.render(&v).text);
        let additional_params = payload.additional_params.map(|v| resolver.render(&v).text);
        let redirect_uri_mode = payload.redirect_uri_mode.map(|v| resolver.render(&v).text);
        let custom_redirect_uri = payload.custom_redirect_uri.map(|v| resolver.render(&v).text);

        Ok::<
            (
                String,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
                Option<String>,
            ),
            String,
        >((
            grant_type,
            token_endpoint,
            auth_endpoint,
            client_id,
            client_secret,
            scope,
            username,
            password,
            additional_params,
            redirect_uri_mode,
            custom_redirect_uri,
        ))
    })
    .await
    .map_err(|e| e.to_string())??;

    let client = reqwest::Client::new();

    if grant_type == "authorization_code" || grant_type == "implicit" {
        let auth_ep =
            auth_endpoint.ok_or("Authorization Endpoint is required for this grant type.")?;
        let client_id_str = client_id.ok_or("Client ID is required.")?;
        let scope_str = scope.unwrap_or_default();
        let state = format!("{:x}", rand::random::<u64>());

        let mut bind_addr = "127.0.0.1:0".to_string();
        let mut redirect_uri = "".to_string();

        if let (Some(mode), Some(custom_uri)) =
            (redirect_uri_mode.as_deref(), custom_redirect_uri.as_deref())
        {
            if mode == "custom" && !custom_uri.is_empty() {
                redirect_uri = custom_uri.to_string();
                if let Ok(parsed_url) = reqwest::Url::parse(custom_uri) {
                    let host = parsed_url.host_str().unwrap_or("");
                    if host == "localhost" || host == "127.0.0.1" {
                        let port = parsed_url.port().unwrap_or(80);
                        bind_addr = format!("127.0.0.1:{}", port);
                    }
                }
            }
        }

        let listener = tokio::net::TcpListener::bind(&bind_addr)
            .await
            .map_err(|e| format!("Failed to start redirect listener on {}: {}", bind_addr, e))?;

        if redirect_uri.is_empty() {
            let port = listener.local_addr().map_err(|e| e.to_string())?.port();
            redirect_uri = format!("http://127.0.0.1:{}", port);
        }

        let mut auth_url = format!(
            "{}?response_type={}&client_id={}&redirect_uri={}&state={}",
            auth_ep,
            if grant_type == "authorization_code" { "code" } else { "token" },
            percent_encoding::utf8_percent_encode(
                &client_id_str,
                percent_encoding::NON_ALPHANUMERIC
            ),
            percent_encoding::utf8_percent_encode(
                &redirect_uri,
                percent_encoding::NON_ALPHANUMERIC
            ),
            state
        );
        if !scope_str.is_empty() {
            auth_url.push_str(&format!(
                "&scope={}",
                percent_encoding::utf8_percent_encode(
                    &scope_str,
                    percent_encoding::NON_ALPHANUMERIC
                )
            ));
        }
        if let Some(ref add_params) = additional_params {
            if !add_params.trim().is_empty() {
                auth_url.push_str(&format!("&{}", add_params.trim()));
            }
        }

        open_browser_url(&auth_url)?;

        let mut captured_params = std::collections::BTreeMap::new();
        let timeout_duration = std::time::Duration::from_secs(60);

        let serve_future = async {
            loop {
                if let Ok((mut stream, _)) = listener.accept().await {
                    let mut buf = [0; 4096];
                    use tokio::io::{AsyncReadExt, AsyncWriteExt};
                    if let Ok(n) = stream.read(&mut buf).await {
                        let req_str = String::from_utf8_lossy(&buf[..n]);
                        if req_str.starts_with("GET ") {
                            let first_line = req_str.lines().next().unwrap_or("");
                            let parts: Vec<&str> = first_line.split_whitespace().collect();
                            if parts.len() >= 2 {
                                let html = r#"HTTP/1.1 200 OK
Content-Type: text/html
Connection: close

<!DOCTYPE html><html><head><title>Cortex Authentication</title><style>body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f141c; color: #abb2bf; } .card { background: #161c25; padding: 32px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); text-align: center; border: 1px solid #2e3440; max-width: 400px; width: 100%; } h1 { color: #50fa7b; margin-top: 0; font-size: 20px; } p { font-size: 14px; line-height: 1.5; color: #8fbcbb; }</style></head><body><div class="card"><h1>Connecting...</h1><p>Cortex is finalizing your authentication.</p></div><script>
const hash = window.location.hash.substring(1);
const search = window.location.search.substring(1);
const params = (hash && search) ? (hash + '&' + search) : (hash || search || '');
fetch('/callback?' + params, { method: 'POST' })
    .then(() => {
        document.querySelector('h1').innerText = 'Authentication Successful!';
        document.querySelector('p').innerText = 'Cortex has captured the credentials. You can now close this tab/window and return to the app.';
    })
    .catch(err => {
        document.querySelector('h1').style.color = '#ff5555';
        document.querySelector('h1').innerText = 'Authentication Failed';
        document.querySelector('p').innerText = err.toString();
    });
</script></body></html>"#;
                                let _ = stream.write_all(html.as_bytes()).await;
                                let _ = stream.flush().await;
                            }
                        } else if req_str.starts_with("POST /callback") {
                            let first_line = req_str.lines().next().unwrap_or("");
                            let parts: Vec<&str> = first_line.split_whitespace().collect();
                            if parts.len() >= 2 {
                                let path = parts[1];
                                if let Some(pos) = path.find('?') {
                                    let query = &path[pos + 1..];
                                    for pair in query.split('&') {
                                        let mut kv = pair.splitn(2, '=');
                                        let k = kv.next().unwrap_or("").to_string();
                                        let v = kv.next().unwrap_or("").to_string();
                                        let decoded_val = percent_encoding::percent_decode_str(&v)
                                            .decode_utf8_lossy()
                                            .into_owned();
                                        captured_params.insert(k, decoded_val);
                                    }
                                }
                            }
                            let response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\nContent-Length: 2\r\n\r\nOK";
                            let _ = stream.write_all(response.as_bytes()).await;
                            let _ = stream.flush().await;
                            break;
                        }
                    }
                }
            }
            Ok::<_, String>(())
        };

        match tokio::time::timeout(timeout_duration, serve_future).await {
            Ok(Ok(())) => {}
            Ok(Err(e)) => return Err(e),
            Err(_) => return Err("Authentication timed out after 60 seconds.".to_string()),
        }

        if let Some(state_received) = captured_params.get("state") {
            if state_received != &state {
                return Err("State mismatch: OAuth 2.0 security validation failed.".to_string());
            }
        }

        if grant_type == "implicit" {
            let access_token = captured_params.get("access_token").cloned().ok_or_else(|| {
                format!(
                    "No access token received in implicit redirect. Received params: {:?}",
                    captured_params
                )
            })?;
            let mut result = std::collections::BTreeMap::new();
            result.insert("accessToken".to_string(), access_token);
            if let Some(expires_in) = captured_params.get("expires_in") {
                if let Ok(sec) = expires_in.parse::<u64>() {
                    let now = std::time::SystemTime::now()
                        .duration_since(std::time::SystemTime::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_secs();
                    result.insert("expiresAt".to_string(), (now + sec).to_string());
                }
            }
            return Ok(result);
        } else {
            let code = captured_params
                .get("code")
                .cloned()
                .ok_or("No authorization code received in redirect.")?;
            let token_ep = token_endpoint
                .ok_or("Token Endpoint is required to exchange the authorization code.")?;

            let mut params = std::collections::BTreeMap::new();
            params.insert("grant_type".to_string(), "authorization_code".to_string());
            params.insert("code".to_string(), code);
            params.insert("redirect_uri".to_string(), redirect_uri);
            params.insert("client_id".to_string(), client_id_str);
            if let Some(ref sec) = client_secret {
                if !sec.is_empty() {
                    params.insert("client_secret".to_string(), sec.clone());
                }
            }
            if let Some(ref add_params) = additional_params {
                for pair in add_params.trim().split('&') {
                    if pair.is_empty() {
                        continue;
                    }
                    let mut kv = pair.splitn(2, '=');
                    let k = kv.next().unwrap_or("").to_string();
                    let v = kv.next().unwrap_or("").to_string();
                    let decoded_v =
                        percent_encoding::percent_decode_str(&v).decode_utf8_lossy().into_owned();
                    params.insert(k, decoded_v);
                }
            }

            let resp = client
                .post(&token_ep)
                .form(&params)
                .send()
                .await
                .map_err(|e| format!("Failed to send token request: {}", e))?;

            if !resp.status().is_success() {
                let err_body = resp.text().await.unwrap_or_default();
                return Err(format!("Token exchange failed: {}", err_body));
            }

            let token_resp: serde_json::Value =
                resp.json().await.map_err(|e| format!("Failed to parse token response: {}", e))?;

            let mut result = std::collections::BTreeMap::new();
            if let Some(access_token) = token_resp.get("access_token").and_then(|v| v.as_str()) {
                result.insert("accessToken".to_string(), access_token.to_string());
            } else {
                return Err("No access_token found in token response.".to_string());
            }

            if let Some(refresh_token) = token_resp.get("refresh_token").and_then(|v| v.as_str()) {
                result.insert("refreshToken".to_string(), refresh_token.to_string());
            }

            if let Some(expires_in) = token_resp.get("expires_in") {
                let sec = expires_in
                    .as_u64()
                    .or_else(|| expires_in.as_str().and_then(|s| s.parse::<u64>().ok()));
                if let Some(s) = sec {
                    let now = std::time::SystemTime::now()
                        .duration_since(std::time::SystemTime::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_secs();
                    result.insert("expiresAt".to_string(), (now + s).to_string());
                }
            }

            return Ok(result);
        }
    }

    let token_ep = token_endpoint.ok_or("Token Endpoint is required.")?;
    let client_id_str = client_id.ok_or("Client ID is required.")?;

    let mut params = std::collections::BTreeMap::new();
    if grant_type == "client_credentials" {
        params.insert("grant_type".to_string(), "client_credentials".to_string());
        params.insert("client_id".to_string(), client_id_str);
        if let Some(ref sec) = client_secret {
            if !sec.is_empty() {
                params.insert("client_secret".to_string(), sec.clone());
            }
        }
        if let Some(ref sc) = scope {
            if !sc.is_empty() {
                params.insert("scope".to_string(), sc.clone());
            }
        }
    } else if grant_type == "password" {
        params.insert("grant_type".to_string(), "password".to_string());
        params.insert("client_id".to_string(), client_id_str);
        if let Some(ref sec) = client_secret {
            if !sec.is_empty() {
                params.insert("client_secret".to_string(), sec.clone());
            }
        }
        if let Some(ref sc) = scope {
            if !sc.is_empty() {
                params.insert("scope".to_string(), sc.clone());
            }
        }
        let uname = username.ok_or("Username is required for Resource Owner Password grant.")?;
        let pwd = password.ok_or("Password is required for Resource Owner Password grant.")?;
        params.insert("username".to_string(), uname);
        params.insert("password".to_string(), pwd);
    } else {
        return Err(format!("Unsupported grant type: {}", grant_type));
    }

    if let Some(ref add_params) = additional_params {
        for pair in add_params.trim().split('&') {
            if pair.is_empty() {
                continue;
            }
            let mut kv = pair.splitn(2, '=');
            let k = kv.next().unwrap_or("").to_string();
            let v = kv.next().unwrap_or("").to_string();
            let decoded_v =
                percent_encoding::percent_decode_str(&v).decode_utf8_lossy().into_owned();
            params.insert(k, decoded_v);
        }
    }

    let resp = client
        .post(&token_ep)
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Failed to send token request: {}", e))?;

    if !resp.status().is_success() {
        let err_body = resp.text().await.unwrap_or_default();
        return Err(format!("Token fetch failed: {}", err_body));
    }

    let token_resp: serde_json::Value =
        resp.json().await.map_err(|e| format!("Failed to parse token response: {}", e))?;

    let mut result = std::collections::BTreeMap::new();
    if let Some(access_token) = token_resp.get("access_token").and_then(|v| v.as_str()) {
        result.insert("accessToken".to_string(), access_token.to_string());
    } else {
        return Err("No access_token found in token response.".to_string());
    }

    if let Some(refresh_token) = token_resp.get("refresh_token").and_then(|v| v.as_str()) {
        result.insert("refreshToken".to_string(), refresh_token.to_string());
    }

    if let Some(expires_in) = token_resp.get("expires_in") {
        let sec =
            expires_in.as_u64().or_else(|| expires_in.as_str().and_then(|s| s.parse::<u64>().ok()));
        if let Some(s) = sec {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::SystemTime::UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs();
            result.insert("expiresAt".to_string(), (now + s).to_string());
        }
    }

    Ok(result)
}

#[derive(serde::Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct OAuth2RefreshPayload {
    pub refresh_token: String,
    pub token_endpoint: String,
    pub client_id: String,
    pub client_secret: Option<String>,
    pub additional_params: Option<String>,
    pub workspace_path: Option<String>,
    pub collection_path: Option<String>,
    pub environment_name: Option<String>,
}

#[tauri::command]
#[specta::specta]
pub async fn oauth2_refresh_token(
    payload: OAuth2RefreshPayload,
    ephemeral_store: tauri::State<'_, EphemeralStore>,
) -> Result<std::collections::BTreeMap<String, String>, String> {
    let ephemeral_vars: Vec<Variable> =
        ephemeral_store.0.lock().unwrap().values().cloned().collect();

    let (refresh_token, token_endpoint, client_id, client_secret, additional_params) =
        tauri::async_runtime::spawn_blocking(move || {
            let mut resolver = cortex_core::variables::VariableResolver::new();
            populate_resolver(
                &mut resolver,
                payload.workspace_path,
                payload.collection_path,
                payload.environment_name,
                ephemeral_vars,
            )?;

            let refresh_token = resolver.render(&payload.refresh_token).text;
            let token_endpoint = resolver.render(&payload.token_endpoint).text;
            let client_id = resolver.render(&payload.client_id).text;
            let client_secret = payload.client_secret.map(|v| resolver.render(&v).text);
            let additional_params = payload.additional_params.map(|v| resolver.render(&v).text);

            Ok::<(String, String, String, Option<String>, Option<String>), String>((
                refresh_token,
                token_endpoint,
                client_id,
                client_secret,
                additional_params,
            ))
        })
        .await
        .map_err(|e| e.to_string())??;

    let client = reqwest::Client::new();
    let mut params = std::collections::BTreeMap::new();
    params.insert("grant_type".to_string(), "refresh_token".to_string());
    params.insert("refresh_token".to_string(), refresh_token);
    params.insert("client_id".to_string(), client_id);
    if let Some(ref sec) = client_secret {
        if !sec.is_empty() {
            params.insert("client_secret".to_string(), sec.clone());
        }
    }
    if let Some(ref add_params) = additional_params {
        for pair in add_params.trim().split('&') {
            if pair.is_empty() {
                continue;
            }
            let mut kv = pair.splitn(2, '=');
            let k = kv.next().unwrap_or("").to_string();
            let v = kv.next().unwrap_or("").to_string();
            let decoded_v =
                percent_encoding::percent_decode_str(&v).decode_utf8_lossy().into_owned();
            params.insert(k, decoded_v);
        }
    }

    let resp = client
        .post(&token_endpoint)
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Failed to send refresh request: {}", e))?;

    if !resp.status().is_success() {
        let err_body = resp.text().await.unwrap_or_default();
        return Err(format!("Refresh token failed: {}", err_body));
    }

    let token_resp: serde_json::Value =
        resp.json().await.map_err(|e| format!("Failed to parse token response: {}", e))?;

    let mut result = std::collections::BTreeMap::new();
    if let Some(access_token) = token_resp.get("access_token").and_then(|v| v.as_str()) {
        result.insert("accessToken".to_string(), access_token.to_string());
    } else {
        return Err("No access_token found in token response.".to_string());
    }

    if let Some(refresh_token) = token_resp.get("refresh_token").and_then(|v| v.as_str()) {
        result.insert("refreshToken".to_string(), refresh_token.to_string());
    }

    if let Some(expires_in) = token_resp.get("expires_in") {
        let sec =
            expires_in.as_u64().or_else(|| expires_in.as_str().and_then(|s| s.parse::<u64>().ok()));
        if let Some(s) = sec {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::SystemTime::UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs();
            result.insert("expiresAt".to_string(), (now + s).to_string());
        }
    }

    Ok(result)
}
