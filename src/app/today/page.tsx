import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AddTaskToDayForm } from "@/features/daily-plan/components/add-task-to-day-form";
import { DailyPlanList } from "@/features/daily-plan/components/daily-plan-list";
import { DailyPlanSummary } from "@/features/daily-plan/components/daily-plan-summary";
import { DateNavigation } from "@/features/daily-plan/components/date-navigation";
import { getTodayPlanDate, isValidPlanDate } from "@/lib/date";
import { getDailyPlan } from "@/server/services/daily-plan-service";
import { listTasks } from "@/server/services/tasks-service";

type TodayPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = await searchParams;
  const planDate =
    params.date && isValidPlanDate(params.date) ? params.date : getTodayPlanDate();
  const [dailyPlan, availableTasks] = await Promise.all([
    getDailyPlan(planDate),
    listTasks({ status: "pending" }),
  ]);

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Hoje"
          description="Ponto de entrada para organizar o dia, acompanhar prioridades e iniciar sessões de foco."
        />
        <DateNavigation planDate={planDate} />
        <DailyPlanSummary items={dailyPlan} />
        <AddTaskToDayForm planDate={planDate} tasks={availableTasks} />
        <DailyPlanList items={dailyPlan} />
      </div>
    </ServerAppShell>
  );
}
