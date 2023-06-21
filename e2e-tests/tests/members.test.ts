import { expect } from "@playwright/test";
import { sTest } from "../sTest";

sTest("can add members on front page", async ({ page, frontPage }) => {
  await frontPage.goto();
  await frontPage.addMember("Testi Testinen");

  await expect(frontPage.memberNames).toHaveText(["Testi Testinen"]);

  // Reload the page and check that the member is still there.
  await frontPage.goto();
  await page.waitForLoadState("networkidle");

  await expect(frontPage.memberNames).toHaveText(["Testi Testinen"]);

  // Add two more members and check that they are all there.
  await frontPage.addMember("Toinen Testinen");
  await frontPage.addMember("Kolmas Testinen");

  await expect(frontPage.memberNames).toHaveText(["Kolmas Testinen", "Toinen Testinen", "Testi Testinen"]);
});

sTest("can add a member and then modify their details", async ({ page, frontPage }) => {
  await frontPage.goto();
  await frontPage.addMember("Testi Testinen");
  let memberEditor = await frontPage.openMemberEditor("Testi Testinen");

  await expect(memberEditor.breadcrumbs.items).toHaveText(["Kaikki jäsenet", "Testi Testinen"]);

  await memberEditor.nameInput.fill("Kesti Testinen");
  // Breadcrumbs should not update until saving
  await expect(memberEditor.breadcrumbs.items).toHaveText(["Kaikki jäsenet", "Testi Testinen"]);
  await memberEditor.saveButton.click();

  await expect(frontPage.memberNames).toHaveText(["Kesti Testinen"]);

  // Reload and check that the changes are still there.
  await frontPage.goto();
  await page.waitForLoadState("networkidle");

  await expect(frontPage.memberNames).toHaveText(["Kesti Testinen"]);

  // Open the editor again and check that the changes are there, and then modify some more.
  memberEditor = await frontPage.openMemberEditor("Kesti Testinen");
  await expect(memberEditor.nameInput).toHaveValue("Kesti Testinen");
  await expect(memberEditor.breadcrumbs.items).toHaveText(["Kaikki jäsenet", "Kesti Testinen"]);

  await memberEditor.nameInput.fill("Kestävä Testinen");
  await memberEditor.phoneNumberInput.fill("123456789");
  await memberEditor.emailInput.fill("esimerkki@example.com");
  await memberEditor.saveButton.click();

  await expect(frontPage.memberNames).toHaveText(["Kestävä Testinen"]);

  // Open the editor one last time and check that the changes are there.
  memberEditor = await frontPage.openMemberEditor("Kestävä Testinen");
  await expect(memberEditor.nameInput).toHaveValue("Kestävä Testinen");
  await expect(memberEditor.phoneNumberInput).toHaveValue("123456789");
  await expect(memberEditor.emailInput).toHaveValue("esimerkki@example.com");
});

sTest("can't modify a member to have an empty name", async ({ frontPage }) => {
  await frontPage.goto();
  await frontPage.addMember("Testi Testinen");
  const memberEditor = await frontPage.openMemberEditor("Testi Testinen");

  await memberEditor.nameInput.fill("");

  await expect(memberEditor.saveButton).toBeDisabled();

  await memberEditor.nameInput.fill("Kesti Testinen");
  await memberEditor.saveButton.click();

  await expect(frontPage.memberNames).toHaveText(["Kesti Testinen"]);
});
