import { invoke } from "@tauri-apps/api/core";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  created_at: number;
  updated_at: number; // was `updated_st`
  deleted_at: string;
};

export const getTodos = async (params?: { limit?: number }): Promise<Todo[]> => {
  return (await invoke("list_todos", {
    params: { limit: params?.limit ?? 10000 },
  })) as Todo[];
};

export const updateTodos = async (values: { id: number; title?: string; completed?: boolean }[]) =>
  invoke("update_todos", { values });

export const addTodos = async (values: { title: string; completed?: boolean }[]) => invoke("add_todos", { values });

export const deleteTodos = async (ids: number[]) => invoke("delete_todos", { ids });

export const restoreTodos = async (ids: number[]) => invoke("restore_todos", { ids });
