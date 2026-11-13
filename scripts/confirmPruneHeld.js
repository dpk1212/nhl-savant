/**
 * After sync, re-check the tickets the freshness prune just dropped.
 * One Polymarket read per wallet. A position still held gets its
 * updatedAt refreshed so the next cycle's existing 30-minute window
 * keeps it. A failed read, a timeout, or a budget overrun leaves the
 * ticket dropped.
 *
 * PRUNE_HELD_STAMP=0 logs the keeps and writes nothing.
 * The alt-line exit is a different path and is not in this list.
 *
 * Usage: node scripts/confirmPruneHeld.js
 */

import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { fetchOpenPositionsV2 } from './lib/fetchPositionPages.js';
import {
  CONFIRM_BUDGET_MS,
  MAX_CONFIRM_WALLETS,
  candidatesAreFresh,
  heldAssetSet,
  pruneCandidatePath,
  selectHeldCandidates,
  walletsInOrder,
} from './lib/pruneHeldConfirm.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STAMP = process.env.PRUNE_HELD_STAMP !== '0';
const REQUEST_TIMEOUT_MS = 8_000;
const POSITION_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(ROOT, 'serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      return null;
    }
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: POSITION_HEADERS,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (res.status === 429 || !res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function ticketLabel(row) {
  return [row.sport, row.gameKey, row.marketType, row.side].filter(Boolean).join(' ');
}

async function main() {
  const started = Date.now();
  const filePath = pruneCandidatePath(ROOT);
  if (!existsSync(filePath)) {
    console.log('PRUNE HELD: no candidate file — nothing to check');
    return;
  }
  let file;
  try {
    file = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn(`PRUNE HELD: candidate file unreadable (${err.message}) — nothing stamped`);
    return;
  }
  if (!candidatesAreFresh(file, started)) {
    console.log('PRUNE HELD: candidate file is stale — nothing stamped');
    return;
  }
  const candidates = Array.isArray(file.candidates) ? file.candidates : [];
  if (candidates.length === 0) {
    console.log('PRUNE HELD: 0 candidates');
    return;
  }

  const wallets = walletsInOrder(candidates, MAX_CONFIRM_WALLETS);
  const heldByWallet = new Map();
  let fetched = 0;
  for (const wallet of wallets) {
    if (Date.now() - started > CONFIRM_BUDGET_MS) break;
    fetched += 1;
    let rows = null;
    try {
      rows = await fetchOpenPositionsV2(wallet, fetchJson);
    } catch {
      rows = null;
    }
    heldByWallet.set(wallet, Array.isArray(rows) ? heldAssetSet(rows) : null);
  }

  const decision = selectHeldCandidates(candidates, heldByWallet);
  console.log(
    `PRUNE HELD: candidates=${candidates.length} wallets=${wallets.length}`
    + ` checked=${fetched} kept=${decision.keep.length} absent=${decision.absent.length}`
    + ` failed=${decision.failed.length} unchecked=${decision.unchecked.length}`
    + ` noAsset=${decision.noAsset.length}`,
  );
  for (const row of decision.keep.slice(0, 20)) {
    console.log(`  keep ${ticketLabel(row)}`);
  }
  if (!STAMP) {
    console.log('PRUNE HELD: stamp off (PRUNE_HELD_STAMP=0) — nothing written');
    return;
  }
  if (decision.keep.length === 0) return;

  const db = initFirebase();
  if (!db) {
    console.warn('PRUNE HELD: no Firebase credentials — keeps logged, nothing stamped');
    return;
  }
  const col = db.collection('sharp_action_positions');
  let stamped = 0;
  let skipped = 0;
  const chunk = 100;
  for (let i = 0; i < decision.keep.length; i += chunk) {
    const slice = decision.keep.slice(i, i + chunk);
    const refs = slice.map((row) => col.doc(String(row.id)));
    const snaps = await db.getAll(...refs);
    const batch = db.batch();
    let ops = 0;
    snaps.forEach((snap, idx) => {
      const data = snap.exists ? (snap.data() || {}) : null;
      const want = String(slice[idx].asset);
      const status = data?.status || 'PENDING';
      if (!data || status !== 'PENDING' || String(data.asset || '') !== want) {
        skipped += 1;
        return;
      }
      batch.update(snap.ref, { updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      ops += 1;
      stamped += 1;
    });
    if (ops > 0) await batch.commit();
  }
  console.log(`PRUNE HELD: stamped ${stamped} PENDING ticket(s), skipped ${skipped}`);
}

main().catch((err) => {
  console.warn(`PRUNE HELD: failed (${err.message}) — dropped tickets stay dropped`);
  process.exit(0);
});
