/**
 * 🏦 BANKROLL & UNIT MANAGEMENT ANALYSIS
 * 
 * The model calibration is good - we're losing because of BAD UNIT SIZING
 * Let's find where we're over-betting and under-betting
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function analyzeUnitManagement() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║            🏦 BANKROLL & UNIT MANAGEMENT ANALYSIS 🏦                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  
  // Fetch ALL completed basketball bets
  const betsQuery = query(
    collection(db, 'basketball_bets'),
    where('status', '==', 'COMPLETED')
  );
  const betsSnapshot = await getDocs(betsQuery);
  const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`📊 Analyzing ${allBets.length} completed bets\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: CURRENT UNIT ALLOCATION
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SECTION 1: WHERE ARE WE ALLOCATING UNITS?                                   │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Group by grade and calculate unit allocation
  const gradeAllocation = {};
  allBets.forEach(bet => {
    const grade = bet.prediction?.grade || 'UNKNOWN';
    if (!gradeAllocation[grade]) {
      gradeAllocation[grade] = { unitsRisked: 0, profit: 0, wins: 0, losses: 0, bets: [] };
    }
    const units = bet.result?.units || bet.prediction?.unitSize || 1;
    gradeAllocation[grade].unitsRisked += units;
    gradeAllocation[grade].profit += bet.result?.profit || 0;
    gradeAllocation[grade].bets.push(bet);
    if (bet.result?.outcome === 'WIN') gradeAllocation[grade].wins++;
    if (bet.result?.outcome === 'LOSS') gradeAllocation[grade].losses++;
  });
  
  const totalUnitsRisked = Object.values(gradeAllocation).reduce((sum, g) => sum + g.unitsRisked, 0);
  
  console.log('   📊 UNIT ALLOCATION BY GRADE:\n');
  console.log('   Grade │ Units Risked │ % of Bankroll │ Profit  │ ROI     │ Problem?');
  console.log('   ──────┼──────────────┼───────────────┼─────────┼─────────┼──────────');
  
  Object.entries(gradeAllocation)
    .sort((a, b) => b[1].unitsRisked - a[1].unitsRisked)
    .forEach(([grade, data]) => {
      const pctBankroll = (data.unitsRisked / totalUnitsRisked * 100);
      const roi = (data.profit / data.unitsRisked * 100);
      const problem = roi < -10 && pctBankroll > 10 ? '🚨 BLEEDING' : 
                      roi > 10 && pctBankroll < 10 ? '📈 INCREASE' : '';
      
      console.log(`   ${grade.padEnd(5)} │ ${data.unitsRisked.toFixed(1).padStart(12)} │ ${pctBankroll.toFixed(1).padStart(12)}% │ ${(data.profit > 0 ? '+' : '') + data.profit.toFixed(2).padStart(6)}u │ ${(roi > 0 ? '+' : '') + roi.toFixed(1).padStart(5)}% │ ${problem}`);
    });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: UNIT SIZE DISTRIBUTION ON WINS VS LOSSES
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SECTION 2: ARE WE BETTING MORE ON LOSERS?                                   │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  const wins = allBets.filter(b => b.result?.outcome === 'WIN');
  const losses = allBets.filter(b => b.result?.outcome === 'LOSS');
  
  const avgUnitsOnWins = wins.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0) / wins.length;
  const avgUnitsOnLosses = losses.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0) / losses.length;
  
  console.log(`   Average units on WINS:   ${avgUnitsOnWins.toFixed(2)}u`);
  console.log(`   Average units on LOSSES: ${avgUnitsOnLosses.toFixed(2)}u`);
  console.log(`   Ratio (Loss/Win):        ${(avgUnitsOnLosses / avgUnitsOnWins).toFixed(2)}x`);
  
  if (avgUnitsOnLosses > avgUnitsOnWins) {
    console.log(`\n   🚨 PROBLEM: Betting ${((avgUnitsOnLosses / avgUnitsOnWins - 1) * 100).toFixed(0)}% MORE on losses than wins!`);
  }
  console.log();
  
  // Breakdown by unit size
  console.log('   📊 PERFORMANCE BY UNIT SIZE BET:\n');
  const unitBuckets = [
    { label: '3u+ bets', filter: b => (b.result?.units || b.prediction?.unitSize || 1) >= 3 },
    { label: '2-3u bets', filter: b => { const u = b.result?.units || b.prediction?.unitSize || 1; return u >= 2 && u < 3; }},
    { label: '1-2u bets', filter: b => { const u = b.result?.units || b.prediction?.unitSize || 1; return u >= 1 && u < 2; }},
    { label: '<1u bets', filter: b => (b.result?.units || b.prediction?.unitSize || 1) < 1 }
  ];
  
  unitBuckets.forEach(({ label, filter }) => {
    const group = allBets.filter(filter);
    if (group.length === 0) return;
    
    const gWins = group.filter(b => b.result?.outcome === 'WIN').length;
    const gLosses = group.filter(b => b.result?.outcome === 'LOSS').length;
    const gProfit = group.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const gRisked = group.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const gROI = gRisked > 0 ? (gProfit / gRisked * 100) : 0;
    
    const emoji = gROI > 5 ? '🟢' : gROI < -10 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${label.padEnd(12)}: ${gWins}-${gLosses} | ${gProfit > 0 ? '+' : ''}${gProfit.toFixed(2)}u | ROI: ${gROI > 0 ? '+' : ''}${gROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: KELLY CRITERION ANALYSIS
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SECTION 3: KELLY CRITERION - WHAT SHOULD WE BE BETTING?                     │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Kelly Formula: f* = (bp - q) / b');
  console.log('   where b = decimal odds - 1, p = win prob, q = 1 - p\n');
  
  // Calculate Kelly for different categories
  const categories = [
    { label: 'Heavy Favorites (-300+)', filter: b => b.bet?.odds <= -300 },
    { label: 'Big Favorites (-200 to -300)', filter: b => b.bet?.odds > -300 && b.bet?.odds <= -200 },
    { label: 'Mod Favorites (-150 to -200)', filter: b => b.bet?.odds > -200 && b.bet?.odds <= -150 },
    { label: 'Slight Favorites (-110 to -150)', filter: b => b.bet?.odds > -150 && b.bet?.odds <= -110 },
    { label: 'Pick\'ems (-110 to +110)', filter: b => b.bet?.odds > -110 && b.bet?.odds < 110 },
    { label: 'Underdogs (+110+)', filter: b => b.bet?.odds >= 110 }
  ];
  
  console.log('   Category                      │ Win% │ Avg Odds │ Kelly % │ Current │ Suggestion');
  console.log('   ──────────────────────────────┼──────┼──────────┼─────────┼─────────┼────────────');
  
  categories.forEach(({ label, filter }) => {
    const group = allBets.filter(filter);
    if (group.length < 5) return;
    
    const gWins = group.filter(b => b.result?.outcome === 'WIN').length;
    const gTotal = group.length;
    const winRate = gWins / gTotal;
    
    const avgOdds = group.reduce((sum, b) => sum + (b.bet?.odds || -110), 0) / gTotal;
    const decimalOdds = avgOdds < 0 ? (100 / Math.abs(avgOdds)) + 1 : (avgOdds / 100) + 1;
    const b = decimalOdds - 1;
    
    // Kelly: f* = (bp - q) / b
    const p = winRate;
    const q = 1 - p;
    const kelly = (b * p - q) / b;
    const kellyPct = Math.max(0, kelly * 100);
    
    // Current average units
    const currentAvg = group.reduce((sum, bet) => sum + (bet.result?.units || bet.prediction?.unitSize || 1), 0) / gTotal;
    
    // Suggestion
    let suggestion;
    if (kellyPct <= 0) suggestion = '❌ NO BET';
    else if (currentAvg > kellyPct * 2) suggestion = `⬇️ Reduce to ${(kellyPct * 0.5).toFixed(1)}u`;
    else if (currentAvg < kellyPct * 0.5 && kellyPct > 1) suggestion = `⬆️ Increase to ${Math.min(kellyPct, 3).toFixed(1)}u`;
    else suggestion = '✅ OK';
    
    console.log(`   ${label.padEnd(30)} │ ${(winRate * 100).toFixed(0).padStart(3)}% │ ${(avgOdds > 0 ? '+' : '') + avgOdds.toFixed(0).padStart(7)} │ ${kellyPct.toFixed(1).padStart(6)}% │ ${currentAvg.toFixed(1).padStart(6)}u │ ${suggestion}`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 4: WHAT IF ANALYSIS - OPTIMAL UNIT SIZING
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SECTION 4: WHAT-IF ANALYSIS - OPTIMAL UNIT SIZING                           │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Recalculate profit with different unit strategies
  const strategies = [
    {
      name: 'Current Strategy',
      getUnits: (bet) => bet.result?.units || bet.prediction?.unitSize || 1
    },
    {
      name: 'Flat 1u All Bets',
      getUnits: () => 1
    },
    {
      name: 'Reduce Heavy Fav to 0.5u',
      getUnits: (bet) => {
        const odds = bet.bet?.odds || -110;
        if (odds <= -300) return 0.5;
        return bet.result?.units || bet.prediction?.unitSize || 1;
      }
    },
    {
      name: 'No Heavy Fav (-300+)',
      getUnits: (bet) => {
        const odds = bet.bet?.odds || -110;
        if (odds <= -300) return 0;
        return bet.result?.units || bet.prediction?.unitSize || 1;
      }
    },
    {
      name: 'No Dogs (+110+)',
      getUnits: (bet) => {
        const odds = bet.bet?.odds || -110;
        if (odds >= 110) return 0;
        return bet.result?.units || bet.prediction?.unitSize || 1;
      }
    },
    {
      name: 'Sweet Spot Only (-200 to -110)',
      getUnits: (bet) => {
        const odds = bet.bet?.odds || -110;
        if (odds > -200 && odds <= -110) return 1.5;
        return 0;
      }
    },
    {
      name: 'Grade-Based (A/B+=2u, C/D/F=1u, A+=0.5u)',
      getUnits: (bet) => {
        const grade = bet.prediction?.grade || 'C';
        if (grade === 'A' || grade === 'B+') return 2;
        if (grade === 'A+' || grade === 'B') return 0.5;
        return 1;
      }
    },
    {
      name: 'OPTIMAL: Grade×Odds Matrix',
      getUnits: (bet) => {
        const grade = bet.prediction?.grade || 'C';
        const odds = bet.bet?.odds || -110;
        
        // Based on our analysis:
        // - A/B+ on Mod/Slight Fav = high conviction
        // - A+ on anything = reduce
        // - Heavy fav = reduce
        // - Dogs = skip
        
        if (odds >= 110) return 0; // No dogs
        if (odds <= -300) return 0.25; // Minimal heavy fav
        
        if ((grade === 'A' || grade === 'B+') && odds > -200 && odds <= -110) {
          return 2.0; // Best performers
        }
        if (grade === 'A+') return 0.5; // Reduce A+
        if (grade === 'B') return 0.5; // Reduce B
        
        return 1.0; // Default
      }
    }
  ];
  
  console.log('   Strategy                              │ Profit   │ ROI      │ Max DD │ Sharpe');
  console.log('   ──────────────────────────────────────┼──────────┼──────────┼────────┼────────');
  
  strategies.forEach(strategy => {
    let totalProfit = 0;
    let totalRisked = 0;
    let runningPL = 0;
    let maxDrawdown = 0;
    let peak = 0;
    const returns = [];
    
    allBets.forEach(bet => {
      const units = strategy.getUnits(bet);
      if (units === 0) return;
      
      const odds = bet.bet?.odds || -110;
      const won = bet.result?.outcome === 'WIN';
      
      let profit;
      if (won) {
        if (odds > 0) {
          profit = units * (odds / 100);
        } else {
          profit = units * (100 / Math.abs(odds));
        }
      } else {
        profit = -units;
      }
      
      totalProfit += profit;
      totalRisked += units;
      runningPL += profit;
      
      if (runningPL > peak) peak = runningPL;
      const dd = peak - runningPL;
      if (dd > maxDrawdown) maxDrawdown = dd;
      
      returns.push(profit / units);
    });
    
    const roi = totalRisked > 0 ? (totalProfit / totalRisked * 100) : 0;
    const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length || 1);
    const stdDev = Math.sqrt(variance);
    const sharpe = stdDev > 0 ? avgReturn / stdDev : 0;
    
    const emoji = roi > 5 ? '🟢' : roi < -5 ? '🔴' : '🟡';
    console.log(`   ${emoji} ${strategy.name.padEnd(37)} │ ${(totalProfit > 0 ? '+' : '') + totalProfit.toFixed(2).padStart(7)}u │ ${(roi > 0 ? '+' : '') + roi.toFixed(1).padStart(6)}% │ ${maxDrawdown.toFixed(1).padStart(5)}u │ ${sharpe.toFixed(3).padStart(6)}`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 5: RECOMMENDED UNIT SIZING MATRIX
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SECTION 5: RECOMMENDED UNIT SIZING MATRIX                                   │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   Based on historical performance, here\'s the optimal unit matrix:\n');
  
  console.log('                     │ Heavy Fav │ Big Fav  │ Mod Fav  │ Slight   │ Pick\'em │ Dog');
  console.log('                     │ (-300+)   │(-200/-300)│(-150/-200)│(-110/-150)│(±110)   │(+110+)');
  console.log('   ──────────────────┼───────────┼──────────┼──────────┼──────────┼─────────┼───────');
  console.log('   Grade A+          │   0.25u   │   0.5u   │   1.0u   │   1.5u   │  0.0u   │ 0.0u');
  console.log('   Grade A           │   0.5u    │   1.0u   │   2.0u   │   2.0u   │  0.5u   │ 0.0u');
  console.log('   Grade B+          │   0.5u    │   1.0u   │   2.0u   │   2.0u   │  0.5u   │ 0.0u');
  console.log('   Grade B           │   0.25u   │   0.5u   │   1.0u   │   1.0u   │  0.0u   │ 0.0u');
  console.log('   Grade C           │   0.5u    │   0.75u  │   1.0u   │   1.0u   │  0.0u   │ 0.0u');
  console.log('   Grade D           │   0.5u    │   0.5u   │   1.0u   │   1.0u   │  0.0u   │ 0.0u');
  console.log('   Grade F           │   0.25u   │   0.5u   │   0.5u   │   0.5u   │  0.0u   │ 0.0u');
  console.log();
  
  console.log('   KEY CHANGES FROM CURRENT:\n');
  console.log('   🔴 REDUCE:');
  console.log('   • Heavy favorites (-300+): Cap at 0.5u max (was 1-2u)');
  console.log('   • A+ grade: Reduce to 0.25-1.5u (was 2-5u)');
  console.log('   • B grade: Reduce to 0.25-1u (was 1-2u)');
  console.log('   • Dogs (+110+): SKIP or 0.0u (was 1-5u)');
  console.log('   • Pick\'ems: SKIP or max 0.5u (was 1-2u)');
  console.log();
  console.log('   🟢 INCREASE:');
  console.log('   • A/B+ on Mod/Slight Fav: Increase to 2.0u');
  console.log('   • Sweet spot (-200 to -110): Main focus');
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // SECTION 6: BANKROLL RULES
  // ═══════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SECTION 6: BANKROLL MANAGEMENT RULES                                        │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘\n');
  
  console.log('   📋 PROPOSED RULES:\n');
  console.log('   1. DAILY CAP: Max 10u total exposure per day');
  console.log('   2. SINGLE BET CAP: Max 2u on any single bet');
  console.log('   3. ODDS LIMITS:');
  console.log('      • No bets on odds worse than -400');
  console.log('      • No bets on dogs > +150');
  console.log('   4. GRADE LIMITS:');
  console.log('      • A+ bets capped at 1u regardless of odds');
  console.log('      • B bets capped at 1u');
  console.log('   5. LOSS LIMITS:');
  console.log('      • Stop after 5u daily loss');
  console.log('      • Reduce to 50% units after 3 consecutive losses');
  console.log('   6. BANKROLL %:');
  console.log('      • 1u = 1% of bankroll');
  console.log('      • Never risk >3% on single bet');
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // FINAL PROJECTION
  // ═══════════════════════════════════════════════════════════════
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                         💰 PROJECTED IMPACT 💰                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
  
  // Calculate what would have happened with optimal strategy
  let optimalProfit = 0;
  let optimalRisked = 0;
  
  allBets.forEach(bet => {
    const grade = bet.prediction?.grade || 'C';
    const odds = bet.bet?.odds || -110;
    
    // Optimal units based on matrix
    let units = 0;
    if (odds >= 110) units = 0; // No dogs
    else if (odds <= -400) units = 0; // No extreme chalk
    else if (odds <= -300) units = 0.25; // Minimal heavy fav
    else if ((grade === 'A' || grade === 'B+') && odds > -200 && odds <= -110) units = 2.0;
    else if (grade === 'A+') units = Math.min(1.0, bet.prediction?.unitSize || 1);
    else if (grade === 'B') units = 0.5;
    else units = 1.0;
    
    if (units === 0) return;
    
    const won = bet.result?.outcome === 'WIN';
    let profit;
    if (won) {
      profit = odds > 0 ? units * (odds / 100) : units * (100 / Math.abs(odds));
    } else {
      profit = -units;
    }
    
    optimalProfit += profit;
    optimalRisked += units;
  });
  
  const currentProfit = allBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const improvement = optimalProfit - currentProfit;
  
  console.log(`   Current Strategy Results:  ${currentProfit > 0 ? '+' : ''}${currentProfit.toFixed(2)}u`);
  console.log(`   Optimal Strategy Results:  ${optimalProfit > 0 ? '+' : ''}${optimalProfit.toFixed(2)}u`);
  console.log(`   ────────────────────────────────────`);
  console.log(`   IMPROVEMENT:               ${improvement > 0 ? '+' : ''}${improvement.toFixed(2)}u`);
  console.log();
  console.log(`   If we had used optimal unit sizing from the start,`);
  console.log(`   we would have saved ${Math.abs(improvement).toFixed(2)} units!`);
  console.log();
  
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
}

// Run
analyzeUnitManagement()
  .then(() => {
    console.log('✅ Unit management analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

