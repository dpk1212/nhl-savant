import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'))) });
}
const db = admin.firestore();

const today = '2026-05-09';
const snap = await db.collection('sharpFlowSpreads')
  .where('date', '==', today)
  .where('sport', '==', 'NBA')
  .get();

console.log(`Found ${snap.size} NBA spread docs for ${today}\n`);
snap.forEach(doc => {
  const d = doc.data();
  const sides = Object.entries(d.sides || {}).map(([k, s]) => ({
    side: k, team: s.team,
    lockStage: s.lockStage, superseded: s.superseded,
    promotedBy: s.promotedBy, contribTier: s.contribTier,
    health: s.health?.status,
    'peak.stars': s.peak?.stars, 'peak.units': s.peak?.units,
    'peak.totalInvested': s.peak?.totalInvested,
    'lock.stars': s.lock?.stars, 'lock.units': s.lock?.units,
    'lock.totalInvested': s.lock?.totalInvested,
    v8_lockTier: s.v8_lockTier, v8_systemVersion: s.v8_systemVersion,
    v8_walletConsensusDelta: s.v8_walletConsensusDelta,
    v8_walletConsensusForW: s.v8_walletConsensusForW,
    v8_walletConsensusAgW: s.v8_walletConsensusAgW,
    v8_walletConsensusQualityMargin: s.v8_walletConsensusQualityMargin,
    v8_hcConfFor: s.v8_hcConfFor, v8_hcConfAg: s.v8_hcConfAg,
  }));
  console.log(`${doc.id}  status=${d.status}`);
  console.log(JSON.stringify(sides, null, 2));
  console.log('---');
});
process.exit(0);
