#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cli;
mod commands;

use clap::Parser;

#[cfg(windows)]
fn attach_console() {
    unsafe {
        // ATTACH_PARENT_PROCESS = (DWORD)-1
        windows_sys::Win32::System::Console::AttachConsole(u32::MAX);
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
        .invoke_handler(tauri::generate_handler![commands::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn export_bindings() {
        let builder = tauri_specta::Builder::<tauri::Wry>::new()
            .commands(tauri_specta::collect_commands![commands::greet]);

        builder
            .export(specta_typescript::Typescript::default(), "ui/src/bindings.ts")
            .expect("Failed to export bindings");
    }
}
