import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRUSTED_SPREAD_LADDER_FROM,
  TRUSTED_SPREAD_OWNS_FROM,
  TRUSTED_SPREAD_STAMP_FIELDS,
  TRUSTED_SPREAD_UNITS,
  applyTrustedSpreadPath,
  trustedSpreadLadderLive,
  trustedSpreadLive,
  trustedSpreadOwns,
  trustedSpreadStamp,
} from './trustedSpreadPath.js';

// The older rule: 2026-11-20 through 2026-11-21.
const DAY = '2026-11-21';

function listOf(...wallets) {
  const index = new Map();
  for (const w of wallets) index.set(`SPREAD|${w}`, {
    trusted: true, standing: 0.9, score: 0.02, n: 20, sports: ['NBA', 'NFL', 'CFB', 'NHL'],
  });
  // A moneyline name that must never count on a spread.
  index.set('ML|mlonly', {
    trusted: true, standing: 0.95, score: 0.03, n: 30, sports: ['NBA', 'NFL', 'CFB', 'NHL'],
  });
  return index;
}

function pos(wallet, side, invested = 500, marketType = 'SPREAD') {
  return { wallet: `0x0000${wallet}`, walletShort: wallet, side, invested, marketType };
}

const LIST = listOf('aaaaa1', 'aaaaa2', 'aaaaa3', 'aaaaa4', 'bbbbb1', 'bbbbb2');
const THREE_HOME = [pos('aaaaa1', 'home'), pos('aaaaa2', 'home'), pos('aaaaa3', 'home')];

function run(over = {}) {
  return applyTrustedSpreadPath({
    units: 0, pickDate: DAY, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: THREE_HOME, odds: -110, score: 0.6, list: LIST, ...over,
  });
}

test('ahead by 3 at a price shorter than +100 on a v12 side: 0 becomes 2u', () => {
  const p = run();
  assert.equal(p.action, 'STAKE');
  assert.equal(p.reason, 'ahead_3_rescue');
  assert.equal(p.units, TRUSTED_SPREAD_UNITS);
  assert.equal(p.unitsPre, 0);
  assert.equal(p.margin, 3);
  assert.deepEqual(p.wallets, ['aaaaa1', 'aaaaa2', 'aaaaa3']);
});

test('a stake under 2u is raised to 2u, and 2u or more stays', () => {
  const low = run({ units: 1 });
  assert.equal(low.action, 'STAKE');
  assert.equal(low.reason, 'ahead_3_floor');
  assert.equal(low.units, 2);
  for (const units of [2, 3, 4]) {
    const p = run({ units });
    assert.equal(p.action, 'PASS');
    assert.equal(p.reason, 'stake_stands');
    assert.equal(p.units, units);
  }
});

test('ahead by 2 stays on the stake that arrived', () => {
  for (const units of [0, 3]) {
    const p = run({ units, positions: THREE_HOME.slice(0, 2) });
    assert.equal(p.action, 'PASS');
    assert.equal(p.reason, 'not_ahead_3');
    assert.equal(p.units, units);
    assert.equal(p.margin, 2);
  }
});

test('the count is for minus against: 4 on, 1 against is 3; 3 on, 1 against is 2', () => {
  const four = run({ positions: [...THREE_HOME, pos('aaaaa4', 'home'), pos('bbbbb1', 'away')] });
  assert.equal(four.margin, 3);
  assert.equal(four.action, 'STAKE');
  const three = run({ positions: [...THREE_HOME, pos('bbbbb1', 'away')] });
  assert.equal(three.margin, 2);
  assert.equal(three.action, 'PASS');
});

test('behind: a stake goes to 0, and a side already at 0 is left alone', () => {
  const positions = [pos('aaaaa1', 'home'), pos('bbbbb1', 'away'), pos('bbbbb2', 'away')];
  const staked = run({ units: 3, positions });
  assert.equal(staked.action, 'MUTE');
  assert.equal(staked.reason, 'behind');
  assert.equal(staked.units, 0);
  assert.equal(staked.unitsPre, 3);
  assert.equal(staked.margin, -1);
  const flat = run({ units: 0, positions });
  assert.equal(flat.action, 'PASS');
  assert.equal(flat.reason, 'behind_no_stake');
  assert.equal(flat.units, 0);
});

test('even and nobody on the list stay', () => {
  const even = run({ units: 3, positions: [pos('aaaaa1', 'home'), pos('bbbbb1', 'away')] });
  assert.equal(even.action, 'PASS');
  assert.equal(even.units, 3);
  const none = run({ units: 3, positions: [pos('zzzzz9', 'home'), pos('zzzzz8', 'away')] });
  assert.equal(none.action, 'PASS');
  assert.equal(none.reason, 'no_trusted_wallet');
  assert.equal(none.units, 3);
});

test('+100 or longer does not rescue; −101 does; a price reads when there is no American number', () => {
  assert.equal(run({ odds: 100 }).reason, 'plus_price');
  assert.equal(run({ odds: 105 }).action, 'PASS');
  assert.equal(run({ odds: -101 }).action, 'STAKE');
  assert.equal(run({ odds: null, price: 0.52 }).action, 'STAKE');
  assert.equal(run({ odds: null, price: 0.5 }).reason, 'plus_price');
  assert.equal(run({ odds: null, price: null }).reason, 'no_price');
  assert.equal(run({ odds: -450 }).reason, 'juice');
});

test('the rescue needs a positive v12 score; the mute does not', () => {
  assert.equal(run({ score: 0 }).reason, 'no_v12_score');
  assert.equal(run({ score: -0.4 }).action, 'PASS');
  assert.equal(run({ score: null }).action, 'PASS');
  const positions = [pos('bbbbb1', 'away')];
  assert.equal(run({ units: 2, score: null, positions }).action, 'MUTE');
});

test('NHL, another market, an earlier date, manual, and a kill change nothing', () => {
  const nhl = run({ sport: 'NHL', units: 3, positions: [pos('bbbbb1', 'away')] });
  assert.equal(nhl.action, 'PASS');
  assert.equal(nhl.reason, 'sport');
  assert.equal(nhl.units, 3);
  assert.equal(run({ sport: 'CBB' }).reason, 'sport');
  assert.equal(run({ market: 'ML' }).reason, 'not_spread');
  assert.equal(run({ market: 'TOTAL' }).reason, 'not_spread');
  assert.equal(run({ pickDate: '2026-11-19' }).action, 'EXEMPT');
  assert.equal(run({ manual: true }).action, 'EXEMPT');
  assert.equal(run({ killed: true }).action, 'EXEMPT');
  assert.equal(run({ manual: true }).units, 0);
  for (const sport of ['NBA', 'NFL', 'CFB', 'NCAAF']) assert.equal(run({ sport }).action, 'STAKE');
});

test('a morning with no list changes nothing', () => {
  const p = run({ units: 3, list: new Map(), positions: [pos('bbbbb1', 'away')] });
  assert.equal(p.action, 'PASS');
  assert.equal(p.reason, 'no_list');
  assert.equal(p.units, 3);
  assert.equal(trustedSpreadLive(DAY, 'NBA', new Map()), false);
  assert.equal(trustedSpreadLive(DAY, 'NBA', LIST), true);
  assert.equal(trustedSpreadLive(DAY, 'NHL', LIST), false);
});

test('a moneyline list name and a moneyline position do not count on a spread', () => {
  const p = run({
    positions: [
      pos('aaaaa1', 'home'), pos('aaaaa2', 'home'),
      pos('mlonly', 'home'),
      pos('aaaaa3', 'home', 500, 'ML'),
    ],
  });
  assert.equal(p.margin, 2);
  assert.equal(p.action, 'PASS');
});

test('a wallet on both sides counts once, on its larger ticket', () => {
  const p = run({
    positions: [...THREE_HOME, pos('aaaaa4', 'home', 100), pos('aaaaa4', 'away', 900)],
  });
  assert.deepEqual(p.against, ['aaaaa4']);
  assert.equal(p.margin, 2);
});

test('the stamp carries every field on every action', () => {
  for (const p of [run(), run({ units: 3, positions: [pos('bbbbb1', 'away')] }), run({ odds: 120 }), run({ manual: true })]) {
    const stamp = trustedSpreadStamp(p);
    assert.deepEqual(Object.keys(stamp).sort(), [...TRUSTED_SPREAD_STAMP_FIELDS].sort());
    assert.equal(stamp.v8_trustedSpread, p.action === 'STAKE' || p.action === 'MUTE');
    assert.equal(stamp.v8_trustedSpreadUnits, p.units);
  }
  assert.deepEqual(trustedSpreadStamp(run({ market: 'ML' })), {});
  assert.deepEqual(trustedSpreadStamp(run({ pickDate: '2026-11-19' })), {});
  assert.deepEqual(trustedSpreadStamp(null), {});
});

test('a trusted spread wallet counts only in a sport where it is profitable on 10 bets', () => {
  const list = new Map();
  for (const w of ['aaaaa1', 'aaaaa2']) list.set(`SPREAD|${w}`, { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['NBA', 'CFB'] });
  list.set('SPREAD|aaaaa3', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['CFB'] });
  // NBA: the third wallet is not profitable there, so the side is ahead by 2 and stays.
  const nba = run({ list });
  assert.equal(nba.margin, 2);
  assert.equal(nba.action, 'PASS');
  assert.equal(nba.units, 0);
  // CFB: all three count.
  const cfb = run({ list, sport: 'CFB' });
  assert.equal(cfb.margin, 3);
  assert.equal(cfb.action, 'STAKE');
  assert.equal(cfb.units, TRUSTED_SPREAD_UNITS);
  // A wallet that is not profitable there does not mute a stake from the other side.
  const behind = run({ list, units: 3, side: 'away', positions: [pos('aaaaa3', 'home')] });
  assert.equal(behind.margin, 0);
  assert.equal(behind.units, 3);
});

// ─── From 2026-11-22: the path owns the spread stake ─────────────────────

const OWN = '2026-11-22';

/** `trusted` are the wallets that count on a side. `records` is wallet → record, trusted or not. */
function ownList({ trusted = [], records = {} } = {}) {
  const index = new Map();
  for (const w of trusted) {
    index.set(`SPREAD|${w}`, {
      trusted: true, standing: 0.9, score: 0.02, n: 20, sports: ['NBA', 'NFL', 'CFB'], record: null,
    });
  }
  for (const [w, z] of Object.entries(records)) {
    const had = index.get(`SPREAD|${w}`);
    if (had) had.record = z;
    else index.set(`SPREAD|${w}`, { trusted: false, standing: null, score: null, n: 20, sports: [], played: [], record: z });
  }
  return index;
}

function own(over = {}) {
  return applyTrustedSpreadPath({
    units: 0, pickDate: OWN, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: [pos('aaaaa1', 'home')], odds: -110, score: null,
    list: ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 2.5 } }), ...over,
  });
}

test('the path owns the stake from 2026-11-22, and not a day before', () => {
  assert.equal(TRUSTED_SPREAD_OWNS_FROM, '2026-11-22');
  assert.equal(trustedSpreadOwns('2026-11-21'), false);
  assert.equal(trustedSpreadOwns('2026-11-22'), true);
  assert.equal(trustedSpreadOwns(null), false);
  assert.equal(own().rule, 'gate');
  assert.equal(run().rule, 'ahead_3');
});

test('count ahead by 1 and records ahead by 2 at a short price: 2u, with no v12 score', () => {
  const p = own();
  assert.equal(p.action, 'STAKE');
  assert.equal(p.reason, 'gate');
  assert.equal(p.units, 2);
  assert.equal(p.margin, 1);
  assert.equal(p.recordLead, 2.5);
  for (const score of [null, 0, -0.8, 0.9]) assert.equal(own({ score }).units, 2);
});

test('the ladder sets the stake whatever arrived: 4u comes down to 2u, 1u goes up to 2u', () => {
  for (const units of [0, 0.75, 1, 2, 3, 4, 6]) {
    const p = own({ units });
    assert.equal(p.action, 'STAKE');
    assert.equal(p.units, 2);
    assert.equal(p.unitsPre, units);
  }
});

test('count ahead by 2 and records ahead by 4 at a short price: 3u', () => {
  const list = ownList({ trusted: ['aaaaa1', 'aaaaa2'], records: { aaaaa1: 2.5, aaaaa2: 1.5 } });
  const positions = [pos('aaaaa1', 'home'), pos('aaaaa2', 'home')];
  const p = own({ list, positions });
  assert.equal(p.action, 'STAKE');
  assert.equal(p.reason, 'gate_top');
  assert.equal(p.units, 3);
  // Records ahead by 3.9: the count is there, the records are not. 2u.
  const short = own({ list: ownList({ trusted: ['aaaaa1', 'aaaaa2'], records: { aaaaa1: 2.5, aaaaa2: 1.4 } }), positions });
  assert.equal(short.units, 2);
  // Records ahead by 4 on a count of 1: 2u.
  const one = own({ list: ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 4.5 } }) });
  assert.equal(one.units, 2);
  assert.equal(one.reason, 'gate');
});

test('+100 or longer inside the gate is 1u, top cell or not', () => {
  assert.equal(own({ odds: 100 }).units, 1);
  assert.equal(own({ odds: 100 }).reason, 'gate_plus_price');
  assert.equal(own({ odds: 104, units: 4 }).units, 1);
  assert.equal(own({ odds: -101 }).units, 2);
  assert.equal(own({ odds: null, price: 0.5 }).units, 1);
  assert.equal(own({ odds: null, price: 0.52 }).units, 2);
  const list = ownList({ trusted: ['aaaaa1', 'aaaaa2'], records: { aaaaa1: 3, aaaaa2: 3 } });
  const top = own({ list, positions: [pos('aaaaa1', 'home'), pos('aaaaa2', 'home')], odds: 102 });
  assert.equal(top.units, 1);
});

test('records ahead by under 2: a stake goes to 0, and a side at 0 is left alone', () => {
  const list = ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 1.9 } });
  const staked = own({ list, units: 4 });
  assert.equal(staked.action, 'MUTE');
  assert.equal(staked.reason, 'records_not_ahead');
  assert.equal(staked.units, 0);
  assert.equal(staked.unitsPre, 4);
  const flat = own({ list });
  assert.equal(flat.action, 'PASS');
  assert.equal(flat.reason, 'records_not_ahead_no_stake');
  assert.equal(flat.units, 0);
  // Exactly 2 is in.
  assert.equal(own({ list: ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 2 } }) }).action, 'STAKE');
});

test('every wallet with a record counts in the records, trusted or not, on both sides', () => {
  // A trusted wallet at +1.0 and two untrusted winners at +0.8 each: 2.6 for.
  const list = ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 1.0, ccccc1: 0.8, ccccc2: 0.8, ddddd1: -3.0, ddddd2: 1.5 } });
  const forOnly = [pos('aaaaa1', 'home'), pos('ccccc1', 'home'), pos('ccccc2', 'home')];
  const p = own({ list, positions: forOnly });
  assert.equal(p.margin, 1);
  assert.ok(Math.abs(p.recordFor - 2.6) < 1e-9);
  assert.equal(p.action, 'STAKE');
  // A loser on the other side adds to the lead: 2.6 − (−3.0) = 5.6.
  const fade = own({ list, positions: [...forOnly, pos('ddddd1', 'away')] });
  assert.ok(Math.abs(fade.recordLead - 5.6) < 1e-9);
  assert.equal(fade.units, 2);
  // A winner on the other side takes it away: 2.6 − 1.5 = 1.1. The stake goes to 0.
  const opposed = own({ list, units: 3, positions: [...forOnly, pos('ddddd2', 'away')] });
  assert.ok(Math.abs(opposed.recordLead - 1.1) < 1e-9);
  assert.equal(opposed.action, 'MUTE');
  // A wallet with no record adds nothing.
  const none = own({ list, positions: [...forOnly, pos('zzzzz9', 'away')] });
  assert.ok(Math.abs(none.recordLead - 2.6) < 1e-9);
});

test('records ahead without the count ahead is 0: level, nobody trusted, and behind', () => {
  const list = ownList({ trusted: ['aaaaa1', 'bbbbb1'], records: { aaaaa1: 5, bbbbb1: -5, ccccc1: 6 } });
  const level = own({ list, units: 3, positions: [pos('aaaaa1', 'home'), pos('bbbbb1', 'away')] });
  assert.equal(level.margin, 0);
  assert.equal(level.recordLead, 10);
  assert.equal(level.action, 'MUTE');
  assert.equal(level.reason, 'not_ahead');
  const nobody = own({ list, units: 3, positions: [pos('ccccc1', 'home')] });
  assert.equal(nobody.action, 'MUTE');
  assert.equal(nobody.reason, 'no_trusted_wallet');
  assert.equal(own({ list, units: 0, positions: [pos('ccccc1', 'home')] }).action, 'PASS');
  const behind = own({ list, units: 3, side: 'away', positions: [pos('aaaaa1', 'home')] });
  assert.equal(behind.action, 'MUTE');
  assert.equal(behind.reason, 'behind');
  assert.equal(own({ list, units: 0, side: 'away', positions: [pos('aaaaa1', 'home')] }).reason, 'behind_no_stake');
});

test('a wallet on both sides adds its record once, on its larger ticket', () => {
  const list = ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 2.5, ccccc1: 3 } });
  const p = own({ list, positions: [pos('aaaaa1', 'home'), pos('ccccc1', 'home', 100), pos('ccccc1', 'away', 900)] });
  assert.equal(p.recordFor, 2.5);
  assert.equal(p.recordAgainst, 3);
  assert.equal(p.recordLead, -0.5);
  assert.equal(p.action, 'PASS');
});

test('a moneyline position adds no record on a spread', () => {
  const list = ownList({ trusted: ['aaaaa1'], records: { aaaaa1: 1, ccccc1: 3 } });
  const p = own({ list, positions: [pos('aaaaa1', 'home'), pos('ccccc1', 'home', 500, 'ML')] });
  assert.equal(p.recordLead, 1);
  assert.equal(p.action, 'PASS');
});

test('inside the gate with no price, or a price juicier than −425, the stake that arrived stays', () => {
  const noPrice = own({ units: 3, odds: null, price: null });
  assert.equal(noPrice.action, 'PASS');
  assert.equal(noPrice.reason, 'no_price');
  assert.equal(noPrice.units, 3);
  const juice = own({ units: 3, odds: -450 });
  assert.equal(juice.reason, 'juice');
  assert.equal(juice.units, 3);
  // Outside the gate the price is not read: the stake goes to 0.
  const out = own({ units: 3, odds: null, price: null, positions: [pos('zzzzz9', 'home')] });
  assert.equal(out.action, 'MUTE');
});

test('NHL, CBB, another market, manual, and a kill change nothing after 2026-11-22', () => {
  const stray = [pos('zzzzz9', 'home')];
  for (const sport of ['NHL', 'CBB', 'MLB', 'SOC']) {
    const p = own({ sport, units: 3, positions: stray });
    assert.equal(p.action, 'PASS');
    assert.equal(p.reason, 'sport');
    assert.equal(p.units, 3);
  }
  assert.equal(own({ market: 'TOTAL', units: 3, positions: stray }).units, 3);
  assert.equal(own({ market: 'ML', units: 3, positions: stray }).units, 3);
  const manual = own({ manual: true, units: 5, positions: stray });
  assert.equal(manual.action, 'EXEMPT');
  assert.equal(manual.units, 5);
  const killed = own({ killed: true, units: 0 });
  assert.equal(killed.action, 'EXEMPT');
  assert.equal(killed.units, 0);
  for (const sport of ['NBA', 'NFL', 'CFB', 'NCAAF']) assert.equal(own({ sport }).action, 'STAKE');
});

test('a morning with no list, or a list with no records, leaves every stake alone', () => {
  const stray = [pos('zzzzz9', 'home')];
  const noList = own({ list: new Map(), units: 3, positions: stray });
  assert.equal(noList.action, 'PASS');
  assert.equal(noList.reason, 'no_list');
  assert.equal(noList.units, 3);
  const noRecords = own({ list: ownList({ trusted: ['aaaaa1'] }), units: 3, positions: stray });
  assert.equal(noRecords.action, 'PASS');
  assert.equal(noRecords.reason, 'no_records');
  assert.equal(noRecords.units, 3);
  // The gate cannot fire without records either.
  assert.equal(own({ list: ownList({ trusted: ['aaaaa1'] }) }).action, 'PASS');
});

test('the count still needs the wallet profitable in that sport', () => {
  const list = ownList({ records: { aaaaa1: 4 } });
  list.set('SPREAD|aaaaa1', { trusted: true, standing: 0.9, score: 0.02, n: 40, sports: ['CFB'], record: 4 });
  assert.equal(own({ list, sport: 'CFB' }).action, 'STAKE');
  const nba = own({ list, units: 3 });
  assert.equal(nba.margin, 0);
  assert.equal(nba.action, 'MUTE');
});

test('the stamp carries the rule and the records on every action', () => {
  const cases = [
    own(), own({ units: 3, positions: [pos('zzzzz9', 'home')] }), own({ odds: 120 }), own({ manual: true }), run(),
  ];
  for (const p of cases) {
    const stamp = trustedSpreadStamp(p);
    assert.deepEqual(Object.keys(stamp).sort(), [...TRUSTED_SPREAD_STAMP_FIELDS].sort());
    assert.equal(stamp.v8_trustedSpreadRule, p.rule);
    assert.equal(stamp.v8_trustedSpreadUnits, p.units);
  }
  const stamp = trustedSpreadStamp(own());
  assert.equal(stamp.v8_trustedSpreadRecordLead, 2.5);
  assert.equal(stamp.v8_trustedSpreadRecordFor, 2.5);
  assert.equal(stamp.v8_trustedSpreadRecordAgainst, 0);
  assert.equal(trustedSpreadStamp(run()).v8_trustedSpreadRecordLead, null);
});

// ─── From 2026-11-23: the ladder, on every sport ─────────────────────────

const LADDER = '2026-11-23';

/** Like ownList, with every wallet profitable in every sport named. */
function ladderList({ trusted = [], records = {}, sports = ['NBA', 'NFL', 'CFB', 'NHL', 'CBB', 'MLB'] } = {}) {
  const index = ownList({ trusted, records });
  for (const w of trusted) index.get(`SPREAD|${w}`).sports = sports;
  return index;
}

function lad(over = {}) {
  return applyTrustedSpreadPath({
    units: 0, pickDate: LADDER, sport: 'NBA', market: 'SPREAD', side: 'home',
    positions: [pos('aaaaa1', 'home')], odds: -110, line: -4.5, score: null,
    list: ladderList({ trusted: ['aaaaa1'], records: { aaaaa1: 2.5 } }), ...over,
  });
}

const LEAD4 = ladderList({ trusted: ['aaaaa1'], records: { aaaaa1: 4 } });

test('the ladder starts 2026-11-23, and the day before still reads the first ladder', () => {
  assert.equal(TRUSTED_SPREAD_LADDER_FROM, '2026-11-23');
  assert.equal(trustedSpreadLadderLive('2026-11-22'), false);
  assert.equal(trustedSpreadLadderLive('2026-11-23'), true);
  assert.equal(trustedSpreadLadderLive(null), false);
  assert.equal(lad().rule, 'ladder');
  assert.equal(lad({ pickDate: OWN }).rule, 'gate');
  assert.equal(lad({ pickDate: OWN }).units, 2);
});

test('a short price with the records ahead by 4 is 3u, on a count of 1', () => {
  const p = lad({ list: LEAD4 });
  assert.equal(p.action, 'STAKE');
  assert.equal(p.reason, 'records_4');
  assert.equal(p.units, 3);
  assert.equal(p.margin, 1);
  for (const score of [null, 0, -0.8, 0.9]) assert.equal(lad({ list: LEAD4, score }).units, 3);
  // The line is not read at a short price.
  for (const line of [null, -1.5, -14.5, 21]) assert.equal(lad({ list: LEAD4, line }).units, 3);
});

test('a short price with the records ahead by 2 up to 4 is 1u', () => {
  const p = lad();
  assert.equal(p.action, 'STAKE');
  assert.equal(p.reason, 'records_2');
  assert.equal(p.units, 1);
  const near = lad({ list: ladderList({ trusted: ['aaaaa1'], records: { aaaaa1: 3.99 } }) });
  assert.equal(near.units, 1);
  // A count of 2 does not lift it: only the records set the size.
  const two = lad({
    list: ladderList({ trusted: ['aaaaa1', 'aaaaa2'], records: { aaaaa1: 2, aaaaa2: 1.5 } }),
    positions: [pos('aaaaa1', 'home'), pos('aaaaa2', 'home')],
  });
  assert.equal(two.margin, 2);
  assert.equal(two.units, 1);
});

test('the ladder sets the stake whatever arrived', () => {
  for (const units of [0, 0.75, 1, 2, 3, 4, 6]) {
    assert.equal(lad({ units }).units, 1);
    assert.equal(lad({ units }).unitsPre, units);
    assert.equal(lad({ units, list: LEAD4 }).units, 3);
  }
});

test('+100 or longer: 1u on a line of 7 or under, 0 over 7, laying or taking', () => {
  for (const line of [-7, 7, 3.5, -1.5, 0]) {
    const p = lad({ odds: 102, line, list: LEAD4 });
    assert.equal(p.action, 'STAKE');
    assert.equal(p.reason, 'plus_short_line');
    assert.equal(p.units, 1);
    assert.equal(p.line, line);
  }
  for (const line of [7.5, -7.5, 13.5, -21]) {
    const staked = lad({ odds: 102, line, units: 3 });
    assert.equal(staked.action, 'MUTE');
    assert.equal(staked.reason, 'plus_long_line');
    assert.equal(staked.units, 0);
    const flat = lad({ odds: 102, line });
    assert.equal(flat.action, 'PASS');
    assert.equal(flat.reason, 'plus_long_line_no_stake');
    assert.equal(flat.units, 0);
  }
  assert.equal(lad({ odds: 100, line: 3 }).units, 1);
  assert.equal(lad({ odds: 100, line: 9, units: 2 }).units, 0);
  assert.equal(lad({ odds: -101, line: 9 }).units, 1);
  assert.equal(lad({ odds: null, price: 0.5, line: 9, units: 2 }).units, 0);
  assert.equal(lad({ odds: null, price: 0.52, line: 9 }).units, 1);
});

test('+100 or longer with no line is 0', () => {
  for (const line of [null, undefined, '', 'x']) {
    const p = lad({ odds: 105, line, units: 2 });
    assert.equal(p.action, 'MUTE');
    assert.equal(p.reason, 'plus_no_line');
    assert.equal(p.units, 0);
  }
});

test('inside the gate with no price, or a price juicier than −425, is 0', () => {
  const noPrice = lad({ units: 3, odds: null, price: null });
  assert.equal(noPrice.action, 'MUTE');
  assert.equal(noPrice.reason, 'no_price');
  assert.equal(noPrice.units, 0);
  assert.equal(lad({ odds: null, price: null }).reason, 'no_price_no_stake');
  const juice = lad({ units: 3, odds: -450, list: LEAD4 });
  assert.equal(juice.action, 'MUTE');
  assert.equal(juice.reason, 'juice');
  assert.equal(juice.units, 0);
  assert.equal(lad({ odds: -425, list: LEAD4 }).units, 3);
});

test('outside the gate is 0: behind, level, nobody trusted, and records under 2', () => {
  const list = ladderList({ trusted: ['aaaaa1', 'bbbbb1'], records: { aaaaa1: 5, zzzzz9: 5, bbbbb1: 0.5 } });
  const behind = lad({ list, units: 4, positions: [pos('bbbbb1', 'away'), pos('zzzzz9', 'home')] });
  assert.equal(behind.action, 'MUTE');
  assert.equal(behind.reason, 'behind');
  const level = lad({ list, units: 4, positions: [pos('aaaaa1', 'home'), pos('bbbbb1', 'away')] });
  assert.equal(level.reason, 'not_ahead');
  assert.equal(level.units, 0);
  const none = lad({ list, units: 4, positions: [pos('zzzzz9', 'home')] });
  assert.equal(none.reason, 'no_trusted_wallet');
  assert.equal(none.units, 0);
  const records = lad({ list: ladderList({ trusted: ['aaaaa1'], records: { aaaaa1: 1.9 } }), units: 4 });
  assert.equal(records.reason, 'records_not_ahead');
  assert.equal(records.units, 0);
  assert.equal(lad({ list, positions: [pos('zzzzz9', 'home')] }).action, 'PASS');
});

test('every sport reads the ladder: a stake outside the gate goes to 0 on NHL, CBB, and the rest', () => {
  const stray = [pos('zzzzz9', 'home')];
  for (const sport of ['NHL', 'CBB', 'NCAAB', 'MLB', 'SOC', 'NBA', 'NFL', 'CFB', 'NCAAF']) {
    const p = lad({ sport, units: 3, positions: stray });
    assert.equal(p.action, 'MUTE', sport);
    assert.equal(p.units, 0);
  }
  for (const sport of ['NHL', 'CBB', 'MLB']) {
    const p = lad({ sport, list: LEAD4 });
    assert.equal(p.action, 'STAKE', sport);
    assert.equal(p.units, 3);
  }
  // A wallet that is not profitable in the sport does not open the gate there.
  const nbaOnly = ladderList({ trusted: ['aaaaa1'], records: { aaaaa1: 5 }, sports: ['NBA'] });
  assert.equal(lad({ sport: 'NHL', list: nbaOnly, units: 2 }).action, 'MUTE');
  assert.equal(lad({ sport: 'NBA', list: nbaOnly }).units, 3);
  assert.equal(trustedSpreadLive(LADDER, 'NHL', LEAD4), true);
  assert.equal(trustedSpreadLive(OWN, 'NHL', LEAD4), false);
});

test('a morning with no list, or a list with no records, is 0 from 2026-11-23', () => {
  const noList = lad({ list: new Map(), units: 3 });
  assert.equal(noList.action, 'MUTE');
  assert.equal(noList.reason, 'no_list');
  assert.equal(noList.units, 0);
  assert.equal(lad({ list: new Map() }).reason, 'no_list_no_stake');
  const noRecords = lad({ list: ladderList({ trusted: ['aaaaa1'] }), units: 3 });
  assert.equal(noRecords.action, 'MUTE');
  assert.equal(noRecords.reason, 'no_records');
  assert.equal(noRecords.units, 0);
});

test('another market, manual, and a kill change nothing on the ladder', () => {
  const stray = [pos('zzzzz9', 'home')];
  assert.equal(lad({ market: 'TOTAL', units: 3, positions: stray }).units, 3);
  assert.equal(lad({ market: 'ML', units: 3, positions: stray }).units, 3);
  assert.equal(lad({ market: 'ML', units: 3, list: new Map() }).units, 3);
  const manual = lad({ manual: true, units: 5, positions: stray });
  assert.equal(manual.action, 'EXEMPT');
  assert.equal(manual.units, 5);
  const killed = lad({ killed: true, units: 0, list: LEAD4 });
  assert.equal(killed.action, 'EXEMPT');
  assert.equal(killed.units, 0);
});

test('the ladder stamp carries the line and every field on every action', () => {
  const cases = [
    lad(), lad({ list: LEAD4 }), lad({ odds: 110, line: 9, units: 2 }), lad({ odds: 110, line: 3 }),
    lad({ list: new Map(), units: 2 }), lad({ manual: true }), own(),
  ];
  for (const p of cases) {
    const stamp = trustedSpreadStamp(p);
    assert.deepEqual(Object.keys(stamp).sort(), [...TRUSTED_SPREAD_STAMP_FIELDS].sort());
    assert.equal(stamp.v8_trustedSpreadRule, p.rule);
    assert.equal(stamp.v8_trustedSpreadUnits, p.units);
    assert.equal(stamp.v8_trustedSpread, p.action === 'STAKE' || p.action === 'MUTE');
  }
  assert.equal(trustedSpreadStamp(lad({ odds: 110, line: 3 })).v8_trustedSpreadLine, 3);
  assert.equal(trustedSpreadStamp(lad({ line: null })).v8_trustedSpreadLine, null);
});
