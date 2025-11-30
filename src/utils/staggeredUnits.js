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

/**
 * Get the recommended unit size for a given grade
 * NOW REQUIRES ODDS for the optimized matrix lookup
 * @param {string} grade - Quality grade (A, B, C)
 * @param {number} odds - Moneyline odds (for odds range calculation)
 * @returns {number} - Unit size
 */
export function getUnitSize(grade, odds) {
  if (!grade || !odds) return 0;
  return getOptimizedUnitSize(grade, odds);
}

/**
 * Get formatted unit display for UI
 * @param {string} grade - Quality grade
 * @param {number} odds - Moneyline odds
 * @returns {string} - Formatted unit string (e.g., "2u")
 */
export function getUnitDisplay(grade, odds) {
  if (!grade || !odds) return 'No Bet';
  return getAbcUnitDisplay(grade, odds);
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
 * @param {number} odds - Moneyline odds
 * @param {boolean} isWin - Whether the bet won
 * @returns {number} - Profit in units
 */
export function calculateUnitProfit(grade, odds, isWin) {
  return calculateAbcUnitProfit(grade, odds, isWin);
}

// Legacy UNIT_ALLOCATION export for backward compatibility
// (not used by new system, but kept to avoid breaking old code)
export const UNIT_ALLOCATION = {
  'A': 4.0,
  'B': 2.0,
  'C': 1.0
};
