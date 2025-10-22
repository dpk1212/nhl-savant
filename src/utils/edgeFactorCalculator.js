/**
 * Edge Factor Calculator
 * Calculates goal impact for statistical edges and generates narratives
 */

export class EdgeFactorCalculator {
  constructor(statsAnalyzer) {
    this.analyzer = statsAnalyzer;
  }

  /**
   * Get key factors for a matchup based on bet type
   */
  getKeyFactors(awayTeam, homeTeam, betType = 'TOTAL') {
    if (betType === 'TOTAL') {
      return this.getTotalBetFactors(awayTeam, homeTeam);
    } else if (betType === 'MONEYLINE') {
      return this.getMoneylineFactors(awayTeam, homeTeam);
    } else if (betType === 'PUCKLINE') {
      return this.getPucklineFactors(awayTeam, homeTeam);
    }
    return [];
  }

  /**
   * Calculate factors for TOTAL (Over/Under) bets
   */
  getTotalBetFactors(awayTeam, homeTeam) {
    const factors = [];

    // Factor 1: High-Danger Shot Quality (CRITICAL)
    const hdFactor = this.calculateHighDangerFactor(awayTeam, homeTeam);
    if (hdFactor) factors.push(hdFactor);

    // Factor 2: Rebound Control (CRITICAL)
    const reboundFactor = this.calculateReboundFactor(awayTeam, homeTeam);
    if (reboundFactor) factors.push(reboundFactor);

    // Factor 3: Shot Blocking & Physical Defense (HIGH)
    const physicalFactor = this.calculatePhysicalFactor(awayTeam, homeTeam);
    if (physicalFactor) factors.push(physicalFactor);

    // Factor 4: Defensive Zone Discipline (HIGH)
    const disciplineFactor = this.calculateDisciplineFactor(awayTeam, homeTeam);
    if (disciplineFactor) factors.push(disciplineFactor);

    // Factor 5: Special Teams Quality (HIGH)
    const stFactor = this.calculateSpecialTeamsFactor(awayTeam, homeTeam);
    if (stFactor) factors.push(stFactor);

    // Factor 6: Shooting Talent vs Luck (MODERATE)
    const regressionFactor = this.calculateRegressionFactor(awayTeam, homeTeam);
    if (regressionFactor) factors.push(regressionFactor);

    return factors;
  }

  /**
   * Calculate high-danger shot quality factor
   */
  calculateHighDangerFactor(awayTeam, homeTeam) {
    const awayHD = this.analyzer.getHighDangerMetrics(awayTeam);
    const homeHD = this.analyzer.getHighDangerMetrics(homeTeam);
    
    if (!awayHD || !homeHD) return null;

    // Away offense vs Home defense
    const awayOffVsHomeDef = awayHD.hdXgfPer60 - homeHD.hdXgaPer60;
    // Home offense vs Away defense  
    const homeOffVsAwayDef = homeHD.hdXgfPer60 - awayHD.hdXgaPer60;

    // Net impact (negative = favors under, positive = favors over)
    const netImpact = (awayOffVsHomeDef + homeOffVsAwayDef) / 2;
    const goalImpact = netImpact * 0.25; // Scale to goals per game

    // Get rankings
    const awayOffRank = this.analyzer.getLeagueRank(awayTeam, 'highDangerxGoalsFor', '5on5', true);
    const homeDefRank = this.analyzer.getLeagueRank(homeTeam, 'highDangerxGoalsAgainst', '5on5', false);

    // Determine which side has the advantage
    const advantage = awayOffVsHomeDef > homeOffVsAwayDef ? awayTeam : 
                     homeOffVsAwayDef > awayOffVsHomeDef ? homeTeam : 'even';

    return {
      name: 'High-Danger Shot Quality',
      importance: 'CRITICAL',
      stars: 3,
      impact: goalImpact,
      awayMetric: {
        value: awayHD.hdXgfPer60,
        rank: awayOffRank,
        label: `${awayTeam} Offense (HD-xGF/60)`,
        detail: `${awayHD.hdGoalsFor} HD goals scored`
      },
      homeMetric: {
        value: homeHD.hdXgaPer60,
        rank: homeDefRank,
        label: `${homeTeam} Defense (HD-xGA/60)`,
        detail: `${homeHD.hdGoalsAgainst} HD goals allowed`
      },
      leagueAvg: this.analyzer.leagueAverages.hdXgfPer60 || 0.85,
      explanation: advantage === 'even'
        ? 'Evenly matched high-danger shot creation and prevention. Both teams effective in key scoring areas.'
        : `${advantage} has the edge in high-danger situations. ${
            Math.abs(goalImpact) > 0.05
              ? `Quality scoring chances favor this matchup by ~${Math.abs(goalImpact * 3).toFixed(1)} HD shots/game.`
              : 'Marginal difference in quality chances.'
          }`,
      dataPoints: {
        awayHDShots: awayHD.hdShotsFor,
        homeHDAllowed: homeHD.hdShotsAgainst,
        awayAdvantage: awayOffVsHomeDef,
        homeAdvantage: homeOffVsAwayDef
      }
    };
  }

  /**
   * Calculate rebound control factor
   */
  calculateReboundFactor(awayTeam, homeTeam) {
    const awayReb = this.analyzer.getReboundMetrics(awayTeam);
    const homeReb = this.analyzer.getReboundMetrics(homeTeam);
    
    if (!awayReb || !homeReb) return null;

    // Compare OFFENSE vs DEFENSE (apples to apples)
    // Away offense (creating rebounds) vs Home defense (limiting rebounds)
    const awayOffVsHomeDef = awayReb.rebXgfPer60 - homeReb.rebXgaPer60;
    // Home offense (creating rebounds) vs Away defense (limiting rebounds)
    const homeOffVsAwayDef = homeReb.rebXgfPer60 - awayReb.rebXgaPer60;
    
    const netImpact = (awayOffVsHomeDef + homeOffVsAwayDef) / 2;
    const goalImpact = netImpact * 0.15; // Rebounds account for ~15% of goals

    // Determine which side has the advantage
    const advantage = awayOffVsHomeDef > homeOffVsAwayDef ? awayTeam : 
                     homeOffVsAwayDef > awayOffVsHomeDef ? homeTeam : 'even';

    return {
      name: 'Rebound Control & Second Chances',
      importance: 'CRITICAL',
      stars: 3,
      impact: goalImpact,
      awayMetric: {
        value: awayReb.rebXgfPer60,
        rank: this.analyzer.getLeagueRank(awayTeam, 'xReboundsFor', '5on5', true),
        label: `${awayTeam} Offense (Reb xGF/60)`,
        detail: `${awayReb.rebGoalsFor} rebound goals scored`
      },
      homeMetric: {
        value: homeReb.rebXgaPer60,
        rank: this.analyzer.getLeagueRank(homeTeam, 'xReboundsAgainst', '5on5', false),
        label: `${homeTeam} Defense (Reb xGA/60)`,
        detail: `${homeReb.rebGoalsAgainst} rebound goals allowed`
      },
      leagueAvg: this.analyzer.leagueAverages.rebXgfPer60 || 10.0,
      explanation: advantage === 'even' 
        ? 'Evenly matched rebound creation and control. Expect typical second-chance opportunities.'
        : `${advantage} creates more second-chance opportunities in this matchup. ${
            Math.abs(goalImpact) > 0.05 
              ? `Could add ~${Math.abs(goalImpact * 2).toFixed(1)} extra scoring chances.`
              : 'Minor impact on total scoring.'
          }`,
      dataPoints: {
        awayRebGoals: awayReb.rebGoalsFor,
        homeRebAllowed: homeReb.rebGoalsAgainst,
        awayAdvantage: awayOffVsHomeDef,
        homeAdvantage: homeOffVsAwayDef
      }
    };
  }

  /**
   * Calculate shot blocking and physical play factor
   */
  calculatePhysicalFactor(awayTeam, homeTeam) {
    const awayPhys = this.analyzer.getPhysicalMetrics(awayTeam);
    const homePhys = this.analyzer.getPhysicalMetrics(homeTeam);
    
    if (!awayPhys || !homePhys) return null;

    // Shot blocking effectiveness
    const awayBlocksOpp = homePhys.blockedShotsAgainst;
    const homeBlocksOpp = awayPhys.blockedShotsAgainst;
    
    const avgBlockingRate = this.analyzer.leagueAverages.blocksAgainstPer60 || 30;
    const blockingAdvantage = ((awayPhys.blockingRate + homePhys.blockingRate) / 2 - avgBlockingRate);
    
    // Each 5% increase in blocking reduces goals by ~0.08
    const goalImpact = -(blockingAdvantage / 5) * 0.08;

    const homeBlockRank = this.analyzer.getLeagueRank(homeTeam, 'blockedShotAttemptsAgainst', '5on5', true);

    return {
      name: 'Shot Blocking & Physical Defense',
      importance: 'HIGH',
      stars: 2,
      impact: goalImpact,
      awayMetric: {
        value: awayPhys.blockingRate,
        label: `${awayTeam} Shot Block %`,
        detail: `${awayPhys.blockedShotsAgainst} blocks`
      },
      homeMetric: {
        value: homePhys.blockingRate,
        rank: homeBlockRank,
        label: `${homeTeam} Shot Block %`,
        detail: `${homePhys.blockedShotsAgainst} blocks`
      },
      leagueAvg: avgBlockingRate,
      explanation: `Physical teams that block shots effectively reduce scoring chances. ${
        goalImpact < 0
          ? `Above-average blocking removes ${Math.abs(goalImpact * 10).toFixed(1)} shot attempts/game.`
          : `Below-average blocking allows more dangerous attempts.`
      }`,
      dataPoints: {
        awayBlocks: awayPhys.blockedShotsAgainst,
        homeBlocks: homePhys.blockedShotsAgainst,
        awayHits: awayPhys.hits,
        homeHits: homePhys.hits
      }
    };
  }

  /**
   * Calculate defensive zone discipline factor
   */
  calculateDisciplineFactor(awayTeam, homeTeam) {
    const awayPhys = this.analyzer.getPhysicalMetrics(awayTeam);
    const homePhys = this.analyzer.getPhysicalMetrics(homeTeam);
    
    if (!awayPhys || !homePhys) return null;

    // Lower DZ giveaways = better defense
    const avgDZGiveaways = this.analyzer.leagueAverages.dZoneGiveawaysFor || 12;
    const combinedDZGA = (awayPhys.dZoneGiveawaysPer60 + homePhys.dZoneGiveawaysPer60) / 2;
    
    // Each DZ giveaway below average reduces goals by ~0.02
    const giveawayDiff = avgDZGiveaways - combinedDZGA;
    const goalImpact = giveawayDiff * 0.02;

    // Takeaway pressure
    const avgTakeaways = this.analyzer.leagueAverages.takeawaysFor || 7;
    const combinedTakeaways = (awayPhys.takeawaysPer60 + homePhys.takeawaysPer60) / 2;
    const takeawayBonus = (combinedTakeaways - avgTakeaways) * 0.015;

    const totalImpact = goalImpact + takeawayBonus;

    return {
      name: 'Defensive Zone Discipline',
      importance: 'HIGH',
      stars: 2,
      impact: -Math.abs(totalImpact), // Always negative for totals (good defense = under)
      awayMetric: {
        value: awayPhys.dZoneGiveaways,
        label: `${awayTeam} DZ Giveaways`,
        detail: `${awayPhys.takeaways} takeaways`
      },
      homeMetric: {
        value: homePhys.dZoneGiveaways,
        label: `${homeTeam} DZ Giveaways`,
        detail: `${homePhys.takeaways} takeaways`
      },
      leagueAvg: avgDZGiveaways,
      explanation: `Careful puck management in the defensive zone prevents high-danger chances. ${
        totalImpact < 0
          ? `Both teams are disciplined, limiting turnovers.`
          : `Defensive mistakes create extra opportunities.`
      }`,
      dataPoints: {
        awayDZGA: awayPhys.dZoneGiveaways,
        homeDZGA: homePhys.dZoneGiveaways,
        awayTakeaways: awayPhys.takeaways,
        homeTakeaways: homePhys.takeaways
      }
    };
  }

  /**
   * Calculate special teams factor
   */
  calculateSpecialTeamsFactor(awayTeam, homeTeam) {
    // Get PP and PK data
    const awayPP = this.analyzer.getHighDangerMetrics(awayTeam, '5on4');
    const homePK = this.analyzer.getHighDangerMetrics(homeTeam, '4on5');
    const homePP = this.analyzer.getHighDangerMetrics(homeTeam, '5on4');
    const awayPK = this.analyzer.getHighDangerMetrics(awayTeam, '4on5');

    if (!awayPP || !homePK || !homePP || !awayPK) return null;

    // Away PP vs Home PK
    const awayPPEdge = (awayPP.hdXgfPer60 || 0) - (homePK.hdXgaPer60 || 0);
    // Home PP vs Away PK
    const homePPEdge = (homePP.hdXgfPer60 || 0) - (awayPK.hdXgaPer60 || 0);

    // Assume ~2-3 PP opportunities per game, ~2 minutes each = 4-6 minutes
    // That's ~7% of game time
    const ppImpactFactor = 0.07;
    const goalImpact = ((awayPPEdge + homePPEdge) / 2) * ppImpactFactor;

    return {
      name: 'Special Teams Matchup',
      importance: 'HIGH',
      stars: 2,
      impact: goalImpact,
      awayMetric: {
        value: awayPP.hdXgfPer60 || 0,
        label: `${awayTeam} PP HD-xGF/60`,
        detail: `vs ${homePK.hdXgaPer60?.toFixed(2) || 0} PK`
      },
      homeMetric: {
        value: homePP.hdXgfPer60 || 0,
        label: `${homeTeam} PP HD-xGF/60`,
        detail: `vs ${awayPK.hdXgaPer60?.toFixed(2) || 0} PK`
      },
      leagueAvg: 8.5,
      explanation: `Power plays account for ~7% of game time but can swing totals significantly. ${
        Math.abs(goalImpact) < 0.1
          ? `Both matchups are balanced - PP and PK quality neutralize.`
          : goalImpact > 0 
            ? `Power plays have the advantage, adding ${goalImpact.toFixed(2)} expected goals.`
            : `Penalty kills are dominant, limiting PP opportunities.`
      }`,
      dataPoints: {
        awayPPQuality: awayPP.hdXgfPer60,
        homePKQuality: homePK.hdXgaPer60,
        homePPQuality: homePP.hdXgfPer60,
        awayPKQuality: awayPK.hdXgaPer60
      }
    };
  }

  /**
   * Calculate shooting regression factor
   */
  calculateRegressionFactor(awayTeam, homeTeam) {
    const awayRegression = this.analyzer.getRegressionIndicators(awayTeam);
    const homeRegression = this.analyzer.getRegressionIndicators(homeTeam);
    
    if (!awayRegression || !homeRegression) return null;

    // Calculate expected regression in goals per game
    const awayRegressionImpact = awayRegression.goalsVsExpected / (awayRegression.gamesSoFar || 8);
    const homeRegressionImpact = homeRegression.goalsVsExpected / (homeRegression.gamesSoFar || 8);

    // Dampen regression by 60% (it won't fully correct in one game)
    const goalImpact = ((awayRegressionImpact + homeRegressionImpact) * -0.4);

    return {
      name: 'Shooting Talent vs Luck',
      importance: 'MODERATE',
      stars: 1,
      impact: goalImpact,
      awayMetric: {
        value: awayRegression.shootingPct,
        label: `${awayTeam} Shooting %`,
        detail: `${awayRegression.pdo.toFixed(1)} PDO`
      },
      homeMetric: {
        value: homeRegression.shootingPct,
        label: `${homeTeam} Shooting %`,
        detail: `${homeRegression.pdo.toFixed(1)} PDO`
      },
      leagueAvg: awayRegression.expectedShPct || 10,
      explanation: `Teams shooting ${awayRegression.isUnderperforming || homeRegression.isUnderperforming ? 'below' : 'above'} their expected rates should regress toward the mean. ${
        goalImpact < 0
          ? `Cold shooting is due for a bounce-back, adding ~${Math.abs(goalImpact).toFixed(2)} goals.`
          : `Hot shooting should cool off slightly.`
      }`,
      dataPoints: {
        awayPDO: awayRegression.pdo,
        homePDO: homeRegression.pdo,
        awayGoalsVsXg: awayRegression.goalsVsExpected,
        homeGoalsVsXg: homeRegression.goalsVsExpected
      }
    };
  }

  /**
   * Generate "The Story" narrative from factors
   */
  generateStory(factors, awayTeam, homeTeam) {
    if (!factors || factors.length === 0) return "Analyzing statistical matchup...";

    // Sort by absolute impact
    const sortedFactors = [...factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    const topFactors = sortedFactors.slice(0, 3);

    const totalImpact = factors.reduce((sum, f) => sum + f.impact, 0);
    const favorsUnder = totalImpact < 0;

    // Build narrative
    let story = "";

    // Mention top factor
    const top = topFactors[0];
    if (top.importance === 'CRITICAL') {
      story += `${top.name.toLowerCase()} is the key driver. `;
    }

    // Describe overall matchup
    if (favorsUnder) {
      story += `Strong defensive metrics suggest a low-scoring affair. `;
    } else {
      story += `Offensive advantages point to a higher-scoring game. `;
    }

    // Add specific details from top factors
    topFactors.forEach((factor, idx) => {
      if (idx < 2 && factor.explanation) {
        const shortExplanation = factor.explanation.split('.')[0];
        if (shortExplanation && shortExplanation.length < 100) {
          story += shortExplanation + ". ";
        }
      }
    });

    // Conclusion
    const absImpact = Math.abs(totalImpact);
    if (absImpact > 0.5) {
      story += `Combined factors create a ${absImpact.toFixed(1)}-goal edge ${favorsUnder ? 'UNDER' : 'OVER'} market expectations.`;
    } else {
      story += `Statistical edges are modest, suggesting the market line is fairly efficient.`;
    }

    return story;
  }

  /**
   * Calculate total weighted goal impact
   */
  calculateTotalImpact(factors) {
    if (!factors || factors.length === 0) return 0;
    return factors.reduce((sum, factor) => sum + factor.impact, 0);
  }

  /**
   * Calculate factors for MONEYLINE bets
   * Focus on factors that predict WHO will win, not total goals
   */
  getMoneylineFactors(awayTeam, homeTeam) {
    const factors = [];

    // Factor 1: Expected Goals Differential (CRITICAL)
    const xgFactor = this.calculateExpectedGoalsDifferential(awayTeam, homeTeam);
    if (xgFactor) factors.push(xgFactor);

    // Factor 2: Goalie Advantage (CRITICAL)
    const goalieFactor = this.calculateGoalieAdvantage(awayTeam, homeTeam);
    if (goalieFactor) factors.push(goalieFactor);

    // Factor 3: Offensive Rating (HIGH)
    const offenseFactor = this.calculateOffensiveRating(awayTeam, homeTeam);
    if (offenseFactor) factors.push(offenseFactor);

    // Factor 4: Defensive Rating (HIGH)
    const defenseFactor = this.calculateDefensiveRating(awayTeam, homeTeam);
    if (defenseFactor) factors.push(defenseFactor);

    // Factor 5: Special Teams Edge (MODERATE)
    const stEdge = this.calculateSpecialTeamsEdge(awayTeam, homeTeam);
    if (stEdge) factors.push(stEdge);

    // Factor 6: Possession & Control (MODERATE)
    const possessionFactor = this.calculatePossessionAdvantage(awayTeam, homeTeam);
    if (possessionFactor) factors.push(possessionFactor);

    return factors;
  }

  /**
   * Calculate expected goals differential for moneyline
   */
  calculateExpectedGoalsDifferential(awayTeam, homeTeam) {
    const awayStats = this.analyzer.dataProcessor.getTeamData(awayTeam, '5on5');
    const homeStats = this.analyzer.dataProcessor.getTeamData(homeTeam, '5on5');
    
    if (!awayStats || !homeStats) return null;

    // Calculate per-60 rates from raw data
    const awayIceTime = awayStats.iceTime / 60; // Convert seconds to minutes
    const homeIceTime = homeStats.iceTime / 60;
    
    const awayXgfPer60 = ((awayStats.xGoalsFor || 0) / awayIceTime) * 60;
    const awayXgaPer60 = ((awayStats.xGoalsAgainst || 0) / awayIceTime) * 60;
    const homeXgfPer60 = ((homeStats.xGoalsFor || 0) / homeIceTime) * 60;
    const homeXgaPer60 = ((homeStats.xGoalsAgainst || 0) / homeIceTime) * 60;

    // Calculate expected goals for each team in this matchup
    const awayExpectedGoals = (awayXgfPer60 + homeXgaPer60) / 2;
    const homeExpectedGoals = (homeXgfPer60 + awayXgaPer60) / 2;
    
    const differential = awayExpectedGoals - homeExpectedGoals;

    return {
      name: 'Expected Goals',
      importance: 'CRITICAL',
      stars: 3,
      impact: differential,
      awayMetric: {
        value: awayExpectedGoals,
        rank: this.analyzer.getLeagueRank(awayTeam, 'xGoalsFor', '5on5', true),
        label: `${awayTeam} Expected Goals`,
        detail: `${awayXgfPer60.toFixed(2)} xGF/60`
      },
      homeMetric: {
        value: homeExpectedGoals,
        rank: this.analyzer.getLeagueRank(homeTeam, 'xGoalsFor', '5on5', true),
        label: `${homeTeam} Expected Goals`,
        detail: `${homeXgfPer60.toFixed(2)} xGF/60`
      },
      leagueAvg: 2.8,
      explanation: differential > 0 
        ? `${awayTeam} projects to score ${Math.abs(differential).toFixed(2)} more goals based on shot quality.`
        : `${homeTeam} projects to score ${Math.abs(differential).toFixed(2)} more goals based on shot quality.`,
      dataPoints: {
        awayXgf: awayXgfPer60,
        awayXga: awayXgaPer60,
        homeXgf: homeXgfPer60,
        homeXga: homeXgaPer60
      }
    };
  }

  /**
   * Calculate goalie advantage for moneyline
   * NOTE: Goalie advantage is already factored into predictions via adjustForGoalie()
   * Skipping this factor to avoid redundancy and method availability issues
   */
  calculateGoalieAdvantage(awayTeam, homeTeam) {
    // Goalie impact is already included in the prediction model
    // No need to duplicate it as a separate factor
    return null;
  }

  /**
   * Calculate offensive rating
   */
  calculateOffensiveRating(awayTeam, homeTeam) {
    const awayHD = this.analyzer.getHighDangerMetrics(awayTeam);
    const homeHD = this.analyzer.getHighDangerMetrics(homeTeam);
    
    if (!awayHD || !homeHD) return null;

    const awayOffense = awayHD.hdXgfPer60 || 0;
    const homeOffense = homeHD.hdXgfPer60 || 0;
    
    const differential = awayOffense - homeOffense;
    const impact = differential * 0.2; // Scale to goal impact

    return {
      name: 'Offensive Rating',
      importance: 'HIGH',
      stars: 2,
      impact: impact,
      awayMetric: {
        value: awayOffense,
        rank: this.analyzer.getLeagueRank(awayTeam, 'highDangerxGoalsFor', '5on5', true),
        label: `${awayTeam} HD-xGF/60`,
        detail: `${awayHD.hdGoalsFor} HD goals`
      },
      homeMetric: {
        value: homeOffense,
        rank: this.analyzer.getLeagueRank(homeTeam, 'highDangerxGoalsFor', '5on5', true),
        label: `${homeTeam} HD-xGF/60`,
        detail: `${homeHD.hdGoalsFor} HD goals`
      },
      leagueAvg: 0.85,
      explanation: differential > 0
        ? `${awayTeam} generates ${((differential / homeOffense) * 100).toFixed(0)}% more high-danger chances.`
        : `${homeTeam} generates ${((Math.abs(differential) / awayOffense) * 100).toFixed(0)}% more high-danger chances.`,
      dataPoints: {
        awayHDGoals: awayHD.hdGoalsFor,
        homeHDGoals: homeHD.hdGoalsFor
      }
    };
  }

  /**
   * Calculate defensive rating
   */
  calculateDefensiveRating(awayTeam, homeTeam) {
    const awayHD = this.analyzer.getHighDangerMetrics(awayTeam);
    const homeHD = this.analyzer.getHighDangerMetrics(homeTeam);
    
    if (!awayHD || !homeHD) return null;

    const awayDefense = awayHD.hdXgaPer60 || 0;
    const homeDefense = homeHD.hdXgaPer60 || 0;
    
    // Lower is better for defense, so flip the sign
    const differential = homeDefense - awayDefense;
    const impact = differential * 0.2; // Scale to goal impact

    return {
      name: 'Defensive Rating',
      importance: 'HIGH',
      stars: 2,
      impact: impact,
      awayMetric: {
        value: awayDefense,
        rank: this.analyzer.getLeagueRank(awayTeam, 'highDangerxGoalsAgainst', '5on5', false),
        label: `${awayTeam} HD-xGA/60`,
        detail: `${awayHD.hdGoalsAgainst} HD goals allowed`
      },
      homeMetric: {
        value: homeDefense,
        rank: this.analyzer.getLeagueRank(homeTeam, 'highDangerxGoalsAgainst', '5on5', false),
        label: `${homeTeam} HD-xGA/60`,
        detail: `${homeHD.hdGoalsAgainst} HD goals allowed`
      },
      leagueAvg: 0.85,
      explanation: differential > 0
        ? `${awayTeam} allows ${((differential / homeDefense) * 100).toFixed(0)}% fewer high-danger chances.`
        : `${homeTeam} allows ${((Math.abs(differential) / awayDefense) * 100).toFixed(0)}% fewer high-danger chances.`,
      dataPoints: {
        awayHDAllowed: awayHD.hdGoalsAgainst,
        homeHDAllowed: homeHD.hdGoalsAgainst
      }
    };
  }

  /**
   * Calculate special teams edge for moneyline
   */
  calculateSpecialTeamsEdge(awayTeam, homeTeam) {
    const awayPP = this.analyzer.getHighDangerMetrics(awayTeam, '5on4');
    const homePP = this.analyzer.getHighDangerMetrics(homeTeam, '5on4');
    
    if (!awayPP || !homePP) return null;

    const awayPPQuality = awayPP.hdXgfPer60 || 0;
    const homePPQuality = homePP.hdXgfPer60 || 0;
    
    const differential = awayPPQuality - homePPQuality;
    const impact = differential * 0.05; // PP accounts for ~7% of game, dampened

    return {
      name: 'Special Teams',
      importance: 'MODERATE',
      stars: 1,
      impact: impact,
      awayMetric: {
        value: awayPPQuality,
        label: `${awayTeam} PP Quality`,
        detail: `${awayPPQuality.toFixed(2)} HD-xGF/60`
      },
      homeMetric: {
        value: homePPQuality,
        label: `${homeTeam} PP Quality`,
        detail: `${homePPQuality.toFixed(2)} HD-xGF/60`
      },
      leagueAvg: 8.5,
      explanation: differential > 0
        ? `${awayTeam} has superior power play execution.`
        : `${homeTeam} has superior power play execution.`,
      dataPoints: {
        awayPP: awayPPQuality,
        homePP: homePPQuality
      }
    };
  }

  /**
   * Calculate possession advantage for moneyline
   */
  calculatePossessionAdvantage(awayTeam, homeTeam) {
    const awayPoss = this.analyzer.getPossessionMetrics(awayTeam);
    const homePoss = this.analyzer.getPossessionMetrics(homeTeam);
    
    if (!awayPoss || !homePoss) return null;

    const awayCF = awayPoss.corsiForPct || 50;
    const homeCF = homePoss.corsiForPct || 50;
    
    const differential = awayCF - homeCF;
    const impact = differential * 0.02; // Each 1% CF% worth ~0.02 goals

    return {
      name: 'Possession & Control',
      importance: 'MODERATE',
      stars: 1,
      impact: impact,
      awayMetric: {
        value: awayCF,
        label: `${awayTeam} Corsi%`,
        detail: `${awayPoss.shotsForPct?.toFixed(1)}% shots`
      },
      homeMetric: {
        value: homeCF,
        label: `${homeTeam} Corsi%`,
        detail: `${homePoss.shotsForPct?.toFixed(1)}% shots`
      },
      leagueAvg: 50,
      explanation: differential > 0
        ? `${awayTeam} controls ${Math.abs(differential).toFixed(1)}% more of the play.`
        : `${homeTeam} controls ${Math.abs(differential).toFixed(1)}% more of the play.`,
      dataPoints: {
        awayCF,
        homeCF,
        awaySF: awayPoss.shotsForPct,
        homeSF: homePoss.shotsForPct
      }
    };
  }

  getPucklineFactors(awayTeam, homeTeam) {
    // TODO: Implement puckline-specific factors
    return [];
  }
}

