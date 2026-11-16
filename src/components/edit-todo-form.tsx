import { useId, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useUpdateTodo } from "@/hooks/use-todos";
import { getErrorMessage } from "@/lib/errors";
import { MAX_TITLE_LENGTH, validateTitle } from "@/lib/validation";

import type { SubmitEvent } from "react";
import type { Todo } from "@/types";

type EditTodoFormProps = {
  todo: Todo;
  onDone: () => void;
  onCancel: () => void;
};

/**
 * Local state is the single source of truth while editing. It is only discarded on success or
 * cancel, so a failed mutation never loses what the user typed. Render with `key={todo.id}`.
 */
export function EditTodoForm({ todo, onDone, onCancel }: EditTodoFormProps) {
  const { mutateAsync, isPending } = useUpdateTodo();
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const error = validateTitle(title);
    setTitleError(error);
    if (error) return;

    const updates: { title?: string; completed?: boolean } = {};
    if (title !== todo.title) updates.title = title;
    if (completed !== todo.completed) updates.completed = completed;
    if (Object.keys(updates).length === 0) return onDone();

    try {
      await mutateAsync({ id: todo.id, updates });
      setSubmitError(null);
      toast.success("Todo updated");
      onDone();
    } catch (e) {
      setSubmitError(getErrorMessage(e instanceof Error ? e : String(e)));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor={titleId}>Title</Label>
        <Input
          id={titleId}
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          disabled={isPending}
          aria-invalid={titleError !== null}
          aria-describedby={titleError ? errorId : undefined}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(null);
          }}
        />
        {titleError && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {titleError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id={`${uid}-completed`} checked={completed} disabled={isPending} onCheckedChange={setCompleted} />
        <Label htmlFor={`${uid}-completed`}>Completed</Label>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            <p>{submitError} Your changes are still here, so you can try again.</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2Icon className="animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
