import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const hook = fs.readFileSync('src/hooks/useDiveEntries.ts', 'utf8');

test('addEntry keeps localStorage fallback on rejected async action', () => {
  assert.match(hook, /result\.type\.endsWith\('\/rejected'\)/);
  assert.match(hook, /LocalStorageService\.addDiveEntry\(newEntry\)/);
  assert.match(hook, /dispatch\(addDiveEntryRealtime\(newEntry\)\)/);
});
