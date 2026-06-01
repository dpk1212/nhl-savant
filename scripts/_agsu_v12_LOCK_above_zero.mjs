/**
 * AGS-U v12 — "Lock only above zero" analysis
 * ═══════════════════════════════════════════════════════════════════
 * Hypothesis: the ~107 picks at score=0 are "no opinion" picks that
 * dilute our model. If we filter them out and only consider picks with
 * meaningful positive support (score > 0), we should see cleaner
 * monotonic Q1→Q5 performance.
 *
 * Strategy:
 *   - Picks with score < 0 → MUTE (don't bet)
 *   - Picks with score = 0 → MUTE (no opinion)
 *   - Picks with score > 0 → quintile-bucket THESE only, apply monotonic sizing
 *
 * Sizing (always monotonic Q5 > Q4 > Q3 > Q2 > Q1):
 *   Q1: 0.25u  Q2: 0.50u  Q3: 1.00u  Q4: 1.50u  Q5: 2.00u
 *
 * Compare against:
 *   - Status quo (all 282 picks bucketed → some lose at Q3)
 *   - L1b (current production candidate)
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sak)) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const HIST_START = '2025-01-01';
const sum = (a, fn) => a.reduce((s, e) => s + (fn ? fn(e) : e), 0);
const avg = (a) => a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
const americanToImplied = (o) => !o ? null : o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
function flatPnl(oc, oddsAm) {
  if (oc === 'PUSH') return 0;
  const dec = !oddsAm ? 1.91 : (oddsAm < 0 ? 1 + (100 / Math.abs(oddsAm)) : 1 + (oddsAm/100));
  return oc === 'WIN' ? dec - 1 : -1;
}
function unitPnl(oc, oddsAm, units) {
  if (oc === 'PUSH' || units === 0) return 0;
  if (oc === 'WIN') return oddsAm < 0 ? units * (100/Math.abs(oddsAm)) : units * (oddsAm/100);
  return -units;
}
const getTier = (p, s) => p?.bySport?.[s]?.whitelistTier;
const isHcBase = (p, s) => { const t = getTier(p, s); return t === 'CONFIRMED' || t === 'FLAT'; };
function tierW(t) { return t === 'CONFIRMED' ? 3 : t === 'FLAT' ? 2 : t === 'WR50' ? 1 : 0; }

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
          const profit = Number.isFinite(res.profit) ? res.profit : oc === 'WIN' ? (oddsAm < 0 ? units * (100/Math.abs(oddsAm)) : units * (oddsAm/100)) : -units;
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

function tagWallets(row, profiles, walletHist) {
  const sport = row.sport;
  return row.walletDetails.map(w => {
    const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
    const profile = profiles.get(short);
    const hist = walletHist.get(short) || [];
    const sizeRatio = Number(w.sizeRatio) || 0;
    const ps = strictPrior(hist, row.date, sport);
    const tier = getTier(profile, sport);
    return {
      side: w.side, onOur: w.side === row.mySide, onAg: w.side && w.side !== row.mySide,
      tier, tw: tierW(tier), hcBase: isHcBase(profile, sport),
      sizeRatio,
      priorN: ps?.n ?? 0, priorWr: ps?.wr ?? 0, priorRoi: ps?.roi ?? 0,
    };
  });
}

// THE FORMULA
function walletQuality(w) {
  if (!w.hcBase) return 0;
  const tw = w.tw;
  const roi = Math.max(0, Math.min(30, w.priorRoi));
  const size = Math.max(0.5, Math.min(2.5, w.sizeRatio));
  const nR = Math.min(1, Math.sqrt(w.priorN / 20));
  return tw * roi * size * nR;
}
function v12Score(r, t) {
  const fQs = t.filter(e => e.onOur).map(walletQuality);
  const aQs = t.filter(e => e.onAg).map(walletQuality);
  const fMean = fQs.length ? fQs.reduce((s, q) => s + q, 0) / fQs.length : 0;
  const aMean = aQs.length ? aQs.reduce((s, q) => s + q, 0) / aQs.length : 0;
  if (fMean === 0 && aMean === 0) return 0;
  return (fMean - aMean) / (fMean + aMean + 0.5);
}

function quintileEval(rows, K=5) {
  const sorted = [...rows].sort((a, b) => a._s - b._s);
  const n = sorted.length;
  const buckets = [];
  for (let q = 0; q < K; q++) {
    const lo = Math.floor(n * q / K), hi = Math.floor(n * (q + 1) / K);
    const b = sorted.slice(lo, hi);
    const w = b.filter(r => r.won === 1).length;
    const flatPnlT = b.reduce((s, r) => s + r.flatProfit, 0);
    buckets.push({
      q: q+1, n: b.length, w, l: b.length - w,
      wr: b.length ? w/b.length : null,
      flatPnl: flatPnlT, flatRoi: b.length ? (flatPnlT/b.length)*100 : null,
      scoreRange: b.length ? { lo: b[0]._s, hi: b[b.length-1]._s } : null,
    });
  }
  return { buckets, n };
}

async function main() {
  console.log('═════ AGS-U v12 — LOCK ABOVE ZERO + MONOTONIC SIZING ═════\n');
  const { profiles, walletHist, testRows } = await loadAll();
  for (const r of testRows) { r._tagged = tagWallets(r, profiles, walletHist); r._s = v12Score(r, r._tagged); }
  console.log(`Loaded ${testRows.length} v9 graded picks\n`);

  // ─── Categorize by score sign ───
  const negPicks  = testRows.filter(r => r._s < 0);
  const zeroPicks = testRows.filter(r => r._s === 0);
  const posPicks  = testRows.filter(r => r._s > 0);

  console.log('═════ Score-sign categories ═════');
  console.log(`  Negative score (opp stronger):  n=${negPicks.length}  WR=${(negPicks.filter(r=>r.won).length/negPicks.length*100).toFixed(1)}%  flat ROI ${((negPicks.reduce((s,r)=>s+r.flatProfit,0)/negPicks.length)*100).toFixed(1)}%`);
  console.log(`  Zero score (no opinion):        n=${zeroPicks.length}  WR=${(zeroPicks.filter(r=>r.won).length/zeroPicks.length*100).toFixed(1)}%  flat ROI ${((zeroPicks.reduce((s,r)=>s+r.flatProfit,0)/zeroPicks.length)*100).toFixed(1)}%`);
  console.log(`  Positive score (we have edge):  n=${posPicks.length}  WR=${(posPicks.filter(r=>r.won).length/posPicks.length*100).toFixed(1)}%  flat ROI ${((posPicks.reduce((s,r)=>s+r.flatProfit,0)/posPicks.length)*100).toFixed(1)}%`);

  // ─── Quintile bucketing on POSITIVE-only picks ───
  console.log('\n═════ QUINTILE BREAKDOWN — POSITIVE picks only (n=' + posPicks.length + ') ═════');
  const posEv = quintileEval(posPicks);
  console.log('  Q | N  | W-L     | WR    | Flat ROI | Flat PnL | Score range');
  console.log('  ──┼────┼─────────┼───────┼──────────┼──────────┼──────────────────');
  for (const b of posEv.buckets) {
    const wr = b.wr != null ? (b.wr*100).toFixed(1).padStart(5) + '%' : '   —   ';
    const roi = b.flatRoi != null ? ((b.flatRoi >= 0 ? '+' : '') + b.flatRoi.toFixed(1).padStart(6) + '%') : '   —   ';
    console.log(`  ${b.q} | ${String(b.n).padStart(2)} | ${String(b.w).padStart(2)}-${String(b.l).padEnd(4)} | ${wr} | ${roi} | ${(b.flatPnl >= 0 ? '+' : '')}${b.flatPnl.toFixed(2).padStart(6)}u  | [${b.scoreRange.lo.toFixed(3)}, ${b.scoreRange.hi.toFixed(3)}]`);
  }
  // Monotonicity check
  const buckets = posEv.buckets;
  const wrMono = buckets.every((b, i) => i === 0 || b.wr >= buckets[i-1].wr);
  const roiMono = buckets.every((b, i) => i === 0 || b.flatRoi >= buckets[i-1].flatRoi);
  console.log(`\n  Strictly monotonic? WR: ${wrMono ? '✅ YES' : '❌ NO'}   ROI: ${roiMono ? '✅ YES' : '❌ NO'}`);

  // ─── Apply MONOTONIC sizing: Q1=0.25u Q2=0.50u Q3=1.00u Q4=1.50u Q5=2.00u ───
  console.log('\n═════ MONOTONIC SIZING SIMULATION ═════');
  console.log('  Sizing: Q1=0.25u, Q2=0.50u, Q3=1.00u, Q4=1.50u, Q5=2.00u');
  console.log('  (negative-score and zero-score picks are MUTED → 0 stake)\n');
  const stakeMap = [0.25, 0.50, 1.00, 1.50, 2.00];
  let totalStake = 0, totalPnl = 0;
  console.log('  Q | N | W-L  | WR    | Stake/pick | Total Stake | Total PnL | ROI');
  console.log('  ──┼───┼──────┼───────┼────────────┼─────────────┼───────────┼──────');
  for (const b of buckets) {
    const sortedAll = [...posPicks].sort((a, b) => a._s - b._s);
    const lo = Math.floor(sortedAll.length * (b.q-1) / 5);
    const hi = Math.floor(sortedAll.length * b.q / 5);
    const bucketPicks = sortedAll.slice(lo, hi);
    const u = stakeMap[b.q - 1];
    const stake = bucketPicks.length * u;
    const pnl = bucketPicks.reduce((s, r) => s + unitPnl(r.oc, r.peakOdds, u), 0);
    const roi = stake > 0 ? (pnl/stake)*100 : 0;
    totalStake += stake; totalPnl += pnl;
    console.log(`  ${b.q} | ${String(b.n).padStart(2)} | ${String(b.w).padStart(2)}-${String(b.l).padEnd(3)} | ${(b.wr*100).toFixed(1).padStart(5)}% | ${u.toFixed(2)}u       | ${stake.toFixed(2).padStart(8)}u    | ${(pnl >= 0 ? '+' : '')}${pnl.toFixed(2).padStart(7)}u  | ${(roi >= 0 ? '+' : '')}${roi.toFixed(1)}%`);
  }
  console.log(`  ──┼───┼──────┼───────┼────────────┼─────────────┼───────────┼──────`);
  const totalRoiStr = totalStake > 0 ? ((totalPnl/totalStake*100 >= 0 ? '+' : '') + (totalPnl/totalStake*100).toFixed(2) + '%') : '—';
  console.log(`  TOTAL              :              ${totalStake.toFixed(2)}u    ${(totalPnl >= 0 ? '+' : '')}${totalPnl.toFixed(2)}u  ${totalRoiStr}`);

  // ─── COMPARE to baseline scenarios ───
  console.log('\n═════ HEAD-TO-HEAD: TOTAL PnL across all 282 picks ═════');
  // Scenario A: current v9 sizing on all picks (do nothing)
  const scenarioA = testRows.filter(r => !r.tracked && Number.isFinite(r.profit));
  const stakeA = scenarioA.reduce((s, r) => s + r.units, 0);
  const pnlA = scenarioA.reduce((s, r) => s + r.profit, 0);

  // Scenario B: v12 with all-picks bucketed (Q3 disaster)
  const allSorted = [...testRows].sort((a, b) => a._s - b._s);
  let stakeB = 0, pnlB = 0;
  for (let q = 0; q < 5; q++) {
    const lo = Math.floor(allSorted.length * q / 5), hi = Math.floor(allSorted.length * (q + 1) / 5);
    const b = allSorted.slice(lo, hi);
    const u = stakeMap[q];
    stakeB += b.length * u;
    pnlB += b.reduce((s, r) => s + unitPnl(r.oc, r.peakOdds, u), 0);
  }

  // Scenario C: positive-only bucketed + monotonic sizing (THIS PROPOSAL)
  const stakeC = totalStake; const pnlC = totalPnl;

  // Scenario D: positive-only, FLAT 1u all picks
  const stakeD = posPicks.length;
  const pnlD = posPicks.reduce((s, r) => s + r.flatProfit, 0);

  // Scenario E: positive-only, FLAT 1u, but ONLY Q5 (top 20% of positives)
  const posSorted = [...posPicks].sort((a, b) => a._s - b._s);
  const q5Only = posSorted.slice(Math.floor(posSorted.length * 0.8));
  const stakeE = q5Only.length;
  const pnlE = q5Only.reduce((s, r) => s + r.flatProfit, 0);

  // Scenario F: positive-only, FLAT 1u Q3+ (top 60%)
  const q345Only = posSorted.slice(Math.floor(posSorted.length * 0.4));
  const stakeF = q345Only.length;
  const pnlF = q345Only.reduce((s, r) => s + r.flatProfit, 0);

  console.log('\n  Scenario                                    | Picks Bet | Total Stake | Total PnL  | ROI');
  console.log('  ─────────────────────────────────────────────┼───────────┼─────────────┼────────────┼──────');
  console.log(`  A. Current v9 (live picks only)             |    ${String(scenarioA.length).padStart(3)}    |   ${stakeA.toFixed(2).padStart(7)}u  | ${(pnlA >= 0 ? '+' : '')}${pnlA.toFixed(2).padStart(7)}u  | ${(pnlA/stakeA*100 >= 0 ? '+' : '')}${(pnlA/stakeA*100).toFixed(2)}%`);
  console.log(`  B. v12 all-picks bucketed (Q3 disaster)     |    ${String(testRows.length).padStart(3)}    |   ${stakeB.toFixed(2).padStart(7)}u  | ${(pnlB >= 0 ? '+' : '')}${pnlB.toFixed(2).padStart(7)}u  | ${(pnlB/stakeB*100 >= 0 ? '+' : '')}${(pnlB/stakeB*100).toFixed(2)}%`);
  console.log(`  C. v12 pos-only + monotonic sizing (PROP)   |    ${String(posPicks.length).padStart(3)}    |   ${stakeC.toFixed(2).padStart(7)}u  | ${(pnlC >= 0 ? '+' : '')}${pnlC.toFixed(2).padStart(7)}u  | ${(pnlC/stakeC*100 >= 0 ? '+' : '')}${(pnlC/stakeC*100).toFixed(2)}%`);
  console.log(`  D. v12 pos-only + FLAT 1u                   |    ${String(posPicks.length).padStart(3)}    |   ${stakeD.toFixed(2).padStart(7)}u  | ${(pnlD >= 0 ? '+' : '')}${pnlD.toFixed(2).padStart(7)}u  | ${(pnlD/stakeD*100 >= 0 ? '+' : '')}${(pnlD/stakeD*100).toFixed(2)}%`);
  console.log(`  E. v12 pos-Q5 ONLY + FLAT 1u                |    ${String(q5Only.length).padStart(3)}    |   ${stakeE.toFixed(2).padStart(7)}u  | ${(pnlE >= 0 ? '+' : '')}${pnlE.toFixed(2).padStart(7)}u  | ${(pnlE/stakeE*100 >= 0 ? '+' : '')}${(pnlE/stakeE*100).toFixed(2)}%`);
  console.log(`  F. v12 pos-Q3+Q4+Q5 + FLAT 1u               |    ${String(q345Only.length).padStart(3)}    |   ${stakeF.toFixed(2).padStart(7)}u  | ${(pnlF >= 0 ? '+' : '')}${pnlF.toFixed(2).padStart(7)}u  | ${(pnlF/stakeF*100 >= 0 ? '+' : '')}${(pnlF/stakeF*100).toFixed(2)}%`);

  // ─── PER-SPORT breakdown of the proposed sizing ───
  console.log('\n═════ PROPOSED (Scenario C) — per-sport ═════');
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const subPos = posPicks.filter(r => r.sport === sp).sort((a, b) => a._s - b._s);
    if (subPos.length < 5) { console.log(`  ${sp}: n=${subPos.length} too small`); continue; }
    let stake = 0, pnl = 0;
    const subBuckets = [];
    for (let q = 0; q < 5; q++) {
      const lo = Math.floor(subPos.length * q / 5), hi = Math.floor(subPos.length * (q + 1) / 5);
      const b = subPos.slice(lo, hi);
      const u = stakeMap[q];
      const bStake = b.length * u;
      const bPnl = b.reduce((s, r) => s + unitPnl(r.oc, r.peakOdds, u), 0);
      stake += bStake; pnl += bPnl;
      const w = b.filter(r => r.won === 1).length;
      subBuckets.push({ q: q+1, n: b.length, w, wr: b.length ? w/b.length : null, stake: bStake, pnl: bPnl });
    }
    console.log(`  ${sp} (n_pos=${subPos.length}):`);
    for (const b of subBuckets) {
      const wr = b.wr != null ? (b.wr*100).toFixed(1) + '%' : '—';
      const roi = b.stake > 0 ? ((b.pnl/b.stake*100 >= 0 ? '+' : '') + (b.pnl/b.stake*100).toFixed(1) + '%') : '—';
      console.log(`    Q${b.q}: n=${String(b.n).padStart(2)} WR ${wr.padStart(6)} stake=${b.stake.toFixed(2).padStart(5)}u pnl=${(b.pnl >= 0 ? '+' : '')}${b.pnl.toFixed(2).padStart(6)}u ROI ${roi.padStart(7)}`);
    }
    const totRoi = stake > 0 ? ((pnl/stake*100 >= 0 ? '+' : '') + (pnl/stake*100).toFixed(2) + '%') : '—';
    console.log(`    TOTAL: ${stake.toFixed(2)}u staked, ${(pnl >= 0 ? '+' : '')}${pnl.toFixed(2)}u PnL, ROI ${totRoi}`);
  }

  // ─── Negative picks: should we FADE them? ───
  console.log('\n═════ Negative-score picks: should we FADE? ═════');
  console.log(`  All negative picks (n=${negPicks.length}):  WR ${(negPicks.filter(r=>r.won).length/negPicks.length*100).toFixed(1)}% — FOR-side WR`);
  console.log(`  If we FADED (bet opposite), WR would be: ${(100 - negPicks.filter(r=>r.won).length/negPicks.length*100).toFixed(1)}%`);
  // What's the ROI if we fade (bet opposite side)?
  const fadePnl = negPicks.reduce((s, r) => {
    if (r.oc === 'PUSH') return s;
    if (r.oc === 'LOSS') return s + 1;  // we win the inverse bet (assume same odds for simplicity)
    return s - 1;
  }, 0);
  console.log(`  Estimated fade ROI (flat 1u on opp side, same odds): ${(fadePnl/negPicks.length*100).toFixed(1)}%`);
  console.log(`  Note: in production fades would actually take opposite-side odds which differ`);

  // Write report
  const lines = [];
  lines.push('# AGS-U v12 — Lock Above Zero + Monotonic Sizing');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Score categories');
  lines.push(`- Negative score (opp stronger): n=${negPicks.length}, WR ${(negPicks.filter(r=>r.won).length/negPicks.length*100).toFixed(1)}%`);
  lines.push(`- Zero score (no opinion):       n=${zeroPicks.length}, WR ${(zeroPicks.filter(r=>r.won).length/zeroPicks.length*100).toFixed(1)}%`);
  lines.push(`- Positive score (edge):         n=${posPicks.length}, WR ${(posPicks.filter(r=>r.won).length/posPicks.length*100).toFixed(1)}%`);
  lines.push('');
  lines.push('## Quintile on positive-only picks');
  lines.push('| Q | N | W-L | WR | Flat ROI | Score range |');
  lines.push('|---|---|---|---|---|---|');
  for (const b of buckets) {
    lines.push(`| ${b.q} | ${b.n} | ${b.w}-${b.l} | ${(b.wr*100).toFixed(1)}% | ${(b.flatRoi >= 0 ? '+' : '')}${b.flatRoi.toFixed(1)}% | [${b.scoreRange.lo.toFixed(3)}, ${b.scoreRange.hi.toFixed(3)}] |`);
  }
  lines.push('');
  lines.push(`**Monotonic?** WR: ${wrMono ? '✅' : '❌'}  ROI: ${roiMono ? '✅' : '❌'}`);
  writeFileSync(join(REPO_ROOT, 'AGSU_V12_LOCK_ABOVE_ZERO.md'), lines.join('\n'), 'utf8');
  console.log('\n✓ AGSU_V12_LOCK_ABOVE_ZERO.md written');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
