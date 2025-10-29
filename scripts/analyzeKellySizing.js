import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDZ8g7LT2uJ7KxWZxQxQxQxQxQxQxQxQxQ",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "nhl-savant.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "nhl-savant",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "nhl-savant.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kelly Criterion Parameters
const STARTING_BANKROLL = 500;
const KELLY_FRACTION = 0.25; // Quarter Kelly (conservative)
const MAX_BET_PCT = 0.05; // 5% of current bankroll
const MIN_BET = 5; // $5 minimum
const BANKROLL_FLOOR = 100; // Stop if bankroll drops below $100

function simulateStrategy(bets, strategyName) {
  let flatBankroll = STARTING_BANKROLL;
  let kellyBankroll = STARTING_BANKROLL;
  let flatUnits = 0;
  let kellyBetsPlaced = 0;
  let flatMaxDrawdown = 0;
  let kellyMaxDrawdown = 0;
  let flatPeakBankroll = STARTING_BANKROLL;
  let kellyPeakBankroll = STARTING_BANKROLL;

  const flatProgression = [STARTING_BANKROLL];
  const kellyProgression = [STARTING_BANKROLL];
  const betDetails = [];

  for (const bet of bets) {
    const outcome = bet.result?.outcome;
    const profit = bet.result?.profit || 0;
    const odds = bet.bet?.odds;
    const kelly = bet.prediction?.kelly || 0;
    const evPercent = bet.prediction?.evPercent || 0;

    // FLAT BETTING
    const flatBetSize = 10;
    const flatProfit = profit * flatBetSize;
    flatBankroll += flatProfit;
    flatUnits += profit;
    flatProgression.push(flatBankroll);

    if (flatBankroll > flatPeakBankroll) {
      flatPeakBankroll = flatBankroll;
    }
    const flatCurrentDrawdown = ((flatPeakBankroll - flatBankroll) / flatPeakBankroll) * 100;
    if (flatCurrentDrawdown > flatMaxDrawdown) {
      flatMaxDrawdown = flatCurrentDrawdown;
    }

    // KELLY CRITERION BETTING
    let kellyBetSize = 0;
    let kellyProfit = 0;
    let kellySkipped = false;

    if (kellyBankroll >= BANKROLL_FLOOR) {
      const edge = evPercent / 100;
      const kellyPct = (edge / (odds - 1)) * KELLY_FRACTION;
      const uncappedBet = kellyPct * kellyBankroll;
      const cappedBet = Math.min(uncappedBet, MAX_BET_PCT * kellyBankroll);
      kellyBetSize = Math.max(cappedBet, MIN_BET);
      
      if (kellyBetSize <= kellyBankroll) {
        if (outcome === 'WIN') {
          if (odds >= 0) {
            kellyProfit = kellyBetSize * (odds / 100);
          } else {
            kellyProfit = kellyBetSize * (100 / Math.abs(odds));
          }
        } else if (outcome === 'LOSS') {
          kellyProfit = -kellyBetSize;
        } else if (outcome === 'PUSH') {
          kellyProfit = 0;
        }
        
        kellyBankroll += kellyProfit;
        kellyBetsPlaced++;
      } else {
        kellySkipped = true;
      }
    } else {
      kellySkipped = true;
    }

    kellyProgression.push(kellyBankroll);

    if (kellyBankroll > kellyPeakBankroll) {
      kellyPeakBankroll = kellyBankroll;
    }
    const kellyCurrentDrawdown = ((kellyPeakBankroll - kellyBankroll) / kellyPeakBankroll) * 100;
    if (kellyCurrentDrawdown > kellyMaxDrawdown) {
      kellyMaxDrawdown = kellyCurrentDrawdown;
    }

    betDetails.push({
      date: bet.date,
      game: `${bet.game.awayTeam} @ ${bet.game.homeTeam}`,
      pick: bet.bet.pick,
      odds: odds,
      evPercent: evPercent.toFixed(1),
      kelly: Number(kelly || 0).toFixed(3),
      outcome: outcome,
      flatBet: flatBetSize,
      flatProfit: flatProfit.toFixed(2),
      flatBankroll: flatBankroll.toFixed(2),
      kellyBet: kellySkipped ? 'SKIPPED' : kellyBetSize.toFixed(2),
      kellyProfit: kellySkipped ? '-' : kellyProfit.toFixed(2),
      kellyBankroll: kellyBankroll.toFixed(2)
    });
  }

  return {
    strategyName,
    totalBets: bets.length,
    flatBankroll,
    kellyBankroll,
    flatMaxDrawdown,
    kellyMaxDrawdown,
    kellyBetsPlaced,
    betDetails
  };
}

async function analyzeKellySizing() {
  console.log('🎲 KELLY CRITERION BANKROLL ANALYSIS BY MARKET');
  console.log('================================================\n');

  // Fetch all completed bets
  console.log('📊 Fetching completed bets from Firebase...');
  const q = query(
    collection(db, 'bets'),
    where('status', '==', 'COMPLETED')
  );
  
  const snapshot = await getDocs(q);
  let bets = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
  
  // FILTER: Only B-rated or higher (same as Performance Dashboard)
  bets = bets.filter(b => b.prediction?.rating !== 'C');
  
  // Sort by timestamp in memory (to avoid needing composite index)
  bets = bets.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  
  console.log(`✅ Loaded ${bets.length} B-rated or higher completed bets\n`);

  if (bets.length === 0) {
    console.log('❌ No completed bets found!');
    return;
  }

  // Split by market
  const mlBets = bets.filter(b => b.bet?.market === 'MONEYLINE');
  const totalBets = bets.filter(b => b.bet?.market === 'TOTAL');
  
  console.log(`📊 Market Breakdown:`);
  console.log(`   Moneyline: ${mlBets.length} bets`);
  console.log(`   Totals: ${totalBets.length} bets`);
  console.log(`   All Markets: ${bets.length} bets\n`);

  // Simulate strategies for each market
  console.log('💰 Simulating betting strategies...\n');
  
  const allResults = simulateStrategy(bets, 'All Markets');
  const mlResults = simulateStrategy(mlBets, 'Moneyline Only');
  const totalResults = simulateStrategy(totalBets, 'Totals Only');

  // Helper function to generate market report section
  function generateMarketReport(results) {
    const flatROI = ((results.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100;
    const kellyROI = ((results.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100;
    const flatTotalWagered = results.totalBets * 10;
    const kellyTotalWagered = results.betDetails
      .filter(b => b.kellyBet !== 'SKIPPED')
      .reduce((sum, b) => sum + parseFloat(b.kellyBet), 0);

    return `
### ${results.strategyName} (${results.totalBets} bets)

| Metric | Flat Betting | Kelly Criterion | Winner |
|--------|-------------|-----------------|--------|
| **Final Bankroll** | $${results.flatBankroll.toFixed(2)} | $${results.kellyBankroll.toFixed(2)} | ${results.kellyBankroll > results.flatBankroll ? '🏆 Kelly' : '🏆 Flat'} |
| **Total Profit/Loss** | $${(results.flatBankroll - STARTING_BANKROLL).toFixed(2)} | $${(results.kellyBankroll - STARTING_BANKROLL).toFixed(2)} | ${results.kellyBankroll > results.flatBankroll ? '🏆 Kelly' : '🏆 Flat'} |
| **ROI** | ${flatROI.toFixed(2)}% | ${kellyROI.toFixed(2)}% | ${kellyROI > flatROI ? '🏆 Kelly' : '🏆 Flat'} |
| **Max Drawdown** | ${results.flatMaxDrawdown.toFixed(2)}% | ${results.kellyMaxDrawdown.toFixed(2)}% | ${results.kellyMaxDrawdown < results.flatMaxDrawdown ? '🏆 Kelly' : '🏆 Flat'} |
| **Total Wagered** | $${flatTotalWagered.toFixed(2)} | $${kellyTotalWagered.toFixed(2)} | - |
| **Bets Placed** | ${results.totalBets} | ${results.kellyBetsPlaced} | - |
`;
  }

  // Generate report
  console.log('📝 Generating analysis report...\n');

  const report = `# KELLY CRITERION BANKROLL ANALYSIS BY MARKET
**NHL Savant Betting Performance - B-Rated or Higher Bets Only**
*Generated: ${new Date().toLocaleString()}*

---

## EXECUTIVE SUMMARY

Analyzed **${bets.length} B-rated or higher completed bets** (>= 3% EV) comparing flat betting vs Kelly Criterion across different markets.

**Market Breakdown:**
- 🎯 **Moneyline**: ${mlBets.length} bets
- 📊 **Totals**: ${totalBets.length} bets

### Strategy Parameters
- **Starting Bankroll**: $${STARTING_BANKROLL} (separate bankroll for each market test)
- **Kelly Fraction**: ${KELLY_FRACTION} (Quarter Kelly - Conservative)
- **Maximum Bet**: ${MAX_BET_PCT * 100}% of current bankroll
- **Minimum Bet**: $${MIN_BET}
- **Bankroll Floor**: $${BANKROLL_FLOOR} (stop trading below this)

---

## PERFORMANCE COMPARISON BY MARKET

${generateMarketReport(allResults)}

${generateMarketReport(mlResults)}

${generateMarketReport(totalResults)}

---

## KEY INSIGHTS

### Market Performance Summary

| Market | Flat ROI | Kelly ROI | Kelly Advantage | Flat Drawdown | Kelly Drawdown | Risk Advantage |
|--------|----------|-----------|-----------------|---------------|----------------|----------------|
| **All Markets** | ${(((allResults.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${(((allResults.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${(((allResults.kellyBankroll - allResults.flatBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${allResults.flatMaxDrawdown.toFixed(2)}% | ${allResults.kellyMaxDrawdown.toFixed(2)}% | ${(allResults.flatMaxDrawdown - allResults.kellyMaxDrawdown).toFixed(2)}% |
| **Moneyline** | ${(((mlResults.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${(((mlResults.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${(((mlResults.kellyBankroll - mlResults.flatBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${mlResults.flatMaxDrawdown.toFixed(2)}% | ${mlResults.kellyMaxDrawdown.toFixed(2)}% | ${(mlResults.flatMaxDrawdown - mlResults.kellyMaxDrawdown).toFixed(2)}% |
| **Totals** | ${(((totalResults.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${(((totalResults.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${(((totalResults.kellyBankroll - totalResults.flatBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}% | ${totalResults.flatMaxDrawdown.toFixed(2)}% | ${totalResults.kellyMaxDrawdown.toFixed(2)}% | ${(totalResults.flatMaxDrawdown - totalResults.kellyMaxDrawdown).toFixed(2)}% |

### Analysis

**Best Market for Kelly:**
${mlResults.kellyBankroll > mlResults.flatBankroll && mlResults.kellyBankroll > totalResults.kellyBankroll ? 
  '🏆 **MONEYLINE** - Kelly outperformed flat betting and showed best absolute returns' :
  totalResults.kellyBankroll > totalResults.flatBankroll && totalResults.kellyBankroll > mlResults.kellyBankroll ?
  '🏆 **TOTALS** - Kelly outperformed flat betting and showed best absolute returns' :
  '⚠️ **NEITHER** - Flat betting currently outperforms Kelly on both markets'
}

**Best Market for Flat Betting:**
${mlResults.flatBankroll > mlResults.kellyBankroll && mlResults.flatBankroll > totalResults.flatBankroll ?
  '🏆 **MONEYLINE** - Highest ROI with flat betting strategy' :
  totalResults.flatBankroll > totalResults.kellyBankroll && totalResults.flatBankroll > mlResults.flatBankroll ?
  '🏆 **TOTALS** - Highest ROI with flat betting strategy' :
  '✅ Both markets showing positive returns'
}

**Risk Management Winner:**
${allResults.kellyMaxDrawdown < allResults.flatMaxDrawdown ? 
  '🏆 **KELLY** - Lower drawdown across all markets' : 
  '🏆 **FLAT** - Lower drawdown in current sample'
}

---

## RECOMMENDATIONS

### Market-Specific Strategy

**For Moneyline Bets:**
${mlResults.kellyBankroll > mlResults.flatBankroll ? 
  `✅ **Consider Kelly Criterion** - Showing ${(((mlResults.kellyBankroll - mlResults.flatBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}% better ROI with ${(mlResults.flatMaxDrawdown - mlResults.kellyMaxDrawdown).toFixed(2)}% less drawdown` :
  `⚠️ **Stick with Flat Betting** - Currently outperforming Kelly by ${(((mlResults.flatBankroll - mlResults.kellyBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}%`
}

**For Total Bets:**
${totalResults.kellyBankroll > totalResults.flatBankroll ?
  `✅ **Consider Kelly Criterion** - Showing ${(((totalResults.kellyBankroll - totalResults.flatBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}% better ROI with ${(totalResults.flatMaxDrawdown - totalResults.kellyMaxDrawdown).toFixed(2)}% less drawdown` :
  `⚠️ **Stick with Flat Betting** - Currently outperforming Kelly by ${(((totalResults.flatBankroll - totalResults.kellyBankroll) / STARTING_BANKROLL) * 100).toFixed(2)}%`
}

### Overall Recommendation

${allResults.kellyBankroll > allResults.flatBankroll && allResults.kellyMaxDrawdown < allResults.flatMaxDrawdown ?
  `🎯 **IMPLEMENT KELLY CRITERION** - Superior returns AND lower risk across all markets` :
  allResults.kellyBankroll > allResults.flatBankroll ?
  `✅ **CONSIDER KELLY** - Higher returns but with slightly more volatility` :
  allResults.kellyMaxDrawdown < allResults.flatMaxDrawdown ?
  `⚖️ **KELLY FOR RISK MANAGEMENT** - Lower drawdowns make up for slightly lower returns` :
  `⚠️ **CONTINUE FLAT BETTING** - Sample size may be too small for Kelly to demonstrate advantages`
}

---

## METHODOLOGY

### Kelly Criterion Formula

\`\`\`
Kelly % = (Edge / Odds) * Kelly Fraction
Edge = EV% / 100
Bet Size = min(Kelly % × Bankroll, 5% × Bankroll)
Bet Size = max(Bet Size, $${MIN_BET})
\`\`\`

### Testing Methodology
- Each market tested with separate $${STARTING_BANKROLL} starting bankroll
- "All Markets" combines both ML and Total bets chronologically
- Only B-rated or higher bets included (>= 3% EV)
- Results show if Kelly sizing benefits one market more than another

### Assumptions
- All bets are independent
- Edge calculations from model are accurate
- No transaction costs or taxes
- Bankroll stops trading below $${BANKROLL_FLOOR}

---

*Analysis generated by NHL Savant Analytics*
`;

  // Write report to file
  const reportPath = join(__dirname, '..', 'KELLY_ANALYSIS.md');
  writeFileSync(reportPath, report);
  
  console.log('✅ Analysis complete!\n');
  console.log('📊 RESULTS SUMMARY:\n');
  
  console.log('ALL MARKETS:');
  console.log(`   Flat Betting:     $${allResults.flatBankroll.toFixed(2)} (${(((allResults.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% ROI)`);
  console.log(`   Kelly Criterion:  $${allResults.kellyBankroll.toFixed(2)} (${(((allResults.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% ROI)`);
  console.log(`   Winner:           ${allResults.kellyBankroll > allResults.flatBankroll ? '🏆 Kelly' : '🏆 Flat'} (+$${Math.abs(allResults.kellyBankroll - allResults.flatBankroll).toFixed(2)})\n`);
  
  console.log('MONEYLINE ONLY:');
  console.log(`   Flat Betting:     $${mlResults.flatBankroll.toFixed(2)} (${(((mlResults.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% ROI)`);
  console.log(`   Kelly Criterion:  $${mlResults.kellyBankroll.toFixed(2)} (${(((mlResults.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% ROI)`);
  console.log(`   Winner:           ${mlResults.kellyBankroll > mlResults.flatBankroll ? '🏆 Kelly' : '🏆 Flat'} (+$${Math.abs(mlResults.kellyBankroll - mlResults.flatBankroll).toFixed(2)})\n`);
  
  console.log('TOTALS ONLY:');
  console.log(`   Flat Betting:     $${totalResults.flatBankroll.toFixed(2)} (${(((totalResults.flatBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% ROI)`);
  console.log(`   Kelly Criterion:  $${totalResults.kellyBankroll.toFixed(2)} (${(((totalResults.kellyBankroll - STARTING_BANKROLL) / STARTING_BANKROLL) * 100).toFixed(2)}% ROI)`);
  console.log(`   Winner:           ${totalResults.kellyBankroll > totalResults.flatBankroll ? '🏆 Kelly' : '🏆 Flat'} (+$${Math.abs(totalResults.kellyBankroll - totalResults.flatBankroll).toFixed(2)})\n`);
  
  console.log(`📝 Full report saved to: KELLY_ANALYSIS.md\n`);
}

analyzeKellySizing().catch(console.error);

