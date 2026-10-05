/**
 * Door 2 sport Proven feed into v12.
 *
 * 2026-10-05 rollback: HARD+ no longer hydrates, holds no-CONFIRMED,
 * enters the v11 Proven bag, or scores v12 quality. HARD+ stays an
 * overlay (floor / mute-exception / AG mute / S/T require / Action Top).
 *
 * Door 2 (sport B n≥6 WR≥55 $ROI>3) owns:
 *   hydrate · no-CONFIRMED · v11 isProvenFn · v12 quality (sport book)
 *   HC · Q1 · UNOPP · unlock · Action · GOLD proven $ · calibration
 *
 * v12 quality always uses the sport Source B book. A HARD+ specialist
 * that is not Door 2 is WR50 / quality 0. Door 2 + HARD+ on this market
 * still uses sport n + ROI, not the market book.
 */

import { isConfirmedSportRec, isProvenSportRec } from './whitelistTier.js';
import { passesSizeSkillLiveGate } from './sizeSkillRescue.js';
import { walletPriorStatsPreferB } from './actionLockPin.js';

function profileFromMap(walletProfiles, walletShort) {
  if (!walletProfiles || !walletShort) return null;
  const key = String(walletShort).toLowerCase();
  if (typeof walletProfiles.get === 'function') {
    return walletProfiles.get(key)
      || walletProfiles.get(key.toUpperCase())
      || walletProfiles.get(walletShort)
      || null;
  }
  return walletProfiles[key] || walletProfiles[key.toUpperCase()] || walletProfiles[walletShort] || null;
}

/** Door 2 sport CONFIRMED. marketType is ignored (kept so call sites stay). */
export function walletHoldsNoConfirmedOnMarket(profile, sport, _marketType) {
  return isConfirmedSportRec(profile?.bySport?.[sport]);
}

/**
 * Cron `isProven(walletShort, sport, walletDetail?)`.
 * Door 2 + size-skill gate. HARD+ is not Proven.
 */
export function buildIsProvenFn(walletProfiles) {
  return (walletShort, sport, w = null) => {
    if (!walletShort || !sport) return false;
    const profile = profileFromMap(walletProfiles, walletShort);
    const bs = profile?.bySport?.[sport];
    if (!isProvenSportRec(bs)) return false;
    const sr = w?.sizeRatio ?? w?.v8_sizeRatio ?? null;
    return passesSizeSkillLiveGate(bs, sr);
  };
}

/** Scan-board hydrate: Door 2 sport Proven. marketType is ignored. */
export function walletHydratesOnScanMarket(profile, sport, _marketType) {
  return isProvenSportRec(profile?.bySport?.[sport]);
}

/**
 * v12 quality priors — sport Source B book only.
 * HARD+ market books are not a prior. CONFIRMED/FLAT stay sport.
 */
export function walletPriorStatsForV12(profile, sport, _marketType) {
  return walletPriorStatsPreferB(profile?.bySport?.[sport]);
}

/**
 * Cron + UI `walletPriorStatsFn(walletShort, sport, walletDetail?)`.
 * Third arg ignored — quality does not switch on ticket market.
 */
export function buildWalletPriorStatsFn(walletProfiles) {
  return (walletShort, sport, w = null) => {
    if (!walletShort || !sport) return null;
    const profile = profileFromMap(walletProfiles, walletShort);
    if (!profile) return null;
    return walletPriorStatsForV12(profile, sport, w?.marketType || w?.market || null);
  };
}
