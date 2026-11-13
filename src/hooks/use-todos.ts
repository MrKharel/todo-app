import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { getTodos, addTodos, updateTodos, deleteTodos, restoreTodos, type Todo } from "@/commands";

export const todoKeys = {
  all: ["todos"] as const,
  list: (limit?: number) => [...todoKeys.all, "list", { limit }] as const,
};

/** Raw query — filters out soft-deleted rows. */
export function useTodosQuery(limit?: number) {
  return useQuery({
    queryKey: todoKeys.list(limit),
    queryFn: async () => {
      // inline getTodos body so the queryFn is self-contained
      const todos = (await getTodos({ limit: limit ?? 5000 })) as Todo[];
      return todos.filter((t) => !t.deleted_at);
    },
    staleTime: 1 * 60 * 1000,
  });
}

/* -------- helpers -------- */

const patchList = (qc: ReturnType<typeof useQueryClient>, updater: (prev: Todo[]) => Todo[]) => {
  // Update every cached todo list (limit variants)
  qc.setQueriesData<Todo[]>({ queryKey: todoKeys.all }, (prev) => (prev ? updater(prev) : prev));
};

const snapshot = (qc: ReturnType<typeof useQueryClient>) => qc.getQueriesData<Todo[]>({ queryKey: todoKeys.all });

const restore = (qc: ReturnType<typeof useQueryClient>, prev: ReturnType<typeof snapshot>) => {
  for (const [key, data] of prev) {
    qc.setQueryData(key as QueryKey, data);
  }
};

/* -------- mutations -------- */

export function useAddTodos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addTodos,
    onMutate: async (values) => {
      await qc.cancelQueries({ queryKey: todoKeys.all });
      const prev = snapshot(qc);
      const now = Date.now();
      const optimistic: Todo[] = values.map((v, i) => ({
        id: -now - i, // temp negative id, server returns real ids
        title: v.title,
        completed: v.completed ?? false,
        created_at: now,
        updated_at: now,
        deleted_at: "",
      }));
      patchList(qc, (list) => [...optimistic, ...list]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => ctx && restore(qc, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useUpdateTodos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateTodos,
    onMutate: async (values) => {
      await qc.cancelQueries({ queryKey: todoKeys.all });
      const prev = snapshot(qc);
      const byId = new Map(values.map((v) => [v.id, v]));
      patchList(qc, (list) =>
        list.map((t) => {
          const patch = byId.get(t.id);
          return patch ? { ...t, ...patch, updated_at: Date.now() } : t;
        }),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => ctx && restore(qc, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useDeleteTodos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTodos,
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: todoKeys.all });
      const prev = snapshot(qc);
      const idSet = new Set(ids);
      patchList(qc, (list) => list.filter((t) => !idSet.has(t.id)));
      return { prev };
    },
    onError: (_err, _vars, ctx) => ctx && restore(qc, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}

export function useRestoreTodos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restoreTodos,
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
