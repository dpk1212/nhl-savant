/**
 * MLB MODEL PICKS V1 — DRatings + Dimers Ensemble
 *
 * Each unit of conviction comes from an INDEPENDENT source:
 *   GATE  → Model agreement (do both models pick the same winner?)
 *   BASE  → EV magnitude (how mispriced is retail vs ensemble fair value?)
 *   BOOST → Model agreement bonus (+1u when both models align)
 *
 * MONEYLINE picks only (baseball is fundamentally a ML sport).
 * Run line and totals evaluations stored for analysis but not bet on in V1.
 *
 * Usage: node scripts/fetchMLBPicks.js
 */

import Firecrawl from '@mendable/firecrawl-js';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { parseMLBDRatings } from '../src/utils/mlbDratingsParser.js';
import { parseMLBDimers } from '../src/utils/mlbDimersParser.js';
import { normalizeMLBTeam, fullTeamName } from '../src/utils/mlbTeamMap.js';
import { calculateMLBPrediction, calculateUnits } from '../src/utils/mlbEdgeCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ODDS_API_KEY = process.env.ODDS_API_KEY;

// ─── Helpers ────────────────────────────────────────────────────────

async function retryWithBackoff(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`   ⚠️  Attempt ${i + 1} failed: ${error.message}`);
      console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

function todayET() {
  const d = new Date();
  const et = new Date(d.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return `${et.getFullYear()}-${String(et.getMonth() + 1).padStart(2, '0')}-${String(et.getDate()).padStart(2, '0')}`;
}

// ─── Step 1: Fetch Sharp + Retail Lines ─────────────────────────────

async function fetchMLBOdds() {
  if (!ODDS_API_KEY) {
    console.log('   ⚠️  No ODDS_API_KEY — skipping odds fetch');
    return [];
  }
  const url = `https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=${ODDS_API_KEY}&regions=us,eu&markets=h2h,spreads,totals&oddsFormat=american&bookmakers=pinnacle,draftkings,fanduel,betmgm,caesars`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`   ⚠️  Odds API error: ${res.status}`);
    return [];
  }
  const remaining = res.headers.get('x-requests-remaining');
  console.log(`   📡 Odds API credits remaining: ${remaining}`);

  const data = await res.json();
  return data.map(event => {
    const awayCode = normalizeMLBTeam(event.away_team);
    const homeCode = normalizeMLBTeam(event.home_team);
    if (!awayCode || !homeCode) return null;

    let pinnacleAway = null, pinnacleHome = null;
    let bestAwayOdds = null, bestHomeOdds = null;
    let awayBook = null, homeBook = null;
    let runLine = null, totalLine = null;

    for (const bm of event.bookmakers || []) {
      for (const mkt of bm.markets || []) {
        if (mkt.key === 'h2h') {
          const awayOutcome = mkt.outcomes.find(o => normalizeMLBTeam(o.name) === awayCode);
          const homeOutcome = mkt.outcomes.find(o => normalizeMLBTeam(o.name) === homeCode);
          if (bm.key === 'pinnacle') {
            pinnacleAway = awayOutcome?.price ?? null;
            pinnacleHome = homeOutcome?.price ?? null;
          }
          if (awayOutcome?.price != null && (bestAwayOdds == null || awayOutcome.price > bestAwayOdds)) {
            bestAwayOdds = awayOutcome.price;
            awayBook = bm.title;
          }
          if (homeOutcome?.price != null && (bestHomeOdds == null || homeOutcome.price > bestHomeOdds)) {
            bestHomeOdds = homeOutcome.price;
            homeBook = bm.title;
          }
        }
        if (mkt.key === 'spreads' && bm.key === 'pinnacle') {
          runLine = {
            awaySpread: mkt.outcomes.find(o => normalizeMLBTeam(o.name) === awayCode)?.point ?? null,
            homeSpread: mkt.outcomes.find(o => normalizeMLBTeam(o.name) === homeCode)?.point ?? null,
          };
        }
        if (mkt.key === 'totals' && bm.key === 'pinnacle') {
          const over = mkt.outcomes.find(o => o.name === 'Over');
          if (over) totalLine = over.point;
        }
      }
    }

    return {
      awayTeam: awayCode,
      homeTeam: homeCode,
      matchup: `${awayCode}_${homeCode}`,
      commenceTime: event.commence_time,
      awayOdds: bestAwayOdds,
      homeOdds: bestHomeOdds,
      awayBook,
      homeBook,
      pinnacleAway,
      pinnacleHome,
      runLine,
      totalLine,
    };
  }).filter(Boolean);
}

// ─── Step 2: Match Games Across Sources ────────────────────────────

function matchGames(dratingsGames, dimersGames, oddsGames) {
  const matched = [];

  for (const odds of oddsGames) {
    const dr = dratingsGames.find(g => g.awayTeam === odds.awayTeam && g.homeTeam === odds.homeTeam);
    const dim = dimersGames.find(g => g.awayTeam === odds.awayTeam && g.homeTeam === odds.homeTeam);

    if (!dr && !dim) continue;

    matched.push({
      awayTeam: odds.awayTeam,
      homeTeam: odds.homeTeam,
      awayTeamFull: dr?.awayTeamFull || fullTeamName(odds.awayTeam),
      homeTeamFull: dr?.homeTeamFull || fullTeamName(odds.homeTeam),
      commenceTime: odds.commenceTime,
      dratings: dr || null,
      dimers: dim || null,
      odds,
    });
  }

  return matched;
}

// ─── Step 3: Evaluate & Pick ────────────────────────────────────────

function evaluateGames(matchedGames) {
  const picks = [];
  const evaluations = [];

  for (const game of matchedGames) {
    const prediction = calculateMLBPrediction(game);
    if (prediction.error) {
      evaluations.push({ ...game, prediction, units: 0, action: 'SKIP', reason: prediction.error });
      continue;
    }

    const units = calculateUnits(prediction);
    const action = units > 0 ? 'BET' : 'EVALUATE';

    const entry = { ...game, prediction, units, action };
    evaluations.push(entry);

    if (units > 0) {
      picks.push(entry);
    }
  }

  return { picks, evaluations };
}

// ─── Step 4: Write to Firebase ──────────────────────────────────────

async function writePickToFirebase(pick, date) {
  const awayNorm = pick.awayTeam.toUpperCase();
  const homeNorm = pick.homeTeam.toUpperCase();
  const betId = `${date}_MLB_${awayNorm}_${homeNorm}`;

  const p = pick.prediction;
  const pickTeam = p.bestSide === 'away' ? pick.awayTeamFull : pick.homeTeamFull;

  const betData = {
    id: betId,
    date,
    timestamp: Date.now(),
    sport: 'MLB',

    game: {
      awayTeam: pick.awayTeamFull,
      homeTeam: pick.homeTeamFull,
      awayCode: pick.awayTeam,
      homeCode: pick.homeTeam,
      gameTime: pick.dratings?.gameTime || 'TBD',
      commenceTime: pick.commenceTime || null,
      awayPitcher: p.awayPitcher || null,
      homePitcher: p.homePitcher || null,
    },

    bet: {
      market: 'MONEYLINE',
      pick: pickTeam,
      pickCode: p.bestSide === 'away' ? pick.awayTeam : pick.homeTeam,
      side: p.bestSide,
      odds: p.bestOdds,
      book: p.bestBook || 'Best Available',
      units: pick.units,
    },

    prediction: {
      ensembleAwayProb: p.ensembleAwayProb,
      ensembleHomeProb: p.ensembleHomeProb,
      dratingsAwayProb: p.dratingsAwayProb,
      dratingsHomeProb: p.dratingsHomeProb,
      dimersAwayProb: p.dimersAwayProb,
      dimersHomeProb: p.dimersHomeProb,
      marketAwayProb: p.marketAwayProb,
      marketHomeProb: p.marketHomeProb,
      bestEV: Math.round(p.bestEV * 100) / 100,
      bestEdge: Math.round(p.bestEdge * 10000) / 10000,
      grade: p.grade,
      confidence: p.confidence,
      modelsAgree: p.modelsAgree,
      pinnacleEdge: p.pinnacleEdge != null ? Math.round(p.pinnacleEdge * 100) / 100 : null,
      predictedTotal: p.predictedTotal,
      dratingsAwayRuns: p.dratingsAwayRuns,
      dratingsHomeRuns: p.dratingsHomeRuns,
    },

    pinnacle: pick.odds.pinnacleAway ? {
      awayOdds: pick.odds.pinnacleAway,
      homeOdds: pick.odds.pinnacleHome,
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
      source: null,
    },

    status: 'PENDING',
    betStatus: 'BET_NOW',
    isLocked: true,
    lockedAt: Date.now(),
    firstRecommendedAt: Date.now(),
    lastUpdatedAt: Date.now(),
    source: 'MLB_MODEL_V1',
    isMLBPick: true,
  };

  const ref = doc(db, 'mlb_bets', betId);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    const existingData = existing.data();
    if (existingData.status === 'COMPLETED') {
      console.log(`   ℹ️  ${betId} already graded — skipping`);
      return { betId, action: 'skipped' };
    }

    const ct = existingData.game?.commenceTime;
    const gameStart = ct ? new Date(ct).getTime() : null;
    const LOCK_BUFFER_MS = 5 * 60 * 1000;
    const isLocked = gameStart && Date.now() >= gameStart - LOCK_BUFFER_MS;

    if (isLocked) {
      console.log(`   🔒 ${betId} odds locked (game starting) — skipping update`);
      return { betId, action: 'locked' };
    }

    console.log(`   ℹ️  ${betId} already exists — updating odds + model data (pre-lock)`);
    await setDoc(ref, {
      prediction: betData.prediction,
      bet: betData.bet,
      pinnacle: betData.pinnacle,
      lastUpdatedAt: Date.now(),
    }, { merge: true });
    return { betId, action: 'updated' };
  }

  await setDoc(ref, betData);
  return { betId, action: 'created' };
}

// ─── Step 5: Write Evaluation to Firebase ───────────────────────────

async function writeEvalToFirebase(game, date) {
  const awayNorm = game.awayTeam.toUpperCase();
  const homeNorm = game.homeTeam.toUpperCase();
  const evalId = `${date}_MLB_${awayNorm}_${homeNorm}`;

  const p = game.prediction || {};

  const evalData = {
    id: evalId,
    date,
    timestamp: Date.now(),
    sport: 'MLB',
    type: 'EVALUATION',
    game: {
      awayTeam: game.awayTeamFull,
      homeTeam: game.homeTeamFull,
      awayCode: game.awayTeam,
      homeCode: game.homeTeam,
      commenceTime: game.commenceTime || null,
      awayPitcher: p.awayPitcher || game.dratings?.awayPitcher || null,
      homePitcher: p.homePitcher || game.dratings?.homePitcher || null,
    },
    modelData: {
      dratingsAwayProb: p.dratingsAwayProb ?? null,
      dratingsHomeProb: p.dratingsHomeProb ?? null,
      dimersAwayProb: p.dimersAwayProb ?? null,
      dimersHomeProb: p.dimersHomeProb ?? null,
      ensembleAwayProb: p.ensembleAwayProb ?? null,
      ensembleHomeProb: p.ensembleHomeProb ?? null,
      dratingsAwayRuns: p.dratingsAwayRuns ?? null,
      dratingsHomeRuns: p.dratingsHomeRuns ?? null,
      modelsAgree: p.modelsAgree ?? null,
      confidence: p.confidence ?? null,
    },
    odds: game.odds ? {
      awayOdds: game.odds.awayOdds,
      homeOdds: game.odds.homeOdds,
      awayBook: game.odds.awayBook,
      homeBook: game.odds.homeBook,
      pinnacleAway: game.odds.pinnacleAway,
      pinnacleHome: game.odds.pinnacleHome,
      totalLine: game.odds.totalLine,
    } : null,
    edge: {
      bestEV: p.bestEV != null ? Math.round(p.bestEV * 100) / 100 : null,
      grade: p.grade || null,
      pinnacleEdge: p.pinnacleEdge != null ? Math.round(p.pinnacleEdge * 100) / 100 : null,
    },
    units: game.units || 0,
    action: game.action || 'EVALUATE',
  };

  const ref = doc(db, 'mlb_bets', evalId);
  const existing = await getDoc(ref);
  if (existing.exists() && existing.data()?.isLocked) {
    return;
  }
  await setDoc(ref, evalData, { merge: true });
}

// ─── Main Pipeline ──────────────────────────────────────────────────

async function main() {
  console.log('⚾ MLB MODEL PICKS V1');
  console.log('════════════════════════════════════════════\n');

  const date = todayET();
  console.log(`   📅 Date: ${date}\n`);

  const cacheBuster = Date.now();

  // ════════════════════════════════════════════════════════════════════
  // STEP 1: FETCH DATA
  // ════════════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ STEP 1: FETCHING DATA                       │');
  console.log('└─────────────────────────────────────────────┘\n');

  // 1a. DRatings MLB
  console.log('🎯 Fetching DRatings MLB predictions...');
  let dratingsMarkdown = '';
  try {
    const drResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.dratings.com/predictor/mlb-baseball-predictions/?_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 2000, timeout: 300000 },
      );
    });
    dratingsMarkdown = drResult.markdown || '';
    await fs.writeFile(join(__dirname, '../public/mlb_dratings.md'), dratingsMarkdown, 'utf8');
    console.log(`   ✅ DRatings saved (${dratingsMarkdown.length} chars)\n`);
  } catch (err) {
    console.log(`   ⚠️  DRatings scrape failed: ${err.message}\n`);
  }

  // 1b. Dimers MLB
  console.log('🎯 Fetching Dimers MLB predictions...');
  let dimersMarkdown = '';
  try {
    const dimResult = await retryWithBackoff(async () => {
      return await firecrawl.scrape(
        `https://www.dimers.com/bet-hub/mlb/schedule?_=${cacheBuster}`,
        { formats: ['markdown'], onlyMainContent: true, waitFor: 3000, timeout: 300000 },
      );
    });
    dimersMarkdown = dimResult.markdown || '';
    await fs.writeFile(join(__dirname, '../public/mlb_dimers.md'), dimersMarkdown, 'utf8');
    console.log(`   ✅ Dimers saved (${dimersMarkdown.length} chars)\n`);
  } catch (err) {
    console.log(`   ⚠️  Dimers scrape failed: ${err.message}\n`);
  }

  // 1c. Odds API (Pinnacle + retail)
  console.log('📊 Fetching MLB odds (Pinnacle + retail)...');
  const oddsGames = await fetchMLBOdds();
  console.log(`   ✅ Odds: ${oddsGames.length} games\n`);

  // ════════════════════════════════════════════════════════════════════
  // STEP 2: PARSE AND MATCH
  // ════════════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ STEP 2: PARSING AND MATCHING                │');
  console.log('└─────────────────────────────────────────────┘\n');

  const dratingsGames = parseMLBDRatings(dratingsMarkdown);
  const dimersGames = parseMLBDimers(dimersMarkdown);

  console.log(`   📊 DRatings games: ${dratingsGames.length}`);
  console.log(`   📊 Dimers games:   ${dimersGames.length}`);
  console.log(`   📊 Odds games:     ${oddsGames.length}`);

  const matchedGames = matchGames(dratingsGames, dimersGames, oddsGames);
  console.log(`   ✅ Matched games:  ${matchedGames.length}\n`);

  if (matchedGames.length === 0) {
    console.log('   ⚠️  No matched games — exiting.\n');
    await writeEmptyJSON(date);
    process.exit(0);
  }

  // ════════════════════════════════════════════════════════════════════
  // STEP 3: EVALUATE AND PICK
  // ════════════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ STEP 3: EVALUATING GAMES                    │');
  console.log('└─────────────────────────────────────────────┘\n');

  const { picks, evaluations } = evaluateGames(matchedGames);

  console.log(`   📋 Total evaluations: ${evaluations.length}`);
  console.log(`   ⚾ Picks found:       ${picks.length}\n`);

  for (const p of picks) {
    const pred = p.prediction;
    const side = pred.bestSide;
    const team = side === 'away' ? p.awayTeamFull : p.homeTeamFull;
    console.log(`   ✅ ${team} ML (${pred.bestOdds > 0 ? '+' : ''}${pred.bestOdds}) @ ${pred.bestBook || 'Best'} — ${pred.grade} grade, ${pred.bestEV.toFixed(1)}% EV, ${p.units}u${pred.modelsAgree ? ' [MODELS AGREE]' : ''}`);
  }
  console.log();

  // ════════════════════════════════════════════════════════════════════
  // STEP 4: WRITE TO FIREBASE
  // ════════════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ STEP 4: WRITING TO FIREBASE                 │');
  console.log('└─────────────────────────────────────────────┘\n');

  let created = 0;
  let updated = 0;

  for (const pick of picks) {
    try {
      const result = await writePickToFirebase(pick, date);
      if (result.action === 'created') created++;
      else updated++;
      console.log(`   ✅ ${result.betId} — ${result.action}`);
    } catch (err) {
      console.log(`   ❌ Failed to write pick: ${err.message}`);
    }
  }

  // Write all evaluations (including non-picks) for analysis
  let evalsSaved = 0;
  for (const ev of evaluations) {
    try {
      await writeEvalToFirebase(ev, date);
      evalsSaved++;
    } catch (err) { /* non-critical */ }
  }

  console.log(`\n   📊 Picks: ${created} created, ${updated} updated`);
  console.log(`   📊 Evaluations: ${evalsSaved} saved\n`);

  // ════════════════════════════════════════════════════════════════════
  // STEP 5: WRITE JSON EXPORT
  // ════════════════════════════════════════════════════════════════════
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ STEP 5: WRITING JSON EXPORT                 │');
  console.log('└─────────────────────────────────────────────┘\n');

  const jsonExport = {
    date,
    lastUpdated: new Date().toISOString(),
    source: 'MLB_MODEL_V1',
    gamesEvaluated: evaluations.length,
    picksCount: picks.length,
    picks: picks.map(p => ({
      awayTeam: p.awayTeamFull,
      homeTeam: p.homeTeamFull,
      awayCode: p.awayTeam,
      homeCode: p.homeTeam,
      commenceTime: p.commenceTime,
      pick: p.prediction.bestSide === 'away' ? p.awayTeamFull : p.homeTeamFull,
      pickCode: p.prediction.bestSide === 'away' ? p.awayTeam : p.homeTeam,
      side: p.prediction.bestSide,
      odds: p.prediction.bestOdds,
      book: p.prediction.bestBook,
      units: p.units,
      ev: Math.round(p.prediction.bestEV * 100) / 100,
      grade: p.prediction.grade,
      modelsAgree: p.prediction.modelsAgree,
      confidence: p.prediction.confidence,
      ensembleAwayProb: p.prediction.ensembleAwayProb,
      ensembleHomeProb: p.prediction.ensembleHomeProb,
      awayPitcher: p.prediction.awayPitcher,
      homePitcher: p.prediction.homePitcher,
      predictedTotal: p.prediction.predictedTotal,
    })),
    evaluations: evaluations.map(e => ({
      awayTeam: e.awayTeamFull,
      homeTeam: e.homeTeamFull,
      awayCode: e.awayTeam,
      homeCode: e.homeTeam,
      action: e.action,
      units: e.units,
      ev: e.prediction?.bestEV != null ? Math.round(e.prediction.bestEV * 100) / 100 : null,
      grade: e.prediction?.grade || null,
      modelsAgree: e.prediction?.modelsAgree ?? null,
      ensembleAwayProb: e.prediction?.ensembleAwayProb ?? null,
      ensembleHomeProb: e.prediction?.ensembleHomeProb ?? null,
    })),
  };

  await fs.writeFile(
    join(__dirname, '../public/mlb_model_picks.json'),
    JSON.stringify(jsonExport, null, 2),
    'utf8',
  );
  console.log(`   ✅ public/mlb_model_picks.json written\n`);

  // ════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════
  console.log('════════════════════════════════════════════');
  console.log('⚾ MLB MODEL PICKS V1 — COMPLETE');
  console.log('════════════════════════════════════════════');
  console.log(`\n   Date:             ${date}`);
  console.log(`   Games evaluated:  ${evaluations.length}`);
  console.log(`   Picks locked:     ${picks.length}`);
  console.log(`   Firebase writes:  ${created} new, ${updated} updated`);
  console.log(`   Evaluations:      ${evalsSaved}`);
  console.log('\n   Files updated:');
  console.log('   ✓ public/mlb_dratings.md');
  console.log('   ✓ public/mlb_dimers.md');
  console.log('   ✓ public/mlb_model_picks.json\n');
}

async function writeEmptyJSON(date) {
  const empty = {
    date,
    lastUpdated: new Date().toISOString(),
    source: 'MLB_MODEL_V1',
    gamesEvaluated: 0,
    picksCount: 0,
    picks: [],
    evaluations: [],
  };
  await fs.writeFile(
    join(__dirname, '../public/mlb_model_picks.json'),
    JSON.stringify(empty, null, 2),
    'utf8',
  );
}

main().catch(err => {
  console.error('\n❌ FATAL ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
