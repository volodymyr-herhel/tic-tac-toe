# Tic-Tac-Toe Test Automation (Playwright + TypeScript)

This repository contains automated tests and QA documentation for the SDET task SUT (single-page `index.html` Tic-Tac-Toe app).

## Stack

- Framework: Playwright
- Language: TypeScript
- Pattern: POM (Page Object Model)

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browser binaries (at least Chromium):

```bash
npx playwright install chromium
```

## Run Tests

Run all configured tests:

```bash
npm test
```

Run Chromium only:

```bash
npm run test:chromium
```

Run known-defect lane only (`ISSUE-005` guard):

```bash
npm run test:defects
```

Run headed:

```bash
npm run test:headed
```

Run Playwright UI mode:

```bash
npm run test:ui
```

Run debug mode:

```bash
npm run test:debug
```

## Run Tests In Docker

Prerequisite: Docker Desktop (or compatible Docker runtime).

Build and run the default test lane in a container:

```bash
npm run test:docker
```

Run known-defect lane in a container:

```bash
npm run test:defects:docker
```

Run default test lane with Docker Compose:

```bash
npm run test:compose
```

Run known-defect lane with Docker Compose:

```bash
npm run test:defects:compose
```

Clean up Compose resources:

```bash
npm run test:compose:down
```

Notes:

- The Docker image is defined in `Dockerfile.test` and uses the official Playwright base image.
- The container sets `CI=1`, so Playwright CI behaviors (for example retries from config) are applied.
- Compose services are defined in `docker-compose.test.yml` (`tests` and `defects`).

## Allure Reporting

Run tests and generate Allure report:

```bash
npm run test:allure
```

Generate report from existing results:

```bash
npm run allure:generate
```

Open generated report:

```bash
npm run allure:open
```

Note: Allure scripts validate and set a working `JAVA_HOME` automatically on Windows via `scripts/allure-*.ps1` wrappers.

Allure result files are written to `allure-results/`, and the generated report is written to `allure-report/`.

## Documentation

### Key Resources

- **[docs/exploratory-testing.md](docs/exploratory-testing.md)** - Comprehensive app analysis including page/element structure, user flows, readiness for automation, and identified limitations.
  - App overview and architecture
  - Page structure and element selectors
  - User flows and scenarios
  - Flakiness observations and recommendations
  - Test data personas and readiness assessment

- **[docs/automation-approaches.md](docs/automation-approaches.md)** - Architecture decisions, solutions, and best practices applied.
  - Overall test strategy and organization
  - Page Object Model pattern rationale
  - Resilience & flakiness mitigation techniques
  - Known defect handling (separate lane strategy)
  - TypeScript, Allure integration, and CI/CD decisions
  - Lessons learned and evolution of approach

- **[docs/issues-log.md](docs/issues-log.md)** - Consolidated log of all known issues with evidence and test automation status.
  - ISSUE-001 through ISSUE-006 with severity, status, and test coverage
  - Most issues now have automated test coverage via `npm run test:defects`

- **[docs/manual-test-cases.md](docs/manual-test-cases.md)** - Inventory of 89 manual test cases with automation mappings.

- **[docs/automation-implementation-notes.md](docs/automation-implementation-notes.md)** - Implementation details and run commands.

## Project Structure

```text
.
├── app/
│   └── index.html                     # Local SUT copy used by tests
├── docs/
│   ├── exploratory-testing.md         # App analysis & observations ← NEW
│   ├── automation-approaches.md       # Architecture & decisions ← NEW
│   ├── issues-log.md                  # Known issues & test status
│   ├── automation-implementation-notes.md
│   ├── manual-test-cases.md
│   └── ... (other documentation)
├── src/
│   └── pages/                         # POM classes (framework code)
├── tests/
│   ├── helpers/                       # Shared test setup and fixture data
│   ├── fixtures/                      # Playwright fixtures (auth/play/shell/history/profile)
│   ├── critical-flows.spec.ts         # Critical automated scenarios (7 tests)
│   ├── regression-auth-shell.spec.ts  # Auth & shell regression (5 tests)
│   ├── regression-gameplay-history.spec.ts  # Gameplay regression (8 tests, incl. known defects)
│   ├── regression-profile-settings.spec.ts  # Profile regression (8 tests, incl. known defects)
│   └── e2e-user-journey.spec.ts       # End-to-end scenario (1 test)
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Why `src/pages` Instead of `tests/pages`

`src/pages` is preferred because page objects are reusable framework code, not test specs. This keeps concerns separated:

- `src/`: reusable automation building blocks
- `tests/`: scenario specifications

## Helpers

- `tests/helpers/testSetup.ts`: deterministic randomness seed + clean app bootstrap
- `tests/helpers/testData.ts`: shared user fixture and scenario constants
- `tests/helpers/randomizer.ts`: random user name/suffix generation for collision-safe runs

Helpers are intentionally minimal to keep tests readable and avoid over-abstraction.

## Fixtures

- `tests/fixtures/testFixtures.ts`: reusable fixtures for `auth`, `play`, `shell`, `history`, and `profile` page objects.
- Includes automatic clean-app bootstrap per test and manual-case annotation helper.

## Current Scope

- Critical flow automation implemented for onboarding, auth, game flow checks, history, and account deletion.
- Dedicated automated tests for Easy/Medium/Hard difficulty flows are implemented in the regression suite.
- Supporting test documentation delivered in `docs/`.
- Full regression test-case catalog is documented in `docs/full-regression-test-cases.md`.

## Manual and Automation Coverage

### Manual Coverage

- Critical manual catalog (`TC-*`): 36 cases in `docs/test-cases-critical-flows.md`
- Full regression manual catalog (`REG-*`): 53 cases in `docs/full-regression-test-cases.md`
- Total manual test cases: 89

### Automation Coverage

- Total automated tests implemented: 28
- Critical automated suite: 7 tests in `tests/critical-flows.spec.ts`
- Regression automated suite: 20 tests across `tests/regression-auth-shell.spec.ts`, `tests/regression-gameplay-history.spec.ts`, and `tests/regression-profile-settings.spec.ts`
- End-to-end user journey suite: 1 test in `tests/e2e-user-journey.spec.ts`

### Manual-to-Automation Traceability

- Critical automation references manual `TC-*` IDs from `docs/test-cases-critical-flows.md`
- Regression automation references manual `REG-*` IDs from `docs/full-regression-test-cases.md`
- Each automated test includes explicit manual-case annotation (for reporting and audit)

### Coverage References

- Coverage inventory: `docs/manual-test-cases.md`
- Critical test plan: `docs/test-plan-critical-scenarios.md`
- Issues and known gaps: `docs/issues-log.md`

## Notes

- The tests use local file execution against `app/index.html` via `file:///...` base URL in Playwright config.
- Additional issue details and statuses are tracked in `docs/issues-log.md`.
- Known-defect policy: `REG-D04` is excluded from default lane and executed in `test:defects` lane.
