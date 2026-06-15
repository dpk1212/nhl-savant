/**
 * v12.1 HC-margin staking — READ-ONLY dry-run / sanity preview.
 * ──────────────────────────────────────────────────────────────────────────
 * Prints, for recent LOCKED sharpFlow sides, the OLD score-quintile tier +
 * finalUnits next to the NEW v12.1 HC-margin stake tier + units, using the
 * already-stamped v8_agsV12 / v8_agsV12Tier / v8_hcMargin fields. Makes NO
 * Firestore writes — purely a "what will the cutover change?" report.
 *
 * Usage:
 *   node scripts/_v121_dryrun.mjs                 (last 14 days, all sides)
 *   node scripts/_v121_dryrun.mjs --date=2026-06-15
 *   node scripts/_v121_dryrun.mjs --days=30
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { agsV12HcStake } from '../src/lib/ags.js';

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

const argv = process.argv.slice(2);
const dateArg = argv.find(a => a.startsWith('--date='))?.split('=')[1] || null;
const DAYS = (() => {
  const a = argv.find(x => x.startsWith('--days='));
  return a ? parseInt(a.split('=')[1], 10) : 14;
})();

const PICK_COLLECTIONS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

// Same odds cap as the cron (scripts/syncPickStateAuthoritative.js).
function oddsCap(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}

function recentDateSet() {
  if (dateArg) return new Set([dateArg]);
  const out = new Set();
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(Date.now() - i * 86400000);
    out.add(d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }));
  }
  return out;
}

async function main() {
  const dates = recentDateSet();
  const rows = [];
  for (const [col] of PICK_COLLECTIONS) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!dates.has(data.date)) continue;
      const sides = data.sides || {};
      for (const [sideKey, sd] of Object.entries(sides)) {
        if (sd.lockStage !== 'LOCKED' || sd.superseded) continue;
        const score = Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null;
        if (score == null) continue;
        const scoreTier = sd.v8_agsV12Tier || null;
        const hcMargin = Number.isFinite(sd.v8_hcMargin)
          ? sd.v8_hcMargin
          : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0));
        const oldUnits = Number.isFinite(sd.finalUnits) ? sd.finalUnits : 0;
        const sideOdds = sd.peak?.odds ?? sd.lock?.odds ?? null;
        const { stakeTier, unitsRaw } = agsV12HcStake({ score, scoreTier, hcMargin });
        const newUnits = unitsRaw ? Math.round(oddsCap(unitsRaw, sideOdds) * 100) / 100 : 0;
        rows.push({
          date: data.date,
          pick: `${(sd.team || sideKey).substring(0, 18)}`,
          score, scoreTier, hcMargin,
          oldTier: scoreTier, oldUnits,
          newTier: stakeTier, newUnits,
          changed: stakeTier !== scoreTier || Math.abs(newUnits - oldUnits) >= 0.01,
        });
      }
    }
  }
  rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.hcMargin - a.hcMargin));

  console.log(`\nv12.1 DRY-RUN — ${rows.length} locked sides over ${dateArg ? dateArg : `${DAYS}d`} (NO writes)\n`);
  console.log(`| Date       | Pick               | V12   | HC | OLD tier/units      | NEW tier/units        | Δ |`);
  console.log(`|------------|--------------------|-------|----|----------------------|-----------------------|---|`);
  for (const r of rows) {
    const oldCell = `${(r.oldTier || '—').padEnd(8)} ${r.oldUnits.toFixed(2)}u`;
    const newCell = `${(r.newTier || '—').padEnd(10)} ${r.newUnits.toFixed(2)}u`;
    console.log(`| ${r.date.padEnd(10)} | ${r.pick.padEnd(18)} | ${(r.score >= 0 ? '+' : '') + r.score.toFixed(3)} | ${String(r.hcMargin).padStart(2)} | ${oldCell.padEnd(20)} | ${newCell.padEnd(21)} | ${r.changed ? '✱' : ' '} |`);
  }

  // Summary by new tier.
  const byTier = {};
  for (const r of rows) byTier[r.newTier] = (byTier[r.newTier] || 0) + 1;
  console.log(`\nNew stake-tier distribution:`);
  for (const t of ['SUPER', 'TOP', 'CONFIRMED', 'MONITORING', 'FADE']) {
    if (byTier[t]) console.log(`  ${t.padEnd(11)} ${byTier[t]}`);
  }
  const oldStaked = rows.filter(r => r.oldUnits > 0).length;
  const newStaked = rows.filter(r => r.newUnits > 0).length;
  console.log(`\nStaked sides: OLD ${oldStaked} → NEW ${newStaked}  (Monitoring 0u: ${rows.length - newStaked})`);
  console.log('');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
