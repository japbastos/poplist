import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { HistoryFilters } from "@/features/history/components/history-filters";
import { HistoryList } from "@/features/history/components/history-list";
import { historyFiltersSchema } from "@/features/history/schemas/history-schemas";
import { getFocusSessionHistory } from "@/server/services/history-service";
import { listProjects } from "@/server/services/projects-service";
import { listTasks } from "@/server/services/tasks-service";

type HistoryPageProps = {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    projectId?: string;
    taskId?: string;
    page?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams;
  const filters = historyFiltersSchema.parse(params);
  const [history, projects, tasks] = await Promise.all([
    getFocusSessionHistory(filters),
    listProjects(),
    listTasks(),
  ]);
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined) as [
      string,
      string,
    ][],
  ).toString();

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Histórico"
          description="Consulte sessões de foco concluídas e canceladas por período, projeto e tarefa."
        />
        <HistoryFilters
          projects={projects}
          tasks={tasks}
          startDate={filters.startDate}
          endDate={filters.endDate}
          projectId={filters.projectId}
          taskId={filters.taskId}
        />
        <HistoryList history={history} queryString={queryString} />
      </div>
    </ServerAppShell>
  );
}
