import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
if (existsSync(sakPath)) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
} else {
  initializeApp({
    credential: cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const TARGET_DATE = '2026-05-02';
const collections = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

function meetsV74(dw, dq, hc) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return false;
  const sum = dw + dq;
  const hcRoute = hc >= 1 && dw >= 0 && dq >= 0;
  const sumRoute = dw >= 1 && dq >= 1 && sum >= 5;
  return hcRoute || sumRoute;
}

const summary = { total: 0, locked: 0, shadow: 0, displayed: 0, hidden_by_floor: 0 };
const sides = [];

for (const col of collections) {
  const snap = await db.collection(col).where('date', '==', TARGET_DATE).get();
  for (const docSnap of snap.docs) {
    const d = docSnap.data();
    for (const [sideKey, sd] of Object.entries(d.sides || {})) {
      if (!sd) continue;
      summary.total++;
      const lockStage = sd.lockStage;
      if (lockStage === 'LOCKED' || lockStage === 'LEAN') summary.locked++;
      if (lockStage === 'SHADOW') summary.shadow++;

      const dw = sd.v8_walletConsensusDelta;
      const dq = sd.v8_walletConsensusQualityMargin;
      const hc = sd.v8_hcMargin ?? ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0));
      const passes = meetsV74(dw, dq, hc);
      const isCancelled = sd.health?.status === 'CANCELLED';
      const isCompleted = d.status === 'COMPLETED' || sd.status === 'COMPLETED';

      sides.push({
        col, doc: docSnap.id, side: sideKey,
        team: sd.peak?.team || (sideKey === 'away' ? d.away : sideKey === 'home' ? d.home : sideKey),
        sport: d.sport, lockStage, status: sd.health?.status,
        dw, dq, hc, passes, isCancelled, isCompleted,
        syncedBy: sd.health?.syncedBy,
        lastSync: d.lastSyncAt ? new Date(d.lastSyncAt).toISOString() : null,
        units: sd.peak?.units ?? sd.lock?.units,
        promotedBy: sd.promotedBy,
      });

      if ((lockStage === 'LOCKED' || lockStage === 'LEAN') && !sd.superseded && !isCancelled && passes && !isCompleted) {
        summary.displayed++;
      }
      if ((lockStage === 'LOCKED' || lockStage === 'LEAN') && !passes && !isCompleted) {
        summary.hidden_by_floor++;
      }
    }
  }
}

console.log('\n========== TODAY (', TARGET_DATE, ') AUDIT ==========\n');
console.log('Total sides examined:    ', summary.total);
console.log('lockStage = LOCKED/LEAN: ', summary.locked);
console.log('lockStage = SHADOW:      ', summary.shadow);
console.log('LOCKED but fails v7.4:   ', summary.hidden_by_floor, '(would be hidden)');
console.log('Currently SHOULD display:', summary.displayed);

console.log('\n========== ALL SIDES ==========\n');
for (const s of sides) {
  const reasonTag = !s.passes
    ? (s.dw <= -2 ? 'CANCEL' : `BELOW_FLOOR(dw=${s.dw} dq=${s.dq} HC=${s.hc})`)
    : (s.hc >= 1 ? `HC_ROUTE(HC=${s.hc} dw=${s.dw} dq=${s.dq})` : `SUM_ROUTE(Σ=${s.dw + s.dq})`);
  const display = s.lockStage === 'SHADOW' ? '∅ HIDDEN' :
                  s.isCompleted ? '✓ GRADED' :
                  s.isCancelled ? '⊘ CANCELLED-toggle' :
                  !s.passes ? '✗ HIDDEN(stale)' :
                  '★ DISPLAYED';
  console.log(`${display}  ${s.sport.padEnd(4)} ${s.col.replace('sharpFlow','').padEnd(8)} ${s.team.padEnd(28)} stage=${(s.lockStage||'∅').padEnd(7)} hp=${(s.status||'∅').padEnd(10)} ${reasonTag}`);
}
process.exit(0);
