import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  async open(): Promise<void> {
    await this.page.goto('index.html');
  }

  async expectLoaded(): Promise<void> {
    await this.expectVisible('auth-form');
    await this.expectVisible('input-name');
  }

  async isVisible(): Promise<boolean> {
    return this.byTestId('auth-form').isVisible();
  }

  async createAccount(name: string): Promise<void> {
    await this.byTestId('input-name').fill(name);
    await this.byTestId('btn-register').click();
  }

  async switchMode(): Promise<void> {
    await this.byTestId('btn-switch-mode').click();
  }

  async login(name: string): Promise<void> {
    await this.byTestId('input-name').fill(name);
    await this.byTestId('btn-login').click();
  }

  async loginExisting(name: string): Promise<void> {
    await this.expectLoaded();
    const hasLoginButton = (await this.byTestId('btn-login').count()) > 0;
    if (!hasLoginButton) {
      await this.switchMode();
    }
    await this.login(name);
  }

  async expectValidationMessage(): Promise<void> {
    await expect(this.page.locator('[role="alert"]')).toBeVisible();
  }
}
