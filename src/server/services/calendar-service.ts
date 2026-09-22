import { and, eq, gte, lte } from "drizzle-orm";

import { getServiceUserId } from "@/server/auth/service-user";
import { db } from "@/server/db/client";
import {
  dailyPlanItems,
  focusSessions,
  projects,
  trackerEntries,
  trackers,
  tasks,
} from "@/server/db/schema";

function parseLocalDate(value: string, endOfDay = false) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );
}

function formatDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export type CalendarDayOverview = {
  date: string;
  plannedTasks: number;
  dueTasks: number;
  completedTasks: number;
  focusSeconds: number;
  trackerEntries: number;
  trackerTargetHits: number;
};

export type CalendarDayDetails = CalendarDayOverview & {
  plannedItems: Array<{
    taskTitle: string;
    projectName: string | null;
  }>;
  dueItems: Array<{
    taskTitle: string;
    status: string;
    projectName: string | null;
  }>;
  completedItems: Array<{
    taskTitle: string;
    projectName: string | null;
  }>;
  trackerItems: Array<{
    trackerName: string;
    value: number;
    targetValue: number | null;
    note: string | null;
  }>;
};

export type CalendarOverview = {
  days: CalendarDayOverview[];
  selectedDay: CalendarDayDetails;
};

function emptyDay(date: string): CalendarDayDetails {
  return {
    date,
    plannedTasks: 0,
    dueTasks: 0,
    completedTasks: 0,
    focusSeconds: 0,
    trackerEntries: 0,
    trackerTargetHits: 0,
    plannedItems: [],
    dueItems: [],
    completedItems: [],
    trackerItems: [],
  };
}

export async function getCalendarOverview(
  startDate: string,
  endDate: string,
  selectedDate: string,
): Promise<CalendarOverview> {
  const userId = await getServiceUserId();
  const startDateTime = parseLocalDate(startDate);
  const endDateTime = parseLocalDate(endDate, true);
  const [
    plannedRows,
    dueRows,
    completedRows,
    focusRows,
    trackerRows,
  ] = await Promise.all([
    db
      .select({
        planItem: dailyPlanItems,
        task: tasks,
        project: projects,
      })
      .from(dailyPlanItems)
      .innerJoin(tasks, eq(dailyPlanItems.taskId, tasks.id))
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(dailyPlanItems.userId, userId),
          gte(dailyPlanItems.planDate, startDate),
          lte(dailyPlanItems.planDate, endDate),
        ),
      ),
    db
      .select({
        task: tasks,
        project: projects,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.dueDate, startDate),
          lte(tasks.dueDate, endDate),
        ),
      ),
    db
      .select({
        task: tasks,
        project: projects,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.completedAt, startDateTime),
          lte(tasks.completedAt, endDateTime),
        ),
      ),
    db
      .select()
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, userId),
          gte(focusSessions.startedAt, startDateTime),
          lte(focusSessions.startedAt, endDateTime),
        ),
      ),
    db
      .select({
        entry: trackerEntries,
        tracker: trackers,
      })
      .from(trackerEntries)
      .innerJoin(trackers, eq(trackerEntries.trackerId, trackers.id))
      .where(
        and(
          eq(trackerEntries.userId, userId),
          gte(trackerEntries.entryDate, startDate),
          lte(trackerEntries.entryDate, endDate),
        ),
      ),
  ]);
  const daysByDate = new Map<string, CalendarDayDetails>();

  function getDay(date: string) {
    const day = daysByDate.get(date) ?? emptyDay(date);
    daysByDate.set(date, day);

    return day;
  }

  for (const row of plannedRows) {
    const day = getDay(row.planItem.planDate);
    day.plannedTasks += 1;
    day.plannedItems.push({
      taskTitle: row.task.title,
      projectName: row.project?.name ?? null,
    });
  }

  for (const row of dueRows) {
    if (!row.task.dueDate) {
      continue;
    }

    const day = getDay(row.task.dueDate);
    day.dueTasks += 1;
    day.dueItems.push({
      taskTitle: row.task.title,
      status: row.task.status,
      projectName: row.project?.name ?? null,
    });
  }

  for (const row of completedRows) {
    if (!row.task.completedAt) {
      continue;
    }

    const day = getDay(formatDayKey(row.task.completedAt));
    day.completedTasks += 1;
    day.completedItems.push({
      taskTitle: row.task.title,
      projectName: row.project?.name ?? null,
    });
  }

  for (const session of focusRows) {
    const day = getDay(formatDayKey(session.startedAt));

    if (session.status === "completed") {
      day.focusSeconds += session.focusedDurationSeconds ?? 0;
    }
  }

  for (const row of trackerRows) {
    const day = getDay(row.entry.entryDate);
    const hitTarget =
      row.tracker.targetValue !== null &&
      row.entry.value >= row.tracker.targetValue;

    day.trackerEntries += 1;
    day.trackerTargetHits += hitTarget ? 1 : 0;
    day.trackerItems.push({
      trackerName: row.tracker.name,
      value: row.entry.value,
      targetValue: row.tracker.targetValue,
      note: row.entry.note,
    });
  }

  const days: CalendarDayOverview[] = Array.from(daysByDate.values())
    .map((day) => ({
      date: day.date,
      plannedTasks: day.plannedTasks,
      dueTasks: day.dueTasks,
      completedTasks: day.completedTasks,
      focusSeconds: day.focusSeconds,
      trackerEntries: day.trackerEntries,
      trackerTargetHits: day.trackerTargetHits,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    days,
    selectedDay: daysByDate.get(selectedDate) ?? emptyDay(selectedDate),
  };
}
