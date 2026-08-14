/**
 * Instrument contract: ticket = vault Poly; tape = same-line books.
 * Five tickets: ML, run line, alt spread, total, alt total.
 * Usage: node tests/testTicketInstrument.mjs
 */
import assert from 'node:assert/strict';
import {
  americanFromPolyPrice,
  classifyFamily,
  classifyVariant,
  vaultTicket,
  vaultConsensusLine,
  tapeOnLine,
  tapeFromMeta,
  resolveInstrument,
  ticketAmerican,
} from '../src/lib/ticketInstrument.js';

assert.equal(americanFromPolyPrice(0.554), -124);
assert.equal(americanFromPolyPrice(0.27), 270);
assert.equal(classifyFamily('spread'), 'SPREAD');
assert.equal(classifyFamily('total'), 'TOTAL');
assert.equal(classifyFamily('ml'), 'ML');
assert.equal(classifyVariant('ML', null, null), 'MAIN');
assert.equal(classifyVariant('SPREAD', 1.5, 1.5), 'MAIN');
assert.equal(classifyVariant('SPREAD', -1.5, 1.5), 'ALT');
assert.equal(classifyVariant('TOTAL', 8.5, 9.5), 'ALT');
assert.equal(classifyVariant('TOTAL', 9.5, 9.5), 'MAIN');

const runLinePos = [{
  side: 'away', entryLine: 1.5, avgPrice: 0.554, invested: 1022,
}];
assert.equal(vaultConsensusLine(runLinePos, 'away', 'SPREAD'), 1.5);
assert.equal(vaultTicket(runLinePos, { side: 'away', line: 1.5, family: 'SPREAD' }).american, -124);
assert.equal(vaultTicket(runLinePos, { side: 'away', line: 1.5, family: 'SPREAD' }).cents, 55);

// 1) Run line MAIN — ticket Poly −124, tape −143 → −135, never +270
const pinnSpread = {
  fairSpreadBook: 'draftkings',
  spreadCurrent: { homeLine: -1.5, awayLine: 1.5, homeOdds: 119, awayOdds: -135, isMain: true },
  spreadOpener: { homeLine: -1.5, awayLine: 1.5, homeOdds: 119, awayOdds: -143, isMain: true },
  spreadHistory: [
    { t: 1, awayLine: 1.5, awayOdds: -143, homeLine: -1.5, homeOdds: 119, isMain: true },
    { t: 2, awayLine: 1.5, awayOdds: -135, homeLine: -1.5, homeOdds: 119, isMain: true },
    { t: 2, awayLine: 1, awayOdds: 210, homeLine: -1, homeOdds: -259 },
  ],
  spreadLines: [
    { homeLine: -1.5, awayLine: 1.5, homeOdds: 119, awayOdds: -135, isMain: true },
  ],
};
const run = resolveInstrument({
  family: 'SPREAD',
  side: 'away',
  positions: runLinePos,
  pinnGame: pinnSpread,
  stampedLine: 1.5,
});
assert.equal(run.variant, 'MAIN');
assert.equal(run.line, 1.5);
assert.equal(run.ticket.american, -124);
assert.equal(ticketAmerican(run, 270), -124, 'vault ticket beats stamped +270');
assert.equal(run.tape.open, -143);
assert.equal(run.tape.now, -135);
assert.ok(run.tape.series.every((p) => p.odds === -143 || p.odds === -135),
  `run-line tape must not mix alt +1 juice, got ${JSON.stringify(run.tape.series)}`);

// Complementary handicap in the same history must not leak into +1.5 tape.
const mixedTape = tapeOnLine({
  spreadHistory: [
    { t: 1, awayLine: 1.5, awayOdds: -143, homeLine: -1.5, homeOdds: 119, isMain: true },
    { t: 2, awayLine: -1.5, awayOdds: 256, homeLine: 1.5, homeOdds: -310 },
    { t: 3, awayLine: 1.5, awayOdds: -121, homeLine: -1.5, homeOdds: 105, isMain: true },
  ],
}, { family: 'SPREAD', side: 'away', line: 1.5 });
assert.equal(mixedTape.open, -143);
assert.equal(mixedTape.now, -121);
assert.ok(!mixedTape.series.some((p) => p.odds === 256));

// 2) Alt spread — Cardinals -1.5 vs book MAIN +1.5. Ticket Poly; tape empty (no borrow).
const altPos = [{
  side: 'home', entryLine: -1.5, avgPrice: 0.33, invested: 500,
}];
const alt = resolveInstrument({
  family: 'SPREAD',
  side: 'home',
  positions: altPos,
  pinnGame: {
    ...pinnSpread,
    spreadCurrent: { homeLine: 1.5, awayLine: -1.5, homeOdds: -158, awayOdds: 140, isMain: true },
    spreadLines: [
      { homeLine: 1.5, awayLine: -1.5, homeOdds: -158, awayOdds: 140, isMain: true },
    ],
    spreadHistory: [
      { t: 1, homeLine: 1.5, awayLine: -1.5, homeOdds: -158, awayOdds: 140, isMain: true },
    ],
  },
});
assert.equal(alt.variant, 'ALT');
assert.equal(alt.line, -1.5);
assert.equal(alt.mainLine, 1.5);
assert.equal(alt.ticket.american, 203);
assert.equal(alt.tape.now, null, 'must not borrow MAIN −158 onto alt −1.5');
assert.equal(alt.tape.series.length, 0);

// 3) ML — ticket from Poly, tape from ML history (not spread)
const ml = resolveInstrument({
  family: 'ML',
  side: 'away',
  positions: [{ side: 'away', avgPrice: 0.375, invested: 800 }],
  pinnGame: {
    fairBook: 'lowvig',
    current: { away: 160, home: -179 },
    opener: { away: 158, home: -175 },
    history: [
      { t: 1, away: 158, home: -175 },
      { t: 2, away: 160, home: -179 },
    ],
  },
});
assert.equal(ml.variant, 'MAIN');
assert.equal(ml.line, null);
assert.equal(ml.ticket.american, 167);
assert.equal(ml.tape.open, 158);
assert.equal(ml.tape.now, 160);

// 4) Main total
const totPos = [{ side: 'over', entryLine: 8.5, avgPrice: 0.519, invested: 400 }];
const totPinn = {
  fairTotalBook: 'pinnacle',
  totalCurrent: { line: 8.5, overOdds: -108, underOdds: -108, isMain: true },
  totalOpener: { line: 8.5, overOdds: -102, underOdds: -118, isMain: true },
  totalHistory: [
    { t: 1, line: 8.5, overOdds: -102, underOdds: -118, isMain: true },
    { t: 2, line: 8.5, overOdds: -108, underOdds: -108, isMain: true },
    { t: 2, line: 9.5, overOdds: 172, underOdds: -212 },
  ],
  totalLines: [
    { line: 8.5, overOdds: -108, underOdds: -108, isMain: true },
  ],
};
const tot = resolveInstrument({
  family: 'TOTAL',
  side: 'over',
  positions: totPos,
  pinnGame: totPinn,
});
assert.equal(tot.variant, 'MAIN');
assert.equal(tot.line, 8.5);
assert.equal(tot.ticket.american, -108);
assert.equal(tot.tape.now, -108);
assert.ok(tot.tape.series.every((p) => p.odds === -102 || p.odds === -108));

// 5) Alt total — vault 8.5 vs MAIN 9.5. Tape only if history has 8.5.
const altTot = resolveInstrument({
  family: 'TOTAL',
  side: 'over',
  positions: totPos,
  pinnGame: {
    fairTotalBook: 'pinnacle',
    totalCurrent: { line: 9.5, overOdds: 114, underOdds: -133, isMain: true },
    totalHistory: [
      { t: 1, line: 9.5, overOdds: 110, underOdds: -130, isMain: true },
      { t: 1, line: 8.5, overOdds: -102, underOdds: -118 },
      { t: 2, line: 8.5, overOdds: -108, underOdds: -108 },
    ],
    totalLines: [
      { line: 9.5, overOdds: 114, underOdds: -133, isMain: true },
      { line: 8.5, overOdds: -108, underOdds: -108 },
    ],
  },
});
assert.equal(altTot.variant, 'ALT');
assert.equal(altTot.line, 8.5);
assert.equal(altTot.mainLine, 9.5);
assert.equal(altTot.ticket.american, -108);
assert.equal(altTot.tape.now, -108, 'alt tape uses 8.5 prints, not MAIN 9.5 +114');
assert.ok(!altTot.tape.series.some((p) => p.odds === 114));

// Cron meta: MAIN match → tape; ALT mismatch → empty tape
const metaTape = tapeFromMeta({
  spreadCurrent: { awayLine: 1.5, awayOdds: -135, homeLine: -1.5, homeOdds: 119 },
  fairSpreadBook: 'draftkings',
}, { family: 'SPREAD', side: 'away', line: 1.5 });
assert.equal(metaTape.now, -135);
const metaAlt = tapeFromMeta({
  spreadCurrent: { awayLine: -1.5, awayOdds: 140, homeLine: 1.5, homeOdds: -158 },
}, { family: 'SPREAD', side: 'home', line: -1.5 });
assert.equal(metaAlt.now, null);

console.log('testTicketInstrument: ok');
