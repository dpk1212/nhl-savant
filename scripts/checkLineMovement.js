/**
 * CHECK LINE MOVEMENT V2 — Evaluation-Based Line Monitor
 *
 * The morning fetch saves model evaluations for EVERY game to Firebase.
 * This script uses the Odds API to get current lines and re-evaluates
 * each game against the stored model data. When the market aligns with
 * the model (MOS/MOT crosses threshold + movement gate passes), it
 * creates/upgrades the official bet. When lines move against, it kills.
 *
 * Flow:
 *   1. Load ALL today's game evaluations from Firebase (static model data)
 *   2. Load existing bets from Firebase (to update/kill)
 *   3. Fetch current lines from The Odds API (~1 credit)
 *   4. For each game: evaluate both ATS sides + totals at current lines
 *   5. Create new bets, upgrade existing, or kill when edge disappears
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
const MOT_FLOOR = 1.5;
const MOT_FLOOR_CONFIRMED = 1.0;

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
  return Math.max(0.01, Math.min(0.95, 0.50 + (mos * 0.03)));
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

  // Map: normalized_name (lowercase) → odds_api_name
  const map = new Map();
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const normName = (cols[0] || '').trim();
    const oddsApiName = (cols[oddsApiIdx] || '').trim();
    if (normName && oddsApiName) {
      map.set(normName.toLowerCase(), oddsApiName);
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
    .replace(/state/g, 'st')
    .replace(/saint/g, 'st')
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
  const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=spreads,totals&oddsFormat=american`;
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

    for (const bk of (game.bookmakers || [])) {
      const spreadMarket = bk.markets?.find(m => m.key === 'spreads');
      if (spreadMarket) {
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
        for (const o of totalMarket.outcomes) {
          if (o.name === 'Over') {
            if (lowestTotal === null || o.point < lowestTotal) {
              lowestTotal = o.point;
              overBook = bk.key;
            }
            if (highestTotal === null || o.point > highestTotal) {
              highestTotal = o.point;
              underBook = bk.key;
            }
          }
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

  const adjustedUnits = applyMovementGate(sideResult.tierInfo.units, sideResult.movementTier, sideResult.movementLabel);
  const isFlagged = adjustedUnits === null;
  const units = isFlagged ? 0 : adjustedUnits;
  const tier = sideResult.tierInfo.tier;

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
      'betRecommendation.lineMovement': sideResult.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.marginOverSpread': sideResult.mos,
      lastUpdatedAt: Date.now(),
      lastLineCheckAt: Date.now(),
      lineHistory: arrayUnion({ t: Date.now(), spread: sideResult.spread, total: null }),
    };

    if (!prev.isLocked) {
      updateData['spreadAnalysis.spread'] = sideResult.spread;
      updateData['betRecommendation.atsSpread'] = sideResult.spread;
      updateData['bet.spread'] = sideResult.spread;
    }

    if (isFlagged) {
      if (prev.isLocked) {
        await updateDoc(betRef, updateData);
        console.log(`   🔒 LOCKED: ${pickTeam} ${sideResult.spread} — line moved against but bet is locked for user`);
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
      const prevUnits = prev.bet?.units || prev.prediction?.unitSize || '?';
      const displayUnits = prev.isLocked ? prevUnits : units;
      const wasRevived = prevStatus === 'KILLED' || prevStatus === 'FLAGGED';
      const label = wasRevived ? '🔄 REVIVED' : (newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED');
      console.log(`   ${label}: ${pickTeam} ${sideResult.spread} — ${prevTier} → ${newTier} | ${displayUnits}u [${tier}]${prev.isLocked ? ' (locked)' : ''}`);
      counters.updated++;
      return;
    }

    if (!prev.isLocked) {
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
    }
    await updateDoc(betRef, updateData);
    const stableUnits = prev.isLocked ? (prev.bet?.units || prev.prediction?.unitSize || '?') : units;
    console.log(`   🔒 Stable: ${pickTeam} ${sideResult.spread} — still ${newTier} | ${stableUnits}u${prev.isLocked ? ' (locked)' : ''}`);
    counters.stable++;
    return;
  }

  // No existing bet — CREATE a new one (line moved into range!)
  if (isFlagged) {
    counters.skipped++;
    return;
  }

  const coverProb = estimateCoverProb(sideResult.mos);
  const spreadEV = calcSpreadEV(coverProb);
  const pred = evalData.prediction;

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
    source: 'LINE_MONITOR',
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
  const mvTag = sideResult.movementLabel ? `${sideResult.movementLabel} ${sideResult.movementSignal}` : '';
  console.log(`   🆕 NEW BET: ${pickTeam} ${sideResult.spread} → ${units}u [${tier}] MOS +${sideResult.mos} ${mvTag}`);
  counters.created++;
}

async function createOrUpdateTotalsBet(evalData, totalsResult, counters) {
  const date = evalData.date;
  const game = evalData.game;
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_TOTAL_${totalsResult.direction}`;

  const adjustedUnits = applyMovementGate(totalsResult.tierInfo.units, totalsResult.movementTier, totalsResult.movementLabel);
  const isFlagged = adjustedUnits === null;
  const units = isFlagged ? 0 : adjustedUnits;
  const tier = totalsResult.tierInfo.tier;
  const gameLabel = `${game.awayTeam} @ ${game.homeTeam}`;

  const betRef = doc(db, 'basketball_bets', betId);
  const existing = await getDoc(betRef);

  if (existing.exists()) {
    const prev = existing.data();
    const prevTier = prev.totalsAnalysis?.movementTier || prev.betRecommendation?.movementTier || 'UNKNOWN';
    const prevStatus = prev.betStatus || 'UNKNOWN';
    const newTier = totalsResult.movementTier;
    const tierChanged = prevTier !== newTier;

    const updateData = {
      'totalsAnalysis.currentTotal': totalsResult.marketTotal,
      'totalsAnalysis.lineMovement': totalsResult.lineMovement,
      'totalsAnalysis.movementTier': newTier,
      'totalsAnalysis.marginOverTotal': totalsResult.mot,
      'totalsAnalysis.drOver': totalsResult.drOver,
      'totalsAnalysis.hsOver': totalsResult.hsOver,
      'totalsAnalysis.bothModelsAgree': totalsResult.bothAgreeOver || totalsResult.bothAgreeUnder,
      'totalsAnalysis.unitTier': tier,
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
        console.log(`   🔒 LOCKED: ${totalsResult.direction} ${totalsResult.marketTotal} — line moved against but bet is locked for user (${gameLabel})`);
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
      const prevUnits = prev.bet?.units || prev.prediction?.unitSize || '?';
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
    const stableUnits = prev.isLocked ? (prev.bet?.units || prev.prediction?.unitSize || '?') : units;
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
  console.log('║        LINE MONITOR V2 — Evaluation-Based Line Tracking                       ║');
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

    // ── ATS: evaluate both sides, pick best ──
    const atsResults = evaluateATSFromEval(evalData, oddsGame.awaySpread, oddsGame.homeSpread);
    const best = atsResults.sort((a, b) => b.mos - a.mos)[0];

    if (best) {
      const openerSpread = best.openerSpread;
      const openerMOS = openerSpread != null ? Math.round((best.blendedMargin + openerSpread) * 10) / 10 : null;
      const lineShift = (openerSpread != null && best.spread != null) ? Math.round((best.spread - openerSpread) * 10) / 10 : null;

      let status = '—';
      const isMarketConfirmed = best.tierInfo?.tier === 'MARKET_CONFIRMED';
      if (best.qualifies && best.movementTier === 'FLAGGED') status = '🚫 FLAGGED';
      else if (best.qualifies && isMarketConfirmed) status = '🟢 MKTCONF';
      else if (best.qualifies && best.movementTier === 'CONFIRM') status = '🟢 BET_NOW';
      else if (best.qualifies) status = '🟡 HOLD';
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
        qualifies: best.qualifies,
        gameLabel,
        sideResult: best,
        evalData,
      });
    }

    // ── ATS: handle bet actions ──
    const qualifyingATS = atsResults.filter(r => r.qualifies);
    if (qualifyingATS.length > 0) {
      const bestQ = qualifyingATS.sort((a, b) => b.mos - a.mos)[0];
      const adjustedUnits = applyMovementGate(bestQ.tierInfo.units, bestQ.movementTier, bestQ.movementLabel);
      if (adjustedUnits !== null || bestQ.movementTier !== 'FLAGGED') {
        await createOrUpdateATSBet(evalData, bestQ, counters);
      }

      const side = bestQ.side === 'away' ? 'AWAY' : 'HOME';
      const teamNorm = bestQ.teamName.replace(/\s+/g, '_').toUpperCase();
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
      });
    }

    // ── Totals: handle bet actions ──
    if (totalsResult?.qualifies) {
      const adjustedUnits = applyMovementGate(totalsResult.tierInfo.units, totalsResult.movementTier, totalsResult.movementLabel);
      if (adjustedUnits !== null || totalsResult.movementTier !== 'FLAGGED') {
        await createOrUpdateTotalsBet(evalData, totalsResult, counters);
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
