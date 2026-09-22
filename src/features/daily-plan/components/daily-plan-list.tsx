import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import {
  completePlannedTaskAction,
  removeTaskFromDateAction,
  reorderDailyPlanItemAction,
} from "@/features/daily-plan/actions/daily-plan-actions";
import type { getDailyPlan } from "@/server/services/daily-plan-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarCheck } from "lucide-react";
import { StartFocusButton } from "@/features/focus-sessions/components/start-focus-button";

type DailyPlan = Awaited<ReturnType<typeof getDailyPlan>>;

type DailyPlanListProps = {
  items: DailyPlan;
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
} as const;

export function DailyPlanList({ items }: DailyPlanListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Nada planejado para esta data"
        description="Adicione uma tarefa existente ou crie uma nova tarefa diretamente para o dia."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={item.planItem.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{item.task.title}</h2>
                  <Badge variant="secondary">{priorityLabels[item.task.priority]}</Badge>
                  <Badge variant={item.task.status === "completed" ? "default" : "outline"}>
                    {item.task.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.project?.name ?? "Sem projeto"} ·{" "}
                  {item.task.estimatedPomodoros} pomodoro
                  {item.task.estimatedPomodoros === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={reorderDailyPlanItemAction}>
                  <input type="hidden" name="planItemId" value={item.planItem.id} />
                  <input type="hidden" name="direction" value="up" />
                  <Button type="submit" variant="outline" size="icon" aria-label="Mover para cima" disabled={index === 0}>
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </Button>
                </form>
                <form action={reorderDailyPlanItemAction}>
                  <input type="hidden" name="planItemId" value={item.planItem.id} />
                  <input type="hidden" name="direction" value="down" />
                  <Button type="submit" variant="outline" size="icon" aria-label="Mover para baixo" disabled={index === items.length - 1}>
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Button>
                </form>
                <form action={completePlannedTaskAction}>
                  <input type="hidden" name="taskId" value={item.task.id} />
                  <Button type="submit" size="sm" disabled={item.task.status === "completed"}>
                    Concluir
                  </Button>
                </form>
                <StartFocusButton taskId={item.task.id} disabled={item.task.status !== "pending"} />
                <form action={removeTaskFromDateAction}>
                  <input type="hidden" name="planItemId" value={item.planItem.id} />
                  <Button type="submit" variant="outline" size="icon" aria-label="Remover do planejamento">
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
