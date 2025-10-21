import Papa from 'papaparse';

// Core mathematical calculations for NHL betting model
export class NHLDataProcessor {
  constructor(rawData, goalieProcessor = null) {
    this.rawData = rawData;
    this.goalieProcessor = goalieProcessor; // NEW: Goalie data integration
    this.processedData = this.processAllTeams();
  }

  // Calculate per-60 rate statistics
  calculatePer60Rate(value, iceTime) {
    if (!iceTime || iceTime === 0) return 0;
    return (value / iceTime) * 3600;
  }

  // Calculate PDO (Puck Luck indicator)
  calculatePDO(goalsFor, shotsFor, goalsAgainst, shotsAgainst) {
    if (!shotsFor || !shotsAgainst || shotsFor === 0 || shotsAgainst === 0) return 100;
    const shootingPct = (goalsFor / shotsFor) * 100;
    const savePct = (1 - (goalsAgainst / shotsAgainst)) * 100;
    return shootingPct + savePct;
  }

  // Calculate shooting efficiency (regression indicator)
  calculateShootingEfficiency(goalsFor, xGoalsFor) {
    if (!xGoalsFor || xGoalsFor === 0) return 1;
    return goalsFor / xGoalsFor;
  }

  // Calculate save performance
  calculateSavePerformance(goalsAgainst, xGoalsAgainst) {
    if (!xGoalsAgainst || xGoalsAgainst === 0) return 0;
    return 1 - (goalsAgainst / xGoalsAgainst);
  }

  // Calculate xG differential per 60
  calculateXGDiffPer60(xGF, xGA, iceTime) {
    const xGFPer60 = this.calculatePer60Rate(xGF, iceTime);
    const xGAPer60 = this.calculatePer60Rate(xGA, iceTime);
    return xGFPer60 - xGAPer60;
  }

  // Calculate regression score (key betting metric)
  calculateRegressionScore(team) {
    const safeGet = (value, defaultValue = 0) => {
      if (value === null || value === undefined || isNaN(value)) return defaultValue;
      return parseFloat(value);
    };
    
    const shootingEff = this.calculateShootingEfficiency(safeGet(team.goalsFor), safeGet(team.xGoalsFor));
    const savePerf = this.calculateSavePerformance(safeGet(team.goalsAgainst), safeGet(team.xGoalsAgainst));
    const pdo = this.calculatePDO(safeGet(team.goalsFor), safeGet(team.shotsOnGoalFor), safeGet(team.goalsAgainst), safeGet(team.shotsOnGoalAgainst));
    
    // Higher score = more regression expected
    let score = 0;
    
    // Shooting efficiency deviation
    if (shootingEff > 1.1) score += (shootingEff - 1.0) * 20; // Overperforming
    if (shootingEff < 0.9) score -= (1.0 - shootingEff) * 20; // Underperforming
    
    // PDO deviation
    if (pdo > 102) score += (pdo - 100) * 2; // Lucky
    if (pdo < 98) score -= (100 - pdo) * 2; // Unlucky
    
    return score;
  }

  // Process individual team data
  processTeamData(team) {
    const processed = { ...team };
    
    // Ensure we have valid numeric values
    const safeGet = (value, defaultValue = 0) => {
      if (value === null || value === undefined || isNaN(value)) return defaultValue;
      return parseFloat(value);
    };
    
    // FIX: Map CSV field name to camelCase for consistency
    processed.gamesPlayed = safeGet(team.games_played, 20);
    
    // Per-60 rates
    processed.xGF_per60 = this.calculatePer60Rate(safeGet(team.xGoalsFor), safeGet(team.iceTime));
    processed.xGA_per60 = this.calculatePer60Rate(safeGet(team.xGoalsAgainst), safeGet(team.iceTime));
    processed.corsi_per60 = this.calculatePer60Rate(safeGet(team.shotAttemptsFor), safeGet(team.iceTime));
    processed.fenwick_per60 = this.calculatePer60Rate(safeGet(team.unblockedShotAttemptsFor), safeGet(team.iceTime));
    
    // High danger per-60
    processed.highDanger_xGF_per60 = this.calculatePer60Rate(safeGet(team.highDangerxGoalsFor), safeGet(team.iceTime));
    processed.highDanger_xGA_per60 = this.calculatePer60Rate(safeGet(team.highDangerxGoalsAgainst), safeGet(team.iceTime));
    
    // Score adjusted per-60 (AUDIT IMPROVEMENT: Better than raw xG)
    processed.scoreAdj_xGF_per60 = this.calculatePer60Rate(safeGet(team.scoreVenueAdjustedxGoalsFor), safeGet(team.iceTime));
    processed.scoreAdj_xGA_per60 = this.calculatePer60Rate(safeGet(team.scoreVenueAdjustedxGoalsAgainst), safeGet(team.iceTime));
    
    // Special teams per-60 (situational)
    if (team.situation === '5on4') {
      processed.pp_efficiency = this.calculatePer60Rate(safeGet(team.xGoalsFor), safeGet(team.iceTime));
    }
    if (team.situation === '4on5') {
      processed.pk_efficiency = this.calculatePer60Rate(safeGet(team.xGoalsAgainst), safeGet(team.iceTime));
    }
    
    // Key metrics
    processed.pdo = this.calculatePDO(safeGet(team.goalsFor), safeGet(team.shotsOnGoalFor), safeGet(team.goalsAgainst), safeGet(team.shotsOnGoalAgainst));
    processed.shooting_efficiency = this.calculateShootingEfficiency(safeGet(team.goalsFor), safeGet(team.xGoalsFor));
    processed.save_performance = this.calculateSavePerformance(safeGet(team.goalsAgainst), safeGet(team.xGoalsAgainst));
    processed.xGD_per60 = this.calculateXGDiffPer60(safeGet(team.xGoalsFor), safeGet(team.xGoalsAgainst), safeGet(team.iceTime));
    
    // Regression score
    processed.regression_score = this.calculateRegressionScore(team);
    
    // Situational weighting for predictions
    processed.situational_weight = this.getSituationalWeight(team.situation);
    
    return processed;
  }

  // Get situational weight for prediction model
  getSituationalWeight(situation) {
    const weights = {
      '5on5': 0.77,
      '5on4': 0.12,
      '4on5': 0.11,
      'all': 1.0,
      'other': 0.0
    };
    return weights[situation] || 0.0;
  }

  // NEW: Calculate dynamic situational weights based on team penalty minutes
  // More accurate than static 77/12/11 split
  calculateDynamicSituationalWeights(team, opponent) {
    const teamData = this.getTeamData(team, 'all');
    const oppData = this.getTeamData(opponent, 'all');
    
    if (!teamData || !oppData) {
      // Fallback to static weights if data unavailable
      return { '5on5': 0.77, '5on4': 0.12, '4on5': 0.11 };
    }
    
    // Get actual penalty minutes (available in CSV)
    const teamPenMin = parseFloat(teamData.penalityMinutesFor) || 0;
    const oppPenMin = parseFloat(oppData.penalityMinutesFor) || 0;
    const gamesPlayed = parseFloat(teamData.games_played) || 1;
    
    // Convert to expected minutes per game
    const teamPenMinPerGame = teamPenMin / gamesPlayed;
    const oppPenMinPerGame = oppPenMin / gamesPlayed;
    
    // Team's PP time = opponent's penalties
    const expectedPPMin = oppPenMinPerGame;
    // Team's PK time = team's penalties  
    const expectedPKMin = teamPenMinPerGame;
    
    // Normalize to percentages (assuming 60 min game)
    const ppPct = expectedPPMin / 60;
    const pkPct = expectedPKMin / 60;
    const evenPct = 1 - ppPct - pkPct;
    
    return {
      '5on5': Math.max(0.6, Math.min(0.85, evenPct)),  // Clamp between 60-85%
      '5on4': Math.max(0.05, Math.min(0.20, ppPct)),   // Clamp between 5-20%
      '4on5': Math.max(0.05, Math.min(0.20, pkPct))    // Clamp between 5-20%
    };
  }

  // Process all teams
  processAllTeams() {
    return this.rawData.map(team => this.processTeamData(team));
  }

  // Get teams by situation
  getTeamsBySituation(situation) {
    return this.processedData.filter(team => team.situation === situation);
  }

  // Get team by name and situation
  getTeamData(teamName, situation = 'all') {
    return this.processedData.find(team => 
      team.team === teamName && team.situation === situation
    );
  }

  // NEW: Calculate league-average xGF from loaded data
  // Used for strength ratio calculations
  calculateLeagueAverage() {
    const all_teams = this.getTeamsBySituation('5on5');
    if (!all_teams || all_teams.length === 0) return 2.45; // Default fallback
    
    // CONSULTANT FIX: Calculate dynamic calibration factor from actual goals vs xG
    // xG models systematically underestimate actual scoring by ~21.5%
    let total_actual_goals = 0;
    let total_xG = 0;
    
    all_teams.forEach(t => {
      total_actual_goals += (t.goalsFor || 0);
      total_xG += (t.scoreVenueAdjustedxGoalsFor || t.xGoalsFor || 0);
    });
    
    // Calculate calibration factor (actual goals / xG)
    // This auto-adjusts as season progresses
    const calibration = total_xG > 0 ? total_actual_goals / total_xG : 1.215;
    
    // Calculate base xGF/60 average
    const xGF_values = all_teams.map(t => t.xGF_per60).filter(v => v && v > 0);
    if (xGF_values.length === 0) return 2.45;
    
    const baseAverage = xGF_values.reduce((sum, val) => sum + val, 0) / xGF_values.length;
    
    // Apply dynamic calibration (replaces old 1.03 fixed boost)
    const calibrated = baseAverage * calibration;
    
    console.log(`📊 League avg: base=${baseAverage.toFixed(2)} xGF/60, cal=${calibration.toFixed(3)}, result=${calibrated.toFixed(2)} goals/60`);
    
    return calibrated;
  }

  // CONSULTANT FIX: Reduce over-aggressive regression
  // Markets use 30-40% regression after 5 games, not 70%
  // Our previous 65-70% erased real team skill differences
  calculateRegressionWeight(gamesPlayed) {
    if (!gamesPlayed || gamesPlayed < 0) return 0.50; // Reduced from 0.70
    
    // VERY early season (0-5 games): 50% regression
    // Trust half actual data, half league average
    // Reduced from 70% per consultant recommendation
    if (gamesPlayed < 5) return 0.50;
    
    // Early season (5-10 games): 40% regression
    // Allow team skill differences to show through
    // Reduced from 65% per consultant recommendation
    if (gamesPlayed < 10) return 0.40;
    
    // Building sample (10-20 games): 30% regression
    // Matches betting market regression rates
    // Reduced from 45% per consultant recommendation
    if (gamesPlayed < 20) return 0.30;
    
    // Mid season (20-40 games): 20% regression
    // Good sample size, mostly trust the data
    if (gamesPlayed < 40) return 0.20;
    
    // Late season (40+ games): 10% regression
    // Strong sample, light regression to avoid outliers
    // Reduced from 15% per consultant recommendation
    return 0.10;
  }

  // NEW: Apply regression to mean based on sample size
  // This is CRITICAL for accurate early-season predictions
  applyRegressionToMean(teamStat, leagueAvg, gamesPlayed) {
    if (!teamStat || teamStat === 0) return leagueAvg;
    
    const regressionWeight = this.calculateRegressionWeight(gamesPlayed);
    
    // Weighted average: (team_stat × (1 - weight)) + (league_avg × weight)
    // Early season: mostly league average
    // Late season: mostly team's actual performance
    return (teamStat * (1 - regressionWeight)) + (leagueAvg * regressionWeight);
  }

  // NEW: Get team shooting talent (actual goals vs xG)
  // Elite finishers score more than xG suggests, weak finishers less
  getShootingTalent(team) {
    const team_5v5 = this.getTeamData(team, '5on5');
    if (!team_5v5 || !team_5v5.goalsFor || !team_5v5.xGoalsFor) return 1.00;
    
    const shooting_pct = team_5v5.goalsFor / team_5v5.xGoalsFor;
    
    // Only adjust extreme outliers
    if (shooting_pct > 1.08) return 1.03;  // Elite finishers (+3%)
    if (shooting_pct < 0.92) return 0.97;  // Weak finishers (-3%)
    return 1.00;  // Average finishers
  }

  // Calculate expected goals for a team (prediction model)
  calculateExpectedGoals(teamName, opponentName) {
    const team5v5 = this.getTeamData(teamName, '5on5');
    const teamPP = this.getTeamData(teamName, '5on4');
    const opponentPK = this.getTeamData(opponentName, '4on5');
    
    if (!team5v5) return 0;
    
    // Base 5v5 expected goals
    let expectedGoals = team5v5.xGF_per60 * 0.77;
    
    // Add power play component if data available
    if (teamPP && opponentPK) {
      const ppAdvantage = (teamPP.pp_efficiency - opponentPK.pk_efficiency) * 0.12;
      expectedGoals += ppAdvantage;
    }
    
    return Math.max(0, expectedGoals);
  }

  // Predict game total using blueprint formula (Part 2.1)
  // Uses predictTeamScore for each team to ensure consistency
  predictGameTotal(teamA, teamB) {
    const teamAScore = this.predictTeamScore(teamA, teamB);
    const teamBScore = this.predictTeamScore(teamB, teamA);
    
    return teamAScore + teamBScore;
  }

  // Predict individual team score (Part 2.2)
  // PHASE 5: Industry-standard approach with sample-size regression
  predictTeamScore(team, opponent, isHome = false, startingGoalie = null) {
    const team_5v5 = this.getTeamData(team, '5on5');
    const opponent_5v5 = this.getTeamData(opponent, '5on5');
    const team_PP = this.getTeamData(team, '5on4');
    const opponent_PK = this.getTeamData(opponent, '4on5');
    
    if (!team_5v5 || !opponent_5v5) return 0;
    
    // Get league average and games played
    const league_avg = this.calculateLeagueAverage();
    const gamesPlayed = team_5v5.gamesPlayed || 82;
    const opp_gamesPlayed = opponent_5v5.gamesPlayed || 82;
    
    // STEP 1: Get score-adjusted xG (best predictor)
    const team_xGF_raw = team_5v5.scoreAdj_xGF_per60 || team_5v5.xGF_per60;
    const opp_xGA_raw = opponent_5v5.scoreAdj_xGA_per60 || opponent_5v5.xGA_per60;
    
    // STEP 2: Apply sample-size based regression (CRITICAL!)
    // Early season: regress heavily to league average
    // Late season: trust team's actual performance
    const team_xGF_regressed = this.applyRegressionToMean(team_xGF_raw, league_avg, gamesPlayed);
    const opp_xGA_regressed = this.applyRegressionToMean(opp_xGA_raw, league_avg, opp_gamesPlayed);
    
    // STEP 3: Apply PDO regression (secondary adjustment for extreme outliers)
    const team_PDO = this.calculatePDO(
      team_5v5.goalsFor, 
      team_5v5.shotsOnGoalFor, 
      team_5v5.goalsAgainst, 
      team_5v5.shotsOnGoalAgainst
    );
    const opp_PDO = this.calculatePDO(
      opponent_5v5.goalsFor, 
      opponent_5v5.shotsOnGoalFor, 
      opponent_5v5.goalsAgainst, 
      opponent_5v5.shotsOnGoalAgainst
    );
    const team_xGF_adjusted = this.applyPDORegression(team_xGF_regressed, team_PDO);
    const opp_xGA_adjusted = this.applyPDORegression(opp_xGA_regressed, opp_PDO);
    
    // STEP 4: 40/60 weighting (INDUSTRY STANDARD)
    // Defense is MORE predictive than offense
    const expected_5v5_rate = (team_xGF_adjusted * 0.40) + (opp_xGA_adjusted * 0.60);
    
    // STEP 5: Apply shooting talent (small adjustment for elite/weak finishers)
    const shooting_skill = this.getShootingTalent(team);
    const expected_5v5_adjusted = expected_5v5_rate * shooting_skill;
    
    // STEP 6: Calculate time-weighted goals
    const weights = this.calculateDynamicSituationalWeights(team, opponent);
    const minutes_5v5 = weights['5on5'] * 60;
    let goals_5v5 = (expected_5v5_adjusted / 60) * minutes_5v5;
    
    // STEP 7: Home ice advantage (5% boost)
    if (isHome) {
      goals_5v5 *= 1.05;
    }
    
    // STEP 8: PP component (with same regression + 40/60 weighting)
    let goals_PP = 0;
    if (team_PP && opponent_PK) {
      const team_PP_xGF_raw = team_PP.xGF_per60;
      const opp_PK_xGA_raw = opponent_PK.xGA_per60;
      
      // Apply same regression to PP stats
      const team_PP_regressed = this.applyRegressionToMean(team_PP_xGF_raw, league_avg, gamesPlayed);
      const opp_PK_regressed = this.applyRegressionToMean(opp_PK_xGA_raw, league_avg, opp_gamesPlayed);
      
      // 40/60 weighting for PP
      const expected_PP_rate = (team_PP_regressed * 0.40) + (opp_PK_regressed * 0.60);
      const expected_PP_adjusted = expected_PP_rate * shooting_skill;
      
      const minutes_PP = weights['5on4'] * 60;
      goals_PP = (expected_PP_adjusted / 60) * minutes_PP;
    }
    
    // STEP 9: Goalie adjustment (RE-ENABLED with 15% threshold)
    const totalGoals = goals_5v5 + goals_PP;
    const goalieAdjusted = this.adjustForGoalie(totalGoals, opponent, startingGoalie);
    
    return Math.max(0, goalieAdjusted);
  }

  // IMPROVEMENT 1B: Apply PDO regression to xG predictions
  // PHASE 4 FIX: Only regress EXTREME outliers (less aggressive)
  applyPDORegression(xG_per60, PDO) {
    if (!PDO || PDO === 100) return xG_per60;
    
    // PHASE 4: Only regress extreme outliers (PDO > 106 or < 94)
    // Normal variance (94-106) is real team performance, not luck
    // Reduced from 104/96 to allow more variance to show through
    if (PDO > 106) {
      // Regress down by max 2% (reduced from 3%)
      const regressionFactor = Math.min(0.02, (PDO - 106) * 0.01);
      return xG_per60 * (1 - regressionFactor);
    } else if (PDO < 94) {
      // Regress up by max 2%
      const regressionFactor = Math.min(0.02, (94 - PDO) * 0.01);
      return xG_per60 * (1 + regressionFactor);
    }
    
    return xG_per60; // PDO in normal range (94-106), no regression needed
  }

  // NEW: Adjust predicted goals for goalie quality (INDUSTRY STANDARD: ±15%)
  // This is THE most important single factor in NHL betting
  adjustForGoalie(predictedGoals, opponentTeam, startingGoalieName = null) {
    if (!this.goalieProcessor) return predictedGoals;
    
    let goalieGSAE = 0;
    
    // If specific starting goalie provided, use their stats
    if (startingGoalieName) {
      goalieGSAE = this.goalieProcessor.calculateGSAE(startingGoalieName, '5on5');
    } else {
      // Otherwise use team's average goalie performance
      const teamGoalies = this.goalieProcessor.getTeamGoalies(opponentTeam, '5on5');
      if (teamGoalies && teamGoalies.length > 0) {
        // Weight by games played
        let totalGSAE = 0;
        let totalGames = 0;
        
        teamGoalies.forEach(goalie => {
          const games = parseFloat(goalie.games_played) || 0;
          const gsae = this.goalieProcessor.calculateGSAE(goalie.name, '5on5');
          totalGSAE += gsae * games;
          totalGames += games;
        });
        
        goalieGSAE = totalGames > 0 ? totalGSAE / totalGames : 0;
      }
    }
    
    // Elite goalie (GSAE > 10): Hellebuyck, Shesterkin, Sorokin, etc.
    // Reduce opponent's expected goals by 15%
    if (goalieGSAE > 10) {
      return predictedGoals * 0.85;
    }
    
    // Bad goalie (GSAE < -10)
    // Increase opponent's expected goals by 15%
    if (goalieGSAE < -10) {
      return predictedGoals * 1.15;
    }
    
    // Average goalie (GSAE between -10 and +10)
    // No adjustment needed
    return predictedGoals;
  }

  // Convert predicted probability to American odds (Part 2.3)
  probabilityToOdds(probability) {
    if (probability <= 0 || probability >= 1) return 0;
    
    if (probability >= 0.5) {
      // Favorite (negative odds)
      return Math.round(-1 * (probability / (1 - probability)) * 100);
    } else {
      // Underdog (positive odds)
      return Math.round(((1 - probability) / probability) * 100);
    }
  }

  // Convert American odds to implied probability (Part 2.4)
  oddsToProbability(americanOdds) {
    if (americanOdds < 0) {
      return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
    } else {
      return 100 / (americanOdds + 100);
    }
  }

  // Calculate Expected Value using blueprint formula (Part 2.5)
  calculateEV(modelProbability, marketOdds, stake = 100) {
    if (modelProbability <= 0 || modelProbability >= 1) return 0;
    
    // Convert American odds to decimal odds (includes stake in return)
    let decimalOdds;
    if (marketOdds > 0) {
      // Positive odds: +125 means win $125 on $100 bet → total return $225 → 2.25x
      decimalOdds = 1 + (marketOdds / 100);
    } else {
      // Negative odds: -150 means bet $150 to win $100 → total return $250 → 1.667x
      decimalOdds = 1 + (100 / Math.abs(marketOdds));
    }
    
    // Total return if bet wins (includes original stake)
    const totalReturn = stake * decimalOdds;
    
    // EV = (P_win × total_return) - stake
    // This accounts for: win scenario returns totalReturn, lose scenario loses stake
    const ev = (modelProbability * totalReturn) - stake;
    
    return ev;
  }

  // Calculate Kelly Criterion stake sizing (Part 2.6)
  calculateKellyStake(modelProbability, marketOdds, bankroll = 1000) {
    if (modelProbability <= 0 || modelProbability >= 1) {
      return { fullKelly: 0, fractionalKelly: 0, recommendedStake: 0 };
    }
    
    // Convert odds to decimal format for Kelly calculation
    const b = marketOdds > 0 ? marketOdds / 100 : 100 / Math.abs(marketOdds);
    const p = modelProbability;
    const q = 1 - p;
    
    // f* = (bp - q) / b
    const kellyFraction = (b * p - q) / b;
    
    // Use fractional Kelly (25% for safety)
    const fractionalKelly = Math.max(0, kellyFraction * 0.25);
    
    return {
      fullKelly: kellyFraction,
      fractionalKelly: fractionalKelly,
      recommendedStake: bankroll * fractionalKelly
    };
  }

  // Normal distribution cumulative distribution function (CDF)
  // Used for calculating over/under probabilities
  normalCDF(z) {
    // Approximation of CDF using error function (Abramowitz and Stegun)
    // Accurate to ~7 decimal places
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  // POISSON DISTRIBUTION FUNCTIONS (Industry Standard for Hockey)
  // Hockey goals are discrete, rare events - Poisson is more accurate than Normal
  
  // Factorial helper
  factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Log factorial for numerical stability with large numbers
  logFactorial(n) {
    if (n <= 1) return 0;
    let sum = 0;
    for (let i = 2; i <= n; i++) {
      sum += Math.log(i);
    }
    return sum;
  }

  // Poisson PMF: P(X = k) = (λ^k * e^-λ) / k!
  // Probability of exactly k goals when expected value is lambda
  poissonPMF(k, lambda) {
    if (lambda <= 0) return 0;
    if (k < 0) return 0;
    
    // Use log-space for numerical stability with large k
    if (k > 20) {
      const logProb = k * Math.log(lambda) - lambda - this.logFactorial(k);
      return Math.exp(logProb);
    }
    
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
  }

  // Poisson CDF: P(X <= k) = sum of PMF from 0 to k
  // Probability of k or fewer goals
  poissonCDF(k, lambda) {
    if (lambda <= 0) return 1;
    if (k < 0) return 0;
    
    let sum = 0;
    const maxK = Math.floor(k);
    
    // Sum probabilities from 0 to k
    for (let i = 0; i <= maxK; i++) {
      sum += this.poissonPMF(i, lambda);
    }
    
    return Math.min(1, sum); // Cap at 1 due to floating point errors
  }

  // Calculate win probability using Poisson distribution (industry standard)
  // Takes PRE-CALCULATED scores to ensure consistency across all calculations
  calculatePoissonWinProb(teamScore, oppScore) {
    if (!teamScore || !oppScore || teamScore <= 0 || oppScore <= 0) return 0.5;
    
    // INDUSTRY STANDARD: Use Poisson distribution to calculate exact win probability
    // This is mathematically correct for hockey (discrete goal events)
    
    let winProb = 0;
    let tieProb = 0;
    
    // Calculate probability for all realistic score combinations (0-10 goals each)
    for (let teamGoals = 0; teamGoals <= 10; teamGoals++) {
      const pTeam = this.poissonPMF(teamGoals, teamScore);
      
      for (let oppGoals = 0; oppGoals <= 10; oppGoals++) {
        const pOpp = this.poissonPMF(oppGoals, oppScore);
        const pCombo = pTeam * pOpp;
        
        if (teamGoals > oppGoals) {
          winProb += pCombo;  // Team wins in regulation
        } else if (teamGoals === oppGoals) {
          tieProb += pCombo;  // Goes to OT/SO
        }
      }
    }
    
    // In NHL, ties go to OT/SO
    // CRITICAL FIX: Better team wins ~58% of OT/SO (empirical NHL data 2015-2024)
    // Weaker team only wins ~42% (not 48%!)
    const otAdvantage = teamScore > oppScore ? 0.58 : 0.42;
    winProb += tieProb * otAdvantage;
    
    // Clamp between 0.05 and 0.95 (never give 100% or 0%)
    return Math.max(0.05, Math.min(0.95, winProb));
  }
  
  // DEPRECATED: Old estimateWinProbability - kept for backward compatibility
  // Use calculatePoissonWinProb() with pre-calculated scores instead
  estimateWinProbability(team, opponent, isHome = true) {
    if (!team || !opponent) return 0.5;
    
    // Use actual predicted scores for each team
    const teamCode = team.team || team.name;
    const oppCode = opponent.team || opponent.name;
    
    if (!teamCode || !oppCode) {
      return 0.5;
    }
    
    // Predict scores (without starting goalies - NOT RECOMMENDED)
    let teamScore, oppScore;
    if (isHome) {
      teamScore = this.predictTeamScore(teamCode, oppCode, true);
      oppScore = this.predictTeamScore(oppCode, teamCode, false);
    } else {
      teamScore = this.predictTeamScore(teamCode, oppCode, false);
      oppScore = this.predictTeamScore(oppCode, teamCode, true);
    }
    
    return this.calculatePoissonWinProb(teamScore, oppScore);
  }

  // Find regression candidates (betting opportunities)
  findRegressionCandidates() {
    const allTeams = this.getTeamsBySituation('all');
    
    const overperforming = allTeams
      .filter(team => team.regression_score > 10) // High positive regression score
      .sort((a, b) => b.regression_score - a.regression_score);
    
    const underperforming = allTeams
      .filter(team => team.regression_score < -10) // High negative regression score
      .sort((a, b) => a.regression_score - b.regression_score);
    
    return {
      overperforming: overperforming.slice(0, 5), // Top 5
      underperforming: underperforming.slice(0, 5) // Top 5
    };
  }

  // Find special teams mismatches
  findSpecialTeamsMismatches() {
    const ppTeams = this.getTeamsBySituation('5on4');
    const pkTeams = this.getTeamsBySituation('4on5');
    
    const mismatches = [];
    
    ppTeams.forEach(ppTeam => {
      pkTeams.forEach(pkTeam => {
        if (ppTeam.team !== pkTeam.team) {
          const ppEfficiency = ppTeam.pp_efficiency || 0;
          const pkEfficiency = pkTeam.pk_efficiency || 0;
          const mismatch = ppEfficiency - pkEfficiency;
          
          if (mismatch > 2) { // Significant mismatch
            mismatches.push({
              ppTeam: ppTeam.team,
              pkTeam: pkTeam.team,
              ppEfficiency,
              pkEfficiency,
              mismatch,
              recommendation: 'BET OVER on ' + ppTeam.team + ' team total'
            });
          }
        }
      });
    });
    
    return mismatches.sort((a, b) => b.mismatch - a.mismatch);
  }

  // Calculate betting edge
  calculateBettingEdge(modelProbability, marketOdds) {
    const marketProbability = 1 / marketOdds;
    return modelProbability - marketProbability;
  }

  // Get top betting opportunities
  getTopBettingOpportunities() {
    const regressionCandidates = this.findRegressionCandidates();
    const specialTeamsMismatches = this.findSpecialTeamsMismatches();
    
    const opportunities = [];
    
    // Add regression opportunities
    regressionCandidates.overperforming.forEach(team => {
      opportunities.push({
        type: 'REGRESSION',
        team: team.team,
        recommendation: 'BET UNDER/AGAINST',
        reason: `Overperforming (PDO: ${team.pdo.toFixed(1)}, Shooting Eff: ${team.shooting_efficiency.toFixed(2)})`,
        confidence: Math.min(95, Math.abs(team.regression_score) * 2),
        edge: Math.abs(team.regression_score) / 10
      });
    });
    
    regressionCandidates.underperforming.forEach(team => {
      opportunities.push({
        type: 'REGRESSION',
        team: team.team,
        recommendation: 'BET OVER/WITH',
        reason: `Underperforming (PDO: ${team.pdo.toFixed(1)}, Shooting Eff: ${team.shooting_efficiency.toFixed(2)})`,
        confidence: Math.min(95, Math.abs(team.regression_score) * 2),
        edge: Math.abs(team.regression_score) / 10
      });
    });
    
    // Add special teams mismatches
    specialTeamsMismatches.slice(0, 3).forEach(mismatch => {
      opportunities.push({
        type: 'SPECIAL_TEAMS',
        team: mismatch.ppTeam,
        recommendation: mismatch.recommendation,
        reason: `PP vs PK mismatch (${mismatch.mismatch.toFixed(1)} per 60)`,
        confidence: Math.min(90, mismatch.mismatch * 10),
        edge: mismatch.mismatch / 5
      });
    });
    
    return opportunities.sort((a, b) => b.edge - a.edge);
  }
}

// Load and process CSV data (with goalie data integration)
export async function loadNHLData(goalieProcessor = null) {
  try {
    // Try GitHub raw files first (always fresh), fallback to local
    let response;
    try {
      response = await fetch('https://raw.githubusercontent.com/dpk1212/nhl-savant/main/public/teams.csv');
      if (!response.ok) throw new Error('GitHub fetch failed');
    } catch (error) {
      console.log('GitHub raw file failed, trying local file...');
      response = await fetch('/teams.csv');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => {
          // Clean and convert numeric values
          if (value === '' || value === null || value === undefined) return null;
          const trimmed = value.toString().trim();
          if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return null;
          
          // Try to convert to number if it looks like a number
          if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) {
            return parseFloat(trimmed);
          }
          return trimmed;
        },
        complete: (results) => {
          console.log('CSV parsing completed. Rows:', results.data.length);
          console.log('Parsing errors:', results.errors);
          
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          // Filter out any completely empty rows
          const cleanData = results.data.filter(row => 
            row && Object.keys(row).some(key => row[key] !== null && row[key] !== '')
          );
          
          if (cleanData.length === 0) {
            reject(new Error('No valid data found in CSV file'));
            return;
          }
          
          console.log('Clean data rows:', cleanData.length);
          // NEW: Pass goalieProcessor to enable goalie adjustments
          const processor = new NHLDataProcessor(cleanData, goalieProcessor);
          resolve(processor);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading NHL data:', error);
    throw error;
  }
}

// Load starting goalies selections from GitHub
export async function loadStartingGoalies() {
  const sources = [
    'https://raw.githubusercontent.com/dpk1212/nhl-savant/main/public/starting_goalies.json',
    '/starting_goalies.json'
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source);
      if (!response.ok) continue;
      
      const data = await response.json();
      console.log('✅ Loaded starting goalies:', data.games?.length || 0, 'games');
      return data;
    } catch (err) {
      console.log(`⚠️ Could not load from ${source}`);
    }
  }
  
  console.log('ℹ️ No starting goalies file found, using team averages');
  return null;
}

// Load both odds files (Money + Total)
export async function loadOddsFiles() {
  try {
    console.log('🏒 Loading Money file...');
    console.log('🏒 Loading Total file...');
    
    // Try GitHub raw files first (always fresh), fallback to local
    let moneyResponse, totalResponse;
    try {
      [moneyResponse, totalResponse] = await Promise.all([
        fetch('https://raw.githubusercontent.com/dpk1212/nhl-savant/main/public/odds_money.md'),
        fetch('https://raw.githubusercontent.com/dpk1212/nhl-savant/main/public/odds_total.md')
      ]);
      if (!moneyResponse.ok || !totalResponse.ok) throw new Error('GitHub fetch failed');
    } catch (error) {
      console.log('GitHub raw files failed, trying local files...');
      [moneyResponse, totalResponse] = await Promise.all([
        fetch('/odds_money.md'),
        fetch('/odds_total.md')
      ]);
    }
    
    if (!moneyResponse.ok || !totalResponse.ok) {
      console.warn('One or both odds files not found');
      return null;
    }
    
    const moneyText = await moneyResponse.text();
    const totalText = await totalResponse.text();
    
    console.log('✅ Both odds files loaded successfully');
    
    return {
      moneyText,
      totalText
    };
  } catch (error) {
    console.warn('Error loading odds files:', error);
    return null;
  }
}
