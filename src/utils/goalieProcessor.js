import Papa from 'papaparse';

/**
 * GoalieProcessor - Handles all goaltender statistics and metrics
 * Calculates GSAE (Goals Saved Above Expected), save percentages, and quality metrics
 */
export class GoalieProcessor {
  constructor(rawGoalieData) {
    this.rawData = rawGoalieData;
    this.processedData = this.processAllGoalies();
  }

  // Process all goalies from raw CSV data
  processAllGoalies() {
    return this.rawData.map(goalie => this.processGoalieData(goalie));
  }

  // Process individual goalie data
  processGoalieData(goalie) {
    const processed = { ...goalie };
    
    // Ensure numeric values
    const safeGet = (value, defaultValue = 0) => {
      if (value === null || value === undefined || isNaN(value)) return defaultValue;
      return parseFloat(value);
    };

    processed.games_played = safeGet(goalie.games_played);
    processed.icetime = safeGet(goalie.icetime);
    processed.xGoals = safeGet(goalie.xGoals);
    processed.goals = safeGet(goalie.goals);
    processed.ongoal = safeGet(goalie.ongoal);
    processed.highDangerShots = safeGet(goalie.highDangerShots);
    processed.highDangerGoals = safeGet(goalie.highDangerGoals);

    return processed;
  }

  // Get goalie data by name and situation
  getGoalieData(goalieName, situation = '5on5') {
    return this.processedData.find(g => 
      g.name === goalieName && g.situation === situation
    );
  }

  // Get all goalies for a specific team
  getTeamGoalies(teamName, situation = '5on5') {
    return this.processedData.filter(g => 
      g.team === teamName && g.situation === situation
    );
  }

  // Calculate save percentage for a goalie
  calculateSavePercentage(goalie, situation = '5on5') {
    const goalieData = this.getGoalieData(goalie.name, situation);
    if (!goalieData) return 0.915; // League average
    
    const shotsAgainst = parseFloat(goalieData.ongoal) || 0;
    const goalsAgainst = parseFloat(goalieData.goals) || 0;
    
    if (shotsAgainst === 0) return 0.915;
    return (shotsAgainst - goalsAgainst) / shotsAgainst;
  }

  // Calculate Goals Saved Above Expected (GSAE) - CRITICAL METRIC
  // Positive = goalie saving more than expected (good)
  // Negative = goalie allowing more than expected (bad)
  calculateGSAE(goalie, situation = '5on5') {
    const goalieData = typeof goalie === 'string' 
      ? this.getGoalieData(goalie, situation)
      : this.getGoalieData(goalie.name, situation);
      
    if (!goalieData) return 0;
    
    const xGoalsAgainst = parseFloat(goalieData.xGoals) || 0;
    const actualGoals = parseFloat(goalieData.goals) || 0;
    
    return xGoalsAgainst - actualGoals;
  }

  // Calculate High Danger Save % (most predictive metric)
  calculateHighDangerSavePct(goalie, situation = '5on5') {
    const goalieData = typeof goalie === 'string'
      ? this.getGoalieData(goalie, situation)
      : this.getGoalieData(goalie.name, situation);
      
    if (!goalieData) return 0.850; // League average HD sv%
    
    const hdShots = parseFloat(goalieData.highDangerShots) || 0;
    const hdGoals = parseFloat(goalieData.highDangerGoals) || 0;
    
    if (hdShots === 0) return 0.850;
    return (hdShots - hdGoals) / hdShots;
  }

  // Calculate quality start percentage (based on GSAE)
  calculateQualityStartPct(goalie) {
    const gsae = this.calculateGSAE(goalie, 'all');
    return gsae > 0 ? 0.6 : 0.4; // Above/below average
  }

  // Get team-average goalie statistics (weighted by ice time)
  // This is what we'll use NOW (before starting goalie input is available)
  getTeamAverageGoalieStats(teamName, situation = '5on5') {
    const teamGoalies = this.getTeamGoalies(teamName, situation);
    
    if (!teamGoalies || teamGoalies.length === 0) {
      return {
        gsae: 0,
        gsaePerGame: 0,
        hdSavePct: 0.850,
        savePct: 0.915,
        gamesPlayed: 0
      };
    }

    // Weight by ice time (more accurate than games played)
    let totalIceTime = 0;
    let weightedGSAE = 0;
    let weightedHDSv = 0;
    let weightedSavePct = 0;
    let totalGames = 0;

    for (const goalie of teamGoalies) {
      const iceTime = parseFloat(goalie.icetime) || 0;
      const gamesPlayed = parseFloat(goalie.games_played) || 0;
      
      if (iceTime === 0) continue;

      const gsae = this.calculateGSAE(goalie.name, situation);
      const hdSv = this.calculateHighDangerSavePct(goalie.name, situation);
      const savePct = this.calculateSavePercentage(goalie, situation);

      weightedGSAE += gsae * iceTime;
      weightedHDSv += hdSv * iceTime;
      weightedSavePct += savePct * iceTime;
      totalIceTime += iceTime;
      totalGames += gamesPlayed;
    }

    if (totalIceTime === 0) {
      return {
        gsae: 0,
        gsaePerGame: 0,
        hdSavePct: 0.850,
        savePct: 0.915,
        gamesPlayed: 0
      };
    }

    const avgGSAE = weightedGSAE / totalIceTime;
    const avgGames = totalGames / teamGoalies.length;

    return {
      gsae: avgGSAE,
      gsaePerGame: avgGames > 0 ? avgGSAE / avgGames : 0,
      hdSavePct: weightedHDSv / totalIceTime,
      savePct: weightedSavePct / totalIceTime,
      gamesPlayed: avgGames
    };
  }
}

// Load goalie data from CSV
export async function loadGoalieData() {
  try {
    // Try GitHub raw files first (for dynamic updates)
    const githubUrl = 'https://raw.githubusercontent.com/dpk1212/nhl-savant/main/public/goalies.csv';
    const timestamp = Date.now();
    
    const response = await fetch(`${githubUrl}?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`GitHub fetch failed: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('✅ Goalie data loaded from GitHub:', results.data.length, 'entries');
          resolve(results.data);
        },
        error: (error) => {
          console.error('❌ Error parsing goalie CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.warn('⚠️ GitHub fetch failed, trying local fallback...', error);
    
    // Fallback to relative path
    try {
      const response = await fetch(`/goalies.csv?t=${Date.now()}`);
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('✅ Goalie data loaded locally:', results.data.length, 'entries');
            resolve(results.data);
          },
          error: (error) => {
            console.error('❌ Error parsing local goalie CSV:', error);
            reject(error);
          }
        });
      });
    } catch (fallbackError) {
      console.error('❌ Both GitHub and local goalie data fetch failed:', fallbackError);
      throw fallbackError;
    }
  }
}

