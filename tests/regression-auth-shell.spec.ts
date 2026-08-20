import { annotateManualCase, test } from './fixtures/testFixtures';
import { users } from './helpers/testData';

test.describe('Regression - Auth and Shell', () => {
  test('[REG-A01]: App loads to onboarding for fresh user', async ({ auth }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-A01',
      'Verify the application loads to onboarding with required entry controls for a fresh session.',
      ['regression', 'smoke', 'auth'],
    );

    await auth.expectLoaded();
  });

  test('[REG-B01]: Create account success path', async ({ auth, shell }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-B01',
      'Validate successful account creation with navigation to authenticated shell.',
      ['regression', 'auth'],
    );

    await auth.createAccount(users.primary.name);
    await shell.expectAuthenticatedShell();
  });

  test('[REG-B02]: Unknown account login fails with validation', async ({ auth }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-B02',
      'Ensure login with unknown user displays validation and does not authenticate.',
      ['regression', 'auth', 'negative'],
    );

    await auth.switchMode();
    await auth.login(users.unknown);
    await auth.expectValidationMessage();
  });

  test('[REG-C01]: Play tab renders board and controls', async ({ auth, shell, play }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-C01',
      'Verify Play view loads with board, status indicator, and game actions.',
      ['regression', 'navigation'],
    );

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();
    await play.expectReady();
    await play.expectHintEnabled();
  });

  test('[REG-B04]: Logout returns to pre-auth state', async ({ auth, shell }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-B04',
      'Verify logout transitions user from authenticated shell back to auth entry view.',
      ['regression', 'auth'],
    );

    await auth.createAccount(users.primary.name);
    await shell.logout();
    await shell.expectLoggedOut();
  });
});
