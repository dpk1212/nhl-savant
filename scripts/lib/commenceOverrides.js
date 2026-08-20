/**
 * Odds API / Polymarket start times that were wrong.
 * Key: `${sport}:${gameKey}` → ISO UTC.
 *
 * Applied by fetchPolymarketData + snapshotPinnacle so a later cron
 * cannot re-stamp the bad schedule time onto the board.
 */
export const COMMENCE_OVERRIDES = {
  // 2026-08-18 Dream @ Aces tipped 9:00 PM ET. Odds API + Poly listed 10:00.
  'WNBA:atl_lva': '2026-08-19T01:00:00.000Z',
};

export function overrideCommenceIso(sport, gameKey, iso) {
  const hit = COMMENCE_OVERRIDES[`${sport}:${gameKey}`];
  return hit || iso;
}

export function applyCommenceOverrides(commenceTimes) {
  if (!commenceTimes || typeof commenceTimes !== 'object') return commenceTimes;
  for (const [key, iso] of Object.entries(COMMENCE_OVERRIDES)) {
    commenceTimes[key] = iso;
  }
  return commenceTimes;
}
