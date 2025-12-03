/**
 * NHL Dynamic Confidence System
 * Analyzes completed bets to calculate ROI-based weights
 * Updates weights daily as sample size grows
 * Unit Scale: 0.5u to 1.5u
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config
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

// Calculate ROI for a set of bets
function calculateROI(bets) {
  if (bets.length === 0) return { roi: 0, profit: 0, count: 0, winRate: 0 };
  
  const wins = bets.filter(b => b.result?.outcome === 'WIN').length;
  const losses = bets.filter(b => b.result?.outcome === 'LOSS').length;
  const profit = bets.reduce((sum, b) => sum + (b.result?.profit || 0), 0);
  const decidedBets = wins + losses;
  const winRate = decidedBets > 0 ? (wins / decidedBets) * 100 : 0;
  const roi = bets.length > 0 ? (profit / bets.length) * 100 : 0;
  
  return { roi, profit, count: bets.length, wins, losses, winRate };
}

// Convert ROI to a weight using sigmoid function
// Positive ROI = positive weight, Negative ROI = negative weight
function roiToWeight(roi, sampleSize, minSample = 10) {
  // Require minimum sample size for reliability
  if (sampleSize < minSample) return 0;
  
  // Sigmoid function centered at 0, scaled for ROI range
  // ROI of +20% → weight ~0.8
  // ROI of 0% → weight 0
  // ROI of -20% → weight ~-0.8
  const k = 0.05; // Steepness factor
  const weight = 2 / (1 + Math.exp(-k * roi)) - 1;
  
  // Apply sample size confidence factor (more bets = more confident)
  const confidenceFactor = Math.min(1, Math.sqrt(sampleSize / 50));
  
  return weight * confidenceFactor;
}

async function updateNHLDynamicConfidence() {
  console.log('\n🏒 NHL DYNAMIC CONFIDENCE WEIGHT UPDATE');
  console.log('='.repeat(60));
  
  try {
    // Load completed NHL moneyline bets
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'COMPLETED')
    );
    
    const snapshot = await getDocs(q);
    const allBets = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(b => b.bet?.market === 'MONEYLINE');
    
    console.log(`\n📊 Analyzing ${allBets.length} completed moneyline bets...\n`);
    
    const weights = {
      lastUpdated: new Date().toISOString(),
      totalBets: allBets.length,
      factors: {}
    };
    
    // ═══════════════════════════════════════════════════════════════
    // FACTOR 1: RATING
    // ═══════════════════════════════════════════════════════════════
    console.log('📊 Factor 1: Rating');
    weights.factors.rating = {};
    
    ['A+', 'A', 'B+'].forEach(rating => {
      const ratingBets = allBets.filter(b => b.prediction?.rating === rating);
      const stats = calculateROI(ratingBets);
      const weight = roiToWeight(stats.roi, stats.count);
      weights.factors.rating[rating] = {
        weight,
        roi: stats.roi,
        count: stats.count,
        winRate: stats.winRate
      };
      console.log(`   ${rating}: ${stats.count} bets, ${stats.roi.toFixed(1)}% ROI → weight: ${weight.toFixed(3)}`);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // FACTOR 2: ODDS RANGE (Favorite vs Dog)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 Factor 2: Odds Range');
    weights.factors.oddsRange = {};
    
    const oddsRanges = [
      { name: 'heavy_favorite', filter: b => (b.bet?.odds || 0) <= -200 },
      { name: 'moderate_favorite', filter: b => (b.bet?.odds || 0) > -200 && (b.bet?.odds || 0) <= -150 },
      { name: 'slight_favorite', filter: b => (b.bet?.odds || 0) > -150 && (b.bet?.odds || 0) < -100 },
      { name: 'pickem', filter: b => Math.abs(b.bet?.odds || 0) <= 109 || (b.bet?.odds || 0) === -110 },
      { name: 'slight_dog', filter: b => (b.bet?.odds || 0) >= 110 && (b.bet?.odds || 0) < 150 },
      { name: 'moderate_dog', filter: b => (b.bet?.odds || 0) >= 150 && (b.bet?.odds || 0) < 200 },
      { name: 'big_dog', filter: b => (b.bet?.odds || 0) >= 200 }
    ];
    
    oddsRanges.forEach(range => {
      const rangeBets = allBets.filter(range.filter);
      const stats = calculateROI(rangeBets);
      const weight = roiToWeight(stats.roi, stats.count);
      weights.factors.oddsRange[range.name] = {
        weight,
        roi: stats.roi,
        count: stats.count,
        winRate: stats.winRate
      };
      console.log(`   ${range.name}: ${stats.count} bets, ${stats.roi.toFixed(1)}% ROI → weight: ${weight.toFixed(3)}`);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // FACTOR 3: EV% RANGE
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 Factor 3: EV% Range');
    weights.factors.evRange = {};
    
    const evRanges = [
      { name: 'elite', filter: b => (b.prediction?.evPercent || 0) >= 10, label: '10%+' },
      { name: 'strong', filter: b => (b.prediction?.evPercent || 0) >= 5 && (b.prediction?.evPercent || 0) < 10, label: '5-9.9%' },
      { name: 'good', filter: b => (b.prediction?.evPercent || 0) >= 2.5 && (b.prediction?.evPercent || 0) < 5, label: '2.5-4.9%' }
    ];
    
    evRanges.forEach(range => {
      const rangeBets = allBets.filter(range.filter);
      const stats = calculateROI(rangeBets);
      const weight = roiToWeight(stats.roi, stats.count);
      weights.factors.evRange[range.name] = {
        weight,
        roi: stats.roi,
        count: stats.count,
        winRate: stats.winRate,
        label: range.label
      };
      console.log(`   ${range.label}: ${stats.count} bets, ${stats.roi.toFixed(1)}% ROI → weight: ${weight.toFixed(3)}`);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // FACTOR 4: CONFIDENCE LEVEL
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 Factor 4: Confidence Level');
    weights.factors.confidence = {};
    
    ['HIGH', 'MEDIUM', 'LOW'].forEach(level => {
      const levelBets = allBets.filter(b => b.prediction?.confidence === level);
      const stats = calculateROI(levelBets);
      const weight = roiToWeight(stats.roi, stats.count);
      weights.factors.confidence[level] = {
        weight,
        roi: stats.roi,
        count: stats.count,
        winRate: stats.winRate
      };
      console.log(`   ${level}: ${stats.count} bets, ${stats.roi.toFixed(1)}% ROI → weight: ${weight.toFixed(3)}`);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // FACTOR 5: HOME VS AWAY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 Factor 5: Side (Home/Away)');
    weights.factors.side = {};
    
    const homeBets = allBets.filter(b => b.bet?.side === 'HOME');
    const awayBets = allBets.filter(b => b.bet?.side === 'AWAY');
    
    const homeStats = calculateROI(homeBets);
    const awayStats = calculateROI(awayBets);
    
    weights.factors.side.HOME = {
      weight: roiToWeight(homeStats.roi, homeStats.count),
      roi: homeStats.roi,
      count: homeStats.count,
      winRate: homeStats.winRate
    };
    weights.factors.side.AWAY = {
      weight: roiToWeight(awayStats.roi, awayStats.count),
      roi: awayStats.roi,
      count: awayStats.count,
      winRate: awayStats.winRate
    };
    
    console.log(`   HOME: ${homeStats.count} bets, ${homeStats.roi.toFixed(1)}% ROI → weight: ${weights.factors.side.HOME.weight.toFixed(3)}`);
    console.log(`   AWAY: ${awayStats.count} bets, ${awayStats.roi.toFixed(1)}% ROI → weight: ${weights.factors.side.AWAY.weight.toFixed(3)}`);
    
    // ═══════════════════════════════════════════════════════════════
    // FACTOR 6: MODEL PROBABILITY
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📊 Factor 6: Model Probability');
    weights.factors.modelProb = {};
    
    const probRanges = [
      { name: 'very_high', filter: b => (b.prediction?.modelProb || 0) >= 0.70, label: '70%+' },
      { name: 'high', filter: b => (b.prediction?.modelProb || 0) >= 0.60 && (b.prediction?.modelProb || 0) < 0.70, label: '60-69%' },
      { name: 'medium', filter: b => (b.prediction?.modelProb || 0) >= 0.50 && (b.prediction?.modelProb || 0) < 0.60, label: '50-59%' },
      { name: 'low', filter: b => (b.prediction?.modelProb || 0) < 0.50 && (b.prediction?.modelProb || 0) > 0, label: '<50%' }
    ];
    
    probRanges.forEach(range => {
      const rangeBets = allBets.filter(range.filter);
      const stats = calculateROI(rangeBets);
      const weight = roiToWeight(stats.roi, stats.count);
      weights.factors.modelProb[range.name] = {
        weight,
        roi: stats.roi,
        count: stats.count,
        winRate: stats.winRate,
        label: range.label
      };
      console.log(`   ${range.label}: ${stats.count} bets, ${stats.roi.toFixed(1)}% ROI → weight: ${weight.toFixed(3)}`);
    });
    
    // ═══════════════════════════════════════════════════════════════
    // SAVE WEIGHTS TO JSON
    // ═══════════════════════════════════════════════════════════════
    const weightsPath = path.join(__dirname, '../public/nhl_confidence_weights.json');
    await fs.writeFile(weightsPath, JSON.stringify(weights, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Saved weights to: public/nhl_confidence_weights.json`);
    console.log(`📊 Based on ${allBets.length} completed bets`);
    console.log('='.repeat(60));
    
    // Show summary of most impactful factors
    console.log('\n🏆 TOP POSITIVE FACTORS (increase units):');
    const allFactors = [];
    Object.entries(weights.factors).forEach(([factorName, values]) => {
      Object.entries(values).forEach(([key, data]) => {
        if (data.count >= 10) {
          allFactors.push({ name: `${factorName}.${key}`, ...data });
        }
      });
    });
    
    allFactors.sort((a, b) => b.weight - a.weight);
    allFactors.slice(0, 5).forEach(f => {
      console.log(`   ${f.name}: +${(f.weight * 100).toFixed(0)}% weight (${f.roi.toFixed(1)}% ROI, ${f.count} bets)`);
    });
    
    console.log('\n❌ TOP NEGATIVE FACTORS (decrease units):');
    allFactors.slice(-5).reverse().forEach(f => {
      console.log(`   ${f.name}: ${(f.weight * 100).toFixed(0)}% weight (${f.roi.toFixed(1)}% ROI, ${f.count} bets)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

// Run
updateNHLDynamicConfidence().catch(console.error);

