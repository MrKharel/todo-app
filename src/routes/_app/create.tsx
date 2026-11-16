import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CreateTodosForm } from "@/components/create-todos-form";

export const Route = createFileRoute("/_app/create")({
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4 lg:bg-card lg:p-6 lg:shadow-xs" aria-label="Create todos">
      <div>
        <h1 className="text-2xl font-semibold lg:text-lg">Create todos</h1>
        <p className="text-sm text-muted-foreground">Add one or more todos and save them together.</p>
      </div>

      {/* On mobile, jump back home after saving; on desktop the first column already updates. */}
      <CreateTodosForm onCreated={() => void navigate({ to: "/" })} />
    </section>
  );
}
