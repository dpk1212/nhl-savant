// Patch sharpFlowSpreads/2026-05-07_NBA_cle_det_spread to match the live UI.
// Live UI reads sharp_spread_positions.json + sharpWalletProfiles, gets:
//   2 proven NBA wallets, $77,925 invested, 100% sharp money on Pistons
// Cron's createMissingLockedPicks wrote the doc first with the walletShort
// bug (fixed in 4389000c8), so peak.totalInvested=0 / peak.sharpCount=0 /
// peak.walletProfile counts=0 / consensusStrength=LEAN. We're rewriting
// peak.{} on this one doc to match what the UI computes.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf8')
  )),
});
const db = admin.firestore();

// ------ pull truth from the same scanner JSON the live UI reads -------------
const spreadData = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'public', 'sharp_spread_positions.json'), 'utf8'
));
const game = spreadData.NBA.cle_det;

const shortOf = (w) => String(w || '').slice(-6).toLowerCase();
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);

const pistonsPositions = game.positions.filter(p => p.outcome === 'Pistons');
const cavsPositions = game.positions.filter(p => p.outcome === 'Cavaliers');

// Whitelist gate (proven NBA wallets only) — same gate the UI applies
const provenPistons = [];
for (const p of pistonsPositions) {
  const snap = await db.collection('sharpWalletProfiles').doc(shortOf(p.wallet)).get();
  if (!snap.exists) continue;
  const profile = snap.data();
  const tier = profile?.bySport?.NBA?.whitelistTier;
  if (PROVEN_TIERS.has(tier)) provenPistons.push({ ...p, _tier: tier, _profile: profile });
}

const sharpCount = provenPistons.length;
const totalInvested = provenPistons.reduce((s, p) => s + Number(p.invested || 0), 0);
const opposingInvested = 0; // no Cavs sharp positions
const sharpMoneyPct = totalInvested + opposingInvested > 0
  ? totalInvested / (totalInvested + opposingInvested)
  : 1;
const moneyPct = Math.round(sharpMoneyPct * 100);
const walletPct = sharpCount > 0 ? 100 : 0;

// Wallet profile bucket counts (mirrors buildPeakStatsFromPositions)
const walletProfile = {
  total: sharpCount,
  confirmed: provenPistons.filter(p => p._tier === 'CONFIRMED').length,
  flat: provenPistons.filter(p => p._tier === 'FLAT').length,
  wr50: 0,
};

// Grade: 100% money + 2 proven sharps → ELITE (mirrors UI)
const grade = (moneyPct >= 80 && sharpCount >= 2) ? 'ELITE'
  : (moneyPct >= 65) ? 'STRONG'
  : (moneyPct >= 55) ? 'CONFIRMS' : 'LEAN';

const consensusStrength = { moneyPct, walletPct, grade };

console.log(`Computed truth from scanner JSON:`);
console.log(`  sharpCount:           ${sharpCount}`);
console.log(`  totalInvested:        $${totalInvested.toLocaleString()}`);
console.log(`  consensusStrength:    ${JSON.stringify(consensusStrength)}`);
console.log(`  walletProfile:        ${JSON.stringify(walletProfile)}`);
console.log('');

// ------ patch the doc -------------------------------------------------------
const ref = db.collection('sharpFlowSpreads').doc('2026-05-07_NBA_cle_det_spread');
const docSnap = await ref.get();
if (!docSnap.exists) { console.error('DOC GONE'); process.exit(1); }

const data = docSnap.data();
const homePeak = data.sides?.home?.peak || {};
const homeLock = data.sides?.home?.lock || {};

console.log(`BEFORE patch (sides.home.peak):`);
console.log(`  totalInvested:        ${homePeak.totalInvested}`);
console.log(`  sharpCount:           ${homePeak.sharpCount}`);
console.log(`  consensusStrength:    ${JSON.stringify(homePeak.consensusStrength)}`);
console.log(`  walletProfile:        ${JSON.stringify(homePeak.walletProfile)}`);
console.log('');

await ref.update({
  'sides.home.peak.totalInvested': totalInvested,
  'sides.home.peak.sharpCount': sharpCount,
  'sides.home.peak.consensusStrength': consensusStrength,
  'sides.home.peak.walletProfile': walletProfile,
  'sides.home.lock.totalInvested': totalInvested,
  'sides.home.lock.sharpCount': sharpCount,
  'sides.home.lock.consensusStrength': consensusStrength,
  'sides.home.lock.walletProfile': walletProfile,
  'sides.home.lastPatchedAt': Date.now(),
  'sides.home.lastPatchReason': 'wallet-shortform-bug-cleanup-fix-4389000c8',
});

const after = (await ref.get()).data().sides.home;
console.log(`AFTER patch (sides.home.peak):`);
console.log(`  totalInvested:        ${after.peak.totalInvested}`);
console.log(`  sharpCount:           ${after.peak.sharpCount}`);
console.log(`  consensusStrength:    ${JSON.stringify(after.peak.consensusStrength)}`);
console.log(`  walletProfile:        ${JSON.stringify(after.peak.walletProfile)}`);

console.log('\nDONE — refresh the dashboard.');
await admin.app().delete();
process.exit(0);
