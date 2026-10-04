/**
 * HARD mute-exception overlay — HOLD after the mute stack, before HARD+ AG
 * and the S/T HARD+ FOR require.
 *
 * Three rescue paths. None resize a live ticket, repath, or flip.
 * Fail-open (keep muted) when the sport×byMarket schema is missing —
 * never invent a HARD read. Size unknown is not a press — keep muted.
 *
 * 1. 2026-09-24+  ≥1 HARD FOR restores uPre when last mute is tape-weak /
 *    maxsr-sub4 / fools-gold-flat / top-crowded. tape-weak S/T stays muted.
 *    2026-10-04+: that HARD FOR must be sized ≥1.0× sport usual
 *    (Source B ≥1.0× book, not a 0.18× sprinkle floored to 2–4u).
 *
 * 2. 2026-09-28+  ≥2 unique HARD+ FOR restores a wider mute set
 *    (steam-tail / leftover / st-fat / tape-weak including S/T,
 *    plus the 09-24 list). Size = max(uPre, 3) capped at 4.
 *    Unique wallets, not duplicate listings. Do not except ev-drift,
 *    fav-juice, unstamped 0u, or fade.
 *    2026-09-28: also requires 0 HARD+ AG.
 *    2026-09-29+: margin (FOR−AG) ≥ +1 is enough (2-1 rescues, 2-2 stays muted).
 *    2026-10-04+: ≥1 of those HARD+ FOR must be sized ≥1.0×.
 *
 * 3. 2026-09-28+  SPREAD/TOTAL, ≥1 unique HARD+ FOR sized ≥1.5× sport
 *    usual, 0 HARD+ AG, same mute set as (2). Restore uPre capped at 4
 *    (no 3u floor). ML stays on (1)/(2). Skip board-share / ev-drift /
 *    fav-juice / unstamped 0u / fade. 2-for still wins when ≥2 HARD.
 *
 * Going-forward only. Roll-back:
 *   HARD_MUTE_EXCEPTION_FROM = '9999-01-01'
 *   HARD_TWO_FOR_EXCEPTION_FROM = '9999-01-01'
 *   HARD_TWO_FOR_MARGIN_FROM = '9999-01-01'   (2-for requires 0 AG again)
 *   HARD_ST_PRESS_EXCEPTION_FROM = '9999-01-01'
 *   HARD_FULL_SIZE_GATE_FROM = '9999-01-01'   (lights can rescue again)
 */
import {
  attachMarketBooks,
  getWalletProfile,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';
import { stakeSizeRatio } from './sizeRatioBands.js';

export const HARD_MUTE_EXCEPTION_FROM = '2026-09-24';
export const HARD_MUTE_EXCEPTION_RESCUED_BY = 'hard-mkt-hold';

export const HARD_TWO_FOR_EXCEPTION_FROM = '2026-09-28';
export const HARD_TWO_FOR_MARGIN_FROM = '2026-09-29';
export const HARD_TWO_FOR_RESCUED_BY = 'hard-2for-hold';
export const HARD_TWO_FOR_MIN_N = 2;
export const HARD_TWO_FOR_FLOOR_U = 3;
export const HARD_TWO_FOR_CAP_U = 4;

export const HARD_ST_PRESS_EXCEPTION_FROM = '2026-09-28';
export const HARD_ST_PRESS_RESCUED_BY = 'hard-st-press-hold';
export const HARD_ST_PRESS_MIN_N = 1;
export const HARD_ST_PRESS_MIN_SR = 1.5;
export const HARD_ST_PRESS_CAP_U = 4;

/** Oct 3 hole: 1 HARD at 0.18× restored 3u. Same 1.0× bar as the floor. */
export const HARD_FULL_SIZE_GATE_FROM = '2026-10-04';
export const HARD_MKT_HOLD_MIN_SR = 1.0;
export const HARD_TWO_FOR_MIN_SR = 1.0;

export const HARD_EXCEPTION_RESCUE_STAMPS = new Set([
  HARD_MUTE_EXCEPTION_RESCUED_BY,
  HARD_TWO_FOR_RESCUED_BY,
  HARD_ST_PRESS_RESCUED_BY,
]);

export const HARD_EXCEPTION_MUTES = new Set([
  'tape-weak',
  'maxsr-sub4',
  'fools-gold-flat',
  'top-crowded',
]);

export const HARD_TWO_FOR_EXCEPTION_MUTES = new Set([
  'steam-tail',
  'believed-cut',
  'fail-open-sub4',
  'st-fat',
  'tape-weak',
  'maxsr-sub4',
  'fools-gold-flat',
  'top-crowded',
]);

export function isHardMuteExceptionLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_MUTE_EXCEPTION_FROM;
}

export function isHardTwoForExceptionLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_TWO_FOR_EXCEPTION_FROM;
}

export function isHardTwoForMarginLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_TWO_FOR_MARGIN_FROM;
}

/** True when 2-for must stay muted because we are not ahead on unique HARD wallets. */
export function twoForAgBlocks(hardN, hardAgN, pickDate) {
  if (!(hardAgN >= 1)) return false;
  if (isHardTwoForMarginLive(pickDate)) return (hardN - hardAgN) < 1;
  return true;
}

export function isHardStPressExceptionLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_ST_PRESS_EXCEPTION_FROM;
}

export function isHardFullSizeGateLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_FULL_SIZE_GATE_FROM;
}

export function isHardExceptionRescueStamp(value) {
  return HARD_EXCEPTION_RESCUE_STAMPS.has(value);
}

/**
 * First policy in last-wins order that actually cancelled size.
 * policies[0] is the latest overlay (market-skill), last is tape/clv.
 */
export function lastAppliedMute(policies) {
  for (const p of policies || []) {
    if (!p || !p.mutedBy) continue;
    const pre = Number(p.unitsPrePolicy);
    if (!Number.isFinite(pre) || !(pre > 0)) continue;
    const cancelled = p.action === 'MUTE'
      || p.action === 'CANCEL'
      || (Number.isFinite(p.units) && p.units === 0);
    if (!cancelled) continue;
    return { mutedBy: String(p.mutedBy), unitsPre: pre };
  }
  return { mutedBy: null, unitsPre: 0 };
}

export function twoHardForRestoreUnits(unitsPreMute) {
  const pre = Number.isFinite(unitsPreMute) ? Math.max(0, unitsPreMute) : 0;
  if (!(pre > 0)) return 0;
  return Math.min(HARD_TWO_FOR_CAP_U, Math.max(HARD_TWO_FOR_FLOOR_U, pre));
}

export function stPressRestoreUnits(unitsPreMute) {
  const pre = Number.isFinite(unitsPreMute) ? Math.max(0, unitsPreMute) : 0;
  if (!(pre > 0)) return 0;
  return Math.min(HARD_ST_PRESS_CAP_U, pre);
}

function hardForSizedN(hardFor, sport, walletProfiles, minSr) {
  let n = 0;
  for (const w of hardFor || []) {
    const profile = getWalletProfile(walletProfiles, w.short);
    const sr = stakeSizeRatio(w, profile, sport);
    if (Number.isFinite(sr) && sr >= minSr) n += 1;
  }
  return n;
}

function hardForPressN(hardFor, sport, walletProfiles) {
  return hardForSizedN(hardFor, sport, walletProfiles, HARD_ST_PRESS_MIN_SR);
}

function identity(units, action, reason, extra = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  return {
    units: pre,
    action,
    reason,
    mutedBy: extra.mutedBy ?? null,
    rescuedBy: null,
    unitsPrePolicy: pre,
    ...extra,
  };
}

function packExtra(mutedBy, mkt, extra = {}) {
  return {
    marketType: mkt,
    lastMutedBy: mutedBy || null,
    schemaN: extra.schemaN ?? 0,
    hardN: extra.hardN ?? 0,
    hardAgN: extra.hardAgN ?? 0,
    margin: extra.margin ?? 0,
    pressN: extra.pressN ?? 0,
    fullN: extra.fullN ?? 0,
    mutedBy: mutedBy || null,
  };
}

/**
 * Last-step HARD hold. units is the post-mute stake (0 when muted).
 * unitsPreMute is the size the last mute cancelled.
 */
export function applyHardMuteExceptionOverlay({
  units,
  mutedBy = null,
  unitsPreMute = null,
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
  pickDate = null,
} = {}) {
  const current = Number.isFinite(units) ? Math.max(0, units) : 0;
  const restore = Number.isFinite(unitsPreMute) ? Math.max(0, unitsPreMute) : 0;
  const mkt = normalizeMarketType(marketType);
  const extra = packExtra(mutedBy, mkt);

  if (current > 0) {
    return identity(current, 'PASS', 'already_live', extra);
  }
  if (!isHardMuteExceptionLive(pickDate)) {
    return identity(current, 'EXEMPT', 'pre_cutover', extra);
  }
  if (!mutedBy) {
    return identity(current, 'EXEMPT', 'mute_not_excepted', extra);
  }
  if (!(restore > 0)) {
    return identity(current, 'PASS', 'no_pre_units', extra);
  }
  if (mkt !== 'ML' && mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return identity(current, 'EXEMPT', 'market_exempt', extra);
  }
  if (!sport || side == null || side === '' || !walletProfiles) {
    return identity(current, 'EXEMPT', 'schema_missing', extra);
  }

  const { wallets, schemaN } = attachMarketBooks(
    walletDetails, side, sport, mkt, walletProfiles,
  );
  extra.schemaN = schemaN;
  if (!wallets.length || schemaN === 0) {
    return identity(current, 'EXEMPT', 'schema_missing', extra);
  }

  const hardFor = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos));
  const hardAg = wallets.filter((w) => !w.onFor && isHardMarketWallet(w.pos));
  extra.hardN = hardFor.length;
  extra.hardAgN = hardAg.length;
  extra.margin = extra.hardN - extra.hardAgN;
  extra.pressN = hardForPressN(hardFor, sport, walletProfiles);
  extra.fullN = hardForSizedN(hardFor, sport, walletProfiles, HARD_MKT_HOLD_MIN_SR);

  if (
    isHardTwoForExceptionLive(pickDate)
    && HARD_TWO_FOR_EXCEPTION_MUTES.has(mutedBy)
    && extra.hardN >= HARD_TWO_FOR_MIN_N
  ) {
    if (twoForAgBlocks(extra.hardN, extra.hardAgN, pickDate)) {
      return identity(current, 'HOLD_MUTE', 'hard_ag', extra);
    }
    if (isHardFullSizeGateLive(pickDate) && extra.fullN < 1) {
      return identity(current, 'HOLD_MUTE', 'no_full_size', extra);
    }
    const sized = twoHardForRestoreUnits(restore);
    return {
      units: sized,
      action: 'RESCUE',
      reason: 'hard_2for_hold',
      mutedBy: null,
      rescuedBy: HARD_TWO_FOR_RESCUED_BY,
      rescuedFrom: mutedBy,
      unitsPrePolicy: restore,
      marketType: mkt,
      lastMutedBy: mutedBy,
      schemaN: extra.schemaN,
      hardN: extra.hardN,
      hardAgN: extra.hardAgN,
      margin: extra.margin,
      pressN: extra.pressN,
      fullN: extra.fullN,
    };
  }

  if (
    isHardStPressExceptionLive(pickDate)
    && (mkt === 'SPREAD' || mkt === 'TOTAL')
    && HARD_TWO_FOR_EXCEPTION_MUTES.has(mutedBy)
    && extra.hardN >= HARD_ST_PRESS_MIN_N
    && extra.pressN >= 1
  ) {
    if (extra.hardAgN >= 1) {
      return identity(current, 'HOLD_MUTE', 'hard_ag', extra);
    }
    const sized = stPressRestoreUnits(restore);
    return {
      units: sized,
      action: 'RESCUE',
      reason: 'hard_st_press_hold',
      mutedBy: null,
      rescuedBy: HARD_ST_PRESS_RESCUED_BY,
      rescuedFrom: mutedBy,
      unitsPrePolicy: restore,
      marketType: mkt,
      lastMutedBy: mutedBy,
      schemaN: extra.schemaN,
      hardN: extra.hardN,
      hardAgN: extra.hardAgN,
      margin: extra.margin,
      pressN: extra.pressN,
      fullN: extra.fullN,
    };
  }

  if (!HARD_EXCEPTION_MUTES.has(mutedBy)) {
    return identity(current, 'EXEMPT', 'mute_not_excepted', extra);
  }
  if (mutedBy === 'tape-weak' && (mkt === 'SPREAD' || mkt === 'TOTAL')) {
    return identity(current, 'EXEMPT', 'tape_st_cut', extra);
  }
  if (extra.hardN < 1) {
    return identity(current, 'HOLD_MUTE', 'no_hard_for', extra);
  }
  if (isHardFullSizeGateLive(pickDate) && extra.fullN < 1) {
    return identity(current, 'HOLD_MUTE', 'no_full_size', extra);
  }

  return {
    units: restore,
    action: 'RESCUE',
    reason: 'hard_mkt_hold',
    mutedBy: null,
    rescuedBy: HARD_MUTE_EXCEPTION_RESCUED_BY,
    rescuedFrom: mutedBy,
    unitsPrePolicy: restore,
    marketType: mkt,
    lastMutedBy: mutedBy,
    schemaN: extra.schemaN,
    hardN: extra.hardN,
    hardAgN: extra.hardAgN,
    margin: extra.margin,
    pressN: extra.pressN,
    fullN: extra.fullN,
  };
}
