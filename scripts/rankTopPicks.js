/**
 * rankTopPicks.js — v7.3 top-picks ranker driven by HC margin first,
 * then Σ (Δw + Δq), then Δw individually.
 *
 * Replaces rankTodayLocks.js. The composite score and the ranking
 * surface are calibrated to the v7.3 evidence base
 * (DAILY_V6_REPORT.md §12, WALLET_HC_MARGIN_ANALYSIS_FULL.md):
 *
 *   • HC margin is the strongest single signal in the entire sample.
 *     §12 pooled all-time: HC_m ≥ +1 = 70.2% WR / +34.3% ROI vs
 *     HC_m ≤ 0 = 40.6% WR / -18.5% ROI → lift +29.6pp / +52.8% (p<0.001).
 *
 *   • Σ ≥ +5 is the legacy two-factor floor (still locked under v7.3).
 *
 *   • Δw is a third-order tie-breaker — proven-winner consensus depth.
 *
 * For each LOCKED pick today the script also surfaces the historical
 * (Σ × HC_m) cell that pick lives in: N · WR · flat ROI both
 * all-sports pooled and sport-specific. Lets you SEE the historical
 * lift driving the rank, not just trust the score.
 *
 * Universe for historical lookup:
 *   - Every graded side since v6 cutover (LOCKED + LEAN + SHADOW +
 *     MUTED + CANCELLED), filtered to outcome ∈ {WIN, LOSS}.
 *   - HC margin is recomputed via a point-in-time tier lens (mirror
 *     of dailyV6Report.js / walletHcMarginAnalysisFull.js) so the
 *     ENTIRE 200+ pick sample is usable, not just the ~30 v7.1+
 *     stamped ones.
 *
 * Outputs:
 *   - Console table ranked top → bottom by composite signal score
 *   - public/top_picks_ranked.json (machine-readable, one row per pick)
 *   - top-picks-ranked.txt is captured by the GitHub workflow that
 *     calls this script (see .github/workflows/rank-today-locks.yml).
 *
 * Usage:  node scripts/rankTopPicks.js
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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

// ── Config (mirror SharpFlow.jsx + dailyV6Report.js) ──────────────────────
const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;
const MIN_BETS    = 2;
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const POSITIONS_COLLECTION = 'sharp_action_positions';
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

// ── Tiny helpers ──────────────────────────────────────────────────────────
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const pct  = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%');
const americanToDecimal = (o) => (o === 0 ? 1.91 : (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o)));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);

function pad(s, n) { return String(s).padEnd(n); }
function padR(s, n) { return String(s).padStart(n); }

// ── Σ × HC matrix layout (mirror DAILY_V6_REPORT §12) ─────────────────────
const SIGMA_BUCKETS = ['Σ≤0', 'Σ=1', 'Σ=2', 'Σ=3', 'Σ=4', 'Σ=5', 'Σ=6', 'Σ≥7'];
function sigmaBucket(sum) {
  if (sum == null || Number.isNaN(sum)) return null;
  if (sum <= 0) return 'Σ≤0';
  if (sum === 1) return 'Σ=1';
  if (sum === 2) return 'Σ=2';
  if (sum === 3) return 'Σ=3';
  if (sum === 4) return 'Σ=4';
  if (sum === 5) return 'Σ=5';
  if (sum === 6) return 'Σ=6';
  return 'Σ≥7';
}
function hcBucket(m) {
  if (m == null) return null;
  if (m <= 0) return 'HC≤0';
  if (m === 1) return 'HC=+1';
  return 'HC≥+2';
}

// AGS tier buckets — mirror agsTierFromValue() in src/lib/ags.js but with
// label keys we can use as matrix indexes. Order matters for display.
const AGS_TIER_BUCKETS = ['ELITE', 'LOCK', 'STRONG', 'NEUTRAL', 'WEAK', 'FADE'];
function agsTierBucket(ags) {
  if (ags == null || !Number.isFinite(ags)) return null;
  if (ags >= 7) return 'ELITE';
  if (ags >= 5) return 'LOCK';
  if (ags >= 3) return 'STRONG';
  if (ags >= 0) return 'NEUTRAL';
  if (ags >= -3) return 'WEAK';
  return 'FADE';
}

// ── Wallet-key canonicalizer ──────────────────────────────────────────────
function buildCanonicalizer(profiles) {
  const map = new Map();
  for (const [key, p] of profiles) {
    const full = p.walletAddress || null;
    map.set(key, full || key);
    if (full) {
      map.set(full, full);
      map.set(full.slice(-6).toLowerCase(), full);
    }
  }
  return (k) => map.get(k) || k;
}

// ── Point-in-time tier lens ────────────────────────────────────────────────
//
// Mirror of dailyV6Report.js / walletHcMarginAnalysisFull.js: walks every
// Source-A bet (wallet × graded pick) and every Source-B graded position
// in chronological order, marking when each (wallet, sport) pair first
// crossed FLAT / CONFIRMED / WR50. tierAsOf(walletShort, sport, date)
// returns the tier as it would have been on that date.
function buildTierLens(sourceABets, sourceBPositions, profiles) {
  const canonicalize = buildCanonicalizer(profiles);
  const events = [];
  for (const b of sourceABets) {
    if (!b.sport || !b.wallet) continue;
    events.push({ date: b.date || '', sport: b.sport, canonical: canonicalize(b.wallet), source: 'A', payload: b });
  }
  for (const p of sourceBPositions) {
    if (!p.sport || !p.wallet) continue;
    events.push({ date: p.date || '', sport: p.sport, canonical: canonicalize(p.wallet), source: 'B', payload: p });
  }
  events.sort((x, y) => x.date.localeCompare(y.date));

  const stat = new Map();
  const getStat = (c, s) => {
    const k = `${c}|${s}`;
    let st = stat.get(k);
    if (!st) {
      st = { aN: 0, aWins: 0, aFlatPnl: 0, bN: 0, bInvested: 0, bPnl: 0, firstWR50: null, firstFlat: null, firstConfirmed: null };
      stat.set(k, st);
    }
    return st;
  };
  for (const e of events) {
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') {
      s.aN += 1;
      s.aWins += (e.payload.won || 0);
      s.aFlatPnl += (e.payload.flat ?? 0);
    } else {
      s.bN += 1;
      s.bInvested += (e.payload.invested || 0);
      s.bPnl += (e.payload.settledPnl || 0);
    }
    const aMet  = s.aN >= MIN_BETS && s.aFlatPnl > 0;
    const aWr50 = s.aN >= MIN_BETS && (s.aWins / s.aN) >= 0.5;
    const bMet  = s.bN >= MIN_BETS && s.bInvested > 0 && (s.bPnl / s.bInvested) > 0;
    if (aMet && bMet && !s.firstConfirmed) s.firstConfirmed = e.date;
    if (aMet         && !s.firstFlat)      s.firstFlat      = e.date;
    if (aWr50        && !s.firstWR50)      s.firstWR50      = e.date;
  }
  function tierAsOf(walletKey, sport, date) {
    const k = `${canonicalize(walletKey)}|${sport}`;
    const s = stat.get(k);
    if (!s) return null;
    if (s.firstConfirmed && s.firstConfirmed <= date) return 'CONFIRMED';
    if (s.firstFlat      && s.firstFlat      <= date) return 'FLAT';
    if (s.firstWR50      && s.firstWR50      <= date) return 'WR50';
    return null;
  }
  // Live-tier accessor (uses the latest known state of each wallet) —
  // useful for ranking TODAY's picks against the current whitelist when
  // the frozen stamp on a still-live pick may be stale. Falls back to
  // the latest event date in the timeline.
  function tierLive(walletKey, sport) {
    const today = new Date().toISOString().slice(0, 10);
    return tierAsOf(walletKey, sport, today);
  }
  return { tierAsOf, tierLive };
}

// ── Load every graded historical row (the universe for cell lookup) ──────
async function loadHistorical() {
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  profSnap.forEach(d => profiles.set(d.id, d.data()));

  const pickRows = [];   // every graded side (LOCKED + LEAN + SHADOW + MUTED + CANCELLED)
  const sourceABets = []; // for tier lens
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date  = d.date;
      const sides = d.sides || {};

      // Identify winning side once per game (for Source-A bet attribution).
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN')  { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      const peakOddsBySide = new Map();
      for (const [sk, sd] of Object.entries(sides)) {
        peakOddsBySide.set(sk, sd?.peak?.peakOdds ?? sd?.lock?.lockOdds ?? sd?.peak?.odds ?? sd?.lock?.odds ?? 0);
      }

      for (const [sideKey, side] of Object.entries(sides)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;   // skip PUSH / pending
        if (side.superseded) continue;
        const peak = side.peak || side.lock || {};
        const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds
                  ?? side?.lock?.odds     ?? side?.peak?.odds ?? 0;

        const dwFrozen = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
        let dqFrozen = (side.v8_walletConsensusQualityMargin != null) ? Number(side.v8_walletConsensusQualityMargin) : null;
        const wd = peak?.v8Scoring?.walletDetails;
        if (dqFrozen == null && Array.isArray(wd) && wd.length) {
          let qFor = 0, qAg = 0;
          for (const w of wd) {
            if ((w?.contribution ?? 0) < QUALITY_CUT) continue;
            if (!w?.side) continue;
            if (w.side === sideKey) qFor++;
            else                    qAg++;
          }
          dqFrozen = qFor - qAg;
        }
        const hcStamped = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin) : null;
        const wdLite = Array.isArray(wd)
          ? wd.filter(w => w?.wallet && w?.side).map(w => ({
              wallet: w.wallet, side: w.side, sizeRatio: Number(w.sizeRatio ?? 0),
            }))
          : null;

        // AGS frozen stamp — only present on picks scored under v7.5+ (late
        // April 2026 onward). Older rows will have null AGS and fall into
        // the 'UNKNOWN' bucket which we exclude from the AGS matrix.
        const agsFrozen = (side.v8_ags != null && Number.isFinite(side.v8_ags))
          ? Number(side.v8_ags)
          : null;
        const agsTierFrozen = side.v8_agsTier ?? null;

        pickRows.push({
          docId: doc.id, date, sport, market, sideKey,
          dwFrozen, dqFrozen, hcStamped,
          agsFrozen, agsTierFrozen,
          outcome: oc,
          flatProfit: flatProfit(odds, oc === 'WIN'),
          walletDetailsLite: wdLite,
        });
      }

      // Source-A bets for the tier lens.
      if (winningSide) {
        const seen = new Set();
        for (const [, side] of Object.entries(sides)) {
          const peak = side.peak || side.lock || {};
          const wd = peak?.v8Scoring?.walletDetails;
          if (!Array.isArray(wd)) continue;
          for (const w of wd) {
            if (!w.wallet || !w.side) continue;
            const key = `${doc.id}_${w.wallet}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const oddsThis = peakOddsBySide.get(w.side) ?? 0;
            const won = w.side === winningSide ? 1 : 0;
            sourceABets.push({
              date: d.date, sport, wallet: w.wallet, won,
              flat: flatProfit(oddsThis, won === 1),
            });
          }
        }
      }
    }
  }

  // Source-B positions for the tier lens.
  const posSnap = await db.collection(POSITIONS_COLLECTION).where('status', '==', 'GRADED').get();
  const sourceBPositions = [];
  for (const doc of posSnap.docs) {
    const d = doc.data();
    if (!d.wallet) continue;
    if (!d.date || d.date < V6_CUTOVER) continue;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) continue;
    const walletShort = d.walletShort || String(d.wallet).slice(-6).toLowerCase();
    sourceBPositions.push({
      date: d.date, sport: d.sport || 'UNK', wallet: walletShort, invested, settledPnl,
    });
  }

  return { profiles, pickRows, sourceABets, sourceBPositions };
}

// Recompute hcMargin / hcConfFor / hcConfAg on every historical row using
// the point-in-time tier lens. Frozen stamps are preferred when present;
// older rows get recomputed (this is what brings sample size from ~30 to ~230).
function annotateHistoricalHc(pickRows, lens) {
  for (const r of pickRows) {
    if (r.hcStamped != null) {
      r.hcMargin = r.hcStamped;
      r.hcSource = 'frozen';
      continue;
    }
    if (!Array.isArray(r.walletDetailsLite) || !r.sideKey) {
      r.hcMargin = null;
      r.hcSource = 'missing';
      continue;
    }
    let cFor = 0, cAg = 0;
    for (const w of r.walletDetailsLite) {
      const tier = lens.tierAsOf(w.wallet, r.sport, r.date);
      if (tier !== 'CONFIRMED') continue;
      if (w.sizeRatio < HC_RATIO) continue;
      if (w.side === r.sideKey) cFor += 1;
      else                      cAg += 1;
    }
    r.hcMargin = cFor - cAg;
    r.hcSource = 'recomputed';
  }
}

// Build the historical (Σ × HC_m) matrix:
//   matrix.all[sigmaKey][hcKey] = { n, wins, losses, wr, flatRoi, flatPnl }
//   matrix.bySport[sport][...]  = same structure restricted to that sport
function buildSigmaHcMatrix(pickRows) {
  const eligible = pickRows.filter(r =>
    r.dwFrozen != null && r.dqFrozen != null
    && r.hcMargin != null
    && (r.outcome === 'WIN' || r.outcome === 'LOSS')
  );
  function aggCell(rows) {
    if (!rows.length) return { n: 0, wins: 0, losses: 0, wr: null, flatRoi: null, flatPnl: 0 };
    const wins = rows.filter(r => r.outcome === 'WIN').length;
    const flat = rows.reduce((s, r) => s + (r.flatProfit ?? 0), 0);
    return {
      n: rows.length, wins, losses: rows.length - wins,
      wr: rows.length ? wins / rows.length * 100 : null,
      flatRoi: rows.length ? (flat / rows.length) * 100 : null,
      flatPnl: flat,
    };
  }
  function build(rows) {
    const out = {};
    for (const sb of SIGMA_BUCKETS) {
      out[sb] = {};
      for (const hb of ['HC≤0', 'HC=+1', 'HC≥+2']) {
        out[sb][hb] = aggCell(rows.filter(r =>
          sigmaBucket((r.dwFrozen ?? 0) + (r.dqFrozen ?? 0)) === sb
          && hcBucket(r.hcMargin) === hb
        ));
      }
      out[sb].ALL = aggCell(rows.filter(r =>
        sigmaBucket((r.dwFrozen ?? 0) + (r.dqFrozen ?? 0)) === sb
      ));
    }
    out.ALL = {};
    for (const hb of ['HC≤0', 'HC=+1', 'HC≥+2']) {
      out.ALL[hb] = aggCell(rows.filter(r => hcBucket(r.hcMargin) === hb));
    }
    out.ALL.ALL = aggCell(rows);
    return out;
  }
  const all = build(eligible);
  const bySport = {};
  const sports = [...new Set(eligible.map(r => r.sport))].sort();
  for (const s of sports) bySport[s] = build(eligible.filter(r => r.sport === s));
  return { all, bySport, totalEligible: eligible.length, sports };
}

// Build the historical AGS-tier-by-tier matrix. Each cell aggregates every
// graded pick that landed in that AGS tier when it was scored. Mirrors
// the v7.5 calibration sample documented in src/lib/ags.js header:
//   AGS ≥ +7   →  ~100% WR / +172% ROI (ELITE, n=4 in original cal)
//   AGS ≥ +5   →   ~93% WR / +106% ROI (LOCK, n=14)
//   AGS ≥ +3   →   ~74% WR /  +48% ROI (STRONG, n=38)
//
// Unlike the (Σ × HC) matrix, AGS isn't recomputable from walletDetailsLite
// because the underlying agg features need contribution / roiNorm / pnlNorm
// numbers that we don't carry. So this matrix is restricted to picks whose
// `v8_ags` was stamped at scoring time (v7.5+ era, ~late April 2026 onward).
function buildAgsMatrix(pickRows) {
  const eligible = pickRows.filter(r =>
    r.agsFrozen != null
    && Number.isFinite(r.agsFrozen)
    && (r.outcome === 'WIN' || r.outcome === 'LOSS')
  );
  function aggCell(rows) {
    if (!rows.length) return { n: 0, wins: 0, losses: 0, wr: null, flatRoi: null, flatPnl: 0, agsAvg: null };
    const wins = rows.filter(r => r.outcome === 'WIN').length;
    const flat = rows.reduce((s, r) => s + (r.flatProfit ?? 0), 0);
    const agsSum = rows.reduce((s, r) => s + (r.agsFrozen ?? 0), 0);
    return {
      n: rows.length, wins, losses: rows.length - wins,
      wr: rows.length ? wins / rows.length * 100 : null,
      flatRoi: rows.length ? (flat / rows.length) * 100 : null,
      flatPnl: flat,
      agsAvg: rows.length ? agsSum / rows.length : null,
    };
  }
  function build(rows) {
    const out = {};
    for (const tier of AGS_TIER_BUCKETS) {
      out[tier] = aggCell(rows.filter(r => agsTierBucket(r.agsFrozen) === tier));
    }
    // Threshold cumulative cohorts — what the v7.5 calibration header reports.
    out['AGS≥+7'] = aggCell(rows.filter(r => r.agsFrozen >= 7));
    out['AGS≥+5'] = aggCell(rows.filter(r => r.agsFrozen >= 5));
    out['AGS≥+3'] = aggCell(rows.filter(r => r.agsFrozen >= 3));
    out['AGS≥0']  = aggCell(rows.filter(r => r.agsFrozen >= 0));
    out['AGS<0']  = aggCell(rows.filter(r => r.agsFrozen < 0));
    out['AGS<-1'] = aggCell(rows.filter(r => r.agsFrozen < -1));
    out.ALL = aggCell(rows);
    return out;
  }
  const all = build(eligible);
  const bySport = {};
  const sports = [...new Set(eligible.map(r => r.sport))].sort();
  for (const s of sports) bySport[s] = build(eligible.filter(r => r.sport === s));
  return { all, bySport, totalEligible: eligible.length, sports };
}

// ── Composite signal score (HC margin DOMINATES) ─────────────────────────
//
// Calibrated to §12 evidence base. HC margin is the strongest single
// signal in the entire sample — it should dominate the rank.
//
//   HC_m ≥ +2  : +1500   (the 86.7% WR / +74.7% ROI cohort, n=15)
//   HC_m  = +1 : +1000   (the 62.5% WR / +15.4% ROI cohort, n=32)
//   HC_m  = 0  :    +0   (baseline)
//   HC_m  = -1 :  -800   (fade signal — should not appear in LOCKED, flag)
//   HC_m ≤ -2  : -1500
//
// Σ contributes a floor bonus (still meaningful — Σ ≥ +5 is the proven
// two-factor cohort regardless of HC):
//
//   Σ ≥ +7     : +600    (ELITE)
//   Σ ∈ {5,6}  : +400
//   Σ ∈ {3,4}  : +200
//   Σ ∈ {1,2}  :  +50    (only locks under v7.3 with HC_m ≥ +1)
//   Σ ≤ 0      :    +0
//
// Δw is a third tie-breaker — proven-winner depth.
//
//   +30 per Δw unit (caps at 9)
//
// Cell evidence is shown but does NOT enter the score directly: we want
// the score to reflect the criteria, not lock-in to a single sample
// cell that may be thin (n < 5). Use cell ROI as the read on whether
// the criteria has actually been earning historically.
function compositeScore({ hcMargin, dw, dq }) {
  const sum = (dw ?? 0) + (dq ?? 0);
  let s = 0;
  if (hcMargin >= 2) s += 1500;
  else if (hcMargin === 1) s += 1000;
  else if (hcMargin === 0) s += 0;
  else if (hcMargin === -1) s -= 800;
  else if (hcMargin <= -2) s -= 1500;

  if (sum >= 7) s += 600;
  else if (sum >= 5) s += 400;
  else if (sum >= 3) s += 200;
  else if (sum >= 1) s += 50;

  s += 30 * Math.min(9, Math.max(-9, dw ?? 0));

  return s;
}

// ── Today's locked picks loader ───────────────────────────────────────────
//
// LOCKED only (LEAN explicitly excluded per user spec — those ship at 0u
// and don't carry the same conviction). Reads frozen stamps on every
// LOCKED side. If the HC stamp is missing on a still-live pick (rare —
// only happens if the stamp pipeline is mid-deploy), recompute via the
// live tier lens against the live whitelist.
function loadTodayLocked(today, lens) {
  return Promise.all(PICK_COLS.map(async ([col, market]) => {
    const snap = await db.collection(col).where('date', '==', today).get();
    const out = [];
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        if (side.lockStage !== 'LOCKED') continue;
        if (side.superseded) continue;
        if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') continue;
        const peak = side.peak || side.lock || {};
        const peakStars = peak?.stars ?? 0;
        if (peakStars < 2.5) continue;

        const dw = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : 0;
        let dq  = (side.v8_walletConsensusQualityMargin != null) ? Number(side.v8_walletConsensusQualityMargin) : null;
        const wd = peak?.v8Scoring?.walletDetails;
        if (dq == null && Array.isArray(wd)) {
          let qFor = 0, qAg = 0;
          for (const w of wd) {
            if ((w?.contribution ?? 0) < QUALITY_CUT) continue;
            if (!w?.side) continue;
            if (w.side === sideKey) qFor++;
            else                    qAg++;
          }
          dq = qFor - qAg;
        }
        dq = dq ?? 0;

        // HC margin — frozen stamp first, fallback to live recompute.
        let hcF = (side.v8_hcConfFor != null) ? Number(side.v8_hcConfFor) : null;
        let hcA = (side.v8_hcConfAg  != null) ? Number(side.v8_hcConfAg)  : null;
        let hcM = (side.v8_hcMargin  != null) ? Number(side.v8_hcMargin)  : null;
        let hcSource = (hcM != null) ? 'frozen' : 'missing';
        if (hcM == null && Array.isArray(wd)) {
          hcF = 0; hcA = 0;
          for (const w of wd) {
            if (!w?.wallet || !w?.side) continue;
            const tier = lens.tierLive(w.wallet, d.sport);
            if (tier !== 'CONFIRMED') continue;
            if (Number(w.sizeRatio ?? 0) < HC_RATIO) continue;
            if (w.side === sideKey) hcF += 1;
            else                    hcA += 1;
          }
          hcM = hcF - hcA;
          hcSource = 'recomputed_live';
        }

        // AGS — the AggregateScore stamp written by syncPickStateAuthoritative
        // every cycle. This is the proven-wallet quality signal used for
        // both rescue (AGS ≥ AGS_LOCK_FLOOR) and the mute veto (AGS <
        // AGS_MUTE_FLOOR). Surface it alongside HC / Σ / Δw so the ranker
        // shows the COMPLETE quality picture, not just the consensus depth.
        const ags = (side.v8_ags != null && Number.isFinite(side.v8_ags)) ? Number(side.v8_ags) : null;
        const agsTier = side.v8_agsTier ?? null;
        const agsForN = (side.v8_agsProvenForCount != null) ? Number(side.v8_agsProvenForCount) : null;
        const agsAgN  = (side.v8_agsProvenAgCount  != null) ? Number(side.v8_agsProvenAgCount)  : null;
        const agsUnitsMult = (side.v8_agsUnitsMult != null) ? Number(side.v8_agsUnitsMult) : null;

        // Lightweight walletDetails stash so the top-wallet leaderboard
        // section can name which top-10 wallets are backing each side
        // without re-loading the doc.
        const wdLite = Array.isArray(wd)
          ? wd.filter(w => w?.wallet && w?.side).map(w => ({
              wallet: w.wallet, side: w.side,
              invested: Number(w.invested ?? 0),
              sizeRatio: Number(w.sizeRatio ?? 0),
            }))
          : [];

        out.push({
          docId: doc.id,
          sport: d.sport,
          market,
          sideKey,
          team: side.team,
          away: d.away,
          home: d.home,
          stars: peakStars,
          units: peak?.units ?? 0,
          odds: peak?.odds ?? 0,
          book: peak?.book ?? '',
          lockTier: side.v8_lockTier ?? null,
          dw, dq, sum: dw + dq,
          hcConfFor: hcF, hcConfAg: hcA, hcMargin: hcM, hcSource,
          ags, agsTier, agsForN, agsAgN, agsUnitsMult,
          systemVersion: side.v8_systemVersion ?? null,
          promotedBy: side.promotedBy ?? null,
          v73HcRescue: !!side.v8_v73HcRescue,
          walletDetailsLite: wdLite,
        });
      }
    }
    return out;
  })).then(arrs => arrs.flat());
}

// ── All-sides loader (for the bottom-of-report market-type breakdown) ────
//
// Loads every today doc's BOTH sides regardless of lockStage / superseded /
// health / star floor. The user wants a complete view of where every market
// stands on AGS / HC margin / Δw — not just locked picks. Sides with no
// proven wallet activity AND no stamp data are still emitted (rendered as
// "—") so the rendered table is exhaustive per market.
//
// For each pick doc we emit BOTH sides:
//   1. Sides present in the `sides` map are emitted with full pick-time
//      stamps (lockStage, health, peak, units, etc).
//   2. Sides MISSING from `sides` (because they never qualified for a
//      lock check, or only one side was scored) are synthesized from the
//      doc-level `agsBothSides` analytical sidecar — same AGS / HC / Δw
//      / Δq numbers the cron computes on every cycle for both sides.
//      These synthesized rows are flagged lockStage='SHADOW' so the
//      table makes clear they were never an active pick — but the user
//      still sees the both-sides AGS comparison they asked for.
async function loadAllSidesForToday(today) {
  const out = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '==', today).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const expectedSides = market === 'TOTAL' ? ['over', 'under'] : ['away', 'home'];
      const sidesPresent = new Set(Object.keys(sides));

      // Pass 1: emit every side actually stored on the doc.
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;

        const dw = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
        let dq  = (side.v8_walletConsensusQualityMargin != null) ? Number(side.v8_walletConsensusQualityMargin) : null;
        if (dq == null && Array.isArray(wd)) {
          let qFor = 0, qAg = 0;
          for (const w of wd) {
            if ((w?.contribution ?? 0) < QUALITY_CUT) continue;
            if (!w?.side) continue;
            if (w.side === sideKey) qFor++;
            else                    qAg++;
          }
          dq = qFor - qAg;
        }

        const hcM = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin) : null;
        const hcF = (side.v8_hcConfFor != null) ? Number(side.v8_hcConfFor) : null;
        const hcA = (side.v8_hcConfAg  != null) ? Number(side.v8_hcConfAg)  : null;

        const ags = (side.v8_ags != null && Number.isFinite(side.v8_ags)) ? Number(side.v8_ags) : null;
        const agsTier = side.v8_agsTier ?? null;
        const agsForN = (side.v8_agsProvenForCount != null) ? Number(side.v8_agsProvenForCount) : null;
        const agsAgN  = (side.v8_agsProvenAgCount  != null) ? Number(side.v8_agsProvenAgCount)  : null;

        out.push({
          docId: doc.id,
          sport: d.sport,
          market,
          sideKey,
          team: side.team,
          away: d.away,
          home: d.home,
          stars: peak?.stars ?? 0,
          units: side.finalUnits ?? peak?.units ?? 0,
          odds: peak?.odds ?? 0,
          lockStage: side.lockStage ?? null,
          health: side.health?.status ?? null,
          superseded: !!side.superseded,
          dw, dq,
          hcMargin: hcM, hcConfFor: hcF, hcConfAg: hcA,
          ags, agsTier, agsForN, agsAgN,
          fromAgsBothSides: false,
        });
      }

      // Pass 2: for every expected side that's NOT in `sides`, synthesize
      // a row from the doc-level `agsBothSides` analytical sidecar. This
      // is what makes "both sides of every pick" actually show up — the
      // cron writes agsBothSides every cycle for both away+home (or
      // over+under), even when only one side ever qualified for a lock.
      const both = d.agsBothSides || null;
      if (both) {
        for (const sideKey of expectedSides) {
          if (sidesPresent.has(sideKey)) continue;
          const stamp = both[sideKey];
          if (!stamp) continue;
          const teamLabel =
            market === 'TOTAL' ? (sideKey === 'over' ? 'OVER' : 'UNDER')
            : sideKey === 'home' ? d.home : d.away;
          out.push({
            docId: doc.id,
            sport: d.sport,
            market,
            sideKey,
            team: teamLabel,
            away: d.away,
            home: d.home,
            stars: 0,
            units: 0,
            odds: 0,
            // No `sides` entry = this side was never actively scored as
            // a pick. SHADOW captures that semantic — it's the
            // "documented but not promoted" state used elsewhere in the
            // pipeline.
            lockStage: 'SHADOW',
            health: null,
            superseded: false,
            dw: stamp.dw ?? null,
            dq: stamp.dq ?? null,
            hcMargin: stamp.hcMargin ?? null,
            hcConfFor: stamp.hcConfFor ?? null,
            hcConfAg: stamp.hcConfAg ?? null,
            ags: stamp.ags ?? null,
            agsTier: stamp.agsTier ?? null,
            agsForN: stamp.agsProvenForCount ?? null,
            agsAgN: stamp.agsProvenAgCount ?? null,
            fromAgsBothSides: true,
          });
        }
      }
    }
  }
  return out;
}

// ── Cell-evidence formatter ───────────────────────────────────────────────
function fmtCell(cell) {
  if (!cell || cell.n === 0) return 'N=0  —';
  const n = `N=${cell.n}`;
  const wl = `${cell.wins}-${cell.losses}`;
  const wr = pct(cell.wr, 0);
  const roi = sign(cell.flatRoi, 0) + '%';
  return `${n} ${wl} ${wr} ${roi}`;
}

// ── Per-sport wallet leaderboard ─────────────────────────────────────────
//
// Objectively ranks every wallet WITHIN A SPORT using the metrics our
// analyses validated as the strongest predictors of winners (see
// V6_FULL_ANALYSIS.md §4 & §11):
//
//   WalletScore = flatRoi%   × min(1, n/MIN_VOL)   ← Source A primary
//               + 0.5 × dollarRoi%                  ← Source B confirm
//               + tierBonus  (CONFIRMED=+20, FLAT=+10, WR50=0)
//               + recencyBonus (-10 if last bet > 30 days)
//
// Volume cap (MIN_VOL=5) protects against high-ROI tiny-sample wallets
// dominating. Tier bonus rewards the production-quality threshold a
// wallet has cleared. Recency penalty downweights wallets that have
// gone quiet (cold streak / left the action).
//
// Returns { bySport: { 'NHL': [walletEntries sorted desc by score] } }
const LEADERBOARD_MIN_VOL = 5;
const LEADERBOARD_RECENCY_DAYS = 30;
function buildWalletLeaderboardBySport(sourceABets, sourceBPositions, lens, todayStr) {
  // Aggregate Source A per (wallet, sport).
  const sourceAByWS = new Map();   // key = `${walletShort}|${sport}`
  for (const b of sourceABets) {
    if (!b?.wallet || !b?.sport) continue;
    const k = `${b.wallet}|${b.sport}`;
    let agg = sourceAByWS.get(k);
    if (!agg) { agg = { n: 0, wins: 0, flatPnl: 0, lastDate: null }; sourceAByWS.set(k, agg); }
    agg.n += 1;
    agg.wins += (b.won || 0);
    agg.flatPnl += (b.flat ?? 0);
    if (!agg.lastDate || (b.date && b.date > agg.lastDate)) agg.lastDate = b.date;
  }
  // Aggregate Source B per (wallet, sport).
  const sourceBByWS = new Map();
  for (const p of sourceBPositions) {
    if (!p?.wallet || !p?.sport) continue;
    const k = `${p.wallet}|${p.sport}`;
    let agg = sourceBByWS.get(k);
    if (!agg) { agg = { bN: 0, invested: 0, dollarPnl: 0, lastDate: null }; sourceBByWS.set(k, agg); }
    agg.bN += 1;
    agg.invested += (p.invested || 0);
    agg.dollarPnl += (p.settledPnl || 0);
    if (!agg.lastDate || (p.date && p.date > agg.lastDate)) agg.lastDate = p.date;
  }

  // Union of (wallet, sport) keys across both sources.
  const allKeys = new Set([...sourceAByWS.keys(), ...sourceBByWS.keys()]);
  const todayMs = Date.parse(todayStr + 'T00:00:00Z');

  // Per (wallet, sport), assemble the row + score.
  // Eligibility: require ≥ MIN_LEADERBOARD_BETS bets in Source A. This
  // filters out Source-B-only ghost wallets (positions tracked but
  // never appeared in any walletDetails) which can't be cross-
  // referenced to today's picks anyway, and matches the production
  // proven-gate threshold (CONFIRMED requires ≥2 bets in BOTH sources).
  const bySport = {};
  for (const k of allKeys) {
    const [walletShort, sport] = k.split('|');
    const a = sourceAByWS.get(k) || { n: 0, wins: 0, flatPnl: 0, lastDate: null };
    const b = sourceBByWS.get(k) || { bN: 0, invested: 0, dollarPnl: 0, lastDate: null };
    if (a.n < MIN_BETS) continue;
    const wr        = a.n ? (a.wins / a.n) * 100 : null;
    const flatRoi   = a.n ? (a.flatPnl / a.n) * 100 : null;
    const dollarRoi = b.invested > 0 ? (b.dollarPnl / b.invested) * 100 : null;
    const tier      = lens.tierAsOf(walletShort, sport, todayStr) || 'untracked';
    const tierBonus = tier === 'CONFIRMED' ? 20 : tier === 'FLAT' ? 10 : tier === 'WR50' ? 0 : -10;
    const lastDate  = (a.lastDate && b.lastDate)
      ? (a.lastDate > b.lastDate ? a.lastDate : b.lastDate)
      : (a.lastDate || b.lastDate);
    let recencyBonus = 0;
    let daysSince = null;
    if (lastDate) {
      const lastMs = Date.parse(lastDate + 'T00:00:00Z');
      daysSince = Math.max(0, Math.round((todayMs - lastMs) / 86400000));
      if (daysSince > LEADERBOARD_RECENCY_DAYS) recencyBonus = -10;
    }
    // WalletScore — flatRoi weighted by sample size, plus dollar-ROI
    // confirmation, plus tier and recency modifiers.
    const volumeWeight = Math.min(1, a.n / LEADERBOARD_MIN_VOL);
    const flatComponent   = (flatRoi != null) ? flatRoi * volumeWeight : 0;
    const dollarComponent = (dollarRoi != null) ? 0.5 * dollarRoi : 0;
    const score = flatComponent + dollarComponent + tierBonus + recencyBonus;
    const row = {
      walletShort, sport, tier,
      n: a.n, wins: a.wins, losses: a.n - a.wins,
      wr, flatPnl: a.flatPnl, flatRoi,
      bN: b.bN, dollarInvested: b.invested, dollarPnl: b.dollarPnl, dollarRoi,
      lastDate, daysSince,
      score, scoreParts: { flatComponent, dollarComponent, tierBonus, recencyBonus, volumeWeight },
    };
    if (!bySport[sport]) bySport[sport] = [];
    bySport[sport].push(row);
  }
  // Sort each sport's wallets by score desc.
  for (const sport of Object.keys(bySport)) {
    bySport[sport].sort((x, y) => y.score - x.score);
  }
  return { bySport };
}

// ── Today's wallet positions across every (locked + non-locked) side ──────
//
// Iterates every today pick doc and emits one row per (wallet, side)
// that has a walletDetails entry. Used to (a) attach the "Today's
// positions" column to the wallet leaderboard, (b) compute top-wallet
// alignment, and (c) name top-10 backers in the per-pick evidence cards.
async function loadTodayWalletPositions(today) {
  const out = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '==', today).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock || {};
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const teamLabel = market === 'TOTAL'
          ? (sideKey === 'over' ? `OVER ${peak?.line ?? ''}`.trim() : `UNDER ${peak?.line ?? ''}`.trim())
          : (side.team || (sideKey === 'home' ? d.home : d.away));
        const lockStage = side.lockStage ?? null;
        const isLocked = lockStage === 'LOCKED' && !side.superseded
          && side.health?.status !== 'CANCELLED' && side.health?.status !== 'MUTED';
        for (const w of wd) {
          if (!w?.wallet || !w?.side) continue;
          out.push({
            docId: doc.id,
            sport: d.sport,
            market,
            sideKey: w.side,
            team: w.side === sideKey ? teamLabel : null,  // resolved below
            away: d.away,
            home: d.home,
            wallet: w.wallet,
            invested: Number(w.invested ?? 0),
            sizeRatio: Number(w.sizeRatio ?? 0),
            lockStage,
            isLocked,
          });
        }
      }
      // Backfill the team label for positions whose w.side ≠ the
      // outer sideKey (the wallet bet the OTHER side of this pick doc).
      for (const r of out) {
        if (r.docId !== doc.id) continue;
        if (r.team) continue;
        if (market === 'TOTAL') {
          r.team = r.sideKey === 'over' ? 'OVER' : 'UNDER';
        } else {
          r.team = r.sideKey === 'home' ? d.home : d.away;
        }
      }
    }
  }
  return out;
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  console.log(`Loading historical sample (${V6_CUTOVER}+) and tier lens…`);
  const { profiles, pickRows, sourceABets, sourceBPositions } = await loadHistorical();
  const lens = buildTierLens(sourceABets, sourceBPositions, profiles);
  annotateHistoricalHc(pickRows, lens);
  const stamped = pickRows.filter(r => r.hcSource === 'frozen').length;
  const recomputed = pickRows.filter(r => r.hcSource === 'recomputed').length;
  const missing = pickRows.filter(r => r.hcSource === 'missing').length;
  console.log(`  ${pickRows.length} graded sides · HC: ${stamped} frozen + ${recomputed} recomputed + ${missing} missing`);

  console.log('Building (Σ × HC_m) historical matrix…');
  const matrix = buildSigmaHcMatrix(pickRows);
  console.log(`  Eligible historical rows: ${matrix.totalEligible} · sports: ${matrix.sports.join(', ')}`);

  console.log('Building AGS-tier historical matrix…');
  const agsMatrix = buildAgsMatrix(pickRows);
  console.log(`  Eligible historical rows (with v8_ags stamp): ${agsMatrix.totalEligible} · sports: ${agsMatrix.sports.join(', ')}`);

  console.log('Building per-sport wallet leaderboard…');
  const leaderboard = buildWalletLeaderboardBySport(sourceABets, sourceBPositions, lens, today);
  const TOP_N_PER_SPORT = 10;
  const topWalletsBySport = {};   // sport → Set<walletShort> for the top-N
  for (const sport of Object.keys(leaderboard.bySport)) {
    topWalletsBySport[sport] = new Set(leaderboard.bySport[sport].slice(0, TOP_N_PER_SPORT).map(r => r.walletShort));
  }
  console.log(`  ranked wallets in ${Object.keys(leaderboard.bySport).length} sport(s) · top-${TOP_N_PER_SPORT} sizes: ${Object.entries(topWalletsBySport).map(([s, set]) => `${s}=${set.size}`).join(' · ')}`);

  console.log(`\nLoading today's LOCKED picks (${today})…`);
  const todayPicks = await loadTodayLocked(today, lens);
  if (!todayPicks.length) {
    console.log('No LOCKED picks for today.');
    process.exit(0);
  }

  console.log('Loading today\'s wallet positions for top-wallet attribution…');
  const todayPositions = await loadTodayWalletPositions(today);
  const todayPosByWallet = new Map();   // walletShort → [positions]
  for (const p of todayPositions) {
    const k = String(p.wallet);
    if (!todayPosByWallet.has(k)) todayPosByWallet.set(k, []);
    todayPosByWallet.get(k).push(p);
  }
  console.log(`  ${todayPositions.length} wallet positions across today's picks`);

  // Score + cell-lookup every pick.
  for (const p of todayPicks) {
    p.score = compositeScore(p);
    const sb = sigmaBucket(p.sum);
    const hb = hcBucket(p.hcMargin);
    const sportMatrix = matrix.bySport[p.sport] || null;
    p.cellAll   = (matrix.all[sb] && matrix.all[sb][hb]) || null;
    p.cellSport = (sportMatrix && sportMatrix[sb] && sportMatrix[sb][hb]) || null;
    p.bandSigmaAll = (matrix.all[sb] && matrix.all[sb].ALL) || null;
    p.bandHcAll    = (matrix.all.ALL && matrix.all.ALL[hb]) || null;
    p.bandSigmaSport = (sportMatrix && sportMatrix[sb] && sportMatrix[sb].ALL) || null;
    p.bandHcSport    = (sportMatrix && sportMatrix.ALL && sportMatrix.ALL[hb]) || null;

    // AGS tier cell — historical WR / ROI for the bucket this pick lives in.
    const at = agsTierBucket(p.ags);
    const agsSportMatrix = agsMatrix.bySport[p.sport] || null;
    p.agsBucket = at;
    p.agsCellAll   = at ? (agsMatrix.all[at] || null) : null;
    p.agsCellSport = (at && agsSportMatrix) ? (agsSportMatrix[at] || null) : null;
    // Cumulative cohort lookup — which "AGS ≥ X" floor does this pick clear?
    p.agsCohortAll = (p.ags != null && Number.isFinite(p.ags))
      ? (p.ags >= 7 ? agsMatrix.all['AGS≥+7']
        : p.ags >= 5 ? agsMatrix.all['AGS≥+5']
        : p.ags >= 3 ? agsMatrix.all['AGS≥+3']
        : p.ags >= 0 ? agsMatrix.all['AGS≥0']
        : p.ags >= -1 ? agsMatrix.all['AGS<0']
        : agsMatrix.all['AGS<-1'])
      : null;
  }
  todayPicks.sort((a, b) => b.score - a.score);

  // ── Header ───────────────────────────────────────────────────────────
  console.log(`\n══════════════════════════════════════════════════════════════════════════════`);
  console.log(`  v7.3 TOP PICKS — ranked by HC margin → Σ → Δw  ·  ${today}`);
  console.log(`══════════════════════════════════════════════════════════════════════════════`);
  console.log(`Score weights: HC_m ≥+2 → +1500 · HC_m=+1 → +1000 · HC_m=0 → 0 · HC_m=−1 → −800 · HC_m≤−2 → −1500`);
  console.log(`              + Σ ≥+7 → +600 · Σ ∈ {5,6} → +400 · Σ ∈ {3,4} → +200 · Σ ∈ {1,2} → +50`);
  console.log(`              + Δw × 30  (third tie-break)`);
  console.log(`Cell columns are historical N · W-L · WR% · flat ROI% from the v6+ universe (recomputed via point-in-time tier lens).`);
  console.log('');

  // ── Ranked table ─────────────────────────────────────────────────────
  console.log(
    pad('RK', 3) + ' | ' +
    pad('Score', 6) + ' | ' +
    pad('Pick', 38) + ' | ' +
    pad('★', 4) + '| ' +
    pad('u', 5) + '| ' +
    pad('Odds', 6) + ' | ' +
    pad('Σ', 4) + '| ' +
    pad('Δw', 4) + '| ' +
    pad('Δq', 4) + '| ' +
    pad('HC_m', 5) + '| ' +
    pad('AGS', 7) + '| ' +
    pad('AGS-N', 6) + '| ' +
    pad('Cell ALL (Σ×HC)', 22) + ' | ' +
    pad(`Cell ${'<sport>'} (Σ×HC)`, 22) + ' | ' +
    pad('promotedBy', 18)
  );
  console.log('-'.repeat(190));
  const fmtAgs = (a) => (a == null || !Number.isFinite(a)) ? '—' : (a >= 0 ? '+' : '') + a.toFixed(2);
  todayPicks.forEach((p, i) => {
    const sportTag = `[${p.sport}]`;
    const pickStr = `${sportTag} ${p.market} ${p.team}`;
    const cellAllLbl   = fmtCell(p.cellAll);
    const cellSportLbl = fmtCell(p.cellSport);
    const agsNlbl = (p.agsForN == null && p.agsAgN == null) ? '—' : `${p.agsForN ?? 0}v${p.agsAgN ?? 0}`;
    console.log(
      padR(i + 1, 3) + ' | ' +
      padR(p.score, 6) + ' | ' +
      pad(pickStr, 38) + ' | ' +
      pad(p.stars, 4) + '| ' +
      pad((p.units ?? 0).toFixed(2), 5) + '| ' +
      pad((p.odds >= 0 ? '+' : '') + p.odds, 6) + ' | ' +
      pad(sign(p.sum, 0), 4) + '| ' +
      pad(sign(p.dw, 0), 4) + '| ' +
      pad(sign(p.dq, 0), 4) + '| ' +
      pad((p.hcMargin >= 0 ? '+' : '') + p.hcMargin, 5) + '| ' +
      pad(fmtAgs(p.ags), 7) + '| ' +
      pad(agsNlbl, 6) + '| ' +
      pad(cellAllLbl, 22) + ' | ' +
      pad(cellSportLbl, 22) + ' | ' +
      pad(p.promotedBy ?? '—', 18)
    );
  });
  console.log('');

  // ── Per-pick evidence cards ─────────────────────────────────────────
  console.log('══════════════════════════════════════════════════════════════════════════════');
  console.log('  PER-PICK EVIDENCE — what does the criteria actually do historically?');
  console.log('══════════════════════════════════════════════════════════════════════════════');
  todayPicks.forEach((p, i) => {
    const sb = sigmaBucket(p.sum);
    const hb = hcBucket(p.hcMargin);
    console.log(`\n  #${i + 1}  [${p.sport}] ${p.market}  ${p.team}  @ ${p.odds >= 0 ? '+' : ''}${p.odds}  (${p.book})`);
    console.log(`         tier=${p.lockTier}  ${p.stars}★  ${p.units}u  · promotedBy=${p.promotedBy ?? '—'}  · score=${p.score}`);
    console.log(`         Σ=${sign(p.sum, 0)} (Δw=${sign(p.dw, 0)} · Δq=${sign(p.dq, 0)})  · HC_m=${(p.hcMargin >= 0 ? '+' : '') + p.hcMargin} (HC for=${p.hcConfFor} ag=${p.hcConfAg})  · HC source=${p.hcSource}`);
    const agsLbl = (p.ags == null || !Number.isFinite(p.ags)) ? '—' : (p.ags >= 0 ? '+' : '') + p.ags.toFixed(2);
    const agsTierLbl = p.agsTier ?? '—';
    const agsCountLbl = (p.agsForN == null && p.agsAgN == null) ? '—' : `for=${p.agsForN ?? 0} ag=${p.agsAgN ?? 0}`;
    const agsMultLbl = (p.agsUnitsMult != null && p.agsUnitsMult !== 1) ? ` · units×${p.agsUnitsMult.toFixed(2)}` : '';
    console.log(`         AGS=${agsLbl} (tier=${agsTierLbl} · proven ${agsCountLbl}${agsMultLbl})`);
    // Historical AGS-tier WR/ROI cohort this pick belongs to.
    const agsTierBkt = p.agsBucket ?? '—';
    const agsCellLbl   = fmtCell(p.agsCellAll);
    const agsSportLbl  = fmtCell(p.agsCellSport);
    const agsCohortLbl = fmtCell(p.agsCohortAll);
    console.log(`         AGS historical (${agsMatrix.totalEligible} stamped graded rows):`);
    console.log(`           • Tier ALL · ${agsTierBkt.padEnd(7)}        :  ${agsCellLbl}`);
    console.log(`           • Tier ${p.sport.padEnd(3)} · ${agsTierBkt.padEnd(7)}        :  ${agsSportLbl}`);
    console.log(`           • Cohort floor cleared          :  ${agsCohortLbl}`);
    console.log(`         Historical evidence (${matrix.totalEligible} graded rows, v6+):`);
    console.log(`           • Cell  ALL · ${sb} ∧ ${hb}     :  ${fmtCell(p.cellAll)}`);
    console.log(`           • Cell  ${p.sport.padEnd(3)} · ${sb} ∧ ${hb}     :  ${fmtCell(p.cellSport)}`);
    console.log(`           • Σ band ALL · ${sb} (any HC)   :  ${fmtCell(p.bandSigmaAll)}`);
    console.log(`           • Σ band ${p.sport.padEnd(3)} · ${sb} (any HC)   :  ${fmtCell(p.bandSigmaSport)}`);
    console.log(`           • HC band ALL · ${hb} (any Σ)   :  ${fmtCell(p.bandHcAll)}`);
    console.log(`           • HC band ${p.sport.padEnd(3)} · ${hb} (any Σ)   :  ${fmtCell(p.bandHcSport)}`);
    if (p.v73HcRescue) console.log(`         · v7.3 RESCUED — HC margin overrode dw=0 / dq=0 / sum<3 mute (cohort: 11-2, +85% ROI, p=0.006)`);

    // Top-10 wallet attribution — for the FOR side and the AG side of
    // this pick, list which top-10 wallets (per this sport's leaderboard)
    // are positioned on each side. Lets you see at a glance whether the
    // proven roster is endorsing this side or the opposing side. Picks
    // that have the proven leaderboard backing them stack the deck.
    const topSet = topWalletsBySport[p.sport] || new Set();
    if (Array.isArray(p.walletDetailsLite) && p.walletDetailsLite.length) {
      const forBackers = p.walletDetailsLite.filter(w => w.side === p.sideKey && topSet.has(w.wallet));
      const agBackers  = p.walletDetailsLite.filter(w => w.side !== p.sideKey && topSet.has(w.wallet));
      const fmtBackerList = (list) => {
        if (!list.length) return '(none in top-10)';
        return list.map(w => {
          const tag = w.sizeRatio >= 1.5 ? `[HC ${w.sizeRatio.toFixed(1)}×]` : '';
          const dollar = w.invested > 0 ? ` $${(w.invested / 1000).toFixed(1)}K` : '';
          return `...${w.wallet.slice(-4)}${dollar}${tag}`;
        }).join(', ');
      };
      console.log(`         Top-10 ${p.sport} wallet backing:`);
      console.log(`           • FOR (${p.sideKey}): ${forBackers.length}/${topSet.size} → ${fmtBackerList(forBackers)}`);
      console.log(`           • AG  (other):     ${agBackers.length}/${topSet.size} → ${fmtBackerList(agBackers)}`);
    }
  });

  // ── Cohort rollup ────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════════════════════');
  console.log('  COHORT ROLLUP — how do today\'s picks split on the strongest signal?');
  console.log('══════════════════════════════════════════════════════════════════════════════');
  const groups = [
    ['SUPER-HC (HC_m ≥ +2)',   p => p.hcMargin >= 2],
    ['STANDARD-HC (HC_m = +1)', p => p.hcMargin === 1],
    ['NO HC (HC_m = 0)',        p => p.hcMargin === 0],
    ['HC FADE (HC_m ≤ -1)',    p => p.hcMargin <= -1],
  ];
  for (const [label, pred] of groups) {
    const rows = todayPicks.filter(pred);
    const ref = matrix.all.ALL[hcBucket(rows[0]?.hcMargin) ?? 'HC≤0'];
    const refLbl = rows.length && ref ? `  (cohort historical: ${fmtCell(ref)})` : '';
    console.log(`  ${label}: ${rows.length} picks${refLbl}`);
    rows.forEach(p => console.log(`     · [${p.sport}] ${p.market} ${p.team}  Σ=${sign(p.sum, 0)}  Δw=${sign(p.dw, 0)}  HC_m=${p.hcMargin >= 0 ? '+' : ''}${p.hcMargin}  score=${p.score}`));
  }

  // ── Σ ladder rollup ─────────────────────────────────────────────────
  console.log('');
  const sigmaGroups = [
    ['Σ ≥ +7  (ELITE)',         p => p.sum >= 7],
    ['Σ ∈ {5,6} (LOCKED ladder)', p => p.sum === 5 || p.sum === 6],
    ['Σ ∈ {3,4} (hybrid floor)',  p => p.sum === 3 || p.sum === 4],
    ['Σ ∈ {1,2} (v7.3 HC-only floor)', p => p.sum === 1 || p.sum === 2],
    ['Σ ≤ 0   (rescued)',         p => p.sum <= 0],
  ];
  for (const [label, pred] of sigmaGroups) {
    const rows = todayPicks.filter(pred);
    if (!rows.length) continue;
    const sb = sigmaBucket(rows[0].sum);
    const ref = matrix.all[sb] ? matrix.all[sb].ALL : null;
    const refLbl = ref ? `  (cohort historical: ${fmtCell(ref)})` : '';
    console.log(`  ${label}: ${rows.length} picks${refLbl}`);
    rows.forEach(p => console.log(`     · [${p.sport}] ${p.market} ${p.team}  Σ=${sign(p.sum, 0)}  HC_m=${p.hcMargin >= 0 ? '+' : ''}${p.hcMargin}  score=${p.score}`));
  }

  // ── AGS tier rollup ──────────────────────────────────────────────────
  // Two views: tier breakdown of today's picks, and the cumulative
  // threshold ladder (AGS ≥ +7 / +5 / +3 / 0 / <0 / <-1) so you can see
  // how today's picks stack against the v7.5 calibration cohorts.
  console.log('\n══════════════════════════════════════════════════════════════════════════════');
  console.log(`  AGS TIER ROLLUP — historical WR / ROI by AGS bucket  (n=${agsMatrix.totalEligible} stamped graded rows)`);
  console.log('══════════════════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  AGS-TIER MATRIX (all sports pooled):');
  console.log('  ' + pad('Tier', 9) + '| ' + pad('Range', 14) + '| ' + pad('N', 4) + '| ' + pad('W-L', 8) + '| ' + pad('WR%', 7) + '| ' + pad('flat ROI', 10) + '| ' + pad('avg AGS', 9));
  console.log('  ' + '-'.repeat(70));
  const tierRanges = {
    ELITE:   '≥ +7',
    LOCK:    '+5 … +7',
    STRONG:  '+3 … +5',
    NEUTRAL: '0 … +3',
    WEAK:    '-3 … 0',
    FADE:    '< -3',
  };
  for (const tier of AGS_TIER_BUCKETS) {
    const c = agsMatrix.all[tier];
    if (!c) continue;
    const wl = c.n > 0 ? `${c.wins}-${c.losses}` : '—';
    const wr = c.wr != null ? c.wr.toFixed(1) + '%' : '—';
    const roi = c.flatRoi != null ? sign(c.flatRoi, 1) + '%' : '—';
    const avgAgs = c.agsAvg != null ? sign(c.agsAvg, 2) : '—';
    console.log('  ' + pad(tier, 9) + '| ' + pad(tierRanges[tier] || '—', 14) + '| ' + padR(c.n, 4) + '| ' + pad(wl, 8) + '| ' + pad(wr, 7) + '| ' + pad(roi, 10) + '| ' + pad(avgAgs, 9));
  }
  console.log('');
  console.log('  CUMULATIVE THRESHOLD LADDER (matches v7.5 calibration header):');
  console.log('  ' + pad('Threshold', 12) + '| ' + pad('N', 4) + '| ' + pad('W-L', 8) + '| ' + pad('WR%', 7) + '| ' + pad('flat ROI', 10));
  console.log('  ' + '-'.repeat(56));
  for (const cohortKey of ['AGS≥+7', 'AGS≥+5', 'AGS≥+3', 'AGS≥0', 'AGS<0', 'AGS<-1']) {
    const c = agsMatrix.all[cohortKey];
    if (!c) continue;
    const wl = c.n > 0 ? `${c.wins}-${c.losses}` : '—';
    const wr = c.wr != null ? c.wr.toFixed(1) + '%' : '—';
    const roi = c.flatRoi != null ? sign(c.flatRoi, 1) + '%' : '—';
    console.log('  ' + pad(cohortKey, 12) + '| ' + padR(c.n, 4) + '| ' + pad(wl, 8) + '| ' + pad(wr, 7) + '| ' + pad(roi, 10));
  }
  console.log('');
  console.log('  TODAY\'S PICKS BY AGS TIER:');
  for (const tier of AGS_TIER_BUCKETS) {
    const rows = todayPicks.filter(p => p.agsBucket === tier);
    if (!rows.length) continue;
    const ref = agsMatrix.all[tier];
    const refLbl = ref && ref.n > 0 ? `  (cohort historical: ${fmtCell(ref)})` : '';
    console.log(`  ${tier} (${tierRanges[tier]}): ${rows.length} pick(s)${refLbl}`);
    rows.forEach(p => {
      const agsLbl = (p.ags >= 0 ? '+' : '') + p.ags.toFixed(2);
      console.log(`     · [${p.sport}] ${p.market} ${p.team}  AGS=${agsLbl}  Σ=${sign(p.sum, 0)}  HC_m=${p.hcMargin >= 0 ? '+' : ''}${p.hcMargin}  score=${p.score}`);
    });
  }
  const noAgs = todayPicks.filter(p => p.ags == null || !Number.isFinite(p.ags));
  if (noAgs.length) {
    console.log(`  NO AGS STAMP: ${noAgs.length} pick(s)  (older v6 docs without v8_ags written; will be backfilled by next cron cycle)`);
    noAgs.forEach(p => console.log(`     · [${p.sport}] ${p.market} ${p.team}  Σ=${sign(p.sum, 0)}  HC_m=${p.hcMargin >= 0 ? '+' : ''}${p.hcMargin}  score=${p.score}`));
  }

  // ── Per-market all-sides breakdown ────────────────────────────────────
  // Every game-market's BOTH sides, regardless of lockStage / health, sorted
  // by AGS desc within each market. This is the comprehensive view of where
  // each market stands tonight on the three core consensus signals: AGS
  // (quality-weighted), HC margin (high-conviction count), Δw (proven-winner
  // depth). Sides with no proven activity render as "—".
  console.log('\n══════════════════════════════════════════════════════════════════════════════');
  console.log('  PER-MARKET BREAKDOWN — every side, sorted by AGS desc');
  console.log('══════════════════════════════════════════════════════════════════════════════');
  const allSides = await loadAllSidesForToday(today);
  // Sort key: AGS desc (null AGS sinks to bottom), then HC margin desc, then Δw desc.
  const sortKey = (a, b) => {
    const aAgs = (a.ags == null || !Number.isFinite(a.ags)) ? -Infinity : a.ags;
    const bAgs = (b.ags == null || !Number.isFinite(b.ags)) ? -Infinity : b.ags;
    if (bAgs !== aAgs) return bAgs - aAgs;
    const aHc = a.hcMargin ?? -Infinity;
    const bHc = b.hcMargin ?? -Infinity;
    if (bHc !== aHc) return bHc - aHc;
    return (b.dw ?? -Infinity) - (a.dw ?? -Infinity);
  };

  const sideLabel = (r) => {
    if (r.market === 'TOTAL') {
      return r.sideKey === 'over' ? `[${r.sport}] OVER  ${r.away}@${r.home}` : `[${r.sport}] UNDER ${r.away}@${r.home}`;
    }
    const team = r.team || (r.sideKey === 'home' ? r.home : r.away);
    const opp  = r.sideKey === 'home' ? r.away : r.home;
    const tag = r.market === 'ML' ? 'ML' : 'SPRD';
    return `[${r.sport}] ${tag} ${team} (vs ${opp})`;
  };
  const fmtNum = (v, d = 0) => (v == null || Number.isNaN(v)) ? '—' : (v >= 0 ? '+' : '') + Number(v).toFixed(d);
  const fmtAgsCol = (v) => (v == null || !Number.isFinite(v)) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2);
  const fmtN = (f, a) => (f == null && a == null) ? '—' : `${f ?? 0}v${a ?? 0}`;
  const fmtState = (r) => {
    if (r.superseded) return 'SUPERSEDED';
    const parts = [];
    if (r.lockStage) parts.push(r.lockStage);
    if (r.health && r.health !== 'OK') parts.push(r.health);
    return parts.length ? parts.join('/') : '—';
  };

  for (const market of ['ML', 'SPREAD', 'TOTAL']) {
    const rows = allSides.filter(r => r.market === market).sort(sortKey);
    if (!rows.length) {
      console.log(`\n  ${market}: (no sides today)`);
      continue;
    }
    console.log(`\n  ${market} — ${rows.length} side(s)`);
    console.log('  ' + pad('Side', 42) + '| ' + pad('AGS', 7) + '| ' + pad('AGS Tier', 8) + '| ' + pad('AGS-N', 6) + '| ' + pad('HC_m', 5) + '| ' + pad('HC-N', 6) + '| ' + pad('Δw', 4) + '| ' + pad('Δq', 4) + '| ' + pad('★', 4) + '| ' + pad('u', 5) + '| ' + pad('State', 18));
    console.log('  ' + '-'.repeat(130));
    for (const r of rows) {
      console.log(
        '  ' + pad(sideLabel(r), 42) + '| ' +
        pad(fmtAgsCol(r.ags), 7) + '| ' +
        pad(r.agsTier ?? '—', 8) + '| ' +
        pad(fmtN(r.agsForN, r.agsAgN), 6) + '| ' +
        pad(fmtNum(r.hcMargin, 0), 5) + '| ' +
        pad(fmtN(r.hcConfFor, r.hcConfAg), 6) + '| ' +
        pad(fmtNum(r.dw, 0), 4) + '| ' +
        pad(fmtNum(r.dq, 0), 4) + '| ' +
        pad((r.stars ?? 0).toString(), 4) + '| ' +
        pad((r.units ?? 0).toFixed(2), 5) + '| ' +
        pad(fmtState(r), 18),
      );
    }
  }

  // ── Top wallets by sport — leaderboard + today's positions ──────────
  //
  // For each sport: rank every wallet that has any history in that sport
  // by WalletScore, show the top 10 with their core stats, and inline the
  // wallet's positions on tonight's picks (locked or not). Then a roll-up
  // of "top-wallet alignment" — picks where ≥3 of the per-sport top-10
  // wallets agree on the same side. This is the wallet-centric view of
  // tonight's action: "where are the proven wallets putting their money."
  console.log('\n══════════════════════════════════════════════════════════════════════════════');
  console.log('  TOP WALLETS BY SPORT — leaderboard + today\'s positions');
  console.log('══════════════════════════════════════════════════════════════════════════════');
  console.log('  WalletScore = flatRoi × min(1, n/5) + 0.5 × $ROI + tierBonus + recencyBonus');
  console.log('                tierBonus: CONFIRMED=+20, FLAT=+10, WR50=0, untracked=−10');
  console.log('                recencyBonus: 0 if last bet ≤ 30d, else −10');
  console.log('');

  // (leaderboard + topWalletsBySport were built earlier so the per-pick
  // evidence cards could already reference them — see top of main().)
  // Show every sport that has any wallet history — not just the sports
  // that have locked picks today — so the user can see the full
  // proven-roster picture across NBA / NHL / MLB regardless.
  const allSportsToShow = Object.keys(leaderboard.bySport).sort();

  const fmtPosOne = (p) => {
    // Compact "MARKET TEAM @odds (LOCKED?)" representation.
    const lockTag = p.isLocked ? '★' : ' ';
    const sizeTag = p.sizeRatio >= 1.5 ? `[HC ${p.sizeRatio.toFixed(1)}×]` : '';
    const dollarTag = p.invested > 0 ? ` $${(p.invested / 1000).toFixed(1)}K` : '';
    return `${lockTag}${p.market} ${p.team}${dollarTag}${sizeTag}`;
  };

  for (const sport of allSportsToShow) {
    const rows = (leaderboard.bySport[sport] || []).slice(0, TOP_N_PER_SPORT);
    console.log(`  [${sport}]  Top ${rows.length} wallets`);
    if (!rows.length) {
      console.log('         (no wallet history in this sport)');
      console.log('');
      continue;
    }
    console.log('  ' +
      pad('RK', 3) + '| ' +
      pad('Wallet', 9) + '| ' +
      pad('Tier', 9) + '| ' +
      pad('n', 4) + '| ' +
      pad('W-L', 7) + '| ' +
      pad('WR%', 6) + '| ' +
      pad('flat ROI', 9) + '| ' +
      pad('flat PnL', 9) + '| ' +
      pad('$ ROI', 7) + '| ' +
      pad('Last', 8) + '| ' +
      pad('Score', 7) + '| Today');
    console.log('  ' + '-'.repeat(170));
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const walletLbl = `...${r.walletShort.slice(-4)}`;
      const wlLbl = r.n ? `${r.wins}-${r.losses}` : '—';
      const wrLbl = r.wr != null ? r.wr.toFixed(0) + '%' : '—';
      const flatRoiLbl = r.flatRoi != null ? sign(r.flatRoi, 0) + '%' : '—';
      const flatPnlLbl = sign(r.flatPnl, 1) + 'u';
      const dollarRoiLbl = r.dollarRoi != null ? sign(r.dollarRoi, 0) + '%' : '—';
      const lastLbl = r.daysSince != null ? `${r.daysSince}d` : '—';
      const scoreLbl = sign(r.score, 1);
      const positions = (todayPosByWallet.get(r.walletShort) || []).filter(p => p.sport === sport);
      const todayLbl = positions.length
        ? positions.slice(0, 3).map(fmtPosOne).join(', ') + (positions.length > 3 ? `, +${positions.length - 3} more` : '')
        : '—';
      console.log(
        '  ' +
        padR(i + 1, 3) + '| ' +
        pad(walletLbl, 9) + '| ' +
        pad(r.tier, 9) + '| ' +
        padR(r.n, 4) + '| ' +
        pad(wlLbl, 7) + '| ' +
        pad(wrLbl, 6) + '| ' +
        pad(flatRoiLbl, 9) + '| ' +
        pad(flatPnlLbl, 9) + '| ' +
        pad(dollarRoiLbl, 7) + '| ' +
        pad(lastLbl, 8) + '| ' +
        pad(scoreLbl, 7) + '| ' +
        todayLbl,
      );
    }
    console.log('');
  }
  console.log('  Legend: ★ = LOCKED today (shipped to users) · plain = present in walletDetails but pick not locked');
  console.log('          [HC X.X×] = wallet bet at X.X× their typical size (high-conviction)');

  // ── Top-wallet alignment — sides where ≥3 top-10 wallets agree ──────
  //
  // For each today's pick side, count how many wallets from that sport's
  // top-10 are positioned on it. Sides with ≥3 alignment are surfaced
  // as "consensus picks" — the engine's signal AND the wallet
  // leaderboard agree.
  console.log('\n══════════════════════════════════════════════════════════════════════════════');
  console.log('  TOP-WALLET ALIGNMENT — today\'s sides where ≥3 top-10 wallets agree');
  console.log('══════════════════════════════════════════════════════════════════════════════');
  // Group today positions by (docId, sideKey), count distinct top-N wallets.
  const alignBySide = new Map();   // key = `${docId}|${sideKey}` → { sport, market, team, away, home, wallets:Set, dollarTotal, isLocked }
  for (const p of todayPositions) {
    const topSet = topWalletsBySport[p.sport];
    if (!topSet || !topSet.has(p.wallet)) continue;
    const key = `${p.docId}|${p.sideKey}`;
    let bucket = alignBySide.get(key);
    if (!bucket) {
      bucket = {
        sport: p.sport, market: p.market, sideKey: p.sideKey,
        team: p.team, away: p.away, home: p.home,
        wallets: new Set(), dollarTotal: 0, isLocked: false,
      };
      alignBySide.set(key, bucket);
    }
    bucket.wallets.add(p.wallet);
    bucket.dollarTotal += p.invested;
    if (p.isLocked) bucket.isLocked = true;
  }
  const alignRows = [...alignBySide.values()]
    .filter(b => b.wallets.size >= 3)
    .sort((a, b) => b.wallets.size - a.wallets.size || b.dollarTotal - a.dollarTotal);
  if (!alignRows.length) {
    console.log('  (none — no side has ≥3 top-10 wallets aligned today)');
  } else {
    for (const r of alignRows) {
      const matchupTag = r.market === 'TOTAL' ? `${r.away}@${r.home}` : `${r.away}@${r.home}`;
      const lockTag = r.isLocked ? '★ LOCKED' : 'not locked';
      const wList = [...r.wallets].slice(0, 6).map(w => `...${w.slice(-4)}`).join(', ');
      const moreTag = r.wallets.size > 6 ? `, +${r.wallets.size - 6} more` : '';
      console.log(`  • [${r.sport}] ${r.market} ${r.team} (${matchupTag}) — ${r.wallets.size} top-10 wallets, $${(r.dollarTotal / 1000).toFixed(1)}K total · ${lockTag}`);
      console.log(`         backers: ${wList}${moreTag}`);
    }
  }

  // ── Persist a machine-readable snapshot ─────────────────────────────
  const publicDir = join(REPO_ROOT, 'public');
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
  const outPath = join(publicDir, 'top_picks_ranked.json');
  writeFileSync(outPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    today,
    sample: { totalRows: pickRows.length, eligible: matrix.totalEligible, frozen: stamped, recomputed, missing },
    weights: {
      hc:    { '+2': 1500, '+1': 1000, '0': 0, '-1': -800, '-2': -1500 },
      sigma: { '7+': 600, '5_6': 400, '3_4': 200, '1_2': 50, '<=0': 0 },
      dw:    30,
    },
    picks: todayPicks.map(p => ({
      sport: p.sport, market: p.market, team: p.team, away: p.away, home: p.home,
      stars: p.stars, units: p.units, odds: p.odds, book: p.book,
      lockTier: p.lockTier, promotedBy: p.promotedBy, v73HcRescue: p.v73HcRescue,
      sum: p.sum, dw: p.dw, dq: p.dq,
      hcMargin: p.hcMargin, hcConfFor: p.hcConfFor, hcConfAg: p.hcConfAg, hcSource: p.hcSource,
      ags: p.ags, agsTier: p.agsTier, agsBucket: p.agsBucket,
      agsForN: p.agsForN, agsAgN: p.agsAgN, agsUnitsMult: p.agsUnitsMult,
      score: p.score,
      cellAll: p.cellAll, cellSport: p.cellSport,
      bandSigmaAll: p.bandSigmaAll, bandSigmaSport: p.bandSigmaSport,
      bandHcAll: p.bandHcAll, bandHcSport: p.bandHcSport,
      agsCellAll: p.agsCellAll, agsCellSport: p.agsCellSport, agsCohortAll: p.agsCohortAll,
    })),
    walletLeaderboard: {
      // Per-sport top-N wallet ranking + each wallet's positions on
      // today's pick sides. WalletScore formula documented in the
      // script header (rankTopPicks.js → buildWalletLeaderboardBySport).
      topNPerSport: TOP_N_PER_SPORT,
      bySport: Object.fromEntries(allSportsToShow.map(sport => [
        sport,
        (leaderboard.bySport[sport] || []).slice(0, TOP_N_PER_SPORT).map(r => ({
          ...r,
          todayPositions: (todayPosByWallet.get(r.walletShort) || [])
            .filter(p => p.sport === sport)
            .map(p => ({
              docId: p.docId, market: p.market, sideKey: p.sideKey,
              team: p.team, away: p.away, home: p.home,
              invested: p.invested, sizeRatio: p.sizeRatio,
              lockStage: p.lockStage, isLocked: p.isLocked,
            })),
        })),
      ])),
      alignmentHotSpots: alignRows.map(r => ({
        sport: r.sport, market: r.market, sideKey: r.sideKey,
        team: r.team, away: r.away, home: r.home,
        topWalletCount: r.wallets.size,
        wallets: [...r.wallets],
        dollarTotal: r.dollarTotal,
        isLocked: r.isLocked,
      })),
    },
    agsMatrix: {
      all: agsMatrix.all,
      bySport: agsMatrix.bySport,
      totalEligible: agsMatrix.totalEligible,
      sports: agsMatrix.sports,
    },
    // Per-market all-sides snapshot — every today doc's BOTH sides regardless
    // of lockStage / health, with AGS / HC / Δw / Δq stamped fields. Sorted
    // by AGS desc within each market. Mirrors the bottom console section.
    perMarketSides: {
      ML:     allSides.filter(r => r.market === 'ML').sort(sortKey).map(r => ({ docId: r.docId, sport: r.sport, sideKey: r.sideKey, team: r.team, away: r.away, home: r.home, ags: r.ags, agsTier: r.agsTier, agsForN: r.agsForN, agsAgN: r.agsAgN, hcMargin: r.hcMargin, hcConfFor: r.hcConfFor, hcConfAg: r.hcConfAg, dw: r.dw, dq: r.dq, stars: r.stars, units: r.units, lockStage: r.lockStage, health: r.health, superseded: r.superseded, fromAgsBothSides: r.fromAgsBothSides })),
      SPREAD: allSides.filter(r => r.market === 'SPREAD').sort(sortKey).map(r => ({ docId: r.docId, sport: r.sport, sideKey: r.sideKey, team: r.team, away: r.away, home: r.home, ags: r.ags, agsTier: r.agsTier, agsForN: r.agsForN, agsAgN: r.agsAgN, hcMargin: r.hcMargin, hcConfFor: r.hcConfFor, hcConfAg: r.hcConfAg, dw: r.dw, dq: r.dq, stars: r.stars, units: r.units, lockStage: r.lockStage, health: r.health, superseded: r.superseded, fromAgsBothSides: r.fromAgsBothSides })),
      TOTAL:  allSides.filter(r => r.market === 'TOTAL').sort(sortKey).map(r => ({ docId: r.docId, sport: r.sport, sideKey: r.sideKey, team: r.team, away: r.away, home: r.home, ags: r.ags, agsTier: r.agsTier, agsForN: r.agsForN, agsAgN: r.agsAgN, hcMargin: r.hcMargin, hcConfFor: r.hcConfFor, hcConfAg: r.hcConfAg, dw: r.dw, dq: r.dq, stars: r.stars, units: r.units, lockStage: r.lockStage, health: r.health, superseded: r.superseded, fromAgsBothSides: r.fromAgsBothSides })),
    },
  }, null, 2));
  console.log(`\nWrote ${outPath}`);

  console.log('\nLegend / how to read:');
  console.log('  • Score is a composite — HC margin dominates. Higher is better.');
  console.log('  • "Cell ALL" = historical N · W-L · WR · flat ROI for the (Σ × HC_m) cell across ALL sports.');
  console.log('  • "Cell <sport>" = same cell restricted to this pick\'s sport (often thin — read with sample size).');
  console.log('  • Σ band / HC band = the broader bucket the pick lives in if the exact cell is N=0.');
  console.log('  • Per-pick evidence card shows you EXACTLY what the criteria has earned historically.');
  process.exit(0);
})();
