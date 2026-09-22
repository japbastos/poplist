import { Activity } from "lucide-react";

import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { CreateTrackerSheet, TrackersList } from "@/features/trackers/components/trackers-list";
import { getTodayPlanDate, isValidPlanDate } from "@/lib/date";
import { getTrackersForDate } from "@/server/services/trackers-service";

type TrackersPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function TrackersPage({ searchParams }: TrackersPageProps) {
  const params = await searchParams;
  const entryDate =
    params.date && isValidPlanDate(params.date) ? params.date : getTodayPlanDate();
  const items = await getTrackersForDate(entryDate);
  const completedCount = items.filter((item) => item.entry?.value).length;

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Trackers"
          description="Registre ações recorrentes por dia para quantificar e qualificar sua consistência."
          actions={<CreateTrackerSheet />}
        />

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {entryDate}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-sm text-muted-foreground">Trackers ativos</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {items.length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="size-4" aria-hidden="true" />
              Com registro
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {completedCount}/{items.length}
            </p>
          </div>
        </div>

        <TrackersList items={items} entryDate={entryDate} />
      </div>
    </ServerAppShell>
  );
}
