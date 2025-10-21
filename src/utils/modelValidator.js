/**
 * Model Validation Utilities
 * Detects systematic bias and calibration issues
 */

export function validatePredictions(games) {
  if (!games || games.length === 0) return null;
  
  let totalDiff = 0;
  let totalPredicted = 0;
  let totalMarket = 0;
  let underCount = 0;
  let overCount = 0;
  let neutralCount = 0;
  let validGames = 0;
  
  games.forEach(game => {
    const predicted = game.edges?.total?.predictedTotal;
    const market = game.rawOdds?.total?.line;
    
    if (!predicted || !market) return;
    
    validGames++;
    const diff = predicted - market;
    
    totalDiff += Math.abs(diff);
    totalPredicted += predicted;
    totalMarket += market;
    
    if (diff < -0.3) underCount++;
    else if (diff > 0.3) overCount++;
    else neutralCount++;
  });
  
  if (validGames === 0) return null;
  
  const avgDiff = totalDiff / validGames;
  const avgPredicted = totalPredicted / validGames;
  const avgMarket = totalMarket / validGames;
  const underBias = underCount / validGames;
  const overBias = overCount / validGames;
  
  const results = {
    avgPredicted: avgPredicted.toFixed(2),
    avgMarket: avgMarket.toFixed(2),
    avgDifference: avgDiff.toFixed(2),
    systematicBias: (avgPredicted - avgMarket).toFixed(2),
    underBias: (underBias * 100).toFixed(0) + '%',
    overBias: (overBias * 100).toFixed(0) + '%',
    neutralBias: (neutralCount / validGames * 100).toFixed(0) + '%',
    warnings: []
  };
  
  // Check for issues
  if (Math.abs(avgPredicted - avgMarket) > 0.3) {
    results.warnings.push(`⚠️ Systematic bias: ${(avgPredicted - avgMarket).toFixed(2)} goals`);
  }
  
  if (underBias > 0.6) {
    results.warnings.push(`⚠️ UNDER bias: ${(underBias * 100).toFixed(0)}% of games`);
  }
  
  if (overBias > 0.6) {
    results.warnings.push(`⚠️ OVER bias: ${(overBias * 100).toFixed(0)}% of games`);
  }
  
  if (avgDiff > 0.4) {
    results.warnings.push(`⚠️ Predictions diverging from market by ${avgDiff.toFixed(2)} goals on average`);
  }
  
  // Log to console
  console.log('═══════════════════════════════════════');
  console.log('📊 MODEL VALIDATION REPORT');
  console.log('═══════════════════════════════════════');
  console.log(`Avg Predicted Total: ${results.avgPredicted} goals`);
  console.log(`Avg Market Total:    ${results.avgMarket} goals`);
  console.log(`Avg Difference:      ${results.avgDifference} goals`);
  console.log(`Systematic Bias:     ${results.systematicBias} goals`);
  console.log('───────────────────────────────────────');
  console.log(`UNDER recommendations: ${results.underBias}`);
  console.log(`OVER recommendations:  ${results.overBias}`);
  console.log(`Neutral (±0.3):        ${results.neutralBias}`);
  console.log('───────────────────────────────────────');
  
  if (results.warnings.length > 0) {
    console.log('⚠️ WARNINGS:');
    results.warnings.forEach(w => console.log(w));
  } else {
    console.log('✅ No systematic bias detected');
  }
  console.log('═══════════════════════════════════════');
  
  return results;
}

export function displayValidationCard(validation) {
  if (!validation) return null;
  
  return {
    avgPredicted: validation.avgPredicted,
    avgMarket: validation.avgMarket,
    bias: validation.systematicBias,
    status: Math.abs(parseFloat(validation.systematicBias)) < 0.3 ? 'GOOD' : 'WARNING',
    warnings: validation.warnings
  };
}

