/**
 * Trusted spread path. It runs last on a spread, after every other rung.
 *
 * From 2026-11-22 it owns the stake on NBA, NFL, and CFB spreads. From
 * 2026-11-23 it owns the stake on every sport's spread. No other rung
 * stakes a spread on its own: what the rungs before it wrote is replaced.
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
 * more. Outside the gate the side is 0. The v12 score is not read: a
 * side the score did not pick is staked the same, and the caller locks
 * it so the board shows it.
 *
 * The ladder, from 2026-11-23, inside the gate, whatever arrived:
 *
 *   3u  a price shorter than +100 and the records ahead by 4 or more
 *   1u  a price shorter than +100 and the records ahead by 2 up to 4
 *   1u  a price of +100 or longer on a line of 7 points or under
 *   0   a price of +100 or longer on a line over 7 points, or no line
 *   0   no price at all, or a price juicier than −425
 *
 * From that date a morning with no list, or a list with no records, is
 * 0 on every spread: the older rungs do not stake in its place.
 *
 * The moneyline bump, from 2026-11-24. A side the ladder stakes takes 1u
 * more when the trusted moneyline wallets are ahead on the same team:
 * 3u is 4u and 1u is 2u. The moneyline count is the one the moneyline
 * ladder's gate reads, the wide count: trusted moneyline wallets with 10
 * or more graded moneyline bets in the sport, up or down, this team
 * minus the other team, ahead by 1 or more, from the moneyline positions
 * on the same game. A count that is level or behind leaves the stake as
 * the ladder set it. The gate does not read the moneyline: a side the
 * ladder leaves at 0 stays 0.
 *
 * On 2026-11-22 the first ladder ran, NBA, NFL, and CFB only: 3u with
 * the count ahead by 2 or more, the records ahead by 4 or more, and a
 * price shorter than +100; 2u for the rest of the gate at a price
 * shorter than +100; 1u at +100 or longer. No price, a price juicier
 * than −425, a morning with no list, and every other sport stayed on the
 * stake that arrived. A pick dated that day still reads it.
 *
 * From 2026-11-20 through 2026-11-21 the older rule ran: ahead by 3 or
 * more at a price shorter than +100 on a side the v12 score was positive
 * on was at least 2u, behind was 0, and everything else stayed. A pick
 * dated in those two days still reads it.
 *
 * Manual stake, an operator kill, the T-15 freeze, and a graded ticket
 * stay at the caller.
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

/** First pick date of the ladder on every sport's spread. */
export const TRUSTED_SPREAD_LADDER_FROM = '2026-11-23';
export const TRUSTED_SPREAD_LADDER_TOP_RECORDS = 4;
export const TRUSTED_SPREAD_LADDER_TOP_UNITS = 3;
export const TRUSTED_SPREAD_LADDER_BASE_UNITS = 1;
export const TRUSTED_SPREAD_LADDER_MAX_LINE = 7;
/** The moneyline bump on a ladder stake. */
export const TRUSTED_SPREAD_ML_BUMP_FROM = '2026-11-24';
export const TRUSTED_SPREAD_ML_BUMP_AHEAD = 1;
export const TRUSTED_SPREAD_ML_BUMP_UNITS = 1;
export const TRUSTED_SPREAD_STAKE_TIER = 'LIST-SPREAD';
export const TRUSTED_SPREAD_RESCUED_BY = 'list-spread';
export const TRUSTED_SPREAD_MUTED_BY = 'list-spread';

const SPORTS = new Set(['NBA', 'NFL', 'CFB']);

/** True from the first pick date of the ladder on every sport. */
export function trustedSpreadLadderLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUSTED_SPREAD_LADDER_FROM;
}

/** True from the first pick date of the moneyline bump. */
export function trustedSpreadMlBumpLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUSTED_SPREAD_ML_BUMP_FROM;
}

/** NBA, NFL, and CFB before the ladder date. Every sport from it. */
export function trustedSpreadSport(sport, pickDate = null) {
  if (trustedSpreadLadderLive(pickDate)) return true;
  return SPORTS.has(normTrustedSport(sport));
}

/** True from the first pick date the path owns the stake. */
export function trustedSpreadOwns(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUSTED_SPREAD_OWNS_FROM;
}

/** True when a spread on this sport and date reads the list this morning. */
export function trustedSpreadLive(pickDate, sport, list = null) {
  return isTrustedListLive(pickDate) && trustedSpreadSport(sport, pickDate) && trustedListReady(list);
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
 *   rule: 'ladder'|'gate'|'ahead_3', line: number|null,
 *   recordFor: number|null, recordAgainst: number|null, recordLead: number|null,
 *   mlMargin: number|null, mlWallets: string[], bump: number,
 * }}
 */
export function applyTrustedSpreadPath({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  mlPositions = null,
  odds = null,
  price = null,
  line = null,
  score = null,
  manual = false,
  killed = false,
  list = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const oddsN = odds != null && odds !== '' && Number.isFinite(Number(odds)) ? Number(odds) : null;
  const priceN = price > 0 && price < 1 ? Number(price) : null;
  const lineN = line != null && line !== '' && Number.isFinite(Number(line)) ? Number(line) : null;
  const ladder = trustedSpreadLadderLive(pickDate);
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    margin: 0,
    wallets: [],
    against: [],
    odds: oddsN,
    price: priceN,
    line: lineN,
    rule: ladder ? 'ladder' : trustedSpreadOwns(pickDate) ? 'gate' : 'ahead_3',
    recordFor: null,
    recordAgainst: null,
    recordLead: null,
    mlMargin: null,
    mlWallets: [],
    bump: 0,
  };
  if (manual === true) return { ...base, action: 'EXEMPT', reason: 'manual' };
  if (killed === true) return { ...base, action: 'EXEMPT', reason: 'killed' };
  if (!isTrustedListLive(pickDate)) return { ...base, action: 'EXEMPT', reason: 'not_live' };
  if (normTrustedMarket(market) !== 'SPREAD') return { ...base, action: 'PASS', reason: 'not_spread' };
  if (!trustedSpreadSport(sport, pickDate)) return { ...base, action: 'PASS', reason: 'sport' };
  if (!trustedListReady(list)) {
    return ladder ? zero(base, pre, 'no_list') : { ...base, action: 'PASS', reason: 'no_list' };
  }
  const count = trustedSideCount({ market: 'SPREAD', side, positions, sport, list });
  const read = {
    ...base, margin: count.margin, wallets: count.for, against: count.against,
  };
  if (trustedSpreadOwns(pickDate)) {
    const staked = ownedStake({ read, pre, side, positions, odds, price, list, ladder });
    return ladder && trustedSpreadMlBumpLive(pickDate)
      ? mlBump(staked, { side, sport, mlPositions, list })
      : staked;
  }
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

/** A side the path leaves at 0: a mute when a stake arrived. */
function zero(out, pre, reason) {
  if (pre > 0) return { ...out, fires: true, action: 'MUTE', reason, units: 0 };
  return { ...out, action: 'PASS', reason: `${reason}_no_stake` };
}

/**
 * From 2026-11-22. The gate, then the ladder of the pick's date. Outside
 * the gate a stake goes to 0 and a side already at 0 is left alone.
 */
function ownedStake({ read, pre, side, positions, odds, price, list, ladder }) {
  if (!trustedRecordsReady('SPREAD', list)) {
    return ladder ? zero(read, pre, 'no_records') : { ...read, action: 'PASS', reason: 'no_records' };
  }
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
    return zero(out, pre, reason);
  }
  const p = priceRead(odds, price);
  if (ladder) return ladderStake({ out, pre, p, lead: rec.lead });
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

/** From 2026-11-23, inside the gate. Every side is set here, to a size or to 0. */
function ladderStake({ out, pre, p, lead }) {
  if (!p) return zero(out, pre, 'no_price');
  if (p.juiced) return zero(out, pre, 'juice');
  if (p.shorter) {
    const top = lead >= TRUSTED_SPREAD_LADDER_TOP_RECORDS;
    return {
      ...out, fires: true, action: 'STAKE',
      units: top ? TRUSTED_SPREAD_LADDER_TOP_UNITS : TRUSTED_SPREAD_LADDER_BASE_UNITS,
      reason: top ? 'records_4' : 'records_2',
    };
  }
  if (out.line == null) return zero(out, pre, 'plus_no_line');
  if (Math.abs(out.line) > TRUSTED_SPREAD_LADDER_MAX_LINE) return zero(out, pre, 'plus_long_line');
  return {
    ...out, fires: true, action: 'STAKE', units: TRUSTED_SPREAD_LADDER_BASE_UNITS,
    reason: 'plus_short_line',
  };
}

/**
 * From 2026-11-24, on a side the ladder staked. The trusted moneyline
 * wallets ahead on the same team is 1u more. Anything else is unchanged.
 */
function mlBump(out, { side, sport, mlPositions, list }) {
  if (out.action !== 'STAKE' || !(out.units > 0)) return out;
  const ml = trustedSideCount({
    market: 'ML', side, positions: mlPositions, sport, list, wide: true,
  });
  const read = { ...out, mlMargin: ml.margin, mlWallets: ml.for };
  if (ml.margin < TRUSTED_SPREAD_ML_BUMP_AHEAD) return read;
  return { ...read, units: out.units + TRUSTED_SPREAD_ML_BUMP_UNITS, bump: TRUSTED_SPREAD_ML_BUMP_UNITS };
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
  'v8_trustedSpreadLine',
  'v8_trustedSpreadMlMargin',
  'v8_trustedSpreadMlWallets',
  'v8_trustedSpreadBump',
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
    v8_trustedSpreadLine: policy.line ?? null,
    v8_trustedSpreadMlMargin: policy.mlMargin ?? null,
    v8_trustedSpreadMlWallets: Array.isArray(policy.mlWallets) ? policy.mlWallets : [],
    v8_trustedSpreadBump: Number(policy.bump) > 0 ? Number(policy.bump) : 0,
  };
}
