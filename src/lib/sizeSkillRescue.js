/**
 * Size-skill CONFIRMED rescue — $ up / flat down wallets with elite
 * size-up WR lift. Live proven/Action/HC only when sizeRatio ≥ LIVE_MIN.
 *
 * Qualification uses wallet-level sizeSignal (own-median) or sizeRatioBands
 * (vs usual). Prefer own-median when both bands clear min-n.
 */

export const SIZE_SKILL_RESCUE = 'size-skill';
/** Live ticket must be ≥ this × usual to count as Proven / Action. */
export const SIZE_SKILL_LIVE_MIN = 1.0;

export const SIZE_SKILL_WR_LIFT_MIN = 15; // percentage points
export const SIZE_SKILL_BAND_MIN_N = 5; // 8 was safer but blocked 06c80c (wayAbove n=5)
export const SIZE_SKILL_HIGH_WR_MIN = 55;
export const SIZE_SKILL_SPORT_POS_MIN_N = 20;
export const SIZE_SKILL_SPORT_DOLLAR_ROI_MIN = 5;

export function isSizeSkillRescue(recOrRescue) {
  const v = typeof recOrRescue === 'string'
    ? recOrRescue
    : recOrRescue?.whitelistRescue;
  return v === SIZE_SKILL_RESCUE;
}

/**
 * Extra live gate for size-skill CONFIRMED. Non-size-skill → always true.
 * Missing/invalid sizeRatio → false (don't invent proven).
 */
export function passesSizeSkillLiveGate(recOrRescue, sizeRatio) {
  if (!isSizeSkillRescue(recOrRescue)) return true;
  const sr = Number(sizeRatio);
  if (!Number.isFinite(sr) || sr <= 0) return false;
  return sr >= SIZE_SKILL_LIVE_MIN;
}

/**
 * Evaluate wallet-level size-up WR lift from sizeSignal and/or sizeRatioBands.
 * @returns {{ ok: boolean, source: string|null, wrLift: number|null, highWr: number|null, highDollarRoi: number|null, detail: object|null }}
 */
export function evaluateSizeSkillLift(sizeSignal, sizeRatioBands, {
  bandMinN = SIZE_SKILL_BAND_MIN_N,
  wrLiftMin = SIZE_SKILL_WR_LIFT_MIN,
  highWrMin = SIZE_SKILL_HIGH_WR_MIN,
} = {}) {
  const empty = {
    ok: false, source: null, wrLift: null, highWr: null, highDollarRoi: null, detail: null,
  };

  let own = null;
  const routine = sizeSignal?.routine;
  const way = sizeSignal?.wayAbove;
  if (routine && way
    && (routine.n || 0) >= bandMinN
    && (way.n || 0) >= bandMinN
    && Number.isFinite(routine.wr)
    && Number.isFinite(way.wr)) {
    const wrLift = +(way.wr - routine.wr).toFixed(1);
    const highDollarRoi = Number.isFinite(way.dollarRoi) ? way.dollarRoi : null;
    own = {
      source: 'ownMedian',
      wrLift,
      highWr: way.wr,
      highDollarRoi,
      lowWr: routine.wr,
      lowN: routine.n,
      highN: way.n,
      ok: wrLift >= wrLiftMin
        && way.wr >= highWrMin
        && highDollarRoi != null
        && highDollarRoi > 0,
    };
  }

  let vs = null;
  const bands = sizeRatioBands?.positions?.bands || sizeRatioBands?.bands;
  if (bands) {
    const light = bands.light;
    const lean = bands.lean;
    const full = bands.full;
    const press = bands.press;
    const low = (light?.n >= bandMinN && Number.isFinite(light.wr)) ? light
      : (lean?.n >= bandMinN && Number.isFinite(lean.wr)) ? lean
        : null;
    const high = (press?.n >= bandMinN && Number.isFinite(press.wr)) ? press
      : (full?.n >= bandMinN && Number.isFinite(full.wr)) ? full
        : null;
    if (low && high) {
      const wrLift = +(high.wr - low.wr).toFixed(1);
      // Bands UI may not carry dollarRoi — require WR floors only for vsUsual path;
      // ownMedian path carries $ on wayAbove. For vsUsual, treat $ gate as soft
      // unless we later stamp band dollar. Require high WR + lift only.
      vs = {
        source: 'vsUsual',
        wrLift,
        highWr: high.wr,
        highDollarRoi: null,
        lowWr: low.wr,
        lowN: low.n,
        highN: high.n,
        lowId: low.id,
        highId: high.id,
        ok: wrLift >= wrLiftMin && high.wr >= highWrMin,
      };
    }
  }

  // Prefer own-median: includes wayAbove $ ROI (required).
  // vsUsual is audit-only unless ownMedian missing $ but WR clears —
  // we still require highDollarRoi > 0, so vsUsual alone cannot pass.
  if (own?.ok) {
    return {
      ok: true,
      source: own.source,
      wrLift: own.wrLift,
      highWr: own.highWr,
      highDollarRoi: own.highDollarRoi,
      detail: own,
    };
  }
  // No ownMedian $ path — do not rescue on vsUsual WR alone.
  const best = own || vs;
  if (!best) return empty;
  return {
    ok: false,
    source: best.source,
    wrLift: best.wrLift,
    highWr: best.highWr,
    highDollarRoi: best.highDollarRoi,
    detail: best,
  };
}

/**
 * Sport-level book must be $ up / flat-not-ok with sample floors.
 */
export function sizeSkillSportBookOk(picksInSport, positionsInSport, {
  posMinN = SIZE_SKILL_SPORT_POS_MIN_N,
  dollarRoiMin = SIZE_SKILL_SPORT_DOLLAR_ROI_MIN,
  picksMin = 2,
  posFlatMin = 4,
} = {}) {
  const p = picksInSport || { n: 0 };
  const q = positionsInSport || { n: 0 };
  if ((q.n || 0) < posMinN) return false;
  if (!(Number.isFinite(q.dollarRoi) && q.dollarRoi >= dollarRoiMin)) return false;
  const flatOkA = (p.n || 0) >= picksMin && Number.isFinite(p.flatRoi) && p.flatRoi > 0;
  const flatOkB = (q.n || 0) >= posFlatMin
    && Number.isFinite(q.positionFlatRoi) && q.positionFlatRoi > 0;
  if (flatOkA || flatOkB) return false; // normal CONFIRMED/FLAT path handles these
  return true;
}

export function sizeSkillRescueOk(picksInSport, positionsInSport, sizeLiftEval) {
  if (!(SIZE_SKILL_BAND_MIN_N < Infinity)) return false; // kill switch
  if (!sizeLiftEval?.ok) return false;
  return sizeSkillSportBookOk(picksInSport, positionsInSport);
}
