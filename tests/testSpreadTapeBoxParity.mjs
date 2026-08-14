/**
 * Locked-card PIN/NOW must be the same-side tape as the chart.
 * Cardinals +1.5 must never borrow Cardinals −1.5 / Cubs +1.5 juice (+256).
 * Usage: node tests/testSpreadTapeBoxParity.mjs
 */
import assert from 'node:assert/strict';
import {
  extractMarketPath,
  spreadRowOnTicketLine,
} from '../src/lib/marketAgreement.js';
import { tapeOnLine } from '../src/lib/ticketInstrument.js';
import { mapLockedPickToCardFixture } from '../src/components/sharpFlow/cards/mapPositionCard.js';

assert.equal(spreadRowOnTicketLine({ awayLine: 1.5, homeLine: -1.5 }, true, 1.5), true);
assert.equal(spreadRowOnTicketLine({ awayLine: -1.5, homeLine: 1.5 }, true, 1.5), false,
  'home +1.5 is not the away +1.5 ticket');
assert.equal(spreadRowOnTicketLine({ awayLine: -1.5, homeLine: 1.5 }, false, 1.5), true);

const mixedGame = {
  fairSpreadBook: 'pinnacle',
  maxSpread: 7500,
  spreadCurrent: {
    homeLine: -1.5, awayLine: 1.5, homeOdds: 105, awayOdds: -121, isMain: true, max: 7500,
  },
  spreadOpener: {
    homeLine: -1.5, awayLine: 1.5, homeOdds: 119, awayOdds: -143, isMain: true, max: 7500,
  },
  spreadHistory: [
    { t: 1, awayLine: 1.5, awayOdds: -143, homeLine: -1.5, homeOdds: 119, isMain: true, max: 7500 },
    { t: 2, awayLine: 1.5, awayOdds: -135, homeLine: -1.5, homeOdds: 119, isMain: true, max: 7500 },
    // Opposite handicap — Cardinals −1.5 / Cubs +1.5. Must not enter +1.5 tape.
    { t: 3, awayLine: -1.5, awayOdds: 256, homeLine: 1.5, homeOdds: -310, max: 2000 },
    { t: 4, awayLine: 1.5, awayOdds: -121, homeLine: -1.5, homeOdds: 105, isMain: true, max: 7500 },
  ],
  spreadLines: [
    { homeLine: 1.5, awayLine: -1.5, homeOdds: -310, awayOdds: 256, max: 2000 },
    { homeLine: -1.5, awayLine: 1.5, homeOdds: 105, awayOdds: -121, isMain: true, max: 7500 },
  ],
};

const smaPath = extractMarketPath(mixedGame, {
  marketType: 'spread',
  sideNorm: 'away',
  line: 1.5,
});
assert.equal(smaPath.openOdds, -143);
assert.equal(smaPath.nowOdds, -121);
assert.notEqual(smaPath.nowOdds, 256);
assert.ok(Math.abs(smaPath.deltaProbPp) < 10,
  `+1.5 open −143 → now −121 is ~4pp, not the mixed 30.8pp, got ${smaPath.deltaProbPp}`);

const liveOnly = extractMarketPath({
  spreadLines: mixedGame.spreadLines,
}, {
  marketType: 'spread',
  sideNorm: 'away',
  line: 1.5,
});
assert.equal(liveOnly.nowOdds, -121, `live board must skip flipped +256 row, got ${liveOnly.nowOdds}`);

const tape = tapeOnLine(mixedGame, { family: 'SPREAD', side: 'away', line: 1.5 });
assert.equal(tape.open, -143);
assert.equal(tape.now, -121);
assert.ok(!tape.series.some((p) => p.odds === 256),
  `tape series mixed opposite juice: ${JSON.stringify(tape.series)}`);

const commence = Date.now() + (5 * 60 * 60 * 1000);
const vaultPositions = [{
  wallet: '0xf7f0b0b1e9c0fe02ccad926916ee31aef74b912c',
  side: 'away',
  entryLine: 1.5,
  avgPrice: 0.554,
  invested: 1022,
  size: 1843,
  tier: 'ELITE',
}];
const fixture = mapLockedPickToCardFixture({
  key: '2026-08-14_MLB_stl_chc_spread:away',
  sport: 'MLB',
  gameKey: 'stl_chc',
  marketType: 'spread',
  side: 'away',
  pickSide: 'away',
  team: 'St. Louis Cardinals +1.5',
  line: 1.5,
  odds: 270,
  units: 1,
  lockPinnOdds: -143,
  pinnacleOdds: -143,
  gameTime: commence,
  lockedAt: commence - 8 * 3600_000,
  status: 'PENDING',
  away: 'St. Louis Cardinals',
  home: 'Chicago Cubs',
  vaultPositions,
}, {
  pinnacleHistory: { MLB: { stl_chc: mixedGame } },
  spreadPositions: { MLB: { stl_chc: { positions: vaultPositions } } },
});

const pathOdds = (fixture.pinPath || []).map((p) => p.odds);
assert.ok(!pathOdds.includes(256), `chart mixed +256, got ${JSON.stringify(pathOdds)}`);
assert.deepEqual(pathOdds.filter((o) => o === 256), []);
assert.ok(pathOdds.includes(-143) && pathOdds.includes(-121),
  `chart should be −143 … −121, got ${JSON.stringify(pathOdds)}`);
assert.equal(fixture.sharpEntryOdds, -143, `PIN box must be chart open, got ${fixture.sharpEntryOdds}`);
assert.equal(fixture.currentFairOdds, -121, `NOW box must be chart last, got ${fixture.currentFairOdds}`);
assert.equal(fixture.nowOdds, -121);
assert.notEqual(fixture.currentFairOdds, 256);
assert.equal(fixture.lockOdds, -124, 'TICKET stays vault Poly');
const pinBook = (fixture.books || []).find((b) => b.sharp);
assert.ok(pinBook, 'bottom PIN (SHARP) box missing');
assert.equal(pinBook.odds, -121, `bottom PIN must match NOW/chart, got ${pinBook.odds}`);

console.log('testSpreadTapeBoxParity: ok');
