/**
 * Shop rail / gold chip stay on the ticket line.
 * Missing line is a miss — never paint 8.5 onto Over 7.5.
 */
import { evPctVsFairProb, impliedFromAmerican } from './oddsEv.js';
import {
  bookBeatsConsensus,
  evPctVsConsensus,
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
