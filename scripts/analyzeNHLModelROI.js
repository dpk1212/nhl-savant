/**
 * NHL Model ROI Analysis
 * Comprehensive analysis of NHL betting performance
 * Identifies profitable patterns and areas for improvement
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Firebase config from environment
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

// Helper to calculate ROI
function calculateROI(bets) {
  if (bets.length === 0) return { roi: 0, profit: 0, wins: 0, losses: 0, pushes: 0, winRate: 0 };
  
  const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
  const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
  const pushes = bets.filter(b => b.result?.outcome === 'PUSH').length;
  const profit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const decidedBets = wins + losses;
  const winRate = decidedBets > 0 ? (wins / decidedBets) * 100 : 0;
  const roi = bets.length > 0 ? (profit / bets.length) * 100 : 0;
  
  return { roi, profit, wins, losses, pushes, winRate, total: bets.length };
}

// Helper to format stats
function formatStats(stats, label = '') {
  const prefix = label ? `${label}: ` : '';
  return `${prefix}${stats.total} bets | ${stats.wins}-${stats.losses}-${stats.pushes} | ${stats.winRate.toFixed(1)}% WR | ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u | ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}% ROI`;
}

async function analyzeNHLROI() {
  console.log('\n🏒 NHL MODEL ROI ANALYSIS');
  console.log('='.repeat(80));
  
  try {
    // Load all completed NHL bets
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'COMPLETED')
    );
    
    const snapshot = await getDocs(q);
    const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`\n📊 Total Completed Bets: ${allBets.length}`);
    
    // Filter to moneyline only (main focus)
    const moneylineBets = allBets.filter(b => b.bet?.market === 'MONEYLINE');
    console.log(`📊 Moneyline Bets: ${moneylineBets.length}`);
    
    const overallStats = calculateROI(moneylineBets);
    console.log(`\n${formatStats(overallStats, '📈 OVERALL')}`);
    
    // ═══════════════════════════════════════════════════════════════
    // 1. PERFORMANCE BY RATING/GRADE
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('🎯 PERFORMANCE BY RATING');
    console.log('═'.repeat(80));
    
    const ratings = ['A+', 'A', 'B+', 'B', 'C'];
    const ratingResults = {};
    
    ratings.forEach(rating => {
      const ratingBets = moneylineBets.filter(b => b.prediction?.rating === rating);
      if (ratingBets.length > 0) {
        const stats = calculateROI(ratingBets);
        ratingResults[rating] = stats;
        const indicator = stats.profit >= 0 ? '✅' : '❌';
        console.log(`${indicator} ${formatStats(stats, rating)}`);
      }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 2. PERFORMANCE BY ODDS RANGE
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('💰 PERFORMANCE BY ODDS RANGE');
    console.log('═'.repeat(80));
    
    const oddsRanges = [
      { name: 'Heavy Favorites (-200 or better)', filter: b => (b.bet?.odds || 0) <= -200 },
      { name: 'Moderate Favorites (-150 to -199)', filter: b => (b.bet?.odds || 0) > -200 && (b.bet?.odds || 0) <= -150 },
      { name: 'Slight Favorites (-110 to -149)', filter: b => (b.bet?.odds || 0) > -150 && (b.bet?.odds || 0) < -100 },
      { name: 'Pick\'em (-109 to +109)', filter: b => Math.abs(b.bet?.odds || 0) <= 109 || (b.bet?.odds || 0) === -110 },
      { name: 'Slight Dogs (+110 to +149)', filter: b => (b.bet?.odds || 0) >= 110 && (b.bet?.odds || 0) < 150 },
      { name: 'Moderate Dogs (+150 to +199)', filter: b => (b.bet?.odds || 0) >= 150 && (b.bet?.odds || 0) < 200 },
      { name: 'Big Dogs (+200 or worse)', filter: b => (b.bet?.odds || 0) >= 200 }
    ];
    
    const oddsResults = {};
    oddsRanges.forEach(range => {
      const rangeBets = moneylineBets.filter(range.filter);
      if (rangeBets.length > 0) {
        const stats = calculateROI(rangeBets);
        oddsResults[range.name] = stats;
        const indicator = stats.profit >= 0 ? '✅' : '❌';
        console.log(`${indicator} ${formatStats(stats, range.name)}`);
      }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 3. PERFORMANCE BY MODEL PROBABILITY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('🎲 PERFORMANCE BY MODEL PROBABILITY');
    console.log('═'.repeat(80));
    
    const probRanges = [
      { name: 'Very High (70%+)', filter: b => (b.prediction?.modelProb || 0) >= 0.70 },
      { name: 'High (60-69%)', filter: b => (b.prediction?.modelProb || 0) >= 0.60 && (b.prediction?.modelProb || 0) < 0.70 },
      { name: 'Medium (50-59%)', filter: b => (b.prediction?.modelProb || 0) >= 0.50 && (b.prediction?.modelProb || 0) < 0.60 },
      { name: 'Low (<50%)', filter: b => (b.prediction?.modelProb || 0) < 0.50 && (b.prediction?.modelProb || 0) > 0 }
    ];
    
    probRanges.forEach(range => {
      const rangeBets = moneylineBets.filter(range.filter);
      if (rangeBets.length > 0) {
        const stats = calculateROI(rangeBets);
        const indicator = stats.profit >= 0 ? '✅' : '❌';
        console.log(`${indicator} ${formatStats(stats, range.name)}`);
      }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 4. PERFORMANCE BY EV%
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('📊 PERFORMANCE BY EV%');
    console.log('═'.repeat(80));
    
    const evRanges = [
      { name: 'Elite EV (10%+)', filter: b => (b.prediction?.evPercent || 0) >= 10 },
      { name: 'Strong EV (5-9.9%)', filter: b => (b.prediction?.evPercent || 0) >= 5 && (b.prediction?.evPercent || 0) < 10 },
      { name: 'Good EV (2.5-4.9%)', filter: b => (b.prediction?.evPercent || 0) >= 2.5 && (b.prediction?.evPercent || 0) < 5 },
      { name: 'Low EV (0-2.4%)', filter: b => (b.prediction?.evPercent || 0) >= 0 && (b.prediction?.evPercent || 0) < 2.5 }
    ];
    
    evRanges.forEach(range => {
      const rangeBets = moneylineBets.filter(range.filter);
      if (rangeBets.length > 0) {
        const stats = calculateROI(rangeBets);
        const indicator = stats.profit >= 0 ? '✅' : '❌';
        console.log(`${indicator} ${formatStats(stats, range.name)}`);
      }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 5. HOME VS AWAY PERFORMANCE
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('🏠 HOME VS AWAY PERFORMANCE');
    console.log('═'.repeat(80));
    
    const homeBets = moneylineBets.filter(b => {
      const pick = b.bet?.pick || b.bet?.team || '';
      const homeTeam = b.game?.homeTeam || '';
      return pick.toLowerCase().includes(homeTeam.toLowerCase()) || 
             b.bet?.side === 'HOME';
    });
    
    const awayBets = moneylineBets.filter(b => {
      const pick = b.bet?.pick || b.bet?.team || '';
      const awayTeam = b.game?.awayTeam || '';
      return pick.toLowerCase().includes(awayTeam.toLowerCase()) || 
             b.bet?.side === 'AWAY';
    });
    
    const homeStats = calculateROI(homeBets);
    const awayStats = calculateROI(awayBets);
    
    console.log(`${homeStats.profit >= 0 ? '✅' : '❌'} ${formatStats(homeStats, '🏠 HOME')}`);
    console.log(`${awayStats.profit >= 0 ? '✅' : '❌'} ${formatStats(awayStats, '✈️ AWAY')}`);
    
    // ═══════════════════════════════════════════════════════════════
    // 6. FAVORITES VS UNDERDOGS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('⭐ FAVORITES VS UNDERDOGS');
    console.log('═'.repeat(80));
    
    const favoriteBets = moneylineBets.filter(b => (b.bet?.odds || 0) < 0);
    const underdogBets = moneylineBets.filter(b => (b.bet?.odds || 0) > 0);
    
    const favStats = calculateROI(favoriteBets);
    const dogStats = calculateROI(underdogBets);
    
    console.log(`${favStats.profit >= 0 ? '✅' : '❌'} ${formatStats(favStats, '⭐ FAVORITES')}`);
    console.log(`${dogStats.profit >= 0 ? '✅' : '❌'} ${formatStats(dogStats, '🐕 UNDERDOGS')}`);
    
    // ═══════════════════════════════════════════════════════════════
    // 7. TIME-BASED ANALYSIS (Recent vs Early)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('📅 TIME-BASED PERFORMANCE');
    console.log('═'.repeat(80));
    
    // Sort by timestamp
    const sortedBets = [...moneylineBets].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    if (sortedBets.length >= 50) {
      const firstQuarter = sortedBets.slice(0, Math.floor(sortedBets.length / 4));
      const lastQuarter = sortedBets.slice(-Math.floor(sortedBets.length / 4));
      
      const earlyStats = calculateROI(firstQuarter);
      const recentStats = calculateROI(lastQuarter);
      
      console.log(`${earlyStats.profit >= 0 ? '✅' : '❌'} ${formatStats(earlyStats, '📅 FIRST 25%')}`);
      console.log(`${recentStats.profit >= 0 ? '✅' : '❌'} ${formatStats(recentStats, '📅 LAST 25%')}`);
      
      // Trend indicator
      const trend = recentStats.roi > earlyStats.roi ? '📈 IMPROVING' : '📉 DECLINING';
      console.log(`\n${trend}: ROI ${earlyStats.roi.toFixed(1)}% → ${recentStats.roi.toFixed(1)}%`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 8. QUALITY GRADE ANALYSIS (Ensemble)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('🎖️ QUALITY GRADE ANALYSIS (Ensemble)');
    console.log('═'.repeat(80));
    
    const qualityGrades = ['A', 'B', 'C', 'D'];
    qualityGrades.forEach(grade => {
      const gradeBets = moneylineBets.filter(b => b.prediction?.qualityGrade === grade);
      if (gradeBets.length > 0) {
        const stats = calculateROI(gradeBets);
        const indicator = stats.profit >= 0 ? '✅' : '❌';
        console.log(`${indicator} ${formatStats(stats, `Grade ${grade}`)}`);
      }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 9. CONFIDENCE LEVEL ANALYSIS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('💪 CONFIDENCE LEVEL ANALYSIS');
    console.log('═'.repeat(80));
    
    const confidenceLevels = ['HIGH', 'MEDIUM', 'LOW'];
    confidenceLevels.forEach(level => {
      const levelBets = moneylineBets.filter(b => b.prediction?.confidence === level);
      if (levelBets.length > 0) {
        const stats = calculateROI(levelBets);
        const indicator = stats.profit >= 0 ? '✅' : '❌';
        console.log(`${indicator} ${formatStats(stats, level)}`);
      }
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 10. MULTI-FACTOR ANALYSIS - Best Combinations
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('🔬 MULTI-FACTOR ANALYSIS - Finding Best Combinations');
    console.log('═'.repeat(80));
    
    // Test various combinations
    const combinations = [];
    
    // Rating + Odds combinations
    ['A+', 'A', 'B+', 'B'].forEach(rating => {
      // Favorites only
      const favOnly = moneylineBets.filter(b => 
        b.prediction?.rating === rating && (b.bet?.odds || 0) < 0
      );
      if (favOnly.length >= 5) {
        const stats = calculateROI(favOnly);
        combinations.push({ name: `${rating} + Favorites`, stats, count: favOnly.length });
      }
      
      // Dogs only
      const dogOnly = moneylineBets.filter(b => 
        b.prediction?.rating === rating && (b.bet?.odds || 0) > 0
      );
      if (dogOnly.length >= 5) {
        const stats = calculateROI(dogOnly);
        combinations.push({ name: `${rating} + Dogs`, stats, count: dogOnly.length });
      }
      
      // Home favorites
      const homeFav = moneylineBets.filter(b => 
        b.prediction?.rating === rating && 
        (b.bet?.odds || 0) < 0 && 
        (b.bet?.side === 'HOME' || (b.bet?.pick || '').includes(b.game?.homeTeam))
      );
      if (homeFav.length >= 5) {
        const stats = calculateROI(homeFav);
        combinations.push({ name: `${rating} + Home Fav`, stats, count: homeFav.length });
      }
      
      // Away dogs
      const awayDog = moneylineBets.filter(b => 
        b.prediction?.rating === rating && 
        (b.bet?.odds || 0) > 0 && 
        (b.bet?.side === 'AWAY' || (b.bet?.pick || '').includes(b.game?.awayTeam))
      );
      if (awayDog.length >= 5) {
        const stats = calculateROI(awayDog);
        combinations.push({ name: `${rating} + Away Dog`, stats, count: awayDog.length });
      }
    });
    
    // High EV combinations
    const highEV = moneylineBets.filter(b => (b.prediction?.evPercent || 0) >= 5);
    if (highEV.length >= 5) {
      const stats = calculateROI(highEV);
      combinations.push({ name: 'EV 5%+', stats, count: highEV.length });
    }
    
    // Sort by ROI and show top 10
    combinations.sort((a, b) => b.stats.roi - a.stats.roi);
    
    console.log('\n🏆 TOP 10 PROFITABLE COMBINATIONS:');
    combinations.slice(0, 10).forEach((combo, i) => {
      const indicator = combo.stats.profit >= 0 ? '✅' : '⚠️';
      console.log(`${i + 1}. ${indicator} ${formatStats(combo.stats, combo.name)}`);
    });
    
    console.log('\n❌ BOTTOM 5 LOSING COMBINATIONS:');
    combinations.slice(-5).reverse().forEach((combo, i) => {
      console.log(`${i + 1}. ❌ ${formatStats(combo.stats, combo.name)}`);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // 11. RECOMMENDATIONS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(80));
    console.log('💡 KEY FINDINGS & RECOMMENDATIONS');
    console.log('═'.repeat(80));
    
    // Analyze what's working and what's not
    console.log('\n🔍 ANALYSIS:');
    
    // Rating analysis
    const profitableRatings = Object.entries(ratingResults)
      .filter(([_, stats]) => stats.profit > 0)
      .sort((a, b) => b[1].roi - a[1].roi);
    
    const unprofitableRatings = Object.entries(ratingResults)
      .filter(([_, stats]) => stats.profit < 0)
      .sort((a, b) => a[1].roi - b[1].roi);
    
    if (profitableRatings.length > 0) {
      console.log(`\n✅ PROFITABLE RATINGS: ${profitableRatings.map(r => r[0]).join(', ')}`);
    }
    if (unprofitableRatings.length > 0) {
      console.log(`❌ UNPROFITABLE RATINGS: ${unprofitableRatings.map(r => r[0]).join(', ')}`);
    }
    
    // Home/Away analysis
    if (homeStats.profit > awayStats.profit + 5) {
      console.log('\n🏠 HOME BETS significantly outperforming AWAY bets');
    } else if (awayStats.profit > homeStats.profit + 5) {
      console.log('\n✈️ AWAY BETS significantly outperforming HOME bets');
    }
    
    // Favorite/Dog analysis
    if (favStats.profit > dogStats.profit + 5) {
      console.log('⭐ FAVORITES significantly outperforming UNDERDOGS');
    } else if (dogStats.profit > favStats.profit + 5) {
      console.log('🐕 UNDERDOGS significantly outperforming FAVORITES');
    }
    
    // Best combination recommendation
    if (combinations.length > 0 && combinations[0].stats.roi > 10) {
      console.log(`\n🏆 BEST STRATEGY: "${combinations[0].name}" with ${combinations[0].stats.roi.toFixed(1)}% ROI`);
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log('✅ NHL ROI ANALYSIS COMPLETE!');
    console.log('═'.repeat(80));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

// Run analysis
analyzeNHLROI().catch(console.error);

