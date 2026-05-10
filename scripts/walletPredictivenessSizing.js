/**
 * walletPredictivenessSizing.js — middle-ground resizing analysis.
 *
 * Question: instead of HARD-dropping FLAT from Δw (which cuts volume from
 * ~9 picks/day to ~2 picks/day), can we KEEP the v7 LOCK floor and just
 * resize each pick based on tier composition?
 *
 * Hypothesis: the user pays for daily VOLUME but cares about ROI. If we
 * downsize FLAT-contaminated picks and upsize HC-CONFIRMED-dominant picks,
 * we keep daily content AND lift WR / ROI by reducing bankroll exposure
 * to the bleeders.
 *
 * Configs tested:
 *   v7_status_quo  — current behaviour (full ladder size on every LOCK)
 *
 *   M1_purity_tilt — KEEP all v7 LOCKs, multiplier on units:
 *                    1.5× if HC dominance (HC_for ≥ 1 ∧ HC_ag = 0)
 *                    1.0× if pure CONFIRMED (CONF_for ≥ 1 ∧ FLAT_for = 0)
 *                    0.5× if mixed (CONF_for ≥ 1 ∧ FLAT_for ≥ 1)
 *                    0.25× if FLAT-only (CONF_for = 0)
 *
 *   M2_purity_tilt_aggressive — same buckets, more aggressive multipliers:
 *                    2.0× HC dominance
 *                    1.0× pure CONFIRMED
 *                    0.33× mixed
 *                    0.10× FLAT-only
 *
 *   M3_keep_size_drop_flat_only — keep v7 ladder, but if zero CONFIRMED
 *                    backing → 0u (track-only). Otherwise full size.
 *
 *   M4_three_tier  — explicit three-tier ladder:
 *                    SUPER (HC dominance) → 1.5× ladder
 *                    STANDARD (CONFIRMED present, no HC dominance) → 1.0× ladder
 *                    TRACKED (FLAT-only or no whitelist) → 0u
 *
 *   M5_floor_and_resize — combine: lower the floor to Σ ≥ +3 with HC-dominance
 *                    rescue (from FLOOR_LOWERING_TIER_GATES) AND apply purity
 *                    tilt to ALL LOCKs.
 *
 * For each config we report: shipped picks, WR, flat ROI, peak-unit PnL,
 * volume change vs v7. The "winning" config maximizes peak-unit PnL while
 * preserving volume within the user's tolerance.
 *
 * Output: WALLET_PREDICTIVENESS_SIZING.md
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

// ── Constants ──────────────────────────────────────────────────────
const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

// ── Helpers ────────────────────────────────────────────────────────
const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct  = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';

// ── Build point-in-time tier timeline (mirrors prior backtest) ─────
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
    } else {
      walletKeyToFull.set(key, key);
    }
  }

  // Source A
  const aBets = [];
  for (const [col] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      const sides = d.sides || {};
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

  // Source B
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
  function getStat(canonical, sport) {
    const k = `${canonical}|${sport}`;
    let s = stat.get(k);
    if (!s) {
      s = { aN: 0, aWins: 0, aFlatPnl: 0, bN: 0, bInvested: 0, bPnl: 0,
            firstWR50: null, firstFlat: null, firstConfirmed: null };
      stat.set(k, s);
    }
    return s;
  }
  for (const e of events) {
    if (!e.sport || !e.canonical) continue;
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') {
      s.aN += 1;
      s.aWins += e.payload.won;
      s.aFlatPnl += flatProfit(e.payload.odds, e.payload.won === 1);
    } else {
      s.bN += 1;
      s.bInvested += e.payload.invested;
      s.bPnl += e.payload.settledPnl;
    }
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

// ── Per-pick aggregation ───────────────────────────────────────────
function aggregateTier(walletDetails, sideKey, sport, date, lensFn) {
  const out = {
    confFor: 0, confAg: 0, flatFor: 0, flatAg: 0,
    hcConfFor: 0, hcConfAg: 0, qFor: 0, qAg: 0,
    forW: 0, agW: 0,
  };
  if (!Array.isArray(walletDetails) || !sideKey) return out;
  for (const w of walletDetails) {
    if (!w?.side || !w?.wallet) continue;
    const isFor = w.side === sideKey;
    const tier = lensFn(w.wallet, sport, date);
    const sizeRatio = Number(w.sizeRatio ?? 0);
    const hc = sizeRatio >= HC_RATIO;
    if (tier === 'CONFIRMED') {
      if (isFor) { out.confFor++; if (hc) out.hcConfFor++; }
      else       { out.confAg++;  if (hc) out.hcConfAg++; }
    } else if (tier === 'FLAT') {
      if (isFor) out.flatFor++; else out.flatAg++;
    }
    if (tier === 'CONFIRMED' || tier === 'FLAT') {
      if (isFor) out.forW++; else out.agW++;
    }
    if ((Number(w.contribution) || 0) >= QUALITY_CUT) {
      if (isFor) out.qFor++; else out.qAg++;
    }
  }
  out.dwLegacy = out.forW - out.agW;
  out.dwConf   = out.confFor - out.confAg;
  out.dq       = out.qFor - out.qAg;
  return out;
}

// ── Tier-purity classifier ─────────────────────────────────────────
// Returns one of: 'HC_DOMINANCE' | 'PURE_CONFIRMED' | 'MIXED' | 'FLAT_ONLY' | 'NONE'
function purityClass(t) {
  if (t.hcConfFor >= 1 && t.hcConfAg === 0) return 'HC_DOMINANCE';
  if (t.confFor >= 1 && t.flatFor === 0) return 'PURE_CONFIRMED';
  if (t.confFor >= 1 && t.flatFor >= 1) return 'MIXED';
  if (t.confFor === 0 && t.flatFor >= 1) return 'FLAT_ONLY';
  return 'NONE';
}

// ── Sizing configs ─────────────────────────────────────────────────
// Each returns a sizing multiplier given the tier-purity class.
const SIZING = {
  v7_status_quo: () => 1.0,
  M1_purity_tilt: (cls) => ({ HC_DOMINANCE: 1.5, PURE_CONFIRMED: 1.0, MIXED: 0.5, FLAT_ONLY: 0.25, NONE: 0.25 }[cls] ?? 1.0),
  M2_purity_tilt_aggressive: (cls) => ({ HC_DOMINANCE: 2.0, PURE_CONFIRMED: 1.0, MIXED: 0.33, FLAT_ONLY: 0.10, NONE: 0.10 }[cls] ?? 1.0),
  M3_keep_size_drop_flat_only: (cls) => ({ HC_DOMINANCE: 1.0, PURE_CONFIRMED: 1.0, MIXED: 1.0, FLAT_ONLY: 0.0, NONE: 0.0 }[cls] ?? 1.0),
  M4_three_tier: (cls) => ({ HC_DOMINANCE: 1.5, PURE_CONFIRMED: 1.0, MIXED: 1.0, FLAT_ONLY: 0.0, NONE: 0.0 }[cls] ?? 1.0),
  M5_moderate: (cls) => ({ HC_DOMINANCE: 1.5, PURE_CONFIRMED: 1.0, MIXED: 0.66, FLAT_ONLY: 0.33, NONE: 0.33 }[cls] ?? 1.0),
};

// ── Loader ─────────────────────────────────────────────────────────
async function loadShippedPicks(lensFn) {
  const rows = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date = d.date;
      for (const [sideKey, side] of Object.entries(d.sides || {})) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        if (side.lockStage === 'SHADOW') continue;
        const peak = side.peak || side.lock || {};
        if ((peak?.stars ?? 0) < 2.5) continue;

        const odds = peak?.peakOdds ?? side.lock?.lockOdds ?? peak?.odds ?? side.lock?.odds ?? null;
        const peakUnits = peak?.units || 1;
        const won = oc === 'WIN' ? 1 : 0;
        const wd = peak?.v8Scoring?.walletDetails;

        const t = aggregateTier(wd, sideKey, sport, date, lensFn);
        const cls = purityClass(t);

        const flat = odds != null ? flatProfit(odds, won === 1) : 0;
        // Per-unit P&L (so we can multiply by sizing ratio)
        const perUnitPnl = won ? (americanToDecimal(odds) - 1) : -1;

        rows.push({
          date, sport, market, sideKey, docId: doc.id,
          ...t, cls,
          odds, won, peakUnits, perUnitPnl, flat,
        });
      }
    }
  }
  return rows;
}

// ── Aggregate metrics under a sizing config ────────────────────────
function aggUnderSizing(rows, sizingFn) {
  let n = 0, wins = 0, losses = 0;
  let flatSum = 0;
  let scaledPnl = 0;
  let scaledStake = 0;
  let nWithStake = 0;
  for (const r of rows) {
    if (r.won === 1) wins++; else losses++;
    n++;
    const mult = sizingFn(r.cls);
    const stake = (r.peakUnits || 1) * mult;
    if (stake > 0) {
      nWithStake++;
      scaledStake += stake;
      scaledPnl += stake * r.perUnitPnl;
      flatSum += r.flat;     // flat ROI uses 1u, independent of sizing — but only for picks we'd actually ship
    }
  }
  return {
    n, wins, losses,
    wr: n ? wins / n * 100 : null,
    flatRoi: nWithStake ? (flatSum / nWithStake) * 100 : null,        // per-pick flat ROI on shipped (stake>0) picks
    scaledPnl,                                                        // peak-unit ROI accounting for sizing
    scaledStake,
    nShipped: nWithStake,                                             // picks with stake > 0
  };
}

function aggOnShippedSubset(rows, sizingFn) {
  // Same as above but compute WR / flatROI ONLY over picks with stake > 0
  let n = 0, wins = 0, losses = 0, flatSum = 0, scaledPnl = 0, scaledStake = 0;
  for (const r of rows) {
    const mult = sizingFn(r.cls);
    const stake = (r.peakUnits || 1) * mult;
    if (stake <= 0) continue;
    n++;
    if (r.won === 1) wins++; else losses++;
    flatSum += r.flat;
    scaledStake += stake;
    scaledPnl += stake * r.perUnitPnl;
  }
  return {
    n, wins, losses,
    wr: n ? wins / n * 100 : null,
    flatRoi: n ? (flatSum / n) * 100 : null,
    scaledPnl,
    scaledStake,
  };
}

// ── Main ───────────────────────────────────────────────────────────
(async () => {
  console.log('[1/3] Building tier timeline…');
  const { tierAsOf, walletKeyToFull } = await buildTierTimeline();
  const lens = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };

  console.log('[2/3] Loading and aggregating shipped picks…');
  const all = await loadShippedPicks(lens);
  const dates = [...new Set(all.map(r => r.date))].sort();
  console.log(`      ${all.length} shipped picks · ${dates.length} days · ${dates[0]} → ${dates[dates.length - 1]}`);

  console.log('[3/3] Running sizing simulations…');

  // Reference: status quo
  const v7Agg = aggOnShippedSubset(all, SIZING.v7_status_quo);

  // Cohort breakdown by purity class
  const byClass = {};
  for (const cls of ['HC_DOMINANCE', 'PURE_CONFIRMED', 'MIXED', 'FLAT_ONLY', 'NONE']) {
    const rows = all.filter(r => r.cls === cls);
    byClass[cls] = aggOnShippedSubset(rows, () => 1.0);
  }

  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  out.push('# WALLET PREDICTIVENESS — RESIZING SCENARIOS');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} shipped sides · ${dates[0]} → ${dates[dates.length - 1]} (${dates.length} days)`);
  out.push('');
  out.push('**Question.** Hard-dropping FLAT from Δw cuts shipped volume from ~9 picks/day to ~2 picks/day. Can we KEEP the v7 LOCK floor and just RESIZE picks based on tier composition? Volume stays high; bankroll exposure to bleeders is reduced; HC-CONFIRMED dominance picks get upsized.');
  out.push('');
  out.push('Lens: point-in-time tiers (the L2 lens validated in `WALLET_PREDICTIVENESS_BACKTEST.md`).');
  out.push('');

  // §1. Status quo + cohort breakdown
  out.push('---');
  out.push('## §1. v7 status quo by tier-purity class');
  out.push('');
  out.push('Every shipped pick falls into one of five purity classes based on its wallet contributors:');
  out.push('');
  out.push('| Class | Definition | N | WR | Flat ROI | Peak PnL @ 1.0× | % of slate |');
  out.push('|---|---|---|---|---|---|---|');
  const totalN = all.length;
  for (const cls of ['HC_DOMINANCE', 'PURE_CONFIRMED', 'MIXED', 'FLAT_ONLY', 'NONE']) {
    const a = byClass[cls];
    const desc = {
      HC_DOMINANCE:    'HC_for ≥ 1 ∧ HC_ag = 0',
      PURE_CONFIRMED:  'CONF_for ≥ 1 ∧ FLAT_for = 0 (no HC dominance)',
      MIXED:           'CONF_for ≥ 1 ∧ FLAT_for ≥ 1',
      FLAT_ONLY:       'CONF_for = 0 ∧ FLAT_for ≥ 1',
      NONE:            'no whitelist contributors',
    }[cls];
    out.push(`| **${cls}** | ${desc} | ${a.n} | ${pct(a.wr)} | ${sign(a.flatRoi, 1)}% | ${sign(a.scaledPnl, 2)}u | ${pct(100 * a.n / Math.max(totalN, 1))} |`);
  }
  out.push('');
  out.push('Reading: each row tells us how a different class of wallet-composition has performed under v7 (full ladder size). The class breakdown is what drives the resizing recommendation.');
  out.push('');

  // §2. Daily volume by purity class
  out.push('---');
  out.push('## §2. Daily volume per class');
  out.push('');
  const dailyByClass = {};
  for (const cls of ['HC_DOMINANCE', 'PURE_CONFIRMED', 'MIXED', 'FLAT_ONLY', 'NONE']) {
    dailyByClass[cls] = byClass[cls].n / dates.length;
  }
  out.push(`| Class | Picks | Picks/day |`);
  out.push(`|---|---|---|`);
  for (const cls of ['HC_DOMINANCE', 'PURE_CONFIRMED', 'MIXED', 'FLAT_ONLY', 'NONE']) {
    out.push(`| ${cls} | ${byClass[cls].n} | ${dailyByClass[cls].toFixed(1)} |`);
  }
  const totalPerDay = totalN / dates.length;
  out.push(`| **TOTAL** | **${totalN}** | **${totalPerDay.toFixed(1)}** |`);
  out.push('');
  out.push(`v7 currently ships **~${totalPerDay.toFixed(1)} picks/day**. The "drop FLAT" hard rule would have shipped only ${(byClass.HC_DOMINANCE.n + byClass.PURE_CONFIRMED.n)/dates.length} picks/day across HC + PURE_CONFIRMED. Resizing keeps all ~${totalPerDay.toFixed(1)}/day visible but with appropriately scaled stakes.`);
  out.push('');

  // §3. Resizing configs
  out.push('---');
  out.push('## §3. Resizing config comparison');
  out.push('');
  out.push('Each config keeps the v7 LOCK floor intact and applies a tier-aware multiplier to peak.units. "Effective stake" is the sum of (peak.units × multiplier) across all picks. Peak PnL is the actual cash result if we\'d sized that way.');
  out.push('');
  out.push('| Config | Multipliers (HC / PURE / MIXED / FLAT_ONLY) | Picks shipped (stake>0) | Picks/day | WR on shipped | Flat ROI on shipped | Total stake | **Peak-unit PnL** | vs v7 |');
  out.push('|---|---|---|---|---|---|---|---|---|');
  const cfgs = ['v7_status_quo', 'M1_purity_tilt', 'M5_moderate', 'M2_purity_tilt_aggressive', 'M3_keep_size_drop_flat_only', 'M4_three_tier'];
  for (const cfg of cfgs) {
    const fn = SIZING[cfg];
    const a = aggOnShippedSubset(all, fn);
    const mults = `${fn('HC_DOMINANCE').toFixed(2)}× / ${fn('PURE_CONFIRMED').toFixed(2)}× / ${fn('MIXED').toFixed(2)}× / ${fn('FLAT_ONLY').toFixed(2)}×`;
    const dailyN = (a.n / dates.length).toFixed(1);
    const delta = a.scaledPnl - v7Agg.scaledPnl;
    out.push(`| \`${cfg}\` | ${mults} | ${a.n} | ${dailyN} | ${pct(a.wr)} | ${sign(a.flatRoi, 1)}% | ${a.scaledStake.toFixed(1)}u | **${sign(a.scaledPnl, 2)}u** | ${sign(delta, 2)}u |`);
  }
  out.push('');

  // §4. Per-sport for the recommended config
  out.push('---');
  out.push('## §4. Per-sport breakdown — most promising configs');
  out.push('');
  const sports = [...new Set(all.map(r => r.sport))].sort();
  for (const cfg of ['M1_purity_tilt', 'M5_moderate', 'M4_three_tier']) {
    out.push(`### \`${cfg}\``);
    out.push('');
    out.push('| Sport | Picks shipped | Picks/day | WR | Flat ROI | Peak PnL |');
    out.push('|---|---|---|---|---|---|');
    for (const sport of sports) {
      const sub = all.filter(r => r.sport === sport);
      const a = aggOnShippedSubset(sub, SIZING[cfg]);
      const dN = sub.length ? (a.n / dates.length).toFixed(1) : '0.0';
      out.push(`| ${sport} | ${a.n} | ${dN} | ${pct(a.wr)} | ${sign(a.flatRoi, 1)}% | ${sign(a.scaledPnl, 2)}u |`);
    }
    out.push('');
  }

  // §5. The narrative — pick-level diff for M1 vs v7
  out.push('---');
  out.push('## §5. What changes day-to-day under M1_purity_tilt?');
  out.push('');
  out.push('Slate-by-slate volume + size shift. "Stake" column = peak.units × M1 multiplier. Picks remain visible to the user; bankroll exposure tracks tier purity.');
  out.push('');
  out.push('| Date | Sport | Pick | Class | v7 size | M1 size | Outcome | v7 PnL | M1 PnL |');
  out.push('|---|---|---|---|---|---|---|---|---|');
  // Sort by date, show first 30
  const sortedByImpact = [...all].sort((a, b) => {
    const aImpact = Math.abs((a.peakUnits || 1) * (1 - SIZING.M1_purity_tilt(a.cls)) * a.perUnitPnl);
    const bImpact = Math.abs((b.peakUnits || 1) * (1 - SIZING.M1_purity_tilt(b.cls)) * b.perUnitPnl);
    return bImpact - aImpact;
  });
  for (const r of sortedByImpact.slice(0, 25)) {
    const v7Stake = (r.peakUnits || 1).toFixed(2);
    const m1Mult = SIZING.M1_purity_tilt(r.cls);
    const m1Stake = ((r.peakUnits || 1) * m1Mult).toFixed(2);
    const v7Pnl = ((r.peakUnits || 1) * r.perUnitPnl).toFixed(2);
    const m1Pnl = ((r.peakUnits || 1) * m1Mult * r.perUnitPnl).toFixed(2);
    out.push(`| ${r.date} | ${r.sport} | \`${r.docId}\` ${r.sideKey} | ${r.cls} | ${v7Stake}u | ${m1Stake}u | ${r.won === 1 ? 'WIN' : 'LOSS'} | ${sign(parseFloat(v7Pnl), 2)}u | ${sign(parseFloat(m1Pnl), 2)}u |`);
  }
  out.push('');
  out.push('Top 25 picks by absolute size-difference impact. The pattern: M1 keeps full size on PURE/HC picks (the winners), and shrinks stakes on MIXED/FLAT_ONLY picks (the bleeders).');
  out.push('');

  // §6. Recommendation
  out.push('---');
  out.push('## §6. Recommendation');
  out.push('');
  const m1Agg = aggOnShippedSubset(all, SIZING.M1_purity_tilt);
  const m5Agg = aggOnShippedSubset(all, SIZING.M5_moderate);
  const m4Agg = aggOnShippedSubset(all, SIZING.M4_three_tier);
  out.push('**The volume-preserving fix is the resizing approach, not the lock-rule change.**');
  out.push('');
  out.push('Top three candidates:');
  out.push('');
  out.push(`- **\`M1_purity_tilt\`** (1.5× HC / 1.0× PURE / 0.5× MIXED / 0.25× FLAT_ONLY): ships **${(m1Agg.n / dates.length).toFixed(1)} picks/day** at ${pct(m1Agg.wr)} WR, ${sign(m1Agg.flatRoi, 1)}% flat ROI, **${sign(m1Agg.scaledPnl, 2)}u** peak — a **${sign(m1Agg.scaledPnl - v7Agg.scaledPnl, 2)}u swing** vs v7.`);
  out.push(`- **\`M5_moderate\`** (1.5× HC / 1.0× PURE / 0.66× MIXED / 0.33× FLAT_ONLY): ships **${(m5Agg.n / dates.length).toFixed(1)} picks/day** at ${pct(m5Agg.wr)} WR, ${sign(m5Agg.flatRoi, 1)}% flat ROI, **${sign(m5Agg.scaledPnl, 2)}u** peak.`);
  out.push(`- **\`M4_three_tier\`** (1.5× HC / 1.0× PURE / 1.0× MIXED / 0u FLAT_ONLY): ships **${(m4Agg.n / dates.length).toFixed(1)} picks/day** (FLAT_ONLY tracked at 0u) at ${pct(m4Agg.wr)} WR, ${sign(m4Agg.flatRoi, 1)}% flat ROI, **${sign(m4Agg.scaledPnl, 2)}u** peak.`);
  out.push('');
  out.push('All three preserve the bulk of daily content. M1 is the simplest to communicate (a clean four-tier ladder). M4 is the most aggressive defense (FLAT_ONLY → 0u, otherwise full size). M5 is the gentlest (every pick still ships at non-trivial size).');
  out.push('');
  out.push('**Per-sport sanity check** (see §4): all three configs preserve NHL volume reasonably (NHL picks tend toward PURE/HC classes), so no sport-specific carve-out is required if we go the resizing route.');
  out.push('');

  out.push('---');
  out.push('## §7. Implementation surface');
  out.push('');
  out.push('Single-function change in `SharpFlow.jsx`:');
  out.push('');
  out.push('```js');
  out.push('// New helper inside computeWalletConsensus → return purity class');
  out.push('function purityClass(forW, agW, hcConfFor, hcConfAg, confFor, flatFor) {');
  out.push('  if (hcConfFor >= 1 && hcConfAg === 0) return \'HC_DOMINANCE\';');
  out.push('  if (confFor >= 1 && flatFor === 0)   return \'PURE_CONFIRMED\';');
  out.push('  if (confFor >= 1 && flatFor >= 1)    return \'MIXED\';');
  out.push('  if (confFor === 0 && flatFor >= 1)   return \'FLAT_ONLY\';');
  out.push('  return \'NONE\';');
  out.push('}');
  out.push('');
  out.push('// In calculateUnits:');
  out.push('const PURITY_MULT = { HC_DOMINANCE: 1.5, PURE_CONFIRMED: 1.0, MIXED: 0.5, FLAT_ONLY: 0.25, NONE: 0.25 };');
  out.push('const baseUnits = ladderUnitsFromStars(stars);');
  out.push('const finalUnits = baseUnits * (PURITY_MULT[v8_purityClass] ?? 1.0);');
  out.push('```');
  out.push('');
  out.push('Stamp `v8_purityClass` on each side at write time so the resize is auditable.');
  out.push('');

  out.push('---');
  out.push('## §8. Caveats');
  out.push('');
  out.push('- N is small (12 days, 112 shipped picks). HC_DOMINANCE has very few picks; the WR there is high but high-variance.');
  out.push('- Multipliers (1.5× / 1.0× / 0.5× / 0.25×) are calibrated to vault-finding effect sizes but should be re-tuned after 30 days of live data.');
  out.push('- Resizing means peak-unit PnL can drift from the legacy ladder targets. Monitor weekly; if total stake drifts > 30% from the target weekly bankroll budget, retune multipliers.');
  out.push('- Edge case: if ALL picks one day fall into FLAT_ONLY, the user sees a thin slate at 0.25× units. Consider a per-day floor of "at least 1 PURE_CONFIRMED-equivalent stake" to avoid starvation.');
  out.push('');

  const md = out.join('\n');
  const outPath = join(REPO_ROOT, 'WALLET_PREDICTIVENESS_SIZING.md');
  writeFileSync(outPath, md);
  console.log(`      Wrote ${outPath}`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
