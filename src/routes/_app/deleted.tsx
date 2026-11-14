import { createFileRoute } from "@tanstack/react-router";

import { TodosBoundary } from "@/components/todos-boundary";
import { TodosList } from "@/components/todos-list";
import { useTodoGroups } from "@/hooks/use-todo-groups";

export const Route = createFileRoute("/_app/deleted")({
  component: DeletedPage,
});

function DeletedPage() {
  const { query, deleted } = useTodoGroups();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold lg:sr-only">Deleted</h1>
      <TodosBoundary query={query}>
        <TodosList todos={deleted} mode="deleted" headerText="Deleted" emptyText="Deleted todos will show up here, ready to restore." />
      </TodosBoundary>
    </div>
  );
}
