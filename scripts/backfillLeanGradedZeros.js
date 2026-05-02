/**
 * backfillLeanGradedZeros.js — one-shot fix for any historical sharpFlow*
 * pick that was graded as a LEAN/0u play but had its `result.profit` written
 * as a non-zero unit value (the legacy `peak.units || lock.units || 1` bug
 * in the Cloud Function grader, which fell through to 1u for any LEAN play
 * because 0 is JS-falsy and `||` skipped it).
 *
 * Detection per side (strict — only true 0u plays):
 *   • status === 'COMPLETED'
 *   • outcome ∈ {WIN, LOSS}
 *   • (peak.units ?? lock.units) === 0   ← the only condition that
 *     actually identifies a LEAN tracking play. v8_lockTier='LEAN' alone is
 *     NOT enough because it can be a stale stamp on a LOCKED pick that was
 *     later promoted via v7.2/v7.3 HC margin rules and actually shipped at
 *     0.5u; we don't want to retroactively zero those out.
 *   • AND result.tracked is not already true
 *
 * Fix per side:
 *   • result.profit = 0
 *   • result.tracked = true
 *
 * Run:
 *   node scripts/backfillLeanGradedZeros.js --dry-run
 *   node scripts/backfillLeanGradedZeros.js
 *   node scripts/backfillLeanGradedZeros.js --date=2026-05-01   # one day only
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const dateArg = argv.find(a => a.startsWith('--date='));
const TARGET_DATE = dateArg ? dateArg.split('=')[1] : null;

if (!admin.apps.length) {
  const sak = join(__dirname, '..', 'serviceAccountKey.json');
  if (existsSync(sak)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
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

const COLLECTIONS = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

async function main() {
  console.log(`\n=== backfillLeanGradedZeros ${TARGET_DATE ? `(date=${TARGET_DATE})` : '(all dates)'} ${DRY ? '· DRY RUN' : ''} ===\n`);

  let scanned = 0, fixed = 0;
  const log = [];

  for (const col of COLLECTIONS) {
    let q = db.collection(col);
    if (TARGET_DATE) q = q.where('date', '==', TARGET_DATE);
    const snap = await q.get();
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const sides = data.sides || {};
      const patch = {};
      for (const [side, sd] of Object.entries(sides)) {
        if (sd.status !== 'COMPLETED') continue;
        const outcome = sd.result?.outcome;
        if (outcome !== 'WIN' && outcome !== 'LOSS') continue;
        scanned++;
        const peakUnits = sd.peak?.units ?? sd.lock?.units ?? null;
        // Strict: only zero out picks that were stored at 0u. Anything that
        // shipped at >0u (including the v7.2/v7.3 0.5u sub-Σ-3 lock floor)
        // was a real bet and keeps its real PnL.
        if (peakUnits !== 0) continue;
        const alreadyTracked = sd.result?.tracked === true && (sd.result?.profit === 0);
        if (alreadyTracked) continue;
        // Apply: profit=0, tracked=true.
        patch[`sides.${side}.result.profit`] = 0;
        patch[`sides.${side}.result.tracked`] = true;
        fixed++;
        log.push({
          col, docId: docSnap.id, side,
          team: sd.team || side,
          outcome,
          oldProfit: sd.result?.profit,
          peakUnits,
          lockStage: sd.lockStage,
          v8Tier: sd.v8_lockTier,
        });
      }
      if (Object.keys(patch).length > 0 && !DRY) {
        await docSnap.ref.update(patch);
      }
    }
  }

  for (const r of log) {
    console.log(`[${r.col.replace('sharpFlow','').toUpperCase()}] ${r.docId} · ${r.side} (${r.team}) · ${r.outcome} · oldProfit=${r.oldProfit} → 0u  (peakUnits=${r.peakUnits} lockStage=${r.lockStage} v8Tier=${r.v8Tier})`);
  }
  console.log(`\nScanned ${scanned} graded W/L sides · Fixed ${fixed}${DRY ? ' (DRY RUN — nothing written)' : ''}\n`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
