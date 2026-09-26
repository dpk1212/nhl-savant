/**
 * HARD mute-exception overlay — HOLD after the mute stack, before HARD+ AG
 * and the S/T HARD+ FOR require.
 *
 * Directional rescue: if the last mute is tape-weak / maxsr-sub4 /
 * fools-gold-flat / top-crowded AND ≥1 FOR wallet is HARD on the
 * as-of Source B sport×market book, put the ticket back at the
 * units that mute cancelled.
 *
 * One cut: tape-weak on SPREAD / TOTAL stays muted (inverted in
 * steam-era). leftover / T / believed-cut / etc. are not excepted.
 *
 * Does NOT resize, repath, or flip. Fail-open (keep muted) when the
 * sport×byMarket schema is missing — never invent a HARD read.
 *
 * Going-forward only. Roll-back: HARD_MUTE_EXCEPTION_FROM = '9999-01-01'.
 */
import {
  attachMarketBooks,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';

export const HARD_MUTE_EXCEPTION_FROM = '2026-09-24';
export const HARD_MUTE_EXCEPTION_RESCUED_BY = 'hard-mkt-hold';

export const HARD_EXCEPTION_MUTES = new Set([
  'tape-weak',
  'maxsr-sub4',
  'fools-gold-flat',
  'top-crowded',
]);

export function isHardMuteExceptionLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_MUTE_EXCEPTION_FROM;
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
  const extra = {
    marketType: mkt,
    lastMutedBy: mutedBy || null,
    schemaN: 0,
    hardN: 0,
    mutedBy: mutedBy || null,
  };

  if (current > 0) {
    return identity(current, 'PASS', 'already_live', extra);
  }
  if (!isHardMuteExceptionLive(pickDate)) {
    return identity(current, 'EXEMPT', 'pre_cutover', extra);
  }
  if (!mutedBy || !HARD_EXCEPTION_MUTES.has(mutedBy)) {
    return identity(current, 'EXEMPT', 'mute_not_excepted', extra);
  }
  if (mutedBy === 'tape-weak' && (mkt === 'SPREAD' || mkt === 'TOTAL')) {
    return identity(current, 'EXEMPT', 'tape_st_cut', extra);
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

  const hard = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos));
  extra.hardN = hard.length;
  if (hard.length < 1) {
    return identity(current, 'HOLD_MUTE', 'no_hard_for', extra);
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
  };
}
