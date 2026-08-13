/**
 * CONFIRMED × flatDollar Q1 × size≥0.5 promote / size-up.
 * Usage: node tests/testConfirmedQ1Promote.mjs
 */
import assert from 'assert';
import {
  FLAT_BLEND_A,
  FLAT_BLEND_B,
  FLAT_DOLLAR_Q_WEIGHT_FLAT,
  FLAT_DOLLAR_Q_WEIGHT_DOLLAR,
  buildFlatDollarQBySport,
  computeConfirmedQ1Sized,
  confirmedQ1BypassesAgsCreateGate,
  applyConfirmedQ1UnitFloor,
  isConfirmedQ1PromoteLive,
  CONFIRMED_Q1_FROM,
  CONFIRMED_Q1_MIN_SIZE,
  CONFIRMED_Q1_UNITS,
  CONFIRMED_Q1_PRESS_UNITS,
} from '../src/lib/walletClvSkill.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}

ok(CONFIRMED_Q1_FROM === '2026-08-08', 'cutover');
ok(CONFIRMED_Q1_MIN_SIZE === 0.5, 'min size');
ok(CONFIRMED_Q1_UNITS === 2, 'base units size-up');
ok(CONFIRMED_Q1_PRESS_UNITS === 3, 'press units');
ok(isConfirmedQ1PromoteLive('2026-08-08'), 'live');
ok(!isConfirmedQ1PromoteLive('2026-08-07'), 'not before');

function profiles(entries) {
  // [id, sport, tier, flatA, dollar, flatB?]  flatB defaults to flatA
  const m = new Map();
  for (const [id, sport, tier, flatRoi, dollarRoi, flatB] of entries) {
    const key = String(id).toLowerCase();
    if (!m.has(key)) m.set(key, { bySport: {} });
    const bFlat = Number.isFinite(flatB) ? flatB : flatRoi;
    m.get(key).bySport[sport] = {
      whitelistTier: tier,
      picks: { flatRoi, n: 10 },
      positions: { dollarRoi, positionFlatRoi: bFlat, n: 10 },
    };
  }
  return m;
}

const sport = 'MLB';
const side = 'home';

// Four CONFIRMED with descending skill → Q1 = aaaaaa
const prof = profiles([
  ['aaaaaa', 'MLB', 'CONFIRMED', 40, 40],
  ['bbbbbb', 'MLB', 'CONFIRMED', 20, 20],
  ['cccccc', 'MLB', 'CONFIRMED', 5, 5],
  ['dddddd', 'MLB', 'CONFIRMED', -5, -5],
]);
const qBy = buildFlatDollarQBySport(prof);
ok(qBy.get('MLB')?.get('aaaaaa') === 1, 'top score → Q1');
ok(qBy.get('MLB')?.get('dddddd') === 4, 'bottom → Q4');

ok(FLAT_BLEND_A === 0.3 && FLAT_BLEND_B === 0.7, 'flat mix 30A/70B');
ok(FLAT_DOLLAR_Q_WEIGHT_FLAT === 0.4 && FLAT_DOLLAR_Q_WEIGHT_DOLLAR === 0.6, '40 flat / 60 B$');
{
  // Same Q for Action + stake. 60% B$ ranks dollar-hot over A-flat-hot.
  const split = profiles([
    ['hotb00', 'MLB', 'CONFIRMED', 0, 50, 0],
    ['hota00', 'MLB', 'CONFIRMED', 50, 0, 50],
    ['mid000', 'MLB', 'CONFIRMED', 10, 10, 10],
    ['low000', 'MLB', 'CONFIRMED', -10, -10, -10],
  ]);
  const q = buildFlatDollarQBySport(split);
  ok(q.get('MLB')?.get('hotb00') < q.get('MLB')?.get('hota00'), 'B$ hot ranks above A-flat hot');
}
{
  // Equal dollars: 70% B-flat inside the 40% bucket ranks B-flat hot over A-flat hot.
  const flats = profiles([
    ['bflat0', 'MLB', 'CONFIRMED', 0, 10, 50],
    ['aflat0', 'MLB', 'CONFIRMED', 50, 10, 0],
    ['mid000', 'MLB', 'CONFIRMED', 10, 10, 10],
    ['low000', 'MLB', 'CONFIRMED', -10, -10, -10],
  ]);
  const q = buildFlatDollarQBySport(flats);
  ok(q.get('MLB')?.get('bflat0') < q.get('MLB')?.get('aflat0'), 'B-flat hot ranks above A-flat hot');
}

{
  const r = computeConfirmedQ1Sized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 0.8 }],
    side, sport, prof, qBy,
  );
  ok(r.qualifies === true, 'Q1 sized qualifies');
  ok(r.targetUnits === CONFIRMED_Q1_UNITS, 'base 2u when size<1');
  ok(r.wallets.includes('aaaaaa'), 'wallet listed');
}

{
  const r = computeConfirmedQ1Sized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 1.4 }],
    side, sport, prof, qBy,
  );
  ok(r.qualifies && r.targetUnits === CONFIRMED_Q1_PRESS_UNITS, 'size≥1 → 3u');
}

{
  const r = computeConfirmedQ1Sized(
    [
      { wallet: 'aaaaaa', side: 'home', sizeRatio: 1.2 },
      { wallet: 'bbbbbb', side: 'away', sizeRatio: 2.0 },
    ],
    side, sport, prof, qBy,
  );
  ok(r.qualifies === true, 'opposed CONFIRMED AG does NOT disqualify Q1');
}

{
  const r = computeConfirmedQ1Sized(
    [{ wallet: 'bbbbbb', side: 'home', sizeRatio: 1.5 }],
    side, sport, prof, qBy,
  );
  ok(r.qualifies === false, 'Q2 not Q1');
}

{
  const r = computeConfirmedQ1Sized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 0.4 }],
    side, sport, prof, qBy,
  );
  ok(r.qualifies === false, 'light size fails');
}

{
  const r = computeConfirmedQ1Sized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 1.0 }],
    side, sport,
    profiles([['aaaaaa', 'MLB', 'FLAT', 40, 40]]),
    qBy,
  );
  ok(r.qualifies === false, 'FLAT tier fails');
}

// Create-path: AGS mute / no-signal bypass when Q1×sized qualifies
ok(confirmedQ1BypassesAgsCreateGate(true, null) === true, 'bypass no_signal');
ok(confirmedQ1BypassesAgsCreateGate(true, -0.5) === true, 'bypass mute ≤0');
ok(confirmedQ1BypassesAgsCreateGate(true, 0) === true, 'bypass score 0');
ok(confirmedQ1BypassesAgsCreateGate(true, 0.2) === false, 'no bypass when AGS ships');
ok(confirmedQ1BypassesAgsCreateGate(false, -1) === false, 'no bypass without Q1');

// Unit floor after AGS mute (0u scaffolding → 2u / 3u)
const oddsCapFn = (u) => u;
{
  const q1 = computeConfirmedQ1Sized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 0.8 }],
    side, sport, prof, qBy,
  );
  const floored = applyConfirmedQ1UnitFloor({
    units: 0, odds: null, q1Result: q1, oddsCapFn,
  });
  ok(floored.floored === true, 'AGS-mute 0u floors');
  ok(floored.units === CONFIRMED_Q1_UNITS, 'floors to 2u');
  ok(floored.tier === 'CONFIRMED-Q1', 'tier CONFIRMED-Q1');
}
{
  const q1 = computeConfirmedQ1Sized(
    [{ wallet: 'aaaaaa', side: 'home', sizeRatio: 1.2 }],
    side, sport, prof, qBy,
  );
  const floored = applyConfirmedQ1UnitFloor({
    units: 0, odds: -110, q1Result: q1, oddsCapFn,
  });
  ok(floored.units === CONFIRMED_Q1_PRESS_UNITS, 'press floors to 3u');
}
{
  const floored = applyConfirmedQ1UnitFloor({
    units: 0, odds: null,
    q1Result: { qualifies: false, targetUnits: 2 },
    oddsCapFn,
  });
  ok(floored.floored === false && floored.units === 0, 'no floor without qualify');
}

// EXITED positions are pruned before create — empty walletDetails ⇒ no Q1
{
  const r = computeConfirmedQ1Sized([], side, sport, prof, qBy);
  ok(r.qualifies === false, 'no walletDetails (EXITED pruned) ⇒ no Q1');
}

console.log(`OK — ${n} assertions`);
