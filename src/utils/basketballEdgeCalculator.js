/**
 * Basketball Edge Calculator
 * Implements 80/20 ensemble model: D-Ratings (80%) + Haslametrics (20%)
 * 
 * Calculates betting edges and assigns quality grades
 */

/**
 * Basketball Edge Calculator Class
 */
export class BasketballEdgeCalculator {
  constructor() {
    // Ensemble weights (Updated weighting)
    this.weights = {
      dratings: 0.80,    // Primary predictions (increased weight)
      haslametrics: 0.20  // Tempo-free validation
    };
    
    // Grading thresholds (EV%)
    this.grades = {
      'A+': 5.0,
      'A': 3.5,
      'B+': 2.5,
      'B': 1.5,
      'C': 0
    };
  }
  
  /**
   * Calculate ensemble prediction for a game
   * @param {object} matchedGame - Game with all data sources
   * @returns {object} - Ensemble prediction with edge calculation
   */
  calculateEnsemblePrediction(matchedGame) {
    const { dratings, haslametrics, odds } = matchedGame;
    
    // Ensure we have necessary data
    if (!odds || !odds.awayOdds || !odds.homeOdds) {
      return { error: 'Missing odds data', grade: 'N/A' };
    }
    
    // Calculate ensemble win probability for away team
    let ensembleAwayProb = null;
    let ensembleHomeProb = null;
    let confidence = 'LOW';
    
    // Calculate ensemble predicted scores
    let ensembleAwayScore = null;
    let ensembleHomeScore = null;
    let ensembleTotal = null;
    
    // REQUIREMENT: BOTH D-Ratings AND Haslametrics for quality picks
    // This ensures ensemble prediction accuracy and consistency
    if (dratings && dratings.awayWinProb && haslametrics) {
      ensembleAwayProb = 
        (dratings.awayWinProb * this.weights.dratings) +
        (this.estimateHaslaProbability(matchedGame, 'away') * this.weights.haslametrics);
      
      ensembleHomeProb = 1 - ensembleAwayProb;
      confidence = 'HIGH';
      
      // Calculate ensemble predicted scores (80/20 blend)
      if (dratings.awayScore && dratings.homeScore && haslametrics.awayScore && haslametrics.homeScore) {
        ensembleAwayScore = 
          (dratings.awayScore * this.weights.dratings) +
          (haslametrics.awayScore * this.weights.haslametrics);
        
        ensembleHomeScore = 
          (dratings.homeScore * this.weights.dratings) +
          (haslametrics.homeScore * this.weights.haslametrics);
        
        ensembleTotal = ensembleAwayScore + ensembleHomeScore;
      }
    }
    // CASE 2: Missing D-Ratings or Haslametrics - SKIP
    else {
      return { error: 'Requires BOTH D-Ratings AND Haslametrics', grade: 'N/A' };
    }
    
    // Calculate market probability from odds
    const marketAwayProb = this.oddsToProb(odds.awayOdds);
    const marketHomeProb = this.oddsToProb(odds.homeOdds);
    
    // Calculate edge
    const awayEdge = ensembleAwayProb - marketAwayProb;
    const homeEdge = ensembleHomeProb - marketHomeProb;
    
    // Calculate EV% (Expected Value percentage)
    const awayEV = (awayEdge / marketAwayProb) * 100;
    const homeEV = (homeEdge / marketHomeProb) * 100;
    
    // PICK-TO-WIN STRATEGY: Pick the team we predict will win (>50% probability)
    const bestBet = ensembleAwayProb > 0.5 ? 'away' : 'home';
    const bestEV = bestBet === 'away' ? awayEV : homeEV;
    const bestEdge = bestBet === 'away' ? awayEdge : homeEdge;
    
    // Assign grade
    const grade = this.getGrade(bestEV);
    
    // Cap EV display at 25% for realistic presentation (extreme outliers skew perception)
    const cappedBestEV = Math.min(bestEV, 25);
    
    return {
      // Ensemble probabilities
      ensembleAwayProb: Math.round(ensembleAwayProb * 1000) / 1000,
      ensembleHomeProb: Math.round(ensembleHomeProb * 1000) / 1000,
      
      // Ensemble predicted scores
      ensembleAwayScore: ensembleAwayScore ? Math.round(ensembleAwayScore * 10) / 10 : null,
      ensembleHomeScore: ensembleHomeScore ? Math.round(ensembleHomeScore * 10) / 10 : null,
      ensembleTotal: ensembleTotal ? Math.round(ensembleTotal * 10) / 10 : null,
      
      // Market probabilities
      marketAwayProb: Math.round(marketAwayProb * 1000) / 1000,
      marketHomeProb: Math.round(marketHomeProb * 1000) / 1000,
      
      // Edges
      awayEdge: Math.round(awayEdge * 1000) / 1000,
      homeEdge: Math.round(homeEdge * 1000) / 1000,
      
      // Expected Value
      awayEV: Math.round(awayEV * 10) / 10,
      homeEV: Math.round(homeEV * 10) / 10,
      
      // Best bet
      bestBet: bestBet,
      bestTeam: bestBet === 'away' ? matchedGame.awayTeam : matchedGame.homeTeam,
      bestEV: Math.round(cappedBestEV * 10) / 10,
      rawEV: Math.round(bestEV * 10) / 10, // Keep uncapped for internal tracking
      bestEdge: Math.round(bestEdge * 1000) / 1000,
      bestOdds: bestBet === 'away' ? odds.awayOdds : odds.homeOdds,
      
      // Grading
      grade: grade,
      confidence: confidence,
      
      // Transparency: Show component predictions for best bet
      dratingsProb: bestBet === 'away' ? dratings?.awayWinProb : dratings?.homeWinProb,
      haslametricsProb: haslametrics ? (bestBet === 'away' ? this.estimateHaslaProbability(matchedGame, 'away') : this.estimateHaslaProbability(matchedGame, 'home')) : null,
      ensembleProb: bestBet === 'away' ? ensembleAwayProb : ensembleHomeProb,
      marketProb: bestBet === 'away' ? marketAwayProb : marketHomeProb,
      
      // Metadata
      dataQuality: matchedGame.dataQuality
    };
  }
  
  /**
   * Estimate Haslametrics probability using efficiency ratings
   * This is a simplified model - in practice would use full tempo-free calculations
   * @param {object} game - Matched game
   * @param {string} team - 'away' or 'home'
   * @returns {number} - Estimated win probability
   */
  estimateHaslaProbability(game, team) {
    const { haslametrics } = game;
    
    if (!haslametrics || !haslametrics.awayOffEff || !haslametrics.homeOffEff) {
      return 0.5; // Default to 50/50 if no data
    }
    
    // Simple model: efficiency differential with home court advantage
    const homeAdvantage = 3; // ~3 points home advantage
    const awayEffAdj = haslametrics.awayOffEff;
    const homeEffAdj = haslametrics.homeOffEff + homeAdvantage;
    
    const diff = homeEffAdj - awayEffAdj;
    
    // Logistic function to convert differential to probability
    const homeProb = 1 / (1 + Math.exp(-diff / 10));
    
    return team === 'away' ? (1 - homeProb) : homeProb;
  }
  
  /**
   * Convert moneyline odds to implied probability
   * @param {number} odds - Moneyline odds
   * @returns {number} - Probability (0-1)
   */
  oddsToProb(odds) {
    if (!odds) return 0.5;
    
    if (odds > 0) {
      // Positive odds (underdog)
      return 100 / (odds + 100);
    } else {
      // Negative odds (favorite)
      return Math.abs(odds) / (Math.abs(odds) + 100);
    }
  }
  
  /**
   * Assign quality grade based on EV%
   * @param {number} evPercent - Expected value percentage
   * @returns {string} - Grade (A+, A, B+, B, C)
   */
  getGrade(evPercent) {
    // CRITICAL: Only give good grades when EV is POSITIVE (we're more confident than market)
    // Negative EV = market is more confident than us = BAD BET
    
    if (evPercent >= this.grades['A+']) return 'A+';  // ≥5% positive edge
    if (evPercent >= this.grades['A']) return 'A';    // ≥3.5% positive edge
    if (evPercent >= this.grades['B+']) return 'B+';  // ≥2.5% positive edge
    if (evPercent >= this.grades['B']) return 'B';    // ≥1.5% positive edge
    if (evPercent >= this.grades['C']) return 'C';    // ≥0% (any positive)
    
    // Negative EV = market more confident = FADE THESE
    if (evPercent >= -2.5) return 'D';  // Small negative edge
    return 'F';  // Large negative edge (≤-2.5%)
  }
  
  /**
   * Filter recommendations to only quality bets
   * @param {array} games - Array of games with predictions
   * @param {string} minGrade - Minimum grade ('A+', 'A', 'B+', 'B', 'C')
   * @returns {array} - Filtered recommendations
   */
  filterRecommendations(games, minGrade = 'B+') {
    const gradeOrder = ['A+', 'A', 'B+', 'B', 'C'];
    const minIndex = gradeOrder.indexOf(minGrade);
    
    return games
      .filter(game => {
        const gradeIndex = gradeOrder.indexOf(game.prediction?.grade);
        return gradeIndex >= 0 && gradeIndex <= minIndex;
      })
      .sort((a, b) => {
        // Sort by grade first, then by EV%
        const gradeA = gradeOrder.indexOf(a.prediction.grade);
        const gradeB = gradeOrder.indexOf(b.prediction.grade);
        
        if (gradeA !== gradeB) {
          return gradeA - gradeB; // Better grades first
        }
        
        return b.prediction.bestEV - a.prediction.bestEV; // Higher EV first
      });
  }
  
  /**
   * Process all games and add predictions
   * @param {array} matchedGames - Array of matched games
   * @returns {array} - Games with predictions
   */
  processGames(matchedGames) {
    return matchedGames.map(game => ({
      ...game,
      prediction: this.calculateEnsemblePrediction(game)
    }));
  }
}

// Export singleton instance
export const basketballEdgeCalculator = new BasketballEdgeCalculator();

