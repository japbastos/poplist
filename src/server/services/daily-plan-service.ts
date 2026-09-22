import type { CreateTaskForTodayInput } from "@/features/daily-plan/schemas/daily-plan-schemas";
import {
  createDailyPlanItem,
  deleteDailyPlanItemById,
  getDailyPlanItemById,
  getDailyPlanItemByTaskAndDate,
  getDailyPlanItemsWithTasks,
  getLastDailyPlanPosition,
  listDailyPlanItemsByDate,
  updateDailyPlanItemPosition,
} from "@/server/repositories/daily-plan-repository";
import { getTaskById } from "@/server/repositories/tasks-repository";
import { getServiceUserId } from "@/server/auth/service-user";
import { createTask } from "@/server/services/tasks-service";

export async function getDailyPlan(planDate: string) {
  const userId = await getServiceUserId();

  return getDailyPlanItemsWithTasks(planDate, userId);
}

export async function planTaskForDate(taskId: string, planDate: string) {
  const userId = await getServiceUserId();
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  if (task.status === "cancelled") {
    throw new Error("Tarefas canceladas não podem ser planejadas.");
  }

  const existingItem = await getDailyPlanItemByTaskAndDate(
    taskId,
    planDate,
    userId,
  );

  if (existingItem) {
    return existingItem;
  }

  const lastPosition = await getLastDailyPlanPosition(planDate, userId);

  return createDailyPlanItem({
    userId,
    taskId,
    planDate,
    position: lastPosition + 1,
  });
}

export async function removeTaskFromDate(planItemId: string) {
  const userId = await getServiceUserId();
  const item = await deleteDailyPlanItemById(planItemId, userId);

  if (!item) {
    throw new Error("Item do planejamento não encontrado.");
  }

  return item;
}

export async function reorderDailyPlanItem(
  planItemId: string,
  direction: "up" | "down",
) {
  const userId = await getServiceUserId();
  const item = await getDailyPlanItemById(planItemId, userId);

  if (!item) {
    throw new Error("Item do planejamento não encontrado.");
  }

  const items = await listDailyPlanItemsByDate(item.planDate, userId);
  const currentIndex = items.findIndex((candidate) => candidate.id === item.id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const targetItem = items[targetIndex];

  if (!targetItem) {
    return item;
  }

  const temporaryPosition =
    (await getLastDailyPlanPosition(item.planDate, userId)) + 1;
  await updateDailyPlanItemPosition(item.id, temporaryPosition, userId);
  await updateDailyPlanItemPosition(targetItem.id, item.position, userId);
  await updateDailyPlanItemPosition(item.id, targetItem.position, userId);

  return getDailyPlanItemById(item.id, userId);
}

export async function createTaskForToday(input: CreateTaskForTodayInput) {
  const task = await createTask({
    projectId: null,
    title: input.title,
    description: null,
    priority: "medium",
    estimatedPomodoros: 1,
    dueDate: null,
  });

  await planTaskForDate(task.id, input.planDate);

  return task;
}
