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
  mlFairOddsList,
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
  // Soccer / 3-way ML: include draw. 2-way sports stay home vs away.
  return mlFairOddsList(cur.home, cur.away, cur.draw, side);
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
  const row = {
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
  // Closing Dime gold-card combo. Only store true to keep the log compact.
  if (snap?.steam?.goldConfirmed) row.goldConfirmed = true;
  if (snap?.steam?.limitRising) row.limitRising = true;
  return row;
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

/** fair=0 American is a known sentinel bug — treat Ev on that row as null. */
export function cleanTapeEvPct(evPct, fairOdds) {
  if (Number(fairOdds) === 0) return null;
  const ev = Number(evPct);
  return Number.isFinite(ev) ? ev : null;
}

function cleanEvFromLogRow(row) {
  if (!row) return null;
  return cleanTapeEvPct(row.evPct, row.fair);
}

/**
 * first→current ticketEv drift for mid-window mute / analysis.
 * Prefers live capture for current; else t15 / last log row.
 * Returns null dEv when either endpoint is missing (fail-open).
 */
export function resolveTicketEvDrift(existingLog, liveSnap = null) {
  const rows = Array.isArray(existingLog) ? existingLog : [];
  const first = tapeLogRowAt(rows, 'first') || rows[0] || null;
  const firstEv = cleanEvFromLogRow(first);

  let currentEv = null;
  if (liveSnap && typeof liveSnap === 'object') {
    currentEv = cleanTapeEvPct(liveSnap.evPct, liveSnap.fairOdds);
  }
  if (currentEv == null) {
    const t15 = tapeLogRowAt(rows, 't15');
    const last = rows.length ? rows[rows.length - 1] : null;
    currentEv = cleanEvFromLogRow(t15 || last);
  }

  const dEv = (firstEv != null && currentEv != null)
    ? Math.round((currentEv - firstEv) * 10) / 10
    : null;
  return { firstEv, currentEv, dEv };
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
  const evFirst = cleanEvFromLogRow(first);
  const evLock = cleanEvFromLogRow(lock);
  return {
    n: rows.length,
    first,
    t60,
    t15,
    grade,
    last,
    lock,
    evFirst,
    evLock,
    dEvFirstToLock: (evFirst != null && evLock != null)
      ? Math.round((evLock - evFirst) * 10) / 10
      : null,
    lastHourFirst: first?.lastHourPct ?? null,
    lastHourLock: lock?.lastHourPct ?? null,
    sinceOpenFirst: first?.sinceOpenPct ?? null,
    sinceOpenLock: lock?.sinceOpenPct ?? null,
    steamOnFirst: steamOnRow(first),
    steamOnLock: steamOnRow(lock),
    goldFirst: first?.tier === 'gold',
    goldLock: lock?.tier === 'gold',
    goldConfirmedFirst: first?.goldConfirmed === true,
    goldConfirmedLock: lock?.goldConfirmed === true,
    limitRisingFirst: first?.limitRising === true,
    limitRisingLock: lock?.limitRising === true,
  };
}

function sideSteam(sd) {
  if (sd?.v8_steam && typeof sd.v8_steam === 'object') return sd.v8_steam;
  if (sd?.steam && typeof sd.steam === 'object') return sd.steam;
  return null;
}

function sideTapeLog(sd) {
  if (Array.isArray(sd?.v8_ticketTapeLog)) return sd.v8_ticketTapeLog;
  if (Array.isArray(sd?.ticketTapeLog)) return sd.ticketTapeLog;
  return [];
}

/**
 * Merge lifecycle log with the T-15 freeze scalar.
 * Older log rows omitted goldConfirmed / limitRising; `v8_steam` still has them.
 */
export function enrichTicketTapeFromSide(sd) {
  const log = sideTapeLog(sd);
  const steam = sideSteam(sd);
  const tape = analyzeTicketTapeLog(log);
  const ticketEvPct = Number.isFinite(sd?.v8_ticketEvPct)
    ? sd.v8_ticketEvPct
    : (Number.isFinite(sd?.ticketEvPct) ? sd.ticketEvPct : null);
  return {
    ticketEvPct,
    ticketTapeLog: log,
    steam,
    ticketTape: {
      ...tape,
      goldLock: !!(tape.goldLock || steam?.tier === 'gold'),
      goldConfirmedLock: !!(tape.goldConfirmedLock || steam?.goldConfirmed),
      limitRisingLock: !!(tape.limitRisingLock || steam?.limitRising),
      steamOnLock: !!(tape.steamOnLock || steam?.tier === 'steam' || steam?.tier === 'gold'),
    },
  };
}

/**
 * Closing Dime combo at lock:
 *   gold+limits  = GOLD steam (4.5%+) AND Pinnacle limits rising
 *   gold-flat    = GOLD steam, limits not rising
 *   steam        = steam event, not gold
 *   limits-only  = limits rising without a steam/gold tier
 *   none         = neither
 */
export function steamGoldLockLabel(tape, steam = null) {
  const goldConfirmed = !!(tape?.goldConfirmedLock || steam?.goldConfirmed);
  const gold = !!(tape?.goldLock || steam?.tier === 'gold');
  const steamOn = !!(tape?.steamOnLock || steam?.tier === 'steam' || steam?.tier === 'gold');
  const limits = !!(tape?.limitRisingLock || steam?.limitRising);
  if (goldConfirmed) return 'gold+limits';
  if (gold) return 'gold-flat';
  if (steamOn) return 'steam';
  if (limits) return 'limits-only';
  return 'none';
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
