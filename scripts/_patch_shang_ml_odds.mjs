/**
 * One-shot: Shang ML ticket juice is the Polymarket board (−174), not a
 * 50¢ mint (−100 / 2u to win +2.00u). Writes lock + peak on the live doc.
 *
 * Usage: node scripts/_patch_shang_ml_odds.mjs [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const COL = 'sharpFlowPicks';
const GAME_KEY = 'danesweeny_junchengshang';
const SIDE = 'home';
const CANDIDATES = [
  '2026-11-12_ATP_danesweeny_junchengshang',
  '2026-11-13_ATP_danesweeny_junchengshang',
];

function americanFromProbPct(pct) {
  if (!Number.isFinite(pct) || pct <= 0) return null;
  const p = pct > 1 ? pct / 100 : pct;
  if (!(p > 0 && p < 1)) return null;
  return p >= 0.5
    ? Math.round((-100 * p) / (1 - p))
    : Math.round((100 * (1 - p)) / p);
}

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

const polyPath = path.join(__dirname, '..', 'public', 'polymarket_data.json');
const poly = JSON.parse(fs.readFileSync(polyPath, 'utf8'));
const game = poly?.ATP?.[GAME_KEY];
const boardOdds = americanFromProbPct(game?.homeProb);
if (!Number.isFinite(boardOdds) || boardOdds === 0) {
  console.error(`No ATP ${GAME_KEY} homeProb in polymarket_data.json`);
  process.exit(1);
}

const db = initFirebase();
let docId = null;
let snap = null;
for (const id of CANDIDATES) {
  const s = await db.collection(COL).doc(id).get();
  if (s.exists) {
    docId = id;
    snap = s;
    break;
  }
}
if (!snap) {
  const today = await db.collection(COL).where('gameKey', '==', GAME_KEY).limit(5).get();
  if (today.empty) {
    console.error(`MISSING ${COL} ${GAME_KEY}`);
    process.exit(1);
  }
  snap = today.docs[0];
  docId = snap.id;
}

const d = snap.data();
const side = d.sides?.[SIDE] || {};
const beforeLock = side.lock?.odds ?? null;
const beforePeak = side.peak?.odds ?? null;
console.log(`${COL}/${docId}`);
console.log(`  commence=${d.commenceTime} status=${d.status} lockStage=${side.lockStage} units=${side.finalUnits}`);
console.log(`  lock.odds=${beforeLock} peak.odds=${beforePeak} board=${boardOdds} (homeProb ${game.homeProb})`);

if (DRY) {
  console.log(`DRY — would set lock/peak odds ${beforeLock} → ${boardOdds}`);
  process.exit(0);
}

const now = Date.now();
await db.collection(COL).doc(docId).update({
  [`sides.${SIDE}.lock.odds`]: boardOdds,
  [`sides.${SIDE}.lock.pinnacleOdds`]: boardOdds,
  [`sides.${SIDE}.lock.book`]: 'Polymarket',
  [`sides.${SIDE}.lock.oddsSource`]: 'polymarket',
  [`sides.${SIDE}.peak.odds`]: boardOdds,
  [`sides.${SIDE}.peak.pinnacleOdds`]: boardOdds,
  [`sides.${SIDE}.peak.book`]: 'Polymarket',
  [`sides.${SIDE}.peak.oddsSource`]: 'polymarket',
  [`sides.${SIDE}.lastPatchedAt`]: now,
  [`sides.${SIDE}.lastPatchReason`]: 'atp-mint-even-money-to-board',
});

const after = (await db.collection(COL).doc(docId).get()).data();
const a = after.sides?.[SIDE];
console.log(`AFTER lock.odds=${a?.lock?.odds} peak.odds=${a?.peak?.odds}`);
await admin.app().delete();
process.exit(0);
