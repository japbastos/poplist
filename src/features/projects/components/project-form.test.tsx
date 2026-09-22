import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProjectForm } from "@/features/projects/components/project-form";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [
      {
        status: "idle",
        message: "",
      },
      vi.fn(),
      false,
    ],
  };
});

describe("ProjectForm", () => {
  it("renderiza campos acessíveis do formulário", () => {
    render(<ProjectForm />);

    expect(screen.getByLabelText("Nome")).toBeRequired();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Cor" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Salvar projeto" }),
    ).toBeInTheDocument();
  });
});
