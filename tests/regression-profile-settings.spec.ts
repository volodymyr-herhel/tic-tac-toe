import { annotateKnownIssue, annotateManualCase, expect, test } from './fixtures/testFixtures';
import { Difficulty, Language } from '../src/constants/enums';
import { users } from './helpers/testData';

test.describe('Regression - Profile and Settings', () => {
  test('[REG-F01]: Profile display name update persists in shell greeting', async ({ auth, shell, profile }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-F01',
      'Update profile display name and verify it is reflected in application shell.',
      ['regression', 'profile'],
    );

    await auth.createAccount(users.primary.name);
    await shell.goToProfile();
    await profile.expectLoaded();

    await profile.updateDisplayName(users.primary.renamed);
    await shell.goToPlay();
    await shell.expectGreetingContains(users.primary.renamed);
  });

  test('[REG-F03]: Delete account cancel keeps session active', async ({ auth, shell, profile }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-F03',
      'Canceling account deletion should retain account and active authenticated session.',
      ['regression', 'profile', 'negative'],
    );

    await auth.createAccount(users.primary.name);
    await shell.goToProfile();
    await profile.cancelDeleteAccount();
    await shell.expectAuthenticatedShell();
  });

  test('[REG-G01/REG-G02]: Language switch updates html lang and remains operable', async ({ auth, shell, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-G01/REG-G02',
      'Validate language toggles update application locale metadata for EN and FA.',
      ['regression', 'settings', 'localization'],
    );

    await auth.createAccount(users.primary.name);

    await shell.toggleLanguageTo(Language.Persian);
    await expect(page.locator('html')).toHaveAttribute('lang', Language.Persian);

    await shell.toggleLanguageTo(Language.English);
    await expect(page.locator('html')).toHaveAttribute('lang', Language.English);
  });

  test('[REG-G03]: Theme toggle updates html data-theme', async ({ auth, shell, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-G03',
      'Validate theme toggle changes page theme state using html data-theme attribute.',
      ['regression', 'settings'],
    );

    await auth.createAccount(users.primary.name);

    const before = await page.locator('html').getAttribute('data-theme');
    await shell.toggleTheme();
    const after = await page.locator('html').getAttribute('data-theme');

    expect(before).not.toBe(after);
    expect(['light', 'dark']).toContain(after);
  });

  test('[REG-G04]: Theme and language persist across reload', async ({ auth, shell, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-G04',
      'Validate theme/language selections persist across page reload for active session.',
      ['regression', 'settings', 'persistence'],
    );

    await auth.createAccount(users.primary.name);

    await shell.toggleLanguageTo(Language.Persian);
    await shell.toggleTheme();

    const themeBeforeReload = await page.locator('html').getAttribute('data-theme');
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('lang', Language.Persian);
    await expect(page.locator('html')).toHaveAttribute('data-theme', String(themeBeforeReload));
  });

  test('[REG-F02]: Blank profile name save shows validation feedback', async ({ auth, shell, profile, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-F02',
      'Attempt to save blank profile display name and verify validation error feedback.',
      ['regression', 'profile', 'validation', 'known-defect'],
    );
    annotateKnownIssue(
      testInfo,
      'ISSUE-002',
      'Blank profile name save lacks clear validation feedback.',
    );
    const runKnownDefects = process.env['RUN_KNOWN_DEFECTS'] === '1';
    if (!runKnownDefects) {
      test.fixme(true, 'Known defect ISSUE-002: excluded from default lane. Run test:defects to execute it.');
    }

    if (runKnownDefects) {
      test.fail(true, 'Known defect ISSUE-002: Blank name save does not show clear validation feedback.');
    }

    await auth.createAccount(users.primary.name);
    await shell.goToProfile();
    await profile.expectLoaded();

    // Get current name and then clear it
    await profile.clearDisplayName();

    // Attempt to save blank name
    await profile.clickSaveDisplayName();

    // Expect validation error to appear
    const errorLocator = page.locator('[data-testid="display-name-error"], .error, [role="alert"]');
    await expect(errorLocator).toBeVisible({ timeout: 2000 });
  });

  test('[REG-G05]: Localization applies to all UI strings', async ({ auth, shell, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-G05',
      'Verify that switching language localizes all UI strings including table column headers like "Created".',
      ['regression', 'settings', 'localization', 'known-defect'],
    );
    annotateKnownIssue(
      testInfo,
      'ISSUE-004',
      'Localization is partial: table column header "Created" remains in English when language is set to Persian.',
    );
    const runKnownDefects = process.env['RUN_KNOWN_DEFECTS'] === '1';
    if (!runKnownDefects) {
      test.fixme(true, 'Known defect ISSUE-004: excluded from default lane. Run test:defects to execute it.');
    }

    if (runKnownDefects) {
      test.fail(true, 'Known defect ISSUE-004: "Created" column header not localized to Persian.');
    }

    // Use page context to insert a game history entry directly so we have a table to check
    const { Difficulty: D, GameResult: GR } = await import('../src/constants/enums');
    const { appendHistoryEntry } = await import('./helpers/storage');
    
    await auth.createAccount(users.primary.name);
    await appendHistoryEntry(page, users.primary.name, D.Easy, GR.Loss);
    await page.reload();
    if (await auth.isVisible()) {
      await auth.loginExisting(users.primary.name);
    }

    // Switch to Persian BEFORE checking history
    await shell.toggleLanguageTo(Language.Persian);
    
    // Navigate to history to view table headers in Persian
    await shell.goToHistory();

    // Check if the history table header contains "Created" text (should be translated)
    const tableHeadersText = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('[data-testid="history-table"] th'));
      return headers.map((h) => h.textContent?.trim()).filter((t) => t);
    });

    console.log('Table headers found:', tableHeadersText);

    // If "Created" (English) is still in headers, that's ISSUE-004
    const hasEnglishCreated = tableHeadersText.some((text) => text?.toLowerCase().includes('created'));
    
    // This assertion expects false but should find true (confirming ISSUE-004)
    expect(hasEnglishCreated).toBe(false);
  });
});
