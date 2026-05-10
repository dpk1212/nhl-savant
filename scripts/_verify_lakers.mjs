import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
if (!admin.apps.length) {
  const sak = '/Users/dalekolnitys/NHL Savant/nhl-savant/serviceAccountKey.json';
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const snap = await db.collection('sharpFlowSpreads').where('date', '==', TODAY).get();
for (const doc of snap.docs) {
  const d = doc.data();
  if (!`${d.away} ${d.home}`.toLowerCase().includes('laker')) continue;
  const sides = d.sides || {};
  for (const [k, side] of Object.entries(sides)) {
    if (side.team !== 'Lakers') continue;
    console.log('peak.stars=', side.peak?.stars, 'peak.units=', side.peak?.units);
    console.log('v8_walletConsensusDelta(dw)=', side.v8_walletConsensusDelta);
    console.log('v8_walletConsensusQualityMargin(dq)=', side.v8_walletConsensusQualityMargin);
    console.log('v8_hcMargin=', side.v8_hcMargin);
    console.log('v8_ags=', side.v8_ags);
    console.log('v8_agsProvenForCount=', side.v8_agsProvenForCount);
    console.log('v8_agsProvenAgCount=', side.v8_agsProvenAgCount);
    console.log('server v8_agsUnitsBase=', side.v8_agsUnitsBase);
    console.log('server v8_agsUnitsApplied=', side.v8_agsUnitsApplied);
    console.log('server v8_agsUnitsMult=', side.v8_agsUnitsMult);
    console.log('odds=', side.peak?.odds ?? side.lock?.odds);
  }
}
process.exit(0);
