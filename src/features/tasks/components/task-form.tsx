"use client";

import { Save } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  createTaskAction,
  updateTaskAction,
} from "@/features/tasks/actions/task-actions";
import {
  initialTaskActionState,
  type TaskActionState,
} from "@/features/tasks/actions/task-action-state";
import type { Project, Task } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

type TaskFormProps = {
  task?: Task;
  projects: Project[];
};

const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
] as const;

export function TaskForm({ task, projects }: TaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = task ? updateTaskAction : createTaskAction;
  const [state, formAction, pending] = useActionState<
    TaskActionState,
    FormData
  >(action, initialTaskActionState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);

      if (!task) {
        formRef.current?.reset();
      }
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state, task]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {task ? <input type="hidden" name="id" value={task.id} /> : null}

      <div className="space-y-2">
        <label htmlFor="task-title" className="text-sm font-medium">
          Título
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={task?.title ?? ""}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state.fieldErrors?.title?.[0] ? (
          <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="task-description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          defaultValue={task?.description ?? ""}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="task-project" className="text-sm font-medium">
            Projeto
          </label>
          <select
            id="task-project"
            name="projectId"
            defaultValue={task?.projectId ?? ""}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Sem projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.projectId?.[0] ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.projectId[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="task-priority" className="text-sm font-medium">
            Prioridade
          </label>
          <select
            id="task-priority"
            name="priority"
            defaultValue={task?.priority ?? "medium"}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="task-estimate" className="text-sm font-medium">
            Pomodoros estimados
          </label>
          <input
            id="task-estimate"
            name="estimatedPomodoros"
            type="number"
            min={1}
            max={24}
            required
            defaultValue={task?.estimatedPomodoros ?? 1}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          />
          {state.fieldErrors?.estimatedPomodoros?.[0] ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.estimatedPomodoros[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="task-due-date" className="text-sm font-medium">
            Prazo
          </label>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            defaultValue={task?.dueDate ?? ""}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          />
          {state.fieldErrors?.dueDate?.[0] ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.dueDate[0]}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        <Save className="size-4" aria-hidden="true" />
        {pending ? "Salvando..." : "Salvar tarefa"}
      </Button>
    </form>
  );
}
