import { useState } from "react";
import { useTodosStore } from "@/stores/use-todos-store";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  TODO_TITLE_PLACEHOLDER,
  MAX_TODO_TITLE_LENGTH,
  MAX_TODO_CATEGORY_LENGTH,
  DEFAULT_TODO_CATEGORY,
} from "../constants";
import type { Dispatch, SetStateAction, SubmitEvent } from "react";

type DialogProps = {
  id: number;
  todoTitle: string;
  todoCategory: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UpdateTodo = ({ id, todoTitle, todoCategory, open, setOpen }: DialogProps) => {
  const updateTodo = useTodosStore((s) => s.updateTodo);
  const [title, setTitle] = useState(todoTitle);
  const [category, setCategory] = useState(todoCategory);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    updateTodo(id, { title, category });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uptate task "{title}"</DialogTitle>
          <DialogDescription>TODO: WRITE THE DESCRIPTION</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <Field>
              <Label htmlFor="todo-title">Title</Label>
              <Input
                id="todo-title"
                placeholder={TODO_TITLE_PLACEHOLDER}
                maxLength={MAX_TODO_TITLE_LENGTH}
                autoFocus
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>

            <Field>
              <Label htmlFor="todo-category">Category</Label>
              <Input
                id="todo-category"
                placeholder={DEFAULT_TODO_CATEGORY}
                maxLength={MAX_TODO_CATEGORY_LENGTH}
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Field>

            <div className="flex flex-col gap-2">
              <Button type="submit">Update Todo</Button>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            </div>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { UpdateTodo };
