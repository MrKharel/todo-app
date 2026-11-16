import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/app-nav";
import { EditProvider } from "@/components/edit-context";
import { EditTodoDialog } from "@/components/edit-todo-dialog";
import { TodoSections } from "@/components/todo-sections";
import { Toaster } from "@/components/ui/sonner";
import { useIsDesktop } from "@/hooks/use-media-query";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const isDesktop = useIsDesktop();

  return (
    <EditProvider>
      <Layout />
      <Toaster position={isDesktop ? "bottom-right" : "top-center"} />
    </EditProvider>
  );
}

function Layout() {
  return (
    <>
      <main className="mx-auto max-w-xl px-4 pt-6 pb-28">
        <Outlet />
      </main>
      <Nav />
      <EditTodoDialog />
    </>
  );
}
