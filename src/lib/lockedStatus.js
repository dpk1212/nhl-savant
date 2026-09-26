/**
 * Locked Picks status buckets.
 * Pending = ungraded and still before commence.
 * In progress = ungraded and commence has passed.
 * A missing clock stays pending so a card is not treated as live.
 */

export function isResolvedLockedPick(p) {
  const o = p?.outcome || p?.result?.outcome || null;
  if (o === 'WIN' || o === 'LOSS' || o === 'PUSH') return true;
  return String(p?.status || '').toUpperCase() === 'COMPLETED';
}

export function lockedGameStarted(p, nowMs = Date.now()) {
  const ms = Number(p?.commenceMs);
  return Number.isFinite(ms) && nowMs >= ms;
}

/** 'pending' | 'inprogress' | 'won' | 'lost' | 'resolved' */
export function lockedStatusBucket(p, nowMs = Date.now()) {
  if (isResolvedLockedPick(p)) {
    if (p?.outcome === 'WIN') return 'won';
    if (p?.outcome === 'LOSS') return 'lost';
    return 'resolved';
  }
  return lockedGameStarted(p, nowMs) ? 'inprogress' : 'pending';
}
