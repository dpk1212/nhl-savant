/**
 * walletGrowthReport.js — per-sport wallet roster growth + profitability.
 *
 * Answers three questions at once:
 *   1. How many unique wallets do we have tracked in each sport RIGHT NOW?
 *   2. How many of those are profitable (and how profitable)?
 *   3. How has that number grown day-by-day since the V8 cutover?
 *
 * Data source: `v8Scoring.walletDetails[]` from graded sharpFlow{Picks,
 * Spreads,Totals}. This is the same source `walletPerformanceReport.js`
 * and `walletBySportReport.js` use, so numbers are directly comparable.
 *
 * Output:
 *   - Console: per-sport snapshot + daily-growth table + distributions.
 *   - File:    WALLET_GROWTH_REPORT.md  (same content, archival).
 *
 * Usage:  node scripts/walletGrowthReport.js
 *         node scripts/walletGrowthReport.js --min-bets=3  (default 2)
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

// ─────────────────────────────────────────────────────────────────────
//  Load every wallet-bet we can derive from graded V8 picks.
//  Each row: { date, sport, wallet, won, flat, invested }
// ─────────────────────────────────────────────────────────────────────
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

          bets.push({
            gameKey: doc.id,
            date: d.date,
            sport: d.sport || 'UNK',
            market,
            wallet: w.wallet,
            invested: w.invested ?? 0,
            won,
            flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

// ─────────────────────────────────────────────────────────────────────
//  Given a bet slice, summarize per-wallet performance for one sport.
// ─────────────────────────────────────────────────────────────────────
function summarizeWallets(bets) {
  const byWallet = new Map();
  for (const b of bets) {
    if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
    byWallet.get(b.wallet).push(b);
  }
  const wallets = [];
  for (const [wallet, ws] of byWallet) {
    const n = ws.length;
    const wins = ws.filter(b => b.won === 1).length;
    const wr = (wins / n) * 100;
    const invested = ws.reduce((s, b) => s + (b.invested || 0), 0);
    const flatPnl = ws.reduce((s, b) => s + (b.flat || 0), 0);
    const flatRoi = n > 0 ? (flatPnl / n) * 100 : 0;
    wallets.push({ wallet, n, wins, losses: n - wins, wr, flatPnl, flatRoi, invested });
  }
  return wallets;
}

function distrib(vals) {
  const s = [...vals].filter(v => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!s.length) return { min: null, q25: null, median: null, q75: null, max: null };
  return {
    min: s[0],
    q25: quantile(s, 0.25),
    median: quantile(s, 0.5),
    q75: quantile(s, 0.75),
    max: s[s.length - 1],
  };
}

(async () => {
  console.log('Loading wallet bets from graded V8 picks…');
  const bets = await loadWalletBets();
  const sports = [...new Set(bets.map(b => b.sport))].sort();
  const dates = [...new Set(bets.map(b => b.date))].sort();

  console.log(`Loaded ${bets.length} wallet-bets · ${new Set(bets.map(b => b.wallet)).size} unique wallets · ${sports.length} sports · ${dates.length} graded dates.\n`);

  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];

  out.push('# Wallet Roster Growth & Profitability');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push(`**Source:** \`v8Scoring.walletDetails\` on graded \`sharpFlow{Picks,Spreads,Totals}\` from **${V8_CUTOVER}** onward. Each wallet-bet is one wallet appearing on one side of one graded game. Flat unit PnL uses the peak odds of the side the wallet was on.`);
  out.push('');
  out.push(`**Roster definition:** a wallet counts as "tracked in sport X" when it has placed **≥ ${MIN_BETS} bets** in X within the sample window. Profitability = cumulative flat PnL > 0.`);
  out.push('');
  out.push(`**Coverage:** ${bets.length} wallet-bets · ${new Set(bets.map(b => b.wallet)).size} unique wallets · sports: ${sports.join(', ')} · dates: ${dates[0]} → ${dates[dates.length - 1]}`);
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §1. CURRENT SNAPSHOT — per-sport counts
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Current snapshot — per-sport wallet counts');
  out.push('');
  out.push(`Wallets tracked in each sport right now, with profitability + WR cuts. "Tracked" means ≥ ${MIN_BETS} bets in the sport.`);
  out.push('');
  out.push(mdHeader(['Sport', 'Total wallets seen', `Tracked (≥${MIN_BETS} bets)`, 'Profitable', '% profitable', 'WR ≥ 50%', 'WR ≥ 60%', 'WR ≥ 70%']));

  const sportSnapshots = {};
  for (const sport of sports) {
    const slice = bets.filter(b => b.sport === sport);
    const uniqueAll = new Set(slice.map(b => b.wallet)).size;
    const allWallets = summarizeWallets(slice);
    const tracked = allWallets.filter(w => w.n >= MIN_BETS);
    const profitable = tracked.filter(w => w.flatPnl > 0);
    const wr50 = tracked.filter(w => w.wr >= 50);
    const wr60 = tracked.filter(w => w.wr >= 60);
    const wr70 = tracked.filter(w => w.wr >= 70);
    sportSnapshots[sport] = { uniqueAll, tracked, profitable, wr50, wr60, wr70, allWallets };
    const pctProf = tracked.length > 0 ? (profitable.length / tracked.length * 100).toFixed(0) : '—';
    out.push(`| ${sport.toUpperCase()} | ${uniqueAll} | ${tracked.length} | ${profitable.length} | ${pctProf}% | ${wr50.length} | ${wr60.length} | ${wr70.length} |`);
  }

  // Aggregate row
  const allWalletsFlat = summarizeWallets(bets);
  const trackedAll = allWalletsFlat.filter(w => w.n >= MIN_BETS);
  const profitableAll = trackedAll.filter(w => w.flatPnl > 0);
  const wr50All = trackedAll.filter(w => w.wr >= 50);
  const wr60All = trackedAll.filter(w => w.wr >= 60);
  const wr70All = trackedAll.filter(w => w.wr >= 70);
  const pctProfAll = trackedAll.length > 0 ? (profitableAll.length / trackedAll.length * 100).toFixed(0) : '—';
  out.push(`| **ALL (any sport)** | **${new Set(bets.map(b => b.wallet)).size}** | **${trackedAll.length}** | **${profitableAll.length}** | **${pctProfAll}%** | **${wr50All.length}** | **${wr60All.length}** | **${wr70All.length}** |`);
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §2. DAILY GROWTH — cumulative counts through each date
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Daily roster growth (cumulative)');
  out.push('');
  out.push(`For each graded date D, we recompute the per-sport wallet roster **using every bet up to and including D**. This shows the live roster you\'d have had on that day. Columns are per sport: \`tracked (profitable)\`.`);
  out.push('');

  const headerCols = ['Date', 'ALL'];
  for (const sport of sports) headerCols.push(sport.toUpperCase());
  out.push(mdHeader(headerCols));

  for (const d of dates) {
    const upToD = bets.filter(b => b.date <= d);
    const row = [d];

    // ALL
    const allW = summarizeWallets(upToD);
    const trAll = allW.filter(w => w.n >= MIN_BETS);
    const prAll = trAll.filter(w => w.flatPnl > 0);
    row.push(`${trAll.length} (${prAll.length})`);

    for (const sport of sports) {
      const slice = upToD.filter(b => b.sport === sport);
      const ws = summarizeWallets(slice);
      const tr = ws.filter(w => w.n >= MIN_BETS);
      const pr = tr.filter(w => w.flatPnl > 0);
      row.push(`${tr.length} (${pr.length})`);
    }
    out.push(`| ${row.join(' | ')} |`);
  }
  out.push('');
  out.push('Format: `tracked (profitable)`. "Tracked" = wallets with ≥ ' + MIN_BETS + ' bets in that sport as of that date. "Profitable" = subset with cumulative flat PnL > 0.');
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §3. PROFITABLE-WALLET DISTRIBUTION — per sport
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. Profitable-wallet distribution (current snapshot)');
  out.push('');
  out.push('Flat-ROI distribution across tracked wallets in each sport. Min / Q25 / median / Q75 / max are in flat-unit ROI %. `profit quartile` is the median flat ROI *among profitable wallets only* — i.e. "how good is the middle winner in this sport."');
  out.push('');
  out.push(mdHeader(['Sport', 'Tracked', 'Min ROI', 'Q25 ROI', 'Median ROI', 'Q75 ROI', 'Max ROI', 'Profitable', 'Median ROI of profitable']));

  for (const sport of sports) {
    const { tracked, profitable } = sportSnapshots[sport];
    const all = tracked.map(w => w.flatRoi);
    const prof = profitable.map(w => w.flatRoi);
    const dAll = distrib(all);
    const dProf = distrib(prof);
    out.push(`| ${sport.toUpperCase()} | ${tracked.length} | ${sign(dAll.min)}% | ${sign(dAll.q25)}% | ${sign(dAll.median)}% | ${sign(dAll.q75)}% | ${sign(dAll.max)}% | ${profitable.length} | ${sign(dProf.median)}% |`);
  }
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // §4. TOP PROFITABLE WALLETS per sport
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Top profitable wallets by sport');
  out.push('');
  out.push(`Top 10 wallets by flat-ROI in each sport (min ${MIN_BETS} bets in the sport).`);
  out.push('');

  for (const sport of sports) {
    const { tracked } = sportSnapshots[sport];
    const top = [...tracked].sort((a, b) => b.flatRoi - a.flatRoi).slice(0, 10);
    if (!top.length) continue;
    out.push(`### ${sport.toUpperCase()}`);
    out.push('');
    out.push(mdHeader(['#', 'Wallet', 'N', 'W', 'L', 'WR%', 'Flat PnL (u)', 'Flat ROI']));
    top.forEach((w, i) => {
      out.push(`| ${i + 1} | ${w.wallet} | ${w.n} | ${w.wins} | ${w.losses} | ${w.wr.toFixed(1)}% | ${sign(w.flatPnl, 2)} | ${sign(w.flatRoi)}% |`);
    });
    out.push('');
  }

  // ═════════════════════════════════════════════════════════════════
  // §5. NEW WALLETS PER DAY — how the roster is expanding
  // ═════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. New wallets discovered per day');
  out.push('');
  out.push('Wallets entering the roster for the first time on each date (first bet landed on date D). Shows how fast our universe of tracked sharps is expanding.');
  out.push('');
  out.push(mdHeader(['Date', 'New wallets (any sport)', 'Running total']));

  const firstSeen = new Map();
  for (const b of bets) {
    if (!firstSeen.has(b.wallet) || b.date < firstSeen.get(b.wallet)) {
      firstSeen.set(b.wallet, b.date);
    }
  }
  const byFirstDate = new Map();
  for (const [w, d] of firstSeen) {
    if (!byFirstDate.has(d)) byFirstDate.set(d, []);
    byFirstDate.get(d).push(w);
  }
  let running = 0;
  for (const d of dates) {
    const added = byFirstDate.get(d)?.length || 0;
    running += added;
    out.push(`| ${d} | ${added} | ${running} |`);
  }
  out.push('');

  // ═════════════════════════════════════════════════════════════════
  // Console-friendly summary
  // ═════════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  WALLET ROSTER GROWTH & PROFITABILITY · min ${MIN_BETS} bets`);
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Total unique wallets seen: ${new Set(bets.map(b => b.wallet)).size}`);
  console.log(`Total tracked (≥${MIN_BETS} bets in ANY sport): ${trackedAll.length}`);
  console.log(`Total profitable among tracked: ${profitableAll.length} (${pctProfAll}%)`);
  console.log('');
  console.log('Per-sport snapshot:');
  for (const sport of sports) {
    const s = sportSnapshots[sport];
    const pct = s.tracked.length > 0 ? (s.profitable.length / s.tracked.length * 100).toFixed(0) : '—';
    console.log(`  ${sport.toUpperCase().padEnd(6)}  tracked=${String(s.tracked.length).padStart(3)}  profitable=${String(s.profitable.length).padStart(3)} (${pct}%)  WR≥50=${s.wr50.length}  WR≥60=${s.wr60.length}`);
  }
  console.log('\nDaily growth (tracked / profitable, ALL sports):');
  for (const d of dates) {
    const upToD = bets.filter(b => b.date <= d);
    const ws = summarizeWallets(upToD);
    const tr = ws.filter(w => w.n >= MIN_BETS);
    const pr = tr.filter(w => w.flatPnl > 0);
    console.log(`  ${d}  tracked=${String(tr.length).padStart(3)}  profitable=${String(pr.length).padStart(3)}`);
  }

  const outPath = join(__dirname, '..', 'WALLET_GROWTH_REPORT.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nWrote ${outPath}`);
  process.exit(0);
})();
