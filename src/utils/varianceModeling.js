/**
 * Variance Modeling - Add prediction spread based on team strength differences
 * This is the KEY to beating baseline: differentiating matchups
 */

export class VarianceModeling {
  constructor(leagueAvgXGF = 2.485) {
    this.leagueAvg = leagueAvgXGF;
  }

  /**
   * Calculate strength multipliers to amplify team differences
   * Elite teams should predict HIGHER, weak teams should predict LOWER
   */
  applyStrengthMultipliers(teamXGF, oppXGA, teamXGA, oppXGF) {
    // How much better/worse than league average?
    const offensiveStrength = teamXGF / this.leagueAvg;  // e.g., 1.2 = 20% better
    const defensiveWeakness = oppXGA / this.leagueAvg;   // e.g., 1.1 = 10% worse defense (allows more)
    
    // Amplify differences using power function
    // Exponent > 1 = amplify elite teams, dampen weak teams
    const AMPLIFICATION_FACTOR = 1.20;  // Higher = more spread
    const offensiveMultiplier = Math.pow(offensiveStrength, AMPLIFICATION_FACTOR);
    const defensiveMultiplier = Math.pow(defensiveWeakness, AMPLIFICATION_FACTOR);
    
    // Combined matchup multiplier
    // Use geometric mean to preserve balance
    const matchupMultiplier = Math.sqrt(offensiveMultiplier * defensiveMultiplier);
    
    return {
      offensiveStrength,
      defensiveWeakness,
      offensiveMultiplier,
      defensiveMultiplier,
      matchupMultiplier,
      // For debugging
      expectedImpact: ((matchupMultiplier - 1.0) * 100).toFixed(1) + '%'
    };
  }

  /**
   * Calculate game-specific variance based on matchup
   * Big mismatches = more variance, even matchups = less variance
   */
  calculateGameVariance(teamXGF, oppXGA, teamXGA, oppXGF) {
    // Factor 1: Offensive firepower differential
    const offensiveDiff = Math.abs(teamXGF - oppXGF);
    
    // Factor 2: Defensive mismatch
    const defensiveDiff = Math.abs(teamXGA - oppXGA);
    
    // Factor 3: Total strength asymmetry
    const teamStrength = teamXGF - teamXGA;  // Net rating
    const oppStrength = oppXGF - oppXGA;
    const strengthGap = Math.abs(teamStrength - oppStrength);
    
    // Combined matchup factor
    const matchupFactor = (offensiveDiff + defensiveDiff + strengthGap) / 3;
    
    // NHL average std dev for total goals is ~1.8
    const BASE_VARIANCE = 1.8;
    
    // Scale variance based on matchup
    // Big mismatch → more variance (wider range of possible outcomes)
    // Even matchup → less variance (predictable game)
    const varianceMultiplier = 1.0 + (matchupFactor * 0.3);
    
    return {
      baseVariance: BASE_VARIANCE,
      matchupFactor,
      varianceMultiplier,
      expectedStdDev: BASE_VARIANCE * varianceMultiplier
    };
  }

  /**
   * Apply both strength and variance adjustments to prediction
   */
  adjustPrediction(basePrediction, teamXGF, oppXGA, teamXGA, oppXGF) {
    // Get strength multiplier
    const strength = this.applyStrengthMultipliers(teamXGF, oppXGA, teamXGA, oppXGF);
    
    // Apply to base prediction
    const strengthAdjusted = basePrediction * strength.matchupMultiplier;
    
    // Get variance info (for reference, not directly applied to point estimate)
    const variance = this.calculateGameVariance(teamXGF, oppXGA, teamXGA, oppXGF);
    
    return {
      original: basePrediction,
      adjusted: strengthAdjusted,
      change: strengthAdjusted - basePrediction,
      changePercent: ((strengthAdjusted / basePrediction - 1.0) * 100).toFixed(1) + '%',
      variance: variance.expectedStdDev,
      details: {
        strength,
        variance
      }
    };
  }

  /**
   * Get recommended prediction range (mean ± 1 std dev)
   */
  getPredictionRange(prediction, variance) {
    return {
      low: prediction - variance,
      mid: prediction,
      high: prediction + variance,
      range: variance * 2
    };
  }
}

/**
 * Helper: Apply variance-based spread to flatten overpredictions
 */
export function applyVarianceSpread(predictions) {
  // Calculate current mean and std dev
  const mean = predictions.reduce((a, b) => a + b, 0) / predictions.length;
  const variance = predictions.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / predictions.length;
  const stdDev = Math.sqrt(variance);
  
  // Target std dev (NHL actual is ~1.8 goals)
  const TARGET_STD_DEV = 1.2;  // Conservative target
  
  // If current std dev is too low, scale predictions away from mean
  if (stdDev < TARGET_STD_DEV) {
    const scaleFactor = TARGET_STD_DEV / stdDev;
    return predictions.map(p => mean + (p - mean) * scaleFactor);
  }
  
  return predictions;
}

