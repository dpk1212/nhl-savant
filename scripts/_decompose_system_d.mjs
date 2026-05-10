// Decompose System-D — is Δcount or ΔAvgRoi doing the work?
//
// System-D ships if  (Δcount ≥ +2) AND (ΔAvgRoi > median).
// Question from review: isn't Δcount just Δw under a new name?
//   → Yes, they're the same metric (proven-for − proven-against), just
//     measured at different times.
//
// Test: split the expanded universe into a 2×2 of these two conditions
// and report performance per cell. If Δcount is the work-horse, the
// (Δcount ≥ +2 ∧ ΔAvgRoi LOW) cell should still print well. If ΔAvgRoi
// is the work-horse, that cell collapses while (Δcount LOW ∧ ΔAvgRoi HIGH)
// stays strong.
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
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

const V6_CUTOVER = '2026-04-18';
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const PROVEN_TIERS = new Set(['CONFIRMED', 'FLAT']);
const TOP_QUARTILE_FRAC = 0.25;

function flatProfit(odds, outcome) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'WIN') return odds == null ? 0.91 : (odds > 0 ? odds / 100 : 100 / Math.abs(odds));
  return -1;
}

async function loadWalletProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of snap.docs) profiles.set(d.id, d.data());
  const provenRanksBySport = new Map();
  const sports = new Set();
  for (const p of profiles.values()) {
    if (p?.bySport) for (const s of Object.keys(p.bySport)) sports.add(s);
  }
  for (const sport of sports) {
    const eligible = [];
    for (const [wallet, p] of profiles) {
      const rec = p?.bySport?.[sport];
      if (!rec || !PROVEN_TIERS.has(rec.whitelistTier)) continue;
      eligible.push({
        wallet,
        flatRoi: rec.picks?.flatRoi ?? 0,
        n:       rec.picks?.n ?? 0,
        wins:    rec.picks?.wins ?? 0,
        losses:  rec.picks?.losses ?? 0,
        flatPnl: rec.picks?.flatPnl ?? 0,
      });
    }
    eligible.sort((a, b) => b.flatRoi - a.flatRoi || b.flatPnl - a.flatPnl);
    const m = new Map();
    eligible.forEach((e, i) => m.set(e.wallet, { ...e, rank: i + 1, isTopQuartile: (i + 1) <= Math.max(1, Math.ceil(eligible.length * TOP_QUARTILE_FRAC)) }));
    provenRanksBySport.set(sport, m);
  }
  return { provenRanksBySport };
}

function computeAgg(walletDetails, sideKey, ranksMap) {
  if (!Array.isArray(walletDetails) || !ranksMap) return null;
  const f = { count: 0, sumRoi: 0 };
  const a = { count: 0, sumRoi: 0 };
  for (const w of walletDetails) {
    if (!w?.wallet || !w?.side) continue;
    const r = ranksMap.get(w.wallet);
    if (!r) continue;
    const b = (w.side === sideKey) ? f : a;
    b.count += 1;
    b.sumRoi += r.flatRoi;
  }
  const avg = b => b.count > 0 ? b.sumRoi / b.count : 0;
  return { dCount: f.count - a.count, dAvgRoi: avg(f) - avg(a), forCount: f.count, agCount: a.count };
}

const { provenRanksBySport } = await loadWalletProfiles();
const rows = [];
for (const [col, market] of PICK_COLS) {
  const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const sides = d.sides || {};
    const sport = d.sport || 'UNK';
    for (const [sideKey, side] of Object.entries(sides)) {
      const oc = side?.result?.outcome;
      if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;
      if (side.superseded) continue;
      if (side.health?.status === 'CANCELLED') continue;
      const peak = side.peak || side.lock || {};
      const wd = peak?.v8Scoring?.walletDetails;
      const ranksMap = provenRanksBySport.get(sport) || null;
      const agg = computeAgg(wd, sideKey, ranksMap);
      if (!agg || (agg.forCount + agg.agCount) === 0) continue;
      const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds ?? side?.lock?.odds ?? side?.peak?.odds ?? null;
      const dwFrozen = side.v8_walletConsensusDelta != null ? Number(side.v8_walletConsensusDelta) : null;
      const peakUnits = peak?.units || 1;
      let profitU = 0;
      if (oc === 'WIN')  profitU = (side.result?.profit || 0);
      else if (oc === 'LOSS') profitU = -peakUnits;
      rows.push({
        date: d.date, sport, market, team: side.team, away: d.away, home: d.home,
        outcome: oc, profitU, flatProfit: flatProfit(odds, oc), odds,
        dwFrozen, dCount: agg.dCount, dAvgRoi: agg.dAvgRoi,
      });
    }
  }
}

console.log(`\n=== Δcount  vs  Δw (frozen) — agreement check ===`);
const equal = rows.filter(r => r.dwFrozen === r.dCount).length;
const drift = rows.filter(r => r.dwFrozen !== r.dCount && r.dwFrozen != null).length;
const dwNull = rows.filter(r => r.dwFrozen == null).length;
console.log(`  rows total:                     ${rows.length}`);
console.log(`  Δw == Δcount (perfect agree):   ${equal}`);
console.log(`  Δw != Δcount (drift since freeze): ${drift}`);
console.log(`  Δw is null (legacy pre-v8):     ${dwNull}`);
console.log(`  agreement rate (where Δw exists): ${(equal / Math.max(1, equal + drift) * 100).toFixed(1)}%\n`);

// Show the actual drift cases — wallets promoted/demoted since pick freeze
const drifters = rows.filter(r => r.dwFrozen !== r.dCount && r.dwFrozen != null).slice(0, 15);
if (drifters.length) {
  console.log(`Drift examples (first 15):`);
  console.log(`  Date       Sport  Mkt    Side             Δw_frozen  Δcount_now   delta`);
  drifters.forEach(r => {
    const matchup = `${r.away || '?'} @ ${r.home || '?'}`;
    console.log(`  ${r.date}  ${r.sport.padEnd(4)}   ${r.market.padEnd(6)} ${(r.team || '?').padEnd(20)}     ${String(r.dwFrozen).padStart(3)}        ${String(r.dCount).padStart(3)}        ${(r.dCount - r.dwFrozen >= 0 ? '+' : '') + (r.dCount - r.dwFrozen)}`);
  });
}

// Compute median dAvgRoi across the universe
const sortedRoi = [...rows.map(r => r.dAvgRoi)].sort((a, b) => a - b);
const medAvgRoi = sortedRoi[Math.floor(sortedRoi.length / 2)];
console.log(`\n=== System-D 2×2 decomposition (median ΔAvgRoi = ${medAvgRoi.toFixed(2)}pp) ===\n`);

function summarize(rows) {
  const n = rows.length;
  if (!n) return { n: 0 };
  const w = rows.filter(r => r.outcome === 'WIN').length;
  const l = rows.filter(r => r.outcome === 'LOSS').length;
  const p = rows.filter(r => r.outcome === 'PUSH').length;
  const wr = (w + l) > 0 ? w / (w + l) : null;
  const peakPnl = rows.reduce((s, r) => s + (r.profitU || 0), 0);
  const flat = rows.reduce((s, r) => s + (r.flatProfit || 0), 0);
  const flatRoi = (w + l + p) > 0 ? flat / (w + l + p) : null;
  return { n, w, l, p, wr, peakPnl, flat, flatRoi };
}
function fmt(label, s) {
  if (!s.n) return `  ${label.padEnd(45)}: N=0`;
  return `  ${label.padEnd(45)}: N=${String(s.n).padStart(3)}  ${s.w}-${s.l}-${s.p}  WR=${(s.wr*100).toFixed(1).padStart(5)}%  PeakPnL=${(s.peakPnl >= 0 ? '+' : '') + s.peakPnl.toFixed(2)}u  FlatROI=${(s.flatRoi*100).toFixed(1)}%`;
}

const cellA = rows.filter(r => r.dCount >= 2  && r.dAvgRoi > medAvgRoi);  // SHIP
const cellB = rows.filter(r => r.dCount >= 2  && r.dAvgRoi <= medAvgRoi); // count-only (no roi gate)
const cellC = rows.filter(r => r.dCount < 2   && r.dAvgRoi > medAvgRoi);  // roi-only (no count gate)
const cellD = rows.filter(r => r.dCount < 2   && r.dAvgRoi <= medAvgRoi); // mute

console.log('2×2 grid — rows = Δcount ≥ +2,  cols = ΔAvgRoi > median');
console.log('');
console.log('                          ΔAvgRoi > med           ΔAvgRoi ≤ med');
console.log(fmt('Δcount ≥ +2  →  cell A (SHIP)', summarize(cellA)));
console.log(fmt('Δcount ≥ +2  →  cell B (count-only)', summarize(cellB)));
console.log(fmt('Δcount < +2  →  cell C (roi-only)', summarize(cellC)));
console.log(fmt('Δcount < +2  →  cell D (mute)', summarize(cellD)));

console.log('\n=== What would each gate alone do? ===');
console.log(fmt('Δcount ≥ +2 alone (= Δw_today ≥ +2)', summarize(rows.filter(r => r.dCount >= 2))));
console.log(fmt('Δw_frozen ≥ +2 alone',                 summarize(rows.filter(r => r.dwFrozen != null && r.dwFrozen >= 2))));
console.log(fmt('ΔAvgRoi > median alone',               summarize(rows.filter(r => r.dAvgRoi > medAvgRoi))));
console.log(fmt('Both gates (System-D SHIP)',           summarize(cellA)));
console.log(fmt('Universe',                             summarize(rows)));

console.log('\n=== Stricter ΔAvgRoi thresholds ===');
[5, 10, 15, 20, 25, 30, 40, 50].forEach(thr => {
  console.log(fmt(`Δcount ≥ +2  AND  ΔAvgRoi > ${thr}pp`, summarize(rows.filter(r => r.dCount >= 2 && r.dAvgRoi > thr))));
});

console.log('\n=== Stricter Δcount thresholds (no ROI gate) ===');
[1, 2, 3, 4, 5, 6].forEach(thr => {
  console.log(fmt(`Δcount ≥ +${thr}`, summarize(rows.filter(r => r.dCount >= thr))));
});

process.exit(0);
