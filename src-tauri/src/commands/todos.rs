use tauri::{State};
use crate::queries::{todos};
use crate::db::{DbState};
use crate::models::{
    todos::{Todo,InsertTodo,UpdateTodo}
};

#[tauri::command]
pub fn get_todos(state: State<'_, DbState>) -> Result<Vec<Todo>, String> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| "Database conn lock is poisoned".to_string())?;
    todos::list(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn insert_todo(state: State<'_, DbState>, inserts: InsertTodo) -> Result<Vec<Todo>, String> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| "Database conn lock is poisoned".to_string())?;
    todos::post(&conn, inserts).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_todo(state: State<'_, DbState>, id: i32, updates: UpdateTodo) -> Result<Vec<Todo>, String> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| "Database conn lock is poisoned".to_string())?;
    todos::update(&conn, id, updates).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn soft_delete_todo(state: State<'_, DbState>, id: i32) -> Result<Vec<Todo>, String> {
    let conn = state 
        .conn 
        .lock()
        .map_err(|_| "Database conn lock is poisoned".to_string())?;
    todos::soft_delete;
}

#[tauri::command]
pub fn restore_todo(state: State<'_, DbState>, id: i32) -> Result<Vec<Todo>, String> {
    let conn = state 
        .conn 
        .lock() 
        .map_err(|_| "Database con lock is poisoned".to_string())?;
    todos::restore()
}

#[tauri::command]
pub fn delete_todo(state: State<'_, DbState>, id: i32) -> Result<Vec<Todo>, String> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| "Database conn lock is poisoned".to_string())?;
    todos::delete(&conn, id).map_err(|e| e.to_string())
}
