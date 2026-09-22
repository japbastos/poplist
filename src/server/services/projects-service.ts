import {
  archiveProjectById,
  createProject as insertProject,
  getActiveProjectByName,
  getAnotherActiveProjectByName,
  getProjectById,
  listActiveProjects,
  updateProjectById,
} from "@/server/repositories/projects-repository";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/features/projects/schemas/project-schemas";
import { getServiceUserId } from "@/server/auth/service-user";

export async function createProject(input: CreateProjectInput) {
  const userId = await getServiceUserId();
  const duplicatedProject = await getActiveProjectByName(input.name, userId);

  if (duplicatedProject) {
    throw new Error("Já existe um projeto ativo com esse nome.");
  }

  return insertProject({
    userId,
    name: input.name,
    description: input.description,
    color: input.color,
  });
}

export async function listProjects() {
  const userId = await getServiceUserId();

  return listActiveProjects(userId);
}

export async function getProject(id: string) {
  const userId = await getServiceUserId();

  return getProjectById(id, userId);
}

export async function updateProject(input: UpdateProjectInput) {
  const userId = await getServiceUserId();
  const currentProject = await getProjectById(input.id, userId);

  if (!currentProject) {
    throw new Error("Projeto não encontrado.");
  }

  if (currentProject.status === "archived") {
    throw new Error("Projeto arquivado não pode ser editado.");
  }

  const duplicatedProject = await getAnotherActiveProjectByName(
    input.id,
    input.name,
    userId,
  );

  if (duplicatedProject) {
    throw new Error("Já existe um projeto ativo com esse nome.");
  }

  const project = await updateProjectById(input.id, userId, {
    name: input.name,
    description: input.description,
    color: input.color,
  });

  if (!project) {
    throw new Error("Projeto não encontrado.");
  }

  return project;
}

export async function archiveProject(id: string) {
  const userId = await getServiceUserId();
  const currentProject = await getProjectById(id, userId);

  if (!currentProject) {
    throw new Error("Projeto não encontrado.");
  }

  if (currentProject.status === "archived") {
    return currentProject;
  }

  const project = await archiveProjectById(id, userId);

  if (!project) {
    throw new Error("Projeto não encontrado.");
  }

  return project;
}
