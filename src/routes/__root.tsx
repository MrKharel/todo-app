// STAND-IN: your project already has routes/__root.tsx. Keep yours.
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <Outlet />,
});
