// Math Explainer - Generate step-by-step calculation explanations

/**
 * Calculate implied probability from American odds
 */
export function impliedProbabilityFromOdds(odds) {
  if (odds < 0) {
    // Favorite: -150 → 150/(150+100) = 60%
    return Math.abs(odds) / (Math.abs(odds) + 100);
  } else {
    // Underdog: +125 → 100/(125+100) = 44.4%
    return 100 / (odds + 100);
  }
}

/**
 * Remove vig to get true market probability
 */
export function removeVig(prob1, prob2) {
  const total = prob1 + prob2;
  return {
    prob1: prob1 / total,
    prob2: prob2 / total,
    vig: ((total - 1) * 100).toFixed(1) + '%'
  };
}

/**
 * Generate team score breakdown
 */
export function explainTeamScore(teamCode, opponentCode, dataProcessor) {
  const team_5v5 = dataProcessor.getTeamData(teamCode, '5on5');
  const opponent_5v5 = dataProcessor.getTeamData(opponentCode, '5on5');
  const team_PP = dataProcessor.getTeamData(teamCode, '5on4');
  const opponent_PK = dataProcessor.getTeamData(opponentCode, '4on5');
  
  if (!team_5v5 || !opponent_5v5) {
    return null;
  }
  
  // 5v5 calculation
  const team_xGF_per60 = team_5v5.xGF_per60;
  const opp_xGA_per60 = opponent_5v5.xGA_per60;
  const expected_5v5_rate = (team_xGF_per60 + opp_xGA_per60) / 2;
  const goals_5v5 = (expected_5v5_rate / 60) * 46.2;
  
  // PP calculation
  let goals_PP = 0;
  let pp_breakdown = null;
  if (team_PP && opponent_PK) {
    const team_PP_xGF_per60 = team_PP.xGF_per60;
    const opp_PK_xGA_per60 = opponent_PK.xGA_per60;
    const expected_PP_rate = (team_PP_xGF_per60 + opp_PK_xGA_per60) / 2;
    goals_PP = (expected_PP_rate / 60) * 7.2;
    
    pp_breakdown = {
      team_PP_xGF_per60: team_PP_xGF_per60.toFixed(3),
      opp_PK_xGA_per60: opp_PK_xGA_per60.toFixed(3),
      expected_PP_rate: expected_PP_rate.toFixed(3),
      goals_PP: goals_PP.toFixed(2)
    };
  }
  
  const totalScore = goals_5v5 + goals_PP;
  
  return {
    teamCode,
    opponentCode,
    fiveOnFive: {
      team_xGF_per60: team_xGF_per60.toFixed(3),
      opp_xGA_per60: opp_xGA_per60.toFixed(3),
      expected_5v5_rate: expected_5v5_rate.toFixed(3),
      goals_5v5: goals_5v5.toFixed(2)
    },
    powerPlay: pp_breakdown,
    totalScore: totalScore.toFixed(2),
    rawData: {
      team_5v5_iceTime: team_5v5.iceTime,
      team_5v5_xGoalsFor: team_5v5.xGoalsFor,
      team_5v5_xGoalsAgainst: team_5v5.xGoalsAgainst,
      opp_5v5_iceTime: opponent_5v5.iceTime,
      opp_5v5_xGoalsFor: opponent_5v5.xGoalsFor,
      opp_5v5_xGoalsAgainst: opponent_5v5.xGoalsAgainst
    }
  };
}

/**
 * Generate complete game breakdown
 */
export function explainGamePrediction(awayTeam, homeTeam, marketTotal, marketOverOdds, marketUnderOdds, dataProcessor) {
  console.log('🧮 explainGamePrediction called with:', { 
    awayTeam, 
    homeTeam, 
    marketTotal, 
    marketOverOdds, 
    marketUnderOdds,
    hasDataProcessor: !!dataProcessor 
  });
  
  // Get team score breakdowns
  const awayBreakdown = explainTeamScore(awayTeam, homeTeam, dataProcessor);
  const homeBreakdown = explainTeamScore(homeTeam, awayTeam, dataProcessor);
  
  console.log('🧮 Team breakdowns:', { awayBreakdown, homeBreakdown });
  
  if (!awayBreakdown || !homeBreakdown) {
    console.log('❌ explainGamePrediction: Missing team breakdown');
    return null;
  }
  
  const predictedTotal = parseFloat(awayBreakdown.totalScore) + parseFloat(homeBreakdown.totalScore);
  const edge = predictedTotal - marketTotal;
  
  // Market implied probabilities
  const overImplied = impliedProbabilityFromOdds(marketOverOdds);
  const underImplied = impliedProbabilityFromOdds(marketUnderOdds);
  const { prob1: overTrue, prob2: underTrue, vig } = removeVig(overImplied, underImplied);
  
  // Model probabilities using normal distribution
  const stdDev = 1.5;
  const zScore = (marketTotal - predictedTotal) / stdDev;
  const overProb = 1 - dataProcessor.normalCDF(zScore);
  const underProb = 1 - overProb;
  
  // EV calculations
  const overDecimalOdds = marketOverOdds < 0 
    ? 1 + (100 / Math.abs(marketOverOdds))
    : 1 + (marketOverOdds / 100);
  const underDecimalOdds = marketUnderOdds < 0
    ? 1 + (100 / Math.abs(marketUnderOdds))
    : 1 + (marketUnderOdds / 100);
  
  const overEV = (overProb * overDecimalOdds * 100) - 100;
  const underEV = (underProb * underDecimalOdds * 100) - 100;
  
  return {
    awayTeam: awayBreakdown,
    homeTeam: homeBreakdown,
    predictedTotal: predictedTotal.toFixed(2),
    marketTotal,
    edge: edge.toFixed(2),
    marketAnalysis: {
      overOdds: marketOverOdds,
      underOdds: marketUnderOdds,
      overImplied: (overImplied * 100).toFixed(1) + '%',
      underImplied: (underImplied * 100).toFixed(1) + '%',
      overTrue: (overTrue * 100).toFixed(1) + '%',
      underTrue: (underTrue * 100).toFixed(1) + '%',
      vig: vig
    },
    modelProbabilities: {
      zScore: zScore.toFixed(3),
      stdDev: stdDev.toFixed(1),
      overProb: (overProb * 100).toFixed(1) + '%',
      underProb: (underProb * 100).toFixed(1) + '%'
    },
    expectedValue: {
      over: {
        decimalOdds: overDecimalOdds.toFixed(3),
        ev: overEV.toFixed(2),
        evPercent: (overEV).toFixed(1) + '%'
      },
      under: {
        decimalOdds: underDecimalOdds.toFixed(3),
        ev: underEV.toFixed(2),
        evPercent: (underEV).toFixed(1) + '%'
      }
    }
  };
}

