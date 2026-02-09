# Proposed maintenance tasks

## 1) Typo fix task
**Issue:** `TECHNICAL_NOTES.md` (and also `ROADMAP.md`) ends with a literal template string `${new Date().toLocaleDateString('he-IL')}`. In Markdown this is displayed as raw text, so readers see placeholder syntax instead of a real date.

**Task:** Replace the placeholder expression with a real static date (or remove it), and align the footer format across docs.

**Why this is worth doing:** Fixes an obvious text typo/artifact and makes docs look intentional.

---

## 2) Bug fix task
**Issue:** Anonymous users subscribe to **all** dive entries (`subscribeToAllDiveEntries`) and `fetchDiveEntries` also calls `getAllDiveEntries`, which reads the whole collection without user scoping. This can expose entries from other users.

**Task:** Scope reads/subscriptions by `userId` for all non-admin flows.
- Replace `getAllDiveEntries` usage in regular user flows with user-scoped queries.
- Restrict anonymous users to entries with `userId === auth.currentUser.uid`.
- Keep a separate explicit admin path if cross-user visibility is required.

**Why this is worth doing:** Fixes a privacy/data-leak risk.

---

## 3) Comment/docs discrepancy task
**Issue:** `README.md` tells developers to run `npm run type-check`, but `package.json` has no `type-check` script.

**Task:** Resolve mismatch by either:
- adding a `type-check` script (e.g. `tsc --noEmit`) to `package.json`, or
- removing/changing the README instruction to a valid command.

**Why this is worth doing:** Prevents onboarding friction and false-failing setup instructions.

---

## 4) Test improvement task
**Issue:** There is no automated test suite configured, and critical behaviors (user-scoped data access and WhatsApp message/phone formatting) are currently untested.

**Task:** Add a lightweight test setup (Vitest + Testing Library or unit-only Vitest) and cover at least:
1. User-scoped fetch/listener behavior (no cross-user entries returned).
2. Phone normalization for WhatsApp URL generation.
3. Fallback behavior when Firebase calls reject.

**Why this is worth doing:** Improves confidence in privacy-sensitive logic and regression safety.
