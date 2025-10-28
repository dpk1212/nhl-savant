/**
 * Calculate 2025-2026 NHL Season Calibration Constants
 * Analyzes actual game results to determine proper scoring multiple
 * 
 * Run with: node scripts/calculate2025Constants.js
 */

import Papa from 'papaparse';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🏒 2025-2026 NHL SEASON - CALIBRATION ANALYSIS');
console.log('=' .repeat(70));

// Read the as-played data
const csvPath = join(__dirname, '..', 'public', 'nhl-202526-asplayed.csv');
const csvData = readFileSync(csvPath, 'utf-8');

const games = Papa.parse(csvData, {
  header: false,  // Don't use headers due to duplicate "Score" columns
  skipEmptyLines: true
}).data;

// Remove header row
const headers = games.shift();

console.log(`\n📊 Loaded ${games.length} games from CSV\n`);

// Column indices: 0=Date, 1=Start(Sask), 2=Start(ET), 3=Visitor, 4=VisitorScore, 5=Home, 6=HomeScore, 7=Status
const regulationGames = games.filter(g => g[7] === 'Regulation');
const overtimeGames = games.filter(g => g[7] === 'OT');
const shootoutGames = games.filter(g => g[7] === 'SO');

console.log('Game Types:');
console.log(`  Regulation: ${regulationGames.length} games`);
console.log(`  Overtime:   ${overtimeGames.length} games`);
console.log(`  Shootout:   ${shootoutGames.length} games`);
console.log(`  Total:      ${games.length} games\n`);

// Calculate total goals for regulation games (most relevant for betting)
let totalGoals_reg = 0;
let gameCount_reg = 0;

regulationGames.forEach(game => {
  const awayScore = parseInt(game[4]) || 0;  // Column 4 = Visitor Score
  const homeScore = parseInt(game[6]) || 0;  // Column 6 = Home Score
  
  if (awayScore >= 0 && homeScore >= 0) {
    totalGoals_reg += (awayScore + homeScore);
    gameCount_reg++;
  }
});

// Calculate for all games (including OT/SO)
let totalGoals_all = 0;
let gameCount_all = 0;

games.forEach(game => {
  if (game[7]) {  // Has status = game is final
    const awayScore = parseInt(game[4]) || 0;  // Column 4 = Visitor Score
    const homeScore = parseInt(game[6]) || 0;  // Column 6 = Home Score
    
    if (awayScore >= 0 && homeScore >= 0) {
      totalGoals_all += (awayScore + homeScore);
      gameCount_all++;
    }
  }
});

const avgGoals_reg = totalGoals_reg / gameCount_reg;
const avgGoals_all = totalGoals_all / gameCount_all;

console.log('=' .repeat(70));
console.log('\n📈 ACTUAL SCORING RATES:\n');
console.log(`Regulation Games Only:`);
console.log(`  Average:  ${avgGoals_reg.toFixed(3)} goals/game`);
console.log(`  Sample:   ${gameCount_reg} games\n`);

console.log(`All Games (incl OT/SO):`);
console.log(`  Average:  ${avgGoals_all.toFixed(3)} goals/game`);
console.log(`  Sample:   ${gameCount_all} games\n`);

// Historical comparison
const avg_2024 = 6.07;  // From backtesting docs
const avg_2023 = 5.99;  // Historical average
const current_calibration = 1.39;

console.log('=' .repeat(70));
console.log('\n📊 HISTORICAL COMPARISON:\n');
console.log(`2023-24 Average:  ${avg_2024.toFixed(2)} goals/game`);
console.log(`2024-25 Average:  ${avg_2023.toFixed(2)} goals/game (historical)`);
console.log(`2025-26 Current:  ${avgGoals_reg.toFixed(2)} goals/game (${gameCount_reg} games)`);
console.log(`\nChange from 2024: ${((avgGoals_reg - avg_2024) / avg_2024 * 100).toFixed(2)}%\n`);

// Calculate what calibration constant we need
// Model without calibration predicts base xG
// With calibration, it predicts: xG * calibration
// We want: (xG * calibration) ≈ actual_goals
// Therefore: calibration = actual_goals / xG

// Estimate what base xG would predict (before calibration)
// Historical data shows xG is typically 15-20% lower than actual
// So if actual = 6.20, base xG ≈ 5.17-5.45
const estimated_base_xG = avgGoals_reg / current_calibration;  // Work backwards from current

console.log('=' .repeat(70));
console.log('\n🎯 CALIBRATION CALCULATION:\n');
console.log(`Current Calibration:  ${current_calibration}`);
console.log(`Estimated base xG:    ${estimated_base_xG.toFixed(3)} goals/game`);
console.log(`Actual goals:         ${avgGoals_reg.toFixed(3)} goals/game`);
console.log(`\nImplied Calibration: ${(avgGoals_reg / estimated_base_xG).toFixed(3)}\n`);

// Calculate needed adjustment
const needed_calibration = avgGoals_reg / estimated_base_xG;
const adjustment_factor = needed_calibration / current_calibration;

console.log('=' .repeat(70));
console.log('\n💡 RECOMMENDATION:\n');

if (Math.abs(adjustment_factor - 1.0) < 0.02) {
  console.log('✅ Current calibration is GOOD (within 2%)');
  console.log(`   No changes needed - keep ${current_calibration}\n`);
} else if (Math.abs(adjustment_factor - 1.0) < 0.05) {
  console.log('⚠️  Current calibration is ACCEPTABLE (within 5%)');
  console.log(`   Minor adjustment recommended: ${needed_calibration.toFixed(3)}`);
  console.log(`   Change: ${((adjustment_factor - 1) * 100).toFixed(2)}%\n`);
} else {
  console.log('❌ Current calibration needs ADJUSTMENT');
  console.log(`   Current: ${current_calibration}`);
  console.log(`   Recommended: ${needed_calibration.toFixed(3)}`);
  console.log(`   Change: ${((adjustment_factor - 1) * 100).toFixed(2)}%\n`);
}

// Provide specific recommendations based on sample size
console.log('=' .repeat(70));
console.log('\n📋 IMPLEMENTATION NOTES:\n');

if (gameCount_reg < 50) {
  console.log(`⚠️  WARNING: Small sample size (${gameCount_reg} games)`);
  console.log('   Recommendation: Wait for 80+ games before recalibrating');
  console.log('   Early season variance can be misleading\n');
} else if (gameCount_reg < 100) {
  console.log(`⚠️  MODERATE sample size (${gameCount_reg} games)`);
  console.log('   Recommendation: Proceed with caution');
  console.log('   Consider waiting for 150+ games for more confidence\n');
} else {
  console.log(`✅ GOOD sample size (${gameCount_reg} games)`);
  console.log('   Safe to recalibrate if needed\n');
}

console.log('To update the calibration constant:');
console.log('  1. Edit: src/utils/dataProcessing.js');
console.log('  2. Find: const HISTORICAL_CALIBRATION = 1.39');
console.log(`  3. Change to: const HISTORICAL_CALIBRATION = ${needed_calibration.toFixed(3)}`);
console.log('  4. Test predictions to verify improvement\n');

console.log('=' .repeat(70));
console.log('\n✅ Analysis complete!\n');

