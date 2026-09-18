/**
 * Actual WR for this ticket’s unit × market × similar juice.
 * Hit edge on the tape = that WR minus implied of this ticket’s gold chip.
 *
 * Juice bands are American, capped at the chalk end so −225 is not mixed
 * with −400. V12 AGS-U · Firestore · 2026-06-01 → 2026-09-17.
 * Historical juice is max(flagged, Pinnacle) — retail gold was never stamped.
 *
 * 3-way cells with n<20 fall back to market × juice. Never fall back to
 * unit×market without juice. 0u cards return null.
 */

/** unit|market|band — only n≥20. */
const CELLS = {
  '≤1u|ml|plus': { wr: 50.0, n: 66 },
  '≤1u|ml|pick': { wr: 47.8, n: 46 },
  '≤1u|ml|n130': { wr: 54.8, n: 31 },
  '≤1u|total|plus': { wr: 36.1, n: 36 },
  '≤1u|total|pick': { wr: 52.1, n: 48 },
  '1.5–2.5u|ml|plus': { wr: 41.6, n: 89 },
  '1.5–2.5u|total|pick': { wr: 42.3, n: 26 },
  '3u|ml|pick': { wr: 54.5, n: 22 },
  '3u|ml|n130': { wr: 65.8, n: 38 },
  '3u|ml|n175': { wr: 60.0, n: 20 },
  '3u|total|plus': { wr: 50.0, n: 28 },
  '3u|total|pick': { wr: 55.2, n: 67 },
  '4–5u|ml|pick': { wr: 68.2, n: 22 },
  '4–5u|ml|n130': { wr: 63.3, n: 30 },
  '4–5u|ml|n175': { wr: 56.5, n: 23 },
  '4–5u|total|pick': { wr: 50.5, n: 95 },
};

/** market|band — fallback when the 3-way cell is thin. */
const MARKET_BAND = {
  'ml|plus': { wr: 48.1, n: 185 },
  'ml|pick': { wr: 53.8, n: 106 },
  'ml|n130': { wr: 64.1, n: 117 },
  'ml|n175': { wr: 56.9, n: 72 },
  'ml|n225': { wr: 60.0, n: 35 },
  'ml|n300': { wr: 75.0, n: 20 },
  'ml|n400': { wr: 88.6, n: 35 },
  'spread|plus': { wr: 46.0, n: 50 },
  'spread|pick': { wr: 48.8, n: 41 },
  'total|plus': { wr: 46.3, n: 95 },
  'total|pick': { wr: 51.8, n: 251 },
};

const MKT_LABEL = { ml: 'ML', spread: 'Spread', total: 'Total' };
const BAND_LABEL = {
  plus: 'plus',
  pick: '−110s',
  n130: '−130s',
  n175: '−160 to −200',
  n225: '−200 to −250',
  n300: '−250 to −350',
  n400: '−350+',
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

/**
 * Similar-juice bands from this ticket’s best American.
 * Chalk is capped: −225 does not sit with −400.
 */
export function oddsHitBand(american) {
  const n = Number(american);
  if (!Number.isFinite(n) || n === 0) return null;
  if (n > 0) return 'plus';
  if (n >= -120) return 'pick';
  if (n >= -150) return 'n130';
  if (n >= -200) return 'n175';
  if (n >= -250) return 'n225';
  if (n >= -350) return 'n300';
  return 'n400';
}

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
