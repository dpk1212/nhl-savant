// Trace what syncPickStateAuthoritative would compute for the Lakers SPREAD
// side TODAY, without writing anything. We re-import the same helpers it
// uses so we can be sure we're seeing the same math, not a divergent
// reimplementation.

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  AGS_FALLBACK_CALIBRATION,
  aggregateSideProven,
  computeAgs,
  agsSizeMultiplier,
  AGS_MIN_PROVEN_WALLETS,
  meetsAgsLockFloor,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// 1) Load AGS calibration
const calDoc = await db.collection('agsCalibration').doc('current').get();
const cal = calDoc.exists ? calDoc.data() : AGS_FALLBACK_CALIBRATION;
console.log('[trace] calibration source:', cal === AGS_FALLBACK_CALIBRATION ? 'fallback' : (cal.source || 'firestore'));
console.log('[trace] AGS_MIN_PROVEN_WALLETS =', AGS_MIN_PROVEN_WALLETS);

// 2) Build proven map
const profSnap = await db.collection('sharpWalletProfiles').get();
const tierMap = new Map();
for (const d of profSnap.docs) {
  const p = d.data();
  if (!p?.bySport) continue;
  const m = {};
  for (const [s, r] of Object.entries(p.bySport)) if (r?.whitelistTier) m[s] = r.whitelistTier;
  tierMap.set(d.id, m);
}
function isProven(short, sport) {
  const t = tierMap.get(short)?.[sport];
  return t === 'CONFIRMED' || t === 'FLAT';
}

// 3) Find Lakers SPREAD side
const snap = await db.collection('sharpFlowSpreads').where('date', '==', TODAY).get();
for (const doc of snap.docs) {
  const d = doc.data();
  if (!`${d.away} ${d.home}`.toLowerCase().includes('laker')) continue;
  const sides = d.sides || {};
  for (const [k, side] of Object.entries(sides)) {
    if (side.team !== 'Lakers') continue;
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`  ${d.away} @ ${d.home} — SPREAD — side=${k} team=${side.team}`);
    console.log('───────────────────────────────────────────────────────');
    const wd = side.peak?.v8Scoring?.walletDetails || side.lock?.v8Scoring?.walletDetails || [];
    console.log(`  walletDetails.length: ${wd.length}`);
    if (!wd.length) { console.log('  ⛔ no walletDetails — AGS would be null'); continue; }
    const agg = aggregateSideProven(wd, k, d.sport, isProven);
    if (!agg) { console.log('  ⛔ aggregateSideProven returned null (no proven wallets on either side)'); continue; }
    const ags = computeAgs(agg, cal);
    const total = (ags.provenForCount || 0) + (ags.provenAgCount || 0);
    console.log(`  AGS: ${ags.ags.toFixed(3)}  tier=${ags.tier}  q=${ags.quintile}  proven=${ags.provenForCount}/${ags.provenAgCount} (total=${total})`);
    console.log(`  meetsAgsLockFloor(${ags.ags.toFixed(2)}, ${total}) = ${meetsAgsLockFloor(ags.ags, total)}`);
    console.log(`  AGS_MIN_PROVEN_WALLETS guard: ${total} >= ${AGS_MIN_PROVEN_WALLETS} → ${total >= AGS_MIN_PROVEN_WALLETS}`);

    // What Firestore currently has stamped
    console.log(`\n  Firestore CURRENT stamp:`);
    console.log(`    lockStage=${side.lockStage}  health.status=${side.health?.status}  promotedBy=${side.promotedBy ?? 'null'}`);
    console.log(`    v8_agsUnitsBase=${side.v8_agsUnitsBase}  applied=${side.v8_agsUnitsApplied}  mult=${side.v8_agsUnitsMult}`);
    console.log(`    v8_agsEvaluatedAt=${side.v8_agsEvaluatedAt ? new Date(side.v8_agsEvaluatedAt._seconds * 1000).toISOString() : '—'}`);
    console.log(`    health.evaluatedAt=${side.health?.evaluatedAt ? new Date(side.health.evaluatedAt._seconds * 1000).toISOString() : (typeof side.health?.evaluatedAt === 'number' ? new Date(side.health.evaluatedAt).toISOString() : '—')}`);
    console.log(`    lastSyncAt=${side.lastSyncAt ? new Date(side.lastSyncAt._seconds * 1000).toISOString() : '—'}`);
    console.log(`    health.syncedBy=${side.health?.syncedBy ?? '—'}`);
    console.log(`    superseded=${side.superseded}`);
    console.log(`    pickDate / commenceTime in ms / now in ms:`);
    console.log(`      date=${d.date}, commenceTime=${d.commenceTime}, now=${Date.now()}`);
    console.log(`      time-to-game minutes: ${((d.commenceTime - Date.now())/60000).toFixed(1)}`);
  }
}
process.exit(0);
