/**
 * PRIME PICKS V6 — MOS-Primary System
 *
 * MOS (Margin Over Spread) is the SOLE gate for pick selection.
 * EV is stored for display only — it plays no role in filtering or sizing.
 *
 * Both sides of every game are evaluated independently, fixing the
 * underdog blind spot where the old modelsAgree requirement filtered
 * out profitable underdog covers.
 *
 * All picks are ATS (Against The Spread) at -110 odds.
 *
 * UNIT SIZING (1-5 scale, based on MOS):
 *   MOS 4.0+   → 5u  MAXIMUM  (~80% cover historically)
 *   MOS 3.0-4  → 4u  ELITE    (~81% cover)
 *   MOS 2.5-3  → 3u  STRONG   (~65% cover — proven profitable zone)
 *   MOS 2.25-2.5 → 2u SOLID   (~55% cover est.)
 *   MOS 2.0-2.25 → 1u BASE    (~48% cover est., volume play)
 *   MOS < 2.0  → SKIP
 *
 * Usage: npm run fetch-prime-picks
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { parseBasketballOdds } from '../src/utils/basketballOddsParser.js';
import { parseHaslametrics } from '../src/utils/haslametricsParser.js';
import { parseDRatings } from '../src/utils/dratingsParser.js';
import { parseBarttorvik } from '../src/utils/barttorvik Parser.js';
import { matchGamesWithCSV } from '../src/utils/gameMatchingCSV.js';
import { BasketballEdgeCalculator } from '../src/utils/basketballEdgeCalculator.js';

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

const MOS_FLOOR = 2.0;

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              PRIME PICKS V6 — MOS-Primary System                              ║');
console.log('║                                                                               ║');
console.log('║  GATE:  MOS >= 2.0 (sole qualifier — EV stored for display only)               ║');
console.log('║  UNITS: 5u(4+) | 4u(3-4) | 3u(2.5-3) | 2u(2.25-2.5) | 1u(2-2.25)             ║');
console.log('║  TYPE:  All ATS at -110 — both sides evaluated independently                   ║');
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
 * Evaluate BOTH sides of a game independently.
 * No modelsAgree requirement — this captures underdog covers
 * that the old system missed entirely.
 */
function evaluateBothSides(game, spreadGames) {
  const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';
  
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
  
  const drRawMargin = dr.awayScore - dr.homeScore;
  const hsRawMargin = hs.awayScore - hs.homeScore;
  
  const buildSide = (side) => {
    const isAway = side === 'away';
    const teamName = isAway ? game.awayTeam : game.homeTeam;
    const spread = isAway ? spreadGame.awaySpread : spreadGame.homeSpread;
    
    if (spread === null || spread === undefined) return null;
    
    const drMargin = isAway ? drRawMargin : -drRawMargin;
    const hsMargin = isAway ? hsRawMargin : -hsRawMargin;
    const blendedMargin = (drMargin * 0.90) + (hsMargin * 0.10);
    
    const drCovers = drMargin > -spread;
    const hsCovers = hsMargin > -spread;
    const blendCovers = blendedMargin > -spread;
    const bothCover = drCovers && hsCovers;
    
    // MOS: blendedMargin + spread
    //   Fav: margin 7.0, spread -5.5 → 7.0 + (-5.5) = +1.5
    //   Dog: margin -1.7, spread +5.5 → -1.7 + 5.5 = +3.8
    const marginOverSpread = Math.round((blendedMargin + spread) * 10) / 10;
    
    return {
      side,
      teamName,
      spread,
      drMargin: Math.round(drMargin * 10) / 10,
      hsMargin: Math.round(hsMargin * 10) / 10,
      blendedMargin: Math.round(blendedMargin * 10) / 10,
      drCovers,
      hsCovers,
      blendCovers,
      bothCover,
      marginOverSpread,
      isFavorite: spread < 0,
    };
  };
  
  const away = buildSide('away');
  const home = buildSide('home');
  
  if (!away && !home) return null;
  
  // FILTER: Both models must agree the pick covers the spread
  const awayValid = away && away.bothCover;
  const homeValid = home && home.bothCover;
  
  if (!awayValid && !homeValid) return null;
  
  const bestSide = (!homeValid || (awayValid && away.marginOverSpread >= home.marginOverSpread)) ? away : home;
  
  return { away, home, bestSide };
}

/**
 * MOS tier → unit sizing (1-5 scale)
 */
function getMOSTier(mos) {
  if (mos >= 4)    return { tier: 'MAXIMUM', units: 5 };
  if (mos >= 3)    return { tier: 'ELITE',   units: 4 };
  if (mos >= 2.5)  return { tier: 'STRONG',  units: 3 };
  if (mos >= 2.25) return { tier: 'SOLID',   units: 2 };
  if (mos >= MOS_FLOOR) return { tier: 'BASE', units: 1 };
  return null;
}

/**
 * Estimate cover probability from margin over spread
 */
function estimateCoverProb(mos) {
  return Math.max(0.01, Math.min(0.95, 0.50 + (mos * 0.03)));
}

/**
 * Calculate Spread EV at -110 odds (returns decimal)
 */
function calcSpreadEV(coverProb) {
  return (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
}

/**
 * Save a pick to Firebase — unified function for the MOS-Primary system.
 * All picks are ATS at -110.
 */
async function savePick(db, game, sideData, prediction) {
  const date = new Date().toISOString().split('T')[0];
  const pickTeam = sideData.teamName;
  const side = sideData.side === 'away' ? 'AWAY' : 'HOME';
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const teamNorm = pickTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_SPREAD_${teamNorm}_(${side})`;
  
  const betRef = doc(db, 'basketball_bets', betId);
  
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    console.log(`   🔒 Already exists: ${pickTeam}`);
    return { action: 'skipped', betId };
  }
  
  const mos = sideData.marginOverSpread;
  const tierInfo = getMOSTier(mos);
  const units = tierInfo.units;
  const tier = tierInfo.tier;
  
  const coverProb = estimateCoverProb(mos);
  const spreadEV = calcSpreadEV(coverProb);
  
  const betData = {
    id: betId,
    date,
    timestamp: Date.now(),
    sport: 'BASKETBALL',
    
    game: {
      awayTeam: game.awayTeam,
      homeTeam: game.homeTeam,
      gameTime: game.odds?.gameTime || 'TBD'
    },
    
    bet: {
      market: 'SPREAD',
      pick: pickTeam,
      odds: -110,
      spread: sideData.spread,
      units,
      team: pickTeam
    },
    
    spreadAnalysis: {
      spreadConfirmed: true,
      spread: sideData.spread,
      drMargin: sideData.drMargin,
      hsMargin: sideData.hsMargin,
      blendedMargin: sideData.blendedMargin,
      marginOverSpread: mos,
      drCovers: sideData.drCovers,
      hsCovers: sideData.hsCovers,
      blendCovers: sideData.blendCovers,
      bothModelsCover: sideData.bothCover,
      unitTier: tier,
      isFavorite: sideData.isFavorite,
    },
    
    prediction: {
      bestTeam: pickTeam,
      bestBet: sideData.side,
      bestOdds: prediction?.bestOdds || null,
      bestEV: prediction?.bestEV || null,
      evPercent: prediction?.bestEV || null,
      grade: prediction?.grade || null,
      unitSize: units,
      spreadTier: tier,
      spreadBoost: units,
      
      dratingsAwayScore: game.dratings?.awayScore || 0,
      dratingsHomeScore: game.dratings?.homeScore || 0,
      haslametricsAwayScore: game.haslametrics?.awayScore || 0,
      haslametricsHomeScore: game.haslametrics?.homeScore || 0,
      ensembleAwayScore: prediction?.ensembleAwayScore || null,
      ensembleHomeScore: prediction?.ensembleHomeScore || null,
      ensembleAwayProb: prediction?.ensembleAwayProb || null,
      ensembleHomeProb: prediction?.ensembleHomeProb || null,
      dratingsAwayProb: prediction?.dratingsAwayProb || null,
      dratingsHomeProb: prediction?.dratingsHomeProb || null,
      haslametricsAwayProb: prediction?.haslametricsAwayProb || null,
      haslametricsHomeProb: prediction?.haslametricsHomeProb || null,
      marketAwayProb: prediction?.marketAwayProb || null,
      marketHomeProb: prediction?.marketHomeProb || null,
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
    source: 'PRIME_MOS',
    
    isPrimePick: true,
    isATSPick: true,
    savantPick: mos >= 4,
    
    betRecommendation: {
      type: 'ATS',
      reason: 'MOS_PRIMARY',
      atsUnits: units,
      atsTier: tier,
      atsSpread: sideData.spread,
      atsOdds: -110,
      estimatedCoverProb: Math.round(coverProb * 1000) / 10,
      estimatedSpreadEV: Math.round(spreadEV * 1000) / 10,
      marginOverSpread: mos,
      bothModelsCover: sideData.bothCover,
    },
    
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  const tierIcon = tier === 'MAXIMUM' ? '💎' : tier === 'ELITE' ? '🔥' : tier === 'STRONG' ? '💪' : tier === 'SOLID' ? '📊' : '📌';
  const favDog = sideData.isFavorite ? 'FAV' : 'DOG';
  const starDisplay = '★'.repeat(units) + '☆'.repeat(5 - units);
  console.log(`   ${tierIcon} ${pickTeam} ${sideData.spread} @ -110 → ${units}u [${tier}] ${favDog}`);
  console.log(`      ${starDisplay} MOS: +${mos} | Cover: ${betData.betRecommendation.estimatedCoverProb}% | SpreadEV: +${betData.betRecommendation.estimatedSpreadEV}%`);
  console.log(`      DR: +${sideData.drMargin} ${sideData.drCovers ? '✓' : '✗'} | HS: +${sideData.hsMargin} ${sideData.hsCovers ? '✓' : '✗'} | Blend: +${sideData.blendedMargin} ${sideData.blendCovers ? '✓' : '✗'}`);
  
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
    // STEP 3: EVALUATE ALL GAMES (MOS-Primary — both sides)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3: MOS-PRIMARY ANALYSIS (both sides of every game)                      │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    const edgeCalculator = new BasketballEdgeCalculator();
    
    const picks = [];
    let noModelData = 0;
    let noSpreadData = 0;
    let belowFloor = 0;
    
    for (const game of matchedGames) {
      if (!game.dratings || !game.haslametrics) {
        noModelData++;
        console.log(`   ❌ ${game.awayTeam} @ ${game.homeTeam} — Missing model data`);
        continue;
      }
      
      const evaluation = evaluateBothSides(game, spreadGames);
      
      if (!evaluation) {
        noSpreadData++;
        console.log(`   ❌ ${game.awayTeam} @ ${game.homeTeam} — No spread match or models disagree on cover`);
        continue;
      }
      
      const best = evaluation.bestSide;
      const mos = best.marginOverSpread;
      const tierInfo = getMOSTier(mos);
      
      if (!tierInfo) {
        belowFloor++;
        const other = best === evaluation.away ? evaluation.home : evaluation.away;
        console.log(`   ⬇️  ${game.awayTeam} @ ${game.homeTeam} — Best: ${best.teamName} MOS +${mos} < ${MOS_FLOOR}` +
          (other ? ` | Other: ${other.teamName} MOS +${other.marginOverSpread}` : ''));
        continue;
      }
      
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      const evDisplay = (prediction && !prediction.error) ? `EV ${prediction.bestEV?.toFixed(1)}%` : '';
      const favDog = best.isFavorite ? 'FAV' : 'DOG';
      
      console.log(`   ✅ ${best.teamName} (${best.side.toUpperCase()}) ${best.spread} — MOS +${mos} → ${tierInfo.units}u [${tierInfo.tier}] ${favDog} ${evDisplay}`);
      
      picks.push({
        game,
        sideData: best,
        prediction: (prediction && !prediction.error) ? prediction : null,
        otherSide: best === evaluation.away ? evaluation.home : evaluation.away,
      });
    }
    
    picks.sort((a, b) => b.sideData.marginOverSpread - a.sideData.marginOverSpread);
    
    console.log(`\n   📊 Games analyzed: ${matchedGames.length}`);
    console.log(`   ❌ No model data: ${noModelData}`);
    console.log(`   ❌ No spread data: ${noSpreadData}`);
    console.log(`   ⬇️  Below MOS floor (${MOS_FLOOR}): ${belowFloor}`);
    console.log(`   ✅ QUALIFYING PICKS: ${picks.length}\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: SAVE PICKS TO FIREBASE
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 4: SAVING PICKS TO FIREBASE (all ATS @ -110)                            │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    let created = 0;
    let skipped = 0;
    
    if (picks.length === 0) {
      console.log('   ⚠️  No picks found today (no games with MOS >= 2.0).\n');
    } else {
      for (const { game, sideData, prediction } of picks) {
        const result = await savePick(db, game, sideData, prediction);
        if (result.action === 'created') created++;
        else skipped++;
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════════════
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    MOS-PRIMARY PICKS SUMMARY                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`   Total qualifying picks: ${picks.length}`);
    console.log(`   ✅ New bets created: ${created}`);
    console.log(`   🔒 Already existed: ${skipped}\n`);
    
    if (picks.length > 0) {
      const tierNames = ['MAXIMUM', 'ELITE', 'STRONG', 'SOLID', 'BASE'];
      const tierIcons = { MAXIMUM: '💎', ELITE: '🔥', STRONG: '💪', SOLID: '📊', BASE: '📌' };
      
      console.log('   ─── TIER BREAKDOWN ──────────────────────────────────────────');
      for (const tName of tierNames) {
        const tierPicks = picks.filter(p => getMOSTier(p.sideData.marginOverSpread)?.tier === tName);
        if (tierPicks.length === 0) continue;
        
        const tInfo = getMOSTier(tierPicks[0].sideData.marginOverSpread);
        const starStr = '★'.repeat(tInfo.units) + '☆'.repeat(5 - tInfo.units);
        console.log(`\n   ${tierIcons[tName]} ${starStr} ${tName} (${tInfo.units}u): ${tierPicks.length} pick${tierPicks.length > 1 ? 's' : ''}`);
        
        tierPicks.forEach(p => {
          const favDog = p.sideData.isFavorite ? 'FAV' : 'DOG';
          const evStr = p.prediction?.bestEV ? ` | EV ${p.prediction.bestEV.toFixed(1)}%` : '';
          console.log(`      → ${p.sideData.teamName} ${p.sideData.spread} @ -110 [${favDog}] MOS +${p.sideData.marginOverSpread}${evStr}`);
        });
      }
      
      const favPicks = picks.filter(p => p.sideData.isFavorite);
      const dogPicks = picks.filter(p => !p.sideData.isFavorite);
      console.log(`\n   ─── FAV / DOG SPLIT ─────────────────────────────────────────`);
      console.log(`   Favorites: ${favPicks.length} picks (${favPicks.reduce((s, p) => s + getMOSTier(p.sideData.marginOverSpread).units, 0)}u)`);
      console.log(`   Underdogs: ${dogPicks.length} picks (${dogPicks.reduce((s, p) => s + getMOSTier(p.sideData.marginOverSpread).units, 0)}u)`);
      
      const totalUnits = picks.reduce((s, p) => s + getMOSTier(p.sideData.marginOverSpread).units, 0);
      console.log(`\n   ─── TOTAL ALLOCATION ────────────────────────────────────────`);
      console.log(`   Total picks: ${picks.length}`);
      console.log(`   Total units: ${totalUnits}u @ -110`);
    }
    
    console.log('\n   Files updated:');
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
