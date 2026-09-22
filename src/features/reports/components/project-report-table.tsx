import type { ProjectReportRow } from "@/features/reports/schemas/report-schemas";
import { formatDuration } from "@/lib/duration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectReportTableProps = {
  rows: ProjectReportRow[];
};

export function ProjectReportTable({ rows }: ProjectReportTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projetos</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem projetos no período.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 font-medium">Projeto</th>
                  <th className="py-2 font-medium">Tempo focado</th>
                  <th className="py-2 font-medium">Concluídas</th>
                  <th className="py-2 font-medium">Canceladas</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.projectKey} className="border-b last:border-b-0">
                    <td className="py-3 font-medium">{row.projectName}</td>
                    <td className="py-3">{formatDuration(row.focusedSeconds)}</td>
                    <td className="py-3">{row.completedSessions}</td>
                    <td className="py-3">{row.cancelledSessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
