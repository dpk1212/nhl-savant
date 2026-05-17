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
const cols = await db.listCollections();
for (const c of cols) {
  if (/pick|sharp|flow|locked|total|spread|live/i.test(c.id)) {
    const snap = await c.where('date', '==', '2026-05-17').get().catch(() => null);
    const todayCount = snap ? snap.size : '?';
    console.log(`  ${c.id}   (today=${todayCount})`);
  }
}
process.exit(0);
