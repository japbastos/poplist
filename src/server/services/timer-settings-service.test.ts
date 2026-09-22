import { beforeEach, describe, expect, it } from "vitest";

import { timerSettingsSchema } from "@/features/settings/schemas/timer-settings-schemas";
import { db } from "@/server/db/client";
import { focusSessions } from "@/server/db/schema";
import { createTask } from "@/server/services/tasks-service";
import { startFocusSession } from "@/server/services/focus-sessions-service";
import {
  defaultTimerSettings,
  getTimerSettings,
  updateTimerSettings,
} from "@/server/services/timer-settings-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("timer settings service", () => {
  it("retorna defaults quando ainda não há configuração persistida", async () => {
    await expect(getTimerSettings()).resolves.toEqual(defaultTimerSettings);
  });

  it("persiste e atualiza as configurações do timer", async () => {
    await updateTimerSettings({
      focusDurationMinutes: 45,
      shortBreakMinutes: 10,
      longBreakMinutes: 30,
      soundEnabled: false,
      autoStartBreak: true,
    });

    await expect(getTimerSettings()).resolves.toEqual({
      focusDurationMinutes: 45,
      shortBreakMinutes: 10,
      longBreakMinutes: 30,
      soundEnabled: false,
      autoStartBreak: true,
    });
  });

  it("rejeita valores fora dos limites", () => {
    const parsed = timerSettingsSchema.safeParse({
      focusDurationMinutes: 4,
      shortBreakMinutes: 0,
      longBreakMinutes: 121,
      soundEnabled: true,
      autoStartBreak: false,
    });

    expect(parsed.success).toBe(false);
  });

  it("aplica a duração configurada apenas a novas sessões", async () => {
    const firstTask = await createTask({
      projectId: null,
      title: "Sessão padrão",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const firstSession = await startFocusSession(
      firstTask.id,
      new Date("2026-08-07T12:00:00.000Z"),
    );

    await db.update(focusSessions).set({ status: "completed" });
    await updateTimerSettings({
      focusDurationMinutes: 40,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      soundEnabled: true,
      autoStartBreak: false,
    });

    const secondTask = await createTask({
      projectId: null,
      title: "Sessão configurada",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const secondSession = await startFocusSession(
      secondTask.id,
      new Date("2026-08-07T13:00:00.000Z"),
    );

    expect(firstSession.plannedDurationSeconds).toBe(1500);
    expect(secondSession.plannedDurationSeconds).toBe(2400);
    expect(secondSession.expectedEndAt.toISOString()).toBe(
      "2026-08-07T13:40:00.000Z",
    );
  });
});
