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
export type Tab = "all" | "completed" | "active" | "deleted";
export type GetParams = { includeDeletedTodos?: boolean; completed?: boolean; category?: string };
export type Counts = Record<Tab, number>;

export type TodosStoreState = {
  todos: Todo[];
  tab: Tab;
};

export type TodosStoreAction = {
  getTodos: (params?: GetParams) => void;
  insertTodo: ({ title, category }: { title: string; category: string }) => void;
  updateTodo: (
    id: number,
    updates: { title?: string; completed?: boolean; category?: string; deleted_at?: string },
  ) => void;
  softDeleteTodo: (id: number) => void;
  restoreTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  setTab: (tab: Tab) => void;
};

export type TodosStore = TodosStoreState & TodosStoreAction;

function createTodosStore() {
  return create<TodosStore>((set, get) => ({
    todos: [],
    tab: "all",

    getTodos: async (params) => {
      let args = {};
      if (params) {
        args = {
          params: {
            include_deleted_todos: params.includeDeletedTodos ?? false,
            completed: params.completed,
            category: params.category,
          },
        };
      } else {
        args = {
          params: {
            include_deleted_todos: true,
          },
        };
      }

      const todos = (await invoke("get_todos", args)) as Todo[];
      set({ todos });
      get().setCounts();
    },

    updateTodo: async (id, updates) => {
      await invoke("update_todo", { id, updates });
      get().getTodos();
    },

    deleteTodo: async (id) => {
      const data = (await invoke("delete_todo", { id })) as Todo[];
      set({ todos: data });
      get().setCounts();
      toast.add({ title: "1 todo deleted successfully" });
    },

    insertTodo: async (inserts) => {
      const newTodo = (await invoke("insert_todo", { inserts })) as Todo;
      set({ todos: [...get().todos, newTodo] });
      get().setCounts();
    },

    softDeleteTodo: async (id) => {
      const deletedTodo = (await invoke("soft_delete_todo", { id })) as Todo;
      set({ todos: [...get().todos.filter((todo) => todo.id !== deletedTodo.id)] });
      toast.add({ title: "1 todo moved to trash" });
      get().setCounts();
    },

    restoreTodo: async (id) => {
      const todos = (await invoke("restore_todo", { id })) as Todo[];
      set({ todos });
      toast.add({ title: "1 todo restored" });
      get().setCounts();
    },

    setTab: (tab) => {
      set({ tab });
    },
  }));
}

export const useTodosStore = createTodosStore();
