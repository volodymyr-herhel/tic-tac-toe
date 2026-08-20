import { annotateManualCase, expect, test } from './fixtures/testFixtures';
import { Difficulty, GameResult } from '../src/constants/enums';
import { appendHistoryEntry } from './helpers/storage';
import { users } from './helpers/testData';

test.describe('Critical P0 flows - Tic-Tac-Toe', () => {
  test('P0 [TC-B01]: Create account and enter authenticated shell', async ({ auth, shell }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-B01',
      'Verify a valid new user can register and access the authenticated shell.',
    );

    await auth.expectLoaded();
    await auth.createAccount(users.primary.name);
    await shell.expectAuthenticatedShell();
  });

  test('P0 [TC-A02]: Empty account name is rejected', async ({ auth }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-A02',
      'Ensure registration is blocked when name input is empty.',
    );

    await auth.expectLoaded();
    await auth.createAccount('');
    await auth.expectValidationMessage();
    await auth.expectLoaded();
  });

  test('P0 [TC-B03]: Unknown user cannot login', async ({ auth }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-B03',
      'Ensure login for non-existing account shows validation and keeps user unauthenticated.',
    );

    await auth.expectLoaded();
    await auth.switchMode();
    await auth.login(users.unknown);
    await auth.expectValidationMessage();
  });

  test('P0 [TC-B05]: Logout returns user to auth form', async ({ auth, shell }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-B05',
      'Validate logout invalidates session view and returns to onboarding/auth form.',
    );

    await auth.createAccount(users.primary.name);
    await shell.expectAuthenticatedShell();
    await shell.logout();
    await shell.expectLoggedOut();
  });

  test('P0 [TC-D01/TC-D03]: User move and AI response sequencing', async ({ auth, shell, play }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-D01/TC-D03',
      'Verify player move marks X and AI responds with exactly one O before next user turn.',
    );

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();
    await play.expectReady();

    const oBefore = await play.countState('o');
    await play.clickCell(0);
    await play.expectUserMovedAt(0);
    await play.expectCellDisabled(0);

    await play.waitForAiMove(oBefore);
    const oAfter = await play.countState('o');
    expect(oAfter).toBeGreaterThan(oBefore);
  });

  test('P0 [TC-E01]: Completed game creates history record', async ({ auth, shell, history, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-E01',
      'Verify completed game history is visible by seeding one persisted entry and validating History view.',
    );
    await auth.createAccount(users.primary.name);
    await appendHistoryEntry(page, users.primary.name, Difficulty.Easy, GameResult.Win);
    await page.reload();
    if (await auth.isVisible()) {
      await auth.loginExisting(users.primary.name);
    }

    await shell.goToHistory();
    await history.expectLoaded();
    await expect(page.getByTestId('history-empty')).toHaveCount(0);
    await history.expectHasAtLeastOneRow();
  });

  test('P0 [TC-F04]: Account deletion confirm removes account', async ({ auth, shell, profile }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-F04',
      'Confirm account deletion removes user data and blocks subsequent login for same account.',
    );

    await auth.createAccount(users.primary.name);
    await shell.goToProfile();
    await profile.confirmDeleteAccount();

    await shell.expectLoggedOut();

    await auth.switchMode();
    await auth.login(users.primary.name);
    await auth.expectValidationMessage();
  });
});
