import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIsraeliPhone, buildIndividualWhatsappUrl } from '../src/utils/whatsapp.js';

test('normalizeIsraeliPhone strips non-digits and leading zero', () => {
  assert.equal(normalizeIsraeliPhone('050-123 4567'), '501234567');
  assert.equal(normalizeIsraeliPhone('+972-50-1234567'), '972501234567');
});

test('buildIndividualWhatsappUrl encodes message and prefixes 972', () => {
  const url = buildIndividualWhatsappUrl('050-1234567', 'שלום עולם');
  assert.match(url, /^https:\/\/wa\.me\/972501234567\?text=/);
  assert.match(url, /%D7%A9%D7%9C%D7%95%D7%9D/);
});
