use rusqlite::{Connection, Result as SqliteResult, params};
use crate::models::{
    todos::{Todo,InsertTodo,UpdateTodo}
};

pub fn list(conn: &Connection) -> SqliteResult<Vec<Todo>> {
    let mut stmt = conn.prepare(
        "
        SELECT id, title, category, completed, created_at, deleted_at
        FROM todos
        ORDER BY id DESC
        ",
    )?;

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

pub fn post(conn: &Connection, todo: InsertTodo) -> SqliteResult<Vec<Todo>> {
    match conn.execute(
        "
        INSERT INTO todos (title, category)
        VALUES ($1, $2);
        ",
        params![todo.title, todo.category]
    ) {
        Ok(rows) => println!("Affected {} row.", rows),
        Err(error) => println!("Database error {}", error)
    };

    let todos = list(conn).unwrap_or_default();

    Ok(todos)
}

pub fn update(conn: &Connection, id: i32, todo: UpdateTodo) -> SqliteResult<Vec<Todo>> {
    match conn.execute(
        "
        UPDATE todos 
        SET title = COALESCE(?2, title),
            completed = COALESCE(?3, completed),
            category = COALESCE(?4, category),
            deleted_at = COALESCE(?5, deleted_at)
        WHERE id = ?1
        ",
        params![id, todo.title, todo.completed, todo.category, todo.deleted_at]
    ) {
        Ok(rows) => println!("Affected {} rows.", rows),
        Err(error) => println!("Database error {}", error)
    };

    let todos = list(conn).unwrap_or_default();

    Ok(todos)
}

pub fn delete(conn: &Connection, id: i32) -> SqliteResult<Vec<Todo>> {
    match conn.execute(
        "DELETE FROM todos WHERE id = $1",
        params![id]
    ) {
        Ok(rows) => println!("Affected {} rows.", rows),
        Err(error) => println!("Database error {}", error)
    };

    let todos = list(conn).unwrap_or_default();

    Ok(todos)
}
