import type { Project, Task } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

type HistoryFiltersProps = {
  projects: Project[];
  tasks: Task[];
  startDate?: string;
  endDate?: string;
  projectId?: string;
  taskId?: string;
};

export function HistoryFilters({
  projects,
  tasks,
  startDate = "",
  endDate = "",
  projectId = "",
  taskId = "",
}: HistoryFiltersProps) {
  return (
    <form className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-5">
      <label className="space-y-2">
        <span className="text-sm font-medium">Início</span>
        <input
          type="date"
          name="startDate"
          defaultValue={startDate}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Fim</span>
        <input
          type="date"
          name="endDate"
          defaultValue={endDate}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Projeto</span>
        <select
          name="projectId"
          defaultValue={projectId}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Tarefa</span>
        <select
          name="taskId"
          defaultValue={taskId}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todas</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
