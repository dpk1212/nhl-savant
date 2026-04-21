/**
 * signalAcrossFullSample.js — V8.3 sizing-modifier monitor.
 *
 * Tracks the three live sizing signals (CLEAR_MOVE, meanBase_F, maxRoiN_F)
 * and every deferred sub-rule we've said we'd re-evaluate once its
 * sub-sample grows.  Emits V8_SIGNAL_MONITOR.md — committed daily by the
 * daily-contribution-edge workflow so we can see drift at a glance.
 *
 * Usage:  node scripts/signalAcrossFullSample.js
 * Output: V8_SIGNAL_MONITOR.md at repo root
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
const REGIMES = ['CLEAR_MOVE', 'NEAR_START', 'SMALL_MOVE', 'NO_MOVE'];

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

        rows.push({
          date: d.date, sport: d.sport, market: mkt,
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          stars: peak.stars ?? 0,
          units: peak.units ?? 0,
          odds: peak.odds ?? 0,
          won,
          pnl: profit(peak.odds ?? 0, peak.units || 1, won === 1),
          flat: flatProfit(peak.odds ?? 0, won === 1),
          contribTier: side.contribTier ?? classifyContribTier(qFor50, qAg50, margin, maxContribFor),
          maxRoiN_F,
          meanBase_F,
          dContrib,
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

function fmtRow(lbl, a) {
  if (!a.n) return `| ${lbl} | — | — | — | — |`;
  const sign = (v) => (v >= 0 ? '+' : '') + v.toFixed(1);
  return `| ${lbl} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.wtdRoi)}% |`;
}

function section(title) {
  return `\n## ${title}\n`;
}

function mdHeader(cols) {
  return `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;
}

(async () => {
  const all = await load();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];

  out.push(`# V8.3 Sizing-Signal Monitor`);
  out.push(``);
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER}`);
  out.push(``);
  out.push(`Full graded sample: **${fmt(agg(all))}**`);
  out.push(``);
  out.push(`This report tracks every signal V8.3 currently acts on AND every sub-rule we've explicitly deferred. When a deferred subset crosses its re-evaluation threshold (noted per row), it's a candidate for a V8.x follow-up.`);

  // ── Live signals ────────────────────────────────────────────────
  out.push(section('1. Live sizing signals (currently in production)'));

  out.push(`### CLEAR_MOVE regime (V8.2 · flat +0.5u)`);
  out.push(mdHeader(['Subset', 'N', 'WR', 'flat ROI', 'wtd ROI']));
  out.push(fmtRow('regime = CLEAR_MOVE',       agg(all.filter(r => r.regime === 'CLEAR_MOVE'))));
  out.push(fmtRow('regime ≠ CLEAR_MOVE',       agg(all.filter(r => r.regime !== 'CLEAR_MOVE'))));

  out.push('');
  out.push(`### meanBase_F — wallet-crew caliber (V8.3 · ±0.25u, regime-agnostic)`);
  out.push(mdHeader(['Subset', 'N', 'WR', 'flat ROI', 'wtd ROI']));
  out.push(fmtRow('meanBase_F ≥ 55  (+0.25u)', agg(all.filter(r => r.meanBase_F >= 55))));
  out.push(fmtRow('meanBase_F 50–55 (neutral)', agg(all.filter(r => r.meanBase_F >= 50 && r.meanBase_F < 55))));
  out.push(fmtRow('meanBase_F < 50  (−0.25u)', agg(all.filter(r => r.meanBase_F < 50))));

  out.push('');
  out.push(`### NEAR_START × maxRoiN_F — elite for-side wallet (V8.3 · ±0.25u, NEAR_START only)`);
  out.push(mdHeader(['Subset', 'N', 'WR', 'flat ROI', 'wtd ROI']));
  const NS = all.filter(r => r.regime === 'NEAR_START');
  out.push(fmtRow('NEAR_START + maxRoiN_F ≥ 70  (+0.25u)', agg(NS.filter(r => r.maxRoiN_F >= 70))));
  out.push(fmtRow('NEAR_START + maxRoiN_F 50–70 (−0.25u)', agg(NS.filter(r => r.maxRoiN_F >= 50 && r.maxRoiN_F < 70))));
  out.push(fmtRow('NEAR_START + maxRoiN_F < 50  (neutral)', agg(NS.filter(r => r.maxRoiN_F < 50))));

  // ── Deferred candidates ─────────────────────────────────────────
  out.push(section('2. Deferred candidates (re-evaluate when N crosses threshold)'));
  out.push(mdHeader(['Candidate rule', 'Current subset', 'N', 'WR', 'flat ROI', 'Promote when']));
  const deferred = [
    {
      rule: '+0.25u elite-of-elite (stack on top of V8.3)',
      subset: 'maxRoiN_F ≥ 70 AND meanBase_F ≥ 55',
      test:   r => r.maxRoiN_F >= 70 && r.meanBase_F >= 55,
      threshold: 'N ≥ 15 AND flat ROI ≥ +30%',
    },
    {
      rule: 'NBA NEAR_START fade (−0.5u or hard-block)',
      subset: 'regime = NEAR_START AND sport = NBA',
      test:   r => r.regime === 'NEAR_START' && r.sport === 'NBA',
      threshold: 'N ≥ 20 AND WR < 40%',
    },
    {
      rule: '+0.25u contribTier = STANDARD in CLEAR_MOVE',
      subset: 'regime = CLEAR_MOVE AND contribTier = STANDARD',
      test:   r => r.regime === 'CLEAR_MOVE' && r.contribTier === 'STANDARD',
      threshold: 'N ≥ 10',
    },
    {
      rule: '+0.25u contribTier = STANDARD in NEAR_START',
      subset: 'regime = NEAR_START AND contribTier = STANDARD',
      test:   r => r.regime === 'NEAR_START' && r.contribTier === 'STANDARD',
      threshold: 'N ≥ 10',
    },
    {
      rule: '+0.25u Δcontribution sweet spot',
      subset: 'dContrib ∈ (50, 100]',
      test:   r => r.dContrib > 50 && r.dContrib <= 100,
      threshold: 'N ≥ 15 AND flat ROI ≥ +30%',
    },
    {
      rule: 'MUTE auto-suppress',
      subset: 'contribTier = MUTE',
      test:   r => r.contribTier === 'MUTE',
      threshold: 'N ≥ 10 AND flat ROI ≤ −20%',
    },
    {
      rule: 'stars ≥ 4 standalone bonus',
      subset: 'stars ≥ 4 AND not CLEAR_MOVE (to isolate star effect)',
      test:   r => r.stars >= 4 && r.regime !== 'CLEAR_MOVE',
      threshold: 'N ≥ 15 AND flat ROI ≥ +20% — if this stays weak, keep rejected',
    },
  ];
  for (const d of deferred) {
    const a = agg(all.filter(d.test));
    const row = [
      d.rule,
      `\`${d.subset}\``,
      a.n,
      a.n ? a.wr.toFixed(1) + '%' : '—',
      a.n ? (a.flatRoi >= 0 ? '+' : '') + a.flatRoi.toFixed(1) + '%' : '—',
      d.threshold,
    ];
    out.push(`| ${row.join(' | ')} |`);
  }

  // ── Stacked sizing audit ────────────────────────────────────────
  out.push(section('3. Stacked V8.3 bonus · in-sample performance by net bonus'));
  out.push('What would each tier of the stacked bonus have looked like on graded V8 picks?');
  out.push('');
  out.push(mdHeader(['Net bonus / condition', 'N', 'WR', 'flat ROI', 'wtd ROI']));
  const bonusTiers = [
    { label: '+0.75u', cond: r => r.regime === 'CLEAR_MOVE' && r.meanBase_F >= 55 },
    { label: '+0.50u (CM + mean neutral)', cond: r => r.regime === 'CLEAR_MOVE' && r.meanBase_F >= 50 && r.meanBase_F < 55 },
    { label: '+0.50u (NEAR_START + both positive)', cond: r => r.regime === 'NEAR_START' && r.meanBase_F >= 55 && r.maxRoiN_F >= 70 },
    { label: '+0.25u (CM + weak wallets)',    cond: r => r.regime === 'CLEAR_MOVE' && r.meanBase_F < 50 },
    { label: '+0.25u (NEAR_START one positive)', cond: r => r.regime === 'NEAR_START' && ((r.meanBase_F >= 55 && !(r.maxRoiN_F >= 70)) || (r.maxRoiN_F >= 70 && r.meanBase_F < 55)) },
    { label: '+0.25u (other regime + mean ≥ 55)', cond: r => (r.regime === 'SMALL_MOVE' || r.regime === 'NO_MOVE') && r.meanBase_F >= 55 },
    { label: '0u (neutral)',  cond: r => {
        const cm = r.regime === 'CLEAR_MOVE' ? 0.5 : 0;
        const qb = r.meanBase_F >= 55 ? 0.25 : r.meanBase_F < 50 ? -0.25 : 0;
        const ns = r.regime === 'NEAR_START' ? (r.maxRoiN_F >= 70 ? 0.25 : r.maxRoiN_F >= 50 ? -0.25 : 0) : 0;
        return Math.abs(cm + qb + ns) < 0.01;
    }},
    { label: '−0.25u (weak wallets, no NS)',   cond: r => r.regime !== 'NEAR_START' && r.regime !== 'CLEAR_MOVE' && r.meanBase_F < 50 },
    { label: '−0.25u (NEAR_START one negative)', cond: r => r.regime === 'NEAR_START' && ((r.meanBase_F < 50 && !(r.maxRoiN_F >= 50 && r.maxRoiN_F < 70)) || (r.maxRoiN_F >= 50 && r.maxRoiN_F < 70 && r.meanBase_F >= 50)) },
    { label: '−0.50u (worst case)',    cond: r => r.regime === 'NEAR_START' && r.meanBase_F < 50 && r.maxRoiN_F >= 50 && r.maxRoiN_F < 70 },
  ];
  for (const t of bonusTiers) {
    const a = agg(all.filter(t.cond));
    out.push(fmtRow(t.label, a));
  }

  // ── Per-regime baseline ─────────────────────────────────────────
  out.push(section('4. Regime baselines (context)'));
  out.push(mdHeader(['Regime', 'N', 'WR', 'flat ROI', 'wtd ROI']));
  for (const rg of REGIMES) {
    out.push(fmtRow(rg, agg(all.filter(r => r.regime === rg))));
  }

  out.push('');
  out.push(`---`);
  out.push(`*Auto-generated by \`scripts/signalAcrossFullSample.js\` (daily). See \`STAR_RATING_SYSTEM.md\` §V8.3 for the live sizing rules.*`);
  out.push('');

  const filepath = join(__dirname, '..', 'V8_SIGNAL_MONITOR.md');
  writeFileSync(filepath, out.join('\n'));
  console.log(`Wrote ${filepath}`);
  console.log(`Full sample: ${fmt(agg(all))}`);
  process.exit(0);
})();

function fmt(a) {
  if (!a.n) return '—';
  return `N=${a.n}  WR=${a.wr.toFixed(1)}%  flatROI=${(a.flatRoi >= 0 ? '+' : '') + a.flatRoi.toFixed(1)}%  wtdROI=${(a.wtdRoi >= 0 ? '+' : '') + a.wtdRoi.toFixed(1)}%`;
}
