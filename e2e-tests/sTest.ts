import { test } from "@playwright/test";
import { SERVER_URL } from "./url";
import { resetDatabase } from "./testApi";

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface STestFixtures {}

export const sTest = test.extend<STestFixtures>({
  baseURL: async ({}, use) => {
    await use(SERVER_URL);
  },
  page: async ({ page }, use) => {
    await use(page);
    await resetDatabase();
  },
});
