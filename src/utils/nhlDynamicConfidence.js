/**
 * NHL Dynamic Confidence Unit Calculator
 * Uses ROI-based weights to determine optimal unit sizing
 * Scale: 0.5u (low confidence) to 1.5u (high confidence)
 */

// Default weights if no data available
const DEFAULT_WEIGHTS = {
  factors: {
    rating: { 'A+': { weight: 0.1 }, 'A': { weight: 0.15 }, 'B+': { weight: 0.4 } },
    oddsRange: {
      heavy_favorite: { weight: -0.2 },
      moderate_favorite: { weight: 0 },
      slight_favorite: { weight: -0.3 },
      pickem: { weight: -0.5 },
      slight_dog: { weight: 0.3 },
      moderate_dog: { weight: 0.4 },
      big_dog: { weight: -0.2 }
    },
    evRange: {
      elite: { weight: -0.1 },
      strong: { weight: 0.2 },
      good: { weight: 0.1 }
    },
    confidence: {
      HIGH: { weight: 0.5 },
      MEDIUM: { weight: 0.5 },
      LOW: { weight: -0.3 }
    },
    side: {
      HOME: { weight: 0 },
      AWAY: { weight: 0.05 }
    },
    modelProb: {
      very_high: { weight: -0.2 },
      high: { weight: -0.2 },
      medium: { weight: -0.1 },
      low: { weight: 0.3 }
    }
  }
};

// Cache for loaded weights
let cachedWeights = null;
let weightsLoadPromise = null;

/**
 * Load confidence weights from JSON file
 */
export async function loadNHLConfidenceWeights() {
  if (cachedWeights) return cachedWeights;
  
  if (weightsLoadPromise) return weightsLoadPromise;
  
  weightsLoadPromise = (async () => {
    try {
      const response = await fetch('/nhl_confidence_weights.json');
      if (response.ok) {
        cachedWeights = await response.json();
        console.log(`✅ Loaded NHL weights from ${cachedWeights.totalBets} graded bets`);
        return cachedWeights;
      }
    } catch (error) {
      console.warn('⚠️ Could not load NHL weights, using defaults');
    }
    cachedWeights = DEFAULT_WEIGHTS;
    return cachedWeights;
  })();
  
  return weightsLoadPromise;
}

/**
 * Get odds range category
 */
function getOddsRange(odds) {
  if (odds <= -200) return 'heavy_favorite';
  if (odds > -200 && odds <= -150) return 'moderate_favorite';
  if (odds > -150 && odds < -100) return 'slight_favorite';
  if (Math.abs(odds) <= 109 || odds === -110) return 'pickem';
  if (odds >= 110 && odds < 150) return 'slight_dog';
  if (odds >= 150 && odds < 200) return 'moderate_dog';
  if (odds >= 200) return 'big_dog';
  return 'pickem';
}

/**
 * Get EV range category
 */
function getEVRange(evPercent) {
  if (evPercent >= 10) return 'elite';
  if (evPercent >= 5) return 'strong';
  if (evPercent >= 1.5) return 'good';
  return 'low';
}

/**
 * Get model probability range category
 */
function getModelProbRange(modelProb) {
  if (modelProb >= 0.70) return 'very_high';
  if (modelProb >= 0.60) return 'high';
  if (modelProb >= 0.50) return 'medium';
  return 'low';
}

/**
 * Calculate dynamic unit size for an NHL bet
 * @param {Object} bet - The bet object with prediction data
 * @param {Object} weights - The loaded confidence weights
 * @returns {Object} { units, tier, score, factors }
 */
export function calculateNHLDynamicUnits(bet, weights = null) {
  const w = weights || cachedWeights || DEFAULT_WEIGHTS;
  
  // Extract bet properties
  const rating = bet.prediction?.rating || 'B+';
  const odds = bet.bet?.odds || 0;
  const evPercent = bet.prediction?.evPercent || 0;
  const confidence = bet.prediction?.confidence || 'MEDIUM';
  const side = bet.bet?.side || 'HOME';
  const modelProb = bet.prediction?.modelProb || 0.5;
  
  // Calculate confidence score from weighted factors
  let score = 0;
  const factorBreakdown = {};
  
  // Factor 1: Rating
  const ratingWeight = w.factors?.rating?.[rating]?.weight || 0;
  score += ratingWeight;
  factorBreakdown.rating = { value: rating, weight: ratingWeight };
  
  // Factor 2: Odds Range
  const oddsRange = getOddsRange(odds);
  const oddsWeight = w.factors?.oddsRange?.[oddsRange]?.weight || 0;
  score += oddsWeight;
  factorBreakdown.oddsRange = { value: oddsRange, weight: oddsWeight };
  
  // Factor 3: EV Range
  const evRange = getEVRange(evPercent);
  const evWeight = w.factors?.evRange?.[evRange]?.weight || 0;
  score += evWeight;
  factorBreakdown.evRange = { value: evRange, weight: evWeight };
  
  // Factor 4: Confidence Level
  const confWeight = w.factors?.confidence?.[confidence]?.weight || 0;
  score += confWeight;
  factorBreakdown.confidence = { value: confidence, weight: confWeight };
  
  // Factor 5: Side (Home/Away)
  const sideWeight = w.factors?.side?.[side]?.weight || 0;
  score += sideWeight;
  factorBreakdown.side = { value: side, weight: sideWeight };
  
  // Factor 6: Model Probability
  const probRange = getModelProbRange(modelProb);
  const probWeight = w.factors?.modelProb?.[probRange]?.weight || 0;
  score += probWeight;
  factorBreakdown.modelProb = { value: probRange, weight: probWeight };
  
  // Normalize score to -1 to +1 range (typically falls in -0.5 to +1.5)
  const normalizedScore = Math.max(-1, Math.min(1, score));
  
  // Map to unit scale: 0.5u to 1.5u
  // Score -1 → 0.5u, Score 0 → 1.0u, Score +1 → 1.5u
  let units = 1.0 + (normalizedScore * 0.5);
  units = Math.max(0.5, Math.min(1.5, units));
  
  // Round to nearest 0.25u
  units = Math.round(units * 4) / 4;
  
  // Determine tier based on units
  let tier;
  if (units >= 1.5) tier = '🔥 MAX CONFIDENCE';
  else if (units >= 1.25) tier = '💪 HIGH CONFIDENCE';
  else if (units >= 1.0) tier = '✅ STANDARD';
  else if (units >= 0.75) tier = '⚠️ REDUCED';
  else tier = '🔻 MINIMUM';
  
  return {
    units,
    tier,
    score: normalizedScore,
    rawScore: score,
    factors: factorBreakdown
  };
}

/**
 * Get tier info for display in UI
 * @param {Object} bet - Bet object from Firebase (may have stored tier info)
 * @returns {Object} { units, tier, color, label }
 */
export function getNHLDynamicTierInfo(bet) {
  // If bet already has dynamic confidence info, use it
  if (bet.prediction?.dynamicUnits && bet.prediction?.dynamicTier) {
    const units = bet.prediction.dynamicUnits;
    const tier = bet.prediction.dynamicTier;
    
    let color, label;
    if (units >= 1.5) { color = '#22c55e'; label = 'MAX'; }
    else if (units >= 1.25) { color = '#3b82f6'; label = 'HIGH'; }
    else if (units >= 1.0) { color = '#a855f7'; label = 'STD'; }
    else if (units >= 0.75) { color = '#f59e0b'; label = 'LOW'; }
    else { color = '#6b7280'; label = 'MIN'; }
    
    return { units, tier, color, label };
  }
  
  // Otherwise calculate on the fly
  const result = calculateNHLDynamicUnits(bet);
  
  let color, label;
  if (result.units >= 1.5) { color = '#22c55e'; label = 'MAX'; }
  else if (result.units >= 1.25) { color = '#3b82f6'; label = 'HIGH'; }
  else if (result.units >= 1.0) { color = '#a855f7'; label = 'STD'; }
  else if (result.units >= 0.75) { color = '#f59e0b'; label = 'LOW'; }
  else { color = '#6b7280'; label = 'MIN'; }
  
  return {
    units: result.units,
    tier: result.tier,
    color,
    label
  };
}

/**
 * Backtest the dynamic unit system against historical bets
 * @param {Array} bets - Array of completed bets
 * @param {Object} weights - Confidence weights
 */
export function backtestNHLDynamicUnits(bets, weights) {
  let totalUnits = 0;
  let totalProfit = 0;
  let flatProfit = 0;
  
  const tierStats = {
    'MAX': { bets: 0, profit: 0, units: 0, wins: 0, losses: 0 },
    'HIGH': { bets: 0, profit: 0, units: 0, wins: 0, losses: 0 },
    'STD': { bets: 0, profit: 0, units: 0, wins: 0, losses: 0 },
    'LOW': { bets: 0, profit: 0, units: 0, wins: 0, losses: 0 },
    'MIN': { bets: 0, profit: 0, units: 0, wins: 0, losses: 0 }
  };
  
  bets.forEach(bet => {
    const result = calculateNHLDynamicUnits(bet, weights);
    const units = result.units;
    const tierKey = result.tier.includes('MAX') ? 'MAX' :
                    result.tier.includes('HIGH') ? 'HIGH' :
                    result.tier.includes('STANDARD') ? 'STD' :
                    result.tier.includes('REDUCED') ? 'LOW' : 'MIN';
    
    const outcome = bet.result?.outcome;
    const odds = bet.bet?.odds || 0;
    
    let betProfit = 0;
    if (outcome === 'WIN') {
      betProfit = odds > 0 ? units * (odds / 100) : units * (100 / Math.abs(odds));
      tierStats[tierKey].wins++;
    } else if (outcome === 'LOSS') {
      betProfit = -units;
      tierStats[tierKey].losses++;
    }
    
    totalUnits += units;
    totalProfit += betProfit;
    flatProfit += bet.result?.profit || 0;
    
    tierStats[tierKey].bets++;
    tierStats[tierKey].profit += betProfit;
    tierStats[tierKey].units += units;
  });
  
  return {
    totalBets: bets.length,
    totalUnits,
    totalProfit,
    flatProfit,
    improvement: totalProfit - flatProfit,
    dynamicROI: (totalProfit / totalUnits) * 100,
    flatROI: (flatProfit / bets.length) * 100,
    tierStats
  };
}

