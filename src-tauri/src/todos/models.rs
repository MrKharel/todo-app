use serde::{Serialize,Deserialize};

// pub const MAX_TITLE_CHARS: usize = 100;

pub const TODO_ITEM_SELECT: &str =
    "id, title, completed, created_at, updated_at, deleted_at";

#[derive(Debug, Serialize, Deserialize)]
pub struct TodoItem {
    pub id: i32,
    pub title: String,
    pub completed: bool,
    pub created_at: f64,
    pub updated_at: f64,
    pub deleted_at: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct List {
    pub limit: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct Create {
    pub title: String,
    pub completed: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct Update {
    pub id: i32,
    pub title: Option<String>,
    pub completed: Option<bool>,
}
