import { z } from "zod";

const durationFromFormSchema = z.coerce.number().int();

export const timerSettingsSchema = z.object({
  focusDurationMinutes: durationFromFormSchema
    .min(5, "Use pelo menos 5 minutos.")
    .max(120, "Use no máximo 120 minutos."),
  shortBreakMinutes: durationFromFormSchema
    .min(1, "Use pelo menos 1 minuto.")
    .max(60, "Use no máximo 60 minutos."),
  longBreakMinutes: durationFromFormSchema
    .min(5, "Use pelo menos 5 minutos.")
    .max(120, "Use no máximo 120 minutos."),
  soundEnabled: z.boolean(),
  autoStartBreak: z.boolean(),
});

export type TimerSettingsInput = z.infer<typeof timerSettingsSchema>;
