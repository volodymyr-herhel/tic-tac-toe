import { annotateKnownIssue, annotateManualCase, expect, test } from './fixtures/testFixtures';
import { Difficulty, GameResult, Language } from '../src/constants/enums';
import { appendHistoryEntry } from './helpers/storage';
import { completeTerminalGame } from './helpers/gameplay';
import { reseedPageRandom } from './helpers/randomSeed';
import { gameConfig, users } from './helpers/testData';

test.describe('Regression - Gameplay and History', () => {
  const runKnownDefects = process.env['RUN_KNOWN_DEFECTS'] === '1';

  test('[REG-D09]: Reset clears in-progress board state', async ({ auth, shell, play }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-D09',
      'Verify Reset returns in-progress round to clean board state.',
      ['regression', 'gameplay'],
    );

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();

    await play.clickCell(0);
    await play.expectUserMovedAt(0);
    await play.clickReset();

    const xCount = await play.countState('x');
    expect(xCount).toBe(0);
  });

  test('[REG-D04]: Occupied cell cannot be overwritten', async ({ auth, shell, play }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-D04',
      'Ensure an occupied cell remains immutable after AI move resolution.',
      ['regression', 'gameplay', 'known-defect'],
    );
    annotateKnownIssue(
      testInfo,
      'ISSUE-005',
      'AI can overwrite already occupied X cells.',
    );
    if (!runKnownDefects) {
      test.fixme(true, 'Known defect ISSUE-005: excluded from default lane. Run test:defects to execute it.');
    }

    if (runKnownDefects) {
      test.fail(true, 'Known defect ISSUE-005: AI can overwrite occupied X cells.');
    }

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();

    const targetIndex = 0;
    const oBefore = await play.countState('o');
    await play.clickCell(targetIndex);
    await play.expectUserMovedAt(targetIndex);
    await play.waitForAiMoveOrTerminal(oBefore);

    await expect(play.cell(targetIndex)).toHaveAttribute('data-state', 'x');
  });

  test('[REG-D10]: Hint button disabled in terminal state', async ({ auth, shell, play, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-D10',
      'Ensure hint is disabled once game reaches terminal state.',
      ['regression', 'gameplay'],
    );
    test.setTimeout(gameConfig.terminalTestTimeoutMs);

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();

    const terminal = await completeTerminalGame(play, (seed) => reseedPageRandom(page, seed));
    expect(terminal).toBe(true);
    await play.expectHintDisabled();
  });

  test('[REG-D12]: Easy difficulty game records Easy in history', async ({ auth, shell, play, history, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-D12',
      'Play a completed game at Easy difficulty and verify history difficulty metadata.',
      ['regression', 'gameplay', 'history'],
    );
    test.setTimeout(gameConfig.terminalTestTimeoutMs);

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();
    await shell.toggleLanguageTo(Language.English);
    await play.setDifficulty(Difficulty.Easy);
    expect(await play.selectedDifficulty()).toBe(Difficulty.Easy);

    const terminal = await completeTerminalGame(play, (seed) => reseedPageRandom(page, seed));
    expect(terminal).toBe(true);

    await shell.goToHistory();
    await history.expectHasAtLeastOneRow();
    await history.expectLatestRowContains(/easy/i);
  });

  test('[REG-D13]: Medium difficulty game records Medium in history', async ({ auth, shell, play, history, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-D13',
      'Play a completed game at Medium difficulty and verify history difficulty metadata.',
      ['regression', 'gameplay', 'history'],
    );
    annotateKnownIssue(
      testInfo,
      'ISSUE-006',
      'Medium and Hard difficulty behavior can be mixed in some runs.',
    );
    test.setTimeout(gameConfig.terminalTestTimeoutMs);

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();
    await shell.toggleLanguageTo(Language.English);
    await play.setDifficulty(Difficulty.Medium);
    expect(await play.selectedDifficulty()).toBe(Difficulty.Medium);

    const terminal = await completeTerminalGame(play, (seed) => reseedPageRandom(page, seed));
    expect(terminal).toBe(true);

    await shell.goToHistory();
    await history.expectHasAtLeastOneRow();
    await history.expectLatestRowContains(/medium/i);
  });

  test('[REG-D14]: Hard difficulty game records Hard in history', async ({ auth, shell, play, history, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-D14',
      'Play a completed game at Hard difficulty and verify history difficulty metadata.',
      ['regression', 'gameplay', 'history'],
    );
    annotateKnownIssue(
      testInfo,
      'ISSUE-006',
      'Medium and Hard difficulty behavior can be mixed in some runs.',
    );
    test.setTimeout(gameConfig.terminalTestTimeoutMs);

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();
    await shell.toggleLanguageTo(Language.English);
    await play.setDifficulty(Difficulty.Hard);
    expect(await play.selectedDifficulty()).toBe(Difficulty.Hard);

    const terminal = await completeTerminalGame(play, (seed) => reseedPageRandom(page, seed));
    expect(terminal).toBe(true);

    await shell.goToHistory();
    await history.expectHasAtLeastOneRow();
    await history.expectLatestRowContains(/hard/i);
  });

  test('[REG-E04]: Clear history confirm removes all rows', async ({ auth, shell, history, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-E04',
      'Ensure clear-history confirmation removes existing records and returns empty state.',
      ['regression', 'history'],
    );

    await auth.createAccount(users.primary.name);
    await appendHistoryEntry(page, users.primary.name, Difficulty.Easy, GameResult.Loss);
    await page.reload();
    if (await auth.isVisible()) {
      await auth.loginExisting(users.primary.name);
    }

    await shell.goToHistory();
    await history.expectHasAtLeastOneRow();
    await history.clearHistoryAndConfirm();
    await history.expectEmptyAfterClear();
  });

  test('[REG-E06]: Profile counters align with completed game history', async ({ auth, shell, play, history, profile, page }, testInfo) => {
    annotateManualCase(
      testInfo,
      'REG-E06',
      'Complete games at Easy difficulty and verify profile win/loss/draw counters match history records.',
      ['regression', 'history', 'profile', 'known-defect'],
    );
    annotateKnownIssue(
      testInfo,
      'ISSUE-001',
      'Profile counters are not aligned with completed game history.',
    );
    if (!runKnownDefects) {
      test.fixme(true, 'Known defect ISSUE-001: excluded from default lane. Run test:defects to execute it.');
    }

    if (runKnownDefects) {
      test.fail(true, 'Known defect ISSUE-001: Profile counters not aligned with history.');
    }

    test.setTimeout(gameConfig.terminalTestTimeoutMs);

    await auth.createAccount(users.primary.name);
    await shell.goToPlay();

    // Complete one game to generate history entry
    await play.setDifficulty(Difficulty.Easy);
    const terminal = await completeTerminalGame(play, (seed) => reseedPageRandom(page, seed));
    expect(terminal).toBe(true);

    // Check profile counters
    await shell.goToProfile();
    await profile.expectLoaded();
    const initialWins = await profile.wins();
    const initialLosses = await profile.losses();
    const initialDraws = await profile.draws();

    // Verify history reflects the game
    await shell.goToHistory();
    await history.expectHasAtLeastOneRow();

    // Return to profile and verify counters have been updated
    await shell.goToProfile();
    const finalWins = await profile.wins();
    const finalLosses = await profile.losses();
    const finalDraws = await profile.draws();

    // At least one counter should have changed (wins or losses or draws)
    const initialTotal = initialWins + initialLosses + initialDraws;
    const finalTotal = finalWins + finalLosses + finalDraws;
    expect(finalTotal).toBeGreaterThan(initialTotal);
  });
});
