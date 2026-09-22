import { z } from "zod";

export const focusSessionIdSchema = z.object({
  id: z.uuid("Sessão inválida."),
});

export const startFocusSessionSchema = z.object({
  taskId: z.uuid("Tarefa inválida."),
});
