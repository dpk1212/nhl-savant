/**
 * UFC / MMA Odds API returns the next fight card, not today's slate.
 * Usage: node tests/testUfcTodaySlate.mjs
 */
import assert from 'assert';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  etDateFromIso,
  todayEt,
  isOnTodaysEtSlate,
} from '../src/lib/slateDate.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(etDateFromIso('2026-08-22T21:00:00Z') === '2026-08-22', 'Gaziev bell is Saturday ET');
ok(etDateFromIso('2026-08-23T01:00:00Z') === '2026-08-22', 'late prelim UTC still Saturday ET');
ok(etDateFromIso('2026-08-19T18:15:33.955Z') === '2026-08-19', 'firstSeen is Wednesday ET — not the fight');

const wed = Date.parse('2026-08-19T18:30:00Z');
ok(todayEt(wed) === '2026-08-19', 'today ET on Wed afternoon');
ok(!isOnTodaysEtSlate('2026-08-22T21:00:00Z', { now: wed }), 'Sat Fight Night is not on Wed slate');
ok(!isOnTodaysEtSlate('2026-08-29T20:00:00Z', { now: wed }), 'next week card is not on Wed slate');
ok(!isOnTodaysEtSlate(null, { now: wed }), 'missing commence is not today');

const sat = Date.parse('2026-08-22T22:00:00Z'); // 6 PM ET Saturday
ok(isOnTodaysEtSlate('2026-08-22T21:00:00Z', { now: sat }), 'same-day card is on Saturday slate');
ok(isOnTodaysEtSlate('2026-08-22T21:00:00Z', { now: Date.parse('2026-08-22T23:00:00Z') }), 'in-progress same ET day');

// Started, still in the cage, even if ET date rolled (shouldn't for 6h)
const afterBell = Date.parse('2026-08-22T21:00:00Z') + 2 * 3600 * 1000;
ok(isOnTodaysEtSlate('2026-08-22T21:00:00Z', { now: afterBell }), '2h into the fight still on slate');

const poly = JSON.parse(readFileSync(join(ROOT, 'public/polymarket_data.json'), 'utf8'));
const ufc = poly.UFC || {};
const wedKept = Object.entries(ufc).filter(([, g]) => isOnTodaysEtSlate(g.commence, { now: wed }));
ok(wedKept.length === 0, `Wednesday ET slate keeps 0 of ${Object.keys(ufc).length} dumped UFC fights`);

const gaziev = ufc.kennedynzechukwu_shamilgaziev;
if (gaziev) {
  ok(gaziev.commence === '2026-08-22T21:00:00Z', 'dumped Gaziev commence is Saturday 5 PM ET');
  ok(gaziev.polyGameDate === '2026-08-22', 'dumped Gaziev polyGameDate is Saturday');
  ok(isOnTodaysEtSlate(gaziev.commence, { now: sat }), 'Saturday slate keeps dumped Gaziev');
}
const yadong = ufc.songyadong_umarnurmagomedov;
if (yadong) {
  ok(!isOnTodaysEtSlate(yadong.commence, { now: sat }), 'Saturday slate drops Aug 29 Yadong');
}

console.log(`testUfcTodaySlate: ${n} assertions passed`);
