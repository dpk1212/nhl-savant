/**
 * PRIME PICKS V7 — MOS-Primary + Totals System
 *
 * SPREADS (ATS):
 *   MOS (Margin Over Spread) is the SOLE gate for ATS pick selection.
 *   Both sides of every game are evaluated independently.
 *   Both models must agree on the cover direction.
 *
 * TOTALS (O/U):
 *   MOT (Margin Over Total) uses the same logic for Over/Under picks.
 *   Both models must agree on direction (both OVER or both UNDER).
 *   Blended predicted total (90% DR / 10% HS) vs market total line.
 *
 * All picks are at -110 odds.
 *
 * UNIT SIZING (1-5 scale, based on MOS/MOT):
 *   4.0+     → 5u  MAXIMUM
 *   3.0-4    → 4u  ELITE
 *   2.5-3    → 3u  STRONG
 *   2.25-2.5 → 2u  SOLID
 *   2.0-2.25 → 1u  BASE
 *   < 2.0    → SKIP
 *
 * Usage: npm run fetch-prime-picks
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
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
const MOS_FLOOR_CONFIRMED = 1.5;
const MOT_FLOOR = 4.5;
const MOT_FLOOR_CONFIRMED = 3.5;

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              PRIME PICKS V7 — MOS-Primary + Totals                             ║');
console.log('║                                                                               ║');
console.log('║  ATS:   MOS >= 2.0 • Both models cover • -110                                  ║');
console.log('║  O/U:   MOT >= 2.0 • Both models agree direction • -110                        ║');
console.log('║  UNITS: 5u(4+) | 4u(3-4) | 3u(2.5-3) | 2u(2.25-2.5) | 1u(2-2.25)             ║');
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
      
      // Extract consensus spread (first spread pattern on the line)
      const spreadPatterns = line.match(/([+-]?\d+½?)\s+-?\d{3}/g);
      let spread = null;
      
      if (spreadPatterns && spreadPatterns.length > 0) {
        const spreadStr = spreadPatterns[0].split(/\s/)[0];
        spread = parseFloat(spreadStr.replace('½', '.5'));
      } else if (line.includes('PK')) {
        spread = 0;
      }
      
      // Extract opening line from the second pipe-separated column (Opener)
      const columns = line.split('|');
      let openerSpread = null;
      if (columns.length >= 3) {
        const openerCol = columns[2]?.trim();
        if (openerCol && openerCol !== '-') {
          if (openerCol.includes('PK')) {
            openerSpread = 0;
          } else {
            const openerMatch = openerCol.match(/([+-]?\d+½?(?:\.\d)?)/);
            if (openerMatch) {
              openerSpread = parseFloat(openerMatch[1].replace('½', '.5'));
            }
          }
        }
      }
      
      if (!currentGame) {
        currentGame = { 
          awayTeam: teamName, 
          homeTeam: null, 
          awaySpread: spread, 
          awayOpener: openerSpread,
          homeSpread: null,
          homeOpener: null,
          isToday: isToday
        };
      } else if (!currentGame.homeTeam) {
        currentGame.homeTeam = teamName;
        currentGame.homeSpread = spread;
        currentGame.homeOpener = openerSpread;
        
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
 * Parse totals (O/U) data from OddsTrader markdown (m=total)
 */
function parseTotalsData(markdown) {
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
      
      let total = null;
      
      // Pattern: "O 145½ -110" or "U 145½ -110"
      const ouMatch = line.match(/[OU]\s+(\d{2,3}½?(?:\.\d)?)\s*-?\d{3}/);
      if (ouMatch) {
        total = parseFloat(ouMatch[1].replace('½', '.5'));
      }
      
      // Pattern: standalone number in CBB total range (100-250) with odds
      if (!total) {
        const allNums = [...line.matchAll(/(\d{3}½?(?:\.\d)?)\s+-?\d{3}/g)];
        for (const m of allNums) {
          const num = parseFloat(m[1].replace('½', '.5'));
          if (num >= 100 && num <= 250) {
            total = num;
            break;
          }
        }
      }
      
      // Extract opening total from second pipe-separated column (Opener)
      let openerTotal = null;
      const columns = line.split('|');
      if (columns.length >= 3) {
        const openerCol = columns[2]?.trim();
        if (openerCol && openerCol !== '-') {
          const openerOUMatch = openerCol.match(/[OU]?\s*(\d{2,3}½?(?:\.\d)?)/);
          if (openerOUMatch) {
            const num = parseFloat(openerOUMatch[1].replace('½', '.5'));
            if (num >= 100 && num <= 250) openerTotal = num;
          }
        }
      }
      
      if (!currentGame) {
        currentGame = { 
          awayTeam: teamName, 
          homeTeam: null, 
          awayTotal: total, 
          awayOpenerTotal: openerTotal,
          homeTotal: null,
          homeOpenerTotal: null,
          isToday: isToday
        };
      } else if (!currentGame.homeTeam) {
        currentGame.homeTeam = teamName;
        currentGame.homeTotal = total;
        currentGame.homeOpenerTotal = openerTotal;
        
        const gameTotal = currentGame.awayTotal || currentGame.homeTotal;
        const openerGameTotal = currentGame.awayOpenerTotal || currentGame.homeOpenerTotal;
        
        if (currentGame.isToday && currentGame.awayTeam && currentGame.homeTeam && gameTotal) {
          games.push({
            awayTeam: currentGame.awayTeam,
            homeTeam: currentGame.homeTeam,
            total: gameTotal,
            openerTotal: openerGameTotal,
            isToday: true
          });
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
    const openerSpread = isAway ? spreadGame.awayOpener : spreadGame.homeOpener;
    
    if (spread === null || spread === undefined) return null;
    
    const drMargin = isAway ? drRawMargin : -drRawMargin;
    const hsMargin = isAway ? hsRawMargin : -hsRawMargin;
    const blendedMargin = (drMargin * 0.90) + (hsMargin * 0.10);
    
    const drCovers = drMargin > -spread;
    const hsCovers = hsMargin > -spread;
    const blendCovers = blendedMargin > -spread;
    const bothCover = drCovers && hsCovers;
    
    const marginOverSpread = Math.round((blendedMargin + spread) * 10) / 10;
    
    // LINE MOVEMENT: openerSpread - currentSpread
    //   Positive = line moved toward our pick (CONFIRM / STEAM)
    //   Negative = line moved against our pick (FLAGGED)
    //   DOG +4 opens, +5.5 now: 4 - 5.5 = -1.5 (FLAGGED — sharps on fav)
    //   DOG +7 opens, +5.5 now: 7 - 5.5 = +1.5 (CONFIRM — sharps on dog)
    //   FAV -4 opens, -5.5 now: -4 - (-5.5) = +1.5 (CONFIRM — sharps on fav)
    let lineMovement = null;
    let movementTier = 'UNKNOWN';
    if (openerSpread != null) {
      lineMovement = Math.round((openerSpread - spread) * 10) / 10;
      if (lineMovement >= 1.0) movementTier = 'CONFIRM';
      else if (lineMovement >= -0.5) movementTier = 'NEUTRAL';
      else movementTier = 'FLAGGED';
    }
    
    return {
      side,
      teamName,
      spread,
      openerSpread,
      lineMovement,
      movementTier,
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
  
  const awayValid = away && away.marginOverSpread > 0;
  const homeValid = home && home.marginOverSpread > 0;
  
  if (!awayValid && !homeValid) return null;
  
  const bestSide = (!homeValid || (awayValid && away.marginOverSpread >= home.marginOverSpread)) ? away : home;
  
  return { away, home, bestSide };
}

/**
 * Evaluate totals (O/U) for a game.
 * Uses blended model to determine direction.
 * MOT = |blendedTotal - marketTotal|
 */
function evaluateTotals(game, totalsGames) {
  const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';
  
  const totalsGame = totalsGames.find(tg => {
    const awayMatch = normalizeTeam(game.awayTeam).includes(normalizeTeam(tg.awayTeam)) ||
                      normalizeTeam(tg.awayTeam).includes(normalizeTeam(game.awayTeam));
    const homeMatch = normalizeTeam(game.homeTeam).includes(normalizeTeam(tg.homeTeam)) ||
                      normalizeTeam(tg.homeTeam).includes(normalizeTeam(game.homeTeam));
    return awayMatch && homeMatch;
  });
  
  if (!totalsGame || !game.dratings || !game.haslametrics) {
    return null;
  }
  
  const dr = game.dratings;
  const hs = game.haslametrics;
  
  const drTotal = dr.awayScore + dr.homeScore;
  const hsTotal = hs.awayScore + hs.homeScore;
  const blendedTotal = (drTotal * 0.90) + (hsTotal * 0.10);
  const marketTotal = totalsGame.total;
  
  const drOver = drTotal > marketTotal;
  const hsOver = hsTotal > marketTotal;
  
  const bothAgreeOver = drOver && hsOver;
  const bothAgreeUnder = !drOver && !hsOver;
  
  const direction = blendedTotal > marketTotal ? 'OVER' : 'UNDER';
  const margin = blendedTotal - marketTotal;
  const mot = Math.round(Math.abs(margin) * 10) / 10;
  
  // LINE MOVEMENT for totals
  //   OVER:  line moves up = CONFIRM (sharps betting over)
  //   UNDER: line moves down = CONFIRM (sharps betting under)
  const openerTotal = totalsGame.openerTotal;
  let lineMovement = null;
  let movementTier = 'UNKNOWN';
  if (openerTotal != null) {
    lineMovement = direction === 'OVER'
      ? Math.round((marketTotal - openerTotal) * 10) / 10
      : Math.round((openerTotal - marketTotal) * 10) / 10;
    if (lineMovement >= 1.0) movementTier = 'CONFIRM';
    else if (lineMovement >= -0.5) movementTier = 'NEUTRAL';
    else movementTier = 'FLAGGED';
  }
  
  return {
    direction,
    marketTotal,
    openerTotal,
    lineMovement,
    movementTier,
    drTotal: Math.round(drTotal * 10) / 10,
    hsTotal: Math.round(hsTotal * 10) / 10,
    blendedTotal: Math.round(blendedTotal * 10) / 10,
    marginOverTotal: mot,
    drOver,
    hsOver,
    bothAgreeOver,
    bothAgreeUnder,
  };
}

/**
 * MOS tier → base unit sizing (1-5 scale)
 */
function getMOSTier(mos, floor = MOS_FLOOR) {
  if (mos >= 4)    return { tier: 'MAXIMUM', units: 5 };
  if (mos >= 3)    return { tier: 'ELITE',   units: 4 };
  if (mos >= 2.5)  return { tier: 'STRONG',  units: 3 };
  if (mos >= 2.25) return { tier: 'SOLID',   units: 2 };
  if (mos >= 2.0)  return { tier: 'BASE',    units: 1 };
  if (mos >= floor) return { tier: 'MARKET_CONFIRMED', units: 1 };
  return null;
}

/**
 * MOT tier → base unit sizing for totals (floor = 4.5)
 */
function getMOTTier(mot, floor = MOT_FLOOR) {
  if (mot >= 7)          return { tier: 'MAXIMUM', units: 5 };
  if (mot >= 6)          return { tier: 'ELITE',   units: 4 };
  if (mot >= 5.5)        return { tier: 'STRONG',  units: 3 };
  if (mot >= 5)          return { tier: 'SOLID',   units: 2 };
  if (mot >= 4.5)        return { tier: 'BASE',    units: 1 };
  if (mot >= floor)      return { tier: 'MARKET_CONFIRMED', units: 1 };
  return null;
}

/**
 * Adjust units based on line movement tier.
 *   CONFIRM: +1u boost (capped at 5)
 *   NEUTRAL: no change
 *   FLAGGED: hard skip (return null to reject the pick)
 */
function applyMovementGate(baseUnits, movementTier) {
  if (movementTier === 'FLAGGED') return null;
  if (movementTier === 'CONFIRM') return Math.min(baseUnits + 1, 5);
  return baseUnits;
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
  
  const mos = sideData.marginOverSpread;
  const effectiveFloor = sideData.movementTier === 'CONFIRM' ? MOS_FLOOR_CONFIRMED : MOS_FLOOR;
  const tierInfo = getMOSTier(mos, effectiveFloor);
  if (!tierInfo) return { action: 'skipped', betId };
  const adjustedUnits = applyMovementGate(tierInfo.units, sideData.movementTier);
  const isFlagged = adjustedUnits === null;
  const units = isFlagged ? 0 : adjustedUnits;
  const tier = tierInfo.tier;
  
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    const prev = existingBet.data();
    const prevTier = prev.spreadAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const newTier = sideData.movementTier;
    const tierChanged = prevTier !== newTier;
    
    const updateData = {
      'spreadAnalysis.spread': sideData.spread,
      'spreadAnalysis.lineMovement': sideData.lineMovement,
      'spreadAnalysis.movementTier': newTier,
      'spreadAnalysis.marginOverSpread': mos,
      'betRecommendation.lineMovement': sideData.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.atsSpread': sideData.spread,
      'betRecommendation.marginOverSpread': mos,
      lastUpdatedAt: Date.now(),
    };
    
    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${pickTeam} ${sideData.spread} — line moved against but bet is locked for user`);
        return { action: 'stable', betId };
      }
      updateData['betStatus'] = 'KILLED';
      updateData['bet.units'] = 0;
      updateData['betRecommendation.atsUnits'] = 0;
      updateData['prediction.unitSize'] = 0;
      await updateDoc(betRef, updateData);
      console.log(`   💀 KILLED: ${pickTeam} ${sideData.spread} — was ${prevTier}, now FLAGGED (line moved ${sideData.lineMovement > 0 ? '+' : ''}${sideData.lineMovement})`);
      return { action: 'killed', betId };
    }
    
    if (tierChanged || newTier === 'CONFIRM') {
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData['spreadAnalysis.unitTier'] = tier;
      const newStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
      if (!prev.isLocked) {
        updateData['betStatus'] = newStatus;
        if (newStatus === 'BET_NOW') {
          updateData.isLocked = true;
          updateData.lockedAt = Date.now();
        }
      }
      await updateDoc(betRef, updateData);
      const arrow = newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED';
      console.log(`   ${arrow}: ${pickTeam} ${sideData.spread} — ${prevTier} → ${newTier} | ${units}u [${tier}]`);
      return { action: 'updated', betId };
    }
    
    await updateDoc(betRef, updateData);
    console.log(`   🔒 Stable: ${pickTeam} — still ${newTier} | ${units}u`);
    return { action: 'stable', betId };
  }
  
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
      openerSpread: sideData.openerSpread,
      lineMovement: sideData.lineMovement,
      movementTier: sideData.movementTier,
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
    betStatus: isFlagged ? 'FLAGGED' : (sideData.movementTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD'),
    isLocked: !isFlagged,
    lockedAt: !isFlagged ? Date.now() : null,
    firstRecommendedAt: Date.now(),
    lastUpdatedAt: Date.now(),
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
      openerSpread: sideData.openerSpread,
      lineMovement: sideData.lineMovement,
      movementTier: sideData.movementTier,
    },
    
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  if (isFlagged) {
    const mvStr = sideData.lineMovement != null ? `${sideData.lineMovement > 0 ? '+' : ''}${sideData.lineMovement}` : '?';
    console.log(`   🚩 STORED (FLAGGED): ${pickTeam} ${sideData.spread} — MOS +${mos} [${tier}] | line moved ${mvStr} (opener: ${sideData.openerSpread}) — watching for stabilization`);
    return { action: 'created_flagged', betId };
  }
  
  const tierIcon = tier === 'MAXIMUM' ? '💎' : tier === 'ELITE' ? '🔥' : tier === 'STRONG' ? '💪' : tier === 'SOLID' ? '📊' : '📌';
  const favDog = sideData.isFavorite ? 'FAV' : 'DOG';
  const mvIcon = sideData.movementTier === 'CONFIRM' ? '🟢' : '⚪';
  const mvStr = sideData.lineMovement != null ? ` | Line: ${sideData.lineMovement > 0 ? '+' : ''}${sideData.lineMovement} [${sideData.movementTier}]` : '';
  const starDisplay = '★'.repeat(units) + '☆'.repeat(5 - units);
  console.log(`   ${tierIcon} ${mvIcon} ${pickTeam} ${sideData.spread} @ -110 → ${units}u [${tier}] ${favDog}`);
  console.log(`      ${starDisplay} MOS: +${mos} | Cover: ${betData.betRecommendation.estimatedCoverProb}%${mvStr}`);
  console.log(`      DR: +${sideData.drMargin} ${sideData.drCovers ? '✓' : '✗'} | HS: +${sideData.hsMargin} ${sideData.hsCovers ? '✓' : '✗'} | Blend: +${sideData.blendedMargin} ${sideData.blendCovers ? '✓' : '✗'}`);
  
  return { action: 'created', betId };
}

/**
 * Save a totals (O/U) pick to Firebase.
 */
async function saveTotalsPick(db, game, totalsData, prediction) {
  const date = new Date().toISOString().split('T')[0];
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_TOTAL_${totalsData.direction}`;
  
  const betRef = doc(db, 'basketball_bets', betId);
  
  const mot = totalsData.marginOverTotal;
  const effectiveFloor = totalsData.movementTier === 'CONFIRM' ? MOT_FLOOR_CONFIRMED : MOT_FLOOR;
  const tierInfo = getMOTTier(mot, effectiveFloor);
  if (!tierInfo) return { action: 'skipped', betId };
  const adjustedUnits = applyMovementGate(tierInfo.units, totalsData.movementTier);
  const isFlagged = adjustedUnits === null;
  const units = isFlagged ? 0 : adjustedUnits;
  const tier = tierInfo.tier;
  
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    const prev = existingBet.data();
    const prevTier = prev.totalsAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const newTier = totalsData.movementTier;
    const tierChanged = prevTier !== newTier;
    
    const updateData = {
      'totalsAnalysis.marketTotal': totalsData.marketTotal,
      'totalsAnalysis.lineMovement': totalsData.lineMovement,
      'totalsAnalysis.movementTier': newTier,
      'totalsAnalysis.marginOverTotal': mot,
      'betRecommendation.lineMovement': totalsData.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.totalLine': totalsData.marketTotal,
      'betRecommendation.marginOverTotal': mot,
      lastUpdatedAt: Date.now(),
    };
    
    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${totalsData.direction} ${totalsData.marketTotal} — line moved against but bet is locked for user (${game.awayTeam} @ ${game.homeTeam})`);
        return { action: 'stable', betId };
      }
      updateData['betStatus'] = 'KILLED';
      updateData['bet.units'] = 0;
      updateData['betRecommendation.totalUnits'] = 0;
      updateData['prediction.unitSize'] = 0;
      await updateDoc(betRef, updateData);
      console.log(`   💀 KILLED: ${totalsData.direction} ${totalsData.marketTotal} — was ${prevTier}, now FLAGGED (line moved ${totalsData.lineMovement > 0 ? '+' : ''}${totalsData.lineMovement}) (${game.awayTeam} @ ${game.homeTeam})`);
      return { action: 'killed', betId };
    }
    
    if (tierChanged || newTier === 'CONFIRM') {
      updateData['bet.units'] = units;
      updateData['betRecommendation.totalUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData['totalsAnalysis.unitTier'] = tier;
      const newStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
      if (!prev.isLocked) {
        updateData['betStatus'] = newStatus;
        if (newStatus === 'BET_NOW') {
          updateData.isLocked = true;
          updateData.lockedAt = Date.now();
        }
      }
      await updateDoc(betRef, updateData);
      const arrow = newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED';
      console.log(`   ${arrow}: ${totalsData.direction} ${totalsData.marketTotal} — ${prevTier} → ${newTier} | ${units}u [${tier}] (${game.awayTeam} @ ${game.homeTeam})`);
      return { action: 'updated', betId };
    }
    
    await updateDoc(betRef, updateData);
    console.log(`   🔒 Stable: ${totalsData.direction} ${totalsData.marketTotal} — still ${newTier} | ${units}u (${game.awayTeam} @ ${game.homeTeam})`);
    return { action: 'stable', betId };
  }
  
  const coverProb = estimateCoverProb(mot);
  const totalsEV = calcSpreadEV(coverProb);
  
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
      market: 'TOTAL',
      pick: totalsData.direction,
      total: totalsData.marketTotal,
      odds: -110,
      units,
      team: null
    },
    
    totalsAnalysis: {
      marketTotal: totalsData.marketTotal,
      openerTotal: totalsData.openerTotal,
      lineMovement: totalsData.lineMovement,
      movementTier: totalsData.movementTier,
      drTotal: totalsData.drTotal,
      hsTotal: totalsData.hsTotal,
      blendedTotal: totalsData.blendedTotal,
      marginOverTotal: mot,
      direction: totalsData.direction,
      drOver: totalsData.drOver,
      hsOver: totalsData.hsOver,
      bothModelsAgree: totalsData.bothAgreeOver || totalsData.bothAgreeUnder,
      unitTier: tier,
    },
    
    prediction: {
      bestTeam: null,
      bestBet: totalsData.direction,
      bestOdds: -110,
      bestEV: prediction?.bestEV || null,
      evPercent: prediction?.bestEV || null,
      grade: prediction?.grade || null,
      unitSize: units,
      
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
    betStatus: isFlagged ? 'FLAGGED' : (totalsData.movementTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD'),
    isLocked: !isFlagged,
    lockedAt: !isFlagged ? Date.now() : null,
    firstRecommendedAt: Date.now(),
    lastUpdatedAt: Date.now(),
    source: 'PRIME_MOT',
    
    isPrimePick: true,
    isTotalsPick: true,
    savantPick: mot >= 4,
    
    betRecommendation: {
      type: 'TOTAL',
      reason: 'MOT_PRIMARY',
      totalUnits: units,
      totalTier: tier,
      totalLine: totalsData.marketTotal,
      totalDirection: totalsData.direction,
      totalOdds: -110,
      estimatedCoverProb: Math.round(coverProb * 1000) / 10,
      estimatedTotalsEV: Math.round(totalsEV * 1000) / 10,
      marginOverTotal: mot,
      bothModelsAgree: totalsData.bothAgreeOver || totalsData.bothAgreeUnder,
      openerTotal: totalsData.openerTotal,
      lineMovement: totalsData.lineMovement,
      movementTier: totalsData.movementTier,
    },
    
    barttorvik: game.barttorvik || null
  };
  
  await setDoc(betRef, betData);
  
  if (isFlagged) {
    const mvStr = totalsData.lineMovement != null ? `${totalsData.lineMovement > 0 ? '+' : ''}${totalsData.lineMovement}` : '?';
    console.log(`   🚩 STORED (FLAGGED): ${totalsData.direction} ${totalsData.marketTotal} — MOT +${mot} [${tier}] | line moved ${mvStr} (opener: ${totalsData.openerTotal}) — watching (${game.awayTeam} @ ${game.homeTeam})`);
    return { action: 'created_flagged', betId };
  }
  
  const tierIcon = tier === 'MAXIMUM' ? '💎' : tier === 'ELITE' ? '🔥' : tier === 'STRONG' ? '💪' : tier === 'SOLID' ? '📊' : '📌';
  const mvIcon = totalsData.movementTier === 'CONFIRM' ? '🟢' : '⚪';
  const mvStr = totalsData.lineMovement != null ? ` | Line: ${totalsData.lineMovement > 0 ? '+' : ''}${totalsData.lineMovement} [${totalsData.movementTier}]` : '';
  const starDisplay = '★'.repeat(units) + '☆'.repeat(5 - units);
  console.log(`   ${tierIcon} ${mvIcon} ${totalsData.direction} ${totalsData.marketTotal} → ${units}u [${tier}] (${game.awayTeam} @ ${game.homeTeam})`);
  console.log(`      ${starDisplay} MOT: +${mot} | Cover: ${betData.betRecommendation.estimatedCoverProb}%${mvStr}`);
  console.log(`      DR: ${totalsData.drTotal} ${totalsData.drOver ? 'O' : 'U'} | HS: ${totalsData.hsTotal} ${totalsData.hsOver ? 'O' : 'U'} | Blend: ${totalsData.blendedTotal} | Line: ${totalsData.marketTotal}`);
  
  return { action: 'created', betId };
}

/**
 * Save a game evaluation to Firebase for EVERY matched game.
 * Stores raw model outputs so checkLineMovement can re-evaluate
 * against new lines throughout the day without re-running models.
 */
async function saveGameEvaluation(db, game, spreadGames, totalsGames, edgeCalculator) {
  const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const date = new Date().toISOString().split('T')[0];
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const evalId = `${date}_${awayNorm}_${homeNorm}`;

  const dr = game.dratings;
  const hs = game.haslametrics;
  if (!dr || !hs) return;

  const drRawMargin = dr.awayScore - dr.homeScore;
  const hsRawMargin = hs.awayScore - hs.homeScore;
  const blendedMargin = (drRawMargin * 0.90) + (hsRawMargin * 0.10);
  const drTotal = dr.awayScore + dr.homeScore;
  const hsTotal = hs.awayScore + hs.homeScore;
  const blendedTotal = (drTotal * 0.90) + (hsTotal * 0.10);

  const spreadGame = spreadGames.find(sg => {
    const awayMatch = normalizeTeam(game.awayTeam).includes(normalizeTeam(sg.awayTeam)) ||
                      normalizeTeam(sg.awayTeam).includes(normalizeTeam(game.awayTeam));
    const homeMatch = normalizeTeam(game.homeTeam).includes(normalizeTeam(sg.homeTeam)) ||
                      normalizeTeam(sg.homeTeam).includes(normalizeTeam(game.homeTeam));
    return awayMatch && homeMatch;
  });

  const totalsGame = totalsGames.find(tg => {
    const awayMatch = normalizeTeam(game.awayTeam).includes(normalizeTeam(tg.awayTeam)) ||
                      normalizeTeam(tg.awayTeam).includes(normalizeTeam(game.awayTeam));
    const homeMatch = normalizeTeam(game.homeTeam).includes(normalizeTeam(tg.homeTeam)) ||
                      normalizeTeam(tg.homeTeam).includes(normalizeTeam(game.homeTeam));
    return awayMatch && homeMatch;
  });

  let prediction = null;
  try {
    const pred = edgeCalculator.calculateEnsemblePrediction(game);
    if (pred && !pred.error) prediction = pred;
  } catch (e) { /* skip prediction if calculator errors */ }

  const evalData = {
    id: evalId,
    type: 'EVALUATION',
    date,
    game: {
      awayTeam: game.awayTeam,
      homeTeam: game.homeTeam,
      gameTime: game.odds?.gameTime || 'TBD',
    },
    modelData: {
      dratingsAwayScore: Math.round(dr.awayScore * 10) / 10,
      dratingsHomeScore: Math.round(dr.homeScore * 10) / 10,
      haslametricsAwayScore: Math.round(hs.awayScore * 10) / 10,
      haslametricsHomeScore: Math.round(hs.homeScore * 10) / 10,
      drRawMargin: Math.round(drRawMargin * 10) / 10,
      hsRawMargin: Math.round(hsRawMargin * 10) / 10,
      blendedMargin: Math.round(blendedMargin * 10) / 10,
      drTotal: Math.round(drTotal * 10) / 10,
      hsTotal: Math.round(hsTotal * 10) / 10,
      blendedTotal: Math.round(blendedTotal * 10) / 10,
    },
    openers: {
      awaySpread: spreadGame?.awaySpread ?? null,
      homeSpread: spreadGame?.homeSpread ?? null,
      awayOpener: spreadGame?.awayOpener ?? null,
      homeOpener: spreadGame?.homeOpener ?? null,
      total: totalsGame?.total ?? null,
      openerTotal: totalsGame?.openerTotal ?? null,
    },
    prediction: prediction ? {
      ensembleAwayScore: prediction.ensembleAwayScore ?? null,
      ensembleHomeScore: prediction.ensembleHomeScore ?? null,
      ensembleAwayProb: prediction.ensembleAwayProb ?? null,
      ensembleHomeProb: prediction.ensembleHomeProb ?? null,
      dratingsAwayProb: prediction.dratingsAwayProb ?? null,
      dratingsHomeProb: prediction.dratingsHomeProb ?? null,
      haslametricsAwayProb: prediction.haslametricsAwayProb ?? null,
      haslametricsHomeProb: prediction.haslametricsHomeProb ?? null,
      marketAwayProb: prediction.marketAwayProb ?? null,
      marketHomeProb: prediction.marketHomeProb ?? null,
      bestEV: prediction.bestEV ?? null,
      bestOdds: prediction.bestOdds ?? null,
      grade: prediction.grade ?? null,
    } : null,
    barttorvik: game.barttorvik || null,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
  };

  await setDoc(doc(db, 'basketball_bets', evalId), evalData);
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
    
    // 1c. Fetch totals odds
    console.log('📊 Fetching NCAAB totals from OddsTrader...');
    const totalsResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.oddstrader.com/ncaa-college-basketball/?eid=0&g=game&m=total&_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 3000, timeout: 300000 }
      );
    });
    await fs.writeFile(join(__dirname, '../public/basketball_totals.md'), totalsResult.markdown, 'utf8');
    console.log('   ✅ Totals saved\n');
    
    // 1d. Fetch Haslametrics
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
    const totalsGames = parseTotalsData(totalsResult.markdown);
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
    console.log(`   📊 Totals games: ${totalsGames.length}`);
    console.log(`   📈 Haslametrics teams: ${haslaData.length}`);
    console.log(`   🎯 D-Ratings predictions: ${dratePreds.length}`);
    console.log(`   ✅ Matched games: ${matchedGames.length}\n`);
    
    const edgeCalculator = new BasketballEdgeCalculator();
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2.5: SAVE GAME EVALUATIONS (raw model data for line monitoring)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 2.5: SAVING GAME EVALUATIONS (model data for line monitoring)            │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    let evalsSaved = 0;
    for (const game of matchedGames) {
      if (!game.dratings || !game.haslametrics) continue;
      await saveGameEvaluation(db, game, spreadGames, totalsGames, edgeCalculator);
      evalsSaved++;
    }
    console.log(`   ✅ ${evalsSaved} game evaluations saved to Firebase\n`);
    console.log(`   📡 Line monitor can now track all ${evalsSaved} games via Odds API\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: EVALUATE ALL GAMES (MOS-Primary — both sides)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3: MOS-PRIMARY ANALYSIS (both sides of every game)                      │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    const picks = [];
    let noModelData = 0;
    let noSpreadData = 0;
    let belowFloor = 0;
    let flaggedCount = 0;
    
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
      
      // LINE MOVEMENT GATE
      const adjustedUnits = applyMovementGate(tierInfo.units, best.movementTier);
      
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      const evDisplay = (prediction && !prediction.error) ? `EV ${prediction.bestEV?.toFixed(1)}%` : '';
      const favDog = best.isFavorite ? 'FAV' : 'DOG';
      
      if (adjustedUnits === null) {
        flaggedCount++;
        const mvStr = best.lineMovement != null ? `${best.lineMovement > 0 ? '+' : ''}${best.lineMovement}` : '?';
        console.log(`   🚫 ${best.teamName} ${best.spread} — MOS +${mos} FLAGGED (line moved ${mvStr} against pick, opener: ${best.openerSpread})`);
      } else {
        tierInfo.units = adjustedUnits;
        const mvTag = best.movementTier === 'CONFIRM' ? '🟢 STEAM' : best.movementTier === 'NEUTRAL' ? '⚪' : '';
        console.log(`   ✅ ${best.teamName} (${best.side.toUpperCase()}) ${best.spread} — MOS +${mos} → ${tierInfo.units}u [${tierInfo.tier}] ${favDog} ${mvTag} ${evDisplay}`);
      }
      
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
    console.log(`   🚫 FLAGGED (line moved against): ${flaggedCount}`);
    console.log(`   ✅ QUALIFYING ATS PICKS: ${picks.length}\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3B: EVALUATE TOTALS (O/U — both models must agree direction)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3B: TOTALS ANALYSIS (Over/Under — both models agree)                    │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    const totalsPicks = [];
    let noTotalsLine = 0;
    let totalsDisagree = 0;
    let totalsBelowFloor = 0;
    let totalsFlaggedCount = 0;
    
    for (const game of matchedGames) {
      if (!game.dratings || !game.haslametrics) continue;
      
      const totalsEval = evaluateTotals(game, totalsGames);
      
      if (!totalsEval) {
        const dr = game.dratings;
        const hs = game.haslametrics;
        const drT = dr.awayScore + dr.homeScore;
        const hsT = hs.awayScore + hs.homeScore;
        const normalizeTeam = (name) => name?.toLowerCase().replace(/[^a-z]/g, '') || '';
        const hasLine = totalsGames.some(tg => {
          const awayMatch = normalizeTeam(game.awayTeam).includes(normalizeTeam(tg.awayTeam)) ||
                            normalizeTeam(tg.awayTeam).includes(normalizeTeam(game.awayTeam));
          const homeMatch = normalizeTeam(game.homeTeam).includes(normalizeTeam(tg.homeTeam)) ||
                            normalizeTeam(tg.homeTeam).includes(normalizeTeam(game.homeTeam));
          return awayMatch && homeMatch;
        });
        
        if (!hasLine) {
          noTotalsLine++;
        } else {
          totalsDisagree++;
          console.log(`   ❌ ${game.awayTeam} @ ${game.homeTeam} — Models disagree (DR: ${Math.round(drT)}, HS: ${Math.round(hsT)})`);
        }
        continue;
      }
      
      const mot = totalsEval.marginOverTotal;
      const tierInfo = getMOTTier(mot);
      
      if (!tierInfo) {
        totalsBelowFloor++;
        console.log(`   ⬇️  ${game.awayTeam} @ ${game.homeTeam} — ${totalsEval.direction} MOT +${mot} < ${MOT_FLOOR}`);
        continue;
      }
      
      // LINE MOVEMENT GATE for totals
      const adjustedTotalUnits = applyMovementGate(tierInfo.units, totalsEval.movementTier);
      
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      
      if (adjustedTotalUnits === null) {
        totalsFlaggedCount++;
        const mvStr = totalsEval.lineMovement != null ? `${totalsEval.lineMovement > 0 ? '+' : ''}${totalsEval.lineMovement}` : '?';
        console.log(`   🚫 ${totalsEval.direction} ${totalsEval.marketTotal} — MOT +${mot} FLAGGED (line moved ${mvStr}, opener: ${totalsEval.openerTotal}) (${game.awayTeam} @ ${game.homeTeam})`);
      } else {
        tierInfo.units = adjustedTotalUnits;
        const mvTag = totalsEval.movementTier === 'CONFIRM' ? '🟢 STEAM' : totalsEval.movementTier === 'NEUTRAL' ? '⚪' : '';
        console.log(`   ✅ ${totalsEval.direction} ${totalsEval.marketTotal} — MOT +${mot} → ${tierInfo.units}u [${tierInfo.tier}] ${mvTag} (${game.awayTeam} @ ${game.homeTeam})`);
      }
      
      totalsPicks.push({
        game,
        totalsData: totalsEval,
        prediction: (prediction && !prediction.error) ? prediction : null,
      });
    }
    
    totalsPicks.sort((a, b) => b.totalsData.marginOverTotal - a.totalsData.marginOverTotal);
    
    console.log(`\n   📊 Games with totals lines: ${totalsGames.length}`);
    console.log(`   ❌ No totals line: ${noTotalsLine}`);
    console.log(`   ❌ Models disagree: ${totalsDisagree}`);
    console.log(`   ⬇️  Below MOT floor (${MOT_FLOOR}): ${totalsBelowFloor}`);
    console.log(`   🚫 FLAGGED (line moved against): ${totalsFlaggedCount}`);
    console.log(`   ✅ QUALIFYING TOTALS PICKS: ${totalsPicks.length}\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: SAVE ALL PICKS TO FIREBASE
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 4: SAVING PICKS TO FIREBASE (ATS + TOTALS @ -110)                       │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    let created = 0, createdFlagged = 0, updated = 0, stable = 0, killed = 0, skippedATS = 0;
    let totalsCreated = 0, totalsCreatedFlagged = 0, totalsUpdated = 0, totalsStable = 0, totalsKilled = 0, totalsSkipped = 0;
    
    // Save ATS picks
    if (picks.length === 0) {
      console.log('   ⚠️  No ATS picks today.\n');
    } else {
      console.log('   ── ATS PICKS ─────────────────────────────────────────────────');
      for (const { game, sideData, prediction } of picks) {
        const result = await savePick(db, game, sideData, prediction);
        if (result.action === 'created') created++;
        else if (result.action === 'created_flagged') createdFlagged++;
        else if (result.action === 'updated') updated++;
        else if (result.action === 'killed') killed++;
        else if (result.action === 'stable') stable++;
        else skippedATS++;
      }
    }
    
    // Save Totals picks
    if (totalsPicks.length === 0) {
      console.log('   ⚠️  No totals picks today.\n');
    } else {
      console.log('\n   ── TOTALS PICKS ──────────────────────────────────────────────');
      for (const { game, totalsData, prediction } of totalsPicks) {
        const result = await saveTotalsPick(db, game, totalsData, prediction);
        if (result.action === 'created') totalsCreated++;
        else if (result.action === 'created_flagged') totalsCreatedFlagged++;
        else if (result.action === 'updated') totalsUpdated++;
        else if (result.action === 'killed') totalsKilled++;
        else if (result.action === 'stable') totalsStable++;
        else totalsSkipped++;
      }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════════════
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    PRIME PICKS V7 SUMMARY                                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`   ── ATS (Spread) ────────────────────────────────────────────`);
    console.log(`   Evaluated: ${picks.length} | New: ${created} | Watching: ${createdFlagged} | Updated: ${updated} | Stable: ${stable} | Killed: ${killed}`);
    
    // Filter to only LIVE picks (not FLAGGED) for summary
    const livePicks = picks.filter(p => p.sideData.movementTier !== 'FLAGGED');
    const liveTotals = totalsPicks.filter(p => p.totalsData.movementTier !== 'FLAGGED');
    
    if (livePicks.length > 0) {
      const tierNames = ['MAXIMUM', 'ELITE', 'STRONG', 'SOLID', 'BASE'];
      const tierIcons = { MAXIMUM: '💎', ELITE: '🔥', STRONG: '💪', SOLID: '📊', BASE: '📌' };
      
      for (const tName of tierNames) {
        const tierArr = livePicks.filter(p => {
          const t = getMOSTier(p.sideData.marginOverSpread);
          const adj = applyMovementGate(t?.units, p.sideData.movementTier);
          return t?.tier === tName && adj != null;
        });
        if (tierArr.length === 0) continue;
        const tInfo = getMOSTier(tierArr[0].sideData.marginOverSpread);
        const adjUnits = applyMovementGate(tInfo.units, tierArr[0].sideData.movementTier);
        const starStr = '★'.repeat(adjUnits) + '☆'.repeat(5 - adjUnits);
        console.log(`   ${tierIcons[tName]} ${starStr} ${tName} (${adjUnits}u): ${tierArr.length} pick${tierArr.length > 1 ? 's' : ''}`);
        tierArr.forEach(p => {
          const mvLabel = p.sideData.movementTier === 'CONFIRM' ? ' 🟢 STEAM' : '';
          console.log(`      → ${p.sideData.teamName} ${p.sideData.spread} @ -110 [${p.sideData.isFavorite ? 'FAV' : 'DOG'}] MOS +${p.sideData.marginOverSpread}${mvLabel}`);
        });
      }
      
      const favPicks = livePicks.filter(p => p.sideData.isFavorite);
      const dogPicks = livePicks.filter(p => !p.sideData.isFavorite);
      const atsUnits = livePicks.reduce((s, p) => {
        const t = getMOSTier(p.sideData.marginOverSpread);
        return s + (applyMovementGate(t.units, p.sideData.movementTier) || 0);
      }, 0);
      console.log(`   Live: ${livePicks.length} | Favorites: ${favPicks.length} | Underdogs: ${dogPicks.length} | Total: ${atsUnits}u`);
    } else {
      console.log(`   No live ATS picks.`);
    }
    
    console.log(`\n   ── TOTALS (O/U) ────────────────────────────────────────────`);
    console.log(`   Evaluated: ${totalsPicks.length} | New: ${totalsCreated} | Watching: ${totalsCreatedFlagged} | Updated: ${totalsUpdated} | Stable: ${totalsStable} | Killed: ${totalsKilled}`);
    
    if (liveTotals.length > 0) {
      const tierNames = ['MAXIMUM', 'ELITE', 'STRONG', 'SOLID', 'BASE'];
      const tierIcons = { MAXIMUM: '💎', ELITE: '🔥', STRONG: '💪', SOLID: '📊', BASE: '📌' };
      
      for (const tName of tierNames) {
        const tierArr = liveTotals.filter(p => {
          const t = getMOTTier(p.totalsData.marginOverTotal);
          const adj = applyMovementGate(t?.units, p.totalsData.movementTier);
          return t?.tier === tName && adj != null;
        });
        if (tierArr.length === 0) continue;
        const tInfo = getMOTTier(tierArr[0].totalsData.marginOverTotal);
        const adjUnits = applyMovementGate(tInfo.units, tierArr[0].totalsData.movementTier);
        const starStr = '★'.repeat(adjUnits) + '☆'.repeat(5 - adjUnits);
        console.log(`   ${tierIcons[tName]} ${starStr} ${tName} (${adjUnits}u): ${tierArr.length} pick${tierArr.length > 1 ? 's' : ''}`);
        tierArr.forEach(p => {
          const mvLabel = p.totalsData.movementTier === 'CONFIRM' ? ' 🟢 STEAM' : '';
          console.log(`      → ${p.totalsData.direction} ${p.totalsData.marketTotal} [${p.game.awayTeam} @ ${p.game.homeTeam}] MOT +${p.totalsData.marginOverTotal}${mvLabel}`);
        });
      }
      
      const overPicks = liveTotals.filter(p => p.totalsData.direction === 'OVER');
      const underPicks = liveTotals.filter(p => p.totalsData.direction === 'UNDER');
      const totalsUnits = liveTotals.reduce((s, p) => {
        const t = getMOTTier(p.totalsData.marginOverTotal);
        return s + (applyMovementGate(t.units, p.totalsData.movementTier) || 0);
      }, 0);
      console.log(`   Live: ${liveTotals.length} | Overs: ${overPicks.length} | Unders: ${underPicks.length} | Total: ${totalsUnits}u`);
    } else {
      console.log(`   No live totals picks.`);
    }
    
    const liveAtsUnits = livePicks.reduce((s, p) => {
      const t = getMOSTier(p.sideData.marginOverSpread);
      return s + (applyMovementGate(t.units, p.sideData.movementTier) || 0);
    }, 0);
    const liveTotalsUnits = liveTotals.reduce((s, p) => {
      const t = getMOTTier(p.totalsData.marginOverTotal);
      return s + (applyMovementGate(t.units, p.totalsData.movementTier) || 0);
    }, 0);
    console.log(`\n   ── COMBINED ─────────────────────────────────────────────────`);
    console.log(`   Live picks: ${livePicks.length + liveTotals.length} (${livePicks.length} ATS + ${liveTotals.length} O/U)`);
    console.log(`   Total units: ${liveAtsUnits + liveTotalsUnits}u @ -110`);
    if (killed + totalsKilled > 0) {
      console.log(`   ⚠️  Killed this run: ${killed + totalsKilled} pick${killed + totalsKilled > 1 ? 's' : ''}`);
    }
    
    console.log('\n   Files updated:');
    console.log('   ✓ public/basketball_odds.md');
    console.log('   ✓ public/basketball_spreads.md');
    console.log('   ✓ public/basketball_totals.md');
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
