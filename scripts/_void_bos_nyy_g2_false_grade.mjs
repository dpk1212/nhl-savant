/**
 * VOID false Game-2 Yankees ML lock on 2026-08-29 DH.
 *
 * Doc: sharpFlowPicks/2026-08-29_MLB_bos_nyy__2
 * Side: home (Yankees ML) — LOSS -4u stamped from Game 1 final while G2
 * was still Top 5th. Never a real lock (peak/lock units 0; Q1 AGS bypass).
 *
 * Usage: node scripts/_void_bos_nyy_g2_false_grade.mjs [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const COL = 'sharpFlowPicks';
const DOC_ID = '2026-08-29_MLB_bos_nyy__2';
const SIDE = 'home';

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

const db = initFirebase();
const del = admin.firestore.FieldValue.delete();
const ref = db.collection(COL).doc(DOC_ID);
const snap = await ref.get();
if (!snap.exists) {
  console.error(`MISSING ${COL}/${DOC_ID}`);
  process.exit(1);
}
const d = snap.data();
const side = d.sides?.[SIDE];
console.log(`${COL}/${DOC_ID}`);
console.log(`  commence=${new Date(d.commenceTime).toISOString()} status=${d.status}`);
console.log(`  side.${SIDE}: lockStage=${side?.lockStage} finalUnits=${side?.finalUnits} outcome=${side?.result?.outcome} profit=${side?.result?.profit} tracked=${side?.result?.tracked}`);

if (DRY) {
  console.log('DRY — would SHADOW + 0u + clear grade on home; doc PENDING if no other COMPLETED sides');
  process.exit(0);
}

const updates = {
  [`sides.${SIDE}.lockStage`]: 'SHADOW',
  [`sides.${SIDE}.finalUnits`]: 0,
  [`sides.${SIDE}.v8_agsUnitsApplied`]: 0,
  [`sides.${SIDE}.health.status`]: 'CANCELLED',
  [`sides.${SIDE}.health.reasons`]: admin.firestore.FieldValue.arrayUnion('void_dh_g1_false_grade'),
  [`sides.${SIDE}.status`]: 'COMPLETED',
  [`sides.${SIDE}.result.outcome`]: 'LOSS',
  [`sides.${SIDE}.result.profit`]: 0,
  [`sides.${SIDE}.result.tracked`]: true,
  [`sides.${SIDE}.result.voided`]: true,
  [`sides.${SIDE}.result.voidReason`]: 'dh_g1_score_on_g2_never_locked',
  [`sides.${SIDE}.result.voidedAt`]: admin.firestore.FieldValue.serverTimestamp(),
  'result.voidNote': 'home Yankees ML voided — G1 final applied to G2; never a real lock',
};

await ref.update(updates);
const after = (await ref.get()).data();
const a = after.sides?.[SIDE];
console.log('VOIDED →', {
  lockStage: a.lockStage,
  finalUnits: a.finalUnits,
  health: a.health?.status,
  profit: a.result?.profit,
  tracked: a.result?.tracked,
  voided: a.result?.voided,
});
console.log('Done. Refresh Sharp Flow — card gone from Locked / PnL.');
process.exit(0);
