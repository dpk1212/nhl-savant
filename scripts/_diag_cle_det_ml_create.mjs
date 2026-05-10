// Diagnose why cron's createMissingLockedPicks isn't creating cle_det/NBA/ML.
// Mirrors the relevant portions of createMissingLockedPicks per-side and
// logs the gate decisions so we can see exactly what's blocking.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import {
  aggregateSideProven,
  computeAgs,
  AGS_FALLBACK_CALIBRATION,
  AGS_LOCK_FLOOR,
  AGS_MUTE_FLOOR,
  AGS_DW1_FLOOR,
  AGS_MIN_PROVEN_WALLETS,
  meetsAgsLockFloor,
  failsAgsConfirmationGate,
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
const HC_RATIO = 1.5;
const QUALITY_CONTRIB_CUT = 30;
const TARGET_DATE = '2026-05-07';

function meetsV74Floor(dw, hcMargin, ags, agsProvenTotal) {
  if (!Number.isFinite(dw)) return false;
  const hc = Number.isFinite(hcMargin) ? hcMargin : 0;
  if (hc >= 1) return true;
  if (dw >= 2) return true;
  if (dw >= 1 && Number.isFinite(ags) && ags >= AGS_DW1_FLOOR
      && (agsProvenTotal == null || agsProvenTotal >= AGS_MIN_PROVEN_WALLETS)) return true;
  return false;
}

console.log(`\n=== Loading walletProfiles ===`);
const profilesSnap = await db.collection('sharpWalletProfiles').get();
const profilesByShort = new Map();
const profilesByFull = new Map();
for (const doc of profilesSnap.docs) {
  profilesByShort.set(doc.id.toLowerCase(), doc.data());
  const w = doc.data();
  if (w.wallet) profilesByFull.set(String(w.wallet).toLowerCase(), doc.data());
}
console.log(`  loaded ${profilesByShort.size} profiles`);

const tierForWallet = (walletAny, sport) => {
  const k = String(walletAny || '').slice(-6).toLowerCase();
  const p = profilesByShort.get(k);
  if (!p) return null;
  return p?.bySport?.[sport]?.whitelistTier ?? p?.whitelistTier ?? null;
};
const isProvenFn = (w, sport) => {
  const t = tierForWallet(w, sport);
  return t === 'CONFIRMED' || t === 'FLAT';
};

console.log(`\n=== Loading agsCalibration/current ===`);
const calSnap = await db.collection('agsCalibration').doc('current').get();
const agsCalibration = calSnap.exists ? calSnap.data() : AGS_FALLBACK_CALIBRATION;
console.log(`  source: ${agsCalibration.source || (calSnap.exists ? 'firestore' : 'fallback')}`);

console.log(`\n=== Loading sharp_action_positions for ${TARGET_DATE} ===`);
const posSnap = await db.collection('sharp_action_positions')
  .where('date', '==', TARGET_DATE)
  .get();
console.log(`  ${posSnap.size} total`);
const groupKey = `${SPORT}|${GAME_KEY}|${MARKET}`;
const groupPositions = [];
posSnap.forEach(d => {
  const p = d.data();
  if (`${p.sport}|${p.gameKey}|${p.marketType}` === groupKey) groupPositions.push(p);
});
console.log(`  ${groupPositions.length} for ${groupKey}`);

console.log(`\n=== Loading polymarket_data.json metadata ===`);
const poly = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'polymarket_data.json'), 'utf8'));
const meta = poly?.NBA?.[GAME_KEY];
console.log(`  cle_det meta:`, meta ? { away: meta.awayTeam, home: meta.homeTeam, commence: meta.commence } : 'MISSING');

const now = Date.now();
const PREGAME_BUFFER_MS = 5 * 60 * 1000;
const ct = new Date(meta.commence).getTime();
console.log(`  commenceTime: ${new Date(ct).toISOString()}`);
console.log(`  now:          ${new Date(now).toISOString()}`);
console.log(`  pregame buffer threshold: ${new Date(ct - PREGAME_BUFFER_MS).toISOString()}`);
console.log(`  past_pregame_window? ${now >= ct - PREGAME_BUFFER_MS}`);
const gameDateET = new Date(ct).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
console.log(`  gameDateET: ${gameDateET} (TARGET_DATE=${TARGET_DATE})  match? ${gameDateET === TARGET_DATE}`);

// Mirror computeWalletConsensus + dedupBySide.
function dedupBySide(positions) {
  const m = new Map();
  for (const p of positions) {
    if (!p.wallet || !p.side) continue;
    const k = `${String(p.wallet).toLowerCase()}|${p.side}`;
    const cur = m.get(k);
    if (!cur || (p.invested || 0) > (cur.invested || 0)) m.set(k, p);
  }
  return [...m.values()];
}

function computeWalletConsensus(rawPositions, mySide, sport) {
  const positions = dedupBySide(rawPositions);
  let qFor = 0, qAg = 0, forW = 0, agW = 0, hcF = 0, hcA = 0;
  for (const p of positions) {
    const tier = tierForWallet(p.wallet, sport);
    const sr = p.v8_sizeRatio != null ? p.v8_sizeRatio
      : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    const c = p.v8_walletContribution ?? 0;
    if (c >= QUALITY_CONTRIB_CUT) {
      if (p.side === mySide) qFor++;
      else if (p.side) qAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (p.side === mySide) forW++;
      else if (p.side) agW++;
    }
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (p.side === mySide) hcF++;
      else if (p.side) hcA++;
    }
  }
  return {
    forW, agW, delta: forW - agW,
    qualityForT30: qFor, qualityAgT30: qAg, qualityMargin: qFor - qAg,
    hcConfFor: hcF, hcConfAg: hcA, hcMargin: hcF - hcA, hcDominant: hcF >= 1 && hcA === 0,
  };
}

// Build walletDetails mirror of cron's positionToWalletDetail.
// IMPORTANT: must mirror positionToWalletDetail() in syncPickStateAuthoritative.js
// — including the roiNorm/pnlNorm/rankNorm fields. Without these, dRoiNormAvg
// computes as 0 instead of the real value (off by ~30 in the AGS sum).
const walletDetails = groupPositions.map(p => ({
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
  roiNorm: Number(p.v8_walletRoiNorm || 0),
  pnlNorm: Number(p.v8_walletPnlNorm || 0),
  rankNorm: Number(p.v8_walletRankNorm || 0),
  tier: p.tier || null,
}));

for (const side of ['away', 'home']) {
  console.log(`\n=== Side: ${side} (${side === 'away' ? 'Cavaliers' : 'Pistons'}) ===`);
  const live = computeWalletConsensus(groupPositions, side, SPORT);
  console.log(`  live: forW=${live.forW} agW=${live.agW} dw=${live.delta} HC=${live.hcConfFor}/${live.hcConfAg} HC_m=${live.hcMargin}`);
  if (live.forW === 0 && live.agW === 0 && live.hcConfFor === 0 && live.hcConfAg === 0) {
    console.log(`  → SKIP: no whitelist activity at all`);
    continue;
  }
  const agg = aggregateSideProven(walletDetails, side, SPORT, isProvenFn);
  const agsRes = agg ? computeAgs(agg, agsCalibration) : null;
  const agsValue = agsRes && Number.isFinite(agsRes.ags) ? agsRes.ags : null;
  const agsProvenTotal = agsRes ? (agsRes.provenForCount || 0) + (agsRes.provenAgCount || 0) : 0;
  console.log(`  AGS: ${agsValue?.toFixed(2)}  proven total: ${agsProvenTotal}`);
  if (live.delta <= -2) { console.log(`  → SKIP: winners_killed (dw<=-2)`); continue; }
  const passesV74 = meetsV74Floor(live.delta, live.hcMargin, agsValue, agsProvenTotal);
  const agsRescue = !passesV74 && agsValue != null && live.delta > -2
    && agsProvenTotal >= AGS_MIN_PROVEN_WALLETS
    && meetsAgsLockFloor(agsValue, agsProvenTotal);
  console.log(`  passesV74: ${passesV74}    agsRescue: ${agsRescue}`);
  if (!passesV74 && !agsRescue) { console.log(`  → SKIP: no route to LOCKED`); continue; }
  if (agsValue != null && agsProvenTotal >= AGS_MIN_PROVEN_WALLETS && failsAgsConfirmationGate(agsValue)) {
    console.log(`  → SKIP: ags_quality_veto (AGS=${agsValue.toFixed(2)} < ${AGS_MUTE_FLOOR})`);
    continue;
  }
  let promotedBy;
  if (!passesV74) promotedBy = 'ags-rescue';
  else if (live.hcMargin >= 1) promotedBy = 'v74-hc-margin';
  else if (live.delta >= 2) promotedBy = 'v75-dw2';
  else promotedBy = 'v75-dw1-ags';
  console.log(`  → SHOULD CREATE: route=${promotedBy}  dw=${live.delta} HC_m=${live.hcMargin} AGS=${agsValue?.toFixed(2)}`);
}

// What the cron actually sees in walletDetails (one per row in sharp_action_positions).
console.log(`\n=== walletDetails the cron feeds to aggregateSideProven (n=${walletDetails.length}) ===`);
for (const wd of walletDetails) {
  const tier = tierForWallet(wd.wallet, SPORT);
  const proven = tier === 'CONFIRMED' || tier === 'FLAT';
  console.log(
    `  ${wd.wallet}  ${wd.side.padEnd(5)}  $${String(wd.invested).padStart(7)}  ` +
    `contrib=${wd.contribution.toFixed(1).padStart(7)}  base=${wd.walletBase.toFixed(1).padStart(6)}  ` +
    `roiNorm=${wd.roiNorm.toFixed(1).padStart(6)}  sr=${wd.sizeRatio.toFixed(2).padStart(5)}  ` +
    `tier=${(tier || 'NONE').padEnd(9)}  ${proven ? '★' : ''}`,
  );
}

for (const side of ['away', 'home']) {
  const teamLabel = side === 'away' ? 'Cavaliers (away)' : 'Pistons (home)';
  console.log(`\n=== AGS COMPONENT BREAKDOWN — ${teamLabel} ===`);
  const live = computeWalletConsensus(groupPositions, side, SPORT);
  const agg = aggregateSideProven(walletDetails, side, SPORT, isProvenFn);
  if (!agg) { console.log(`  no proven aggregate`); continue; }
  console.log(`  agg.forCount=${agg.forCount} agg.agCount=${agg.agCount}`);
  console.log(`  feature deltas (FOR − AG):`);
  for (const k of ['dCount', 'dContribution', 'dBestContrib', 'dBestWalletBase', 'dConvictionAvg', 'dRoiNormAvg']) {
    console.log(`    ${k.padEnd(18)} = ${(agg[k] ?? 0).toFixed(3).padStart(10)}`);
  }
  const agsRes = computeAgs(agg, agsCalibration);
  const agsValue = agsRes && Number.isFinite(agsRes.ags) ? agsRes.ags : null;
  const norm = agsCalibration.normalizers || {};
  console.log(`  z-scores (calibration: ${agsCalibration.source || 'firestore'}):`);
  let runningSum = 0;
  for (const f of ['dCount', 'dContribution', 'dBestContrib', 'dBestWalletBase', 'dConvictionAvg', 'dRoiNormAvg']) {
    const n = norm[f] || { mean: 0, sd: 1 };
    const raw = agg[f] || 0;
    const z = (raw - n.mean) / n.sd;
    runningSum += z;
    console.log(`    ${f.padEnd(18)} raw=${raw.toFixed(2).padStart(9)}  μ=${n.mean.toFixed(2).padStart(7)}  σ=${n.sd.toFixed(2).padStart(6)}  z=${(z >= 0 ? '+' : '') + z.toFixed(3)}`);
  }
  console.log(`  AGS = sum of z-scores = ${agsValue >= 0 ? '+' : ''}${agsValue.toFixed(3)} (running sum verify: ${runningSum.toFixed(3)})`);
  console.log(`  ${agsValue < AGS_MUTE_FLOOR ? '⛔ FAILS AGS confirmation gate (AGS < -1.0)' : '✓ Passes AGS confirmation gate'}`);
}

await admin.app().delete();
process.exit(0);
