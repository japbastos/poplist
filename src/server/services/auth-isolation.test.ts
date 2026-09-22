import { beforeEach, describe, expect, it } from "vitest";

import {
  createProject,
  getProjectById,
  listActiveProjects,
} from "@/server/repositories/projects-repository";
import { createTask, getTaskById } from "@/server/repositories/tasks-repository";
import { createUser } from "@/server/repositories/auth-repository";
import { hashPassword } from "@/server/auth/password";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("auth data isolation", () => {
  it("não retorna projetos ou tarefas de outro usuário", async () => {
    const firstUser = await createUser({
      name: "Primeiro",
      email: "first@example.com",
      passwordHash: await hashPassword("password-1"),
    });
    const secondUser = await createUser({
      name: "Segundo",
      email: "second@example.com",
      passwordHash: await hashPassword("password-2"),
    });
    const project = await createProject({
      userId: firstUser.id,
      name: "Privado",
      color: "#974aaa",
    });
    const task = await createTask({
      userId: firstUser.id,
      projectId: project.id,
      title: "Tarefa privada",
    });

    await expect(getProjectById(project.id, secondUser.id)).resolves.toBeNull();
    await expect(getTaskById(task.id, secondUser.id)).resolves.toBeNull();
    await expect(listActiveProjects(secondUser.id)).resolves.toEqual([]);
  });
});
