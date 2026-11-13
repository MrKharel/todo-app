mod todos;
mod db;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // init_db now returns the DbState directly
            let db_state = db::init_db(app)?;
            app.manage(db_state);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            todos::commands::list,
            todos::commands::add,
            todos::commands::update,
            todos::commands::restore,
            todos::commands::delete,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
