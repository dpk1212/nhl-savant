/**
 * Polymarket event slugs are `{league}-{teams}-{date}`.
 * A CanPL / Liga MX slug on the same calendar day is not a WNBA moneyline.
 */

export const BOARD_SPORT_SLUG = {
  WNBA: 'wnba',
  MLB: 'mlb',
  NHL: 'nhl',
  NFL: 'nfl',
  NBA: 'nba',
  UFC: 'ufc',
};

/** Polymarket league tokens that belong on a SOC board (not a single slug). */
export const SOC_SLUG_LEAGUES = new Set(['epl', 'lal', 'fifwc']);

export function slugLeague(slug) {
  const m = String(slug || '').toLowerCase().match(/^([a-z0-9]+)-/);
  return m ? m[1] : null;
}

/** False when the position names a different sport than the board card. */
export function positionFitsBoardSport(pos, sport) {
  const s = String(sport || '').toUpperCase();
  const league = slugLeague(pos?.slug || pos?.eventSlug);
  if (s === 'SOC') {
    if (!league) return true;
    return SOC_SLUG_LEAGUES.has(league);
  }
  const want = BOARD_SPORT_SLUG[s];
  if (!want) return true;
  if (!league) return true;
  return league === want;
}
