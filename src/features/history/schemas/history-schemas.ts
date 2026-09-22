import { z } from "zod";

const dateFilterSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .catch(undefined);

const optionalUuidFilterSchema = z
  .string()
  .uuid()
  .optional()
  .catch(undefined);

export const historyFiltersSchema = z.object({
  startDate: dateFilterSchema,
  endDate: dateFilterSchema,
  projectId: optionalUuidFilterSchema,
  taskId: optionalUuidFilterSchema,
  page: z.coerce.number().int().min(1).optional().catch(1),
});

export type HistoryFiltersInput = z.infer<typeof historyFiltersSchema>;
