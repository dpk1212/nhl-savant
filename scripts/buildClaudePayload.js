/**
 * Build Claude API payload from NHL game + edge + Firebase bet data.
 * Demonstrates what we can send to Claude for veto/sizing decisions.
 *
 * Usage:
 *   node scripts/buildClaudePayload.js                    # sample from Firebase
 *   node scripts/buildClaudePayload.js SEA STL            # specific matchup
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}
const db = admin.firestore();

// Load goalies CSV for GSAE lookup
function loadGoaliesGSAE() {
  try {
    const csv = readFileSync(join(__dirname, '../public/goalies.csv'), 'utf-8');
    const lines = csv.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',');
    const nameIdx = headers.indexOf('name');
    const teamIdx = headers.indexOf('team');
    const xGoalsIdx = headers.indexOf('xgoals');
    const goalsIdx = headers.indexOf('goals');
    const situationIdx = headers.indexOf('situation');

    const map = new Map(); // name -> { gsae, team }
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      const situation = row[situationIdx];
      if (situation !== 'all') continue;
      const name = row[nameIdx]?.trim();
      const team = row[teamIdx]?.trim();
      const xG = parseFloat(row[xGoalsIdx]) || 0;
      const g = parseFloat(row[goalsIdx]) || 0;
      const gsae = xG - g;
      if (name) {
        const key = name.toLowerCase().replace(/\s+/g, ' ');
        if (!map.has(key) || Math.abs(gsae) > Math.abs((map.get(key).gsae || 0))) {
          map.set(key, { gsae, team });
        }
      }
    }
    return map;
  } catch (e) {
    return new Map();
  }
}

// Fuzzy match goalie name to CSV
function lookupGSAE(goaliesMap, name) {
  if (!name || name === 'Unknown') return null;
  const key = name.toLowerCase().replace(/\s+/g, ' ');
  for (const [k, v] of goaliesMap) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return null;
}

// Load starting goalies for a matchup
function loadStartingGoalies(matchup) {
  try {
    const data = JSON.parse(readFileSync(join(__dirname, '../public/starting_goalies.json'), 'utf-8'));
    const game = data.games?.find(g => g.matchup === matchup);
    return game ? { away: game.away, home: game.home } : null;
  } catch (e) {
    return null;
  }
}

/**
 * Build Claude payload from a Firebase bet document
 */
export function buildPayloadFromBet(betDoc, goaliesMap = null) {
  const d = betDoc.data ? betDoc.data() : betDoc;
  const gMap = goaliesMap || loadGoaliesGSAE();
  const matchup = `${d.game?.awayTeam || '?'} @ ${d.game?.homeTeam || '?'}`;
  const goalies = loadStartingGoalies(matchup);

  const awayGoalie = goalies?.away || d.goalies?.away;
  const homeGoalie = goalies?.home || d.goalies?.home;
  const awayGSAE = awayGoalie?.goalie ? lookupGSAE(gMap, awayGoalie.goalie) : null;
  const homeGSAE = homeGoalie?.goalie ? lookupGSAE(gMap, homeGoalie.goalie) : null;

  return {
    game: {
      matchup,
      gameTime: d.game?.gameTime || null,
      market: d.bet?.market || 'MONEYLINE',
      pick: d.bet?.pick || d.bet?.team,
      odds: d.bet?.odds ?? 0,
      side: d.bet?.side || (d.bet?.team === d.game?.awayTeam ? 'AWAY' : 'HOME')
    },
    model: {
      modelProb: d.prediction?.modelProb ?? 0,
      marketProb: d.prediction?.marketProb ?? 0,
      evPercent: d.prediction?.evPercent ?? 0,
      grade: d.prediction?.qualityGrade || d.prediction?.rating,
      rating: d.prediction?.rating,
      dynamicUnits: d.prediction?.dynamicUnits ?? 1,
      whyBestValue: d.prediction?.whyBestValue || null
    },
    goalies: {
      away: {
        name: awayGoalie?.goalie || 'Unknown',
        confirmed: awayGoalie?.confirmed ?? false,
        gsae: awayGSAE?.gsae ?? null
      },
      home: {
        name: homeGoalie?.goalie || 'Unknown',
        confirmed: homeGoalie?.confirmed ?? false,
        gsae: homeGSAE?.gsae ?? null
      }
    },
    schedule: {
      note: 'Rest/B2B from scheduleHelper — not in Firebase. Add in live workflow.'
    },
    result: d.result?.outcome ? {
      outcome: d.result.outcome,
      profit: d.result.profit
    } : null
  };
}

async function main() {
  const args = process.argv.slice(2);
  const gMap = loadGoaliesGSAE();
  console.log(`Loaded ${gMap.size} goalie GSAE entries\n`);

  if (args.length >= 2) {
    const [away, home] = args;
    const betId = `${away}_${home}_MONEYLINE_${away}`;
    const doc = await db.collection('bets').doc(betId).get();
    if (!doc.exists) {
      console.log(`No bet found for ${betId}. Trying alternate ID formats...`);
      const snap = await db.collection('bets')
        .where('game.awayTeam', '==', away)
        .where('game.homeTeam', '==', home)
        .limit(1)
        .get();
      if (snap.empty) {
        console.log('No matching bet in Firebase.');
        process.exit(1);
      }
      const payload = buildPayloadFromBet(snap.docs[0], gMap);
      console.log(JSON.stringify(payload, null, 2));
      process.exit(0);
    }
    const payload = buildPayloadFromBet(doc, gMap);
    console.log(JSON.stringify(payload, null, 2));
    process.exit(0);
  }

  // Sample: get most recent PENDING or COMPLETED NHL bet
  const snap = await db.collection('bets')
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();

  if (snap.empty) {
    console.log('No bets in Firebase.');
    process.exit(1);
  }

  console.log('Sample payloads from recent Firebase bets:\n');
  for (const doc of snap.docs) {
    const payload = buildPayloadFromBet(doc, gMap);
    console.log('---', doc.id, '---');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
