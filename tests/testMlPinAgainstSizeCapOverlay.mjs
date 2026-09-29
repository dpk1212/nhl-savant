/**
 * ML pin-against size cap (2026-09-29+).
 * ML only. CAP 4u into a live pin walk away. GOLD stack still capped.
 * Usage: node tests/testMlPinAgainstSizeCapOverlay.mjs
 */
import assert from 'node:assert/strict';
import {
  applyMlPinAgainstSizeCapOverlay,
  isMlPinAgainstCapLive,
  measureMlPinAgainst,
  ML_PIN_AGAINST_CAP_FROM,
  ML_PIN_AGAINST_SIZE_CAP,
  ML_PIN_AGAINST_CAPPED_BY,
  ML_PIN_AGAINST_MIN_PP,
} from '../src/lib/mlPinAgainstSizeCapOverlay.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n += 1;
}

/** PHI@ATL tape: first Pin −188 → last −165 (Dale's live print). */
function bravesNow() {
  return {
    opener: { t: 1, away: 159, home: -193, fairBook: 'draftkings' },
    current: { away: 148, home: -165 },
    history: [
      { t: 1, away: 159, home: -193, fairBook: 'draftkings' },
      { t: 2, away: 168, home: -188, fairBook: 'pinnacle' },
      { t: 3, away: 148, home: -165, fairBook: 'pinnacle' },
    ],
  };
}

/** File last print −183: −0.61pp, not a 3% lengthen. */
function bravesTick() {
  return {
    opener: { t: 1, away: 159, home: -193, fairBook: 'draftkings' },
    current: { away: 164, home: -183 },
    history: [
      { t: 1, away: 159, home: -193, fairBook: 'draftkings' },
      { t: 2, away: 168, home: -188, fairBook: 'pinnacle' },
      { t: 3, away: 164, home: -183, fairBook: 'pinnacle' },
    ],
  };
}

function cap(extra = {}) {
  return applyMlPinAgainstSizeCapOverlay({
    pickDate: '2026-09-29',
    marketType: 'ML',
    side: 'home',
    pinnGame: bravesNow(),
    ...extra,
  });
}

ok(isMlPinAgainstCapLive('2026-09-29'), 'live on cutover');
ok(!isMlPinAgainstCapLive('2026-09-28'), 'not live before cutover');
ok(ML_PIN_AGAINST_CAP_FROM === '2026-09-29', 'cutover date');
ok(ML_PIN_AGAINST_SIZE_CAP === 4, 'cap is 4u');
ok(ML_PIN_AGAINST_CAPPED_BY === 'ml-pin-against-cap', 'cappedBy stamp');
ok(ML_PIN_AGAINST_MIN_PP === 1, '1pp floor, not 0.25 tick');

{
  const m = measureMlPinAgainst(bravesNow(), 'home');
  ok(m.against === true, 'Braves −188 → −165 is against');
  ok(m.dpp <= -1, `Braves dpp ${m.dpp} ≤ −1`);
  ok(m.dropPct <= -3, `Braves juice ${m.dropPct} lengthen ≥ 3%`);
}

{
  const m = measureMlPinAgainst(bravesTick(), 'home');
  ok(m.against === false, '−188 → −183 tick is not against');
  ok(m.dpp > -1, `tick dpp ${m.dpp} > −1`);
}

{
  const r = cap({ units: 6 });
  ok(r.action === 'CAP' && r.units === 4, 'Braves GOLD 6u → 4u');
  ok(r.cappedBy === 'ml-pin-against-cap', 'cappedBy on CAP');
  ok(r.unitsPrePolicy === 6, 'keeps pre units');
}

{
  const r = cap({ units: 6, pinnGame: bravesTick() });
  ok(r.action === 'HOLD' && r.units === 6, 'tiny tick does not cut GOLD');
  ok(!r.cappedBy, 'no cap stamp on tick');
}

{
  const r = cap({ units: 3 });
  ok(r.action === 'HOLD' && r.units === 3, 'already ≤4u HOLD');
  ok(r.reason === 'already_le4', 'already_le4');
}

{
  const r = cap({ units: 6, marketType: 'TOTAL' });
  ok(r.action === 'EXEMPT' && r.units === 6, 'TOTAL exempt');
  ok(r.reason === 'market_exempt', 'market_exempt');
}

{
  const r = cap({ units: 6, marketType: 'SPREAD' });
  ok(r.action === 'EXEMPT' && r.units === 6, 'SPREAD exempt');
}

{
  const r = applyMlPinAgainstSizeCapOverlay({
    units: 6,
    pickDate: '2026-09-28',
    marketType: 'ML',
    side: 'home',
    pinnGame: bravesNow(),
  });
  ok(r.action === 'EXEMPT' && r.units === 6, 'pre-cutover holds 6u');
}

{
  const r = cap({ units: 6, pinnGame: null });
  ok(r.action === 'HOLD' && r.units === 6 && r.reason === 'no_pin', 'missing pin fail-open');
}

{
  const r = cap({ units: 6, side: 'over' });
  ok(r.action === 'HOLD' && r.units === 6 && r.reason === 'no_side_odds', 'bad side fail-open');
}

{
  const r = cap({ units: 0 });
  ok(r.action === 'PASS' && r.units === 0, '0u passes');
}

{
  const withUs = {
    opener: { away: 150, home: -170, fairBook: 'pinnacle' },
    current: { away: 165, home: -190 },
    history: [
      { t: 1, away: 150, home: -170, fairBook: 'pinnacle' },
      { t: 2, away: 165, home: -190, fairBook: 'pinnacle' },
    ],
  };
  const r = cap({ units: 6, pinnGame: withUs });
  ok(r.action === 'HOLD' && r.units === 6, 'line with us keeps 6u');
  ok(r.reason === 'not_against', 'not_against');
}

console.log(`ok — ${n} ml-pin-against size-cap checks`);
