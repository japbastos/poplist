import { beforeEach, describe, expect, it } from "vitest";

import { completeTask, createTask } from "@/server/services/tasks-service";
import { createProject } from "@/server/services/projects-service";
import {
  completeFocusSession,
  startFocusSession,
} from "@/server/services/focus-sessions-service";
import {
  createTracker,
  upsertTrackerEntry,
} from "@/server/services/trackers-service";
import { planTaskForDate } from "@/server/services/daily-plan-service";
import { getCalendarOverview } from "@/server/services/calendar-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("calendar service", () => {
  it("agrega planejamento, prazos, foco e trackers por dia", async () => {
    const project = await createProject({
      name: "Busca de cargos",
      description: null,
      color: "#974aaa",
    });
    const plannedTask = await createTask({
      projectId: project.id,
      title: "Aplicar para vagas",
      description: null,
      priority: "high",
      estimatedPomodoros: 1,
      dueDate: "2026-08-07",
    });
    const completedTask = await createTask({
      projectId: project.id,
      title: "Revisar CV",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    await planTaskForDate(plannedTask.id, "2026-08-07");
    await completeTask(completedTask.id);

    const session = await startFocusSession(
      plannedTask.id,
      new Date("2026-08-07T12:00:00.000Z"),
    );
    await completeFocusSession(session.id, new Date("2026-08-07T12:25:00.000Z"));

    const tracker = await createTracker({
      name: "Candidaturas",
      description: null,
      type: "number",
      targetValue: 5,
    });
    await upsertTrackerEntry({
      trackerId: tracker.id,
      entryDate: "2026-08-07",
      value: 5,
      note: "Dia bom",
    });

    const overview = await getCalendarOverview(
      "2026-08-01",
      "2026-08-31",
      "2026-08-07",
    );
    const day = overview.selectedDay;

    expect(day).toMatchObject({
      date: "2026-08-07",
      plannedTasks: 1,
      dueTasks: 1,
      focusSeconds: 1500,
      trackerEntries: 1,
      trackerTargetHits: 1,
    });
    expect(day.plannedItems).toHaveLength(1);
    expect(day.dueItems).toHaveLength(1);
    expect(day.trackerItems).toMatchObject([
      {
        trackerName: "Candidaturas",
        value: 5,
        targetValue: 5,
        note: "Dia bom",
      },
    ]);
    expect(overview.days.some((item) => item.date === "2026-08-07")).toBe(true);
  });
});
