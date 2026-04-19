/**
 * Sharp Flow — V8 Diagnostic Performance Report
 *
 * Wallet-contribution star-rating system diagnostic.
 * Tracks V8 core variables (WalletBase, ConvictionMultiplier, NetEdge,
 * TopShare, ConcPenalty, WalletPlayScore) alongside star calibration,
 * regime gating, sizing, and drift.
 *
 * Report structure:
 *   0. Executive Summary + Header
 *   1. Intervention Triggers
 *   2. Performance Windows
 *   3. Star Calibration (+ pairwise + Spearman)
 *   4. V8 Core Variable Audit
 *   5. Variable Buckets (WalletBase, Conviction, NetEdge, TopShare)
 *   6. Consensus vs Conflict
 *   7. Regime and Gate Audit
 *   8. Sizing Audit
 *   9. Calibration Against Market Baseline
 *  10. Drift Monitoring
 *  11. Failure Diagnostics
 *  12. Action Board (template)
 *  13. Keep / Tune / Cut Rules (template)
 *  14. Required Weekly Questions (template)
 *  15. Minimal Dashboard KPIs
 *
 * Usage: node scripts/dailyV8Report.js
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
const db = initFirebase();

const V8_LIVE_DATE = '2026-04-18';

// ── Helpers ──────────────────────────────────────────────────────────────────

const etToday = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
};

const etNDaysAgo = (n) => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
};

function americanToImplied(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function oddsBand(odds) {
  if (odds == null) return 'COIN_FLIP';
  const p = americanToImplied(odds);
  if (p == null) return 'COIN_FLIP';
  if (p >= 0.70) return 'HEAVY_FAV';
  if (p >= 0.55) return 'SLIGHT_FAV';
  if (p >= 0.45) return 'COIN_FLIP';
  if (p >= 0.35) return 'SLIGHT_DOG';
  return 'LONG_DOG';
}

function unitTierLabel(u) {
  if (u >= 2.5) return 'MAX';
  if (u >= 1.5) return 'STRONG';
  return 'STANDARD';
}

function pct(n, d) { return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—'; }
function avg(arr) { return arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function fmt(n) { return n != null ? (typeof n === 'number' ? n.toFixed(2) : String(n)) : '—'; }
function std(arr) {
  if (arr.length < 2) return 0;
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1));
}

function spearman(x, y) {
  if (x.length !== y.length || x.length < 3) return null;
  const n = x.length;
  const rank = (arr) => {
    const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const ranks = new Array(n);
    for (let i = 0; i < n; i++) ranks[sorted[i].i] = i + 1;
    return ranks;
  };
  const rx = rank(x), ry = rank(y);
  const d2 = rx.reduce((s, r, i) => s + (r - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}

function mono(arr) {
  let s = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[i - 1]) s++;
    else if (arr[i] < arr[i - 1]) s--;
  }
  return s;
}

// ── Data Export ──────────────────────────────────────────────────────────────

async function exportPicks() {
  const rows = [];
  for (const [colName, mktType] of [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']]) {
    const snap = await db.collection(colName).get();
    snap.forEach(d => {
      const data = d.data();
      if (!data.sides) return;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        if (sd.superseded) continue;
        if (sd.lockStage === 'SHADOW') continue;
        const res = sd.result || data.result;
        if (!res?.outcome || res.outcome === 'PUSH') continue;

        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const won = res.outcome === 'WIN' ? 1 : 0;
        const profit = res.profit || 0;

        const lockOdds = lk?.odds || 0;
        const peakOdds = pk?.odds || lockOdds;
        const lockPinn = lk?.pinnacleOdds || 0;
        const lockProb = americanToImplied(lockOdds);
        const lockPinnProb = americanToImplied(lockPinn);

        const closingOdds = sd.closingOdds || null;
        const closingProb = closingOdds ? americanToImplied(closingOdds) : null;
        const clv = (lockPinnProb && closingProb) ? closingProb - lockPinnProb : null;

        const lockStars = lk?.stars || pk?.stars || 0;
        const peakStars = pk?.stars || lockStars;
        const lockUnits = lk?.units || pk?.units || 0;
        const peakUnits = pk?.units || lockUnits;
        const starDelta = peakStars - lockStars;
        const unitDelta = peakUnits - lockUnits;

        const lockSC = lk?.sharpCount || 0;
        const lockInvested = lk?.totalInvested || 0;
        const lockEvEdge = lk?.evEdge || 0;
        const lockMoneyPct = lk?.consensusStrength?.moneyPct ?? null;
        const lockWalletPct = lk?.consensusStrength?.walletPct ?? null;

        const regime = pk?.regime || lk?.regime || 'NO_MOVE';
        const lockStage = sd.lockStage || (regime === 'CLEAR_MOVE' || regime === 'NEAR_START' ? 'LOCKED' : 'SHADOW');
        const promotedAt = sd.promotedAt || null;
        const promotedRegime = sd.promotedRegime || null;

        const ob = oddsBand(lockOdds);
        const health = sd.health || null;
        const healthStatus = health?.status || 'ACTIVE';
        const healthReasons = health?.reasons || [];

        const flatWinAmt = won ? (lockOdds < 0 ? 100 / Math.abs(lockOdds) : lockOdds / 100) : -1;

        // V8 scoring variables (from lock and peak snapshots)
        const lockV8 = lk?.v8Scoring || {};
        const peakV8 = pk?.v8Scoring || lockV8;
        const v8 = peakV8;

        const walletPlayScore = v8.walletPlayScore ?? null;
        const forSide = v8.forSide ?? null;
        const againstSide = v8.againstSide ?? null;
        const netEdge = v8.netEdge ?? null;
        const breadthBonus = v8.breadthBonus ?? null;
        const topShare = v8.topShare ?? null;
        const concPenalty = v8.concPenalty ?? null;
        const walletCountFor = v8.walletCountFor ?? null;
        const walletCountAgainst = v8.walletCountAgainst ?? 0;
        const walletDetails = v8.walletDetails || [];

        // Aggregate wallet-level V8 variables
        const forWallets = walletDetails.filter(w => w.side === sideKey || w.side === 'away' || w.side === 'home');
        const allWallets = walletDetails;
        const avgWalletBase = allWallets.length > 0 ? avg(allWallets.map(w => w.walletBase ?? 0)) : null;
        const avgConvictionMult = allWallets.length > 0 ? avg(allWallets.map(w => w.convictionMult ?? 1)) : null;
        const avgSizeRatio = allWallets.length > 0 ? avg(allWallets.map(w => w.sizeRatio ?? 1)) : null;
        const avgRoiNorm = allWallets.length > 0 ? avg(allWallets.map(w => w.roiNorm ?? 0)) : null;
        const avgRankNorm = allWallets.filter(w => w.rankNorm != null).length > 0
          ? avg(allWallets.filter(w => w.rankNorm != null).map(w => w.rankNorm)) : null;
        const avgPnlNorm = allWallets.length > 0 ? avg(allWallets.map(w => w.pnlNorm ?? 0)) : null;
        const avgContribution = allWallets.length > 0 ? avg(allWallets.map(w => w.contribution ?? 0)) : null;
        const singleWallet = (walletCountFor ?? 0) <= 1 ? 1 : 0;

        rows.push({
          date: data.date, sport: data.sport || 'NHL', marketType: mktType,
          won, profit, lockOdds, peakOdds, ob, flatWinAmt,
          lockStars, peakStars, starDelta,
          lockUnits, peakUnits, unitDelta, unitTier: unitTierLabel(peakUnits),
          lockSC, lockInvested, lockEvEdge,
          lockMoneyPct, lockWalletPct,
          regime, lockStage, promotedAt, promotedRegime,
          clv, closingProb, lockPinnProb, lockProb,
          healthStatus, healthReasons,
          // V8 core variables
          walletPlayScore, forSide, againstSide, netEdge,
          breadthBonus, topShare, concPenalty,
          walletCountFor, walletCountAgainst,
          avgWalletBase, avgConvictionMult, avgSizeRatio,
          avgRoiNorm, avgRankNorm, avgPnlNorm, avgContribution,
          singleWallet,
        });
      }
    });
  }
  return rows;
}

async function exportAllSides() {
  const rows = [];
  for (const [colName, mktType] of [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']]) {
    const snap = await db.collection(colName).get();
    snap.forEach(d => {
      const data = d.data();
      if (!data.sides) return;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const regime = pk?.regime || lk?.regime || null;
        rows.push({
          date: data.date, sport: data.sport || 'NHL', marketType: mktType,
          lockStage: sd.lockStage || null,
          superseded: !!sd.superseded,
          regime,
          promotedAt: sd.promotedAt || null,
          promotedRegime: sd.promotedRegime || null,
          status: sd.status || data.status,
          outcome: sd.result?.outcome || null,
          stars: pk?.stars || lk?.stars || 0,
          units: pk?.units || lk?.units || 0,
          healthStatus: sd.health?.status || 'ACTIVE',
        });
      }
    });
  }
  return rows;
}

// ── Window Filtering ─────────────────────────────────────────────────────────

function windowFilter(rows, label) {
  const today = etToday();
  if (label === '1-Day') return rows.filter(r => r.date === today);
  if (label === 'Yesterday') return rows.filter(r => r.date === etNDaysAgo(1));
  if (label === '3-Day') return rows.filter(r => r.date >= etNDaysAgo(3));
  if (label === '7-Day') return rows.filter(r => r.date >= etNDaysAgo(7));
  if (label === '14-Day') return rows.filter(r => r.date >= etNDaysAgo(14));
  if (label === '30-Day') return rows.filter(r => r.date >= etNDaysAgo(30));
  if (label === 'V8 Era') return rows.filter(r => r.date >= V8_LIVE_DATE);
  return rows;
}

const PERF_WINDOWS = ['1-Day', '3-Day', '7-Day', '14-Day', '30-Day', 'V8 Era', 'All Time'];

// ── Aggregation ──────────────────────────────────────────────────────────────

function agg(rows) {
  if (rows.length === 0) return { n: 0, wr: '—', flatROI: '—', modelROI: '—', avgCLV: '—', avgStars: '—', avgUnits: '—', flatPL: '0.00', modelPL: '0.00', avgEV: '—' };
  const n = rows.length;
  const wins = rows.filter(r => r.won).length;
  const flatPL = rows.reduce((s, r) => s + r.flatWinAmt, 0);
  const modelPL = rows.reduce((s, r) => s + r.profit, 0);
  const totalUnitsRisked = rows.reduce((s, r) => s + r.peakUnits, 0);
  const clvRows = rows.filter(r => r.clv != null);
  const avgCLV = clvRows.length > 0 ? avg(clvRows.map(r => r.clv)) : null;
  const evRows = rows.filter(r => r.lockEvEdge != null && r.lockEvEdge !== 0);
  const avgEV = evRows.length > 0 ? avg(evRows.map(r => r.lockEvEdge)) : null;

  return {
    n, wins,
    wr: pct(wins, n),
    flatROI: (flatPL / n * 100).toFixed(1) + '%',
    flatPL: flatPL.toFixed(2),
    modelROI: totalUnitsRisked > 0 ? (modelPL / totalUnitsRisked * 100).toFixed(1) + '%' : '—',
    modelPL: modelPL.toFixed(2),
    sizingEdge: (modelPL - flatPL).toFixed(2),
    avgCLV: avgCLV != null ? (avgCLV * 100).toFixed(2) + '%' : '—',
    avgEV: avgEV != null ? avgEV.toFixed(2) + '%' : '—',
    avgStars: avg(rows.map(r => r.peakStars)).toFixed(1),
    avgUnits: avg(rows.map(r => r.peakUnits)).toFixed(2),
    avgOdds: avg(rows.map(r => r.lockOdds)).toFixed(0),
  };
}

function starBuckets(rows) {
  const buckets = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1];
  return buckets.map(s => {
    const sub = rows.filter(r => r.peakStars === s);
    return { stars: s, ...agg(sub) };
  }).filter(b => b.n > 0);
}

function bucketByRange(rows, key, ranges) {
  return ranges.map(({ label, lo, hi }) => {
    const sub = rows.filter(r => {
      const v = r[key];
      return v != null && isFinite(v) && v >= lo && (hi === Infinity ? true : v < hi);
    });
    if (sub.length === 0) return null;
    return { label, ...agg(sub) };
  }).filter(Boolean);
}

function percentileBuckets(rows, key, labels) {
  const valid = rows.filter(r => r[key] != null && isFinite(r[key]));
  if (valid.length < 10) return [];
  const sorted = [...valid].sort((a, b) => a[key] - b[key]);
  const n = sorted.length;
  const cuts = labels.map((lbl, i) => {
    const lo = Math.floor(i * n / labels.length);
    const hi = Math.floor((i + 1) * n / labels.length);
    const slice = sorted.slice(lo, hi);
    return { label: lbl, range: `${slice[0]?.[key]?.toFixed(2)}–${slice[slice.length - 1]?.[key]?.toFixed(2)}`, ...agg(slice) };
  });
  return cuts;
}

// ── Table Rendering ──────────────────────────────────────────────────────────

function mdTable(headers, rowsData) {
  if (rowsData.length === 0) return '_No data_';
  const lines = [];
  lines.push('| ' + headers.join(' | ') + ' |');
  lines.push('|' + headers.map(() => '---').join('|') + '|');
  for (const row of rowsData) {
    lines.push('| ' + row.join(' | ') + ' |');
  }
  return lines.join('\n');
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT SECTIONS
// ══════════════════════════════════════════════════════════════════════════════

// ── Executive Summary Header ─────────────────────────────────────────────────

function secHeader(rows) {
  const today = etToday();
  const v8Rows = windowFilter(rows, 'V8 Era');
  const d7 = windowFilter(rows, '7-Day');

  const bk = starBuckets(v8Rows);
  const wrs = bk.map(b => ({ s: b.stars, wr: parseFloat(b.wr) || 0, roi: parseFloat(b.flatROI) || 0 }));
  let rankHealth = 'HEALTHY';
  for (let i = 0; i < wrs.length - 1; i++) {
    if (wrs[i + 1].wr > wrs[i].wr + 5) { rankHealth = 'DEGRADED'; break; }
  }
  if (bk.length >= 3) {
    const rho = spearman(bk.map(b => b.stars), bk.map(b => parseFloat(b.flatROI) || 0));
    if (rho != null && rho <= 0) rankHealth = 'BROKEN';
  }

  const flatPL = v8Rows.reduce((s, r) => s + r.flatWinAmt, 0);
  const modelPL = v8Rows.reduce((s, r) => s + r.profit, 0);
  const sizingHealth = modelPL >= flatPL ? 'HEALTHY' : (modelPL > flatPL - 3 ? 'MARGINAL' : 'DEGRADED');

  const noMove = v8Rows.filter(r => r.regime === 'NO_MOVE');
  const envHealth = noMove.length / Math.max(1, v8Rows.length) > 0.6 ? 'WARNING' : 'HEALTHY';

  const overallVerdict = rankHealth === 'BROKEN' || sizingHealth === 'DEGRADED'
    ? 'NEEDS ATTENTION'
    : rankHealth === 'DEGRADED' || sizingHealth === 'MARGINAL' || envHealth === 'WARNING'
      ? 'MONITORING'
      : 'OPERATING NORMALLY';

  const a = agg(v8Rows);
  const primary = v8Rows.length < 10
    ? 'Sample size too small for reliable conclusions — monitor star monotonicity as data accumulates.'
    : rankHealth !== 'HEALTHY'
      ? 'Star calibration is not monotonic — higher stars must beat lower stars before tuning anything else.'
      : sizingHealth !== 'HEALTHY'
        ? 'Sizing is amplifying losses — consider flattening unit assignments until ranking layer stabilizes.'
        : 'System operating within parameters — continue monitoring.';

  const out = [
    `# Sharp Flow — V8 Diagnostic Report`,
    `**Generated**: ${today} ET`,
    `**Completed Picks**: ${rows.length} | **V8 Era Picks**: ${v8Rows.length} | **V8 Since**: ${V8_LIVE_DATE}`,
    `**Universe**: All locked picks across ML, Spread, Total markets\n`,
    `## Executive Summary\n`,
    `- **Overall**: ${overallVerdict}`,
    `- **Ranking health**: ${rankHealth}`,
    `- **Sizing health**: ${sizingHealth}`,
    `- **Environment health**: ${envHealth}`,
    `- **Most important takeaway**: ${primary}`,
  ];
  return out.join('\n');
}

// ── 1. Intervention Triggers ─────────────────────────────────────────────────

function sec1_triggers(rows) {
  const out = ['\n---\n\n## 1. Intervention Triggers\n'];
  const triggers = [];
  const d7 = windowFilter(rows, '7-Day');
  const v8 = windowFilter(rows, 'V8 Era');
  const target = v8.length >= 10 ? v8 : d7;

  if (target.length >= 10) {
    // Star inversion
    const bk = starBuckets(target);
    for (let i = 0; i < bk.length - 1; i++) {
      const hi = bk[i], lo = bk[i + 1];
      if (hi.n >= 3 && lo.n >= 3) {
        const hiWR = parseFloat(hi.wr), loWR = parseFloat(lo.wr);
        if (loWR > hiWR + 5) {
          triggers.push({ key: 'Star inversion', detail: `${lo.stars}★ WR (${lo.wr}) beats ${hi.stars}★ (${hi.wr})` });
        }
      }
    }

    // Model P/L vs flat P/L
    const flatPL = target.reduce((s, r) => s + r.flatWinAmt, 0);
    const modelPL = target.reduce((s, r) => s + r.profit, 0);
    if (modelPL < flatPL - 2) {
      triggers.push({ key: 'Model P/L vs flat P/L', detail: `Model trails flat by ${(flatPL - modelPL).toFixed(1)}u — sizing amplifying losses` });
    }

    // Single-wallet dependency rate
    const sw = target.filter(r => r.singleWallet === 1);
    const swRate = sw.length / target.length;
    if (swRate > 0.30) {
      const swA = agg(sw);
      triggers.push({ key: 'Single-wallet dependency', detail: `${(swRate * 100).toFixed(0)}% of picks are single-wallet (WR: ${swA.wr}, ROI: ${swA.flatROI})` });
    }

    // Gate leakage — NO_MOVE overexposure
    const noMove = target.filter(r => r.regime === 'NO_MOVE');
    if (noMove.length / target.length > 0.40) {
      const a = agg(noMove);
      triggers.push({ key: 'Gate leakage', detail: `${pct(noMove.length, target.length)} of picks are NO_MOVE (WR: ${a.wr}, ROI: ${a.flatROI})` });
    }

    // Drift — check WalletPlayScore
    if (target.length >= 15) {
      const half = Math.floor(target.length / 2);
      const sorted = [...target].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      const firstHalf = sorted.slice(0, half).filter(r => r.walletPlayScore != null).map(r => r.walletPlayScore);
      const secondHalf = sorted.slice(half).filter(r => r.walletPlayScore != null).map(r => r.walletPlayScore);
      if (firstHalf.length >= 5 && secondHalf.length >= 5) {
        const d = Math.abs(avg(firstHalf) - avg(secondHalf));
        const s = std([...firstHalf, ...secondHalf]);
        if (s > 0 && d / s > 1.5) {
          triggers.push({ key: 'Drift alert', detail: `WalletPlayScore shifted ${(d / s).toFixed(1)}σ between first and second half of window` });
        }
      }
    }
  }

  if (triggers.length === 0) {
    out.push('**No intervention triggers fired.** System operating within parameters.\n');
  } else {
    out.push(mdTable(
      ['Trigger', 'Status', 'Detail'],
      triggers.map(t => [t.key, '⚠️', t.detail])
    ));
  }
  return out.join('\n');
}

// ── 2. Performance Windows ───────────────────────────────────────────────────

function sec2_perfWindows(rows) {
  const out = ['\n---\n\n## 2. Performance Windows\n'];
  out.push('Track V8 on multiple windows so you do not get fooled by one hot or cold streak.\n');

  const headers = ['Window', 'Picks', 'WR', 'Flat P/L', 'Flat ROI', 'Model P/L', 'Model ROI', 'Avg CLV', 'Avg EV', 'Notes'];
  const data = PERF_WINDOWS.map(w => {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) return null;
    const a = agg(sub);
    const wr = parseFloat(a.wr) || 0;
    let note = '';
    if (sub.length < 10) note = 'Small sample';
    else if (wr >= 55) note = 'Strong';
    else if (wr < 45) note = 'Cold streak';
    return [w, a.n, a.wr, a.flatPL + 'u', a.flatROI, a.modelPL + 'u', a.modelROI, a.avgCLV, a.avgEV, note];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  return out.join('\n');
}

// ── 3. Star Calibration ─────────────────────────────────────────────────────

function sec3_starCalibration(rows) {
  const out = ['\n---\n\n## 3. Star Calibration\n'];
  out.push('V8 is working only if higher stars beat lower stars.\n');

  for (const era of ['V8 Era', 'All Time']) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`### ${era} (n=${sub.length})\n`);

    const bk = starBuckets(sub);
    if (bk.length < 2) continue;

    const headers = ['Stars', 'N', 'Avg Implied%', 'Expected WR', 'Actual WR', 'WR Delta', 'Flat ROI', 'Model ROI', 'Avg Units', 'Avg CLV', 'Verdict'];
    const data = bk.map(b => {
      const bucket = sub.filter(r => r.peakStars === b.stars);
      const avgImpl = avg(bucket.filter(r => r.lockProb != null).map(r => r.lockProb));
      const actualWR = bucket.filter(r => r.won).length / bucket.length;
      const wrDelta = avgImpl > 0 ? actualWR - avgImpl : null;
      const flatROI = parseFloat(b.flatROI) || 0;
      const verdict = flatROI > 5 ? 'Strong' : flatROI > -5 ? 'Fair' : flatROI > -15 ? 'Weak' : 'Failing';
      return [
        b.stars, b.n,
        avgImpl > 0 ? (avgImpl * 100).toFixed(1) + '%' : '—',
        avgImpl > 0 ? (avgImpl * 100).toFixed(1) + '%' : '—',
        (actualWR * 100).toFixed(1) + '%',
        wrDelta != null ? (wrDelta > 0 ? '+' : '') + (wrDelta * 100).toFixed(1) + '%' : '—',
        b.flatROI, b.modelROI, b.avgUnits, b.avgCLV,
        verdict,
      ];
    });
    out.push(mdTable(headers, data));

    // Pairwise rank test
    out.push('\n**Pairwise Rank Test**\n');
    const pairHeaders = ['Comparison', 'Higher WR', 'Lower WR', 'Delta', 'Status'];
    const pairData = [];
    for (let i = 0; i < bk.length - 1; i++) {
      const hi = bk[i], lo = bk[i + 1];
      const hiWR = parseFloat(hi.wr), loWR = parseFloat(lo.wr);
      const delta = hiWR - loWR;
      const status = delta > 0 ? 'Correct' : delta > -3 ? 'Flat' : 'INVERTED';
      pairData.push([`${hi.stars}★ vs ${lo.stars}★`, hi.wr, lo.wr, (delta > 0 ? '+' : '') + delta.toFixed(1) + '%', status]);
    }
    out.push(mdTable(pairHeaders, pairData));

    // Calibration summary metrics
    if (bk.length >= 3) {
      const stars = bk.map(b => b.stars);
      const flatROIs = bk.map(b => parseFloat(b.flatROI) || 0);
      const wrs = bk.map(b => parseFloat(b.wr) || 0);
      const clvs = bk.map(b => parseFloat(b.avgCLV) || 0);
      const rhoFlat = spearman(stars, flatROIs);
      const rhoWR = spearman(stars, wrs);
      const rhoCLV = spearman(stars, clvs);
      const monoScore = mono(wrs) / Math.max(1, wrs.length - 1);

      // Brier score approximation
      const brierRows = sub.filter(r => r.lockProb != null);
      const brier = brierRows.length > 0
        ? avg(brierRows.map(r => (r.won - r.lockProb) ** 2))
        : null;

      out.push('\n**Calibration Summary**\n');
      out.push(mdTable(
        ['Metric', 'Value'],
        [
          ['Spearman: Stars vs WR', rhoWR != null ? rhoWR.toFixed(3) : '—'],
          ['Spearman: Stars vs Flat ROI', rhoFlat != null ? rhoFlat.toFixed(3) : '—'],
          ['Spearman: Stars vs CLV', rhoCLV != null ? rhoCLV.toFixed(3) : '—'],
          ['Brier Score', brier != null ? brier.toFixed(4) : '—'],
          ['Monotonicity Score', monoScore.toFixed(2)],
        ]
      ));

      if (rhoFlat != null && rhoFlat <= 0) {
        out.push('\n**⚠️ RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI');
      }
    }
    out.push('');
  }
  return out.join('\n');
}

// ── 4. V8 Core Variable Audit ────────────────────────────────────────────────

function sec4_coreVariableAudit(rows) {
  const out = ['\n---\n\n## 4. V8 Core Variable Audit\n'];
  out.push('These are the variables that actually make V8 work. Each one should be tracked as a predictor.\n');

  const v8 = windowFilter(rows, 'V8 Era');
  const target = v8.length >= 10 ? v8 : rows;
  if (target.length < 10) {
    out.push('_Insufficient data for variable audit._');
    return out.join('\n');
  }

  const variables = [
    { key: 'avgRoiNorm', label: 'ROI_norm', type: 'Wallet quality', measures: 'Wallet skill percentile', expected: 'Higher → better' },
    { key: 'avgRankNorm', label: 'Rank_norm', type: 'Wallet quality', measures: 'Leaderboard quality', expected: 'Higher → better' },
    { key: 'avgPnlNorm', label: 'PnL_norm', type: 'Wallet quality', measures: 'Wallet durability', expected: 'Higher → better' },
    { key: 'avgWalletBase', label: 'WalletBase', type: 'Wallet quality', measures: 'Composite skill score', expected: 'Higher → better' },
    { key: 'avgSizeRatio', label: 'SizeRatio', type: 'Conviction', measures: 'Current bet vs avg bet', expected: 'Higher → better (nonlinear)' },
    { key: 'avgConvictionMult', label: 'ConvictionMult', type: 'Conviction', measures: 'Log-scaled conviction boost', expected: 'Higher → better (capped)' },
    { key: 'avgContribution', label: 'WalletContribution', type: 'Per-wallet force', measures: 'Skill × conviction', expected: 'Higher → better' },
    { key: 'forSide', label: 'ForSide', type: 'Side support', measures: 'Total wallet force on side', expected: 'Higher → better' },
    { key: 'againstSide', label: 'AgainstSide', type: 'Opposition', measures: 'Force against side', expected: 'Higher → worse' },
    { key: 'netEdge', label: 'NetEdge', type: 'Core side edge', measures: 'For minus discounted against', expected: 'Higher → better' },
    { key: 'breadthBonus', label: 'BreadthBonus', type: 'Consensus', measures: 'More supporting wallets', expected: 'Higher → better (modest)' },
    { key: 'topShare', label: 'TopShare', type: 'Concentration', measures: 'Dependency on one wallet', expected: 'Higher → worse' },
    { key: 'concPenalty', label: 'ConcPenalty', type: 'Concentration', measures: 'Penalty from TopShare', expected: 'Higher → worse' },
    { key: 'walletPlayScore', label: 'WalletPlayScore', type: 'Final raw score', measures: 'Pre-star V8 signal', expected: 'Higher → better' },
  ];

  const headers = ['Variable', 'Type', 'What It Measures', 'Expected Direction', 'Spearman vs WR', 'Spearman vs ROI', 'Verdict'];
  const data = variables.map(v => {
    const valid = target.filter(r => r[v.key] != null && isFinite(r[v.key]));
    if (valid.length < 10) return [v.label, v.type, v.measures, v.expected, '—', '—', 'Insufficient data'];

    const vals = valid.map(r => r[v.key]);
    const wrVals = valid.map(r => r.won);
    const roiVals = valid.map(r => r.flatWinAmt);
    const rhoWR = spearman(vals, wrVals);
    const rhoROI = spearman(vals, roiVals);

    const isNeg = v.expected.includes('worse');
    let verdict;
    if (rhoWR == null || rhoROI == null) {
      verdict = 'N/A';
    } else if (isNeg) {
      verdict = rhoWR < -0.03 ? 'Keep' : rhoWR > 0.05 ? 'Tune' : 'Monitor';
    } else {
      verdict = rhoWR > 0.03 ? 'Keep' : rhoWR < -0.05 ? 'Tune' : 'Monitor';
    }

    return [
      v.label, v.type, v.measures, v.expected,
      rhoWR != null ? rhoWR.toFixed(3) : '—',
      rhoROI != null ? rhoROI.toFixed(3) : '—',
      verdict,
    ];
  });
  out.push(mdTable(headers, data));

  return out.join('\n');
}

// ── 5. Variable Buckets ──────────────────────────────────────────────────────

function sec5_variableBuckets(rows) {
  const out = ['\n---\n\n## 5. Variable Buckets\n'];
  out.push('This is how you find out where V8 is actually making money.\n');

  const v8 = windowFilter(rows, 'V8 Era');
  const target = v8.length >= 15 ? v8 : rows;
  if (target.length < 10) {
    out.push('_Insufficient data for variable buckets._');
    return out.join('\n');
  }

  const bucketHeaders = ['Bucket', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'Notes'];

  // WalletBase buckets
  out.push('### WalletBase Buckets\n');
  const wbBuckets = percentileBuckets(target, 'avgWalletBase', ['p0-20', 'p20-40', 'p40-60', 'p60-80', 'p80-95', 'p95+']);
  if (wbBuckets.length > 0) {
    out.push(mdTable(bucketHeaders, wbBuckets.map(b => [
      `${b.label} (${b.range})`, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV, ''
    ])));
  } else {
    out.push('_Insufficient data_');
  }

  // ConvictionMultiplier buckets
  out.push('\n### ConvictionMultiplier Buckets\n');
  const cmRanges = [
    { label: '0.70-0.90', lo: 0.70, hi: 0.90 },
    { label: '0.90-1.05', lo: 0.90, hi: 1.05 },
    { label: '1.05-1.20', lo: 1.05, hi: 1.20 },
    { label: '1.20-1.35', lo: 1.20, hi: 1.35 },
    { label: '1.35-1.50', lo: 1.35, hi: 1.50 },
    { label: '1.50+', lo: 1.50, hi: Infinity },
  ];
  const cmBuckets = bucketByRange(target, 'avgConvictionMult', cmRanges);
  if (cmBuckets.length > 0) {
    out.push(mdTable(bucketHeaders, cmBuckets.map(b => [b.label, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV, ''])));
  } else {
    out.push('_Insufficient data_');
  }

  // NetEdge buckets
  out.push('\n### NetEdge Buckets\n');
  const neBuckets = percentileBuckets(target, 'netEdge', ['Bottom 20%', '20-40%', '40-60%', '60-80%', '80-95%', '95%+']);
  if (neBuckets.length > 0) {
    out.push(mdTable(bucketHeaders, neBuckets.map(b => [
      `${b.label} (${b.range})`, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV, ''
    ])));
  } else {
    out.push('_Insufficient data_');
  }

  // TopShare / concentration buckets
  out.push('\n### TopShare / Concentration Buckets\n');
  const tsRanges = [
    { label: '0.00-0.25 (Broad support)', lo: 0, hi: 0.25 },
    { label: '0.25-0.40 (Healthy support)', lo: 0.25, hi: 0.40 },
    { label: '0.40-0.60 (Concentrated)', lo: 0.40, hi: 0.60 },
    { label: '0.60-0.80 (Very concentrated)', lo: 0.60, hi: 0.80 },
    { label: '0.80-1.00 (One-wallet driven)', lo: 0.80, hi: 1.01 },
  ];
  const tsBuckets = bucketByRange(target, 'topShare', tsRanges);
  if (tsBuckets.length > 0) {
    out.push(mdTable([...bucketHeaders.slice(0, -1), 'Interpretation'], tsBuckets.map(b => {
      const interp = b.label.match(/\((.+)\)/)?.[1] || '';
      return [b.label.replace(/\s*\(.+\)/, ''), b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV, interp];
    })));
  } else {
    out.push('_Insufficient data_');
  }

  return out.join('\n');
}

// ── 6. Consensus vs Conflict ─────────────────────────────────────────────────

function sec6_consensusConflict(rows) {
  const out = ['\n---\n\n## 6. Consensus vs Conflict\n'];

  const v8 = windowFilter(rows, 'V8 Era');
  const target = v8.length >= 10 ? v8 : rows;
  if (target.length < 5) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  const boards = [
    { label: 'Clean consensus', filter: r => (r.againstSide ?? 0) < 10 && (r.topShare ?? 1) < 0.5 },
    { label: 'Broad battle', filter: r => (r.forSide ?? 0) > 50 && (r.againstSide ?? 0) > 30 },
    { label: 'One-wallet nuke', filter: r => (r.walletCountFor ?? 0) <= 1 || (r.topShare ?? 0) > 0.8 },
    { label: 'False favorite', filter: r => false }, // Placeholder — needs biggest bet data
    { label: 'Thin support', filter: r => (r.walletCountFor ?? 0) <= 2 },
  ];

  const headers = ['Board Type', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'Avg Stars'];
  const data = boards.map(b => {
    const sub = target.filter(b.filter);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [b.label, a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV, a.avgStars];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  return out.join('\n');
}

// ── 7. Regime and Gate Audit ─────────────────────────────────────────────────

function sec7_regimeAudit(rows, allSides) {
  const out = ['\n---\n\n## 7. Regime and Gate Audit\n'];
  out.push('V8 stars are wallet-only, but the production system still depends on lock/shadow gating.\n');

  const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];

  // Regime performance
  out.push('### Regime Performance\n');
  for (const era of ['V8 Era', 'All Time']) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`**${era}** (n=${sub.length})\n`);
    const headers = ['Regime', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'Avg Stars', 'Lock Rate'];
    const data = regimes.map(reg => {
      const rs = sub.filter(r => r.regime === reg);
      if (rs.length === 0) return null;
      const a = agg(rs);
      const lockRate = pct(rs.filter(r => r.lockStage === 'LOCKED').length, rs.length);
      return [reg, a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV, a.avgStars, lockRate];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');
  }

  // Stars × Regime cross table
  out.push('### Stars × Regime\n');
  const v8 = windowFilter(rows, 'V8 Era');
  const target = v8.length >= 10 ? v8 : rows;
  if (target.length >= 10) {
    const starVals = ['4.5-5★', '3.5-4★', '2.5-3★', '1.0-2★'];
    const tagged = target.map(r => ({
      ...r,
      starBucket: r.peakStars >= 4.5 ? '4.5-5★' : r.peakStars >= 3.5 ? '3.5-4★' : r.peakStars >= 2.5 ? '2.5-3★' : '1.0-2★',
    }));
    const headers = ['Stars', ...regimes.map(r => `${r} (N/WR/ROI)`)];
    const data = starVals.map(sv => {
      const cells = regimes.map(reg => {
        const sub = tagged.filter(r => r.starBucket === sv && r.regime === reg);
        if (sub.length === 0) return '—';
        const a = agg(sub);
        return `${a.n} / ${a.wr} / ${a.flatROI}`;
      });
      return [sv, ...cells];
    });
    out.push(mdTable(headers, data));
  } else {
    out.push('_Insufficient data_');
  }

  // Lock vs shadow
  out.push('\n### Lock vs Shadow\n');
  for (const era of ['V8 Era', 'All Time']) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    const statuses = ['LOCKED', 'SHADOW'];
    const lsHeaders = ['Status', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg Stars', 'Avg CLV'];
    const lsData = statuses.map(s => {
      const rs = sub.filter(r => r.lockStage === s);
      if (rs.length === 0) return null;
      const a = agg(rs);
      return [s, a.n, a.wr, a.flatROI, a.modelROI, a.avgStars, a.avgCLV];
    }).filter(Boolean);
    if (lsData.length > 0) {
      out.push(`**${era}**\n`);
      out.push(mdTable(lsHeaders, lsData));
      out.push('');
    }
  }

  // Gate volume from allSides
  const v8Sides = allSides.filter(r => r.date >= V8_LIVE_DATE);
  if (v8Sides.length > 0) {
    out.push('### V8 Era Gate Volume\n');
    const locked = v8Sides.filter(r => r.lockStage === 'LOCKED' && !r.superseded && !r.promotedAt);
    const promoted = v8Sides.filter(r => r.promotedAt != null && !r.superseded);
    const rejected = v8Sides.filter(r => r.lockStage === 'SHADOW' && !r.superseded && !r.promotedAt);
    const superseded = v8Sides.filter(r => r.superseded);
    const muted = v8Sides.filter(r => r.healthStatus === 'MUTED');
    const cancelled = v8Sides.filter(r => r.healthStatus === 'CANCELLED');
    out.push(mdTable(
      ['Category', 'Count', '%'],
      [
        ['Total Written', v8Sides.length, '100%'],
        ['LOCKED (direct)', locked.length, pct(locked.length, v8Sides.length)],
        ['Promoted (SHADOW→LOCKED)', promoted.length, pct(promoted.length, v8Sides.length)],
        ['Rejected (stayed SHADOW)', rejected.length, pct(rejected.length, v8Sides.length)],
        ['Superseded (side flipped)', superseded.length, pct(superseded.length, v8Sides.length)],
        ['Muted', muted.length, pct(muted.length, v8Sides.length)],
        ['Cancelled', cancelled.length, pct(cancelled.length, v8Sides.length)],
      ]
    ));
  }

  return out.join('\n');
}

// ── 8. Sizing Audit ──────────────────────────────────────────────────────────

function sec8_sizingAudit(rows) {
  const out = ['\n---\n\n## 8. Sizing Audit\n'];
  out.push('Keep this separate from ranking. V8 tuning should first answer: are the stars right? Only then ask whether units are right.\n');

  for (const era of ['V8 Era', 'All Time']) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`### ${era} (n=${sub.length})\n`);

    const flatPL = sub.reduce((s, r) => s + r.flatWinAmt, 0);
    const modelPL = sub.reduce((s, r) => s + r.profit, 0);
    const lockUnitsPL = sub.reduce((s, r) => s + (r.won ? r.lockUnits * (r.lockOdds < 0 ? 100 / Math.abs(r.lockOdds) : r.lockOdds / 100) : -r.lockUnits), 0);
    const starsOnlyPL = sub.reduce((s, r) => {
      const u = r.starDelta > 0 ? r.peakUnits : r.lockUnits;
      return s + (r.won ? u * (r.lockOdds < 0 ? 100 / Math.abs(r.lockOdds) : r.lockOdds / 100) : -u);
    }, 0);

    out.push('**Counterfactual Scenarios**\n');
    const totalRisked = sub.reduce((s, r) => s + r.peakUnits, 0);
    out.push(mdTable(
      ['Scenario', 'P/L', 'ROI', 'vs Actual'],
      [
        ['Actual (model units)', modelPL.toFixed(2) + 'u', totalRisked > 0 ? (modelPL / totalRisked * 100).toFixed(1) + '%' : '—', '—'],
        ['Flat 1.0u', flatPL.toFixed(2) + 'u', (flatPL / sub.length * 100).toFixed(1) + '%', (modelPL - flatPL > 0 ? '+' : '') + (modelPL - flatPL).toFixed(2) + 'u'],
        ['Lock units only', lockUnitsPL.toFixed(2) + 'u', '—', (modelPL - lockUnitsPL > 0 ? '+' : '') + (modelPL - lockUnitsPL).toFixed(2) + 'u'],
        ['Units change only on star change', starsOnlyPL.toFixed(2) + 'u', '—', (modelPL - starsOnlyPL > 0 ? '+' : '') + (modelPL - starsOnlyPL).toFixed(2) + 'u'],
      ]
    ));

    // By star bucket
    out.push('\n**Sizing by Star Bucket**\n');
    const bk = starBuckets(sub);
    const svHeaders = ['Stars', 'N', 'Avg Units', 'Flat ROI', 'Model ROI', 'Sizing Edge', 'Verdict'];
    const svData = bk.map(b => {
      const bucket = sub.filter(r => r.peakStars === b.stars);
      const bFlat = bucket.reduce((s, r) => s + r.flatWinAmt, 0);
      const bModel = bucket.reduce((s, r) => s + r.profit, 0);
      const edge = bModel - bFlat;
      const verdict = edge > 0.5 ? 'Sizing helps' : edge > -0.5 ? 'Neutral' : 'Sizing hurts';
      return [b.stars, b.n, b.avgUnits, b.flatROI, b.modelROI, (edge > 0 ? '+' : '') + edge.toFixed(2) + 'u', verdict];
    });
    out.push(mdTable(svHeaders, svData));
    out.push('');
  }
  return out.join('\n');
}

// ── 9. Calibration Against Market Baseline ───────────────────────────────────

function sec9_marketBaseline(rows) {
  const out = ['\n---\n\n## 9. Calibration Against Market Baseline\n'];
  out.push('Use market expectation as a discipline check.\n');

  const v8 = windowFilter(rows, 'V8 Era');
  const target = v8.length >= 10 ? v8 : rows;
  if (target.length < 5) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  const groups = [
    { label: 'All V8 plays', filter: () => true },
    { label: '4.5-5★', filter: r => r.peakStars >= 4.5 },
    { label: '3.5-4★', filter: r => r.peakStars >= 3.5 && r.peakStars < 4.5 },
    { label: '2.5-3★', filter: r => r.peakStars >= 2.5 && r.peakStars < 3.5 },
    { label: 'CLEAR_MOVE only', filter: r => r.regime === 'CLEAR_MOVE' },
    { label: 'NO_MOVE only', filter: r => r.regime === 'NO_MOVE' },
  ];

  const headers = ['Bucket', 'N', 'Avg Implied%', 'Actual WR', 'WR Delta', 'Flat ROI', 'Avg CLV', 'Verdict'];
  const data = groups.map(g => {
    const sub = target.filter(g.filter);
    if (sub.length < 3) return null;
    const a = agg(sub);
    const implRows = sub.filter(r => r.lockProb != null);
    const avgImpl = implRows.length > 0 ? avg(implRows.map(r => r.lockProb)) : null;
    const actualWR = sub.filter(r => r.won).length / sub.length;
    const wrDelta = avgImpl ? actualWR - avgImpl : null;
    const verdict = wrDelta != null ? (wrDelta > 0.02 ? 'Beating market' : wrDelta > -0.02 ? 'Neutral' : 'Below market') : '—';
    return [
      g.label, sub.length,
      avgImpl ? (avgImpl * 100).toFixed(1) + '%' : '—',
      (actualWR * 100).toFixed(1) + '%',
      wrDelta != null ? (wrDelta > 0 ? '+' : '') + (wrDelta * 100).toFixed(1) + '%' : '—',
      a.flatROI, a.avgCLV, verdict,
    ];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  return out.join('\n');
}

// ── 10. Drift Monitoring ─────────────────────────────────────────────────────

function sec10_drift(rows) {
  const out = ['\n---\n\n## 10. Drift Monitoring\n'];
  out.push('V8 should be rechecked anytime the live board stops looking like the calibration universe.\n');

  const allValid = rows.filter(r => r.walletPlayScore != null);
  if (allValid.length < 10) {
    out.push('_Insufficient V8 data for drift monitoring._');
    return out.join('\n');
  }

  const features = [
    { key: 'avgRoiNorm', label: 'ROI_norm' },
    { key: 'avgRankNorm', label: 'Rank_norm' },
    { key: 'avgPnlNorm', label: 'PnL_norm' },
    { key: 'avgWalletBase', label: 'WalletBase' },
    { key: 'avgSizeRatio', label: 'SizeRatio' },
    { key: 'avgConvictionMult', label: 'ConvictionMult' },
    { key: 'walletCountFor', label: 'WalletCountFor' },
    { key: 'topShare', label: 'TopShare' },
    { key: 'forSide', label: 'ForSide' },
    { key: 'againstSide', label: 'AgainstSide' },
    { key: 'netEdge', label: 'NetEdge' },
    { key: 'walletPlayScore', label: 'WalletPlayScore' },
  ];

  // Use all-time data as frozen baseline, compare against recent windows
  const frozenData = {};
  for (const f of features) {
    const vals = rows.filter(r => r[f.key] != null && isFinite(r[f.key])).map(r => r[f.key]);
    if (vals.length >= 5) {
      frozenData[f.key] = { mean: avg(vals), std: std(vals) };
    }
  }

  for (const w of ['7-Day', 'V8 Era']) {
    const sub = windowFilter(rows, w).filter(r => r.walletPlayScore != null);
    if (sub.length < 3) continue;
    out.push(`### ${w} (n=${sub.length})\n`);

    const headers = ['Feature', 'Frozen Mean', 'Live Mean', 'Drift (σ)', 'Alert'];
    const data = features.map(f => {
      const frozen = frozenData[f.key];
      if (!frozen) return null;
      const vals = sub.filter(r => r[f.key] != null && isFinite(r[f.key])).map(r => r[f.key]);
      if (vals.length === 0) return null;
      const liveMean = avg(vals);
      const drift = frozen.std > 0 ? Math.abs(liveMean - frozen.mean) / frozen.std : 0;
      const alert = drift > 1.5 ? '🔴' : drift > 1.0 ? '⚠️' : '';
      return [f.label, frozen.mean.toFixed(3), liveMean.toFixed(3), drift.toFixed(2), alert];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');
  }
  return out.join('\n');
}

// ── 11. Failure Diagnostics ──────────────────────────────────────────────────

function sec11_failureDiagnostics(rows) {
  const out = ['\n---\n\n## 11. Failure Diagnostics\n'];

  for (const era of ['V8 Era', '7-Day', 'All Time']) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`### ${era} (n=${sub.length})\n`);

    const findings = [];
    const flatPL = sub.reduce((s, r) => s + r.flatWinAmt, 0);
    const modelPL = sub.reduce((s, r) => s + r.profit, 0);
    const wr = sub.filter(r => r.won).length / sub.length;
    const clvRows = sub.filter(r => r.clv != null);
    const avgClv = clvRows.length > 0 ? avg(clvRows.map(r => r.clv)) : null;

    // Ranking issue
    const bk = starBuckets(sub);
    const topStars = sub.filter(r => r.peakStars >= 4);
    const lowStars = sub.filter(r => r.peakStars <= 3);
    if (topStars.length >= 3 && lowStars.length >= 3) {
      const topWR = topStars.filter(r => r.won).length / topStars.length;
      const lowWR = lowStars.filter(r => r.won).length / lowStars.length;
      if (lowWR > topWR + 0.05) {
        findings.push(`**Ranking issue**: ≤3★ WR (${(lowWR * 100).toFixed(0)}%) beats ≥4★ (${(topWR * 100).toFixed(0)}%)`);
      }
    }

    // Sizing issue
    if (modelPL < flatPL - 1) {
      findings.push(`**Sizing issue**: Model P/L (${modelPL.toFixed(2)}u) trails flat (${flatPL.toFixed(2)}u) by ${(flatPL - modelPL).toFixed(2)}u`);
    }

    // Environment issue
    const noMove = sub.filter(r => r.regime === 'NO_MOVE');
    if (noMove.length > sub.length * 0.4) {
      const noMoveA = agg(noMove);
      findings.push(`**Environment issue**: ${pct(noMove.length, sub.length)} NO_MOVE (WR: ${noMoveA.wr}, ROI: ${noMoveA.flatROI})`);
    }

    // Concentration issue
    const highConc = sub.filter(r => (r.topShare ?? 0) > 0.6);
    if (highConc.length >= 3) {
      const hcA = agg(highConc);
      const hcROI = parseFloat(hcA.flatROI) || 0;
      if (hcROI < -10) {
        findings.push(`**Concentration issue**: ${highConc.length} high-concentration picks (TopShare>0.6) at ${hcA.flatROI} ROI`);
      }
    }

    // Gate issue
    const clearMove = sub.filter(r => r.regime === 'CLEAR_MOVE');
    const noMoveA2 = agg(noMove);
    const clearA = agg(clearMove);
    if (noMove.length >= 3 && clearMove.length >= 3) {
      const nmROI = parseFloat(noMoveA2.flatROI) || 0;
      const cmROI = parseFloat(clearA.flatROI) || 0;
      if (nmROI < cmROI - 15) {
        findings.push(`**Gate issue**: NO_MOVE ROI (${noMoveA2.flatROI}) significantly trails CLEAR_MOVE (${clearA.flatROI})`);
      }
    }

    // Odds mix issue
    if (avgClv != null && avgClv < -0.005) {
      findings.push(`**Odds issue**: Avg CLV ${(avgClv * 100).toFixed(2)}% — consistently getting bad closing lines`);
    }

    if (findings.length === 0) {
      out.push('No major failure modes detected.\n');
    } else {
      for (const f of findings) out.push(`- ${f}`);
      out.push('');
    }
  }
  return out.join('\n');
}

// ── 12. Action Board ─────────────────────────────────────────────────────────

function sec12_actionBoard() {
  return `
---

## 12. Action Board

| Priority | Issue | Evidence | Action | Owner | Status |
|---|---|---|---|---|---|
| P1 | _Review after data accumulates_ | — | — | — | Pending |
| P2 | _Review after data accumulates_ | — | — | — | Pending |

_Fill this in manually after reviewing the diagnostic sections above._`;
}

// ── 13. Keep / Tune / Cut Rules ──────────────────────────────────────────────

function sec13_keepTuneCut() {
  return `
---

## 13. Keep / Tune / Cut Rules

### Keep
- Variables with stable monotonic improvement across 7-day, 14-day, and V8-era windows
- Variables that improve both flat ROI and CLV
- Variables that work inside supportive regimes without needing heroic overrides

### Tune
- Variables with mixed direction by sport or odds band
- Variables that improve WR but not ROI
- Variables that work only when paired with low concentration or supportive gate conditions

### Cut
- Variables with repeated inversion
- Variables that only add value through noise or one hot streak
- Overrides that increase size without improving rank quality`;
}

// ── 14. Required Weekly Questions ────────────────────────────────────────────

function sec14_weeklyQuestions() {
  return `
---

## 14. Required Weekly Questions

1. Are higher V8 stars still beating lower V8 stars?
2. Is WalletPlayScore monotonic by WR, ROI, and CLV?
3. Is high conviction actually helping, or only in certain ranges?
4. Is concentration penalty strong enough to suppress fake one-wallet bombs?
5. Is the lock/shadow gate improving V8 or polluting it?
6. Are certain sports or odds bands breaking V8?
7. Is the whale override helping or leaking bad exposure?
8. Did the live wallet universe drift far enough to require threshold recalibration?`;
}

// ── 15. Minimal Dashboard KPIs ───────────────────────────────────────────────

function sec15_kpis(rows) {
  const out = ['\n---\n\n## 15. Minimal Dashboard KPIs\n'];

  const v8 = windowFilter(rows, 'V8 Era');
  const a = agg(v8);
  const allA = agg(rows);

  const bk = starBuckets(v8);
  const wrs = bk.map(b => parseFloat(b.wr) || 0);
  const monoScore = bk.length >= 2 ? (mono(wrs) / Math.max(1, wrs.length - 1)).toFixed(2) : '—';

  const top = v8.filter(r => r.peakStars >= 4.5);
  const topA = agg(top);
  const mid = v8.filter(r => r.peakStars >= 2.5 && r.peakStars < 3.5);
  const midA = agg(mid);

  const clearMove = v8.filter(r => r.regime === 'CLEAR_MOVE');
  const cmA = agg(clearMove);
  const noMove = v8.filter(r => r.regime === 'NO_MOVE');
  const nmA = agg(noMove);

  const swRate = v8.length > 0 ? pct(v8.filter(r => r.singleWallet === 1).length, v8.length) : '—';

  // Whale override WR — picks with avgWalletBase > 90 and single wallet
  const whaleOverrides = v8.filter(r => r.singleWallet === 1 && (r.avgWalletBase ?? 0) > 80);
  const whaleWR = whaleOverrides.length > 0 ? pct(whaleOverrides.filter(r => r.won).length, whaleOverrides.length) : '—';

  // CLV by star bucket
  const clvByStars = bk.map(b => `${b.stars}★: ${b.avgCLV}`).join(' | ');

  // Drift alert count
  const allValid = rows.filter(r => r.walletPlayScore != null);
  let driftAlerts = 0;
  if (allValid.length >= 10) {
    const features = ['avgRoiNorm', 'avgWalletBase', 'walletPlayScore', 'netEdge', 'topShare'];
    for (const key of features) {
      const frozenVals = rows.filter(r => r[key] != null && isFinite(r[key])).map(r => r[key]);
      if (frozenVals.length < 5) continue;
      const frozenMean = avg(frozenVals);
      const frozenStd = std(frozenVals);
      const liveVals = v8.filter(r => r[key] != null && isFinite(r[key])).map(r => r[key]);
      if (liveVals.length < 3 || frozenStd === 0) continue;
      const drift = Math.abs(avg(liveVals) - frozenMean) / frozenStd;
      if (drift > 1.0) driftAlerts++;
    }
  }

  out.push(mdTable(
    ['KPI', 'Value'],
    [
      ['V8 era picks', v8.length],
      ['V8 flat ROI', a.flatROI],
      ['V8 model ROI', a.modelROI],
      ['V8 star monotonicity score', monoScore],
      ['4.5-5★ ROI', topA.flatROI],
      ['2.5-3★ ROI', midA.flatROI],
      ['CLEAR_MOVE ROI', cmA.flatROI],
      ['NO_MOVE ROI', nmA.flatROI],
      ['Single-wallet play rate', swRate],
      ['Whale override win rate', whaleWR],
      ['Avg CLV by star bucket', clvByStars || '—'],
      ['Drift alert count', driftAlerts],
    ]
  ));

  return out.join('\n');
}

// ── 8b. Pick Health Audit (bonus — carried from V7) ──────────────────────────

function secPickHealth(rows) {
  const out = ['\n---\n\n## Pick Health (Mute/Cancel) Audit\n'];

  for (const w of ['V8 Era', '7-Day', 'All Time']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 5) continue;
    out.push(`### ${w} (n=${sub.length})\n`);

    const statuses = ['ACTIVE', 'MUTED', 'CANCELLED'];
    const headers = ['Health', 'N', '%', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV'];
    const data = statuses.map(s => {
      const ss = sub.filter(r => (r.healthStatus || 'ACTIVE') === s);
      if (ss.length === 0) return null;
      const a = agg(ss);
      return [s, ss.length, pct(ss.length, sub.length), a.wr, a.flatROI, a.modelROI, a.avgCLV];
    }).filter(Boolean);
    out.push(mdTable(headers, data));

    const reasonCounts = {};
    sub.forEach(r => {
      (r.healthReasons || []).forEach(reason => {
        if (!reasonCounts[reason]) reasonCounts[reason] = { total: 0, wins: 0 };
        reasonCounts[reason].total++;
        if (r.won) reasonCounts[reason].wins++;
      });
    });
    const reasonEntries = Object.entries(reasonCounts).sort((a, b) => b[1].total - a[1].total);
    if (reasonEntries.length > 0) {
      out.push('\n**Health Trigger Frequency**\n');
      out.push(mdTable(['Reason', 'N', 'WR'], reasonEntries.map(([r, c]) => [r, c.total, pct(c.wins, c.total)])));
    }
    out.push('');
  }
  return out.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('Exporting picks from Firebase...');
  const [completedRows, allSides] = await Promise.all([exportPicks(), exportAllSides()]);
  console.log(`Exported ${completedRows.length} completed picks, ${allSides.length} total sides.`);

  if (completedRows.length === 0) {
    console.log('No completed picks found. Exiting.');
    process.exit(0);
  }

  const report = [
    secHeader(completedRows),
    sec1_triggers(completedRows),
    sec2_perfWindows(completedRows),
    sec3_starCalibration(completedRows),
    sec4_coreVariableAudit(completedRows),
    sec5_variableBuckets(completedRows),
    sec6_consensusConflict(completedRows),
    sec7_regimeAudit(completedRows, allSides),
    sec8_sizingAudit(completedRows),
    sec9_marketBaseline(completedRows),
    sec10_drift(completedRows),
    sec11_failureDiagnostics(completedRows),
    sec12_actionBoard(),
    sec13_keepTuneCut(),
    sec14_weeklyQuestions(),
    sec15_kpis(completedRows),
    secPickHealth(completedRows),
  ];

  const outPath = join(__dirname, '../DAILY_V8_REPORT.md');
  writeFileSync(outPath, report.join('\n'));
  console.log(`\nReport written to ${outPath}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
