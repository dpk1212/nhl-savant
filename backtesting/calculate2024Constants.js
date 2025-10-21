/**
 * Calculate 2024 NHL Season Constants
 * Run this to see what the actual league averages are
 */

import { load2024Calibration } from '../src/utils/modelCalibrator.js';

async function main() {
  console.log('🏒 Calculating 2024 NHL Season Constants\n');
  console.log('==========================================\n');
  
  try {
    const calibrator = await load2024Calibration();
    const constants = calibrator.getConstants();
    
    console.log('\n📊 FULL CONSTANTS REPORT:\n');
    console.log('RAW xG Statistics:');
    console.log(`  League Avg xGF/60: ${constants.avgXGF_raw.toFixed(4)}`);
    console.log(`  League Avg xGA/60: ${constants.avgXGA_raw.toFixed(4)}`);
    console.log(`  Std Dev xGF/60:    ${constants.stdDev_xGF_raw.toFixed(4)}`);
    console.log(`  Coefficient of Variation: ${(constants.varianceRatio_raw * 100).toFixed(2)}%\n`);
    
    console.log('Score-Adjusted xG Statistics:');
    console.log(`  League Avg xGF/60: ${constants.avgXGF_scoreAdj.toFixed(4)}`);
    console.log(`  League Avg xGA/60: ${constants.avgXGA_scoreAdj.toFixed(4)}`);
    console.log(`  Std Dev xGF/60:    ${constants.stdDev_xGF_scoreAdj.toFixed(4)}`);
    console.log(`  Coefficient of Variation: ${(constants.varianceRatio_scoreAdj * 100).toFixed(2)}%\n`);
    
    console.log('Shooting Talent:');
    console.log(`  Total Goals: ${constants.totalGoals}`);
    console.log(`  Total xG:    ${constants.totalXG.toFixed(1)}`);
    console.log(`  Ratio:       ${constants.shootingTalent.toFixed(4)} (${((constants.shootingTalent - 1) * 100).toFixed(2)}% above xG)\n`);
    
    console.log('Actual Game Statistics:');
    console.log(`  Avg Goals/Game: ${constants.avgGoalsPerGame.toFixed(3)}`);
    console.log(`  Avg Total xG:   ${constants.avgTotal.toFixed(3)}\n`);
    
    console.log('===========================================\n');
    console.log('🎯 RECOMMENDED CONSTANTS FOR MODEL:\n');
    console.log(`const LEAGUE_AVG_XGF_2024 = ${constants.avgXGF_raw.toFixed(4)};`);
    console.log(`const SHOOTING_TALENT_2024 = ${constants.shootingTalent.toFixed(4)};`);
    console.log(`const TEAM_VARIANCE_2024 = ${constants.stdDev_xGF_raw.toFixed(4)};`);
    console.log(`\n// For comparison:`);
    console.log(`// - Current multiplier: 1.10`);
    console.log(`// - Actual 2024 data:  ${constants.shootingTalent.toFixed(4)}`);
    console.log(`// - Difference:        ${((constants.shootingTalent - 1.10) * 100).toFixed(2)}%\n`);
    
    // Calculate what the model SHOULD predict vs what it IS predicting
    const expectedGoalsPerGame = constants.avgGoalsPerGame;
    const modelCurrentPrediction = 6.10;  // From latest backtest
    const difference = expectedGoalsPerGame - modelCurrentPrediction;
    
    console.log('📉 CALIBRATION CHECK:\n');
    console.log(`Actual 2024 Avg:      ${expectedGoalsPerGame.toFixed(3)} goals/game`);
    console.log(`Model Predicting:     ${modelCurrentPrediction.toFixed(3)} goals/game`);
    console.log(`Difference:           ${difference >= 0 ? '+' : ''}${difference.toFixed(3)} goals/game`);
    console.log(`Percentage Error:     ${(Math.abs(difference / expectedGoalsPerGame) * 100).toFixed(2)}%\n`);
    
    if (Math.abs(difference) < 0.05) {
      console.log('✅ Model is WELL CALIBRATED to 2024 data!\n');
    } else if (Math.abs(difference) < 0.15) {
      console.log('⚠️ Model is REASONABLY CALIBRATED but could be better\n');
    } else {
      console.log('❌ Model needs RECALIBRATION to 2024 data\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

