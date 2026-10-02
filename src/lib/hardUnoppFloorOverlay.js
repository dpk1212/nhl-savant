/**
 * HARD+ margin size floor — last step after GOLD-stack cap, before odds-cap.
 *
 * Unique HARD+ margin (FOR−AG) ≥ +1 publishes a 2u floor when
 * ≥1 HARD FOR is sized ≥1.0× sport usual. Mute-exception only
 * restores tickets that already had size; this fills MONITORING /
 * never-staked 0u and listed leftover / steam-tail / market-skill /
 * board-share holes so v12 can ship size.
 *
 * 1-0 / 2-0 / 2-1 qualify. 1-1 / 0-1 / 1-2 do not. Does not restore
 * ev-drift, fav-juice, fade, operator, hard-ag, or ev-lt2-no-steam.
 * Board-share (25–45%) punches through when the HARD+ gates hold.
 * Does not resize a live ≥2u ticket. GOLD stays FOR-only (this is 2u, not fat).
 * 2026-10-02: rolled back ≥2 HARD FOR each ≥0.5× (Steelers ML 2026-10-01).
 *
 * Fail-open HOLD (do not invent) when the sport×byMarket schema is
 * missing. Size unknown is not full — do not invent.
 *
 * Going-forward only. Roll-back: HARD_UNOPP_FLOOR_FROM = '9999-01-01'.
 */
import {
  attachMarketBooks,
  getWalletProfile,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';
import { stakeSizeRatio } from './sizeRatioBands.js';

export const HARD_UNOPP_FLOOR_FROM = '2026-09-30';
export const HARD_UNOPP_FLOOR_U = 2;
export const HARD_UNOPP_CAP_U = 4;
export const HARD_UNOPP_MIN_SR = 1.0;
export const HARD_UNOPP_FLOORED_BY = 'hard-unopp-hold';
export const HARD_UNOPP_STAKE_TIER = 'HARD-UNOPP';

/** Mutes this floor may restore. Unstamped 0u (MONITORING) is also allowed. */
export const HARD_UNOPP_RESTORE_MUTES = new Set([
  'steam-tail',
  'believed-cut',
  'fail-open-sub4',
  'st-fat',
  'tape-weak',
  'maxsr-sub4',
  'fools-gold-flat',
  'top-crowded',
  'st-qual-wipe',
  'st-hard-slip',
  'st-hard-for',
  'ml-mkt-skill',
  'no-confirmed',
  'board-share',
]);

export function isHardUnoppFloorLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_UNOPP_FLOOR_FROM;
}

export function isHardUnoppFloorStamp(value) {
  return value === HARD_UNOPP_FLOORED_BY;
}

export function hardUnoppFloorUnits(current, unitsPreMute) {
  const live = Number.isFinite(current) ? Math.max(0, current) : 0;
  const pre = Number.isFinite(unitsPreMute) ? Math.max(0, unitsPreMute) : 0;
  const basis = live > 0 ? live : pre;
  if (basis > 0) return Math.min(HARD_UNOPP_CAP_U, Math.max(HARD_UNOPP_FLOOR_U, basis));
  return HARD_UNOPP_FLOOR_U;
}

function hardForSizedN(hardFor, sport, walletProfiles, minSr) {
  let n = 0;
  for (const w of hardFor || []) {
    const profile = getWalletProfile(walletProfiles, w.short);
    const sr = stakeSizeRatio(w, profile, sport);
    if (Number.isFinite(sr) && sr >= minSr) n += 1;
  }
  return n;
}

function sizeClears({ fullN }) {
  if (fullN >= 1) return { ok: true, via: 'full' };
  return { ok: false, via: null };
}

function pack({
  units,
  action,
  reason = null,
  flooredBy = null,
  unitsPrePolicy,
  marketType = null,
  lastMutedBy = null,
  schemaN = 0,
  hardForN = 0,
  hardAgN = 0,
  fullN = 0,
  leanN = 0,
  margin = 0,
} = {}) {
  return {
    units,
    action,
    reason,
    flooredBy,
    unitsPrePolicy,
    marketType,
    lastMutedBy,
    schemaN,
    hardForN,
    hardAgN,
    fullN,
    leanN,
    margin,
  };
}

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'FLOOR',
 *   reason: string|null,
 *   flooredBy: string|null,
 *   unitsPrePolicy: number,
 *   marketType: string|null,
 *   lastMutedBy: string|null,
 *   schemaN: number,
 *   hardForN: number,
 *   hardAgN: number,
 *   fullN: number,
 *   leanN: number,
 *   margin: number,
 * }}
 */
export function applyHardUnoppFloorOverlay({
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
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const mkt = normalizeMarketType(marketType);
  const extra = {
    marketType: mkt,
    lastMutedBy: mutedBy || null,
    schemaN: 0,
    hardForN: 0,
    hardAgN: 0,
    fullN: 0,
    leanN: 0,
    margin: 0,
  };

  if (!isHardUnoppFloorLive(pickDate)) {
    return pack({ units: pre, action: 'EXEMPT', reason: 'pre_cutover', unitsPrePolicy: pre, ...extra });
  }
  if (mkt !== 'ML' && mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return pack({ units: pre, action: 'EXEMPT', reason: 'market_exempt', unitsPrePolicy: pre, ...extra });
  }
  if (!sport || side == null || side === '' || !walletProfiles) {
    return pack({ units: pre, action: 'HOLD', reason: 'schema_missing', unitsPrePolicy: pre, ...extra });
  }

  const { wallets, schemaN } = attachMarketBooks(
    walletDetails, side, sport, mkt, walletProfiles,
  );
  extra.schemaN = schemaN;
  if (!wallets.length || schemaN === 0) {
    return pack({ units: pre, action: 'HOLD', reason: 'schema_missing', unitsPrePolicy: pre, ...extra });
  }

  const hardFor = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos));
  const hardAg = wallets.filter((w) => !w.onFor && isHardMarketWallet(w.pos));
  extra.hardForN = hardFor.length;
  extra.hardAgN = hardAg.length;
  extra.margin = extra.hardForN - extra.hardAgN;
  extra.fullN = hardForSizedN(hardFor, sport, walletProfiles, HARD_UNOPP_MIN_SR);
  extra.leanN = hardForSizedN(hardFor, sport, walletProfiles, 0.5);
  const sized = sizeClears(extra);

  if (extra.hardForN < 1) {
    return pack({ units: pre, action: 'HOLD', reason: 'no_hard_for', unitsPrePolicy: pre, ...extra });
  }
  if (extra.margin < 1) {
    return pack({ units: pre, action: 'HOLD', reason: 'margin_lt_1', unitsPrePolicy: pre, ...extra });
  }
  if (!sized.ok) {
    return pack({ units: pre, action: 'HOLD', reason: 'no_full_size', unitsPrePolicy: pre, ...extra });
  }
  if (pre >= HARD_UNOPP_FLOOR_U) {
    return pack({ units: pre, action: 'PASS', reason: 'already_ge', unitsPrePolicy: pre, ...extra });
  }

  if (!(pre > 0) && mutedBy && !HARD_UNOPP_RESTORE_MUTES.has(mutedBy)) {
    return pack({ units: pre, action: 'HOLD', reason: 'mute_not_excepted', unitsPrePolicy: pre, ...extra });
  }

  const next = hardUnoppFloorUnits(pre, unitsPreMute);
  return pack({
    units: next,
    action: 'FLOOR',
    reason: 'hard_margin_full',
    flooredBy: HARD_UNOPP_FLOORED_BY,
    unitsPrePolicy: pre,
    ...extra,
  });
}
