import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CalendarDayDetails } from "@/features/calendar/components/calendar-day-details";
import { CalendarMonth } from "@/features/calendar/components/calendar-month";
import { calendarFiltersSchema } from "@/features/calendar/schemas/calendar-schemas";
import {
  formatMonthLabel,
  getMonthRange,
  getPlanDateMonth,
  getTodayPlanDate,
  isValidMonth,
  isValidPlanDate,
} from "@/lib/date";
import { getCalendarOverview } from "@/server/services/calendar-service";

type CalendarPageProps = {
  searchParams: Promise<{
    month?: string;
    date?: string;
  }>;
};

function addMonths(month: string, value: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + value, 1, 12, 0, 0);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");

  return `${nextYear}-${nextMonth}`;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const params = calendarFiltersSchema.parse(await searchParams);
  const today = getTodayPlanDate();
  const month = params.month && isValidMonth(params.month)
    ? params.month
    : getPlanDateMonth(today);
  const { endDate, startDate } = getMonthRange(month);
  const selectedDate =
    params.date &&
    isValidPlanDate(params.date) &&
    getPlanDateMonth(params.date) === month
      ? params.date
      : today >= startDate && today <= endDate
        ? today
        : startDate;
  const overview = await getCalendarOverview(startDate, endDate, selectedDate);
  const previousMonth = addMonths(month, -1);
  const nextMonth = addMonths(month, 1);

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Calendário"
          description="Visão mensal de planejamento, prazos, foco e trackers."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href={`/calendar?month=${previousMonth}`}>
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Anterior
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/calendar?month=${getPlanDateMonth(today)}&date=${today}`}>
                  Hoje
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/calendar?month=${nextMonth}`}>
                  Próximo
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          }
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Mês selecionado</p>
          <h2 className="text-2xl font-semibold capitalize tracking-tight">
            {formatMonthLabel(month)}
          </h2>
        </div>

        <CalendarMonth
          month={month}
          selectedDate={selectedDate}
          days={overview.days}
        />
        <CalendarDayDetails day={overview.selectedDay} />
      </div>
    </ServerAppShell>
  );
}
