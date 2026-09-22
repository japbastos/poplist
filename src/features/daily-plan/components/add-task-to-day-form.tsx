import { Plus } from "lucide-react";

import {
  createTaskForTodayAction,
  planTaskForDateAction,
} from "@/features/daily-plan/actions/daily-plan-actions";
import type { Task } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AddTaskToDayFormProps = {
  planDate: string;
  tasks: Task[];
};

export function AddTaskToDayForm({ planDate, tasks }: AddTaskToDayFormProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar tarefa existente</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={planTaskForDateAction} className="flex gap-2">
            <input type="hidden" name="planDate" value={planDate} />
            <select
              name="taskId"
              required
              className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Selecione uma tarefa</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <Button type="submit">
              <Plus className="size-4" aria-hidden="true" />
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar tarefa para o dia</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTaskForTodayAction} className="flex gap-2">
            <input type="hidden" name="planDate" value={planDate} />
            <input
              name="title"
              required
              maxLength={120}
              placeholder="Nova tarefa"
              className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit">
              <Plus className="size-4" aria-hidden="true" />
              Criar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
