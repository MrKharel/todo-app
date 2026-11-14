import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTimestamp } from "@/lib/format";

import type { Todo } from "@/types";

type TodoDetailsDialogProps = {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TodoDetailsDialog({ todo, open, onOpenChange }: TodoDetailsDialogProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Created", value: formatTimestamp(todo.created_at) },
    { label: "Last updated", value: formatTimestamp(todo.updated_at) },
  ];
  if (todo.deleted_at !== null) rows.push({ label: "Deleted", value: formatTimestamp(todo.deleted_at) });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription className="break-words">{todo.title}</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="col-span-2 grid grid-cols-subgrid">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
