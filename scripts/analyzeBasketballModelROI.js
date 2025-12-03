/**
 * 🏀 BASKETBALL MODEL ROI ANALYZER
 * 
 * Analyzes ROI based on MODEL PREDICTION factors:
 * - Model win probability
 * - Model vs Market edge (EV%)
 * - Model confidence (how much model disagrees with market)
 * - Grade breakdown
 * - Favorite vs Dog
 * - Home vs Away
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Client SDK
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials - check .env file');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log(`✅ Firebase initialized: ${firebaseConfig.projectId}`);

async function analyzeBasketballModelROI() {
  console.log('\n🏀 BASKETBALL MODEL ROI ANALYSIS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Fetch ALL completed basketball bets
  const betsQuery = query(
    collection(db, 'basketball_bets'),
    where('status', '==', 'COMPLETED')
  );
  const betsSnapshot = await getDocs(betsQuery);
  
  const bets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(`📊 Analyzing ${bets.length} completed basketball bets\n`);
  
  if (bets.length === 0) {
    console.log('❌ No completed bets found');
    return;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 1. OVERALL STATS
  // ═══════════════════════════════════════════════════════════════
  const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
  const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
  const totalProfit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const totalRisked = bets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
  const overallROI = (totalProfit / totalRisked) * 100;
  
  console.log('📈 OVERALL PERFORMANCE');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`   Record: ${wins}-${losses} (${(wins/(wins+losses)*100).toFixed(1)}%)`);
  console.log(`   Profit: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}u`);
  console.log(`   ROI: ${overallROI > 0 ? '+' : ''}${overallROI.toFixed(1)}%`);
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 2. BY GRADE (A, B, C, D, F)
  // ═══════════════════════════════════════════════════════════════
  console.log('📊 BY GRADE');
  console.log('───────────────────────────────────────────────────────────────');
  
  const gradeStats = {};
  bets.forEach(bet => {
    const grade = bet.prediction?.grade || 'UNKNOWN';
    if (!gradeStats[grade]) {
      gradeStats[grade] = { wins: 0, losses: 0, profit: 0, risked: 0, bets: [] };
    }
    if (bet.result?.outcome === 'WIN') gradeStats[grade].wins++;
    if (bet.result?.outcome === 'LOSS') gradeStats[grade].losses++;
    gradeStats[grade].profit += bet.result?.profit || 0;
    gradeStats[grade].risked += bet.result?.units || bet.prediction?.unitSize || 1;
    gradeStats[grade].bets.push(bet);
  });
  
  Object.entries(gradeStats)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([grade, stats]) => {
      const winRate = stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses) * 100) : 0;
      const roi = stats.risked > 0 ? (stats.profit / stats.risked * 100) : 0;
      const emoji = roi > 0 ? '🟢' : roi < -10 ? '🔴' : '🟡';
      console.log(`   ${emoji} Grade ${grade}: ${stats.wins}-${stats.losses} (${winRate.toFixed(0)}%) | ${stats.profit > 0 ? '+' : ''}${stats.profit.toFixed(2)}u | ROI: ${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`);
    });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 3. BY MODEL WIN PROBABILITY BUCKET
  // ═══════════════════════════════════════════════════════════════
  console.log('🎯 BY MODEL WIN PROBABILITY');
  console.log('───────────────────────────────────────────────────────────────');
  
  const probBuckets = {
    '90%+': { min: 0.90, max: 1.0 },
    '80-90%': { min: 0.80, max: 0.90 },
    '70-80%': { min: 0.70, max: 0.80 },
    '60-70%': { min: 0.60, max: 0.70 },
    '50-60%': { min: 0.50, max: 0.60 },
    '40-50%': { min: 0.40, max: 0.50 },
    '<40%': { min: 0, max: 0.40 }
  };
  
  Object.entries(probBuckets).forEach(([label, { min, max }]) => {
    const bucketBets = bets.filter(b => {
      const pickTeam = b.bet?.team || b.bet?.pick;
      const awayTeam = b.game?.awayTeam;
      const isAway = pickTeam === awayTeam;
      const modelProb = isAway 
        ? (b.prediction?.ensembleAwayProb || 0)
        : (b.prediction?.ensembleHomeProb || 0);
      return modelProb >= min && modelProb < max;
    });
    
    if (bucketBets.length === 0) return;
    
    const bWins = bucketBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = bucketBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = bucketBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = bucketBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`   ${emoji} ${label.padEnd(8)}: ${bWins}-${bLosses} (${(bWins/(bWins+bLosses)*100).toFixed(0)}%) | ${bProfit > 0 ? '+' : ''}${bProfit.toFixed(2)}u | ROI: ${bROI > 0 ? '+' : ''}${bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 4. BY EV% BUCKET (Model Edge)
  // ═══════════════════════════════════════════════════════════════
  console.log('💰 BY EXPECTED VALUE (EV%)', );
  console.log('───────────────────────────────────────────────────────────────');
  
  const evBuckets = {
    '20%+ EV': { min: 20, max: 100 },
    '15-20% EV': { min: 15, max: 20 },
    '10-15% EV': { min: 10, max: 15 },
    '5-10% EV': { min: 5, max: 10 },
    '0-5% EV': { min: 0, max: 5 },
    'Negative EV': { min: -100, max: 0 }
  };
  
  Object.entries(evBuckets).forEach(([label, { min, max }]) => {
    const bucketBets = bets.filter(b => {
      const ev = b.prediction?.evPercent || b.prediction?.bestEV || 0;
      return ev >= min && ev < max;
    });
    
    if (bucketBets.length === 0) return;
    
    const bWins = bucketBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = bucketBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = bucketBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = bucketBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`   ${emoji} ${label.padEnd(12)}: ${bWins}-${bLosses} (${(bWins/(bWins+bLosses)*100).toFixed(0)}%) | ${bProfit > 0 ? '+' : ''}${bProfit.toFixed(2)}u | ROI: ${bROI > 0 ? '+' : ''}${bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 5. FAVORITES VS UNDERDOGS
  // ═══════════════════════════════════════════════════════════════
  console.log('⚖️  FAVORITES VS UNDERDOGS');
  console.log('───────────────────────────────────────────────────────────────');
  
  const favorites = bets.filter(b => (b.bet?.odds || 0) < 0);
  const underdogs = bets.filter(b => (b.bet?.odds || 0) > 0);
  
  [
    { label: 'Favorites', bets: favorites },
    { label: 'Underdogs', bets: underdogs }
  ].forEach(({ label, bets: groupBets }) => {
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`   ${emoji} ${label.padEnd(10)}: ${bWins}-${bLosses} (${(bWins/(bWins+bLosses)*100).toFixed(0)}%) | ${bProfit > 0 ? '+' : ''}${bProfit.toFixed(2)}u | ROI: ${bROI > 0 ? '+' : ''}${bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 6. BY ODDS RANGE
  // ═══════════════════════════════════════════════════════════════
  console.log('📉 BY ODDS RANGE');
  console.log('───────────────────────────────────────────────────────────────');
  
  const oddsRanges = {
    'Heavy Fav (-300+)': b => b.bet?.odds <= -300,
    'Big Fav (-200 to -300)': b => b.bet?.odds > -300 && b.bet?.odds <= -200,
    'Mod Fav (-150 to -200)': b => b.bet?.odds > -200 && b.bet?.odds <= -150,
    'Slight Fav (-110 to -150)': b => b.bet?.odds > -150 && b.bet?.odds <= -110,
    'Pick\'em (-110 to +110)': b => b.bet?.odds > -110 && b.bet?.odds < 110,
    'Slight Dog (+110 to +150)': b => b.bet?.odds >= 110 && b.bet?.odds < 150,
    'Mod Dog (+150 to +200)': b => b.bet?.odds >= 150 && b.bet?.odds < 200,
    'Big Dog (+200+)': b => b.bet?.odds >= 200
  };
  
  Object.entries(oddsRanges).forEach(([label, filter]) => {
    const groupBets = bets.filter(filter);
    if (groupBets.length === 0) return;
    
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`   ${emoji} ${label.padEnd(22)}: ${String(bWins + '-' + bLosses).padEnd(7)} (${(bWins/(bWins+bLosses)*100).toFixed(0)}%) | ${(bProfit > 0 ? '+' : '') + bProfit.toFixed(2).padStart(7)}u | ROI: ${(bROI > 0 ? '+' : '') + bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 7. HOME VS AWAY
  // ═══════════════════════════════════════════════════════════════
  console.log('🏠 HOME VS AWAY');
  console.log('───────────────────────────────────────────────────────────────');
  
  const homeBets = bets.filter(b => b.bet?.team === b.game?.homeTeam || b.bet?.pick === b.game?.homeTeam);
  const awayBets = bets.filter(b => b.bet?.team === b.game?.awayTeam || b.bet?.pick === b.game?.awayTeam);
  
  [
    { label: 'Home', bets: homeBets },
    { label: 'Away', bets: awayBets }
  ].forEach(({ label, bets: groupBets }) => {
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`   ${emoji} ${label.padEnd(6)}: ${bWins}-${bLosses} (${(bWins/(bWins+bLosses)*100).toFixed(0)}%) | ${bProfit > 0 ? '+' : ''}${bProfit.toFixed(2)}u | ROI: ${bROI > 0 ? '+' : ''}${bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 8. GRADE × FAVORITE/DOG MATRIX
  // ═══════════════════════════════════════════════════════════════
  console.log('🔥 GRADE × FAVORITE/UNDERDOG MATRIX');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('   (Shows which Grade+Type combinations are profitable)\n');
  
  const grades = ['A', 'B', 'C', 'D', 'F'];
  const types = [
    { label: 'FAV', filter: b => (b.bet?.odds || 0) < 0 },
    { label: 'DOG', filter: b => (b.bet?.odds || 0) > 0 }
  ];
  
  console.log('   Grade │ FAV Record │ FAV ROI │ DOG Record │ DOG ROI');
  console.log('   ──────┼────────────┼─────────┼────────────┼─────────');
  
  grades.forEach(grade => {
    const gradeBets = bets.filter(b => b.prediction?.grade === grade);
    if (gradeBets.length === 0) return;
    
    let row = `     ${grade}   │`;
    
    types.forEach(({ filter }) => {
      const groupBets = gradeBets.filter(filter);
      if (groupBets.length === 0) {
        row += '     -      │    -    │';
        return;
      }
      
      const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
      const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
      const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
      const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
      const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
      
      const emoji = bROI > 5 ? '🟢' : bROI < -5 ? '🔴' : '⚪';
      const record = `${bWins}-${bLosses}`.padStart(5);
      const roiStr = `${bROI > 0 ? '+' : ''}${bROI.toFixed(0)}%`.padStart(5);
      
      row += ` ${emoji}${record}   │ ${roiStr}   │`;
    });
    
    console.log(row);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 9. MODEL ACCURACY (Did our pick win?)
  // ═══════════════════════════════════════════════════════════════
  console.log('🎯 MODEL ACCURACY BY CONFIDENCE');
  console.log('───────────────────────────────────────────────────────────────');
  
  const highConfBets = bets.filter(b => {
    const pickTeam = b.bet?.team || b.bet?.pick;
    const awayTeam = b.game?.awayTeam;
    const isAway = pickTeam === awayTeam;
    const modelProb = isAway ? (b.prediction?.ensembleAwayProb || 0) : (b.prediction?.ensembleHomeProb || 0);
    return modelProb >= 0.65; // High confidence = 65%+
  });
  
  const medConfBets = bets.filter(b => {
    const pickTeam = b.bet?.team || b.bet?.pick;
    const awayTeam = b.game?.awayTeam;
    const isAway = pickTeam === awayTeam;
    const modelProb = isAway ? (b.prediction?.ensembleAwayProb || 0) : (b.prediction?.ensembleHomeProb || 0);
    return modelProb >= 0.55 && modelProb < 0.65;
  });
  
  const lowConfBets = bets.filter(b => {
    const pickTeam = b.bet?.team || b.bet?.pick;
    const awayTeam = b.game?.awayTeam;
    const isAway = pickTeam === awayTeam;
    const modelProb = isAway ? (b.prediction?.ensembleAwayProb || 0) : (b.prediction?.ensembleHomeProb || 0);
    return modelProb < 0.55;
  });
  
  [
    { label: 'High (65%+)', bets: highConfBets },
    { label: 'Medium (55-65%)', bets: medConfBets },
    { label: 'Low (<55%)', bets: lowConfBets }
  ].forEach(({ label, bets: groupBets }) => {
    if (groupBets.length === 0) return;
    
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`   ${emoji} ${label.padEnd(16)}: ${bWins}-${bLosses} (${(bWins/(bWins+bLosses)*100).toFixed(0)}%) | ${bProfit > 0 ? '+' : ''}${bProfit.toFixed(2)}u | ROI: ${bROI > 0 ? '+' : ''}${bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 10. 🚨 WORST PERFORMING COMBINATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('🚨 BLEEDING COMBINATIONS (Avoid These!)');
  console.log('───────────────────────────────────────────────────────────────');
  
  // Analyze all combinations and find the worst
  const combinations = [];
  
  grades.forEach(grade => {
    Object.entries(oddsRanges).forEach(([oddsLabel, oddsFilter]) => {
      ['Home', 'Away'].forEach(side => {
        const sideFilter = side === 'Home' 
          ? b => b.bet?.team === b.game?.homeTeam || b.bet?.pick === b.game?.homeTeam
          : b => b.bet?.team === b.game?.awayTeam || b.bet?.pick === b.game?.awayTeam;
        
        const groupBets = bets.filter(b => 
          b.prediction?.grade === grade && 
          oddsFilter(b) && 
          sideFilter(b)
        );
        
        if (groupBets.length >= 3) { // At least 3 bets
          const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
          const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
          const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
          const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
          const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
          
          combinations.push({
            label: `Grade ${grade} + ${oddsLabel} + ${side}`,
            wins: bWins,
            losses: bLosses,
            profit: bProfit,
            roi: bROI,
            count: groupBets.length
          });
        }
      });
    });
  });
  
  // Show worst 5 combinations
  combinations
    .sort((a, b) => a.roi - b.roi)
    .slice(0, 5)
    .forEach((combo, i) => {
      console.log(`   ${i + 1}. 🔴 ${combo.label}`);
      console.log(`      ${combo.wins}-${combo.losses} | ${combo.profit > 0 ? '+' : ''}${combo.profit.toFixed(2)}u | ROI: ${combo.roi.toFixed(1)}%`);
    });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 11. ✅ BEST PERFORMING COMBINATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('✅ PROFITABLE COMBINATIONS (Focus Here!)');
  console.log('───────────────────────────────────────────────────────────────');
  
  combinations
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5)
    .forEach((combo, i) => {
      console.log(`   ${i + 1}. 🟢 ${combo.label}`);
      console.log(`      ${combo.wins}-${combo.losses} | ${combo.profit > 0 ? '+' : ''}${combo.profit.toFixed(2)}u | ROI: ${combo.roi > 0 ? '+' : ''}${combo.roi.toFixed(1)}%`);
    });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 12. RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('💡 RECOMMENDATIONS');
  console.log('═══════════════════════════════════════════════════════════════');
  
  // Find patterns
  const favROI = favorites.reduce((sum, b) => sum + (b.result?.profit || 0), 0) / 
                 favorites.reduce((sum, b) => sum + (b.result?.units || 1), 0) * 100;
  const dogROI = underdogs.reduce((sum, b) => sum + (b.result?.profit || 0), 0) / 
                 underdogs.reduce((sum, b) => sum + (b.result?.units || 1), 0) * 100;
  
  if (favROI < -10 && dogROI > 0) {
    console.log('   ⚠️  FAVORITES are bleeding! Consider reducing favorite exposure');
    console.log(`      Favorites: ${favROI.toFixed(1)}% ROI vs Underdogs: ${dogROI.toFixed(1)}% ROI`);
  } else if (dogROI < -10 && favROI > 0) {
    console.log('   ⚠️  UNDERDOGS are bleeding! Consider reducing underdog exposure');
    console.log(`      Underdogs: ${dogROI.toFixed(1)}% ROI vs Favorites: ${favROI.toFixed(1)}% ROI`);
  }
  
  // Grade recommendations
  Object.entries(gradeStats).forEach(([grade, stats]) => {
    const roi = stats.risked > 0 ? (stats.profit / stats.risked * 100) : 0;
    if (roi < -15 && stats.bets.length >= 5) {
      console.log(`   ⚠️  Grade ${grade} is -${Math.abs(roi).toFixed(0)}% ROI. Consider filtering out.`);
    }
    if (roi > 10 && stats.bets.length >= 5) {
      console.log(`   ✅ Grade ${grade} is +${roi.toFixed(0)}% ROI. Increase exposure!`);
    }
  });
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

// Run
analyzeBasketballModelROI()
  .then(() => {
    console.log('✅ Analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

