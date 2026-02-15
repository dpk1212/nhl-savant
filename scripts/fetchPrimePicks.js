/**
 * 🏀 PRIME PICKS V4 - Data-Driven Basketball Betting Workflow
 * 
 * QUALIFYING FILTERS (all must pass):
 *   1. EV ≥ 3%  — market must be meaningfully mispricing the game
 *   2. MOS ≥ 1.6 — model must see real margin over spread
 *   3. EV 10%+ requires MOS ≥ 2 — skepticism on inflated EV underdogs
 *   4. Spread confirmed — D-Ratings must cover the spread
 *   5. EV + Spread must agree on SAME TEAM
 * 
 * UNIT SIZING (MOS-based, capped at 3u):
 *   ★★★★★ 3.0u — MOS 3+ (historically 79% WR, +5% ROI)
 *   ★★★★  2.5u — MOS 2.5-3
 *   ★★★   2.0u — MOS 2-2.5
 *   ★★    1.5u — MOS 1.6-2
 * 
 * ATS UPGRADE: When MOS ≥ 2, recommend spread bet instead of ML
 *   → ATS units: 3u (MOS 3+), 2.5u (MOS 2.5-3), 2u (MOS 2-2.5)
 * 
 * STANDALONE ATS: SpreadEV 5%+ & MOS ≥ 1.5 (non-Prime games)
 * 
 * Key insight from 1311-bet analysis:
 *   MOS 1.6+ alone = -7% ROI (losing)
 *   EV 3%+ alone = +2% ROI (marginal)
 *   MOS 1.6+ AND EV 3%+ = +8.6% ROI, 67% WR ✅
 *   EV <3% within MOS 1.6+ = -41% ROI ❌ (the cancer we cut)
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
// Raised to 3% — analysis of 1311 bets shows EV <3% within MOS 1.6+ = -41% ROI
const MIN_EV_THRESHOLD = 3.0;

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              🏀 PRIME PICKS V4 - Data-Driven Workflow                          ║');
console.log('║                                                                               ║');
console.log('║  FILTERS: EV ≥ 3% AND MOS ≥ 1.6 (EV 10%+ needs MOS ≥ 2)                      ║');
console.log('║  UNITS:   MOS-based, capped at 3u (3/2.5/2/1.5)                               ║');
console.log('║  ATS:     Upgrade when MOS ≥ 2, Standalone when SpreadEV 5%+                   ║');
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
  
  // Determine conviction tier (same as original workflow)
  // This affects unit sizing, not whether to pick
  let convictionTier = null;
  if (drCovers) { // Base requirement met
    if (bothCover) {
      convictionTier = 'MAX';      // Both models cover - highest conviction (+0.5u)
    } else if (blendCovers) {
      convictionTier = 'BLEND';    // 90/10 blend covers - medium conviction (+0.25u)
    } else {
      convictionTier = 'BASE';     // D-Ratings only covers - base conviction (no boost)
    }
  }
  
  // Original workflow requirement: drCovers && modelsAgree (modelsAgree already checked above)
  return {
    spreadConfirmed: drCovers, // D-Ratings must cover = spread pick eligible
    spread,
    drCovers,
    hsCovers,
    blendCovers,
    bothCover,
    convictionTier, // MAX, BLEND, or BASE - for unit sizing
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
  
  // ═══════════════════════════════════════════════════════════════
  // PRIME PICKS UNIT SIZING V4 — MOS-BASED, CAPPED AT 3u
  // 
  // Analysis of 1311 bets: MOS is the only reliable sizing signal.
  // Old EV-based component was noisy and inverted. Simplified to
  // pure MOS tiers. ★★★ (2.5-3u) was the only profitable star
  // rating — now it's the ceiling.
  //
  // ★★★★★ 3.0u — MOS 3+   (79% WR, +5% ROI historically)
  // ★★★★  2.5u — MOS 2.5-3
  // ★★★   2.0u — MOS 2-2.5
  // ★★    1.5u — MOS 1.6-2
  // ═══════════════════════════════════════════════════════════════
  const ev = prediction.bestEV || 0;
  const marginOverSpread = spreadAnalysis.marginOverSpread || 0;
  const bothCover = spreadAnalysis.bothCover || false;
  
  let totalUnits;
  let spreadTier;
  if (marginOverSpread >= 3) {
    totalUnits = 3;
    spreadTier = 'MAX';      // ★★★★★ — wide margin, historically 79% WR
  } else if (marginOverSpread >= 2.5) {
    totalUnits = 2.5;
    spreadTier = 'STRONG';   // ★★★★ — solid margin
  } else if (marginOverSpread >= 2) {
    totalUnits = 2;
    spreadTier = 'SOLID';    // ★★★ — comfortable margin
  } else {
    totalUnits = 1.5;
    spreadTier = 'BASE';     // ★★ — qualifying margin (MOS 1.6-2)
  }
  
  // Legacy: still compute dynamic result for tracking/display purposes
  const dynamicResult = calculateDynamicUnits({
    prediction: prediction,
    game: game,
    bet: { odds: prediction.bestOdds, team: prediction.bestTeam }
  }, confidenceWeights);
  
  // Spread boost for backward compat (stored in Firebase for filtering)
  const spreadBoost = spreadUnits; // Now 1-2 instead of 0-0.5
  
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
  
  // ═══════════════════════════════════════════════════════════════
  // BET RECOMMENDATION V4 — ML vs ATS UPGRADE (capped at 3u)
  //
  // Trigger: MOS >= 2 → recommend ATS instead of ML
  // ATS units mirror the MOS-based tiers (capped at 3u):
  //   MAX    (3u):   MOS 3+
  //   STRONG (2.5u): MOS 2.5-3
  //   SOLID  (2u):   MOS 2-2.5
  // ═══════════════════════════════════════════════════════════════
  const mlOdds = prediction.bestOdds;
  const mos = marginOverSpread;
  const shouldUpgradeATS = mos >= 2;
  
  let betRecommendation;
  if (shouldUpgradeATS) {
    let atsTier, atsUnits;
    if (mos >= 3) {
      atsTier = 'MAX';
      atsUnits = 3;
    } else if (mos >= 2.5) {
      atsTier = 'STRONG';
      atsUnits = 2.5;
    } else {
      atsTier = 'SOLID';
      atsUnits = 2;
    }
    
    const atsCoverProb = Math.min(0.95, 0.50 + (mos * 0.03));
    const atsSpreadEV = (atsCoverProb * (100 / 110)) - ((1 - atsCoverProb) * 1);
    
    betRecommendation = {
      type: 'ATS',
      reason: 'MOS_UPGRADE',
      atsUnits,
      atsTier,
      atsSpread: spreadAnalysis.spread,
      atsOdds: -110,
      estimatedCoverProb: Math.round(atsCoverProb * 1000) / 10,
      estimatedSpreadEV: Math.round(atsSpreadEV * 1000) / 10,
      marginOverSpread: mos,
      bothModelsCover: bothCover,
      mlOdds: mlOdds,
      mlUnits: totalUnits,
    };
  } else {
    betRecommendation = {
      type: 'ML',
      reason: 'ML_PREFERRED',
      mlUnits: totalUnits,
      mlOdds: mlOdds,
      marginOverSpread: mos,
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
      convictionTier: spreadAnalysis.convictionTier // MAX, BLEND, or BASE
    },
    
    prediction: {
      evPercent: prediction.bestEV,
      grade: prediction.grade,
      simplifiedGrade: prediction.simplifiedGrade,
      confidence: prediction.confidence,
      
      // PRIME V4 UNIT SIZING: MOS-based, capped at 3u
      // ★★★★★ 3u (MOS 3+), ★★★★ 2.5u (MOS 2.5-3), ★★★ 2u (MOS 2-2.5), ★★ 1.5u (MOS 1.6-2)
      unitSize: totalUnits,
      spreadTier: spreadTier,
      spreadBoost: totalUnits, // backward compat for Prime filter
      
      // Legacy dynamic confidence (for tracking, not used for sizing)
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
    savantPick: totalUnits >= 3, // Savant badge reserved for top-tier picks (MOS 3+, 3u)
    isPrimePick: true,
    isATSPick: shouldUpgradeATS,
    
    // ═══════════════════════════════════════════════════════════════
    // BET RECOMMENDATION — ML vs ATS
    // Tells the UI and user which bet type to follow
    // ═══════════════════════════════════════════════════════════════
    betRecommendation,
    
    // ═══════════════════════════════════════════════════════════════
    // 🎯 SPREAD BET RECOMMENDATION (v2 — with EV sweet spot)
    // Historical analysis (138 bets since 1/23):
    //   MOS 2+: 68% cover rate, +30.2% ROI
    //   MOS 3+: 80% cover rate, +52.7% ROI
    //   MOS <2: 44% cover rate, -15.6% ROI (AVOID)
    //
    // 🔑 KEY INSIGHT — ML EV SWEET SPOT:
    //   EV 2-3%: 67% ATS, +27.3% ROI (market agrees → safe covers)
    //   EV 3-5%: 91% ATS, +73.6% ROI (sweet spot!)
    //   EV 5-10%: 30% ATS, -42.7% ROI (TRAP — too much variance)
    //   EV 10%+: 71% ATS, +36.4% ROI (big dogs that cover)
    //
    // Filter: MOS ≥ 2 AND NOT in the 5-10% EV danger zone
    // ═══════════════════════════════════════════════════════════════
    spreadBet: (() => {
      const mos = marginOverSpread;
      const mlEV = ev; // from prediction.bestEV
      
      // Primary filter: model must predict 2+ pts over spread
      // Historical: MOS 2+ = 68% ATS, +30.2% ROI (22 bets)
      //             MOS 3+ = 80% ATS, +52.7% ROI (5 bets)
      if (mos < 2) return { recommended: false, reason: 'MOS_TOO_LOW' };
      
      // EV zone classification (ML EV from moneyline odds)
      // Sweet spot: 2-5% ML EV → 67-91% ATS (market agrees, reliable covers)
      // Caution: 5-10% ML EV → 30% ATS in sample (n=10, small but noteworthy)
      // NOTE: EV zones are INFORMATIONAL, not hard blockers
      //       MOS ≥ 2 is the primary proven filter
      const inSweetSpot = mlEV >= 2 && mlEV < 5;
      const inCautionZone = mlEV >= 5 && mlEV < 10;
      
      // Estimate cover probability: ~50% baseline + 3% per point of edge
      const coverProb = Math.min(0.95, 0.50 + (mos * 0.03));
      // EV at -110: (coverProb * 100/110) - ((1 - coverProb) * 1)
      const spreadEV = (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
      
      // Tier and unit sizing — MOS is primary, EV zones adjust sizing
      let spreadBetTier, spreadBetUnits;
      if (mos >= 3 && bothCover) {
        spreadBetTier = 'ELITE';     // 80%+ cover, +52.7% ROI historically
        spreadBetUnits = 2;
      } else if (mos >= 3) {
        spreadBetTier = 'STRONG';    // 80% cover rate
        spreadBetUnits = 1.5;
      } else if (inSweetSpot) {
        spreadBetTier = 'PRIME';     // MOS 2+ AND EV sweet spot = best combo
        spreadBetUnits = 1.5;
      } else if (inCautionZone) {
        spreadBetTier = 'CAUTION';   // MOS 2+ but volatile EV zone — reduce size
        spreadBetUnits = 0.5;        // Still recommend but at reduced size
      } else {
        spreadBetTier = 'SOLID';     // 68% cover, +30.2% ROI
        spreadBetUnits = 1;
      }
      
      return {
        recommended: true,           // Always recommend when MOS ≥ 2
        spread: spreadAnalysis.spread,
        marginOverSpread: mos,
        tier: spreadBetTier,
        units: spreadBetUnits,
        estimatedCoverProb: Math.round(coverProb * 1000) / 10,
        estimatedSpreadEV: Math.round(spreadEV * 1000) / 10,
        bothModelsCover: bothCover,
        mlEV: Math.round(mlEV * 10) / 10,
        inSweetSpot,
        inCautionZone,
        standardOdds: -110,
      };
    })(),
    
    // Barttorvik data
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  const evIcon = evTier === 'HIGH' ? '🔥' : '📊';
  const spreadIcon = spreadTier === 'MAX' ? '🎯' : spreadTier === 'STRONG' ? '💎' : spreadTier === 'SOLID' ? '💪' : '📊';
  
  // Show bet recommendation prominently
  const starRating = totalUnits >= 3 ? '★★★★★' : totalUnits >= 2.5 ? '★★★★' : totalUnits >= 2 ? '★★★' : '★★';
  if (betRecommendation.type === 'ATS') {
    console.log(`   🌟 PRIME PICK → ATS: ${pickTeam} ${spreadAnalysis.spread} @ -110`);
    console.log(`      ┌─ ${starRating} ${betRecommendation.atsUnits}u ATS [${betRecommendation.atsTier}] (MOS +${mos})`);
    console.log(`      ├─ Cover: ${betRecommendation.estimatedCoverProb}% | SpreadEV: +${betRecommendation.estimatedSpreadEV}%`);
    console.log(`      ├─ ML ref: ${totalUnits}u @ ${prediction.bestOdds} (+${prediction.bestEV.toFixed(1)}% EV)`);
  } else {
    console.log(`   🌟 PRIME PICK: ${pickTeam} ML @ ${prediction.bestOdds}`);
    console.log(`      ┌─ ${starRating} ${totalUnits}u ML [${spreadTier}]`);
    console.log(`      ├─ EV: +${prediction.bestEV.toFixed(1)}% | MOS: +${mos}`);
  }
  console.log(`      ├─ Line: ${spreadAnalysis.spread} | DR +${spreadAnalysis.drMargin} ${spreadAnalysis.drCovers ? '✓' : '✗'} | HS +${spreadAnalysis.hsMargin} ${spreadAnalysis.hsCovers ? '✓' : '✗'} | Blend +${spreadAnalysis.blendedMargin}`);
  console.log(`      └─ Grade: ${prediction.grade} | Odds: ${prediction.bestOdds}`);
  
  return { action: 'created', betId, betRecommendation };
}

/**
 * Estimate cover probability from margin over spread
 * Each point of predicted edge ≈ 3% above 50% baseline
 */
function estimateCoverProb(mos) {
  return Math.max(0.01, Math.min(0.95, 0.50 + (mos * 0.03)));
}

/**
 * Calculate Spread EV at -110 odds
 * Returns as decimal (multiply by 100 for percentage)
 */
function calcSpreadEV(coverProb) {
  return (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
}

/**
 * Save Standalone ATS Pick to Firebase
 * For games that qualify via SpreadEV 5%+ but are NOT Prime Picks
 */
async function saveATSPick(db, game, spreadAnalysis, prediction) {
  const date = new Date().toISOString().split('T')[0];
  const pickTeam = spreadAnalysis.pickedTeam;
  const side = spreadAnalysis.pickedSide === 'away' ? 'AWAY' : 'HOME';
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const teamNorm = pickTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_SPREAD_${teamNorm}_(${side})`;
  
  const betRef = doc(db, 'basketball_bets', betId);
  
  // Check if bet already exists
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    console.log(`   🔒 Already exists: ${pickTeam} ATS`);
    return { action: 'skipped', betId };
  }
  
  const mos = spreadAnalysis.marginOverSpread || 0;
  const bothCover = spreadAnalysis.bothCover || false;
  
  // ═══════════════════════════════════════════════════════════════
  // STANDALONE ATS UNIT SIZING
  // Historical (non-Prime SpreadEV 5%+): 9-2 ATS, 81.8%, +56.2% ROI
  //   HIGH (2u):  MOS 3+ — dominant margin even without ML EV
  //   MID  (1.5u): MOS 2-3 — solid margin, strong SpreadEV
  //   BASE (1u):  MOS 1.5-2 — minimum qualifying, still SpreadEV 5%+
  // ═══════════════════════════════════════════════════════════════
  let atsTier, atsUnits;
  if (mos >= 3) {
    atsTier = 'HIGH';
    atsUnits = 2;
  } else if (mos >= 2) {
    atsTier = 'MID';
    atsUnits = 1.5;
  } else {
    atsTier = 'BASE';
    atsUnits = 1;
  }
  
  const coverProb = estimateCoverProb(mos);
  const spreadEV = calcSpreadEV(coverProb);
  
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
      market: 'SPREAD',
      pick: pickTeam,
      odds: -110,
      spread: spreadAnalysis.spread,
      team: pickTeam
    },
    
    spreadAnalysis: {
      spreadConfirmed: spreadAnalysis.spreadConfirmed || false,
      spread: spreadAnalysis.spread,
      drMargin: spreadAnalysis.drMargin,
      hsMargin: spreadAnalysis.hsMargin,
      blendedMargin: spreadAnalysis.blendedMargin,
      marginOverSpread: spreadAnalysis.marginOverSpread,
      drCovers: spreadAnalysis.drCovers,
      hsCovers: spreadAnalysis.hsCovers,
      blendCovers: spreadAnalysis.blendCovers,
      bothModelsCover: spreadAnalysis.bothCover,
      convictionTier: spreadAnalysis.convictionTier
    },
    
    prediction: {
      bestTeam: pickTeam,
      bestBet: spreadAnalysis.pickedSide,
      bestOdds: prediction?.bestOdds || null,
      bestEV: prediction?.bestEV || null,
      evPercent: prediction?.bestEV || null,
      grade: prediction?.grade || null,
      unitSize: atsUnits,
      
      // Model scores (always available via game.dratings/haslametrics)
      dratingsAwayScore: game.dratings?.awayScore || 0,
      dratingsHomeScore: game.dratings?.homeScore || 0,
      haslametricsAwayScore: game.haslametrics?.awayScore || 0,
      haslametricsHomeScore: game.haslametrics?.homeScore || 0,
      ensembleAwayScore: prediction?.ensembleAwayScore || null,
      ensembleHomeScore: prediction?.ensembleHomeScore || null,
      ensembleAwayProb: prediction?.ensembleAwayProb || null,
      ensembleHomeProb: prediction?.ensembleHomeProb || null,
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
    source: 'ATS_SPREAD_EV',
    
    // Segment flags
    isPrimePick: false,
    isATSPick: true,
    savantPick: false,
    atsSegment: 'SPREAD_EV_5_PLUS',
    
    // ATS recommendation details
    betRecommendation: {
      type: 'ATS',
      reason: 'SPREAD_EV_STANDALONE',
      atsUnits,
      atsTier,
      atsSpread: spreadAnalysis.spread,
      atsOdds: -110,
      estimatedCoverProb: Math.round(coverProb * 1000) / 10,
      estimatedSpreadEV: Math.round(spreadEV * 1000) / 10,
      marginOverSpread: mos,
      bothModelsCover: bothCover,
    },
    
    // Barttorvik data
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  const tierIcon = atsTier === 'HIGH' ? '🔥' : atsTier === 'MID' ? '💪' : '📊';
  console.log(`   ${tierIcon} ATS PICK: ${pickTeam} ${spreadAnalysis.spread} @ -110 → ${atsUnits}u [${atsTier}]`);
  console.log(`      MOS: +${mos} | Cover: ${betData.betRecommendation.estimatedCoverProb}% | SpreadEV: +${betData.betRecommendation.estimatedSpreadEV}%`);
  
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
    let spreadOppsCount = 0;
    let evOnlyCount = 0;
    let spreadOnlyCount = 0;
    let noModelData = 0;
    
    // Track EV picks and Spread picks separately, then find intersection
    const evPicks = new Map(); // game key -> { game, prediction, evPickedSide }
    const spreadPicks = new Map(); // game key -> { game, spreadAnalysis, spreadPickedSide }
    const allGameSpreadData = new Map(); // ALL games with spread data — for standalone ATS screening
    
    console.log(`\n   ─────────────────────────────────────────────────────────────────`);
    console.log(`   GAME-BY-GAME ANALYSIS:`);
    console.log(`   ─────────────────────────────────────────────────────────────────\n`);
    
    for (const game of matchedGames) {
      if (!game.dratings || !game.haslametrics) {
        noModelData++;
        console.log(`   ❌ ${game.awayTeam} @ ${game.homeTeam} - Missing model data`);
        continue;
      }
      
      const gameKey = `${game.awayTeam}_${game.homeTeam}`;
      
      // ═══════════════════════════════════════════════════════════════
      // STEP A: Would the OLD EV workflow pick this game?
      // ═══════════════════════════════════════════════════════════════
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      let evStatus = '❌ No EV edge';
      let evDetail = '';
      
      if (prediction && !prediction.error) {
        if (prediction.bestEV >= MIN_EV_THRESHOLD) {
          evEdgeCount++;
          evPicks.set(gameKey, {
            game,
            prediction,
            evPickedSide: prediction.bestBet,
            evPickedTeam: prediction.bestTeam
          });
          evStatus = `✅ EV picks ${prediction.bestBet.toUpperCase()}`;
          evDetail = `${prediction.bestTeam} @ ${prediction.bestOdds} (+${prediction.bestEV.toFixed(1)}% EV)`;
        } else {
          evStatus = `❌ EV too low`;
          evDetail = `Best: ${prediction.bestTeam} +${prediction.bestEV.toFixed(1)}% (need ≥${MIN_EV_THRESHOLD}%)`;
        }
      } else {
        evDetail = prediction?.error || 'No prediction';
      }
      
      // ═══════════════════════════════════════════════════════════════
      // STEP B: Would the OLD Spread workflow pick this game?
      // ═══════════════════════════════════════════════════════════════
      const spreadAnalysis = checkSpreadConfirmation(game, spreadGames);
      let spreadStatus = '❌ No spread confirmation';
      let spreadDetail = '';
      
      if (spreadAnalysis) {
        // spreadConfirmed = drCovers (D-Ratings covers = base requirement, matches old workflow)
        if (spreadAnalysis.spreadConfirmed) {
          spreadOppsCount++;
          spreadPicks.set(gameKey, {
            game,
            spreadAnalysis,
            spreadPickedSide: spreadAnalysis.pickedSide,
            spreadPickedTeam: spreadAnalysis.pickedTeam
          });
          const tierEmoji = spreadAnalysis.convictionTier === 'MAX' ? '🎯' : spreadAnalysis.convictionTier === 'BLEND' ? '💎' : '📊';
          spreadStatus = `✅ Spread picks ${spreadAnalysis.pickedSide.toUpperCase()} [${spreadAnalysis.convictionTier}]`;
          spreadDetail = `${spreadAnalysis.pickedTeam} (spread ${spreadAnalysis.spread}) DR:${spreadAnalysis.drCovers?'✓':'✗'}+${spreadAnalysis.drMargin} HS:${spreadAnalysis.hsCovers?'✓':'✗'}+${spreadAnalysis.hsMargin} Blend:${spreadAnalysis.blendCovers?'✓':'✗'}+${spreadAnalysis.blendedMargin}`;
        } else {
          spreadStatus = `❌ D-Ratings doesn't cover spread`;
          spreadDetail = `DR margin +${spreadAnalysis.drMargin} vs spread ${spreadAnalysis.spread}`;
        }
      } else {
        spreadDetail = 'No spread data or models disagree on winner';
      }
      
      // Store ALL games with spread analysis for standalone ATS screening
      if (spreadAnalysis) {
        allGameSpreadData.set(gameKey, {
          game,
          spreadAnalysis,
          prediction: (prediction && !prediction.error) ? prediction : null
        });
      }
      
      // Log the game
      console.log(`   📍 ${game.awayTeam} @ ${game.homeTeam}`);
      console.log(`      EV:     ${evStatus}`);
      if (evDetail) console.log(`              ${evDetail}`);
      console.log(`      Spread: ${spreadStatus}`);
      if (spreadDetail) console.log(`              ${spreadDetail}`);
      console.log();
    }
    
    console.log(`   ─────────────────────────────────────────────────────────────────\n`);
    
    // ═══════════════════════════════════════════════════════════════
    // STEP C: Find INTERSECTION - games where BOTH picked SAME TEAM
    // This is what created Prime Picks in the old flow
    // ═══════════════════════════════════════════════════════════════
    console.log(`   ─────────────────────────────────────────────────────────────────`);
    console.log(`   FINDING INTERSECTION (EV + Spread = Prime Picks):`);
    console.log(`   ─────────────────────────────────────────────────────────────────\n`);
    
    // Show all EV picks
    console.log(`   💰 EV PICKS (${evPicks.size}):`);
    for (const [gameKey, evData] of evPicks) {
      console.log(`      • ${evData.evPickedTeam} (${evData.evPickedSide}) @ +${evData.prediction.bestEV.toFixed(1)}% EV`);
    }
    if (evPicks.size === 0) console.log(`      (none)`);
    
    // Show all Spread picks
    console.log(`\n   📈 SPREAD PICKS (${spreadPicks.size}):`);
    for (const [gameKey, spreadData] of spreadPicks) {
      console.log(`      • ${spreadData.spreadPickedTeam} (${spreadData.spreadPickedSide}) - both models cover spread ${spreadData.spreadAnalysis.spread}`);
    }
    if (spreadPicks.size === 0) console.log(`      (none)`);
    
    console.log(`\n   🔍 MATCHING:`);
    
    for (const [gameKey, evData] of evPicks) {
      const spreadData = spreadPicks.get(gameKey);
      
      if (!spreadData) {
        // EV picked this game, Spread did not → EV Only (losing segment, skip)
        evOnlyCount++;
        console.log(`      ❌ ${evData.evPickedTeam}: EV picked, Spread did NOT pick → EV Only (skip)`);
        continue;
      }
      
      // Both workflows picked this game - but do they agree on the TEAM?
      if (evData.evPickedSide !== spreadData.spreadPickedSide) {
        // EV picked one team, Spread picked other → Both lose separately, skip
        evOnlyCount++;
        console.log(`      ❌ ${gameKey}: EV picks ${evData.evPickedSide.toUpperCase()} (${evData.evPickedTeam}), Spread picks ${spreadData.spreadPickedSide.toUpperCase()} (${spreadData.spreadPickedTeam}) → MISMATCH (skip)`);
        continue;
      }
      
      // Both workflows agree — now apply V4 quality gates
      const mos = spreadData.spreadAnalysis.marginOverSpread || 0;
      const ev = evData.prediction.bestEV || 0;
      
      // GATE 1: MOS must be ≥ 1.6 (analysis: below 1.6 = -41% ROI even with EV 3%+)
      if (mos < 1.6) {
        console.log(`      ⛔ ${evData.evPickedTeam}: EV ✓ Spread ✓ but MOS ${mos} < 1.6 → FILTERED OUT`);
        evOnlyCount++;
        continue;
      }
      
      // GATE 2: EV 10%+ requires MOS ≥ 2 (inflated EV skepticism)
      if (ev >= 10 && mos < 2) {
        console.log(`      ⛔ ${evData.evPickedTeam}: EV ${ev.toFixed(1)}% ≥ 10% but MOS ${mos} < 2 → FILTERED OUT`);
        evOnlyCount++;
        continue;
      }
      
      // 🌟 PRIME PICK: Passes all V4 quality gates
      console.log(`      🌟 ${evData.evPickedTeam}: EV +${ev.toFixed(1)}% ✓ MOS +${mos} ✓ → PRIME PICK!`);
      primePicks.push({
        game: evData.game,
        prediction: evData.prediction,
        spreadAnalysis: spreadData.spreadAnalysis
      });
    }
    
    // Count spread-only (spread picked but EV didn't)
    for (const [gameKey, spreadData] of spreadPicks) {
      if (!evPicks.has(gameKey)) {
        spreadOnlyCount++;
        console.log(`      ❌ ${spreadData.spreadPickedTeam}: Spread picked, EV did NOT pick → Spread Only (skip)`);
      }
    }
    
    console.log();
    
    console.log(`   📊 Games analyzed: ${matchedGames.length}`);
    console.log(`   ❌ No model data: ${noModelData}`);
    console.log(`\n   OLD WORKFLOW WOULD HAVE CREATED:`);
    console.log(`   💰 EV picks: ${evEdgeCount}`);
    console.log(`   📈 Spread picks: ${spreadOppsCount}`);
    console.log(`\n   SEGMENT BREAKDOWN:`);
    console.log(`   ❌ EV Only (skip): ${evOnlyCount} (-11.2% ROI historically)`);
    console.log(`   ❌ Spread Only (skip): ${spreadOnlyCount} (-19.5% ROI historically)`);
    console.log(`   🌟 PRIME PICKS: ${primePicks.length} (+11.8% ROI historically)\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: SAVE PRIME PICKS TO FIREBASE
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 4: SAVING PRIME PICKS TO FIREBASE                                       │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    let created = 0;
    let skipped = 0;
    const savedRecommendations = []; // Track bet recommendations for summary
    
    if (primePicks.length === 0) {
      console.log('   ⚠️  No Prime Picks found today.');
      console.log('   (Requires EV workflow AND Spread workflow to pick SAME team)\n');
    } else {
      // Sort by blend margin over spread (largest first) for easier scanning
      primePicks.sort((a, b) => (b.spreadAnalysis.marginOverSpread || 0) - (a.spreadAnalysis.marginOverSpread || 0));
      
      for (const { game, prediction, spreadAnalysis } of primePicks) {
        const result = await savePrimePick(db, game, prediction, spreadAnalysis, confidenceWeights);
        if (result.action === 'created') {
          created++;
          if (result.betRecommendation) savedRecommendations.push(result.betRecommendation);
        } else {
          skipped++;
        }
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 5: FIND STANDALONE ATS PICKS (SpreadEV 5%+ segment)
    // Games with strong spread edge that DIDN'T qualify as Prime Picks
    // Historical: Non-Prime SpreadEV 5%+ = 9-2 ATS, 81.8% cover, +56.2% ROI
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 5: SCANNING FOR STANDALONE ATS PICKS (SpreadEV 5%+)                     │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    // Build set of Prime Pick game keys to exclude
    const primePickKeys = new Set(primePicks.map(p => `${p.game.awayTeam}_${p.game.homeTeam}`));
    
    const standaloneATSPicks = [];
    let atsScanned = 0;
    let atsSkippedPrime = 0;
    let atsSkippedLowMOS = 0;
    let atsSkippedLowEV = 0;
    
    for (const [gameKey, data] of allGameSpreadData) {
      atsScanned++;
      
      // Skip games that are already Prime Picks
      if (primePickKeys.has(gameKey)) {
        atsSkippedPrime++;
        continue;
      }
      
      const { game, spreadAnalysis, prediction } = data;
      const mos = spreadAnalysis.marginOverSpread || 0;
      
      // MOS >= 1.6 minimum (V4 — analysis shows 1.6 is the profitable cutoff)
      if (mos < 1.6) {
        atsSkippedLowMOS++;
        continue;
      }
      
      // Calculate SpreadEV
      const coverProb = estimateCoverProb(mos);
      const spreadEV = calcSpreadEV(coverProb);
      const spreadEVPct = spreadEV * 100;
      
      // SpreadEV must be >= 5%
      if (spreadEVPct < 5) {
        atsSkippedLowEV++;
        continue;
      }
      
      console.log(`   ✅ ${spreadAnalysis.pickedTeam}: MOS +${mos} | SpreadEV +${spreadEVPct.toFixed(1)}% | Spread ${spreadAnalysis.spread}`);
      standaloneATSPicks.push(data);
    }
    
    console.log(`\n   📊 Scanned: ${atsScanned} games with spread data`);
    console.log(`   🌟 Already Prime Picks: ${atsSkippedPrime}`);
    console.log(`   ❌ MOS < 1.6: ${atsSkippedLowMOS}`);
    console.log(`   ❌ SpreadEV < 5%: ${atsSkippedLowEV}`);
    console.log(`   ✅ Standalone ATS Qualifying: ${standaloneATSPicks.length}\n`);
    
    let atsCreated = 0;
    let atsSkipped = 0;
    
    if (standaloneATSPicks.length > 0) {
      console.log('   Saving standalone ATS picks...\n');
      
      // Sort by MOS descending
      standaloneATSPicks.sort((a, b) => (b.spreadAnalysis.marginOverSpread || 0) - (a.spreadAnalysis.marginOverSpread || 0));
      
      for (const { game, spreadAnalysis, prediction } of standaloneATSPicks) {
        const result = await saveATSPick(db, game, spreadAnalysis, prediction);
        if (result.action === 'created') atsCreated++;
        else atsSkipped++;
      }
    } else {
      console.log('   ⚠️  No standalone ATS picks found today.\n');
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════════════
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        PICKS SUMMARY                                          ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
    
    // ── PRIME PICKS BREAKDOWN ──
    console.log('   ─── PRIME PICKS ───────────────────────────────────────────────');
    console.log(`   🌟 Prime Picks Found: ${primePicks.length}`);
    console.log(`   ✅ New bets created: ${created}`);
    console.log(`   🔒 Already existed: ${skipped}`);
    
    if (primePicks.length > 0) {
      // Compute ATS upgrade vs ML breakdown
      const atsUpgradedPicks = primePicks.filter(p => (p.spreadAnalysis.marginOverSpread || 0) >= 2);
      const mlKeptPicks = primePicks.filter(p => (p.spreadAnalysis.marginOverSpread || 0) < 2);
      
      console.log(`\n   🏈 BET RECOMMENDATION BREAKDOWN:`);
      console.log(`   ├─ ATS Upgraded: ${atsUpgradedPicks.length} picks (MOS ≥ 2)`);
      console.log(`   └─ ML Kept: ${mlKeptPicks.length} picks (MOS 1.6-2)`);
      
      // ATS tier breakdown (V4 — capped at 3u)
      if (atsUpgradedPicks.length > 0) {
        const maxPicks = atsUpgradedPicks.filter(p => (p.spreadAnalysis.marginOverSpread || 0) >= 3);
        const strongPicks = atsUpgradedPicks.filter(p => { const m = p.spreadAnalysis.marginOverSpread || 0; return m >= 2.5 && m < 3; });
        const solidPicks = atsUpgradedPicks.filter(p => { const m = p.spreadAnalysis.marginOverSpread || 0; return m >= 2 && m < 2.5; });
        const totalATSUnits = (maxPicks.length * 3) + (strongPicks.length * 2.5) + (solidPicks.length * 2);
        
        console.log(`\n   🎯 ATS TIER BREAKDOWN (V4, capped at 3u):`);
        if (maxPicks.length > 0) console.log(`   ★★★★★ MAX    (3u):   ${maxPicks.length} picks — MOS 3+`);
        if (strongPicks.length > 0) console.log(`   ★★★★  STRONG (2.5u): ${strongPicks.length} picks — MOS 2.5-3`);
        if (solidPicks.length > 0) console.log(`   ★★★   SOLID  (2u):   ${solidPicks.length} picks — MOS 2-2.5`);
        console.log(`   Total ATS units: ${totalATSUnits.toFixed(1)}u @ -110`);
        
        console.log();
        atsUpgradedPicks.forEach(p => {
          const mos = p.spreadAnalysis.marginOverSpread || 0;
          const ev = p.prediction.bestEV || 0;
          const units = mos >= 3 ? 3 : mos >= 2.5 ? 2.5 : 2;
          const stars = units >= 3 ? '★★★★★' : units >= 2.5 ? '★★★★' : '★★★';
          console.log(`      → ${stars} ${p.prediction.bestTeam} ${p.spreadAnalysis.spread} @ -110 → ${units}u | MOS: +${mos} | EV: +${ev.toFixed(1)}%`);
        });
      }
      
      // ML kept picks (MOS 1.6-2)
      if (mlKeptPicks.length > 0) {
        const totalMLUnits = mlKeptPicks.length * 1.5; // All ML kept are 1.5u (MOS 1.6-2)
        console.log(`\n   💰 ML PICKS (MOS 1.6-2, kept as moneyline):`);
        console.log(`   Total ML units: ${totalMLUnits.toFixed(1)}u`);
        mlKeptPicks.forEach(p => {
          const ev = p.prediction.bestEV || 0;
          const mos = p.spreadAnalysis.marginOverSpread || 0;
          console.log(`      → ★★ ${p.prediction.bestTeam} ML @ ${p.prediction.bestOdds} → 1.5u | MOS: +${mos} | EV: +${ev.toFixed(1)}%`);
        });
      }
    }
    
    // ── STANDALONE ATS PICKS ──
    console.log('\n   ─── STANDALONE ATS PICKS (SpreadEV 5%+) ───────────────────');
    console.log(`   📈 Standalone ATS Found: ${standaloneATSPicks.length}`);
    console.log(`   ✅ New ATS bets created: ${atsCreated}`);
    console.log(`   🔒 Already existed: ${atsSkipped}`);
    
    if (standaloneATSPicks.length > 0) {
      const totalStandaloneUnits = standaloneATSPicks.reduce((sum, d) => {
        const mos = d.spreadAnalysis.marginOverSpread || 0;
        return sum + (mos >= 3 ? 2 : mos >= 2 ? 1.5 : 1);
      }, 0);
      
      console.log(`   Total standalone ATS units: ${totalStandaloneUnits.toFixed(1)}u @ -110`);
      standaloneATSPicks.forEach(d => {
        const mos = d.spreadAnalysis.marginOverSpread || 0;
        const tier = mos >= 3 ? 'HIGH' : mos >= 2 ? 'MID' : 'BASE';
        const units = mos >= 3 ? 2 : mos >= 2 ? 1.5 : 1;
        const coverProb = estimateCoverProb(mos);
        const spreadEVPct = calcSpreadEV(coverProb) * 100;
        console.log(`      → ${d.spreadAnalysis.pickedTeam} ${d.spreadAnalysis.spread} @ -110 [${tier}] ${units}u | MOS: +${mos} | SpreadEV: +${spreadEVPct.toFixed(1)}%`);
      });
    }
    
    // ── TOTAL ALLOCATION ──
    console.log('\n   ─── TOTAL ALLOCATION ────────────────────────────────────────');
    const totalAllPicks = primePicks.length + standaloneATSPicks.length;
    // V4: MOS-based units, capped at 3u
    const totalAllUnits = primePicks.reduce((sum, p) => {
      const mos = p.spreadAnalysis.marginOverSpread || 0;
      // V4 tiers: 3u (MOS 3+), 2.5u (MOS 2.5-3), 2u (MOS 2-2.5), 1.5u (MOS 1.6-2)
      if (mos >= 3) return sum + 3;
      if (mos >= 2.5) return sum + 2.5;
      if (mos >= 2) return sum + 2;
      return sum + 1.5;
    }, 0) + standaloneATSPicks.reduce((sum, d) => {
      const mos = d.spreadAnalysis.marginOverSpread || 0;
      return sum + (mos >= 3 ? 2 : mos >= 2 ? 1.5 : 1);
    }, 0);
    
    console.log(`   Total picks today: ${totalAllPicks}`);
    console.log(`   Total units allocated: ${totalAllUnits.toFixed(1)}u`);
    console.log();
    
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
