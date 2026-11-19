import assert from 'node:assert/strict';
import test from 'node:test';
import {
  V12PLUS_ML_DIFF_FIELDS,
  V12PLUS_ML_DISABLED_DEFAULT,
  V12PLUS_ML_DISABLED_MUTED_BY,
  V12PLUS_ML_DISABLED_REASON,
  V12PLUS_ML_STAKE_DISABLED_FIELD,
  V12PLUS_ML_STAKE_DISABLED_REASON_FIELD,
  V12PLUS_ML_UNITS_PRE_FIELD,
  applyV12plusMlStakeDisable,
  isMoneylineMarket,
  isV12plusMlDisabled,
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
  assert.equal(isMoneylineMarket('MONEYLINE'), true);
  assert.equal(isMoneylineMarket('H2H'), true);
  assert.equal(isMoneylineMarket('SPREAD'), false);
  assert.equal(isMoneylineMarket('TOTAL'), false);
});

test('stake disable hits ML only when the flag is on', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  assert.equal(v12plusMlStakeDisabled('ML'), true);
  assert.equal(v12plusMlStakeDisabled('SPREAD'), false);
  assert.equal(v12plusMlStakeDisabled('TOTAL'), false);
  process.env.V12PLUS_ML_DISABLED = '0';
  assert.equal(v12plusMlStakeDisabled('ML'), false);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('ML ends at 0u muted with flag as mute source', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const out = applyV12plusMlStakeDisable({ market: 'ML', units: 4 });
  assert.equal(out.applied, true);
  assert.equal(out.units, 0);
  assert.equal(out.unitsPre, 4);
  assert.equal(out.mutedBy, V12PLUS_ML_DISABLED_MUTED_BY);
  assert.equal(out.healthStatus, 'MUTED');
  assert.equal(out.marker[V12PLUS_ML_STAKE_DISABLED_FIELD], true);
  assert.equal(out.marker[V12PLUS_ML_STAKE_DISABLED_REASON_FIELD], V12PLUS_ML_DISABLED_REASON);
  assert.equal(out.marker[V12PLUS_ML_UNITS_PRE_FIELD], 4);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('spreads and totals are unchanged', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  for (const market of ['SPREAD', 'TOTAL']) {
    const out = applyV12plusMlStakeDisable({ market, units: 3 });
    assert.equal(out.applied, false);
    assert.equal(out.units, 3);
    assert.equal(out.mutedBy, null);
    assert.equal(out.marker, null);
  }
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('operator kill is exempt', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const out = applyV12plusMlStakeDisable({
    market: 'ML', units: 2, operatorKilled: true,
  });
  assert.equal(out.applied, false);
  assert.equal(out.units, 2);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('diff-field list names only stake/mute/marker deltas', () => {
  assert.ok(V12PLUS_ML_DIFF_FIELDS.includes('finalUnits'));
  assert.ok(V12PLUS_ML_DIFF_FIELDS.includes('mutedBy'));
  assert.ok(V12PLUS_ML_DIFF_FIELDS.includes('health.status'));
  assert.ok(V12PLUS_ML_DIFF_FIELDS.includes(V12PLUS_ML_STAKE_DISABLED_FIELD));
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('lockStage'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_pressUnits'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_mlMini'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_mlPress'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_pressRung'), false);
  assert.equal(V12PLUS_ML_DIFF_FIELDS.includes('v8_hcStakeTier'), false);
});

test('flag-on vs flag-off side snapshot differs only on allowed fields', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;

  function buildSide(flagOn) {
    process.env.V12PLUS_ML_DISABLED = flagOn ? '1' : '0';
    const pipelineUnits = 4;
    const out = applyV12plusMlStakeDisable({ market: 'ML', units: pipelineUnits });
    const side = {
      lockStage: 'LOCKED',
      mutedBy: out.applied ? out.mutedBy : null,
      v8_rescuedBy: 'ml-mini',
      v8_hcStakeTier: 'ML-PRESS',
      v8_pressUnits: 4,
      v8_pressApplied: true,
      v8_pressRung: 'PRESS',
      v8_mlMini: true,
      v8_mlMiniAction: 'STAKE',
      v8_mlMiniUnits: 3,
      v8_mlPress: true,
      v8_mlPressAction: 'STAKE',
      v8_mlPressUnits: 4,
      v8_ogEdgeStakeAction: 'CAP',
      peak: { units: out.units, unitTier: out.units >= 2.5 ? 'MAX' : 'STANDARD', odds: -150 },
      lock: { units: out.units, unitTier: out.units >= 2.5 ? 'MAX' : 'STANDARD', odds: -150 },
      finalUnits: out.units,
      v8_agsUnitsApplied: out.units,
      v8_agsV12UnitsApplied: out.units,
      health: { status: out.applied ? 'MUTED' : 'ACTIVE', reasons: out.applied ? [V12PLUS_ML_DISABLED_REASON] : [] },
      ...(out.marker || {}),
    };
    return side;
  }

  const sideOff = buildSide(false);
  const sideOn = buildSide(true);

  const diffs = [];
  const keys = new Set([...Object.keys(sideOff), ...Object.keys(sideOn)]);
  for (const k of keys) {
    if (k === 'peak' || k === 'lock' || k === 'health') {
      for (const nk of new Set([...Object.keys(sideOff[k] || {}), ...Object.keys(sideOn[k] || {})])) {
        if (JSON.stringify(sideOff[k]?.[nk]) !== JSON.stringify(sideOn[k]?.[nk])) {
          diffs.push(`${k}.${nk}`);
        }
      }
      continue;
    }
    if (JSON.stringify(sideOff[k]) !== JSON.stringify(sideOn[k])) diffs.push(k);
  }

  for (const d of diffs) {
    assert.ok(
      V12PLUS_ML_DIFF_FIELDS.includes(d),
      `unexpected differing field ${d}; allowed=${V12PLUS_ML_DIFF_FIELDS.join(',')}`,
    );
  }
  assert.ok(diffs.includes('finalUnits'));
  assert.ok(diffs.includes('mutedBy'));
  assert.ok(diffs.includes('health.status'));
  assert.ok(diffs.includes(V12PLUS_ML_STAKE_DISABLED_FIELD));
  assert.equal(sideOn.lockStage, 'LOCKED');
  assert.equal(sideOff.lockStage, 'LOCKED');
  assert.equal(sideOn.v8_pressUnits, sideOff.v8_pressUnits);
  assert.equal(sideOn.v8_mlMiniUnits, sideOff.v8_mlMiniUnits);
  assert.equal(sideOn.v8_mlPressUnits, sideOff.v8_mlPressUnits);
  assert.equal(sideOn.v8_hcStakeTier, sideOff.v8_hcStakeTier);
  assert.equal(sideOn.mutedBy, V12PLUS_ML_DISABLED_MUTED_BY);
  assert.equal(sideOn.finalUnits, 0);

  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});
