import { expect } from '@playwright/test';
import { Language } from '../constants/enums';
import { BasePage } from './BasePage';

export class AppShellPage extends BasePage {
  async expectAuthenticatedShell(): Promise<void> {
    await this.expectVisible('nav');
    await this.expectVisible('hello-user');
    await this.expectVisible('btn-logout');
  }

  async goToPlay(): Promise<void> {
    await this.byTestId('nav-play').click();
    await this.expectVisible('view-play');
  }

  async goToProfile(): Promise<void> {
    await this.byTestId('nav-profile').click();
    await this.expectVisible('view-profile');
  }

  async goToHistory(): Promise<void> {
    await this.byTestId('nav-history').click();
    await this.expectVisible('view-history');
  }

  async logout(): Promise<void> {
    await this.byTestId('btn-logout').click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.byTestId('auth-form')).toBeVisible();
  }

  async expectGreetingContains(name: string): Promise<void> {
    await expect(this.byTestId('hello-user')).toContainText(name);
  }

  async toggleLanguageTo(value: Language): Promise<void> {
    await this.byTestId('select-language').selectOption(value);
  }

  async toggleTheme(): Promise<void> {
    await this.byTestId('btn-theme').click();
  }
}
