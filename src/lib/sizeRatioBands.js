/**
 * Win rate by size-vs-usual (invested / avgSportBet).
 * Shared by exportWalletProfiles (persist) and locked-card UI (match).
 *
 * Locked-card "Size vs usual" uses sport-local usual (bySport.positions).
 * Model / HC / SHADOW floors still use cross-sport sports_sharps.avgSportBet.
 */

/** Mean stake for this wallet in `sport` from graded positions. */
export function sportUsualBetFromProfile(profile, sport) {
  const rec = profile?.bySport?.[sport]?.positions;
  const n = Number(rec?.n) || 0;
  const sportInvested = Number(rec?.invested);
  if (n > 0 && Number.isFinite(sportInvested) && sportInvested > 0) {
    return sportInvested / n;
  }
  return null;
}

/**
 * Display-only size ratio: invested / sport-local usual.
 * Falls back to modelRatio when sport usual unknown.
 */
export function sportDisplaySizeRatio(invested, profile, sport, modelRatio = null) {
  const inv = Number(invested || 0);
  const usual = sportUsualBetFromProfile(profile, sport);
  if (inv > 0 && Number.isFinite(usual) && usual > 0) return inv / usual;
  return Number.isFinite(modelRatio) && modelRatio > 0 ? modelRatio : null;
}


export const SIZE_RATIO_BAND_DEFS = [
  { id: 'light', label: 'this size', min: 0, max: 0.5 },
  { id: 'lean', label: 'near usual', min: 0.5, max: 1.0 },
  { id: 'full', label: 'full size', min: 1.0, max: 1.5 },
  { id: 'press', label: 'sized up', min: 1.5, max: Infinity },
];

/** Minimum decided bets in a band before we surface WR in the UI. */
export const SIZE_RATIO_BAND_MIN_N = 30;

/**
 * @param {Array<{ invested?: number, won?: number, settledPnl?: number }>} bets
 * @param {number|null} avgSportBet  same cross-sport usual $ as the locked card
 *
 * Accuracy rules:
 * - Ratio always = invested / avgSportBet (matches "Size vs usual" on the card).
 * - When settledPnl is present, ~0 PnL (push/void) is excluded from n and WR.
 * - Band edges: [min, max) ; top band is [1.5×, ∞).
 */
export function buildSizeRatioBands(bets, avgSportBet) {
  const usual = Number(avgSportBet);
  if (!Number.isFinite(usual) || usual <= 0) return null;
  if (!Array.isArray(bets) || bets.length < 1) return null;

  const buckets = Object.fromEntries(SIZE_RATIO_BAND_DEFS.map((d) => [d.id, []]));
  let scored = 0;
  for (const b of bets) {
    const inv = Number(b.invested);
    if (!Number.isFinite(inv) || inv <= 0) continue;
    // Positions: drop pushes/voids. Picks have no settledPnl — use won 0/1 only.
    if (Number.isFinite(b.settledPnl) && Math.abs(b.settledPnl) <= 1e-9) continue;
    const decidedWin = b.won === 1 || b.won === true;
    const decidedLoss = b.won === 0 || b.won === false;
    if (!decidedWin && !decidedLoss) continue;
    const ratio = inv / usual;
    if (!Number.isFinite(ratio) || ratio <= 0) continue;
    const def = SIZE_RATIO_BAND_DEFS.find((d) => ratio >= d.min && ratio < d.max)
      || SIZE_RATIO_BAND_DEFS[SIZE_RATIO_BAND_DEFS.length - 1];
    buckets[def.id].push({ won: decidedWin ? 1 : 0 });
    scored += 1;
  }
  if (scored < 1) return null;

  const bands = {};
  for (const def of SIZE_RATIO_BAND_DEFS) {
    const rows = buckets[def.id];
    const n = rows.length;
    const wins = rows.filter((b) => b.won === 1).length;
    bands[def.id] = {
      id: def.id,
      label: def.label,
      min: def.min,
      max: def.max === Infinity ? null : def.max,
      n,
      wins,
      losses: n - wins,
      wr: n ? +((wins / n) * 100).toFixed(1) : null,
      pct: scored ? +((n / scored) * 100).toFixed(1) : 0,
    };
  }

  return {
    usual: Math.round(usual),
    total: scored,
    minN: SIZE_RATIO_BAND_MIN_N,
    bands,
  };
}

/**
 * Prefer positions band, fall back to tracked picks. Null when under minN.
 */
export function matchSizeRatioBand(sizeRatio, sizeRatioBands) {
  if (!Number.isFinite(sizeRatio) || sizeRatio <= 0 || !sizeRatioBands) return null;
  const def = SIZE_RATIO_BAND_DEFS.find((d) => sizeRatio >= d.min && sizeRatio < d.max)
    || SIZE_RATIO_BAND_DEFS[SIZE_RATIO_BAND_DEFS.length - 1];

  const trySource = (source) => {
    const block = sizeRatioBands[source];
    if (!block?.bands?.[def.id]) return null;
    const band = block.bands[def.id];
    const minN = block.minN ?? sizeRatioBands.minN ?? SIZE_RATIO_BAND_MIN_N;
    if (!Number.isFinite(band.n) || band.n < minN) return null;
    if (!Number.isFinite(band.wr)) return null;
    return {
      id: band.id,
      label: band.label || def.label,
      n: band.n,
      wr: Math.round(band.wr),
      pct: Number.isFinite(band.pct) ? Math.round(band.pct) : null,
      source,
    };
  };

  return trySource('positions') || trySource('picks');
}
