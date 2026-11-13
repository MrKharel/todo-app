use std::path::PathBuf;
use rusqlite::Connection;
use tauri::Manager;

pub struct DbState {
    pub db_path: PathBuf,
}

// Migrations are tracked by position in this list (stored in SQLite's
// `user_version` pragma). Never edit or reorder one that has shipped: append a
// new `M::up` instead, or databases already at that version will silently skip it.
mod migrations {
    refinery::embed_migrations!("./migrations");
}

pub fn init_db(app: &tauri::App) -> Result<DbState, Box<dyn std::error::Error>> {
    let app_data_dir = app.path().app_data_dir()?;
    std::fs::create_dir_all(&app_data_dir)?;
    let path_to_db = app_data_dir.join("tudus_db.db");

    // Connection is opened strictly for startup initialization and migrations
    let mut conn = Connection::open(&path_to_db)?;

    // --- Performance & Concurrency Optimizations ---
    conn.execute_batch(
        "PRAGMA journal_mode = WAL;
         PRAGMA synchronous = NORMAL;
         PRAGMA foreign_keys = ON;
         PRAGMA busy_timeout = 5000;",
    )?;

    // Run migrations safely with proper error propagation
    migrations::migrations::runner().run(&mut conn)?;

    // The startup connection drops here. 
    // App state only retains the path to open connections on demand.
    Ok(DbState { db_path: path_to_db })
}
