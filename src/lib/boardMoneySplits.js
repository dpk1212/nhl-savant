/**
 * Wide board money for locked-card battle bars.
 *
 * Pulls EVERY tracked dollar we can attribute to the pick side:
 *   1. Raw sharp_* open positions (Vault pool — all markets on the game)
 *   2. Poly / Kalshi whale top-trades by outcome
 *   3. Poly + Kalshi trade-flow sample cash (ML/spread axis only)
 *
 * Losing = non CONFIRMED/FLAT wallets from (1).
 * Confirmed = CONFIRMED wallets from (1) on this side axis.
 */

export const BOARD_MONEY_MIN_INVESTED = 1; // catch small tickets Vault may still plot

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

      // Side-axis rules:
      //  ML/SPREAD pick → count ML+SPREAD on away/home; skip TOTAL
      //  TOTAL pick     → count TOTAL over/under as ours/against;
      //                   fold ML+SPREAD into against (rest of game board)
      let side;
      if (mkt === 'TOTAL') {
        if (mk === 'TOTAL') {
          side = marketSide === playSideNorm ? 'ours' : 'against';
        } else {
          // Other markets on this game — not on our total side
          side = 'against';
        }
      } else {
        if (mk === 'TOTAL') continue;
        side = marketSide === playSideNorm ? 'ours' : 'against';
      }

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

  // ML / spread — match team names / abbreviations
  const awayNames = [away, awayShort].filter(Boolean).map((s) => String(s).toLowerCase());
  const homeNames = [home, homeShort].filter(Boolean).map((s) => String(s).toLowerCase());
  const isAway = awayNames.some((n) => n && (o === n || o.includes(n) || n.includes(o)));
  const isHome = homeNames.some((n) => n && (o === n || o.includes(n) || n.includes(o)));
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
    });
  };

  for (const t of (poly?.whales?.topTrades || [])) pushTrade(t, 'poly');
  for (const t of (kalshi?.whales?.topTrades || [])) pushTrade(t, 'kalshi');
  return rows;
}

/** ML/spread trade-flow sample cash → ours/against. */
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
 * Totals: allocate poly sampleCash by over/under probs when polyTotal exists.
 */
function totalsExchangeSplit({
  sport,
  gameKey,
  playSideNorm,
  polyData,
}) {
  const poly = polyData?.[sport]?.[gameKey];
  if (!poly) return splitOf(0, 0);
  const cash = Number(poly.sampleCash) || 0;
  const probs = poly.polyTotal?.probs;
  if (!(cash > 0) || !Array.isArray(probs) || probs.length < 2) return splitOf(0, 0);
  const overPct = Number(probs[0]) || 0;
  const underPct = Number(probs[1]) || 0;
  const over$ = cash * (overPct / 100);
  const under$ = cash * (underPct / 100);
  // playSideNorm home = over, away = under
  if (playSideNorm === 'home') return splitOf(over$, under$);
  if (playSideNorm === 'away') return splitOf(under$, over$);
  return splitOf(0, 0);
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

  const whaleRows = collectWhaleRows({
    sport, gameKey, marketType, playSideNorm,
    polyData, kalshiData, away, home, awayShort, homeShort,
    intelExcludedSet, getWalletProfile,
  });

  const sumSide = (rows, side, pred = () => true) => rows
    .filter((w) => w.side === side && pred(w))
    .reduce((s, w) => s + w.invested, 0);

  const isLoser = (w) => !(w.whitelist === 'CONFIRMED' || w.whitelist === 'FLAT');
  const isConfirmed = (w) => w.whitelist === 'CONFIRMED';
  const isHc = (w) => isConfirmed(w)
    && Number.isFinite(w.sizeRatio)
    && w.sizeRatio >= hcRatio;

  const walletFull = splitOf(sumSide(walletRows, 'ours'), sumSide(walletRows, 'against'));
  const whales = splitOf(sumSide(whaleRows, 'ours'), sumSide(whaleRows, 'against'));

  // Losers / Confirmed from open-position wallets only (not flow samples)
  const losers = splitOf(
    sumSide(walletRows, 'ours', isLoser),
    sumSide(walletRows, 'against', isLoser),
  );
  // Whale trades from non-winner wallets also count as loser money
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

  let exchange = splitOf(0, 0);
  if (includeExchange) {
    const mkt = marketKeyOf(marketType);
    exchange = mkt === 'TOTAL'
      ? totalsExchangeSplit({ sport, gameKey, playSideNorm, polyData })
      : exchangeFlowSplit({ sport, gameKey, playSideNorm, polyData, kalshiData });
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
    whales,
    sources: {
      wallets: walletFull.total,
      whales: whales.total,
      exchange: exchange.total,
    },
  };
}
