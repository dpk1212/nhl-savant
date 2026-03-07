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

const betId = '2026-02-26_MERCYHURST_CENTRAL_CONNECTICUT_STATE_TOTAL_UNDER';
const awayScore = 78;  // Mercyhurst
const homeScore = 80;  // Central Connecticut State
const totalScore = awayScore + homeScore; // 158

async function main() {
  const betRef = db.collection('basketball_bets').doc(betId);
  const betDoc = await betRef.get();
  const bet = betDoc.data();

  const direction = bet.bet?.pick;  // UNDER
  const line = bet.bet?.total;      // 140
  const units = bet.bet?.units;     // 1

  const outcome = direction === 'UNDER'
    ? (totalScore < line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS')
    : (totalScore > line ? 'WIN' : totalScore === line ? 'PUSH' : 'LOSS');

  const odds = -110;
  let profit;
  if (outcome === 'WIN') profit = units * (100 / 110);
  else if (outcome === 'PUSH') profit = 0;
  else profit = -units;

  console.log(`${bet.game.awayTeam} @ ${bet.game.homeTeam}`);
  console.log(`Score: ${awayScore}-${homeScore} (Total: ${totalScore})`);
  console.log(`${direction} ${line} → actual ${totalScore} → ${outcome}`);
  console.log(`${outcome === 'WIN' ? '✅' : '❌'} ${profit > 0 ? '+' : ''}${profit.toFixed(2)}u`);

  await betRef.update({
    'result.awayScore': awayScore,
    'result.homeScore': homeScore,
    'result.totalScore': totalScore,
    'result.winner': awayScore > homeScore ? 'AWAY' : 'HOME',
    'result.winnerTeam': 'Central Connecticut State',
    'result.outcome': outcome,
    'result.profit': profit,
    'result.units': units,
    'result.fetched': true,
    'result.fetchedAt': Date.now(),
    'result.source': 'NCAA_BACKFILL',
    'status': 'COMPLETED',
    'gradedAt': Date.now()
  });

  console.log('Done.');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
