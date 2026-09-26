/**
 * GOLD hero-card tag = inside the steam-era stack.
 *
 * Display-only. Does not size, mute, repath, or flip.
 *
 * Stack:
 *   HARD+ FOR only — ≥1 Source B sport×market HARD on our side
 *                    (n≥4 WR≥62 $ROI≥10) and 0 HARD on the other side
 *   AND proven $ ≥ 75% — Door 2 CONFIRMED $ FOR / (FOR + AG)
 */
import {
  attachMarketBooks,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';
import { sportRecFromProfiles } from './steamTailPolicy.js';
import { isProvenSportRec } from './whitelistTier.js';
import { shortWalletId } from './walletClvSkill.js';

export const GOLD_STACK_PROVEN_MIN = 0.75;

function walletList(walletDetails) {
  if (Array.isArray(walletDetails)) return walletDetails;
  if (walletDetails && typeof walletDetails === 'object') return Object.values(walletDetails);
  return [];
}

/**
 * Point-in-time both-side wallet rows for the GOLD check.
 * Prefer the unfiltered board / v8 snapshot over play-side receipts.
 */
export function walletDetailsForGoldStack(pick, fallback = []) {
  if (!pick || typeof pick !== 'object') {
    return Array.isArray(fallback) ? fallback : [];
  }
  if (Array.isArray(pick.boardWallets) && pick.boardWallets.length) return pick.boardWallets;
  if (Array.isArray(pick.walletDetails) && pick.walletDetails.length) return pick.walletDetails;
  const v8 = pick.v8Scoring?.walletDetails
    || pick.peak?.v8Scoring?.walletDetails
    || pick.lock?.v8Scoring?.walletDetails;
  if (Array.isArray(v8) && v8.length) return v8;
  return Array.isArray(fallback) ? fallback : [];
}

/**
 * Door 2 proven $ FOR / (FOR + AG). Live positions book wins over a
 * stale whitelist stamp (same as isProvenSportRec).
 */
export function goldStackProvenShare(walletDetails, side, sport, walletProfiles) {
  const empty = {
    shareP: null,
    forProvenUsd: 0,
    agProvenUsd: 0,
    nProven: 0,
  };
  const list = walletList(walletDetails);
  if (!list.length || side == null || side === '' || !sport) return empty;

  let forProvenUsd = 0;
  let agProvenUsd = 0;
  let nProven = 0;
  const seen = new Set();
  for (const w of list) {
    if (!w) continue;
    const short = shortWalletId(w.walletShort || w.wallet || w.short);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const inv = Number(w.invested) || 0;
    if (!(inv > 0)) continue;
    const proven = isProvenSportRec(sportRecFromProfiles(walletProfiles, short, sport));
    if (!proven) continue;
    nProven += 1;
    if (String(w.side) === String(side)) forProvenUsd += inv;
    else agProvenUsd += inv;
  }
  const totP = forProvenUsd + agProvenUsd;
  return {
    shareP: totP > 0 ? forProvenUsd / totP : null,
    forProvenUsd,
    agProvenUsd,
    nProven,
  };
}

function pack({
  gold = false,
  hardForN = 0,
  hardAgN = 0,
  hardForOnly = false,
  provenShare = null,
  schemaN = 0,
  reason = 'schema_missing',
} = {}) {
  return {
    gold: !!gold,
    hardForN: Number(hardForN) || 0,
    hardAgN: Number(hardAgN) || 0,
    hardForOnly: !!hardForOnly,
    provenShare: Number.isFinite(provenShare) ? provenShare : null,
    schemaN: Number(schemaN) || 0,
    reason,
  };
}

/**
 * @returns {{
 *   gold: boolean,
 *   hardForN: number,
 *   hardAgN: number,
 *   hardForOnly: boolean,
 *   provenShare: number|null,
 *   schemaN: number,
 *   reason: string,
 * }}
 */
export function classifyGoldStack({
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
} = {}) {
  const mkt = normalizeMarketType(marketType);
  if (mkt !== 'ML' && mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return pack({ reason: 'market_exempt' });
  }
  if (!sport || side == null || side === '') {
    return pack({ reason: 'schema_missing' });
  }
  if (!walletProfiles) {
    return pack({ reason: 'schema_missing' });
  }

  const { wallets, schemaN } = attachMarketBooks(
    walletDetails, side, sport, mkt, walletProfiles,
  );
  if (!wallets.length || schemaN === 0) {
    return pack({ schemaN, reason: 'schema_missing' });
  }

  const hardForN = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos)).length;
  const hardAgN = wallets.filter((w) => !w.onFor && isHardMarketWallet(w.pos)).length;
  const hardForOnly = hardForN >= 1 && hardAgN === 0;
  const proven = goldStackProvenShare(walletDetails, side, sport, walletProfiles);
  const provenShare = proven.shareP;
  const provenOk = provenShare != null && provenShare >= GOLD_STACK_PROVEN_MIN;

  if (!hardForOnly) {
    return pack({
      hardForN,
      hardAgN,
      hardForOnly,
      provenShare,
      schemaN,
      reason: hardAgN >= 1 ? 'hard_ag' : 'no_hard_for',
    });
  }
  if (!provenOk) {
    return pack({
      hardForN,
      hardAgN,
      hardForOnly,
      provenShare,
      schemaN,
      reason: provenShare == null ? 'proven_missing' : 'proven_lt75',
    });
  }
  return pack({
    gold: true,
    hardForN,
    hardAgN,
    hardForOnly,
    provenShare,
    schemaN,
    reason: 'in_stack',
  });
}

export function goldStackTip(info) {
  if (!info?.gold) return null;
  const pct = Number.isFinite(info.provenShare)
    ? `${Math.round(info.provenShare * 100)}%`
    : '≥75%';
  return `Inside stack — HARD+ FOR only · proven ${pct}`;
}
