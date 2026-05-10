// One-shot: compute AGS for both sides of cle_det ML the way the cron does.
// Reads sharp_action_positions for the game/market, builds walletDetails like
// the browser writes them into peak.v8Scoring.walletDetails, then runs
// aggregateSideProven + computeAgs (the same path syncPickStateAuthoritative
// uses) and prints the per-side score.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import {
  aggregateSideProven,
  computeAgs,
  agsTierFromValue,
  agsQuintileFromValue,
  AGS_FALLBACK_CALIBRATION,
} from '../src/lib/ags.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(saPath, 'utf8'))),
});
const db = admin.firestore();

const SPORT = 'NBA';
const GAME_KEY = 'cle_det';
const MARKET = 'ML';

// Load whitelist tiers — proven = CONFIRMED | FLAT (AGS), HC = CONFIRMED only (sr>=1.5).
console.log(`\n=== Loading whitelist (sharpWalletProfiles) ===`);
const profilesSnap = await db.collection('sharpWalletProfiles').get();
const profilesByShort = new Map();
for (const doc of profilesSnap.docs) {
  profilesByShort.set(doc.id.toLowerCase(), doc.data());
}
const tierForWallet = (walletShort, sport) => {
  const p = profilesByShort.get(walletShort.toLowerCase());
  if (!p) return null;
  return p?.bySport?.[sport]?.whitelistTier ?? p?.whitelistTier ?? null;
};
const isProvenFn = (walletShort, sport) => {
  const t = tierForWallet(walletShort, sport);
  return t === 'CONFIRMED' || t === 'FLAT';
};
const HC_RATIO = 1.5;

// Load AGS calibration — same as cron (agsCalibration/current).
console.log(`=== Loading AGS calibration (agsCalibration/current) ===`);
const calSnap = await db.collection('agsCalibration').doc('current').get();
const calibration = calSnap.exists ? calSnap.data() : AGS_FALLBACK_CALIBRATION;
console.log(`calibration source: ${calSnap.exists ? 'firestore' : 'fallback'}`);
console.log(`calibration generatedAt: ${calibration.generatedAt || 'n/a'}`);

// Load positions for cle_det ML — what writeSharpActions wrote.
console.log(`\n=== Loading sharp_action_positions for ${SPORT}/${GAME_KEY}/${MARKET} ===`);
const posSnap = await db.collection('sharp_action_positions')
  .where('sport', '==', SPORT)
  .where('gameKey', '==', GAME_KEY)
  .where('marketType', '==', MARKET)
  .get();
console.log(`positions found: ${posSnap.size}`);

// sharp_action_positions is append-only — each scan writes a fresh row,
// so a single wallet appears N times as its position grew. Dedup to the
// largest-invested record per (wallet, side) so we mirror what the
// browser's dedup() produces in computeSharpFeatures (which then feeds
// the v8Scoring.walletDetails the cron's AGS pipeline reads from).
const dedupMap = new Map();
for (const d of posSnap.docs) {
  const p = d.data();
  const w = (p.walletShort || (p.wallet || '').slice(-6)).toLowerCase();
  const key = `${w}|${p.side}`;
  const existing = dedupMap.get(key);
  if (!existing || Number(p.invested || 0) > Number(existing.invested || 0)) dedupMap.set(key, p);
}
console.log(`positions after wallet|side dedup: ${dedupMap.size}`);

const walletDetails = [...dedupMap.values()].map(p => ({
  wallet: p.walletShort || (p.wallet || '').slice(-6).toLowerCase(),
  side: p.side,
  invested: Number(p.invested || 0),
  contribution: Number(p.v8_walletContribution || 0),
  walletBase: Number(p.v8_walletBase || 0),
  roi: Number(p.sportROI || 0),
  pnl: Number(p.sportPnlTotal || p.totalPnl || 0),
  sizeRatio: Number(p.v8_sizeRatio || (p.avgSportBet > 0 ? p.invested / p.avgSportBet : 0)),
  convictionMult: Number(p.v8_convictionMult || 0),
  rank: p.leaderboardRank ?? null,
  tier: p.tier || null,
}));

console.log(`\n=== walletDetails (all) ===`);
for (const wd of walletDetails) {
  const provenAway = isProvenFn(wd.wallet, SPORT);
  console.log(
    `  ${wd.wallet}  side=${wd.side.padEnd(5)}  $${wd.invested.toLocaleString().padStart(8)}  ` +
    `contrib=${wd.contribution.toFixed(2).padStart(7)}  ` +
    `tier=${wd.tier}  proven(${SPORT})=${provenAway}`,
  );
}

// Compute Δw / Δq / HC margin alongside AGS — same definitions as cron.
// HC = CONFIRMED tier (NOT FLAT) ∧ sizeRatio >= 1.5. dw uses CONFIRMED + FLAT.
function computeConsensus(side) {
  let forW = 0, agW = 0, qFor = 0, qAg = 0, hcF = 0, hcA = 0;
  const hcWalletsFor = [], hcWalletsAg = [];
  for (const wd of walletDetails) {
    const tier = tierForWallet(wd.wallet, SPORT);
    const sr = Number(wd.sizeRatio || 0);
    const c = Number(wd.contribution || 0);
    if (c >= 30) {
      if (wd.side === side) qFor++;
      else if (wd.side) qAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (wd.side === side) forW++;
      else if (wd.side) agW++;
    }
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (wd.side === side) { hcF++; hcWalletsFor.push({ ...wd, sr }); }
      else if (wd.side) { hcA++; hcWalletsAg.push({ ...wd, sr }); }
    }
  }
  return { forW, agW, dw: forW - agW, qFor, qAg, dq: qFor - qAg, hcF, hcA, hcMargin: hcF - hcA, hcWalletsFor, hcWalletsAg };
}

// Compute AGS for each ML side.
for (const side of ['away', 'home']) {
  const teamLabel = side === 'away' ? 'Cavaliers (away)' : 'Pistons (home)';
  const con = computeConsensus(side);
  console.log(`\n=== Consensus for ${teamLabel} ===`);
  console.log(`  Δw  (CONFIRMED+FLAT for−ag):       ${con.forW} − ${con.agW} = ${con.dw >= 0 ? '+' : ''}${con.dw}`);
  console.log(`  Δq  (contrib≥30 for−ag, sparse):   ${con.qFor} − ${con.qAg} = ${con.dq >= 0 ? '+' : ''}${con.dq}`);
  console.log(`  HC margin (CONFIRMED ∧ sr≥1.5):    ${con.hcF} − ${con.hcA} = ${con.hcMargin >= 0 ? '+' : ''}${con.hcMargin}`);
  if (con.hcWalletsFor.length) {
    console.log(`  HC wallets FOR:`);
    for (const w of con.hcWalletsFor) console.log(`    ${w.wallet}  $${w.invested.toLocaleString()}  sr=${w.sr.toFixed(2)}  contrib=${w.contribution.toFixed(1)}`);
  }
  if (con.hcWalletsAg.length) {
    console.log(`  HC wallets AG:`);
    for (const w of con.hcWalletsAg) console.log(`    ${w.wallet}  $${w.invested.toLocaleString()}  sr=${w.sr.toFixed(2)}  contrib=${w.contribution.toFixed(1)}`);
  }
  if (!con.hcWalletsFor.length && !con.hcWalletsAg.length) {
    console.log(`  (no HC-qualifying wallets on either side — sr<1.5 or tier!=CONFIRMED)`);
  }
}

console.log(`\n=== Per-wallet sizeRatio + tier breakdown (whitelisted only) ===`);
for (const wd of walletDetails) {
  const tier = tierForWallet(wd.wallet, SPORT);
  if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;
  const sr = Number(wd.sizeRatio || 0);
  const isHc = tier === 'CONFIRMED' && sr >= HC_RATIO;
  console.log(
    `  ${wd.wallet}  side=${wd.side.padEnd(5)}  $${wd.invested.toLocaleString().padStart(8)}  ` +
    `sr=${sr.toFixed(2).padStart(5)}  tier=${tier.padEnd(9)}  ${isHc ? '★ HC' : ''}`,
  );
}

for (const side of ['away', 'home']) {
  const teamLabel = side === 'away' ? 'Cavaliers (away)' : 'Pistons (home)';
  console.log(`\n=== AGS for side=${side} — ${teamLabel} ===`);
  const agg = aggregateSideProven(walletDetails, side, SPORT, isProvenFn);
  if (!agg) {
    console.log(`  no aggregate (no proven wallets on either side?)`);
    continue;
  }
  console.log(`  proven FOR count:        ${agg.forCount}    invested=$${agg.forInvested.toLocaleString()}`);
  console.log(`  proven AG  count:        ${agg.agCount}    invested=$${agg.agInvested.toLocaleString()}`);
  console.log(`  raw walletDetails total: ${agg.totalRaw}    proven of those=${agg.provenRaw}`);
  console.log(`  feature deltas (FOR − AG):`);
  for (const k of ['dCount', 'dContribution', 'dBestContrib', 'dBestWalletBase', 'dConvictionAvg', 'dRoiNormAvg']) {
    console.log(`    ${k.padEnd(18)} = ${(agg[k] ?? 0).toFixed(3).padStart(10)}`);
  }
  const result = computeAgs(agg, calibration);
  console.log(`  ──────────────────────────────────`);
  console.log(`  AGS:        ${result.ags >= 0 ? '+' : ''}${result.ags.toFixed(2)}`);
  console.log(`  tier:       ${agsTierFromValue(result.ags)}    quintile: Q${agsQuintileFromValue(result.ags, calibration)}`);
  console.log(`  per-feature z-scores (each contributes its z directly to AGS sum):`);
  for (const f of [
    { key: 'dCount',          label: 'Δcount' },
    { key: 'dContribution',   label: 'ΔcontribSum' },
    { key: 'dBestContrib',    label: 'ΔbestContrib' },
    { key: 'dBestWalletBase', label: 'ΔbestBase' },
    { key: 'dConvictionAvg',  label: 'ΔavgConviction' },
    { key: 'dRoiNormAvg',     label: 'ΔavgRoiNorm' },
  ]) {
    const z = result.components?.[f.key] ?? 0;
    const sign = z >= 0 ? '+' : '';
    console.log(`    ${f.label.padEnd(18)} z=${sign}${z.toFixed(3)}`);
  }
}

// Also pull the existing Firestore doc to compare what's already stamped.
console.log(`\n=== Currently stamped on sharpFlowPicks/2026-05-07_NBA_cle_det ===`);
const pickDoc = await db.collection('sharpFlowPicks').doc('2026-05-07_NBA_cle_det').get();
if (!pickDoc.exists) {
  console.log(`  doc does not exist (expected — pick is MONITORING, not LOCKED)`);
} else {
  const data = pickDoc.data();
  for (const [side, sd] of Object.entries(data.sides || {})) {
    if (sd.superseded) continue;
    console.log(`  side=${side}`);
    console.log(`    lockStage:               ${sd.lockStage}`);
    console.log(`    health.status:           ${sd.health?.status}`);
    console.log(`    v8_ags:                  ${sd.v8_ags}`);
    console.log(`    v8_agsTier:              ${sd.v8_agsTier}`);
    console.log(`    v8_agsQuintile:          ${sd.v8_agsQuintile}`);
    console.log(`    v8_agsProvenForCount:    ${sd.v8_agsProvenForCount}`);
    console.log(`    v8_agsProvenAgCount:     ${sd.v8_agsProvenAgCount}`);
    console.log(`    v8_walletConsensusDelta: ${sd.v8_walletConsensusDelta}`);
    console.log(`    v8_hcMargin:             ${sd.v8_hcMargin}`);
  }
}

await admin.app().delete();
process.exit(0);
