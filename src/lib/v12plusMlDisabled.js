/**
 * V12+ moneyline stake disable.
 *
 * When ON, moneylines still pick, lock, and stamp exactly as on 2026-11-18 —
 * every overlay, rung, receipt, and diagnostic field still runs and writes.
 * The only product change: every ML side ends at 0u and is treated as muted,
 * with mutedBy / marker naming the V12+ ML-disabled flag as the mute source.
 * Spreads and totals are unchanged.
 *
 * Default ON in this PR. Rollback: set V12PLUS_ML_DISABLED_DEFAULT to false,
 * or run with env V12PLUS_ML_DISABLED=0 / false / off.
 *
 * Clears the path for a separate V13 moneyline stake path later.
 * Does not implement V13.
 */

/** Default ON. Flip to false to roll back without an env override. */
export const V12PLUS_ML_DISABLED_DEFAULT = true;

/** mutedBy value — mute source is the V12+ ML-disabled flag. */
export const V12PLUS_ML_DISABLED_MUTED_BY = 'v12plus-ml-disabled';

export const V12PLUS_ML_DISABLED_REASON = 'v12plus_ml_disabled';

/** Side-level marker: stake was zeroed / muted by the V12+ ML disable flag. */
export const V12PLUS_ML_STAKE_DISABLED_FIELD = 'v8_v12plusMlStakeDisabled';
export const V12PLUS_ML_STAKE_DISABLED_REASON_FIELD = 'v8_v12plusMlStakeDisabledReason';
/** Units the pipeline computed before the flag forced 0. */
export const V12PLUS_ML_UNITS_PRE_FIELD = 'v8_unitsPreV12plusMlDisabled';

/**
 * Fields that intentionally differ when the flag is on for ML vs flag-off.
 * All other fields/stamps (lockStage, rung stamps, press, OG edge, odds, …)
 * must stay identical to the flag-off path.
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

/** True when this market's final stake must be forced to 0 + muted. */
export function v12plusMlStakeDisabled(market) {
  return isV12plusMlDisabled() && isMoneylineMarket(market);
}

/**
 * Final ML stake/mute override.
 * Call AFTER all overlays, stamps, and lockStage are computed as today.
 * Forces 0u + mutedBy marker. Does not change lockStage or policy stamps.
 * Operator kill still wins (caller keeps its own mute/units).
 */
export function applyV12plusMlStakeDisable({
  market = null,
  units = 0,
  operatorKilled = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  if (!v12plusMlStakeDisabled(market) || operatorKilled === true) {
    return {
      applied: false,
      units: pre,
      unitsPre: pre,
      mutedBy: null,
      healthStatus: null,
      marker: null,
      reason: null,
    };
  }
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
  };
}
