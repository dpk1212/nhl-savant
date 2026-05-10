import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
}
const db = admin.firestore();

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
console.log(`Scanning today=${today} for ghost docs (sides:{} or all-superseded)...\n`);

for (const col of ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals']) {
  const snap = await db.collection(col).where('date', '==', today).get();
  console.log(`${col}: ${snap.size} docs`);
  for (const d of snap.docs) {
    const data = d.data();
    const sides = Object.entries(data.sides || {});
    const live = sides.filter(([, sd]) => sd && !sd.superseded);
    const isGhost = data.status !== 'COMPLETED' && live.length === 0;
    if (isGhost) {
      const ago = Math.round((Date.now() - (data.lastWriteAt || data.createdAt || 0)) / 60000);
      console.log(`  ⚠ GHOST ${d.id} status=${data.status} sides=${sides.length} live=${live.length} lastAction=${data.lastAction} lastWriteAt=${ago}m ago source=${data.source}`);
    }
  }
}
process.exit(0);
