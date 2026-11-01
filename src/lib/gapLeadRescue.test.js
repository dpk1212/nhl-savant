import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyGapLeadRescue,
  buildGapLeadBooks,
  GAP_LEAD_FROM,
} from './gapLeadRescue.js';

const DAY = '2026-10-30';

function leg(wallet, date, settled, invested = 100) {
  return {
    walletShort: wallet,
    date,
    sport: 'NBA',
    marketType: 'ML',
    status: 'GRADED',
    invested,
    settledPnl: settled,
  };
}

function fill(wallet, pnl, n = 5) {
  const rows = [];
  for (let i = 0; i < n; i++) rows.push(leg(wallet, `2026-10-${String(10 + i).padStart(2, '0')}`, pnl));
  return rows;
}

function booksFrom(rows) {
  return buildGapLeadBooks(rows, DAY);
}

function tonight(books, units, odds = -110, extra = []) {
  const positions = [
    { walletShort: 'aaaaaa', side: 'home', invested: 100 },
    { walletShort: 'bbbbbb', side: 'home', invested: 100 },
    { walletShort: 'cccccc', side: 'away', invested: 100 },
    ...extra,
  ];
  return applyGapLeadRescue({
    units, odds, sport: 'NBA', market: 'ML', side: 'home', pickDate: DAY, positions, books,
  });
}

test('a zero with two wallets and a 40-point lead over a losing book goes to 3u', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 40),
    ...fill('cccccc', -20),
  ]);
  const out = tonight(books, 0);
  assert.equal(out.action, 'rescue');
  assert.equal(out.units, 3);
  assert.ok(out.margin >= 40);
  assert.ok(out.other < 0);
});

test('one qualified wallet does not fire', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('cccccc', -20),
  ]);
  const out = tonight(books, 0);
  assert.equal(out.fires, false);
  assert.equal(out.units, 0);
});

test('a lead over a book that is already up does not fire', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 90),
    ...fill('bbbbbb', 80),
    ...fill('cccccc', 10),
  ]);
  const out = tonight(books, 0);
  assert.equal(out.fires, false);
});

test('a side the other book has no score on does not fire', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 40),
  ]);
  const out = tonight(books, 0);
  assert.equal(out.reason, 'other_side_unscored');
});

test('a stake under 3 gets one unit and a stake at 3 or 4 stays', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 40),
    ...fill('cccccc', -20),
  ]);
  assert.equal(tonight(books, 1).action, 'boost');
  assert.equal(tonight(books, 1).units, 2);
  assert.equal(tonight(books, 2).units, 3);
  assert.equal(tonight(books, 2.5).units, 3.5);
  assert.equal(tonight(books, 3).action, 'hold');
  assert.equal(tonight(books, 3).units, 3);
  assert.equal(tonight(books, 4).units, 4);
});

test('the odds cap clamps a rescue and never shrinks a stake already on the side', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 40),
    ...fill('cccccc', -20),
  ]);
  assert.equal(tonight(books, 0, 220).units, 1);
  assert.equal(tonight(books, 0, 160).units, 1.5);
  assert.equal(tonight(books, 2, 220).action, 'hold');
  assert.equal(tonight(books, 2, 220).units, 2);
});

test('a favorite juicier than -425 stays at zero', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 40),
    ...fill('cccccc', -20),
  ]);
  const out = tonight(books, 0, -430);
  assert.equal(out.fires, true);
  assert.equal(out.action, 'hold');
  assert.equal(out.units, 0);
});

test('two wallets are enough even when the board has no rank peers', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 50),
    ...fill('bbbbbb', 10),
    ...fill('cccccc', -30),
  ]);
  assert.equal(books.size, 3);
  assert.equal(tonight(books, 0).action, 'rescue');
});

test('tonight and a push do not enter the book', () => {
  const rows = [
    ...fill('aaaaaa', 80, 4),
    leg('aaaaaa', DAY, 500),
    { ...leg('aaaaaa', '2026-10-09', 0), result: 'PUSH', settledPnl: 0, status: 'GRADED' },
    ...fill('bbbbbb', 40),
    ...fill('cccccc', -20),
  ];
  const books = booksFrom(rows);
  assert.equal(books.has('NBA|ML|aaaaaa'), false);
  assert.equal(tonight(books, 0).fires, false);
});

test('the weight is tonight invested, and the rule is off before the cutover', () => {
  const rows = [
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 10),
    ...fill('cccccc', -5),
  ];
  const books = booksFrom(rows);
  const heavy = applyGapLeadRescue({
    units: 0,
    sport: 'NBA',
    market: 'ML',
    side: 'home',
    pickDate: DAY,
    books,
    positions: [
      { walletShort: 'aaaaaa', side: 'home', invested: 100 },
      { walletShort: 'bbbbbb', side: 'home', invested: 300 },
      { walletShort: 'cccccc', side: 'away', invested: 100 },
    ],
  });
  assert.ok(heavy.margin < 40);
  assert.equal(heavy.fires, false);
  const before = applyGapLeadRescue({
    units: 0,
    sport: 'NBA',
    market: 'ML',
    side: 'home',
    pickDate: '2026-10-29',
    books,
    positions: [
      { walletShort: 'aaaaaa', side: 'home', invested: 100 },
      { walletShort: 'bbbbbb', side: 'home', invested: 100 },
      { walletShort: 'cccccc', side: 'away', invested: 100 },
    ],
  });
  assert.equal(before.reason, 'not_live');
  assert.equal(GAP_LEAD_FROM, '2026-10-30');
});

test('a stake on the other side mutes the rescue and the boost', () => {
  const books = booksFrom([
    ...fill('aaaaaa', 80),
    ...fill('bbbbbb', 40),
    ...fill('cccccc', -20),
  ]);
  const positions = [
    { walletShort: 'aaaaaa', side: 'home', invested: 100 },
    { walletShort: 'bbbbbb', side: 'home', invested: 100 },
    { walletShort: 'cccccc', side: 'away', invested: 100 },
  ];
  const base = {
    sport: 'NBA', market: 'ML', side: 'home', pickDate: DAY, positions, books, odds: -110,
  };
  const rescued = applyGapLeadRescue({ ...base, units: 0, opponentUnits: 2 });
  assert.equal(rescued.fires, false);
  assert.equal(rescued.reason, 'pick_against');
  assert.equal(rescued.units, 0);
  const boosted = applyGapLeadRescue({ ...base, units: 1, opponentUnits: 2 });
  assert.equal(boosted.action, 'hold');
  assert.equal(boosted.units, 1);
  const open = applyGapLeadRescue({ ...base, units: 0, opponentUnits: 0 });
  assert.equal(open.action, 'rescue');
  assert.equal(open.units, 3);
});
