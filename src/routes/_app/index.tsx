import { createFileRoute } from "@tanstack/react-router";
import { TodoSections } from "@/components/todo-sections";
export const Route = createFileRoute("/_app/")({
  component: () => {
    return (
      <div className="flex flex-col gap-4">
        <TodoSections />
      </div>
    );
  },
});
