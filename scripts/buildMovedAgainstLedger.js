/**
 * Rebuild data/moved-against-ledger.json from graded Source B bets.
 * exportWalletProfiles.js writes the same file on the grade run.
 *
 *   node scripts/buildMovedAgainstLedger.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  buildMovedAgainstLedger,
  serializeMovedAgainstLedger,
} from '../src/lib/movedAgainstEdge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))),
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
}

const db = admin.firestore();
const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
const rows = [];
snap.forEach((doc) => {
  const d = doc.data() || {};
  rows.push({
    date: d.date,
    sport: d.sport,
    market: d.marketType,
    walletShort: d.walletShort || d.wallet,
    invested: d.invested ?? d.size,
    settledPnl: d.settledPnl ?? d.positionPnl,
    avgPrice: d.avgPrice,
    entryAvgPrice: d.entryAvgPrice,
    result: d.result || null,
    postponed: d.postponed === true,
  });
});

const payload = serializeMovedAgainstLedger(buildMovedAgainstLedger(rows), {
  generatedAt: new Date().toISOString(),
});
const dataDir = join(__dirname, '..', 'data');
mkdirSync(dataDir, { recursive: true });
const out = join(dataDir, 'moved-against-ledger.json');
writeFileSync(out, JSON.stringify(payload));
console.log(`graded docs ${snap.size} · kept ${payload.betCount} bets · ${payload.walletCount} wallets · ${out}`);
process.exit(0);
