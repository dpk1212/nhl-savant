/**
 * Battle bars count the card's market only.
 * A moneyline card must not paint spread tickets as confirmed sharp money.
 * Run: node tests/testBoardMoneyMarket.mjs
 */
import { buildWideBoardMoneySplits } from '../src/lib/boardMoneySplits.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const profiles = new Map([
  ['8d3672', { bySport: { NFL: { whitelistTier: 'CONFIRMED' } }, verdict: 'MIXED_PICKS_GOOD_$_BAD' }],
  ['e3ca79', { bySport: { NFL: { whitelistTier: 'CONFIRMED' } }, verdict: 'CONFIRMED_WINNER' }],
  ['12f826', { bySport: { NFL: { whitelistTier: 'CONFIRMED' } }, verdict: 'CONFIRMED_WINNER' }],
  ['aaedcd', { bySport: { NFL: { whitelistTier: 'WR50' } }, verdict: 'CONFIRMED_BLEEDER' }],
]);

const rawMl = {
  NFL: {
    car_gb: {
      positions: [
        { wallet: '0x5331121e9f2f206d8c06ae6235761b1a3f8d3672', side: 'home', invested: 825, avgSportBet: 2023 },
      ],
    },
  },
};

const rawSpread = {
  NFL: {
    car_gb: {
      positions: [
        { wallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa12f826', side: 'away', invested: 20520 },
        { wallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa12f826', side: 'away', invested: 13788 },
        { wallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae3ca79', side: 'home', invested: 1500 },
        { wallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaedcd', side: 'home', invested: 2403 },
      ],
    },
  },
};

const polyData = {
  NFL: {
    car_gb: {
      sampleCash: 100000,
      awayMoneyPct: 40,
      homeMoneyPct: 60,
      whales: { topTrades: [{ amount: 5000, outcome: 'Packers', wallet: '0xwhale1' }] },
    },
  },
};

const getWalletProfile = (s) => profiles.get(String(s).slice(-6).toLowerCase()) || null;

const shared = {
  sport: 'NFL',
  gameKey: 'car_gb',
  playSideNorm: 'home',
  rawMl,
  rawSpread,
  polyData,
  away: 'Panthers',
  home: 'Packers',
  getWalletProfile,
  includeExchange: true,
};

{
  const ml = buildWideBoardMoneySplits({ ...shared, marketType: 'ml' });
  assert(ml.confirmed.ours === 825, `ML confirmed ours want 825 got ${ml.confirmed.ours}`);
  assert(ml.confirmed.theirs === 0, `ML confirmed theirs want 0 got ${ml.confirmed.theirs}`);
  assert(ml.confirmed.oursPct === 100, `ML confirmed pct want 100 got ${ml.confirmed.oursPct}`);
  assert(ml.losers.ours === 0 && ml.losers.theirs === 0, `ML losers must ignore spread bleeders, got ${ml.losers.ours}/${ml.losers.theirs}`);
  assert(ml.walletRows.every((r) => r.sourceMkt === 'ML'), 'ML wallet rows must be ML');
  assert(ml.exchange.total > 0, 'ML card still keeps moneyline flow');
  assert(ml.whales.ours === 5000, `ML whale ours want 5000 got ${ml.whales.ours}`);
}

{
  const sp = buildWideBoardMoneySplits({ ...shared, marketType: 'spread' });
  assert(sp.confirmed.ours === 1500, `spread confirmed ours want 1500 got ${sp.confirmed.ours}`);
  assert(sp.confirmed.theirs === 20520, `spread confirmed keeps the larger ticket, got ${sp.confirmed.theirs}`);
  assert(sp.losers.ours === 2403, `spread loser ours want 2403 got ${sp.losers.ours}`);
  assert(sp.walletRows.every((r) => r.sourceMkt === 'SPREAD'), 'spread wallet rows must be spread');
  assert(sp.exchange.total === 0, `spread must not borrow ML flow, got ${sp.exchange.total}`);
  assert(sp.whales.total === 0, `spread must not borrow ML whales, got ${sp.whales.total}`);
  assert(!sp.walletRows.some((r) => r.wallet.endsWith('8d3672')), 'spread card must not include the ML ticket');
}

console.log('testBoardMoneyMarket: ok');
