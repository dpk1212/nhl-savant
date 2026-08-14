/**
 * Pinnacle MAIN = the line closest to pick'em.
 * Spreads already used |hdp| → 0. Totals used highest max, which ties
 * (alts inherit the same max) and crowns the highest alt. Do not do that.
 */

export function impliedFromAmerican(o) {
  if (!Number.isFinite(o) || o === 0) return null;
  return o < 0 ? (-o) / ((-o) + 100) : 100 / (o + 100);
}

export function impliedFromDecimal(d) {
  if (!Number.isFinite(d) || d <= 1) return null;
  return 1 / d;
}

function pickemDist(overP, underP) {
  if (overP == null || underP == null) return Infinity;
  return Math.abs(overP - 0.5) + Math.abs(underP - 0.5);
}

const LINE_EPS = 0.051;

export function linesClose(a, b, eps = LINE_EPS) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= eps;
}

/**
 * Current totals board → main row.
 * Rows: { line, overOdds, underOdds, max? } American.
 */
export function pickMainTotalFromBoard(lines) {
  if (!Array.isArray(lines) || !lines.length) return null;
  let best = null;
  let bestDist = Infinity;
  let bestMax = -1;
  for (const row of lines) {
    if (!row || !Number.isFinite(row.line) || row.line < 1.5) continue;
    const dist = pickemDist(
      impliedFromAmerican(row.overOdds),
      impliedFromAmerican(row.underOdds),
    );
    if (!Number.isFinite(dist) || dist === Infinity) continue;
    const m = Number(row.max) || 0;
    if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && m > bestMax)) {
      bestDist = dist;
      bestMax = m;
      best = row;
    }
  }
  return best;
}

/** Raw PinnAPI period totals object → the main total entry. */
export function pickMainTotalFromPinnapi(totals) {
  if (!totals || typeof totals !== 'object') return null;
  let best = null;
  let bestDist = Infinity;
  let bestMax = -1;
  for (const t of Object.values(totals)) {
    if (!t || t.over == null || t.under == null) continue;
    const dist = pickemDist(
      impliedFromDecimal(Number(t.over)),
      impliedFromDecimal(Number(t.under)),
    );
    if (!Number.isFinite(dist) || dist === Infinity) continue;
    const m = Number(t.max) || 0;
    if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && m > bestMax)) {
      bestDist = dist;
      bestMax = m;
      best = t;
    }
  }
  return best;
}

/** Current spreads board → main row (closest to pick'em / 0). */
export function pickMainSpreadFromBoard(lines) {
  if (!Array.isArray(lines) || !lines.length) return null;
  let best = null;
  let bestAbs = Infinity;
  for (const row of lines) {
    if (!row) continue;
    const abs = Math.min(
      Math.abs(Number(row.homeLine)),
      Math.abs(Number(row.awayLine)),
    );
    if (!Number.isFinite(abs)) continue;
    if (abs < bestAbs) {
      bestAbs = abs;
      best = row;
    }
  }
  return best;
}

/** Last cycle's board in a mixed hist dump → main (isMain stamp, else pick'em). */
export function lastBoardMain(hist, pickFn) {
  if (!Array.isArray(hist) || !hist.length || typeof pickFn !== 'function') return null;
  const stamped = [...hist].reverse().find((h) => h?.isMain);
  if (stamped) return stamped;
  const byT = new Map();
  for (const h of hist) {
    const t = Number.isFinite(h?.t) ? h.t : 'na';
    if (!byT.has(t)) byT.set(t, []);
    byT.get(t).push(h);
  }
  const ts = [...byT.keys()];
  const board = byT.get(ts[ts.length - 1]) || [];
  return pickFn(board) || board[0] || null;
}
