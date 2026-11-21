#!/usr/bin/env node
/**
 * Publish one compressed copy of every wallet profile to Firestore.
 *
 *   walletProfilesPacked/current            pointer to the live generation
 *   walletProfilesPacked/<generation>_pNNN  the gzip bytes, about 900 KB each
 *
 * STAGE ONE: nothing reads this copy. The page, the sync, and every other
 * job still read what they read before. This script writes only the new
 * collection.
 *
 * Source: data/wallet-profiles.json, the file exportWalletProfiles.js wrote
 * earlier in the same job and the file the sync already runs on.
 *
 * It refuses to publish unless:
 *   1. the file passes the same checks the server's loader makes;
 *   2. walletProfilesMeta/current carries the same generatedAt and wallet
 *      count as the file, so the file and the profile documents are from the
 *      same export run;
 *   3. the pack opens back to exactly the JSON it was built from, first in
 *      memory and then again from the documents read back from Firestore.
 * The pointer moves only after the read-back passes. A refusal or a failure
 * leaves the last good generation in place. The steps are in
 * scripts/lib/publishWalletProfilesPack.js.
 *
 * Usage:
 *   node scripts/publishPackedWalletProfiles.js           # offline: build and self-check, no Firestore
 *   node scripts/publishPackedWalletProfiles.js --check   # read-only: also compare against Firestore stamps
 *   node scripts/publishPackedWalletProfiles.js --write   # publish
 *
 * Exit 0: published, already published, or refused by a guard.
 * Exit 1: something unexpected failed. The grade job runs this step with
 * continue-on-error, so neither outcome changes the rest of the job.
 */

import 'dotenv/config';
import process from 'process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { publishWalletProfilesPack } from './lib/publishWalletProfilesPack.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const argv = new Set(process.argv.slice(2));
const mode = argv.has('--write') ? 'write' : argv.has('--check') ? 'check' : 'offline';
const fileArg = [...argv].find((a) => a.startsWith('--file='));
const JSON_PATH = fileArg ? fileArg.slice('--file='.length) : join(__dirname, '..', 'data', 'wallet-profiles.json');

async function main() {
  if (!existsSync(JSON_PATH)) {
    console.log(`REFUSED: ${JSON_PATH} is missing. Nothing published.`);
    return 0;
  }
  let file;
  try {
    file = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
  } catch (err) {
    console.log(`REFUSED: ${JSON_PATH} does not parse (${err.message}). Nothing published.`);
    return 0;
  }

  let db = null;
  let serverTimestamp;
  if (mode !== 'offline') {
    const { default: admin } = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    db = admin.firestore();
    serverTimestamp = () => admin.firestore.FieldValue.serverTimestamp();
  }

  const { code } = await publishWalletProfilesPack({ file, mode, db, serverTimestamp });
  return code;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`FAILED: ${err.stack || err.message}`);
    process.exit(1);
  });
