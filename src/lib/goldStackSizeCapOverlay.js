/**
 * GOLD-stack size cap — last-step 4u unless inside the stack.
 *
 * After HARD+ AG / S/T HARD+ FOR, before odds-cap / operator kill.
 * EDGE ≥10 + tape BOOST can walk a RANK 4u ticket to the 6u cap
 * (Ball State ML 2026-09-26). Off-stack 4u+ loses. Stack 4u+ pays.
 *
 * Does NOT mute, repath, or flip. Only caps size.
 * Manual stake exempt at the call site.
 *
 * Fail-open (HOLD at exact units) when we cannot judge the stack:
 *   missing walletProfiles, empty walletDetails, or no sport×byMarket
 *   schema. Never shrink a stack ticket on a load miss.
 *
 * Going-forward only. Roll-back: GOLD_STACK_SIZE_CAP_FROM = '9999-01-01'.
 */
import { classifyGoldStack } from './goldStack.js';

export const GOLD_STACK_SIZE_CAP_FROM = '2026-09-26';
export const GOLD_STACK_SIZE_CAP = 4;
export const GOLD_STACK_SIZE_CAPPED_BY = 'gold-stack-cap';

const FAIL_OPEN_REASONS = new Set(['schema_missing', 'market_exempt']);

export function isGoldStackSizeCapLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= GOLD_STACK_SIZE_CAP_FROM;
}

function pack({
  units,
  action,
  reason = null,
  cappedBy = null,
  unitsPrePolicy,
  gold = false,
  hardForN = 0,
  hardAgN = 0,
  provenShare = null,
  stackReason = null,
} = {}) {
  return {
    units,
    action,
    reason,
    cappedBy,
    unitsPrePolicy,
    gold: !!gold,
    hardForN: Number(hardForN) || 0,
    hardAgN: Number(hardAgN) || 0,
    provenShare: Number.isFinite(provenShare) ? provenShare : null,
    stackReason,
  };
}

/**
 * @returns {{
 *   units: number,
 *   action: 'PASS'|'EXEMPT'|'HOLD'|'CAP',
 *   reason: string|null,
 *   cappedBy: string|null,
 *   unitsPrePolicy: number,
 *   gold: boolean,
 *   hardForN: number,
 *   hardAgN: number,
 *   provenShare: number|null,
 *   stackReason: string|null,
 * }}
 */
export function applyGoldStackSizeCapOverlay({
  units,
  marketType = null,
  sport = null,
  side = null,
  walletDetails = null,
  walletProfiles = null,
  pickDate = null,
} = {}) {
  const pre = Number.isFinite(units) ? Math.max(0, units) : 0;
  if (!(pre > 0)) {
    return pack({
      units: 0, action: 'PASS', reason: null, unitsPrePolicy: pre,
    });
  }
  if (!isGoldStackSizeCapLive(pickDate)) {
    return pack({
      units: pre, action: 'EXEMPT', reason: 'pre_cutover', unitsPrePolicy: pre,
    });
  }

  const stack = classifyGoldStack({
    marketType, sport, side, walletDetails, walletProfiles,
  });
  const extra = {
    gold: stack.gold,
    hardForN: stack.hardForN,
    hardAgN: stack.hardAgN,
    provenShare: stack.provenShare,
    stackReason: stack.reason,
  };

  if (FAIL_OPEN_REASONS.has(stack.reason)) {
    return pack({
      units: pre, action: 'HOLD', reason: stack.reason, unitsPrePolicy: pre, ...extra,
    });
  }
  if (stack.gold) {
    return pack({
      units: pre, action: 'HOLD', reason: 'in_stack', unitsPrePolicy: pre, ...extra,
    });
  }
  if (pre <= GOLD_STACK_SIZE_CAP + 1e-9) {
    return pack({
      units: pre, action: 'HOLD', reason: 'already_le4', unitsPrePolicy: pre, ...extra,
    });
  }
  return pack({
    units: GOLD_STACK_SIZE_CAP,
    action: 'CAP',
    reason: stack.reason || 'off_stack',
    cappedBy: GOLD_STACK_SIZE_CAPPED_BY,
    unitsPrePolicy: pre,
    ...extra,
  });
}
