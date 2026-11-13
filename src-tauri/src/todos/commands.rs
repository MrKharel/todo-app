use std::time;
use rusqlite::{Connection};
use crate::{db::DbState, todos::models};

#[tauri::command(async, rename = "list_todos")]
pub fn list(
   state: tauri::State<'_, DbState>,
    params: models::List,
) -> Result<Vec<models::TodoItem>, String> {
    let mut sql = format!("SELECT {} FROM todo", models::TODO_ITEM_SELECT);

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    
    let conn = Connection::open(&state.db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(&sql)
        .map_err(|e| e.to_string())?;
    
    let todos = stmt
        .query_map([], |row| {
            Ok(models::TodoItem {
                id: row.get(0)?,
                title: row.get(1)?,
                completed: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
                deleted_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<models::TodoItem>, rusqlite::Error>>()
        .map_err(|e| e.to_string())?;

    Ok(todos)
}

#[tauri::command(async, rename = "add_todos")]
pub fn add(
    state: tauri::State<'_, DbState>,
    values: Vec<models::Create>,
) -> Result<bool, String> {
    let sql = "
        INSERT INTO todo
        (title, completed, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4)";

    let conn = Connection::open(&state.db_path)
        .map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(&sql)
        .map_err(|e| e.to_string())?;

    let current_time = time::SystemTime::now()
        .duration_since(time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs_f64();

    for item in values {
        stmt.execute((&item.title, item.completed, current_time, current_time))
            .map_err(|e| e.to_string())?;
    }

    Ok(true)
}

#[tauri::command(async, rename = "update_todos")]
pub fn update(
    state: tauri::State<'_, DbState>,
    values: Vec<models::Update>,
) -> Result<bool, String> {
    let sql = "UPDATE todo SET
            title = COALESCE(?2, title),
            completed = COALESCE(?3, completed)
        WHERE id = ?1;";

    let conn = Connection::open(&state.db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(&sql)
        .map_err(|e| e.to_string())?;

    for item in values {
        stmt.execute((item.id, &item.title, item.completed))
            .map_err(|e| e.to_string())?;
    }

    Ok(true)
}

#[tauri::command(async, rename = "delete_todos")]
pub fn delete(
    state: tauri::State<'_, DbState>,
    ids: Vec<i32>,
) -> Result<bool, String> {
    let sql = "UPDATE todo SET deleted_at = ?2 WHERE id = ?1;";

    let conn = Connection::open(&state.db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(&sql)
        .map_err(|e| e.to_string())?;

    let current_time = time::SystemTime::now()
        .duration_since(time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs_f64();

    for id in ids {
        stmt.execute((id, current_time))
            .map_err(|e| e.to_string())?;
    }

    Ok(true)
}

#[tauri::command(async, rename = "restore_todos")]
pub fn restore(
    state: tauri::State<'_, DbState>,
    ids: Vec<i32>,
) -> Result<bool, String> {
    let sql = "UPDATE todo SET deleted_at = NULL WHERE id = ?1";

    let conn = Connection::open(&state.db_path)
        .map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(&sql)
        .map_err(|e| e.to_string())?;

    for id in ids {
        stmt.execute((id,))
            .map_err(|e| e.to_string())?;
    }

    Ok(true)
}
