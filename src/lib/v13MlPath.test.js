import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyV13MlPath,
  buildV13MlBook,
  v13HighPriceZone,
  v13PriceZone,
} from './v13MlPath.js';

const DAY = '2026-11-19';

function history(wallet, { sport = 'NBA', n = 20, start = '2026-09-01', price = 0.5, winsFrom = 4, market = 'ML' } = {}) {
  const rows = [];
  for (let i = 0; i < n; i += 1) {
    const date = new Date(Date.parse(`${start}T00:00:00Z`) + i * 86400000).toISOString().slice(0, 10);
    const won = i >= winsFrom;
    rows.push({
      wallet, date, sport, marketType: market, side: 'home', gameKey: `g${wallet}${i}`,
      avgPrice: price, won, result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

function book(extra = []) {
  return buildV13MlBook([
    ...history('aaaaaa'),
    ...history('bbbbbb'),
    ...extra,
  ], DAY);
}

function pos(wallet, side = 'home') {
  return { wallet, side, marketType: 'ML' };
}

function run(over = {}) {
  return applyV13MlPath({
    units: 1,
    pickDate: DAY,
    sport: 'NBA',
    market: 'ML',
    side: 'home',
    positions: [pos('aaaaaa')],
    odds: -150,
    steam: 0,
    edge: 4,
    book: book(),
    ...over,
  });
}

test('the price cut is −110, and juice is left alone', () => {
  assert.equal(v13PriceZone(-110), 'favorite');
  assert.equal(v13PriceZone(-300), 'favorite');
  assert.equal(v13PriceZone(-425), 'favorite');
  assert.equal(v13PriceZone(-426), 'juice');
  assert.equal(v13PriceZone(-109), 'long');
  assert.equal(v13PriceZone(100), 'long');
  assert.equal(v13PriceZone(110), 'long');
  assert.equal(v13PriceZone(180), 'long');
  assert.equal(v13PriceZone(null, 0.55), 'favorite');
  assert.equal(v13PriceZone(null, 0.48), 'long');
  assert.equal(v13HighPriceZone(-150), 'short');
  assert.equal(v13HighPriceZone(-300), 'short');
  assert.equal(v13HighPriceZone(-149), 'longer');
  assert.equal(v13HighPriceZone(110), 'longer');
  assert.equal(v13HighPriceZone(-426), 'juice');
  assert.equal(v13HighPriceZone(null, 0.6), 'short');
  assert.equal(v13HighPriceZone(null, 0.59), 'longer');
});

test('flat through a small shorten is 4 at −110 or shorter and 2 otherwise', () => {
  const favorite = run({ odds: -110, steam: 0 });
  assert.equal(favorite.action, 'STAKE');
  assert.equal(favorite.units, 4);
  assert.equal(favorite.zone, 'favorite');
  const dog = run({ odds: 110, steam: 2.4 });
  assert.equal(dog.units, 2);
  assert.equal(dog.zone, 'long');
  const pick = run({ odds: -105, steam: 4.4 });
  assert.equal(pick.units, 2);
  assert.equal(pick.zone, 'long');
  const juice = run({ units: 3, odds: -450, steam: 1 });
  assert.equal(juice.action, 'PASS');
  assert.equal(juice.units, 3);
});

test('4.5 up to 10 is 0.75, 10 or more is 4, and steam against is 0', () => {
  const mid = run({ steam: 4.5, odds: -200 });
  assert.equal(mid.action, 'STAKE');
  assert.equal(mid.units, 0.75);
  assert.equal(mid.zone, 'mid');
  const justUnder = run({ steam: 4.44, odds: 130 });
  assert.equal(justUnder.units, 2);
  const heavy = run({ steam: 10, odds: 150 });
  assert.equal(heavy.units, 4);
  assert.equal(heavy.zone, 'heavy');
  const against = run({ units: 4, steam: -0.1, odds: -160 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(against.zone, 'against');
});

test('juice stays off on a shorten of 4.5 or more', () => {
  const mid = run({ units: 0, steam: 5, odds: -450 });
  assert.equal(mid.action, 'PASS');
  assert.equal(mid.units, 0);
  assert.equal(mid.zone, 'juice');
  const heavy = run({ units: 0, steam: 10, odds: -450 });
  assert.equal(heavy.action, 'PASS');
  assert.equal(heavy.units, 0);
  assert.equal(heavy.zone, 'juice');
  const priced = run({ steam: 5, odds: -200 });
  assert.equal(priced.units, 0.75);
});

test('edge of 10 or more mutes a move against, then sizes the price', () => {
  const full = run({ edge: 10, steam: 0, odds: -150 });
  assert.equal(full.action, 'STAKE');
  assert.equal(full.units, 3);
  assert.equal(full.zone, 'short');
  const shorter = run({ edge: 18, steam: 6, odds: -200 });
  assert.equal(shorter.units, 3);
  assert.equal(shorter.zone, 'short');
  const longer = run({ edge: 12, steam: 0, odds: -149 });
  assert.equal(longer.units, 1.5);
  assert.equal(longer.zone, 'longer');
  const dog = run({ edge: 12, steam: 11, odds: 140 });
  assert.equal(dog.units, 1.5);
  const against = run({ edge: 14, units: 4, steam: -0.1, odds: -180 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(against.zone, 'against');
  const juice = run({ edge: 15, units: 0, steam: 10, odds: -450 });
  assert.equal(juice.action, 'PASS');
  assert.equal(juice.units, 0);
  assert.equal(juice.zone, 'juice');
  const noMove = run({ edge: 11, steam: null, odds: -180 });
  assert.equal(noMove.action, 'PASS');
  assert.equal(noMove.units, 1);
});

test('the branch stays off under the edge, without a steam, and with opposition', () => {
  const under = run({ edge: -0.1 });
  assert.equal(under.action, 'PASS');
  const missingEdge = run({ edge: null });
  assert.equal(missingEdge.action, 'PASS');
  const missingSteam = run({ steam: null });
  assert.equal(missingSteam.action, 'PASS');
  const opposed = run({
    positions: [pos('aaaaaa', 'home'), pos('bbbbbb', 'away')],
  });
  assert.equal(opposed.action, 'PASS');
  assert.equal(opposed.against, 1);
  const alone = run();
  assert.equal(alone.against, 0);
  assert.deepEqual(alone.wallets, ['aaaaaa']);
});

test('any sport qualifies on its own moneyline book', () => {
  const mlb = buildV13MlBook(history('eeeeee', { sport: 'MLB' }), DAY);
  assert.equal(mlb.has('MLB|eeeeee'), true);
  const cbbBook = buildV13MlBook(history('ffffff', { sport: 'NCAAB' }), DAY);
  assert.equal(cbbBook.has('CBB|ffffff'), true);
  const played = applyV13MlPath({
    units: 1,
    pickDate: DAY,
    sport: 'CBB',
    market: 'ML',
    side: 'home',
    positions: [pos('ffffff')],
    odds: -150,
    steam: 0,
    edge: 4,
    book: cbbBook,
  });
  assert.equal(played.action, 'STAKE');
  assert.equal(played.units, 4);
  assert.deepEqual(played.wallets, ['ffffff']);
  const blank = run({ sport: '' });
  assert.equal(blank.action, 'PASS');
});

test('a young book, a spread, a manual stake, and yesterday stay put', () => {
  const young = buildV13MlBook(history('cccccc', { n: 12, start: '2026-11-08' }), DAY);
  assert.equal(young.has('NBA|cccccc'), false);
  const spreadOnly = buildV13MlBook(history('dddddd', { market: 'SPREAD' }), DAY);
  assert.equal(spreadOnly.has('NBA|dddddd'), false);
  const indexed = book();
  assert.equal(indexed.has('NBA|aaaaaa'), true);
  const spread = run({ market: 'SPREAD' });
  assert.equal(spread.action, 'PASS');
  const manual = run({ manual: true, units: 2 });
  assert.equal(manual.action, 'EXEMPT');
  assert.equal(manual.units, 2);
  const early = run({ pickDate: '2026-11-18' });
  assert.equal(early.action, 'EXEMPT');
  const none = run({ positions: [pos('zzzzzz')] });
  assert.equal(none.action, 'PASS');
});
