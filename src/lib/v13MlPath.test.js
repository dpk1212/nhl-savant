import assert from 'node:assert/strict';
import test from 'node:test';
import {
  V13_ML_LADDER_FROM,
  V13_ML_OPENED_BY_FIELD,
  V13_ML_SPREAD_AGREE_FROM,
  V13_ML_SPREAD_DOOR_FROM,
  V13_ML_SPREAD_WIDE_PROMOTED_BY,
  V13_ML_STAMP_FIELDS,
  applyV13MlPath,
  buildV13MlBook,
  isV13MlLadderLive,
  isV13MlSpreadAgreeLive,
  isV13MlSpreadDoorLive,
  v13HighPriceZone,
  v13HalfStake,
  v13LadderZone,
  v13MlStamp,
  v13OpensSide,
  v13PriceZone,
  v13SpreadWideOpensSide,
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

const EVERY_SPORT = ['NHL', 'NBA', 'NFL', 'CFB', 'CBB', 'SOC', 'ATP', 'CS2', 'LOL', 'MLB', 'WNBA', 'UFC'];

function trusted(...wallets) {
  const index = new Map();
  for (const w of wallets) index.set(`ML|${w}`, {
    trusted: true, standing: 0.9, score: 0.02, n: 20, sports: EVERY_SPORT, played: EVERY_SPORT,
  });
  // A spread name must never open a moneyline.
  index.set('SPREAD|spread1', {
    trusted: true, standing: 0.95, score: 0.03, n: 20, sports: EVERY_SPORT, played: EVERY_SPORT,
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

test('a trusted wallet counts on a moneyline only in a sport where it has 10 bets', () => {
  const list = new Map([
    ['ML|tttt01', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NHL'], played: ['NHL'] }],
    ['ML|tttt02', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA'], played: ['NBA'] }],
    ['ML|tttt03', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [], played: [] }],
  ]);
  // NBA: the NHL-only wallet and the wallet with under 10 bets anywhere do not open the side.
  const none = runList({ list, positions: [pos('tttt01'), pos('tttt03')] });
  assert.equal(none.action, 'PASS');
  assert.equal(none.reason, 'no_trusted_wallet');
  assert.equal(v13OpensSide({ pickDate: LIST_DAY, sport: 'NBA', side: 'home', positions: [pos('tttt01')], list }), false);
  // The same wallet on an NHL side does, at the full size.
  const nhl = runList({ list, sport: 'NHL', positions: [pos('tttt01')] });
  assert.equal(nhl.action, 'STAKE');
  assert.equal(nhl.half, false);
  assert.equal(nhl.units, 4);
  assert.deepEqual(nhl.wallets, ['tttt01']);
  assert.equal(v13OpensSide({ pickDate: LIST_DAY, sport: 'NHL', side: 'home', positions: [pos('tttt01')], list }), true);
  // And it does not count against an NBA side either.
  const ahead = runList({ list, positions: [pos('tttt02'), pos('tttt01', 'away'), pos('tttt03', 'away')] });
  assert.equal(ahead.action, 'STAKE');
  assert.equal(ahead.margin, 1);
  assert.equal(ahead.against, 0);
});

// ─── Half stake: ahead only with wallets that are down in units ───

/** up1, up2: profitable on NBA moneylines. down1, down2: 10 or more NBA moneyline bets, down in units. thin1: under 10. */
const MIXED = new Map([
  ['ML|up0001', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA'], played: ['NBA'] }],
  ['ML|up0002', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA'], played: ['NBA'] }],
  ['ML|down01', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [], played: ['NBA'] }],
  ['ML|down02', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [], played: ['NBA'] }],
  ['ML|thin01', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [], played: [] }],
]);

test('a side that is ahead only with wallets down in units takes half the size', () => {
  const half = runList({ list: MIXED, positions: [pos('down01')] });
  assert.equal(half.action, 'STAKE');
  assert.equal(half.half, true);
  assert.equal(half.units, 2);
  assert.equal(half.reason, 'favorite');
  assert.deepEqual(half.wallets, ['down01']);
  assert.equal(half.margin, 1);
  // A profitable wallet on the side makes it the full size.
  const full = runList({ list: MIXED, positions: [pos('up0001')] });
  assert.equal(full.half, false);
  assert.equal(full.units, 4);
  const both = runList({ list: MIXED, positions: [pos('up0001'), pos('down01')] });
  assert.equal(both.half, false);
  assert.equal(both.units, 4);
  assert.equal(both.margin, 2);
  // A wallet with under 10 bets there still opens nothing.
  const thin = runList({ list: MIXED, positions: [pos('thin01')] });
  assert.equal(thin.action, 'PASS');
  assert.equal(thin.reason, 'no_trusted_wallet');
});

test('wallets that are down in units count against a side too', () => {
  // One profitable wallet for, one down wallet against: even, no stake.
  const even = runList({ list: MIXED, positions: [pos('up0001'), pos('down01', 'away')] });
  assert.equal(even.action, 'PASS');
  assert.equal(even.reason, 'trusted_not_ahead');
  assert.equal(even.margin, 0);
  // Two down wallets for, one profitable against: ahead on the wide count only, half.
  const mixed = runList({ list: MIXED, positions: [pos('down01'), pos('down02'), pos('up0001', 'away')] });
  assert.equal(mixed.action, 'STAKE');
  assert.equal(mixed.half, true);
  assert.equal(mixed.margin, 1);
  // Two profitable for, one down against: ahead on both counts, full.
  const full = runList({ list: MIXED, positions: [pos('up0001'), pos('up0002'), pos('down01', 'away')] });
  assert.equal(full.action, 'STAKE');
  assert.equal(full.half, false);
  assert.equal(full.units, 4);
  // The create door opens on the wide count.
  const door = { pickDate: LIST_DAY, sport: 'NBA', side: 'home', list: MIXED };
  assert.equal(v13OpensSide({ ...door, positions: [pos('down01')] }), true);
  assert.equal(v13OpensSide({ ...door, positions: [pos('thin01')] }), false);
  assert.equal(v13OpensSide({ ...door, positions: [pos('up0001'), pos('down01', 'away')] }), false);
});

test('half of every v13 size, to the quarter unit, and the dog cap comes first', () => {
  for (const [full, half] of [[4, 2], [3, 1.5], [2.5, 1.25], [2, 1], [1.5, 0.75], [1, 0.5], [0.75, 0.5], [0.25, 0.25]]) {
    assert.equal(v13HalfStake(full), half, `${full}u`);
  }
  assert.equal(v13HalfStake(0), 0);
  const positions = [pos('down01')];
  // Edge under 0 at −150 or shorter: 2u, half is 1u.
  assert.equal(runList({ list: MIXED, positions, edge: -3, odds: -160 }).units, 1);
  // Edge 10 or more at −150 or shorter: 3u, half is 1.5u.
  assert.equal(runList({ list: MIXED, positions, edge: 12, odds: -160 }).units, 1.5);
  // A shorten of 4.5 up to 10: 0.75u, half is 0.5u.
  assert.equal(runList({ list: MIXED, positions, steam: 6 }).units, 0.5);
  // +130: the long size is 2u, under the 2.5u cap, half is 1u.
  assert.equal(runList({ list: MIXED, positions, odds: 130 }).units, 1);
  // Longer than +200 is still 0, and steam against is still 0.
  assert.equal(runList({ list: MIXED, positions, odds: 240 }).units, 0);
  assert.equal(runList({ list: MIXED, positions, steam: -2 }).action, 'MUTE');
});

// ─── The ladder, from 2026-11-23 ─────────────────────────────

const LADDER_DAY = '2026-11-23';

/** up1, up2 lead with the profitable count. down01 leads on the wide count only. */
function runLadder(over = {}) {
  return applyV13MlPath({
    units: 1,
    pickDate: LADDER_DAY,
    sport: 'NBA',
    market: 'ML',
    side: 'home',
    positions: [pos('up0001')],
    odds: -150,
    steam: 0,
    edge: 6,
    book: book(),
    list: MIXED,
    ...over,
  });
}

const THIN = [pos('down01')];

test('the ladder starts on its day, and the day before keeps the old sizes', () => {
  assert.equal(V13_ML_LADDER_FROM, LADDER_DAY);
  assert.equal(isV13MlLadderLive('2026-11-22'), false);
  assert.equal(isV13MlLadderLive(LADDER_DAY), true);
  assert.equal(isV13MlLadderLive(null), false);
  const before = runLadder({ pickDate: '2026-11-22', odds: -150, edge: 6, steam: 0 });
  assert.equal(before.units, 4);
  assert.equal(before.reason, 'favorite');
  const half = runLadder({ pickDate: '2026-11-22', positions: THIN });
  assert.equal(half.half, true);
  assert.equal(half.units, 2);
  const rescue = runLadder({ pickDate: '2026-11-22', edge: -3, odds: -160 });
  assert.equal(rescue.reason, 'rescue');
  assert.equal(rescue.units, 2);
});

test('the ladder price read: −110 to −199, −200 to −425, and everything longer', () => {
  assert.equal(v13LadderZone(-110), 'band');
  assert.equal(v13LadderZone(-199), 'band');
  assert.equal(v13LadderZone(-200), 'heavy');
  assert.equal(v13LadderZone(-425), 'heavy');
  assert.equal(v13LadderZone(-426), 'juice');
  assert.equal(v13LadderZone(-109), 'plus');
  assert.equal(v13LadderZone(100), 'plus');
  assert.equal(v13LadderZone(200), 'plus');
  assert.equal(v13LadderZone(null, 0.6), 'band');
  assert.equal(v13LadderZone(null, 0.7), 'heavy');
  assert.equal(v13LadderZone(null, 0.5), 'plus');
  assert.equal(v13LadderZone(null, 0.85), 'juice');
  assert.equal(v13LadderZone(null, null), null);
});

test('4: −110 to −199, profitable wallets ahead, edge 5 up to 10', () => {
  for (const [odds, edge] of [[-110, 5], [-150, 6], [-199, 9.99]]) {
    const out = runLadder({ odds, edge });
    assert.equal(out.action, 'STAKE', `${odds} ${edge}`);
    assert.equal(out.units, 4, `${odds} ${edge}`);
    assert.equal(out.zone, 'band');
    assert.equal(out.reason, 'band_lead_edge5');
    assert.equal(out.half, false);
  }
  // Two profitable for and a down wallet against is still ahead on both counts.
  const both = runLadder({ positions: [pos('up0001'), pos('up0002'), pos('down01', 'away')] });
  assert.equal(both.units, 4);
});

test('3: the same band and wallets with an edge of 0 up to 5', () => {
  for (const [odds, edge] of [[-110, 0], [-150, 2.5], [-199, 4.99]]) {
    const out = runLadder({ odds, edge });
    assert.equal(out.action, 'STAKE', `${odds} ${edge}`);
    assert.equal(out.units, 3, `${odds} ${edge}`);
    assert.equal(out.reason, 'band_lead');
  }
});

test('2.5: longer than −110 with profitable wallets ahead, under the dog cap', () => {
  for (const odds of [-109, -105, 100, 110, 120, 150]) {
    const out = runLadder({ odds, edge: 3 });
    assert.equal(out.action, 'STAKE', `${odds}`);
    assert.equal(out.units, 2.5, `${odds}`);
    assert.equal(out.zone, 'plus');
    assert.equal(out.reason, 'plus_lead');
  }
  assert.equal(runLadder({ odds: 151, edge: 3 }).units, 1.5);
  assert.equal(runLadder({ odds: 199, edge: 3 }).units, 1.5);
  assert.equal(runLadder({ odds: 200, edge: 3 }).units, 1);
  const longDog = runLadder({ odds: 201, edge: 3, units: 2 });
  assert.equal(longDog.action, 'MUTE');
  assert.equal(longDog.units, 0);
  assert.equal(longDog.reason, 'dog');
  // The edge does not move this level.
  assert.equal(runLadder({ odds: 110, edge: 9 }).units, 2.5);
});

test('2: −110 to −199 when profitable wallets are not ahead, and it is not a half', () => {
  for (const [odds, edge] of [[-110, 0], [-150, 6], [-199, 9.9]]) {
    const out = runLadder({ positions: THIN, odds, edge });
    assert.equal(out.action, 'STAKE', `${odds} ${edge}`);
    assert.equal(out.units, 2, `${odds} ${edge}`);
    assert.equal(out.reason, 'band');
    assert.equal(out.half, false);
    assert.equal(v13MlStamp(out, { now: 1 }).v8_v13MlHalf, false);
  }
  // Two down wallets for and a profitable one against: ahead on the wide count only.
  const mixed = runLadder({ positions: [pos('down01'), pos('down02'), pos('up0001', 'away')] });
  assert.equal(mixed.units, 2);
});

test('1: heavy favorites, an edge of 10 or more, and plus prices without the profitable lead', () => {
  for (const odds of [-200, -300, -425]) {
    const heavy = runLadder({ odds, edge: 6 });
    assert.equal(heavy.action, 'STAKE', `${odds}`);
    assert.equal(heavy.units, 1, `${odds}`);
    assert.equal(heavy.zone, 'heavy');
    assert.equal(heavy.reason, 'heavy_favorite');
    assert.equal(runLadder({ odds, edge: 6, positions: THIN }).units, 1);
  }
  for (const odds of [-300, -150, -110, 110, 150, 199, 200]) {
    const high = runLadder({ odds, edge: 10 });
    assert.equal(high.action, 'STAKE', `${odds}`);
    assert.equal(high.units, 1, `${odds}`);
    assert.equal(high.reason, 'edge10');
    assert.equal(runLadder({ odds, edge: 22, positions: THIN }).units, 1);
  }
  for (const odds of [-109, 100, 150, 199, 200]) {
    const thin = runLadder({ odds, edge: 4, positions: THIN });
    assert.equal(thin.action, 'STAKE', `${odds}`);
    assert.equal(thin.units, 1, `${odds}`);
    assert.equal(thin.reason, 'plus');
  }
});

test('0: an edge under 0, a missing edge, juice, no price, steam against, and a long dog', () => {
  // The old 2u on an edge under 0 at −150 or shorter is gone.
  for (const odds of [-300, -150, -120, 110]) {
    const under = runLadder({ units: 3, odds, edge: -0.1, steam: null });
    assert.equal(under.action, 'PASS', `${odds}`);
    assert.equal(under.reason, 'edge_under');
    assert.equal(under.units, 3);
    assert.equal(v13MlStamp(under, { now: 1 }).v8_v13MlUnits, 0);
  }
  const noEdge = runLadder({ edge: null });
  assert.equal(noEdge.action, 'PASS');
  assert.equal(noEdge.reason, 'missing_edge');
  const juice = runLadder({ odds: -426 });
  assert.equal(juice.action, 'PASS');
  assert.equal(juice.reason, 'juice');
  const juiceUnder = runLadder({ odds: -500, edge: -4 });
  assert.equal(juiceUnder.reason, 'juice');
  const noPrice = runLadder({ odds: null, price: null });
  assert.equal(noPrice.action, 'PASS');
  assert.equal(noPrice.reason, 'no_price');
  const against = runLadder({ units: 4, steam: -0.1 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(against.reason, 'against');
  assert.equal(runLadder({ edge: 14, steam: -2 }).action, 'MUTE');
  assert.equal(runLadder({ sport: 'SOC', list: LIST, positions: [pos('tttt01')], steam: -2 }).action, 'MUTE');
  assert.equal(runLadder({ odds: 240 }).action, 'MUTE');
});

test('steam does not size the ladder, and a missing steam is not a move against', () => {
  for (const steam of [null, 0, 2, 4.5, 6, 10, 15]) {
    assert.equal(runLadder({ steam, odds: -150, edge: 6 }).units, 4, `steam ${steam}`);
    assert.equal(runLadder({ steam, odds: -150, edge: 2 }).units, 3, `steam ${steam}`);
    assert.equal(runLadder({ steam, odds: 110, edge: 2 }).units, 2.5, `steam ${steam}`);
    assert.equal(runLadder({ steam, odds: -150, edge: 2, positions: THIN }).units, 2, `steam ${steam}`);
    assert.equal(runLadder({ steam, odds: -250, edge: 2 }).units, 1, `steam ${steam}`);
  }
});

test('the wallet gate is unchanged on the ladder', () => {
  const none = runLadder({ positions: [pos('thin01')] });
  assert.equal(none.action, 'PASS');
  assert.equal(none.reason, 'no_trusted_wallet');
  const even = runLadder({ positions: [pos('up0001'), pos('down01', 'away')] });
  assert.equal(even.action, 'PASS');
  assert.equal(even.reason, 'trusted_not_ahead');
  const behind = runLadder({ positions: [pos('up0001'), pos('up0002', 'away'), pos('down01', 'away')] });
  assert.equal(behind.reason, 'trusted_not_ahead');
  const manual = runLadder({ units: 5, manual: true });
  assert.equal(manual.action, 'EXEMPT');
  assert.equal(manual.units, 5);
  const killed = runLadder({ units: 0, killed: true });
  assert.equal(killed.action, 'EXEMPT');
  const spread = runLadder({ market: 'SPREAD', units: 2 });
  assert.equal(spread.action, 'PASS');
  assert.equal(spread.reason, 'not_ml');
  assert.equal(spread.units, 2);
});

test('every sport takes the same ladder', () => {
  const up = [pos('tttt01')];
  for (const sport of ['NHL', 'NBA', 'NFL', 'CFB', 'NCAAF', 'SOC', 'CS2', 'ATP', 'CBB', 'NCAAB', 'LOL', 'UFC', 'MLB', 'WNBA']) {
    const at = (over) => runLadder({ sport, list: LIST, positions: up, ...over });
    assert.equal(at({ odds: -150, edge: 6 }).units, 4, sport);
    assert.equal(at({ odds: -150, edge: 6 }).reason, 'band_lead_edge5', sport);
    assert.equal(at({ odds: -150, edge: 2 }).units, 3, sport);
    assert.equal(at({ odds: 110, edge: 3 }).units, 2.5, sport);
    assert.equal(at({ odds: -300, edge: 3 }).units, 1, sport);
    assert.equal(at({ odds: -150, edge: 14 }).units, 1, sport);
    assert.equal(at({ odds: 200, edge: 3 }).units, 1, sport);
    assert.equal(at({ edge: -1 }).action, 'PASS', sport);
    assert.equal(at({ odds: 240 }).action, 'MUTE', sport);
    assert.equal(at({ odds: -450 }).action, 'PASS', sport);
    assert.equal(at({ steam: -2 }).action, 'MUTE', sport);
  }
  // Profitable wallets not ahead, in a sport outside the fit.
  const soc = new Map([
    ['ML|up0001', { trusted: true, sports: ['SOC'], played: ['SOC'] }],
    ['ML|down01', { trusted: true, sports: [], played: ['SOC'] }],
  ]);
  assert.equal(runLadder({ sport: 'SOC', list: soc, positions: THIN, odds: -150, edge: 6 }).units, 2);
  assert.equal(runLadder({ sport: 'SOC', list: soc, positions: THIN, odds: 120, edge: 6 }).units, 1);
  assert.equal(runLadder({ sport: 'SOC', list: soc, odds: -150, edge: 6 }).units, 4);
  // Three-way: a trusted wallet on the draw counts against home.
  const draw = runLadder({ sport: 'SOC', list: soc, positions: [pos('up0001'), pos('down01', 'draw')] });
  assert.equal(draw.action, 'PASS');
  assert.equal(draw.reason, 'trusted_not_ahead');
});

test('a morning with no list opens on the tier book and sizes without the profitable lead', () => {
  const band = runLadder({ list: new Map(), positions: [pos('aaaaaa')], odds: -150, edge: 6 });
  assert.equal(band.list, 'tier');
  assert.equal(band.action, 'STAKE');
  assert.equal(band.units, 2);
  assert.equal(band.reason, 'band');
  const plus = runLadder({ list: new Map(), positions: [pos('aaaaaa')], odds: 110, edge: 6 });
  assert.equal(plus.units, 1);
  const opposed = runLadder({ list: new Map(), positions: [pos('aaaaaa'), pos('bbbbbb', 'away')] });
  assert.equal(opposed.action, 'PASS');
  assert.equal(opposed.reason, 'qualified_against');
});

test('no ladder size is outside 0, 1, 1.5, 2, 2.5, 3, 4', () => {
  const sizes = new Set();
  for (const sport of ['NBA', 'SOC']) {
    for (const positions of [[pos('up0001')], THIN]) {
      for (const odds of [-430, -426, -425, -300, -201, -200, -199, -150, -111, -110, -109, -100,
        100, 120, 121, 150, 151, 199, 200, 201, 210]) {
        for (const edge of [-2, 0, 4.9, 5, 9.9, 10, 30]) {
          for (const steam of [null, -1, 0, 5, 12]) {
            const list = sport === 'NBA' ? MIXED : new Map([
              ['ML|up0001', { trusted: true, sports: ['SOC'], played: ['SOC'] }],
              ['ML|down01', { trusted: true, sports: [], played: ['SOC'] }],
            ]);
            const out = runLadder({ sport, list, positions, odds, edge, steam, units: 0 });
            if (out.action === 'STAKE') sizes.add(out.units);
            else assert.equal(out.units, 0);
          }
        }
      }
    }
  }
  assert.deepEqual([...sizes].sort((a, b) => a - b), [1, 1.5, 2, 2.5, 3, 4]);
});

// ─── The spread door, from 2026-11-24 ────────────────────────

const DOOR_DAY = '2026-11-24';

/** MIXED plus spread names: sp0001 and sp0002 are up on NBA spreads, spdn01 is down, spthin has under 10 bets. */
const DOOR_LIST = new Map([
  ...MIXED,
  ['SPREAD|sp0001', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA'], played: ['NBA'] }],
  ['SPREAD|sp0002', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA'], played: ['NBA'] }],
  ['SPREAD|spdn01', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [], played: ['NBA'] }],
  ['SPREAD|spthin', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: [], played: [] }],
  ['SPREAD|spoff1', { trusted: false, standing: 0.4, score: -0.01, n: 40, sports: ['NBA'], played: ['NBA'] }],
]);

function sp(wallet, side = 'home') {
  return { wallet, side, marketType: 'SPREAD' };
}

/** No trusted moneyline wallet on the game, one profitable spread wallet on the home spread. */
function runDoor(over = {}) {
  return applyV13MlPath({
    units: 0,
    pickDate: DOOR_DAY,
    sport: 'NBA',
    market: 'ML',
    side: 'home',
    positions: [],
    spreadPositions: [sp('sp0001')],
    odds: -150,
    steam: 0,
    edge: 6,
    book: book(),
    list: DOOR_LIST,
    ...over,
  });
}

test('the spread door starts on its day', () => {
  assert.equal(V13_ML_SPREAD_DOOR_FROM, DOOR_DAY);
  assert.equal(isV13MlSpreadDoorLive('2026-11-23'), false);
  assert.equal(isV13MlSpreadDoorLive(DOOR_DAY), true);
  assert.equal(isV13MlSpreadDoorLive(null), false);
  const before = runDoor({ pickDate: '2026-11-23', units: 2 });
  assert.equal(before.action, 'PASS');
  assert.equal(before.reason, 'no_trusted_wallet');
  assert.equal(before.door, null);
  assert.equal(before.spreadMargin, null);
  assert.equal(before.units, 2);
});

test('a level moneyline count and the spread count ahead on the team goes to the ladder', () => {
  // No trusted moneyline wallet on the game at all.
  const none = runDoor();
  assert.equal(none.action, 'STAKE');
  assert.equal(none.door, 'spread');
  assert.equal(none.spreadMargin, 1);
  assert.deepEqual(none.spreadWallets, ['sp0001']);
  assert.equal(none.margin, 0);
  assert.deepEqual(none.wallets, []);
  assert.equal(none.fires, true);
  // Profitable moneyline wallets are not ahead, so −110 to −199 is 2.
  assert.equal(none.units, 2);
  assert.equal(none.reason, 'band');
  // One trusted moneyline wallet on each side is level too.
  const even = runDoor({ positions: [pos('down01'), pos('down02', 'away')] });
  assert.equal(even.action, 'STAKE');
  assert.equal(even.door, 'spread');
  assert.equal(even.margin, 0);
  assert.equal(even.units, 2);
  // An untrusted moneyline wallet on the other side does not shut it.
  assert.equal(runDoor({ positions: [pos('thin01', 'away')] }).action, 'STAKE');
});

test('the door takes the ladder sizes, and the size still reads the profitable moneyline count', () => {
  assert.equal(runDoor({ odds: -150, edge: 2 }).units, 2);
  assert.equal(runDoor({ odds: -109, edge: 2 }).units, 1);
  assert.equal(runDoor({ odds: -109, edge: 2 }).reason, 'plus');
  assert.equal(runDoor({ odds: 150, edge: 2 }).units, 1);
  assert.equal(runDoor({ odds: -250, edge: 2 }).units, 1);
  assert.equal(runDoor({ odds: -250, edge: 2 }).reason, 'heavy_favorite');
  assert.equal(runDoor({ odds: -150, edge: 12 }).units, 1);
  assert.equal(runDoor({ odds: -150, edge: 12 }).reason, 'edge10');
  // Level on the wide count, ahead on the profitable one: up0001 for, down01 against.
  const lead = runDoor({ positions: [pos('up0001'), pos('down01', 'away')] });
  assert.equal(lead.door, 'spread');
  assert.equal(lead.units, 4);
  assert.equal(lead.reason, 'band_lead_edge5');
  assert.equal(runDoor({ positions: [pos('up0001'), pos('down01', 'away')], edge: 2 }).units, 3);
  assert.equal(runDoor({ positions: [pos('up0001'), pos('down01', 'away')], odds: 110 }).units, 2.5);
});

test('the price gates still rule a side the door let in', () => {
  const under = runDoor({ edge: -0.1 });
  assert.equal(under.action, 'PASS');
  assert.equal(under.reason, 'edge_under');
  assert.equal(under.door, 'spread');
  assert.equal(runDoor({ edge: null }).reason, 'missing_edge');
  const against = runDoor({ units: 2, steam: -0.1 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(runDoor({ steam: null }).action, 'STAKE');
  assert.equal(runDoor({ odds: -426 }).reason, 'juice');
  assert.equal(runDoor({ odds: -426 }).action, 'PASS');
  assert.equal(runDoor({ odds: null, price: null }).reason, 'no_price');
  const dog = runDoor({ odds: 201 });
  assert.equal(dog.action, 'MUTE');
  assert.equal(dog.units, 0);
  assert.equal(dog.reason, 'dog');
  assert.equal(runDoor({ odds: 200 }).units, 1);
});

test('the door stays shut when the spread count is not ahead on the team', () => {
  const empty = runDoor({ spreadPositions: [] });
  assert.equal(empty.action, 'PASS');
  assert.equal(empty.reason, 'no_trusted_wallet');
  assert.equal(empty.door, null);
  assert.equal(empty.spreadMargin, 0);
  assert.equal(runDoor({ spreadPositions: null }).reason, 'no_trusted_wallet');
  assert.equal(runDoor({ spreadPositions: undefined }).action, 'PASS');
  // One for and one against is level.
  const level = runDoor({ spreadPositions: [sp('sp0001'), sp('sp0002', 'away')] });
  assert.equal(level.action, 'PASS');
  assert.equal(level.spreadMargin, 0);
  // On the other team's spread.
  const other = runDoor({ spreadPositions: [sp('sp0001', 'away')] });
  assert.equal(other.action, 'PASS');
  assert.equal(other.spreadMargin, -1);
  assert.equal(runDoor({ side: 'away', spreadPositions: [sp('sp0001', 'away')] }).action, 'STAKE');
  // Trusted but down on spreads in the sport, under 10 bets there, and not trusted: none count.
  for (const w of ['spdn01', 'spthin', 'spoff1', 'nobody']) {
    const out = runDoor({ spreadPositions: [sp(w)] });
    assert.equal(out.action, 'PASS', w);
    assert.equal(out.spreadMargin, 0, w);
  }
  // A moneyline name on the spread does not count, and a moneyline row is not a spread row.
  assert.equal(runDoor({ spreadPositions: [sp('up0001')] }).action, 'PASS');
  assert.equal(runDoor({ spreadPositions: [pos('sp0001')] }).action, 'PASS');
  // Profitable in another sport only.
  assert.equal(runDoor({ sport: 'NHL', spreadPositions: [sp('sp0001')] }).action, 'PASS');
  // A wallet on both spreads counts on its larger ticket.
  const both = runDoor({ spreadPositions: [{ ...sp('sp0001'), invested: 100 }, { ...sp('sp0001', 'away'), invested: 900 }] });
  assert.equal(both.action, 'PASS');
  assert.equal(both.spreadMargin, -1);
});

test('a moneyline count that is behind stays shut, and one that is ahead does not read the door', () => {
  const behind = runDoor({ units: 3, positions: [pos('down01', 'away')], spreadPositions: [sp('sp0001'), sp('sp0002')] });
  assert.equal(behind.action, 'PASS');
  assert.equal(behind.reason, 'no_trusted_wallet');
  assert.equal(behind.door, null);
  // From spread agreement the spread count is stamped on every side.
  assert.equal(behind.spreadMargin, 2);
  assert.equal(behind.units, 3);
  const behind2 = runDoor({ positions: [pos('up0001'), pos('down01', 'away'), pos('down02', 'away')], spreadPositions: [sp('sp0001')] });
  assert.equal(behind2.reason, 'trusted_not_ahead');
  assert.equal(behind2.door, null);
  // Ahead on the moneyline count: the ladder's stake with the spread against it or level.
  const ahead = runDoor({ positions: [pos('up0001')], spreadPositions: [sp('sp0001', 'away'), sp('sp0002', 'away')] });
  assert.equal(ahead.action, 'STAKE');
  assert.equal(ahead.units, 4);
  assert.equal(ahead.door, null);
  assert.equal(ahead.spreadMargin, -2);
  assert.equal(ahead.bump, 0);
  const flat = runDoor({ positions: [pos('up0001')], spreadPositions: [] });
  assert.equal(flat.units, 4);
  assert.equal(flat.door, null);
  assert.equal(flat.bump, 0);
});

test('manual, a kill, another market, and a morning with no list do not read the door', () => {
  assert.equal(runDoor({ units: 5, manual: true }).action, 'EXEMPT');
  assert.equal(runDoor({ units: 5, manual: true }).units, 5);
  assert.equal(runDoor({ killed: true }).action, 'EXEMPT');
  assert.equal(runDoor({ market: 'SPREAD' }).reason, 'not_ml');
  const tier = runDoor({ list: new Map() });
  assert.equal(tier.list, 'tier');
  assert.equal(tier.action, 'PASS');
  assert.equal(tier.reason, 'no_qualified_wallet');
  assert.equal(tier.door, null);
});

test('the door does not open a side on the create pass', () => {
  assert.equal(v13OpensSide({ pickDate: DOOR_DAY, sport: 'NBA', side: 'home', positions: [], list: DOOR_LIST }), false);
  assert.equal(v13OpensSide({ pickDate: DOOR_DAY, sport: 'NBA', side: 'home', positions: [sp('sp0001')], list: DOOR_LIST }), false);
  assert.equal(v13OpensSide({ pickDate: DOOR_DAY, sport: 'NBA', side: 'home', positions: [pos('up0001')], list: DOOR_LIST }), true);
});

test('the stamp says the door, the spread count, and the spread wallets on every side', () => {
  for (const f of ['v8_v13MlDoor', 'v8_v13MlSpreadMargin', 'v8_v13MlSpreadWallets']) {
    assert.ok(V13_ML_STAMP_FIELDS.includes(f), f);
  }
  const open = v13MlStamp(runDoor(), { now: 1 });
  assert.equal(open.v8_v13MlAction, 'STAKE');
  assert.equal(open.v8_v13MlUnits, 2);
  assert.equal(open.v8_v13MlDoor, 'spread');
  assert.equal(open.v8_v13MlSpreadMargin, 1);
  assert.deepEqual(open.v8_v13MlSpreadWallets, ['sp0001']);
  assert.equal(open.v8_v13MlMargin, 0);
  const shut = v13MlStamp(runDoor({ spreadPositions: [sp('sp0001', 'away')] }), { now: 1 });
  assert.equal(shut.v8_v13MlAction, 'PASS');
  assert.equal(shut.v8_v13MlUnits, 0);
  assert.equal(shut.v8_v13MlDoor, null);
  assert.equal(shut.v8_v13MlSpreadMargin, -1);
  assert.deepEqual(shut.v8_v13MlSpreadWallets, []);
  // Ahead on the moneyline count with the spread count ahead: no door, the count, and the bump.
  const ahead = v13MlStamp(runDoor({ positions: [pos('up0001')] }), { now: 1 });
  assert.equal(ahead.v8_v13MlDoor, null);
  assert.equal(ahead.v8_v13MlSpreadMargin, 1);
  assert.deepEqual(ahead.v8_v13MlSpreadWallets, ['sp0001']);
  assert.equal(ahead.v8_v13MlBump, 1);
  assert.equal(ahead.v8_v13MlUnits, 5);
  assert.equal(open.v8_v13MlBump, 0);
  assert.equal(shut.v8_v13MlBump, 0);
  // A side before the door's day clears the fields.
  const early = v13MlStamp(runDoor({ pickDate: '2026-11-23', positions: [pos('up0001')] }), { now: 1 });
  assert.equal(early.v8_v13MlSpreadMargin, null);
  assert.deepEqual(early.v8_v13MlSpreadWallets, []);
  assert.equal(early.v8_v13MlBump, 0);
  for (const f of V13_ML_STAMP_FIELDS) assert.ok(f in open, f);
});

test('no door size is outside the ladder sizes', () => {
  const sizes = new Set();
  for (const positions of [[], [pos('up0001'), pos('down01', 'away')], [pos('down01'), pos('down02', 'away')]]) {
    for (const odds of [-430, -425, -200, -199, -150, -110, -109, 100, 120, 121, 151, 200, 201]) {
      for (const edge of [-2, 0, 4.9, 5, 9.9, 10, 30]) {
        for (const steam of [null, -1, 0, 5]) {
          const out = runDoor({ positions, odds, edge, steam });
          if (out.action === 'STAKE') sizes.add(out.units);
          else assert.equal(out.units, 0);
        }
      }
    }
  }
  assert.deepEqual([...sizes].sort((a, b) => a - b), [1, 1.5, 2, 2.5, 3, 4]);
});

// ─── Spread agreement, from 2026-11-24: the bump and the wide door ───

/** One trusted moneyline wallet that is up (up0001) on the home side, one profitable spread wallet on the home spread. */
function runAgree(over = {}) {
  return runDoor({ positions: [pos('up0001')], spreadPositions: [sp('sp0001')], ...over });
}

const TWO_SPREAD = [sp('sp0001'), sp('sp0002')];

test('spread agreement starts on its day', () => {
  assert.equal(V13_ML_SPREAD_AGREE_FROM, '2026-11-24');
  assert.equal(isV13MlSpreadAgreeLive('2026-11-23'), false);
  assert.equal(isV13MlSpreadAgreeLive('2026-11-24'), true);
  assert.equal(isV13MlSpreadAgreeLive(null), false);
  const before = runAgree({ pickDate: '2026-11-23' });
  assert.equal(before.action, 'STAKE');
  assert.equal(before.units, 4);
  assert.equal(before.bump, 0);
  assert.equal(before.spreadMargin, null);
  const beforeWide = runAgree({ pickDate: '2026-11-23', edge: -1, spreadPositions: TWO_SPREAD });
  assert.equal(beforeWide.action, 'PASS');
  assert.equal(beforeWide.reason, 'edge_under');
});

test('a ladder stake takes 1u more when the spread count is ahead on the team', () => {
  const top = runAgree();
  assert.equal(top.action, 'STAKE');
  assert.equal(top.reason, 'band_lead_edge5');
  assert.equal(top.units, 5);
  assert.equal(top.bump, 1);
  assert.equal(top.door, null);
  assert.equal(top.spreadMargin, 1);
  assert.equal(runAgree({ edge: 2 }).units, 4);
  assert.equal(runAgree({ odds: 110 }).units, 3.5);
  assert.equal(runAgree({ odds: -250 }).units, 2);
  assert.equal(runAgree({ edge: 12 }).units, 2);
  // Ahead on the wide count only (down01 is down in units): 2 at −110 to −199, plus 1.
  const wideOnly = runAgree({ positions: [pos('down01')] });
  assert.equal(wideOnly.reason, 'band');
  assert.equal(wideOnly.units, 3);
  // A spread count of 2 or more is the same 1u.
  assert.equal(runAgree({ spreadPositions: TWO_SPREAD }).units, 5);
  assert.equal(runAgree({ spreadPositions: TWO_SPREAD }).bump, 1);
});

test('the bump is added after the dog cap, and a capped-out dog gets nothing', () => {
  assert.equal(runAgree({ odds: 150 }).units, 3.5);
  assert.equal(runAgree({ odds: 151 }).units, 2.5);
  assert.equal(runAgree({ odds: 200 }).units, 2);
  const dog = runAgree({ odds: 201 });
  assert.equal(dog.action, 'MUTE');
  assert.equal(dog.units, 0);
  assert.equal(dog.bump, 0);
});

test('no bump when the spread count is level or behind, or the ladder has no stake', () => {
  assert.equal(runAgree({ spreadPositions: [] }).units, 4);
  assert.equal(runAgree({ spreadPositions: [sp('sp0001'), sp('sp0002', 'away')] }).units, 4);
  assert.equal(runAgree({ spreadPositions: [sp('sp0001', 'away')] }).units, 4);
  assert.equal(runAgree({ spreadPositions: [sp('spdn01')] }).units, 4);
  assert.equal(runAgree({ spreadPositions: null }).units, 4);
  const under = runAgree({ edge: -1 });
  assert.equal(under.action, 'PASS');
  assert.equal(under.reason, 'edge_under');
  assert.equal(under.bump, 0);
  const against = runAgree({ steam: -1 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(against.bump, 0);
  assert.equal(runAgree({ odds: -426 }).action, 'PASS');
  assert.equal(runAgree({ edge: null }).reason, 'missing_edge');
});

test('a side the spread door let in does not take the bump', () => {
  const door = runDoor();
  assert.equal(door.door, 'spread');
  assert.equal(door.units, 2);
  assert.equal(door.bump, 0);
  const two = runDoor({ spreadPositions: TWO_SPREAD });
  assert.equal(two.door, 'spread');
  assert.equal(two.units, 2);
  assert.equal(two.bump, 0);
});

test('the wide door: spread count ahead by 2 and the moneyline count not behind takes the price size on an edge under 0', () => {
  // Moneyline count ahead, edge under 0.
  const ahead = runAgree({ edge: -3, spreadPositions: TWO_SPREAD });
  assert.equal(ahead.action, 'STAKE');
  assert.equal(ahead.door, 'spread2');
  assert.equal(ahead.reason, 'spread2_band');
  assert.equal(ahead.units, 2);
  assert.equal(ahead.bump, 0);
  assert.equal(ahead.spreadMargin, 2);
  // Moneyline count level, edge under 0.
  const level = runDoor({ edge: -3, spreadPositions: TWO_SPREAD });
  assert.equal(level.action, 'STAKE');
  assert.equal(level.door, 'spread2');
  assert.equal(level.units, 2);
  // No edge number.
  const none = runAgree({ edge: null, spreadPositions: TWO_SPREAD });
  assert.equal(none.action, 'STAKE');
  assert.equal(none.reason, 'spread2_band');
  // The price sizes: 2 at −110 to −199, 1 at −200 to −425, 1 longer than −110.
  const at = (odds) => runAgree({ edge: -3, spreadPositions: TWO_SPREAD, odds });
  assert.equal(at(-199).units, 2);
  assert.equal(at(-110).units, 2);
  assert.equal(at(-200).units, 1);
  assert.equal(at(-200).reason, 'spread2_heavy');
  assert.equal(at(-425).units, 1);
  assert.equal(at(-109).units, 1);
  assert.equal(at(-109).reason, 'spread2_plus');
  assert.equal(at(150).units, 1);
  assert.equal(at(200).units, 1);
  // The profitable moneyline count does not change a price size.
  assert.equal(runAgree({ edge: -3, spreadPositions: TWO_SPREAD, positions: [pos('down01')] }).units, 2);
});

test('the wide door keeps the price gates: juice, no price, steam against, and the dog cap', () => {
  const at = (over) => runAgree({ edge: -3, spreadPositions: TWO_SPREAD, ...over });
  assert.equal(at({ odds: -426 }).action, 'PASS');
  assert.equal(at({ odds: -426 }).reason, 'juice');
  assert.equal(at({ odds: null, price: null }).reason, 'no_price');
  const against = at({ steam: -0.1 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.units, 0);
  assert.equal(at({ steam: null }).action, 'STAKE');
  const dog = at({ odds: 201 });
  assert.equal(dog.action, 'MUTE');
  assert.equal(dog.reason, 'dog');
  assert.equal(dog.units, 0);
});

test('the wide door needs 2 on the spread count and a moneyline count that is not behind', () => {
  // Spread count of 1: the ladder's answer.
  assert.equal(runAgree({ edge: -3 }).reason, 'edge_under');
  assert.equal(runDoor({ edge: -3 }).reason, 'edge_under');
  // Two for and one against is 1.
  assert.equal(runAgree({ edge: -3, spreadPositions: [...TWO_SPREAD, sp('spdn01', 'away')] }).action, 'STAKE');
  assert.equal(runAgree({ edge: -3, spreadPositions: [sp('sp0001'), sp('spdn01')] }).reason, 'edge_under');
  // Moneyline count behind stays shut whatever the spread count is.
  const behind = runDoor({ edge: -3, positions: [pos('down01', 'away')], spreadPositions: TWO_SPREAD });
  assert.equal(behind.action, 'PASS');
  assert.equal(behind.door, null);
  // On an edge of 0 or more the ladder sizes it: the bump when the moneyline count is ahead, the spread door when level.
  const ladder = runAgree({ edge: 6, spreadPositions: TWO_SPREAD });
  assert.equal(ladder.door, null);
  assert.equal(ladder.units, 5);
  const levelLadder = runDoor({ edge: 6, spreadPositions: TWO_SPREAD });
  assert.equal(levelLadder.door, 'spread');
  assert.equal(levelLadder.units, 2);
});

test('the wide door opens a side on the create pass, and v13OpensSide is unchanged', () => {
  const at = (over) => v13SpreadWideOpensSide({
    pickDate: DOOR_DAY, sport: 'NBA', side: 'home', positions: [], spreadPositions: TWO_SPREAD, list: DOOR_LIST, ...over,
  });
  assert.equal(at(), true);
  assert.equal(at({ positions: [pos('up0001')] }), true);
  assert.equal(at({ positions: [pos('down01'), pos('down02', 'away')] }), true);
  assert.equal(at({ positions: [pos('down01', 'away')] }), false);
  assert.equal(at({ spreadPositions: [sp('sp0001')] }), false);
  assert.equal(at({ spreadPositions: [] }), false);
  assert.equal(at({ spreadPositions: null }), false);
  assert.equal(at({ side: 'away' }), false);
  assert.equal(at({ pickDate: '2026-11-23' }), false);
  assert.equal(at({ list: new Map() }), false);
  assert.equal(at({ sport: 'NHL' }), false);
  assert.equal(v13OpensSide({ pickDate: DOOR_DAY, sport: 'NBA', side: 'home', positions: [], list: DOOR_LIST }), false);
  assert.equal(V13_ML_SPREAD_WIDE_PROMOTED_BY, 'v13-spread-door');
  assert.equal(V13_ML_OPENED_BY_FIELD, 'v8_v13MlOpenedBy');
});

test('a side the wide door opened is the price size whatever the edge, and no stake once the door shuts', () => {
  const opened = (over) => runDoor({ opened: true, spreadPositions: TWO_SPREAD, ...over });
  // An edge the ladder would size at 4 is still the price size.
  const up = opened({ positions: [pos('up0001')], edge: 6 });
  assert.equal(up.action, 'STAKE');
  assert.equal(up.door, 'spread2');
  assert.equal(up.units, 2);
  assert.equal(up.bump, 0);
  assert.equal(opened({ edge: 6 }).units, 2);
  assert.equal(opened({ edge: null }).units, 2);
  assert.equal(opened({ edge: 30, odds: -250 }).units, 1);
  assert.equal(opened({ edge: 6, odds: 130 }).units, 1);
  assert.equal(opened({ odds: -426 }).action, 'PASS');
  assert.equal(opened({ steam: -1 }).action, 'MUTE');
  // The spread count falls to 1, or the moneyline count falls behind: no stake.
  const shut = opened({ units: 2, positions: [pos('up0001')], edge: 6, spreadPositions: [sp('sp0001')] });
  assert.equal(shut.action, 'PASS');
  assert.equal(shut.reason, 'spread_door_shut');
  assert.equal(shut.door, null);
  assert.equal(shut.bump, 0);
  assert.equal(opened({ positions: [pos('down01', 'away')] }).reason, 'spread_door_shut');
  assert.equal(opened({ spreadPositions: [] }).reason, 'spread_door_shut');
  // The flag is not read before the day or on a morning with no list.
  assert.equal(runDoor({ opened: true, pickDate: '2026-11-23', positions: [pos('up0001')], spreadPositions: [] }).units, 4);
  assert.equal(runDoor({ opened: true, list: new Map() }).reason, 'no_qualified_wallet');
});

test('the largest size with the bump is 5, and a price size is 1 or 2', () => {
  const sizes = new Set();
  const doorSizes = new Set();
  for (const positions of [[], [pos('up0001')], [pos('down01')], [pos('up0001'), pos('down01', 'away')]]) {
    for (const spreadPositions of [[], [sp('sp0001')], TWO_SPREAD]) {
      for (const odds of [-430, -425, -200, -199, -150, -110, -109, 100, 120, 121, 151, 200, 201]) {
        for (const edge of [null, -2, 0, 4.9, 5, 9.9, 10, 30]) {
          for (const steam of [null, -1, 0, 5]) {
            for (const opened of [false, true]) {
              const out = runDoor({ positions, spreadPositions, odds, edge, steam, opened });
              if (out.action === 'STAKE') {
                sizes.add(out.units);
                if (out.door === 'spread2') doorSizes.add(out.units);
                if (opened) assert.equal(out.door, 'spread2');
              } else {
                assert.equal(out.units, 0);
                assert.equal(out.bump, 0);
              }
            }
          }
        }
      }
    }
  }
  assert.deepEqual([...sizes].sort((a, b) => a - b), [1, 1.5, 2, 2.5, 3, 3.5, 4, 5]);
  assert.deepEqual([...doorSizes].sort((a, b) => a - b), [1, 2]);
});
