"use server";

import { revalidatePath } from "next/cache";

import type { TimerSettingsActionState } from "@/features/settings/actions/timer-settings-action-state";
import { timerSettingsSchema } from "@/features/settings/schemas/timer-settings-schemas";
import { updateTimerSettings } from "@/server/services/timer-settings-service";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function updateTimerSettingsAction(
  _prevState: TimerSettingsActionState,
  formData: FormData,
): Promise<TimerSettingsActionState> {
  const parsed = timerSettingsSchema.safeParse({
    focusDurationMinutes: getStringValue(formData, "focusDurationMinutes"),
    shortBreakMinutes: getStringValue(formData, "shortBreakMinutes"),
    longBreakMinutes: getStringValue(formData, "longBreakMinutes"),
    soundEnabled: getBooleanValue(formData, "soundEnabled"),
    autoStartBreak: getBooleanValue(formData, "autoStartBreak"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise as configurações do timer.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTimerSettings(parsed.data);
    revalidatePath("/settings");
    revalidatePath("/focus");

    return {
      status: "success",
      message: "Configurações salvas.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as configurações.",
    };
  }
}
