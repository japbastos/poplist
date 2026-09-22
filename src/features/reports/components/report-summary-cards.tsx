import type { ReportSummary } from "@/features/reports/schemas/report-schemas";
import { formatDuration } from "@/lib/duration";
import { Card, CardContent } from "@/components/ui/card";

type ReportSummaryCardsProps = {
  summary: ReportSummary;
};

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Tempo focado</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatDuration(summary.focusedSeconds)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Sessões concluídas</p>
          <p className="mt-2 text-2xl font-semibold">
            {summary.completedSessions}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Sessões canceladas</p>
          <p className="mt-2 text-2xl font-semibold">
            {summary.cancelledSessions}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Tarefas concluídas</p>
          <p className="mt-2 text-2xl font-semibold">{summary.completedTasks}</p>
        </CardContent>
      </Card>
    </div>
  );
}
