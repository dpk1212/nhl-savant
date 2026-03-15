// Edge Calculator - Calculate betting edges across all markets
import { parseBothFiles } from './oddsTraderParser.js';

export class EdgeCalculator {
  constructor(dataProcessor, oddsFiles, startingGoalies = null, moneyPuckPredictions = null, config = {}, dratingsPredictions = null) {
    this.dataProcessor = dataProcessor;
    this.startingGoalies = startingGoalies;
    this.moneyPuckPredictions = moneyPuckPredictions; // PRIMARY (70% weight)
    this.dratingsPredictions = dratingsPredictions;    // SECONDARY (30% weight)
    
    // DRATINGS CALIBRATION CONFIG - December 2025
    // Use DRatings (established model) to calibrate your predictions
    this.config = {
      // Calibration weights (when DRatings available)
      yourModelWeight: config.yourModelWeight || 0.30,      // 30% your model (new, learning)
      dratingsWeight: config.dratingsWeight || 0.70,        // 70% DRatings (established, trusted)
      
      // Fallback ensemble (when MoneyPuck unavailable)
      modelWeight: config.modelWeight || 0.65,              // 65% model vs market
      marketWeight: config.marketWeight || 0.35,            // 35% market
      
      // Filtering thresholds
      maxAgreement: config.maxAgreement || 0.05,            // 5% max disagreement (legacy)
      minEV: config.minEV || 0.015,                         // 1.5% minimum EV threshold (lowered for sharper model)
      minQuality: config.minQuality || 'B+',                // Minimum quality grade (B+ or higher - B-rated bets excluded)
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
    
    // ENSEMBLE-OPTIMIZED GRADING (Aggressive - DRatings + MoneyPuck sharper model)
    // Grade based on EV% to handle underdogs correctly
    // Lowered thresholds to capture more opportunities with sharper model
    let confidence, qualityGrade;
    if (evPercent >= 5.0) {
      qualityGrade = 'A+';
      confidence = 'VERY_HIGH';
    } else if (evPercent >= 3.5) {
      qualityGrade = 'A';
      confidence = 'HIGH';
    } else if (evPercent >= 1.5) {
      qualityGrade = 'B+';
      confidence = 'HIGH';
    } else if (evPercent >= 0.5) {
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
   * MONEYPUCK + DRATINGS ENSEMBLE - Blend two established prediction models
   * 
   * Strategy: Use MoneyPuck (70%) and DRatings (30%) - both proven models with years of data
   * This removes dependency on our xG model and uses only external, validated sources
   * 
   * @param {number} moneyPuckProb - MoneyPuck's win probability (0-1)
   * @param {number} dratingsProb - DRatings' win probability (0-1)
   * @param {number} marketOdds - American odds (e.g., +150, -180)
   * @returns {object} Calibrated data with quality metrics
   */
  calibrateWithDRatings(moneyPuckProb, dratingsProb, marketOdds) {
    const marketProb = this.dataProcessor.oddsToProbability(marketOdds);
    
    // Calculate how much the two models disagree
    const correction = Math.abs(moneyPuckProb - dratingsProb);
    
    // ENSEMBLE: 70% MoneyPuck + 30% DRatings
    // MoneyPuck gets higher weight as it's more granular and updates more frequently
    const calibratedProb = 
      (moneyPuckProb * 0.70) + 
      (dratingsProb * 0.30);
    
    // Market edge using calibrated prediction
    const marketEdge = calibratedProb - marketProb;
    
    // Calculate Expected Value (EV%) - this is what users see in the UI
    const expectedValue = (calibratedProb / marketProb) - 1;
    const evPercent = expectedValue * 100;
    
    // ENSEMBLE-OPTIMIZED GRADING (Option B: Aggressive for DRatings)
    // Grade based on EV% (accounts for odds differences correctly)
    // Lowered from raw model thresholds to account for DRatings compression (~30-40%)
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
      yourModelProb: moneyPuckProb,        // MoneyPuck prediction (70% weight)
      moneyPuckProb: moneyPuckProb,        // MoneyPuck probability (for isPreliminary flag)
      dratingsProb: dratingsProb,          // DRatings' prediction (30% weight)
      marketProb: marketProb,              // Market's implied probability
      correction: correction,              // How much the models disagreed
      
      // Backward compatibility aliases
      ensembleProb: calibratedProb,        // Alias for UI
      modelProb: calibratedProb,           // Use calibrated for display
      agreement: correction                 // "Correction" = "disagreement with DRatings"
    };
  }

  /**
   * Find DRatings prediction for a specific game
   * 
   * @param {string} awayTeam - Away team code (e.g., "TOR")
   * @param {string} homeTeam - Home team code (e.g., "BOS")
   * @returns {object|null} DRatings prediction or null if not found
   */
  findDRatingsPrediction(awayTeam, homeTeam) {
    if (!this.dratingsPredictions || !this.dratingsPredictions.predictions || this.dratingsPredictions.predictions.length === 0) {
      return null;
    }
    
    return this.dratingsPredictions.predictions.find(pred => 
      pred.awayTeam === awayTeam && 
      pred.homeTeam === homeTeam
    );
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
  // DRATINGS CALIBRATION: Use DRatings to calibrate predictions, then find market edges
  calculateMoneylineEdge(game, awayScore, homeScore) {
    const hasOdds = game.moneyline.away && game.moneyline.home;

    if (!hasOdds) {
      // No odds yet -- still surface blended model probabilities so the UI
      // can show win percentages even before sportsbooks post lines.
      const mp = this.findMoneyPuckPrediction(game.awayTeam, game.homeTeam);
      const dr = this.findDRatingsPrediction(game.awayTeam, game.homeTeam);
      if (mp || dr) {
        const awayProb = mp && dr ? mp.awayProb * 0.7 + dr.awayProb * 0.3
                       : (mp?.awayProb || dr?.awayProb);
        const homeProb = mp && dr ? mp.homeProb * 0.7 + dr.homeProb * 0.3
                       : (mp?.homeProb || dr?.homeProb);
        return {
          away: { modelProb: awayProb, ensembleProb: awayProb, confidence: 'PRE-ODDS', qualityGrade: 'N/A' },
          home: { modelProb: homeProb, ensembleProb: homeProb, confidence: 'PRE-ODDS', qualityGrade: 'N/A' },
        };
      }
      return { away: null, home: null };
    }
    
    // Find MoneyPuck and DRatings predictions for this game
    const moneyPuckPrediction = this.findMoneyPuckPrediction(
      game.awayTeam, 
      game.homeTeam
    );
    const dratingsPrediction = this.findDRatingsPrediction(
      game.awayTeam, 
      game.homeTeam
    );

    // Use consensus (Pinnacle/median) odds for market calibration when available,
    // but best available odds for EV calculation (line shopping)
    const calibAwayOdds = game.consensus?.away || game.moneyline.away;
    const calibHomeOdds = game.consensus?.home || game.moneyline.home;
    
    // AWAY TEAM: Use 70% MoneyPuck + 30% DRatings if both available
    let awayEnsemble;
    if (moneyPuckPrediction && dratingsPrediction && this.config.useEnsemble) {
      awayEnsemble = this.calibrateWithDRatings(
        moneyPuckPrediction.awayProb,
        dratingsPrediction.awayProb,
        calibAwayOdds
      );
      console.log(`🎯 ${game.awayTeam}: MP ${(moneyPuckPrediction.awayProb * 100).toFixed(1)}% + DR ${(dratingsPrediction.awayProb * 100).toFixed(1)}% → ${(awayEnsemble.calibratedProb * 100).toFixed(1)}%`);
    } else if (moneyPuckPrediction && this.config.useEnsemble) {
      const prob = moneyPuckPrediction.awayProb;
      console.log(`🎯 ${game.awayTeam}: MP-only ${(prob * 100).toFixed(1)}% (DRatings unavailable)`);
      awayEnsemble = this.calibrateWithDRatings(prob, prob, calibAwayOdds);
    } else if (dratingsPrediction && this.config.useEnsemble) {
      const prob = dratingsPrediction.awayProb;
      console.log(`🎯 ${game.awayTeam}: DR-only ${(prob * 100).toFixed(1)}% (MoneyPuck unavailable)`);
      awayEnsemble = this.calibrateWithDRatings(prob, prob, calibAwayOdds);
    } else if (this.config.useEnsemble) {
      console.warn(`⚠️ Missing ALL predictions for ${game.awayTeam} @ ${game.homeTeam}`);
      awayEnsemble = { 
        ensembleProb: 0.50, 
        modelProb: 0.50, 
        marketProb: this.dataProcessor.oddsToProbability(calibAwayOdds),
        agreement: 1.0,
        confidence: 'NONE',
        qualityGrade: 'N/A'
      };
    } else {
      awayEnsemble = { 
        ensembleProb: awayWinProb, 
        modelProb: awayWinProb, 
        marketProb: this.dataProcessor.oddsToProbability(calibAwayOdds),
        agreement: Math.abs(awayWinProb - this.dataProcessor.oddsToProbability(calibAwayOdds)),
        confidence: 'UNKNOWN',
        qualityGrade: 'N/A'
      };
    }
    
    // HOME TEAM: Use 70% MoneyPuck + 30% DRatings if both available
    let homeEnsemble;
    if (moneyPuckPrediction && dratingsPrediction && this.config.useEnsemble) {
      homeEnsemble = this.calibrateWithDRatings(
        moneyPuckPrediction.homeProb,
        dratingsPrediction.homeProb,
        calibHomeOdds
      );
      console.log(`🏠 ${game.homeTeam}: MP ${(moneyPuckPrediction.homeProb * 100).toFixed(1)}% + DR ${(dratingsPrediction.homeProb * 100).toFixed(1)}% → ${(homeEnsemble.calibratedProb * 100).toFixed(1)}%`);
    } else if (moneyPuckPrediction && this.config.useEnsemble) {
      const prob = moneyPuckPrediction.homeProb;
      console.log(`🏠 ${game.homeTeam}: MP-only ${(prob * 100).toFixed(1)}% (DRatings unavailable)`);
      homeEnsemble = this.calibrateWithDRatings(prob, prob, calibHomeOdds);
    } else if (dratingsPrediction && this.config.useEnsemble) {
      const prob = dratingsPrediction.homeProb;
      console.log(`🏠 ${game.homeTeam}: DR-only ${(prob * 100).toFixed(1)}% (MoneyPuck unavailable)`);
      homeEnsemble = this.calibrateWithDRatings(prob, prob, calibHomeOdds);
    } else if (this.config.useEnsemble) {
      homeEnsemble = { 
        ensembleProb: 0.50, 
        modelProb: 0.50, 
        marketProb: this.dataProcessor.oddsToProbability(calibHomeOdds),
        agreement: 1.0,
        confidence: 'NONE',
        qualityGrade: 'N/A'
      };
    } else {
      homeEnsemble = { 
        ensembleProb: homeWinProb, 
        modelProb: homeWinProb, 
        marketProb: this.dataProcessor.oddsToProbability(calibHomeOdds),
        agreement: Math.abs(homeWinProb - this.dataProcessor.oddsToProbability(calibHomeOdds)),
        confidence: 'UNKNOWN',
        qualityGrade: 'N/A'
      };
    }
    
    // EV calculated against BEST available odds (line shopping)
    // Calibration used consensus/Pinnacle for true market probability above
    const awayEV = this.dataProcessor.calculateEV(awayEnsemble.ensembleProb, game.moneyline.away);
    const homeEV = this.dataProcessor.calculateEV(homeEnsemble.ensembleProb, game.moneyline.home);
    
    // Kelly stakes against best available odds
    const awayKelly = this.calculateKellyStake(awayEnsemble.ensembleProb, game.moneyline.away);
    const homeKelly = this.calculateKellyStake(homeEnsemble.ensembleProb, game.moneyline.home);
    
    return {
      away: {
        ev: awayEV,
        evPercent: awayEV,
        modelProb: awayEnsemble.calibratedProb || awayEnsemble.ensembleProb || awayWinProb,
        marketProb: awayEnsemble.marketProb,
        ensembleProb: awayEnsemble.ensembleProb,
        agreement: awayEnsemble.agreement,
        confidence: awayEnsemble.confidence,
        qualityGrade: awayEnsemble.qualityGrade,
        kelly: awayKelly,
        recommendedUnit: awayKelly.fractionalKelly,
        moneyPuckProb: awayEnsemble.moneyPuckProb || null,
        calibratedProb: awayEnsemble.calibratedProb || null,
        odds: game.moneyline.away,
        bestBook: game.bestBooks?.away || null,
        consensusOdds: calibAwayOdds
      },
      home: {
        ev: homeEV,
        evPercent: homeEV,
        modelProb: homeEnsemble.calibratedProb || homeEnsemble.ensembleProb || homeWinProb,
        marketProb: homeEnsemble.marketProb,
        ensembleProb: homeEnsemble.ensembleProb,
        agreement: homeEnsemble.agreement,
        confidence: homeEnsemble.confidence,
        qualityGrade: homeEnsemble.qualityGrade,
        kelly: homeKelly,
        recommendedUnit: homeKelly.fractionalKelly,
        moneyPuckProb: homeEnsemble.moneyPuckProb || null,
        calibratedProb: homeEnsemble.calibratedProb || null,
        odds: game.moneyline.home,
        bestBook: game.bestBooks?.home || null,
        consensusOdds: calibHomeOdds
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
      // Moneyline edges — only emit the BETTER side per game
      const awayML = gameEdges.edges.moneyline.away;
      const homeML = gameEdges.edges.moneyline.home;
      const awayOK = awayML && awayML.ev > minEV && !(useFilters && awayML.qualityGrade && gradeOrder.indexOf(awayML.qualityGrade) > gradeOrder.indexOf(minQuality));
      const homeOK = homeML && homeML.ev > minEV && !(useFilters && homeML.qualityGrade && gradeOrder.indexOf(homeML.qualityGrade) > gradeOrder.indexOf(minQuality));

      let mlEdge = null, mlTeam = null, mlSide = null;
      if (awayOK && homeOK) {
        if (awayML.evPercent >= homeML.evPercent) {
          mlEdge = awayML; mlTeam = gameEdges.awayTeam; mlSide = 'AWAY';
        } else {
          mlEdge = homeML; mlTeam = gameEdges.homeTeam; mlSide = 'HOME';
        }
      } else if (awayOK) {
        mlEdge = awayML; mlTeam = gameEdges.awayTeam; mlSide = 'AWAY';
      } else if (homeOK) {
        mlEdge = homeML; mlTeam = gameEdges.homeTeam; mlSide = 'HOME';
      }

      if (mlEdge) {
        opportunities.push({
          game: gameEdges.game,
          gameTime: gameEdges.gameTime,
          market: 'MONEYLINE',
          pick: `${mlTeam} (${mlSide})`,
          team: mlTeam,
          odds: mlEdge.odds,
          bestBook: mlEdge.bestBook,
          consensusOdds: mlEdge.consensusOdds,
          ev: mlEdge.ev,
          evPercent: mlEdge.evPercent,
          modelProb: mlEdge.modelProb,
          marketProb: mlEdge.marketProb,
          ensembleProb: mlEdge.ensembleProb,
          agreement: mlEdge.agreement,
          confidence: mlEdge.confidence,
          qualityGrade: mlEdge.qualityGrade,
          kelly: mlEdge.kelly,
          recommendedUnit: mlEdge.recommendedUnit,
          moneyPuckProb: mlEdge.moneyPuckProb,
          calibratedProb: mlEdge.calibratedProb,
          isPreliminary: !mlEdge.moneyPuckProb
        });
      }
      
      // Puck line edges
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

