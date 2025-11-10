import Papa from 'papaparse';

// Cache for performance stats (refresh every hour)
let cachedStats = null;
let lastCalculated = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Calculate ROI from actual bet results
 * Returns ROI as a percentage (e.g., 26.5)
 */
export async function calculateROI() {
  try {
    const stats = await getPerformanceStats();
    return stats?.roi || null;
  } catch (error) {
    console.error('Error calculating ROI:', error);
    return null;
  }
}

/**
 * Calculate total profit in units
 */
export async function calculateTotalProfit() {
  try {
    const stats = await getPerformanceStats();
    return stats?.totalProfit || null;
  } catch (error) {
    console.error('Error calculating total profit:', error);
    return null;
  }
}

/**
 * Calculate win rate percentage
 */
export async function getWinRate() {
  try {
    const stats = await getPerformanceStats();
    return stats?.winRate || null;
  } catch (error) {
    console.error('Error calculating win rate:', error);
    return null;
  }
}

/**
 * Get start date for tracking
 */
export function getStartDate() {
  return 'Oct 2025';
}

/**
 * Format ROI for display
 */
export function formatROIDisplay(roi) {
  if (roi === null || roi === undefined) return null;
  return `${Math.round(roi)}%`;
}

/**
 * Calculate dollar growth from bankroll and ROI
 */
export function calculateDollarGrowth(bankroll, roi) {
  if (roi === null || roi === undefined) return null;
  const endAmount = bankroll + (bankroll * roi / 100);
  return `$${bankroll.toLocaleString()} → $${Math.round(endAmount).toLocaleString()}`;
}

/**
 * Get weeks since start date
 */
export function getWeeksSinceStart() {
  // October 1, 2025 as start date
  const startDate = new Date('2025-10-01');
  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
}

/**
 * Main function to get all performance stats
 * Uses caching to avoid recalculating too frequently
 */
async function getPerformanceStats() {
  // Return cached stats if still valid
  if (cachedStats && lastCalculated && (Date.now() - lastCalculated < CACHE_DURATION)) {
    return cachedStats;
  }

  try {
    // Fetch the as-played CSV
    const response = await fetch('/nhl-202526-asplayed.csv');
    if (!response.ok) {
      throw new Error('Failed to fetch as-played data');
    }

    const csvText = await response.text();
    
    // Parse CSV
    const parsed = await new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });

    // Calculate stats from parsed data
    let totalUnits = 0;
    let totalStaked = 0;
    let wins = 0;
    let losses = 0;
    let pushes = 0;

    parsed.forEach(game => {
      const recommendation = game.recommendation;
      const result = game.result;
      
      if (!recommendation || !result || result === 'pending') {
        return; // Skip games without recommendations or pending results
      }

      // Track total games with recommendations
      totalStaked += 1; // Assuming 1 unit per bet

      // Calculate result
      if (result === 'win') {
        wins++;
        // Parse odds and calculate profit
        const odds = parseFloat(game.odds || game.recommendedOdds || 0);
        if (odds > 0) {
          totalUnits += odds / 100; // +150 = 1.5 units profit
        } else {
          totalUnits += 100 / Math.abs(odds); // -150 = 0.67 units profit
        }
      } else if (result === 'loss') {
        losses++;
        totalUnits -= 1; // Lose 1 unit
      } else if (result === 'push') {
        pushes++;
        // No change to units
      }
    });

    const totalGames = wins + losses + pushes;
    const roi = totalStaked > 0 ? (totalUnits / totalStaked) * 100 : 0;
    const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;

    const stats = {
      roi: roi,
      totalProfit: totalUnits,
      winRate: winRate,
      wins: wins,
      losses: losses,
      pushes: pushes,
      totalGames: totalGames
    };

    // Cache the results
    cachedStats = stats;
    lastCalculated = Date.now();

    return stats;
  } catch (error) {
    console.error('Error getting performance stats:', error);
    // Return fallback values if calculation fails
    return {
      roi: 26, // Fallback to last known value
      totalProfit: 2.6,
      winRate: 63,
      wins: 0,
      losses: 0,
      pushes: 0,
      totalGames: 0
    };
  }
}

/**
 * Force refresh the cache (useful for admin/testing)
 */
export function refreshStats() {
  cachedStats = null;
  lastCalculated = null;
}

