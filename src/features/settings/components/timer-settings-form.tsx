"use client";

import { Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import {
  initialTimerSettingsActionState,
  type TimerSettingsActionState,
} from "@/features/settings/actions/timer-settings-action-state";
import { updateTimerSettingsAction } from "@/features/settings/actions/timer-settings-actions";
import type { TimerSettingsInput } from "@/features/settings/schemas/timer-settings-schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TimerSettingsFormProps = {
  settings: TimerSettingsInput;
};

export function TimerSettingsForm({ settings }: TimerSettingsFormProps) {
  const [state, formAction, pending] = useActionState<
    TimerSettingsActionState,
    FormData
  >(updateTimerSettingsAction, initialTimerSettingsActionState);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ciclo de foco</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <NumberField
              id="focusDurationMinutes"
              label="Foco"
              defaultValue={settings.focusDurationMinutes}
              min={5}
              max={120}
              error={state.fieldErrors?.focusDurationMinutes?.[0]}
            />
            <NumberField
              id="shortBreakMinutes"
              label="Pausa curta"
              defaultValue={settings.shortBreakMinutes}
              min={1}
              max={60}
              error={state.fieldErrors?.shortBreakMinutes?.[0]}
            />
            <NumberField
              id="longBreakMinutes"
              label="Pausa longa"
              defaultValue={settings.longBreakMinutes}
              min={5}
              max={120}
              error={state.fieldErrors?.longBreakMinutes?.[0]}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <CheckboxField
              id="soundEnabled"
              label="Som ativado"
              description="Mantém feedback sonoro preparado para sessões futuras."
              defaultChecked={settings.soundEnabled}
            />
            <CheckboxField
              id="autoStartBreak"
              label="Iniciar pausa automaticamente"
              description="Preferência salva para o fluxo de pausas do MVP."
              defaultChecked={settings.autoStartBreak}
            />
          </div>

          <Button type="submit" disabled={pending}>
            <Save className="size-4" aria-hidden="true" />
            {pending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function NumberField({
  id,
  label,
  defaultValue,
  min,
  max,
  error,
}: {
  id: keyof Pick<
    TimerSettingsInput,
    "focusDurationMinutes" | "shortBreakMinutes" | "longBreakMinutes"
  >;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type="number"
          min={min}
          max={max}
          required
          defaultValue={defaultValue}
          className="h-10 w-full rounded-md border bg-background px-3 pr-12 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
          min
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {min} a {max} minutos
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function CheckboxField({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: keyof Pick<TimerSettingsInput, "soundEnabled" | "autoStartBreak">;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex gap-3 rounded-lg border bg-background p-4">
      <input
        name={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 size-4 rounded border bg-background accent-brand-secondary"
      />
      <span className="space-y-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
    </label>
  );
}
