/**
 * Basketball Bet Writing Script
 * 
 * Runs via GitHub Actions after fetching basketball data
 * Processes all quality bets (2%+ EV) and writes to Firebase
 * 
 * Usage: npm run write-basketball-bets
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';
import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase CLIENT SDK (uses .env credentials - SAME AS NHL)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials in .env file');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log(`✅ Firebase initialized: ${firebaseConfig.projectId}`);

/**
 * Save a single basketball bet to Firebase
 * Uses Firebase Client SDK with .env credentials
 */
async function saveBetToFirebase(db, game, prediction) {
  const date = new Date().toISOString().split('T')[0];
  
  // Generate deterministic bet ID
  const pickTeam = prediction.bestTeam;
  const side = pickTeam === game.awayTeam ? 'AWAY' : 'HOME';
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const teamNorm = pickTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_MONEYLINE_${teamNorm}_(${side})`;
  
  const betRef = doc(db, 'basketball_bets', betId);
  
  // Check if bet already exists
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    console.log(`   ⏭️  Already exists: ${betId}`);
    return betId;
  }
  
  // Create new bet document
  const betData = {
    id: betId,
    date: date,
    timestamp: Date.now(),
    sport: 'BASKETBALL',
    
    game: {
      awayTeam: game.awayTeam,
      homeTeam: game.homeTeam,
      gameTime: game.odds?.gameTime || 'TBD'
    },
    
    bet: {
      market: 'MONEYLINE',
      pick: prediction.bestTeam,
      odds: prediction.bestOdds,
      team: prediction.bestTeam
    },
    
    prediction: {
      evPercent: prediction.bestEV,
      grade: prediction.grade,
      simplifiedGrade: prediction.simplifiedGrade,
      confidence: prediction.confidence,
      
      // OPTIMIZED UNIT ALLOCATION
      unitSize: prediction.unitSize,
      oddsRange: prediction.oddsRange,
      oddsRangeName: prediction.oddsRangeName,
      historicalROI: prediction.historicalROI,
      qualityEmoji: prediction.qualityEmoji,
      
      ensembleAwayProb: prediction.ensembleAwayProb,
      ensembleHomeProb: prediction.ensembleHomeProb,
      marketAwayProb: prediction.marketAwayProb,
      marketHomeProb: prediction.marketHomeProb,
      
      ensembleAwayScore: prediction.ensembleAwayScore || null,
      ensembleHomeScore: prediction.ensembleHomeScore || null,
      ensembleTotal: prediction.ensembleTotal || null,
      
      dratingsAwayProb: prediction.dratingsAwayProb || null,
      dratingsHomeProb: prediction.dratingsHomeProb || null,
      dratingsAwayScore: prediction.dratingsAwayScore || null,
      dratingsHomeScore: prediction.dratingsHomeScore || null,
      
      haslametricsAwayProb: prediction.haslametricsAwayProb || null,
      haslametricsHomeProb: prediction.haslametricsHomeProb || null,
      haslametricsAwayScore: prediction.haslametricsAwayScore || null,
      haslametricsHomeScore: prediction.haslametricsHomeScore || null
    },
    
    result: {
      awayScore: null,
      homeScore: null,
      totalScore: null,
      winner: null,
      outcome: null,
      profit: null,
      fetched: false,
      fetchedAt: null,
      source: null
    },
    
    status: 'PENDING',
    firstRecommendedAt: Date.now(),
    initialOdds: prediction.bestOdds,
    initialEV: prediction.bestEV
  };
  
  await setDoc(betRef, betData);
  console.log(`   ✅ Saved: ${betId}`);
  console.log(`      ${prediction.bestOdds} (${prediction.oddsRangeName}) | +${prediction.bestEV.toFixed(1)}% EV | Grade: ${prediction.grade} | ${prediction.unitSize}u`);
  
  return betId;
}

async function writeBasketballBets() {
  console.log('\n🏀 BASKETBALL BET WRITING SCRIPT');
  console.log('================================\n');
  
  try {
    // 1. Load scraped data files
    console.log('📂 Loading data files...');
    const oddsMarkdown = await fs.readFile(join(__dirname, '../public/basketball_odds.md'), 'utf8');
    const haslaMarkdown = await fs.readFile(join(__dirname, '../public/haslametrics.md'), 'utf8');
    const drateMarkdown = await fs.readFile(join(__dirname, '../public/dratings.md'), 'utf8');
    const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    
    console.log('✅ Loaded scraped data files');
    
    // 2. Parse data from each source
    console.log('\n🔍 Parsing data from sources...');
    const oddsGames = parseBasketballOdds(oddsMarkdown);
    const haslaData = parseHaslametrics(haslaMarkdown);
    const dratePreds = parseDRatings(drateMarkdown);
    
    console.log(`   📊 OddsTrader: ${oddsGames.length} games`);
    console.log(`   📊 Haslametrics: ${haslaData.games?.length || 0} games`);
    console.log(`   📊 D-Ratings: ${dratePreds.length} predictions`);
    
    // 3. Match games across sources using CSV mappings
    console.log('\n🔗 Matching games across sources...');
    const matchedGames = matchGamesWithCSV(oddsGames, haslaData, dratePreds, csvContent);
    console.log(`   ✅ Matched ${matchedGames.length} games`);
    
    // 4. Calculate ensemble predictions (80% D-Ratings, 20% Haslametrics)
    console.log('\n🧮 Calculating ensemble predictions...');
    const calculator = new BasketballEdgeCalculator();
    const gamesWithPredictions = matchedGames.map(game => {
      const prediction = calculator.calculateEnsemblePrediction(game);
      return { ...game, prediction };
    });
    
    // 5. Filter for valid predictions (pick-to-win strategy)
    const qualityBets = gamesWithPredictions.filter(game => 
      game.prediction && !game.prediction.error
    );
    
    console.log(`\n🎯 Found ${qualityBets.length} picks (pick-to-win strategy):`);
    qualityBets.forEach((game, i) => {
      const pred = game.prediction;
      const winProb = (pred.bestBet === 'away' ? pred.ensembleAwayProb : pred.ensembleHomeProb) * 100;
      console.log(`   ${i + 1}. ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`      Pick: ${pred.bestTeam} ${pred.bestOdds > 0 ? '+' : ''}${pred.bestOdds} (${pred.oddsRangeName})`);
      console.log(`      ${winProb.toFixed(1)}% to win (${pred.bestEV > 0 ? '+' : ''}${pred.bestEV.toFixed(1)}% EV) | Grade: ${pred.grade}`);
      console.log(`      ${pred.qualityEmoji} UNITS: ${pred.unitSize}u (${pred.historicalROI > 0 ? '+' : ''}${pred.historicalROI.toFixed(1)}% historical ROI)`);
    });
    
    if (qualityBets.length === 0) {
      console.log('\n⚠️  No valid picks found today. Nothing to write to Firebase.');
      console.log('================================\n');
      return 0;
    }
    
    // 6. Write bets to Firebase using Admin SDK
    console.log('\n💾 Writing bets to Firebase (basketball_bets collection)...');
    let savedCount = 0;
    let errorCount = 0;
    
    for (const game of qualityBets) {
      try {
        await saveBetToFirebase(db, game, game.prediction);
        savedCount++;
      } catch (error) {
        console.error(`   ❌ Failed to save: ${game.awayTeam} @ ${game.homeTeam}`);
        console.error(`      Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Successfully saved ${savedCount}/${qualityBets.length} bets to Firebase`);
    if (errorCount > 0) {
      console.log(`⚠️  Failed to save ${errorCount} bets (see errors above)`);
    }
    console.log('================================\n');
    
    return savedCount;
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    console.error('\nStack trace:', error.stack);
    console.error('\n================================\n');
    throw error;
  }
}

// Run automatically
writeBasketballBets()
  .then((count) => {
    console.log(`🎉 Script completed successfully! Saved ${count} bets.\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed!');
    process.exit(1);
  });

