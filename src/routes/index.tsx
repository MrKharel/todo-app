import { createFileRoute } from "@tanstack/react-router";
import { getTodos, type Todo } from "@/commands";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
      const handleGetTodos = async () => {
        const todos = await getTodos();
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
