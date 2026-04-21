import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
}
const db = admin.firestore();

async function probeCollection(coll) {
  console.log(`\n=== ${coll} — full date span ===`);
  const oldest = await db.collection(coll).orderBy('date', 'asc').limit(1).get();
  const newest = await db.collection(coll).orderBy('date', 'desc').limit(1).get();
  const oldDate = oldest.docs[0]?.data().date;
  const newDate = newest.docs[0]?.data().date;
  console.log(` oldest date: ${oldDate}`);
  console.log(` newest date: ${newDate}`);

  // Count per-date across entire collection
  const snap = await db.collection(coll).get();
  const byDate = new Map();
  for (const d of snap.docs) {
    const dd = d.data().date;
    byDate.set(dd, (byDate.get(dd) || 0) + 1);
  }
  const dates = [...byDate.keys()].sort();
  console.log(` total docs: ${snap.size}  |  unique dates: ${dates.length}`);
  console.log(` first 5: ${dates.slice(0, 5).join(', ')}`);
  console.log(` last 5:  ${dates.slice(-5).join(', ')}`);

  // Pick a VERY old doc (beginning of sample) and inspect its shape
  console.log(`\n--- ${coll} — pre-V8 doc shape (oldest date: ${oldDate}) ---`);
  const sample = await db.collection(coll).where('date', '==', oldDate).limit(2).get();
  sample.forEach(d => {
    const data = d.data();
    console.log(` doc: ${d.id}`);
    for (const [sk, sd] of Object.entries(data.sides || {})) {
      const lk = sd.lock || {};
      const pk = sd.peak || {};
      console.log(`   side=${sk} lockStage=${sd.lockStage} outcome=${sd.result?.outcome}`);
      console.log(`     lock keys: ${Object.keys(lk).join(', ')}`);
      console.log(`     peak keys: ${Object.keys(pk).join(', ')}`);
      if (lk.walletProfile || pk.walletProfile) {
        const wp = lk.walletProfile || pk.walletProfile;
        console.log(`     walletProfile type: ${typeof wp} · keys: ${typeof wp === 'object' ? Object.keys(wp).slice(0, 10).join(',') : '(scalar)'}`);
        console.log(`     walletProfile sample: ${JSON.stringify(wp).slice(0, 400)}`);
      }
      if (lk.opposition || pk.opposition) {
        console.log(`     opposition sample: ${JSON.stringify(lk.opposition || pk.opposition).slice(0, 200)}`);
      }
      if (lk.consensusStrength) console.log(`     consensusStrength: ${JSON.stringify(lk.consensusStrength)}`);
      if (lk.v8Scoring) console.log(`     v8Scoring: PRESENT  keys: ${Object.keys(lk.v8Scoring).join(',')}`);
      else console.log(`     v8Scoring: absent`);
    }
  });
}

async function main() {
  for (const coll of ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals']) {
    await probeCollection(coll);
  }

  // Check when v8Scoring first appears in sharpFlowPicks
  console.log(`\n=== When does v8Scoring first appear on sharpFlowPicks? ===`);
  const snap = await db.collection('sharpFlowPicks').get();
  const firstV8ByDate = new Map();
  const totalByDate = new Map();
  for (const d of snap.docs) {
    const data = d.data();
    const dt = data.date;
    if (!dt) continue;
    totalByDate.set(dt, (totalByDate.get(dt) || 0) + 1);
    let has = false;
    for (const [, sd] of Object.entries(data.sides || {})) {
      if (sd.lock?.v8Scoring || sd.peak?.v8Scoring) { has = true; break; }
    }
    if (has) firstV8ByDate.set(dt, (firstV8ByDate.get(dt) || 0) + 1);
  }
  const dates = [...totalByDate.keys()].sort();
  console.log(' date       | total docs | with v8Scoring');
  for (const d of dates) {
    console.log(` ${d} |  ${String(totalByDate.get(d)).padStart(4)}      |   ${String(firstV8ByDate.get(d) || 0).padStart(4)}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
