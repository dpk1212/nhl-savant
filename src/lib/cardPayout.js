/**
 * Locked-card face: the American next to the pick is the payout juice.
 * ATP / CS2 / LoL have no sportsbook. Shop gold and to-win were two
 * fields — Shang ML −174 next to 2.0u to win +2.00u (even money).
 */

const BOOKLESS = new Set(['ATP', 'CS2', 'LOL']);

export function isBooklessCardSport(sport) {
  return BOOKLESS.has(String(sport || '').toUpperCase());
}

export function toWinFromAmerican(odds, units) {
  if (!Number.isFinite(odds) || odds === 0 || !(Number(units) > 0)) return 0;
  const u = Number(units);
  return odds < 0 ? u * (100 / Math.abs(odds)) : u * (odds / 100);
}

/**
 * Pending locked face. Bookless sports pay the painted American.
 * Books keep the mapped ticket to-win (gold chip can be a different shop).
 */
export function lockedCardToWin({ sport, units, toWin, paintedOdds } = {}) {
  const u = Number(units);
  if (!(u > 0)) return 0;
  if (isBooklessCardSport(sport)
      && Number.isFinite(paintedOdds)
      && paintedOdds !== 0) {
    return toWinFromAmerican(paintedOdds, u);
  }
  return Number.isFinite(toWin) ? toWin : 0;
}
