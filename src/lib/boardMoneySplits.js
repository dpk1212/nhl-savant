/**
 * Wide board money for locked-card battle bars.
 *
 * Matches Vault battle-field pool: RAW sharp_*_positions (not CONFIRMED+FLAT
 * filter), intel-excluded out, ≥$250 tickets. Tier tags from wallet profiles.
 *
 * Full can optionally fold in Polymarket + Kalshi trade-flow sample cash
 * (exchange money Vault doesn't plot but we track).
 */

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

function normMarketSide(side, { isTotal } = {}) {
  const s = String(side || '').toLowerCase();
  if (isTotal) {
    if (s === 'over' || s === 'home') return 'home';
    if (s === 'under' || s === 'away') return 'away';
  }
  if (s === 'over') return 'home';
  if (s === 'under') return 'away';
  if (s === 'away' || s === 'home' || s === 'draw') return s;
  return null;
}

function marketKeyOf(marketType) {
  const m = String(marketType || '').toLowerCase();
  if (m === 'total' || m === 'totals') return 'TOTAL';
  if (m === 'spread' || m === 'spreads') return 'SPREAD';
  return 'ML';
}

function tierFor(wallet, sport, getWalletProfile) {
  if (!wallet || !getWalletProfile) return null;
  const short = String(wallet).slice(-6);
  return getWalletProfile(short)?.bySport?.[sport]?.whitelistTier || null;
}

/**
 * Collect raw positions for a game across ML / SPREAD / TOTAL feeds.
 * When `marketOnly` is set, only that market file is used.
 */
function collectRawPositions({
  sport,
  gameKey,
  marketType,
  rawMl,
  rawSpread,
  rawTotal,
  marketOnly = false,
}) {
  const mkt = marketKeyOf(marketType);
  const files = [];
  if (!marketOnly || mkt === 'ML') {
    files.push({ mkt: 'ML', data: rawMl });
  }
  if (!marketOnly || mkt === 'SPREAD') {
    files.push({ mkt: 'SPREAD', data: rawSpread });
  }
  if (!marketOnly || mkt === 'TOTAL') {
    files.push({ mkt: 'TOTAL', data: rawTotal });
  }

  const isTotal = mkt === 'TOTAL';
  const out = [];
  for (const { mkt: mk, data } of files) {
    if (!data || !sport || !gameKey) continue;
    const gd = data[sport]?.[gameKey];
    const positions = gd?.positions;
    if (!Array.isArray(positions)) continue;
    for (const p of positions) {
      if (!p?.wallet || !p?.side) continue;
      const inv = Number(p.invested) || 0;
      if (inv < BOARD_MONEY_MIN_INVESTED) continue;
      // Totals pick: only TOTAL market sides map cleanly to over/under.
      // ML/SPREAD sides would pollute Full with unrelated money.
      if (isTotal && mk !== 'TOTAL') continue;
      // Spread pick: include SPREAD + ML (same away/home axis).
      if (mkt === 'SPREAD' && mk === 'TOTAL') continue;
      // ML pick: include ML + SPREAD (same away/home axis); skip TOTAL.
      if (mkt === 'ML' && mk === 'TOTAL') continue;

      const marketSide = normMarketSide(p.side, { isTotal: mk === 'TOTAL' || isTotal });
      if (!marketSide) continue;
      out.push({
        wallet: String(p.wallet).toLowerCase(),
        marketSide,
        invested: inv,
        sizeRatio: Number.isFinite(p.sizeRatio) ? p.sizeRatio : null,
        avgSportBet: Number.isFinite(p.avgSportBet) ? p.avgSportBet : null,
        sourceMkt: mk,
      });
    }
  }
  return out;
}

function dedupeMaxInvested(rows) {
  const seen = new Map();
  for (const r of rows) {
    const k = `${r.wallet}|${r.marketSide}`;
    const cur = seen.get(k);
    if (!cur || r.invested > cur.invested) seen.set(k, r);
  }
  return [...seen.values()];
}

/**
 * Polymarket + Kalshi trade-flow sample cash allocated to away/home (or
 * over/under via home/away mapping for totals when only ML flow exists).
 */
export function exchangeFlowSplit({
  sport,
  gameKey,
  playSideNorm, // 'away' | 'home' | 'draw'
  polyData,
  kalshiData,
}) {
  if (!sport || !gameKey) return splitOf(0, 0);
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

  let awayPct;
  let homePct;
  if (totalCash > 0 && (polyCash > 0 || kCash > 0)) {
    const awayAmt = (Number.isFinite(polyAway) ? polyAway / 100 * polyCash : 0)
      + (Number.isFinite(kAway) ? kAway / 100 * kCash : 0);
    const homeAmt = (Number.isFinite(polyHome) ? polyHome / 100 * polyCash : 0)
      + (Number.isFinite(kHome) ? kHome / 100 * kCash : 0);
    const known = awayAmt + homeAmt;
    if (known > 0) {
      awayPct = (awayAmt / known) * 100;
      homePct = (homeAmt / known) * 100;
    }
  }
  if (!Number.isFinite(awayPct)) {
    awayPct = Number.isFinite(polyAway) ? polyAway
      : (Number.isFinite(kAway) ? kAway : 50);
    homePct = Number.isFinite(polyHome) ? polyHome
      : (Number.isFinite(kHome) ? kHome : 50);
  }

  const away$ = totalCash * (awayPct / 100);
  const home$ = totalCash * (homePct / 100);
  if (playSideNorm === 'away') return splitOf(away$, home$);
  if (playSideNorm === 'home') return splitOf(home$, away$);
  // draw / unknown — no clean ours/against; leave exchange out
  return splitOf(0, 0);
}

/**
 * Build Full / Losing / Confirmed dollar splits for a locked pick.
 *
 * @returns {{
 *   full, losers, confirmed, hcOurs, hcPct, nonHcOurs,
 *   walletRows, exchange, sources
 * }}
 */
export function buildWideBoardMoneySplits({
  sport,
  gameKey,
  marketType,
  playSideNorm, // away|home|draw after totals remap (over→home, under→away)
  rawMl = null,
  rawSpread = null,
  rawTotal = null,
  getWalletProfile = null,
  intelExcludedSet = null,
  polyData = null,
  kalshiData = null,
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
    sources: { wallets: 0, exchange: 0 },
  };
  if (!sport || !gameKey || !playSideNorm) return empty;

  const raw = collectRawPositions({
    sport, gameKey, marketType, rawMl, rawSpread, rawTotal,
  });
  const filtered = raw.filter((r) => {
    if (intelExcludedSet?.has(r.wallet)) return false;
    return true;
  });
  const deduped = dedupeMaxInvested(filtered);

  const rows = deduped.map((r) => {
    const tier = tierFor(r.wallet, sport, getWalletProfile);
    const side = r.marketSide === playSideNorm ? 'ours' : 'against';
    const avg = Number(r.avgSportBet) || 0;
    const sizeRatio = Number.isFinite(r.sizeRatio) && r.sizeRatio > 0
      ? r.sizeRatio
      : (avg > 0 ? r.invested / avg : null);
    return {
      ...r,
      side,
      whitelist: tier,
      whitelisted: tier === 'CONFIRMED' || tier === 'FLAT',
      sizeRatio,
    };
  });

  const sum = (pred, side) => rows
    .filter((w) => w.side === side && pred(w))
    .reduce((s, w) => s + w.invested, 0);

  const all = () => true;
  const isLoser = (w) => !(w.whitelist === 'CONFIRMED' || w.whitelist === 'FLAT');
  const isConfirmed = (w) => w.whitelist === 'CONFIRMED';
  const isHc = (w) => isConfirmed(w)
    && Number.isFinite(w.sizeRatio)
    && w.sizeRatio >= hcRatio;

  let full = splitOf(sum(all, 'ours'), sum(all, 'against'));
  const losers = splitOf(sum(isLoser, 'ours'), sum(isLoser, 'against'));
  const confirmed = splitOf(sum(isConfirmed, 'ours'), sum(isConfirmed, 'against'));
  const hcOursFixed = rows
    .filter((w) => w.side === 'ours' && isHc(w))
    .reduce((s, w) => s + w.invested, 0);
  const hcPct = confirmed.ours > 0
    ? Math.round((hcOursFixed / confirmed.ours) * 100)
    : null;

  let exchange = splitOf(0, 0);
  if (includeExchange && playSideNorm !== 'draw') {
    // Totals: exchange ML flow is not over/under — skip to avoid lying.
    const mkt = marketKeyOf(marketType);
    if (mkt !== 'TOTAL') {
      exchange = exchangeFlowSplit({
        sport, gameKey, playSideNorm, polyData, kalshiData,
      });
      if (exchange.total > 0) {
        full = splitOf(full.ours + exchange.ours, full.theirs + exchange.theirs);
      }
    }
  }

  return {
    full,
    losers,
    confirmed,
    hcOurs: Math.round(hcOursFixed),
    hcPct,
    nonHcOurs: Math.max(0, Math.round(confirmed.ours - hcOursFixed)),
    walletRows: rows,
    exchange,
    sources: {
      wallets: Math.round(sum(all, 'ours') + sum(all, 'against')),
      exchange: exchange.total,
    },
  };
}
