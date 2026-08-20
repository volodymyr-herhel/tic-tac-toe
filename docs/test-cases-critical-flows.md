# Test Cases - Critical Flows

- Project: Tic-Tac-Toe single-page web app (`index.html`)
- Source Plan: `test-plan-critical-scenarios.md`
- Date: 2026-08-20
- Purpose: Provide separated, atomic, and easy-to-read test cases for all critical scenarios.

## General Notes

1. Execute tests with clean browser storage unless a precondition requires existing data.
2. For cases involving AI moves, assert outcome invariants instead of exact coordinates.
3. For destructive actions (clear history, delete account), verify both cancel and confirm paths.
4. Suggested severity mapping: P0 = blocker/critical, P1 = high, P2 = medium.

---

## Section A - Availability and Entry

## TC-A01 - App loads successfully

- Priority: P0
- Type: Functional / Smoke
- Preconditions: None
- Test Data: N/A

### Steps

1. Open the app URL in browser.

### Expected Results

1. Page renders without crash.
2. Welcome/onboarding view is visible.
3. Player-name input is visible.
4. Create Account and Login-entry actions are visible.

---

## TC-A02 - Account creation is blocked with empty name

- Priority: P0
- Type: Validation / Negative
- Preconditions: App is on onboarding view
- Test Data: Empty value

### Steps

1. Leave player name empty.
2. Click Create Account.

### Expected Results

1. Validation message appears.
2. User remains on onboarding view.
3. No account session is created.

---

## TC-A03 - Account creation trims and validates spaces-only input

- Priority: P1
- Type: Validation / Negative
- Preconditions: App is on onboarding view
- Test Data: "     " (spaces only)

### Steps

1. Enter spaces-only value in player name.
2. Click Create Account.

### Expected Results

1. Input is treated as empty after trim.
2. Validation message appears.
3. User is not logged in.

---

## Section B - Identity and Session Flow

## TC-B01 - Create account with valid name

- Priority: P0
- Type: Functional / Positive
- Preconditions: Onboarding view
- Test Data: Name = "Sara"

### Steps

1. Enter "Sara" in player-name field.
2. Click Create Account.

### Expected Results

1. User enters authenticated app shell.
2. Greeting includes "Sara".
3. Navigation tabs are visible (Play, Profile, History, Log Out).
4. Play board is accessible.

---

## TC-B02 - Login view opens from onboarding

- Priority: P1
- Type: Navigation
- Preconditions: Onboarding view
- Test Data: N/A

### Steps

1. Click "Already have an account? Log in".

### Expected Results

1. Login variant of onboarding is shown.
2. Primary action changes to Login.
3. Switch-back action to account creation is visible.

---

## TC-B03 - Login with unknown user shows error

- Priority: P0
- Type: Validation / Negative
- Preconditions: Login view open, unknown user does not exist
- Test Data: Name = "UnknownUser123"

### Steps

1. Enter "UnknownUser123".
2. Click Login.

### Expected Results

1. Clear error message appears (account not found).
2. User remains unauthenticated.
3. No navigation shell is shown.

---

## TC-B04 - Login with existing user succeeds

- Priority: P0
- Type: Functional / Positive
- Preconditions: Existing user account created (example: "Sara")
- Test Data: Name = "Sara"

### Steps

1. Open Login view.
2. Enter "Sara".
3. Click Login.

### Expected Results

1. User enters authenticated shell.
2. Greeting identifies the user.
3. Play view is available.

---

## TC-B05 - Logout returns to pre-auth state

- Priority: P0
- Type: Functional / Session
- Preconditions: User is logged in
- Test Data: N/A

### Steps

1. Click Log Out.

### Expected Results

1. User is returned to onboarding/login entry state.
2. Authenticated navigation is hidden.
3. No active game controls are shown.

---

## TC-B06 - Re-login preserves same account identity

- Priority: P1
- Type: Session / Data consistency
- Preconditions: Existing user account, currently logged out
- Test Data: Name = existing account name

### Steps

1. Open Login view.
2. Enter existing name.
3. Click Login.

### Expected Results

1. Login succeeds.
2. Greeting/initial matches expected user.
3. User-specific data (history/profile) is accessible.

---

## Section C - Navigation and Shell Integrity

## TC-C01 - Tab navigation works across Play/Profile/History

- Priority: P0
- Type: Navigation
- Preconditions: Logged in
- Test Data: N/A

### Steps

1. Click Profile tab.
2. Click History tab.
3. Click Play tab.
4. Repeat cycle once.

### Expected Results

1. Correct content appears for each tab.
2. No blank/intermediate broken view appears.
3. App does not log out unexpectedly.

---

## TC-C02 - User identity remains consistent across tabs

- Priority: P1
- Type: Consistency
- Preconditions: Logged in as known user
- Test Data: Name = "Sara"

### Steps

1. Open Play, note greeting/initial.
2. Open Profile, note greeting/initial.
3. Open History, note greeting/initial.

### Expected Results

1. Same user identity appears in all tabs.
2. No cross-user leakage or mismatch occurs.

---

## Section D - Gameplay Core

## TC-D01 - First user move places X on empty board

- Priority: P0
- Type: Functional / Game logic
- Preconditions: Logged in, new/empty board
- Test Data: Select any empty cell

### Steps

1. Click one empty cell.

### Expected Results

1. Clicked cell changes to X.
2. Cell becomes non-editable.
3. Turn status changes away from "Your turn".

---

## TC-D02 - Board locks while AI is thinking

- Priority: P0
- Type: Functional / State transition
- Preconditions: Immediately after user move
- Test Data: N/A

### Steps

1. Perform a user move.
2. During AI thinking status, attempt clicking another empty cell.

### Expected Results

1. Board is temporarily disabled for user input.
2. Additional click attempts are not accepted.
3. Status reflects AI-thinking state.

---

## TC-D03 - AI makes one O move and returns turn to user

- Priority: P0
- Type: Functional / Game logic
- Preconditions: After user move in active game
- Test Data: N/A

### Steps

1. Make one user move.
2. Wait for AI action completion.

### Expected Results

1. Exactly one new O appears.
2. Board returns to interactive state for user.
3. Status returns to "Your turn" (or localized equivalent).

---

## TC-D04 - Occupied cell cannot be overwritten

- Priority: P0
- Type: Functional / Negative
- Preconditions: At least one occupied cell exists
- Test Data: Occupied X or O cell

### Steps

1. Click an already occupied cell.

### Expected Results

1. Cell value does not change.
2. No additional move is registered.
3. Turn/order state remains valid.

---

## TC-D05 - User win ends game and locks board

- Priority: P0
- Type: Functional / Terminal state
- Preconditions: Active game where user can complete winning line
- Test Data: Move sequence creating user win

### Steps

1. Play moves to complete a valid user winning line.

### Expected Results

1. Win message appears.
2. Board becomes fully locked.
3. Hint button is disabled in terminal state.

---

## TC-D06 - Draw ends game and locks board

- Priority: P0
- Type: Functional / Terminal state
- Preconditions: Active game near draw outcome
- Test Data: Sequence resulting in no winner and full board

### Steps

1. Play until all cells are filled without winner.

### Expected Results

1. Draw message appears.
2. Board locks.
3. No further moves are accepted.

---

## TC-D07 - AI win is correctly indicated

- Priority: P1
- Type: Functional / Terminal state
- Preconditions: Active game where AI can win
- Test Data: Sequence allowing AI win

### Steps

1. Play moves that enable AI winning pattern.
2. Wait for AI final move.

### Expected Results

1. Lose message (from user perspective) appears.
2. Board locks.
3. Game result is stored correctly.

---

## TC-D08 - New Game starts clean board after terminal or mid-game state

- Priority: P1
- Type: Functional / Recovery
- Preconditions: Any active or finished game state
- Test Data: N/A

### Steps

1. Click New Game.

### Expected Results

1. Board resets to all empty cells.
2. Status shows initial turn for user.
3. Controls return to initial playable state.

---

## TC-D09 - Reset returns current game to initial state

- Priority: P1
- Type: Functional / Recovery
- Preconditions: In-progress game with at least one move
- Test Data: N/A

### Steps

1. Make one or more moves.
2. Click Reset.

### Expected Results

1. Current board clears.
2. Turn status returns to initial state.
3. No stale terminal/AI status remains.

---

## TC-D10 - Hint button availability follows game state

- Priority: P1
- Type: UX / State logic
- Preconditions: Active game
- Test Data: N/A

### Steps

1. Observe Hint availability on user turn.
2. Make a move and observe Hint during AI thinking.
3. Reach terminal state and observe Hint.

### Expected Results

1. Hint is enabled on valid user-turn states.
2. Hint is disabled during AI-thinking lock.
3. Hint is disabled in terminal state.

---

## TC-D11 - Difficulty selection persists for the current session

- Priority: P1
- Type: Functional / Config
- Preconditions: Logged in, Play view open
- Test Data: Difficulty = Easy, Medium, Hard

### Steps

1. Select Medium.
2. Start New Game and verify selected difficulty.
3. Select Hard.
4. Start New Game and verify selected difficulty.

### Expected Results

1. Chosen difficulty is reflected in selector.
2. New game uses selected difficulty setting.
3. History metadata later reflects selected difficulty.

---

## Section E - Data Integrity (History + Profile)

## TC-E01 - Completed game creates one History record

- Priority: P0
- Type: Data integrity
- Preconditions: Logged in, no concurrent game completion actions
- Test Data: Complete one game

### Steps

1. Finish one full game (win/lose/draw).
2. Open History tab.

### Expected Results

1. One new row exists for the completed game.
2. Row includes date/time, difficulty, result.
3. Data corresponds to actual game outcome.

---

## TC-E02 - History clear cancel keeps all records

- Priority: P1
- Type: Destructive action / Negative
- Preconditions: History has at least one row
- Test Data: N/A

### Steps

1. Click Clear History.
2. In confirm dialog, click Cancel/Dismiss.

### Expected Results

1. History rows remain unchanged.
2. No record deletion occurs.

---

## TC-E03 - History clear confirm removes all records

- Priority: P1
- Type: Destructive action / Positive
- Preconditions: History has at least one row
- Test Data: N/A

### Steps

1. Click Clear History.
2. Confirm deletion.

### Expected Results

1. All history rows are removed.
2. Empty-state message appears.

---

## TC-E04 - Profile stats reflect recorded outcomes

- Priority: P0
- Type: Data consistency
- Preconditions: Logged in with known baseline stats
- Test Data: Complete 1 win, 1 loss, 1 draw (or as feasible)

### Steps

1. Record baseline Profile counters.
2. Complete one game with known outcome.
3. Verify History row outcome.
4. Open Profile and verify counters.

### Expected Results

1. Relevant counter increments exactly once per game.
2. No unrelated counters change.
3. Profile counters are consistent with History aggregate.

---

## Section F - Profile and Account Deletion

## TC-F01 - Display name update succeeds

- Priority: P1
- Type: Functional
- Preconditions: Logged in, Profile tab open
- Test Data: Old name = "Sara", New name = "Lina"

### Steps

1. Replace display name with "Lina".
2. Click Save Changes.

### Expected Results

1. Save success feedback appears.
2. Greeting/initial updates to reflect new display name.
3. Name persists when navigating away and back to Profile.

---

## TC-F02 - Blank display name update is rejected

- Priority: P1
- Type: Validation / Negative
- Preconditions: Logged in, Profile tab open
- Test Data: Empty value

### Steps

1. Clear display-name input.
2. Click Save Changes.

### Expected Results

1. Save is blocked.
2. Validation error is shown.
3. Existing valid display name remains unchanged.

---

## TC-F03 - Delete account cancel keeps account and session

- Priority: P1
- Type: Destructive action / Negative
- Preconditions: Logged in, Profile tab open
- Test Data: Existing account

### Steps

1. Click Delete Account.
2. Cancel in confirmation dialog.

### Expected Results

1. Account is not deleted.
2. User remains logged in.
3. Profile and History data remain accessible.

---

## TC-F04 - Delete account confirm removes account and data

- Priority: P0
- Type: Destructive action / Positive
- Preconditions: Logged in, Profile tab open
- Test Data: Existing account with history data

### Steps

1. Click Delete Account.
2. Confirm deletion.
3. Attempt login using deleted account name.

### Expected Results

1. User is exited to pre-auth view.
2. Deleted account can no longer log in.
3. Related user data (profile/history) is not recoverable in UI.

---

## Section G - Global Settings and Localization

## TC-G01 - Language switch updates primary UI strings

- Priority: P1
- Type: Localization
- Preconditions: Any state (prefer logged in)
- Test Data: Toggle English <-> Persian

### Steps

1. Switch language to Persian.
2. Verify top-level labels and key actions.
3. Switch language back to English.
4. Verify labels again.

### Expected Results

1. Core controls and status messages update language.
2. Text remains readable and context-appropriate.
3. No broken placeholders or missing labels.

---

## TC-G02 - Theme toggle switches visual state and label

- Priority: P1
- Type: UX / Configuration
- Preconditions: Any state
- Test Data: Toggle Dark/Light

### Steps

1. Note current theme label and colors.
2. Click theme toggle.
3. Verify label and appearance changed.
4. Toggle again and verify return.

### Expected Results

1. Theme changes are visible immediately.
2. Theme label matches the active theme.
3. No layout break or unreadable contrast appears.

---

## TC-G03 - Difficulty value appears in game history metadata

- Priority: P1
- Type: Data integrity / Config
- Preconditions: Logged in
- Test Data: Difficulty = Medium or Hard

### Steps

1. Set difficulty to Medium.
2. Complete one game.
3. Open History and verify recorded difficulty.

### Expected Results

1. History row includes selected difficulty.
2. Difficulty value matches active game setting.

---

## Section H - Additional Critical Regression Checks

## TC-H01 - State survives tab switching during active game

- Priority: P1
- Type: Regression
- Preconditions: In-progress game exists
- Test Data: N/A

### Steps

1. Make one move in Play.
2. Switch to Profile.
3. Switch back to Play.

### Expected Results

1. In-progress board state is preserved.
2. Turn/order state remains valid.

---

## TC-H02 - App remains stable after repeated quick interactions

- Priority: P2
- Type: Stability
- Preconditions: Logged in
- Test Data: N/A

### Steps

1. Rapidly switch tabs 10 times.
2. Toggle theme 5 times.
3. Toggle language twice.

### Expected Results

1. No crash or frozen state occurs.
2. Final selected theme/language are applied correctly.

---

## TC-H03 - Keyboard accessibility on critical controls

- Priority: P2
- Type: Accessibility
- Preconditions: Any state
- Test Data: N/A

### Steps

1. Use Tab to navigate through controls.
2. Use Enter/Space to activate focused buttons.
3. Perform one move on board via keyboard if supported.

### Expected Results

1. Focus is visible and logical.
2. Core actions are operable by keyboard.
3. No keyboard trap is encountered.

---

## Execution Checklist (Quick)

1. Run all P0 first: A01, A02, B01, B03, B04, B05, C01, D01, D02, D03, D04, D05, D06, E01, E04, F04.
2. Run P1 set next for depth and reliability.
3. Run P2 set for robustness and accessibility confidence.

## Traceability Summary

1. SCN-A -> TC-A01..A03
2. SCN-B -> TC-B01..B06
3. SCN-C -> TC-C01..C02
4. SCN-D -> TC-D01..D11
5. SCN-E -> TC-E01..E04
6. SCN-F -> TC-F01..F04
7. SCN-G -> TC-G01..G03
