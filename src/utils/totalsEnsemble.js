import Papa from 'papaparse';
import { readFileSync } from 'fs';

// Ensemble model for game totals prediction
// Combines xG-based, goals-based, and recency-based models
// Purpose: Improve RMSE without affecting win prediction accuracy
export class TotalsEnsemble {
  constructor(dataProcessor, gameHistoryPath = null) {
    this.dataProcessor = dataProcessor;
    this.gameHistory = null;
    
    // Load game history for recency model
    if (gameHistoryPath) {
      try {
        const csvData = readFileSync(gameHistoryPath, 'utf-8');
        const parsed = Papa.parse(csvData, { header: false, skipEmptyLines: true });
        this.gameHistory = parsed.data.slice(1); // Skip header
      } catch (error) {
        console.warn('⚠️  Could not load game history for recency model:', error.message);
      }
    }
  }

  // Main ensemble prediction function
  // Combines three models with weights: xG (40%), goals (30%), recency (30%)
  predictGameTotal(awayTeam, homeTeam, awayGoalie = null, homeGoalie = null, gameDate = null) {
    // Model 1: xG-based (current model - 40% weight)
    const xgPrediction = this.predictXGBased(awayTeam, homeTeam, awayGoalie, homeGoalie, gameDate);
    
    // Model 2: Goals-based (30% weight)
    const goalsPrediction = this.predictGoalsBased(awayTeam, homeTeam);
    
    // Model 3: Recency-based (30% weight)
    const recencyPrediction = this.predictRecencyBased(awayTeam, homeTeam, gameDate);
    
    // Ensemble combination
    const ensembleTotal = (xgPrediction * 0.40) + (goalsPrediction * 0.30) + (recencyPrediction * 0.30);
    
    // Calibration constant (tuned to eliminate bias)
    // Test showed -0.291 goal bias with 1.0, so increase by ~5% to fix
    const ENSEMBLE_CALIBRATION = 1.05;
    
    return ensembleTotal * ENSEMBLE_CALIBRATION;
  }

  // Model 1: xG-Based (uses existing predictTeamScore)
  predictXGBased(awayTeam, homeTeam, awayGoalie, homeGoalie, gameDate) {
    const awayScore = this.dataProcessor.predictTeamScore(
      awayTeam, 
      homeTeam, 
      false,  // isHome = false
      awayGoalie,
      gameDate
    );
    
    const homeScore = this.dataProcessor.predictTeamScore(
      homeTeam, 
      awayTeam, 
      true,   // isHome = true
      homeGoalie,
      gameDate
    );
    
    return awayScore + homeScore;
  }

  // Model 2: Goals-Based (uses actual goals instead of xG)
  predictGoalsBased(awayTeam, homeTeam) {
    const away5v5 = this.dataProcessor.getTeamData(awayTeam, '5on5');
    const home5v5 = this.dataProcessor.getTeamData(homeTeam, '5on5');
    
    if (!away5v5 || !home5v5) {
      // Fallback to xG if data unavailable
      return this.predictXGBased(awayTeam, homeTeam, null, null, null);
    }
    
    // Calculate goals per game
    const awayGPG = away5v5.goalsFor / away5v5.gamesPlayed;
    const homeGPG = home5v5.goalsFor / home5v5.gamesPlayed;
    
    // Calculate goals allowed per game
    const awayGAPG = away5v5.goalsAgainst / away5v5.gamesPlayed;
    const homeGAPG = home5v5.goalsAgainst / home5v5.gamesPlayed;
    
    // Apply regression to league average (same as xG model)
    const leagueAvgGPG = 3.0; // ~3.0 goals per team per game in NHL
    const awayWeight = away5v5.gamesPlayed / (away5v5.gamesPlayed + 20);
    const homeWeight = home5v5.gamesPlayed / (home5v5.gamesPlayed + 20);
    
    const awayOffRegressed = (awayGPG * awayWeight) + (leagueAvgGPG * (1 - awayWeight));
    const homeOffRegressed = (homeGPG * homeWeight) + (leagueAvgGPG * (1 - homeWeight));
    const awayDefRegressed = (awayGAPG * awayWeight) + (leagueAvgGPG * (1 - awayWeight));
    const homeDefRegressed = (homeGAPG * homeWeight) + (leagueAvgGPG * (1 - homeWeight));
    
    // 40/60 weighting (same as xG model - defense is more predictive)
    const awayPredicted = (awayOffRegressed * 0.40) + (homeDefRegressed * 0.60);
    const homePredicted = (homeOffRegressed * 0.40) + (awayDefRegressed * 0.60);
    
    // Home ice advantage (+10% for home team = ~0.3 goals)
    const homeAdjusted = homePredicted * 1.10;
    
    return awayPredicted + homeAdjusted;
  }

  // Model 3: Recency-Based (last 5 games weighted average)
  predictRecencyBased(awayTeam, homeTeam, gameDate) {
    if (!this.gameHistory || this.gameHistory.length === 0) {
      // Fallback to goals-based if no history
      return this.predictGoalsBased(awayTeam, homeTeam);
    }
    
    const awayLast5 = this.getRecentTotals(awayTeam, gameDate, 5);
    const homeLast5 = this.getRecentTotals(homeTeam, gameDate, 5);
    
    // If not enough recent games, fallback
    if (awayLast5.length < 3 || homeLast5.length < 3) {
      return this.predictGoalsBased(awayTeam, homeTeam);
    }
    
    // Weighted average (most recent gets highest weight)
    const weights = [0.30, 0.25, 0.20, 0.15, 0.10];
    
    const awayRecent = awayLast5.reduce((sum, goals, i) => {
      const weight = weights[i] || weights[weights.length - 1];
      return sum + (goals * weight);
    }, 0);
    
    const homeRecent = homeLast5.reduce((sum, goals, i) => {
      const weight = weights[i] || weights[weights.length - 1];
      return sum + (goals * weight);
    }, 0);
    
    // Add home ice advantage (+0.3 goals)
    return awayRecent + homeRecent + 0.3;
  }

  // Helper: Get recent game totals for a team
  getRecentTotals(team, beforeDate, numGames = 5) {
    if (!this.gameHistory) return [];
    
    const teamGames = [];
    const cutoffDate = beforeDate ? new Date(beforeDate) : new Date();
    
    // Parse game history
    // CSV format: Date,StartTime(Sask),StartTime(ET),Visitor,VisitorScore,Home,HomeScore,Status,VisitorGoalie,HomeGoalie
    for (const row of this.gameHistory) {
      if (row.length < 10) continue;
      
      const gameDate = new Date(row[0]);
      const awayTeam = row[3];  // Visitor
      const homeTeam = row[5];  // Home
      const awayScore = parseInt(row[4]);  // Visitor score
      const homeScore = parseInt(row[6]);  // Home score
      
      // Skip if after cutoff date
      if (gameDate >= cutoffDate) continue;
      
      // Skip if invalid scores
      if (isNaN(awayScore) || isNaN(homeScore)) continue;
      
      // Map full names to codes
      const teamMap = {
        'Chicago Blackhawks': 'CHI', 'Florida Panthers': 'FLA', 'Pittsburgh Penguins': 'PIT',
        'New York Rangers': 'NYR', 'Colorado Avalanche': 'COL', 'Los Angeles Kings': 'LAK',
        'Montreal Canadiens': 'MTL', 'Toronto Maple Leafs': 'TOR', 'Boston Bruins': 'BOS',
        'Washington Capitals': 'WSH', 'Detroit Red Wings': 'DET', 'Ottawa Senators': 'OTT',
        'Tampa Bay Lightning': 'TBL', 'Philadelphia Flyers': 'PHI', 'New York Islanders': 'NYI',
        'New Jersey Devils': 'NJD', 'Carolina Hurricanes': 'CAR', 'Columbus Blue Jackets': 'CBJ',
        'Nashville Predators': 'NSH', 'Dallas Stars': 'DAL', 'Winnipeg Jets': 'WPG',
        'Utah Hockey Club': 'UTA', 'Calgary Flames': 'CGY', 'Vancouver Canucks': 'VAN',
        'Anaheim Ducks': 'ANA', 'Seattle Kraken': 'SEA', 'St. Louis Blues': 'STL',
        'Buffalo Sabres': 'BUF', 'Minnesota Wild': 'MIN', 'Edmonton Oilers': 'EDM',
        'Vegas Golden Knights': 'VGK', 'San Jose Sharks': 'SJS', 'Arizona Coyotes': 'ARI'
      };
      
      const awayCode = teamMap[awayTeam];
      const homeCode = teamMap[homeTeam];
      
      // Check if team was playing
      if (awayCode === team || homeCode === team) {
        const goalsScored = awayCode === team ? awayScore : homeScore;
        teamGames.push({ date: gameDate, goals: goalsScored });
      }
    }
    
    // Sort by date descending (most recent first)
    teamGames.sort((a, b) => b.date - a.date);
    
    // Return last N games' goal totals
    return teamGames.slice(0, numGames).map(g => g.goals);
  }

  // Get detailed breakdown of predictions (for debugging/analysis)
  getPredictionBreakdown(awayTeam, homeTeam, awayGoalie, homeGoalie, gameDate) {
    const xgPrediction = this.predictXGBased(awayTeam, homeTeam, awayGoalie, homeGoalie, gameDate);
    const goalsPrediction = this.predictGoalsBased(awayTeam, homeTeam);
    const recencyPrediction = this.predictRecencyBased(awayTeam, homeTeam, gameDate);
    const ensemble = this.predictGameTotal(awayTeam, homeTeam, awayGoalie, homeGoalie, gameDate);
    
    return {
      xgBased: xgPrediction.toFixed(2),
      goalsBased: goalsPrediction.toFixed(2),
      recencyBased: recencyPrediction.toFixed(2),
      ensemble: ensemble.toFixed(2),
      weights: { xg: 0.40, goals: 0.30, recency: 0.30 }
    };
  }
}

