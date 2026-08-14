/**
 * One instrument = family × line × side.
 *
 * Five tickets users actually hold:
 *   ML            — no line
 *   SPREAD MAIN   — book run line (isMain)
 *   SPREAD ALT    — vault entryLine ≠ main
 *   TOTAL MAIN    — book O/U (isMain)
 *   TOTAL ALT     — vault entryLine ≠ main
 *
 * Ticket (FLAGGED / toWin / Action cents) = vault Poly avgPrice on that
 * exact line. Tape (FAIR / PIN / NOW / chart) = sportsbook quotes on the
 * same line. Those two columns never overwrite each other. If books have
 * no quote on an alt, tape is empty — we do not borrow MAIN juice.
 */
import {
  linesClose,
  pickMainSpreadFromBoard,
  pickMainTotalFromBoard,
} from './pinnacleMain.js';

export { linesClose };

export function americanFromPolyPrice(px) {
  const p = Number(px);
  if (!(p > 0 && p < 1)) return null;
  return p >= 0.5
    ? Math.round(-100 * p / (1 - p))
    : Math.round(100 * (1 - p) / p);
}

export function classifyFamily(marketType) {
  const m = String(marketType || '').toUpperCase();
  if (m === 'SPREAD' || m === 'SP') return 'SPREAD';
  if (m === 'TOTAL' || m === 'TOT') return 'TOTAL';
  return 'ML';
}

export function classifyVariant(family, ticketLine, mainLine) {
  if (family === 'ML') return 'MAIN';
  if (!Number.isFinite(ticketLine) || !Number.isFinite(mainLine)) return 'MAIN';
  return linesClose(ticketLine, mainLine) ? 'MAIN' : 'ALT';
}

function posLine(p, family) {
  if (family === 'TOTAL') return Number(p?.entryLine ?? p?.totalLine);
  if (family === 'SPREAD') return Number(p?.entryLine ?? p?.spreadLine);
  return null;
}

function sameSide(p, side) {
  return String(p?.side || '').toLowerCase() === String(side || '').toLowerCase();
}

/** Invested-weight vault line on this side (spreads / totals). */
export function vaultConsensusLine(positions, side, family) {
  if (family === 'ML') return null;
  const byLine = new Map();
  for (const p of positions || []) {
    if (!sameSide(p, side)) continue;
    const ln = posLine(p, family);
    if (!Number.isFinite(ln)) continue;
    if (family === 'TOTAL' && ln < 1.5) continue;
    byLine.set(ln, (byLine.get(ln) || 0) + (Number(p.invested) || 0));
  }
  let best = null;
  let bestInv = -1;
  for (const [ln, inv] of byLine) {
    if (inv > bestInv) {
      best = ln;
      bestInv = inv;
    }
  }
  return best;
}

/**
 * Vault receipt on this instrument. `line` null = ML (all legs on side).
 */
export function vaultTicket(positions, { side, line = null, family = 'ML' } = {}) {
  let sumInv = 0;
  let sumPx = 0;
  for (const p of positions || []) {
    if (!sameSide(p, side)) continue;
    if (family !== 'ML' && Number.isFinite(line)) {
      const el = posLine(p, family);
      if (Number.isFinite(el) && !linesClose(el, line)) continue;
    }
    const inv = Number(p.invested) || 0;
    const px = Number(p.avgPrice);
    if (!(inv > 0) || !(px > 0 && px < 1)) continue;
    sumInv += inv;
    sumPx += px * inv;
  }
  if (!(sumInv > 0)) {
    return { polyPrice: null, american: null, invested: 0, cents: null };
  }
  const polyPrice = sumPx / sumInv;
  const american = americanFromPolyPrice(polyPrice);
  return {
    polyPrice,
    american,
    invested: +sumInv.toFixed(2),
    cents: Math.round(polyPrice * 100),
  };
}

function spreadLineOf(row, side) {
  if (!row) return null;
  return side === 'away' ? Number(row.awayLine) : Number(row.homeLine);
}

function spreadOddsOf(row, side) {
  if (!row) return null;
  const o = side === 'away' ? row.awayOdds : row.homeOdds;
  return Number.isFinite(o) && o !== 0 ? o : null;
}

function totalOddsOf(row, side) {
  if (!row) return null;
  const o = side === 'under' ? row.underOdds : row.overOdds;
  return Number.isFinite(o) && o !== 0 ? o : null;
}

/** Book MAIN line for this family/side. */
export function mainLineForSide(family, pinnOrMeta, side) {
  if (!pinnOrMeta || family === 'ML') return null;
  if (family === 'SPREAD') {
    const fromLines = pickMainSpreadFromBoard(pinnOrMeta.spreadLines);
    if (fromLines) {
      const ln = spreadLineOf(fromLines, side);
      if (Number.isFinite(ln)) return ln;
    }
    const cur = pinnOrMeta.spreadCurrent;
    const ln = spreadLineOf(cur, side);
    if (Number.isFinite(ln)) return ln;
    return spreadLineOf(pinnOrMeta.spreadOpener, side);
  }
  const fromLines = pickMainTotalFromBoard(pinnOrMeta.totalLines);
  if (fromLines && Number.isFinite(fromLines.line) && fromLines.line >= 1.5) {
    return fromLines.line;
  }
  const cur = pinnOrMeta.totalCurrent?.line;
  if (Number.isFinite(cur) && cur >= 1.5) return cur;
  const op = pinnOrMeta.totalOpener?.line;
  return Number.isFinite(op) && op >= 1.5 ? op : null;
}

function histUpTo(hist, freezeAtMs) {
  if (!Array.isArray(hist)) return [];
  if (!Number.isFinite(freezeAtMs)) return hist;
  const freezeSec = freezeAtMs > 1e12 ? freezeAtMs / 1000 : freezeAtMs;
  return hist.filter((h) => {
    if (!Number.isFinite(h?.t)) return true;
    const sec = h.t > 1e12 ? h.t / 1000 : h.t;
    return sec <= freezeSec;
  });
}

function emptyTape() {
  return {
    open: null,
    now: null,
    fair: null,
    book: null,
    series: [],
    max: null,
  };
}

/**
 * Sportsbook tape on this exact line (UI: pinnacle_history game object).
 */
export function tapeOnLine(pinnGame, { family, side, line = null, freezeAtMs = null } = {}) {
  if (!pinnGame) return emptyTape();
  if (family === 'ML') {
    const hist = histUpTo(pinnGame.history, freezeAtMs);
    const series = hist
      .map((h) => {
        const odds = side === 'away' ? h.away : side === 'draw' ? h.draw : h.home;
        if (!Number.isFinite(odds) || odds === 0) return null;
        return {
          t: Number.isFinite(h.t) ? h.t : null,
          odds,
          max: Number.isFinite(h.max) ? h.max : (h.maxMoneyLine ?? null),
        };
      })
      .filter(Boolean);
    const last = series[series.length - 1] || null;
    const first = series[0] || null;
    const now = last?.odds
      ?? (side === 'away' ? pinnGame.current?.away
        : side === 'draw' ? pinnGame.current?.draw
          : pinnGame.current?.home)
      ?? null;
    return {
      open: first?.odds ?? pinnGame.opener?.[side === 'draw' ? 'draw' : side] ?? null,
      now: Number.isFinite(now) && now !== 0 ? now : null,
      fair: Number.isFinite(now) && now !== 0 ? now : null,
      book: pinnGame.fairBook || null,
      series,
      max: last?.max ?? pinnGame.max ?? pinnGame.maxMoneyLine ?? null,
    };
  }

  if (family === 'SPREAD') {
    const hist = histUpTo(pinnGame.spreadHistory, freezeAtMs);
    const stampedMainHist = hist.filter((h) => h?.isMain);
    const onLine = Number.isFinite(line)
      ? hist.filter((h) => linesClose(spreadLineOf(h, side), line))
      : (stampedMainHist.length ? stampedMainHist : hist);
    const series = onLine
      .map((h) => {
        const odds = spreadOddsOf(h, side);
        if (!Number.isFinite(odds)) return null;
        return {
          t: Number.isFinite(h.t) ? h.t : null,
          odds,
          max: Number.isFinite(h.max) ? h.max : (h.maxSpread ?? null),
        };
      })
      .filter(Boolean);
    const liveRow = Array.isArray(pinnGame.spreadLines)
      ? pinnGame.spreadLines.find((r) => linesClose(spreadLineOf(r, side), line))
      : null;
    const curMatch = Number.isFinite(line)
      && linesClose(spreadLineOf(pinnGame.spreadCurrent, side), line)
      ? pinnGame.spreadCurrent
      : null;
    const now = series[series.length - 1]?.odds
      ?? spreadOddsOf(liveRow, side)
      ?? spreadOddsOf(curMatch, side)
      ?? null;
    const open = series[0]?.odds
      ?? (linesClose(spreadLineOf(pinnGame.spreadOpener, side), line)
        ? spreadOddsOf(pinnGame.spreadOpener, side)
        : null);
    return {
      open: Number.isFinite(open) ? open : null,
      now: Number.isFinite(now) ? now : null,
      fair: Number.isFinite(now) ? now : null,
      book: pinnGame.fairSpreadBook || null,
      series,
      max: series[series.length - 1]?.max ?? liveRow?.max ?? curMatch?.max ?? null,
    };
  }

  const hist = histUpTo(pinnGame.totalHistory, freezeAtMs);
  const stampedMainHist = hist.filter((h) => h?.isMain);
  const onLine = Number.isFinite(line)
    ? hist.filter((h) => linesClose(h.line, line))
    : (stampedMainHist.length ? stampedMainHist : hist);
  const series = onLine
    .map((h) => {
      const odds = totalOddsOf(h, side);
      if (!Number.isFinite(odds)) return null;
      return {
        t: Number.isFinite(h.t) ? h.t : null,
        odds,
        max: Number.isFinite(h.max) ? h.max : (h.maxTotal ?? null),
      };
    })
    .filter(Boolean);
  const liveRow = Array.isArray(pinnGame.totalLines)
    ? pinnGame.totalLines.find((r) => linesClose(r.line, line))
    : null;
  const curMatch = Number.isFinite(line)
    && linesClose(pinnGame.totalCurrent?.line, line)
    ? pinnGame.totalCurrent
    : null;
  const now = series[series.length - 1]?.odds
    ?? totalOddsOf(liveRow, side)
    ?? totalOddsOf(curMatch, side)
    ?? null;
  const open = series[0]?.odds
    ?? (linesClose(pinnGame.totalOpener?.line, line)
      ? totalOddsOf(pinnGame.totalOpener, side)
      : null);
  return {
    open: Number.isFinite(open) ? open : null,
    now: Number.isFinite(now) ? now : null,
    fair: Number.isFinite(now) ? now : null,
    book: pinnGame.fairTotalBook || null,
    series,
    max: series[series.length - 1]?.max ?? liveRow?.max ?? curMatch?.max ?? null,
  };
}

/**
 * Cron snapshot tape (gameMeta). Same-line only — never borrow MAIN onto ALT.
 */
export function tapeFromMeta(meta, { family, side, line = null } = {}) {
  if (!meta) return emptyTape();
  if (family === 'ML') {
    const now = side === 'home' ? meta.mlOdds?.home
      : side === 'draw' ? meta.mlOdds?.draw
        : meta.mlOdds?.away;
    return {
      open: null,
      now: Number.isFinite(now) && now !== 0 ? now : null,
      fair: Number.isFinite(now) && now !== 0 ? now : null,
      book: meta.fairBook || null,
      series: [],
      max: null,
    };
  }
  if (family === 'SPREAD') {
    const cur = meta.spreadCurrent || meta.spreadOpener;
    const curLine = spreadLineOf(cur, side);
    if (Number.isFinite(line) && Number.isFinite(curLine) && !linesClose(curLine, line)) {
      return emptyTape();
    }
    const now = spreadOddsOf(cur, side);
    const open = spreadOddsOf(meta.spreadOpener, side);
    return {
      open: Number.isFinite(open) && (line == null || linesClose(spreadLineOf(meta.spreadOpener, side), line))
        ? open : null,
      now: Number.isFinite(now) ? now : null,
      fair: Number.isFinite(now) ? now : null,
      book: meta.fairSpreadBook || meta.fairBook || null,
      series: [],
      max: null,
    };
  }
  const cur = meta.totalCurrent || meta.totalOpener;
  if (Number.isFinite(line) && Number.isFinite(cur?.line) && !linesClose(cur.line, line)) {
    return emptyTape();
  }
  const now = totalOddsOf(cur, side);
  const open = totalOddsOf(meta.totalOpener, side);
  return {
    open: Number.isFinite(open) && (line == null || linesClose(meta.totalOpener?.line, line))
      ? open : null,
    now: Number.isFinite(now) ? now : null,
    fair: Number.isFinite(now) ? now : null,
    book: meta.fairTotalBook || meta.fairBook || null,
    series: [],
    max: null,
  };
}

/**
 * Canonical instrument for a locked side.
 * Ticket always vault Poly when we have avgPrice. Tape is same-line books.
 */
export function resolveInstrument({
  family,
  side,
  positions = [],
  pinnGame = null,
  meta = null,
  freezeAtMs = null,
  stampedLine = null,
} = {}) {
  const fam = classifyFamily(family);
  const vaultLine = vaultConsensusLine(positions, side, fam);
  const mainLine = mainLineForSide(fam, pinnGame || meta, side);
  const line = fam === 'ML'
    ? null
    : (Number.isFinite(vaultLine) ? vaultLine
      : (Number.isFinite(stampedLine) ? stampedLine : mainLine));
  const variant = classifyVariant(fam, line, mainLine);
  const ticket = vaultTicket(positions, { side, line, family: fam });
  const tape = pinnGame
    ? tapeOnLine(pinnGame, { family: fam, side, line, freezeAtMs })
    : tapeFromMeta(meta, { family: fam, side, line });
  return {
    family: fam,
    variant,
    line: Number.isFinite(line) ? line : null,
    side,
    mainLine: Number.isFinite(mainLine) ? mainLine : null,
    ticket,
    tape,
  };
}

/**
 * Display ticket juice: vault Poly is the receipt. Stamped lock.odds is
 * only used when vault has no price (sealed / no live positions).
 */
export function ticketAmerican(inst, stampedOdds = null) {
  if (Number.isFinite(inst?.ticket?.american) && inst.ticket.american !== 0) {
    return inst.ticket.american;
  }
  if (Number.isFinite(stampedOdds) && stampedOdds !== 0) return stampedOdds;
  return null;
}
