import { NHLDataProcessor } from './dataProcessing.js';
import { GoalieProcessor } from './goalieProcessor.js';
import { getTeamCode } from './teamNameMapper.js';

/**
 * ModelBacktester - Validate prediction model on historical data
 * Calculates Brier score, RMSE, calibration curves, and more
 */
export class ModelBacktester {
  constructor(teamsData, goaliesData, gamesData, scheduleHelper = null) {
    // Initialize processors
    const goalieProcessor = new GoalieProcessor(goaliesData);
    this.dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor, scheduleHelper);
    this.games = gamesData;
    
    console.log(`📊 Backtester initialized with ${gamesData.length} games`);
    if (scheduleHelper) {
      console.log(`📅 Situational adjustments: ENABLED (B2B, rest, road trip fatigue, homecoming boost)`);
    } else {
      console.log(`📅 Situational adjustments: DISABLED (no schedule data)`);
    }
  }

  /**
   * Run complete backtest on all games
   * @param {boolean} withGoalie - Test with goalie adjustment (default: true)
   * @returns {Object} Complete metrics and analysis
   */
  async runBacktest(withGoalie = true) {
    console.log(`🏒 Starting backtest (${withGoalie ? 'WITH' : 'WITHOUT'} goalie adjustment)...`);
    
    const results = {
      predictions: [],
      actuals: [],
      errors: [],
      metadata: {
        withGoalie,
        startDate: null,
        endDate: null,
        totalGames: this.games.length
      }
    };

    let processedCount = 0;
    let errorCount = 0;

    for (const game of this.games) {
      try {
        // Skip if missing required data
        if (!game.home_team || !game.away_team || 
            game.home_score === undefined || game.away_score === undefined) {
          continue;
        }

        // Get model prediction
        // CRITICAL: Pass actual starting goalies for proper testing
        const prediction = this.predictGame(
          game.home_team, 
          game.away_team, 
          withGoalie,
          game.home_goalie || null,  // NEW: actual home goalie
          game.away_goalie || null,  // NEW: actual away goalie
          game.date || null          // NEW: game date for B2B/rest detection
        );

        // Store results
        results.predictions.push({
          date: game.date,
          homeTeam: game.home_team,
          awayTeam: game.away_team,
          predictedHomeScore: prediction.homeScore,
          predictedAwayScore: prediction.awayScore,
          predictedTotal: prediction.total,
          predictedHomeWinProb: prediction.homeWinProb,
          predictedAwayWinProb: prediction.awayWinProb
        });

        results.actuals.push({
          actualHomeScore: game.home_score,
          actualAwayScore: game.away_score,
          actualTotal: game.home_score + game.away_score,
          homeWon: game.home_score > game.away_score,
          awayWon: game.away_score > game.home_score,
          tie: game.home_score === game.away_score
        });

        // Track date range
        if (!results.metadata.startDate) results.metadata.startDate = game.date;
        results.metadata.endDate = game.date;

        processedCount++;
        
        // Progress logging
        if (processedCount % 100 === 0) {
          console.log(`   Processed ${processedCount}/${this.games.length} games...`);
        }

      } catch (error) {
        errorCount++;
        results.errors.push({
          game: `${game.away_team} @ ${game.home_team} (${game.date})`,
          error: error.message
        });
        
        // Log first few errors for debugging
        if (errorCount <= 5) {
          console.warn(`⚠️ Error on game ${game.away_team} @ ${game.home_team}:`, error.message);
        }
      }
    }

    console.log(`✅ Backtest complete: ${processedCount} games processed, ${errorCount} errors`);

    // Calculate all metrics
    const metrics = this.calculateMetrics(results);
    
    return {
      ...metrics,
      results,
      summary: {
        gamesProcessed: processedCount,
        errors: errorCount,
        errorRate: (errorCount / this.games.length * 100).toFixed(2) + '%'
      }
    };
  }

  /**
   * Predict a single game
   * @param {string} homeTeamCode - Home team abbreviation
   * @param {string} awayTeamCode - Away team abbreviation
   * @param {boolean} withGoalie - Include goalie adjustment
   * @param {string} homeGoalieName - Starting goalie for home team (optional)
   * @param {string} awayGoalieName - Starting goalie for away team (optional)
   * @returns {Object} Prediction with scores and win probability
   */
  predictGame(homeTeamCode, awayTeamCode, withGoalie = true, homeGoalieName = null, awayGoalieName = null, gameDate = null) {
    // Temporarily disable goalie if testing without
    const originalGoalieProcessor = this.dataProcessor.goalieProcessor;
    if (!withGoalie) {
      this.dataProcessor.goalieProcessor = null;
    }

    try {
      // Predict scores with actual starting goalies
      // CRITICAL FIX #1: Pass isHome flag to enable home ice advantage (5.8% boost)
      // CRITICAL FIX #2: Pass actual starting goalies for proper goalie integration
      // CRITICAL FIX #3: Pass gameDate to enable B2B/rest adjustments
      // NOTE: The 4th parameter is the OPPOSING team's goalie (the one being shot at)
      const homeScore = this.dataProcessor.predictTeamScore(
        homeTeamCode, 
        awayTeamCode, 
        true,           // isHome = true for home team
        awayGoalieName, // FIXED: Pass AWAY goalie (home team shoots at away goalie)
        gameDate        // FIXED: Pass gameDate for B2B/rest detection
      );
      const awayScore = this.dataProcessor.predictTeamScore(
        awayTeamCode, 
        homeTeamCode, 
        false,          // isHome = false for away team
        homeGoalieName, // FIXED: Pass HOME goalie (away team shoots at home goalie)
        gameDate        // FIXED: Pass gameDate for B2B/rest detection
      );
      const total = homeScore + awayScore;

      // Win probability
      const homeWinProb = this.dataProcessor.estimateWinProbability(
        homeTeamCode,
        awayTeamCode,
        true  // isHome
      );

      return {
        homeScore,
        awayScore,
        total,
        homeWinProb,
        awayWinProb: 1 - homeWinProb
      };
    } finally {
      // Restore goalie processor
      if (!withGoalie) {
        this.dataProcessor.goalieProcessor = originalGoalieProcessor;
      }
    }
  }

  /**
   * Calculate all metrics from results
   */
  calculateMetrics(results) {
    return {
      totalGames: results.predictions.length,
      dateRange: {
        start: results.metadata.startDate,
        end: results.metadata.endDate
      },
      
      // Win probability metrics
      winProbability: {
        brierScore: this.calculateBrierScore(results),
        calibrationCurve: this.calculateCalibration(results),
        accuracy: this.calculateWinProbAccuracy(results)
      },
      
      // Total goals metrics
      totalGoals: {
        rmse: this.calculateRMSE(results),
        mae: this.calculateMAE(results),
        avgError: this.calculateAvgError(results),
        byRange: this.calculateErrorByRange(results)
      },
      
      // Breakdown analyses
      byTeam: this.calculateByTeam(results),
      byMonth: this.calculateByMonth(results),
      
      // Baseline comparison
      baseline: this.compareToBaseline(results)
    };
  }

  /**
   * Calculate Brier Score (win probability calibration)
   * Lower is better. 0.25 = random, 0.20 = good, 0.15 = excellent
   */
  calculateBrierScore(results) {
    let sum = 0;
    for (let i = 0; i < results.predictions.length; i++) {
      const predicted = results.predictions[i].predictedHomeWinProb;
      const actual = results.actuals[i].homeWon ? 1 : 0;
      sum += Math.pow(predicted - actual, 2);
    }
    return sum / results.predictions.length;
  }

  /**
   * Calculate calibration curve (are X% predictions actually X%?)
   */
  calculateCalibration(results) {
    const bins = [];
    for (let i = 40; i <= 95; i += 5) {
      bins.push({
        min: i / 100,
        max: (i + 5) / 100,
        predictions: [],
        actuals: []
      });
    }

    // Bin predictions
    for (let i = 0; i < results.predictions.length; i++) {
      const prob = results.predictions[i].predictedHomeWinProb;
      const actual = results.actuals[i].homeWon ? 1 : 0;

      const bin = bins.find(b => prob >= b.min && prob < b.max);
      if (bin) {
        bin.predictions.push(prob);
        bin.actuals.push(actual);
      }
    }

    // Calculate stats per bin
    return bins
      .filter(bin => bin.predictions.length > 0)
      .map(bin => {
        const avgPredicted = bin.predictions.reduce((a, b) => a + b, 0) / bin.predictions.length;
        const avgActual = bin.actuals.reduce((a, b) => a + b, 0) / bin.actuals.length;
        const error = Math.abs(avgPredicted - avgActual);

        return {
          range: `${Math.round(bin.min * 100)}-${Math.round(bin.max * 100)}%`,
          count: bin.predictions.length,
          avgPredicted: (avgPredicted * 100).toFixed(1) + '%',
          avgActual: (avgActual * 100).toFixed(1) + '%',
          error: (error * 100).toFixed(2) + '%',
          errorValue: error
        };
      });
  }

  /**
   * Calculate win probability accuracy
   */
  calculateWinProbAccuracy(results) {
    let correct = 0;
    for (let i = 0; i < results.predictions.length; i++) {
      const predictedHomeWin = results.predictions[i].predictedHomeWinProb > 0.5;
      const actualHomeWin = results.actuals[i].homeWon;
      if (predictedHomeWin === actualHomeWin) correct++;
    }
    return {
      correct,
      total: results.predictions.length,
      percentage: ((correct / results.predictions.length) * 100).toFixed(2) + '%'
    };
  }

  /**
   * Calculate RMSE (Root Mean Square Error) for total goals
   * Target: < 1.8 goals
   */
  calculateRMSE(results) {
    let sum = 0;
    for (let i = 0; i < results.predictions.length; i++) {
      const predicted = results.predictions[i].predictedTotal;
      const actual = results.actuals[i].actualTotal;
      sum += Math.pow(predicted - actual, 2);
    }
    return Math.sqrt(sum / results.predictions.length);
  }

  /**
   * Calculate MAE (Mean Absolute Error) for total goals
   */
  calculateMAE(results) {
    let sum = 0;
    for (let i = 0; i < results.predictions.length; i++) {
      const predicted = results.predictions[i].predictedTotal;
      const actual = results.actuals[i].actualTotal;
      sum += Math.abs(predicted - actual);
    }
    return sum / results.predictions.length;
  }

  /**
   * Calculate average error (can be positive or negative)
   */
  calculateAvgError(results) {
    let sum = 0;
    for (let i = 0; i < results.predictions.length; i++) {
      const predicted = results.predictions[i].predictedTotal;
      const actual = results.actuals[i].actualTotal;
      sum += (predicted - actual);
    }
    return sum / results.predictions.length;
  }

  /**
   * Calculate error distribution by total goals range
   */
  calculateErrorByRange(results) {
    const ranges = [
      { min: 0, max: 5, name: '0-5 goals', predictions: [], actuals: [] },
      { min: 5, max: 6, name: '5-6 goals', predictions: [], actuals: [] },
      { min: 6, max: 7, name: '6-7 goals', predictions: [], actuals: [] },
      { min: 7, max: 10, name: '7+ goals', predictions: [], actuals: [] }
    ];

    for (let i = 0; i < results.predictions.length; i++) {
      const actual = results.actuals[i].actualTotal;
      const predicted = results.predictions[i].predictedTotal;

      const range = ranges.find(r => actual >= r.min && actual < r.max) || ranges[ranges.length - 1];
      range.predictions.push(predicted);
      range.actuals.push(actual);
    }

    return ranges
      .filter(r => r.actuals.length > 0)
      .map(r => ({
        range: r.name,
        games: r.actuals.length,
        avgActual: (r.actuals.reduce((a, b) => a + b, 0) / r.actuals.length).toFixed(2),
        avgPredicted: (r.predictions.reduce((a, b) => a + b, 0) / r.predictions.length).toFixed(2),
        rmse: Math.sqrt(
          r.predictions.reduce((sum, pred, i) => sum + Math.pow(pred - r.actuals[i], 2), 0) / r.actuals.length
        ).toFixed(2)
      }));
  }

  /**
   * Calculate metrics by team
   */
  calculateByTeam(results) {
    const teamStats = {};

    for (let i = 0; i < results.predictions.length; i++) {
      const homeTeam = results.predictions[i].homeTeam;
      const awayTeam = results.predictions[i].awayTeam;

      [homeTeam, awayTeam].forEach((team, idx) => {
        const isHome = idx === 0;
        
        if (!teamStats[team]) {
          teamStats[team] = {
            games: 0,
            errors: [],
            winProbErrors: []
          };
        }

        const predicted = isHome 
          ? results.predictions[i].predictedHomeScore 
          : results.predictions[i].predictedAwayScore;
        const actual = isHome 
          ? results.actuals[i].actualHomeScore 
          : results.actuals[i].actualAwayScore;

        teamStats[team].games++;
        teamStats[team].errors.push(predicted - actual);

        const probPredicted = isHome 
          ? results.predictions[i].predictedHomeWinProb 
          : results.predictions[i].predictedAwayWinProb;
        const probActual = isHome 
          ? (results.actuals[i].homeWon ? 1 : 0) 
          : (results.actuals[i].awayWon ? 1 : 0);
        teamStats[team].winProbErrors.push(Math.pow(probPredicted - probActual, 2));
      });
    }

    // Calculate summary stats
    return Object.entries(teamStats)
      .map(([team, stats]) => ({
        team,
        games: stats.games,
        avgError: (stats.errors.reduce((a, b) => a + b, 0) / stats.errors.length).toFixed(3),
        rmse: Math.sqrt(stats.errors.reduce((sum, e) => sum + e * e, 0) / stats.errors.length).toFixed(3),
        brierScore: (stats.winProbErrors.reduce((a, b) => a + b, 0) / stats.winProbErrors.length).toFixed(4)
      }))
      .sort((a, b) => parseFloat(a.rmse) - parseFloat(b.rmse));
  }

  /**
   * Calculate metrics by month
   */
  calculateByMonth(results) {
    const monthStats = {};

    for (let i = 0; i < results.predictions.length; i++) {
      const date = results.predictions[i].date;
      const month = date.substring(0, 7); // YYYY-MM

      if (!monthStats[month]) {
        monthStats[month] = {
          predictions: [],
          actuals: [],
          winProbErrors: []
        };
      }

      monthStats[month].predictions.push(results.predictions[i].predictedTotal);
      monthStats[month].actuals.push(results.actuals[i].actualTotal);

      const probError = Math.pow(
        results.predictions[i].predictedHomeWinProb - (results.actuals[i].homeWon ? 1 : 0),
        2
      );
      monthStats[month].winProbErrors.push(probError);
    }

    return Object.entries(monthStats)
      .map(([month, stats]) => ({
        month,
        games: stats.actuals.length,
        rmse: Math.sqrt(
          stats.predictions.reduce((sum, pred, i) => sum + Math.pow(pred - stats.actuals[i], 2), 0) / stats.actuals.length
        ).toFixed(3),
        brierScore: (stats.winProbErrors.reduce((a, b) => a + b, 0) / stats.winProbErrors.length).toFixed(4)
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Compare to baseline models
   */
  compareToBaseline(results) {
    // Baseline 1: Always predict 3.0 goals per team (6.0 total)
    let baselineRMSE_constant = 0;
    for (const actual of results.actuals) {
      baselineRMSE_constant += Math.pow(6.0 - actual.actualTotal, 2);
    }
    baselineRMSE_constant = Math.sqrt(baselineRMSE_constant / results.actuals.length);

    // Baseline 2: Always predict 50% win probability
    const baselineBrier_50 = 0.25; // By definition

    // Our model metrics
    const ourRMSE = this.calculateRMSE(results);
    const ourBrier = this.calculateBrierScore(results);

    return {
      constant6Goals: {
        rmse: baselineRMSE_constant.toFixed(3),
        improvement: (((baselineRMSE_constant - ourRMSE) / baselineRMSE_constant) * 100).toFixed(1) + '%'
      },
      alwaysFiftyPercent: {
        brierScore: baselineBrier_50.toFixed(4),
        improvement: (((baselineBrier_50 - ourBrier) / baselineBrier_50) * 100).toFixed(1) + '%'
      }
    };
  }
}

