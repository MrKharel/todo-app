use rusqlite::{params, params_from_iter, types::Value, Connection, OptionalExtension, Row};

use crate::error::{TodoError, TodoResult};
use crate::models::todos::{InsertTodo, ListParams, Todo, UpdateTodo};
use crate::validation::todos::{validate_insert, validate_update};

// Single source of truth for column order; `row_to_todo` reads by index and
// every RETURNING clause reuses this, so the two can never drift apart.
const COLUMNS: &str = "id, title, category, completed, created_at, deleted_at";

fn row_to_todo(row: &Row<'_>) -> rusqlite::Result<Todo> {
    Ok(Todo {
        id: row.get(0)?,
        title: row.get(1)?,
        category: row.get(2)?,
        completed: row.get(3)?,
        created_at: row.get(4)?,
        deleted_at: row.get(5)?,
    })
}

// Every mutation funnels through here. With `RETURNING`, "zero rows" means the
// WHERE clause didn't match, which we surface as NotFound instead of silently
// succeeding like a bare `execute` would.
fn fetch_one(conn: &Connection, sql: &str, params: impl rusqlite::Params) -> TodoResult<Todo> {
    conn.query_row(sql, params, row_to_todo)
        .optional()?
        .ok_or(TodoError::NotFound)
}

pub fn list(conn: &Connection, params: ListParams) -> TodoResult<Vec<Todo>> {
    let mut sql = format!("SELECT {COLUMNS} FROM todos");
    let mut conditions: Vec<&str> = Vec::new();
    let mut values: Vec<Value> = Vec::new();

    if !params.include_deleted_todos {
        conditions.push("deleted_at IS NULL");
    }
    // Filters are bound as parameters, never interpolated, so user-supplied
    // category strings can't alter the query. Placeholders are positional `?`,
    // so push order here must match the order of the conditions.
    if let Some(completed) = params.completed {
        conditions.push("completed = ?");
        values.push(Value::Integer(completed as i64));
    }
    if let Some(category) = params.category {
        conditions.push("category = ?");
        values.push(Value::Text(category));
    }

    if !conditions.is_empty() {
        sql.push_str(" WHERE ");
        sql.push_str(&conditions.join(" AND "));
    }
    sql.push_str(" ORDER BY id DESC");

    let mut stmt = conn.prepare(&sql)?;
    let todos = stmt
        .query_map(params_from_iter(values), row_to_todo)?
        .collect::<rusqlite::Result<Vec<Todo>>>()?;
    Ok(todos)
}

/// Fetches a single todo. Soft-deleted rows are returned too, so callers
/// (e.g. a trash view) can still look them up by id.
pub fn get(conn: &Connection, id: i32) -> TodoResult<Todo> {
    fetch_one(
        conn,
        &format!("SELECT {COLUMNS} FROM todos WHERE id = ?1"),
        params![id],
    )
}

pub fn create(conn: &Connection, todo: InsertTodo) -> TodoResult<Todo> {
    validate_insert(&todo)?;

    fetch_one(
        conn,
        &format!("INSERT INTO todos (title, category) VALUES (?1, ?2) RETURNING {COLUMNS}"),
        params![todo.title, todo.category],
    )
}

pub fn update(conn: &Connection, id: i32, todo: UpdateTodo) -> TodoResult<Todo> {
    validate_update(&todo)?;

    // COALESCE means "None = leave unchanged", so a nullable column couldn't be
    // cleared this way; category is non-null today so that isn't a concern.
    // Soft-deleted rows are excluded: edits go through `restore` first, so the
    // trash can't be mutated behind the user's back.
    fetch_one(
        conn,
        &format!(
            "UPDATE todos
             SET title = COALESCE(?2, title),
                 completed = COALESCE(?3, completed),
                 category = COALESCE(?4, category)
             WHERE id = ?1 AND deleted_at IS NULL
             RETURNING {COLUMNS}"
        ),
        params![id, todo.title, todo.completed, todo.category],
    )
}

// The `deleted_at IS NULL` guard keeps the original deletion timestamp intact
// if this is called twice, and reports the second call as NotFound.
pub fn soft_delete(conn: &Connection, id: i32) -> TodoResult<Todo> {
    // CURRENT_TIMESTAMP is UTC and matches the format of the created_at default.
    fetch_one(
        conn,
        &format!(
            "UPDATE todos SET deleted_at = CURRENT_TIMESTAMP
             WHERE id = ?1 AND deleted_at IS NULL
             RETURNING {COLUMNS}"
        ),
        params![id],
    )
}

pub fn restore(conn: &Connection, id: i32) -> TodoResult<Todo> {
    fetch_one(
        conn,
        &format!(
            "UPDATE todos SET deleted_at = NULL
             WHERE id = ?1 AND deleted_at IS NOT NULL
             RETURNING {COLUMNS}"
        ),
        params![id],
    )
}

/// Permanently removes a row (soft-deleted or not) and returns what was removed,
/// since the caller can't fetch it afterwards.
pub fn delete(conn: &Connection, id: i32) -> TodoResult<Todo> {
    fetch_one(
        conn,
        &format!("DELETE FROM todos WHERE id = ?1 RETURNING {COLUMNS}"),
        params![id],
    )
}
