/**
 * sharpVaultV8Analysis.js — can V8 signals predict winners in the Sharp Vault?
 *
 * Reads every GRADED sharp_action_positions doc since V8 cutover and
 * asks the same question as v8DailyPnL.js but at the PER-WALLET-BET
 * level:  which individual sharp bets does V8 flag as likely winners?
 *
 * Emits SHARP_VAULT_V8_REPORT.md with:
 *   1. Baseline — N, WR, total PnL, dollar-weighted ROI, mean position ROI
 *   2. Single-factor breakdowns for every V8 signal on the position:
 *      v8_onConsensusSide, v8_qualifiedContribution, v8_walletBase,
 *      v8_walletRoiNorm, v8_walletContribution, v8_convictionMult,
 *      v8_sizeRatio, v8_contribTier (game-level), v8_stars (game-level),
 *      label, sport, market
 *   3. 2-way matrices for the pairs most likely to isolate winners
 *   4. "Winner-filter" simulation — what would our vault look like if
 *      we *only* took positions matching each proposed filter?
 *   5. 3-way ranked clusters (top/bottom by dollar-weighted ROI)
 *
 * Usage:  node scripts/sharpVaultV8Analysis.js
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
const COLLECTION = 'sharp_action_positions';

const sign = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d);
const dollars = (v) => (v >= 0 ? '+$' : '-$') + Math.abs(v).toFixed(0);
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

async function load() {
  const snap = await db.collection(COLLECTION)
    .where('status', '==', 'GRADED')
    .get();

  const rows = [];
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.date || d.date < V8_CUTOVER) continue;          // V8-era only
    // Vault-only report — exclude SHADOW rows. Missing field (pre-shadow docs)
    // is treated as VAULT so historical report continuity is preserved.
    if (d.vaultQualified === false) continue;
    const result = d.result;
    if (result !== 'WIN' && result !== 'LOSS') continue;   // drop PUSH
    const won = result === 'WIN' ? 1 : 0;
    const invested = Number(d.size ?? d.invested ?? 0);
    const settledPnl = Number(d.settledPnl ?? 0);
    if (invested <= 0) continue;

    rows.push({
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      side: d.side,
      label: d.label || null,
      invested,
      settledPnl,
      won,
      posRoi: (settledPnl / invested) * 100,
      // per-wallet V8
      v8_walletBase: d.v8_walletBase ?? null,
      v8_walletRoiNorm: d.v8_walletRoiNorm ?? null,
      v8_walletContribution: d.v8_walletContribution ?? null,
      v8_convictionMult: d.v8_convictionMult ?? null,
      v8_sizeRatio: d.v8_sizeRatio ?? null,
      v8_qualifiedContribution: d.v8_qualifiedContribution ?? null,
      // per-position flags
      v8_onConsensusSide: d.v8_onConsensusSide ?? null,
      // game-level V8
      v8_stars: d.v8_stars ?? null,
      v8_contribTier: d.v8_contribTier ?? null,
      v8_contribMargin: d.v8_contribMargin ?? null,
      v8_qFor50: d.v8_qFor50 ?? null,
    });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

function agg(rows) {
  if (!rows.length) return null;
  const n = rows.length;
  const wins = rows.filter(r => r.won === 1).length;
  const wr = (wins / n) * 100;
  const totalInvested = rows.reduce((s, r) => s + r.invested, 0);
  const totalPnl = rows.reduce((s, r) => s + r.settledPnl, 0);
  const dollarRoi = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const meanRoi = rows.reduce((s, r) => s + r.posRoi, 0) / n;
  return { n, wr, totalInvested, totalPnl, dollarRoi, meanRoi };
}

function fmtCell(a) {
  if (!a || !a.n) return '—';
  return `N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.dollarRoi, 0)}% · ${dollars(a.totalPnl)}`;
}

// ── Per-factor table ────────────────────────────────────────────────
function factorTable(name, rows, bucketFn, sortByRoi = false) {
  const bucketVals = [...new Set(rows.map(bucketFn))].filter(b => b != null && b !== undefined);
  const sorted = sortByRoi
    ? bucketVals.map(b => ({ b, a: agg(rows.filter(r => bucketFn(r) === b)) }))
        .filter(x => x.a)
        .sort((x, y) => y.a.dollarRoi - x.a.dollarRoi)
        .map(x => x.b)
    : bucketVals.sort();
  const out = [];
  out.push(`### ${name}`);
  out.push(mdHeader(['Bucket', 'N', 'WR', 'Total invested', 'Total PnL', '$ ROI', 'Mean pos ROI']));
  for (const b of sorted) {
    const a = agg(rows.filter(r => bucketFn(r) === b));
    if (!a) continue;
    out.push(`| ${b} | ${a.n} | ${a.wr.toFixed(1)}% | $${a.totalInvested.toFixed(0)} | ${dollars(a.totalPnl)} | ${sign(a.dollarRoi)}% | ${sign(a.meanRoi)}% |`);
  }
  out.push('');
  return out.join('\n');
}

// ── 2-way matrix ────────────────────────────────────────────────────
function matrix(title, rows, rowFn, colFn) {
  const rowOrder = [...new Set(rows.map(rowFn))].filter(b => b != null).sort();
  const colOrder = [...new Set(rows.map(colFn))].filter(b => b != null).sort();
  const out = [];
  out.push(`### ${title}`);
  out.push(`*cell = N · WR · $ROI · PnL*`);
  out.push('');
  out.push(`| |${colOrder.map(c => ` **${c}** |`).join('')}`);
  out.push(`|---|${colOrder.map(() => '---|').join('')}`);
  for (const rv of rowOrder) {
    const cells = colOrder.map(cv => fmtCell(agg(rows.filter(r => rowFn(r) === rv && colFn(r) === cv))));
    out.push(`| **${rv}** | ${cells.join(' | ')} |`);
  }
  out.push('');
  return out.join('\n');
}

// ── Bucket helpers ──────────────────────────────────────────────────
const bucket = {
  onConsensusSide: r => r.v8_onConsensusSide == null ? 'unknown' : r.v8_onConsensusSide ? 'on consensus' : 'against',
  qualifiedContribution: r => r.v8_qualifiedContribution == null ? 'unknown' : r.v8_qualifiedContribution ? 'qualified (≥50)' : 'not qualified (<50)',
  walletBase: r => r.v8_walletBase == null ? '—' : r.v8_walletBase >= 70 ? 'base≥70' : r.v8_walletBase >= 55 ? 'base 55–70' : r.v8_walletBase >= 40 ? 'base 40–55' : 'base<40',
  walletRoiNorm: r => r.v8_walletRoiNorm == null ? '—' : r.v8_walletRoiNorm >= 80 ? 'roi≥80' : r.v8_walletRoiNorm >= 60 ? 'roi 60–80' : r.v8_walletRoiNorm >= 40 ? 'roi 40–60' : 'roi<40',
  walletContribution: r => r.v8_walletContribution == null ? '—' : r.v8_walletContribution >= 100 ? 'ctrb≥100' : r.v8_walletContribution >= 50 ? 'ctrb 50–100' : r.v8_walletContribution >= 25 ? 'ctrb 25–50' : 'ctrb<25',
  convictionMult: r => r.v8_convictionMult == null ? '—' : r.v8_convictionMult >= 1.3 ? 'conv≥1.3' : r.v8_convictionMult >= 1.1 ? 'conv 1.1–1.3' : r.v8_convictionMult >= 0.9 ? 'conv 0.9–1.1' : 'conv<0.9',
  sizeRatio: r => r.v8_sizeRatio == null ? '—' : r.v8_sizeRatio >= 3 ? 'size≥3x' : r.v8_sizeRatio >= 1.5 ? 'size 1.5–3x' : r.v8_sizeRatio >= 0.8 ? 'size 0.8–1.5x' : 'size<0.8x',
  contribTier: r => r.v8_contribTier || '—',
  stars: r => r.v8_stars == null ? '—' : r.v8_stars >= 4 ? '★≥4' : r.v8_stars >= 3 ? '★ 3–3.5' : r.v8_stars >= 2 ? '★ 2–2.5' : '★<2',
  contribMargin: r => r.v8_contribMargin == null ? '—' : r.v8_contribMargin >= 2 ? 'margin≥+2' : r.v8_contribMargin === 1 ? 'margin=+1' : r.v8_contribMargin === 0 ? 'margin=0' : 'margin<0',
  label: r => r.label || '—',
  sport: r => r.sport,
  market: r => r.market,
};

// ── Winner-filter simulator ─────────────────────────────────────────
// For each proposed filter, report: what portion of the vault does it keep?
// What's the WR / $ROI / total PnL of the KEPT vs DROPPED subset?
function winnerFilters(rows) {
  const out = [];
  out.push(`### Winner-filter simulation`);
  out.push('');
  out.push(`Each row shows what the Sharp Vault would look like if we **only kept** positions matching the filter. "Kept" is our proposed whitelist; "Dropped" is what we'd fade.`);
  out.push('');
  out.push(mdHeader(['Filter', 'Kept N', 'Kept WR', 'Kept $ROI', 'Kept PnL', 'Dropped N', 'Dropped $ROI', 'Dropped PnL']));
  const filters = [
    ['v8_onConsensusSide = true',
      r => r.v8_onConsensusSide === true],
    ['v8_qualifiedContribution = true (contrib ≥ 50)',
      r => r.v8_qualifiedContribution === true],
    ['v8_walletBase ≥ 55',
      r => (r.v8_walletBase ?? 0) >= 55],
    ['v8_walletBase ≥ 70',
      r => (r.v8_walletBase ?? 0) >= 70],
    ['v8_walletRoiNorm ≥ 70',
      r => (r.v8_walletRoiNorm ?? 0) >= 70],
    ['v8_walletContribution ≥ 50',
      r => (r.v8_walletContribution ?? 0) >= 50],
    ['v8_walletContribution ≥ 100',
      r => (r.v8_walletContribution ?? 0) >= 100],
    ['v8_contribTier ∈ {STRONG, STANDARD}',
      r => r.v8_contribTier === 'STRONG' || r.v8_contribTier === 'STANDARD'],
    ['v8_stars ≥ 3',
      r => (r.v8_stars ?? 0) >= 3],
    ['v8_stars ≥ 4',
      r => (r.v8_stars ?? 0) >= 4],
    ['on-consensus AND qualified (≥50)',
      r => r.v8_onConsensusSide === true && r.v8_qualifiedContribution === true],
    ['on-consensus AND walletBase ≥ 55',
      r => r.v8_onConsensusSide === true && (r.v8_walletBase ?? 0) >= 55],
    ['on-consensus AND walletRoiNorm ≥ 70',
      r => r.v8_onConsensusSide === true && (r.v8_walletRoiNorm ?? 0) >= 70],
    ['on-consensus AND contribTier ∈ {STRONG, STANDARD}',
      r => r.v8_onConsensusSide === true && (r.v8_contribTier === 'STRONG' || r.v8_contribTier === 'STANDARD')],
    ['on-consensus AND qualified AND stars ≥ 3',
      r => r.v8_onConsensusSide === true && r.v8_qualifiedContribution === true && (r.v8_stars ?? 0) >= 3],
    ['ELITE combo: on-consensus AND walletBase≥55 AND contribTier∈{STRONG,STANDARD}',
      r => r.v8_onConsensusSide === true && (r.v8_walletBase ?? 0) >= 55 && (r.v8_contribTier === 'STRONG' || r.v8_contribTier === 'STANDARD')],
  ];
  for (const [lbl, test] of filters) {
    const kept = agg(rows.filter(test));
    const dropped = agg(rows.filter(r => !test(r)));
    if (!kept) {
      out.push(`| ${lbl} | 0 | — | — | — | ${dropped?.n ?? 0} | ${dropped ? sign(dropped.dollarRoi) + '%' : '—'} | ${dropped ? dollars(dropped.totalPnl) : '—'} |`);
      continue;
    }
    out.push(`| ${lbl} | ${kept.n} | ${kept.wr.toFixed(1)}% | ${sign(kept.dollarRoi)}% | ${dollars(kept.totalPnl)} | ${dropped?.n ?? 0} | ${dropped ? sign(dropped.dollarRoi) + '%' : '—'} | ${dropped ? dollars(dropped.totalPnl) : '—'} |`);
  }
  out.push('');
  return out.join('\n');
}

// ── 3-way cluster rankings ──────────────────────────────────────────
function threeWay(rows, factorMap, minN = 8, limit = 15) {
  const factors = Object.keys(factorMap);
  const clusters = new Map();
  for (const r of rows) {
    for (let i = 0; i < factors.length; i++) {
      for (let j = i + 1; j < factors.length; j++) {
        for (let k = j + 1; k < factors.length; k++) {
          const a = factors[i], b = factors[j], c = factors[k];
          const key = `${a}=${factorMap[a](r)} · ${b}=${factorMap[b](r)} · ${c}=${factorMap[c](r)}`;
          if (!clusters.has(key)) clusters.set(key, []);
          clusters.get(key).push(r);
        }
      }
    }
  }
  const ranked = [];
  for (const [key, subset] of clusters) {
    const ag = agg(subset);
    if (ag && ag.n >= minN) ranked.push({ key, ...ag });
  }
  ranked.sort((a, b) => b.dollarRoi - a.dollarRoi);
  return { top: ranked.slice(0, limit), bottom: ranked.slice(-limit).reverse() };
}

(async () => {
  const all = await load();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];

  out.push(`# Sharp Vault × V8 — can we identify winners?`);
  out.push('');
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER}`);
  out.push('');

  if (!all.length) {
    out.push(`**No graded sharp_action_positions since cutover.** Run this after the grader completes.`);
    const filepath = join(__dirname, '..', 'SHARP_VAULT_V8_REPORT.md');
    writeFileSync(filepath, out.join('\n'));
    console.log(`Wrote ${filepath} (empty)`);
    process.exit(0);
  }

  const b = agg(all);
  out.push(`## Baseline (all graded V8-era sharp vault positions)`);
  out.push('');
  out.push(mdHeader(['Metric', 'Value']));
  out.push(`| Positions (N) | ${b.n} |`);
  out.push(`| Win rate | ${b.wr.toFixed(1)}% |`);
  out.push(`| Total invested | $${b.totalInvested.toFixed(0)} |`);
  out.push(`| Total PnL | ${dollars(b.totalPnl)} |`);
  out.push(`| Dollar-weighted ROI | ${sign(b.dollarRoi)}% |`);
  out.push(`| Mean per-position ROI | ${sign(b.meanRoi)}% |`);
  out.push('');
  out.push(`This is the universe we're trying to filter. Everything below asks: which V8 signals would let us keep the winners and drop the losers?`);

  // ── 1. Daily timeline ──────────────────────────────────────────
  const dates = [...new Set(all.map(r => r.date))].sort();
  out.push(`\n---\n## 1. Daily Sharp Vault PnL`);
  out.push('');
  out.push(mdHeader(['Date', 'Positions', 'WR', 'Invested', 'PnL', '$ ROI', 'Cum PnL']));
  let cum = 0;
  for (const d of dates) {
    const a = agg(all.filter(r => r.date === d));
    cum += a.totalPnl;
    out.push(`| ${d} | ${a.n} | ${a.wr.toFixed(1)}% | $${a.totalInvested.toFixed(0)} | ${dollars(a.totalPnl)} | ${sign(a.dollarRoi)}% | ${dollars(cum)} |`);
  }

  // ── 2. Single-factor breakdowns ──────────────────────────────────
  out.push('\n---\n## 2. Single-factor breakdowns — which V8 signals separate winners?');
  out.push('');
  out.push(`Within each factor, buckets are sorted by **dollar-weighted ROI** (best → worst) so the winners float to the top.`);
  out.push('');
  const factors = [
    ['v8_onConsensusSide', bucket.onConsensusSide],
    ['v8_qualifiedContribution (contrib ≥ 50)', bucket.qualifiedContribution],
    ['v8_walletBase (this wallet\'s composite quality)', bucket.walletBase],
    ['v8_walletRoiNorm (this wallet\'s ROI percentile)', bucket.walletRoiNorm],
    ['v8_walletContribution (walletBase × conviction)', bucket.walletContribution],
    ['v8_convictionMult (bet-size conviction)', bucket.convictionMult],
    ['v8_sizeRatio (this bet vs wallet average)', bucket.sizeRatio],
    ['v8_contribTier (game-level tier)', bucket.contribTier],
    ['v8_stars (game-level stars)', bucket.stars],
    ['v8_contribMargin (qFor − qAg)', bucket.contribMargin],
    ['label (internal tier)', bucket.label],
    ['sport', bucket.sport],
    ['market', bucket.market],
  ];
  for (const [name, fn] of factors) out.push(factorTable(name, all, fn, true));

  // ── 3. 2-way matrices ────────────────────────────────────────────
  out.push('\n---\n## 3. 2-way cross sections');
  out.push('');
  out.push('Cells show `N · WR · $ROI · PnL`. These isolate combinations where one filter alone is noisy but two together are stable.');
  out.push('');
  const pairs = [
    ['v8_onConsensusSide × v8_walletBase', bucket.onConsensusSide, bucket.walletBase],
    ['v8_onConsensusSide × v8_contribTier', bucket.onConsensusSide, bucket.contribTier],
    ['v8_onConsensusSide × v8_walletRoiNorm', bucket.onConsensusSide, bucket.walletRoiNorm],
    ['v8_onConsensusSide × v8_stars', bucket.onConsensusSide, bucket.stars],
    ['v8_walletBase × v8_contribTier', bucket.walletBase, bucket.contribTier],
    ['v8_walletBase × v8_convictionMult', bucket.walletBase, bucket.convictionMult],
    ['v8_contribTier × v8_qualifiedContribution', bucket.contribTier, bucket.qualifiedContribution],
    ['v8_stars × v8_contribTier', bucket.stars, bucket.contribTier],
  ];
  for (const [t, rf, cf] of pairs) out.push(matrix(t, all, rf, cf));

  // ── 4. Winner-filter simulator ───────────────────────────────────
  out.push('\n---\n## 4. Winner-filter simulation');
  out.push('');
  out.push(`If we treated the Sharp Vault as a book and only took the subset of positions matching each filter below, this is what we'd have actually done.`);
  out.push('');
  out.push(winnerFilters(all));

  // ── 5. 3-way cluster rankings ────────────────────────────────────
  out.push('\n---\n## 5. 3-way cluster rankings (N ≥ 8)');
  out.push('');
  out.push(`Every 3-factor intersection with at least 8 positions, ranked by dollar-weighted ROI. Top = where V8 clusters historically win big. Bottom = where V8 clusters bleed.`);
  out.push('');
  const pool = {
    onCons: bucket.onConsensusSide,
    qualified: bucket.qualifiedContribution,
    walletBase: bucket.walletBase,
    walletRoi: bucket.walletRoiNorm,
    contribTier: bucket.contribTier,
    stars: bucket.stars,
    margin: bucket.contribMargin,
    conviction: bucket.convictionMult,
    sport: bucket.sport,
    market: bucket.market,
  };
  const { top, bottom } = threeWay(all, pool, 8, 15);

  out.push('### 5a. Top 15 hit clusters');
  out.push(mdHeader(['Rank', 'Cluster', 'N', 'WR', '$ ROI', 'PnL']));
  top.forEach((c, i) => {
    out.push(`| ${i + 1} | ${c.key} | ${c.n} | ${c.wr.toFixed(1)}% | ${sign(c.dollarRoi)}% | ${dollars(c.totalPnl)} |`);
  });

  out.push('');
  out.push('### 5b. Bottom 15 miss clusters');
  out.push(mdHeader(['Rank', 'Cluster', 'N', 'WR', '$ ROI', 'PnL']));
  bottom.forEach((c, i) => {
    out.push(`| ${i + 1} | ${c.key} | ${c.n} | ${c.wr.toFixed(1)}% | ${sign(c.dollarRoi)}% | ${dollars(c.totalPnl)} |`);
  });

  // ── 6. Daily by factor (stability) ──────────────────────────────
  out.push('\n---\n## 6. Stability — daily breakdown of key signals');
  out.push('');
  out.push('Same cells as §2 but split across days. Signals that stay positive (or negative) every day are the trustworthy ones.');
  out.push('');
  const stabFactors = [
    ['v8_onConsensusSide', bucket.onConsensusSide],
    ['v8_walletBase', bucket.walletBase],
    ['v8_walletRoiNorm', bucket.walletRoiNorm],
    ['v8_contribTier', bucket.contribTier],
    ['v8_stars', bucket.stars],
  ];
  for (const [name, fn] of stabFactors) {
    const buckets = [...new Set(all.map(fn))].filter(v => v != null).sort();
    out.push(`### ${name}`);
    out.push(mdHeader(['Bucket', ...dates.map(d => d.slice(5)), 'TOTAL']));
    for (const bv of buckets) {
      const inBucket = all.filter(r => fn(r) === bv);
      const cells = dates.map(d => fmtCell(agg(inBucket.filter(r => r.date === d))));
      const tot = fmtCell(agg(inBucket));
      out.push(`| ${bv} | ${cells.join(' | ')} | **${tot}** |`);
    }
    out.push('');
  }

  out.push('---');
  out.push(`*Auto-generated by \`scripts/sharpVaultV8Analysis.js\`. Source: \`sharp_action_positions\` collection (GRADED subset). Complements \`V8_DAILY_PNL.md\` (game-level) by analyzing individual wallet bets.*`);
  out.push('');

  const filepath = join(__dirname, '..', 'SHARP_VAULT_V8_REPORT.md');
  writeFileSync(filepath, out.join('\n'));
  console.log(`Wrote ${filepath}`);
  console.log(`Sharp Vault baseline: N=${b.n}  WR=${b.wr.toFixed(1)}%  invested=$${b.totalInvested.toFixed(0)}  pnl=${dollars(b.totalPnl)}  $ROI=${sign(b.dollarRoi)}%`);
  process.exit(0);
})();
