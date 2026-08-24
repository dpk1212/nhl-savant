/**
 * Live sports P&L stamp — profile all-time + labeled monthly.
 * Usage: node tests/testPolymarketSportsPnl.mjs
 */
import assert from 'node:assert/strict';
import {
  parseSportsLeaderboardPnl,
  parseLbAmount,
  liveFromProfitAndVolume,
  applyLivePnlToPosition,
  stampLiveSportsPnl,
} from '../scripts/lib/polymarketSportsPnl.js';

const WALLET = '0x5e9458202b5817a72cf81105ec8a30e6f3705ba1';
let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

const liveRow = parseSportsLeaderboardPnl([{
  rank: '1897112',
  proxyWallet: WALLET,
  pnl: -535171.827280001,
  vol: 56831271.85772401,
}], WALLET);

ok(liveRow.pnl === -535172, `round to nearest dollar, got ${liveRow.pnl}`);
ok(liveRow.roi === -0.9, `roi from pnl/vol, got ${liveRow.roi}`);
ok(parseSportsLeaderboardPnl([{ proxyWallet: WALLET, pnl: 496243 }], '0xdead') === null, 'wrong wallet → null');
ok(parseSportsLeaderboardPnl([{ pnl: -1 }], WALLET) === null, 'missing proxyWallet → null');

ok(parseLbAmount([{ proxyWallet: WALLET, amount: 115447.07 }], WALLET) === 115447.07, 'monthly profit amount');
ok(liveFromProfitAndVolume(23493214.918, 1846253881).pnl === 23493215, 'positive all-time rounds');
ok(liveFromProfitAndVolume(23493214.918, 1846253881).roi === 1.3, 'positive roi');

const pos = { wallet: WALLET, totalPnl: 496243, sportROI: 3.3, sportVol: 14e6, invested: 123200 };
applyLivePnlToPosition(pos, {
  pnl: -535172,
  roi: -0.9,
  vol: 56831271,
  monthlyPnl: 115447,
  monthlyRoi: 0.5,
});
ok(pos.totalPnl === -535172, 'overwrites stale lifetime snapshot');
ok(pos.monthlyPnl === 115447, 'stamps monthly separately');
ok(pos.monthlyRoi === 0.5, 'monthly ROI tagged');
ok(pos.invested === 123200, 'does not touch stake');

const data = {
  MLB: {
    sd_min: {
      positions: [
        { wallet: WALLET, totalPnl: 496243, sportROI: 3.3, invested: 5000, side: 'away' },
      ],
    },
  },
  _meta: { scannedAt: 'x' },
};

const fakeFetch = async (url) => {
  if (String(url).includes('/profit')) {
    return { ok: true, json: async () => [{ proxyWallet: WALLET, amount: -535171.827280001 }] };
  }
  if (String(url).includes('/volume')) {
    return { ok: true, json: async () => [{ proxyWallet: WALLET, amount: 56831271.85772401 }] };
  }
  if (String(url).includes('timePeriod=month')) {
    return { ok: true, json: async () => [{ proxyWallet: WALLET, pnl: 115447.070192, vol: 21081212.88 }] };
  }
  return { ok: true, json: async () => [{ proxyWallet: WALLET, pnl: -535171.827280001, vol: 56831271.85772401 }] };
};

const stats = await stampLiveSportsPnl([data], { fetchFn: fakeFetch, concurrency: 1 });
ok(stats.stamped === 1, 'stamps the open position');
ok(data.MLB.sd_min.positions[0].totalPnl === -535172, 'lifetime is all-time');
ok(data.MLB.sd_min.positions[0].monthlyPnl === 115447, 'monthly is not labeled into lifetime');
ok(data.MLB.sd_min.positions[0].side === 'away', 'does not touch side');

console.log(`ok ${n} polymarket sports pnl`);
