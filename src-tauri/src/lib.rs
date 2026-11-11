mod commands;
mod models;
mod queries;
mod db;

use std::sync::Mutex;
use tauri::{Manager, generate_handler};

use crate::db::{initialize_database,DbState};
use commands::{
    todos::{get_todos,insert_todo,update_todo,delete_todo}
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let conn = initialize_database(app)?;

            app.manage(DbState {
                conn: Mutex::new(conn),
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(generate_handler![
            get_todos,
            insert_todo,
            update_todo,
            delete_todo,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
