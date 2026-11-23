/**
 * Same cells as src/lib/unitMarketHit.js on main.
 * Window 2026-06-01 → 2026-11-10. Juice bands unchanged.
 * 3-way n<20 falls back to market × juice. 0u returns null.
 */

const CELLS = {
  '≤1u|ml|plus': { wr: 47.1, n: 119 },
  '≤1u|ml|pick': { wr: 50.8, n: 59 },
  '≤1u|ml|n130': { wr: 55.6, n: 36 },
  '≤1u|ml|n175': { wr: 43.5, n: 23 },
  '≤1u|spread|plus': { wr: 42.3, n: 26 },
  '≤1u|total|plus': { wr: 43.8, n: 48 },
  '≤1u|total|pick': { wr: 52.8, n: 72 },
  '1.5–2.5u|ml|plus': { wr: 42.5, n: 146 },
  '1.5–2.5u|spread|plus': { wr: 48.1, n: 52 },
  '1.5–2.5u|spread|pick': { wr: 58.7, n: 63 },
  '1.5–2.5u|total|plus': { wr: 59.3, n: 27 },
  '1.5–2.5u|total|pick': { wr: 42.4, n: 59 },
  '3u|ml|plus': { wr: 61.3, n: 31 },
  '3u|ml|pick': { wr: 52.8, n: 36 },
  '3u|ml|n130': { wr: 62.3, n: 53 },
  '3u|ml|n175': { wr: 69.2, n: 39 },
  '3u|ml|n225': { wr: 48.0, n: 25 },
  '3u|spread|plus': { wr: 28.6, n: 21 },
  '3u|spread|pick': { wr: 56.8, n: 37 },
  '3u|total|plus': { wr: 47.5, n: 40 },
  '3u|total|pick': { wr: 56.7, n: 90 },
  '4–5u|ml|plus': { wr: 52.0, n: 25 },
  '4–5u|ml|pick': { wr: 70.7, n: 41 },
  '4–5u|ml|n130': { wr: 61.1, n: 54 },
  '4–5u|ml|n175': { wr: 52.5, n: 40 },
  '4–5u|total|pick': { wr: 50.5, n: 107 },
};

const MARKET_BAND = {
  'ml|plus': { wr: 46.6, n: 324 },
  'ml|pick': { wr: 57.5, n: 160 },
  'ml|n130': { wr: 61.4, n: 171 },
  'ml|n175': { wr: 59.7, n: 129 },
  'ml|n225': { wr: 62.7, n: 67 },
  'ml|n300': { wr: 81.6, n: 49 },
  'ml|n400': { wr: 89.8, n: 59 },
  'spread|plus': { wr: 42.2, n: 109 },
  'spread|pick': { wr: 56.5, n: 138 },
  'spread|n130': { wr: 61.5, n: 26 },
  'spread|n175': { wr: 54.5, n: 22 },
  'total|plus': { wr: 48.6, n: 138 },
  'total|pick': { wr: 51.6, n: 343 },
  'total|n130': { wr: 63.0, n: 27 },
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

function unitHitBucket(units) {
  const u = Number(units);
  if (!Number.isFinite(u) || u <= 0) return null;
  if (u <= 1.05) return '≤1u';
  if (u < 2.75) return '1.5–2.5u';
  if (u < 3.5) return '3u';
  if (u <= 5.05) return '4–5u';
  return '>5u';
}

function marketHitKey(marketType, pickLabel = '') {
  const m = String(marketType || '').toLowerCase();
  if (m === 'spread' || m === 's') return 'spread';
  if (m === 'total' || m === 't') return 'total';
  if (m === 'ml' || m === 'moneyline' || m === 'h2h') return 'ml';
  const lab = String(pickLabel || '');
  if (/over|under/i.test(lab)) return 'total';
  if (/\bML\b/i.test(lab)) return 'ml';
  return 'ml';
}

function oddsHitBand(american) {
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

function pack(row, { bucket, market, band }) {
  if (!row || row.n < 20) return null;
  const bandLabel = BAND_LABEL[band];
  const marketLabel = MKT_LABEL[market];
  const label = bucket
    ? `${bucket} ${marketLabel} ${bandLabel}`
    : `${marketLabel} ${bandLabel}`;
  return { label, wr: row.wr, n: row.n };
}

function unitMarketHit(units, marketType, pickLabel, americanOdds) {
  const bucket = unitHitBucket(units);
  if (!bucket) return null;
  const market = marketHitKey(marketType, pickLabel);
  const band = oddsHitBand(americanOdds);
  if (!market || !band) return null;
  return pack(CELLS[`${bucket}|${market}|${band}`], { bucket, market, band })
    || pack(MARKET_BAND[`${market}|${band}`], { bucket: null, market, band });
}

module.exports = { unitMarketHit };
