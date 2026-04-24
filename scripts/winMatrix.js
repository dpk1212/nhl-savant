/**
 * winMatrix.js — (Δw × Δq) cross-tab of historical pick performance.
 *
 * Pulls every graded, non-superseded side across:
 *   sharpFlowPicks   (ML)
 *   sharpFlowSpreads (SPREAD)
 *   sharpFlowTotals  (TOTAL)
 *
 * For each side with walletDetails present, recomputes Δ_winner and
 * Δ_quality against the LIVE sharpWalletProfiles snapshot (so the
 * matrix always reflects current whitelist state — not whatever tier
 * the wallet was in on the day the pick locked). Bins into a 7×7 cell
 * grid clamped at [-3, +3] on each axis.
 *
 * Writes two artifacts:
 *   1. WIN_MATRIX.md             — human-readable living report
 *   2. public/win_matrix.json    — machine-readable, consumed by
 *                                  rankTodayLocks.js + (future) UI
 *
 * Matches the lock engine in src/pages/SharpFlow.jsx
 *   - WHITELIST_CONSENSUS_VERSION = 6
 *   - QUALITY_CONTRIB_CUT         = 30
 *
 * Pure read/write — no Firestore mutations.
 *
 * Usage:  node scripts/winMatrix.js
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

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
const db = admin.firestore();

const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

const QUALITY_CUT = 30;
const DW_BUCKETS = [-3, -2, -1, 0, 1, 2, 3];
const DQ_BUCKETS = [-3, -2, -1, 0, 1, 2, 3];
const MIN_N_FOR_ROI = 3;   // suppress ROI% in cells with < 3 picks

// ── Whitelist + delta helpers (mirror SharpFlow.jsx) ────────────────────────
function computeDeltas(walletDetails, sideKey, sport, profiles) {
  if (!Array.isArray(walletDetails) || !sideKey) {
    return { dw: 0, dq: 0, forW: 0, agW: 0, qFor: 0, qAg: 0, hadDetails: false };
  }
  const forSet = new Set();
  const agSet = new Set();
  for (const d of walletDetails) {
    if (!d?.wallet || !d?.side) continue;
    const shortId = String(d.wallet).slice(-6);
    const tier = profiles.get(shortId)?.bySport?.[sport]?.whitelistTier;
    if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;
    if (d.side === sideKey) forSet.add(shortId);
    else agSet.add(shortId);
  }
  const forW = forSet.size;
  const agW  = agSet.size;
  const dw   = forW - agW;
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CUT) continue;
    if (d.side === sideKey) qFor++;
    else if (d.side) qAg++;
  }
  const dq = qFor - qAg;
  return { dw, dq, forW, agW, qFor, qAg, hadDetails: walletDetails.length > 0 };
}

function extractOutcome(sideData) {
  const outcome = sideData?.result?.outcome || null;
  if (outcome !== 'WIN' && outcome !== 'LOSS' && outcome !== 'PUSH') return null;
  if (sideData.superseded) return null;
  const odds = sideData?.lock?.lockOdds ?? sideData?.peak?.peakOdds ?? sideData?.lock?.odds ?? sideData?.peak?.odds ?? null;
  let flatProfit = 0;
  if (outcome === 'WIN') {
    if (odds != null) flatProfit = odds >= 100 ? odds / 100 : 100 / Math.abs(odds);
    else flatProfit = 0.91;
  } else if (outcome === 'LOSS') {
    flatProfit = -1.0;
  }
  return { outcome, flatProfit, odds };
}

// Clamp Δ into the edge buckets. +3 = "+3 or more", -3 = "-3 or less".
function clampDelta(v, lo, hi) {
  if (v <= lo) return lo;
  if (v >= hi) return hi;
  return v;
}
function cellKey(dw, dq) {
  const cw = clampDelta(dw, DW_BUCKETS[0], DW_BUCKETS[DW_BUCKETS.length - 1]);
  const cq = clampDelta(dq, DQ_BUCKETS[0], DQ_BUCKETS[DQ_BUCKETS.length - 1]);
  return `${cw >= 0 ? '+' : ''}${cw},${cq >= 0 ? '+' : ''}${cq}`;
}

function emptyCells() {
  const cells = {};
  for (const w of DW_BUCKETS) {
    for (const q of DQ_BUCKETS) {
      cells[`${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`] = { n: 0, w: 0, l: 0, p: 0, pnl: 0 };
    }
  }
  return cells;
}
function finalizeCells(cells) {
  const out = {};
  for (const [k, c] of Object.entries(cells)) {
    if (c.n === 0) continue;
    const wlTotal = c.w + c.l;
    const wr = wlTotal === 0 ? null : (c.w / wlTotal) * 100;
    const roi = c.n === 0 ? null : (c.pnl / c.n) * 100;
    out[k] = { n: c.n, w: c.w, l: c.l, p: c.p, pnl: +c.pnl.toFixed(3), wr: wr == null ? null : +wr.toFixed(1), roi: roi == null ? null : +roi.toFixed(1) };
  }
  return out;
}
function addToCells(cells, dw, dq, outcome, flatProfit) {
  const key = cellKey(dw, dq);
  const c = cells[key];
  if (!c) return;
  c.n += 1;
  if (outcome === 'WIN')  c.w += 1;
  else if (outcome === 'LOSS') c.l += 1;
  else if (outcome === 'PUSH') c.p += 1;
  c.pnl += flatProfit || 0;
}

// ── Main ────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n=== WIN MATRIX — (Δw × Δq) historical cross-tab ===\n');

  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of profSnap.docs) profiles.set(d.id, d.data());
  console.log(`Loaded ${profiles.size} wallet profiles`);

  // Aggregators
  const all      = emptyCells();
  const bySport  = {};      // { NBA: cells, NHL: cells, MLB: cells, ... }
  const byMarket = { ML: emptyCells(), SPREAD: emptyCells(), TOTAL: emptyCells() };

  let totalSides = 0, gradedSides = 0, dateMin = null, dateMax = null;

  for (const [col, mkt] of PICK_COLS) {
    const snap = await db.collection(col).get();
    console.log(`${col}: ${snap.size} docs`);
    for (const doc of snap.docs) {
      const data = doc.data();
      const sport = data.sport;
      const date = data.date;
      for (const [sideKey, side] of Object.entries(data.sides || {})) {
        totalSides += 1;
        const out = extractOutcome(side);
        if (!out) continue;
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails || [];
        if (!wd.length) continue;
        const { dw, dq, hadDetails } = computeDeltas(wd, sideKey, sport, profiles);
        if (!hadDetails) continue;

        gradedSides += 1;
        if (date) {
          if (!dateMin || date < dateMin) dateMin = date;
          if (!dateMax || date > dateMax) dateMax = date;
        }

        addToCells(all, dw, dq, out.outcome, out.flatProfit);
        if (!bySport[sport]) bySport[sport] = emptyCells();
        addToCells(bySport[sport], dw, dq, out.outcome, out.flatProfit);
        addToCells(byMarket[mkt], dw, dq, out.outcome, out.flatProfit);
      }
    }
  }
  console.log(`\nGraded sides with walletDetails: ${gradedSides} (of ${totalSides} total)`);
  console.log(`Date range: ${dateMin || '—'} … ${dateMax || '—'}`);

  // ── Finalize ──────────────────────────────────────────────────────────────
  const finalAll = finalizeCells(all);
  const finalBySport = {};
  for (const [sp, c] of Object.entries(bySport)) finalBySport[sp] = finalizeCells(c);
  const finalByMarket = {};
  for (const [m, c]  of Object.entries(byMarket)) finalByMarket[m] = finalizeCells(c);

  const payload = {
    generatedAt: new Date().toISOString(),
    sample: {
      totalSidesScanned: totalSides,
      gradedWithWalletDetails: gradedSides,
      dateRange: [dateMin, dateMax],
    },
    config: {
      qualityContribCut: QUALITY_CUT,
      whitelistConsensusVersion: 6,
      whitelistTiersUsed: ['CONFIRMED', 'FLAT'],
      dwBuckets: DW_BUCKETS,
      dqBuckets: DQ_BUCKETS,
      minNForRoi: MIN_N_FOR_ROI,
    },
    cells: {
      all: finalAll,
      bySport: finalBySport,
      byMarket: finalByMarket,
    },
  };

  const publicDir = join(REPO_ROOT, 'public');
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
  const jsonPath = join(publicDir, 'win_matrix.json');
  writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${jsonPath}`);

  // ── Pretty console print: Overall WR% / N / ROI% heatmaps ────────────────
  function printHeatmap(title, finalized) {
    console.log(`\n── ${title} ──`);
    const header = '         ' + DQ_BUCKETS.map(q => `Δq${q >= 0 ? '+' : ''}${q}`.padStart(11)).join('');
    console.log(header);
    for (const w of DW_BUCKETS) {
      const label = `Δw${w >= 0 ? '+' : ''}${w}`.padEnd(9);
      const cells = DQ_BUCKETS.map(q => {
        const key = `${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`;
        const c = finalized[key];
        if (!c) return '    .      '.padStart(11);
        const wr = c.wr == null ? '—' : `${c.wr.toFixed(0)}%`;
        return `${c.w}-${c.l} ${wr}`.padStart(11);
      });
      console.log(label + cells.join(''));
    }
    console.log('ROI% (N ≥ 3):');
    console.log(header);
    for (const w of DW_BUCKETS) {
      const label = `Δw${w >= 0 ? '+' : ''}${w}`.padEnd(9);
      const cells = DQ_BUCKETS.map(q => {
        const key = `${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`;
        const c = finalized[key];
        if (!c || c.n < MIN_N_FOR_ROI) return '    .      '.padStart(11);
        const r = c.roi == null ? '—' : `${c.roi >= 0 ? '+' : ''}${c.roi.toFixed(0)}%`;
        return r.padStart(11);
      });
      console.log(label + cells.join(''));
    }
  }
  printHeatmap('ALL MARKETS', finalAll);
  for (const sp of Object.keys(finalBySport).sort()) printHeatmap(`SPORT — ${sp}`, finalBySport[sp]);

  // ── Markdown report ──────────────────────────────────────────────────────
  let md = '# Win Matrix — (Δ_winner × Δ_quality) cross-tab\n\n';
  md += `_Auto-generated ${new Date().toISOString()} by \`scripts/winMatrix.js\`. Do not edit by hand._\n\n`;
  md += `**Sample:** ${gradedSides} graded, non-superseded sides with walletDetails available (of ${totalSides} scanned).\n\n`;
  md += `**Date range:** ${dateMin || '—'} … ${dateMax || '—'}\n\n`;
  md += `**Whitelist source:** live \`sharpWalletProfiles\` snapshot (${profiles.size} profiles, tiers \`CONFIRMED\` + \`FLAT\`).\n\n`;
  md += `**Quality cut:** contribution ≥ ${QUALITY_CUT}.\n\n`;
  md += `**Cell format:** \`N · W-L-P · WR% · ROI%\`. Extreme axes (±3) are clamped, so \`Δw+3\` covers Δw ≥ +3 and \`Δw-3\` covers Δw ≤ −3. ROI% is hidden when N < ${MIN_N_FOR_ROI}. Each row is a Δw value; each column a Δq value.\n\n`;
  md += `## Lock floor reference\n\n`;
  md += `Current live lock floor (SharpFlow v6.3): **Δw ≥ +1 AND Δq ≥ +1**. Current TOP PICK badge: **Δw ≥ +2**. Current SUPER TOP PICK badge: **Δw ≥ +2 AND Δq ≥ +2**. Use this matrix to validate / re-tune those thresholds.\n\n`;

  function mdHeatmap(title, finalized) {
    md += `## ${title}\n\n`;
    // Header
    md += '|        | ' + DQ_BUCKETS.map(q => `**Δq${q >= 0 ? '+' : ''}${q}**`).join(' | ') + ' |\n';
    md += '|---|' + DQ_BUCKETS.map(() => '---').join('|') + '|\n';
    for (const w of DW_BUCKETS) {
      const row = [`**Δw${w >= 0 ? '+' : ''}${w}**`];
      for (const q of DQ_BUCKETS) {
        const key = `${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`;
        const c = finalized[key];
        if (!c) { row.push('—'); continue; }
        const wr = c.wr == null ? '—' : `${c.wr.toFixed(0)}%`;
        const roi = c.n >= MIN_N_FOR_ROI && c.roi != null ? ` \`${c.roi >= 0 ? '+' : ''}${c.roi.toFixed(0)}%\`` : '';
        row.push(`N=${c.n} · ${c.w}-${c.l}${c.p ? `-${c.p}` : ''} · ${wr}${roi}`);
      }
      md += '| ' + row.join(' | ') + ' |\n';
    }
    md += '\n';
  }
  mdHeatmap('All markets (N = ' + gradedSides + ')', finalAll);

  for (const sp of Object.keys(finalBySport).sort()) {
    const totalN = Object.values(finalBySport[sp]).reduce((s, c) => s + c.n, 0);
    mdHeatmap(`Sport — ${sp} (N = ${totalN})`, finalBySport[sp]);
  }
  for (const m of ['ML', 'SPREAD', 'TOTAL']) {
    const totalN = Object.values(finalByMarket[m]).reduce((s, c) => s + c.n, 0);
    if (totalN === 0) continue;
    mdHeatmap(`Market — ${m} (N = ${totalN})`, finalByMarket[m]);
  }

  // ── Cohort roll-up: interesting lock-floor cells ─────────────────────────
  md += '## Key cohort summaries\n\n';
  md += '| Cohort | N | W-L-P | WR% | ROI% | u P/L |\n|---|---|---|---|---|---|\n';
  function cohort(filter) {
    let n=0,w=0,l=0,p=0,pnl=0;
    for (const [k, c] of Object.entries(finalAll)) {
      const [dw, dq] = k.split(',').map(Number);
      if (!filter(dw, dq)) continue;
      n += c.n; w += c.w; l += c.l; p += c.p; pnl += (c.pnl || 0);
    }
    const wlTotal = w + l;
    const wr = wlTotal === 0 ? 0 : (w / wlTotal) * 100;
    const roi = n === 0 ? 0 : (pnl / n) * 100;
    return { n, w, l, p, wr, roi, pnl };
  }
  const cohorts = [
    { label: 'Super Top (Δw ≥ +2 ∧ Δq ≥ +2)',        f: (w, q) => w >= 2 && q >= 2 },
    { label: 'Top      (Δw ≥ +2 ∧ Δq ≤ +1)',         f: (w, q) => w >= 2 && q <= 1 },
    { label: 'Floor G  (Δw ≥ +1 ∧ Δq ≥ +1) — lock',  f: (w, q) => w >= 1 && q >= 1 },
    { label: 'Sub-Floor G (Δw = +1 ∧ Δq = +1)',      f: (w, q) => w === 1 && q === 1 },
    { label: 'Δw = +1 ∧ Δq ≥ +2',                    f: (w, q) => w === 1 && q >= 2 },
    { label: 'Δw = 0  (winners flat) — MUTE',        f: (w)    => w === 0 },
    { label: 'Δw ≤ −1 (winners fading) — MUTE/CNL',  f: (w)    => w <= -1 },
  ];
  for (const co of cohorts) {
    const r = cohort(co.f);
    md += `| ${co.label} | ${r.n} | ${r.w}-${r.l}-${r.p} | ${r.wr.toFixed(1)}% | ${r.roi >= 0 ? '+' : ''}${r.roi.toFixed(1)}% | ${r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}u |\n`;
  }
  md += '\n';

  md += '---\n';
  md += `_Driven by scripts/winMatrix.js • consumed by scripts/rankTodayLocks.js • JSON: \`public/win_matrix.json\`_\n`;

  const mdPath = join(REPO_ROOT, 'WIN_MATRIX.md');
  writeFileSync(mdPath, md);
  console.log(`Wrote ${mdPath}`);

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
