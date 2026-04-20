/**
 * Diagnostic: what's in sharpFlowPicks/Spreads/Totals and why so few survive?
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  return admin.firestore();
}
const db = initFirebase();

async function main() {
  const cols = [['sharpFlowPicks','ML'], ['sharpFlowSpreads','SPREAD'], ['sharpFlowTotals','TOTAL']];
  const tally = {
    totalDocs: 0, totalSides: 0,
    byStatus: {}, byLockStage: {}, byOutcome: {}, superseded: 0,
    missingV8: 0, missingWalletDetails: 0,
    dateHisto: {},
    passFilter: 0,
  };
  const byDatePass = {};
  const byDateTotal = {};

  for (const [colName, mkt] of cols) {
    const snap = await db.collection(colName).get();
    snap.forEach(d => {
      const data = d.data();
      tally.totalDocs++;
      if (!data.sides) return;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        tally.totalSides++;
        const status = sd.status || data.status || 'UNKNOWN';
        const stage = sd.lockStage || 'NONE';
        const outcome = sd.result?.outcome || data.result?.outcome || 'PENDING';
        const date = data.date || 'unknown';
        tally.byStatus[status] = (tally.byStatus[status] || 0) + 1;
        tally.byLockStage[stage] = (tally.byLockStage[stage] || 0) + 1;
        tally.byOutcome[outcome] = (tally.byOutcome[outcome] || 0) + 1;
        tally.dateHisto[date] = (tally.dateHisto[date] || 0) + 1;
        byDateTotal[date] = (byDateTotal[date] || 0) + 1;
        if (sd.superseded) tally.superseded++;

        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const v8 = pk?.v8Scoring || lk?.v8Scoring || null;
        if (!v8) tally.missingV8++;
        else if (!Array.isArray(v8.walletDetails)) tally.missingWalletDetails++;

        const passes =
          status === 'COMPLETED' &&
          !sd.superseded &&
          outcome && outcome !== 'PUSH' && outcome !== 'PENDING' &&
          v8 && Array.isArray(v8.walletDetails);
        if (passes) {
          tally.passFilter++;
          byDatePass[date] = (byDatePass[date] || 0) + 1;
        }
      }
    });
  }

  console.log('=== Diagnostic: V8 pick survival ===\n');
  console.log(`Total docs across 3 collections: ${tally.totalDocs}`);
  console.log(`Total side-entries: ${tally.totalSides}`);
  console.log(`Superseded side-entries: ${tally.superseded}`);
  console.log(`Missing v8Scoring: ${tally.missingV8}`);
  console.log(`v8 present but walletDetails missing: ${tally.missingWalletDetails}`);
  console.log(`\nBy status:`, tally.byStatus);
  console.log(`By lockStage:`, tally.byLockStage);
  console.log(`By outcome:`, tally.byOutcome);
  console.log(`\nPer-date side counts (all):`);
  for (const [date, n] of Object.entries(tally.dateHisto).sort()) {
    console.log(`  ${date}: ${n} side-entries, ${byDatePass[date] || 0} pass filter`);
  }
  console.log(`\nPICKS PASSING (COMPLETED + not superseded + graded + has walletDetails): ${tally.passFilter}`);
}

main().catch(e => { console.error(e); process.exit(1); });
