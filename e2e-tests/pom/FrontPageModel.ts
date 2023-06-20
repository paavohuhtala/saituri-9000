import { Page, expect } from "@playwright/test";
import { MemberEditorModel } from "./MemberEditorModel";

export class FrontPageModel {
  constructor(private readonly page: Page) {}

  public readonly header = this.page.getByRole("link", { name: "Saituri 9000" });

  public readonly membersSection = this.page.locator("section").filter({ hasText: "Kaikki jäsenet" });
  public readonly membersTable = this.membersSection.locator("table");
  public readonly memberNames = this.membersTable.locator("td:nth-child(1)");

  public readonly nameInput = this.membersSection.getByRole("textbox", { name: "Nimi" });
  public readonly addButton = this.membersSection.getByRole("button", { name: "Lisää jäsen" });

  async goto() {
    await this.page.goto("/");
    await expect(this.header).toBeVisible();
  }

  async addMember(name: string) {
    await this.nameInput.fill(name);
    await this.addButton.click();
    await expect(this.nameInput).toHaveValue("");
  }

  async openMemberEditor(name: string): Promise<MemberEditorModel> {
    const memberRow = this.membersTable.locator("tr", { hasText: name });
    const editButton = memberRow.getByRole("link", { name: "Muokkaa" });
    await editButton.click();

    const memberEditor = new MemberEditorModel(this.page);
    await expect(memberEditor.locator).toBeVisible();
    return memberEditor;
  }
}
