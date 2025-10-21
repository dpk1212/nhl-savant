// Quick test to verify predictions are sensible
import { loadNHLData } from './src/utils/dataProcessing.js';
import { loadGoalieData, GoalieProcessor } from './src/utils/goalieProcessor.js';

async function test() {
  console.log('Loading data...');
  
  const goalieData = await loadGoalieData();
  const goalieProcessor = new GoalieProcessor(goalieData);
  const dataProcessor = await loadNHLData(goalieProcessor);
  
  // Test SJS @ NYI
  const sjsScore = dataProcessor.predictTeamScore('SJS', 'NYI', false, null); // Away, no goalie
  const nyiScore = dataProcessor.predictTeamScore('NYI', 'SJS', true, null);  // Home, no goalie
  
  console.log(`\nSJS @ NYI Predictions:`);
  console.log(`SJS (away): ${sjsScore.toFixed(2)} goals`);
  console.log(`NYI (home): ${nyiScore.toFixed(2)} goals`);
  console.log(`Total: ${(sjsScore + nyiScore).toFixed(2)} goals`);
  
  // Calculate win probability
  const nyiWinProb = dataProcessor.calculatePoissonWinProb(nyiScore, sjsScore);
  const sjsWinProb = dataProcessor.calculatePoissonWinProb(sjsScore, nyiScore);
  
  console.log(`\nWin Probabilities:`);
  console.log(`NYI: ${(nyiWinProb * 100).toFixed(1)}%`);
  console.log(`SJS: ${(sjsWinProb * 100).toFixed(1)}%`);
  
  // Market odds for SJS: +185 = 35.1% implied
  console.log(`\nMarket (SJS +185): 35.1% implied`);
  console.log(`Model - Market: ${((sjsWinProb - 0.351) * 100).toFixed(1)}% edge`);
  
  // Calculate EV
  const decimalOdds = 1 + (185 / 100); // +185 → 2.85
  const ev = (sjsWinProb * decimalOdds * 100) - 100;
  console.log(`Expected EV: ${ev.toFixed(1)}%`);
}

test().catch(console.error);

