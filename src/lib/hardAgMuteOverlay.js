/**
 * HARD+ AG mute overlay — last-step 0u after the HARD FOR exception.
 *
 * If a live ticket has ≥1 HARD wallet on the other side
 * (Source B sport×market n≥4 WR≥62 $ROI≥10), mute it.
 * Get out of the way. Do not fade specialists. Do not rescue T.
 *
 * Does NOT hide wallets from v12. Does NOT resize, repath, or flip.
 * leftover / Policy T / unit-tier / market-skill run unchanged.
 * This overlay only 0u's a ticket that already published size.
 *
 * Fail-open (HOLD at exact units) when we cannot judge:
 *   missing walletProfiles, empty walletDetails, or no sport×byMarket
 *   schema on any ticket wallet. Never wipe the book on a load miss.
 *
 * Going-forward only. Roll-back: HARD_AG_MUTE_FROM = '9999-01-01'.
 */
import {
  attachMarketBooks,
  isHardMarketWallet,
  normalizeMarketType,
} from './marketSkillMuteOverlay.js';

export const HARD_AG_MUTE_FROM = '2026-09-25';
export const HARD_AG_MUTED_BY = 'hard-ag';

export function isHardAgMuteLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= HARD_AG_MUTE_FROM;
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

/**
 * Last-step HARD+ AG mute. Never changes units unless a HARD wallet
 * is on the other side. 4u+ is NOT exempt.
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
  const extra = { marketType: mkt, schemaN: 0, hardAgN: 0 };

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

  const hardAg = wallets.filter((w) => !w.onFor && isHardMarketWallet(w.pos));
  extra.hardAgN = hardAg.length;
  if (hardAg.length < 1) {
    return identity(pre, 'HOLD', null, extra);
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
