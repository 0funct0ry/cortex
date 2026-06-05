#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cli;
mod commands;
mod docs_generator;
mod state;

use clap::Parser;

#[cfg(windows)]
fn attach_console() {
    unsafe {
        // Use manual extern declaration to avoid issues with windows-sys versioning/features
        extern "system" {
            fn AttachConsole(dwprocessid: u32) -> i32;
        }
        // ATTACH_PARENT_PROCESS = (DWORD)-1
        let _ = AttachConsole(u32::MAX);
    }
}

fn main() {
    let args = cli::Cli::parse();

    if args.command.is_some() {
        #[cfg(windows)]
        attach_console();

        cli::run_cli(args);
        return;
    }

    tauri::Builder::default()
        .manage(state::EphemeralStore::new())
        .manage(state::HistoryStore::new())
        .manage(state::AppState::new())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::load_collection,
            commands::load_request,
            commands::save_request,
            commands::create_request,
            commands::delete_item,
            commands::rename_item,
            commands::move_item,
            commands::reorder_item,
            commands::create_folder,
            commands::duplicate_request,
            commands::open_in_explorer,
            commands::load_workspace,
            commands::create_workspace,
            commands::close_workspace,
            commands::add_collection_to_workspace,
            commands::remove_collection_from_workspace,
            commands::get_last_workspace_path,
            commands::get_recent_workspaces,
            commands::detect_directory_type,
            commands::get_app_settings,
            commands::pick_file,
            commands::pick_directory,
            commands::save_file,
            commands::create_collection,
            commands::update_workspace_variables,
            commands::update_collection_variables,
            commands::update_collection_auth,
            commands::update_folder_auth,
            commands::update_collection_headers,
            commands::update_folder_headers,
            commands::update_folder_scripts,
            commands::update_collection_scripts,
            commands::update_collection_tests,
            commands::update_collection_description,
            commands::save_collection,
            commands::save_tag_registry,
            commands::update_environment_variables,
            commands::read_environment_file,
            commands::delete_environment,
            commands::rename_environment,
            commands::add_workspace_env_file,
            commands::remove_workspace_env_file,
            commands::parse_env_file,
            commands::load_global_environment,
            commands::save_global_environment,
            commands::read_text_file,
            commands::write_text_file,
            commands::get_resolved_variables,
            commands::preview_template,
            commands::load_collection_manifest,
            commands::load_workspace_manifest,
            commands::get_ephemeral_variables,
            commands::set_ephemeral_variables,
            commands::set_ephemeral_variable,
            commands::remove_ephemeral_variable,
            commands::get_prompt_variables,
            commands::send_request,
            commands::get_request_history,
            commands::clear_request_history,
            commands::preview_request_headers,
            commands::introspect_graphql,
            commands::set_active_environment,
            commands::cancel_request,
            commands::oauth2_fetch_token,
            commands::oauth2_refresh_token,
            commands::clone_collection,
            commands::open_in_terminal,
            commands::create_js_file,
            commands::clone_folder,
            commands::get_item_info,
            commands::scan_import_folder,
            commands::bulk_import_folder,
            commands::check_git_initialized,
            commands::git_init_collection,
            commands::export_collection_zip,
            commands::export_collection_bundle,
            commands::preview_import_zip,
            commands::preview_import_bundle,
            commands::extract_collection_zip,
            commands::extract_collection_bundle,
            commands::generate_docs_html,
            commands::generate_docs_markdown,
            commands::generate_docs_openapi,
            commands::generate_docs_api_blueprint,
            commands::generate_docs_postman,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn export_bindings() {
        let builder =
            tauri_specta::Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![
                commands::greet,
                commands::load_collection,
                commands::load_request,
                commands::save_request,
                commands::create_request,
                commands::delete_item,
                commands::rename_item,
                commands::move_item,
                commands::reorder_item,
                commands::create_folder,
                commands::duplicate_request,
                commands::open_in_explorer,
                commands::load_workspace,
                commands::create_workspace,
                commands::close_workspace,
                commands::add_collection_to_workspace,
                commands::remove_collection_from_workspace,
                commands::get_last_workspace_path,
                commands::get_recent_workspaces,
                commands::detect_directory_type,
                commands::get_app_settings,
                commands::pick_file,
                commands::pick_directory,
                commands::save_file,
                commands::create_collection,
                commands::update_workspace_variables,
                commands::update_collection_variables,
                commands::update_collection_auth,
                commands::update_folder_auth,
                commands::update_collection_headers,
                commands::update_folder_headers,
                commands::update_folder_scripts,
                commands::update_collection_scripts,
                commands::update_collection_tests,
                commands::update_collection_description,
                commands::save_collection,
                commands::save_tag_registry,
                commands::update_environment_variables,
                commands::read_environment_file,
                commands::delete_environment,
                commands::rename_environment,
                commands::add_workspace_env_file,
                commands::remove_workspace_env_file,
                commands::parse_env_file,
                commands::load_global_environment,
                commands::save_global_environment,
                commands::read_text_file,
                commands::write_text_file,
                commands::get_resolved_variables,
                commands::preview_template,
                commands::load_collection_manifest,
                commands::load_workspace_manifest,
                commands::get_ephemeral_variables,
                commands::set_ephemeral_variables,
                commands::set_ephemeral_variable,
                commands::remove_ephemeral_variable,
                commands::get_prompt_variables,
                commands::send_request,
                commands::get_request_history,
                commands::clear_request_history,
                commands::preview_request_headers,
                commands::introspect_graphql,
                commands::set_active_environment,
                commands::cancel_request,
                commands::oauth2_fetch_token,
                commands::oauth2_refresh_token,
                commands::clone_collection,
                commands::open_in_terminal,
                commands::create_js_file,
                commands::clone_folder,
                commands::get_item_info,
                commands::scan_import_folder,
                commands::bulk_import_folder,
                commands::check_git_initialized,
                commands::git_init_collection,
                commands::export_collection_zip,
                commands::export_collection_bundle,
                commands::preview_import_zip,
                commands::preview_import_bundle,
                commands::extract_collection_zip,
                commands::extract_collection_bundle,
                commands::generate_docs_html,
                commands::generate_docs_markdown,
                commands::generate_docs_openapi,
                commands::generate_docs_api_blueprint,
                commands::generate_docs_postman,
            ]);

        builder
            .export(specta_typescript::Typescript::default(), "ui/src/bindings.ts")
            .expect("Failed to export bindings");
    }
}
