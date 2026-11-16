import { Link } from "@tanstack/react-router";
import { ListChecksIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTodoGroups } from "@/hooks/use-todo-groups";
import { TodosList } from "./todos-list";

/** Incomplete + completed sections. Used as the desktop first column and the mobile home page. */
export function TodoSections() {
  const { incomplete, completed } = useTodoGroups();

  if (incomplete.length === 0 && completed.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card text-center">
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
    );
  }

  return (
    <TodosList todos={[...incomplete, ...completed]} headerText="Todos" emptyText="Nothing waiting. Enjoy the quiet." />
  );
}
