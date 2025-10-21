// Test with new OT split

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function logFactorial(n) {
  if (n === 0 || n === 1) return 0;
  let result = 0;
  for (let i = 2; i <= n; i++) result += Math.log(i);
  return result;
}

function poissonPMF(k, lambda) {
  if (lambda <= 0) return 0;
  if (k < 0) return 0;
  
  if (k > 20 || lambda > 20) {
    const logPMF = k * Math.log(lambda) - lambda - logFactorial(k);
    return Math.exp(logPMF);
  }
  
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function calculatePoissonWinProb(teamScore, oppScore) {
  let winProb = 0;
  let tieProb = 0;
  
  for (let teamGoals = 0; teamGoals <= 10; teamGoals++) {
    const pTeam = poissonPMF(teamGoals, teamScore);
    
    for (let oppGoals = 0; oppGoals <= 10; oppGoals++) {
      const pOpp = poissonPMF(oppGoals, oppScore);
      const pCombo = pTeam * pOpp;
      
      if (teamGoals > oppGoals) {
        winProb += pCombo;
      } else if (teamGoals === oppGoals) {
        tieProb += pCombo;
      }
    }
  }
  
  // NEW: 58/42 split
  const otAdvantage = teamScore > oppScore ? 0.58 : 0.42;
  winProb += tieProb * otAdvantage;
  
  return Math.max(0.05, Math.min(0.95, winProb));
}

function calculateEV(modelProb, marketOdds) {
  const decimalOdds = marketOdds > 0 ? 1 + (marketOdds / 100) : 1 + (100 / Math.abs(marketOdds));
  return (modelProb * decimalOdds * 100) - 100;
}

console.log('\n=== SEA @ WSH (2.5 vs 2.8) ===');
const seaProb = calculatePoissonWinProb(2.5, 2.8);
console.log(`SEA win probability: ${(seaProb * 100).toFixed(1)}%`);
console.log(`Market implied (+ 215): 31.7%`);
const seaEV = calculateEV(seaProb, 215);
console.log(`EV: ${seaEV > 0 ? '+' : ''}${seaEV.toFixed(1)}%`);

console.log('\n=== SJS @ NYI (2.9 vs 3.3) ===');
const sjsProb = calculatePoissonWinProb(2.9, 3.3);
console.log(`SJS win probability: ${(sjsProb * 100).toFixed(1)}%`);
console.log(`Market implied (+185): 35.1%`);
const sjsEV = calculateEV(sjsProb, 185);
console.log(`EV: ${sjsEV > 0 ? '+' : ''}${sjsEV.toFixed(1)}%`);

console.log('\n✅ Expected EVs: +5-15% range (reasonable early season edges)');

