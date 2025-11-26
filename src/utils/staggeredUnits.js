/**
 * Staggered Unit Betting System
 * 
 * Based on prediction quality grade (A+ to F), 
 * allocate different unit sizes for optimal bankroll management
 */

export const UNIT_ALLOCATION = {
  'A+': 5.0,  // Elite picks - MAX ALLOCATION
  'A': 4.0,   // Excellent picks - heavy sizing
  'A-': 3.0,  // Great picks - aggressive
  'B+': 2.0,  // Good picks - above standard
  'B': 1.5,   // Solid picks - standard+
  'B-': 1.0,  // Average picks - baseline
  'C+': 0.5,  // Below average - small bet
  'C': 0.5,   // Poor picks - small bet
  'C-': 0.5,  // Very poor - small bet
  'D': 0.5,   // Bad - small bet (track for learning)
  'F': 0.5    // Terrible - small bet (track for learning)
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
  
  if (units >= 5.0) return '#10B981'; // Green - ELITE MAX
  if (units >= 4.0) return '#14B8A6'; // Teal - excellent
  if (units >= 3.0) return '#3B82F6'; // Blue - great
  if (units >= 2.0) return '#8B5CF6'; // Purple - good
  if (units >= 1.5) return '#F59E0B'; // Amber - solid
  if (units >= 1.0) return '#FB923C'; // Orange - average
  if (units >= 0.5) return '#94A3B8'; // Gray - small bet
  return '#EF4444';                    // Red - no bet (shouldn't happen)
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
  
  if (units >= 5.0) return 'Elite confidence - MAX ALLOCATION';
  if (units >= 4.0) return 'Excellent - heavy sizing';
  if (units >= 3.0) return 'High confidence - aggressive sizing';
  if (units >= 2.0) return 'Good opportunity - above standard';
  if (units >= 1.5) return 'Solid pick - standard+';
  if (units >= 1.0) return 'Average - baseline sizing';
  if (units > 0) return 'Small bet - tracking for learning';
  return 'No bet';
}

