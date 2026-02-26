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
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, setDoc, getDoc, doc } from 'firebase/firestore';

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

const MOS_FLOOR = 2.0;
const MOT_FLOOR = 4.5;

function getMOSTier(mos) {
  if (mos >= 4)    return { tier: 'MAXIMUM', units: 5 };
  if (mos >= 3)    return { tier: 'ELITE',   units: 4 };
  if (mos >= 2.5)  return { tier: 'STRONG',  units: 3 };
  if (mos >= 2.25) return { tier: 'SOLID',   units: 2 };
  if (mos >= MOS_FLOOR) return { tier: 'BASE', units: 1 };
  return null;
}

function getMOTTier(mot) {
  if (mot >= 7)          return { tier: 'MAXIMUM', units: 5 };
  if (mot >= 6)          return { tier: 'ELITE',   units: 4 };
  if (mot >= 5.5)        return { tier: 'STRONG',  units: 3 };
  if (mot >= 5)          return { tier: 'SOLID',   units: 2 };
  if (mot >= MOT_FLOOR)  return { tier: 'BASE',    units: 1 };
  return null;
}

function applyMovementGate(baseUnits, movementTier) {
  if (movementTier === 'FLAGGED') return null;
  if (movementTier === 'CONFIRM') return Math.min(baseUnits + 1, 5);
  return baseUnits;
}

function getMovementTier(lineMovement) {
  if (lineMovement >= 1.0)  return 'CONFIRM';
  if (lineMovement >= -0.5) return 'NEUTRAL';
  return 'FLAGGED';
}

function estimateCoverProb(mos) {
  return Math.max(0.01, Math.min(0.95, 0.50 + (mos * 0.03)));
}

function calcSpreadEV(coverProb) {
  return (coverProb * (100 / 110)) - ((1 - coverProb) * 1);
}

// ─── Team Name Matching ──────────────────────────────────────────────

function normalizeTeam(name) {
  return (name || '').toLowerCase().replace(/[^a-z]/g, '');
}

function teamsMatch(a, b) {
  const na = normalizeTeam(a);
  const nb = normalizeTeam(b);
  return na.length >= 4 && nb.length >= 4 && (na.includes(nb) || nb.includes(na));
}

function findOddsApiGame(evalData, oddsGames) {
  const away = evalData.game?.awayTeam;
  const home = evalData.game?.homeTeam;
  if (!away || !home) return null;
  return oddsGames.find(g =>
    teamsMatch(away, g.away_team) && teamsMatch(home, g.home_team)
  ) || oddsGames.find(g =>
    teamsMatch(away, g.home_team) && teamsMatch(home, g.away_team)
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
  const url = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=spreads,totals&oddsFormat=american&bookmakers=draftkings`;
  const res = await retryFetch(url);
  if (!res.ok) throw new Error(`Odds API error: ${res.status} ${res.statusText}`);

  const remaining = res.headers.get('x-requests-remaining');
  const used = res.headers.get('x-requests-used');
  console.log(`   📡 Odds API: ${used} used / ${remaining} remaining\n`);

  const raw = await res.json();
  return raw.map(game => {
    const bk = game.bookmakers?.[0];
    const spreadMarket = bk?.markets?.find(m => m.key === 'spreads');
    const totalMarket = bk?.markets?.find(m => m.key === 'totals');

    const spreads = {};
    if (spreadMarket) {
      for (const o of spreadMarket.outcomes) {
        if (teamsMatch(o.name, game.away_team)) spreads.away = o.point;
        else if (teamsMatch(o.name, game.home_team)) spreads.home = o.point;
      }
    }

    return {
      id: game.id,
      away_team: game.away_team,
      home_team: game.home_team,
      commence_time: game.commence_time,
      awaySpread: spreads.away ?? null,
      homeSpread: spreads.home ?? null,
      total: totalMarket?.outcomes?.[0]?.point ?? null,
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

    const drCovers = drMargin > -spread;
    const hsCovers = hsMargin > -spread;
    const bothCover = drCovers && hsCovers;
    const blendCovers = blendedMargin > -spread;
    const mos = Math.round((blendedMargin + spread) * 10) / 10;

    let lineMovement = null;
    let movementTier = 'UNKNOWN';
    if (openerSpread != null) {
      lineMovement = Math.round((openerSpread - spread) * 10) / 10;
      movementTier = getMovementTier(lineMovement);
    }

    const tierInfo = getMOSTier(mos);
    const qualifies = bothCover && tierInfo != null;

    results.push({
      side, teamName, spread, openerSpread,
      drMargin: Math.round(drMargin * 10) / 10,
      hsMargin: Math.round(hsMargin * 10) / 10,
      blendedMargin: Math.round(blendedMargin * 10) / 10,
      drCovers, hsCovers, blendCovers, bothCover,
      mos, tierInfo, qualifies,
      lineMovement, movementTier,
      isFavorite: spread < 0,
    });
  }

  return results;
}

function evaluateTotalsFromEval(evalData, currentTotal) {
  const model = evalData.modelData;
  const openerTotal = evalData.openers?.openerTotal ?? evalData.openers?.total;

  if (currentTotal == null) return null;

  const drOver = model.drTotal > currentTotal;
  const hsOver = model.hsTotal > currentTotal;
  const bothAgreeOver = drOver && hsOver;
  const bothAgreeUnder = !drOver && !hsOver;

  if (!bothAgreeOver && !bothAgreeUnder) return null;

  const direction = bothAgreeOver ? 'OVER' : 'UNDER';
  const margin = model.blendedTotal - currentTotal;
  const mot = Math.round(Math.abs(margin) * 10) / 10;

  let lineMovement = null;
  let movementTier = 'UNKNOWN';
  if (openerTotal != null) {
    lineMovement = direction === 'OVER'
      ? Math.round((currentTotal - openerTotal) * 10) / 10
      : Math.round((openerTotal - currentTotal) * 10) / 10;
    movementTier = getMovementTier(lineMovement);
  }

  const tierInfo = getMOTTier(mot);
  const qualifies = tierInfo != null;

  return {
    direction, marketTotal: currentTotal, openerTotal,
    mot, tierInfo, qualifies,
    lineMovement, movementTier,
    drTotal: model.drTotal, hsTotal: model.hsTotal,
    blendedTotal: model.blendedTotal,
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

  const adjustedUnits = applyMovementGate(sideResult.tierInfo.units, sideResult.movementTier);
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
      'spreadAnalysis.spread': sideResult.spread,
      'spreadAnalysis.lineMovement': sideResult.lineMovement,
      'spreadAnalysis.movementTier': newTier,
      'spreadAnalysis.marginOverSpread': sideResult.mos,
      'spreadAnalysis.drCovers': sideResult.drCovers,
      'spreadAnalysis.hsCovers': sideResult.hsCovers,
      'spreadAnalysis.bothModelsCover': sideResult.bothCover,
      'spreadAnalysis.unitTier': tier,
      'betRecommendation.lineMovement': sideResult.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.atsSpread': sideResult.spread,
      'betRecommendation.marginOverSpread': sideResult.mos,
      'bet.spread': sideResult.spread,
      lastUpdatedAt: Date.now(),
      lastLineCheckAt: Date.now(),
    };

    if (isFlagged) {
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
      updateData['bet.units'] = units;
      updateData['betRecommendation.atsUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData.betStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
      await updateDoc(betRef, updateData);
      const wasRevived = prevStatus === 'KILLED' || prevStatus === 'FLAGGED';
      const label = wasRevived ? '🔄 REVIVED' : (newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED');
      console.log(`   ${label}: ${pickTeam} ${sideResult.spread} — ${prevTier} → ${newTier} | ${units}u [${tier}]`);
      counters.updated++;
      return;
    }

    updateData['bet.units'] = units;
    updateData['betRecommendation.atsUnits'] = units;
    updateData['prediction.unitSize'] = units;
    await updateDoc(betRef, updateData);
    console.log(`   🔒 Stable: ${pickTeam} ${sideResult.spread} — still ${newTier} | ${units}u`);
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
    },
    barttorvik: evalData.barttorvik || null,
  };

  await setDoc(betRef, betData);
  const mvTag = sideResult.movementTier === 'CONFIRM' ? '🟢 STEAM' : '';
  console.log(`   🆕 NEW BET: ${pickTeam} ${sideResult.spread} → ${units}u [${tier}] MOS +${sideResult.mos} ${mvTag}`);
  counters.created++;
}

async function createOrUpdateTotalsBet(evalData, totalsResult, counters) {
  const date = evalData.date;
  const game = evalData.game;
  const awayNorm = game.awayTeam.replace(/\s+/g, '_').toUpperCase();
  const homeNorm = game.homeTeam.replace(/\s+/g, '_').toUpperCase();
  const betId = `${date}_${awayNorm}_${homeNorm}_TOTAL_${totalsResult.direction}`;

  const adjustedUnits = applyMovementGate(totalsResult.tierInfo.units, totalsResult.movementTier);
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
      'totalsAnalysis.marketTotal': totalsResult.marketTotal,
      'totalsAnalysis.lineMovement': totalsResult.lineMovement,
      'totalsAnalysis.movementTier': newTier,
      'totalsAnalysis.marginOverTotal': totalsResult.mot,
      'totalsAnalysis.drOver': totalsResult.drOver,
      'totalsAnalysis.hsOver': totalsResult.hsOver,
      'totalsAnalysis.bothModelsAgree': totalsResult.bothAgreeOver || totalsResult.bothAgreeUnder,
      'totalsAnalysis.unitTier': tier,
      'betRecommendation.lineMovement': totalsResult.lineMovement,
      'betRecommendation.movementTier': newTier,
      'betRecommendation.totalLine': totalsResult.marketTotal,
      'betRecommendation.marginOverTotal': totalsResult.mot,
      'bet.total': totalsResult.marketTotal,
      lastUpdatedAt: Date.now(),
      lastLineCheckAt: Date.now(),
    };

    if (isFlagged) {
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
      updateData['bet.units'] = units;
      updateData['betRecommendation.totalUnits'] = units;
      updateData['prediction.unitSize'] = units;
      updateData.betStatus = newTier === 'CONFIRM' ? 'BET_NOW' : 'HOLD';
      await updateDoc(betRef, updateData);
      const wasRevived = prevStatus === 'KILLED' || prevStatus === 'FLAGGED';
      const label = wasRevived ? '🔄 REVIVED' : (newTier === 'CONFIRM' && prevTier !== 'CONFIRM' ? '⬆️  UPGRADED' : '🔄 UPDATED');
      console.log(`   ${label}: ${totalsResult.direction} ${totalsResult.marketTotal} — ${prevTier} → ${newTier} | ${units}u [${tier}] (${gameLabel})`);
      counters.updated++;
      return;
    }

    updateData['bet.units'] = units;
    updateData['betRecommendation.totalUnits'] = units;
    updateData['prediction.unitSize'] = units;
    await updateDoc(betRef, updateData);
    console.log(`   🔒 Stable: ${totalsResult.direction} ${totalsResult.marketTotal} — still ${newTier} | ${units}u (${gameLabel})`);
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
    },
    barttorvik: evalData.barttorvik || null,
  };

  await setDoc(betRef, betData);
  const mvTag = totalsResult.movementTier === 'CONFIRM' ? '🟢 STEAM' : '';
  console.log(`   🆕 NEW BET: ${totalsResult.direction} ${totalsResult.marketTotal} → ${units}u [${tier}] MOT +${totalsResult.mot} ${mvTag} (${gameLabel})`);
  counters.created++;
}

async function killExistingBet(betDoc, reason, counters) {
  const data = betDoc.data();
  const status = data.betStatus;
  if (status === 'KILLED') return; // already dead

  const market = data.bet?.market;
  const label = market === 'SPREAD'
    ? `${data.bet?.pick} ${data.bet?.spread}`
    : `${data.bet?.pick} ${data.bet?.total}`;

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

  // 1. Load game evaluations
  console.log(`📋 Loading game evaluations for ${today}...`);
  const evalsRef = collection(db, 'game_evaluations');
  const evalsQuery = query(evalsRef, where('date', '==', today));
  const evalsSnapshot = await getDocs(evalsQuery);
  console.log(`   ✅ ${evalsSnapshot.size} game evaluations loaded\n`);

  if (evalsSnapshot.size === 0) {
    console.log('   ⚠️  No evaluations found. Run fetch-prime-picks first.\n');
    return;
  }

  // 2. Load existing bets (to detect kills for bets with no qualifying evaluation)
  console.log('📋 Loading existing bets...');
  const betsRef = collection(db, 'basketball_bets');
  const betsQuery = query(betsRef, where('date', '==', today));
  const betsSnapshot = await getDocs(betsQuery);

  const existingBetIds = new Set();
  const activeBetDocs = [];
  for (const betDoc of betsSnapshot.docs) {
    const status = betDoc.data().betStatus;
    existingBetIds.add(betDoc.id);
    if (status !== 'KILLED') activeBetDocs.push(betDoc);
  }
  console.log(`   ✅ ${betsSnapshot.size} total bets (${activeBetDocs.length} active)\n`);

  // 3. Fetch current lines
  console.log('📡 Fetching current NCAAB lines from The Odds API...');
  const oddsGames = await fetchCurrentLines();
  console.log(`   ✅ ${oddsGames.length} games with lines\n`);

  // 4. Process each evaluation
  const counters = { created: 0, updated: 0, stable: 0, killed: 0, skipped: 0, noMatch: 0 };
  const processedBetIds = new Set();

  console.log('┌───────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ EVALUATING ALL GAMES AGAINST CURRENT LINES                                    │');
  console.log('└───────────────────────────────────────────────────────────────────────────────┘\n');

  for (const evalDoc of evalsSnapshot.docs) {
    const evalData = evalDoc.data();
    const oddsGame = findOddsApiGame(evalData, oddsGames);
    const gameLabel = `${evalData.game.awayTeam} @ ${evalData.game.homeTeam}`;

    if (!oddsGame) {
      counters.noMatch++;
      continue;
    }

    // Update evaluation with latest lines
    await updateDoc(doc(db, 'game_evaluations', evalDoc.id), {
      'currentLines.awaySpread': oddsGame.awaySpread,
      'currentLines.homeSpread': oddsGame.homeSpread,
      'currentLines.total': oddsGame.total,
      'currentLines.lastCheckedAt': Date.now(),
      lastUpdatedAt: Date.now(),
    });

    // ── ATS: evaluate both sides ──
    const atsResults = evaluateATSFromEval(evalData, oddsGame.awaySpread, oddsGame.homeSpread);
    const qualifyingATS = atsResults.filter(r => r.qualifies);

    if (qualifyingATS.length > 0) {
      const best = qualifyingATS.sort((a, b) => b.mos - a.mos)[0];
      await createOrUpdateATSBet(evalData, best, counters);

      const side = best.side === 'away' ? 'AWAY' : 'HOME';
      const teamNorm = best.teamName.replace(/\s+/g, '_').toUpperCase();
      const awayNorm = evalData.game.awayTeam.replace(/\s+/g, '_').toUpperCase();
      const homeNorm = evalData.game.homeTeam.replace(/\s+/g, '_').toUpperCase();
      processedBetIds.add(`${today}_${awayNorm}_${homeNorm}_SPREAD_${teamNorm}_(${side})`);
    }

    // ── Totals: evaluate at current total ──
    const totalsResult = evaluateTotalsFromEval(evalData, oddsGame.total);
    if (totalsResult?.qualifies) {
      await createOrUpdateTotalsBet(evalData, totalsResult, counters);

      const awayNorm = evalData.game.awayTeam.replace(/\s+/g, '_').toUpperCase();
      const homeNorm = evalData.game.homeTeam.replace(/\s+/g, '_').toUpperCase();
      processedBetIds.add(`${today}_${awayNorm}_${homeNorm}_TOTAL_${totalsResult.direction}`);
    }
  }

  // 5. Kill existing bets that no longer qualify at current lines
  console.log('');
  for (const betDoc of activeBetDocs) {
    if (processedBetIds.has(betDoc.id)) continue;
    const data = betDoc.data();
    if (data.betStatus === 'FLAGGED') continue; // already flagged from morning
    await killExistingBet(betDoc, 'no longer qualifies at current line', counters);
  }

  // 6. Summary
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    LINE MONITOR SUMMARY                                       ║');
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
