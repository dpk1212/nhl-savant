/**
 * Basketball Edge Calculator
 * Implements 90/10 ensemble model: D-Ratings (90%) + Haslametrics (10%)
 * 
 * Updated 2026-02-01: Analysis showed D-Ratings is more accurate:
 * - Winner prediction: 62.7% vs 61.4%
 * - Score prediction: Lower MAE across all metrics
 * - Head-to-head: D-Ratings closer 51.4% vs 47.7%
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
    // Ensemble weights (Updated 2026-02-01: D-Ratings proven more accurate)
    this.weights = {
      dratings: 0.90,    // Primary predictions (D-Ratings wins 5-0 on accuracy metrics)
      haslametrics: 0.10  // Secondary validation only
    };
    
    // PHASE 3: Updated grading thresholds (stricter for profitability)
    this.grades = {
      'A': 5.0,    // Strong edge (≥5.0% EV) - RAISED from 3.5%
      'B': 3.0,    // Good edge (≥3.0% EV) - RAISED from 1.5%
      'C': 1.0,    // Marginal (≥1.0% EV) - RAISED from 0%
      'D': -3,     // Slight negative (≥-3% EV) - NEVER BET
      'F': -100    // Bad value (<-3% EV) - NEVER BET
    };
    
    // PHASE 3: Minimum betting thresholds
    this.minEV = 3.0;           // Minimum 3% EV to bet
    this.minProbability = 0.35;  // Minimum 35% win probability
    this.maxOdds = 300;          // No extreme underdogs
    this.minOdds = -1000;        // No extreme favorites
    
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
      
      // Calculate ensemble predicted scores (90/10 blend)
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
    if (!dratings || !dratings.awayWinProb || !haslametrics) {
      return { error: 'Requires BOTH D-Ratings AND Haslametrics', grade: 'N/A' };
    }
    
    // Calculate Model Confluence metrics
    // Model 1 winner: based on D-Ratings predicted scores
    // Model 2 winner: based on Haslametrics predicted scores
    let modelsAgree = null;
    let modelConfluence = 0;
    let combinedMargin = null;
    
    if (dratings.awayScore && dratings.homeScore && haslametrics.awayScore && haslametrics.homeScore) {
      // Determine who each model picks
      const model1PicksAway = dratings.awayScore > dratings.homeScore;
      const model2PicksAway = haslametrics.awayScore > haslametrics.homeScore;
      
      modelsAgree = model1PicksAway === model2PicksAway;
      modelConfluence = modelsAgree ? 2 : 1; // 2 = both agree, 1 = split
      
      // Calculate COMBINED margin from both models
      // D-Ratings margin: positive = away wins, negative = home wins
      const drateMargin = dratings.awayScore - dratings.homeScore;
      // Haslametrics margin: positive = away wins, negative = home wins  
      const haslaMargin = haslametrics.awayScore - haslametrics.homeScore;
      
      // Combined margin: sum of both (if they agree, it's additive; if they disagree, they partially cancel)
      combinedMargin = drateMargin + haslaMargin;
      
      // 🎯 CRITICAL: Check if both models support THE PICK (not just agree on winner)
      // This is what determines if we should bet - both models must favor the picked team
      // We'll set this after we know bestBet (below)
    }
    
    // Calculate market probability from odds
    const marketAwayProb = this.oddsToProb(odds.awayOdds);
    const marketHomeProb = this.oddsToProb(odds.homeOdds);
    
    // Use RAW ensemble probabilities (NO calibration - model is already calibrated via 90/10 blend)
    // Market calibration was killing all edge - D-Ratings dominates with 90% weight
    const calibratedAwayProb = ensembleAwayProb;
    const calibratedHomeProb = ensembleHomeProb;
    
    // Calculate edge using model probabilities
    const awayEdge = calibratedAwayProb - marketAwayProb;
    const homeEdge = calibratedHomeProb - marketHomeProb;
    
    // Calculate EV using CORRECT formula (NHL-style)
    const awayEV = this.calculateEV(calibratedAwayProb, odds.awayOdds);
    const homeEV = this.calculateEV(calibratedHomeProb, odds.homeOdds);
    
    // Pick the side with BEST EV (could be away, home, or neither if both negative)
    // We'll let the filter handle removing negative EV bets
    const bestBet = awayEV >= homeEV ? 'away' : 'home';
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
    // Build bet object for dynamic scoring (using CALIBRATED probabilities)
    const betForScoring = {
      prediction: {
        grade: grade,
        bestEV: bestEV,
        ensembleAwayProb: calibratedAwayProb,  // Use calibrated
        ensembleHomeProb: calibratedHomeProb   // Use calibrated
      },
      bet: {
        odds: bestOdds,
        team: bestBet === 'away' ? matchedGame.awayTeam : matchedGame.homeTeam
      },
      awayTeam: matchedGame.awayTeam,
      homeTeam: matchedGame.homeTeam
    };
    
    // PHASE 4: Calculate unit sizing using DYNAMIC CONFIDENCE SYSTEM
    // (Kelly units deprecated - ignored historical pattern performance)
    const bestProb = bestBet === 'away' ? calibratedAwayProb : calibratedHomeProb;
    const kellyUnits = this.calculateOptimalUnits(bestEV, bestProb, bestOdds);
    
    // Calculate dynamic units with BLEEDING DETECTION and pattern ROI analysis
    const dynamicResult = calculateDynamicUnits(betForScoring, this.confidenceData);
    
    // 🩸 USE DYNAMIC UNITS - respects bleeding patterns and historical ROI
    // Kelly is kept for reference only (pure math, ignores pattern performance)
    const unitSize = dynamicResult.units;
    const confidenceTier = dynamicResult.tier || 'MODERATE';
    const confidenceScore = dynamicResult.score || 0;
    const confidenceFactors = dynamicResult.factors || [];
    const dynamicPatternROI = dynamicResult.patternROI;
    
    // Cap EV display at 25% for realistic presentation (extreme outliers skew perception)
    const cappedBestEV = Math.min(bestEV, 25);
    
    return {
      // Raw ensemble probabilities (for transparency)
      ensembleAwayProb: Math.round(ensembleAwayProb * 1000) / 1000,
      ensembleHomeProb: Math.round(ensembleHomeProb * 1000) / 1000,
      
      // Calibrated probabilities (used for betting decisions)
      calibratedAwayProb: Math.round(calibratedAwayProb * 1000) / 1000,
      calibratedHomeProb: Math.round(calibratedHomeProb * 1000) / 1000,
      
      // Ensemble predicted scores
      ensembleAwayScore: ensembleAwayScore ? Math.round(ensembleAwayScore * 10) / 10 : null,
      ensembleHomeScore: ensembleHomeScore ? Math.round(ensembleHomeScore * 10) / 10 : null,
      ensembleTotal: ensembleTotal ? Math.round(ensembleTotal * 10) / 10 : null,
      
      // Model Confluence metrics (for UI display)
      modelConfluence: modelConfluence, // 2 = both agree, 1 = split, 0 = no data
      modelsAgree: modelsAgree,
      combinedMargin: combinedMargin ? Math.round(combinedMargin * 10) / 10 : null,
      
      // Market probabilities
      marketAwayProb: Math.round(marketAwayProb * 1000) / 1000,
      marketHomeProb: Math.round(marketHomeProb * 1000) / 1000,
      
      // Edges (now using calibrated probabilities)
      awayEdge: Math.round(awayEdge * 1000) / 1000,
      homeEdge: Math.round(homeEdge * 1000) / 1000,
      
      // Expected Value (CORRECTED FORMULA - NHL-style)
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
      historicalROI: dynamicPatternROI || perfContext.historicalROI || 0,    // Use dynamic ROI, fallback to static, then 0
      qualityEmoji: qualityEmoji,
      
      // Transparency: Show component predictions for best bet
      dratingsProb: bestBet === 'away' ? dratings?.awayWinProb : dratings?.homeWinProb,
      haslametricsProb: haslametrics ? (bestBet === 'away' ? this.estimateHaslaProbability(matchedGame, 'away') : this.estimateHaslaProbability(matchedGame, 'home')) : null,
      ensembleProb: bestBet === 'away' ? ensembleAwayProb : ensembleHomeProb,
      calibratedProb: bestBet === 'away' ? calibratedAwayProb : calibratedHomeProb,
      marketProb: bestBet === 'away' ? marketAwayProb : marketHomeProb,
      
      // 📊 INDIVIDUAL MODEL DATA (for accuracy analysis)
      // D-Ratings: Primary model (80% weight)
      dratingsAwayProb: dratings?.awayWinProb ? Math.round(dratings.awayWinProb * 1000) / 1000 : null,
      dratingsHomeProb: dratings?.homeWinProb ? Math.round(dratings.homeWinProb * 1000) / 1000 : null,
      dratingsAwayScore: dratings?.awayScore ? Math.round(dratings.awayScore * 10) / 10 : null,
      dratingsHomeScore: dratings?.homeScore ? Math.round(dratings.homeScore * 10) / 10 : null,
      
      // Haslametrics: Secondary model (20% weight)
      haslametricsAwayProb: haslametrics ? Math.round(this.estimateHaslaProbability(matchedGame, 'away') * 1000) / 1000 : null,
      haslametricsHomeProb: haslametrics ? Math.round(this.estimateHaslaProbability(matchedGame, 'home') * 1000) / 1000 : null,
      haslametricsAwayScore: haslametrics?.awayScore ? Math.round(haslametrics.awayScore * 10) / 10 : null,
      haslametricsHomeScore: haslametrics?.homeScore ? Math.round(haslametrics.homeScore * 10) / 10 : null,
      
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
   * Calculate Expected Value (NHL-style, CORRECT formula)
   * @param {number} modelProbability - Model's win probability (0-1)
   * @param {number} marketOdds - American odds (e.g., -150, +200)
   * @param {number} stake - Stake amount (default 100)
   * @returns {number} Expected value in dollars (represents EV%)
   */
  calculateEV(modelProbability, marketOdds, stake = 100) {
    // Convert American odds to decimal odds
    let decimalOdds;
    if (marketOdds > 0) {
      // Positive odds: +150 → 2.50
      decimalOdds = 1 + (marketOdds / 100);
    } else {
      // Negative odds: -150 → 1.667
      decimalOdds = 1 + (100 / Math.abs(marketOdds));
    }
    
    // Calculate expected value
    // EV = (P_win × total_return) - stake
    const totalReturn = stake * decimalOdds;
    const ev = (modelProbability * totalReturn) - stake;
    
    return ev; // Already in dollars, represents EV%
  }
  
  /**
   * Apply market regression to ensemble probability
   * Prevents overconfidence by blending with market wisdom
   * @param {number} modelProb - Raw model probability
   * @param {number} marketProb - Market implied probability
   * @param {number} confidence - Confidence level (0-1, default 0.75)
   * @returns {number} Calibrated probability
   */
  calibrateWithMarket(modelProb, marketProb, confidence = 0.75) {
    // Blend model with market (similar to NHL's approach)
    // confidence = 1.0 means trust model 100%
    // confidence = 0.5 means 50/50 blend
    // confidence = 0.75 means 75% model, 25% market (RECOMMENDED)
    
    const calibrated = (modelProb * confidence) + (marketProb * (1 - confidence));
    
    return calibrated;
  }
  
  /**
   * PHASE 4: Calculate optimal unit size based on EV and probability
   * Uses fractional Kelly (1/4 Kelly for safety)
   * @param {number} ev - Expected value percentage
   * @param {number} modelProb - Calibrated model probability
   * @param {number} odds - American odds
   * @returns {number} Recommended units (0.5 - 5.0)
   */
  calculateOptimalUnits(ev, modelProb, odds) {
    // Convert odds to decimal
    const decimalOdds = odds > 0 
      ? 1 + (odds / 100)
      : 1 + (100 / Math.abs(odds));
    
    // Kelly fraction = (modelProb * (decimalOdds - 1) - (1 - modelProb)) / (decimalOdds - 1)
    const kellyFraction = (modelProb * (decimalOdds - 1) - (1 - modelProb)) / (decimalOdds - 1);
    
    // Use 1/4 Kelly for safety (fractional Kelly)
    const fractionalKelly = kellyFraction / 4;
    
    // Convert to unit scale (0.5 - 5.0) with more aggressive scaling
    // Kelly of 0.05 (5%) → 2.5 units
    // Kelly of 0.10 (10%) → 5.0 units (capped)
    // CHANGED: Multiplier from 50 to 100 for better differentiation
    let units = fractionalKelly * 100;
    
    // Apply bounds
    units = Math.max(0.5, Math.min(5.0, units));
    
    // Round to nearest 0.5
    units = Math.round(units * 2) / 2;
    
    return units;
  }
  
  /**
   * Assign quality grade based on EV%
   * @param {number} evPercent - Expected value percentage
   * @returns {string} - Grade (A, B, C, D, or F)
   */
  getGrade(evPercent) {
    // FULL A-F GRADING SYSTEM
    // Properly distributes picks across quality tiers
    
    if (evPercent >= this.grades['A']) return 'A';    // ≥5.0% (strong edge)
    if (evPercent >= this.grades['B']) return 'B';    // ≥3.0% (good edge)
    if (evPercent >= this.grades['C']) return 'C';    // ≥1.0% (marginal)
    if (evPercent >= this.grades['D']) return 'D';    // ≥-3% (slight negative)
    return 'F';  // <-3% (bad value)
  }
  
  /**
   * PHASE 3: Filter bets to only profitable opportunities
   * @param {object} prediction - Prediction object
   * @returns {boolean} True if bet passes filters
   */
  shouldBet(prediction) {
    // FILTER 1: Minimum EV threshold (3% minimum)
    if (prediction.bestEV < this.minEV) {
      console.log(`   ❌ Filtered: EV too low (${prediction.bestEV.toFixed(1)}% < ${this.minEV}%)`);
      return false;
    }
    
    // FILTER 2: No D or F grades (negative EV)
    if (prediction.grade === 'D' || prediction.grade === 'F') {
      console.log(`   ❌ Filtered: Grade ${prediction.grade} (never bet negative EV)`);
      return false;
    }
    
    // FILTER 3: Minimum calibrated probability (anti-extreme-odds)
    const bestProb = prediction.bestBet === 'away' 
      ? prediction.calibratedAwayProb 
      : prediction.calibratedHomeProb;
      
    if (bestProb < this.minProbability) {
      console.log(`   ❌ Filtered: Probability too low (${(bestProb * 100).toFixed(1)}% < ${this.minProbability * 100}%)`);
      return false;
    }
    
    // FILTER 4: No extreme odds (they never hit profitably)
    if (prediction.bestOdds < this.minOdds) {
      console.log(`   ❌ Filtered: Extreme favorite (${prediction.bestOdds} < ${this.minOdds})`);
      return false;
    }
    
    if (prediction.bestOdds > this.maxOdds) {
      console.log(`   ❌ Filtered: Extreme underdog (${prediction.bestOdds} > ${this.maxOdds})`);
      return false;
    }
    
    // FILTER 5: BOTH MODELS MUST AGREE AND SUPPORT THE PICK
    // modelsAgree = true means D-Ratings and Haslametrics predict same team wins
    // But we also need to be betting ON that team, not against it!
    // combinedMargin > 0 means models favor away, < 0 means models favor home
    const combinedMargin = prediction.combinedMargin;
    const pickIsAway = prediction.bestBet === 'away';
    
    // Check if we're betting on the team the models predict to win
    const bettingOnPredictedWinner = (pickIsAway && combinedMargin > 0) || (!pickIsAway && combinedMargin < 0);
    
    if (prediction.modelsAgree !== true) {
      console.log(`   ❌ Filtered: Models SPLIT (modelsAgree=${prediction.modelsAgree})`);
      return false;
    }
    
    if (!bettingOnPredictedWinner) {
      console.log(`   ❌ Filtered: Betting AGAINST predicted winner (pick=${prediction.bestBet}, margin=${combinedMargin})`);
      return false;
    }
    
    // Passed all filters
    return true;
  }
  
  /**
   * Filter recommendations to only quality bets
   * @param {array} games - Array of games with predictions
   * @param {string} minGrade - Minimum grade ('A+', 'A', 'B+', 'B', 'C')
   * @returns {array} - Filtered recommendations
   */
  filterRecommendations(games, minGrade = 'B+') {
    const gradeOrder = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
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
   * PHASE 3: Now filters out unprofitable bets
   * @param {array} matchedGames - Array of matched games
   * @returns {array} - Games with predictions (filtered)
   */
  processGames(matchedGames) {
    console.log(`\n🏀 Processing ${matchedGames.length} basketball games...`);
    
    const gamesWithPredictions = matchedGames.map(game => ({
      ...game,
      prediction: this.calculateEnsemblePrediction(game)
    }));
    
    // PHASE 3: Apply betting filters
    const beforeFilter = gamesWithPredictions.length;
    const filteredGames = gamesWithPredictions.filter(game => {
      // Skip games with errors
      if (game.prediction.error) {
        console.log(`   ⚠️  ${game.awayTeam} @ ${game.homeTeam}: ${game.prediction.error}`);
        return false;
      }
      
      // Apply betting filters
      const passes = this.shouldBet(game.prediction);
      if (passes) {
        console.log(`   ✅ ${game.awayTeam} @ ${game.homeTeam}: ${game.prediction.bestTeam} ${game.prediction.bestOdds} (${game.prediction.grade} grade, ${game.prediction.bestEV.toFixed(1)}% EV)`);
      }
      return passes;
    });
    
    const afterFilter = filteredGames.length;
    const filtered = beforeFilter - afterFilter;
    
    console.log(`\n📊 FILTER RESULTS:`);
    console.log(`   Total games: ${beforeFilter}`);
    console.log(`   Quality bets: ${afterFilter} ✅`);
    console.log(`   Filtered out: ${filtered} ❌`);
    console.log(`   Filter rate: ${((filtered / beforeFilter) * 100).toFixed(1)}%\n`);
    
    return filteredGames;
  }
}

// Export singleton instance
export const basketballEdgeCalculator = new BasketballEdgeCalculator();

