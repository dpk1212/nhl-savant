/**
 * Locked Picks ORDER comparator.
 *
 * Default rank is stake size: higher units = higher conviction on the card.
 * Star rating used to lead this sort and put 1u STRONG above 2.5u LOCKED.
 * TOP PICK badges do not jump a smaller ticket over a larger one.
 */

const HEALTH_ORDER = { ACTIVE: 0, MUTED: 1, CANCELLED: 2 };

function healthRank(p) {
  return HEALTH_ORDER[p?.health?.status || 'ACTIVE'] ?? 0;
}

function unitsOf(p) {
  const u = Number(p?.units);
  return Number.isFinite(u) ? u : 0;
}

function starsOf(p) {
  const s = Number(p?.stars);
  return Number.isFinite(s) ? s : 0;
}

function gameTimeMs(p) {
  if (!p?.gameTime) return 0;
  const t = new Date(p.gameTime).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function compareLockedPicks(a, b, sortMode = 'units') {
  if (!!a?.superseded !== !!b?.superseded) return a?.superseded ? 1 : -1;
  const health = healthRank(a) - healthRank(b);
  if (health !== 0) return health;

  if (sortMode === 'time') {
    return gameTimeMs(a) - gameTimeMs(b) || unitsOf(b) - unitsOf(a);
  }

  // Default / 'units' / legacy 'stars' chip id.
  return unitsOf(b) - unitsOf(a) || starsOf(b) - starsOf(a);
}
