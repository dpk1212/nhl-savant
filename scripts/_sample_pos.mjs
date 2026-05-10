import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sak = join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
const db = admin.firestore();

console.log('=== Existing LOCKED Arizona ML doc ===');
const ariSnap = await db.collection('sharpFlowPicks').doc('2026-05-02_MLB_ari_chc').get();
if (ariSnap.exists) {
  console.log(JSON.stringify(ariSnap.data(), null, 2));
} else {
  console.log('NOT FOUND');
}

console.log('\n=== A spread position (today) ===');
const spSnap = await db.collection('sharp_action_positions').where('date','==','2026-05-02').where('marketType','==','spread').limit(2).get();
console.log('count:', spSnap.size);
spSnap.forEach(d => console.log(d.id, '\n', JSON.stringify(d.data(), null, 2)));

console.log('\n=== A total position (today) ===');
const tSnap = await db.collection('sharp_action_positions').where('date','==','2026-05-02').where('marketType','==','total').limit(2).get();
console.log('count:', tSnap.size);
tSnap.forEach(d => console.log(d.id, '\n', JSON.stringify(d.data(), null, 2)));

process.exit(0);
