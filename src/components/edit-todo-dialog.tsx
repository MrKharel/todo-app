import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditingTodo } from "@/hooks/use-editing-todo";
import { EditTodoForm } from "./edit-todo-form";

/** Mobile edit UI. Desktop uses <EditTodoPanel /> in the second column. */
export function EditTodoDialog() {
  const { todo, close } = useEditingTodo();

  return (
    <Dialog open={todo !== undefined} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
          <DialogDescription>Update the title or completion status.</DialogDescription>
        </DialogHeader>
        {todo && <EditTodoForm key={todo.id} todo={todo} onDone={close} onCancel={close} />}
      </DialogContent>
    </Dialog>
  );
}
