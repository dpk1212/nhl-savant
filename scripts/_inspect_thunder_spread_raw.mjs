import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
}
const db = admin.firestore();

const docId = '2026-05-09_NBA_okc_lal_spread';
const snap = await db.collection('sharpFlowSpreads').doc(docId).get();
if (!snap.exists) { console.log('NOT FOUND'); process.exit(1); }
const d = snap.data();
console.log('=== FULL DOC ===');
console.log(JSON.stringify(d, null, 2));
console.log('\n=== createTime / updateTime ===');
console.log('createTime:', snap.createTime?.toDate());
console.log('updateTime:', snap.updateTime?.toDate());
process.exit(0);
