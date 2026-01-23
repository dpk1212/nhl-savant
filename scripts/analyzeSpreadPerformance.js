/**
 * Spread Performance Analysis Script
 * 
 * Analyzes win rate and ROI for:
 * 1. EV-only bets (no spread confirmation)
 * 2. EV + Spread confirmed bets (double conviction)
 * 3. Spread-only bets (no EV, just spread coverage)
 * 
 * Also breaks down by spread tier (HIGH, GOOD, MODERATE, LOW)
 * 
 * Usage: npm run analyze-spread-performance
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const serviceAccount = {
  project_id: process.env.VITE_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
  console.error('❌ Missing Firebase credentials');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

/**
 * Calculate stats for a group of bets
 */
function calculateStats(bets, label) {
  if (bets.length === 0) {
    return { label, totalBets: 0, wins: 0, losses: 0, winRate: 0, roi: 0, profit: 0, risked: 0 };
  }
  
  let wins = 0, losses = 0, totalRisked = 0, totalProfit = 0;
  
  for (const bet of bets) {
    const outcome = bet.result?.outcome;
    if (outcome === 'WIN') wins++;
    else if (outcome === 'LOSS') losses++;
    
    const units = bet.result?.units || bet.prediction?.unitSize || 1.0;
    totalRisked += units;
    totalProfit += bet.result?.profit || 0;
  }
  
  const winRate = bets.length > 0 ? (wins / bets.length) * 100 : 0;
  const roi = totalRisked > 0 ? (totalProfit / totalRisked) * 100 : 0;
  
  return {
    label,
    totalBets: bets.length,
    wins,
    losses,
    winRate: Math.round(winRate * 10) / 10,
    roi: Math.round(roi * 10) / 10,
    profit: Math.round(totalProfit * 100) / 100,
    risked: Math.round(totalRisked * 100) / 100,
    reliable: bets.length >= 10
  };
}

/**
 * Print stats in a formatted table
 */
function printStats(stats) {
  const reliable = stats.reliable ? '' : ' ⚠️';
  console.log(`   ${stats.label}${reliable}`);
  console.log(`     Bets: ${stats.totalBets} | W/L: ${stats.wins}/${stats.losses}`);
  console.log(`     Win Rate: ${stats.winRate}% | ROI: ${stats.roi >= 0 ? '+' : ''}${stats.roi}%`);
  console.log(`     Profit: ${stats.profit >= 0 ? '+' : ''}${stats.profit}u / ${stats.risked}u risked`);
  console.log();
}

/**
 * Main analysis function
 */
async function analyzeSpreadPerformance() {
  console.log('\n🎯 SPREAD PERFORMANCE ANALYSIS');
  console.log('=====================================\n');
  
  try {
    // Fetch all completed bets
    console.log('📂 Fetching completed basketball bets...');
    const snapshot = await db.collection('basketball_bets')
      .where('status', '==', 'COMPLETED')
      .get();
    
    const allBets = [];
    snapshot.forEach(doc => allBets.push({ id: doc.id, ...doc.data() }));
    console.log(`   Found ${allBets.length} completed bets\n`);
    
    if (allBets.length === 0) {
      console.log('⚠️  No completed bets to analyze');
      return;
    }
    
    // Categorize bets
    const evOnly = [];           // EV bets without spread confirmation
    const evPlusSpread = [];     // EV bets WITH spread confirmation (double conviction)
    const spreadOnly = [];       // Spread-only bets (no EV)
    
    // Spread tier breakdown
    const spreadTiers = {
      HIGH: [],
      GOOD: [],
      MODERATE: [],
      LOW: []
    };
    
    // Margin over spread breakdown
    const marginBuckets = {
      'margin_5plus': [],    // +5 or more
      'margin_3to5': [],     // +3 to +5
      'margin_1to3': [],     // +1 to +3
      'margin_under1': []    // under +1
    };
    
    for (const bet of allBets) {
      const hasSpreadConfirm = bet.spreadAnalysis?.spreadConfirmed === true;
      const isSpreadOnly = bet.source === 'SPREAD_OPPORTUNITY';
      const hasEV = bet.prediction?.bestEV > 0 || bet.prediction?.evPercent > 0;
      
      if (isSpreadOnly) {
        spreadOnly.push(bet);
      } else if (hasSpreadConfirm && hasEV) {
        evPlusSpread.push(bet);
      } else if (hasEV) {
        evOnly.push(bet);
      }
      
      // Track by spread tier
      if (hasSpreadConfirm || isSpreadOnly) {
        const tier = bet.spreadAnalysis?.unitTier || bet.prediction?.confidenceTier || 'MODERATE';
        if (spreadTiers[tier]) spreadTiers[tier].push(bet);
        
        // Track by margin over spread
        const margin = bet.spreadAnalysis?.marginOverSpread || 0;
        if (margin >= 5) marginBuckets.margin_5plus.push(bet);
        else if (margin >= 3) marginBuckets.margin_3to5.push(bet);
        else if (margin >= 1) marginBuckets.margin_1to3.push(bet);
        else marginBuckets.margin_under1.push(bet);
      }
    }
    
    // === MAIN COMPARISON ===
    console.log('📊 BET TYPE COMPARISON\n');
    
    const evOnlyStats = calculateStats(evOnly, 'EV-Only Bets (no spread confirm)');
    const evPlusSpreadStats = calculateStats(evPlusSpread, 'EV + Spread Confirmed (double conviction)');
    const spreadOnlyStats = calculateStats(spreadOnly, 'Spread-Only Bets (no EV)');
    
    printStats(evOnlyStats);
    printStats(evPlusSpreadStats);
    printStats(spreadOnlyStats);
    
    // === SPREAD TIER BREAKDOWN ===
    console.log('📊 SPREAD TIER BREAKDOWN\n');
    
    for (const tier of ['HIGH', 'GOOD', 'MODERATE', 'LOW']) {
      const stats = calculateStats(spreadTiers[tier], `${tier} Tier`);
      if (stats.totalBets > 0) printStats(stats);
    }
    
    // === MARGIN OVER SPREAD BREAKDOWN ===
    console.log('📊 MARGIN OVER SPREAD BREAKDOWN\n');
    
    printStats(calculateStats(marginBuckets.margin_5plus, 'Margin +5 or more'));
    printStats(calculateStats(marginBuckets.margin_3to5, 'Margin +3 to +5'));
    printStats(calculateStats(marginBuckets.margin_1to3, 'Margin +1 to +3'));
    printStats(calculateStats(marginBuckets.margin_under1, 'Margin under +1'));
    
    // === KEY INSIGHTS ===
    console.log('💡 KEY INSIGHTS\n');
    
    // Compare EV-only vs EV+Spread
    if (evOnlyStats.totalBets >= 5 && evPlusSpreadStats.totalBets >= 5) {
      const roiDiff = evPlusSpreadStats.roi - evOnlyStats.roi;
      const wrDiff = evPlusSpreadStats.winRate - evOnlyStats.winRate;
      
      if (roiDiff > 5) {
        console.log(`   ✅ EV + Spread bets outperform EV-only by +${roiDiff.toFixed(1)}% ROI`);
      } else if (roiDiff < -5) {
        console.log(`   ⚠️  EV-only bets outperform EV+Spread by +${(-roiDiff).toFixed(1)}% ROI`);
      } else {
        console.log(`   ⚖️  EV-only and EV+Spread have similar ROI (${roiDiff > 0 ? '+' : ''}${roiDiff.toFixed(1)}%)`);
      }
      
      if (wrDiff > 3) {
        console.log(`   ✅ Spread confirmation adds +${wrDiff.toFixed(1)}% to win rate`);
      }
    }
    
    // Best performing tier
    const tierStats = ['HIGH', 'GOOD', 'MODERATE', 'LOW']
      .map(t => ({ tier: t, ...calculateStats(spreadTiers[t], t) }))
      .filter(t => t.totalBets >= 5)
      .sort((a, b) => b.roi - a.roi);
    
    if (tierStats.length > 0) {
      console.log(`   🏆 Best performing tier: ${tierStats[0].tier} (${tierStats[0].roi}% ROI)`);
    }
    
    // Save results to JSON for the UI
    const results = {
      lastUpdated: new Date().toISOString(),
      totalAnalyzed: allBets.length,
      categories: {
        evOnly: evOnlyStats,
        evPlusSpread: evPlusSpreadStats,
        spreadOnly: spreadOnlyStats
      },
      tiers: {
        HIGH: calculateStats(spreadTiers.HIGH, 'HIGH'),
        GOOD: calculateStats(spreadTiers.GOOD, 'GOOD'),
        MODERATE: calculateStats(spreadTiers.MODERATE, 'MODERATE'),
        LOW: calculateStats(spreadTiers.LOW, 'LOW')
      },
      marginBuckets: {
        margin_5plus: calculateStats(marginBuckets.margin_5plus, '+5 or more'),
        margin_3to5: calculateStats(marginBuckets.margin_3to5, '+3 to +5'),
        margin_1to3: calculateStats(marginBuckets.margin_1to3, '+1 to +3'),
        margin_under1: calculateStats(marginBuckets.margin_under1, 'under +1')
      }
    };
    
    // Save to Firebase for the UI to access
    await db.collection('basketball_analytics').doc('spread_performance').set(results);
    console.log('\n   💾 Results saved to Firebase');
    
    // Also save locally for reference
    await fs.writeFile(
      join(__dirname, '../public/spread_performance.json'),
      JSON.stringify(results, null, 2),
      'utf8'
    );
    console.log('   📁 Results saved to public/spread_performance.json');
    
    console.log('\n=====================================');
    console.log('🎉 Analysis complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run
analyzeSpreadPerformance()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
