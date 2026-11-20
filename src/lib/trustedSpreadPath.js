/**
 * Trusted spread path. From 2026-11-20.
 *
 * The count is the trusted spread wallets on this side minus the trusted
 * spread wallets on the other side, on this morning's list
 * (trustedList.js). It runs last on a spread, after every other rung.
 *
 * Ahead by 3 or more, at a price shorter than +100, on a side the v12
 * score is positive on: the side is at least 2u. A stake of 2u or more
 * that arrived stays.
 *
 * Behind: the side is 0.
 *
 * Even, ahead by 1 or 2, a price of +100 or longer, and a price juicier
 * than −425 stay on the stake that arrived.
 *
 * NBA, NFL, and CFB. On NHL puck lines the count ran backwards on the
 * test, so NHL stays on the stake that arrived. Manual stake, an operator
 * kill, the T-15 freeze, and a graded ticket stay at the caller. A
 * morning with no list changes nothing.
 */

import {
  isTrustedListLive, normTrustedMarket, normTrustedSport, trustedListReady, trustedSideCount,
} from './trustedList.js';

export const TRUSTED_SPREAD_AHEAD = 3;
export const TRUSTED_SPREAD_UNITS = 2;
export const TRUSTED_SPREAD_JUICE = -425;
export const TRUSTED_SPREAD_STAKE_TIER = 'LIST-SPREAD';
export const TRUSTED_SPREAD_RESCUED_BY = 'list-spread';
export const TRUSTED_SPREAD_MUTED_BY = 'list-spread';

const SPORTS = new Set(['NBA', 'NFL', 'CFB']);

export function trustedSpreadSport(sport) {
  return SPORTS.has(normTrustedSport(sport));
}

/** True when a spread on this sport and date reads the list this morning. */
export function trustedSpreadLive(pickDate, sport, list = null) {
  return isTrustedListLive(pickDate) && trustedSpreadSport(sport) && trustedListReady(list);
}

/**
 * Shorter than +100. American odds first. With no American number, a
 * price above 0.5. Null when there is no number at all.
 */
function priceRead(odds, price) {
  const o = Number(odds);
  if (odds != null && odds !== '' && Number.isFinite(o) && o !== 0) {
    return { shorter: o < 100, juiced: o < TRUSTED_SPREAD_JUICE };
  }
  const p = Number(price);
  if (p > 0 && p < 1) {
    return { shorter: p > 0.5, juiced: p > 425 / 525 };
  }
  return null;
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT', reason: string,
 *   units: number, unitsPre: number, margin: number,
 *   wallets: string[], against: string[],
 *   odds: number|null, price: number|null,
 * }}
 */
export function applyTrustedSpreadPath({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  odds = null,
  price = null,
  score = null,
  manual = false,
  killed = false,
  list = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const oddsN = odds != null && odds !== '' && Number.isFinite(Number(odds)) ? Number(odds) : null;
  const priceN = price > 0 && price < 1 ? Number(price) : null;
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    margin: 0,
    wallets: [],
    against: [],
    odds: oddsN,
    price: priceN,
  };
  if (manual === true) return { ...base, action: 'EXEMPT', reason: 'manual' };
  if (killed === true) return { ...base, action: 'EXEMPT', reason: 'killed' };
  if (!isTrustedListLive(pickDate)) return { ...base, action: 'EXEMPT', reason: 'not_live' };
  if (normTrustedMarket(market) !== 'SPREAD') return { ...base, action: 'PASS', reason: 'not_spread' };
  if (!trustedSpreadSport(sport)) return { ...base, action: 'PASS', reason: 'sport' };
  if (!trustedListReady(list)) return { ...base, action: 'PASS', reason: 'no_list' };
  const count = trustedSideCount({ market: 'SPREAD', side, positions, sport, list });
  const read = {
    ...base, margin: count.margin, wallets: count.for, against: count.against,
  };
  if (count.margin < 0) {
    if (pre > 0) return { ...read, fires: true, action: 'MUTE', reason: 'behind', units: 0 };
    return { ...read, action: 'PASS', reason: 'behind_no_stake' };
  }
  if (count.margin < TRUSTED_SPREAD_AHEAD) {
    return { ...read, action: 'PASS', reason: count.for.length || count.against.length ? 'not_ahead_3' : 'no_trusted_wallet' };
  }
  const p = priceRead(odds, price);
  if (!p) return { ...read, action: 'PASS', reason: 'no_price' };
  if (p.juiced) return { ...read, action: 'PASS', reason: 'juice' };
  if (!p.shorter) return { ...read, action: 'PASS', reason: 'plus_price' };
  if (!(Number(score) > 0)) return { ...read, action: 'PASS', reason: 'no_v12_score' };
  if (pre >= TRUSTED_SPREAD_UNITS) return { ...read, action: 'PASS', reason: 'stake_stands' };
  return {
    ...read, fires: true, action: 'STAKE', reason: pre > 0 ? 'ahead_3_floor' : 'ahead_3_rescue',
    units: TRUSTED_SPREAD_UNITS,
  };
}

export const TRUSTED_SPREAD_STAMP_FIELDS = Object.freeze([
  'v8_trustedSpread',
  'v8_trustedSpreadAction',
  'v8_trustedSpreadReason',
  'v8_trustedSpreadUnits',
  'v8_trustedSpreadMargin',
  'v8_trustedSpreadWallets',
  'v8_trustedSpreadAgainst',
  'v8_trustedSpreadOdds',
  'v8_unitsPreTrustedSpread',
]);

/**
 * Every field, on every spread side the path looked at, so a side that
 * stops firing does not keep the last stake's stamp. Empty when the path
 * did not look (another market, an earlier date).
 */
export function trustedSpreadStamp(policy) {
  if (!policy || policy.reason === 'not_live' || policy.reason === 'not_spread') return {};
  return {
    v8_trustedSpread: policy.action === 'STAKE' || policy.action === 'MUTE',
    v8_trustedSpreadAction: policy.action,
    v8_trustedSpreadReason: policy.reason,
    v8_trustedSpreadUnits: policy.units,
    v8_trustedSpreadMargin: policy.margin ?? 0,
    v8_trustedSpreadWallets: Array.isArray(policy.wallets) ? policy.wallets : [],
    v8_trustedSpreadAgainst: Array.isArray(policy.against) ? policy.against : [],
    v8_trustedSpreadOdds: policy.odds ?? null,
    v8_unitsPreTrustedSpread: policy.unitsPre,
  };
}
