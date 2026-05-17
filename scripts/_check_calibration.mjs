import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(join(REPO_ROOT, 'serviceAccountKey.json'), 'utf8'))) });
}
const db = admin.firestore();
const snap = await db.collection('agsCalibration').doc('current').get();
if (!snap.exists) {
  console.log('NO calibration doc exists');
  process.exit(0);
}
const d = snap.data();
console.log('source:        ', d.source);
console.log('sampleSize:    ', d.sampleSize);
console.log('computedAt:    ', d.computedAt);
console.log('dateRange:     ', JSON.stringify(d.dateRange));
console.log('');
console.log('quintiles:     ', JSON.stringify(d.quintiles, null, 2));
console.log('');
console.log('thresholds:    ', JSON.stringify(d.thresholds, null, 2));
console.log('');
console.log('normalizers (mean/sd):');
for (const [k, v] of Object.entries(d.normalizers || {})) {
  console.log(`  ${k.padEnd(20)} mean=${v.mean?.toFixed?.(3)}, sd=${v.sd?.toFixed?.(3)}`);
}
console.log('');
console.log('--- TIER TEST: ags = -0.027 (today\'s Under 205.5 Pistons total) ---');
const ags = -0.027;
const q = d.quintiles;
let tier;
if (ags >= q.q90) tier = 'ELITE';
else if (ags >= q.q80) tier = 'PREMIUM';
else if (ags >= q.q60) tier = 'LOCK';
else if (ags >= q.q40) tier = 'LEAN';
else if (ags >= q.q20) tier = 'WEAK';
else tier = 'FADE';
console.log(`  using FIRESTORE quintiles: tier = ${tier}`);
process.exit(0);
