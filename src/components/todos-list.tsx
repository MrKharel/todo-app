import { useEditTodo } from "@/components/edit-context";
import { useTodoActions } from "@/hooks/use-todo-actions";

import { TodoItem } from "./todo-item";

import type { Todo } from "@/types";

type TodosListProps = {
  todos: Todo[];
  headerText?: string;
  emptyText?: string;
  mode?: "active" | "deleted";
};

export const TodosList = ({ todos, headerText, emptyText = "Nothing to do yet.", mode = "active" }: TodosListProps) => {
  const { onToggle, onDelete, onRestore } = useTodoActions();
  const { openEditor } = useEditTodo();

  return (
    <section
      className="bg-card text-card-foreground shadow-xs overflox-y-auto scrollbar max-w-2xl mx-auto"
      aria-label={headerText}
    >
      {headerText && (
        <h2 className="flex items-center gap-2 px-2 pt-2 pb-3 text-lg font-semibold">
          {headerText}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {todos.length}
          </span>
        </h2>
      )}

      {todos.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="flex flex-col">
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem
                todo={todo}
                mode={mode}
                onEdit={openEditor}
                onDelete={onDelete}
                onRestore={onRestore}
                onToggle={onToggle}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
