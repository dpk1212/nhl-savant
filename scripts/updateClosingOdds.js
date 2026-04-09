/**
 * updateClosingOdds.js — Captures current Pinnacle odds for each PENDING
 * Sharp Flow pick every 15 min. The last write before game start becomes
 * the "close", enabling CLV (Closing Line Value) analysis.
 *
 * Reads pinnacle_history.json (already on disk from snapshotPinnacle.js),
 * queries Firestore for PENDING picks, and updates each side's closingOdds.
 *
 * Usage: node scripts/updateClosingOdds.js
 */

import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.log('⚠️  No Firebase config — skipping closing odds update');
  process.exit(0);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function impliedProb(american) {
  if (!american || american === 0) return null;
  return american < 0
    ? Math.abs(american) / (Math.abs(american) + 100)
    : 100 / (american + 100);
}

const PINN_PATH = join(ROOT, 'public', 'pinnacle_history.json');

async function run() {
  let pinnacle;
  try {
    pinnacle = JSON.parse(readFileSync(PINN_PATH, 'utf-8'));
  } catch (e) {
    console.log('⚠️  Could not read pinnacle_history.json — skipping');
    process.exit(0);
  }

  const now = Date.now();
  let updated = 0;
  let skipped = 0;

  // ─── ML Picks (sharpFlowPicks) ───
  const mlSnap = await getDocs(query(collection(db, 'sharpFlowPicks'), where('status', '==', 'PENDING')));
  for (const d of mlSnap.docs) {
    const data = d.data();
    const { sport, gameKey, sides, commenceTime } = data;
    if (!sides || !sport || !gameKey) { skipped++; continue; }
    if (commenceTime && now >= commenceTime) { skipped++; continue; }
    const pinnGame = pinnacle?.[sport]?.[gameKey];
    if (!pinnGame?.current) { skipped++; continue; }
    const updates = {};
    let hasUpdate = false;
    for (const side of Object.keys(sides)) {
      const pinnOdds = side === 'away' ? pinnGame.current.away : pinnGame.current.home;
      if (pinnOdds == null) continue;
      const prob = impliedProb(pinnOdds);
      updates[`sides.${side}.closingOdds`] = pinnOdds;
      updates[`sides.${side}.closingPinnProb`] = prob ? +prob.toFixed(4) : null;
      hasUpdate = true;
    }
    if (!hasUpdate) { skipped++; continue; }
    updates.source = 'closing_odds_sync';
    updates.closingOddsUpdatedAt = now;
    try { await updateDoc(doc(db, 'sharpFlowPicks', d.id), updates); updated++; }
    catch (e) { console.warn(`  ⚠️  Failed to update ${d.id}: ${e.message}`); skipped++; }
  }

  // ─── Spread Picks (sharpFlowSpreads) ───
  const spreadSnap = await getDocs(query(collection(db, 'sharpFlowSpreads'), where('status', '==', 'PENDING')));
  for (const d of spreadSnap.docs) {
    const data = d.data();
    const { sport, gameKey, sides, commenceTime } = data;
    if (!sides || !sport || !gameKey) { skipped++; continue; }
    if (commenceTime && now >= commenceTime) { skipped++; continue; }
    const pinnGame = pinnacle?.[sport]?.[gameKey];
    const sc = pinnGame?.spreadCurrent;
    if (!sc) { skipped++; continue; }
    const updates = {};
    let hasUpdate = false;
    for (const side of Object.keys(sides)) {
      const closingLine = side === 'away' ? sc.awayLine : sc.homeLine;
      const closingOdds = side === 'away' ? sc.awayOdds : sc.homeOdds;
      if (closingOdds == null) continue;
      const prob = impliedProb(closingOdds);
      updates[`sides.${side}.closingOdds`] = closingOdds;
      updates[`sides.${side}.closingLine`] = closingLine;
      updates[`sides.${side}.closingPinnProb`] = prob ? +prob.toFixed(4) : null;
      hasUpdate = true;
    }
    if (!hasUpdate) { skipped++; continue; }
    updates.source = 'closing_odds_sync';
    updates.closingOddsUpdatedAt = now;
    try { await updateDoc(doc(db, 'sharpFlowSpreads', d.id), updates); updated++; }
    catch (e) { console.warn(`  ⚠️  Failed to update spread ${d.id}: ${e.message}`); skipped++; }
  }

  // ─── Total (O/U) Picks (sharpFlowTotals) ───
  const totalSnap = await getDocs(query(collection(db, 'sharpFlowTotals'), where('status', '==', 'PENDING')));
  for (const d of totalSnap.docs) {
    const data = d.data();
    const { sport, gameKey, sides, commenceTime } = data;
    if (!sides || !sport || !gameKey) { skipped++; continue; }
    if (commenceTime && now >= commenceTime) { skipped++; continue; }
    const pinnGame = pinnacle?.[sport]?.[gameKey];
    const tc = pinnGame?.totalCurrent;
    if (!tc) { skipped++; continue; }
    const updates = {};
    let hasUpdate = false;
    for (const side of Object.keys(sides)) {
      const closingOdds = side === 'over' ? tc.overOdds : tc.underOdds;
      if (closingOdds == null) continue;
      const prob = impliedProb(closingOdds);
      updates[`sides.${side}.closingOdds`] = closingOdds;
      updates[`sides.${side}.closingLine`] = tc.line;
      updates[`sides.${side}.closingPinnProb`] = prob ? +prob.toFixed(4) : null;
      hasUpdate = true;
    }
    if (!hasUpdate) { skipped++; continue; }
    updates.source = 'closing_odds_sync';
    updates.closingOddsUpdatedAt = now;
    try { await updateDoc(doc(db, 'sharpFlowTotals', d.id), updates); updated++; }
    catch (e) { console.warn(`  ⚠️  Failed to update total ${d.id}: ${e.message}`); skipped++; }
  }

  const totalDocs = mlSnap.size + spreadSnap.size + totalSnap.size;
  console.log(`✅ Closing odds: ${updated} picks updated, ${skipped} skipped (${totalDocs} total PENDING — ${mlSnap.size} ML, ${spreadSnap.size} spread, ${totalSnap.size} total)`);
  process.exit(0);
}

run().catch(e => {
  console.error('❌ updateClosingOdds error:', e.message);
  process.exit(1);
});
