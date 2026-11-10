import { PlusIcon, CheckCircle2Icon, ListTodoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Tab } from "../constants";

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
};

const TodoEmptyState = ({
  tab,
  onCreate,
}: {
  tab: Tab;
  onCreate: () => void;
}) => {
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

export { TodoEmptyState };
