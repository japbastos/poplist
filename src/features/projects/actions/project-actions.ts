"use server";

import { revalidatePath } from "next/cache";

import {
  archiveProjectSchema,
  createProjectSchema,
  updateProjectSchema,
} from "@/features/projects/schemas/project-schemas";
import {
  archiveProject,
  createProject,
  updateProject,
} from "@/server/services/projects-service";
import type { ProjectActionState } from "@/features/projects/actions/project-action-state";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const parsed = createProjectSchema.safeParse({
    name: getStringValue(formData, "name"),
    description: getStringValue(formData, "description"),
    color: getStringValue(formData, "color"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos do projeto.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createProject(parsed.data);
    revalidatePath("/projects");

    return {
      status: "success",
      message: "Projeto criado.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível criar.",
    };
  }
}

export async function updateProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const parsed = updateProjectSchema.safeParse({
    id: getStringValue(formData, "id"),
    name: getStringValue(formData, "name"),
    description: getStringValue(formData, "description"),
    color: getStringValue(formData, "color"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos do projeto.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateProject(parsed.data);
    revalidatePath("/projects");

    return {
      status: "success",
      message: "Projeto atualizado.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Não foi possível atualizar.",
    };
  }
}

export async function archiveProjectAction(formData: FormData) {
  const parsed = archiveProjectSchema.safeParse({
    id: getStringValue(formData, "id"),
  });

  if (!parsed.success) {
    return;
  }

  await archiveProject(parsed.data.id);
  revalidatePath("/projects");
}
