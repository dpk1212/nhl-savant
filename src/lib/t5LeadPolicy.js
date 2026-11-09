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
 * The stake stays where the card put it. Each seat has a floor and a
 * ceiling. A 14-day lead under 3 goes to 3 and over 6 comes back to 6.
 * A 6-day lead (not yet 14) sits one unit under that band. Gold is
 * stricter than the 14-day seat: at least one wallet held 14 or more
 * on our side, and the other side has zero qualifying tier 5s of any
 * hold. A 14-day or 6-day margin (held-14/held-6 counts, ours minus
 * theirs ≥ 1) plus winner-align edge of 11 or more adds 1 unit. The
 * seat ceiling does not eat that add. Odds cap runs after the add, so
 * a long dog can still sit under its floor. Rescues stay at 1 unit —
 * the floor does not lift them, and the add does not either.
 * Press-edge-net zeros come back at 1u (T5-LEAD) on a 6/14-day lead
 * or when neither side has a tier 5; a tier 5 that has not held 6
 * days stays muted. From 2026-11-08. A frozen, graded, manual, or
 * killed side is not rewritten here — the caller keeps those gates.
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
export const T5_RESCUE_UNITS = 1;
export const T5_EDGE_BOOST_MIN = 11;
export const T5_EDGE_BOOST_UNITS = 1;
export const T5_LEAD_STAKE_TIER = 'T5-LEAD';
export const T5_GOLD_TIP = '14-day tier-5 lead · nobody tier 5 against';
export const T5_LEDGER_COLLECTION = 't5SeasonLedger';
export const T5_ON = new Set(['STABLE_ON', 'REGAINED_ON']);
export const T5_SEAT_LEAD14 = { id: 'lead14', floor: 3, ceiling: 6 };
export const T5_SEAT_LEAD6 = { id: 'lead6', floor: 2, ceiling: 5 };
export const T5_SEAT_YOUNG = { id: 't5_young', floor: 2, ceiling: 3 };
export const T5_SEAT_NO_T5 = { id: 'no_t5', floor: null, ceiling: 2 };
export const T5_SEAT_NO_LEAD = { id: 'no_lead', floor: null, ceiling: 2 };
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
  if (!book) {
    return {
      f: 0, a: 0, lead: false, hold: null, holdAgainst: null, holdWallet: null,
      wallets: [], seasonStart: null, ledger: false,
      for14: 0, ag14: 0, for6: 0, ag6: 0,
    };
  }
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
  const theirQ = [];
  for (const id of theirs) {
    const cacheKey = `hold|${sport}|${id}|${day}`;
    const held = holdCache.has(cacheKey) ? holdCache.get(cacheKey) : qualify(id);
    if (held.qualifies) theirQ.push({ id, held: held.held });
  }
  let hold = null;
  let holdWallet = null;
  for (const w of ourQ) {
    if (hold == null || w.held > hold || (w.held === hold && w.id < holdWallet)) {
      hold = w.held;
      holdWallet = w.id;
    }
  }
  let holdAgainst = null;
  for (const w of theirQ) {
    if (holdAgainst == null || w.held > holdAgainst) holdAgainst = w.held;
  }
  const f = ourQ.length;
  const against = theirQ.length;
  const heldN = (arr, min) => arr.filter((w) => w.held != null && w.held >= min).length;
  return {
    f,
    a: against,
    lead: f - against >= 1,
    hold,
    holdAgainst,
    holdWallet,
    wallets: ourQ.map((w) => w.id).sort(),
    seasonStart: book.seasonStart || null,
    ledger: true,
    for14: heldN(ourQ, T5_HOLD_LONG),
    ag14: heldN(theirQ, T5_HOLD_LONG),
    for6: heldN(ourQ, T5_HOLD_BOOST),
    ag6: heldN(theirQ, T5_HOLD_BOOST),
  };
}

/** 14-day T5 on our side, nobody T5 on the other side. Stricter than lead14. */
export function t5GoldLead(lead) {
  if (!lead || lead.ledger !== true) return false;
  return (lead.for14 || 0) >= 1 && (lead.a || 0) === 0;
}

/**
 * 14-day margin: held-14 wallets on our side exceed the other side by ≥ 1.
 * 6-day margin: held-6 wallets do, and it is not already a 14-day margin.
 * Somebody T5 on the other side does not block a margin.
 */
export function t5MarginKind(lead) {
  if (!lead || lead.ledger !== true) return null;
  if ((lead.for14 || 0) - (lead.ag14 || 0) >= 1) return 'lead14';
  if ((lead.for6 || 0) - (lead.ag6 || 0) >= 1) return 'lead6';
  return null;
}

/** Seat for the side. A missing ledger is not a seat. */
export function t5Seat(lead) {
  if (!lead || lead.ledger === false) return null;
  const hold = lead.hold;
  const f = lead.f || 0;
  const a = lead.a || 0;
  const weLead = lead.lead === true;
  if (weLead && hold != null && hold >= T5_HOLD_LONG) return T5_SEAT_LEAD14;
  if (weLead && hold != null && hold >= T5_HOLD_BOOST) return T5_SEAT_LEAD6;
  if (weLead && f > 0) return T5_SEAT_YOUNG;
  if (f === 0 && a === 0) return T5_SEAT_NO_T5;
  return T5_SEAT_NO_LEAD;
}

/** False when the season book is loaded and the other side has no tier 5. */
export function t5OppHasT5(lead) {
  if (!lead || lead.ledger !== true) return null;
  return (lead.a || 0) > 0;
}

function clampSeat(units, seat, { floor = true } = {}) {
  let next = units;
  if (floor && seat.floor != null && next > 0 && next < seat.floor) next = seat.floor;
  if (seat.ceiling != null && next > seat.ceiling) next = seat.ceiling;
  return Math.round(next * 100) / 100;
}

function withGoldAndBoost(core, { winnerAlignEdge, fromRescue, manual } = {}) {
  const lead = core.lead;
  const edge = Number(winnerAlignEdge);
  const hasEdge = winnerAlignEdge != null && Number.isFinite(edge);
  const unitsPreEdgeBoost = core.units;
  let edgeBoost = 0;
  let units = core.units;
  const skipBoost = manual === true
    || core.action === 'RESCUE'
    || core.action === 'EXEMPT'
    || fromRescue === true;
  const margin = t5MarginKind(lead);
  if (!skipBoost && units > 0 && margin && hasEdge && edge >= T5_EDGE_BOOST_MIN) {
    edgeBoost = T5_EDGE_BOOST_UNITS;
    units = Math.round((units + edgeBoost) * 100) / 100;
  }
  return {
    ...core,
    units,
    gold: units > 0 && t5GoldLead(lead),
    margin,
    edgeBoost,
    unitsPreEdgeBoost,
    edgeBoostEdge: hasEdge ? edge : null,
  };
}

/**
 * @returns {{
 *   units: number, action: 'BAND'|'RESCUE'|'PASS'|'EXEMPT', add: number,
 *   tier: string|null, reason: string|null, lead: object|null, price: number|null,
 *   seat: object|null, gold: boolean, margin: string|null, edgeBoost: number,
 *   unitsPreEdgeBoost: number, edgeBoostEdge: number|null,
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
  fromRescue = false,
  winnerAlignEdge = null,
} = {}) {
  const pre = Number.isFinite(Number(units)) ? Math.max(0, Number(units)) : 0;
  if (typeof pickDate !== 'string' || pickDate < T5_LEAD_FROM) {
    return {
      units: pre, action: 'EXEMPT', add: 0, tier: null, reason: 'pre_cutover',
      lead: null, price: null, seat: null, gold: false, margin: null,
      edgeBoost: 0, unitsPreEdgeBoost: pre, edgeBoostEdge: null,
    };
  }
  const lead = t5LeadForSide({ walletDetails, side, sport, asOf: pickDate });
  const price = impliedFromAmerican(odds);
  const seat = t5Seat(lead);
  const base = { lead, price, seat };
  const finish = (core) => withGoldAndBoost(core, { winnerAlignEdge, fromRescue, manual });
  if (manual) {
    return finish({ ...base, units: pre, action: 'PASS', add: 0, tier: null, reason: 'manual' });
  }
  const held = lead.hold;
  const armed = lead.ledger === true && lead.lead === true && held != null && held >= T5_HOLD_BOOST;
  const noT5 = lead.ledger === true && (lead.f || 0) === 0 && (lead.a || 0) === 0;
  if (pre > 0 && seat) {
    const next = clampSeat(pre, seat, { floor: fromRescue !== true });
    if (next !== pre) {
      return finish({
        ...base,
        units: next,
        action: 'BAND',
        add: Math.round((next - pre) * 100) / 100,
        tier: null,
        reason: fromRescue ? 't5_seat_ceil' : 't5_seat_band',
      });
    }
    return finish({ ...base, units: pre, action: 'PASS', add: 0, tier: null, reason: null });
  }
  if (!(pre > 0) && pressEdgeMuted && !blocked && (armed || noT5)) {
    return finish({
      ...base,
      units: T5_RESCUE_UNITS,
      action: 'RESCUE',
      add: T5_RESCUE_UNITS,
      tier: T5_LEAD_STAKE_TIER,
      reason: armed ? 't5_lead_rescue' : 't5_no_t5_rescue',
    });
  }
  return finish({
    ...base,
    units: blocked && !(pre > 0) ? 0 : pre,
    action: 'PASS',
    add: 0,
    tier: null,
    reason: blocked && !(pre > 0) ? 'muted' : null,
  });
}

export function t5LeadStamp(policy) {
  if (!policy || policy.action === 'EXEMPT') return {};
  const lead = policy.lead || {};
  const seat = policy.seat || null;
  return {
    v8_t5LeadAction: policy.action,
    v8_t5LeadAdd: policy.add || 0,
    v8_t5LeadFor: lead.f ?? 0,
    v8_t5LeadAg: lead.a ?? 0,
    v8_t5LeadHold: lead.hold ?? null,
    v8_t5LeadHoldAg: lead.holdAgainst ?? null,
    v8_t5LeadHoldWallet: lead.holdWallet ?? null,
    v8_t5LeadWallets: Array.isArray(lead.wallets) ? lead.wallets : [],
    v8_t5LeadUnits: policy.units,
    v8_t5LeadReason: policy.reason ?? null,
    v8_t5LeadSeat: seat?.id ?? null,
    v8_t5LeadFloor: seat?.floor ?? null,
    v8_t5LeadCeiling: seat?.ceiling ?? null,
    v8_t5LeadFor14: lead.for14 ?? 0,
    v8_t5LeadAg14: lead.ag14 ?? 0,
    v8_t5LeadFor6: lead.for6 ?? 0,
    v8_t5LeadAg6: lead.ag6 ?? 0,
    v8_gold: policy.gold === true,
    v8_edgeBoost: policy.edgeBoost || 0,
    v8_unitsPreEdgeBoost: Number.isFinite(policy.unitsPreEdgeBoost) ? policy.unitsPreEdgeBoost : null,
    v8_edgeBoostEdge: Number.isFinite(policy.edgeBoostEdge) ? policy.edgeBoostEdge : null,
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
