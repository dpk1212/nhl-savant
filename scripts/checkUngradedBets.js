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

const snap = await db.collection('basketball_bets')
  .where('status', '==', 'PENDING')
  .get();

const today = '2026-03-02';
const byDate = {};

for (const doc of snap.docs) {
  const d = doc.data();
  const date = d.date || 'unknown';
  if (date >= today) continue;
  if (!byDate[date]) byDate[date] = [];
  const game = `${d.game?.awayTeam} @ ${d.game?.homeTeam}`;
  const market = d.bet?.market || '?';
  const pick = market === 'TOTAL' ? `${d.bet?.pick} ${d.bet?.total}` : `${d.bet?.team} ${d.bet?.spread}`;
  const units = d.bet?.units || d.prediction?.unitSize || '?';
  byDate[date].push({ id: doc.id, game, market, pick, units, status: d.betStatus });
}

const dates = Object.keys(byDate).sort();
if (dates.length === 0) {
  console.log('No ungraded past bets found.');
} else {
  let total = 0;
  for (const date of dates) {
    const bets = byDate[date];
    total += bets.length;
    console.log(`\n📅 ${date} — ${bets.length} ungraded`);
    for (const b of bets) {
      console.log(`  ${b.market.padEnd(6)} ${b.pick.padEnd(30)} ${b.units}u  [${b.status}]  ${b.game}`);
    }
  }
  console.log(`\n🔴 Total ungraded past bets: ${total}`);
}

process.exit(0);
