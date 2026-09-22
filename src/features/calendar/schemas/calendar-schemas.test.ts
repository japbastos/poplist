import { describe, expect, it } from "vitest";

import { calendarFiltersSchema } from "@/features/calendar/schemas/calendar-schemas";

describe("calendar schemas", () => {
  it("aceita filtros válidos", () => {
    expect(
      calendarFiltersSchema.parse({
        month: "2026-08",
        date: "2026-08-07",
      }),
    ).toEqual({
      month: "2026-08",
      date: "2026-08-07",
    });
  });

  it("rejeita mês inválido", () => {
    expect(() => calendarFiltersSchema.parse({ month: "2026-8" })).toThrow();
  });
});
