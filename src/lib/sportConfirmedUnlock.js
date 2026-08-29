/**
 * Sport Confirmed unlock ladder (Idea 1) — NFL / CFB only.
 *
 * Thin Confirmed pools on new sports mint high-u theater (LEAN + EDGE + tape
 * → 5.4u on pf 1–2). Cap published units by sport-wide CONFIRMED count until
 * the pool is deep enough for the full ladder.
 *
 *   Confirmed n < 5  → max 1u
 *   5–9              → max 2u (bridge)
 *   10–14            → max 3u (half — no 4u+ mint)
 *   ≥15              → full ladder (no-op)
 *
 * Absolute-last CAP after all mutes. Does not mute to 0, repath, or change
 * tier labels. MLB / SOC / deep sports are not on the allowlist → untouched.
 * Forward-only via SPORT_UNLOCK_GATE_FROM.
 */

/** Live from this pickDate (YYYY-MM-DD) inclusive. */
export const SPORT_UNLOCK_GATE_FROM = '2026-08-29';

/** Sports that use the gated ladder. Deep books stay off this set. */
export const SPORT_UNLOCK_GATE_SPORTS = Object.freeze(new Set(['NFL', 'CFB']));

/** Confirmed thresholds → max publishable units (null = no cap). */
export const SPORT_UNLOCK_THRESHOLDS = Object.freeze([
  { minConfirmed: 15, maxUnits: null },
  { minConfirmed: 10, maxUnits: 3 },
  { minConfirmed: 5, maxUnits: 2 },
  { minConfirmed: 0, maxUnits: 1 },
]);

export function isSportUnlockGateLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= SPORT_UNLOCK_GATE_FROM;
}

export function isSportUnlockGatedSport(sport) {
  return SPORT_UNLOCK_GATE_SPORTS.has(String(sport || '').toUpperCase());
}

/**
 * Max units allowed for a sport Confirmed pool size.
 * @returns {number|null} null = full ladder (no cap)
 */
export function sportUnlockMaxUnits(nSportConfirmed) {
  const n = Number.isFinite(Number(nSportConfirmed))
    ? Math.max(0, Math.floor(Number(nSportConfirmed)))
    : 0;
  for (const row of SPORT_UNLOCK_THRESHOLDS) {
    if (n >= row.minConfirmed) return row.maxUnits;
  }
  return 1;
}

/**
 * Count wallets with whitelistTier === CONFIRMED for one sport.
 * Accepts Map or plain object of profiles (same shapes as sync).
 */
export function countSportConfirmed(sport, walletProfiles) {
  if (!sport || !walletProfiles) return 0;
  const sportKey = String(sport);
  let n = 0;
  const visit = (profile) => {
    if (!profile || typeof profile !== 'object') return;
    if (profile?.bySport?.[sportKey]?.whitelistTier === 'CONFIRMED') n++;
  };
  if (typeof walletProfiles.values === 'function') {
    for (const profile of walletProfiles.values()) visit(profile);
  } else if (typeof walletProfiles === 'object') {
    for (const profile of Object.values(walletProfiles)) visit(profile);
  }
  return n;
}

/**
 * Build sport → Confirmed-n Map for gated sports (sync preload).
 */
export function buildSportConfirmedCounts(walletProfiles, sports = SPORT_UNLOCK_GATE_SPORTS) {
  const out = new Map();
  for (const sport of sports) {
    out.set(sport, countSportConfirmed(sport, walletProfiles));
  }
  return out;
}

/**
 * Absolute-last sport Confirmed unlock CAP.
 * Caps only; never mutes to 0. Identity when sport exempt / full pool /
 * already ≤ max / pre-cutover / already 0u.
 */
export function applySportConfirmedUnlockOverlay({
  units,
  sport = null,
  nSportConfirmed = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const sportKey = sport == null ? null : String(sport).toUpperCase();
  const n = Number.isFinite(Number(nSportConfirmed))
    ? Math.max(0, Math.floor(Number(nSportConfirmed)))
    : 0;
  const maxU = sportUnlockMaxUnits(n);

  const base = {
    units: pre,
    action: 'HOLD',
    reason: null,
    unitsPrePolicy: pre,
    nSportConfirmed: n,
    maxUnits: maxU,
    sport: sportKey,
  };

  if (!(pre > 0)) {
    return { ...base, units: 0, action: 'PASS', maxUnits: maxU };
  }
  if (!isSportUnlockGateLive(pickDate)) {
    return { ...base, action: 'EXEMPT', reason: 'pre_cutover', maxUnits: null };
  }
  if (!isSportUnlockGatedSport(sportKey)) {
    return { ...base, action: 'EXEMPT', reason: 'sport_exempt', maxUnits: null };
  }
  if (maxU == null) {
    return { ...base, action: 'HOLD', reason: 'pool_full', maxUnits: null };
  }
  if (pre <= maxU + 1e-9) {
    return { ...base, action: 'HOLD', reason: null, maxUnits: maxU };
  }
  const capped = Math.round(Math.min(pre, maxU) * 100) / 100;
  return {
    ...base,
    units: capped,
    action: 'CAP',
    reason: `sport_unlock_cap_${maxU}u_n${n}`,
    maxUnits: maxU,
  };
}
