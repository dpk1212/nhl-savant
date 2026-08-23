/**
 * NFL spread polarity — titled favorite vs held dog token.
 * Usage: node tests/testSpreadLineSign.mjs
 */
import assert from 'node:assert/strict';
import {
  parseSpreadTitle,
  spreadLineFromMarketSlug,
  inheritSpreadMarketHints,
  resolveSignedSpreadLine,
  signedSpreadEntryLine,
  teamLabelToSide,
  isSpreadPolarityFlip,
} from '../src/lib/spreadLineSign.js';
import { resolveSpreadEntryLine, teamNameToSide } from '../scripts/lib/resolvePositionSide.js';
import {
  vaultConsensusLine,
  americanFromPolyPrice,
  resolveInstrument,
} from '../src/lib/ticketInstrument.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(teamNameToSide('TEN', 'Seahawks', 'Titans') === 'home', 'TEN → Titans → home');
ok(teamNameToSide('SEA', 'Seahawks', 'Titans') === 'away', 'SEA → Seahawks → away');
ok(teamLabelToSide('TEN', 'Seahawks', 'Titans') === 'home', 'code TEN → home');
ok(teamLabelToSide('KC', 'Chiefs', 'Raiders') === 'away', 'KC → Chiefs → away');

ok(parseSpreadTitle('Spread: TEN (−4.5)')?.line === -4.5, 'unicode minus');
ok(parseSpreadTitle('Spread: TEN (-4.5)')?.team === 'TEN', 'ascii title team');

ok(spreadLineFromMarketSlug('nfl-sea-ten-2026-08-24-spread-home-4pt5', 'away') === 4.5,
  'slug home-4pt5 + away → +4.5');
ok(spreadLineFromMarketSlug('nfl-sea-ten-2026-08-24-spread-home-3pt5', 'away') === 3.5,
  'slug home-3pt5 + away → +3.5');
ok(spreadLineFromMarketSlug('nfl-sea-ten-2026-08-24-spread-home-4pt5', 'home') === -4.5,
  'slug home-4pt5 + home → -4.5');

const seaTen = resolveSpreadEntryLine({
  title: 'Spread: TEN (-4.5)',
  outcome: 'SEA',
  outcomeIndex: 1,
  side: 'away',
  awayName: 'Seahawks',
  homeName: 'Titans',
  matchSpreadLine: -4.5,
  polySpread: { line: -3.5, outcomes: ['TEN', 'SEA'] },
});
ok(seaTen === 4.5, `SEA on TEN -4.5 → +4.5 (got ${seaTen})`);

const unicode = resolveSignedSpreadLine({
  title: 'Spread: TEN (−3.5)',
  outcome: 'SEA',
  side: 'away',
  awayName: 'Seahawks',
  homeName: 'Titans',
  matchSpreadLine: -3.5,
});
ok(unicode === 3.5, `unicode TEN -3.5 holding SEA → +3.5 (got ${unicode})`);

const storedWrong = signedSpreadEntryLine({
  side: 'away',
  outcome: 'SEA',
  title: 'Spread: TEN (-4.5)',
  slug: 'nfl-sea-ten-2026-08-24-spread-home-4pt5',
  entryLine: -4.5,
  avgPrice: 0.54,
  invested: 12878,
});
ok(storedWrong === 4.5, `stored -4.5 re-signed to +4.5 (got ${storedWrong})`);

const cid = '0xabc';
const hinted = inheritSpreadMarketHints([
  { side: 'away', outcome: 'SEA', conditionId: cid, entryLine: -3.5, invested: 12878, avgPrice: 0.54 },
  {
    side: 'away', outcome: 'Seahawks', conditionId: cid, entryLine: -4.5, invested: 5883,
    title: 'Spread: TEN (−3.5)',
    slug: 'nfl-sea-ten-2026-08-24-spread-home-3pt5',
  },
]);
ok(hinted[0].slug.includes('home-3pt5'), 'title-less peer inherits slug');
ok(signedSpreadEntryLine(hinted[0]) === 3.5, 'inherited slug re-signs lead wallet');

ok(americanFromPolyPrice(0.54) === -117, 'juice 0.54 → -117 unchanged');

const vault = vaultConsensusLine([
  {
    side: 'away', outcome: 'SEA', title: 'Spread: TEN (-4.5)',
    slug: 'nfl-sea-ten-2026-08-24-spread-home-4pt5',
    entryLine: -4.5, invested: 586, avgPrice: 0.519,
  },
], 'away', 'SPREAD');
ok(vault === 4.5, `vault consensus ignores stored sign (got ${vault})`);

const inst = resolveInstrument({
  family: 'SPREAD',
  side: 'away',
  positions: [{
    side: 'away',
    outcome: 'SEA',
    title: 'Spread: TEN (-3.5)',
    slug: 'nfl-sea-ten-2026-08-24-spread-home-3pt5',
    entryLine: -3.5,
    avgPrice: 0.54,
    invested: 12878,
  }],
  pinnGame: {
    spreadCurrent: { homeLine: -4.5, awayLine: 4.5, homeOdds: -104, awayOdds: -112, isMain: true },
    spreadLines: [
      { homeLine: -4.5, awayLine: 4.5, homeOdds: -104, awayOdds: -112, isMain: true },
    ],
  },
});
ok(inst.line === 3.5, `instrument line +3.5 (got ${inst.line})`);
ok(inst.variant === 'ALT', 'alt vs book +4.5');
ok(inst.mainLine === 4.5, 'book MAIN stays +4.5');
ok(inst.ticket.american === -117, `ticket juice still -117 (got ${inst.ticket.american})`);
ok(inst.side === 'away', 'side unchanged');

const noTitle = resolveSignedSpreadLine({
  title: '',
  outcome: 'SEA',
  side: 'away',
  awayName: 'Seahawks',
  homeName: 'Titans',
  polySpread: { line: -3.5, outcomes: ['TEN', 'SEA'] },
});
ok(noTitle === 3.5, `title-less + poly [TEN,SEA] -3.5 → +3.5 (got ${noTitle})`);

ok(isSpreadPolarityFlip(-3.5, 3.5), 'polarity flip detector');
ok(!isSpreadPolarityFlip(-3.5, 4.5), 'different magnitude is not a polarity flip');

const jays = resolveSpreadEntryLine({
  title: 'Spread: Philadelphia Phillies (-1.5)',
  outcome: 'Toronto Blue Jays',
  side: 'away',
  awayName: 'Toronto Blue Jays',
  homeName: 'Philadelphia Phillies',
});
ok(jays === 1.5, `Jays +1.5 regression (got ${jays})`);

console.log(`OK ${n} assertions`);
