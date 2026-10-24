/**
 * PUSH the 2026-10-16 Rays @ Guardians Over 6.5 that ESPN graded as
 * LOSS -2u off a postponed 0-0 (STATUS_POSTPONED, state=post).
 *
 * Same night the Rays ML on this game was already a PUSH (0-0 baseball
 * ML). Stake back; do not remove the ticket from the book.
 *
 * Usage: node scripts/_push_cle_tb_postponed_total.mjs [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const COL = 'sharpFlowTotals';
const DOC_ID = '2026-10-16_MLB_tbr_cle_total';
const SIDE = 'over';
const EXPECT_DATE = '2026-10-16';
const EXPECT_AWAY = 'Tampa Bay Rays';
const EXPECT_HOME = 'Cleveland Guardians';

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
console.log(`  date=${d.date} ${d.away} @ ${d.home} status=${d.status}`);
console.log(`  side.${SIDE}: lockStage=${side?.lockStage} finalUnits=${side?.finalUnits} outcome=${side?.result?.outcome} profit=${side?.result?.profit} tracked=${side?.result?.tracked}`);
console.log(`  doc.result scores=${d.result?.awayScore}-${d.result?.homeScore} source=${d.result?.source}`);

if (d.date !== EXPECT_DATE || d.away !== EXPECT_AWAY || d.home !== EXPECT_HOME) {
  console.error(`REFUSING — expected ${EXPECT_DATE} ${EXPECT_AWAY} @ ${EXPECT_HOME}`);
  process.exit(1);
}
if (!side) {
  console.error(`REFUSING — missing sides.${SIDE}`);
  process.exit(1);
}
const oc = side.result?.outcome;
if (oc && oc !== 'LOSS' && oc !== 'PUSH') {
  console.error(`REFUSING — unexpected outcome ${oc}`);
  process.exit(1);
}

if (DRY) {
  console.log('DRY — would PUSH over, profit 0, clear phantom 0-0 scores');
  process.exit(0);
}

if (oc === 'PUSH' && Number(side.result?.profit) === 0 && side.result?.voidReason === 'postponed_no_play') {
  console.log('Already PUSH / postponed — nothing to do');
  process.exit(0);
}

const updates = {
  [`sides.${SIDE}.status`]: 'COMPLETED',
  [`sides.${SIDE}.result.outcome`]: 'PUSH',
  [`sides.${SIDE}.result.profit`]: 0,
  [`sides.${SIDE}.result.tracked`]: false,
  [`sides.${SIDE}.result.voided`]: true,
  [`sides.${SIDE}.result.voidReason`]: 'postponed_no_play',
  [`sides.${SIDE}.result.voidedAt`]: admin.firestore.FieldValue.serverTimestamp(),
  'result.awayScore': del,
  'result.homeScore': del,
  'result.winner': del,
  'result.voidNote': 'Over 6.5 pushed — TB@CLE 2026-10-16 postponed, ESPN 0-0 was not a final',
};

await ref.update(updates);

const mlRef = db.collection('sharpFlowPicks').doc('2026-10-16_MLB_tbr_cle');
const mlSnap = await mlRef.get();
if (mlSnap.exists) {
  const ml = mlSnap.data();
  if (ml.result?.awayScore === 0 && ml.result?.homeScore === 0) {
    await mlRef.update({
      'result.awayScore': del,
      'result.homeScore': del,
      'result.winner': del,
      'result.voidNote': 'TB@CLE 2026-10-16 postponed — cleared phantom 0-0 so it cannot seed other grades',
    });
    console.log('Cleared phantom 0-0 on ML doc (outcome left PUSH)');
  }
}

const posSnap = await db.collection('sharp_action_positions')
  .where('date', '==', EXPECT_DATE)
  .where('sport', '==', 'MLB')
  .get();
let posN = 0;
for (const doc of posSnap.docs) {
  const p = doc.data() || {};
  const key = String(p.gameKey || '').replace(/^MLB:/, '');
  const mkt = String(p.marketType || '').toUpperCase();
  if (key !== 'tbr_cle' || mkt !== 'TOTAL') continue;
  if (p.result === 'PUSH' && p.settledPnl === 0) continue;
  const entryPrice = Number(p.avgPrice) || 0;
  await doc.ref.update({
    result: 'PUSH',
    settledPnl: 0,
    settledPrice: entryPrice,
    'score.away': del,
    'score.home': del,
    voided: true,
    voidReason: 'postponed_no_play',
  });
  posN++;
  console.log(`  position ${doc.id} ${p.side} ${p.teamName || ''} → PUSH`);
}

const after = (await ref.get()).data();
const a = after.sides?.[SIDE];
console.log('PUSHED →', {
  outcome: a.result?.outcome,
  profit: a.result?.profit,
  voided: a.result?.voided,
  voidReason: a.result?.voidReason,
  scores: after.result,
  positions: posN,
});
console.log('Done. Over 6.5 is a push (postponed). Makeup Over 6.5 on 2026-10-17 is untouched.');
process.exit(0);
