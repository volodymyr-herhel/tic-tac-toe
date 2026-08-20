import type { Page } from '@playwright/test';
import { AuthPage } from '../../src/pages/AuthPage';
import { DEFAULT_RANDOM_SEED, installDeterministicRandomOnInit } from './randomSeed';

export async function bootstrapCleanApp(page: Page, seed = DEFAULT_RANDOM_SEED): Promise<void> {
  await installDeterministicRandomOnInit(page, seed);

  const auth = new AuthPage(page);
  await auth.open();
  await page.evaluate(() => localStorage.clear());
  await auth.open();
}
