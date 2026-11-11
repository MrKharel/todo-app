import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

import { toast } from "@/components/ui/toast";

export type Todo = {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  created_at: string;
  deleted_at: string | null;
};

export type TodosStoreState = {
  todos: Todo[];
};

export type TodosStoreAction = {
  getTodos: () => void;
  updateTodo: (
    id: number,
    updates: { title?: string; completed?: boolean; category?: string; deleted_at?: string },
  ) => void;
  deleteTodo: (id: number, title: string) => Promise<void>;
  insertTodo: ({ title, category }: { title: string; category: string }) => void;
};

export type TodosStore = TodosStoreState & TodosStoreAction;

function createTodosStore() {
  return create<TodosStore>((set, get) => ({
    todos: [],

    getTodos: async () => {
      const todos = (await invoke("get_todos")) as Todo[];
      set({ todos });
    },

    updateTodo: async (id, updates) => {
      const todos = (await invoke("update_todo", { id, updates })) as Todo[];
      set({ todos });
    },

    deleteTodo: async (id, title) => {
      const previousTodos = get().todos;
      const updatedTodos = previousTodos.filter((todo) => todo.id !== id);

      set({ todos: updatedTodos });

      let undone = false;

      toast.add({
        title: "Todo deleted successfully",
        description: title,
        actionProps: {
          children: "Undo",
          onClick() {
            undone = true;
            set({ todos: updatedTodos });
          },
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (undone) return;

      try {
        const data = (await invoke("delete_todo", { id })) as Todo[];
        if (data) {
          set({ todos: data });
        }
      } catch (error) {
        set({ todos: previousTodos });
        console.error("Failed to delete todo:", error);
      }
    },

    insertTodo: async (inserts) => {
      const todos = (await invoke("insert_todo", { inserts })) as Todo[];
      set({ todos });
    },
  }));
}

export const useTodosStore = createTodosStore();
