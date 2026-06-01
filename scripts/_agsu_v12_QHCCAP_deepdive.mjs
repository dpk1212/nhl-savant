/**
 * AGS-U v12 — Q_hcCap__mean__ratio DEEP DIVE
 * ═══════════════════════════════════════════════════════════════════
 * Complete 282-pick sample breakdown for the proposed v12 formula.
 *
 * Output sections:
 *   1. Score distribution (histogram + summary stats)
 *   2. Quintile breakdown (overall: WR, flat ROI, real ROI, PnL)
 *   3. Per-sport breakdown (MLB, NBA, NHL)
 *   4. Per-market breakdown (ML, SPREAD, TOTAL)
 *   5. Per-sport × per-market matrix (where signal is strongest)
 *   6. Real-units evaluation (v9 unit sizing applied)
 *   7. Bootstrap CI on Q5 ROI (overall + MLB)
 *   8. Walk-forward holdout (train cutoffs on first 200, test on last 82)
 *   9. Score=quartile rank → tier mapping table (production-ready)
 *  10. Head-to-head vs current L1b on every metric
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
const BOOT_REPS = 1000;
const sum = (a, fn) => a.reduce((s, e) => s + (fn ? fn(e) : e), 0);
const avg = (a) => a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
const stdv = (a) => { if (a.length < 2) return 0; const m = avg(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1)); };
const americanToImplied = (o) => !o ? null : o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
function flatPnl(oc, oddsAm) {
  if (oc === 'PUSH') return 0;
  const dec = !oddsAm ? 1.91 : (oddsAm < 0 ? 1 + (100 / Math.abs(oddsAm)) : 1 + (oddsAm / 100));
  return oc === 'WIN' ? dec - 1 : -1;
}
function quantile(a, q) { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.max(0, Math.min(s.length - 1, Math.floor(q * s.length)))]; }
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
          const profit = Number.isFinite(res.profit) ? res.profit : oc === 'WIN' ? (oddsAm < 0 ? units * (100 / Math.abs(oddsAm)) : units * (oddsAm / 100)) : -units;
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

// ── THE FORMULA: Q_hcCap__mean__ratio ───────────────────────────────
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

// L1b for comparison
function L1bScore(r, t) {
  return t.filter(e => e.onOur && e.hcBase && e.priorN >= 15 && e.priorRoi > 0).length
       - t.filter(e => e.onAg && e.hcBase && e.priorN >= 15 && e.priorRoi > 0).length;
}

// ── Quintile evaluator ──────────────────────────────────────────────
function quintileEval(rows, scoreFn, K=5) {
  const scored = rows.map(r => ({ ...r, _s: scoreFn(r, r._tagged) })).filter(r => Number.isFinite(r._s)).sort((a, b) => a._s - b._s);
  const n = scored.length;
  const buckets = [];
  for (let q = 0; q < K; q++) {
    const lo = Math.floor(n * q / K), hi = Math.floor(n * (q + 1) / K);
    const b = scored.slice(lo, hi);
    const w = b.filter(r => r.won === 1).length;
    const flatPnlTotal = b.reduce((s, r) => s + r.flatProfit, 0);
    const live = b.filter(r => !r.tracked && Number.isFinite(r.profit));
    const stake = live.reduce((s, r) => s + r.units, 0);
    const realPnl = live.reduce((s, r) => s + r.profit, 0);
    buckets.push({
      q: q+1, n: b.length, w, wr: b.length ? w/b.length : null,
      flatPnl: flatPnlTotal, flatRoi: b.length ? (flatPnlTotal/b.length)*100 : null,
      liveN: live.length, stake, realPnl, realRoi: stake > 0 ? (realPnl/stake)*100 : null,
      scoreRange: b.length ? { lo: b[0]._s, hi: b[b.length-1]._s } : null,
    });
  }
  return { buckets, n };
}

async function main() {
  console.log('═════ AGS-U v12 Q_hcCap__mean__ratio — DEEP DIVE on 282 picks ═════\n');
  const { profiles, walletHist, testRows } = await loadAll();
  for (const r of testRows) r._tagged = tagWallets(r, profiles, walletHist);
  console.log(`Loaded ${testRows.length} v9 graded picks (${testRows[0].date} → ${testRows[testRows.length-1].date})\n`);

  // ─── 1. SCORE DISTRIBUTION ───
  console.log('═════ 1. SCORE DISTRIBUTION ═════');
  const allScores = testRows.map(r => v12Score(r, r._tagged));
  const sortedScores = [...allScores].sort((a, b) => a - b);
  console.log(`  Min: ${sortedScores[0].toFixed(3)}   Max: ${sortedScores[sortedScores.length-1].toFixed(3)}`);
  console.log(`  Mean: ${avg(allScores).toFixed(3)}   StdDev: ${stdv(allScores).toFixed(3)}`);
  console.log(`  Q10: ${quantile(allScores, 0.1).toFixed(3)}   Q25: ${quantile(allScores, 0.25).toFixed(3)}   Median: ${quantile(allScores, 0.5).toFixed(3)}   Q75: ${quantile(allScores, 0.75).toFixed(3)}   Q90: ${quantile(allScores, 0.9).toFixed(3)}`);
  // Histogram: bins of 0.1
  const histBins = {};
  for (const s of allScores) {
    const bin = Math.round(s * 10) / 10;
    histBins[bin] = (histBins[bin] || 0) + 1;
  }
  console.log(`  Histogram (bin width = 0.1):`);
  const sortedBins = Object.keys(histBins).map(Number).sort((a, b) => a - b);
  for (const b of sortedBins) {
    const bar = '█'.repeat(Math.round(histBins[b] / 2));
    console.log(`    ${b >= 0 ? '+' : ''}${b.toFixed(1).padStart(5)}: ${String(histBins[b]).padStart(3)}  ${bar}`);
  }
  const exactlyZero = allScores.filter(s => s === 0).length;
  console.log(`  Picks exactly at score=0 (model has no opinion): ${exactlyZero} (${(exactlyZero/testRows.length*100).toFixed(1)}%)`);

  // ─── 2. QUINTILE BREAKDOWN (overall) ───
  console.log('\n═════ 2. QUINTILE BREAKDOWN (overall, n=282) ═════');
  const ev = quintileEval(testRows, v12Score);
  console.log('  Q | N  | W-L     | WR    | Flat ROI | Flat PnL | Live N | Stake (u) | Real ROI | Real PnL | Score range');
  console.log('  ──┼────┼─────────┼───────┼──────────┼──────────┼────────┼───────────┼──────────┼──────────┼───────────────');
  for (const b of ev.buckets) {
    console.log(`  ${b.q} | ${String(b.n).padStart(2)} | ${String(b.w).padStart(2)}-${String(b.n-b.w).padEnd(4)} | ${(b.wr*100).toFixed(1).padStart(5)}% | ${(b.flatRoi >= 0 ? '+' : '')}${b.flatRoi.toFixed(1).padStart(6)}% | ${(b.flatPnl >= 0 ? '+' : '')}${b.flatPnl.toFixed(2).padStart(6)}u | ${String(b.liveN).padStart(6)} | ${b.stake.toFixed(2).padStart(8)}u | ${b.realRoi != null ? (b.realRoi >= 0 ? '+' : '') + b.realRoi.toFixed(1).padStart(6) + '%' : '   n/a  '} | ${(b.realPnl >= 0 ? '+' : '')}${b.realPnl.toFixed(2).padStart(6)}u | [${b.scoreRange.lo.toFixed(3)}, ${b.scoreRange.hi.toFixed(3)}]`);
  }

  // ─── 3. PER-SPORT BREAKDOWN ───
  console.log('\n═════ 3. PER-SPORT BREAKDOWN ═════');
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const sub = testRows.filter(r => r.sport === sp);
    if (sub.length < 10) { console.log(`  ${sp}: n=${sub.length} too small`); continue; }
    const spEv = quintileEval(sub, v12Score);
    console.log(`  ${sp} (n=${sub.length}):`);
    console.log('    Q | N  | WR    | Flat ROI | Live N | Stake | Real ROI');
    console.log('    ──┼────┼───────┼──────────┼────────┼───────┼─────────');
    for (const b of spEv.buckets) {
      console.log(`    ${b.q} | ${String(b.n).padStart(2)} | ${b.wr != null ? (b.wr*100).toFixed(1).padStart(5) + '%' : '  —  '} | ${b.flatRoi != null ? (b.flatRoi >= 0 ? '+' : '') + b.flatRoi.toFixed(1).padStart(6) + '%' : '   —    '} | ${String(b.liveN).padStart(6)} | ${b.stake.toFixed(2).padStart(5)}u | ${b.realRoi != null ? (b.realRoi >= 0 ? '+' : '') + b.realRoi.toFixed(1).padStart(6) + '%' : '   —    '}`);
    }
  }

  // ─── 4. PER-MARKET BREAKDOWN ───
  console.log('\n═════ 4. PER-MARKET BREAKDOWN ═════');
  for (const mk of ['ML', 'SPREAD', 'TOTAL']) {
    const sub = testRows.filter(r => r.market === mk);
    if (sub.length < 10) { console.log(`  ${mk}: n=${sub.length} too small`); continue; }
    const mkEv = quintileEval(sub, v12Score);
    console.log(`  ${mk} (n=${sub.length}):`);
    console.log('    Q | N  | WR    | Flat ROI | Live N | Real ROI');
    console.log('    ──┼────┼───────┼──────────┼────────┼─────────');
    for (const b of mkEv.buckets) {
      console.log(`    ${b.q} | ${String(b.n).padStart(2)} | ${b.wr != null ? (b.wr*100).toFixed(1).padStart(5) + '%' : '  —  '} | ${b.flatRoi != null ? (b.flatRoi >= 0 ? '+' : '') + b.flatRoi.toFixed(1).padStart(6) + '%' : '   —    '} | ${String(b.liveN).padStart(6)} | ${b.realRoi != null ? (b.realRoi >= 0 ? '+' : '') + b.realRoi.toFixed(1).padStart(6) + '%' : '   —    '}`);
    }
  }

  // ─── 5. PER-SPORT × PER-MARKET MATRIX ───
  console.log('\n═════ 5. PER-SPORT × PER-MARKET MATRIX (Q5 flat ROI) ═════');
  console.log('              |       ML        |     SPREAD      |     TOTAL       |');
  console.log('  ────────────┼─────────────────┼─────────────────┼─────────────────');
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const cells = ['ML', 'SPREAD', 'TOTAL'].map(mk => {
      const sub = testRows.filter(r => r.sport === sp && r.market === mk);
      if (sub.length < 5) return `n=${String(sub.length).padStart(3)} insuff.    `.slice(0, 17);
      const scored = sub.map(r => ({ ...r, _s: v12Score(r, r._tagged) })).sort((a, b) => a._s - b._s);
      const q5 = scored.slice(Math.floor(sub.length * 0.8));
      const q5Roi = q5.length ? avg(q5.map(r => r.flatProfit)) * 100 : null;
      const q5Wr = q5.length ? (q5.filter(r => r.won).length / q5.length) * 100 : null;
      return `n=${String(sub.length).padStart(3)} Q5${String(q5.length).padStart(2)} ${(q5Roi != null && q5Roi >= 0 ? '+' : '')}${q5Roi != null ? q5Roi.toFixed(1) : '—'}%`.padEnd(17);
    });
    console.log(`  ${sp.padEnd(11)} | ${cells.join(' | ')}`);
  }

  // ─── 6. REAL-UNITS EVALUATION ───
  console.log('\n═════ 6. REAL-UNITS (v9 sizing × v12 ranking) ═════');
  console.log('  Q | Live N | Stake (u) | Real PnL  | Real ROI | Flat ROI');
  console.log('  ──┼────────┼───────────┼───────────┼──────────┼─────────');
  for (const b of ev.buckets) {
    console.log(`  ${b.q} | ${String(b.liveN).padStart(6)} | ${b.stake.toFixed(2).padStart(8)}u | ${b.realPnl >= 0 ? '+' : ''}${b.realPnl.toFixed(2).padStart(7)}u | ${b.realRoi != null ? (b.realRoi >= 0 ? '+' : '') + b.realRoi.toFixed(1).padStart(6) + '%' : '   n/a  '} | ${(b.flatRoi >= 0 ? '+' : '')}${b.flatRoi.toFixed(1).padStart(6)}%`);
  }
  const totalRealPnl = ev.buckets.reduce((s, b) => s + b.realPnl, 0);
  const totalStake = ev.buckets.reduce((s, b) => s + b.stake, 0);
  console.log(`\n  Total (all quintiles): Stake=${totalStake.toFixed(2)}u  Real PnL=${totalRealPnl >= 0 ? '+' : ''}${totalRealPnl.toFixed(2)}u  Real ROI=${totalStake > 0 ? ((totalRealPnl/totalStake)*100).toFixed(2)+'%' : '—'}`);

  // ─── 7. BOOTSTRAP CI ───
  console.log('\n═════ 7. BOOTSTRAP CONFIDENCE INTERVALS (Q5 ROI, 1000 reps) ═════');
  const bootCI = (rows) => {
    const scored = rows.map(r => ({ ...r, _s: v12Score(r, r._tagged) })).sort((a, b) => a._s - b._s);
    const q5 = scored.slice(Math.floor(rows.length * 0.8));
    const q1 = scored.slice(0, Math.floor(rows.length * 0.2));
    if (q5.length < 5) return null;
    const q5Rois = [], q1Rois = [];
    for (let b = 0; b < BOOT_REPS; b++) {
      const sample5 = []; for (let i = 0; i < q5.length; i++) sample5.push(q5[Math.floor(Math.random() * q5.length)]);
      const sample1 = []; for (let i = 0; i < q1.length; i++) sample1.push(q1[Math.floor(Math.random() * q1.length)]);
      q5Rois.push(avg(sample5.map(r => r.flatProfit)) * 100);
      q1Rois.push(avg(sample1.map(r => r.flatProfit)) * 100);
    }
    return {
      q5Mean: avg(q5Rois), q5Low: quantile(q5Rois, 0.025), q5High: quantile(q5Rois, 0.975),
      q1Mean: avg(q1Rois), q1Low: quantile(q1Rois, 0.025), q1High: quantile(q1Rois, 0.975),
      q5PctPos: q5Rois.filter(x => x > 0).length / BOOT_REPS,
    };
  };
  const overallBoot = bootCI(testRows);
  console.log(`  Overall:  Q5 ROI ${overallBoot.q5Mean.toFixed(2)}% [95% CI: ${overallBoot.q5Low.toFixed(1)}%, ${overallBoot.q5High.toFixed(1)}%]  P(Q5>0)=${(overallBoot.q5PctPos*100).toFixed(0)}%`);
  for (const sp of ['MLB', 'NBA', 'NHL']) {
    const sub = testRows.filter(r => r.sport === sp);
    if (sub.length < 30) { console.log(`  ${sp}: n=${sub.length} too small for bootstrap`); continue; }
    const b = bootCI(sub);
    console.log(`  ${sp}:      Q5 ROI ${b.q5Mean.toFixed(2)}% [95% CI: ${b.q5Low.toFixed(1)}%, ${b.q5High.toFixed(1)}%]  P(Q5>0)=${(b.q5PctPos*100).toFixed(0)}%`);
  }

  // ─── 8. WALK-FORWARD ───
  console.log('\n═════ 8. WALK-FORWARD HOLDOUT (train cutoffs on first 200, test on last 82) ═════');
  const train = testRows.slice(0, 200);
  const test = testRows.slice(200);
  const trainScores = train.map(r => v12Score(r, r._tagged));
  const sortedTrain = [...trainScores].sort((a, b) => a - b);
  const cutoffs = [0.2, 0.4, 0.6, 0.8].map(q => sortedTrain[Math.floor(q * trainScores.length)]);
  console.log(`  Train (n=200) cutoffs: [${cutoffs.map(c => c.toFixed(3)).join(', ')}]`);
  const testScores = test.map(r => v12Score(r, r._tagged));
  const wfBuckets = [[], [], [], [], []];
  test.forEach((r, i) => {
    const s = testScores[i];
    let q = 0;
    for (const c of cutoffs) if (s > c) q++;
    wfBuckets[q].push({ ...r, _s: s });
  });
  console.log('  Test (n=82) using TRAINING cutoffs:');
  console.log('    Q | N  | WR    | Flat ROI | Live N | Real ROI');
  console.log('    ──┼────┼───────┼──────────┼────────┼─────────');
  for (let q = 0; q < 5; q++) {
    const b = wfBuckets[q];
    const w = b.filter(r => r.won === 1).length;
    const fPnl = b.reduce((s, r) => s + r.flatProfit, 0);
    const live = b.filter(r => !r.tracked && Number.isFinite(r.profit));
    const stake = live.reduce((s, r) => s + r.units, 0);
    const rPnl = live.reduce((s, r) => s + r.profit, 0);
    const wr = b.length ? (w / b.length * 100).toFixed(1) + '%' : '—';
    const fr = b.length ? ((fPnl/b.length*100 >= 0 ? '+' : '') + (fPnl/b.length*100).toFixed(1) + '%') : '—';
    const rr = stake > 0 ? ((rPnl/stake*100 >= 0 ? '+' : '') + (rPnl/stake*100).toFixed(1) + '%') : '—';
    console.log(`    ${q+1} | ${String(b.length).padStart(2)} | ${wr.padStart(5)} | ${fr.padStart(8)} | ${String(live.length).padStart(6)} | ${rr.padStart(7)}`);
  }

  // ─── 9. TIER MAPPING TABLE ───
  console.log('\n═════ 9. PRODUCTION TIER MAPPING (suggested) ═════');
  console.log('  This is the mapping that would be applied daily to current data:');
  console.log('  Q | Score range          | Tier     | Stake (u) | Expected ROI');
  console.log('  ──┼──────────────────────┼──────────┼───────────┼─────────────');
  const tierMap = ['WEAK', 'LEAN', 'LOCK', 'PREMIUM', 'ELITE'];
  const stakeMap = ['0.00', '0.25', '0.50', '1.00', '1.50'];
  for (const b of ev.buckets) {
    const sr = b.scoreRange ? `[${b.scoreRange.lo.toFixed(3)}, ${b.scoreRange.hi.toFixed(3)}]` : '—';
    const roi = b.flatRoi >= 0 ? `+${b.flatRoi.toFixed(1)}%` : `${b.flatRoi.toFixed(1)}%`;
    console.log(`  ${b.q} | ${sr.padEnd(20)} | ${tierMap[b.q-1].padEnd(8)} | ${stakeMap[b.q-1].padStart(6)}u   | ${roi.padStart(7)}`);
  }

  // ─── 10. HEAD-TO-HEAD vs L1b ───
  console.log('\n═════ 10. HEAD-TO-HEAD vs CURRENT L1b ═════');
  const l1bEv = quintileEval(testRows, L1bScore);
  console.log('  Metric                | L1b (current) | Q_hcCap__mean__ratio | Δ');
  console.log('  ──────────────────────┼───────────────┼──────────────────────┼──────────');
  console.log(`  Q1 ROI                | ${(l1bEv.buckets[0].flatRoi >= 0 ? '+' : '')}${l1bEv.buckets[0].flatRoi.toFixed(1).padStart(5)}%       | ${(ev.buckets[0].flatRoi >= 0 ? '+' : '')}${ev.buckets[0].flatRoi.toFixed(1).padStart(5)}%               | ${(ev.buckets[0].flatRoi - l1bEv.buckets[0].flatRoi >= 0 ? '+' : '')}${(ev.buckets[0].flatRoi - l1bEv.buckets[0].flatRoi).toFixed(1)}pp`);
  console.log(`  Q2 ROI                | ${(l1bEv.buckets[1].flatRoi >= 0 ? '+' : '')}${l1bEv.buckets[1].flatRoi.toFixed(1).padStart(5)}%       | ${(ev.buckets[1].flatRoi >= 0 ? '+' : '')}${ev.buckets[1].flatRoi.toFixed(1).padStart(5)}%               | ${(ev.buckets[1].flatRoi - l1bEv.buckets[1].flatRoi >= 0 ? '+' : '')}${(ev.buckets[1].flatRoi - l1bEv.buckets[1].flatRoi).toFixed(1)}pp`);
  console.log(`  Q3 ROI                | ${(l1bEv.buckets[2].flatRoi >= 0 ? '+' : '')}${l1bEv.buckets[2].flatRoi.toFixed(1).padStart(5)}%       | ${(ev.buckets[2].flatRoi >= 0 ? '+' : '')}${ev.buckets[2].flatRoi.toFixed(1).padStart(5)}%               | ${(ev.buckets[2].flatRoi - l1bEv.buckets[2].flatRoi >= 0 ? '+' : '')}${(ev.buckets[2].flatRoi - l1bEv.buckets[2].flatRoi).toFixed(1)}pp`);
  console.log(`  Q4 ROI                | ${(l1bEv.buckets[3].flatRoi >= 0 ? '+' : '')}${l1bEv.buckets[3].flatRoi.toFixed(1).padStart(5)}%       | ${(ev.buckets[3].flatRoi >= 0 ? '+' : '')}${ev.buckets[3].flatRoi.toFixed(1).padStart(5)}%               | ${(ev.buckets[3].flatRoi - l1bEv.buckets[3].flatRoi >= 0 ? '+' : '')}${(ev.buckets[3].flatRoi - l1bEv.buckets[3].flatRoi).toFixed(1)}pp`);
  console.log(`  Q5 ROI                | ${(l1bEv.buckets[4].flatRoi >= 0 ? '+' : '')}${l1bEv.buckets[4].flatRoi.toFixed(1).padStart(5)}%       | ${(ev.buckets[4].flatRoi >= 0 ? '+' : '')}${ev.buckets[4].flatRoi.toFixed(1).padStart(5)}%               | ${(ev.buckets[4].flatRoi - l1bEv.buckets[4].flatRoi >= 0 ? '+' : '')}${(ev.buckets[4].flatRoi - l1bEv.buckets[4].flatRoi).toFixed(1)}pp`);
  console.log(`  Q5 WR                 | ${(l1bEv.buckets[4].wr*100).toFixed(1).padStart(5)}%        | ${(ev.buckets[4].wr*100).toFixed(1).padStart(5)}%                | ${((ev.buckets[4].wr - l1bEv.buckets[4].wr)*100).toFixed(1)}pp`);
  const l1bUnique = new Set(testRows.map(r => L1bScore(r, r._tagged))).size;
  const v12Unique = new Set(allScores.map(s => Math.round(s*1000)/1000)).size;
  console.log(`  Unique scores         | ${String(l1bUnique).padStart(4)} (${(l1bUnique/testRows.length*100).toFixed(0)}%)     | ${String(v12Unique).padStart(4)} (${(v12Unique/testRows.length*100).toFixed(0)}%)             | +${v12Unique - l1bUnique} unique`);
  const l1bRealRoi = l1bEv.buckets[4].realRoi;
  const v12RealRoi = ev.buckets[4].realRoi;
  console.log(`  Q5 Real ROI (v9 size) | ${l1bRealRoi != null ? (l1bRealRoi >= 0 ? '+' : '') + l1bRealRoi.toFixed(1).padStart(5) + '%' : '   n/a  '}       | ${v12RealRoi != null ? (v12RealRoi >= 0 ? '+' : '') + v12RealRoi.toFixed(1).padStart(5) + '%' : '   n/a  '}              | ${v12RealRoi != null && l1bRealRoi != null ? ((v12RealRoi - l1bRealRoi >= 0 ? '+' : '') + (v12RealRoi - l1bRealRoi).toFixed(1) + 'pp') : '—'}`);

  // Write report
  const lines = [];
  lines.push('# AGS-U v12 — Q_hcCap__mean__ratio Deep Dive');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Sample: ${testRows.length} v9-graded picks (${testRows[0].date} → ${testRows[testRows.length-1].date})`);
  lines.push('');
  lines.push('## 2. Overall Quintile Breakdown');
  lines.push('| Q | N | W-L | WR | Flat ROI | Live N | Stake | Real ROI | Real PnL |');
  lines.push('|---|---|---|---|---|---|---|---|---|');
  for (const b of ev.buckets) lines.push(`| ${b.q} | ${b.n} | ${b.w}-${b.n-b.w} | ${(b.wr*100).toFixed(1)}% | ${(b.flatRoi >= 0 ? '+' : '')}${b.flatRoi.toFixed(1)}% | ${b.liveN} | ${b.stake.toFixed(2)}u | ${b.realRoi != null ? (b.realRoi >= 0 ? '+' : '') + b.realRoi.toFixed(1) + '%' : 'n/a'} | ${(b.realPnl >= 0 ? '+' : '')}${b.realPnl.toFixed(2)}u |`);
  writeFileSync(join(REPO_ROOT, 'AGSU_V12_QHCCAP_DEEPDIVE.md'), lines.join('\n'), 'utf8');
  console.log('\n✓ AGSU_V12_QHCCAP_DEEPDIVE.md written');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
