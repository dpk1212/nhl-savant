/**
 * sendLockAlerts.mjs — Push paid users when a LOCKED pick freezes at T−15.
 *
 * Runs after syncPickStateAuthoritative in the market cron. For each live
 * side with lockStage=LOCKED that has entered the T−15 freeze window and
 * has not yet been alerted, sends OneSignal push filtered to tag paid=true.
 *
 * Usage:
 *   node scripts/sendLockAlerts.mjs
 *   node scripts/sendLockAlerts.mjs --dry-run
 *   node scripts/sendLockAlerts.mjs --date=2026-07-09
 *
 * Env:
 *   ONESIGNAL_APP_ID (default: NHL Savant prod app)
 *   ONESIGNAL_REST_API_KEY (required for live sends)
 *   FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY / VITE_FIREBASE_PROJECT_ID
 *   or serviceAccountKey.json
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const T_MINUS_15_MIN_MS = 15 * 60 * 1000;
const TEMPLATE_ID = '451e41a3-2bdf-4758-a779-ec59a8fecf36';
const APP_ID = process.env.ONESIGNAL_APP_ID || 'd8fcb504-8d29-4354-a9e4-8b612d3eafeb';
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY || '';
const SITE_URL = 'https://nhlsavant.com/#/';

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const dateArg = argv.find((a) => a.startsWith('--date='));
const TARGET_DATE = dateArg
  ? dateArg.split('=')[1]
  : new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const COLLECTIONS = [
  { name: 'sharpFlowPicks', market: 'ML' },
  { name: 'sharpFlowSpreads', market: 'SPREAD' },
  { name: 'sharpFlowTotals', market: 'TOTAL' },
];

function commenceMs(val) {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val._seconds === 'number') return val._seconds * 1000;
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'string') {
    const t = new Date(val).getTime();
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

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
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function pickLabel(pick, sideKey, market) {
  const sd = pick.sides?.[sideKey] || {};
  const team =
    sd.peak?.team ||
    sd.lock?.team ||
    (sideKey === 'away' ? pick.away : sideKey === 'home' ? pick.home : sideKey);
  const mkt =
    market === 'SPREAD'
      ? 'Spread'
      : market === 'TOTAL'
        ? sideKey === 'over'
          ? 'Over'
          : sideKey === 'under'
            ? 'Under'
            : 'Total'
        : 'ML';
  if (market === 'TOTAL' && (sideKey === 'over' || sideKey === 'under')) {
    const line = sd.peak?.line ?? sd.lock?.line;
    const lineStr = line != null ? ` ${line}` : '';
    return `${pick.away || ''} @ ${pick.home || ''} ${mkt}${lineStr}`.replace(/\s+/g, ' ').trim();
  }
  return `${team || sideKey} ${mkt}`.trim();
}

function isAlertableSide(sd) {
  if (!sd || sd.superseded) return false;
  if (sd.lockStage !== 'LOCKED') return false;
  if (sd.lockAlertSentAt) return false;
  // Skip muted / cancelled health if present
  const health = sd.health?.status || sd.status;
  if (health === 'MUTED' || health === 'CANCELLED' || health === 'COMPLETED') return false;
  return true;
}

async function sendOneSignal({ pickText, detail }) {
  if (!REST_KEY) {
    throw new Error('ONESIGNAL_REST_API_KEY is not set');
  }
  const body = {
    app_id: APP_ID,
    template_id: TEMPLATE_ID,
    target_channel: 'push',
    filters: [{ field: 'tag', key: 'paid', relation: '=', value: 'true' }],
    custom_data: {
      pick: pickText,
      detail: detail || '',
    },
    contents: {
      en: `${pickText} is locked — ~15 min to gametime.${detail || ''}`,
    },
    headings: { en: 'Play Locked' },
    url: SITE_URL,
    ttl: 900,
    name: `Lock: ${pickText}`.slice(0, 128),
  };

  const res = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${REST_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.errors ? JSON.stringify(json.errors) : res.statusText;
    throw new Error(`OneSignal ${res.status}: ${msg}`);
  }
  if (json.errors && !json.id) {
    throw new Error(`OneSignal rejected: ${JSON.stringify(json.errors)}`);
  }
  return json;
}

async function main() {
  const now = Date.now();
  console.log(`\n=== sendLockAlerts — ${TARGET_DATE} ===`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'} · app ${APP_ID}`);

  if (!DRY_RUN && !REST_KEY) {
    console.error('Missing ONESIGNAL_REST_API_KEY — aborting (use --dry-run to inspect only)');
    process.exit(1);
  }

  const db = initFirebase();
  const stats = {
    examined: 0,
    candidates: 0,
    sent: 0,
    skipped_not_frozen: 0,
    skipped_started: 0,
    skipped_already: 0,
    skipped_not_locked: 0,
    errors: 0,
  };

  for (const { name: col, market } of COLLECTIONS) {
    const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
    for (const docSnap of snap.docs) {
      const pick = { _id: docSnap.id, ...docSnap.data() };
      if (pick.status === 'COMPLETED') continue;
      const ct = commenceMs(pick.commenceTime);
      const sides = pick.sides || {};

      for (const [sideKey, sd] of Object.entries(sides)) {
        stats.examined++;
        if (!sd || sd.superseded) continue;
        if (sd.lockStage !== 'LOCKED') {
          stats.skipped_not_locked++;
          continue;
        }
        if (sd.lockAlertSentAt) {
          stats.skipped_already++;
          continue;
        }
        if (!isAlertableSide(sd)) continue;

        if (ct == null) {
          console.warn(`  ⚠ ${col}/${pick._id} ${sideKey}: LOCKED but no commenceTime — skip`);
          continue;
        }
        if (now < ct - T_MINUS_15_MIN_MS) {
          stats.skipped_not_frozen++;
          continue;
        }
        if (now > ct) {
          stats.skipped_started++;
          continue;
        }

        stats.candidates++;
        const pickText = pickLabel(pick, sideKey, market);
        const detail = ' Open Sharp Flow.';
        console.log(`  → ${DRY_RUN ? 'WOULD SEND' : 'SEND'} ${col}/${pick._id} ${sideKey}: ${pickText}`);

        if (DRY_RUN) continue;

        try {
          const result = await sendOneSignal({ pickText, detail });
          const messageId = result.id || null;
          await db
            .collection(col)
            .doc(pick._id)
            .set(
              {
                sides: {
                  [sideKey]: {
                    lockAlertSentAt: now,
                    lockAlertMessageId: messageId,
                  },
                },
                lastAction: 'lock_alert_sent',
              },
              { merge: true },
            );
          stats.sent++;
          console.log(`    ✓ message ${messageId || '(no id)'}`);
        } catch (err) {
          stats.errors++;
          console.error(`    ✗ ${err.message || err}`);
        }
      }
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
