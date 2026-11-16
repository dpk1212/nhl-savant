import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyMlMiniRung,
  buildMlMiniBook,
  mlMiniSkill,
  steamIsPositive,
} from './mlMiniRung.js';

const DAY = '2026-11-16';

function prior(wallet, n, price, wonRate, invested = 100) {
  const rows = [];
  for (let i = 0; i < n; i += 1) {
    const date = new Date(Date.parse('2026-08-01T00:00:00Z') + i * 86400000).toISOString().slice(0, 10);
    const won = i >= n - Math.round(n * wonRate);
    rows.push({
      wallet,
      date,
      sport: 'NBA',
      marketType: 'ML',
      side: 'home',
      gameKey: `g${wallet}${i}`,
      invested,
      avgPrice: price,
      won,
      result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

function book() {
  return buildMlMiniBook([
    ...prior('aaaaaa', 20, 0.5, 0.8, 100),
    ...prior('bbbbbb', 20, 0.5, 0.8, 100),
    ...prior('cccccc', 20, 0.5, 0.55, 100),
  ], DAY);
}

function pos(wallet, side, invested, price = 0.5) {
  return { wallet, side, invested, avgPrice: price, sport: 'NBA', marketType: 'ML' };
}

test('skill uses the exact band at 4 and the neighbors at 6', () => {
  const bands = Array.from({ length: 7 }, () => [0, 0, 0]);
  bands[2] = [4, 4, 2];
  assert.ok(mlMiniSkill(bands, 0.5) >= 8);
  bands[2] = [3, 3, 1.5];
  bands[1] = [2, 0, 1];
  bands[3] = [1, 0, 0.5];
  assert.equal(mlMiniSkill(bands, 0.5) == null || mlMiniSkill(bands, 0.5) < 8, true);
  bands[1] = [3, 3, 1];
  assert.ok(mlMiniSkill(bands, 0.5) >= 8);
});

test('a tenth above 0 is a shorten and a tenth of 0 is flat', () => {
  assert.equal(steamIsPositive(0.06), true);
  assert.equal(steamIsPositive(0.04), false);
  assert.equal(steamIsPositive(0), false);
  assert.equal(steamIsPositive(-1), false);
  assert.equal(steamIsPositive(null), false);
});

test('nobody against is 3u and a shorten is 4u', () => {
  const index = book();
  const positions = [pos('aaaaaa', 'home', 100)];
  const flat = applyMlMiniRung({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, steam: 0, book: index,
  });
  assert.equal(flat.action, 'STAKE');
  assert.equal(flat.units, 3);
  assert.equal(flat.against, 0);
  const up = applyMlMiniRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, steam: 2.2, book: index,
  });
  assert.equal(up.units, 4);
});

test('two wallets for and nobody against stay on the 3u path', () => {
  const index = book();
  const positions = [pos('aaaaaa', 'home', 100), pos('bbbbbb', 'home', 120)];
  const out = applyMlMiniRung({
    units: 5, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, steam: 0, book: index,
  });
  assert.equal(out.units, 3);
  assert.equal(out.against, 0);
});

test('somebody against is 2u on a shorten and a mute otherwise', () => {
  const index = book();
  const positions = [pos('aaaaaa', 'home', 100), pos('bbbbbb', 'away', 80)];
  const mute = applyMlMiniRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, steam: 0, book: index,
  });
  assert.equal(mute.action, 'MUTE');
  assert.equal(mute.units, 0);
  assert.equal(mute.against, 1);
  const two = applyMlMiniRung({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, steam: 6, book: index,
  });
  assert.equal(two.action, 'STAKE');
  assert.equal(two.units, 2);
});

test('under 8, outside the size band, and a spread do not fire', () => {
  const index = book();
  const thin = [pos('cccccc', 'home', 100)];
  assert.equal(applyMlMiniRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions: thin, book: index,
  }).action, 'PASS');
  const press = [pos('aaaaaa', 'home', 200)];
  assert.equal(applyMlMiniRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions: press, book: index,
  }).action, 'PASS');
  const dust = [pos('aaaaaa', 'home', 50)];
  assert.equal(applyMlMiniRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions: dust, book: index,
  }).action, 'PASS');
  assert.equal(applyMlMiniRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: [pos('aaaaaa', 'home', 100)], book: index,
  }).units, 1);
});

test('a date before the rung, a manual stake, and a kill stay put', () => {
  const index = book();
  const positions = [pos('aaaaaa', 'home', 100)];
  assert.equal(applyMlMiniRung({
    units: 1, pickDate: '2026-11-15', sport: 'NBA', market: 'ML', side: 'home', positions, book: index,
  }).action, 'EXEMPT');
  assert.equal(applyMlMiniRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, manual: true, book: index,
  }).units, 2);
  assert.equal(applyMlMiniRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'ML', side: 'home', positions, killed: true, book: index,
  }).action, 'EXEMPT');
});
