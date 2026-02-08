/**
 * PRIME PICKS PERFORMANCE ANALYSIS V2
 * 
 * Correct definitions:
 * - PRIME PICKS = EV edge + Spread confirmed (savantPick=true OR spreadConfirmed=true with EV source)
 * - EV ONLY = Has EV edge but NO spread confirmation
 * - SPREAD ONLY = From SPREAD_OPPORTUNITY source with no EV bet
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

async function analyze() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    PRIME PICKS PERFORMANCE ANALYSIS V2                                    ║');
  console.log('║                    Since 1/23/2026 (Prime Picks Launch)                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);
  
  const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const startDate = '2026-01-23';
  const bets = allBets.filter(bet => {
    const betDate = bet.date || bet.gameDate || '';
    return betDate >= startDate;
  });

  console.log(`📊 Total completed bets: ${allBets.length}`);
  console.log(`📊 Bets since ${startDate}: ${bets.length}`);
  console.log('\n');

  // Correct segmentation
  const primePicks = [];  // EV + Spread confirmed (the good ones)
  const evOnly = [];      // EV found edge, but no spread confirmation
  const spreadOnly = [];  // Spread opportunity only (no EV edge triggered it)

  bets.forEach(bet => {
    const hasSpreadConfirm = bet.spreadAnalysis?.spreadConfirmed === true || bet.prediction?.spreadConfirmed === true;
    const source = bet.source || '';
    const isSpreadSource = source === 'SPREAD_OPPORTUNITY';
    const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || 0;
    const hasEVEdge = ev >= 3; // Our minimum EV threshold
    
    // PRIME PICKS: Has both EV edge AND spread confirmation
    // OR: savantPick was set (analyst enhanced)
    if (hasSpreadConfirm && !isSpreadSource) {
      // This is EV bet that got spread confirmed (upgraded) = PRIME
      primePicks.push(bet);
    } else if (isSpreadSource) {
      // This came from spread workflow only = SPREAD ONLY
      spreadOnly.push(bet);
    } else {
      // Regular EV bet without spread confirmation = EV ONLY
      evOnly.push(bet);
    }
  });

  function calculateStats(bets, name) {
    let wins = 0, losses = 0, pushes = 0, profit = 0, totalUnits = 0;

    bets.forEach(bet => {
      const outcome = bet.result?.outcome;
      const units = bet.prediction?.unitSize || 1;
      const odds = bet.bet?.odds || bet.initialOdds || -110;
      
      totalUnits += units;
      
      if (outcome === 'WIN') {
        wins++;
        profit += odds > 0 ? units * (odds / 100) : units * (100 / Math.abs(odds));
      } else if (outcome === 'LOSS') {
        losses++;
        profit -= units;
      } else if (outcome === 'PUSH') {
        pushes++;
      }
    });

    const total = wins + losses;
    return {
      name, total: bets.length, wins, losses, pushes,
      winRate: total > 0 ? (wins / total * 100).toFixed(1) : 'N/A',
      profit: profit.toFixed(2),
      totalUnits: totalUnits.toFixed(1),
      roi: totalUnits > 0 ? (profit / totalUnits * 100).toFixed(1) : 'N/A'
    };
  }

  const primeStats = calculateStats(primePicks, 'PRIME (EV+Spread)');
  const evStats = calculateStats(evOnly, 'EV ONLY');
  const spreadStats = calculateStats(spreadOnly, 'SPREAD ONLY');
  const allStats = calculateStats(bets, 'ALL BETS');

  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 PERFORMANCE BY SEGMENT (Since 1/23)                                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  console.log('   Segment              │ Bets  │ W-L-P       │ Win %   │ Units   │ Profit    │ ROI');
  console.log('   ─────────────────────┼───────┼─────────────┼─────────┼─────────┼───────────┼────────');

  [primeStats, evStats, spreadStats, allStats].forEach(s => {
    const profitStr = parseFloat(s.profit) >= 0 ? `+${s.profit}u` : `${s.profit}u`;
    const roiStr = parseFloat(s.roi) >= 0 ? `+${s.roi}%` : `${s.roi}%`;
    const wlp = `${s.wins}-${s.losses}-${s.pushes}`;
    
    let emoji = parseFloat(s.roi) > 5 ? '🟢' : parseFloat(s.roi) > 0 ? '🟡' : '🔴';
    
    console.log(`   ${emoji} ${s.name.padEnd(19)} │ ${s.total.toString().padStart(5)} │ ${wlp.padEnd(11)} │ ${s.winRate.padStart(5)}%  │ ${s.totalUnits.padStart(7)} │ ${profitStr.padStart(9)} │ ${roiStr.padStart(7)}`);
  });

  // Sample of Prime Picks
  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🌟 PRIME PICKS DETAIL (EV + Spread Confirmed)                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  if (primePicks.length > 0) {
    primePicks.slice(0, 20).forEach(bet => {
      const outcome = bet.result?.outcome || 'PENDING';
      const outcomeEmoji = outcome === 'WIN' ? '✅' : outcome === 'LOSS' ? '❌' : '⏳';
      const odds = bet.bet?.odds || bet.initialOdds || 0;
      const units = bet.prediction?.unitSize || 1;
      const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || 0;
      console.log(`   ${outcomeEmoji} ${bet.date} | ${(bet.bet?.team || bet.bet?.pick || 'N/A').padEnd(25)} | ${odds.toString().padStart(4)} | ${units}u | EV: ${ev.toFixed(1)}%`);
    });
    if (primePicks.length > 20) {
      console.log(`   ... and ${primePicks.length - 20} more`);
    }
  } else {
    console.log('   No prime picks found');
  }

  // Verdict
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              VERDICT                                                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');

  const segments = [
    { name: 'PRIME (EV+Spread)', stats: primeStats },
    { name: 'EV ONLY', stats: evStats },
    { name: 'SPREAD ONLY', stats: spreadStats }
  ].filter(s => s.stats.total > 0);

  segments.sort((a, b) => parseFloat(b.stats.roi) - parseFloat(a.stats.roi));

  console.log('   Ranking by ROI:');
  segments.forEach((s, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
    console.log(`   ${medal} ${s.name}: ${s.stats.roi}% ROI | ${s.stats.winRate}% win rate | ${s.stats.total} bets`);
  });

  console.log('\n');
  process.exit(0);
}

analyze().catch(console.error);
