# Manual Test Cases

- Project: Tic-Tac-Toe SUT
- Last updated: 2026-08-20
- Purpose: Consolidated view of all test cases produced in this repository and automation coverage status.

## Sources

1. Critical scenario plan: [docs/test-plan-critical-scenarios.md](docs/test-plan-critical-scenarios.md)
2. Critical test cases (manual): [docs/test-cases-critical-flows.md](docs/test-cases-critical-flows.md)
3. Full regression test cases (manual): [docs/full-regression-test-cases.md](docs/full-regression-test-cases.md)
4. Automated critical suite: [tests/critical-flows.spec.ts](tests/critical-flows.spec.ts)
5. Automated regression suites: [tests/regression-auth-shell.spec.ts](tests/regression-auth-shell.spec.ts), [tests/regression-gameplay-history.spec.ts](tests/regression-gameplay-history.spec.ts), [tests/regression-profile-settings.spec.ts](tests/regression-profile-settings.spec.ts)
6. End-to-end journey suite: [tests/e2e-user-journey.spec.ts](tests/e2e-user-journey.spec.ts)

## A) Created Manual Test Cases 

Manual test cases were created with IDs:

1. Section A: TC-A01..TC-A03
2. Section B: TC-B01..TC-B06
3. Section C: TC-C01..TC-C02
4. Section D: TC-D01..TC-D11
5. Section E: TC-E01..TC-E04
6. Section F: TC-F01..TC-F04
7. Section G: TC-G01..TC-G03
8. Section H: TC-H01..TC-H03

Critical manual test cases (TC-*): 36

Regression manual test cases (REG-*):
1. Section A: REG-A01..REG-A05 (5 tests)
2. Section B: REG-B01..REG-B05 (5 tests)
3. Section C: REG-C01..REG-C04 (4 tests)
4. Section D: REG-D01..REG-D14 (14 tests)
5. Section E: REG-E01..REG-E06 (6 tests)
6. Section F: REG-F01..REG-F05 (5 tests)
7. Section G: REG-G01..REG-G05 (5 tests)
8. Section H: REG-H01..REG-H05 (5 tests)
9. Section I: REG-I01..REG-I04 (4 tests)

Regression manual test cases (REG-*): 53

**Total manual test cases documented: 89** (36 critical + 53 regression)

## B) Existing Automated Test Cases (implemented)

Automated tests are implemented in:

1. [tests/critical-flows.spec.ts](tests/critical-flows.spec.ts)
2. [tests/regression-auth-shell.spec.ts](tests/regression-auth-shell.spec.ts)
3. [tests/regression-gameplay-history.spec.ts](tests/regression-gameplay-history.spec.ts)
4. [tests/regression-profile-settings.spec.ts](tests/regression-profile-settings.spec.ts)
5. [tests/e2e-user-journey.spec.ts](tests/e2e-user-journey.spec.ts)

Total automated tests currently implemented: 28.

Breakdown by suite:
- Critical P0 flows: 7 tests
- Regression suite: 20 tests (including 3 known-defect tests: REG-E06, REG-F02, REG-G05)
- End-to-end user journey: 1 test

Default lane (CI-safe): 24 tests pass, 0 fail, 4 skipped
Known-defect lane (test:defects): 6 tests run with known issues

Highlights:

1. Critical P0 flow coverage (7 tests).
2. Full regression coverage with explicit manual references (20 tests).
3. Dedicated per-difficulty tests are implemented for Easy, Medium, and Hard.
4. End-to-end user journey coverage includes onboarding, gameplay, personalization, and logout.
5. Known-defect lane includes `REG-D04` tied to `ISSUE-005`.

## C) Manual-to-Automation Reference Validation

Reference check performed against:

1. Critical manual catalog: `test-cases-critical-flows.md` (`TC-*` IDs)
2. Full regression manual catalog: `full-regression-test-cases.md` (`REG-*` IDs)
3. Automated specs: critical, regression split suites, and e2e journey suite

Validation result:

1. Critical automated tests reference valid `TC-*` IDs.
2. Regression automated tests reference valid `REG-*` IDs.
3. No orphan manual reference IDs found.

## D) Coverage Mapping Snapshot

| Manual Catalog | Example Manual IDs | Automated Spec Coverage |
|---|---|---|
| Critical (`TC-*`) | TC-A02, TC-B01, TC-B03, TC-B05, TC-D01, TC-D03, TC-E01, TC-F04 | `tests/critical-flows.spec.ts` |
| Regression (`REG-*`) | REG-A01, REG-B02, REG-C01, REG-D04, REG-D09, REG-D10, REG-D12..REG-D14, REG-E04, REG-F01, REG-F03, REG-G01..REG-G05 | `tests/regression-auth-shell.spec.ts`, `tests/regression-gameplay-history.spec.ts`, `tests/regression-profile-settings.spec.ts` |
| End-to-End (`TC-*`) | TC-B01, TC-D01, TC-F01, TC-B05 | `tests/e2e-user-journey.spec.ts` |

## E) Coverage Summary

1. P0 critical automation coverage: implemented.
2. P1 high-value flows: partially to largely implemented in regression suite.
3. P2 extended checks: partially automated; remaining items continue as hybrid manual + automation.
4. Manual-reference traceability: each automated test includes explicit manual case annotation.

## F) Execution Commands

1. Run default suite (CI-safe, skips known defects):

```bash
npm test
```

2. Run defects lane only (isolated known issues):

```bash
npm run test:defects
```

3. Run with Allure results generation:

```bash
npm run test:allure
```

4. Open Allure report in browser:

```bash
npm run allure:open
```
