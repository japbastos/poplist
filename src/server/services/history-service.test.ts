import { beforeEach, describe, expect, it } from "vitest";

import { createProject } from "@/server/services/projects-service";
import { createTask } from "@/server/services/tasks-service";
import {
  cancelFocusSession,
  completeFocusSession,
  startFocusSession,
} from "@/server/services/focus-sessions-service";
import { getFocusSessionHistory } from "@/server/services/history-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("history service", () => {
  it("consulta sessões por período e diferencia canceladas", async () => {
    const task = await createTask({
      projectId: null,
      title: "Histórico",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    const completedSession = await startFocusSession(
      task.id,
      new Date("2026-08-07T12:00:00.000Z"),
    );
    await completeFocusSession(
      completedSession.id,
      new Date("2026-08-07T12:25:00.000Z"),
    );
    const cancelledSession = await startFocusSession(
      task.id,
      new Date("2026-08-08T12:00:00.000Z"),
    );
    await cancelFocusSession(
      cancelledSession.id,
      new Date("2026-08-08T12:05:00.000Z"),
    );

    const history = await getFocusSessionHistory({
      startDate: "2026-08-07",
      endDate: "2026-08-08",
      page: 1,
    });

    expect(history.totalItems).toBe(2);
    expect(history.items.map((item) => item.session.status)).toEqual([
      "cancelled",
      "completed",
    ]);
  });

  it("filtra por projeto e tarefa em conjunto", async () => {
    const project = await createProject({
      name: "Projeto histórico",
      description: null,
      color: "#974aaa",
    });
    const task = await createTask({
      projectId: project.id,
      title: "Com projeto",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const otherTask = await createTask({
      projectId: null,
      title: "Sem projeto",
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
    const otherSession = await startFocusSession(
      otherTask.id,
      new Date("2026-08-07T13:00:00.000Z"),
    );
    await completeFocusSession(
      otherSession.id,
      new Date("2026-08-07T13:10:00.000Z"),
    );

    const history = await getFocusSessionHistory({
      projectId: project.id,
      taskId: task.id,
      page: 1,
    });

    expect(history.totalItems).toBe(1);
    expect(history.items[0]?.task.id).toBe(task.id);
    expect(history.items[0]?.project?.id).toBe(project.id);
  });

  it("pagina resultados", async () => {
    for (let index = 0; index < 11; index += 1) {
      const task = await createTask({
        projectId: null,
        title: `Sessão ${index}`,
        description: null,
        priority: "medium",
        estimatedPomodoros: 1,
        dueDate: null,
      });
      const session = await startFocusSession(
        task.id,
        new Date(`2026-08-${String(index + 1).padStart(2, "0")}T12:00:00.000Z`),
      );
      await completeFocusSession(
        session.id,
        new Date(`2026-08-${String(index + 1).padStart(2, "0")}T12:10:00.000Z`),
      );
    }

    const firstPage = await getFocusSessionHistory({ page: 1 });
    const secondPage = await getFocusSessionHistory({ page: 2 });

    expect(firstPage.items).toHaveLength(10);
    expect(secondPage.items).toHaveLength(1);
    expect(firstPage.totalPages).toBe(2);
  });
});
