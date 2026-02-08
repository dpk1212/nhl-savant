/**
 * PRIME PICKS PERFORMANCE ANALYSIS
 * 
 * Analyzes performance since 1/23 (Prime Picks launch) across:
 * 1. Prime Picks (savantPick = true)
 * 2. EV Only (has EV edge, no spread confirmation)
 * 3. Spread Only (spread confirmed, from spread workflow)
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

async function analyzePrimePicksPerformance() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    PRIME PICKS PERFORMANCE ANALYSIS                                       ║');
  console.log('║                    Since 1/23/2026 (Prime Picks Launch)                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Fetch all COMPLETED basketball bets
  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter for bets since 1/23/2026
  const startDate = '2026-01-23';
  const bets = allBets.filter(bet => {
    const betDate = bet.date || bet.gameDate || '';
    return betDate >= startDate;
  });

  console.log(`📊 Total completed bets: ${allBets.length}`);
  console.log(`📊 Bets since ${startDate}: ${bets.length}`);
  console.log('\n');

  // Segment bets
  const primePicks = [];
  const evOnly = [];
  const spreadOnly = [];
  const evPlusSpread = [];

  bets.forEach(bet => {
    const isPrime = bet.savantPick === true;
    const hasSpreadConfirm = bet.spreadAnalysis?.spreadConfirmed === true || bet.prediction?.spreadConfirmed === true;
    const source = bet.source || '';
    const isSpreadSource = source === 'SPREAD_OPPORTUNITY';
    
    if (isPrime) {
      primePicks.push(bet);
    }
    
    if (isSpreadSource || (hasSpreadConfirm && !isPrime)) {
      spreadOnly.push(bet);
    } else if (!hasSpreadConfirm && !isPrime) {
      evOnly.push(bet);
    }
    
    if (hasSpreadConfirm && !isSpreadSource) {
      evPlusSpread.push(bet);
    }
  });

  // Calculate stats for each segment
  function calculateStats(bets, name) {
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    let profit = 0;
    let totalUnits = 0;

    bets.forEach(bet => {
      const outcome = bet.result?.outcome;
      const units = bet.prediction?.unitSize || 1;
      const odds = bet.bet?.odds || bet.initialOdds || -110;
      
      totalUnits += units;
      
      if (outcome === 'WIN') {
        wins++;
        if (odds > 0) {
          profit += units * (odds / 100);
        } else {
          profit += units * (100 / Math.abs(odds));
        }
      } else if (outcome === 'LOSS') {
        losses++;
        profit -= units;
      } else if (outcome === 'PUSH') {
        pushes++;
      }
    });

    const total = wins + losses;
    const winRate = total > 0 ? (wins / total * 100).toFixed(1) : 'N/A';
    const roi = totalUnits > 0 ? (profit / totalUnits * 100).toFixed(1) : 'N/A';

    return {
      name,
      total: bets.length,
      wins,
      losses,
      pushes,
      winRate,
      profit: profit.toFixed(2),
      totalUnits: totalUnits.toFixed(1),
      roi
    };
  }

  const primeStats = calculateStats(primePicks, 'PRIME PICKS');
  const evStats = calculateStats(evOnly, 'EV ONLY');
  const spreadStats = calculateStats(spreadOnly, 'SPREAD ONLY');
  const evSpreadStats = calculateStats(evPlusSpread, 'EV + SPREAD');
  const allStats = calculateStats(bets, 'ALL BETS');

  // Display results
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 PERFORMANCE BY SEGMENT (Since 1/23)                                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  console.log('   Segment           │ Bets  │ W-L-P       │ Win %   │ Units   │ Profit    │ ROI');
  console.log('   ──────────────────┼───────┼─────────────┼─────────┼─────────┼───────────┼────────');

  [primeStats, evStats, spreadStats, evSpreadStats, allStats].forEach(s => {
    const profitStr = parseFloat(s.profit) >= 0 ? `+${s.profit}u` : `${s.profit}u`;
    const roiStr = parseFloat(s.roi) >= 0 ? `+${s.roi}%` : `${s.roi}%`;
    const wlp = `${s.wins}-${s.losses}-${s.pushes}`;
    
    let emoji = '';
    if (parseFloat(s.roi) > 5) emoji = '🟢';
    else if (parseFloat(s.roi) > 0) emoji = '🟡';
    else if (parseFloat(s.roi) < 0) emoji = '🔴';
    
    console.log(`   ${emoji} ${s.name.padEnd(16)} │ ${s.total.toString().padStart(5)} │ ${wlp.padEnd(11)} │ ${s.winRate.padStart(5)}%  │ ${s.totalUnits.padStart(7)} │ ${profitStr.padStart(9)} │ ${roiStr.padStart(7)}`);
  });

  // Detailed breakdown
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📋 DETAILED BREAKDOWN                                                                    │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  // Prime picks detail
  console.log('   🌟 PRIME PICKS (Analyst Enhanced):');
  if (primePicks.length > 0) {
    primePicks.forEach(bet => {
      const outcome = bet.result?.outcome || 'PENDING';
      const outcomeEmoji = outcome === 'WIN' ? '✅' : outcome === 'LOSS' ? '❌' : '⏳';
      const odds = bet.bet?.odds || bet.initialOdds || 0;
      const units = bet.prediction?.unitSize || 1;
      console.log(`      ${outcomeEmoji} ${bet.date} | ${bet.bet?.team || bet.bet?.pick} (${odds}) | ${units}u`);
    });
  } else {
    console.log('      No prime picks found since 1/23');
  }

  console.log('\n   📈 EV ONLY (Model Edge, No Spread):');
  console.log(`      ${evStats.total} bets | ${evStats.wins}-${evStats.losses} | ${evStats.winRate}% | ${evStats.profit}u profit`);

  console.log('\n   🎯 SPREAD ONLY (Spread Opportunity):');
  console.log(`      ${spreadStats.total} bets | ${spreadStats.wins}-${spreadStats.losses} | ${spreadStats.winRate}% | ${spreadStats.profit}u profit`);

  console.log('\n   💎 EV + SPREAD (Double Confirmation):');
  console.log(`      ${evSpreadStats.total} bets | ${evSpreadStats.wins}-${evSpreadStats.losses} | ${evSpreadStats.winRate}% | ${evSpreadStats.profit}u profit`);

  // By date breakdown
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📅 PERFORMANCE BY DATE                                                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const byDate = {};
  bets.forEach(bet => {
    const date = bet.date || 'Unknown';
    if (!byDate[date]) byDate[date] = { wins: 0, losses: 0, profit: 0, units: 0 };
    
    const outcome = bet.result?.outcome;
    const units = bet.prediction?.unitSize || 1;
    const odds = bet.bet?.odds || bet.initialOdds || -110;
    
    byDate[date].units += units;
    
    if (outcome === 'WIN') {
      byDate[date].wins++;
      if (odds > 0) {
        byDate[date].profit += units * (odds / 100);
      } else {
        byDate[date].profit += units * (100 / Math.abs(odds));
      }
    } else if (outcome === 'LOSS') {
      byDate[date].losses++;
      byDate[date].profit -= units;
    }
  });

  const sortedDates = Object.keys(byDate).sort();
  let runningProfit = 0;
  
  console.log('   Date       │ W-L   │ Profit  │ Running');
  console.log('   ───────────┼───────┼─────────┼─────────');
  
  sortedDates.forEach(date => {
    const d = byDate[date];
    runningProfit += d.profit;
    const profitStr = d.profit >= 0 ? `+${d.profit.toFixed(1)}u` : `${d.profit.toFixed(1)}u`;
    const runningStr = runningProfit >= 0 ? `+${runningProfit.toFixed(1)}u` : `${runningProfit.toFixed(1)}u`;
    const emoji = d.profit > 0 ? '🟢' : d.profit < 0 ? '🔴' : '⚪';
    console.log(`   ${emoji} ${date} │ ${d.wins}-${d.losses}   │ ${profitStr.padStart(7)} │ ${runningStr.padStart(7)}`);
  });

  // Verdict
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              VERDICT                                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');

  const segments = [
    { name: 'PRIME PICKS', stats: primeStats },
    { name: 'EV ONLY', stats: evStats },
    { name: 'SPREAD ONLY', stats: spreadStats }
  ].filter(s => s.stats.total > 0);

  segments.sort((a, b) => parseFloat(b.stats.roi) - parseFloat(a.stats.roi));

  console.log('   Ranking by ROI:');
  segments.forEach((s, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
    console.log(`   ${medal} ${s.name}: ${s.stats.roi}% ROI (${s.stats.winRate}% win rate)`);
  });

  console.log('\n');
  process.exit(0);
}

analyzePrimePicksPerformance().catch(console.error);
