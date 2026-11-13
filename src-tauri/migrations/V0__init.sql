PRAGMA foreign_keys = ON;

-- =========================================
-- TODO
-- =========================================

CREATE TABLE todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
        CHECK (length(title) <= 100),
    completed INTEGER NOT NULL DEFAULT 0
        CHECK (completed IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
);

-- =========================================
-- UPDATE TIMESTAMP TRIGGERS
-- =========================================

CREATE TRIGGER touch_todo
AFTER UPDATE ON todo
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE todo
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
    WHERE id = NEW.id;
END;

