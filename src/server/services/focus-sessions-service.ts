import { startFocusSessionSchema } from "@/features/focus-sessions/schemas/focus-session-schemas";
import {
  createFocusSession,
  getActiveFocusSession,
  getActiveFocusSessionWithTask,
  getFocusSessionById,
  updateFocusSessionById,
} from "@/server/repositories/focus-sessions-repository";
import { getTaskById } from "@/server/repositories/tasks-repository";
import {
  getFocusDurationSeconds,
  getTimerSettings,
} from "@/server/services/timer-settings-service";
import { getServiceUserId } from "@/server/auth/service-user";

function addSeconds(date: Date, seconds: number) {
  return new Date(date.getTime() + seconds * 1000);
}

function secondsBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}

export function getRemainingSeconds(expectedEndAt: Date, now = new Date()) {
  return Math.max(
    0,
    Math.ceil((expectedEndAt.getTime() - now.getTime()) / 1000),
  );
}

export async function startFocusSession(taskId: string, now = new Date()) {
  const parsed = startFocusSessionSchema.parse({ taskId });
  const userId = await getServiceUserId();
  const activeSession = await getActiveFocusSession(userId);

  if (activeSession) {
    throw new Error("Já existe uma sessão de foco ativa.");
  }

  const task = await getTaskById(parsed.taskId, userId);

  if (!task || task.status === "completed" || task.status === "cancelled") {
    throw new Error("Tarefa inválida para iniciar foco.");
  }

  const settings = await getTimerSettings();
  const focusDurationSeconds = getFocusDurationSeconds(settings);

  return createFocusSession({
    userId,
    taskId: task.id,
    projectId: task.projectId,
    startedAt: now,
    expectedEndAt: addSeconds(now, focusDurationSeconds),
    plannedDurationSeconds: focusDurationSeconds,
  });
}

export async function getActiveFocusSessionDetails() {
  const userId = await getServiceUserId();

  return getActiveFocusSessionWithTask(userId);
}

export async function pauseFocusSession(id: string, now = new Date()) {
  const userId = await getServiceUserId();
  const session = await getFocusSessionById(id, userId);

  if (!session || session.status !== "active") {
    throw new Error("Sessão ativa não encontrada.");
  }

  return updateFocusSessionById(id, userId, {
    status: "paused",
    pausedAt: now,
  });
}

export async function resumeFocusSession(id: string, now = new Date()) {
  const userId = await getServiceUserId();
  const session = await getFocusSessionById(id, userId);

  if (!session || session.status !== "paused" || !session.pausedAt) {
    throw new Error("Sessão pausada não encontrada.");
  }

  const pauseSeconds = secondsBetween(session.pausedAt, now);

  return updateFocusSessionById(id, userId, {
    status: "active",
    pausedAt: null,
    resumedAt: now,
    expectedEndAt: addSeconds(session.expectedEndAt, pauseSeconds),
    accumulatedPauseSeconds:
      session.accumulatedPauseSeconds + pauseSeconds,
  });
}

export async function completeFocusSession(id: string, now = new Date()) {
  const userId = await getServiceUserId();
  const session = await getFocusSessionById(id, userId);

  if (!session || (session.status !== "active" && session.status !== "paused")) {
    throw new Error("Sessão em andamento não encontrada.");
  }

  const extraPauseSeconds =
    session.status === "paused" && session.pausedAt
      ? secondsBetween(session.pausedAt, now)
      : 0;
  const accumulatedPauseSeconds =
    session.accumulatedPauseSeconds + extraPauseSeconds;
  const focusedDurationSeconds = Math.min(
    session.plannedDurationSeconds,
    Math.max(0, secondsBetween(session.startedAt, now) - accumulatedPauseSeconds),
  );

  return updateFocusSessionById(id, userId, {
    status: "completed",
    completedAt: now,
    accumulatedPauseSeconds,
    focusedDurationSeconds,
  });
}

export async function cancelFocusSession(id: string, now = new Date()) {
  const userId = await getServiceUserId();
  const session = await getFocusSessionById(id, userId);

  if (!session || (session.status !== "active" && session.status !== "paused")) {
    throw new Error("Sessão em andamento não encontrada.");
  }

  return updateFocusSessionById(id, userId, {
    status: "cancelled",
    cancelledAt: now,
  });
}
