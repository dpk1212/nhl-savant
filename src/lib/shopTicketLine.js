/**
 * Shop rail / gold chip stay on the ticket line.
 * Missing line is a miss — never paint 8.5 onto Over 7.5.
 */
import { lookupPinnGame } from '../../scripts/lib/ufcFighters.js';
import { evPctVsFairProb, impliedFromAmerican } from './oddsEv.js';
import {
  bookBeatsConsensus,
  evPctVsConsensus,
  SHOP_BOOK_PREFER,
  sharpConsensusFromBooks,
} from './sharpConsensus.js';
import { shopRailHidden } from './shopRailHidden.js';

/** Main may walk this far toward the ticket and still keep juice + the book row. */
export const ST_NEAR_MAIN_PTS = 2;
const LINE_GAP_EPS = 0.001;

/**
 * Points the current main sits toward this side versus the ticket number.
 * Over: a higher main is toward the over. A home spread: a more negative
 * main is toward the home. Positive means the move is in our favor.
 */
export function mainGapTowardSide(ticketLine, mainLine, { marketType, sideNorm } = {}) {
  const ticket = Number(ticketLine);
  const main = Number(mainLine);
  if (!Number.isFinite(ticket) || !Number.isFinite(main)) return null;
  const mt = String(marketType || '').toLowerCase();
  const side = String(sideNorm || '').toLowerCase();
  if (mt === 'total' || mt === 'totals') {
    const towardOver = main - ticket;
    const under = side === 'under' || side === 'away';
    return +(under ? -towardOver : towardOver).toFixed(3);
  }
  if (mt === 'spread' || mt === 'sp') return +(ticket - main).toFixed(3);
  return null;
}

/** True when the main is the ticket, or up to 2 points toward this side. */
export function nearFavorableMain(ticketLine, mainLine, ctx) {
  const pts = mainGapTowardSide(ticketLine, mainLine, ctx);
  if (!Number.isFinite(pts)) return false;
  return pts >= -LINE_GAP_EPS && pts <= ST_NEAR_MAIN_PTS + LINE_GAP_EPS;
}

export { bookBeatsConsensus, evPctVsConsensus, sharpConsensusFromBooks, shopRailHidden };

function shopBookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Kept for callers that still import it. Gold is now any book on the line. */
export const SHOP_GOLD_KEYS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];

export function isPinnacleBook(name) {
  return shopBookKey(name) === 'pinnacle';
}

export function linesClose(a, b, eps = 0.051) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= eps;
}

export function bookOnTicketLine(bookLine, stakedLine) {
  if (stakedLine == null || !Number.isFinite(stakedLine)) return true;
  return Number.isFinite(bookLine) && linesClose(bookLine, stakedLine);
}

export function keepTicketLineBooks(books, stakedLine) {
  const onLine = stakedLine == null || !Number.isFinite(stakedLine)
    ? (books || [])
    : (books || []).filter((b) => bookOnTicketLine(b?.line, stakedLine));
  return onLine.filter((b) => !shopRailHidden(b?.name));
}

/**
 * Shop row for a spread/total. One number per row.
 * Keep the ticket when that number has the board. A line up to 2 points
 * toward this side replaces it only when that line has more books — a
 * one-book alt must not discard the ticket board or the real main.
 */
export function keepPlayBooks(books, stakedLine, { marketType, sideNorm } = {}) {
  const list = (books || []).filter((b) => b && !shopRailHidden(b.name));
  const ticket = Number(stakedLine);
  if (!Number.isFinite(ticket)) return list;
  const groups = new Map();
  for (const b of list) {
    const line = Number(b.line);
    if (!Number.isFinite(line)) continue;
    const onTicket = linesClose(line, ticket);
    if (!onTicket && !nearFavorableMain(ticket, line, { marketType, sideNorm })) continue;
    const key = onTicket ? 'ticket' : line.toFixed(3);
    const group = groups.get(key) || { onTicket, books: [] };
    group.books.push(b);
    groups.set(key, group);
  }
  let best = null;
  for (const group of groups.values()) {
    if (!best || group.books.length > best.books.length
      || (group.books.length === best.books.length && group.onTicket && !best.onTicket)) {
      best = group;
    }
  }
  return best ? best.books : [];
}

export function shopLineMatchesPlay(bookLine, ticketLine, { marketType, sideNorm } = {}) {
  if (bookOnTicketLine(bookLine, ticketLine)) return true;
  return nearFavorableMain(ticketLine, bookLine, { marketType, sideNorm });
}

export function pinPostedOdds(books) {
  for (const b of books || []) {
    if (!b || !Number.isFinite(b.odds) || shopRailHidden(b.name)) continue;
    if (isPinnacleBook(b.name)) return b.odds;
  }
  return null;
}

/** Green = better American than Pinnacle’s posted number on this line. */
export function bookBeatsPin(book, pinOdds) {
  if (!book || !Number.isFinite(book.odds) || !Number.isFinite(pinOdds)) return false;
  if (shopRailHidden(book.name) || isPinnacleBook(book.name)) return false;
  return book.odds > pinOdds;
}

/**
 * EV% of an offer vs Pinnacle’s posted implied (same (p_pin − p_offer)×100
 * as Fair EV). Only when the offer is strictly better American than Pin.
 */
export function evPctVsPinPosted(bookOdds, pinOdds) {
  if (!Number.isFinite(bookOdds) || !Number.isFinite(pinOdds)) return null;
  if (!(bookOdds > pinOdds)) return null;
  const pinP = impliedFromAmerican(pinOdds);
  if (pinP == null) return null;
  const ev = evPctVsFairProb(bookOdds, pinP);
  return Number.isFinite(ev) && ev > 0 ? ev : null;
}

/** Hero shop chip: best American on the rail, else the pay/fallback juice. */
export function resolveHeroShop({ bestOdds, bestBook, books, fallbackOdds } = {}) {
  const odds = Number.isFinite(bestOdds) ? bestOdds
    : (Number.isFinite(fallbackOdds) ? fallbackOdds : null);
  const book = bestBook || null;
  const pinOdds = pinPostedOdds(books);
  const consensus = sharpConsensusFromBooks(books);
  const consensusOdds = Number.isFinite(consensus.odds) ? consensus.odds : pinOdds;
  const evPct = evPctVsConsensus(odds, consensusOdds);
  return { odds, book, pinOdds, consensusOdds, evPct };
}

/** Gold / Best implied = best American on this ticket’s line. Ties all gold. */
export function markGoldFromTicketBooks(books) {
  let bestOdds = null;
  for (const b of books || []) {
    if (!b || !Number.isFinite(b.odds) || shopRailHidden(b.name)) continue;
    if (bestOdds == null || b.odds > bestOdds) bestOdds = b.odds;
  }
  let bestBook = null;
  for (const b of books || []) {
    if (!b) continue;
    const win = Number.isFinite(bestOdds)
      && Number.isFinite(b.odds)
      && b.odds === bestOdds
      && !shopRailHidden(b.name);
    b.best = win;
    if (win && !bestBook) bestBook = b.name;
  }
  return { bestOdds, bestBook };
}

function pinLabel(raw) {
  const s = String(raw || 'Pinnacle').trim();
  if (!s) return 'Pinnacle';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pushShopBook(books, seen, book) {
  if (!book || !Number.isFinite(book.odds) || shopRailHidden(book.name)) return;
  const key = String(book.name).toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  books.push(book);
}

function shopKeys(map) {
  return [
    ...SHOP_BOOK_PREFER.filter((k) => map[k]),
    ...Object.keys(map).filter((k) => !SHOP_BOOK_PREFER.includes(k) && k !== 'pinnacle' && !shopRailHidden(k)),
  ];
}

function onPlayLine(bookLine, ticketLine, market, side) {
  if (bookOnTicketLine(bookLine, ticketLine)) return true;
  return nearFavorableMain(ticketLine, bookLine, { marketType: market, sideNorm: side });
}

/** Same lead the locked card uses. The board seals 15 minutes before start. */
export const TICKET_FREEZE_LEAD_MS = 15 * 60 * 1000;

export function ticketFreezeAt(commenceMs) {
  const n = Number(commenceMs);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n - TICKET_FREEZE_LEAD_MS;
}

export function ticketIsFrozen(commenceMs, nowMs = Date.now()) {
  const at = ticketFreezeAt(commenceMs);
  return at != null && Number(nowMs) >= at;
}

/** Keep history points at or before the lock. Points without a time stay. */
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

/**
 * Pinnacle's last print at the lock. Live retail is not on the tape, so a
 * sealed card does not keep the moving best-book row.
 */
function frozenBoard(game, { market, side, line, freezeAt }) {
  if (market === 'TOTAL') {
    const hist = histUpTo(game.totalHistory, freezeAt);
    const hit = [...hist].reverse().find((h) => onPlayLine(h.line, line, 'total', side));
    if (!hit) return null;
    return {
      totalCurrent: { line: hit.line, overOdds: hit.overOdds, underOdds: hit.underOdds },
      fairTotalBook: hit.fairBook || game.fairTotalBook || 'pinnacle',
      allTotalBooks: {},
    };
  }
  if (market === 'SPREAD') {
    const hist = histUpTo(game.spreadHistory, freezeAt);
    const hit = [...hist].reverse().find((h) => {
      const ln = side === 'away' ? h.awayLine : h.homeLine;
      return onPlayLine(ln, line, 'spread', side);
    });
    if (!hit) return null;
    return {
      spreadCurrent: {
        awayLine: hit.awayLine,
        homeLine: hit.homeLine,
        awayOdds: hit.awayOdds,
        homeOdds: hit.homeOdds,
      },
      fairSpreadBook: hit.fairBook || game.fairSpreadBook || 'pinnacle',
      allSpreadBooks: {},
    };
  }
  const hist = histUpTo(game.history, freezeAt);
  const hit = [...hist].reverse().find((h) => {
    const o = side === 'away' ? h.away : side === 'draw' ? h.draw : h.home;
    return Number.isFinite(o);
  });
  if (!hit) return null;
  return {
    current: { away: hit.away, home: hit.home, draw: hit.draw },
    fairBook: hit.fairBook || game.fairBook || 'pinnacle',
    allBooks: {},
  };
}

/**
 * Shop for one open ticket. Same books the locked card prices:
 * Pinnacle on this line, the retail board, best American, EV vs sharp consensus.
 * At the lock (15 minutes before start) the live board is ignored and the
 * last Pinnacle print on the tape is the price. A miss stays null — the card
 * keeps the sharp's own price.
 */
export function quoteTicketShop(pinnacleHistory, ticket, opts = {}) {
  if (!ticket) return null;
  const game = lookupPinnGame(pinnacleHistory, ticket.sport, ticket.gameKey);
  if (!game) return null;
  const market = String(ticket.marketType || 'ML').toUpperCase();
  const side = String(ticket.side || '').toLowerCase();
  const line = Number.isFinite(Number(ticket.entryLine)) ? Number(ticket.entryLine) : null;
  const nowMs = Number.isFinite(opts?.nowMs) ? opts.nowMs : Date.now();
  const freezeAt = ticketFreezeAt(ticket.commenceMs);
  const sealed = freezeAt != null && nowMs >= freezeAt;
  const view = sealed ? frozenBoard(game, { market, side, line, freezeAt }) : game;
  if (!view) return null;
  const books = [];
  const seen = new Set();
  let presetOdds = null;
  let presetBook = null;

  if (market === 'TOTAL') {
    const cur = view.totalCurrent;
    if (cur && onPlayLine(cur.line, line, 'total', side)) {
      const o = side === 'under' ? cur.underOdds : cur.overOdds;
      pushShopBook(books, seen, { name: pinLabel(view.fairTotalBook), odds: o, sharp: true, line: cur.line });
    }
    const all = view.allTotalBooks || {};
    for (const k of shopKeys(all)) {
      const b = all[k];
      if (!b || !onPlayLine(b.line, line, 'total', side)) continue;
      const o = side === 'under' ? b.under : b.over;
      pushShopBook(books, seen, { name: b.name || k, odds: o, line: b.line });
    }
    const best = side === 'under' ? view.bestUnder : view.bestOver;
    if (best && Number.isFinite(best.odds) && onPlayLine(best.line, line, 'total', side)) {
      presetOdds = best.odds;
      presetBook = best.book || null;
    }
  } else if (market === 'SPREAD') {
    const cur = view.spreadCurrent;
    if (cur) {
      const ln = side === 'away' ? cur.awayLine : cur.homeLine;
      const o = side === 'away' ? cur.awayOdds : cur.homeOdds;
      if (onPlayLine(ln, line, 'spread', side)) {
        pushShopBook(books, seen, { name: pinLabel(view.fairSpreadBook), odds: o, sharp: true, line: ln });
      }
    }
    const all = view.allSpreadBooks || {};
    for (const k of shopKeys(all)) {
      const b = all[k];
      if (!b) continue;
      const ln = side === 'away' ? b.awayLine : b.homeLine;
      if (!onPlayLine(ln, line, 'spread', side)) continue;
      const o = side === 'away' ? b.away : b.home;
      pushShopBook(books, seen, { name: b.name || k, odds: o, line: ln });
    }
    const best = side === 'away' ? view.bestAwaySpread : view.bestHomeSpread;
    if (best && Number.isFinite(best.odds) && onPlayLine(best.line, line, 'spread', side)) {
      presetOdds = best.odds;
      presetBook = best.book || null;
    }
  } else {
    const cur = view.current || {};
    const fair = side === 'away' ? cur.away : side === 'draw' ? cur.draw : cur.home;
    pushShopBook(books, seen, { name: pinLabel(view.fairBook), odds: fair, sharp: true });
    const all = view.allBooks || {};
    for (const k of shopKeys(all)) {
      const b = all[k];
      const o = side === 'away' ? b?.away : side === 'draw' ? b?.draw : b?.home;
      pushShopBook(books, seen, { name: b?.name || k, odds: o });
    }
    presetOdds = side === 'away' ? view.bestAway : side === 'draw' ? view.bestDraw : view.bestHome;
    presetBook = side === 'away' ? view.bestAwayBook : side === 'draw' ? view.bestDrawBook : view.bestHomeBook;
    if (!Number.isFinite(presetOdds)) {
      presetOdds = null;
      presetBook = null;
    }
  }

  if (presetBook && Number.isFinite(presetOdds) && !shopRailHidden(presetBook)) {
    const hit = books.find((b) => String(b.name).toLowerCase() === String(presetBook).toLowerCase());
    // The feed's "best" is often a retail subset, and it can be the short
    // number. A plus price on the board beats −105. Keep the better American.
    if (hit) {
      if (presetOdds > hit.odds) hit.odds = presetOdds;
    } else pushShopBook(books, seen, { name: presetBook, odds: presetOdds });
  }

  if (!books.length) return null;
  const gold = markGoldFromTicketBooks(books);
  if (!Number.isFinite(gold.bestOdds)) return null;
  const shop = resolveHeroShop({
    bestOdds: gold.bestOdds,
    bestBook: gold.bestBook,
    books,
  });
  const implied = impliedFromAmerican(shop.odds);
  const rail = books.map((b) => ({
    ...b,
    best: shop.book && String(b.name).toLowerCase() === String(shop.book).toLowerCase(),
  }));
  rail.sort((a, b) => (Number(b.best) - Number(a.best)) || ((b.odds || -99999) - (a.odds || -99999)));
  return {
    odds: shop.odds,
    book: shop.book,
    evPct: shop.evPct,
    consensusOdds: Number.isFinite(shop.consensusOdds) ? shop.consensusOdds : null,
    impliedPct: implied == null ? null : Math.round(implied * 1000) / 10,
    books: rail.slice(0, 8),
    frozen: sealed,
  };
}
