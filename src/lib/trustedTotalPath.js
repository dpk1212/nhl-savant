/**
 * Trusted total path. It runs last on a total, after every other rung.
 *
 * From 2026-11-23 it owns the stake on every sport's total. No other rung
 * stakes a total on its own: what the rungs before it wrote is replaced.
 *
 * Four reads, from this morning's list (trustedList.js) and the positions
 * on the game right now. A wallet on both sides counts on its larger
 * ticket.
 *
 *   Count. A list wallet has 10 or more graded totals bets in this sport
 *   before the morning and is up in units on them. The list wallets on
 *   this side, minus the list wallets on the other side.
 *
 *   Records. Every wallet with 10 or more graded totals bets in this
 *   sport has a sport record: its results there against its own prices.
 *   The records on this side added up, minus the records on the other
 *   side added up.
 *
 *   Steam. How far the price had shortened since the open when each
 *   wallet on this side was first seen, in percent: the `first` row of
 *   its ticket tape. The middle wallet's number, the lower one of two.
 *   A wallet first seen after the start has no read.
 *
 *   Against. Every tracked wallet on the other side, on the list or not.
 *
 * The gate is the count ahead by 1 or more and steam of 1% or more.
 * Outside the gate the side is 0. The v12 score is not read: a side the
 * score did not pick is staked the same, and the caller opens and locks
 * it so the board shows it.
 *
 * The ladder, inside the gate:
 *
 *   3u  steam 1% up to 8%, and no tracked wallet on the other side
 *   2u  steam 1% up to 8%, wallets on the other side, records ahead by 1
 *       or more
 *   0   steam 1% up to 8%, wallets on the other side, records ahead by
 *       under 1
 *   1u  steam 8% or more, and no list wallet on the other side. This
 *       rung is stamped and not staked: the side is 0 until
 *       TRUSTED_TOTAL_HEAVY_STAKES is true.
 *   0   steam 8% or more with a list wallet on the other side
 *   0   no price at all, or a price juicier than −425
 *   0   a manual stake on the other side of the game
 *
 * A morning with no list, or a list with no totals sport records, is 0 on
 * every total: the older rungs do not stake in its place.
 *
 * The read is live until the T-15 freeze: a wallet that arrives on the
 * other side takes a 3u side to 2u or 0, and a side the path staked on
 * an earlier scan and no longer stakes is muted (`staked`), so the lock
 * and the card follow the bet down.
 *
 * Manual stake, an operator kill, the T-15 freeze, and a graded ticket
 * stay at the caller.
 */

import {
  normTrustedMarket, normTrustedSport, trustedListReady, trustedSportRecord,
  trustedSportRecordsReady, trustedWalletId,
} from './trustedList.js';

/** First pick date the path owns the totals stake. */
export const TRUSTED_TOTAL_FROM = '2026-11-23';
export const TRUSTED_TOTAL_GATE_AHEAD = 1;
/** Percent the price had shortened since the open when the side's wallets were first seen. */
export const TRUSTED_TOTAL_STEAM_MIN = 1;
export const TRUSTED_TOTAL_STEAM_HEAVY = 8;
export const TRUSTED_TOTAL_RECORDS = 1;
export const TRUSTED_TOTAL_TOP_UNITS = 3;
export const TRUSTED_TOTAL_MID_UNITS = 2;
export const TRUSTED_TOTAL_HEAVY_UNITS = 1;
/** The 1u rung on steam of 8% or more. False: stamped, not staked. */
export const TRUSTED_TOTAL_HEAVY_STAKES = false;
export const TRUSTED_TOTAL_JUICE = -425;
export const TRUSTED_TOTAL_STAKE_TIER = 'LIST-TOTAL';
export const TRUSTED_TOTAL_RESCUED_BY = 'list-total';
export const TRUSTED_TOTAL_MUTED_BY = 'list-total';
export const TRUSTED_TOTAL_PROMOTED_BY = 'list-total';

/** True from the first pick date the path owns the stake. */
export function trustedTotalLive(pickDate) {
  return typeof pickDate === 'string' && pickDate >= TRUSTED_TOTAL_FROM;
}

function finite(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/**
 * Steam since the open on a position's first sight, in percent. Null
 * when the tape has no first row, the row was written at or after the
 * start, or the row carries no number.
 */
export function firstSightSteam(row) {
  let log = row?.ticketTapeLog;
  if (typeof log === 'string') {
    try { log = JSON.parse(log); } catch { log = null; }
  }
  if (!Array.isArray(log)) return null;
  const first = log.find((g) => g && g.gate === 'first');
  if (!first) return null;
  const hours = finite(first.hoursOut);
  if (hours == null || !(hours > 0)) return null;
  return finite(first.sinceOpenPct);
}

/** The middle value, the lower one of two. Null on an empty list. */
function lowerMedian(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[(sorted.length - 1) >> 1];
}

/**
 * The four reads on one side of one total. `positions` are the live
 * positions on that game. A row with a market that is not a total is
 * skipped.
 *
 * @returns {{
 *   walletsFor: number, walletsAgainst: number,
 *   listFor: string[], listAgainst: string[], margin: number,
 *   recordFor: number, recordAgainst: number, recordLead: number,
 *   steam: number|null, steamReads: number,
 * }}
 */
export function trustedTotalRead({ side, positions, sport, list = null } = {}) {
  const mySide = String(side || '').toLowerCase();
  const out = {
    walletsFor: 0, walletsAgainst: 0, listFor: [], listAgainst: [], margin: 0,
    recordFor: 0, recordAgainst: 0, recordLead: 0, steam: null, steamReads: 0,
  };
  if (!mySide) return out;
  // One row a wallet: its largest ticket on the game.
  const held = new Map();
  for (const raw of positions || []) {
    const rowMarket = normTrustedMarket(raw?.marketType || raw?.market);
    if (rowMarket && rowMarket !== 'TOTAL') continue;
    const wallet = trustedWalletId(raw);
    const rowSide = String(raw?.side || '').toLowerCase();
    if (!wallet || !rowSide) continue;
    const invested = Number(raw?.invested ?? raw?.size);
    const size = invested > 0 ? invested : 0;
    const had = held.get(wallet);
    if (!had || size > had.size) held.set(wallet, { side: rowSide, size, row: raw });
  }
  const steams = [];
  for (const [wallet, top] of held) {
    const mine = top.side === mySide;
    const rec = trustedSportRecord('TOTAL', wallet, top.row?.sport || sport, list);
    if (mine) {
      out.walletsFor += 1;
      const steam = firstSightSteam(top.row);
      if (steam != null) steams.push(steam);
    } else {
      out.walletsAgainst += 1;
    }
    if (!rec) continue;
    if (mine) {
      out.recordFor += rec.z;
      if (rec.up) out.listFor.push(wallet);
    } else {
      out.recordAgainst += rec.z;
      if (rec.up) out.listAgainst.push(wallet);
    }
  }
  out.listFor.sort();
  out.listAgainst.sort();
  out.margin = out.listFor.length - out.listAgainst.length;
  out.recordLead = out.recordFor - out.recordAgainst;
  out.steam = lowerMedian(steams);
  out.steamReads = steams.length;
  return out;
}

/**
 * The rung a read lands on, before the price. `units` is the stake;
 * `rung` is the ladder size, which is the stake except on the 1u rung
 * while it is stamped only.
 */
export function trustedTotalRung(read) {
  if (read.margin < TRUSTED_TOTAL_GATE_AHEAD) {
    const reason = read.margin < 0
      ? 'behind'
      : (read.listFor.length || read.listAgainst.length ? 'not_ahead' : 'no_list_wallet');
    return { rung: 0, units: 0, reason };
  }
  if (read.steam == null) return { rung: 0, units: 0, reason: 'no_open_read' };
  if (read.steam < TRUSTED_TOTAL_STEAM_MIN) return { rung: 0, units: 0, reason: 'not_shortened' };
  if (read.steam < TRUSTED_TOTAL_STEAM_HEAVY) {
    if (read.walletsAgainst === 0) {
      return { rung: TRUSTED_TOTAL_TOP_UNITS, units: TRUSTED_TOTAL_TOP_UNITS, reason: 'unopposed' };
    }
    if (read.recordLead >= TRUSTED_TOTAL_RECORDS) {
      return { rung: TRUSTED_TOTAL_MID_UNITS, units: TRUSTED_TOTAL_MID_UNITS, reason: 'opposed_records_ahead' };
    }
    return { rung: 0, units: 0, reason: 'opposed_records_short' };
  }
  if (read.listAgainst.length === 0) {
    return TRUSTED_TOTAL_HEAVY_STAKES
      ? { rung: TRUSTED_TOTAL_HEAVY_UNITS, units: TRUSTED_TOTAL_HEAVY_UNITS, reason: 'heavy_steam' }
      : { rung: TRUSTED_TOTAL_HEAVY_UNITS, units: 0, reason: 'heavy_steam_stamp_only' };
  }
  return { rung: 0, units: 0, reason: 'heavy_steam_opposed' };
}

/**
 * True when the ladder stakes this side at a fair price. The caller uses
 * it to open a side the v12 score did not pick. The price is read later,
 * when the path runs with the ticket.
 */
export function trustedTotalOpensSide({
  pickDate = null, sport = null, market = 'TOTAL', side = null, positions = null, list = null,
} = {}) {
  if (!trustedTotalLive(pickDate)) return false;
  if (normTrustedMarket(market) !== 'TOTAL') return false;
  if (!normTrustedSport(sport)) return false;
  if (!trustedListReady(list) || !trustedSportRecordsReady('TOTAL', list)) return false;
  return trustedTotalRung(trustedTotalRead({ side, positions, sport, list })).units > 0;
}

/**
 * American odds first. With no American number, a price between 0 and 1.
 * Null when there is no number at all.
 */
function priceRead(odds, price) {
  const o = Number(odds);
  if (odds != null && odds !== '' && Number.isFinite(o) && o !== 0) {
    return { juiced: o < TRUSTED_TOTAL_JUICE };
  }
  const p = Number(price);
  if (p > 0 && p < 1) return { juiced: p > 425 / 525 };
  return null;
}

/**
 * A side the path leaves at 0: a mute when a stake arrived, or when the
 * side still carries the path's own stake from an earlier scan.
 */
function zero(out, pre, reason, staked = false) {
  if (pre > 0 || staked === true) return { ...out, fires: true, action: 'MUTE', reason, units: 0 };
  return { ...out, action: 'PASS', reason: `${reason}_no_stake` };
}

/**
 * @returns {{
 *   fires: boolean, action: 'STAKE'|'MUTE'|'PASS'|'EXEMPT', reason: string,
 *   units: number, unitsPre: number, rung: number,
 *   margin: number, wallets: string[], against: string[],
 *   walletsFor: number, walletsAgainst: number,
 *   recordFor: number|null, recordAgainst: number|null, recordLead: number|null,
 *   steam: number|null, steamReads: number,
 *   odds: number|null, price: number|null,
 * }}
 */
export function applyTrustedTotalPath({
  units = 0,
  pickDate = null,
  sport = null,
  market = null,
  side = null,
  positions = null,
  odds = null,
  price = null,
  manual = false,
  killed = false,
  manualAgainst = false,
  staked = false,
  list = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const oddsN = odds != null && odds !== '' && Number.isFinite(Number(odds)) ? Number(odds) : null;
  const priceN = price > 0 && price < 1 ? Number(price) : null;
  const base = {
    fires: false,
    units: pre,
    unitsPre: pre,
    rung: 0,
    margin: 0,
    wallets: [],
    against: [],
    walletsFor: 0,
    walletsAgainst: 0,
    recordFor: null,
    recordAgainst: null,
    recordLead: null,
    steam: null,
    steamReads: 0,
    odds: oddsN,
    price: priceN,
  };
  if (manual === true) return { ...base, action: 'EXEMPT', reason: 'manual' };
  if (killed === true) return { ...base, action: 'EXEMPT', reason: 'killed' };
  if (!trustedTotalLive(pickDate)) return { ...base, action: 'EXEMPT', reason: 'not_live' };
  if (normTrustedMarket(market) !== 'TOTAL') return { ...base, action: 'PASS', reason: 'not_total' };
  if (!trustedListReady(list)) return zero(base, pre, 'no_list', staked);
  if (!trustedSportRecordsReady('TOTAL', list)) return zero(base, pre, 'no_records', staked);
  const read = trustedTotalRead({ side, positions, sport, list });
  const out = {
    ...base,
    margin: read.margin,
    wallets: read.listFor,
    against: read.listAgainst,
    walletsFor: read.walletsFor,
    walletsAgainst: read.walletsAgainst,
    recordFor: read.recordFor,
    recordAgainst: read.recordAgainst,
    recordLead: read.recordLead,
    steam: read.steam,
    steamReads: read.steamReads,
  };
  const step = trustedTotalRung(read);
  out.rung = step.rung;
  if (!(step.units > 0)) return zero(out, pre, step.reason, staked);
  // A manual stake on the other side is the bet on this game.
  if (manualAgainst === true) return zero(out, pre, 'manual_against', staked);
  const p = priceRead(odds, price);
  if (!p) return zero(out, pre, 'no_price', staked);
  if (p.juiced) return zero(out, pre, 'juice', staked);
  return { ...out, fires: true, action: 'STAKE', reason: step.reason, units: step.units };
}

export const TRUSTED_TOTAL_STAMP_FIELDS = Object.freeze([
  'v8_trustedTotal',
  'v8_trustedTotalAction',
  'v8_trustedTotalReason',
  'v8_trustedTotalUnits',
  'v8_trustedTotalRung',
  'v8_trustedTotalMargin',
  'v8_trustedTotalWallets',
  'v8_trustedTotalAgainst',
  'v8_trustedTotalWalletsFor',
  'v8_trustedTotalWalletsAgainst',
  'v8_trustedTotalRecordFor',
  'v8_trustedTotalRecordAgainst',
  'v8_trustedTotalRecordLead',
  'v8_trustedTotalSteam',
  'v8_trustedTotalSteamReads',
  'v8_trustedTotalOdds',
  'v8_unitsPreTrustedTotal',
]);

function round2(v) {
  return typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 100) / 100 : null;
}

/**
 * Every field, on every total side the path looked at, so a side that
 * stops firing does not keep the last stake's stamp. Empty when the path
 * did not look (another market, an earlier date).
 */
export function trustedTotalStamp(policy) {
  if (!policy || policy.reason === 'not_live' || policy.reason === 'not_total') return {};
  return {
    v8_trustedTotal: policy.action === 'STAKE' || policy.action === 'MUTE',
    v8_trustedTotalAction: policy.action,
    v8_trustedTotalReason: policy.reason,
    v8_trustedTotalUnits: policy.units,
    v8_trustedTotalRung: policy.rung ?? 0,
    v8_trustedTotalMargin: policy.margin ?? 0,
    v8_trustedTotalWallets: Array.isArray(policy.wallets) ? policy.wallets : [],
    v8_trustedTotalAgainst: Array.isArray(policy.against) ? policy.against : [],
    v8_trustedTotalWalletsFor: policy.walletsFor ?? 0,
    v8_trustedTotalWalletsAgainst: policy.walletsAgainst ?? 0,
    v8_trustedTotalRecordFor: round2(policy.recordFor),
    v8_trustedTotalRecordAgainst: round2(policy.recordAgainst),
    v8_trustedTotalRecordLead: round2(policy.recordLead),
    v8_trustedTotalSteam: round2(policy.steam),
    v8_trustedTotalSteamReads: policy.steamReads ?? 0,
    v8_trustedTotalOdds: policy.odds ?? null,
    v8_unitsPreTrustedTotal: policy.unitsPre,
  };
}
