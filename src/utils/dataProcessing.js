import Papa from 'papaparse';

// Core mathematical calculations for NHL betting model
export class NHLDataProcessor {
  constructor(rawData) {
    this.rawData = rawData;
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
  // AUDIT IMPROVEMENTS: Score-adjusted xG, PDO regression, dynamic weighting
  predictTeamScore(team, opponent) {
    const team_5v5 = this.getTeamData(team, '5on5');
    const opponent_5v5 = this.getTeamData(opponent, '5on5');
    const team_PP = this.getTeamData(team, '5on4');
    const opponent_PK = this.getTeamData(opponent, '4on5');
    
    if (!team_5v5 || !opponent_5v5) return 0;
    
    // IMPROVEMENT 1A: Use score-adjusted xG (removes score effect bias)
    const team_xGF = team_5v5.scoreAdj_xGF_per60 || team_5v5.xGF_per60;
    const opp_xGA = opponent_5v5.scoreAdj_xGA_per60 || opponent_5v5.xGA_per60;
    
    // IMPROVEMENT 1B: PDO regression adjustment
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
    const team_xGF_adjusted = this.applyPDORegression(team_xGF, team_PDO);
    const opp_xGA_adjusted = this.applyPDORegression(opp_xGA, opp_PDO);
    
    // 5v5 component: Weighted average (offense 55%, defense 45% - research-backed)
    const expected_5v5_rate = (team_xGF_adjusted * 0.55) + (opp_xGA_adjusted * 0.45);
    const goals_5v5 = (expected_5v5_rate / 60) * 46.2; // 77% of 60 min = 46.2 min
    
    // PP component: Average team's PP offense and opponent's PK defensive weakness
    let goals_PP = 0;
    if (team_PP && opponent_PK) {
      const team_PP_xGF = team_PP.scoreAdj_xGF_per60 || team_PP.xGF_per60;
      const opp_PK_xGA = opponent_PK.scoreAdj_xGA_per60 || opponent_PK.xGA_per60;
      const expected_PP_rate = (team_PP_xGF * 0.55) + (opp_PK_xGA * 0.45);
      goals_PP = (expected_PP_rate / 60) * 7.2; // 12% of 60 min = 7.2 min
    }
    
    return Math.max(0, goals_5v5 + goals_PP);
  }

  // IMPROVEMENT 1B: Apply PDO regression to xG predictions
  // Teams with extreme PDO (luck) will regress toward mean
  applyPDORegression(xG_per60, PDO) {
    if (!PDO || PDO === 100) return xG_per60;
    
    // PDO > 102: Team is lucky (high sh% or sv%), expect regression DOWN
    // PDO < 98: Team is unlucky, expect regression UP
    if (PDO > 102) {
      // Regress down by 2-5% depending on how extreme
      const regressionFactor = Math.min(0.05, (PDO - 102) * 0.01);
      return xG_per60 * (1 - regressionFactor);
    } else if (PDO < 98) {
      // Regress up by 2-5%
      const regressionFactor = Math.min(0.05, (98 - PDO) * 0.01);
      return xG_per60 * (1 + regressionFactor);
    }
    
    return xG_per60; // PDO in normal range, no regression needed
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

  // Estimate win probability based on team stats (helper for moneyline)
  estimateWinProbability(team, opponent, isHome = true) {
    if (!team || !opponent) return 0.5;
    
    // Use xG differential and regression scores to estimate win probability
    const teamXGD = team.xGD_per60 || 0;
    const oppXGD = opponent.xGD_per60 || 0;
    
    // CALIBRATED: Home ice advantage: ~54% historical win rate for equal teams
    // This translates to ~0.10 xGD boost (reduced from 0.15)
    const homeBonus = isHome ? 0.10 : 0;
    
    // Adjust for regression (teams with high PDO likely to regress)
    const teamReg = team.regression_score || 0;
    const oppReg = opponent.regression_score || 0;
    
    // Combine factors (xGD is primary, regression is secondary, home ice is tertiary)
    const teamStrength = teamXGD + homeBonus - (teamReg * 0.01);
    const oppStrength = oppXGD - (oppReg * 0.01);
    
    const diff = teamStrength - oppStrength;
    
    // CALIBRATED: Use LOGISTIC FUNCTION with reduced sensitivity
    // P(win) = 1 / (1 + e^(-k*diff)) where k controls sensitivity
    // k = 0.5 (reduced from 0.8) for more conservative, market-aligned estimates:
    // - diff = 0 → 50% (equal teams)
    // - diff = 0.5 → ~56% (moderate advantage)
    // - diff = 1.0 → ~62% (strong advantage)
    const k = 0.5;
    const winProb = 1 / (1 + Math.exp(-k * diff));
    
    // Clamp between 0.05 and 0.95 (never give 100% or 0%)
    return Math.max(0.05, Math.min(0.95, winProb));
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

// Load and process CSV data
export async function loadNHLData() {
  try {
    // Use clean path from public folder (no spaces)
    const response = await fetch('/nhl-savant/nhl_data.csv');
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
          const processor = new NHLDataProcessor(cleanData);
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

// Load both odds files (Money + Total)
export async function loadOddsFiles() {
  try {
    console.log('🏒 Loading Money file...');
    console.log('🏒 Loading Total file...');
    
    const [moneyResponse, totalResponse] = await Promise.all([
      fetch('/nhl-savant/odds_money.md'),
      fetch('/nhl-savant/odds_total.md')
    ]);
    
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
