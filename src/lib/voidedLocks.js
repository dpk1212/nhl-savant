/**
 * Hard-void lock sides that must never count or render.
 *
 * Use for false grades / ghost locks that should not wait on a Firestore
 * surgery (or that surgery already cleared). Keys: `${docId}|${sideKey}`.
 *
 * 2026-08-29 bos_nyy__2 home: MLB DH Game 2 was graded ~2 min after first
 * pitch with Game 1's final (BOS 6–0). CONFIRMED-Q1 AGS bypass stamped 4u
 * at T-15 despite agsV12 < 0 and peak/lock units 0 — never a real lock.
 */
export const VOIDED_LOCK_SIDES = new Set([
  '2026-08-29_MLB_bos_nyy__2|home',
]);

export function isVoidedLockSide(docId, sideKey) {
  if (!docId || !sideKey) return false;
  return VOIDED_LOCK_SIDES.has(`${docId}|${sideKey}`);
}
