/**
 * Shop rail / gold chip stay on the hero line.
 * Usage: node tests/testHeroRailSameLine.mjs
 */
import assert from 'node:assert/strict';
import {
  bookOnTicketLine,
  keepTicketLineBooks,
  markGoldFromTicketBooks,
} from '../src/lib/shopTicketLine.js';

assert.equal(bookOnTicketLine(7.5, 7.5), true);
assert.equal(bookOnTicketLine(8.5, 7.5), false);
assert.equal(bookOnTicketLine(null, 7.5), false);
assert.equal(bookOnTicketLine(7.5, null), true);

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
assert.deepEqual(names, ['Pinnacle', 'DraftKings', 'BetMGM', 'Caesars', 'Polymarket', 'LowVig']);
assert.ok(!names.includes('FanDuel'), 'FanDuel 8.5 must not sit on Over 7.5');
assert.ok(!names.includes('Novig'), 'Novig 8.5 must not sit on Over 7.5');

const gold = markGoldFromTicketBooks(kept);
assert.equal(gold.bestOdds, -102);
assert.equal(gold.bestBook, 'Caesars');
assert.equal(kept.find((b) => b.name === 'Caesars').best, true);
assert.equal(kept.find((b) => b.name === 'DraftKings').best, false);
assert.equal(kept.find((b) => b.name === 'Polymarket').best, false);

console.log('testHeroRailSameLine: ok', gold);
