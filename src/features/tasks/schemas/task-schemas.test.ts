import { describe, expect, it } from "vitest";

import {
  createTaskSchema,
  listTasksFiltersSchema,
  updateTaskSchema,
} from "@/features/tasks/schemas/task-schemas";

describe("task schemas", () => {
  it("normaliza campos opcionais na criação", () => {
    const result = createTaskSchema.parse({
      projectId: "",
      title: " Tarefa ",
      description: " ",
      priority: "medium",
      estimatedPomodoros: "2",
      dueDate: "",
    });

    expect(result).toEqual({
      projectId: null,
      title: "Tarefa",
      description: null,
      priority: "medium",
      estimatedPomodoros: 2,
      dueDate: null,
    });
  });

  it("rejeita título vazio e estimativa inválida", () => {
    const result = createTaskSchema.safeParse({
      projectId: "",
      title: " ",
      description: "",
      priority: "medium",
      estimatedPomodoros: "0",
      dueDate: "",
    });

    expect(result.success).toBe(false);
  });

  it("valida edição e filtros", () => {
    const id = "00000000-0000-4000-8000-000000000000";

    expect(
      updateTaskSchema.safeParse({
        id,
        projectId: "",
        title: "Editar",
        description: "",
        priority: "high",
        estimatedPomodoros: "1",
        dueDate: "2026-08-07",
      }).success,
    ).toBe(true);
    expect(
      listTasksFiltersSchema.safeParse({
        status: "completed",
        projectId: "",
        search: "abc",
      }).success,
    ).toBe(true);
  });
});
