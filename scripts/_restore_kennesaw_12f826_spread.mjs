/**
 * Restore the missing 2026-10-22 Kennesaw State +10.5 for ··12f826.
 *
 * Scan had two home spreads ( +10.5 $27.2K and +8.5 $8.2K ). Firestore
 * ids ignored the line, so the +8.5 write ate the +10.5. Liberty 34–6
 * Kennesaw — both numbers are losses. Write the missing GRADED row
 * under the asset/line-suffixed id; do not touch the +8.5 doc.
 *
 * Usage: node scripts/_restore_kennesaw_12f826_spread.mjs [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { positionDocId } from './lib/positionIdentity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const WALLET = '0xe18ecc345e00ee7c4f2d1f676f3dd2acb112f826';
const POS = {
  date: '2026-10-22',
  sport: 'CFB',
  gameKey: 'lib_kenn',
  wallet: WALLET,
  walletShort: '12f826',
  away: 'Liberty',
  home: 'Kennesaw State',
  marketType: 'SPREAD',
  side: 'home',
  teamName: 'Kennesaw State',
  entryLine: 10.5,
  spreadLine: 10.5,
  invested: 27200,
  size: 49455,
  avgPrice: 0.55,
  avgSportBet: 10880,
  betMultiplier: 2.5,
  status: 'GRADED',
  result: 'LOSS',
  settledPnl: -27200,
  settledPrice: 0,
  score: { away: 34, home: 6 },
};

function initFirebase() {
  if (admin.apps.length) return admin.firestore();
  const sakPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(sakPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(fs.readFileSync(sakPath, 'utf8'))),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

const docId = positionDocId(POS);
console.log(`target sharp_action_positions/${docId}`);

if (DRY) {
  console.log('DRY — would GRADE Kennesaw +10.5 $27.2K LOSS for 12f826');
  process.exit(0);
}

const db = initFirebase();
const ref = db.collection('sharp_action_positions').doc(docId);
const snap = await ref.get();
if (snap.exists && snap.data()?.status === 'GRADED' && snap.data()?.result === 'LOSS'
  && Number(snap.data()?.entryLine) === 10.5) {
  console.log('already GRADED +10.5 LOSS — skip');
  process.exit(0);
}

await ref.set({
  ...POS,
  gradedAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  restoredBy: 'kennesaw-alt-line-split',
}, { merge: true });

const after = (await ref.get()).data();
console.log('WROTE', {
  id: docId,
  line: after.entryLine,
  invested: after.invested,
  result: after.result,
  settledPnl: after.settledPnl,
});
process.exit(0);
