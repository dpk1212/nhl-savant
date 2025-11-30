/**
 * OPTIMIZED A-B-C UNIT ALLOCATION SYSTEM
 * 
 * Uses 2-dimensional lookup: Grade × Odds Range
 * Based on historical performance analysis of 157 bets
 * 
 * Projected ROI: +16.60% (vs current -2.54%)
 */

// ============================================================================
// OPTIMIZED UNIT MATRIX (Grade × Odds Range)
// ============================================================================

export const ABC_UNIT_MATRIX = {
  'A': {
    'EXTREME_FAV': 1.0,   // -23% historical ROI - minimize exposure
    'BIG_FAV': 4.0,       // +16% historical ROI - strong
    'MOD_FAV': 3.0,       // +12% historical ROI - good
    'SLIGHT_FAV': 5.0,    // +25% historical ROI - excellent
    'PICKEM': 2.0,        // +1% historical ROI - barely profitable
    'DOG': 3.0            // +13% historical ROI - good value
  },
  
  'B': {
    'EXTREME_FAV': 0.5,   // +1% historical ROI - track only
    'BIG_FAV': 3.5,       // +15% historical ROI - good
    'MOD_FAV': 3.0,       // +4% historical ROI - marginal
    'SLIGHT_FAV': 5.0,    // +55% historical ROI - 🔥 ELITE!
    'PICKEM': 5.0,        // +69% historical ROI - 🔥 ELITE!
    'DOG': 2.0            // No data - conservative default
  },
  
  'C': {
    'EXTREME_FAV': 1.0,   // +2% historical ROI - barely works
    'BIG_FAV': 3.0,       // -22% historical ROI - risky but gets units by ROI-prop
    'MOD_FAV': 3.5,       // +22% historical ROI - surprisingly good!
    'SLIGHT_FAV': 1.5,    // -28% historical ROI - toxic
    'PICKEM': 0.5,        // -38% historical ROI - disaster
    'DOG': 1.0            // No data - conservative default
  }
};

// ============================================================================
// ODDS RANGE CLASSIFICATION
// ============================================================================

/**
 * Classify odds into ranges for matrix lookup
 */
export function getOddsRange(odds) {
  if (odds < -1000) return 'EXTREME_FAV';
  if (odds >= -1000 && odds < -500) return 'BIG_FAV';
  if (odds >= -500 && odds < -200) return 'MOD_FAV';
  if (odds >= -200 && odds < -150) return 'SLIGHT_FAV';
  if (odds >= -150 && odds < 150) return 'PICKEM';
  return 'DOG';  // odds >= 150
}

/**
 * Get human-readable odds range name
 */
export function getOddsRangeName(oddsRange) {
  const names = {
    'EXTREME_FAV': 'Extreme Favorite',
    'BIG_FAV': 'Big Favorite',
    'MOD_FAV': 'Moderate Favorite',
    'SLIGHT_FAV': 'Slight Favorite',
    'PICKEM': 'Pick\'em',
    'DOG': 'Underdog'
  };
  return names[oddsRange] || oddsRange;
}

// ============================================================================
// GRADE MAPPING
// ============================================================================

/**
 * Map current detailed grades to simplified A-B-C system
 */
export function simplifyGrade(grade) {
  const gradeMapping = {
    'A+': 'A',
    'A': 'A',
    'A-': 'A',
    'B+': 'B',
    'B': 'B',
    'B-': 'B',
    'C+': 'C',
    'C': 'C',
    'C-': 'C',
    'D': 'C',
    'F': 'C'
  };
  
  const normalizedGrade = grade?.toUpperCase().trim();
  return gradeMapping[normalizedGrade] || 'C';
}

// ============================================================================
// UNIT ALLOCATION FUNCTIONS
// ============================================================================

/**
 * Get optimized unit size based on grade AND odds range
 * 
 * @param {string} grade - Letter grade (A+, A, B+, B, C, etc.)
 * @param {number} odds - American odds (e.g., -175, +120)
 * @returns {number} Recommended units to bet
 */
export function getOptimizedUnitSize(grade, odds) {
  if (!grade || odds === undefined || odds === null) return 0;
  
  // Simplify to A-B-C
  const simplifiedGrade = simplifyGrade(grade);
  
  // Classify odds
  const oddsRange = getOddsRange(odds);
  
  // Lookup in matrix
  const units = ABC_UNIT_MATRIX[simplifiedGrade]?.[oddsRange];
  
  return units ?? 0;
}

/**
 * Get formatted unit display for UI
 */
export function getUnitDisplay(grade, odds) {
  const units = getOptimizedUnitSize(grade, odds);
  
  if (units === 0) return 'No Bet';
  if (units === 1) return '1u';
  return `${units}u`;
}

/**
 * Get color for unit display based on size
 */
export function getUnitColor(units) {
  if (units >= 5.0) return '#10B981'; // Green - ELITE MAX
  if (units >= 4.0) return '#14B8A6'; // Teal - excellent
  if (units >= 3.0) return '#3B82F6'; // Blue - great
  if (units >= 2.0) return '#8B5CF6'; // Purple - good
  if (units >= 1.5) return '#F59E0B'; // Amber - solid
  if (units >= 1.0) return '#FB923C'; // Orange - average
  if (units >= 0.5) return '#94A3B8'; // Gray - small bet
  return '#EF4444';                    // Red - no bet
}

/**
 * Calculate profit for a bet outcome using optimized units
 */
export function calculateUnitProfit(grade, odds, isWin) {
  const units = getOptimizedUnitSize(grade, odds);
  
  if (units === 0) return 0;
  
  if (isWin) {
    // American odds to decimal
    const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
    return units * decimal;
  } else {
    return -units; // Lost the staked amount
  }
}

// ============================================================================
// PERFORMANCE CONTEXT
// ============================================================================

/**
 * Get historical performance context for this grade/odds combination
 */
export function getPerformanceContext(grade, odds) {
  const simplifiedGrade = simplifyGrade(grade);
  const oddsRange = getOddsRange(odds);
  const units = getOptimizedUnitSize(grade, oddsRange);
  
  // Historical ROI data (from analysis)
  const historicalROI = {
    'A': {
      'EXTREME_FAV': -22.8,
      'BIG_FAV': 15.7,
      'MOD_FAV': 12.1,
      'SLIGHT_FAV': 25.0,
      'PICKEM': 1.2,
      'DOG': 12.6
    },
    'B': {
      'EXTREME_FAV': 1.0,
      'BIG_FAV': 14.9,
      'MOD_FAV': 4.0,
      'SLIGHT_FAV': 54.9,
      'PICKEM': 68.7,
      'DOG': 0
    },
    'C': {
      'EXTREME_FAV': 2.5,
      'BIG_FAV': -21.8,
      'MOD_FAV': 21.7,
      'SLIGHT_FAV': -28.1,
      'PICKEM': -38.0,
      'DOG': 0
    }
  };
  
  const roi = historicalROI[simplifiedGrade]?.[oddsRange] ?? 0;
  
  return {
    grade: simplifiedGrade,
    oddsRange,
    oddsRangeName: getOddsRangeName(oddsRange),
    units,
    historicalROI: roi,
    color: getUnitColor(units)
  };
}

/**
 * Get descriptive text for unit sizing rationale
 */
export function getUnitRationale(grade, odds) {
  const context = getPerformanceContext(grade, odds);
  
  if (context.units === 0) return 'No bet recommended';
  
  if (context.historicalROI > 50) {
    return `🔥 ELITE pattern! ${context.grade}-${context.oddsRangeName} has ${context.historicalROI.toFixed(1)}% historical ROI`;
  }
  
  if (context.historicalROI > 20) {
    return `✅ Strong pattern. ${context.grade}-${context.oddsRangeName} has ${context.historicalROI.toFixed(1)}% historical ROI`;
  }
  
  if (context.historicalROI > 10) {
    return `Good pattern. ${context.grade}-${context.oddsRangeName} has ${context.historicalROI.toFixed(1)}% historical ROI`;
  }
  
  if (context.historicalROI > 0) {
    return `⚠️ Marginal pattern. ${context.grade}-${context.oddsRangeName} has only ${context.historicalROI.toFixed(1)}% historical ROI`;
  }
  
  return `❌ Risky pattern. ${context.grade}-${context.oddsRangeName} has ${context.historicalROI.toFixed(1)}% historical ROI - minimized units`;
}

/**
 * Get emoji indicator for bet quality
 */
export function getBetQualityEmoji(grade, odds) {
  const context = getPerformanceContext(grade, odds);
  
  if (context.units >= 5.0 && context.historicalROI > 50) return '🔥🔥🔥'; // Elite
  if (context.units >= 5.0 && context.historicalROI > 20) return '🔥🔥';   // Excellent
  if (context.units >= 4.0) return '🔥';                                   // Great
  if (context.units >= 3.0) return '✅';                                   // Good
  if (context.units >= 2.0) return '👍';                                   // Decent
  if (context.units >= 1.0) return '⚠️';                                   // Marginal
  return '🟡';                                                              // Small tracking bet
}

