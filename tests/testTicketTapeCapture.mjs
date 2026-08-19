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

console.log(`testTicketTapeCapture: ${n} assertions passed`);
