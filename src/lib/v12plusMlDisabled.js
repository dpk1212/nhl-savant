/**
 * V12+ moneyline stake disable.
 *
 * When ON, moneylines still pick, lock, and stamp exactly as before —
 * every overlay, rung, receipt, and diagnostic field still runs and writes.
 *
 * Stake rule (after V12+ rungs, ML-MINI, juice, and the full V13 path
 * including #484 / #486 edge10+ / #487 rescue):
 *   • V13 action STAKE or MUTE → keep that exact V13 result
 *   • Before 2026-11-23, TRUST-G, STEAM-C, and GAP-LEAD kept the stake
 *     they already wrote. From 2026-11-23 (the moneyline ladder) no old
 *     rung keeps a moneyline stake: the stake is the V13 path's or 0.
 *   • Every other ML side (PASS / EXEMPT) → 0u muted with
 *     mutedBy / marker naming this flag as the mute source
 *   • Manual stake and operator kill still win
 *   • Never raises any stake; juice only lowers
 *
 * Spreads and totals are unchanged. V13 stamps every ML side each sync
 * (STAKE/MUTE/PASS) in v13MlPath.js — this flag only changes stake/mute.
 *
 * Default ON in this PR. Rollback: set V12PLUS_ML_DISABLED_DEFAULT to false,
 * or run with env V12PLUS_ML_DISABLED=0 / false / off.
 */

import { isV13MlLadderLive } from './v13MlPath.js';

/** Default ON. Flip to false to roll back without an env override. */
export const V12PLUS_ML_DISABLED_DEFAULT = true;

/** mutedBy value — mute source is the V12+ ML-disabled flag. */
export const V12PLUS_ML_DISABLED_MUTED_BY = 'v12plus-ml-disabled';

export const V12PLUS_ML_DISABLED_REASON = 'v12plus_ml_disabled';

/** Side-level marker: stake was zeroed / muted by the V12+ ML disable flag. */
export const V12PLUS_ML_STAKE_DISABLED_FIELD = 'v8_v12plusMlStakeDisabled';
export const V12PLUS_ML_STAKE_DISABLED_REASON_FIELD = 'v8_v12plusMlStakeDisabledReason';
/** Units the pipeline had before the flag forced 0 (V12+ / post-PASS). */
export const V12PLUS_ML_UNITS_PRE_FIELD = 'v8_unitsPreV12plusMlDisabled';

/**
 * Fields that intentionally differ when the flag zeros a non-V13 ML side.
 * V13 STAKE/MUTE sides differ in none of these vs flag-off (flag does not apply).
 */
export const V12PLUS_ML_DIFF_FIELDS = Object.freeze([
  'finalUnits',
  'peak.units',
  'lock.units',
  'peak.unitTier',
  'lock.unitTier',
  'v8_agsUnitsApplied',
  'v8_agsV12UnitsApplied',
  'mutedBy',
  'health.status',
  'health.reasons',
  V12PLUS_ML_STAKE_DISABLED_FIELD,
  V12PLUS_ML_STAKE_DISABLED_REASON_FIELD,
  V12PLUS_ML_UNITS_PRE_FIELD,
]);

function envOverride() {
  const raw = process.env.V12PLUS_ML_DISABLED;
  if (raw == null || raw === '') return null;
  const v = String(raw).trim().toLowerCase();
  if (v === '0' || v === 'false' || v === 'off' || v === 'no') return false;
  if (v === '1' || v === 'true' || v === 'on' || v === 'yes') return true;
  return null;
}

/** True when the disable flag is active (default ON). */
export function isV12plusMlDisabled() {
  const env = envOverride();
  return env == null ? V12PLUS_ML_DISABLED_DEFAULT : env;
}

export function isMoneylineMarket(market) {
  const u = String(market || '').toUpperCase();
  return u === 'ML' || u === 'MONEYLINE' || u === 'H2H';
}

/** True when this market is in scope for the disable flag. */
export function v12plusMlStakeDisabled(market) {
  return isV12plusMlDisabled() && isMoneylineMarket(market);
}

/** V13 STAKE/MUTE keep their result; PASS/EXEMPT/null are zeroed when the flag is on. */
export function isV13MlStakeKept(v13Action) {
  const a = String(v13Action || '').toUpperCase();
  return a === 'STAKE' || a === 'MUTE';
}

/**
 * Rungs that kept a moneyline stake after the flag, on pick dates before
 * the moneyline ladder. From the ladder's first day none of them does.
 */
const V12PLUS_ML_KEEP_TIERS = new Set(['TRUST-G', 'STEAM-C', 'GAP-LEAD']);

/** A pick date is required. With none, or from the ladder's first day, no rung is kept. */
export function isV12plusMlRungKept(stakeTier, pickDate = null) {
  if (typeof pickDate !== 'string' || pickDate.length < 10) return false;
  if (isV13MlLadderLive(pickDate)) return false;
  return V12PLUS_ML_KEEP_TIERS.has(String(stakeTier || ''));
}

/**
 * Final ML stake/mute override.
 * Call AFTER V12+ rungs and AFTER applyV13MlPath.
 * Does not change lockStage or policy stamps. Never raises units.
 */
export function applyV12plusMlStakeDisable({
  market = null,
  units = 0,
  operatorKilled = false,
  manual = false,
  v13Action = null,
  stakeTier = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const base = {
    applied: false,
    units: pre,
    unitsPre: pre,
    mutedBy: null,
    healthStatus: null,
    marker: null,
    reason: null,
    preservedBy: null,
  };
  if (!v12plusMlStakeDisabled(market)) return base;
  if (operatorKilled === true) return { ...base, preservedBy: 'operator' };
  if (manual === true) return { ...base, preservedBy: 'manual' };
  if (isV13MlStakeKept(v13Action)) {
    return { ...base, preservedBy: 'v13' };
  }
  if (pre > 0 && isV12plusMlRungKept(stakeTier, pickDate)) {
    return { ...base, preservedBy: String(stakeTier) };
  }
  // V13 PASS / EXEMPT / absent → strip the V12+ stake; mute with flag marker.
  return {
    applied: true,
    units: 0,
    unitsPre: pre,
    mutedBy: V12PLUS_ML_DISABLED_MUTED_BY,
    healthStatus: 'MUTED',
    marker: {
      [V12PLUS_ML_STAKE_DISABLED_FIELD]: true,
      [V12PLUS_ML_STAKE_DISABLED_REASON_FIELD]: V12PLUS_ML_DISABLED_REASON,
      [V12PLUS_ML_UNITS_PRE_FIELD]: pre,
    },
    reason: V12PLUS_ML_DISABLED_REASON,
    preservedBy: null,
  };
}
