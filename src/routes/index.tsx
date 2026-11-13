import { invoke } from "@tauri-apps/api/core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Todo = {
  title: string;
};

export const Route = createFileRoute("/")({
  component: () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
      const handleGetTodos = async () => {
        const todos = (await invoke("list_todos", { params: { limit: 10000 } })) as Todo[];
        setTodos(todos ?? []);
      };
      handleGetTodos();
    }, []);

    return (
      <>
        {todos.map((todo, index) => (
          <p key={index}>{todo.title}</p>
        ))}
      </>
    );
  },
});
