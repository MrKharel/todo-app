import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodos, deleteTodo, listTodos, restoreTodo, updateTodo } from "@/commands";

import type { Todo } from "@/types";

const TODOS_QUERY_KEY = ["todos", "all"] as const;
const TODOS_STALE_TIME = 5 * 60 * 1000;
const TODOS_LIMIT = 10000;

export const useTodosQuery = () => {
  return useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => listTodos({ limit: TODOS_LIMIT }),
    staleTime: TODOS_STALE_TIME,
  });
};

export const useCreateTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodos,
    onMutate: async () => {
      await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
      const oldQuery = queryClient.getQueryData(TODOS_QUERY_KEY);
      return { oldQuery };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error, _variables, context) => {
      console.error(error);
      if (context?.oldQuery) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.oldQuery);
      }
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (values: { id: number; updates: { title?: string; completed?: boolean } }) => {
      await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
      const oldQuery = queryClient.getQueryData(TODOS_QUERY_KEY);

      queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old = []) =>
        old.map((todo) => (todo.id === values.id ? { ...todo, ...values.updates } : todo)),
      );

      return { oldQuery };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error, _variables, context) => {
      console.error(error);
      if (context?.oldQuery) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.oldQuery);
      }
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};

export const useRestoreTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
  });
};
