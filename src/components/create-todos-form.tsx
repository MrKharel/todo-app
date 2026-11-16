import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { AlertCircleIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTodos } from "@/hooks/use-todos";
import { getErrorMessage } from "@/lib/errors";
import { MAX_TITLE_LENGTH, validateTitle } from "@/lib/validation";

import type { SubmitEvent, KeyboardEvent } from "react";

const MAX_FIELDS = 20;

type Field = { key: string; value: string };
const newField = (): Field => ({ key: crypto.randomUUID(), value: "" });

/** Dynamic list of title inputs, submitted together as a single `useCreateTodos` call. */
export function CreateTodosForm({ onCreated }: { onCreated?: () => void }) {
  const { mutateAsync, isPending } = useCreateTodos();
  const [fields, setFields] = useState<Field[]>(() => [newField()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const uid = useId();
  const fieldId = (key: string) => `${uid}-${key}`;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (focusKey) formRef.current?.querySelector<HTMLInputElement>(`[id="${fieldId(focusKey)}"]`)?.focus();
    // eslint-disable-next-line -- only react to a new focus request
  }, [focusKey]);

  const addField = () => {
    if (fields.length >= MAX_FIELDS) return;
    const field = newField();
    setFields((prev) => [...prev, field]);
    setFocusKey(field.key);
  };

  const removeField = (key: string) => {
    setFields((prev) => (prev.length > 1 ? prev.filter((f) => f.key !== key) : prev));
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key)));
  };

  const changeField = (key: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Enter on the last field adds another one, so you can type a list without the mouse.
    if (event.key === "Enter" && index === fields.length - 1 && fields.length < MAX_FIELDS) {
      event.preventDefault();
      addField();
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const error = validateTitle(field.value);
      if (error) nextErrors[field.key] = error;
    }
    setErrors(nextErrors);
    const firstInvalid = fields.find((f) => nextErrors[f.key]);
    if (firstInvalid) return setFocusKey(firstInvalid.key);

    try {
      // Single request for all todos. Adjust the item shape here if your hook expects something else.
      const created = await mutateAsync(fields.map((f) => ({ title: f.value, completed: false })));
      setSubmitError(null);
      setFields([newField()]);
      toast.success(`${created} Todo created`);
      onCreated?.();
    } catch (e) {
      // Fields stay as typed so nothing is lost.
      setSubmitError(getErrorMessage(e instanceof Error ? e : String(e)));
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const error = errors[field.key];
          return (
            <li key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={fieldId(field.key)} className="sr-only">
                Todo {index + 1}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={fieldId(field.key)}
                  value={field.value}
                  maxLength={MAX_TITLE_LENGTH}
                  placeholder={`Todo ${index + 1}`}
                  disabled={isPending}
                  aria-invalid={error !== undefined}
                  aria-describedby={error ? `${fieldId(field.key)}-error` : undefined}
                  onChange={(e) => changeField(field.key, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove todo ${index + 1}`}
                  disabled={isPending || fields.length === 1}
                  onClick={() => removeField(field.key)}
                >
                  <XIcon />
                </Button>
              </div>
              {error && (
                <p id={`${fieldId(field.key)}-error`} role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        variant="outline"
        className="self-start"
        disabled={isPending || fields.length >= MAX_FIELDS}
        onClick={addField}
      >
        <PlusIcon />
        Add another
      </Button>

      {submitError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            <p>{submitError} Nothing was lost, so you can try again.</p>
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2Icon className="animate-spin" />}
        {fields.length === 1 ? "Create todo" : `Create ${fields.length} todos`}
      </Button>
    </form>
  );
}
