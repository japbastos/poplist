import { and, eq, gte, lte } from "drizzle-orm";

import type {
  DailyReportRow,
  ProjectReportRow,
  ReportFiltersInput,
  ReportSummary,
} from "@/features/reports/schemas/report-schemas";
import { db } from "@/server/db/client";
import { focusSessions, projects, tasks } from "@/server/db/schema";
import { getServiceUserId } from "@/server/auth/service-user";

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

export async function getReports(filters: ReportFiltersInput) {
  const userId = await getServiceUserId();
  const startDate = filters.startDate
    ? parseLocalDate(filters.startDate)
    : undefined;
  const endDate = filters.endDate
    ? parseLocalDate(filters.endDate, true)
    : undefined;
  const periodConditions = [
    eq(focusSessions.userId, userId),
    startDate ? gte(focusSessions.startedAt, startDate) : undefined,
    endDate ? lte(focusSessions.startedAt, endDate) : undefined,
  ].filter((condition) => condition !== undefined);
  const where = and(...periodConditions);

  const [sessions, allTasks] = await Promise.all([
    db
      .select({
        session: focusSessions,
        task: tasks,
        project: projects,
      })
      .from(focusSessions)
      .innerJoin(tasks, eq(focusSessions.taskId, tasks.id))
      .leftJoin(projects, eq(focusSessions.projectId, projects.id))
      .where(where),
    db.select().from(tasks).where(eq(tasks.userId, userId)),
  ]);

  const completedSessions = sessions.filter(
    (item) => item.session.status === "completed",
  );
  const cancelledSessions = sessions.filter(
    (item) => item.session.status === "cancelled",
  );
  const focusedSeconds = completedSessions.reduce(
    (total, item) => total + (item.session.focusedDurationSeconds ?? 0),
    0,
  );
  const completedTasks = allTasks.filter((task) => {
    if (task.status !== "completed" || !task.completedAt) {
      return false;
    }

    if (startDate && task.completedAt < startDate) {
      return false;
    }

    if (endDate && task.completedAt > endDate) {
      return false;
    }

    return true;
  }).length;
  const byProject = new Map<string, ProjectReportRow>();
  const byDay = new Map<string, number>();

  for (const item of sessions) {
    const projectKey = item.project?.id ?? "no-project";
    const currentProject = byProject.get(projectKey) ?? {
      projectKey,
      projectName: item.project?.name ?? "Sem projeto",
      focusedSeconds: 0,
      completedSessions: 0,
      cancelledSessions: 0,
    };

    if (item.session.status === "completed") {
      const seconds = item.session.focusedDurationSeconds ?? 0;
      currentProject.focusedSeconds += seconds;
      currentProject.completedSessions += 1;

      const dayKey = formatDayKey(item.session.startedAt);
      byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + seconds);
    }

    if (item.session.status === "cancelled") {
      currentProject.cancelledSessions += 1;
    }

    byProject.set(projectKey, currentProject);
  }

  const summary: ReportSummary = {
    focusedSeconds,
    completedSessions: completedSessions.length,
    cancelledSessions: cancelledSessions.length,
    completedTasks,
  };
  const dailyRows: DailyReportRow[] = Array.from(byDay.entries())
    .map(([date, seconds]) => ({ date, focusedSeconds: seconds }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    summary,
    byProject: Array.from(byProject.values()).sort(
      (a, b) => b.focusedSeconds - a.focusedSeconds,
    ),
    byDay: dailyRows,
  };
}
