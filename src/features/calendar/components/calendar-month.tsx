import Link from "next/link";

import type { CalendarDayOverview } from "@/server/services/calendar-service";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/duration";
import { getMonthCalendarDays, getPlanDateMonth } from "@/lib/date";

type CalendarMonthProps = {
  month: string;
  selectedDate: string;
  days: CalendarDayOverview[];
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarMonth({ month, selectedDate, days }: CalendarMonthProps) {
  const calendar = getMonthCalendarDays(month);
  const daysByDate = new Map(days.map((day) => [day.date, day]));

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {weekDays.map((weekDay) => (
          <div key={weekDay} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {weekDay}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendar.days.map((date) => {
          const day = daysByDate.get(date);
          const isCurrentMonth = getPlanDateMonth(date) === month;
          const isSelected = date === selectedDate;
          const dayNumber = Number(date.slice(-2));

          return (
            <Link
              key={date}
              href={`/calendar?month=${month}&date=${date}`}
              aria-current={isSelected ? "date" : undefined}
              className={cn(
                "min-h-32 border-b border-r p-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                isSelected && "bg-brand-secondary/10 ring-2 ring-inset ring-brand-secondary",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{dayNumber}</span>
                {day ? (
                  <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] text-secondary-foreground">
                    {day.trackerEntries + day.plannedTasks + day.completedTasks}
                  </span>
                ) : null}
              </div>

              {day ? (
                <div className="mt-3 space-y-1 text-xs">
                  {day.plannedTasks > 0 ? (
                    <p className="truncate text-muted-foreground">
                      {day.plannedTasks} planejada{day.plannedTasks === 1 ? "" : "s"}
                    </p>
                  ) : null}
                  {day.completedTasks > 0 ? (
                    <p className="truncate text-emerald-600 dark:text-emerald-400">
                      {day.completedTasks} concluída{day.completedTasks === 1 ? "" : "s"}
                    </p>
                  ) : null}
                  {day.focusSeconds > 0 ? (
                    <p className="truncate text-brand-secondary">
                      {formatDuration(day.focusSeconds)}
                    </p>
                  ) : null}
                  {day.trackerEntries > 0 ? (
                    <p className="truncate text-muted-foreground">
                      {day.trackerTargetHits}/{day.trackerEntries} trackers
                    </p>
                  ) : null}
                  {day.dueTasks > 0 ? (
                    <p className="truncate text-amber-600 dark:text-amber-400">
                      {day.dueTasks} prazo{day.dueTasks === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
