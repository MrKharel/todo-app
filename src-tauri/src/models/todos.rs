use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub category: String,
    pub completed: bool,
    pub created_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct InsertTodo {
    pub title: String,
    pub category: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTodo {
    pub title: Option<String>,
    pub category: Option<String>,
    pub completed: Option<bool>,
}

// `#[serde(default)]` lets clients omit every filter, e.g. `GET /todos` with no
// query string, instead of having to send `include_deleted_todos=false`.
#[derive(Debug, Default, Deserialize)]
#[serde(default)]
pub struct ListParams {
    pub include_deleted_todos: bool,
    pub completed: Option<bool>,
    pub category: Option<String>,
}
