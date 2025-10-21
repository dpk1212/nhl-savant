// Test if odds conversion is correct

function oddsToProbability(americanOdds) {
  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  } else {
    return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
  }
}

function calculateEV(modelProbability, marketOdds, stake = 100) {
  // Convert American odds to decimal odds (includes stake in return)
  let decimalOdds;
  if (marketOdds > 0) {
    // Positive odds: +125 means win $125 on $100 bet → total return $225 → 2.25x
    decimalOdds = 1 + (marketOdds / 100);
  } else {
    // Negative odds: -150 means bet $150 to win $100 → total return $250 → 1.667x
    decimalOdds = 1 + (100 / Math.abs(marketOdds));
  }
  
  // Total return if bet wins (includes original stake)
  const totalReturn = stake * decimalOdds;
  
  // EV = (P_win × total_return) - stake
  const ev = (modelProbability * totalReturn) - stake;
  
  return ev;
}

console.log('\n=== TESTING SJS @ NYI ===');
console.log('Market: SJS +185');

const marketOdds = 185;
const impliedProb = oddsToProbability(marketOdds);
console.log(`\nImplied probability: ${(impliedProb * 100).toFixed(1)}%`);

const modelProb = 0.434; // 43.4% from Poisson
console.log(`Model probability: ${(modelProb * 100).toFixed(1)}%`);

const ev = calculateEV(modelProb, marketOdds);
console.log(`\nEV: ${ev > 0 ? '+' : ''}${ev.toFixed(1)}%`);

console.log('\n=== TESTING SEA @ WSH ===');
console.log('Market: SEA +215');

const seaOdds = 215;
const seaImplied = oddsToProbability(seaOdds);
console.log(`\nImplied probability: ${(seaImplied * 100).toFixed(1)}%`);

// From screenshot: 45.3% EV means model prob is much higher
// Let's reverse engineer what model prob gives 45.3% EV
const targetEV = 45.3;
const decimalOdds = 1 + (seaOdds / 100);
// EV = (modelProb × decimalOdds × 100) - 100 = 45.3
// modelProb × decimalOdds × 100 = 145.3
// modelProb = 145.3 / (decimalOdds × 100)
const impliedModelProb = (targetEV + 100) / (decimalOdds * 100);
console.log(`Model probability (to get +45.3% EV): ${(impliedModelProb * 100).toFixed(1)}%`);

console.log('\n⚠️ If SEA is predicted to score 2.5 vs WSH 2.8, SEA should be ~36-38% to win');
console.log('⚠️ But to get +45.3% EV, model would need to think SEA has 46.1% to win');
console.log('⚠️ That means model thinks SEA is FAVORED despite predicting them to score LESS!');
console.log('\n🔴 THIS IS THE BUG - Win probability is being calculated incorrectly!');

