use std::fmt;

use serde::ser::{Serialize, SerializeStruct, Serializer};

#[derive(Debug)]
pub enum TodoError {
    /// Input rejected before touching the database; the message is safe to show to API clients.
    Validation(String),
    /// No row matched the id *and* the state the operation requires (see `soft_delete`/`restore`).
    NotFound,
    Db(rusqlite::Error),
    /// A previous command panicked while holding the connection mutex.
    LockPoisoned,
}

impl fmt::Display for TodoError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TodoError::Validation(msg) => write!(f, "validation failed: {msg}"),
            TodoError::NotFound => write!(f, "todo not found"),
            TodoError::Db(err) => write!(f, "database error: {err}"),
            TodoError::LockPoisoned => write!(f, "database connection lock is poisoned"),
        }
    }
}

// Tauri requires command errors to be `Serialize`. Sending a stable `kind`
// alongside the message lets the frontend branch (e.g. show validation text
// inline, treat not_found as a stale list) without parsing display strings.
impl Serialize for TodoError {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        let kind = match self {
            TodoError::Validation(_) => "validation",
            TodoError::NotFound => "not_found",
            TodoError::Db(_) => "database",
            TodoError::LockPoisoned => "internal",
        };
        let mut state = serializer.serialize_struct("TodoError", 2)?;
        state.serialize_field("kind", kind)?;
        state.serialize_field("message", &self.to_string())?;
        state.end()
    }
}

impl std::error::Error for TodoError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            TodoError::Db(err) => Some(err),
            _ => None,
        }
    }
}

impl From<rusqlite::Error> for TodoError {
    fn from(err: rusqlite::Error) -> Self {
        TodoError::Db(err)
    }
}

pub type TodoResult<T> = Result<T, TodoError>;
