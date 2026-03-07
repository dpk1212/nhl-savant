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

const bets = [];
for (const doc of snap.docs) {
  const d = doc.data();
  const units = d.bet?.units || d.prediction?.unitSize || 0;
  if (units <= 0) continue;
  if (d.betStatus === 'KILLED' || d.betStatus === 'FLAGGED') continue;
  
  const outcome = d.result?.outcome;
  if (!outcome) continue;

  const market = d.bet?.market || (d.isTotalsPick ? 'TOTAL' : d.isATSPick ? 'SPREAD' : 'ML');
  const direction = d.bet?.pick || d.totalsAnalysis?.direction || d.betRecommendation?.totalDirection;
  const mos = d.spreadAnalysis?.marginOverSpread ?? d.betRecommendation?.marginOverSpread;
  const mot = d.totalsAnalysis?.marginOverTotal ?? d.betRecommendation?.marginOverTotal;
  const margin = market === 'TOTAL' ? mot : mos;
  const bothCover = market === 'TOTAL' 
    ? (d.totalsAnalysis?.bothModelsAgree ?? d.betRecommendation?.bothModelsAgree)
    : (d.spreadAnalysis?.bothModelsCover ?? d.betRecommendation?.bothModelsCover);
  const grade = d.prediction?.grade;
  const profit = d.result?.profit || 0;
  const source = d.source || '';
  const isSavant = d.savantPick === true;
  const movementTier = d.spreadAnalysis?.movementTier ?? d.totalsAnalysis?.movementTier ?? d.betRecommendation?.movementTier;

  bets.push({
    id: doc.id,
    date: d.date,
    market,
    direction,
    units,
    outcome,
    profit,
    margin,
    bothCover,
    grade,
    source,
    isSavant,
    movementTier,
    game: `${d.game?.awayTeam} @ ${d.game?.homeTeam}`
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log(`  PRIME PICKS PERFORMANCE ANALYSIS — ${bets.length} graded official bets`);
console.log(`${'='.repeat(80)}\n`);

function stats(arr) {
  const w = arr.filter(b => b.outcome === 'WIN').length;
  const l = arr.filter(b => b.outcome === 'LOSS').length;
  const p = arr.filter(b => b.outcome === 'PUSH').length;
  const pnl = arr.reduce((s, b) => s + b.profit, 0);
  const pct = arr.length > 0 ? (w / (w + l) * 100).toFixed(1) : '0.0';
  const roi = arr.length > 0 ? (pnl / arr.reduce((s, b) => s + b.units, 0) * 100).toFixed(1) : '0.0';
  return { w, l, p, total: arr.length, pnl: Math.round(pnl * 100) / 100, pct, roi };
}

function printRow(label, s) {
  const pnlStr = (s.pnl > 0 ? '+' : '') + s.pnl.toFixed(1) + 'u';
  console.log(`  ${label.padEnd(30)} ${String(s.w + 'W').padEnd(5)} ${String(s.l + 'L').padEnd(5)} ${String(s.p + 'P').padEnd(4)} ${s.pct.padStart(5)}%  ${pnlStr.padStart(9)}  ROI ${s.roi}%`);
}

// OVERALL
console.log('── OVERALL ──');
printRow('All Bets', stats(bets));
console.log('');

// BY MARKET
console.log('── BY MARKET TYPE ──');
const markets = ['SPREAD', 'TOTAL', 'MONEYLINE'];
for (const m of markets) {
  const filtered = bets.filter(b => b.market === m);
  if (filtered.length > 0) printRow(m, stats(filtered));
}
console.log('');

// TOTALS BY DIRECTION
console.log('── TOTALS BREAKDOWN ──');
const totals = bets.filter(b => b.market === 'TOTAL');
printRow('OVER', stats(totals.filter(b => b.direction === 'OVER')));
printRow('UNDER', stats(totals.filter(b => b.direction === 'UNDER')));
console.log('');

// BY UNIT SIZE
console.log('── BY UNIT SIZE ──');
const unitTiers = [
  { label: '5u MAX', filter: b => b.units >= 5 },
  { label: '4u HIGH', filter: b => b.units >= 4 && b.units < 5 },
  { label: '3u STRONG', filter: b => b.units >= 3 && b.units < 4 },
  { label: '2u MODERATE', filter: b => b.units >= 2 && b.units < 3 },
  { label: '1u SMALL', filter: b => b.units >= 1 && b.units < 2 },
];
for (const t of unitTiers) {
  const filtered = bets.filter(t.filter);
  if (filtered.length > 0) printRow(t.label, stats(filtered));
}
console.log('');

// BY UNIT SIZE + MARKET
console.log('── 5u MAX PLAYS BY MARKET ──');
const max5 = bets.filter(b => b.units >= 5);
printRow('5u SPREAD', stats(max5.filter(b => b.market === 'SPREAD')));
printRow('5u TOTAL', stats(max5.filter(b => b.market === 'TOTAL')));
printRow('5u ML', stats(max5.filter(b => b.market === 'MONEYLINE')));
console.log('');

// BY MARGIN (MOS/MOT) RANGES
console.log('── BY MARGIN (MOS/MOT) ──');
const marginRanges = [
  { label: 'Margin ≥ 6', filter: b => b.margin >= 6 },
  { label: 'Margin 5-5.9', filter: b => b.margin >= 5 && b.margin < 6 },
  { label: 'Margin 4-4.9', filter: b => b.margin >= 4 && b.margin < 5 },
  { label: 'Margin 3-3.9', filter: b => b.margin >= 3 && b.margin < 4 },
  { label: 'Margin 2-2.9', filter: b => b.margin >= 2 && b.margin < 3 },
  { label: 'Margin 1-1.9', filter: b => b.margin >= 1 && b.margin < 2 },
  { label: 'Margin < 1', filter: b => b.margin != null && b.margin < 1 },
  { label: 'Margin unknown', filter: b => b.margin == null },
];
for (const r of marginRanges) {
  const filtered = bets.filter(r.filter);
  if (filtered.length > 0) printRow(r.label, stats(filtered));
}
console.log('');

// BOTH MODELS COVER vs SINGLE
console.log('── BOTH MODELS vs SINGLE ──');
printRow('Both Models Cover', stats(bets.filter(b => b.bothCover === true)));
printRow('Single Model Only', stats(bets.filter(b => b.bothCover === false)));
printRow('Unknown', stats(bets.filter(b => b.bothCover == null)));
console.log('');

// SAVANT PICKS
console.log('── SAVANT PICKS (margin ≥ 4) ──');
printRow('Savant Picks', stats(bets.filter(b => b.isSavant)));
printRow('Non-Savant', stats(bets.filter(b => !b.isSavant)));
console.log('');

// MOVEMENT TIER
console.log('── BY LINE MOVEMENT ──');
printRow('CONFIRM (steam)', stats(bets.filter(b => b.movementTier === 'CONFIRM')));
printRow('NEUTRAL', stats(bets.filter(b => !b.movementTier || b.movementTier === 'NEUTRAL' || b.movementTier === 'UNKNOWN')));
console.log('');

// BY DATE (last 10 days)
console.log('── LAST 10 DATES ──');
const dates = [...new Set(bets.map(b => b.date))].sort().slice(-10);
for (const date of dates) {
  const dayBets = bets.filter(b => b.date === date);
  printRow(date, stats(dayBets));
}
console.log('');

// TOTALS BY MARGIN RANGE
console.log('── TOTALS BY MOT RANGE ──');
const totalsOnly = bets.filter(b => b.market === 'TOTAL');
const motRanges = [
  { label: 'MOT ≥ 6', filter: b => b.margin >= 6 },
  { label: 'MOT 5-5.9', filter: b => b.margin >= 5 && b.margin < 6 },
  { label: 'MOT 4-4.9', filter: b => b.margin >= 4 && b.margin < 5 },
  { label: 'MOT 3-3.9', filter: b => b.margin >= 3 && b.margin < 4 },
  { label: 'MOT 2-2.9', filter: b => b.margin >= 2 && b.margin < 3 },
  { label: 'MOT < 2', filter: b => b.margin != null && b.margin < 2 },
];
for (const r of motRanges) {
  const filtered = totalsOnly.filter(r.filter);
  if (filtered.length > 0) printRow(r.label, stats(filtered));
}
console.log('');

// SPREADS BY MOS RANGE
console.log('── SPREADS BY MOS RANGE ──');
const spreadsOnly = bets.filter(b => b.market === 'SPREAD');
const mosRanges = [
  { label: 'MOS ≥ 6', filter: b => b.margin >= 6 },
  { label: 'MOS 5-5.9', filter: b => b.margin >= 5 && b.margin < 6 },
  { label: 'MOS 4-4.9', filter: b => b.margin >= 4 && b.margin < 5 },
  { label: 'MOS 3-3.9', filter: b => b.margin >= 3 && b.margin < 4 },
  { label: 'MOS 2-2.9', filter: b => b.margin >= 2 && b.margin < 3 },
  { label: 'MOS < 2', filter: b => b.margin != null && b.margin < 2 },
];
for (const r of mosRanges) {
  const filtered = spreadsOnly.filter(r.filter);
  if (filtered.length > 0) printRow(r.label, stats(filtered));
}
console.log('');

// WORST DAYS
console.log('── WORST 5 DAYS ──');
const allDates = [...new Set(bets.map(b => b.date))].sort();
const dayStats = allDates.map(d => ({ date: d, ...stats(bets.filter(b => b.date === d)) }));
dayStats.sort((a, b) => a.pnl - b.pnl);
for (const ds of dayStats.slice(0, 5)) {
  printRow(ds.date, ds);
}
console.log('');

// BEST 5 DAYS
console.log('── BEST 5 DAYS ──');
for (const ds of dayStats.slice(-5).reverse()) {
  printRow(ds.date, ds);
}

process.exit(0);
