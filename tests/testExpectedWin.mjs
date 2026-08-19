/**
 * Market-anchored expected win % (tracking stamps).
 * Usage: node tests/testExpectedWin.mjs
 */
import assert from 'assert';
import {
  TAPE_BOOST_ABOVE,
  americanOddsImpliedWr,
} from '../src/lib/walletClvSkill.js';
import {
  EXP_WIN_LAMBDA_FROZEN,
  EXP_WIN_LAMBDA_CAP,
  EXP_WIN_HOT_UNITS,
  EXP_WIN_HOT_EDGE,
  isExpWinHot,
  clampExpWinLambda,
  shrinkLogOdds,
  fitExpWinLambda,
  computeExpectedWin,
  applyExpectedWinStamps,
  applyLambda,
} from '../src/lib/expectedWin.js';

let n = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  n++;
}
function eq(a, b, msg) {
  assert.strictEqual(a, b, msg);
  n++;
}
function approx(a, b, eps, msg) {
  assert.ok(Math.abs(a - b) < eps, `${msg}: ${a} vs ${b}`);
  n++;
}

ok(TAPE_BOOST_ABOVE === 2.89, 'boost cutoff is live tape policy');
ok(EXP_WIN_HOT_UNITS === 4, '4u floor');
ok(EXP_WIN_HOT_EDGE === 11, 'EDGE ≥ 11');
ok(EXP_WIN_LAMBDA_FROZEN === 0.146, 'pre-August frozen λ');

// ── hot gate ──────────────────────────────────────────────────────────────
ok(!isExpWinHot({ units: 1, tape: 9, edge: 40 }), '1u never hot');
ok(!isExpWinHot({ units: 3.9, tape: 4, edge: 18 }), 'sub-4 never hot');
ok(!isExpWinHot({ units: 5.4, tape: 1.2, edge: 6 }), '4u HOLD E<11 not hot');
ok(!isExpWinHot({ units: 5.4, tape: null, edge: null }), 'missing tape+EDGE not hot');
ok(isExpWinHot({ units: 5.4, tape: 2.89, edge: 6 }), 'BOOST alone is hot');
ok(isExpWinHot({ units: 4, tape: 1.2, edge: 11 }), 'E≥11 alone is hot');
ok(isExpWinHot({ units: 5.4, tape: 3.77, edge: 18.1 }), 'BOOST + E≥11 is hot');
ok(!isExpWinHot({ units: 4, tape: 2.88, edge: 10.9 }), 'just under both cutoffs');

// Path must not change the number
const sox = {
  odds: -138,
  units: 5.4,
  tape: 3.77,
  edge: 18.1,
  lambda: EXP_WIN_LAMBDA_FROZEN,
  source: 'frozen',
};
const soxA = computeExpectedWin(sox);
const soxB = computeExpectedWin(sox); // same inputs, "SHARP-LEAN" vs "TOP" unused
ok(soxA && soxB && soxA.expectedWr === soxB.expectedWr, 'path is not an input');
eq(soxA.bump, '4u_hot', 'Sox is 4u hot');
eq(soxA.impliedWr, 58.0, '−138 → 58.0% implied');
approx(soxA.expectedWrFrozen, 61.5, 1.0, 'frozen bump ~+3–4pp near −138');
ok(soxA.expectedWrFrozen > soxA.impliedWr, 'hot card is above the number');
eq(soxA.expectedWr, soxA.expectedWrFrozen, 'frozen source: both prints match');

// Athletics +115 1u HOLD E<7 — no bump
const ath = computeExpectedWin({
  odds: 115, units: 1, tape: 1.4, edge: 4.4, lambda: 0.35, source: 'expanding',
});
eq(ath.bump, 'none', '1u not bumped even with a fat expanding λ sitting around');
eq(ath.expectedWr, ath.impliedWr, '1u expected = implied');
eq(ath.expectedWrFrozen, ath.impliedWr, '1u frozen = implied');
eq(ath.source, 'none', 'source none when not hot');
eq(ath.lambda, 0, 'λ stamps 0 when not hot');

// Expanding λ richer than frozen on a hot card
const soxExp = computeExpectedWin({ ...sox, lambda: 0.35, lambdaN: 84, source: 'expanding' });
ok(soxExp.expectedWr > soxExp.expectedWrFrozen, 'expanding print is richer than frozen');
ok(soxExp.expectedWr < 70, 'still not the raw 75% cell WR');
eq(soxExp.source, 'expanding', 'source expanding');
eq(soxExp.lambdaN, 84, 'hot-cell n stamped');

// Cap
eq(clampExpWinLambda(0.9), EXP_WIN_LAMBDA_CAP, 'cap at full-book ceiling');
eq(clampExpWinLambda(-0.2), 0, 'floor at 0 — no haircut below market');
approx(shrinkLogOdds(0.4, 32, 40), 0.4 * 32 / 72, 1e-9, 'n/(n+40) shrink');

// Fit: thin → frozen
{
  const rows = [];
  for (let i = 0; i < 10; i++) {
    rows.push({ won: 1, impl: 0.58, units: 5.4, tape: 4, edge: 18 });
  }
  const fit = fitExpWinLambda(rows);
  eq(fit.source, 'frozen', 'n<15 uses frozen λ');
  eq(fit.lambda, EXP_WIN_LAMBDA_FROZEN, 'thin fallback value');
  eq(fit.n, 10, 'still reports hot n');
}

// Fit: enough n, WR > implied → positive λ, shrunk
{
  const rows = [];
  for (let i = 0; i < 20; i++) {
    rows.push({ won: i < 14 ? 1 : 0, impl: 0.58, units: 5.4, tape: 4, edge: 18 });
  }
  // 20 non-hot 3u tickets must be ignored
  for (let i = 0; i < 20; i++) {
    rows.push({ won: 0, impl: 0.50, units: 3, tape: 4, edge: 18 });
  }
  const fit = fitExpWinLambda(rows);
  eq(fit.source, 'expanding', 'n≥15 expanding');
  eq(fit.n, 20, 'only hot cell counted');
  eq(fit.w, 14, '14-6');
  ok(fit.lambda > 0 && fit.lambda < fit.rawLambda, 'shrunk toward 0');
  ok(fit.lambda <= EXP_WIN_LAMBDA_CAP, 'capped');
}

// Stamps
{
  const t = {};
  applyExpectedWinStamps(t, soxA);
  eq(t.v8_expWinBump, '4u_hot', 'stamp bump');
  eq(t.v8_mktImpliedWr, 58.0, 'stamp implied');
  ok(t.v8_expWinFrozen > 58, 'stamp frozen expected');
  eq(t.v8_expWinSource, 'frozen', 'stamp source');
}
{
  const t = {};
  applyExpectedWinStamps(t, ath);
  eq(t.v8_expWinBump, 'none', '1u stamp none');
  eq(t.v8_expWin, t.v8_mktImpliedWr, '1u stamp equal');
}

// Implied helper sanity
approx(americanOddsImpliedWr(-138), 138 / 238, 1e-12, '−138 implied');
approx(americanOddsImpliedWr(115), 100 / 215, 1e-12, '+115 implied');

// applyLambda identity
approx(applyLambda(0.58, 0), 0.58, 1e-12, 'λ=0 is identity');

console.log(`testExpectedWin: ${n} assertions passed`);
