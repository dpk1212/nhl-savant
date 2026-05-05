// v7.5 floor audit — uses the SAME JSON files the browser reads
// (sharp_positions.json, sharp_spread_positions.json, sharp_total_positions.json).
// For each game/market/side present in today's scan, compute the v7.5
// deltas-based floor (HC ≥ +1 OR Δw ≥ +2) and flag anything that qualifies
// but isn't shown. The Δw=1+AGS and AGS rescue routes require walletDetails
// (only in Firestore on the pick docs) so they're not evaluated here —
// any Δw=1 plays are flagged as "AGS-check-needed" for downstream review.

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const HC_RATIO = 1.5;

// v7.5 floor — deltas-only routes (HC ≥ +1, Δw ≥ +2). Δw=1+AGS and AGS
// rescue routes require walletDetails (Firestore-only) so they're flagged
// separately as "AGS-check" rather than evaluated here.
function meetsV74FloorDeltas(dw, hc) {
  if (!Number.isFinite(dw)) return false;
  if (hc >= 1) return true;
  if (dw >= 2) return true;
  return false;
}
function needsAgsCheck(dw, hc) {
  if (!Number.isFinite(dw)) return false;
  return hc < 1 && dw === 1;
}

// Load wallet profiles → walletShort → bySport.whitelistTier map
const profSnap = await db.collection('sharpWalletProfiles').get();
const tierMap = new Map();
for (const d of profSnap.docs) {
  const p = d.data();
  if (!p?.bySport) continue;
  const m = {};
  for (const [s, r] of Object.entries(p.bySport)) if (r?.whitelistTier) m[s] = r.whitelistTier;
  tierMap.set(d.id, m);
}
const whitelistTier = (walletAddr, sport) => {
  const short = String(walletAddr || '').slice(-6).toLowerCase();
  return tierMap.get(short)?.[sport] || null;
};

// Load existing Firestore docs for cross-check
const existingByGameSide = new Map();
for (const [col, mkt] of [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']]) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    for (const [k, sd] of Object.entries(d.sides || {})) {
      const key = `${d.sport}|${d.gameKey}|${mkt}|${k}`;
      existingByGameSide.set(key, {
        lockStage: sd.lockStage, status: sd.health?.status, units: sd.v8_agsUnitsApplied,
        team: sd.team || k,
      });
    }
  }
}

// Re-implement consensus from positions.
// Mimics computeWalletConsensus + the contribution computation but
// reads from JSON-shaped positions (no v8_walletContribution field, so
// we use the ContributionTier proxy: walletBase × convictionMult ≥ 30
// would be needed — but JSON doesn't have walletBase either. We use
// the Polymarket position fields the browser also has: sportPnl,
// avgSportBet, invested. For Δq we approximate qualityMargin using
// "wallets where invested ≥ 1.5× avgSportBet AND profile is whitelisted".
// This approximates v8_walletContribution ≥ 30 closely enough for
// audit purposes — exact contribution is computed client-side and
// requires the full V8 normalizer.
function consensus(positions, mySide, sport) {
  let forW = 0, agW = 0, qFor = 0, qAg = 0, hcF = 0, hcA = 0;
  // dedup wallet-side
  const seen = new Map();
  for (const p of positions || []) {
    const k = `${(p.wallet || '').toLowerCase()}|${p.side}`;
    const prev = seen.get(k);
    if (!prev || (p.invested || 0) > (prev.invested || 0)) seen.set(k, p);
  }
  for (const p of seen.values()) {
    const tier = whitelistTier(p.wallet, sport);
    const sr = p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0;
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      // Quality proxy: whitelisted AND moderately sized (sr ≥ 1.0)
      if (sr >= 1.0) {
        if (p.side === mySide) qFor++;
        else if (p.side) qAg++;
      }
      if (p.side === mySide) forW++;
      else if (p.side) agW++;
    }
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (p.side === mySide) hcF++;
      else if (p.side) hcA++;
    }
  }
  return { forW, agW, delta: forW - agW, qFor, qAg, qMargin: qFor - qAg, hcF, hcA, hcMargin: hcF - hcA };
}

const sharpML  = JSON.parse(readFileSync(join(REPO_ROOT, 'public', 'sharp_positions.json'), 'utf8'));
const sharpSPR = JSON.parse(readFileSync(join(REPO_ROOT, 'public', 'sharp_spread_positions.json'), 'utf8'));
const sharpTOT = JSON.parse(readFileSync(join(REPO_ROOT, 'public', 'sharp_total_positions.json'), 'utf8'));

const sources = [
  ['ML',     sharpML,  ['away', 'home']],
  ['SPREAD', sharpSPR, ['away', 'home']],
  ['TOTAL',  sharpTOT, ['over', 'under']],
];

const qualifying = [];
const agsCheck = [];
const subThreshold = [];

for (const [mkt, src, sides] of sources) {
  for (const sport of ['NBA', 'MLB', 'NHL', 'CBB']) {
    const games = src[sport] || {};
    for (const [gameKey, gd] of Object.entries(games)) {
      for (const side of sides) {
        const c = consensus(gd.positions || [], side, sport);
        if (c.delta === 0 && c.qMargin === 0 && c.hcMargin === 0 && c.forW === 0 && c.agW === 0) continue;
        const passes = meetsV74FloorDeltas(c.delta, c.hcMargin);
        const ags = needsAgsCheck(c.delta, c.hcMargin);
        const key = `${sport}|${gameKey}|${mkt}|${side}`;
        const exists = existingByGameSide.get(key);
        const route = c.hcMargin >= 1 ? 'HC' : (c.delta >= 2 ? 'Δw≥2' : (c.delta === 1 ? 'Δw=1?' : '—'));
        const row = { sport, mkt, gameKey, side, ...c, passes, exists, route, away: gd.away, home: gd.home };
        if (passes) qualifying.push(row);
        else if (ags) agsCheck.push(row);
        else if (c.forW > 0 || c.agW > 0) subThreshold.push(row);
      }
    }
  }
}

const fmt = (n) => Number.isFinite(n) ? (n >= 0 ? `+${n}` : `${n}`).padStart(3) : '  —';

console.log(`\n═══════════════════════════════════════════════════════════════════════════════`);
console.log(`  TODAY'S QUALIFYING PLAYS (v7.5 floor: HC≥+1 OR Δw≥+2 OR Δw=+1+AGS) — ${TODAY}`);
console.log(`═══════════════════════════════════════════════════════════════════════════════\n`);

console.log(`✅ PASSES v7.5 deltas floor (HC≥+1 OR Δw≥+2): ${qualifying.length}\n`);
qualifying.sort((a, b) => b.hcMargin - a.hcMargin || b.delta - a.delta);
console.log(`  ${'Sport'.padEnd(5)} ${'Mkt'.padEnd(7)} ${'Game / Side'.padEnd(35)} ${'Δw'.padStart(3)} ${'Δq'.padStart(3)} ${'HC'.padStart(3)} ${'route'.padEnd(5)} ${'in Firestore?'}`);
console.log(`  ${'─'.repeat(95)}`);
for (const r of qualifying) {
  let inFs;
  if (!r.exists) inFs = '❌ NOT WRITTEN';
  else if (r.exists.lockStage === 'LOCKED' && r.exists.status === 'ACTIVE') inFs = `✓ visible (${r.exists.units}u)`;
  else inFs = `⚠ ${r.exists.lockStage}/${r.exists.status} (${r.exists.units ?? '—'}u)`;
  const teamLabel = `${r.gameKey} / ${r.side}`;
  console.log(`  ${r.sport.padEnd(5)} ${r.mkt.padEnd(7)} ${teamLabel.padEnd(35)} ${fmt(r.delta)} ${fmt(r.qMargin)} ${fmt(r.hcMargin)} ${r.route.padEnd(5)} ${inFs}`);
}

console.log(`\n🔍 NEEDS AGS CHECK (Δw=+1, HC=0 — passes only if AGS ≥ +3 or AGS rescue ≥ +5): ${agsCheck.length}\n`);
if (agsCheck.length) {
  console.log(`  ${'Sport'.padEnd(5)} ${'Mkt'.padEnd(7)} ${'Game / Side'.padEnd(35)} ${'Δw'.padStart(3)} ${'HC'.padStart(3)} ${'in Firestore?'}`);
  console.log(`  ${'─'.repeat(85)}`);
  for (const r of agsCheck) {
    let inFs;
    if (!r.exists) inFs = '❌ NOT WRITTEN';
    else if (r.exists.lockStage === 'LOCKED' && r.exists.status === 'ACTIVE') inFs = `✓ visible (${r.exists.units}u)`;
    else inFs = `⚠ ${r.exists.lockStage}/${r.exists.status} (${r.exists.units ?? '—'}u)`;
    const teamLabel = `${r.gameKey} / ${r.side}`;
    console.log(`  ${r.sport.padEnd(5)} ${r.mkt.padEnd(7)} ${teamLabel.padEnd(35)} ${fmt(r.delta)} ${fmt(r.hcMargin)} ${inFs}`);
  }
}

console.log(`\n📋 Sub-threshold (whitelist activity but doesn't pass floor or AGS check): ${subThreshold.length} (not listed)`);
console.log(`\n═══════════════════════════════════════════════════════════════════════════════\n`);
process.exit(0);
