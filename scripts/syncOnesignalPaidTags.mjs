/**
 * syncOnesignalPaidTags.mjs — Backfill / reconcile OneSignal `paid` tags
 * from Firestore subscription state.
 *
 * For each users/{uid}:
 *   paid active (scout|elite|pro + active|trialing) → preserve all|edge11
 *     (migrate legacy true → all; default all)
 *   otherwise → paid=false
 *
 * Only writes the single tag `paid` (org plan tag limit).
 *
 * Usage:
 *   ONESIGNAL_REST_API_KEY=... node scripts/syncOnesignalPaidTags.mjs --dry-run
 *   ONESIGNAL_REST_API_KEY=... node scripts/syncOnesignalPaidTags.mjs
 *   ONESIGNAL_REST_API_KEY=... node scripts/syncOnesignalPaidTags.mjs --uid=TJs6...
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { paidTagForEntitlement, LOCK_ALERT_MODE } from '../src/lib/lockAlertMode.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ID = process.env.ONESIGNAL_APP_ID || 'd8fcb504-8d29-4354-a9e4-8b612d3eafeb';
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY || '';
const PAID_TIERS = new Set(['scout', 'elite', 'pro']);
const PAID_STATUS = new Set(['active', 'trialing']);

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const uidArg = argv.find((a) => a.startsWith('--uid='));
const ONLY_UID = uidArg ? uidArg.split('=')[1] : null;

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
    if (existsSync(sakPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))),
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
  }
  return admin.firestore();
}

function isPaidUser(data) {
  return PAID_TIERS.has(data?.tier) && PAID_STATUS.has(data?.status);
}

async function fetchPaidTag(uid) {
  const url = `https://api.onesignal.com/apps/${APP_ID}/users/by/external_id/${encodeURIComponent(uid)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Key ${REST_KEY}` },
  });
  if (res.status === 404) return { exists: false, paid: null };
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${res.status} ${text}`);
  }
  const json = await res.json().catch(() => ({}));
  const paid = json?.properties?.tags?.paid ?? json?.tags?.paid ?? null;
  return { exists: true, paid };
}

async function setPaidTag(uid, paidValue) {
  const url = `https://api.onesignal.com/apps/${APP_ID}/users/by/external_id/${encodeURIComponent(uid)}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${REST_KEY}`,
    },
    body: JSON.stringify({ properties: { tags: { paid: paidValue } } }),
  });
  if (res.status === 404) return { ok: true, reason: 'no_onesignal_user' };
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, reason: `${res.status} ${text}` };
  }
  return { ok: true };
}

async function main() {
  console.log(`\n=== syncOnesignalPaidTags ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Paid values: ${LOCK_ALERT_MODE.ALL} | ${LOCK_ALERT_MODE.EDGE11} (preserve) · free → false`);

  if (!DRY_RUN && !REST_KEY) {
    console.error('Missing ONESIGNAL_REST_API_KEY');
    process.exit(1);
  }

  const db = initFirebase();
  const stats = {
    examined: 0,
    paid: 0,
    free: 0,
    updated: 0,
    missing: 0,
    preserved_edge11: 0,
    migrated_true: 0,
    errors: 0,
  };

  let docs;
  if (ONLY_UID) {
    const snap = await db.collection('users').doc(ONLY_UID).get();
    docs = snap.exists ? [snap] : [];
  } else {
    const snap = await db.collection('users').get();
    docs = snap.docs;
  }

  for (const doc of docs) {
    stats.examined++;
    const uid = doc.id;
    const paid = isPaidUser(doc.data());
    if (paid) stats.paid++;
    else stats.free++;

    let next = LOCK_ALERT_MODE.OFF;
    let current = null;
    if (paid) {
      if (!DRY_RUN && REST_KEY) {
        try {
          const fetched = await fetchPaidTag(uid);
          current = fetched.paid;
          if (current === 'edge11') stats.preserved_edge11++;
          if (current === 'true') stats.migrated_true++;
          next = paidTagForEntitlement(current);
        } catch (err) {
          console.warn(`  ${uid} GET tag failed — default all: ${err.message || err}`);
          next = LOCK_ALERT_MODE.ALL;
        }
      } else {
        next = LOCK_ALERT_MODE.ALL;
      }
    }

    console.log(`  ${uid} → paid=${next}${current != null ? ` (was ${current})` : ''}`);
    if (DRY_RUN) continue;

    try {
      const result = await setPaidTag(uid, next);
      if (result.reason === 'no_onesignal_user') {
        stats.missing++;
        console.log(`    (no OneSignal user)`);
      } else if (!result.ok) {
        stats.errors++;
        console.error(`    ✗ ${result.reason}`);
      } else {
        stats.updated++;
      }
      await new Promise((r) => setTimeout(r, 100));
    } catch (err) {
      stats.errors++;
      console.error(`    ✗ ${err.message || err}`);
    }
  }

  console.log('\n--- summary ---');
  console.log(JSON.stringify(stats, null, 2));
  if (stats.errors > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
