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
