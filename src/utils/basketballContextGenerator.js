/**
 * Basketball Pick Context Generator
 * Generates varied, contextual descriptions for basketball picks
 * to make each game feel unique and understandable at a glance
 */

/**
 * Generate dynamic context for basketball pick
 * @param {Object} game - Game data with awayTeam, homeTeam, etc.
 * @param {Object} prediction - Prediction object with ensembleProb, bestEV, etc.
 * @param {Object} odds - Odds data with awayOdds, homeOdds
 * @returns {Object} Context with icon, title, subtitle
 */
export function getBasketballContext(game, prediction, odds) {
  const { 
    ensembleProb,
    ensembleAwayProb,
    ensembleHomeProb,
    bestEV, 
    bestTeam, 
    confidence,
    predictedAwayScore,
    predictedHomeScore,
    bestBet // 'away' or 'home'
  } = prediction;
  
  const isHome = bestBet === 'home';
  const modelProb = (bestBet === 'away' ? ensembleAwayProb : ensembleHomeProb) * 100;
  const predictedTotal = (predictedAwayScore || 0) + (predictedHomeScore || 0);
  
  // Calculate market implied probability
  const targetOdds = bestBet === 'away' ? odds?.awayOdds : odds?.homeOdds;
  const oddsImpliedProb = calculateImpliedProb(targetOdds) * 100;
  const marketDiff = Math.abs(modelProb - oddsImpliedProb);
  
  // 1. BLOWOUT EXPECTED (>75% win prob)
  if (modelProb >= 75) {
    return {
      icon: '🏆',
      title: `${bestTeam} Dominant Favorite`,
      subtitle: `${modelProb.toFixed(0)}% to win • ${bestEV.toFixed(1)}% edge vs market`
    };
  }
  
  // 2. TOSS-UP / UPSET OPPORTUNITY (45-65% win prob + edge >= 2%)
  if (modelProb >= 45 && modelProb <= 65 && Math.abs(bestEV) >= 2) {
    return {
      icon: '🎯',
      title: `${bestTeam} Underdog Value`,
      subtitle: `${modelProb.toFixed(0)}% to win • Market undervalues ${bestTeam} in close game`
    };
  }
  
  // 3. CONTRARIAN VALUE (Model disagrees with market by 10%+)
  if (marketDiff >= 10) {
    return {
      icon: '💎',
      title: `${bestTeam} Market Value`,
      subtitle: `Our model finds ${marketDiff.toFixed(0)}% more value than public odds`
    };
  }
  
  // 4. HIGH CONVICTION (Confidence = HIGH + EV >= 5%)
  if (confidence === 'HIGH' && Math.abs(bestEV) >= 5) {
    return {
      icon: '⚡',
      title: `${bestTeam} High Conviction`,
      subtitle: `${bestEV.toFixed(1)}% edge • Both systems strongly agree`
    };
  }
  
  // 5. DEFENSIVE BATTLE (Predicted total < 130)
  if (predictedTotal > 0 && predictedTotal < 130) {
    return {
      icon: '🛡️',
      title: `${bestTeam} in Defensive Battle`,
      subtitle: `Low-scoring game (${predictedTotal.toFixed(0)} pts) • ${bestTeam} wins grind-it-out matchup`
    };
  }
  
  // 6. SHOOTOUT EXPECTED (Predicted total > 160)
  if (predictedTotal > 160) {
    return {
      icon: '🔥',
      title: `${bestTeam} in High-Scoring Affair`,
      subtitle: `Shootout expected (${predictedTotal.toFixed(0)} pts) • ${bestTeam} wins track meet`
    };
  }
  
  // 7. HOME COURT EDGE (Home team + edge >= 3%)
  if (isHome && bestEV >= 3) {
    return {
      icon: '🏠',
      title: `${bestTeam} Home Court Edge`,
      subtitle: `${bestEV.toFixed(1)}% edge at home • ${modelProb.toFixed(0)}% to win`
    };
  }
  
  // 8. ROAD WARRIOR (Away team + edge >= 3%)
  if (!isHome && bestEV >= 3) {
    return {
      icon: '✈️',
      title: `${bestTeam} Road Value`,
      subtitle: `Undervalued away from home • ${bestEV.toFixed(1)}% edge`
    };
  }
  
  // 9. EFFICIENCY EDGE (High edge + good prob)
  if (bestEV >= 4 && modelProb >= 55) {
    return {
      icon: '📊',
      title: `${bestTeam} Efficiency Edge`,
      subtitle: `${modelProb.toFixed(0)}% win probability • Superior metrics create ${bestEV.toFixed(1)}% edge`
    };
  }
  
  // 10. DEFAULT - Standard value message
  return {
    icon: '💡',
    title: `${bestTeam} Moneyline`,
    subtitle: `${modelProb.toFixed(0)}% win probability • ${bestEV.toFixed(1)}% edge vs market`
  };
}

/**
 * Calculate implied probability from American odds
 * @param {number} odds - American odds (e.g., -135, +120)
 * @returns {number} Implied probability (0-1)
 */
function calculateImpliedProb(odds) {
  if (!odds || odds === 0) return 0.5;
  
  if (odds > 0) {
    return 100 / (odds + 100);
  } else {
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

