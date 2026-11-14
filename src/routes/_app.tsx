import { Outlet, createFileRoute } from "@tanstack/react-router";

import { DesktopNav, MobileNav } from "@/components/app-nav";
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
      {/* Only one layout is mounted at a time, so state and queries aren't duplicated. */}
      {isDesktop ? <DesktopLayout /> : <MobileLayout />}
      <Toaster position={isDesktop ? "bottom-right" : "top-center"} />
    </EditProvider>
  );
}

function DesktopLayout() {
  return (
    <div className="mx-auto grid h-dvh max-w-7xl grid-cols-[minmax(22rem,28rem)_minmax(0,1fr)] gap-8 px-8">
      {/* First column stays mounted while the second changes with the route. */}
      <aside className="flex min-h-0 flex-col gap-4 py-6">
        <DesktopNav />
        <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
          <TodoSections />
        </div>
      </aside>
      <main className="min-h-0 overflow-y-auto py-6 pt-[3.25rem]">
        <Outlet />
      </main>
    </div>
  );
}

function MobileLayout() {
  return (
    <>
      <main className="mx-auto max-w-xl px-4 pt-6 pb-28">
        <Outlet />
      </main>
      <MobileNav />
      <EditTodoDialog />
    </>
  );
}
