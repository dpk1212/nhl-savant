/**
 * Basketball Pick Context Generator
 * Professional, analytical contexts with massive variety
 * Hybrid system: Edge Tier + Win Probability + Situation
 */

/**
 * Generate dynamic context for basketball pick
 * @param {Object} game - Game data with awayTeam, homeTeam, etc.
 * @param {Object} prediction - Prediction object with ensembleProb, bestEV, etc.
 * @param {Object} odds - Odds data with awayOdds, homeOdds
 * @param {Object} bet - Optional Firebase bet data with spreadAnalysis
 * @returns {Object} Context with icon, title, subtitle
 */
export function getBasketballContext(game, prediction, odds, bet = null) {
  const {
    ensembleAwayProb,
    ensembleHomeProb,
    bestEV, 
    bestTeam: rawBestTeam, 
    confidence,
    ensembleAwayScore,
    ensembleHomeScore,
    bestBet // 'away' or 'home'
  } = prediction;
  
  const bestTeam = rawBestTeam || (bestBet === 'away' ? game.awayTeam : game.homeTeam) || 'Pick';
  
  // ============================================================
  // SPREAD-ONLY BETS - Check for pre-computed context from fetch script
  // ============================================================
  if (prediction?.spreadContext?.title) {
    return {
      icon: prediction.spreadContext.icon || '📊',
      title: prediction.spreadContext.title,
      subtitle: prediction.spreadContext.subtitle
    };
  }
  
  const safeEV = bestEV || 0;
  const isHome = bestBet === 'home';
  const modelProb = ((bestBet === 'away' ? ensembleAwayProb : ensembleHomeProb) || 0) * 100;
  const predictedTotal = (ensembleAwayScore || 0) + (ensembleHomeScore || 0);
  
  // Calculate market implied probability
  const targetOdds = bestBet === 'away' ? odds?.awayOdds : odds?.homeOdds;
  const oddsImpliedProb = calculateImpliedProb(targetOdds) * 100;
  const marketDiff = Math.abs(modelProb - oddsImpliedProb);
  
  // Categorize edge tier
  let edgeTier;
  if (safeEV >= 5) edgeTier = 'ELITE';
  else if (safeEV >= 3.5) edgeTier = 'STRONG';
  else if (safeEV >= 2.5) edgeTier = 'QUALITY';
  else if (safeEV >= 1.5) edgeTier = 'VALUE';
  else edgeTier = 'MINIMAL';
  
  // Categorize win probability
  let probTier;
  if (modelProb >= 70) probTier = 'HEAVY_FAV';
  else if (modelProb >= 60) probTier = 'FAVORITE';
  else if (modelProb >= 55) probTier = 'LEAN';
  else if (modelProb >= 45) probTier = 'TOSS_UP';
  else probTier = 'UNDERDOG';
  
  // Game pace categorization
  const isHighScoring = predictedTotal > 160;
  const isLowScoring = predictedTotal > 0 && predictedTotal < 130;
  
  // Market disagreement flag
  const bigMarketDiff = marketDiff >= 10;
  
  // High confidence flag (both systems agree)
  const highConfidence = confidence === 'HIGH';
  
  // ============================================================
  // A+ TIER (5%+ Edge) - Elite Opportunities
  // ============================================================
  
  if (edgeTier === 'ELITE') {
    // Heavy favorite with elite edge
    if (probTier === 'HEAVY_FAV') {
      if (highConfidence) {
        return {
          icon: '⚡',
          title: `${bestTeam} High Conviction Favorite`,
          subtitle: `${modelProb.toFixed(0)}% to win • +${safeEV.toFixed(1)}% value despite high probability`
        };
      }
      return {
        icon: '📊',
        title: `${bestTeam} Statistical Dominance`,
        subtitle: `Model projects ${modelProb.toFixed(0)}% • Market underprices by ${safeEV.toFixed(1)}%`
      };
    }
    
    // Strong favorite with elite edge
    if (probTier === 'FAVORITE') {
      if (bigMarketDiff) {
        return {
          icon: '💎',
          title: `${bestTeam} Premium Mismatch`,
          subtitle: `Model sees ${modelProb.toFixed(0)}% • ${marketDiff.toFixed(0)}% higher than market, +${safeEV.toFixed(1)}% edge`
        };
      }
      if (highConfidence) {
        return {
          icon: '⚡',
          title: `${bestTeam} High Conviction Play`,
          subtitle: `${modelProb.toFixed(0)}% win probability • +${safeEV.toFixed(1)}% edge with both systems aligned`
        };
      }
      return {
        icon: '📊',
        title: `${bestTeam} Efficiency Advantage`,
        subtitle: `Superior metrics project ${modelProb.toFixed(0)}% • +${safeEV.toFixed(1)}% value`
      };
    }
    
    // Competitive game with elite edge
    if (probTier === 'LEAN' || probTier === 'TOSS_UP') {
      if (bigMarketDiff) {
        return {
          icon: '🎯',
          title: `${bestTeam} Mispriced Opportunity`,
          subtitle: `${modelProb.toFixed(0)}% to win • Market ${marketDiff.toFixed(0)}% lower, +${safeEV.toFixed(1)}% edge`
        };
      }
      if (highConfidence) {
        return {
          icon: '💎',
          title: `${bestTeam} Undervalued Pick`,
          subtitle: `Close game analysis favors ${bestTeam} • +${safeEV.toFixed(1)}% value with system agreement`
        };
      }
      return {
        icon: '⚡',
        title: `${bestTeam} Model Disagreement`,
        subtitle: `Systems see ${modelProb.toFixed(0)}% • Public line creates +${safeEV.toFixed(1)}% edge`
      };
    }
    
    // Pace/scoring context for elite picks
    if (isHighScoring) {
      return {
        icon: '🔥',
        title: `${bestTeam} High-Pace Value`,
        subtitle: `Fast tempo (${predictedTotal.toFixed(0)} pts projected) • ${bestTeam} advantages translate to +${safeEV.toFixed(1)}%`
      };
    }
    if (isLowScoring) {
      return {
        icon: '🛡️',
        title: `${bestTeam} Low-Scoring Edge`,
        subtitle: `Defensive matchup (${predictedTotal.toFixed(0)} pts) • ${bestTeam} style creates +${safeEV.toFixed(1)}% value`
      };
    }
    
    // Home/Away context for elite picks
    if (isHome && bestEV >= 6) {
      return {
        icon: '🏠',
        title: `${bestTeam} Elite Home Value`,
        subtitle: `+${safeEV.toFixed(1)}% edge at home • ${modelProb.toFixed(0)}% with venue advantage`
      };
    }
    if (!isHome && bestEV >= 6) {
      return {
        icon: '✈️',
        title: `${bestTeam} Road Undervalue`,
        subtitle: `+${safeEV.toFixed(1)}% away • Market overweights travel factor`
      };
    }
  }
  
  // ============================================================
  // A TIER (3.5-5% Edge) - Strong Opportunities
  // ============================================================
  
  if (edgeTier === 'STRONG') {
    // Strong favorite
    if (probTier === 'HEAVY_FAV' || probTier === 'FAVORITE') {
      if (highConfidence) {
        return {
          icon: '✅',
          title: `${bestTeam} Strong Favorite Play`,
          subtitle: `${modelProb.toFixed(0)}% favorite • +${safeEV.toFixed(1)}% value with system consensus`
        };
      }
      if (bigMarketDiff) {
        return {
          icon: '📊',
          title: `${bestTeam} Model Confidence`,
          subtitle: `Systems project ${modelProb.toFixed(0)}% • Market ${marketDiff.toFixed(0)}% lower for +${safeEV.toFixed(1)}% edge`
        };
      }
      return {
        icon: '💎',
        title: `${bestTeam} Quality Mismatch`,
        subtitle: `Metrics edge at ${modelProb.toFixed(0)}% • +${safeEV.toFixed(1)}% value vs current line`
      };
    }
    
    // Moderate favorite or lean
    if (probTier === 'LEAN') {
      if (highConfidence) {
        return {
          icon: '✅',
          title: `${bestTeam} Strong Value Pick`,
          subtitle: `${modelProb.toFixed(0)}% to win • +${safeEV.toFixed(1)}% market inefficiency identified`
        };
      }
      if (isHighScoring) {
        return {
          icon: '⚡',
          title: `${bestTeam} Pace Mismatch`,
          subtitle: `Tempo advantage in high-scoring game • Model projects +${safeEV.toFixed(1)}% value`
        };
      }
      return {
        icon: '📊',
        title: `${bestTeam} Analytical Edge`,
        subtitle: `Model favors ${bestTeam} at ${modelProb.toFixed(0)}% • +${safeEV.toFixed(1)}% value identified`
      };
    }
    
    // Competitive game
    if (probTier === 'TOSS_UP') {
      if (bigMarketDiff) {
        return {
          icon: '🎯',
          title: `${bestTeam} Undervalued Underdog`,
          subtitle: `${modelProb.toFixed(0)}% in close game • Market ${marketDiff.toFixed(0)}% too low`
        };
      }
      if (highConfidence) {
        return {
          icon: '💎',
          title: `${bestTeam} Close Game Value`,
          subtitle: `Model gives ${bestTeam} ${modelProb.toFixed(0)}% • +${safeEV.toFixed(1)}% edge opportunity`
        };
      }
      return {
        icon: '⚖️',
        title: `${bestTeam} Balanced Value`,
        subtitle: `Near 50/50 matchup • Analysis finds +${safeEV.toFixed(1)}% edge for ${bestTeam}`
      };
    }
    
    // Pace context
    if (isLowScoring) {
      return {
        icon: '🛡️',
        title: `${bestTeam} Defensive Profile`,
        subtitle: `Low-scoring strength (${predictedTotal.toFixed(0)} pts) • +${safeEV.toFixed(1)}% in grind game`
      };
    }
  }
  
  // ============================================================
  // B+ TIER (2.5-3.5% Edge) - Quality Opportunities  
  // ============================================================
  
  if (edgeTier === 'QUALITY') {
    // Favorite
    if (probTier === 'HEAVY_FAV' || probTier === 'FAVORITE') {
      if (highConfidence) {
        return {
          icon: '📈',
          title: `${bestTeam} Solid Favorite`,
          subtitle: `${modelProb.toFixed(0)}% to win • +${safeEV.toFixed(1)}% value with model agreement`
        };
      }
      return {
        icon: '✅',
        title: `${bestTeam} Quality Pick`,
        subtitle: `Model backs ${bestTeam} • +${safeEV.toFixed(1)}% edge vs current line`
      };
    }
    
    // Moderate edge
    if (probTier === 'LEAN') {
      if (bigMarketDiff) {
        return {
          icon: '📊',
          title: `${bestTeam} Model Edge`,
          subtitle: `${modelProb.toFixed(0)}% win probability • Market ${marketDiff.toFixed(0)}% off for +${safeEV.toFixed(1)}% value`
        };
      }
      if (isHighScoring) {
        return {
          icon: '🔥',
          title: `${bestTeam} Tempo Edge`,
          subtitle: `High-scoring game (${predictedTotal.toFixed(0)} pts) • Style favors ${bestTeam} +${safeEV.toFixed(1)}%`
        };
      }
      return {
        icon: '💡',
        title: `${bestTeam} Statistical Lean`,
        subtitle: `Analysis favors ${bestTeam} at ${modelProb.toFixed(0)}% • +${safeEV.toFixed(1)}% market gap`
      };
    }
    
    // Competitive
    if (probTier === 'TOSS_UP') {
      if (highConfidence) {
        return {
          icon: '🎯',
          title: `${bestTeam} Underdog Value`,
          subtitle: `${modelProb.toFixed(0)}% as underdog • Systems identify +${safeEV.toFixed(1)}% edge`
        };
      }
      return {
        icon: '💡',
        title: `${bestTeam} Close Game Edge`,
        subtitle: `${modelProb.toFixed(0)}% in tight matchup • +${safeEV.toFixed(1)}% value vs line`
      };
    }
    
    // Home/Away
    if (isHome) {
      return {
        icon: '🏠',
        title: `${bestTeam} Home Advantage`,
        subtitle: `+${safeEV.toFixed(1)}% edge at home • ${modelProb.toFixed(0)}% with venue factor`
      };
    }
    if (!isHome) {
      return {
        icon: '✈️',
        title: `${bestTeam} Road Value`,
        subtitle: `+${safeEV.toFixed(1)}% away • Market reaction creates opportunity`
      };
    }
  }
  
  // ============================================================
  // B TIER (1.5-2.5% Edge) - Value Opportunities
  // ============================================================
  
  if (edgeTier === 'VALUE') {
    if (probTier === 'HEAVY_FAV' || probTier === 'FAVORITE') {
      return {
        icon: '📈',
        title: `${bestTeam} Modest Edge`,
        subtitle: `${modelProb.toFixed(0)}% favorite • +${safeEV.toFixed(1)}% value cushion`
      };
    }
    if (probTier === 'LEAN' || probTier === 'TOSS_UP') {
      return {
        icon: '💡',
        title: `${bestTeam} Value Opportunity`,
        subtitle: `${modelProb.toFixed(0)}% to win • +${safeEV.toFixed(1)}% edge identified`
      };
    }
    return {
      icon: '🎯',
      title: `${bestTeam} Slight Value`,
      subtitle: `Model leans ${bestTeam} at ${modelProb.toFixed(0)}% • +${safeEV.toFixed(1)}% edge`
    };
  }
  
  // ============================================================
  // C/D TIER (<1.5% Edge) - Minimal/Conservative Sizing
  // ============================================================
  
  if (bestEV < 0) {
    // NEGATIVE EV - but we bet it with conservative unit sizing
    return {
      icon: '📊',
      title: `${bestTeam} Tracked Position`,
      subtitle: `Model shows ${modelProb.toFixed(0)}% • Conservative sizing manages ${Math.abs(bestEV).toFixed(1)}% pattern volatility`
    };
  }
  
  if (bestEV < 0.5) {
    return {
      icon: '📊',
      title: `${bestTeam} Minimal Edge Play`,
      subtitle: `${modelProb.toFixed(0)}% to win • Small +${safeEV.toFixed(1)}% edge, reduced allocation`
    };
  }
  
  return {
    icon: '💡',
    title: `${bestTeam} Standard Opportunity`,
    subtitle: `${modelProb.toFixed(0)}% to win • +${safeEV.toFixed(1)}% edge, moderate sizing`
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

