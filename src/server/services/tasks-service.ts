import type {
  CreateTaskInput,
  ListTasksFiltersInput,
  UpdateTaskInput,
} from "@/features/tasks/schemas/task-schemas";
import { getProjectById } from "@/server/repositories/projects-repository";
import { getServiceUserId } from "@/server/auth/service-user";
import {
  createTask as insertTask,
  getTaskById,
  listTasksByFilters,
  updateTaskById,
} from "@/server/repositories/tasks-repository";

async function ensureActiveProject(projectId: string | null, userId: string) {
  if (!projectId) {
    return;
  }

  const project = await getProjectById(projectId, userId);

  if (!project || project.status !== "active") {
    throw new Error("Projeto selecionado não existe ou está arquivado.");
  }
}

export async function createTask(input: CreateTaskInput) {
  const userId = await getServiceUserId();
  await ensureActiveProject(input.projectId, userId);

  return insertTask({
    userId,
    projectId: input.projectId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    estimatedPomodoros: input.estimatedPomodoros,
    dueDate: input.dueDate,
  });
}

export async function listTasks(filters: ListTasksFiltersInput = {}) {
  const userId = await getServiceUserId();

  return listTasksByFilters({
    userId,
    status: filters.status,
    projectId: filters.projectId ?? undefined,
    search: filters.search,
  });
}

export async function getTask(id: string) {
  const userId = await getServiceUserId();

  return getTaskById(id, userId);
}

export async function updateTask(input: UpdateTaskInput) {
  const userId = await getServiceUserId();
  const currentTask = await getTaskById(input.id, userId);

  if (!currentTask) {
    throw new Error("Tarefa não encontrada.");
  }

  await ensureActiveProject(input.projectId, userId);

  const task = await updateTaskById(input.id, userId, {
    projectId: input.projectId,
    title: input.title,
    description: input.description,
    priority: input.priority,
    estimatedPomodoros: input.estimatedPomodoros,
    dueDate: input.dueDate,
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  return task;
}

export async function completeTask(id: string) {
  const userId = await getServiceUserId();
  const task = await updateTaskById(id, userId, {
    status: "completed",
    completedAt: new Date(),
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  return task;
}

export async function cancelTask(id: string) {
  const userId = await getServiceUserId();
  const task = await updateTaskById(id, userId, {
    status: "cancelled",
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  return task;
}

export async function reopenTask(id: string) {
  const userId = await getServiceUserId();
  const task = await updateTaskById(id, userId, {
    status: "pending",
    completedAt: null,
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  return task;
}
