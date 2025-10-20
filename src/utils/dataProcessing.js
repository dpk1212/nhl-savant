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
    const shootingEff = this.calculateShootingEfficiency(team.goalsFor, team.xGoalsFor);
    const savePerf = this.calculateSavePerformance(team.goalsAgainst, team.xGoalsAgainst);
    const pdo = this.calculatePDO(team.goalsFor, team.shotsOnGoalFor, team.goalsAgainst, team.shotsOnGoalAgainst);
    
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
    
    // Per-60 rates
    processed.xGF_per60 = this.calculatePer60Rate(team.xGoalsFor, team.iceTime);
    processed.xGA_per60 = this.calculatePer60Rate(team.xGoalsAgainst, team.iceTime);
    processed.corsi_per60 = this.calculatePer60Rate(team.shotAttemptsFor, team.iceTime);
    processed.fenwick_per60 = this.calculatePer60Rate(team.unblockedShotAttemptsFor, team.iceTime);
    
    // High danger per-60
    processed.highDanger_xGF_per60 = this.calculatePer60Rate(team.highDangerxGoalsFor, team.iceTime);
    processed.highDanger_xGA_per60 = this.calculatePer60Rate(team.highDangerxGoalsAgainst, team.iceTime);
    
    // Score adjusted per-60
    processed.scoreAdj_xGF_per60 = this.calculatePer60Rate(team.scoreVenueAdjustedxGoalsFor, team.iceTime);
    processed.scoreAdj_xGA_per60 = this.calculatePer60Rate(team.scoreVenueAdjustedxGoalsAgainst, team.iceTime);
    
    // Special teams per-60 (situational)
    if (team.situation === '5on4') {
      processed.pp_efficiency = this.calculatePer60Rate(team.xGoalsFor, team.iceTime);
    }
    if (team.situation === '4on5') {
      processed.pk_efficiency = this.calculatePer60Rate(team.xGoalsAgainst, team.iceTime);
    }
    
    // Key metrics
    processed.pdo = this.calculatePDO(team.goalsFor, team.shotsOnGoalFor, team.goalsAgainst, team.shotsOnGoalAgainst);
    processed.shooting_efficiency = this.calculateShootingEfficiency(team.goalsFor, team.xGoalsFor);
    processed.save_performance = this.calculateSavePerformance(team.goalsAgainst, team.xGoalsAgainst);
    processed.xGD_per60 = this.calculateXGDiffPer60(team.xGoalsFor, team.xGoalsAgainst, team.iceTime);
    
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
    const response = await fetch('./teams.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('CSV parsing errors: ' + results.errors.join(', ')));
          } else {
            const processor = new NHLDataProcessor(results.data);
            resolve(processor);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading NHL data:', error);
    throw error;
  }
}
