import { useCallback } from "react";
import { toast } from "sonner";

import { useEditTodo } from "@/components/edit-context";
import { useDeleteTodo, useRestoreTodo, useUpdateTodo } from "@/hooks/use-todos";
import { getErrorMessage } from "@/lib/errors";

import type { Todo } from "@/types";

/** Row-level actions shared by every todo list (mobile and desktop). */
export function useTodoActions() {
  const { mutate: update } = useUpdateTodo();
  const { mutate: remove } = useDeleteTodo();
  const { mutate: restore } = useRestoreTodo();
  const { editingId, closeEditor } = useEditTodo();

  const onToggle = useCallback(
    (id: Todo["id"], completed: boolean) =>
      update(
        { id, updates: { completed } },
        { onError: (error) => toast.error("Couldn't update todo", { description: getErrorMessage(error) }) },
      ),
    [update],
  );

  const onRestore = useCallback(
    (id: Todo["id"]) =>
      restore(id, {
        onSuccess: () => toast.success("Todo restored"),
        onError: (error) => toast.error("Couldn't restore todo", { description: getErrorMessage(error) }),
      }),
    [restore],
  );

  const onDelete = useCallback(
    (id: Todo["id"]) =>
      remove(id, {
        onSuccess: () => {
          if (editingId === id) closeEditor();
          // Soft delete is reversible, so undo beats a confirmation dialog.
          toast("Todo deleted", { action: { label: "Undo", onClick: () => onRestore(id) } });
        },
        onError: (error) => toast.error("Couldn't delete todo", { description: getErrorMessage(error) }),
      }),
    [remove, editingId, closeEditor, onRestore],
  );

  return { onToggle, onDelete, onRestore };
}
