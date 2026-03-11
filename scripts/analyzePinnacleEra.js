import admin from 'firebase-admin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}
const db = admin.firestore();

const snap = await db.collection('basketball_bets')
  .where('status', '==', 'COMPLETED')
  .get();

const ats = [];
const totals = [];

for (const doc of snap.docs) {
  const d = doc.data();
  const units = d.bet?.units || d.prediction?.unitSize || 0;
  if (units <= 0) continue;
  if (d.betStatus === 'KILLED' || d.betStatus === 'FLAGGED') continue;

  const outcome = d.result?.outcome;
  if (!outcome) continue;

  const market = d.bet?.market || (d.isTotalsPick ? 'TOTAL' : 'SPREAD');
  const profit = d.result?.profit || 0;
  const signalCount = d.spreadAnalysis?.signalCount;
  const pinnSpread = d.spreadAnalysis?.pinnacleSpread;
  const pinnEdge = d.spreadAnalysis?.pinnEdgePts;
  const pinnTotal = d.totalsAnalysis?.pinnacleTotal ?? d.totalsAnalysis?.pinnTotal;
  const pinnTotalEdge = d.totalsAnalysis?.pinnTotalEdge;
  const drTier = d.totalsAnalysis?.drContrarianTier;
  const direction = d.bet?.pick || d.totalsAnalysis?.direction;
  const movementTier = d.spreadAnalysis?.movementTier ?? d.totalsAnalysis?.movementTier;
  const timestamp = d.timestamp?.toDate?.() || new Date(d.timestamp);
  const date = d.date || doc.id.substring(0, 10);

  const hasPinnData = signalCount != null || pinnSpread != null || pinnTotal != null || date >= '2026-03-04';

  const bet = {
    id: doc.id, date, market, units, outcome, profit, timestamp,
    signalCount, pinnSpread, pinnEdge, pinnTotal, pinnTotalEdge,
    drTier, direction, movementTier, hasPinnData
  };

  if (market === 'SPREAD') ats.push(bet);
  else if (market === 'TOTAL') totals.push(bet);
}

ats.sort((a, b) => a.timestamp - b.timestamp);
totals.sort((a, b) => a.timestamp - b.timestamp);

const pinnAts = ats.filter(b => b.hasPinnData);
const pinnTotals = totals.filter(b => b.hasPinnData);

function analyze(bets, label) {
  console.log(`\n${'═'.repeat(90)}`);
  console.log(`  ${label} — ${bets.length} bets (Pinnacle era)`);
  console.log(`${'═'.repeat(90)}`);

  const wins = bets.filter(b => b.outcome === 'WIN');
  const losses = bets.filter(b => b.outcome === 'LOSS');
  const pushes = bets.filter(b => b.outcome === 'PUSH');
  const totalProfit = bets.reduce((s, b) => s + b.profit, 0);
  const totalRisked = bets.reduce((s, b) => s + b.units, 0);
  const roi = totalRisked > 0 ? (totalProfit / totalRisked * 100) : 0;

  console.log(`\n  OVERALL: ${wins.length}-${losses.length}${pushes.length ? `-${pushes.length}P` : ''} (${(wins.length / (wins.length + losses.length) * 100).toFixed(1)}%) | ${totalRisked}u risked | ${totalProfit > 0 ? '+' : ''}${totalProfit.toFixed(1)}u | ${roi > 0 ? '+' : ''}${roi.toFixed(1)}% ROI`);

  if (bets.length > 0) {
    const earliest = bets[0].date;
    const latest = bets[bets.length - 1].date;
    console.log(`  Date range: ${earliest} → ${latest}`);
  }

  // By star (unit) size
  const starBuckets = {};
  for (const b of bets) {
    const star = Math.min(b.units, 5);
    if (!starBuckets[star]) starBuckets[star] = [];
    starBuckets[star].push(b);
  }

  console.log(`\n  ─── ⭐ BY STAR (UNIT) SIZE ───────────────────────────────────────────────`);
  console.log(`  ${'Star'.padEnd(10)} │ ${'Bets'.padEnd(5)} │ ${'Record'.padEnd(12)} │ ${'Win%'.padEnd(7)} │ ${'Risked'.padEnd(8)} │ ${'Profit'.padEnd(10)} │ ROI`);
  console.log(`  ${'─'.repeat(80)}`);

  for (const star of [5, 4, 3, 2, 1]) {
    const bucket = starBuckets[star];
    if (!bucket || bucket.length === 0) continue;
    const w = bucket.filter(b => b.outcome === 'WIN').length;
    const l = bucket.filter(b => b.outcome === 'LOSS').length;
    const p = bucket.reduce((s, b) => s + b.profit, 0);
    const r = bucket.reduce((s, b) => s + b.units, 0);
    const wr = (w / (w + l) * 100).toFixed(1);
    const roiPct = r > 0 ? (p / r * 100).toFixed(1) : '0.0';
    const icon = p > 0 ? '🟢' : p < -1 ? '🔴' : '🟡';
    console.log(`  ${icon} ${(star + '★').padEnd(8)} │ ${String(bucket.length).padEnd(5)} │ ${(w + '-' + l).padEnd(12)} │ ${(wr + '%').padEnd(7)} │ ${(r + 'u').padEnd(8)} │ ${(p > 0 ? '+' : '') + p.toFixed(1) + 'u'.padEnd(4)} │ ${roiPct}%`);
  }

  // Cumulative P&L by star
  console.log(`\n  ─── 📈 CUMULATIVE P&L BY STAR (what each chart line shows) ────────────────`);
  for (const star of [5, 4, 3, 2, 1]) {
    const bucket = starBuckets[star];
    if (!bucket || bucket.length === 0) continue;
    let cum = 0;
    const points = [];
    for (const b of bucket) {
      cum += b.profit;
      points.push({ date: b.date, pnl: cum });
    }
    const peak = Math.max(...points.map(p => p.pnl));
    const trough = Math.min(...points.map(p => p.pnl));
    const final = points[points.length - 1].pnl;
    console.log(`  ${star}★: final ${final > 0 ? '+' : ''}${final.toFixed(1)}u | peak +${peak.toFixed(1)}u | trough ${trough.toFixed(1)}u | ${bucket.length} bets`);
  }

  // By movement tier (if ATS)
  if (label.includes('ATS')) {
    const mvBuckets = {};
    for (const b of bets) {
      const mv = b.movementTier || 'UNKNOWN';
      if (!mvBuckets[mv]) mvBuckets[mv] = [];
      mvBuckets[mv].push(b);
    }
    console.log(`\n  ─── 📡 BY MOVEMENT TIER ──────────────────────────────────────────────────`);
    for (const tier of ['CONFIRM', 'NEUTRAL', 'FLAGGED', 'UNKNOWN']) {
      const bucket = mvBuckets[tier];
      if (!bucket || bucket.length === 0) continue;
      const w = bucket.filter(b => b.outcome === 'WIN').length;
      const l = bucket.filter(b => b.outcome === 'LOSS').length;
      const p = bucket.reduce((s, b) => s + b.profit, 0);
      const r = bucket.reduce((s, b) => s + b.units, 0);
      console.log(`  ${tier.padEnd(12)}: ${w}-${l} (${(w/(w+l)*100).toFixed(1)}%) | ${r}u risked | ${p > 0 ? '+' : ''}${p.toFixed(1)}u | ${(r > 0 ? p/r*100 : 0).toFixed(1)}% ROI`);
    }

    // By signal count
    const sigBuckets = {};
    for (const b of bets) {
      const sc = b.signalCount ?? 'pre-V11';
      if (!sigBuckets[sc]) sigBuckets[sc] = [];
      sigBuckets[sc].push(b);
    }
    console.log(`\n  ─── 🔢 BY SIGNAL COUNT ──────────────────────────────────────────────────`);
    for (const sc of [3, 2, 1, 'pre-V11']) {
      const bucket = sigBuckets[sc];
      if (!bucket || bucket.length === 0) continue;
      const w = bucket.filter(b => b.outcome === 'WIN').length;
      const l = bucket.filter(b => b.outcome === 'LOSS').length;
      const p = bucket.reduce((s, b) => s + b.profit, 0);
      const r = bucket.reduce((s, b) => s + b.units, 0);
      console.log(`  ${String(sc).padEnd(12)}: ${w}-${l} (${(w/(w+l)*100).toFixed(1)}%) | ${r}u risked | ${p > 0 ? '+' : ''}${p.toFixed(1)}u | ${(r > 0 ? p/r*100 : 0).toFixed(1)}% ROI`);
    }
  }

  // Totals-specific: by direction and DR tier
  if (label.includes('TOTALS')) {
    const dirBuckets = { OVER: [], UNDER: [] };
    for (const b of bets) {
      if (b.direction === 'OVER') dirBuckets.OVER.push(b);
      else if (b.direction === 'UNDER') dirBuckets.UNDER.push(b);
    }
    console.log(`\n  ─── 📋 BY DIRECTION ──────────────────────────────────────────────────────`);
    for (const dir of ['OVER', 'UNDER']) {
      const bucket = dirBuckets[dir];
      if (bucket.length === 0) continue;
      const w = bucket.filter(b => b.outcome === 'WIN').length;
      const l = bucket.filter(b => b.outcome === 'LOSS').length;
      const p = bucket.reduce((s, b) => s + b.profit, 0);
      const r = bucket.reduce((s, b) => s + b.units, 0);
      console.log(`  ${dir.padEnd(12)}: ${w}-${l} (${(w/(w+l)*100).toFixed(1)}%) | ${r}u risked | ${p > 0 ? '+' : ''}${p.toFixed(1)}u | ${(r > 0 ? p/r*100 : 0).toFixed(1)}% ROI`);

      // Star breakdown within direction
      const dStars = {};
      for (const b of bucket) {
        const s = Math.min(b.units, 5);
        if (!dStars[s]) dStars[s] = [];
        dStars[s].push(b);
      }
      for (const star of [5, 4, 3, 2, 1]) {
        const sb = dStars[star];
        if (!sb || sb.length === 0) continue;
        const sw = sb.filter(b => b.outcome === 'WIN').length;
        const sl = sb.filter(b => b.outcome === 'LOSS').length;
        const sp = sb.reduce((s, b) => s + b.profit, 0);
        const sr = sb.reduce((s, b) => s + b.units, 0);
        console.log(`    ${star}★: ${sw}-${sl} (${(sw/(sw+sl)*100).toFixed(1)}%) | ${sr}u | ${sp > 0 ? '+' : ''}${sp.toFixed(1)}u | ${(sr > 0 ? sp/sr*100 : 0).toFixed(1)}% ROI`);
      }
    }

    // DR tier
    const drBuckets = {};
    for (const b of bets) {
      const tier = b.drTier || 'none';
      if (!drBuckets[tier]) drBuckets[tier] = [];
      drBuckets[tier].push(b);
    }
    console.log(`\n  ─── 🔥 BY DR CONTRARIAN TIER ────────────────────────────────────────────`);
    for (const tier of ['DR_SWEET_SPOT', 'DR_UNDER', 'none']) {
      const bucket = drBuckets[tier];
      if (!bucket || bucket.length === 0) continue;
      const w = bucket.filter(b => b.outcome === 'WIN').length;
      const l = bucket.filter(b => b.outcome === 'LOSS').length;
      const p = bucket.reduce((s, b) => s + b.profit, 0);
      const r = bucket.reduce((s, b) => s + b.units, 0);
      console.log(`  ${tier.padEnd(16)}: ${w}-${l} (${(w/(w+l)*100).toFixed(1)}%) | ${r}u risked | ${p > 0 ? '+' : ''}${p.toFixed(1)}u | ${(r > 0 ? p/r*100 : 0).toFixed(1)}% ROI`);
    }
  }

  // Individual bet log
  console.log(`\n  ─── 📝 INDIVIDUAL BETS (chronological) ──────────────────────────────────`);
  for (const b of bets) {
    const icon = b.outcome === 'WIN' ? '✅' : b.outcome === 'LOSS' ? '❌' : '➖';
    const profitStr = b.profit > 0 ? `+${b.profit.toFixed(1)}u` : `${b.profit.toFixed(1)}u`;
    const extra = b.market === 'TOTAL' 
      ? `${b.direction} | DR: ${b.drTier || '—'}` 
      : `signals: ${b.signalCount ?? '?'} | mv: ${b.movementTier || '?'}`;
    console.log(`  ${icon} ${b.date} | ${b.units}★ | ${profitStr.padEnd(7)} | ${extra} | ${b.id.substring(11, 60)}`);
  }
}

console.log('\n\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                    PINNACLE ERA PERFORMANCE ANALYSIS                                      ║');
console.log('║                    (Only bets created with Pinnacle data available)                        ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════════╝');

console.log(`\n  Total completed bets in Firebase: ${snap.docs.length}`);
console.log(`  ATS total: ${ats.length} | with Pinnacle data: ${pinnAts.length}`);
console.log(`  Totals total: ${totals.length} | with Pinnacle data: ${pinnTotals.length}`);

analyze(pinnAts, 'ATS (SPREADS)');
analyze(pinnTotals, 'TOTALS (O/U)');

// Combined
const allPinn = [...pinnAts, ...pinnTotals].sort((a, b) => a.timestamp - b.timestamp);
console.log(`\n${'═'.repeat(90)}`);
console.log(`  COMBINED — ${allPinn.length} bets`);
console.log(`${'═'.repeat(90)}`);
const cWins = allPinn.filter(b => b.outcome === 'WIN').length;
const cLosses = allPinn.filter(b => b.outcome === 'LOSS').length;
const cProfit = allPinn.reduce((s, b) => s + b.profit, 0);
const cRisked = allPinn.reduce((s, b) => s + b.units, 0);
console.log(`  OVERALL: ${cWins}-${cLosses} (${(cWins/(cWins+cLosses)*100).toFixed(1)}%) | ${cRisked}u risked | ${cProfit > 0 ? '+' : ''}${cProfit.toFixed(1)}u | ${(cRisked > 0 ? cProfit/cRisked*100 : 0).toFixed(1)}% ROI`);

process.exit(0);
