import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
}
const db = admin.firestore();

const docId = '2026-05-09_NBA_okc_lal_spread';
const ref = db.collection('sharpFlowSpreads').doc(docId);
const before = await ref.get();
console.log('BEFORE delete: exists=' + before.exists + ' sides=' + JSON.stringify(Object.keys(before.data()?.sides || {})));
await ref.delete();
const after = await ref.get();
console.log('AFTER delete:  exists=' + after.exists);
process.exit(0);
