import { expect } from "@playwright/test";
import { sTest } from "../sTest";

sTest("smoke test", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const header = page.getByRole("link", { name: "Saituri 9000" });
  await expect(header).toBeVisible();

  const membersSection = page.locator("section").filter({ hasText: "Kaikki jäsenet" });
  const nameInput = membersSection.getByRole("textbox", { name: "Nimi" });
  await nameInput.fill("Testi Testinen");
  const addButton = membersSection.getByRole("button", { name: "Lisää jäsen" });
  await addButton.click();

  await expect(nameInput).toHaveValue("");

  const membersTable = membersSection.locator("table");
  const memberCell = membersTable.getByRole("cell", { name: "Testi Testinen" });
  await expect(memberCell).toBeVisible();
});

// The same test is copied 3 times, to test parallelism.
sTest("smoke test 2", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const header = page.getByRole("link", { name: "Saituri 9000" });
  await expect(header).toBeVisible();

  const membersSection = page.locator("section").filter({ hasText: "Kaikki jäsenet" });
  const nameInput = membersSection.getByRole("textbox", { name: "Nimi" });
  await nameInput.fill("Testi Testinen");
  const addButton = membersSection.getByRole("button", { name: "Lisää jäsen" });
  await addButton.click();

  await expect(nameInput).toHaveValue("");

  const membersTable = membersSection.locator("table");
  const memberCell = membersTable.getByRole("cell", { name: "Testi Testinen" });
  await expect(memberCell).toBeVisible();
});

sTest("smoke test 3", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const header = page.getByRole("link", { name: "Saituri 9000" });
  await expect(header).toBeVisible();

  const membersSection = page.locator("section").filter({ hasText: "Kaikki jäsenet" });
  const nameInput = membersSection.getByRole("textbox", { name: "Nimi" });
  await nameInput.fill("Testi Testinen");
  const addButton = membersSection.getByRole("button", { name: "Lisää jäsen" });
  await addButton.click();

  await expect(nameInput).toHaveValue("");

  const membersTable = membersSection.locator("table");
  const memberCell = membersTable.getByRole("cell", { name: "Testi Testinen" });
  await expect(memberCell).toBeVisible();
});

sTest("smoke test 4", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const header = page.getByRole("link", { name: "Saituri 9000" });
  await expect(header).toBeVisible();

  const membersSection = page.locator("section").filter({ hasText: "Kaikki jäsenet" });
  const nameInput = membersSection.getByRole("textbox", { name: "Nimi" });
  await nameInput.fill("Testi Testinen");
  const addButton = membersSection.getByRole("button", { name: "Lisää jäsen" });
  await addButton.click();

  await expect(nameInput).toHaveValue("");

  const membersTable = membersSection.locator("table");
  const memberCell = membersTable.getByRole("cell", { name: "Testi Testinen" });
  await expect(memberCell).toBeVisible();
});
