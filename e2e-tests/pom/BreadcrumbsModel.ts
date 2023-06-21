import { Page } from "@playwright/test";

export class BreadcrumbsModel {
  constructor(private readonly page: Page) {}

  public readonly locator = this.page.getByTestId("breadcrumbs");
  public readonly items = this.locator.getByTestId("breadcrumb");
}
