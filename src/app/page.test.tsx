import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "./page";

vi.mock("@/components/layout/server-app-shell", () => ({
  ServerAppShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Home", () => {
  it("renderiza a fundação da página inicial", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Planeje o dia sem perder o foco" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Começar por Hoje" })).toHaveAttribute(
      "href",
      "/today",
    );
  });
});
