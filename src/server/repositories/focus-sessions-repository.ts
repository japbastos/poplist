import { and, asc, count, desc, eq, gte, inArray, lte } from "drizzle-orm";

import { db } from "@/server/db/client";
import {
  focusSessions,
  type NewFocusSession,
  projects,
  tasks,
} from "@/server/db/schema";

export async function createFocusSession(values: NewFocusSession) {
  const [session] = await db.insert(focusSessions).values(values).returning();

  return session;
}

export async function getActiveFocusSession(userId: string) {
  const [session] = await db
    .select()
    .from(focusSessions)
    .where(
      and(
        eq(focusSessions.userId, userId),
        inArray(focusSessions.status, ["active", "paused"]),
      ),
    )
    .limit(1);

  return session ?? null;
}

export async function getActiveFocusSessionWithTask(userId: string) {
  const [session] = await db
    .select({
      session: focusSessions,
      task: tasks,
      project: projects,
    })
    .from(focusSessions)
    .innerJoin(tasks, eq(focusSessions.taskId, tasks.id))
    .leftJoin(projects, eq(focusSessions.projectId, projects.id))
    .where(
      and(
        eq(focusSessions.userId, userId),
        inArray(focusSessions.status, ["active", "paused"]),
      ),
    )
    .limit(1);

  return session ?? null;
}

export async function getFocusSessionById(id: string, userId: string) {
  const [session] = await db
    .select()
    .from(focusSessions)
    .where(and(eq(focusSessions.id, id), eq(focusSessions.userId, userId)))
    .limit(1);

  return session ?? null;
}

export async function updateFocusSessionById(
  id: string,
  userId: string,
  values: Partial<
    Pick<
      NewFocusSession,
      | "status"
      | "expectedEndAt"
      | "pausedAt"
      | "resumedAt"
      | "completedAt"
      | "cancelledAt"
      | "accumulatedPauseSeconds"
      | "focusedDurationSeconds"
    >
  >,
) {
  const [session] = await db
    .update(focusSessions)
    .set({
      ...values,
      updatedAt: new Date(),
    })
    .where(and(eq(focusSessions.id, id), eq(focusSessions.userId, userId)))
    .returning();

  return session ?? null;
}

export async function listFocusSessionsByTaskId(taskId: string, userId: string) {
  return db
    .select()
    .from(focusSessions)
    .where(and(eq(focusSessions.taskId, taskId), eq(focusSessions.userId, userId)))
    .orderBy(asc(focusSessions.startedAt));
}

export type ListFocusSessionHistoryFilters = {
  startDate?: Date;
  endDate?: Date;
  userId: string;
  projectId?: string;
  taskId?: string;
  limit: number;
  offset: number;
};

function getHistoryConditions(filters: ListFocusSessionHistoryFilters) {
  return [
    inArray(focusSessions.status, ["completed", "cancelled"]),
    eq(focusSessions.userId, filters.userId),
    filters.startDate ? gte(focusSessions.startedAt, filters.startDate) : undefined,
    filters.endDate ? lte(focusSessions.startedAt, filters.endDate) : undefined,
    filters.projectId ? eq(focusSessions.projectId, filters.projectId) : undefined,
    filters.taskId ? eq(focusSessions.taskId, filters.taskId) : undefined,
  ].filter((condition) => condition !== undefined);
}

export async function listFocusSessionHistory(
  filters: ListFocusSessionHistoryFilters,
) {
  const conditions = getHistoryConditions(filters);

  return db
    .select({
      session: focusSessions,
      task: tasks,
      project: projects,
    })
    .from(focusSessions)
    .innerJoin(tasks, eq(focusSessions.taskId, tasks.id))
    .leftJoin(projects, eq(focusSessions.projectId, projects.id))
    .where(and(...conditions))
    .orderBy(desc(focusSessions.startedAt))
    .limit(filters.limit)
    .offset(filters.offset);
}

export async function countFocusSessionHistory(
  filters: ListFocusSessionHistoryFilters,
) {
  const conditions = getHistoryConditions(filters);
  const [result] = await db
    .select({ value: count() })
    .from(focusSessions)
    .where(and(...conditions));

  return result?.value ?? 0;
}
