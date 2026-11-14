import { createFileRoute } from "@tanstack/react-router";

import { useTodosQuery } from "@/hooks/use-todos";
import { SiteHeader } from "@/components/site-header";
import { TodosList } from "@/components/todos-list";
import { useMemo } from "react";

import type { Todo } from "@/types";

export const Route = createFileRoute("/")({
  component: TodosPage,
});

type Filter = "notDeletedTodos" | "deletedTodos" | "notCompletedTodos" | "completedTodos";

function TodosPage() {
  const todosQuery = useTodosQuery();

  const filterTodos = (): Record<Filter, Todo[]> => {
    if (todosQuery.isLoading)
      return { notDeletedTodos: [], notCompletedTodos: [], completedTodos: [], deletedTodos: [] };
    return {
      notDeletedTodos: todosQuery.data?.filter((todo) => !todo.deleted_at) ?? [],
      deletedTodos: todosQuery.data?.filter((todo) => todo.deleted_at) ?? [],
      notCompletedTodos: todosQuery.data?.filter((todo) => !todo.completed) ?? [],
      completedTodos: todosQuery.data?.filter((todo) => todo.completed) ?? [],
    };
  };

  const todos = useMemo((): Record<Filter, Todo[]> => {
    const start = performance.now();
    const todos = filterTodos();
    console.log(`filterTodos: ${(performance.now() - start).toFixed(3)}ms`);
    return todos;
  }, [todosQuery.isLoading, todosQuery.data]);
  console.log({ ...todos, todos: todosQuery.data, isLoading: todosQuery.isLoading });

  return (
    <>
      <SiteHeader />
      <TodosList todos={todos.notDeletedTodos} headerText="ActiveTodos" />
    </>
  );
}
