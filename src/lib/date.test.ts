import { describe, expect, it } from "vitest";

import { addDaysToPlanDate, formatPlanDateLabel, isValidPlanDate } from "@/lib/date";

describe("date helpers", () => {
  it("mantém planDate como string local sem conversão UTC", () => {
    expect(addDaysToPlanDate("2026-08-07", 1)).toBe("2026-08-08");
    expect(addDaysToPlanDate("2026-08-07", -1)).toBe("2026-08-06");
    expect(formatPlanDateLabel("2026-08-07")).toContain("2026");
  });

  it("valida formato de planDate", () => {
    expect(isValidPlanDate("2026-08-07")).toBe(true);
    expect(isValidPlanDate("07/08/2026")).toBe(false);
  });
});
