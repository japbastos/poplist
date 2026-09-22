"use client";

import { Save } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  initialTrackerActionState,
  type TrackerActionState,
} from "@/features/trackers/actions/tracker-action-state";
import { createTrackerAction } from "@/features/trackers/actions/tracker-actions";
import { trackerTypeLabels, trackerTypes } from "@/features/trackers/schemas/tracker-schemas";
import { Button } from "@/components/ui/button";

export function TrackerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<
    TrackerActionState,
    FormData
  >(createTrackerAction, initialTrackerActionState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="tracker-name" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="tracker-name"
          name="name"
          type="text"
          required
          maxLength={80}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="tracker-description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="tracker-description"
          name="description"
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="tracker-type" className="text-sm font-medium">
            Tipo
          </label>
          <select
            id="tracker-type"
            name="type"
            defaultValue="number"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            {trackerTypes.map((type) => (
              <option key={type} value={type}>
                {trackerTypeLabels[type]}
              </option>
            ))}
          </select>
          {state.fieldErrors?.type?.[0] ? (
            <p className="text-sm text-destructive">{state.fieldErrors.type[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="tracker-target" className="text-sm font-medium">
            Meta diária
          </label>
          <input
            id="tracker-target"
            name="targetValue"
            type="number"
            min={1}
            max={9999}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          />
          {state.fieldErrors?.targetValue?.[0] ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.targetValue[0]}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        <Save className="size-4" aria-hidden="true" />
        {pending ? "Salvando..." : "Salvar tracker"}
      </Button>
    </form>
  );
}
