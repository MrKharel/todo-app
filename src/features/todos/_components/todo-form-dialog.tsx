import { useTodosStore } from "../use-todos-store";

import { useState } from "react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TITLE_MAX_LENGTH, type Todo } from "../constants";

type TodoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo | null;
};

const TodoFormDialog = ({ open, onOpenChange, todo }: TodoFormDialogProps) => {
  const addTodo = useTodosStore((s) => s.addTodo);
  const updateTodo = useTodosStore((s) => s.updateTodo);

  const isEditing = todo !== null;

  const [title, setTitle] = useState(todo?.title ?? "");
  const [category, setCategory] = useState<string>(
    todo?.category ?? "Personal",
  );
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      // Reset after the close animation so content doesn't flash.
      setTimeout(() => {
        setTitle(todo?.title ?? "");
        setCategory(todo?.category ?? "");
        setError(null);
      }, 150);
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Whitespace is intentional, so the value is used exactly as typed.
    if (title.length === 0) {
      setError("Please enter a title.");
      return;
    }

    if (title.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or fewer.`);
      return;
    }

    if (isEditing) {
      updateTodo(todo.id, { title, category });
      toast.add({ type: "success", title: "Task updated" });
    } else {
      addTodo({ title, category });
      toast.add({ type: "success", title: "Task created" });
    }

    onOpenChange(false);

    if (!isEditing) {
      setTitle("");
      setCategory("Personal");
    }
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="grid gap-6">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit task" : "Add new task"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your task."
                : "What do you need to get done?"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="todo-title">Title</Label>
              <Input
                id="todo-title"
                value={title}
                autoFocus
                autoComplete="off"
                maxLength={TITLE_MAX_LENGTH + 20}
                placeholder="e.g. Write unit tests"
                aria-invalid={error !== null}
                aria-describedby={error ? "todo-title-error" : undefined}
                onChange={(e: any) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="todo-title">Category</Label>
              <Input
                id="todo-title"
                value={category}
                autoComplete="off"
                maxLength={TITLE_MAX_LENGTH + 20}
                placeholder="e.g. Write unit tests"
                aria-invalid={error !== null}
                aria-describedby={error ? "todo-title-error" : undefined}
                onChange={(e: any) => {
                  setCategory(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            {error && (
              <p
                id="todo-title-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save changes" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { TodoFormDialog };
