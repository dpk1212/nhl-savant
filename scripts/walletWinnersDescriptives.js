/**
 * walletWinnersDescriptives.js — deep descriptive stats on our winning cohort.
 *
 * For each (wallet × sport) where the wallet is profitable (flat PnL > 0)
 * and has ≥ min bets in that sport, produce a row with:
 *   - N, W, L, WR%
 *   - avg / median / max bet size ($)
 *   - total $ invested
 *   - dollar PnL, dollar ROI, flat ROI
 *   - days active, span (days), bets/day
 *   - first date, last date
 *
 * Then roll it up into cohort-level quartile distributions and a per-sport
 * summary so we know: who our winners are, how often they bet, how big
 * they bet, how consistently they show up.
 *
 * Data source: `v8Scoring.walletDetails[]` on graded sharpFlow{Picks,
 * Spreads,Totals}, same as walletGrowthReport.js for direct comparability.
 *
 * Output: WALLET_WINNERS_DESCRIPTIVES.md + console summary.
 *
 * Usage:  node scripts/walletWinnersDescriptives.js
 *         node scripts/walletWinnersDescriptives.js --min-bets=3
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
const argv = process.argv.slice(2);
const MIN_BETS_ARG = argv.find(a => a.startsWith('--min-bets='));
const MIN_BETS = MIN_BETS_ARG ? parseInt(MIN_BETS_ARG.split('=')[1], 10) : 2;

const V8_CUTOVER = '2026-04-18';
const COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtMoney = (v) => v == null || Number.isNaN(v) ? '—' : `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const fmtMoneyShort = (v) => {
  if (v == null || Number.isNaN(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${v < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${v < 0 ? '-' : ''}$${(abs / 1_000).toFixed(1)}K`;
  return `${v < 0 ? '-' : ''}$${abs.toFixed(0)}`;
};
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

function quantile(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] != null
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
}
function distrib(vals) {
  const s = [...vals].filter(v => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!s.length) return { min: null, q25: null, median: null, q75: null, max: null, mean: null };
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  return {
    min: s[0],
    q25: quantile(s, 0.25),
    median: quantile(s, 0.5),
    q75: quantile(s, 0.75),
    max: s[s.length - 1],
    mean,
  };
}
function dayDiff(d1, d2) {
  const a = new Date(d1 + 'T00:00:00Z').getTime();
  const b = new Date(d2 + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}

// ── Load all wallet-bets from graded V8 picks ──────────────────────
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

      const seen = new Map();
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const oddsForThisSide = peak.odds ?? 0;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          if (seen.has(`${doc.id}_${w.wallet}`)) continue;
          seen.set(`${doc.id}_${w.wallet}`, true);

          const betSide = sides[w.side];
          const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? oddsForThisSide;
          const won = w.side === winningSide ? 1 : 0;
          const flat = flatProfit(betOdds, won === 1);
          const invested = Number(w.invested ?? 0);

          bets.push({
            gameKey: doc.id,
            date: d.date,
            sport: d.sport || 'UNK',
            market,
            wallet: w.wallet,
            invested,
            won,
            flat,
            dollarPnl: invested * flat,
          });
        }
      }
    }
  }
  return bets;
}

// ── Per (wallet × sport) row ───────────────────────────────────────
function buildWalletSportRows(bets, sport) {
  const slice = bets.filter(b => b.sport === sport);
  const byWallet = new Map();
  for (const b of slice) {
    if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
    byWallet.get(b.wallet).push(b);
  }
  const rows = [];
  for (const [wallet, bs] of byWallet) {
    const n = bs.length;
    if (n < MIN_BETS) continue;
    const wins = bs.filter(b => b.won === 1).length;
    const losses = n - wins;
    const wr = (wins / n) * 100;
    const sizes = bs.map(b => b.invested || 0);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / n;
    const sortedSizes = [...sizes].sort((a, b) => a - b);
    const medSize = quantile(sortedSizes, 0.5);
    const maxSize = Math.max(...sizes);
    const invested = sizes.reduce((a, b) => a + b, 0);
    const dollarPnl = bs.reduce((a, b) => a + (b.dollarPnl || 0), 0);
    const flatPnl = bs.reduce((a, b) => a + (b.flat || 0), 0);
    const flatRoi = (flatPnl / n) * 100;
    const dollarRoi = invested > 0 ? (dollarPnl / invested) * 100 : null;

    const dates = [...new Set(bs.map(b => b.date))].sort();
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const daysActive = dates.length;
    const span = dayDiff(firstDate, lastDate) + 1; // inclusive span
    const betsPerDay = n / span;

    rows.push({
      wallet,
      sport,
      n, wins, losses, wr,
      avgSize, medSize, maxSize, invested,
      dollarPnl, dollarRoi, flatPnl, flatRoi,
      firstDate, lastDate, daysActive, span, betsPerDay,
    });
  }
  return rows;
}

(async () => {
  console.log('Loading wallet bets from graded V8 picks…');
  const bets = await loadWalletBets();
  const sports = [...new Set(bets.map(b => b.sport))].sort();
  const uniqueWallets = new Set(bets.map(b => b.wallet)).size;
  const dateSpan = (() => {
    const ds = [...new Set(bets.map(b => b.date))].sort();
    return { first: ds[0], last: ds[ds.length - 1], n: ds.length };
  })();
  console.log(`Loaded ${bets.length} wallet-bets · ${uniqueWallets} unique wallets · sports ${sports.join(', ')} · ${dateSpan.n} graded dates (${dateSpan.first} → ${dateSpan.last}).\n`);

  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  // Build per (wallet × sport) rows, then split into winners/losers.
  const allRows = [];
  for (const sport of sports) allRows.push(...buildWalletSportRows(bets, sport));
  const winners = allRows.filter(r => r.flatPnl > 0);
  const losers  = allRows.filter(r => r.flatPnl <= 0);

  const out = [];
  out.push('# Wallet Winners — Descriptive Stats');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push(`**Cohort:** every (wallet × sport) combination where the wallet has ≥ ${MIN_BETS} bets in the sport AND flat PnL > 0. A wallet can appear multiple times (e.g. once for NBA, once for NHL) if it wins in both.`);
  out.push('');
  out.push(`**Source:** \`v8Scoring.walletDetails\` on graded \`sharpFlow{Picks,Spreads,Totals}\` from **${V8_CUTOVER}** onward. Dollar figures come from the wallet's own stake (\`walletDetails.invested\`). Flat units assume a 1-unit stake at peak odds.`);
  out.push('');
  out.push(`**Coverage:** ${bets.length} wallet-bets · ${uniqueWallets} unique wallets · ${dateSpan.n} graded dates (${dateSpan.first} → ${dateSpan.last}).`);
  out.push('');
  out.push(`**Cohort sizes:** ${winners.length} winning (wallet × sport) rows · ${losers.length} non-winning. Total tracked rows: ${allRows.length}.`);
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §1. PER-SPORT WINNER COHORT SUMMARY
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Winner cohort summary by sport');
  out.push('');
  out.push('Means and medians across the winning cohort in each sport. Use this to understand the typical winning wallet in each market.');
  out.push('');
  out.push(mdHeader([
    'Sport', 'Winners', 'Σ bets', 'Σ invested', 'Σ $PnL',
    'Mean WR%', 'Mean N', 'Mean avg $ size', 'Mean bets/day', 'Mean flat ROI',
  ]));
  for (const sport of sports) {
    const w = winners.filter(r => r.sport === sport);
    if (!w.length) { out.push(`| ${sport.toUpperCase()} | 0 | — | — | — | — | — | — | — | — |`); continue; }
    const sumN = w.reduce((a, b) => a + b.n, 0);
    const sumInv = w.reduce((a, b) => a + b.invested, 0);
    const sumPnl = w.reduce((a, b) => a + b.dollarPnl, 0);
    const meanWr = w.reduce((a, b) => a + b.wr, 0) / w.length;
    const meanN = sumN / w.length;
    const meanAvgSize = w.reduce((a, b) => a + b.avgSize, 0) / w.length;
    const meanBpd = w.reduce((a, b) => a + b.betsPerDay, 0) / w.length;
    const meanRoi = w.reduce((a, b) => a + b.flatRoi, 0) / w.length;
    out.push(`| ${sport.toUpperCase()} | ${w.length} | ${sumN} | ${fmtMoneyShort(sumInv)} | ${fmtMoneyShort(sumPnl)} | ${meanWr.toFixed(1)}% | ${meanN.toFixed(1)} | ${fmtMoneyShort(meanAvgSize)} | ${meanBpd.toFixed(2)} | ${sign(meanRoi)}% |`);
  }
  // ALL row
  if (winners.length) {
    const sumN = winners.reduce((a, b) => a + b.n, 0);
    const sumInv = winners.reduce((a, b) => a + b.invested, 0);
    const sumPnl = winners.reduce((a, b) => a + b.dollarPnl, 0);
    const meanWr = winners.reduce((a, b) => a + b.wr, 0) / winners.length;
    const meanN = sumN / winners.length;
    const meanAvgSize = winners.reduce((a, b) => a + b.avgSize, 0) / winners.length;
    const meanBpd = winners.reduce((a, b) => a + b.betsPerDay, 0) / winners.length;
    const meanRoi = winners.reduce((a, b) => a + b.flatRoi, 0) / winners.length;
    out.push(`| **ALL** | **${winners.length}** | **${sumN}** | **${fmtMoneyShort(sumInv)}** | **${fmtMoneyShort(sumPnl)}** | **${meanWr.toFixed(1)}%** | **${meanN.toFixed(1)}** | **${fmtMoneyShort(meanAvgSize)}** | **${meanBpd.toFixed(2)}** | **${sign(meanRoi)}%** |`);
  }
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §2. COHORT QUARTILES  (winners only)
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Winner cohort — quartile distribution');
  out.push('');
  out.push('Spread of the winning cohort across the key descriptives. Min / Q25 / median / Q75 / max across every winning (wallet × sport) row.');
  out.push('');
  const metrics = [
    ['N (bets)',          winners.map(r => r.n),          (v) => v.toFixed(1)],
    ['W',                 winners.map(r => r.wins),       (v) => v.toFixed(1)],
    ['L',                 winners.map(r => r.losses),     (v) => v.toFixed(1)],
    ['WR %',              winners.map(r => r.wr),         (v) => v.toFixed(1) + '%'],
    ['Flat ROI %',        winners.map(r => r.flatRoi),    (v) => sign(v) + '%'],
    ['$ ROI %',           winners.map(r => r.dollarRoi).filter(v => v != null), (v) => sign(v) + '%'],
    ['Avg bet size ($)',  winners.map(r => r.avgSize),    fmtMoneyShort],
    ['Median bet ($)',    winners.map(r => r.medSize),    fmtMoneyShort],
    ['Max bet ($)',       winners.map(r => r.maxSize),    fmtMoneyShort],
    ['Total $ invested',  winners.map(r => r.invested),   fmtMoneyShort],
    ['$ PnL',             winners.map(r => r.dollarPnl),  fmtMoneyShort],
    ['Days active',       winners.map(r => r.daysActive), (v) => v.toFixed(1)],
    ['Span (days)',       winners.map(r => r.span),       (v) => v.toFixed(1)],
    ['Bets / day',        winners.map(r => r.betsPerDay), (v) => v.toFixed(2)],
  ];
  out.push(mdHeader(['Metric', 'Min', 'Q25', 'Median', 'Q75', 'Max', 'Mean']));
  for (const [name, vals, fmt] of metrics) {
    const d = distrib(vals);
    out.push(`| ${name} | ${fmt(d.min)} | ${fmt(d.q25)} | ${fmt(d.median)} | ${fmt(d.q75)} | ${fmt(d.max)} | ${fmt(d.mean)} |`);
  }
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §3. WINNER DETAIL TABLES — per sport
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. Winner roster by sport');
  out.push('');
  out.push('Every winning (wallet × sport) row with the full descriptive stack. Sorted by flat ROI within each sport.');
  out.push('');
  for (const sport of sports) {
    const w = [...winners.filter(r => r.sport === sport)].sort((a, b) => b.flatRoi - a.flatRoi);
    if (!w.length) { out.push(`### ${sport.toUpperCase()}\n\n_No winners in cohort._\n`); continue; }
    out.push(`### ${sport.toUpperCase()} — ${w.length} winning wallets`);
    out.push('');
    out.push(mdHeader([
      '#', 'Wallet', 'N', 'W', 'L', 'WR%',
      'Avg $', 'Med $', 'Max $', 'Σ Invested', '$ PnL', '$ ROI', 'Flat ROI',
      'Days', 'Span', 'Bets/day', 'First', 'Last',
    ]));
    w.forEach((r, i) => {
      out.push(`| ${i + 1} | ${r.wallet} | ${r.n} | ${r.wins} | ${r.losses} | ${r.wr.toFixed(1)}% | ${fmtMoneyShort(r.avgSize)} | ${fmtMoneyShort(r.medSize)} | ${fmtMoneyShort(r.maxSize)} | ${fmtMoneyShort(r.invested)} | ${fmtMoneyShort(r.dollarPnl)} | ${sign(r.dollarRoi)}% | ${sign(r.flatRoi)}% | ${r.daysActive} | ${r.span} | ${r.betsPerDay.toFixed(2)} | ${r.firstDate.slice(5)} | ${r.lastDate.slice(5)} |`);
    });
    out.push('');
  }

  // ═════════════════════════════════════════════════════════════════
  // §4. CADENCE ARCHETYPES
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Cadence archetypes');
  out.push('');
  out.push('How do winners split between sniper (few bets, high ROI), grinder (many bets, moderate ROI), and volume (many bets, modest ROI)?');
  out.push('');
  const archetype = (r) => {
    if (r.n <= 3)  return 'Sniper (≤3 bets)';
    if (r.n <= 6)  return 'Sharp (4–6 bets)';
    if (r.n <= 10) return 'Grinder (7–10 bets)';
    return 'Volume (>10 bets)';
  };
  const bucketOrder = ['Sniper (≤3 bets)', 'Sharp (4–6 bets)', 'Grinder (7–10 bets)', 'Volume (>10 bets)'];
  const buckets = new Map(bucketOrder.map(k => [k, []]));
  for (const r of winners) buckets.get(archetype(r)).push(r);
  out.push(mdHeader(['Archetype', 'Winners', 'Σ bets', 'Mean WR%', 'Mean flat ROI', 'Mean avg $ size', 'Mean bets/day', 'Σ $ PnL']));
  for (const k of bucketOrder) {
    const rs = buckets.get(k);
    if (!rs.length) { out.push(`| ${k} | 0 | — | — | — | — | — | — |`); continue; }
    const sumN = rs.reduce((a, b) => a + b.n, 0);
    const mWr = rs.reduce((a, b) => a + b.wr, 0) / rs.length;
    const mRoi = rs.reduce((a, b) => a + b.flatRoi, 0) / rs.length;
    const mSize = rs.reduce((a, b) => a + b.avgSize, 0) / rs.length;
    const mBpd = rs.reduce((a, b) => a + b.betsPerDay, 0) / rs.length;
    const sumPnl = rs.reduce((a, b) => a + b.dollarPnl, 0);
    out.push(`| ${k} | ${rs.length} | ${sumN} | ${mWr.toFixed(1)}% | ${sign(mRoi)}% | ${fmtMoneyShort(mSize)} | ${mBpd.toFixed(2)} | ${fmtMoneyShort(sumPnl)} |`);
  }
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // Console summary
  // ═════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  WALLET WINNERS — DESCRIPTIVES · min ${MIN_BETS} bets`);
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Total tracked (wallet × sport) rows: ${allRows.length}`);
  console.log(`  Winners (flat PnL > 0):            ${winners.length}`);
  console.log(`  Non-winners:                       ${losers.length}`);
  console.log('');
  console.log('Per-sport winners:');
  for (const sport of sports) {
    const w = winners.filter(r => r.sport === sport);
    if (!w.length) { console.log(`  ${sport.toUpperCase().padEnd(6)}  0 winners`); continue; }
    const sumN = w.reduce((a, b) => a + b.n, 0);
    const meanWr = w.reduce((a, b) => a + b.wr, 0) / w.length;
    const meanAvgSize = w.reduce((a, b) => a + b.avgSize, 0) / w.length;
    const meanBpd = w.reduce((a, b) => a + b.betsPerDay, 0) / w.length;
    const meanRoi = w.reduce((a, b) => a + b.flatRoi, 0) / w.length;
    console.log(`  ${sport.toUpperCase().padEnd(6)}  winners=${String(w.length).padStart(2)}  Σbets=${String(sumN).padStart(3)}  meanWR=${meanWr.toFixed(1)}%  meanROI=${sign(meanRoi)}%  meanSize=${fmtMoneyShort(meanAvgSize).padStart(7)}  meanBets/day=${meanBpd.toFixed(2)}`);
  }
  console.log('\nCohort quartiles (winners only):');
  const keyMetrics = [
    ['N',              winners.map(r => r.n),          (v) => v.toFixed(1)],
    ['WR%',            winners.map(r => r.wr),         (v) => v.toFixed(1) + '%'],
    ['Flat ROI',       winners.map(r => r.flatRoi),    (v) => sign(v) + '%'],
    ['Avg bet ($)',    winners.map(r => r.avgSize),    fmtMoneyShort],
    ['Bets/day',       winners.map(r => r.betsPerDay), (v) => v.toFixed(2)],
    ['$ PnL',          winners.map(r => r.dollarPnl),  fmtMoneyShort],
  ];
  for (const [name, vals, fmt] of keyMetrics) {
    const d = distrib(vals);
    console.log(`  ${name.padEnd(14)}  min=${fmt(d.min).padStart(9)}  Q25=${fmt(d.q25).padStart(9)}  med=${fmt(d.median).padStart(9)}  Q75=${fmt(d.q75).padStart(9)}  max=${fmt(d.max).padStart(10)}`);
  }

  const outPath = join(__dirname, '..', 'WALLET_WINNERS_DESCRIPTIVES.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nWrote ${outPath}`);
  process.exit(0);
})();
