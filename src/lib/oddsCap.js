/**
 * Stepped underdog size cap. Favorites through +120 are uncapped by odds.
 * This is a size clamp, not a mute — +200 still ships, at 1u.
 */
export function oddsCap(units, odds) {
  if (!Number.isFinite(units)) return 0;
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds > 120) return Math.min(units, 2.5);
  return units;
}
