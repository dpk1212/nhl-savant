import admin from 'firebase-admin';
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

async function main() {
  const awayTeam = 'SEA';
  const homeTeam = 'STL';
  const betId = `${awayTeam}_${homeTeam}_MONEYLINE_${awayTeam}`;
  const date = '2026-02-26';

  // Game result: SEA 1 - STL 5
  const awayScore = 1;
  const homeScore = 5;
  const winner = 'HOME'; // STL won
  const outcome = 'LOSS'; // We bet SEA (away), they lost

  const odds = 122;
  const units = 1.25;
  const profit = -units; // LOSS

  const betData = {
    id: betId,
    date: date,
    timestamp: new Date('2026-02-26T18:00:00-05:00').getTime(),

    game: {
      awayTeam: awayTeam,
      homeTeam: homeTeam,
      gameTime: '7:00 PM',
    },

    bet: {
      market: 'MONEYLINE',
      pick: `${awayTeam} ML`,
      line: null,
      odds: odds,
      team: awayTeam,
      side: 'AWAY'
    },

    prediction: {
      awayWinProb: 0.483,
      homeWinProb: 0.517,
      modelProb: 0.483,
      marketProb: 0.450,
      evPercent: 7.2,
      agreement: 2.7,
      confidence: 'HIGH',
      qualityGrade: 'A+',
      unitSize: units,
      dynamicUnits: units,
      recommendedUnit: units,
      bestTeam: awayTeam,
      bestBet: 'away',
      bestOdds: odds,
      bestEV: 7.2,
      grade: 'A+',
      rating: 'A+',
      whyBestValue: 'Special Teams: SEA has 53% edge'
    },

    result: {
      awayScore: awayScore,
      homeScore: homeScore,
      totalScore: awayScore + homeScore,
      winner: winner,
      outcome: outcome,
      profit: profit,
      units: units,
      unitsRisked: units,
      fetched: true,
      fetchedAt: Date.now(),
      source: 'MANUAL_BACKFILL'
    },

    status: 'COMPLETED',
    gradedAt: Date.now(),
    createdAt: new Date('2026-02-26T18:00:00-05:00').getTime(),
    lastUpdatedAt: Date.now()
  };

  console.log(`Writing NHL bet: ${betId}`);
  console.log(`  ${awayTeam} @ ${homeTeam} | ML ${awayTeam} +${odds} | ${units}u`);
  console.log(`  Score: ${awayTeam} ${awayScore} - ${homeScore} ${homeTeam}`);
  console.log(`  Result: ${outcome} | ${profit.toFixed(2)}u`);

  await db.collection('bets').doc(betId).set(betData);

  console.log(`\n✅ Bet written to Firebase (bets/${betId})`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
