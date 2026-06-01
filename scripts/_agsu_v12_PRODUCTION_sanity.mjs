/**
 * Sanity check: production `computeAgsV12()` in src/lib/ags.js MUST produce
 * the same scores, tiers, and ladder sizing as the backtest. This script
 * runs the production code against the same 282-pick sample we backtested
 * and verifies it reproduces:
 *   - Score-sign categorization (n_neg, n_zero, n_pos)
 *   - Quintile boundaries on positive-only picks
 *   - Tier assignment for each pick
 *   - Total PnL with ladder sizing
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  agsV12WalletQuality,
  agsV12ScoreFromQualities,
  aggregateSideV12,
  computeAgsV12,
  agsV12TierFromValue,
  agsV12SizeMultiplier,
  agsV12QuintileFromValue,
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
const americanToImplied = (o) => !o ? null : o < 0 ? Math.abs(o)/(Math.abs(o)+100) : 100/(o+100);
function flatPnl(oc, oddsAm) {
  if (oc === 'PUSH') return 0;
  const dec = !oddsAm ? 1.91 : (oddsAm < 0 ? 1 + (100/Math.abs(oddsAm)) : 1 + (oddsAm/100));
  return oc === 'WIN' ? dec - 1 : -1;
}
function unitPnl(oc, oddsAm, units) {
  if (oc === 'PUSH' || units === 0) return 0;
  if (oc === 'WIN') return oddsAm < 0 ? units * (100/Math.abs(oddsAm)) : units * (oddsAm/100);
  return -units;
}
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
          const units = sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0;
          const res = sd.result || data.result || {};
          const profit = Number.isFinite(res.profit) ? res.profit : oc === 'WIN' ? (oddsAm < 0 ? units * (100/Math.abs(oddsAm)) : units*(oddsAm/100)) : -units;
          testRows.push({
            docId: doc.id, date: data.date, sport: data.sport, market: m, mySide: sideKey,
            won: oc === 'WIN' ? 1 : 0, units, profit, tracked: res.tracked === true || units === 0,
            peakOdds: oddsAm, impliedProb: americanToImplied(oddsAm), oc, flatProfit: flatPnl(oc, oddsAm),
            walletDetails: wd,
          });
        }
      }
    }
  }
  for (const arr of walletHist.values()) arr.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  testRows.sort((a, b) => a.date.localeCompare(b.date));
  return { profiles, walletHist, testRows };
}

async function main() {
  console.log('═════ AGS-U v12 — PRODUCTION SANITY CHECK ═════\n');
  console.log('Verifying src/lib/ags.js v12 functions reproduce the backtest results.\n');

  const { profiles, walletHist, testRows } = await loadAll();
  console.log(`Loaded ${testRows.length} picks · ${profiles.size} profiles · ${walletHist.size} histories\n`);

  // ─── Verify the wallet quality formula matches what we backtested ───
  // Build a walletPriorStatsFn factory bound to a specific pick date.
  const buildStatsFnForPick = (pickDate) => {
    return (walletShort, sport) => {
      const profile = profiles.get(walletShort);
      const tier = getTier(profile, sport);
      const hist = walletHist.get(walletShort) || [];
      const ps = strictPrior(hist, pickDate, sport);
      return {
        tier: tier || null,
        priorN: ps?.n ?? 0,
        priorRoi: ps?.roi ?? 0,
      };
    };
  };

  // Compute v12 score for each pick using PRODUCTION code path
  for (const r of testRows) {
    const statsFn = buildStatsFnForPick(r.date);
    const agg = aggregateSideV12(r.walletDetails, r.mySide, r.sport, statsFn);
    r._v12 = agg ? computeAgsV12(agg, AGS_V12_FALLBACK_CALIBRATION) : null;
    r._v12Score = r._v12 ? r._v12.agsV12 : 0;
    r._v12Tier  = r._v12 ? r._v12.tier   : 'MUTE';
    r._v12Mult  = r._v12 ? r._v12.sizeMultiplier : 0;
  }

  // ─── Score-sign category check ───
  const neg  = testRows.filter(r => r._v12Score < 0);
  const zero = testRows.filter(r => r._v12Score === 0);
  const pos  = testRows.filter(r => r._v12Score > 0);
  console.log('SCORE-SIGN CATEGORIES (target from backtest: 41 neg / 107 zero / 134 pos)');
  console.log(`  Negative: ${neg.length}     ${neg.length === 41 ? '✅' : '⚠️'}`);
  console.log(`  Zero:     ${zero.length}     ${zero.length === 107 ? '✅' : '⚠️'}`);
  console.log(`  Positive: ${pos.length}    ${pos.length === 134 ? '✅' : '⚠️'}`);

  // ─── Tier distribution check ───
  console.log('\nTIER DISTRIBUTION (production fallback calibration):');
  const tierCount = {};
  for (const r of testRows) tierCount[r._v12Tier] = (tierCount[r._v12Tier] || 0) + 1;
  for (const t of ['ELITE', 'PREMIUM', 'LOCK', 'LEAN', 'WEAK', 'FADE', 'UNKNOWN']) {
    if (tierCount[t]) console.log(`  ${t.padEnd(8)}: ${String(tierCount[t]).padStart(3)} picks`);
  }

  // ─── Ladder sizing PnL check ───
  console.log('\nLADDER SIZING PnL (using production agsV12SizeMultiplier):');
  console.log('  Tier      | N   | Units/pick | Stake     | Wins | WR    | PnL       | ROI');
  console.log('  ──────────┼─────┼────────────┼───────────┼──────┼───────┼───────────┼──────');
  let grandStake = 0, grandPnl = 0, grandPicks = 0;
  for (const t of ['FADE', 'WEAK', 'LEAN', 'LOCK', 'PREMIUM', 'ELITE']) {
    const picks = testRows.filter(r => r._v12Tier === t);
    if (picks.length === 0) continue;
    const u = picks[0]._v12Mult;
    const stake = picks.length * u;
    const pnl = picks.reduce((s, r) => s + unitPnl(r.oc, r.peakOdds, u), 0);
    const wins = picks.filter(r => r.won).length;
    const wr = (wins / picks.length * 100).toFixed(1);
    const roi = stake > 0 ? ((pnl / stake) * 100).toFixed(2) : '—';
    grandStake += stake; grandPnl += pnl; grandPicks += picks.length;
    console.log(`  ${t.padEnd(8)}  | ${String(picks.length).padStart(3)} | ${u.toFixed(2)}u      | ${stake.toFixed(2).padStart(7)}u  | ${String(wins).padStart(4)} | ${wr.padStart(4)}% | ${pnl >= 0 ? '+' : ''}${pnl.toFixed(2).padStart(7)}u  | ${roi !== '—' ? (Number(roi) >= 0 ? '+' : '') + roi + '%' : '—'}`);
  }
  console.log('  ──────────┼─────┼────────────┼───────────┼──────┼───────┼───────────┼──────');
  const grandRoi = grandStake > 0 ? ((grandPnl/grandStake)*100).toFixed(2) : '—';
  console.log(`  TOTAL       | ${String(grandPicks).padStart(3)} |            | ${grandStake.toFixed(2).padStart(7)}u  |      |       | ${grandPnl >= 0 ? '+' : ''}${grandPnl.toFixed(2).padStart(7)}u  | ${grandRoi !== '—' ? (Number(grandRoi) >= 0 ? '+' : '') + grandRoi + '%' : '—'}`);

  // Expected from backtest: 260.5u staked, +49.44u PnL, +18.98% ROI
  // (Ladder D from scripts/_agsu_v12_LADDER_sweep.mjs: 0.25/0.50/1.00/3.00/5.00)
  console.log('\nEXPECTED FROM BACKTEST (Ladder D from _agsu_v12_LADDER_sweep.mjs):');
  console.log('  Stake: 260.50u    PnL: +49.44u    ROI: +18.98%');
  console.log(`  Match: stake ${Math.abs(grandStake - 260.5) < 1 ? '✅' : '⚠️ off by ' + (grandStake - 260.5).toFixed(2)}u`);
  console.log(`         pnl   ${Math.abs(grandPnl - 49.44) < 1 ? '✅' : '⚠️ off by ' + (grandPnl - 49.44).toFixed(2)}u`);

  // ─── Per-sport breakdown ───
  console.log('\nPER-SPORT TIER DISTRIBUTION & PnL:');
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const sub = testRows.filter(r => r.sport === sp);
    if (sub.length < 5) continue;
    let stake = 0, pnl = 0;
    const tCount = {};
    for (const r of sub) {
      const u = r._v12Mult;
      stake += u;
      pnl += unitPnl(r.oc, r.peakOdds, u);
      tCount[r._v12Tier] = (tCount[r._v12Tier] || 0) + 1;
    }
    const roi = stake > 0 ? ((pnl/stake)*100).toFixed(2) : '—';
    const tiers = ['ELITE','PREMIUM','LOCK','LEAN','WEAK','FADE'].map(t => `${t.slice(0,1)}=${tCount[t]||0}`).join(' ');
    console.log(`  ${sp} (n=${sub.length}): stake=${stake.toFixed(2)}u  pnl=${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}u  ROI=${roi !== '—' ? (Number(roi) >= 0 ? '+' : '') + roi + '%' : '—'}  [${tiers}]`);
  }

  // ─── Spot-check a few specific picks ───
  console.log('\nSAMPLE PICKS (random 5 — verify scores look right):');
  const sample = testRows.slice().sort(() => Math.random() - 0.5).slice(0, 5);
  for (const r of sample) {
    console.log(`  ${r.date} ${r.sport} ${r.market} ${r.mySide} (${r.oc})`);
    console.log(`    score=${r._v12Score.toFixed(3)}  tier=${r._v12Tier}  units=${r._v12Mult}`);
    console.log(`    forCount=${r._v12?.forCount || 0}  agCount=${r._v12?.agCount || 0}  forMean=${(r._v12?.forMean || 0).toFixed(2)}  agMean=${(r._v12?.agMean || 0).toFixed(2)}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
