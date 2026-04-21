/**
 * exportWalletProfiles.js — build a full roster of every sharp wallet
 * we have data on, in a Firebase-ready shape.
 *
 * Inputs (same as walletPerformanceReport.js):
 *   - sharpFlow{Picks,Spreads,Totals} → v8Scoring.walletDetails[]
 *   - sharp_action_positions
 *
 * Outputs:
 *   - data/wallet-profiles.json  — full JSON keyed by walletShort, ready
 *     to upsert into a Firestore collection `sharpWalletProfiles`.
 *   - WALLET_ROSTER.md           — human-readable table of every wallet.
 *
 * Firebase sync (opt-in):
 *   --write-firebase      Upsert all profiles into collection
 *                         `sharpWalletProfiles` (default: skipped).
 *   --collection=xxx      Override target collection name.
 *
 * Usage:
 *   node scripts/exportWalletProfiles.js                    # JSON + MD only
 *   node scripts/exportWalletProfiles.js --write-firebase   # also push
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = new Set(process.argv.slice(2));
const WRITE_FB = argv.has('--write-firebase');
const collectionArg = [...argv].find(a => a.startsWith('--collection='));
const TARGET_COLLECTION = collectionArg ? collectionArg.split('=')[1] : 'sharpWalletProfiles';

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

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const r2 = (v) => v == null ? null : Math.round(v * 100) / 100;
const r1 = (v) => v == null ? null : Math.round(v * 10) / 10;
const pct = (v) => v == null ? null : +(v * 100).toFixed(1);

// ── Load Source A (wallet-bets from walletDetails) ─────────────────
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
          const betOdds = sides[w.side]?.peak?.odds ?? sides[w.side]?.lock?.odds ?? oddsForThisSide;
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
            walletBase: w.walletBase ?? null,
            roiNorm: w.roiNorm ?? null,
            rankNorm: w.rankNorm ?? null,
            pnlNorm: w.pnlNorm ?? null,
            rank: w.rank ?? null,
            lifetimeRoi: w.roi ?? null,
            lifetimePnl: w.pnl ?? null,
            contribution: w.contribution ?? null,
            sizeRatio: w.sizeRatio ?? null,
            convictionMult: w.convictionMult ?? null,
            won,
            flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

// ── Load Source B (positions) ──────────────────────────────────────
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
      sport: d.sport,
      market: d.marketType,
      walletShort,
      walletAddress: d.wallet,
      tier: d.tier,
      invested,
      settledPnl,
      avgPrice: d.avgPrice,
      won: settledPnl > 0 ? 1 : 0,
      sportROI: d.sportROI,
      sportPnlTotal: d.sportPnlTotal,
      sportVol: d.sportVol,
      leaderboardRank: d.leaderboardRank,
      sportsLbPercentileTop: d.sportsLbPercentileTop,
    });
  });
  return rows;
}

// ── Aggregation helpers ────────────────────────────────────────────
function picksAgg(bets) {
  const n = bets.length;
  const wins = bets.filter(b => b.won === 1).length;
  const flatPnl = bets.reduce((s, b) => s + (b.flat ?? 0), 0);
  return {
    n, wins, losses: n - wins,
    wr: n ? +(wins / n * 100).toFixed(1) : 0,
    flatPnl: r2(flatPnl),
    flatRoi: n ? +((flatPnl / n) * 100).toFixed(1) : 0,
  };
}
function positionsAgg(bets) {
  const n = bets.length;
  const wins = bets.filter(b => b.won === 1).length;
  const invested = bets.reduce((s, b) => s + b.invested, 0);
  const pnl = bets.reduce((s, b) => s + b.settledPnl, 0);
  return {
    n, wins, losses: n - wins,
    wr: n ? +(wins / n * 100).toFixed(1) : 0,
    invested: Math.round(invested),
    settledPnl: Math.round(pnl),
    dollarRoi: invested > 0 ? +((pnl / invested) * 100).toFixed(1) : null,
  };
}
function median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// ── Verdict logic ──────────────────────────────────────────────────
function verdict(picks, positions) {
  const MIN = 3;
  const aPos = picks.n >= MIN && picks.flatRoi > 0;
  const aNeg = picks.n >= MIN && picks.flatRoi < 0;
  const bPos = positions.n >= MIN && positions.dollarRoi != null && positions.dollarRoi > 0;
  const bNeg = positions.n >= MIN && positions.dollarRoi != null && positions.dollarRoi < 0;
  if (aPos && bPos) return 'CONFIRMED_WINNER';
  if (aNeg && bNeg) return 'CONFIRMED_BLEEDER';
  if (aPos && bNeg) return 'MIXED_PICKS_GOOD_$_BAD';
  if (aNeg && bPos) return 'MIXED_PICKS_BAD_$_GOOD';
  if (aPos && !bPos && !bNeg) return 'PICKS_ONLY_POSITIVE';
  if (aNeg && !bPos && !bNeg) return 'PICKS_ONLY_NEGATIVE';
  if (bPos && !aPos && !aNeg) return 'POSITIONS_ONLY_POSITIVE';
  if (bNeg && !aPos && !aNeg) return 'POSITIONS_ONLY_NEGATIVE';
  return 'INCONCLUSIVE';
}

// ── Build per-wallet profile ───────────────────────────────────────
function buildProfile(walletShort, pickBets, posBets) {
  const latestPick = pickBets.length ? pickBets.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0] : null;
  const latestPos = posBets.length ? posBets.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0] : null;

  const picks = picksAgg(pickBets);
  const positions = positionsAgg(posBets);

  // Sport + market breakdowns
  const bySport = {};
  for (const sport of new Set([...pickBets.map(b => b.sport), ...posBets.map(b => b.sport)].filter(Boolean))) {
    const pp = pickBets.filter(b => b.sport === sport);
    const ps = posBets.filter(b => b.sport === sport);
    bySport[sport] = {
      picks: picksAgg(pp),
      positions: positionsAgg(ps),
    };
  }
  const byMarket = {};
  for (const market of new Set([...pickBets.map(b => b.market), ...posBets.map(b => b.market)].filter(Boolean))) {
    const pp = pickBets.filter(b => b.market === market);
    const ps = posBets.filter(b => b.market === market);
    byMarket[market] = {
      picks: picksAgg(pp),
      positions: positionsAgg(ps),
    };
  }

  // Size signal from positions (own-median buckets)
  let sizeSignal = null;
  if (posBets.length >= 3) {
    const med = median(posBets.map(b => b.invested));
    const buckets = { routine: [], above: [], wayAbove: [] };
    for (const b of posBets) {
      const ratio = med > 0 ? b.invested / med : 1;
      if (ratio >= 2) buckets.wayAbove.push(b);
      else if (ratio >= 1.25) buckets.above.push(b);
      else buckets.routine.push(b);
    }
    sizeSignal = {
      medianInvested: Math.round(med),
      routine: positionsAgg(buckets.routine),
      above: positionsAgg(buckets.above),
      wayAbove: positionsAgg(buckets.wayAbove),
    };
  }

  // Date spans
  const allDates = [...pickBets, ...posBets].map(b => b.date).filter(Boolean).sort();
  const firstDate = allDates[0] || null;
  const lastDate = allDates[allDates.length - 1] || null;

  return {
    walletShort,
    walletAddress: latestPos?.walletAddress || null,
    tier: latestPos?.tier || null,
    latestLbRank: latestPos?.leaderboardRank ?? latestPick?.rank ?? null,
    // Latest quality snapshot (from Source A if available)
    latest: latestPick ? {
      date: latestPick.date,
      walletBase: r1(latestPick.walletBase),
      roiNorm: r1(latestPick.roiNorm),
      rankNorm: r1(latestPick.rankNorm),
      pnlNorm: r1(latestPick.pnlNorm),
      rank: latestPick.rank,
      lifetimeRoi: r1(latestPick.lifetimeRoi),
      lifetimePnl: latestPick.lifetimePnl,
    } : null,
    // Positions context
    positionsContext: latestPos ? {
      sportROI: r2(latestPos.sportROI),
      sportPnlTotal: latestPos.sportPnlTotal,
      sportVol: latestPos.sportVol,
      sportsLbPercentileTop: latestPos.sportsLbPercentileTop,
    } : null,
    // Core stats
    picks,
    positions,
    sizeSignal,
    bySport,
    byMarket,
    verdict: verdict(picks, positions),
    firstBetDate: firstDate,
    lastBetDate: lastDate,
  };
}

(async () => {
  console.log('Loading walletDetails from sharpFlow picks/spreads/totals…');
  const walletBets = await loadWalletBets();
  console.log(`  → ${walletBets.length} graded wallet-bets`);
  console.log('Loading sharp_action_positions…');
  const positions = await loadPositions();
  console.log(`  → ${positions.length} graded positions`);

  // Union of all wallet short hashes
  const allWallets = new Set([
    ...walletBets.map(b => b.wallet),
    ...positions.map(p => p.walletShort),
  ]);
  console.log(`  → ${allWallets.size} unique wallets overall`);

  const profiles = {};
  for (const walletShort of allWallets) {
    const pickBets = walletBets.filter(b => b.wallet === walletShort);
    const posBets = positions.filter(p => p.walletShort === walletShort);
    profiles[walletShort] = buildProfile(walletShort, pickBets, posBets);
  }

  // ── Write JSON ───────────────────────────────────────────────────
  const dataDir = join(__dirname, '..', 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const jsonPath = join(dataDir, 'wallet-profiles.json');
  writeFileSync(jsonPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    v8Cutover: V8_CUTOVER,
    totals: {
      wallets: Object.keys(profiles).length,
      walletBets: walletBets.length,
      positions: positions.length,
    },
    profiles,
  }, null, 2));
  console.log(`Wrote ${jsonPath}`);

  // ── Write Markdown roster ────────────────────────────────────────
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# Sharp Wallet Roster');
  out.push('');
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER}`);
  out.push('');
  out.push('Every sharp wallet we have V8-era data on, sorted by combined conviction score. This is the **full roster** (no minimum-bets filter) — noisy at the tail, but that\'s the point for a tracking dataset. Verdict column reflects the ≥3-bet threshold.');
  out.push('');
  const verdictCounts = {};
  Object.values(profiles).forEach(p => {
    verdictCounts[p.verdict] = (verdictCounts[p.verdict] || 0) + 1;
  });
  out.push('**Roster breakdown by verdict:**');
  out.push('');
  for (const [v, c] of Object.entries(verdictCounts).sort((a, b) => b[1] - a[1])) {
    out.push(`- ${v}: ${c}`);
  }
  out.push('');

  const list = Object.values(profiles);
  // Sort: winners first (confirmed winners top), then bleeders last
  const verdictOrder = [
    'CONFIRMED_WINNER',
    'PICKS_ONLY_POSITIVE',
    'POSITIONS_ONLY_POSITIVE',
    'MIXED_PICKS_GOOD_$_BAD',
    'INCONCLUSIVE',
    'MIXED_PICKS_BAD_$_GOOD',
    'POSITIONS_ONLY_NEGATIVE',
    'PICKS_ONLY_NEGATIVE',
    'CONFIRMED_BLEEDER',
  ];
  list.sort((a, b) => {
    const va = verdictOrder.indexOf(a.verdict);
    const vb = verdictOrder.indexOf(b.verdict);
    if (va !== vb) return va - vb;
    const aScore = (a.picks.flatPnl ?? 0) + ((a.positions.settledPnl ?? 0) / 10000);
    const bScore = (b.picks.flatPnl ?? 0) + ((b.positions.settledPnl ?? 0) / 10000);
    return bScore - aScore;
  });

  out.push('## Full roster');
  out.push('');
  out.push('| Wallet | Verdict | Tier | Rank | A: N | A: WR% | A: flat ROI | A: flat PnL (u) | B: N | B: WR% | B: $ ROI | B: $ PnL | Base | roiNorm | LifetimeROI |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const p of list) {
    const flatPnl = p.picks.flatPnl;
    const pnlStr = flatPnl == null ? '—' : (flatPnl >= 0 ? '+' : '') + flatPnl.toFixed(2);
    const dRoi = p.positions.dollarRoi;
    const dRoiStr = dRoi == null ? '—' : (dRoi >= 0 ? '+' : '') + dRoi + '%';
    const dPnl = p.positions.settledPnl;
    const dPnlStr = dPnl == null ? '—' : (dPnl >= 0 ? '+' : '') + dPnl;
    const flatRoi = p.picks.flatRoi;
    const flatRoiStr = p.picks.n ? ((flatRoi >= 0 ? '+' : '') + flatRoi + '%') : '—';
    out.push(`| ${p.walletShort} | ${p.verdict} | ${p.tier || '—'} | ${p.latestLbRank ?? '—'} | ${p.picks.n} | ${p.picks.n ? p.picks.wr + '%' : '—'} | ${flatRoiStr} | ${pnlStr} | ${p.positions.n} | ${p.positions.n ? p.positions.wr + '%' : '—'} | ${dRoiStr} | ${dPnlStr} | ${p.latest?.walletBase ?? '—'} | ${p.latest?.roiNorm ?? '—'} | ${p.latest?.lifetimeRoi != null ? p.latest.lifetimeRoi + '%' : '—'} |`);
  }
  out.push('');

  // Highlighted winners / bleeders
  out.push('---');
  out.push('## Confirmed winners (≥3 bets in both sources, positive in both)');
  out.push('');
  const winners = list.filter(p => p.verdict === 'CONFIRMED_WINNER');
  if (!winners.length) out.push('_None at this sample size._');
  else {
    out.push('| Wallet | A bets | A flat ROI | B bets | B $ ROI | B $ PnL | walletBase | Lifetime ROI |');
    out.push('|---|---|---|---|---|---|---|---|');
    winners.forEach(p => {
      out.push(`| ${p.walletShort} | ${p.picks.n} | +${p.picks.flatRoi}% | ${p.positions.n} | +${p.positions.dollarRoi}% | +${p.positions.settledPnl} | ${p.latest?.walletBase ?? '—'} | ${p.latest?.lifetimeRoi ?? '—'}% |`);
    });
  }
  out.push('');
  out.push('## Confirmed bleeders (≥3 bets in both sources, negative in both)');
  out.push('');
  const bleeders = list.filter(p => p.verdict === 'CONFIRMED_BLEEDER');
  if (!bleeders.length) out.push('_None at this sample size._');
  else {
    out.push('| Wallet | A bets | A flat ROI | B bets | B $ ROI | B $ PnL | walletBase | Lifetime ROI |');
    out.push('|---|---|---|---|---|---|---|---|');
    bleeders.forEach(p => {
      out.push(`| ${p.walletShort} | ${p.picks.n} | ${p.picks.flatRoi}% | ${p.positions.n} | ${p.positions.dollarRoi}% | ${p.positions.settledPnl} | ${p.latest?.walletBase ?? '—'} | ${p.latest?.lifetimeRoi ?? '—'}% |`);
    });
  }
  out.push('');

  out.push('---');
  out.push('## Data model (for Firebase sync)');
  out.push('');
  out.push(`Profiles are written to \`data/wallet-profiles.json\`. When you're ready to push them to Firestore run:`);
  out.push('');
  out.push('```bash');
  out.push(`node scripts/exportWalletProfiles.js --write-firebase`);
  out.push('```');
  out.push('');
  out.push(`That upserts each profile into the \`${TARGET_COLLECTION}\` collection keyed by \`walletShort\`, so V8 can read it live.`);
  out.push('');
  out.push('Each profile document has this shape:');
  out.push('');
  out.push('```json');
  out.push('{');
  out.push('  "walletShort": "fcc12b",');
  out.push('  "walletAddress": "0x…",');
  out.push('  "verdict": "CONFIRMED_WINNER",');
  out.push('  "tier": "ELITE", "latestLbRank": 34,');
  out.push('  "picks":     { "n": 13, "wins": 8, "wr": 61.5, "flatRoi": 9.8, "flatPnl": 1.28 },');
  out.push('  "positions": { "n": 15, "wins": 8, "wr": 53.3, "invested": 944079, "settledPnl": 48627, "dollarRoi": 5.2 },');
  out.push('  "sizeSignal": { "medianInvested": 42000, "routine": {…}, "above": {…}, "wayAbove": {…} },');
  out.push('  "latest": { "walletBase": 77.8, "roiNorm": 67.8, "lifetimeRoi": 6.3, "rank": 34 },');
  out.push('  "bySport": { "MLB": {…}, "NBA": {…}, "NHL": {…} },');
  out.push('  "byMarket": { "ML": {…}, "SPREAD": {…}, "TOTAL": {…} },');
  out.push('  "firstBetDate": "2026-04-17", "lastBetDate": "2026-04-21"');
  out.push('}');
  out.push('```');
  out.push('');

  const mdPath = join(__dirname, '..', 'WALLET_ROSTER.md');
  writeFileSync(mdPath, out.join('\n'));
  console.log(`Wrote ${mdPath}`);

  // ── Optional Firebase sync ───────────────────────────────────────
  if (WRITE_FB) {
    console.log(`Upserting ${Object.keys(profiles).length} profiles to Firestore collection \`${TARGET_COLLECTION}\`…`);
    const batch = db.batch();
    let count = 0;
    for (const [walletShort, p] of Object.entries(profiles)) {
      const ref = db.collection(TARGET_COLLECTION).doc(walletShort);
      batch.set(ref, {
        ...p,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      count++;
      if (count % 400 === 0) {
        await batch.commit();
        console.log(`  → committed ${count}`);
      }
    }
    await batch.commit();
    console.log(`✓ Upserted ${count} wallet profiles.`);
  } else {
    console.log('\n(Dry run — pass --write-firebase to push to Firestore.)');
  }

  process.exit(0);
})();
