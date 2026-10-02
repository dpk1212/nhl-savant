/**
 * Market-scoped HARD+ feed into v12 — not sport CONFIRMED.
 *
 * Door 2 (sport B n≥6 WR≥55 $ROI>3) still owns:
 *   HC · Q1 · UNOPP · unlock · Action · GOLD proven $ · calibration isProven
 *
 * This carve ORs HARD+ (sport×THIS market n≥4 WR≥62 $ROI≥10) into:
 *   hydrate (scan → live bag)
 *   no-CONFIRMED (FOR hold)
 *   v11 isProvenFn / AGS-U sidecar dCount
 *   v12 quality (agsV12WalletQuality) from THIS market book only
 *
 * Fail-closed when marketType is missing — a ML HARD+ book must not
 * count on a SPREAD/TOTAL ticket. Losing sport rollups stay out of
 * quality; overlays still size / mute after the score.
 */

import { isConfirmedSportRec, isProvenSportRec } from './whitelistTier.js';
import { walletIsHardMarket } from './marketSpecialistDisplay.js';
import { marketPositions } from './marketSkillMuteOverlay.js';
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

function ticketMarket(w) {
  return w?.marketType || w?.market || null;
}

/** Door 2 sport CONFIRMED, or HARD+ on this market. No size-skill. */
export function walletHoldsNoConfirmedOnMarket(profile, sport, marketType) {
  if (isConfirmedSportRec(profile?.bySport?.[sport])) return true;
  return walletIsHardMarket(profile, sport, marketType);
}

/**
 * Cron `isProven(walletShort, sport, walletDetail?)`.
 * Door 2 + size-skill gate, else HARD+ on walletDetail.marketType.
 */
export function buildIsProvenFn(walletProfiles) {
  return (walletShort, sport, w = null) => {
    if (!walletShort || !sport) return false;
    const profile = profileFromMap(walletProfiles, walletShort);
    const bs = profile?.bySport?.[sport];
    if (isProvenSportRec(bs)) {
      const sr = w?.sizeRatio ?? w?.v8_sizeRatio ?? null;
      return passesSizeSkillLiveGate(bs, sr);
    }
    return walletIsHardMarket(profile, sport, ticketMarket(w));
  };
}

/** Scan-board hydrate: Door 2 sport, or HARD+ on this file's market. */
export function walletHydratesOnScanMarket(profile, sport, marketType) {
  if (isProvenSportRec(profile?.bySport?.[sport])) return true;
  return walletIsHardMarket(profile, sport, marketType);
}

/**
 * v12 quality priors. Door 2 / FLAT keep the sport Source B book.
 * HARD+ on THIS market (and not sport CONFIRMED) uses the market book
 * n + ROI — never the losing sport rollup. Fail-closed without marketType.
 */
export function walletPriorStatsForV12(profile, sport, marketType) {
  const sportRec = profile?.bySport?.[sport];
  const sportStats = walletPriorStatsPreferB(sportRec);
  if (sportStats && (sportStats.tier === 'CONFIRMED' || sportStats.tier === 'FLAT')) {
    return sportStats;
  }
  if (walletIsHardMarket(profile, sport, marketType)) {
    const mBook = marketPositions(profile, sport, marketType);
    const fromMkt = walletPriorStatsPreferB({
      whitelistTier: 'HARD+',
      positions: mBook.pos,
    });
    if (fromMkt) return { ...fromMkt, priorSource: 'B-market' };
  }
  return sportStats;
}

/**
 * Cron + UI `walletPriorStatsFn(walletShort, sport, walletDetail?)`.
 * Third arg carries ticket marketType for the HARD+ quality carve.
 */
export function buildWalletPriorStatsFn(walletProfiles) {
  return (walletShort, sport, w = null) => {
    if (!walletShort || !sport) return null;
    const profile = profileFromMap(walletProfiles, walletShort);
    if (!profile) return null;
    return walletPriorStatsForV12(profile, sport, ticketMarket(w));
  };
}
