// How often the fat-ticket search has to run, and when a position scan is
// too broken to replace the board the site is already serving.

export const DISCOVER_INTERVAL_MS = 60 * 60 * 1000;
export const BOARD_FAIL_FRACTION = 0.1;

/** True when sharp_scan_supplement.json was written less than an hour ago. */
export function supplementIsFresh(updatedAt, now = Date.now()) {
  const t = Date.parse(updatedAt ?? '');
  if (!Number.isFinite(t)) return false;
  return now - t < DISCOVER_INTERVAL_MS;
}

/**
 * A handful of failed wallets still publishes. More than 10% means the read
 * was refused and the previous board should stay up.
 */
export function shouldKeepPreviousBoard(failed, attempted, fraction = BOARD_FAIL_FRACTION) {
  const n = Number(attempted);
  const f = Number(failed);
  if (!Number.isFinite(n) || n <= 0) return false;
  if (!Number.isFinite(f) || f < 0) return false;
  return f / n > fraction;
}
