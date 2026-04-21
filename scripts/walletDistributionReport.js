/**
 * walletDistributionReport.js — descriptive statistics for the sharp
 * wallet population, so we know exactly what we're about to store.
 *
 * Output: WALLET_DISTRIBUTION_REPORT.md
 *
 * Sections
 *   §1. Population counts (unique wallets, bets, coverage by source)
 *   §2. Bet-size distribution (per-bet invested $ — full quantile grid)
 *   §3. Per-wallet activity distribution (#bets, total invested)
 *   §4. Performance distributions (per-wallet WR, flat ROI, dollar ROI, PnL)
 *   §5. Wallet-quality signal distributions (walletBase, roiNorm, rank, sizeRatio)
 *   §6. Where does "the average wallet" sit? (median wallet profile)
 *   §7. Quality-band counts (how many wallets clear each threshold)
 *   §8. Cross-tabs (WR by quality band, $ROI by leaderboard rank bucket)
 *   §9. Source overlap & reliability (wallets seen in both A and B)
 *   §10. Top-/bottom-tail snapshots
 *   §11. Sample-size caveats
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
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
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
const americanToDecimal = (o) => (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o));
const flatProfit = (o, won) => (won ? americanToDecimal(o) - 1 : -1);

const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(d));
const n1 = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : Number(v).toFixed(d));
const money = (v) => (v == null || Number.isNaN(v) ? '—' : (v < 0 ? '-$' : '$') + Math.abs(Math.round(v)).toLocaleString());
const pct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${Number(v).toFixed(d)}%`);

// ── Percentile on sorted (ascending) array; linear interpolation ───
function quantile(sortedAsc, q) {
  const a = sortedAsc;
  if (!a.length) return null;
  if (q <= 0) return a[0];
  if (q >= 1) return a[a.length - 1];
  const pos = (a.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos), w = pos - lo;
  return a[lo] * (1 - w) + a[hi] * w;
}

function describe(label, arr) {
  const a = arr.filter(v => v != null && !Number.isNaN(v)).slice().sort((x, y) => x - y);
  if (!a.length) return { label, n: 0 };
  const mean = a.reduce((s, v) => s + v, 0) / a.length;
  const std = Math.sqrt(a.reduce((s, v) => s + (v - mean) ** 2, 0) / a.length);
  return {
    label, n: a.length,
    min: a[0], p05: quantile(a, 0.05), p10: quantile(a, 0.10),
    p25: quantile(a, 0.25), p50: quantile(a, 0.50), p75: quantile(a, 0.75),
    p90: quantile(a, 0.90), p95: quantile(a, 0.95), max: a[a.length - 1],
    mean, std,
  };
}

function describeRow(d, fmt = n1) {
  return `| ${d.label} | ${d.n} | ${fmt(d.min)} | ${fmt(d.p05)} | ${fmt(d.p10)} | ${fmt(d.p25)} | **${fmt(d.p50)}** | ${fmt(d.p75)} | ${fmt(d.p90)} | ${fmt(d.p95)} | ${fmt(d.max)} | ${fmt(d.mean)} | ${fmt(d.std)} |`;
}

// ── Loaders (trimmed copies from walletPerformanceReport) ──────────
async function loadWalletBets() {
  const bets = [];
  for (const [col, market] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const anyGraded = Object.values(sides).some(s => s.result?.outcome === 'WIN' || s.result?.outcome === 'LOSS');
      if (!anyGraded) continue;
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk].result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;

      const seen = new Set();
      for (const [, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const oddsForThisSide = peak.odds ?? 0;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const k = `${doc.id}_${w.wallet}`;
          if (seen.has(k)) continue;
          seen.add(k);
          const betSide = sides[w.side];
          const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? oddsForThisSide;
          const won = w.side === winningSide ? 1 : 0;
          bets.push({
            gameKey: doc.id, date: d.date, sport: d.sport, market,
            wallet: w.wallet, side: w.side, odds: betOdds,
            invested: w.invested ?? 0,
            walletBase: w.walletBase ?? null,
            roiNorm: w.roiNorm ?? null,
            rankNorm: w.rankNorm ?? null,
            rank: w.rank ?? null,
            lifetimeRoi: w.roi ?? null,
            lifetimePnl: w.pnl ?? null,
            contribution: w.contribution ?? null,
            sizeRatio: w.sizeRatio ?? null,
            won, flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    if (invested <= 0) return;
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    rows.push({
      date: d.date, sport: d.sport, market: d.marketType,
      wallet: walletShort, walletShort, walletAddress: d.wallet,
      tier: d.tier, side: d.side, invested,
      settledPnl: Number(d.settledPnl ?? 0),
      avgPrice: d.avgPrice ?? null,
      leaderboardRank: d.leaderboardRank ?? null,
      sportROI: d.sportROI ?? null,
      sportPnlTotal: d.sportPnlTotal ?? null,
      won: Number(d.settledPnl ?? 0) > 0 ? 1 : 0,
    });
  });
  return rows;
}

// ── Aggregators ────────────────────────────────────────────────────
function aggregateWalletsFromBetsA(bets) {
  const m = new Map();
  for (const b of bets) {
    if (!m.has(b.wallet)) m.set(b.wallet, []);
    m.get(b.wallet).push(b);
  }
  return [...m.entries()].map(([wallet, arr]) => {
    const n = arr.length;
    const wins = arr.filter(b => b.won).length;
    const flatPnl = arr.reduce((s, b) => s + (b.flat ?? 0), 0);
    return {
      wallet, n, wins, wr: n ? (wins / n) * 100 : 0,
      flatPnl, flatRoi: n ? (flatPnl / n) * 100 : 0,
      // Latest snapshots (take the most recent date's row)
      latest: arr.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0],
    };
  });
}

function aggregateWalletsFromPositions(positions) {
  const m = new Map();
  for (const p of positions) {
    if (!m.has(p.wallet)) m.set(p.wallet, []);
    m.get(p.wallet).push(p);
  }
  return [...m.entries()].map(([wallet, arr]) => {
    const n = arr.length;
    const wins = arr.filter(p => p.won).length;
    const invested = arr.reduce((s, p) => s + p.invested, 0);
    const pnl = arr.reduce((s, p) => s + p.settledPnl, 0);
    const latest = arr.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
    return {
      wallet, n, wins, wr: n ? (wins / n) * 100 : 0,
      invested, pnl, dollarRoi: invested > 0 ? (pnl / invested) * 100 : null,
      tier: latest?.tier ?? null,
      leaderboardRank: latest?.leaderboardRank ?? null,
    };
  });
}

// ── Run ────────────────────────────────────────────────────────────
(async () => {
  console.log('Loading walletDetails bets (Source A)…');
  const betsA = await loadWalletBets();
  console.log(`  ${betsA.length} wallet-bets across ${new Set(betsA.map(b => b.wallet)).size} unique wallets`);
  console.log('Loading sharp_action_positions (Source B)…');
  const positions = await loadPositions();
  console.log(`  ${positions.length} positions across ${new Set(positions.map(p => p.wallet)).size} unique wallets`);

  const walletsA = aggregateWalletsFromBetsA(betsA);
  const walletsB = aggregateWalletsFromPositions(positions);
  const allWalletIds = new Set([...walletsA.map(w => w.wallet), ...walletsB.map(w => w.wallet)]);

  const datesA = [...new Set(betsA.map(b => b.date))].sort();
  const datesB = [...new Set(positions.map(p => p.date))].sort();

  // Build output ---------------------------------------------------
  const out = [];
  const push = (...lines) => lines.forEach(l => out.push(l));

  push(
    '# Wallet Distribution Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '> Descriptive statistics for every sharp wallet observed across both data',
    '> sources, ahead of committing to the `walletBets` Firestore collection.',
    '',
    '---',
    '',
  );

  // §1. Population counts -----------------------------------------
  push('## §1. Population counts', '');
  push('| Metric | Source A (walletDetails) | Source B (positions) |');
  push('|---|---|---|');
  push(`| Unique wallets | ${walletsA.length} | ${walletsB.length} |`);
  push(`| Wallet-bets | ${betsA.length} | ${positions.length} |`);
  push(`| Unique games / date-span | ${new Set(betsA.map(b => b.gameKey)).size} / ${datesA[0]} → ${datesA[datesA.length - 1]} (${datesA.length}d) | — / ${datesB[0]} → ${datesB[datesB.length - 1]} (${datesB.length}d) |`);
  push(`| Total union of wallets | **${allWalletIds.size}** | |`);
  push(`| Wallets in both sources | ${walletsA.filter(w => walletsB.find(x => x.wallet === w.wallet)).length} | |`);
  push('');

  // §2. Bet-size distribution -------------------------------------
  push('## §2. Bet-size distribution (per-bet $invested)', '');
  push('| Source | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |');
  push('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  push(describeRow(describe('A: walletDetails', betsA.map(b => b.invested).filter(v => v > 0)), v => money(v)));
  push(describeRow(describe('B: positions', positions.map(p => p.invested).filter(v => v > 0)), v => money(v)));
  push('');
  push('*Bolded column (p50) = median per-bet size.*', '');

  // §3. Per-wallet activity ---------------------------------------
  push('## §3. Per-wallet activity distribution', '');
  push('**How many bets does a typical sharp wallet place in our dataset?**', '');
  push('| Source | metric | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |');
  push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  push(describeRow({ ...describe('#bets/wallet', walletsA.map(w => w.n)), label: 'A | #bets/wallet' }));
  push(describeRow({ ...describe('#bets/wallet', walletsB.map(w => w.n)), label: 'B | #bets/wallet' }));
  push(describeRow({ ...describe('$invested/wallet', walletsB.map(w => w.invested)), label: 'B | $invested/wallet' }, v => money(v)));
  push('');

  // §4. Performance distributions ---------------------------------
  push('## §4. Performance distributions (per wallet)', '');
  push('*Only wallets with at least 1 bet in the respective source.*', '');
  push('| Source | metric | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |');
  push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  push(describeRow({ ...describe('WR %', walletsA.map(w => w.wr)), label: 'A | Win Rate %' }));
  push(describeRow({ ...describe('flat ROI %', walletsA.map(w => w.flatRoi)), label: 'A | flat ROI %' }));
  push(describeRow({ ...describe('WR %', walletsB.map(w => w.wr)), label: 'B | Win Rate %' }));
  push(describeRow({ ...describe('$ ROI %', walletsB.map(w => w.dollarRoi).filter(v => v != null)), label: 'B | $ ROI %' }));
  push(describeRow({ ...describe('$ PnL', walletsB.map(w => w.pnl)), label: 'B | $ PnL' }, money));
  push('');

  // §5. Wallet-quality signal distributions -----------------------
  push('## §5. Wallet-quality signal distributions (from walletDetails snapshots)', '');
  push('*Observation-level (one row per wallet-bet). If a wallet appears many times, high-activity wallets weigh more.*', '');
  push('| Signal | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |');
  push('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  push(describeRow(describe('walletBase', betsA.map(b => b.walletBase))));
  push(describeRow(describe('roiNorm', betsA.map(b => b.roiNorm))));
  push(describeRow(describe('rankNorm', betsA.map(b => b.rankNorm))));
  push(describeRow(describe('lifetimeRoi %', betsA.map(b => b.lifetimeRoi))));
  push(describeRow(describe('contribution', betsA.map(b => b.contribution))));
  push(describeRow(describe('sizeRatio', betsA.map(b => b.sizeRatio))));
  push(describeRow(describe('rank (lower=better)', betsA.map(b => b.rank))));
  push('');
  push('**Latest per-wallet snapshot** (one row per unique wallet = closer to the "wallet population" shape):', '');
  const latestSnaps = walletsA.map(w => w.latest).filter(Boolean);
  push('| Signal | n | min | p05 | p10 | p25 | **p50** | p75 | p90 | p95 | max | mean | std |');
  push('|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  push(describeRow(describe('walletBase', latestSnaps.map(b => b.walletBase))));
  push(describeRow(describe('roiNorm', latestSnaps.map(b => b.roiNorm))));
  push(describeRow(describe('rank', latestSnaps.map(b => b.rank))));
  push(describeRow(describe('lifetimeRoi %', latestSnaps.map(b => b.lifetimeRoi))));
  push('');

  // §6. Where does the "average wallet" sit? ----------------------
  push('## §6. Where does the "average wallet" sit?', '');
  const medA = {
    wr: quantile(walletsA.map(w => w.wr).sort((a, b) => a - b), 0.5),
    flatRoi: quantile(walletsA.map(w => w.flatRoi).sort((a, b) => a - b), 0.5),
    n: quantile(walletsA.map(w => w.n).sort((a, b) => a - b), 0.5),
  };
  const medB = {
    wr: quantile(walletsB.map(w => w.wr).sort((a, b) => a - b), 0.5),
    dollarRoi: quantile(walletsB.map(w => w.dollarRoi).filter(v => v != null).sort((a, b) => a - b), 0.5),
    pnl: quantile(walletsB.map(w => w.pnl).sort((a, b) => a - b), 0.5),
    invested: quantile(walletsB.map(w => w.invested).sort((a, b) => a - b), 0.5),
    n: quantile(walletsB.map(w => w.n).sort((a, b) => a - b), 0.5),
  };
  const medSnap = {
    walletBase: quantile(latestSnaps.map(b => b.walletBase).filter(v => v != null).sort((a, b) => a - b), 0.5),
    roiNorm: quantile(latestSnaps.map(b => b.roiNorm).filter(v => v != null).sort((a, b) => a - b), 0.5),
    rank: quantile(latestSnaps.map(b => b.rank).filter(v => v != null).sort((a, b) => a - b), 0.5),
    lifetimeRoi: quantile(latestSnaps.map(b => b.lifetimeRoi).filter(v => v != null).sort((a, b) => a - b), 0.5),
  };
  push('| Median sharp wallet (Source A — picks) | value |');
  push('|---|---|');
  push(`| Win Rate | ${pct(medA.wr)} |`);
  push(`| Flat ROI | ${pct(medA.flatRoi)} |`);
  push(`| # bets in sample | ${n1(medA.n, 0)} |`);
  push(`| walletBase (latest) | ${n1(medSnap.walletBase)} |`);
  push(`| roiNorm (latest) | ${n1(medSnap.roiNorm)} |`);
  push(`| Leaderboard rank (latest) | ${n1(medSnap.rank, 0)} |`);
  push(`| Lifetime ROI % (latest) | ${pct(medSnap.lifetimeRoi, 2)} |`);
  push('');
  push('| Median sharp wallet (Source B — positions) | value |');
  push('|---|---|');
  push(`| Win Rate | ${pct(medB.wr)} |`);
  push(`| Dollar ROI | ${pct(medB.dollarRoi)} |`);
  push(`| Settled $ PnL | ${money(medB.pnl)} |`);
  push(`| Total $ invested | ${money(medB.invested)} |`);
  push(`| # positions in sample | ${n1(medB.n, 0)} |`);
  push('');

  // §7. Quality-band counts ---------------------------------------
  push('## §7. Quality-band counts — how many wallets clear each threshold?', '');
  const countBy = (arr, pred) => arr.filter(pred).length;
  const withSnap = walletsA.filter(w => w.latest && w.latest.walletBase != null && w.latest.roiNorm != null && w.latest.rank != null);
  push('| Band | definition | wallets | % of A population |');
  push('|---|---|---|---|');
  const bands = [
    ['ELITE quality',      w => w.latest.walletBase >= 80 && w.latest.roiNorm >= 80 && w.latest.rank <= 50],
    ['High walletBase',    w => w.latest.walletBase >= 80],
    ['High roiNorm',       w => w.latest.roiNorm >= 80],
    ['Mid walletBase (60–80)', w => w.latest.walletBase >= 60 && w.latest.walletBase < 80],
    ['Mid roiNorm (60–80)',    w => w.latest.roiNorm >= 60 && w.latest.roiNorm < 80],
    ['Top-50 rank',        w => w.latest.rank <= 50],
    ['Top-100 rank',       w => w.latest.rank <= 100],
    ['Top-250 rank',       w => w.latest.rank <= 250],
    ['Lifetime ROI ≥ 10%', w => (w.latest.lifetimeRoi ?? -Infinity) >= 10],
    ['Lifetime ROI ≥ 5%',  w => (w.latest.lifetimeRoi ?? -Infinity) >= 5],
    ['Lifetime ROI ≥ 0%',  w => (w.latest.lifetimeRoi ?? -Infinity) >= 0],
    ['Lifetime ROI < 0%',  w => (w.latest.lifetimeRoi ?? Infinity) < 0],
  ];
  for (const [label, pred] of bands) {
    const c = countBy(withSnap, pred);
    push(`| ${label} | ${label.replace(' ', ' ')} | ${c} | ${pct(c / withSnap.length * 100)} |`);
  }
  push('');

  push('**Wallets with high realised performance (from Source A in-sample):**', '');
  push('| Band | wallets | % |');
  push('|---|---|---|');
  for (const [lbl, pred] of [
    ['WR ≥ 60% & ≥ 3 bets', w => w.wr >= 60 && w.n >= 3],
    ['WR ≥ 55% & ≥ 3 bets', w => w.wr >= 55 && w.n >= 3],
    ['flat ROI ≥ +10 & ≥ 3 bets', w => w.flatRoi >= 10 && w.n >= 3],
    ['flat ROI ≥ 0 & ≥ 3 bets', w => w.flatRoi >= 0 && w.n >= 3],
    ['flat ROI ≤ -20 & ≥ 3 bets', w => w.flatRoi <= -20 && w.n >= 3],
  ]) {
    const c = countBy(walletsA, pred);
    push(`| ${lbl} | ${c} | ${pct(c / walletsA.length * 100)} |`);
  }
  push('');

  push('**Wallets with high realised performance (from Source B dollars):**', '');
  push('| Band | wallets | % |');
  push('|---|---|---|');
  for (const [lbl, pred] of [
    ['$ ROI ≥ +10% & ≥ 3 positions', w => (w.dollarRoi ?? -Infinity) >= 10 && w.n >= 3],
    ['$ ROI ≥ 0 & ≥ 3 positions',    w => (w.dollarRoi ?? -Infinity) >= 0 && w.n >= 3],
    ['$ PnL ≥ +$50k',                w => (w.pnl ?? 0) >= 50_000],
    ['$ PnL ≤ -$50k',                w => (w.pnl ?? 0) <= -50_000],
    ['$ PnL ≤ -$250k',               w => (w.pnl ?? 0) <= -250_000],
  ]) {
    const c = countBy(walletsB, pred);
    push(`| ${lbl} | ${c} | ${pct(c / walletsB.length * 100)} |`);
  }
  push('');

  // §8. Cross-tabs ------------------------------------------------
  push('## §8. Cross-tabs — does wallet quality predict performance?', '');

  // Bucket on latest snapshot signal
  const qBand = (v, cuts, labels) => {
    if (v == null) return 'unknown';
    for (let i = 0; i < cuts.length; i++) if (v < cuts[i]) return labels[i];
    return labels[labels.length - 1];
  };

  // roiNorm buckets (latest)
  const bandsByLabel = {};
  for (const w of withSnap) {
    const lbl = qBand(w.latest.roiNorm, [40, 60, 80], ['<40', '40–60', '60–80', '≥80']);
    const b = bandsByLabel[lbl] ??= { n: 0, bets: 0, wins: 0, flatPnl: 0 };
    b.n += 1;
    b.bets += w.n;
    b.wins += w.wins;
    b.flatPnl += w.flatPnl;
  }
  push('**Per-wallet performance bucketed by roiNorm (latest):**', '');
  push('| roiNorm band | wallets | wallet-bets | WR % | flat ROI % |');
  push('|---|---|---|---|---|');
  for (const k of ['<40', '40–60', '60–80', '≥80']) {
    const b = bandsByLabel[k] || { n: 0, bets: 0, wins: 0, flatPnl: 0 };
    const wr = b.bets ? (b.wins / b.bets * 100) : null;
    const roi = b.bets ? (b.flatPnl / b.bets * 100) : null;
    push(`| ${k} | ${b.n} | ${b.bets} | ${pct(wr)} | ${pct(roi)} |`);
  }
  push('');

  // walletBase buckets (latest)
  const wbBands = {};
  for (const w of withSnap) {
    const lbl = qBand(w.latest.walletBase, [40, 60, 80], ['<40', '40–60', '60–80', '≥80']);
    const b = wbBands[lbl] ??= { n: 0, bets: 0, wins: 0, flatPnl: 0 };
    b.n += 1; b.bets += w.n; b.wins += w.wins; b.flatPnl += w.flatPnl;
  }
  push('**Per-wallet performance bucketed by walletBase (latest):**', '');
  push('| walletBase band | wallets | wallet-bets | WR % | flat ROI % |');
  push('|---|---|---|---|---|');
  for (const k of ['<40', '40–60', '60–80', '≥80']) {
    const b = wbBands[k] || { n: 0, bets: 0, wins: 0, flatPnl: 0 };
    const wr = b.bets ? (b.wins / b.bets * 100) : null;
    const roi = b.bets ? (b.flatPnl / b.bets * 100) : null;
    push(`| ${k} | ${b.n} | ${b.bets} | ${pct(wr)} | ${pct(roi)} |`);
  }
  push('');

  // Source B leaderboardRank buckets
  const lbBands = {};
  for (const p of positions) {
    const lbl = qBand(p.leaderboardRank, [50, 150, 350], ['≤50', '51–150', '151–350', '>350']);
    const b = lbBands[lbl] ??= { pos: 0, wins: 0, inv: 0, pnl: 0 };
    b.pos += 1; b.wins += p.won; b.inv += p.invested; b.pnl += p.settledPnl;
  }
  push('**Source B — performance bucketed by leaderboardRank at bet time:**', '');
  push('| LB-rank band | positions | WR % | $ invested | $ PnL | $ ROI % |');
  push('|---|---|---|---|---|---|');
  for (const k of ['≤50', '51–150', '151–350', '>350', 'unknown']) {
    const b = lbBands[k]; if (!b) continue;
    const wr = b.pos ? b.wins / b.pos * 100 : null;
    const roi = b.inv > 0 ? b.pnl / b.inv * 100 : null;
    push(`| ${k} | ${b.pos} | ${pct(wr)} | ${money(b.inv)} | ${money(b.pnl)} | ${pct(roi)} |`);
  }
  push('');

  // §9. Source overlap & reliability ------------------------------
  const inBoth = walletsA.filter(w => walletsB.find(x => x.wallet === w.wallet));
  const inAonly = walletsA.filter(w => !walletsB.find(x => x.wallet === w.wallet));
  const inBonly = walletsB.filter(w => !walletsA.find(x => x.wallet === w.wallet));
  push('## §9. Source overlap', '');
  push(`- Wallets in **both** sources: **${inBoth.length}** (${pct(inBoth.length / allWalletIds.size * 100)} of total)`);
  push(`- Only in walletDetails: ${inAonly.length}`);
  push(`- Only in positions:     ${inBonly.length}`);
  push('');
  if (inBoth.length) {
    const joined = inBoth.map(a => {
      const b = walletsB.find(x => x.wallet === a.wallet);
      return { wallet: a.wallet, wrA: a.wr, roiA: a.flatRoi, wrB: b.wr, roiB: b.dollarRoi, pnlB: b.pnl };
    });
    const bothWinners = joined.filter(w => w.roiA > 0 && (w.roiB ?? -Infinity) > 0);
    const bothLosers = joined.filter(w => w.roiA < 0 && (w.roiB ?? Infinity) < 0);
    const disagree = joined.filter(w => (w.roiA > 0) !== ((w.roiB ?? 0) > 0));
    push(`- Confirmed winners (positive on both): **${bothWinners.length}**`);
    push(`- Confirmed bleeders (negative on both): **${bothLosers.length}**`);
    push(`- Mixed / disagreeing sign: ${disagree.length}`);
    push('');
  }

  // §10. Tails ----------------------------------------------------
  push('## §10. Tail snapshots', '');
  push('**Top 10 wallets by flat ROI (Source A, ≥ 3 bets):**', '');
  const topA = walletsA.filter(w => w.n >= 3).sort((a, b) => b.flatRoi - a.flatRoi).slice(0, 10);
  push('| wallet | n | WR | flat ROI | flat PnL (u) | walletBase | roiNorm | rank |');
  push('|---|---|---|---|---|---|---|---|');
  for (const w of topA) {
    push(`| \`${w.wallet}\` | ${w.n} | ${pct(w.wr)} | ${pct(w.flatRoi)} | ${sign(w.flatPnl, 2)} | ${n1(w.latest?.walletBase)} | ${n1(w.latest?.roiNorm)} | ${n1(w.latest?.rank, 0)} |`);
  }
  push('');
  push('**Bottom 10 wallets by flat ROI (Source A, ≥ 3 bets):**', '');
  const botA = walletsA.filter(w => w.n >= 3).sort((a, b) => a.flatRoi - b.flatRoi).slice(0, 10);
  push('| wallet | n | WR | flat ROI | flat PnL (u) | walletBase | roiNorm | rank |');
  push('|---|---|---|---|---|---|---|---|');
  for (const w of botA) {
    push(`| \`${w.wallet}\` | ${w.n} | ${pct(w.wr)} | ${pct(w.flatRoi)} | ${sign(w.flatPnl, 2)} | ${n1(w.latest?.walletBase)} | ${n1(w.latest?.roiNorm)} | ${n1(w.latest?.rank, 0)} |`);
  }
  push('');

  push('**Top 10 wallets by dollar PnL (Source B):**', '');
  const topB = walletsB.slice().sort((a, b) => b.pnl - a.pnl).slice(0, 10);
  push('| wallet | n | WR | $ invested | $ PnL | $ ROI | tier | LB rank |');
  push('|---|---|---|---|---|---|---|---|');
  for (const w of topB) {
    push(`| \`${w.wallet}\` | ${w.n} | ${pct(w.wr)} | ${money(w.invested)} | ${money(w.pnl)} | ${pct(w.dollarRoi)} | ${w.tier ?? '—'} | ${n1(w.leaderboardRank, 0)} |`);
  }
  push('');
  push('**Bottom 10 wallets by dollar PnL (Source B):**', '');
  const botB = walletsB.slice().sort((a, b) => a.pnl - b.pnl).slice(0, 10);
  push('| wallet | n | WR | $ invested | $ PnL | $ ROI | tier | LB rank |');
  push('|---|---|---|---|---|---|---|---|');
  for (const w of botB) {
    push(`| \`${w.wallet}\` | ${w.n} | ${pct(w.wr)} | ${money(w.invested)} | ${money(w.pnl)} | ${pct(w.dollarRoi)} | ${w.tier ?? '—'} | ${n1(w.leaderboardRank, 0)} |`);
  }
  push('');

  // §11. Caveats --------------------------------------------------
  push('## §11. Sample-size caveats', '');
  push(`- Source A (walletDetails) covers ${datesA.length} days (${datesA[0]} → ${datesA[datesA.length - 1]}). V8 scoring started ${V8_CUTOVER}.`);
  push(`- Source B (positions) covers ${datesB.length} days (${datesB[0]} → ${datesB[datesB.length - 1]}). Our ingest window is short.`);
  push('- Median wallets in the sample have **very few bets** — treat per-wallet metrics as a rough prior, not as conviction.');
  push('- "flat ROI" assumes 1-unit flat staking at the tracked side\'s odds (walletDetails does not store actual $ size per wallet-bet).');
  push('- "$ ROI" is authoritative only in Source B (real invested $, real settled $).');
  push('- Population will grow each day — this report is a snapshot and should be re-run after every grading cycle.');
  push('');

  const outPath = join(__dirname, '..', 'WALLET_DISTRIBUTION_REPORT.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\n✓ Wrote ${outPath} (${out.length} lines)`);
  process.exit(0);
})();
