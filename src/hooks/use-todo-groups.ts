import { useMemo } from "react";

import { useTodosQuery } from "@/hooks/use-todos";

import type { Todo } from "@/types";

/**
 * One pass over the cached todos, memoised on the query data.
 * Soft-deleted todos (`deleted_at !== null`) never appear in the active groups.
 */
export function useTodoGroups() {
  const query = useTodosQuery();

  const groups = useMemo(() => {
    const incomplete: Todo[] = [];
    const completed: Todo[] = [];
    const deleted: Todo[] = [];

    for (const todo of query.data ?? []) {
      if (todo.deleted_at !== null) deleted.push(todo);
      else if (todo.completed) completed.push(todo);
      else incomplete.push(todo);
    }

    incomplete.sort((a, b) => b.created_at - a.created_at);
    completed.sort((a, b) => b.updated_at - a.updated_at);
    deleted.sort((a, b) => (b.deleted_at ?? 0) - (a.deleted_at ?? 0));

    return { incomplete, completed, deleted };
  }, [query.data]);

  return { query, ...groups };
}
