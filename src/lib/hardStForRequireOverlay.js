/**
 * S/T HARD+ FOR require — last-step 0u after HARD+ AG.
 *
 * Spreads and totals need ≥1 HARD wallet on our side
 * (Source B sport×market n≥4 WR≥62 $ROI≥10). No specialist with us → mute.
 * 2026-10-04+: that HARD FOR must be sized ≥1.0× sport usual so
 * RANK/Q1/SHARP cannot publish S/T on a 0.18× sprinkle.
 * ML is exempt. Do not fade. Do not resize, repath, or flip.
 *
 * market-skill already has st-hard-slip (2026-09-24). This remute catches
 * tickets that slip leaked (fail-open HOLD, leftover size, day-1 lock).
 * leftover / Policy T / unit-tier / HARD+ AG run unchanged.
 *
 * Fail-open (HOLD at exact units) when we cannot judge:
 *   missing walletProfiles, empty walletDetails, or no sport×byMarket
 *   schema on any ticket wallet. Never wipe the book on a load miss.
 *
 * Going-forward only. Roll-back:
 *   HARD_ST_FOR_REQUIRE_FROM = '9999-01-01'
 *   HARD_ST_FOR_FULL_FROM = '9999-01-01'   (lights can hold again)
 */
import {
  attachMarketBooks,
  getWalletProfile,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';
import {
  HARD_FULL_SIZE_GATE_FROM,
  HARD_MKT_HOLD_MIN_SR,
  isHardFullSizeGateLive,
} from './hardMuteExceptionOverlay.js';
import { stakeSizeRatio } from './sizeRatioBands.js';

export const HARD_ST_FOR_REQUIRE_FROM = '2026-09-26';
export const HARD_ST_FOR_MUTED_BY = 'st-hard-for';
export const HARD_ST_FOR_FULL_FROM = HARD_FULL_SIZE_GATE_FROM;
export const HARD_ST_FOR_MIN_SR = HARD_MKT_HOLD_MIN_SR;

export function isHardStForRequireLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_ST_FOR_REQUIRE_FROM;
}

function identity(units, action, reason, extra = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  return {
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    ...extra,
  };
}

/**
 * Last-step S/T HARD+ FOR require. Never changes units unless the
 * ticket is SPREAD/TOTAL and no HARD wallet (2026-10-04+: no full-size
 * HARD wallet) is on our side. 4u+ is NOT exempt.
 */
export function applyHardStForRequireOverlay({
  units,
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const mkt = normalizeMarketType(marketType);
  const extra = { marketType: mkt, schemaN: 0, hardForN: 0, fullN: 0 };

  if (!(pre > 0)) {
    return {
      units: 0, action: 'PASS', reason: null, mutedBy: null, unitsPrePolicy: pre, ...extra,
    };
  }
  if (!isHardStForRequireLive(pickDate)) {
    return identity(pre, 'EXEMPT', 'pre_cutover', extra);
  }
  if (mkt === 'ML') {
    return identity(pre, 'EXEMPT', 'market_exempt', extra);
  }
  if (mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return identity(pre, 'EXEMPT', 'market_exempt', extra);
  }
  if (!sport || side == null || side === '') {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }
  if (!walletProfiles) {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }

  const { wallets, schemaN } = attachMarketBooks(
    walletDetails, side, sport, mkt, walletProfiles,
  );
  extra.schemaN = schemaN;
  if (!wallets.length || schemaN === 0) {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }

  const hardFor = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos));
  extra.hardForN = hardFor.length;
  extra.fullN = hardForSizedN(hardFor, sport, walletProfiles, HARD_ST_FOR_MIN_SR);
  if (isHardFullSizeGateLive(pickDate) && extra.fullN < 1) {
    return {
      units: 0,
      action: 'MUTE',
      reason: extra.hardForN >= 1 ? 'st_no_full_hard_for' : 'st_no_hard_for',
      mutedBy: HARD_ST_FOR_MUTED_BY,
      unitsPrePolicy: pre,
      ...extra,
    };
  }
  if (hardFor.length >= 1) {
    return identity(pre, 'HOLD', null, extra);
  }
  return {
    units: 0,
    action: 'MUTE',
    reason: 'st_no_hard_for',
    mutedBy: HARD_ST_FOR_MUTED_BY,
    unitsPrePolicy: pre,
    ...extra,
  };
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
