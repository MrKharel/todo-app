import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useIsDesktop } from "@/hooks/use-media-query";

import type { ReactNode } from "react";
import type { Todo } from "@/types";

type EditContextValue = {
  editingId: Todo["id"] | null;
  openEditor: (id: Todo["id"]) => void;
  closeEditor: () => void;
};

const EditContext = createContext<EditContextValue | null>(null);

/**
 * Holds only the *id* being edited (temporary UI state). The todo itself always comes from
 * the query cache, so there is no second copy of server data to go stale.
 */
export function EditProvider({ children }: { children: ReactNode }) {
  const [editingId, setEditingId] = useState<Todo["id"] | null>(null);
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const openEditor = useCallback(
    (id: Todo["id"]) => {
      setEditingId(id);
      // On desktop the editor lives in the second column of the home route.
      if (isDesktop) void navigate({ to: "/" });
    },
    [isDesktop, navigate],
  );
  const closeEditor = useCallback(() => setEditingId(null), []);

  const value = useMemo(() => ({ editingId, openEditor, closeEditor }), [editingId, openEditor, closeEditor]);
  return <EditContext value={value}>{children}</EditContext>;
}

export function useEditTodo(): EditContextValue {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEditTodo must be used inside <EditProvider>");
  return ctx;
}
