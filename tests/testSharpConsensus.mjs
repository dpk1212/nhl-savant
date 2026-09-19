/**
 * Pinnacle-heavy sharp consensus.
 * Usage: node tests/testSharpConsensus.mjs
 */
import assert from 'node:assert/strict';
import {
  bookBeatsConsensus,
  evPctVsConsensus,
  sharpConsensusFromBooks,
} from '../src/lib/sharpConsensus.js';
import { resolveHeroShop } from '../src/lib/shopTicketLine.js';

const pinOnly = sharpConsensusFromBooks([
  { name: 'Pinnacle', odds: -152 },
  { name: 'FanDuel', odds: -141 },
  { name: 'Kalshi', odds: -144 },
  { name: 'BetOnline', odds: -152 },
]);
assert.equal(pinOnly.odds, -152, 'retail / BOL / Kalshi must not move consensus');
assert.equal(pinOnly.used.length, 1);
assert.equal(pinOnly.used[0].sleeve, 'pinnacle');

const van = sharpConsensusFromBooks([
  { name: 'Pinnacle', odds: -144 },
  { name: 'FanDuel', odds: -136 },
  { name: 'Novig', odds: -135 },
  { name: 'Kalshi', odds: -138 },
  { name: 'BetOnline', odds: -144 },
]);
assert.equal(van.odds, -143, '70 Pin / 5 Novig → −143');
assert.deepEqual(van.used.map((u) => u.sleeve), ['pinnacle', 'novig']);

const nfl = sharpConsensusFromBooks([
  { name: 'Pinnacle', odds: -151 },
  { name: 'Betfair', odds: -139 },
  { name: 'Betfair UK', odds: -139 },
  { name: 'Matchbook', odds: -139 },
]);
assert.equal(nfl.odds, -148, 'Pin 70 + Betfair 18 + Matchbook 7');
assert.equal(nfl.used.length, 3);

assert.equal(evPctVsConsensus(-141, -152), 1.8);
assert.equal(evPctVsConsensus(-152, -152), null);
assert.equal(evPctVsConsensus(-136, -143), 1.2);
assert.equal(bookBeatsConsensus({ name: 'FanDuel', odds: -136 }, -143), true);
assert.equal(bookBeatsConsensus({ name: 'Pinnacle', odds: -144 }, -143), false);
assert.equal(bookBeatsConsensus({ name: 'DraftKings', odds: -148 }, -143), false);

const lsu = resolveHeroShop({
  bestOdds: -141,
  bestBook: 'FanDuel',
  books: [
    { name: 'Pinnacle', odds: -152 },
    { name: 'FanDuel', odds: -141 },
    { name: 'Kalshi', odds: -144 },
  ],
  fallbackOdds: -152,
});
assert.equal(lsu.consensusOdds, -152);
assert.equal(lsu.evPct, 1.8, 'Pin-only consensus keeps the old Pin EV');

const vanHero = resolveHeroShop({
  bestOdds: -135,
  bestBook: 'Fanatics',
  books: [
    { name: 'Pinnacle', odds: -144 },
    { name: 'FanDuel', odds: -136 },
    { name: 'Novig', odds: -135 },
    { name: 'Fanatics', odds: -135 },
  ],
});
assert.equal(vanHero.consensusOdds, -143);
assert.equal(vanHero.evPct, 1.4);

console.log('testSharpConsensus: ok', { pinOnly, van, nfl, lsu, vanHero });
