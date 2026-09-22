import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { addDaysToPlanDate, formatPlanDateLabel, getTodayPlanDate } from "@/lib/date";
import { Button } from "@/components/ui/button";

type DateNavigationProps = {
  planDate: string;
};

export function DateNavigation({ planDate }: DateNavigationProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Data planejada</p>
        <p className="text-lg font-semibold capitalize">{formatPlanDateLabel(planDate)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/today?date=${addDaysToPlanDate(planDate, -1)}`}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Anterior
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/today?date=${getTodayPlanDate()}`}>Hoje</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/today?date=${addDaysToPlanDate(planDate, 1)}`}>
            Próximo
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
