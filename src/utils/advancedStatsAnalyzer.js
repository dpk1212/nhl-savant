/**
 * Advanced Stats Analyzer
 * Parses all 100+ metrics from teams.csv and provides deep statistical analysis
 */

export class AdvancedStatsAnalyzer {
  constructor(dataProcessor) {
    this.dataProcessor = dataProcessor;
    this.leagueAverages = {};
    this.calculateLeagueAverages();
  }

  /**
   * Calculate league averages for all key metrics
   */
  calculateLeagueAverages() {
    const allTeams = this.dataProcessor.getTeamsBySituation('5on5');
    if (!allTeams || allTeams.length === 0) return;

    const metrics = [
      'highDangerxGoalsFor', 'highDangerxGoalsAgainst',
      'highDangerShotsFor', 'highDangerShotsAgainst',
      'highDangerGoalsFor', 'highDangerGoalsAgainst',
      'mediumDangerxGoalsFor', 'mediumDangerxGoalsAgainst',
      'lowDangerxGoalsFor', 'lowDangerxGoalsAgainst',
      'xReboundsFor', 'xReboundsAgainst',
      'reboundGoalsFor', 'reboundGoalsAgainst',
      'xGoalsFromActualReboundsOfShotsFor', 'xGoalsFromActualReboundsOfShotsAgainst',
      'blockedShotAttemptsFor', 'blockedShotAttemptsAgainst',
      'shotAttemptsFor', 'shotAttemptsAgainst',
      'takeawaysFor', 'takeawaysAgainst',
      'giveawaysFor', 'giveawaysAgainst',
      'dZoneGiveawaysFor', 'dZoneGiveawaysAgainst',
      'hitsFor', 'hitsAgainst',
      'corsiPercentage', 'fenwickPercentage',
      'xGoalsPercentage'
    ];

    metrics.forEach(metric => {
      const values = allTeams
        .map(t => t[metric])
        .filter(v => v !== null && v !== undefined && !isNaN(v));
      
      if (values.length > 0) {
        this.leagueAverages[metric] = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    });

    // Calculate per-60 averages
    this.calculatePer60Averages();
  }

  /**
   * Calculate per-60 minute rates for key metrics
   */
  calculatePer60Averages() {
    const allTeams = this.dataProcessor.getTeamsBySituation('5on5');
    if (!allTeams || allTeams.length === 0) return;

    const per60Metrics = [];
    
    allTeams.forEach(team => {
      const iceTime = team.iceTime || 1;
      const minutes = iceTime / 60;
      
      per60Metrics.push({
        hdXgfPer60: (team.highDangerxGoalsFor || 0) / minutes,
        hdXgaPer60: (team.highDangerxGoalsAgainst || 0) / minutes,
        rebXgfPer60: (team.xGoalsFromActualReboundsOfShotsFor || 0) / minutes,
        rebXgaPer60: (team.xGoalsFromActualReboundsOfShotsAgainst || 0) / minutes,
        blocksPer60: (team.blockedShotAttemptsFor || 0) / minutes,
        blocksAgainstPer60: (team.blockedShotAttemptsAgainst || 0) / minutes
      });
    });

    // Calculate averages
    this.leagueAverages.hdXgfPer60 = this.avg(per60Metrics.map(t => t.hdXgfPer60));
    this.leagueAverages.hdXgaPer60 = this.avg(per60Metrics.map(t => t.hdXgaPer60));
    this.leagueAverages.rebXgfPer60 = this.avg(per60Metrics.map(t => t.rebXgfPer60));
    this.leagueAverages.rebXgaPer60 = this.avg(per60Metrics.map(t => t.rebXgaPer60));
    this.leagueAverages.blocksPer60 = this.avg(per60Metrics.map(t => t.blocksPer60));
    this.leagueAverages.blocksAgainstPer60 = this.avg(per60Metrics.map(t => t.blocksAgainstPer60));
  }

  avg(arr) {
    return arr.reduce((sum, v) => sum + v, 0) / arr.length;
  }

  /**
   * Get percentile rank for a team's metric (0-100, higher = better)
   */
  getPercentileRank(teamCode, metric, situation = '5on5') {
    const allTeams = this.dataProcessor.getTeamsBySituation(situation);
    if (!allTeams || allTeams.length === 0) return 50;

    const teamData = allTeams.find(t => t.team === teamCode);
    if (!teamData || teamData[metric] === undefined) return 50;

    const teamValue = teamData[metric];
    const allValues = allTeams
      .map(t => t[metric])
      .filter(v => v !== null && v !== undefined && !isNaN(v))
      .sort((a, b) => a - b);

    const rank = allValues.findIndex(v => v >= teamValue);
    return Math.round((rank / allValues.length) * 100);
  }

  /**
   * Get league rank (1-32) for a team's metric
   */
  getLeagueRank(teamCode, metric, situation = '5on5', higherIsBetter = true) {
    const allTeams = this.dataProcessor.getTeamsBySituation(situation);
    if (!allTeams || allTeams.length === 0) return null;

    const teamData = allTeams.find(t => t.team === teamCode);
    if (!teamData || teamData[metric] === undefined) return null;

    const sorted = allTeams
      .map(t => ({ team: t.team, value: t[metric] || 0 }))
      .sort((a, b) => higherIsBetter ? b.value - a.value : a.value - b.value);

    const rank = sorted.findIndex(t => t.team === teamCode) + 1;
    return rank;
  }

  /**
   * Get high-danger metrics with per-60 rates
   */
  getHighDangerMetrics(teamCode, situation = '5on5') {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    const iceTime = teamData.iceTime || 1; // Already in minutes!
    const hours = iceTime / 60; // Convert to hours for per-60 calculation

    return {
      hdXgFor: teamData.highDangerxGoalsFor || 0,
      hdXgAgainst: teamData.highDangerxGoalsAgainst || 0,
      hdXgfPer60: (teamData.highDangerxGoalsFor || 0) / hours,
      hdXgaPer60: (teamData.highDangerxGoalsAgainst || 0) / hours,
      hdShotsFor: teamData.highDangerShotsFor || 0,
      hdShotsAgainst: teamData.highDangerShotsAgainst || 0,
      hdGoalsFor: teamData.highDangerGoalsFor || 0,
      hdGoalsAgainst: teamData.highDangerGoalsAgainst || 0,
      hdConversionRate: teamData.highDangerShotsFor > 0 
        ? (teamData.highDangerGoalsFor / teamData.highDangerShotsFor) * 100 
        : 0,
      hdSavePercent: teamData.highDangerShotsAgainst > 0
        ? ((teamData.highDangerShotsAgainst - teamData.highDangerGoalsAgainst) / teamData.highDangerShotsAgainst) * 100
        : 0
    };
  }

  /**
   * Get rebound metrics
   */
  getReboundMetrics(teamCode, situation = '5on5') {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    const iceTime = teamData.iceTime || 1; // Already in minutes!
    const hours = iceTime / 60; // Convert to hours for per-60 calculation

    return {
      xRebFor: teamData.xReboundsFor || 0,
      xRebAgainst: teamData.xReboundsAgainst || 0,
      rebXgFor: teamData.xGoalsFromActualReboundsOfShotsFor || 0,
      rebXgAgainst: teamData.xGoalsFromActualReboundsOfShotsAgainst || 0,
      rebXgfPer60: (teamData.xGoalsFromActualReboundsOfShotsFor || 0) / hours,
      rebXgaPer60: (teamData.xGoalsFromActualReboundsOfShotsAgainst || 0) / hours,
      rebGoalsFor: teamData.reboundGoalsFor || 0,
      rebGoalsAgainst: teamData.reboundGoalsAgainst || 0,
      rebConversion: teamData.xReboundsFor > 0 
        ? (teamData.reboundGoalsFor / teamData.xReboundsFor) * 100 
        : 0
    };
  }

  /**
   * Get shot blocking and physical play metrics
   */
  getPhysicalMetrics(teamCode, situation = '5on5') {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    const iceTime = teamData.iceTime || 1;
    const minutes = iceTime / 60;
    const totalShots = (teamData.shotAttemptsFor || 0);
    const totalShotsAgainst = (teamData.shotAttemptsAgainst || 0);

    return {
      blockedShots: teamData.blockedShotAttemptsFor || 0,
      blockedShotsAgainst: teamData.blockedShotAttemptsAgainst || 0,
      blockingRate: totalShotsAgainst > 0 
        ? (teamData.blockedShotAttemptsAgainst / totalShotsAgainst) * 100 
        : 0,
      blocksGiven: totalShots > 0
        ? (teamData.blockedShotAttemptsFor / totalShots) * 100
        : 0,
      hits: teamData.hitsFor || 0,
      hitsAgainst: teamData.hitsAgainst || 0,
      hitsPer60: (teamData.hitsFor || 0) / minutes,
      takeaways: teamData.takeawaysFor || 0,
      giveaways: teamData.giveawaysFor || 0,
      takeawaysPer60: (teamData.takeawaysFor || 0) / minutes,
      giveawaysPer60: (teamData.giveawaysFor || 0) / minutes,
      dZoneGiveaways: teamData.dZoneGiveawaysFor || 0,
      dZoneGiveawaysPer60: (teamData.dZoneGiveawaysFor || 0) / minutes
    };
  }

  /**
   * Get danger zone breakdown (low/medium/high)
   */
  getDangerZoneBreakdown(teamCode, situation = '5on5') {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    return {
      offense: {
        low: {
          shots: teamData.lowDangerShotsFor || 0,
          xGoals: teamData.lowDangerxGoalsFor || 0,
          goals: teamData.lowDangerGoalsFor || 0
        },
        medium: {
          shots: teamData.mediumDangerShotsFor || 0,
          xGoals: teamData.mediumDangerxGoalsFor || 0,
          goals: teamData.mediumDangerGoalsFor || 0
        },
        high: {
          shots: teamData.highDangerShotsFor || 0,
          xGoals: teamData.highDangerxGoalsFor || 0,
          goals: teamData.highDangerGoalsFor || 0
        }
      },
      defense: {
        low: {
          shots: teamData.lowDangerShotsAgainst || 0,
          xGoals: teamData.lowDangerxGoalsAgainst || 0,
          goals: teamData.lowDangerGoalsAgainst || 0
        },
        medium: {
          shots: teamData.mediumDangerShotsAgainst || 0,
          xGoals: teamData.mediumDangerxGoalsAgainst || 0,
          goals: teamData.mediumDangerGoalsAgainst || 0
        },
        high: {
          shots: teamData.highDangerShotsAgainst || 0,
          xGoals: teamData.highDangerxGoalsAgainst || 0,
          goals: teamData.highDangerGoalsAgainst || 0
        }
      }
    };
  }

  /**
   * Calculate PDO (Sh% + Sv%) and regression indicators
   */
  getRegressionIndicators(teamCode, situation = '5on5') {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    const shotsFor = teamData.shotsOnGoalFor || 0;
    const goalsFor = teamData.goalsFor || 0;
    const shotsAgainst = teamData.shotsOnGoalAgainst || 0;
    const goalsAgainst = teamData.goalsAgainst || 0;

    const shootingPct = shotsFor > 0 ? (goalsFor / shotsFor) * 100 : 0;
    const savePct = shotsAgainst > 0 ? ((shotsAgainst - goalsAgainst) / shotsAgainst) * 100 : 0;
    const pdo = shootingPct + savePct;

    // Expected shooting % based on xG
    const xGoalsFor = teamData.scoreVenueAdjustedxGoalsFor || teamData.xGoalsFor || 0;
    const expectedShPct = shotsFor > 0 ? (xGoalsFor / shotsFor) * 100 : 0;
    const shPctDiff = shootingPct - expectedShPct;

    return {
      pdo,
      shootingPct,
      savePct,
      expectedShPct,
      shPctDiff,
      goalsVsExpected: goalsFor - xGoalsFor,
      isUnderperforming: goalsFor < xGoalsFor * 0.9,
      isOverperforming: goalsFor > xGoalsFor * 1.1,
      regressionExpected: Math.abs(shPctDiff) > 1.5 ? shPctDiff : 0
    };
  }

  /**
   * Get possession metrics
   * FIX: CSV stores percentages as decimals (0.51 = 51%), so multiply by 100
   */
  getPossessionMetrics(teamCode, situation = '5on5') {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    return {
      corsiPct: (teamData.corsiPercentage || 0.5) * 100,
      fenwickPct: (teamData.fenwickPercentage || 0.5) * 100,
      xGoalsPct: (teamData.xGoalsPercentage || 0.5) * 100,
      shotAttempts: teamData.shotAttemptsFor || 0,
      shotAttemptsAgainst: teamData.shotAttemptsAgainst || 0,
      faceoffWins: teamData.faceOffsWonFor || 0,
      faceoffLosses: teamData.faceOffsWonAgainst || 0,
      faceoffPct: (teamData.faceOffsWonFor + teamData.faceOffsWonAgainst) > 0
        ? (teamData.faceOffsWonFor / (teamData.faceOffsWonFor + teamData.faceOffsWonAgainst)) * 100
        : 50
    };
  }

  /**
   * Get tier based on league rank (PHASE 2)
   * @param {number} rank - League rank (1-32)
   * @returns {string} - 'ELITE', 'STRONG', 'AVERAGE', or 'WEAK'
   */
  getTier(rank) {
    if (!rank || rank < 1) return 'AVERAGE';
    if (rank <= 3) return 'ELITE';
    if (rank <= 10) return 'STRONG';
    if (rank <= 22) return 'AVERAGE';
    return 'WEAK';
  }

  /**
   * Get stat with full league context (PHASE 2)
   * Provides value, rank, percentile, league average, and tier
   * @param {string} teamCode - Team abbreviation
   * @param {string} statKey - The stat key to look up
   * @param {string} situation - Game situation (default '5on5')
   * @param {boolean} higherIsBetter - Whether higher values are better (default true)
   * @returns {object} - Complete stat context
   */
  getStatWithContext(teamCode, statKey, situation = '5on5', higherIsBetter = true) {
    const teamData = this.dataProcessor.getTeamData(teamCode, situation);
    if (!teamData) return null;

    const value = teamData[statKey];
    if (value === null || value === undefined) return null;

    const rank = this.getLeagueRank(teamCode, statKey, situation, higherIsBetter);
    const percentile = this.getPercentileRank(teamCode, statKey, situation);
    const leagueAvg = this.leagueAverages[statKey] || 0;
    
    return {
      value,
      rank,
      percentile,
      leagueAvg,
      vsLeague: value - leagueAvg,
      vsLeaguePct: leagueAvg > 0 ? ((value - leagueAvg) / leagueAvg) * 100 : 0,
      tier: this.getTier(rank)
    };
  }

  /**
   * Get special teams metrics with league context (PHASE 4 prep)
   * @param {string} teamCode - Team abbreviation
   * @returns {object} - PP and PK metrics with ranks
   */
  getSpecialTeamsMetrics(teamCode) {
    const ppData = this.dataProcessor.getTeamData(teamCode, '5on4');
    const pkData = this.dataProcessor.getTeamData(teamCode, '4on5');
    
    if (!ppData && !pkData) return null;

    return {
      powerPlay: ppData ? {
        xGF_per60: ppData.xGF_per60 || 0,
        hdXgF_per60: ppData.highDangerxGoalsFor ? (ppData.highDangerxGoalsFor / (ppData.iceTime / 3600)) : 0,
        rank: this.getLeagueRank(teamCode, 'xGF_per60', '5on4', true)
      } : null,
      penaltyKill: pkData ? {
        xGA_per60: pkData.xGA_per60 || 0,
        hdXgA_per60: pkData.highDangerxGoalsAgainst ? (pkData.highDangerxGoalsAgainst / (pkData.iceTime / 3600)) : 0,
        rank: this.getLeagueRank(teamCode, 'xGA_per60', '4on5', false)
      } : null
    };
  }

  /**
   * Get goalie metrics (PHASE 4 prep)
   * @param {string} teamCode - Team abbreviation
   * @param {object} goalieProcessor - Goalie data processor
   * @returns {object} - Team goalie averages
   */
  getGoalieMetrics(teamCode, goalieProcessor) {
    if (!goalieProcessor) return null;
    
    // Get team average goalie stats
    const teamGoalies = goalieProcessor.getGoaliesByTeam(teamCode);
    if (!teamGoalies || teamGoalies.length === 0) return null;

    let totalGSAE = 0;
    let totalHDSv = 0;
    let count = 0;

    teamGoalies.forEach(goalie => {
      totalGSAE += goalie.goalsagainstextexpected || 0;
      totalHDSv += goalie.highDangerSavePercentage || 0;
      count++;
    });

    return {
      avgGSAE: count > 0 ? totalGSAE / count : 0,
      avgHDSavePercentage: count > 0 ? totalHDSv / count : 0,
      goalieCount: count
    };
  }
}

