/**
 * Staggered Unit Betting System
 * 
 * UPDATED: Now uses the optimized ABC Grade×Odds Matrix system
 * Wrapper to maintain backward compatibility with existing code
 */

import {
  getOptimizedUnitSize,
  getUnitDisplay as getAbcUnitDisplay,
  getUnitColor as getAbcUnitColor,
  calculateUnitProfit as calculateAbcUnitProfit
} from './abcUnits.js';

// Legacy UNIT_ALLOCATION for simple grade-only lookups
const LEGACY_UNIT_ALLOCATION = {
  'A': 2.0,   // Default for A grade
  'B': 2.0,   // Default for B grade  
  'C': 1.0    // Default for C grade
};

/**
 * Get the recommended unit size for a given grade
 * SUPPORTS BOTH:
 * - getUnitSize(grade, odds) - NEW optimized matrix lookup
 * - getUnitSize(grade) - LEGACY simple grade-only lookup
 * 
 * @param {string} grade - Quality grade (A, B, C)
 * @param {number} [odds] - Optional: Moneyline odds (for odds range calculation)
 * @returns {number} - Unit size
 */
export function getUnitSize(grade, odds) {
  if (!grade) return 0;
  
  // NEW: If odds provided, use optimized matrix
  if (odds !== undefined && odds !== null) {
    return getOptimizedUnitSize(grade, odds);
  }
  
  // LEGACY: Grade-only lookup (backward compatibility)
  const normalizedGrade = grade.toUpperCase().trim();
  return LEGACY_UNIT_ALLOCATION[normalizedGrade] || 0;
}

/**
 * Get formatted unit display for UI
 * @param {string} grade - Quality grade
 * @param {number} [odds] - Optional: Moneyline odds
 * @returns {string} - Formatted unit string (e.g., "2u")
 */
export function getUnitDisplay(grade, odds) {
  if (!grade) return 'No Bet';
  
  // If odds provided, use optimized display
  if (odds !== undefined && odds !== null) {
    return getAbcUnitDisplay(grade, odds);
  }
  
  // Legacy: Simple unit display
  const units = getUnitSize(grade);
  if (units === 0) return 'No Bet';
  return `${units}u`;
}

/**
 * Get color for unit display based on size
 * @param {number} units - Unit size
 * @returns {string} - Color hex code
 */
export function getUnitColor(units) {
  return getAbcUnitColor(units);
}

/**
 * Calculate profit/loss for a completed bet
 * @param {string} grade - Quality grade
 * @param {number} odds - Moneyline odds (REQUIRED for profit calculation)
 * @param {boolean} isWin - Whether the bet won
 * @returns {number} - Profit in units
 */
export function calculateUnitProfit(grade, odds, isWin) {
  if (!odds) return 0;
  return calculateAbcUnitProfit(grade, odds, isWin);
}

// Export for backward compatibility
export const UNIT_ALLOCATION = LEGACY_UNIT_ALLOCATION;
