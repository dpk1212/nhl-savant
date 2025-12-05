/**
 * Basketball Edge Calculator
 * Implements 80/20 ensemble model: D-Ratings (80%) + Haslametrics (20%)
 * 
 * Calculates betting edges and assigns quality grades
 * 
 * DYNAMIC CONFIDENCE UNIT ALLOCATION:
 * Uses live-weighted confidence scoring based on historical ROI performance
 * Factors: Grade, Odds Range, Model Probability, EV, Side (Home/Away)
 */

import { 
  getOddsRange, 
  getPerformanceContext,
  getBetQualityEmoji,
  simplifyGrade
} from './abcUnits.js';

import {
  calculateDynamicUnits,
  getConfidenceDisplay
} from './dynamicConfidenceUnits.js';

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
    
    // Grading thresholds (EV%) - Simplified to A-B-C
    this.grades = {
      'A': 3.5,   // High EV (≥3.5%)
      'B': 1.5,   // Medium EV (≥1.5%)
      'C': 0      // Low/Negative EV
    };
    
    // Dynamic confidence weights (loaded from JSON)
    // Will use defaults if not set
    this.confidenceData = null;
  }
  
  /**
   * Set the confidence weights for dynamic unit calculation
   * Call this after loading weights from basketball_confidence_weights.json
   * @param {object} confidenceData - Weights object from loadConfidenceWeights()
   */
  setConfidenceWeights(confidenceData) {
    this.confidenceData = confidenceData;
    console.log('✅ Dynamic confidence weights loaded into calculator');
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
    
    // Assign grade based on EV
    const grade = this.getGrade(bestEV);
    const bestOdds = bestBet === 'away' ? odds.awayOdds : odds.homeOdds;
    
    // Get odds range for display
    const oddsRange = getOddsRange(bestOdds);
    const perfContext = getPerformanceContext(grade, bestOdds);
    const qualityEmoji = getBetQualityEmoji(grade, bestOdds);
    
    // DYNAMIC CONFIDENCE UNIT CALCULATION
    // Build bet object for dynamic scoring
    const betForScoring = {
      prediction: {
        grade: grade,
        bestEV: bestEV,
        ensembleAwayProb: ensembleAwayProb,
        ensembleHomeProb: ensembleHomeProb
      },
      bet: {
        odds: bestOdds,
        team: bestBet === 'away' ? matchedGame.awayTeam : matchedGame.homeTeam
      },
      awayTeam: matchedGame.awayTeam,
      homeTeam: matchedGame.homeTeam
    };
    
    // Calculate dynamic units using live confidence weights
    // Uses confidence weights from public/basketball_confidence_weights.json (loaded by page)
    // Falls back to default weights if not loaded
    const dynamicResult = calculateDynamicUnits(betForScoring, this.confidenceData);
    const unitSize = dynamicResult.units;
    const confidenceTier = dynamicResult.tier;
    const confidenceScore = dynamicResult.score;
    const confidenceFactors = dynamicResult.factors;
    
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
      bestOdds: bestOdds,
      
      // Grading (original + simplified)
      grade: grade,
      simplifiedGrade: perfContext.grade, // A, B, or C
      confidence: confidence,
      
      // DYNAMIC CONFIDENCE UNIT ALLOCATION
      unitSize: unitSize,
      confidenceTier: confidenceTier,      // ELITE, HIGH, GOOD, MODERATE, LOW, F-CAP
      confidenceScore: confidenceScore,    // Raw score (0-7 range)
      confidenceFactors: confidenceFactors, // Breakdown of contributing factors
      oddsRange: oddsRange,
      oddsRangeName: perfContext.oddsRangeName,
      historicalROI: perfContext.historicalROI,
      qualityEmoji: qualityEmoji,
      
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
   * @returns {string} - Grade (A, B, or C)
   */
  getGrade(evPercent) {
    // SIMPLIFIED A-B-C GRADING SYSTEM
    // Grade based on predicted EV, then odds context adjusts unit size
    
    if (evPercent >= this.grades['A']) return 'A';    // ≥3.5% positive edge (high confidence)
    if (evPercent >= this.grades['B']) return 'B';    // ≥1.5% positive edge (medium confidence)
    return 'C';  // <1.5% edge (low confidence or negative)
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

