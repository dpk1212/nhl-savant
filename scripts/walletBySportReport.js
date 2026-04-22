/**
 * walletBySportReport.js — per-SPORT wallet profitability breakdown.
 *
 * For each sport, reports:
 *   • how many unique wallets have activity
 *   • how many are profitable (flat PnL > 0 and/or dollar PnL > 0)
 *   • how many have WR ≥ 50%
 *   • how many have WR ≥ 60%
 *   • the distribution (quartiles) of ROI per wallet
 *
 * Uses the same two sources as walletPerformanceReport.js:
 *   A. sharpFlow{Picks,Spreads,Totals} → v8Scoring.walletDetails  (flat ROI, ~4 days)
 *   B. sharp_action_positions                                      (dollar ROI,  5 days)
 *
 * Usage:  node scripts/walletBySportReport.js
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
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const sign = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d);
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

// ── A. Load walletDetails-based bets (flat ROI) ─────────────────────
async function loadWalletBets() {
  const bets = [];
  const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
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

// ── B. Load sharp_action_positions (dollar ROI) ────────────────────
async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) return;
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    rows.push({
      date: d.date,
      sport: d.sport || 'UNK',
      wallet: walletShort,
      invested,
      settledPnl,
      won: settledPnl > 0 ? 1 : 0,
    });
  });
  return rows;
}

// ── aggregation helpers ────────────────────────────────────────────
function groupBy(rows, keyFn) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return m;
}

function summarizeWalletsInSport(bets, valueKey /* 'flat' or 'dollar' */) {
  // Group by wallet within the slice
  const byWallet = groupBy(bets, b => b.wallet);
  const wallets = [];
  for (const [wallet, ws] of byWallet) {
    const n = ws.length;
    if (n < 2) continue; // noise cut — need at least 2 bets in that sport to call them a "per-sport wallet"
    const wins = ws.filter(b => b.won === 1).length;
    const wr = (wins / n) * 100;
    const invested = ws.reduce((s, b) => s + (b.invested || 0), 0);
    const flatPnl = ws.reduce((s, b) => s + (b.flat || 0), 0);
    const dollarPnl = ws.reduce((s, b) => s + (b.settledPnl || 0), 0);
    const flatRoi = n > 0 ? (flatPnl / n) * 100 : 0;
    const dollarRoi = invested > 0 ? (dollarPnl / invested) * 100 : null;
    wallets.push({ wallet, n, wins, wr, flatPnl, flatRoi, invested, dollarPnl, dollarRoi });
  }
  return wallets;
}

function distrib(wallets, field) {
  const vals = wallets.map(w => w[field]).filter(v => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!vals.length) return { q25: null, median: null, q75: null, min: null, max: null };
  return {
    min: vals[0],
    q25: quantile(vals, 0.25),
    median: quantile(vals, 0.5),
    q75: quantile(vals, 0.75),
    max: vals[vals.length - 1],
  };
}

(async () => {
  console.log('Loading wallet bets…');
  const walletBets = await loadWalletBets();
  const positions = await loadPositions();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const out = [];
  out.push('# Wallet Profitability By Sport');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push('Per-sport breakdown of wallet performance. A wallet counts as "active in sport X" if it has ≥ 2 bets in X in the sample window.');
  out.push('');
  out.push(`- **Source A** — \`v8Scoring.walletDetails\` on graded Sharp Flow picks (V8-era, from ${V8_CUTOVER}). Flat-unit ROI / WR.`);
  out.push(`- **Source B** — \`sharp_action_positions\` (5 days, 2026-04-17 → 2026-04-21). Real dollar ROI / WR.`);
  out.push('');

  const sportsA = [...new Set(walletBets.map(b => b.sport))].sort();
  const sportsB = [...new Set(positions.map(p => p.sport))].sort();

  // ── §1. Source A: flat ROI by sport ────────────────────────────────
  out.push('---');
  out.push('## §1. Source A — walletDetails (flat units)');
  out.push('');
  out.push(`Sample: ${walletBets.length} wallet-game rows across ${new Set(walletBets.map(b => b.wallet)).size} unique wallets.`);
  out.push('');
  out.push(mdHeader(['Sport', 'Wallet-bets', 'Unique wallets (≥2 bets)', 'Profitable (flat PnL > 0)', 'WR ≥ 50%', 'WR ≥ 60%', 'Median flatROI', 'Q75 flatROI', 'Best', 'Worst']));
  const sportSummaryA = {};
  for (const sport of sportsA) {
    const slice = walletBets.filter(b => b.sport === sport);
    const wallets = summarizeWalletsInSport(slice, 'flat');
    const nBets = slice.length;
    const uniqueAll = new Set(slice.map(b => b.wallet)).size;
    const nWallets = wallets.length;
    const profitable = wallets.filter(w => w.flatPnl > 0).length;
    const winRate50 = wallets.filter(w => w.wr >= 50).length;
    const winRate60 = wallets.filter(w => w.wr >= 60).length;
    const d = distrib(wallets, 'flatRoi');
    const best = wallets.length ? wallets.reduce((a, b) => a.flatRoi > b.flatRoi ? a : b) : null;
    const worst = wallets.length ? wallets.reduce((a, b) => a.flatRoi < b.flatRoi ? a : b) : null;
    sportSummaryA[sport] = { nBets, uniqueAll, nWallets, profitable, winRate50, winRate60, distrib: d };
    out.push(`| ${sport} | ${nBets} | ${nWallets} (of ${uniqueAll}) | ${profitable}  (${((profitable / Math.max(1, nWallets)) * 100).toFixed(0)}%) | ${winRate50}  (${((winRate50 / Math.max(1, nWallets)) * 100).toFixed(0)}%) | ${winRate60}  (${((winRate60 / Math.max(1, nWallets)) * 100).toFixed(0)}%) | ${d.median != null ? sign(d.median) + '%' : '—'} | ${d.q75 != null ? sign(d.q75) + '%' : '—'} | ${best ? best.wallet + ' ' + sign(best.flatRoi) + '%' : '—'} | ${worst ? worst.wallet + ' ' + sign(worst.flatRoi) + '%' : '—'} |`);
  }
  out.push('');

  // ── §2. Source B: dollar ROI by sport ──────────────────────────────
  out.push('---');
  out.push('## §2. Source B — sharp_action_positions (dollar $)');
  out.push('');
  out.push(`Sample: ${positions.length} graded positions across ${new Set(positions.map(p => p.wallet)).size} unique wallets.`);
  out.push('');
  out.push(mdHeader(['Sport', 'Positions', 'Unique wallets (≥2 bets)', 'Profitable ($PnL > 0)', 'WR ≥ 50%', 'WR ≥ 60%', 'Total invested', 'Total $PnL', 'Median $ROI', 'Best wallet']));
  const sportSummaryB = {};
  for (const sport of sportsB) {
    const slice = positions.filter(p => p.sport === sport);
    const wallets = summarizeWalletsInSport(slice, 'dollar');
    const nBets = slice.length;
    const uniqueAll = new Set(slice.map(p => p.wallet)).size;
    const nWallets = wallets.length;
    const profitable = wallets.filter(w => w.dollarPnl > 0).length;
    const winRate50 = wallets.filter(w => w.wr >= 50).length;
    const winRate60 = wallets.filter(w => w.wr >= 60).length;
    const invested = slice.reduce((s, p) => s + (p.invested || 0), 0);
    const pnl = slice.reduce((s, p) => s + (p.settledPnl || 0), 0);
    const d = distrib(wallets, 'dollarRoi');
    const best = wallets.length ? wallets.reduce((a, b) => (a.dollarRoi || -999) > (b.dollarRoi || -999) ? a : b) : null;
    sportSummaryB[sport] = { nBets, uniqueAll, nWallets, profitable, winRate50, winRate60, invested, pnl, distrib: d };
    out.push(`| ${sport} | ${nBets} | ${nWallets} (of ${uniqueAll}) | ${profitable}  (${((profitable / Math.max(1, nWallets)) * 100).toFixed(0)}%) | ${winRate50}  (${((winRate50 / Math.max(1, nWallets)) * 100).toFixed(0)}%) | ${winRate60}  (${((winRate60 / Math.max(1, nWallets)) * 100).toFixed(0)}%) | $${(invested / 1000).toFixed(1)}k | ${sign(pnl / 1000, 1)}k | ${d.median != null ? sign(d.median) + '%' : '—'} | ${best ? best.wallet + ' ' + sign(best.dollarRoi || 0) + '%' : '—'} |`);
  }
  out.push('');

  // ── §3. Cross-source: wallets that win in BOTH sources by sport ────
  out.push('---');
  out.push('## §3. Cross-source confirmed winners by sport');
  out.push('');
  out.push('Wallets with **flat PnL > 0 in Source A** AND **dollar PnL > 0 in Source B**, restricted to that sport. These are the wallets with evidence from both views.');
  out.push('');
  out.push(mdHeader(['Sport', 'Confirmed winners', 'Avg flat ROI', 'Avg $ ROI', 'Wallet shortlist']));
  const allSports = [...new Set([...sportsA, ...sportsB])].sort();
  for (const sport of allSports) {
    const aSlice = walletBets.filter(b => b.sport === sport);
    const bSlice = positions.filter(p => p.sport === sport);
    const aWallets = summarizeWalletsInSport(aSlice, 'flat').filter(w => w.flatPnl > 0);
    const bWallets = summarizeWalletsInSport(bSlice, 'dollar').filter(w => w.dollarPnl > 0);
    const aSet = new Set(aWallets.map(w => w.wallet));
    const bMap = new Map(bWallets.map(w => [w.wallet, w]));
    const confirmed = [];
    for (const aw of aWallets) {
      const bw = bMap.get(aw.wallet);
      if (bw) confirmed.push({ wallet: aw.wallet, flatRoi: aw.flatRoi, dollarRoi: bw.dollarRoi });
    }
    confirmed.sort((a, b) => b.flatRoi - a.flatRoi);
    const avgFlat = confirmed.length ? confirmed.reduce((s, w) => s + w.flatRoi, 0) / confirmed.length : null;
    const avgDollar = confirmed.length ? confirmed.reduce((s, w) => s + (w.dollarRoi || 0), 0) / confirmed.length : null;
    const shortlist = confirmed.slice(0, 6).map(w => w.wallet).join(', ') || '—';
    out.push(`| ${sport} | **${confirmed.length}** | ${avgFlat != null ? sign(avgFlat) + '%' : '—'} | ${avgDollar != null ? sign(avgDollar) + '%' : '—'} | ${shortlist} |`);
  }
  out.push('');

  // ── §4. Summary sentence ───────────────────────────────────────────
  out.push('---');
  out.push('## §4. One-line per sport');
  out.push('');
  for (const sport of allSports) {
    const a = sportSummaryA[sport];
    const b = sportSummaryB[sport];
    const aProfRate = a && a.nWallets > 0 ? (a.profitable / a.nWallets) * 100 : null;
    const bProfRate = b && b.nWallets > 0 ? (b.profitable / b.nWallets) * 100 : null;
    out.push(`- **${sport}** — Source A: **${a?.profitable ?? 0} / ${a?.nWallets ?? 0}** wallets profitable (${aProfRate != null ? aProfRate.toFixed(0) : '—'}%), ${a?.winRate50 ?? 0} at WR ≥ 50%. Source B: **${b?.profitable ?? 0} / ${b?.nWallets ?? 0}** wallets $profitable (${bProfRate != null ? bProfRate.toFixed(0) : '—'}%), ${b?.winRate50 ?? 0} at WR ≥ 50%.`);
  }
  out.push('');
  out.push('---');
  out.push('*Generated by `scripts/walletBySportReport.js`. See `WALLET_PERFORMANCE_REPORT.md` and `V8_DAILY_PNL.md` for related analyses.*');
  out.push('');

  const outPath = join(__dirname, '..', 'WALLET_BY_SPORT_REPORT.md');
  writeFileSync(outPath, out.join('\n'), 'utf8');
  console.log(`Wrote ${outPath}`);
  process.exit(0);
})();
