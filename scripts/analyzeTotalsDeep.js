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
  if (!outcome || outcome === 'PUSH') continue;

  const market = d.bet?.market || (d.isTotalsPick ? 'TOTAL' : 'SPREAD');
  if (market !== 'TOTAL') continue;

  const profit = d.result?.profit || 0;
  const date = d.date || doc.id.substring(0, 10);
  const ta = d.totalsAnalysis || {};
  const pred = d.prediction || {};

  bets.push({
    id: doc.id,
    date,
    units,
    outcome,
    profit,
    direction: d.bet?.pick || ta.direction,
    mot: ta.marginOverTotal ?? 0,
    marketTotal: ta.marketTotal || d.bet?.total || 0,
    blendedTotal: ta.blendedTotal || 0,
    drTotal: ta.drTotal || 0,
    hsTotal: ta.hsTotal || 0,
    drOver: ta.drOver ?? null,
    hsOver: ta.hsOver ?? null,
    bothAgree: ta.bothModelsAgree ?? false,
    movementTier: ta.movementTier || 'UNKNOWN',
    lineMovement: ta.lineMovement ?? 0,
    pinnTotal: ta.pinnacleTotal ?? ta.pinnTotal ?? null,
    pinnEdge: ta.pinnTotalEdge ?? 0,
    hasPinnEdge: ta.hasPinnEdge ?? false,
    drTier: ta.drContrarianTier || d.totalsAnalysis?.drContrarianTier || null,
    unitTier: ta.unitTier || null,
    drAwayScore: pred.dratingsAwayScore || 0,
    drHomeScore: pred.dratingsHomeScore || 0,
    hsAwayScore: pred.haslametricsAwayScore || 0,
    hsHomeScore: pred.haslametricsHomeScore || 0,
  });
}

bets.sort((a, b) => a.date.localeCompare(b.date));

// ── Helper ──
function row(label, arr) {
  const w = arr.filter(b => b.outcome === 'WIN').length;
  const l = arr.filter(b => b.outcome === 'LOSS').length;
  const p = arr.reduce((s, b) => s + b.profit, 0);
  const r = arr.reduce((s, b) => s + b.units, 0);
  const wr = w + l > 0 ? (w / (w + l) * 100).toFixed(1) : '0.0';
  const roi = r > 0 ? (p / r * 100).toFixed(1) : '0.0';
  const icon = p > 0 ? '🟢' : p < -0.5 ? '🔴' : '🟡';
  console.log(`  ${icon} ${label.padEnd(28)} │ ${String(arr.length).padEnd(4)} │ ${(w + '-' + l).padEnd(8)} │ ${(wr + '%').padEnd(7)} │ ${(r + 'u').padEnd(7)} │ ${((p > 0 ? '+' : '') + p.toFixed(1) + 'u').padEnd(8)} │ ${roi}%`);
}

function header(title) {
  console.log(`\n  ─── ${title} ${'─'.repeat(Math.max(0, 75 - title.length))}`);
  console.log(`  ${'Segment'.padEnd(31)} │ ${'Bets'.padEnd(4)} │ ${'Record'.padEnd(8)} │ ${'Win%'.padEnd(7)} │ ${'Risk'.padEnd(7)} │ ${'P&L'.padEnd(8)} │ ROI`);
  console.log(`  ${'─'.repeat(95)}`);
}

console.log('\n\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                 TOTALS DEEP DIVE — ALL COMPLETED BETS                                    ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════════╝');
console.log(`\n  Total completed totals bets: ${bets.length}`);
console.log(`  Date range: ${bets[0]?.date || '?'} → ${bets[bets.length - 1]?.date || '?'}`);

// ── OVERALL ──
header('OVERALL');
row('ALL TOTALS', bets);

// ── BY DIRECTION ──
header('BY DIRECTION');
const overs = bets.filter(b => b.direction === 'OVER');
const unders = bets.filter(b => b.direction === 'UNDER');
row('OVER', overs);
row('UNDER', unders);

// ── BY UNIT SIZE ──
header('BY UNIT SIZE (STARS)');
for (const u of [4, 3, 2, 1]) {
  const seg = bets.filter(b => b.units === u);
  if (seg.length) row(`${u}★`, seg);
}

// ── BY DIRECTION + UNIT SIZE ──
header('DIRECTION × UNIT SIZE');
for (const dir of ['OVER', 'UNDER']) {
  for (const u of [4, 3, 2, 1]) {
    const seg = bets.filter(b => b.direction === dir && b.units === u);
    if (seg.length) row(`${dir} ${u}★`, seg);
  }
}

// ── BY MOT RANGE ──
header('BY MOT (MARGIN OVER TOTAL)');
const motRanges = [
  { label: 'MOT 5.0+', min: 5.0, max: 99 },
  { label: 'MOT 4.0-4.9', min: 4.0, max: 5.0 },
  { label: 'MOT 3.0-3.9', min: 3.0, max: 4.0 },
  { label: 'MOT 2.0-2.9', min: 2.0, max: 3.0 },
  { label: 'MOT 1.5-1.9', min: 1.5, max: 2.0 },
  { label: 'MOT 1.0-1.4', min: 1.0, max: 1.5 },
  { label: 'MOT < 1.0', min: 0, max: 1.0 },
];
for (const r of motRanges) {
  const seg = bets.filter(b => b.mot >= r.min && b.mot < r.max);
  if (seg.length) row(r.label, seg);
}

// ── BY DIRECTION + MOT ──
header('DIRECTION × MOT');
for (const dir of ['OVER', 'UNDER']) {
  for (const r of motRanges) {
    const seg = bets.filter(b => b.direction === dir && b.mot >= r.min && b.mot < r.max);
    if (seg.length) row(`${dir} ${r.label}`, seg);
  }
}

// ── BY BOTH MODELS AGREE ──
header('MODEL AGREEMENT');
row('Both Agree', bets.filter(b => b.bothAgree));
row('Models Disagree', bets.filter(b => !b.bothAgree));
for (const dir of ['OVER', 'UNDER']) {
  row(`${dir} Both Agree`, bets.filter(b => b.direction === dir && b.bothAgree));
  row(`${dir} Disagree`, bets.filter(b => b.direction === dir && !b.bothAgree));
}

// ── BY MOVEMENT TIER ──
header('BY MOVEMENT TIER');
for (const mv of ['CONFIRM', 'NEUTRAL', 'FLAGGED', 'UNKNOWN']) {
  const seg = bets.filter(b => b.movementTier === mv);
  if (seg.length) row(mv, seg);
}

// ── BY LINE MOVEMENT MAGNITUDE ──
header('LINE MOVEMENT MAGNITUDE');
const mvRanges = [
  { label: 'Move >= 2.0 FOR', test: b => b.lineMovement >= 2.0 },
  { label: 'Move 1.0-1.9 FOR', test: b => b.lineMovement >= 1.0 && b.lineMovement < 2.0 },
  { label: 'Move 0.5-0.9 FOR', test: b => b.lineMovement >= 0.5 && b.lineMovement < 1.0 },
  { label: 'Flat (< 0.5)', test: b => Math.abs(b.lineMovement) < 0.5 },
  { label: 'Move 0.5+ AGAINST', test: b => b.lineMovement <= -0.5 },
];
for (const r of mvRanges) {
  const seg = bets.filter(r.test);
  if (seg.length) row(r.label, seg);
}

// ── BY DR CONTRARIAN TIER ──
header('DR CONTRARIAN TIER');
for (const tier of ['DR_SWEET_SPOT', 'DR_UNDER', null]) {
  const seg = bets.filter(b => (b.drTier || null) === tier);
  if (seg.length) row(tier || 'none/standard', seg);
}
for (const dir of ['OVER', 'UNDER']) {
  for (const tier of ['DR_SWEET_SPOT', 'DR_UNDER', null]) {
    const seg = bets.filter(b => b.direction === dir && (b.drTier || null) === tier);
    if (seg.length) row(`${dir} ${tier || 'none'}`, seg);
  }
}

// ── BY MARKET TOTAL RANGE ──
header('MARKET TOTAL RANGE');
const totalRanges = [
  { label: 'Total >= 160', min: 160, max: 999 },
  { label: 'Total 150-159.5', min: 150, max: 160 },
  { label: 'Total 140-149.5', min: 140, max: 150 },
  { label: 'Total 130-139.5', min: 130, max: 140 },
  { label: 'Total < 130', min: 0, max: 130 },
];
for (const r of totalRanges) {
  const seg = bets.filter(b => b.marketTotal >= r.min && b.marketTotal < r.max);
  if (seg.length) row(r.label, seg);
}

// ── BY PINNACLE EDGE ──
header('PINNACLE EDGE');
row('Has Pinn Edge', bets.filter(b => b.hasPinnEdge));
row('No Pinn Edge', bets.filter(b => !b.hasPinnEdge));
for (const dir of ['OVER', 'UNDER']) {
  row(`${dir} + Pinn Edge`, bets.filter(b => b.direction === dir && b.hasPinnEdge));
  row(`${dir} no Pinn Edge`, bets.filter(b => b.direction === dir && !b.hasPinnEdge));
}

// ── BY DIRECTION + MOVEMENT + MODEL AGREEMENT (combo) ──
header('COMBO: DIR × MOVEMENT × MODELS');
for (const dir of ['OVER', 'UNDER']) {
  for (const mv of ['CONFIRM', 'NEUTRAL']) {
    for (const agree of [true, false]) {
      const seg = bets.filter(b => b.direction === dir && b.movementTier === mv && b.bothAgree === agree);
      if (seg.length) row(`${dir} ${mv} ${agree ? 'Agree' : 'Disagree'}`, seg);
    }
  }
}

// ── BY DIRECTION + MOT + DR TIER (best combo hunt) ──
header('COMBO: DIR × MOT >= 2 × DR TIER');
for (const dir of ['OVER', 'UNDER']) {
  for (const tier of ['DR_SWEET_SPOT', 'DR_UNDER', null]) {
    const seg = bets.filter(b => b.direction === dir && b.mot >= 2.0 && (b.drTier || null) === tier);
    if (seg.length) row(`${dir} MOT≥2 ${tier || 'none'}`, seg);
  }
}

header('COMBO: DIR × MOT >= 3 × DR TIER');
for (const dir of ['OVER', 'UNDER']) {
  for (const tier of ['DR_SWEET_SPOT', 'DR_UNDER', null]) {
    const seg = bets.filter(b => b.direction === dir && b.mot >= 3.0 && (b.drTier || null) === tier);
    if (seg.length) row(`${dir} MOT≥3 ${tier || 'none'}`, seg);
  }
}

// ── INDIVIDUAL BET LOG ──
console.log(`\n  ─── INDIVIDUAL BETS (chronological) ${'─'.repeat(55)}`);
for (const b of bets) {
  const icon = b.outcome === 'WIN' ? '✅' : '❌';
  const pStr = (b.profit > 0 ? '+' : '') + b.profit.toFixed(1) + 'u';
  const drStr = b.drTier ? ` DR:${b.drTier}` : '';
  const pinnStr = b.hasPinnEdge ? ` PinnE:+${b.pinnEdge}` : '';
  const agreeStr = b.bothAgree ? 'Agree' : 'Split';
  console.log(`  ${icon} ${b.date} │ ${b.direction.padEnd(5)} ${b.units}★ │ MOT +${b.mot.toString().padEnd(4)} │ ${b.movementTier.padEnd(7)} │ mv ${(b.lineMovement > 0 ? '+' : '') + b.lineMovement} │ ${agreeStr.padEnd(5)} │ mkt ${b.marketTotal}${drStr}${pinnStr} │ ${pStr} │ ${b.id.substring(11, 55)}`);
}

process.exit(0);
