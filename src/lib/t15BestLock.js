/**
 * T-15 lock ticket = best available sportsbook line + juice on this side.
 * Flagged (vault / Poly) stays a separate Firestore snapshot.
 *
 * Spreads: Odds API `spreads` is each book's main. After a move, DK can
 * still be +37.5 while FD is +41.5 — take the most favorable main, then
 * the best American on that number. Never mix alt-line juice onto main.
 */
import { shopRailHidden } from './shopTicketLine.js';

export const T15_BEST_LOCK_FROM = '2026-09-19';

export function isT15BestLockLive(pickDate) {
  return String(pickDate || '') >= T15_BEST_LOCK_FROM;
}

function bookHidden(key, name) {
  const blob = `${key || ''} ${name || ''}`.toLowerCase();
  if (blob.includes('kalshi') || blob.includes('poly')) return true;
  return shopRailHidden(key) || shopRailHidden(name);
}

function finiteOdds(o) {
  return Number.isFinite(o) && o !== 0;
}

function betterSpread(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.line !== b.line) return a.line > b.line ? a : b;
  return a.odds > b.odds ? a : b;
}

function betterTotal(a, b, side) {
  if (!a) return b;
  if (!b) return a;
  if (a.line !== b.line) {
    if (side === 'over') return a.line < b.line ? a : b;
    return a.line > b.line ? a : b;
  }
  return a.odds > b.odds ? a : b;
}

function betterMl(a, b) {
  if (!a) return b;
  if (!b) return a;
  return a.odds > b.odds ? a : b;
}

function snapshotFromFlagged(flagged) {
  if (!flagged || typeof flagged !== 'object') return null;
  const line = Number.isFinite(Number(flagged.line)) ? Number(flagged.line) : null;
  const odds = finiteOdds(Number(flagged.odds)) ? Number(flagged.odds) : null;
  if (line == null && odds == null) return null;
  return {
    line,
    odds,
    book: flagged.book || null,
    pinnacleOdds: finiteOdds(Number(flagged.pinnacleOdds)) ? Number(flagged.pinnacleOdds) : null,
    oddsSource: flagged.oddsSource || 'flagged_fallback',
    source: 'flagged_fallback',
  };
}

/**
 * @returns {{ line: number|null, odds: number|null, book: string|null, pinnacleOdds: number|null, oddsSource: string, source: string } | null}
 */
export function bestAvailableTicket({
  pinnGame = null,
  marketType = 'ml',
  side = 'home',
  flagged = null,
} = {}) {
  const mt = String(marketType || 'ml').toLowerCase();
  const s = String(side || '').toLowerCase();
  const fallback = snapshotFromFlagged(flagged);

  if (!pinnGame || typeof pinnGame !== 'object') return fallback;

  if (mt === 'spread' || mt === 'sp') {
    const quotes = [];
    for (const [k, b] of Object.entries(pinnGame.allSpreadBooks || {})) {
      if (!b || bookHidden(k, b.name)) continue;
      const line = s === 'away' ? Number(b.awayLine) : Number(b.homeLine);
      const odds = s === 'away' ? Number(b.away) : Number(b.home);
      if (!Number.isFinite(line) || !finiteOdds(odds)) continue;
      quotes.push({ line, odds, book: b.name || k, pinnacleOdds: null });
    }
    const stamped = s === 'away' ? pinnGame.bestAwaySpread : pinnGame.bestHomeSpread;
    if (stamped && Number.isFinite(Number(stamped.line)) && finiteOdds(Number(stamped.odds))) {
      quotes.push({
        line: Number(stamped.line),
        odds: Number(stamped.odds),
        book: stamped.book || null,
        pinnacleOdds: null,
      });
    }
    const cur = pinnGame.spreadCurrent;
    if (cur) {
      const line = s === 'away' ? Number(cur.awayLine) : Number(cur.homeLine);
      const odds = s === 'away' ? Number(cur.awayOdds) : Number(cur.homeOdds);
      if (Number.isFinite(line) && finiteOdds(odds)) {
        quotes.push({
          line,
          odds,
          book: pinnGame.fairSpreadBook || 'Pinnacle',
          pinnacleOdds: odds,
        });
      }
    }
    let best = null;
    for (const q of quotes) best = betterSpread(best, q);
    if (!best) return fallback;
    const pin = quotes.find((q) => String(q.book || '').toLowerCase().includes('pinn')
      && Number.isFinite(q.line) && Math.abs(q.line - best.line) <= 0.051);
    return {
      line: best.line,
      odds: best.odds,
      book: best.book || null,
      pinnacleOdds: pin?.odds ?? best.pinnacleOdds ?? null,
      oddsSource: 't15_best_available',
      source: 't15_best_available',
    };
  }

  if (mt === 'total' || mt === 'tot') {
    const wantOver = s === 'over' || s === 'home';
    const quotes = [];
    for (const [k, b] of Object.entries(pinnGame.allTotalBooks || {})) {
      if (!b || bookHidden(k, b.name)) continue;
      const line = Number(b.line);
      const odds = wantOver ? Number(b.over) : Number(b.under);
      if (!Number.isFinite(line) || line < 1.5 || !finiteOdds(odds)) continue;
      quotes.push({ line, odds, book: b.name || k, pinnacleOdds: null });
    }
    const stamped = wantOver ? pinnGame.bestOver : pinnGame.bestUnder;
    if (stamped && Number.isFinite(Number(stamped.line)) && finiteOdds(Number(stamped.odds))) {
      quotes.push({
        line: Number(stamped.line),
        odds: Number(stamped.odds),
        book: stamped.book || null,
        pinnacleOdds: null,
      });
    }
    const cur = pinnGame.totalCurrent;
    if (cur && Number.isFinite(Number(cur.line)) && Number(cur.line) >= 1.5) {
      const odds = wantOver ? Number(cur.overOdds) : Number(cur.underOdds);
      if (finiteOdds(odds)) {
        quotes.push({
          line: Number(cur.line),
          odds,
          book: pinnGame.fairTotalBook || 'Pinnacle',
          pinnacleOdds: odds,
        });
      }
    }
    let best = null;
    for (const q of quotes) best = betterTotal(best, q, wantOver ? 'over' : 'under');
    if (!best) return fallback;
    return {
      line: best.line,
      odds: best.odds,
      book: best.book || null,
      pinnacleOdds: best.pinnacleOdds ?? null,
      oddsSource: 't15_best_available',
      source: 't15_best_available',
    };
  }

  const quotes = [];
  for (const [k, b] of Object.entries(pinnGame.allBooks || {})) {
    if (!b || bookHidden(k, b.name)) continue;
    const odds = s === 'away' ? Number(b.away)
      : s === 'draw' ? Number(b.draw)
        : Number(b.home);
    if (!finiteOdds(odds)) continue;
    quotes.push({ line: null, odds, book: b.name || k, pinnacleOdds: null });
  }
  const stampedOdds = s === 'away' ? pinnGame.bestAway
    : s === 'draw' ? pinnGame.bestDraw
      : pinnGame.bestHome;
  const stampedBook = s === 'away' ? pinnGame.bestAwayBook
    : s === 'draw' ? pinnGame.bestDrawBook
      : pinnGame.bestHomeBook;
  if (finiteOdds(Number(stampedOdds))) {
    quotes.push({
      line: null,
      odds: Number(stampedOdds),
      book: stampedBook || null,
      pinnacleOdds: null,
    });
  }
  const cur = pinnGame.current;
  const pinOdds = s === 'away' ? Number(cur?.away)
    : s === 'draw' ? Number(cur?.draw)
      : Number(cur?.home);
  if (finiteOdds(pinOdds)) {
    quotes.push({
      line: null,
      odds: pinOdds,
      book: pinnGame.fairBook || 'Pinnacle',
      pinnacleOdds: pinOdds,
    });
  }
  let best = null;
  for (const q of quotes) best = betterMl(best, q);
  if (!best) return fallback;
  return {
    line: null,
    odds: best.odds,
    book: best.book || null,
    pinnacleOdds: finiteOdds(pinOdds) ? pinOdds : (best.pinnacleOdds ?? null),
    oddsSource: 't15_best_available',
    source: 't15_best_available',
  };
}

/**
 * Every visible book on the ticket at the moment it seals.
 * The card paints this list after lock instead of the live tape.
 */
export function snapshotBookRail({
  pinnGame = null,
  marketType = 'ml',
  side = 'home',
  ticketLine = null,
} = {}) {
  if (!pinnGame || typeof pinnGame !== 'object') return [];
  const mt = String(marketType || 'ml').toLowerCase();
  const s = String(side || '').toLowerCase();
  const line = Number.isFinite(Number(ticketLine)) ? Number(ticketLine) : null;
  const rows = [];
  const seen = new Set();

  const push = (name, odds, rowLine, { sharp = false } = {}) => {
    if (!name || bookHidden(name, name) || !finiteOdds(Number(odds))) return;
    const key = String(name).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({
      name,
      odds: Number(odds),
      line: Number.isFinite(Number(rowLine)) ? Number(rowLine) : null,
      sharp,
    });
  };

  if (mt === 'total' || mt === 'tot') {
    const wantOver = s === 'over' || s === 'home';
    const pin = pinnGame.totalCurrent;
    if (pin && (line == null || Math.abs(Number(pin.line) - line) <= 0.051)) {
      push(pinnGame.fairTotalBook || 'Pinnacle', wantOver ? pin.overOdds : pin.underOdds, pin.line, { sharp: true });
    }
    for (const [k, b] of Object.entries(pinnGame.allTotalBooks || {})) {
      if (!b || bookHidden(k, b.name)) continue;
      if (line != null && !(Number.isFinite(Number(b.line)) && Math.abs(Number(b.line) - line) <= 0.051)) continue;
      push(b.name || k, wantOver ? b.over : b.under, b.line);
    }
  } else if (mt === 'spread' || mt === 'sp') {
    const pin = pinnGame.spreadCurrent;
    const pinLine = s === 'away' ? Number(pin?.awayLine) : Number(pin?.homeLine);
    const pinOdds = s === 'away' ? Number(pin?.awayOdds) : Number(pin?.homeOdds);
    if (pin && (line == null || (Number.isFinite(pinLine) && Math.abs(pinLine - line) <= 0.051))) {
      push(pinnGame.fairSpreadBook || 'Pinnacle', pinOdds, pinLine, { sharp: true });
    }
    for (const [k, b] of Object.entries(pinnGame.allSpreadBooks || {})) {
      if (!b || bookHidden(k, b.name)) continue;
      const rowLine = s === 'away' ? Number(b.awayLine) : Number(b.homeLine);
      const odds = s === 'away' ? Number(b.away) : Number(b.home);
      if (line != null && !(Number.isFinite(rowLine) && Math.abs(rowLine - line) <= 0.051)) continue;
      push(b.name || k, odds, rowLine);
    }
  } else {
    const pin = pinnGame.current;
    const pinOdds = s === 'away' ? Number(pin?.away) : s === 'draw' ? Number(pin?.draw) : Number(pin?.home);
    push(pinnGame.fairBook || 'Pinnacle', pinOdds, null, { sharp: true });
    for (const [k, b] of Object.entries(pinnGame.allBooks || {})) {
      if (!b || bookHidden(k, b.name)) continue;
      const odds = s === 'away' ? Number(b.away) : s === 'draw' ? Number(b.draw) : Number(b.home);
      push(b.name || k, odds, null);
    }
  }

  let bestIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].sharp) continue;
    if (bestIdx < 0 || rows[i].odds > rows[bestIdx].odds) bestIdx = i;
  }
  if (bestIdx >= 0) rows[bestIdx] = { ...rows[bestIdx], best: true };
  return rows.slice(0, 12);
}

export function isSealedT15Lock(sd = {}) {
  return sd?.v8_lockBestAtT15 === true
    || String(sd?.lock?.oddsSource || '').includes('t15_best');
}

/**
 * Same ticket the locked card paints: sealed T-15 shop line, else live
 * shop-best, else lock/peak. Alerts must not prefer peak (flagged 10.5)
 * when the hero is already Under 11.
 */
export function resolveLockDisplayTicket({
  sd = {},
  pinnGame = null,
  marketType = 'ml',
  side = 'home',
  pickDate = null,
} = {}) {
  const peak = sd.peak || {};
  const lock = sd.lock || {};
  const flagged = (sd.flagged && typeof sd.flagged === 'object')
    ? sd.flagged
    : flaggedSnapshotFromPeakLock(peak, lock);

  if (isSealedT15Lock(sd)
      && (Number.isFinite(Number(lock.line)) || finiteOdds(Number(lock.odds)))) {
    return {
      line: Number.isFinite(Number(lock.line)) ? Number(lock.line) : null,
      odds: finiteOdds(Number(lock.odds)) ? Number(lock.odds) : null,
      book: lock.book || null,
      source: 'sealed',
    };
  }

  if (isT15BestLockLive(pickDate)) {
    const best = bestAvailableTicket({
      pinnGame,
      marketType,
      side,
      flagged,
    });
    if (best && (Number.isFinite(best.line) || finiteOdds(best.odds))) {
      return {
        line: Number.isFinite(best.line) ? best.line : null,
        odds: finiteOdds(best.odds) ? best.odds : null,
        book: best.book || null,
        source: best.source || 't15_best_available',
      };
    }
  }

  const line = Number.isFinite(Number(lock.line)) ? Number(lock.line)
    : (Number.isFinite(Number(peak.line)) ? Number(peak.line) : null);
  const odds = finiteOdds(Number(lock.odds)) ? Number(lock.odds)
    : (finiteOdds(Number(peak.odds)) ? Number(peak.odds) : null);
  return {
    line,
    odds,
    book: lock.book || peak.book || null,
    source: 'peak_or_lock',
  };
}

export function lockTicketTeamLabel({
  marketType = 'ml',
  side = 'home',
  line = null,
  fallbackTeam = null,
} = {}) {
  const mt = String(marketType || '').toLowerCase();
  const s = String(side || '').toLowerCase();
  if (mt === 'total' || mt === 'tot') {
    const mkt = s === 'over' ? 'Over' : 'Under';
    return Number.isFinite(Number(line)) ? `${mkt} ${line}` : (fallbackTeam || mkt);
  }
  return fallbackTeam || null;
}

/** OneSignal / lock-alert heading body — same number as the locked hero. */
export function formatLockAlertPickText({
  market = 'ML',
  sideKey = 'home',
  line = null,
  team = null,
  away = '',
  home = '',
} = {}) {
  const mkt = String(market || 'ML').toUpperCase();
  if (mkt === 'TOTAL' && (sideKey === 'over' || sideKey === 'under')) {
    const side = sideKey === 'over' ? 'Over' : 'Under';
    const lineStr = line != null && line !== '' ? ` ${line}` : '';
    return `${away || ''} @ ${home || ''} ${side}${lineStr}`.replace(/\s+/g, ' ').trim();
  }
  if (mkt === 'SPREAD') {
    const n = Number(line);
    const lineStr = Number.isFinite(n) ? ` ${n > 0 ? '+' : ''}${n}` : '';
    return `${team || sideKey}${lineStr}`.replace(/\s+/g, ' ').trim();
  }
  return `${team || sideKey} ML`.trim();
}

export function flaggedSnapshotFromPeakLock(peak = {}, lock = {}) {
  const line = Number.isFinite(Number(peak.line)) ? Number(peak.line)
    : (Number.isFinite(Number(lock.line)) ? Number(lock.line) : null);
  const odds = finiteOdds(Number(peak.odds)) ? Number(peak.odds)
    : (finiteOdds(Number(lock.odds)) ? Number(lock.odds) : null);
  return {
    line,
    odds,
    pinnacleOdds: finiteOdds(Number(peak.pinnacleOdds)) ? Number(peak.pinnacleOdds)
      : (finiteOdds(Number(lock.pinnacleOdds)) ? Number(lock.pinnacleOdds) : null),
    book: peak.book || lock.book || null,
    oddsSource: peak.oddsSource || lock.oddsSource || null,
    polyPrice: peak.polyPrice ?? lock.polyPrice ?? null,
    team: peak.team || lock.team || null,
  };
}
