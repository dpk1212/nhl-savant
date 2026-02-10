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
// Lowered from 3% to 2% since spread confirmation provides additional quality filter
const MIN_EV_THRESHOLD = 2.0;

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              🏀 PRIME PICKS - Unified Basketball Workflow                     ║');
console.log('║                                                                               ║');
console.log('║  Only writes bets that have BOTH:                                             ║');
console.log('║  ✅ EV Edge (≥2% from 90/10 model)                                            ║');
console.log('║  ✅ Spread Confirmation (D-Ratings covers + models agree)                     ║');
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
  // PRIME PICKS UNIT SIZING V3 — DATA-DRIVEN REBALANCE
  // Historical analysis: margin over spread is the strongest
  // predictor of wins (linear relationship). EV% is noisy and
  // nearly inverted (low EV outperforms high EV).
  //
  // EV (1-2u) + Spread (1-3u) = 2-5u
  // ═══════════════════════════════════════════════════════════════
  
  // COMPONENT 1: EV UNITS (1-2u) — less predictive signal, keep simple
  // Data: 2-4% EV = 88% WR / +33% ROI, 6-8% = 22% WR / -66% ROI
  // Low EV = market agrees with model = safer. High EV = volatile.
  const ev = prediction.bestEV || 0;
  let evUnits;
  let evTier;
  if (ev >= 5) {
    evUnits = 2;
    evTier = 'HIGH';      // Solid edge (5%+ EV)
  } else {
    evUnits = 1;
    evTier = 'BASE';      // Standard qualifying edge (2-5% EV)
  }
  
  // COMPONENT 2: SPREAD UNITS (1-3u) — strongest predictor of wins
  // Data: 0-2 pts = 63% WR, 2-3 pts = 67% WR, 3+ pts = 88% WR / +31% ROI
  // Clean linear relationship: more margin = more wins.
  const marginOverSpread = spreadAnalysis.marginOverSpread || 0;
  const bothCover = spreadAnalysis.bothCover || false;
  let spreadUnits;
  let spreadTier;
  if (marginOverSpread >= 3 && bothCover) {
    spreadUnits = 3;
    spreadTier = 'MAX';    // Elite: wide margin + both models agree (historically 88%+ WR)
  } else if (marginOverSpread >= 3) {
    spreadUnits = 2.5;
    spreadTier = 'STRONG'; // Strong: wide margin, blend 3+ pts over
  } else if (marginOverSpread >= 2) {
    spreadUnits = 2;
    spreadTier = 'SOLID';  // Solid: comfortable margin, 2-3 pts over
  } else {
    spreadUnits = 1;
    spreadTier = 'BASE';   // Covers but tight (0-2 pts over)
  }
  
  const totalUnits = evUnits + spreadUnits; // Range: 2u to 5u
  
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
      
      // PRIME V3 UNIT SIZING: EV (1-2u) + Spread (1-3u) = 2-5u
      // Spread is primary signal (linear WR predictor), EV is secondary
      unitSize: totalUnits,
      evUnits: evUnits,
      evTier: evTier,           // HIGH (2u), BASE (1u)
      spreadUnits: spreadUnits,
      spreadTier: spreadTier,   // MAX (3u), STRONG (2.5u), SOLID (2u), BASE (1u)
      spreadBoost: spreadBoost, // backward compat (= spreadUnits)
      
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
    savantPick: true, // Prime picks are automatically savantPicks
    
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
      if (mos < 2) return { recommended: false, reason: 'MOS_TOO_LOW' };
      
      // EV danger zone: 5-10% EV picks cover only 30% ATS (-42.7% ROI)
      // These are volatile favorites where model overestimates margin
      const inDangerZone = mlEV >= 5 && mlEV < 10;
      
      // Estimate cover probability: ~50% baseline + 3% per point of edge
      const coverProb = Math.min(0.95, 0.50 + (mos * 0.03));
      // EV at -110: (coverProb * 100/110) - ((1 - coverProb) * 1)
      const spreadEV = (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
      
      // EV sweet spot bonus: 2-5% ML EV has 67-91% ATS cover rate
      const inSweetSpot = mlEV >= 2 && mlEV < 5;
      
      // Tier and unit sizing
      let spreadBetTier, spreadBetUnits;
      if (inDangerZone) {
        // Still track but flag as caution — 30% ATS in this zone
        spreadBetTier = 'CAUTION';
        spreadBetUnits = 0.5;
      } else if (mos >= 3 && bothCover) {
        spreadBetTier = 'ELITE';     // 80%+ cover, +52.7% ROI historically
        spreadBetUnits = 2;
      } else if (mos >= 3) {
        spreadBetTier = 'STRONG';    // 80% cover rate
        spreadBetUnits = 1.5;
      } else if (inSweetSpot) {
        spreadBetTier = 'PRIME';     // MOS 2+ AND EV sweet spot = best combo
        spreadBetUnits = 1.5;
      } else {
        spreadBetTier = 'SOLID';     // 68% cover, +30.2% ROI
        spreadBetUnits = 1;
      }
      
      return {
        recommended: !inDangerZone, // Don't recommend in danger zone
        spread: spreadAnalysis.spread,
        marginOverSpread: mos,
        tier: spreadBetTier,
        units: spreadBetUnits,
        estimatedCoverProb: Math.round(coverProb * 1000) / 10,
        estimatedSpreadEV: Math.round(spreadEV * 1000) / 10,
        bothModelsCover: bothCover,
        mlEV: Math.round(mlEV * 10) / 10,
        inSweetSpot,
        inDangerZone,
        standardOdds: -110,
      };
    })(),
    
    // Barttorvik data
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  const evIcon = evTier === 'HIGH' ? '🔥' : '📊';
  const spreadIcon = spreadTier === 'MAX' ? '🎯' : spreadTier === 'STRONG' ? '💎' : spreadTier === 'SOLID' ? '💪' : '📊';
  
  console.log(`   🌟 PRIME PICK: ${pickTeam} ML @ ${prediction.bestOdds}`);
  console.log(`      ┌─ TOTAL: ${totalUnits}u (ML)`);
  console.log(`      ├─ EV:     ${evUnits}u ${evIcon} ${evTier} (${prediction.bestEV.toFixed(1)}% edge)`);
  console.log(`      ├─ Spread: ${spreadUnits}u ${spreadIcon} ${spreadTier} (blend +${spreadAnalysis.marginOverSpread >= 0 ? '' : ''}${spreadAnalysis.marginOverSpread} pts over spread)`);
  console.log(`      ├─ Line:   ${spreadAnalysis.spread} | DR +${spreadAnalysis.drMargin} ${spreadAnalysis.drCovers ? '✓' : '✗'} | HS +${spreadAnalysis.hsMargin} ${spreadAnalysis.hsCovers ? '✓' : '✗'} | Blend +${spreadAnalysis.blendedMargin}`);
  
  // Log spread bet recommendation
  const sb = betData.spreadBet;
  if (sb.recommended) {
    const sbIcon = sb.tier === 'ELITE' ? '🎯' : sb.tier === 'STRONG' ? '💎' : sb.tier === 'PRIME' ? '⭐' : '📈';
    const sweetSpotTag = sb.inSweetSpot ? ' ⭐ EV SWEET SPOT' : '';
    console.log(`      ├─ ${sbIcon} SPREAD BET: ${pickTeam} ${spreadAnalysis.spread} @ -110 → ${sb.units}u [${sb.tier}]${sweetSpotTag}`);
    console.log(`      │    Cover: ${sb.estimatedCoverProb}% | EV: +${sb.estimatedSpreadEV}% | MOS: +${sb.marginOverSpread} | ML EV: ${sb.mlEV}%`);
  } else if (sb.inDangerZone) {
    console.log(`      ├─ ⚠️  Spread bet SKIPPED — EV danger zone (${ev.toFixed(1)}% ML EV → 30% ATS historically)`);
  } else {
    console.log(`      ├─ ❌ No spread bet (MOS ${spreadAnalysis.marginOverSpread} < 2.0 threshold)`);
  }
  
  console.log(`      └─ Grade: ${prediction.grade} | Odds: ${prediction.bestOdds}`);
  
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
      
      // 🌟 PRIME PICK: Both workflows picked THE SAME TEAM
      console.log(`      🌟 ${evData.evPickedTeam}: EV ✓ Spread ✓ SAME TEAM → PRIME PICK!`);
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
    
    if (primePicks.length === 0) {
      console.log('⚠️  No Prime Picks found today.');
      console.log('   (Requires EV workflow AND Spread workflow to pick SAME team)\n');
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
    
    // Sort by blend margin over spread (largest first) for easier scanning
    primePicks.sort((a, b) => (b.spreadAnalysis.marginOverSpread || 0) - (a.spreadAnalysis.marginOverSpread || 0));
    
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
    
    // Calculate unit breakdown for summary
    const evHighPicks = primePicks.filter(p => p.prediction.bestEV >= 5);
    const evBasePicks = primePicks.filter(p => p.prediction.bestEV < 5);
    
    const spreadMaxPicks = primePicks.filter(p => p.spreadAnalysis.marginOverSpread >= 3 && p.spreadAnalysis.bothCover);
    const spreadStrongPicks = primePicks.filter(p => p.spreadAnalysis.marginOverSpread >= 3 && !p.spreadAnalysis.bothCover);
    const spreadSolidPicks = primePicks.filter(p => p.spreadAnalysis.marginOverSpread >= 2 && p.spreadAnalysis.marginOverSpread < 3);
    const spreadBasePicks = primePicks.filter(p => p.spreadAnalysis.marginOverSpread < 2);
    
    const avgMarginOverSpread = primePicks.length > 0 
      ? primePicks.reduce((sum, p) => sum + (p.spreadAnalysis.marginOverSpread || 0), 0) / primePicks.length
      : 0;
    const avgEV = primePicks.length > 0
      ? primePicks.reduce((sum, p) => sum + (p.prediction.bestEV || 0), 0) / primePicks.length
      : 0;
    
    // Total units allocated with V3 system
    const totalUnitsAllocated = primePicks.reduce((sum, p) => {
      const ev = p.prediction.bestEV || 0;
      const mos = p.spreadAnalysis.marginOverSpread || 0;
      const both = p.spreadAnalysis.bothCover || false;
      const evU = ev >= 5 ? 2 : 1;
      const spU = (mos >= 3 && both) ? 3 : mos >= 3 ? 2.5 : mos >= 2 ? 2 : 1;
      return sum + evU + spU;
    }, 0);
    
    console.log(`   🌟 Prime Picks Found: ${primePicks.length}`);
    console.log(`   ✅ New bets created: ${created}`);
    console.log(`   🔒 Already existed: ${skipped}`);
    console.log(`\n   💰 EV UNITS (1-2u per pick) — secondary signal:`);
    console.log(`   🔥 HIGH (2u):  ${evHighPicks.length} picks  — EV ≥ 5%`);
    console.log(`   📊 BASE (1u):  ${evBasePicks.length} picks  — EV 2-5%`);
    console.log(`\n   📈 SPREAD UNITS (1-3u per pick) — primary signal:`);
    console.log(`   🎯 MAX    (3u):   ${spreadMaxPicks.length} picks  — Blend 3+ pts over + both cover`);
    console.log(`   💎 STRONG (2.5u): ${spreadStrongPicks.length} picks  — Blend 3+ pts over`);
    console.log(`   💪 SOLID  (2u):   ${spreadSolidPicks.length} picks  — Blend 2-3 pts over`);
    console.log(`   📊 BASE   (1u):   ${spreadBasePicks.length} picks  — Blend 0-2 pts over`);
    console.log(`\n   📊 EDGE METRICS:`);
    console.log(`   Avg EV: +${avgEV.toFixed(1)}%`);
    console.log(`   Avg 90/10 Blend Over Spread: +${avgMarginOverSpread.toFixed(1)} pts`);
    console.log(`   Total Units Allocated: ${totalUnitsAllocated.toFixed(1)}u`);
    // Spread bet summary (v2 with EV sweet spot)
    const spreadBetAll = primePicks.map(p => {
      const mos = p.spreadAnalysis.marginOverSpread || 0;
      const both = p.spreadAnalysis.bothCover || false;
      const mlEV = p.prediction.bestEV || 0;
      const inDangerZone = mlEV >= 5 && mlEV < 10;
      const inSweetSpot = mlEV >= 2 && mlEV < 5;
      const qualifies = mos >= 2 && !inDangerZone;
      let tier;
      if (inDangerZone) tier = 'CAUTION';
      else if (mos >= 3 && both) tier = 'ELITE';
      else if (mos >= 3) tier = 'STRONG';
      else if (mos >= 2 && inSweetSpot) tier = 'PRIME';
      else if (mos >= 2) tier = 'SOLID';
      else tier = 'SKIP';
      return { ...p, mos, both, mlEV, inDangerZone, inSweetSpot, qualifies, tier };
    });
    
    const spreadBetPicks = spreadBetAll.filter(p => p.qualifies);
    const spreadDangerZone = spreadBetAll.filter(p => p.inDangerZone && p.mos >= 2);
    const spreadBetElite = spreadBetPicks.filter(p => p.tier === 'ELITE');
    const spreadBetStrong = spreadBetPicks.filter(p => p.tier === 'STRONG');
    const spreadBetPrime = spreadBetPicks.filter(p => p.tier === 'PRIME');
    const spreadBetSolid = spreadBetPicks.filter(p => p.tier === 'SOLID');
    
    const totalSpreadUnits = spreadBetPicks.reduce((sum, p) => {
      if (p.tier === 'ELITE') return sum + 2;
      if (p.tier === 'STRONG') return sum + 1.5;
      if (p.tier === 'PRIME') return sum + 1.5;
      return sum + 1;
    }, 0);

    console.log('\n   🏗️ UNIT SIZING V3 (data-driven rebalance):');
    console.log(`   • EV Component:     1u (2-5%) | 2u (5%+)           ← secondary signal`);
    console.log(`   • Spread Component:  1u (0-2) | 2u (2-3) | 2.5u (3+) | 3u (3+ & both cover)  ← PRIMARY`);
    console.log(`   • Range: 2u min → 5u max`);
    console.log(`   • EV Threshold: ≥${MIN_EV_THRESHOLD}%`);
    
    console.log(`\n   🎯 SPREAD BET RECOMMENDATIONS v2 (MOS ≥ 2.0 + EV filter):`);
    console.log(`   Historical: MOS 2+ = 68% ATS, +30.2% ROI | MOS 3+ = 80%, +52.7%`);
    console.log(`   🔑 EV Sweet Spot: 2-5% EV = 67-91% ATS | ⚠️ 5-10% EV = 30% ATS (excluded)`);
    console.log(`   ─────────────────────────────────────────────────`);
    if (spreadBetPicks.length > 0) {
      console.log(`   🎯 ELITE  (2u):   ${spreadBetElite.length} picks  — MOS 3+ & both models cover`);
      console.log(`   💎 STRONG (1.5u): ${spreadBetStrong.length} picks  — MOS 3+`);
      console.log(`   ⭐ PRIME  (1.5u): ${spreadBetPrime.length} picks  — MOS 2+ & EV sweet spot (2-5%)`);
      console.log(`   📈 SOLID  (1u):   ${spreadBetSolid.length} picks  — MOS 2-3`);
      if (spreadDangerZone.length > 0) {
        console.log(`   ⚠️  SKIPPED (danger): ${spreadDangerZone.length} picks — MOS 2+ but EV 5-10% (30% ATS historically)`);
      }
      console.log(`   Total spread bets: ${spreadBetPicks.length} | Units: ${totalSpreadUnits.toFixed(1)}u @ -110`);
      spreadBetPicks.forEach(p => {
        const sweetTag = p.inSweetSpot ? ' ⭐ SWEET SPOT' : '';
        console.log(`      → ${p.prediction.bestTeam} ${p.spreadAnalysis.spread} @ -110 [${p.tier}] MOS: +${p.mos} | EV: ${p.mlEV.toFixed(1)}%${sweetTag}`);
      });
      if (spreadDangerZone.length > 0) {
        spreadDangerZone.forEach(p => {
          console.log(`      ⚠️  ${p.prediction.bestTeam} ${p.spreadAnalysis.spread} — SKIPPED (EV: ${p.mlEV.toFixed(1)}% in 5-10% danger zone)`);
        });
      }
    } else {
      console.log(`   ⚠️  No spread bets today (no picks with MOS ≥ 2.0 outside danger zone)`);
    }
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
