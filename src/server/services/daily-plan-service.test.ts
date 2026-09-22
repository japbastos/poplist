import { beforeEach, describe, expect, it } from "vitest";

import {
  createTaskForToday,
  getDailyPlan,
  planTaskForDate,
  removeTaskFromDate,
  reorderDailyPlanItem,
} from "@/server/services/daily-plan-service";
import { createTask, cancelTask } from "@/server/services/tasks-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("daily plan service", () => {
  it("planeja tarefa uma única vez por data", async () => {
    const task = await createTask({
      projectId: null,
      title: "Planejar",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    const firstItem = await planTaskForDate(task.id, "2026-08-07");
    const secondItem = await planTaskForDate(task.id, "2026-08-07");

    expect(secondItem.id).toBe(firstItem.id);
    await expect(getDailyPlan("2026-08-07")).resolves.toHaveLength(1);
  });

  it("ordena e reordena tarefas planejadas", async () => {
    const firstTask = await createTask({
      projectId: null,
      title: "Primeira",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const secondTask = await createTask({
      projectId: null,
      title: "Segunda",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    await planTaskForDate(firstTask.id, "2026-08-07");
    const secondItem = await planTaskForDate(secondTask.id, "2026-08-07");
    await reorderDailyPlanItem(secondItem.id, "up");

    const plan = await getDailyPlan("2026-08-07");
    expect(plan.map((item) => item.task.title)).toEqual(["Segunda", "Primeira"]);
  });

  it("remove do planejamento sem excluir tarefa", async () => {
    const task = await createTask({
      projectId: null,
      title: "Remover do dia",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const item = await planTaskForDate(task.id, "2026-08-07");

    await removeTaskFromDate(item.id);

    await expect(getDailyPlan("2026-08-07")).resolves.toHaveLength(0);
    await expect(createTask({
      projectId: null,
      title: "Outra",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    })).resolves.toBeDefined();
  });

  it("cria tarefa diretamente no dia", async () => {
    await createTaskForToday({
      planDate: "2026-08-07",
      title: "Criada hoje",
    });

    const plan = await getDailyPlan("2026-08-07");
    expect(plan).toHaveLength(1);
    expect(plan[0]?.task.title).toBe("Criada hoje");
  });

  it("não planeja tarefa cancelada", async () => {
    const task = await createTask({
      projectId: null,
      title: "Cancelada",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    await cancelTask(task.id);

    await expect(planTaskForDate(task.id, "2026-08-07")).rejects.toThrow(
      "Tarefas canceladas não podem ser planejadas.",
    );
  });
});
