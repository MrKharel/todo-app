import { useTodoGroups } from "@/hooks/use-todo-groups";
import { TodosBoundary } from "./todos-boundary";
import { TodosList } from "./todos-list";

/** Default desktop workspace: the oldest open todos and the latest completed ones. */
export function TodoOverview() {
  const { query, incomplete, completed } = useTodoGroups();
  const upNext = [...incomplete].sort((a, b) => a.created_at - b.created_at).slice(0, 5);

  return (
    <TodosBoundary query={query}>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Open" value={incomplete.length} />
        <Stat label="Done" value={completed.length} />
      </div>
      <TodosList todos={upNext} headerText="Up next" emptyText="Nothing waiting. Enjoy the quiet." />
      <TodosList todos={completed.slice(0, 5)} headerText="Recently completed" emptyText="Completed todos will show up here." />
    </TodosBoundary>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
