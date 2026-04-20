import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
if (!admin.apps.length) {
  const sakPath = join(__dirname, '../serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
}
const db = admin.firestore();

async function main() {
  const snap = await db.collection('sharpFlowPicks').where('date', '==', '2026-04-17').limit(3).get();
  snap.forEach(d => {
    const data = d.data();
    console.log('=== DOC:', d.id, 'date:', data.date, 'sport:', data.sport, '===');
    for (const [sk, sd] of Object.entries(data.sides || {})) {
      console.log('\nSIDE:', sk);
      console.log(' status:', sd.status, 'lockStage:', sd.lockStage, 'outcome:', sd.result?.outcome, 'superseded:', !!sd.superseded);
      const lk = sd.lock || sd;
      const pk = sd.peak || lk;
      console.log(' lock keys:', Object.keys(lk));
      console.log(' peak keys:', Object.keys(pk));
      if (lk.v8Scoring) console.log(' HAS v8Scoring');
      if (lk.sharps) console.log(' sharps sample:', JSON.stringify(lk.sharps).slice(0, 500));
      if (lk.topWallets) console.log(' topWallets sample:', JSON.stringify(lk.topWallets).slice(0, 500));
      if (lk.walletDetails) console.log(' walletDetails sample:', JSON.stringify(lk.walletDetails).slice(0, 500));
      if (lk.consensusStrength) console.log(' consensusStrength:', JSON.stringify(lk.consensusStrength));
    }
  });
}
main().catch(e => { console.error(e); process.exit(1); });
