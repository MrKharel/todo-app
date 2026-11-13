import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

import { toast } from "sonner";

export type Todo = {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  created_at: string;
  deleted_at: string | null;
};
export type Filter = null | "trashed" | "completed" | "active";

export type TodosStoreState = {
  todos: Todo[];
};

export type TodosStoreAction = {
  getTodos: (params: { includeDeletedTodos?: boolean }) => void;
  insertTodo: ({ title, category }: { title: string; category: string }) => void;
  updateTodo: (
    id: number,
    updates: { title?: string; completed?: boolean; category?: string; deleted_at?: string },
  ) => void;
  softDeleteTodo: (id: number) => void;
  restoreTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
};

export type TodosStore = TodosStoreState & TodosStoreAction;

function createTodosStore() {
  return create<TodosStore>((set) => ({
    todos: [],

    getTodos: async (params) => {
      const todos = (await invoke("get_todos", { params })) as Todo[];
      set({ todos });
    },

    updateTodo: async (id, updates) => {
      const todos = (await invoke("update_todo", { id, updates })) as Todo[];
      set({ todos });
      toast("1 todo updates", {});
    },

    deleteTodo: async (id) => {
      const data = (await invoke("delete_todo", { id })) as Todo[];
      set({ todos: data });
      toast("1 todo deleted successfully", {});
    },

    insertTodo: async (inserts) => {
      const todos = (await invoke("insert_todo", { inserts })) as Todo[];
      set({ todos });
      toast("1 new todo created", {});
    },

    softDeleteTodo: async (id) => {
      const todos = (await invoke("soft_delete_todo", { id })) as Todo[];
      set({ todos });
      toast("1 todo moved to trash", {});
    },

    restoreTodo: async (id) => {
      const todos = (await invoke("restore_todo", { id })) as Todo[];
      set({ todos });
      toast("1 todo restored", {});
    },
  }));
}

export const useTodosStore = createTodosStore();
