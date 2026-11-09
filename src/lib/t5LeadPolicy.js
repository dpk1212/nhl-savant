/**
 * Season tier-5 lead. A wallet qualifies on a morning when its season book
 * (bets on or after the sport's season start, and before that morning) is
 * tier 5, STABLE_ON or REGAINED_ON, n ≥ 10, and at least 15 days old.
 *
 * Season start is the first graded date after the last gap of 21 days in
 * that sport. The hold is the longest qualifying wallet on our side, walked
 * back one morning at a time with no gap. Held 6 and held 14 are that many
 * days or more.
 *
 * Boost adds 1, plus 1 inside 0.45–0.55, plus 1 at a 14-day hold, on a
 * stake the rest of the chain already left above 0. Rescue sets a
 * press-edge-net zero to 1 unit under T5-LEAD and does not take the boost.
 * From 2026-11-08. A frozen, graded, manual, or killed side is not rewritten
 * here — the caller keeps those gates.
 */

import { buildTrustState } from './walletTrustStatus.js';
import { impliedFromAmerican } from './oddsEv.js';

export const T5_LEAD_FROM = '2026-11-08';
export const T5_SEASON_GAP_DAYS = 21;
export const T5_MIN_N = 10;
export const T5_TIER = 5;
export const T5_MIN_AGE_DAYS = 15;
export const T5_HOLD_BOOST = 6;
export const T5_HOLD_LONG = 14;
export const T5_PRICE_LO = 0.45;
export const T5_PRICE_HI = 0.55;
export const T5_RESCUE_UNITS = 1;
export const T5_LEAD_STAKE_TIER = 'T5-LEAD';
export const T5_LEDGER_COLLECTION = 't5SeasonLedger';
export const T5_ON = new Set(['STABLE_ON', 'REGAINED_ON']);
const SIDES = new Set(['home', 'away', 'over', 'under']);

let ledger = null;
const holdCache = new Map();

export function setT5SeasonLedger(next) {
  ledger = next && typeof next === 'object' ? next : null;
  holdCache.clear();
}

export function t5SeasonLedger() {
  return ledger;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

function dateBefore(d) {
  const t = new Date(Date.parse(`${d}T00:00:00Z`) - 86400000);
  return t.toISOString().slice(0, 10);
}

export function t5WalletId(wd) {
  const raw = wd?.walletShort || wd?.wallet || '';
  const id = String(raw).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (id.length < 4) return '';
  return id.slice(-6);
}

/** First graded date after the last gap of 21 days. No gap → the first date. */
export function seasonStartFromDates(dates) {
  const uniq = [...new Set((dates || [])
    .map((d) => String(d || '').slice(0, 10))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort();
  if (!uniq.length) return null;
  let start = uniq[0];
  for (let i = 1; i < uniq.length; i += 1) {
    if (daysBetween(uniq[i - 1], uniq[i]) >= T5_SEASON_GAP_DAYS) start = uniq[i];
  }
  return start;
}

function asTrustRows(stored) {
  const out = [];
  for (let i = 0; i < (stored || []).length; i += 1) {
    const row = stored[i];
    if (!Array.isArray(row) || row.length < 3) continue;
    const date = String(row[0] || '').slice(0, 10);
    const price = Number(row[1]) / 1000;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!(price > 0 && price < 1)) continue;
    out.push({ date, price, won: row[2] === 1 || row[2] === true, key: String(i) });
  }
  return out;
}

export function t5MorningRead(rows, asOf, seasonStart) {
  const day = String(asOf || '').slice(0, 10);
  const start = seasonStart ? String(seasonStart).slice(0, 10) : null;
  const season = (rows || []).filter((r) => r?.date && r.date < day && (!start || r.date >= start));
  if (!season.length) {
    return { qualifies: false, tier: 0, status: 'UNPROVEN', n: 0, age: 0, edge: null, first: null };
  }
  const state = buildTrustState(season, { asOf: day });
  const first = state.firstBetDate || null;
  const age = first ? Math.max(0, daysBetween(first, day)) : 0;
  const qualifies = state.tier === T5_TIER
    && state.n >= T5_MIN_N
    && T5_ON.has(state.status)
    && age >= T5_MIN_AGE_DAYS;
  return {
    qualifies,
    tier: state.tier,
    status: state.status,
    n: state.n,
    age,
    edge: state.edge,
    first,
  };
}

/** Days from the earliest still-qualifying morning to this morning. Today-only is 0. */
export function t5HoldDays(rows, asOf, seasonStart) {
  const day = String(asOf || '').slice(0, 10);
  const start = seasonStart ? String(seasonStart).slice(0, 10) : null;
  const read = t5MorningRead(rows, day, start);
  if (!read.qualifies) return { qualifies: false, held: null, earliest: null, read };
  let earliest = day;
  let cursor = day;
  for (let i = 0; i < 400; i += 1) {
    const prev = dateBefore(cursor);
    if (start && prev < start) break;
    const back = t5MorningRead(rows, prev, start);
    if (!back.qualifies) break;
    earliest = prev;
    cursor = prev;
  }
  return { qualifies: true, held: daysBetween(earliest, day), earliest, read };
}

function sportBook(sport) {
  const key = String(sport || '').toUpperCase();
  const sports = ledger?.sports;
  if (!sports || !key) return null;
  return sports[key] || null;
}

function rowsFor(sport, id, asOf) {
  const book = sportBook(sport);
  if (!book || !id) return { rows: [], seasonStart: book?.seasonStart || null };
  const cacheKey = `${sport}|${id}|${asOf}`;
  if (holdCache.has(cacheKey)) return holdCache.get(cacheKey);
  const stored = book.wallets?.[id] || [];
  const packed = { rows: asTrustRows(stored), seasonStart: book.seasonStart || null };
  holdCache.set(cacheKey, packed);
  return packed;
}

function idsOnSide(walletDetails, side) {
  const ids = new Set();
  for (const wd of walletDetails || []) {
    if (!wd) continue;
    const s = String(wd.side || '').toLowerCase();
    if (s !== side || !SIDES.has(s)) continue;
    if (!(Number(wd.invested) > 0)) continue;
    const id = t5WalletId(wd);
    if (id) ids.add(id);
  }
  return ids;
}

function oppositeSides(side) {
  if (side === 'home') return ['away'];
  if (side === 'away') return ['home'];
  if (side === 'over') return ['under'];
  if (side === 'under') return ['over'];
  return [];
}

export function t5LeadForSide({ walletDetails, side, sport, asOf } = {}) {
  const day = String(asOf || '').slice(0, 10);
  const wanted = String(side || '').toLowerCase();
  const bySide = {
    home: idsOnSide(walletDetails, 'home'),
    away: idsOnSide(walletDetails, 'away'),
    over: idsOnSide(walletDetails, 'over'),
    under: idsOnSide(walletDetails, 'under'),
  };
  const owner = new Map();
  const both = new Set();
  for (const s of SIDES) {
    for (const id of bySide[s]) {
      if (owner.has(id) && owner.get(id) !== s) both.add(id);
      else owner.set(id, s);
    }
  }
  const ours = [...(bySide[wanted] || [])].filter((id) => !both.has(id));
  const theirs = new Set();
  for (const s of oppositeSides(wanted)) {
    for (const id of bySide[s] || []) if (!both.has(id)) theirs.add(id);
  }
  const book = sportBook(sport);
  const qualify = (id) => {
    const packed = rowsFor(sport, id, day);
    const held = t5HoldDays(packed.rows, day, packed.seasonStart);
    holdCache.set(`hold|${sport}|${id}|${day}`, held);
    return held;
  };
  const ourQ = [];
  for (const id of ours) {
    const cacheKey = `hold|${sport}|${id}|${day}`;
    const held = holdCache.has(cacheKey) ? holdCache.get(cacheKey) : qualify(id);
    if (held.qualifies) ourQ.push({ id, held: held.held });
  }
  let against = 0;
  for (const id of theirs) {
    const cacheKey = `hold|${sport}|${id}|${day}`;
    const held = holdCache.has(cacheKey) ? holdCache.get(cacheKey) : qualify(id);
    if (held.qualifies) against += 1;
  }
  let hold = null;
  let holdWallet = null;
  for (const w of ourQ) {
    if (hold == null || w.held > hold || (w.held === hold && w.id < holdWallet)) {
      hold = w.held;
      holdWallet = w.id;
    }
  }
  const f = ourQ.length;
  return {
    f,
    a: against,
    lead: f - against >= 1,
    hold,
    holdWallet,
    wallets: ourQ.map((w) => w.id).sort(),
    seasonStart: book?.seasonStart || null,
  };
}

function inBand(price) {
  return price != null && price >= T5_PRICE_LO && price < T5_PRICE_HI;
}

/**
 * @returns {{
 *   units: number, action: 'BOOST'|'RESCUE'|'PASS'|'EXEMPT', add: number,
 *   tier: string|null, reason: string|null, lead: object|null, price: number|null,
 * }}
 */
export function applyT5Lead({
  units,
  pickDate = null,
  odds = null,
  walletDetails = null,
  sport = null,
  side = null,
  manual = false,
  pressEdgeMuted = false,
  blocked = false,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  if (typeof pickDate !== 'string' || pickDate < T5_LEAD_FROM) {
    return { units: pre, action: 'EXEMPT', add: 0, tier: null, reason: 'pre_cutover', lead: null, price: null };
  }
  const lead = t5LeadForSide({ walletDetails, side, sport, asOf: pickDate });
  const price = impliedFromAmerican(odds);
  const base = { lead, price };
  if (manual) {
    return { ...base, units: pre, action: 'PASS', add: 0, tier: null, reason: 'manual' };
  }
  const held = lead.hold;
  const armed = lead.lead === true && held != null && held >= T5_HOLD_BOOST;
  if (pre > 0 && armed) {
    let add = 1;
    if (inBand(price)) add += 1;
    if (held >= T5_HOLD_LONG) add += 1;
    return {
      ...base,
      units: Math.round((pre + add) * 100) / 100,
      action: 'BOOST',
      add,
      tier: null,
      reason: 't5_lead_boost',
    };
  }
  if (!(pre > 0) && pressEdgeMuted && armed && !blocked) {
    return {
      ...base,
      units: T5_RESCUE_UNITS,
      action: 'RESCUE',
      add: T5_RESCUE_UNITS,
      tier: T5_LEAD_STAKE_TIER,
      reason: 't5_lead_rescue',
    };
  }
  return {
    ...base,
    units: blocked && !(pre > 0) ? 0 : pre,
    action: 'PASS',
    add: 0,
    tier: null,
    reason: blocked && !(pre > 0) ? 'muted' : null,
  };
}

export function t5LeadStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  const lead = policy.lead || {};
  return {
    v8_t5LeadAction: policy.action,
    v8_t5LeadAdd: policy.add || 0,
    v8_t5LeadFor: lead.f ?? 0,
    v8_t5LeadAg: lead.a ?? 0,
    v8_t5LeadHold: lead.hold ?? null,
    v8_t5LeadHoldWallet: lead.holdWallet ?? null,
    v8_t5LeadWallets: Array.isArray(lead.wallets) ? lead.wallets : [],
    v8_t5LeadUnits: policy.units,
    v8_t5LeadReason: policy.reason ?? null,
  };
}

function trustTuple(bet) {
  const invested = Number(bet?.invested ?? bet?.size ?? 0);
  const price = Number(bet?.avgPrice);
  const pnl = Number(bet?.settledPnl ?? bet?.positionPnl ?? 0);
  const date = String(bet?.date || '').slice(0, 10);
  if (!(invested > 0)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!(price > 0.02 && price < 0.98)) return null;
  if (Math.abs(pnl) <= 1e-9) return null;
  const id = t5WalletId(bet);
  const sport = String(bet?.sport || '').toUpperCase();
  if (!id || !sport) return null;
  return { id, sport, date, price: Math.round(price * 1000), won: pnl > 0 ? 1 : 0 };
}

/**
 * One compact book per sport. Tuples are [date, priceThousandths, won]
 * for decided, priced, non-push bets on or after that sport's season start.
 * @returns {{ generatedAt: string, sports: Array<{ sport, seasonStart, walletCount, betCount, betsJson }> }}
 */
export function buildT5SeasonLedger(positions, { generatedAt = new Date().toISOString() } = {}) {
  const bySport = new Map();
  for (const bet of positions || []) {
    const row = trustTuple(bet);
    if (!row) continue;
    if (!bySport.has(row.sport)) bySport.set(row.sport, []);
    bySport.get(row.sport).push(row);
  }
  const sports = [];
  for (const [sport, rows] of bySport) {
    const start = seasonStartFromDates(rows.map((r) => r.date));
    const wallets = {};
    let betCount = 0;
    for (const row of rows) {
      if (start && row.date < start) continue;
      if (!wallets[row.id]) wallets[row.id] = [];
      wallets[row.id].push([row.date, row.price, row.won]);
      betCount += 1;
    }
    for (const id of Object.keys(wallets)) {
      wallets[id].sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
    }
    sports.push({
      sport,
      seasonStart: start,
      walletCount: Object.keys(wallets).length,
      betCount,
      betsJson: JSON.stringify(wallets),
    });
  }
  sports.sort((a, b) => a.sport.localeCompare(b.sport));
  return { generatedAt, sports };
}

/** Firestore docs, split when one sport's JSON would pass 800KB. */
export function t5LedgerDocs(built) {
  const MAX = 800000;
  const docs = [];
  for (const sport of built?.sports || []) {
    if (!sport.betsJson || sport.betsJson.length <= MAX) {
      docs.push({
        id: sport.sport,
        sport: sport.sport,
        seasonStart: sport.seasonStart,
        walletCount: sport.walletCount,
        betCount: sport.betCount,
        part: 0,
        parts: 1,
        betsJson: sport.betsJson,
        generatedAt: built.generatedAt,
      });
      continue;
    }
    const wallets = JSON.parse(sport.betsJson);
    const chunks = [];
    let cur = {};
    let size = 2;
    for (const id of Object.keys(wallets)) {
      const piece = JSON.stringify({ [id]: wallets[id] });
      if (size + piece.length > MAX && Object.keys(cur).length) {
        chunks.push(cur);
        cur = {};
        size = 2;
      }
      cur[id] = wallets[id];
      size += piece.length;
    }
    if (Object.keys(cur).length) chunks.push(cur);
    chunks.forEach((chunk, i) => {
      const betsJson = JSON.stringify(chunk);
      docs.push({
        id: `${sport.sport}_${i}`,
        sport: sport.sport,
        seasonStart: sport.seasonStart,
        walletCount: Object.keys(chunk).length,
        betCount: Object.values(chunk).reduce((n, rows) => n + rows.length, 0),
        part: i,
        parts: chunks.length,
        betsJson,
        generatedAt: built.generatedAt,
      });
    });
  }
  return docs;
}

export function hydrateT5SeasonLedger(docs) {
  const sports = {};
  for (const doc of docs || []) {
    const sport = String(doc?.sport || doc?.id || '').toUpperCase();
    if (!sport || typeof doc?.betsJson !== 'string') continue;
    let parsed = null;
    try { parsed = JSON.parse(doc.betsJson); } catch { parsed = null; }
    if (!parsed || typeof parsed !== 'object') continue;
    if (!sports[sport]) {
      sports[sport] = { seasonStart: doc.seasonStart || null, wallets: {} };
    }
    if (doc.seasonStart) sports[sport].seasonStart = doc.seasonStart;
    Object.assign(sports[sport].wallets, parsed);
  }
  return { sports };
}
