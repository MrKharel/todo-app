use crate::error::{TodoError, TodoResult};
use crate::models::todos::{InsertTodo, UpdateTodo};

pub const MAX_TITLE_LEN: usize = 200;
pub const MAX_CATEGORY_LEN: usize = 50;

// Validation lives apart from the queries so it stays pure (no DB handle) and
// can be unit-tested, or reused by HTTP handlers to reject bad input early.
// The query layer still calls these itself, so no caller can skip them.

// Lengths are counted in chars, not bytes, so non-ASCII titles aren't penalised.
// Input is deliberately not trimmed: whitespace is treated as meaningful, which
// is why an all-whitespace title is valid and only the empty string is rejected.
pub fn validate_title(title: &str) -> TodoResult<()> {
    if title.is_empty() {
        return Err(TodoError::Validation("title must not be empty".into()));
    }
    if title.chars().count() > MAX_TITLE_LEN {
        return Err(TodoError::Validation(format!(
            "title must be at most {MAX_TITLE_LEN} characters"
        )));
    }
    Ok(())
}

pub fn validate_category(category: &str) -> TodoResult<()> {
    if category.chars().count() > MAX_CATEGORY_LEN {
        return Err(TodoError::Validation(format!(
            "category must be at most {MAX_CATEGORY_LEN} characters"
        )));
    }
    Ok(())
}

pub fn validate_insert(todo: &InsertTodo) -> TodoResult<()> {
    validate_title(&todo.title)?;
    validate_category(&todo.category)
}

// Only fields that are present are checked: `None` means "leave unchanged".
pub fn validate_update(todo: &UpdateTodo) -> TodoResult<()> {
    if let Some(title) = todo.title.as_deref() {
        validate_title(title)?;
    }
    if let Some(category) = todo.category.as_deref() {
        validate_category(category)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_title_is_rejected() {
        assert!(validate_title("").is_err());
    }

    #[test]
    fn whitespace_only_title_is_allowed() {
        assert!(validate_title("   ").is_ok());
    }

    #[test]
    fn title_length_counts_chars_not_bytes() {
        // 200 multi-byte chars is 600 bytes but still within the limit.
        assert!(validate_title(&"é".repeat(MAX_TITLE_LEN)).is_ok());
        assert!(validate_title(&"é".repeat(MAX_TITLE_LEN + 1)).is_err());
    }

    #[test]
    fn category_over_limit_is_rejected() {
        assert!(validate_category(&"a".repeat(MAX_CATEGORY_LEN + 1)).is_err());
    }

    #[test]
    fn update_skips_absent_fields() {
        let todo = UpdateTodo { title: None, category: None, completed: Some(true) };
        assert!(validate_update(&todo).is_ok());
    }
}
