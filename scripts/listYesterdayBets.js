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
  const today = '2026-02-27';
  
  const snapshot = await db.collection('basketball_bets')
    .where('date', '==', today)
    .get();

  console.log(`All bets for ${today}: ${snapshot.size}\n`);

  // Official plays: has a market, units > 0, not KILLED/FLAGGED
  let official = 0;
  let pending = 0;
  let completed = 0;

  for (const d of snapshot.docs) {
    const b = d.data();
    const units = b.bet?.units || 0;
    const killed = b.betStatus === 'KILLED' || b.betStatus === 'FLAGGED';
    const isEval = b.type === 'EVALUATION';
    if (isEval || killed || units === 0) continue;

    official++;
    const market = b.bet?.market || 'ML';
    const pick = b.bet?.pick || b.bet?.team;
    const line = market === 'TOTAL' ? b.bet?.total : b.bet?.spread;
    const isTotals = b.betRecommendation?.type === 'TOTAL' || b.isTotalsPick || b.bet?.market === 'TOTAL';
    const isATS = b.betRecommendation?.type === 'ATS' || b.isATSPick || b.bet?.market === 'SPREAD';

    if (b.status === 'COMPLETED') {
      completed++;
      const emoji = b.result?.outcome === 'WIN' ? '✅' : b.result?.outcome === 'PUSH' ? '🔄' : '❌';
      console.log(`${emoji} ${d.id}`);
      console.log(`   ${b.game?.awayTeam} @ ${b.game?.homeTeam} | ${market} ${pick} ${line || ''} | ${units}u`);
      console.log(`   Result: ${b.result?.outcome} ${b.result?.profit > 0 ? '+' : ''}${b.result?.profit?.toFixed(2)}u`);
    } else {
      pending++;
      console.log(`⏳ ${d.id}`);
      console.log(`   ${b.game?.awayTeam} @ ${b.game?.homeTeam} | ${market} ${pick} ${line || ''} | ${units}u | betStatus: ${b.betStatus || 'none'}`);
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log(`Official plays: ${official} | Completed: ${completed} | Pending: ${pending}`);

  // Also check for any PENDING bets from older dates
  const allPending = await db.collection('basketball_bets')
    .where('status', '==', 'PENDING')
    .get();
  
  const otherDates = {};
  allPending.docs.forEach(d => {
    const date = d.data().date;
    if (date !== today) {
      const units = d.data().bet?.units || 0;
      const killed = d.data().betStatus === 'KILLED' || d.data().betStatus === 'FLAGGED';
      if (units > 0 && !killed) {
        otherDates[date] = (otherDates[date] || 0) + 1;
      }
    }
  });
  
  if (Object.keys(otherDates).length > 0) {
    console.log(`\n⚠️  Ungraded official plays from other dates:`);
    for (const [date, count] of Object.entries(otherDates)) {
      console.log(`   ${date}: ${count} pending`);
    }
  }

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
