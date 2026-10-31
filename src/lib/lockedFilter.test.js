import test from 'node:test';
import assert from 'node:assert/strict';
import { lockedDayLine } from './lockedFilter.js';

const NOW = Date.parse('2026-10-31T22:00:00Z');
const started = NOW - 60 * 60 * 1000;
const later = NOW + 60 * 60 * 1000;

test('the sticky record line is settled profit', () => {
  const picks = [
    { outcome: 'WIN', profit: 4.2, units: 4, odds: -110, commenceMs: started },
    { outcome: 'WIN', profit: 2.1, units: 2, odds: 105, commenceMs: started },
    { outcome: 'LOSS', profit: -3, units: 3, odds: -110, commenceMs: started },
    { outcome: 'PUSH', profit: 0, units: 2, odds: -110, commenceMs: started },
    { outcome: null, units: 10, odds: 100, commenceMs: later },
    { outcome: null, units: 8, odds: -110, commenceMs: started },
    { isMonitoring: true, outcome: 'WIN', profit: 50, units: 1, odds: 100, commenceMs: started },
  ];
  const line = lockedDayLine(picks, 'today', NOW);
  assert.equal(line.record, '2\u20131');
  assert.equal(Math.round(line.realized * 10) / 10, 3.3);
  assert.equal(line.mini, '2\u20131 \u00b7 +3.3u');
  assert.equal(line.text, line.mini);
  assert.equal(line.mini.includes('risk'), false);
});

test('a red day stays on the settled loss', () => {
  const line = lockedDayLine([
    { outcome: 'LOSS', profit: -4, units: 4, odds: -101, commenceMs: started },
    { outcome: null, units: 12, odds: -110, commenceMs: later },
  ], 'today', NOW);
  assert.equal(line.mini, '0\u20131 \u00b7 -4.0u');
});
