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

export function slugLeague(slug) {
  const m = String(slug || '').toLowerCase().match(/^([a-z0-9]+)-/);
  return m ? m[1] : null;
}

/** False when the position names a different sport than the board card. */
export function positionFitsBoardSport(pos, sport) {
  const want = BOARD_SPORT_SLUG[String(sport || '').toUpperCase()];
  if (!want) return true;
  const league = slugLeague(pos?.slug || pos?.eventSlug);
  if (!league) return true;
  return league === want;
}
