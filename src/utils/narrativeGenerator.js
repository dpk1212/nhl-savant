/**
 * Narrative Generator - Creates plain-English explanations for betting predictions
 */

import { getTeamName } from './oddsTraderParser';

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
    const isOver = pick.includes('Over');
    const predictedTotal = game.edges.total.predictedTotal;
    const marketTotal = game.edges.total.marketTotal;
    const difference = Math.abs(predictedTotal - marketTotal);

    if (isOver) {
      icon = '🔥';
      headline = `High-scoring game expected: ${predictedTotal.toFixed(1)} total goals predicted (${difference.toFixed(1)} above market)`;
      
      // Identify offensive strengths
      if (away_5v5.xGF_per60 > 2.5) {
        bullets.push(`${getTeamName(awayTeam)}: Strong offense (${away_5v5.xGF_per60.toFixed(2)} xGF/60)`);
      }
      if (home_5v5.xGF_per60 > 2.5) {
        bullets.push(`${getTeamName(homeTeam)}: Strong offense (${home_5v5.xGF_per60.toFixed(2)} xGF/60)`);
      }
      
      // Identify defensive weaknesses
      if (away_5v5.xGA_per60 > 2.7) {
        bullets.push(`${getTeamName(awayTeam)}: Weak defense allows ${away_5v5.xGA_per60.toFixed(2)} xGA/60`);
      }
      if (home_5v5.xGA_per60 > 2.7) {
        bullets.push(`${getTeamName(homeTeam)}: Weak defense allows ${home_5v5.xGA_per60.toFixed(2)} xGA/60`);
      }

      // PP/PK matchups
      if (away_PP && home_PK && away_PP.xGF_per60 > 6.0) {
        bullets.push(`🏒 ${getTeamName(awayTeam)} elite PP (${away_PP.xGF_per60.toFixed(2)} xGF/60) vs weak PK`);
      }
      if (home_PP && away_PK && home_PP.xGF_per60 > 6.0) {
        bullets.push(`🏒 ${getTeamName(homeTeam)} elite PP (${home_PP.xGF_per60.toFixed(2)} xGF/60) vs weak PK`);
      }

    } else {
      icon = '❄️';
      headline = `Low-scoring defensive battle: ${predictedTotal.toFixed(1)} total goals predicted (${difference.toFixed(1)} below market)`;
      
      // Identify defensive strengths
      if (away_5v5.xGA_per60 < 2.3) {
        bullets.push(`${getTeamName(awayTeam)}: Elite defense (${away_5v5.xGA_per60.toFixed(2)} xGA/60)`);
      }
      if (home_5v5.xGA_per60 < 2.3) {
        bullets.push(`${getTeamName(homeTeam)}: Elite defense (${home_5v5.xGA_per60.toFixed(2)} xGA/60)`);
      }
      
      // Identify offensive weaknesses
      if (away_5v5.xGF_per60 < 2.2) {
        bullets.push(`${getTeamName(awayTeam)}: Struggling offense (${away_5v5.xGF_per60.toFixed(2)} xGF/60)`);
      }
      if (home_5v5.xGF_per60 < 2.2) {
        bullets.push(`${getTeamName(homeTeam)}: Struggling offense (${home_5v5.xGF_per60.toFixed(2)} xGF/60)`);
      }
    }

    // Add PDO regression insights
    if (awayPDO > 102) {
      bullets.push(`⚠️ ${getTeamName(awayTeam)} due for regression (PDO ${awayPDO.toFixed(1)} - unsustainably lucky)`);
    } else if (awayPDO < 98) {
      bullets.push(`📈 ${getTeamName(awayTeam)} underperforming luck metrics (PDO ${awayPDO.toFixed(1)} - due to improve)`);
    }
    
    if (homePDO > 102) {
      bullets.push(`⚠️ ${getTeamName(homeTeam)} due for regression (PDO ${homePDO.toFixed(1)} - unsustainably lucky)`);
    } else if (homePDO < 98) {
      bullets.push(`📈 ${getTeamName(homeTeam)} underperforming luck metrics (PDO ${homePDO.toFixed(1)} - due to improve)`);
    }

  } else if (market === 'MONEYLINE') {
    const isAway = pick === getTeamName(awayTeam);
    const favoredTeam = isAway ? awayTeam : homeTeam;
    const favoredTeam_5v5 = isAway ? away_5v5 : home_5v5;
    const underdog_5v5 = isAway ? home_5v5 : away_5v5;
    
    const winProb = edge.modelProb * 100;
    
    icon = isAway ? '✈️' : '🏠';
    headline = `${pick} favored with ${winProb.toFixed(1)}% win probability (Model edge: ${edge.evPercent.toFixed(1)}% EV)`;
    
    bullets.push(`${pick}: Superior xG differential (+${(favoredTeam_5v5.xGF_per60 - favoredTeam_5v5.xGA_per60).toFixed(2)} xGD/60)`);
    
    if (favoredTeam_5v5.xGF_per60 > underdog_5v5.xGF_per60 + 0.3) {
      bullets.push(`Offensive advantage: ${favoredTeam_5v5.xGF_per60.toFixed(2)} vs ${underdog_5v5.xGF_per60.toFixed(2)} xGF/60`);
    }
    
    if (favoredTeam_5v5.xGA_per60 < underdog_5v5.xGA_per60 - 0.3) {
      bullets.push(`Defensive advantage: ${favoredTeam_5v5.xGA_per60.toFixed(2)} vs ${underdog_5v5.xGA_per60.toFixed(2)} xGA/60`);
    }

    const favoredPDO = isAway ? awayPDO : homePDO;
    if (favoredPDO < 98) {
      bullets.push(`📈 Regression play: PDO ${favoredPDO.toFixed(1)} suggests unlucky results should improve`);
    }
  }

  // Add EV summary
  bullets.push(`💰 Edge: ${edge.evPercent > 0 ? '+' : ''}${edge.evPercent.toFixed(1)}% EV at ${edge.odds > 0 ? '+' : ''}${edge.odds} odds`);

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
  
  // Calculate probabilities - FIX: Correct variable names and odds conversion
  const modelProb = edge.modelProb || 0.5; // Our model's probability
  const marketImpliedProb = edge.odds < 0 
    ? Math.abs(edge.odds) / (Math.abs(edge.odds) + 100)  // Negative odds: -110 → 110/210 = 52.4%
    : 100 / (edge.odds + 100);                           // Positive odds: +150 → 100/250 = 40%
  const probEdge = ((modelProb - marketImpliedProb) * 100).toFixed(1);
  
  // Calculate dollar value - FIX: Use correct variable names
  const decimalOdds = edge.odds > 0 ? (edge.odds / 100) + 1 : (100 / Math.abs(edge.odds)) + 1;
  const expectedReturn = modelProb * decimalOdds * 100; // What we expect based on MODEL
  const marketFairReturn = marketImpliedProb * decimalOdds * 100; // What market implies (~$100 if fair)
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
      model: (modelProb * 100).toFixed(1),
      market: (marketImpliedProb * 100).toFixed(1),
      edge: probEdge
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

