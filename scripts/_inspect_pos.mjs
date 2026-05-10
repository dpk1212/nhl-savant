import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
const REPO = '/Users/dalekolnitys/NHL Savant/nhl-savant';
if (!admin.apps.length) {
  const sak = join(REPO, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();
// Pick one doc to look at the shape
const snap = await db.collection('sharp_action_positions').limit(2).get();
for (const d of snap.docs) {
  const data = d.data();
  console.log('Doc:', d.id);
  console.log('Keys:', Object.keys(data).sort().join(', '));
  console.log(JSON.stringify(data, null, 2));
  console.log('---');
}
process.exit(0);
