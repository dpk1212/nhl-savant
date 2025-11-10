// Metered Paywall System
// Manages free pick allowance for non-premium users

const FREE_PICKS_KEY = 'nhlsavant_free_picks_remaining';
const USED_PICKS_KEY = 'nhlsavant_free_picks_used';
const DEFAULT_FREE_PICKS = 3;

/**
 * Get the number of remaining free picks
 * @returns {number} Number of free picks remaining (0-3)
 */
export function getRemainingFreePicks() {
  try {
    const remaining = localStorage.getItem(FREE_PICKS_KEY);
    if (remaining === null) {
      // First time user, initialize with default
      localStorage.setItem(FREE_PICKS_KEY, DEFAULT_FREE_PICKS.toString());
      return DEFAULT_FREE_PICKS;
    }
    return parseInt(remaining, 10);
  } catch (error) {
    console.error('Error getting free picks:', error);
    return 0;
  }
}

/**
 * Use a free pick for a specific game
 * @param {string} gameId - Unique identifier for the game
 * @returns {boolean} True if pick was successfully used, false if no picks remaining
 */
export function useFreePick(gameId) {
  try {
    const remaining = getRemainingFreePicks();
    
    if (remaining <= 0) {
      return false; // No free picks remaining
    }

    // Check if this game was already unlocked
    if (hasUsedFreePick(gameId)) {
      return true; // Already unlocked, don't decrement again
    }

    // Decrement remaining picks
    const newRemaining = remaining - 1;
    localStorage.setItem(FREE_PICKS_KEY, newRemaining.toString());

    // Add to used picks list
    const usedPicks = getUsedPicks();
    usedPicks.push(gameId);
    localStorage.setItem(USED_PICKS_KEY, JSON.stringify(usedPicks));

    return true;
  } catch (error) {
    console.error('Error using free pick:', error);
    return false;
  }
}

/**
 * Check if a specific game has been unlocked with a free pick
 * @param {string} gameId - Unique identifier for the game
 * @returns {boolean} True if this game was already unlocked
 */
export function hasUsedFreePick(gameId) {
  try {
    const usedPicks = getUsedPicks();
    return usedPicks.includes(gameId);
  } catch (error) {
    console.error('Error checking used pick:', error);
    return false;
  }
}

/**
 * Get list of all used pick IDs
 * @returns {string[]} Array of game IDs that were unlocked
 */
function getUsedPicks() {
  try {
    const used = localStorage.getItem(USED_PICKS_KEY);
    if (!used) {
      return [];
    }
    return JSON.parse(used);
  } catch (error) {
    console.error('Error getting used picks:', error);
    return [];
  }
}

/**
 * Reset free pick count (for testing or admin purposes)
 * WARNING: This will give the user 3 new free picks
 */
export function resetFreePickCount() {
  try {
    localStorage.setItem(FREE_PICKS_KEY, DEFAULT_FREE_PICKS.toString());
    localStorage.setItem(USED_PICKS_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error resetting free picks:', error);
    return false;
  }
}

/**
 * Get user's free pick status
 * @returns {object} Status object with remaining picks and used picks
 */
export function getFreePickStatus() {
  return {
    remaining: getRemainingFreePicks(),
    usedPicks: getUsedPicks(),
    hasFreePicks: getRemainingFreePicks() > 0
  };
}

