/**
 * Trusted spread path. NBA, NFL, and CFB spreads. It runs last on a
 * spread, after every other rung.
 *
 * From 2026-11-22 it owns the stake. No other rung stakes one of these
 * spreads on its own: what the rungs before it wrote is replaced.
 *
 * Two numbers, both from this morning's list (trustedList.js) and the
 * positions on the game right now:
 *
 *   Count. The trusted spread wallets that are profitable in this sport
 *   on this side, minus the same on the other side.
 *
 *   Records. Every wallet with 10 or more graded spread bets has a
 *   record: its spread results against its own prices. The records on
 *   this side added up, minus the records on the other side added up.
 *
 * The gate is the count ahead by 1 or more and the records ahead by 2 or
 * more. Inside the gate the stake is set by this ladder, whatever arrived:
 *
 *   3u  the count ahead by 2 or more, the records ahead by 4 or more,
 *       and a price shorter than +100
 *   2u  the rest of the gate at a price shorter than +100
 *   1u  a price of +100 or longer
 *
 * Outside the gate the side is 0. The v12 score is not read: a side the
 * score did not pick is staked the same, and the caller locks it so the
 * board shows it.
 *
 * Inside the gate with no price at all, or a price juicier than −425,
 * the stake that arrived stays.
 *
 * From 2026-11-20 through 2026-11-21 the older rule ran: ahead by 3 or
 * more at a price shorter than +100 on a side the v12 score was positive
 * on was at least 2u, behind was 0, and everything else stayed. A pick
 * dated in those two days still reads it.
 *
 * On NHL puck lines the count ran backwards on the test, so NHL stays on
 * the stake that arrived, and so does every other sport. Manual stake, an
 * operator kill, the T-15 freeze, and a graded ticket stay at the caller.
 * A morning with no list, or a list with no records, changes nothing.
 */

import {
  isTrustedListLive, normTrustedMarket, normTrustedSport, trustedListReady, trustedRecordLead,
  trustedRecordsReady, trustedSideCount,
} from './trustedList.js';

/** The older rule, 2026-11-20 through 2026-11-21. */
export const TRUSTED_SPREAD_AHEAD = 3;
export const TRUSTED_SPREAD_UNITS = 2;

/** First pick date the path owns the spread stake. */
export const TRUSTED_SPREAD_OWNS_FROM = '2026-11-22';
export const TRUSTED_SPREAD_GATE_AHEAD = 1;
export const TRUSTED_SPREAD_GATE_RECORDS = 2;
export const TRUSTED_SPREAD_TOP_AHEAD = 2;
export const TRUSTED_SPREAD_TOP_RECORDS = 4;
export const TRUSTED_SPREAD_TOP_UNITS = 3;
export const TRUSTED_SPREAD_GATE_UNITS = 2;
export const TRUSTED_SPREAD_PLUS_UNITS = 1;
export const TRUSTED_SPREAD_JUICE = -425;
export const TRUSTED_SPREAD_STAKE_TIER = 'LIST-SPREAD';
export const TRUSTED_SPREAD_RESCUED_BY = 'list-spread';
export const TRUSTED_SPREAD_MUTED_BY = 'list-spread';

const SPORTS = new Set(['NBA', 'NFL', 'CFB']);

export function trustedSpreadSport(sport) {
  return SPORTS.has(normTrustedSport(sport));
}

/** True from the first pick date the path owns the stake. */
export function trustedSpreadOwns(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUSTED_SPREAD_OWNS_FROM;
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
 *   rule: 'gate'|'ahead_3',
 *   recordFor: number|null, recordAgainst: number|null, recordLead: number|null,
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
    rule: trustedSpreadOwns(pickDate) ? 'gate' : 'ahead_3',
    recordFor: null,
    recordAgainst: null,
    recordLead: null,
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
  if (trustedSpreadOwns(pickDate)) return ownedStake({ read, pre, side, positions, odds, price, list });
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

/**
 * From 2026-11-22. The gate and the ladder. Outside the gate a stake
 * goes to 0 and a side already at 0 is left alone.
 */
function ownedStake({ read, pre, side, positions, odds, price, list }) {
  if (!trustedRecordsReady('SPREAD', list)) return { ...read, action: 'PASS', reason: 'no_records' };
  const rec = trustedRecordLead({ market: 'SPREAD', side, positions, list });
  const out = {
    ...read, recordFor: rec.for, recordAgainst: rec.against, recordLead: rec.lead,
  };
  const ahead = read.margin >= TRUSTED_SPREAD_GATE_AHEAD;
  const records = rec.lead >= TRUSTED_SPREAD_GATE_RECORDS;
  if (!ahead || !records) {
    const reason = read.margin < 0
      ? 'behind'
      : !ahead
        ? (read.wallets.length || read.against.length ? 'not_ahead' : 'no_trusted_wallet')
        : 'records_not_ahead';
    if (pre > 0) return { ...out, fires: true, action: 'MUTE', reason, units: 0 };
    return { ...out, action: 'PASS', reason: `${reason}_no_stake` };
  }
  const p = priceRead(odds, price);
  if (!p) return { ...out, action: 'PASS', reason: 'no_price' };
  if (p.juiced) return { ...out, action: 'PASS', reason: 'juice' };
  const top = read.margin >= TRUSTED_SPREAD_TOP_AHEAD && rec.lead >= TRUSTED_SPREAD_TOP_RECORDS;
  const units = !p.shorter
    ? TRUSTED_SPREAD_PLUS_UNITS
    : top ? TRUSTED_SPREAD_TOP_UNITS : TRUSTED_SPREAD_GATE_UNITS;
  return {
    ...out, fires: true, action: 'STAKE', units,
    reason: !p.shorter ? 'gate_plus_price' : top ? 'gate_top' : 'gate',
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
  'v8_trustedSpreadRule',
  'v8_trustedSpreadRecordFor',
  'v8_trustedSpreadRecordAgainst',
  'v8_trustedSpreadRecordLead',
]);

function round2(v) {
  return typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 100) / 100 : null;
}

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
    v8_trustedSpreadRule: policy.rule ?? null,
    v8_trustedSpreadRecordFor: round2(policy.recordFor),
    v8_trustedSpreadRecordAgainst: round2(policy.recordAgainst),
    v8_trustedSpreadRecordLead: round2(policy.recordLead),
  };
}
