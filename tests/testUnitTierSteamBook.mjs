/**
 * Unit-tier steam scoreboard helpers.
 * Run: node tests/testUnitTierSteamBook.mjs
 */
import assert from 'node:assert/strict';
import { cutWorking, fmt, promoteRead } from '../scripts/analyzeUnitTierSteamBook.mjs';

function row({ won, units = 2, profit, incoming, cfProfit }) {
  return {
    won,
    units,
    profit: profit ?? (won ? units * 0.91 : -units),
    incoming: incoming ?? units,
    cfProfit: cfProfit ?? (won ? (incoming ?? units) * 0.91 : -(incoming ?? units)),
  };
}

{
  const a = fmt([
    row({ won: true, units: 3, profit: 2.7 }),
    row({ won: false, units: 3, profit: -3 }),
    row({ won: null, units: 3 }),
  ]);
  assert.equal(a.n, 2);
  assert.equal(a.w, 1);
  assert.equal(a.l, 1);
  assert.equal(a.pending, 1);
  assert.equal(a.stake, 6);
  assert.ok(Math.abs(a.pnl - (-0.3)) < 1e-9);
}

{
  const a = fmt([
    row({ won: true, incoming: 4, cfProfit: 3.6 }),
    row({ won: false, incoming: 4, cfProfit: -4 }),
  ], { unitsKey: 'incoming', pnlKey: 'cfProfit' });
  assert.equal(a.stake, 8);
  assert.ok(Math.abs(a.pnl - (-0.4)) < 1e-9);
}

assert.equal(cutWorking({ n: 5, wr: 80, pnl: 10 }), 'thin — keep logging');
assert.equal(cutWorking({ n: 5, wr: 100, pnl: 23 }), 'WATCH — muted pile is winning (thin n)');
assert.equal(cutWorking({ n: 20, wr: 45, pnl: -8 }), 'WORKING — cut is trash');
assert.equal(cutWorking({ n: 20, wr: 55, pnl: -8 }), 'WORKING — cut leaks units');
assert.equal(cutWorking({ n: 20, wr: 70, pnl: 12 }), 'WATCH — muted pile is winning');
assert.equal(cutWorking({ n: 20, wr: 58, pnl: 2 }), 'WATCH — muted WR is healthy');
assert.equal(cutWorking({ n: 20, wr: 52, pnl: 2 }), 'hold — mixed');

assert.equal(promoteRead({ n: 3, wr: 33, pnl: -4.7 }), 'thin — keep logging');
assert.equal(promoteRead({ n: 8, wr: 50, pnl: -1.1 }), 'hold — mixed');
assert.equal(promoteRead({ n: 40, wr: 62, pnl: 19 }), 'WORKING — promote is +');
assert.equal(promoteRead({ n: 10, wr: 40, pnl: -8 }), 'WATCH — promote is leaking');

console.log('testUnitTierSteamBook: ok');
