import { z } from "zod";

export const trackerTypes = ["boolean", "number", "scale"] as const;

export const trackerTypeLabels = {
  boolean: "Feito/não feito",
  number: "Quantidade",
  scale: "Escala 1-5",
} as const satisfies Record<(typeof trackerTypes)[number], string>;

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalTargetValue = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? Number(value) : null))
  .pipe(z.number().int().positive().nullable());

export const createTrackerSchema = z
  .object({
    name: z.string().trim().min(1, "Informe o nome.").max(80),
    description: optionalText,
    type: z.enum(trackerTypes),
    targetValue: optionalTargetValue,
  })
  .superRefine((value, ctx) => {
    if (value.type === "boolean" && value.targetValue !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["targetValue"],
        message: "Trackers de feito/não feito não usam meta numérica.",
      });
    }

    if (value.type === "scale" && value.targetValue !== null && value.targetValue > 5) {
      ctx.addIssue({
        code: "custom",
        path: ["targetValue"],
        message: "A meta da escala deve ficar entre 1 e 5.",
      });
    }
  });

export const trackerIdSchema = z.object({
  id: z.string().uuid(),
});

export const upsertTrackerEntrySchema = z
  .object({
    trackerId: z.string().uuid(),
    entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
    value: z.coerce.number().int().min(0),
    note: optionalText,
  })
  .superRefine((value, ctx) => {
    if (value.value > 9999) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "Valor muito alto.",
      });
    }
  });

export type CreateTrackerInput = z.infer<typeof createTrackerSchema>;
export type UpsertTrackerEntryInput = z.infer<typeof upsertTrackerEntrySchema>;
