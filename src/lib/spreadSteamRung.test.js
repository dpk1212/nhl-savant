import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applySpreadSteamRung,
  buildSpreadSteamBook,
  spreadSteamSkill,
  steamCoversSpreadRung,
} from './spreadSteamRung.js';

const DAY = '2026-11-16';

function prior(wallet, n, price, wonRate, line = -3.5) {
  const rows = [];
  for (let i = 0; i < n; i += 1) {
    const date = new Date(Date.parse('2026-08-01T00:00:00Z') + i * 86400000).toISOString().slice(0, 10);
    const won = i >= n - Math.round(n * wonRate);
    rows.push({
      wallet,
      date,
      sport: 'NBA',
      marketType: 'SPREAD',
      side: 'home',
      gameKey: `g${wallet}${i}`,
      invested: 100,
      avgPrice: price,
      entryLine: line,
      won,
      result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

function book() {
  return buildSpreadSteamBook([
    ...prior('aaaaaa', 20, 0.5, 0.8),
    ...prior('bbbbbb', 20, 0.5, 0.55),
  ], DAY);
}

function pos(wallet, side, line = -3.5, invested = 100) {
  return {
    wallet, side, invested, avgPrice: 0.5, entryLine: line, sport: 'NBA', marketType: 'SPREAD',
  };
}

test('skill uses the exact band at 4 and the same-side neighbors at 6', () => {
  const cells = { 'laying|3 to 7': [4, 4, 2] };
  assert.ok(spreadSteamSkill(cells, 'NBA', -6) >= 8);
  const thin = { 'laying|3 to 7': [3, 3, 1.5], 'laying|to 3': [2, 0, 1] };
  assert.equal(spreadSteamSkill(thin, 'NBA', -6), null);
  thin['laying|7 to 10'] = [3, 3, 1.5];
  assert.ok(spreadSteamSkill(thin, 'NBA', -6) >= 8);
  assert.equal(spreadSteamSkill(cells, 'NBA', 6), null);
  assert.equal(spreadSteamSkill(cells, 'NBA', 0), null);
});

test('4.5 after rounding is the rung and 4.4 is not', () => {
  assert.equal(steamCoversSpreadRung(4.5), true);
  assert.equal(steamCoversSpreadRung(4.45), true);
  assert.equal(steamCoversSpreadRung(10), true);
  assert.equal(steamCoversSpreadRung(4.44), false);
  assert.equal(steamCoversSpreadRung(0), false);
  assert.equal(steamCoversSpreadRung(-1), false);
  assert.equal(steamCoversSpreadRung(null), false);
});

test('both shorten rungs set the side to 3u and replace the stake that arrived', () => {
  const index = book();
  const positions = [pos('aaaaaa', 'home', -3.5, 500)];
  const mid = applySpreadSteamRung({
    units: 1, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions, steam: 6, book: index,
  });
  assert.equal(mid.action, 'STAKE');
  assert.equal(mid.units, 3);
  const ten = applySpreadSteamRung({
    units: 5, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions, steam: 12, book: index,
  });
  assert.equal(ten.units, 3);
  const zero = applySpreadSteamRung({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions, steam: 4.5, book: index,
  });
  assert.equal(zero.units, 3);
});

test('a shorten under 4.5, the other side of the number, and skill under 8 stay put', () => {
  const index = book();
  const flat = applySpreadSteamRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: [pos('aaaaaa', 'home')], steam: 4.4, book: index,
  });
  assert.equal(flat.action, 'PASS');
  assert.equal(flat.units, 2);
  const dog = applySpreadSteamRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: [pos('aaaaaa', 'home', 3.5)], steam: 8, book: index,
  });
  assert.equal(dog.action, 'PASS');
  const under = applySpreadSteamRung({
    units: 2, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: [pos('bbbbbb', 'home')], steam: 8, book: index,
  });
  assert.equal(under.action, 'PASS');
});

test('a moneyline, a total, an earlier date, a manual stake, and a kill stay put', () => {
  const index = book();
  const positions = [pos('aaaaaa', 'home')];
  const args = {
    units: 2, pickDate: DAY, sport: 'NBA', side: 'home', positions, steam: 8, book: index,
  };
  assert.equal(applySpreadSteamRung({ ...args, market: 'ML' }).units, 2);
  assert.equal(applySpreadSteamRung({ ...args, market: 'TOTAL' }).action, 'PASS');
  assert.equal(applySpreadSteamRung({ ...args, market: 'SPREAD', pickDate: '2026-11-15' }).action, 'EXEMPT');
  assert.equal(applySpreadSteamRung({ ...args, market: 'SPREAD', manual: true }).units, 2);
  assert.equal(applySpreadSteamRung({ ...args, market: 'SPREAD', killed: true }).action, 'EXEMPT');
});
