/**
 * Delete all basketball totals bets for today from Firebase.
 * Usage: node scripts/deleteTodaysTotalsBets.js
 */

import admin from 'firebase-admin';
import { FieldPath } from 'firebase-admin/firestore';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}
const db = admin.firestore();

const today = new Date().toISOString().split('T')[0];

async function main() {
  // Query by document ID prefix (date is first part of ID)
  const snap = await db.collection('basketball_bets')
    .where(FieldPath.documentId(), '>=', today)
    .where(FieldPath.documentId(), '<=', today + '\uf8ff')
    .get();

  const totals = snap.docs.filter(d => d.id.includes('_TOTAL_'));
  console.log(`Found ${totals.length} totals bets for ${today}`);

  for (const doc of totals) {
    console.log(`  Deleting ${doc.id}`);
    await db.collection('basketball_bets').doc(doc.id).delete();
  }

  console.log(`\n✅ Deleted ${totals.length} totals bets.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
