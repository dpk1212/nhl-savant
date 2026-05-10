// Clean up duplicate docs created by the cron's create-missing pass with
// wrong docId convention (no _spread / _total suffix). Identifies any
// SPREAD/TOTAL doc whose ID lacks the suffix AND was created by the cron.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

async function findBadDocsIn(col, expectedSuffix) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  const bad = [];
  for (const d of snap.docs) {
    const data = d.data();
    if (data.source !== 'cron-auto-create') continue;
    if (d.id.endsWith(expectedSuffix)) continue;
    bad.push({ id: d.id, data });
  }
  return bad;
}

const badSpreads = await findBadDocsIn('sharpFlowSpreads', '_spread');
const badTotals  = await findBadDocsIn('sharpFlowTotals',  '_total');

console.log(`\nDuplicate docs (cron-auto-create with wrong ID):`);
console.log(`  sharpFlowSpreads (missing _spread): ${badSpreads.length}`);
for (const b of badSpreads) console.log(`    - ${b.id} (gameKey=${b.data.gameKey})`);
console.log(`  sharpFlowTotals (missing _total):  ${badTotals.length}`);
for (const b of badTotals) console.log(`    - ${b.id} (gameKey=${b.data.gameKey})`);

if (!APPLY) {
  console.log(`\n[dry run] Pass --apply to actually delete.`);
  process.exit(0);
}

let deleted = 0;
for (const b of badSpreads) {
  await db.collection('sharpFlowSpreads').doc(b.id).delete();
  console.log(`  deleted sharpFlowSpreads/${b.id}`);
  deleted++;
}
for (const b of badTotals) {
  await db.collection('sharpFlowTotals').doc(b.id).delete();
  console.log(`  deleted sharpFlowTotals/${b.id}`);
  deleted++;
}
console.log(`\nDone — deleted ${deleted} duplicate doc(s).`);
process.exit(0);
