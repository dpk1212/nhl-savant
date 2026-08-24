/**
 * Live lifetime P&L from Polymarket — the number the profile page shows
 * for both winners and losers. Prefer lb-api /profit (ALL window). Fall
 * back to sports leaderboard user=. Never sum closed-positions realizedPnl
 * and never display wallet-profiles latest.lifetimePnl (frozen snapshot).
 */

const DATA_API = 'https://data-api.polymarket.com';
const LB_API = 'https://lb-api.polymarket.com';
const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'nhl-savant-sports-pnl',
};

export function parseSportsLeaderboardPnl(rows, wallet) {
  if (!Array.isArray(rows) || !wallet) return null;
  const want = String(wallet).toLowerCase();
  const row = rows.find((r) => String(r?.proxyWallet || '').toLowerCase() === want);
  if (!row) return null;
  const pnl = Number(row.pnl);
  if (!Number.isFinite(pnl)) return null;
  const vol = Number(row.vol);
  const roi = Number.isFinite(vol) && vol > 0 ? +((pnl / vol) * 100).toFixed(1) : 0;
  return {
    pnl: Math.round(pnl),
    vol: Number.isFinite(vol) ? vol : 0,
    roi,
  };
}

export async function fetchSportsAllTimePnl(wallet, fetchFn = globalThis.fetch) {
  if (!wallet) return null;
  const url = `${DATA_API}/v1/leaderboard?timePeriod=all&category=sports&orderBy=PNL&user=${encodeURIComponent(wallet)}&limit=1`;
  const res = await fetchFn(url, { headers: HEADERS });
  if (!res?.ok) return null;
  const rows = await res.json();
  return parseSportsLeaderboardPnl(rows, wallet);
}

/** lb-api /profit and /volume both return [{ proxyWallet, amount }]. */
export function parseLbAmount(rows, wallet) {
  if (!Array.isArray(rows) || !wallet) return null;
  const want = String(wallet).toLowerCase();
  const row = rows.find((r) => String(r?.proxyWallet || '').toLowerCase() === want);
  if (!row) return null;
  const amount = Number(row.amount);
  return Number.isFinite(amount) ? amount : null;
}

export function liveFromProfitAndVolume(profitAmt, volAmt) {
  if (profitAmt == null || !Number.isFinite(profitAmt)) return null;
  const vol = Number.isFinite(volAmt) && volAmt > 0 ? volAmt : 0;
  return {
    pnl: Math.round(profitAmt),
    vol,
    roi: vol > 0 ? +((profitAmt / vol) * 100).toFixed(1) : 0,
  };
}

/**
 * Profile all-time P&L (green or red) plus this-month sports P&L.
 * Sports month LB is the calendar-month number; do not label it lifetime.
 */
export async function fetchLiveWalletPnl(wallet, fetchFn = globalThis.fetch) {
  if (!wallet) return null;
  const q = encodeURIComponent(wallet);
  let fromProfit = null;
  let monthly = null;
  try {
    const [pRes, vRes, monthRes] = await Promise.all([
      fetchFn(`${LB_API}/profit?window=all&address=${q}`, { headers: HEADERS }),
      fetchFn(`${LB_API}/volume?window=all&address=${q}`, { headers: HEADERS }),
      fetchFn(`${DATA_API}/v1/leaderboard?timePeriod=month&category=sports&orderBy=PNL&user=${q}&limit=1`, { headers: HEADERS }),
    ]);
    const profitAmt = pRes?.ok ? parseLbAmount(await pRes.json(), wallet) : null;
    const volAmt = vRes?.ok ? parseLbAmount(await vRes.json(), wallet) : null;
    fromProfit = liveFromProfitAndVolume(profitAmt, volAmt);
    monthly = monthRes?.ok ? parseSportsLeaderboardPnl(await monthRes.json(), wallet) : null;
  } catch {
    // fall through
  }
  if (!fromProfit) fromProfit = await fetchSportsAllTimePnl(wallet, fetchFn);
  if (!fromProfit && !monthly) return null;
  return {
    pnl: fromProfit?.pnl ?? 0,
    vol: fromProfit?.vol ?? 0,
    roi: fromProfit?.roi ?? 0,
    monthlyPnl: monthly?.pnl ?? null,
    monthlyVol: monthly?.vol ?? 0,
    monthlyRoi: monthly?.roi ?? null,
  };
}

export function livePnlFileBody(byWallet, fetchedAt = new Date().toISOString()) {
  const out = { fetchedAt };
  if (!byWallet) return out;
  for (const [wallet, live] of byWallet) {
    if (!live) continue;
    out[wallet] = { pnl: live.pnl, vol: live.vol, roi: live.roi };
  }
  return out;
}

export function applyLivePnlToPosition(pos, live) {
  if (!pos || !live) return pos;
  if (Number.isFinite(live.pnl)) {
    pos.totalPnl = live.pnl;
    pos.sportPnlTotal = live.pnl;
    pos.sportPnl = live.pnl;
  }
  if (Number.isFinite(live.roi)) pos.sportROI = live.roi;
  if (live.vol > 0) pos.sportVol = live.vol;
  if (live.monthlyPnl != null && Number.isFinite(live.monthlyPnl)) {
    pos.monthlyPnl = live.monthlyPnl;
  }
  if (Number.isFinite(live.monthlyRoi)) pos.monthlyRoi = live.monthlyRoi;
  return pos;
}

export function collectPositionWallets(data) {
  const wallets = new Set();
  forEachPosition(data, (pos) => {
    const w = pos?.wallet;
    if (typeof w === 'string' && w.startsWith('0x')) wallets.add(w.toLowerCase());
  });
  return wallets;
}

export function forEachPosition(data, fn) {
  if (!data || typeof data !== 'object') return;
  for (const [key, sportGames] of Object.entries(data)) {
    if (key === 'scanHeartbeat' || key === '_meta' || key === 'scannedAt') continue;
    if (!sportGames || typeof sportGames !== 'object' || Array.isArray(sportGames)) continue;
    for (const game of Object.values(sportGames)) {
      if (!Array.isArray(game?.positions)) continue;
      for (const pos of game.positions) fn(pos, game);
    }
  }
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runNext = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  };
  const lanes = Array.from({ length: Math.min(concurrency, items.length) }, runNext);
  await Promise.all(lanes);
  return results;
}

/**
 * Overwrite display P&L/ROI on every position from the live sports
 * all-time leaderboard. Qualification / mute / size gates are not touched.
 */
export async function stampLiveSportsPnl(datasets, {
  fetchFn = globalThis.fetch,
  concurrency = 4,
  retries = 2,
} = {}) {
  const wallets = new Set();
  for (const data of datasets) {
    for (const w of collectPositionWallets(data)) wallets.add(w);
  }
  const list = [...wallets];
  const byWallet = new Map();

  await mapPool(list, concurrency, async (wallet) => {
    let live = null;
    for (let i = 0; i <= retries; i++) {
      try {
        live = await fetchLiveWalletPnl(wallet, fetchFn);
        if (live) break;
      } catch {
        live = null;
      }
      if (i < retries) await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
    if (live) byWallet.set(wallet, live);
  });

  let stamped = 0;
  let missed = 0;
  for (const data of datasets) {
    forEachPosition(data, (pos) => {
      const live = byWallet.get(String(pos.wallet || '').toLowerCase());
      if (!live) {
        missed++;
        return;
      }
      applyLivePnlToPosition(pos, live);
      stamped++;
    });
  }
  return { wallets: list.length, fetched: byWallet.size, stamped, missed, byWallet };
}
