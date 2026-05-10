/**
 * Quick one-shot inspector for one Firestore pick doc.
 * Usage: node scripts/inspectOnePick.js <docId> [collection]
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
}
const db = admin.firestore();

const docId = process.argv[2];
const col   = process.argv[3] || 'sharpFlowPicks';
const snap = await db.collection(col).doc(docId).get();
if (!snap.exists) { console.log('not found'); process.exit(1); }
const d = snap.data();
console.log(JSON.stringify({
  id: snap.id,
  date: d.date,
  away: d.away, home: d.home,
  status: d.status,
  sides: Object.fromEntries(Object.entries(d.sides || {}).map(([k, s]) => [k, {
    team: s.team,
    lockStage: s.lockStage,
    superseded: s.superseded,
    health: s.health?.status,
    promotedBy: s.promotedBy,
    promotedAt: s.promotedAt ? new Date(s.promotedAt).toLocaleString('en-US', { timeZone: 'America/New_York' }) : null,
    'lock.units': s.lock?.units,
    'lock.stars': s.lock?.stars,
    'peak.units': s.peak?.units,
    'peak.stars': s.peak?.stars,
    'peak.odds':  s.peak?.odds,
    v8_systemVersion: s.v8_systemVersion,
    v8_lockTier: s.v8_lockTier,
    v8_walletConsensusVersion: s.v8_walletConsensusVersion,
    v8_walletConsensusForW: s.v8_walletConsensusForW,
    v8_walletConsensusAgW:  s.v8_walletConsensusAgW,
    v8_walletConsensusDelta: s.v8_walletConsensusDelta,
    v8_walletConsensusQualityForT30: s.v8_walletConsensusQualityForT30,
    v8_walletConsensusQualityAgT30:  s.v8_walletConsensusQualityAgT30,
    v8_walletConsensusQualityMargin: s.v8_walletConsensusQualityMargin,
    v8_hcDominant: s.v8_hcDominant,
    v8_hcConfFor:  s.v8_hcConfFor,
    v8_hcConfAg:   s.v8_hcConfAg,
    v8_topPick:      s.v8_topPick,
    v8_superTopPick: s.v8_superTopPick,
  }])),
}, null, 2));
process.exit(0);
