import { expect, test as base, type TestInfo } from '@playwright/test';
import { AppShellPage } from '../../src/pages/AppShellPage';
import { AuthPage } from '../../src/pages/AuthPage';
import { HistoryPage } from '../../src/pages/HistoryPage';
import { PlayPage } from '../../src/pages/PlayPage';
import { ProfilePage } from '../../src/pages/ProfilePage';
import { bootstrapCleanApp } from '../helpers/testSetup';

type Fixtures = {
  auth: AuthPage;
  shell: AppShellPage;
  play: PlayPage;
  history: HistoryPage;
  profile: ProfilePage;
};

export const test = base.extend<Fixtures>({
  auth: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  shell: async ({ page }, use) => {
    await use(new AppShellPage(page));
  },
  play: async ({ page }, use) => {
    await use(new PlayPage(page));
  },
  history: async ({ page }, use) => {
    await use(new HistoryPage(page));
  },
  profile: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  page: async ({ page }, use) => {
    await bootstrapCleanApp(page);
    await use(page);
  },
});

export { expect };

export function annotateManualCase(
  testInfo: TestInfo,
  manualId: string,
  description: string,
  tags: string[] = [],
): void {
  testInfo.annotations.push({
    type: 'manual-case',
    description: `${manualId}: ${description}`,
  });

  const priorityMatch = testInfo.title.match(/\bP[0-2]\b/i);
  if (priorityMatch) {
    testInfo.annotations.push({
      type: 'tag',
      description: priorityMatch[0].toLowerCase(),
    });
  }

  for (const tag of tags) {
    testInfo.annotations.push({
      type: 'tag',
      description: tag,
    });
  }
}

export function annotateKnownIssue(
  testInfo: TestInfo,
  issueId: string,
  description: string,
): void {
  testInfo.annotations.push({
    type: 'known-issue',
    description: `${issueId}: ${description}`,
  });

  testInfo.annotations.push({
    type: 'tag',
    description: 'known-issue',
  });

  testInfo.annotations.push({
    type: 'tag',
    description: issueId.toLowerCase(),
  });
}
