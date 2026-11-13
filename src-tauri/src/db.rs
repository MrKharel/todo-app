use std::sync::{LazyLock, Mutex};

use rusqlite::Connection;
use rusqlite_migration::{Migrations, M};
use tauri::Manager;

pub struct DbState {
    pub conn: Mutex<Connection>,
}

// Migrations are tracked by position in this list (stored in SQLite's
// `user_version` pragma). Never edit or reorder one that has shipped: append a
// new `M::up` instead, or databases already at that version will silently skip it.
static MIGRATIONS: LazyLock<Migrations<'static>> = LazyLock::new(|| {
    Migrations::new(vec![
        M::up(
            // TEXT, not TIMESTAMPTZ: SQLite has no such type, and CURRENT_TIMESTAMP
            // yields UTC text, which is also what `soft_delete` writes.
            "CREATE TABLE todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at TEXT DEFAULT NULL
            );",
        ),
    ])
});

// Takes `&mut` because each migration runs inside a transaction.
fn run_migrations(conn: &mut Connection) -> Result<(), rusqlite_migration::Error> {
    MIGRATIONS.to_latest(conn)
}

pub fn initialize_database(app: &tauri::App) -> Result<Connection, Box<dyn std::error::Error>> {
    let app_data_dir = app.path().app_data_dir()?;

    std::fs::create_dir_all(&app_data_dir)?;

    let db_path = app_data_dir.join("todos.db");
    println!("App data directory: {}", db_path.display());

    let mut conn = Connection::open(db_path)?;
    run_migrations(&mut conn)?;

    Ok(conn)
}

#[cfg(test)]
mod tests {
    use super::*;

    // Catches malformed SQL and bad ordering at `cargo test` time, not on a user's machine.
    #[test]
    fn migrations_are_valid() {
        MIGRATIONS.validate().unwrap();
    }

    #[test]
    fn migrating_twice_is_a_no_op() {
        let mut conn = Connection::open_in_memory().unwrap();
        run_migrations(&mut conn).unwrap();
        run_migrations(&mut conn).unwrap();
    }
}
