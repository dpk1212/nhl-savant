// Wider audit — scans EVERY game/market/side with sharp activity today
// (from sharp_action_positions) and computes the v7.4 deltas-based floor
// using the live whitelist. Any side that passes the floor SHOULD show
// as a locked pick. We then cross-check against the actual Firestore
// pick docs (sharpFlowPicks/Spreads/Totals) to flag missing locks.
//
// Read-only. Run after `node scripts/syncPickStateAuthoritative.js
// --force` so the Firestore state is current.

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
const NOW = Date.now();
const HC_RATIO = 1.5;
const QUALITY_CONTRIB_CUT = 30;

function meetsV74Floor(dw, dq, hc) {
  if (!Number.isFinite(dw) || !Number.isFinite(dq)) return false;
  const sum = dw + dq;
  return (hc >= 1) || (dw >= 1 && dq >= 1 && sum >= 5);
}

function dedupBySide(positions) {
  const seen = new Map();
  for (const p of positions || []) {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const k = `${short}|${p.side}`;
    const prev = seen.get(k);
    if (!prev || (p.invested || 0) > (prev.invested || 0)) seen.set(k, p);
  }
  return [...seen.values()];
}

function consensus(positions, mySide, sport, walletProfiles) {
  const out = { forW: 0, agW: 0, delta: 0, qFor: 0, qAg: 0, qMargin: 0, hcF: 0, hcA: 0, hcMargin: 0 };
  if (!Array.isArray(positions) || !mySide) return out;
  const dedup = dedupBySide(positions);
  for (const p of dedup) {
    const short = String(p.walletShort || p.wallet || '').slice(-6).toLowerCase();
    const profile = walletProfiles.get(short) || walletProfiles.get(short.toUpperCase());
    const tier = profile?.bySport?.[sport]?.whitelistTier || null;
    const sr = p.v8_sizeRatio != null
      ? p.v8_sizeRatio
      : (p.avgSportBet > 0 ? (p.invested || 0) / p.avgSportBet : 0);
    const c = p.v8_walletContribution ?? 0;
    if (c >= QUALITY_CONTRIB_CUT) {
      if (p.side === mySide) out.qFor++;
      else if (p.side) out.qAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (p.side === mySide) out.forW++;
      else if (p.side) out.agW++;
    }
    if (tier === 'CONFIRMED' && sr >= HC_RATIO) {
      if (p.side === mySide) out.hcF++;
      else if (p.side) out.hcA++;
    }
  }
  out.delta = out.forW - out.agW;
  out.qMargin = out.qFor - out.qAg;
  out.hcMargin = out.hcF - out.hcA;
  return out;
}

// Load wallet profiles
const walletProfiles = new Map();
const profSnap = await db.collection('sharpWalletProfiles').get();
for (const d of profSnap.docs) walletProfiles.set(d.id.toLowerCase(), d.data());

// Load all today's sharp_action_positions, grouped by (sport, gameKey, marketType, side)
const posSnap = await db.collection('sharp_action_positions').where('date', '==', TODAY).get();
const positions = [];
posSnap.forEach(d => positions.push({ _id: d.id, ...d.data() }));

const groups = new Map();
for (const p of positions) {
  const k = `${p.sport}|${p.gameKey}|${p.marketType}`;
  if (!groups.has(k)) groups.set(k, { sport: p.sport, gameKey: p.gameKey, mkt: p.marketType, positions: [], sides: new Set(), commenceTime: p.commenceTime });
  const g = groups.get(k);
  g.positions.push(p);
  if (p.side) g.sides.add(p.side);
}

// Load existing Firestore docs so we can flag missing locks
const existingByGameSide = new Map(); // `${sport}|${gameKey}|${mkt}|${side}` → side doc summary
for (const [col, mkt] of [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']]) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    for (const [k, sd] of Object.entries(d.sides || {})) {
      const key = `${d.sport}|${d.gameKey}|${mkt}|${k}`;
      existingByGameSide.set(key, {
        lockStage: sd.lockStage, status: sd.health?.status, units: sd.v8_agsUnitsApplied ?? null,
        promotedBy: sd.promotedBy ?? null, team: sd.team || k,
      });
    }
  }
}

// Iterate every (group, side) and compute v7.4 floor
const qualifying = [];
const failing = [];

for (const g of groups.values()) {
  const sides = g.mkt === 'TOTAL' ? ['over', 'under'] : ['home', 'away'];
  // Use the actual sides we observed in positions if they don't match the standard set
  const sideList = [...new Set([...sides, ...g.sides])];
  for (const side of sideList) {
    const c = consensus(g.positions, side, g.sport, walletProfiles);
    const passes = meetsV74Floor(c.delta, c.qMargin, c.hcMargin);
    const key = `${g.sport}|${g.gameKey}|${g.mkt}|${side}`;
    const existing = existingByGameSide.get(key);
    const route = c.hcMargin >= 1 && !(c.delta >= 1 && c.qMargin >= 1 && c.delta + c.qMargin >= 5)
      ? 'HC' : (c.delta >= 1 && c.qMargin >= 1 && c.delta + c.qMargin >= 5 ? 'Σ' : '—');
    const ct = typeof g.commenceTime === 'number' ? g.commenceTime
             : g.commenceTime?.toMillis ? g.commenceTime.toMillis()
             : g.commenceTime?._seconds ? g.commenceTime._seconds * 1000
             : null;
    const minsToGame = ct != null ? (ct - NOW) / 60000 : null;
    const row = {
      sport: g.sport, gameKey: g.gameKey, mkt: g.mkt, side,
      ...c, route, passes, existing, minsToGame, ct,
    };
    if (passes) qualifying.push(row);
    else failing.push(row);
  }
}

const fmt = (n, signed = true) => {
  if (!Number.isFinite(n)) return '  —';
  const s = signed ? (n >= 0 ? `+${n}` : `${n}`) : `${n}`;
  return s.padStart(3);
};

console.log(`\n═══════════════════════════════════════════════════════════════════════════════`);
console.log(`  EVERY SHARP-ACTIVE SIDE TODAY vs v7.4 FLOOR — ${TODAY}`);
console.log(`  groups=${groups.size}  positions=${positions.length}  walletProfiles=${walletProfiles.size}`);
console.log(`═══════════════════════════════════════════════════════════════════════════════\n`);

console.log(`✅ PASSES v7.4 floor (HC≥+1 OR Σ≥5 with both axes ≥+1): ${qualifying.length}\n`);
console.log(`  ${'Sport'.padEnd(5)} ${'Mkt'.padEnd(7)} ${'Game'.padEnd(20)} ${'Side'.padEnd(6)} ${'Δw'.padStart(3)} ${'Δq'.padStart(3)} ${'HC'.padStart(3)} ${'route'.padEnd(5)} ${'in Firestore?'.padEnd(28)} ${'ttg'}`);
console.log(`  ${'─'.repeat(115)}`);
qualifying.sort((a, b) => (b.delta + b.qMargin) - (a.delta + a.qMargin));
for (const r of qualifying) {
  let inFs;
  if (!r.existing) inFs = '❌ NOT WRITTEN';
  else if (r.existing.lockStage === 'LOCKED' && r.existing.status === 'ACTIVE') inFs = `✓ visible (${r.existing.units}u)`;
  else inFs = `⚠ ${r.existing.lockStage}/${r.existing.status} (${r.existing.units ?? '—'}u)`;
  const ttg = r.minsToGame == null ? '?' : r.minsToGame > 60 ? `T-${(r.minsToGame/60).toFixed(1)}h` : `T-${r.minsToGame.toFixed(0)}m`;
  console.log(`  ${(r.sport||'').padEnd(5)} ${r.mkt.padEnd(7)} ${r.gameKey.padEnd(20)} ${r.side.padEnd(6)} ${fmt(r.delta)} ${fmt(r.qMargin)} ${fmt(r.hcMargin)} ${r.route.padEnd(5)} ${inFs.padEnd(28)} ${ttg}`);
}

// Also flag any side written to Firestore as LOCKED that doesn't pass — that's the AGS-rescue cohort
const written = [...existingByGameSide.entries()].filter(([_, v]) => v.lockStage === 'LOCKED');
const writtenButNotPassing = written.filter(([k, _]) => !qualifying.some(q => `${q.sport}|${q.gameKey}|${q.mkt}|${q.side}` === k));
if (writtenButNotPassing.length) {
  console.log(`\n🛟 LOCKED in Firestore but FAILS v7.4 deltas — relying on AGS rescue or stale state:\n`);
  console.log(`  ${'Key'.padEnd(40)} ${'Team'.padEnd(20)} ${'lockStage'.padEnd(10)} ${'status'.padEnd(10)} ${'units'.padStart(6)} ${'promotedBy'}`);
  console.log(`  ${'─'.repeat(110)}`);
  for (const [k, v] of writtenButNotPassing) {
    console.log(`  ${k.padEnd(40)} ${(v.team||'').padEnd(20)} ${(v.lockStage||'').padEnd(10)} ${(v.status||'').padEnd(10)} ${(v.units != null ? v.units.toFixed(2)+'u' : '—').padStart(6)} ${v.promotedBy || '—'}`);
  }
}

console.log(`\n═══════════════════════════════════════════════════════════════════════════════\n`);
process.exit(0);
