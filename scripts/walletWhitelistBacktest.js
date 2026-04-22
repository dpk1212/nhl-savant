/**
 * walletWhitelistBacktest.js — "what if we only followed the sport-profitable
 * wallets?" backtest against V8-era Sharp Flow picks.
 *
 * Pipeline:
 *   1. Build per-sport wallet whitelists from two independent sources:
 *        - Source A — walletDetails on graded Sharp Flow picks (flat ROI)
 *        - Source B — sharp_action_positions (dollar ROI)
 *      A wallet enters sport X's whitelist when (≥2 bets in X) AND a rule
 *      about that sport's profit record holds. We build three whitelists:
 *        • CONFIRMED — profitable in BOTH sources (strict / small)
 *        • FLAT      — flat PnL > 0 in Source A (moderate)
 *        • WR50      — WR ≥ 50% in Source A (broadest)
 *   2. For every graded V8 pick, inspect walletDetails on the peak (or lock)
 *      snapshot of BOTH sides and count how many whitelist wallets backed
 *      each side ("forW" = on the V8-picked side, "agW" = against).
 *   3. Score the pick under four lenses:
 *        L1 — ALIGNMENT  : bucket picks by (forW - agW) and show WR/ROI
 *        L2 — FILTER     : require forW ≥ 1 and agW = 0 (follow V8 only when
 *                          the sport's profitable wallets agree with it)
 *        L3 — RE-SIDE    : flip V8's side when whitelist leans the other way
 *        L4 — WHITELIST-ONLY : ignore V8, pick whichever side has more
 *                              whitelist wallets (requires ≥2-wallet margin)
 *   4. Repeat each lens (a) IN-SAMPLE (full-period whitelist — leaky but
 *      illustrative) and (b) LEAVE-ONE-DATE-OUT (whitelist built from all
 *      graded games OTHER than the game's date — honest estimate of what
 *      the approach would have earned if we'd known the prior).
 *
 * Output: WALLET_WHITELIST_BACKTEST.md
 *
 * Usage: node scripts/walletWhitelistBacktest.js
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
const MIN_BETS_IN_SPORT = 2;

const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };
const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const sign = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d);
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

// ── Load every graded V8-era pick with full walletDetails on both sides ─
async function loadPicks() {
  const picks = [];
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

      // V8 picked side (the one that locked / shadowed); look for lockStage
      // or fall back to the first side with a result record.
      let pickedSide = null;
      for (const sk of Object.keys(sides)) {
        const s = sides[sk];
        if (s.lockStage === 'LOCKED' || s.lock?.lockStage === 'LOCKED' || s.peak?.lockStage === 'LOCKED') { pickedSide = sk; break; }
      }
      if (!pickedSide) {
        for (const sk of Object.keys(sides)) {
          if (sides[sk].result?.outcome) { pickedSide = sk; break; }
        }
      }
      if (!pickedSide) continue;

      // Gather wallet lists per side.  walletDetails lives on peak.v8Scoring
      // (or lock.v8Scoring).  Walls typically appear once per game under the
      // tracked side but each wallet's own `side` field records which side
      // they bet.
      const wallets = []; // {wallet, side}
      for (const sk of Object.keys(sides)) {
        const v8 = sides[sk].peak?.v8Scoring || sides[sk].lock?.v8Scoring;
        const wd = v8?.walletDetails;
        if (!Array.isArray(wd)) continue;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          wallets.push({ wallet: w.wallet, side: w.side });
        }
      }

      // Dedupe: a wallet may appear under multiple tracked sides' walletDetails
      // but its w.side is authoritative.
      const byWallet = new Map();
      for (const w of wallets) {
        if (!byWallet.has(w.wallet)) byWallet.set(w.wallet, w.side);
      }
      const walletList = [...byWallet.entries()].map(([wallet, side]) => ({ wallet, side }));

      const pickedOdds = sides[pickedSide].peak?.odds ?? sides[pickedSide].lock?.odds ?? 0;
      const oppSide = OPPOSITE[pickedSide] || Object.keys(sides).find(k => k !== pickedSide);
      const oppOdds = sides[oppSide]?.peak?.odds ?? sides[oppSide]?.lock?.odds ?? -pickedOdds;
      const pickedWon = pickedSide === winningSide;

      picks.push({
        gameKey: doc.id,
        date: d.date,
        sport: d.sport || 'UNK',
        market,
        pickedSide,
        oppSide,
        pickedOdds,
        oppOdds,
        winningSide,
        pickedWon,
        wallets: walletList,
      });
    }
  }
  return picks;
}

// Build a sport→Set<wallet> whitelist, optionally EXCLUDING a specific date
// (for leave-one-date-out backtests).
function buildWhitelists(picks, positions, { excludeDate = null, rule = 'FLAT' } = {}) {
  // Re-derive per-sport wallet stats from the pool, minus excluded date.
  const bySportWalletA = new Map(); // "sport|wallet" -> {n, wins, flatPnl}
  for (const p of picks) {
    if (excludeDate && p.date === excludeDate) continue;
    for (const w of p.wallets) {
      const key = `${p.sport}|${w.wallet}`;
      const rec = bySportWalletA.get(key) || { n: 0, wins: 0, flatPnl: 0 };
      const won = w.side === p.winningSide ? 1 : 0;
      // Note we don't know the odds the wallet actually got on their side,
      // but we DO know which side's peak odds live on this doc.
      // For whitelist-building purposes we just use binary flat at -110-ish
      // via pickedOdds or oppOdds depending on the wallet's side.
      const walletOdds = w.side === p.pickedSide ? p.pickedOdds : p.oppOdds;
      rec.n += 1;
      rec.wins += won;
      rec.flatPnl += flatProfit(walletOdds, won === 1);
      bySportWalletA.set(key, rec);
    }
  }

  const bySportWalletB = new Map(); // "sport|walletShort" -> {n, $Pnl, wins}
  for (const p of positions) {
    if (excludeDate && p.date === excludeDate) continue;
    const key = `${p.sport}|${p.wallet}`;
    const rec = bySportWalletB.get(key) || { n: 0, wins: 0, invested: 0, dollarPnl: 0 };
    rec.n += 1;
    rec.wins += p.won;
    rec.invested += p.invested;
    rec.dollarPnl += p.settledPnl;
    bySportWalletB.set(key, rec);
  }

  // Build 3 rule flavors at once; caller picks which to use.
  const flavors = { CONFIRMED: new Map(), FLAT: new Map(), WR50: new Map() };
  const ensure = (m, sport) => { if (!m.has(sport)) m.set(sport, new Set()); return m.get(sport); };

  // Source A-driven: FLAT + WR50
  for (const [key, r] of bySportWalletA) {
    if (r.n < MIN_BETS_IN_SPORT) continue;
    const [sport, wallet] = key.split('|');
    if (r.flatPnl > 0) ensure(flavors.FLAT, sport).add(wallet);
    if ((r.wins / r.n) >= 0.5) ensure(flavors.WR50, sport).add(wallet);
  }

  // Confirmed = Source A flat > 0 AND Source B dollar > 0 in same sport
  const bSetBySport = new Map(); // sport -> Set of wallets with $ > 0
  for (const [key, r] of bySportWalletB) {
    if (r.n < MIN_BETS_IN_SPORT) continue;
    const [sport, wallet] = key.split('|');
    if (r.dollarPnl > 0) ensure(bSetBySport, sport).add(wallet);
  }
  for (const [sport, set] of flavors.FLAT) {
    const b = bSetBySport.get(sport) || new Set();
    for (const wallet of set) if (b.has(wallet)) ensure(flavors.CONFIRMED, sport).add(wallet);
  }

  return flavors;
}

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

// Count whitelist wallets on each side of a pick under a given sport whitelist.
function whitelistTally(pick, whitelistBySport) {
  const wl = whitelistBySport.get(pick.sport) || new Set();
  let forW = 0, agW = 0;
  for (const w of pick.wallets) {
    if (!wl.has(w.wallet)) continue;
    if (w.side === pick.pickedSide) forW += 1;
    else if (w.side === pick.oppSide) agW += 1;
  }
  return { forW, agW };
}

// Backtest helpers ───────────────────────────────────────────────────
function scorePickFromSide(pick, side) {
  const won = side === pick.winningSide;
  const odds = side === pick.pickedSide ? pick.pickedOdds : pick.oppOdds;
  return { won: won ? 1 : 0, flat: flatProfit(odds, won) };
}

function backtestLenses(picks, whitelistFlavor, whitelistFactory) {
  // whitelistFactory(pick) returns the Set<wallet> FOR THAT SPORT that is
  // eligible at the time of that pick (for LODO it excludes pick.date).
  const buckets = new Map(); // alignment bucket -> {n, wins, flatPnl}
  const filterAgree = [];    // picks where forW ≥ 1 && agW = 0
  const filterStrong = [];   // picks where forW ≥ 2 && agW ≤ 1 (more selective)
  const resideActions = [];  // per-pick: {side, won, flat} after possibly flipping
  const whitelistOnlyActions = []; // only when |forW − agW| ≥ 2

  for (const p of picks) {
    const wl = whitelistFactory(p);
    let forW = 0, agW = 0;
    for (const w of p.wallets) {
      if (!wl.has(w.wallet)) continue;
      if (w.side === p.pickedSide) forW += 1;
      else if (w.side === p.oppSide) agW += 1;
    }
    const delta = forW - agW;

    // L1 alignment bucket
    const bk = delta >= 2 ? 'Δ ≥ +2'
             : delta === 1 ? 'Δ = +1'
             : delta === 0 ? 'Δ = 0'
             : delta === -1 ? 'Δ = −1'
             : 'Δ ≤ −2';
    const rec = buckets.get(bk) || { n: 0, wins: 0, flatPnl: 0, invested: 0 };
    rec.n += 1;
    rec.wins += p.pickedWon ? 1 : 0;
    rec.flatPnl += flatProfit(p.pickedOdds, p.pickedWon);
    buckets.set(bk, rec);

    // L2 filter: V8 agrees with whitelist
    if (forW >= 1 && agW === 0) filterAgree.push(p);
    if (forW >= 2 && agW <= 1)  filterStrong.push(p);

    // L3 reside: flip if whitelist leans the other way
    let chosenSide = p.pickedSide;
    if (delta <= -1) chosenSide = p.oppSide; // whitelist disagrees → flip
    resideActions.push({ ...p, chosenSide, ...scorePickFromSide(p, chosenSide) });

    // L4 whitelist-only: follow whitelist consensus with ≥2 margin
    if (Math.abs(delta) >= 2) {
      const chosen = delta > 0 ? p.pickedSide : p.oppSide;
      whitelistOnlyActions.push({ ...p, chosenSide: chosen, ...scorePickFromSide(p, chosen) });
    }
  }

  const agg = (arr, sideKey = 'pickedSide') => {
    const n = arr.length;
    if (!n) return { n: 0, wins: 0, wr: 0, flatPnl: 0, flatRoi: 0 };
    let wins = 0, flatPnl = 0;
    for (const p of arr) {
      const side = p.chosenSide || p[sideKey];
      const s = scorePickFromSide(p, side);
      wins += s.won;
      flatPnl += s.flat;
    }
    return { n, wins, wr: (wins / n) * 100, flatPnl, flatRoi: (flatPnl / n) * 100 };
  };

  return {
    buckets,
    filterAgree: agg(filterAgree),
    filterStrong: agg(filterStrong),
    reside: agg(resideActions),
    whitelistOnly: agg(whitelistOnlyActions),
    whitelistOnlyActions,
  };
}

// Format alignment buckets in a stable order ─────────────────────────
function bucketsToTable(buckets, label = '') {
  const order = ['Δ ≥ +2', 'Δ = +1', 'Δ = 0', 'Δ = −1', 'Δ ≤ −2'];
  const rows = [mdHeader([label || 'Bucket', 'N', 'W', 'L', 'WR%', 'Flat PnL (u)', 'Flat ROI'])];
  for (const bk of order) {
    const r = buckets.get(bk);
    if (!r) { rows.push(`| ${bk} | — | — | — | — | — | — |`); continue; }
    const wr = (r.wins / r.n) * 100;
    const roi = (r.flatPnl / r.n) * 100;
    rows.push(`| ${bk} | ${r.n} | ${r.wins} | ${r.n - r.wins} | ${wr.toFixed(1)}% | ${sign(r.flatPnl, 2)} | ${sign(roi)}% |`);
  }
  return rows.join('\n');
}

function sportBreakdown(picks, factory) {
  const sports = [...new Set(picks.map(p => p.sport))].sort();
  const rows = [mdHeader(['Sport', 'Baseline N / WR / ROI', 'FILTER (forW≥1, agW=0) N / WR / ROI', 'RE-SIDE (flip on Δ≤−1) N / WR / ROI'])];
  for (const sport of sports) {
    const slice = picks.filter(p => p.sport === sport);
    const res = backtestLenses(slice, 'per-sport', factory);
    const baselineN = slice.length;
    const baselineWins = slice.filter(p => p.pickedWon).length;
    const baselineFlat = slice.reduce((s, p) => s + flatProfit(p.pickedOdds, p.pickedWon), 0);
    rows.push(`| ${sport} | ${baselineN} / ${((baselineWins / Math.max(1, baselineN)) * 100).toFixed(1)}% / ${sign((baselineFlat / Math.max(1, baselineN)) * 100)}% | ${res.filterAgree.n} / ${res.filterAgree.wr.toFixed(1)}% / ${sign(res.filterAgree.flatRoi)}% | ${res.reside.n} / ${res.reside.wr.toFixed(1)}% / ${sign(res.reside.flatRoi)}% |`);
  }
  return rows.join('\n');
}

(async () => {
  console.log('Loading V8-era picks and positions…');
  const picks = await loadPicks();
  const positions = await loadPositions();
  const dates = [...new Set(picks.map(p => p.date))].sort();
  const sports = [...new Set(picks.map(p => p.sport))].sort();
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const out = [];
  out.push('# Wallet-Whitelist Backtest');
  out.push('');
  out.push(`Generated: ${nowET} ET`);
  out.push('');
  out.push(`Backtest of "what if V8 had known which wallets were profitable per sport and only acted on their consensus?"`);
  out.push('');
  out.push(`**Sample**: ${picks.length} graded V8-era picks across ${sports.length} sports (${sports.join(', ')}), dates ${dates[0]} → ${dates.at(-1)}.`);
  out.push('');
  out.push(`**Whitelists** (rebuilt per backtest variant):`);
  out.push(`- \`CONFIRMED\` — wallet has flat PnL > 0 in Source A **AND** dollar PnL > 0 in Source B (same sport, ≥${MIN_BETS_IN_SPORT} bets).`);
  out.push(`- \`FLAT\` — wallet has flat PnL > 0 in Source A (same sport, ≥${MIN_BETS_IN_SPORT} bets). [broader]`);
  out.push(`- \`WR50\` — wallet has WR ≥ 50% in Source A (same sport, ≥${MIN_BETS_IN_SPORT} bets). [broadest]`);
  out.push('');
  out.push('**Lenses** applied to every V8 pick:');
  out.push('- **L1 ALIGNMENT** — bucket by `Δ = forW − agW` (how much more whitelist wallets back the V8 side vs. the other) and show baseline V8 WR/ROI per bucket.');
  out.push('- **L2 FILTER** — only keep picks where whitelist agrees: `forW ≥ 1 AND agW = 0`.');
  out.push('- **L3 RE-SIDE** — if `Δ ≤ −1` (whitelist favors the other side), flip to the opposing side.');
  out.push('- **L4 WHITELIST-ONLY** — ignore V8, take whichever side has `|Δ| ≥ 2`.');
  out.push('');
  out.push('All figures are flat 1u per pick.  Dollar PnL is informative but we report flat because V8 sizing rules are in flux.');
  out.push('');

  // Baseline
  const baselineN = picks.length;
  const baselineWins = picks.filter(p => p.pickedWon).length;
  const baselineFlat = picks.reduce((s, p) => s + flatProfit(p.pickedOdds, p.pickedWon), 0);
  out.push(`**Baseline V8** (no whitelist filter applied): N=${baselineN}, WR=${((baselineWins / baselineN) * 100).toFixed(1)}%, Flat PnL=${sign(baselineFlat, 2)}u, Flat ROI=${sign((baselineFlat / baselineN) * 100)}%.`);
  out.push('');

  // ── IN-SAMPLE (full whitelist) ─────────────────────────────────────
  out.push('---');
  out.push('## §A. IN-SAMPLE backtest (full-period whitelist)');
  out.push('');
  out.push('> ⚠️ **Leakage warning:** the whitelist used here is built from the *same* graded picks it is evaluated against, so these numbers are an upper bound on what the approach could have done with perfect hindsight. See §B for the honest leave-one-date-out version.');
  out.push('');

  for (const flavor of ['CONFIRMED', 'FLAT', 'WR50']) {
    const whitelists = buildWhitelists(picks, positions, {}).__proto__ === Object.prototype
      ? buildWhitelists(picks, positions, {})
      : buildWhitelists(picks, positions, {});
    const flavorMap = whitelists[flavor];
    const factory = (p) => flavorMap.get(p.sport) || new Set();
    const res = backtestLenses(picks, flavor, factory);

    out.push(`### ${flavor} whitelist`);
    out.push('');
    // per-sport whitelist sizes
    const sizes = sports.map(s => `${s}=${(flavorMap.get(s)?.size ?? 0)}`).join(', ');
    out.push(`_Whitelist size per sport:_ ${sizes}`);
    out.push('');
    out.push('**L1 — Alignment buckets (baseline V8 WR/ROI, sliced by Δ):**');
    out.push('');
    out.push(bucketsToTable(res.buckets));
    out.push('');
    out.push('**L2/L3/L4 summary vs. baseline:**');
    out.push('');
    out.push(mdHeader(['Lens', 'N', 'WR%', 'Flat PnL (u)', 'Flat ROI', 'Δ ROI vs. baseline']));
    const baselineRoi = (baselineFlat / baselineN) * 100;
    const line = (label, r) => `| ${label} | ${r.n} | ${r.wr.toFixed(1)}% | ${sign(r.flatPnl, 2)} | ${sign(r.flatRoi)}% | ${sign(r.flatRoi - baselineRoi)}% |`;
    out.push(line('BASELINE', { n: baselineN, wr: (baselineWins / baselineN) * 100, flatPnl: baselineFlat, flatRoi: baselineRoi }));
    out.push(line('L2 FILTER (forW≥1, agW=0)', res.filterAgree));
    out.push(line('L2 FILTER (forW≥2, agW≤1)', res.filterStrong));
    out.push(line('L3 RE-SIDE (flip on Δ≤−1)', res.reside));
    out.push(line('L4 WHITELIST-ONLY (|Δ|≥2)', res.whitelistOnly));
    out.push('');

    out.push('**Per-sport breakdown (baseline vs. filter vs. re-side):**');
    out.push('');
    out.push(sportBreakdown(picks, factory));
    out.push('');
  }

  // ── LEAVE-ONE-DATE-OUT ─────────────────────────────────────────────
  out.push('---');
  out.push('## §B. Leave-one-date-out backtest (honest)');
  out.push('');
  out.push('For every pick on date D, the whitelist is rebuilt from **all graded data on dates ≠ D**.  No future information is used to grade the pick.');
  out.push('');

  // Pre-compute per-date whitelists (once per flavor) to avoid recomputing n×m.
  const perDateWhitelists = new Map(); // date → flavors
  for (const date of dates) {
    perDateWhitelists.set(date, buildWhitelists(picks, positions, { excludeDate: date }));
  }

  for (const flavor of ['CONFIRMED', 'FLAT', 'WR50']) {
    const factory = (p) => perDateWhitelists.get(p.date)?.[flavor]?.get(p.sport) || new Set();
    const res = backtestLenses(picks, flavor, factory);

    out.push(`### ${flavor} whitelist (LODO)`);
    out.push('');
    out.push('**L1 — Alignment buckets:**');
    out.push('');
    out.push(bucketsToTable(res.buckets));
    out.push('');
    out.push('**L2/L3/L4 summary vs. baseline:**');
    out.push('');
    out.push(mdHeader(['Lens', 'N', 'WR%', 'Flat PnL (u)', 'Flat ROI', 'Δ ROI vs. baseline']));
    const baselineRoi = (baselineFlat / baselineN) * 100;
    const line = (label, r) => `| ${label} | ${r.n} | ${r.wr.toFixed(1)}% | ${sign(r.flatPnl, 2)} | ${sign(r.flatRoi)}% | ${sign(r.flatRoi - baselineRoi)}% |`;
    out.push(line('BASELINE', { n: baselineN, wr: (baselineWins / baselineN) * 100, flatPnl: baselineFlat, flatRoi: baselineRoi }));
    out.push(line('L2 FILTER (forW≥1, agW=0)', res.filterAgree));
    out.push(line('L2 FILTER (forW≥2, agW≤1)', res.filterStrong));
    out.push(line('L3 RE-SIDE (flip on Δ≤−1)', res.reside));
    out.push(line('L4 WHITELIST-ONLY (|Δ|≥2)', res.whitelistOnly));
    out.push('');

    out.push('**Per-sport breakdown (baseline vs. filter vs. re-side):**');
    out.push('');
    out.push(sportBreakdown(picks, factory));
    out.push('');
  }

  // ── §C. Every pick with whitelist tally (sanity check) ─────────────
  out.push('---');
  out.push('## §C. Per-pick whitelist tally (in-sample, FLAT flavor)');
  out.push('');
  out.push('For each graded V8 pick, the counts of FLAT-whitelist wallets that bet the V8 side vs. the opposing side. Use this to eyeball alignment vs. outcome.');
  out.push('');
  const { FLAT } = buildWhitelists(picks, positions, {});
  const factory = (p) => FLAT.get(p.sport) || new Set();
  const sorted = [...picks].sort((a, b) => (a.date || '').localeCompare(b.date || '') || a.gameKey.localeCompare(b.gameKey));
  out.push(mdHeader(['Date', 'Sport', 'Mkt', 'Game', 'V8 side', 'Odds', 'Result', 'Whitelist for V8', 'Whitelist vs V8', 'Δ']));
  for (const p of sorted) {
    const { forW, agW } = whitelistTally(p, FLAT);
    const result = p.pickedWon ? 'W' : 'L';
    out.push(`| ${p.date} | ${p.sport} | ${p.market} | ${p.gameKey} | ${p.pickedSide} | ${p.pickedOdds > 0 ? '+' : ''}${p.pickedOdds} | ${result} | ${forW} | ${agW} | ${forW - agW >= 0 ? '+' : ''}${forW - agW} |`);
  }
  out.push('');
  out.push('---');
  out.push('*Generated by `scripts/walletWhitelistBacktest.js`.*');
  out.push('');

  const outPath = join(__dirname, '..', 'WALLET_WHITELIST_BACKTEST.md');
  writeFileSync(outPath, out.join('\n'), 'utf8');
  console.log(`Wrote ${outPath}`);
  process.exit(0);
})();
