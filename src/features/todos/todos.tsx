import { useState, useMemo } from "react";
import { useTodosStore } from "./use-todos-store";
import { useShallow } from "zustand/shallow";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { TodoItem } from "./_components/todo-item";
import { TodoFormDialog } from "./_components/todo-form-dialog";
import { FilterTabs } from "./_components/filter-tabs";
import { TodoEmptyState } from "./_components/todo-empty-state";

import type { Todo } from "./constants";

const TodosPage = () => {
  const todos = useTodosStore((s) => s.todos);
  const tab = useTodosStore((s) => s.tab);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const { deleteTodo, restoreTodo, clearCompleted } = useTodosStore(
    useShallow((s) => ({
      deleteTodo: s.deleteTodo,
      restoreTodo: s.restoreTodo,
      clearCompleted: s.clearCompleted,
    })),
  );

  const counts = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    return {
      all: todos.length,
      active: todos.length - completed,
      completed,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (tab === "active") return todos.filter((t) => !t.completed);
    if (tab === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, tab]);

  const openCreate = () => {
    setEditingTodo(null);
    setFormOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!todoToDelete) return;

    const index = todos.findIndex((t) => t.id === todoToDelete.id);
    const removed = todoToDelete;

    deleteTodo(removed.id);
    setTodoToDelete(null);

    toast.add({
      title: "Task Deleted",
      description: removed.title,
      actionProps: {
        children: "Undo",
        onClick: () => restoreTodo(removed, index),
      },
    });
  };

  const handleConfirmClear = () => {
    const count = counts.completed;
    clearCompleted();
    setConfirmClearOpen(false);
    toast.add({
      title: `Cleared ${count} completed ${count === 1 ? "task" : "tasks"}`,
    });
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {counts.all === 0
                ? "Stay organized and keep track of your daily goals."
                : `${counts.active} remaining · ${counts.completed} completed`}
            </p>
          </div>

          <Button onClick={openCreate}>
            <PlusIcon />
            Add New Todo
          </Button>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <FilterTabs counts={counts} />

          <Button
            variant="ghost"
            size="sm"
            disabled={counts.completed === 0}
            onClick={() => setConfirmClearOpen(true)}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear completed
          </Button>
        </div>

        {/* List */}
        <div className="bg-card mt-2 overflow-hidden rounded-xl border shadow-sm">
          {filteredTodos.length === 0 ? (
            <TodoEmptyState tab={tab} onCreate={openCreate} />
          ) : (
            <ul className="divide-y" aria-label="Todos">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={openEdit}
                  onDelete={setTodoToDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Create / edit dialog. `key` resets the form state per todo. */}
      <TodoFormDialog
        key={editingTodo?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        todo={editingTodo}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={todoToDelete !== null}
        onOpenChange={(open: boolean) => !open && setTodoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              “{todoToDelete?.title}” will be removed. You can undo this right
              after from the notification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear completed confirmation */}
      <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear completed tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {counts.completed} completed{" "}
              {counts.completed === 1 ? "task" : "tasks"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClear}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { TodosPage };
