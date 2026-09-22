import { Activity, Plus } from "lucide-react";

import { TrackerEntryCard } from "@/features/trackers/components/tracker-entry-card";
import { TrackerForm } from "@/features/trackers/components/tracker-form";
import type { Tracker, TrackerEntry } from "@/server/db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";

type TrackerWithEntry = {
  tracker: Tracker;
  entry: TrackerEntry | null;
};

type TrackersListProps = {
  items: TrackerWithEntry[];
  entryDate: string;
};

export function TrackersList({ items, entryDate }: TrackersListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="Nenhum tracker ativo"
        description="Crie métricas diárias para acompanhar consistência, volume e qualidade das suas ações."
        action={<CreateTrackerSheet />}
      />
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((item) => (
        <TrackerEntryCard
          key={item.tracker.id}
          tracker={item.tracker}
          entry={item.entry}
          entryDate={entryDate}
        />
      ))}
    </div>
  );
}

export function CreateTrackerSheet() {
  return (
    <FormSheet
      title="Novo tracker"
      trigger={
        <Button type="button">
          <Plus className="size-4" aria-hidden="true" />
          Novo tracker
        </Button>
      }
    >
      <TrackerForm />
    </FormSheet>
  );
}
