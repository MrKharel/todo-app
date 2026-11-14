import { invoke } from "@tauri-apps/api/core";

import type { Todo } from "./types";

export const listTodos = async (params: { limit: number }): Promise<Todo[]> =>
  (await invoke("list_todos", { params })) as Todo[];

export const addTodos = async (values: { title: string; completed: boolean }[]): Promise<boolean> =>
  (await invoke("add_todos", { values })) as boolean;

export const updateTodo = async (values: {
  id: number;
  updates: { title?: string; completed?: boolean };
}): Promise<boolean> => (await invoke("update_todo", values)) as boolean;

export const deleteTodo = async (id: number): Promise<boolean> => (await invoke("delete_todo", { id })) as boolean;

export const restoreTodo = async (id: number): Promise<boolean> => (await invoke("restore_todo", { id })) as boolean;
