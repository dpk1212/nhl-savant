/**
 * Sweep different ladder sizings to find the optimal staking schedule.
 *
 * Reuses the production v12 score + tier from src/lib/ags.js, then applies
 * various candidate unit ladders. Reports PnL, ROI, max single-bet exposure,
 * total stake, and a "risk-adjusted" metric (PnL / sqrt(stake)) so we can
 * compare across staking aggressiveness.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  aggregateSideV12,
  computeAgsV12,
  AGS_V12_FALLBACK_CALIBRATION,
} from '../src/lib/ags.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();
const HIST_START = '2025-01-01';

const flatPnl = (oc, oddsAm) => {
  if (oc === 'PUSH') return 0;
  const dec = !oddsAm ? 1.91 : (oddsAm < 0 ? 1 + (100/Math.abs(oddsAm)) : 1 + (oddsAm/100));
  return oc === 'WIN' ? dec - 1 : -1;
};
const unitPnl = (oc, oddsAm, units) => {
  if (oc === 'PUSH' || units === 0) return 0;
  if (oc === 'WIN') return oddsAm < 0 ? units * (100/Math.abs(oddsAm)) : units * (oddsAm/100);
  return -units;
};
const getTier = (p, s) => p?.bySport?.[s]?.whitelistTier;
function strictPrior(hist, date, sport) {
  let n = 0, wins = 0, pnl = 0;
  for (const h of hist) { if (h.date >= date) break; if (h.sport !== sport) continue; n++; if (h.won) wins++; pnl += h.pnl; }
  return n === 0 ? null : { n, wr: wins/n, roi: (pnl/n)*100 };
}

async function loadAll() {
  const profiles = new Map();
  (await db.collection('sharpWalletProfiles').get()).forEach(d => profiles.set(String(d.id).toLowerCase(), d.data()));
  const walletHist = new Map();
  const testRows = [];
  for (const [c, m] of [['sharpFlowPicks','ML'],['sharpFlowSpreads','SPREAD'],['sharpFlowTotals','TOTAL']]) {
    const snap = await db.collection(c).where('date', '>=', HIST_START).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        const oc = sd?.result?.outcome || data?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
        const wd = sd.peak?.v8Scoring?.walletDetails || sd.lock?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd) || wd.length === 0) continue;
        const lock = sd.lock || {}, peak = sd.peak || lock;
        const oddsAm = peak.odds || lock.odds || 0;
        for (const w of wd) {
          const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
          if (!short) continue;
          const wonForWallet = (w.side === sideKey && oc === 'WIN') || (w.side && w.side !== sideKey && oc === 'LOSS');
          const pnl = (oc === 'PUSH') ? 0 : wonForWallet ? Math.abs(flatPnl('WIN', oddsAm)) : -1;
          if (!walletHist.has(short)) walletHist.set(short, []);
          walletHist.get(short).push({ date: data.date, sport: data.sport, won: wonForWallet ? 1 : 0, pnl });
        }
        if ((sd.status || data.status) === 'COMPLETED' && sd.promotedBy === 'ags-unified-v9' && !sd.superseded && (oc === 'WIN' || oc === 'LOSS')) {
          testRows.push({
            date: data.date, sport: data.sport, market: m, mySide: sideKey,
            won: oc === 'WIN' ? 1 : 0, oc, peakOdds: oddsAm, walletDetails: wd,
          });
        }
      }
    }
  }
  for (const arr of walletHist.values()) arr.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  testRows.sort((a, b) => a.date.localeCompare(b.date));
  return { profiles, walletHist, testRows };
}

function scoreAll(testRows, profiles, walletHist) {
  for (const r of testRows) {
    const statsFn = (walletShort, sport) => {
      const profile = profiles.get(walletShort);
      const tier = getTier(profile, sport);
      const hist = walletHist.get(walletShort) || [];
      const ps = strictPrior(hist, r.date, sport);
      return { tier: tier || null, priorN: ps?.n ?? 0, priorRoi: ps?.roi ?? 0 };
    };
    const agg = aggregateSideV12(r.walletDetails, r.mySide, r.sport, statsFn);
    const v12 = agg ? computeAgsV12(agg, AGS_V12_FALLBACK_CALIBRATION) : null;
    r.score = v12 ? v12.agsV12 : 0;
    r.tier  = v12 ? v12.tier   : 'FADE';
  }
}

function evalLadder(testRows, ladder) {
  // ladder: { WEAK, LEAN, LOCK, PREMIUM, ELITE } → units (tier names match
  // v11 vocabulary even though v12 added the "score ≤ 0 → FADE" rule).
  let totalStake = 0, totalPnl = 0, totalWins = 0, totalPicks = 0;
  const byTier = {};
  for (const r of testRows) {
    const u = ladder[r.tier] ?? 0;
    if (u === 0) continue;
    const pnl = unitPnl(r.oc, r.peakOdds, u);
    totalStake += u;
    totalPnl += pnl;
    totalPicks += 1;
    if (r.won) totalWins += 1;
    if (!byTier[r.tier]) byTier[r.tier] = { n: 0, wins: 0, stake: 0, pnl: 0, u };
    byTier[r.tier].n += 1;
    byTier[r.tier].stake += u;
    byTier[r.tier].pnl += pnl;
    if (r.won) byTier[r.tier].wins += 1;
  }
  const roi = totalStake > 0 ? totalPnl / totalStake : 0;
  const wr  = totalPicks > 0 ? totalWins / totalPicks : 0;
  const riskAdj = totalStake > 0 ? totalPnl / Math.sqrt(totalStake) : 0;
  // Max single-pick exposure
  const maxBet = Math.max(...Object.values(ladder));
  return { totalStake, totalPnl, totalPicks, totalWins, roi, wr, riskAdj, maxBet, byTier };
}

const LADDERS = [
  { name: 'A: Current     ', l: { WEAK: 0.25, LEAN: 0.50, LOCK: 1.00, PREMIUM: 1.50, ELITE: 2.00 } },
  { name: 'B: BumpTop     ', l: { WEAK: 0.25, LEAN: 0.50, LOCK: 1.00, PREMIUM: 2.00, ELITE: 3.00 } },
  { name: 'C: TopHeavy    ', l: { WEAK: 0.25, LEAN: 0.50, LOCK: 1.00, PREMIUM: 2.50, ELITE: 4.00 } },
  { name: 'D: TopBigger   ', l: { WEAK: 0.25, LEAN: 0.50, LOCK: 1.00, PREMIUM: 3.00, ELITE: 5.00 } },
  { name: 'E: Geometric2x ', l: { WEAK: 0.25, LEAN: 0.50, LOCK: 1.00, PREMIUM: 2.00, ELITE: 4.00 } },
  { name: 'F: Geometric25x', l: { WEAK: 0.25, LEAN: 0.625, LOCK: 1.5625, PREMIUM: 3.91, ELITE: 9.77 } }, // 2.5x stepup (extreme)
  { name: 'G: TrimMid     ', l: { WEAK: 0.10, LEAN: 0.25, LOCK: 0.75, PREMIUM: 2.50, ELITE: 4.00 } }, // de-emphasize losing mid
  { name: 'H: NoWeak      ', l: { WEAK: 0.00, LEAN: 0.50, LOCK: 1.00, PREMIUM: 2.50, ELITE: 4.00 } }, // also mute WEAK
  { name: 'I: NoWeakBig   ', l: { WEAK: 0.00, LEAN: 0.50, LOCK: 1.00, PREMIUM: 3.00, ELITE: 5.00 } },
  { name: 'J: KellyShaped ', l: { WEAK: 0.10, LEAN: 0.50, LOCK: 1.00, PREMIUM: 2.00, ELITE: 3.50 } },
  { name: 'K: TopOnly     ', l: { WEAK: 0.00, LEAN: 0.00, LOCK: 0.00, PREMIUM: 2.00, ELITE: 4.00 } }, // surgical
];

async function main() {
  console.log('═════ AGS-U v12 — LADDER SIZING SWEEP ═════\n');
  console.log('Comparing 11 candidate ladders on the 282-pick v9 sample.\n');

  const { profiles, walletHist, testRows } = await loadAll();
  scoreAll(testRows, profiles, walletHist);

  // Per-tier raw stats (constant across ladders)
  const tierStats = {};
  for (const r of testRows) {
    if (!tierStats[r.tier]) tierStats[r.tier] = { n: 0, wins: 0, flatPnl: 0 };
    tierStats[r.tier].n += 1;
    if (r.won) tierStats[r.tier].wins += 1;
    tierStats[r.tier].flatPnl += flatPnl(r.oc, r.peakOdds);
  }
  console.log('TIER STATS (sample-invariant — these are the picks we have to work with):');
  console.log('  Tier      | N   | WR    | Flat ROI%   | Flat PnL');
  console.log('  ──────────┼─────┼───────┼─────────────┼──────────');
  for (const t of ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK', 'FADE']) {
    const s = tierStats[t];
    if (!s) continue;
    const wr = (s.wins / s.n * 100).toFixed(1);
    const roi = (s.flatPnl / s.n * 100).toFixed(2);
    const pnl = s.flatPnl.toFixed(2);
    console.log(`  ${t.padEnd(8)}  | ${String(s.n).padStart(3)} | ${wr.padStart(4)}% | ${roi.padStart(8)}%   | ${s.flatPnl >= 0 ? '+' : ''}${pnl.padStart(7)}u`);
  }

  console.log('\n═════ LADDER COMPARISON ═════\n');
  console.log('Each row: stake / PnL / ROI / max-bet / risk-adj-score');
  console.log('(risk-adj = PnL / sqrt(stake) — higher means better edge per unit of variance)\n');
  console.log('  Ladder           | Stake    | PnL       | ROI      | MaxBet | Risk-Adj | Top-2 Stake | Top-2 PnL');
  console.log('  ─────────────────┼──────────┼───────────┼──────────┼────────┼──────────┼─────────────┼─────────────');
  const results = [];
  for (const { name, l } of LADDERS) {
    const r = evalLadder(testRows, l);
    // Top-2 = ELITE+PREMIUM only contribution
    const top2Stake = (r.byTier.ELITE?.stake || 0) + (r.byTier.PREMIUM?.stake || 0);
    const top2Pnl   = (r.byTier.ELITE?.pnl   || 0) + (r.byTier.PREMIUM?.pnl   || 0);
    results.push({ name, l, r, top2Stake, top2Pnl });
    const stakeStr = r.totalStake.toFixed(2).padStart(7);
    const pnlStr   = (r.totalPnl >= 0 ? '+' : '') + r.totalPnl.toFixed(2).padStart(6);
    const roiStr   = (r.roi >= 0 ? '+' : '') + (r.roi * 100).toFixed(2).padStart(5) + '%';
    const maxStr   = r.maxBet.toFixed(2).padStart(5);
    const raStr    = (r.riskAdj >= 0 ? '+' : '') + r.riskAdj.toFixed(3).padStart(5);
    const t2sStr   = top2Stake.toFixed(2).padStart(7);
    const t2pStr   = (top2Pnl >= 0 ? '+' : '') + top2Pnl.toFixed(2).padStart(6);
    console.log(`  ${name} | ${stakeStr}u | ${pnlStr}u  | ${roiStr} | ${maxStr}u | ${raStr}  | ${t2sStr}u    | ${t2pStr}u`);
  }

  console.log('\n═════ DETAILED BREAKDOWN OF TOP 4 LADDERS BY PnL ═════\n');
  const top4 = results.slice().sort((a, b) => b.r.totalPnl - a.r.totalPnl).slice(0, 4);
  for (const { name, l, r } of top4) {
    console.log(`▶ ${name.trim()}  ladder: WEAK=${l.WEAK}u LEAN=${l.LEAN}u LOCK=${l.LOCK}u PREM=${l.PREMIUM}u ELITE=${l.ELITE}u`);
    console.log(`  Total: ${r.totalPicks} picks · ${r.totalStake.toFixed(2)}u staked · ${r.totalPnl >= 0 ? '+' : ''}${r.totalPnl.toFixed(2)}u PnL · ${(r.roi*100).toFixed(2)}% ROI`);
    console.log('  Tier      | N   | u/pick | Stake     | Wins | WR    | PnL       | ROI');
    console.log('  ──────────┼─────┼────────┼───────────┼──────┼───────┼───────────┼──────');
    for (const t of ['ELITE','PREMIUM','LOCK','LEAN','WEAK']) {
      const s = r.byTier[t]; if (!s) continue;
      const wr = (s.wins/s.n*100).toFixed(1);
      const tRoi = s.stake > 0 ? (s.pnl/s.stake*100).toFixed(2) : '—';
      console.log(`  ${t.padEnd(8)}  | ${String(s.n).padStart(3)} | ${s.u.toFixed(2)}u  | ${s.stake.toFixed(2).padStart(7)}u | ${String(s.wins).padStart(4)} | ${wr.padStart(4)}% | ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2).padStart(7)}u | ${tRoi !== '—' ? (Number(tRoi) >= 0 ? '+' : '') + tRoi + '%' : '—'}`);
    }
    console.log('');
  }

  // Per-sport perf for the recommended ladder (highest risk-adj among "reasonable" ones)
  // Reasonable = max bet ≤ 5u
  const reasonable = results.filter(x => x.r.maxBet <= 5);
  const byRiskAdj = reasonable.slice().sort((a, b) => b.r.riskAdj - a.r.riskAdj);
  const byPnl = reasonable.slice().sort((a, b) => b.r.totalPnl - a.r.totalPnl);
  console.log('═════ RECOMMENDATION RANKINGS ═════\n');
  console.log('TOP BY ROI:');
  reasonable.slice().sort((a, b) => b.r.roi - a.r.roi).slice(0, 5).forEach(x =>
    console.log(`  ${x.name} ROI=${(x.r.roi*100).toFixed(2)}% PnL=${x.r.totalPnl >= 0 ? '+' : ''}${x.r.totalPnl.toFixed(2)}u Stake=${x.r.totalStake.toFixed(2)}u`));
  console.log('\nTOP BY ABSOLUTE PnL (within max-5u ladders):');
  byPnl.slice(0, 5).forEach(x =>
    console.log(`  ${x.name} PnL=${x.r.totalPnl >= 0 ? '+' : ''}${x.r.totalPnl.toFixed(2)}u ROI=${(x.r.roi*100).toFixed(2)}% Stake=${x.r.totalStake.toFixed(2)}u`));
  console.log('\nTOP BY RISK-ADJ (PnL / sqrt(stake)):');
  byRiskAdj.slice(0, 5).forEach(x =>
    console.log(`  ${x.name} RiskAdj=${x.r.riskAdj.toFixed(3)} PnL=${x.r.totalPnl >= 0 ? '+' : ''}${x.r.totalPnl.toFixed(2)}u ROI=${(x.r.roi*100).toFixed(2)}%`));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
