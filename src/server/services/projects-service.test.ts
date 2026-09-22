import { beforeEach, describe, expect, it } from "vitest";

import {
  archiveProject,
  createProject,
  listProjects,
  updateProject,
} from "@/server/services/projects-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("projects service", () => {
  it("cria, lista e edita projetos ativos", async () => {
    const project = await createProject({
      name: "Produto",
      description: null,
      color: "#974aaa",
    });

    await expect(listProjects()).resolves.toHaveLength(1);

    const updated = await updateProject({
      id: project.id,
      name: "Produto atualizado",
      description: "Roadmap",
      color: "#1447e6",
    });

    expect(updated).toMatchObject({
      id: project.id,
      name: "Produto atualizado",
      description: "Roadmap",
      color: "#1447e6",
    });
  });

  it("arquiva projeto e remove da listagem padrão", async () => {
    const project = await createProject({
      name: "Arquivo",
      description: null,
      color: "#974aaa",
    });

    const archived = await archiveProject(project.id);

    expect(archived.status).toBe("archived");
    expect(archived.archivedAt).toBeInstanceOf(Date);
    await expect(listProjects()).resolves.toHaveLength(0);
  });

  it("impede edição de projeto arquivado", async () => {
    const project = await createProject({
      name: "Não editar",
      description: null,
      color: "#974aaa",
    });

    await archiveProject(project.id);

    await expect(
      updateProject({
        id: project.id,
        name: "Tentativa",
        description: null,
        color: "#974aaa",
      }),
    ).rejects.toThrow("Projeto arquivado não pode ser editado.");
  });

  it("impede nomes duplicados entre projetos ativos", async () => {
    const project = await createProject({
      name: "Duplicado",
      description: null,
      color: "#974aaa",
    });

    await expect(
      createProject({
        name: "duplicado",
        description: null,
        color: "#1447e6",
      }),
    ).rejects.toThrow("Já existe um projeto ativo com esse nome.");

    await archiveProject(project.id);

    await expect(
      createProject({
        name: "Duplicado",
        description: null,
        color: "#1447e6",
      }),
    ).resolves.toMatchObject({
      name: "Duplicado",
    });
  });
});
