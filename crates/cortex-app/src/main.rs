#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
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
