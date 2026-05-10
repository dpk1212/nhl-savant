/**
 * One-shot lookup for tonight's locked-pick stamps.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(join(REPO_ROOT, 'serviceAccountKey.json'), 'utf8'))) });
}
const db = admin.firestore();

const TARGETS = [
  { collection: 'sharpFlowPicks',  sport: 'NBA', teams: ['Lakers', 'Rockets'],   date: '2026-05-01', label: 'Rockets ML' },
  { collection: 'sharpFlowPicks',  sport: 'NBA', teams: ['Pistons', 'Magic'],    date: '2026-05-01', label: 'Magic ML' },
  { collection: 'sharpFlowPicks',  sport: 'NHL', teams: ['Lightning', 'Canadiens'], date: '2026-05-01', label: 'Lightning ML' },
  { collection: 'sharpFlowTotals', sport: 'NBA', teams: ['Pistons', 'Magic'],    date: '2026-05-01', label: 'Pistons/Magic OVER 209.5' },
];

for (const target of TARGETS) {
  console.log(`\n══════ ${target.label} (${target.collection}) ══════`);
  const snap = await db.collection(target.collection)
    .where('date', '==', target.date).where('sport', '==', target.sport).get();
  let matched = 0;
  for (const doc of snap.docs) {
    const d = doc.data();
    const teamMatch = target.teams.some(t => (d.away || '').includes(t) || (d.home || '').includes(t));
    if (!teamMatch) continue;
    matched++;
    console.log(`\nDoc: ${doc.id}`);
    console.log(`  ${d.away} @ ${d.home} · status=${d.status}`);
    for (const [sideKey, side] of Object.entries(d.sides || {})) {
      if (side.lockStage === 'SHADOW' || side.superseded) continue;
      const dw = side.v8_walletConsensusDelta;
      const dq = side.v8_walletConsensusQualityMargin;
      const hcF = side.v8_hcConfFor;
      const hcA = side.v8_hcConfAg;
      const hcM = (hcF != null && hcA != null) ? hcF - hcA : (side.v8_hcMargin ?? null);
      const sum = (dw ?? 0) + (dq ?? 0);
      console.log(`  ${sideKey} (${side.team}):`);
      console.log(`    stage=${side.lockStage} · tier=${side.v8_lockTier} · stars=${side.peak?.stars} · units=${side.peak?.units}`);
      console.log(`    Δw=${dw} · Δq=${dq} · Σ=${sum}`);
      console.log(`    HC for=${hcF} HC ag=${hcA} HC_m=${hcM} · hcDom=${side.v8_hcDominant}`);
      console.log(`    promotedBy=${side.promotedBy} · systemVersion=${side.v8_systemVersion}`);
      console.log(`    v73HcRescue=${side.v8_v73HcRescue}`);
      console.log(`    health=${side.health?.status || 'ACTIVE'}`);
    }
  }
  if (!matched) console.log('  (no matching docs)');
}

process.exit(0);
