/**
 * Locked-card invariant: hero American must be the sportsbook quote for the
 * hero line. Polymarket avgPrice is a PM receipt — never the juice painted
 * next to "+2.5" / "Under 8.5" as if it were book odds.
 *
 * Incident: NFL chi_ten 2026-08-29 — hero Bears +2.5 +110 (poly) while
 * same-line Pinnacle tape was −108. That pairing is why spreads/totals
 * "break every day": two venues, one hero slot.
 */
export function resolvePayOdds({
  stampedOdds = null,
  bookOnLine = null,
  polyReceipt = null,
  bookLabel = null,
  oddsSource = null,
  fairBook = null,
  sealed = false,
} = {}) {
  const stamp = Number.isFinite(stampedOdds) && stampedOdds !== 0 ? stampedOdds : null;
  const bookPx = Number.isFinite(bookOnLine) && bookOnLine !== 0 ? bookOnLine : null;
  const poly = Number.isFinite(polyReceipt) && polyReceipt !== 0 ? polyReceipt : null;

  const src = `${oddsSource || ''} ${fairBook || ''} ${bookLabel || ''}`.toLowerCase();
  // T-15 shop seal is the grade ticket. Peak can still say poly_avgPrice —
  // do not demote a sealed −114 onto live tape −116.
  if (sealed || src.includes('t15_best')) {
    if (stamp != null) return { payOdds: stamp, polyReceipt: poly, demotedPoly: false };
    if (bookPx != null) return { payOdds: bookPx, polyReceipt: poly, demotedPoly: false };
    return { payOdds: null, polyReceipt: poly, demotedPoly: false };
  }
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
