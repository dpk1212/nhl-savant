// One-shot: how many proven whitelisted wallets actually back Pistons -3.5
// in our data RIGHT NOW. Looking at THE actual JSON the scanner emits
// + Firestore sharpWalletProfiles for whitelist tier.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
});
const db = admin.firestore();

const spreadPath = path.join(__dirname, '..', 'public', 'sharp_spread_positions.json');
const spreadData = JSON.parse(fs.readFileSync(spreadPath, 'utf8'));
const game = spreadData.NBA?.cle_det;
if (!game) { console.error('cle_det not found'); process.exit(1); }

console.log(`\n=== sharp_spread_positions.json — NBA cle_det ===`);
console.log(`away/home: ${game.away} / ${game.home}`);
console.log(`summary:`, JSON.stringify(game.summary));
console.log(`total positions: ${game.positions.length}\n`);

const pistonsPositions = game.positions.filter(p => p.outcome === 'Pistons');
const cavsPositions = game.positions.filter(p => p.outcome === 'Cavaliers');

console.log(`Pistons-side positions: ${pistonsPositions.length}`);
console.log(`Cavs-side positions:    ${cavsPositions.length}\n`);

const shortOf = (w) => String(w || '').slice(-6).toLowerCase();

console.log(`=== Pistons-side wallets — full breakdown ===\n`);

const rows = [];
for (const p of pistonsPositions) {
  const fullWallet = p.wallet;
  const short = shortOf(fullWallet);

  // Look up by short (the doc id pattern our writers use)
  let profileSnap = await db.collection('sharpWalletProfiles').doc(short).get();
  let profile = profileSnap.exists ? profileSnap.data() : null;
  if (!profile) {
    const fullSnap = await db.collection('sharpWalletProfiles').doc(fullWallet).get();
    if (fullSnap.exists) profile = fullSnap.data();
  }
  if (!profile) {
    // Try a query
    const qs = await db.collection('sharpWalletProfiles')
      .where('walletShort', '==', short).limit(1).get();
    if (!qs.empty) profile = qs.docs[0].data();
  }

  const nbaTier = profile?.bySport?.NBA?.whitelistTier ?? null;
  const nbaSportRank = profile?.bySport?.NBA?.sportRank ?? null;
  const nbaWinRate = profile?.bySport?.NBA?.winRate ?? null;
  const nbaPicks = profile?.bySport?.NBA?.picks ?? null;
  const overallTier = profile?.whitelistTier ?? profile?.tier ?? null;
  const v8Contrib = p.v8_walletContribution ?? null; // not present on raw scanner output

  const row = {
    short, name: p.name, line: p.entryLine, dollars: p.invested,
    nbaTier, overallTier, nbaSportRank, nbaWinRate, nbaPicks,
    v8Contrib, profileFound: !!profile, sportVerified: p.sportVerified,
    sportROI: p.sportROI, leaderboardRank: p.leaderboardRank,
  };
  rows.push(row);

  console.log(`${row.short} (${row.name})`);
  console.log(`  full:               ${fullWallet}`);
  console.log(`  entryLine:          ${row.line}`);
  console.log(`  dollars invested:   $${Number(row.dollars).toLocaleString()}`);
  console.log(`  sportVerified:      ${row.sportVerified}`);
  console.log(`  sportROI:           ${row.sportROI}`);
  console.log(`  leaderboardRank:    ${row.leaderboardRank}`);
  console.log(`  --- sharpWalletProfiles lookup ---`);
  console.log(`  profile found:      ${row.profileFound}`);
  console.log(`  whitelistTier(NBA): ${row.nbaTier || 'NONE'}`);
  console.log(`  whitelistTier(top): ${row.overallTier || 'NONE'}`);
  console.log(`  NBA sportRank:      ${row.nbaSportRank}`);
  console.log(`  NBA winRate:        ${row.nbaWinRate}`);
  console.log(`  NBA picks:          ${row.nbaPicks}`);
  console.log('');
}

const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);
const provenNba = rows.filter(r => PROVEN_TIERS.has(r.nbaTier));
const allWhitelistedNba = rows.filter(r => ['CONFIRMED', 'FLAT', 'WR50'].includes(r.nbaTier));

console.log(`================================================================`);
console.log(`THE TRUTH — Pistons -3.5 spread`);
console.log(`================================================================`);
console.log(`Total Pistons-side wallets in scanner JSON:        ${rows.length}`);
console.log(`Total dollars on Pistons side:                     $${rows.reduce((s, r) => s + Number(r.dollars || 0), 0).toLocaleString()}`);
console.log(``);
console.log(`Proven NBA wallets (CONFIRMED|FLAT):               ${provenNba.length}`);
console.log(`All whitelisted NBA (CONFIRMED|FLAT|WR50):         ${allWhitelistedNba.length}`);
console.log(``);
if (provenNba.length) {
  console.log(`Proven NBA wallets:`);
  for (const r of provenNba) console.log(`  ${r.short} (${r.name}) — ${r.nbaTier} — $${Number(r.dollars).toLocaleString()}`);
}
console.log(``);

// And let's also pull what Firestore currently has for the locked pick doc
console.log(`================================================================`);
console.log(`What's currently in Firestore for sharpFlowSpreads/2026-05-07_NBA_cle_det_spread`);
console.log(`================================================================`);
const pickDoc = await db.collection('sharpFlowSpreads').doc('2026-05-07_NBA_cle_det_spread').get();
if (!pickDoc.exists) {
  console.log('DOC DOES NOT EXIST');
} else {
  const data = pickDoc.data();
  const sides = data.sides || {};
  for (const [side, sd] of Object.entries(sides)) {
    if (sd.superseded) continue;
    console.log(`\n  Side: ${side}`);
    console.log(`    health.status:           ${sd.health?.status}`);
    console.log(`    lockStage:               ${sd.lockStage}`);
    console.log(`    finalUnits:              ${sd.finalUnits}`);
    console.log(`    v8_vaultStar:            ${sd.v8_vaultStar}`);
    console.log(`    v8_lockTier:             ${sd.v8_lockTier}`);
    console.log(`    v8_walletConsensusDelta: ${sd.v8_walletConsensusDelta}`);
    console.log(`    v8_walletConsensusQualityForT30: ${sd.v8_walletConsensusQualityForT30}`);
    console.log(`    v8_walletConsensusQualityAgainstT30: ${sd.v8_walletConsensusQualityAgainstT30}`);
    console.log(`    v8_hcMargin:             ${sd.v8_hcMargin}`);
    console.log(`    v8_agsValue:             ${sd.v8_agsValue}`);
    console.log(`    peak.totalInvested:      ${sd.peak?.totalInvested}`);
    console.log(`    peak.sharpCount:         ${sd.peak?.sharpCount}`);
    console.log(`    peak.line:               ${sd.peak?.line}`);
    console.log(`    peak.odds:               ${sd.peak?.odds}`);
    console.log(`    peak.book:               ${sd.peak?.book}`);
    console.log(`    cronCreated:             ${sd.cronCreated}`);
    console.log(`    health.syncedBy:         ${sd.health?.syncedBy}`);
  }
}

await admin.app().delete();
process.exit(0);
