import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  async expectLoaded(): Promise<void> {
    await this.expectVisible('view-profile');
    await this.expectVisible('input-profile-name');
    await this.expectVisible('btn-save-profile');
  }

  async updateDisplayName(name: string): Promise<void> {
    await this.byTestId('input-profile-name').fill(name);
    await this.byTestId('btn-save-profile').click();
  }

  async displayNameValue(): Promise<string> {
    return this.byTestId('input-profile-name').inputValue();
  }

  async wins(): Promise<number> {
    const value = await this.byTestId('profile-wins').textContent();
    return Number(value ?? '0');
  }

  async losses(): Promise<number> {
    const value = await this.byTestId('profile-losses').textContent();
    return Number(value ?? '0');
  }

  async draws(): Promise<number> {
    const value = await this.byTestId('profile-draws').textContent();
    return Number(value ?? '0');
  }

  async confirmDeleteAccount(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.byTestId('btn-delete-account').click();
  }

  async cancelDeleteAccount(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.dismiss());
    await this.byTestId('btn-delete-account').click();
    await expect(this.byTestId('view-profile')).toBeVisible();
  }

  async clearDisplayName(): Promise<void> {
    await this.byTestId('input-profile-name').fill('');
  }

  async clickSaveDisplayName(): Promise<void> {
    await this.byTestId('btn-save-profile').click();
  }
}
