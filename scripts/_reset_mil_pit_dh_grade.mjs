/**
 * Reset false Game-1 grades on Game-2 mil_pit picks (2026-07-11 DH).
 *
 * ESPN Game 1 (16:05Z) finished 6–7 and the TOTAL_GRADER matched by team
 * codes only — so Game 2's Over 8.5 (commence ~20:06Z) was marked WIN/+2.80u
 * before Game 2 started. Same bug hit the ML shadow doc.
 *
 * Usage: node scripts/_reset_mil_pit_dh_grade.mjs [--dry]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf8'),
    )),
  });
}
const db = admin.firestore();
const del = admin.firestore.FieldValue.delete();

const TARGETS = [
  {
    col: 'sharpFlowTotals',
    id: '2026-07-11_MLB_mil_pit_total',
    sides: ['over'],
    expectCommenceIso: '2026-07-11T20:06:00.000Z',
  },
  {
    col: 'sharpFlowPicks',
    id: '2026-07-11_MLB_mil_pit',
    sides: ['away'],
    expectCommenceIso: '2026-07-11T20:06:00.000Z',
  },
];

for (const t of TARGETS) {
  const ref = db.collection(t.col).doc(t.id);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`MISSING ${t.col}/${t.id}`);
    continue;
  }
  const d = snap.data();
  const ctIso = new Date(d.commenceTime).toISOString();
  console.log(`\n${t.col}/${t.id}`);
  console.log(`  commence=${ctIso} status=${d.status}`);
  for (const sk of t.sides) {
    const s = d.sides?.[sk];
    console.log(`  side.${sk}: status=${s?.status} outcome=${s?.result?.outcome} profit=${s?.result?.profit} units=${s?.finalUnits} lockStage=${s?.lockStage}`);
  }
  if (ctIso !== t.expectCommenceIso) {
    console.error(`  REFUSING — commenceTime mismatch (expected ${t.expectCommenceIso})`);
    continue;
  }

  const updates = {
    status: 'PENDING',
    'result.awayScore': del,
    'result.homeScore': del,
    'result.winner': del,
    'result.source': del,
    'result.outcome': del,
    'result.profit': del,
    'result.gradedAt': del,
  };
  for (const sk of t.sides) {
    updates[`sides.${sk}.status`] = 'PENDING';
    updates[`sides.${sk}.result`] = del;
  }

  if (DRY) {
    console.log('  DRY — would update:', Object.keys(updates).join(', '));
  } else {
    await ref.update(updates);
    const after = (await ref.get()).data();
    console.log(`  RESET → docStatus=${after.status}`);
    for (const sk of t.sides) {
      const s = after.sides?.[sk];
      console.log(`  side.${sk}: status=${s?.status} result=${JSON.stringify(s?.result ?? null)} lockStage=${s?.lockStage}`);
    }
  }
}

console.log(DRY ? '\nDry run done.' : '\nDone. Re-open Sharp Flow — Over 8.5 should show LOCKED / waiting on Game 2.');
process.exit(0);
