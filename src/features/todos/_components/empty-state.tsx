import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, ListTodoIcon, PlusIcon } from "lucide-react";

import type { Tab } from "@/stores/use-todos-store";

const EMPTY_COPY: Record<Tab, { title: string; description: string }> = {
  all: {
    title: "No tasks yet",
    description: "Create your first task to get started.",
  },
  active: {
    title: "Nothing left to do",
    description: "All your tasks are completed. Nice work!",
  },
  completed: {
    title: "No completed tasks",
    description: "Tasks you finish will show up here.",
  },
  deleted: {
    title: "No deleted task",
    description: "Task you delete will show here. If you delete the task from here, it can never be recovered.",
  },
};

const EmptyState = ({ tab, onCreate }: { tab: Tab; onCreate: () => void }) => {
  const { title, description } = EMPTY_COPY[tab];
  const Icon = tab === "active" ? CheckCircle2Icon : ListTodoIcon;

  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="bg-muted rounded-full p-3">
        <Icon className="text-muted-foreground size-6" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {tab === "all" && (
        <Button size="sm" onClick={onCreate}>
          <PlusIcon />
          Add New Todo
        </Button>
      )}
    </div>
  );
};

export { EmptyState };
