/**
 * Un-grade UTC date-split clones of Source B tickets.
 *
 * Same Polymarket asset on two+ calendar dates is one ticket, not two.
 * Keep the earliest GRADED doc. Later GRADED copies → EXITED /
 * date_calendar_retag so Their Action / export stop double-counting.
 *
 * Usage: node scripts/ungradeDateSplitClones.js
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLLECTION = 'sharp_action_positions';

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '../serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

async function main() {
  const db = initFirebase();
  console.log('\n=== ungradeDateSplitClones ===\n');
  const snap = await db.collection(COLLECTION).where('status', '==', 'GRADED').get();
  const byAsset = new Map();
  for (const doc of snap.docs) {
    const p = doc.data() || {};
    const wallet = String(p.wallet || '').toLowerCase();
    const asset = p.asset != null && p.asset !== '' ? String(p.asset) : null;
    if (!wallet || !asset || !p.date) continue;
    const k = `${wallet}|${asset}`;
    if (!byAsset.has(k)) byAsset.set(k, []);
    byAsset.get(k).push({
      ref: doc.ref,
      id: doc.id,
      date: String(p.date),
      invested: Math.round(Number(p.invested ?? p.size ?? 0) || 0),
      pnl: Number.isFinite(Number(p.settledPnl)) ? Math.round(Number(p.settledPnl)) : null,
      result: p.result || null,
    });
  }

  const drops = [];
  for (const rows of byAsset.values()) {
    const dates = new Set(rows.map((r) => r.date));
    if (dates.size < 2) continue;
    rows.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    const keep = rows[0];
    for (const row of rows.slice(1)) {
      drops.push({ ...row, keepId: keep.id, keepDate: keep.date });
    }
  }

  console.log(`GRADED docs: ${snap.size}`);
  console.log(`Clone copies to un-grade: ${drops.length}`);
  if (!drops.length) return;

  let batch = db.batch();
  let ops = 0;
  let done = 0;
  for (const row of drops) {
    batch.update(row.ref, {
      status: 'EXITED',
      exitReason: 'date_calendar_retag',
      duplicateOf: row.keepId,
      exitedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    ops++;
    done++;
    if (ops >= 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }
  if (ops > 0) await batch.commit();

  console.log(`Un-graded ${done} later copies → EXITED date_calendar_retag`);
  console.log('Sample:');
  for (const d of drops.slice(0, 8)) {
    console.log(`  DROP ${d.id} ${d.result} pnl=${d.pnl}  KEEP ${d.keepId}`);
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
