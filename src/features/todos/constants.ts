// CONSTANTS
export const TITLE_MAX_LENGTH = 120;

// TYPES
export type Todo = {
  id: string;
  user_id: number;
  title: string;
  category: string;
  completed: boolean;
};
export type TodoInput = Pick<Todo, "title" | "category">;
export type Tab = "all" | "active" | "completed";
