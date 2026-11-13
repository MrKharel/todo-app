import { useState, useEffect, useMemo } from "react";
import { useTodosStore } from "@/stores/use-todos-store";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateNewTaskDialog } from "./_components/create-new-task-dialog";
import { TodoItem } from "./_components/todo-item";
import { EmptyState } from "./_components/empty-state";
import { FilterTabs } from "./_components/filter-tabs";

import type { Tab } from "@/stores/use-todos-store";

const TodosPage = () => {
  const todos = useTodosStore((s) => s.todos);
  const tab = useTodosStore((s) => s.tab);
  const getTodos = useTodosStore((s) => s.getTodos);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);

  const counts: Record<Tab, number> = useMemo(() => {
    const notDeleted = todos.filter((t) => !t.deleted_at).length;
    const completed = todos.filter((t) => t.completed && !t.deleted_at).length;
    return {
      all: notDeleted,
      active: notDeleted - completed,
      completed,
      deleted: todos.filter((t) => t.deleted_at).length,
    };
  }, [todos]);
  const filteredTodos = useMemo(() => {
    if (tab === "active") return todos.filter((t) => !t.completed && !t.deleted_at);
    if (tab === "completed") return todos.filter((t) => t.completed && !t.deleted_at);
    if (tab === "deleted") return todos.filter((t) => t.deleted_at);
    return todos.filter((t) => !t.deleted_at);
  }, [todos, tab]);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      {openCreateDialog && <CreateNewTaskDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />}

      <div className="mx-auto max-w-2xl">
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {counts.all === 0
                ? "Stay organized and keep track of your daily goals."
                : `${counts.active} remaining · ${counts.completed} completed`}
            </p>
          </div>

          <Button onClick={() => setOpenCreateDialog(true)}>
            <PlusIcon />
            Add New Todo
          </Button>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <FilterTabs counts={counts} />
        </div>

        {/* List */}
        <div className="bg-card mt-2 overflow-hidden rounded-xl border shadow-sm">
          {filteredTodos.length === 0 ? (
            <EmptyState tab={tab} onCreate={() => setOpenCreateDialog(true)} />
          ) : (
            <ul className="divide-y" aria-label="Todos">
              {filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export { TodosPage };
