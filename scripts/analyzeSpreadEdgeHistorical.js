/**
 * 🔬 HISTORICAL SPREAD EDGE ANALYSIS
 * 
 * Pulls all completed basketball bets from Firebase and asks:
 * "If we had bet the SPREAD instead of (or in addition to) the moneyline,
 *  what would our results look like?"
 *
 * Each bet already stores:
 * - spreadAnalysis.spread (the market spread at time of pick)
 * - spreadAnalysis.marginOverSpread (model's predicted edge over spread)
 * - spreadAnalysis.drMargin, hsMargin, blendedMargin
 * - spreadAnalysis.drCovers, hsCovers, bothModelsCover
 * - result.awayScore, result.homeScore (actual scores)
 * - prediction.bestBet (away/home — which side we picked)
 *
 * We can reconstruct: did the picked side COVER the spread?
 */

import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Standard spread odds
const SPREAD_ODDS = -110;
const SPREAD_PAYOUT = 100 / 110; // 0.909 per unit on a win

async function analyzeSpreadEdge() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║           🔬 HISTORICAL SPREAD EDGE ANALYSIS                                              ║');
  console.log('║           "Would spread bets have been profitable?"                                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // Fetch all COMPLETED basketball bets
  const betsRef = collection(db, 'basketball_bets');
  const gradedQuery = query(betsRef, where('status', '==', 'COMPLETED'));
  const snapshot = await getDocs(gradedQuery);

  const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter for bets since Prime Picks launch (1/23/2026) that have spread data + results
  const startDate = '2026-01-23';
  const bets = allBets.filter(bet => {
    const betDate = bet.date || bet.gameDate || '';
    return betDate >= startDate;
  });

  console.log(`   📊 Total completed bets: ${allBets.length}`);
  console.log(`   📊 Bets since ${startDate}: ${bets.length}`);

  // Filter to bets with spread data AND actual scores
  const spreadBets = bets.filter(bet => {
    const hasSpread = bet.spreadAnalysis?.spread !== undefined && bet.spreadAnalysis?.spread !== null;
    const hasScores = bet.result?.awayScore !== null && bet.result?.homeScore !== null && 
                      bet.result?.awayScore !== undefined && bet.result?.homeScore !== undefined;
    const hasPickSide = bet.prediction?.bestBet;
    return hasSpread && hasScores && hasPickSide;
  });

  console.log(`   📊 Bets with spread data + scores: ${spreadBets.length}`);
  console.log('\n');

  if (spreadBets.length === 0) {
    console.log('   ❌ No bets found with both spread data and actual scores.');
    console.log('   Make sure results have been graded with awayScore/homeScore.');
    process.exit(0);
  }

  // ═══════════════════════════════════════════════════════════════
  // ANALYZE EACH BET: Would the spread have covered?
  // ═══════════════════════════════════════════════════════════════

  const results = [];

  for (const bet of spreadBets) {
    const spread = bet.spreadAnalysis.spread;
    const marginOverSpread = bet.spreadAnalysis.marginOverSpread || 0;
    const blendedMargin = bet.spreadAnalysis.blendedMargin || 0;
    const drMargin = bet.spreadAnalysis.drMargin || 0;
    const hsMargin = bet.spreadAnalysis.hsMargin || 0;
    const drCovers = bet.spreadAnalysis.drCovers || false;
    const hsCovers = bet.spreadAnalysis.hsCovers || false;
    const bothCover = bet.spreadAnalysis.bothModelsCover || false;
    const convictionTier = bet.spreadAnalysis.convictionTier || 'BASE';

    const pickSide = bet.prediction.bestBet; // 'away' or 'home'
    const pickTeam = bet.prediction.bestTeam || bet.bet?.pick || bet.bet?.team || '';
    const awayScore = bet.result.awayScore;
    const homeScore = bet.result.homeScore;
    const mlOutcome = bet.result.outcome; // WIN/LOSS for moneyline

    // Calculate actual margin from picked team's perspective
    const actualMargin = pickSide === 'away' 
      ? awayScore - homeScore 
      : homeScore - awayScore;

    // The spread is from the picked team's perspective
    // If picked team is away and spread is +5.5, they need to lose by less than 5.5
    // Cover condition: actualMargin > -spread (or actualMargin + spread > 0)
    // Wait — the spread stored is the market spread for the PICKED side
    // Actually need to understand: what's stored as bet.spreadAnalysis.spread?

    // From fetchPrimePicks: spread = pickedTeam === 'away' ? spreadGame.awaySpread : spreadGame.homeSpread
    // So spread is the spread for OUR picked team
    // If we pick the underdog: spread = +5.5 → need actual margin > -5.5
    // If we pick the favorite: spread = -5.5 → need actual margin > 5.5
    // Cover = actualMargin > -spread... wait that's not right
    // Cover = actualMargin + spread > 0 (for dogs) or actualMargin > |spread| (for faves)
    // Unified: actualMargin + spread > 0 means covered (with spread in its natural sign)
    // E.g., spread = -5.5, actual margin = 7 → 7 + (-5.5) = 1.5 > 0 → covered ✓
    // E.g., spread = +3.5, actual margin = -2 → -2 + 3.5 = 1.5 > 0 → covered ✓
    // E.g., spread = -5.5, actual margin = 3 → 3 + (-5.5) = -2.5 < 0 → not covered ✗
    
    const spreadResult = actualMargin + spread;
    let spreadOutcome;
    if (spreadResult > 0) {
      spreadOutcome = 'COVER';
    } else if (spreadResult === 0) {
      spreadOutcome = 'PUSH';
    } else {
      spreadOutcome = 'MISS';
    }

    const ev = bet.prediction?.bestEV || bet.prediction?.evPercent || 0;
    const units = bet.prediction?.unitSize || 1;

    results.push({
      date: bet.date,
      game: `${bet.game?.awayTeam || '?'} @ ${bet.game?.homeTeam || '?'}`,
      pickTeam,
      pickSide,
      spread,
      marginOverSpread,
      blendedMargin,
      drMargin,
      hsMargin,
      drCovers,
      hsCovers,
      bothCover,
      convictionTier,
      actualMargin,
      spreadResult,
      spreadOutcome,
      mlOutcome,
      ev,
      units,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // DISPLAY: GAME-BY-GAME RESULTS
  // ═══════════════════════════════════════════════════════════════

  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ GAME-BY-GAME: SPREAD COVER RESULTS                                                       │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  console.log('   Date       │ Pick                  │ Spread │ MOS   │ Actual │ SpreadRes │ ATS    │ ML');
  console.log('   ───────────┼───────────────────────┼────────┼───────┼────────┼───────────┼────────┼──────');

  results.sort((a, b) => a.date.localeCompare(b.date));

  results.forEach(r => {
    const atsEmoji = r.spreadOutcome === 'COVER' ? '✅' : r.spreadOutcome === 'PUSH' ? '➖' : '❌';
    const mlEmoji = r.mlOutcome === 'WIN' ? '✅' : r.mlOutcome === 'LOSS' ? '❌' : '➖';
    const team = r.pickTeam.length > 19 ? r.pickTeam.substring(0, 19) : r.pickTeam;
    
    console.log(`   ${r.date} │ ${team.padEnd(21)} │ ${String(r.spread).padStart(5)}  │ ${r.marginOverSpread >= 0 ? '+' : ''}${r.marginOverSpread.toFixed(1).padStart(4)} │ ${r.actualMargin >= 0 ? '+' : ''}${r.actualMargin.toString().padStart(4)} │ ${r.spreadResult >= 0 ? '+' : ''}${r.spreadResult.toFixed(1).padStart(5)}   │ ${atsEmoji} ${r.spreadOutcome.padEnd(5)} │ ${mlEmoji} ${r.mlOutcome}`);
  });

  // ═══════════════════════════════════════════════════════════════
  // OVERALL SPREAD PERFORMANCE
  // ═══════════════════════════════════════════════════════════════

  function calcSpreadStats(picks, label) {
    const covers = picks.filter(r => r.spreadOutcome === 'COVER').length;
    const misses = picks.filter(r => r.spreadOutcome === 'MISS').length;
    const pushes = picks.filter(r => r.spreadOutcome === 'PUSH').length;
    const total = covers + misses;
    const coverRate = total > 0 ? (covers / total * 100) : 0;

    // ROI at -110 spread odds (1u per bet)
    const profit = (covers * SPREAD_PAYOUT) - (misses * 1);
    const unitsWagered = covers + misses; // pushes returned
    const roi = unitsWagered > 0 ? (profit / unitsWagered * 100) : 0;

    // Weighted ROI (using actual unit sizing)
    let wProfit = 0;
    let wUnits = 0;
    picks.forEach(r => {
      const u = r.units;
      wUnits += u;
      if (r.spreadOutcome === 'COVER') wProfit += u * SPREAD_PAYOUT;
      else if (r.spreadOutcome === 'MISS') wProfit -= u;
    });
    const wRoi = wUnits > 0 ? (wProfit / wUnits * 100) : 0;

    return { label, total: picks.length, covers, misses, pushes, coverRate, profit, roi, wProfit, wUnits, wRoi };
  }

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 OVERALL SPREAD PERFORMANCE (All Prime Picks ATS)                                      │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const overall = calcSpreadStats(results, 'ALL PRIME PICKS ATS');
  const mlWins = results.filter(r => r.mlOutcome === 'WIN').length;
  const mlLosses = results.filter(r => r.mlOutcome === 'LOSS').length;

  console.log(`   📈 SPREAD (ATS):    ${overall.covers}-${overall.misses}-${overall.pushes} | ${overall.coverRate.toFixed(1)}% cover rate | ${overall.profit >= 0 ? '+' : ''}${overall.profit.toFixed(2)}u profit | ${overall.roi >= 0 ? '+' : ''}${overall.roi.toFixed(1)}% ROI (flat 1u)`);
  console.log(`   📈 SPREAD weighted: ${overall.wProfit >= 0 ? '+' : ''}${overall.wProfit.toFixed(2)}u / ${overall.wUnits.toFixed(1)}u wagered | ${overall.wRoi >= 0 ? '+' : ''}${overall.wRoi.toFixed(1)}% ROI (using unit sizing)`);
  console.log(`   💰 MONEYLINE (ML):  ${mlWins}-${mlLosses} | ${(mlWins / (mlWins + mlLosses) * 100).toFixed(1)}% win rate`);

  // ═══════════════════════════════════════════════════════════════
  // SEGMENT BY MARGIN OVER SPREAD
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 BY MARGIN OVER SPREAD (Model\'s predicted edge over the line)                          │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const mosTiers = [
    { label: '5+ pts over spread',  filter: r => r.marginOverSpread >= 5 },
    { label: '4-5 pts over spread', filter: r => r.marginOverSpread >= 4 && r.marginOverSpread < 5 },
    { label: '3-4 pts over spread', filter: r => r.marginOverSpread >= 3 && r.marginOverSpread < 4 },
    { label: '2-3 pts over spread', filter: r => r.marginOverSpread >= 2 && r.marginOverSpread < 3 },
    { label: '1-2 pts over spread', filter: r => r.marginOverSpread >= 1 && r.marginOverSpread < 2 },
    { label: '0-1 pts over spread', filter: r => r.marginOverSpread >= 0 && r.marginOverSpread < 1 },
    { label: '<0 (doesn\'t cover)', filter: r => r.marginOverSpread < 0 },
  ];

  console.log('   Tier                   │ Bets │ ATS Record │ Cover% │ Profit   │ ROI      │ ML WR');
  console.log('   ───────────────────────┼──────┼────────────┼────────┼──────────┼──────────┼──────');

  mosTiers.forEach(tier => {
    const picks = results.filter(tier.filter);
    if (picks.length === 0) {
      console.log(`   ${tier.label.padEnd(23)} │    0 │     -      │     -  │       -  │       -  │     -`);
      return;
    }
    const stats = calcSpreadStats(picks, tier.label);
    const mlWR = picks.filter(r => r.mlOutcome === 'WIN').length;
    const mlTotal = picks.filter(r => r.mlOutcome === 'WIN' || r.mlOutcome === 'LOSS').length;
    const mlPct = mlTotal > 0 ? (mlWR / mlTotal * 100).toFixed(0) : '-';
    
    const emoji = stats.roi > 5 ? '🟢' : stats.roi > 0 ? '🟡' : '🔴';
    const profitStr = `${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`;
    const roiStr = `${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`;
    
    console.log(`   ${emoji} ${tier.label.padEnd(21)} │ ${String(stats.total).padStart(4)} │ ${stats.covers}-${stats.misses}-${stats.pushes}`.padEnd(65) + ` │ ${stats.coverRate.toFixed(0).padStart(4)}%  │ ${profitStr.padStart(8)} │ ${roiStr.padStart(8)} │ ${mlPct}%`);
  });

  // ═══════════════════════════════════════════════════════════════
  // SEGMENT BY CONVICTION TIER
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 BY CONVICTION TIER                                                                    │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const convTiers = [
    { label: 'MAX (both models cover)',  filter: r => r.convictionTier === 'MAX' },
    { label: 'BLEND (90/10 covers)',     filter: r => r.convictionTier === 'BLEND' },
    { label: 'BASE (DR only covers)',    filter: r => r.convictionTier === 'BASE' },
  ];

  console.log('   Tier                        │ Bets │ ATS Record │ Cover% │ Profit   │ ROI      │ ML WR');
  console.log('   ────────────────────────────┼──────┼────────────┼────────┼──────────┼──────────┼──────');

  convTiers.forEach(tier => {
    const picks = results.filter(tier.filter);
    if (picks.length === 0) {
      console.log(`   ${tier.label.padEnd(28)} │    0 │     -      │     -  │       -  │       -  │     -`);
      return;
    }
    const stats = calcSpreadStats(picks, tier.label);
    const mlWR = picks.filter(r => r.mlOutcome === 'WIN').length;
    const mlTotal = picks.filter(r => r.mlOutcome === 'WIN' || r.mlOutcome === 'LOSS').length;
    const mlPct = mlTotal > 0 ? (mlWR / mlTotal * 100).toFixed(0) : '-';
    
    const emoji = stats.roi > 5 ? '🟢' : stats.roi > 0 ? '🟡' : '🔴';
    const profitStr = `${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`;
    const roiStr = `${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`;
    
    console.log(`   ${emoji} ${tier.label.padEnd(26)} │ ${String(stats.total).padStart(4)} │ ${stats.covers}-${stats.misses}-${stats.pushes}`.padEnd(70) + ` │ ${stats.coverRate.toFixed(0).padStart(4)}%  │ ${profitStr.padStart(8)} │ ${roiStr.padStart(8)} │ ${mlPct}%`);
  });

  // ═══════════════════════════════════════════════════════════════
  // SEGMENT BY BOTH MODELS COVER
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 BOTH MODELS COVER vs ONLY ONE                                                         │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const bothGroup = results.filter(r => r.bothCover);
  const oneGroup = results.filter(r => !r.bothCover);

  const bothStats = calcSpreadStats(bothGroup, 'Both Models Cover');
  const oneStats = calcSpreadStats(oneGroup, 'Only One Covers');

  console.log(`   ✅ Both Models Cover:  ${bothStats.covers}-${bothStats.misses}-${bothStats.pushes} | ${bothStats.coverRate.toFixed(1)}% | ${bothStats.profit >= 0 ? '+' : ''}${bothStats.profit.toFixed(2)}u | ${bothStats.roi >= 0 ? '+' : ''}${bothStats.roi.toFixed(1)}% ROI`);
  console.log(`   ⚠️  Only DR Covers:    ${oneStats.covers}-${oneStats.misses}-${oneStats.pushes} | ${oneStats.coverRate.toFixed(1)}% | ${oneStats.profit >= 0 ? '+' : ''}${oneStats.profit.toFixed(2)}u | ${oneStats.roi >= 0 ? '+' : ''}${oneStats.roi.toFixed(1)}% ROI`);

  // ═══════════════════════════════════════════════════════════════
  // SEGMENT BY EV TIER  
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 BY ML EV TIER (Does ML edge correlate with spread covering?)                          │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const evTiers = [
    { label: '10%+ ML EV',   filter: r => r.ev >= 10 },
    { label: '5-10% ML EV',  filter: r => r.ev >= 5 && r.ev < 10 },
    { label: '3-5% ML EV',   filter: r => r.ev >= 3 && r.ev < 5 },
    { label: '2-3% ML EV',   filter: r => r.ev >= 2 && r.ev < 3 },
    { label: '<2% ML EV',    filter: r => r.ev < 2 },
  ];

  console.log('   Tier              │ Bets │ ATS Record │ Cover% │ ROI');
  console.log('   ──────────────────┼──────┼────────────┼────────┼──────');

  evTiers.forEach(tier => {
    const picks = results.filter(tier.filter);
    if (picks.length === 0) return;
    const stats = calcSpreadStats(picks, tier.label);
    const emoji = stats.roi > 5 ? '🟢' : stats.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${tier.label.padEnd(16)} │ ${String(stats.total).padStart(4)} │ ${stats.covers}-${stats.misses}-${stats.pushes}`.padEnd(53) + ` │ ${stats.coverRate.toFixed(0).padStart(4)}%  │ ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`);
  });

  // ═══════════════════════════════════════════════════════════════
  // SEGMENT BY FAVORITE vs UNDERDOG SPREAD
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📊 FAVORITE vs UNDERDOG SPREAD PICKS                                                     │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const favPicks = results.filter(r => r.spread < 0); // negative spread = favorite
  const dogPicks = results.filter(r => r.spread > 0); // positive spread = underdog
  const pkPicks = results.filter(r => r.spread === 0);

  const favStats = calcSpreadStats(favPicks, 'Favorites');
  const dogStats = calcSpreadStats(dogPicks, 'Underdogs');
  
  console.log(`   🏆 Favorites (neg spread): ${favStats.covers}-${favStats.misses}-${favStats.pushes} | ${favStats.coverRate.toFixed(1)}% | ${favStats.profit >= 0 ? '+' : ''}${favStats.profit.toFixed(2)}u | ${favStats.roi >= 0 ? '+' : ''}${favStats.roi.toFixed(1)}% ROI`);
  console.log(`   🐕 Underdogs (pos spread):  ${dogStats.covers}-${dogStats.misses}-${dogStats.pushes} | ${dogStats.coverRate.toFixed(1)}% | ${dogStats.profit >= 0 ? '+' : ''}${dogStats.profit.toFixed(2)}u | ${dogStats.roi >= 0 ? '+' : ''}${dogStats.roi.toFixed(1)}% ROI`);
  if (pkPicks.length > 0) {
    const pkStats = calcSpreadStats(pkPicks, 'Pick\'em');
    console.log(`   ⚖️  Pick'em (PK):           ${pkStats.covers}-${pkStats.misses}-${pkStats.pushes} | ${pkStats.coverRate.toFixed(1)}%`);
  }

  // ═══════════════════════════════════════════════════════════════
  // BY DATE
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 📅 DAILY SPREAD PERFORMANCE                                                              │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const byDate = {};
  results.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r);
  });

  let runningProfit = 0;
  const dates = Object.keys(byDate).sort();

  console.log('   Date       │ ATS    │ Daily P │ Running │ ML');
  console.log('   ───────────┼────────┼─────────┼─────────┼────');

  dates.forEach(date => {
    const picks = byDate[date];
    const stats = calcSpreadStats(picks, date);
    runningProfit += stats.profit;
    
    const mlW = picks.filter(r => r.mlOutcome === 'WIN').length;
    const mlL = picks.filter(r => r.mlOutcome === 'LOSS').length;
    
    const emoji = stats.profit > 0 ? '🟢' : stats.profit < 0 ? '🔴' : '⚪';
    const profitStr = `${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u`;
    const runStr = `${runningProfit >= 0 ? '+' : ''}${runningProfit.toFixed(2)}u`;
    
    console.log(`   ${emoji} ${date} │ ${stats.covers}-${stats.misses}-${stats.pushes}`.padEnd(28) + `│ ${profitStr.padStart(7)} │ ${runStr.padStart(7)} │ ${mlW}-${mlL}`);
  });

  // ═══════════════════════════════════════════════════════════════
  // COMBINED ML + ATS ANALYSIS
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('┌───────────────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 🏆 ML + ATS COMBINED OUTCOMES                                                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────────────────┘\n');

  const bothWin = results.filter(r => r.mlOutcome === 'WIN' && r.spreadOutcome === 'COVER');
  const mlWinAtsLoss = results.filter(r => r.mlOutcome === 'WIN' && r.spreadOutcome === 'MISS');
  const mlLossAtsCover = results.filter(r => r.mlOutcome === 'LOSS' && r.spreadOutcome === 'COVER');
  const bothLose = results.filter(r => r.mlOutcome === 'LOSS' && r.spreadOutcome === 'MISS');

  console.log(`   ✅✅ ML WIN + ATS COVER:  ${bothWin.length}  (${(bothWin.length / results.length * 100).toFixed(0)}%) — best case, double profit`);
  console.log(`   ✅❌ ML WIN + ATS MISS:   ${mlWinAtsLoss.length}  (${(mlWinAtsLoss.length / results.length * 100).toFixed(0)}%) — won outright but didn't cover`);
  console.log(`   ❌✅ ML LOSS + ATS COVER: ${mlLossAtsCover.length}  (${(mlLossAtsCover.length / results.length * 100).toFixed(0)}%) — lost but covered spread (hedge value!)`);
  console.log(`   ❌❌ ML LOSS + ATS MISS:  ${bothLose.length}  (${(bothLose.length / results.length * 100).toFixed(0)}%) — worst case`);

  // ═══════════════════════════════════════════════════════════════
  // VERDICT
  // ═══════════════════════════════════════════════════════════════

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                VERDICT                                                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════╝\n');

  const breakEvenCover = 52.4; // at -110
  
  if (overall.coverRate > breakEvenCover) {
    const edge = overall.coverRate - breakEvenCover;
    console.log(`   🟢 YES — SPREAD EDGE EXISTS`);
    console.log(`   Cover rate ${overall.coverRate.toFixed(1)}% exceeds break-even of ${breakEvenCover}% by ${edge.toFixed(1)}pp`);
    console.log(`   Flat 1u ROI: ${overall.roi >= 0 ? '+' : ''}${overall.roi.toFixed(1)}%`);
    console.log(`   Weighted ROI: ${overall.wRoi >= 0 ? '+' : ''}${overall.wRoi.toFixed(1)}%`);
  } else {
    console.log(`   🔴 NO CLEAR SPREAD EDGE (yet)`);
    console.log(`   Cover rate ${overall.coverRate.toFixed(1)}% is below break-even of ${breakEvenCover}%`);
  }

  // Best filter combo
  const filterCombos = [
    { label: 'MOS 3+ & Both Cover', picks: results.filter(r => r.marginOverSpread >= 3 && r.bothCover) },
    { label: 'MOS 3+',              picks: results.filter(r => r.marginOverSpread >= 3) },
    { label: 'MOS 2+ & Both Cover', picks: results.filter(r => r.marginOverSpread >= 2 && r.bothCover) },
    { label: 'MOS 2+',              picks: results.filter(r => r.marginOverSpread >= 2) },
    { label: 'MOS 1+ & Both Cover', picks: results.filter(r => r.marginOverSpread >= 1 && r.bothCover) },
    { label: 'Both Cover (any MOS)', picks: results.filter(r => r.bothCover) },
    { label: 'Favorites only',       picks: results.filter(r => r.spread < 0) },
    { label: 'Underdogs only',        picks: results.filter(r => r.spread > 0) },
    { label: 'MOS 2+ & Fav',         picks: results.filter(r => r.marginOverSpread >= 2 && r.spread < 0) },
    { label: 'MOS 2+ & Dog',         picks: results.filter(r => r.marginOverSpread >= 2 && r.spread > 0) },
  ];

  console.log('\n   📊 FILTER OPTIMIZATION (finding the best spread bet filter):');
  console.log('   Filter                       │ Bets │ ATS Record │ Cover% │ ROI');
  console.log('   ─────────────────────────────┼──────┼────────────┼────────┼──────');

  filterCombos.forEach(fc => {
    if (fc.picks.length === 0) return;
    const stats = calcSpreadStats(fc.picks, fc.label);
    const emoji = stats.roi > 5 ? '🟢' : stats.roi > 0 ? '🟡' : '🔴';
    console.log(`   ${emoji} ${fc.label.padEnd(27)} │ ${String(stats.total).padStart(4)} │ ${stats.covers}-${stats.misses}-${stats.pushes}`.padEnd(63) + ` │ ${stats.coverRate.toFixed(0).padStart(4)}%  │ ${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`);
  });

  console.log('\n   (Break-even at -110 odds = 52.4% cover rate)\n');
  
  process.exit(0);
}

analyzeSpreadEdge().catch(err => {
  console.error('💥 Error:', err);
  process.exit(1);
});
