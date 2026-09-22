import { Pencil } from "lucide-react";

import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskStatusActions } from "@/features/tasks/components/task-status-actions";
import type { Project, Task } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormSheet } from "@/components/shared/form-sheet";

type TaskCardProps = {
  task: Task;
  projects: Project[];
};

const statusLabels: Record<Task["status"], string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const priorityLabels: Record<Task["priority"], string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export function TaskCard({ task, projects }: TaskCardProps) {
  const project = projects.find((item) => item.id === task.projectId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate">{task.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {task.description ?? "Sem descrição."}
            </CardDescription>
          </div>
          <Badge variant={task.status === "completed" ? "default" : "secondary"}>
            {statusLabels[task.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex justify-between gap-3">
            <dt>Projeto</dt>
            <dd className="font-medium text-foreground">
              {project?.name ?? "Sem projeto"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Prioridade</dt>
            <dd className="font-medium text-foreground">
              {priorityLabels[task.priority]}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Estimativa</dt>
            <dd className="font-medium text-foreground">
              {task.estimatedPomodoros} pomodoro
              {task.estimatedPomodoros > 1 ? "s" : ""}
            </dd>
          </div>
          {task.dueDate ? (
            <div className="flex justify-between gap-3">
              <dt>Prazo</dt>
              <dd className="font-medium text-foreground">{task.dueDate}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <FormSheet
            title="Editar tarefa"
            trigger={
              <Button type="button" variant="outline" size="sm">
                <Pencil className="size-4" aria-hidden="true" />
                Editar
              </Button>
            }
          >
            <TaskForm task={task} projects={projects} />
          </FormSheet>
          <TaskStatusActions task={task} />
        </div>
      </CardContent>
    </Card>
  );
}
