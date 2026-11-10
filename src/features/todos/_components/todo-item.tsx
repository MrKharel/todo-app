import { cn } from "cn";
import { useTodosStore } from "../use-todos-store";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { type Todo } from "../constants";

type TodoItemProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

const TodoItem = ({ todo, onEdit, onDelete }: TodoItemProps) => {
  const toggleTodo = useTodosStore((s) => s.toggleTodo);
  const checkboxId = `todo-${todo.id}`;

  return (
    <li className="group hover:bg-muted/50 flex items-center justify-between gap-4 p-4 transition-colors">
      <div className="flex min-w-0 items-center gap-3.5">
        <Checkbox
          id={checkboxId}
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
        />
        <Label
          htmlFor={checkboxId}
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
                  onClick={() => onEdit(todo)}
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
                  onClick={() => onDelete(todo)}
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
