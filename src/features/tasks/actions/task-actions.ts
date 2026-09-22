"use server";

import { revalidatePath } from "next/cache";

import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "@/features/tasks/schemas/task-schemas";
import {
  cancelTask,
  completeTask,
  createTask,
  reopenTask,
  updateTask,
} from "@/server/services/tasks-service";
import type { TaskActionState } from "@/features/tasks/actions/task-action-state";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createTaskAction(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = createTaskSchema.safeParse({
    projectId: getStringValue(formData, "projectId"),
    title: getStringValue(formData, "title"),
    description: getStringValue(formData, "description"),
    priority: getStringValue(formData, "priority"),
    estimatedPomodoros: getStringValue(formData, "estimatedPomodoros"),
    dueDate: getStringValue(formData, "dueDate"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos da tarefa.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTask(parsed.data);
    revalidatePath("/tasks");

    return {
      status: "success",
      message: "Tarefa criada.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível criar.",
    };
  }
}

export async function updateTaskAction(
  _prevState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = updateTaskSchema.safeParse({
    id: getStringValue(formData, "id"),
    projectId: getStringValue(formData, "projectId"),
    title: getStringValue(formData, "title"),
    description: getStringValue(formData, "description"),
    priority: getStringValue(formData, "priority"),
    estimatedPomodoros: getStringValue(formData, "estimatedPomodoros"),
    dueDate: getStringValue(formData, "dueDate"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos da tarefa.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTask(parsed.data);
    revalidatePath("/tasks");

    return {
      status: "success",
      message: "Tarefa atualizada.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Não foi possível atualizar.",
    };
  }
}

async function runTaskTransition(
  formData: FormData,
  transition: (id: string) => Promise<unknown>,
) {
  const parsed = taskIdSchema.safeParse({
    id: getStringValue(formData, "id"),
  });

  if (!parsed.success) {
    return;
  }

  await transition(parsed.data.id);
  revalidatePath("/tasks");
}

export async function completeTaskAction(formData: FormData) {
  await runTaskTransition(formData, completeTask);
}

export async function cancelTaskAction(formData: FormData) {
  await runTaskTransition(formData, cancelTask);
}

export async function reopenTaskAction(formData: FormData) {
  await runTaskTransition(formData, reopenTask);
}
