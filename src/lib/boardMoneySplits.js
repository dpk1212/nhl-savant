/**
 * Wide board money for locked-card battle bars.
 *
 * Accuracy rules (2026-08-21 audit):
 *   1. Count ONLY the pick's market axis (ML+SPREAD together; TOTAL = O/U only).
 *      Never fold ML/SPREAD into "against" on a totals pick.
 *   2. Never paint ML sampleCash as Over/Under (totals get no exchange flow).
 *   3. Full = wallets + whales (deduped by wallet|side) + exchange residual
 *      (exchange minus whale $ already counted — no double-count).
 *   4. Losing = non CONFIRMED/FLAT from wallets + unmatched whale losers.
 *   5. Confirmed = CONFIRMED wallets only (no whales, no flow, no FLAT).
 *   6. Min ticket matches Vault battle field ($250).
 *
 * Display-only — never changes AGS / staking / units.
 */

/** Match Vault battle scatter floor (SharpFlow BATTLE_MIN_INVESTED). */
export const BOARD_MONEY_MIN_INVESTED = 250;

function splitOf(ours, theirs) {
  const o = Math.max(0, Number(ours) || 0);
  const t = Math.max(0, Number(theirs) || 0);
  const total = o + t;
  return {
    ours: Math.round(o),
    theirs: Math.round(t),
    total: Math.round(total),
    oursPct: total > 0 ? Math.round((o / total) * 100) : null,
  };
}

function marketKeyOf(marketType) {
  const m = String(marketType || '').toLowerCase();
  if (m === 'total' || m === 'totals') return 'TOTAL';
  if (m === 'spread' || m === 'spreads') return 'SPREAD';
  return 'ML';
}

function tierFor(wallet, sport, getWalletProfile) {
  if (!wallet || !getWalletProfile) return null;
  const short = String(wallet).slice(-6).toLowerCase();
  const p = getWalletProfile(short);
  return p?.bySport?.[sport]?.whitelistTier || null;
}

/** Normalize position side → away|home|draw (totals: over→home, under→away). */
function normSide(side) {
  const s = String(side || '').toLowerCase();
  if (s === 'over') return 'home';
  if (s === 'under') return 'away';
  if (s === 'away' || s === 'home' || s === 'draw') return s;
  return null;
}

/**
 * Open-position rows for the pick's market axis only.
 * ML/SPREAD pick → ML + SPREAD files (skip TOTAL).
 * TOTAL pick     → TOTAL file only (never fold team ML/spread into against).
 */
function collectWalletRows({
  sport,
  gameKey,
  marketType,
  playSideNorm,
  rawMl,
  rawSpread,
  rawTotal,
  intelExcludedSet,
  getWalletProfile,
}) {
  const mkt = marketKeyOf(marketType);
  const files = [
    { mk: 'ML', data: rawMl },
    { mk: 'SPREAD', data: rawSpread },
    { mk: 'TOTAL', data: rawTotal },
  ];
  const out = [];

  for (const { mk, data } of files) {
    if (!data || !sport || !gameKey) continue;

    // Market-axis gate — no cross-market pollution.
    if (mkt === 'TOTAL') {
      if (mk !== 'TOTAL') continue;
    } else if (mk === 'TOTAL') {
      continue;
    }

    const positions = data[sport]?.[gameKey]?.positions;
    if (!Array.isArray(positions)) continue;

    for (const p of positions) {
      if (!p?.wallet || !p?.side) continue;
      const inv = Number(p.invested) || 0;
      if (inv < BOARD_MONEY_MIN_INVESTED) continue;
      const wLower = String(p.wallet).toLowerCase();
      if (intelExcludedSet?.has(wLower)) continue;

      const marketSide = normSide(p.side);
      if (!marketSide) continue;

      const side = marketSide === playSideNorm ? 'ours' : 'against';

      const avg = Number(p.avgSportBet) || 0;
      const sizeRatio = Number.isFinite(p.sizeRatio) && p.sizeRatio > 0
        ? p.sizeRatio
        : (avg > 0 ? inv / avg : null);
      const tier = tierFor(wLower, sport, getWalletProfile);

      out.push({
        wallet: wLower,
        side,
        marketSide,
        invested: inv,
        sizeRatio,
        whitelist: tier,
        whitelisted: tier === 'CONFIRMED' || tier === 'FLAT',
        sourceMkt: mk,
        kind: 'wallet',
      });
    }
  }

  // Dedupe wallet|side|sourceMkt — keep max invested
  const seen = new Map();
  for (const r of out) {
    const k = `${r.wallet}|${r.side}|${r.sourceMkt}`;
    const cur = seen.get(k);
    if (!cur || r.invested > cur.invested) seen.set(k, r);
  }
  return [...seen.values()];
}

/**
 * Match a whale/trade outcome string to ours/against for this pick.
 * Returns 'ours' | 'against' | null.
 */
function outcomeToSide(outcome, {
  playSideNorm,
  marketType,
  away,
  home,
  awayShort,
  homeShort,
}) {
  const o = String(outcome || '').trim().toLowerCase();
  if (!o) return null;
  const mkt = marketKeyOf(marketType);

  if (mkt === 'TOTAL') {
    if (o === 'over' || o.startsWith('over')) {
      return playSideNorm === 'home' ? 'ours' : 'against';
    }
    if (o === 'under' || o.startsWith('under')) {
      return playSideNorm === 'away' ? 'ours' : 'against';
    }
    return null; // ML team outcomes don't map to totals
  }

  // ML / spread — prefer exact / prefix matches over fuzzy includes
  const awayNames = [away, awayShort].filter(Boolean).map((s) => String(s).toLowerCase());
  const homeNames = [home, homeShort].filter(Boolean).map((s) => String(s).toLowerCase());
  const hit = (names) => names.some((n) => {
    if (!n) return false;
    if (o === n) return true;
    if (o.startsWith(n) || n.startsWith(o)) return true;
    // Short abbrev only if token-boundary-ish (avoid "or" in "Panthers")
    if (n.length >= 3 && (o.includes(n) || n.includes(o))) return true;
    return false;
  });
  const isAway = hit(awayNames);
  const isHome = hit(homeNames);
  if (isAway && !isHome) return playSideNorm === 'away' ? 'ours' : 'against';
  if (isHome && !isAway) return playSideNorm === 'home' ? 'ours' : 'against';
  return null;
}

function collectWhaleRows({
  sport,
  gameKey,
  marketType,
  playSideNorm,
  polyData,
  kalshiData,
  away,
  home,
  awayShort,
  homeShort,
  intelExcludedSet,
  getWalletProfile,
}) {
  const rows = [];
  const poly = polyData?.[sport]?.[gameKey];
  const kalshi = kalshiData?.[sport]?.[gameKey];
  const ctx = { playSideNorm, marketType, away, home, awayShort, homeShort };

  const pushTrade = (t, source) => {
    const amt = Number(t?.amount) || 0;
    if (amt < BOARD_MONEY_MIN_INVESTED) return;
    const side = outcomeToSide(t.outcome, ctx);
    if (!side) return;
    const wLower = t.wallet ? String(t.wallet).toLowerCase() : null;
    if (wLower && intelExcludedSet?.has(wLower)) return;
    const tier = wLower ? tierFor(wLower, sport, getWalletProfile) : null;
    rows.push({
      wallet: wLower || `whale:${source}:${t.outcome}:${amt}`,
      side,
      invested: amt,
      sizeRatio: null,
      whitelist: tier,
      whitelisted: tier === 'CONFIRMED' || tier === 'FLAT',
      sourceMkt: 'WHALE',
      kind: 'whale',
      exchangeSource: source,
      anonymous: !wLower,
    });
  };

  for (const t of (poly?.whales?.topTrades || [])) pushTrade(t, 'poly');
  for (const t of (kalshi?.whales?.topTrades || [])) pushTrade(t, 'kalshi');
  return rows;
}

/**
 * Drop whale rows whose wallet|side already appears in open-position wallets
 * (same dollar would otherwise hit Full twice).
 */
function whalesNotInWallets(whaleRows, walletRows) {
  const walletKeys = new Set(walletRows.map((w) => `${w.wallet}|${w.side}`));
  return whaleRows.filter((w) => {
    if (w.anonymous) return true;
    return !walletKeys.has(`${w.wallet}|${w.side}`);
  });
}

/** ML/spread trade-flow sample cash → ours/against. Not used for TOTAL. */
export function exchangeFlowSplit({
  sport,
  gameKey,
  playSideNorm,
  polyData,
  kalshiData,
}) {
  if (!sport || !gameKey || playSideNorm === 'draw') return splitOf(0, 0);
  const poly = polyData?.[sport]?.[gameKey] || null;
  const kalshi = kalshiData?.[sport]?.[gameKey] || null;
  const polyCash = Number(poly?.sampleCash) || 0;
  const kCash = Number(kalshi?.tradeFlow?.sampleCash) || 0;
  const totalCash = polyCash + kCash;
  if (totalCash <= 0) return splitOf(0, 0);

  const polyAway = Number(poly?.awayMoneyPct);
  const polyHome = Number(poly?.homeMoneyPct);
  const kAway = Number(kalshi?.tradeFlow?.awayMoneyPct);
  const kHome = Number(kalshi?.tradeFlow?.homeMoneyPct);

  const awayAmt = (Number.isFinite(polyAway) ? polyAway / 100 * polyCash : 0)
    + (Number.isFinite(kAway) ? kAway / 100 * kCash : 0);
  const homeAmt = (Number.isFinite(polyHome) ? polyHome / 100 * polyCash : 0)
    + (Number.isFinite(kHome) ? kHome / 100 * kCash : 0);
  const known = awayAmt + homeAmt;
  if (known <= 0) return splitOf(0, 0);

  if (playSideNorm === 'away') return splitOf(awayAmt, homeAmt);
  if (playSideNorm === 'home') return splitOf(homeAmt, awayAmt);
  return splitOf(0, 0);
}

/**
 * Residual exchange = sample flow minus whale $ already counted on that side.
 * Avoids Full = wallets + whales + full sampleCash (triple-count).
 */
function exchangeResidual(exchange, whaleAll) {
  return splitOf(
    Math.max(0, (exchange?.ours || 0) - (whaleAll?.ours || 0)),
    Math.max(0, (exchange?.theirs || 0) - (whaleAll?.theirs || 0)),
  );
}

export function buildWideBoardMoneySplits({
  sport,
  gameKey,
  marketType,
  playSideNorm,
  rawMl = null,
  rawSpread = null,
  rawTotal = null,
  getWalletProfile = null,
  intelExcludedSet = null,
  polyData = null,
  kalshiData = null,
  away = null,
  home = null,
  awayShort = null,
  homeShort = null,
  includeExchange = true,
  hcRatio = 1.5,
} = {}) {
  const empty = {
    full: splitOf(0, 0),
    losers: splitOf(0, 0),
    confirmed: splitOf(0, 0),
    hcOurs: 0,
    hcPct: null,
    nonHcOurs: 0,
    walletRows: [],
    exchange: splitOf(0, 0),
    whales: splitOf(0, 0),
    sources: { wallets: 0, whales: 0, exchange: 0 },
  };
  if (!sport || !gameKey || !playSideNorm) return empty;

  const walletRows = collectWalletRows({
    sport, gameKey, marketType, playSideNorm,
    rawMl, rawSpread, rawTotal, intelExcludedSet, getWalletProfile,
  });

  const whaleRowsRaw = collectWhaleRows({
    sport, gameKey, marketType, playSideNorm,
    polyData, kalshiData, away, home, awayShort, homeShort,
    intelExcludedSet, getWalletProfile,
  });
  const whaleRows = whalesNotInWallets(whaleRowsRaw, walletRows);

  const sumSide = (rows, side, pred = () => true) => rows
    .filter((w) => w.side === side && pred(w))
    .reduce((s, w) => s + w.invested, 0);

  const isLoser = (w) => !(w.whitelist === 'CONFIRMED' || w.whitelist === 'FLAT');
  const isConfirmed = (w) => w.whitelist === 'CONFIRMED';
  const isHc = (w) => isConfirmed(w)
    && Number.isFinite(w.sizeRatio)
    && w.sizeRatio >= hcRatio;

  const walletFull = splitOf(sumSide(walletRows, 'ours'), sumSide(walletRows, 'against'));
  const whalesAll = splitOf(sumSide(whaleRowsRaw, 'ours'), sumSide(whaleRowsRaw, 'against'));
  const whales = splitOf(sumSide(whaleRows, 'ours'), sumSide(whaleRows, 'against'));

  const losers = splitOf(
    sumSide(walletRows, 'ours', isLoser),
    sumSide(walletRows, 'against', isLoser),
  );
  const whaleLosers = splitOf(
    sumSide(whaleRows, 'ours', isLoser),
    sumSide(whaleRows, 'against', isLoser),
  );
  const losersAll = splitOf(losers.ours + whaleLosers.ours, losers.theirs + whaleLosers.theirs);

  const confirmed = splitOf(
    sumSide(walletRows, 'ours', isConfirmed),
    sumSide(walletRows, 'against', isConfirmed),
  );
  const hcOurs = walletRows
    .filter((w) => w.side === 'ours' && isHc(w))
    .reduce((s, w) => s + w.invested, 0);
  const hcPct = confirmed.ours > 0 ? Math.round((hcOurs / confirmed.ours) * 100) : null;

  // TOTAL: never allocate ML sampleCash via O/U probs (that was painting
  // moneyline flow as Over/Under). Whales already carry real O/U prints.
  let exchangeRaw = splitOf(0, 0);
  let exchange = splitOf(0, 0);
  if (includeExchange && marketKeyOf(marketType) !== 'TOTAL') {
    exchangeRaw = exchangeFlowSplit({ sport, gameKey, playSideNorm, polyData, kalshiData });
    exchange = exchangeResidual(exchangeRaw, whalesAll);
  }

  const full = splitOf(
    walletFull.ours + whales.ours + exchange.ours,
    walletFull.theirs + whales.theirs + exchange.theirs,
  );

  return {
    full,
    losers: losersAll,
    confirmed,
    hcOurs: Math.round(hcOurs),
    hcPct,
    nonHcOurs: Math.max(0, Math.round(confirmed.ours - hcOurs)),
    walletRows,
    exchange,
    exchangeRaw,
    whales,
    sources: {
      wallets: walletFull.total,
      whales: whales.total,
      exchange: exchange.total,
    },
  };
}
