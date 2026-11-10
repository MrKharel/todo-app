import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type Todo, type Tab, type TodoInput } from "./constants";

type TodosStore = {
  todos: Todo[];
  tab: Tab;

  setTab: (tab: Tab) => void;
  addTodo: (input: TodoInput) => void;
  updateTodo: (id: string, input: TodoInput) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  restoreTodo: (todo: Todo, index: number) => void;
  clearCompleted: () => void;
};

const useTodosStore = create<TodosStore>()(
  persist(
    (set) => ({
      todos: [],
      tab: "all",

      setTab: (tab) => set({ tab }),

      addTodo: ({ title, category }) =>
        set((s) => ({
          todos: [
            {
              id: crypto.randomUUID(),
              user_id: 1,
              title,
              category,
              completed: false,
            },
            ...s.todos,
          ],
        })),

      updateTodo: (id, { title, category }) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, title, category } : t,
          ),
        })),

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      deleteTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      restoreTodo: (todo, index) =>
        set((s) => {
          const next = [...s.todos];
          next.splice(Math.min(index, next.length), 0, todo);
          return { todos: next };
        }),

      clearCompleted: () =>
        set((s) => ({ todos: s.todos.filter((t) => !t.completed) })),
    }),
    {
      name: "todos-store",
      // The active tab is UI state, not data worth persisting.
      partialize: (s) => ({ todos: s.todos }),
    },
  ),
);

export { useTodosStore };
