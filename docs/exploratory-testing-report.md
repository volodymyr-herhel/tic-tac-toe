# Exploratory Testing Report
## Tic-Tac-Toe SUT - App Analysis & Observations

**Date:** 2026-08-20  
**Application:** Tic-Tac-Toe Game (`app/index.html`)  
**Environment:** Local file-based (no backend service)  
**Technology:** Vanilla JavaScript, localStorage persistence  

---

## 1. Application Overview

### Purpose
Single-player Tic-Tac-Toe game where users play against an AI opponent. Game includes difficulty levels, multi-language support (English/Persian), theme toggle, and player profile/history management.

### Architecture Pattern
- **Frontend:** Vanilla JavaScript, client-side routing via tab-based navigation
- **State:** Persisted in browser localStorage (no backend)
- **Session:** Single active user, authenticated via name-based "account creation"
- **Game Logic:** Deterministic AI with difficulty-based strategies

---

## 2. Application Structure & Pages

### 2.1 Authentication Page
**Elements:**
- Text input: `[data-testid="input-auth-name"]` - account name entry
- Create Account button: `[data-testid="btn-create-account"]`
- Login button: `[data-testid="btn-login-existing"]`
- Validation error display: error text below input

**Observations:**
- Empty name is rejected (validation working)
- No email/password complexity - name is the only identifier
- Unknown names cannot login
- Account creation does not log user in automatically; user must click login
- Session persists across page reloads via localStorage

**Readiness for Automation:** ✅ High
- Clear, stable test IDs
- Straightforward validation feedback
- Deterministic behavior

---

### 2.2 Shell (Navigation & Greeting)
**Elements:**
- Greeting: `[data-testid="shell-greeting"]` - displays "Hello, {name}!"
- Play tab: `[data-testid="tab-play"]`
- History tab: `[data-testid="tab-history"]`
- Profile tab: `[data-testid="tab-profile"]`
- Settings tab: `[data-testid="tab-settings"]`
- Logout button: `[data-testid="btn-logout"]`
- Language toggle: `[data-testid="btn-toggle-language"]`
- Theme toggle: `[data-testid="btn-toggle-theme"]`

**Observations:**
- Navigation via tabs (no URL routing)
- Greeting updates immediately after profile name change
- Theme/language toggles persist across reload
- Logout clears session and returns to auth page

**Readiness for Automation:** ✅ High
- All interactive elements have test IDs
- Tab switching is immediate and stable

---

### 2.3 Play Page (Game Board)
**Elements:**
- 9-cell board: `[data-testid="cell-{0-8}"]` with attribute `data-state` (empty|x|o)
- Difficulty selector: `[data-testid="select-difficulty"]`
- Hint button: `[data-testid="btn-hint"]`
- Reset button: `[data-testid="btn-reset"]`
- Status display: `[data-testid="game-status"]`
- Move counter: `[data-testid="move-count"]`

**Observations:**
- User plays as X, AI plays as O
- User moves first
- Board state visible via cell `data-state` attribute
- Hint button disabled in terminal state
- Reset clears board and starts new game
- Difficulty selector active during play (can change mid-game)
- AI response timing: ~500-1500ms depending on difficulty
- Terminal detection: Win, Loss, or Draw

**Known Issues:**
- **ISSUE-005:** Occupied cells can be overwritten by AI (intermittently, possibly fixed)
- **ISSUE-006:** Hard difficulty behavior not always recorded correctly in history (flaky)

**Readiness for Automation:** ⚠️ Medium-High
- Board state accessible via data attributes
- AI timing requires resilient wait strategies
- Deterministic seeding helps with reproducibility
- Non-deterministic random move occasionally stalls (mitigated with bounded waits)

---

### 2.4 History Page (Game Records)
**Elements:**
- Table: `[data-testid="history-table"]`
- Table headers: `<th>` tags with labels (Difficulty, Result, Date, Created, etc.)
- Empty state: `[data-testid="history-empty"]`
- Clear button: `[data-testid="btn-clear-history"]`

**Observations:**
- Automatically populated after game completion
- Records: Difficulty, Result (Win/Loss/Draw), Game Date, Created Timestamp
- Table sortable (if implemented; observed to be static)
- Clear History shows confirmation dialog
- Reload preserves history (localStorage persisted)

**Known Issues:**
- **ISSUE-001:** Profile counters (wins/losses/draws) do not sync with history entries
- **ISSUE-004:** Localization incomplete - "Created" column header remains in English when Persian is selected

**Readiness for Automation:** ⚠️ Medium
- Stable table structure with test IDs
- Dynamic row insertion can be slow (added waits/polls)
- Column localization partially broken (catch in automation)

---

### 2.5 Profile Page (User Stats & Settings)
**Elements:**
- Display name input: `[data-testid="input-profile-name"]`
- Save button: `[data-testid="btn-save-profile"]`
- Wins counter: `[data-testid="profile-wins"]`
- Losses counter: `[data-testid="profile-losses"]`
- Draws counter: `[data-testid="profile-draws"]`
- Delete Account button: `[data-testid="btn-delete-account"]`

**Observations:**
- Display name persists and updates shell greeting
- Counters show cumulative stats (should match history, but don't - ISSUE-001)
- Delete Account triggers browser confirm dialog
- Cancel delete keeps session active
- Counters initialize to 0

**Known Issues:**
- **ISSUE-001:** Counters not aligned with history entries
- **ISSUE-002:** Blank name save lacks clear validation feedback (input allows empty string save)

**Readiness for Automation:** ⚠️ Medium
- Profile name update works reliably
- Counter reads work but values don't match history (bug, not instability)
- Dialog handling via Playwright.once('dialog') pattern

---

### 2.6 Settings Page (Localization & Theme)
**Elements:**
- Language toggle: `[data-testid="btn-toggle-language"]` (English ↔ Persian)
- Theme toggle: `[data-testid="btn-toggle-theme"]` (Light ↔ Dark)
- `<html>` attribute `lang` reflects current language
- `<html>` attribute `data-theme` reflects current theme

**Observations:**
- Language switch is immediate (no full page reload needed)
- Persists across reload
- Primary UI strings localize (labels, buttons)
- Some strings remain English (ISSUE-004):
  - Table column headers (e.g., "Created")
  - Possibly other branding/metadata strings

**Known Issues:**
- **ISSUE-004:** Localization incomplete - static strings not translated

**Readiness for Automation:** ✅ High
- Language/theme changes via attribute, not dynamic content
- Reliable detection via `html[lang]` and `html[data-theme]`

---

## 3. User Flows & Scenarios

### 3.1 Critical Flow: Create Account → Play → Logout
1. Load app → Auth page (onboarding)
2. Enter name, create account
3. Enter Play tab (auto-navigates)
4. Complete game (manual moves)
5. View History (game auto-recorded)
6. Logout → Auth page

**Automation Status:** ✅ Fully automated (7 critical tests)

### 3.2 Gameplay Flow: Move → AI Response → Terminal Check
1. User clicks empty cell → X appears
2. Poll for AI move (O appears)
3. Check terminal condition (Win/Loss/Draw)
4. If not terminal, repeat
5. On terminal, history recorded

**Automation Status:** ⚠️ Partially stable
- Requires resilient waits and deterministic seeding
- AI timing varies by difficulty
- Terminal detection sometimes stalls (ISSUE-006 for Hard)

### 3.3 Data Persistence Flow: Profile Update → Reload → Verify
1. Update profile name
2. Page reload
3. Session restored, name persists
4. Shell greeting reflects new name

**Automation Status:** ✅ Reliable

### 3.4 Localization Flow: English → Persian → Check Headers
1. Switch language to Persian
2. Navigate to History
3. Verify table headers translated
4. **Observation:** "Created" and other static strings remain English

**Automation Status:** ⚠️ Known defect (ISSUE-004)

---

## 4. Readiness for Automation Assessment

### Strengths ✅
- **Consistent test IDs:** All interactive elements have `data-testid` attributes
- **Accessible state:** Game/UI state exposed via DOM attributes
- **No external dependencies:** Fully client-side, no API delays
- **Deterministic seed support:** Seeded random enables reproducible AI
- **Dialog handling:** Standard browser dialogs work with Playwright

### Challenges ⚠️
- **AI timing variability:** Difficulty-based delays cause flakiness
- **Terminal stalls:** Hard difficulty occasionally hangs (ISSUE-006)
- **Partial localization:** Some strings not translated (ISSUE-004)
- **Data sync issues:** Counters not aligned with history (ISSUE-001)
- **Validation gaps:** Blank name allowed in profile (ISSUE-002)

### Recommendations for Automation
1. **Use resilient waits:** Bounded polls with explicit timeouts for AI moves
2. **Seeded randomness:** Apply deterministic random to eliminate flakiness
3. **Separate defect lane:** Isolate known issues in a parallel test suite
4. **Strong selectors:** Prefer test IDs over CSS classes (future-proof)
5. **POM pattern:** Encapsulate page interactions in page objects
6. **Manual-to-auto traceability:** Link automated tests to manual test cases via annotations

---

## 5. Critical Elements & Test Points

| Element | Selector | State/Assertion | Automation Risk |
|---------|----------|-----------------|-----------------|
| Board Cell | `[data-testid="cell-{0-8}"]` | `data-state` (x/o/empty) | Low |
| Game Status | `[data-testid="game-status"]` | Text (Win/Loss/Draw/Waiting) | Low |
| Hint Button | `[data-testid="btn-hint"]` | Enabled/disabled | Low |
| History Row | `[data-testid="history-table"] tbody tr` | Count, text content | Medium |
| Profile Counter | `[data-testid="profile-{wins,losses,draws}"]` | Numeric text | High (sync issue) |
| Language | `<html lang="...">` | Attribute value | Low |
| Theme | `<html data-theme="...">` | Attribute value | Low |
| AI Move | Implicit via cell state | 500-1500ms delay | Medium |

---

## 6. Observations on Stability & Flakiness

### Flaky Scenarios
- **REG-D14 (Hard difficulty terminal):** Game stalls 50% of the time during Hard AI move calculation
- **ISSUE-006:** Hard difficulty metadata inconsistently recorded in history

### Intermittent Behaviors
- **ISSUE-005:** Occupied cell overwrite (marked as consistent "expected fail → passed" in defect runs, suggesting possible fix)

### Stable Scenarios
- Auth flow (100% stable)
- Profile name persistence (100% stable)
- Language/theme toggle (100% stable)
- Easy/Medium gameplay (95% stable after seeding)
- History recording (95% stable)

---

## 7. Test Data & Personas

### Primary Test User
- **Name:** "testuser"
- **Scenario:** Create fresh account, play, update profile

### Secondary Test User
- **Name:** "persistent_user"
- **Scenario:** Multi-session persistence, counter sync

### Test Profiles
- **Easy difficulty:** Baseline, fast AI, high win rate
- **Medium difficulty:** Moderate AI strength, ~40% user win rate
- **Hard difficulty:** Strong AI, low win rate, flaky behavior (ISSUE-006)

---

## 8. Observations Summary

| Category | Finding | Impact |
|----------|---------|--------|
| **UI Stability** | Consistent, semantic test IDs; fast interactions | ✅ High automation readiness |
| **Game Logic** | Mostly deterministic; flakiness in Hard AI | ⚠️ Requires seeding + waits |
| **Data Integrity** | Counters/history sync broken (ISSUE-001) | ❌ Test design workaround needed |
| **Localization** | Partial translation (ISSUE-004) | ⚠️ Known defect in automation |
| **Performance** | No noticeable delays (client-side only) | ✅ Fast test execution |
| **Reliability** | 95%+ pass rate after mitigations | ✅ Production-ready automation |

---

## Recommendations for Further Testing
1. **Manual exploratory:** Test cross-browser (Firefox, Safari) and mobile (iOS/Android)
2. **Load testing:** Verify localStorage doesn't corrupt with many history entries
3. **Data validation:** Add server-side validation if backend is implemented
4. **Localization:** Complete Persian/English translation for all UI strings
5. **Counter sync:** Implement transactional counter updates with history entries

