# Automation Implementation Notes (Step 4)

## Stack Chosen

- Framework: Playwright
- Language: TypeScript
- Pattern: POM (Page Object Model)

## Design Principles Applied

- KISS: keep selectors testid-first and assertions outcome-focused.
- SOLID-oriented structure: specs use page abstractions and fixtures, not raw selector duplication.
- Maintainability: constants, helpers, fixtures, and page objects are separated by responsibility.

## Implemented Artifacts

- Configuration
	- `playwright.config.ts` (Chromium-focused local execution, HTML + line + Allure reporters)

- SUT packaging
	- `app/index.html` (local SUT copy for deterministic file-based execution)

- Page objects
	- `src/pages/BasePage.ts`
	- `src/pages/AuthPage.ts`
	- `src/pages/AppShellPage.ts`
	- `src/pages/PlayPage.ts`
	- `src/pages/HistoryPage.ts`
	- `src/pages/ProfilePage.ts`

- Constants
	- `src/constants/enums.ts` (`Language`, `Difficulty`, `GameResult`)

- Helpers
	- `tests/helpers/testSetup.ts` (deterministic bootstrap + clean storage)
	- `tests/helpers/testData.ts` (scenario and user constants)
	- `tests/helpers/randomizer.ts` (collision-safe random usernames)
	- `tests/helpers/storage.ts` (deterministic seeded history entries)

- Fixtures
	- `tests/fixtures/testFixtures.ts` (`auth`, `shell`, `play`, `history`, `profile` fixtures + manual-case annotation helper)

- Spec files
	- `tests/critical-flows.spec.ts` (critical P0 suite)
	- `tests/regression-auth-shell.spec.ts` (regression auth and shell)
	- `tests/regression-gameplay-history.spec.ts` (regression gameplay and history)
	- `tests/regression-profile-settings.spec.ts` (regression profile and settings)
	- `tests/e2e-user-journey.spec.ts` (end-to-end user journey)

## Automated Coverage (Current)

- Critical suite: 7 tests
- Regression suite: 20 tests (including 3 known-defect tests: REG-E06, REG-F02, REG-G05)
- End-to-end suite: 1 test
- **Total automated tests: 28**
- Known-defect tests (separate lane): 6 tests (REG-D04, REG-D13, REG-D14, REG-E06, REG-F02, REG-G05)
- Default lane (CI-safe): 24 tests pass, 0 fail, 4 skipped
- Dedicated per-difficulty automation: Easy, Medium, Hard

## Stability Notes

- History-only validations use deterministic storage seeding to avoid game-loop deadlocks.
- Core gameplay behavior is still validated directly through gameplay interaction tests.
- Every automated test includes manual-reference annotation (`TC-*` or `REG-*`).

## How To Run

- Install dependencies
	- `npm install`

- Install browser runtime
	- `npx playwright install chromium`

- Run default suite (all tests, skips known defects)
	- `npm test` or `npm run test:chromium`

- Run known-defects only (isolated lane with known issues)
	- `npm run test:defects`
	- Runs: REG-D04, REG-D13, REG-D14, REG-E06, REG-F02, REG-G05
	- These tests marked as `test.fail()` for visibility, not CI-blocking

- Generate Allure report from test results
	- `npm run allure:generate`

- Open Allure report in browser
	- `npm run allure:open`

- Run tests and generate Allure in one command
	- `npm run test:allure`

## Recommendations

- Add CI publishing for Allure artifacts.
- Add targeted cross-browser smoke for top P0 flows.
- Continue automating remaining P1/P2 scenarios from `full-regression-test-cases.md`.
