import assert from 'node:assert/strict';
import test from 'node:test';
import {
  V12PLUS_ML_DIFF_FIELDS,
  V12PLUS_ML_DISABLED_DEFAULT,
  V12PLUS_ML_DISABLED_MUTED_BY,
  V12PLUS_ML_DISABLED_REASON,
  V12PLUS_ML_STAKE_DISABLED_FIELD,
  V12PLUS_ML_UNITS_PRE_FIELD,
  applyV12plusMlStakeDisable,
  isMoneylineMarket,
  isV12plusMlDisabled,
  isV13MlStakeKept,
  v12plusMlStakeDisabled,
} from './v12plusMlDisabled.js';

test('flag defaults ON', () => {
  assert.equal(V12PLUS_ML_DISABLED_DEFAULT, true);
  const prev = process.env.V12PLUS_ML_DISABLED;
  delete process.env.V12PLUS_ML_DISABLED;
  assert.equal(isV12plusMlDisabled(), true);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('env override rolls the flag back', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '0';
  assert.equal(isV12plusMlDisabled(), false);
  process.env.V12PLUS_ML_DISABLED = 'on';
  assert.equal(isV12plusMlDisabled(), true);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('moneyline market recognition', () => {
  assert.equal(isMoneylineMarket('ML'), true);
  assert.equal(isMoneylineMarket('SPREAD'), false);
  assert.equal(isMoneylineMarket('TOTAL'), false);
});

test('stake disable hits ML only when the flag is on', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  assert.equal(v12plusMlStakeDisabled('ML'), true);
  assert.equal(v12plusMlStakeDisabled('SPREAD'), false);
  process.env.V12PLUS_ML_DISABLED = '0';
  assert.equal(v12plusMlStakeDisabled('ML'), false);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('V13-staked side is untouched (keeps V13 units)', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  assert.equal(isV13MlStakeKept('STAKE'), true);
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: 4,
    v13Action: 'STAKE',
  });
  assert.equal(out.applied, false);
  assert.equal(out.units, 4);
  assert.equal(out.preservedBy, 'v13');
  assert.equal(out.marker, null);
  assert.equal(out.mutedBy, null);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('V13 PASS side → 0u muted with flag marker', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: 3,
    v13Action: 'PASS',
  });
  assert.equal(out.applied, true);
  assert.equal(out.units, 0);
  assert.equal(out.unitsPre, 3);
  assert.equal(out.mutedBy, V12PLUS_ML_DISABLED_MUTED_BY);
  assert.equal(out.healthStatus, 'MUTED');
  assert.equal(out.marker[V12PLUS_ML_STAKE_DISABLED_FIELD], true);
  assert.equal(out.marker[V12PLUS_ML_UNITS_PRE_FIELD], 3);
  assert.equal(out.reason, V12PLUS_ML_DISABLED_REASON);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('V13 MUTE stays 0 and is not rewritten by the flag', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  assert.equal(isV13MlStakeKept('MUTE'), true);
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: 0,
    v13Action: 'MUTE',
  });
  assert.equal(out.applied, false);
  assert.equal(out.units, 0);
  assert.equal(out.preservedBy, 'v13');
  assert.equal(out.marker, null);
  assert.equal(out.mutedBy, null);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('manual stake is preserved', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: 2.5,
    manual: true,
    v13Action: 'PASS',
  });
  assert.equal(out.applied, false);
  assert.equal(out.units, 2.5);
  assert.equal(out.preservedBy, 'manual');
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('operator kill is preserved', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const out = applyV12plusMlStakeDisable({
    market: 'ML',
    units: 0,
    operatorKilled: true,
    v13Action: 'PASS',
  });
  assert.equal(out.applied, false);
  assert.equal(out.preservedBy, 'operator');
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('absent V13 action (pre-cutover / not matched) → 0u muted', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const out = applyV12plusMlStakeDisable({ market: 'ML', units: 4, v13Action: null });
  assert.equal(out.applied, true);
  assert.equal(out.units, 0);
  const exempt = applyV12plusMlStakeDisable({ market: 'ML', units: 4, v13Action: 'EXEMPT' });
  assert.equal(exempt.applied, true);
  assert.equal(exempt.units, 0);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('never raises stake', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  for (const action of ['STAKE', 'MUTE', 'PASS', null]) {
    const units = action === 'STAKE' ? 4 : action === 'MUTE' ? 0 : 3;
    const out = applyV12plusMlStakeDisable({ market: 'ML', units, v13Action: action });
    assert.ok(out.units <= units);
  }
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('spreads and totals are unchanged', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  for (const market of ['SPREAD', 'TOTAL']) {
    const out = applyV12plusMlStakeDisable({ market, units: 3, v13Action: 'PASS' });
    assert.equal(out.applied, false);
    assert.equal(out.units, 3);
  }
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('diff-field list does not include lockStage or V13 stamps', () => {
  assert.ok(V12PLUS_ML_DIFF_FIELDS.includes('finalUnits'));
  assert.ok(V12PLUS_ML_DIFF_FIELDS.includes('mutedBy'));
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('lockStage'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_v13Ml'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_pressUnits'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_mlMini'), false);
});
