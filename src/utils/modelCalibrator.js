/**
 * Model Calibrator - Calculate 2024 NHL Season Constants
 * Ensures model is calibrated to actual 2024 data instead of theoretical averages
 */

import Papa from 'papaparse';
import fs from 'fs';

export class Model2024Calibrator {
  constructor(teams2024Data) {
    this.teamsData = teams2024Data;
    this.constants = this.calculateConstants();
  }

  /**
   * Calculate all 2024 league constants
   */
  calculateConstants() {
    const teams5v5 = this.teamsData.filter(t => t.situation === '5on5');
    
    if (teams5v5.length === 0) {
      throw new Error('No 5on5 data found in teams_2024.csv');
    }

    console.log(`📊 Calculating 2024 constants from ${teams5v5.length} teams...`);

    // 1. League average xGF/60 and xGA/60
    // Calculate per-60 rates from raw data
    const xGF_values = [];
    const xGA_values = [];
    const xGF_scoreAdj_values = [];
    const xGA_scoreAdj_values = [];
    
    for (const team of teams5v5) {
      const iceTime = parseFloat(team.iceTime) || 0;
      if (iceTime === 0) continue;
      
      // Calculate per-60 rates
      const xGoalsFor = parseFloat(team.xGoalsFor) || 0;
      const xGoalsAgainst = parseFloat(team.xGoalsAgainst) || 0;
      const scoreVenueAdj_xGF = parseFloat(team.scoreVenueAdjustedxGoalsFor) || xGoalsFor;
      const scoreVenueAdj_xGA = parseFloat(team.scoreVenueAdjustedxGoalsAgainst) || xGoalsAgainst;
      
      const xGF_per60 = (xGoalsFor / iceTime) * 3600;
      const xGA_per60 = (xGoalsAgainst / iceTime) * 3600;
      const xGF_scoreAdj_per60 = (scoreVenueAdj_xGF / iceTime) * 3600;
      const xGA_scoreAdj_per60 = (scoreVenueAdj_xGA / iceTime) * 3600;
      
      if (xGF_per60 > 0) xGF_values.push(xGF_per60);
      if (xGA_per60 > 0) xGA_values.push(xGA_per60);
      if (xGF_scoreAdj_per60 > 0) xGF_scoreAdj_values.push(xGF_scoreAdj_per60);
      if (xGA_scoreAdj_per60 > 0) xGA_scoreAdj_values.push(xGA_scoreAdj_per60);
    }

    const avgXGF = this.average(xGF_values);
    const avgXGA = this.average(xGA_values);
    const avgXGF_scoreAdj = this.average(xGF_scoreAdj_values);
    const avgXGA_scoreAdj = this.average(xGA_scoreAdj_values);

    // 2. Shooting talent (actual goals / expected goals)
    const totalGoals = teams5v5.reduce((sum, t) => sum + (parseFloat(t.goalsFor) || 0), 0);
    const totalXG = teams5v5.reduce((sum, t) => sum + (parseFloat(t.xGoalsFor) || 0), 0);
    const shootingTalent = totalGoals / totalXG;

    // 3. Team variance (std dev) - how spread out are teams?
    const stdDev_xGF = this.calculateStdDev(xGF_values);
    const stdDev_xGA = this.calculateStdDev(xGA_values);
    const stdDev_xGF_scoreAdj = this.calculateStdDev(xGF_scoreAdj_values);

    // 4. Calculate actual goals per game
    const totalGamesPlayed = teams5v5.reduce((sum, t) => sum + (parseFloat(t.games_played) || 0), 0);
    const avgGoalsPerGame = totalGoals / (totalGamesPlayed / 2);  // Divide by 2 because each game counted twice

    const constants = {
      // Raw xG
      avgXGF_raw: avgXGF,
      avgXGA_raw: avgXGA,
      stdDev_xGF_raw: stdDev_xGF,
      stdDev_xGA_raw: stdDev_xGA,
      
      // Score-adjusted xG
      avgXGF_scoreAdj: avgXGF_scoreAdj,
      avgXGA_scoreAdj: avgXGA_scoreAdj,
      stdDev_xGF_scoreAdj: stdDev_xGF_scoreAdj,
      
      // Shooting talent
      shootingTalent,
      totalGoals,
      totalXG,
      
      // Actual game stats
      avgGoalsPerGame,
      avgTotal: avgXGF + avgXGA,
      
      // Variance metrics
      varianceRatio_raw: stdDev_xGF / avgXGF,  // Coefficient of variation
      varianceRatio_scoreAdj: stdDev_xGF_scoreAdj / avgXGF_scoreAdj
    };

    console.log('✅ 2024 Constants Calculated:');
    console.log(`   Avg xGF/60 (raw): ${avgXGF.toFixed(3)}`);
    console.log(`   Avg xGF/60 (score-adj): ${avgXGF_scoreAdj.toFixed(3)}`);
    console.log(`   Shooting Talent: ${shootingTalent.toFixed(3)} (${((shootingTalent - 1) * 100).toFixed(1)}% above xG)`);
    console.log(`   Std Dev (raw): ${stdDev_xGF.toFixed(3)} (${(constants.varianceRatio_raw * 100).toFixed(1)}% CoV)`);
    console.log(`   Std Dev (score-adj): ${stdDev_xGF_scoreAdj.toFixed(3)} (${(constants.varianceRatio_scoreAdj * 100).toFixed(1)}% CoV)`);
    console.log(`   Actual Goals/Game: ${avgGoalsPerGame.toFixed(2)}`);

    return constants;
  }

  /**
   * Helper: Calculate average
   */
  average(values) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Helper: Calculate standard deviation
   */
  calculateStdDev(values) {
    if (values.length === 0) return 0;
    const avg = this.average(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = this.average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Get optimal shooting talent multiplier for predictions
   */
  getShootingTalentMultiplier() {
    return this.constants.shootingTalent;
  }

  /**
   * Get league average for normalization
   */
  getLeagueAverage(useScoreAdjusted = false) {
    return useScoreAdjusted ? this.constants.avgXGF_scoreAdj : this.constants.avgXGF_raw;
  }

  /**
   * Get all constants
   */
  getConstants() {
    return this.constants;
  }
}

/**
 * Load and calibrate from teams_2024.csv
 */
export async function load2024Calibration(filePath = 'backtesting/data/teams_2024.csv') {
  return new Promise((resolve, reject) => {
    const csvData = fs.readFileSync(filePath, 'utf8');
    
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const calibrator = new Model2024Calibrator(results.data);
          resolve(calibrator);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

