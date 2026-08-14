/**
 * MAIN is labeled, not guessed.
 *
 * Odds API `spreads` / `totals` = the book's main. `alternate_*` are alts.
 * Official Pinnacle: altLineId null = main. pinnapi /markets flattens every
 * handicap into one bag and does not pass that flag — so snapshot stamps
 * isMain from the Odds API labeled line, then we honor the stamp.
 *
 * Unlabeled fallback (no isMain): pick'em on the two prices. Do NOT use
 * |hdp| → 0 — that crowns MLB +1 alts over the 1.5 run line.
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

export function stampedMain(lines) {
  if (!Array.isArray(lines)) return null;
  return lines.find((row) => row && row.isMain) || null;
}

/**
 * Current totals board → main row.
 * Rows: { line, overOdds, underOdds, max? } American.
 */
export function pickMainTotalFromBoard(lines) {
  const stamped = stampedMain(lines);
  if (stamped) return stamped;
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

/** Current spreads board → main row. Honor isMain; never |hdp| → 0. */
export function pickMainSpreadFromBoard(lines) {
  const stamped = stampedMain(lines);
  if (stamped) return stamped;
  if (!Array.isArray(lines) || !lines.length) return null;
  let best = null;
  let bestDist = Infinity;
  let bestMax = -1;
  for (const row of lines) {
    if (!row) continue;
    const dist = pickemDist(
      impliedFromAmerican(row.homeOdds),
      impliedFromAmerican(row.awayOdds),
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

/** Raw PinnAPI period spreads object → unlabeled fallback (pick'em). */
export function pickMainSpreadFromPinnapi(spreads) {
  if (!spreads || typeof spreads !== 'object') return null;
  let best = null;
  let bestDist = Infinity;
  let bestMax = -1;
  for (const s of Object.values(spreads)) {
    if (!s || s.home == null || s.away == null) continue;
    const dist = pickemDist(
      impliedFromDecimal(Number(s.home)),
      impliedFromDecimal(Number(s.away)),
    );
    if (!Number.isFinite(dist) || dist === Infinity) continue;
    const m = Number(s.max) || 0;
    if (dist < bestDist - 1e-9 || (Math.abs(dist - bestDist) <= 1e-9 && m > bestMax)) {
      bestDist = dist;
      bestMax = m;
      best = s;
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
