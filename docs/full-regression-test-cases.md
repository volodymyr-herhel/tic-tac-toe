# Full Regression Test Cases

- Project: Tic-Tac-Toe SUT
- Last updated: 2026-08-20
- Purpose: Complete regression test-case catalog for functional and key non-functional coverage.

## Scope and Structure

This suite covers end-to-end behavior across:

1. Entry and onboarding
2. Authentication and session lifecycle
3. Core gameplay and state transitions
4. Profile and data integrity
5. History and destructive actions
6. Global settings (language/theme/difficulty)
7. Compatibility, accessibility, resilience, and regression safeguards

## Priority Model

1. P0: Release blockers
2. P1: High-value functional paths
3. P2: Extended and non-functional quality checks

---

## Module A - Entry and Onboarding

### REG-A01

- Priority: P0
- Title: App loads to onboarding for fresh user
- Preconditions: Empty local storage
- Steps:
1. Open app URL
- Expected:
1. Onboarding form visible
2. Name input and primary action present

### REG-A02

- Priority: P0
- Title: Empty name is rejected in create mode
- Preconditions: On onboarding create mode
- Steps:
1. Submit with blank name
- Expected:
1. Validation appears
2. User remains unauthenticated

### REG-A03

- Priority: P1
- Title: Spaces-only name is rejected
- Preconditions: On onboarding create mode
- Steps:
1. Enter spaces-only value
2. Submit
- Expected:
1. Trim-aware validation shown

### REG-A04

- Priority: P1
- Title: Login mode toggle changes primary action
- Preconditions: On onboarding
- Steps:
1. Toggle to login mode
- Expected:
1. Login action is visible
2. Switch-back CTA visible

### REG-A05

- Priority: P1
- Title: Create mode toggle restores register action
- Preconditions: On onboarding login mode
- Steps:
1. Toggle back to create mode
- Expected:
1. Register action restored

---

## Module B - Authentication and Session

### REG-B01

- Priority: P0
- Title: Create account success path
- Preconditions: No existing account with target name
- Steps:
1. Enter valid name
2. Register
- Expected:
1. Authenticated shell loaded
2. Greeting shows user name

### REG-B02

- Priority: P0
- Title: Login unknown account shows clear error
- Preconditions: Login mode, unknown account
- Steps:
1. Enter unknown name
2. Login
- Expected:
1. Not-found error shown
2. User remains on auth view

### REG-B03

- Priority: P0
- Title: Login known account succeeds
- Preconditions: Existing account created
- Steps:
1. Switch to login mode
2. Enter known user
3. Login
- Expected:
1. Authenticated shell shown

### REG-B04

- Priority: P0
- Title: Logout returns to auth screen
- Preconditions: User logged in
- Steps:
1. Click logout
- Expected:
1. Auth view shown
2. Protected navigation hidden

### REG-B05

- Priority: P1
- Title: Session identity preserved during tab navigation
- Preconditions: User logged in
- Steps:
1. Visit Play/Profile/History
- Expected:
1. Same greeting identity in all views

---

## Module C - Navigation and Layout

### REG-C01

- Priority: P0
- Title: Play tab renders board and controls
- Preconditions: Logged in
- Steps:
1. Open Play tab
- Expected:
1. Board, status, controls present

### REG-C02

- Priority: P1
- Title: Profile tab renders form and stats
- Preconditions: Logged in
- Steps:
1. Open Profile tab
- Expected:
1. Name input, save action, stats visible

### REG-C03

- Priority: P1
- Title: History tab renders empty state for new account
- Preconditions: Logged in with no completed games
- Steps:
1. Open History tab
- Expected:
1. Empty-state message shown

### REG-C04

- Priority: P2
- Title: No broken layout during rapid tab switching
- Preconditions: Logged in
- Steps:
1. Switch tabs quickly 10 times
- Expected:
1. No blank/overlap/crash state

---

## Module D - Core Gameplay

### REG-D01

- Priority: P0
- Title: First click on empty cell marks X
- Preconditions: New game
- Steps:
1. Click any empty cell
- Expected:
1. Cell state becomes X

### REG-D02

- Priority: P0
- Title: Occupied cell cannot be changed
- Preconditions: At least one occupied cell
- Steps:
1. Click occupied cell
- Expected:
1. No state change

### REG-D03

- Priority: P0
- Title: AI places one O after player move
- Preconditions: Active game after first X
- Steps:
1. Wait for AI turn completion
- Expected:
1. O count increases by one

### REG-D04

- Priority: P1
- Title: Board disables during AI thinking phase
- Preconditions: Just after X move
- Steps:
1. Attempt interaction while AI thinking
- Expected:
1. Input blocked until AI finishes

### REG-D05

- Priority: P0
- Title: Win terminal state recognized
- Preconditions: Reach winning line for user
- Steps:
1. Complete winning pattern
- Expected:
1. Win status appears
2. Board locks

### REG-D06

- Priority: P0
- Title: Lose terminal state recognized
- Preconditions: Reach AI winning line
- Steps:
1. Continue play until AI wins
- Expected:
1. Lose status appears
2. Board locks

### REG-D07

- Priority: P0
- Title: Draw terminal state recognized
- Preconditions: Fill board with no winner
- Steps:
1. Complete draw sequence
- Expected:
1. Draw status appears
2. Board locks

### REG-D08

- Priority: P1
- Title: New Game starts clean board
- Preconditions: In-progress or terminal game
- Steps:
1. Click New Game
- Expected:
1. Empty board
2. Initial status restored

### REG-D09

- Priority: P1
- Title: Reset restarts current round
- Preconditions: In-progress game
- Steps:
1. Click Reset
- Expected:
1. Current board cleared

### REG-D10

- Priority: P1
- Title: Hint enabled only when player can act
- Preconditions: Active game
- Steps:
1. Observe hint in player turn
2. Observe hint in AI turn and terminal
- Expected:
1. Enabled only in valid player-turn states

### REG-D11

- Priority: P1
- Title: Difficulty selector supports Easy/Medium/Hard
- Preconditions: Play tab loaded
- Steps:
1. Select each difficulty
- Expected:
1. Value updates correctly

### REG-D12

- Priority: P1
- Title: Easy difficulty game completion and history recording
- Preconditions: Logged in, Play tab open
- Steps:
1. Select difficulty = Easy
2. Complete one game
3. Open History
- Expected:
1. New history entry is created
2. Difficulty column shows Easy

### REG-D13

- Priority: P1
- Title: Medium difficulty game completion and history recording
- Preconditions: Logged in, Play tab open
- Steps:
1. Select difficulty = Medium
2. Complete one game
3. Open History
- Expected:
1. New history entry is created
2. Difficulty column shows Medium

### REG-D14

- Priority: P1
- Title: Hard difficulty game completion and history recording
- Preconditions: Logged in, Play tab open
- Steps:
1. Select difficulty = Hard
2. Complete one game
3. Open History
- Expected:
1. New history entry is created
2. Difficulty column shows Hard

---

## Module E - History and Persistence

### REG-E01

- Priority: P0
- Title: Completed game creates history record
- Preconditions: Logged in
- Steps:
1. Complete one game
2. Open History
- Expected:
1. At least one history row exists

### REG-E02

- Priority: P1
- Title: History row contains date, difficulty, result
- Preconditions: At least one completed game
- Steps:
1. Inspect latest history row
- Expected:
1. Required columns populated

### REG-E03

- Priority: P1
- Title: Clear history cancel keeps data
- Preconditions: History has rows
- Steps:
1. Trigger clear history
2. Cancel dialog
- Expected:
1. Rows remain

### REG-E04

- Priority: P1
- Title: Clear history confirm removes data
- Preconditions: History has rows
- Steps:
1. Trigger clear history
2. Confirm dialog
- Expected:
1. Rows removed
2. Empty-state shown

### REG-E05

- Priority: P1
- Title: History is user-scoped
- Preconditions: Two different accounts
- Steps:
1. Create game history for user A
2. Login as user B
- Expected:
1. User B should not see user A history

### REG-E06

- Priority: P2
- Title: Reload preserves persisted account/history state
- Preconditions: Existing account and history
- Steps:
1. Reload browser page
- Expected:
1. Persisted data remains consistent

---

## Module F - Profile and Account Management

### REG-F01

- Priority: P1
- Title: Profile name update succeeds with valid input
- Preconditions: Logged in
- Steps:
1. Update display name
2. Save
- Expected:
1. Success feedback
2. Shell greeting reflects new name

### REG-F02

- Priority: P1
- Title: Blank profile name save blocked
- Preconditions: Logged in, Profile open
- Steps:
1. Clear name
2. Save
- Expected:
1. Validation shown
2. Old value preserved

### REG-F03

- Priority: P0
- Title: Delete account cancel keeps account
- Preconditions: Logged in
- Steps:
1. Click delete account
2. Cancel dialog
- Expected:
1. Account/session intact

### REG-F04

- Priority: P0
- Title: Delete account confirm removes account
- Preconditions: Logged in
- Steps:
1. Click delete account
2. Confirm
3. Attempt login with deleted name
- Expected:
1. Account no longer available

### REG-F05

- Priority: P1
- Title: Profile counters align with history totals
- Preconditions: Account with mixed outcomes
- Steps:
1. Compare profile stats vs history aggregate
- Expected:
1. Values match

---

## Module G - Global Settings and Localization

### REG-G01

- Priority: P1
- Title: Language switch EN->FA updates core labels
- Preconditions: Any screen
- Steps:
1. Switch language to Persian
- Expected:
1. Core UI text in Persian

### REG-G02

- Priority: P1
- Title: Language switch FA->EN restores English labels
- Preconditions: Persian mode active
- Steps:
1. Switch language to English
- Expected:
1. Core UI text in English

### REG-G03

- Priority: P1
- Title: Theme toggle switches Dark/Light state
- Preconditions: Any screen
- Steps:
1. Toggle theme
- Expected:
1. Theme label and page theme updated

### REG-G04

- Priority: P2
- Title: Theme/language changes persist across reload
- Preconditions: Changed theme and language
- Steps:
1. Reload app
- Expected:
1. Previous selection is retained

### REG-G05

- Priority: P1
- Title: Localization applies to all user-visible strings
- Preconditions: App loaded, language switch available
- Steps:
1. Switch language to Persian
2. Review key shell/history/profile labels and static headers
3. Switch back to English and re-check the same labels
- Expected:
1. No leftover English static strings when Persian is active
2. Strings are fully restored when switched back to English

---

## Module H - Accessibility and Compatibility

### REG-H01

- Priority: P2
- Title: Keyboard navigation reaches all critical controls
- Preconditions: Any screen
- Steps:
1. Navigate with Tab and activate with Enter/Space
- Expected:
1. Controls operable without mouse

### REG-H02

- Priority: P2
- Title: Focus indicator visible on actionable controls
- Preconditions: Keyboard navigation in use
- Steps:
1. Tab through controls
- Expected:
1. Visible focus for each control

### REG-H03

- Priority: P2
- Title: Screen-reader role exposure for board cells
- Preconditions: Play tab open
- Steps:
1. Inspect ARIA/role metadata
- Expected:
1. Grid and gridcell semantics exposed

### REG-H04

- Priority: P2
- Title: Desktop browser compatibility
- Preconditions: Test matrix configured
- Steps:
1. Execute smoke on Chromium/Firefox/WebKit
- Expected:
1. Core flows pass on all three

### REG-H05

- Priority: P2
- Title: Mobile viewport compatibility
- Preconditions: Mobile projects configured
- Steps:
1. Execute smoke on mobile viewports
- Expected:
1. Layout and controls remain usable

---

## Module I - Stability and Regression Guards

### REG-I01

- Priority: P2
- Title: Repeated new-game cycles do not degrade state
- Preconditions: Logged in
- Steps:
1. Start and reset/new game repeatedly
- Expected:
1. No stuck or corrupted state

### REG-I02

- Priority: P2
- Title: Rapid settings toggling does not crash app
- Preconditions: Any screen
- Steps:
1. Toggle language and theme repeatedly
- Expected:
1. App remains responsive

### REG-I03

- Priority: P2
- Title: Long session with multiple completed games remains stable
- Preconditions: Logged in
- Steps:
1. Complete 10+ games in sequence
- Expected:
1. History and profile remain consistent

### REG-I04

- Priority: P2
- Title: Corrupt local storage fallback handling
- Preconditions: Manually inject malformed storage values
- Steps:
1. Reload app
- Expected:
1. App should fail gracefully and recover to usable state

---

## Regression Execution Packs

## Pack 1 - Release Gate (P0)

1. REG-A01, REG-A02
2. REG-B01, REG-B02, REG-B03, REG-B04
3. REG-C01
4. REG-D01, REG-D02, REG-D03, REG-D05, REG-D06, REG-D07
5. REG-E01
6. REG-F03, REG-F04

## Pack 2 - High Functional (P1)

1. All P1 tests across modules A-G

## Pack 3 - Extended (P2)

1. All P2 compatibility, accessibility, and resilience tests

## Automation Recommendation

1. Keep Pack 1 fully automated in CI.
2. Incrementally automate Pack 2 by risk/defect frequency.
3. Keep Pack 3 as hybrid (automation + exploratory/manual evidence).
