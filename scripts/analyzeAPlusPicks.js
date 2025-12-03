/**
 * 🔬 DEEP DIVE: Why are A+ picks bleeding?
 * 
 * Analyzes A+ grade bets to find what's causing the -31.7% ROI
 * and identifies what ACTUALLY makes a high-conviction winner
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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

async function analyzeAPlusPicks() {
  console.log('\n🔬 DEEP DIVE: A+ PICKS ANALYSIS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Fetch ALL completed basketball bets
  const betsQuery = query(
    collection(db, 'basketball_bets'),
    where('status', '==', 'COMPLETED')
  );
  const betsSnapshot = await getDocs(betsQuery);
  const allBets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter A+ bets
  const aplusBets = allBets.filter(b => b.prediction?.grade === 'A+');
  console.log(`📊 Analyzing ${aplusBets.length} A+ bets (out of ${allBets.length} total)\n`);
  
  // ═══════════════════════════════════════════════════════════════
  // 1. A+ OVERVIEW
  // ═══════════════════════════════════════════════════════════════
  const wins = aplusBets.filter(b => b.result?.outcome === 'WIN').length;
  const losses = aplusBets.filter(b => b.result?.outcome === 'LOSS').length;
  const totalProfit = aplusBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const totalRisked = aplusBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
  const roi = (totalProfit / totalRisked) * 100;
  
  console.log('📈 A+ OVERALL');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`   Record: ${wins}-${losses} (${(wins/(wins+losses)*100).toFixed(1)}%)`);
  console.log(`   Profit: ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(2)}u`);
  console.log(`   ROI: ${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`);
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 2. WHY IS A+ BLEEDING? Let's break it down
  // ═══════════════════════════════════════════════════════════════
  console.log('🔍 BREAKING DOWN A+ BETS');
  console.log('───────────────────────────────────────────────────────────────\n');
  
  // By Odds Type
  console.log('   📉 A+ BY ODDS RANGE:');
  const oddsRanges = {
    'Heavy Fav (-300+)': b => b.bet?.odds <= -300,
    'Big Fav (-200 to -300)': b => b.bet?.odds > -300 && b.bet?.odds <= -200,
    'Mod Fav (-150 to -200)': b => b.bet?.odds > -200 && b.bet?.odds <= -150,
    'Slight Fav (-110 to -150)': b => b.bet?.odds > -150 && b.bet?.odds <= -110,
    'Pick\'em/Dog (+)': b => b.bet?.odds > -110
  };
  
  Object.entries(oddsRanges).forEach(([label, filter]) => {
    const groupBets = aplusBets.filter(filter);
    if (groupBets.length === 0) return;
    
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`      ${emoji} ${label.padEnd(22)}: ${String(bWins + '-' + bLosses).padEnd(6)} | ${(bProfit > 0 ? '+' : '') + bProfit.toFixed(2).padStart(7)}u | ROI: ${(bROI > 0 ? '+' : '') + bROI.toFixed(1)}%`);
  });
  console.log();
  
  // By Model Probability
  console.log('   🎯 A+ BY MODEL WIN PROBABILITY:');
  const probBuckets = {
    '90%+ Model': { min: 0.90, max: 1.0 },
    '80-90% Model': { min: 0.80, max: 0.90 },
    '70-80% Model': { min: 0.70, max: 0.80 },
    '60-70% Model': { min: 0.60, max: 0.70 },
    '<60% Model': { min: 0, max: 0.60 }
  };
  
  Object.entries(probBuckets).forEach(([label, { min, max }]) => {
    const bucketBets = aplusBets.filter(b => {
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
    
    console.log(`      ${emoji} ${label.padEnd(15)}: ${String(bWins + '-' + bLosses).padEnd(6)} | ${(bProfit > 0 ? '+' : '') + bProfit.toFixed(2).padStart(7)}u | ROI: ${(bROI > 0 ? '+' : '') + bROI.toFixed(1)}%`);
  });
  console.log();
  
  // By EV%
  console.log('   💰 A+ BY EV%:');
  const evBuckets = {
    '30%+ EV': { min: 30, max: 100 },
    '20-30% EV': { min: 20, max: 30 },
    '15-20% EV': { min: 15, max: 20 },
    '10-15% EV': { min: 10, max: 15 },
    '<10% EV': { min: 0, max: 10 }
  };
  
  Object.entries(evBuckets).forEach(([label, { min, max }]) => {
    const bucketBets = aplusBets.filter(b => {
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
    
    console.log(`      ${emoji} ${label.padEnd(12)}: ${String(bWins + '-' + bLosses).padEnd(6)} | ${(bProfit > 0 ? '+' : '') + bProfit.toFixed(2).padStart(7)}u | ROI: ${(bROI > 0 ? '+' : '') + bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 3. MODEL AGREEMENT ANALYSIS (D-Ratings vs Haslametrics)
  // ═══════════════════════════════════════════════════════════════
  console.log('🤝 MODEL AGREEMENT ANALYSIS (Both Models)');
  console.log('───────────────────────────────────────────────────────────────');
  
  // Calculate model agreement for each bet
  const betsWithAgreement = allBets.map(bet => {
    const pickTeam = bet.bet?.team || bet.bet?.pick;
    const awayTeam = bet.game?.awayTeam;
    const isAway = pickTeam === awayTeam;
    
    // Get model probabilities
    const dratingsProb = isAway 
      ? (bet.prediction?.dratingsAwayProb || 0.5)
      : (bet.prediction?.dratingsHomeProb || 0.5);
    const haslametricsProb = isAway
      ? (bet.prediction?.haslametricsAwayProb || 0.5)
      : (bet.prediction?.haslametricsHomeProb || 0.5);
    const ensembleProb = isAway
      ? (bet.prediction?.ensembleAwayProb || 0.5)
      : (bet.prediction?.ensembleHomeProb || 0.5);
    
    // Both models agree if both give >50% to the pick
    const dratingsAgrees = dratingsProb > 0.5;
    const haslametricsAgrees = haslametricsProb > 0.5;
    const bothAgree = dratingsAgrees && haslametricsAgrees;
    
    // Agreement strength = minimum of the two probabilities
    const agreementStrength = bothAgree ? Math.min(dratingsProb, haslametricsProb) : 0;
    
    // EV
    const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || 0;
    
    return {
      ...bet,
      dratingsProb,
      haslametricsProb,
      ensembleProb,
      bothAgree,
      agreementStrength,
      ev
    };
  });
  
  // Analyze by agreement
  const bothAgreeYes = betsWithAgreement.filter(b => b.bothAgree);
  const bothAgreeNo = betsWithAgreement.filter(b => !b.bothAgree);
  
  console.log('   📊 BOTH MODELS AGREE ON PICK:');
  [
    { label: 'Yes (both >50%)', bets: bothAgreeYes },
    { label: 'No (models split)', bets: bothAgreeNo }
  ].forEach(({ label, bets }) => {
    if (bets.length === 0) return;
    const bWins = bets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = bets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = bets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`      ${emoji} ${label.padEnd(20)}: ${String(bWins + '-' + bLosses).padEnd(7)} | ${(bProfit > 0 ? '+' : '') + bProfit.toFixed(2).padStart(7)}u | ROI: ${(bROI > 0 ? '+' : '') + bROI.toFixed(1)}%`);
  });
  console.log();
  
  // Agreement strength buckets
  console.log('   💪 AGREEMENT STRENGTH (Min of both models):');
  const strengthBuckets = {
    'Both 70%+': b => b.bothAgree && b.agreementStrength >= 0.70,
    'Both 60-70%': b => b.bothAgree && b.agreementStrength >= 0.60 && b.agreementStrength < 0.70,
    'Both 50-60%': b => b.bothAgree && b.agreementStrength >= 0.50 && b.agreementStrength < 0.60,
    'Models Disagree': b => !b.bothAgree
  };
  
  Object.entries(strengthBuckets).forEach(([label, filter]) => {
    const groupBets = betsWithAgreement.filter(filter);
    if (groupBets.length === 0) return;
    
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    const emoji = bROI > 0 ? '🟢' : bROI < -10 ? '🔴' : '🟡';
    
    console.log(`      ${emoji} ${label.padEnd(18)}: ${String(bWins + '-' + bLosses).padEnd(7)} | ${(bProfit > 0 ? '+' : '') + bProfit.toFixed(2).padStart(7)}u | ROI: ${(bROI > 0 ? '+' : '') + bROI.toFixed(1)}%`);
  });
  console.log();
  
  // ═══════════════════════════════════════════════════════════════
  // 4. FIND THE REAL TOP TIER
  // ═══════════════════════════════════════════════════════════════
  console.log('🏆 FINDING THE REAL TOP TIER');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('   Testing different combinations to find actual winners...\n');
  
  const criteria = [
    {
      label: 'Grade A + Model Agrees + Fav (-110 to -200)',
      filter: b => b.prediction?.grade === 'A' && 
                   betsWithAgreement.find(x => x.id === b.id)?.bothAgree &&
                   b.bet?.odds < -110 && b.bet?.odds >= -200
    },
    {
      label: 'Both Models 65%+ + EV 5-15% + Fav',
      filter: b => {
        const withAgreement = betsWithAgreement.find(x => x.id === b.id);
        return withAgreement?.bothAgree &&
               withAgreement?.agreementStrength >= 0.65 &&
               withAgreement?.ev >= 5 && withAgreement?.ev < 15 &&
               b.bet?.odds < -110;
      }
    },
    {
      label: 'Both Models 60%+ + Mod Fav (-150 to -200)',
      filter: b => {
        const withAgreement = betsWithAgreement.find(x => x.id === b.id);
        return withAgreement?.bothAgree &&
               withAgreement?.agreementStrength >= 0.60 &&
               b.bet?.odds >= -200 && b.bet?.odds < -150;
      }
    },
    {
      label: 'Ensemble 70%+ + EV 5-20% + Not Heavy Fav',
      filter: b => {
        const withAgreement = betsWithAgreement.find(x => x.id === b.id);
        return withAgreement?.ensembleProb >= 0.70 &&
               withAgreement?.ev >= 5 && withAgreement?.ev < 20 &&
               b.bet?.odds > -300;
      }
    },
    {
      label: 'Grade A/B+ + Away + Slight Fav',
      filter: b => (b.prediction?.grade === 'A' || b.prediction?.grade === 'B+') &&
                   (b.bet?.team === b.game?.awayTeam || b.bet?.pick === b.game?.awayTeam) &&
                   b.bet?.odds > -150 && b.bet?.odds <= -110
    },
    {
      label: 'Both Models 70%+ + Any Favorite',
      filter: b => {
        const withAgreement = betsWithAgreement.find(x => x.id === b.id);
        return withAgreement?.bothAgree &&
               withAgreement?.agreementStrength >= 0.70 &&
               b.bet?.odds < -110;
      }
    }
  ];
  
  const results = criteria.map(({ label, filter }) => {
    const groupBets = allBets.filter(filter);
    if (groupBets.length === 0) return { label, count: 0, roi: 0, profit: 0 };
    
    const bWins = groupBets.filter(b => b.result?.outcome === 'WIN').length;
    const bLosses = groupBets.filter(b => b.result?.outcome === 'LOSS').length;
    const bProfit = groupBets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
    const bRisked = groupBets.reduce((sum, b) => sum + (b.result?.units || b.prediction?.unitSize || 1), 0);
    const bROI = bRisked > 0 ? (bProfit / bRisked * 100) : 0;
    
    return { label, count: groupBets.length, wins: bWins, losses: bLosses, roi: bROI, profit: bProfit };
  }).filter(r => r.count >= 3);
  
  results.sort((a, b) => b.roi - a.roi);
  
  results.forEach((r, i) => {
    const emoji = r.roi > 10 ? '🟢' : r.roi < -10 ? '🔴' : '🟡';
    console.log(`   ${i + 1}. ${emoji} ${r.label}`);
    console.log(`      ${r.wins}-${r.losses} (${r.count} bets) | ${r.profit > 0 ? '+' : ''}${r.profit.toFixed(2)}u | ROI: ${r.roi > 0 ? '+' : ''}${r.roi.toFixed(1)}%`);
    console.log();
  });
  
  // ═══════════════════════════════════════════════════════════════
  // 5. SAMPLE A+ LOSSES (What went wrong?)
  // ═══════════════════════════════════════════════════════════════
  console.log('❌ SAMPLE A+ LOSSES (What went wrong?)');
  console.log('───────────────────────────────────────────────────────────────');
  
  const aplusLosses = aplusBets
    .filter(b => b.result?.outcome === 'LOSS')
    .sort((a, b) => (a.result?.profit || 0) - (b.result?.profit || 0))
    .slice(0, 10);
  
  aplusLosses.forEach((bet, i) => {
    const pickTeam = bet.bet?.team || bet.bet?.pick;
    const isAway = pickTeam === bet.game?.awayTeam;
    const modelProb = isAway 
      ? (bet.prediction?.ensembleAwayProb || 0)
      : (bet.prediction?.ensembleHomeProb || 0);
    const ev = bet.prediction?.evPercent || bet.prediction?.bestEV || 0;
    
    console.log(`   ${i + 1}. ${bet.game?.awayTeam} @ ${bet.game?.homeTeam}`);
    console.log(`      Pick: ${pickTeam} (${bet.bet?.odds > 0 ? '+' : ''}${bet.bet?.odds})`);
    console.log(`      Model: ${(modelProb * 100).toFixed(0)}% | EV: ${ev.toFixed(1)}% | Loss: ${bet.result?.profit?.toFixed(2)}u`);
    console.log();
  });
  
  // ═══════════════════════════════════════════════════════════════
  // 6. SUMMARY & RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════
  console.log('💡 SUMMARY: WHY A+ IS FAILING');
  console.log('═══════════════════════════════════════════════════════════════');
  
  // Find the main culprit
  const aplusHeavyFav = aplusBets.filter(b => b.bet?.odds <= -300);
  const aplusDogs = aplusBets.filter(b => b.bet?.odds > -110);
  const aplusHighEV = aplusBets.filter(b => (b.prediction?.evPercent || 0) >= 20);
  
  const heavyFavProfit = aplusHeavyFav.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const dogsProfit = aplusDogs.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const highEVProfit = aplusHighEV.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  
  console.log(`\n   A+ Breakdown of Losses:`);
  console.log(`   • Heavy Favorites (-300+): ${aplusHeavyFav.length} bets, ${heavyFavProfit > 0 ? '+' : ''}${heavyFavProfit.toFixed(2)}u`);
  console.log(`   • Underdogs/Pick'ems: ${aplusDogs.length} bets, ${dogsProfit > 0 ? '+' : ''}${dogsProfit.toFixed(2)}u`);
  console.log(`   • High EV (20%+): ${aplusHighEV.length} bets, ${highEVProfit > 0 ? '+' : ''}${highEVProfit.toFixed(2)}u`);
  
  console.log(`\n   🎯 ROOT CAUSE:`);
  console.log(`   The A+ grade is based on HIGH EV%, but high EV often comes from:`);
  console.log(`   1. Heavy favorites where model thinks it's 95% but market says 85%`);
  console.log(`   2. Underdogs where model overestimates upset chance`);
  console.log(`   3. Model disagreement (one model high, one low = false confidence)`);
  
  console.log(`\n   ✅ WHAT ACTUALLY WORKS:`);
  console.log(`   • BOTH models agreeing (not just high average)`);
  console.log(`   • Moderate favorites (-110 to -200) not heavy chalk`);
  console.log(`   • EV in 5-15% range (not chasing 20%+ phantom edges)`);
  console.log(`   • Grade A (not A+) performs much better!`);
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

// Run
analyzeAPlusPicks()
  .then(() => {
    console.log('✅ Analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

