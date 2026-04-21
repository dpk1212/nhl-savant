/**
 * clearMoveSubset.js — Within a given regime, what additional filters
 * actually separate winners from losers?
 *
 * Loads all V8-era graded picks, isolates the requested regime, and
 * cross-tabs against every Tier-1/Tier-2 signal from the goldilocks
 * + contribution reports.  Prints a ranked "which subset do we size up on?"
 * shortlist at the end.
 *
 * Usage:
 *   node scripts/clearMoveSubset.js                # default: CLEAR_MOVE
 *   node scripts/clearMoveSubset.js NEAR_START     # override regime
 *   node scripts/clearMoveSubset.js SMALL_MOVE
 *   node scripts/clearMoveSubset.js NO_MOVE
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
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
        const qForROI50 = forW.filter(w => (w.roiNorm ?? 0) >= 50).length;
        const qForROI70 = forW.filter(w => (w.roiNorm ?? 0) >= 70).length;

        const units = peak.units ?? 0;
        const odds = peak.odds ?? 0;
        rows.push({
          date: d.date, sport: d.sport, market: mkt, team: side.team, sideKey,
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          lockStage: side.lockStage ?? 'LOCKED',
          stars: peak.stars ?? 0,
          units, odds, won,
          pnl: profit(odds, units || 1, won === 1),
          flat: flatProfit(odds, won === 1),
          contribTier: side.contribTier ?? classifyContribTier(qFor50, qAg50, margin, maxContribFor),
          qFor50, qAg50, margin, maxContribFor, dContrib,
          maxRoiN_F, meanBase_F, qForROI50, qForROI70,
          topShare: v8.topShare ?? null,
        });
      }
    }
  }
  return rows;
}

function agg(rows) {
  if (!rows.length) return { n: 0, wr: 0, flatRoi: 0, wtdRoi: 0 };
  const n = rows.length;
  const wr = (rows.filter(r => r.won === 1).length / n) * 100;
  const flatRoi = (rows.reduce((s, r) => s + r.flat, 0) / n) * 100;
  const totalU = rows.reduce((s, r) => s + (r.units || 0), 0);
  const pnl = rows.reduce((s, r) => s + r.pnl, 0);
  const wtdRoi = totalU > 0 ? (pnl / totalU) * 100 : 0;
  return { n, wr, flatRoi, wtdRoi };
}

function fmt(a) {
  if (!a.n) return '—';
  return `N=${String(a.n).padStart(2)}  WR=${a.wr.toFixed(1).padStart(5)}%  flatROI=${(a.flatRoi >= 0 ? '+' : '') + a.flatRoi.toFixed(1).padStart(5)}%  wtdROI=${(a.wtdRoi >= 0 ? '+' : '') + a.wtdRoi.toFixed(1).padStart(5)}%`;
}

(async () => {
  const TARGET = (process.argv[2] || 'CLEAR_MOVE').toUpperCase();
  const tag = TARGET.slice(0, 2);    // "CM" / "NS" / "SM" / "NM"

  const all = await load();
  const sub = all.filter(r => r.regime === TARGET);
  console.log(`\n=== ${TARGET} subset analysis (V8 since ${V8_CUTOVER}) ===`);
  console.log(`All V8 graded        : ${fmt(agg(all))}`);
  console.log(`${TARGET.padEnd(20)} : ${fmt(agg(sub))}`);
  console.log(`Others combined      : ${fmt(agg(all.filter(r => r.regime !== TARGET)))}`);

  console.log(`\n── ${TARGET} × contribTier ──`);
  for (const tier of ['STRONG', 'STANDARD', 'LEAN', 'MUTE']) {
    const rows = sub.filter(r => r.contribTier === tier);
    console.log(`${tag} × ${tier.padEnd(9)}: ${fmt(agg(rows))}`);
  }

  console.log(`\n── ${TARGET} × maxRoiN_F (elite for-side ROI wallet) ──`);
  for (const [lbl, test] of [
    ['maxRoiN_F ≥ 70', r => r.maxRoiN_F >= 70],
    ['maxRoiN_F 50-70', r => r.maxRoiN_F >= 50 && r.maxRoiN_F < 70],
    ['maxRoiN_F < 50', r => r.maxRoiN_F < 50],
  ]) {
    console.log(`${tag} × ${lbl.padEnd(16)}: ${fmt(agg(sub.filter(test)))}`);
  }

  console.log(`\n── ${TARGET} × meanBase_F (avg for-side quality) ──`);
  for (const [lbl, test] of [
    ['meanBase_F ≥ 55', r => r.meanBase_F >= 55],
    ['meanBase_F 50-55', r => r.meanBase_F >= 50 && r.meanBase_F < 55],
    ['meanBase_F < 50', r => r.meanBase_F < 50],
  ]) {
    console.log(`${tag} × ${lbl.padEnd(17)}: ${fmt(agg(sub.filter(test)))}`);
  }

  console.log(`\n── ${TARGET} × Δcontribution band ──`);
  for (const [lbl, test] of [
    ['Δ ≤ 0', r => r.dContrib <= 0],
    ['0 < Δ ≤ 50', r => r.dContrib > 0 && r.dContrib <= 50],
    ['50 < Δ ≤ 100', r => r.dContrib > 50 && r.dContrib <= 100],
    ['Δ > 100', r => r.dContrib > 100],
  ]) {
    console.log(`${tag} × ${lbl.padEnd(14)}: ${fmt(agg(sub.filter(test)))}`);
  }

  console.log(`\n── ${TARGET} × stars ──`);
  for (const s of [5, 4.5, 4, 3.5, 3, 2.5]) {
    const rows = sub.filter(r => r.stars === s);
    if (rows.length) console.log(`${tag} × ${String(s).padEnd(4)}★       : ${fmt(agg(rows))}`);
  }

  console.log(`\n── ${TARGET} × sport ──`);
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const rows = sub.filter(r => r.sport === sp);
    if (rows.length) console.log(`${tag} × ${sp.padEnd(4)}        : ${fmt(agg(rows))}`);
  }

  console.log(`\n── ${TARGET} × market ──`);
  for (const m of ['ML', 'SPREAD', 'TOTAL']) {
    const rows = sub.filter(r => r.market === m);
    if (rows.length) console.log(`${tag} × ${m.padEnd(6)}      : ${fmt(agg(rows))}`);
  }

  console.log(`\n── 2-FACTOR COMBINATIONS inside ${TARGET} ──`);
  const combos = [
    [`${tag} + contribTier=STANDARD`, r => r.contribTier === 'STANDARD'],
    [`${tag} + contribTier ∈ {STRONG, STANDARD}`, r => r.contribTier === 'STRONG' || r.contribTier === 'STANDARD'],
    [`${tag} + contribTier=LEAN`, r => r.contribTier === 'LEAN'],
    [`${tag} + maxRoiN_F ≥ 70`, r => r.maxRoiN_F >= 70],
    [`${tag} + meanBase_F ≥ 55`, r => r.meanBase_F >= 55],
    [`${tag} + maxRoiN_F ≥ 70 AND meanBase_F ≥ 55`, r => r.maxRoiN_F >= 70 && r.meanBase_F >= 55],
    [`${tag} + Δctrb ∈ (50, 100]`, r => r.dContrib > 50 && r.dContrib <= 100],
    [`${tag} + Δctrb > 100`, r => r.dContrib > 100],
    [`${tag} + stars ≥ 4`, r => r.stars >= 4],
    [`${tag} + stars ≥ 4 AND maxRoiN_F ≥ 70`, r => r.stars >= 4 && r.maxRoiN_F >= 70],
    [`${tag} + stars ≥ 4 AND contribTier ≠ LEAN`, r => r.stars >= 4 && r.contribTier !== 'LEAN' && r.contribTier !== 'MUTE'],
    [`${tag} + qFor50 ≥ 1`, r => r.qFor50 >= 1],
    [`${tag} + qFor50 = 0 (no qualified sharps)`, r => r.qFor50 === 0],
    [`${tag} + qForROI50 ≥ 2`, r => r.qForROI50 >= 2],
    [`${tag} + sport = MLB`, r => r.sport === 'MLB'],
    [`${tag} + sport = NBA`, r => r.sport === 'NBA'],
    [`${tag} + sport = NHL`, r => r.sport === 'NHL'],
  ];
  console.log('Combination                                               | Result');
  console.log('-'.repeat(125));
  for (const [lbl, test] of combos) {
    console.log(`${lbl.padEnd(58)}| ${fmt(agg(sub.filter(test)))}`);
  }

  console.log(`\n── ${TARGET} row-level detail ──`);
  console.log('Date       | Sport | Mkt    | Tier      | ★    | Odds   | qF|qA|mg | maxRoi | meanBase | Δctrb | Result');
  console.log('-'.repeat(125));
  sub.sort((a, b) => a.date.localeCompare(b.date) || a.sport.localeCompare(b.sport)).forEach(r => {
    console.log(
      `${r.date} | ${r.sport.padEnd(5)} | ${r.market.padEnd(6)} | ${r.contribTier.padEnd(9)} | ${String(r.stars).padEnd(4)} | ${(r.odds >= 0 ? '+' : '') + r.odds}`.padEnd(65) +
      `| ${r.qFor50}|${r.qAg50}|${r.margin >= 0 ? '+' : ''}${r.margin}`.padEnd(12) +
      `|   ${r.maxRoiN_F.toFixed(0).padStart(3)}  |    ${r.meanBase_F.toFixed(0).padStart(3)}   | ${r.dContrib.toFixed(0).padStart(5)} | ${r.won === 1 ? 'WIN' : 'LOSS'}`
    );
  });

  console.log(`\n── Ranked shortlist: ${TARGET} + 1 additional filter (N ≥ 3, sorted by flatROI) ──`);
  const ranked = combos
    .map(([lbl, test]) => ({ lbl, ...agg(sub.filter(test)) }))
    .filter(x => x.n >= 3)
    .sort((a, b) => b.flatRoi - a.flatRoi);
  console.log('Rank | Subset                                             | Result');
  console.log('-'.repeat(115));
  ranked.forEach((r, i) => console.log(`  ${i + 1}  | ${r.lbl.padEnd(52)}| N=${String(r.n).padStart(2)}  WR=${r.wr.toFixed(1)}%  flatROI=${(r.flatRoi >= 0 ? '+' : '') + r.flatRoi.toFixed(1)}%`));

  process.exit(0);
})();
