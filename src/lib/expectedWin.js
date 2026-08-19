/**
 * Market-anchored expected win % (tracking only — does not size units).
 *
 *   p = implied(American odds)
 *   if units ≥ 4 AND (tape BOOST or EDGE ≥ 11):
 *     p = sigmoid(logit(p) + λ)
 *
 * λ is the shrunk log-odds lift of that hot cell vs its own implied, from
 * graded staked tickets with date < asOfDate. Thin samples fall back to the
 * pre-August freeze. Path is intentionally ignored (cells flip month to month).
 *
 * Not shown on Sharp Flow cards yet — stamp now, tune in a week.
 */
import {
  TAPE_BOOST_ABOVE,
  americanOddsImpliedWr,
  logitProb,
  sigmoidProb,
} from './walletClvSkill.js';

/** Pre-August 4u+ hot cell, n=32, shrink n0=40. ~+3–4pp near a −140. */
export const EXP_WIN_LAMBDA_FROZEN = 0.146;
/** Full-book shrunk ceiling — do not print richer than the 84-ticket pile. */
export const EXP_WIN_LAMBDA_CAP = 0.35;
export const EXP_WIN_SHRINK_N0 = 40;
export const EXP_WIN_MIN_N = 15;
/** Tape/EDGE exist from this date; earlier tickets cannot form the hot cell. */
export const EXP_WIN_LOOKBACK_FROM = '2026-07-15';
export const EXP_WIN_HOT_UNITS = 4;
export const EXP_WIN_HOT_EDGE = 11;
export const EXP_WIN_STATE_COLLECTION = 'expectedWinState';
export const EXP_WIN_STATE_DOC_ID = 'current';

export function isExpWinHot({
  units = null,
  tape = null,
  edge = null,
  boostAbove = TAPE_BOOST_ABOVE,
  unitFloor = EXP_WIN_HOT_UNITS,
  edgeMin = EXP_WIN_HOT_EDGE,
} = {}) {
  const u = Number(units);
  if (!Number.isFinite(u) || u < unitFloor) return false;
  const t = tape != null && Number.isFinite(Number(tape)) ? Number(tape) : null;
  const e = edge != null && Number.isFinite(Number(edge)) ? Number(edge) : null;
  const boost = t != null && t >= boostAbove;
  const eHot = e != null && e >= edgeMin;
  return boost || eHot;
}

export function clampExpWinLambda(raw, {
  cap = EXP_WIN_LAMBDA_CAP,
  floor = 0,
} = {}) {
  if (raw == null || !Number.isFinite(Number(raw))) return 0;
  return Math.max(floor, Math.min(cap, Number(raw)));
}

export function shrinkLogOdds(raw, n, n0 = EXP_WIN_SHRINK_N0) {
  const nn = Number(n) || 0;
  const k = Number(n0) || 0;
  if (!(nn > 0) || !(k >= 0)) return 0;
  if (!Number.isFinite(Number(raw))) return 0;
  return Number(raw) * (nn / (nn + k));
}

/** 0–1 probability → percent with 1 decimal (same rounding as v8_blendWr). */
export function pct1(p) {
  if (p == null || !Number.isFinite(Number(p))) return null;
  return Math.round(Number(p) * 1000) / 10;
}

export function applyLambda(implied01, lambda) {
  if (implied01 == null || !Number.isFinite(Number(implied01))) return null;
  const lam = Number(lambda);
  if (!Number.isFinite(lam) || lam === 0) return Number(implied01);
  return sigmoidProb(logitProb(implied01) + lam);
}

/**
 * Fit λ from graded tickets. `rows` need { won, impl, units, tape, edge }.
 * Only the hot cell contributes. Thin n → frozen fallback.
 */
export function fitExpWinLambda(rows, {
  shrinkN0 = EXP_WIN_SHRINK_N0,
  minN = EXP_WIN_MIN_N,
  cap = EXP_WIN_LAMBDA_CAP,
  frozen = EXP_WIN_LAMBDA_FROZEN,
} = {}) {
  const hot = (Array.isArray(rows) ? rows : []).filter((r) => (
    isExpWinHot(r)
    && r.impl != null && Number.isFinite(Number(r.impl))
    && (r.won === 0 || r.won === 1)
  ));
  const n = hot.length;
  if (n < minN) {
    return {
      lambda: frozen,
      rawLambda: null,
      n,
      w: hot.filter((r) => r.won === 1).length,
      wr: n ? hot.filter((r) => r.won === 1).length / n : null,
      impl: n ? hot.reduce((s, r) => s + Number(r.impl), 0) / n : null,
      source: 'frozen',
    };
  }
  const w = hot.filter((r) => r.won === 1).length;
  const wr = w / n;
  const impl = hot.reduce((s, r) => s + Number(r.impl), 0) / n;
  const raw = logitProb(wr) - logitProb(impl);
  const shrunk = shrinkLogOdds(raw, n, shrinkN0);
  const lambda = clampExpWinLambda(shrunk, { cap, floor: 0 });
  return {
    lambda,
    rawLambda: raw,
    n,
    w,
    wr,
    impl,
    source: 'expanding',
  };
}

/**
 * Per-ticket blend. Tracking pair:
 *   expectedWr        — expanding λ (or frozen fallback)
 *   expectedWrFrozen  — always EXP_WIN_LAMBDA_FROZEN (the conservative print)
 */
export function computeExpectedWin({
  odds = null,
  units = null,
  tape = null,
  edge = null,
  lambda = EXP_WIN_LAMBDA_FROZEN,
  lambdaN = null,
  source = 'frozen',
} = {}) {
  const implied01 = americanOddsImpliedWr(odds);
  if (implied01 == null) return null;
  const bumped = isExpWinHot({ units, tape, edge });
  const lam = bumped ? clampExpWinLambda(lambda) : 0;
  const lamFrozen = bumped ? EXP_WIN_LAMBDA_FROZEN : 0;
  const expected01 = bumped ? applyLambda(implied01, lam) : implied01;
  const frozen01 = bumped ? applyLambda(implied01, lamFrozen) : implied01;
  return {
    impliedWr: pct1(implied01),
    expectedWr: pct1(expected01),
    expectedWrFrozen: pct1(frozen01),
    bumped,
    bump: bumped ? '4u_hot' : 'none',
    lambda: bumped ? Math.round(lam * 10000) / 10000 : 0,
    lambdaFrozen: bumped ? EXP_WIN_LAMBDA_FROZEN : 0,
    lambdaN: lambdaN != null && Number.isFinite(Number(lambdaN)) ? Number(lambdaN) : null,
    source: bumped ? (source || 'frozen') : 'none',
  };
}

/** Write tracking stamps onto a side patch (mutates target). */
export function applyExpectedWinStamps(target, result) {
  if (!target || !result || result.impliedWr == null) return target;
  target.v8_mktImpliedWr = result.impliedWr;
  target.v8_expWin = result.expectedWr;
  target.v8_expWinFrozen = result.expectedWrFrozen;
  target.v8_expWinBump = result.bump;
  target.v8_expWinLam = result.lambda;
  if (result.lambdaN != null) target.v8_expWinLamN = result.lambdaN;
  target.v8_expWinSource = result.source;
  return target;
}
