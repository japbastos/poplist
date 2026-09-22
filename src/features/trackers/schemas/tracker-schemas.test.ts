import { describe, expect, it } from "vitest";

import {
  createTrackerSchema,
  upsertTrackerEntrySchema,
} from "@/features/trackers/schemas/tracker-schemas";

describe("tracker schemas", () => {
  it("normaliza campos opcionais ao criar tracker", () => {
    const parsed = createTrackerSchema.parse({
      name: " Candidaturas ",
      description: "",
      type: "number",
      targetValue: "5",
    });

    expect(parsed).toEqual({
      name: "Candidaturas",
      description: null,
      type: "number",
      targetValue: 5,
    });
  });

  it("rejeita meta numérica para tracker booleano", () => {
    expect(() =>
      createTrackerSchema.parse({
        name: "LinkedIn",
        description: "",
        type: "boolean",
        targetValue: "1",
      }),
    ).toThrow();
  });

  it("valida registro diário", () => {
    const parsed = upsertTrackerEntrySchema.parse({
      trackerId: "00000000-0000-4000-8000-000000000000",
      entryDate: "2026-08-07",
      value: "3",
      note: "",
    });

    expect(parsed).toMatchObject({
      entryDate: "2026-08-07",
      value: 3,
      note: null,
    });
  });
});
