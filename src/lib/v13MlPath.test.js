import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyV13MlPath,
  buildV13MlBook,
  v13HighPriceZone,
  v13OpensSide,
  v13PriceZone,
  v13UsesTrustedList,
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
  assert.equal(heavy.units, 2.5);
  assert.equal(heavy.zone, 'heavy');
  const against = run({ units: 4, steam: -0.1, odds: -160 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(against.zone, 'against');
});

test('a shorten of 4.5 or more stays off when the price is missing', () => {
  const mid = run({ units: 2, steam: 5, odds: null, price: null });
  assert.equal(mid.action, 'PASS');
  assert.equal(mid.units, 2);
  assert.equal(mid.reason, 'no_price');
  const heavy = run({ units: 1, steam: 12, odds: null, price: null });
  assert.equal(heavy.action, 'PASS');
  assert.equal(heavy.units, 1);
  assert.equal(heavy.reason, 'no_price');
  const implied = run({ steam: 10, odds: null, price: 0.62 });
  assert.equal(implied.action, 'STAKE');
  assert.equal(implied.units, 4);
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

test('a dog longer than +200 comes off, and the shorter dog steps keep the cap', () => {
  const longDog = run({ units: 2, odds: 300, steam: 0 });
  assert.equal(longDog.action, 'MUTE');
  assert.equal(longDog.units, 0);
  assert.equal(longDog.reason, 'dog');
  assert.equal(longDog.zone, 'long');
  const fromPrice = run({ units: 2, odds: null, price: 0.25, steam: 1 });
  assert.equal(fromPrice.action, 'MUTE');
  assert.equal(fromPrice.units, 0);
  assert.equal(fromPrice.reason, 'dog');
  const plus200 = run({ odds: 200, steam: 1 });
  assert.equal(plus200.action, 'STAKE');
  assert.equal(plus200.units, 1);
  const midDog = run({ odds: 180, steam: 0 });
  assert.equal(midDog.units, 1.5);
  const heavyDog = run({ steam: 12, odds: 300 });
  assert.equal(heavyDog.action, 'MUTE');
  assert.equal(heavyDog.units, 0);
  assert.equal(heavyDog.reason, 'dog');
  const pick = run({ odds: 110, steam: 0 });
  assert.equal(pick.units, 2);
});

test('an edge under 0 rescues −150 or shorter at 2', () => {
  const full = run({ edge: -0.1, odds: -150, steam: null });
  assert.equal(full.action, 'STAKE');
  assert.equal(full.units, 2);
  assert.equal(full.zone, 'rescue');
  const shorter = run({ edge: -8, odds: -300, steam: -4 });
  assert.equal(shorter.units, 2);
  const boundary = run({ edge: -3, odds: -200 });
  assert.equal(boundary.units, 2);
  const longer = run({ units: 1, edge: -1, odds: -149 });
  assert.equal(longer.action, 'PASS');
  assert.equal(longer.units, 1);
  const dog = run({ edge: -6, odds: 130 });
  assert.equal(dog.action, 'PASS');
  const juice = run({ units: 0, edge: -4, odds: -450, steam: 8 });
  assert.equal(juice.action, 'PASS');
  assert.equal(juice.units, 0);
  assert.equal(juice.zone, 'juice');
});

test('the branch stays off without an edge, without a steam, and with opposition', () => {
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

test('confirmed comes first, then the tier, and a copy is one bet', () => {
  const lowWin = buildV13MlBook(history('lowwin', { n: 12, price: 0.4, winsFrom: 6 }), DAY);
  assert.equal(lowWin.has('NBA|lowwin'), false);
  const red = history('reddol', { n: 12, price: 0.5, winsFrom: 4 }).map((row) => ({
    ...row,
    invested: 100,
    settledPnl: row.won ? 10 : -400,
  }));
  assert.equal(buildV13MlBook(red, DAY).has('NBA|reddol'), false);
  const real = history('copies', { n: 5, price: 0.5, winsFrom: 3, start: '2026-06-01' }).map((row, i) => ({
    ...row,
    invested: 100,
    settledPnl: row.won ? 100 : -100,
    gameKey: `game${i}`,
  }));
  const copies = real.filter((row) => row.won).flatMap((row) => [1, 2, 3].map((k) => ({
    ...row,
    date: `2026-06-${20 + k}`,
  })));
  assert.equal(buildV13MlBook([...real, ...copies], DAY).has('NBA|copies'), false);
  assert.equal(book().has('NBA|aaaaaa'), true);
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

// ─── The trusted list, from 2026-11-20, in every sport ───────

const LIST_DAY = '2026-11-21';

function trusted(...wallets) {
  const index = new Map();
  for (const w of wallets) index.set(`ML|${w}`, {
    trusted: true, standing: 0.9, score: 0.02, n: 20, sports: ['NHL', 'NBA', 'NFL', 'CFB', 'CBB', 'SOC', 'ATP', 'CS2', 'LOL', 'MLB', 'WNBA', 'UFC'],
  });
  // A spread name must never open a moneyline.
  index.set('SPREAD|spread1', {
    trusted: true, standing: 0.95, score: 0.03, n: 20, sports: ['NHL', 'NBA', 'NFL', 'CFB', 'CBB', 'SOC', 'ATP', 'CS2', 'LOL', 'MLB', 'WNBA', 'UFC'],
  });
  return index;
}

const LIST = trusted('tttt01', 'tttt02', 'tttt03', 'tttt04');

function runList(over = {}) {
  return applyV13MlPath({
    units: 1,
    pickDate: LIST_DAY,
    sport: 'NBA',
    market: 'ML',
    side: 'home',
    positions: [pos('tttt01')],
    odds: -150,
    steam: 0,
    edge: 4,
    book: book(),
    list: LIST,
    ...over,
  });
}

test('from the list day a moneyline reads the trusted list, not the tier book', () => {
  const on = runList();
  assert.equal(on.action, 'STAKE');
  assert.equal(on.list, 'trusted');
  assert.equal(on.margin, 1);
  assert.deepEqual(on.wallets, ['tttt01']);
  // A tier-book wallet that is not on the list no longer opens the side.
  const tierOnly = runList({ positions: [pos('aaaaaa')] });
  assert.equal(tierOnly.action, 'PASS');
  assert.equal(tierOnly.reason, 'no_trusted_wallet');
  assert.equal(tierOnly.units, 1);
  // And a tier-book wallet on the other side no longer blocks it.
  const tierAgainst = runList({ positions: [pos('tttt01'), pos('bbbbbb', 'away')] });
  assert.equal(tierAgainst.action, 'STAKE');
  assert.equal(tierAgainst.against, 0);
});

test('the list gate is the count: ahead by 1 or more fires, even and behind stay', () => {
  const ahead = runList({ positions: [pos('tttt01'), pos('tttt02'), pos('tttt03', 'away')] });
  assert.equal(ahead.action, 'STAKE');
  assert.equal(ahead.margin, 1);
  assert.equal(ahead.against, 1);
  const even = runList({ units: 2, positions: [pos('tttt01'), pos('tttt03', 'away')] });
  assert.equal(even.action, 'PASS');
  assert.equal(even.reason, 'trusted_not_ahead');
  assert.equal(even.units, 2);
  assert.equal(even.margin, 0);
  assert.equal(even.fires, true);
  const behind = runList({ positions: [pos('tttt01'), pos('tttt03', 'away'), pos('tttt04', 'away')] });
  assert.equal(behind.action, 'PASS');
  assert.equal(behind.reason, 'trusted_not_ahead');
  assert.equal(behind.margin, -1);
  const spreadName = runList({ positions: [pos('spread1')] });
  assert.equal(spreadName.reason, 'no_trusted_wallet');
});

test('the sizes on the list are the sizes on the tier book, zone for zone', () => {
  const cases = [
    { odds: -110, steam: 0, edge: 4 },
    { odds: 110, steam: 2.4, edge: 4 },
    { odds: -200, steam: 4.5, edge: 4 },
    { odds: -200, steam: 10, edge: 4 },
    { odds: -200, steam: -1, edge: 4 },
    { odds: -150, steam: 3, edge: 12 },
    { odds: -140, steam: 3, edge: 12 },
    { odds: -150, steam: -2, edge: 12 },
    { odds: -150, steam: null, edge: -3 },
    { odds: -140, steam: null, edge: -3 },
    { odds: 210, steam: 1, edge: 4 },
    { odds: 160, steam: 1, edge: 4 },
    { odds: -450, steam: 1, edge: 4 },
    { odds: -150, steam: null, edge: 4 },
    { odds: -150, steam: 1, edge: null },
  ];
  for (const c of cases) {
    const tier = run({ ...c, units: 1.25 });
    const list = runList({ ...c, units: 1.25 });
    assert.equal(list.action, tier.action, JSON.stringify(c));
    assert.equal(list.units, tier.units, JSON.stringify(c));
    assert.equal(list.zone, tier.zone, JSON.stringify(c));
    assert.equal(list.reason, tier.reason, JSON.stringify(c));
  }
});

test('every sport reads the list; earlier dates and a morning with no list stay on the tier book', () => {
  // A tier-book wallet in another sport no longer opens the side. The list does.
  const cbbArgs = {
    units: 1, pickDate: LIST_DAY, sport: 'CBB', market: 'ML', side: 'home',
    odds: -150, steam: 0, edge: 4,
    book: buildV13MlBook(history('cccccc', { sport: 'CBB' }), LIST_DAY), list: LIST,
  };
  const cbbTier = applyV13MlPath({ ...cbbArgs, positions: [pos('cccccc')] });
  assert.equal(cbbTier.action, 'PASS');
  assert.equal(cbbTier.reason, 'no_trusted_wallet');
  assert.equal(cbbTier.list, 'trusted');
  const cbbList = applyV13MlPath({ ...cbbArgs, positions: [pos('tttt01')] });
  assert.equal(cbbList.action, 'STAKE');
  assert.equal(cbbList.list, 'trusted');
  assert.equal(cbbList.units, runList().units);
  for (const sport of ['SOC', 'ATP', 'CS2', 'LOL', 'UFC', 'MLB', 'WNBA', 'CBB', 'NCAAB']) {
    assert.equal(runList({ sport }).list, 'trusted', sport);
    assert.equal(runList({ sport }).action, 'STAKE', sport);
  }
  // Three-way: a trusted wallet on the draw counts against home.
  const draw = runList({ sport: 'SOC', positions: [pos('tttt01'), pos('tttt02', 'draw')] });
  assert.equal(draw.action, 'PASS');
  assert.equal(draw.reason, 'trusted_not_ahead');
  assert.equal(draw.margin, 0);
  const before = runList({ pickDate: '2026-11-19', positions: [pos('aaaaaa')] });
  assert.equal(before.action, 'STAKE');
  assert.equal(before.list, 'tier');
  const noList = runList({ list: new Map(), positions: [pos('aaaaaa')] });
  assert.equal(noList.action, 'STAKE');
  assert.equal(noList.list, 'tier');
  assert.equal(v13UsesTrustedList(LIST_DAY, 'NBA', LIST), true);
  assert.equal(v13UsesTrustedList(LIST_DAY, 'NBA', new Map()), false);
  assert.equal(v13UsesTrustedList(LIST_DAY, 'SOC', LIST), true);
  assert.equal(v13UsesTrustedList(LIST_DAY, '', LIST), false);
  assert.equal(v13UsesTrustedList('2026-11-19', 'NBA', LIST), false);
  for (const sport of ['NHL', 'NBA', 'NFL', 'CFB', 'NCAAF']) {
    assert.equal(runList({ sport }).list, 'trusted', sport);
  }
});

test('manual stake and an operator kill still win on the list', () => {
  const manual = runList({ units: 5, manual: true });
  assert.equal(manual.action, 'EXEMPT');
  assert.equal(manual.units, 5);
  const killed = runList({ units: 0, killed: true });
  assert.equal(killed.action, 'EXEMPT');
});

test('the create door opens on the list only when the side is ahead', () => {
  const args = { pickDate: LIST_DAY, sport: 'NBA', side: 'home', book: book(), list: LIST };
  assert.equal(v13OpensSide({ ...args, positions: [pos('tttt01')] }), true);
  assert.equal(v13OpensSide({ ...args, positions: [pos('tttt01'), pos('tttt02', 'away')] }), false);
  assert.equal(v13OpensSide({ ...args, positions: [pos('aaaaaa')] }), false);
  // Tier book: one qualified wallet opens, as before.
  assert.equal(v13OpensSide({ ...args, pickDate: '2026-11-19', positions: [pos('aaaaaa')] }), true);
  assert.equal(v13OpensSide({ ...args, sport: 'CBB', positions: [pos('tttt01')] }), true);
  assert.equal(v13OpensSide({ ...args, sport: 'CBB', positions: [pos('aaaaaa')] }), false);
});

test('a trusted wallet opens a moneyline only in a sport where it is profitable on 10 bets', () => {
  const list = new Map([
    ['ML|tttt01', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NHL'] }],
    ['ML|tttt02', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA'] }],
    ['ML|tttt03', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [] }],
  ]);
  // NBA: the NHL-only wallet and the wallet with no profitable sport do not open the side.
  const none = runList({ list, positions: [pos('tttt01'), pos('tttt03')] });
  assert.equal(none.action, 'PASS');
  assert.equal(none.reason, 'no_trusted_wallet');
  assert.equal(v13OpensSide({ pickDate: LIST_DAY, sport: 'NBA', side: 'home', positions: [pos('tttt01')], list }), false);
  // The same wallet on an NHL side does.
  const nhl = runList({ list, sport: 'NHL', positions: [pos('tttt01')] });
  assert.equal(nhl.action, 'STAKE');
  assert.deepEqual(nhl.wallets, ['tttt01']);
  assert.equal(v13OpensSide({ pickDate: LIST_DAY, sport: 'NHL', side: 'home', positions: [pos('tttt01')], list }), true);
  // And it does not count against an NBA side either.
  const ahead = runList({ list, positions: [pos('tttt02'), pos('tttt01', 'away'), pos('tttt03', 'away')] });
  assert.equal(ahead.action, 'STAKE');
  assert.equal(ahead.margin, 1);
  assert.equal(ahead.against, 0);
});
