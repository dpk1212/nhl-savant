import fs from 'fs';
import Papa from 'papaparse';

/**
 * TotalsSignals - Extract betting signals for Bayesian Over/Under analysis
 * 
 * Each signal pushes probability slightly towards OVER or UNDER from 50/50 baseline.
 * Signals are combined via Bayesian updating to generate final probability.
 */
export class TotalsSignals {
  constructor(dataProcessor, gameHistoryPath) {
    this.dataProcessor = dataProcessor;
    this.gameHistory = this.loadGameHistory(gameHistoryPath);
    
    // NHL Division/Conference mappings for context signals
    this.divisions = {
      'Atlantic': ['BOS', 'BUF', 'DET', 'FLA', 'MTL', 'OTT', 'TBL', 'TOR'],
      'Metropolitan': ['CAR', 'CBJ', 'NJD', 'NYI', 'NYR', 'PHI', 'PIT', 'WSH'],
      'Central': ['ARI', 'CHI', 'COL', 'DAL', 'MIN', 'NSH', 'STL', 'WPG', 'UTA'],
      'Pacific': ['ANA', 'CGY', 'EDM', 'LAK', 'SEA', 'SJS', 'VAN', 'VGK']
    };
    
    // Known rivalries (tend to be lower scoring, defensive)
    this.rivalries = [
      ['BOS', 'MTL'], ['TOR', 'MTL'], ['NYR', 'NYI'], ['PHI', 'PIT'],
      ['EDM', 'CGY'], ['LAK', 'ANA'], ['CHI', 'STL'], ['COL', 'VGK']
    ];
  }
  
  loadGameHistory(gameHistoryPath) {
    try {
      const csvData = fs.readFileSync(gameHistoryPath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      
      // Filter for completed games only
      return parsed.data.filter(game => {
        const score1 = parseInt(game['Score'] || game['Score1'] || 0);
        const score2 = parseInt(game['Score2'] || 0);
        return score1 + score2 > 0; // Has actual result
      });
    } catch (error) {
      console.warn(`Could not load game history: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Get all signals for a game
   */
  getAllSignals(awayTeam, homeTeam, vegasLine, awayGoalie, homeGoalie, gameDate) {
    const signals = [];
    
    // Signal 1: xG Model Differential (most reliable)
    signals.push(this.getXGSignal(awayTeam, homeTeam, vegasLine, awayGoalie, homeGoalie, gameDate));
    
    // Signal 2: Pace Factor (shot pace)
    signals.push(this.getPaceSignal(awayTeam, homeTeam, vegasLine));
    
    // Signal 3: Goalie Quality
    signals.push(this.getGoalieSignal(awayGoalie, homeGoalie, vegasLine));
    
    // Signal 4: Recent Form (last 5 games)
    signals.push(this.getRecentFormSignal(awayTeam, homeTeam, vegasLine, gameDate));
    
    // Signal 5: Matchup History (H2H)
    signals.push(this.getMatchupSignal(awayTeam, homeTeam, vegasLine, gameDate));
    
    // Signal 6: Context (division, rivalry, etc)
    signals.push(this.getContextSignal(awayTeam, homeTeam));
    
    return signals;
  }
  
  /**
   * Signal 1: xG Model Differential
   * Our xG-based model prediction vs Vegas line
   * Weight: 25% (most reliable signal)
   */
  getXGSignal(awayTeam, homeTeam, vegasLine, awayGoalie, homeGoalie, gameDate) {
    try {
      // Get model prediction
      const awayScore = this.dataProcessor.predictTeamScore(awayTeam, homeTeam, false, awayGoalie, gameDate);
      const homeScore = this.dataProcessor.predictTeamScore(homeTeam, awayTeam, true, homeGoalie, gameDate);
      const predicted = awayScore + homeScore;
      
      const diff = predicted - vegasLine;
      
      // Convert difference to probability
      // +0.5 goals = 55%, +1.0 = 60%, +2.0 = 70%
      const probability = 0.50 + (diff * 0.10);
      
      return {
        name: 'xG Model',
        probability: Math.max(0.30, Math.min(0.70, probability)),
        confidence: 0.90, // HIGH confidence in our xG model
        weight: 0.40, // INCREASED weight - this is our best signal
        detail: `Model: ${predicted.toFixed(2)} vs Line: ${vegasLine} (${diff > 0 ? '+' : ''}${diff.toFixed(2)})`
      };
    } catch (error) {
      console.warn(`xG signal failed: ${error.message}`);
      return { name: 'xG Model', probability: 0.50, confidence: 0.50, weight: 0.25, detail: 'Error' };
    }
  }
  
  /**
   * Signal 2: Pace Factor
   * Shot pace from both teams - fast pace = more goals
   * Weight: 20%
   */
  getPaceSignal(awayTeam, homeTeam, vegasLine) {
    try {
      const awayData = this.dataProcessor.getTeamData(awayTeam, 'all');
      const homeData = this.dataProcessor.getTeamData(homeTeam, 'all');
      
      if (!awayData || !homeData) {
        return { name: 'Pace Factor', probability: 0.50, confidence: 0.50, weight: 0.20, detail: 'No data' };
      }
      
      // Calculate combined pace factor
      const awayShotPace = (awayData.shotsOnGoalFor_per60 || 30) + (awayData.shotsOnGoalAgainst_per60 || 30);
      const homeShotPace = (homeData.shotsOnGoalFor_per60 || 30) + (homeData.shotsOnGoalAgainst_per60 || 30);
      const avgPace = (awayShotPace + homeShotPace) / 2;
      
      // League average pace is ~60 shots per 60 mins combined
      const leagueAvgPace = 60;
      const paceFactor = avgPace / leagueAvgPace;
      
      // Fast game: paceFactor > 1.0 → expect more goals → OVER
      // Slow game: paceFactor < 1.0 → expect fewer goals → UNDER
      const expectedImpact = (paceFactor - 1.0) * vegasLine;
      const probability = 0.50 + (expectedImpact * 0.15);
      
      return {
        name: 'Pace Factor',
        probability: Math.max(0.35, Math.min(0.65, probability)),
        confidence: 0.75,
        weight: 0.23, // Balanced to total 100%
        detail: `Pace: ${paceFactor.toFixed(2)}x league avg (${avgPace.toFixed(1)} shots/60)`
      };
    } catch (error) {
      console.warn(`Pace signal failed: ${error.message}`);
      return { name: 'Pace Factor', probability: 0.50, confidence: 0.50, weight: 0.20, detail: 'Error' };
    }
  }
  
  /**
   * Signal 3: Goalie Quality
   * Weak goalies = more goals = OVER
   * Weight: 20%
   */
  getGoalieSignal(awayGoalie, homeGoalie, vegasLine) {
    try {
      if (!this.dataProcessor.goalieProcessor) {
        return { name: 'Goalie Quality', probability: 0.50, confidence: 0.50, weight: 0.20, detail: 'No goalie data' };
      }
      
      const awayGSAE = this.dataProcessor.goalieProcessor.calculateGSAE(awayGoalie, 'all') || 0;
      const homeGSAE = this.dataProcessor.goalieProcessor.calculateGSAE(homeGoalie, 'all') || 0;
      const combinedGSAE = (awayGSAE + homeGSAE) / 2;
      
      // Negative GSAE = weak goalies = more goals = OVER
      // Positive GSAE = elite goalies = fewer goals = UNDER
      const expectedImpact = -(combinedGSAE * 0.05);
      const probability = 0.50 + expectedImpact;
      
      return {
        name: 'Goalie Quality',
        probability: Math.max(0.35, Math.min(0.65, probability)),
        confidence: 0.80,
        weight: 0.27, // Balanced to total 100%
        detail: `Combined GSAE: ${combinedGSAE.toFixed(1)} (${awayGoalie}: ${awayGSAE.toFixed(1)}, ${homeGoalie}: ${homeGSAE.toFixed(1)})`
      };
    } catch (error) {
      console.warn(`Goalie signal failed: ${error.message}`);
      return { name: 'Goalie Quality', probability: 0.50, confidence: 0.50, weight: 0.20, detail: 'Error' };
    }
  }
  
  /**
   * Signal 4: Recent Form
   * Last 5 games average for both teams
   * Weight: 15%
   */
  getRecentFormSignal(awayTeam, homeTeam, vegasLine, gameDate) {
    try {
      const recentGames = this.getRecentGames(awayTeam, homeTeam, gameDate, 5);
      
      if (recentGames.length < 3) {
        return { name: 'Recent Form', probability: 0.50, confidence: 0.40, weight: 0.15, detail: 'Insufficient data' };
      }
      
      const avgTotal = recentGames.reduce((sum, game) => sum + game.total, 0) / recentGames.length;
      const diff = avgTotal - vegasLine;
      
      // Convert to probability (weaker signal than xG)
      const probability = 0.50 + (diff * 0.08);
      
      return {
        name: 'Recent Form',
        probability: Math.max(0.35, Math.min(0.65, probability)),
        confidence: 0.50,
        weight: 0.05, // REDUCED - often has insufficient data
        detail: `Last ${recentGames.length} games avg: ${avgTotal.toFixed(2)} goals`
      };
    } catch (error) {
      console.warn(`Recent form signal failed: ${error.message}`);
      return { name: 'Recent Form', probability: 0.50, confidence: 0.50, weight: 0.15, detail: 'Error' };
    }
  }
  
  /**
   * Signal 5: Matchup History
   * Head-to-head scoring history
   * Weight: 10% (weakest data signal)
   */
  getMatchupSignal(awayTeam, homeTeam, vegasLine, gameDate) {
    try {
      const h2hGames = this.getHeadToHeadGames(awayTeam, homeTeam, gameDate, 3);
      
      if (h2hGames.length === 0) {
        return { name: 'Matchup History', probability: 0.50, confidence: 0.30, weight: 0.10, detail: 'No H2H data' };
      }
      
      const avgTotal = h2hGames.reduce((sum, game) => sum + game.total, 0) / h2hGames.length;
      const diff = avgTotal - vegasLine;
      
      const probability = 0.50 + (diff * 0.06);
      
      return {
        name: 'Matchup History',
        probability: Math.max(0.35, Math.min(0.65, probability)),
        confidence: 0.40,
        weight: 0.03, // REDUCED - often no H2H data
        detail: `Last ${h2hGames.length} meetings avg: ${avgTotal.toFixed(2)} goals`
      };
    } catch (error) {
      console.warn(`Matchup signal failed: ${error.message}`);
      return { name: 'Matchup History', probability: 0.50, confidence: 0.40, weight: 0.10, detail: 'Error' };
    }
  }
  
  /**
   * Signal 6: Context
   * Division games, rivalries tend to be lower scoring
   * Weight: 10%
   */
  getContextSignal(awayTeam, homeTeam) {
    try {
      let adjustment = 0;
      let details = [];
      
      // Check if same division
      const sameDivision = this.isSameDivision(awayTeam, homeTeam);
      if (sameDivision) {
        adjustment -= 0.02;
        details.push('Same division');
      }
      
      // Check if rivalry
      const isRivalry = this.isRivalry(awayTeam, homeTeam);
      if (isRivalry) {
        adjustment -= 0.03;
        details.push('Rivalry');
      }
      
      const probability = 0.50 + adjustment;
      
      return {
        name: 'Context',
        probability: Math.max(0.40, Math.min(0.60, probability)),
        confidence: 0.30,
        weight: 0.02, // REDUCED - weak signal
        detail: details.length > 0 ? details.join(', ') : 'Standard matchup'
      };
    } catch (error) {
      console.warn(`Context signal failed: ${error.message}`);
      return { name: 'Context', probability: 0.50, confidence: 0.30, weight: 0.10, detail: 'Error' };
    }
  }
  
  /**
   * Helper: Get recent games for both teams
   */
  getRecentGames(awayTeam, homeTeam, gameDate, numGames = 5) {
    const games = [];
    const gameDateObj = new Date(gameDate);
    
    for (const game of this.gameHistory) {
      const matchDate = new Date(this.parseGameDate(game));
      
      // Only games before this game
      if (matchDate >= gameDateObj) continue;
      
      const team1 = game['Visitor'] || game['Away Team'] || game['Away'];
      const team2 = game['Home'] || game['Home Team'];
      const score1 = parseInt(game['Score'] || game['Score1'] || 0);
      const score2 = parseInt(game['Score2'] || 0);
      
      if ((team1 === awayTeam || team1 === homeTeam || team2 === awayTeam || team2 === homeTeam) && score1 + score2 > 0) {
        games.push({
          date: matchDate,
          total: score1 + score2
        });
      }
    }
    
    // Sort by date descending, take most recent N
    return games.sort((a, b) => b.date - a.date).slice(0, numGames);
  }
  
  /**
   * Helper: Get head-to-head games
   */
  getHeadToHeadGames(awayTeam, homeTeam, gameDate, numGames = 3) {
    const games = [];
    const gameDateObj = new Date(gameDate);
    
    for (const game of this.gameHistory) {
      const matchDate = new Date(this.parseGameDate(game));
      
      // Only games before this game
      if (matchDate >= gameDateObj) continue;
      
      const team1 = game['Visitor'] || game['Away Team'] || game['Away'];
      const team2 = game['Home'] || game['Home Team'];
      const score1 = parseInt(game['Score'] || game['Score1'] || 0);
      const score2 = parseInt(game['Score2'] || 0);
      
      // Check if this is a H2H matchup
      if (((team1 === awayTeam && team2 === homeTeam) || (team1 === homeTeam && team2 === awayTeam)) && score1 + score2 > 0) {
        games.push({
          date: matchDate,
          total: score1 + score2
        });
      }
    }
    
    // Sort by date descending, take most recent N
    return games.sort((a, b) => b.date - a.date).slice(0, numGames);
  }
  
  /**
   * Helper: Parse game date from CSV
   */
  parseGameDate(game) {
    const dateStr = game['Date'] || game['Game Date'];
    
    // Handle MM/DD/YYYY format
    if (dateStr && dateStr.includes('/')) {
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateStr;
  }
  
  /**
   * Helper: Check if same division
   */
  isSameDivision(team1, team2) {
    for (const division in this.divisions) {
      const teams = this.divisions[division];
      if (teams.includes(team1) && teams.includes(team2)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Helper: Check if rivalry
   */
  isRivalry(team1, team2) {
    for (const [rival1, rival2] of this.rivalries) {
      if ((team1 === rival1 && team2 === rival2) || (team1 === rival2 && team2 === rival1)) {
        return true;
      }
    }
    return false;
  }
}

