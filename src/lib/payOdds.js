/**
 * Locked-card invariant: hero American must be the sportsbook quote for the
 * hero line. Polymarket avgPrice is a PM receipt — never the juice painted
 * next to "+2.5" / "Under 8.5" as if it were book odds.
 *
 * Incident: NFL chi_ten 2026-08-29 — hero Bears +2.5 +110 (poly) while
 * same-line Pinnacle tape was −108. That pairing is why spreads/totals
 * "break every day": two venues, one hero slot.
 */
/** Polymarket receipt / oddsSource — not a sportsbook fair. */
export function isPolyBookStamp({ oddsSource, book, fairBook } = {}) {
  const src = `${oddsSource || ''} ${fairBook || ''} ${book || ''}`.toLowerCase();
  return src.includes('poly');
}

/**
 * Same-line book juice from lock/peak stamps. Null when pinnacleOdds is
 * just a copy of the Poly ticket (norf_uva 2026-09-11: −134 → −134).
 */
export function stampedBookOdds({
  pinnacleOdds = null,
  lockPinnOdds = null,
  odds = null,
  oddsSource = null,
  book = null,
  fairBook = null,
} = {}) {
  const bookPx = Number.isFinite(Number(lockPinnOdds)) && Number(lockPinnOdds) !== 0
    ? Number(lockPinnOdds)
    : (Number.isFinite(Number(pinnacleOdds)) && Number(pinnacleOdds) !== 0
      ? Number(pinnacleOdds)
      : null);
  if (bookPx == null) return null;
  if (!isPolyBookStamp({ oddsSource, book, fairBook })) return bookPx;
  const ticket = Number.isFinite(Number(odds)) && Number(odds) !== 0 ? Number(odds) : null;
  if (ticket != null && Math.round(bookPx) === Math.round(ticket)) return null;
  return bookPx;
}

export function resolvePayOdds({
  stampedOdds = null,
  bookOnLine = null,
  polyReceipt = null,
  bookLabel = null,
  oddsSource = null,
  fairBook = null,
} = {}) {
  const stamp = Number.isFinite(stampedOdds) && stampedOdds !== 0 ? stampedOdds : null;
  const bookPx = Number.isFinite(bookOnLine) && bookOnLine !== 0 ? bookOnLine : null;
  const poly = Number.isFinite(polyReceipt) && polyReceipt !== 0 ? polyReceipt : null;

  const src = `${oddsSource || ''} ${fairBook || ''} ${bookLabel || ''}`.toLowerCase();
  const stampLooksPoly = src.includes('poly')
    || (poly != null && stamp != null && Math.abs(Math.round(stamp) - Math.round(poly)) <= 2);

  if (stampLooksPoly && bookPx != null && stamp != null
      && Math.round(stamp) !== Math.round(bookPx)) {
    return { payOdds: bookPx, polyReceipt: poly ?? stamp, demotedPoly: true };
  }
  if (stamp != null) return { payOdds: stamp, polyReceipt: poly, demotedPoly: false };
  if (bookPx != null) return { payOdds: bookPx, polyReceipt: poly, demotedPoly: false };
  return { payOdds: null, polyReceipt: poly, demotedPoly: false };
}
