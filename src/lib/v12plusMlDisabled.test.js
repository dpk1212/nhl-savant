import assert from 'node:assert/strict';
import test from 'node:test';
import {
  V12PLUS_ML_DIFF_FIELDS,
  V12PLUS_ML_DISABLED_DEFAULT,
  V12PLUS_ML_DISABLED_MUTED_BY,
  V12PLUS_ML_DISABLED_REASON,
  V12PLUS_ML_STEAM_C_UNITS,
  V12PLUS_ML_STAKE_DISABLED_FIELD,
  V12PLUS_ML_UNITS_PRE_FIELD,
  applyV12plusMlStakeDisable,
  isMoneylineMarket,
  isV12plusMlDisabled,
  isV12plusMlRungKept,
  isV13MlStakeKept,
  steamCLadderUnits,
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

test('before the ladder, Trust-G, steam-C, and gap lead kept a moneyline stake', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const pickDate = '2026-11-22';
  assert.equal(isV12plusMlRungKept('TRUST-G', pickDate), true);
  assert.equal(isV12plusMlRungKept('PRESS', pickDate), false);
  for (const stakeTier of ['TRUST-G', 'STEAM-C', 'GAP-LEAD']) {
    const out = applyV12plusMlStakeDisable({
      market: 'ML', units: 2, v13Action: 'PASS', stakeTier, pickDate,
    });
    assert.equal(out.applied, false);
    assert.equal(out.units, 2);
    assert.equal(out.preservedBy, stakeTier);
  }
  const muted = applyV12plusMlStakeDisable({
    market: 'ML', units: 2, v13Action: 'PASS', stakeTier: 'PRESS', pickDate,
  });
  assert.equal(muted.applied, true);
  assert.equal(muted.units, 0);
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('from the ladder day Trust-G, gap lead, and every other old rung go to 0', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  for (const pickDate of ['2026-11-23', '2026-12-01', null]) {
    for (const stakeTier of ['TRUST-G', 'GAP-LEAD', 'PRESS', 'ML-MINI', 'TOP3', 'MONITORING', null]) {
      assert.equal(isV12plusMlRungKept(stakeTier, pickDate), false, `${stakeTier} ${pickDate}`);
      for (const v13Action of ['PASS', 'EXEMPT', null]) {
        const out = applyV12plusMlStakeDisable({
          market: 'ML', units: 4, v13Action, stakeTier, pickDate, odds: -150,
        });
        assert.equal(out.applied, true, `${stakeTier} ${pickDate} ${v13Action}`);
        assert.equal(out.resized, false);
        assert.equal(out.units, 0);
        assert.equal(out.unitsPre, 4);
        assert.equal(out.mutedBy, V12PLUS_ML_DISABLED_MUTED_BY);
      }
    }
  }
  // With no pick date nothing is kept, STEAM-C included.
  assert.equal(isV12plusMlRungKept('STEAM-C', null), false);
  // The path's own stake and mute, a manual stake, and an operator kill stay.
  const pickDate = '2026-11-23';
  const path = applyV12plusMlStakeDisable({
    market: 'ML', units: 3, v13Action: 'STAKE', stakeTier: 'V13-ML', pickDate,
  });
  assert.equal(path.applied, false);
  assert.equal(path.resized, false);
  assert.equal(path.units, 3);
  const manual = applyV12plusMlStakeDisable({
    market: 'ML', units: 5, v13Action: 'EXEMPT', stakeTier: 'TRUST-G', manual: true, pickDate,
  });
  assert.equal(manual.units, 5);
  assert.equal(manual.preservedBy, 'manual');
  const killed = applyV12plusMlStakeDisable({
    market: 'ML', units: 0, v13Action: 'EXEMPT', operatorKilled: true, pickDate,
  });
  assert.equal(killed.preservedBy, 'operator');
  // Spreads and totals are not read.
  for (const market of ['SPREAD', 'TOTAL']) {
    const out = applyV12plusMlStakeDisable({
      market, units: 3, v13Action: null, stakeTier: 'TRUST-S', pickDate,
    });
    assert.equal(out.applied, false);
    assert.equal(out.units, 3);
  }
  if (prev == null) delete process.env.V12PLUS_ML_DISABLED;
  else process.env.V12PLUS_ML_DISABLED = prev;
});

test('from the ladder day STEAM-C keeps a moneyline stake, at 3u', () => {
  const prev = process.env.V12PLUS_ML_DISABLED;
  process.env.V12PLUS_ML_DISABLED = '1';
  const pickDate = '2026-11-23';
  assert.equal(V12PLUS_ML_STEAM_C_UNITS, 3);
  assert.equal(isV12plusMlRungKept('STEAM-C', pickDate), true);
  // Whatever arrived (1, 2, 3, 4, 5) is 3u, in every sport's moneyline.
  for (const units of [0.5, 1, 2, 3, 4, 5]) {
    for (const v13Action of ['PASS', 'EXEMPT', null]) {
      const out = applyV12plusMlStakeDisable({
        market: 'ML', units, v13Action, stakeTier: 'STEAM-C', pickDate, odds: -173,
      });
      assert.equal(out.applied, false, `${units} ${v13Action}`);
      assert.equal(out.units, 3, `${units} ${v13Action}`);
      assert.equal(out.unitsPre, units);
      assert.equal(out.resized, units !== 3);
      assert.equal(out.preservedBy, 'STEAM-C');
      assert.equal(out.mutedBy, null);
      assert.equal(out.marker, null);
    }
  }
  // A side the rungs already took to 0 stays 0.
  const zero = applyV12plusMlStakeDisable({
    market: 'ML', units: 0, v13Action: 'PASS', stakeTier: 'STEAM-C', pickDate, odds: -173,
  });
  assert.equal(zero.applied, true);
  assert.equal(zero.units, 0);
  // The dog cap, and juice past −425.
  assert.equal(steamCLadderUnits(-110), 3);
  assert.equal(steamCLadderUnits(120), 3);
  assert.equal(steamCLadderUnits(121), 2.5);
  assert.equal(steamCLadderUnits(151), 1.5);
  assert.equal(steamCLadderUnits(200), 1);
  assert.equal(steamCLadderUnits(201), 0);
  assert.equal(steamCLadderUnits(-425), 3);
  assert.equal(steamCLadderUnits(-426), 0);
  assert.equal(steamCLadderUnits(null), 3);
  for (const odds of [201, 350, -426, -600]) {
    const out = applyV12plusMlStakeDisable({
      market: 'ML', units: 4, v13Action: 'PASS', stakeTier: 'STEAM-C', pickDate, odds,
    });
    assert.equal(out.applied, true, `${odds}`);
    assert.equal(out.units, 0, `${odds}`);
  }
  const dog = applyV12plusMlStakeDisable({
    market: 'ML', units: 4, v13Action: 'PASS', stakeTier: 'STEAM-C', pickDate, odds: 160,
  });
  assert.equal(dog.units, 1.5);
  assert.equal(dog.resized, true);
  // The path's stake or mute wins over STEAM-C. So do manual and a kill.
  const path = applyV12plusMlStakeDisable({
    market: 'ML', units: 4, v13Action: 'STAKE', stakeTier: 'STEAM-C', pickDate, odds: -150,
  });
  assert.equal(path.units, 4);
  assert.equal(path.preservedBy, 'v13');
  const mute = applyV12plusMlStakeDisable({
    market: 'ML', units: 0, v13Action: 'MUTE', stakeTier: 'STEAM-C', pickDate, odds: -150,
  });
  assert.equal(mute.units, 0);
  assert.equal(mute.preservedBy, 'v13');
  const manual = applyV12plusMlStakeDisable({
    market: 'ML', units: 5, v13Action: 'EXEMPT', stakeTier: 'STEAM-C', manual: true, pickDate, odds: -150,
  });
  assert.equal(manual.units, 5);
  assert.equal(manual.resized, false);
  const killed = applyV12plusMlStakeDisable({
    market: 'ML', units: 0, v13Action: 'EXEMPT', stakeTier: 'STEAM-C', operatorKilled: true, pickDate,
  });
  assert.equal(killed.preservedBy, 'operator');
  // The day before, STEAM-C kept what it wrote. A spread is never read.
  const before = applyV12plusMlStakeDisable({
    market: 'ML', units: 4, v13Action: 'PASS', stakeTier: 'STEAM-C', pickDate: '2026-11-22', odds: -173,
  });
  assert.equal(before.units, 4);
  assert.equal(before.resized, false);
  const spread = applyV12plusMlStakeDisable({
    market: 'SPREAD', units: 2, v13Action: null, stakeTier: 'STEAM-C', pickDate, odds: -110,
  });
  assert.equal(spread.units, 2);
  assert.equal(spread.resized, false);
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
