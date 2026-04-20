/**
 * V8 Picks — "Qualified Sharp" Count & Margin Scaling
 *
 * Tests two hypotheses on our *own* V8 picks (sharpFlowPicks + Spreads + Totals):
 *   H1 (count):  as the number of sharps with (good ROI) AND (above-average bet)
 *                on the pick side grows, do WR / flat ROI / pool ROI rise?
 *   H2 (margin): as the difference between qualified-for and qualified-against
 *                grows, do WR / flat ROI / pool ROI rise?
 *
 * Includes BOTH locked and shadow picks (per user request).
 * Excludes: superseded, non-COMPLETED, PUSH.
 *
 * Usage:
 *   cd nhl-savant
 *   node scripts/qualifiedSharpScaling.js
 *   node scripts/qualifiedSharpScaling.js --roi=50 --size=1
 *   node scripts/qualifiedSharpScaling.js --roi=60 --size=1.25 --min-n=5
 *   node scripts/qualifiedSharpScaling.js --json
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function initFirebase() {
  if (!admin.apps.length) {
    const sakPath = join(__dirname, '../serviceAccountKey.json');
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
  return admin.firestore();
}

function argNum(name, def) {
  const raw = process.argv.find((a) => a.startsWith(`${name}=`));
  if (!raw) return def;
  const v = Number(raw.split('=')[1]);
  return Number.isFinite(v) ? v : def;
}

const ROI_THRESH = argNum('--roi', 50);     // wallet roiNorm percentile cutoff (0..100)
const SIZE_THRESH = argNum('--size', 1.0);  // sizeRatio: invested / avgSportBet cutoff
const MIN_N = argNum('--min-n', 3);
const AS_JSON = process.argv.includes('--json');

function americanToImplied(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function avg(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }
function fmtPct(x) {
  if (x == null || !isFinite(x)) return '—';
  return (x * 100).toFixed(2) + '%';
}
function fmtSigned(x) {
  if (x == null || !isFinite(x)) return '—';
  const s = x >= 0 ? '+' : '';
  return s + (x * 100).toFixed(2) + '%';
}

/** Spearman ρ (no ties correction) */
function spearman(x, y) {
  if (!Array.isArray(x) || x.length !== y.length || x.length < 3) return null;
  const n = x.length;
  const rank = (arr) => {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const ranks = new Array(n);
    for (let i = 0; i < n; i++) ranks[sorted[i].i] = i + 1;
    return ranks;
  };
  const rx = rank(x), ry = rank(y);
  const d2 = rx.reduce((s, r, i) => s + (r - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}

async function exportPicks(db) {
  const cols = [
    ['sharpFlowPicks', 'ML'],
    ['sharpFlowSpreads', 'SPREAD'],
    ['sharpFlowTotals', 'TOTAL'],
  ];
  const rows = [];
  for (const [colName, mktType] of cols) {
    const snap = await db.collection(colName).get();
    snap.forEach((doc) => {
      const data = doc.data();
      if (!data.sides) return;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        if (sd.superseded) continue;
        const res = sd.result || data.result;
        if (!res?.outcome || res.outcome === 'PUSH') continue;

        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const v8 = (pk?.v8Scoring) || (lk?.v8Scoring) || null;
        if (!v8 || !Array.isArray(v8.walletDetails)) continue;

        const lockOdds = lk?.odds || 0;
        const flatWinAmt = res.outcome === 'WIN'
          ? (lockOdds < 0 ? 100 / Math.abs(lockOdds) : lockOdds / 100)
          : -1;
        const won = res.outcome === 'WIN' ? 1 : 0;

        // Classify each wallet as "for" (same side as the pick) or "against".
        let qFor = 0, qAgainst = 0;
        let walletsFor = 0, walletsAgainst = 0;
        for (const w of v8.walletDetails) {
          const isFor = w.side === sideKey;
          if (isFor) walletsFor++; else walletsAgainst++;
          const roiOk = (w.roiNorm ?? 0) >= ROI_THRESH;
          const sizeOk = (w.sizeRatio ?? 0) >= SIZE_THRESH;
          if (roiOk && sizeOk) {
            if (isFor) qFor++; else qAgainst++;
          }
        }

        rows.push({
          date: data.date,
          sport: data.sport || 'NHL',
          marketType: mktType,
          sideKey,
          lockStage: sd.lockStage || 'SHADOW',
          won,
          flatProfit: flatWinAmt, // per unit staked
          lockOdds,
          lockUnits: lk?.units || 0,
          peakUnits: pk?.units || 0,
          stars: pk?.stars || lk?.stars || 0,
          regime: pk?.regime || lk?.regime || 'NO_MOVE',
          wps: v8.walletPlayScore ?? null,
          walletsFor,
          walletsAgainst,
          qFor,
          qAgainst,
          margin: qFor - qAgainst,
        });
      }
    });
  }
  return rows;
}

function agg(rows) {
  if (!rows.length) return null;
  const n = rows.length;
  const wins = rows.filter((r) => r.won).length;
  const flatRoi = avg(rows.map((r) => r.flatProfit));
  // Unit-weighted: sum(profit * units) / sum(units) — profit already is unit ROI for 1 unit
  const totalU = rows.reduce((s, r) => s + (r.peakUnits || 0), 0);
  const unitWeightedRoi = totalU > 0
    ? rows.reduce((s, r) => s + r.flatProfit * (r.peakUnits || 0), 0) / totalU
    : null;
  return {
    n,
    wr: wins / n,
    flatRoi,
    unitWeightedRoi,
    meanStars: avg(rows.map((r) => r.stars || 0)),
    meanWps: avg(rows.map((r) => (r.wps ?? 0))),
    meanMargin: avg(rows.map((r) => r.margin)),
  };
}

function fmtRow(label, a) {
  if (!a) return `${label.padEnd(34)} | (empty)`;
  return [
    label.padEnd(34),
    String(a.n).padStart(5),
    fmtPct(a.wr).padStart(8),
    fmtSigned(a.flatRoi).padStart(10),
    fmtSigned(a.unitWeightedRoi).padStart(10),
    a.meanStars.toFixed(2).padStart(6),
    a.meanWps.toFixed(2).padStart(6),
  ].join(' | ');
}

function renderTable(title, buckets) {
  const header = ['Bucket'.padEnd(34), '    N', '      WR', '  flatROI', 'wtdROI(u)', ' stars', '   WPS'].join(' | ');
  console.log('\n' + title);
  console.log(header);
  console.log('-'.repeat(header.length));
  for (const b of buckets) console.log(fmtRow(b.label, b.a));
}

function bucketBy(rows, key, buckets) {
  return buckets.map((b) => {
    const sub = rows.filter((r) => b.test(r[key], r));
    return { label: b.label, a: agg(sub), sub };
  });
}

function spearmanOnRows(rows, keyX, keyY) {
  const xs = [], ys = [];
  for (const r of rows) {
    const x = r[keyX]; const y = r[keyY];
    if (x == null || y == null || !isFinite(x) || !isFinite(y)) continue;
    xs.push(x); ys.push(y);
  }
  return spearman(xs, ys);
}

async function main() {
  const db = initFirebase();
  const rows = await exportPicks(db);

  if (!rows.length) {
    console.log('No completed V8 picks found.');
    process.exit(0);
  }

  const base = agg(rows);
  const locked = rows.filter((r) => r.lockStage === 'LOCKED');
  const shadow = rows.filter((r) => r.lockStage === 'SHADOW');

  if (!AS_JSON) {
    console.log('\n=== V8 Picks: Qualified-Sharp Scaling ===');
    console.log(`Qualified sharp = roiNorm ≥ ${ROI_THRESH} AND sizeRatio ≥ ${SIZE_THRESH}`);
    console.log(`Scope: completed (non-push) picks; both LOCKED and SHADOW included.`);
    console.log(`N total = ${rows.length}  (LOCKED=${locked.length}, SHADOW=${shadow.length})`);
    console.log(`Baseline: WR ${fmtPct(base.wr)} | flat ROI ${fmtSigned(base.flatRoi)} | unit-wtd ROI ${fmtSigned(base.unitWeightedRoi)} | mean★ ${base.meanStars.toFixed(2)} | mean WPS ${base.meanWps.toFixed(2)}`);
    console.log(`Mean margin (qFor − qAgainst) = ${base.meanMargin.toFixed(2)}`);
  }

  // ── H1: qualified-for count buckets ───────────────────────────────────────
  const forBuckets = [
    { label: '0 qualified for', test: (v) => v === 0 },
    { label: '1 qualified for', test: (v) => v === 1 },
    { label: '2 qualified for', test: (v) => v === 2 },
    { label: '3 qualified for', test: (v) => v === 3 },
    { label: '4+ qualified for', test: (v) => v >= 4 },
  ];
  const byFor = bucketBy(rows, 'qFor', forBuckets);
  if (!AS_JSON) renderTable('H1 — Qualified-sharp COUNT on pick side (all markets)', byFor.filter((b) => b.a && b.a.n >= MIN_N));

  // Monotonicity check on H1
  const ordered = byFor.filter((b) => b.a && b.a.n >= MIN_N);
  const wrSeries = ordered.map((b) => b.a.wr);
  const roiSeries = ordered.map((b) => b.a.flatRoi);
  const levels = ordered.map((_, i) => i);
  if (!AS_JSON && ordered.length >= 3) {
    const rhoWr = spearman(levels, wrSeries);
    const rhoRoi = spearman(levels, roiSeries);
    console.log(`H1 monotonicity: ρ(bucket rank, WR) = ${rhoWr == null ? '—' : rhoWr.toFixed(3)} | ρ(bucket rank, flat ROI) = ${rhoRoi == null ? '—' : rhoRoi.toFixed(3)}`);
  }

  // Per-pick ρ (continuous) between qFor and outcomes
  if (!AS_JSON) {
    const rhoWrRaw = spearmanOnRows(rows, 'qFor', 'won');
    const rhoRoiRaw = spearmanOnRows(rows, 'qFor', 'flatProfit');
    console.log(`H1 per-pick:    ρ(qFor, won) = ${rhoWrRaw == null ? '—' : rhoWrRaw.toFixed(3)} | ρ(qFor, flat profit) = ${rhoRoiRaw == null ? '—' : rhoRoiRaw.toFixed(3)}`);
  }

  // ── H2: margin buckets ────────────────────────────────────────────────────
  const marginBuckets = [
    { label: 'margin ≤ −1', test: (v) => v <= -1 },
    { label: 'margin  0', test: (v) => v === 0 },
    { label: 'margin +1', test: (v) => v === 1 },
    { label: 'margin +2', test: (v) => v === 2 },
    { label: 'margin +3', test: (v) => v === 3 },
    { label: 'margin ≥ +4', test: (v) => v >= 4 },
  ];
  const byMargin = bucketBy(rows, 'margin', marginBuckets);
  if (!AS_JSON) renderTable('H2 — Qualified MARGIN (qFor − qAgainst)', byMargin.filter((b) => b.a && b.a.n >= MIN_N));

  const orderedM = byMargin.filter((b) => b.a && b.a.n >= MIN_N);
  if (!AS_JSON && orderedM.length >= 3) {
    const wr2 = orderedM.map((b) => b.a.wr);
    const roi2 = orderedM.map((b) => b.a.flatRoi);
    const lv2 = orderedM.map((_, i) => i);
    const rhoWr = spearman(lv2, wr2);
    const rhoRoi = spearman(lv2, roi2);
    console.log(`H2 monotonicity: ρ(bucket rank, WR) = ${rhoWr == null ? '—' : rhoWr.toFixed(3)} | ρ(bucket rank, flat ROI) = ${rhoRoi == null ? '—' : rhoRoi.toFixed(3)}`);

    const rhoWrRaw = spearmanOnRows(rows, 'margin', 'won');
    const rhoRoiRaw = spearmanOnRows(rows, 'margin', 'flatProfit');
    console.log(`H2 per-pick:    ρ(margin, won) = ${rhoWrRaw == null ? '—' : rhoWrRaw.toFixed(3)} | ρ(margin, flat profit) = ${rhoRoiRaw == null ? '—' : rhoRoiRaw.toFixed(3)}`);
  }

  // ── Per-market drill (bonus) ─────────────────────────────────────────────
  if (!AS_JSON) {
    for (const mkt of ['ML', 'SPREAD', 'TOTAL']) {
      const sub = rows.filter((r) => r.marketType === mkt);
      if (sub.length < MIN_N) continue;
      const byForMkt = bucketBy(sub, 'qFor', forBuckets).filter((b) => b.a && b.a.n >= MIN_N);
      if (byForMkt.length) renderTable(`H1 by market — ${mkt} (N=${sub.length})`, byForMkt);
      const byMarginMkt = bucketBy(sub, 'margin', marginBuckets).filter((b) => b.a && b.a.n >= MIN_N);
      if (byMarginMkt.length) renderTable(`H2 by market — ${mkt} (N=${sub.length})`, byMarginMkt);
    }
  }

  // ── LOCKED-only cut (cleanest subset) ────────────────────────────────────
  if (!AS_JSON && locked.length >= MIN_N) {
    const byForLocked = bucketBy(locked, 'qFor', forBuckets).filter((b) => b.a && b.a.n >= MIN_N);
    if (byForLocked.length) renderTable(`H1 — LOCKED only (N=${locked.length})`, byForLocked);
    const byMarginLocked = bucketBy(locked, 'margin', marginBuckets).filter((b) => b.a && b.a.n >= MIN_N);
    if (byMarginLocked.length) renderTable(`H2 — LOCKED only (N=${locked.length})`, byMarginLocked);
  }

  if (AS_JSON) {
    console.log(JSON.stringify({ thresholds: { ROI_THRESH, SIZE_THRESH }, base, byFor, byMargin }, null, 2));
  }

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
