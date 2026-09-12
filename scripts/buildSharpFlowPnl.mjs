/**
 * Build public/sharp-flow-pnl.json — processed all-time P&L for Sharp Flow.
 *
 * One Firestore scan of sharpFlowPicks/Spreads/Totals, then compact JSON.
 * Skip if generatedAt is < 55 minutes old so a 12-cycle job does not
 * rescan 12 times. Do not use filesystem mtime — checkout/reset makes
 * the file look brand new every cycle. FORCE=1 rebuilds anyway.
 *
 * Usage: node scripts/buildSharpFlowPnl.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { buildSharpFlowPnl, isSharpFlowPnlBundle, pnlBundleAgeMs, SHARP_FLOW_PNL_VERSION } from '../src/lib/sharpFlowPnl.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'sharp-flow-pnl.json');
const MAX_AGE_MS = 55 * 60 * 1000;
const MIN_PICKS = 200;
const FORCE = process.env.FORCE === '1' || process.argv.includes('--force');

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(ROOT, 'serviceAccountKey.json');
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
  return admin.firestore();
}

function existingBundleAgeMs(path) {
  try {
    return pnlBundleAgeMs(readFileSync(path, 'utf8'));
  } catch {
    return Infinity;
  }
}

async function main() {
  if (!FORCE && existsSync(OUT)) {
    const age = existingBundleAgeMs(OUT);
    if (age < MAX_AGE_MS) {
      const ageMin = (age / 60000).toFixed(1);
      console.log(`[sharp-flow-pnl] skip — generatedAt is ${ageMin} min old (rebuild after 55 min or FORCE=1)`);
      return;
    }
  }

  const db = initFirebase();
  const cols = [
    ['sharpFlowPicks', 'ml'],
    ['sharpFlowSpreads', 'spread'],
    ['sharpFlowTotals', 'total'],
  ];
  const docs = [];
  for (const [col, mt] of cols) {
    const snap = await db.collection(col).get();
    snap.forEach((d) => docs.push({ ...d.data(), _marketType: mt }));
    console.log(`[sharp-flow-pnl] ${col} ${snap.size} docs`);
  }

  const bundle = buildSharpFlowPnl(docs);
  if (!isSharpFlowPnlBundle(bundle) || bundle.picks.length < MIN_PICKS) {
    console.error(`[sharp-flow-pnl] refuse to write — picks=${bundle.picks?.length ?? 0} (min ${MIN_PICKS})`);
    process.exit(1);
  }

  const payload = {
    ...bundle,
    generatedAt: new Date().toISOString(),
    version: SHARP_FLOW_PNL_VERSION,
    docCount: docs.length,
  };
  writeFileSync(OUT, JSON.stringify(payload));
  const kb = Math.round(Buffer.byteLength(JSON.stringify(payload)) / 1024);
  console.log(`[sharp-flow-pnl] wrote ${OUT} picks=${payload.picks.length} docs=${docs.length} ${kb} KB`);
}

main().catch((err) => {
  console.error('[sharp-flow-pnl] failed:', err.message || err);
  process.exit(1);
});
