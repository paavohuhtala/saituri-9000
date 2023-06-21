import { Locator, Page } from "@playwright/test";
import { BreadcrumbsModel } from "./BreadcrumbsModel";

export class MemberEditorModel {
  constructor(private page: Page) {}

  public readonly breadcrumbs = new BreadcrumbsModel(this.page);

  public readonly locator = this.page.getByTestId("member-editor");
  public readonly nameInput = this.locator.getByRole("textbox", { name: "Nimi" });
  public readonly phoneNumberInput = this.locator.getByRole("textbox", { name: "Puhelinnumero" });
  public readonly emailInput = this.locator.getByRole("textbox", { name: "Sähköposti" });
  public readonly saveButton = this.locator.getByRole("button", { name: "Tallenna" });
}
