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

async function main() {
  // Deep-inspect the very oldest ML picks — print full walletProfile + opposition structure
  console.log(`=== Oldest sharpFlowPicks walletProfile deep dive ===`);
  for (const dt of ['2026-03-16', '2026-03-25', '2026-04-01', '2026-04-10', '2026-04-17']) {
    console.log(`\n---- date=${dt} ----`);
    const snap = await db.collection('sharpFlowPicks').where('date', '==', dt).limit(2).get();
    snap.forEach(d => {
      const data = d.data();
      console.log(`DOC: ${d.id} sport=${data.sport}`);
      for (const [sk, sd] of Object.entries(data.sides || {})) {
        const peak = sd.peak || sd.lock;
        console.log(`  SIDE=${sk} lockStage=${sd.lockStage} outcome=${sd.result?.outcome}`);
        if (peak?.walletProfile) {
          const wp = peak.walletProfile;
          console.log(`    walletProfile type=${typeof wp} isArray=${Array.isArray(wp)}`);
          console.log(`    walletProfile full:`, JSON.stringify(wp, null, 2).slice(0, 800));
        } else {
          console.log(`    walletProfile: (absent)`);
        }
        if (peak?.opposition) {
          console.log(`    opposition:`, JSON.stringify(peak.opposition).slice(0, 300));
        }
        if (peak?.sharps) {
          console.log(`    sharps:`, JSON.stringify(peak.sharps).slice(0, 300));
        }
      }
    });
  }

  // Check for any collection that might hold historical per-wallet positions
  console.log(`\n\n=== List ALL root-level collections ===`);
  const colls = await db.listCollections();
  for (const c of colls) {
    const sample = await db.collection(c.id).limit(1).get();
    console.log(` ${c.id} (has ${sample.size > 0 ? 'docs' : 'empty'})`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
