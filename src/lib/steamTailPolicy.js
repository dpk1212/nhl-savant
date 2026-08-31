/**
 * Steam-tail size policy (recipe T) — 2026-08-31+.
 *
 * Same sizer. Steam only confirms/kills the tails. No daily cap.
 *
 *   ≤1u junk            → 0u
 *   ≤1u A/B arriving    → floor 2u
 *   2–3u                → as-sized
 *   4u                  → keep iff Source A/B CONFIRMED on our side AND steam on at lock
 *   5u                  → always
 *   5.4u+               → keep iff A/B steam on at lock
 *
 * Steam rules fail-open when we cannot observe steam (no tape log AND no
 * Pinnacle game this cycle). 1u cut does not need steam. Live Ev-drift mute
 * stays upstream. Manual stake exempt at the call site.
 */

import { analyzeTicketTapeLog } from './ticketTapeCapture.js';

export const STEAM_TAIL_POLICY_FROM = '2026-08-31';
export const STEAM_TAIL_MUTED_BY = 'steam-tail';
export const STEAM_TAIL_ARRIVING_FLOOR = 2;

/** Match analyzeGoldSteamAb.mjs unitBand. */
export function steamTailBand(u) {
  const x = Number(u) || 0;
  if (x < 1.25) return 'lean';
  if (x < 3.5) return 'mid';
  if (x < 4.75) return 'u4';
  if (x < 5.35) return 'u5';
  return 'fat';
}

export function isSteamTailPolicyLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= STEAM_TAIL_POLICY_FROM;
}

/** Source A/B CONFIRMED — same flags as the August steam analysis. */
export function sourceFlagsFromSportRec(rec) {
  if (!rec) return { a: false, b: false, confirmed: false, flat: false, source: null };
  const tier = String(rec.whitelistTier || '').toUpperCase();
  const src = String(rec.whitelistSource || '').toUpperCase();
  const picksN = Number(rec.picks?.n) || 0;
  const posN = Number(rec.positions?.n) || 0;
  const a = src.includes('A') || (picksN >= 2 && src === '' && tier === 'CONFIRMED');
  const b = src.includes('B') || (posN >= 4 && src === '' && tier === 'CONFIRMED');
  return {
    a: tier === 'CONFIRMED' && a,
    b: tier === 'CONFIRMED' && b,
    confirmed: tier === 'CONFIRMED',
    flat: tier === 'FLAT',
    source: rec.whitelistSource || null,
  };
}

function profileOf(walletProfiles, short) {
  const key = String(short || '').toLowerCase();
  if (!key || !walletProfiles) return null;
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(key)
      || walletProfiles.get(String(short || '').slice(-6).toLowerCase())
      || null;
  }
  return walletProfiles[key]
    || walletProfiles.profiles?.[key]
    || null;
}

export function sportRecFromProfiles(walletProfiles, short, sport) {
  const p = profileOf(walletProfiles, short);
  if (!p) return null;
  const by = p.bySport || {};
  return by[sport] || by[String(sport || '').toUpperCase()] || by[String(sport || '').toLowerCase()] || null;
}

export function countSourceAbOnSide(walletDetails, side, sport, walletProfiles) {
  let forA = 0;
  let forB = 0;
  if (!side || !Array.isArray(walletDetails)) {
    return { forA: 0, forB: 0, sharpAB: false };
  }
  const seen = new Set();
  for (const w of walletDetails) {
    if (!w || String(w.side) !== String(side)) continue;
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const flags = sourceFlagsFromSportRec(sportRecFromProfiles(walletProfiles, short, sport));
    if (flags.a) forA++;
    if (flags.b) forB++;
  }
  return { forA, forB, sharpAB: forA + forB > 0 };
}

/**
 * First vs current steam. Live snap can turn steam ON this cycle.
 * Empty log + live ON is already-on (not arriving) — first sample = lock.
 */
export function resolveSteamLifecycle(existingLog, liveSnap = null) {
  const rows = Array.isArray(existingLog) ? existingLog : [];
  const tape = analyzeTicketTapeLog(rows);
  const liveTier = liveSnap?.steam?.tier ?? null;
  const liveOn = liveTier === 'steam' || liveTier === 'gold';
  const steamOnLock = !!(tape.steamOnLock || liveOn);
  const steamOnFirst = tape.n > 0 ? !!tape.steamOnFirst : liveOn;
  return {
    n: tape.n,
    steamOnFirst,
    steamOnLock,
    steamArriving: !steamOnFirst && steamOnLock,
  };
}

function pack({
  units,
  action,
  reason = null,
  mutedBy = null,
  unitsPrePolicy,
  steamOnLock = false,
  steamArriving = false,
  sharpAB = false,
  band = null,
}) {
  return {
    units,
    action,
    reason,
    mutedBy,
    unitsPrePolicy,
    steamOnLock: !!steamOnLock,
    steamArriving: !!steamArriving,
    sharpAB: !!sharpAB,
    band,
  };
}

/**
 * @param {object} args
 * @param {number} args.units current (post-climate) units
 * @param {number} [args.bandUnits] pre-shrink units for 4u/fat mute (climate/unlock)
 * @param {boolean} args.steamObservable tape log exists OR Pinnacle game this cycle
 */
export function applySteamTailPolicy({
  units,
  pickDate = null,
  steamObservable = false,
  steamOnLock = false,
  steamArriving = false,
  sharpAB = false,
  bandUnits = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const hold = (action, reason = null) => pack({
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    steamOnLock,
    steamArriving,
    sharpAB,
    band: steamTailBand(pre),
  });

  if (!(pre > 0)) {
    return pack({
      units: 0, action: 'PASS', reason: null, mutedBy: null, unitsPrePolicy: pre,
      steamOnLock, steamArriving, sharpAB, band: steamTailBand(pre),
    });
  }
  if (!isSteamTailPolicyLive(pickDate)) return hold('EXEMPT', 'pre_cutover');

  const abSteam = !!(sharpAB && steamOnLock);
  const abArriving = !!(sharpAB && steamArriving);
  const band = steamTailBand(pre);
  const muteSrc = Number.isFinite(bandUnits) && bandUnits > pre ? bandUnits : pre;
  const muteBand = steamTailBand(muteSrc);

  if (band === 'lean') {
    if (abArriving) {
      return pack({
        units: STEAM_TAIL_ARRIVING_FLOOR,
        action: 'FLOOR',
        reason: 'arriving_floor',
        mutedBy: null,
        unitsPrePolicy: pre,
        steamOnLock,
        steamArriving,
        sharpAB,
        band,
      });
    }
    return pack({
      units: 0,
      action: 'MUTE',
      reason: 'lean_no_arriving',
      mutedBy: STEAM_TAIL_MUTED_BY,
      unitsPrePolicy: pre,
      steamOnLock,
      steamArriving,
      sharpAB,
      band,
    });
  }

  // Unconfirmed 4u / 5.4u+ — including climate-halved fat that now looks mid.
  if (muteBand === 'u4' || muteBand === 'fat') {
    if (!steamObservable) return hold('FAIL_OPEN', 'steam_unobserved');
    if (abSteam) return hold('HOLD', 'steam_confirmed');
    return pack({
      units: 0,
      action: 'MUTE',
      reason: muteBand === 'u4' ? 'unconfirmed_4u' : 'unconfirmed_fat',
      mutedBy: STEAM_TAIL_MUTED_BY,
      unitsPrePolicy: pre,
      steamOnLock,
      steamArriving,
      sharpAB,
      band: muteBand,
    });
  }

  // 2–3u and 5u: leave alone.
  return hold('HOLD', null);
}

export function applySteamTailPolicyFromTicket({
  units,
  pickDate = null,
  walletDetails = [],
  side = null,
  sport = null,
  walletProfiles = null,
  existingLog = null,
  liveSnap = null,
  hasPinnGame = false,
  unitsPreClimate = null,
  unitsPreSportUnlock = null,
} = {}) {
  const ab = countSourceAbOnSide(walletDetails, side, sport, walletProfiles);
  const life = resolveSteamLifecycle(existingLog, liveSnap);
  const pre = Number.isFinite(units) ? units : 0;
  const bandUnits = Math.max(
    pre,
    Number.isFinite(Number(unitsPreClimate)) ? Number(unitsPreClimate) : 0,
    Number.isFinite(Number(unitsPreSportUnlock)) ? Number(unitsPreSportUnlock) : 0,
  );
  const logN = Array.isArray(existingLog) ? existingLog.length : 0;
  return applySteamTailPolicy({
    units: pre,
    pickDate,
    steamObservable: logN > 0 || !!hasPinnGame,
    steamOnLock: life.steamOnLock,
    steamArriving: life.steamArriving,
    sharpAB: ab.sharpAB,
    bandUnits,
  });
}
