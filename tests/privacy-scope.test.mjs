import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const slice = fs.readFileSync('src/store/slices/diveEntriesSlice.ts', 'utf8');
const hook = fs.readFileSync('src/hooks/useDiveEntries.ts', 'utf8');
const rules = fs.readFileSync('firestore.rules', 'utf8');

test('fetchDiveEntries is user-scoped only', () => {
  assert.doesNotMatch(slice, /isUserAdmin\(/);
  assert.doesNotMatch(slice, /getAllDiveEntries\(\)/);
  assert.match(slice, /getDiveEntriesByUser\(userId\)/);
});

test('useDiveEntries subscribes only to current user entries', () => {
  assert.doesNotMatch(hook, /isUserAdmin\(/);
  assert.doesNotMatch(hook, /subscribeToAllDiveEntries/);
  assert.match(hook, /subscribeToUserDiveEntries\(user\.uid,/);
});

test('firestore admin rules are Firebase-user based and avoid email wildcards', () => {
  assert.match(rules, /get\(\/databases\/\$\(database\)\/documents\/users\/\$\(request\.auth\.uid\)\)\.data\.role == 'admin'/);
  assert.doesNotMatch(rules, /matches\('\.\*admin\.\*'\)/);
  assert.doesNotMatch(rules, /== 'yafim\.sh@gmail\.com'/);
});
