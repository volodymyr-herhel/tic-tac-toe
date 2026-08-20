import { annotateManualCase, test } from './fixtures/testFixtures';
import { users } from './helpers/testData';

test.describe('E2E User Journey', () => {
  test('E2E [J01]: New user can onboard, play, personalize, and exit session', async ({ auth, shell, play, profile }, testInfo) => {
    annotateManualCase(
      testInfo,
      'TC-B01/TC-D01/TC-F01/TC-B05',
      'Validate a realistic user journey: onboarding, gameplay interaction, profile update, and logout.',
      ['e2e', 'journey', 'smoke'],
    );

    await auth.expectLoaded();
    await auth.createAccount(users.primary.name);
    await shell.expectAuthenticatedShell();

    await shell.goToPlay();
    await play.expectReady();

    const oBefore = await play.countState('o');
    await play.clickCell(0);
    await play.expectUserMovedAt(0);
    await play.waitForAiMoveOrTerminal(oBefore);

    await shell.goToProfile();
    await profile.expectLoaded();
    await profile.updateDisplayName(users.primary.renamed);

    await shell.goToPlay();
    await shell.expectGreetingContains(users.primary.renamed);

    await shell.logout();
    await shell.expectLoggedOut();
  });
});
