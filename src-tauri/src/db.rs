use rusqlite::{Connection};
use std::sync::Mutex;
use tauri::{Manager};

pub struct DbState {
    pub conn: Mutex<Connection>,
}

pub fn initialize_database(
    app: &tauri::App,
) -> Result<Connection, Box<dyn std::error::Error>> {
    let app_data_dir = app.path().app_data_dir()?;

    std::fs::create_dir_all(&app_data_dir)?;

    let db_path = app_data_dir.join("todos.db");println!("App data directory: {}", db_path.display());

    let conn = Connection::open(db_path)?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMPZ,
            deleted_at TIMESTAMPTZ DEFAULT NULL
        );
        ",
    )?;

    Ok(conn)
}
