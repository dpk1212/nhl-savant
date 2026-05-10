import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
if (existsSync(sakPath)) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
} else {
  initializeApp({
    credential: cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const snap = await db.collection('sharp_action_positions')
  .where('date', '==', '2026-05-02')
  .where('gameKey', '==', 'phi_bos')
  .where('marketType', '==', 'TOTAL')
  .limit(2)
  .get();

snap.forEach(d => {
  const data = d.data();
  console.log(`\n=== ${d.id} ===`);
  console.log(JSON.stringify(data, null, 2));
});
process.exit(0);
