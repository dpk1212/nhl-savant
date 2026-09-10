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

/** True when two American prices are within `maxPp` implied-prob points. */
export function americanOddsClose(a, b, maxPp = 1) {
  const pa = impliedFromAmerican(a);
  const pb = impliedFromAmerican(b);
  if (pa == null || pb == null) return false;
  return Math.abs(pa - pb) * 100 <= maxPp;
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

/**
 * Time-ordered MAIN handicap path from a mixed hist bag.
 * Honor isMain. Skip boards with no stamp once we have one — a partial
 * 47.5/50 dump must not pick'em a new main. Pick'em only on a cold start.
 */
export function buildMainLinePath(hist, {
  marketType = 'total',
  sideNorm = 'home',
} = {}) {
  if (!Array.isArray(hist) || !hist.length) return [];
  const mt = String(marketType || 'total').toLowerCase();
  const isTotal = mt === 'total';
  const isSpread = mt === 'spread';
  if (!isTotal && !isSpread) return [];
  const sideIsAway = sideNorm === 'away' || sideNorm === 'under' || sideNorm === 'draw';
  const pickFn = isTotal ? pickMainTotalFromBoard : pickMainSpreadFromBoard;

  const byT = new Map();
  for (const h of hist) {
    if (!h) continue;
    const t = Number.isFinite(h.t) ? h.t : 'na';
    if (!byT.has(t)) byT.set(t, []);
    byT.get(t).push(h);
  }
  const keys = [...byT.keys()].sort((a, b) => {
    if (a === 'na') return 1;
    if (b === 'na') return -1;
    return a - b;
  });

  const out = [];
  let seenStamp = false;
  for (const key of keys) {
    const board = byT.get(key) || [];
    const stamped = board.find((r) => r && r.isMain);
    let main = stamped || null;
    if (main) seenStamp = true;
    else if (seenStamp) continue;
    else main = pickFn(board);
    if (!main) continue;

    const line = isTotal
      ? Number(main.line)
      : Number(sideIsAway ? main.awayLine : main.homeLine);
    if (!Number.isFinite(line)) continue;
    const odds = isTotal
      ? (sideIsAway ? main.underOdds : main.overOdds)
      : (sideIsAway ? main.awayOdds : main.homeOdds);
    const rawMax = Number(main.max ?? (isTotal ? main.maxTotal : main.maxSpread));
    const t = Number.isFinite(main.t)
      ? main.t
      : (Number.isFinite(key) ? key : (board.find((r) => Number.isFinite(r?.t))?.t ?? null));
    out.push({
      t: Number.isFinite(t) ? t : null,
      line,
      odds: Number.isFinite(odds) ? odds : null,
      max: Number.isFinite(rawMax) && rawMax > 0 ? rawMax : null,
    });
  }
  return out;
}

export function fmtHandicap(n, { spread = false } = {}) {
  if (!Number.isFinite(Number(n))) return '—';
  const v = Number(n);
  if (spread && v > 0) return `+${v}`;
  return String(v);
}

export function fmtMainLineMove(openLine, nowLine, { spread = false } = {}) {
  if (!Number.isFinite(openLine) && !Number.isFinite(nowLine)) return null;
  if (!Number.isFinite(openLine)) return fmtHandicap(nowLine, { spread });
  if (!Number.isFinite(nowLine)) return fmtHandicap(openLine, { spread });
  if (Math.abs(openLine - nowLine) < 0.45) return fmtHandicap(nowLine, { spread });
  return `${fmtHandicap(openLine, { spread })}→${fmtHandicap(nowLine, { spread })}`;
}

/** Consecutive main-line changes (≥ half-point). */
export function mainLineHops(path, eps = 0.45) {
  if (!Array.isArray(path) || path.length < 2) return [];
  const hops = [];
  for (let i = 1; i < path.length; i++) {
    const from = Number(path[i - 1].line);
    const to = Number(path[i].line);
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    if (Math.abs(to - from) < eps) continue;
    hops.push({
      t: Number.isFinite(path[i].t) ? path[i].t : null,
      line: to,
      fromLine: from,
    });
  }
  return hops;
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
