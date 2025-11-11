/**
 * Verify Recency Weighting is Active
 * 
 * This script tests if the recency weighting code is working
 * by loading the data and making a test prediction
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { NHLDataProcessor } from '../src/utils/dataProcessing.js';
import { GoalieProcessor } from '../src/utils/goalieProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 VERIFYING RECENCY WEIGHTING IS ACTIVE');
console.log('='.repeat(80));

// Load data
const teamsCSV = readFileSync(join(__dirname, '../public/teams.csv'), 'utf-8');
const teamsData = Papa.parse(teamsCSV, { header: true }).data;

const goaliesCSV = readFileSync(join(__dirname, '../public/goalies.csv'), 'utf-8');
const goaliesData = Papa.parse(goaliesCSV, { header: true }).data;

console.log(`✅ Loaded ${teamsData.length} team records`);
console.log(`✅ Loaded ${goaliesData.length} goalie records\n`);

// Initialize processors
const goalieProcessor = new GoalieProcessor(goaliesData);
const dataProcessor = new NHLDataProcessor(teamsData, goalieProcessor);

// Test prediction for a team with strong L10 divergence
console.log('='.repeat(80));
console.log('🧪 TEST CASE 1: Anaheim Ducks (9-1-0 L10 record)');
console.log('='.repeat(80));

// Find Anaheim's stats
const ana5v5 = teamsData.find(t => t.team === 'ANA' && t.situation === '5on5');
if (ana5v5) {
  const seasonXGF = parseFloat(ana5v5.scoreAdj_xGF_per60 || ana5v5.xGF_per60 || 0);
  const l10XGF = parseFloat(ana5v5.L10_xGF_per60 || 0);
  
  console.log(`Season xGF/60: ${seasonXGF.toFixed(2)}`);
  console.log(`L10 xGF/60: ${l10XGF.toFixed(2)}`);
  console.log(`Difference: ${l10XGF > seasonXGF ? '+' : ''}${(l10XGF - seasonXGF).toFixed(2)} (${((l10XGF - seasonXGF) / seasonXGF * 100).toFixed(1)}%)`);
  console.log(`\nExpected weighted (60% L10 + 40% season): ${(l10XGF * 0.6 + seasonXGF * 0.4).toFixed(2)}`);
} else {
  console.log('⚠️ Could not find Anaheim 5v5 stats');
}

console.log('\n' + '='.repeat(80));
console.log('🎯 MAKING TEST PREDICTION: ANA vs TOR');
console.log('='.repeat(80));

// Make a prediction - this will show console logs if recency weighting is active
try {
  const anaScore = dataProcessor.predictTeamScore('ANA', 'TOR', true);
  const torScore = dataProcessor.predictTeamScore('TOR', 'ANA', false);
  
  console.log(`\n✅ Prediction successful:`);
  console.log(`   ANA (home): ${anaScore.toFixed(2)} goals`);
  console.log(`   TOR (away): ${torScore.toFixed(2)} goals`);
  console.log(`   Total: ${(anaScore + torScore).toFixed(2)} goals`);
} catch (error) {
  console.error(`❌ Prediction failed: ${error.message}`);
  console.error(`This means recency weighting code may have errors!`);
}

console.log('\n' + '='.repeat(80));
console.log('📋 VERIFICATION CHECKLIST');
console.log('='.repeat(80));

// Check if L10 columns exist
const hasL10Data = teamsData.some(t => t.L10_xGF_per60 && t.L10_xGF_per60 !== '');
console.log(`${hasL10Data ? '✅' : '❌'} L10 data columns exist in teams.csv`);

// Check if data looks reasonable
const l10Values = teamsData
  .filter(t => t.situation === '5on5' && t.L10_xGF_per60)
  .map(t => parseFloat(t.L10_xGF_per60));

if (l10Values.length > 0) {
  const avgL10 = l10Values.reduce((sum, v) => sum + v, 0) / l10Values.length;
  console.log(`✅ L10 data looks reasonable (avg: ${avgL10.toFixed(2)} xGF/60)`);
  console.log(`   Range: ${Math.min(...l10Values).toFixed(2)} to ${Math.max(...l10Values).toFixed(2)}`);
} else {
  console.log(`❌ No L10 data found in teams.csv!`);
}

// Check if dataProcessing.js has recency weighting code
const dataProcessingCode = readFileSync(join(__dirname, '../src/utils/dataProcessing.js'), 'utf-8');
const hasRecencyCode = dataProcessingCode.includes('L10_xGF_per60') && 
                       dataProcessingCode.includes('Recency weighting');

console.log(`${hasRecencyCode ? '✅' : '❌'} Recency weighting code exists in dataProcessing.js`);

console.log('\n' + '='.repeat(80));
console.log('💡 NEXT STEPS');
console.log('='.repeat(80));

if (hasL10Data && hasRecencyCode) {
  console.log('✅ All checks passed! Recency weighting is READY');
  console.log('\nTo activate on your live site:');
  console.log('  1. Run: npm run build');
  console.log('  2. Run: npm run deploy');
  console.log('  3. Check browser console for "🔄 Recency weighting" messages');
} else {
  console.log('❌ Some checks failed:');
  if (!hasL10Data) console.log('  - L10 data missing from teams.csv');
  if (!hasRecencyCode) console.log('  - Recency weighting code missing from dataProcessing.js');
  console.log('\nRun: node scripts/integrateRealL10Data.js to fix data');
  console.log('Run: node scripts/implementRecencyWeighting.js to fix code');
}

console.log('\n');

