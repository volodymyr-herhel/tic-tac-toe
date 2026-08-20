# Test Plan - Critical Scenarios

- Project: Tic-Tac-Toe single-page web app (`index.html`)
- Version under test: current local build
- Date: 2026-08-20
- Plan Owner: Senior Test Engineer

## 1) Test Plan Objective

Design a concise but complete test strategy that covers all critical business and user-risk scenarios before automation. The plan prioritizes correctness of account flow, game logic, and data integrity across Profile/History/settings.

## 2) Scope

## In Scope (Critical)

1. App availability and first-load usability.
2. Account onboarding and login/logout lifecycle.
3. Authenticated navigation between core tabs.
4. Gameplay correctness and turn sequencing.
5. End-game outcomes and board state transitions.
6. History recording and destructive clear behavior.
7. Profile updates and account deletion safeguards.
8. Global controls: language, theme, difficulty.

## Out of Scope (for this stage)

1. Backend/API contract testing (none exposed).
2. Security penetration testing.
3. Deep performance/stress testing.
4. Visual snapshot regression pipeline.

## 3) Risk-Based Prioritization

## P0 (Release-blocking)

1. Cannot create/login account.
2. Core game cannot be played end-to-end.
3. Win/draw/lose terminal logic broken.
4. Data not recorded in History after completed games.
5. Account deletion fails or bypasses confirmation.

## P1 (High)

1. Profile update behaviors inconsistent.
2. History clear flow inconsistent with confirmation result.
3. Difficulty selector ignored.
4. Language/theme changes not applied consistently.
5. State corruption after logout/login cycle.

## P2 (Medium)

1. Minor copy inconsistencies in localization.
2. Minor UX deviations in status messaging timing.
3. Non-blocking layout/accessibility issues.

## 4) Test Design Strategy

1. Use risk-based scenario selection first, then expand by state matrix.
2. Validate each critical flow with positive and negative cases.
3. Verify cross-feature consistency (for example: Game result -> History row -> Profile counters, and language switch -> key labels/status messages).
4. Apply deterministic checks for board state transitions (Empty -> user move -> AI thinking lock -> AI move, and Active -> terminal -> locked board).
5. Prioritize deterministic assertions suitable for automation.

## 5) Critical Scenario Catalog (Step 2 Output)

The scenarios below are the minimum required critical coverage. They are intentionally separated and easy to read.

## A. Availability and Entry

1. SCN-A01: App loads and renders welcome screen.
2. SCN-A02: Empty-name submission is blocked on account creation.

## B. Identity and Session Flow

1. SCN-B01: Create account with valid name.
2. SCN-B02: Login existing account successfully.
3. SCN-B03: Login unknown account shows clear error.
4. SCN-B04: Logout returns to pre-auth state.
5. SCN-B05: Re-login preserves account identity.

## C. Navigation and Shell Integrity

1. SCN-C01: Play/Profile/History navigation is stable.
2. SCN-C02: Greeting/identity marker remains consistent across tabs.

## D. Gameplay Core

1. SCN-D01: User can place first X in empty board.
2. SCN-D02: Board locks while AI is thinking.
3. SCN-D03: AI places exactly one O and returns turn to user.
4. SCN-D04: Occupied cell cannot be overwritten.
5. SCN-D05: Win terminal state locks board.
6. SCN-D06: Draw terminal state locks board.
7. SCN-D07: Lose terminal state is correctly indicated.
8. SCN-D08: New Game initializes clean board.
9. SCN-D09: Reset returns current game to initial state.
10. SCN-D10: Hint availability is correct by game state.

## E. Data Integrity

1. SCN-E01: Completed game appears in History with date/difficulty/result.
2. SCN-E02: Clear History cancel keeps rows unchanged.
3. SCN-E03: Clear History confirm removes rows.
4. SCN-E04: Profile stats reflect game outcomes (wins/losses/draws).

## F. Profile and Destructive Actions

1. SCN-F01: Display name update succeeds and is reflected in shell.
2. SCN-F02: Blank display name is rejected (validation path).
3. SCN-F03: Delete account cancel keeps account.
4. SCN-F04: Delete account confirm removes account and related data.

## G. Global Settings and Localization

1. SCN-G01: Language switch updates core UI strings.
2. SCN-G02: Theme toggle applies expected visual state and label.
3. SCN-G03: Difficulty selection influences game session metadata/behavior.

## 6) Coverage Matrix (Critical vs Feature)

1. Onboarding/Auth: SCN-A02, SCN-B01..B05.
2. Game Engine Flow: SCN-D01..D10.
3. History: SCN-E01..E03.
4. Profile: SCN-F01..F04, SCN-E04.
5. Global Controls: SCN-G01..G03.

## 7) Entry and Exit Criteria

## Entry Criteria

1. App is launchable locally.
2. No blocker runtime errors prevent interaction.
3. Test environment baseline is known (clean/local storage state documented).

## Exit Criteria

1. 100% of P0 scenarios executed.
2. No open P0 defects.
3. P1 defects triaged with owner and disposition.
4. Test evidence captured for each scenario (pass/fail + notes).

## 8) Deliverables for Next Steps

1. Step 3: Convert each scenario (SCN-*) into atomic test cases with IDs, preconditions, steps, expected results.
2. Step 4: Automate P0 + selected P1 flows first (recommended tool in this repo: Playwright + TypeScript).
3. Optional notes: capture design rationale and trade-offs in a short architecture/testing-note document.

## 9) Timebox Guidance (3-day alignment)

1. Day 1: Baseline exploratory + finalize scenario list; draft full test cases and review.
2. Day 2: Automate P0 flows; stabilize selectors and test data handling.
3. Day 3: Add selected P1 automations; run regression pass and publish final report.

## 10) Assumptions and Constraints

1. App is front-end only with local persistence.
2. Game AI behavior may include non-deterministic move choices.
3. Automation should assert invariant outcomes, not exact AI coordinates unless controlled/mocked.
