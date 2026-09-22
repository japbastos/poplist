import Link from "next/link";
import { History } from "lucide-react";

import type { getFocusSessionHistory } from "@/server/services/history-service";
import { formatDuration } from "@/lib/duration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

type HistoryResult = Awaited<ReturnType<typeof getFocusSessionHistory>>;

type HistoryListProps = {
  history: HistoryResult;
  queryString: string;
};

const statusLabels = {
  completed: "Concluída",
  cancelled: "Cancelada",
} as const;

export function HistoryList({ history, queryString }: HistoryListProps) {
  if (history.items.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Nenhuma sessão encontrada"
        description="Sessões concluídas ou canceladas aparecerão aqui conforme os filtros selecionados."
      />
    );
  }

  const baseParams = new URLSearchParams(queryString);
  const previousParams = new URLSearchParams(baseParams);
  previousParams.set("page", String(Math.max(1, history.page - 1)));
  const nextParams = new URLSearchParams(baseParams);
  nextParams.set("page", String(Math.min(history.totalPages, history.page + 1)));

  return (
    <div className="space-y-3">
      {history.items.map((item) => (
        <Card key={item.session.id}>
          <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{item.task.title}</h2>
                <Badge
                  variant={
                    item.session.status === "completed" ? "default" : "outline"
                  }
                >
                  {statusLabels[item.session.status as "completed" | "cancelled"]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.project?.name ?? "Sem projeto"} ·{" "}
                {item.session.startedAt.toLocaleString("pt-BR")}
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-3 text-sm md:min-w-96">
              <div>
                <dt className="text-muted-foreground">Planejada</dt>
                <dd className="font-medium">
                  {formatDuration(item.session.plannedDurationSeconds)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Focada</dt>
                <dd className="font-medium">
                  {formatDuration(item.session.focusedDurationSeconds)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pausas</dt>
                <dd className="font-medium">
                  {formatDuration(item.session.accumulatedPauseSeconds)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">
          Página {history.page} de {history.totalPages} · {history.totalItems}{" "}
          sessões
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/history?${previousParams.toString()}`}
              aria-disabled={history.page <= 1}
            >
              Anterior
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/history?${nextParams.toString()}`}
              aria-disabled={history.page >= history.totalPages}
            >
              Próxima
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
