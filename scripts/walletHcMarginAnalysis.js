/**
 * walletHcMarginAnalysis.js — does HC MARGIN matter, or is binary HC dominance
 * the whole signal?
 *
 * Built on the same point-in-time tier infrastructure as walletGateScaleTest.js
 * (L2 lens), same shipped-pick sample (Δw≥+1 ∧ Δq≥+1, since v6 cutover). Adds:
 *
 *   §1. Inventory by (HC_for, HC_ag) cell — how often does each combo occur?
 *   §2. Within-Σ × continuous HC margin gates:
 *       G_HC_DOM    HC_for ≥ 1 ∧ HC_ag = 0      [current production]
 *       G_HC_M1     (HC_for − HC_ag) ≥ +1       (allows 2-1, 3-2)
 *       G_HC_M2     (HC_for − HC_ag) ≥ +2       (allows 3-1, 2-0)
 *       G_HC_M3     (HC_for − HC_ag) ≥ +3
 *       G_HC2_DOM   HC_for ≥ 2 ∧ HC_ag = 0      (count > 1)
 *       G_HC3_DOM   HC_for ≥ 3 ∧ HC_ag = 0
 *   §3. WITHIN HC-dominant cohort (hcA=0): does hcF count add lift?
 *   §4. WITHIN hcF≥1 cohort: how does dissent (hcA = 0/1/2+) change WR/ROI?
 *   §5. Margin-tier fineness — per-Σ × HC margin tier {≤0, +1, +2, +3+}
 *   §6. Verdict — does HC margin scale, beat binary, or add nothing?
 *
 * Output: WALLET_HC_MARGIN_ANALYSIS.md
 *
 * Lens: point-in-time tiers (L2). Same loader as walletGateScaleTest.js.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(REPO_ROOT, 'serviceAccountKey.json');
  if (existsSync(sakPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sakPath, 'utf8'))) });
  } else {
    admin.initializeApp({ credential: admin.credential.cert({
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }) });
  }
}
const db = admin.firestore();

const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct  = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';

function normCdf(z) {
  if (!Number.isFinite(z)) return 0.5;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
function twoPropZ(winsIn, nIn, winsOut, nOut) {
  if (nIn < 2 || nOut < 2) return { z: null, p: null };
  const pIn = winsIn / nIn, pOut = winsOut / nOut;
  const pPool = (winsIn + winsOut) / (nIn + nOut);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nIn + 1 / nOut));
  if (se === 0 || !Number.isFinite(se)) return { z: null, p: null };
  const z = (pIn - pOut) / se;
  return { z, p: 2 * (1 - normCdf(Math.abs(z))) };
}

// ─────────────────────────────────────────────────────────────────────
// Tier timeline (mirrors walletGateScaleTest.js)
// ─────────────────────────────────────────────────────────────────────
async function buildTierTimeline() {
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  profSnap.forEach(doc => profiles.set(doc.id, doc.data()));
  const walletKeyToFull = new Map();
  for (const [key, p] of profiles) {
    const full = p.walletAddress || null;
    if (full) {
      walletKeyToFull.set(key, full);
      walletKeyToFull.set(full.slice(-6), full);
      walletKeyToFull.set(full.slice(0, 6), full);
    } else walletKeyToFull.set(key, key);
  }

  const aBets = [];
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK', date = d.date, sides = d.sides || {};
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;
      const seen = new Set();
      const peakOddsBySide = new Map();
      for (const [sk, sd] of Object.entries(sides)) {
        peakOddsBySide.set(sk, sd?.peak?.peakOdds ?? sd?.lock?.lockOdds ?? sd?.peak?.odds ?? sd?.lock?.odds ?? 0);
      }
      for (const [, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          const dedupe = `${doc.id}_${w.wallet}`;
          if (seen.has(dedupe)) continue;
          seen.add(dedupe);
          aBets.push({ date, sport, wallet: w.wallet, won: w.side === winningSide ? 1 : 0, odds: peakOddsBySide.get(w.side) ?? 0 });
        }
      }
    }
  }

  const bSnap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const bBets = [];
  bSnap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    if (invested <= 0) return;
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    bBets.push({ date: d.date, sport: d.sport, walletShort, invested, settledPnl });
  });

  const events = [];
  for (const b of aBets) {
    const canonical = walletKeyToFull.get(b.wallet) || b.wallet;
    events.push({ date: b.date, sport: b.sport, canonical, source: 'A', payload: b });
  }
  for (const b of bBets) {
    const canonical = walletKeyToFull.get(b.walletShort) || b.walletShort;
    events.push({ date: b.date, sport: b.sport, canonical, source: 'B', payload: b });
  }
  events.sort((x, y) => (x.date || '').localeCompare(y.date || ''));

  const stat = new Map();
  const getStat = (c, s) => {
    const k = `${c}|${s}`;
    let st = stat.get(k);
    if (!st) { st = { aN: 0, aWins: 0, aFlatPnl: 0, bN: 0, bInvested: 0, bPnl: 0, firstWR50: null, firstFlat: null, firstConfirmed: null }; stat.set(k, st); }
    return st;
  };
  for (const e of events) {
    if (!e.sport || !e.canonical) continue;
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') { s.aN++; s.aWins += e.payload.won; s.aFlatPnl += flatProfit(e.payload.odds, e.payload.won === 1); }
    else { s.bN++; s.bInvested += e.payload.invested; s.bPnl += e.payload.settledPnl; }
    const aMet  = s.aN >= MIN_BETS && s.aFlatPnl > 0;
    const aWr50 = s.aN >= MIN_BETS && s.aWins / s.aN >= 0.5;
    const bMet  = s.bN >= MIN_BETS && s.bInvested > 0 && (s.bPnl / s.bInvested) > 0;
    if (aMet && bMet && !s.firstConfirmed) s.firstConfirmed = e.date;
    if (aMet         && !s.firstFlat)      s.firstFlat      = e.date;
    if (aWr50        && !s.firstWR50)      s.firstWR50      = e.date;
  }
  function tierAsOf(canonical, sport, date) {
    const k = `${canonical}|${sport}`;
    const s = stat.get(k);
    if (!s) return null;
    if (s.firstConfirmed && s.firstConfirmed <= date) return 'CONFIRMED';
    if (s.firstFlat      && s.firstFlat      <= date) return 'FLAT';
    if (s.firstWR50      && s.firstWR50      <= date) return 'WR50';
    return null;
  }
  return { tierAsOf, walletKeyToFull };
}

function aggregateTier(walletDetails, sideKey, sport, date, lensFn) {
  const out = { confFor: 0, confAg: 0, flatFor: 0, flatAg: 0, hcConfFor: 0, hcConfAg: 0, qFor: 0, qAg: 0, forW: 0, agW: 0 };
  if (!Array.isArray(walletDetails) || !sideKey) return out;
  for (const w of walletDetails) {
    if (!w?.side || !w?.wallet) continue;
    const isFor = w.side === sideKey;
    const tier = lensFn(w.wallet, sport, date);
    const sizeRatio = Number(w.sizeRatio ?? 0);
    const hc = sizeRatio >= HC_RATIO;
    if (tier === 'CONFIRMED') { if (isFor) { out.confFor++; if (hc) out.hcConfFor++; } else { out.confAg++; if (hc) out.hcConfAg++; } }
    else if (tier === 'FLAT') { if (isFor) out.flatFor++; else out.flatAg++; }
    if (tier === 'CONFIRMED' || tier === 'FLAT') { if (isFor) out.forW++; else out.agW++; }
    if ((Number(w.contribution) || 0) >= QUALITY_CUT) { if (isFor) out.qFor++; else out.qAg++; }
  }
  out.dwLegacy = out.forW - out.agW;
  out.dwConf   = out.confFor - out.confAg;
  out.dq       = out.qFor - out.qAg;
  out.hcMargin = out.hcConfFor - out.hcConfAg;
  return out;
}

async function loadShippedPicks(lensFn) {
  const rows = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK', date = d.date;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        if (side.lockStage === 'SHADOW') continue;
        const peak = side.peak || side.lock || {};
        if ((peak?.stars ?? 0) < 2.5) continue;
        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;
        const t = aggregateTier(wd, sideKey, sport, date, lensFn);
        const dw = t.dwLegacy, dq = t.dq;
        if (dw < 1 || dq < 1) continue;
        const flat = odds != null ? flatProfit(odds, won === 1) : 0;
        rows.push({ date, sport, market, sideKey, docId: doc.id, dw, dq, sum: dw + dq, ...t, odds, won, flat });
      }
    }
  }
  return rows;
}

const sigmaBucket = (s) => s <= 2 ? 'Σ=2' : s === 3 ? 'Σ=3' : s === 4 ? 'Σ=4' : s === 5 ? 'Σ=5' : s === 6 ? 'Σ=6' : 'Σ≥7';
const SIGMA_ORDER = ['Σ=2', 'Σ=3', 'Σ=4', 'Σ=5', 'Σ=6', 'Σ≥7'];

function summarize(rows) {
  if (!rows.length) return { n: 0, wins: 0, losses: 0, wr: null, flatRoi: null, flatPnl: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const flatPnl = rows.reduce((s, r) => s + r.flat, 0);
  return { n: rows.length, wins, losses: rows.length - wins, wr: wins / rows.length * 100, flatRoi: (flatPnl / rows.length) * 100, flatPnl };
}

// ─── HC gates being tested ─────────────────────────────────────────
const HC_GATES = [
  ['G_HC_DOM',   'HC_for ≥ 1 ∧ HC_ag = 0   [PRODUCTION v7.1]', r => r.hcConfFor >= 1 && r.hcConfAg === 0],
  ['G_HC_M1',    'HC margin ≥ +1 (allows dissent)',             r => r.hcMargin >= 1],
  ['G_HC_M2',    'HC margin ≥ +2',                              r => r.hcMargin >= 2],
  ['G_HC_M3',    'HC margin ≥ +3',                              r => r.hcMargin >= 3],
  ['G_HC2_DOM',  'HC_for ≥ 2 ∧ HC_ag = 0   (count tier)',       r => r.hcConfFor >= 2 && r.hcConfAg === 0],
  ['G_HC3_DOM',  'HC_for ≥ 3 ∧ HC_ag = 0',                      r => r.hcConfFor >= 3 && r.hcConfAg === 0],
  ['G_HC_TOL1',  'HC_for ≥ 1 ∧ HC_ag ≤ 1   (1 dissent OK)',     r => r.hcConfFor >= 1 && r.hcConfAg <= 1],
  ['G_HC_TOL_M', 'HC_for ≥ 2 ∧ HC margin ≥ +1',                 r => r.hcConfFor >= 2 && r.hcMargin >= 1],
];

(async () => {
  console.log('[1/3] Building point-in-time tier timeline…');
  const { tierAsOf, walletKeyToFull } = await buildTierTimeline();
  const lens = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };
  console.log('[2/3] Loading shipped picks (Δw≥+1, Δq≥+1)…');
  const all = await loadShippedPicks(lens);
  const dates = [...new Set(all.map(r => r.date))].sort();
  console.log(`      ${all.length} picks · ${dates.length} days · ${dates[0]} → ${dates[dates.length - 1]}`);

  console.log('[3/3] Running HC margin analysis…');
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# WALLET HC MARGIN ANALYSIS — does HC margin matter, or is binary dominance the whole signal?');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} picks · ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} days)`);
  out.push('');
  out.push('**The question we missed in v7.1.** The original `WALLET_GATE_SCALE_TEST` proved binary HC dominance (`HC_for ≥ 1 ∧ HC_ag = 0`) scales across all 5 Σ buckets. We never tested whether HC **margin** (`HC_for − HC_ag`) carries additional signal — i.e. is `HC 3-1` better than `HC 1-0`? Does `HC 5-0` outperform `HC 1-0`?');
  out.push('');
  out.push('**Lens.** Point-in-time CONFIRMED/FLAT/WR50 tiers (L2, validated). HC = CONFIRMED ∧ sizeRatio ≥ 1.5×.');
  out.push('');
  out.push('**Sample.** Every shipped side since v6 cutover with `Δw ≥ +1 ∧ Δq ≥ +1`.');
  out.push('');

  // ─── §0. THE HEADLINE TEST ─────────────────────────────────────
  out.push('---');
  out.push('## §0. THE HEADLINE TEST — does HC_margin scale across every Σ tier the same way Δw+Δq does?');
  out.push('');
  out.push('We treat HC_margin (`HC_for − HC_ag`) like a continuous quality dial — exactly the way Σ is a continuous quality dial — and ask:');
  out.push('1. **At each Σ tier**, does upgrading from HC_margin ≤0 to HC_margin ≥+1 unilaterally improve WR/ROI?');
  out.push('2. At each Σ tier, does upgrading from HC_margin ≤+1 to HC_margin ≥+2 further improve WR/ROI?');
  out.push('3. Should HC_margin alone (without high Σ) be enough to promote a pick?');
  out.push('');
  out.push('### Test 1: HC_margin ≥+1 vs ≤0 at each Σ tier');
  out.push('');
  out.push('| Σ | HC_m ≤0 (n / WR / ROI) | HC_m ≥+1 (n / WR / ROI) | Lift_WR | Lift_ROI | z-test p |');
  out.push('|---|---|---|---|---|---|');
  let pos1 = 0, evald1 = 0, pooledLW1 = 0, pooledLR1 = 0, pooledN1 = 0;
  for (const sb of SIGMA_ORDER) {
    const rows = all.filter(r => sigmaBucket(r.sum) === sb);
    const lo  = rows.filter(r => r.hcMargin <= 0);
    const hi  = rows.filter(r => r.hcMargin >= 1);
    const sLo = summarize(lo), sHi = summarize(hi);
    const lW = (sLo.wr != null && sHi.wr != null) ? sHi.wr - sLo.wr : null;
    const lR = (sLo.flatRoi != null && sHi.flatRoi != null) ? sHi.flatRoi - sLo.flatRoi : null;
    const z = twoPropZ(sHi.wins, sHi.n, sLo.wins, sLo.n);
    if (lW != null && sLo.n >= 2 && sHi.n >= 2) { evald1++; if (lW > 0) pos1++; pooledLW1 += lW * sHi.n; pooledLR1 += (lR ?? 0) * sHi.n; pooledN1 += sHi.n; }
    const loFmt = sLo.n ? `${sLo.n} / ${pct(sLo.wr)} / ${sign(sLo.flatRoi, 1)}%` : 'n=0';
    const hiFmt = sHi.n ? `${sHi.n} / ${pct(sHi.wr)} / ${sign(sHi.flatRoi, 1)}%` : 'n=0';
    out.push(`| ${sb} | ${loFmt} | ${hiFmt} | ${lW != null ? sign(lW, 1) : '—'} | ${lR != null ? sign(lR, 1) + '%' : '—'} | ${z.p != null ? z.p.toFixed(3) : '—'} |`);
  }
  const avgLW1 = pooledN1 ? pooledLW1 / pooledN1 : null;
  const avgLR1 = pooledN1 ? pooledLR1 / pooledN1 : null;
  out.push(`| **Pooled** | weighted | | **${sign(avgLW1, 1)} pp** | **${sign(avgLR1, 1)}%** | (positive in **${pos1}/${evald1}** comparable buckets) |`);
  out.push('');
  out.push('### Test 2: HC_margin ≥+2 vs ≤+1 at each Σ tier');
  out.push('');
  out.push('| Σ | HC_m ≤+1 (n / WR / ROI) | HC_m ≥+2 (n / WR / ROI) | Lift_WR | Lift_ROI | z-test p |');
  out.push('|---|---|---|---|---|---|');
  let pos2 = 0, evald2 = 0, pooledLW2 = 0, pooledLR2 = 0, pooledN2 = 0;
  for (const sb of SIGMA_ORDER) {
    const rows = all.filter(r => sigmaBucket(r.sum) === sb);
    const lo  = rows.filter(r => r.hcMargin <= 1);
    const hi  = rows.filter(r => r.hcMargin >= 2);
    const sLo = summarize(lo), sHi = summarize(hi);
    const lW = (sLo.wr != null && sHi.wr != null) ? sHi.wr - sLo.wr : null;
    const lR = (sLo.flatRoi != null && sHi.flatRoi != null) ? sHi.flatRoi - sLo.flatRoi : null;
    const z = twoPropZ(sHi.wins, sHi.n, sLo.wins, sLo.n);
    if (lW != null && sLo.n >= 2 && sHi.n >= 2) { evald2++; if (lW > 0) pos2++; pooledLW2 += lW * sHi.n; pooledLR2 += (lR ?? 0) * sHi.n; pooledN2 += sHi.n; }
    const loFmt = sLo.n ? `${sLo.n} / ${pct(sLo.wr)} / ${sign(sLo.flatRoi, 1)}%` : 'n=0';
    const hiFmt = sHi.n ? `${sHi.n} / ${pct(sHi.wr)} / ${sign(sHi.flatRoi, 1)}%` : 'n=0';
    out.push(`| ${sb} | ${loFmt} | ${hiFmt} | ${lW != null ? sign(lW, 1) : '—'} | ${lR != null ? sign(lR, 1) + '%' : '—'} | ${z.p != null ? z.p.toFixed(3) : '—'} |`);
  }
  const avgLW2 = pooledN2 ? pooledLW2 / pooledN2 : null;
  const avgLR2 = pooledN2 ? pooledLR2 / pooledN2 : null;
  out.push(`| **Pooled** | weighted | | **${sign(avgLW2, 1)} pp** | **${sign(avgLR2, 1)}%** | (positive in **${pos2}/${evald2}** comparable buckets) |`);
  out.push('');
  out.push('### Test 3: HC_margin "rescue test" — can HC_margin alone promote low-Σ picks?');
  out.push('');
  out.push('For each Σ tier, what happens to picks WITH HC_margin ≥+1? Do they cross the ship threshold (WR ≥ 55% AND ROI ≥ 0%)?');
  out.push('This tells us if HC_margin can act as a Σ-floor-bypass — i.e. should Σ=2 picks ship if they have HC dominance?');
  out.push('');
  out.push('| Σ | HC_m ≥+1 (n / WR / ROI / net) | Ships? | Notes |');
  out.push('|---|---|---|---|');
  for (const sb of SIGMA_ORDER) {
    const rows = all.filter(r => sigmaBucket(r.sum) === sb && r.hcMargin >= 1);
    const s = summarize(rows);
    const ships = s.n >= 3 && (s.wr ?? 0) >= 55 && (s.flatRoi ?? 0) >= 0;
    const note = s.n === 0 ? 'no picks' : s.n < 3 ? 'sample too small' : ships ? 'meets ship threshold' : 'fails ship threshold';
    out.push(`| ${sb} | ${s.n ? `${s.n} / ${pct(s.wr)} / ${sign(s.flatRoi, 1)}% / ${sign(s.flatPnl, 2)}u` : 'n=0'} | ${ships ? '**YES**' : 'no'} | ${note} |`);
  }
  out.push('');

  // ─── §1. (HC_for, HC_ag) inventory ─────────────────────────────
  out.push('---');
  out.push('## §1. (HC_for, HC_ag) cell inventory');
  out.push('');
  out.push('How often does each HC combination occur in the live sample? Cells with N < 5 are noise.');
  out.push('');
  const maxF = Math.min(5, Math.max(0, ...all.map(r => r.hcConfFor)));
  const maxA = Math.min(5, Math.max(0, ...all.map(r => r.hcConfAg)));
  const headerRow = ['HC_for ↓ \\ HC_ag →', ...Array.from({length: maxA + 1}, (_, i) => i.toString()), '≥' + (maxA + 1)];
  out.push('| ' + headerRow.join(' | ') + ' |');
  out.push('|' + headerRow.map(() => '---').join('|') + '|');
  for (let f = 0; f <= maxF; f++) {
    const cells = [`**${f}**`];
    for (let a = 0; a <= maxA; a++) {
      const rs = all.filter(r => r.hcConfFor === f && r.hcConfAg === a);
      const s = summarize(rs);
      cells.push(s.n ? `N=${s.n}<br>${pct(s.wr, 0)} ${sign(s.flatRoi, 0)}%` : '—');
    }
    const rsHi = all.filter(r => r.hcConfFor === f && r.hcConfAg > maxA);
    cells.push(rsHi.length ? `N=${rsHi.length}` : '—');
    out.push('| ' + cells.join(' | ') + ' |');
  }
  const rsHiF = all.filter(r => r.hcConfFor > maxF);
  if (rsHiF.length) {
    const s = summarize(rsHiF);
    out.push(`| **≥${maxF + 1}** | N=${s.n} (${pct(s.wr, 0)} ${sign(s.flatRoi, 0)}%) | | | | | |`);
  }
  out.push('');

  // ─── §2. Per-Σ × per-HC-gate matrix ────────────────────────────
  out.push('---');
  out.push('## §2. Per-Σ × per-HC-gate lift matrix');
  out.push('');
  out.push('Same methodology as `WALLET_GATE_SCALE_TEST.md` §2. For each gate, we ask: inside each Σ bucket, do IN-gate picks beat OUT-gate picks?');
  out.push('A gate that scales lifts in **all 5** Σ buckets. The current production gate (`G_HC_DOM`) is row 1 — anything else needs to **beat** that row to justify replacing it.');
  out.push('');
  for (const [gid, desc, fn] of HC_GATES) {
    out.push(`### \`${gid}\` — ${desc}`);
    out.push('');
    out.push('| Σ | N tot | IN (n / WR / ROI) | OUT (n / WR / ROI) | Lift_WR (pp) | Lift_ROI (pp) | z-test p |');
    out.push('|---|---|---|---|---|---|---|');
    let positive = 0, evald = 0, pooledLW = 0, pooledLR = 0, pooledN = 0;
    for (const sb of SIGMA_ORDER) {
      const rows = all.filter(r => sigmaBucket(r.sum) === sb);
      const inR = rows.filter(fn), outR = rows.filter(r => !fn(r));
      const sIn = summarize(inR), sOut = summarize(outR);
      const lW = (sIn.wr != null && sOut.wr != null) ? sIn.wr - sOut.wr : null;
      const lR = (sIn.flatRoi != null && sOut.flatRoi != null) ? sIn.flatRoi - sOut.flatRoi : null;
      const z = twoPropZ(sIn.wins, sIn.n, sOut.wins, sOut.n);
      if (lW != null && sIn.n >= 2 && sOut.n >= 2) {
        evald++;
        if (lW > 0) positive++;
        pooledLW += lW * sIn.n;
        pooledLR += (lR ?? 0) * sIn.n;
        pooledN += sIn.n;
      }
      const inFmt  = sIn.n  ? `${sIn.n} / ${pct(sIn.wr)} / ${sign(sIn.flatRoi, 1)}%`   : 'n=0';
      const outFmt = sOut.n ? `${sOut.n} / ${pct(sOut.wr)} / ${sign(sOut.flatRoi, 1)}%` : 'n=0';
      out.push(`| ${sb} | ${rows.length} | ${inFmt} | ${outFmt} | ${lW != null ? sign(lW, 1) : '—'} | ${lR != null ? sign(lR, 1) + '%' : '—'} | ${z.p != null ? z.p.toFixed(3) : '—'} |`);
    }
    const avgLW = pooledN ? pooledLW / pooledN : null;
    const avgLR = pooledN ? pooledLR / pooledN : null;
    out.push(`| **Pooled** | **${all.length}** | weighted | | **${sign(avgLW, 1)} pp** | **${sign(avgLR, 1)}%** | (positive in **${positive}/${evald}**) |`);
    out.push('');
  }

  // ─── §3. Within HC-dominant cohort: does count matter? ─────────
  out.push('---');
  out.push('## §3. Within HC-dominant cohort (HC_ag = 0): does HC_for COUNT add lift?');
  out.push('');
  out.push('Subset to picks already passing the production gate (HC_for ≥ 1 ∧ HC_ag = 0). Compare WR/ROI by HC_for tier.');
  out.push('If higher HC_for buckets beat HC_for=1, count matters. If WR/ROI is flat across, count is noise inside the dominance cohort.');
  out.push('');
  const dominant = all.filter(r => r.hcConfFor >= 1 && r.hcConfAg === 0);
  out.push(`HC-dominant cohort total: **N=${dominant.length}**`);
  out.push('');
  out.push('| HC_for | N | W-L | WR | flat ROI | net flat |');
  out.push('|---|---|---|---|---|---|');
  for (const f of [1, 2, 3]) {
    const rs = f < 3 ? dominant.filter(r => r.hcConfFor === f) : dominant.filter(r => r.hcConfFor >= 3);
    const s = summarize(rs);
    out.push(`| ${f === 3 ? '≥3' : f} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u |`);
  }
  out.push('');
  // Direct comparison: HC_for=1 vs HC_for≥2 within dominant cohort
  const hcF1 = dominant.filter(r => r.hcConfFor === 1);
  const hcF2plus = dominant.filter(r => r.hcConfFor >= 2);
  const sHcF1 = summarize(hcF1), sHcF2p = summarize(hcF2plus);
  const zF = twoPropZ(sHcF2p.wins, sHcF2p.n, sHcF1.wins, sHcF1.n);
  out.push(`**HC_for=1 vs HC_for≥2 (both dominant):** WR diff = ${sign((sHcF2p.wr ?? 0) - (sHcF1.wr ?? 0), 1)} pp · ROI diff = ${sign((sHcF2p.flatRoi ?? 0) - (sHcF1.flatRoi ?? 0), 1)}% · z-test p = ${zF.p != null ? zF.p.toFixed(3) : '—'}`);
  out.push('');

  // ─── §4. Within hcF≥1 cohort: does dissent (hcA) hurt? ─────────
  out.push('---');
  out.push('## §4. Within HC_for ≥ 1: how much does dissent (HC_ag) hurt?');
  out.push('');
  out.push('Subset to picks with at least one HC backer (HC_for ≥ 1). Compare by HC_ag tier.');
  out.push('Key question: is `HC 2-1` (some dissent) genuinely worse than `HC 1-0` (no dissent), or is the binary "dominance" rule more stringent than the data demands?');
  out.push('');
  const hasHc = all.filter(r => r.hcConfFor >= 1);
  out.push(`HC_for ≥ 1 cohort total: **N=${hasHc.length}**`);
  out.push('');
  out.push('| HC_ag | N | W-L | WR | flat ROI | net flat |');
  out.push('|---|---|---|---|---|---|');
  for (const a of [0, 1, 2]) {
    const rs = a < 2 ? hasHc.filter(r => r.hcConfAg === a) : hasHc.filter(r => r.hcConfAg >= 2);
    const s = summarize(rs);
    out.push(`| ${a === 2 ? '≥2' : a} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u |`);
  }
  out.push('');
  const hcA0 = hasHc.filter(r => r.hcConfAg === 0);
  const hcA1plus = hasHc.filter(r => r.hcConfAg >= 1);
  const sA0 = summarize(hcA0), sA1p = summarize(hcA1plus);
  const zA = twoPropZ(sA0.wins, sA0.n, sA1p.wins, sA1p.n);
  out.push(`**HC_ag=0 vs HC_ag≥1 (both have ≥1 HC for):** WR diff = ${sign((sA0.wr ?? 0) - (sA1p.wr ?? 0), 1)} pp · ROI diff = ${sign((sA0.flatRoi ?? 0) - (sA1p.flatRoi ?? 0), 1)}% · z-test p = ${zA.p != null ? zA.p.toFixed(3) : '—'}`);
  out.push('');

  // ─── §5. Per-Σ × HC margin tier (continuous) ───────────────────
  out.push('---');
  out.push('## §5. Per-Σ × HC margin tier');
  out.push('');
  out.push('Buckets: HC_margin ∈ {≤0, +1, +2, ≥+3}. Does the lift gradient track the margin gradient, or is +1 already the whole signal?');
  out.push('');
  const marginTiers = [
    ['≤0',  r => r.hcMargin <= 0],
    ['+1',  r => r.hcMargin === 1],
    ['+2',  r => r.hcMargin === 2],
    ['≥+3', r => r.hcMargin >= 3],
  ];
  out.push('| Σ | bucket | N | W-L | WR | flat ROI | net flat |');
  out.push('|---|---|---|---|---|---|---|');
  for (const sb of SIGMA_ORDER) {
    const rows = all.filter(r => sigmaBucket(r.sum) === sb);
    for (const [label, pred] of marginTiers) {
      const s = summarize(rows.filter(pred));
      if (!s.n) { out.push(`| ${sb} | ${label} | 0 | — | — | — | — |`); continue; }
      out.push(`| ${sb} | ${label} | ${s.n} | ${s.wins}-${s.losses} | ${pct(s.wr)} | ${sign(s.flatRoi, 1)}% | ${sign(s.flatPnl, 2)}u |`);
    }
  }
  out.push('');

  // ─── §6. Verdict ───────────────────────────────────────────────
  out.push('---');
  out.push('## §6. Verdict');
  out.push('');
  out.push('**Decision rule.** A gate replaces production (`G_HC_DOM`) only if it scales (positive in 4+/5 Σ buckets) AND its pooled lift_WR / lift_ROI exceeds production by a meaningful margin.');
  out.push('');
  out.push('**Read §2 column "Pooled positive in X/Y".** For each gate:');
  out.push('- 5/5 with bigger pooled lift than `G_HC_DOM` → **graduate**: replace production');
  out.push('- 5/5 with similar pooled lift → **redundant**: production is already capturing the signal');
  out.push('- ≤3/5 → **noise**: don\'t adopt');
  out.push('');
  out.push('**Read §3.** If HC_for=1 vs HC_for≥2 z-test p < 0.10 AND HC_for≥2 has higher WR/ROI, count matters — consider a tiered HC sizing curve (e.g. ×1.5 for HC_for=1, ×1.75 for HC_for≥2).');
  out.push('');
  out.push('**Read §4.** If HC_ag=0 vs HC_ag≥1 z-test p > 0.20 OR the WR diff is small, the strict "no dissent" rule is over-tight — consider relaxing to `HC margin ≥ +1` to recover more sample.');
  out.push('');
  out.push('**Read §5.** If WR/ROI shows monotonic gradient with margin, build a continuous sizing curve. If it\'s flat or noisy past +1, binary is the right call.');
  out.push('');

  const md = out.join('\n');
  const outPath = join(REPO_ROOT, 'WALLET_HC_MARGIN_ANALYSIS.md');
  writeFileSync(outPath, md);
  console.log(`      Wrote ${outPath}`);
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
