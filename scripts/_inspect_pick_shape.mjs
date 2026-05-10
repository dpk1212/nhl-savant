// Inspect the full doc shape of an existing Firestore pick so we know
// exactly what fields createMissingLocks needs to write.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
if (!admin.apps.length) {
  const sak = join(__dirname, '..', 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const snap = await db.collection('sharpFlowSpreads').where('date', '==', TODAY).get();
for (const doc of snap.docs) {
  const d = doc.data();
  if (!`${d.away} ${d.home}`.toLowerCase().includes('laker')) continue;
  console.log(`=== docId: ${doc.id} ===`);
  console.log(`Top-level keys:`, Object.keys(d).sort());
  for (const [side, sd] of Object.entries(d.sides || {})) {
    if (sd.team !== 'Lakers') continue;
    console.log(`\n--- side: ${side} (${sd.team}) ---`);
    const top = {};
    for (const k of Object.keys(sd)) {
      if (['lock', 'peak', 'pregame', 'health', 'result'].includes(k)) continue;
      top[k] = sd[k];
    }
    console.log(`Top-level side fields:`, top);
    console.log(`\nlock keys:`, Object.keys(sd.lock || {}).sort());
    console.log(`peak keys:`, Object.keys(sd.peak || {}).sort());
    console.log(`health:`, sd.health);
    if (sd.peak?.v8Scoring) {
      console.log(`\npeak.v8Scoring keys:`, Object.keys(sd.peak.v8Scoring).sort());
      console.log(`peak.v8Scoring.walletDetails[0]:`, sd.peak.v8Scoring.walletDetails?.[0]);
      console.log(`peak.v8Scoring.walletDetails count:`, sd.peak.v8Scoring.walletDetails?.length);
    }
  }
  break;
}
process.exit(0);
