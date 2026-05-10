/**
 * inspectLeanState.js — quick read-only sanity check.
 * Lists every side for a given date with lockStage, lockTier, peak.units,
 * and the v8_walletConsensus deltas. Used to verify fixLeanTierSizing.js
 * before applying. Throwaway diagnostic.
 *
 * Usage: node scripts/inspectLeanState.js [date]
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

const todayET = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

const date = process.argv[2] || todayET();

function lockTier(dw, dq) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return 'MUTED';
  if (dw < 1 || dq < 1) return 'MUTED';
  const sum = dw + dq;
  if (sum >= 7) return 'ELITE';
  if (sum >= 5) return 'LOCKED';
  if (sum >= 3) return 'LEAN';
  return 'MUTED';
}

const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];

(async () => {
  console.log(`Inspecting date=${date}\n`);
  for (const col of cols) {
    const snap = await db.collection(col).where('date', '==', date).get();
    console.log(`[${col}] ${snap.size} docs`);
    for (const doc of snap.docs) {
      const data = doc.data();
      const sport = data.sport || '?';
      const status = data.status;
      const sides = data.sides || {};
      const sideRows = Object.entries(sides).map(([k, sd]) => {
        const dw = sd.v8_walletConsensusDelta;
        const dq = sd.v8_walletConsensusQualityMargin;
        const tier = (Number.isFinite(dw) && Number.isFinite(dq)) ? lockTier(dw, dq) : '?';
        return `${k}:${sd.lockStage || '-'}/${tier}/Δw=${dw ?? '?'}/Δq=${dq ?? '?'}/peak.u=${sd.peak?.units ?? 0}/lock.u=${sd.lock?.units ?? 0}/super=${!!sd.superseded}/v8tier=${sd.v8_lockTier ?? '-'}`;
      });
      console.log(`  ${sport} ${doc.id} status=${status} sides=[${sideRows.join(' | ')}]`);
    }
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
