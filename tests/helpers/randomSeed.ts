import type { Page } from '@playwright/test';

export const DEFAULT_RANDOM_SEED = 123456789;

export async function reseedPageRandom(page: Page, seed = DEFAULT_RANDOM_SEED): Promise<void> {
  await page.evaluate((baseSeed) => {
    let currentSeed = baseSeed;
    Math.random = () => {
      currentSeed = (1664525 * currentSeed + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };
  }, seed);
}

export async function installDeterministicRandomOnInit(page: Page, seed = DEFAULT_RANDOM_SEED): Promise<void> {
  await page.addInitScript((initialSeed) => {
    let currentSeed = initialSeed;
    Math.random = () => {
      currentSeed = (1664525 * currentSeed + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };
  }, seed);
}
