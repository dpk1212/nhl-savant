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
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const cols = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
for (const [col, market] of cols) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const teams = `${d.away} @ ${d.home}`;
    if (!teams.toLowerCase().includes('laker') && !teams.toLowerCase().includes('thunder')) continue;
    const sides = d.sides || {};
    for (const [sideKey, side] of Object.entries(sides)) {
      const peak = side.peak || side.lock || {};
      console.log('═══════════════════════════════════════════════════════════════════');
      console.log(`  ${market} | ${teams} | side=${sideKey} | team=${side.team}`);
      console.log('───────────────────────────────────────────────────────────────────');
      console.log(`  lockStage          : ${side.lockStage}`);
      console.log(`  promotedBy         : ${side.promotedBy ?? '—'}`);
      console.log(`  health.status      : ${side.health?.status}`);
      console.log(`  health.reason      : ${side.health?.reason ?? '—'}`);
      console.log(`  mutedBy            : ${side.mutedBy ?? '—'}`);
      console.log(`  superseded         : ${!!side.superseded}`);
      console.log(`  v8_lockTier        : ${side.v8_lockTier ?? '—'}`);
      console.log(`  peak.stars / units : ${peak.stars} / ${peak.units}u`);
      console.log(`  v8_walletCons.Δ    : ${side.v8_walletConsensusDelta ?? '—'}`);
      console.log(`  v8_hcMargin        : ${side.v8_hcMargin ?? '—'}  (For=${side.v8_hcConfFor ?? '—'} Ag=${side.v8_hcConfAg ?? '—'})`);
      console.log(`  v8_hcMarginEffect. : ${side.v8_hcMarginEffective ?? '—'}`);
      console.log(`  v8_ags             : ${side.v8_ags ?? '—'}  tier=${side.v8_agsTier ?? '—'}  q=${side.v8_agsQuintile ?? '—'}`);
      console.log(`  v8_agsProvenFor/Ag : ${side.v8_agsProvenForCount ?? '—'} / ${side.v8_agsProvenAgCount ?? '—'}`);
      console.log(`  v8_agsCalibSrc     : ${side.v8_agsCalibrationSource ?? '—'}`);
      console.log(`  v8_agsUnitsBase    : ${side.v8_agsUnitsBase ?? '—'}  applied=${side.v8_agsUnitsApplied ?? '—'}  mult=${side.v8_agsUnitsMult ?? '—'}`);
      console.log(`  liveStars/Units    : ${side.liveStars ?? '—'} / ${side.liveUnits ?? '—'}`);
      console.log(`  liveTier           : ${side.liveTier ?? '—'}`);
      console.log(`  evaluatedAt        : ${side.evaluatedAt ? new Date(side.evaluatedAt._seconds * 1000).toISOString() : '—'}`);
    }
  }
}
process.exit(0);
