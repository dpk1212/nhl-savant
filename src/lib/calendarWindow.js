/**
 * Calendar window over graded positions. Display only.
 * The 30-day book already lives on recentActionWindow. Last-90 cannot
 * be summed from the saved ticket list: that list is the last 30 days
 * and capped at 40 legs per sport, so a heavy month looks smaller than
 * the month itself.
 */

export const L90_DAYS = 90;
export const L90_CURVE_MAX = 48;

export function ymdShift(ymd, days) {
  const [y, m, d] = String(ymd).split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + days));
  return dt.toISOString().slice(0, 10);
}

function downsample(points, max) {
  if (points.length <= max) return points.slice();
  const out = [];
  const last = points.length - 1;
  for (let i = 0; i < max; i += 1) {
    out.push(points[Math.round((i / (max - 1)) * last)]);
  }
  out[out.length - 1] = points[last];
  return out;
}

/**
 * Graded positions with date >= today-days. `today` is an ET YYYY-MM-DD.
 * Curve is cumulative dollars, last point equal to settledPnl.
 */
export function buildCalendarWindow(bets, {
  days = L90_DAYS,
  today = null,
  withCurve = false,
  curveMax = L90_CURVE_MAX,
} = {}) {
  const todayET = today || new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const cutoff = ymdShift(todayET, -Math.max(0, Number(days) || 0));
  const legs = (bets || [])
    .filter((b) => b && (b.won === 0 || b.won === 1) && b.date && String(b.date) >= cutoff && String(b.date) <= todayET)
    .slice()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  let invested = 0;
  let settledPnl = 0;
  let wins = 0;
  const raw = [];
  let run = 0;
  for (const b of legs) {
    if (b.won === 1) wins += 1;
    if (Number.isFinite(Number(b.invested))) invested += Number(b.invested);
    const pnl = Number(b.settledPnl);
    if (Number.isFinite(pnl)) {
      settledPnl += pnl;
      run += pnl;
      raw.push(Math.round(run));
    }
  }
  const n = legs.length;
  const losses = n - wins;
  const pnlRounded = Math.round(settledPnl);
  let curve;
  if (withCurve) {
    curve = raw.length ? downsample(raw, curveMax) : [];
    if (curve.length) curve[curve.length - 1] = pnlRounded;
    if (curve.length === 1) curve.unshift(0);
  }
  return {
    days: Number(days) || 0,
    n,
    wins,
    losses,
    wr: n ? +((wins / n) * 100).toFixed(1) : null,
    invested: Math.round(invested),
    settledPnl: pnlRounded,
    dollarRoi: invested > 0 ? +((settledPnl / invested) * 100).toFixed(1) : null,
    from: legs[0]?.date ? String(legs[0].date) : null,
    ...(withCurve ? { curve } : {}),
  };
}
