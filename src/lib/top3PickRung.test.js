import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyTop3PickRung,
  buildTop3PickRanks,
  hydrateTop3PickRanks,
  isTop3PickLive,
  isTop3PickPrice,
  serializeTop3PickRanks,
  top3PickWindowStart,
} from './top3PickRung.js';

const DAY = '2026-10-29';

function leg(wallet, date, settled, invested = 100) {
  return {
    walletShort: wallet,
    date,
    sport: 'NBA',
    marketType: 'SPREAD',
    status: 'GRADED',
    invested,
    settledPnl: settled,
  };
}

function board() {
  const rows = [];
  const wallets = [
    ['aaaaaa', 80],
    ['bbbbbb', 40],
    ['cccccc', 20],
    ['dddddd', -10],
    ['eeeeee', -30],
  ];
  for (const [wallet, pnl] of wallets) {
    for (let i = 0; i < 5; i++) {
      const date = `2026-10-${String(20 + i).padStart(2, '0')}`;
      rows.push(leg(wallet, date, pnl));
    }
  }
  rows.push(leg('aaaaaa', DAY, 500));
  return { rows, ranks: buildTop3PickRanks(rows, DAY) };
}

function bet(over) {
  return {
    walletShort: 'cccccc',
    side: 'away',
    betMultiplier: 0.8,
    pinnacleOdds: -100,
    avgPrice: 0.51,
    ...over,
  };
}

test('pick price is −100 through +120, and 45¢ up to just under 52¢', () => {
  assert.equal(isTop3PickPrice(-110, null), false);
  assert.equal(isTop3PickPrice(-100, null), true);
  assert.equal(isTop3PickPrice(120, null), true);
  assert.equal(isTop3PickPrice(121, null), false);
  assert.equal(isTop3PickPrice(null, 0.45), true);
  assert.equal(isTop3PickPrice(null, 0.519), true);
  assert.equal(isTop3PickPrice(null, 0.52), false);
});

test('the rung is off, so it does not rank or size', () => {
  assert.equal(isTop3PickLive(DAY), false);
  assert.equal(isTop3PickLive('2026-11-15'), false);
  assert.equal(top3PickWindowStart(DAY), '2026-09-29');
  const { rows } = board();
  assert.equal(buildTop3PickRanks(rows, DAY).size, 0);
  const held = applyTop3PickRung({
    units: 1, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY,
    positions: [bet({ betMultiplier: 1.2 })], odds: -100,
  });
  assert.equal(held.fires, false);
  assert.equal(held.action, 'hold');
  assert.equal(held.units, 1);
  assert.equal(held.reason, 'off');
  const zero = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: '2026-11-15',
    positions: [bet({ betMultiplier: 1.2 })], odds: -100,
  });
  assert.equal(zero.fires, false);
  assert.equal(zero.units, 0);
});

test('the morning seats survive a cache round-trip', () => {
  const { ranks } = board();
  const again = hydrateTop3PickRanks(serializeTop3PickRanks(ranks, DAY));
  assert.equal(again.size, ranks.size);
  for (const [key, info] of ranks) {
    assert.deepEqual(again.get(key), {
      rank: info.rank, n: info.n, wins: info.wins, losses: info.losses, dol: info.dol,
    });
  }
});
