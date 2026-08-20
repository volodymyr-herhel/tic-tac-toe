import { expect } from '@playwright/test';
import { Timeouts } from '../constants/timeouts';
import { BasePage } from './BasePage';

export class HistoryPage extends BasePage {
  async expectLoaded(): Promise<void> {
    await this.expectVisible('view-history');
    await this.expectVisible('history-title');
  }

  async hasEmptyState(): Promise<boolean> {
    return this.byTestId('history-empty').isVisible();
  }

  async expectHasAtLeastOneRow(): Promise<void> {
    await expect
      .poll(async () => this.page.locator('[data-testid="history-table"] tbody tr').count(), {
        timeout: Timeouts.probeTimeout,
      })
      .toBeGreaterThan(0);
  }

  async rowCount(): Promise<number> {
    return this.page.locator('[data-testid="history-table"] tbody tr').count();
  }

  async latestRowText(): Promise<string> {
    const row = this.page.locator('[data-testid="history-table"] tbody tr').first();
    const text = await row.textContent();
    return (text ?? '').trim();
  }

  async expectLatestRowContains(text: RegExp): Promise<void> {
    await expect(this.page.locator('[data-testid="history-table"] tbody tr').first()).toContainText(text);
  }

  async clearHistoryAndConfirm(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.byTestId('btn-clear-history').click();
  }

  async expectEmptyAfterClear(): Promise<void> {
    await expect(this.byTestId('history-empty')).toBeVisible();
  }
}
