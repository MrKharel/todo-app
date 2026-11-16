import { useIsDesktop } from "@/hooks/use-media-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";

import { Nav } from "@/components/app-nav";
import { EditProvider } from "@/components/edit-context";
import { EditTodoDialog } from "@/components/edit-todo-dialog";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const isDesktop = useIsDesktop();

  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <EditProvider>
        <Layout />
        <Toaster position={isDesktop ? "bottom-right" : "top-center"} />
      </EditProvider>
    </ThemeProvider>
  );
}

function Layout() {
  return (
    <>
      <main className="w-screen h-screen max-h-screen flex flex-col gap-1 overflow-hidden">
        <div className="flex-1 overflow-auto scrollbar">
          <Outlet />
        </div>
        <Nav />
      </main>
      <EditTodoDialog />
    </>
  );
}
