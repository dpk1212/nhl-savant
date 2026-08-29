/** How long after commence a sport's board still counts as "live" for the rail. */
export const DEFAULT_SLATE_ACTIVE_AFTER_COMMENCE_MS = 4.5 * 60 * 60 * 1000;
export const SPORT_SLATE_ACTIVE_AFTER_COMMENCE_MS = {
  UFC: 8 * 60 * 60 * 1000, // cards run long; keep after early fights tip
  SOC: 3 * 60 * 60 * 1000,
};

function todayET(nowMs = Date.now()) {
  return new Date(nowMs).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/**
 * True while a sport still belongs on the main rail / climate: upcoming or
 * recently tipped games on the board, or today's locks still pending. Once
 * the slate is done and locks are graded, the sport drops off by default.
 */
export function isSportSlateActive(sport, {
  allGames = [],
  pinnacleHistory = null,
  lockedPicks = {},
  nowMs = Date.now(),
} = {}) {
  const sp = String(sport || '').toUpperCase();
  if (!sp) return false;
  const windowMs = SPORT_SLATE_ACTIVE_AFTER_COMMENCE_MS[sp]
    ?? DEFAULT_SLATE_ACTIVE_AFTER_COMMENCE_MS;

  for (const g of allGames) {
    if (String(g?.sport || '').toUpperCase() !== sp) continue;
    const raw = pinnacleHistory?.[sp]?.[g.key]?.commence
      || g.commence
      || g.commenceTime
      || null;
    const ct = raw != null ? new Date(raw).getTime() : NaN;
    if (!Number.isFinite(ct)) return true; // on board, clock unknown — keep visible
    if (ct > nowMs - windowMs) return true;
  }

  const today = todayET(nowMs);
  for (const [docId, doc] of Object.entries(lockedPicks || {})) {
    if (!docId.startsWith(today)) continue;
    if (String(doc.sport || '').toUpperCase() !== sp) continue;
    for (const sd of Object.values(doc.sides || {})) {
      if (!sd || sd.superseded) continue;
      if (sd.status === 'COMPLETED' || sd.result?.outcome) continue;
      const u = Number(sd.finalUnits);
      if ((Number.isFinite(u) && u > 0) || sd.lockStage === 'LOCKED' || sd.lockStage === 'LEAN') {
        return true;
      }
    }
  }
  return false;
}
