// Audit MLB Model Picks grading coverage.
//
// Question: when the dashboard shows "159 graded · 85-74", is that the true
// record, or are picks stuck in PENDING and silently missing from the count?
//
// Reads `mlb_bets` Firestore collection (the same collection MLB.jsx queries),
// applies the same filters the UI uses to count "graded picks", and reports:
//   - shipped_total : non-EVALUATION + isLocked    (the universe)
//   - graded        : status == COMPLETED with result.outcome  (UI-counted)
//   - pending_old   : status != COMPLETED & game finished > 6h ago (LEAK!)
//   - pending_recent: status != COMPLETED & game finished < 6h ago (in-flight)
//   - pending_future: game hasn't started (correctly pending)
//   - missing_codes : PENDING with no awayCode/homeCode (grader can't match)
//   - no_outcome    : COMPLETED but outcome is null/empty (UI excludes)
//
// Usage:  node scripts/_audit_mlb_grading.mjs
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
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
const db = admin.firestore();

const NOW = Date.now();
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

const buckets = {
  shipped_total: 0,
  evaluations: 0,
  not_locked: 0,
  graded: 0,            // COMPLETED + outcome (UI counts these)
  graded_no_outcome: 0, // COMPLETED but outcome falsy (UI EXCLUDES — leak)
  pending_future: 0,    // game hasn't started
  pending_recent: 0,    // game ended < 6h ago — grader will catch on next run
  pending_old: 0,       // game ended > 6h ago — STUCK, real gap
  missing_codes: 0,     // pending + no awayCode/homeCode (grader can't match)
};

const records = {
  graded_outcomes: { WIN: 0, LOSS: 0, PUSH: 0, OTHER: 0 },
  units_won: 0,
  pending_old_ids: [],
  pending_old_no_codes: [],
  graded_no_outcome_ids: [],
};

const snap = await db.collection('mlb_bets').get();
console.log(`mlb_bets total docs: ${snap.size}`);

for (const doc of snap.docs) {
  const b = doc.data();

  if (b.type === 'EVALUATION') {
    buckets.evaluations++;
    continue;
  }
  if (!b.isLocked) {
    buckets.not_locked++;
    continue;
  }

  buckets.shipped_total++;

  const ct = b.game?.commenceTime;
  const gameStart = ct ? new Date(ct).getTime() : null;
  const gameEndApprox = gameStart ? gameStart + 4 * 60 * 60 * 1000 : null; // ~4h baseball game

  if (b.status === 'COMPLETED') {
    if (b.result?.outcome) {
      buckets.graded++;
      const oc = String(b.result.outcome).toUpperCase();
      if (oc === 'WIN') records.graded_outcomes.WIN++;
      else if (oc === 'LOSS' || oc === 'LOSE') records.graded_outcomes.LOSS++;
      else if (oc === 'PUSH') records.graded_outcomes.PUSH++;
      else records.graded_outcomes.OTHER++;
      records.units_won += (b.result?.profit ?? 0);
    } else {
      buckets.graded_no_outcome++;
      records.graded_no_outcome_ids.push(doc.id);
    }
    continue;
  }

  // not COMPLETED → PENDING-ish
  const hasCodes = !!(b.game?.awayCode && b.game?.homeCode);
  if (!hasCodes) buckets.missing_codes++;

  if (gameStart && gameStart > NOW) {
    buckets.pending_future++;
  } else if (gameEndApprox && (NOW - gameEndApprox) < SIX_HOURS_MS) {
    buckets.pending_recent++;
  } else {
    buckets.pending_old++;
    records.pending_old_ids.push(doc.id);
    if (!hasCodes) records.pending_old_no_codes.push(doc.id);
  }
}

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  MLB MODEL PICKS — GRADING AUDIT');
console.log('══════════════════════════════════════════════════════════════\n');

console.log('Universe filter applied (matches MLB.jsx loadPerfData):');
console.log('  - exclude type === "EVALUATION"');
console.log('  - exclude !isLocked');
console.log('  - "graded" = status === "COMPLETED" && result.outcome truthy\n');

console.log('Counts:');
console.log(`  shipped_total      : ${buckets.shipped_total}  (locked, non-EVALUATION)`);
console.log(`  graded (UI-counted): ${buckets.graded}  ← dashboard "GRADED BETS"`);
console.log(`     WIN / LOSS / PUSH / OTHER : ${records.graded_outcomes.WIN} / ${records.graded_outcomes.LOSS} / ${records.graded_outcomes.PUSH} / ${records.graded_outcomes.OTHER}`);
console.log(`     units_won (sum profit): ${records.units_won.toFixed(2)}u`);
console.log(`  pending_future     : ${buckets.pending_future}  (game not started — correct)`);
console.log(`  pending_recent     : ${buckets.pending_recent}  (game ended < 6h ago — grader will catch)`);
console.log(`  pending_old        : ${buckets.pending_old}  ← STUCK GAP (game finished > 6h ago, never graded)`);
console.log(`  missing_codes      : ${buckets.missing_codes}  (no awayCode/homeCode — grader can't match)`);
console.log(`  graded_no_outcome  : ${buckets.graded_no_outcome}  (status COMPLETED but outcome empty — UI silently drops)`);
console.log(`\nReference (excluded by UI):`);
console.log(`  evaluations        : ${buckets.evaluations}  (type === EVALUATION)`);
console.log(`  not_locked         : ${buckets.not_locked}  (isLocked === false)`);

console.log(`\nGAP ANALYSIS:`);
const truePicks = buckets.shipped_total - buckets.pending_future - buckets.pending_recent;
const lostPicks = buckets.pending_old + buckets.graded_no_outcome;
console.log(`  Picks that SHOULD be graded by now: ${truePicks}  (shipped_total − pending_future − pending_recent)`);
console.log(`  Picks actually showing in UI       : ${buckets.graded}`);
console.log(`  MISSING (silently dropped)         : ${lostPicks}`);
console.log(`  → ${buckets.pending_old} stuck PENDING + ${buckets.graded_no_outcome} COMPLETED w/ no outcome`);

if (records.pending_old_ids.length) {
  console.log(`\nFirst 25 stuck-PENDING ids:`);
  for (const id of records.pending_old_ids.slice(0, 25)) console.log(`  - ${id}`);
  if (records.pending_old_ids.length > 25) console.log(`  …and ${records.pending_old_ids.length - 25} more`);
}
if (records.pending_old_no_codes.length) {
  console.log(`\nOf those, ${records.pending_old_no_codes.length} are MISSING awayCode/homeCode (grader skip-loops on them).`);
}
if (records.graded_no_outcome_ids.length) {
  console.log(`\nFirst 25 COMPLETED-but-no-outcome ids:`);
  for (const id of records.graded_no_outcome_ids.slice(0, 25)) console.log(`  - ${id}`);
}

process.exit(0);
