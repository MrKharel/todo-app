import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/errors";

import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Todo } from "@/types";

function LoadingState() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading todos">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-4">
          <Skeleton className="size-5" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({ query, hasData }: { query: UseQueryResult<Todo[], Error>; hasData: boolean }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{hasData ? "Showing saved todos" : "Couldn't load your todos"}</AlertTitle>
      <AlertDescription>
        <p>{getErrorMessage(query.error)}</p>
        <Button variant="outline" size="sm" className="mt-2" disabled={query.isFetching} onClick={() => void query.refetch()}>
          <RefreshCwIcon className={query.isFetching ? "animate-spin" : undefined} />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/** Loading and error states for anything driven by `useTodosQuery`. */
export function TodosBoundary({ query, children }: { query: UseQueryResult<Todo[], Error>; children: ReactNode }) {
  if (query.isPending) return <LoadingState />;
  if (query.isError && !query.data) return <ErrorBanner query={query} hasData={false} />;

  return (
    <div className="flex flex-col gap-4">
      {/* A failed background refetch keeps the last good data visible. */}
      {query.isError && <ErrorBanner query={query} hasData />}
      {children}
    </div>
  );
}
