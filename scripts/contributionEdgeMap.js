/**
 * V8 Picks — Contribution Edge Map
 *
 * Zooms in on the strongest signal found so far: wallet contribution
 * (contribution = walletBase × convictionMult = quality × size).
 *
 * For each contribution threshold T ∈ {30,40,50,60,70}:
 *   - qFor(T)     = # wallets on pick side with contribution ≥ T
 *   - qAgainst(T) = # wallets on opposing side with contribution ≥ T
 *   - margin(T)   = qFor − qAgainst
 *
 * Reports:
 *   §A  Count buckets (qFor) per threshold — H1
 *   §B  Margin buckets per threshold — H2
 *   §C  Count × margin 2-D grid at best threshold — find the edge cell
 *   §D  Continuous Δcontribution (sumContrib_F − sumContrib_A) deciles
 *   §E  Proposed sizing tiers (MUTE / LEAN / STANDARD / STRONG) — rule map
 *   §F  Pick-by-pick table tagged with the proposed tier
 *
 * Output: markdown → V8_CONTRIBUTION_EDGE.md
 *
 * Usage: node scripts/contributionEdgeMap.js
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
const sum = (a) => a.reduce((s, x) => s + x, 0);
const avg = (a) => (a.length ? sum(a) / a.length : 0);
const fmtPct = (x) => (x == null || !isFinite(x) ? '—' : (x * 100).toFixed(1) + '%');
const fmtSigned = (x) => (x == null || !isFinite(x) ? '—' : (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%');
const fmtN = (x, d = 2) => (x == null || !isFinite(x) ? '—' : Number(x).toFixed(d));

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

function flatRoiOf(row) {
  const o = row.lockOdds;
  return row.won ? (o < 0 ? 100 / Math.abs(o) : o / 100) : -1;
}
function agg(rows) {
  if (!rows.length) return null;
  const wr = rows.filter((r) => r.won).length / rows.length;
  const fr = avg(rows.map(flatRoiOf));
  const tu = sum(rows.map((r) => r.units || 0));
  const wr2 = tu > 0 ? sum(rows.map((r) => flatRoiOf(r) * (r.units || 0))) / tu : null;
  return { n: rows.length, wr, flatRoi: fr, wtdRoi: wr2 };
}

// ── data load ───────────────────────────────────────────────────────────
async function loadPicks(db) {
  const rows = [];
  for (const [colName, mkt] of [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']]) {
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
        const v8 = pk?.v8Scoring || lk?.v8Scoring;
        if (!v8 || !Array.isArray(v8.walletDetails)) continue;
        const forW = v8.walletDetails.filter((w) => w.side === sideKey);
        const agW = v8.walletDetails.filter((w) => w.side !== sideKey);
        rows.push({
          docId: doc.id, date: data.date, sport: data.sport || 'NHL', mkt, sideKey,
          lockStage: sd.lockStage || 'SHADOW',
          won: res.outcome === 'WIN' ? 1 : 0,
          lockOdds: lk?.odds || 0,
          units: pk?.units || lk?.units || 0,
          stars: pk?.stars || lk?.stars || 0,
          regime: pk?.regime || lk?.regime || 'NO_MOVE',
          walletPlayScore: v8.walletPlayScore ?? null,
          forSide: v8.forSide ?? null,
          againstSide: v8.againstSide ?? null,
          netEdge: v8.netEdge ?? null,
          topShare: v8.topShare ?? null,
          forW, agW,
        });
      }
    });
  }
  return rows;
}

const THRESHOLDS = [30, 40, 50, 60, 70];

function tagContributionFeatures(r) {
  const out = { ...r };
  for (const T of THRESHOLDS) {
    out[`qFor_${T}`] = r.forW.filter((w) => (w.contribution ?? 0) >= T).length;
    out[`qAg_${T}`] = r.agW.filter((w) => (w.contribution ?? 0) >= T).length;
    out[`mgn_${T}`] = out[`qFor_${T}`] - out[`qAg_${T}`];
  }
  out.sumContrib_F = sum(r.forW.map((w) => w.contribution ?? 0));
  out.sumContrib_A = sum(r.agW.map((w) => w.contribution ?? 0));
  out.sumContrib_delta = out.sumContrib_F - out.sumContrib_A;
  out.maxContrib_F = r.forW.length ? Math.max(...r.forW.map((w) => w.contribution ?? 0)) : 0;
  out.meanContrib_F = avg(r.forW.map((w) => w.contribution ?? 0));
  return out;
}

// ── report building ─────────────────────────────────────────────────────
function mdTable(title, colHeaders, rows) {
  const out = [`\n#### ${title}\n`, `| ${colHeaders.join(' | ')} |`, `| ${colHeaders.map(() => '---').join(' | ')} |`];
  for (const r of rows) out.push(`| ${r.join(' | ')} |`);
  return out.join('\n');
}

function sectionACountByThreshold(rows) {
  const out = ['## A. Count of `contribution ≥ T` on pick side (H1)\n'];
  out.push('Hypothesis: more high-contribution sharps on side ⇒ higher WR / ROI.\n');
  for (const T of THRESHOLDS) {
    const buckets = [
      { label: '0', test: (v) => v === 0 },
      { label: '1', test: (v) => v === 1 },
      { label: '2', test: (v) => v === 2 },
      { label: '3+', test: (v) => v >= 3 },
    ];
    const tableRows = [];
    for (const b of buckets) {
      const sub = rows.filter((r) => b.test(r[`qFor_${T}`]));
      const a = agg(sub);
      if (!a) continue;
      tableRows.push([`qFor ≥ ${b.label}`, a.n, fmtPct(a.wr), fmtSigned(a.flatRoi), fmtSigned(a.wtdRoi)]);
    }
    const xs = rows.map((r) => r[`qFor_${T}`]);
    const rhoW = spearman(xs, rows.map((r) => r.won));
    const rhoR = spearman(xs, rows.map(flatRoiOf));
    out.push(mdTable(`Threshold T = ${T}   |   ρ(qFor, won) = ${fmtN(rhoW, 3)}   ρ(qFor, flat ROI) = ${fmtN(rhoR, 3)}`, ['Bucket', 'N', 'WR', 'flat ROI', 'wtd ROI'], tableRows));
  }
  return out.join('\n');
}

function sectionBMarginByThreshold(rows) {
  const out = ['\n## B. Margin `contribution ≥ T` (qFor − qAgainst) (H2)\n'];
  out.push('Hypothesis: positive margin of high-contribution sharps ⇒ edge.\n');
  for (const T of THRESHOLDS) {
    const buckets = [
      { label: '≤ 0', test: (v) => v <= 0 },
      { label: '+1', test: (v) => v === 1 },
      { label: '+2', test: (v) => v === 2 },
      { label: '≥ +3', test: (v) => v >= 3 },
    ];
    const tableRows = [];
    for (const b of buckets) {
      const sub = rows.filter((r) => b.test(r[`mgn_${T}`]));
      const a = agg(sub);
      if (!a) continue;
      tableRows.push([`margin ${b.label}`, a.n, fmtPct(a.wr), fmtSigned(a.flatRoi), fmtSigned(a.wtdRoi)]);
    }
    const xs = rows.map((r) => r[`mgn_${T}`]);
    const rhoW = spearman(xs, rows.map((r) => r.won));
    const rhoR = spearman(xs, rows.map(flatRoiOf));
    out.push(mdTable(`Threshold T = ${T}   |   ρ(margin, won) = ${fmtN(rhoW, 3)}   ρ(margin, flat ROI) = ${fmtN(rhoR, 3)}`, ['Bucket', 'N', 'WR', 'flat ROI', 'wtd ROI'], tableRows));
  }
  return out.join('\n');
}

function sectionCGrid(rows, T) {
  const out = [`\n## C. Count × Margin grid at T = ${T}\n`];
  out.push(`Rows = # qFor (contrib ≥ ${T}) on side, Cols = # qAgainst. Each cell = N / WR / flat ROI.\n`);
  const maxFor = Math.max(0, ...rows.map((r) => r[`qFor_${T}`]));
  const maxAg = Math.max(0, ...rows.map((r) => r[`qAg_${T}`]));
  const header = ['qFor \\ qAgainst'];
  for (let a = 0; a <= maxAg; a++) header.push(String(a));
  const tableRows = [];
  for (let f = 0; f <= maxFor; f++) {
    const row = [String(f)];
    for (let a = 0; a <= maxAg; a++) {
      const sub = rows.filter((r) => r[`qFor_${T}`] === f && r[`qAg_${T}`] === a);
      if (!sub.length) row.push('—');
      else {
        const ag = agg(sub);
        row.push(`${ag.n} / ${fmtPct(ag.wr)} / ${fmtSigned(ag.flatRoi)}`);
      }
    }
    tableRows.push(row);
  }
  out.push(mdTable(`Grid: qFor × qAgainst at contribution ≥ ${T}`, header, tableRows));
  return out.join('\n');
}

function sectionDSumContribDelta(rows) {
  const out = ['\n## D. Continuous Δcontribution (sumContrib_F − sumContrib_A) terciles\n'];
  out.push('No threshold. Sort all picks by Δ and cut into thirds.\n');
  const sorted = [...rows].sort((a, b) => a.sumContrib_delta - b.sumContrib_delta);
  const n = sorted.length;
  const cut1 = Math.floor(n / 3);
  const cut2 = Math.floor((2 * n) / 3);
  const slices = [
    { label: `Low  (Δ ≤ ${fmtN(sorted[cut1 - 1]?.sumContrib_delta, 1)})`, rows: sorted.slice(0, cut1) },
    { label: `Mid  (${fmtN(sorted[cut1]?.sumContrib_delta, 1)} .. ${fmtN(sorted[cut2 - 1]?.sumContrib_delta, 1)})`, rows: sorted.slice(cut1, cut2) },
    { label: `High (Δ ≥ ${fmtN(sorted[cut2]?.sumContrib_delta, 1)})`, rows: sorted.slice(cut2) },
  ];
  const tableRows = [];
  for (const s of slices) {
    const a = agg(s.rows);
    if (!a) continue;
    const meanD = avg(s.rows.map((r) => r.sumContrib_delta));
    tableRows.push([s.label, a.n, fmtN(meanD, 1), fmtPct(a.wr), fmtSigned(a.flatRoi), fmtSigned(a.wtdRoi)]);
  }
  const rhoW = spearman(rows.map((r) => r.sumContrib_delta), rows.map((r) => r.won));
  const rhoR = spearman(rows.map((r) => r.sumContrib_delta), rows.map(flatRoiOf));
  out.push(`ρ(Δcontribution, won) = ${fmtN(rhoW, 3)}   |   ρ(Δcontribution, flat ROI) = ${fmtN(rhoR, 3)}\n`);
  out.push(mdTable('Terciles', ['Bucket', 'N', 'mean Δ', 'WR', 'flat ROI', 'wtd ROI'], tableRows));

  // Also: simple rules on Δ
  const rules = [
    { label: 'Δ ≤ 0 (opposition matched/led)', fn: (r) => r.sumContrib_delta <= 0 },
    { label: '0 < Δ ≤ 50',  fn: (r) => r.sumContrib_delta > 0 && r.sumContrib_delta <= 50 },
    { label: '50 < Δ ≤ 100', fn: (r) => r.sumContrib_delta > 50 && r.sumContrib_delta <= 100 },
    { label: 'Δ > 100',      fn: (r) => r.sumContrib_delta > 100 },
  ];
  const r2 = [];
  for (const rule of rules) {
    const sub = rows.filter(rule.fn);
    const a = agg(sub);
    if (!a) continue;
    r2.push([rule.label, a.n, fmtPct(a.wr), fmtSigned(a.flatRoi), fmtSigned(a.wtdRoi)]);
  }
  out.push(mdTable('Absolute Δcontribution cuts', ['Bucket', 'N', 'WR', 'flat ROI', 'wtd ROI'], r2));
  return out.join('\n');
}

function classifyTier(r) {
  // Rule map derived from §A/B/C (all calibrated at T=50)
  const qF = r.qFor_50, qA = r.qAg_50, mgn = r.mgn_50;

  if (qF >= 3 && qA === 0) return 'STRONG';
  if (qF >= 2 && mgn >= 1) return 'STRONG';
  if (qF >= 1 && mgn >= 1 && r.maxContrib_F >= 50) return 'STANDARD';
  if (qF >= 1 && mgn >= 0) return 'LEAN';
  if (mgn < 0) return 'MUTE';
  return 'LEAN';
}

function sectionETierMap(rows) {
  const out = ['\n## E. Proposed sizing tiers (derived from §A/B/C)\n'];
  out.push([
    'Rules (all use `contribution ≥ 50` wallet count):',
    '- **STRONG**  : qFor ≥ 3 AND qAgainst = 0  **OR**  qFor ≥ 2 AND margin ≥ +1',
    '- **STANDARD**: qFor ≥ 1 AND margin ≥ +1 AND maxContrib_F ≥ 50',
    '- **LEAN**    : qFor ≥ 1 AND margin ≥ 0',
    '- **MUTE**    : margin < 0',
    '',
  ].join('\n'));

  const bucketOrder = ['STRONG', 'STANDARD', 'LEAN', 'MUTE'];
  const tableRows = [];
  for (const t of bucketOrder) {
    const sub = rows.filter((r) => classifyTier(r) === t);
    const a = agg(sub);
    if (!a) { tableRows.push([t, 0, '—', '—', '—']); continue; }
    tableRows.push([t, a.n, fmtPct(a.wr), fmtSigned(a.flatRoi), fmtSigned(a.wtdRoi)]);
  }
  out.push(mdTable('Tier performance on current V8 sample', ['Tier', 'N', 'WR', 'flat ROI', 'wtd ROI'], tableRows));

  // Tier vs current star/units assignment
  const starMatrix = [];
  for (const t of bucketOrder) {
    const sub = rows.filter((r) => classifyTier(r) === t);
    if (!sub.length) { starMatrix.push([t, 0, '—', '—']); continue; }
    const meanStars = avg(sub.map((r) => r.stars || 0));
    const meanUnits = avg(sub.map((r) => r.units || 0));
    starMatrix.push([t, sub.length, fmtN(meanStars, 2), fmtN(meanUnits, 2)]);
  }
  out.push(mdTable('Current V8 ★/units assigned within each proposed tier', ['Tier', 'N', 'mean ★', 'mean units'], starMatrix));

  return out.join('\n');
}

function sectionFPickTable(rows) {
  const out = ['\n## F. Every V8 pick tagged with proposed tier\n'];
  const cols = ['Date', 'Sport', 'Mkt', 'Side', '★', 'Units', 'Odds', 'qFor₅₀', 'qAg₅₀', 'mgn₅₀', 'Δcontrib', 'Tier', 'Result'];
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const tableRows = sorted.map((r) => [
    r.date, r.sport, r.mkt, r.sideKey,
    r.stars, r.units, (r.lockOdds > 0 ? '+' : '') + r.lockOdds,
    r.qFor_50, r.qAg_50, r.mgn_50,
    fmtN(r.sumContrib_delta, 1),
    classifyTier(r),
    r.won ? 'WIN' : 'LOSS',
  ]);
  out.push(mdTable('Row-level detail', cols, tableRows));
  return out.join('\n');
}

// ── main ────────────────────────────────────────────────────────────────
async function main() {
  const db = initFirebase();
  const raw = await loadPicks(db);
  if (!raw.length) { console.log('No V8-era picks.'); process.exit(0); }
  const rows = raw.map(tagContributionFeatures);

  const base = agg(rows);
  const header = [
    '# V8 Contribution-Edge Map\n',
    `_Generated ${new Date().toISOString()}_\n`,
    `N = ${rows.length} picks (LOCKED=${rows.filter((r) => r.lockStage === 'LOCKED').length}, SHADOW=${rows.filter((r) => r.lockStage === 'SHADOW').length})`,
    `Baseline: WR ${fmtPct(base.wr)} · flat ROI ${fmtSigned(base.flatRoi)} · units-wtd ROI ${fmtSigned(base.wtdRoi)}`,
    ``,
    `> Per-wallet signal: \`contribution = walletBase × convictionMult\` (quality × size, already stored in walletDetails).`,
    ``,
  ].join('\n');

  const md = [
    header,
    sectionACountByThreshold(rows),
    sectionBMarginByThreshold(rows),
    sectionCGrid(rows, 50),
    sectionCGrid(rows, 40),
    sectionDSumContribDelta(rows),
    sectionETierMap(rows),
    sectionFPickTable(rows),
  ].join('\n');

  const outPath = join(__dirname, '..', 'V8_CONTRIBUTION_EDGE.md');
  writeFileSync(outPath, md, 'utf8');
  console.log(`Report written: ${outPath}`);
  console.log(`N = ${rows.length}`);

  // Console teasers
  console.log('\n-- Tier performance (rule-based classifier) --');
  const tiers = ['STRONG', 'STANDARD', 'LEAN', 'MUTE'];
  for (const t of tiers) {
    const sub = rows.filter((r) => classifyTier(r) === t);
    const a = agg(sub);
    if (!a) { console.log(`${t.padEnd(10)} : N=0`); continue; }
    console.log(`${t.padEnd(10)} : N=${a.n}  WR=${fmtPct(a.wr)}  flatROI=${fmtSigned(a.flatRoi)}  wtdROI=${fmtSigned(a.wtdRoi)}`);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
