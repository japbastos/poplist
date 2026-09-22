import { beforeEach, describe, expect, it } from "vitest";

import { createTask } from "@/server/services/tasks-service";
import {
  cancelFocusSession,
  completeFocusSession,
  getRemainingSeconds,
  pauseFocusSession,
  resumeFocusSession,
  startFocusSession,
} from "@/server/services/focus-sessions-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("focus sessions service", () => {
  it("inicia sessão e impede sessão simultânea", async () => {
    const task = await createTask({
      projectId: null,
      title: "Foco",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const secondTask = await createTask({
      projectId: null,
      title: "Outro foco",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    const session = await startFocusSession(task.id);

    expect(session.status).toBe("active");
    expect(session.plannedDurationSeconds).toBe(1500);
    await expect(startFocusSession(secondTask.id)).rejects.toThrow(
      "Já existe uma sessão de foco ativa.",
    );
  });

  it("pausa e retoma deslocando expectedEndAt pela pausa", async () => {
    const task = await createTask({
      projectId: null,
      title: "Pausar",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const session = await startFocusSession(
      task.id,
      new Date("2026-08-07T12:00:00.000Z"),
    );

    await pauseFocusSession(session.id, new Date("2026-08-07T12:05:00.000Z"));
    const resumed = await resumeFocusSession(
      session.id,
      new Date("2026-08-07T12:07:00.000Z"),
    );

    expect(resumed?.status).toBe("active");
    expect(resumed?.accumulatedPauseSeconds).toBe(120);
    expect(resumed?.expectedEndAt.toISOString()).toBe("2026-08-07T12:27:00.000Z");
  });

  it("conclui sessão com duração focada descontando pausa", async () => {
    const task = await createTask({
      projectId: null,
      title: "Concluir",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const session = await startFocusSession(
      task.id,
      new Date("2026-08-07T12:00:00.000Z"),
    );

    await pauseFocusSession(session.id, new Date("2026-08-07T12:10:00.000Z"));
    await resumeFocusSession(session.id, new Date("2026-08-07T12:15:00.000Z"));
    const completed = await completeFocusSession(
      session.id,
      new Date("2026-08-07T12:30:00.000Z"),
    );

    expect(completed?.status).toBe("completed");
    expect(completed?.accumulatedPauseSeconds).toBe(300);
    expect(completed?.focusedDurationSeconds).toBe(1500);
  });

  it("cancela sessão em andamento", async () => {
    const task = await createTask({
      projectId: null,
      title: "Cancelar",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const session = await startFocusSession(task.id);
    const cancelled = await cancelFocusSession(session.id);

    expect(cancelled?.status).toBe("cancelled");
    expect(cancelled?.cancelledAt).toBeInstanceOf(Date);
  });

  it("calcula tempo restante por timestamp", () => {
    expect(
      getRemainingSeconds(
        new Date("2026-08-07T12:25:00.000Z"),
        new Date("2026-08-07T12:00:00.500Z"),
      ),
    ).toBe(1500);
  });
});
