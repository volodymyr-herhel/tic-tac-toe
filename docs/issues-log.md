# Issues Log

- Project: Tic-Tac-Toe SUT (`app/index.html`)
- Last updated: 2026-08-20
- Source: exploratory testing + automated execution findings

## Severity Key

- Critical: blocks core flow or data integrity
- High: major functional mismatch with expected behavior
- Medium: important but non-blocking inconsistency
- Low: cosmetic or minor non-functional issue

## ISSUE-001

- Title: Profile counters are not aligned with completed game history
- Severity: High
- Area: Profile / Data Integrity
- Status: Open
- Found by: Exploratory + automation observation

### Evidence

1. Completed games are recorded in History.
2. Profile counters (`wins`, `losses`, `draws`) may remain unchanged.

### Impact

1. User statistics cannot be trusted.
2. Cross-view data consistency is broken.

### Suggested Fix Direction

1. Recompute counters from history on read, or
2. Update counters transactionally whenever a game result is persisted.

---

## ISSUE-002

- Title: Blank profile name save lacks clear validation feedback
- Severity: Medium
- Area: Profile / Validation
- Status: Open
- Found by: Exploratory testing

### Evidence

1. Clearing display name and saving did not consistently show a visible validation error in one observed flow.

### Impact

1. Allows ambiguous or invalid profile state.
2. Poor UX around required field behavior.

### Suggested Fix Direction

1. Enforce trim + non-empty validation before save.
2. Display explicit error text in a stable alert container.

---

## ISSUE-003

- Title: Non-deterministic game progression can cause transient automation instability
- Severity: Medium
- Area: Game Loop / Automation Reliability
- Status: Mitigated in tests
- Found by: Automation execution

### Evidence

1. Automated play-to-terminal flow previously exhibited occasional stalls during turn transitions.
2. Mitigated by deterministic randomness seeding and resilient interaction/wait strategy.

### Impact

1. Test flakiness risk if strategy is not robust.

### Mitigation Applied

1. Seeded deterministic `Math.random` in test bootstrap.
2. Added resilient click/wait behavior in page object methods.

---

## ISSUE-004

- Title: Localization is partial for some static branding strings
- Severity: Low
- Area: Localization
- Status: Open
- Found by: Exploratory testing

### Evidence

1. Primary UI labels/messages switch language.
2. Some fixed header/subtitle text remains in English.

### Impact

1. Incomplete localized experience.

### Suggested Fix Direction

1. Move all user-facing strings into locale dictionaries.
2. Add coverage test for full text inventory per locale.

---

## ISSUE-005

- Title: Occupied cells can be overwritten (existing X can be replaced by O)
- Severity: Critical
- Area: Gameplay Core / Data Integrity
- Status: Open
- Found by: Automated regression execution

### Evidence

1. User places `X` on the board.
2. AI (`O`) can overwrite that already occupied `X` cell.
3. Reproduced during automated run in `REG-D04` scenario.

### Impact

1. Violates core Tic-Tac-Toe rule that occupied cells are immutable.
2. Invalidates game outcomes and turn integrity.
3. Breaks confidence in gameplay correctness and history accuracy.

### Suggested Fix Direction

1. Guard move application with a strict `cell is empty` check on both user and AI move paths.
2. Add unit/integration checks to reject writes to non-empty cells.
3. Add regression automation for occupied-cell immutability across all board coordinates.

---

## ISSUE-006

- Title: Medium and Hard difficulty levels appear swapped or mislabeled
- Severity: High
- Area: Gameplay Core / Difficulty Configuration
- Status: Open
- Found by: Exploratory + automation observation

### Evidence

1. Medium and Hard behaviors appear mixed in some runs.
2. Observed exploratory behavior suggests Medium can play harder than Hard.
3. User expectation is Easy < Medium < Hard, but observed trend can be Easy < Hard < Medium.
4. Difficulty shown/observed in gameplay does not always match expected behavior profile.

### Impact

1. Reduces confidence in difficulty tuning and user experience consistency.
2. Can produce misleading difficulty metadata in validation results.
3. Causes user confusion when selecting difficulty.

### Suggested Fix Direction

1. Verify difficulty-to-AI strategy mapping in game engine code paths.
2. Add deterministic unit checks for each difficulty decision policy.
3. Compare Medium vs. Hard AI strategy implementations side-by-side.
4. Swap strategy assignments if Medium/Hard are reversed in code.
5. Extend regression assertions to validate not only history label but behavior characteristics per difficulty.
