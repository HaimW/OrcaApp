import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const hook = fs.readFileSync('src/hooks/useDiveEntries.ts', 'utf8');

test('addEntry fails when cloud save is rejected (no local persistence fallback)', () => {
  assert.match(hook, /result\.type\.endsWith\('\/rejected'\)/);
  assert.match(hook, /throw new Error\('שמירת הצלילה נכשלה בענן\. לא בוצעה שמירה מקומית\.'\)/);
  assert.doesNotMatch(hook, /LocalStorageService\.addDiveEntry/);
  assert.doesNotMatch(hook, /addDiveEntryRealtime/);
});
