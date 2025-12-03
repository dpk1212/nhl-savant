/**
 * Backtest NHL Dynamic Unit System
 * Compare flat betting vs dynamic confidence-based units
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

// Odds range categorization
function getOddsRange(odds) {
  if (odds <= -200) return 'heavy_favorite';
  if (odds > -200 && odds <= -150) return 'moderate_favorite';
  if (odds > -150 && odds < -100) return 'slight_favorite';
  if (Math.abs(odds) <= 109 || odds === -110) return 'pickem';
  if (odds >= 110 && odds < 150) return 'slight_dog';
  if (odds >= 150 && odds < 200) return 'moderate_dog';
  if (odds >= 200) return 'big_dog';
  return 'pickem';
}

function getEVRange(evPercent) {
  if (evPercent >= 10) return 'elite';
  if (evPercent >= 5) return 'strong';
  if (evPercent >= 2.5) return 'good';
  return 'low';
}

function getModelProbRange(modelProb) {
  if (modelProb >= 0.70) return 'very_high';
  if (modelProb >= 0.60) return 'high';
  if (modelProb >= 0.50) return 'medium';
  return 'low';
}

function calculateDynamicUnits(bet, weights) {
  const rating = bet.prediction?.rating || 'B+';
  const odds = bet.bet?.odds || 0;
  const evPercent = bet.prediction?.evPercent || 0;
  const confidence = bet.prediction?.confidence || 'MEDIUM';
  const side = bet.bet?.side || 'HOME';
  const modelProb = bet.prediction?.modelProb || 0.5;
  
  let score = 0;
  
  // Rating weight
  score += weights.factors?.rating?.[rating]?.weight || 0;
  
  // Odds range weight
  const oddsRange = getOddsRange(odds);
  score += weights.factors?.oddsRange?.[oddsRange]?.weight || 0;
  
  // EV range weight
  const evRange = getEVRange(evPercent);
  score += weights.factors?.evRange?.[evRange]?.weight || 0;
  
  // Confidence weight
  score += weights.factors?.confidence?.[confidence]?.weight || 0;
  
  // Side weight
  score += weights.factors?.side?.[side]?.weight || 0;
  
  // Model prob weight
  const probRange = getModelProbRange(modelProb);
  score += weights.factors?.modelProb?.[probRange]?.weight || 0;
  
  // Normalize and map to 0.5-1.5 scale
  const normalizedScore = Math.max(-1, Math.min(1, score));
  let units = 1.0 + (normalizedScore * 0.5);
  units = Math.max(0.5, Math.min(1.5, units));
  units = Math.round(units * 4) / 4; // Round to 0.25
  
  return { units, score };
}

async function backtestNHLDynamicUnits() {
  console.log('\n🏒 NHL DYNAMIC UNIT SYSTEM BACKTEST');
  console.log('='.repeat(70));
  
  try {
    // Load weights
    const weightsPath = path.join(__dirname, '../public/nhl_confidence_weights.json');
    const weightsJson = await fs.readFile(weightsPath, 'utf8');
    const weights = JSON.parse(weightsJson);
    
    console.log(`📊 Using weights from ${weights.totalBets} analyzed bets\n`);
    
    // Load completed bets
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'COMPLETED')
    );
    
    const snapshot = await getDocs(q);
    const allBets = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(b => b.bet?.market === 'MONEYLINE');
    
    console.log(`📊 Backtesting on ${allBets.length} completed moneyline bets\n`);
    
    // Calculate results
    let flatUnits = 0;
    let flatProfit = 0;
    let dynamicUnits = 0;
    let dynamicProfit = 0;
    
    const tierStats = {
      '1.50u': { bets: 0, profit: 0, wins: 0, losses: 0 },
      '1.25u': { bets: 0, profit: 0, wins: 0, losses: 0 },
      '1.00u': { bets: 0, profit: 0, wins: 0, losses: 0 },
      '0.75u': { bets: 0, profit: 0, wins: 0, losses: 0 },
      '0.50u': { bets: 0, profit: 0, wins: 0, losses: 0 }
    };
    
    allBets.forEach(bet => {
      const result = calculateDynamicUnits(bet, weights);
      const units = result.units;
      const tierKey = `${units.toFixed(2)}u`;
      
      const outcome = bet.result?.outcome;
      const odds = bet.bet?.odds || 0;
      
      // Flat betting (1u per bet)
      flatUnits += 1;
      if (outcome === 'WIN') {
        flatProfit += odds > 0 ? (odds / 100) : (100 / Math.abs(odds));
      } else if (outcome === 'LOSS') {
        flatProfit -= 1;
      }
      
      // Dynamic betting
      dynamicUnits += units;
      let betProfit = 0;
      if (outcome === 'WIN') {
        betProfit = odds > 0 ? units * (odds / 100) : units * (100 / Math.abs(odds));
        if (tierStats[tierKey]) tierStats[tierKey].wins++;
      } else if (outcome === 'LOSS') {
        betProfit = -units;
        if (tierStats[tierKey]) tierStats[tierKey].losses++;
      }
      dynamicProfit += betProfit;
      
      if (tierStats[tierKey]) {
        tierStats[tierKey].bets++;
        tierStats[tierKey].profit += betProfit;
      }
    });
    
    // Results
    console.log('═'.repeat(70));
    console.log('📊 COMPARISON: FLAT vs DYNAMIC BETTING');
    console.log('═'.repeat(70));
    
    console.log('\n💰 FLAT BETTING (1u per bet):');
    console.log(`   Total Units Risked: ${flatUnits.toFixed(2)}u`);
    console.log(`   Total Profit: ${flatProfit >= 0 ? '+' : ''}${flatProfit.toFixed(2)}u`);
    console.log(`   ROI: ${((flatProfit / flatUnits) * 100).toFixed(1)}%`);
    
    console.log('\n🎯 DYNAMIC BETTING (0.5u - 1.5u):');
    console.log(`   Total Units Risked: ${dynamicUnits.toFixed(2)}u`);
    console.log(`   Total Profit: ${dynamicProfit >= 0 ? '+' : ''}${dynamicProfit.toFixed(2)}u`);
    console.log(`   ROI: ${((dynamicProfit / dynamicUnits) * 100).toFixed(1)}%`);
    
    const improvement = dynamicProfit - flatProfit;
    const improvementPct = ((dynamicProfit - flatProfit) / Math.abs(flatProfit)) * 100;
    
    console.log('\n📈 IMPROVEMENT:');
    console.log(`   Profit Difference: ${improvement >= 0 ? '+' : ''}${improvement.toFixed(2)}u`);
    if (flatProfit !== 0) {
      console.log(`   Percentage Improvement: ${improvement >= 0 ? '+' : ''}${improvementPct.toFixed(1)}%`);
    }
    
    // Tier breakdown
    console.log('\n' + '═'.repeat(70));
    console.log('📊 PERFORMANCE BY UNIT SIZE');
    console.log('═'.repeat(70));
    
    Object.entries(tierStats)
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      .forEach(([tier, stats]) => {
        if (stats.bets > 0) {
          const wr = (stats.wins / (stats.wins + stats.losses) * 100) || 0;
          const roi = (stats.profit / (stats.bets * parseFloat(tier))) * 100;
          const indicator = stats.profit >= 0 ? '✅' : '❌';
          console.log(`${indicator} ${tier}: ${stats.bets} bets | ${stats.wins}-${stats.losses} | ${wr.toFixed(1)}% WR | ${stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}u | ${roi >= 0 ? '+' : ''}${roi.toFixed(1)}% ROI`);
        }
      });
    
    // Show what factors are contributing most
    console.log('\n' + '═'.repeat(70));
    console.log('🔬 FACTOR ANALYSIS');
    console.log('═'.repeat(70));
    
    // Analyze high unit bets vs low unit bets
    const highUnitBets = allBets.filter(b => calculateDynamicUnits(b, weights).units >= 1.25);
    const lowUnitBets = allBets.filter(b => calculateDynamicUnits(b, weights).units <= 0.75);
    
    const highWins = highUnitBets.filter(b => b.result?.outcome === 'WIN').length;
    const highLosses = highUnitBets.filter(b => b.result?.outcome === 'LOSS').length;
    const lowWins = lowUnitBets.filter(b => b.result?.outcome === 'WIN').length;
    const lowLosses = lowUnitBets.filter(b => b.result?.outcome === 'LOSS').length;
    
    console.log(`\n🔥 HIGH CONFIDENCE (1.25u+): ${highUnitBets.length} bets, ${((highWins / (highWins + highLosses)) * 100).toFixed(1)}% win rate`);
    console.log(`🔻 LOW CONFIDENCE (0.75u-): ${lowUnitBets.length} bets, ${((lowWins / (lowWins + lowLosses)) * 100).toFixed(1)}% win rate`);
    
    // Show sample of best and worst bets
    console.log('\n' + '═'.repeat(70));
    console.log('🏆 SAMPLE HIGH CONFIDENCE BETS (1.25u+):');
    console.log('═'.repeat(70));
    
    highUnitBets.slice(0, 5).forEach(bet => {
      const result = calculateDynamicUnits(bet, weights);
      const outcome = bet.result?.outcome === 'WIN' ? '✅ WIN' : '❌ LOSS';
      console.log(`   ${result.units}u | ${bet.game?.awayTeam} @ ${bet.game?.homeTeam} | ${bet.bet?.pick} ${bet.bet?.odds} | ${outcome}`);
    });
    
    console.log('\n' + '═'.repeat(70));
    console.log('✅ BACKTEST COMPLETE!');
    console.log('═'.repeat(70));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

// Run
backtestNHLDynamicUnits().catch(console.error);

