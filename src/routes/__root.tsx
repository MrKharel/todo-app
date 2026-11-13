import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
export const Route = createRootRouteWithContext()({ component: Root });
function Root() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Outlet />
    </div>
  );
}
