/**
 * Rebuild t5SeasonLedger from graded positions. exportWalletProfiles does
 * the same write on the grade cron. This is the one-shot for a rule that
 * has to read the book before the next grade.
 *
 *   node scripts/buildT5SeasonLedger.mjs
 */
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  T5_LEDGER_COLLECTION,
  buildT5SeasonLedger,
  t5LedgerDocs,
} from '../src/lib/t5LeadPolicy.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyCandidates = [
  join(__dirname, '..', 'serviceAccountKey.json'),
  join(__dirname, '..', '..', 'nhl-savant', 'serviceAccountKey.json'),
];
const keyPath = keyCandidates.find((p) => existsSync(p));
if (!keyPath) {
  console.error('serviceAccountKey.json not found');
  process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(keyPath, 'utf8'))) });
}
const db = admin.firestore();

const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').select(
  'wallet', 'walletShort', 'date', 'sport', 'invested', 'size', 'settledPnl', 'positionPnl', 'avgPrice',
).get();
const positions = snap.docs.map((d) => d.data());
console.log(`graded positions ${positions.length}`);
const built = buildT5SeasonLedger(positions);
const docs = t5LedgerDocs(built);
for (const doc of docs) {
  console.log(`${doc.id} start ${doc.seasonStart} wallets ${doc.walletCount} bets ${doc.betCount} bytes ${doc.betsJson.length}`);
  await db.collection(T5_LEDGER_COLLECTION).doc(doc.id).set({
    ...doc,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
console.log(`wrote ${docs.length} docs`);
