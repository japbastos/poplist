import { CheckSquare, Plus } from "lucide-react";

import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskForm } from "@/features/tasks/components/task-form";
import type { Project, Task } from "@/server/db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";

type TasksListProps = {
  tasks: Task[];
  projects: Project[];
};

export function TasksList({ tasks, projects }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="Nenhuma tarefa encontrada"
        description="Crie uma tarefa sem projeto ou vinculada a um projeto ativo para começar."
        action={<CreateTaskSheet projects={projects} />}
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} projects={projects} />
      ))}
    </div>
  );
}

export function CreateTaskSheet({ projects }: { projects: Project[] }) {
  return (
    <FormSheet
      title="Nova tarefa"
      trigger={
        <Button type="button">
          <Plus className="size-4" aria-hidden="true" />
          Nova tarefa
        </Button>
      }
    >
      <TaskForm projects={projects} />
    </FormSheet>
  );
}
