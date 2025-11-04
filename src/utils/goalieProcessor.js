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
    console.log(`🥅 getGoalieStats called: ${goalieName} (${teamCode})`);
    if (!this.goalieData || !Array.isArray(this.goalieData)) {
      console.log(`❌ No goalie data available`);
      return null;
    }
    
    // Debug: Show how many rows exist for this team
    const teamRows = this.goalieData.filter(g => g.team === teamCode);
    console.log(`   📊 Found ${teamRows.length} rows for team ${teamCode}`);
    if (teamRows.length > 0) {
      console.log(`   📊 Sample names: ${teamRows.slice(0, 3).map(g => g.name).join(', ')}`);
    }
    
    // Find goalie in goalies.csv by name and team
    // Filter for 'all' situation to get season totals
    let goalieRows = this.goalieData.filter(g => 
      g.name === goalieName && 
      g.team === teamCode && 
      g.situation === 'all'
    );
    
    // If no exact match, try matching by last name only (for MoneyPuck data)
    // CRITICAL FIX: MoneyPuck changed to last names only (Nov 2025)
    if (!goalieRows.length) {
      console.log(`   ⚠️ No exact match, trying last name match for: ${goalieName}`);
      const searchNameLower = goalieName.toLowerCase().trim();
      
      goalieRows = this.goalieData.filter(g => {
        if (g.team !== teamCode || g.situation !== 'all') return false;
        
        const fullNameLower = g.name.toLowerCase().trim();
        const nameParts = fullNameLower.split(' ');
        const lastNameOnly = nameParts[nameParts.length - 1];
        
        // Match if:
        // 1. Last name matches exactly (Shesterkin = Shesterkin)
        // 2. Full name contains the search name (Igor Shesterkin contains Shesterkin)
        // 3. Search name contains the last name (for partial matches)
        const matches = 
          lastNameOnly === searchNameLower ||
          fullNameLower.includes(searchNameLower) ||
          searchNameLower.includes(lastNameOnly);
        
        if (matches) {
          console.log(`   ✓ Last name match found: ${g.name} (${g.team}) matched with "${goalieName}"`);
        }
        return matches;
      });
      
      // If multiple matches, take the first one (most common case)
      if (goalieRows.length > 1) {
        console.log(`   ℹ️ Multiple matches found, using: ${goalieRows[0].name}`);
        goalieRows = [goalieRows[0]];
      }
    }
    
    if (!goalieRows.length) {
      console.log(`❌ Goalie stats not in database: ${goalieName} (${teamCode})`);
      return null;
    }
    
    console.log(`✅ Found goalie: ${goalieRows[0].name} (${goalieRows[0].team})`);
    
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
   * Calculate GSAE (Goals Saved Above Expected) for a specific goalie
   * This is the PRIMARY metric used in prediction adjustments
   * @param {string} goalieName - Goalie name (can be last name only)
   * @param {string} situation - Game situation (default: '5on5')
   * @returns {number} GSAE value (positive = better than expected, negative = worse)
   */
  calculateGSAE(goalieName, situation = '5on5') {
    if (!this.goalieData || !Array.isArray(this.goalieData)) {
      console.log(`⚠️ calculateGSAE: No goalie data available`);
      return 0;
    }
    
    // Filter for specific situation
    const goalieRows = this.goalieData.filter(g => g.situation === situation);
    
    // Try exact name match first
    let goalie = goalieRows.find(g => g.name === goalieName);
    
    // If no exact match, try last name match (for MoneyPuck data)
    if (!goalie) {
      const lastNameLower = goalieName.toLowerCase().trim();
      goalie = goalieRows.find(g => {
        const fullName = g.name.toLowerCase();
        const nameParts = fullName.split(' ');
        const lastName = nameParts[nameParts.length - 1];
        return lastName === lastNameLower || fullName.includes(lastNameLower);
      });
    }
    
    if (!goalie) {
      console.log(`⚠️ calculateGSAE: Goalie not found: ${goalieName} (${situation})`);
      return 0;
    }
    
    // Calculate GSAE: xGoals - actual goals allowed
    const xGoals = parseFloat(goalie.xGoals) || 0;
    const goalsAllowed = parseFloat(goalie.goals) || 0;
    const gsae = xGoals - goalsAllowed;
    
    console.log(`✅ calculateGSAE: ${goalie.name} → GSAE ${gsae.toFixed(2)} (xG: ${xGoals.toFixed(2)}, GA: ${goalsAllowed.toFixed(2)})`);
    
    return gsae;
  }
  
  /**
   * Get team's goalies for averaging (used when starter not confirmed)
   * @param {string} teamCode - Team abbreviation
   * @param {string} situation - Game situation
   * @returns {Array} Array of goalie objects for the team
   */
  getTeamGoalies(teamCode, situation = '5on5') {
    if (!this.goalieData || !Array.isArray(this.goalieData)) {
      return [];
    }
    
    return this.goalieData.filter(g => 
      g.team === teamCode && 
      g.situation === situation &&
      parseInt(g.games_played) > 0
    );
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
