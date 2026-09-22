import type {
  DailyReportRow,
  ProjectReportRow,
} from "@/features/reports/schemas/report-schemas";
import { formatDuration } from "@/lib/duration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ReportChartsProps = {
  byDay: DailyReportRow[];
  byProject: ProjectReportRow[];
};

function Bar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;

  return (
    <div className="h-2 rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-brand-secondary"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function ReportCharts({ byDay, byProject }: ReportChartsProps) {
  const maxDay = Math.max(...byDay.map((item) => item.focusedSeconds), 0);
  const maxProject = Math.max(
    ...byProject.map((item) => item.focusedSeconds),
    0,
  );

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tempo por dia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {byDay.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem dados no período.</p>
          ) : (
            byDay.map((item) => (
              <div key={item.date} className="space-y-1">
                <div className="flex justify-between gap-3 text-sm">
                  <span>{item.date}</span>
                  <span>{formatDuration(item.focusedSeconds)}</span>
                </div>
                <Bar value={item.focusedSeconds} max={maxDay} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tempo por projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {byProject.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem dados no período.</p>
          ) : (
            byProject.map((item) => (
              <div key={item.projectKey} className="space-y-1">
                <div className="flex justify-between gap-3 text-sm">
                  <span>{item.projectName}</span>
                  <span>{formatDuration(item.focusedSeconds)}</span>
                </div>
                <Bar value={item.focusedSeconds} max={maxProject} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
