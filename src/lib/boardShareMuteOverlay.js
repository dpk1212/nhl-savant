/**
 * Board $ share mute — after unit-tier EV × steam, before S/T fat mute.
 *
 * Ship (2026-09-17+):
 *   Mute all-$ FOR share in [0.25, 0.45).
 *   If share < 0.25, keep only when proven $ share (CONFIRMED+FLAT) ≥ 0.50
 *   (junk-against). True buried (<25% and proven <50%) mutes.
 *   ≥45% keep.
 *
 * Fail-open when walletDetails are missing or all-$ share cannot be
 * computed — do not mute the whole book. Missing proven $ on a <25%
 * ticket is not an exception (mute). Does not resize. Does not repath.
 * Manual stake exempt at the call site.
 *
 * Share construction matches scripts/analyzeShareMuteThreshold.mjs:
 *   share  = all walletDetails.invested on our side / (ours + against)
 *   shareP = confirmed||flat invested only
 */
import {
  sourceFlagsFromSportRec,
  sportRecFromProfiles,
} from './steamTailPolicy.js';

export const BOARD_SHARE_MUTE_FROM = '2026-09-17';
export const BOARD_SHARE_MUTED_BY = 'board-share';
export const BOARD_SHARE_MUTE_MIN = 0.25; // inclusive
export const BOARD_SHARE_MUTE_MAX = 0.45; // exclusive
export const BOARD_SHARE_PROVEN_KEEP_MIN = 0.50; // inclusive

export function isBoardShareMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= BOARD_SHARE_MUTE_FROM;
}

function asFinite(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asShare(v) {
  const n = asFinite(v);
  if (n == null) return null;
  if (n < 0 || n > 1) return null;
  return n;
}

function pack({
  units,
  action,
  reason = null,
  mutedBy = null,
  unitsPrePolicy,
  share = null,
  shareP = null,
  hasWalletDetails = false,
} = {}) {
  return {
    units,
    action,
    reason,
    mutedBy,
    unitsPrePolicy,
    share,
    shareP,
    hasWalletDetails,
  };
}

/**
 * All-$ and proven-$ FOR share from point-in-time walletDetails.
 * Dedupes by last-6 wallet short. Proven = CONFIRMED or FLAT tier.
 */
export function boardShareFromWalletDetails(walletDetails, side, sport, walletProfiles) {
  const empty = {
    share: null,
    shareP: null,
    forUsd: 0,
    agUsd: 0,
    forProvenUsd: 0,
    agProvenUsd: 0,
    nWallets: 0,
    hasWalletDetails: false,
  };
  if (!Array.isArray(walletDetails) || walletDetails.length === 0 || !side) {
    return empty;
  }

  let forUsd = 0;
  let agUsd = 0;
  let forProvenUsd = 0;
  let agProvenUsd = 0;
  const seen = new Set();
  for (const w of walletDetails) {
    if (!w) continue;
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const inv = Number(w.invested) || 0;
    const onOurs = String(w.side) === String(side);
    const flags = sourceFlagsFromSportRec(sportRecFromProfiles(walletProfiles, short, sport));
    const proven = !!(flags.confirmed || flags.flat);
    if (onOurs) {
      forUsd += inv;
      if (proven) forProvenUsd += inv;
    } else {
      agUsd += inv;
      if (proven) agProvenUsd += inv;
    }
  }

  const tot = forUsd + agUsd;
  const totP = forProvenUsd + agProvenUsd;
  return {
    share: tot > 0 ? forUsd / tot : null,
    shareP: totP > 0 ? forProvenUsd / totP : null,
    forUsd,
    agUsd,
    forProvenUsd,
    agProvenUsd,
    nWallets: seen.size,
    hasWalletDetails: true,
  };
}

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'MUTE',
 *   reason: string|null,
 *   mutedBy: string|null,
 *   unitsPrePolicy: number,
 *   share: number|null,
 *   shareP: number|null,
 *   hasWalletDetails: boolean,
 * }}
 */
export function applyBoardShareMuteOverlay({
  units,
  pickDate = null,
  share = null,
  shareP = null,
  hasWalletDetails = false,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const allShare = asShare(share);
  const provenShare = asShare(shareP);
  const seenDetails = hasWalletDetails === true;

  const hold = (action = 'HOLD', reason = null) => pack({
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    share: allShare,
    shareP: provenShare,
    hasWalletDetails: seenDetails,
  });

  const mute = (reason) => pack({
    units: 0,
    action: 'MUTE',
    reason,
    mutedBy: BOARD_SHARE_MUTED_BY,
    unitsPrePolicy: pre,
    share: allShare,
    shareP: provenShare,
    hasWalletDetails: seenDetails,
  });

  if (!(pre > 0)) {
    return pack({
      units: 0,
      action: 'PASS',
      reason: null,
      mutedBy: null,
      unitsPrePolicy: pre,
      share: allShare,
      shareP: provenShare,
      hasWalletDetails: seenDetails,
    });
  }
  if (!isBoardShareMuteLive(pickDate)) return hold('EXEMPT', 'pre_cutover');
  if (!seenDetails || allShare == null) return hold('HOLD', 'board_share_fail_open');

  if (allShare >= BOARD_SHARE_MUTE_MIN && allShare < BOARD_SHARE_MUTE_MAX) {
    return mute('board_share_mid');
  }
  if (allShare < BOARD_SHARE_MUTE_MIN) {
    if (provenShare != null && provenShare >= BOARD_SHARE_PROVEN_KEEP_MIN) {
      return hold('HOLD', 'board_share_junk_against');
    }
    return mute('board_share_buried');
  }
  return hold('HOLD', null);
}

export function applyBoardShareMuteOverlayFromTicket({
  units,
  pickDate = null,
  walletDetails = null,
  side = null,
  sport = null,
  walletProfiles = null,
} = {}) {
  const shares = boardShareFromWalletDetails(walletDetails, side, sport, walletProfiles);
  return applyBoardShareMuteOverlay({
    units,
    pickDate,
    share: shares.share,
    shareP: shares.shareP,
    hasWalletDetails: shares.hasWalletDetails,
  });
}
