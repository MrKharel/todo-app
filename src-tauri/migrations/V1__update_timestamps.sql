CREATE TABLE todo_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
        CHECK (length(title) <= 100),
    completed INTEGER NOT NULL DEFAULT 0
        CHECK (completed IN (0, 1)),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER
);
INSERT INTO todo_new (id, title, completed, created_at, updated_at, deleted_at)
SELECT id, title, completed, created_at, updated_at, deleted_at 
FROM todo;
DROP TABLE todo;
ALTER TABLE todo_new RENAME TO todo;
