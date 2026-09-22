import { timerSettingsSchema } from "@/features/settings/schemas/timer-settings-schemas";
import type { TimerSettingsInput } from "@/features/settings/schemas/timer-settings-schemas";
import {
  getTimerSettingsRecord,
  upsertTimerSettingsRecord,
} from "@/server/repositories/timer-settings-repository";
import type { TimerSettings } from "@/server/db/schema";
import { getServiceUserId } from "@/server/auth/service-user";

export const defaultTimerSettings: TimerSettingsInput = {
  focusDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
  autoStartBreak: false,
};

export async function getTimerSettings(): Promise<TimerSettingsInput> {
  const userId = await getServiceUserId();
  const settings = await getTimerSettingsRecord(userId);

  if (!settings) {
    return defaultTimerSettings;
  }

  return toTimerSettingsInput(settings);
}

export async function updateTimerSettings(input: TimerSettingsInput) {
  const userId = await getServiceUserId();
  const parsed = timerSettingsSchema.parse(input);

  return upsertTimerSettingsRecord(userId, parsed);
}

export function getFocusDurationSeconds(settings: TimerSettingsInput) {
  return settings.focusDurationMinutes * 60;
}

function toTimerSettingsInput(settings: TimerSettings): TimerSettingsInput {
  return {
    focusDurationMinutes: settings.focusDurationMinutes,
    shortBreakMinutes: settings.shortBreakMinutes,
    longBreakMinutes: settings.longBreakMinutes,
    soundEnabled: settings.soundEnabled,
    autoStartBreak: settings.autoStartBreak,
  };
}
