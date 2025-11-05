/**
 * Calculate aggregate statistics from bookmarked picks
 * Matches bookmarks with completed bets to determine outcomes and profit
 * 
 * @param {Array} bookmarks - User's bookmarked picks
 * @param {Array} completedBets - All completed bets from Firebase
 * @returns {Object} Statistics object with wins, losses, profit, etc.
 */
export function calculateBookmarkStats(bookmarks, completedBets) {
  if (!bookmarks || bookmarks.length === 0) {
    return {
      totalBookmarked: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      pending: 0,
      totalProfit: 0,
      roi: 0,
      winRate: 0,
      completedCount: 0
    };
  }
  
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  let totalProfit = 0;
  let completedCount = 0;
  
  // Match each bookmark with its corresponding completed bet
  bookmarks.forEach(bookmark => {
    const matchedBet = completedBets.find(bet => bet.id === bookmark.betId);
    
    if (matchedBet && matchedBet.status === 'COMPLETED' && matchedBet.result) {
      completedCount++;
      
      const outcome = matchedBet.result.outcome;
      const profit = matchedBet.result.profit || 0;
      
      if (outcome === 'WIN') {
        wins++;
      } else if (outcome === 'LOSS') {
        losses++;
      } else if (outcome === 'PUSH') {
        pushes++;
      }
      
      totalProfit += profit;
    }
  });
  
  const pending = bookmarks.length - completedCount;
  const decidedBets = wins + losses; // Excludes pushes
  const winRate = decidedBets > 0 ? (wins / decidedBets) * 100 : 0;
  const roi = completedCount > 0 ? (totalProfit / completedCount) * 100 : 0;
  
  return {
    totalBookmarked: bookmarks.length,
    wins,
    losses,
    pushes,
    pending,
    totalProfit,
    roi,
    winRate,
    completedCount
  };
}

/**
 * Group bookmarks by status (Upcoming, Live, Completed)
 * @param {Array} bookmarks - User's bookmarks
 * @param {Array} completedBets - All completed bets
 * @param {Array} liveScores - Live game scores
 * @returns {Object} Grouped bookmarks
 */
export function groupBookmarksByStatus(bookmarks, completedBets, liveScores = []) {
  const upcoming = [];
  const live = [];
  const completed = [];
  
  bookmarks.forEach(bookmark => {
    // Check if completed
    const matchedBet = completedBets.find(bet => bet.id === bookmark.betId);
    if (matchedBet && matchedBet.status === 'COMPLETED') {
      completed.push({
        ...bookmark,
        result: matchedBet.result
      });
      return;
    }
    
    // Check if live
    const liveScore = liveScores.find(score => 
      (score.awayTeam === bookmark.game.awayTeam && score.homeTeam === bookmark.game.homeTeam) ||
      (score.away === bookmark.game.awayTeam && score.home === bookmark.game.homeTeam)
    );
    
    if (liveScore && (liveScore.status === 'LIVE' || liveScore.status === 'In Progress')) {
      live.push({
        ...bookmark,
        liveScore
      });
      return;
    }
    
    // Otherwise it's upcoming
    upcoming.push(bookmark);
  });
  
  return {
    upcoming,
    live,
    completed
  };
}

/**
 * Format profit for display
 * @param {number} profit - Profit value
 * @returns {string} Formatted profit string
 */
export function formatProfit(profit) {
  if (profit === 0) return '0.00u';
  const sign = profit > 0 ? '+' : '';
  return `${sign}${profit.toFixed(2)}u`;
}

/**
 * Format percentage for display
 * @param {number} percentage - Percentage value
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(percentage) {
  if (percentage === 0) return '0%';
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
}

