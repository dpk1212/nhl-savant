/**
 * V7 Daily Performance Report
 *
 * 10-tab comprehensive analysis:
 *  1. Executive Summary
 *  2. Star Ladder Health
 *  3. Lock vs Update Audit
 *  4. Two-Sided Feature Audit
 *  5. Middle-Tier Filter Audit
 *  6. Factor Leaderboard
 *  7. Sizing Discipline Audit
 *  8. LiveCLV Regime Audit
 *  9. Board Composition Audit
 * 10. Drift & Calibration Audit
 *
 * Usage: node scripts/dailyV7Report.js
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

const V7_LIVE_DATE = '2026-04-06';

const V7_STATS = {
  avgBet:       { mean: 4162.2509, std: 7251.2948, lo: 216, hi: 24028.625 },
  invested:     { mean: 27502.2117, std: 57067.398, lo: 693.25, hi: 169147 },
  moneyPct:     { mean: 78.1736, std: 15.8987 },
  walletPct:    { mean: 62.8166, std: 16.2884 },
  counter:      { mean: 21.7202, std: 15.9326 },
  sharpCount:   { mean: 5.6375, std: 3.3849 },
  qp:           { mean: 1.8273, std: 1.9919 },
  liveCLV:      { mean: 0.0002, std: 0.0303 },
  moneyEdge:    { mean: 1.6817, std: 1.3664 },
  sharpEdge:    { mean: 1.3601, std: 0.7109 },
  mktDominance: { mean: 1.5531, std: 0.9004 },
  againstSC:    { mean: 0.9197, std: 1.6243 },
};

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

function v7Z(val, mean, std) { return std > 0 ? (val - mean) / std : 0; }

function pct(n, d) { return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—'; }
function avg(arr) { return arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function fmt(n) { return n != null ? (typeof n === 'number' ? n.toFixed(2) : String(n)) : '—'; }
function fmtPct(n) { return n != null ? (n * 100).toFixed(1) + '%' : '—'; }

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
        const lockAvgBet = lockSC > 0 ? lockInvested / lockSC : 0;
        const lockMoneyPct = lk?.consensusStrength?.moneyPct ?? null;
        const lockWalletPct = lk?.consensusStrength?.walletPct ?? null;
        const lockEvEdge = lk?.evEdge || 0;
        const counterSharp = lockMoneyPct != null ? Math.max(0, 100 - lockMoneyPct) : 0;

        const regime = pk?.regime || lk?.regime || 'NO_MOVE';
        const qualityProxy = pk?.qualityProxy ?? lk?.qualityProxy ?? null;

        const opp = lk?.opposition || pk?.opposition || {};
        const oppSC = opp.sharpCount || 0;
        const oppInvested = opp.totalInvested || 0;

        // Two-sided features
        const againstMoney = lockMoneyPct != null ? 100 - lockMoneyPct : 50;
        const moneyEdge = lockMoneyPct != null ? Math.log((lockMoneyPct + 1) / (againstMoney + 1)) : 0;
        const sharpEdge = Math.log((lockSC + 1) / (oppSC + 1));
        const mktDom = 0.6 * moneyEdge + 0.4 * sharpEdge;
        const hasBoth = oppSC > 0 && lockSC > 0;
        const disagreement = hasBoth && Math.sign(moneyEdge) !== Math.sign(sharpEdge) ? 1 : 0;

        const moneyEdge_z = v7Z(moneyEdge, V7_STATS.moneyEdge.mean, V7_STATS.moneyEdge.std);
        const mktDom_z = v7Z(mktDom, V7_STATS.mktDominance.mean, V7_STATS.mktDominance.std);

        // Contradiction flags
        const contra1 = ((lockMoneyPct || 0) >= 80 && counterSharp >= 30) ? 1 : 0;
        const contra2 = (lockSC >= 7 && (lockMoneyPct || 0) < 65) ? 1 : 0;
        const contradictions = contra1 + contra2;

        const ob = oddsBand(lockOdds);

        rows.push({
          date: data.date, sport: data.sport || 'NHL', marketType: mktType,
          won, profit, lockOdds, peakOdds, ob,
          lockStars, peakStars, starDelta,
          lockUnits, peakUnits, unitDelta,
          lockSC, lockInvested, lockAvgBet,
          lockMoneyPct, lockWalletPct, lockEvEdge,
          counterSharp, contradictions,
          regime, qualityProxy,
          oppSC, oppInvested,
          moneyEdge, sharpEdge, mktDom, disagreement,
          moneyEdge_z, mktDom_z,
          clv, closingProb, lockPinnProb,
        });
      }
    });
  }
  return rows;
}

// ── Window Filtering ─────────────────────────────────────────────────────────

function windowFilter(rows, label) {
  const today = etToday();
  if (label === 'Today') return rows.filter(r => r.date === today);
  if (label === '3-Day') return rows.filter(r => r.date >= etNDaysAgo(3));
  if (label === '7-Day') return rows.filter(r => r.date >= etNDaysAgo(7));
  if (label === 'V7 Era') return rows.filter(r => r.date >= V7_LIVE_DATE);
  return rows;
}

const WINDOWS = ['Today', '3-Day', '7-Day', 'V7 Era', 'All Time'];

// ── Aggregation Helpers ──────────────────────────────────────────────────────

function agg(rows) {
  if (rows.length === 0) return { n: 0, wr: '—', flatROI: '—', modelROI: '—', avgCLV: '—', clvPos: '—', avgStars: '—', avgUnits: '—' };
  const n = rows.length;
  const wins = rows.filter(r => r.won).length;
  const flatPL = rows.reduce((s, r) => {
    if (r.won) {
      const odds = r.peakOdds || r.lockOdds;
      return s + (odds < 0 ? 100 / Math.abs(odds) : odds / 100);
    }
    return s - 1;
  }, 0);
  const modelPL = rows.reduce((s, r) => s + r.profit, 0);
  const clvRows = rows.filter(r => r.clv != null);
  const avgCLV = clvRows.length > 0 ? avg(clvRows.map(r => r.clv)) : null;
  const clvPos = clvRows.length > 0 ? clvRows.filter(r => r.clv > 0).length / clvRows.length : null;

  return {
    n,
    wr: pct(wins, n),
    flatROI: (flatPL / n * 100).toFixed(1) + '%',
    flatPL: flatPL.toFixed(2),
    modelROI: (modelPL / rows.reduce((s, r) => s + r.peakUnits, 0) * 100).toFixed(1) + '%',
    modelPL: modelPL.toFixed(2),
    avgCLV: avgCLV != null ? (avgCLV * 100).toFixed(2) + '%' : '—',
    clvPos: clvPos != null ? (clvPos * 100).toFixed(1) + '%' : '—',
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

function terciles(rows, key) {
  const valid = rows.filter(r => r[key] != null && isFinite(r[key]));
  if (valid.length < 3) return [];
  const sorted = [...valid].sort((a, b) => a[key] - b[key]);
  const t1 = Math.floor(sorted.length / 3);
  const t2 = Math.floor(2 * sorted.length / 3);
  return [
    { label: `Bottom (≤${sorted[t1][key]?.toFixed(2)})`, ...agg(sorted.slice(0, t1)) },
    { label: `Middle`, ...agg(sorted.slice(t1, t2)) },
    { label: `Top (≥${sorted[t2][key]?.toFixed(2)})`, ...agg(sorted.slice(t2)) },
  ];
}

function quintiles(rows, key) {
  const valid = rows.filter(r => r[key] != null && isFinite(r[key]));
  if (valid.length < 5) return [];
  const sorted = [...valid].sort((a, b) => a[key] - b[key]);
  const qs = [];
  for (let i = 0; i < 5; i++) {
    const lo = Math.floor(i * sorted.length / 5);
    const hi = Math.floor((i + 1) * sorted.length / 5);
    const slice = sorted.slice(lo, hi);
    const loVal = slice[0][key];
    const hiVal = slice[slice.length - 1][key];
    qs.push({ label: `Q${i + 1} (${loVal?.toFixed(2)}–${hiVal?.toFixed(2)})`, ...agg(slice) });
  }
  return qs;
}

// ── Table Rendering ──────────────────────────────────────────────────────────

function mdTable(headers, rowsData) {
  const lines = [];
  lines.push('| ' + headers.join(' | ') + ' |');
  lines.push('|' + headers.map(() => '---').join('|') + '|');
  for (const row of rowsData) {
    lines.push('| ' + row.join(' | ') + ' |');
  }
  return lines.join('\n');
}

// ── Report Tabs ──────────────────────────────────────────────────────────────

function tab1_executive(rows) {
  const out = ['## 1. Executive Summary\n'];
  const headers = ['Window', 'Picks', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'CLV+%', 'Avg★', 'Avg Units'];
  const data = WINDOWS.map(w => {
    const sub = windowFilter(rows, w);
    const a = agg(sub);
    return [w, a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV, a.clvPos, a.avgStars, a.avgUnits];
  });
  out.push(mdTable(headers, data));

  const upgrades = rows.filter(r => r.starDelta > 0).length;
  const downgrades = rows.filter(r => r.starDelta < 0).length;
  const unchanged = rows.filter(r => r.starDelta === 0).length;
  out.push(`\n**Updates**: ${upgrades} upgraded, ${downgrades} downgraded, ${unchanged} unchanged`);
  return out.join('\n');
}

function tab2_starLadder(rows) {
  const out = ['## 2. Star Ladder Health\n'];
  for (const w of WINDOWS) {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) continue;
    out.push(`### ${w} (n=${sub.length})\n`);
    const buckets = starBuckets(sub);
    const headers = ['Stars', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'CLV+%', 'Avg Odds', 'Avg Units'];
    const data = buckets.map(b => [b.stars, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV, b.clvPos, b.avgOdds, b.avgUnits]);
    out.push(mdTable(headers, data));
    out.push('');
  }

  // Monotonicity check on V7 Era
  const v7 = windowFilter(rows, 'V7 Era');
  const bk = starBuckets(v7);
  if (bk.length >= 3) {
    const wrs = bk.map(b => parseFloat(b.wr));
    let monotonic = true;
    for (let i = 1; i < wrs.length; i++) {
      if (wrs[i] > wrs[i - 1] + 5) { monotonic = false; break; }
    }
    out.push(monotonic ? '✅ Star ladder is monotonic (higher stars → higher WR)' : '⚠️ **ALERT: Star ladder monotonicity broken** — lower stars outperforming higher stars');
  }
  return out.join('\n');
}

function tab3_lockVsUpdate(rows) {
  const out = ['## 3. Lock vs Update Audit\n'];
  for (const w of WINDOWS) {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) continue;
    out.push(`### ${w}\n`);
    const upgraded = sub.filter(r => r.starDelta > 0);
    const unchanged = sub.filter(r => r.starDelta === 0);
    const downgraded = sub.filter(r => r.starDelta < 0);
    const headers = ['Group', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'Avg ★Δ', 'Avg UΔ'];
    const data = [
      ['Upgraded', upgraded.length, ...(() => { const a = agg(upgraded); return [a.wr, a.flatROI, a.modelROI, a.avgCLV]; })(), fmt(avg(upgraded.map(r => r.starDelta))), fmt(avg(upgraded.map(r => r.unitDelta)))],
      ['Unchanged', unchanged.length, ...(() => { const a = agg(unchanged); return [a.wr, a.flatROI, a.modelROI, a.avgCLV]; })(), '0', '0'],
      ['Downgraded', downgraded.length, ...(() => { const a = agg(downgraded); return [a.wr, a.flatROI, a.modelROI, a.avgCLV]; })(), fmt(avg(downgraded.map(r => r.starDelta))), fmt(avg(downgraded.map(r => r.unitDelta)))],
    ];
    out.push(mdTable(headers, data));
    out.push('');
  }

  // Trigger check
  const v7 = windowFilter(rows, '7-Day');
  if (v7.length > 0) {
    const up = v7.filter(r => r.starDelta > 0);
    const unch = v7.filter(r => r.starDelta === 0);
    const upWR = up.length > 0 ? up.filter(r => r.won).length / up.length : 0;
    const unchWR = unch.length > 0 ? unch.filter(r => r.won).length / unch.length : 0;
    if (up.length >= 3 && upWR < unchWR - 0.05) {
      out.push('⚠️ **TRIGGER: Upgraded picks underperforming unchanged picks over 7 days**');
    }
  }
  return out.join('\n');
}

function tab4_twoSided(rows) {
  const out = ['## 4. Two-Sided Feature Audit\n'];
  const features = [
    { key: 'moneyEdge', label: 'Money Edge' },
    { key: 'mktDom', label: 'Market Dominance' },
    { key: 'sharpEdge', label: 'Sharp Edge' },
    { key: 'oppSC', label: 'Against Sharp Count' },
    { key: 'moneyEdge_z', label: 'Money Edge (z)' },
    { key: 'mktDom_z', label: 'Market Dominance (z)' },
  ];

  for (const w of ['7-Day', 'V7 Era', 'All Time']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 5) continue;
    out.push(`### ${w} (n=${sub.length})\n`);

    for (const f of features) {
      const t = terciles(sub, f.key);
      if (t.length === 0) continue;
      out.push(`**${f.label}**\n`);
      const headers = ['Tercile', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV'];
      const data = t.map(b => [b.label, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV]);
      out.push(mdTable(headers, data));
      out.push('');
    }

    // Disagreement flag
    const agree = sub.filter(r => r.disagreement === 0);
    const disagree = sub.filter(r => r.disagreement === 1);
    if (disagree.length > 0) {
      out.push('**Signal Disagreement**\n');
      const headers = ['Flag', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV'];
      const data = [
        ['Agreement', agree.length, ...(() => { const a = agg(agree); return [a.wr, a.flatROI, a.modelROI, a.avgCLV]; })()],
        ['Disagreement', disagree.length, ...(() => { const a = agg(disagree); return [a.wr, a.flatROI, a.modelROI, a.avgCLV]; })()],
      ];
      out.push(mdTable(headers, data));
      out.push('');
    }
  }
  return out.join('\n');
}

function tab5_middleTier(rows) {
  const out = ['## 5. Middle-Tier Filter Audit (2.5★–3.5★)\n'];
  for (const w of ['7-Day', 'V7 Era', 'All Time']) {
    const all = windowFilter(rows, w);
    const mid = all.filter(r => r.peakStars >= 2.5 && r.peakStars <= 3.5);
    if (mid.length < 3) continue;
    out.push(`### ${w} — Middle Tier: ${mid.length} picks (of ${all.length} total)\n`);
    const a = agg(mid);
    out.push(`Overall: WR ${a.wr}, Flat ROI ${a.flatROI}, Model ROI ${a.modelROI}, CLV ${a.avgCLV}\n`);

    // By star bucket within middle tier
    const headers = ['Stars', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV'];
    const sb = starBuckets(mid);
    out.push(mdTable(headers, sb.map(b => [b.stars, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV])));
    out.push('');

    // Money Edge terciles in middle tier
    const met = terciles(mid, 'moneyEdge_z');
    if (met.length > 0) {
      out.push('**Money Edge (z) Terciles**\n');
      out.push(mdTable(headers, met.map(b => [b.label, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV])));
      out.push('');
    }

    // Market Dominance terciles
    const mdt = terciles(mid, 'mktDom_z');
    if (mdt.length > 0) {
      out.push('**Market Dominance (z) Terciles**\n');
      out.push(mdTable(headers, mdt.map(b => [b.label, b.n, b.wr, b.flatROI, b.modelROI, b.avgCLV])));
      out.push('');
    }

    // Disagreement in middle tier
    const agree = mid.filter(r => r.disagreement === 0);
    const disagree = mid.filter(r => r.disagreement === 1);
    if (disagree.length > 0) {
      out.push('**Signal Disagreement in Middle Tier**\n');
      out.push(mdTable(['Flag', 'N', 'WR', 'Flat ROI', 'Avg CLV'], [
        ['Agreement', agree.length, ...(() => { const a = agg(agree); return [a.wr, a.flatROI, a.avgCLV]; })()],
        ['Disagreement', disagree.length, ...(() => { const a = agg(disagree); return [a.wr, a.flatROI, a.avgCLV]; })()],
      ]));
      out.push('');
    }

    // By odds band in middle tier
    const bands = ['HEAVY_FAV', 'SLIGHT_FAV', 'COIN_FLIP', 'SLIGHT_DOG', 'LONG_DOG'];
    const bandRows = bands.map(b => {
      const sub = mid.filter(r => r.ob === b);
      if (sub.length === 0) return null;
      const a = agg(sub);
      return [b, a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV];
    }).filter(Boolean);
    if (bandRows.length > 0) {
      out.push('**By Odds Band**\n');
      out.push(mdTable(['Band', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV'], bandRows));
      out.push('');
    }
  }
  return out.join('\n');
}

function tab6_factorLeaderboard(rows) {
  const out = ['## 6. Factor Leaderboard\n'];
  out.push('Ranking factors by WR monotonicity across quintiles.\n');

  const factors = [
    { key: 'lockMoneyPct', label: 'moneyPct' },
    { key: 'moneyEdge', label: 'Money Edge' },
    { key: 'mktDom', label: 'Market Dominance' },
    { key: 'sharpEdge', label: 'Sharp Edge' },
    { key: 'lockAvgBet', label: 'avgBet' },
    { key: 'lockInvested', label: 'totalInvested' },
    { key: 'lockSC', label: 'sharpCount' },
    { key: 'counterSharp', label: 'counterSharp' },
    { key: 'lockEvEdge', label: 'evEdge' },
    { key: 'oppSC', label: 'againstSharpCount' },
  ];

  for (const w of ['7-Day', 'V7 Era', 'All Time']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 10) continue;
    out.push(`### ${w} (n=${sub.length})\n`);

    const scores = [];
    for (const f of factors) {
      const q = quintiles(sub, f.key);
      if (q.length < 5) continue;
      const wrs = q.map(b => parseFloat(b.wr) || 0);
      let mono = 0;
      for (let i = 1; i < wrs.length; i++) {
        if (wrs[i] > wrs[i - 1]) mono++;
        else if (wrs[i] < wrs[i - 1]) mono--;
      }
      const clvs = q.map(b => parseFloat(b.avgCLV) || 0);
      let clvMono = 0;
      for (let i = 1; i < clvs.length; i++) {
        if (clvs[i] > clvs[i - 1]) clvMono++;
        else if (clvs[i] < clvs[i - 1]) clvMono--;
      }
      const q1wr = wrs[0], q5wr = wrs[4];
      const spread = q5wr - q1wr;
      scores.push({ label: f.label, wrMono: mono, clvMono, spread: spread.toFixed(1), q1wr: q1wr.toFixed(1), q5wr: q5wr.toFixed(1) });
    }

    scores.sort((a, b) => (b.wrMono + b.clvMono) - (a.wrMono + a.clvMono));
    const headers = ['Rank', 'Factor', 'WR Mono', 'CLV Mono', 'Q1 WR', 'Q5 WR', 'Spread'];
    const data = scores.map((s, i) => [i + 1, s.label, s.wrMono, s.clvMono, s.q1wr + '%', s.q5wr + '%', s.spread + '%']);
    out.push(mdTable(headers, data));
    out.push('');
  }
  return out.join('\n');
}

function tab7_sizing(rows) {
  const out = ['## 7. Sizing Discipline Audit\n'];
  for (const w of ['7-Day', 'V7 Era', 'All Time']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 3) continue;
    out.push(`### ${w}\n`);

    const a = agg(sub);
    const flatPL = sub.reduce((s, r) => {
      if (r.won) {
        const odds = r.peakOdds || r.lockOdds;
        return s + (odds < 0 ? 100 / Math.abs(odds) : odds / 100);
      }
      return s - 1;
    }, 0);
    const modelPL = sub.reduce((s, r) => s + r.profit, 0);
    const sizingEdge = modelPL - flatPL;
    out.push(`Flat P/L: ${flatPL.toFixed(2)}u | Model P/L: ${modelPL.toFixed(2)}u | Sizing Edge: ${sizingEdge >= 0 ? '+' : ''}${sizingEdge.toFixed(2)}u\n`);

    // By unit tier
    const tiers = [
      { label: 'MAX (≥2.5u)', filter: r => r.peakUnits >= 2.5 },
      { label: 'STRONG (1.5–2.49u)', filter: r => r.peakUnits >= 1.5 && r.peakUnits < 2.5 },
      { label: 'STANDARD (<1.5u)', filter: r => r.peakUnits < 1.5 },
    ];
    const headers = ['Tier', 'N', 'WR', 'Total P/L', 'Avg Units', 'Avg★'];
    const data = tiers.map(t => {
      const ts = sub.filter(t.filter);
      if (ts.length === 0) return null;
      const pl = ts.reduce((s, r) => s + r.profit, 0);
      return [t.label, ts.length, pct(ts.filter(r => r.won).length, ts.length), pl.toFixed(2), avg(ts.map(r => r.peakUnits)).toFixed(2), avg(ts.map(r => r.peakStars)).toFixed(1)];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');

    // Unit increases without star improvement
    const badBumps = sub.filter(r => r.unitDelta > 0 && r.starDelta <= 0);
    if (badBumps.length > 0) {
      const bbA = agg(badBumps);
      out.push(`⚠️ ${badBumps.length} picks had unit increases without star improvement: WR ${bbA.wr}, P/L ${badBumps.reduce((s, r) => s + r.profit, 0).toFixed(2)}u`);
    }

    // Trigger
    if (sizingEdge < -2 && sub.length >= 10) {
      out.push('\n⚠️ **TRIGGER: Model ROI trails flat ROI — sizing is hurting performance**');
    }
    out.push('');
  }
  return out.join('\n');
}

function tab8_regimeAudit(rows) {
  const out = ['## 8. LiveCLV Regime Audit\n'];
  const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];

  for (const w of ['7-Day', 'V7 Era', 'All Time']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 3) continue;
    out.push(`### ${w}\n`);
    const headers = ['Regime', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'CLV+%', 'Avg ★Δ'];
    const data = regimes.map(reg => {
      const rs = sub.filter(r => r.regime === reg);
      if (rs.length === 0) return null;
      const a = agg(rs);
      return [reg, a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV, a.clvPos, avg(rs.map(r => r.starDelta)).toFixed(2)];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');
  }
  return out.join('\n');
}

function tab9_boardComposition(rows) {
  const out = ['## 9. Board Composition Audit\n'];

  for (const w of ['Today', '3-Day', '7-Day', 'V7 Era']) {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) continue;
    out.push(`### ${w} (${sub.length} picks)\n`);

    // By sport
    const sports = [...new Set(sub.map(r => r.sport))].sort();
    out.push('**By Sport**\n');
    const sportHeaders = ['Sport', 'N', '%', 'WR', 'Flat ROI'];
    const sportData = sports.map(s => {
      const ss = sub.filter(r => r.sport === s);
      const a = agg(ss);
      return [s, ss.length, pct(ss.length, sub.length), a.wr, a.flatROI];
    });
    out.push(mdTable(sportHeaders, sportData));
    out.push('');

    // By market type
    const types = ['ML', 'SPREAD', 'TOTAL'];
    const typeRows = types.map(t => {
      const ts = sub.filter(r => r.marketType === t);
      if (ts.length === 0) return null;
      const a = agg(ts);
      return [t, ts.length, pct(ts.length, sub.length), a.wr, a.flatROI];
    }).filter(Boolean);
    if (typeRows.length > 0) {
      out.push('**By Market Type**\n');
      out.push(mdTable(['Type', 'N', '%', 'WR', 'Flat ROI'], typeRows));
      out.push('');
    }

    // By odds band
    const bands = ['HEAVY_FAV', 'SLIGHT_FAV', 'COIN_FLIP', 'SLIGHT_DOG', 'LONG_DOG'];
    const bandRows = bands.map(b => {
      const bs = sub.filter(r => r.ob === b);
      if (bs.length === 0) return null;
      const a = agg(bs);
      return [b, bs.length, pct(bs.length, sub.length), a.wr, a.flatROI];
    }).filter(Boolean);
    out.push('**By Odds Band**\n');
    out.push(mdTable(['Band', 'N', '%', 'WR', 'Flat ROI'], bandRows));
    out.push('');

    // By star bucket
    const starHeaders = ['Stars', 'N', '%'];
    const sb = starBuckets(sub);
    out.push('**By Star Bucket**\n');
    out.push(mdTable(starHeaders, sb.map(b => [b.stars, b.n, pct(b.n, sub.length)])));
    out.push('');
  }
  return out.join('\n');
}

function tab10_drift(rows) {
  const out = ['## 10. Drift & Calibration Audit\n'];
  out.push('Comparing live distributions to frozen V7 calibration stats.\n');

  const features = [
    { key: 'lockMoneyPct', label: 'moneyPct', frozen: V7_STATS.moneyPct },
    { key: 'lockAvgBet', label: 'avgBet', frozen: V7_STATS.avgBet },
    { key: 'lockInvested', label: 'invested', frozen: V7_STATS.invested },
    { key: 'lockSC', label: 'sharpCount', frozen: V7_STATS.sharpCount },
    { key: 'counterSharp', label: 'counterSharp', frozen: V7_STATS.counter },
    { key: 'moneyEdge', label: 'moneyEdge', frozen: V7_STATS.moneyEdge },
    { key: 'mktDom', label: 'mktDominance', frozen: V7_STATS.mktDominance },
    { key: 'oppSC', label: 'againstSC', frozen: V7_STATS.againstSC },
  ];

  for (const w of ['7-Day', 'V7 Era']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 5) continue;
    out.push(`### ${w} (n=${sub.length})\n`);

    const headers = ['Feature', 'Frozen Mean', 'Frozen Std', 'Live Mean', 'Live Std', 'Δ Mean', 'Drift (σ)'];
    const data = features.map(f => {
      const vals = sub.map(r => r[f.key]).filter(v => v != null && isFinite(v));
      if (vals.length === 0) return null;
      const liveMean = avg(vals);
      const liveStd = vals.length > 1 ? Math.sqrt(vals.reduce((s, v) => s + (v - liveMean) ** 2, 0) / vals.length) : 0;
      const dMean = liveMean - f.frozen.mean;
      const drift = f.frozen.std > 0 ? Math.abs(dMean) / f.frozen.std : 0;
      const flag = drift > 1.0 ? ' ⚠️' : '';
      return [f.label, f.frozen.mean.toFixed(2), f.frozen.std.toFixed(2), liveMean.toFixed(2), liveStd.toFixed(2), (dMean >= 0 ? '+' : '') + dMean.toFixed(2), drift.toFixed(2) + flag];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');

    const drifted = data.filter(d => parseFloat(d[6]) > 1.0);
    if (drifted.length > 0) {
      out.push(`⚠️ **TRIGGER: ${drifted.length} feature(s) drifted >1σ from calibration** — consider re-extracting V7_STATS`);
    }
    out.push('');
  }
  return out.join('\n');
}

// ── Triggers Summary ─────────────────────────────────────────────────────────

function triggersSection(rows) {
  const out = ['## Intervention Triggers\n'];
  const triggers = [];
  const d7 = windowFilter(rows, '7-Day');

  // 1. 3.5★ underperforms 3★ or 4★
  if (d7.length >= 10) {
    const s3 = d7.filter(r => r.peakStars === 3);
    const s35 = d7.filter(r => r.peakStars === 3.5);
    const s4 = d7.filter(r => r.peakStars === 4);
    const wr3 = s3.length >= 3 ? s3.filter(r => r.won).length / s3.length : null;
    const wr35 = s35.length >= 3 ? s35.filter(r => r.won).length / s35.length : null;
    const wr4 = s4.length >= 3 ? s4.filter(r => r.won).length / s4.length : null;
    if (wr35 != null && wr3 != null && wr35 < wr3 - 0.05) {
      triggers.push(`3.5★ WR (${(wr35*100).toFixed(0)}%) underperforms 3★ (${(wr3*100).toFixed(0)}%) over 7 days`);
    }
    if (wr35 != null && wr4 != null && wr35 < wr4 - 0.10) {
      triggers.push(`3.5★ WR (${(wr35*100).toFixed(0)}%) significantly trails 4★ (${(wr4*100).toFixed(0)}%) over 7 days`);
    }
  }

  // 2. Upgraded picks underperform unchanged
  if (d7.length >= 5) {
    const up = d7.filter(r => r.starDelta > 0);
    const unch = d7.filter(r => r.starDelta === 0);
    if (up.length >= 3 && unch.length >= 3) {
      const upWR = up.filter(r => r.won).length / up.length;
      const unchWR = unch.filter(r => r.won).length / unch.length;
      if (upWR < unchWR - 0.05) {
        triggers.push(`Upgraded picks WR (${(upWR*100).toFixed(0)}%) trails unchanged (${(unchWR*100).toFixed(0)}%)`);
      }
    }
  }

  // 3. Disagreement underperforms
  if (d7.length >= 5) {
    const disagree = d7.filter(r => r.disagreement === 1);
    if (disagree.length >= 3) {
      const wrD = disagree.filter(r => r.won).length / disagree.length;
      if (wrD < 0.40) {
        triggers.push(`Signal disagreement picks at ${(wrD*100).toFixed(0)}% WR (below 40% threshold)`);
      }
    }
  }

  // 4. Model ROI trails flat ROI
  if (d7.length >= 10) {
    const flatPL = d7.reduce((s, r) => {
      if (r.won) { const o = r.peakOdds || r.lockOdds; return s + (o < 0 ? 100/Math.abs(o) : o/100); }
      return s - 1;
    }, 0);
    const modelPL = d7.reduce((s, r) => s + r.profit, 0);
    if (modelPL < flatPL - 2) {
      triggers.push(`Model ROI trails flat ROI by ${(flatPL - modelPL).toFixed(1)}u — sizing may be hurting`);
    }
  }

  // 5. Volume spike in weak bands
  if (d7.length >= 10) {
    const mid = d7.filter(r => r.peakStars >= 2.5 && r.peakStars <= 3);
    const midPct = mid.length / d7.length;
    if (midPct > 0.50) {
      triggers.push(`${(midPct*100).toFixed(0)}% of 7-day picks are in 2.5-3★ range (>50% threshold)`);
    }
  }

  if (triggers.length === 0) {
    out.push('✅ **No intervention triggers fired.** System is operating within normal parameters.');
  } else {
    for (const t of triggers) {
      out.push(`⚠️ **${t}**`);
    }
  }
  return out.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('Exporting picks from Firebase...');
  const rows = await exportPicks();
  console.log(`Exported ${rows.length} completed picks.`);

  if (rows.length === 0) {
    console.log('No completed picks found. Exiting.');
    process.exit(0);
  }

  const today = etToday();
  const report = [
    `# V7 Daily Performance Report`,
    `**Generated**: ${today} ET | **Total Completed Picks**: ${rows.length} | **V7 Live Since**: ${V7_LIVE_DATE}\n`,
    '---\n',
    triggersSection(rows),
    '\n---\n',
    tab1_executive(rows),
    '\n---\n',
    tab2_starLadder(rows),
    '\n---\n',
    tab3_lockVsUpdate(rows),
    '\n---\n',
    tab4_twoSided(rows),
    '\n---\n',
    tab5_middleTier(rows),
    '\n---\n',
    tab6_factorLeaderboard(rows),
    '\n---\n',
    tab7_sizing(rows),
    '\n---\n',
    tab8_regimeAudit(rows),
    '\n---\n',
    tab9_boardComposition(rows),
    '\n---\n',
    tab10_drift(rows),
  ];

  const outPath = join(__dirname, '../DAILY_V7_REPORT.md');
  writeFileSync(outPath, report.join('\n'));
  console.log(`\nReport written to ${outPath}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
