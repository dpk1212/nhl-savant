// Detailed Poisson debugging

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
  let loseProb = 0;
  
  console.log(`\nCalculating for team=${teamScore.toFixed(1)}, opp=${oppScore.toFixed(1)}`);
  
  // Track top score combinations
  let topCombos = [];
  
  for (let teamGoals = 0; teamGoals <= 10; teamGoals++) {
    const pTeam = poissonPMF(teamGoals, teamScore);
    
    for (let oppGoals = 0; oppGoals <= 10; oppGoals++) {
      const pOpp = poissonPMF(oppGoals, oppScore);
      const pCombo = pTeam * pOpp;
      
      topCombos.push({
        teamGoals,
        oppGoals,
        prob: pCombo,
        outcome: teamGoals > oppGoals ? 'WIN' : teamGoals === oppGoals ? 'TIE' : 'LOSE'
      });
      
      if (teamGoals > oppGoals) {
        winProb += pCombo;
      } else if (teamGoals === oppGoals) {
        tieProb += pCombo;
      } else {
        loseProb += pCombo;
      }
    }
  }
  
  // Sort and show top 10 combos
  topCombos.sort((a, b) => b.prob - a.prob);
  console.log('\nTop 10 most likely score combinations:');
  for (let i = 0; i < 10; i++) {
    const c = topCombos[i];
    console.log(`  ${i+1}. ${c.teamGoals}-${c.oppGoals}: ${(c.prob * 100).toFixed(2)}% (${c.outcome})`);
  }
  
  console.log(`\nRegulation probabilities:`);
  console.log(`  Win:  ${(winProb * 100).toFixed(1)}%`);
  console.log(`  Tie:  ${(tieProb * 100).toFixed(1)}%`);
  console.log(`  Lose: ${(loseProb * 100).toFixed(1)}%`);
  console.log(`  Sum:  ${((winProb + tieProb + loseProb) * 100).toFixed(1)}%`);
  
  // OT advantage: 52/48 split
  const otAdvantage = teamScore > oppScore ? 0.52 : 0.48;
  const otWins = tieProb * otAdvantage;
  
  console.log(`\nOT/SO (${(otAdvantage * 100).toFixed(0)}% to ${teamScore > oppScore ? 'team' : 'opponent'}):`);
  console.log(`  Tie prob: ${(tieProb * 100).toFixed(1)}%`);
  console.log(`  Team gets: ${(otWins * 100).toFixed(1)}% from OT`);
  
  const finalWinProb = winProb + otWins;
  console.log(`\n✅ TOTAL WIN PROBABILITY: ${(finalWinProb * 100).toFixed(1)}%`);
  
  return Math.max(0.05, Math.min(0.95, finalWinProb));
}

// Test SEA @ WSH
console.log('='.repeat(60));
console.log('SEA @ WSH');
console.log('='.repeat(60));
const seaProb = calculatePoissonWinProb(2.5, 2.8);

console.log('\n' + '='.repeat(60));
console.log('Expected: SEA should be ~35-37% (they\'re the underdog!)');
console.log(`Actual: ${(seaProb * 100).toFixed(1)}%`);

if (seaProb > 0.40) {
  console.log('\n🔴 BUG: Underdog has >40% chance despite lower expected score!');
} else {
  console.log('\n✅ Looks correct!');
}

