import { and, asc, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/client";
import { type NewTask, tasks } from "@/server/db/schema";

export async function createTask(values: NewTask) {
  const [task] = await db.insert(tasks).values(values).returning();

  return task;
}

export async function listTasks() {
  return db.select().from(tasks).orderBy(asc(tasks.createdAt));
}

export type ListTasksFilters = {
  userId: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  projectId?: string;
  search?: string;
};

export async function listTasksByFilters(filters: ListTasksFilters) {
  const conditions = [
    eq(tasks.userId, filters.userId),
    filters.status ? eq(tasks.status, filters.status) : undefined,
    filters.projectId ? eq(tasks.projectId, filters.projectId) : undefined,
    filters.search ? ilike(tasks.title, `%${filters.search}%`) : undefined,
  ].filter((condition) => condition !== undefined);

  return db
    .select()
    .from(tasks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(tasks.createdAt));
}

export async function getTaskById(id: string, userId: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);

  return task ?? null;
}

export async function updateTaskById(
  id: string,
  userId: string,
  values: Partial<
    Pick<
      NewTask,
      | "projectId"
      | "title"
      | "description"
      | "status"
      | "priority"
      | "estimatedPomodoros"
      | "dueDate"
      | "completedAt"
    >
  >,
) {
  const [task] = await db
    .update(tasks)
    .set({
      ...values,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  return task ?? null;
}
