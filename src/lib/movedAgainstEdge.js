/**
 * Mute a moved-against price when the wallet edge is under 3.5.
 *
 * The move is M = max(lastHourPct, sinceOpenPct) on the steam stamp.
 * Against means M < 0. One missing percent uses the one that exists.
 * Flat and any shorten stay. A missing stamp is not a move against.
 *
 * The edge is not v8_pressEdge and not v8_t4.for[].edge. Each FOR wallet
 * with a stake scores its graded Source B bets in this sport dated before
 * the game: 100 × (won − entry price), won from settled profit above 0.
 * Sport mean shrinks by 30. Market and the ±0.10 price band each pull
 * toward that sport score by 20. The wallet is half market, half band.
 * The edge is the unweighted mean of those wallets. No minimum count.
 * Compare the raw mean with 3.5. Do not round first.
 *
 * M < 0 and the edge missing or under 3.5 → 0. M < 0 and the edge at
 * 3.5 or more → leave the stake. Manual stake, an operator kill, and
 * the T-15 freeze win. Settled tickets are not rewritten. Four sports,
 * moneyline, spread, and total, from the deploy date forward.
 */

import { readFileSync, existsSync } from 'fs';
import { summarizeSteam } from './steamMove.js';
import { pressWalletRows } from './pressLadderOverlay.js';

export const MOVED_AGAINST_FROM = '2026-11-14';
export const MOVED_AGAINST_EDGE_MIN = 3.5;
export const MOVED_AGAINST_MUTED_BY = 'moved-against';
export const MOVED_AGAINST_SPORT_PULL = 30;
export const MOVED_AGAINST_BAND_PULL = 20;
export const MOVED_AGAINST_PRICE_BAND = 0.10;
export const MOVED_AGAINST_PRICE_MIN = 0.02;
export const MOVED_AGAINST_PRICE_MAX = 0.98;
export const MOVED_AGAINST_LEDGER_VERSION = 1;

const SPORTS = new Set(['NHL', 'NBA', 'NFL', 'CFB']);
const MARKETS = new Set(['ML', 'SPREAD', 'TOTAL']);
const MARKET_CODE = { ML: 0, SPREAD: 1, TOTAL: 2 };
const CODE_MARKET = ['ML', 'SPREAD', 'TOTAL'];
const DAY_MS = 86_400_000;
const DAY_EPOCH = Date.UTC(2020, 0, 1);

export function normMovedSport(sport) {
  const u = String(sport || '').toUpperCase();
  if (u === 'NCAAF' || u === 'NCAAFB') return 'CFB';
  return u;
}

export function normMovedMarket(market) {
  const u = String(market || '').toUpperCase();
  if (u === 'ML' || u === 'MONEYLINE' || u === 'H2H') return 'ML';
  if (u === 'SPREAD' || u === 'SPREADS') return 'SPREAD';
  if (u === 'TOTAL' || u === 'TOTALS') return 'TOTAL';
  return u;
}

export function isMovedAgainstLive(pickDate, sport, market) {
  if (typeof pickDate !== 'string' || pickDate < MOVED_AGAINST_FROM) return false;
  if (!SPORTS.has(normMovedSport(sport))) return false;
  if (!MARKETS.has(normMovedMarket(market))) return false;
  return true;
}

/**
 * American odds → probability. Negative: abs / (abs + 100).
 * Positive: 100 / (odds + 100). Missing or 0 stays missing.
 */
export function ticketImpliedProb(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || n === 0) return null;
  if (n < 0) return Math.abs(n) / (Math.abs(n) + 100);
  return 100 / (n + 100);
}

function finiteOrNull(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** M = max of the percents that exist. Both missing → null. */
export function steamMoveM(steam) {
  if (!steam || typeof steam !== 'object') return null;
  const vals = [];
  for (const key of ['lastHourPct', 'sinceOpenPct']) {
    const n = finiteOrNull(steam[key]);
    if (n != null) vals.push(n);
  }
  if (!vals.length) return null;
  return Math.max(...vals);
}

/**
 * Live last-hour and since-open percents. Null when the game has no
 * steam numbers. A null return is not a move against.
 */
export function steamPctsFromPinn(pinnGame, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  nowSec = Math.floor(Date.now() / 1000),
  freezeAtMs = null,
} = {}) {
  if (!pinnGame) return null;
  const summary = summarizeSteam(pinnGame, {
    marketType, sideNorm, line, nowSec, freezeAtMs,
  });
  const last = Number(summary?.lastHour?.dropPct);
  const open = Number(summary?.sinceOpen?.dropPct);
  const lastHourPct = Number.isFinite(last) ? last : null;
  const sinceOpenPct = Number.isFinite(open) ? open : null;
  if (lastHourPct == null && sinceOpenPct == null) return null;
  return { lastHourPct, sinceOpenPct };
}

function dayNum(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (!Number.isFinite(t)) return null;
  return Math.round((t - DAY_EPOCH) / DAY_MS);
}

function entryProb(row) {
  let p = Number(row?.entryAvgPrice ?? row?.avgPrice);
  if (!Number.isFinite(p)) return null;
  if (p > 1 && p <= 100) p = p / 100;
  if (p < MOVED_AGAINST_PRICE_MIN || p > MOVED_AGAINST_PRICE_MAX) return null;
  return Math.round(p * 10000) / 10000;
}

function rowWon(row) {
  const result = String(row?.result || '').toUpperCase();
  if (result === 'PUSH' || result === 'POSTPONED' || result === 'CANCELED'
    || result === 'CANCELLED' || result === 'VOID') return null;
  if (row?.postponed === true) return null;
  const invested = Number(row?.invested ?? row?.size);
  if (!(invested > 0)) return null;
  const pnl = Number(row?.settledPnl ?? row?.positionPnl);
  if (!Number.isFinite(pnl) || pnl === 0) return null;
  return pnl > 0 ? 1 : 0;
}

/** One kept bet: day, market code, price, won. Null when the row is out. */
export function ledgerBetFromRow(row) {
  const sport = normMovedSport(row?.sport);
  if (!SPORTS.has(sport)) return null;
  const market = normMovedMarket(row?.market ?? row?.marketType);
  if (!MARKETS.has(market)) return null;
  const day = dayNum(row?.date);
  if (day == null) return null;
  const price = entryProb(row);
  if (price == null) return null;
  const won = rowWon(row);
  if (won == null) return null;
  const wallet = String(row?.walletShort || row?.wallet || '').slice(-6).toLowerCase();
  if (!wallet) return null;
  return { wallet, sport, day, market: MARKET_CODE[market], price, won };
}

export function emptyMovedAgainstLedger() {
  return { v: MOVED_AGAINST_LEDGER_VERSION, bets: new Map(), betCount: 0 };
}

/**
 * Compact ledger. bets is Map<wallet, Map<sport, Array<[day, market, price, won]>>>.
 */
export function buildMovedAgainstLedger(rows) {
  const bets = new Map();
  let betCount = 0;
  for (const row of rows || []) {
    const bet = ledgerBetFromRow(row);
    if (!bet) continue;
    let bySport = bets.get(bet.wallet);
    if (!bySport) {
      bySport = new Map();
      bets.set(bet.wallet, bySport);
    }
    let list = bySport.get(bet.sport);
    if (!list) {
      list = [];
      bySport.set(bet.sport, list);
    }
    list.push([bet.day, bet.market, bet.price, bet.won]);
    betCount += 1;
  }
  return { v: MOVED_AGAINST_LEDGER_VERSION, bets, betCount };
}

export function serializeMovedAgainstLedger(ledger, { generatedAt = null } = {}) {
  const wallets = {};
  let betCount = 0;
  for (const [wallet, bySport] of ledger?.bets || []) {
    const sports = {};
    for (const [sport, list] of bySport) {
      if (!list?.length) continue;
      sports[sport] = list;
      betCount += list.length;
    }
    if (Object.keys(sports).length) wallets[wallet] = sports;
  }
  return {
    v: MOVED_AGAINST_LEDGER_VERSION,
    generatedAt: generatedAt || new Date().toISOString(),
    betCount,
    walletCount: Object.keys(wallets).length,
    wallets,
  };
}

export function loadMovedAgainstLedger(filePath) {
  if (!filePath || !existsSync(filePath)) return emptyMovedAgainstLedger();
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));
  return hydrateMovedAgainstLedger(raw);
}

export function hydrateMovedAgainstLedger(raw) {
  const bets = new Map();
  let betCount = 0;
  const wallets = raw?.wallets && typeof raw.wallets === 'object' ? raw.wallets : {};
  for (const [wallet, sports] of Object.entries(wallets)) {
    if (!sports || typeof sports !== 'object') continue;
    const bySport = new Map();
    for (const [sport, list] of Object.entries(sports)) {
      if (!Array.isArray(list) || !list.length) continue;
      bySport.set(normMovedSport(sport), list);
      betCount += list.length;
    }
    if (bySport.size) bets.set(String(wallet).slice(-6).toLowerCase(), bySport);
  }
  return {
    v: Number(raw?.v) || MOVED_AGAINST_LEDGER_VERSION,
    bets,
    betCount: Number(raw?.betCount) || betCount,
    generatedAt: raw?.generatedAt || null,
  };
}

function betBefore(tuple, gameDay) {
  const day = tuple?.[0];
  return Number.isFinite(day) && Number.isFinite(gameDay) && day < gameDay;
}

function meanScore(tuples) {
  if (!tuples.length) return null;
  let sum = 0;
  for (const t of tuples) sum += 100 * (t[3] - t[2]);
  return sum / tuples.length;
}

/**
 * Wallet score w. Null when the wallet has no sport bets before the game.
 * bets are [day, marketCode, price, won] already limited to this sport.
 */
export function walletMovedScore(bets, market, ticketProb, gameDay) {
  const sportBets = (bets || []).filter((t) => betBefore(t, gameDay));
  const nS = sportBets.length;
  if (!nS) return null;
  const eS = meanScore(sportBets);
  const es = eS * nS / (nS + MOVED_AGAINST_SPORT_PULL);
  const code = MARKET_CODE[normMovedMarket(market)];
  const marketBets = sportBets.filter((t) => t[1] === code);
  const nM = marketBets.length;
  const emk = nM
    ? (nM * meanScore(marketBets) + MOVED_AGAINST_BAND_PULL * es) / (nM + MOVED_AGAINST_BAND_PULL)
    : es;
  const price = Number(ticketProb);
  const hasPrice = Number.isFinite(price);
  const band = hasPrice
    ? sportBets.filter((t) => Math.abs(t[2] - price) <= MOVED_AGAINST_PRICE_BAND + 1e-9)
    : [];
  const nC = band.length;
  const ectx = (hasPrice && nC)
    ? (nC * meanScore(band) + MOVED_AGAINST_BAND_PULL * es) / (nC + MOVED_AGAINST_BAND_PULL)
    : es;
  return 0.5 * emk + 0.5 * ectx;
}

/**
 * Unweighted mean of FOR wallets with sport history. Null when none qualify.
 * No minimum bet count. The number is not rounded.
 */
export function sideMovedAgainstEdge({
  walletDetails = null,
  side = null,
  sport = null,
  market = null,
  walletProfiles = null,
  pickDate = null,
  odds = null,
  ledger = null,
} = {}) {
  const gameDay = dayNum(pickDate);
  if (gameDay == null) return { edge: null, n: 0 };
  const rows = pressWalletRows(walletDetails, side, sport, walletProfiles, market, pickDate);
  const seen = new Set();
  const scores = [];
  const prob = ticketImpliedProb(odds);
  const sportKey = normMovedSport(sport);
  for (const row of rows) {
    if (row?.dir !== 'FOR') continue;
    const wallet = String(row.wallet || '').slice(-6).toLowerCase();
    if (!wallet || seen.has(wallet)) continue;
    seen.add(wallet);
    const bets = ledger?.bets?.get(wallet)?.get(sportKey) || null;
    const w = walletMovedScore(bets, market, prob, gameDay);
    if (w == null) continue;
    scores.push(w);
  }
  if (!scores.length) return { edge: null, n: 0 };
  const edge = scores.reduce((s, w) => s + w, 0) / scores.length;
  return { edge, n: scores.length };
}

/**
 * @returns {{
 *   units: number, action: 'MUTE'|'PASS'|'EXEMPT', reason: string|null,
 *   mutedBy: string|null, unitsPrePolicy: number,
 *   m: number|null, edge: number|null, n: number,
 * }}
 */
export function applyMovedAgainstMute({
  units,
  pickDate = null,
  sport = null,
  market = null,
  m = null,
  edge = null,
  n = 0,
  manual = false,
  killed = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  const base = {
    units: pre,
    unitsPrePolicy: pre,
    m: finiteOrNull(m),
    edge: finiteOrNull(edge),
    n: Number(n) || 0,
    mutedBy: null,
    reason: null,
  };
  if (manual || killed) return { ...base, action: 'EXEMPT' };
  if (!isMovedAgainstLive(pickDate, sport, market)) return { ...base, action: 'EXEMPT' };
  if (!(base.m < 0)) return { ...base, action: 'PASS' };
  if (base.edge != null && base.edge >= MOVED_AGAINST_EDGE_MIN) {
    return { ...base, action: 'PASS', reason: 'edge_holds' };
  }
  return {
    ...base,
    units: 0,
    action: 'MUTE',
    reason: base.edge == null ? 'edge_missing' : 'edge_under_3_5',
    mutedBy: MOVED_AGAINST_MUTED_BY,
  };
}

export function decideMovedAgainst({
  units,
  pickDate = null,
  sport = null,
  market = null,
  odds = null,
  walletDetails = null,
  side = null,
  walletProfiles = null,
  ledger = null,
  steam = null,
  manual = false,
  killed = false,
} = {}) {
  const m = steamMoveM(steam);
  const needEdge = m != null && m < 0 && isMovedAgainstLive(pickDate, sport, market) && !manual && !killed;
  const scored = needEdge
    ? sideMovedAgainstEdge({
      walletDetails, side, sport, market, walletProfiles, pickDate, odds, ledger,
    })
    : { edge: null, n: 0 };
  return applyMovedAgainstMute({
    units, pickDate, sport, market, m, edge: scored.edge, n: scored.n, manual, killed,
  });
}

export function movedAgainstStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  return {
    v8_movedAgainstAction: policy.action,
    v8_movedAgainstReason: policy.reason ?? null,
    v8_movedAgainstM: policy.m ?? null,
    v8_movedAgainstEdge: policy.edge ?? null,
    v8_movedAgainstN: policy.n ?? 0,
    v8_unitsPreMovedAgainst: policy.unitsPrePolicy,
  };
}
