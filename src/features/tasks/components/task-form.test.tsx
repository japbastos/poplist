import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskForm } from "@/features/tasks/components/task-form";

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

describe("TaskForm", () => {
  it("renderiza campos acessíveis do formulário", () => {
    render(<TaskForm projects={[]} />);

    expect(screen.getByLabelText("Título")).toBeRequired();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Projeto")).toBeInTheDocument();
    expect(screen.getByLabelText("Prioridade")).toBeInTheDocument();
    expect(screen.getByLabelText("Pomodoros estimados")).toBeRequired();
    expect(screen.getByLabelText("Prazo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Salvar tarefa" }),
    ).toBeInTheDocument();
  });
});
