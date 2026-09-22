import { describe, expect, it } from "vitest";

import {
  archiveProjectSchema,
  createProjectSchema,
  updateProjectSchema,
} from "@/features/projects/schemas/project-schemas";

describe("project schemas", () => {
  it("normaliza descrição vazia para null ao criar", () => {
    const result = createProjectSchema.parse({
      name: " Produto ",
      description: "   ",
      color: "#974aaa",
    });

    expect(result).toEqual({
      name: "Produto",
      description: null,
      color: "#974aaa",
    });
  });

  it("rejeita nome vazio e cor inválida", () => {
    const result = createProjectSchema.safeParse({
      name: " ",
      description: "",
      color: "purple",
    });

    expect(result.success).toBe(false);
  });

  it("valida edição e arquivamento por uuid", () => {
    const id = "00000000-0000-4000-8000-000000000000";

    expect(
      updateProjectSchema.safeParse({
        id,
        name: "Projeto",
        description: "",
        color: "#1447e6",
      }).success,
    ).toBe(true);
    expect(archiveProjectSchema.safeParse({ id }).success).toBe(true);
    expect(archiveProjectSchema.safeParse({ id: "abc" }).success).toBe(false);
  });
});
