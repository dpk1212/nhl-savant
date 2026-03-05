/**
 * PRIME PICKS V11 — Pinnacle Base + Movement Boost
 *
 * Each unit of conviction comes from an INDEPENDENT source:
 *   GATE  → MOS (do models agree?)
 *   BASE  → Pinnacle edge (how mispriced is retail vs sharp?)
 *   BOOST → Line movement magnitude (is real money confirming us?)
 *   BONUS → DR contrarian UNDER (is DR going against its own bias?) [totals only]
 *
 * SPREADS (ATS):
 *   S1. MODELS: Both DR + HS predict cover vs opener (MOS ≥ 1.0)
 *   S2. PINNACLE: Retail ≥0.5pt softer than Pinnacle
 *   S3. MOVEMENT: Line moved ≥0.5pt toward our pick
 *
 *   3 signals: Pinn ≥1.5pt=3u, ≥1.0pt=3u, ≥0.5pt=2u  +  movement ≥1pt=+1u (cap 4u)
 *   2 signals (S1+S2): Pinn ≥1.0pt=2u, else 1u
 *   2 signals (S1+S3): 1u
 *   Movement against → KILL | 1 signal → SKIP
 *
 * TOTALS (O/U):
 *   20/80 DR/HS blend.  MOT floor = 2.0.
 *   Pinn edge: ≥1.5pt=3u, ≥1.0pt=2u, ≥0.5pt=1u  +  movement ≥1pt=+1u (cap 4u)
 *   DR contrarian UNDER: sweet (-5:-8)=+2u, moderate (-3:-5)=+1u
 *   MOT CAP: 4-6=-1u, 6+=cap 1u.  No Pinn edge → SKIP.
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

const ODDS_API_KEY = process.env.ODDS_API_KEY;

const MOS_FLOOR = 2.0;
const MOS_FLOOR_CONFIRMED = 1.5;
const MOT_FLOOR = 2.0;
const MOT_FLOOR_CONFIRMED = 1.5;

// ─── Movement Classification ────────────────────────────────────────
// Spreads: books price tightly, 1.0pt+ = real signal
// Totals:  public over-bias creates 0.5-1.0pt noise, 1.5pt+ = real signal

function classifySpreadMovement(lm) {
  if (lm == null) return { tier: 'UNKNOWN', label: 'UNKNOWN', signal: 'none' };
  const abs = Math.abs(lm);
  const dir = lm >= 0 ? 'FOR' : 'AGAINST';
  if (abs >= 2.0)  return { tier: dir === 'FOR' ? 'CONFIRM' : 'FLAGGED', label: 'STEAM',       signal: dir, magnitude: abs };
  if (abs >= 1.5)  return { tier: dir === 'FOR' ? 'CONFIRM' : 'FLAGGED', label: 'STRONG',      signal: dir, magnitude: abs };
  if (abs >= 1.0)  return { tier: dir === 'FOR' ? 'CONFIRM' : 'FLAGGED', label: 'SIGNIFICANT', signal: dir, magnitude: abs };
  if (abs >= 0.5)  return { tier: dir === 'FOR' ? 'NEUTRAL' : 'FLAGGED', label: 'MINOR',       signal: dir, magnitude: abs };
  return              { tier: 'NEUTRAL',                             label: 'NOISE',       signal: 'flat', magnitude: abs };
}

function classifyTotalsMovement(lm) {
  if (lm == null) return { tier: 'UNKNOWN', label: 'UNKNOWN', signal: 'none' };
  const abs = Math.abs(lm);
  const dir = lm >= 0 ? 'FOR' : 'AGAINST';
  if (abs >= 3.0)  return { tier: dir === 'FOR' ? 'CONFIRM' : 'FLAGGED', label: 'STEAM',       signal: dir, magnitude: abs };
  if (abs >= 2.0)  return { tier: dir === 'FOR' ? 'CONFIRM' : 'FLAGGED', label: 'STRONG',      signal: dir, magnitude: abs };
  if (abs >= 1.5)  return { tier: dir === 'FOR' ? 'CONFIRM' : 'FLAGGED', label: 'SIGNIFICANT', signal: dir, magnitude: abs };
  if (abs >= 1.0)  return { tier: 'NEUTRAL',                             label: 'MINOR',       signal: dir, magnitude: abs };
  return              { tier: 'NEUTRAL',                             label: 'NOISE',       signal: 'flat', magnitude: abs };
}

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║         PRIME PICKS V10 — Three-Signal System                                ║');
console.log('║                                                                               ║');
console.log('║  ATS:   S1 Models agree + S2 Retail softer than Pinnacle + S3 Line movement  ║');
console.log('║  O/U:   20/80 DR/HS blend • DR UNDER boost • MOT cap                         ║');
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
    const blendedMargin = (drMargin * 0.50) + (hsMargin * 0.50);
    
    const evalSpread = openerSpread ?? spread;
    const drCovers = drMargin > -evalSpread;
    const hsCovers = hsMargin > -evalSpread;
    const blendCovers = blendedMargin > -evalSpread;
    const bothCover = drCovers && hsCovers;
    
    const marginOverSpread = Math.round((blendedMargin + evalSpread) * 10) / 10;
    
    // LINE MOVEMENT: openerSpread - currentSpread
    //   Positive = line moved toward our pick (CONFIRM / STEAM)
    //   Negative = line moved against our pick (FLAGGED)
    //   DOG +4 opens, +5.5 now: 4 - 5.5 = -1.5 (FLAGGED — sharps on fav)
    //   DOG +7 opens, +5.5 now: 7 - 5.5 = +1.5 (CONFIRM — sharps on dog)
    //   FAV -4 opens, -5.5 now: -4 - (-5.5) = +1.5 (CONFIRM — sharps on fav)
    let lineMovement = null;
    let movement = { tier: 'UNKNOWN', label: 'UNKNOWN', signal: 'none' };
    if (openerSpread != null) {
      lineMovement = Math.round((openerSpread - spread) * 10) / 10;
      movement = classifySpreadMovement(lineMovement);
    }
    
    return {
      side,
      teamName,
      spread,
      openerSpread,
      lineMovement,
      movementTier: movement.tier,
      movementLabel: movement.label,
      movementSignal: movement.signal,
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
  
  const awayValid = away && away.marginOverSpread > 0 && away.bothCover;
  const homeValid = home && home.marginOverSpread > 0 && home.bothCover;
  
  if (!awayValid && !homeValid) return null;
  
  const bestSide = (!homeValid || (awayValid && away.marginOverSpread >= home.marginOverSpread)) ? away : home;
  
  return { away, home, bestSide };
}

/**
 * Evaluate totals (O/U) for a game.
 * Uses 20% DR / 80% HS blend to determine direction — HS dominates
 * because it has significantly better directional accuracy (57.5% vs 45%).
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
  const blendedTotal = (drTotal * 0.20) + (hsTotal * 0.80);
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
  let movement = { tier: 'UNKNOWN', label: 'UNKNOWN', signal: 'none' };
  if (openerTotal != null) {
    lineMovement = direction === 'OVER'
      ? Math.round((marketTotal - openerTotal) * 10) / 10
      : Math.round((openerTotal - marketTotal) * 10) / 10;
    movement = classifyTotalsMovement(lineMovement);
  }
  
  return {
    direction,
    marketTotal,
    openerTotal,
    lineMovement,
    movementTier: movement.tier,
    movementLabel: movement.label,
    movementSignal: movement.signal,
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
 * MOT tier — gate only (determines IF we bet on totals).
 * Units are now driven by Pinnacle totals edge, not MOT magnitude.
 * Higher MOT = more divergence from market = LESS trustworthy (inverse relationship).
 */
function getMOTTier(mot, floor = MOT_FLOOR) {
  if (mot >= floor) {
    if (mot >= 5)     return { tier: 'EXTREME', units: 1 };
    if (mot >= 4)     return { tier: 'HIGH',    units: 1 };
    if (mot >= 3)     return { tier: 'STRONG',  units: 1 };
    if (mot >= 2.0)   return { tier: 'BASE',    units: 1 };
    return { tier: 'MARKET_CONFIRMED', units: 1 };
  }
  return null;
}

/**
 * DR contrarian UNDER boost — applied ON TOP of MOT base units.
 *
 * DR has a systematic OVER bias (calls OVER 65% of the time).
 * When DR projects UNDER vs the opener, it's going against its own bias:
 *   - DR margin -5 to -8 vs opener: historically 100% accurate → +2u
 *   - DR margin -3 to -5 vs opener: historically 62.5% accurate → +1u
 *
 * Only fires when the 20/80 blend also says UNDER (confirming the signal).
 */
function applyDRUnderBoost(baseUnits, totalsData) {
  const { drTotal, openerTotal, direction } = totalsData;
  if (openerTotal == null || drTotal == null) return { units: baseUnits, boost: 0, drTier: null };
  if (direction !== 'UNDER') return { units: baseUnits, boost: 0, drTier: null };

  const drMargin = drTotal - openerTotal;
  if (drMargin >= 0) return { units: baseUnits, boost: 0, drTier: null };

  if (drMargin <= -5 && drMargin > -8) {
    const boost = 2;
    return { units: Math.min(baseUnits + boost, 5), boost, drTier: 'DR_SWEET_SPOT' };
  }
  if (drMargin <= -3 && drMargin > -5) {
    const boost = 1;
    return { units: Math.min(baseUnits + boost, 5), boost, drTier: 'DR_UNDER' };
  }

  return { units: baseUnits, boost: 0, drTier: null };
}

/**
 * MOT outlier dampener — cap units when diverging too far from market.
 * Higher MOT = more disagreement with market = more risk.
 * Data shows MOT 3+ accuracy drops to ~50% or worse.
 */
function applyMOTCap(units, mot) {
  if (mot >= 6) return Math.min(units, 1);
  if (mot >= 4) return Math.min(units, 2);
  return units;
}

/**
 * Adjust units based on line movement tier.
 *   CONFIRM: +1u boost (capped at 5)
 *   NEUTRAL: no change
 *   FLAGGED: hard skip (return null to reject the pick)
 */
function applyMovementGate(baseUnits, movementTier, movementLabel) {
  if (movementTier === 'FLAGGED') return null;
  if (movementTier !== 'CONFIRM') return baseUnits;
  if (movementLabel === 'STEAM')  return Math.min(baseUnits + 2, 5);
  if (movementLabel === 'STRONG') return Math.min(baseUnits + 1, 5);
  return Math.min(baseUnits + 1, 5);
}

/**
 * Estimate cover probability from margin over spread.
 * Uses normal CDF with CBB ATS std dev ~11 points.
 */
function estimateCoverProb(mos) {
  const z = mos / 11;
  return Math.max(0.01, Math.min(0.95, normalCDF(z)));
}

function normalCDF(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

/**
 * Calculate Spread EV at -110 odds (returns decimal)
 */
function calcSpreadEV(coverProb) {
  return (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
}

// ─── Sharp + Retail Spread Data ─────────────────────────────────────
// Fetches Pinnacle (sharp) + DraftKings/FanDuel/BetMGM (retail) spreads.
// Edge = retail spread softer than Pinnacle = you're getting a better number.

async function fetchSharpMarketData() {
  if (!ODDS_API_KEY) {
    console.log('   ⚠️  No ODDS_API_KEY — skipping sharp line fetch');
    return [];
  }
  try {
    const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us,eu&markets=spreads,totals&oddsFormat=american&bookmakers=pinnacle,draftkings,fanduel,betmgm,caesars`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`   ⚠️  Sharp market data fetch failed: ${res.status}`);
      return [];
    }
    const remaining = res.headers.get('x-requests-remaining');
    console.log(`   📡 Odds API credits remaining: ${remaining}`);
    const data = await res.json();
    return data.map(game => {
      const result = {
        awayTeam: game.away_team,
        homeTeam: game.home_team,
        pinnacle: null,
        retail: [],
        pinnacleTotals: null,
        retailTotals: [],
      };
      for (const bm of (game.bookmakers || [])) {
        // Spreads
        const sp = bm.markets?.find(m => m.key === 'spreads');
        if (sp) {
          const awayOut = sp.outcomes.find(o => o.name === game.away_team);
          const homeOut = sp.outcomes.find(o => o.name === game.home_team);
          if (awayOut && homeOut) {
            const entry = {
              book: bm.key,
              awaySpread: awayOut.point,
              homeSpread: homeOut.point,
              awayOdds: awayOut.price,
              homeOdds: homeOut.price,
            };
            if (bm.key === 'pinnacle') result.pinnacle = entry;
            else result.retail.push(entry);
          }
        }
        // Totals
        const tot = bm.markets?.find(m => m.key === 'totals');
        if (tot) {
          const overOut = tot.outcomes.find(o => o.name === 'Over');
          const underOut = tot.outcomes.find(o => o.name === 'Under');
          if (overOut && underOut) {
            const totEntry = {
              book: bm.key,
              total: overOut.point,
              overOdds: overOut.price,
              underOdds: underOut.price,
            };
            if (bm.key === 'pinnacle') result.pinnacleTotals = totEntry;
            else result.retailTotals.push(totEntry);
          }
        }
      }
      return result;
    });
  } catch (err) {
    console.log(`   ⚠️  Sharp market data fetch error: ${err.message}`);
    return [];
  }
}

// ─── Odds API Team Name Matching ─────────────────────────────────────
// Uses CSV column 10 (odds_api_name) for exact matching.
// Falls back to abbreviation-expansion fuzzy matching.
// Self-healing: auto-writes new mappings to CSV when fuzzy match succeeds.

const ODDS_ABBREV_EXPAND = [
  [/\bSt\b/g, 'State'],
  [/\bSE\b/g, 'Southeast'],
  [/\bSW\b/g, 'Southwest'],
  [/\bNE\b/g, 'Northeast'],
  [/\bNW\b/g, 'Northwest'],
  [/\bCSU\b/g, 'Cal State'],
  [/\bInt'l\b/g, 'International'],
  [/\bUniv\./g, 'University'],
  [/\bTenn\b/g, 'Tennessee'],
  [/\bMiss\b/g, 'Mississippi'],
  [/\bFt\./g, 'Fort'],
  [/\bMt\./g, 'Mount'],
  [/Hawai'i/g, 'Hawaii'],
];

const ODDS_ALIAS = {
  'Prairie View': 'Prairie View A&M',
  'American': 'American University',
  'Boston Univ.': 'Boston U',
};

function expandOddsAbbrevs(name) {
  let out = name;
  for (const [pat, rep] of ODDS_ABBREV_EXPAND) out = out.replace(pat, rep);
  return out;
}

function buildOddsApiLookup(csvContent) {
  if (!csvContent) return { byOddsName: new Map(), byNormLc: new Map() };

  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const oddsApiIdx = headers.indexOf('odds_api_name');
  const byOddsName = new Map();  // odds_api_name → oddstrader_name
  const byNormLc = new Map();    // normalized_name_lc → oddstrader_name

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const normName = (cols[0] || '').trim();
    const oddsTrader = (cols[1] || '').trim();
    const oddsApi = oddsApiIdx >= 0 ? (cols[oddsApiIdx] || '').trim() : '';

    const displayName = oddsTrader || normName;
    if (oddsApi && displayName) byOddsName.set(oddsApi, displayName);
    if (normName && displayName) byNormLc.set(normName.toLowerCase(), displayName);
  }

  return { byOddsName, byNormLc };
}

function resolveOddsApiTeam(oddsApiTeamName, lookup) {
  // 1. Exact CSV lookup via odds_api_name column
  const exact = lookup.byOddsName.get(oddsApiTeamName);
  if (exact) return exact;

  // 2. Strip mascot progressively, try expanded then direct at each level
  const parts = oddsApiTeamName.split(' ');
  for (let i = parts.length - 1; i >= 1; i--) {
    const school = parts.slice(0, i).join(' ');

    // Try expanded abbreviations first (so "Alabama St" → "Alabama State" wins over "Alabama")
    const expanded = expandOddsAbbrevs(school);
    if (expanded !== school) {
      const ot = lookup.byNormLc.get(expanded.toLowerCase());
      if (ot) return ot;
    }

    // Try direct match on normalized_name
    const ot = lookup.byNormLc.get(school.toLowerCase());
    if (ot) return ot;

    // Try alias map
    if (ODDS_ALIAS[school]) {
      const aliasOt = lookup.byNormLc.get(ODDS_ALIAS[school].toLowerCase());
      if (aliasOt) return aliasOt;
    }
  }

  return null;
}

function attachSharpData(matchedGames, sharpData, csvContent) {
  const lookup = buildOddsApiLookup(csvContent);
  let matched = 0;
  const unmatchedTeams = new Set();

  for (const sd of sharpData) {
    const resolvedAway = resolveOddsApiTeam(sd.awayTeam, lookup);
    const resolvedHome = resolveOddsApiTeam(sd.homeTeam, lookup);

    if (!resolvedAway) unmatchedTeams.add(sd.awayTeam);
    if (!resolvedHome) unmatchedTeams.add(sd.homeTeam);
    if (!resolvedAway || !resolvedHome) continue;

    const game = matchedGames.find(g =>
      g.awayTeam.toLowerCase() === resolvedAway.toLowerCase() &&
      g.homeTeam.toLowerCase() === resolvedHome.toLowerCase()
    );

    if (game) {
      game.sharpData = sd;
      matched++;
    }
  }

  if (unmatchedTeams.size > 0) {
    console.log(`   ⚠️  Unmatched Odds API teams (add to CSV col 10): ${[...unmatchedTeams].join(', ')}`);
  }
  return matched;
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
  const signalCount = sideData.signalCount || 0;
  const isFlagged = sideData.movementTier === 'FLAGGED' || signalCount < 2;
  const units = isFlagged ? 0 : (sideData.units || 1);
  const tier = signalCount === 3 ? 'THREE_SIGNAL' : signalCount === 2 ? 'TWO_SIGNAL' : 'INSUFFICIENT';
  
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    const prev = existingBet.data();
    const prevTier = prev.spreadAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const newTier = sideData.movementTier;
    const tierChanged = prevTier !== newTier;
    const lockedSpread = prev.bet?.spread;
    
    const updateData = {
      'spreadAnalysis.currentSpread': sideData.spread,
      'spreadAnalysis.lineMovement': sideData.lineMovement,
      'spreadAnalysis.movementTier': newTier,
      'spreadAnalysis.marginOverSpread': mos,
      'betRecommendation.lineMovement': sideData.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.marginOverSpread': mos,
      lastUpdatedAt: Date.now(),
    };

    if (!prev.isLocked) {
      updateData['spreadAnalysis.spread'] = sideData.spread;
      updateData['betRecommendation.atsSpread'] = sideData.spread;
      updateData['bet.spread'] = sideData.spread;
    }

    // Always update signal metadata
    updateData['spreadAnalysis.signalCount'] = signalCount;
    updateData['spreadAnalysis.pinnEdgePts'] = sideData.pinnEdgePts || 0;
    updateData['spreadAnalysis.bestBook'] = sideData.bestBook || null;
    updateData['spreadAnalysis.bestBookSpread'] = sideData.bestBookSpread || null;
    updateData['spreadAnalysis.pinnacleSpread'] = sideData.pinnSpread || null;

    const prevUnits = prev.bet?.units || prev.prediction?.unitSize || 0;
    
    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${pickTeam} ${lockedSpread || sideData.spread} — line moved against but bet is locked | ${prevUnits}u`);
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

    // Locked bets can upgrade units, never downgrade
    const shouldUpgrade = prev.isLocked && units > prevUnits;
    if (shouldUpgrade) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData['spreadAnalysis.unitTier'] = tier;
      updateData['betStatus'] = 'BET_NOW';
      await updateDoc(betRef, updateData);
      console.log(`   ⬆️  UPGRADED: ${pickTeam} ${lockedSpread} — ${prevUnits}u → ${units}u [${tier}] | signals ${signalCount} (locked)`);
      return { action: 'updated', betId };
    }
    
    if (tierChanged || newTier === 'CONFIRM') {
      if (!prev.isLocked) {
        updateData['bet.units'] = units;
        updateData['betRecommendation.atsUnits'] = units;
        updateData['prediction.unitSize'] = units;
        updateData['spreadAnalysis.unitTier'] = tier;
        const newStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
        updateData['betStatus'] = newStatus;
        if (newStatus === 'BET_NOW') {
          updateData.isLocked = true;
          updateData.lockedAt = Date.now();
        }
      }
      await updateDoc(betRef, updateData);
      const displayUnits = prev.isLocked ? prevUnits : units;
      const displaySpread = prev.isLocked ? lockedSpread : sideData.spread;
      const arrow = newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED';
      console.log(`   ${arrow}: ${pickTeam} ${displaySpread} — ${prevTier} → ${newTier} | ${displayUnits}u [${tier}]${prev.isLocked ? ' (locked)' : ''}`);
      return { action: 'updated', betId };
    }
    
    if (!prev.isLocked) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
    }
    await updateDoc(betRef, updateData);
    const stableUnits = prev.isLocked ? prevUnits : units;
    const stableSpread = prev.isLocked ? lockedSpread : sideData.spread;
    console.log(`   🔒 Stable: ${pickTeam} ${stableSpread} — still ${newTier} | ${stableUnits}u${prev.isLocked ? ' (locked)' : ''}`);
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
      movementLabel: sideData.movementLabel,
      movementSignal: sideData.movementSignal,
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
      signalCount: sideData.signalCount || 0,
      bestBook: sideData.bestBook || null,
      bestBookSpread: sideData.bestBookSpread || null,
      pinnacleSpread: sideData.pinnSpread || null,
      pinnEdgePts: sideData.pinnEdgePts || 0,
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
      spreadEV: prediction?.spreadEV || null,
      coverProb: prediction?.coverProb || null,
      signalCount: prediction?.signalCount || null,
      pinnEdgePts: prediction?.pinnEdgePts || null,
      bestBook: prediction?.bestBook || null,
    },
    
    pinnacle: game.sharpData?.pinnacle ? {
      awaySpread: game.sharpData.pinnacle.awaySpread,
      homeSpread: game.sharpData.pinnacle.homeSpread,
      awayOdds: game.sharpData.pinnacle.awayOdds,
      homeOdds: game.sharpData.pinnacle.homeOdds,
    } : null,
    
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
    betStatus: 'BET_NOW',
    isLocked: true,
    lockedAt: Date.now(),
    firstRecommendedAt: Date.now(),
    lastUpdatedAt: Date.now(),
    source: 'THREE_SIGNAL_V10',
    
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
      movementLabel: sideData.movementLabel,
    },
    
    barttorvik: game.barttorvik || null,
    
    lineHistory: [{
      t: Date.now(),
      spread: sideData.openerSpread ?? sideData.spread,
      total: null
    }]
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

  const isFlagged = totalsData.finalUnits === null || totalsData.movementTier === 'FLAGGED' || totalsData.pinnSkipped;
  const units = isFlagged ? 0 : (totalsData.finalUnits || 1);
  const drBoostInfo = applyDRUnderBoost(1, totalsData);
  const tier = drBoostInfo.drTier || tierInfo.tier;
  
  const existingBet = await getDoc(betRef);
  if (existingBet.exists()) {
    const prev = existingBet.data();
    const prevTier = prev.totalsAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const newTier = totalsData.movementTier;
    const tierChanged = prevTier !== newTier;
    const lockedTotal = prev.bet?.total;
    
    const updateData = {
      'totalsAnalysis.currentTotal': totalsData.marketTotal,
      'totalsAnalysis.lineMovement': totalsData.lineMovement,
      'totalsAnalysis.movementTier': newTier,
      'totalsAnalysis.marginOverTotal': mot,
      'betRecommendation.lineMovement': totalsData.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.marginOverTotal': mot,
      lastUpdatedAt: Date.now(),
    };

    if (!prev.isLocked) {
      updateData['totalsAnalysis.marketTotal'] = totalsData.marketTotal;
      updateData['betRecommendation.totalLine'] = totalsData.marketTotal;
      updateData['bet.total'] = totalsData.marketTotal;
    }

    // Store Pinnacle totals metadata
    updateData['totalsAnalysis.pinnacleTotal'] = totalsData.pinnTotal || null;
    updateData['totalsAnalysis.pinnTotalEdge'] = totalsData.pinnTotalEdge || 0;
    updateData['totalsAnalysis.hasPinnEdge'] = totalsData.hasPinnEdge || false;
    updateData['totalsAnalysis.bestTotalBook'] = totalsData.bestTotalBook || null;

    const prevUnits = prev.bet?.units || prev.prediction?.unitSize || 0;
    
    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${totalsData.direction} ${lockedTotal || totalsData.marketTotal} — flagged but bet is locked | ${prevUnits}u (${game.awayTeam} @ ${game.homeTeam})`);
        return { action: 'stable', betId };
      }
      updateData['betStatus'] = 'KILLED';
      updateData['bet.units'] = 0;
      updateData['betRecommendation.totalUnits'] = 0;
      updateData['prediction.unitSize'] = 0;
      await updateDoc(betRef, updateData);
      console.log(`   💀 KILLED: ${totalsData.direction} ${totalsData.marketTotal} — was ${prevTier}, now FLAGGED (${game.awayTeam} @ ${game.homeTeam})`);
      return { action: 'killed', betId };
    }

    // Locked bets can upgrade units, never downgrade
    const shouldUpgrade = prev.isLocked && units > prevUnits;
    if (shouldUpgrade) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.totalUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData['totalsAnalysis.unitTier'] = tier;
      updateData['betStatus'] = 'BET_NOW';
      await updateDoc(betRef, updateData);
      console.log(`   ⬆️  UPGRADED: ${totalsData.direction} ${lockedTotal} — ${prevUnits}u → ${units}u [${tier}] (locked) (${game.awayTeam} @ ${game.homeTeam})`);
      return { action: 'updated', betId };
    }
    
    if (tierChanged || newTier === 'CONFIRM') {
      if (!prev.isLocked) {
        updateData['bet.units'] = units;
        updateData['betRecommendation.totalUnits'] = units;
        updateData['prediction.unitSize'] = units;
        updateData['totalsAnalysis.unitTier'] = tier;
        const newStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
        updateData['betStatus'] = newStatus;
        if (newStatus === 'BET_NOW') {
          updateData.isLocked = true;
          updateData.lockedAt = Date.now();
        }
      }
      await updateDoc(betRef, updateData);
      const displayUnits = prev.isLocked ? prevUnits : units;
      const displayTotal = prev.isLocked ? lockedTotal : totalsData.marketTotal;
      const arrow = newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED';
      console.log(`   ${arrow}: ${totalsData.direction} ${displayTotal} — ${prevTier} → ${newTier} | ${displayUnits}u [${tier}]${prev.isLocked ? ' (locked)' : ''} (${game.awayTeam} @ ${game.homeTeam})`);
      return { action: 'updated', betId };
    }
    
    if (!prev.isLocked) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.totalUnits'] = units;
      updateData['prediction.unitSize'] = units;
    }
    await updateDoc(betRef, updateData);
    const stableUnits = prev.isLocked ? prevUnits : units;
    const stableTotal = prev.isLocked ? lockedTotal : totalsData.marketTotal;
    console.log(`   🔒 Stable: ${totalsData.direction} ${stableTotal} — still ${newTier} | ${stableUnits}u${prev.isLocked ? ' (locked)' : ''} (${game.awayTeam} @ ${game.homeTeam})`);
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
      pinnacleTotal: totalsData.pinnTotal || null,
      pinnTotalEdge: totalsData.pinnTotalEdge || 0,
      bestTotalBook: totalsData.bestTotalBook || null,
      bestTotalBookLine: totalsData.bestTotalBookLine || null,
      hasPinnEdge: totalsData.hasPinnEdge || false,
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
    
    barttorvik: game.barttorvik || null,
    
    lineHistory: [{
      t: Date.now(),
      spread: null,
      total: totalsData.openerTotal ?? totalsData.marketTotal
    }]
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
  const blendedMargin = (drRawMargin * 0.50) + (hsRawMargin * 0.50);
  const drTotal = dr.awayScore + dr.homeScore;
  const hsTotal = hs.awayScore + hs.homeScore;
  const blendedTotal = (drTotal * 0.20) + (hsTotal * 0.80);

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

  const currentModelData = {
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
  };

  const currentOpeners = {
    awaySpread: spreadGame?.awaySpread ?? null,
    homeSpread: spreadGame?.homeSpread ?? null,
    awayOpener: spreadGame?.awayOpener ?? null,
    homeOpener: spreadGame?.homeOpener ?? null,
    total: totalsGame?.total ?? null,
    openerTotal: totalsGame?.openerTotal ?? null,
  };

  const currentPrediction = prediction ? {
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
    bestBet: prediction.bestBet ?? null,
    bestTeam: prediction.bestTeam ?? null,
    bestOdds: prediction.bestOdds ?? null,
    grade: prediction.grade ?? null,
  } : null;

  const pinnacleData = game.sharpData?.pinnacle ? {
    awaySpread: game.sharpData.pinnacle.awaySpread,
    homeSpread: game.sharpData.pinnacle.homeSpread,
    awayOdds: game.sharpData.pinnacle.awayOdds,
    homeOdds: game.sharpData.pinnacle.homeOdds,
  } : null;

  const evalRef = doc(db, 'basketball_bets', evalId);
  const existingEval = await getDoc(evalRef);

  if (existingEval.exists()) {
    await updateDoc(evalRef, {
      latestModelData: currentModelData,
      latestPrediction: currentPrediction,
      latestOpeners: currentOpeners,
      pinnacle: pinnacleData,
      barttorvik: game.barttorvik || null,
      lastUpdatedAt: Date.now(),
      lastRefetchAt: Date.now(),
    });
    console.log(`   🔒 Eval preserved: ${evalId} (original modelData kept, latest stored separately)`);
  } else {
    const evalData = {
      id: evalId,
      type: 'EVALUATION',
      date,
      game: {
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        gameTime: game.odds?.gameTime || 'TBD',
      },
      modelData: currentModelData,
      openers: currentOpeners,
      prediction: currentPrediction,
      pinnacle: pinnacleData,
      barttorvik: game.barttorvik || null,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
    };

    await setDoc(evalRef, evalData);
  }
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
    
    // 1e. Fetch sharp (Pinnacle) + retail spread lines
    console.log('📊 Fetching Pinnacle + retail lines (spreads + totals)...');
    const sharpMarketData = await fetchSharpMarketData();
    console.log(`   ✅ Sharp + retail data: ${sharpMarketData.length} games\n`);
    
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
    console.log(`   ✅ Matched games: ${matchedGames.length}`);
    
    // Attach sharp + retail data (spreads + totals) to matched games
    const sharpMatched = attachSharpData(matchedGames, sharpMarketData, csvContent);
    console.log(`   🎯 Sharp market data matched: ${sharpMatched}/${matchedGames.length}\n`);
    
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
    console.log('│ STEP 3: THREE-SIGNAL SYSTEM (both sides of every game)                       │');
    console.log('│         S1: Models agree on cover  S2: Retail softer than Pinnacle            │');
    console.log('│         S3: Line moved toward pick  →  2+ signals = BET                       │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    const picks = [];
    let noModelData = 0;
    let noSpreadData = 0;
    let belowFloor = 0;
    let flaggedCount = 0;
    let oneSignalOnly = 0;
    
    for (const game of matchedGames) {
      if (!game.dratings || !game.haslametrics) {
        noModelData++;
        continue;
      }
      
      const evaluation = evaluateBothSides(game, spreadGames);
      
      if (!evaluation) {
        noSpreadData++;
        continue;
      }
      
      const best = evaluation.bestSide;
      const mos = best.marginOverSpread;
      
      if (mos < 1.0) {
        belowFloor++;
        continue;
      }
      
      // ── SIGNAL 1: MODELS (both DR + HS predict cover) ✅ ──────────
      // Already guaranteed by evaluateBothSides (bothCover required)
      const signal1 = true;
      
      // ── SIGNAL 2: PINNACLE (retail softer than sharp line) ────────
      let signal2 = false;
      let bestBook = null;
      let bestBookSpread = null;
      let pinnSpread = null;
      let pinnEdgePts = 0;
      if (game.sharpData?.pinnacle) {
        pinnSpread = best.side === 'away'
          ? game.sharpData.pinnacle.awaySpread
          : game.sharpData.pinnacle.homeSpread;
        for (const retail of game.sharpData.retail) {
          const retailSp = best.side === 'away' ? retail.awaySpread : retail.homeSpread;
          const edge = retailSp - pinnSpread;
          if (edge >= 0.5 && edge > pinnEdgePts) {
            pinnEdgePts = Math.round(edge * 10) / 10;
            bestBook = retail.book;
            bestBookSpread = retailSp;
            signal2 = true;
          }
        }
      }
      
      // ── SIGNAL 3: LINE MOVEMENT (moved toward our pick) ───────────
      const signal3For = best.movementTier === 'CONFIRM';
      const signal3Against = best.movementTier === 'FLAGGED';
      
      // ── DECISION ──────────────────────────────────────────────────
      if (signal3Against) {
        flaggedCount++;
        const mvStr = best.lineMovement != null ? `${best.lineMovement > 0 ? '+' : ''}${best.lineMovement}` : '?';
        console.log(`   🚫 ${best.teamName} ${best.spread} — MOS +${mos} | Movement ${mvStr} AGAINST → SKIP`);
        continue;
      }
      
      const signalCount = 1 + (signal2 ? 1 : 0) + (signal3For ? 1 : 0);
      
      if (signalCount < 2) {
        oneSignalOnly++;
        const pinnInfo = pinnSpread != null ? `Pinn ${pinnSpread > 0 ? '+' : ''}${pinnSpread}` : 'no Pinn data';
        console.log(`   📋 ${best.teamName} ${best.spread} — MOS +${mos} | ${pinnInfo} | Movement flat → 1 signal only, SKIP`);
        continue;
      }
      
      // SIZE: Pinnacle edge = base, line movement magnitude = boost
      const mvMag = Math.abs(best.lineMovement || 0);
      let units;
      if (signalCount === 3) {
        // Base from Pinnacle edge
        if (pinnEdgePts >= 1.5) units = 3;
        else if (pinnEdgePts >= 1.0) units = 3;
        else units = 2;
        // Movement boost: ≥1.0pt move = +1u (cap 4u)
        if (mvMag >= 1.0) units = Math.min(units + 1, 4);
      } else if (signal2) {
        units = pinnEdgePts >= 1.0 ? 2 : 1;
      } else {
        units = 1;
      }
      
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      const coverProb = estimateCoverProb(mos);
      const spreadEV = calcSpreadEV(coverProb);
      const spreadEVPct = Math.round(spreadEV * 1000) / 10;
      
      const favDog = best.isFavorite ? 'FAV' : 'DOG';
      const grade = signalCount === 3 ? '🔥' : '⚡';
      const bookTag = bestBook ? ` @ ${bestBook.toUpperCase()} ${bestBookSpread > 0 ? '+' : ''}${bestBookSpread}` : '';
      const pinnTag = pinnSpread != null ? ` | Pinn ${pinnSpread > 0 ? '+' : ''}${pinnSpread}` : '';
      const mvTag = signal3For ? ' | Movement ✅' : '';
      
      console.log(`   ${grade} ${best.teamName} (${best.side.toUpperCase()}) ${best.spread} — MOS +${mos} | ${signalCount} signals | ${units}u ${favDog}${pinnTag}${bookTag}${mvTag} | SpreadEV ${spreadEVPct}%`);
      
      // Store signal data on prediction for Firebase
      if (prediction && !prediction.error) {
        prediction.spreadEV = spreadEVPct;
        prediction.coverProb = Math.round(coverProb * 1000) / 10;
        prediction.signalCount = signalCount;
        prediction.pinnEdgePts = pinnEdgePts;
        prediction.bestBook = bestBook;
      }
      
      picks.push({
        game,
        sideData: { ...best, units, signalCount, bestBook, bestBookSpread, pinnSpread, pinnEdgePts },
        prediction: (prediction && !prediction.error) ? prediction : null,
        otherSide: best === evaluation.away ? evaluation.home : evaluation.away,
      });
    }
    
    picks.sort((a, b) => b.sideData.signalCount - a.sideData.signalCount || b.sideData.marginOverSpread - a.sideData.marginOverSpread);
    
    console.log(`\n   📊 Games analyzed: ${matchedGames.length}`);
    console.log(`   ❌ No model data / no cover: ${noModelData + noSpreadData}`);
    console.log(`   ⬇️  Below MOS floor: ${belowFloor}`);
    console.log(`   🚫 Movement against — SKIPPED: ${flaggedCount}`);
    console.log(`   📋 One signal only — SKIPPED: ${oneSignalOnly}`);
    console.log(`   ✅ QUALIFYING PICKS (2+ signals): ${picks.length}\n`);
    
    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3B: EVALUATE TOTALS (O/U — 20/80 DR/HS blend for direction)
    // ═══════════════════════════════════════════════════════════════════════
    console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ STEP 3B: TOTALS ANALYSIS (Over/Under — 20% DR / 80% HS blend)                │');
    console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');
    
    const totalsPicks = [];
    let noTotalsLine = 0;
    let totalsBelowFloor = 0;
    let totalsFlaggedCount = 0;
    
    let pinnTotalsSkipped = 0;
    
    for (const game of matchedGames) {
      if (!game.dratings || !game.haslametrics) continue;
      
      const totalsEval = evaluateTotals(game, totalsGames);
      
      if (!totalsEval) {
        noTotalsLine++;
        continue;
      }
      
      const mot = totalsEval.marginOverTotal;
      const tierInfo = getMOTTier(mot);
      
      if (!tierInfo) {
        totalsBelowFloor++;
        continue;
      }
      
      // ── PINNACLE TOTALS CHECK ─────────────────────────────────────
      // OVER: want retail total LOWER than Pinnacle (buying cheap)
      // UNDER: want retail total HIGHER than Pinnacle (selling high)
      let pinnTotalEdge = 0;
      let bestTotalBook = null;
      let bestTotalBookLine = null;
      let pinnTotal = null;
      let hasPinnEdge = false;
      
      if (game.sharpData?.pinnacleTotals) {
        pinnTotal = game.sharpData.pinnacleTotals.total;
        for (const r of game.sharpData.retailTotals) {
          let edge;
          if (totalsEval.direction === 'OVER') {
            edge = pinnTotal - r.total;
          } else {
            edge = r.total - pinnTotal;
          }
          if (edge >= 0.5 && edge > pinnTotalEdge) {
            pinnTotalEdge = Math.round(edge * 10) / 10;
            bestTotalBook = r.book;
            bestTotalBookLine = r.total;
            hasPinnEdge = true;
          }
        }
      }
      
      // Store Pinnacle totals data on eval
      totalsEval.pinnTotal = pinnTotal;
      totalsEval.pinnTotalEdge = pinnTotalEdge;
      totalsEval.bestTotalBook = bestTotalBook;
      totalsEval.bestTotalBookLine = bestTotalBookLine;
      totalsEval.hasPinnEdge = hasPinnEdge;
      
      // ── TOTALS SIZING: Pinnacle base + movement boost + DR boost ──
      // Step 1: Base units from Pinnacle totals edge
      let baseUnits;
      if (hasPinnEdge) {
        if (pinnTotalEdge >= 1.5) baseUnits = 3;
        else if (pinnTotalEdge >= 1.0) baseUnits = 2;
        else baseUnits = 1;
      } else if (pinnTotal == null) {
        baseUnits = 1;
      } else {
        pinnTotalsSkipped++;
        console.log(`   📋 ${totalsEval.direction} ${totalsEval.marketTotal} — MOT +${mot} | NO Pinn edge | Pinn ${pinnTotal} → SKIP (${game.awayTeam} @ ${game.homeTeam})`);
        totalsEval.pinnSkipped = true;
        totalsPicks.push({ game, totalsData: totalsEval, prediction: null });
        continue;
      }

      // Step 2: Movement boost — line moved ≥1.0pt for us = +1u (cap 4u)
      const totalsMvMag = Math.abs(totalsEval.lineMovement || 0);
      if (totalsEval.movementTier === 'CONFIRM' && totalsMvMag >= 1.0) {
        baseUnits = Math.min(baseUnits + 1, 4);
      }

      // Step 3: DR contrarian UNDER boost (additive)
      const drBoost = applyDRUnderBoost(baseUnits, totalsEval);

      // Step 4: MOT outlier cap (penalize divergence from market)
      const cappedUnits = applyMOTCap(drBoost.units, mot);

      // Step 5: Movement gate (FLAGGED → kill)
      const adjustedTotalUnits = (totalsEval.movementTier === 'FLAGGED') ? null : cappedUnits;
      
      const prediction = edgeCalculator.calculateEnsemblePrediction(game);
      
      const drTag = drBoost.drTier ? ` 🔥 ${drBoost.drTier} (+${drBoost.boost}u)` : '';
      const capTag = cappedUnits < drBoost.units ? ` ⚠️  MOT_CAP(${drBoost.units}→${cappedUnits})` : '';
      const pinnTag = hasPinnEdge
        ? ` | Pinn ${pinnTotal} → ${bestTotalBook?.toUpperCase()} ${bestTotalBookLine} (+${pinnTotalEdge}pt edge)`
        : (pinnTotal != null ? ` | Pinn ${pinnTotal}` : '');
      
      if (adjustedTotalUnits === null) {
        totalsFlaggedCount++;
        const mvStr = totalsEval.lineMovement != null ? `${totalsEval.lineMovement > 0 ? '+' : ''}${totalsEval.lineMovement}` : '?';
        console.log(`   🚫 ${totalsEval.direction} ${totalsEval.marketTotal} — MOT +${mot} FLAGGED (line moved ${mvStr})${drTag}${pinnTag} (${game.awayTeam} @ ${game.homeTeam})`);
      } else {
        totalsEval.finalUnits = adjustedTotalUnits;
        const finalTier = drBoost.drTier || tierInfo.tier;
        const mvTag = totalsEval.movementTier === 'CONFIRM' ? '🟢 STEAM' : '';
        const pinnConfirm = hasPinnEdge ? ' ✅ PINN' : '';
        console.log(`   ✅ ${totalsEval.direction} ${totalsEval.marketTotal} — MOT +${mot} → ${adjustedTotalUnits}u [${finalTier}]${drTag}${capTag}${pinnTag}${pinnConfirm} ${mvTag} (${game.awayTeam} @ ${game.homeTeam})`);
      }
      
      totalsPicks.push({
        game,
        totalsData: totalsEval,
        prediction: (prediction && !prediction.error) ? prediction : null,
      });
    }
    
    totalsPicks.sort((a, b) => b.totalsData.marginOverTotal - a.totalsData.marginOverTotal);
    
    console.log(`\n   📊 Games with totals lines: ${totalsGames.length}`);
    console.log(`   ❌ No totals line / no model data: ${noTotalsLine}`);
    console.log(`   ⬇️  Below MOT floor (${MOT_FLOOR}): ${totalsBelowFloor}`);
    console.log(`   🚫 FLAGGED (line moved against): ${totalsFlaggedCount}`);
    console.log(`   📋 No Pinnacle edge — SKIPPED: ${pinnTotalsSkipped}`);
    console.log(`   ✅ QUALIFYING TOTALS PICKS: ${totalsPicks.filter(p => !p.totalsData.pinnSkipped && p.totalsData.movementTier !== 'FLAGGED').length}\n`);
    
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
        if (totalsData.pinnSkipped) continue;
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
    console.log('║         PRIME PICKS V10 — Three-Signal System                                ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`   ── ATS (Spread) ────────────────────────────────────────────`);
    console.log(`   Evaluated: ${picks.length} | New: ${created} | Watching: ${createdFlagged} | Updated: ${updated} | Stable: ${stable} | Killed: ${killed}`);
    
    // Filter to only LIVE picks (not FLAGGED) for summary
    const livePicks = picks.filter(p => p.sideData.movementTier !== 'FLAGGED');
    const liveTotals = totalsPicks.filter(p => p.totalsData.movementTier !== 'FLAGGED' && !p.totalsData.pinnSkipped);
    
    if (livePicks.length > 0) {
      const threeSignal = livePicks.filter(p => p.sideData.signalCount === 3);
      const twoSignal = livePicks.filter(p => p.sideData.signalCount === 2);
      
      if (threeSignal.length > 0) {
        console.log(`   🔥 THREE SIGNALS (${threeSignal.length} pick${threeSignal.length > 1 ? 's' : ''}):`);
        threeSignal.forEach(p => {
          const bookTag = p.sideData.bestBook ? ` @ ${p.sideData.bestBook.toUpperCase()} ${p.sideData.bestBookSpread > 0 ? '+' : ''}${p.sideData.bestBookSpread}` : '';
          console.log(`      → ${p.sideData.teamName} ${p.sideData.spread} → ${p.sideData.units}u [${p.sideData.isFavorite ? 'FAV' : 'DOG'}] MOS +${p.sideData.marginOverSpread}${bookTag}`);
        });
      }
      if (twoSignal.length > 0) {
        console.log(`   ⚡ TWO SIGNALS (${twoSignal.length} pick${twoSignal.length > 1 ? 's' : ''}):`);
        twoSignal.forEach(p => {
          const bookTag = p.sideData.bestBook ? ` @ ${p.sideData.bestBook.toUpperCase()} ${p.sideData.bestBookSpread > 0 ? '+' : ''}${p.sideData.bestBookSpread}` : '';
          console.log(`      → ${p.sideData.teamName} ${p.sideData.spread} → ${p.sideData.units}u [${p.sideData.isFavorite ? 'FAV' : 'DOG'}] MOS +${p.sideData.marginOverSpread}${bookTag}`);
        });
      }
      
      const favPicks = livePicks.filter(p => p.sideData.isFavorite);
      const dogPicks = livePicks.filter(p => !p.sideData.isFavorite);
      const atsUnits = livePicks.reduce((s, p) => s + (p.sideData.units || 1), 0);
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
    
    const liveAtsUnits = livePicks.reduce((s, p) => s + (p.sideData.units || 1), 0);
    const liveTotalsUnits = liveTotals.reduce((s, p) => {
      const t = getMOTTier(p.totalsData.marginOverTotal);
      return s + (t ? (applyMovementGate(t.units, p.totalsData.movementTier) || 0) : 0);
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
