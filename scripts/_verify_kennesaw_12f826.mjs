/**
 * Read-only check: ··12f826 has both 2026-10-22 Kennesaw State losses.
 * Usage: node scripts/_verify_kennesaw_12f826.mjs
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY = '2026-10-22_CFB_lib_kenn_b112f826_SPREAD_home';
const PLUS105 = '2026-10-22_CFB_lib_kenn_b112f826_SPREAD_home_p10_5';
const PROFILE = '12f826';

function initFirebase() {
  if (admin.apps.length) return admin.firestore();
  const sakPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(sakPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(fs.readFileSync(sakPath, 'utf8'))),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.VITE_FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

function summarizePos(id, data) {
  if (!data) return { id, missing: true };
  return {
    id,
    status: data.status || null,
    result: data.result || null,
    line: data.entryLine ?? data.spreadLine ?? null,
    invested: data.invested ?? null,
    settledPnl: data.settledPnl ?? null,
    team: data.teamName || null,
  };
}

function kennLegs(form) {
  return (Array.isArray(form?.recentAction) ? form.recentAction : []).filter((leg) => {
    const gk = String(leg?.gameKey || '').toLowerCase();
    const home = String(leg?.home || '').toLowerCase();
    return gk === 'lib_kenn' || home.includes('kennesaw');
  }).map((leg) => ({
    date: leg.date,
    line: leg.line,
    invested: leg.invested,
    won: leg.won,
    settledPnl: leg.settledPnl ?? leg.dollarPnl,
  }));
}

const db = initFirebase();
const [legacySnap, plusSnap, profSnap] = await Promise.all([
  db.collection('sharp_action_positions').doc(LEGACY).get(),
  db.collection('sharp_action_positions').doc(PLUS105).get(),
  db.collection('sharpWalletProfiles').doc(PROFILE).get(),
]);

const plus85 = summarizePos(LEGACY, legacySnap.data());
const plus105 = summarizePos(PLUS105, plusSnap.data());
const legs = kennLegs(profSnap.data()?.bySport?.CFB?.form);
const report = { plus85, plus105, profileLegs: legs };

console.log(JSON.stringify(report, null, 2));

const near = (got, want, slop = 200) => Math.abs(Number(got) - want) <= slop;
const ok85 = plus85.status === 'GRADED' && plus85.result === 'LOSS'
  && Number(plus85.line) === 8.5 && near(plus85.invested, 8200);
const ok105 = plus105.status === 'GRADED' && plus105.result === 'LOSS'
  && Number(plus105.line) === 10.5 && near(plus105.invested, 27200);
const lines = new Set(legs.map((l) => Number(l.line)));
const profileOk = lines.has(8.5) && lines.has(10.5)
  && legs.every((l) => l.won === 0)
  && legs.length === 2;

if (!ok85 || !ok105 || !profileOk) {
  console.error('VERIFY FAIL', { ok85, ok105, profileOk, lines: [...lines] });
  process.exit(1);
}
console.log('OK — 12f826 book has both Kennesaw LOSSES (+8.5 $8.2K and +10.5 $27.2K)');
process.exit(0);
