/**
 * Read-only census: today's four-sport tickets muted by edge-under-5.
 * Usage: node scripts/_census_edge_under5.mjs
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function initFirebase() {
  if (admin.apps.length) return admin.firestore();
  const sakPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(sakPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(fs.readFileSync(sakPath, 'utf8'))),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function sideLabel(doc, sideKey, sd) {
  return sd?.team
    || sd?.peak?.team
    || (sideKey === 'home' ? doc.home : sideKey === 'away' ? doc.away : sideKey)
    || sideKey;
}

function commenceMs(doc) {
  const ct = doc.commenceTime;
  if (typeof ct === 'number' && Number.isFinite(ct)) return ct;
  if (ct?.toMillis) return ct.toMillis();
  if (ct?._seconds) return ct._seconds * 1000;
  return null;
}

const db = initFirebase();
const now = Date.now();
const rows = [];

for (const [col, market] of COLLECTIONS) {
  const snap = await db.collection(col).where('date', '>=', '2026-11-05').get();
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    const sport = d.sport || null;
    const date = d.date || null;
    const ct = commenceMs(d);
    for (const [sideKey, sd] of Object.entries(d.sides || {})) {
      if (!sd || typeof sd !== 'object') continue;
      const action = sd.v8_edgeUnder5Action || null;
      const mutedBy = sd.mutedBy || null;
      if (action == null && mutedBy !== 'edge-under-5') continue;
      const units = Number(sd.finalUnits ?? sd.peak?.units ?? 0);
      rows.push({
        col,
        market: d.marketType || market,
        sport,
        date,
        id: doc.id,
        side: sideKey,
        team: sideLabel(d, sideKey, sd),
        matchup: [d.away, d.home].filter(Boolean).join(' @ ') || doc.id,
        action,
        clause: sd.v8_edgeUnder5Clause || null,
        mutedBy,
        units: Number.isFinite(units) ? units : 0,
        unitsPre: sd.v8_unitsPreEdgeUnder5 ?? null,
        edge: sd.v8_pressEdge ?? sd.peak?.v8_pressEdge ?? null,
        status: sd.health?.status || sd.status || null,
        lockStage: sd.lockStage || null,
        commenceMs: ct,
        started: ct != null ? ct <= now : null,
      });
    }
  }
}

const muted = rows.filter((r) => r.action === 'MUTE' || r.mutedBy === 'edge-under-5');
const held = rows.filter((r) => r.action === 'HOLD');
const liveMuted = muted.filter((r) => r.started === false);
const startedMuted = muted.filter((r) => r.started === true);

const report = {
  asOfEt: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  today: TODAY,
  mutedCount: muted.length,
  liveMutedCount: liveMuted.length,
  startedMutedCount: startedMuted.length,
  holdCount: held.length,
  muted,
  held,
};

console.log(JSON.stringify(report, null, 2));
console.log(`MUTED ${muted.length} (${liveMuted.length} not started, ${startedMuted.length} already started) · HOLD ${held.length}`);
process.exit(0);
