import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const slice = fs.readFileSync('src/store/slices/diveEntriesSlice.ts', 'utf8');
const hook = fs.readFileSync('src/hooks/useDiveEntries.ts', 'utf8');

test('fetchDiveEntries supports admin visibility', () => {
  assert.match(slice, /isUserAdmin\(email\)/);
  assert.match(slice, /FirebaseService\.getAllDiveEntries\(\)/);
  assert.match(slice, /getDiveEntriesByUser\(userId\)/);
});

test('useDiveEntries subscribes admins to all entries and users to own entries', () => {
  assert.match(hook, /isUserAdmin\(user\.email\)/);
  assert.match(hook, /subscribeToAllDiveEntries/);
  assert.match(hook, /subscribeToUserDiveEntries\(user\.uid, callback\)/);
});
