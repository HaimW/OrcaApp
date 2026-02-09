import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const slice = fs.readFileSync('src/store/slices/diveEntriesSlice.ts', 'utf8');
const hook = fs.readFileSync('src/hooks/useDiveEntries.ts', 'utf8');
const statsPage = fs.readFileSync('src/pages/StatsPage.tsx', 'utf8');
const entriesPage = fs.readFileSync('src/pages/EntriesPage.tsx', 'utf8');

test('fetchDiveEntries supports admin visibility with explicit flag', () => {
  assert.match(slice, /params:\s*\{\s*isAdmin\?: boolean; userId\?: string\s*\}/);
  assert.match(slice, /if \(params\?\.isAdmin\)/);
  assert.match(slice, /FirebaseService\.getAllDiveEntries\(\)/);
  assert.match(slice, /getDiveEntriesByUser\(userId\)/);
});

test('useDiveEntries subscribes admins to all entries and users to own entries', () => {
  assert.match(hook, /const \{ isAdmin \} = useUserProfile\(\)/);
  assert.match(hook, /subscribeToAllDiveEntries/);
  assert.match(hook, /subscribeToUserDiveEntries\(user\.uid, callback\)/);
});

test('admin pages include per-user filtering controls', () => {
  assert.match(statsPage, /stats-user-filter/);
  assert.match(statsPage, /selectedUserId/);
  assert.match(entriesPage, /entries-user-filter/);
  assert.match(entriesPage, /selectedUserId/);
});
