/**
 * Unit-tier EV × steam overlay — last step after fav-juice.
 *
 * Ship (2026-09-11+; promote tightened 2026-09-12):
 *   1. MUTE 0u if current EV < −2 and steam is NOT on. Missing EV fail-open.
 *      Steam-on fail-open (keep the bet even if the price looks rich).
 *   2. PROMOTE 2–<4u → 4u only when steam is printing now: arriving
 *      (off→on) OR last-hour ≥ 3% (steam floor, not watch). Last-hour < 0
 *      blocks. Lock EV < −1 vetoes a dead number (missing lock EV
 *      fail-open). LEAN and FADE do not get fatter.
 *
 * Does not touch 4u+ except the mute. Does not promote <2u. Does not
 * half-size. Does not rename paths. Steam-on / tiny EV alone is not a yes.
 */
import { STEAM_EVENT_PCT } from './steamMove.js';

export const UNIT_TIER_EV_STEAM_FROM = '2026-09-11';
export const UNIT_TIER_EV_MUTED_BY = 'ev-lt2-no-steam';
export const UNIT_TIER_EV_MUTE_MAX = -2; // exclusive: currentEv < −2
export const UNIT_TIER_PROMOTE_UNITS = 4;
export const UNIT_TIER_PROMOTE_MIN = 2; // inclusive
export const UNIT_TIER_PROMOTE_MAX = 4; // exclusive
export const UNIT_TIER_LOCK_EV_VETO = -1; // exclusive: lockEv < −1 blocks promote
export const UNIT_TIER_LH_PROMOTE_MIN = STEAM_EVENT_PCT; // 3 — steam, not watch
export const UNIT_TIER_NO_PROMOTE_TIERS = new Set(['LEAN', 'FADE']);

export function isUnitTierEvSteamLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= UNIT_TIER_EV_STEAM_FROM;
}

function asFinite(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function isSteamOn({ steamTier = null, tapeSteamOnLock = false } = {}) {
  const t = steamTier == null ? '' : String(steamTier).toLowerCase();
  return t === 'steam' || t === 'gold' || tapeSteamOnLock === true;
}

function pack({
  units,
  action,
  reason = null,
  mutedBy = null,
  unitsPrePolicy,
  currentEv,
  lockEv,
  steamOn,
  steamArriving,
  lastHourPct,
  lockTier,
}) {
  return {
    units,
    action,
    reason,
    mutedBy,
    unitsPrePolicy,
    currentEv,
    lockEv,
    steamOn: !!steamOn,
    steamArriving: !!steamArriving,
    lastHourPct,
    lockTier: lockTier == null ? null : String(lockTier).toUpperCase(),
  };
}

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'MUTE'|'PROMOTE',
 *   reason: string|null,
 *   mutedBy: string|null,
 *   unitsPrePolicy: number,
 *   currentEv: number|null,
 *   lockEv: number|null,
 *   steamOn: boolean,
 *   steamArriving: boolean,
 *   lastHourPct: number|null,
 *   lockTier: string|null,
 * }}
 */
export function applyUnitTierEvSteamOverlay({
  units,
  currentEv = null,
  lockEv = null,
  steamTier = null,
  tapeSteamOnLock = false,
  steamArriving = false,
  lastHourPct = null,
  lockTier = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const ev = asFinite(currentEv);
  const lock = asFinite(lockEv);
  const lh = asFinite(lastHourPct);
  const steamOn = isSteamOn({ steamTier, tapeSteamOnLock });
  const arriving = steamArriving === true;
  const tier = lockTier == null || lockTier === ''
    ? null
    : String(lockTier).toUpperCase();

  const hold = (action = 'HOLD', reason = null) => pack({
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    currentEv: ev,
    lockEv: lock,
    steamOn,
    steamArriving: arriving,
    lastHourPct: lh,
    lockTier: tier,
  });

  if (!(pre > 0)) {
    return pack({
      units: 0,
      action: 'PASS',
      reason: null,
      mutedBy: null,
      unitsPrePolicy: pre,
      currentEv: ev,
      lockEv: lock,
      steamOn,
      steamArriving: arriving,
      lastHourPct: lh,
      lockTier: tier,
    });
  }
  if (!isUnitTierEvSteamLive(pickDate)) return hold('EXEMPT', 'pre_cutover');

  // 1. Mute toxic live price only when we can see EV and steam is not on.
  if (ev != null && ev < UNIT_TIER_EV_MUTE_MAX && !steamOn) {
    return pack({
      units: 0,
      action: 'MUTE',
      reason: 'unit_tier_ev_lt2',
      mutedBy: UNIT_TIER_EV_MUTED_BY,
      unitsPrePolicy: pre,
      currentEv: ev,
      lockEv: lock,
      steamOn,
      steamArriving: arriving,
      lastHourPct: lh,
      lockTier: tier,
    });
  }

  // 2. Timing promote only. Fade / dead lock-EV / LEAN / FADE stay as-sized.
  const fading = lh != null && lh < 0;
  if (fading) return hold('HOLD', 'fade_block');
  if (pre >= UNIT_TIER_PROMOTE_MIN && pre < UNIT_TIER_PROMOTE_MAX) {
    if (tier && UNIT_TIER_NO_PROMOTE_TIERS.has(tier)) {
      return hold('HOLD', 'tier_no_promote');
    }
    const timing = arriving || (lh != null && lh >= UNIT_TIER_LH_PROMOTE_MIN);
    const evOk = lock == null || lock >= UNIT_TIER_LOCK_EV_VETO;
    if (timing && evOk) {
      return pack({
        units: UNIT_TIER_PROMOTE_UNITS,
        action: 'PROMOTE',
        reason: 'unit_tier_promote_timing',
        mutedBy: null,
        unitsPrePolicy: pre,
        currentEv: ev,
        lockEv: lock,
        steamOn,
        steamArriving: arriving,
        lastHourPct: lh,
        lockTier: tier,
      });
    }
  }

  return hold('HOLD', null);
}
