import { z } from "zod";

export const calendarFiltersSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type CalendarFiltersInput = z.infer<typeof calendarFiltersSchema>;
