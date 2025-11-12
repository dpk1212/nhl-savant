// Edge Calculator - Calculate betting edges across all markets
import { parseBothFiles } from './oddsTraderParser.js';

export class EdgeCalculator {
  constructor(dataProcessor, oddsFiles, startingGoalies = null, moneyPuckPredictions = null, config = {}) {
    this.dataProcessor = dataProcessor;
    this.startingGoalies = startingGoalies;
    this.moneyPuckPredictions = moneyPuckPredictions;
    
    // MONEYPUCK CALIBRATION CONFIG - November 2025
    // Use MoneyPuck (established model) to calibrate your predictions
    this.config = {
      // Calibration weights (when MoneyPuck available)
      yourModelWeight: config.yourModelWeight || 0.30,      // 30% your model (new, learning)
      moneyPuckWeight: config.moneyPuckWeight || 0.70,      // 70% MoneyPuck (established, trusted)
      
      // Fallback ensemble (when MoneyPuck unavailable)
      modelWeight: config.modelWeight || 0.65,              // 65% model vs market
      marketWeight: config.marketWeight || 0.35,            // 35% market
      
      // Filtering thresholds
      maxAgreement: config.maxAgreement || 0.05,            // 5% max disagreement (legacy)
      minEV: config.minEV || 0.015,                         // 1.5% minimum EV threshold
      minQuality: config.minQuality || 'B',                 // Minimum quality grade (B or higher)
      kellyFraction: config.kellyFraction || 0.25,          // Quarter Kelly sizing
      maxKelly: config.maxKelly || 0.05,                    // 5% max bet
      useEnsemble: config.useEnsemble !== false             // Enable by default
    };
    
    // TOTALS BETTING REMOVED: Focus on elite 64.7% moneyline performance
    
    // Use parseBothFiles if we have both money and total files
    if (oddsFiles && oddsFiles.moneyText && oddsFiles.totalText) {
      this.games = parseBothFiles(oddsFiles.moneyText, oddsFiles.totalText);
    } else {
      this.games = [];
    }
  }

  // Helper: Get starting goalie for a team in a specific game
  getStartingGoalie(team, game) {
    if (!this.startingGoalies || !this.startingGoalies.games) return null;
    
    // Find the game in starting goalies
    const matchup = `${game.awayTeam} @ ${game.homeTeam}`;
    const goalieGame = this.startingGoalies.games.find(g => g.matchup === matchup);
    
    if (!goalieGame) return null;
    
    // Return the goalie for the specified team
    if (goalieGame.away.team === team) {
      return goalieGame.away.goalie;
    } else if (goalieGame.home.team === team) {
      return goalieGame.home.goalie;
    }
    
    return null;
  }

  /**
   * MARKET ENSEMBLE - Calculate Bayesian-optimal blend of model + market probabilities
   * 
   * Goal: Combine our model's prediction with market wisdom to filter out false positives
   * and improve overall ROI by betting only when we have high-confidence edges.
   * 
   * @param {number} modelProb - Our model's win probability (0-1)
   * @param {number} marketOdds - American odds (e.g., +150, -180)
   * @returns {object} Ensemble data with quality metrics
   */
  calculateEnsembleProbability(modelProb, marketOdds) {
    // Convert American odds to implied probability
    const marketProb = this.dataProcessor.oddsToProbability(marketOdds);
    
    // Bayesian ensemble: Weighted average
    // 65% our model (we trust it, but not blindly)
    // 35% market (sharp bettors move lines, they have info we don't)
    const ensembleProb = (modelProb * this.config.modelWeight) + 
                         (marketProb * this.config.marketWeight);
    
    // Calculate agreement (how much do we disagree with the market?)
    const agreement = Math.abs(modelProb - marketProb);
    
    // Calculate market edge using ensemble probability
    const marketEdge = ensembleProb - marketProb;
    
    // Calculate Expected Value (EV%) - matches MoneyPuck calibration logic
    const expectedValue = (ensembleProb / marketProb) - 1;
    const evPercent = expectedValue * 100;
    
    // ENSEMBLE-OPTIMIZED GRADING (Option B: Aggressive - matches MoneyPuck calibration)
    // Grade based on EV% to handle underdogs correctly
    let confidence, qualityGrade;
    if (evPercent >= 5.0) {
      qualityGrade = 'A+';
      confidence = 'VERY_HIGH';
    } else if (evPercent >= 3.5) {
      qualityGrade = 'A';
      confidence = 'HIGH';
    } else if (evPercent >= 2.5) {
      qualityGrade = 'B+';
      confidence = 'HIGH';
    } else if (evPercent >= 1.5) {
      qualityGrade = 'B';
      confidence = 'MEDIUM';
    } else {
      qualityGrade = 'C';
      confidence = 'LOW';
    }
    
    return {
      ensembleProb,      // Blended probability (use for EV calculation)
      modelProb,         // Our raw prediction
      marketProb,        // Market's opinion
      agreement,         // Absolute difference (quality metric)
      confidence,        // Human-readable confidence
      qualityGrade       // Letter grade (A-D)
    };
  }

  /**
   * MONEYPUCK CALIBRATION - Blend your model with MoneyPuck's established predictions
   * 
   * Strategy: Use MoneyPuck (proven model with years of data) as a reality check
   * to calibrate your model's predictions, then find market edges.
   * 
   * @param {number} yourModelProb - Your model's win probability (0-1)
   * @param {number} moneyPuckProb - MoneyPuck's win probability (0-1)
   * @param {number} marketOdds - American odds (e.g., +150, -180)
   * @returns {object} Calibrated data with quality metrics
   */
  calibrateWithMoneyPuck(yourModelProb, moneyPuckProb, marketOdds) {
    const marketProb = this.dataProcessor.oddsToProbability(marketOdds);
    
    // Calculate how much correction MoneyPuck provides
    const correction = Math.abs(yourModelProb - moneyPuckProb);
    
    // ALWAYS blend - MoneyPuck pulls your model towards reality
    // 70% MoneyPuck (established, trusted) + 30% your model (new, learning)
    const calibratedProb = 
      (yourModelProb * this.config.yourModelWeight) + 
      (moneyPuckProb * this.config.moneyPuckWeight);
    
    // Market edge using calibrated prediction
    const marketEdge = calibratedProb - marketProb;
    
    // Calculate Expected Value (EV%) - this is what users see in the UI
    const expectedValue = (calibratedProb / marketProb) - 1;
    const evPercent = expectedValue * 100;
    
    // ENSEMBLE-OPTIMIZED GRADING (Option B: Aggressive for MoneyPuck)
    // Grade based on EV% (accounts for odds differences correctly)
    // Lowered from raw model thresholds to account for MoneyPuck compression (~30-40%)
    let qualityGrade;
    if (evPercent >= 5.0) {
      qualityGrade = 'A+';     // ≥5% EV → ELITE (top 10-15% of bets)
    } else if (evPercent >= 3.5) {
      qualityGrade = 'A';      // ≥3.5% EV → EXCELLENT (top 25-35%)
    } else if (evPercent >= 2.5) {
      qualityGrade = 'B+';     // ≥2.5% EV → STRONG (good value)
    } else if (evPercent >= 1.5) {
      qualityGrade = 'B';      // ≥1.5% EV → GOOD (even slightly positive is trackable)
    } else {
      qualityGrade = 'C';      // <1.5% EV → Filtered out (not shown to users)
    }
    
    // Confidence based on how much correction was needed
    let confidence;
    if (correction < 0.03) {
      confidence = 'HIGH';     // Models already agreed - your model is calibrated
    } else if (correction < 0.06) {
      confidence = 'MEDIUM';   // Moderate correction needed
    } else {
      confidence = 'LOW';      // Large correction - your model was significantly off
    }
    
    return {
      calibratedProb: calibratedProb,      // Use this for EV calculation
      marketEdge: marketEdge,              // Edge vs market after calibration
      qualityGrade: qualityGrade,          // A/B/C/D based on market edge
      confidence: confidence,               // HIGH/MEDIUM/LOW based on correction
      
      // For transparency and learning
      yourModelProb: yourModelProb,        // Your raw prediction
      moneyPuckProb: moneyPuckProb,        // MoneyPuck's prediction
      marketProb: marketProb,              // Market's implied probability
      correction: correction,              // How much MoneyPuck corrected you
      
      // Backward compatibility aliases
      ensembleProb: calibratedProb,        // Alias for UI
      modelProb: calibratedProb,           // Use calibrated for display
      agreement: correction                 // "Correction" = "disagreement with MoneyPuck"
    };
  }

  /**
   * Find MoneyPuck prediction for a specific game
   * 
   * @param {string} awayTeam - Away team code (e.g., "TOR")
   * @param {string} homeTeam - Home team code (e.g., "BOS")
   * @returns {object|null} MoneyPuck prediction or null if not found
   */
  findMoneyPuckPrediction(awayTeam, homeTeam) {
    if (!this.moneyPuckPredictions || this.moneyPuckPredictions.length === 0) {
      return null;
    }
    
    return this.moneyPuckPredictions.find(pred => 
      pred.awayTeam === awayTeam && 
      pred.homeTeam === homeTeam
    );
  }

  /**
   * ENHANCED KELLY SIZING - Calculate optimal bet size with safety controls
   * 
   * Uses quarter-Kelly (25%) for conservative bankroll management.
   * 
   * @param {number} probability - Win probability (0-1)
   * @param {number} odds - American odds
   * @returns {object} Kelly sizing recommendations
   */
  calculateKellyStake(probability, odds) {
    // Convert American odds to decimal
    const decimalOdds = odds < 0 
      ? (100 / Math.abs(odds)) + 1
      : (odds / 100) + 1;
    
    // Kelly formula: f* = (p * b - q) / b
    // Where: p = win probability, q = 1-p, b = decimal odds - 1
    const b = decimalOdds - 1;
    const p = probability;
    const q = 1 - p;
    
    let fullKelly = (p * b - q) / b;
    
    // Apply fractional Kelly (25% for safety - reduces variance)
    let kelly = fullKelly * this.config.kellyFraction;
    
    // Cap at maximum (5% of bankroll per bet)
    kelly = Math.min(kelly, this.config.maxKelly);
    
    // Floor at 0 (never bet negative)
    kelly = Math.max(kelly, 0);
    
    return {
      fullKelly,                      // Raw Kelly (not recommended - too aggressive)
      fractionalKelly: kelly,         // Quarter Kelly (recommended)
      recommendedPercent: kelly * 100, // Display as percentage
      maxBet: this.config.maxKelly * 100
    };
  }

  // Calculate all edges for today's games
  calculateAllEdges() {
    return this.games.map(game => {
      try {
        // CRITICAL FIX: Calculate predicted scores ONCE with starting goalies
        // Then reuse them for all edge calculations
        const awayGoalie = this.getStartingGoalie(game.awayTeam, game);
        const homeGoalie = this.getStartingGoalie(game.homeTeam, game);
        
        const awayScore = this.dataProcessor.predictTeamScore(
          game.awayTeam, 
          game.homeTeam, 
          false,  // Away
          awayGoalie,
          game.date  // Enable B2B/rest adjustments
        );
        const homeScore = this.dataProcessor.predictTeamScore(
          game.homeTeam, 
          game.awayTeam, 
          true,   // Home
          homeGoalie,
          game.date  // Enable B2B/rest adjustments
        );
        
        return {
          game: `${game.awayTeam} @ ${game.homeTeam}`,
          gameTime: game.gameTime,
          awayTeam: game.awayTeam,
          homeTeam: game.homeTeam,
          date: game.date || getETDate(), // CRITICAL FIX: Use ET date for Firebase tracking
          startTimestamp: game.startTimestamp || null,
          goalies: {
            away: awayGoalie,
            home: homeGoalie
          },
          edges: {
            moneyline: this.calculateMoneylineEdge(game, awayScore, homeScore),
            puckLine: this.calculatePuckLineEdge(game, awayScore, homeScore)
            // TOTALS REMOVED: Focus on moneyline (64.7% win rate) and puck line
          },
          rawOdds: {
            moneyline: game.moneyline,
            puckLine: game.puckLine
            // TOTALS REMOVED: Not profitable with public data
          }
        };
      } catch (error) {
        console.error(`Error calculating edges for ${game.awayTeam} @ ${game.homeTeam}:`, error);
        return null;
      }
    }).filter(game => game !== null);
  }

  // Calculate moneyline edge
  // MONEYPUCK CALIBRATION: Use MoneyPuck to calibrate predictions, then find market edges
  calculateMoneylineEdge(game, awayScore, homeScore) {
    if (!game.moneyline.away || !game.moneyline.home) {
      return { away: null, home: null };
    }
    
    // Use Poisson distribution to calculate exact win probabilities
    const homeWinProb = this.dataProcessor.calculatePoissonWinProb(homeScore, awayScore);
    const awayWinProb = this.dataProcessor.calculatePoissonWinProb(awayScore, homeScore);
    
    // Find MoneyPuck prediction for this game
    const moneyPuckPrediction = this.findMoneyPuckPrediction(
      game.awayTeam, 
      game.homeTeam
    );
    
    // AWAY TEAM: Use MoneyPuck calibration if available
    let awayEnsemble;
    if (moneyPuckPrediction && this.config.useEnsemble) {
      // Use MoneyPuck calibration (blend your model with MoneyPuck)
      awayEnsemble = this.calibrateWithMoneyPuck(
        awayWinProb,
        moneyPuckPrediction.awayProb,
        game.moneyline.away
      );
      console.log(`🎯 ${game.awayTeam}: Your ${(awayWinProb * 100).toFixed(1)}% → MP ${(moneyPuckPrediction.awayProb * 100).toFixed(1)}% → Cal ${(awayEnsemble.calibratedProb * 100).toFixed(1)}%`);
    } else if (this.config.useEnsemble) {
      // Fallback: Use market-based ensemble (no MoneyPuck available)
      awayEnsemble = this.calculateEnsembleProbability(awayWinProb, game.moneyline.away);
      if (!moneyPuckPrediction) {
        console.warn(`⚠️ No MoneyPuck prediction for ${game.awayTeam} @ ${game.homeTeam} - using market ensemble`);
      }
    } else {
      // No ensemble - use raw model
      awayEnsemble = { 
        ensembleProb: awayWinProb, 
        modelProb: awayWinProb, 
        marketProb: this.dataProcessor.oddsToProbability(game.moneyline.away),
        agreement: Math.abs(awayWinProb - this.dataProcessor.oddsToProbability(game.moneyline.away)),
        confidence: 'UNKNOWN',
        qualityGrade: 'N/A'
      };
    }
    
    // HOME TEAM: Use MoneyPuck calibration if available
    let homeEnsemble;
    if (moneyPuckPrediction && this.config.useEnsemble) {
      // Use MoneyPuck calibration
      homeEnsemble = this.calibrateWithMoneyPuck(
        homeWinProb,
        moneyPuckPrediction.homeProb,
        game.moneyline.home
      );
      console.log(`🏠 ${game.homeTeam}: Your ${(homeWinProb * 100).toFixed(1)}% → MP ${(moneyPuckPrediction.homeProb * 100).toFixed(1)}% → Cal ${(homeEnsemble.calibratedProb * 100).toFixed(1)}%`);
    } else if (this.config.useEnsemble) {
      // Fallback: Use market-based ensemble
      homeEnsemble = this.calculateEnsembleProbability(homeWinProb, game.moneyline.home);
    } else {
      // No ensemble - use raw model
      homeEnsemble = { 
        ensembleProb: homeWinProb, 
        modelProb: homeWinProb, 
        marketProb: this.dataProcessor.oddsToProbability(game.moneyline.home),
        agreement: Math.abs(homeWinProb - this.dataProcessor.oddsToProbability(game.moneyline.home)),
        confidence: 'UNKNOWN',
        qualityGrade: 'N/A'
      };
    }
    
    // Calculate EV using ENSEMBLE probability (blended model + market)
    // This reduces false positives by incorporating market wisdom
    const awayEV = this.dataProcessor.calculateEV(awayEnsemble.ensembleProb, game.moneyline.away);
    const homeEV = this.dataProcessor.calculateEV(homeEnsemble.ensembleProb, game.moneyline.home);
    
    // Calculate Kelly stakes using ensemble probabilities
    const awayKelly = this.calculateKellyStake(awayEnsemble.ensembleProb, game.moneyline.away);
    const homeKelly = this.calculateKellyStake(homeEnsemble.ensembleProb, game.moneyline.home);
    
    return {
      away: {
        ev: awayEV,
        evPercent: awayEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: awayWinProb,
        marketProb: awayEnsemble.marketProb,
        ensembleProb: awayEnsemble.ensembleProb,      // NEW: Blended probability
        agreement: awayEnsemble.agreement,             // NEW: Quality metric
        confidence: awayEnsemble.confidence,           // NEW: Human-readable
        qualityGrade: awayEnsemble.qualityGrade,       // NEW: A-D grading
        kelly: awayKelly,
        recommendedUnit: awayKelly.fractionalKelly,    // NEW: Sizing recommendation
        odds: game.moneyline.away
      },
      home: {
        ev: homeEV,
        evPercent: homeEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: homeWinProb,
        marketProb: homeEnsemble.marketProb,
        ensembleProb: homeEnsemble.ensembleProb,      // NEW: Blended probability
        agreement: homeEnsemble.agreement,             // NEW: Quality metric
        confidence: homeEnsemble.confidence,           // NEW: Human-readable
        qualityGrade: homeEnsemble.qualityGrade,       // NEW: A-D grading
        kelly: homeKelly,
        recommendedUnit: homeKelly.fractionalKelly,    // NEW: Sizing recommendation
        odds: game.moneyline.home
      }
    };
  }

  // Calculate puck line edge
  calculatePuckLineEdge(game, awayScore, homeScore) {
    if (!game.puckLine.away.odds || !game.puckLine.home.odds) {
      return { away: null, home: null };
    }
    
    // Use pre-calculated scores
    const predictedDiff = homeScore - awayScore; // Positive if home wins by more
    
    // Estimate probability of covering spread
    // If spread is -1.5 for favorite, need to win by 2+
    const homeSpread = game.puckLine.home.spread || -1.5;
    const awaySpread = game.puckLine.away.spread || 1.5;
    
    // Simple model: if predicted diff > spread, higher probability of covering
    const homeCoverProb = predictedDiff > homeSpread ? 0.55 : 0.45;
    const awayCoverProb = 1 - homeCoverProb;
    
    // Calculate EV
    const awayEV = this.dataProcessor.calculateEV(awayCoverProb, game.puckLine.away.odds);
    const homeEV = this.dataProcessor.calculateEV(homeCoverProb, game.puckLine.home.odds);
    
    return {
      away: {
        ev: awayEV,
        evPercent: awayEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: awayCoverProb,
        spread: awaySpread,
        odds: game.puckLine.away.odds
      },
      home: {
        ev: homeEV,
        evPercent: homeEV,  // EV is already in dollars ($13.7 = 13.7% on $100 bet)
        modelProb: homeCoverProb,
        spread: homeSpread,
        odds: game.puckLine.home.odds
      }
    };
  }

  // ============================================================================
  // TOTALS BETTING REMOVED - October 31, 2025
  // ============================================================================
  // 
  // After exhaustive testing of 4 approaches (Ensemble, Adjuster, Amplification,
  // Bayesian), totals betting was determined to be UNPROFITABLE with public data.
  //
  // Our xG model agrees with Vegas within ±0.5 goals, providing no betting edge.
  // Vegas has access to sharp money flow and injury timing that we don't have.
  //
  // CURRENT PERFORMANCE:
  // - Moneyline: 64.7% win rate (ELITE - 52.4% break-even)
  // - Totals: ~52.4% win rate (break-even, not profitable)
  //
  // See BAYESIAN_TOTALS_FINAL_REPORT.md and TOTALS_BETTING_FINAL_SUMMARY.md
  // for full analysis and reasoning.
  //
  // REMOVED METHODS:
  // - calculateTotalEdge() - Calculated OVER/UNDER edges
  // - calculateTeamTotalEdges() - Calculated individual team totals
  //
  // FOCUS: Moneyline and Puck Line betting (where we have proven edge)
  // ============================================================================

  // Get top edges across all markets
  // MARKET ENSEMBLE: Apply quality filters to focus on high-confidence bets
  getTopEdges(minEV = 0, options = {}) {
    // Allow override of default config for testing
    const {
      maxAgreement = this.config.maxAgreement,    // 5% max disagreement
      minQuality = this.config.minQuality,         // Minimum quality grade
      useFilters = this.config.useEnsemble         // Enable quality filters
    } = options;
    
    const allEdges = this.calculateAllEdges();
    const opportunities = [];
    const gradeOrder = ['A+', 'A', 'B+', 'B', 'C', 'D', 'N/A'];  // Fixed: Added A+ and B+
    
    allEdges.forEach(gameEdges => {
      // Moneyline edges
      if (gameEdges.edges.moneyline.away && gameEdges.edges.moneyline.away.ev > minEV) {
        const edge = gameEdges.edges.moneyline.away;
        
        // QUALITY FILTER 1: Market agreement threshold (DISABLED when using MoneyPuck)
        // When MoneyPuck calibration is active, agreement filter is redundant
        // Quality grades (A+/A/B+/B) already account for reliability via EV%
        const hasMoneyPuck = this.moneyPuckPredictions && this.moneyPuckPredictions.length > 0;
        if (useFilters && !hasMoneyPuck && edge.agreement > maxAgreement) {
          console.log(`⚠️ Filtered ${gameEdges.awayTeam} AWAY: Agreement ${(edge.agreement * 100).toFixed(1)}% > ${(maxAgreement * 100).toFixed(0)}%`);
          return;
        }
        
        // QUALITY FILTER 2: Minimum quality grade (PRIMARY FILTER)
        if (useFilters && edge.qualityGrade && gradeOrder.indexOf(edge.qualityGrade) > gradeOrder.indexOf(minQuality)) {
          console.log(`⚠️ Filtered ${gameEdges.awayTeam} AWAY: Grade ${edge.qualityGrade} < ${minQuality}`);
          return;
        }
        
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'MONEYLINE',
          pick: `${gameEdges.awayTeam} (AWAY)`,
          team: gameEdges.awayTeam,
          odds: edge.odds,
          ev: edge.ev,
          evPercent: edge.evPercent,
          modelProb: edge.modelProb,
          marketProb: edge.marketProb,
          ensembleProb: edge.ensembleProb,         // NEW
          agreement: edge.agreement,                // NEW
          confidence: edge.confidence,              // NEW
          qualityGrade: edge.qualityGrade,          // NEW
          kelly: edge.kelly,
          recommendedUnit: edge.recommendedUnit     // NEW
        });
      }
      
      if (gameEdges.edges.moneyline.home && gameEdges.edges.moneyline.home.ev > minEV) {
        const edge = gameEdges.edges.moneyline.home;
        
        // QUALITY FILTER 1: Market agreement threshold (DISABLED when using MoneyPuck)
        // When MoneyPuck calibration is active, agreement filter is redundant
        // Quality grades (A+/A/B+/B) already account for reliability via EV%
        const hasMoneyPuck = this.moneyPuckPredictions && this.moneyPuckPredictions.length > 0;
        if (useFilters && !hasMoneyPuck && edge.agreement > maxAgreement) {
          console.log(`⚠️ Filtered ${gameEdges.homeTeam} HOME: Agreement ${(edge.agreement * 100).toFixed(1)}% > ${(maxAgreement * 100).toFixed(0)}%`);
          return;
        }
        
        // QUALITY FILTER 2: Minimum quality grade (PRIMARY FILTER)
        if (useFilters && edge.qualityGrade && gradeOrder.indexOf(edge.qualityGrade) > gradeOrder.indexOf(minQuality)) {
          console.log(`⚠️ Filtered ${gameEdges.homeTeam} HOME: Grade ${edge.qualityGrade} < ${minQuality}`);
          return;
        }
        
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'MONEYLINE',
          pick: `${gameEdges.homeTeam} (HOME)`,
          team: gameEdges.homeTeam,
          odds: edge.odds,
          ev: edge.ev,
          evPercent: edge.evPercent,
          modelProb: edge.modelProb,
          marketProb: edge.marketProb,
          ensembleProb: edge.ensembleProb,         // NEW
          agreement: edge.agreement,                // NEW
          confidence: edge.confidence,              // NEW
          qualityGrade: edge.qualityGrade,          // NEW
          kelly: edge.kelly,
          recommendedUnit: edge.recommendedUnit     // NEW
        });
      }
      
      // Puck line edges (no ensemble for now - would need separate implementation)
      if (gameEdges.edges.puckLine.away && gameEdges.edges.puckLine.away.ev > minEV) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'PUCK LINE',
          pick: `${gameEdges.awayTeam} ${gameEdges.edges.puckLine.away.spread > 0 ? '+' : ''}${gameEdges.edges.puckLine.away.spread}`,
          team: gameEdges.awayTeam,
          odds: gameEdges.edges.puckLine.away.odds,
          ev: gameEdges.edges.puckLine.away.ev,
          evPercent: gameEdges.edges.puckLine.away.evPercent,
          modelProb: gameEdges.edges.puckLine.away.modelProb,
          qualityGrade: 'N/A',  // No ensemble grading for puck line yet
          kelly: null,
          recommendedUnit: null
        });
      }
      
      if (gameEdges.edges.puckLine.home && gameEdges.edges.puckLine.home.ev > minEV) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'PUCK LINE',
          pick: `${gameEdges.homeTeam} ${gameEdges.edges.puckLine.home.spread > 0 ? '+' : ''}${gameEdges.edges.puckLine.home.spread}`,
          team: gameEdges.homeTeam,
          odds: gameEdges.edges.puckLine.home.odds,
          ev: gameEdges.edges.puckLine.home.ev,
          evPercent: gameEdges.edges.puckLine.home.evPercent,
          modelProb: gameEdges.edges.puckLine.home.modelProb,
          qualityGrade: 'N/A',  // No ensemble grading for puck line yet
          kelly: null,
          recommendedUnit: null
        });
      }
      
      // TOTALS EDGES REMOVED: Focus on moneyline and puck line only
    });
    
    // Sort by quality (A first) then by EV
    return opportunities.sort((a, b) => {
      // First sort by quality grade (A > B > C > D)
      const gradeCompare = gradeOrder.indexOf(a.qualityGrade || 'N/A') - 
                           gradeOrder.indexOf(b.qualityGrade || 'N/A');
      if (gradeCompare !== 0) return gradeCompare;
      
      // Then sort by EV (highest first)
      return b.evPercent - a.evPercent;
    });
  }
}

