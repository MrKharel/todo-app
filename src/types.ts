// STAND-IN: your project already has this file. Keep yours.
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  /** Unix timestamp in seconds (from Rust). */
  created_at: number;
  updated_at: number;
  deleted_at: null | number;
};
