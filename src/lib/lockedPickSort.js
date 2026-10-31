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

function byUnits(a, b) {
  return unitsOf(b) - unitsOf(a) || starsOf(b) - starsOf(a);
}

/** Graded profit only. Open plays have no result, even when profit was stamped 0. */
function gradedProfit(p) {
  const outcome = p?.outcome || p?.result?.outcome || null;
  const completed = String(p?.status || '').toUpperCase() === 'COMPLETED';
  if (outcome !== 'WIN' && outcome !== 'LOSS' && outcome !== 'PUSH' && !completed) return null;
  const n = Number(p?.profit);
  return Number.isFinite(n) ? n : null;
}

function gradedWinPct(p) {
  const n = Number(p?.winPct);
  return Number.isFinite(n) ? n : null;
}

function nullsLast(a, b, read, fallback) {
  const av = read(a);
  const bv = read(b);
  if (av == null && bv == null) return fallback(a, b);
  if (av == null) return 1;
  if (bv == null) return -1;
  return bv - av || fallback(a, b);
}

export function compareLockedPicks(a, b, sortMode = 'units') {
  if (!!a?.superseded !== !!b?.superseded) return a?.superseded ? 1 : -1;
  const health = healthRank(a) - healthRank(b);
  if (health !== 0) return health;

  if (sortMode === 'time') {
    return gameTimeMs(a) - gameTimeMs(b) || byUnits(a, b);
  }

  if (sortMode === 'profit') {
    return nullsLast(a, b, gradedProfit, byUnits);
  }

  // A single play does not carry a win rate. Missing winPct stays on units.
  if (sortMode === 'winpct') {
    return nullsLast(a, b, gradedWinPct, byUnits);
  }

  // Default / 'units' / legacy 'stars' chip id.
  return byUnits(a, b);
}
