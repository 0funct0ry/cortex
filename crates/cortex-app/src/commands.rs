use crate::state::{AppSettings, EphemeralStore, HistoryStore, RecentWorkspace};
use cortex_core::collection::Collection;
use cortex_core::request::{RequestFile, RequestHistoryEntry};
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
pub async fn save_file(
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
        .blocking_save_file();
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
pub struct SendRequestPayload {
    pub request_name: String,
    pub method: String,
    pub url: String,
    pub headers: Vec<HeaderEntry>,
    pub body: Option<String>,
}

#[tauri::command]
#[specta::specta]
pub async fn send_request(
    payload: SendRequestPayload,
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

        let mut result = resolver.render(&payload.url);

        if let Some(b) = payload.body {
            let body_res = resolver.render(&b);
            result.captured_variables.extend(body_res.captured_variables);
        }

        let (rendered_headers, warnings, headers_captured) = gather_and_render_headers(
            &mut resolver,
            collection_path,
            request_path,
            payload.headers,
            true,
        );

        result.captured_variables.extend(headers_captured);

        let executed_at = RequestHistoryEntry::now_iso();
        let id = RequestHistoryEntry::random_id();

        let status_code = Some(200);
        let response_body = Some(format!(
            "{{\n  \"status\": \"success\",\n  \"message\": \"Simulated response for {}\",\n  \"rendered_url\": \"{}\"\n}}",
            payload.method,
            result.text.escape_default()
        ));

        Ok::<RequestHistoryEntry, String>(RequestHistoryEntry {
            id,
            request_name: payload.request_name,
            method: payload.method,
            raw_url: payload.url,
            rendered_url: result.text,
            captured_variables: result.captured_variables,
            executed_at,
            status_code,
            response_body,
            headers: rendered_headers,
            warnings,
        })
    })
    .await
    .map_err(|e| e.to_string())??;

    history_store.add_entry(entry.clone());
    Ok(entry)
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
            status_code,
            response_body,
            headers: rendered_headers,
            warnings: header_warnings,
        })
    })
    .await
    .map_err(|e| e.to_string())??;

    history_store.add_entry(entry.clone());
    Ok(entry)
}
