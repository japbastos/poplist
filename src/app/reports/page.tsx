import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectReportTable } from "@/features/reports/components/project-report-table";
import { ReportCharts } from "@/features/reports/components/report-charts";
import { ReportFilters } from "@/features/reports/components/report-filters";
import { ReportSummaryCards } from "@/features/reports/components/report-summary-cards";
import { reportFiltersSchema } from "@/features/reports/schemas/report-schemas";
import { getReports } from "@/server/services/reports-service";

type ReportsPageProps = {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const filters = reportFiltersSchema.parse(params);
  const reports = await getReports(filters);

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Relatórios"
          description="Métricas do período calculadas no servidor a partir de tarefas e sessões persistidas."
        />
        <ReportFilters
          startDate={filters.startDate}
          endDate={filters.endDate}
        />
        <ReportSummaryCards summary={reports.summary} />
        <ReportCharts byDay={reports.byDay} byProject={reports.byProject} />
        <ProjectReportTable rows={reports.byProject} />
      </div>
    </ServerAppShell>
  );
}
