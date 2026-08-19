/**
 * Frozen ticket tape for analysis: card EV + Pinnacle steam.
 * Tracking only — does not size units.
 *
 * EV is flagged ticket vs same-line no-vig fair (Over 8.5 −100 vs −113 → +3.1%).
 * Steam is last-hour / since-open decimal drop (6.4% open, 3.9% 1h).
 *
 * v16: `v8_ticketTapeLog` / Action `ticketTapeLog` is a compact lifecycle
 * (first, hourly, t60, t15, grade) so steam/EV can be analyzed vs W/L and CLV.
 * Latest scalars still overwrite each cycle; the log is the path.
 */

import { linesClose } from './pinnacleMain.js';
import {
  evPctVsFairProb,
  fairProbFromNoVig,
  noVigFairAmerican,
} from './oddsEv.js';
import { compactSteam, summarizeSteam } from './steamMove.js';

function twoWay(us, them) {
  if (!Number.isFinite(us) || !Number.isFinite(them)) return null;
  return [us, them];
}

export function fairPairFromPinnGame(pinnGame, {
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
} = {}) {
  if (!pinnGame) return null;
  const mt = String(marketType || 'ml').toLowerCase();
  const side = String(sideNorm || '').toLowerCase();

  if (mt === 'total') {
    const rows = [
      ...(Array.isArray(pinnGame.totalLines) ? pinnGame.totalLines : []),
      pinnGame.totalCurrent,
    ].filter(Boolean);
    const row = Number.isFinite(Number(line))
      ? rows.find((r) => Math.abs(Number(r.line) - Number(line)) <= 0.051)
      : (rows.find((r) => r.isMain) || pinnGame.totalCurrent);
    if (!row) return null;
    return (side === 'under' || side === 'away')
      ? twoWay(row.underOdds, row.overOdds)
      : twoWay(row.overOdds, row.underOdds);
  }

  if (mt === 'spread') {
    const rows = [
      ...(Array.isArray(pinnGame.spreadLines) ? pinnGame.spreadLines : []),
      pinnGame.spreadCurrent,
    ].filter(Boolean);
    const row = Number.isFinite(Number(line))
      ? rows.find((r) => {
        const ln = side === 'away' ? Number(r.awayLine) : Number(r.homeLine);
        return linesClose(ln, line);
      })
      : (rows.find((r) => r.isMain) || pinnGame.spreadCurrent);
    if (!row) return null;
    return side === 'away'
      ? twoWay(row.awayOdds, row.homeOdds)
      : twoWay(row.homeOdds, row.awayOdds);
  }

  const cur = pinnGame.current || pinnGame.opener;
  if (!cur) return null;
  if (side === 'draw' && Number.isFinite(cur.draw)
      && Number.isFinite(cur.away) && Number.isFinite(cur.home)) {
    return [cur.draw, cur.away, cur.home];
  }
  return side === 'away'
    ? twoWay(cur.away, cur.home)
    : twoWay(cur.home, cur.away);
}

export function captureTicketTape({
  pinnGame = null,
  marketType = 'ml',
  sideNorm = 'home',
  line = null,
  offerOdds = null,
  commenceMs = null,
  nowMs = Date.now(),
} = {}) {
  const pair = fairPairFromPinnGame(pinnGame, { marketType, sideNorm, line });
  const fairProb = pair ? fairProbFromNoVig(pair, 0) : null;
  const fairOdds = pair ? noVigFairAmerican(pair, 0) : null;
  const evPct = (fairProb != null && Number.isFinite(Number(offerOdds)))
    ? evPctVsFairProb(offerOdds, fairProb)
    : null;

  const steamSummary = pinnGame
    ? summarizeSteam(pinnGame, {
      marketType,
      sideNorm,
      line,
      nowSec: Math.floor(Number(nowMs) / 1000),
      freezeAtMs: commenceMs,
    })
    : null;
  const steam = compactSteam(steamSummary);

  return {
    evPct: Number.isFinite(evPct) ? evPct : null,
    fairOdds: Number.isFinite(fairOdds) ? fairOdds : null,
    fairProb: Number.isFinite(fairProb) ? fairProb : null,
    offerOdds: Number.isFinite(Number(offerOdds)) ? Number(offerOdds) : null,
    steam,
  };
}

/** Hours from now until commence. Negative after first pitch. */
export function hoursUntilMs(commenceMs, nowMs = Date.now()) {
  const c = Number(commenceMs);
  const n = Number(nowMs);
  if (!Number.isFinite(c) || !Number.isFinite(n)) return null;
  return (c - n) / 3_600_000;
}

const TICKET_TAPE_LOG_MAX = 24;
const T60_HOURS = 1.0;
const T15_HOURS = 0.40; // ~24 min — last cycles before T-15 freeze (0.25h)

export function compactTapeLogRow(snap, {
  at,
  gate,
  hoursUntilGame = null,
} = {}) {
  const hut = Number.isFinite(Number(hoursUntilGame)) ? Number(hoursUntilGame) : null;
  return {
    at: at || new Date().toISOString(),
    gate,
    hoursOut: hut != null ? Math.round(hut * 100) / 100 : null,
    evPct: Number.isFinite(snap?.evPct) ? snap.evPct : null,
    fair: Number.isFinite(snap?.fairOdds) ? snap.fairOdds : null,
    offer: Number.isFinite(snap?.offerOdds) ? snap.offerOdds : null,
    lastHourPct: snap?.steam?.lastHourPct ?? null,
    sinceOpenPct: snap?.steam?.sinceOpenPct ?? null,
    tier: snap?.steam?.tier ?? null,
  };
}

function hasGate(log, gate) {
  return Array.isArray(log) && log.some((e) => e && e.gate === gate);
}

function hourKey(iso) {
  if (!iso) return null;
  return String(iso).slice(0, 13); // YYYY-MM-DDTHH UTC
}

/** Named + hourly gates due this cycle (never every 4-min fetch). */
export function nextTapeLogGates(existingLog, {
  nowMs = Date.now(),
  hoursUntilGame = null,
  isGrade = false,
} = {}) {
  const log = Array.isArray(existingLog) ? existingLog : [];
  if (isGrade) return hasGate(log, 'grade') ? [] : ['grade'];

  const gates = [];
  if (log.length === 0) gates.push('first');

  const hut = Number.isFinite(Number(hoursUntilGame)) ? Number(hoursUntilGame) : null;
  if (hut != null && hut > 0) {
    // First sample inside 60 / 24 min. hoursOut on the row is the true distance.
    if (hut <= T60_HOURS && !hasGate(log, 't60')) gates.push('t60');
    if (hut <= T15_HOURS && !hasGate(log, 't15')) gates.push('t15');
  }

  const hk = hourKey(new Date(nowMs).toISOString());
  const alreadyThisHour = log.some((e) => hourKey(e?.at) === hk)
    || gates.includes('first') || gates.includes('t60') || gates.includes('t15');
  if (!alreadyThisHour && log.length > 0) gates.push('hourly');
  return gates;
}

export function tapeLogNeedsAppend(existingLog, opts = {}) {
  return nextTapeLogGates(existingLog, opts).length > 0;
}

function trimTicketTapeLog(log, max = TICKET_TAPE_LOG_MAX) {
  if (!Array.isArray(log) || log.length <= max) return Array.isArray(log) ? log : [];
  const hourlyIdx = [];
  log.forEach((e, i) => { if (e?.gate === 'hourly') hourlyIdx.push(i); });
  const dropHourly = Math.min(log.length - max, hourlyIdx.length);
  const drop = new Set(hourlyIdx.slice(0, dropHourly));
  let next = log.filter((_, i) => !drop.has(i));
  while (next.length > max) {
    const i = next.findIndex((e) => e?.gate === 'hourly' || e?.gate === 't60');
    if (i < 0) break;
    next.splice(i, 1);
  }
  return next;
}

/** Append compact steam/EV samples. Named gates once; hourly once per UTC hour. */
export function appendTicketTapeLog(existingLog, snap, {
  nowMs = Date.now(),
  hoursUntilGame = null,
  isGrade = false,
  max = TICKET_TAPE_LOG_MAX,
} = {}) {
  const log = Array.isArray(existingLog) ? existingLog.slice() : [];
  const gates = nextTapeLogGates(log, { nowMs, hoursUntilGame, isGrade });
  if (gates.length === 0) return log;
  const at = new Date(nowMs).toISOString();
  for (const gate of gates) {
    log.push(compactTapeLogRow(snap, { at, gate, hoursUntilGame }));
  }
  return trimTicketTapeLog(log, max);
}

export function tapeLogRowAt(log, gate) {
  if (!Array.isArray(log) || !gate) return null;
  return log.find((e) => e && e.gate === gate) || null;
}

function steamOnRow(row) {
  const t = row?.tier;
  return t === 'steam' || t === 'gold';
}

function delta(a, b) {
  if (!Number.isFinite(Number(a)) || !Number.isFinite(Number(b))) return null;
  return Math.round((Number(b) - Number(a)) * 10) / 10;
}

/** First vs lock (t15, else last) for W/L and CLV analysis. */
export function analyzeTicketTapeLog(log) {
  const rows = Array.isArray(log) ? log : [];
  const first = tapeLogRowAt(rows, 'first') || rows[0] || null;
  const t60 = tapeLogRowAt(rows, 't60');
  const t15 = tapeLogRowAt(rows, 't15');
  const grade = tapeLogRowAt(rows, 'grade');
  const last = rows.length ? rows[rows.length - 1] : null;
  const lock = t15 || last;
  return {
    n: rows.length,
    first,
    t60,
    t15,
    grade,
    last,
    lock,
    evFirst: first?.evPct ?? null,
    evLock: lock?.evPct ?? null,
    dEvFirstToLock: delta(first?.evPct, lock?.evPct),
    lastHourFirst: first?.lastHourPct ?? null,
    lastHourLock: lock?.lastHourPct ?? null,
    sinceOpenFirst: first?.sinceOpenPct ?? null,
    sinceOpenLock: lock?.sinceOpenPct ?? null,
    steamOnFirst: steamOnRow(first),
    steamOnLock: steamOnRow(lock),
    goldFirst: first?.tier === 'gold',
    goldLock: lock?.tier === 'gold',
  };
}

/** Write analysis stamps onto a pick side (mutates target). */
export function applyTicketTapeStamps(target, snap, {
  existingLog = null,
  nowMs = Date.now(),
  hoursUntilGame = null,
  isGrade = false,
} = {}) {
  if (!target || !snap) return target;
  target.v8_ticketEvPct = Number.isFinite(snap.evPct) ? snap.evPct : null;
  target.v8_ticketEvFair = Number.isFinite(snap.fairOdds) ? snap.fairOdds : null;
  target.v8_ticketEvOffer = Number.isFinite(snap.offerOdds) ? snap.offerOdds : null;
  target.v8_steam = snap.steam || null;
  target.v8_steamLastHourPct = snap.steam?.lastHourPct ?? null;
  target.v8_steamSinceOpenPct = snap.steam?.sinceOpenPct ?? null;
  target.v8_steamTier = snap.steam?.tier ?? null;
  const prev = existingLog ?? target.v8_ticketTapeLog ?? null;
  target.v8_ticketTapeLog = appendTicketTapeLog(prev, snap, {
    nowMs,
    hoursUntilGame,
    isGrade,
  });
  return target;
}

/** Action docs use unprefixed ticketEv* / steam / ticketTapeLog. */
export function applyActionTicketTape(target, snap, {
  existingLog = null,
  nowMs = Date.now(),
  hoursUntilGame = null,
  isGrade = false,
} = {}) {
  if (!target || !snap) return target;
  target.ticketEvPct = Number.isFinite(snap.evPct) ? snap.evPct : null;
  target.ticketEvFair = Number.isFinite(snap.fairOdds) ? snap.fairOdds : null;
  target.ticketEvOffer = Number.isFinite(snap.offerOdds) ? snap.offerOdds : null;
  target.steam = snap.steam || null;
  const prev = existingLog ?? target.ticketTapeLog ?? null;
  target.ticketTapeLog = appendTicketTapeLog(prev, snap, {
    nowMs,
    hoursUntilGame,
    isGrade,
  });
  return target;
}
