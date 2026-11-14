import { Link } from "@tanstack/react-router";
import { ListChecksIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTodoGroups } from "@/hooks/use-todo-groups";
import { TodosBoundary } from "./todos-boundary";
import { TodosList } from "./todos-list";

/** Incomplete + completed sections. Used as the desktop first column and the mobile home page. */
export function TodoSections() {
  const { query, incomplete, completed } = useTodoGroups();

  return (
    <TodosBoundary query={query}>
      {incomplete.length === 0 && completed.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <ListChecksIcon className="size-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No todos yet</p>
            <p className="text-sm text-muted-foreground">Add a few to get started.</p>
          </div>
          <Button nativeButton={false} render={<Link to="/create" />}>
            <PlusIcon />
            Create todos
          </Button>
        </div>
      ) : (
        <>
          <TodosList todos={incomplete} headerText="To do" emptyText="All caught up. Nice work!" />
          <TodosList todos={completed} headerText="Completed" emptyText="Nothing completed yet." />
        </>
      )}
    </TodosBoundary>
  );
}
