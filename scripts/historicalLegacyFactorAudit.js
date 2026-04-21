/**
 * historicalLegacyFactorAudit.js — Option A: full-history analysis
 * using only LEGACY proxies that have been stored on every sharpFlow pick
 * since the collection was created.
 *
 * Why: we can't compute maxRoiN_F / meanBase_F for pre-V8 picks because
 * walletDetails was never stored on those docs. But we DID store aggregate
 * wallet-quality proxies (walletProfile.{dominantTier, conviction,
 * concentration, breadth}, consensusStrength.{grade, moneyPct, walletPct},
 * stars, regime, evEdge, sharpCount, etc.). If ANY of those legacy proxies
 * historically predicted winners over the full 38-day, ~611-pick sample,
 * that's strong supportive evidence for the direction V8.3 is pushing.
 *
 * Also emits a "V8-proxy correspondence" section: inside the V8-era slice,
 * it compares each legacy proxy against true maxRoiN_F/meanBase_F to see
 * which legacy field is the best stand-in for the V8 signal.
 *
 * Writes:  nhl-savant/LEGACY_FACTOR_AUDIT.md
 * Usage:   node scripts/historicalLegacyFactorAudit.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
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
const V8_CUTOVER = '2026-04-18';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const profit = (odds, units, won) => (won ? +(units * (americanToDecimal(odds) - 1)).toFixed(3) : -units);
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);

function agg(rows) {
  if (!rows.length) return { n: 0, wr: 0, flatRoi: 0, wtdRoi: 0, flatPnl: 0, pnl: 0 };
  const n = rows.length;
  const wins = rows.filter(r => r.won === 1).length;
  const wr = (wins / n) * 100;
  const flatPnl = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flatPnl / n) * 100;
  const totalU = rows.reduce((s, r) => s + (r.units || 0), 0);
  const pnl = rows.reduce((s, r) => s + r.pnl, 0);
  const wtdRoi = totalU > 0 ? (pnl / totalU) * 100 : 0;
  return { n, wr, flatRoi, wtdRoi, flatPnl, pnl };
}

const sign = (v, digits = 1) => (v >= 0 ? '+' : '') + v.toFixed(digits);
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;
const fmtAgg = (a) => a.n ? `N=${a.n}  WR=${a.wr.toFixed(1)}%  flatROI=${sign(a.flatRoi)}%  wtdROI=${sign(a.wtdRoi)}%` : '—';

// ── Legacy-field bucket helpers ────────────────────────────────────
// All of these can be computed from fields that existed on picks before V8
// (or at least from a meaningful slice of the pre-V8 sample).
const bucket = {
  era: r => r.date >= V8_CUTOVER ? 'V8-era' : 'pre-V8',
  sport: r => r.sport || 'UNK',
  market: r => r.market,
  regime: r => r.regime || 'UNKNOWN',
  stars: r => {
    const s = r.stars ?? 0;
    if (s >= 5) return '★≥5';
    if (s >= 4) return '★=4';
    if (s >= 3) return '★=3';
    if (s >= 2) return '★=2';
    return '★<2';
  },
  evEdge: r => {
    const e = r.evEdge ?? 0;
    if (e >= 10) return 'EV≥10%';
    if (e >= 5)  return 'EV 5–10%';
    if (e >= 2)  return 'EV 2–5%';
    return 'EV<2%';
  },
  sharpCount: r => {
    const c = r.sharpCount ?? 0;
    if (c >= 5) return 'sharps≥5';
    if (c >= 3) return 'sharps 3–4';
    if (c >= 2) return 'sharps=2';
    return 'sharps=1';
  },
  totalInvested: r => {
    const t = r.totalInvested ?? 0;
    if (t >= 20000) return '$≥20k';
    if (t >= 10000) return '$10–20k';
    if (t >= 5000)  return '$5–10k';
    if (t >= 2000)  return '$2–5k';
    return '$<2k';
  },
  units: r => {
    const u = r.units ?? 0;
    if (u >= 2) return 'u≥2';
    if (u >= 1.5) return 'u=1.5';
    if (u >= 1) return 'u=1';
    return 'u<1';
  },
  // walletProfile only exists from ~2026-04-17 onward — scope to that slice
  dominantTier: r => r.dominantTier || '(missing)',
  conviction: r => {
    const v = r.conviction;
    if (v == null) return '(missing)';
    if (v >= 0.9) return 'conv≥0.9';
    if (v >= 0.7) return 'conv 0.7–0.9';
    if (v >= 0.5) return 'conv 0.5–0.7';
    return 'conv<0.5';
  },
  concentration: r => {
    const v = r.concentration;
    if (v == null) return '(missing)';
    if (v >= 0.9) return 'conc≥0.9';
    if (v >= 0.7) return 'conc 0.7–0.9';
    if (v >= 0.5) return 'conc 0.5–0.7';
    return 'conc<0.5';
  },
  breadth: r => {
    const v = r.breadth;
    if (v == null) return '(missing)';
    if (v >= 0.9) return 'bre≥0.9';
    if (v >= 0.7) return 'bre 0.7–0.9';
    if (v >= 0.5) return 'bre 0.5–0.7';
    return 'bre<0.5';
  },
  consensusTier: r => r.oppConsensusTier || '(missing)',
  consensusGrade: r => r.consensusGrade || '(missing)',
  moneyPct: r => {
    const v = r.moneyPct;
    if (v == null) return '(missing)';
    if (v >= 90) return '$%≥90';
    if (v >= 75) return '$% 75–90';
    if (v >= 60) return '$% 60–75';
    return '$%<60';
  },
  walletPct: r => {
    const v = r.walletPct;
    if (v == null) return '(missing)';
    if (v >= 90) return 'w%≥90';
    if (v >= 75) return 'w% 75–90';
    if (v >= 60) return 'w% 60–75';
    return 'w%<60';
  },
  lockStage: r => r.lockStage || '(unset)',
};

async function load() {
  const rows = [];
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        if (!peak) continue;
        const outcome = side.result?.outcome ?? side.outcome ?? null;
        if (!outcome || outcome === 'PENDING') continue;
        const won = outcome === 'WIN' ? 1 : outcome === 'LOSS' ? 0 : null;
        if (won == null) continue;

        const wp = peak.walletProfile || {};
        const opp = peak.opposition || {};
        const cs = peak.consensusStrength || {};

        // V8-era fields (so we can do the "proxy correspondence" section)
        const v8 = peak.v8Scoring || {};
        const wd = v8.walletDetails || [];
        const consensusSide = v8.consensusSide || sideKey;
        const forW = wd.filter(w => w.side === consensusSide);
        const maxRoiN_F = forW.length ? forW.reduce((m, w) => Math.max(m, w.roiNorm ?? 0), 0) : null;
        const meanBase_F = forW.length ? forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length : null;

        rows.push({
          date: d.date,
          sport: d.sport,
          market: mkt,
          side: sideKey,
          regime: peak.regime ?? side.promotedRegime ?? null,
          stars: peak.stars ?? null,
          units: peak.units ?? null,
          odds: peak.odds ?? 0,
          evEdge: peak.evEdge ?? null,
          sharpCount: peak.sharpCount ?? null,
          totalInvested: peak.totalInvested ?? null,
          lockStage: side.lockStage ?? null,
          // walletProfile proxies (aggregate — no per-wallet data)
          dominantTier: wp.dominantTier ?? null,
          conviction: wp.conviction ?? null,
          concentration: wp.concentration ?? null,
          breadth: wp.breadth ?? null,
          // opposition
          oppConsensusTier: opp.consensusTier ?? null,
          oppSharpCount: opp.sharpCount ?? null,
          // consensusStrength
          consensusGrade: cs.grade ?? null,
          moneyPct: cs.moneyPct ?? null,
          walletPct: cs.walletPct ?? null,
          // outcome
          won,
          pnl: profit(peak.odds ?? 0, peak.units || 1, won === 1),
          flat: flatProfit(peak.odds ?? 0, won === 1),
          // V8-only (null for pre-V8)
          maxRoiN_F, meanBase_F,
        });
      }
    }
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

// ── Single-factor breakdown ────────────────────────────────────────
function factorTable(name, rows, bucketFn) {
  const order = [...new Set(rows.map(bucketFn))].filter(b => b != null && b !== '(missing)').sort();
  const hasMissing = rows.some(r => bucketFn(r) === '(missing)');
  const out = [];
  out.push(`### ${name}`);
  out.push(mdHeader(['Bucket', 'N', 'WR', 'flat ROI', 'wtd ROI', 'Flat PnL (u)']));
  for (const b of order) {
    const a = agg(rows.filter(r => bucketFn(r) === b));
    if (!a.n) continue;
    out.push(`| ${b} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.wtdRoi)}% | ${sign(a.flatPnl, 2)} |`);
  }
  if (hasMissing) {
    const a = agg(rows.filter(r => bucketFn(r) === '(missing)'));
    out.push(`| (field not stored) | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.wtdRoi)}% | ${sign(a.flatPnl, 2)} |`);
  }
  out.push('');
  return out.join('\n');
}

// ── V8-proxy correspondence: inside V8-era rows, bucket each LEGACY
//    proxy and show the AVG meanBase_F / maxRoiN_F for that bucket ─────
function correspondence(rows, legacyBucketFn, label) {
  const buckets = [...new Set(rows.map(legacyBucketFn))].filter(b => b != null && b !== '(missing)').sort();
  const out = [];
  out.push(`### ${label}`);
  out.push(mdHeader(['Bucket', 'N', 'avg meanBase_F', 'avg maxRoiN_F', '% of bucket with meanBase≥55', '% with maxRoiN≥70']));
  for (const b of buckets) {
    const sub = rows.filter(r => legacyBucketFn(r) === b && r.meanBase_F != null);
    if (!sub.length) continue;
    const avgM = sub.reduce((s, r) => s + r.meanBase_F, 0) / sub.length;
    const avgR = sub.reduce((s, r) => s + r.maxRoiN_F, 0) / sub.length;
    const pctM = (sub.filter(r => r.meanBase_F >= 55).length / sub.length) * 100;
    const pctR = (sub.filter(r => r.maxRoiN_F >= 70).length / sub.length) * 100;
    out.push(`| ${b} | ${sub.length} | ${avgM.toFixed(1)} | ${avgR.toFixed(1)} | ${pctM.toFixed(0)}% | ${pctR.toFixed(0)}% |`);
  }
  out.push('');
  return out.join('\n');
}

(async () => {
  const all = await load();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];

  const preV8 = all.filter(r => r.date < V8_CUTOVER);
  const v8 = all.filter(r => r.date >= V8_CUTOVER);

  out.push('# Legacy-Factor Historical Audit');
  out.push('');
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER}`);
  out.push('');
  out.push('**Purpose.** We cannot compute `maxRoiN_F` / `meanBase_F` for pre-V8 picks — the per-wallet `walletDetails` array was never stored on those docs. But we *did* store aggregate wallet-quality proxies (`walletProfile.{dominantTier, conviction, concentration, breadth}`, `consensusStrength.{grade, moneyPct, walletPct}`, `stars`, `regime`, `evEdge`). This report checks whether any of those legacy fields historically predicted winners over the **full 38-day sample** — and shows, inside the V8-era slice, which legacy proxy correlates best with the true V8 signals so we know which one to trust as a stand-in.');
  out.push('');
  out.push('**Samples**');
  out.push('');
  out.push(`- Full: **${fmtAgg(agg(all))}** · flat PnL **${sign(agg(all).flatPnl, 2)}u**`);
  out.push(`- Pre-V8 (2026-03-16 → 2026-04-17): **${fmtAgg(agg(preV8))}** · flat PnL **${sign(agg(preV8).flatPnl, 2)}u**`);
  out.push(`- V8-era (≥ ${V8_CUTOVER}): **${fmtAgg(agg(v8))}** · flat PnL **${sign(agg(v8).flatPnl, 2)}u**`);
  out.push('');

  // ── Data-availability map: which fields were actually stored per era? ─
  out.push('## 0. Legacy-field availability by era');
  out.push('');
  out.push('A field is only usable for historical analysis if it has meaningful coverage in the pre-V8 sample.');
  out.push('');
  out.push(mdHeader(['Field', 'Pre-V8 coverage', 'V8-era coverage', 'Usable for full-history study?']));
  const fieldCoverage = [
    ['stars', r => r.stars != null],
    ['regime', r => !!r.regime],
    ['evEdge', r => r.evEdge != null],
    ['sharpCount', r => r.sharpCount != null],
    ['totalInvested', r => r.totalInvested != null],
    ['units', r => r.units != null],
    ['walletProfile.dominantTier', r => !!r.dominantTier],
    ['walletProfile.conviction', r => r.conviction != null],
    ['walletProfile.concentration', r => r.concentration != null],
    ['walletProfile.breadth', r => r.breadth != null],
    ['opposition.consensusTier', r => !!r.oppConsensusTier],
    ['consensusStrength.grade', r => !!r.consensusGrade],
    ['consensusStrength.moneyPct', r => r.moneyPct != null],
    ['consensusStrength.walletPct', r => r.walletPct != null],
    ['lockStage', r => !!r.lockStage],
  ];
  for (const [label, fn] of fieldCoverage) {
    const pre = preV8.length ? (preV8.filter(fn).length / preV8.length) * 100 : 0;
    const post = v8.length ? (v8.filter(fn).length / v8.length) * 100 : 0;
    const verdict = pre >= 50 ? 'YES' : pre >= 20 ? 'partial (late pre-V8)' : 'NO — V8-era only';
    out.push(`| ${label} | ${pre.toFixed(0)}% | ${post.toFixed(0)}% | ${verdict} |`);
  }
  out.push('');

  // ── 1. Daily PnL timeline ────────────────────────────────────────
  out.push('---');
  out.push('');
  out.push('## 1. Daily PnL timeline (full 38 days, flat units)');
  out.push('');
  out.push(mdHeader(['Date', 'Picks', 'WR', 'flat ROI', 'wtd ROI', 'Flat PnL (u)', 'Cum flat PnL (u)']));
  const byDate = new Map();
  for (const r of all) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date).push(r);
  }
  let cum = 0;
  for (const [date, dayRows] of [...byDate.entries()].sort()) {
    const a = agg(dayRows);
    cum += a.flatPnl;
    out.push(`| ${date} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.wtdRoi)}% | ${sign(a.flatPnl, 2)} | ${sign(cum, 2)} |`);
  }
  out.push('');

  // ── 2. Single-factor breakdowns (full history, legacy fields only) ──
  out.push('---');
  out.push('');
  out.push('## 2. Single-factor breakdowns (full 38-day sample)');
  out.push('');
  out.push('Only fields with ≥50% pre-V8 coverage are reported here (see §0). Fields with partial or V8-only coverage appear in §3.');
  out.push('');
  const fullSampleFactors = [
    ['Sport', bucket.sport],
    ['Market', bucket.market],
    ['Stars', bucket.stars],
    ['Regime', bucket.regime],
    ['evEdge band', bucket.evEdge],
    ['Sharp count', bucket.sharpCount],
    ['Total invested band', bucket.totalInvested],
    ['Units posted', bucket.units],
  ];
  for (const [name, fn] of fullSampleFactors) {
    out.push(factorTable(name, all, fn));
  }

  // ── 3. Late-adopted fields (walletProfile / consensusStrength) ──────
  out.push('---');
  out.push('');
  out.push('## 3. Late-adopted fields (walletProfile + consensusStrength)');
  out.push('');
  out.push('These fields started being written well into the pre-V8 window (most around 2026-04-10 → 2026-04-17). The breakdown below restricts to rows where the field exists — smaller N but covers the same conceptual territory as V8 wallet quality.');
  out.push('');
  const lateFactors = [
    ['walletProfile.dominantTier', bucket.dominantTier],
    ['walletProfile.conviction', bucket.conviction],
    ['walletProfile.concentration', bucket.concentration],
    ['walletProfile.breadth', bucket.breadth],
    ['opposition.consensusTier', bucket.consensusTier],
    ['consensusStrength.grade', bucket.consensusGrade],
    ['consensusStrength.moneyPct', bucket.moneyPct],
    ['consensusStrength.walletPct', bucket.walletPct],
  ];
  for (const [name, fn] of lateFactors) {
    const sub = all.filter(r => fn(r) !== '(missing)');
    if (!sub.length) continue;
    out.push(`*${name} — coverage: ${sub.length}/${all.length} picks*`);
    out.push('');
    out.push(factorTable(name, sub, fn));
  }

  // ── 4. Daily stability of every usable factor ──────────────────────
  out.push('---');
  out.push('');
  out.push('## 4. Daily stability of each legacy factor bucket');
  out.push('');
  out.push('Which legacy buckets are consistently positive across days (stable historical edge) vs flip-flopping (sample noise)?');
  out.push('');
  const dateCols = [...byDate.keys()].sort();

  const stability = [];
  for (const [fname, fn] of [...fullSampleFactors, ...lateFactors]) {
    const scope = fn.toString().includes('(missing)')
      ? all.filter(r => fn(r) !== '(missing)')
      : all;
    const buckets = [...new Set(scope.map(fn))].filter(b => b != null && b !== '(missing)');
    for (const b of buckets) {
      const inBucket = scope.filter(r => fn(r) === b);
      const daysPresent = dateCols.filter(d => inBucket.some(r => r.date === d));
      if (daysPresent.length < 3) continue;
      const daysPositive = daysPresent.filter(d => {
        const a = agg(inBucket.filter(r => r.date === d));
        return a && a.flatRoi > 0;
      });
      const tot = agg(inBucket);
      stability.push({
        fname, b,
        present: daysPresent.length,
        positive: daysPositive.length,
        totalRoi: tot.flatRoi,
        totalN: tot.n,
        totalPnl: tot.flatPnl,
      });
    }
  }

  out.push('### 4a. Most-stable positive buckets (positive ≥75% of appearance-days, min 3 days, min N=10)');
  out.push('');
  out.push(mdHeader(['Factor', 'Bucket', 'Days appeared', 'Days positive', '% positive', 'TOTAL']));
  const winners = stability
    .filter(s => s.totalN >= 10 && s.positive / s.present >= 0.75 && s.totalRoi > 0)
    .sort((a, b) => b.totalRoi - a.totalRoi);
  for (const s of winners) {
    out.push(`| ${s.fname} | ${s.b} | ${s.present} | ${s.positive} | ${((s.positive / s.present) * 100).toFixed(0)}% | N=${s.totalN} · ${sign(s.totalRoi)}% · ${sign(s.totalPnl, 2)}u |`);
  }
  out.push('');

  out.push('### 4b. Most-stable bleeder buckets (positive ≤25% of days, min 3 days, min N=10)');
  out.push('');
  out.push(mdHeader(['Factor', 'Bucket', 'Days appeared', 'Days positive', '% positive', 'TOTAL']));
  const bleeders = stability
    .filter(s => s.totalN >= 10 && s.positive / s.present <= 0.25 && s.totalRoi < 0)
    .sort((a, b) => a.totalRoi - b.totalRoi);
  for (const s of bleeders) {
    out.push(`| ${s.fname} | ${s.b} | ${s.present} | ${s.positive} | ${((s.positive / s.present) * 100).toFixed(0)}% | N=${s.totalN} · ${sign(s.totalRoi)}% · ${sign(s.totalPnl, 2)}u |`);
  }
  out.push('');

  // ── 5. V8-proxy correspondence ─────────────────────────────────────
  out.push('---');
  out.push('');
  out.push('## 5. V8-proxy correspondence (which legacy field tracks V8 wallet quality?)');
  out.push('');
  out.push('Inside the V8-era slice we have *both* the legacy aggregate fields AND the true V8 `meanBase_F` / `maxRoiN_F`. For each legacy bucket, we show the average V8 signal value and the share of the bucket that clears our live V8.3 thresholds. This tells us **which legacy field is the best historical stand-in**.');
  out.push('');
  out.push('Only V8-era rows where we have walletDetails (N=' + v8.filter(r => r.meanBase_F != null).length + ').');
  out.push('');
  const v8WithWD = v8.filter(r => r.meanBase_F != null);
  for (const [name, fn] of [
    ['walletProfile.dominantTier', bucket.dominantTier],
    ['walletProfile.conviction', bucket.conviction],
    ['walletProfile.concentration', bucket.concentration],
    ['walletProfile.breadth', bucket.breadth],
    ['consensusStrength.grade', bucket.consensusGrade],
    ['consensusStrength.moneyPct', bucket.moneyPct],
    ['consensusStrength.walletPct', bucket.walletPct],
    ['Stars', bucket.stars],
  ]) {
    out.push(correspondence(v8WithWD, fn, name));
  }

  // ── 6. Pre-V8 only × legacy proxies ────────────────────────────────
  out.push('---');
  out.push('');
  out.push('## 6. Pre-V8 only: does the legacy proxy edge hold in the pre-V8 sample alone?');
  out.push('');
  out.push('Strips out V8-era rows entirely. If a legacy proxy was ONLY edgy because of V8-era results bleeding in, it will look flat here. True historical edge shows up in both.');
  out.push('');
  for (const [name, fn] of fullSampleFactors) {
    out.push(factorTable(`${name} · pre-V8 only`, preV8, fn));
  }
  for (const [name, fn] of lateFactors) {
    const sub = preV8.filter(r => fn(r) !== '(missing)');
    if (!sub.length) continue;
    out.push(`*${name} · pre-V8 only — coverage: ${sub.length}/${preV8.length} pre-V8 picks*`);
    out.push('');
    out.push(factorTable(`${name} · pre-V8 only`, sub, fn));
  }

  // ── 7. Distilled verdict ───────────────────────────────────────────
  out.push('---');
  out.push('');
  out.push('## 7. Verdict (auto-distilled — read §5 + §6 before acting)');
  out.push('');
  out.push('Rules used:');
  out.push('- A legacy field is a **validated historical edge** if the same bucket is positive in both the pre-V8 slice (§6) and the full sample (§2/§3) with combined N ≥ 30 and total flat ROI ≥ +3%.');
  out.push('- A legacy field is a **validated V8 proxy** if §5 shows it is monotonic in avg `meanBase_F` (higher bucket → higher avg meanBase_F with no inversions).');
  out.push('- If both conditions hold, the V8.3 direction is supported at a bigger sample; keep `meanBase_F` / `maxRoiN_F` as live modifiers and watch §4 weekly.');
  out.push('- If neither holds (pre-V8 bleeders, no monotonic proxy), the V8 signal may be sample-specific and we should hold off on promoting it beyond current role.');
  out.push('');
  out.push('Look at §2, §3, §5, §6 together before calling it.');
  out.push('');

  out.push('---');
  out.push(`*Auto-generated by \`scripts/historicalLegacyFactorAudit.js\`.  Pre-V8 picks lack per-wallet detail — that's why we cannot compute \`maxRoiN_F\` / \`meanBase_F\` directly for them. This report is the next-best approximation.*`);
  out.push('');

  const filepath = join(__dirname, '..', 'LEGACY_FACTOR_AUDIT.md');
  writeFileSync(filepath, out.join('\n'));
  console.log(`Wrote ${filepath}`);
  console.log(`Full: ${fmtAgg(agg(all))} · flat PnL ${sign(agg(all).flatPnl, 2)}u  |  pre-V8: ${fmtAgg(agg(preV8))} · flat PnL ${sign(agg(preV8).flatPnl, 2)}u`);
  process.exit(0);
})();
