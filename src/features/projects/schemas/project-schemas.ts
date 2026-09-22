import { z } from "zod";

const colorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor hexadecimal válida.");

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do projeto.")
    .max(80, "Use no máximo 80 caracteres."),
  description: optionalTextSchema,
  color: colorSchema,
});

export const updateProjectSchema = createProjectSchema.extend({
  id: z.uuid("Projeto inválido."),
});

export const archiveProjectSchema = z.object({
  id: z.uuid("Projeto inválido."),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ArchiveProjectInput = z.infer<typeof archiveProjectSchema>;
