import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import {
  CreateTaskSheet,
  TasksList,
} from "@/features/tasks/components/tasks-list";
import { listProjects } from "@/server/services/projects-service";
import { listTasks } from "@/server/services/tasks-service";

type TasksPageProps = {
  searchParams: Promise<{
    status?: string;
    projectId?: string;
    search?: string;
  }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const projects = await listProjects();
  const tasks = await listTasks({
    status:
      params.status === "pending" ||
      params.status === "in_progress" ||
      params.status === "completed" ||
      params.status === "cancelled"
        ? params.status
        : undefined,
    projectId: params.projectId ?? "",
    search: params.search,
  });

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Tarefas"
          description="Lista operacional para acompanhar status, prioridade, estimativas e prazos."
          actions={<CreateTaskSheet projects={projects} />}
        />
        <TaskFilters
          projects={projects}
          status={params.status}
          projectId={params.projectId}
          search={params.search}
        />
        <TasksList tasks={tasks} projects={projects} />
      </div>
    </ServerAppShell>
  );
}
