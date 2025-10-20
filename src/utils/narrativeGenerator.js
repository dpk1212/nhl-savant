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

