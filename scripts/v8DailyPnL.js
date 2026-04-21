/**
 * v8DailyPnL.js — V8-era daily PnL + multi-factor cluster report.
 *
 * Emits V8_DAILY_PNL.md with:
 *   1. Daily PnL table (longitudinal, with cumulative flat PnL)
 *   2. Single-factor breakdowns for every "important factor"
 *   3. 2-way cross-section matrices (regime × each factor)
 *   4. Top/bottom 3-way cluster rankings (N ≥ 3, ranked by flat ROI)
 *
 * Factors included:
 *   regime, maxRoiN_F, contribTier, margin, meanBase_F, Δcontribution,
 *   stars, sport, market, lockStage, promotedBy
 *
 * Usage:  node scripts/v8DailyPnL.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const V8_CUTOVER = '2026-04-18';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const profit = (odds, units, won) => (won ? +(units * (americanToDecimal(odds) - 1)).toFixed(3) : -units);
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);

function classifyContribTier(qFor, qAg, margin, maxContribFor) {
  if (margin < 0) return 'MUTE';
  if ((qFor >= 3 && qAg === 0) || (qFor >= 2 && margin >= 1)) return 'STRONG';
  if (qFor >= 1 && margin >= 1 && maxContribFor >= 50) return 'STANDARD';
  return 'LEAN';
}

// Bucket helpers — one function per factor so cross-tabs are trivial.
const bucket = {
  regime: r => r.regime,
  contribTier: r => r.contribTier,
  maxRoiN_F: r => r.maxRoiN_F >= 70 ? 'maxRoi≥70' : r.maxRoiN_F >= 50 ? 'maxRoi 50–70' : 'maxRoi<50',
  meanBase_F: r => r.meanBase_F >= 55 ? 'meanBase≥55' : r.meanBase_F >= 50 ? 'meanBase 50–55' : 'meanBase<50',
  margin: r => r.margin >= 2 ? '≥+2' : r.margin === 1 ? '+1' : r.margin === 0 ? '0' : '<0',
  dContrib: r => r.dContrib > 100 ? 'Δ>100' : r.dContrib > 50 ? 'Δ∈(50,100]' : r.dContrib > 0 ? 'Δ∈(0,50]' : 'Δ≤0',
  stars: r => r.stars >= 4 ? '★≥4' : r.stars === 3.5 ? '★=3.5' : '★≤3',
  sport: r => r.sport,
  market: r => r.market,
  lockStage: r => r.lockStage,
  promotedBy: r => r.promotedBy || '—',
};

async function load() {
  const rows = [];
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
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

        const v8 = peak.v8Scoring || {};
        const wd = v8.walletDetails || [];
        const consensusSide = v8.consensusSide || sideKey;
        const forW = wd.filter(w => w.side === consensusSide);
        const agW = wd.filter(w => w.side && w.side !== consensusSide);

        const qFor50 = forW.filter(w => (w.contribution ?? 0) >= 50).length;
        const qAg50 = agW.filter(w => (w.contribution ?? 0) >= 50).length;
        const margin = qFor50 - qAg50;
        const maxContribFor = forW.reduce((m, w) => Math.max(m, w.contribution ?? 0), 0);
        const sumContribFor = forW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        const sumContribAg = agW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        const dContrib = sumContribFor - sumContribAg;

        const maxRoiN_F = forW.reduce((m, w) => Math.max(m, w.roiNorm ?? 0), 0);
        const meanBase_F = forW.length ? forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length : 0;

        rows.push({
          date: d.date,
          sport: d.sport,
          market: mkt,
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          lockStage: side.lockStage ?? 'LOCKED',
          promotedBy: side.promotedBy ?? null,
          stars: peak.stars ?? 0,
          units: peak.units ?? 0,
          odds: peak.odds ?? 0,
          won,
          pnl: profit(peak.odds ?? 0, peak.units || 1, won === 1),
          flat: flatProfit(peak.odds ?? 0, won === 1),
          contribTier: side.contribTier ?? classifyContribTier(qFor50, qAg50, margin, maxContribFor),
          qFor50, qAg50, margin, maxContribFor, dContrib,
          maxRoiN_F, meanBase_F,
        });
      }
    }
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

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

function sign(v, digits = 1) { return (v >= 0 ? '+' : '') + v.toFixed(digits); }
function fmtAgg(a) {
  if (!a.n) return '—';
  return `N=${a.n}  WR=${a.wr.toFixed(1)}%  flatROI=${sign(a.flatRoi)}%  wtdROI=${sign(a.wtdRoi)}%`;
}
function mdHeader(cols) { return `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`; }

// ── Single-factor breakdown table ──────────────────────────────────
function factorTable(name, rows, bucketFn) {
  const order = [...new Set(rows.map(bucketFn))].sort();
  const out = [];
  out.push(`### ${name}`);
  out.push(mdHeader(['Bucket', 'N', 'WR', 'flat ROI', 'wtd ROI', 'Flat PnL (u)']));
  for (const b of order) {
    const a = agg(rows.filter(r => bucketFn(r) === b));
    if (!a.n) continue;
    out.push(`| ${b} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.wtdRoi)}% | ${sign(a.flatPnl, 2)} |`);
  }
  out.push('');
  return out.join('\n');
}

// ── 2-way cross matrix ─────────────────────────────────────────────
// Renders rows (rowFn) × cols (colFn) with the specified metric per cell.
function matrix(title, rows, rowFn, colFn, metric = 'flatRoi') {
  const rowOrder = [...new Set(rows.map(rowFn))].sort();
  const colOrder = [...new Set(rows.map(colFn))].sort();
  const out = [];
  out.push(`### ${title}`);
  out.push(`*cell = ${metric === 'flatRoi' ? 'N · WR · flat ROI' : metric}*`);
  out.push('');
  out.push(`| |${colOrder.map(c => ` **${c}** |`).join('')}`);
  out.push(`|---|${colOrder.map(() => '---|').join('')}`);
  for (const rv of rowOrder) {
    const cells = colOrder.map(cv => {
      const sub = rows.filter(r => rowFn(r) === rv && colFn(r) === cv);
      const a = agg(sub);
      if (!a.n) return '—';
      return `N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}%`;
    });
    out.push(`| **${rv}** | ${cells.join(' | ')} |`);
  }
  out.push('');
  return out.join('\n');
}

// ── 3-way ranked clusters ──────────────────────────────────────────
function threeWayRanking(rows, factorMap, minN = 3, limit = 12) {
  const factors = Object.keys(factorMap);
  const clusters = new Map();
  for (const r of rows) {
    for (let i = 0; i < factors.length; i++) {
      for (let j = i + 1; j < factors.length; j++) {
        for (let k = j + 1; k < factors.length; k++) {
          const fa = factors[i], fb = factors[j], fc = factors[k];
          const key = `${fa}=${factorMap[fa](r)} · ${fb}=${factorMap[fb](r)} · ${fc}=${factorMap[fc](r)}`;
          if (!clusters.has(key)) clusters.set(key, []);
          clusters.get(key).push(r);
        }
      }
    }
  }
  const ranked = [];
  for (const [key, subset] of clusters) {
    const a = agg(subset);
    if (a.n >= minN) ranked.push({ key, ...a });
  }
  ranked.sort((a, b) => b.flatRoi - a.flatRoi);
  return { top: ranked.slice(0, limit), bottom: ranked.slice(-limit).reverse() };
}

(async () => {
  const all = await load();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];

  out.push(`# V8-Era Daily PnL + Cluster Report`);
  out.push('');
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER}`);
  out.push('');
  out.push(`Full graded V8 sample: **${fmtAgg(agg(all))}** · total flat PnL **${sign(agg(all).flatPnl, 2)}u**`);
  out.push('');
  out.push(`All PnL/ROI figures are computed off \`peak\` snapshots (the units actually shown on the card at game time). Flat ROI treats every bet as 1 unit; weighted ROI uses the posted units. Cumulative PnL is the running sum of flat ROI across days.`);

  // ── 1. DAILY PnL TIMELINE ────────────────────────────────────────
  out.push('\n---\n');
  out.push('## 1. Daily PnL timeline');
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

  // ── 2. SINGLE-FACTOR BREAKDOWNS ──────────────────────────────────
  out.push('\n---\n');
  out.push('## 2. Single-factor performance (every important bucket)');
  out.push('');
  const factors = [
    ['Regime', bucket.regime],
    ['maxRoiN_F (elite for-side ROI wallet)', bucket.maxRoiN_F],
    ['contribTier', bucket.contribTier],
    ['Contribution margin (qFor − qAg)', bucket.margin],
    ['meanBase_F (for-side wallet caliber)', bucket.meanBase_F],
    ['Δcontribution band', bucket.dContrib],
    ['Stars', bucket.stars],
    ['Sport', bucket.sport],
    ['Market', bucket.market],
    ['Lock stage', bucket.lockStage],
    ['Promoted by', bucket.promotedBy],
  ];
  for (const [name, fn] of factors) {
    out.push(factorTable(name, all, fn));
  }

  // ── 3. 2-WAY CROSS-SECTION MATRICES ──────────────────────────────
  out.push('\n---\n');
  out.push('## 3. 2-way cross sections');
  out.push('');
  out.push('Cells show `N · WR · flat ROI`. "—" means no picks in that cell.');
  out.push('');
  const pairs = [
    ['Regime × contribTier',         bucket.regime,      bucket.contribTier],
    ['Regime × meanBase_F',          bucket.regime,      bucket.meanBase_F],
    ['Regime × maxRoiN_F',           bucket.regime,      bucket.maxRoiN_F],
    ['Regime × Δcontribution',       bucket.regime,      bucket.dContrib],
    ['Regime × sport',               bucket.regime,      bucket.sport],
    ['Regime × market',              bucket.regime,      bucket.market],
    ['contribTier × meanBase_F',     bucket.contribTier, bucket.meanBase_F],
    ['contribTier × maxRoiN_F',      bucket.contribTier, bucket.maxRoiN_F],
    ['contribTier × margin',         bucket.contribTier, bucket.margin],
    ['meanBase_F × maxRoiN_F',       bucket.meanBase_F,  bucket.maxRoiN_F],
    ['Promoted by × regime',         bucket.promotedBy,  bucket.regime],
    ['Lock stage × regime',          bucket.lockStage,   bucket.regime],
  ];
  for (const [title, rfn, cfn] of pairs) {
    out.push(matrix(title, all, rfn, cfn));
  }

  // ── 4. 3-WAY CLUSTER RANKINGS ────────────────────────────────────
  out.push('\n---\n');
  out.push('## 4. 3-way cluster rankings (N ≥ 3)');
  out.push('');
  out.push(`Every possible intersection of three factors from the set below. Top 12 by flat ROI are our **hit clusters**; bottom 12 are our **miss clusters**. Use this to find the actionable combinations before they show up in single-factor tables.`);
  out.push('');
  out.push('Factor pool: `regime`, `contribTier`, `maxRoiN_F`, `meanBase_F`, `margin`, `dContrib`, `stars`, `sport`, `market`, `promotedBy`, `lockStage`.');
  out.push('');
  const factorPool = {
    regime: bucket.regime,
    contribTier: bucket.contribTier,
    maxRoiN_F: bucket.maxRoiN_F,
    meanBase_F: bucket.meanBase_F,
    margin: bucket.margin,
    dContrib: bucket.dContrib,
    stars: bucket.stars,
    sport: bucket.sport,
    market: bucket.market,
    promotedBy: bucket.promotedBy,
    lockStage: bucket.lockStage,
  };
  const { top, bottom } = threeWayRanking(all, factorPool, 3, 15);

  out.push('### 4a. Top 15 clusters (hit zones, sorted by flat ROI)');
  out.push(mdHeader(['Rank', 'Cluster', 'N', 'WR', 'flat ROI', 'wtd ROI', 'Flat PnL (u)']));
  top.forEach((c, i) => {
    out.push(`| ${i + 1} | ${c.key} | ${c.n} | ${c.wr.toFixed(1)}% | ${sign(c.flatRoi)}% | ${sign(c.wtdRoi)}% | ${sign(c.flatPnl, 2)} |`);
  });

  out.push('');
  out.push('### 4b. Bottom 15 clusters (miss zones, worst flat ROI first)');
  out.push(mdHeader(['Rank', 'Cluster', 'N', 'WR', 'flat ROI', 'wtd ROI', 'Flat PnL (u)']));
  bottom.forEach((c, i) => {
    out.push(`| ${i + 1} | ${c.key} | ${c.n} | ${c.wr.toFixed(1)}% | ${sign(c.flatRoi)}% | ${sign(c.wtdRoi)}% | ${sign(c.flatPnl, 2)} |`);
  });

  // ── 5. DISTILLED "SO WHAT" ───────────────────────────────────────
  out.push('\n---\n');
  out.push('## 5. Quick distillation');
  out.push('');
  out.push('Where do we want more exposure (size up / reinforce promotion)?');
  out.push('');
  top.slice(0, 5).forEach(c => out.push(`- ${c.key} → ${fmtAgg(c)}`));
  out.push('');
  out.push('Where are we bleeding (size down / reconsider)?');
  out.push('');
  bottom.slice(0, 5).forEach(c => out.push(`- ${c.key} → ${fmtAgg(c)}`));

  out.push('');
  out.push('---');
  out.push(`*Auto-generated by \`scripts/v8DailyPnL.js\` (daily). Cross-referenced with \`STAR_RATING_SYSTEM.md\` (V8.1/V8.2/V8.3 rules) and \`V8_SIGNAL_MONITOR.md\` (live-rule + deferred-candidate watch list).*`);
  out.push('');

  const filepath = join(__dirname, '..', 'V8_DAILY_PNL.md');
  writeFileSync(filepath, out.join('\n'));
  console.log(`Wrote ${filepath}`);
  console.log(`Days covered: ${byDate.size} · Full sample: ${fmtAgg(agg(all))} · Cum flat PnL: ${sign(cum, 2)}u`);
  process.exit(0);
})();
