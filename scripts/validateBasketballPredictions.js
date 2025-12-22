/**
 * PHASE 5: Validation script to ensure predictions are sane
 * Run before writing bets to Firebase
 * 
 * Usage: import and call validatePredictions(games) before saving
 */

/**
 * Validate basketball predictions for sanity
 * @param {Array} games - Games with predictions
 * @returns {boolean} True if all validations pass
 */
export function validatePredictions(games) {
  console.log('\n🔍 VALIDATING BASKETBALL PREDICTIONS\n');
  
  const warnings = [];
  const errors = [];
  
  games.forEach((game, idx) => {
    const p = game.prediction;
    const gameLabel = `${game.awayTeam} @ ${game.homeTeam}`;
    
    // Check 1: EV should be reasonable (not inflated)
    if (p.bestEV > 15) {
      warnings.push(`Game ${idx + 1} (${gameLabel}): High EV (${p.bestEV.toFixed(1)}%) - verify calculation`);
    }
    
    // Check 2: Calibrated prob should be close to market
    const marketProb = p.bestBet === 'away' ? p.marketAwayProb : p.marketHomeProb;
    const calibratedProb = p.bestBet === 'away' ? p.calibratedAwayProb : p.calibratedHomeProb;
    const diff = Math.abs(calibratedProb - marketProb);
    
    if (diff > 0.15) {
      warnings.push(`Game ${idx + 1} (${gameLabel}): Large probability diff (${(diff * 100).toFixed(1)}%) - model may be overconfident`);
    }
    
    // Check 3: Negative EV should be filtered
    if (p.bestEV < 0) {
      errors.push(`Game ${idx + 1} (${gameLabel}): NEGATIVE EV (${p.bestEV.toFixed(1)}%) - should be filtered!`);
    }
    
    // Check 4: D/F grades should be filtered
    if (p.grade === 'D' || p.grade === 'F') {
      errors.push(`Game ${idx + 1} (${gameLabel}): Grade ${p.grade} - should be filtered!`);
    }
    
    // Check 5: EV below 3% should be filtered
    if (p.bestEV < 3.0) {
      errors.push(`Game ${idx + 1} (${gameLabel}): EV too low (${p.bestEV.toFixed(1)}%) - should be filtered!`);
    }
    
    // Check 6: Unit size should be reasonable
    if (p.unitSize < 0.5 || p.unitSize > 5.0) {
      errors.push(`Game ${idx + 1} (${gameLabel}): Unit size out of bounds (${p.unitSize}u)`);
    }
    
    // Check 7: Calibrated probability should exist
    if (!p.calibratedAwayProb || !p.calibratedHomeProb) {
      errors.push(`Game ${idx + 1} (${gameLabel}): Missing calibrated probabilities`);
    }
  });
  
  // Display results
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   ${w}`));
    console.log('');
  }
  
  if (errors.length > 0) {
    console.log('❌ ERRORS:');
    errors.forEach(e => console.log(`   ${e}`));
    console.log('\n🚨 FIX THESE BEFORE WRITING BETS!\n');
    return false;
  }
  
  console.log('✅ All validations passed!');
  console.log(`   ${games.length} games ready to bet\n`);
  return true;
}

/**
 * Generate summary statistics for predictions
 * @param {Array} games - Games with predictions
 */
export function summarizePredictions(games) {
  if (games.length === 0) {
    console.log('📊 No games to summarize\n');
    return;
  }
  
  const avgEV = games.reduce((sum, g) => sum + g.prediction.bestEV, 0) / games.length;
  const avgUnits = games.reduce((sum, g) => sum + g.prediction.unitSize, 0) / games.length;
  const avgCalibProb = games.reduce((sum, g) => {
    const prob = g.prediction.bestBet === 'away' 
      ? g.prediction.calibratedAwayProb 
      : g.prediction.calibratedHomeProb;
    return sum + prob;
  }, 0) / games.length;
  
  const gradeCount = {};
  games.forEach(g => {
    gradeCount[g.prediction.grade] = (gradeCount[g.prediction.grade] || 0) + 1;
  });
  
  console.log('📊 PREDICTION SUMMARY:');
  console.log(`   Total games: ${games.length}`);
  console.log(`   Avg EV: ${avgEV.toFixed(1)}%`);
  console.log(`   Avg units: ${avgUnits.toFixed(1)}u`);
  console.log(`   Avg calibrated prob: ${(avgCalibProb * 100).toFixed(1)}%`);
  console.log(`   Grade distribution:`);
  Object.keys(gradeCount).sort().forEach(grade => {
    console.log(`      ${grade}: ${gradeCount[grade]} bets`);
  });
  console.log('');
}


