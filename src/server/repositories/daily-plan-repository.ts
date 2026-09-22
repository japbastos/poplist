import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import {
  dailyPlanItems,
  projects,
  type NewDailyPlanItem,
  tasks,
} from "@/server/db/schema";

export async function createDailyPlanItem(values: NewDailyPlanItem) {
  const [item] = await db.insert(dailyPlanItems).values(values).returning();

  return item;
}

export async function listDailyPlanItemsByDate(planDate: string, userId: string) {
  return db
    .select()
    .from(dailyPlanItems)
    .where(and(eq(dailyPlanItems.planDate, planDate), eq(dailyPlanItems.userId, userId)))
    .orderBy(asc(dailyPlanItems.position));
}

export async function getDailyPlanItemsWithTasks(planDate: string, userId: string) {
  return db
    .select({
      planItem: dailyPlanItems,
      task: tasks,
      project: projects,
    })
    .from(dailyPlanItems)
    .innerJoin(tasks, eq(dailyPlanItems.taskId, tasks.id))
    .leftJoin(projects, eq(tasks.projectId, projects.id))
    .where(and(eq(dailyPlanItems.planDate, planDate), eq(dailyPlanItems.userId, userId)))
    .orderBy(asc(dailyPlanItems.position));
}

export async function getDailyPlanItemById(id: string, userId: string) {
  const [item] = await db
    .select()
    .from(dailyPlanItems)
    .where(and(eq(dailyPlanItems.id, id), eq(dailyPlanItems.userId, userId)))
    .limit(1);

  return item ?? null;
}

export async function getDailyPlanItemByTaskAndDate(
  taskId: string,
  planDate: string,
  userId: string,
) {
  const [item] = await db
    .select()
    .from(dailyPlanItems)
    .where(
      and(
        eq(dailyPlanItems.taskId, taskId),
        eq(dailyPlanItems.planDate, planDate),
        eq(dailyPlanItems.userId, userId),
      ),
    )
    .limit(1);

  return item ?? null;
}

export async function getLastDailyPlanPosition(planDate: string, userId: string) {
  const [item] = await db
    .select({ position: dailyPlanItems.position })
    .from(dailyPlanItems)
    .where(and(eq(dailyPlanItems.planDate, planDate), eq(dailyPlanItems.userId, userId)))
    .orderBy(desc(dailyPlanItems.position))
    .limit(1);

  return item?.position ?? -1;
}

export async function deleteDailyPlanItemById(id: string, userId: string) {
  const [item] = await db
    .delete(dailyPlanItems)
    .where(and(eq(dailyPlanItems.id, id), eq(dailyPlanItems.userId, userId)))
    .returning();

  return item ?? null;
}

export async function updateDailyPlanItemPosition(
  id: string,
  position: number,
  userId: string,
) {
  const [item] = await db
    .update(dailyPlanItems)
    .set({ position })
    .where(and(eq(dailyPlanItems.id, id), eq(dailyPlanItems.userId, userId)))
    .returning();

  return item ?? null;
}
