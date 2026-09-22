import { expect, test } from "@playwright/test";

test("fluxo crítico do MVP", async ({ page }) => {
  const suffix = Date.now().toString();
  const projectName = `Projeto E2E ${suffix}`;
  const taskTitle = `Tarefa E2E ${suffix}`;

  await page.goto("/login");
  await page.getByLabel("E-mail").fill("local@poplist.dev");
  await page.getByLabel("Senha").fill("poplist-local");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Hoje" })).toBeVisible();

  await page.getByRole("link", { name: "Projetos" }).click();
  await page.getByRole("button", { name: "Novo projeto" }).first().click();
  await page.getByLabel("Nome").fill(projectName);
  await page.getByRole("button", { name: "Salvar projeto" }).click();
  await expect(page.getByText(projectName)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("link", { name: "Tarefas" }).click();
  await page.getByRole("button", { name: "Nova tarefa" }).first().click();
  await page.getByLabel("Título").fill(taskTitle);
  await page.getByLabel("Projeto", { exact: true }).selectOption({
    label: projectName,
  });
  await page.getByRole("button", { name: "Salvar tarefa" }).click();
  await expect(page.getByText(taskTitle)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("link", { name: "Hoje" }).click();
  await expect(page.getByRole("heading", { name: "Hoje" })).toBeVisible();
  await page.locator('select[name="taskId"]').selectOption({ label: taskTitle });
  await page.getByRole("button", { name: "Adicionar" }).click();
  await expect(page.getByRole("heading", { name: taskTitle })).toBeVisible();

  await page.getByRole("button", { name: "Iniciar foco" }).first().click();
  await expect(page).toHaveURL(/\/focus\?focus=started/);
  await expect(page.getByRole("heading", { name: "Foco" })).toBeVisible();
  await expect(page.getByRole("heading", { name: taskTitle })).toBeVisible();
});
