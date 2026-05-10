// Inspect what is FROZEN in `peak.v8Scoring.walletDetails` per pick.
// We need to know which fields are pick-time-stamped (legal to use) vs
// fields that would require live recompute (illegal — look-ahead bias).
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
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

const picks = await db.collection('sharpFlowPicks').where('date', '>=', '2026-04-25').limit(8).get();
for (const doc of picks.docs) {
  const d = doc.data();
  console.log(`\n${'='.repeat(72)}`);
  console.log(`Doc: ${doc.id}`);
  console.log(`  date=${d.date}  sport=${d.sport}  away=${d.away}  home=${d.home}`);
  for (const [sideKey, side] of Object.entries(d.sides || {})) {
    const peak = side.peak || side.lock || {};
    const wd = peak?.v8Scoring?.walletDetails;
    console.log(`  side=${sideKey}  team=${side.team}  outcome=${side.result?.outcome || 'pending'}  v8_walletConsensusDelta=${side.v8_walletConsensusDelta}`);
    if (Array.isArray(wd) && wd.length) {
      console.log(`    walletDetails N=${wd.length}, first 2 entries:`);
      console.log(JSON.stringify(wd.slice(0, 2), null, 2).split('\n').map(l => '      ' + l).join('\n'));
      const tiers = {};
      for (const w of wd) tiers[w.whitelistTier || w.tier || '_no_tier'] = (tiers[w.whitelistTier || w.tier || '_no_tier'] || 0) + 1;
      console.log(`    tier histogram: ${JSON.stringify(tiers)}`);
      const keys = new Set();
      for (const w of wd) for (const k of Object.keys(w)) keys.add(k);
      console.log(`    fields present across all entries: ${[...keys].sort().join(', ')}`);
    } else {
      console.log(`    walletDetails: missing or empty`);
    }
  }
}
process.exit(0);
