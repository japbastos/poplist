import {
  cancelTaskAction,
  completeTaskAction,
  reopenTaskAction,
} from "@/features/tasks/actions/task-actions";
import type { Task } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

type TaskStatusActionsProps = {
  task: Task;
};

export function TaskStatusActions({ task }: TaskStatusActionsProps) {
  if (task.status === "completed" || task.status === "cancelled") {
    return (
      <form action={reopenTaskAction}>
        <input type="hidden" name="id" value={task.id} />
        <Button type="submit" variant="outline" size="sm">
          Reabrir
        </Button>
      </form>
    );
  }

  return (
    <>
      <form action={completeTaskAction}>
        <input type="hidden" name="id" value={task.id} />
        <Button type="submit" size="sm">
          Concluir
        </Button>
      </form>
      <form action={cancelTaskAction}>
        <input type="hidden" name="id" value={task.id} />
        <Button type="submit" variant="outline" size="sm">
          Cancelar
        </Button>
      </form>
    </>
  );
}
