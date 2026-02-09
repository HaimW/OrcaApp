import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const slice = fs.readFileSync('src/store/slices/diveEntriesSlice.ts', 'utf8');
const hook = fs.readFileSync('src/hooks/useDiveEntries.ts', 'utf8');

test('fetchDiveEntries is user-scoped', () => {
  assert.match(slice, /getDiveEntriesByUser\(userId\)/);
  assert.doesNotMatch(slice, /const entries = await FirebaseService\.getAllDiveEntries\(\)/);
});

test('useDiveEntries uses user-scoped realtime subscription', () => {
  assert.match(hook, /subscribeToUserDiveEntries\(user\.uid/);
  assert.doesNotMatch(hook, /subscribeToAllDiveEntries\(/);
});
