/**
 * Kalshi TOTAL O/U exchange — never paint ML tradeFlow onto totals.
 * Run: node tests/testKalshiTotalExchange.mjs
 */
import {
  exchangeFlowSplit,
  totalExchangeFlowSplit,
  buildWideBoardMoneySplits,
} from '../src/lib/boardMoneySplits.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const kalshiData = {
  MLB: {
    atl_mil: {
      tradeFlow: {
        // ML cash — must NOT leak into TOTAL split
        awayMoneyPct: 10,
        homeMoneyPct: 90,
        sampleCash: 50000,
      },
      totalTradeFlow: {
        overMoneyPct: 25,
        underMoneyPct: 75,
        sampleCash: 20000,
      },
      whales: {
        topTrades: [
          { amount: 5000, outcome: 'Milwaukee', side: 'BUY' },
          { amount: 3000, outcome: 'Under', side: 'BUY', marketType: 'total' },
          { amount: 1000, outcome: 'Over', side: 'BUY', marketType: 'total' },
        ],
      },
    },
  },
};

// TOTAL Over (playSideNorm=home) uses totalTradeFlow only
{
  const split = totalExchangeFlowSplit({
    sport: 'MLB', gameKey: 'atl_mil', playSideNorm: 'home', kalshiData,
  });
  assert(split.ours === 5000, `over amt want 5000 got ${split.ours}`);
  assert(split.theirs === 15000, `under amt want 15000 got ${split.theirs}`);
}

// ML exchange still uses tradeFlow
{
  const split = exchangeFlowSplit({
    sport: 'MLB', gameKey: 'atl_mil', playSideNorm: 'home',
    polyData: null, kalshiData,
  });
  assert(split.ours === 45000, `ML home want 45000 got ${split.ours}`);
  assert(split.theirs === 5000, `ML away want 5000 got ${split.theirs}`);
}

// Full TOTAL board: wallets + O/U whales + residual totalTradeFlow
{
  const rawTotal = {
    MLB: {
      atl_mil: {
        positions: [
          { wallet: '0xCONFIRMED000001', side: 'over', invested: 3100, avgSportBet: 1000 },
        ],
      },
    },
  };
  const profiles = new Map([
    ['000001', { bySport: { MLB: { whitelistTier: 'CONFIRMED' } }, verdict: null }],
  ]);
  const r = buildWideBoardMoneySplits({
    sport: 'MLB',
    gameKey: 'atl_mil',
    marketType: 'total',
    playSideNorm: 'home',
    rawTotal,
    kalshiData,
    getWalletProfile: (s) => profiles.get(String(s).toLowerCase()) || null,
    away: 'Atlanta',
    home: 'Milwaukee',
    includeExchange: true,
  });
  // Whale Under $3K + Over $1K counted; residual = 20K - 4K = 16K split 25/75
  // Residual ours (over) = max(0, 5000 - 1000) = 4000
  // Residual theirs (under) = max(0, 15000 - 3000) = 12000
  assert(r.exchange.ours === 4000, `ex ours ${r.exchange.ours}`);
  assert(r.exchange.theirs === 12000, `ex theirs ${r.exchange.theirs}`);
  assert(r.whales.ours === 1000, `whale ours ${r.whales.ours}`);
  assert(r.whales.theirs === 3000, `whale theirs ${r.whales.theirs}`);
  // Confirmed wallet 3100 + whale over 1000 + residual over 4000
  assert(r.full.ours === 3100 + 1000 + 4000, `full ours ${r.full.ours}`);
  assert(r.full.theirs === 3000 + 12000, `full theirs ${r.full.theirs}`);
  // Losing + Confirmed stay wallet-only — Kalshi O/U never paints those bars
  assert(r.losers.ours === 0 && r.losers.theirs === 0, `losers must stay wallet-only, got ${JSON.stringify(r.losers)}`);
  assert(r.confirmed.ours === 3100 && r.confirmed.theirs === 0, `confirmed must stay wallet-only, got ${JSON.stringify(r.confirmed)}`);

  const noEx = buildWideBoardMoneySplits({
    sport: 'MLB',
    gameKey: 'atl_mil',
    marketType: 'total',
    playSideNorm: 'home',
    rawTotal,
    kalshiData,
    getWalletProfile: (s) => profiles.get(String(s).toLowerCase()) || null,
    away: 'Atlanta',
    home: 'Milwaukee',
    includeExchange: false,
  });
  assert(noEx.losers.ours === r.losers.ours && noEx.losers.theirs === r.losers.theirs, 'losers unchanged vs no-exchange');
  assert(noEx.confirmed.ours === r.confirmed.ours && noEx.confirmed.theirs === r.confirmed.theirs, 'confirmed unchanged vs no-exchange');
  assert(noEx.full.ours !== r.full.ours, 'Full must change when Kalshi O/U exchange is on');
}

console.log('testKalshiTotalExchange: ok');
