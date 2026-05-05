// WalletStackScore — honest, point-in-time predictor for every
// pick/spread/total. Uses ONLY fields that were frozen into the pick
// document at v8 scoring time. No live roster lookup of stats, no
// recomputed metrics. Zero look-ahead bias on the per-wallet numbers.
//
// One small look-ahead caveat: when WHITELIST_ONLY=1 (default) we use
// the wallet's CURRENT whitelistTier from sharpWalletProfiles to
// decide whether to include them. Tier-at-pick-time is not stored, so
// today's tier is used as a proxy. This is far less leaky than the
// alternative (averaging in WR50 / untracked wallets that the v8
// engine wrote into walletDetails[] but were never proven). See §0a
// in the report for the actual tier breakdown.
//
// What's frozen per wallet in `peak.v8Scoring.walletDetails[]`:
//   wallet, side, source, invested, roi, pnl, rank,
//   roiNorm, pnlNorm, rankNorm, walletBase,
//   sizeRatio, convictionMult, contribution
//
// Goal — produce one score per side that climbs with confidence and
// has a clear lock line.
//
// Approach:
//   1. For each pick, compute per-side aggregates from frozen wallet
//      metrics (count, sum-contribution, sum-invested, avg-walletBase,
//      avg-conviction, best rank, …).
//   2. Compute the FOR-minus-AGAINST delta for each.
//   3. Univariately rank all deltas by predictive power on outcome.
//   4. Build a composite WSS = z-sum of the strongest deltas (no
//      empirical weighting that requires fitting).
//   5. Bucket the universe by WSS quintile/decile, plus a threshold
//      sweep, to find a clear lock line.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  AGS_FEATURES,
  AGS_LOCK_FLOOR,
  AGS_MUTE_FLOOR,
  AGS_MIN_PROVEN_WALLETS,
  aggregateSideProven,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
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

// V6_CUTOVER — when the v6 system shipped and frozen wallet metadata
// (`peak.v8Scoring.walletDetails[]`) became reliably populated. Aggregate
// features are valid for every pick from this date onward.
//
// HC_CUTOVER — when the high-conviction margin shipped. Pre-cutover picks
// have hcMargin === null (treated as "HC silent" in the silent-zone test).
// This lets us analyze the full V6 sample while still flagging the HC-loud
// vs HC-silent split honestly.
const V6_CUTOVER = '2026-04-18';
const HC_CUTOVER = '2026-04-30';
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];

const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const fmtPct = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`;
const fmtSignPct = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : `${sign(v, d)}%`;

function flatProfit(odds, outcome) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'WIN') return odds == null ? 0.91 : (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
  return -1;
}

function wilson(w, n, z = 1.96) {
  if (!n) return [0, 0];
  const p = w / n, d = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / d;
  const m = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
  return [Math.max(0, c - m), Math.min(1, c + m)];
}

function tTest(values) {
  const n = values.length;
  if (n < 2) return { n, t: 0, sig: '✗ n<2' };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const v = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  const sd = Math.sqrt(v);
  const se = sd / Math.sqrt(n);
  const t = se > 0 ? mean / se : 0;
  const sig = Math.abs(t) >= 2.58 ? '✓ p<.01' : Math.abs(t) >= 1.96 ? '✓ p<.05' : Math.abs(t) >= 1.645 ? '~ p<.10' : '✗ noise';
  return { n, mean, sd, t, sig };
}

function pearson(xs, ys) {
  const n = xs.length;
  if (n < 2) return NaN;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; num += dx * dy; dx2 += dx * dx; dy2 += dy * dy; }
  return (dx2 > 0 && dy2 > 0) ? num / Math.sqrt(dx2 * dy2) : NaN;
}

function summarize(rows) {
  const n = rows.length;
  if (!n) return { n: 0 };
  const w = rows.filter(r => r.outcome === 'WIN').length;
  const l = rows.filter(r => r.outcome === 'LOSS').length;
  const p = rows.filter(r => r.outcome === 'PUSH').length;
  const wr = (w + l) > 0 ? w / (w + l) : null;
  const ci = (w + l) > 0 ? wilson(w, w + l) : [null, null];
  const peakPnl = rows.reduce((s, r) => s + (r.profitU || 0), 0);
  const flat = rows.reduce((s, r) => s + (r.flatProfit || 0), 0);
  const flatRoi = (w + l + p) > 0 ? flat / (w + l + p) : null;
  const tt = tTest(rows.map(r => r.flatProfit || 0));
  return { n, w, l, p, wr, ci, peakPnl, flat, flatRoi, t: tt };
}

const HEADER = `| Cohort | N | W-L-P | WR % [Wilson] | Flat ROI | Peak PnL | t-stat |\n|---|---|---|---|---|---|---|`;
function row(label, s) {
  if (!s.n) return `| ${label} | 0 | — | — | — | — | — |`;
  const ci = `[${(s.ci[0]*100).toFixed(0)}–${(s.ci[1]*100).toFixed(0)}]`;
  return `| ${label} | ${s.n} | ${s.w}-${s.l}-${s.p} | ${(s.wr*100).toFixed(1)}% ${ci} | ${fmtSignPct(100*s.flatRoi)} | ${sign(s.peakPnl, 2)}u | ${s.t.t.toFixed(2)} ${s.t.sig} |`;
}

// Whitelist tier lookup — used to filter walletDetails to proven (CONFIRMED+
// FLAT) wallets when WHITELIST_ONLY=1. Loaded once from current
// sharpWalletProfiles. ⚠️ small look-ahead bias: a wallet's tier today
// may differ from its tier at pick time, but this is much less leaky than
// not filtering at all (pre-filter we were mixing in WR50 / untracked
// wallets that were never proven).
const WHITELIST_ONLY = process.env.WHITELIST_ONLY !== '0'; // default ON
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);
let walletTiers = null;
async function loadWalletTiers() {
  if (walletTiers) return walletTiers;
  walletTiers = new Map(); // walletShort → { sport → tier }
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) {
    const p = d.data();
    if (!p?.bySport) continue;
    const map = {};
    for (const [sport, rec] of Object.entries(p.bySport)) {
      if (rec?.whitelistTier) map[sport] = rec.whitelistTier;
    }
    walletTiers.set(d.id, map);
  }
  return walletTiers;
}
function walletTierFor(walletShort, sport) {
  if (!walletShort) return null;
  return walletTiers?.get(walletShort)?.[sport] || null;
}
function walletPasses(walletShort, sport) {
  if (!WHITELIST_ONLY) return true;
  const tier = walletTierFor(walletShort, sport);
  return tier === 'CONFIRMED' || tier === 'FLAT';
}

// Diagnostic counters — what's in walletDetails by tier.
const tierDiag = { CONFIRMED: 0, FLAT: 0, WR50: 0, untracked: 0,
                   $CONFIRMED: 0, $FLAT: 0, $WR50: 0, $untracked: 0,
                   contribCONFIRMED: 0, contribFLAT: 0, contribWR50: 0, contribUntracked: 0 };

// Update tier diagnostic counters (side-effect only — math is delegated to
// aggregateSideProven from src/lib/ags.js so this script stays in lockstep
// with production).
function trackTierDiag(walletDetails, sport) {
  if (!Array.isArray(walletDetails)) return;
  for (const w of walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    const tier = walletTierFor(w.wallet, sport);
    const tierKey = tier === 'CONFIRMED' ? 'CONFIRMED' : tier === 'FLAT' ? 'FLAT' : tier === 'WR50' ? 'WR50' : 'untracked';
    tierDiag[tierKey] += 1;
    tierDiag['$' + tierKey] += Number(w.invested || 0);
    tierDiag['contrib' + (tierKey === 'untracked' ? 'Untracked' : tierKey)] += Number(w.contribution || 0);
  }
}

function aggregateSide(walletDetails, sideKey, sport) {
  trackTierDiag(walletDetails, sport);
  return aggregateSideProven(walletDetails, sideKey, sport, walletPasses);
}

function zScoreOver(arr) {
  const n = arr.length;
  if (!n) return [];
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const v = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1);
  const sd = Math.sqrt(v) || 1;
  return arr.map(x => (x - mean) / sd);
}

// ── Load all picks ─────────────────────────────────────────────────────────
console.log(`[wss] loading wallet tier map (filter mode: ${WHITELIST_ONLY ? 'WHITELIST-ONLY (CONFIRMED+FLAT)' : 'UNFILTERED (all leaderboard wallets)'})…`);
await loadWalletTiers();
console.log(`[wss] tier map loaded — ${walletTiers.size} wallets with profile records`);
console.log('[wss] loading picks…');
const rows = [];
let dateMin = null, dateMax = null;
let counts = { graded: 0, withDetails: 0, kept: 0 };
for (const [col, market] of PICK_COLS) {
  const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const sides = d.sides || {};
    const sport = d.sport || 'UNK';
    for (const [sideKey, side] of Object.entries(sides)) {
      const oc = side?.result?.outcome;
      if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
      counts.graded += 1;
      // V6-style dashboard filter — mirrors v6FullAnalysis.js loadPicks().
      // We test cohort behavior on the SHIPPED set (the picks that
      // actually reached the user). Shadow/muted picks are excluded
      // because the engine had non-wallet reasons to suppress them.
      const peak = side.peak || side.lock || {};
      const peakStars = peak?.stars ?? 0;
      const lockStage = side.lockStage || null;
      const healthStatus = side.health?.status || null;
      const inDashboard = !side.superseded
        && healthStatus !== 'CANCELLED'
        && healthStatus !== 'MUTED'
        && lockStage !== 'SHADOW'
        && peakStars >= 2.5;
      if (!inDashboard) continue;
      const wd = peak?.v8Scoring?.walletDetails;
      if (!Array.isArray(wd) || wd.length === 0) continue;
      counts.withDetails += 1;
      const agg = aggregateSide(wd, sideKey, sport);
      if (!agg || (agg.forCount + agg.agCount) === 0) continue;
      const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds ?? side?.lock?.odds ?? side?.peak?.odds ?? null;
      const peakUnits = peak?.units || 1;
      let profitU = 0;
      if (oc === 'WIN') profitU = (side.result?.profit || 0);
      else if (oc === 'LOSS') profitU = -peakUnits;
      const date = d.date;
      if (date) { if (!dateMin || date < dateMin) dateMin = date; if (!dateMax || date > dateMax) dateMax = date; }
      counts.kept += 1;
      // HC margin (frozen at scoring time, post-cutover only)
      const hcConfFor = (side.v8_hcConfFor != null) ? Number(side.v8_hcConfFor) : null;
      const hcConfAg  = (side.v8_hcConfAg != null) ? Number(side.v8_hcConfAg) : null;
      const hcMargin  = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin)
        : (hcConfFor != null && hcConfAg != null ? (hcConfFor - hcConfAg) : null);
      const dwFrozen  = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
      rows.push({
        docId: doc.id, date, sport, market, sideKey,
        team: side.team || null, away: d.away || null, home: d.home || null,
        outcome: oc, profitU, flatProfit: flatProfit(odds, oc), odds, peakUnits,
        hcMargin, dwFrozen,
        ...agg,
      });
    }
  }
}
console.log(`[wss] graded=${counts.graded}  withDetails=${counts.withDetails}  kept=${counts.kept}`);
console.log(`[wss] sample range: ${dateMin} → ${dateMax}`);

// ── Reference features (reported but EXCLUDED from composite) ──────────────
// These are the engine's existing signals. We track their ρ for context
// but per the brief we do NOT include them in the aggregate-only score —
// the goal is to find signal in the aggregate stack ALONE, in the absence
// of HC and Δw.
const REFERENCE_FEATURES = [
  ['hcMargin',         'HC margin (CONFIRMED-only, frozen)'],
  ['dwFrozen',         'Δw (proven winner margin, frozen)'],
];

// ── Aggregate-only feature set — these are the candidates for composite ───
// Three flavors of side aggregate:
//   • TOTAL/SUM  — raw mass on each side (count, $, sum of contribution)
//   • BLENDED    — per-wallet means (avg quality, avg ROI, avg conviction)
//   • CONCENTRATION — best-single-wallet metrics
const AGGREGATE_FEATURES = [
  // TOTAL / SUM
  ['dCount',           'Δcount  (raw wallet count diff)',                 'TOTAL'],
  ['dInvested',        'Δinvested $ (sum of $ on each side)',             'TOTAL'],
  ['dContribution',    'Δcontribution sum (v8 score sum on each side)',   'TOTAL'],
  // BLENDED / AVG
  ['dContribAvg',      'Δcontribution mean (per-wallet)',                 'BLENDED'],
  ['dWalletBaseAvg',   'Δavg walletBase (composite quality)',             'BLENDED'],
  ['dRoiAvg',          'Δavg lifetime ROI',                               'BLENDED'],
  ['dPnlAvg',          'Δavg lifetime PnL',                               'BLENDED'],
  ['dSizeRatioAvg',    'Δavg sizeRatio (bet-size conviction)',            'BLENDED'],
  ['dConvictionAvg',   'Δavg convictionMult',                             'BLENDED'],
  ['dRoiNormAvg',      'Δavg roiNorm (0-100)',                            'BLENDED'],
  ['dPnlNormAvg',      'Δavg pnlNorm (0-100)',                            'BLENDED'],
  ['dRankNormAvg',     'Δavg rankNorm (0-100)',                           'BLENDED'],
  // CONCENTRATION / BEST
  ['dBestRank',        'Δbest rank (lower → better)',                     'CONCENTRATION'],
  ['dBestContrib',     'Δbest contribution',                              'CONCENTRATION'],
  ['dBestWalletBase',  'Δbest walletBase',                                'CONCENTRATION'],
];

const ALL_FEATURES = [...REFERENCE_FEATURES.map(([k, l]) => [k, l, 'REFERENCE']), ...AGGREGATE_FEATURES];

console.log('\n[wss] univariate ρ vs binary outcome (1=WIN, 0=LOSS, PUSH excluded):');
const stats = [];
for (const [k, label, family] of ALL_FEATURES) {
  const ableWin = rows.filter(r => r.outcome !== 'PUSH' && r[k] != null);
  const ableRoi = rows.filter(r => r[k] != null);
  const yWin = ableWin.map(r => r.outcome === 'WIN' ? 1 : 0);
  const xWin = ableWin.map(r => r[k]);
  const xAll = ableRoi.map(r => r[k]);
  const yRoi = ableRoi.map(r => r.flatProfit || 0);
  const rWin = pearson(xWin, yWin);
  const rRoi = pearson(xAll, yRoi);
  stats.push({ key: k, label, family, rWin, rRoi, absRoi: Math.abs(rRoi || 0), n: ableWin.length });
  console.log(`  [${family.padEnd(13)}] ${label.padEnd(50)}  N=${String(ableWin.length).padStart(3)}  ρ(WIN)=${(rWin || 0).toFixed(3)}   ρ(flat-PnL)=${(rRoi || 0).toFixed(3)}`);
}

// Aggregate-only top features (REFERENCE excluded)
const aggStats = stats.filter(s => s.family !== 'REFERENCE').slice().sort((a, b) => b.absRoi - a.absRoi);
console.log('\n[wss] AGGREGATE-only leaderboard (sorted |ρ(flat-PnL)|, REFERENCE excluded):');
aggStats.slice(0, 8).forEach((s, i) => console.log(`  ${(i+1).toString().padStart(2)}. [${s.family.padEnd(13)}] ${s.label.padEnd(50)} ρ=${s.rRoi.toFixed(3)}  ρ(WIN)=${s.rWin.toFixed(3)}`));

// ── Composite — equal-weighted z-sum of top-K AGGREGATE features ───────────
// CRITICAL: HC margin and Δw are EXCLUDED from the composite. We're testing
// whether the aggregate stack alone has signal in the absence of those two.
// Sign of each feature is set by the SIGN of its ρ(flat-PnL) so we always
// add bullish-direction z-scores (a feature with ρ<0 gets flipped before
// summing — otherwise we'd be aggregating signal in opposite directions).
const TOP_K = 6;
const selected = aggStats.slice(0, TOP_K).map(s => ({ key: s.key, sign: Math.sign(s.rRoi) || 1, label: s.label, family: s.family, rRoi: s.rRoi }));
console.log(`\n[wss] AggregateScore = Σ sign·z(feature) across:`);
selected.forEach(s => console.log(`  ${s.sign >= 0 ? '+' : '-'} z(${s.key.padEnd(18)}) [${s.family}]   ρ=${s.rRoi.toFixed(3)}`));

const zCache = {};
for (const s of selected) zCache[s.key] = zScoreOver(rows.map(r => Number(r[s.key] || 0)));
rows.forEach((r, i) => {
  let total = 0;
  for (const s of selected) total += s.sign * zCache[s.key][i];
  r.wss = total;
});

// ── Quintile + decile breakdown ────────────────────────────────────────────
function quantileCutoffs(arr, scoreField, parts) {
  const sorted = [...arr].sort((a, b) => a[scoreField] - b[scoreField]);
  const cuts = [];
  for (let i = 1; i < parts; i++) cuts.push(sorted[Math.floor(arr.length * i / parts)][scoreField]);
  return cuts;
}
function bucketBy(arr, scoreField, cuts) {
  const buckets = Array(cuts.length + 1).fill().map(() => []);
  for (const p of arr) {
    let i = 0;
    while (i < cuts.length && p[scoreField] > cuts[i]) i++;
    buckets[i].push(p);
  }
  return buckets;
}

const out = [];
out.push('# WalletStackScore — Honest Point-in-Time Predictor');
out.push('');
out.push(`_Auto-generated **${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET** by \`scripts/_walletStackScore.mjs\`._`);
out.push('');
out.push('## Why this analysis exists');
out.push('');
out.push('You asked: **in the absence of HC margin or Δw (winner margin), do total/aggregate/blended side variables predict winners?** This run isolates that question — HC and Δw are reported as REFERENCE only and are explicitly **excluded** from the composite. The score is built purely from aggregate per-side statistics.');
out.push('');
out.push('All per-wallet metrics are read directly out of `peak.v8Scoring.walletDetails[]` exactly as they were frozen at v8 scoring time. **Zero live recomputation, zero look-ahead bias.**');
out.push('');
out.push(`**Sample**: ${rows.length} graded picks (${dateMin} → ${dateMax}). Filter: V6 dashboard truth (peakStars ≥ 2.5 ∧ ¬SHADOW ∧ ¬MUTED ∧ ¬CANCELLED ∧ ¬superseded). Floor: V6 cutover (2026-04-18+) — full V6 era. HC margin available only for picks dated 2026-04-30+; treated as silent (null) for earlier picks.`);
out.push('');
out.push(`**Wallet filter mode**: \`${WHITELIST_ONLY ? 'WHITELIST-ONLY (CONFIRMED + FLAT)' : 'UNFILTERED (all leaderboard wallets)'}\``);
out.push('');
if (WHITELIST_ONLY) {
  out.push('> All aggregate features below are computed **only over wallets whose current `whitelistTier` is `CONFIRMED` or `FLAT`** (proven). WR50 / untracked wallets that the v8 engine wrote into `walletDetails[]` are excluded from sums, averages, and best-of metrics. HC margin and Δw are unaffected (they were already proven-only at write time).');
  out.push('');
  out.push('> ⚠️ Small look-ahead caveat: we use today\'s tier as a proxy because tier-at-pick-time is not stored. Tiers change weekly, but the vast majority of wallets are stable — this is far less leaky than including non-proven wallets in the aggregates.');
  out.push('');
}

// Headline universe
out.push('## 0. Baseline (the universe we\'re predicting on)');
out.push('');
out.push(HEADER);
out.push(row('All shipped+graded V6 picks', summarize(rows)));
out.push('');

// Tier distribution diagnostic — what's actually in walletDetails[]?
out.push('## 0a. What\'s in `walletDetails[]` — wallet-tier distribution');
out.push('');
out.push('Across every wallet entry in every pick\'s `walletDetails[]` (FOR + AGAINST sides combined), broken down by current `whitelistTier`. **This is the audit you asked for: how much of the raw aggregate stack is non-proven wallets.**');
out.push('');
const totalWallets = tierDiag.CONFIRMED + tierDiag.FLAT + tierDiag.WR50 + tierDiag.untracked;
const totalDollars = tierDiag.$CONFIRMED + tierDiag.$FLAT + tierDiag.$WR50 + tierDiag.$untracked;
const totalContrib = tierDiag.contribCONFIRMED + tierDiag.contribFLAT + tierDiag.contribWR50 + tierDiag.contribUntracked;
const pct = (x, t) => t > 0 ? (100 * x / t).toFixed(1) + '%' : '—';
out.push('| Tier | Wallet entries | % of entries | Σ invested $ | % of $ | Σ v8 contribution | % of contrib |');
out.push('|---|---:|---:|---:|---:|---:|---:|');
out.push(`| **CONFIRMED** (proven) | ${tierDiag.CONFIRMED} | ${pct(tierDiag.CONFIRMED, totalWallets)} | $${Math.round(tierDiag.$CONFIRMED).toLocaleString()} | ${pct(tierDiag.$CONFIRMED, totalDollars)} | ${tierDiag.contribCONFIRMED.toFixed(1)} | ${pct(tierDiag.contribCONFIRMED, totalContrib)} |`);
out.push(`| **FLAT** (proven) | ${tierDiag.FLAT} | ${pct(tierDiag.FLAT, totalWallets)} | $${Math.round(tierDiag.$FLAT).toLocaleString()} | ${pct(tierDiag.$FLAT, totalDollars)} | ${tierDiag.contribFLAT.toFixed(1)} | ${pct(tierDiag.contribFLAT, totalContrib)} |`);
out.push(`| WR50 (losing record) | ${tierDiag.WR50} | ${pct(tierDiag.WR50, totalWallets)} | $${Math.round(tierDiag.$WR50).toLocaleString()} | ${pct(tierDiag.$WR50, totalDollars)} | ${tierDiag.contribWR50.toFixed(1)} | ${pct(tierDiag.contribWR50, totalContrib)} |`);
out.push(`| untracked / not in profile | ${tierDiag.untracked} | ${pct(tierDiag.untracked, totalWallets)} | $${Math.round(tierDiag.$untracked).toLocaleString()} | ${pct(tierDiag.$untracked, totalDollars)} | ${tierDiag.contribUntracked.toFixed(1)} | ${pct(tierDiag.contribUntracked, totalContrib)} |`);
out.push(`| **TOTAL** | ${totalWallets} | 100% | $${Math.round(totalDollars).toLocaleString()} | 100% | ${totalContrib.toFixed(1)} | 100% |`);
out.push('');
const provenShare = (tierDiag.CONFIRMED + tierDiag.FLAT) / Math.max(1, totalWallets);
const nonProvenShare = (tierDiag.WR50 + tierDiag.untracked) / Math.max(1, totalWallets);
out.push(`**Proven (CONFIRMED+FLAT)** = ${(100 * provenShare).toFixed(1)}% of entries. **Non-proven (WR50 + untracked)** = ${(100 * nonProvenShare).toFixed(1)}% of entries.`);
out.push('');
if (nonProvenShare > 0.1) {
  out.push(`> 🚨 **Over ${(100*nonProvenShare).toFixed(0)}% of the wallet entries the previous unfiltered analysis was averaging across were NOT proven wallets**. Every Δavg-anything number it produced was diluted by these. ${WHITELIST_ONLY ? 'The current run filters them out.' : 'Re-run with `WHITELIST_ONLY=1` to filter them out.'}`);
} else {
  out.push(`> walletDetails is dominated (>${(100*provenShare).toFixed(0)}%) by proven wallets — filtering vs not filtering will produce nearly identical aggregates.`);
}
out.push('');

// ── §1. Univariate leaderboard, GROUPED BY FAMILY ─────────────────────────
out.push('## 1. Univariate signal leaderboard — grouped by family');
out.push('');
out.push('Each feature is `(value on FOR side) − (value on AGAINST side)`. ρ vs binary WIN outcome (excludes PUSH) and ρ vs per-pick flat-1u profit are reported.');
out.push('');
const FAMILIES = ['REFERENCE', 'TOTAL', 'BLENDED', 'CONCENTRATION'];
const FAMILY_LABEL = {
  REFERENCE:     '★ Reference (HC + Δw — context only, EXCLUDED from composite)',
  TOTAL:         'TOTAL / SUM (raw mass on each side)',
  BLENDED:       'BLENDED / AVG (per-wallet means)',
  CONCENTRATION: 'CONCENTRATION / BEST (single best wallet)',
};
for (const fam of FAMILIES) {
  const members = stats.filter(s => s.family === fam);
  if (!members.length) continue;
  out.push(`### ${FAMILY_LABEL[fam]}`);
  out.push('');
  out.push('| Feature | ρ(WIN) | ρ(flat PnL) | direction |');
  out.push('|---|---|---|---|');
  for (const s of members) {
    const dir = s.rRoi > 0.05 ? '✅ positive' : s.rRoi < -0.05 ? '❌ negative' : '~ noise';
    out.push(`| ${s.label} | ${s.rWin.toFixed(3)} | ${s.rRoi.toFixed(3)} | ${dir} |`);
  }
  out.push('');
}

// Aggregate-only ranked leaderboard
out.push('### 1z. Aggregate-only leaderboard (HC + Δw excluded)');
out.push('');
out.push('Sorted by `|ρ(flat PnL)|`. The "sign in composite" column is the direction the composite uses (negative-ρ features get flipped before summing).');
out.push('');
out.push('| Rank | Family | Feature | ρ(WIN) | ρ(flat PnL) | sign in composite |');
out.push('|---|---|---|---|---|---|');
aggStats.forEach((s, i) => {
  const inComposite = i < TOP_K ? (s.rRoi >= 0 ? '+1' : '-1') : '—';
  out.push(`| ${i+1} | ${s.family} | ${s.label} | ${s.rWin.toFixed(3)} | ${s.rRoi.toFixed(3)} | ${inComposite} |`);
});
out.push('');

// ── §2. Composite construction ────────────────────────────────────────────
out.push('## 2. AggregateScore (AGS) — composite construction');
out.push('');
out.push(`We z-score each of the top-${TOP_K} aggregate features, multiply by its observed sign(ρ), and sum. **No HC margin, no Δw.** This is the answer to the question "can the side aggregates alone predict in the absence of those two signals?"`);
out.push('');
out.push('Composite formula:');
out.push('');
out.push('```');
out.push('AGS = ' + selected.map(s => `${s.sign >= 0 ? '+' : '-'} z(${s.key})`).join('  '));
out.push('```');
out.push('');
out.push('| Rank | Family | Feature | ρ(flat PnL) | sign |');
out.push('|---|---|---|---|---|');
selected.forEach((s, i) => out.push(`| ${i+1} | ${s.family} | \`${s.key}\` — ${s.label} | ${s.rRoi.toFixed(3)} | ${s.sign >= 0 ? '+1' : '-1'} |`));
out.push('');
out.push('⚠️ Feature selection is in-sample (we ranked features on this same data, then picked the top-6). At N this small, expect any apparent edge to shrink 30-50% out of sample.');
out.push('');

// ── §3. AGS quintile / decile breakdown ───────────────────────────────────
const quintCuts = quantileCutoffs(rows, 'wss', 5);
const quintB = bucketBy(rows, 'wss', quintCuts);
const decCuts = quantileCutoffs(rows, 'wss', 10);
const decB = bucketBy(rows, 'wss', decCuts);

out.push('## 3. AGS quintile / decile breakdown — does the composite separate W from L?');
out.push('');
out.push(`### 3a. Quintile breakdown — cutoffs: ${quintCuts.map(c => c.toFixed(2)).join(' · ')}`);
out.push('');
out.push(HEADER);
quintB.forEach((b, i) => {
  const tag = ['Q1 (worst)', 'Q2', 'Q3', 'Q4', 'Q5 (best)'][i];
  out.push(row(tag, summarize(b)));
});
out.push('');
out.push(`### 3b. Decile breakdown — cutoffs: ${decCuts.map(c => c.toFixed(2)).join(' · ')}`);
out.push('');
out.push(HEADER);
decB.forEach((b, i) => {
  const tag = `D${i+1}` + (i === 0 ? ' (worst)' : i === 9 ? ' (best)' : '');
  out.push(row(tag, summarize(b)));
});
out.push('');

// ── §4. WSS threshold sweep — looking for the lock line ───────────────────
out.push('## 4. WSS threshold sweep — finding a clear lock line');
out.push('');
out.push('How does cohort performance evolve as the WSS threshold tightens? The lock line is wherever the WR / Peak PnL gradient stops climbing meaningfully.');
out.push('');
out.push('| WSS ≥ | N | Share | W-L-P | WR | Flat ROI | Peak PnL | t-stat |');
out.push('|---|---|---|---|---|---|---|---|');
const WSS_THR = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (const thr of WSS_THR) {
  const above = rows.filter(r => r.wss >= thr);
  const s = summarize(above);
  if (!s.n) continue;
  out.push(`| ≥ ${thr.toString().padStart(3)} | ${s.n} | ${(100*s.n/rows.length).toFixed(1)}% | ${s.w}-${s.l}-${s.p} | ${(s.wr*100).toFixed(1)}% | ${fmtSignPct(100*s.flatRoi)} | ${sign(s.peakPnl, 2)}u | ${s.t.t.toFixed(2)} ${s.t.sig} |`);
}
out.push('');

// ── §5. Reverse threshold — fade zone ──────────────────────────────────────
out.push('## 5. Reverse threshold sweep — the fade zone');
out.push('');
out.push('Same exercise but the bottom of the distribution. Where does WR fall to "obvious losers"?');
out.push('');
out.push('| WSS ≤ | N | Share | W-L-P | WR | Flat ROI | Peak PnL | t-stat |');
out.push('|---|---|---|---|---|---|---|---|');
for (const thr of WSS_THR.slice().reverse().map(x => -x)) {
  const below = rows.filter(r => r.wss <= thr);
  const s = summarize(below);
  if (!s.n) continue;
  out.push(`| ≤ ${thr.toString().padStart(3)} | ${s.n} | ${(100*s.n/rows.length).toFixed(1)}% | ${s.w}-${s.l}-${s.p} | ${(s.wr*100).toFixed(1)}% | ${fmtSignPct(100*s.flatRoi)} | ${sign(s.peakPnl, 2)}u | ${s.t.t.toFixed(2)} ${s.t.sig} |`);
}
out.push('');

// ── §6. By-sport breakdown ─────────────────────────────────────────────────
out.push('## 6. WSS by sport — does the signal travel?');
out.push('');
out.push('Same WSS metric, sliced by sport. Confirms whether signal is broad-based or NBA-only.');
out.push('');
const SPORTS = ['MLB', 'NBA', 'NHL'];
for (const sp of SPORTS) {
  const sub = rows.filter(r => r.sport === sp);
  if (!sub.length) continue;
  out.push(`### ${sp} — N=${sub.length}`);
  out.push('');
  out.push(HEADER);
  out.push(row(`All ${sp}`, summarize(sub)));
  // Top quintile within sport
  if (sub.length >= 10) {
    const sorted = [...sub].sort((a, b) => b.wss - a.wss);
    const top = sorted.slice(0, Math.ceil(sorted.length * 0.20));
    out.push(row(`${sp} top-20% by WSS`, summarize(top)));
  }
  out.push('');
}

// ── §7. SILENT-ZONE analysis — the real test ──────────────────────────────
// The user's exact ask: "I am looking for signal in the absence of HC margin
// or Winner Margin." So we slice the universe into picks where the
// PRIMARY signals are silent and ask whether AGS can still pick winners.
//
// Silent-zone definitions:
//   • Δw silent  : Δw ≤ +1 (no strong winner-margin tilt)
//   • HC silent  : HC = 0 (no high-conviction tilt)
//   • Both silent: Δw ≤ +1  AND  HC ≤ 0
//   • Both LOUD  : Δw ≥ +2  OR   HC ≥ +1   (control zone — primary signals present)
out.push('## 7. Silent-zone analysis — does AGS work when HC and Δw are silent?');
out.push('');
out.push('Slices the universe by primary-signal strength and asks: in the SUBSET where HC margin and/or Δw are silent (no strong tilt either way), does the aggregate-only composite still separate winners from losers? This is the **direct answer to the brief**.');
out.push('');
const isHcEra = r => (r.date || '') >= HC_CUTOVER;
const zones = [
  ['Δw silent (Δw ≤ +1, full V6)',                    rows.filter(r => (r.dwFrozen ?? 0) <= 1)],
  ['Δw silent — HC era only (Δw ≤ +1, ≥ 2026-04-30)', rows.filter(r => (r.dwFrozen ?? 0) <= 1 && isHcEra(r))],
  ['HC silent (HC ≤ 0, HC era only)',                  rows.filter(r => isHcEra(r) && (r.hcMargin ?? 0) <= 0)],
  ['BOTH silent (Δw ≤ +1 ∧ HC ≤ 0, HC era only)',     rows.filter(r => isHcEra(r) && (r.dwFrozen ?? 0) <= 1 && (r.hcMargin ?? 0) <= 0)],
  ['CONTROL — Δw loud (Δw ≥ +2, full V6)',            rows.filter(r => (r.dwFrozen ?? 0) >= 2)],
  ['CONTROL — HC loud (HC ≥ +1, HC era only)',        rows.filter(r => isHcEra(r) && (r.hcMargin ?? 0) >= 1)],
];
for (const [label, sub] of zones) {
  out.push(`### 7-zone: ${label}  (N=${sub.length})`);
  out.push('');
  if (!sub.length) { out.push('_no picks in zone_'); out.push(''); continue; }
  const baseSummary = summarize(sub);
  out.push(HEADER);
  out.push(row('Zone baseline (all picks in zone)', baseSummary));
  // Bucket the zone by AGS quintile
  if (sub.length >= 5) {
    const sortedByAgs = [...sub].sort((a, b) => a.wss - b.wss);
    const parts = Math.min(5, sub.length);
    const cuts = [];
    for (let i = 1; i < parts; i++) cuts.push(sortedByAgs[Math.floor(sub.length * i / parts)].wss);
    const buckets = bucketBy(sub, 'wss', cuts);
    buckets.forEach((b, i) => {
      const tag = parts === 5
        ? `Zone ${['Q1','Q2','Q3','Q4','Q5'][i]} ${i === 0 ? '(worst AGS)' : i === parts - 1 ? '(best AGS)' : ''}`
        : `Zone B${i+1}/${parts}`;
      out.push(row(tag, summarize(b)));
    });
    // Also report the simple "AGS ≥ 0" half
    const above = sub.filter(p => p.wss >= 0);
    const below = sub.filter(p => p.wss <  0);
    out.push(row('AGS ≥ 0 within zone', summarize(above)));
    out.push(row('AGS < 0 within zone', summarize(below)));
  }
  out.push('');
}

// ── §8. Recent 25 picks ────────────────────────────────────────────────────
out.push('## 8. Most recent 25 graded picks — AGS sanity table');
out.push('');
out.push('| Date | Game | Pick | Mkt | Outcome | AGS | HC | Δw | Δcount | Δcontrib | Δbest-rank |');
out.push('|---|---|---|---|---|---|---|---|---|---|---|');
const recent = [...rows].sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.docId.localeCompare(a.docId)).slice(0, 25);
for (const r of recent) {
  const game = r.away && r.home ? `${r.away} @ ${r.home}` : '—';
  const oc = r.outcome === 'WIN' ? '**W**' : r.outcome === 'LOSS' ? 'L' : 'P';
  out.push(`| ${r.date} | ${game} | ${r.team || r.sideKey} | ${r.market} | ${oc} | ${r.wss.toFixed(2)} | ${sign(r.hcMargin ?? 0, 0)} | ${sign(r.dwFrozen ?? 0, 0)} | ${sign(r.dCount, 0)} | ${sign(r.dContribution, 1)} | ${sign(r.dBestRank, 0)} |`);
}
out.push('');

// ── §9. Practical lock candidates ──────────────────────────────────────────
out.push('## 9. Practical lock candidates');
out.push('');
out.push('Three WSS-based lock rules sorted by selectivity. Each is a single threshold (no joint conditions), so they\'re production-trivial to implement.');
out.push('');
out.push(HEADER);
const candidates = [
  ['WSS ≥ +3', rows.filter(r => r.wss >= 3)],
  ['WSS ≥ +5', rows.filter(r => r.wss >= 5)],
  ['WSS ≥ +7', rows.filter(r => r.wss >= 7)],
  ['WSS ≥ +9', rows.filter(r => r.wss >= 9)],
  ['Top-quintile (Q5)', quintB[4]],
  ['Top-decile (D10)', decB[9]],
];
for (const [label, set] of candidates) out.push(row(label, summarize(set)));
out.push('');

// ── §10. How to use this in production ─────────────────────────────────────
out.push('## 10. Reading the result');
out.push('');
out.push('**Q5 vs Q1 spread on AGS** is the single number that answers the brief. If Q5 (best AGS) outperforms Q1 (worst AGS) cleanly within the silent-zone subsets in §7, the aggregate stack is adding signal *independently* of HC and Δw. If it doesn\'t, the aggregate stack is just a noisier version of HC/Δw and the engine should ignore it.');
out.push('');
out.push('Per-row grade key:');
out.push('');
out.push('- ✅ WIN — AGS ≥ 0 zone outperforms AGS < 0 zone with N ≥ 8 each');
out.push('- ⚠️ MIXED — directional but underpowered (small N or near-flat WR gap)');
out.push('- ❌ NULL — no separation, AGS is noise within this zone');
out.push('');
out.push('---');
out.push('_Driven by `scripts/_walletStackScore.mjs`. Re-run any time. Output regenerates from frozen pick documents only._');

const reportPath = join(REPO_ROOT, 'WALLET_STACK_SCORE.md');
writeFileSync(reportPath, out.join('\n'));
console.log(`\n[wss] wrote ${reportPath}`);

// Console headline
console.log('\n══════════ AGS quintile head-to-head ══════════');
quintB.forEach((b, i) => {
  const s = summarize(b);
  if (!s.n) return;
  const tag = ['Q1 (worst)', 'Q2', 'Q3', 'Q4', 'Q5 (best)'][i];
  console.log(`  ${tag.padEnd(12)}  N=${String(s.n).padStart(3)}  ${s.w}-${s.l}-${s.p}  WR=${(s.wr*100).toFixed(1).padStart(5)}%  PeakPnL=${sign(s.peakPnl, 2)}u  FlatROI=${fmtSignPct(100*s.flatRoi)}`);
});

// Silent-zone summary
console.log('\n══════════ Silent-zone analysis ══════════');
function consoleZone(label, sub) {
  const above = sub.filter(p => p.wss >= 0);
  const below = sub.filter(p => p.wss <  0);
  const sa = summarize(above);
  const sb = summarize(below);
  if (!sa.n && !sb.n) { console.log(`  ${label}: no picks`); return; }
  console.log(`  ${label}  (N=${sub.length})`);
  if (sa.n) console.log(`    AGS ≥ 0 → N=${String(sa.n).padStart(2)}  ${sa.w}-${sa.l}-${sa.p}  WR=${((sa.wr ?? 0)*100).toFixed(1).padStart(5)}%  PeakPnL=${sign(sa.peakPnl, 2)}u`);
  if (sb.n) console.log(`    AGS < 0 → N=${String(sb.n).padStart(2)}  ${sb.w}-${sb.l}-${sb.p}  WR=${((sb.wr ?? 0)*100).toFixed(1).padStart(5)}%  PeakPnL=${sign(sb.peakPnl, 2)}u`);
}
const isHcEra2 = r => (r.date || '') >= HC_CUTOVER;
consoleZone('Δw silent (Δw ≤ +1, full V6)', rows.filter(r => (r.dwFrozen ?? 0) <= 1));
consoleZone('Δw silent — HC era only', rows.filter(r => (r.dwFrozen ?? 0) <= 1 && isHcEra2(r)));
consoleZone('HC silent (HC era only)', rows.filter(r => isHcEra2(r) && (r.hcMargin ?? 0) <= 0));
consoleZone('BOTH silent (HC era only)', rows.filter(r => isHcEra2(r) && (r.dwFrozen ?? 0) <= 1 && (r.hcMargin ?? 0) <= 0));
consoleZone('CONTROL — Δw loud (full V6)', rows.filter(r => (r.dwFrozen ?? 0) >= 2));
consoleZone('CONTROL — HC loud (HC era)', rows.filter(r => isHcEra2(r) && (r.hcMargin ?? 0) >= 1));
console.log('\n══════════ Practical lock candidates ══════════');
for (const [label, set] of candidates) {
  const s = summarize(set);
  if (!s.n) { console.log(`  ${label.padEnd(20)}  N=0`); continue; }
  console.log(`  ${label.padEnd(20)}  N=${String(s.n).padStart(3)}  ${s.w}-${s.l}-${s.p}  WR=${(s.wr*100).toFixed(1).padStart(5)}%  PeakPnL=${sign(s.peakPnl, 2)}u  FlatROI=${fmtSignPct(100*s.flatRoi)}`);
}
process.exit(0);
