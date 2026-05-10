import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
if (existsSync(sakPath)) {
  initializeApp({ credential: cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
} else {
  initializeApp({
    credential: cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const snap = await db.collection('sharp_action_positions')
  .where('date', '==', '2026-05-02')
  .where('gameKey', '==', 'min_sas')
  .where('marketType', '==', 'SPREAD')
  .get();

console.log(`Found ${snap.size} SPREAD positions for min_sas:\n`);
snap.forEach(d => {
  const x = d.data();
  console.log(`  ${x.walletShort} side=${x.side} invested=$${x.invested} avgSportBet=$${x.avgSportBet} sizeRatio=${x.v8_sizeRatio?.toFixed(2) || 'n/a'} contrib=${x.v8_walletContribution} tier=lookup_below`);
});

const profilesSnap = await db.collection('sharpWalletProfiles').get();
const profiles = new Map();
profilesSnap.forEach(d => profiles.set(d.id.toLowerCase(), d.data()));
console.log(`\nProfiles loaded: ${profiles.size}`);
snap.forEach(d => {
  const x = d.data();
  const short = String(x.walletShort).toLowerCase();
  const p = profiles.get(short);
  const tier = p?.bySport?.['NBA']?.whitelistTier || null;
  console.log(`  ${x.walletShort} → NBA whitelistTier=${tier}`);
});

process.exit(0);
