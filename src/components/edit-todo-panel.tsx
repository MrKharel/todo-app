import { useEditingTodo } from "@/hooks/use-editing-todo";
import { EditTodoForm } from "./edit-todo-form";

import type { Todo } from "@/types";

/** Desktop edit UI for the second column. */
export function EditTodoPanel({ todo }: { todo: Todo }) {
  const { close } = useEditingTodo();

  return (
    <section className="rounded-xl border bg-card p-6 shadow-xs" aria-label="Edit todo">
      <h2 className="text-lg font-semibold">Edit todo</h2>
      <p className="mb-5 text-sm text-muted-foreground">Update the title or completion status.</p>
      <EditTodoForm key={todo.id} todo={todo} onDone={close} onCancel={close} />
    </section>
  );
}
