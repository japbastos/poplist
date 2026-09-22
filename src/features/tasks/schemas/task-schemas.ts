import { z } from "zod";

export const taskStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

const optionalUuidSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(z.uuid("Projeto inválido.").nullable());

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalDateSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .pipe(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
      .nullable(),
  );

export const createTaskSchema = z.object({
  projectId: optionalUuidSchema,
  title: z
    .string()
    .trim()
    .min(1, "Informe o título da tarefa.")
    .max(120, "Use no máximo 120 caracteres."),
  description: optionalTextSchema,
  priority: taskPrioritySchema,
  estimatedPomodoros: z.coerce
    .number()
    .int("Informe um número inteiro.")
    .min(1, "Use pelo menos 1 Pomodoro.")
    .max(24, "Use no máximo 24 Pomodoros."),
  dueDate: optionalDateSchema,
});

export const updateTaskSchema = createTaskSchema.extend({
  id: z.uuid("Tarefa inválida."),
});

export const taskIdSchema = z.object({
  id: z.uuid("Tarefa inválida."),
});

export const listTasksFiltersSchema = z.object({
  status: taskStatusSchema.optional(),
  projectId: optionalUuidSchema.optional(),
  search: z.string().trim().optional(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksFiltersInput = z.infer<typeof listTasksFiltersSchema>;
