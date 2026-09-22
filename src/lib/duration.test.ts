import { describe, expect, it } from "vitest";

import { formatDuration } from "@/lib/duration";

describe("formatDuration", () => {
  it("formata segundos, minutos e horas", () => {
    expect(formatDuration(12)).toBe("12s");
    expect(formatDuration(125)).toBe("2min 5s");
    expect(formatDuration(3720)).toBe("1h 2min");
    expect(formatDuration(null)).toBe("0s");
  });
});
