/**
 * Actual WR vs implied of best lock-time juice (max flagged vs Pinnacle).
 * V12 AGS-U live stakes · Firestore · 2026-06-01 → 2026-09-17.
 * Not retail DK/FD/MGM — those were never stamped on the pick.
 */
const CELLS = {
  '≤1u|ml': { wr: 49.5, implied: 53.7, n: 182, edge: -4.2 },
  '≤1u|spread': { wr: 54.1, implied: 48.6, n: 37, edge: 5.4 },
  '≤1u|total': { wr: 46.6, implied: 50.7, n: 88, edge: -4.1 },
  '1.5–2.5u|ml': { wr: 45.5, implied: 46.9, n: 110, edge: -1.4 },
  '1.5–2.5u|spread': { wr: 53.6, implied: 46.7, n: 28, edge: 6.8 },
  '1.5–2.5u|total': { wr: 48.8, implied: 49.5, n: 41, edge: -0.7 },
  '3u|ml': { wr: 63.1, implied: 58.3, n: 103, edge: 4.8 },
  '3u|spread': { wr: 47.8, implied: 54.3, n: 23, edge: -6.4 },
  '3u|total': { wr: 53.5, implied: 50.8, n: 99, edge: 2.7 },
  '4–5u|ml': { wr: 65.5, implied: 58.7, n: 113, edge: 6.8 },
  '4–5u|spread': { wr: 50.0, implied: 56.1, n: 34, edge: -6.1 },
  '4–5u|total': { wr: 48.6, implied: 52.1, n: 111, edge: -3.4 },
  '>5u|ml': { wr: 79.4, implied: 68.2, n: 63, edge: 11.1 },
  '>5u|total': { wr: 65.4, implied: 51.8, n: 26, edge: 13.6 },
};

const MKT_LABEL = { ml: 'ML', spread: 'Spread', total: 'Total' };

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

/** Hide thin cells so the strip does not paint n=10 noise. */
const MIN_N = 20;

export function unitMarketHit(units, marketType, pickLabel) {
  const bucket = unitHitBucket(units);
  const market = marketHitKey(marketType, pickLabel);
  if (!bucket || !market) return null;
  const row = CELLS[`${bucket}|${market}`];
  if (!row || row.n < MIN_N) return null;
  return {
    bucket,
    market,
    marketLabel: MKT_LABEL[market],
    label: `${bucket} ${MKT_LABEL[market]}`,
    ...row,
  };
}
