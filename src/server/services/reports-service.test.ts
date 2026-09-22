import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { tasks } from "@/server/db/schema";
import { createProject } from "@/server/services/projects-service";
import {
  cancelTask,
  completeTask,
  createTask,
} from "@/server/services/tasks-service";
import {
  cancelFocusSession,
  completeFocusSession,
  startFocusSession,
} from "@/server/services/focus-sessions-service";
import { getReports } from "@/server/services/reports-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("reports service", () => {
  it("calcula métricas e agrupamentos do período", async () => {
    const project = await createProject({
      name: "Relatórios",
      description: null,
      color: "#974aaa",
    });
    const task = await createTask({
      projectId: project.id,
      title: "Sessão concluída",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const cancelledTask = await createTask({
      projectId: project.id,
      title: "Sessão cancelada",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const completedTask = await createTask({
      projectId: null,
      title: "Tarefa concluída",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    const session = await startFocusSession(
      task.id,
      new Date("2026-08-07T12:00:00.000Z"),
    );
    await completeFocusSession(session.id, new Date("2026-08-07T12:10:00.000Z"));
    const cancelledSession = await startFocusSession(
      cancelledTask.id,
      new Date("2026-08-07T13:00:00.000Z"),
    );
    await cancelFocusSession(
      cancelledSession.id,
      new Date("2026-08-07T13:05:00.000Z"),
    );
    await completeTask(completedTask.id);
    await db
      .update(tasks)
      .set({ completedAt: new Date("2026-08-07T14:00:00.000Z") })
      .where(eq(tasks.id, completedTask.id));

    const report = await getReports({
      startDate: "2026-08-07",
      endDate: "2026-08-07",
    });

    expect(report.summary.focusedSeconds).toBe(600);
    expect(report.summary.completedSessions).toBe(1);
    expect(report.summary.cancelledSessions).toBe(1);
    expect(report.summary.completedTasks).toBe(1);
    expect(report.byDay).toEqual([
      {
        date: "2026-08-07",
        focusedSeconds: 600,
      },
    ]);
    expect(report.byProject[0]).toMatchObject({
      projectName: "Relatórios",
      focusedSeconds: 600,
      completedSessions: 1,
      cancelledSessions: 1,
    });
  });

  it("funciona sem dados no período", async () => {
    const report = await getReports({
      startDate: "2026-01-01",
      endDate: "2026-01-02",
    });

    expect(report.summary).toEqual({
      focusedSeconds: 0,
      completedSessions: 0,
      cancelledSessions: 0,
      completedTasks: 0,
    });
    expect(report.byDay).toEqual([]);
    expect(report.byProject).toEqual([]);
  });

  it("não conta tarefas canceladas como concluídas", async () => {
    const task = await createTask({
      projectId: null,
      title: "Cancelada",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    await cancelTask(task.id);

    const report = await getReports({});

    expect(report.summary.completedTasks).toBe(0);
  });
});
