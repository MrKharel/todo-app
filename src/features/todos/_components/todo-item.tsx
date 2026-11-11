import { useState } from "react";
import { useTodosStore } from "@/stores/use-todos-store";
import { cn } from "cn";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UpdateTodo } from "./update-todo";

import type { Todo } from "@/stores/use-todos-store";

type TodoItemProps = {
  todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  const updateTodo = useTodosStore((s) => s.updateTodo);
  const deleteTodo = useTodosStore((s) => s.deleteTodo);
  const [openUpdateTodo, setOpenUpdateTodo] = useState(false);

  return (
    <li className="group hover:bg-muted/50 flex items-center justify-between gap-4 p-4 transition-colors">
      {openUpdateTodo && (
        <UpdateTodo
          id={todo.id}
          todoTitle={todo.title}
          todoCategory={todo.category}
          open={openUpdateTodo}
          setOpen={setOpenUpdateTodo}
        />
      )}

      <div className="flex min-w-0 items-center gap-3.5">
        <Checkbox
          id={todo.id.toString()}
          checked={todo.completed}
          onCheckedChange={() => updateTodo(todo.id, { completed: true })}
        />
        <Label
          htmlFor={todo.id.toString()}
          className={cn(
            "cursor-pointer truncate text-sm font-medium",
            todo.completed && "text-muted-foreground line-through",
          )}
          title={todo.title}
        >
          {todo.title}
        </Label>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Badge variant="secondary">{todo.category}</Badge>

        {/* Always visible on touch / keyboard focus, hover-reveal on desktop */}
        <div className="flex items-center gap-1 opacity-100 transition-opacity focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Edit “${todo.title}”`}
                  onClick={() => setOpenUpdateTodo(true)}
                />
              }
            >
              <PencilIcon />
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive size-8"
                  aria-label={`Delete “${todo.title}”`}
                  onClick={() => deleteTodo(todo.id, todo.title)}
                />
              }
            >
              <Trash2Icon />
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </li>
  );
};

export { TodoItem };
