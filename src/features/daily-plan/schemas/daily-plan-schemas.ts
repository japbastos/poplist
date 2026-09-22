import { z } from "zod";

export const planDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.");

export const planTaskForDateSchema = z.object({
  taskId: z.uuid("Tarefa inválida."),
  planDate: planDateSchema,
});

export const removeTaskFromDateSchema = z.object({
  planItemId: z.uuid("Item inválido."),
});

export const reorderDailyPlanItemSchema = z.object({
  planItemId: z.uuid("Item inválido."),
  direction: z.enum(["up", "down"]),
});

export const createTaskForTodaySchema = z.object({
  planDate: planDateSchema,
  title: z
    .string()
    .trim()
    .min(1, "Informe o título da tarefa.")
    .max(120, "Use no máximo 120 caracteres."),
});

export type PlanTaskForDateInput = z.infer<typeof planTaskForDateSchema>;
export type CreateTaskForTodayInput = z.infer<typeof createTaskForTodaySchema>;
