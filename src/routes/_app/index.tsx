import { createFileRoute } from "@tanstack/react-router";

import { EditTodoPanel } from "@/components/edit-todo-panel";
import { TodoOverview } from "@/components/todo-overview";
import { TodoSections } from "@/components/todo-sections";
import { useEditingTodo } from "@/hooks/use-editing-todo";
import { useIsDesktop } from "@/hooks/use-media-query";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopWorkspace /> : <MobileHome />;
}

function MobileHome() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Todos</h1>
      <TodoSections />
    </div>
  );
}

function DesktopWorkspace() {
  const { todo } = useEditingTodo();
  return todo ? <EditTodoPanel todo={todo} /> : <TodoOverview />;
}
