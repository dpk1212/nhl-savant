/**
 * V8 Picks — Deep Dive on "Qualified Sharps" Hypotheses
 *
 * Exhaustively explores the V8 walletDetails schema to answer:
 *   H1: As # of sharps with (good ROI) + (above-average bet) grows, does WR/ROI rise?
 *   H2: As the margin (for − against) of those qualified sharps grows, does WR/ROI rise?
 *
 * We don't just test one threshold. We build a grid of quality definitions
 * from every wallet-level signal V8 actually stores:
 *   roiNorm, rankNorm, pnlNorm, walletBase, sizeRatio, convictionMult, contribution, invested
 *
 * And we look at per-pick features:
 *   - counts above threshold (for, against, margin)
 *   - sum / mean / max on each side and differential
 *   - same for the pick-level v8 scoring block (netEdge, breadthBonus,
 *     concPenalty, topShare, forSide, againstSide, walletPlayScore)
 *
 * Output: markdown report to V8_GOLDILOCKS_REPORT.md + console summary.
 *
 * Scope: completed, non-push, non-superseded picks with v8Scoring. Both LOCKED
 *        and SHADOW included. Pre-V8 picks (no walletDetails) are skipped.
 *
 * Usage: node scripts/qualifiedSharpDeepDive.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

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

// ── helpers ──────────────────────────────────────────────────────────────
function americanToImplied(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}
function avg(a) { return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; }
function sum(a) { return a.reduce((s, x) => s + x, 0); }
function max(a) { return a.length ? Math.max(...a) : 0; }
function fmtPct(x) { if (x == null || !isFinite(x)) return '—'; return (x * 100).toFixed(1) + '%'; }
function fmtSigned(x) { if (x == null || !isFinite(x)) return '—'; return (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%'; }
function fmtN(x, d = 2) { if (x == null || !isFinite(x)) return '—'; return Number(x).toFixed(d); }
function fmtSign(x, d = 3) { if (x == null || !isFinite(x)) return '—'; return (x >= 0 ? '+' : '') + Number(x).toFixed(d); }

function spearman(x, y) {
  if (!Array.isArray(x) || x.length !== y.length || x.length < 3) return null;
  const n = x.length;
  const rank = (arr) => {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const r = new Array(n);
    for (let i = 0; i < n; i++) r[sorted[i].i] = i + 1;
    return r;
  };
  const rx = rank(x), ry = rank(y);
  const d2 = rx.reduce((s, r, i) => s + (r - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}

// ── data load ───────────────────────────────────────────────────────────
async function loadPicks(db) {
  const rows = [];
  for (const [colName, mkt] of [['sharpFlowPicks','ML'], ['sharpFlowSpreads','SPREAD'], ['sharpFlowTotals','TOTAL']]) {
    const snap = await db.collection(colName).get();
    snap.forEach(doc => {
      const data = doc.data();
      if (!data.sides) return;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        if (sd.superseded) continue;
        const res = sd.result || data.result;
        if (!res?.outcome || res.outcome === 'PUSH') continue;

        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const v8 = pk?.v8Scoring || lk?.v8Scoring;
        if (!v8 || !Array.isArray(v8.walletDetails)) continue;

        const lockOdds = lk?.odds || 0;
        const won = res.outcome === 'WIN' ? 1 : 0;
        const flatProfit = won ? (lockOdds < 0 ? 100 / Math.abs(lockOdds) : lockOdds / 100) : -1;

        // split walletDetails into for / against
        const forW = v8.walletDetails.filter(w => w.side === sideKey);
        const agW = v8.walletDetails.filter(w => w.side !== sideKey);

        rows.push({
          docId: doc.id, date: data.date, sport: data.sport || 'NHL', mkt, sideKey,
          lockStage: sd.lockStage || 'SHADOW',
          won, flatProfit, lockOdds,
          units: pk?.units || lk?.units || 0,
          stars: pk?.stars || lk?.stars || 0,
          regime: pk?.regime || lk?.regime || 'NO_MOVE',
          // pick-level v8 score block
          walletPlayScore: v8.walletPlayScore ?? null,
          forSide: v8.forSide ?? null,
          againstSide: v8.againstSide ?? null,
          netEdge: v8.netEdge ?? null,
          breadthBonus: v8.breadthBonus ?? null,
          concPenalty: v8.concPenalty ?? null,
          topShare: v8.topShare ?? null,
          walletCountFor: v8.walletCountFor ?? forW.length,
          walletCountAgainst: v8.walletCountAgainst ?? agW.length,
          forW, agW,
        });
      }
    });
  }
  return rows;
}

// Per-wallet qualification definitions we will scan
const QUALITY_DEFS = [
  { label: 'roiNorm≥50 & sizeRatio≥1',  test: (w) => (w.roiNorm ?? 0) >= 50 && (w.sizeRatio ?? 0) >= 1.00 },
  { label: 'roiNorm≥60 & sizeRatio≥1',  test: (w) => (w.roiNorm ?? 0) >= 60 && (w.sizeRatio ?? 0) >= 1.00 },
  { label: 'roiNorm≥50 & sizeRatio≥1.25',test:(w) => (w.roiNorm ?? 0) >= 50 && (w.sizeRatio ?? 0) >= 1.25 },
  { label: 'roiNorm≥60 & sizeRatio≥1.25',test:(w) => (w.roiNorm ?? 0) >= 60 && (w.sizeRatio ?? 0) >= 1.25 },
  { label: 'roiNorm≥70 & sizeRatio≥1',  test: (w) => (w.roiNorm ?? 0) >= 70 && (w.sizeRatio ?? 0) >= 1.00 },
  { label: 'walletBase≥50 & sizeRatio≥1',test:(w) => (w.walletBase ?? 0) >= 50 && (w.sizeRatio ?? 0) >= 1.00 },
  { label: 'walletBase≥60 & sizeRatio≥1',test:(w) => (w.walletBase ?? 0) >= 60 && (w.sizeRatio ?? 0) >= 1.00 },
  { label: 'contribution≥50',           test: (w) => (w.contribution ?? 0) >= 50 },
  { label: 'contribution≥60',           test: (w) => (w.contribution ?? 0) >= 60 },
  { label: 'convictionMult≥1',          test: (w) => (w.convictionMult ?? 0) >= 1.00 },
  { label: 'invested≥$5k',              test: (w) => (w.invested ?? 0) >= 5000 },
  { label: 'rankNorm≥60',               test: (w) => (w.rankNorm ?? 0) >= 60 },
  { label: 'roiNorm≥50 (size any)',     test: (w) => (w.roiNorm ?? 0) >= 50 },
  { label: 'sizeRatio≥1 (roi any)',     test: (w) => (w.sizeRatio ?? 0) >= 1.00 },
];

function aggOutcomes(rows) {
  if (!rows.length) return null;
  const n = rows.length;
  const wr = rows.filter(r => r.won).length / n;
  const flatRoi = avg(rows.map(r => r.flatProfit));
  const totalU = sum(rows.map(r => r.units || 0));
  const wtdRoi = totalU > 0 ? sum(rows.map(r => r.flatProfit * (r.units || 0))) / totalU : null;
  return { n, wr, flatRoi, wtdRoi };
}

function bucketCount(rows, fn, buckets) {
  return buckets.map(b => {
    const sub = rows.filter(r => b.test(fn(r), r));
    return { label: b.label, a: aggOutcomes(sub) };
  });
}

// ── report sections ────────────────────────────────────────────────────
function mdTableBuckets(title, bucketResults) {
  const out = [];
  out.push(`\n#### ${title}\n`);
  out.push(`| Bucket | N | WR | flat ROI | units-wtd ROI |`);
  out.push(`|---|---:|---:|---:|---:|`);
  for (const b of bucketResults) {
    if (!b.a || b.a.n === 0) continue;
    out.push(`| ${b.label} | ${b.a.n} | ${fmtPct(b.a.wr)} | ${fmtSigned(b.a.flatRoi)} | ${fmtSigned(b.a.wtdRoi)} |`);
  }
  return out.join('\n');
}

function sectionQualityScan(rows) {
  const out = ['## 1. Qualified-Sharp Count Scan (H1)\n'];
  out.push(`For each quality definition, we count qualified sharps on the pick side (qFor) and bucket picks by that count.`);
  out.push(`Higher counts should line up with higher WR and positive ROI if sharps-with-skin really do carry the signal.\n`);

  const countBuckets = [
    { label: '0 qFor',   test: (v) => v === 0 },
    { label: '1 qFor',   test: (v) => v === 1 },
    { label: '2 qFor',   test: (v) => v === 2 },
    { label: '3+ qFor',  test: (v) => v >= 3 },
  ];

  const summary = [];
  for (const def of QUALITY_DEFS) {
    const rowsWith = rows.map(r => ({ ...r, qFor: r.forW.filter(def.test).length }));
    const bucketed = bucketCount(rowsWith, (r) => r.qFor, countBuckets);
    const xs = rowsWith.map(r => r.qFor);
    const yW = rowsWith.map(r => r.won);
    const yR = rowsWith.map(r => r.flatProfit);
    const rhoW = spearman(xs, yW);
    const rhoR = spearman(xs, yR);
    summary.push({ def: def.label, rhoW, rhoR, bucketed });
  }

  // Headline summary by correlation
  summary.sort((a, b) => (b.rhoR ?? -2) - (a.rhoR ?? -2));
  out.push(`### Quality-definition leaderboard (ρ per-pick)\n`);
  out.push(`| Quality definition | ρ(qFor, won) | ρ(qFor, flat profit) |`);
  out.push(`|---|---:|---:|`);
  for (const s of summary) {
    out.push(`| ${s.def} | ${s.rhoW == null ? '—' : fmtSign(s.rhoW)} | ${s.rhoR == null ? '—' : fmtSign(s.rhoR)} |`);
  }

  // Full per-definition tables
  out.push(`\n### Per-definition bucket tables\n`);
  for (const s of summary) {
    out.push(mdTableBuckets(`Quality: ${s.def}`, s.bucketed));
  }
  return out.join('\n');
}

function sectionMarginScan(rows) {
  const out = ['\n## 2. Qualified-Margin Scan (H2)\n'];
  out.push(`Margin = qFor − qAgainst of qualified sharps under each definition. Bigger positive margin should mean cleaner pick.\n`);

  const marginBuckets = [
    { label: 'margin ≤ 0', test: (v) => v <= 0 },
    { label: 'margin +1',  test: (v) => v === 1 },
    { label: 'margin +2',  test: (v) => v === 2 },
    { label: 'margin ≥+3', test: (v) => v >= 3 },
  ];

  const summary = [];
  for (const def of QUALITY_DEFS) {
    const rowsWith = rows.map(r => ({
      ...r,
      qFor: r.forW.filter(def.test).length,
      qAgainst: r.agW.filter(def.test).length,
    })).map(r => ({ ...r, margin: r.qFor - r.qAgainst }));
    const bucketed = bucketCount(rowsWith, (r) => r.margin, marginBuckets);
    const xs = rowsWith.map(r => r.margin);
    const rhoW = spearman(xs, rowsWith.map(r => r.won));
    const rhoR = spearman(xs, rowsWith.map(r => r.flatProfit));
    summary.push({ def: def.label, rhoW, rhoR, bucketed });
  }
  summary.sort((a, b) => (b.rhoR ?? -2) - (a.rhoR ?? -2));
  out.push(`### Quality-definition leaderboard (ρ per-pick)\n`);
  out.push(`| Quality definition | ρ(margin, won) | ρ(margin, flat profit) |`);
  out.push(`|---|---:|---:|`);
  for (const s of summary) {
    out.push(`| ${s.def} | ${s.rhoW == null ? '—' : fmtSign(s.rhoW)} | ${s.rhoR == null ? '—' : fmtSign(s.rhoR)} |`);
  }
  out.push(`\n### Per-definition bucket tables\n`);
  for (const s of summary) {
    out.push(mdTableBuckets(`Quality: ${s.def}`, s.bucketed));
  }
  return out.join('\n');
}

function sectionContinuousCorr(rows) {
  const out = ['\n## 3. Continuous Predictors — ρ vs outcomes\n'];
  out.push(`Side-aggregated signals that don't need a threshold. "Δ" = for-side minus against-side.\n`);

  function feat(r) {
    const f = r.forW, a = r.agW;
    const sumRoiN_F = sum(f.map(w => w.roiNorm ?? 0));
    const sumRoiN_A = sum(a.map(w => w.roiNorm ?? 0));
    const maxRoiN_F = max(f.map(w => w.roiNorm ?? 0));
    const maxRoiN_A = max(a.map(w => w.roiNorm ?? 0));
    const sumSize_F = sum(f.map(w => w.sizeRatio ?? 0));
    const sumSize_A = sum(a.map(w => w.sizeRatio ?? 0));
    const sumContrib_F = sum(f.map(w => w.contribution ?? 0));
    const sumContrib_A = sum(a.map(w => w.contribution ?? 0));
    const sumInvest_F = sum(f.map(w => w.invested ?? 0));
    const sumInvest_A = sum(a.map(w => w.invested ?? 0));
    const meanBase_F = avg(f.map(w => w.walletBase ?? 0));
    const meanBase_A = avg(a.map(w => w.walletBase ?? 0));
    const meanConv_F = avg(f.map(w => w.convictionMult ?? 0));
    const meanConv_A = avg(a.map(w => w.convictionMult ?? 0));
    return {
      walletPlayScore: r.walletPlayScore,
      netEdge: r.netEdge,
      breadthBonus: r.breadthBonus,
      concPenalty: r.concPenalty,
      topShare: r.topShare,
      forSide: r.forSide,
      againstSide: r.againstSide,
      walletCountFor: r.walletCountFor,
      walletCountAgainst: r.walletCountAgainst,
      countDelta: r.walletCountFor - r.walletCountAgainst,
      sumRoiN_F, sumRoiN_A, sumRoiN_delta: sumRoiN_F - sumRoiN_A,
      maxRoiN_F, maxRoiN_delta: maxRoiN_F - maxRoiN_A,
      sumSize_F, sumSize_delta: sumSize_F - sumSize_A,
      sumContrib_F, sumContrib_delta: sumContrib_F - sumContrib_A,
      sumInvest_F, sumInvest_delta: sumInvest_F - sumInvest_A,
      meanBase_F, meanBase_delta: meanBase_F - meanBase_A,
      meanConv_F, meanConv_delta: meanConv_F - meanConv_A,
    };
  }

  const feats = rows.map(r => ({ ...feat(r), won: r.won, flatProfit: r.flatProfit }));
  const keys = Object.keys(feats[0]).filter(k => k !== 'won' && k !== 'flatProfit');
  const ranked = keys.map(k => {
    const xs = feats.map(f => f[k]);
    const vs = feats.map(f => f.won);
    const rs = feats.map(f => f.flatProfit);
    return { k, rhoW: spearman(xs, vs), rhoR: spearman(xs, rs) };
  }).filter(r => r.rhoR != null);
  ranked.sort((a, b) => Math.abs(b.rhoR) - Math.abs(a.rhoR));

  out.push(`| Feature | ρ(·, won) | ρ(·, flat profit) |`);
  out.push(`|---|---:|---:|`);
  for (const r of ranked) {
    out.push(`| ${r.k} | ${fmtSign(r.rhoW)} | ${fmtSign(r.rhoR)} |`);
  }
  return out.join('\n');
}

function sectionRuleMining(rows) {
  const out = ['\n## 4. Goldilocks Rule Mining (1-, 2-, 3-factor AND)\n'];
  out.push(`Scans binary conditions and their 2-way + 3-way AND combinations. Ranked by mean flat ROI with ≥ min-N picks satisfied.`);
  out.push(`Use this as a hint generator, not a backtest — with N=${rows.length} most rules are overfit.\n`);

  const predicates = [
    // Count-based (using a few quality defs)
    { label: 'qFor(roi50+size1)≥1', fn: (r) => r.forW.filter(w => w.roiNorm >= 50 && w.sizeRatio >= 1).length >= 1 },
    { label: 'qFor(roi50+size1)≥2', fn: (r) => r.forW.filter(w => w.roiNorm >= 50 && w.sizeRatio >= 1).length >= 2 },
    { label: 'qFor(roi60+size1.25)≥2', fn: (r) => r.forW.filter(w => w.roiNorm >= 60 && w.sizeRatio >= 1.25).length >= 2 },
    { label: 'qMargin(roi50+size1)≥1', fn: (r) => (r.forW.filter(w => w.roiNorm>=50 && w.sizeRatio>=1).length - r.agW.filter(w => w.roiNorm>=50 && w.sizeRatio>=1).length) >= 1 },
    { label: 'qMargin(roi60+size1.25)≥1', fn: (r) => (r.forW.filter(w => w.roiNorm>=60 && w.sizeRatio>=1.25).length - r.agW.filter(w => w.roiNorm>=60 && w.sizeRatio>=1.25).length) >= 1 },
    // Pick-level v8
    { label: 'walletCountFor≥3', fn: (r) => (r.walletCountFor || 0) >= 3 },
    { label: 'walletCountAgainst=0', fn: (r) => (r.walletCountAgainst || 0) === 0 },
    { label: 'walletPlayScore≥2', fn: (r) => (r.walletPlayScore ?? 0) >= 2 },
    { label: 'walletPlayScore≥3', fn: (r) => (r.walletPlayScore ?? 0) >= 3 },
    { label: 'netEdge≥1', fn: (r) => (r.netEdge ?? 0) >= 1 },
    { label: 'topShare≤0.5', fn: (r) => (r.topShare ?? 1) <= 0.5 },
    { label: 'concPenalty≤2.5', fn: (r) => (r.concPenalty ?? 9) <= 2.5 },
    { label: 'stars≥3', fn: (r) => (r.stars ?? 0) >= 3 },
    { label: 'stars≥3.5', fn: (r) => (r.stars ?? 0) >= 3.5 },
    { label: 'regime=CLEAR_MOVE', fn: (r) => r.regime === 'CLEAR_MOVE' },
    // Aggregated side signals
    { label: 'sumInvested_F≥$10k', fn: (r) => sum(r.forW.map(w => w.invested ?? 0)) >= 10000 },
    { label: 'maxRoiN_F≥70', fn: (r) => max(r.forW.map(w => w.roiNorm ?? 0)) >= 70 },
    { label: 'meanBase_F≥55', fn: (r) => avg(r.forW.map(w => w.walletBase ?? 0)) >= 55 },
  ];

  function evalRule(rule) {
    const sub = rows.filter(rule.fn);
    if (!sub.length) return null;
    const a = aggOutcomes(sub);
    return { rule: rule.label, ...a };
  }

  const MIN_N = 3;

  const one = predicates.map(p => evalRule(p)).filter(x => x && x.n >= MIN_N);
  one.sort((a, b) => b.flatRoi - a.flatRoi);
  out.push(`### Single-factor rules (N ≥ ${MIN_N})\n`);
  out.push(`| Rule | N | WR | flat ROI | wtd ROI |`);
  out.push(`|---|---:|---:|---:|---:|`);
  for (const r of one) {
    out.push(`| ${r.rule} | ${r.n} | ${fmtPct(r.wr)} | ${fmtSigned(r.flatRoi)} | ${fmtSigned(r.wtdRoi)} |`);
  }

  const two = [];
  for (let i = 0; i < predicates.length; i++) {
    for (let j = i + 1; j < predicates.length; j++) {
      const rule = { label: `${predicates[i].label} ∧ ${predicates[j].label}`, fn: (r) => predicates[i].fn(r) && predicates[j].fn(r) };
      const r = evalRule(rule);
      if (r && r.n >= MIN_N) two.push(r);
    }
  }
  two.sort((a, b) => b.flatRoi - a.flatRoi);
  out.push(`\n### Top 2-factor AND rules (N ≥ ${MIN_N}, top 25)\n`);
  out.push(`| Rule | N | WR | flat ROI | wtd ROI |`);
  out.push(`|---|---:|---:|---:|---:|`);
  for (const r of two.slice(0, 25)) {
    out.push(`| ${r.rule} | ${r.n} | ${fmtPct(r.wr)} | ${fmtSigned(r.flatRoi)} | ${fmtSigned(r.wtdRoi)} |`);
  }

  const three = [];
  for (let i = 0; i < predicates.length; i++) {
    for (let j = i + 1; j < predicates.length; j++) {
      for (let k = j + 1; k < predicates.length; k++) {
        const rule = {
          label: `${predicates[i].label} ∧ ${predicates[j].label} ∧ ${predicates[k].label}`,
          fn: (r) => predicates[i].fn(r) && predicates[j].fn(r) && predicates[k].fn(r),
        };
        const r = evalRule(rule);
        if (r && r.n >= MIN_N) three.push(r);
      }
    }
  }
  three.sort((a, b) => b.flatRoi - a.flatRoi);
  out.push(`\n### Top 3-factor AND rules (N ≥ ${MIN_N}, top 25)\n`);
  out.push(`| Rule | N | WR | flat ROI | wtd ROI |`);
  out.push(`|---|---:|---:|---:|---:|`);
  for (const r of three.slice(0, 25)) {
    out.push(`| ${r.rule} | ${r.n} | ${fmtPct(r.wr)} | ${fmtSigned(r.flatRoi)} | ${fmtSigned(r.wtdRoi)} |`);
  }

  return out.join('\n');
}

function sectionPickList(rows) {
  const out = ['\n## 5. Every V8 Pick — Row-Level Detail\n'];
  out.push(`| Date | Sport | Mkt | Pick | Stars | Units | Odds | WPS | qFor(roi50+size1) | qAgainst | Margin | Result |`);
  out.push(`|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|`);
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  for (const r of sorted) {
    const qF = r.forW.filter(w => w.roiNorm >= 50 && w.sizeRatio >= 1).length;
    const qA = r.agW.filter(w => w.roiNorm >= 50 && w.sizeRatio >= 1).length;
    out.push(`| ${r.date} | ${r.sport} | ${r.mkt} | ${r.sideKey} | ${r.stars} | ${r.units} | ${r.lockOdds > 0 ? '+' : ''}${r.lockOdds} | ${fmtN(r.walletPlayScore, 2)} | ${qF} | ${qA} | ${qF - qA} | ${r.won ? 'WIN' : 'LOSS'} |`);
  }
  return out.join('\n');
}

function sectionBaseline(rows) {
  const base = aggOutcomes(rows);
  const locked = rows.filter(r => r.lockStage === 'LOCKED');
  const shadow = rows.filter(r => r.lockStage === 'SHADOW');
  return [
    '## 0. Sample & Baseline\n',
    `- Picks in sample: **${base.n}** (LOCKED=${locked.length}, SHADOW=${shadow.length})`,
    `- V8 era start: 2026-04-18. Pre-V8 picks excluded — no walletDetails attached.`,
    `- Baseline: WR **${fmtPct(base.wr)}** · flat ROI **${fmtSigned(base.flatRoi)}** · units-wtd ROI **${fmtSigned(base.wtdRoi)}**`,
    ``,
  ].join('\n');
}

// ── main ────────────────────────────────────────────────────────────────
async function main() {
  const db = initFirebase();
  const rows = await loadPicks(db);
  if (!rows.length) {
    console.log('No V8-era picks found.'); process.exit(0);
  }

  const sections = [
    `# V8 Goldilocks Deep Dive\n`,
    `_Generated ${new Date().toISOString()}_\n`,
    sectionBaseline(rows),
    sectionPickList(rows),
    sectionContinuousCorr(rows),
    sectionQualityScan(rows),
    sectionMarginScan(rows),
    sectionRuleMining(rows),
  ];
  const md = sections.join('\n');
  const outPath = join(__dirname, '..', 'V8_GOLDILOCKS_REPORT.md');
  writeFileSync(outPath, md, 'utf8');
  console.log(`Report written: ${outPath}`);
  console.log(`Sample: N=${rows.length} (LOCKED=${rows.filter(r=>r.lockStage==='LOCKED').length}, SHADOW=${rows.filter(r=>r.lockStage==='SHADOW').length})`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
