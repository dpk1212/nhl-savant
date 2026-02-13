/**
 * SAVANT PICKS — COMPREHENSIVE PERFORMANCE ANALYSIS
 * 
 * Single script to analyze ALL pick segments across:
 *   - Market type (ML vs ATS Upgrade vs Standalone ATS)
 *   - Star rating / unit allocation
 *   - ML EV% buckets
 *   - Margin Over Spread (MOS) buckets
 *   - Odds range (heavy fav → dog)
 *   - Spread EV% (ATS picks)
 *   - Model agreement (aligned vs split)
 *   - Conviction tier (MAX, STRONG, SOLID, BASE)
 *   - Savant Pick vs non-Savant
 *   - Favorite vs Underdog
 *   - Home vs Away
 *   - Weekly trend
 *   - Combined: MOS × EV crossover
 *
 * Replaces: comprehensiveBasketballAnalysis, analyzeBasketballModelROI,
 *           analyzeAPlusPicks, analyzeUnitManagement, buildConfidenceUnitSystem,
 *           analyzePrimePicksPerformance, analyzePrimeUnitSizing,
 *           analyzeSpreadEdgeHistorical, analyzeSpreadPerformance
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

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

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function calcStats(bets) {
  if (!bets.length) return null;
  const wins = bets.filter(b => b.outcome === 'WIN').length;
  const losses = bets.filter(b => b.outcome === 'LOSS').length;
  const pushes = bets.filter(b => b.outcome === 'PUSH').length;
  const totalUnits = bets.reduce((s, b) => s + b.units, 0);
  const totalProfit = bets.reduce((s, b) => s + b.profit, 0);
  const roi = totalUnits > 0 ? (totalProfit / totalUnits) * 100 : 0;
  const avgOdds = bets.reduce((s, b) => s + (b.odds || 0), 0) / bets.length;
  return {
    count: bets.length,
    wins,
    losses,
    pushes,
    winRate: ((wins / (wins + losses)) * 100),
    totalUnits: Math.round(totalUnits * 10) / 10,
    totalProfit: Math.round(totalProfit * 100) / 100,
    roi: Math.round(roi * 10) / 10,
    avgOdds: Math.round(avgOdds)
  };
}

function printTable(title, rows) {
  console.log(`\n─── ${title} ${'─'.repeat(Math.max(0, 65 - title.length))}`);
  if (!rows.length) { console.log('  No data'); return; }
  
  // Header
  console.log('  ' + 
    'Segment'.padEnd(22) +
    'W-L'.padEnd(10) +
    'Win%'.padEnd(8) +
    'Units'.padEnd(10) +
    'Profit'.padEnd(10) +
    'ROI%'.padEnd(8) +
    'AvgOdds'
  );
  console.log('  ' + '─'.repeat(75));
  
  rows.forEach(r => {
    if (!r.stats) return;
    const s = r.stats;
    const wl = `${s.wins}-${s.losses}${s.pushes ? `-${s.pushes}` : ''}`;
    const profitStr = (s.totalProfit >= 0 ? '+' : '') + s.totalProfit.toFixed(1) + 'u';
    const roiStr = (s.roi >= 0 ? '+' : '') + s.roi.toFixed(1) + '%';
    const oddsStr = s.avgOdds > 0 ? `+${s.avgOdds}` : `${s.avgOdds}`;
    
    // Color coding via emoji markers
    const marker = s.roi >= 15 ? '🟢' : s.roi >= 0 ? '🟡' : s.roi >= -15 ? '🟠' : '🔴';
    
    console.log('  ' +
      `${marker} ${r.label}`.padEnd(24) +
      wl.padEnd(10) +
      `${s.winRate.toFixed(1)}%`.padEnd(8) +
      `${s.totalUnits}u`.padEnd(10) +
      profitStr.padEnd(10) +
      roiStr.padEnd(8) +
      oddsStr
    );
  });
}

function getStarRating(units) {
  if (units >= 4.5) return '★★★★★';
  if (units >= 3.5) return '★★★★';
  if (units >= 2.5) return '★★★';
  if (units >= 1.5) return '★★';
  return '★';
}

function getWeekLabel(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Unknown';
  // Get Monday of that week
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return `${monday.getMonth() + 1}/${monday.getDate()}`;
}

// ═══════════════════════════════════════════════════════════
// MAIN ANALYSIS
// ═══════════════════════════════════════════════════════════

async function analyzeAllPicks() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║         SAVANT PICKS — COMPREHENSIVE PERFORMANCE ANALYSIS                ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
  
  // Fetch all completed bets
  const betsRef = collection(db, 'basketball_bets');
  const q = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(q);
  
  console.log(`\n  Fetched ${snapshot.size} completed bets from Firebase\n`);
  
  // Normalize bet data
  const bets = [];
  snapshot.forEach(doc => {
    const d = doc.data();
    const isATS = d.betRecommendation?.type === 'ATS' || d.isATSPick;
    const isUpgrade = isATS && d.isPrimePick;
    const isStandaloneATS = isATS && !d.isPrimePick;
    
    const units = isATS 
      ? (d.betRecommendation?.atsUnits || d.prediction?.unitSize || 1)
      : (d.prediction?.unitSize || d.bet?.units || 1);
    const odds = isATS ? -110 : (d.bet?.odds || 0);
    const ev = d.prediction?.evPercent || d.prediction?.bestEV || d.initialEV || 0;
    const mos = d.betRecommendation?.marginOverSpread || d.spreadAnalysis?.marginOverSpread || 0;
    const spreadEV = d.betRecommendation?.estimatedSpreadEV || 0;
    const grade = d.prediction?.grade || '';
    const convictionTier = d.prediction?.convictionTier || d.spreadAnalysis?.convictionTier || '';
    
    // Determine outcome
    let outcome = d.result?.outcome;
    if (!outcome) return;
    
    // Calculate profit
    let profit = d.result?.profit;
    if (profit === undefined || profit === null) {
      if (outcome === 'WIN') {
        const decimal = odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
        profit = units * decimal;
      } else if (outcome === 'PUSH') {
        profit = 0;
      } else {
        profit = -units;
      }
    }
    
    // Determine if favorite or dog
    const isFavorite = odds < 0;
    
    // Determine home/away
    const betTeam = d.bet?.team || d.prediction?.bestTeam || '';
    const awayTeam = d.game?.awayTeam || '';
    const isAway = betTeam.toLowerCase().replace(/[^a-z0-9]/g, '') === awayTeam.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Models agree
    const drCovers = d.spreadAnalysis?.drCovers;
    const hsCovers = d.spreadAnalysis?.hsCovers;
    const modelsAgree = d.prediction?.modelsAgree ?? (drCovers && hsCovers);
    
    // Date
    const dateStr = d.game?.date || d.firstRecommendedAt ? new Date(d.firstRecommendedAt).toISOString().split('T')[0] : '';
    
    bets.push({
      id: doc.id,
      outcome,
      profit,
      units,
      odds,
      ev,
      mos,
      spreadEV,
      grade,
      convictionTier,
      isFavorite,
      isAway,
      isATS,
      isUpgrade,
      isStandaloneATS,
      isPrimePick: d.isPrimePick || false,
      isSavantPick: d.savantPick || false,
      modelsAgree,
      dateStr
    });
  });
  
  console.log(`  Processed ${bets.length} bets with outcomes\n`);
  
  if (!bets.length) {
    console.log('  No completed bets found. Exiting.');
    process.exit(0);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 1. EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════
  const allStats = calcStats(bets);
  const mlBets = bets.filter(b => !b.isATS);
  const atsBets = bets.filter(b => b.isATS);
  const upgradeBets = bets.filter(b => b.isUpgrade);
  const standaloneBets = bets.filter(b => b.isStandaloneATS);
  
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  EXECUTIVE SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  
  printTable('BY MARKET TYPE', [
    { label: 'ALL PICKS', stats: allStats },
    { label: 'ML Picks', stats: calcStats(mlBets) },
    { label: 'ATS (All)', stats: calcStats(atsBets) },
    { label: '  ATS Upgraded', stats: calcStats(upgradeBets) },
    { label: '  ATS Standalone', stats: calcStats(standaloneBets) },
  ]);
  
  // ═══════════════════════════════════════════════════════════
  // 2. BY STAR RATING (Unit Size)
  // ═══════════════════════════════════════════════════════════
  const unitBuckets = [
    { label: '★★★★★ (4.5-5u)', filter: b => b.units >= 4.5 },
    { label: '★★★★ (3.5-4u)', filter: b => b.units >= 3.5 && b.units < 4.5 },
    { label: '★★★ (2.5-3u)', filter: b => b.units >= 2.5 && b.units < 3.5 },
    { label: '★★ (1.5-2u)', filter: b => b.units >= 1.5 && b.units < 2.5 },
    { label: '★ (0.5-1u)', filter: b => b.units < 1.5 },
  ];
  printTable('BY STAR RATING', unitBuckets.map(bucket => ({
    label: bucket.label,
    stats: calcStats(bets.filter(bucket.filter))
  })));
  
  // ═══════════════════════════════════════════════════════════
  // 3. BY ML EV%
  // ═══════════════════════════════════════════════════════════
  const evBuckets = [
    { label: 'EV 10%+', filter: b => b.ev >= 10 },
    { label: 'EV 5-10%', filter: b => b.ev >= 5 && b.ev < 10 },
    { label: 'EV 3-5%', filter: b => b.ev >= 3 && b.ev < 5 },
    { label: 'EV 2-3%', filter: b => b.ev >= 2 && b.ev < 3 },
    { label: 'EV 1-2%', filter: b => b.ev >= 1 && b.ev < 2 },
    { label: 'EV 0-1%', filter: b => b.ev >= 0 && b.ev < 1 },
    { label: 'EV negative', filter: b => b.ev < 0 },
  ];
  printTable('BY ML EV%', evBuckets.map(bucket => ({
    label: bucket.label,
    stats: calcStats(bets.filter(bucket.filter))
  })));
  
  // ═══════════════════════════════════════════════════════════
  // 4. BY MARGIN OVER SPREAD (MOS)
  // ═══════════════════════════════════════════════════════════
  const mosBuckets = [
    { label: 'MOS 5+', filter: b => b.mos >= 5 },
    { label: 'MOS 4-5', filter: b => b.mos >= 4 && b.mos < 5 },
    { label: 'MOS 3-4', filter: b => b.mos >= 3 && b.mos < 4 },
    { label: 'MOS 2-3', filter: b => b.mos >= 2 && b.mos < 3 },
    { label: 'MOS 1-2', filter: b => b.mos >= 1 && b.mos < 2 },
    { label: 'MOS 0-1', filter: b => b.mos >= 0 && b.mos < 1 },
    { label: 'MOS negative', filter: b => b.mos < 0 },
  ];
  printTable('BY MARGIN OVER SPREAD', mosBuckets.map(bucket => ({
    label: bucket.label,
    stats: calcStats(bets.filter(bucket.filter))
  })));
  
  // ═══════════════════════════════════════════════════════════
  // 5. BY ODDS RANGE
  // ═══════════════════════════════════════════════════════════
  const oddsBuckets = [
    { label: 'Heavy Fav (<-300)', filter: b => b.odds < -300 },
    { label: 'Mod Fav (-300 to -200)', filter: b => b.odds >= -300 && b.odds < -200 },
    { label: 'Slight Fav (-200 to -120)', filter: b => b.odds >= -200 && b.odds < -120 },
    { label: 'Pick-em (-120 to +120)', filter: b => b.odds >= -120 && b.odds <= 120 },
    { label: 'Slight Dog (+120 to +200)', filter: b => b.odds > 120 && b.odds <= 200 },
    { label: 'Dog (+200+)', filter: b => b.odds > 200 },
  ];
  printTable('BY ODDS RANGE', oddsBuckets.map(bucket => ({
    label: bucket.label,
    stats: calcStats(bets.filter(bucket.filter))
  })));
  
  // ═══════════════════════════════════════════════════════════
  // 6. BY SPREAD EV% (ATS Picks Only)
  // ═══════════════════════════════════════════════════════════
  if (atsBets.length > 0) {
    const spreadEvBuckets = [
      { label: 'Spread EV 10%+', filter: b => b.isATS && b.spreadEV >= 10 },
      { label: 'Spread EV 5-10%', filter: b => b.isATS && b.spreadEV >= 5 && b.spreadEV < 10 },
      { label: 'Spread EV 2-5%', filter: b => b.isATS && b.spreadEV >= 2 && b.spreadEV < 5 },
      { label: 'Spread EV 0-2%', filter: b => b.isATS && b.spreadEV >= 0 && b.spreadEV < 2 },
    ];
    printTable('BY SPREAD EV% (ATS Only)', spreadEvBuckets.map(bucket => ({
      label: bucket.label,
      stats: calcStats(bets.filter(bucket.filter))
    })));
  }
  
  // ═══════════════════════════════════════════════════════════
  // 7. BY MODEL AGREEMENT
  // ═══════════════════════════════════════════════════════════
  printTable('BY MODEL AGREEMENT', [
    { label: 'Models Aligned', stats: calcStats(bets.filter(b => b.modelsAgree === true)) },
    { label: 'Models Split', stats: calcStats(bets.filter(b => b.modelsAgree === false)) },
    { label: 'Unknown', stats: calcStats(bets.filter(b => b.modelsAgree == null)) },
  ]);
  
  // ═══════════════════════════════════════════════════════════
  // 8. BY CONVICTION TIER
  // ═══════════════════════════════════════════════════════════
  const tiers = ['MAX', 'BLEND', 'BASE'];
  const tierRows = tiers.map(tier => ({
    label: tier,
    stats: calcStats(bets.filter(b => b.convictionTier === tier))
  })).filter(r => r.stats);
  if (tierRows.length) {
    printTable('BY CONVICTION TIER', tierRows);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 9. SAVANT vs NON-SAVANT
  // ═══════════════════════════════════════════════════════════
  printTable('SAVANT PICK STATUS', [
    { label: 'Savant Picks', stats: calcStats(bets.filter(b => b.isSavantPick)) },
    { label: 'Non-Savant', stats: calcStats(bets.filter(b => !b.isSavantPick)) },
  ]);
  
  // ═══════════════════════════════════════════════════════════
  // 10. FAVORITE vs UNDERDOG
  // ═══════════════════════════════════════════════════════════
  printTable('FAVORITE vs UNDERDOG', [
    { label: 'Favorites', stats: calcStats(bets.filter(b => b.isFavorite)) },
    { label: 'Underdogs', stats: calcStats(bets.filter(b => !b.isFavorite)) },
  ]);
  
  // ═══════════════════════════════════════════════════════════
  // 11. HOME vs AWAY
  // ═══════════════════════════════════════════════════════════
  printTable('HOME vs AWAY', [
    { label: 'Away Picks', stats: calcStats(bets.filter(b => b.isAway)) },
    { label: 'Home Picks', stats: calcStats(bets.filter(b => !b.isAway)) },
  ]);
  
  // ═══════════════════════════════════════════════════════════
  // 12. BY GRADE
  // ═══════════════════════════════════════════════════════════
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
  const gradeRows = grades.map(g => ({
    label: `Grade ${g}`,
    stats: calcStats(bets.filter(b => b.grade === g))
  })).filter(r => r.stats);
  if (gradeRows.length) {
    printTable('BY GRADE', gradeRows);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 13. COMBINED: MOS × EV CROSSOVER
  // ═══════════════════════════════════════════════════════════
  const crossBuckets = [
    { label: 'MOS 3+ & EV 3%+', filter: b => b.mos >= 3 && b.ev >= 3 },
    { label: 'MOS 3+ & EV 0-3%', filter: b => b.mos >= 3 && b.ev >= 0 && b.ev < 3 },
    { label: 'MOS 2-3 & EV 3%+', filter: b => b.mos >= 2 && b.mos < 3 && b.ev >= 3 },
    { label: 'MOS 2-3 & EV 0-3%', filter: b => b.mos >= 2 && b.mos < 3 && b.ev >= 0 && b.ev < 3 },
    { label: 'MOS 1-2 & EV 3%+', filter: b => b.mos >= 1 && b.mos < 2 && b.ev >= 3 },
    { label: 'MOS 1-2 & EV 0-3%', filter: b => b.mos >= 1 && b.mos < 2 && b.ev >= 0 && b.ev < 3 },
    { label: 'MOS <1 & any EV', filter: b => b.mos < 1 },
  ];
  printTable('COMBINED: MOS × EV CROSSOVER', crossBuckets.map(bucket => ({
    label: bucket.label,
    stats: calcStats(bets.filter(bucket.filter))
  })));
  
  // ═══════════════════════════════════════════════════════════
  // 14. WEEKLY TREND
  // ═══════════════════════════════════════════════════════════
  const weekMap = new Map();
  bets.forEach(b => {
    const week = getWeekLabel(b.dateStr);
    if (!weekMap.has(week)) weekMap.set(week, []);
    weekMap.get(week).push(b);
  });
  
  // Sort weeks chronologically
  const weekEntries = [...weekMap.entries()].sort((a, b) => {
    const parseWeek = w => {
      const [m, d] = w.split('/').map(Number);
      return m * 100 + d;
    };
    return parseWeek(a[0]) - parseWeek(b[0]);
  });
  
  printTable('WEEKLY TREND', weekEntries.map(([week, weekBets]) => ({
    label: `Week of ${week}`,
    stats: calcStats(weekBets)
  })));
  
  // ═══════════════════════════════════════════════════════════
  // 15. TOP & BOTTOM SEGMENTS (SORTED BY ROI)
  // ═══════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log('  BEST & WORST SEGMENTS (min 5 bets)');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  
  // Collect all segments with their stats
  const allSegments = [];
  
  const addSegments = (category, buckets, betPool = bets) => {
    buckets.forEach(bucket => {
      const filtered = betPool.filter(bucket.filter);
      if (filtered.length >= 5) {
        const stats = calcStats(filtered);
        allSegments.push({ label: `${category}: ${bucket.label}`, stats });
      }
    });
  };
  
  addSegments('Stars', unitBuckets);
  addSegments('EV', evBuckets);
  addSegments('MOS', mosBuckets);
  addSegments('Odds', oddsBuckets);
  addSegments('Cross', crossBuckets);
  
  // Add simple segments
  [
    { label: 'Type: ML', stats: calcStats(mlBets) },
    { label: 'Type: ATS All', stats: calcStats(atsBets) },
    { label: 'Type: ATS Upgrade', stats: calcStats(upgradeBets) },
    { label: 'Savant: Yes', stats: calcStats(bets.filter(b => b.isSavantPick)) },
    { label: 'Savant: No', stats: calcStats(bets.filter(b => !b.isSavantPick)) },
    { label: 'Side: Favorites', stats: calcStats(bets.filter(b => b.isFavorite)) },
    { label: 'Side: Underdogs', stats: calcStats(bets.filter(b => !b.isFavorite)) },
    { label: 'Models: Aligned', stats: calcStats(bets.filter(b => b.modelsAgree === true)) },
    { label: 'Models: Split', stats: calcStats(bets.filter(b => b.modelsAgree === false)) },
  ].forEach(s => {
    if (s.stats && s.stats.count >= 5) allSegments.push(s);
  });
  
  // Sort by ROI
  allSegments.sort((a, b) => b.stats.roi - a.stats.roi);
  
  console.log('\n  🟢 TOP 10 MOST PROFITABLE:');
  printTable('BEST SEGMENTS', allSegments.slice(0, 10));
  
  console.log('\n  🔴 BOTTOM 10 LEAST PROFITABLE:');
  printTable('WORST SEGMENTS', allSegments.slice(-10).reverse());
  
  // ═══════════════════════════════════════════════════════════
  // DONE
  // ═══════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log('  ANALYSIS COMPLETE');
  console.log(`  Total bets analyzed: ${bets.length}`);
  console.log(`  ML: ${mlBets.length} | ATS: ${atsBets.length} (${upgradeBets.length} upgrades + ${standaloneBets.length} standalone)`);
  console.log('═══════════════════════════════════════════════════════════════════════════\n');
  
  process.exit(0);
}

analyzeAllPicks().catch(err => {
  console.error('❌ Analysis failed:', err.message);
  process.exit(1);
});
