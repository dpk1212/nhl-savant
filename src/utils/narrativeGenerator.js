/**
 * Narrative Generator - Creates plain-English explanations for betting predictions
 */

import { getTeamName } from './oddsTraderParser.js';

/**
 * Generate a narrative explanation for a specific bet
 * @param {Object} game - Game data with teams and predictions
 * @param {Object} edge - Edge data with EV, probabilities, and market info
 * @param {Object} dataProcessor - Data processor for team stats
 * @returns {Object} - Narrative with headline and detailed bullets
 */
export function generateBetNarrative(game, edge, dataProcessor) {
  if (!game || !edge || !dataProcessor) return null;

  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;
  const market = edge.market;
  const pick = edge.pick;

  // Get team data for narrative
  const away_5v5 = dataProcessor.getTeamData(awayTeam, '5on5');
  const home_5v5 = dataProcessor.getTeamData(homeTeam, '5on5');
  const away_PP = dataProcessor.getTeamData(awayTeam, '5on4');
  const home_PP = dataProcessor.getTeamData(homeTeam, '5on4');
  const away_PK = dataProcessor.getTeamData(awayTeam, '4on5');
  const home_PK = dataProcessor.getTeamData(homeTeam, '4on5');

  if (!away_5v5 || !home_5v5) return null;

  // Calculate PDO for regression analysis
  const awayPDO = dataProcessor.calculatePDO(
    away_5v5.goalsFor,
    away_5v5.shotsOnGoalFor,
    away_5v5.goalsAgainst,
    away_5v5.shotsOnGoalAgainst
  );
  const homePDO = dataProcessor.calculatePDO(
    home_5v5.goalsFor,
    home_5v5.shotsOnGoalFor,
    home_5v5.goalsAgainst,
    home_5v5.shotsOnGoalAgainst
  );

  let headline = '';
  let bullets = [];
  let icon = '';

  if (market === 'TOTAL') {
    const isOver = pick.toUpperCase().includes('OVER');
    const predictedTotal = game.edges.total.predictedTotal;
    const marketTotal = game.edges.total.marketTotal;
    const difference = Math.abs(predictedTotal - marketTotal);

    if (isOver) {
      icon = '🔥';
      headline = `Offensive matchup projects ${predictedTotal.toFixed(1)} goals (market ${marketTotal.toFixed(1)})`;
      
      // Explain offensive matchup advantages
      const awayOffenseRank = away_5v5.xGF_per60 > 2.7 ? 'elite' : away_5v5.xGF_per60 > 2.5 ? 'strong' : 'average';
      const homeOffenseRank = home_5v5.xGF_per60 > 2.7 ? 'elite' : home_5v5.xGF_per60 > 2.5 ? 'strong' : 'average';
      
      if (away_5v5.xGF_per60 > 2.5) {
        bullets.push(`✓ ${getTeamName(awayTeam)}: ${awayOffenseRank} offense generating ${away_5v5.xGF_per60.toFixed(2)} xGF/60 (quality chances)`);
      }
      if (home_5v5.xGF_per60 > 2.5) {
        bullets.push(`✓ ${getTeamName(homeTeam)}: ${homeOffenseRank} offense generating ${home_5v5.xGF_per60.toFixed(2)} xGF/60 (quality chances)`);
      }
      
      // Explain defensive vulnerabilities
      if (away_5v5.xGA_per60 > 2.7) {
        const rank = away_5v5.xGA_per60 > 2.9 ? 'bottom-10' : 'below-average';
        bullets.push(`✓ ${getTeamName(awayTeam)}: ${rank} defense bleeds ${away_5v5.xGA_per60.toFixed(2)} xGA/60 (allows dangerous looks)`);
      }
      if (home_5v5.xGA_per60 > 2.7) {
        const rank = home_5v5.xGA_per60 > 2.9 ? 'bottom-10' : 'below-average';
        bullets.push(`✓ ${getTeamName(homeTeam)}: ${rank} defense bleeds ${home_5v5.xGA_per60.toFixed(2)} xGA/60 (allows dangerous looks)`);
      }

      // PP/PK matchup advantages
      if (away_PP && home_PK && away_PP.xGF_per60 > 6.0) {
        bullets.push(`⚡ ${getTeamName(awayTeam)} elite PP (${away_PP.xGF_per60.toFixed(1)} xGF/60) vs vulnerable PK = power play opportunities`);
      }
      if (home_PP && away_PK && home_PP.xGF_per60 > 6.0) {
        bullets.push(`⚡ ${getTeamName(homeTeam)} elite PP (${home_PP.xGF_per60.toFixed(1)} xGF/60) vs vulnerable PK = power play opportunities`);
      }

    } else {
      icon = '❄️';
      headline = `Defensive structure projects ${predictedTotal.toFixed(1)} goals (market ${marketTotal.toFixed(1)})`;
      
      // Explain defensive strengths
      const awayDefenseRank = away_5v5.xGA_per60 < 2.2 ? 'elite (top-10)' : away_5v5.xGA_per60 < 2.4 ? 'strong (top-third)' : 'solid';
      const homeDefenseRank = home_5v5.xGA_per60 < 2.2 ? 'elite (top-10)' : home_5v5.xGA_per60 < 2.4 ? 'strong (top-third)' : 'solid';
      
      if (away_5v5.xGA_per60 < 2.4) {
        bullets.push(`🛡️ ${getTeamName(awayTeam)}: ${awayDefenseRank} defense limits quality chances to ${away_5v5.xGA_per60.toFixed(2)} xGA/60`);
      }
      if (home_5v5.xGA_per60 < 2.4) {
        bullets.push(`🛡️ ${getTeamName(homeTeam)}: ${homeDefenseRank} defense limits quality chances to ${home_5v5.xGA_per60.toFixed(2)} xGA/60`);
      }
      
      // Explain offensive struggles
      if (away_5v5.xGF_per60 < 2.3) {
        const issue = away_5v5.xGF_per60 < 2.0 ? 'bottom-10 offense' : 'struggling offense';
        bullets.push(`✓ ${getTeamName(awayTeam)}: ${issue} generates only ${away_5v5.xGF_per60.toFixed(2)} xGF/60 (limited chances)`);
      }
      if (home_5v5.xGF_per60 < 2.3) {
        const issue = home_5v5.xGF_per60 < 2.0 ? 'bottom-10 offense' : 'struggling offense';
        bullets.push(`✓ ${getTeamName(homeTeam)}: ${issue} generates only ${home_5v5.xGF_per60.toFixed(2)} xGF/60 (limited chances)`);
      }
    }

    // Add PDO regression insights with betting context
    if (awayPDO > 102) {
      const impact = isOver ? 'UNDER bet' : 'may regress';
      bullets.push(`⚠️ ${getTeamName(awayTeam)}: PDO ${awayPDO.toFixed(1)} (hot shooting/goaltending luck unsustainable — favors ${impact})`);
    } else if (awayPDO < 98) {
      const impact = isOver ? 'OVER potential' : 'bounce-back candidate';
      bullets.push(`📈 ${getTeamName(awayTeam)}: PDO ${awayPDO.toFixed(1)} (unlucky results should normalize — ${impact})`);
    }
    
    if (homePDO > 102) {
      const impact = isOver ? 'UNDER bet' : 'may regress';
      bullets.push(`⚠️ ${getTeamName(homeTeam)}: PDO ${homePDO.toFixed(1)} (hot shooting/goaltending luck unsustainable — favors ${impact})`);
    } else if (homePDO < 98) {
      const impact = isOver ? 'OVER potential' : 'bounce-back candidate';
      bullets.push(`📈 ${getTeamName(homeTeam)}: PDO ${homePDO.toFixed(1)} (unlucky results should normalize — ${impact})`);
    }

  } else if (market === 'MONEYLINE') {
    const isAway = pick === getTeamName(awayTeam);
    const favoredTeam = isAway ? awayTeam : homeTeam;
    const favoredTeamName = getTeamName(favoredTeam);
    const favoredTeam_5v5 = isAway ? away_5v5 : home_5v5;
    const underdog_5v5 = isAway ? home_5v5 : away_5v5;
    const underdogTeam = isAway ? homeTeam : awayTeam;
    const underdogName = getTeamName(underdogTeam);
    
    const winProb = edge.modelProb * 100;
    
    icon = isAway ? '✈️' : '🏠';
    headline = `${pick}: ${winProb.toFixed(0)}% win probability creates value at current odds`;
    
    // Explain xG differential advantage
    const xgDiff = (favoredTeam_5v5.xGF_per60 - favoredTeam_5v5.xGA_per60).toFixed(2);
    const oppDiff = (underdog_5v5.xGF_per60 - underdog_5v5.xGA_per60).toFixed(2);
    bullets.push(`✓ ${favoredTeamName}: +${xgDiff} xGD/60 vs ${underdogName}'s ${oppDiff} xGD/60 (controls play better)`);
    
    // Explain specific matchup advantages
    if (favoredTeam_5v5.xGF_per60 > underdog_5v5.xGF_per60 + 0.3) {
      const offensiveTier = favoredTeam_5v5.xGF_per60 > 2.7 ? 'elite' : 'superior';
      bullets.push(`⚔️ Offense: ${favoredTeamName} ${offensiveTier} (${favoredTeam_5v5.xGF_per60.toFixed(2)} xGF) outpaces ${underdogName} (${underdog_5v5.xGF_per60.toFixed(2)} xGF)`);
    }
    
    if (favoredTeam_5v5.xGA_per60 < underdog_5v5.xGA_per60 - 0.3) {
      const defensiveTier = favoredTeam_5v5.xGA_per60 < 2.3 ? 'elite' : 'superior';
      bullets.push(`🛡️ Defense: ${favoredTeamName} ${defensiveTier} (${favoredTeam_5v5.xGA_per60.toFixed(2)} xGA) limits opponents better than ${underdogName} (${underdog_5v5.xGA_per60.toFixed(2)} xGA)`);
    }

    // PDO regression angle for moneyline
    const favoredPDO = isAway ? awayPDO : homePDO;
    const underdogPDO = isAway ? homePDO : awayPDO;
    
    if (favoredPDO < 98) {
      bullets.push(`📈 Value angle: ${favoredTeamName} PDO ${favoredPDO.toFixed(1)} (been unlucky, results should improve)`);
    } else if (underdogPDO > 102) {
      bullets.push(`⚠️ Regression angle: ${underdogName} PDO ${underdogPDO.toFixed(1)} (overperforming, due to cool off)`);
    }
  }

  // Enhanced EV summary with confidence
  const confidence = edge.evPercent > 10 ? 'ELITE' : edge.evPercent > 7 ? 'HIGH' : edge.evPercent > 5 ? 'GOOD' : 'MODERATE';
  bullets.push(`💰 Value: ${edge.evPercent > 0 ? '+' : ''}${edge.evPercent.toFixed(1)}% EV at ${edge.odds > 0 ? '+' : ''}${edge.odds} | Confidence: ${confidence}`);

  return {
    icon,
    headline,
    bullets
  };
}

/**
 * Generate a compact one-line summary for table display
 * @param {Object} game - Game data
 * @param {Object} edge - Edge data
 * @param {Object} dataProcessor - Data processor
 * @returns {string} - Compact narrative
 */
export function generateCompactNarrative(game, edge, dataProcessor) {
  const fullNarrative = generateBetNarrative(game, edge, dataProcessor);
  if (!fullNarrative) return 'Analyzing matchup...';
  
  return `${fullNarrative.icon} ${fullNarrative.headline}`;
}

/**
 * Get emoji/icon for team status based on PDO and xG
 * @param {Object} team_5v5 - Team 5v5 data
 * @param {number} PDO - Team PDO
 * @returns {string} - Status icon
 */
export function getTeamStatusIcon(team_5v5, PDO) {
  if (!team_5v5 || !PDO) return '';
  
  if (PDO > 102) return '⚠️'; // Hot, due for regression
  if (PDO < 98) return '📈'; // Cold, due to improve
  if (team_5v5.xGF_per60 > 2.8) return '🔥'; // Elite offense
  if (team_5v5.xGA_per60 < 2.2) return '🛡️'; // Elite defense
  
  return '';
}

/**
 * Calculate league rank for a stat (lower is better for xGA, higher is better for xGF)
 * @param {number} value - The stat value
 * @param {Array} allValues - All team values for comparison
 * @param {boolean} lowerIsBetter - True if lower values rank higher
 * @returns {Object} - Rank, percentile, and visual bar
 */
export function calculateLeagueRank(value, allValues, lowerIsBetter = false) {
  const sorted = [...allValues].sort((a, b) => lowerIsBetter ? a - b : b - a);
  // FIX: Use filter instead of indexOf to handle duplicates and floating point issues
  const rank = sorted.filter(v => lowerIsBetter ? v < value : v > value).length + 1;
  const percentile = ((sorted.length - rank + 1) / sorted.length) * 100;
  const barFill = Math.round((percentile / 100) * 10);
  const bar = '█'.repeat(barFill) + '░'.repeat(10 - barFill);
  
  return {
    rank,
    percentile: percentile.toFixed(0),
    bar,
    total: sorted.length
  };
}

/**
 * Explain score-adjusted xG and its importance
 * @param {Object} team_5v5 - Team 5v5 data
 * @param {string} teamName - Team name
 * @returns {string} - Explanation
 */
export function explainScoreAdjustedXG(team_5v5, teamName) {
  if (!team_5v5.scoreAdj_xGF_per60 || !team_5v5.xGF_per60) {
    return null;
  }
  
  const difference = team_5v5.scoreAdj_xGF_per60 - team_5v5.xGF_per60;
  const percentDiff = ((difference / team_5v5.xGF_per60) * 100).toFixed(1);
  
  if (Math.abs(difference) < 0.1) {
    return `${teamName}'s score-adjusted xG matches raw xG (no leading/trailing bias)`;
  } else if (difference > 0) {
    return `${teamName} actually ${percentDiff}% better than raw stats (often trailed, shot more)`;
  } else {
    return `${teamName} ${Math.abs(percentDiff)}% worse when score-adjusted (often led, sat back)`;
  }
}

/**
 * Calculate exact regression impact on predictions
 * @param {number} PDO - Team PDO
 * @param {number} predictedGoals - Predicted goals for team
 * @returns {Object} - Regression details
 */
export function calculateRegressionImpact(PDO, predictedGoals) {
  if (!PDO || PDO === 100) {
    return { hasRegression: false };
  }
  
  let regressionPercent = 0;
  let direction = '';
  
  if (PDO > 102) {
    regressionPercent = Math.min(0.05, (PDO - 102) * 0.01);
    direction = 'down';
  } else if (PDO < 98) {
    regressionPercent = Math.min(0.05, (98 - PDO) * 0.01);
    direction = 'up';
  } else {
    return { hasRegression: false };
  }
  
  const goalImpact = predictedGoals * regressionPercent;
  const dollarImpact = (regressionPercent * 100 * 3.5).toFixed(2); // Rough EV impact per $100
  
  return {
    hasRegression: true,
    PDO,
    regressionPercent: (regressionPercent * 100).toFixed(1),
    direction,
    goalImpact: goalImpact.toFixed(2),
    dollarImpact,
    explanation: `PDO ${PDO.toFixed(1)} means ${(regressionPercent * 100).toFixed(1)}% ${direction}ward adjustment = ${goalImpact.toFixed(2)} goals`
  };
}

/**
 * Calculate shot quality metrics
 * @param {Object} team_5v5 - Team 5v5 data
 * @returns {Object} - Shot quality insights
 */
export function getShotQualityInsight(team_5v5) {
  if (!team_5v5.shotsOnGoalFor || !team_5v5.xGoalsFor) {
    return null;
  }
  
  const xGPerShot = team_5v5.xGoalsFor / team_5v5.shotsOnGoalFor;
  const leagueAvgXGPerShot = 0.09; // Approximate league average
  
  const quality = xGPerShot > leagueAvgXGPerShot ? 'high' : 'low';
  const percentDiff = (((xGPerShot - leagueAvgXGPerShot) / leagueAvgXGPerShot) * 100).toFixed(0);
  
  return {
    xGPerShot: xGPerShot.toFixed(3),
    quality,
    percentDiff,
    explanation: `${xGPerShot.toFixed(3)} xG/shot (${percentDiff > 0 ? '+' : ''}${percentDiff}% vs league avg) = ${quality}-danger shots`
  };
}

/**
 * Generate deep analytics for expandable section
 * @param {Object} game - Game data
 * @param {Object} edge - Edge data
 * @param {Object} dataProcessor - Data processor
 * @returns {Object} - Deep analytics
 */
export function generateDeepAnalytics(game, edge, dataProcessor) {
  if (!game || !edge || !dataProcessor) return null;
  
  const awayTeam = game.awayTeam;
  const homeTeam = game.homeTeam;
  
  const away_5v5 = dataProcessor.getTeamData(awayTeam, '5on5');
  const home_5v5 = dataProcessor.getTeamData(homeTeam, '5on5');
  
  if (!away_5v5 || !home_5v5) return null;
  
  // Get all teams for ranking
  const allTeams = dataProcessor.processedData.filter(d => d.situation === '5on5');
  const allXGF = allTeams.map(t => t.xGF_per60).filter(v => v > 0);
  const allXGA = allTeams.map(t => t.xGA_per60).filter(v => v > 0);
  
  // Calculate rankings
  const awayOffenseRank = calculateLeagueRank(away_5v5.xGF_per60, allXGF, false);
  const homeOffenseRank = calculateLeagueRank(home_5v5.xGF_per60, allXGF, false);
  const awayDefenseRank = calculateLeagueRank(away_5v5.xGA_per60, allXGA, true);
  const homeDefenseRank = calculateLeagueRank(home_5v5.xGA_per60, allXGA, true);
  
  // Calculate PDO
  const awayPDO = dataProcessor.calculatePDO(
    away_5v5.goalsFor,
    away_5v5.shotsOnGoalFor,
    away_5v5.goalsAgainst,
    away_5v5.shotsOnGoalAgainst
  );
  const homePDO = dataProcessor.calculatePDO(
    home_5v5.goalsFor,
    home_5v5.shotsOnGoalFor,
    home_5v5.goalsAgainst,
    home_5v5.shotsOnGoalAgainst
  );
  
  // CRITICAL FIX: Display probabilities for the RECOMMENDED BET, not always OVER
  // If recommending UNDER, show UNDER probabilities
  // If recommending OVER, show OVER probabilities
  
  // The edge.modelProb is ALREADY the probability for the recommended bet
  const modelProb = edge.modelProb || 0.5;
  
  // Get market probability for the SAME bet (OVER or UNDER)
  // edge.odds is the odds for the recommended bet
  const marketProb = edge.odds < 0 
    ? Math.abs(edge.odds) / (Math.abs(edge.odds) + 100)  // Negative odds: -110 → 110/210 = 52.4%
    : 100 / (edge.odds + 100);                            // Positive odds: +150 → 100/250 = 40%
  
  const probEdge = ((modelProb - marketProb) * 100).toFixed(1);
  
  // Calculate dollar value - Using the recommended bet's probability
  const decimalOdds = edge.odds > 0 ? (edge.odds / 100) + 1 : (100 / Math.abs(edge.odds)) + 1;
  const expectedReturn = modelProb * decimalOdds * 100; // What we expect based on MODEL
  const marketFairReturn = marketProb * decimalOdds * 100; // What market implies (~$100 if fair)
  const dollarEV = (expectedReturn - 100).toFixed(2);
  
  // Confidence level (based on sample size and PDO stability)
  const sampleSize = away_5v5.gamesPlayed || 20;
  const pdoStability = Math.max(Math.abs(awayPDO - 100), Math.abs(homePDO - 100));
  let confidence = 'Medium';
  let confidenceStars = 3;
  
  if (sampleSize > 35 && pdoStability < 3) {
    confidence = 'High';
    confidenceStars = 4;
  } else if (sampleSize < 20 || pdoStability > 5) {
    confidence = 'Low';
    confidenceStars = 2;
  }
  
  if (sampleSize > 50 && pdoStability < 2) {
    confidence = 'Very High';
    confidenceStars = 5;
  }
  
  return {
    rankings: {
      away: {
        offense: awayOffenseRank,
        defense: awayDefenseRank
      },
      home: {
        offense: homeOffenseRank,
        defense: homeDefenseRank
      }
    },
    probabilities: {
      model: (modelProb * 100).toFixed(1), // Probability for the RECOMMENDED bet
      market: (marketProb * 100).toFixed(1), // Market probability for the RECOMMENDED bet
      edge: probEdge // Probability edge for the RECOMMENDED bet
    },
    dollarValue: {
      expectedReturn: expectedReturn.toFixed(2),
      marketReturn: marketFairReturn.toFixed(2),
      ev: dollarEV
    },
    confidence: {
      level: confidence,
      stars: confidenceStars,
      sampleSize,
      pdoStability: pdoStability.toFixed(1)
    },
    kelly: {
      full: edge.kelly ? edge.kelly.fractionalKelly * 100 : 0,
      stake1k: edge.kelly ? (edge.kelly.fractionalKelly * 1000).toFixed(0) : 0,
      stake5k: edge.kelly ? (edge.kelly.fractionalKelly * 5000).toFixed(0) : 0
    },
    regression: {
      away: calculateRegressionImpact(awayPDO, game.edges.total?.predictedTotal / 2 || 3),
      home: calculateRegressionImpact(homePDO, game.edges.total?.predictedTotal / 2 || 3)
    }
  };
}

