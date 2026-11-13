import { useState, useEffect } from "react";
import { useTodosStore } from "@/stores/use-todos-store";

import { Button } from "@/components/ui/button";
import { CreateNewTaskDialog } from "./_components/create-new-task-dialog";
import { TodoItem } from "./_components/todo-item";

const TodosPage = () => {
  const todos = useTodosStore((s) => s.todos);
  const getTodos = useTodosStore((s) => s.getTodos);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="">
      <header>
        <Button onClick={() => setOpenCreateDialog(true)}>+ Add Task</Button>
      </header>
      <div className="flex flex-col">
        {todos.map((todo, index) => (
          <TodoItem key={index} todo={todo} />
        ))}
      </div>
      {openCreateDialog && <CreateNewTaskDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />}
    </div>
  );
};
export { TodosPage };
