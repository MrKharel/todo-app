use std::sync::MutexGuard;

use rusqlite::Connection;
use tauri::State;

use crate::db::DbState;
use crate::error::{TodoError, TodoResult};
use crate::models::todos::{InsertTodo, ListParams, Todo, UpdateTodo};
use crate::queries::todos;

// A poisoned lock means an earlier command panicked mid-query. We report it as
// an error rather than unwrapping, so one bad command can't take the app down.
fn lock_conn<'a>(state: &'a State<'_, DbState>) -> TodoResult<MutexGuard<'a, Connection>> {
    state.conn.lock().map_err(|_| TodoError::LockPoisoned)
}

// The guard is bound to a variable first because `&lock_conn(..)?` inline
// leaves the compiler unable to deref-coerce `MutexGuard<Connection>` into
// `&Connection` through the `?` operator.

// Parameter names (`params`, `inserts`, `updates`) are the keys the frontend
// passes to `invoke`, so renaming them is a breaking change on the JS side.

#[tauri::command]
pub fn get_todos(state: State<'_, DbState>, params: ListParams) -> TodoResult<Vec<Todo>> {
    let conn = lock_conn(&state)?;
    todos::list(&conn, params)
}

#[tauri::command]
pub fn get_todo(state: State<'_, DbState>, id: i32) -> TodoResult<Todo> {
    let conn = lock_conn(&state)?;
    todos::get(&conn, id)
}

#[tauri::command]
pub fn insert_todo(state: State<'_, DbState>, inserts: InsertTodo) -> TodoResult<Todo> {
    let conn = lock_conn(&state)?;
    todos::create(&conn, inserts)
}

#[tauri::command]
pub fn update_todo(state: State<'_, DbState>, id: i32, updates: UpdateTodo) -> TodoResult<Todo> {
    let conn = lock_conn(&state)?;
    todos::update(&conn, id, updates)
}

#[tauri::command]
pub fn soft_delete_todo(state: State<'_, DbState>, id: i32) -> TodoResult<Todo> {
    let conn = lock_conn(&state)?;
    todos::soft_delete(&conn, id)
}

#[tauri::command]
pub fn restore_todo(state: State<'_, DbState>, id: i32) -> TodoResult<Todo> {
    let conn = lock_conn(&state)?;
    todos::restore(&conn, id)
}

#[tauri::command]
pub fn delete_todo(state: State<'_, DbState>, id: i32) -> TodoResult<Todo> {
    let conn = lock_conn(&state)?;
    todos::delete(&conn, id)
}
