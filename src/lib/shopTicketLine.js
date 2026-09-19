/**
 * Shop rail / gold chip stay on the ticket line.
 * Missing line is a miss — never paint 8.5 onto Over 7.5.
 */
import { evPctVsFairProb, impliedFromAmerican } from './oddsEv.js';

function shopBookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Kept for callers that still import it. Gold is now any book on the line. */
export const SHOP_GOLD_KEYS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];

export function shopRailHidden(name) {
  const k = shopBookKey(name);
  return k === 'lowvig' || k === 'lv' || k.includes('lowvig');
}

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
  const evPct = evPctVsPinPosted(odds, pinOdds);
  return { odds, book, pinOdds, evPct };
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
