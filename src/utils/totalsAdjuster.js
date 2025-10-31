/**
 * TotalsAdjuster - Totals-specific adjustment layer
 * 
 * CRITICAL: This class ONLY adjusts totals predictions.
 * It does NOT touch individual team scores or win probabilities.
 * Your elite 64.7% ML win rate is protected.
 */

import { readFileSync } from 'fs';
import Papa from 'papaparse';

export class TotalsAdjuster {
  constructor(dataProcessor, gameHistoryPath = null) {
    this.dataProcessor = dataProcessor;
    this.gameHistory = gameHistoryPath ? this.loadGameHistory(gameHistoryPath) : [];
    
    // Configuration for each phase (can be toggled for testing)
    this.config = {
      useAmplification: true,
      usePaceFactor: true,
      useGoalieEnhancement: true,
      useMatchupHistory: true,
      useContextAdjustment: true
    };
  }
  
  loadGameHistory(path) {
    try {
      const csv = readFileSync(path, 'utf-8');
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      return parsed.data;
    } catch (error) {
      console.warn('⚠️  Could not load game history for matchup factors');
      return [];
    }
  }
  
  /**
   * Main adjustment method
   * Takes base total prediction and applies totals-specific adjustments
   * 
   * @param {number} baseTotal - Sum of predictTeamScore() for both teams
   * @param {string} awayTeam - Away team code (e.g., 'TOR')
   * @param {string} homeTeam - Home team code
   * @param {string} awayGoalie - Away starting goalie name
   * @param {string} homeGoalie - Home starting goalie name
   * @param {string} gameDate - Game date (YYYY-MM-DD format)
   * @returns {number} - Adjusted total prediction
   */
  adjustTotal(baseTotal, awayTeam, homeTeam, awayGoalie = null, homeGoalie = null, gameDate = null) {
    let adjusted = baseTotal;
    
    console.log(`\n🎯 Totals Adjustment for ${awayTeam} @ ${homeTeam}`);
    console.log(`   Base Total: ${baseTotal.toFixed(2)}`);
    
    // PHASE 0: Simple Amplification (addresses core regression issue)
    // The model regresses too much to 6.0. Amplify deviations.
    if (this.config.useAmplification) {
      const factor = this.amplificationFactor || 1.60; // Default to 60% if not set
      const amplification = this.amplifyDeviations(baseTotal, factor);
      adjusted = amplification;
      console.log(`   After Amplification (${factor}x): ${adjusted.toFixed(2)}`);
    }
    
    // Phase 1: Game Pace Factor
    if (this.config.usePaceFactor) {
      const paceFactor = this.getGamePaceFactor(awayTeam, homeTeam);
      adjusted *= paceFactor;
      console.log(`   After Pace (${paceFactor.toFixed(3)}x): ${adjusted.toFixed(2)}`);
    }
    
    // Phase 2: Enhanced Goalie Impact
    if (this.config.useGoalieEnhancement && awayGoalie && homeGoalie) {
      const goalieAdj = this.getTotalsGoalieAdjustment(awayGoalie, homeGoalie);
      adjusted *= goalieAdj;
      console.log(`   After Goalie (${goalieAdj.toFixed(3)}x): ${adjusted.toFixed(2)}`);
    }
    
    // Phase 3: Historical Matchup
    if (this.config.useMatchupHistory && this.gameHistory.length > 0) {
      const matchupAdj = this.getMatchupHistoryFactor(awayTeam, homeTeam, gameDate);
      adjusted *= matchupAdj;
      console.log(`   After Matchup (${matchupAdj.toFixed(3)}x): ${adjusted.toFixed(2)}`);
    }
    
    // Phase 4: Context Adjustments
    if (this.config.useContextAdjustment) {
      const contextAdj = this.getContextAdjustment(awayTeam, homeTeam, gameDate);
      adjusted *= contextAdj;
      console.log(`   After Context (${contextAdj.toFixed(3)}x): ${adjusted.toFixed(2)}`);
    }
    
    console.log(`   ✅ Final Adjusted Total: ${adjusted.toFixed(2)}`);
    
    return adjusted;
  }
  
  /**
   * PHASE 0: Amplify Deviations from Mean
   * 
   * Problem: Model regresses everything to ~6 goals
   * Solution: If prediction is high, make it higher. If low, make it lower.
   * 
   * This addresses the root cause: over-regression to mean
   */
  amplifyDeviations(baseTotal, factor = 1.60) {
    const mean = 6.0; // League average game total
    const deviation = baseTotal - mean;
    
    // Amplify the deviation by specified factor
    // factor = 1.20 → 20% amplification (too weak)
    // factor = 1.60 → 60% amplification (target)
    // factor = 2.00 → 100% amplification (aggressive)
    // 
    // Example with factor = 1.60:
    // If base = 6.5 (0.5 above mean) → adjusted = 6.0 + (0.5 * 1.6) = 6.8
    // If base = 5.5 (0.5 below mean) → adjusted = 6.0 + (-0.5 * 1.6) = 5.2
    const amplifiedDeviation = deviation * factor;
    
    return mean + amplifiedDeviation;
  }
  
  /**
   * Set amplification factor for testing
   */
  setAmplificationFactor(factor) {
    this.amplificationFactor = factor;
  }
  
  /**
   * PHASE 1: Game Pace Factor
   * 
   * Problem: Fast teams vs Fast teams = high-scoring, Defensive vs Defensive = low-scoring
   * Solution: Multiply total by combined pace factor
   * 
   * Expected Impact: RMSE 2.40 → 2.00
   */
  getGamePaceFactor(teamA, teamB) {
    const teamA_5v5 = this.dataProcessor.getTeamData(teamA, '5on5');
    const teamB_5v5 = this.dataProcessor.getTeamData(teamB, '5on5');
    
    if (!teamA_5v5 || !teamB_5v5) return 1.0;
    
    // Calculate shot pace per 60 minutes (offense + defense)
    const teamA_pace = (teamA_5v5.shotsOnGoalFor_per60 || 0) + (teamA_5v5.shotsOnGoalAgainst_per60 || 0);
    const teamB_pace = (teamB_5v5.shotsOnGoalFor_per60 || 0) + (teamB_5v5.shotsOnGoalAgainst_per60 || 0);
    
    if (teamA_pace === 0 || teamB_pace === 0) return 1.0;
    
    // Combined pace: average of both teams
    const combinedPace = (teamA_pace + teamB_pace) / 2;
    
    // League average pace: ~60 shots per game (30 for each team)
    const leagueAvgPace = 60;
    
    // Calculate pace factor with limits
    // Fast-paced (70+ shots): 1.15x multiplier
    // Slow-paced (50- shots): 0.85x multiplier
    const rawFactor = combinedPace / leagueAvgPace;
    const paceFactor = Math.min(1.20, Math.max(0.80, rawFactor));
    
    return paceFactor;
  }
  
  /**
   * PHASE 2: Enhanced Goalie Impact (Totals-Specific)
   * 
   * Problem: Current goalie adjustment too weak (3.6% for elite goalie)
   * Solution: Stronger adjustment for totals (10%+ for elite matchup)
   * 
   * Expected Impact: RMSE 2.00 → 1.80
   */
  getTotalsGoalieAdjustment(awayGoalie, homeGoalie) {
    if (!this.dataProcessor.goalieProcessor) return 1.0;
    
    // Get GSAE for both goalies
    const awayGSAE = this.dataProcessor.goalieProcessor.calculateGSAE(awayGoalie, '5on5');
    const homeGSAE = this.dataProcessor.goalieProcessor.calculateGSAE(homeGoalie, '5on5');
    
    // Combined goalie quality
    // Positive GSAE = good goalie (REDUCES total scoring)
    // Negative GSAE = weak goalie (INCREASES total scoring)
    const combinedGSAE = (awayGSAE + homeGSAE) / 2;
    
    // FIX: Invert the adjustment direction
    // Elite matchup (both +12 GSAE) = average +12 → multiply by 0.904 (9.6% reduction)
    // Weak matchup (both -12 GSAE) = average -12 → multiply by 1.096 (9.6% increase)
    // Use NEGATIVE sign to invert: 1 - (GSAE * 0.008)
    const adjustment = 1 - (combinedGSAE * 0.008);
    
    return adjustment;
  }
  
  /**
   * PHASE 3: Historical Matchup Factor
   * 
   * Problem: Some teams consistently produce high/low-scoring games
   * Solution: Weight recent head-to-head results
   * 
   * Expected Impact: RMSE 1.80 → 1.65
   */
  getMatchupHistoryFactor(teamA, teamB, gameDate) {
    if (this.gameHistory.length === 0) return 1.0;
    
    // Get recent head-to-head games (last 3 meetings)
    const h2h = this.getHeadToHeadGames(teamA, teamB, gameDate, 3);
    
    if (h2h.length === 0) return 1.0;
    
    // Calculate average actual total
    const avgActualTotal = h2h.reduce((sum, game) => sum + game.actualTotal, 0) / h2h.length;
    
    // Estimate what we would have predicted at the time (using current model as proxy)
    const teamA_5v5 = this.dataProcessor.getTeamData(teamA, '5on5');
    const teamB_5v5 = this.dataProcessor.getTeamData(teamB, '5on5');
    
    if (!teamA_5v5 || !teamB_5v5) return 1.0;
    
    // Simple expected total estimate: league average
    const expectedTotal = 6.0; // Average NHL game
    
    // Calculate matchup factor
    const matchupFactor = avgActualTotal / expectedTotal;
    
    // Apply with 30% confidence (don't over-weight small sample)
    // If last 3 games averaged 7.5 (matchupFactor = 1.25)
    // Adjust by: 1.0 + ((1.25 - 1.0) * 0.30) = 1.075 (7.5% increase)
    const adjustment = 1.0 + ((matchupFactor - 1.0) * 0.30);
    
    // Limit adjustment to ±15%
    return Math.min(1.15, Math.max(0.85, adjustment));
  }
  
  /**
   * Get head-to-head games from history
   */
  getHeadToHeadGames(teamA, teamB, beforeDate, limit = 3) {
    const TEAM_MAP = {
      'Anaheim Ducks': 'ANA', 'Boston Bruins': 'BOS', 'Buffalo Sabres': 'BUF',
      'Calgary Flames': 'CGY', 'Carolina Hurricanes': 'CAR', 'Chicago Blackhawks': 'CHI',
      'Colorado Avalanche': 'COL', 'Columbus Blue Jackets': 'CBJ', 'Dallas Stars': 'DAL',
      'Detroit Red Wings': 'DET', 'Edmonton Oilers': 'EDM', 'Florida Panthers': 'FLA',
      'Los Angeles Kings': 'LAK', 'Minnesota Wild': 'MIN', 'Montreal Canadiens': 'MTL',
      'Nashville Predators': 'NSH', 'New Jersey Devils': 'NJD', 'New York Islanders': 'NYI',
      'New York Rangers': 'NYR', 'Ottawa Senators': 'OTT', 'Philadelphia Flyers': 'PHI',
      'Pittsburgh Penguins': 'PIT', 'San Jose Sharks': 'SJS', 'Seattle Kraken': 'SEA',
      'St. Louis Blues': 'STL', 'Tampa Bay Lightning': 'TBL', 'Toronto Maple Leafs': 'TOR',
      'Vancouver Canucks': 'VAN', 'Vegas Golden Knights': 'VGK', 'Washington Capitals': 'WSH',
      'Winnipeg Jets': 'WPG', 'Utah Hockey Club': 'UTA', 'Utah Mammoth': 'UTA'
    };
    
    const games = [];
    
    for (const row of this.gameHistory) {
      const awayTeamFull = row['Visitor'];
      const homeTeamFull = row['Home'];
      const away = TEAM_MAP[awayTeamFull];
      const home = TEAM_MAP[homeTeamFull];
      
      // Check if this is a matchup between teamA and teamB
      const isMatchup = (away === teamA && home === teamB) || (away === teamB && home === teamA);
      if (!isMatchup) continue;
      
      // Check if game is before the target date
      const gameDate = row['Date'];
      if (beforeDate && gameDate >= beforeDate) continue;
      
      // Parse scores
      const scores = Object.keys(row).filter(k => k === 'Score' || k.startsWith('Score'));
      const score1 = parseInt(row[scores[0]]) || 0;
      const score2 = parseInt(row[scores[1]]) || 0;
      const actualTotal = score1 + score2;
      
      // Only include completed games
      if (actualTotal > 0) {
        games.push({ date: gameDate, actualTotal });
      }
    }
    
    // Sort by date descending and take most recent
    games.sort((a, b) => b.date.localeCompare(a.date));
    return games.slice(0, limit);
  }
  
  /**
   * PHASE 4: Game Context Adjustments
   * 
   * Problem: Missing situational factors
   * Solution: Small adjustments for rivalry, division, stakes
   * 
   * Expected Impact: RMSE 1.65 → 1.55
   */
  getContextAdjustment(teamA, teamB, gameDate) {
    let adjustment = 1.0;
    
    // Rivalry games tend to be lower-scoring (tighter defense)
    if (this.isRivalry(teamA, teamB)) {
      adjustment *= 0.95; // -5%
    }
    
    // Division games = more familiar = lower scoring
    if (this.sameDivision(teamA, teamB)) {
      adjustment *= 0.97; // -3%
    }
    
    return adjustment;
  }
  
  /**
   * Check if teams are rivals
   */
  isRivalry(teamA, teamB) {
    const rivalries = [
      ['TOR', 'MTL'], ['BOS', 'MTL'], ['NYR', 'NYI'], ['NYR', 'NJD'],
      ['PIT', 'PHI'], ['CHI', 'DET'], ['EDM', 'CGY'], ['VAN', 'CGY'],
      ['LAK', 'SJS'], ['VGK', 'LAK'], ['COL', 'MIN'], ['DAL', 'STL']
    ];
    
    return rivalries.some(([a, b]) => 
      (a === teamA && b === teamB) || (a === teamB && b === teamA)
    );
  }
  
  /**
   * Check if teams are in same division
   */
  sameDivision(teamA, teamB) {
    const divisions = {
      atlantic: ['BOS', 'BUF', 'DET', 'FLA', 'MTL', 'OTT', 'TBL', 'TOR'],
      metropolitan: ['CAR', 'CBJ', 'NJD', 'NYI', 'NYR', 'PHI', 'PIT', 'WSH'],
      central: ['ARI', 'CHI', 'COL', 'DAL', 'MIN', 'NSH', 'STL', 'WPG', 'UTA'],
      pacific: ['ANA', 'CGY', 'EDM', 'LAK', 'SJS', 'SEA', 'VAN', 'VGK']
    };
    
    for (const teams of Object.values(divisions)) {
      if (teams.includes(teamA) && teams.includes(teamB)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Enable/disable specific adjustment phases for testing
   */
  setPhases(phases) {
    this.config = { ...this.config, ...phases };
  }
}

