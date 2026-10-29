import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyTop3PickRung,
  buildTop3PickRanks,
  isTop3PickPrice,
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

test('rank uses only bets before the morning, and needs four wallets', () => {
  const { rows } = board();
  const index = buildTop3PickRanks(rows, DAY);
  assert.equal(index.get('NBA|SPREAD|aaaaaa').rank, 1);
  assert.equal(index.get('NBA|SPREAD|cccccc').rank, 3);
  assert.equal(index.get('NBA|SPREAD|eeeeee').rank, 5);
  assert.equal(index.get('NBA|SPREAD|aaaaaa').n, 5);
  assert.equal(top3PickWindowStart(DAY), '2026-09-29');
  const thin = buildTop3PickRanks(rows.filter((r) => r.walletShort === 'aaaaaa' || r.walletShort === 'bbbbbb'), DAY);
  assert.equal(thin.size, 0);
});

test('4u at 1× to 1.5×, 2u under 1×, and a top-3 wallet on the other side blocks', () => {
  const { ranks } = board();
  const under = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY, ranks,
    positions: [bet()],
  });
  assert.equal(under.action, 'rescue');
  assert.equal(under.units, 2);

  const full = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY,
    positions: [bet({ betMultiplier: 1.2 })], ranks,
  });
  assert.equal(full.units, 4);

  const press = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY,
    positions: [bet({ betMultiplier: 1.5 })], ranks,
  });
  assert.equal(press.action, 'hold');

  const kept = applyTop3PickRung({
    units: 5, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY,
    positions: [bet({ betMultiplier: 1.2 })], ranks,
  });
  assert.equal(kept.action, 'hold');
  assert.equal(kept.units, 5);

  const blocked = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY,
    positions: [bet(), bet({ walletShort: 'bbbbbb', side: 'home', betMultiplier: 2 })], ranks,
  });
  assert.equal(blocked.reason, 'top3_against');
  assert.equal(blocked.units, 0);
});

test('a favorite, a day before the cutover, and another sport do not fire', () => {
  const { ranks } = board();
  const fav = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: DAY, ranks,
    positions: [bet({ pinnacleOdds: -110 })],
  });
  assert.equal(fav.fires, false);
  const early = applyTop3PickRung({
    units: 0, sport: 'NBA', market: 'SPREAD', side: 'away', pickDate: '2026-10-28',
    positions: [bet()], ranks,
  });
  assert.equal(early.fires, false);
  const soccer = applyTop3PickRung({
    units: 0, sport: 'SOC', market: 'ML', side: 'away', pickDate: DAY,
    positions: [bet()], ranks,
  });
  assert.equal(soccer.fires, false);
});
