/**
 * fixLeanTierSizing.js
 *
 * v7.0 production hotfix. Zeroes peak.units / lock.units on every locked
 * side whose live (stamped) Δw / Δq classifies as LEAN tier (Δw≥+1 ∧
 * Δq≥+1 ∧ Δw+Δq ∈ {3,4}).
 *
 * Why this exists
 * ---------------
 * SharpFlow.jsx::syncPickToFirebase + syncSpreadPickToFirebase +
 * syncTotalPickToFirebase clamp `bumpedUnits = Math.max(units, 0.5)` and
 * gate peak writes on `bumpedUnits > currentPeak`. Two consequences for
 * v7.0 LEAN picks:
 *
 *   1. New LEAN picks: calculateUnits() returns 0 (correct). The clamp
 *      pushes that back up to 0.5u, which then gets stamped on peak.units
 *      and lock.units. Result: LEAN ships at 0.5u instead of 0u.
 *   2. Pre-v7.0 picks (or picks first synced under v6.6 logic before the
 *      4/29 deploy): peak.units already holds the v6.6 sizing (1u, 2u,
 *      3u). When v7.0 syncs run, the clamped 0.5u is < currentPeak, so
 *      the IF branch never fires and peak.units never decays. Result:
 *      stale v6.6 sizing rides into grading.
 *
 * The source-side fix (drop the floor + allow LEAN to override the
 * monotonic-peak rule) is shipping in SharpFlow.jsx in this same patch.
 * This script handles the already-stamped picks for today's slate so
 * grading tonight registers them at 0u.
 *
 * Scope
 * -----
 * Only touches sides where:
 *   - lockStage === 'LOCKED' (SHADOW sides are already 0u)
 *   - status !== 'COMPLETED' (don't rewrite history)
 *   - !superseded (the side is the live consensus)
 *   - v8_walletConsensus* stamps exist (need Δw / Δq to classify)
 *   - lockTier(Δw, Δq) === 'LEAN'
 *   - peak.units > 0 OR lock.units > 0 (otherwise no-op)
 *
 * Writes (per-side merge):
 *   sides.{side}.peak.units      = 0
 *   sides.{side}.peak.unitTier   = 'TRACKED'
 *   sides.{side}.lock.units      = 0
 *   sides.{side}.lock.unitTier   = 'TRACKED'
 *   sides.{side}.v8_lockTier     = 'LEAN'   (stamp-or-restamp)
 *   doc.lastWriteAt / doc.lastAction = 'lean_sizing_fix'
 *
 * Usage:
 *   node scripts/fixLeanTierSizing.js                 # today (ET), dry-run
 *   node scripts/fixLeanTierSizing.js --apply         # today, actually write
 *   node scripts/fixLeanTierSizing.js 2026-04-30      # explicit date, dry
 *   node scripts/fixLeanTierSizing.js 2026-04-29 2026-04-30 --apply
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
const db = admin.firestore();

const argv = process.argv.slice(2);
const flags = argv.filter(a => a.startsWith('--'));
const positional = argv.filter(a => !a.startsWith('--'));
const APPLY = flags.includes('--apply');
const VERBOSE = flags.includes('--verbose') || flags.includes('-v');

const todayET = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

function dateRange(start, end) {
  const out = [];
  const d = new Date(start + 'T00:00:00Z');
  const endD = new Date(end + 'T00:00:00Z');
  while (d <= endD) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

const dates = positional.length === 0 ? [todayET()]
  : positional.length === 1 ? [positional[0]]
  : dateRange(positional[0], positional[1]);

const COLLECTIONS = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

// Mirrors src/pages/SharpFlow.jsx::lockTierFromDeltas exactly.
function lockTierFromDeltas(dw, dq) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return 'MUTED';
  if (dw < 1 || dq < 1) return 'MUTED';
  const sum = dw + dq;
  if (sum >= 7) return 'ELITE';
  if (sum >= 5) return 'LOCKED';
  if (sum >= 3) return 'LEAN';
  return 'MUTED';
}

const summary = {
  scanned: 0,
  candidates: 0,         // LOCKED sides we considered
  leanFound: 0,          // sides that classify as LEAN
  alreadyZero: 0,        // LEAN sides already at 0u (no patch needed)
  patched: 0,            // sides actually rewritten
  patchesByCol: { sharpFlowPicks: 0, sharpFlowSpreads: 0, sharpFlowTotals: 0 },
  unitsReclaimed: 0,     // total peak.units we zeroed out (sanity-check magnitude)
};

const rows = [];

async function processCollection(col, date) {
  const snap = await db.collection(col).where('date', '==', date).get();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.status === 'COMPLETED') continue;
    const sides = data.sides || {};
    for (const [sideKey, sd] of Object.entries(sides)) {
      summary.scanned++;
      if (!sd) continue;
      if (sd.lockStage !== 'LOCKED') continue;
      if (sd.superseded) continue;
      if (sd.status === 'COMPLETED') continue;
      summary.candidates++;

      const dw = sd.v8_walletConsensusDelta;
      const dq = sd.v8_walletConsensusQualityMargin;
      if (!Number.isFinite(dw) || !Number.isFinite(dq)) continue;
      const tier = lockTierFromDeltas(dw, dq);
      if (tier !== 'LEAN') continue;
      summary.leanFound++;

      const peakUnits = sd.peak?.units ?? 0;
      const lockUnits = sd.lock?.units ?? 0;
      const stampedTier = sd.v8_lockTier ?? null;

      const needsZero = peakUnits > 0 || lockUnits > 0;
      const needsTierStamp = stampedTier !== 'LEAN';

      if (!needsZero && !needsTierStamp) {
        summary.alreadyZero++;
        continue;
      }

      rows.push({
        col,
        docId: doc.id,
        sport: data.sport || '?',
        gameKey: data.gameKey || doc.id,
        sideKey,
        team: sd.team || sd.lock?.team || sideKey,
        commenceTime: data.commenceTime || null,
        dw, dq, sum: dw + dq,
        peakUnits, lockUnits,
        stampedTier,
        peakStars: sd.peak?.stars ?? null,
      });

      if (APPLY) {
        const patch = {
          sides: {
            [sideKey]: {
              ...(needsZero ? {
                peak: { units: 0, unitTier: 'TRACKED' },
                lock: { units: 0, unitTier: 'TRACKED' },
              } : {}),
              v8_lockTier: 'LEAN',
            },
          },
          lastWriteAt: Date.now(),
          lastAction: 'lean_sizing_fix',
        };
        await doc.ref.set(patch, { merge: true });
      }

      summary.patched++;
      summary.patchesByCol[col]++;
      summary.unitsReclaimed += peakUnits;
    }
  }
}

(async () => {
  console.log(`[fixLeanTierSizing] mode=${APPLY ? 'APPLY' : 'DRY-RUN'} dates=[${dates.join(', ')}]`);
  for (const date of dates) {
    for (const col of COLLECTIONS) {
      await processCollection(col, date);
    }
  }

  // Pretty-print the affected sides so we can sanity-check before --apply.
  if (rows.length === 0) {
    console.log('\n  No LEAN-tier sides need fixing. ✓');
  } else {
    console.log(`\n  ${rows.length} LEAN side${rows.length === 1 ? '' : 's'} ${APPLY ? 'patched' : 'WOULD be patched'}:\n`);
    const header = ['col', 'sport', 'gameKey', 'side', 'team', 'Δw', 'Δq', 'Σ', 'peak.u', 'lock.u', 'stars', 'lockTier(was)'];
    console.log('  ' + header.join('\t'));
    console.log('  ' + header.map(() => '---').join('\t'));
    for (const r of rows) {
      console.log('  ' + [
        r.col.replace('sharpFlow', '').slice(0, 6),
        r.sport,
        r.gameKey.slice(-30),
        r.sideKey,
        r.team,
        r.dw >= 0 ? `+${r.dw}` : `${r.dw}`,
        r.dq >= 0 ? `+${r.dq}` : `${r.dq}`,
        r.sum,
        r.peakUnits.toFixed(2),
        r.lockUnits.toFixed(2),
        r.peakStars ?? '-',
        r.stampedTier ?? '-',
      ].join('\t'));
    }
  }

  console.log('\n[fixLeanTierSizing] summary:');
  console.log(`  scanned sides:       ${summary.scanned}`);
  console.log(`  LOCKED candidates:   ${summary.candidates}`);
  console.log(`  LEAN tier matches:   ${summary.leanFound}`);
  console.log(`    already-zeroed:    ${summary.alreadyZero}`);
  console.log(`    ${APPLY ? 'patched' : 'WOULD patch'}:        ${summary.patched}`);
  console.log(`      sharpFlowPicks:   ${summary.patchesByCol.sharpFlowPicks}`);
  console.log(`      sharpFlowSpreads: ${summary.patchesByCol.sharpFlowSpreads}`);
  console.log(`      sharpFlowTotals:  ${summary.patchesByCol.sharpFlowTotals}`);
  console.log(`  total units zeroed:  ${summary.unitsReclaimed.toFixed(2)}u (peak.units sum on patched sides)`);

  if (!APPLY && summary.patched > 0) {
    console.log('\n  Re-run with --apply to commit these patches.');
  }

  process.exit(0);
})().catch((err) => {
  console.error('[fixLeanTierSizing] FATAL', err);
  process.exit(1);
});
