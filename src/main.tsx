import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "./components/ui/toast";
import { ThemeProvider } from "./components/theme-provider";

import "./globals.css";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultErrorComponent: ({ error }: { error: any }) => (
    <div className="p-6 bg-zinc-950 text-red-400 font-mono min-h-screen overflow-auto">
      <h1 className="text-xl font-bold text-red-500 mb-2">
        {error.name}: {error.message}
      </h1>
      <pre className="text-xs text-zinc-300 bg-zinc-900 p-4 rounded border border-red-900/50">{error.stack}</pre>
    </div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
