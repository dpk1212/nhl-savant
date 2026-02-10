/**
 * 🔬 SPREAD EV BACKTEST
 * 
 * Simple question: If we calculate Spread EV from our model's margin
 * over spread vs -110 spread odds — were the +EV spread bets profitable?
 *
 * For each historical bet:
 * 1. MOS (margin over spread) → estimated cover probability
 * 2. Cover prob + spread odds (-110) → Spread EV
 * 3. Did it actually cover? What's the ROI?
 *
 * Usage: node scripts/analyzeSpreadEVBacktest.js
 */

import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

// Spread odds constant
const SPREAD_ODDS = -110;
const SPREAD_PAYOUT = 100 / 110; // 0.909 per unit on a win

/**
 * Estimate cover probability from model's margin over spread
 * Each point of predicted edge ≈ 3% cover probability above 50%
 */
function estimateCoverProb(marginOverSpread) {
  const prob = 0.50 + (marginOverSpread * 0.03);
  return Math.max(0.01, Math.min(0.99, prob));
}

/**
 * Calculate Spread EV at given odds
 * EV = (coverProb × payout) - ((1 - coverProb) × 1)
 * Returns as percentage
 */
function calcSpreadEV(coverProb, odds = -110) {
  const payout = odds < 0 ? (100 / Math.abs(odds)) : (odds / 100);
  return ((coverProb * payout) - ((1 - coverProb) * 1)) * 100;
}

async function run() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║     🔬 SPREAD EV BACKTEST                                                     ║');
  console.log('║     Model MOS → Cover Prob → Spread EV @ -110                                 ║');
  console.log('║     Question: Were +EV spread bets actually profitable?                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

  // Fetch all completed bets
  const snapshot = await getDocs(query(
    collection(db, 'basketball_bets'),
    where('status', '==', 'COMPLETED')
  ));

  const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter: since 1/23, must have spread data + scores
  const startDate = '2026-01-23';
  const bets = allBets.filter(bet => {
    const date = bet.date || bet.gameDate || '';
    if (date < startDate) return false;
    const hasSpread = bet.spreadAnalysis?.spread !== undefined && bet.spreadAnalysis?.spread !== null;
    const hasScores = bet.result?.awayScore != null && bet.result?.homeScore != null;
    const hasSide = bet.prediction?.bestBet;
    return hasSpread && hasScores && hasSide;
  });

  console.log(`   Total completed bets: ${allBets.length}`);
  console.log(`   Bets since ${startDate} with spread + scores: ${bets.length}\n`);

  if (bets.length === 0) {
    console.log('   No qualifying bets found.');
    process.exit(0);
  }

  // ═══════════════════════════════════════════════════════════
  // CALCULATE SPREAD EV + ACTUAL COVER FOR EVERY BET
  // ═══════════════════════════════════════════════════════════

  const results = [];

  for (const bet of bets) {
    const spread = bet.spreadAnalysis.spread;
    const pickSide = bet.prediction.bestBet; // 'away' or 'home'
    const pickTeam = bet.prediction.bestTeam || bet.bet?.team || '?';
    const awayScore = bet.result.awayScore;
    const homeScore = bet.result.homeScore;
    const mlOutcome = bet.result.outcome;

    // Get MOS (margin over spread)
    let mos = bet.spreadAnalysis?.marginOverSpread;
    if (mos === undefined || mos === null) {
      // Compute from blended margin
      const blend = bet.spreadAnalysis?.blendedMargin;
      if (blend !== undefined) {
        mos = blend - Math.abs(spread);
      } else {
        continue; // Can't calculate without MOS
      }
    }

    // Calculate spread EV from our model
    const coverProb = estimateCoverProb(mos);
    const spreadEV = calcSpreadEV(coverProb, SPREAD_ODDS);

    // Did it actually cover?
    const actualMargin = pickSide === 'away'
      ? awayScore - homeScore
      : homeScore - awayScore;

    const spreadResult = actualMargin + spread;
    let coverOutcome;
    if (spreadResult > 0) coverOutcome = 'COVER';
    else if (spreadResult === 0) coverOutcome = 'PUSH';
    else coverOutcome = 'MISS';

    results.push({
      date: bet.date,
      pickTeam,
      pickSide,
      spread,
      mos: Math.round(mos * 10) / 10,
      coverProb: Math.round(coverProb * 1000) / 10,
      spreadEV: Math.round(spreadEV * 10) / 10,
      actualMargin,
      spreadResult,
      coverOutcome,
      mlOutcome,
      mlEV: bet.prediction?.bestEV || bet.prediction?.evPercent || 0,
    });
  }

  results.sort((a, b) => b.spreadEV - a.spreadEV);

  // ═══════════════════════════════════════════════════════════
  // GAME-BY-GAME
  // ═══════════════════════════════════════════════════════════

  console.log('┌───────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ GAME-BY-GAME: Model MOS → Spread EV → Did It Cover?                              │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────┘\n');

  console.log('   Date       │ Team                │ Spread │ MOS   │ CoverP │ SpreadEV │ Actual  │ ATS    │ ML');
  console.log('   ───────────┼─────────────────────┼────────┼───────┼────────┼──────────┼─────────┼────────┼──────');

  results.forEach(r => {
    const atsIcon = r.coverOutcome === 'COVER' ? '✅' : r.coverOutcome === 'PUSH' ? '➖' : '❌';
    const mlIcon = r.mlOutcome === 'WIN' ? '✅' : '❌';
    const evIcon = r.spreadEV > 0 ? '🟢' : '🔴';
    const team = r.pickTeam.slice(0, 19);
    console.log(`   ${r.date} │ ${team.padEnd(19)} │ ${String(r.spread).padStart(5)}  │ ${r.mos >= 0 ? '+' : ''}${r.mos.toFixed(1).padStart(4)} │ ${r.coverProb.toFixed(1).padStart(5)}% │ ${evIcon} ${r.spreadEV >= 0 ? '+' : ''}${r.spreadEV.toFixed(1).padStart(4)}% │ ${r.spreadResult >= 0 ? '+' : ''}${r.spreadResult.toFixed(1).padStart(5)} │ ${atsIcon} ${r.coverOutcome.padEnd(5)} │ ${mlIcon}`);
  });

  // ═══════════════════════════════════════════════════════════
  // THE BIG QUESTION: +EV SPREAD BETS vs -EV SPREAD BETS
  // ═══════════════════════════════════════════════════════════

  function calcStats(picks, label) {
    if (picks.length === 0) return { label, n: 0 };
    const covers = picks.filter(r => r.coverOutcome === 'COVER').length;
    const misses = picks.filter(r => r.coverOutcome === 'MISS').length;
    const pushes = picks.filter(r => r.coverOutcome === 'PUSH').length;
    const total = covers + misses;
    const coverRate = total > 0 ? (covers / total * 100) : 0;
    const profit = (covers * SPREAD_PAYOUT) - (misses * 1);
    const roi = total > 0 ? (profit / total * 100) : 0;
    return { label, n: picks.length, covers, misses, pushes, coverRate, profit, roi };
  }

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║     THE BIG QUESTION: Were +EV spread bets actually profitable?                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════╝\n');

  const posEV = results.filter(r => r.spreadEV > 0);
  const negEV = results.filter(r => r.spreadEV <= 0);

  const posStats = calcStats(posEV, '+EV Spread Bets (SpreadEV > 0%)');
  const negStats = calcStats(negEV, '-EV Spread Bets (SpreadEV ≤ 0%)');
  const allStats = calcStats(results, 'ALL Bets ATS');

  function printLine(s) {
    if (s.n === 0) {
      console.log(`   ${s.label}: 0 bets`);
      return;
    }
    const emoji = s.roi > 5 ? '🟢' : s.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${s.label}`);
    console.log(`      ${s.covers}-${s.misses}-${s.pushes} | ${s.coverRate.toFixed(1)}% cover | ${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2)}u profit | ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(1)}% ROI`);
  }

  printLine(posStats);
  console.log('');
  printLine(negStats);
  console.log('');
  printLine(allStats);

  // ═══════════════════════════════════════════════════════════
  // SPREAD EV TIERS — how do different levels of spread EV perform?
  // ═══════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SPREAD EV TIERS: How do different levels of calculated Spread EV perform?         │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────┘\n');

  const evTiers = [
    { label: 'SpreadEV 5%+',    filter: r => r.spreadEV >= 5 },
    { label: 'SpreadEV 3-5%',   filter: r => r.spreadEV >= 3 && r.spreadEV < 5 },
    { label: 'SpreadEV 2-3%',   filter: r => r.spreadEV >= 2 && r.spreadEV < 3 },
    { label: 'SpreadEV 1-2%',   filter: r => r.spreadEV >= 1 && r.spreadEV < 2 },
    { label: 'SpreadEV 0-1%',   filter: r => r.spreadEV >= 0 && r.spreadEV < 1 },
    { label: 'SpreadEV -2-0%',  filter: r => r.spreadEV >= -2 && r.spreadEV < 0 },
    { label: 'SpreadEV < -2%',  filter: r => r.spreadEV < -2 },
  ];

  console.log('   Tier              │ Bets │ ATS Record  │ Cover%  │ Profit    │ ROI');
  console.log('   ──────────────────┼──────┼─────────────┼─────────┼───────────┼──────');

  evTiers.forEach(tier => {
    const picks = results.filter(tier.filter);
    if (picks.length === 0) return;
    const s = calcStats(picks, tier.label);
    const emoji = s.roi > 5 ? '🟢' : s.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${tier.label.padEnd(16)} │ ${String(s.n).padStart(4)} │ ${s.covers}-${s.misses}-${s.pushes}`.padEnd(56) + `│ ${s.coverRate.toFixed(1).padStart(5)}%  │ ${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2).padStart(6)}u  │ ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(1)}%`);
  });

  // ═══════════════════════════════════════════════════════════
  // MOS TIERS — what MOS gives the best ATS results?
  // ═══════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ MOS TIERS: What margin over spread gives the best ATS cover rate?                 │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────┘\n');

  const mosTiers = [
    { label: 'MOS 5+ pts',    filter: r => r.mos >= 5 },
    { label: 'MOS 4-5 pts',   filter: r => r.mos >= 4 && r.mos < 5 },
    { label: 'MOS 3-4 pts',   filter: r => r.mos >= 3 && r.mos < 4 },
    { label: 'MOS 2-3 pts',   filter: r => r.mos >= 2 && r.mos < 3 },
    { label: 'MOS 1-2 pts',   filter: r => r.mos >= 1 && r.mos < 2 },
    { label: 'MOS 0-1 pts',   filter: r => r.mos >= 0 && r.mos < 1 },
    { label: 'MOS <0 pts',    filter: r => r.mos < 0 },
  ];

  console.log('   Tier              │ Bets │ ATS Record  │ Cover%  │ Profit    │ ROI     │ Avg SpreadEV');
  console.log('   ──────────────────┼──────┼─────────────┼─────────┼───────────┼─────────┼─────────');

  mosTiers.forEach(tier => {
    const picks = results.filter(tier.filter);
    if (picks.length === 0) return;
    const s = calcStats(picks, tier.label);
    const avgSpreadEV = picks.reduce((sum, p) => sum + p.spreadEV, 0) / picks.length;
    const emoji = s.roi > 5 ? '🟢' : s.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${tier.label.padEnd(16)} │ ${String(s.n).padStart(4)} │ ${s.covers}-${s.misses}-${s.pushes}`.padEnd(56) + `│ ${s.coverRate.toFixed(1).padStart(5)}%  │ ${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2).padStart(6)}u  │ ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(1).padStart(5)}% │ ${avgSpreadEV >= 0 ? '+' : ''}${avgSpreadEV.toFixed(1)}%`);
  });

  // ═══════════════════════════════════════════════════════════
  // CROSS: SPREAD EV vs ML EV — are they correlated?
  // ═══════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ SPREAD EV vs ML EV: Correlation matrix                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────┘\n');

  const crossMatrix = [
    { label: '+SpreadEV & ML EV 2-5%',   filter: r => r.spreadEV > 0 && r.mlEV >= 2 && r.mlEV < 5 },
    { label: '+SpreadEV & ML EV 5-10%',  filter: r => r.spreadEV > 0 && r.mlEV >= 5 && r.mlEV < 10 },
    { label: '+SpreadEV & ML EV 10%+',   filter: r => r.spreadEV > 0 && r.mlEV >= 10 },
    { label: '-SpreadEV & ML EV 2-5%',   filter: r => r.spreadEV <= 0 && r.mlEV >= 2 && r.mlEV < 5 },
    { label: '-SpreadEV & ML EV 5-10%',  filter: r => r.spreadEV <= 0 && r.mlEV >= 5 && r.mlEV < 10 },
    { label: '-SpreadEV & ML EV 10%+',   filter: r => r.spreadEV <= 0 && r.mlEV >= 10 },
  ];

  console.log('   Combo                         │ Bets │ ATS Record │ Cover%  │ Profit    │ ROI');
  console.log('   ──────────────────────────────┼──────┼────────────┼─────────┼───────────┼──────');

  crossMatrix.forEach(tier => {
    const picks = results.filter(tier.filter);
    if (picks.length === 0) return;
    const s = calcStats(picks, tier.label);
    const emoji = s.roi > 5 ? '🟢' : s.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${tier.label.padEnd(28)} │ ${String(s.n).padStart(4)} │ ${s.covers}-${s.misses}-${s.pushes}`.padEnd(63) + `│ ${s.coverRate.toFixed(1).padStart(5)}%  │ ${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2).padStart(6)}u  │ ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(1)}%`);
  });

  // ═══════════════════════════════════════════════════════════
  // NON-PRIME PICKS SEGMENT — games where model has MOS but no ML EV
  // ═══════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 💡 KEY: Would +EV SPREAD bets work as a STANDALONE segment?                       │');
  console.log('│    (i.e., games where spread EV > 0 regardless of ML EV)                         │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────┘\n');

  // What if we just bet every game where spreadEV > 0 at 1u flat?
  const ev0 = calcStats(results.filter(r => r.spreadEV > 0), 'SpreadEV > 0%');
  const ev1 = calcStats(results.filter(r => r.spreadEV > 1), 'SpreadEV > 1%');
  const ev2 = calcStats(results.filter(r => r.spreadEV > 2), 'SpreadEV > 2%');
  const ev3 = calcStats(results.filter(r => r.spreadEV > 3), 'SpreadEV > 3%');
  const ev5 = calcStats(results.filter(r => r.spreadEV > 5), 'SpreadEV > 5%');

  [ev0, ev1, ev2, ev3, ev5].forEach(s => {
    if (s.n === 0) return;
    const emoji = s.roi > 5 ? '🟢' : s.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${s.label.padEnd(18)} │ ${String(s.n).padStart(3)} bets │ ${s.covers}-${s.misses}-${s.pushes} │ ${s.coverRate.toFixed(1)}% cover │ ${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2)}u │ ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(1)}% ROI`);
  });

  // ═══════════════════════════════════════════════════════════
  // VERDICT
  // ═══════════════════════════════════════════════════════════

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                              VERDICT                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════╝\n');

  const breakEven = 52.4;

  if (posStats.n > 0 && posStats.coverRate > breakEven) {
    console.log(`   🟢 YES — +EV SPREAD BETS HAVE BEEN PROFITABLE`);
    console.log(`      Cover rate: ${posStats.coverRate.toFixed(1)}% (break-even = ${breakEven}%)`);
    console.log(`      ROI: ${posStats.roi >= 0 ? '+' : ''}${posStats.roi.toFixed(1)}%`);
    console.log(`      Profit: ${posStats.profit >= 0 ? '+' : ''}${posStats.profit.toFixed(2)}u on ${posStats.n} bets`);
  } else if (posStats.n > 0) {
    console.log(`   🔴 NO — +EV SPREAD BETS HAVE NOT COVERED ENOUGH`);
    console.log(`      Cover rate: ${posStats.coverRate.toFixed(1)}% (need ${breakEven}%)`);
    console.log(`      ROI: ${posStats.roi >= 0 ? '+' : ''}${posStats.roi.toFixed(1)}%`);
  } else {
    console.log(`   ⚠️ No +EV spread bets found in dataset`);
  }

  if (negStats.n > 0) {
    console.log(`\n   Compare: -EV spread bets covered at ${negStats.coverRate.toFixed(1)}% | ${negStats.roi >= 0 ? '+' : ''}${negStats.roi.toFixed(1)}% ROI`);
  }

  console.log(`\n   📊 Sample size: ${results.length} total bets with spread data since ${startDate}`);
  console.log(`      +EV: ${posStats.n} bets | -EV: ${negStats.n} bets`);
  console.log('');

  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
