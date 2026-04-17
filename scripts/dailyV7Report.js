/**
 * V7 Diagnostic Performance Report
 *
 * Blame-assignment system — answers: what most explains winning,
 * and where are stars/units breaking that truth?
 *
 * Report structure:
 *  0. Intervention Triggers
 *  1. What Is Winning — Factor leaderboard with persistence
 *  2. What Is Misranked — Star calibration / rank-order test
 *  3. What Is Oversized — Sizing attribution and counterfactuals
 *  4. What The Environment Is Doing — Regime and board composition
 *  5. Interaction Tables — Star×Regime, Star×Unit, etc.
 *  6. Failure Diagnostics — Why losing despite decent WR
 *  7. Two-Step Regime System — Shadow/promoted/rejected
 *  8. Pick Health — Mute/Cancel audit
 *  9. Drift & Calibration
 *
 * Eras: Pre-V7 Regime (before 2026-04-15) | Post-V7 Regime (2026-04-15+)
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
const V7_REGIME_DATE = '2026-04-16';

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

function unitTierLabel(u) {
  if (u >= 2.5) return 'MAX';
  if (u >= 1.5) return 'STRONG';
  return 'STANDARD';
}

function v7Z(val, mean, std) { return std > 0 ? (val - mean) / std : 0; }
function pct(n, d) { return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—'; }
function avg(arr) { return arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function fmt(n) { return n != null ? (typeof n === 'number' ? n.toFixed(2) : String(n)) : '—'; }

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
        const lockAvgBet = lockSC > 0 ? lockInvested / lockSC : 0;
        const lockMoneyPct = lk?.consensusStrength?.moneyPct ?? null;
        const lockWalletPct = lk?.consensusStrength?.walletPct ?? null;
        const lockEvEdge = lk?.evEdge || 0;
        const counterSharp = lockMoneyPct != null ? Math.max(0, 100 - lockMoneyPct) : 0;

        const regime = pk?.regime || lk?.regime || 'NO_MOVE';
        const qualityProxy = pk?.qualityProxy ?? lk?.qualityProxy ?? null;
        const lockStage = sd.lockStage || (regime === 'CLEAR_MOVE' || regime === 'NEAR_START' ? 'LOCKED' : 'SHADOW');
        const promotedAt = sd.promotedAt || null;
        const promotedRegime = sd.promotedRegime || null;

        const opp = lk?.opposition || pk?.opposition || {};
        const oppSC = opp.sharpCount || 0;
        const oppInvested = opp.totalInvested || 0;

        const againstMoney = lockMoneyPct != null ? 100 - lockMoneyPct : 50;
        const moneyEdge = lockMoneyPct != null ? Math.log((lockMoneyPct + 1) / (againstMoney + 1)) : 0;
        const sharpEdge = Math.log((lockSC + 1) / (oppSC + 1));
        const mktDom = 0.6 * moneyEdge + 0.4 * sharpEdge;
        const hasBoth = oppSC > 0 && lockSC > 0;
        const disagreement = hasBoth && Math.sign(moneyEdge) !== Math.sign(sharpEdge) ? 1 : 0;

        const moneyEdge_z = v7Z(moneyEdge, V7_STATS.moneyEdge.mean, V7_STATS.moneyEdge.std);
        const mktDom_z = v7Z(mktDom, V7_STATS.mktDominance.mean, V7_STATS.mktDominance.std);

        const contra1 = ((lockMoneyPct || 0) >= 80 && counterSharp >= 30) ? 1 : 0;
        const contra2 = (lockSC >= 7 && (lockMoneyPct || 0) < 65) ? 1 : 0;
        const contradictions = contra1 + contra2;

        const ob = oddsBand(lockOdds);
        const health = sd.health || null;
        const healthStatus = health?.status || 'ACTIVE';
        const healthReasons = health?.reasons || [];

        const flatWinAmt = won ? (lockOdds < 0 ? 100 / Math.abs(lockOdds) : lockOdds / 100) : -1;

        rows.push({
          date: data.date, sport: data.sport || 'NHL', marketType: mktType,
          won, profit, lockOdds, peakOdds, ob, flatWinAmt,
          lockStars, peakStars, starDelta,
          lockUnits, peakUnits, unitDelta, unitTier: unitTierLabel(peakUnits),
          lockSC, lockInvested, lockAvgBet,
          lockMoneyPct, lockWalletPct, lockEvEdge,
          counterSharp, contradictions,
          regime, qualityProxy, lockStage, promotedAt, promotedRegime,
          oppSC, oppInvested,
          moneyEdge, sharpEdge, mktDom, disagreement,
          moneyEdge_z, mktDom_z,
          clv, closingProb, lockPinnProb, lockProb,
          healthStatus, healthReasons,
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
  if (label === 'Today') return rows.filter(r => r.date === today);
  if (label === 'Yesterday') return rows.filter(r => r.date === etNDaysAgo(1));
  if (label === '3-Day') return rows.filter(r => r.date >= etNDaysAgo(3));
  if (label === '7-Day') return rows.filter(r => r.date >= etNDaysAgo(7));
  if (label === 'Post-Regime') return rows.filter(r => r.date >= V7_REGIME_DATE);
  if (label === 'Pre-Regime') return rows.filter(r => r.date >= V7_LIVE_DATE && r.date < V7_REGIME_DATE);
  if (label === 'V7 Era') return rows.filter(r => r.date >= V7_LIVE_DATE);
  return rows;
}

const ERA_WINDOWS = ['Post-Regime', 'Pre-Regime', 'V7 Era', 'All Time'];
const TREND_WINDOWS = ['Today', '3-Day', '7-Day', 'V7 Era', 'All Time'];

// ── Aggregation ──────────────────────────────────────────────────────────────

function agg(rows) {
  if (rows.length === 0) return { n: 0, wr: '—', flatROI: '—', modelROI: '—', avgCLV: '—', clvPos: '—', avgStars: '—', avgUnits: '—', flatPL: '0.00', modelPL: '0.00' };
  const n = rows.length;
  const wins = rows.filter(r => r.won).length;
  const flatPL = rows.reduce((s, r) => s + r.flatWinAmt, 0);
  const modelPL = rows.reduce((s, r) => s + r.profit, 0);
  const totalUnitsRisked = rows.reduce((s, r) => s + r.peakUnits, 0);
  const clvRows = rows.filter(r => r.clv != null);
  const avgCLV = clvRows.length > 0 ? avg(clvRows.map(r => r.clv)) : null;
  const clvPos = clvRows.length > 0 ? clvRows.filter(r => r.clv > 0).length / clvRows.length : null;

  return {
    n, wins,
    wr: pct(wins, n),
    flatROI: (flatPL / n * 100).toFixed(1) + '%',
    flatPL: flatPL.toFixed(2),
    modelROI: totalUnitsRisked > 0 ? (modelPL / totalUnitsRisked * 100).toFixed(1) + '%' : '—',
    modelPL: modelPL.toFixed(2),
    sizingEdge: (modelPL - flatPL).toFixed(2),
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
  if (valid.length < 6) return [];
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
    qs.push({ label: `Q${i + 1} (${slice[0][key]?.toFixed(2)}–${slice[slice.length - 1][key]?.toFixed(2)})`, ...agg(slice) });
  }
  return qs;
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

// ── 0. Intervention Triggers ─────────────────────────────────────────────────

function sec0_triggers(rows) {
  const out = ['## 0. Intervention Triggers\n'];
  const triggers = [];
  const d7 = windowFilter(rows, '7-Day');
  const post = windowFilter(rows, 'Post-Regime');

  // Star ladder inversions
  if (d7.length >= 10) {
    const bk = starBuckets(d7);
    for (let i = 0; i < bk.length - 1; i++) {
      const hi = bk[i], lo = bk[i + 1];
      if (hi.n >= 3 && lo.n >= 3) {
        const hiWR = parseFloat(hi.wr), loWR = parseFloat(lo.wr);
        if (loWR > hiWR + 5) {
          triggers.push(`Star inversion: ${lo.stars}★ WR (${lo.wr}) beats ${hi.stars}★ (${hi.wr}) over 7 days`);
        }
      }
    }
  }

  // Sizing hurting
  if (d7.length >= 10) {
    const flatPL = d7.reduce((s, r) => s + r.flatWinAmt, 0);
    const modelPL = d7.reduce((s, r) => s + r.profit, 0);
    if (modelPL < flatPL - 2) {
      triggers.push(`Model P/L trails flat P/L by ${(flatPL - modelPL).toFixed(1)}u — sizing is amplifying losses`);
    }
  }

  // Upgraded picks underperform unchanged
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

  // NO_MOVE overexposure
  if (d7.length >= 10) {
    const noMove = d7.filter(r => r.regime === 'NO_MOVE');
    const noMovePct = noMove.length / d7.length;
    if (noMovePct > 0.40) {
      const a = agg(noMove);
      triggers.push(`${(noMovePct*100).toFixed(0)}% of 7-day picks are NO_MOVE (WR: ${a.wr}, ROI: ${a.flatROI})`);
    }
  }

  // MAX tier losses
  if (d7.length >= 5) {
    const maxTier = d7.filter(r => r.peakUnits >= 2.5);
    if (maxTier.length >= 3) {
      const maxPL = maxTier.reduce((s, r) => s + r.profit, 0);
      if (maxPL < -3) {
        triggers.push(`MAX tier (≥2.5u) losing ${Math.abs(maxPL).toFixed(1)}u over 7 days`);
      }
    }
  }

  // Negative CLV despite ok WR
  if (d7.length >= 10) {
    const clvRows = d7.filter(r => r.clv != null);
    if (clvRows.length >= 5) {
      const avgClv = avg(clvRows.map(r => r.clv));
      const wr = d7.filter(r => r.won).length / d7.length;
      if (avgClv < -0.01 && wr >= 0.45) {
        triggers.push(`Negative CLV (${(avgClv*100).toFixed(2)}%) despite ${(wr*100).toFixed(0)}% WR — getting bad prices`);
      }
    }
  }

  // Signal disagreement
  if (d7.length >= 5) {
    const disagree = d7.filter(r => r.disagreement === 1);
    if (disagree.length >= 3) {
      const wrD = disagree.filter(r => r.won).length / disagree.length;
      if (wrD < 0.40) {
        triggers.push(`Signal disagreement picks at ${(wrD*100).toFixed(0)}% WR (below 40%)`);
      }
    }
  }

  // Muted outperforming active
  if (d7.length >= 10) {
    const active = d7.filter(r => r.healthStatus === 'ACTIVE');
    const muted = d7.filter(r => r.healthStatus === 'MUTED');
    if (active.length >= 3 && muted.length >= 3) {
      const aWR = active.filter(r => r.won).length / active.length;
      const mWR = muted.filter(r => r.won).length / muted.length;
      if (mWR > aWR + 0.05) {
        triggers.push(`MUTED WR (${(mWR*100).toFixed(0)}%) exceeds ACTIVE (${(aWR*100).toFixed(0)}%) — mute thresholds too aggressive`);
      }
    }
  }

  if (triggers.length === 0) {
    out.push('**No intervention triggers fired.** System operating within parameters.');
  } else {
    for (const t of triggers) out.push(`- **${t}**`);
  }
  return out.join('\n');
}

// ── 1. What Is Winning — Factor Leaderboard ──────────────────────────────────

function sec1_truthFinder(rows) {
  const out = ['## 1. What Is Winning — Truth Finder Leaderboard\n'];
  out.push('Factors ranked by signal persistence across time windows. Higher signal score = more reliable.\n');

  const factors = [
    { key: 'lockMoneyPct', label: 'Money %' },
    { key: 'moneyEdge', label: 'Money Edge' },
    { key: 'mktDom', label: 'Market Dominance' },
    { key: 'sharpEdge', label: 'Sharp Edge' },
    { key: 'lockAvgBet', label: 'Avg Bet Size' },
    { key: 'lockInvested', label: 'Total Invested' },
    { key: 'lockSC', label: 'Sharp Count' },
    { key: 'counterSharp', label: 'Counter Sharp' },
    { key: 'lockEvEdge', label: 'EV Edge' },
    { key: 'oppSC', label: 'Against Sharp Count' },
    { key: 'mktDom_z', label: 'Market Dom (z)' },
    { key: 'moneyEdge_z', label: 'Money Edge (z)' },
  ];

  const windows = ['7-Day', 'Post-Regime', 'V7 Era', 'All Time'];

  function monoScore(rows, key) {
    const q = quintiles(rows, key);
    if (q.length < 5) return { wrMono: null, flatMono: null, clvMono: null, spread: null };
    const wrs = q.map(b => parseFloat(b.wr) || 0);
    const flatROIs = q.map(b => parseFloat(b.flatROI) || 0);
    const clvs = q.map(b => parseFloat(b.avgCLV) || 0);
    const mono = (arr) => { let s = 0; for (let i = 1; i < arr.length; i++) { if (arr[i] > arr[i-1]) s++; else if (arr[i] < arr[i-1]) s--; } return s; };
    return { wrMono: mono(wrs), flatMono: mono(flatROIs), clvMono: mono(clvs), spread: (wrs[4] - wrs[0]).toFixed(1) };
  }

  const composite = {};
  for (const f of factors) {
    const scores = {};
    let totalSignal = 0;
    let validWindows = 0;
    for (const w of windows) {
      const sub = windowFilter(rows, w);
      if (sub.length < 10) continue;
      const ms = monoScore(sub, f.key);
      if (ms.wrMono == null) continue;
      scores[w] = ms;
      totalSignal += (ms.wrMono + ms.clvMono) + Math.abs(parseFloat(ms.spread) || 0) / 10;
      validWindows++;
    }
    if (validWindows > 0) {
      composite[f.label] = {
        scores,
        signalScore: (totalSignal / validWindows).toFixed(2),
        persistence: validWindows,
      };
    }
  }

  const ranked = Object.entries(composite).sort((a, b) => parseFloat(b[1].signalScore) - parseFloat(a[1].signalScore));

  const headers = ['Rank', 'Factor', 'Signal Score', 'Persistence', ...windows.map(w => `${w} WR Mono`), ...windows.map(w => `${w} Spread`)];
  const data = ranked.map(([label, d], i) => [
    i + 1, label, d.signalScore, `${d.persistence}/${windows.length}`,
    ...windows.map(w => d.scores[w]?.wrMono ?? '—'),
    ...windows.map(w => d.scores[w]?.spread != null ? d.scores[w].spread + '%' : '—'),
  ]);
  out.push(mdTable(headers, data));

  const topFactor = ranked[0];
  if (topFactor) {
    out.push(`\n**Strongest surviving signal**: ${topFactor[0]} (score: ${topFactor[1].signalScore})`);
  }

  return out.join('\n');
}

// ── 2. What Is Misranked — Rank-Order Test ───────────────────────────────────

function sec2_rankOrderTest(rows) {
  const out = ['## 2. What Is Misranked — Star Calibration\n'];

  for (const era of ERA_WINDOWS) {
    const sub = windowFilter(rows, era);
    if (sub.length < 10) continue;
    out.push(`### ${era} (n=${sub.length})\n`);

    const bk = starBuckets(sub);
    if (bk.length < 2) continue;

    // Expected vs actual WR by star bucket
    const headers = ['Stars', 'N', 'Avg Implied%', 'Expected WR', 'Actual WR', 'WR Delta', 'Flat ROI', 'Model ROI', 'Avg Units', 'Sizing Verdict'];
    const data = bk.map(b => {
      const bucket = sub.filter(r => r.peakStars === b.stars);
      const avgImpl = avg(bucket.filter(r => r.lockProb != null).map(r => r.lockProb));
      const actualWR = bucket.filter(r => r.won).length / bucket.length;
      const wrDelta = avgImpl > 0 ? actualWR - avgImpl : null;
      const flatROI = parseFloat(b.flatROI) || 0;
      const verdict = flatROI > 5 ? 'Underbet' : flatROI > -5 ? 'Fair' : flatROI > -15 ? 'Overbet' : 'Massively overbet';
      return [
        b.stars, b.n,
        avgImpl > 0 ? (avgImpl * 100).toFixed(1) + '%' : '—',
        avgImpl > 0 ? (avgImpl * 100).toFixed(1) + '%' : '—',
        (actualWR * 100).toFixed(1) + '%',
        wrDelta != null ? (wrDelta > 0 ? '+' : '') + (wrDelta * 100).toFixed(1) + '%' : '—',
        b.flatROI, b.modelROI, b.avgUnits,
        verdict,
      ];
    });
    out.push(mdTable(headers, data));

    // Pairwise delta test
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

    // Spearman correlation
    if (bk.length >= 3) {
      const stars = bk.map(b => b.stars);
      const flatROIs = bk.map(b => parseFloat(b.flatROI) || 0);
      const wrs = bk.map(b => parseFloat(b.wr) || 0);
      const rhoFlat = spearman(stars, flatROIs);
      const rhoWR = spearman(stars, wrs);
      out.push(`\n**Spearman rank correlation**: Stars vs Flat ROI: ${rhoFlat != null ? rhoFlat.toFixed(3) : '—'} | Stars vs WR: ${rhoWR != null ? rhoWR.toFixed(3) : '—'}`);
      if (rhoFlat != null && rhoFlat <= 0) {
        out.push('**RANKING LAYER IS MISCALIBRATED** — higher stars are not producing better ROI');
      }
    }
    out.push('');
  }
  return out.join('\n');
}

// ── 3. What Is Oversized — Sizing Attribution ────────────────────────────────

function sec3_sizingAttribution(rows) {
  const out = ['## 3. What Is Oversized — Sizing Attribution\n'];

  for (const era of ERA_WINDOWS) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`### ${era} (n=${sub.length})\n`);

    const flatPL = sub.reduce((s, r) => s + r.flatWinAmt, 0);
    const modelPL = sub.reduce((s, r) => s + r.profit, 0);
    const lockUnitsPL = sub.reduce((s, r) => s + (r.won ? r.lockUnits * (r.lockOdds < 0 ? 100/Math.abs(r.lockOdds) : r.lockOdds/100) : -r.lockUnits), 0);
    const starsOnlyPL = sub.reduce((s, r) => {
      const u = r.starDelta > 0 ? r.peakUnits : r.lockUnits;
      return s + (r.won ? u * (r.lockOdds < 0 ? 100/Math.abs(r.lockOdds) : r.lockOdds/100) : -u);
    }, 0);

    out.push('**Counterfactual P/L**\n');
    const cfHeaders = ['Scenario', 'P/L', 'ROI', 'vs Actual'];
    const cfData = [
      ['Actual (model units)', modelPL.toFixed(2) + 'u', (modelPL / sub.reduce((s,r) => s + r.peakUnits, 0) * 100).toFixed(1) + '%', '—'],
      ['Flat 1.0u per pick', flatPL.toFixed(2) + 'u', (flatPL / sub.length * 100).toFixed(1) + '%', (modelPL - flatPL > 0 ? '+' : '') + (modelPL - flatPL).toFixed(2) + 'u'],
      ['Lock units only (no bumps)', lockUnitsPL.toFixed(2) + 'u', '—', (modelPL - lockUnitsPL > 0 ? '+' : '') + (modelPL - lockUnitsPL).toFixed(2) + 'u'],
      ['Units change only when stars change', starsOnlyPL.toFixed(2) + 'u', '—', (modelPL - starsOnlyPL > 0 ? '+' : '') + (modelPL - starsOnlyPL).toFixed(2) + 'u'],
    ];
    out.push(mdTable(cfHeaders, cfData));

    // Sizing edge by star bucket
    out.push('\n**Incremental Sizing Value by Star Bucket**\n');
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

    // Sizing edge by regime
    out.push('\n**Sizing Edge by Regime**\n');
    const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];
    const regData = regimes.map(reg => {
      const rs = sub.filter(r => r.regime === reg);
      if (rs.length < 3) return null;
      const rFlat = rs.reduce((s, r) => s + r.flatWinAmt, 0);
      const rModel = rs.reduce((s, r) => s + r.profit, 0);
      const a = agg(rs);
      return [reg, a.n, a.wr, a.flatROI, a.modelROI, (rModel - rFlat > 0 ? '+' : '') + (rModel - rFlat).toFixed(2) + 'u'];
    }).filter(Boolean);
    out.push(mdTable(['Regime', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Sizing Edge'], regData));

    // Unit increases without star improvement
    const badBumps = sub.filter(r => r.unitDelta > 0 && r.starDelta <= 0);
    if (badBumps.length > 0) {
      const bbPL = badBumps.reduce((s, r) => s + r.profit, 0);
      out.push(`\n**${badBumps.length} picks had unit increases without star improvement**: P/L ${bbPL.toFixed(2)}u, WR ${pct(badBumps.filter(r => r.won).length, badBumps.length)}`);
    }
    out.push('');
  }
  return out.join('\n');
}

// ── 4. Environment — Regime & Board Composition ──────────────────────────────

function sec4_environment(rows) {
  const out = ['## 4. What The Environment Is Doing\n'];

  // Regime performance
  out.push('### Regime Performance\n');
  const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];
  for (const era of ERA_WINDOWS) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`**${era}** (n=${sub.length})\n`);
    const headers = ['Regime', 'N', '%', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'Avg★', 'Avg Units'];
    const data = regimes.map(reg => {
      const rs = sub.filter(r => r.regime === reg);
      if (rs.length === 0) return null;
      const a = agg(rs);
      return [reg, a.n, pct(rs.length, sub.length), a.wr, a.flatROI, a.modelROI, a.avgCLV, a.avgStars, a.avgUnits];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');
  }

  // Board composition
  out.push('### Board Composition\n');
  for (const w of ['Today', '3-Day', '7-Day']) {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) continue;
    out.push(`**${w}** (${sub.length} picks)\n`);

    const sports = [...new Set(sub.map(r => r.sport))].sort();
    const sportData = sports.map(s => {
      const ss = sub.filter(r => r.sport === s);
      const a = agg(ss);
      return [s, ss.length, pct(ss.length, sub.length), a.wr, a.flatROI];
    });
    out.push(mdTable(['Sport', 'N', '%', 'WR', 'Flat ROI'], sportData));

    const bands = ['HEAVY_FAV', 'SLIGHT_FAV', 'COIN_FLIP', 'SLIGHT_DOG', 'LONG_DOG'];
    const bandData = bands.map(b => {
      const bs = sub.filter(r => r.ob === b);
      if (bs.length === 0) return null;
      const a = agg(bs);
      return [b, bs.length, pct(bs.length, sub.length), a.wr, a.flatROI];
    }).filter(Boolean);
    out.push('\n' + mdTable(['Odds Band', 'N', '%', 'WR', 'Flat ROI'], bandData));
    out.push('');
  }
  return out.join('\n');
}

// ── 5. Interaction Tables ────────────────────────────────────────────────────

function sec5_interactions(rows) {
  const out = ['## 5. Interaction Tables\n'];

  function crossTable(rows, rowKey, rowVals, colKey, colVals, label) {
    if (rows.length < 10) return '';
    const lines = [`### ${label}\n`];
    const headers = [rowKey, ...colVals.map(c => `${c} (N/WR/ROI)`)];
    const data = rowVals.map(rv => {
      const cells = colVals.map(cv => {
        const sub = rows.filter(r => r[rowKey] === rv && r[colKey] === cv);
        if (sub.length === 0) return '—';
        const a = agg(sub);
        return `${a.n} / ${a.wr} / ${a.flatROI}`;
      });
      return [rv, ...cells];
    });
    lines.push(mdTable(headers, data));
    return lines.join('\n');
  }

  const v7 = windowFilter(rows, 'V7 Era');
  if (v7.length < 15) {
    out.push('_Insufficient data for interaction tables._');
    return out.join('\n');
  }

  // Tag rows with categories
  const tagged = v7.map(r => ({
    ...r,
    starBucket: r.peakStars >= 4.5 ? '4.5-5★' : r.peakStars >= 3.5 ? '3.5-4★' : r.peakStars >= 2.5 ? '2.5-3★' : '<2.5★',
  }));
  const starVals = ['4.5-5★', '3.5-4★', '2.5-3★'];
  const regimeVals = ['CLEAR_MOVE', 'NEAR_START', 'SMALL_MOVE', 'NO_MOVE'];
  const unitVals = ['MAX', 'STRONG', 'STANDARD'];
  const oddsVals = ['HEAVY_FAV', 'SLIGHT_FAV', 'COIN_FLIP', 'SLIGHT_DOG', 'LONG_DOG'];

  // Star × Regime
  out.push(crossTable(tagged, 'starBucket', starVals, 'regime', regimeVals, 'Star × Regime'));
  out.push('\n_Tells you whether stars only work in CLEAR_MOVE / certain environments._\n');

  // Star × Unit Tier
  out.push(crossTable(tagged, 'starBucket', starVals, 'unitTier', unitVals, 'Star × Unit Tier'));
  out.push('\n_Tells you whether high-star plays are being oversized._\n');

  // Star × Odds Band
  out.push(crossTable(tagged, 'starBucket', starVals, 'ob', oddsVals, 'Star × Odds Band'));
  out.push('\n_Tells you whether certain star levels are broken only on coin flips or dogs._\n');

  // Sport × Regime
  const sports = [...new Set(tagged.map(r => r.sport))].sort();
  out.push(crossTable(tagged, 'sport', sports, 'regime', regimeVals, 'Sport × Regime'));
  out.push('\n_Tells you where NO_MOVE or CLEAR_MOVE matters most._\n');

  // Upgrade × Regime
  const upgradeTag = tagged.map(r => ({ ...r, upgradeStatus: r.starDelta > 0 ? 'Upgraded' : r.starDelta === 0 ? 'Unchanged' : 'Downgraded' }));
  out.push(crossTable(upgradeTag, 'upgradeStatus', ['Upgraded', 'Unchanged', 'Downgraded'], 'regime', regimeVals, 'Upgrade × Regime'));
  out.push('\n_Tells you whether upgrades help only in supportive regimes._\n');

  return out.join('\n');
}

// ── 6. Failure Diagnostics ───────────────────────────────────────────────────

function sec6_failureDiagnostics(rows) {
  const out = ['## 6. Failure Diagnostics — Why Are We Losing Money?\n'];

  for (const era of ['7-Day', 'Post-Regime', 'V7 Era']) {
    const sub = windowFilter(rows, era);
    if (sub.length < 5) continue;
    out.push(`### ${era} (n=${sub.length})\n`);

    const a = agg(sub);
    const wr = sub.filter(r => r.won).length / sub.length;
    const flatPL = sub.reduce((s, r) => s + r.flatWinAmt, 0);
    const modelPL = sub.reduce((s, r) => s + r.profit, 0);
    const clvRows = sub.filter(r => r.clv != null);
    const avgClv = clvRows.length > 0 ? avg(clvRows.map(r => r.clv)) : null;

    const findings = [];

    // Bad prices
    if (avgClv != null && avgClv < -0.005) {
      findings.push(`**Bad Prices**: Average CLV is ${(avgClv*100).toFixed(2)}% — we're consistently getting worse closing lines`);
    }

    // Bad ranking
    const bk = starBuckets(sub);
    const topStars = sub.filter(r => r.peakStars >= 4);
    const lowStars = sub.filter(r => r.peakStars <= 3);
    if (topStars.length >= 3 && lowStars.length >= 3) {
      const topWR = topStars.filter(r => r.won).length / topStars.length;
      const lowWR = lowStars.filter(r => r.won).length / lowStars.length;
      if (lowWR > topWR + 0.05) {
        findings.push(`**Bad Ranking**: Low-star picks (≤3★) WR ${(lowWR*100).toFixed(0)}% beating high-star (≥4★) WR ${(topWR*100).toFixed(0)}%`);
      }
    }

    // Bad sizing
    if (modelPL < flatPL - 1) {
      findings.push(`**Bad Sizing**: Model P/L (${modelPL.toFixed(2)}u) trails flat P/L (${flatPL.toFixed(2)}u) by ${(flatPL - modelPL).toFixed(2)}u — sizing is amplifying losses`);
    }

    // Bad board mix
    const noMove = sub.filter(r => r.regime === 'NO_MOVE');
    if (noMove.length > sub.length * 0.4) {
      const noMoveA = agg(noMove);
      findings.push(`**Bad Board Mix**: ${pct(noMove.length, sub.length)} of picks are NO_MOVE (WR: ${noMoveA.wr}, ROI: ${noMoveA.flatROI})`);
    }

    // MAX tier exposure
    const maxPicks = sub.filter(r => r.peakUnits >= 2.5);
    if (maxPicks.length >= 3) {
      const maxPL = maxPicks.reduce((s, r) => s + r.profit, 0);
      const maxWR = maxPicks.filter(r => r.won).length / maxPicks.length;
      if (maxPL < -2) {
        findings.push(`**Overexposed at MAX**: ${maxPicks.length} MAX-tier picks losing ${Math.abs(maxPL).toFixed(1)}u (WR: ${(maxWR*100).toFixed(0)}%)`);
      }
    }

    // Bad upgrades
    const ups = sub.filter(r => r.starDelta > 0);
    if (ups.length >= 3) {
      const upPL = ups.reduce((s, r) => s + r.profit, 0);
      if (upPL < -2) {
        findings.push(`**Bad Upgrades**: ${ups.length} upgraded picks lost ${Math.abs(upPL).toFixed(1)}u total — upgrades are adding size to wrong picks`);
      }
    }

    // Favs winning but not covering price
    const favs = sub.filter(r => r.lockProb != null && r.lockProb >= 0.55);
    if (favs.length >= 5) {
      const favWR = favs.filter(r => r.won).length / favs.length;
      const favFlatROI = favs.reduce((s, r) => s + r.flatWinAmt, 0) / favs.length;
      if (favWR >= 0.50 && favFlatROI < -0.03) {
        findings.push(`**Favs Not Covering**: ${favs.length} fav picks at ${(favWR*100).toFixed(0)}% WR but ${(favFlatROI*100).toFixed(1)}% flat ROI — winning but not enough to cover juice`);
      }
    }

    if (findings.length === 0) {
      out.push('No major failure modes detected.\n');
    } else {
      out.push('**Root cause analysis**:\n');
      for (const f of findings) out.push(`- ${f}`);
      out.push('');
    }
  }
  return out.join('\n');
}

// ── 7. Two-Step Regime System ────────────────────────────────────────────────

function sec7_twoStep(allSides, completedRows) {
  const out = ['## 7. Two-Step Regime System Audit\n'];
  out.push(`_Regime system live since ${V7_REGIME_DATE}_\n`);

  const postSides = allSides.filter(r => r.date >= V7_REGIME_DATE);
  if (postSides.length === 0) {
    out.push('_No data in Post-Regime era yet._');
    return out.join('\n');
  }

  const shadows = postSides.filter(r => r.lockStage === 'SHADOW' && !r.superseded);
  const locked = postSides.filter(r => r.lockStage === 'LOCKED' && !r.superseded);
  const promoted = postSides.filter(r => r.promotedAt != null && !r.superseded);
  const rejected = shadows.filter(r => !r.promotedAt);
  const superseded = postSides.filter(r => r.superseded);
  const muted = postSides.filter(r => r.healthStatus === 'MUTED');
  const cancelled = postSides.filter(r => r.healthStatus === 'CANCELLED');

  out.push('### Volume Summary\n');
  const volHeaders = ['Category', 'Count', '%'];
  const totalWritten = postSides.length;
  const volData = [
    ['Total Written', totalWritten, '100%'],
    ['LOCKED (direct)', locked.filter(r => !r.promotedAt).length, pct(locked.filter(r => !r.promotedAt).length, totalWritten)],
    ['Promoted (SHADOW→LOCKED)', promoted.length, pct(promoted.length, totalWritten)],
    ['Rejected (stayed SHADOW)', rejected.length, pct(rejected.length, totalWritten)],
    ['Superseded (side flipped)', superseded.length, pct(superseded.length, totalWritten)],
    ['Muted', muted.length, pct(muted.length, totalWritten)],
    ['Cancelled', cancelled.length, pct(cancelled.length, totalWritten)],
  ];
  out.push(mdTable(volHeaders, volData));

  // Promotion rate by regime
  out.push('\n### Promotion Rate by Regime\n');
  const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];
  const promoHeaders = ['Regime', 'Written', 'Promoted', 'Promotion Rate'];
  const promoData = regimes.map(reg => {
    const inRegime = postSides.filter(r => r.regime === reg && !r.superseded);
    const promoInRegime = inRegime.filter(r => r.promotedAt != null);
    if (inRegime.length === 0) return null;
    return [reg, inRegime.length, promoInRegime.length, pct(promoInRegime.length, inRegime.length)];
  }).filter(Boolean);
  out.push(mdTable(promoHeaders, promoData));

  // Promoted vs rejected performance (completed only)
  const postCompleted = completedRows.filter(r => r.date >= V7_REGIME_DATE);
  if (postCompleted.length >= 3) {
    const lockedCompleted = postCompleted.filter(r => r.lockStage === 'LOCKED');
    const shadowCompleted = postCompleted.filter(r => r.lockStage === 'SHADOW');

    if (lockedCompleted.length >= 2 || shadowCompleted.length >= 2) {
      out.push('\n### Promoted vs Rejected — Graded Results\n');
      const perfHeaders = ['Group', 'N', 'WR', 'Flat ROI', 'Model ROI', 'Avg CLV', 'Avg★'];
      const perfData = [];
      if (lockedCompleted.length > 0) {
        const a = agg(lockedCompleted);
        perfData.push(['LOCKED', a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV, a.avgStars]);
      }
      if (shadowCompleted.length > 0) {
        const a = agg(shadowCompleted);
        perfData.push(['SHADOW (rejected)', a.n, a.wr, a.flatROI, a.modelROI, a.avgCLV, a.avgStars]);
      }
      out.push(mdTable(perfHeaders, perfData));

      if (lockedCompleted.length >= 2 && shadowCompleted.length >= 2) {
        const lockedWR = lockedCompleted.filter(r => r.won).length / lockedCompleted.length;
        const shadowWR = shadowCompleted.filter(r => r.won).length / shadowCompleted.length;
        if (lockedWR > shadowWR) {
          out.push(`\nRegime filter is working: LOCKED WR (${(lockedWR*100).toFixed(0)}%) > SHADOW WR (${(shadowWR*100).toFixed(0)}%)`);
        } else {
          out.push(`\n**Regime filter NOT separating**: LOCKED WR (${(lockedWR*100).toFixed(0)}%) ≤ SHADOW WR (${(shadowWR*100).toFixed(0)}%)`);
        }
      }
    }
  }

  return out.join('\n');
}

// ── 8. Pick Health Audit ─────────────────────────────────────────────────────

function sec8_pickHealth(rows) {
  const out = ['## 8. Pick Health (Mute/Cancel) Audit\n'];

  for (const w of ['7-Day', 'Post-Regime', 'V7 Era']) {
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

// ── 9. Drift & Calibration ───────────────────────────────────────────────────

function sec9_drift(rows) {
  const out = ['## 9. Drift & Calibration\n'];

  const features = [
    { key: 'lockMoneyPct', label: 'moneyPct', frozen: V7_STATS.moneyPct },
    { key: 'lockAvgBet', label: 'avgBet', frozen: V7_STATS.avgBet },
    { key: 'lockInvested', label: 'invested', frozen: V7_STATS.invested },
    { key: 'lockSC', label: 'sharpCount', frozen: V7_STATS.sharpCount },
    { key: 'counterSharp', label: 'counterSharp', frozen: V7_STATS.counter },
    { key: 'moneyEdge', label: 'moneyEdge', frozen: V7_STATS.moneyEdge },
    { key: 'mktDom', label: 'mktDominance', frozen: V7_STATS.mktDominance },
  ];

  for (const w of ['7-Day', 'Post-Regime', 'V7 Era']) {
    const sub = windowFilter(rows, w);
    if (sub.length < 5) continue;
    out.push(`### ${w} (n=${sub.length})\n`);

    const headers = ['Feature', 'Frozen Mean', 'Live Mean', 'Drift (σ)'];
    const data = features.map(f => {
      const vals = sub.map(r => r[f.key]).filter(v => v != null && isFinite(v));
      if (vals.length === 0) return null;
      const liveMean = avg(vals);
      const dMean = liveMean - f.frozen.mean;
      const drift = f.frozen.std > 0 ? Math.abs(dMean) / f.frozen.std : 0;
      return [f.label, f.frozen.mean.toFixed(2), liveMean.toFixed(2), drift.toFixed(2) + (drift > 1.0 ? ' ⚠️' : '')];
    }).filter(Boolean);
    out.push(mdTable(headers, data));
    out.push('');
  }
  return out.join('\n');
}

// ── Executive Summary ────────────────────────────────────────────────────────

function secExec(rows) {
  const out = ['## Executive Summary\n'];
  out.push('### By Era\n');
  const eraHeaders = ['Era', 'Picks', 'WR', 'Flat P/L', 'Flat ROI', 'Model P/L', 'Model ROI', 'Sizing Edge', 'Avg CLV'];
  const eraData = ERA_WINDOWS.map(w => {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [w, a.n, a.wr, a.flatPL + 'u', a.flatROI, a.modelPL + 'u', a.modelROI, a.sizingEdge + 'u', a.avgCLV];
  }).filter(Boolean);
  out.push(mdTable(eraHeaders, eraData));

  out.push('\n### By Trend Window\n');
  const trendData = TREND_WINDOWS.map(w => {
    const sub = windowFilter(rows, w);
    if (sub.length === 0) return null;
    const a = agg(sub);
    return [w, a.n, a.wr, a.flatPL + 'u', a.flatROI, a.modelPL + 'u', a.modelROI, a.sizingEdge + 'u', a.avgCLV];
  }).filter(Boolean);
  out.push(mdTable(eraHeaders, trendData));

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

  const today = etToday();
  const report = [
    `# V7 Diagnostic Report — Blame Assignment System`,
    `**Generated**: ${today} ET | **Completed Picks**: ${completedRows.length} | **V7 Since**: ${V7_LIVE_DATE} | **Regime Since**: ${V7_REGIME_DATE}\n`,
    '---\n',
    sec0_triggers(completedRows),
    '\n---\n',
    secExec(completedRows),
    '\n---\n',
    sec1_truthFinder(completedRows),
    '\n---\n',
    sec2_rankOrderTest(completedRows),
    '\n---\n',
    sec3_sizingAttribution(completedRows),
    '\n---\n',
    sec4_environment(completedRows),
    '\n---\n',
    sec5_interactions(completedRows),
    '\n---\n',
    sec6_failureDiagnostics(completedRows),
    '\n---\n',
    sec7_twoStep(allSides, completedRows),
    '\n---\n',
    sec8_pickHealth(completedRows),
    '\n---\n',
    sec9_drift(completedRows),
  ];

  const outPath = join(__dirname, '../DAILY_V7_REPORT.md');
  writeFileSync(outPath, report.join('\n'));
  console.log(`\nReport written to ${outPath}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
