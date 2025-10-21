// Test Poisson calculation directly
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function poissonPMF(k, lambda) {
  if (lambda <= 0) return 0;
  if (k < 0) return 0;
  
  // For large k or lambda, use log factorial to avoid overflow
  if (k > 20 || lambda > 20) {
    const logPMF = k * Math.log(lambda) - lambda - logFactorial(k);
    return Math.exp(logPMF);
  }
  
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function logFactorial(n) {
  if (n === 0 || n === 1) return 0;
  let result = 0;
  for (let i = 2; i <= n; i++) {
    result += Math.log(i);
  }
  return result;
}

function calculatePoissonWinProb(teamScore, oppScore) {
  let winProb = 0;
  let tieProb = 0;
  
  // Calculate probability for all realistic score combinations (0-10 goals each)
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
  
  // OT advantage: 52/48 split
  const otAdvantage = teamScore > oppScore ? 0.52 : 0.48;
  winProb += tieProb * otAdvantage;
  
  return Math.max(0.05, Math.min(0.95, winProb));
}

// Test SJS @ NYI
// If predictions are 2.9 and 3.3 (as shown in screenshot)
const sjsScore = 2.9;
const nyiScore = 3.3;

console.log(`\nSJS @ NYI Test:`);
console.log(`SJS (away): ${sjsScore} goals`);
console.log(`NYI (home): ${nyiScore} goals`);
console.log(`Total: ${(sjsScore + nyiScore).toFixed(1)} goals`);

const sjsWinProb = calculatePoissonWinProb(sjsScore, nyiScore);
const nyiWinProb = calculatePoissonWinProb(nyiScore, sjsScore);

console.log(`\nWin Probabilities:`);
console.log(`SJS: ${(sjsWinProb * 100).toFixed(1)}%`);
console.log(`NYI: ${(nyiWinProb * 100).toFixed(1)}%`);
console.log(`Sum: ${((sjsWinProb + nyiWinProb) * 100).toFixed(1)}%`);

// Market: SJS +185 = 35.1% implied
const marketImplied = 100 / (185 + 100);
console.log(`\nMarket (SJS +185): ${(marketImplied * 100).toFixed(1)}% implied`);
console.log(`Model - Market: ${((sjsWinProb - marketImplied) * 100).toFixed(1)}% probability edge`);

// Calculate EV
const decimalOdds = 1 + (185 / 100); // +185 → 2.85
const ev = (sjsWinProb * decimalOdds * 100) - 100;
console.log(`\nExpected EV for SJS ML: ${ev > 0 ? '+' : ''}${ev.toFixed(1)}%`);

console.log(`\n✅ This should be +5% to +10%, not +22%!`);

