import { expect } from "@playwright/test";
import { sTest } from "../sTest";

sTest("can load front page", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("link", { name: "Saituri 9000" });
  await expect(header).toBeVisible();
});
