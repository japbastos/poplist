import Link from "next/link";

import type { CalendarDayDetails as CalendarDayDetailsData } from "@/server/services/calendar-service";
import { formatDuration } from "@/lib/duration";
import { formatPlanDateLabel } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CalendarDayDetailsProps = {
  day: CalendarDayDetailsData;
};

function EmptyText({ children }: { children: string }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function CalendarDayDetails({ day }: CalendarDayDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="capitalize">
              {formatPlanDateLabel(day.date)}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDuration(day.focusSeconds)} focados · {day.trackerEntries} registros
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/today?date=${day.date}`}>Abrir Hoje</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/trackers?date=${day.date}`}>Abrir Trackers</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Planejamento</h2>
          {day.plannedItems.length === 0 ? (
            <EmptyText>Nenhuma tarefa planejada.</EmptyText>
          ) : (
            <ul className="space-y-2">
              {day.plannedItems.map((item, index) => (
                <li key={`${item.taskTitle}-${index}`} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{item.taskTitle}</p>
                  <p className="text-muted-foreground">{item.projectName ?? "Sem projeto"}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Prazos</h2>
          {day.dueItems.length === 0 ? (
            <EmptyText>Nenhum prazo neste dia.</EmptyText>
          ) : (
            <ul className="space-y-2">
              {day.dueItems.map((item, index) => (
                <li key={`${item.taskTitle}-${index}`} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.taskTitle}</p>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <p className="text-muted-foreground">{item.projectName ?? "Sem projeto"}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Concluídas</h2>
          {day.completedItems.length === 0 ? (
            <EmptyText>Nenhuma tarefa concluída.</EmptyText>
          ) : (
            <ul className="space-y-2">
              {day.completedItems.map((item, index) => (
                <li key={`${item.taskTitle}-${index}`} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{item.taskTitle}</p>
                  <p className="text-muted-foreground">{item.projectName ?? "Sem projeto"}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Trackers</h2>
          {day.trackerItems.length === 0 ? (
            <EmptyText>Nenhum tracker registrado.</EmptyText>
          ) : (
            <ul className="space-y-2">
              {day.trackerItems.map((item, index) => (
                <li key={`${item.trackerName}-${index}`} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.trackerName}</p>
                    <Badge variant={item.targetValue !== null && item.value >= item.targetValue ? "default" : "outline"}>
                      {item.value}
                      {item.targetValue !== null ? `/${item.targetValue}` : ""}
                    </Badge>
                  </div>
                  {item.note ? (
                    <p className="mt-1 text-muted-foreground">{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
