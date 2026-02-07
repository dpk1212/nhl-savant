/**
 * Analyze Prime Picks for unit sizing optimization
 * 
 * Breaks down win rate by:
 * 1. EV% buckets
 * 2. 90/10 blend margin over spread buckets
 * 3. Conviction tier (MAX/BLEND/BASE)
 * 4. Combined EV + margin analysis
 * 
 * Usage: node scripts/analyzePrimeUnitSizing.js
 */

import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║           PRIME PICKS UNIT SIZING ANALYSIS                                    ║');
  console.log('║           Win Rate by EV% and Margin Over Spread                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

  // Fetch all basketball bets
  const snapshot = await getDocs(collection(db, 'basketball_bets'));
  const allBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`Total bets in Firebase: ${allBets.length}`);
  
  // Filter to GRADED Prime picks only (spreadBoost > 0 = Prime)
  const primePicks = allBets.filter(b => {
    if (!b.result?.outcome) return false;
    return b.prediction?.spreadBoost > 0;
  });
  
  console.log(`Graded Prime picks: ${primePicks.length}\n`);
  
  if (primePicks.length === 0) {
    console.log('No graded Prime picks found!');
    process.exit(0);
  }

  // ═══════════════════════════════════════════════════════════════
  // ANALYSIS 1: WIN RATE BY EV%
  // ═══════════════════════════════════════════════════════════════
  console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ANALYSIS 1: WIN RATE BY EV%                                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  const evBuckets = [
    { label: '2-3%', min: 2, max: 3 },
    { label: '3-4%', min: 3, max: 4 },
    { label: '4-5%', min: 4, max: 5 },
    { label: '5-6%', min: 5, max: 6 },
    { label: '6-8%', min: 6, max: 8 },
    { label: '8-10%', min: 8, max: 10 },
    { label: '10-15%', min: 10, max: 15 },
    { label: '15%+', min: 15, max: 100 },
  ];
  
  for (const bucket of evBuckets) {
    const picks = primePicks.filter(b => {
      const ev = b.prediction?.bestEV || b.prediction?.evPercent || 0;
      return ev >= bucket.min && ev < bucket.max;
    });
    
    if (picks.length === 0) continue;
    
    const wins = picks.filter(b => b.result.outcome === 'WIN').length;
    const losses = picks.length - wins;
    const winRate = (wins / picks.length * 100).toFixed(1);
    const profit = picks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const unitsRisked = picks.reduce((sum, b) => sum + (b.prediction?.unitSize || 2), 0);
    const roi = unitsRisked > 0 ? (profit / unitsRisked * 100).toFixed(1) : '0.0';
    
    const bar = '█'.repeat(Math.round(parseFloat(winRate) / 5));
    console.log(`   EV ${bucket.label.padEnd(6)} │ ${String(picks.length).padStart(3)} picks │ ${wins}W-${losses}L │ ${winRate.padStart(5)}% WR │ ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u │ ${roi}% ROI │ ${bar}`);
    
    // Show individual picks for small buckets
    if (picks.length <= 5) {
      for (const p of picks) {
        const ev = p.prediction?.bestEV || p.prediction?.evPercent || 0;
        const team = p.bet?.team || p.prediction?.bestTeam || '?';
        console.log(`             └─ ${team} EV:${ev.toFixed(1)}% ${p.result.outcome} ${(p.result?.profit || 0) >= 0 ? '+' : ''}${(p.result?.profit || 0).toFixed(1)}u`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ANALYSIS 2: WIN RATE BY BLEND MARGIN OVER SPREAD
  // ═══════════════════════════════════════════════════════════════
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ANALYSIS 2: WIN RATE BY 90/10 BLEND MARGIN OVER SPREAD                       │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  const marginBuckets = [
    { label: '0-1 pts', min: -99, max: 1 },
    { label: '1-2 pts', min: 1, max: 2 },
    { label: '2-3 pts', min: 2, max: 3 },
    { label: '3-4 pts', min: 3, max: 4 },
    { label: '4-5 pts', min: 4, max: 5 },
    { label: '5-7 pts', min: 5, max: 7 },
    { label: '7+ pts', min: 7, max: 100 },
  ];
  
  // Check what data we have
  const withMarginData = primePicks.filter(b => b.spreadAnalysis?.marginOverSpread !== undefined);
  const withBlendedMargin = primePicks.filter(b => b.spreadAnalysis?.blendedMargin !== undefined);
  console.log(`   Picks with marginOverSpread: ${withMarginData.length}`);
  console.log(`   Picks with blendedMargin: ${withBlendedMargin.length}`);
  
  // Try to compute margin over spread from available data
  const getMarginOverSpread = (b) => {
    // Direct field
    if (b.spreadAnalysis?.marginOverSpread !== undefined) return b.spreadAnalysis.marginOverSpread;
    // Compute from blended margin and spread
    if (b.spreadAnalysis?.blendedMargin !== undefined && b.spreadAnalysis?.spread !== undefined) {
      return b.spreadAnalysis.blendedMargin - Math.abs(b.spreadAnalysis.spread);
    }
    return null;
  };
  
  console.log('');
  
  for (const bucket of marginBuckets) {
    const picks = primePicks.filter(b => {
      const margin = getMarginOverSpread(b);
      if (margin === null) return false;
      return margin >= bucket.min && margin < bucket.max;
    });
    
    if (picks.length === 0) continue;
    
    const wins = picks.filter(b => b.result.outcome === 'WIN').length;
    const losses = picks.length - wins;
    const winRate = (wins / picks.length * 100).toFixed(1);
    const profit = picks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const unitsRisked = picks.reduce((sum, b) => sum + (b.prediction?.unitSize || 2), 0);
    const roi = unitsRisked > 0 ? (profit / unitsRisked * 100).toFixed(1) : '0.0';
    
    const bar = '█'.repeat(Math.round(parseFloat(winRate) / 5));
    console.log(`   Margin ${bucket.label.padEnd(7)} │ ${String(picks.length).padStart(3)} picks │ ${wins}W-${losses}L │ ${winRate.padStart(5)}% WR │ ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u │ ${roi}% ROI │ ${bar}`);
  }
  
  // Also show picks without margin data
  const noMarginData = primePicks.filter(b => getMarginOverSpread(b) === null);
  if (noMarginData.length > 0) {
    const wins = noMarginData.filter(b => b.result.outcome === 'WIN').length;
    console.log(`\n   ⚠️ ${noMarginData.length} picks missing margin data (${wins}W-${noMarginData.length - wins}L)`);
  }

  // ═══════════════════════════════════════════════════════════════
  // ANALYSIS 3: WIN RATE BY CONVICTION TIER
  // ═══════════════════════════════════════════════════════════════
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ANALYSIS 3: WIN RATE BY CONVICTION TIER                                       │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  const tiers = ['MAX', 'BLEND', 'BASE'];
  for (const tier of tiers) {
    const picks = primePicks.filter(b => b.spreadAnalysis?.convictionTier === tier);
    if (picks.length === 0) {
      // Also check by bothModelsCover for older data
      const altPicks = tier === 'MAX' 
        ? primePicks.filter(b => b.spreadAnalysis?.bothModelsCover === true)
        : [];
      if (altPicks.length > 0) {
        const wins = altPicks.filter(b => b.result.outcome === 'WIN').length;
        const losses = altPicks.length - wins;
        const winRate = (wins / altPicks.length * 100).toFixed(1);
        const profit = altPicks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
        console.log(`   ${tier.padEnd(6)} │ ${String(altPicks.length).padStart(3)} picks │ ${wins}W-${losses}L │ ${winRate.padStart(5)}% WR │ ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u (from bothModelsCover field)`);
      } else {
        console.log(`   ${tier.padEnd(6)} │   0 picks`);
      }
      continue;
    }
    
    const wins = picks.filter(b => b.result.outcome === 'WIN').length;
    const losses = picks.length - wins;
    const winRate = (wins / picks.length * 100).toFixed(1);
    const profit = picks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const unitsRisked = picks.reduce((sum, b) => sum + (b.prediction?.unitSize || 2), 0);
    const roi = unitsRisked > 0 ? (profit / unitsRisked * 100).toFixed(1) : '0.0';
    
    const bar = '█'.repeat(Math.round(parseFloat(winRate) / 5));
    console.log(`   ${tier.padEnd(6)} │ ${String(picks.length).padStart(3)} picks │ ${wins}W-${losses}L │ ${winRate.padStart(5)}% WR │ ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u │ ${roi}% ROI │ ${bar}`);
  }
  
  // Also check for picks without tier data
  const noTierData = primePicks.filter(b => !b.spreadAnalysis?.convictionTier);
  if (noTierData.length > 0) {
    const wins = noTierData.filter(b => b.result.outcome === 'WIN').length;
    console.log(`\n   ⚠️ ${noTierData.length} picks without conviction tier (${wins}W-${noTierData.length - wins}L)`);
    console.log(`      (These were written before conviction tier was added)`);
    
    // Check what data they do have
    const withBothCovers = noTierData.filter(b => b.spreadAnalysis?.bothModelsCover === true);
    const withDrCovers = noTierData.filter(b => b.spreadAnalysis?.drCovers === true);
    console.log(`      bothModelsCover=true: ${withBothCovers.length}`);
    console.log(`      drCovers=true: ${withDrCovers.length}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // ANALYSIS 4: DR MARGIN + HS MARGIN INDIVIDUALLY
  // ═══════════════════════════════════════════════════════════════
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ANALYSIS 4: DR vs HS INDIVIDUAL MARGIN OVER SPREAD                            │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  const drMarginBuckets = [
    { label: '0-2 pts', min: 0, max: 2 },
    { label: '2-4 pts', min: 2, max: 4 },
    { label: '4-6 pts', min: 4, max: 6 },
    { label: '6+ pts', min: 6, max: 100 },
  ];
  
  console.log('   D-RATINGS margin over spread:');
  for (const bucket of drMarginBuckets) {
    const picks = primePicks.filter(b => {
      const dr = b.spreadAnalysis?.drMargin;
      const spread = b.spreadAnalysis?.spread;
      if (dr === undefined || spread === undefined) return false;
      const marginOverSpread = dr - Math.abs(spread);
      return marginOverSpread >= bucket.min && marginOverSpread < bucket.max;
    });
    
    if (picks.length === 0) continue;
    const wins = picks.filter(b => b.result.outcome === 'WIN').length;
    const winRate = (wins / picks.length * 100).toFixed(1);
    const profit = picks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    console.log(`   ${bucket.label.padEnd(8)} │ ${String(picks.length).padStart(3)} picks │ ${wins}W-${picks.length - wins}L │ ${winRate.padStart(5)}% WR │ ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u`);
  }
  
  console.log('\n   HASLAMETRICS margin over spread:');
  for (const bucket of drMarginBuckets) {
    const picks = primePicks.filter(b => {
      const hs = b.spreadAnalysis?.hsMargin;
      const spread = b.spreadAnalysis?.spread;
      if (hs === undefined || spread === undefined) return false;
      const marginOverSpread = hs - Math.abs(spread);
      return marginOverSpread >= bucket.min && marginOverSpread < bucket.max;
    });
    
    if (picks.length === 0) continue;
    const wins = picks.filter(b => b.result.outcome === 'WIN').length;
    const winRate = (wins / picks.length * 100).toFixed(1);
    const profit = picks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    console.log(`   ${bucket.label.padEnd(8)} │ ${String(picks.length).padStart(3)} picks │ ${wins}W-${picks.length - wins}L │ ${winRate.padStart(5)}% WR │ ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u`);
  }

  // ═══════════════════════════════════════════════════════════════
  // ANALYSIS 5: COMBINED EV + MARGIN MATRIX
  // ═══════════════════════════════════════════════════════════════
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ ANALYSIS 5: EV × MARGIN MATRIX (Win Rate)                                     │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  const evGroups = [
    { label: 'Low EV (2-5%)', min: 2, max: 5 },
    { label: 'Mid EV (5-10%)', min: 5, max: 10 },
    { label: 'High EV (10%+)', min: 10, max: 100 },
  ];
  
  const marginGroups = [
    { label: 'Tight (0-3)', min: -99, max: 3 },
    { label: 'Comfy (3-5)', min: 3, max: 5 },
    { label: 'Wide (5+)', min: 5, max: 100 },
  ];
  
  console.log(`${''.padEnd(20)} │ ${'Tight (0-3)'.padEnd(22)} │ ${'Comfy (3-5)'.padEnd(22)} │ ${'Wide (5+)'.padEnd(22)}`);
  console.log(`${'─'.repeat(20)}─┼${'─'.repeat(23)}─┼${'─'.repeat(23)}─┼${'─'.repeat(23)}`);
  
  for (const evGroup of evGroups) {
    let row = `${evGroup.label.padEnd(20)} │ `;
    
    for (const marginGroup of marginGroups) {
      const picks = primePicks.filter(b => {
        const ev = b.prediction?.bestEV || b.prediction?.evPercent || 0;
        const margin = getMarginOverSpread(b);
        if (margin === null) return false;
        return ev >= evGroup.min && ev < evGroup.max && margin >= marginGroup.min && margin < marginGroup.max;
      });
      
      if (picks.length === 0) {
        row += `${'--'.padEnd(22)} │ `;
        continue;
      }
      
      const wins = picks.filter(b => b.result.outcome === 'WIN').length;
      const winRate = (wins / picks.length * 100).toFixed(0);
      const profit = picks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
      row += `${wins}W-${picks.length - wins}L ${winRate}% ${profit >= 0 ? '+' : ''}${profit.toFixed(1)}u`.padEnd(22) + ' │ ';
    }
    
    console.log(row);
  }

  // ═══════════════════════════════════════════════════════════════
  // RAW DATA DUMP - Every Prime pick
  // ═══════════════════════════════════════════════════════════════
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ RAW DATA: ALL GRADED PRIME PICKS                                              │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  // Sort by date
  const sorted = [...primePicks].sort((a, b) => {
    const dateA = a.date || a.id?.slice(0, 10) || '';
    const dateB = b.date || b.id?.slice(0, 10) || '';
    return dateA.localeCompare(dateB);
  });
  
  console.log(`   ${'Date'.padEnd(12)} ${'Team'.padEnd(20)} ${'EV%'.padEnd(7)} ${'Odds'.padEnd(7)} ${'Spread'.padEnd(7)} ${'DR+'.padEnd(6)} ${'HS+'.padEnd(6)} ${'Blend+'.padEnd(8)} ${'MoS'.padEnd(6)} ${'Tier'.padEnd(6)} ${'Units'.padEnd(6)} ${'Result'.padEnd(6)} ${'Profit'.padEnd(8)}`);
  console.log(`   ${'─'.repeat(110)}`);
  
  for (const p of sorted) {
    const date = p.date || p.id?.slice(0, 10) || '?';
    const team = (p.bet?.team || p.prediction?.bestTeam || '?').slice(0, 18);
    const ev = (p.prediction?.bestEV || p.prediction?.evPercent || 0).toFixed(1);
    const odds = p.bet?.odds || p.prediction?.bestOdds || '?';
    const spread = p.spreadAnalysis?.spread ?? '?';
    const dr = p.spreadAnalysis?.drMargin ?? '?';
    const hs = p.spreadAnalysis?.hsMargin ?? '?';
    const blend = p.spreadAnalysis?.blendedMargin ?? '?';
    const mos = getMarginOverSpread(p)?.toFixed(1) ?? '?';
    const tier = p.spreadAnalysis?.convictionTier || (p.spreadAnalysis?.bothModelsCover ? 'MAX*' : '?');
    const units = p.prediction?.unitSize || '?';
    const result = p.result?.outcome || '?';
    const profit = (p.result?.profit || 0).toFixed(1);
    
    const resultColor = result === 'WIN' ? '✅' : result === 'LOSS' ? '❌' : '⏳';
    console.log(`   ${date.toString().padEnd(12)} ${team.padEnd(20)} ${ev.padStart(5)}% ${String(odds).padStart(5)}  ${String(spread).padStart(5)}  ${String(dr).padStart(4)}  ${String(hs).padStart(4)}  ${String(blend).padStart(6)}  ${String(mos).padStart(4)}  ${String(tier).padEnd(5)} ${String(units).padStart(4)}u ${resultColor}${result.padEnd(4)} ${profit.padStart(6)}u`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════
  console.log('\n┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ OVERALL PRIME PICKS SUMMARY                                                   │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
  
  const totalWins = primePicks.filter(b => b.result.outcome === 'WIN').length;
  const totalLosses = primePicks.length - totalWins;
  const totalProfit = primePicks.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const totalRisked = primePicks.reduce((sum, b) => sum + (b.prediction?.unitSize || 2), 0);
  const overallROI = (totalProfit / totalRisked * 100).toFixed(1);
  
  const avgEV = primePicks.reduce((sum, b) => sum + (b.prediction?.bestEV || 0), 0) / primePicks.length;
  const marginsAvailable = primePicks.filter(b => getMarginOverSpread(b) !== null);
  const avgMarginOverSpread = marginsAvailable.length > 0 
    ? marginsAvailable.reduce((sum, b) => sum + getMarginOverSpread(b), 0) / marginsAvailable.length 
    : 0;
  
  console.log(`   Record: ${totalWins}-${totalLosses} (${(totalWins/primePicks.length*100).toFixed(1)}% WR)`);
  console.log(`   Profit: ${totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}u`);
  console.log(`   Units Risked: ${totalRisked.toFixed(1)}u`);
  console.log(`   ROI: ${overallROI}%`);
  console.log(`   Avg EV: +${avgEV.toFixed(1)}%`);
  console.log(`   Avg Blend Margin Over Spread: +${avgMarginOverSpread.toFixed(1)} pts (n=${marginsAvailable.length})`);
  console.log('');
}

analyze()
  .then(() => {
    console.log('Analysis complete.\n');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
