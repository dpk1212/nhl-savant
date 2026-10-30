const T_MINUS_15_MS = 15 * 60 * 1000;

/**
 * Polymarket start to store on a card that is still in play.
 * A graded or exited card stays put. A new start that is already in the
 * past is ignored. Any other change is adopted, including when the card
 * already froze on the old time, so a later correction moves the lock.
 * Returns the new timestamp, or null to keep the stored one.
 */
export function adoptedCommenceMs({ status, storedMs, freshMs, nowMs }) {
  if (status === 'COMPLETED' || status === 'EXITED') return null;
  if (!Number.isFinite(freshMs) || !Number.isFinite(nowMs)) return null;
  if (freshMs <= nowMs) return null;
  if (Number.isFinite(storedMs) && freshMs === storedMs) return null;
  return freshMs;
}

/**
 * A later start that is still more than 15 minutes away reopens a seal
 * that was taken against the old time. An earlier start, or a move that
 * lands inside the new 15-minute window, leaves the seal alone.
 */
export function commenceMoveReopensLock(storedMs, freshMs, nowMs, windowMs = T_MINUS_15_MS) {
  return Number.isFinite(storedMs)
    && Number.isFinite(freshMs)
    && freshMs > storedMs
    && Number.isFinite(nowMs)
    && nowMs < freshMs - windowMs;
}
