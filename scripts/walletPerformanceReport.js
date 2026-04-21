/**
 * walletPerformanceReport.js — per-WALLET win/loss/PnL/ROI report.
 *
 * Two complementary sources:
 *   A. sharpFlow{Picks,Spreads,Totals} → v8Scoring.walletDetails[]
 *        Each pick side lists the sharp wallets backing that side with
 *        { wallet, side, invested, roi, pnl, walletBase, roiNorm, rank, ... }.
 *        Coverage: V8-era only (~2026-04-18 onward) but spans every game
 *        we produced a Sharp Flow pick on, so it's the "who showed up
 *        and won/lost on our cards" view.
 *
 *   B. sharp_action_positions → each DOC is one wallet's one bet with
 *        { wallet, walletShort, invested, settledPnl, avgPrice, outcome, side, tier }.
 *        Coverage: 5 days (2026-04-17 → 2026-04-21) but more accurate
 *        dollar PnL per wallet-bet.
 *
 * We produce WALLET_PERFORMANCE_REPORT.md with
 *   §1. Top / bottom wallets by flat ROI from walletDetails
 *   §2. Top / bottom wallets by settled dollar PnL from positions
 *   §3. "Does wallet quality predict?" — roiNorm / walletBase / rank buckets
 *   §4. Sport × tier breakdowns
 *   §5. Wallet reliability scoreboard (on both + stable winner vs loser)
 *
 * Usage:  node scripts/walletPerformanceReport.js
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

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const sign = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d);
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

// ── A. Load walletDetails-based bets ───────────────────────────────
async function loadWalletBets() {
  const bets = [];
  for (const [col, market] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      // A game must have at least one graded side to be usable.
      const anyGraded = Object.values(sides).some(s => s.result?.outcome === 'WIN' || s.result?.outcome === 'LOSS');
      if (!anyGraded) continue;

      // Determine the WINNING side from the pick-side outcome. `sides`
      // often contains ONLY the picked side (opposing side not tracked),
      // so we must derive the opposite via a fixed mapping:
      // home↔away, over↔under. For a side with outcome=WIN, that side
      // won. For outcome=LOSS, the opposite side won.
      const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk].result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;

      // Collect wallets from both sides (walletDetails may be on either
      // or both), dedupe per (gameKey, wallet).
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

          // Find odds for the SIDE this wallet actually bet on. If that
          // side isn't tracked (common — only the picked side is stored),
          // fall back to the tracked-side odds (the wallet bet the opposite
          // price, which is usually a mirror of the tracked price).
          const betSide = sides[w.side];
          const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? oddsForThisSide;
          const won = w.side === winningSide ? 1 : 0;

          bets.push({
            gameKey: doc.id,
            date: d.date,
            sport: d.sport,
            market,
            wallet: w.wallet,
            side: w.side,
            odds: betOdds,
            invested: w.invested ?? 0,
            // wallet-quality signals
            walletBase: w.walletBase ?? null,
            roiNorm: w.roiNorm ?? null,
            rankNorm: w.rankNorm ?? null,
            rank: w.rank ?? null,
            lifetimeRoi: w.roi ?? null,
            lifetimePnl: w.pnl ?? null,
            contribution: w.contribution ?? null,
            sizeRatio: w.sizeRatio ?? null,
            won,
            flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

// ── B. Load sharp_action_positions ─────────────────────────────────
async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) return;
    // Use walletShort if present so we can cross-reference with Source A
    // (which stores the 6-char hash form on walletDetails).
    const walletShort = d.walletShort || (d.wallet ? String(d.wallet).slice(0, 6) : null);
    rows.push({
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      wallet: walletShort,
      walletAddress: d.wallet,
      walletShort,
      tier: d.tier,
      side: d.side,
      teamName: d.teamName,
      invested,
      settledPnl,
      avgPrice: d.avgPrice,
      // Outcome-based win (settledPnl > 0 means bet cashed)
      won: settledPnl > 0 ? 1 : 0,
      // Leaderboard context
      sportROI: d.sportROI,
      sportPnlTotal: d.sportPnlTotal,
      sportsLbPercentileTop: d.sportsLbPercentileTop,
      leaderboardRank: d.leaderboardRank,
    });
  });
  return rows;
}

// ── Wallet aggregate helpers ───────────────────────────────────────
function groupByWallet(bets, valueFn) {
  const m = new Map();
  for (const b of bets) {
    if (!m.has(b.wallet)) m.set(b.wallet, []);
    m.get(b.wallet).push(b);
  }
  return m;
}

function walletAgg(bets) {
  const n = bets.length;
  const wins = bets.filter(b => b.won === 1).length;
  const wr = n ? (wins / n) * 100 : 0;
  const flatPnl = bets.reduce((s, b) => s + (b.flat ?? 0), 0);
  const flatRoi = n ? (flatPnl / n) * 100 : 0;
  const dollarInvested = bets.reduce((s, b) => s + (b.invested || 0), 0);
  const dollarPnl = bets.reduce((s, b) => s + (b.settledPnl ?? 0), 0);
  const dollarRoi = dollarInvested > 0 ? (dollarPnl / dollarInvested) * 100 : null;
  return { n, wins, wr, flatPnl, flatRoi, dollarInvested, dollarPnl, dollarRoi };
}

(async () => {
  const walletBets = await loadWalletBets();
  const positions = await loadPositions();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];

  out.push('# Wallet Performance Report');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push('Per-wallet win/loss, PnL, and ROI built from two independent sources:');
  out.push('');
  out.push(`- **Source A** — \`v8Scoring.walletDetails\` on graded Sharp Flow picks (V8-era only, from ${V8_CUTOVER}). Every wallet that backed a side on a game we produced a pick on. Flat unit PnL at the peak odds of the side the wallet bet.`);
  out.push(`- **Source B** — \`sharp_action_positions\` (5 days, 2026-04-17 → 2026-04-21). Each document is one wallet's one bet, with real settled dollar PnL at the price they got.`);
  out.push('');
  out.push(`Source A sample: **${walletBets.length} wallet-game records** spanning **${new Set(walletBets.map(b => b.wallet)).size} unique wallets**.`);
  out.push(`Source B sample: **${positions.length} graded positions** spanning **${new Set(positions.map(p => p.wallet)).size} unique wallets**.`);
  out.push('');

  // ── §1. walletDetails leaderboard (flat units) ─────────────────
  out.push('---');
  out.push('## §1. Wallet leaderboard — Source A (walletDetails flat units)');
  out.push('');
  out.push('Every sharp wallet that appeared on a graded V8-era Sharp Flow pick. A "bet" = wallet appearing on the for-side of one graded game. Grading compares `wallet.side` to the winning side. "Flat PnL" uses the peak odds of the side the wallet bet.');
  out.push('');
  const byWallet = groupByWallet(walletBets);
  const walletRows = [];
  for (const [wallet, bets] of byWallet) {
    const a = walletAgg(bets);
    if (a.n < 3) continue; // cut noise
    // Grab last-known wallet-quality snapshot (use the most recent bet)
    const latest = bets.sort((x, y) => (y.date || '').localeCompare(x.date || ''))[0];
    walletRows.push({
      wallet, ...a,
      lifetimeRoi: latest.lifetimeRoi,
      lifetimePnl: latest.lifetimePnl,
      rank: latest.rank,
      walletBase: latest.walletBase,
      roiNorm: latest.roiNorm,
      avgInvested: a.dollarInvested / a.n,
    });
  }
  walletRows.sort((a, b) => b.flatRoi - a.flatRoi);

  out.push('### §1a. Top 20 wallets by flat ROI (min 3 bets)');
  out.push('');
  out.push(mdHeader(['#', 'Wallet', 'N', 'W', 'L', 'WR%', 'Flat PnL (u)', 'Flat ROI', 'Rank', 'Lifetime ROI', 'walletBase', 'roiNorm']));
  walletRows.slice(0, 20).forEach((r, i) => {
    out.push(`| ${i + 1} | ${r.wallet} | ${r.n} | ${r.wins} | ${r.n - r.wins} | ${r.wr.toFixed(1)}% | ${sign(r.flatPnl, 2)} | ${sign(r.flatRoi)}% | ${r.rank ?? '—'} | ${r.lifetimeRoi != null ? r.lifetimeRoi.toFixed(1) + '%' : '—'} | ${r.walletBase != null ? r.walletBase.toFixed(1) : '—'} | ${r.roiNorm != null ? r.roiNorm.toFixed(1) : '—'} |`);
  });
  out.push('');

  out.push('### §1b. Bottom 20 wallets by flat ROI (min 3 bets)');
  out.push('');
  out.push(mdHeader(['#', 'Wallet', 'N', 'W', 'L', 'WR%', 'Flat PnL (u)', 'Flat ROI', 'Rank', 'Lifetime ROI', 'walletBase', 'roiNorm']));
  walletRows.slice(-20).reverse().forEach((r, i) => {
    out.push(`| ${i + 1} | ${r.wallet} | ${r.n} | ${r.wins} | ${r.n - r.wins} | ${r.wr.toFixed(1)}% | ${sign(r.flatPnl, 2)} | ${sign(r.flatRoi)}% | ${r.rank ?? '—'} | ${r.lifetimeRoi != null ? r.lifetimeRoi.toFixed(1) + '%' : '—'} | ${r.walletBase != null ? r.walletBase.toFixed(1) : '—'} | ${r.roiNorm != null ? r.roiNorm.toFixed(1) : '—'} |`);
  });
  out.push('');

  // High-activity — min 5 bets
  const highActivity = walletRows.filter(r => r.n >= 5).sort((a, b) => b.flatRoi - a.flatRoi);
  if (highActivity.length) {
    out.push('### §1c. High-activity wallets only (min 5 bets)');
    out.push('');
    out.push(mdHeader(['#', 'Wallet', 'N', 'WR%', 'Flat PnL (u)', 'Flat ROI', 'Rank', 'walletBase', 'roiNorm']));
    highActivity.forEach((r, i) => {
      out.push(`| ${i + 1} | ${r.wallet} | ${r.n} | ${r.wr.toFixed(1)}% | ${sign(r.flatPnl, 2)} | ${sign(r.flatRoi)}% | ${r.rank ?? '—'} | ${r.walletBase != null ? r.walletBase.toFixed(1) : '—'} | ${r.roiNorm != null ? r.roiNorm.toFixed(1) : '—'} |`);
    });
    out.push('');
  }

  // ── §2. Positions leaderboard (dollar PnL) ─────────────────────
  out.push('---');
  out.push('## §2. Wallet leaderboard — Source B (settled dollar PnL, 5-day window)');
  out.push('');
  const posByWallet = groupByWallet(positions);
  const posRows = [];
  for (const [wallet, bets] of posByWallet) {
    if (bets.length < 3) continue;
    const a = walletAgg(bets);
    const latest = bets.sort((x, y) => (y.date || '').localeCompare(x.date || ''))[0];
    posRows.push({
      wallet, ...a,
      walletShort: latest.walletShort,
      tier: latest.tier,
      sportROI: latest.sportROI,
      lbRank: latest.leaderboardRank,
    });
  }
  // Sort by dollar PnL then dollar ROI
  const sortedByPnl = [...posRows].sort((a, b) => b.dollarPnl - a.dollarPnl);
  out.push('### §2a. Top 20 wallets by dollar PnL (min 3 bets)');
  out.push('');
  out.push(mdHeader(['#', 'Wallet', 'N', 'WR%', 'Invested ($)', 'Settled PnL ($)', 'Dollar ROI', 'Tier', 'LB Rank']));
  sortedByPnl.slice(0, 20).forEach((r, i) => {
    out.push(`| ${i + 1} | ${r.walletShort || r.wallet.slice(0, 8)} | ${r.n} | ${r.wr.toFixed(1)}% | ${r.dollarInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ${sign(r.dollarPnl, 0)} | ${r.dollarRoi != null ? sign(r.dollarRoi) + '%' : '—'} | ${r.tier || '—'} | ${r.lbRank ?? '—'} |`);
  });
  out.push('');

  out.push('### §2b. Bottom 20 wallets by dollar PnL (min 3 bets)');
  out.push('');
  out.push(mdHeader(['#', 'Wallet', 'N', 'WR%', 'Invested ($)', 'Settled PnL ($)', 'Dollar ROI', 'Tier', 'LB Rank']));
  sortedByPnl.slice(-20).reverse().forEach((r, i) => {
    out.push(`| ${i + 1} | ${r.walletShort || r.wallet.slice(0, 8)} | ${r.n} | ${r.wr.toFixed(1)}% | ${r.dollarInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ${sign(r.dollarPnl, 0)} | ${r.dollarRoi != null ? sign(r.dollarRoi) + '%' : '—'} | ${r.tier || '—'} | ${r.lbRank ?? '—'} |`);
  });
  out.push('');

  // High-activity — min 8 bets
  const posHigh = posRows.filter(r => r.n >= 8).sort((a, b) => (b.dollarRoi ?? -999) - (a.dollarRoi ?? -999));
  if (posHigh.length) {
    out.push('### §2c. High-activity wallets only (min 8 bets, sorted by dollar ROI)');
    out.push('');
    out.push(mdHeader(['#', 'Wallet', 'N', 'WR%', 'Invested ($)', 'PnL ($)', '$ ROI', 'Tier']));
    posHigh.forEach((r, i) => {
      out.push(`| ${i + 1} | ${r.walletShort || r.wallet.slice(0, 8)} | ${r.n} | ${r.wr.toFixed(1)}% | ${r.dollarInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ${sign(r.dollarPnl, 0)} | ${r.dollarRoi != null ? sign(r.dollarRoi) + '%' : '—'} | ${r.tier || '—'} |`);
    });
    out.push('');
  }

  // ── §3. Wallet-quality bucket performance ───────────────────────
  out.push('---');
  out.push('## §3. Does wallet quality predict wins? (Source A)');
  out.push('');
  out.push('Bucket every walletDetails record by its stored quality signals and show aggregate WR / flat ROI. If higher quality → better outcomes, the signal is validated.');
  out.push('');
  function bucketedTable(title, fn) {
    const buckets = new Map();
    for (const b of walletBets) {
      const k = fn(b);
      if (k == null) continue;
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(b);
    }
    const order = [...buckets.keys()].sort();
    const lines = [];
    lines.push(`### ${title}`);
    lines.push(mdHeader(['Bucket', 'N', 'Wins', 'WR%', 'Flat PnL (u)', 'Flat ROI']));
    for (const k of order) {
      const a = walletAgg(buckets.get(k));
      lines.push(`| ${k} | ${a.n} | ${a.wins} | ${a.wr.toFixed(1)}% | ${sign(a.flatPnl, 2)} | ${sign(a.flatRoi)}% |`);
    }
    lines.push('');
    return lines.join('\n');
  }

  out.push(bucketedTable('By walletBase (aggregate quality score)', b => {
    const v = b.walletBase;
    if (v == null) return null;
    if (v >= 70) return 'base≥70';
    if (v >= 55) return 'base 55–70';
    if (v >= 40) return 'base 40–55';
    return 'base<40';
  }));

  out.push(bucketedTable('By roiNorm (lifetime ROI percentile)', b => {
    const v = b.roiNorm;
    if (v == null) return null;
    if (v >= 80) return 'roiNorm≥80';
    if (v >= 60) return 'roiNorm 60–80';
    if (v >= 40) return 'roiNorm 40–60';
    return 'roiNorm<40';
  }));

  out.push(bucketedTable('By rankNorm (lifetime rank percentile)', b => {
    const v = b.rankNorm;
    if (v == null) return null;
    if (v >= 80) return 'rankNorm≥80';
    if (v >= 60) return 'rankNorm 60–80';
    if (v >= 40) return 'rankNorm 40–60';
    return 'rankNorm<40';
  }));

  out.push(bucketedTable('By lifetime rank (absolute)', b => {
    const v = b.rank;
    if (v == null) return null;
    if (v <= 50) return 'Top 50';
    if (v <= 150) return 'Rank 51–150';
    if (v <= 350) return 'Rank 151–350';
    return 'Rank >350';
  }));

  out.push(bucketedTable('By contribution on this pick', b => {
    const v = b.contribution;
    if (v == null) return null;
    if (v >= 75) return 'contrib≥75';
    if (v >= 50) return 'contrib 50–75';
    if (v >= 25) return 'contrib 25–50';
    return 'contrib<25';
  }));

  out.push(bucketedTable('By sizeRatio (sized vs usual)', b => {
    const v = b.sizeRatio;
    if (v == null) return null;
    if (v >= 3) return 'size≥3× usual';
    if (v >= 1.5) return 'size 1.5–3×';
    if (v >= 0.75) return 'size 0.75–1.5×';
    return 'size<0.75× (under-sized)';
  }));

  // ── §4. Tier performance (Source B) ─────────────────────────────
  out.push('---');
  out.push('## §4. Tier and sport performance (Source B, dollar PnL)');
  out.push('');
  function positionsAgg(sub) {
    const n = sub.length;
    const wins = sub.filter(p => p.won === 1).length;
    const wr = n ? (wins / n) * 100 : 0;
    const inv = sub.reduce((s, p) => s + p.invested, 0);
    const pnl = sub.reduce((s, p) => s + p.settledPnl, 0);
    const roi = inv > 0 ? (pnl / inv) * 100 : null;
    return { n, wins, wr, inv, pnl, roi };
  }
  function posBucketed(title, fn) {
    const buckets = new Map();
    for (const p of positions) {
      const k = fn(p);
      if (k == null) continue;
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k).push(p);
    }
    const order = [...buckets.keys()].sort();
    const lines = [];
    lines.push(`### ${title}`);
    lines.push(mdHeader(['Bucket', 'N', 'WR%', 'Invested ($)', 'Settled PnL ($)', 'Dollar ROI']));
    for (const k of order) {
      const a = positionsAgg(buckets.get(k));
      lines.push(`| ${k} | ${a.n} | ${a.wr.toFixed(1)}% | ${a.inv.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ${sign(a.pnl, 0)} | ${a.roi != null ? sign(a.roi) + '%' : '—'} |`);
    }
    lines.push('');
    return lines.join('\n');
  }
  out.push(posBucketed('By wallet tier', p => p.tier || '(none)'));
  out.push(posBucketed('By sport', p => p.sport || 'UNK'));
  out.push(posBucketed('By market', p => p.market || 'UNK'));
  out.push(posBucketed('By sport-leaderboard percentile', p => {
    const v = p.sportsLbPercentileTop;
    if (v == null) return null;
    if (v <= 5) return 'LB Top 5%';
    if (v <= 10) return 'LB Top 10%';
    if (v <= 25) return 'LB Top 25%';
    return 'LB Top 25%+';
  }));
  out.push(posBucketed('By wallet leaderboard rank', p => {
    const v = p.leaderboardRank;
    if (v == null) return null;
    if (v <= 50) return 'LB Rank ≤50';
    if (v <= 150) return 'LB Rank 51–150';
    if (v <= 350) return 'LB Rank 151–350';
    return 'LB Rank >350';
  }));

  // ── §5. Cross-source reliability ────────────────────────────────
  out.push('---');
  out.push('## §5. Cross-source wallet reliability');
  out.push('');
  out.push('Wallets that appear in **both** sources — for each, show Source A (walletDetails flat ROI) next to Source B (dollar ROI). Agreement across sources = real signal; disagreement = noise.');
  out.push('');
  const both = walletRows.map(r => {
    const p = posRows.find(x => x.wallet === r.wallet);
    return p ? { wallet: r.wallet, walletShort: p.walletShort, a: r, b: p } : null;
  }).filter(Boolean);
  both.sort((x, y) => y.a.flatRoi - x.a.flatRoi);
  out.push(mdHeader(['Wallet', 'A: N', 'A: WR%', 'A: Flat ROI', 'A: Flat PnL (u)', 'B: N', 'B: WR%', 'B: $ ROI', 'B: $ PnL', 'Tier']));
  both.forEach(r => {
    out.push(`| ${r.walletShort || r.wallet.slice(0, 8)} | ${r.a.n} | ${r.a.wr.toFixed(1)}% | ${sign(r.a.flatRoi)}% | ${sign(r.a.flatPnl, 2)} | ${r.b.n} | ${r.b.wr.toFixed(1)}% | ${r.b.dollarRoi != null ? sign(r.b.dollarRoi) + '%' : '—'} | ${sign(r.b.dollarPnl, 0)} | ${r.b.tier || '—'} |`);
  });
  out.push('');

  // Reliable winners + losers (both sources agree)
  const reliableWinners = both.filter(r => r.a.flatRoi > 0 && (r.b.dollarRoi ?? -999) > 0 && r.a.n >= 3 && r.b.n >= 3);
  const reliableLosers = both.filter(r => r.a.flatRoi < 0 && (r.b.dollarRoi ?? 999) < 0 && r.a.n >= 3 && r.b.n >= 3);
  out.push('### §5a. Confirmed winners (positive in BOTH sources, min 3 bets each)');
  out.push('');
  if (reliableWinners.length) {
    reliableWinners.forEach(r => out.push(`- **${r.walletShort || r.wallet.slice(0, 8)}** · A: ${r.a.n} bets, ${sign(r.a.flatRoi)}% flat · B: ${r.b.n} bets, ${sign(r.b.dollarRoi)}% $ROI · tier=${r.b.tier || '—'}`));
  } else {
    out.push('_None — no wallet clears the bar in both sources at this sample size._');
  }
  out.push('');

  out.push('### §5b. Confirmed bleeders (negative in BOTH sources, min 3 bets each)');
  out.push('');
  if (reliableLosers.length) {
    reliableLosers.forEach(r => out.push(`- **${r.walletShort || r.wallet.slice(0, 8)}** · A: ${r.a.n} bets, ${sign(r.a.flatRoi)}% flat · B: ${r.b.n} bets, ${sign(r.b.dollarRoi)}% $ROI · tier=${r.b.tier || '—'}`));
  } else {
    out.push('_None._');
  }
  out.push('');

  // ── §6. Size-vs-win correlation ────────────────────────────────
  // Question: do wallets win more often on their ABOVE-AVERAGE-sized
  // bets than on their routine-sized bets? Two angles:
  //   (a) Source A `sizeRatio` (= bet size vs wallet's historical avg)
  //       — already bucketed in §3 at the record level. Here we slice
  //       it by sport and by wallet tier.
  //   (b) Source B actual `invested` normalized by each wallet's own
  //       median. This tells us — using real dollars — whether the
  //       size-of-this-bet-for-this-wallet signal survives when we
  //       compare like-for-like.
  out.push('---');
  out.push('## §6. Does above-average bet size predict wins?');
  out.push('');
  out.push('For each wallet-bet we ask: was this an above- or below-average bet **for this wallet**, and did the bigger bets cash more often?');
  out.push('');

  // ── §6a. Source A sizeRatio × sport ────────────────────────────
  out.push('### §6a. Source A — sizeRatio × sport (flat units)');
  out.push('');
  out.push('`sizeRatio` = bet size on this pick ÷ the wallet\'s historical avg bet in this sport. Values >1 = above-average bet, <1 = below-average.');
  out.push('');
  function sizeBand(v) {
    if (v == null) return null;
    if (v >= 5) return '≥5× (max conviction)';
    if (v >= 3) return '3–5×';
    if (v >= 1.5) return '1.5–3× (conviction)';
    if (v >= 0.75) return '0.75–1.5× (routine)';
    if (v >= 0.25) return '0.25–0.75× (light)';
    return '<0.25× (very light)';
  }
  const sports = [...new Set(walletBets.map(b => b.sport))].filter(Boolean).sort();
  const sizeBands = ['<0.25× (very light)', '0.25–0.75× (light)', '0.75–1.5× (routine)', '1.5–3× (conviction)', '3–5×', '≥5× (max conviction)'];
  out.push('| Size band | ' + sports.map(s => `${s} N · WR · Flat ROI`).join(' | ') + ' | TOTAL |');
  out.push('|---|' + sports.map(() => '---').join('|') + '|---|');
  for (const band of sizeBands) {
    const row = [band];
    for (const sp of sports) {
      const sub = walletBets.filter(b => b.sport === sp && sizeBand(b.sizeRatio) === band);
      if (!sub.length) { row.push('—'); continue; }
      const a = walletAgg(sub);
      row.push(`N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}%`);
    }
    const total = walletBets.filter(b => sizeBand(b.sizeRatio) === band);
    if (!total.length) row.push('—');
    else {
      const a = walletAgg(total);
      row.push(`**N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}% · ${sign(a.flatPnl, 1)}u**`);
    }
    out.push('| ' + row.join(' | ') + ' |');
  }
  out.push('');

  // ── §6b. Source A sizeRatio × market ───────────────────────────
  out.push('### §6b. Source A — sizeRatio × market (flat units)');
  out.push('');
  const markets = ['ML', 'SPREAD', 'TOTAL'];
  out.push('| Size band | ' + markets.map(m => `${m} N · WR · Flat ROI`).join(' | ') + ' | TOTAL |');
  out.push('|---|' + markets.map(() => '---').join('|') + '|---|');
  for (const band of sizeBands) {
    const row = [band];
    for (const mk of markets) {
      const sub = walletBets.filter(b => b.market === mk && sizeBand(b.sizeRatio) === band);
      if (!sub.length) { row.push('—'); continue; }
      const a = walletAgg(sub);
      row.push(`N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}%`);
    }
    const total = walletBets.filter(b => sizeBand(b.sizeRatio) === band);
    if (!total.length) row.push('—');
    else {
      const a = walletAgg(total);
      row.push(`**N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}% · ${sign(a.flatPnl, 1)}u**`);
    }
    out.push('| ' + row.join(' | ') + ' |');
  }
  out.push('');

  // ── §6c. Source A sizeRatio × walletBase tier ──────────────────
  out.push('### §6c. Source A — sizeRatio × wallet quality (walletBase)');
  out.push('');
  out.push('Does size conviction matter MORE for high-quality wallets, or do they win regardless?');
  out.push('');
  const baseTiers = [
    ['base<40', b => b.walletBase != null && b.walletBase < 40],
    ['base 40–55', b => b.walletBase != null && b.walletBase >= 40 && b.walletBase < 55],
    ['base 55–70', b => b.walletBase != null && b.walletBase >= 55 && b.walletBase < 70],
    ['base ≥70', b => b.walletBase != null && b.walletBase >= 70],
  ];
  out.push('| Size band | ' + baseTiers.map(([l]) => `${l} N · WR · Flat ROI`).join(' | ') + ' |');
  out.push('|---|' + baseTiers.map(() => '---').join('|') + '|');
  for (const band of sizeBands) {
    const row = [band];
    for (const [, tierFn] of baseTiers) {
      const sub = walletBets.filter(b => tierFn(b) && sizeBand(b.sizeRatio) === band);
      if (!sub.length) { row.push('—'); continue; }
      const a = walletAgg(sub);
      row.push(`N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}%`);
    }
    out.push('| ' + row.join(' | ') + ' |');
  }
  out.push('');

  // ── §6d. Source B — per-wallet own-median size ─────────────────
  // For every wallet in positions with ≥5 bets, compute the wallet's
  // median invested. Classify each bet as above/below that median and
  // check WR + $ROI.
  out.push('### §6d. Source B — each bet vs wallet\'s own median size (dollar units)');
  out.push('');
  out.push('For every wallet with ≥5 graded positions, classify each of their bets as above- or below-their-own-median invested dollars. Then aggregate WR and dollar ROI across all wallets. This strips out cross-wallet scale and tests the "sized-up bet" hypothesis cleanly.');
  out.push('');
  const bySelfSize = { below: [], above: [], way_above: [] };
  const walletGroups = groupByWallet(positions);
  for (const [w, bets] of walletGroups) {
    if (bets.length < 5) continue;
    const sortedInv = [...bets.map(b => b.invested)].sort((a, b) => a - b);
    const med = sortedInv[Math.floor(sortedInv.length / 2)];
    for (const b of bets) {
      const ratio = med > 0 ? b.invested / med : 1;
      const record = { ...b, selfRatio: ratio };
      if (ratio >= 2) bySelfSize.way_above.push(record);
      else if (ratio >= 1.25) bySelfSize.above.push(record);
      else bySelfSize.below.push(record);
    }
  }
  out.push(mdHeader(['Self-size bucket', 'N', 'WR', 'Invested ($)', 'Settled PnL ($)', 'Dollar ROI']));
  for (const [label, rows] of [['<1.25× own median (routine/below)', bySelfSize.below], ['1.25–2× own median (above)', bySelfSize.above], ['≥2× own median (way above)', bySelfSize.way_above]]) {
    const n = rows.length;
    if (!n) continue;
    const wins = rows.filter(r => r.won === 1).length;
    const wr = (wins / n) * 100;
    const inv = rows.reduce((s, r) => s + r.invested, 0);
    const pnl = rows.reduce((s, r) => s + r.settledPnl, 0);
    const roi = inv > 0 ? (pnl / inv) * 100 : 0;
    out.push(`| ${label} | ${n} | ${wr.toFixed(1)}% | ${inv.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ${sign(pnl, 0)} | ${sign(roi)}% |`);
  }
  out.push('');

  // ── §6e. Only CONFIRMED WINNERS — does size matter for them? ───
  const confirmedWinnerWallets = new Set(reliableWinners.map(r => r.wallet));
  if (confirmedWinnerWallets.size) {
    out.push('### §6e. Cross-source confirmed winners — is size conviction the tell?');
    out.push('');
    out.push(`Restricting Source B to the ${confirmedWinnerWallets.size} wallets confirmed-positive in BOTH sources (see §5a).`);
    out.push('');
    out.push(mdHeader(['Self-size bucket', 'N', 'WR', 'Invested ($)', 'Settled PnL ($)', 'Dollar ROI']));
    const confirmedBuckets = { below: [], above: [], way_above: [] };
    for (const [w, bets] of walletGroups) {
      if (!confirmedWinnerWallets.has(w) || bets.length < 3) continue;
      const sortedInv = [...bets.map(b => b.invested)].sort((a, b) => a - b);
      const med = sortedInv[Math.floor(sortedInv.length / 2)];
      for (const b of bets) {
        const ratio = med > 0 ? b.invested / med : 1;
        if (ratio >= 2) confirmedBuckets.way_above.push(b);
        else if (ratio >= 1.25) confirmedBuckets.above.push(b);
        else confirmedBuckets.below.push(b);
      }
    }
    for (const [label, rows] of [['<1.25× own median (routine/below)', confirmedBuckets.below], ['1.25–2× own median (above)', confirmedBuckets.above], ['≥2× own median (way above)', confirmedBuckets.way_above]]) {
      const n = rows.length;
      if (!n) continue;
      const wins = rows.filter(r => r.won === 1).length;
      const wr = (wins / n) * 100;
      const inv = rows.reduce((s, r) => s + r.invested, 0);
      const pnl = rows.reduce((s, r) => s + r.settledPnl, 0);
      const roi = inv > 0 ? (pnl / inv) * 100 : 0;
      out.push(`| ${label} | ${n} | ${wr.toFixed(1)}% | ${inv.toLocaleString(undefined, { maximumFractionDigits: 0 })} | ${sign(pnl, 0)} | ${sign(roi)}% |`);
    }
    out.push('');
  }

  // ── Aggregate headline ─────────────────────────────────────────
  out.push('---');
  out.push('## Headline numbers');
  out.push('');
  const aAll = walletAgg(walletBets);
  const bAll = walletAgg(positions);
  out.push(`- Source A: across **${aAll.n}** wallet-bets, **${aAll.wr.toFixed(1)}% WR**, flat ROI **${sign(aAll.flatRoi)}%**, flat PnL **${sign(aAll.flatPnl, 2)}u**.`);
  out.push(`- Source B: across **${bAll.n}** positions, **${bAll.wr.toFixed(1)}% WR**, dollar ROI **${bAll.dollarRoi != null ? sign(bAll.dollarRoi) + '%' : '—'}**, dollar PnL **${sign(bAll.dollarPnl, 0)}**.`);
  out.push('');
  out.push('---');
  out.push(`*Auto-generated by \`scripts/walletPerformanceReport.js\`.  Short wallet hashes (e.g. \`fcc12b\`) are the first 6 chars of the wallet address; full addresses are available in Firestore.*`);
  out.push('');

  const filepath = join(__dirname, '..', 'WALLET_PERFORMANCE_REPORT.md');
  writeFileSync(filepath, out.join('\n'));
  console.log(`Wrote ${filepath}`);
  console.log(`Source A: ${aAll.n} wallet-bets, ${new Set(walletBets.map(b => b.wallet)).size} wallets · WR ${aAll.wr.toFixed(1)}% · flatROI ${sign(aAll.flatRoi)}% · PnL ${sign(aAll.flatPnl, 2)}u`);
  console.log(`Source B: ${bAll.n} positions, ${new Set(positions.map(p => p.wallet)).size} wallets · WR ${bAll.wr.toFixed(1)}% · $ROI ${bAll.dollarRoi != null ? sign(bAll.dollarRoi) + '%' : '—'} · $PnL ${sign(bAll.dollarPnl, 0)}`);
  process.exit(0);
})();
