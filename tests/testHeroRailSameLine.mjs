/**
 * Shop rail / gold chip stay on the hero line.
 * Usage: node tests/testHeroRailSameLine.mjs
 */
import assert from 'node:assert/strict';
import {
  bookOnTicketLine,
  keepTicketLineBooks,
  markGoldFromTicketBooks,
  shopRailHidden,
  pinPostedOdds,
  bookBeatsPin,
  evPctVsPinPosted,
  resolveHeroShop,
} from '../src/lib/shopTicketLine.js';

assert.equal(bookOnTicketLine(7.5, 7.5), true);
assert.equal(bookOnTicketLine(8.5, 7.5), false);
assert.equal(bookOnTicketLine(null, 7.5), false);
assert.equal(bookOnTicketLine(7.5, null), true);
assert.equal(shopRailHidden('LowVig'), true);
assert.equal(shopRailHidden('lowvig'), true);
assert.equal(shopRailHidden('FanDuel'), false);

const books = [
  { name: 'Pinnacle', odds: -103, line: 7.5 },
  { name: 'FanDuel', odds: 105, line: 8.5 },
  { name: 'DraftKings', odds: -107, line: 7.5 },
  { name: 'BetMGM', odds: -110, line: 7.5 },
  { name: 'Caesars', odds: -102, line: 7.5 },
  { name: 'Novig', odds: 100, line: 8.5 },
  { name: 'Polymarket', odds: 100, line: 7.5 },
  { name: 'LowVig', odds: -102, line: 7.5 },
];

const kept = keepTicketLineBooks(books, 7.5);
const names = kept.map((b) => b.name);
assert.deepEqual(names, ['Pinnacle', 'DraftKings', 'BetMGM', 'Caesars', 'Polymarket']);
assert.ok(!names.includes('FanDuel'), 'FanDuel 8.5 must not sit on Over 7.5');
assert.ok(!names.includes('Novig'), 'Novig 8.5 must not sit on Over 7.5');
assert.ok(!names.includes('LowVig'), 'LowVig is off the rail');

const gold = markGoldFromTicketBooks(kept);
assert.equal(gold.bestOdds, 100);
assert.equal(gold.bestBook, 'Polymarket');
assert.equal(kept.find((b) => b.name === 'Polymarket').best, true);
assert.equal(kept.find((b) => b.name === 'Caesars').best, false);
assert.equal(kept.find((b) => b.name === 'DraftKings').best, false);

const retail = [
  { name: 'Pinnacle', odds: -110, line: 8.5 },
  { name: 'FanDuel', odds: -110, line: 8.5 },
  { name: 'DraftKings', odds: -110, line: 8.5 },
  { name: 'Bovada', odds: -104, line: 8.5 },
  { name: 'bet365', odds: -107, line: 8.5 },
  { name: 'Novig', odds: -108, line: 8.5 },
  { name: 'LowVig', odds: -102, line: 8.5 },
];
const shown = keepTicketLineBooks(retail, 8.5);
assert.ok(!shown.some((b) => shopRailHidden(b.name)));
const gold2 = markGoldFromTicketBooks(shown);
assert.equal(gold2.bestOdds, -104);
assert.equal(gold2.bestBook, 'Bovada');
assert.equal(shown.find((b) => b.name === 'Bovada').best, true);
assert.equal(shown.find((b) => b.name === 'FanDuel').best, false);

const pin = pinPostedOdds(shown);
assert.equal(pin, -110);
assert.equal(bookBeatsPin(shown.find((b) => b.name === 'Bovada'), pin), true);
assert.equal(bookBeatsPin(shown.find((b) => b.name === 'bet365'), pin), true);
assert.equal(bookBeatsPin(shown.find((b) => b.name === 'FanDuel'), pin), false);
assert.equal(bookBeatsPin(shown.find((b) => b.name === 'Pinnacle'), pin), false);

const tied = [
  { name: 'FanDuel', odds: -110 },
  { name: 'DraftKings', odds: -110 },
  { name: 'BetMGM', odds: -115 },
];
markGoldFromTicketBooks(tied);
assert.equal(tied[0].best, true);
assert.equal(tied[1].best, true);
assert.equal(tied[2].best, false);

// LSU ML: Pin −152, FanDuel −141 → hero is best book, green EV vs Pin posted.
assert.equal(evPctVsPinPosted(-141, -152), 1.8);
assert.equal(evPctVsPinPosted(-152, -152), null);
assert.equal(evPctVsPinPosted(-155, -152), null);
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
assert.equal(lsu.odds, -141);
assert.equal(lsu.book, 'FanDuel');
assert.equal(lsu.evPct, 1.8);

const pinBest = resolveHeroShop({
  bestOdds: -152,
  bestBook: 'Pinnacle',
  books: [{ name: 'Pinnacle', odds: -152 }, { name: 'DraftKings', odds: -154 }],
  fallbackOdds: -152,
});
assert.equal(pinBest.odds, -152);
assert.equal(pinBest.evPct, null);

console.log('testHeroRailSameLine: ok', gold, gold2, lsu);
