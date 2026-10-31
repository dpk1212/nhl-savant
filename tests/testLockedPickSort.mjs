/**
 * Locked Picks default ORDER is units (conviction), not star rating.
 * Usage: node tests/testLockedPickSort.mjs
 */
import assert from 'assert';
import { compareLockedPicks } from '../src/lib/lockedPickSort.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

const twins = { team: 'Twins', units: 1.0, stars: 4, health: { status: 'ACTIVE' }, isTopPick: true };
const jaysOver = { team: 'Over 7', units: 1.0, stars: 4, health: { status: 'ACTIVE' } };
const dbacks = { team: 'Diamondbacks', units: 2.5, stars: 3, health: { status: 'ACTIVE' } };
const rockies = { team: 'Rockies', units: 1.0, stars: 3, health: { status: 'ACTIVE' } };

const byUnits = [twins, jaysOver, dbacks, rockies].sort((a, b) => compareLockedPicks(a, b, 'units'));
ok(byUnits[0].team === 'Diamondbacks', '2.5u Diamondbacks lead the default ORDER');
ok(byUnits[0].units > byUnits[1].units, 'first card has more units than second');
ok(
  compareLockedPicks(dbacks, twins, 'units') < 0,
  '2.5u ranks above 1u even when 1u has more stars and TOP PICK',
);
ok(
  compareLockedPicks(dbacks, twins, 'stars') < 0,
  'legacy stars chip id still ranks by units',
);

const mutedBig = { team: 'Muted 4u', units: 4, health: { status: 'MUTED' } };
ok(compareLockedPicks(twins, mutedBig, 'units') < 0, 'ACTIVE 1u still ranks above MUTED 4u');

const cancelled = { team: 'Cancelled', units: 5, health: { status: 'CANCELLED' } };
ok(compareLockedPicks(mutedBig, cancelled, 'units') < 0, 'MUTED ranks above CANCELLED');

const oldSide = { team: 'Superseded 5u', units: 5, superseded: true, health: { status: 'ACTIVE' } };
ok(compareLockedPicks(dbacks, oldSide, 'units') < 0, 'live 2.5u ranks above superseded 5u');

const early = { team: '1pm', units: 1, gameTime: '2026-08-19T17:00:00Z' };
const late = { team: '7pm', units: 3, gameTime: '2026-08-19T23:00:00Z' };
ok(compareLockedPicks(early, late, 'time') < 0, 'Game Time ORDER is commence, not units');
ok(compareLockedPicks(late, early, 'units') < 0, 'Units ORDER still prefers 3u over 1u');

const a1 = { units: 2.5, stars: 5 };
const b1 = { units: 2.5, stars: 3 };
ok(compareLockedPicks(a1, b1, 'units') < 0, 'equal units: higher stars is the tiebreak');

const gradedWin = { team: 'Win', units: 1, outcome: 'WIN', status: 'COMPLETED', profit: 4 };
const gradedLoss = { team: 'Loss', units: 3, outcome: 'LOSS', status: 'COMPLETED', profit: -1 };
const openBig = { team: 'Open', units: 5, outcome: null, status: 'PENDING', profit: 0 };
const byProfit = [openBig, gradedLoss, gradedWin].sort((a, b) => compareLockedPicks(a, b, 'profit'));
ok(byProfit.map((p) => p.team).join() === 'Win,Loss,Open', 'profit ranks graded results and leaves a 0 stamp on an open play in unit order');
ok(compareLockedPicks(openBig, { ...openBig, team: 'Smaller', units: 1 }, 'winpct') < 0, 'win % with no rate stays on units');

console.log(`testLockedPickSort: ${n} assertions passed`);
