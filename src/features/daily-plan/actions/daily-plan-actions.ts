"use server";

import { revalidatePath } from "next/cache";

import {
  createTaskForTodaySchema,
  planTaskForDateSchema,
  removeTaskFromDateSchema,
  reorderDailyPlanItemSchema,
} from "@/features/daily-plan/schemas/daily-plan-schemas";
import {
  createTaskForToday,
  planTaskForDate,
  removeTaskFromDate,
  reorderDailyPlanItem,
} from "@/server/services/daily-plan-service";
import { completeTask } from "@/server/services/tasks-service";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function revalidateToday(planDate?: string) {
  revalidatePath(planDate ? `/today?date=${planDate}` : "/today");
  revalidatePath("/today");
  revalidatePath("/tasks");
}

export async function planTaskForDateAction(formData: FormData) {
  const parsed = planTaskForDateSchema.safeParse({
    taskId: getStringValue(formData, "taskId"),
    planDate: getStringValue(formData, "planDate"),
  });

  if (!parsed.success) {
    return;
  }

  await planTaskForDate(parsed.data.taskId, parsed.data.planDate);
  revalidateToday(parsed.data.planDate);
}

export async function removeTaskFromDateAction(formData: FormData) {
  const parsed = removeTaskFromDateSchema.safeParse({
    planItemId: getStringValue(formData, "planItemId"),
  });

  if (!parsed.success) {
    return;
  }

  await removeTaskFromDate(parsed.data.planItemId);
  revalidateToday();
}

export async function reorderDailyPlanItemAction(formData: FormData) {
  const parsed = reorderDailyPlanItemSchema.safeParse({
    planItemId: getStringValue(formData, "planItemId"),
    direction: getStringValue(formData, "direction"),
  });

  if (!parsed.success) {
    return;
  }

  await reorderDailyPlanItem(parsed.data.planItemId, parsed.data.direction);
  revalidateToday();
}

export async function completePlannedTaskAction(formData: FormData) {
  const taskId = getStringValue(formData, "taskId");

  if (!taskId) {
    return;
  }

  await completeTask(taskId);
  revalidateToday();
}

export async function createTaskForTodayAction(formData: FormData) {
  const parsed = createTaskForTodaySchema.safeParse({
    planDate: getStringValue(formData, "planDate"),
    title: getStringValue(formData, "title"),
  });

  if (!parsed.success) {
    return;
  }

  await createTaskForToday(parsed.data);
  revalidateToday(parsed.data.planDate);
}
