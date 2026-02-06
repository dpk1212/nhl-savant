/**
 * 🏀 PRIME PICKS - Unified Basketball Betting Workflow
 * 
 * ONLY writes to Firebase when a game has BOTH:
 * 1. EV Edge: 90/10 D-Ratings/Haslametrics model finds value (≥3% EV)
 * 2. Spread Confirmation: Both models independently predict covering the spread
 * 
 * Based on analysis (since 1/23/2026):
 * - Prime Picks (EV + Spread): +11.8% ROI, 69% win rate ✅
 * - EV Only: -11.2% ROI (not enough) ❌
 * - Spread Only: -19.5% ROI (not enough) ❌
 * 
 * This script consolidates:
 * - fetchBasketballData.js (data fetching)
 * - fetchSpreadOpportunities.js (spread analysis)
 * - writeBasketballBets.js (EV calculation + Firebase writes)
 * 
 * Usage: npm run fetch-prime-picks
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { parseBarttorvik } from '../src/utils/barttorvik Parser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';
import { loadConfidenceWeights, calculateDynamicUnits } from '../src/utils/dynamicConfidenceUnits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({ 
  apiKey: process.env.FIRECRAWL_API_KEY
});

// Initialize Firebase
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

// Minimum EV threshold for Prime Picks
const MIN_EV_THRESHOLD = 3.0;

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              🏀 PRIME PICKS - Unified Basketball Workflow                     ║');
console.log('║                                                                               ║');
console.log('║  Only writes bets that have BOTH:                                             ║');
console.log('║  ✅ EV Edge (≥3% from 90/10 model)                                            ║');
console.log('║  ✅ Spread Confirmation (both models cover)                                   ║');
console.log('║                                                                               ║');
console.log('║  Historical: +11.8% ROI, 69% win rate                                         ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
console.log('\n');

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`   ⚠️  Retry ${i + 1}: ${error.message}`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

/**
 * Parse spread data from OddsTrader markdown
 */
function parseSpreadData(markdown) {
  const games = [];
  const lines = markdown.split('\n');
  
  const today = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayDay = days[today.getDay()];
  const todayDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const todayDateAlt = `${today.getMonth() + 1}/${today.getDate()}`;
  
  let currentGame = null;
  let isToday = false;
  
  for (const line of lines) {
    const dateMatch = line.match(/(FRI|SAT|SUN|MON|TUE|WED|THU)\s+(\d{1,2}\/\d{1,2})/i);
    if (dateMatch) {
      const dayStr = dateMatch[1].toUpperCase();
      const dateStr = dateMatch[2];
      isToday = dayStr === todayDay && (dateStr === todayDate || dateStr === todayDateAlt);
    }
    
    if (line.includes('|') && line.includes('<br>')) {
      const teamMatch = line.match(/\.(?:png|PNG)\?d=100x100\)<br>([^<]+)<br>(\d{1,2}-\d{1,2})/);
      if (!teamMatch) continue;
      
      let teamName = teamMatch[1].trim();
      teamName = teamName.replace(/^#\d+/, '').trim();
      
      const spreadPatterns = line.match(/([+-]?\d+½?)\s+-?\d{3}/g);
      let spread = null;
      
      if (spreadPatterns && spreadPatterns.length > 0) {
        const spreadStr = spreadPatterns[0].split(/\s/)[0];
        const cleanSpread = spreadStr.replace('½', '.5');
        spread = parseFloat(cleanSpread);
      } else if (line.includes('PK')) {
        spread = 0;
      }
      
      if (!currentGame) {
        currentGame = { 
          awayTeam: teamName, 
          homeTeam: null, 
          awaySpread: spread, 
          homeSpread: null,
          isToday: isToday
        };
      } else if (!currentGame.homeTeam) {
        currentGame.homeTeam = teamName;
        currentGame.homeSpread = spread;
        
        if (currentGame.isToday && currentGame.awayTeam && currentGame.homeTeam) {
          games.push(currentGame);
        }
        currentGame = null;
      }
    }
  }
  
  return games;
}

/**
 * Check if a game has spread confirmation (both models cover)
 */
function checkSpreadConfirmation(game, spreadGames) {
  const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';
  
  // Find matching spread game
  let spreadGame = spreadGames.find(sg => {
    const awayMatch = normalizeTeam(game.awayTeam).includes(normalizeTeam(sg.awayTeam)) ||
                      normalizeTeam(sg.awayTeam).includes(normalizeTeam(game.awayTeam));
    const homeMatch = normalizeTeam(game.homeTeam).includes(normalizeTeam(sg.homeTeam)) ||
                      normalizeTeam(sg.homeTeam).includes(normalizeTeam(game.homeTeam));
    return awayMatch && homeMatch;
  });
  
  if (!spreadGame || !game.dratings || !game.haslametrics) {
    return null;
  }
  
  const dr = game.dratings;
  const hs = game.haslametrics;
  
  // Calculate predicted margins
  const drMargin = dr.awayScore - dr.homeScore;
  const hsMargin = hs.awayScore - hs.homeScore;
  
  // Determine if models agree on winner
  const drPicksAway = drMargin > 0;
  const hsPicksAway = hsMargin > 0;
  const modelsAgree = drPicksAway === hsPicksAway;
  
  if (!modelsAgree) {
    return null;
  }
  
  const pickedTeam = drPicksAway ? 'away' : 'home';
  const pickedTeamName = drPicksAway ? game.awayTeam : game.homeTeam;
  const spread = pickedTeam === 'away' ? spreadGame.awaySpread : spreadGame.homeSpread;
  
  if (spread === null || spread === undefined) return null;
  
  const drPickedMargin = pickedTeam === 'away' ? drMargin : -drMargin;
  const hsPickedMargin = pickedTeam === 'away' ? hsMargin : -hsMargin;
  const blendedMargin = (drPickedMargin * 0.90) + (hsPickedMargin * 0.10);
  
  const drCovers = drPickedMargin > -spread;
  const hsCovers = hsPickedMargin > -spread;
  const blendCovers = blendedMargin > -spread;
  const bothCover = drCovers && hsCovers;
  
  return {
    spreadConfirmed: bothCover,
    spread,
    drCovers,
    hsCovers,
    blendCovers,
    bothCover,
    drMargin: Math.round(drPickedMargin * 10) / 10,
    hsMargin: Math.round(hsPickedMargin * 10) / 10,
    blendedMargin: Math.round(blendedMargin * 10) / 10,
    marginOverSpread: Math.round((blendedMargin - Math.abs(spread)) * 10) / 10,
    pickedTeam: pickedTeamName,
    pickedSide: pickedTeam
  };
}

/**
 * Save Prime Pick to Firebase
 */
async function savePrimePick(db, game, prediction, spreadAnalysis, confidenceWeights) {
  const date = new Date().toISOString().split('T')[0];
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
    console.log(`   🔒 Already exists: ${pickTeam}`);
    return { action: 'skipped', betId };
  }
  
  // Calculate units - base from Kelly + boost for spread confirmation
  const kellyUnits = prediction.unitSize || 2.0;
  const spreadBoost = 0.5; // +0.5u for Prime Pick status
  const totalUnits = Math.min(kellyUnits + spreadBoost, 4.0);
  
  const dynamicResult = calculateDynamicUnits({
    prediction: prediction,
    game: game,
    bet: { odds: prediction.bestOdds, team: prediction.bestTeam }
  }, confidenceWeights);
  
  // Calculate conviction score
  const dr = game.dratings;
  const hs = game.haslametrics;
  let convictionData = null;
  
  if (dr?.awayScore && dr?.homeScore && hs?.awayScore && hs?.homeScore) {
    const pickIsAway = prediction.bestBet === 'away';
    const drMargin = pickIsAway ? (dr.awayScore - dr.homeScore) : (dr.homeScore - dr.awayScore);
    const hsMargin = pickIsAway ? (hs.awayScore - hs.homeScore) : (hs.homeScore - hs.awayScore);
    
    convictionData = {
      convictionScore: Math.round((drMargin + hsMargin) * 10) / 10,
      modelsAgree: true,
      drMargin: Math.round(drMargin * 10) / 10,
      hsMargin: Math.round(hsMargin * 10) / 10
    };
  }
  
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
    
    // 🌟 PRIME PICK: Has BOTH EV edge AND spread confirmation
    spreadAnalysis: {
      spreadConfirmed: true,
      spread: spreadAnalysis.spread,
      drMargin: spreadAnalysis.drMargin,
      hsMargin: spreadAnalysis.hsMargin,
      blendedMargin: spreadAnalysis.blendedMargin,
      marginOverSpread: spreadAnalysis.marginOverSpread,
      drCovers: spreadAnalysis.drCovers,
      hsCovers: spreadAnalysis.hsCovers,
      blendCovers: spreadAnalysis.blendCovers,
      bothModelsCover: spreadAnalysis.bothCover,
      convictionTier: 'MAX' // Prime picks always have max conviction
    },
    
    prediction: {
      evPercent: prediction.bestEV,
      grade: prediction.grade,
      simplifiedGrade: prediction.simplifiedGrade,
      confidence: prediction.confidence,
      
      // Unit sizing with Prime Pick boost
      unitSize: totalUnits,
      baseUnits: kellyUnits,
      spreadBoost: spreadBoost,
      confidenceTier: dynamicResult.tier,
      confidenceScore: dynamicResult.score,
      confidenceFactors: dynamicResult.factors,
      
      bestTeam: prediction.bestTeam,
      bestBet: prediction.bestBet,
      bestOdds: prediction.bestOdds,
      bestEV: prediction.bestEV,
      
      // Spread confirmation flag
      spreadConfirmed: true,
      modelsAgree: true,
      
      // Model probabilities
      ensembleAwayProb: prediction.ensembleAwayProb,
      ensembleHomeProb: prediction.ensembleHomeProb,
      marketAwayProb: prediction.marketAwayProb,
      marketHomeProb: prediction.marketHomeProb,
      
      // Model breakdown
      dratingsAwayProb: prediction.dratingsAwayProb,
      dratingsHomeProb: prediction.dratingsHomeProb,
      dratingsAwayScore: game.dratings?.awayScore || 0,
      dratingsHomeScore: game.dratings?.homeScore || 0,
      haslametricsAwayProb: prediction.haslametricsAwayProb,
      haslametricsHomeProb: prediction.haslametricsHomeProb,
      haslametricsAwayScore: game.haslametrics?.awayScore || 0,
      haslametricsHomeScore: game.haslametrics?.homeScore || 0,
      
      // Ensemble scores
      ensembleAwayScore: prediction.ensembleAwayScore,
      ensembleHomeScore: prediction.ensembleHomeScore,
      ensembleTotal: prediction.ensembleTotal,
      
      // Conviction
      convictionScore: convictionData?.convictionScore || null,
      dratingMargin: convictionData?.drMargin || null,
      haslametricsMargin: convictionData?.hsMargin || null
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
    initialEV: prediction.bestEV,
    source: 'PRIME_PICK', // New source identifier
    
    // 🌟 Prime Pick flag
    savantPick: true, // Prime picks are automatically savantPicks
    
    // Barttorvik data
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  console.log(`   🌟 PRIME PICK: ${pickTeam} ML @ ${prediction.bestOdds}`);
  console.log(`      EV: +${prediction.bestEV.toFixed(1)}% | Spread: ${spreadAnalysis.spread} | ${totalUnits}u`);
  console.log(`      Both models cover: ✅ DR +${spreadAnalysis.drMargin} | HS +${spreadAnalysis.hsMargin}`);
  
  return { action: 'created', betId };
}

/**
 * Main execution
 */
async function fetchPrimePicks() {
  try {
    const cacheBuster = Date.now();
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: FETCH ALL DATA
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 1: FETCHING DATA                                                        │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    // 1a. Fetch moneyline odds
    console.log('📊 Fetching NCAAB moneyline odds from OddsTrader...');
    const oddsResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=money&_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 3000, timeout: 300000 }
      );
    });
    await fs.writeFile(join(__dirname, '../public/basketball_odds.md'), oddsResult.markdown, 'utf8');
    console.log('   ✅ Moneyline odds saved\n');
    
    // 1b. Fetch spread odds
    console.log('📊 Fetching NCAAB spreads from OddsTrader...');
    const spreadResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=spread&_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 3000, timeout: 300000 }
      );
    });
    await fs.writeFile(join(__dirname, '../public/basketball_spreads.md'), spreadResult.markdown, 'utf8');
    console.log('   ✅ Spreads saved\n');
    
    // 1c. Fetch Haslametrics
    console.log('📈 Fetching Haslametrics ratings...');
    const haslaResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://haslametrics.com/?_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 2000, timeout: 300000 }
      );
    });
    await fs.writeFile(join(__dirname, '../public/haslametrics.md'), haslaResult.markdown, 'utf8');
    console.log('   ✅ Haslametrics saved\n');
    
    // 1d. Fetch D-Ratings
    console.log('🎯 Fetching D-Ratings predictions...');
    const drateResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.dratings.com/predictor/ncaa-basketball-predictions/?_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 2000, timeout: 300000 }
      );
    });
    await fs.writeFile(join(__dirname, '../public/dratings.md'), drateResult.markdown, 'utf8');
    console.log('   ✅ D-Ratings saved\n');
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: PARSE AND MATCH DATA
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 2: PARSING AND MATCHING                                                 │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    const oddsData = parseBasketballOdds(oddsResult.markdown);
    const spreadGames = parseSpreadData(spreadResult.markdown);
    const haslaData = parseHaslametrics(haslaResult.markdown);
    const dratePreds = parseDRatings(drateResult.markdown);
    
    // Load Barttorvik and CSV
    const bartMarkdown = await fs.readFile(join(__dirname, '../public/Bart.md'), 'utf8');
    const csvContent = await fs.readFile(join(__dirname, '../public/basketball_teams.csv'), 'utf8');
    const bartData = parseBarttorvik(bartMarkdown);
    
    // Match games
    const matchedGames = matchGamesWithCSV(oddsData, haslaData, dratePreds, bartData, csvContent);
    
    console.log(`   📊 Moneyline games: ${oddsData.length}`);
    console.log(`   📊 Spread games: ${spreadGames.length}`);
    console.log(`   📈 Haslametrics teams: ${haslaData.length}`);
    console.log(`   🎯 D-Ratings predictions: ${dratePreds.length}`);
    console.log(`   ✅ Matched games: ${matchedGames.length}\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: FIND PRIME PICKS
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3: ANALYZING FOR PRIME PICKS                                            │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    // Load confidence weights
    const confidenceWeights = await loadConfidenceWeights();
    const edgeCalculator = new BasketballEdgeCalculator();
    
    const primePicks = [];
    let evEdgeCount = 0;
    let spreadConfirmCount = 0;
    let noModelData = 0;
    let noSpreadData = 0;
    
    for (const game of matchedGames) {
      // Skip games without model data
      if (!game.dratings || !game.haslametrics) {
        noModelData++;
        continue;
      }
      
      // Calculate EV edge
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      
      if (!prediction || prediction.bestEV < MIN_EV_THRESHOLD) {
        continue;
      }
      
      evEdgeCount++;
      
      // Check spread confirmation
      const spreadAnalysis = checkSpreadConfirmation(game, spreadGames);
      
      if (!spreadAnalysis) {
        noSpreadData++;
        continue;
      }
      
      if (!spreadAnalysis.bothCover) {
        continue;
      }
      
      spreadConfirmCount++;
      
      // 🌟 This is a Prime Pick!
      primePicks.push({ game, prediction, spreadAnalysis });
    }
    
    console.log(`   📊 Games analyzed: ${matchedGames.length}`);
    console.log(`   ❌ No model data: ${noModelData}`);
    console.log(`   💰 EV edge found: ${evEdgeCount}`);
    console.log(`   ❌ No spread data: ${noSpreadData}`);
    console.log(`   🌟 PRIME PICKS: ${primePicks.length}\n`);
    
    if (primePicks.length === 0) {
      console.log('⚠️  No Prime Picks found today.');
      console.log('   (Requires BOTH EV edge ≥3% AND both models covering spread)\n');
      return;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: SAVE PRIME PICKS TO FIREBASE
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 4: SAVING PRIME PICKS TO FIREBASE                                       │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    let created = 0;
    let skipped = 0;
    
    for (const { game, prediction, spreadAnalysis } of primePicks) {
      const result = await savePrimePick(db, game, prediction, spreadAnalysis, confidenceWeights);
      if (result.action === 'created') created++;
      else skipped++;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════════════
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                           PRIME PICKS SUMMARY                                 ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`   🌟 Prime Picks Found: ${primePicks.length}`);
    console.log(`   ✅ New bets created: ${created}`);
    console.log(`   🔒 Already existed: ${skipped}`);
    console.log('\n   Criteria for Prime Picks:');
    console.log(`   • EV Edge: ≥${MIN_EV_THRESHOLD}% (90/10 D-Ratings model)`);
    console.log('   • Spread: Both models independently cover');
    console.log('   • Historical: +11.8% ROI, 69% win rate\n');
    
    console.log('   Files updated:');
    console.log('   ✓ public/basketball_odds.md');
    console.log('   ✓ public/basketball_spreads.md');
    console.log('   ✓ public/haslametrics.md');
    console.log('   ✓ public/dratings.md\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    throw error;
  }
}

// Run
fetchPrimePicks()
  .then(() => {
    console.log('🎉 Prime Picks workflow complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
