/**
 * Staggered Unit Betting System
 * 
 * Based on prediction quality grade (A+ to F), 
 * allocate different unit sizes for optimal bankroll management
 */

export const UNIT_ALLOCATION = {
  'A+': 3.0,  // Elite picks - 3 units
  'A': 2.5,   // Excellent picks - 2.5 units
  'A-': 2.0,  // Great picks - 2 units
  'B+': 1.5,  // Good picks - 1.5 units
  'B': 1.0,   // Solid picks - 1 unit
  'B-': 0.75, // Average picks - 0.75 units
  'C+': 0.5,  // Below average - 0.5 units
  'C': 0.25,  // Poor picks - 0.25 units
  'C-': 0,    // Very poor - no bet
  'D': 0,     // Bad - no bet
  'F': 0      // Terrible - no bet
};

/**
 * Get the recommended unit size for a given grade
 */
export function getUnitSize(grade) {
  if (!grade) return 0;
  
  const normalizedGrade = grade.toUpperCase().trim();
  return UNIT_ALLOCATION[normalizedGrade] || 0;
}

/**
 * Get formatted unit display for UI
 */
export function getUnitDisplay(grade) {
  const units = getUnitSize(grade);
  
  if (units === 0) return 'No Bet';
  if (units === 1) return '1u';
  return `${units}u`;
}

/**
 * Get color for unit display based on size
 */
export function getUnitColor(grade) {
  const units = getUnitSize(grade);
  
  if (units >= 2.5) return '#10B981'; // Green - elite
  if (units >= 2.0) return '#14B8A6'; // Teal - great
  if (units >= 1.5) return '#3B82F6'; // Blue - good
  if (units >= 1.0) return '#F59E0B'; // Amber - solid
  if (units > 0) return '#94A3B8';    // Gray - small bet
  return '#EF4444';                    // Red - no bet
}

/**
 * Calculate profit for a bet outcome using staggered units
 */
export function calculateUnitProfit(grade, odds, isWin) {
  const units = getUnitSize(grade);
  
  if (units === 0) return 0;
  
  if (isWin) {
    // American odds to decimal
    const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
    return units * decimal;
  } else {
    return -units; // Lost the staked amount
  }
}

/**
 * Get descriptive text for unit sizing rationale
 */
export function getUnitRationale(grade) {
  const units = getUnitSize(grade);
  
  if (units >= 2.5) return 'Elite confidence - max allocation';
  if (units >= 2.0) return 'High confidence - aggressive sizing';
  if (units >= 1.5) return 'Good opportunity - above standard';
  if (units >= 1.0) return 'Standard bet sizing';
  if (units > 0) return 'Small edge - conservative sizing';
  return 'Edge insufficient for bet';
}

