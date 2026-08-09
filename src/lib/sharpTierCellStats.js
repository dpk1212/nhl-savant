/**
 * Sharp tier cell hist lookup — as-of flatDollar Q × size × opposition.
 *
 * Stamp contract (n floors):
 *   1. exact cell (tier × sizeBand × opposed) if n ≥ 40
 *   2. else tier × sizeBand if n ≥ 40
 *   3. else tier × sized/light if n ≥ 40
 *   4. else null (never invent from n < 20)
 *
 * Table shape from scripts/exportSharpTierCellStats.js
 */

export const SHARP_TIER_LETTERS = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
export const SHARP_TIER_MIN_N = 40;
export const SHARP_TIER_HIDE_BELOW = 20;

export function tierLetterFromQ(q) {
  if (q === 1 || q === 2 || q === 3 || q === 4) return SHARP_TIER_LETTERS[q];
  return null;
}

export function sizedBucket(sizeBand) {
  if (!sizeBand) return null;
  return sizeBand === 'light' ? 'light' : 'sized';
}

function pack(stat, level, key) {
  if (!stat || !Number.isFinite(stat.n) || stat.n < SHARP_TIER_HIDE_BELOW) return null;
  if (stat.n < SHARP_TIER_MIN_N) return null;
  return {
    level,
    key,
    n: stat.n,
    record: stat.record || null,
    wr: Number.isFinite(stat.wr) ? stat.wr : null,
    roi: Number.isFinite(stat.roi) ? stat.roi : null,
  };
}

/**
 * @param {{ tier: string|null, sizeBand: string|null, unopposed: boolean }} keys
 * @param {object|null} table — export payload (.cells / .byTierSize / .byTierSized)
 */
export function lookupSharpTierCellStats(keys, table) {
  if (!table || !keys) return null;
  const tier = keys.tier;
  const sizeBand = keys.sizeBand;
  const opp = keys.unopposed === true ? 'unopposed' : keys.unopposed === false ? 'opposed' : null;
  if (!tier || !sizeBand || !opp) return null;

  const exactKey = `${tier}|${sizeBand}|${opp}`;
  const exact = pack(table.cells?.[exactKey], 'exact', exactKey);
  if (exact) return exact;

  const tsKey = `${tier}|${sizeBand}`;
  const byTs = pack(table.byTierSize?.[tsKey], 'tierSize', tsKey);
  if (byTs) return byTs;

  const sized = sizedBucket(sizeBand);
  if (!sized) return null;
  const tszKey = `${tier}|${sized}`;
  return pack(table.byTierSized?.[tszKey], 'tierSized', tszKey);
}

/** Compact secondary label for Action rows. */
export function formatSharpTierCellHist(hit) {
  if (!hit || !Number.isFinite(hit.wr)) return null;
  const wr = `${hit.wr}% WR`;
  const roi = Number.isFinite(hit.roi)
    ? `${hit.roi >= 0 ? '+' : ''}${hit.roi}% ROI`
    : null;
  return roi ? `Plays like this · ${wr} · ${roi}` : `Plays like this · ${wr}`;
}
