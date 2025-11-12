/**
 * Emergency Model Performance Diagnostic
 * 
 * Analyzes performance degradation from games 1-100 (+18u peak) 
 * to games 100-133 (+1.94u current)
 * 
 * Outputs:
 * 1. Performance splits (early vs recent)
 * 2. Win rate by rating grade
 * 3. Failing pattern identification
 * 4. Root cause hypothesis testing
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8v7b7CaxIEq0aAS6bHHh8dT_inCy06-A",
  authDomain: "nhl-betting-c4990.firebaseapp.com",
  projectId: "nhl-betting-c4990",
  storageBucket: "nhl-betting-c4990.firebasestorage.app",
  messagingSenderId: "966472787729",
  appId: "1:966472787729:web:2bb8ba2b9a94e01a2b7c1f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper: Calculate stats for a segment
function calculateSegmentStats(bets) {
  const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
  const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
  const pushes = bets.filter(b => b.result?.outcome === 'PUSH').length;
  const totalProfit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  
  const decidedBets = wins + losses;
  const winRate = decidedBets > 0 ? (wins / decidedBets) * 100 : 0;
  const roi = bets.length > 0 ? (totalProfit / bets.length) * 100 : 0;
  
  return {
    total: bets.length,
    wins,
    losses,
    pushes,
    winRate: winRate.toFixed(1),
    profit: totalProfit.toFixed(2),
    roi: roi.toFixed(1),
    avgOdds: calculateAvgOdds(bets)
  };
}

// Helper: Calculate average odds
function calculateAvgOdds(bets) {
  if (bets.length === 0) return 0;
  const totalOdds = bets.reduce((sum, b) => sum + (b.bet?.odds || 0), 0);
  return (totalOdds / bets.length).toFixed(0);
}

// Helper: Group by rating
function groupByRating(bets) {
  const ratings = { 'A+': [], 'A': [], 'B+': [], 'B': [], 'C': [] };
  
  bets.forEach(bet => {
    const rating = bet.prediction?.rating || 'Unknown';
    if (ratings[rating]) {
      ratings[rating].push(bet);
    }
  });
  
  return ratings;
}

// Helper: Analyze by home/away
function analyzeHomeAway(bets) {
  const homeBets = bets.filter(b => {
    const pick = b.bet?.pick || '';
    const homeTeam = b.game?.homeTeam || '';
    return pick.includes(homeTeam) || pick.includes('home');
  });
  
  const awayBets = bets.filter(b => {
    const pick = b.bet?.pick || '';
    const awayTeam = b.game?.awayTeam || '';
    return pick.includes(awayTeam) || pick.includes('away');
  });
  
  return {
    home: calculateSegmentStats(homeBets),
    away: calculateSegmentStats(awayBets)
  };
}

// Helper: Analyze by favorite/underdog
function analyzeFavDog(bets) {
  const favorites = bets.filter(b => (b.bet?.odds || 0) < 0);
  const underdogs = bets.filter(b => (b.bet?.odds || 0) > 0);
  
  return {
    favorites: calculateSegmentStats(favorites),
    underdogs: calculateSegmentStats(underdogs)
  };
}

// Main diagnostic function
async function runDiagnostic() {
  console.log('🔍 Starting Emergency Model Performance Diagnostic...\n');
  
  try {
    // Load all completed bets from Firebase
    console.log('📊 Loading bets from Firebase...');
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'COMPLETED'),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const allBets = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    
    console.log(`✅ Loaded ${allBets.length} completed bets\n`);
    
    // Filter to quality bets (B-rated or higher, moneyline only)
    const qualityBets = allBets.filter(b => 
      b.prediction?.rating !== 'C' && 
      b.bet?.market === 'MONEYLINE'
    );
    
    console.log(`✅ ${qualityBets.length} quality moneyline bets (B-rated or higher)\n`);
    
    // Split into early (1-100) vs recent (100-133)
    const SPLIT_POINT = 100;
    const earlyBets = qualityBets.slice(0, SPLIT_POINT);
    const recentBets = qualityBets.slice(SPLIT_POINT);
    
    console.log(`📊 Segment Split:`);
    console.log(`   Early Games (1-${SPLIT_POINT}): ${earlyBets.length} bets`);
    console.log(`   Recent Games (${SPLIT_POINT+1}-${qualityBets.length}): ${recentBets.length} bets\n`);
    
    // ========================================
    // PHASE 1: OVERALL PERFORMANCE COMPARISON
    // ========================================
    console.log('=' .repeat(70));
    console.log('📈 PHASE 1: OVERALL PERFORMANCE COMPARISON');
    console.log('=' .repeat(70));
    
    const earlyStats = calculateSegmentStats(earlyBets);
    const recentStats = calculateSegmentStats(recentBets);
    
    console.log('\n🎯 Early Games (1-100):');
    console.log(`   Total Bets: ${earlyStats.total}`);
    console.log(`   Win Rate: ${earlyStats.winRate}%`);
    console.log(`   Profit: ${earlyStats.profit}u`);
    console.log(`   ROI: ${earlyStats.roi}%`);
    console.log(`   Avg Odds: ${earlyStats.avgOdds}`);
    console.log(`   Record: ${earlyStats.wins}-${earlyStats.losses}-${earlyStats.pushes}`);
    
    console.log('\n🎯 Recent Games (100-133):');
    console.log(`   Total Bets: ${recentStats.total}`);
    console.log(`   Win Rate: ${recentStats.winRate}%`);
    console.log(`   Profit: ${recentStats.profit}u`);
    console.log(`   ROI: ${recentStats.roi}%`);
    console.log(`   Avg Odds: ${recentStats.avgOdds}`);
    console.log(`   Record: ${recentStats.wins}-${recentStats.losses}-${recentStats.pushes}`);
    
    const winRateDelta = (parseFloat(recentStats.winRate) - parseFloat(earlyStats.winRate)).toFixed(1);
    const roiDelta = (parseFloat(recentStats.roi) - parseFloat(earlyStats.roi)).toFixed(1);
    const profitDelta = (parseFloat(recentStats.profit) - parseFloat(earlyStats.profit)).toFixed(2);
    
    console.log('\n📊 PERFORMANCE DELTA:');
    console.log(`   Win Rate Change: ${winRateDelta > 0 ? '+' : ''}${winRateDelta}%`);
    console.log(`   ROI Change: ${roiDelta > 0 ? '+' : ''}${roiDelta}%`);
    console.log(`   Profit Change: ${profitDelta > 0 ? '+' : ''}${profitDelta}u`);
    
    // ========================================
    // PHASE 2: PERFORMANCE BY RATING
    // ========================================
    console.log('\n' + '='.repeat(70));
    console.log('🏆 PHASE 2: PERFORMANCE BY RATING');
    console.log('='.repeat(70));
    
    const earlyByRating = groupByRating(earlyBets);
    const recentByRating = groupByRating(recentBets);
    
    ['A+', 'A', 'B+', 'B'].forEach(rating => {
      const earlyRating = calculateSegmentStats(earlyByRating[rating]);
      const recentRating = calculateSegmentStats(recentByRating[rating]);
      
      console.log(`\n${rating} Rated Bets:`);
      console.log(`   Early (1-100): ${earlyRating.total} bets, ${earlyRating.winRate}% WR, ${earlyRating.profit}u, ${earlyRating.roi}% ROI`);
      console.log(`   Recent (100+): ${recentRating.total} bets, ${recentRating.winRate}% WR, ${recentRating.profit}u, ${recentRating.roi}% ROI`);
      
      if (earlyRating.total > 0 && recentRating.total > 0) {
        const wrDelta = (parseFloat(recentRating.winRate) - parseFloat(earlyRating.winRate)).toFixed(1);
        const roiDelta = (parseFloat(recentRating.roi) - parseFloat(earlyRating.roi)).toFixed(1);
        console.log(`   📊 Change: ${wrDelta > 0 ? '+' : ''}${wrDelta}% WR, ${roiDelta > 0 ? '+' : ''}${roiDelta}% ROI`);
      }
    });
    
    // ========================================
    // PHASE 3: HOME/AWAY ANALYSIS
    // ========================================
    console.log('\n' + '='.repeat(70));
    console.log('🏠 PHASE 3: HOME vs AWAY PERFORMANCE');
    console.log('='.repeat(70));
    
    const earlyHomeAway = analyzeHomeAway(earlyBets);
    const recentHomeAway = analyzeHomeAway(recentBets);
    
    console.log('\n📍 Home Team Bets:');
    console.log(`   Early: ${earlyHomeAway.home.total} bets, ${earlyHomeAway.home.winRate}% WR, ${earlyHomeAway.home.profit}u`);
    console.log(`   Recent: ${recentHomeAway.home.total} bets, ${recentHomeAway.home.winRate}% WR, ${recentHomeAway.home.profit}u`);
    
    console.log('\n📍 Away Team Bets:');
    console.log(`   Early: ${earlyHomeAway.away.total} bets, ${earlyHomeAway.away.winRate}% WR, ${earlyHomeAway.away.profit}u`);
    console.log(`   Recent: ${recentHomeAway.away.total} bets, ${recentHomeAway.away.winRate}% WR, ${recentHomeAway.away.profit}u`);
    
    // ========================================
    // PHASE 4: FAVORITE/UNDERDOG ANALYSIS
    // ========================================
    console.log('\n' + '='.repeat(70));
    console.log('💰 PHASE 4: FAVORITE vs UNDERDOG PERFORMANCE');
    console.log('='.repeat(70));
    
    const earlyFavDog = analyzeFavDog(earlyBets);
    const recentFavDog = analyzeFavDog(recentBets);
    
    console.log('\n📉 Favorites (Negative Odds):');
    console.log(`   Early: ${earlyFavDog.favorites.total} bets, ${earlyFavDog.favorites.winRate}% WR, ${earlyFavDog.favorites.profit}u, Avg: ${earlyFavDog.favorites.avgOdds}`);
    console.log(`   Recent: ${recentFavDog.favorites.total} bets, ${recentFavDog.favorites.winRate}% WR, ${recentFavDog.favorites.profit}u, Avg: ${recentFavDog.favorites.avgOdds}`);
    
    console.log('\n📈 Underdogs (Positive Odds):');
    console.log(`   Early: ${earlyFavDog.underdogs.total} bets, ${earlyFavDog.underdogs.winRate}% WR, ${earlyFavDog.underdogs.profit}u, Avg: ${earlyFavDog.underdogs.avgOdds}`);
    console.log(`   Recent: ${recentFavDog.underdogs.total} bets, ${recentFavDog.underdogs.winRate}% WR, ${recentFavDog.underdogs.profit}u, Avg: ${recentFavDog.underdogs.avgOdds}`);
    
    // ========================================
    // PHASE 5: HYPOTHESIS TESTING
    // ========================================
    console.log('\n' + '='.repeat(70));
    console.log('🔬 PHASE 5: ROOT CAUSE HYPOTHESIS TESTING');
    console.log('='.repeat(70));
    
    // Hypothesis 1: Small Sample Variance
    console.log('\n❓ Hypothesis 1: Small Sample Variance (Bad Luck)');
    const recentWinRate = parseFloat(recentStats.winRate);
    const expectedWinRate = 60; // Target
    const variance = Math.abs(recentWinRate - expectedWinRate);
    console.log(`   Recent Win Rate: ${recentWinRate}%`);
    console.log(`   Expected: ~${expectedWinRate}%`);
    console.log(`   Variance: ${variance.toFixed(1)}%`);
    if (variance < 10) {
      console.log(`   ✅ LIKELY: Within normal variance range`);
    } else {
      console.log(`   ❌ UNLIKELY: Variance too large for luck alone`);
    }
    
    // Hypothesis 2: Rating System Too Loose
    console.log('\n❓ Hypothesis 2: Lower Ratings Dragging Down Performance');
    const recentBRating = calculateSegmentStats(recentByRating['B']);
    const recentBPlusRating = calculateSegmentStats(recentByRating['B+']);
    console.log(`   B-rated Recent: ${recentBRating.winRate}% WR, ${recentBRating.profit}u`);
    console.log(`   B+ rated Recent: ${recentBPlusRating.winRate}% WR, ${recentBPlusRating.profit}u`);
    if (parseFloat(recentBRating.profit) < 0 || parseFloat(recentBPlusRating.profit) < 0) {
      console.log(`   ✅ LIKELY: Lower-rated plays are unprofitable`);
    } else {
      console.log(`   ❌ UNLIKELY: All ratings still profitable`);
    }
    
    // Hypothesis 3: Specific Pattern Failing
    console.log('\n❓ Hypothesis 3: Specific Pattern Failing (Home Favs, etc.)');
    const recentHomeFavs = recentBets.filter(b => {
      const pick = b.bet?.pick || '';
      const homeTeam = b.game?.homeTeam || '';
      const odds = b.bet?.odds || 0;
      return pick.includes(homeTeam) && odds < 0;
    });
    const homeFavStats = calculateSegmentStats(recentHomeFavs);
    console.log(`   Recent Home Favorites: ${homeFavStats.total} bets, ${homeFavStats.winRate}% WR, ${homeFavStats.profit}u`);
    if (parseFloat(homeFavStats.profit) < -5) {
      console.log(`   ✅ LIKELY: Home favorites are killing performance`);
    } else {
      console.log(`   ❌ UNLIKELY: Home favorites performing okay`);
    }
    
    // ========================================
    // RECOMMENDATIONS
    // ========================================
    console.log('\n' + '='.repeat(70));
    console.log('💡 RECOMMENDATIONS');
    console.log('='.repeat(70));
    
    const recommendations = [];
    
    // Check if lower ratings are the problem
    if (parseFloat(recentBRating.profit) < 0) {
      recommendations.push('⚠️  CRITICAL: B-rated bets are unprofitable - consider raising minimum EV threshold to 5% (B+ only)');
    }
    if (parseFloat(recentBPlusRating.profit) < 0) {
      recommendations.push('⚠️  CRITICAL: B+ rated bets also unprofitable - consider only showing A-rated (7%+ EV) plays');
    }
    
    // Check if favorites are the problem
    if (parseFloat(recentFavDog.favorites.profit) < parseFloat(recentFavDog.underdogs.profit) / 2) {
      recommendations.push('⚠️  Favorites underperforming vs underdogs - consider filtering out heavy favorites (-180+)');
    }
    
    // Check if home bets are the problem
    if (parseFloat(recentHomeAway.home.profit) < -5) {
      recommendations.push('⚠️  Home team bets significantly negative - possible home ice advantage overweighting');
    }
    
    // Check overall win rate
    if (recentWinRate < 50) {
      recommendations.push('🚨 CRITICAL: Win rate below 50% - model calibration severely off, needs immediate recalibration');
    } else if (recentWinRate < 55) {
      recommendations.push('⚠️  Win rate below break-even (55%) - model needs minor calibration adjustments');
    }
    
    if (recommendations.length === 0) {
      console.log('\n✅ Performance degradation appears to be normal variance');
      console.log('   Recommendation: Continue with current model, monitor next 20 games');
    } else {
      console.log('\n');
      recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }
    
    // Save results to file
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(__dirname, '..', `MODEL_DIAGNOSTIC_${timestamp}.md`);
    
    const reportContent = `# Model Performance Diagnostic Report
## Generated: ${new Date().toISOString()}

### Summary
- Total Bets Analyzed: ${qualityBets.length}
- Early Performance (1-100): ${earlyStats.profit}u profit, ${earlyStats.winRate}% WR
- Recent Performance (100+): ${recentStats.profit}u profit, ${recentStats.winRate}% WR
- Performance Delta: ${profitDelta}u, ${winRateDelta}% WR

### Recommendations
${recommendations.length > 0 ? recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') : 'No critical issues identified. Continue monitoring.'}

### Detailed Analysis
See console output for full breakdown by rating, home/away, and favorite/underdog splits.
`;
    
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\n📄 Diagnostic report saved to: ${reportPath}`);
    
    console.log('\n✅ Diagnostic Complete!\n');
    
  } catch (error) {
    console.error('❌ Error running diagnostic:', error);
    throw error;
  }
}

// Run diagnostic
runDiagnostic().then(() => {
  console.log('🎉 Diagnostic finished successfully');
  process.exit(0);
}).catch(error => {
  console.error('💥 Diagnostic failed:', error);
  process.exit(1);
});

