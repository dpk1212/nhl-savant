// Score today's picks on the AGS (AggregateScore) scale.
//
// Methodology:
//   1. Load the historical V6 sample (graded, dashboard-filtered, whitelist-only
//      aggregates) and compute z-score normalizers (mean, SD) for each of
//      the 6 AGS features. Also compute the historical AGS distribution
//      so we can place today's picks into quintiles.
//   2. Load today's picks (every side, regardless of current dashboard
//      state — we want to see where everything lands).
//   3. Score each side with whitelist-filtered aggregates and the
//      historical normalizers.
//   4. Print a ranked table with AGS, cohort tier, HC, Δw, current
//      lock state, and the recommendation under the AGS scale.
//
// Same input contract as _walletStackScore.mjs:
//   - Per-wallet metrics from frozen peak.v8Scoring.walletDetails[]
//   - Whitelist filter using current sharpWalletProfiles tier
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FEATURES,
  AGS_LOCK_FLOOR,
  AGS_MUTE_FLOOR,
  AGS_MIN_PROVEN_WALLETS,
  aggregateSideProven,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
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

const V6_CUTOVER = '2026-04-18';
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];

// ── Wallet tier map ────────────────────────────────────────────────────────
let walletTiers = null;
async function loadWalletTiers() {
  walletTiers = new Map();
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) {
    const p = d.data();
    if (!p?.bySport) continue;
    const map = {};
    for (const [sport, rec] of Object.entries(p.bySport)) {
      if (rec?.whitelistTier) map[sport] = rec.whitelistTier;
    }
    walletTiers.set(d.id, map);
  }
}
function tierFor(walletShort, sport) {
  if (!walletShort) return null;
  return walletTiers?.get(walletShort)?.[sport] || null;
}
function isProven(walletShort, sport) {
  const t = tierFor(walletShort, sport);
  return t === 'CONFIRMED' || t === 'FLAT';
}

// Adapter so the shared aggregator gets the right tier predicate.
function aggregateSide(walletDetails, sideKey, sport) {
  return aggregateSideProven(walletDetails, sideKey, sport, isProven);
}

// ── Today's date in ET ─────────────────────────────────────────────────────
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// ── Step 1: load historical sample, compute normalizers + AGS distribution ─
console.log(`[score-today] today (ET): ${TODAY}`);
console.log('[score-today] loading wallet tier map…');
await loadWalletTiers();
console.log(`[score-today] tier map loaded — ${walletTiers.size} wallets`);

console.log('[score-today] loading historical V6 sample for normalizers…');
const histRows = [];
for (const [col] of PICK_COLS) {
  const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const sides = d.sides || {};
    const sport = d.sport || 'UNK';
    for (const [sideKey, side] of Object.entries(sides)) {
      const oc = side?.result?.outcome;
      if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
      const peak = side.peak || side.lock || {};
      const peakStars = peak?.stars ?? 0;
      const lockStage = side.lockStage || null;
      const healthStatus = side.health?.status || null;
      const inDashboard = !side.superseded && healthStatus !== 'CANCELLED' && healthStatus !== 'MUTED' && lockStage !== 'SHADOW' && peakStars >= 2.5;
      if (!inDashboard) continue;
      const wd = peak?.v8Scoring?.walletDetails;
      if (!Array.isArray(wd) || wd.length === 0) continue;
      const agg = aggregateSide(wd, sideKey, sport);
      if (!agg || (agg.forCount + agg.agCount) === 0) continue;
      histRows.push(agg);
    }
  }
}
console.log(`[score-today] historical sample N=${histRows.length}`);

// Normalizers: mean and SD per feature (recomputed from the historical
// sample on every run so this script tracks the latest data even when
// the production calibration hasn't refreshed yet).
const norm = {};
for (const f of AGS_FEATURES) {
  const xs = histRows.map(r => Number(r[f.key] || 0));
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1);
  const sd = Math.sqrt(v) || 1;
  norm[f.key] = { m, sd };
}
console.log('[score-today] normalizers:');
for (const f of AGS_FEATURES) console.log(`  ${f.key.padEnd(18)} mean=${norm[f.key].m.toFixed(2)}  sd=${norm[f.key].sd.toFixed(2)}`);

// Score every historical row to learn the distribution
function scoreRow(agg) {
  let s = 0;
  const parts = {};
  for (const f of AGS_FEATURES) {
    const z = (Number(agg[f.key] || 0) - norm[f.key].m) / norm[f.key].sd;
    parts[f.key] = z;
    s += f.sign * z;
  }
  return { ags: s, parts };
}
const histAgs = histRows.map(r => scoreRow(r).ags).sort((a, b) => a - b);
function pct(arr, p) { return arr[Math.max(0, Math.min(arr.length - 1, Math.floor(p * (arr.length - 1))))]; }
const Q = { q20: pct(histAgs, 0.20), q40: pct(histAgs, 0.40), q60: pct(histAgs, 0.60), q80: pct(histAgs, 0.80), q90: pct(histAgs, 0.90) };
function quintile(ags) {
  if (ags <= Q.q20) return 'Q1 (worst — 19% WR)';
  if (ags <= Q.q40) return 'Q2 (35% WR)';
  if (ags <= Q.q60) return 'Q3 (57% WR)';
  if (ags <= Q.q80) return 'Q4 (48% WR)';
  return 'Q5 (best — 90% WR)';
}
function tier(ags) {
  if (ags >= 7) return '🟢 ELITE  (AGS ≥ +7 → 100% WR, N=4)';
  if (ags >= 5) return '🟢 LOCK   (AGS ≥ +5 → 92.9% WR, N=14)';
  if (ags >= 3) return '🟢 STRONG (AGS ≥ +3 → 73.7% WR, N=38)';
  if (ags >= 0) return '🟡 NEUTRAL+';
  if (ags >= -3) return '🔴 WEAK';
  return '🔴 FADE   (Q1 historical: 19% WR)';
}
console.log(`[score-today] AGS quintile boundaries: Q20=${Q.q20.toFixed(2)} Q40=${Q.q40.toFixed(2)} Q60=${Q.q60.toFixed(2)} Q80=${Q.q80.toFixed(2)} Q90=${Q.q90.toFixed(2)}`);

// ── Step 2: load today's picks ─────────────────────────────────────────────
console.log(`[score-today] loading today's picks (date=${TODAY})…`);
const today = [];
for (const [col, market] of PICK_COLS) {
  const snap = await db.collection(col).where('date', '==', TODAY).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const sides = d.sides || {};
    const sport = d.sport || 'UNK';
    for (const [sideKey, side] of Object.entries(sides)) {
      const peak = side.peak || side.lock || {};
      const wd = peak?.v8Scoring?.walletDetails;
      if (!Array.isArray(wd) || wd.length === 0) {
        today.push({
          docId: doc.id, market, sport, sideKey,
          team: side.team || sideKey,
          away: d.away, home: d.home,
          commenceTime: d.commenceTime,
          lockStage: side.lockStage,
          health: side.health?.status || null,
          peakStars: peak?.stars ?? null,
          peakUnits: peak?.units ?? null,
          hcMargin: side.v8_hcMargin ?? null,
          dwFrozen: side.v8_walletConsensusDelta ?? null,
          missing: 'no walletDetails',
          ags: null,
        });
        continue;
      }
      const agg = aggregateSide(wd, sideKey, sport);
      if (!agg || (agg.forCount + agg.agCount) === 0) {
        today.push({
          docId: doc.id, market, sport, sideKey,
          team: side.team || sideKey,
          away: d.away, home: d.home,
          commenceTime: d.commenceTime,
          lockStage: side.lockStage,
          health: side.health?.status || null,
          peakStars: peak?.stars ?? null,
          peakUnits: peak?.units ?? null,
          hcMargin: side.v8_hcMargin ?? null,
          dwFrozen: side.v8_walletConsensusDelta ?? null,
          missing: 'no proven wallets in walletDetails',
          ags: null,
          totalRaw: agg?.totalRaw ?? 0,
          provenRaw: agg?.provenRaw ?? 0,
        });
        continue;
      }
      const { ags, parts } = scoreRow(agg);
      today.push({
        docId: doc.id, market, sport, sideKey,
        team: side.team || sideKey,
        away: d.away, home: d.home,
        commenceTime: d.commenceTime,
        lockStage: side.lockStage,
        health: side.health?.status || null,
        peakStars: peak?.stars ?? null,
        peakUnits: peak?.units ?? null,
        hcMargin: side.v8_hcMargin ?? null,
        dwFrozen: side.v8_walletConsensusDelta ?? null,
        ags, parts, agg,
      });
    }
  }
}
console.log(`[score-today] today's picks loaded: ${today.length} sides across ${new Set(today.map(t => t.docId)).size} games`);

// ── Step 3: print ranked table ─────────────────────────────────────────────
today.sort((a, b) => (b.ags ?? -999) - (a.ags ?? -999));

const fmtSign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const fmtCommence = (ms) => {
  if (!ms) return '—';
  const dt = new Date(Number(ms));
  return dt.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }) + ' ET';
};

console.log('');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════════════════');
console.log(`  TODAY'S PICKS ON THE AGS SCALE  (${TODAY} — ${today.length} sides, ${new Set(today.map(t => t.docId)).size} games)`);
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════════════════');
console.log('');
console.log('  AGS scale (whitelist-filtered, V6 historical, N=104):');
console.log('    AGS ≥ +7 → 🟢 ELITE   (100% WR,  N= 4)  ← top of all V6');
console.log('    AGS ≥ +5 → 🟢 LOCK    (92.9% WR, N=14)');
console.log('    AGS ≥ +3 → 🟢 STRONG  (73.7% WR, N=38)');
console.log('    AGS ≥  0 → 🟡 NEUTRAL+ (above the median)');
console.log('    AGS <  0 → 🔴 WEAK');
console.log('    Q1 (~AGS ≤ ' + Q.q20.toFixed(1) + ') → 🔴 FADE candidate (19% WR historical)');
console.log('');

for (const t of today) {
  const matchup = t.away && t.home ? `${t.away} @ ${t.home}` : '—';
  const sideLabel = t.market === 'TOTAL' ? (t.sideKey?.toUpperCase()) : (t.team || t.sideKey);
  const startStr = fmtCommence(t.commenceTime);
  const stateBits = [];
  if (t.lockStage) stateBits.push(t.lockStage);
  if (t.health && t.health !== 'ACTIVE') stateBits.push(t.health);
  const state = stateBits.join('/') || 'no-stage';
  console.log(`──────────────────────────────────────────────────────────────────────────────────────────`);
  console.log(`  ${matchup}  ${t.market}: ${sideLabel}   [${t.sport}, ${startStr}]`);
  if (t.ags == null) {
    console.log(`  ⚠️  ${t.missing}  (totalWalletDetails=${t.totalRaw ?? '?'}, provenWalletDetails=${t.provenRaw ?? '?'})`);
    console.log(`  Current state: stars=${t.peakStars ?? '—'}  units=${t.peakUnits ?? '—'}u  HC=${fmtSign(t.hcMargin)}  Δw=${fmtSign(t.dwFrozen)}  ${state}`);
    continue;
  }
  console.log(`  AGS = ${fmtSign(t.ags, 2)}    →   ${tier(t.ags)}   |   ${quintile(t.ags)}`);
  console.log(`  Reference signals : HC=${fmtSign(t.hcMargin)}   Δw=${fmtSign(t.dwFrozen)}   stars=${t.peakStars ?? '—'}   units=${t.peakUnits ?? '—'}u   state=${state}`);
  console.log(`  Proven wallets    : FOR ${t.agg.forCount}  vs AGAINST ${t.agg.agCount}   (raw walletDetails: ${t.agg.provenRaw}/${t.agg.totalRaw} are proven)`);
  console.log(`  Proven $          : FOR $${Math.round(t.agg.forInvested).toLocaleString()}   AGAINST $${Math.round(t.agg.agInvested).toLocaleString()}`);
  console.log(`  AGS components    : ${AGS_FEATURES.map(f => `${f.key.replace(/^d/, 'Δ').slice(0, 8)}=${fmtSign(t.parts[f.key], 2)}`).join('  ')}`);
}
console.log('──────────────────────────────────────────────────────────────────────────────────────────');
console.log('');

// ── Headline counts ────────────────────────────────────────────────────────
const buckets = { elite: 0, lock: 0, strong: 0, neutral: 0, weak: 0, fade: 0 };
for (const t of today) {
  if (t.ags == null) continue;
  if (t.ags >= 7) buckets.elite += 1;
  else if (t.ags >= 5) buckets.lock += 1;
  else if (t.ags >= 3) buckets.strong += 1;
  else if (t.ags >= 0) buckets.neutral += 1;
  else if (t.ags >= -3) buckets.weak += 1;
  else buckets.fade += 1;
}
console.log(`SUMMARY  →  ELITE=${buckets.elite}  LOCK=${buckets.lock}  STRONG=${buckets.strong}  NEUTRAL=${buckets.neutral}  WEAK=${buckets.weak}  FADE=${buckets.fade}`);

process.exit(0);
