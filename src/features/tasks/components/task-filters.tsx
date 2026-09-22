import type { Project } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

type TaskFiltersProps = {
  projects: Project[];
  status?: string;
  projectId?: string;
  search?: string;
};

const statuses = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
  { value: "cancelled", label: "Canceladas" },
] as const;

export function TaskFilters({
  projects,
  status = "",
  projectId = "",
  search = "",
}: TaskFiltersProps) {
  return (
    <form className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_12rem_12rem_auto]">
      <label className="space-y-2">
        <span className="text-sm font-medium">Busca</span>
        <input
          name="search"
          type="search"
          defaultValue={search}
          placeholder="Buscar por título"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Status</span>
        <select
          name="status"
          defaultValue={status}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Projeto</span>
        <select
          name="projectId"
          defaultValue={projectId}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
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
