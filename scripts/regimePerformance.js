/**
 * regimePerformance.js — V8-era win/ROI breakdown by promotedRegime.
 *
 * Splits all V8 picks (LOCKED + SHADOW) across the 3 sharpFlow collections
 * by regime at lock/peak time, and reports outcomes. Helps decide whether
 * SMALL_MOVE picks are being unfairly held back from LOCKED promotion.
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

function profit(odds, units, won) {
  if (won == null) return 0;
  if (won) return +(units * (americanToDecimal(odds) - 1)).toFixed(3);
  return -units;
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
        const units = peak.units ?? 0;
        const odds = peak.odds ?? 0;
        rows.push({
          market: mkt,
          sport: d.sport,
          date: d.date,
          lockStage: side.lockStage ?? 'LOCKED',
          contribTier: side.contribTier ?? null,
          promotedBy: side.promotedBy ?? null,
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          stars: peak.stars ?? 0,
          units,
          odds,
          won,
          pnl: profit(odds, units || 1, won === 1),
          flatPnl: won === 1 ? americanToDecimal(odds) - 1 : -1,
        });
      }
    }
  }
  return rows;
}

function agg(rows) {
  if (!rows.length) return { n: 0 };
  const n = rows.length;
  const wins = rows.filter(r => r.won === 1).length;
  const wr = (wins / n) * 100;
  const flatRoi = (rows.reduce((s, r) => s + r.flatPnl, 0) / n) * 100;
  const totalUnits = rows.reduce((s, r) => s + (r.units || 0), 0);
  const totalPnl = rows.reduce((s, r) => s + r.pnl, 0);
  const wtdRoi = totalUnits > 0 ? (totalPnl / totalUnits) * 100 : 0;
  return { n, wins, wr, flatRoi, wtdRoi, meanStars: rows.reduce((s, r) => s + r.stars, 0) / n, meanUnits: totalUnits / n };
}

function bucket(rows, keyFn) {
  const g = {};
  for (const r of rows) {
    const k = keyFn(r) ?? 'null';
    (g[k] = g[k] || []).push(r);
  }
  return g;
}

function fmt(a) {
  if (!a.n) return '—';
  return `N=${a.n}  WR=${a.wr.toFixed(1)}%  flatROI=${a.flatRoi >= 0 ? '+' : ''}${a.flatRoi.toFixed(1)}%  wtdROI=${a.wtdRoi >= 0 ? '+' : ''}${a.wtdRoi.toFixed(1)}%  ★=${a.meanStars.toFixed(2)}  u=${a.meanUnits.toFixed(2)}`;
}

(async () => {
  const rows = await load();
  console.log(`\n=== V8-era regime performance (since ${V8_CUTOVER}) ===`);
  console.log(`Loaded ${rows.length} graded pick sides across 3 markets\n`);
  console.log(`BASELINE (all)          : ${fmt(agg(rows))}`);

  console.log(`\n── By regime ──`);
  const byRegime = bucket(rows, r => r.regime);
  for (const k of ['CLEAR_MOVE', 'NEAR_START', 'SMALL_MOVE', 'NO_MOVE', 'UNKNOWN']) {
    if (byRegime[k]) console.log(`${k.padEnd(24)}: ${fmt(agg(byRegime[k]))}`);
  }

  console.log(`\n── By regime × lockStage ──`);
  for (const k of ['CLEAR_MOVE', 'NEAR_START', 'SMALL_MOVE', 'NO_MOVE']) {
    const bucketRows = byRegime[k] || [];
    if (!bucketRows.length) continue;
    const sub = bucket(bucketRows, r => r.lockStage);
    for (const ls of ['LOCKED', 'SHADOW']) {
      if (sub[ls]) console.log(`${(k + ' · ' + ls).padEnd(24)}: ${fmt(agg(sub[ls]))}`);
    }
  }

  console.log(`\n── SMALL_MOVE detail (would we promote these?) ──`);
  const smRows = byRegime['SMALL_MOVE'] || [];
  if (smRows.length) {
    console.log(`  Aggregate             : ${fmt(agg(smRows))}`);
    const byTier = bucket(smRows, r => r.contribTier);
    for (const t of ['STRONG', 'STANDARD', 'LEAN', 'MUTE', 'null']) {
      if (byTier[t]) console.log(`  contribTier=${t.padEnd(9)}: ${fmt(agg(byTier[t]))}`);
    }
    console.log(`\n  Row detail:`);
    smRows.sort((a, b) => a.date.localeCompare(b.date));
    for (const r of smRows) {
      console.log(`    ${r.date} ${r.sport} ${r.market} ★${r.stars} u${r.units} @${r.odds >= 0 ? '+' : ''}${r.odds} stage=${r.lockStage} tier=${r.contribTier ?? '—'} → ${r.won ? 'WIN' : 'LOSS'}`);
    }
  } else {
    console.log('  (no SMALL_MOVE picks)');
  }

  console.log(`\n── By contribTier (all regimes) ──`);
  const byTier = bucket(rows, r => r.contribTier);
  for (const t of ['STRONG', 'STANDARD', 'LEAN', 'MUTE', 'null']) {
    if (byTier[t]) console.log(`tier=${t.padEnd(9)}: ${fmt(agg(byTier[t]))}`);
  }

  process.exit(0);
})();
