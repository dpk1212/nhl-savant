/**
 * Shop rail / gold chip stay on the ticket line.
 * Missing line is a miss — never paint 8.5 onto Over 7.5.
 */

export const SHOP_GOLD_KEYS = ['draftkings', 'fanduel', 'betmgm', 'caesars'];

function shopBookKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function linesClose(a, b, eps = 0.051) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= eps;
}

export function bookOnTicketLine(bookLine, stakedLine) {
  if (stakedLine == null || !Number.isFinite(stakedLine)) return true;
  return Number.isFinite(bookLine) && linesClose(bookLine, stakedLine);
}

export function keepTicketLineBooks(books, stakedLine) {
  if (stakedLine == null || !Number.isFinite(stakedLine)) return books || [];
  return (books || []).filter((b) => bookOnTicketLine(b?.line, stakedLine));
}

/** Gold / Best implied from books already filtered to this ticket’s line. */
export function markGoldFromTicketBooks(books) {
  const gold = new Set(SHOP_GOLD_KEYS);
  let best = null;
  for (const b of books || []) {
    if (!b || !Number.isFinite(b.odds)) continue;
    const k = shopBookKey(b.name);
    if (!gold.has(k)) continue;
    if (!best || b.odds > best.odds) best = b;
  }
  for (const b of books || []) {
    if (!b) continue;
    b.best = !!(best && shopBookKey(b.name) === shopBookKey(best.name));
  }
  return best
    ? { bestOdds: best.odds, bestBook: best.name }
    : { bestOdds: null, bestBook: null };
}
