import type { getDailyPlan } from "@/server/services/daily-plan-service";
import { Card, CardContent } from "@/components/ui/card";

type DailyPlan = Awaited<ReturnType<typeof getDailyPlan>>;

type DailyPlanSummaryProps = {
  items: DailyPlan;
};

export function DailyPlanSummary({ items }: DailyPlanSummaryProps) {
  const completedCount = items.filter(
    (item) => item.task.status === "completed",
  ).length;
  const estimatedPomodoros = items.reduce(
    (total, item) => total + item.task.estimatedPomodoros,
    0,
  );

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Planejadas</p>
          <p className="mt-2 text-2xl font-semibold">{items.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Concluídas</p>
          <p className="mt-2 text-2xl font-semibold">{completedCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Estimativa</p>
          <p className="mt-2 text-2xl font-semibold">
            {estimatedPomodoros} pomodoro{estimatedPomodoros === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
