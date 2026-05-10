// Delete cron-auto-create docs whose commenceTime is NOT today (ET).
// This catches the bug where the create-missing pass wrote picks for
// tomorrow's games under today's date prefix because polymarket_data.json
// contains multiple days of games.
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
const APPLY = process.argv.includes('--apply');

const bad = [];
for (const col of ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals']) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const d of snap.docs) {
    const data = d.data();
    let ct = data.commenceTime;
    if (ct?._seconds) ct = ct._seconds * 1000;
    if (!ct) continue;
    const gameDateET = new Date(ct).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    if (gameDateET === TODAY) continue;
    // Wrong-date doc — game is NOT today. Identify cron-created ones via
    // either top-level source or side-level cronCreated flag (latter
    // survives overwrites by other pipelines like updateClosingOdds).
    const isCronCreated = data.source === 'cron-auto-create'
      || Object.values(data.sides || {}).some(sd => sd?.cronCreated === true);
    bad.push({ col, id: d.id, ct, gameDateET, source: data.source, isCronCreated });
  }
}

console.log(`\nWrong-date docs (date=${TODAY} but game NOT on ${TODAY}):`);
for (const b of bad) {
  const flag = b.isCronCreated ? '★cron' : '';
  console.log(`  ${b.col}/${b.id} → game ${b.gameDateET} (${new Date(b.ct).toLocaleString('en-US',{timeZone:'America/New_York'})}) ${flag}`);
}

if (!APPLY) { console.log('\n[dry run] pass --apply to delete (only cron-created docs are deleted)'); process.exit(0); }
let deleted = 0;
for (const b of bad) {
  if (!b.isCronCreated) {
    console.log(`  [skipped] ${b.col}/${b.id} (not cron-created — leave for owner pipeline)`);
    continue;
  }
  await db.collection(b.col).doc(b.id).delete();
  console.log(`  deleted ${b.col}/${b.id}`);
  deleted++;
}
console.log(`\nDeleted ${deleted} wrong-date doc(s) (kept ${bad.length - deleted} non-cron docs).`);
process.exit(0);
