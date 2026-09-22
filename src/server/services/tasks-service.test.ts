import { beforeEach, describe, expect, it } from "vitest";

import { createProject, archiveProject } from "@/server/services/projects-service";
import {
  cancelTask,
  completeTask,
  createTask,
  listTasks,
  reopenTask,
  updateTask,
} from "@/server/services/tasks-service";
import { truncateTestDatabase } from "@/test/database";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("tasks service", () => {
  it("cria tarefa sem projeto e com projeto ativo", async () => {
    const project = await createProject({
      name: "Projeto",
      description: null,
      color: "#974aaa",
    });

    const taskWithoutProject = await createTask({
      projectId: null,
      title: "Avulsa",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });
    const taskWithProject = await createTask({
      projectId: project.id,
      title: "Com projeto",
      description: null,
      priority: "high",
      estimatedPomodoros: 2,
      dueDate: "2026-08-07",
    });

    expect(taskWithoutProject.projectId).toBeNull();
    expect(taskWithProject.projectId).toBe(project.id);
    await expect(listTasks({ projectId: project.id })).resolves.toHaveLength(1);
  });

  it("rejeita vínculo com projeto arquivado", async () => {
    const project = await createProject({
      name: "Arquivado",
      description: null,
      color: "#974aaa",
    });

    await archiveProject(project.id);

    await expect(
      createTask({
        projectId: project.id,
        title: "Inválida",
        description: null,
        priority: "medium",
        estimatedPomodoros: 1,
        dueDate: null,
      }),
    ).rejects.toThrow("Projeto selecionado não existe ou está arquivado.");
  });

  it("conclui, cancela e reabre tarefa", async () => {
    const task = await createTask({
      projectId: null,
      title: "Transição",
      description: null,
      priority: "medium",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    const completed = await completeTask(task.id);
    expect(completed.status).toBe("completed");
    expect(completed.completedAt).toBeInstanceOf(Date);

    const reopened = await reopenTask(task.id);
    expect(reopened.status).toBe("pending");
    expect(reopened.completedAt).toBeNull();

    const cancelled = await cancelTask(task.id);
    expect(cancelled.status).toBe("cancelled");
  });

  it("edita e filtra por busca/status", async () => {
    const task = await createTask({
      projectId: null,
      title: "Escrever relatório",
      description: null,
      priority: "low",
      estimatedPomodoros: 1,
      dueDate: null,
    });

    await updateTask({
      id: task.id,
      projectId: null,
      title: "Escrever relatório semanal",
      description: "Resumo",
      priority: "high",
      estimatedPomodoros: 3,
      dueDate: "2026-08-07",
    });

    await expect(
      listTasks({ search: "semanal", status: "pending" }),
    ).resolves.toHaveLength(1);
  });
});
