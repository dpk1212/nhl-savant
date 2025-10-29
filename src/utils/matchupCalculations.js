/**
 * Matchup Calculations - Pure utility functions for matchup analysis
 * NO DEPENDENCIES - Standalone calculation functions
 * DO NOT import scheduleHelper or modify dataProcessor
 */

/**
 * Get team stats for a specific situation
 * @param {Object} dataProcessor - DataProcessor instance
 * @param {string} teamCode - 3-letter team code
 * @param {string} situation - 'all', '5on5', '5on4', '4on5'
 * @returns {Object} Team statistics
 */
export function getTeamStats(dataProcessor, teamCode, situation = 'all') {
  if (!dataProcessor || !teamCode) return null;
  
  try {
    const teams = dataProcessor.getTeamsBySituation(situation);
    if (!teams) return null;
    
    const team = teams.find(t => t.name === teamCode);
    return team || null;
  } catch (error) {
    console.error('Error getting team stats:', error);
    return null;
  }
}

/**
 * Calculate percentile rank for a team's stat
 * @param {Object} dataProcessor - DataProcessor instance
 * @param {string} teamCode - 3-letter team code
 * @param {string} statName - Name of the stat (e.g., 'xGoalsFor', 'highDangerShotsFor')
 * @param {string} situation - 'all', '5on5', '5on4', '4on5'
 * @param {boolean} higherIsBetter - True if higher values are better
 * @returns {Object} { percentile, rank, totalTeams, value, tier }
 */
export function calculatePercentileRank(dataProcessor, teamCode, statName, situation = '5on5', higherIsBetter = true) {
  if (!dataProcessor || !teamCode || !statName) return null;
  
  try {
    const teams = dataProcessor.getTeamsBySituation(situation);
    if (!teams || teams.length === 0) return null;
    
    const team = teams.find(t => t.name === teamCode);
    if (!team || team[statName] === undefined) return null;
    
    const teamValue = team[statName];
    
    // Get all values for this stat
    const allValues = teams
      .map(t => t[statName])
      .filter(v => v !== undefined && v !== null && !isNaN(v))
      .sort((a, b) => higherIsBetter ? b - a : a - b); // Sort desc if higher is better
    
    if (allValues.length === 0) return null;
    
    // Find rank (1-indexed)
    const rank = allValues.findIndex(v => v === teamValue) + 1;
    
    // Calculate percentile (0-100)
    const percentile = higherIsBetter
      ? Math.round(((allValues.length - rank + 1) / allValues.length) * 100)
      : Math.round((rank / allValues.length) * 100);
    
    // Determine tier
    let tier = 'AVERAGE';
    if (percentile >= 90) tier = 'ELITE';
    else if (percentile >= 75) tier = 'STRONG';
    else if (percentile >= 60) tier = 'ABOVE AVG';
    else if (percentile >= 40) tier = 'AVERAGE';
    else if (percentile >= 25) tier = 'BELOW AVG';
    else tier = 'WEAK';
    
    return {
      percentile,
      rank,
      totalTeams: teams.length,
      value: teamValue,
      tier
    };
  } catch (error) {
    console.error('Error calculating percentile rank:', error);
    return null;
  }
}

/**
 * Get goalie stats for a specific situation
 * @param {Array} goalies - goalieData array
 * @param {string} goalieName - Goalie name
 * @param {string} situation - 'all', '5on5', '5on4', '4on5'
 * @returns {Object} Goalie statistics
 */
export function getGoalieStats(goalies, goalieName, situation = 'all') {
  if (!goalies || !goalieName) return null;
  
  const goalie = goalies.find(g => g.name === goalieName);
  if (!goalie) return null;

  return goalie[situation] || goalie;
}

/**
 * Calculate xGoals edge between two teams
 * @param {Object} offense - Offensive team stats
 * @param {Object} defense - Defensive team stats
 * @returns {number} xGoals edge (positive = offense advantage)
 */
export function calculateXGoalsEdge(offense, defense) {
  if (!offense || !defense) return 0;
  
  const offenseXGF = offense.xGoalsFor || 0;
  const defenseXGA = defense.xGoalsAgainst || 0;
  
  // Positive = offensive advantage, negative = defensive advantage
  return offenseXGF - defenseXGA;
}

/**
 * Calculate goalie edge
 * @param {Object} goalie1 - First goalie stats
 * @param {Object} goalie2 - Second goalie stats
 * @returns {number} GSAX difference (positive = goalie1 better)
 */
export function calculateGoalieEdge(goalie1, goalie2) {
  if (!goalie1 || !goalie2) return 0;
  
  const gsax1 = goalie1.gsax || 0;
  const gsax2 = goalie2.gsax || 0;
  
  return gsax1 - gsax2;
}

/**
 * Calculate shot quality edge
 * @param {Object} offense - Offensive team stats
 * @param {Object} defense - Defensive team stats
 * @returns {number} Shot quality edge (positive = offense generates more dangerous shots)
 */
export function calculateShotQualityEdge(offense, defense) {
  if (!offense || !defense) return 0;
  
  const offenseHighDanger = (offense.highDangerShots || 0) / (offense.totalShots || 1);
  const defenseHighDanger = (defense.highDangerShotsAgainst || 0) / (defense.totalShotsAgainst || 1);
  
  // Higher is better for offense
  return (offenseHighDanger - defenseHighDanger) * 100;
}

/**
 * Calculate special teams edge
 * @param {Object} pp1 - Team 1 power play stats
 * @param {Object} pk1 - Team 1 penalty kill stats
 * @param {Object} pp2 - Team 2 power play stats
 * @param {Object} pk2 - Team 2 penalty kill stats
 * @returns {number} Special teams edge (positive = team 1 advantage)
 */
export function calculateSpecialTeamsEdge(pp1, pk1, pp2, pk2) {
  if (!pp1 || !pk1 || !pp2 || !pk2) return 0;
  
  // Team 1 PP vs Team 2 PK
  const team1PPAdvantage = (pp1.goalsFor || 0) - (pk2.goalsAgainst || 0);
  
  // Team 2 PP vs Team 1 PK
  const team2PPAdvantage = (pp2.goalsFor || 0) - (pk1.goalsAgainst || 0);
  
  return team1PPAdvantage - team2PPAdvantage;
}

/**
 * Calculate overall matchup advantage
 * @param {number} xGoalsEdge - xGoals edge (positive = away advantage)
 * @param {number} goalieEdge - Goalie edge (positive = away advantage)
 * @param {number} shotQualityEdge - Shot quality edge
 * @param {number} specialTeamsEdge - Special teams edge
 * @returns {Object} { awayAdvantage: number, homeAdvantage: number, favorite: string }
 */
export function calculateOverallAdvantage(xGoalsEdge, goalieEdge, shotQualityEdge, specialTeamsEdge) {
  // Weighted scoring system
  const xGoalsWeight = 0.4;
  const goalieWeight = 0.3;
  const shotQualityWeight = 0.2;
  const specialTeamsWeight = 0.1;
  
  // Normalize each component to -1 to 1 scale
  const normalizedXG = Math.max(-1, Math.min(1, xGoalsEdge / 2));
  const normalizedGoalie = Math.max(-1, Math.min(1, goalieEdge / 5));
  const normalizedShots = Math.max(-1, Math.min(1, shotQualityEdge / 10));
  const normalizedST = Math.max(-1, Math.min(1, specialTeamsEdge / 3));
  
  // Calculate weighted score (-1 to 1, positive = away advantage)
  const weightedScore = 
    (normalizedXG * xGoalsWeight) +
    (normalizedGoalie * goalieWeight) +
    (normalizedShots * shotQualityWeight) +
    (normalizedST * specialTeamsWeight);
  
  // Convert to win probabilities (use logistic function for realistic scaling)
  // This prevents unrealistic 90-10 splits
  const awayWinProb = 50 + (weightedScore * 35); // Max swing is 35% from even
  const homeWinProb = 100 - awayWinProb;
  
  return {
    awayAdvantage: Math.round(Math.max(15, Math.min(85, awayWinProb))), // Cap at 15-85%
    homeAdvantage: Math.round(Math.max(15, Math.min(85, homeWinProb))),
    favorite: awayWinProb > 50 ? 'away' : 'home',
    confidence: Math.abs(awayWinProb - 50) > 10 ? 'high' : Math.abs(awayWinProb - 50) > 5 ? 'medium' : 'low'
  };
}

/**
 * Get recent form from as-played data
 * @param {Array} asPlayedData - Game results array
 * @param {string} teamCode - Team code
 * @param {number} numGames - Number of recent games to analyze
 * @returns {Array} Recent game results [{date, result, score}]
 */
export function getRecentForm(asPlayedData, teamCode, numGames = 10) {
  if (!asPlayedData || !teamCode) return null;
  
  try {
    // Filter games where team played
    const teamGames = asPlayedData.filter(game => 
      game.Visitor === teamCode || game.Home === teamCode
    );
    
    // Sort by date descending
    const sortedGames = teamGames.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return dateB - dateA;
    });
    
    // Get last N games
    const recentGames = sortedGames.slice(0, numGames);
    
    // Format results
    return recentGames.map(game => {
      const isHome = game.Home === teamCode;
      const teamScore = isHome ? parseInt(game['Score_2']) : parseInt(game['Score_1']);
      const oppScore = isHome ? parseInt(game['Score_1']) : parseInt(game['Score_2']);
      const opponent = isHome ? game.Visitor : game.Home;
      
      return {
        date: game.Date,
        opponent,
        result: teamScore > oppScore ? 'W' : teamScore < oppScore ? 'L' : 'T',
        score: `${teamScore}-${oppScore}`,
        isHome
      };
    });
  } catch (error) {
    console.error('Error getting recent form:', error);
    return null;
  }
}
