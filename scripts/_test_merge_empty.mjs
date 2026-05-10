import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
const db = admin.firestore();

const ref = db.collection('_test_').doc('merge_empty_test');
await ref.set({ sides: { away: { foo: 'bar', n: 1 } }, status: 'PENDING' });
let snap = await ref.get();
console.log('STEP 1 set sides={away:...}:    sides=', JSON.stringify(snap.data().sides));

await ref.set({ sides: {}, lastSyncAt: Date.now() }, { merge: true });
snap = await ref.get();
console.log('STEP 2 merge {sides:{}}:        sides=', JSON.stringify(snap.data().sides));

await ref.set({ sides: { home: { foo: 'baz' } }, lastSyncAt: Date.now() }, { merge: true });
snap = await ref.get();
console.log('STEP 3 merge {sides:{home:...}}: sides=', JSON.stringify(snap.data().sides));

await ref.delete();
process.exit(0);
