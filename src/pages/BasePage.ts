import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected byTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  async expectVisible(testId: string): Promise<void> {
    await expect(this.byTestId(testId)).toBeVisible();
  }
}
