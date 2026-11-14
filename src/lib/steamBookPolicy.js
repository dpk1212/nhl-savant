/**
 * Two stake rules on the steam move, after the wallet-edge against mute.
 *
 * M = max(lastHourPct, sinceOpenPct). One missing percent uses the one
 * that exists. A missing stamp is not a move.
 *
 * Short-move mute. 0 ≤ M < 4.5, the stamped press edge under 5, and no
 * tier-5 lead → 0. The edge is v8_pressEdge: sport win rate minus the
 * ticket price on a moneyline, market win rate minus 52.4 on a spread or
 * a total. A missing edge stays. A tier-5 lead is unique tier-5 ON wallets
 * on the market book, for minus against, at least 1. Exactly 5 stays.
 * Exactly 4.5% stays.
 *
 * 10% resize. M ≥ 10 and the stake is already above 0 → ×1.5, rounded to
 * the half unit. The seat ceiling and the odds cap stop the increase.
 * They do not take units off a stake already inside them.
 *
 * Manual stake, an operator kill, and the T-15 freeze win. Four sports,
 * moneyline, spread, and total, from the deploy date forward.
 */

import { oddsCap } from './oddsCap.js';
import { trustMarginRead } from './pressLadderOverlay.js';

export const STEAM_BOOK_FROM = '2026-11-14';
export const SHORT_MOVE_MAX = 4.5;
export const SHORT_MOVE_EDGE_MAX = 5;
export const STEAM_TEN_MIN = 10;
export const SHORT_MOVE_MUTED_BY = 'short-move';

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const MARKETS = new Set(['ML', 'SPREAD', 'TOTAL']);
const T5_ON = new Set(['STABLE_ON', 'REGAINED_ON']);

export function normSteamBookSport(sport) {
  const u = String(sport || '').toUpperCase();
  if (u === 'NCAAF' || u === 'NCAAFB') return 'CFB';
  return u;
}

export function normSteamBookMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u === 'SPREAD' || u === 'SPREADS') return 'SPREAD';
  if (u === 'TOTAL' || u === 'TOTALS') return 'TOTAL';
  return u;
}

export function isSteamBookLive(pickDate, sport, market) {
  if (typeof pickDate !== 'string' || pickDate < STEAM_BOOK_FROM) return false;
  if (!SPORTS.has(normSteamBookSport(sport))) return false;
  if (!MARKETS.has(normSteamBookMarket(market))) return false;
  return true;
}

function finiteOrNull(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function walletKey(wallet) {
  const id = String(wallet || '').toLowerCase();
  return id.length > 6 ? id.slice(-6) : id;
}

/** True when unique tier-5 ON wallets lead the other side by at least one. */
export function t5MarketLead(mktFor, mktAg) {
  const { tFor, tAg } = trustMarginRead(mktFor, mktAg);
  const count = (list) => {
    const seen = new Set();
    for (const w of list || []) {
      if ((Number(w?.tier) || 0) < 5) continue;
      if (w?.status && !T5_ON.has(w.status)) continue;
      const key = walletKey(w.wallet);
      if (key) seen.add(key);
    }
    return seen.size;
  };
  return count(tFor) - count(tAg) >= 1;
}

function halfUp(units) {
  return Math.round(Number(units) * 2) / 2;
}

/**
 * @returns {{
 *   units: number, action: 'MUTE'|'PASS'|'EXEMPT', reason: string|null,
 *   mutedBy: string|null, unitsPrePolicy: number,
 *   m: number|null, edge: number|null, lead: boolean,
 * }}
 */
export function applyShortMoveMute({
  units,
  pickDate = null,
  sport = null,
  market = null,
  m = null,
  edge = null,
  lead = false,
  manual = false,
  killed = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const base = {
    units: pre,
    unitsPrePolicy: pre,
    m: finiteOrNull(m),
    edge: finiteOrNull(edge),
    lead: lead === true,
    mutedBy: null,
    reason: null,
  };
  if (manual || killed) return { ...base, action: 'EXEMPT' };
  if (!isSteamBookLive(pickDate, sport, market)) return { ...base, action: 'EXEMPT' };
  const move = base.m;
  if (move == null || move < 0 || move >= SHORT_MOVE_MAX) return { ...base, action: 'PASS' };
  if (base.edge == null || base.edge >= SHORT_MOVE_EDGE_MAX) return { ...base, action: 'PASS' };
  if (base.lead) return { ...base, action: 'PASS', reason: 't5_lead' };
  return {
    ...base,
    units: 0,
    action: 'MUTE',
    reason: 'edge_under_5',
    mutedBy: SHORT_MOVE_MUTED_BY,
  };
}

/**
 * @returns {{
 *   units: number, action: 'BOOST'|'PASS'|'EXEMPT', reason: string|null,
 *   unitsPrePolicy: number, m: number|null,
 * }}
 */
export function applySteamTenResize({
  units,
  pickDate = null,
  sport = null,
  market = null,
  m = null,
  ceiling = null,
  odds = null,
  manual = false,
  killed = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const base = {
    units: pre,
    unitsPrePolicy: pre,
    m: finiteOrNull(m),
    reason: null,
  };
  if (manual || killed) return { ...base, action: 'EXEMPT' };
  if (!isSteamBookLive(pickDate, sport, market)) return { ...base, action: 'EXEMPT' };
  if (!(base.m >= STEAM_TEN_MIN) || !(pre > 0)) return { ...base, action: 'PASS' };
  let next = halfUp(pre * 1.5);
  const cap = finiteOrNull(ceiling);
  if (cap != null) next = Math.min(Math.max(next, pre), Math.max(cap, pre));
  const priced = finiteOrNull(odds);
  if (priced != null) next = Math.max(oddsCap(next, priced), Math.min(pre, next));
  next = halfUp(next);
  if (!(next > pre)) return { ...base, action: 'PASS', reason: 'capped' };
  return { ...base, units: next, action: 'BOOST', reason: 'ten_pct' };
}

export function applySteamBook({
  units,
  pickDate = null,
  sport = null,
  market = null,
  m = null,
  edge = null,
  lead = false,
  ceiling = null,
  odds = null,
  manual = false,
  killed = false,
} = {}) {
  const mute = applyShortMoveMute({
    units, pickDate, sport, market, m, edge, lead, manual, killed,
  });
  const resize = applySteamTenResize({
    units: mute.units,
    pickDate,
    sport,
    market,
    m,
    ceiling,
    odds,
    manual,
    killed,
  });
  return { mute, resize, units: resize.units };
}

export function shortMoveStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_shortMoveAction: policy.action,
    v8_shortMoveReason: policy.reason ?? null,
    v8_shortMoveM: policy.m ?? null,
    v8_shortMoveEdge: policy.edge ?? null,
    v8_shortMoveLead: policy.lead === true,
    v8_unitsPreShortMove: policy.unitsPrePolicy,
  };
}

export function steamTenStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_steamTenAction: policy.action,
    v8_steamTenM: policy.m ?? null,
    v8_unitsPreSteamTen: policy.unitsPrePolicy,
    v8_steamTenUnits: policy.units,
  };
}

export function steamBookStamp(result) {
  if (!result) return {};
  return {
    ...shortMoveStamp(result.mute),
    ...steamTenStamp(result.resize),
  };
}
