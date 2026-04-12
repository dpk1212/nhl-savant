const admin = require('firebase-admin');
const sa = require('./serviceAccountKey.json');
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

function americanToImplied(odds) {
  if (!odds || odds === 0) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}
function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const i = (p / 100) * (s.length - 1);
  const lo = Math.floor(i), hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
}
function mean(arr) { return arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function stdev(arr) {
  if (arr.length < 2) return 1;
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length) || 1;
}
function winsorize(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }
function zScore(val, m, s) { return s > 0 ? (val - m) / s : 0; }

function qualityProxy(r) {
  let score = 0;
  if ((r.lockMoneyPct || 0) >= 90) score += 2;
  else if ((r.lockMoneyPct || 0) >= 75) score += 1;
  else if ((r.lockMoneyPct || 0) < 55) score -= 1;
  if (r.lockSharpCount <= 4 && r.lockAvgBet >= 2000) score += 1.5;
  else if (r.lockSharpCount <= 6 && r.lockAvgBet >= 1000) score += 0.5;
  if (r.counterSharp <= 5) score += 1;
  else if (r.counterSharp >= 35) score -= 1.5;
  if (r.lockLineMovingWith && r.lockPinnConfirms) score += 1;
  else if (r.lockLineMovingWith) score += 0.5;
  if (r.lockEV < -0.5) score += 0.5;
  else if (r.lockEV > 2) score -= 0.5;
  const ip = r.impliedProb || 0.5;
  const ob = ip >= 0.70 ? 'HEAVY_FAV' : ip >= 0.55 ? 'SLIGHT_FAV' : ip >= 0.45 ? 'COIN_FLIP' : ip >= 0.35 ? 'SLIGHT_DOG' : 'LONG_DOG';
  if ((r.sport === 'NHL' || r.sport === 'CBB') && ob === 'SLIGHT_DOG' && (r.lockMoneyPct || 0) >= 70) score += 0.5;
  if (r.lockSharpCount >= 7 && (r.lockMoneyPct || 0) < 65) score -= 1;
  return score;
}

async function run() {
  const rows = [];
  for (const col of ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals']) {
    const snap = await db.collection(col).get();
    snap.forEach(d => {
      const data = d.data();
      if (!data.sides) return;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result;
        if (!res?.outcome || res.outcome === 'PUSH') continue;
        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const lockOdds = lk?.odds || 0;
        const lockPinn = lk?.pinnacleOdds || 0;
        const peakPinn = pk?.pinnacleOdds || lockPinn;
        const lockProb = americanToImplied(lockOdds);
        const lockPinnProb = americanToImplied(lockPinn);
        const peakPinnProb = americanToImplied(peakPinn);
        const lockSharpCount = lk?.sharpCount || 0;
        const lockInvested = lk?.totalInvested || 0;
        const lockAvgBet = lockSharpCount > 0 ? lockInvested / lockSharpCount : 0;
        const lockMoneyPct = lk?.consensusStrength?.moneyPct ?? null;
        const lockWalletPct = lk?.consensusStrength?.walletPct ?? null;
        const lockEV = lk?.evEdge || 0;
        const counterSharp = lockMoneyPct != null ? Math.max(0, 100 - lockMoneyPct) : 0;
        const lockPinnConfirms = lk?.criteria?.pinnacleConfirms ? 1 : 0;
        const lockLineMovingWith = lk?.criteria?.lineMovingWith ? 1 : 0;
        const impliedProb = americanToImplied(lockOdds) || 0.5;
        const pinnMoved = lockPinn !== peakPinn;
        const pinnMoveSize = (lockPinnProb && peakPinnProb) ? Math.abs(peakPinnProb - lockPinnProb) : 0;
        const liveCLV = (lockProb && peakPinnProb && pinnMoved) ? peakPinnProb - lockProb : null;

        // Opposition data
        const opp = lk?.opposition || pk?.opposition || {};
        const oppSharpCount = opp.sharpCount || 0;
        const oppInvested = opp.totalInvested || 0;

        rows.push({
          lockAvgBet, lockInvested, lockMoneyPct, lockWalletPct,
          counterSharp, lockSharpCount, lockEV, lockPinnConfirms,
          lockLineMovingWith, impliedProb, sport: data.sport || 'NHL',
          liveCLV, pinnMoved, pinnMoveSize,
          oppSharpCount, oppInvested,
        });
      }
    });
  }

  console.log(`Total completed picks: ${rows.length}`);

  const vals = (key) => rows.map(r => r[key]).filter(v => v != null && isFinite(v));
  const s = (arr) => ({
    mean: +mean(arr).toFixed(4),
    std: +stdev(arr).toFixed(4),
    p2_5: +percentile(arr, 2.5).toFixed(4),
    p97_5: +percentile(arr, 97.5).toFixed(4),
  });

  const avgBetArr = vals('lockAvgBet');
  const investedArr = vals('lockInvested');
  const moneyPctArr = vals('lockMoneyPct');
  const walletPctArr = vals('lockWalletPct');
  const counterArr = vals('counterSharp');
  const scArr = vals('lockSharpCount');
  const qpArr = rows.map(r => qualityProxy(r));
  const liveVals = rows.filter(r => r.liveCLV != null).map(r => r.liveCLV);

  const avgBetS = s(avgBetArr);
  const investedS = s(investedArr);
  const moneyPctS = s(moneyPctArr);
  const walletPctS = s(walletPctArr);
  const counterS = s(counterArr);
  const scS = s(scArr);
  const qpS = s(qpArr);
  const liveS = s(liveVals.length > 0 ? liveVals : [0]);

  // Two-sided feature stats
  const moneyEdgeArr = rows.filter(r => r.lockMoneyPct != null).map(r => {
    const against = 100 - r.lockMoneyPct;
    return Math.log((r.lockMoneyPct + 1) / (against + 1));
  });
  const sharpEdgeArr = rows.map(r => Math.log((r.lockSharpCount + 1) / (r.oppSharpCount + 1)));
  const mktDomArr = moneyEdgeArr.map((me, i) => 0.6 * me + 0.4 * sharpEdgeArr[rows.findIndex((_, j) => j === i) !== -1 ? i : 0]);
  const againstSCArr = rows.map(r => Math.min(r.oppSharpCount, 6));

  // Recompute mktDom properly aligned with rows that have moneyPct
  const rowsWithMoney = rows.filter(r => r.lockMoneyPct != null);
  const mktDomAligned = rowsWithMoney.map(r => {
    const against = 100 - r.lockMoneyPct;
    const me = Math.log((r.lockMoneyPct + 1) / (against + 1));
    const se = Math.log((r.lockSharpCount + 1) / (r.oppSharpCount + 1));
    return 0.6 * me + 0.4 * se;
  });

  const moneyEdgeS = s(moneyEdgeArr);
  const sharpEdgeS = s(sharpEdgeArr);
  const mktDomS = s(mktDomAligned);
  const againstSCS = s(againstSCArr);

  // Compute lock scores for threshold percentiles (WITH two-sided terms)
  for (const r of rows) {
    r.avgBet_w = winsorize(r.lockAvgBet, avgBetS.p2_5, avgBetS.p97_5);
    r.invested_w = winsorize(r.lockInvested, investedS.p2_5, investedS.p97_5);
    r.sharpCount_capped = Math.min(r.lockSharpCount, 6);
    r.avgBet_z = zScore(r.avgBet_w, avgBetS.mean, avgBetS.std);
    r.invested_z = zScore(r.invested_w, investedS.mean, investedS.std);
    r.moneyPct_z = r.lockMoneyPct != null ? zScore(r.lockMoneyPct, moneyPctS.mean, moneyPctS.std) : 0;
    r.walletPct_z = r.lockWalletPct != null ? zScore(r.lockWalletPct, walletPctS.mean, walletPctS.std) : 0;
    r.counterSharp_z = zScore(r.counterSharp, counterS.mean, counterS.std);
    r.sharpCount_z = zScore(r.sharpCount_capped, scS.mean, scS.std);
    r.qp = qualityProxy(r);
    r.qp_z = zScore(r.qp, qpS.mean, qpS.std);
    r.contra_moneyCounter = ((r.lockMoneyPct || 0) >= 80 && r.counterSharp >= 30) ? 1 : 0;
    r.contra_sharpsMoney = (r.lockSharpCount >= 7 && (r.lockMoneyPct || 0) < 65) ? 1 : 0;
    r.contra_evQP = (r.lockEV > 0 && r.qp < 0) ? 1 : 0;
    r.contradictionPenalty = r.contra_moneyCounter + r.contra_sharpsMoney + r.contra_evQP;
    r.pinnConditional = (r.lockPinnConfirms && r.qp >= 0) ? 1 : 0;
    r.evConditional = (r.lockEV > 0 && r.qp >= 0) ? 1 : 0;

    // Two-sided features
    const againstMoney = r.lockMoneyPct != null ? 100 - r.lockMoneyPct : 50;
    r.moneyEdge = r.lockMoneyPct != null ? Math.log((r.lockMoneyPct + 1) / (againstMoney + 1)) : 0;
    r.sharpEdgeVal = Math.log((r.lockSharpCount + 1) / (r.oppSharpCount + 1));
    r.mktDom = 0.6 * r.moneyEdge + 0.4 * r.sharpEdgeVal;
    r.moneyEdge_z = zScore(r.moneyEdge, moneyEdgeS.mean, moneyEdgeS.std);
    r.sharpEdge_z = zScore(r.sharpEdgeVal, sharpEdgeS.mean, sharpEdgeS.std);
    r.mktDom_z = zScore(r.mktDom, mktDomS.mean, mktDomS.std);
    r.againstSC_z = zScore(Math.min(r.oppSharpCount, 6), againstSCS.mean, againstSCS.std);
    const hasBoth = r.oppSharpCount > 0 && r.lockSharpCount > 0;
    r.disagreement = hasBoth && Math.sign(r.moneyEdge) !== Math.sign(r.sharpEdgeVal) ? 1 : 0;
  }

  const lockScores = rows.map(r =>
    3.0 * r.moneyPct_z + 1.5 * r.avgBet_z + 1.2 * r.invested_z + 1.0 * r.qp_z
    + 0.8 * r.sharpCount_z + 0.6 * r.pinnConditional + 0.4 * r.evConditional
    - 2.5 * r.counterSharp_z - 1.5 * r.walletPct_z - 2.0 * r.contradictionPenalty
    + 1.25 * r.moneyEdge_z + 0.50 * r.mktDom_z - 1.25 * r.disagreement - 0.50 * r.againstSC_z
  );

  const V7_STATS = {
    avgBet:    { mean: avgBetS.mean, std: avgBetS.std, lo: avgBetS.p2_5, hi: avgBetS.p97_5 },
    invested:  { mean: investedS.mean, std: investedS.std, lo: investedS.p2_5, hi: investedS.p97_5 },
    moneyPct:  { mean: moneyPctS.mean, std: moneyPctS.std },
    walletPct: { mean: walletPctS.mean, std: walletPctS.std },
    counter:   { mean: counterS.mean, std: counterS.std },
    sharpCount:{ mean: scS.mean, std: scS.std },
    qp:        { mean: qpS.mean, std: qpS.std },
    liveCLV:   { mean: liveS.mean, std: liveS.std },
    moneyEdge: { mean: moneyEdgeS.mean, std: moneyEdgeS.std },
    sharpEdge: { mean: sharpEdgeS.mean, std: sharpEdgeS.std },
    mktDominance: { mean: mktDomS.mean, std: mktDomS.std },
    againstSC: { mean: againstSCS.mean, std: againstSCS.std },
    thresholds: {
      p15: +percentile(lockScores, 15).toFixed(4),
      p30: +percentile(lockScores, 30).toFixed(4),
      p50: +percentile(lockScores, 50).toFixed(4),
      p75: +percentile(lockScores, 75).toFixed(4),
      p87: +percentile(lockScores, 87).toFixed(4),
      p93: +percentile(lockScores, 93).toFixed(4),
      p97: +percentile(lockScores, 97).toFixed(4),
    },
  };

  console.log('\n=== V7_STATS for SharpFlow.jsx ===\n');
  console.log('const V7_STATS = ' + JSON.stringify(V7_STATS, null, 2) + ';');
  console.log('\nSample sizes:');
  console.log(`  avgBet: ${avgBetArr.length}, invested: ${investedArr.length}`);
  console.log(`  moneyPct: ${moneyPctArr.length}, walletPct: ${walletPctArr.length}`);
  console.log(`  counter: ${counterArr.length}, sharpCount: ${scArr.length}`);
  console.log(`  qp: ${qpArr.length}, liveCLV: ${liveVals.length}`);
  console.log(`  moneyEdge: ${moneyEdgeArr.length}, sharpEdge: ${sharpEdgeArr.length}`);
  console.log(`  mktDominance: ${mktDomAligned.length}, againstSC: ${againstSCArr.length}`);

  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
