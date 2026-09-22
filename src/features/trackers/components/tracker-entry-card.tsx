"use client";

import { Archive, Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import {
  archiveTrackerAction,
  upsertTrackerEntryAction,
} from "@/features/trackers/actions/tracker-actions";
import {
  initialTrackerActionState,
  type TrackerActionState,
} from "@/features/trackers/actions/tracker-action-state";
import { trackerTypeLabels } from "@/features/trackers/schemas/tracker-schemas";
import type { Tracker, TrackerEntry } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TrackerEntryCardProps = {
  tracker: Tracker;
  entry: TrackerEntry | null;
  entryDate: string;
};

function getDefaultValue(tracker: Tracker, entry: TrackerEntry | null) {
  if (entry) {
    return entry.value;
  }

  return tracker.type === "boolean" ? 0 : "";
}

export function TrackerEntryCard({
  tracker,
  entry,
  entryDate,
}: TrackerEntryCardProps) {
  const [state, formAction, pending] = useActionState<
    TrackerActionState,
    FormData
  >(upsertTrackerEntryAction, initialTrackerActionState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  const reachedTarget =
    tracker.targetValue !== null && entry !== null && entry.value >= tracker.targetValue;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate">{tracker.name}</CardTitle>
            <CardDescription>
              {trackerTypeLabels[tracker.type]}
              {tracker.targetValue ? ` · meta ${tracker.targetValue}` : ""}
            </CardDescription>
          </div>
          <form action={archiveTrackerAction}>
            <input type="hidden" name="id" value={tracker.id} />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Arquivar tracker"
            >
              <Archive className="size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
        {tracker.description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {tracker.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="trackerId" value={tracker.id} />
          <input type="hidden" name="entryDate" value={entryDate} />

          <div className="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="space-y-2">
              <label htmlFor={`tracker-value-${tracker.id}`} className="text-sm font-medium">
                Valor
              </label>
              {tracker.type === "boolean" ? (
                <select
                  id={`tracker-value-${tracker.id}`}
                  name="value"
                  defaultValue={String(getDefaultValue(tracker, entry))}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="0">Não feito</option>
                  <option value="1">Feito</option>
                </select>
              ) : (
                <input
                  id={`tracker-value-${tracker.id}`}
                  name="value"
                  type="number"
                  min={tracker.type === "scale" ? 1 : 0}
                  max={tracker.type === "scale" ? 5 : 9999}
                  required
                  defaultValue={getDefaultValue(tracker, entry)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor={`tracker-note-${tracker.id}`} className="text-sm font-medium">
                Nota
              </label>
              <input
                id={`tracker-note-${tracker.id}`}
                name="note"
                type="text"
                maxLength={240}
                defaultValue={entry?.note ?? ""}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {entry
                ? reachedTarget
                  ? "Meta atingida neste dia."
                  : "Registro salvo para este dia."
                : "Sem registro para este dia."}
            </p>
            <Button type="submit" size="sm" disabled={pending}>
              <Save className="size-4" aria-hidden="true" />
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
