/**
 * Fade proven-$ hold — after Path C, before tape.
 *
 * Ship (2026-09-18+):
 *   FadeTop still mutes mute-tiers when top against WR ≥ 60 and beats FOR.
 *   Exception: moneyline SHARP-LEAN with proven $ share (CONFIRMED+FLAT) ≥ 50%
 *   HOLDS through fade and continues to EDGE band / tape / leftover /
 *   steam-tail / board-share.
 *
 * Missing proven $ is not an exception (fade still mutes).
 * SPREAD / TOTAL stay faded. SUPER / TOP / MINI / RANK / SHARP stay faded.
 * Does not resize. Does not repath.
 *
 * Proven share construction matches boardShareMuteOverlay:
 *   shareP = confirmed||flat invested FOR / (FOR + AG proven $)
 */
import { boardShareFromWalletDetails } from './boardShareMuteOverlay.js';

export const FADE_PROVEN_HOLD_FROM = '2026-09-18';
export const FADE_PROVEN_HOLD_MIN = 0.50; // inclusive
export const FADE_PROVEN_HOLD_PATHS = new Set(['SHARP-LEAN']);
export const FADE_PROVEN_HOLD_MARKETS = new Set(['ML']);

export function isFadeProvenHoldLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= FADE_PROVEN_HOLD_FROM;
}

export function isFadeProvenHoldMarket(marketType) {
  const m = String(marketType || '').toUpperCase();
  return m === 'ML' || m === 'MONEYLINE';
}

export function isFadeProvenHoldPath(path) {
  return FADE_PROVEN_HOLD_PATHS.has(String(path || ''));
}

function asShare(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 1) return null;
  return n;
}

function pack({
  hold = false,
  action = 'SKIP',
  reason = null,
  shareP = null,
} = {}) {
  return { hold: !!hold, action, reason, shareP };
}

/**
 * @returns {{
 *   hold: boolean,
 *   action: 'HOLD'|'SKIP'|'EXEMPT'|'PASS',
 *   reason: string|null,
 *   shareP: number|null,
 * }}
 */
export function evaluateFadeProvenHold({
  pickDate = null,
  marketType = null,
  path = null,
  shareP = null,
  fadeWouldMute = false,
} = {}) {
  const provenShare = asShare(shareP);

  if (!fadeWouldMute) {
    return pack({ hold: false, action: 'PASS', reason: null, shareP: provenShare });
  }
  if (!isFadeProvenHoldLive(pickDate)) {
    return pack({ hold: false, action: 'EXEMPT', reason: 'pre_cutover', shareP: provenShare });
  }
  if (!isFadeProvenHoldMarket(marketType)) {
    return pack({ hold: false, action: 'SKIP', reason: 'not_ml', shareP: provenShare });
  }
  if (!isFadeProvenHoldPath(path)) {
    return pack({ hold: false, action: 'SKIP', reason: 'not_sharp_lean', shareP: provenShare });
  }
  if (provenShare == null) {
    return pack({ hold: false, action: 'SKIP', reason: 'proven_missing', shareP: null });
  }
  if (provenShare < FADE_PROVEN_HOLD_MIN) {
    return pack({ hold: false, action: 'SKIP', reason: 'proven_lt50', shareP: provenShare });
  }
  return pack({
    hold: true,
    action: 'HOLD',
    reason: 'fade_proven_hold',
    shareP: provenShare,
  });
}

export function evaluateFadeProvenHoldFromTicket({
  pickDate = null,
  marketType = null,
  path = null,
  fadeWouldMute = false,
  walletDetails = null,
  side = null,
  sport = null,
  walletProfiles = null,
} = {}) {
  const shares = boardShareFromWalletDetails(walletDetails, side, sport, walletProfiles);
  return evaluateFadeProvenHold({
    pickDate,
    marketType,
    path,
    shareP: shares.shareP,
    fadeWouldMute,
  });
}
