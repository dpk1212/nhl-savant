/**
 * Ticket EV + steam capture — same numbers the Locked card paints.
 * Usage: node tests/testTicketTapeCapture.mjs
 */
import assert from 'assert';
import {
  evPctVsFairProb,
  fairProbFromNoVig,
  noVigFairAmerican,
} from '../src/lib/oddsEv.js';
import {
  captureTicketTape,
  applyTicketTapeStamps,
  fairPairFromPinnGame,
  appendTicketTapeLog,
  nextTapeLogGates,
  analyzeTicketTapeLog,
  applyActionTicketTape,
  hoursUntilMs,
} from '../src/lib/ticketTapeCapture.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

// Card: Over 8.5 −100 vs fair −113 → +3.1% EV. Steam 6.4% since open (−106 → −122).
const phiTotals = {
  commence: '2026-08-19T22:05:00Z',
  totalOpener: { t: 1787135711, line: 8.5, overOdds: -106, underOdds: -108, max: 1875 },
  totalCurrent: { line: 9, overOdds: 105, underOdds: -118, max: 7500, isMain: true },
  totalHistory: [
    { t: 1787135711, line: 8.5, overOdds: -106, underOdds: -108, max: 1875, isMain: true },
    { t: 1787169694, line: 8.5, overOdds: -122, underOdds: 106, max: 7500, isMain: false },
    { t: 1787169694, line: 9, overOdds: 105, underOdds: -118, max: 7500, isMain: true },
  ],
  totalLines: [
    { line: 8.5, overOdds: -122, underOdds: 106, max: 7500, isMain: false },
    { line: 9, overOdds: 105, underOdds: -118, max: 7500, isMain: true },
  ],
};

const pair = fairPairFromPinnGame(phiTotals, { marketType: 'total', sideNorm: 'over', line: 8.5 });
ok(pair && pair[0] === -122 && pair[1] === 106, 'fair pair is the 8.5 line, not live main 9');
ok(noVigFairAmerican(pair, 0) === -113, 'no-vig fair on 8.5 Over is −113');
ok(evPctVsFairProb(-100, fairProbFromNoVig(pair, 0)) === 3.1, 'flagged −100 vs −113 fair is +3.1% EV');

const nowMs = Date.parse('2026-08-19T20:10:00Z');
const snap = captureTicketTape({
  pinnGame: phiTotals,
  marketType: 'total',
  sideNorm: 'over',
  line: 8.5,
  offerOdds: -100,
  commenceMs: Date.parse(phiTotals.commence),
  nowMs,
});
ok(snap.evPct === 3.1, `card EV stamped ${snap.evPct}`);
ok(snap.fairOdds === -113, `fair stamped ${snap.fairOdds}`);
ok(snap.offerOdds === -100, 'offer is the flagged ticket');
ok(snap.steam?.sinceOpenPct >= 6.3 && snap.steam.sinceOpenPct <= 6.5, `steam open ${snap.steam?.sinceOpenPct}%`);
ok(snap.steam?.tier === 'gold' || snap.steam?.tier === 'steam', `steam tier ${snap.steam?.tier}`);

const doc = {};
applyTicketTapeStamps(doc, snap);
ok(doc.v8_ticketEvPct === 3.1, 'side stamp v8_ticketEvPct');
ok(doc.v8_ticketEvFair === -113, 'side stamp v8_ticketEvFair');
ok(doc.v8_steamSinceOpenPct === snap.steam.sinceOpenPct, 'side stamp steam since-open');
ok(doc.v8_steam != null, 'side stamp compact steam object');
ok(Array.isArray(doc.v8_ticketTapeLog) && doc.v8_ticketTapeLog[0]?.gate === 'first', 'first lifecycle row on stamp');
ok(doc.v8_ticketTapeLog[0].evPct === 3.1, 'first row stores card EV');

// Wrong line must not borrow main-9 juice.
const mainSnap = captureTicketTape({
  pinnGame: phiTotals,
  marketType: 'total',
  sideNorm: 'over',
  line: 9,
  offerOdds: 105,
  nowMs,
});
ok(mainSnap.evPct !== 3.1, 'main 9 +105 is not the 8.5 ticket EV');

const empty = captureTicketTape({});
ok(empty.evPct == null && empty.steam == null, 'missing tape does not invent EV or steam');

ok(hoursUntilMs(nowMs + 3_600_000, nowMs) === 1, 'hoursUntilMs is 1.0 at T-60');
ok(nextTapeLogGates([], { nowMs, hoursUntilGame: 5 }).join() === 'first', 'open capture is first only');
ok(nextTapeLogGates([], { nowMs, hoursUntilGame: 0.9 }).join() === 'first,t60', 'inside 60 min stamps first+t60');
ok(nextTapeLogGates([], { nowMs, hoursUntilGame: 0.3 }).join() === 'first,t60,t15', 'inside 24 min stamps first+t60+t15');

const t0 = Date.parse('2026-08-19T12:00:00Z');
let life = appendTicketTapeLog([], snap, { nowMs: t0, hoursUntilGame: 10 });
ok(life.length === 1 && life[0].gate === 'first', 'first append');
const sameHour = appendTicketTapeLog(life, snap, { nowMs: t0 + 10 * 60 * 1000, hoursUntilGame: 9.8 });
ok(sameHour.length === 1, 'same UTC hour does not append');
life = appendTicketTapeLog(life, snap, { nowMs: t0 + 60 * 60 * 1000, hoursUntilGame: 9 });
ok(life.length === 2 && life[1].gate === 'hourly', 'next hour appends hourly');
life = appendTicketTapeLog(life, { ...snap, evPct: 2.0, steam: { ...snap.steam, lastHourPct: 3.9, tier: 'steam' } }, {
  nowMs: t0 + 9 * 60 * 60 * 1000,
  hoursUntilGame: 0.9,
});
ok(life.some((e) => e.gate === 't60'), 't60 gate once inside 60 min');
ok(life.filter((e) => e.gate === 't60').length === 1, 't60 is not duplicated');
life = appendTicketTapeLog(life, { ...snap, evPct: 1.2 }, {
  nowMs: t0 + 9.7 * 60 * 60 * 1000,
  hoursUntilGame: 0.3,
});
ok(life.some((e) => e.gate === 't15'), 't15 gate once inside 24 min');
life = appendTicketTapeLog(life, { ...snap, evPct: 0.8 }, {
  nowMs: t0 + 12 * 60 * 60 * 1000,
  hoursUntilGame: -2,
  isGrade: true,
});
ok(life.some((e) => e.gate === 'grade'), 'grade gate at settle');
ok(appendTicketTapeLog(life, snap, { isGrade: true }).filter((e) => e.gate === 'grade').length === 1, 'grade is not duplicated');

let fat = [];
for (let i = 0; i < 40; i++) {
  fat = appendTicketTapeLog(fat, snap, {
    nowMs: t0 + i * 60 * 60 * 1000,
    hoursUntilGame: 40 - i,
    max: 24,
  });
}
fat = appendTicketTapeLog(fat, snap, {
  nowMs: t0 + 41 * 60 * 60 * 1000,
  hoursUntilGame: 0.3,
  max: 24,
});
ok(fat.length <= 24, `trim caps at 24 (got ${fat.length})`);
ok(fat[0].gate === 'first', 'trim keeps first');
ok(fat.some((e) => e.gate === 't15'), 'trim keeps t15');

const ax = analyzeTicketTapeLog(life);
ok(ax.steamOnFirst === true, 'steam was on at first');
ok(ax.evFirst === 3.1 && ax.evLock === 1.2, `first vs lock EV ${ax.evFirst} → ${ax.evLock}`);
ok(ax.dEvFirstToLock === -1.9, 'EV faded from first to t15');
ok(ax.t15.hoursOut === 0.3, 't15 hoursOut is true distance');

const actionDoc = {};
applyActionTicketTape(actionDoc, snap, { nowMs: t0, hoursUntilGame: 8 });
ok(actionDoc.ticketEvPct === 3.1 && actionDoc.ticketTapeLog[0].gate === 'first', 'Action doc log is unprefixed');

console.log(`testTicketTapeCapture: ${n} assertions passed`);
