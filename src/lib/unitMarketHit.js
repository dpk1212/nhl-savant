/**
 * Actual WR for this ticket’s unit × market × similar juice.
 * Hit edge on the tape = that WR minus implied of this ticket’s gold chip.
 *
 * V12 AGS-U live stakes · Firestore · 2026-06-01 → 2026-09-17.
 * Historical juice is max(flagged, Pinnacle) — retail gold was never stamped.
 *
 * 3-way cells with n<20 fall back to market × juice so the strip still
 * paints a comparable cohort. Never fall back to unit×market without juice.
 */
import { impliedFromAmerican } from './oddsEv.js';

/** unit|market|band — only n≥20. */
const CELLS = {
  '≤1u|ml|plus': { wr: 47.2, n: 53 },
  '≤1u|ml|pick': { wr: 38.2, n: 34 },
  '≤1u|ml|short': { wr: 62.8, n: 43 },
  '≤1u|ml|fav': { wr: 40.7, n: 27 },
  '≤1u|ml|heavy': { wr: 56.0, n: 25 },
  '≤1u|total|pick': { wr: 34.5, n: 29 },
  '≤1u|total|short': { wr: 53.8, n: 39 },
  '1.5–2.5u|ml|plus': { wr: 35.4, n: 65 },
  '1.5–2.5u|ml|pick': { wr: 53.3, n: 30 },
  '1.5–2.5u|total|short': { wr: 41.7, n: 24 },
  '3u|ml|short': { wr: 62.8, n: 43 },
  '3u|ml|fav': { wr: 58.3, n: 24 },
  '3u|total|pick': { wr: 54.2, n: 24 },
  '3u|total|short': { wr: 53.6, n: 56 },
  '4–5u|ml|short': { wr: 67.6, n: 34 },
  '4–5u|ml|fav': { wr: 61.3, n: 31 },
  '4–5u|ml|heavy': { wr: 85.7, n: 21 },
  '4–5u|total|short': { wr: 49.4, n: 87 },
  '>5u|ml|heavy': { wr: 80.6, n: 36 },
};

/** market|band — fallback when the 3-way cell is thin. */
const MARKET_BAND = {
  'ml|plus': { wr: 43.9, n: 139 },
  'ml|pick': { wr: 50.0, n: 92 },
  'ml|short': { wr: 64.1, n: 142 },
  'ml|fav': { wr: 59.1, n: 93 },
  'ml|heavy': { wr: 73.1, n: 104 },
  'spread|plus': { wr: 46.3, n: 41 },
  'spread|pick': { wr: 41.2, n: 34 },
  'spread|short': { wr: 66.7, n: 27 },
  'spread|fav': { wr: 50.0, n: 20 },
  'total|plus': { wr: 48.1, n: 54 },
  'total|pick': { wr: 49.4, n: 85 },
  'total|short': { wr: 51.1, n: 221 },
};

const MKT_LABEL = { ml: 'ML', spread: 'Spread', total: 'Total' };
const BAND_LABEL = {
  plus: 'plus',
  pick: 'pick',
  short: '−110s',
  fav: '−150s',
  heavy: '−200+',
};

export function unitHitBucket(units) {
  const u = Number(units);
  if (!Number.isFinite(u) || u <= 0) return null;
  if (u <= 1.05) return '≤1u';
  if (u < 2.75) return '1.5–2.5u';
  if (u < 3.5) return '3u';
  if (u <= 5.05) return '4–5u';
  return '>5u';
}

export function marketHitKey(marketType, pickLabel = '') {
  const m = String(marketType || '').toLowerCase();
  if (m === 'spread' || m === 's') return 'spread';
  if (m === 'total' || m === 't') return 'total';
  if (m === 'ml' || m === 'moneyline' || m === 'h2h') return 'ml';
  const lab = String(pickLabel || '');
  if (/over|under/i.test(lab)) return 'total';
  if (/\bML\b/i.test(lab)) return 'ml';
  return 'ml';
}

/** Similar-juice bands from this ticket’s best American. */
export function oddsHitBand(american) {
  const p = impliedFromAmerican(american);
  if (p == null || !(p > 0 && p < 1)) return null;
  if (p < 0.48) return 'plus';
  if (p < 0.52) return 'pick';
  if (p < 0.58) return 'short';
  if (p < 0.65) return 'fav';
  return 'heavy';
}

/** Hide thin cells so the strip does not paint n=10 noise. */
const MIN_N = 20;

function pack(row, { bucket, market, band, scope }) {
  if (!row || row.n < MIN_N) return null;
  const bandLabel = BAND_LABEL[band];
  const marketLabel = MKT_LABEL[market];
  const label = bucket
    ? `${bucket} ${marketLabel} ${bandLabel}`
    : `${marketLabel} ${bandLabel}`;
  return {
    bucket,
    market,
    band,
    marketLabel,
    bandLabel,
    scope,
    label,
    wr: row.wr,
    n: row.n,
  };
}

export function unitMarketHit(units, marketType, pickLabel, americanOdds) {
  const bucket = unitHitBucket(units);
  if (!bucket) return null;
  const market = marketHitKey(marketType, pickLabel);
  const band = oddsHitBand(americanOdds);
  if (!market || !band) return null;

  const three = pack(CELLS[`${bucket}|${market}|${band}`], {
    bucket, market, band, scope: 'unit-market-odds',
  });
  if (three) return three;

  return pack(MARKET_BAND[`${market}|${band}`], {
    bucket: null, market, band, scope: 'market-odds',
  });
}
