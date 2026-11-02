/**
 * College basketball v12+ stake hold.
 *
 * The book is back on the board and wallets need graded bets before a stake
 * means anything. From 2026-11-02 through 2026-11-11 (10 dates, Eastern game
 * date) every CBB v12+ stake is 0. The side is still created and graded.
 * NHL, NBA, NFL, and CFB are not in this hold. A manual stake is exempt at
 * the call site.
 */

export const CBB_V12_MUTE_FROM = '2026-11-02';
export const CBB_V12_MUTE_THROUGH = '2026-11-11';
export const CBB_MATURE_MUTED_BY = 'cbb-mature';

export function cbbV12StakeMuted(sport, pickDate) {
  if (String(sport || '').toUpperCase() !== 'CBB') return false;
  const d = String(pickDate || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  return d >= CBB_V12_MUTE_FROM && d <= CBB_V12_MUTE_THROUGH;
}
