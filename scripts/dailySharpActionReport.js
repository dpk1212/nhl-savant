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
      curPrice: data.curPrice || 0,
      positionPnl: data.positionPnl || 0,
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
      awayScore: data.score?.away ?? null,
      homeScore: data.score?.home ?? null,
      closingPinnacleOdds: data.closingPinnacleOdds || null,
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

function sec22_kpis(rows) {
  const out = ['\n---\n\n## 22. Dashboard KPIs\n'];

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
    sec22_kpis(rows),
  ].join('\n');

  const outPath = join(__dirname, '../DAILY_SHARP_ACTION_REPORT.md');
  writeFileSync(outPath, report);
  console.log(`\nReport written to ${outPath}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
