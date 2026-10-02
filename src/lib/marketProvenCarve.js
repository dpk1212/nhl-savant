/**
 * Market-scoped HARD+ feed into v12 presence — not sport CONFIRMED.
 *
 * Door 2 (sport B n≥6 WR≥55 $ROI>3) still owns:
 *   v12 quality · HC · Q1 · UNOPP · unlock · Action · GOLD proven $ · calibration
 *
 * This carve only ORs HARD+ (sport×THIS market n≥4 WR≥62 $ROI≥10) into:
 *   hydrate (scan → live bag)
 *   no-CONFIRMED (FOR hold)
 *   v11 isProvenFn / AGS-U sidecar dCount
 *
 * Fail-closed when marketType is missing — a ML HARD+ book must not
 * count on a SPREAD/TOTAL ticket. Losing sport rollups stay out of
 * v12 quality (agsV12WalletQuality still requires CONFIRMED/FLAT).
 */

import { isConfirmedSportRec, isProvenSportRec } from './whitelistTier.js';
import { walletIsHardMarket } from './marketSpecialistDisplay.js';
import { passesSizeSkillLiveGate } from './sizeSkillRescue.js';

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
