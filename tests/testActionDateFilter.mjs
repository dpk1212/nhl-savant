/**
 * Action date chips = today through whatever 72h reaches in ET.
 * Usage: node tests/testActionDateFilter.mjs
 */
import assert from 'node:assert/strict';
import {
  actionDateKeys,
  formatActionDateChip,
  actionDateParts,
  etDateKey,
  rowMatchesActionDate,
  filterActionRows,
} from '../src/lib/confirmedActionDesk.js';

// Friday Sep 18, 2026 3:31 PM ET (EDT = UTC−4)
const fri = Date.parse('2026-09-18T19:31:00Z');
assert.equal(etDateKey(fri), '2026-09-18');
assert.deepEqual(actionDateKeys(fri), [
  '2026-09-18',
  '2026-09-19',
  '2026-09-20',
  '2026-09-21',
]);
assert.equal(formatActionDateChip('2026-09-18', '2026-09-18'), 'Today');
assert.equal(formatActionDateChip('2026-09-19', '2026-09-18'), 'Sat 19');
assert.equal(formatActionDateChip('2026-09-20', '2026-09-18'), 'Sun 20');
assert.equal(formatActionDateChip('2026-09-21', '2026-09-18'), 'Mon 21');
assert.deepEqual(actionDateParts('2026-09-18', '2026-09-18'), { kicker: 'TODAY', day: '18' });
assert.deepEqual(actionDateParts('2026-09-19', '2026-09-18'), { kicker: 'SAT', day: '19' });
assert.deepEqual(actionDateParts('2026-09-20', '2026-09-18'), { kicker: 'SUN', day: '20' });
assert.deepEqual(actionDateParts('2026-09-21', '2026-09-18'), { kicker: 'MON', day: '21' });

const mlbToday = { sport: 'MLB', invested: 2000, commenceMs: Date.parse('2026-09-18T23:06:00Z') };
const cfbSat = { sport: 'CFB', invested: 4100, commenceMs: Date.parse('2026-09-19T23:00:00Z') };
const nflSun = { sport: 'NFL', invested: 3000, commenceMs: Date.parse('2026-09-20T17:00:00Z') };
const cfbNextWeek = { sport: 'CFB', invested: 2200, commenceMs: Date.parse('2026-09-25T23:00:00Z') };
const unknown = { sport: 'SOC', invested: 1500 };

assert.equal(rowMatchesActionDate(mlbToday, '2026-09-18', fri), true);
assert.equal(rowMatchesActionDate(cfbSat, '2026-09-18', fri), false);
assert.equal(rowMatchesActionDate(cfbSat, '2026-09-19', fri), true);
assert.equal(rowMatchesActionDate(nflSun, '2026-09-20', fri), true);
assert.equal(rowMatchesActionDate(cfbNextWeek, '2026-09-18', fri), false);
assert.equal(rowMatchesActionDate(unknown, '2026-09-18', fri), true);
assert.equal(rowMatchesActionDate(unknown, '2026-09-19', fri), false);

const all = [mlbToday, cfbSat, nflSun, cfbNextWeek, unknown];
assert.deepEqual(
  filterActionRows(all, { dateKey: '2026-09-18', nowMs: fri, minInvested: 0 }).map((r) => r.sport),
  ['MLB', 'SOC'],
);
assert.deepEqual(
  filterActionRows(all, { dateKey: '2026-09-19', nowMs: fri, minInvested: 0 }).map((r) => r.sport),
  ['CFB'],
);
assert.deepEqual(
  filterActionRows(all, { dateKey: '2026-09-20', nowMs: fri, minInvested: 0 }).map((r) => r.sport),
  ['NFL'],
);

console.log('testActionDateFilter: ok', actionDateKeys(fri));
