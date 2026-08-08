/**
 * CONFIRMED × flatDollar Q1 × size≥0.5 promote / size-up.
 * Usage: node tests/testConfirmedQ1Promote.mjs
 */
import assert from 'assert';
import {
  buildFlatDollarQBySport,
  computeConfirmedQ1Sized,
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
  // [id, sport, tier, flatRoi, dollarRoi]
  const m = new Map();
  for (const [id, sport, tier, flatRoi, dollarRoi] of entries) {
    const key = String(id).toLowerCase();
    if (!m.has(key)) m.set(key, { bySport: {} });
    m.get(key).bySport[sport] = {
      whitelistTier: tier,
      picks: { flatRoi, n: 10 },
      positions: { dollarRoi, n: 10 },
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

console.log(`OK — ${n} assertions`);
