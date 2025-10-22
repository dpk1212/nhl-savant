/**
 * GoalieProcessor - Process and calculate advanced goalie metrics
 * Uses goalies.csv data to compute GSAE, HD Save %, danger zone save percentages
 */

export class GoalieProcessor {
  constructor(goalieData) {
    this.goalieData = goalieData; // From goalies.csv
  }
  
  /**
   * Get advanced stats for a specific goalie
   * @param {string} goalieName - Full name of the goalie
   * @param {string} teamCode - Team abbreviation (e.g., 'NYR', 'TOR')
   * @returns {object|null} Goalie stats or null if not found
   */
  getGoalieStats(goalieName, teamCode) {
    if (!this.goalieData || !Array.isArray(this.goalieData)) {
      return null;
    }
    
    // Find goalie in goalies.csv by name and team
    // Filter for 'all' situation to get season totals
    let goalieRows = this.goalieData.filter(g => 
      g.name === goalieName && 
      g.team === teamCode && 
      g.situation === 'all'
    );
    
    // If no exact match, try matching by last name only (for MoneyPuck data)
    if (!goalieRows.length) {
      const lastNameLower = goalieName.toLowerCase().trim();
      goalieRows = this.goalieData.filter(g => {
        if (g.team !== teamCode || g.situation !== 'all') return false;
        
        const fullName = g.name.toLowerCase();
        const nameParts = fullName.split(' ');
        const lastName = nameParts[nameParts.length - 1];
        
        // Match if last name matches or full name contains the provided name
        return lastName === lastNameLower || fullName.includes(lastNameLower);
      });
    }
    
    if (!goalieRows.length) {
      console.log(`ℹ️ Goalie stats not in database: ${goalieName} (${teamCode})`);
      return null;
    }
    
    const goalie = goalieRows[0];
    const gamesPlayed = parseInt(goalie.games_played) || 0;
    
    if (gamesPlayed === 0) {
      console.warn(`No games played for: ${goalieName}`);
      return null;
    }
    
    const icetime = parseFloat(goalie.icetime) || 0;
    const xGoals = parseFloat(goalie.xGoals) || 0;
    const goalsAllowed = parseFloat(goalie.goals) || 0;
    const onGoal = parseFloat(goalie.ongoal) || 0;
    
    // Calculate key metrics
    const gsae = xGoals - goalsAllowed; // Goals Saved Above Expected
    const savePct = onGoal > 0 ? (1 - (goalsAllowed / onGoal)) : 0.900;
    
    // High Danger Save %
    const hdShots = parseFloat(goalie.highDangerShots) || 0;
    const hdGoals = parseFloat(goalie.highDangerGoals) || 0;
    const hdSavePct = hdShots > 0 ? (1 - (hdGoals / hdShots)) : 0.850;
    
    return {
      name: goalieName,
      team: teamCode,
      gamesPlayed,
      gsae: gsae.toFixed(2),
      savePct: (savePct * 100).toFixed(1),
      hdSavePct: (hdSavePct * 100).toFixed(1),
      xGoalsAgainst: (xGoals / gamesPlayed).toFixed(2),
      goalsAgainst: (goalsAllowed / gamesPlayed).toFixed(2),
      lowDangerSavePct: this.calculateLowDangerSavePct(goalie),
      mediumDangerSavePct: this.calculateMediumDangerSavePct(goalie),
      reboundControl: this.calculateReboundControl(goalie),
      recentForm: this.calculateRecentForm(gsae, gamesPlayed)
    };
  }
  
  /**
   * Calculate low danger save percentage
   */
  calculateLowDangerSavePct(goalie) {
    const ldShots = parseFloat(goalie.lowDangerShots) || 0;
    const ldGoals = parseFloat(goalie.lowDangerGoals) || 0;
    return ldShots > 0 ? ((1 - (ldGoals / ldShots)) * 100).toFixed(1) : '97.0';
  }
  
  /**
   * Calculate medium danger save percentage
   */
  calculateMediumDangerSavePct(goalie) {
    const mdShots = parseFloat(goalie.mediumDangerShots) || 0;
    const mdGoals = parseFloat(goalie.mediumDangerGoals) || 0;
    return mdShots > 0 ? ((1 - (mdGoals / mdShots)) * 100).toFixed(1) : '92.0';
  }
  
  /**
   * Calculate rebound control quality
   */
  calculateReboundControl(goalie) {
    const xRebounds = parseFloat(goalie.xRebounds) || 0;
    const rebounds = parseFloat(goalie.rebounds) || 0;
    
    if (xRebounds === 0) return 'Average';
    
    const reboundRatio = rebounds / xRebounds;
    
    if (reboundRatio < 0.9) return 'Excellent';
    if (reboundRatio > 1.15) return 'Poor';
    return 'Average';
  }
  
  /**
   * Calculate recent form based on GSAE and games played
   */
  calculateRecentForm(gsae, gamesPlayed) {
    if (gamesPlayed < 5) return 'Limited Sample';
    
    if (gsae > 5) return 'Hot';
    if (gsae < -3) return 'Cold';
    return 'Average';
  }
  
  /**
   * Get league rank estimate based on GSAE
   */
  getLeagueRank(gsae) {
    const gsaeFloat = parseFloat(gsae);
    
    if (gsaeFloat > 10) return { rank: 5, tier: 'ELITE' };
    if (gsaeFloat > 5) return { rank: 12, tier: 'STRONG' };
    if (gsaeFloat > -5) return { rank: 18, tier: 'AVERAGE' };
    return { rank: 28, tier: 'WEAK' };
  }
  
  /**
   * Get goalie stats from starting_goalies.json enriched data
   * This is used when MoneyPuck stats are already embedded
   */
  getGoalieFromStartingData(teamCode, startingGoaliesData) {
    if (!startingGoaliesData || !startingGoaliesData.games) {
      return null;
    }
    
    const game = startingGoaliesData.games.find(g =>
      g.away?.team === teamCode || g.home?.team === teamCode
    );
    
    if (!game) return null;
    
    const isAway = game.away?.team === teamCode;
    const goalieData = isAway ? game.away : game.home;
    
    if (!goalieData || !goalieData.goalie) return null;
    
    // If we have stats from MoneyPuck enrichment, use those
    if (goalieData.stats) {
      return goalieData.stats;
    }
    
    // Otherwise, fetch from goalies.csv
    return this.getGoalieStats(goalieData.goalie, teamCode);
  }
}
