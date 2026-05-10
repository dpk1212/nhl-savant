/**
 * threeSignalHeadToHead.js — empirical comparison of HC margin, Δw,
 * and AGS as predictors of pick outcome on the V6+ graded sample.
 *
 * Question: AGS was designed without explicit reference to HC margin
 * or Δw. Now that we have all three, which is strongest? And does
 * AGS carry MARGINAL information given the other two — or is it
 * already redundant with HC + Δw?
 *
 * Outputs five blocks:
 *   1. Univariate WR / flat-ROI by bucket of each signal
 *   2. Pairwise Pearson correlation between the three
 *   3. Conflict rows — when signals disagree, who's right?
 *   4. Conditional AGS — within each (HC, Δw) cell, does the AGS
 *      bucket still differentiate WR? (the "marginal info" check)
 *   5. Single-signal fire ladder — lift vs base by each signal alone.
 *
 * Universe: every in-dashboard graded V6+ pick with frozen
 * `peak.v8Scoring.walletDetails[]`. AGS is computed retrospectively
 * from those walletDetails using `aggregateSideProven` + `computeAgs`
 * (same formula production uses on every cycle), so the sample isn't
 * limited to the v7.5+ stamped subset. Δw + HC margin use frozen
 * stamps when present; otherwise recomputed from walletDetails using
 * current wallet-tier proxy (same approach the AGS calibration uses).
 *
 * Mirrors the universe convention used in scripts/_walletStackScore.mjs
 * (the original AGS design analysis): in-dashboard only — not
 * superseded, health ∉ {CANCELLED, MUTED}, lockStage ≠ SHADOW, peak
 * stars ≥ 2.5. This is the SHIPPED set (picks that actually reached
 * users), and it's what the original AGS calibration used.
 *
 * Run:  node scripts/threeSignalHeadToHead.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FALLBACK_CALIBRATION,
  aggregateSideProven,
  computeAgs,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const HC_RATIO = 1.5;

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
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const pad = (s, n) => String(s).padEnd(n);
const padR = (s, n) => String(s).padStart(n);

// ── Wallet tier lookup (same approach as _walletStackScore.mjs) ────────
// Whitelist filter — only CONFIRMED+FLAT wallets count toward proven
// aggregates. Tier-at-pick-time is not stored, so we use today's tier
// as a proxy. This is the same look-ahead caveat the AGS calibration
// itself accepts; keeps the analysis lockstep with production.
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);
let walletTiers = null;
async function loadWalletTiers() {
  if (walletTiers) return walletTiers;
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
  return walletTiers;
}
function walletPasses(walletShort, sport) {
  if (!walletShort) return false;
  const tier = walletTiers?.get(walletShort)?.[sport] || null;
  return PROVEN_TIERS.has(tier);
}

// ── Load AGS calibration (live Firestore, fallback hardcoded) ──────────
async function loadAgsCalibration() {
  try {
    const doc = await db.collection('agsCalibration').doc('current').get();
    if (doc.exists) {
      const d = doc.data();
      if (d?.normalizers) return d;
    }
  } catch {}
  return AGS_FALLBACK_CALIBRATION;
}

// ── Recompute HC margin from frozen walletDetails (current-tier proxy) ─
// HC = count of proven wallets with sizeRatio ≥ 1.5 on FOR side
//      minus same count on AGAINST side. Mirrors the production HC
//      definition used at scoring time.
function computeHcMarginFromWalletDetails(walletDetails, sideKey, sport) {
  if (!Array.isArray(walletDetails)) return null;
  let forHC = 0, agHC = 0;
  for (const w of walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    if (!walletPasses(w.wallet, sport)) continue;
    const ratio = Number(w.sizeRatio || 0);
    if (ratio < HC_RATIO) continue;
    if (w.side === sideKey) forHC += 1;
    else agHC += 1;
  }
  return forHC - agHC;
}

// ── Recompute Δw from frozen walletDetails (current-tier proxy) ────────
function computeDwFromWalletDetails(walletDetails, sideKey, sport) {
  if (!Array.isArray(walletDetails)) return null;
  let f = 0, a = 0;
  for (const w of walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    if (!walletPasses(w.wallet, sport)) continue;
    if (w.side === sideKey) f += 1;
    else a += 1;
  }
  return f - a;
}

// ── Load all in-dashboard graded V6+ sides ─────────────────────────────
// Mirrors scripts/_walletStackScore.mjs loadPicks() — the SHIPPED set
// (picks that actually reached users), filtered to the same in-dashboard
// criteria the original AGS calibration used.
async function loadGradedSample(calibration) {
  const rows = [];
  let counts = { graded: 0, withDetails: 0, kept: 0, skipNoDetails: 0, skipNoAgg: 0 };
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK';
      for (const [sideKey, side] of Object.entries(sides)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        counts.graded += 1;
        const peak = side.peak || side.lock || {};
        const peakStars = peak?.stars ?? 0;
        const lockStage = side.lockStage || null;
        const healthStatus = side.health?.status || null;
        const inDashboard = !side.superseded
          && healthStatus !== 'CANCELLED'
          && healthStatus !== 'MUTED'
          && lockStage !== 'SHADOW'
          && peakStars >= 2.5;
        if (!inDashboard) continue;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd) || wd.length === 0) { counts.skipNoDetails += 1; continue; }
        counts.withDetails += 1;

        const agg = aggregateSideProven(wd, sideKey, sport, walletPasses);
        if (!agg || (agg.forCount + agg.agCount) === 0) { counts.skipNoAgg += 1; continue; }

        const agsRes = computeAgs(agg, calibration);
        const ags = agsRes?.ags;
        if (ags == null || !Number.isFinite(ags)) continue;

        const dwFrozen  = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
        const hcFrozen  = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin) : null;
        const dw = (dwFrozen != null) ? dwFrozen : computeDwFromWalletDetails(wd, sideKey, sport);
        const hcMargin = (hcFrozen != null) ? hcFrozen : computeHcMarginFromWalletDetails(wd, sideKey, sport);

        const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds
                  ?? side?.lock?.odds     ?? side?.peak?.odds ?? 0;

        counts.kept += 1;
        rows.push({
          docId: doc.id,
          sport,
          date: d.date,
          market,
          sideKey,
          dw,
          hcMargin,
          ags,
          hcFrozen: hcFrozen != null,
          dwFrozen: dwFrozen != null,
          provenWallets: agg.forCount + agg.agCount,
          won: oc === 'WIN' ? 1 : 0,
          flat: flatProfit(Number(odds), oc === 'WIN'),
        });
      }
    }
  }
  return { rows, counts };
}

// ── Univariate WR / ROI by bucket ──────────────────────────────────────
function bucketStats(rows, label, getBucket, bucketOrder) {
  const buckets = new Map(bucketOrder.map(b => [b, []]));
  for (const r of rows) {
    const b = getBucket(r);
    if (b == null) continue;
    if (!buckets.has(b)) buckets.set(b, []);
    buckets.get(b).push(r);
  }
  console.log(`\n${label}`);
  console.log('  ' + pad('Bucket', 12) + ' | ' + padR('N', 4) + ' | ' + padR('W-L', 8) + ' | ' + padR('WR%', 6) + ' | ' + padR('flat ROI%', 10));
  console.log('  ' + '-'.repeat(56));
  for (const b of bucketOrder) {
    const bucket = buckets.get(b) || [];
    if (!bucket.length) {
      console.log('  ' + pad(b, 12) + ' | ' + padR('0', 4) + ' | ' + padR('—', 8) + ' | ' + padR('—', 6) + ' | ' + padR('—', 10));
      continue;
    }
    const wins = bucket.filter(r => r.won).length;
    const losses = bucket.length - wins;
    const wr = (wins / bucket.length) * 100;
    const roi = (bucket.reduce((s, r) => s + r.flat, 0) / bucket.length) * 100;
    console.log('  ' + pad(b, 12) + ' | ' + padR(bucket.length, 4) + ' | ' + padR(`${wins}-${losses}`, 8) + ' | ' + padR(wr.toFixed(1) + '%', 6) + ' | ' + padR((roi >= 0 ? '+' : '') + roi.toFixed(1) + '%', 10));
  }
}

// ── Pearson correlation ────────────────────────────────────────────────
function pearson(rows, x, y) {
  const xs = rows.map(r => r[x]);
  const ys = rows.map(r => r[y]);
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  if (dx === 0 || dy === 0) return 0;
  return num / Math.sqrt(dx * dy);
}

// ── Discordant-rows analysis ───────────────────────────────────────────
// Where do the three signals DISAGREE? Specifically:
//   - HC says yes (≥+1) but AGS says no (<0)
//   - AGS says yes (≥+3) but HC says no (≤0)
//   - Δw says yes (≥+2) but AGS says no (<0)
//   - AGS says yes (≥+3) but Δw says no (≤0)
function conflictAnalysis(rows) {
  const cells = [
    { label: 'HC≥+1 ∧ AGS<0',   match: r => r.hcMargin >= 1 && r.ags < 0 },
    { label: 'HC≥+1 ∧ AGS≥+3',  match: r => r.hcMargin >= 1 && r.ags >= 3 },
    { label: 'HC≤0  ∧ AGS≥+3',  match: r => r.hcMargin <= 0 && r.ags >= 3 },
    { label: 'HC≤0  ∧ AGS<0',   match: r => r.hcMargin <= 0 && r.ags < 0 },
    { label: 'Δw≥+2 ∧ AGS<0',   match: r => r.dw >= 2 && r.ags < 0 },
    { label: 'Δw≥+2 ∧ AGS≥+3',  match: r => r.dw >= 2 && r.ags >= 3 },
    { label: 'Δw≤0  ∧ AGS≥+3',  match: r => r.dw <= 0 && r.ags >= 3 },
    { label: 'Δw≤0  ∧ AGS<0',   match: r => r.dw <= 0 && r.ags < 0 },
    { label: 'HC≥+1 ∧ Δw≥+2 ∧ AGS≥+3 (all 3 say yes)', match: r => r.hcMargin >= 1 && r.dw >= 2 && r.ags >= 3 },
    { label: 'HC≤0  ∧ Δw≤0  ∧ AGS<0  (all 3 say no)',  match: r => r.hcMargin <= 0 && r.dw <= 0 && r.ags < 0 },
  ];
  console.log('\n  ' + pad('Conflict cell', 50) + ' | ' + padR('N', 4) + ' | ' + padR('W-L', 8) + ' | ' + padR('WR%', 6) + ' | ' + padR('flat ROI%', 10));
  console.log('  ' + '-'.repeat(94));
  for (const c of cells) {
    const cell = rows.filter(c.match);
    if (!cell.length) {
      console.log('  ' + pad(c.label, 50) + ' | ' + padR('0', 4) + ' | ' + padR('—', 8) + ' | ' + padR('—', 6) + ' | ' + padR('—', 10));
      continue;
    }
    const wins = cell.filter(r => r.won).length;
    const losses = cell.length - wins;
    const wr = (wins / cell.length) * 100;
    const roi = (cell.reduce((s, r) => s + r.flat, 0) / cell.length) * 100;
    console.log('  ' + pad(c.label, 50) + ' | ' + padR(cell.length, 4) + ' | ' + padR(`${wins}-${losses}`, 8) + ' | ' + padR(wr.toFixed(1) + '%', 6) + ' | ' + padR((roi >= 0 ? '+' : '') + roi.toFixed(1) + '%', 10));
  }
}

// ── Conditional AGS — does AGS still differentiate within (HC, Δw) cells? ──
function conditionalAgsByHc(rows) {
  const hcBuckets = [
    { key: 'HC≤0', match: r => r.hcMargin <= 0 },
    { key: 'HC=+1', match: r => r.hcMargin === 1 },
    { key: 'HC≥+2', match: r => r.hcMargin >= 2 },
  ];
  const agsBuckets = [
    { key: 'AGS<0', match: r => r.ags < 0 },
    { key: 'AGS 0-3', match: r => r.ags >= 0 && r.ags < 3 },
    { key: 'AGS≥+3', match: r => r.ags >= 3 },
  ];
  console.log('\n  ' + pad('HC bucket', 8) + ' | ' + pad('AGS bucket', 10) + ' | ' + padR('N', 4) + ' | ' + padR('W-L', 8) + ' | ' + padR('WR%', 6) + ' | ' + padR('flat ROI%', 10));
  console.log('  ' + '-'.repeat(60));
  for (const hc of hcBuckets) {
    for (const ag of agsBuckets) {
      const cell = rows.filter(r => hc.match(r) && ag.match(r));
      if (!cell.length) {
        console.log('  ' + pad(hc.key, 8) + ' | ' + pad(ag.key, 10) + ' | ' + padR('0', 4) + ' | ' + padR('—', 8) + ' | ' + padR('—', 6) + ' | ' + padR('—', 10));
        continue;
      }
      const wins = cell.filter(r => r.won).length;
      const wr = (wins / cell.length) * 100;
      const roi = (cell.reduce((s, r) => s + r.flat, 0) / cell.length) * 100;
      console.log('  ' + pad(hc.key, 8) + ' | ' + pad(ag.key, 10) + ' | ' + padR(cell.length, 4) + ' | ' + padR(`${wins}-${cell.length - wins}`, 8) + ' | ' + padR(wr.toFixed(1) + '%', 6) + ' | ' + padR((roi >= 0 ? '+' : '') + roi.toFixed(1) + '%', 10));
    }
  }
}

function conditionalAgsByDw(rows) {
  const dwBuckets = [
    { key: 'Δw≤0', match: r => r.dw <= 0 },
    { key: 'Δw=+1', match: r => r.dw === 1 },
    { key: 'Δw≥+2', match: r => r.dw >= 2 },
  ];
  const agsBuckets = [
    { key: 'AGS<0', match: r => r.ags < 0 },
    { key: 'AGS 0-3', match: r => r.ags >= 0 && r.ags < 3 },
    { key: 'AGS≥+3', match: r => r.ags >= 3 },
  ];
  console.log('\n  ' + pad('Δw bucket', 8) + ' | ' + pad('AGS bucket', 10) + ' | ' + padR('N', 4) + ' | ' + padR('W-L', 8) + ' | ' + padR('WR%', 6) + ' | ' + padR('flat ROI%', 10));
  console.log('  ' + '-'.repeat(60));
  for (const dw of dwBuckets) {
    for (const ag of agsBuckets) {
      const cell = rows.filter(r => dw.match(r) && ag.match(r));
      if (!cell.length) {
        console.log('  ' + pad(dw.key, 8) + ' | ' + pad(ag.key, 10) + ' | ' + padR('0', 4) + ' | ' + padR('—', 8) + ' | ' + padR('—', 6) + ' | ' + padR('—', 10));
        continue;
      }
      const wins = cell.filter(r => r.won).length;
      const wr = (wins / cell.length) * 100;
      const roi = (cell.reduce((s, r) => s + r.flat, 0) / cell.length) * 100;
      console.log('  ' + pad(dw.key, 8) + ' | ' + pad(ag.key, 10) + ' | ' + padR(cell.length, 4) + ' | ' + padR(`${wins}-${cell.length - wins}`, 8) + ' | ' + padR(wr.toFixed(1) + '%', 6) + ' | ' + padR((roi >= 0 ? '+' : '') + roi.toFixed(1) + '%', 10));
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────
(async () => {
  console.log(`Loading V6+ in-dashboard graded sample (same universe as AGS calibration)…`);
  await loadWalletTiers();
  console.log(`  wallet tier map: ${walletTiers.size} wallets`);
  const calibration = await loadAgsCalibration();
  console.log(`  AGS calibration: source=${calibration.source || (calibration === AGS_FALLBACK_CALIBRATION ? 'fallback' : 'firestore')}, sampleSize=${calibration.sampleSize ?? 'n/a'}`);

  const { rows, counts } = await loadGradedSample(calibration);
  console.log(`  graded sides scanned:    ${counts.graded}`);
  console.log(`  with frozen walletDetails: ${counts.withDetails}`);
  console.log(`  kept after AGS aggregate:  ${counts.kept}`);

  if (rows.length < 5) {
    console.log('  Sample too small — exiting.');
    process.exit(0);
  }

  const dateMin = rows.reduce((m, r) => (!m || r.date < m) ? r.date : m, null);
  const dateMax = rows.reduce((m, r) => (!m || r.date > m) ? r.date : m, null);
  const hcFrozenN = rows.filter(r => r.hcFrozen).length;
  const dwFrozenN = rows.filter(r => r.dwFrozen).length;
  console.log(`  date range: ${dateMin} → ${dateMax}`);
  console.log(`  HC margin: ${hcFrozenN}/${rows.length} from frozen stamp, rest recomputed from walletDetails`);
  console.log(`  Δw:        ${dwFrozenN}/${rows.length} from frozen stamp, rest recomputed from walletDetails`);

  const wins = rows.filter(r => r.won).length;
  const baseRoi = (rows.reduce((s, r) => s + r.flat, 0) / rows.length) * 100;
  console.log(`  Base rate: ${wins}-${rows.length - wins}  WR=${((wins / rows.length) * 100).toFixed(1)}%  flat ROI=${(baseRoi >= 0 ? '+' : '') + baseRoi.toFixed(1)}%`);

  // ── Univariate ────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  1. UNIVARIATE — each signal alone');
  console.log('══════════════════════════════════════════════════════════════');
  bucketStats(rows, '\n  HC margin:', r => {
    if (r.hcMargin <= -2) return 'HC≤-2';
    if (r.hcMargin === -1) return 'HC=-1';
    if (r.hcMargin === 0) return 'HC=0';
    if (r.hcMargin === 1) return 'HC=+1';
    return 'HC≥+2';
  }, ['HC≤-2', 'HC=-1', 'HC=0', 'HC=+1', 'HC≥+2']);

  bucketStats(rows, '\n  Δw (proven margin):', r => {
    if (r.dw <= -2) return 'Δw≤-2';
    if (r.dw === -1) return 'Δw=-1';
    if (r.dw === 0) return 'Δw=0';
    if (r.dw === 1) return 'Δw=+1';
    if (r.dw === 2) return 'Δw=+2';
    return 'Δw≥+3';
  }, ['Δw≤-2', 'Δw=-1', 'Δw=0', 'Δw=+1', 'Δw=+2', 'Δw≥+3']);

  bucketStats(rows, '\n  AGS:', r => {
    if (r.ags < -3) return 'AGS<-3';
    if (r.ags < 0) return 'AGS -3..0';
    if (r.ags < 3) return 'AGS 0..3';
    if (r.ags < 5) return 'AGS 3..5';
    if (r.ags < 7) return 'AGS 5..7';
    return 'AGS≥+7';
  }, ['AGS<-3', 'AGS -3..0', 'AGS 0..3', 'AGS 3..5', 'AGS 5..7', 'AGS≥+7']);

  // ── Pairwise correlation ─────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  2. PAIRWISE CORRELATION (Pearson r)');
  console.log('══════════════════════════════════════════════════════════════');
  const pairs = [['hcMargin', 'dw'], ['hcMargin', 'ags'], ['dw', 'ags']];
  console.log('');
  for (const [a, b] of pairs) {
    const r = pearson(rows, a, b);
    console.log(`  ${a.padEnd(10)} ↔ ${b.padEnd(10)} :  r = ${r >= 0 ? '+' : ''}${r.toFixed(3)}`);
  }
  console.log('\n  Reading: r ≈ 1 = signals carry the same info; r ≈ 0 = orthogonal (independent).');

  // ── Conflict analysis ────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  3. CONFLICT — when signals disagree, who is right?');
  console.log('══════════════════════════════════════════════════════════════');
  conflictAnalysis(rows);

  // ── Conditional AGS ──────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  4. CONDITIONAL AGS — does AGS add info GIVEN HC / Δw?');
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  4a. Within each HC bucket, does AGS still differentiate WR?');
  conditionalAgsByHc(rows);
  console.log('\n  4b. Within each Δw bucket, does AGS still differentiate WR?');
  conditionalAgsByDw(rows);

  // ── Signal-vs-signal direct comparison for picks where one fires ──────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  5. WHICH SIGNAL HAS THE STRONGEST FIRE?');
  console.log('══════════════════════════════════════════════════════════════');
  const fires = [
    { label: 'HC≥+2 fires',     match: r => r.hcMargin >= 2 },
    { label: 'HC≥+1 fires',     match: r => r.hcMargin >= 1 },
    { label: 'Δw≥+3 fires',     match: r => r.dw >= 3 },
    { label: 'Δw≥+2 fires',     match: r => r.dw >= 2 },
    { label: 'AGS≥+5 fires',    match: r => r.ags >= 5 },
    { label: 'AGS≥+3 fires',    match: r => r.ags >= 3 },
    { label: 'AGS≥0 fires',     match: r => r.ags >= 0 },
  ];
  console.log('\n  ' + pad('Signal', 18) + ' | ' + padR('N', 4) + ' | ' + padR('W-L', 8) + ' | ' + padR('WR%', 6) + ' | ' + padR('flat ROI%', 10) + ' | ' + padR('lift vs base', 13));
  console.log('  ' + '-'.repeat(80));
  for (const f of fires) {
    const cell = rows.filter(f.match);
    if (!cell.length) continue;
    const wins = cell.filter(r => r.won).length;
    const wr = (wins / cell.length) * 100;
    const roi = (cell.reduce((s, r) => s + r.flat, 0) / cell.length) * 100;
    const lift = roi - baseRoi;
    console.log('  ' + pad(f.label, 18) + ' | ' + padR(cell.length, 4) + ' | ' + padR(`${wins}-${cell.length - wins}`, 8) + ' | ' + padR(wr.toFixed(1) + '%', 6) + ' | ' + padR((roi >= 0 ? '+' : '') + roi.toFixed(1) + '%', 10) + ' | ' + padR((lift >= 0 ? '+' : '') + lift.toFixed(1) + 'pp', 13));
  }

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
