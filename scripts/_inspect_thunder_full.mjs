import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
}
const db = admin.firestore();

const snap = await db.collection('sharpFlowSpreads').doc('2026-05-09_NBA_okc_lal_spread').get();
const sd = snap.data().sides.away;
console.log('Top-level keys on side:', Object.keys(sd).sort());
console.log('\nv8_* stamps:');
for (const k of Object.keys(sd).filter(k => k.startsWith('v8_'))) {
  console.log(`  ${k}:`, JSON.stringify(sd[k]));
}
console.log('\nlock.odds / peak.odds / closingOdds:', sd.lock?.odds, '/', sd.peak?.odds, '/', sd.closingOdds);
console.log('\nfinalUnits:', sd.finalUnits);
console.log('\nhealth:', JSON.stringify(sd.health));
process.exit(0);
