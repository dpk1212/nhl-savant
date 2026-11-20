import assert from 'node:assert/strict';
import test from 'node:test';
import {
  V13_ML_STAMP_FIELDS,
  applyV13MlPath,
  buildV13MlBook,
  v13MlStamp,
} from './v13MlPath.js';
import { applyV12plusMlStakeDisable } from './v12plusMlDisabled.js';

const DAY = '2026-11-19';

function history(wallet, { sport = 'NBA', n = 20, start = '2026-09-01', price = 0.5, winsFrom = 4 } = {}) {
  const rows = [];
  for (let i = 0; i < n; i += 1) {
    const date = new Date(Date.parse(`${start}T00:00:00Z`) + i * 86400000).toISOString().slice(0, 10);
    const won = i >= winsFrom;
    rows.push({
      wallet, date, sport, marketType: 'ML', side: 'home', gameKey: `g${wallet}${i}`,
      avgPrice: price, won, result: won ? 'WIN' : 'LOSS',
    });
  }
  return rows;
}

function book() {
  return buildV13MlBook([...history('aaaaaa'), ...history('bbbbbb')], DAY);
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

test('every ML side gets a full V13 stamp including PASS', () => {
  const pass = run({ odds: -450, steam: 1, edge: 4, units: 4 });
  assert.equal(pass.action, 'PASS');
  assert.equal(pass.reason, 'juice');
  const stamp = v13MlStamp(pass, { now: 111 });
  for (const field of V13_ML_STAMP_FIELDS) {
    assert.ok(Object.prototype.hasOwnProperty.call(stamp, field), `missing ${field}`);
  }
  assert.equal(stamp.v8_v13Ml, true);
  assert.equal(stamp.v8_v13MlAction, 'PASS');
  assert.equal(stamp.v8_v13MlReason, 'juice');
  assert.equal(stamp.v8_v13MlUnits, 0);
  assert.equal(stamp.v8_v13MlZone, 'juice');
  assert.equal(stamp.v8_v13MlOdds, -450);
  assert.equal(stamp.v8_v13MlEvaluatedAt, 111);
  assert.equal(stamp.v8_unitsPreV13Ml, 4);
});

test('STAKE → PASS overwrites every stamp field (no leftover STAKE values)', () => {
  const stake = run({ odds: -110, steam: 0, edge: 4 });
  assert.equal(stake.action, 'STAKE');
  assert.equal(stake.units, 4);
  const prior = v13MlStamp(stake, { now: 100 });
  assert.equal(prior.v8_v13MlAction, 'STAKE');
  assert.equal(prior.v8_v13MlUnits, 4);
  assert.equal(prior.v8_v13MlZone, 'favorite');

  // Texans-like: later cycle is juice PASS; ML-MINI may still show 4u pre.
  const pass = run({ odds: -524, steam: 2, edge: 3, units: 4 });
  assert.equal(pass.action, 'PASS');
  assert.equal(pass.reason, 'juice');
  const next = { ...prior, ...v13MlStamp(pass, { now: 200 }) };
  assert.equal(next.v8_v13MlAction, 'PASS');
  assert.equal(next.v8_v13MlReason, 'juice');
  assert.equal(next.v8_v13MlUnits, 0);
  assert.equal(next.v8_v13MlZone, 'juice');
  assert.equal(next.v8_v13MlOdds, -524);
  assert.equal(next.v8_v13MlEvaluatedAt, 200);
  assert.equal(next.v8_unitsPreV13Ml, 4);
  assert.notEqual(next.v8_v13MlUnits, prior.v8_v13MlUnits);
  assert.notEqual(next.v8_v13MlZone, prior.v8_v13MlZone);
});

test('Texans-like: juice PASS + ML-MINI 4u → flag zeros; stamp stays PASS/juice/0u', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const v13 = run({ odds: -524, steam: 1, edge: 2, units: 4 });
  assert.equal(v13.action, 'PASS');
  assert.equal(v13.reason, 'juice');
  const stamp = v13MlStamp(v13, { now: 1 });
  assert.equal(stamp.v8_v13MlAction, 'PASS');
  assert.equal(stamp.v8_v13MlUnits, 0);
  // Pipeline still has ML-MINI restored 4u when V13 PASS (does not replace).
  const postV13Units = 4;
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: postV13Units,
    v13Action: v13.action,
  });
  assert.equal(out.applied, true);
  assert.equal(out.units, 0);
  assert.equal(out.unitsPre, 4);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('487 rescue STAKE is preserved by the V12+ shut-off', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const v13 = run({ edge: -0.1, odds: -150, steam: null, units: 0 });
  assert.equal(v13.action, 'STAKE');
  assert.equal(v13.reason, 'rescue');
  assert.equal(v13.units, 2);
  assert.equal(v13.zone, 'rescue');
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: v13.units,
    v13Action: v13.action,
  });
  assert.equal(out.applied, false);
  assert.equal(out.units, 2);
  assert.equal(out.preservedBy, 'v13');
  const stamp = v13MlStamp(v13, { now: 1 });
  assert.equal(stamp.v8_v13MlAction, 'STAKE');
  assert.equal(stamp.v8_v13MlReason, 'rescue');
  assert.equal(stamp.v8_v13MlUnits, 2);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('486 edge10+ STAKE and MUTE are preserved by the shut-off', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const stake = run({ edge: 12, steam: 0, odds: -150 });
  assert.equal(stake.action, 'STAKE');
  assert.equal(stake.reason, 'edge10_short');
  assert.equal(stake.units, 3);
  assert.equal(
    applyV12plusMlStakeDisable({ market: 'ML', units: stake.units, v13Action: 'STAKE' }).units,
    3,
  );
  const mute = run({ edge: 14, units: 4, steam: -0.1, odds: -180 });
  assert.equal(mute.action, 'MUTE');
  assert.equal(mute.reason, 'against');
  const muteOut = applyV12plusMlStakeDisable({
    market: 'ML',
    units: 0,
    v13Action: 'MUTE',
  });
  assert.equal(muteOut.applied, false);
  assert.equal(muteOut.preservedBy, 'v13');
  assert.equal(v13MlStamp(mute, { now: 1 }).v8_v13MlUnits, 0);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('484 favorite / long / mid / heavy STAKE preserved; against MUTE preserved', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const favorite = run({ odds: -110, steam: 0, edge: 4 });
  assert.equal(favorite.reason, 'favorite');
  assert.equal(
    applyV12plusMlStakeDisable({ market: 'ML', units: 4, v13Action: 'STAKE' }).preservedBy,
    'v13',
  );
  const long = run({ odds: 110, steam: 2, edge: 4 });
  assert.equal(long.reason, 'long');
  assert.equal(long.units, 2);
  const mid = run({ steam: 4.5, odds: -200, edge: 4 });
  assert.equal(mid.reason, 'mid');
  const heavy = run({ steam: 10, odds: 150, edge: 4 });
  assert.equal(heavy.reason, 'heavy');
  const against = run({ units: 4, steam: -0.1, odds: -160, edge: 4 });
  assert.equal(against.action, 'MUTE');
  assert.equal(against.reason, 'against');
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('PASS reasons cover no_qualified_wallet, qualified_against, missing_edge, no_steam', () => {
  assert.equal(run({ positions: [pos('zzzzzz')] }).reason, 'no_qualified_wallet');
  assert.equal(
    run({ positions: [pos('aaaaaa', 'home'), pos('bbbbbb', 'away')] }).reason,
    'qualified_against',
  );
  assert.equal(run({ edge: null }).reason, 'missing_edge');
  assert.equal(run({ steam: null }).reason, 'no_steam');
});

test('the stamp says which list the side read and the count on it', () => {
  const tier = v13MlStamp(run(), { now: 1 });
  assert.equal(tier.v8_v13MlList, 'tier');
  assert.equal(tier.v8_v13MlMargin, 1);
  const IN = ['NHL', 'NBA', 'NFL', 'CFB', 'CBB', 'SOC', 'ATP', 'CS2', 'LOL', 'MLB', 'WNBA', 'UFC'];
  const list = new Map([
    ['ML|tttt01', { trusted: true, sports: IN }], ['ML|tttt02', { trusted: true, sports: IN }],
    ['ML|tttt03', { trusted: true, sports: IN }],
  ]);
  const onList = run({
    pickDate: '2026-11-21', list,
    positions: [pos('tttt01'), pos('tttt02'), pos('tttt03', 'away')],
  });
  const stamp = v13MlStamp(onList, { now: 1 });
  assert.equal(stamp.v8_v13MlAction, 'STAKE');
  assert.equal(stamp.v8_v13MlList, 'trusted');
  assert.equal(stamp.v8_v13MlMargin, 1);
  assert.equal(stamp.v8_v13MlAgainst, 1);
  assert.deepEqual(stamp.v8_v13MlWallets, ['tttt01', 'tttt02']);
  const behind = run({ pickDate: '2026-11-21', list, positions: [pos('tttt03', 'away')] });
  const passStamp = v13MlStamp(behind, { now: 1 });
  assert.equal(passStamp.v8_v13MlAction, 'PASS');
  assert.equal(passStamp.v8_v13MlReason, 'no_trusted_wallet');
  assert.equal(passStamp.v8_v13MlMargin, -1);
  for (const field of V13_ML_STAMP_FIELDS) {
    assert.ok(Object.prototype.hasOwnProperty.call(passStamp, field), `missing ${field}`);
  }
});
