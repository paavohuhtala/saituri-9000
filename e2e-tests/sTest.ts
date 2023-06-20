import { test } from "@playwright/test";
import { SERVER_URL } from "./url";
import { resetDatabase } from "./testApiClient";
import { FrontPageModel } from "./pom/FrontPageModel";

interface STestFixtures {
  frontPage: FrontPageModel;
  logAndReset: void
}

export const sTest = test.extend<STestFixtures>({
  baseURL: async ({}, use) => {
    await use(SERVER_URL);
  },
  frontPage: async ({ page }, use) => {
    const frontPage = new FrontPageModel(page);
    await use(frontPage);
  },
  logAndReset: [async ({ page }, use, testInfo) => {
    // Add a cookie with the name of the test so we can access it in the server
    page.context().addCookies([{
      name: 'testName',
      value: testInfo.titlePath.join(" > "),
      httpOnly: true,
      sameSite: "Strict",
      domain: "localhost",
      path: "/",
    }])

    await use();

    // Wait for networkidle before resetting the database to ensure that all requests have been processed
    // - turns out DB queries might not succeed when the target database has been dropped
    // This is technically unnecessary, but it prevents unnecessary noise in the logs
    // This can be removed for a (hopefully) small performance boost
    await page.waitForLoadState("networkidle")
    await resetDatabase();
  }, { auto: true, scope: 'test' }]
});
