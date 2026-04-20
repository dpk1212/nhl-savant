/**
 * Sharp Action Position — Daily Diagnostic Report
 *
 * In-depth analysis of individual sharp wallet positions tracked in the
 * `sharp_action_positions` Firebase collection. Unlike the V8 pick report
 * (which tracks aggregated game-level picks), this report examines each
 * individual wallet-level trade.
 *
 * Report structure:
 *   0. Executive Summary
 *   1. Performance Windows
 *   2. Label Performance (SHARP_POSITION, HIGH_CONVICTION, EV_OPPORTUNITY)
 *   3. Tier Calibration (ELITE, TOP 500, PROVEN, SHARP)
 *   4. Market Type Breakdown (ML, SPREAD, TOTAL)
 *   5. Sport Breakdown
 *   6. Conviction Analysis (betMultiplier buckets)
 *   7. Wallet Skill Analysis (sportROI, sportPnlTotal)
 *   8. Entry Price Calibration (avgPrice vs outcome)
 *   9. Position Sizing Analysis (invested buckets)
 *  10. Pinnacle Edge Analysis (+EV positions vs non-EV)
 *  11. Polymarket P&L vs Sportsbook P&L
 *  12. Wallet Concentration (top wallets driving results)
 *  13. Game-Level Analysis (multi-wallet games)
 *  14. CLV Analysis (closing line value)
 *  15. Time-of-Day / First Seen Analysis
 *  16. Failure Diagnostics
 *  17. Dashboard KPIs
 *
 * Usage: node scripts/dailySharpActionReport.js
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
  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const etToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const etNDaysAgo = (n) => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
};

function pct(n, d) { return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—'; }
function avg(arr) { return arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function median(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function std(arr) {
  if (arr.length < 2) return 0;
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1));
}
function fmtDollar(n) {
  if (n == null) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : n > 0 ? '+' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  return `${sign}$${abs}`;
}

function impliedProb(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

/** Firestore Timestamp, Date, ISO string, or { seconds } → ms */
function docTimestampToMs(val) {
  if (val == null) return null;
  if (val instanceof Date) return val.getTime();
  if (typeof val.toDate === 'function') return val.toDate().getTime();
  if (typeof val === 'object' && typeof val.seconds === 'number') return val.seconds * 1000;
  if (typeof val === 'string') {
    const t = Date.parse(val);
    return Number.isNaN(t) ? null : t;
  }
  return null;
}

function log10safe(x) {
  if (x == null || !isFinite(x) || x <= 0) return null;
  return Math.log10(x);
}

/** Attach outcomes used for quant analysis (call once after export). */
function attachDerivedMetrics(rows) {
  for (const r of rows) {
    const inv = r.invested || 0;
    r.stakedRoi = inv > 0 ? r.settledPnl / inv : null;
    r.beatEntryImplied = (r.avgPrice != null && isFinite(r.avgPrice)) ? r.won - r.avgPrice : null;
    r.pinnacleClosingImp = impliedProb(r.closingPinnacleOdds);
    const g = docTimestampToMs(r.gradedAt);
    const f = docTimestampToMs(r.firstSeen);
    r.hoursToGrade = g != null && f != null && g >= f ? (g - f) / 3600000 : null;
    r.logSportVol = log10safe(r.sportVol);
    r.isConsensus = r.v8_consensusSide != null && r.side === r.v8_consensusSide ? 1 : 0;
  }
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

// ── Data Export ──────────────────────────────────────────────────────────────

async function exportGradedPositions(db) {
  const snap = await db.collection('sharp_action_positions')
    .where('status', '==', 'GRADED')
    .get();

  const rows = [];
  snap.forEach(d => {
    const data = d.data();
    if (!data.result || data.result === 'PUSH') return;

    const won = data.result === 'WIN' ? 1 : 0;
    rows.push({
      id: d.id,
      date: data.date,
      sport: data.sport,
      gameKey: data.gameKey,
      away: data.away,
      home: data.home,
      wallet: data.wallet,
      walletShort: data.walletShort,
      tier: data.tier || 'SHARP',
      leaderboardRank: data.leaderboardRank,
      sportsLbPercentileTop: data.sportsLbPercentileTop,
      marketType: data.marketType,
      side: data.side,
      teamName: data.teamName,
      outcome: data.outcome,
      invested: data.invested || 0,
      size: data.size || 0,
      avgPrice: data.avgPrice || 0,
      curPrice: data.curPrice ?? null,
      positionPnl: data.positionPnl ?? null,
      currentValue: data.currentValue ?? null,
      avgSportBet: data.avgSportBet || 0,
      betMultiplier: data.betMultiplier || 0,
      sportROI: data.sportROI || 0,
      totalPnl: data.totalPnl || 0,
      sportPnlTotal: data.sportPnlTotal || 0,
      sportVol: data.sportVol || 0,
      pinnacleImplied: data.pinnacleImplied,
      bestRetailOdds: data.bestRetailOdds,
      bestBook: data.bestBook,
      evEdge: data.evEdge,
      label: data.label || 'SHARP_POSITION',
      firstSeen: data.firstSeen,
      won,
      result: data.result,
      settledPnl: data.settledPnl || 0,
      settledPrice: data.settledPrice ?? (won ? 1 : 0),
      createdAt: data.createdAt ?? null,
      gradedAt: data.gradedAt ?? null,
      awayScore: data.score?.away ?? null,
      homeScore: data.score?.home ?? null,
      closingPinnacleOdds: data.closingPinnacleOdds ?? null,
      clv: data.clv ?? null,
      spreadLine: data.spreadLine ?? data.entryLine ?? null,
      totalLine: data.totalLine ?? data.entryLine ?? null,
      // V8 scoring fields
      v8_walletPlayScore: data.v8_walletPlayScore ?? null,
      v8_stars: data.v8_stars ?? null,
      v8_starLabel: data.v8_starLabel ?? null,
      v8_forSide: data.v8_forSide ?? null,
      v8_againstSide: data.v8_againstSide ?? null,
      v8_netEdge: data.v8_netEdge ?? null,
      v8_breadthBonus: data.v8_breadthBonus ?? null,
      v8_concPenalty: data.v8_concPenalty ?? null,
      v8_topShare: data.v8_topShare ?? null,
      v8_walletCountFor: data.v8_walletCountFor ?? null,
      v8_walletCountAgainst: data.v8_walletCountAgainst ?? null,
      v8_consensusSide: data.v8_consensusSide ?? null,
      v8_walletContribution: data.v8_walletContribution ?? null,
      v8_walletRoiNorm: data.v8_walletRoiNorm ?? null,
      v8_walletPnlNorm: data.v8_walletPnlNorm ?? null,
      v8_walletRankNorm: data.v8_walletRankNorm ?? null,
      v8_walletBase: data.v8_walletBase ?? null,
      v8_convictionMult: data.v8_convictionMult ?? null,
      v8_sizeRatio: data.v8_sizeRatio ?? null,
    });
  });
  return rows;
}

// ── Window Filtering ─────────────────────────────────────────────────────────

function windowFilter(rows, label) {
  if (label === '1-Day') return rows.filter(r => r.date === etToday());
  if (label === 'Yesterday') return rows.filter(r => r.date === etNDaysAgo(1));
  if (label === '3-Day') return rows.filter(r => r.date >= etNDaysAgo(3));
  if (label === '7-Day') return rows.filter(r => r.date >= etNDaysAgo(7));
  if (label === '14-Day') return rows.filter(r => r.date >= etNDaysAgo(14));
  if (label === '30-Day') return rows.filter(r => r.date >= etNDaysAgo(30));
  return rows;
}

const WINDOWS = ['1-Day', '3-Day', '7-Day', '14-Day', '30-Day', 'All Time'];

// ── Aggregation ──────────────────────────────────────────────────────────────

function agg(rows) {
  if (rows.length === 0) return { n: 0, wr: '—', roi: '—', pnl: '—', avgInv: '—', avgMult: '—', avgPrice: '—' };
  const n = rows.length;
  const wins = rows.filter(r => r.won).length;
  const totalInvested = rows.reduce((s, r) => s + r.invested, 0);
  const totalPnl = rows.reduce((s, r) => s + r.settledPnl, 0);
  const clvRows = rows.filter(r => r.clv != null);
  return {
    n, wins,
    wr: pct(wins, n),
    roi: totalInvested > 0 ? (totalPnl / totalInvested * 100).toFixed(1) + '%' : '—',
    pnl: fmtDollar(totalPnl),
    totalInvested: fmtDollar(totalInvested),
    rawPnl: totalPnl,
    rawInvested: totalInvested,
    avgInv: fmtDollar(Math.round(avg(rows.map(r => r.invested)))),
    avgMult: avg(rows.map(r => r.betMultiplier)).toFixed(2) + 'x',
    avgPrice: avg(rows.map(r => r.avgPrice)).toFixed(3),
    avgCLV: clvRows.length > 0 ? avg(clvRows.map(r => r.clv)).toFixed(2) + '%' : '—',
    avgROI: avg(rows.map(r => r.sportROI)).toFixed(1) + '%',
  };
}

// ── Table Rendering ──────────────────────────────────────────────────────────

function mdTable(headers, rowsData) {
  if (rowsData.length === 0) return '_No data_';
  const lines = [];
  lines.push('| ' + headers.join(' | ') + ' |');
  lines.push('|' + headers.map(() => '---').join('|') + '|');
  for (const row of rowsData) lines.push('| ' + row.join(' | ') + ' |');
  return lines.join('\n');
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

// ══════════════════════════════════════════════════════════════════════════════
// REPORT SECTIONS
// ══════════════════════════════════════════════════════════════════════════════

function sec0_header(rows) {
  const today = etToday();
  const a = agg(rows);
  const hc = rows.filter(r => r.label === 'HIGH_CONVICTION');
  const sp = rows.filter(r => r.label === 'SHARP_POSITION');
  const ev = rows.filter(r => r.label === 'EV_OPPORTUNITY');
  const hcA = agg(hc);
  const spA = agg(sp);

  const overallVerdict = parseFloat(a.roi) > 0 ? 'PROFITABLE' :
    parseFloat(a.roi) > -5 ? 'MARGINAL' : 'LOSING';
  const bestLabel = (parseFloat(hcA.roi) || -999) > (parseFloat(spA.roi) || -999)
    ? 'HIGH_CONVICTION' : 'SHARP_POSITION';

  const sports = [...new Set(rows.map(r => r.sport))].sort();
  const dateRange = [...new Set(rows.map(r => r.date))].sort();

  return [
    `# Sharp Action Positions — Diagnostic Report`,
    `**Generated**: ${today} ET`,
    `**Total Graded**: ${rows.length} positions | **Date Range**: ${dateRange[0]} → ${dateRange[dateRange.length - 1]}`,
    `**Sports**: ${sports.join(', ')} | **Unique Wallets**: ${new Set(rows.map(r => r.wallet)).size}`,
    `\n## Executive Summary\n`,
    `- **Overall**: ${overallVerdict} — ${a.wr} WR, ${a.roi} ROI, ${a.pnl} P&L`,
    `- **Total Invested**: ${a.totalInvested}`,
    `- **Best performing label**: ${bestLabel}`,
    `- **Positions per day**: ${(rows.length / Math.max(1, dateRange.length)).toFixed(1)} avg`,
  ].join('\n');
}

function sec1_perfWindows(rows) {
  const out = ['\n---\n\n## 1. Performance Windows\n'];
  const headers = ['Window', 'Positions', 'WR', 'P&L', 'ROI', 'Invested', 'Avg Inv', 'Avg Mult', 'Avg CLV'];
  const data = WINDOWS.map(w => {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [w, a.n, a.wr, a.pnl, a.roi, a.totalInvested, a.avgInv, a.avgMult, a.avgCLV];
  }).filter(Boolean);
  out.push(mdTable(headers, data));
  return out.join('\n');
}

function sec2_labelPerformance(rows) {
  const out = ['\n---\n\n## 2. Label Performance\n'];
  out.push('How each position label (auto-assigned by the write script) performs.\n');

  const labels = ['HIGH_CONVICTION', 'EV_OPPORTUNITY', 'SHARP_POSITION'];
  const headers = ['Label', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg Inv', 'Avg Mult', 'Avg ROI (Wallet)'];
  const data = labels.map(l => {
    const sub = rows.filter(r => r.label === l);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [l, a.n, pct(sub.length, rows.length), a.wr, a.pnl, a.roi, a.avgInv, a.avgMult, a.avgROI];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  // Label × Sport cross
  out.push('\n### Label × Sport\n');
  const sports = [...new Set(rows.map(r => r.sport))].sort();
  const crossHeaders = ['Label', ...sports.map(s => `${s} (N/WR/ROI)`)];
  const crossData = labels.filter(l => rows.some(r => r.label === l)).map(l => {
    const cells = sports.map(s => {
      const sub = rows.filter(r => r.label === l && r.sport === s);
      if (sub.length === 0) return '—';
      const a = agg(sub);
      return `${a.n} / ${a.wr} / ${a.roi}`;
    });
    return [l, ...cells];
  });
  out.push(mdTable(crossHeaders, crossData));

  return out.join('\n');
}

function sec3_tierCalibration(rows) {
  const out = ['\n---\n\n## 3. Tier Calibration\n'];
  out.push('Are higher-tier wallets actually performing better?\n');

  const tiers = ['ELITE', 'TOP 500', 'PROVEN', 'SHARP'];
  const headers = ['Tier', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg Inv', 'Avg Wallet ROI', 'Avg Wallet P&L'];
  const data = tiers.map(t => {
    const sub = rows.filter(r => r.tier === t);
    if (sub.length === 0) return null;
    const a = agg(sub);
    const avgWalletPnl = fmtDollar(Math.round(avg(sub.map(r => r.sportPnlTotal))));
    return [t, a.n, pct(sub.length, rows.length), a.wr, a.pnl, a.roi, a.avgInv, a.avgROI, avgWalletPnl];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  if (data.length >= 2) {
    const tierNums = data.map((_, i) => i);
    const wrs = data.map(d => parseFloat(d[3]) || 0);
    const rho = spearman(tierNums, wrs);
    out.push(`\n**Spearman: Tier vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
  }

  return out.join('\n');
}

function sec4_marketType(rows) {
  const out = ['\n---\n\n## 4. Market Type Breakdown\n'];

  const markets = ['ML', 'SPREAD', 'TOTAL'];
  const headers = ['Market', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg Inv', 'Avg Price'];
  const data = markets.map(m => {
    const sub = rows.filter(r => r.marketType === m);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [m, a.n, pct(sub.length, rows.length), a.wr, a.pnl, a.roi, a.avgInv, a.avgPrice];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  // ML side breakdown
  const ml = rows.filter(r => r.marketType === 'ML');
  if (ml.length >= 5) {
    out.push('\n### ML — Favorites vs Underdogs\n');
    const favs = ml.filter(r => r.avgPrice >= 0.5);
    const dogs = ml.filter(r => r.avgPrice < 0.5);
    const fA = agg(favs);
    const dA = agg(dogs);
    out.push(mdTable(
      ['Side', 'N', 'WR', 'P&L', 'ROI', 'Avg Price'],
      [
        favs.length > 0 ? ['Favorites (≥50¢)', fA.n, fA.wr, fA.pnl, fA.roi, fA.avgPrice] : null,
        dogs.length > 0 ? ['Underdogs (<50¢)', dA.n, dA.wr, dA.pnl, dA.roi, dA.avgPrice] : null,
      ].filter(Boolean)
    ));
  }

  // TOTAL over/under
  const totals = rows.filter(r => r.marketType === 'TOTAL');
  if (totals.length >= 3) {
    out.push('\n### Totals — Over vs Under\n');
    const over = totals.filter(r => r.side === 'over');
    const under = totals.filter(r => r.side === 'under');
    out.push(mdTable(
      ['Side', 'N', 'WR', 'P&L', 'ROI'],
      [
        over.length > 0 ? ['Over', ...Object.values(agg(over)).slice(0, 5).map((v,i) => i === 0 ? v : v)] : null,
        under.length > 0 ? ['Under', ...Object.values(agg(under)).slice(0, 5).map((v,i) => i === 0 ? v : v)] : null,
      ].filter(Boolean).map(r => { const a = agg(r[0] === 'Over' ? over : under); return [r[0], a.n, a.wr, a.pnl, a.roi]; })
    ));
  }

  return out.join('\n');
}

function sec5_sportBreakdown(rows) {
  const out = ['\n---\n\n## 5. Sport Breakdown\n'];

  const sports = [...new Set(rows.map(r => r.sport))].sort();
  const headers = ['Sport', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg Inv', 'Avg Mult'];
  const data = sports.map(s => {
    const sub = rows.filter(r => r.sport === s);
    const a = agg(sub);
    return [s, a.n, pct(sub.length, rows.length), a.wr, a.pnl, a.roi, a.avgInv, a.avgMult];
  });
  out.push(mdTable(headers, data));

  // Sport × Market cross
  out.push('\n### Sport × Market Type\n');
  const markets = ['ML', 'SPREAD', 'TOTAL'];
  const crossHeaders = ['Sport', ...markets.map(m => `${m} (N/WR/ROI)`)];
  const crossData = sports.map(s => {
    const cells = markets.map(m => {
      const sub = rows.filter(r => r.sport === s && r.marketType === m);
      if (sub.length === 0) return '—';
      const a = agg(sub);
      return `${a.n} / ${a.wr} / ${a.roi}`;
    });
    return [s, ...cells];
  });
  out.push(mdTable(crossHeaders, crossData));

  return out.join('\n');
}

function sec6_convictionAnalysis(rows) {
  const out = ['\n---\n\n## 6. Conviction Analysis (Bet Multiplier)\n'];
  out.push('betMultiplier = invested / avgSportBet — measures how much larger this bet is vs the wallet\'s average.\n');

  const ranges = [
    { label: '< 1x (below avg)', lo: 0, hi: 1 },
    { label: '1x-2x (normal)', lo: 1, hi: 2 },
    { label: '2x-3x (elevated)', lo: 2, hi: 3 },
    { label: '3x-5x (high)', lo: 3, hi: 5 },
    { label: '5x-10x (very high)', lo: 5, hi: 10 },
    { label: '10x+ (extreme)', lo: 10, hi: Infinity },
  ];

  const buckets = bucketByRange(rows, 'betMultiplier', ranges);
  if (buckets.length > 0) {
    out.push(mdTable(
      ['Conviction Bucket', 'N', 'WR', 'P&L', 'ROI', 'Avg Inv'],
      buckets.map(b => [b.label, b.n, b.wr, b.pnl, b.roi, b.avgInv])
    ));
  }

  // Is conviction predictive?
  const valid = rows.filter(r => r.betMultiplier > 0);
  if (valid.length >= 10) {
    const rho = spearman(valid.map(r => r.betMultiplier), valid.map(r => r.won));
    out.push(`\n**Spearman: betMultiplier vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
    const verdict = rho != null && rho > 0.05 ? 'Conviction IS predictive — higher multiplier → better outcomes'
      : rho != null && rho < -0.05 ? 'Conviction is INVERSE — higher multiplier → worse outcomes'
      : 'Conviction is NEUTRAL — multiplier does not predict outcomes';
    out.push(`\n**Verdict**: ${verdict}`);
  }

  return out.join('\n');
}

function sec7_walletSkill(rows) {
  const out = ['\n---\n\n## 7. Wallet Skill Analysis\n'];
  out.push('Does a wallet\'s historical sportROI / sportPnlTotal predict position-level results?\n');

  // sportROI buckets
  const roiRanges = [
    { label: 'Negative ROI', lo: -Infinity, hi: 0 },
    { label: '0-2% ROI', lo: 0, hi: 2 },
    { label: '2-5% ROI', lo: 2, hi: 5 },
    { label: '5-10% ROI', lo: 5, hi: 10 },
    { label: '10%+ ROI', lo: 10, hi: Infinity },
  ];
  const roiBuckets = bucketByRange(rows.filter(r => r.sportROI !== 0), 'sportROI', roiRanges);
  if (roiBuckets.length > 0) {
    out.push('### By Wallet Sport ROI\n');
    out.push(mdTable(
      ['Wallet ROI Bucket', 'N', 'WR', 'P&L', 'ROI', 'Avg Mult'],
      roiBuckets.map(b => [b.label, b.n, b.wr, b.pnl, b.roi, b.avgMult])
    ));
  }

  // sportPnlTotal buckets
  const pnlValid = rows.filter(r => r.sportPnlTotal !== 0);
  if (pnlValid.length >= 10) {
    out.push('\n### By Wallet Sport P&L\n');
    const sorted = [...pnlValid].sort((a, b) => a.sportPnlTotal - b.sportPnlTotal);
    const q = Math.floor(sorted.length / 3);
    const terciles = [
      { label: 'Bottom Third', rows: sorted.slice(0, q) },
      { label: 'Middle Third', rows: sorted.slice(q, 2 * q) },
      { label: 'Top Third', rows: sorted.slice(2 * q) },
    ];
    out.push(mdTable(
      ['P&L Tier', 'N', 'WR', 'P&L', 'ROI', 'Avg Wallet P&L'],
      terciles.map(t => {
        const a = agg(t.rows);
        return [t.label, a.n, a.wr, a.pnl, a.roi, fmtDollar(Math.round(avg(t.rows.map(r => r.sportPnlTotal))))];
      })
    ));
  }

  // Spearman
  const valid = rows.filter(r => r.sportROI > 0);
  if (valid.length >= 10) {
    const rho = spearman(valid.map(r => r.sportROI), valid.map(r => r.won));
    out.push(`\n**Spearman: Wallet sportROI vs Position WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
  }

  return out.join('\n');
}

function sec8_entryPrice(rows) {
  const out = ['\n---\n\n## 8. Entry Price Calibration\n'];
  out.push('avgPrice is the Polymarket entry price (0-1). It should correlate with win rate.\n');

  const ranges = [
    { label: '0-20¢ (long shot)', lo: 0, hi: 0.20 },
    { label: '20-35¢ (underdog)', lo: 0.20, hi: 0.35 },
    { label: '35-50¢ (coin flip)', lo: 0.35, hi: 0.50 },
    { label: '50-65¢ (slight fav)', lo: 0.50, hi: 0.65 },
    { label: '65-80¢ (favorite)', lo: 0.65, hi: 0.80 },
    { label: '80-100¢ (heavy fav)', lo: 0.80, hi: 1.01 },
  ];

  const buckets = bucketByRange(rows, 'avgPrice', ranges);
  if (buckets.length > 0) {
    const headers = ['Price Bucket', 'N', 'Avg Price', 'Expected WR', 'Actual WR', 'WR Delta', 'P&L', 'ROI'];
    const data = buckets.map(b => {
      const sub = rows.filter(r => r.avgPrice >= ranges.find(rr => rr.label === b.label).lo && r.avgPrice < ranges.find(rr => rr.label === b.label).hi);
      const avgP = avg(sub.map(r => r.avgPrice));
      const actualWR = sub.filter(r => r.won).length / sub.length;
      const delta = actualWR - avgP;
      return [b.label, b.n, (avgP * 100).toFixed(1) + '¢', (avgP * 100).toFixed(1) + '%',
        (actualWR * 100).toFixed(1) + '%',
        (delta > 0 ? '+' : '') + (delta * 100).toFixed(1) + '%',
        b.pnl, b.roi];
    });
    out.push(mdTable(headers, data));

    // Brier score
    const brier = avg(rows.filter(r => r.avgPrice > 0).map(r => (r.won - r.avgPrice) ** 2));
    out.push(`\n**Brier Score**: ${brier.toFixed(4)} (lower = better calibration, random = 0.25)`);
  }

  return out.join('\n');
}

function sec9_positionSizing(rows) {
  const out = ['\n---\n\n## 9. Position Sizing Analysis\n'];

  const ranges = [
    { label: '< $100', lo: 0, hi: 100 },
    { label: '$100-$500', lo: 100, hi: 500 },
    { label: '$500-$1K', lo: 500, hi: 1000 },
    { label: '$1K-$5K', lo: 1000, hi: 5000 },
    { label: '$5K-$20K', lo: 5000, hi: 20000 },
    { label: '$20K-$50K', lo: 20000, hi: 50000 },
    { label: '$50K+', lo: 50000, hi: Infinity },
  ];

  const buckets = bucketByRange(rows, 'invested', ranges);
  if (buckets.length > 0) {
    out.push(mdTable(
      ['Size Bucket', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg Mult'],
      buckets.map(b => [b.label, b.n, pct(b.n, rows.length), b.wr, b.pnl, b.roi, b.avgMult])
    ));
  }

  // Is size predictive?
  if (rows.length >= 10) {
    const rho = spearman(rows.map(r => r.invested), rows.map(r => r.won));
    out.push(`\n**Spearman: Size vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
  }

  // Top 10% vs bottom 50% by size
  const sorted = [...rows].sort((a, b) => b.invested - a.invested);
  const top10 = sorted.slice(0, Math.ceil(sorted.length * 0.1));
  const bot50 = sorted.slice(Math.floor(sorted.length * 0.5));
  if (top10.length >= 3 && bot50.length >= 3) {
    const t = agg(top10);
    const b = agg(bot50);
    out.push(`\n**Top 10% by size**: ${t.n} positions, ${t.wr} WR, ${t.roi} ROI, ${t.pnl} P&L`);
    out.push(`**Bottom 50% by size**: ${b.n} positions, ${b.wr} WR, ${b.roi} ROI, ${b.pnl} P&L`);
  }

  return out.join('\n');
}

function sec10_pinnacleEdge(rows) {
  const out = ['\n---\n\n## 10. Pinnacle Edge Analysis (+EV)\n'];

  const hasEV = rows.filter(r => r.evEdge != null && r.evEdge > 0);
  const noEV = rows.filter(r => !r.evEdge || r.evEdge <= 0);

  if (hasEV.length === 0) {
    out.push('_No positions with +EV edge detected._');
    return out.join('\n');
  }

  const hA = agg(hasEV);
  const nA = agg(noEV);
  out.push(mdTable(
    ['Group', 'N', 'WR', 'P&L', 'ROI', 'Avg EV Edge'],
    [
      ['+EV Positions', hA.n, hA.wr, hA.pnl, hA.roi, avg(hasEV.map(r => r.evEdge)).toFixed(2) + '%'],
      ['Non-EV Positions', nA.n, nA.wr, nA.pnl, nA.roi, '—'],
    ]
  ));

  // EV edge size buckets
  if (hasEV.length >= 5) {
    out.push('\n### By EV Edge Size\n');
    const evRanges = [
      { label: '0.1-0.3%', lo: 0.1, hi: 0.3 },
      { label: '0.3-0.5%', lo: 0.3, hi: 0.5 },
      { label: '0.5-1.0%', lo: 0.5, hi: 1.0 },
      { label: '1.0%+', lo: 1.0, hi: Infinity },
    ];
    const evBuckets = bucketByRange(hasEV, 'evEdge', evRanges);
    if (evBuckets.length > 0) {
      out.push(mdTable(
        ['EV Edge', 'N', 'WR', 'P&L', 'ROI'],
        evBuckets.map(b => [b.label, b.n, b.wr, b.pnl, b.roi])
      ));
    }
  }

  // Best book breakdown
  const books = {};
  hasEV.forEach(r => { if (r.bestBook) books[r.bestBook] = (books[r.bestBook] || 0) + 1; });
  if (Object.keys(books).length > 0) {
    out.push('\n### Best Book Distribution\n');
    out.push(mdTable(
      ['Book', 'N', 'WR', 'ROI'],
      Object.entries(books).sort((a, b) => b[1] - a[1]).map(([bk, n]) => {
        const sub = hasEV.filter(r => r.bestBook === bk);
        const a = agg(sub);
        return [bk, a.n, a.wr, a.roi];
      })
    ));
  }

  return out.join('\n');
}

function sec11_polymarketPnl(rows) {
  const out = ['\n---\n\n## 11. Polymarket P&L Analysis\n'];
  out.push('Settled P&L from the actual Polymarket positions (entry price × size).\n');

  const totalSettled = rows.reduce((s, r) => s + r.settledPnl, 0);
  const totalInvested = rows.reduce((s, r) => s + r.invested, 0);
  const avgSettled = avg(rows.map(r => r.settledPnl));
  const medianSettled = median(rows.map(r => r.settledPnl));

  out.push(mdTable(
    ['Metric', 'Value'],
    [
      ['Total Settled P&L', fmtDollar(totalSettled)],
      ['Total Invested', fmtDollar(totalInvested)],
      ['Overall ROI', totalInvested > 0 ? (totalSettled / totalInvested * 100).toFixed(1) + '%' : '—'],
      ['Avg P&L per Position', fmtDollar(Math.round(avgSettled))],
      ['Median P&L per Position', fmtDollar(Math.round(medianSettled))],
      ['Win P&L (avg)', fmtDollar(Math.round(avg(rows.filter(r => r.won).map(r => r.settledPnl))))],
      ['Loss P&L (avg)', fmtDollar(Math.round(avg(rows.filter(r => !r.won).map(r => r.settledPnl))))],
      ['Biggest Win', fmtDollar(Math.max(...rows.map(r => r.settledPnl)))],
      ['Biggest Loss', fmtDollar(Math.min(...rows.map(r => r.settledPnl)))],
    ]
  ));

  return out.join('\n');
}

function sec12_walletConcentration(rows) {
  const out = ['\n---\n\n## 12. Wallet Concentration\n'];
  out.push('Which wallets are driving results? Too much concentration = fragile.\n');

  const walletMap = {};
  for (const r of rows) {
    if (!walletMap[r.walletShort]) walletMap[r.walletShort] = { positions: [], wallet: r.wallet, tier: r.tier };
    walletMap[r.walletShort].positions.push(r);
  }

  const walletStats = Object.entries(walletMap).map(([ws, data]) => {
    const a = agg(data.positions);
    return { walletShort: ws, tier: data.tier, ...a };
  }).sort((a, b) => b.n - a.n);

  // Top wallets by volume
  out.push('### Top 10 Wallets by Position Count\n');
  const topWallets = walletStats.slice(0, 10);
  out.push(mdTable(
    ['Wallet', 'Tier', 'Positions', 'WR', 'P&L', 'ROI', 'Avg Inv'],
    topWallets.map(w => [w.walletShort, w.tier, w.n, w.wr, w.pnl, w.roi, w.avgInv])
  ));

  // Concentration metrics
  const totalPositions = rows.length;
  const top5Pct = walletStats.slice(0, 5).reduce((s, w) => s + w.n, 0) / totalPositions;
  const singleWalletGames = Object.values(walletMap).filter(w => w.positions.length === 1).length;
  out.push(`\n**Top 5 wallets control**: ${(top5Pct * 100).toFixed(1)}% of all positions`);
  out.push(`**Single-position wallets**: ${singleWalletGames} of ${walletStats.length} (${pct(singleWalletGames, walletStats.length)})`);

  // Best/worst wallets (min 3 positions)
  const qualifiedWallets = walletStats.filter(w => w.n >= 3);
  if (qualifiedWallets.length >= 3) {
    const best = [...qualifiedWallets].sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi)).slice(0, 3);
    const worst = [...qualifiedWallets].sort((a, b) => parseFloat(a.roi) - parseFloat(b.roi)).slice(0, 3);
    out.push('\n### Best Wallets (≥3 positions)\n');
    out.push(mdTable(
      ['Wallet', 'N', 'WR', 'P&L', 'ROI'],
      best.map(w => [w.walletShort, w.n, w.wr, w.pnl, w.roi])
    ));
    out.push('\n### Worst Wallets (≥3 positions)\n');
    out.push(mdTable(
      ['Wallet', 'N', 'WR', 'P&L', 'ROI'],
      worst.map(w => [w.walletShort, w.n, w.wr, w.pnl, w.roi])
    ));
  }

  return out.join('\n');
}

function sec13_gameLevel(rows) {
  const out = ['\n---\n\n## 13. Game-Level Analysis\n'];
  out.push('How do games with multiple sharp positions perform vs single-position games?\n');

  const gameMap = {};
  for (const r of rows) {
    const gk = `${r.date}_${r.sport}_${r.gameKey}`;
    if (!gameMap[gk]) gameMap[gk] = [];
    gameMap[gk].push(r);
  }

  const gameStats = Object.entries(gameMap).map(([gk, positions]) => {
    const wallets = new Set(positions.map(p => p.wallet)).size;
    const sides = new Set(positions.map(p => `${p.marketType}_${p.side}`));
    const sameSide = sides.size === 1;
    return { gk, positions, wallets, sameSide };
  });

  const multiWallet = gameStats.filter(g => g.wallets > 1);
  const singleWallet = gameStats.filter(g => g.wallets === 1);

  const multiRows = multiWallet.flatMap(g => g.positions);
  const singleRows = singleWallet.flatMap(g => g.positions);

  out.push(mdTable(
    ['Category', 'Games', 'Positions', 'WR', 'P&L', 'ROI'],
    [
      multiRows.length > 0 ? ['Multi-wallet games', multiWallet.length, agg(multiRows).n, agg(multiRows).wr, agg(multiRows).pnl, agg(multiRows).roi] : null,
      singleRows.length > 0 ? ['Single-wallet games', singleWallet.length, agg(singleRows).n, agg(singleRows).wr, agg(singleRows).pnl, agg(singleRows).roi] : null,
    ].filter(Boolean)
  ));

  // Consensus games (all same side) vs conflicting (mixed sides within same game)
  const consensus = multiWallet.filter(g => g.sameSide);
  const conflicting = multiWallet.filter(g => !g.sameSide);
  if (consensus.length + conflicting.length >= 3) {
    const consRows = consensus.flatMap(g => g.positions);
    const confRows = conflicting.flatMap(g => g.positions);
    out.push('\n### Multi-Wallet Consensus vs Conflict\n');
    out.push(mdTable(
      ['Type', 'Games', 'Positions', 'WR', 'P&L', 'ROI'],
      [
        consRows.length > 0 ? ['Same-side consensus', consensus.length, agg(consRows).n, agg(consRows).wr, agg(consRows).pnl, agg(consRows).roi] : null,
        confRows.length > 0 ? ['Mixed sides (conflict)', conflicting.length, agg(confRows).n, agg(confRows).wr, agg(confRows).pnl, agg(confRows).roi] : null,
      ].filter(Boolean)
    ));
  }

  return out.join('\n');
}

function sec14_clvAnalysis(rows) {
  const out = ['\n---\n\n## 14. CLV Analysis\n'];

  const clvRows = rows.filter(r => r.clv != null);
  if (clvRows.length < 5) {
    out.push('_Insufficient CLV data (closing odds not captured for most positions)._');
    return out.join('\n');
  }

  const avgClv = avg(clvRows.map(r => r.clv));
  const posClv = clvRows.filter(r => r.clv > 0);
  const negClv = clvRows.filter(r => r.clv < 0);

  out.push(mdTable(
    ['Metric', 'Value'],
    [
      ['Positions with CLV data', clvRows.length],
      ['Average CLV', avgClv.toFixed(2) + '%'],
      ['Positive CLV rate', pct(posClv.length, clvRows.length)],
      ['Avg CLV (winners)', avg(clvRows.filter(r => r.won).map(r => r.clv)).toFixed(2) + '%'],
      ['Avg CLV (losers)', avg(clvRows.filter(r => !r.won).map(r => r.clv)).toFixed(2) + '%'],
    ]
  ));

  // CLV buckets
  const clvRanges = [
    { label: '< -2%', lo: -Infinity, hi: -2 },
    { label: '-2% to -0.5%', lo: -2, hi: -0.5 },
    { label: '-0.5% to +0.5%', lo: -0.5, hi: 0.5 },
    { label: '+0.5% to +2%', lo: 0.5, hi: 2 },
    { label: '> +2%', lo: 2, hi: Infinity },
  ];
  const clvBuckets = bucketByRange(clvRows, 'clv', clvRanges);
  if (clvBuckets.length > 0) {
    out.push('\n### CLV Buckets\n');
    out.push(mdTable(
      ['CLV Range', 'N', 'WR', 'P&L', 'ROI'],
      clvBuckets.map(b => [b.label, b.n, b.wr, b.pnl, b.roi])
    ));
  }

  return out.join('\n');
}

function sec15_timing(rows) {
  const out = ['\n---\n\n## 15. Time-of-Day / First Seen Analysis\n'];

  const timed = rows.filter(r => r.firstSeen);
  if (timed.length < 10) {
    out.push('_Insufficient firstSeen data._');
    return out.join('\n');
  }

  const hourBuckets = {};
  for (const r of timed) {
    const h = new Date(r.firstSeen).getUTCHours();
    const bucket = h < 6 ? 'Late Night (0-6 UTC)' : h < 12 ? 'Morning (6-12 UTC)' : h < 18 ? 'Afternoon (12-18 UTC)' : 'Evening (18-24 UTC)';
    if (!hourBuckets[bucket]) hourBuckets[bucket] = [];
    hourBuckets[bucket].push(r);
  }

  const headers = ['Time Window', 'N', 'WR', 'P&L', 'ROI', 'Avg Inv'];
  const data = Object.entries(hourBuckets).map(([bucket, sub]) => {
    const a = agg(sub);
    return [bucket, a.n, a.wr, a.pnl, a.roi, a.avgInv];
  });
  out.push(mdTable(headers, data));

  return out.join('\n');
}

function sec16_failureDiagnostics(rows) {
  const out = ['\n---\n\n## 16. Failure Diagnostics\n'];

  const findings = [];
  const a = agg(rows);
  const totalPnl = rows.reduce((s, r) => s + r.settledPnl, 0);
  const wr = rows.filter(r => r.won).length / rows.length;

  // Biggest P&L losers by category
  const sports = [...new Set(rows.map(r => r.sport))];
  for (const s of sports) {
    const sub = rows.filter(r => r.sport === s);
    const sA = agg(sub);
    if (sA.rawPnl < -10000) {
      findings.push(`**${s}**: ${fmtDollar(sA.rawPnl)} P&L (${sA.wr} WR, ${sA.roi} ROI)`);
    }
  }

  // High conviction losing
  const hc = rows.filter(r => r.label === 'HIGH_CONVICTION');
  if (hc.length >= 5) {
    const hcPnl = hc.reduce((s, r) => s + r.settledPnl, 0);
    if (hcPnl < -5000) {
      findings.push(`**HIGH_CONVICTION losing**: ${fmtDollar(hcPnl)} P&L across ${hc.length} positions`);
    }
  }

  // Large single positions driving losses
  const bigLosses = rows.filter(r => r.settledPnl < -10000).sort((a, b) => a.settledPnl - b.settledPnl);
  if (bigLosses.length > 0) {
    const bigLossPnl = bigLosses.reduce((s, r) => s + r.settledPnl, 0);
    findings.push(`**${bigLosses.length} positions lost >$10K each**: Combined ${fmtDollar(bigLossPnl)} (${pct(Math.abs(bigLossPnl), Math.abs(totalPnl))} of total losses)`);
  }

  // Negative ROI tiers
  const tiers = ['ELITE', 'PROVEN', 'SHARP'];
  for (const t of tiers) {
    const sub = rows.filter(r => r.tier === t);
    if (sub.length >= 5) {
      const tA = agg(sub);
      if (parseFloat(tA.roi) < -15) {
        findings.push(`**${t} tier underperforming**: ${tA.roi} ROI across ${tA.n} positions`);
      }
    }
  }

  if (findings.length === 0) {
    out.push('No major failure modes detected.\n');
  } else {
    for (const f of findings) out.push(`- ${f}`);
  }

  return out.join('\n');
}

function sec17_v8StarCalibration(rows) {
  const out = ['\n---\n\n## 17. V8 Star Calibration\n'];
  const v8Rows = rows.filter(r => r.v8_stars != null);
  if (v8Rows.length < 5) {
    out.push('_V8 scoring data not yet available on graded positions. Run write script to backfill._');
    return out.join('\n');
  }

  out.push(`${v8Rows.length} of ${rows.length} graded positions have V8 scoring.\n`);

  const starBuckets = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const headers = ['Stars', 'Label', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg WPS', 'Avg Inv'];
  const data = starBuckets.map(s => {
    const sub = v8Rows.filter(r => r.v8_stars === s);
    if (sub.length === 0) return null;
    const a = agg(sub);
    const avgWPS = avg(sub.map(r => r.v8_walletPlayScore)).toFixed(2);
    const lbl = sub[0]?.v8_starLabel || '—';
    return [s + '★', lbl, a.n, pct(sub.length, v8Rows.length), a.wr, a.pnl, a.roi, avgWPS, a.avgInv];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  // Are higher stars actually predicting better outcomes?
  if (v8Rows.length >= 10) {
    const rho = spearman(v8Rows.map(r => r.v8_stars), v8Rows.map(r => r.won));
    out.push(`\n**Spearman: V8 Stars vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
    if (rho != null) {
      out.push(rho > 0.1 ? '→ Higher stars predict better outcomes'
        : rho < -0.1 ? '→ WARNING: Higher stars predict WORSE outcomes'
        : '→ Stars are neutral — no predictive edge detected');
    }
  }

  // 3+ star vs sub-3 star
  const high = v8Rows.filter(r => r.v8_stars >= 3);
  const low = v8Rows.filter(r => r.v8_stars < 3);
  if (high.length >= 3 && low.length >= 3) {
    const hA = agg(high);
    const lA = agg(low);
    out.push(`\n**≥3★ positions**: ${hA.n} picks, ${hA.wr} WR, ${hA.roi} ROI, ${hA.pnl} P&L`);
    out.push(`**<3★ positions**: ${lA.n} picks, ${lA.wr} WR, ${lA.roi} ROI, ${lA.pnl} P&L`);
  }

  return out.join('\n');
}

function sec18_v8CoreVariables(rows) {
  const out = ['\n---\n\n## 18. V8 Core Variable Audit\n'];
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 5) {
    out.push('_Insufficient V8 data._');
    return out.join('\n');
  }

  out.push('Distribution of V8 scoring variables across all graded positions.\n');

  const vars = [
    { key: 'v8_walletPlayScore', label: 'WPS' },
    { key: 'v8_forSide', label: 'For Side' },
    { key: 'v8_againstSide', label: 'Against Side' },
    { key: 'v8_netEdge', label: 'Net Edge' },
    { key: 'v8_breadthBonus', label: 'Breadth Bonus' },
    { key: 'v8_concPenalty', label: 'Conc Penalty' },
    { key: 'v8_topShare', label: 'Top Share' },
    { key: 'v8_walletCountFor', label: 'Wallet Count For' },
    { key: 'v8_walletCountAgainst', label: 'Wallet Count Against' },
  ];

  const headers = ['Variable', 'Mean', 'Median', 'Std', 'Min', 'Max'];
  const data = vars.map(v => {
    const vals = v8Rows.map(r => r[v.key]).filter(x => x != null && isFinite(x));
    if (vals.length === 0) return null;
    return [v.label, avg(vals).toFixed(3), median(vals).toFixed(3), std(vals).toFixed(3), Math.min(...vals).toFixed(3), Math.max(...vals).toFixed(3)];
  }).filter(Boolean);
  out.push(mdTable(headers, data));

  // Per-wallet contribution variables
  const contribRows = v8Rows.filter(r => r.v8_walletContribution != null);
  if (contribRows.length >= 5) {
    out.push('\n### Per-Wallet Contribution Variables\n');
    const wVars = [
      { key: 'v8_walletContribution', label: 'Contribution' },
      { key: 'v8_walletRoiNorm', label: 'ROI Norm %ile' },
      { key: 'v8_walletPnlNorm', label: 'P&L Norm %ile' },
      { key: 'v8_walletBase', label: 'Wallet Base' },
      { key: 'v8_convictionMult', label: 'Conviction Mult' },
      { key: 'v8_sizeRatio', label: 'Size Ratio' },
    ];
    const wData = wVars.map(v => {
      const vals = contribRows.map(r => r[v.key]).filter(x => x != null && isFinite(x));
      if (vals.length === 0) return null;
      return [v.label, avg(vals).toFixed(2), median(vals).toFixed(2), std(vals).toFixed(2), Math.min(...vals).toFixed(2), Math.max(...vals).toFixed(2)];
    }).filter(Boolean);
    out.push(mdTable(headers, wData));
  }

  return out.join('\n');
}

function sec19_wpsBuckets(rows) {
  const out = ['\n---\n\n## 19. WPS Performance Buckets\n'];
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 5) {
    out.push('_Insufficient V8 data._');
    return out.join('\n');
  }

  out.push('How does WPS (Wallet Play Score) predict outcomes across ranges?\n');

  const ranges = [
    { label: '< -2 (very weak)', lo: -Infinity, hi: -2 },
    { label: '-2 to 0 (weak)', lo: -2, hi: 0 },
    { label: '0 to 2 (moderate)', lo: 0, hi: 2 },
    { label: '2 to 4 (solid)', lo: 2, hi: 4 },
    { label: '4 to 6 (strong)', lo: 4, hi: 6 },
    { label: '6+ (elite)', lo: 6, hi: Infinity },
  ];

  const buckets = ranges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_walletPlayScore >= lo && r.v8_walletPlayScore < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, pct(sub.length, v8Rows.length), a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_walletPlayScore)).toFixed(2)];
  }).filter(Boolean);
  out.push(mdTable(['WPS Range', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg WPS'], buckets));

  if (v8Rows.length >= 10) {
    const rho = spearman(v8Rows.map(r => r.v8_walletPlayScore), v8Rows.map(r => r.won));
    out.push(`\n**Spearman: WPS vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
  }

  return out.join('\n');
}

function sec20_walletContribCalibration(rows) {
  const out = ['\n---\n\n## 20. Per-Wallet Contribution Calibration\n'];
  const v8Rows = rows.filter(r => r.v8_walletContribution != null);
  if (v8Rows.length < 5) {
    out.push('_Insufficient contribution data._');
    return out.join('\n');
  }

  out.push('Does a wallet\'s V8 contribution score predict its individual position outcome?\n');

  const ranges = [
    { label: '< 20 (low)', lo: 0, hi: 20 },
    { label: '20-40 (moderate)', lo: 20, hi: 40 },
    { label: '40-60 (solid)', lo: 40, hi: 60 },
    { label: '60-80 (strong)', lo: 60, hi: 80 },
    { label: '80+ (elite)', lo: 80, hi: Infinity },
  ];

  const buckets = ranges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_walletContribution >= lo && r.v8_walletContribution < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_walletBase)).toFixed(1), avg(sub.map(r => r.v8_convictionMult)).toFixed(3)];
  }).filter(Boolean);
  out.push(mdTable(['Contribution', 'N', 'WR', 'P&L', 'ROI', 'Avg Base', 'Avg Conv Mult'], buckets));

  if (v8Rows.length >= 10) {
    const rho = spearman(v8Rows.map(r => r.v8_walletContribution), v8Rows.map(r => r.won));
    out.push(`\n**Spearman: Wallet Contribution vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
  }

  // ROI norm vs outcome
  const roiValid = v8Rows.filter(r => r.v8_walletRoiNorm != null);
  if (roiValid.length >= 10) {
    const rho = spearman(roiValid.map(r => r.v8_walletRoiNorm), roiValid.map(r => r.won));
    out.push(`**Spearman: ROI Norm vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
  }

  return out.join('\n');
}

function sec21_consensusVsContra(rows) {
  const out = ['\n---\n\n## 21. Consensus Side vs Contrarian\n'];
  const v8Rows = rows.filter(r => r.v8_consensusSide != null);
  if (v8Rows.length < 5) {
    out.push('_Insufficient V8 data._');
    return out.join('\n');
  }

  const onConsensus = v8Rows.filter(r => r.side === r.v8_consensusSide);
  const contrarian = v8Rows.filter(r => r.side !== r.v8_consensusSide);

  out.push('Positions on the V8 consensus side vs contrarian side.\n');
  out.push(mdTable(
    ['Side', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg WPS', 'Avg Inv'],
    [
      onConsensus.length > 0 ? ['Consensus', onConsensus.length, pct(onConsensus.length, v8Rows.length), agg(onConsensus).wr, agg(onConsensus).pnl, agg(onConsensus).roi, avg(onConsensus.map(r => r.v8_walletPlayScore)).toFixed(2), agg(onConsensus).avgInv] : null,
      contrarian.length > 0 ? ['Contrarian', contrarian.length, pct(contrarian.length, v8Rows.length), agg(contrarian).wr, agg(contrarian).pnl, agg(contrarian).roi, avg(contrarian.map(r => r.v8_walletPlayScore)).toFixed(2), agg(contrarian).avgInv] : null,
    ].filter(Boolean)
  ));

  return out.join('\n');
}

function fmtSpearman(rho) {
  if (rho == null || !isFinite(rho)) return '—';
  return (rho > 0 ? '+' : '') + rho.toFixed(3);
}

function sec22_predictiveRankings(rows) {
  const out = ['\n---\n\n## 22. Predictive Power Rankings (Quant-Grade)\n'];
  out.push(
    '**How to read this**: Win rate alone is confounded by `avgPrice` (favorites win often but pay fair odds). ' +
    'We rank every stored numeric field by Spearman ρ against three targets: **W** = settled win (1/0), ' +
    '**ROI** = `settledPnl / invested` (staked return), **Ex** = `won − avgPrice` (excess wins vs your Polymarket entry implied prob — crude per-bet edge vs price). ' +
    'Signals that lift **Ex** or **ROI** while being weak vs raw **W** are more meaningful for sizing V8.\n'
  );

  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  const vars = [
    { key: 'v8_walletPlayScore', label: 'WPS (game-level)' },
    { key: 'v8_stars', label: 'V8 Stars' },
    { key: 'v8_netEdge', label: 'Net Edge' },
    { key: 'v8_forSide', label: 'For Side' },
    { key: 'v8_againstSide', label: 'Against Side' },
    { key: 'v8_breadthBonus', label: 'Breadth Bonus' },
    { key: 'v8_concPenalty', label: 'Conc Penalty' },
    { key: 'v8_topShare', label: 'Top Share' },
    { key: 'v8_walletCountFor', label: 'Wallet Count For' },
    { key: 'v8_walletCountAgainst', label: 'Wallet Count Against' },
    { key: 'v8_walletContribution', label: 'Wallet Contribution' },
    { key: 'v8_walletRoiNorm', label: 'Wallet ROI Norm' },
    { key: 'v8_walletPnlNorm', label: 'Wallet P&L Norm' },
    { key: 'v8_walletRankNorm', label: 'Wallet Rank Norm' },
    { key: 'v8_walletBase', label: 'Wallet Base Score' },
    { key: 'v8_convictionMult', label: 'Conviction Mult' },
    { key: 'v8_sizeRatio', label: 'Size Ratio' },
    { key: 'betMultiplier', label: 'Bet Multiplier' },
    { key: 'sportROI', label: 'Wallet Sport ROI' },
    { key: 'sportPnlTotal', label: 'Wallet Sport P&L Total' },
    { key: 'sportVol', label: 'Sport Vol (raw)' },
    { key: 'logSportVol', label: 'log10(Sport Vol)' },
    { key: 'sportsLbPercentileTop', label: 'LB Percentile Top' },
    { key: 'leaderboardRank', label: 'Leaderboard Rank' },
    { key: 'avgSportBet', label: 'Avg Sport Bet' },
    { key: 'invested', label: 'Invested (stake)' },
    { key: 'size', label: 'Contracts (size)' },
    { key: 'avgPrice', label: 'Entry Price (implied p)' },
    { key: 'curPrice', label: 'Mark (curPrice) @ ingest' },
    { key: 'positionPnl', label: 'Position P&L @ ingest' },
    { key: 'currentValue', label: 'Current Value' },
    { key: 'hoursToGrade', label: 'Hours firstSeen → graded' },
    { key: 'pinnacleClosingImp', label: 'Pinnacle close implied (if odds)' },
  ];

  const fmtR = fmtSpearman;
  const results = [];
  for (const v of vars) {
    const pool = v.key.startsWith('v8_') ? v8Rows : rows;
    const valid = pool.filter(r => r[v.key] != null && isFinite(r[v.key]));
    if (valid.length < 12) continue;
    const xs = valid.map(r => r[v.key]);
    const won = valid.map(r => r.won);

    const rhoW = spearman(xs, won);
    const sameLenRoi = valid.filter(r => r.stakedRoi != null && isFinite(r.stakedRoi));
    const rhoRoi = sameLenRoi.length >= 12 ? spearman(sameLenRoi.map(r => r[v.key]), sameLenRoi.map(r => r.stakedRoi)) : null;
    const sameLenEx = valid.filter(r => r.beatEntryImplied != null && isFinite(r.beatEntryImplied));
    const rhoEx = sameLenEx.length >= 12 ? spearman(sameLenEx.map(r => r[v.key]), sameLenEx.map(r => r.beatEntryImplied)) : null;

    const score = Math.max(
      rhoW != null && isFinite(rhoW) ? Math.abs(rhoW) : 0,
      rhoRoi != null && isFinite(rhoRoi) ? Math.abs(rhoRoi) : 0,
      rhoEx != null && isFinite(rhoEx) ? Math.abs(rhoEx) : 0,
    );
    results.push({ label: v.label, rhoW, rhoRoi, rhoEx, n: valid.length, score });
  }

  const mtmLabels = new Set(['Mark (curPrice) @ ingest', 'Position P&L @ ingest', 'Current Value']);
  const exAnteRows = results.filter(r => !mtmLabels.has(r.label));
  out.push('### All numeric fields (includes MTM snapshots)\n');
  out.push(mdTable(
    ['Rank', 'Field', 'ρ vs W', 'ρ vs ROI', 'ρ vs (W−p)', 'N'],
    results.map((r, i) => [i + 1, r.label, fmtR(r.rhoW), fmtR(r.rhoRoi), fmtR(r.rhoEx), r.n]),
  ));

  out.push(
    '\n**Leakage / MTM warning**: High |ρ| on **curPrice**, **positionPnl**, **currentValue** usually means those fields were captured **late** (near settlement) and line up with how the bet finished. **Do not** treat them as ex-ante reasons to trust a *pending* pick. For live confidence, lean on wallet/V8 structure (WPS, net edge, opposition, conviction) and §37 strata.\n',
  );

  out.push('### Ex-ante stack only (wallet + V8 + sizing; no MTM)\n');
  const anteSorted = [...exAnteRows].sort((a, b) => b.score - a.score);
  out.push(mdTable(
    ['Rank', 'Field', 'ρ vs W', 'ρ vs ROI', 'ρ vs (W−p)', 'N'],
    anteSorted.map((r, i) => [i + 1, r.label, fmtR(r.rhoW), fmtR(r.rhoRoi), fmtR(r.rhoEx), r.n]),
  ));

  const byRoi = [...exAnteRows].filter(r => r.rhoRoi != null && isFinite(r.rhoRoi)).sort((a, b) => Math.abs(b.rhoRoi) - Math.abs(a.rhoRoi));
  const byEx = [...exAnteRows].filter(r => r.rhoEx != null && isFinite(r.rhoEx)).sort((a, b) => Math.abs(b.rhoEx) - Math.abs(a.rhoEx));
  if (byRoi.length >= 3) {
    out.push('\n**Strongest vs staked ROI (top 3 |ρ|)**: ' + byRoi.slice(0, 3).map(r => `${r.label} (${fmtR(r.rhoRoi)})`).join(', '));
  }
  if (byEx.length >= 3) {
    out.push('\n**Strongest vs excess over entry implied (top 3 |ρ|)**: ' + byEx.slice(0, 3).map(r => `${r.label} (${fmtR(r.rhoEx)})`).join(', '));
  }

  return out.join('\n');
}

function sec23_v8Interactions(rows) {
  const out = ['\n---\n\n## 23. V8 Variable Interactions\n'];
  out.push('How do combinations of V8 variables perform? Cross-cutting the key dimensions.\n');
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null && r.v8_walletContribution != null);
  if (v8Rows.length < 20) {
    out.push('_Insufficient V8 data for interaction analysis._');
    return out.join('\n');
  }

  // Stars × Market Type
  out.push('### Stars × Market Type\n');
  const markets = ['ML', 'SPREAD', 'TOTAL'];
  const starGroups = [{ label: '1-2★', lo: 0, hi: 2.5 }, { label: '2.5-3★', lo: 2.5, hi: 3.5 }, { label: '3.5-5★', lo: 3.5, hi: 6 }];
  const smHeaders = ['Star Range', ...markets.map(m => `${m} (N/WR/ROI)`)];
  const smData = starGroups.map(sg => {
    const cells = markets.map(m => {
      const sub = v8Rows.filter(r => r.v8_stars >= sg.lo && r.v8_stars < sg.hi && r.marketType === m);
      if (sub.length === 0) return '—';
      const a = agg(sub);
      return `${a.n} / ${a.wr} / ${a.roi}`;
    });
    return [sg.label, ...cells];
  });
  out.push(mdTable(smHeaders, smData));

  // Stars × Sport
  out.push('\n### Stars × Sport\n');
  const sports = [...new Set(v8Rows.map(r => r.sport))].sort();
  const ssHeaders = ['Star Range', ...sports.map(s => `${s} (N/WR/ROI)`)];
  const ssData = starGroups.map(sg => {
    const cells = sports.map(s => {
      const sub = v8Rows.filter(r => r.v8_stars >= sg.lo && r.v8_stars < sg.hi && r.sport === s);
      if (sub.length === 0) return '—';
      const a = agg(sub);
      return `${a.n} / ${a.wr} / ${a.roi}`;
    });
    return [sg.label, ...cells];
  });
  out.push(mdTable(ssHeaders, ssData));

  // Stars × Label
  out.push('\n### Stars × Label\n');
  const labels = [...new Set(v8Rows.map(r => r.label))].sort();
  const slHeaders = ['Star Range', ...labels.map(l => `${l} (N/WR/ROI)`)];
  const slData = starGroups.map(sg => {
    const cells = labels.map(l => {
      const sub = v8Rows.filter(r => r.v8_stars >= sg.lo && r.v8_stars < sg.hi && r.label === l);
      if (sub.length === 0) return '—';
      const a = agg(sub);
      return `${a.n} / ${a.wr} / ${a.roi}`;
    });
    return [sg.label, ...cells];
  });
  out.push(mdTable(slHeaders, slData));

  // Stars × Tier
  out.push('\n### Stars × Tier\n');
  const tiers = [...new Set(v8Rows.map(r => r.tier))].sort();
  const stHeaders = ['Star Range', ...tiers.map(t => `${t} (N/WR/ROI)`)];
  const stData = starGroups.map(sg => {
    const cells = tiers.map(t => {
      const sub = v8Rows.filter(r => r.v8_stars >= sg.lo && r.v8_stars < sg.hi && r.tier === t);
      if (sub.length === 0) return '—';
      const a = agg(sub);
      return `${a.n} / ${a.wr} / ${a.roi}`;
    });
    return [sg.label, ...cells];
  });
  out.push(mdTable(stHeaders, stData));

  return out.join('\n');
}

function sec24_wpsDecomposition(rows) {
  const out = ['\n---\n\n## 24. WPS Component Decomposition\n'];
  out.push('Which components of WPS actually drive predictive value? WPS = netEdge + breadthBonus - concPenalty.\n');
  const v8Rows = rows.filter(r => r.v8_netEdge != null);
  if (v8Rows.length < 10) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  // Net Edge buckets
  out.push('### Net Edge (forSide - 0.85×againstSide) / 100\n');
  const edgeRanges = [
    { label: '< 0 (opposing dominant)', lo: -Infinity, hi: 0 },
    { label: '0 to 0.5 (slight edge)', lo: 0, hi: 0.5 },
    { label: '0.5 to 1.5 (moderate)', lo: 0.5, hi: 1.5 },
    { label: '1.5 to 3 (strong)', lo: 1.5, hi: 3 },
    { label: '3+ (dominant)', lo: 3, hi: Infinity },
  ];
  const edgeBuckets = edgeRanges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_netEdge >= lo && r.v8_netEdge < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi];
  }).filter(Boolean);
  out.push(mdTable(['Net Edge', 'N', 'WR', 'P&L', 'ROI'], edgeBuckets));

  // Breadth Bonus (wallet count proxy)
  out.push('\n### Breadth Bonus (2 × ln(1 + walletCountFor))\n');
  const bbRanges = [
    { label: '< 1.5 (1 wallet)', lo: 0, hi: 1.5 },
    { label: '1.5-2.5 (2-3 wallets)', lo: 1.5, hi: 2.5 },
    { label: '2.5-3.5 (4-6 wallets)', lo: 2.5, hi: 3.5 },
    { label: '3.5+ (7+ wallets)', lo: 3.5, hi: Infinity },
  ];
  const bbBuckets = bbRanges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_breadthBonus >= lo && r.v8_breadthBonus < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_walletCountFor)).toFixed(1)];
  }).filter(Boolean);
  out.push(mdTable(['Breadth', 'N', 'WR', 'P&L', 'ROI', 'Avg Wallets'], bbBuckets));

  // Concentration Penalty
  out.push('\n### Concentration Penalty (concCoeff × topShare)\n');
  const cpRanges = [
    { label: '< 1.5 (diversified)', lo: 0, hi: 1.5 },
    { label: '1.5-2.5 (moderate)', lo: 1.5, hi: 2.5 },
    { label: '2.5-3.5 (concentrated)', lo: 2.5, hi: 3.5 },
    { label: '3.5+ (single-wallet dominated)', lo: 3.5, hi: Infinity },
  ];
  const cpBuckets = cpRanges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_concPenalty >= lo && r.v8_concPenalty < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_topShare)).toFixed(2)];
  }).filter(Boolean);
  out.push(mdTable(['Conc Penalty', 'N', 'WR', 'P&L', 'ROI', 'Avg TopShare'], cpBuckets));

  // Component-level Spearman
  out.push('\n### Component-level Predictive Power\n');
  const components = [
    { key: 'v8_netEdge', label: 'Net Edge' },
    { key: 'v8_breadthBonus', label: 'Breadth Bonus' },
    { key: 'v8_concPenalty', label: 'Conc Penalty' },
    { key: 'v8_forSide', label: 'For Side' },
    { key: 'v8_againstSide', label: 'Against Side' },
    { key: 'v8_topShare', label: 'Top Share' },
    { key: 'v8_walletCountFor', label: 'Wallet Count For' },
  ];
  const compResults = components.map(c => {
    const valid = v8Rows.filter(r => r[c.key] != null);
    const rho = spearman(valid.map(r => r[c.key]), valid.map(r => r.won));
    return [c.label, rho != null ? (rho > 0 ? '+' : '') + rho.toFixed(3) : '—'];
  });
  out.push(mdTable(['Component', 'ρ vs WR'], compResults));

  return out.join('\n');
}

function sec25_skillVsConviction(rows) {
  const out = ['\n---\n\n## 25. Wallet Skill vs Conviction\n'];
  out.push('Does skill (walletBase) or conviction (convictionMult/sizeRatio) matter more?\n');
  const v8Rows = rows.filter(r => r.v8_walletBase != null && r.v8_convictionMult != null);
  if (v8Rows.length < 20) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  const medBase = median(v8Rows.map(r => r.v8_walletBase));
  const medConv = median(v8Rows.map(r => r.v8_convictionMult));

  const quadrants = [
    { label: 'High Skill + High Conv', filter: r => r.v8_walletBase >= medBase && r.v8_convictionMult >= medConv },
    { label: 'High Skill + Low Conv', filter: r => r.v8_walletBase >= medBase && r.v8_convictionMult < medConv },
    { label: 'Low Skill + High Conv', filter: r => r.v8_walletBase < medBase && r.v8_convictionMult >= medConv },
    { label: 'Low Skill + Low Conv', filter: r => r.v8_walletBase < medBase && r.v8_convictionMult < medConv },
  ];

  out.push(`Median walletBase: ${medBase.toFixed(1)} | Median convictionMult: ${medConv.toFixed(3)}\n`);
  const data = quadrants.map(q => {
    const sub = v8Rows.filter(q.filter);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [q.label, a.n, pct(sub.length, v8Rows.length), a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_walletBase)).toFixed(1), avg(sub.map(r => r.v8_convictionMult)).toFixed(3)];
  }).filter(Boolean);
  out.push(mdTable(['Quadrant', 'N', '%', 'WR', 'P&L', 'ROI', 'Avg Base', 'Avg Conv'], data));

  // Verdict
  const highSkill = v8Rows.filter(r => r.v8_walletBase >= medBase);
  const highConv = v8Rows.filter(r => r.v8_convictionMult >= medConv);
  const hsWR = highSkill.filter(r => r.won).length / highSkill.length;
  const hcWR = highConv.filter(r => r.won).length / highConv.length;
  out.push(`\n**High Skill WR**: ${(hsWR * 100).toFixed(1)}% | **High Conviction WR**: ${(hcWR * 100).toFixed(1)}%`);
  out.push(`**Verdict**: ${hsWR > hcWR + 0.03 ? 'Skill matters more than conviction' : hcWR > hsWR + 0.03 ? 'Conviction matters more than skill' : 'Skill and conviction contribute equally'}`);

  return out.join('\n');
}

function sec26_multiFactorConditions(rows) {
  const out = ['\n---\n\n## 26. Multi-Factor Conditions\n'];
  out.push('Testing specific condition combinations that might identify edge.\n');
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 20) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  const conditions = [
    { label: '≥3★ + ELITE tier', filter: r => r.v8_stars >= 3 && r.tier === 'ELITE' },
    { label: '≥3★ + HIGH_CONVICTION', filter: r => r.v8_stars >= 3 && r.label === 'HIGH_CONVICTION' },
    { label: '≥3★ + consensus side', filter: r => r.v8_stars >= 3 && r.side === r.v8_consensusSide },
    { label: '≥3★ + no opposition (against=0)', filter: r => r.v8_stars >= 3 && (r.v8_againstSide === 0 || r.v8_walletCountAgainst === 0) },
    { label: '≥3★ + 3+ wallets for', filter: r => r.v8_stars >= 3 && r.v8_walletCountFor >= 3 },
    { label: '≥3★ + walletBase ≥ 50', filter: r => r.v8_stars >= 3 && r.v8_walletBase >= 50 },
    { label: 'WPS > 2 + ELITE tier', filter: r => r.v8_walletPlayScore > 2 && r.tier === 'ELITE' },
    { label: 'WPS > 2 + betMult ≥ 3', filter: r => r.v8_walletPlayScore > 2 && r.betMultiplier >= 3 },
    { label: 'Consensus + topShare < 0.5', filter: r => r.side === r.v8_consensusSide && r.v8_topShare < 0.5 },
    { label: 'Consensus + 4+ wallets + no opp', filter: r => r.side === r.v8_consensusSide && r.v8_walletCountFor >= 4 && r.v8_walletCountAgainst === 0 },
    { label: 'Low conc (penalty < 2) + positive edge', filter: r => r.v8_concPenalty < 2 && r.v8_netEdge > 0 },
    { label: 'Contrarian + walletBase ≥ 60', filter: r => r.side !== r.v8_consensusSide && r.v8_walletBase >= 60 },
    { label: '1-2★ + LOW invested (< $5K)', filter: r => r.v8_stars <= 2 && r.invested < 5000 },
    { label: 'Favorite (price ≥ 60¢) + ≥3★', filter: r => r.avgPrice >= 0.60 && r.v8_stars >= 3 },
    { label: 'Underdog (price < 40¢) + ≥3★', filter: r => r.avgPrice < 0.40 && r.v8_stars >= 3 },
  ];

  const overall = agg(rows);
  const headers = ['Condition', 'N', '%', 'WR', 'P&L', 'ROI', 'vs Overall'];
  const data = conditions.map(c => {
    const sub = v8Rows.filter(c.filter);
    if (sub.length < 3) return null;
    const a = agg(sub);
    const wrNum = parseFloat(a.wr) || 0;
    const overallWR = parseFloat(overall.wr) || 0;
    const delta = wrNum - overallWR;
    return [c.label, a.n, pct(sub.length, v8Rows.length), a.wr, a.pnl, a.roi,
      (delta > 0 ? '+' : '') + delta.toFixed(1) + '% WR'];
  }).filter(Boolean);

  data.sort((a, b) => {
    const roiA = parseFloat(a[5]) || -999;
    const roiB = parseFloat(b[5]) || -999;
    return roiB - roiA;
  });
  out.push(mdTable(headers, data));

  // Best conditions
  const profitable = data.filter(d => parseFloat(d[5]) > 0);
  if (profitable.length > 0) {
    out.push(`\n**Profitable conditions**: ${profitable.length} of ${data.length}`);
    out.push(`**Best condition**: ${profitable[0][0]} — ${profitable[0][3]} WR, ${profitable[0][5]} ROI`);
  }

  return out.join('\n');
}

function sec27_oppositionAnalysis(rows) {
  const out = ['\n---\n\n## 27. Opposition Analysis\n'];
  out.push('How does the strength/presence of opposing sharps affect outcomes?\n');
  const v8Rows = rows.filter(r => r.v8_walletCountAgainst != null && r.side === r.v8_consensusSide);
  if (v8Rows.length < 10) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  const oppRanges = [
    { label: 'No opposition (0)', lo: 0, hi: 1 },
    { label: 'Light opposition (1)', lo: 1, hi: 2 },
    { label: 'Moderate opposition (2-3)', lo: 2, hi: 4 },
    { label: 'Heavy opposition (4+)', lo: 4, hi: Infinity },
  ];

  const data = oppRanges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_walletCountAgainst >= lo && r.v8_walletCountAgainst < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_walletPlayScore)).toFixed(2)];
  }).filter(Boolean);
  out.push(mdTable(['Opposition', 'N', 'WR', 'P&L', 'ROI', 'Avg WPS'], data));

  // Against side strength (for consensus positions)
  out.push('\n### Against Side Strength\n');
  const asRanges = [
    { label: 'No against (0)', lo: 0, hi: 0.01 },
    { label: 'Weak against (0-50)', lo: 0.01, hi: 50 },
    { label: 'Moderate against (50-150)', lo: 50, hi: 150 },
    { label: 'Strong against (150+)', lo: 150, hi: Infinity },
  ];
  const asData = asRanges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_againstSide >= lo && r.v8_againstSide < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi];
  }).filter(Boolean);
  out.push(mdTable(['Against Strength', 'N', 'WR', 'P&L', 'ROI'], asData));

  return out.join('\n');
}

function sec28_topShareAnalysis(rows) {
  const out = ['\n---\n\n## 28. Top Share & Diversification\n'];
  out.push('topShare = maxContribution / forSide — lower = more diversified consensus.\n');
  const v8Rows = rows.filter(r => r.v8_topShare != null && r.side === r.v8_consensusSide);
  if (v8Rows.length < 10) {
    out.push('_Insufficient data._');
    return out.join('\n');
  }

  const tsRanges = [
    { label: '< 30% (highly diversified)', lo: 0, hi: 0.30 },
    { label: '30-50% (moderate)', lo: 0.30, hi: 0.50 },
    { label: '50-75% (concentrated)', lo: 0.50, hi: 0.75 },
    { label: '75-100% (single dominant)', lo: 0.75, hi: 1.01 },
  ];

  const data = tsRanges.map(({ label, lo, hi }) => {
    const sub = v8Rows.filter(r => r.v8_topShare >= lo && r.v8_topShare < hi);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [label, a.n, a.wr, a.pnl, a.roi, avg(sub.map(r => r.v8_walletCountFor)).toFixed(1)];
  }).filter(Boolean);
  out.push(mdTable(['Top Share', 'N', 'WR', 'P&L', 'ROI', 'Avg Wallets'], data));

  if (v8Rows.length >= 10) {
    const rho = spearman(v8Rows.map(r => r.v8_topShare), v8Rows.map(r => r.won));
    out.push(`\n**Spearman: Top Share vs WR**: ${rho != null ? rho.toFixed(3) : '—'}`);
    out.push(rho != null && rho < -0.05 ? '→ Lower top share (more diversified) = better outcomes'
      : rho != null && rho > 0.05 ? '→ Higher top share (concentrated) = better outcomes'
      : '→ Top share does not predict outcomes');
  }

  return out.join('\n');
}

function sec29_optimalThresholds(rows) {
  const out = ['\n---\n\n## 29. Optimal Threshold Discovery\n'];
  out.push(
    'Single-variable scan for **WR lift** vs global baseline. **`avgPrice` is excluded**: high entry mechanically raises win rate without proving edge (see §22 ROI / W−p and §37 strata).\n',
  );
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  const baseWR = rows.filter(r => r.won).length / rows.length;
  if (v8Rows.length < 20) { out.push('_Insufficient data._'); return out.join('\n'); }

  const scanVar = (key, label, values, direction) => {
    const sorted = [...new Set(values)].sort((a, b) => a - b);
    let bestThresh = null, bestWR = baseWR, bestN = 0, bestLift = 0;
    for (let i = Math.floor(sorted.length * 0.1); i < Math.floor(sorted.length * 0.9); i++) {
      const thresh = sorted[i];
      const sub = direction === '≥'
        ? v8Rows.filter(r => r[key] != null && r[key] >= thresh)
        : v8Rows.filter(r => r[key] != null && r[key] <= thresh);
      if (sub.length < 5 || sub.length > v8Rows.length * 0.9) continue;
      const wr = sub.filter(r => r.won).length / sub.length;
      const lift = wr - baseWR;
      if (lift > bestLift) { bestLift = lift; bestWR = wr; bestThresh = thresh; bestN = sub.length; }
    }
    return bestThresh != null
      ? { label, direction, threshold: bestThresh, wr: bestWR, n: bestN, lift: bestLift }
      : null;
  };

  const candidates = [
    { key: 'v8_walletPlayScore', label: 'WPS', dir: '≥' },
    { key: 'v8_stars', label: 'V8 Stars', dir: '≥' },
    { key: 'v8_netEdge', label: 'Net Edge', dir: '≥' },
    { key: 'v8_forSide', label: 'For Side', dir: '≥' },
    { key: 'v8_againstSide', label: 'Against Side', dir: '≤' },
    { key: 'v8_walletCountFor', label: 'Wallet Count For', dir: '≥' },
    { key: 'v8_walletCountAgainst', label: 'Wallet Count Agst', dir: '≤' },
    { key: 'v8_concPenalty', label: 'Conc Penalty', dir: '≤' },
    { key: 'v8_topShare', label: 'Top Share', dir: '≤' },
    { key: 'v8_walletContribution', label: 'Wallet Contribution', dir: '≥' },
    { key: 'v8_walletBase', label: 'Wallet Base', dir: '≥' },
    { key: 'v8_walletRoiNorm', label: 'ROI Norm', dir: '≥' },
    { key: 'v8_convictionMult', label: 'Conviction Mult', dir: '≥' },
    { key: 'invested', label: 'Position Size', dir: '≥' },
    { key: 'betMultiplier', label: 'Bet Multiplier', dir: '≥' },
    { key: 'sportROI', label: 'Wallet Sport ROI', dir: '≥' },
  ];

  const results = candidates.map(c => {
    const vals = v8Rows.map(r => r[c.key]).filter(x => x != null && isFinite(x));
    if (vals.length < 20) return null;
    return scanVar(c.key, c.label, vals, c.dir);
  }).filter(Boolean).sort((a, b) => b.lift - a.lift);

  out.push(`**Baseline WR**: ${(baseWR * 100).toFixed(1)}%\n`);
  out.push(mdTable(
    ['Variable', 'Direction', 'Optimal Threshold', 'WR at Threshold', 'N', 'WR Lift'],
    results.map(r => [r.label, r.direction, typeof r.threshold === 'number' ? r.threshold.toFixed(2) : r.threshold, (r.wr * 100).toFixed(1) + '%', r.n, '+' + (r.lift * 100).toFixed(1) + '%'])
  ));

  if (results.length >= 3) {
    out.push(`\n**Top 3 single-variable filters for WR lift**:`);
    for (const r of results.slice(0, 3)) {
      out.push(`- **${r.label} ${r.direction} ${typeof r.threshold === 'number' ? r.threshold.toFixed(2) : r.threshold}**: ${(r.wr * 100).toFixed(1)}% WR (+${(r.lift * 100).toFixed(1)}% lift, N=${r.n})`);
    }
  }

  return out.join('\n');
}

function sec30_featureImportance(rows) {
  const out = ['\n---\n\n## 30. Feature Importance (Information Gain)\n'];
  out.push(
    'Which variables reduce **win/loss entropy** most at a median split? (Still a binary target — pair with §22 for ROI-driven signal. **`avgPrice` omitted** as a trivial WR driver.)\n',
  );
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 20) { out.push('_Insufficient data._'); return out.join('\n'); }

  const entropy = (arr) => {
    if (arr.length === 0) return 0;
    const p = arr.filter(r => r.won).length / arr.length;
    if (p === 0 || p === 1) return 0;
    return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  };

  const baseEntropy = entropy(v8Rows);
  const features = [
    'v8_walletPlayScore', 'v8_stars', 'v8_netEdge', 'v8_forSide', 'v8_againstSide',
    'v8_breadthBonus', 'v8_concPenalty', 'v8_topShare', 'v8_walletCountFor',
    'v8_walletCountAgainst', 'v8_walletContribution', 'v8_walletRoiNorm',
    'v8_walletPnlNorm', 'v8_walletBase', 'v8_convictionMult', 'v8_sizeRatio',
    'invested', 'betMultiplier', 'sportROI',
  ];
  const labels = {
    v8_walletPlayScore: 'WPS', v8_stars: 'Stars', v8_netEdge: 'Net Edge',
    v8_forSide: 'For Side', v8_againstSide: 'Against Side', v8_breadthBonus: 'Breadth',
    v8_concPenalty: 'Conc Penalty', v8_topShare: 'Top Share', v8_walletCountFor: 'Wallets For',
    v8_walletCountAgainst: 'Wallets Agst', v8_walletContribution: 'Contribution',
    v8_walletRoiNorm: 'ROI Norm', v8_walletPnlNorm: 'PnL Norm', v8_walletBase: 'Wallet Base',
    v8_convictionMult: 'Conv Mult', v8_sizeRatio: 'Size Ratio',
    invested: 'Position Size', betMultiplier: 'Bet Mult', sportROI: 'Sport ROI',
  };

  const gains = features.map(f => {
    const valid = v8Rows.filter(r => r[f] != null && isFinite(r[f]));
    if (valid.length < 20) return null;
    const med = median(valid.map(r => r[f]));
    const lo = valid.filter(r => r[f] < med);
    const hi = valid.filter(r => r[f] >= med);
    if (lo.length < 5 || hi.length < 5) return null;
    const weightedEntropy = (lo.length / valid.length) * entropy(lo) + (hi.length / valid.length) * entropy(hi);
    const gain = baseEntropy - weightedEntropy;
    const loWR = lo.filter(r => r.won).length / lo.length;
    const hiWR = hi.filter(r => r.won).length / hi.length;
    return { feature: labels[f] || f, gain, median: med, loWR, hiWR, loN: lo.length, hiN: hi.length };
  }).filter(Boolean).sort((a, b) => b.gain - a.gain);

  out.push(`**Base entropy**: ${baseEntropy.toFixed(4)}\n`);
  out.push(mdTable(
    ['Rank', 'Feature', 'Info Gain', 'Median Split', 'Below WR', 'Above WR', 'WR Spread'],
    gains.map((g, i) => [
      i + 1, g.feature, g.gain.toFixed(4), typeof g.median === 'number' ? g.median.toFixed(2) : g.median,
      (g.loWR * 100).toFixed(1) + '% (N=' + g.loN + ')',
      (g.hiWR * 100).toFixed(1) + '% (N=' + g.hiN + ')',
      (g.hiWR > g.loWR ? '+' : '') + ((g.hiWR - g.loWR) * 100).toFixed(1) + '%',
    ])
  ));

  return out.join('\n');
}

function sec31_decisionRules(rows) {
  const out = ['\n---\n\n## 31. Decision Rules (Best Filters for V8)\n'];
  out.push('Systematic scan of 2-variable AND conditions. Minimum 5 positions per rule.\n');
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null && r.v8_walletContribution != null);
  if (v8Rows.length < 20) { out.push('_Insufficient data._'); return out.join('\n'); }

  const baseWR = rows.filter(r => r.won).length / rows.length;

  const filters = [
    { label: 'WPS ≥ 3', f: r => r.v8_walletPlayScore >= 3 },
    { label: 'WPS ≥ 5', f: r => r.v8_walletPlayScore >= 5 },
    { label: 'Stars ≥ 3', f: r => r.v8_stars >= 3 },
    { label: 'Stars ≥ 4', f: r => r.v8_stars >= 4 },
    { label: 'Net Edge > 1', f: r => r.v8_netEdge > 1 },
    { label: 'Net Edge > 2', f: r => r.v8_netEdge > 2 },
    { label: 'No opposition', f: r => r.v8_walletCountAgainst === 0 },
    { label: '3+ wallets for', f: r => r.v8_walletCountFor >= 3 },
    { label: '5+ wallets for', f: r => r.v8_walletCountFor >= 5 },
    { label: 'Consensus side', f: r => r.side === r.v8_consensusSide },
    { label: 'Conc penalty < 2.5', f: r => r.v8_concPenalty < 2.5 },
    { label: 'TopShare < 0.5', f: r => r.v8_topShare < 0.5 },
    { label: 'WalletBase ≥ 50', f: r => r.v8_walletBase >= 50 },
    { label: 'WalletBase ≥ 40', f: r => r.v8_walletBase >= 40 },
    { label: 'Entry price ≥ 50¢', f: r => r.avgPrice >= 0.50 },
    { label: 'Entry price ≥ 60¢', f: r => r.avgPrice >= 0.60 },
    { label: 'ELITE tier', f: r => r.tier === 'ELITE' },
    { label: 'Bet mult ≥ 2', f: r => r.betMultiplier >= 2 },
    { label: 'ForSide > 100', f: r => r.v8_forSide > 100 },
    { label: 'AgainstSide < 50', f: r => r.v8_againstSide < 50 },
    { label: 'Sport ROI ≥ 5%', f: r => r.sportROI >= 5 },
  ];

  const rules = [];
  for (let i = 0; i < filters.length; i++) {
    for (let j = i + 1; j < filters.length; j++) {
      const sub = v8Rows.filter(r => filters[i].f(r) && filters[j].f(r));
      if (sub.length < 5) continue;
      const wr = sub.filter(r => r.won).length / sub.length;
      const lift = wr - baseWR;
      const a = agg(sub);
      rules.push({ rule: `${filters[i].label} + ${filters[j].label}`, n: sub.length, wr, lift, roi: a.roi, pnl: a.pnl });
    }
  }

  rules.sort((a, b) => b.lift - a.lift);
  const top = rules.slice(0, 20);

  out.push(mdTable(
    ['Rule (A + B)', 'N', 'WR', 'WR Lift', 'ROI', 'P&L'],
    top.map(r => [r.rule, r.n, (r.wr * 100).toFixed(1) + '%', '+' + (r.lift * 100).toFixed(1) + '%', r.roi, r.pnl])
  ));

  // Bottom 10 (worst filters)
  out.push('\n### Worst 2-Variable Conditions (avoid these)\n');
  const bottom = rules.filter(r => r.n >= 5).sort((a, b) => a.wr - b.wr).slice(0, 10);
  out.push(mdTable(
    ['Rule (A + B)', 'N', 'WR', 'WR vs Base', 'ROI'],
    bottom.map(r => [r.rule, r.n, (r.wr * 100).toFixed(1) + '%', (r.lift > 0 ? '+' : '') + (r.lift * 100).toFixed(1) + '%', r.roi])
  ));

  return out.join('\n');
}

function sec32_wpsFormulaAudit(rows) {
  const out = ['\n---\n\n## 32. WPS Formula Audit\n'];
  out.push('Testing whether the current V8 formula weights are optimal.\n');
  out.push('Current: WPS = netEdge + breadthBonus - concPenalty\n');
  out.push('Current walletBase: 0.60×roiNorm + 0.25×rankNorm + 0.15×pnlNorm (ranked) or 0.65×roiNorm + 0.35×pnlNorm (unranked)\n');

  const v8Rows = rows.filter(r => r.v8_netEdge != null && r.v8_breadthBonus != null && r.v8_concPenalty != null);
  if (v8Rows.length < 20) { out.push('_Insufficient data._'); return out.join('\n'); }

  // Test: what if we change the against-side discount?
  out.push('\n### Against-Side Discount Sensitivity\n');
  out.push('Current discount = 0.85. What if we used different values?\n');
  const discounts = [0.50, 0.65, 0.75, 0.85, 1.00, 1.25, 1.50];
  const discData = discounts.map(d => {
    const adjusted = v8Rows.map(r => {
      const adjEdge = (r.v8_forSide - d * r.v8_againstSide) / 100;
      const adjWPS = adjEdge + r.v8_breadthBonus - r.v8_concPenalty;
      return { ...r, adjWPS };
    });
    const aboveMedian = adjusted.filter(r => r.adjWPS >= median(adjusted.map(x => x.adjWPS)));
    const wr = aboveMedian.filter(r => r.won).length / aboveMedian.length;
    const rho = spearman(adjusted.map(r => r.adjWPS), adjusted.map(r => r.won));
    return [d.toFixed(2) + (d === 0.85 ? ' ★current' : ''), (wr * 100).toFixed(1) + '%', rho != null ? rho.toFixed(3) : '—', aboveMedian.length];
  });
  out.push(mdTable(['Discount', 'Above-Median WR', 'ρ vs WR', 'N'], discData));

  // Test: what if we change the concPenalty coefficient?
  out.push('\n### Concentration Penalty Coefficient Sensitivity\n');
  out.push('Current: 4× (≤2 wallets) or 5× (3+ wallets). Test alternatives.\n');
  const concCoeffs = [2, 3, 4, 5, 6, 7, 8];
  const concData = concCoeffs.map(c => {
    const adjusted = v8Rows.map(r => {
      const adjConc = c * r.v8_topShare;
      const adjWPS = r.v8_netEdge + r.v8_breadthBonus - adjConc;
      return { ...r, adjWPS };
    });
    const rho = spearman(adjusted.map(r => r.adjWPS), adjusted.map(r => r.won));
    return [c + 'x' + (c === 4 || c === 5 ? ' ★current' : ''), rho != null ? rho.toFixed(3) : '—'];
  });
  out.push(mdTable(['Coeff', 'ρ vs WR'], concData));

  // Test: what if we change breadthBonus multiplier?
  out.push('\n### Breadth Bonus Multiplier Sensitivity\n');
  out.push('Current: 2 × ln(1 + walletCountFor). Test alternatives.\n');
  const breadthMults = [1, 1.5, 2, 2.5, 3, 4];
  const breadthData = breadthMults.map(m => {
    const adjusted = v8Rows.map(r => {
      const adjBreadth = m * Math.log(1 + r.v8_walletCountFor);
      const adjWPS = r.v8_netEdge + adjBreadth - r.v8_concPenalty;
      return { ...r, adjWPS };
    });
    const rho = spearman(adjusted.map(r => r.adjWPS), adjusted.map(r => r.won));
    return [m + 'x' + (m === 2 ? ' ★current' : ''), rho != null ? rho.toFixed(3) : '—'];
  });
  out.push(mdTable(['Multiplier', 'ρ vs WR'], breadthData));

  // walletBase weight sensitivity
  out.push('\n### Wallet Base Weight Sensitivity (ROI vs PnL)\n');
  out.push('Current unranked: 0.65×roiNorm + 0.35×pnlNorm. What if we shifted weight?\n');
  const wbValid = v8Rows.filter(r => r.v8_walletRoiNorm != null && r.v8_walletPnlNorm != null);
  if (wbValid.length >= 20) {
    const wbWeights = [[0.50, 0.50], [0.60, 0.40], [0.65, 0.35], [0.70, 0.30], [0.80, 0.20], [0.90, 0.10], [1.00, 0.00]];
    const wbData = wbWeights.map(([rW, pW]) => {
      const adjusted = wbValid.map(r => {
        const adjBase = rW * r.v8_walletRoiNorm + pW * r.v8_walletPnlNorm;
        return { ...r, adjBase };
      });
      const rho = spearman(adjusted.map(r => r.adjBase), adjusted.map(r => r.won));
      return [`${(rW * 100).toFixed(0)}% ROI / ${(pW * 100).toFixed(0)}% PnL` + (rW === 0.65 ? ' ★current' : ''), rho != null ? rho.toFixed(3) : '—'];
    });
    out.push(mdTable(['Weight Split', 'ρ vs WR'], wbData));
  }

  return out.join('\n');
}

function sec33_backtestSimulations(rows) {
  const out = ['\n---\n\n## 33. Backtest Simulations\n'];
  out.push('If we only bet positions matching a filter, what would our track record look like?\n');
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 20) { out.push('_Insufficient data._'); return out.join('\n'); }

  const baseA = agg(rows);

  const strategies = [
    { label: 'ALL positions (no filter)', filter: () => true },
    { label: '≥3★ only', filter: r => r.v8_stars >= 3 },
    { label: '≥4★ only', filter: r => r.v8_stars >= 4 },
    { label: 'WPS > 0 only', filter: r => r.v8_walletPlayScore > 0 },
    { label: 'WPS > 2 only', filter: r => r.v8_walletPlayScore > 2 },
    { label: 'No opposition only', filter: r => r.v8_walletCountAgainst === 0 },
    { label: 'Consensus + no opposition', filter: r => r.side === r.v8_consensusSide && r.v8_walletCountAgainst === 0 },
    { label: 'Entry ≥ 50¢ (favorites)', filter: r => r.avgPrice >= 0.50 },
    { label: 'Entry ≥ 60¢ (strong favs)', filter: r => r.avgPrice >= 0.60 },
    { label: 'WalletBase ≥ 50', filter: r => r.v8_walletBase >= 50 },
    { label: 'ELITE + ≥3★', filter: r => r.tier === 'ELITE' && r.v8_stars >= 3 },
    { label: 'Net Edge > 1 + No opp', filter: r => r.v8_netEdge > 1 && r.v8_walletCountAgainst === 0 },
    { label: 'Contrarian positions only', filter: r => r.side !== r.v8_consensusSide },
    { label: 'HIGH_CONVICTION only', filter: r => r.label === 'HIGH_CONVICTION' },
    { label: 'MLB only', filter: r => r.sport === 'MLB' },
    { label: 'NHL only', filter: r => r.sport === 'NHL' },
    { label: 'Bet mult ≥ 3', filter: r => r.betMultiplier >= 3 },
    { label: '1-wallet games only', filter: r => r.v8_walletCountFor <= 1 },
  ];

  const headers = ['Strategy', 'N', '%Pool', 'WR', 'P&L', 'ROI', 'Avg Inv', 'WR Lift', 'Sharpe'];
  const data = strategies.map(s => {
    const sub = v8Rows.filter(s.filter);
    if (sub.length < 3) return null;
    const a = agg(sub);
    const wrNum = sub.filter(r => r.won).length / sub.length;
    const lift = wrNum - (rows.filter(r => r.won).length / rows.length);
    const pnls = sub.map(r => r.settledPnl);
    const meanPnl = avg(pnls);
    const stdPnl = std(pnls);
    const sharpe = stdPnl > 0 ? (meanPnl / stdPnl).toFixed(3) : '—';
    return [s.label, a.n, pct(sub.length, v8Rows.length), a.wr, a.pnl, a.roi, a.avgInv,
      (lift > 0 ? '+' : '') + (lift * 100).toFixed(1) + '%', sharpe];
  }).filter(Boolean);

  out.push(mdTable(headers, data));

  // Best risk-adjusted strategy
  const withSharpe = data.filter(d => d[8] !== '—').sort((a, b) => parseFloat(b[8]) - parseFloat(a[8]));
  if (withSharpe.length > 0) {
    out.push(`\n**Best risk-adjusted strategy**: ${withSharpe[0][0]} — Sharpe ${withSharpe[0][8]}, ${withSharpe[0][3]} WR, ${withSharpe[0][5]} ROI`);
  }
  const bestWR = [...data].sort((a, b) => parseFloat(b[3]) - parseFloat(a[3]));
  if (bestWR.length > 0) {
    out.push(`**Highest WR strategy**: ${bestWR[0][0]} — ${bestWR[0][3]} WR, ${bestWR[0][5]} ROI (N=${bestWR[0][1]})`);
  }

  return out.join('\n');
}

function sec34_edgeMatrix(rows) {
  const out = ['\n---\n\n## 34. Edge Concentration Matrix\n'];
  out.push('Where in the parameter space does actual edge exist? Green = profitable, Red = losing.\n');
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 30) { out.push('_Insufficient data._'); return out.join('\n'); }

  // WPS × Entry Price matrix
  out.push('### WPS × Entry Price\n');
  const wpsGroups = [{ label: 'WPS < 0', lo: -Infinity, hi: 0 }, { label: 'WPS 0-3', lo: 0, hi: 3 }, { label: 'WPS 3+', lo: 3, hi: Infinity }];
  const priceGroups = [{ label: '< 40¢', lo: 0, hi: 0.40 }, { label: '40-55¢', lo: 0.40, hi: 0.55 }, { label: '55¢+', lo: 0.55, hi: 1.01 }];
  const matHeaders = ['', ...priceGroups.map(p => p.label)];
  const matData = wpsGroups.map(w => {
    const cells = priceGroups.map(p => {
      const sub = v8Rows.filter(r => r.v8_walletPlayScore >= w.lo && r.v8_walletPlayScore < w.hi && r.avgPrice >= p.lo && r.avgPrice < p.hi);
      if (sub.length < 3) return '—';
      const a = agg(sub);
      return `${a.n}/${a.wr}/${a.roi}`;
    });
    return [w.label, ...cells];
  });
  out.push(mdTable(matHeaders, matData));
  out.push('_Format: N / WR / ROI_\n');

  // Wallet Count For × Against matrix
  out.push('### Wallets For × Wallets Against\n');
  const forGroups = [{ label: '1 wallet', lo: 1, hi: 2 }, { label: '2-3 wallets', lo: 2, hi: 4 }, { label: '4+ wallets', lo: 4, hi: Infinity }];
  const agstGroups = [{ label: '0 against', lo: 0, hi: 1 }, { label: '1-2 against', lo: 1, hi: 3 }, { label: '3+ against', lo: 3, hi: Infinity }];
  const mat2Headers = ['', ...agstGroups.map(a => a.label)];
  const mat2Data = forGroups.map(f => {
    const cells = agstGroups.map(a => {
      const sub = v8Rows.filter(r => r.v8_walletCountFor >= f.lo && r.v8_walletCountFor < f.hi && r.v8_walletCountAgainst >= a.lo && r.v8_walletCountAgainst < a.hi);
      if (sub.length < 3) return '—';
      const aa = agg(sub);
      return `${aa.n}/${aa.wr}/${aa.roi}`;
    });
    return [f.label, ...cells];
  });
  out.push(mdTable(mat2Headers, mat2Data));
  out.push('_Format: N / WR / ROI_\n');

  // Wallet Base × Conviction Mult matrix
  out.push('### Wallet Base × Conviction Mult\n');
  const baseGroups = [{ label: 'Base < 30', lo: 0, hi: 30 }, { label: 'Base 30-60', lo: 30, hi: 60 }, { label: 'Base 60+', lo: 60, hi: Infinity }];
  const convGroups = [{ label: 'Conv < 1.0', lo: 0, hi: 1.0 }, { label: 'Conv 1.0-1.2', lo: 1.0, hi: 1.2 }, { label: 'Conv 1.2+', lo: 1.2, hi: Infinity }];
  const mat3Headers = ['', ...convGroups.map(c => c.label)];
  const mat3Data = baseGroups.map(b => {
    const cells = convGroups.map(c => {
      const sub = v8Rows.filter(r => r.v8_walletBase != null && r.v8_walletBase >= b.lo && r.v8_walletBase < b.hi && r.v8_convictionMult != null && r.v8_convictionMult >= c.lo && r.v8_convictionMult < c.hi);
      if (sub.length < 3) return '—';
      const aa = agg(sub);
      return `${aa.n}/${aa.wr}/${aa.roi}`;
    });
    return [b.label, ...cells];
  });
  out.push(mdTable(mat3Headers, mat3Data));
  out.push('_Format: N / WR / ROI_');

  return out.join('\n');
}

function sec35_actionableInsights(rows) {
  const out = ['\n---\n\n## 35. Actionable Insights for V8 Tuning\n'];
  const v8Rows = rows.filter(r => r.v8_walletPlayScore != null);
  if (v8Rows.length < 20) { out.push('_Insufficient data._'); return out.join('\n'); }

  const baseWR = rows.filter(r => r.won).length / rows.length;
  const findings = [];

  // 1. WPS vs economic outcomes (staked ROI / excess vs implied) — not raw WR vs entry price
  const wpsValid = v8Rows.filter(r => r.stakedRoi != null && isFinite(r.stakedRoi) && r.v8_walletPlayScore != null);
  if (wpsValid.length >= 30) {
    const sorted = [...wpsValid].sort((a, b) => a.v8_walletPlayScore - b.v8_walletPlayScore);
    const t = Math.floor(sorted.length / 3);
    const low = sorted.slice(0, t);
    const mid = sorted.slice(t, 2 * t);
    const hi = sorted.slice(2 * t);
    const meanRoi = (arr) => avg(arr.map(r => r.stakedRoi));
    const meanEx = (arr) => {
      const xs = arr.map(r => r.beatEntryImplied).filter(x => x != null && isFinite(x));
      return xs.length ? avg(xs) : null;
    };
    const rLow = meanRoi(low);
    const rHi = meanRoi(hi);
    const exL = meanEx(low);
    const exH = meanEx(hi);
    if (rHi > rLow + 0.02 || (exH != null && exL != null && exH > exL + 0.03)) {
      findings.push({
        priority: 'INFO',
        area: 'WPS vs payout',
        finding: `WPS tertiles vs economics: low-WPS mean ROI ${(rLow * 100).toFixed(2)}%, high-WPS ${(rHi * 100).toFixed(2)}%; mean (W−p) low ${exL != null ? (exL * 100).toFixed(2) + '%' : '—'} vs high ${exH != null ? (exH * 100).toFixed(2) + '%' : '—'} (N=${wpsValid.length}).`,
      });
    }
  }

  // 2. Opposition
  const noOpp = v8Rows.filter(r => r.v8_walletCountAgainst === 0 && r.side === r.v8_consensusSide);
  const hasOpp = v8Rows.filter(r => r.v8_walletCountAgainst > 0 && r.side === r.v8_consensusSide);
  if (noOpp.length >= 5 && hasOpp.length >= 5) {
    const noOppWR = noOpp.filter(r => r.won).length / noOpp.length;
    const hasOppWR = hasOpp.filter(r => r.won).length / hasOpp.length;
    if (noOppWR > hasOppWR + 0.10) {
      findings.push({ priority: 'HIGH', area: 'Opposition Gate', finding: `No-opposition consensus WR: ${(noOppWR*100).toFixed(0)}% vs with-opposition: ${(hasOppWR*100).toFixed(0)}%. The 0.85 against-discount may be too lenient — opposing sharps destroy edge.` });
    }
  }

  // 3. Against-side strength
  const strongAgst = v8Rows.filter(r => r.v8_againstSide >= 100 && r.side === r.v8_consensusSide);
  if (strongAgst.length >= 5) {
    const saWR = strongAgst.filter(r => r.won).length / strongAgst.length;
    if (saWR < baseWR - 0.10) {
      findings.push({ priority: 'CRITICAL', area: 'Against Side Filter', finding: `When againstSide ≥ 100: ${(saWR*100).toFixed(0)}% WR (${strongAgst.length} positions). These are money pits — consider adding a hard gate.` });
    }
  }

  // 4. Single wallet vs multi
  const single = v8Rows.filter(r => r.v8_walletCountFor <= 1);
  const multi = v8Rows.filter(r => r.v8_walletCountFor >= 3);
  if (single.length >= 5 && multi.length >= 5) {
    const sWR = single.filter(r => r.won).length / single.length;
    const mWR = multi.filter(r => r.won).length / multi.length;
    findings.push({ priority: sWR > mWR + 0.05 ? 'MEDIUM' : 'INFO', area: 'Wallet Count', finding: `1-wallet WR: ${(sWR*100).toFixed(0)}% (N=${single.length}) vs 3+ wallet WR: ${(mWR*100).toFixed(0)}% (N=${multi.length}). ${sWR > mWR ? 'Single-wallet plays are outperforming consensus — breadth bonus may be over-weighted.' : 'Multi-wallet consensus is outperforming — breadth bonus is working.'}` });
  }

  // 5. Contrarian signal
  const contra = v8Rows.filter(r => r.side !== r.v8_consensusSide);
  if (contra.length >= 5) {
    const cWR = contra.filter(r => r.won).length / contra.length;
    if (cWR > baseWR + 0.10) {
      findings.push({ priority: 'HIGH', area: 'Contrarian Edge', finding: `Contrarian positions: ${(cWR*100).toFixed(0)}% WR (N=${contra.length}). These wallets are betting AGAINST the consensus and winning. Consider tracking contrarian signals separately.` });
    }
  }

  // 6. Concentration paradox
  const lowConc = v8Rows.filter(r => r.v8_topShare < 0.4);
  const highConc = v8Rows.filter(r => r.v8_topShare >= 0.8);
  if (lowConc.length >= 5 && highConc.length >= 5) {
    const lcWR = lowConc.filter(r => r.won).length / lowConc.length;
    const hcWR = highConc.filter(r => r.won).length / highConc.length;
    if (hcWR > lcWR + 0.10) {
      findings.push({ priority: 'HIGH', area: 'Concentration Penalty', finding: `High concentration (topShare ≥ 80%): ${(hcWR*100).toFixed(0)}% WR vs diversified (<40%): ${(lcWR*100).toFixed(0)}% WR. The concentration penalty may be BACKWARDS — conviction concentration is actually a positive signal.` });
    }
  }

  // 7. Sport-specific
  const sports = [...new Set(v8Rows.map(r => r.sport))];
  for (const s of sports) {
    const sub = v8Rows.filter(r => r.sport === s);
    if (sub.length >= 10) {
      const sWR = sub.filter(r => r.won).length / sub.length;
      const sA = agg(sub);
      if (sWR > baseWR + 0.10) findings.push({ priority: 'INFO', area: 'Sport Edge', finding: `${s}: ${(sWR*100).toFixed(0)}% WR, ${sA.roi} ROI (N=${sub.length}). Outperforming overall.` });
      if (sWR < baseWR - 0.10) findings.push({ priority: 'MEDIUM', area: 'Sport Weakness', finding: `${s}: ${(sWR*100).toFixed(0)}% WR, ${sA.roi} ROI (N=${sub.length}). Underperforming overall.` });
    }
  }

  if (findings.length === 0) {
    out.push('No significant insights detected at current sample size.');
  } else {
    findings.sort((a, b) => {
      const prio = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, INFO: 3 };
      return (prio[a.priority] || 4) - (prio[b.priority] || 4);
    });
    for (const f of findings) {
      out.push(`### ${f.priority}: ${f.area}\n${f.finding}\n`);
    }
  }

  return out.join('\n');
}

function sec36_kpis(rows) {
  const out = ['\n---\n\n## 36. Dashboard KPIs\n'];

  const a = agg(rows);
  const uniqueWallets = new Set(rows.map(r => r.wallet)).size;
  const uniqueGames = new Set(rows.map(r => `${r.date}_${r.gameKey}`)).size;
  const hc = rows.filter(r => r.label === 'HIGH_CONVICTION');
  const hcA = agg(hc);
  const elite = rows.filter(r => r.tier === 'ELITE');
  const eliteA = agg(elite);
  const bigWins = rows.filter(r => r.settledPnl > 10000);
  const bigLosses = rows.filter(r => r.settledPnl < -10000);
  const clvRows = rows.filter(r => r.clv != null);
  const posClvRate = clvRows.length > 0 ? pct(clvRows.filter(r => r.clv > 0).length, clvRows.length) : '—';

  const kpiData = [
    ['Total Positions Graded', rows.length],
    ['Overall WR', a.wr],
    ['Overall ROI', a.roi],
    ['Total P&L', a.pnl],
    ['Total Invested', a.totalInvested],
    ['Unique Wallets', uniqueWallets],
    ['Unique Games', uniqueGames],
    ['HIGH_CONVICTION WR', hcA.wr],
    ['HIGH_CONVICTION ROI', hcA.roi],
    ['ELITE tier WR', eliteA.wr],
    ['ELITE tier ROI', eliteA.roi],
    ['Big wins (>$10K)', bigWins.length],
    ['Big losses (>$10K)', bigLosses.length],
    ['Positive CLV rate', posClvRate],
    ['Avg bet multiplier', a.avgMult],
  ];

  const v8Rows = rows.filter(r => r.v8_stars != null);
  if (v8Rows.length > 0) {
    const highStars = v8Rows.filter(r => r.v8_stars >= 3);
    const lowStars = v8Rows.filter(r => r.v8_stars < 3);
    kpiData.push(
      ['V8 coverage', `${v8Rows.length}/${rows.length} (${pct(v8Rows.length, rows.length)})`],
      ['Avg V8 Stars', avg(v8Rows.map(r => r.v8_stars)).toFixed(1) + '★'],
      ['Avg WPS', avg(v8Rows.map(r => r.v8_walletPlayScore)).toFixed(2)],
      ['≥3★ WR', highStars.length > 0 ? agg(highStars).wr : '—'],
      ['≥3★ ROI', highStars.length > 0 ? agg(highStars).roi : '—'],
      ['<3★ WR', lowStars.length > 0 ? agg(lowStars).wr : '—'],
      ['<3★ ROI', lowStars.length > 0 ? agg(lowStars).roi : '—'],
    );
  }

  out.push(mdTable(['KPI', 'Value'], kpiData));

  return out.join('\n');
}

function starBucketLabel(r) {
  const s = r.v8_stars;
  if (s == null || !isFinite(s)) return '—';
  if (s < 2.5) return '★<2.5';
  if (s < 3.5) return '★2.5–3.5';
  return '★≥3.5';
}

function consensusSideLabel(r) {
  if (r.v8_consensusSide == null || r.side == null) return 'Unknown';
  return r.side === r.v8_consensusSide ? 'Consensus' : 'Contrarian';
}

/** ρ(X,Y) on rows where both X and Y finite; |ρ| for sorting */
function pairwiseSpearman(rows, keyX, keyY) {
  const sub = rows.filter(r => r[keyX] != null && r[keyY] != null && isFinite(r[keyX]) && isFinite(r[keyY]));
  if (sub.length < 15) return null;
  return spearman(sub.map(r => r[keyX]), sub.map(r => r[keyY]));
}

function sec37_withinImpliedStrata(rows) {
  const out = ['\n---\n\n## 37. Within Implied-Probability Strata (Confound Control)\n'];
  out.push(
    'Splits the sample into **quintiles of `avgPrice`** (Polymarket implied prob). ' +
    'Inside each stratum, raw win rate is roughly comparable; we report **mean staked ROI**, **mean (W−p)**, and whether **WPS** still correlates with **ROI**.\n'
  );
  const valid = rows.filter(r =>
    r.avgPrice > 0.02 && r.avgPrice < 0.98 && r.stakedRoi != null && isFinite(r.stakedRoi) && r.v8_walletPlayScore != null,
  );
  if (valid.length < 50) {
    out.push('_Need ≥50 positions with stake ROI and price for stable quintiles._');
    return out.join('\n');
  }
  const sorted = [...valid].sort((a, b) => a.avgPrice - b.avgPrice);
  const qRows = [];
  for (let q = 0; q < 5; q++) {
    const lo = Math.floor((q * sorted.length) / 5);
    const hi = Math.floor(((q + 1) * sorted.length) / 5);
    const sub = sorted.slice(lo, hi);
    if (sub.length < 8) continue;
    const meanP = avg(sub.map(r => r.avgPrice));
    const meanRoi = avg(sub.map(r => r.stakedRoi));
    const exs = sub.map(r => r.beatEntryImplied).filter(x => x != null && isFinite(x));
    const meanEx = exs.length ? avg(exs) : null;
    const rhoWps = spearman(sub.map(r => r.v8_walletPlayScore), sub.map(r => r.stakedRoi));
    qRows.push([
      `Q${q + 1} (cheapest→richest)`,
      sub.length,
      (meanP * 100).toFixed(1) + '¢',
      (meanRoi * 100).toFixed(2) + '%',
      meanEx != null ? (meanEx * 100).toFixed(2) + '%' : '—',
      rhoWps != null && isFinite(rhoWps) ? (rhoWps > 0 ? '+' : '') + rhoWps.toFixed(3) : '—',
    ]);
  }
  out.push(mdTable(['Price quintile', 'N', 'Mean entry', 'Mean ROI', 'Mean (W−p)', 'ρ WPS vs ROI'], qRows));
  out.push('\n_If ρ(WPS vs ROI) stays positive inside dog-heavy quintiles, WPS is doing real work beyond “bet favorites”._');
  return out.join('\n');
}

function categorical2Way(rows, labelA, fnA, labelB, fnB, minN = 6) {
  const as = [...new Set(rows.map(fnA))].sort();
  const bs = [...new Set(rows.map(fnB))].sort();
  const headers = [labelA, ...bs.map(b => `${b} (N / ROI / mean W−p)`)];
  const lines = as.map(a => {
    const cells = bs.map(b => {
      const sub = rows.filter(r => fnA(r) === a && fnB(r) === b);
      if (sub.length < minN) return '—';
      const aAgg = agg(sub);
      const exs = sub.map(r => r.beatEntryImplied).filter(x => x != null && isFinite(x));
      const exBar = exs.length ? (avg(exs) * 100).toFixed(2) + '%' : '—';
      return `${sub.length}/${aAgg.roi}/${exBar}`;
    });
    return [String(a), ...cells];
  });
  return mdTable(headers, lines);
}

function sec38_multiwayInteractions(rows) {
  const out = ['\n---\n\n## 38. Multi-Way Interaction Mining (1-, 2-, 3-factor)\n'];
  out.push(
    '**1-factor**: see §22 (ρ vs W, ROI, W−p). **2-factor**: categorical crosses (each cell = N / pool ROI / mean excess W−p). ' +
    '**3-factor**: exhaustive AND of three binary “setup” flags (min N=8); sorted by **mean staked ROI** then pool ROI.\n'
  );

  const v8 = rows.filter(r => r.v8_walletPlayScore != null && r.stakedRoi != null && isFinite(r.stakedRoi));
  if (v8.length < 30) {
    out.push('_Insufficient graded V8 rows._');
    return out.join('\n');
  }

  out.push('### 38a. Predictor multicollinearity (|ρ| between inputs)\n');
  const predKeys = [
    'v8_walletPlayScore', 'v8_stars', 'v8_netEdge', 'v8_forSide', 'v8_againstSide',
    'v8_walletCountFor', 'v8_walletCountAgainst', 'v8_topShare', 'v8_walletBase',
    'betMultiplier', 'sportROI', 'sportsLbPercentileTop', 'leaderboardRank', 'avgSportBet',
  ];
  const pairs = [];
  for (let i = 0; i < predKeys.length; i++) {
    for (let j = i + 1; j < predKeys.length; j++) {
      const rho = pairwiseSpearman(v8, predKeys[i], predKeys[j]);
      if (rho == null || !isFinite(rho)) continue;
      pairs.push({ a: predKeys[i], b: predKeys[j], rho, abs: Math.abs(rho) });
    }
  }
  pairs.sort((x, y) => y.abs - x.abs);
  out.push(mdTable(
    ['Feature A', 'Feature B', '|ρ|'],
    pairs.slice(0, 18).map(p => [p.a, p.b, p.abs.toFixed(3)]),
  ));
  out.push('_High |ρ| between predictors means they move together — do not double-count in prose “confidence” rules._\n');

  out.push('### 38b. Two-way crosses (economic cell stats)\n');
  out.push(categorical2Way(v8, 'Label', r => r.label || '—', 'Tier', r => r.tier || '—'));
  out.push('\n');
  out.push(categorical2Way(v8, 'Tier', r => r.tier || '—', 'Market', r => r.marketType || '—'));
  out.push('\n');
  out.push(categorical2Way(v8, 'Sport', r => r.sport || '—', 'Market', r => r.marketType || '—'));
  out.push('\n');
  out.push(categorical2Way(v8, 'Side vs consensus', r => consensusSideLabel(r), 'Star bucket', r => starBucketLabel(r)));

  out.push('\n### 38c. Three-factor AND rules (binary flags, min N=8)\n');
  const flags = [
    { name: 'WPS≥2', f: r => r.v8_walletPlayScore >= 2 },
    { name: 'Stars≥3', f: r => r.v8_stars >= 3 },
    { name: 'NetEdge>1.5', f: r => r.v8_netEdge > 1.5 },
    { name: 'NoOpp', f: r => (r.v8_walletCountAgainst ?? 0) === 0 },
    { name: 'Consensus', f: r => r.v8_consensusSide != null && r.side === r.v8_consensusSide },
    { name: 'TopShare<0.5', f: r => r.v8_topShare != null && r.v8_topShare < 0.5 },
    { name: 'LB%≥60', f: r => r.sportsLbPercentileTop != null && r.sportsLbPercentileTop >= 60 },
    { name: 'BetMult≥3', f: r => r.betMultiplier >= 3 },
    { name: 'Against<50', f: r => r.v8_againstSide != null && r.v8_againstSide < 50 },
    { name: 'Wallets≥4', f: r => r.v8_walletCountFor >= 4 },
  ];
  const triples = [];
  for (let i = 0; i < flags.length; i++) {
    for (let j = i + 1; j < flags.length; j++) {
      for (let k = j + 1; k < flags.length; k++) {
        const sub = v8.filter(r => flags[i].f(r) && flags[j].f(r) && flags[k].f(r));
        if (sub.length < 8) continue;
        const meanRoi = avg(sub.map(r => r.stakedRoi));
        const exs = sub.map(r => r.beatEntryImplied).filter(x => x != null && isFinite(x));
        const meanEx = exs.length ? avg(exs) : null;
        const a = agg(sub);
        triples.push({
          rule: `${flags[i].name} ∧ ${flags[j].name} ∧ ${flags[k].name}`,
          n: sub.length,
          meanRoi,
          meanEx,
          poolRoi: parseFloat(a.roi) || 0,
          wr: a.wr,
        });
      }
    }
  }
  triples.sort((a, b) => b.meanRoi - a.meanRoi || b.poolRoi - a.poolRoi);
  const top = triples.slice(0, 25);
  out.push(mdTable(
    ['Rule (3×AND)', 'N', 'Mean ROI (stake)', 'Mean (W−p)', 'Pool ROI', 'WR'],
    top.map(t => [
      t.rule,
      t.n,
      (t.meanRoi * 100).toFixed(2) + '%',
      t.meanEx != null ? (t.meanEx * 100).toFixed(2) + '%' : '—',
      (t.poolRoi).toFixed(1) + '%',
      t.wr,
    ]),
  ));
  out.push('\n_Use triples with healthy N only; small-N leaders are often noise._');

  return out.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const db = initFirebase();
  console.log('Exporting graded positions from Firebase...');
  const rows = await exportGradedPositions(db);
  console.log(`Exported ${rows.length} graded positions.`);

  if (rows.length === 0) {
    console.log('No graded positions found. Exiting.');
    process.exit(0);
  }

  attachDerivedMetrics(rows);

  const report = [
    sec0_header(rows),
    sec1_perfWindows(rows),
    sec2_labelPerformance(rows),
    sec3_tierCalibration(rows),
    sec4_marketType(rows),
    sec5_sportBreakdown(rows),
    sec6_convictionAnalysis(rows),
    sec7_walletSkill(rows),
    sec8_entryPrice(rows),
    sec9_positionSizing(rows),
    sec10_pinnacleEdge(rows),
    sec11_polymarketPnl(rows),
    sec12_walletConcentration(rows),
    sec13_gameLevel(rows),
    sec14_clvAnalysis(rows),
    sec15_timing(rows),
    sec16_failureDiagnostics(rows),
    sec17_v8StarCalibration(rows),
    sec18_v8CoreVariables(rows),
    sec19_wpsBuckets(rows),
    sec20_walletContribCalibration(rows),
    sec21_consensusVsContra(rows),
    sec22_predictiveRankings(rows),
    sec23_v8Interactions(rows),
    sec24_wpsDecomposition(rows),
    sec25_skillVsConviction(rows),
    sec26_multiFactorConditions(rows),
    sec27_oppositionAnalysis(rows),
    sec28_topShareAnalysis(rows),
    sec29_optimalThresholds(rows),
    sec30_featureImportance(rows),
    sec31_decisionRules(rows),
    sec32_wpsFormulaAudit(rows),
    sec33_backtestSimulations(rows),
    sec34_edgeMatrix(rows),
    sec35_actionableInsights(rows),
    sec36_kpis(rows),
    sec37_withinImpliedStrata(rows),
    sec38_multiwayInteractions(rows),
  ].join('\n');

  const outPath = join(__dirname, '../DAILY_SHARP_ACTION_REPORT.md');
  writeFileSync(outPath, report);
  console.log(`\nReport written to ${outPath}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
