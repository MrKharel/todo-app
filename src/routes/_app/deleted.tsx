import { createFileRoute } from "@tanstack/react-router";

import { TodosList } from "@/components/todos-list";
import { useTodoGroups } from "@/hooks/use-todo-groups";

export const Route = createFileRoute("/_app/deleted")({
  component: DeletedPage,
});

function DeletedPage() {
  const { deleted } = useTodoGroups();

  return (
    <div className="flex flex-col gap-4">
      <TodosList
        todos={deleted}
        mode="deleted"
        headerText="Deleted"
        emptyText="Deleted todos will show up here, ready to restore."
      />
    </div>
  );
}
