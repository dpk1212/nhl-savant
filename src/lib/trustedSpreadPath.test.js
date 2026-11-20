import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRUSTED_SPREAD_STAMP_FIELDS,
  TRUSTED_SPREAD_UNITS,
  applyTrustedSpreadPath,
  trustedSpreadLive,
  trustedSpreadStamp,
} from './trustedSpreadPath.js';

const DAY = '2026-11-21';

function listOf(...wallets) {
  const index = new Map();
  for (const w of wallets) index.set(`SPREAD|${w}`, { trusted: true, standing: 0.9, score: 0.02, n: 20 });
  // A moneyline name that must never count on a spread.
  index.set('ML|mlonly', { trusted: true, standing: 0.95, score: 0.03, n: 30 });
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
