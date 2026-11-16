import { memo, useState } from "react";
import { cn } from "cn";

import { EllipsisIcon, InfoIcon, PencilIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TodoDetailsDialog } from "./todo-details-dialog";

import type { Todo } from "@/types";
import { formatTimestamp } from "@/lib/format";

type TodoItemProps = {
  todo: Todo;
  /** "deleted" rows are read-only apart from restore and details. */
  mode?: "active" | "deleted";
  onEdit?: (id: Todo["id"]) => void;
  onDelete?: (id: Todo["id"]) => void;
  onRestore?: (id: Todo["id"]) => void;
  onToggle?: (id: Todo["id"], completed: boolean) => void;
};

export const TodoItem = memo(function TodoItem({
  todo,
  mode = "active",
  onEdit,
  onDelete,
  onRestore,
  onToggle,
}: TodoItemProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isDeleted = mode === "deleted";

  return (
    <div className="group flex items-center gap-3 px-2 py-2 transition-colors hover:bg-muted/50">
      <Checkbox
        id={String(todo.id)}
        checked={todo.completed}
        disabled={isDeleted}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "not completed" : "completed"}`}
        onCheckedChange={(checked) => onToggle?.(todo.id, checked)}
      />

      {isDeleted ? (
        <span className="min-w-0 flex-1 truncate text-base font-medium text-muted-foreground line-through">
          {todo.title}
        </span>
      ) : (
        <label
          htmlFor={String(todo.id)}
          className={cn(
            "min-w-0 flex-1 cursor-pointer truncate rounded-sm py-1 text-left text-base font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
            todo.completed && "text-muted-foreground line-through",
          )}
        >
          {todo.title}
        </label>
      )}

      <div>
        <p className="text-xs text-muted-foreground">{formatTimestamp(todo.created_at).split(",")[0]}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for "${todo.title}"`} />}
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isDeleted ? (
            <DropdownMenuItem onClick={() => onRestore?.(todo.id)}>
              <RotateCcwIcon />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onEdit?.(todo.id)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <InfoIcon />
            Details
          </DropdownMenuItem>
          {!isDeleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(todo.id)}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rendered outside the menu so it survives the menu closing. */}
      <TodoDetailsDialog todo={todo} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
});
