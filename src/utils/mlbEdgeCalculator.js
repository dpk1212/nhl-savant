/**
 * MLB Edge Calculator
 *
 * Ensemble model: 50/50 DRatings + Dimers blend (will tune after performance data).
 * Moneyline-first approach — baseball is fundamentally a ML sport.
 * Calculates EV, Pinnacle edge, and grades each side.
 */

const WEIGHTS = { dratings: 0.50, dimers: 0.50 };

// Grading thresholds (EV %)
const GRADE_THRESHOLDS = { A: 5.0, B: 3.0, C: 1.0, D: -3, F: -100 };

/**
 * Convert American moneyline odds to implied probability.
 */
export function oddsToProb(odds) {
  if (!odds || odds === 0) return 0.5;
  return odds > 0
    ? 100 / (odds + 100)
    : Math.abs(odds) / (Math.abs(odds) + 100);
}

/**
 * Convert probability (0-1) to fair American moneyline.
 */
export function probToOdds(prob) {
  if (prob <= 0 || prob >= 1) return null;
  return prob >= 0.5
    ? Math.round(-100 * prob / (1 - prob))
    : Math.round(100 * (1 - prob) / prob);
}

/**
 * Calculate EV % for a given model probability and market odds.
 */
export function calculateEV(modelProb, marketOdds) {
  if (!modelProb || !marketOdds) return null;
  let decimal;
  if (marketOdds > 0) {
    decimal = 1 + marketOdds / 100;
  } else {
    decimal = 1 + 100 / Math.abs(marketOdds);
  }
  return ((modelProb * decimal) - 1) * 100;
}

function getGrade(ev) {
  if (ev == null) return 'N/A';
  if (ev >= GRADE_THRESHOLDS.A) return 'A';
  if (ev >= GRADE_THRESHOLDS.B) return 'B';
  if (ev >= GRADE_THRESHOLDS.C) return 'C';
  if (ev >= GRADE_THRESHOLDS.D) return 'D';
  return 'F';
}

/**
 * Build an ensemble prediction for a single matched game.
 *
 * @param {object} game - Must have:
 *   .dratings  { awayWinProb, homeWinProb, awayRuns?, homeRuns? }
 *   .dimers    { awayWinProb, homeWinProb }                     (optional)
 *   .odds      { awayOdds, homeOdds, pinnacleAway?, pinnacleHome?, awayBook?, homeBook? }
 * @returns {object} prediction
 */
export function calculateMLBPrediction(game) {
  const { dratings, dimers, odds } = game;

  if (!odds || (!odds.awayOdds && !odds.homeOdds)) {
    return { error: 'Missing odds data', grade: 'N/A' };
  }

  let ensembleAwayProb = null;
  let ensembleHomeProb = null;
  let confidence = 'LOW';
  let modelsAgree = null;

  if (dratings?.awayWinProb && dimers?.awayWinProb) {
    // Both models available — 50/50 blend
    ensembleAwayProb =
      dratings.awayWinProb * WEIGHTS.dratings +
      dimers.awayWinProb * WEIGHTS.dimers;
    ensembleHomeProb = 1 - ensembleAwayProb;
    confidence = 'HIGH';

    // Model agreement: both pick the same winner
    const drPicksAway = dratings.awayWinProb > 0.5;
    const dimPicksAway = dimers.awayWinProb > 0.5;
    modelsAgree = drPicksAway === dimPicksAway;
  } else if (dratings?.awayWinProb) {
    ensembleAwayProb = dratings.awayWinProb;
    ensembleHomeProb = 1 - ensembleAwayProb;
    confidence = 'MEDIUM';
  } else if (dimers?.awayWinProb) {
    ensembleAwayProb = dimers.awayWinProb;
    ensembleHomeProb = 1 - ensembleAwayProb;
    confidence = 'MEDIUM';
  } else {
    return { error: 'No model data', grade: 'N/A' };
  }

  // Market implied probabilities
  const marketAwayProb = oddsToProb(odds.awayOdds);
  const marketHomeProb = oddsToProb(odds.homeOdds);

  // Edge = model prob − market prob
  const awayEdge = ensembleAwayProb - marketAwayProb;
  const homeEdge = ensembleHomeProb - marketHomeProb;

  // EV at best retail odds
  const awayEV = calculateEV(ensembleAwayProb, odds.awayOdds);
  const homeEV = calculateEV(ensembleHomeProb, odds.homeOdds);

  // Pick the side with the best EV
  const bestSide = awayEV >= homeEV ? 'away' : 'home';
  const bestEV = bestSide === 'away' ? awayEV : homeEV;
  const bestEdge = bestSide === 'away' ? awayEdge : homeEdge;
  const bestOdds = bestSide === 'away' ? odds.awayOdds : odds.homeOdds;
  const bestBook = bestSide === 'away' ? odds.awayBook : odds.homeBook;
  const bestTeam = bestSide === 'away' ? game.awayTeam : game.homeTeam;
  const bestProb = bestSide === 'away' ? ensembleAwayProb : ensembleHomeProb;

  const grade = getGrade(bestEV);

  // Pinnacle edge (if pinnacle odds available)
  let pinnacleEdge = null;
  if (odds.pinnacleAway && odds.pinnacleHome) {
    const pinnProb = bestSide === 'away'
      ? oddsToProb(odds.pinnacleAway)
      : oddsToProb(odds.pinnacleHome);
    const retailProb = oddsToProb(bestOdds);
    pinnacleEdge = (pinnProb - retailProb) * 100;
  }

  // Predicted total runs (DRatings only)
  let predictedTotal = null;
  if (dratings?.awayRuns && dratings?.homeRuns) {
    predictedTotal = dratings.awayRuns + dratings.homeRuns;
  }

  return {
    ensembleAwayProb,
    ensembleHomeProb,
    dratingsAwayProb: dratings?.awayWinProb ?? null,
    dratingsHomeProb: dratings?.homeWinProb ?? null,
    dimersAwayProb: dimers?.awayWinProb ?? null,
    dimersHomeProb: dimers?.homeWinProb ?? null,
    marketAwayProb,
    marketHomeProb,
    awayEV,
    homeEV,
    awayEdge,
    homeEdge,
    bestSide,
    bestTeam,
    bestEV,
    bestEdge,
    bestOdds,
    bestBook: bestBook || null,
    bestProb,
    grade,
    confidence,
    modelsAgree,
    pinnacleEdge,
    predictedTotal,
    dratingsAwayRuns: dratings?.awayRuns ?? null,
    dratingsHomeRuns: dratings?.homeRuns ?? null,
    awayPitcher: dratings?.awayPitcher ?? null,
    homePitcher: dratings?.homePitcher ?? null,
  };
}

/**
 * Determine unit size from EV and model agreement.
 *
 * Conservative 0.75–1.5u range (NHL-style sizing).
 * Model-only picks without sharp money confirmation warrant
 * smaller positions than the Sharp Flow system.
 *
 * Returns 0 if the game doesn't pass the gate.
 */
export function calculateUnits(prediction) {
  const { bestEV, modelsAgree, grade, confidence } = prediction;

  // Gate: need at least C grade (EV >= 1%)
  if (!bestEV || bestEV < 1.0) return 0;
  if (grade === 'D' || grade === 'F' || grade === 'N/A') return 0;

  // Base units from EV (conservative 0.75–1.25 range)
  let units;
  if (bestEV >= 8) units = 1.25;
  else if (bestEV >= 5) units = 1.0;
  else if (bestEV >= 3) units = 1.0;
  else units = 0.75;

  // Boost +0.25u if both models agree on same winner
  if (modelsAgree && confidence === 'HIGH') {
    units += 0.25;
  }

  // Cap at 1.5u, floor at 0.75u
  return Math.min(Math.max(units, 0.75), 1.5);
}
