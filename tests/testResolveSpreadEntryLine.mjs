/**
 * Spread entryLine polarity — main vs alt.
 * Usage: node tests/testResolveSpreadEntryLine.mjs
 */
import assert from 'assert';
import { resolveSpreadEntryLine } from '../scripts/lib/resolvePositionSide.js';

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed++;
}

const away = 'Cleveland Guardians';
const home = 'Chicago White Sox';

// Main poly market: title "Spread -1.5", outcomes[0] gets -1.5
const mainPoly = {
  line: -1.5,
  title: 'Spread -1.5',
  outcomes: ['Chicago White Sox', 'Cleveland Guardians'],
};

// CLE@CWS 2026-08-09 — wallet on alt Sox +1.5; main poly would stamp -1.5 via idx0
ok(
  resolveSpreadEntryLine({
    title: 'Spread: Chicago White Sox (+1.5)',
    outcome: 'Chicago White Sox',
    outcomeIndex: 0,
    side: 'home',
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
  }) === 1.5,
  'alt title +1.5 beats main polySpread -1.5',
);

ok(
  resolveSpreadEntryLine({
    title: 'Spread: Chicago White Sox (-1.5)',
    outcome: 'Chicago White Sox',
    outcomeIndex: 0,
    side: 'home',
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
  }) === -1.5,
  'main title -1.5 kept',
);

ok(
  resolveSpreadEntryLine({
    title: 'Spread: Cleveland Guardians (+1.5)',
    outcome: 'Cleveland Guardians',
    outcomeIndex: 1,
    side: 'away',
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
  }) === 1.5,
  'away dog +1.5 from title',
);

// No title line — fall back to poly idx (Sox idx0 → -1.5)
ok(
  resolveSpreadEntryLine({
    title: 'Cleveland Guardians vs. Chicago White Sox',
    outcome: 'Chicago White Sox',
    outcomeIndex: 0,
    side: 'home',
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
  }) === -1.5,
  'poly idx0 gets main line',
);

ok(
  resolveSpreadEntryLine({
    title: 'Cleveland Guardians vs. Chicago White Sox',
    outcome: 'Cleveland Guardians',
    outcomeIndex: 1,
    side: 'away',
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
  }) === 1.5,
  'poly idx1 flips main line',
);

// matchSpreadLine from matchSpreadTitle when title path already consumed elsewhere
ok(
  resolveSpreadEntryLine({
    title: '',
    outcome: 'Chicago White Sox',
    outcomeIndex: 0,
    side: 'home',
    awayName: away,
    homeName: home,
    polySpread: mainPoly,
    matchSpreadLine: 1.5,
  }) === 1.5,
  'matchSpreadLine beats poly for alts',
);

console.log(`OK ${passed} assertions`);
