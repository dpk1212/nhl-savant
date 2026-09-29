/**
 * HARD+ AG mute overlay — 0u after the HARD FOR exception, before
 * the S/T HARD+ FOR require.
 *
 * Unique HARD wallets (Source B sport×market n≥4 WR≥62 $ROI≥10).
 *
 * 2026-09-25 … 2026-09-28: ≥1 HARD AG → 0u (binary).
 * 2026-09-29+: mute only when HARD AG ≥ 1 AND margin (FOR−AG) ≤ 0.
 *   2-1 / 3-2 HOLD. 1-1 / 0-1 / 1-2 MUTE. Do not fade a +1 fight.
 * GOLD stays FOR-only (hardAgN === 0) — this overlay does not 6u a 2-1.
 *
 * Does NOT hide wallets from v12. Does NOT resize, repath, or flip.
 * leftover / Policy T / unit-tier / market-skill run unchanged.
 * This overlay only 0u's a ticket that already published size.
 *
 * Fail-open (HOLD at exact units) when we cannot judge:
 *   missing walletProfiles, empty walletDetails, or no sport×byMarket
 *   schema on any ticket wallet. Never wipe the book on a load miss.
 *
 * Going-forward only. Roll-back:
 *   HARD_AG_MUTE_FROM = '9999-01-01'     (off)
 *   HARD_AG_MARGIN_FROM = '9999-01-01'   (binary any-AG)
 */
import {
  attachMarketBooks,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';

export const HARD_AG_MUTE_FROM = '2026-09-25';
export const HARD_AG_MARGIN_FROM = '2026-09-29';
export const HARD_AG_MUTED_BY = 'hard-ag';

export function isHardAgMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_AG_MUTE_FROM;
}

export function isHardAgMarginLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_AG_MARGIN_FROM;
}

function identity(units, action, reason, extra = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  return {
    units: pre,
    action,
    reason,
    mutedBy: null,
    unitsPrePolicy: pre,
    ...extra,
  };
}

function emptyExtra(mkt) {
  return { marketType: mkt, schemaN: 0, hardForN: 0, hardAgN: 0, margin: 0 };
}

/**
 * Last-step HARD+ AG mute. Never changes units unless HARD AG is ahead
 * or tied (margin era) or present at all (binary era). 4u+ is NOT exempt.
 */
export function applyHardAgMuteOverlay({
  units,
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  const mkt = normalizeMarketType(marketType);
  const extra = emptyExtra(mkt);

  if (!(pre > 0)) {
    return {
      units: 0, action: 'PASS', reason: null, mutedBy: null, unitsPrePolicy: pre, ...extra,
    };
  }
  if (!isHardAgMuteLive(pickDate)) {
    return identity(pre, 'EXEMPT', 'pre_cutover', extra);
  }
  if (mkt !== 'ML' && mkt !== 'SPREAD' && mkt !== 'TOTAL') {
    return identity(pre, 'EXEMPT', 'market_exempt', extra);
  }
  if (!sport || side == null || side === '') {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }
  if (!walletProfiles) {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }

  const { wallets, schemaN } = attachMarketBooks(
    walletDetails, side, sport, mkt, walletProfiles,
  );
  extra.schemaN = schemaN;
  if (!wallets.length || schemaN === 0) {
    return identity(pre, 'HOLD', 'schema_missing', extra);
  }

  const hardFor = wallets.filter((w) => w.onFor && isHardMarketWallet(w.pos));
  const hardAg = wallets.filter((w) => !w.onFor && isHardMarketWallet(w.pos));
  extra.hardForN = hardFor.length;
  extra.hardAgN = hardAg.length;
  extra.margin = extra.hardForN - extra.hardAgN;

  if (hardAg.length < 1) {
    return identity(pre, 'HOLD', null, extra);
  }
  if (isHardAgMarginLive(pickDate) && extra.margin >= 1) {
    return identity(pre, 'HOLD', 'hard_margin_plus', extra);
  }
  return {
    units: 0,
    action: 'MUTE',
    reason: 'hard_ag_against',
    mutedBy: HARD_AG_MUTED_BY,
    unitsPrePolicy: pre,
    ...extra,
  };
}
