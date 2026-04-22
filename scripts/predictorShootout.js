/**
 * predictorShootout.js — head-to-head comparison of the three V8 money
 * predictors across EVERY graded V8 pick (LOCKED + SHADOW):
 *
 *   1. Wallet-Consensus Δ   (forW − agW on whitelisted profitable wallets)
 *   2. meanBase_F           (avg walletBase across for-side wallets)
 *   3. maxRoiN_F            (best roiNorm across for-side wallets)
 *
 * For each, we compute:
 *   • Overall positive-bucket vs negative-bucket WR / flat ROI
 *   • Separation by regime (CLEAR_MOVE, NEAR_START, SMALL_MOVE, NO_MOVE)
 *   • Separation by lock stage (LOCKED vs SHADOW)
 *
 * The point: decide whether Δ is THE dominant signal across every regime
 * (including SHADOW) — if yes, we open the SHADOW→LOCKED promotion path
 * to hunt for Δ ≥ +1 and Δ ≥ +2 plays universally.
 *
 * Local-only, stdout table output. No writes.
 *
 * Usage:  node scripts/predictorShootout.js
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
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);

async function loadProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const map = new Map();
  snap.forEach(d => map.set(d.id, d.data()));
  return map;
}

function isWhitelistedForSport(walletShort, sport, profiles) {
  const t = profiles.get(walletShort)?.bySport?.[sport]?.whitelistTier;
  return t === 'CONFIRMED' || t === 'FLAT';
}

async function load(profiles) {
  const rows = [];
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        if (side.superseded) continue;
        const stage = side.lockStage;
        if (stage && stage !== 'LOCKED' && stage !== 'SHADOW') continue;
        const peak = side.peak || side.lock;
        if (!peak) continue;
        const outcome = side.result?.outcome;
        if (outcome !== 'WIN' && outcome !== 'LOSS') continue;
        const won = outcome === 'WIN' ? 1 : 0;

        const v8 = peak.v8Scoring || {};
        const wd = v8.walletDetails || [];
        if (!wd.length) continue;
        const consensusSide = v8.consensusSide || sideKey;
        const forW = wd.filter(w => w.side === consensusSide);
        const agW = wd.filter(w => w.side && w.side !== consensusSide);

        const meanBase_F = forW.length ? forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length : 0;
        const maxRoiN_F = forW.reduce((m, w) => Math.max(m, w.roiNorm ?? 0), 0);

        const forWhite = forW.filter(w => isWhitelistedForSport(w.wallet, sport, profiles)).length;
        const agWhite = agW.filter(w => isWhitelistedForSport(w.wallet, sport, profiles)).length;
        const delta = forWhite - agWhite;

        rows.push({
          date: d.date, sport, market: mkt, sideKey, stage,
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          stars: peak.stars ?? 0,
          odds: peak.odds ?? 0,
          won,
          flat: flatProfit(peak.odds ?? 0, won === 1),
          meanBase_F,
          maxRoiN_F,
          forWhite, agWhite, delta,
        });
      }
    }
  }
  return rows;
}

function agg(rows) {
  if (!rows.length) return { n: 0, wr: 0, flatRoi: 0, flatPnL: 0 };
  const n = rows.length;
  const wins = rows.filter(r => r.won === 1).length;
  const wr = (wins / n) * 100;
  const flatPnL = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flatPnL / n) * 100;
  return { n, wr, flatRoi, flatPnL };
}

const pad = (s, w, align = 'l') => {
  const str = String(s);
  if (str.length >= w) return str.slice(0, w);
  return align === 'r' ? str.padStart(w) : str.padEnd(w);
};
const sign = (v, digits = 1) => (v >= 0 ? '+' : '') + v.toFixed(digits);

function fmtRow(label, a) {
  if (!a.n) return `${pad(label, 32)} | ${pad('—', 4, 'r')} | ${pad('—', 6, 'r')} | ${pad('—', 8, 'r')} | ${pad('—', 9, 'r')}`;
  return [
    pad(label, 32),
    pad(a.n, 4, 'r'),
    pad(a.wr.toFixed(1) + '%', 6, 'r'),
    pad(sign(a.flatRoi) + '%', 8, 'r'),
    pad(sign(a.flatPnL, 2) + 'u', 9, 'r'),
  ].join(' | ');
}

function head() {
  return [
    pad('Subset', 32),
    pad('N', 4, 'r'),
    pad('WR', 6, 'r'),
    pad('FlatROI', 8, 'r'),
    pad('FlatPnL', 9, 'r'),
  ].join(' | ');
}

function bar() { return '-'.repeat(76); }

function predictorBlock(title, all, posFn, negFn, posLabel, negLabel) {
  console.log(`\n### ${title}`);
  console.log(head()); console.log(bar());
  console.log(fmtRow(posLabel, agg(all.filter(posFn))));
  console.log(fmtRow(negLabel, agg(all.filter(negFn))));

  console.log(`\n  by regime:`);
  console.log(head()); console.log(bar());
  for (const reg of ['CLEAR_MOVE', 'NEAR_START', 'SMALL_MOVE', 'NO_MOVE']) {
    const sub = all.filter(r => r.regime === reg);
    const pos = sub.filter(posFn);
    const neg = sub.filter(negFn);
    console.log(fmtRow(`${reg} ${posLabel}`, agg(pos)));
    console.log(fmtRow(`${reg} ${negLabel}`, agg(neg)));
  }

  console.log(`\n  by stage:`);
  console.log(head()); console.log(bar());
  for (const stg of ['LOCKED', 'SHADOW']) {
    const sub = all.filter(r => r.stage === stg);
    console.log(fmtRow(`${stg} ${posLabel}`, agg(sub.filter(posFn))));
    console.log(fmtRow(`${stg} ${negLabel}`, agg(sub.filter(negFn))));
  }
}

(async () => {
  const profiles = await loadProfiles();
  const rows = await load(profiles);

  console.log(`\n=== V8 Predictor Shoot-Out ===`);
  console.log(`Since: ${V8_CUTOVER}   Profiles loaded: ${profiles.size}`);
  console.log(`Graded picks w/ walletDetails (LOCKED + SHADOW): ${rows.length}`);
  const baseline = agg(rows);
  console.log(`Baseline: N=${baseline.n}  WR=${baseline.wr.toFixed(1)}%  FlatROI=${sign(baseline.flatRoi)}%  FlatPnL=${sign(baseline.flatPnL, 2)}u`);

  // ── Δ wallet margin ─────────────────────────────────────────────
  predictorBlock(
    '1. Wallet-Consensus Δ = forW − agW (whitelisted, per-sport)',
    rows,
    r => r.delta >= 2,
    r => r.delta <= 0,
    'Δ ≥ +2',
    'Δ ≤ 0',
  );

  // Fine-grained Δ ladder (the user cares about +1 vs +2)
  console.log(`\n### 1b. Full Δ ladder (regime-agnostic)`);
  console.log(head()); console.log(bar());
  const deltaBuckets = [
    ['Δ ≤ -2', r => r.delta <= -2],
    ['Δ = -1', r => r.delta === -1],
    ['Δ =  0', r => r.delta === 0],
    ['Δ = +1', r => r.delta === 1],
    ['Δ ≥ +2', r => r.delta >= 2],
  ];
  for (const [lbl, fn] of deltaBuckets) console.log(fmtRow(lbl, agg(rows.filter(fn))));

  // Same ladder, SHADOW only — the question the user posed
  console.log(`\n### 1c. Full Δ ladder — SHADOW picks only`);
  console.log(head()); console.log(bar());
  const shadow = rows.filter(r => r.stage === 'SHADOW');
  for (const [lbl, fn] of deltaBuckets) console.log(fmtRow(lbl, agg(shadow.filter(fn))));

  console.log(`\n### 1d. Full Δ ladder — LOCKED picks only`);
  console.log(head()); console.log(bar());
  const locked = rows.filter(r => r.stage === 'LOCKED');
  for (const [lbl, fn] of deltaBuckets) console.log(fmtRow(lbl, agg(locked.filter(fn))));

  // ── meanBase_F ──────────────────────────────────────────────────
  predictorBlock(
    '2. meanBase_F (avg walletBase across for-side wallets) — live V8.3 ±0.25u lever',
    rows,
    r => r.meanBase_F >= 55,
    r => r.meanBase_F < 50,
    'fmean ≥ 55',
    'fmean < 50',
  );

  // ── maxRoiN_F ───────────────────────────────────────────────────
  predictorBlock(
    '3. maxRoiN_F (best roiNorm across for-side wallets) — live V8.3 NEAR_START lever',
    rows,
    r => r.maxRoiN_F >= 70,
    r => r.maxRoiN_F < 50,
    'fROI ≥ 70',
    'fROI < 50',
  );

  // ── Head-to-head separation summary ─────────────────────────────
  console.log(`\n\n=== Head-to-Head Separation Summary ===`);
  console.log(`Each "Spread" column = positive-bucket flat ROI − negative-bucket flat ROI.`);
  console.log(`Positive spread = predictor meaningfully separates winners from losers.`);
  console.log();
  console.log([pad('Predictor', 32), pad('Pos N', 6, 'r'), pad('Pos ROI', 9, 'r'), pad('Neg N', 6, 'r'), pad('Neg ROI', 9, 'r'), pad('Spread', 9, 'r')].join(' | '));
  console.log(bar());
  const comparisons = [
    { name: 'Δ ≥ +2 vs Δ ≤ 0', pos: rows.filter(r => r.delta >= 2), neg: rows.filter(r => r.delta <= 0) },
    { name: 'Δ ≥ +1 vs Δ ≤ 0', pos: rows.filter(r => r.delta >= 1), neg: rows.filter(r => r.delta <= 0) },
    { name: 'fmean ≥ 55 vs < 50', pos: rows.filter(r => r.meanBase_F >= 55), neg: rows.filter(r => r.meanBase_F < 50) },
    { name: 'fROI ≥ 70 vs < 50', pos: rows.filter(r => r.maxRoiN_F >= 70), neg: rows.filter(r => r.maxRoiN_F < 50) },
  ];
  for (const c of comparisons) {
    const p = agg(c.pos), n = agg(c.neg);
    const spread = (p.n && n.n) ? p.flatRoi - n.flatRoi : null;
    console.log([
      pad(c.name, 32),
      pad(p.n, 6, 'r'),
      pad(p.n ? sign(p.flatRoi) + '%' : '—', 9, 'r'),
      pad(n.n, 6, 'r'),
      pad(n.n ? sign(n.flatRoi) + '%' : '—', 9, 'r'),
      pad(spread == null ? '—' : sign(spread) + '%', 9, 'r'),
    ].join(' | '));
  }

  // By-regime spread for each predictor — is Δ universal or regime-specific?
  console.log(`\n\n=== Per-Regime Separation (positive flat ROI − negative flat ROI) ===`);
  console.log(`Answers: "does Δ still separate winners from losers OUTSIDE CLEAR_MOVE?"`);
  console.log();
  console.log([pad('Regime', 14), pad('Δ spread', 12, 'r'), pad('fmean spread', 15, 'r'), pad('fROI spread', 13, 'r'), pad('N (regime)', 10, 'r')].join(' | '));
  console.log(bar());
  for (const reg of ['CLEAR_MOVE', 'NEAR_START', 'SMALL_MOVE', 'NO_MOVE']) {
    const sub = rows.filter(r => r.regime === reg);
    if (!sub.length) continue;
    const dp = agg(sub.filter(r => r.delta >= 2));
    const dn = agg(sub.filter(r => r.delta <= 0));
    const fp = agg(sub.filter(r => r.meanBase_F >= 55));
    const fn = agg(sub.filter(r => r.meanBase_F < 50));
    const rp = agg(sub.filter(r => r.maxRoiN_F >= 70));
    const rn = agg(sub.filter(r => r.maxRoiN_F < 50));
    const fmt = (a, b) => (a.n && b.n) ? sign(a.flatRoi - b.flatRoi) + '%' : '—';
    console.log([
      pad(reg, 14),
      pad(fmt(dp, dn) + ` (${dp.n}v${dn.n})`, 12, 'r'),
      pad(fmt(fp, fn) + ` (${fp.n}v${fn.n})`, 15, 'r'),
      pad(fmt(rp, rn) + ` (${rp.n}v${rn.n})`, 13, 'r'),
      pad(sub.length, 10, 'r'),
    ].join(' | '));
  }

  // Stage check — does Δ work on SHADOW too?
  console.log(`\n\n=== Stage Check — does each predictor hold up in SHADOW? ===`);
  console.log();
  console.log([pad('Stage', 10), pad('N', 4, 'r'), pad('Baseline ROI', 14, 'r'), pad('Δ≥+2 N/ROI', 14, 'r'), pad('Δ≥+1 N/ROI', 14, 'r'), pad('fmean≥55 N/ROI', 17, 'r'), pad('fROI≥70 N/ROI', 16, 'r')].join(' | '));
  console.log(bar());
  for (const stg of ['LOCKED', 'SHADOW']) {
    const sub = rows.filter(r => r.stage === stg);
    if (!sub.length) continue;
    const base = agg(sub);
    const d2 = agg(sub.filter(r => r.delta >= 2));
    const d1 = agg(sub.filter(r => r.delta >= 1));
    const fm = agg(sub.filter(r => r.meanBase_F >= 55));
    const fr = agg(sub.filter(r => r.maxRoiN_F >= 70));
    const cell = (a) => a.n ? `${a.n}/${sign(a.flatRoi)}%` : '—';
    console.log([
      pad(stg, 10),
      pad(base.n, 4, 'r'),
      pad(sign(base.flatRoi) + '%', 14, 'r'),
      pad(cell(d2), 14, 'r'),
      pad(cell(d1), 14, 'r'),
      pad(cell(fm), 17, 'r'),
      pad(cell(fr), 16, 'r'),
    ].join(' | '));
  }

  console.log();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
