/**
 * One-shot lookup for today's HC margin on specific games.
 * Usage: node scripts/inspectByTeam.js
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
  { sport: 'NBA', teams: ['Nuggets', 'Timberwolves'], date: '2026-04-30' },
  { sport: 'NHL', teams: ['Oilers', 'Ducks'], date: '2026-04-30' },
];

for (const target of TARGETS) {
  console.log(`\n══════ ${target.sport} ${target.teams.join(' vs ')} (${target.date}) ══════`);
  const snap = await db.collection('sharpFlowPicks')
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
      const dw = side.v8_walletConsensusDelta;
      const dq = side.v8_walletConsensusQualityMargin;
      const hcF = side.v8_hcConfFor;
      const hcA = side.v8_hcConfAg;
      const hcM = (hcF != null && hcA != null) ? hcF - hcA : (side.v8_hcMargin ?? null);
      const ver = side.v8_systemVersion;
      const tier = side.v8_lockTier;
      console.log(`  ${sideKey} (${side.team}):`);
      console.log(`    state         : lockStage=${side.lockStage}  health=${side.health?.status || '—'}  superseded=${!!side.superseded}`);
      console.log(`    Δw / Δq / Σ  : ${dw ?? '—'} / ${dq ?? '—'} / ${(dw != null && dq != null) ? dw + dq : '—'}`);
      console.log(`    HC for/ag/m  : ${hcF ?? '—'} / ${hcA ?? '—'} / ${hcM ?? '—'}    hcDominant=${side.v8_hcDominant ?? '—'}`);
      console.log(`    version/tier : v${ver || '—'}  lockTier=${tier || '—'}`);
      console.log(`    promotedBy   : ${side.promotedBy || '—'}`);
      console.log(`    badges       : top=${side.v8_topPick ?? '—'} super=${side.v8_superTopPick ?? '—'}`);
      console.log(`    units (peak) : ${side.peak?.units ?? '—'}u   stars=${side.peak?.stars ?? '—'}`);
    }
  }
  if (!matched) console.log('  (no matching doc found)');
}
process.exit(0);
