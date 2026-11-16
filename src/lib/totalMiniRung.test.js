import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyTotalMiniRung,
  buildTotalMiniBook,
  pressCoversTotalMini,
  steamIsFlat,
  totalMiniSkill,
} from './totalMiniRung.js';

const DAY = '2026-11-16';

function prior(wallet, n, price, wonRate, line = 6.5) {
  const rows = [];
  for (let i = 0; i < n; i += 1) {
    const date = new Date(Date.parse('2026-08-01T00:00:00Z') + i * 86400000).toISOString().slice(0, 10);
    const won = i >= n - Math.round(n * wonRate);
    rows.push({
      wallet,
      date,
      sport: 'NHL',
      marketType: 'TOTAL',
      side: 'over',
      gameKey: `g${wallet}${i}`,
      invested: 100,
      avgPrice: price,
      totalLine: line,
      won,
      result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

function book() {
  return buildTotalMiniBook([
    ...prior('aaaaaa', 20, 0.5, 0.8),
    ...prior('bbbbbb', 20, 0.5, 0.55),
  ], DAY);
}

function pos(wallet, side, line = 6.5, invested = 100) {
  return {
    wallet, side, invested, avgPrice: 0.5, totalLine: line, sport: 'NHL', marketType: 'TOTAL',
  };
}

function run(extra) {
  return applyTotalMiniRung({
    units: 1,
    pickDate: DAY,
    sport: 'NHL',
    market: 'TOTAL',
    side: 'over',
    positions: [pos('aaaaaa', 'over')],
    press: 6,
    steam: 0,
    book: book(),
    ...extra,
  });
}

test('skill uses the exact band at 4 and the same-side neighbors at 6', () => {
  const cells = { 'over|6.5': [4, 4, 2] };
  assert.ok(totalMiniSkill(cells, 'NHL', 'over', 6.5) >= 8);
  const thin = { 'over|6.5': [3, 3, 1.5], 'over|to 5.5': [2, 0, 1] };
  assert.equal(totalMiniSkill(thin, 'NHL', 'over', 6.5), null);
  thin['over|7+'] = [3, 3, 1.5];
  assert.ok(totalMiniSkill(thin, 'NHL', 'over', 6.5) >= 8);
  assert.equal(totalMiniSkill(cells, 'NHL', 'under', 6.5), null);
});

test('press of 5 and a flat tenth are the gates', () => {
  assert.equal(pressCoversTotalMini(5), true);
  assert.equal(pressCoversTotalMini(4.96), true);
  assert.equal(pressCoversTotalMini(4.94), false);
  assert.equal(pressCoversTotalMini(null), false);
  assert.equal(steamIsFlat(0), true);
  assert.equal(steamIsFlat(0.04), true);
  assert.equal(steamIsFlat(0.06), false);
  assert.equal(steamIsFlat(-0.2), false);
  assert.equal(steamIsFlat(null), false);
});

test('a qualifying mini with press of 5 and a flat line is 3u', () => {
  const out = run({});
  assert.equal(out.action, 'STAKE');
  assert.equal(out.units, 3);
  const up = run({ units: 5 });
  assert.equal(up.units, 3);
  const zero = run({ units: 0 });
  assert.equal(zero.units, 3);
});

test('a shorten, a press edge under 5, the other side, skill under 8, and size outside the band stay put', () => {
  assert.equal(run({ steam: 0.06 }).action, 'PASS');
  assert.equal(run({ steam: null }).action, 'PASS');
  assert.equal(run({ steam: -1 }).units, 1);
  assert.equal(run({ press: 4.9 }).action, 'PASS');
  assert.equal(run({ positions: [pos('aaaaaa', 'under')] }).action, 'PASS');
  assert.equal(run({ positions: [pos('bbbbbb', 'over')] }).action, 'PASS');
  assert.equal(run({ positions: [pos('aaaaaa', 'over', 6.5, 200)] }).action, 'PASS');
  assert.equal(run({ positions: [pos('aaaaaa', 'over', 6.5, 50)] }).units, 1);
});

test('a spread, an earlier date, a manual stake, and a kill stay put', () => {
  assert.equal(run({ market: 'SPREAD' }).action, 'PASS');
  assert.equal(run({ pickDate: '2026-11-15' }).action, 'EXEMPT');
  assert.equal(run({ manual: true }).units, 1);
  assert.equal(run({ killed: true }).action, 'EXEMPT');
});
