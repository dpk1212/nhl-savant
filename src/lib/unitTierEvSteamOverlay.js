/**
 * Unit-tier EV × steam overlay — last step after Ev-drift.
 *
 * Ship (2026-09-11+):
 *   1. MUTE 0u if current EV < −2 and steam is NOT on. Missing EV fail-open.
 *      Steam-on fail-open (keep the bet even if the price looks rich).
 *   2. PROMOTE 2–<4u → 4u if steam-on OR lock-EV in [0, 1) OR last-hour ≥ 2%,
 *      unless last-hour < 0 (do not treat a fade as confirmation).
 *
 * Does not touch 4u+ except the mute. Does not promote <2u. Does not
 * half-size. Does not rename paths. Missing steam/EV stamps fail-open.
 */
export const UNIT_TIER_EV_STEAM_FROM = '2026-09-11';
export const UNIT_TIER_EV_MUTED_BY = 'ev-lt2-no-steam';
export const UNIT_TIER_EV_MUTE_MAX = -2; // exclusive: currentEv < −2
export const UNIT_TIER_PROMOTE_UNITS = 4;
export const UNIT_TIER_PROMOTE_MIN = 2; // inclusive
export const UNIT_TIER_PROMOTE_MAX = 4; // exclusive
export const UNIT_TIER_LOCK_EV_MIN = 0;
export const UNIT_TIER_LOCK_EV_MAX = 1; // exclusive [0, 1)
export const UNIT_TIER_LH_PROMOTE_MIN = 2;

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

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'MUTE'|'PROMOTE',
 *   reason: string|null,
 *   mutedBy: string|null,
 *   unitsPrePolicy: number,
 *   currentEv: number|null,
 *   steamOn: boolean,
 *   lastHourPct: number|null,
 * }}
 */
export function applyUnitTierEvSteamOverlay({
  units,
  currentEv = null,
  steamTier = null,
  tapeSteamOnLock = false,
  lastHourPct = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const ev = asFinite(currentEv);
  const lh = asFinite(lastHourPct);
  const steamOn = isSteamOn({ steamTier, tapeSteamOnLock });

  const hold = (action = 'HOLD', reason = null, extra = {}) => ({
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    currentEv: ev,
    steamOn,
    lastHourPct: lh,
    ...extra,
  });

  if (!(pre > 0)) {
    return {
      units: 0,
      action: 'PASS',
      reason: null,
      mutedBy: null,
      unitsPrePolicy: pre,
      currentEv: ev,
      steamOn,
      lastHourPct: lh,
    };
  }
  if (!isUnitTierEvSteamLive(pickDate)) return hold('EXEMPT', 'pre_cutover');

  // 1. Mute toxic price only when we can see EV and steam is not confirming.
  if (ev != null && ev < UNIT_TIER_EV_MUTE_MAX && !steamOn) {
    return {
      units: 0,
      action: 'MUTE',
      reason: 'unit_tier_ev_lt2',
      mutedBy: UNIT_TIER_EV_MUTED_BY,
      unitsPrePolicy: pre,
      currentEv: ev,
      steamOn,
      lastHourPct: lh,
    };
  }

  // 2. Floor medium tickets that already look like 4u. Fading last-hour
  //    is not confirmation even if steam-on.
  const fading = lh != null && lh < 0;
  if (!fading && pre >= UNIT_TIER_PROMOTE_MIN && pre < UNIT_TIER_PROMOTE_MAX) {
    const lockEvBand = ev != null && ev >= UNIT_TIER_LOCK_EV_MIN && ev < UNIT_TIER_LOCK_EV_MAX;
    const lhConfirm = lh != null && lh >= UNIT_TIER_LH_PROMOTE_MIN;
    if (steamOn || lockEvBand || lhConfirm) {
      return {
        units: UNIT_TIER_PROMOTE_UNITS,
        action: 'PROMOTE',
        reason: 'unit_tier_promote_4u',
        mutedBy: null,
        unitsPrePolicy: pre,
        currentEv: ev,
        steamOn,
        lastHourPct: lh,
      };
    }
  }

  return hold('HOLD', null);
}
