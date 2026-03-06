/**
 * CHECK LINE MOVEMENT V11 — Pinnacle Base + Movement Boost Monitor
 *
 * The morning fetch saves model evaluations for EVERY game to Firebase.
 * This script re-evaluates using the Three-Signal System:
 *   S1: Both models agree on cover (from stored evaluations)
 *   S2: Retail book softer than Pinnacle by ≥0.5pt (live fetch)
 *   S3: Line moved ≥0.5pt toward pick since open
 *
 * Decision: 3 signals = bet (size by Pinnacle edge), 2 = 1u, against = skip
 *
 * Usage: npm run check-lines
 */

import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, setDoc, getDoc, doc, arrayUnion } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const ODDS_API_KEY = process.env.ODDS_API_KEY;
if (!ODDS_API_KEY) {
  console.error('❌ Missing ODDS_API_KEY in .env');
  process.exit(1);
}

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

// ─── Constants & Tier Functions ──────────────────────────────────────
//
// When market confirms thesis (CONFIRM), we accept a lower edge
// because we have two signals: model + sharp money agreement.
// Standard thresholds apply when no confirmation (NEUTRAL).

const MOS_FLOOR = 2.0;
const MOS_FLOOR_CONFIRMED = 1.5;
const MOT_FLOOR = 2.0;
const MOT_FLOOR_CONFIRMED = 1.5;

function getMOSTier(mos, floor = MOS_FLOOR) {
  if (mos >= 4)     return { tier: 'MAXIMUM', units: 5 };
  if (mos >= 3)     return { tier: 'ELITE',   units: 4 };
  if (mos >= 2.5)   return { tier: 'STRONG',  units: 3 };
  if (mos >= 2.25)  return { tier: 'SOLID',   units: 2 };
  if (mos >= 2.0)   return { tier: 'BASE',    units: 1 };
  if (mos >= floor)  return { tier: 'MARKET_CONFIRMED', units: 1 };
  return null;
}

function getMOTTier(mot, floor = MOT_FLOOR) {
  if (mot >= 5)          return { tier: 'MAXIMUM', units: 5 };
  if (mot >= 4)          return { tier: 'ELITE',   units: 4 };
  if (mot >= 3)          return { tier: 'STRONG',  units: 3 };
  if (mot >= 2.5)        return { tier: 'SOLID',   units: 2 };
  if (mot >= 2.0)        return { tier: 'BASE',    units: 1 };
  if (mot >= floor)      return { tier: 'MARKET_CONFIRMED', units: 1 };
  return null;
}

function applyDRUnderBoost(baseUnits, totalsResult) {
  const { drTotal, openerTotal, direction } = totalsResult;
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

function applyMOTCap(units, mot) {
  if (mot >= 6) return Math.min(units, 1);
  if (mot >= 4) return Math.min(units, 2);
  return units;
}

// ─── Movement Classification ────────────────────────────────────────
//
// Spreads: books price tightly, any 1.0pt move = meaningful signal.
// Totals:  natural public over-bias creates 0.5-1.0pt noise on most
//          games, so the real-signal threshold is 1.5pts.
//
// Positive lineMovement = market moved toward our thesis (FOR us).
// Negative lineMovement = market moved against our thesis (AGAINST us).

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

function applyMovementGate(baseUnits, movementTier, movementLabel) {
  if (movementTier === 'FLAGGED') return null;
  if (movementTier !== 'CONFIRM') return baseUnits;
  if (movementLabel === 'STEAM')       return Math.min(baseUnits + 2, 5);
  if (movementLabel === 'STRONG')      return Math.min(baseUnits + 1, 5);
  return Math.min(baseUnits + 1, 5);
}

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

function calcSpreadEV(coverProb) {
  return (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
}

// ─── Team Name Matching (CSV-based) ─────────────────────────────────

const teamNameMap = buildTeamNameMap();

function buildTeamNameMap() {
  const csvPath = join(__dirname, '../public/basketball_teams.csv');
  let csvData;
  try {
    csvData = readFileSync(csvPath, 'utf-8');
  } catch {
    console.warn('⚠️  Could not load basketball_teams.csv — falling back to fuzzy matching');
    return null;
  }

  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  const oddsApiIdx = headers.indexOf('odds_api_name');
  if (oddsApiIdx === -1) {
    console.warn('⚠️  No odds_api_name column in CSV — falling back to fuzzy matching');
    return null;
  }

  // Map: team_name (lowercase) → odds_api_name (both normalized and oddstrader names)
  const map = new Map();
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const normName = (cols[0] || '').trim();
    const oddsTrader = (cols[1] || '').trim();
    const oddsApiName = (cols[oddsApiIdx] || '').trim();
    if (oddsApiName) {
      if (normName) map.set(normName.toLowerCase(), oddsApiName);
      if (oddsTrader && oddsTrader.toLowerCase() !== normName.toLowerCase()) {
        map.set(oddsTrader.toLowerCase(), oddsApiName);
      }
    }
  }
  console.log(`   📋 Loaded ${map.size} team name mappings from CSV`);
  return map;
}

function getOddsApiName(firebaseTeamName) {
  if (!teamNameMap || !firebaseTeamName) return null;
  return teamNameMap.get(firebaseTeamName.toLowerCase()) || null;
}

function normalizeTeam(name) {
  return (name || '')
    .toLowerCase()
    .replace(/\bstate\b/g, 'st')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\bsoutheast\b/g, 'se')
    .replace(/\bsouthwest\b/g, 'sw')
    .replace(/\bnortheast\b/g, 'ne')
    .replace(/\bnorthwest\b/g, 'nw')
    .replace(/\bcal state\b/g, 'csu')
    .replace(/\binternational\b/g, 'intl')
    .replace(/\buniversity\b/g, 'univ')
    .replace(/\btennessee\b/g, 'tenn')
    .replace(/\bmississippi\b/g, 'miss')
    .replace(/hawai'i/g, 'hawaii')
    .replace(/[^a-z]/g, '');
}

function teamsMatchFuzzy(a, b) {
  const na = normalizeTeam(a);
  const nb = normalizeTeam(b);
  return na.length >= 4 && nb.length >= 4 && (na.includes(nb) || nb.includes(na));
}

function findOddsApiGame(evalData, oddsGames) {
  const away = evalData.game?.awayTeam;
  const home = evalData.game?.homeTeam;
  if (!away || !home) return null;

  // Primary: exact match via CSV mapping
  const awayApi = getOddsApiName(away);
  const homeApi = getOddsApiName(home);

  if (awayApi && homeApi) {
    const match = oddsGames.find(g =>
      g.away_team === awayApi && g.home_team === homeApi
    ) || oddsGames.find(g =>
      g.away_team === homeApi && g.home_team === awayApi
    );
    if (match) return match;
  }

  // Fallback: fuzzy matching for teams not yet in CSV
  return oddsGames.find(g =>
    teamsMatchFuzzy(away, g.away_team) && teamsMatchFuzzy(home, g.home_team)
  ) || oddsGames.find(g =>
    teamsMatchFuzzy(away, g.home_team) && teamsMatchFuzzy(home, g.away_team)
  ) || null;
}

// ─── Odds API Fetch ──────────────────────────────────────────────────

async function retryFetch(url, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`   ⚠️  Retry ${i + 1}: ${err.message}`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

async function fetchCurrentLines() {
  const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us,eu&markets=spreads,totals&oddsFormat=american&bookmakers=pinnacle,draftkings,fanduel,betmgm,caesars`;
  const res = await retryFetch(url);
  if (!res.ok) throw new Error(`Odds API error: ${res.status} ${res.statusText}`);

  const remaining = res.headers.get('x-requests-remaining');
  const used = res.headers.get('x-requests-used');
  console.log(`   📡 Odds API: ${used} used / ${remaining} remaining\n`);

  const raw = await res.json();
  return raw.map(game => {
    let bestAwaySpread = null;
    let bestHomeSpread = null;
    let lowestTotal = null;
    let highestTotal = null;
    let awayBook = null;
    let homeBook = null;
    let overBook = null;
    let underBook = null;
    let pinnacle = null;
    const retail = [];
    let pinnacleTotals = null;
    const retailTotals = [];

    for (const bk of (game.bookmakers || [])) {
      const spreadMarket = bk.markets?.find(m => m.key === 'spreads');
      if (spreadMarket) {
        const awayOut = spreadMarket.outcomes.find(o => teamsMatchFuzzy(o.name, game.away_team));
        const homeOut = spreadMarket.outcomes.find(o => teamsMatchFuzzy(o.name, game.home_team));

        if (bk.key === 'pinnacle' && awayOut && homeOut) {
          pinnacle = {
            awaySpread: awayOut.point,
            homeSpread: homeOut.point,
            awayOdds: awayOut.price,
            homeOdds: homeOut.price,
          };
        } else if (awayOut && homeOut) {
          retail.push({
            book: bk.key,
            awaySpread: awayOut.point,
            homeSpread: homeOut.point,
          });
        }

        for (const o of spreadMarket.outcomes) {
          const isAway = teamsMatchFuzzy(o.name, game.away_team);
          const isHome = teamsMatchFuzzy(o.name, game.home_team);
          if (isAway && (bestAwaySpread === null || o.point > bestAwaySpread)) {
            bestAwaySpread = o.point;
            awayBook = bk.key;
          }
          if (isHome && (bestHomeSpread === null || o.point > bestHomeSpread)) {
            bestHomeSpread = o.point;
            homeBook = bk.key;
          }
        }
      }

      const totalMarket = bk.markets?.find(m => m.key === 'totals');
      if (totalMarket) {
        const overOut = totalMarket.outcomes.find(o => o.name === 'Over');
        const underOut = totalMarket.outcomes.find(o => o.name === 'Under');
        if (overOut) {
          if (lowestTotal === null || overOut.point < lowestTotal) {
            lowestTotal = overOut.point;
            overBook = bk.key;
          }
          if (highestTotal === null || overOut.point > highestTotal) {
            highestTotal = overOut.point;
            underBook = bk.key;
          }
        }
        if (overOut && underOut) {
          const totEntry = { book: bk.key, total: overOut.point };
          if (bk.key === 'pinnacle') pinnacleTotals = totEntry;
          else retailTotals.push(totEntry);
        }
      }
    }

    return {
      id: game.id,
      away_team: game.away_team,
      home_team: game.home_team,
      commence_time: game.commence_time,
      awaySpread: bestAwaySpread,
      homeSpread: bestHomeSpread,
      lowestTotal,
      highestTotal,
      total: lowestTotal,
      bestBooks: { away: awayBook, home: homeBook, over: overBook, under: underBook },
      pinnacle,
      retail,
      pinnacleTotals,
      retailTotals,
    };
  });
}

// ─── Evaluation Logic ────────────────────────────────────────────────
// Re-evaluate model data against current market lines

function evaluateATSFromEval(evalData, awaySpread, homeSpread) {
  const model = evalData.modelData;
  const openers = evalData.openers;
  const results = [];

  for (const side of ['away', 'home']) {
    const isAway = side === 'away';
    const teamName = isAway ? evalData.game.awayTeam : evalData.game.homeTeam;
    const spread = isAway ? awaySpread : homeSpread;
    const openerSpread = isAway
      ? (openers.awayOpener ?? openers.awaySpread)
      : (openers.homeOpener ?? openers.homeSpread);

    if (spread == null) continue;

    const drMargin = isAway ? model.drRawMargin : -model.drRawMargin;
    const hsMargin = isAway ? model.hsRawMargin : -model.hsRawMargin;
    const blendedMargin = isAway ? model.blendedMargin : -model.blendedMargin;

    const evalSpread = openerSpread ?? spread;
    const drCovers = drMargin > -evalSpread;
    const hsCovers = hsMargin > -evalSpread;
    const bothCover = drCovers && hsCovers;
    const blendCovers = blendedMargin > -evalSpread;
    const mos = Math.round((blendedMargin + evalSpread) * 10) / 10;

    let lineMovement = null;
    let movement = { tier: 'UNKNOWN', label: 'UNKNOWN', signal: 'none' };
    if (openerSpread != null) {
      lineMovement = Math.round((openerSpread - spread) * 10) / 10;
      movement = classifySpreadMovement(lineMovement);
    }

    const effectiveFloor = movement.tier === 'CONFIRM' ? MOS_FLOOR_CONFIRMED : MOS_FLOOR;
    const tierInfo = getMOSTier(mos, effectiveFloor);
    const qualifies = tierInfo != null && bothCover;

    results.push({
      side, teamName, spread, openerSpread,
      drMargin: Math.round(drMargin * 10) / 10,
      hsMargin: Math.round(hsMargin * 10) / 10,
      blendedMargin: Math.round(blendedMargin * 10) / 10,
      drCovers, hsCovers, blendCovers, bothCover,
      mos, tierInfo, qualifies,
      lineMovement, movementTier: movement.tier,
      movementLabel: movement.label, movementSignal: movement.signal,
      isFavorite: spread < 0,
    });
  }

  return results;
}

function evaluateTotalsFromEval(evalData, currentTotal) {
  const model = evalData.modelData;
  const openerTotal = evalData.openers?.openerTotal ?? evalData.openers?.total;

  if (currentTotal == null) return null;

  const blendedTotal = (model.drTotal * 0.20) + (model.hsTotal * 0.80);

  const drOver = model.drTotal > currentTotal;
  const hsOver = model.hsTotal > currentTotal;
  const bothAgreeOver = drOver && hsOver;
  const bothAgreeUnder = !drOver && !hsOver;
  const modelsAgree = bothAgreeOver || bothAgreeUnder;

  const direction = blendedTotal > currentTotal ? 'OVER' : 'UNDER';
  const margin = blendedTotal - currentTotal;
  const mot = Math.round(Math.abs(margin) * 10) / 10;

  let lineMovement = null;
  let movement = { tier: 'UNKNOWN', label: 'UNKNOWN', signal: 'none' };
  if (openerTotal != null) {
    lineMovement = direction === 'OVER'
      ? Math.round((currentTotal - openerTotal) * 10) / 10
      : Math.round((openerTotal - currentTotal) * 10) / 10;
    movement = classifyTotalsMovement(lineMovement);
  }

  const effectiveFloor = movement.tier === 'CONFIRM' ? MOT_FLOOR_CONFIRMED : MOT_FLOOR;
  const tierInfo = getMOTTier(mot, effectiveFloor);
  const qualifies = tierInfo != null;

  return {
    direction, marketTotal: currentTotal, openerTotal,
    mot, tierInfo, qualifies, modelsAgree,
    lineMovement, movementTier: movement.tier,
    movementLabel: movement.label, movementSignal: movement.signal,
    drTotal: model.drTotal, hsTotal: model.hsTotal,
    blendedTotal: Math.round(blendedTotal * 10) / 10,
    drOver, hsOver, bothAgreeOver, bothAgreeUnder,
  };
}

// ─── Bet Creation / Update / Kill ────────────────────────────────────

async function createOrUpdateATSBet(evalData, sideResult, counters) {
  const date = evalData.date;
  const game = evalData.game;
  const side = sideResult.side === 'away' ? 'AWAY' : 'HOME';
  const pickTeam = sideResult.teamName;
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const teamNorm = pickTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_SPREAD_${teamNorm}_(${side})`;

  const signalCount = sideResult.signalCount || 0;
  const isFlagged = sideResult.movementTier === 'FLAGGED' || signalCount < 2;
  const units = isFlagged ? 0 : (sideResult.units || 1);
  const tier = signalCount === 3 ? 'THREE_SIGNAL' : signalCount === 2 ? 'TWO_SIGNAL' : 'INSUFFICIENT';

  const betRef = doc(db, 'basketball_bets', betId);
  const existing = await getDoc(betRef);

  if (existing.exists()) {
    const prev = existing.data();
    const prevTier = prev.spreadAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const prevStatus = prev.betStatus || 'UNKNOWN';
    const newTier = sideResult.movementTier;
    const tierChanged = prevTier !== newTier;

    const updateData = {
      'spreadAnalysis.currentSpread': sideResult.spread,
      'spreadAnalysis.lineMovement': sideResult.lineMovement,
      'spreadAnalysis.movementTier': newTier,
      'spreadAnalysis.marginOverSpread': sideResult.mos,
      'spreadAnalysis.drCovers': sideResult.drCovers,
      'spreadAnalysis.hsCovers': sideResult.hsCovers,
      'spreadAnalysis.bothModelsCover': sideResult.bothCover,
      'spreadAnalysis.unitTier': tier,
      'spreadAnalysis.signalCount': signalCount,
      'spreadAnalysis.bestBook': sideResult.bestBook || null,
      'spreadAnalysis.bestBookSpread': sideResult.bestBookSpread || null,
      'spreadAnalysis.pinnacleSpread': sideResult.pinnSpread || null,
      'spreadAnalysis.pinnEdgePts': sideResult.pinnEdgePts || 0,
      'betRecommendation.lineMovement': sideResult.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.marginOverSpread': sideResult.mos,
      lastUpdatedAt: Date.now(),
      lastLineCheckAt: Date.now(),
      lineHistory: arrayUnion({ t: Date.now(), spread: sideResult.spread, total: null }),
    };

    // Locked bets: don't change the spread (user already bet that number),
    // but DO allow unit UPGRADES when signals improve. Never downgrade locked.
    if (!prev.isLocked) {
      updateData['spreadAnalysis.spread'] = sideResult.spread;
      updateData['betRecommendation.atsSpread'] = sideResult.spread;
      updateData['bet.spread'] = sideResult.spread;
    }

    const prevUnits = prev.bet?.units || prev.prediction?.unitSize || 0;
    const prevSignals = prev.spreadAnalysis?.signalCount || 0;

    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${pickTeam} ${sideResult.spread} — line moved against but bet is locked for user | ${prevUnits}u`);
        counters.stable++;
        return;
      }
      updateData.betStatus = 'KILLED';
      updateData['bet.units'] = 0;
      updateData['betRecommendation.atsUnits'] = 0;
      updateData['prediction.unitSize'] = 0;
      await updateDoc(betRef, updateData);
      console.log(`   💀 KILLED: ${pickTeam} ${sideResult.spread} — was ${prevTier}, now FLAGGED (line moved ${sideResult.lineMovement > 0 ? '+' : ''}${sideResult.lineMovement})`);
      counters.killed++;
      return;
    }

    // Unit upgrade logic: locked bets can go UP, never DOWN
    const shouldUpgrade = prev.isLocked && units > prevUnits;
    if (shouldUpgrade) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData.betStatus = 'BET_NOW';
      await updateDoc(betRef, updateData);
      console.log(`   ⬆️  UPGRADED: ${pickTeam} ${sideResult.spread} — ${prevUnits}u → ${units}u [${tier}] | signals ${prevSignals}→${signalCount} (locked)`);
      counters.updated++;
      return;
    }

    if (tierChanged || prevStatus === 'KILLED' || prevStatus === 'FLAGGED') {
      if (!prev.isLocked) {
        updateData['bet.units'] = units;
        updateData['betRecommendation.atsUnits'] = units;
        updateData['prediction.unitSize'] = units;
        const newStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
        updateData.betStatus = newStatus;
        if (newStatus === 'BET_NOW') {
          updateData.isLocked = true;
          updateData.lockedAt = Date.now();
        }
      }
      await updateDoc(betRef, updateData);
      const displayUnits = prev.isLocked ? prevUnits : units;
      const wasRevived = prevStatus === 'KILLED' || prevStatus === 'FLAGGED';
      const label = wasRevived ? '🔄 REVIVED' : (newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED');
      console.log(`   ${label}: ${pickTeam} ${sideResult.spread} — ${prevTier} → ${newTier} | ${displayUnits}u [${tier}]${prev.isLocked ? ' (locked)' : ''}`);
      counters.updated++;
      return;
    }

    // Stable — no tier change, no upgrade
    if (!prev.isLocked) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
    }
    await updateDoc(betRef, updateData);
    const stableUnits = prev.isLocked ? prevUnits : units;
    console.log(`   🔒 Stable: ${pickTeam} ${sideResult.spread} — still ${newTier} | ${stableUnits}u${prev.isLocked ? ' (locked)' : ''}`);
    counters.stable++;
    return;
  }

  // No existing bet — CREATE a new one (line moved into range!)
  if (isFlagged) {
    counters.skipped++;
    return;
  }

  const pred = evalData.prediction;

  const coverProb = estimateCoverProb(sideResult.mos);
  const spreadEV = calcSpreadEV(coverProb);

  const betData = {
    id: betId, date, timestamp: Date.now(), sport: 'BASKETBALL',
    game: { awayTeam: game.awayTeam, homeTeam: game.homeTeam, gameTime: game.gameTime || 'TBD' },
    bet: { market: 'SPREAD', pick: pickTeam, odds: -110, spread: sideResult.spread, units, team: pickTeam },
    spreadAnalysis: {
      spreadConfirmed: true, spread: sideResult.spread,
      openerSpread: sideResult.openerSpread,
      lineMovement: sideResult.lineMovement, movementTier: sideResult.movementTier,
      movementLabel: sideResult.movementLabel, movementSignal: sideResult.movementSignal,
      drMargin: sideResult.drMargin, hsMargin: sideResult.hsMargin,
      blendedMargin: sideResult.blendedMargin, marginOverSpread: sideResult.mos,
      drCovers: sideResult.drCovers, hsCovers: sideResult.hsCovers,
      blendCovers: sideResult.blendCovers, bothModelsCover: sideResult.bothCover,
      unitTier: tier, isFavorite: sideResult.isFavorite,
      signalCount: sideResult.signalCount || 0,
      bestBook: sideResult.bestBook || null,
      bestBookSpread: sideResult.bestBookSpread || null,
      pinnacleSpread: sideResult.pinnSpread || null,
      pinnEdgePts: sideResult.pinnEdgePts || 0,
    },
    prediction: {
      bestTeam: pickTeam, bestBet: sideResult.side,
      bestOdds: pred?.bestOdds ?? null, bestEV: pred?.bestEV ?? null,
      evPercent: pred?.bestEV ?? null, grade: pred?.grade ?? null,
      unitSize: units, spreadTier: tier, spreadBoost: units,
      dratingsAwayScore: evalData.modelData.dratingsAwayScore,
      dratingsHomeScore: evalData.modelData.dratingsHomeScore,
      haslametricsAwayScore: evalData.modelData.haslametricsAwayScore,
      haslametricsHomeScore: evalData.modelData.haslametricsHomeScore,
      ensembleAwayScore: pred?.ensembleAwayScore ?? null,
      ensembleHomeScore: pred?.ensembleHomeScore ?? null,
      ensembleAwayProb: pred?.ensembleAwayProb ?? null,
      ensembleHomeProb: pred?.ensembleHomeProb ?? null,
      dratingsAwayProb: pred?.dratingsAwayProb ?? null,
      dratingsHomeProb: pred?.dratingsHomeProb ?? null,
      haslametricsAwayProb: pred?.haslametricsAwayProb ?? null,
      haslametricsHomeProb: pred?.haslametricsHomeProb ?? null,
      marketAwayProb: pred?.marketAwayProb ?? null,
      marketHomeProb: pred?.marketHomeProb ?? null,
    },
    result: { awayScore: null, homeScore: null, totalScore: null, winner: null, outcome: null, profit: null, fetched: false, fetchedAt: null, source: null },
    status: 'PENDING',
    betStatus: sideResult.movementTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD',
    isLocked: true,
    lockedAt: Date.now(),
    firstRecommendedAt: Date.now(), lastUpdatedAt: Date.now(),
    lastLineCheckAt: Date.now(),
    pinnacle: evalData.pinnacle || null,
    source: 'LINE_MONITOR_V10',
    isPrimePick: true, isATSPick: true,
    savantPick: sideResult.mos >= 4,
    betRecommendation: {
      type: 'ATS', reason: 'LINE_MOVEMENT_TRIGGER',
      atsUnits: units, atsTier: tier, atsSpread: sideResult.spread, atsOdds: -110,
      estimatedCoverProb: Math.round(coverProb * 1000) / 10,
      estimatedSpreadEV: Math.round(spreadEV * 1000) / 10,
      marginOverSpread: sideResult.mos, bothModelsCover: sideResult.bothCover,
      openerSpread: sideResult.openerSpread,
      lineMovement: sideResult.lineMovement, movementTier: sideResult.movementTier,
      movementLabel: sideResult.movementLabel, movementSignal: sideResult.movementSignal,
    },
    barttorvik: evalData.barttorvik || null,
    lineHistory: [{ t: Date.now(), spread: sideResult.openerSpread ?? sideResult.spread, total: null }],
  };

  await setDoc(betRef, betData);
  const grade = signalCount === 3 ? '🔥' : '⚡';
  const bookTag = sideResult.bestBook ? ` @ ${sideResult.bestBook.toUpperCase()}` : '';
  console.log(`   🆕 NEW BET: ${grade} ${pickTeam} ${sideResult.spread} → ${units}u [${tier}] MOS +${sideResult.mos} | ${signalCount} signals${bookTag}`);
  counters.created++;
}

async function createOrUpdateTotalsBet(evalData, totalsResult, counters) {
  const date = evalData.date;
  const game = evalData.game;
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_TOTAL_${totalsResult.direction}`;

  const isFlagged = totalsResult.finalUnits === null || totalsResult.movementTier === 'FLAGGED';
  const units = isFlagged ? 0 : (totalsResult.finalUnits || 1);
  const drBoostInfo = applyDRUnderBoost(1, totalsResult);
  const tier = drBoostInfo.drTier || totalsResult.tierInfo?.tier || 'BASE';
  const gameLabel = `${game.awayTeam} @ ${game.homeTeam}`;

  const betRef = doc(db, 'basketball_bets', betId);
  const existing = await getDoc(betRef);

  if (existing.exists()) {
    const prev = existing.data();
    const prevTier = prev.totalsAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const prevStatus = prev.betStatus || 'UNKNOWN';
    const newTier = totalsResult.movementTier;
    const tierChanged = prevTier !== newTier;
    const prevUnits = prev.bet?.units || prev.prediction?.unitSize || 0;

    const updateData = {
      'totalsAnalysis.currentTotal': totalsResult.marketTotal,
      'totalsAnalysis.lineMovement': totalsResult.lineMovement,
      'totalsAnalysis.movementTier': newTier,
      'totalsAnalysis.marginOverTotal': totalsResult.mot,
      'totalsAnalysis.drOver': totalsResult.drOver,
      'totalsAnalysis.hsOver': totalsResult.hsOver,
      'totalsAnalysis.bothModelsAgree': totalsResult.bothAgreeOver || totalsResult.bothAgreeUnder,
      'totalsAnalysis.unitTier': tier,
      'totalsAnalysis.pinnacleTotal': totalsResult.pinnTotal,
      'totalsAnalysis.pinnTotalEdge': totalsResult.pinnTotalEdge || 0,
      'totalsAnalysis.hasPinnEdge': totalsResult.hasPinnEdge || false,
      'betRecommendation.lineMovement': totalsResult.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.marginOverTotal': totalsResult.mot,
      lastUpdatedAt: Date.now(),
      lastLineCheckAt: Date.now(),
      lineHistory: arrayUnion({ t: Date.now(), spread: null, total: totalsResult.marketTotal }),
    };

    if (!prev.isLocked) {
      updateData['totalsAnalysis.marketTotal'] = totalsResult.marketTotal;
      updateData['betRecommendation.totalLine'] = totalsResult.marketTotal;
      updateData['bet.total'] = totalsResult.marketTotal;
    }

    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${totalsResult.direction} ${totalsResult.marketTotal} — line moved against but bet is locked | ${prevUnits}u (${gameLabel})`);
        counters.stable++;
        return;
      }
      updateData.betStatus = 'KILLED';
      updateData['bet.units'] = 0;
      updateData['betRecommendation.totalUnits'] = 0;
      updateData['prediction.unitSize'] = 0;
      await updateDoc(betRef, updateData);
      console.log(`   💀 KILLED: ${totalsResult.direction} ${totalsResult.marketTotal} — was ${prevTier}, now FLAGGED (line moved ${totalsResult.lineMovement > 0 ? '+' : ''}${totalsResult.lineMovement}) (${gameLabel})`);
      counters.killed++;
      return;
    }

    // Unit upgrade: locked bets can go UP, never DOWN
    const shouldUpgrade = prev.isLocked && units > prevUnits;
    if (shouldUpgrade) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.totalUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData.betStatus = 'BET_NOW';
      await updateDoc(betRef, updateData);
      console.log(`   ⬆️  UPGRADED: ${totalsResult.direction} ${totalsResult.marketTotal} — ${prevUnits}u → ${units}u [${tier}] (locked) (${gameLabel})`);
      counters.updated++;
      return;
    }

    if (tierChanged || prevStatus === 'KILLED' || prevStatus === 'FLAGGED') {
      if (!prev.isLocked) {
        updateData['bet.units'] = units;
        updateData['betRecommendation.totalUnits'] = units;
        updateData['prediction.unitSize'] = units;
        const newStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
        updateData.betStatus = newStatus;
        if (newStatus === 'BET_NOW') {
          updateData.isLocked = true;
          updateData.lockedAt = Date.now();
        }
      }
      await updateDoc(betRef, updateData);
      const displayUnits = prev.isLocked ? prevUnits : units;
      const wasRevived = prevStatus === 'KILLED' || prevStatus === 'FLAGGED';
      const label = wasRevived ? '🔄 REVIVED' : (newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED');
      console.log(`   ${label}: ${totalsResult.direction} ${totalsResult.marketTotal} — ${prevTier} → ${newTier} | ${displayUnits}u [${tier}]${prev.isLocked ? ' (locked)' : ''} (${gameLabel})`);
      counters.updated++;
      return;
    }

    if (!prev.isLocked) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.totalUnits'] = units;
      updateData['prediction.unitSize'] = units;
    }
    await updateDoc(betRef, updateData);
    const stableUnits = prev.isLocked ? prevUnits : units;
    console.log(`   🔒 Stable: ${totalsResult.direction} ${totalsResult.marketTotal} — still ${newTier} | ${stableUnits}u${prev.isLocked ? ' (locked)' : ''} (${gameLabel})`);
    counters.stable++;
    return;
  }

  // CREATE new totals bet
  if (isFlagged) {
    counters.skipped++;
    return;
  }

  const coverProb = estimateCoverProb(totalsResult.mot);
  const totalsEV = calcSpreadEV(coverProb);
  const pred = evalData.prediction;

  const betData = {
    id: betId, date, timestamp: Date.now(), sport: 'BASKETBALL',
    game: { awayTeam: game.awayTeam, homeTeam: game.homeTeam, gameTime: game.gameTime || 'TBD' },
    bet: { market: 'TOTAL', pick: totalsResult.direction, total: totalsResult.marketTotal, odds: -110, units, team: null },
    totalsAnalysis: {
      marketTotal: totalsResult.marketTotal, openerTotal: totalsResult.openerTotal,
      lineMovement: totalsResult.lineMovement, movementTier: totalsResult.movementTier,
      movementLabel: totalsResult.movementLabel, movementSignal: totalsResult.movementSignal,
      drTotal: totalsResult.drTotal, hsTotal: totalsResult.hsTotal,
      blendedTotal: totalsResult.blendedTotal, marginOverTotal: totalsResult.mot,
      direction: totalsResult.direction,
      drOver: totalsResult.drOver, hsOver: totalsResult.hsOver,
      bothModelsAgree: totalsResult.bothAgreeOver || totalsResult.bothAgreeUnder,
      unitTier: tier,
    },
    prediction: {
      bestTeam: null, bestBet: totalsResult.direction, bestOdds: -110,
      bestEV: pred?.bestEV ?? null, evPercent: pred?.bestEV ?? null,
      grade: pred?.grade ?? null, unitSize: units,
      dratingsAwayScore: evalData.modelData.dratingsAwayScore,
      dratingsHomeScore: evalData.modelData.dratingsHomeScore,
      haslametricsAwayScore: evalData.modelData.haslametricsAwayScore,
      haslametricsHomeScore: evalData.modelData.haslametricsHomeScore,
      ensembleAwayScore: pred?.ensembleAwayScore ?? null,
      ensembleHomeScore: pred?.ensembleHomeScore ?? null,
      ensembleAwayProb: pred?.ensembleAwayProb ?? null,
      ensembleHomeProb: pred?.ensembleHomeProb ?? null,
    },
    result: { awayScore: null, homeScore: null, totalScore: null, winner: null, outcome: null, profit: null, fetched: false, fetchedAt: null, source: null },
    status: 'PENDING',
    betStatus: totalsResult.movementTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD',
    isLocked: true,
    lockedAt: Date.now(),
    firstRecommendedAt: Date.now(), lastUpdatedAt: Date.now(),
    lastLineCheckAt: Date.now(),
    source: 'LINE_MONITOR',
    isPrimePick: true, isTotalsPick: true,
    savantPick: totalsResult.mot >= 4,
    betRecommendation: {
      type: 'TOTAL', reason: 'LINE_MOVEMENT_TRIGGER',
      totalUnits: units, totalTier: tier, totalLine: totalsResult.marketTotal,
      totalDirection: totalsResult.direction, totalOdds: -110,
      estimatedCoverProb: Math.round(coverProb * 1000) / 10,
      estimatedTotalsEV: Math.round(totalsEV * 1000) / 10,
      marginOverTotal: totalsResult.mot,
      bothModelsAgree: totalsResult.bothAgreeOver || totalsResult.bothAgreeUnder,
      openerTotal: totalsResult.openerTotal,
      lineMovement: totalsResult.lineMovement, movementTier: totalsResult.movementTier,
      movementLabel: totalsResult.movementLabel, movementSignal: totalsResult.movementSignal,
    },
    barttorvik: evalData.barttorvik || null,
    lineHistory: [{ t: Date.now(), spread: null, total: totalsResult.openerTotal ?? totalsResult.marketTotal }],
  };

  await setDoc(betRef, betData);
  const mvTag = totalsResult.movementLabel ? `${totalsResult.movementLabel} ${totalsResult.movementSignal}` : '';
  console.log(`   🆕 NEW BET: ${totalsResult.direction} ${totalsResult.marketTotal} → ${units}u [${tier}] MOT +${totalsResult.mot} ${mvTag} (${gameLabel})`);
  counters.created++;
}

async function killExistingBet(betDoc, reason, counters) {
  const data = betDoc.data();
  const status = data.betStatus;
  if (status === 'KILLED') return;

  const market = data.bet?.market;
  const label = market === 'SPREAD'
    ? `${data.bet?.pick} ${data.bet?.spread}`
    : `${data.bet?.pick} ${data.bet?.total}`;

  if (data.isLocked) {
    await updateDoc(doc(db, 'basketball_bets', betDoc.id), {
      lastLineCheckAt: Date.now(),
      lastUpdatedAt: Date.now(),
    });
    console.log(`   🔒 LOCKED: ${label} — ${reason}, but bet is locked for user`);
    counters.stable++;
    return;
  }

  await updateDoc(doc(db, 'basketball_bets', betDoc.id), {
    betStatus: 'KILLED',
    'bet.units': 0,
    'prediction.unitSize': 0,
    lastUpdatedAt: Date.now(),
    lastLineCheckAt: Date.now(),
  });
  console.log(`   💀 KILLED: ${label} — ${reason}`);
  counters.killed++;
}

// ─── Main ────────────────────────────────────────────────────────────

async function checkLineMovement() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║        LINE MONITOR V11 — Pinnacle Base + Movement Boost                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const today = new Date().toISOString().split('T')[0];

  // 1. Load everything for today from basketball_bets
  console.log(`📋 Loading data for ${today}...`);
  const betsRef = collection(db, 'basketball_bets');
  const betsQuery = query(betsRef, where('date', '==', today));
  const allDocs = await getDocs(betsQuery);

  // Split into evaluations vs actual bets
  const evalDocs = [];
  const activeBetDocs = [];
  for (const d of allDocs.docs) {
    const data = d.data();
    if (data.type === 'EVALUATION') {
      evalDocs.push(d);
    } else {
      if (data.betStatus !== 'KILLED') activeBetDocs.push(d);
    }
  }

  const evalsSnapshot = { size: evalDocs.length, docs: evalDocs };
  console.log(`   ✅ ${evalDocs.length} game evaluations, ${activeBetDocs.length} active bets\n`);

  if (evalDocs.length === 0) {
    console.log('   ⚠️  No evaluations found. Run fetch-prime-picks first.\n');
    return;
  }

  // 3. Fetch current lines
  console.log('📡 Fetching current NCAAB lines from The Odds API...');
  const oddsGames = await fetchCurrentLines();
  console.log(`   ✅ ${oddsGames.length} games with lines\n`);

  // 4. Evaluate every game: model vs opener vs current
  const counters = { created: 0, updated: 0, stable: 0, killed: 0, skipped: 0, noMatch: 0 };
  const processedBetIds = new Set();
  const allAtsRows = [];
  const allTotalsRows = [];

  for (const evalDoc of evalsSnapshot.docs) {
    const evalData = evalDoc.data();
    const oddsGame = findOddsApiGame(evalData, oddsGames);
    const gameLabel = `${evalData.game.awayTeam} @ ${evalData.game.homeTeam}`;

    if (!oddsGame) {
      counters.noMatch++;
      console.log(`   ❓ No match: ${gameLabel}`);
      continue;
    }

    // Update evaluation with latest lines
    await updateDoc(doc(db, 'basketball_bets', evalDoc.id), {
      'currentLines.awaySpread': oddsGame.awaySpread,
      'currentLines.homeSpread': oddsGame.homeSpread,
      'currentLines.total': oddsGame.total,
      'currentLines.lastCheckedAt': Date.now(),
      lastUpdatedAt: Date.now(),
    });

    const model = evalData.modelData;
    const openers = evalData.openers;

    // ── ATS: evaluate both sides with Three-Signal System ──
    const atsResults = evaluateATSFromEval(evalData, oddsGame.awaySpread, oddsGame.homeSpread);
    const best = atsResults.sort((a, b) => b.mos - a.mos)[0];

    if (best) {
      const openerSpread = best.openerSpread;
      const openerMOS = openerSpread != null ? Math.round((best.blendedMargin + openerSpread) * 10) / 10 : null;
      const lineShift = (openerSpread != null && best.spread != null) ? Math.round((best.spread - openerSpread) * 10) / 10 : null;

      // Three-Signal evaluation
      const signal1 = best.bothCover && best.mos >= 1.0;
      let signal2 = false;
      let bestBook = null;
      let bestBookSpread = null;
      let pinnSpread = null;
      let pinnEdgePts = 0;
      if (oddsGame.pinnacle) {
        pinnSpread = best.side === 'away' ? oddsGame.pinnacle.awaySpread : oddsGame.pinnacle.homeSpread;
        for (const r of oddsGame.retail) {
          const retailSp = best.side === 'away' ? r.awaySpread : r.homeSpread;
          const edge = retailSp - pinnSpread;
          if (edge >= 0.5 && edge > pinnEdgePts) {
            pinnEdgePts = Math.round(edge * 10) / 10;
            bestBook = r.book;
            bestBookSpread = retailSp;
            signal2 = true;
          }
        }
      }
      const signal3For = best.movementTier === 'CONFIRM';
      const signal3Against = best.movementTier === 'FLAGGED';
      const signalCount = (signal1 ? 1 : 0) + (signal2 ? 1 : 0) + (signal3For ? 1 : 0);

      let status = '—';
      if (signal1 && signal3Against) status = '🚫 FLAGGED';
      else if (signalCount === 3) status = '🔥 3-SIGNAL';
      else if (signalCount === 2 && !signal3Against) status = '⚡ 2-SIGNAL';
      else if (signal1 && !signal3Against) status = '🟡 1-SIGNAL';
      else if (best.mos >= 1.0) status = '👀 NEAR';
      else if (best.blendCovers) status = '· edge';
      else status = '· no';

      allAtsRows.push({
        team: best.teamName,
        modelMargin: best.blendedMargin,
        opener: openerSpread,
        current: best.spread,
        openerMOS,
        currentMOS: best.mos,
        lineShift,
        bothCover: best.bothCover,
        movementTier: best.movementTier,
        status,
        qualifies: signal1 && signalCount >= 2 && !signal3Against,
        gameLabel,
        sideResult: best,
        evalData,
        signalCount,
        signal2,
        bestBook,
        bestBookSpread,
        pinnSpread,
        pinnEdgePts,
      });
    }

    // ── ATS: handle bet actions (Three-Signal) ──
    if (best && best.bothCover && best.mos >= 1.0) {
      const signal3Against = best.movementTier === 'FLAGGED';
      let signal2 = false;
      let bestBook = null;
      let bestBookSpread = null;
      let pinnSpread = null;
      let pinnEdgePts = 0;
      if (oddsGame.pinnacle) {
        pinnSpread = best.side === 'away' ? oddsGame.pinnacle.awaySpread : oddsGame.pinnacle.homeSpread;
        for (const r of oddsGame.retail) {
          const retailSp = best.side === 'away' ? r.awaySpread : r.homeSpread;
          const edge = retailSp - pinnSpread;
          if (edge >= 0.5 && edge > pinnEdgePts) {
            pinnEdgePts = Math.round(edge * 10) / 10;
            bestBook = r.book;
            bestBookSpread = retailSp;
            signal2 = true;
          }
        }
      }
      const signal3For = best.movementTier === 'CONFIRM';
      const signalCount = 1 + (signal2 ? 1 : 0) + (signal3For ? 1 : 0);

      if (!signal3Against && signalCount >= 2) {
        const mvMag = Math.abs(best.lineMovement || 0);
        let units;
        if (signalCount === 3) {
          if (pinnEdgePts >= 2.5) units = 4;
          else if (pinnEdgePts >= 2.0) units = 4;
          else if (pinnEdgePts >= 1.5) units = 3;
          else if (pinnEdgePts >= 1.0) units = 3;
          else units = 2;
          if (mvMag >= 1.0) units = Math.min(units + 1, 4);
        } else if (signal2) {
          if (pinnEdgePts >= 2.5) units = 4;
          else if (pinnEdgePts >= 2.0) units = 3;
          else if (pinnEdgePts >= 1.0) units = 2;
          else units = 1;
          if (mvMag >= 1.0) units = Math.min(units + 1, 4);
        } else {
          units = 1;
        }

        best.signalCount = signalCount;
        best.bestBook = bestBook;
        best.bestBookSpread = bestBookSpread;
        best.pinnSpread = pinnSpread;
        best.pinnEdgePts = pinnEdgePts;
        best.units = units;

        await createOrUpdateATSBet(evalData, best, counters);
      }

      const side = best.side === 'away' ? 'AWAY' : 'HOME';
      const teamNorm = best.teamName.replace(/\s+/g, '_').toUpperCase();
      const awayNorm = evalData.game.awayTeam.replace(/\s+/g, '_').toUpperCase();
      const homeNorm = evalData.game.homeTeam.replace(/\s+/g, '_').toUpperCase();
      processedBetIds.add(`${today}_${awayNorm}_${homeNorm}_SPREAD_${teamNorm}_(${side})`);
    }

    // ── Totals: evaluate at best available total for the model's direction ──
    const blendedTotal = (model.drTotal * 0.20) + (model.hsTotal * 0.80);
    const prelimDirection = blendedTotal > (oddsGame.lowestTotal ?? oddsGame.total) ? 'OVER' : 'UNDER';
    const bestTotal = prelimDirection === 'OVER'
      ? (oddsGame.lowestTotal ?? oddsGame.total)
      : (oddsGame.highestTotal ?? oddsGame.total);
    const totalsResult = evaluateTotalsFromEval(evalData, bestTotal);

    if (totalsResult) {
      const openerTotal = totalsResult.openerTotal;
      const lineShift = (openerTotal != null) ? Math.round((totalsResult.marketTotal - openerTotal) * 10) / 10 : null;
      const openerMOT = openerTotal != null ? Math.round(Math.abs(blendedTotal - openerTotal) * 10) / 10 : null;

      let status = '—';
      const isTotMktConf = totalsResult.tierInfo?.tier === 'MARKET_CONFIRMED';
      if (totalsResult.qualifies && totalsResult.movementTier === 'FLAGGED') status = '🚫 FLAGGED';
      else if (totalsResult.qualifies && isTotMktConf) status = '🟢 MKTCONF';
      else if (totalsResult.qualifies && totalsResult.movementTier === 'CONFIRM') status = '🟢 BET_NOW';
      else if (totalsResult.qualifies) status = '🟡 HOLD';
      else if (totalsResult.mot >= 1.0) status = '👀 NEAR';
      else status = '·';

      // Compute Pinnacle totals edge for display (even for non-qualifying rows)
      let rowPinnTotal = null;
      let rowPinnEdge = 0;
      let rowPinnBook = null;
      let rowPinnBookLine = null;
      let rowHasPinnEdge = false;
      if (oddsGame.pinnacleTotals) {
        rowPinnTotal = oddsGame.pinnacleTotals.total;
        for (const r of oddsGame.retailTotals) {
          let e;
          if (totalsResult.direction === 'OVER') e = rowPinnTotal - r.total;
          else e = r.total - rowPinnTotal;
          if (e >= 0.5 && e > rowPinnEdge) {
            rowPinnEdge = Math.round(e * 10) / 10;
            rowPinnBook = r.book;
            rowPinnBookLine = r.total;
            rowHasPinnEdge = true;
          }
        }
      }

      allTotalsRows.push({
        direction: totalsResult.direction,
        modelTotal: Math.round(blendedTotal * 10) / 10,
        opener: openerTotal,
        current: totalsResult.marketTotal,
        openerMOT,
        currentMOT: totalsResult.mot,
        lineShift,
        movementTier: totalsResult.movementTier,
        status,
        qualifies: totalsResult.qualifies,
        gameLabel,
        totalsResult,
        evalData,
        pinnTotal: rowPinnTotal,
        pinnEdge: rowPinnEdge,
        pinnBook: rowPinnBook,
        pinnBookLine: rowPinnBookLine,
        hasPinnEdge: rowHasPinnEdge,
      });
    }

    // ── Totals: Pinnacle check + bet actions ──
    if (totalsResult?.qualifies) {
      // Check Pinnacle totals edge
      let hasPinnTotalEdge = false;
      let pinnTotalEdge = 0;
      let bestTotalBook = null;
      let bestTotalBookLine = null;
      let pinnTotal = null;
      if (oddsGame.pinnacleTotals) {
        pinnTotal = oddsGame.pinnacleTotals.total;
        for (const r of oddsGame.retailTotals) {
          let edge;
          if (totalsResult.direction === 'OVER') {
            edge = pinnTotal - r.total;
          } else {
            edge = r.total - pinnTotal;
          }
          if (edge >= 0.5 && edge > pinnTotalEdge) {
            pinnTotalEdge = Math.round(edge * 10) / 10;
            bestTotalBook = r.book;
            bestTotalBookLine = r.total;
            hasPinnTotalEdge = true;
          }
        }
      }
      totalsResult.pinnTotal = pinnTotal;
      totalsResult.pinnTotalEdge = pinnTotalEdge;
      totalsResult.bestTotalBook = bestTotalBook;
      totalsResult.bestTotalBookLine = bestTotalBookLine;
      totalsResult.hasPinnEdge = hasPinnTotalEdge;
      
      // Skip if Pinnacle data exists but no edge
      if (pinnTotal != null && !hasPinnTotalEdge) {
        // No Pinnacle confirmation — don't create/update bet
      } else {
        // Pinnacle base + movement boost (mirrors fetchPrimePicks V11)
        let baseUnits;
        if (hasPinnTotalEdge) {
          if (pinnTotalEdge >= 2.5) baseUnits = 4;
          else if (pinnTotalEdge >= 2.0) baseUnits = 3;
          else if (pinnTotalEdge >= 1.5) baseUnits = 3;
          else if (pinnTotalEdge >= 1.0) baseUnits = 2;
          else baseUnits = 1;
        } else {
          baseUnits = 1;
        }
        const totalsMvMag = Math.abs(totalsResult.lineMovement || 0);
        if (totalsResult.movementTier === 'CONFIRM' && totalsMvMag >= 1.0) {
          baseUnits = Math.min(baseUnits + 1, 4);
        }
        const drB = applyDRUnderBoost(baseUnits, totalsResult);
        const capped = applyMOTCap(drB.units, totalsResult.mot);
        const adjustedUnits = (totalsResult.movementTier === 'FLAGGED') ? null : capped;
        totalsResult.finalUnits = adjustedUnits;
        if (adjustedUnits !== null) {
          await createOrUpdateTotalsBet(evalData, totalsResult, counters);
        }
      }

      const awayNorm = evalData.game.awayTeam.replace(/\s+/g, '_').toUpperCase();
      const homeNorm = evalData.game.homeTeam.replace(/\s+/g, '_').toUpperCase();
      processedBetIds.add(`${today}_${awayNorm}_${homeNorm}_TOTAL_${totalsResult.direction}`);
    }
  }

  // 5. Kill existing bets that no longer qualify at current lines
  for (const betDoc of activeBetDocs) {
    if (processedBetIds.has(betDoc.id)) continue;
    const data = betDoc.data();
    if (data.betStatus === 'FLAGGED') continue;
    await killExistingBet(betDoc, 'no longer qualifies at current line', counters);
  }

  // ════════════════════════════════════════════════════════════════════════
  // 6. FULL DASHBOARD — Model vs Opener vs Current for EVERY game
  //
  //    "Market Movement" uses the pick-relative calculation:
  //      ATS:    openerSpread - currentSpread
  //      Totals: (OVER) currentTotal - openerTotal
  //              (UNDER) openerTotal - currentTotal
  //
  //    Positive = market confirms your thesis (sharps agree)
  //    Negative = market moves against your thesis (sharps disagree)
  //
  //    Thresholds: >= +1.0 CONFIRM | >= -0.5 NEUTRAL | < -0.5 FLAGGED
  // ════════════════════════════════════════════════════════════════════════

  const fmt = n => n != null ? (n >= 0 ? '+' + n : '' + n) : '??';
  const pad = (s, w) => String(s).padStart(w);

  function moveLabel(lm, label, signal) {
    if (lm == null) return '   ??      '.padEnd(14);
    const abs = Math.abs(lm).toFixed(1);
    const icon = signal === 'FOR' ? '▲' : signal === 'AGAINST' ? '▼' : '=';
    return `${icon} ${abs} ${(label || '').padEnd(6)}`.substring(0, 14);
  }

  // ── ATS DASHBOARD ──
  allAtsRows.sort((a, b) => b.currentMOS - a.currentMOS);

  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  ATS DASHBOARD — Model Projection vs Market Lines  (▲ FOR us / ▼ AGAINST us)                                    ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣');
  console.log('║  Team                        │ Proj   │ Open   │ MOS@O  │ Now     │ MOS@C  │ Market Move    │ Models │ Status     ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣');

  for (const row of allAtsRows) {
    const team = row.team.substring(0, 28).padEnd(28);
    const margin = pad(fmt(row.modelMargin), 6);
    const opener = pad(fmt(row.opener), 6);
    const mosO = pad(row.openerMOS != null ? fmt(row.openerMOS) : '??', 6);
    const current = pad(fmt(row.current), 7);
    const mosC = pad(fmt(row.currentMOS), 6);
    const lm = row.sideResult.lineMovement;
    const move = moveLabel(lm, row.sideResult.movementLabel, row.sideResult.movementSignal);
    const models = row.bothCover ? '✓ both' : (row.sideResult.blendCovers ? '△ blend' : '✗ no');
    const status = row.status.padEnd(10);
    console.log(`║  ${team} │ ${margin} │ ${opener} │ ${mosO} │ ${current} │ ${mosC} │ ${move} │ ${models} │ ${status} ║`);
  }

  const atsQualified = allAtsRows.filter(r => r.qualifies);
  const atsStandard = atsQualified.filter(r => r.sideResult.tierInfo?.tier !== 'MARKET_CONFIRMED');
  const atsMktConf = atsQualified.filter(r => r.sideResult.tierInfo?.tier === 'MARKET_CONFIRMED');
  const atsNear = allAtsRows.filter(r => !r.qualifies && r.currentMOS >= 1.0);
  const atsFlagged = atsQualified.filter(r => r.movementTier === 'FLAGGED');
  const atsForUs = allAtsRows.filter(r => r.sideResult.lineMovement > 0).length;
  const atsAgainst = allAtsRows.filter(r => r.sideResult.lineMovement != null && r.sideResult.lineMovement < 0).length;
  const atsFlat = allAtsRows.filter(r => r.sideResult.lineMovement === 0).length;

  console.log('╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣');
  const mktLabel = atsMktConf.length > 0 ? ` (${atsMktConf.length} via market confirm)` : '';
  console.log(`║  QUALIFIES: ${atsQualified.length}${mktLabel}  │  NEAR: ${atsNear.length}  │  FLAGGED: ${atsFlagged.length}  │  ▲${atsForUs} for / =${atsFlat} flat / ▼${atsAgainst} vs  │  ${allAtsRows.length} games`.padEnd(117) + '║');
  console.log(`║  Thresholds: MOS ≥ ${MOS_FLOOR} standard │ MOS ≥ ${MOS_FLOOR_CONFIRMED} with market confirm (line moved ≥1.0 FOR)`.padEnd(117) + '║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝');

  // ── ATS SIGNAL REPORT ──
  const atsSignalRows = allAtsRows.filter(r => r.qualifies || (r.currentMOS >= 1.0 && r.bothCover));
  if (atsSignalRows.length > 0) {
    console.log('\n');
    console.log('┌─────────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│  ATS SIGNAL REPORT — Full breakdown of qualifying + near bets                              │');
    console.log('└─────────────────────────────────────────────────────────────────────────────────────────────┘');
    for (const row of atsSignalRows) {
      const sr = row.sideResult;
      const isFav = sr.spread < 0;
      const side = isFav ? 'FAV' : 'DOG';
      const mv = sr.lineMovement;
      const mvStr = mv != null ? (mv > 0 ? `+${mv}` : `${mv}`) + 'pt' : 'n/a';
      const mvDir = sr.movementTier === 'CONFIRM' ? '✅ FOR' : sr.movementTier === 'FLAGGED' ? '🚫 AGAINST' : '— FLAT';

      console.log(`\n  ┌── ${row.team} ${fmt(sr.spread)} (${side}) ──  ${row.status}`);
      console.log(`  │   MOS: +${sr.mos}  │  Cover%: ${sr.coverProb ? (sr.coverProb * 100).toFixed(1) + '%' : '—'}  │  Signals: ${row.signalCount}/3`);
      console.log(`  │`);
      console.log(`  │   S1 MODELS:    ${row.bothCover ? '✅ Both agree' : '❌ Disagree'}  (blend margin: ${fmt(sr.blendedMargin)})`);
      console.log(`  │   S2 PINNACLE:  ${row.signal2 ? `✅ Edge +${row.pinnEdgePts}pt (Pinn ${fmt(row.pinnSpread)} → ${row.bestBook} ${fmt(row.bestBookSpread)})` : (row.pinnSpread != null ? `❌ No edge (Pinn ${fmt(row.pinnSpread)}, retail same or sharper)` : '⚪ No Pinnacle data')}`);
      console.log(`  │   S3 MOVEMENT:  ${mvDir}  (${mvStr} since open)`);
      if (row.qualifies) {
        const mvMag = Math.abs(mv || 0);
        let units;
        if (row.signalCount === 3) {
          if (row.pinnEdgePts >= 2.5) units = 4;
          else if (row.pinnEdgePts >= 2.0) units = 4;
          else if (row.pinnEdgePts >= 1.5) units = 3;
          else if (row.pinnEdgePts >= 1.0) units = 3;
          else units = 2;
          if (mvMag >= 1.0) units = Math.min(units + 1, 4);
        } else if (row.signal2) {
          if (row.pinnEdgePts >= 2.5) units = 4;
          else if (row.pinnEdgePts >= 2.0) units = 3;
          else if (row.pinnEdgePts >= 1.0) units = 2;
          else units = 1;
          if (mvMag >= 1.0) units = Math.min(units + 1, 4);
        } else {
          units = 1;
        }
        const pinnTier = row.pinnEdgePts >= 2.5 ? '🔥 MASSIVE' : row.pinnEdgePts >= 2.0 ? '🔥 HUGE' : row.pinnEdgePts >= 1.0 ? 'SOLID' : 'MOD';
        const stars = '★'.repeat(units) + '☆'.repeat(4 - units);
        console.log(`  │`);
        console.log(`  │   ➜ ${stars} ${units}u  │  Pinn edge: ${row.signal2 ? pinnTier + ' +' + row.pinnEdgePts + 'pt' : '—'}  │  Mv boost: ${mvMag >= 1.0 ? '+1u' : 'none'}`);
      }
      console.log(`  └────────────────────────────────────────────────`);
    }
  }

  // ── TOTALS DASHBOARD ──
  allTotalsRows.sort((a, b) => b.currentMOT - a.currentMOT);

  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║  TOTALS DASHBOARD — Model Projection vs Market Lines  (▲ FOR us / ▼ AGAINST us)                                 ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣');
  console.log('║  Dir   │ Game                              │ Model  │ Open   │ MOT@O  │ Now     │ MOT@C  │ Market Move    │ Status ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣');

  for (const row of allTotalsRows) {
    const dir = row.direction.padEnd(5);
    const game = row.gameLabel.substring(0, 33).padEnd(33);
    const mdl = pad(row.modelTotal, 6);
    const opener = pad(row.opener != null ? row.opener : '??', 6);
    const motO = pad(row.openerMOT != null ? fmt(row.openerMOT) : '??', 6);
    const current = pad(row.current, 7);
    const motC = pad(fmt(row.currentMOT), 6);
    const lm = row.totalsResult.lineMovement;
    const move = moveLabel(lm, row.totalsResult.movementLabel, row.totalsResult.movementSignal);
    const status = row.status.padEnd(6);
    console.log(`║  ${dir} │ ${game} │ ${mdl} │ ${opener} │ ${motO} │ ${current} │ ${motC} │ ${move} │ ${status} ║`);
  }

  const totQualified = allTotalsRows.filter(r => r.qualifies);
  const totStandard = totQualified.filter(r => r.totalsResult.tierInfo?.tier !== 'MARKET_CONFIRMED');
  const totMktConf = totQualified.filter(r => r.totalsResult.tierInfo?.tier === 'MARKET_CONFIRMED');
  const totNear = allTotalsRows.filter(r => !r.qualifies && r.currentMOT >= 1.0);
  const totFlagged = totQualified.filter(r => r.movementTier === 'FLAGGED');
  const totForUs = allTotalsRows.filter(r => r.totalsResult.lineMovement > 0).length;
  const totAgainst = allTotalsRows.filter(r => r.totalsResult.lineMovement != null && r.totalsResult.lineMovement < 0).length;
  const totFlat = allTotalsRows.filter(r => r.totalsResult.lineMovement === 0).length;

  console.log('╠════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣');
  const totMktLabel = totMktConf.length > 0 ? ` (${totMktConf.length} via market confirm)` : '';
  console.log(`║  QUALIFIES: ${totQualified.length}${totMktLabel}  │  NEAR: ${totNear.length}  │  FLAGGED: ${totFlagged.length}  │  ▲${totForUs} for / =${totFlat} flat / ▼${totAgainst} vs  │  ${allTotalsRows.length} games`.padEnd(117) + '║');
  console.log(`║  Thresholds: MOT ≥ ${MOT_FLOOR} standard │ MOT ≥ ${MOT_FLOOR_CONFIRMED} with market confirm (line moved ≥1.0 FOR)`.padEnd(117) + '║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝');

  // ── TOTALS SIGNAL REPORT ──
  const totSignalRows = allTotalsRows.filter(r => r.qualifies || r.currentMOT >= 2.0);
  if (totSignalRows.length > 0) {
    console.log('\n');
    console.log('┌─────────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│  TOTALS SIGNAL REPORT — Full breakdown of qualifying + near bets                           │');
    console.log('└─────────────────────────────────────────────────────────────────────────────────────────────┘');
    for (const row of totSignalRows) {
      const tr = row.totalsResult;
      const mv = tr.lineMovement;
      const mvStr = mv != null ? (mv > 0 ? `+${mv}` : `${mv}`) + 'pt' : 'n/a';
      const mvDir = tr.movementTier === 'CONFIRM' ? '✅ FOR' : tr.movementTier === 'FLAGGED' ? '🚫 AGAINST' : '— FLAT';

      const drTotal = tr.drTotal;
      const hsTotal = tr.hsTotal;
      const drDir = tr.drOver != null ? (tr.drOver ? 'OVER' : 'UNDER') : '—';
      const hsDir = tr.hsOver != null ? (tr.hsOver ? 'OVER' : 'UNDER') : '—';
      const bothAgree = tr.drOver != null && tr.hsOver != null && tr.drOver === tr.hsOver;

      // DR contrarian check
      const drMargin = drTotal != null && row.opener != null ? Math.round((drTotal - row.opener) * 10) / 10 : null;
      let drContrarian = '—';
      if (tr.direction === 'UNDER' && drMargin != null) {
        if (drMargin <= -5) drContrarian = '🔥 SWEET SPOT (+2u boost)';
        else if (drMargin <= -3) drContrarian = '✅ DR UNDER (+1u boost)';
        else if (drMargin < 0) drContrarian = '· slight under';
        else drContrarian = '❌ DR says OVER';
      } else if (tr.direction === 'OVER') {
        drContrarian = '· N/A (OVER bet)';
      }

      console.log(`\n  ┌── ${row.direction} ${row.current} — ${row.gameLabel} ──  ${row.status}`);
      console.log(`  │   MOT: +${tr.mot}  │  Model Total: ${row.modelTotal}  │  Market: ${row.current}`);
      console.log(`  │`);
      console.log(`  │   MODELS:      DR ${drTotal || '—'} (${drDir}) │ HS ${hsTotal || '—'} (${hsDir}) │ ${bothAgree ? '✅ Agree' : '△ Split'}`);
      console.log(`  │   PINNACLE:    ${row.hasPinnEdge ? `✅ Edge +${row.pinnEdge}pt (Pinn ${row.pinnTotal} → ${row.pinnBook} ${row.pinnBookLine})` : (row.pinnTotal != null ? `❌ No edge (Pinn ${row.pinnTotal}, retail same/sharper)` : '⚪ No Pinnacle data')}`);
      console.log(`  │   MOVEMENT:    ${mvDir}  (${mvStr} since open)`);
      console.log(`  │   DR CONTRA:   ${drContrarian}  (DR margin: ${drMargin != null ? fmt(drMargin) : '—'})`);

      if (row.qualifies) {
        // Reconstruct unit sizing
        let baseUnits;
        if (row.hasPinnEdge) {
          if (row.pinnEdge >= 2.5) baseUnits = 4;
          else if (row.pinnEdge >= 2.0) baseUnits = 3;
          else if (row.pinnEdge >= 1.5) baseUnits = 3;
          else if (row.pinnEdge >= 1.0) baseUnits = 2;
          else baseUnits = 1;
        } else baseUnits = 1;
        const mvMag = Math.abs(mv || 0);
        let u = baseUnits;
        let mvBoost = false;
        if (tr.movementTier === 'CONFIRM' && mvMag >= 1.0) { u = Math.min(u + 1, 4); mvBoost = true; }
        const drB = applyDRUnderBoost(u, tr);
        const capped = applyMOTCap(drB.units, tr.mot);
        const final = tr.movementTier === 'FLAGGED' ? 0 : capped;
        const pinnTier = row.pinnEdge >= 2.5 ? '🔥 MASSIVE' : row.pinnEdge >= 2.0 ? '🔥 HUGE' : row.pinnEdge >= 1.0 ? 'SOLID' : 'MOD';
        const stars = final > 0 ? '★'.repeat(final) + '☆'.repeat(Math.max(0, 4 - final)) : '💀 KILLED';
        console.log(`  │`);
        console.log(`  │   ➜ ${stars} ${final > 0 ? final + 'u' : ''}  │  Pinn edge: ${row.hasPinnEdge ? pinnTier + ' +' + row.pinnEdge + 'pt→' + baseUnits + 'u' : '1u (no data)'}  │  Mv boost: ${mvBoost ? '+1u' : 'none'}  │  DR boost: ${drB.boost > 0 ? '+' + drB.boost + 'u (' + drB.drTier + ')' : 'none'}${capped < drB.units ? '  │  MOT cap: ' + drB.units + 'u→' + capped + 'u' : ''}`);
      }
      console.log(`  └────────────────────────────────────────────────`);
    }
  }

  // ── BET ACTIONS SUMMARY ──
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                       BET ACTIONS THIS RUN                                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

  console.log(`   Games evaluated:  ${evalsSnapshot.size}`);
  console.log(`   Odds API matches: ${evalsSnapshot.size - counters.noMatch}`);
  console.log(`   ─────────────────────────────────`);
  console.log(`   🆕 New bets:      ${counters.created}`);
  console.log(`   🔄 Updated:       ${counters.updated}`);
  console.log(`   🔒 Stable:        ${counters.stable}`);
  console.log(`   💀 Killed:        ${counters.killed}`);
  console.log(`   ⏭️  No match:      ${counters.noMatch}`);

  if (counters.created > 0) {
    console.log(`\n   🎯 ${counters.created} NEW bet${counters.created > 1 ? 's' : ''} triggered by line movement!`);
  }
  if (counters.killed > 0) {
    console.log(`   ⚠️  ${counters.killed} bet${counters.killed > 1 ? 's' : ''} KILLED — line moved against.`);
  }

  console.log('');
}

checkLineMovement()
  .then(() => {
    console.log('✅ Line monitor complete.\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Line monitor failed:', error.message);
    process.exit(1);
  });
