import { useEffect } from "react";

import { useEditTodo } from "@/components/edit-context";
import { useTodosQuery } from "@/hooks/use-todos";

import type { Todo } from "@/types";

/**
 * Resolves the todo being edited from the query cache. If it disappears (deleted elsewhere,
 * another window, refetch) the editor closes instead of showing stale data.
 */
export function useEditingTodo(): { todo: Todo | undefined; close: () => void } {
  const { editingId, closeEditor } = useEditTodo();
  const { data, isSuccess } = useTodosQuery();

  const todo = editingId === null ? undefined : data?.find((t) => t.id === editingId && t.deleted_at === null);

  useEffect(() => {
    if (editingId !== null && isSuccess && !todo) closeEditor();
  }, [editingId, isSuccess, todo, closeEditor]);

  return { todo, close: closeEditor };
}
