import { test } from "@playwright/test";
import { SERVER_URL } from "./url";
import { resetDatabase } from "./testApi";
import { FrontPageModel } from "./pom/FrontPageModel";

interface STestFixtures {
  frontPage: FrontPageModel;
}

export const sTest = test.extend<STestFixtures>({
  baseURL: async ({}, use) => {
    await use(SERVER_URL);
  },
  page: async ({ page }, use) => {
    await use(page);
    await resetDatabase();
  },
  frontPage: async ({ page }, use) => {
    const frontPage = new FrontPageModel(page);
    await use(frontPage);
  },
});
