use rusqlite::{Connection, Result as SqliteResult, params};
use crate::models::{ todos::{
    Todo,
    InsertTodo,
    UpdateTodo,
    ListParams,
}};

pub fn list(conn: &Connection, params: ListParams) -> SqliteResult<Vec<Todo>> {
    let mut query = String::from(
        "SELECT id, title, category, completed, created_at, deleted_at FROM todos"
    );
    if !params.include_deleted_todos {
        query.push_str(" WHERE deleted_at IS NULL");
    }
    query.push_str(" ORDER BY id DESC");

    let mut stmt = conn.prepare(&query)?;
    let todos = stmt
        .query_map([], |row| {
            Ok(Todo {
                id: row.get(0)?,
                title: row.get(1)?,
                category: row.get(2)?,
                completed: if row.get(3)? {true} else {false},
                created_at: row.get(4)?,
                deleted_at: row.get(5)?
            })
        })?
        .collect::<SqliteResult<Vec<Todo>>>()?;
    Ok(todos)
}

pub fn post(conn: &Connection, todo: InsertTodo) -> SqliteResult<Todo, String> {
    conn.execute(
        "INSERT INTO todos (title, category) VALUES ($1, $2);",
        params![todo.title, todo.category]
    )?;
    Ok()
}

pub fn update(conn: &Connection, id: i32, todo: UpdateTodo) -> SqliteResult<Vec<Todo>> {
    conn.execute(
        "UPDATE todos
         SET title = COALESCE(?2, title),
            completed = COALESCE(?3, completed),
            category = COALESCE(?4, category),
         WHERE id = ?1",
        params![id, todo.title, todo.completed, todo.category]
    )?;
    Ok()
}

pub fn soft_delete(conn: &Connection, id: i32) -> SqliteResult<Vec<Todo>> {
    conn.execute (
        "UPDATE todos SET deleted_at = GETDATE() WHERE id = $1",
        params![id]
    )?;
    Ok()
}

pub fn restore(conn: &Connection, id: i32) -> SqliteResult<Vec<Todo>> {
    conn.execute(
        "UPDATE todos SET deleted_at = null WHERE id = $1",
        params![id]
    )?;
    Ok()
}

pub fn delete(conn: &Connection, id: i32) -> SqliteResult<Vec<Todo>> {
    conn.execute(
        "DELETE FROM todos WHERE id = $1",
        params![id]
    )?;
    Ok()
}
