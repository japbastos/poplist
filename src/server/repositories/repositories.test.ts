import { sql } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/server/db/client";
import { ensureLocalUser } from "@/server/services/auth-service";
import { truncateTestDatabase } from "@/test/database";
import {
  createDailyPlanItem,
  listDailyPlanItemsByDate,
} from "@/server/repositories/daily-plan-repository";
import {
  createFocusSession,
  getActiveFocusSession,
} from "@/server/repositories/focus-sessions-repository";
import {
  createProject,
  getProjectById,
  listProjects,
} from "@/server/repositories/projects-repository";
import {
  createTask,
  getTaskById,
  listTasks,
} from "@/server/repositories/tasks-repository";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("repositories", () => {
  it("cria e consulta projetos e tarefas", async () => {
    const user = await ensureLocalUser();
    const project = await createProject({
      userId: user.id,
      name: "Produto",
      color: "#2563eb",
    });
    const task = await createTask({
      userId: user.id,
      projectId: project.id,
      title: "Definir backlog",
      priority: "high",
      estimatedPomodoros: 2,
    });

    await expect(getProjectById(project.id, user.id)).resolves.toMatchObject({
      id: project.id,
      name: "Produto",
    });
    await expect(getTaskById(task.id, user.id)).resolves.toMatchObject({
      id: task.id,
      projectId: project.id,
      title: "Definir backlog",
    });
    await expect(listProjects()).resolves.toHaveLength(1);
    await expect(listTasks()).resolves.toHaveLength(1);
  });

  it("preserva planDate como date sem conversão para timestamp", async () => {
    const user = await ensureLocalUser();
    const task = await createTask({
      userId: user.id,
      title: "Planejar hoje",
    });

    await createDailyPlanItem({
      userId: user.id,
      taskId: task.id,
      planDate: "2026-08-07",
      position: 1,
    });

    await expect(
      listDailyPlanItemsByDate("2026-08-07", user.id),
    ).resolves.toMatchObject([
      {
        planDate: "2026-08-07",
        position: 1,
      },
    ]);
  });

  it("impede mais de uma sessão ativa global", async () => {
    const user = await ensureLocalUser();
    const firstTask = await createTask({ userId: user.id, title: "Sessão 1" });
    const secondTask = await createTask({ userId: user.id, title: "Sessão 2" });
    const startedAt = new Date("2026-08-07T12:00:00.000Z");
    const expectedEndAt = new Date("2026-08-07T12:25:00.000Z");

    await createFocusSession({
      userId: user.id,
      taskId: firstTask.id,
      startedAt,
      expectedEndAt,
      plannedDurationSeconds: 1500,
    });

    await expect(
      createFocusSession({
        userId: user.id,
        taskId: secondTask.id,
        startedAt,
        expectedEndAt,
        plannedDurationSeconds: 1500,
      }),
    ).rejects.toThrow();

    await expect(getActiveFocusSession(user.id)).resolves.toMatchObject({
      taskId: firstTask.id,
      status: "active",
    });
  });

  it("possui relações de foreign key no banco", async () => {
    const constraints = await db.execute(sql`
      select constraint_name
      from information_schema.table_constraints
      where constraint_type = 'FOREIGN KEY'
        and table_schema = 'public'
        and table_name in (
          'tasks',
          'daily_plan_items',
          'focus_sessions'
        )
    `);

    expect(constraints.length).toBeGreaterThanOrEqual(4);
  });
});
