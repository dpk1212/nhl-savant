/**
 * dailyV6Report.js — Sharp Intel v6 master daily report (truthful build).
 *
 * Source of truth:
 *   - Reads the FINAL state of every graded side as it was shipped to users.
 *   - Inclusion rule MIRRORS the live Pick Performance dashboard
 *     (`loadAllTimePnL` → `processSide`):
 *
 *       NOT superseded
 *       AND health.status ≠ 'MUTED'
 *       AND health.status ≠ 'CANCELLED'
 *       AND lockStage ≠ 'SHADOW'
 *       AND peak.stars ≥ 2.5
 *
 *   - PnL = peak.units (matches what the dashboard headline / chart show).
 *   - Cohort tags (1/1, 2/2, MUTE Δw=0, etc.) come from the FROZEN stamps
 *     on the side doc:
 *
 *       v8_walletConsensusDelta            (Δw at last write before T-15)
 *       v8_walletConsensusQualityMargin    (Δq at last write; falls back to
 *                                           contribution-based recompute on
 *                                           older docs — Δq is a property of
 *                                           the frozen positions and does
 *                                           not drift with the whitelist.)
 *       v8_vaultStar                       (frozen vault-star)
 *
 *   - NOTHING is recomputed against today's `sharpWalletProfiles`. We can't
 *     time-travel and re-bet the past. The previous version of this report
 *     did exactly that and as a result silently dropped picks whose backing
 *     wallets had been demoted post-lock — survivorship bias that made the
 *     headline look ~+24u when the dashboard said -18u.
 *
 *   - Δq fallback: when v8_walletConsensusQualityMargin is missing on an
 *     older doc, we recompute Δq from `peak.v8Scoring.walletDetails` using
 *     the frozen `contribution ≥ 30` cut. This produces the SAME number
 *     the engine wrote at the time because contribution doesn't change.
 *
 *   - Δw fallback: there is none. If the frozen winner-margin stamp is
 *     missing (≈5% of the v6-era sample), the row is included in §1 totals
 *     but bucketed as `Uncategorized` in cohort tables. We do not recompute
 *     Δw against today's whitelist because that is the bug we just removed.
 *
 * Sections (post-2026-05-05 simplification — at the user's direction):
 *   §1. Yesterday's picks — every shipped side from the most recent slate
 *       with HC margin / Δw / Δq / outcome / peak-unit profit. This is the
 *       "what happened last night" board.
 *   §2. 3-day / 7-day / all-time cohort rollups partitioned by HC margin,
 *       Δw (winner margin) and Δq (quality margin). N · W-L-P · WR · PnL.
 *   §3. Edge-over-time chart — daily cumulative peak-unit PnL split by HC
 *       margin bucket. Answers "is HC margin creating more winners?"
 *   §4. Wallet roster growth & profitability  (formerly §7).
 *   §5. Proven-wallet roster growth & HC tracking — snapshot, drift,
 *       deltas, funnel, HC density, bubble pipeline (formerly §13).
 *
 * Everything else from the legacy report (frozen Δw×Δq cohorts, vault-star
 * buckets, hidden-star performance, anomaly self-check, v7.1/v7.2/v7.3
 * tracking, HC universal monitor) was retired by the user — they wanted a
 * tighter daily that focuses on "did the picks work?" plus the wallet
 * roster growth/tracking telemetry that drives Δ_winner.
 *
 * Output: DAILY_V6_REPORT.md
 *
 * Usage:  node scripts/dailyV6Report.js
 *         node scripts/dailyV6Report.js --min-bets=3   (default 2)
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

// ── Config ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const MIN_BETS_ARG = argv.find(a => a.startsWith('--min-bets='));
const MIN_BETS = MIN_BETS_ARG ? parseInt(MIN_BETS_ARG.split('=')[1], 10) : 2;

const V6_CUTOVER  = '2026-04-18'; // first day with v8Scoring.walletDetails
// HC margin was launched at v7.1 cutover. Pre-cutover picks have no
// HC margin (the feature didn't exist). We only show / aggregate HC
// metrics from this date forward — no retro-fitting backwards.
const HC_CUTOVER  = '2026-04-30';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;          // HC = CONFIRMED tier ∧ sizeRatio ≥ HC_RATIO
const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const VAULT_COLLECTION = 'sharp_action_positions';
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const DW_BUCKETS = [-3, -2, -1, 0, 1, 2, 3];
const DQ_BUCKETS = [-3, -2, -1, 0, 1, 2, 3];
const MIN_N_FOR_ROI = 3;

const STAR_BUCKETS = [
  { label: '5.0★ (ELITE)',     min: 5.0, max: 5.0 },
  { label: '4.5★',             min: 4.5, max: 4.5 },
  { label: '4.0★',             min: 4.0, max: 4.0 },
  { label: '3.5★ (LOCK FLR)',  min: 3.5, max: 3.5 },
  { label: '3.0★',             min: 3.0, max: 3.0 },
  { label: '2.5★',             min: 2.5, max: 2.5 },
  { label: '≤2.0★',            min: 1.0, max: 2.0 },
];

// ── Tiny helpers ────────────────────────────────────────────────────────────
const sign = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`);
const fmtSignPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${sign(v, d)}%`);
const fmtMoneyShort = (v) => {
  if (v == null || Number.isNaN(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${v < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${v < 0 ? '-' : ''}$${(abs / 1_000).toFixed(1)}K`;
  return `${v < 0 ? '-' : ''}$${abs.toFixed(0)}`;
};
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

function quantile(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] != null ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}
function distrib(vals) {
  const s = [...vals].filter(v => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!s.length) return { min: null, q25: null, median: null, q75: null, max: null, mean: null };
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  return { min: s[0], q25: quantile(s, 0.25), median: quantile(s, 0.5), q75: quantile(s, 0.75), max: s[s.length - 1], mean };
}
function dayDiff(d1, d2) {
  const a = new Date(d1 + 'T00:00:00Z').getTime();
  const b = new Date(d2 + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}
function clampDelta(v, lo, hi) { return v <= lo ? lo : (v >= hi ? hi : v); }

// Δq fallback ONLY (not Δw — Δw must come from frozen stamp).
// `walletDetails` is itself frozen on the doc; contribution doesn't change,
// so this gives the same answer the engine wrote at the time.
function qualityMarginFromWalletDetails(walletDetails, sideKey) {
  if (!Array.isArray(walletDetails) || !sideKey) return null;
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CUT) continue;
    if (!d?.side) continue;
    if (d.side === sideKey) qFor++;
    else                    qAg++;
  }
  return qFor - qAg;
}

// ── Main load ──────────────────────────────────────────────────────────────
//
// Returns one row per *graded* side from the three sharpFlow collections
// since v6 cutover. Every row carries:
//
//   Inclusion fields (the dashboard's processSide rule):
//     superseded, lockStage, healthStatus, peakStars, peakUnits
//     inDashboard ← derived bool, true iff we'd render the pick on the page
//
//   Frozen v6 stamps:
//     dwFrozen      — v8_walletConsensusDelta (winner margin)
//     dqFrozen      — v8_walletConsensusQualityMargin OR fallback recompute
//                     from walletDetails (contribution ≥ 30); null only if
//                     walletDetails missing entirely
//     vaultStar     — v8_vaultStar (frozen)
//     dwSource/dqSource — 'frozen' | 'recomputed_from_wallet_details' |
//                          'missing'
//
//   Outcome:
//     outcome   — WIN | LOSS | PUSH
//     profitU   — peak-unit PnL credit/debit (matches dashboard math)
//     odds
//
// Wallet bets array (per wallet × graded game) feeds §7/§8 only.
async function loadEverything() {
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of profSnap.docs) profiles.set(d.id, d.data());

  const pickRows   = [];
  const walletBets = [];
  let totalSidesScanned = 0;
  let dateMin = null, dateMax = null;

  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const sport = d.sport || 'UNK';
      const date  = d.date;

      // Identify the winning side once per game so we can credit wallet
      // bets that landed on either side (used by §7/§8 only).
      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk]?.result?.outcome;
        if (oc === 'WIN')  { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }

      for (const [sideKey, side] of Object.entries(sides)) {
        totalSidesScanned += 1;

        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;

        const peak = side.peak || side.lock || {};
        const peakStars = peak?.stars ?? 0;
        const peakUnits = peak?.units || 1;

        const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds
                  ?? side?.lock?.odds     ?? side?.peak?.odds ?? null;

        // === DASHBOARD INCLUSION RULE ===
        const superseded   = !!side.superseded;
        const lockStage    = side.lockStage || null;
        const healthStatus = side.health?.status || null;
        const cancelled    = superseded
                          || healthStatus === 'CANCELLED'
                          || healthStatus === 'MUTED'
                          || lockStage === 'SHADOW';
        const inDashboard  = !cancelled && peakStars >= 2.5;

        // === FROZEN v6 STAMPS ===
        const dwFrozen = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
        let   dqFrozen = (side.v8_walletConsensusQualityMargin != null) ? Number(side.v8_walletConsensusQualityMargin) : null;
        let   dqSource = dqFrozen != null ? 'frozen' : 'missing';
        const wd = peak?.v8Scoring?.walletDetails;
        if (dqFrozen == null && Array.isArray(wd) && wd.length) {
          const recomputed = qualityMarginFromWalletDetails(wd, sideKey);
          if (recomputed != null) {
            dqFrozen = recomputed;
            dqSource = 'recomputed_from_wallet_details';
          }
        }
        const dwSource = dwFrozen != null ? 'frozen' : 'missing';
        const vaultStar = (side.v8_vaultStar != null) ? Number(side.v8_vaultStar) : null;

        // === DASHBOARD-CONSISTENT PnL (peak units) ===
        let profitU = 0;
        if (oc === 'WIN')  profitU = (side.result?.profit || 0);
        else if (oc === 'LOSS') profitU = -peakUnits;
        // PUSH → 0

        // === FLAT-1u PnL (cohort EV lens) ===
        const flatProfit = (() => {
          if (oc === 'PUSH') return 0;
          if (oc === 'WIN') {
            if (odds == null) return 0.91;
            return odds > 0 ? odds / 100 : 100 / Math.abs(odds);
          }
          return -1;
        })();

        if (date) {
          if (!dateMin || date < dateMin) dateMin = date;
          if (!dateMax || date > dateMax) dateMax = date;
        }

        // v7.1/v7.2 — frozen HC dominance + margin fields. Older docs
        // (pre-v7.1 stamp) do NOT have these and we leave them null. §9/§10
        // cohort tables partition accordingly so we don't false-credit
        // historical picks.
        const hcDominant = (side.v8_hcDominant != null) ? !!side.v8_hcDominant : null;
        const hcConfFor  = (side.v8_hcConfFor != null) ? Number(side.v8_hcConfFor) : null;
        const hcConfAg   = (side.v8_hcConfAg != null) ? Number(side.v8_hcConfAg) : null;
        const hcMargin   = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin)
          : (hcConfFor != null && hcConfAg != null ? (hcConfFor - hcConfAg) : null);
        const systemVersion = side.v8_systemVersion || null;
        const promotedBy = side.promotedBy || null;

        // Lightweight walletDetails stash for §12 hcMargin recompute.
        // We only keep wallet/side/sizeRatio — enough to reconstruct
        // hcConfFor/hcConfAg given a point-in-time tier lens. Roughly
        // 60 bytes per entry × 20 wallets × 240 picks = ~300KB; fine.
        const wdLite = Array.isArray(wd)
          ? wd.filter(w => w?.wallet && w?.side).map(w => ({
              wallet: w.wallet,
              side: w.side,
              sizeRatio: Number(w.sizeRatio ?? 0),
            }))
          : null;

        pickRows.push({
          docId: doc.id,
          date, sport, market, sideKey,
          // Display fields for the daily picks table — captured so the
          // renderer can show "Pick" without re-reading Firestore. `team`
          // is what was shipped (post-flip if applicable); `away`/`home`
          // identify the matchup; `commenceTime` lets us show local time.
          team: side.team || null,
          away: d.away || null,
          home: d.home || null,
          commenceTime: d.commenceTime || null,
          superseded, lockStage, healthStatus,
          peakStars, peakUnits, odds,
          inDashboard, cancelled,
          dwFrozen, dqFrozen, dwSource, dqSource, vaultStar,
          hcDominant, hcConfFor, hcConfAg, hcMargin, systemVersion, promotedBy,
          outcome: oc, profitU, flatProfit,
          walletDetailsLite: wdLite,
        });
      }

      // Per-wallet rows for §7 / §8 — same as before.
      if (winningSide) {
        const seen = new Set();
        for (const [, side] of Object.entries(sides)) {
          const peak = side.peak || side.lock;
          const wd = peak?.v8Scoring?.walletDetails;
          if (!Array.isArray(wd)) continue;
          for (const w of wd) {
            if (!w.wallet || !w.side) continue;
            const dedupe = `${doc.id}_${w.wallet}`;
            if (seen.has(dedupe)) continue;
            seen.add(dedupe);
            const betSide = sides[w.side];
            const betOdds = betSide?.peak?.odds ?? betSide?.lock?.odds ?? peak?.odds ?? 0;
            const won = w.side === winningSide ? 1 : 0;
            const dec = betOdds === 0 ? 1.91 : (betOdds > 0 ? 1 + betOdds / 100 : 1 + 100 / Math.abs(betOdds));
            const flat = won === 1 ? (dec - 1) : -1;
            const invested = Number(w.invested ?? 0);
            walletBets.push({
              gameKey: doc.id, date: d.date, sport, market,
              wallet: w.wallet, invested,
              won, flat, dollarPnl: invested * flat,
            });
          }
        }
      }
    }
  }

  // Source B — graded position rows (dollar ROI from sharp_action_positions).
  // Used by §13 to reconstruct the proven-winner roster (CONFIRMED requires
  // both flat-positive in Source A and dollar-positive in Source B).
  const positionRows = [];
  const posSnap = await db.collection(VAULT_COLLECTION).where('status', '==', 'GRADED').get();
  for (const doc of posSnap.docs) {
    const d = doc.data();
    if (!d.wallet) continue;
    if (!d.date || d.date < V6_CUTOVER) continue;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) continue;
    const walletShort = d.walletShort || String(d.wallet).slice(-6).toLowerCase();
    positionRows.push({
      date: d.date,
      sport: d.sport || 'UNK',
      market: d.marketType || null,
      wallet: walletShort,
      invested,
      settledPnl,
    });
  }

  return {
    profiles, pickRows, walletBets, positionRows,
    meta: { totalSidesScanned, dateMin, dateMax },
  };
}

// ── Cohort definitions (match SharpFlow.jsx lock floor) ────────────────────
const COHORTS = [
  { id: 'super_top',  label: 'SUPER TOP (Δw≥+2 ∧ Δq≥+2)',          f: (dw, dq) => dw >= 2 && dq >= 2 },
  { id: 'top',        label: 'TOP (Δw≥+2 ∧ Δq≤+1)',                f: (dw, dq) => dw >= 2 && dq <= 1 },
  { id: 'floor_b',    label: 'FLOOR-B (Δw=+1 ∧ Δq≥+2)',            f: (dw, dq) => dw === 1 && dq >= 2 },
  { id: 'floor_a',    label: 'FLOOR-A (Δw=+1 ∧ Δq=+1)',            f: (dw, dq) => dw === 1 && dq === 1 },
  { id: 'sub_floor',  label: 'SUB-FLOOR (Δw=+1 ∧ Δq≤0)',           f: (dw, dq) => dw === 1 && dq <= 0 },
  { id: 'mute_zero',  label: 'STALE Δw=0 (winners flat)',          f: (dw)     => dw === 0 },
  { id: 'mute_neg',   label: 'STALE Δw≤−1 (winners fading/killed)',f: (dw)     => dw <= -1 },
];
const LOCK_COHORT_IDS = new Set(['super_top', 'top', 'floor_b', 'floor_a']);

function cohortFor(dw, dq) {
  if (dw == null) return null;
  for (const c of COHORTS) {
    if (c.f(dw, dq)) return c.id;
  }
  return null;
}

function emptyAgg() { return { n: 0, w: 0, l: 0, p: 0, profitU: 0, flatU: 0 }; }
function pushAgg(a, row) {
  a.n  += 1;
  a.profitU += (row.profitU || 0);
  a.flatU   += (row.flatProfit || 0);
  if (row.outcome === 'WIN')  a.w += 1;
  else if (row.outcome === 'LOSS') a.l += 1;
  else if (row.outcome === 'PUSH') a.p += 1;
}
function finalizeAgg(a) {
  const wlTotal = a.w + a.l;
  const wr = wlTotal === 0 ? null : (a.w / wlTotal) * 100;
  return { ...a, wr };
}

// Build a point-in-time tier lens from Source-A wallet bets and Source-B
// positions. Mirrors `walletHcMarginAnalysisFull.js` — events are walked
// chronologically and each (wallet, sport) records when it first crossed
// each tier threshold (CONFIRMED, FLAT, WR50). `tierAsOf(canonical, sport,
// date)` returns the wallet's tier as it would have been on that date.
//
// CONFIRMED requires both flat-positive in Source A AND dollar-positive in
// Source B with ≥ MIN_BETS in each. FLAT requires only flat-positive in
// Source A. WR50 is leading-indicator (≥ MIN_BETS, win-rate ≥ 50%).
function buildTierLens(walletBets, positionRows, profiles) {
  // Address joining — Source A uses walletShort (last 6 chars), Source B
  // can use walletShort directly. Build a key map so both sources collapse
  // onto the same canonical id.
  const walletKeyToCanonical = new Map();
  for (const [key, p] of profiles) {
    const full = p.walletAddress || null;
    walletKeyToCanonical.set(key, full || key);
    if (full) {
      walletKeyToCanonical.set(full, full);
      walletKeyToCanonical.set(full.slice(-6).toLowerCase(), full);
    }
  }
  const canonicalize = (k) => walletKeyToCanonical.get(k) || k;

  const events = [];
  for (const b of walletBets) {
    if (!b.sport || !b.wallet) continue;
    events.push({ date: b.date || '', sport: b.sport, canonical: canonicalize(b.wallet), source: 'A', payload: b });
  }
  for (const p of positionRows) {
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
    const aMet  = s.aN >= 2 && s.aFlatPnl > 0;
    const aWr50 = s.aN >= 2 && (s.aWins / s.aN) >= 0.5;
    const bMet  = s.bN >= 2 && s.bInvested > 0 && (s.bPnl / s.bInvested) > 0;
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
  return { tierAsOf };
}

// Recompute hcMargin / hcConfFor / hcConfAg for every pick row using the
// point-in-time tier lens. Writes to `r.hcMarginEffective` (and the
// matching for/ag counters) — does NOT mutate the originally stamped
// `r.hcMargin`/`hcConfFor`/`hcConfAg` so §10/§11 stay backed by frozen
// stamps only. §12 uses the effective field so the universe is the full
// graded sample, not just v7.1+ stamped picks.
function annotateEffectiveHcMargin(pickRows, lens) {
  for (const r of pickRows) {
    if (r.hcMargin != null) {
      r.hcMarginEffective = r.hcMargin;
      r.hcConfForEffective = r.hcConfFor;
      r.hcConfAgEffective = r.hcConfAg;
      r.hcMarginSource = 'frozen';
      continue;
    }
    if (!Array.isArray(r.walletDetailsLite) || !r.sideKey) {
      r.hcMarginEffective = null;
      r.hcConfForEffective = null;
      r.hcConfAgEffective = null;
      r.hcMarginSource = 'missing';
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
    r.hcConfForEffective = cFor;
    r.hcConfAgEffective  = cAg;
    r.hcMarginEffective  = cFor - cAg;
    r.hcMarginSource     = 'recomputed_from_wallet_details';
  }
}

// Module-level cohort aggregator used by §10 / §11 / §12. (Originally
// scoped inside §10; promoted so §11 and §12 can share without dup.)
function aggC(rows) {
  if (!rows.length) return { n: 0, wins: 0, losses: 0, wr: null, flatRoi: null, flatPnl: 0, peakPnl: 0 };
  const wins = rows.filter(r => r.outcome === 'WIN').length;
  const flat = rows.reduce((s, r) => s + (r.flatProfit ?? 0), 0);
  const peak = rows.reduce((s, r) => s + (r.profitU ?? 0), 0);
  return { n: rows.length, wins, losses: rows.length - wins, wr: wins / rows.length * 100, flatRoi: (flat / rows.length) * 100, flatPnl: flat, peakPnl: peak };
}

// ── HC-margin monitor helpers (§12) ────────────────────────────────────────
//
// Σ buckets mirror the v7.3 lock matrix. Σ ≤ 0 / Σ = 1 / Σ = 2 are NEW v7.3
// floor cohorts; Σ = 3..6 / Σ ≥ 7 are the established ladder.
const SIGMA_BUCKET_ORDER = ['Σ≤0', 'Σ=1', 'Σ=2', 'Σ=3', 'Σ=4', 'Σ=5', 'Σ=6', 'Σ≥7'];
function sigmaBucketLabel(sum) {
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

// Filter a row set to a date window. asOfDate defaults to today (ET);
// `days` is inclusive of asOfDate (3-day = today + 2 prior calendar days).
function rowsInWindow(rows, days, asOfDate) {
  if (!days) return rows;
  const end = new Date(asOfDate + 'T00:00:00Z');
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  const startStr = start.toISOString().slice(0, 10);
  return rows.filter(r => r.date >= startStr && r.date <= asOfDate);
}

// Two-proportion z-test on independent samples. Returns p-value or null
// when the sample is too thin for a stable approximation.
function zTestTwoProportions(xA, nA, xB, nB) {
  if (nA < 5 || nB < 5) return null;
  const pA = xA / nA, pB = xB / nB;
  const pPool = (xA + xB) / (nA + nB);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));
  if (!Number.isFinite(se) || se === 0) return null;
  const z = (pA - pB) / se;
  // Two-sided normal-CDF approximation (Abramowitz & Stegun 26.2.17).
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989422804 * Math.exp(-absZ * absZ / 2);
  const cdf = 1 - d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return Math.min(1, Math.max(0, 2 * (1 - cdf)));
}

// HC margin tier classifier — maps a row to one of three buckets, using
// the ENGINE-EFFECTIVE hc margin (frozen if v7.1+ stamped, otherwise
// recomputed from walletDetails via the point-in-time tier lens). This
// lets §12 see the FULL graded sample, not just v7.1+ stamped picks.
function hcMarginTier(row) {
  const m = row.hcMarginEffective;
  if (m == null) return null;
  if (m <= 0) return '≤0';
  if (m === 1) return '+1';
  return '≥+2';
}

// Build the Σ × HC matrix for a row set. Returns
//   { sigmaBuckets: [{ bucket, total: {n,wr,roi}, byTier: {≤0,+1,≥+2}, lift: {wr, roi, p} }, ... ],
//     pooled: { in: {...}, out: {...}, lift: {wr, roi, p} } }
function buildHcSigmaMatrix(rows) {
  const eligible = rows.filter(r =>
    r.hcMarginEffective != null
    && (r.outcome === 'WIN' || r.outcome === 'LOSS')
  );
  const aggCellRows = (rs) => {
    const wins = rs.filter(r => r.outcome === 'WIN').length;
    const flat = rs.reduce((s, r) => s + (r.flatProfit ?? 0), 0);
    return {
      n: rs.length,
      wins,
      losses: rs.length - wins,
      wr: rs.length ? wins / rs.length * 100 : null,
      flatRoi: rs.length ? (flat / rs.length) * 100 : null,
      flatPnl: flat,
    };
  };
  const sigmaBuckets = [];
  let pooledIn = [], pooledOut = [];
  for (const sb of SIGMA_BUCKET_ORDER) {
    const sbRows = eligible.filter(r => sigmaBucketLabel((r.dwFrozen ?? 0) + (r.dqFrozen ?? 0)) === sb);
    const total = aggCellRows(sbRows);
    const byTier = {
      '≤0':  aggCellRows(sbRows.filter(r => hcMarginTier(r) === '≤0')),
      '+1':  aggCellRows(sbRows.filter(r => hcMarginTier(r) === '+1')),
      '≥+2': aggCellRows(sbRows.filter(r => hcMarginTier(r) === '≥+2')),
    };
    const inRows  = sbRows.filter(r => r.hcMarginEffective >= 1);
    const outRows = sbRows.filter(r => r.hcMarginEffective <= 0);
    const inAgg  = aggCellRows(inRows);
    const outAgg = aggCellRows(outRows);
    const lift = {
      wr:  (inAgg.wr != null && outAgg.wr != null) ? inAgg.wr - outAgg.wr : null,
      roi: (inAgg.flatRoi != null && outAgg.flatRoi != null) ? inAgg.flatRoi - outAgg.flatRoi : null,
      p:   zTestTwoProportions(inAgg.wins, inAgg.n, outAgg.wins, outAgg.n),
    };
    sigmaBuckets.push({ bucket: sb, total, byTier, in: inAgg, out: outAgg, lift });
    pooledIn = pooledIn.concat(inRows);
    pooledOut = pooledOut.concat(outRows);
  }
  const inP  = aggCellRows(pooledIn);
  const outP = aggCellRows(pooledOut);
  const pooled = {
    in: inP, out: outP,
    lift: {
      wr:  (inP.wr != null && outP.wr != null) ? inP.wr - outP.wr : null,
      roi: (inP.flatRoi != null && outP.flatRoi != null) ? inP.flatRoi - outP.flatRoi : null,
      p:   zTestTwoProportions(inP.wins, inP.n, outP.wins, outP.n),
    },
  };
  return { sigmaBuckets, pooled, totalEligible: eligible.length };
}

// ── Sharp Vault loader (unchanged from prior version) ──────────────────────
async function loadSharpVaultRows() {
  const snap = await db.collection(VAULT_COLLECTION)
    .where('status', '==', 'GRADED')
    .get();

  const rows = [];
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.date || d.date < V6_CUTOVER) continue;
    if (d.vaultQualified === false) continue;
    if (d.result !== 'WIN' && d.result !== 'LOSS') continue;
    const invested = Number(d.size ?? d.invested ?? 0);
    const settledPnl = Number(d.settledPnl ?? 0);
    if (invested <= 0) continue;
    const hiddenStars = Number(d.v8_stars ?? NaN);
    if (Number.isNaN(hiddenStars)) continue;

    rows.push({
      date: d.date,
      sport: d.sport || 'UNK',
      market: d.marketType || 'UNK',
      hiddenStars,
      outcome: d.result,
      won: d.result === 'WIN',
      invested,
      settledPnl,
      dollarRoi: invested > 0 ? (settledPnl / invested) * 100 : null,
    });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

function emptyVaultAgg() { return { n: 0, w: 0, l: 0, invested: 0, pnl: 0 }; }
function pushVaultAgg(a, row) {
  a.n += 1;
  if (row.outcome === 'WIN') a.w += 1;
  else if (row.outcome === 'LOSS') a.l += 1;
  a.invested += row.invested || 0;
  a.pnl += row.settledPnl || 0;
}
function finalizeVaultAgg(a) {
  return {
    ...a,
    wr: a.n ? (a.w / a.n) * 100 : null,
    dollarRoi: a.invested > 0 ? (a.pnl / a.invested) * 100 : null,
  };
}
function vaultStarBand(row) {
  if (row.hiddenStars >= 5.0) return '5★';
  if (row.hiddenStars >= 4.0) return '4★';
  if (row.hiddenStars >= 3.0) return '3★';
  if (row.hiddenStars >= 2.0) return '2★';
  return '<2★';
}

// ── Main ────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Loading sharpWalletProfiles + every graded v6-era pick…');
  const { profiles, pickRows, walletBets, positionRows, meta } = await loadEverything();
  console.log('Building point-in-time tier lens for HC margin recompute…');
  const tierLens = buildTierLens(walletBets, positionRows, profiles);
  annotateEffectiveHcMargin(pickRows, tierLens);
  const stampedHc = pickRows.filter(r => r.hcMarginSource === 'frozen').length;
  const recomputedHc = pickRows.filter(r => r.hcMarginSource === 'recomputed_from_wallet_details').length;
  const missingHc = pickRows.filter(r => r.hcMarginSource === 'missing').length;
  console.log(`  HC margin coverage: ${stampedHc} frozen · ${recomputedHc} recomputed · ${missingHc} missing (no walletDetails)`);
  console.log('Loading Sharp Vault hidden-star positions…');
  const vaultRows = await loadSharpVaultRows();
  const allDates  = [...new Set(pickRows.map(r => r.date))].sort();
  const sports    = [...new Set(pickRows.map(r => r.sport))].sort();
  const markets   = [...new Set(pickRows.map(r => r.market))].sort();
  const vaultSports = [...new Set(vaultRows.map(r => r.sport))].sort();

  // The SHIPPED set = what the dashboard counts. Everything below pivots
  // around this set. Picks dropped from the shipped set still appear in
  // §6 anomaly counts but never contribute PnL.
  const shippedRows = pickRows.filter(r => r.inDashboard);

  console.log(`  ${profiles.size} wallet profiles · ${shippedRows.length} shipped sides (of ${pickRows.length} graded · ${meta.totalSidesScanned} scanned) · ${walletBets.length} wallet-bets · ${positionRows.length} Source-B positions · ${allDates.length} graded dates · ${vaultRows.length} Sharp Vault hidden-star positions`);

  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const out = [];
  out.push('# Sharp Intel v6 — Daily Master Report');
  out.push('');
  out.push(`_Auto-generated **${nowET} ET** by \`scripts/dailyV6Report.js\`. Do not edit by hand._`);
  out.push('');
  out.push(`**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = \`lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5\`. PnL is in **peak units** (the size shipped to users). HC margin / Δw / Δq are the **frozen** stamps written at last sync before the T-15 freeze. HC margin only existed from the v7.1 launch (**${HC_CUTOVER}**); pre-launch picks have no HC value (no retro-fitting). Nothing is recomputed against today's whitelist.`);
  out.push('');
  out.push(`v6 cutover: **${V6_CUTOVER}** · whitelist source: live \`sharpWalletProfiles\` (${profiles.size} profiles — drives §5 roster snapshot only) · quality cut: contribution ≥ ${QUALITY_CUT} · HC = CONFIRMED tier ∧ sizeRatio ≥ ${HC_RATIO}.`);
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §1. YESTERDAY'S PICKS — every shipped side from the most recent slate
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // "Yesterday" = calendar yesterday in ET if it has shipped picks; otherwise
  // we fall back to the most recent date with shipped picks (covers off-days
  // and the case where the report runs late/early enough that yesterday's
  // slate is still ungraded). The user wants a "what happened last night"
  // board: every pick we shipped, with the engine's frozen HC / Δw / Δq
  // stamps, the result, and peak-unit PnL.
  out.push('---');
  out.push('## §1. Yesterday\'s picks');
  out.push('');
  const yesterdayET = (() => {
    const oneDayAgo = new Date(Date.now() - 86400000)
      .toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD
    const datesWithShips = new Set(shippedRows.map(r => r.date));
    if (datesWithShips.has(oneDayAgo)) return oneDayAgo;
    // Fallback: most recent shipped date.
    const sorted = [...datesWithShips].sort();
    return sorted[sorted.length - 1] || null;
  })();
  const yRows = yesterdayET
    ? shippedRows
        .filter(r => r.date === yesterdayET)
        .sort((a, b) => {
          if (a.sport !== b.sport) return a.sport.localeCompare(b.sport);
          if (a.market !== b.market) return a.market.localeCompare(b.market);
          return (a.docId || '').localeCompare(b.docId || '');
        })
    : [];
  if (!yRows.length) {
    out.push('_No shipped picks on the most recent slate yet._');
    out.push('');
  } else {
    const yAgg = finalizeAgg(yRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    out.push(`Slate: **${yesterdayET}** · ${yAgg.n} shipped sides.`);
    out.push('');
    out.push(mdHeader(['N', 'W-L-P', 'WR%', 'PnL (peak u)', 'PnL (flat 1u)']));
    out.push(`| ${yAgg.n} | ${yAgg.w}-${yAgg.l}-${yAgg.p} | ${fmtPct(yAgg.wr)} | ${sign(yAgg.profitU, 2)}u | ${sign(yAgg.flatU, 2)}u |`);
    out.push('');
    out.push(mdHeader([
      'Sport', 'Market', 'Matchup', 'Pick',
      'Stars · Units', 'HC', 'Δw', 'Δq', 'Σ',
      'Odds', 'Result', 'PnL (peak u)',
    ]));
    for (const r of yRows) {
      const matchup = r.away && r.home ? `${r.away} @ ${r.home}` : '—';
      const pick = r.team || r.sideKey || '—';
      // HC margin was launched at the v7.1 cutover (2026-04-30). Use the
      // frozen `v8_hcMargin` stamp only — we do NOT retro-fit a value onto
      // pre-cutover picks because HC margin literally didn't exist then.
      const hc = r.hcMargin == null ? '—' : sign(r.hcMargin, 0);
      const dw = r.dwFrozen == null ? '—' : sign(r.dwFrozen, 0);
      const dq = r.dqFrozen == null ? '—' : sign(r.dqFrozen, 0);
      const sumVal = (r.dwFrozen != null && r.dqFrozen != null) ? r.dwFrozen + r.dqFrozen : null;
      const sm = sumVal == null ? '—' : sign(sumVal, 0);
      const stars = `${(r.peakStars || 0).toFixed(1)}★ · ${(r.peakUnits || 0).toFixed(2)}u`;
      const oddsStr = r.odds == null ? '—' : (r.odds > 0 ? `+${r.odds}` : `${r.odds}`);
      const resultStr = r.outcome === 'WIN' ? '**W**' : r.outcome === 'LOSS' ? 'L' : 'P';
      out.push(`| ${r.sport} | ${r.market} | ${matchup} | ${pick} | ${stars} | ${hc} | ${dw} | ${dq} | ${sm} | ${oddsStr} | ${resultStr} | ${sign(r.profitU, 2)}u |`);
    }
    out.push('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §2. 3-DAY / 7-DAY / ALL-TIME COHORT ROLLUPS
  //     — partitioned by HC margin, Δw, Δq
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // HC margin only existed from the v7.1 cutover (HC_CUTOVER = 2026-04-30)
  // onward. Pre-cutover picks have no HC stamp because the feature didn't
  // exist — we deliberately do NOT retro-fit one. So the HC sub-table runs
  // on the **post-HC-launch slice only**, while the Δw / Δq sub-tables
  // continue to span the full v6-era sample (those signals existed since
  // 2026-04-18).
  out.push('---');
  out.push('## §2. 3-day / 7-day / all-time cohort rollups');
  out.push('');
  out.push('Shipped picks only. PnL in **peak units** (size we actually bet) and flat 1u (cohort EV lens). All margins are the engine\'s frozen stamps (`v8_hcMargin`, `v8_walletConsensusDelta`, `v8_walletConsensusQualityMargin`).');
  out.push('');
  out.push(`**HC margin sub-tables** are scoped to picks dated ≥ ${HC_CUTOVER} (the v7.1 launch — when HC margin became a real engine signal). Pre-launch picks are excluded from HC analysis since the feature didn't exist for them. Δw / Δq sub-tables span the full v6-era sample (≥ ${V6_CUTOVER}). Empty buckets are dropped.`);
  out.push('');

  const HC_BUCKETS = [
    { label: 'HC ≥ +3',    f: hc => hc != null && hc >= 3 },
    { label: 'HC = +2',    f: hc => hc === 2 },
    { label: 'HC = +1',    f: hc => hc === 1 },
    { label: 'HC = 0',     f: hc => hc === 0 },
    { label: 'HC ≤ −1',    f: hc => hc != null && hc <= -1 },
  ];
  const DELTA_BUCKETS = [
    { label: '≥ +3',    f: v => v != null && v >= 3 },
    { label: '+2',      f: v => v === 2 },
    { label: '+1',      f: v => v === 1 },
    { label: '0',       f: v => v === 0 },
    { label: '−1',      f: v => v === -1 },
    { label: '≤ −2',    f: v => v != null && v <= -2 },
    { label: 'missing', f: v => v == null },
  ];

  function rollupTable(rows, buckets, getValue) {
    const lines = [mdHeader(['Bucket', 'N', 'W-L-P', 'WR%', 'PnL (peak u)', 'PnL (flat 1u)'])];
    for (const b of buckets) {
      const slice = rows.filter(r => b.f(getValue(r)));
      if (!slice.length) continue;
      const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
      lines.push(`| ${b.label} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u |`);
    }
    return lines;
  }

  // Horizon = trailing N graded dates (referenced from the latest shipped
  // date, not "today" — the report only knows about graded slates).
  function horizonRows(daysBack) {
    if (daysBack == null) return shippedRows;
    const refDate = allDates[allDates.length - 1];
    if (!refDate) return [];
    const cutoff = new Date(refDate + 'T00:00:00Z');
    cutoff.setUTCDate(cutoff.getUTCDate() - (daysBack - 1));
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return shippedRows.filter(r => r.date >= cutoffStr && r.date <= refDate);
  }

  const horizons = [
    { sub: '§2a', label: '3-day',    rows: horizonRows(3)    },
    { sub: '§2b', label: '7-day',    rows: horizonRows(7)    },
    { sub: '§2c', label: 'All-time', rows: horizonRows(null) },
  ];
  for (const h of horizons) {
    const total = finalizeAgg(h.rows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    // HC sub-table runs on the post-HC-launch slice only.
    const hcRows = h.rows.filter(r => r.date >= HC_CUTOVER);
    const hcTotal = finalizeAgg(hcRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    out.push(`### ${h.sub}. ${h.label}`);
    out.push('');
    out.push(`Total: **${total.n}** shipped · ${total.w}-${total.l}-${total.p} · WR ${fmtPct(total.wr)} · PnL ${sign(total.profitU, 2)}u (peak) / ${sign(total.flatU, 2)}u (flat).`);
    out.push('');
    out.push(`**By HC margin** _(picks dated ≥ ${HC_CUTOVER}, N = ${hcTotal.n})_`);
    out.push('');
    if (!hcTotal.n) {
      out.push('_No HC-era picks in this window._');
      out.push('');
    } else {
      rollupTable(hcRows, HC_BUCKETS, r => r.hcMargin).forEach(line => out.push(line));
      out.push('');
    }
    out.push('**By Δw (winner margin)**');
    out.push('');
    rollupTable(h.rows, DELTA_BUCKETS, r => r.dwFrozen).forEach(line => out.push(line));
    out.push('');
    out.push('**By Δq (quality margin)**');
    out.push('');
    rollupTable(h.rows, DELTA_BUCKETS, r => r.dqFrozen).forEach(line => out.push(line));
    out.push('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §3. EDGE OVER TIME — daily cumulative peak-unit PnL by HC bucket
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // This is the chart that answers "is HC margin creating winners?" — a
  // rising HC ≥ +1 line that diverges above HC = 0 / All is the v7.4
  // thesis being validated. Scoped to dates ≥ HC_CUTOVER because HC margin
  // didn't exist before then. The "All shipped (HC era)" line is the
  // post-launch baseline so the comparison is apples-to-apples.
  out.push('---');
  out.push('## §3. Edge over time — is HC margin creating winners?');
  out.push('');
  out.push(`Daily cumulative peak-unit PnL since the HC margin launch (**${HC_CUTOVER}**). The \`HC ≥ +1\` line is the golden-standard cohort. The \`HC = 0\` line is the no-HC-signal control. The \`All shipped (HC era)\` line is every shipped pick from the same date range — the apples-to-apples baseline. Watch the spread.`);
  out.push('');

  // Build the cumulative series — only post-HC-launch dates qualify.
  const chartDates = allDates.filter(d => d >= HC_CUTOVER);
  let cHc = 0, cFlat = 0, cAll = 0;
  const lineHc = [], lineFlat = [], lineAll = [];
  const dailySeries = [];
  for (const d of chartDates) {
    const day = shippedRows.filter(r => r.date === d);
    const dayHcSum   = day.filter(r => r.hcMargin != null && r.hcMargin >= 1).reduce((a, r) => a + (r.profitU || 0), 0);
    const dayFlatSum = day.filter(r => r.hcMargin === 0).reduce((a, r) => a + (r.profitU || 0), 0);
    const dayAllSum  = day.reduce((a, r) => a + (r.profitU || 0), 0);
    cHc   += dayHcSum;
    cFlat += dayFlatSum;
    cAll  += dayAllSum;
    lineHc.push(cHc.toFixed(2));
    lineFlat.push(cFlat.toFixed(2));
    lineAll.push(cAll.toFixed(2));
    dailySeries.push({ date: d, hc: cHc, flat: cFlat, all: cAll });
  }

  if (chartDates.length) {
    out.push('```mermaid');
    out.push('xychart-beta');
    out.push(`    title "Cumulative peak-unit PnL — HC era (${HC_CUTOVER}+)"`);
    out.push(`    x-axis [${chartDates.map(d => `"${d.slice(5)}"`).join(', ')}]`);
    out.push('    y-axis "PnL (peak u)"');
    out.push(`    line "HC ≥ +1" [${lineHc.join(', ')}]`);
    out.push(`    line "HC = 0"  [${lineFlat.join(', ')}]`);
    out.push(`    line "All (HC era)" [${lineAll.join(', ')}]`);
    out.push('```');
    out.push('');

    // Companion table — readable on any renderer.
    out.push('Daily cumulative table (peak units, HC era only):');
    out.push('');
    out.push(mdHeader(['Date', 'HC ≥ +1 (cum)', 'HC = 0 (cum)', 'All shipped (cum)']));
    for (const r of dailySeries) {
      out.push(`| ${r.date} | ${sign(r.hc, 2)}u | ${sign(r.flat, 2)}u | ${sign(r.all, 2)}u |`);
    }
    out.push('');
  } else {
    out.push(`_No graded dates since HC launch (${HC_CUTOVER}) yet._`);
    out.push('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // (legacy §1–§6 block deleted 2026-05-05 per user — narrowed to picks-board
  //  + cohort rollups + edge chart + wallet/tracking growth.)
  // ═══════════════════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════════════════
  // §4. WALLET ROSTER GROWTH & PROFITABILITY (formerly §7 — unchanged math)
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Wallet roster growth & profitability');
  out.push('');
  out.push(`"Tracked in sport X" = a wallet has placed **≥ ${MIN_BETS} bets** in X within the v6-era sample. "Profitable" = cumulative flat PnL > 0. Source: \`v8Scoring.walletDetails\` on every graded v6-era game (every side, not just the shipped set).`);
  out.push('');

  function summarizeWallets(rows) {
    const byWallet = new Map();
    for (const b of rows) {
      if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
      byWallet.get(b.wallet).push(b);
    }
    const wallets = [];
    for (const [wallet, bs] of byWallet) {
      const n = bs.length;
      const wins = bs.filter(b => b.won === 1).length;
      const flatPnl = bs.reduce((a, b) => a + (b.flat || 0), 0);
      const invested = bs.reduce((a, b) => a + (b.invested || 0), 0);
      const dollarPnl = bs.reduce((a, b) => a + (b.dollarPnl || 0), 0);
      wallets.push({
        wallet, n, wins, losses: n - wins,
        wr: (wins / n) * 100, flatPnl, flatRoi: (flatPnl / n) * 100,
        invested, dollarPnl,
        dollarRoi: invested > 0 ? (dollarPnl / invested) * 100 : null,
      });
    }
    return wallets;
  }

  const sportSnapshots = {};
  out.push('### §4a. Per-sport wallet snapshot');
  out.push('');
  out.push(mdHeader(['Sport', 'Total wallets seen', `Tracked (≥${MIN_BETS})`, 'Profitable', '% prof', 'WR ≥ 50%', 'WR ≥ 60%', 'WR ≥ 70%']));
  for (const sport of sports) {
    const slice = walletBets.filter(b => b.sport === sport);
    const allW = summarizeWallets(slice);
    const tracked = allW.filter(w => w.n >= MIN_BETS);
    const profitable = tracked.filter(w => w.flatPnl > 0);
    const wr50 = tracked.filter(w => w.wr >= 50);
    const wr60 = tracked.filter(w => w.wr >= 60);
    const wr70 = tracked.filter(w => w.wr >= 70);
    sportSnapshots[sport] = { uniqueAll: new Set(slice.map(b => b.wallet)).size, tracked, profitable, wr50, wr60, wr70 };
    const pct = tracked.length ? (profitable.length / tracked.length * 100).toFixed(0) : '—';
    out.push(`| ${sport.toUpperCase()} | ${sportSnapshots[sport].uniqueAll} | ${tracked.length} | ${profitable.length} | ${pct}% | ${wr50.length} | ${wr60.length} | ${wr70.length} |`);
  }
  const allFlat = summarizeWallets(walletBets);
  const trAll = allFlat.filter(w => w.n >= MIN_BETS);
  const prAll = trAll.filter(w => w.flatPnl > 0);
  out.push(`| **ALL (any sport)** | **${new Set(walletBets.map(b => b.wallet)).size}** | **${trAll.length}** | **${prAll.length}** | **${trAll.length ? (prAll.length / trAll.length * 100).toFixed(0) : '—'}%** | **${trAll.filter(w => w.wr >= 50).length}** | **${trAll.filter(w => w.wr >= 60).length}** | **${trAll.filter(w => w.wr >= 70).length}** |`);
  out.push('');

  out.push('### §4b. Daily roster growth (cumulative through each date)');
  out.push('');
  out.push(`Format: \`tracked (profitable)\`. For each date D, recompute the roster using every bet up to and including D.`);
  out.push('');
  const growthCols = ['Date', 'ALL', ...sports.map(s => s.toUpperCase())];
  out.push(mdHeader(growthCols));
  for (const date of allDates) {
    const upTo = walletBets.filter(b => b.date <= date);
    const row = [date];
    const allW = summarizeWallets(upTo);
    const trA = allW.filter(w => w.n >= MIN_BETS);
    const prA = trA.filter(w => w.flatPnl > 0);
    row.push(`${trA.length} (${prA.length})`);
    for (const sport of sports) {
      const ws = summarizeWallets(upTo.filter(b => b.sport === sport));
      const tr = ws.filter(w => w.n >= MIN_BETS);
      const pr = tr.filter(w => w.flatPnl > 0);
      row.push(`${tr.length} (${pr.length})`);
    }
    out.push(`| ${row.join(' | ')} |`);
  }
  out.push('');

  out.push('### §4c. Top 10 profitable wallets by sport');
  out.push('');
  for (const sport of sports) {
    const { tracked } = sportSnapshots[sport];
    const top = [...tracked].sort((a, b) => b.flatRoi - a.flatRoi).slice(0, 10);
    if (!top.length) continue;
    out.push(`#### ${sport.toUpperCase()}`);
    out.push('');
    out.push(mdHeader(['#', 'Wallet', 'N', 'W', 'L', 'WR%', 'Flat PnL (u)', 'Flat ROI', '$ PnL']));
    top.forEach((w, i) => {
      out.push(`| ${i + 1} | ${w.wallet} | ${w.n} | ${w.wins} | ${w.losses} | ${w.wr.toFixed(1)}% | ${sign(w.flatPnl, 2)} | ${fmtSignPct(w.flatRoi)} | ${fmtMoneyShort(w.dollarPnl)} |`);
    });
    out.push('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §5. PROVEN-WALLET GROWTH & TRACKING DESCRIPTIVES (formerly §13)
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // The Δ_winner signal is only as good as the proven-winner roster behind
  // it. This section answers: how fast is the roster growing per sport,
  // are we converting eligibles into proven, and is HC backing density
  // healthy enough that the v7.3 floor lowering stays meaningful?
  //
  // Definitions (mirror exportWalletProfiles.js exactly):
  //   • CONFIRMED — flat ROI > 0 in Source A (walletDetails) AND dollar
  //                 ROI > 0 in Source B (sharp_action_positions).
  //   • FLAT      — flat ROI > 0 in Source A only.
  //   • Proven    — CONFIRMED + FLAT (drives Δ_winner).
  //   • HC bet    — wallet flagged CONFIRMED with sizeRatio ≥ 1.5 on the
  //                 specific game (see HC_RATIO in SharpFlow.jsx).
  //
  // Source-B positions are loaded into `positionRows` by loadEverything().
  out.push('---');
  out.push('## §5. Proven-wallet roster growth & HC tracking');
  out.push('');
  out.push('"Proven wallet" = whitelist tier `CONFIRMED` or `FLAT` in the same sense the live engine uses (`exportWalletProfiles.js` → `sharpWalletProfiles.bySport`). Sports inherit independent rosters: a wallet can be CONFIRMED in NBA and absent from NHL. `walletBets` come from `v8Scoring.walletDetails` on every graded v6-era pick (Source A); `positionRows` come from `sharp_action_positions` (Source B).');
  out.push('');

  // ── Wallet aggregator (mirrors walletProvenGrowthBySport.js) ─────────────
  function aggregateBySport(walletBetsArg, positionsArg, sport, asOfDate) {
    const out = new Map();
    for (const b of walletBetsArg) {
      if (b.sport !== sport) continue;
      if (asOfDate && b.date > asOfDate) continue;
      const r = out.get(b.wallet) || { wallet: b.wallet, picksN: 0, picksWins: 0, flatPnl: 0, posN: 0, posInvested: 0, posPnl: 0 };
      r.picksN += 1;
      r.picksWins += b.won;
      r.flatPnl += (b.flat ?? 0);
      out.set(b.wallet, r);
    }
    for (const p of positionsArg) {
      if (p.sport !== sport) continue;
      if (asOfDate && p.date > asOfDate) continue;
      const r = out.get(p.wallet) || { wallet: p.wallet, picksN: 0, picksWins: 0, flatPnl: 0, posN: 0, posInvested: 0, posPnl: 0 };
      r.posN += 1;
      r.posInvested += p.invested;
      r.posPnl += (p.settledPnl || 0);
      out.set(p.wallet, r);
    }
    return out;
  }
  function classifyTier(rec, minBets = MIN_BETS) {
    const flatRoi = rec.picksN >= minBets ? (rec.flatPnl / rec.picksN) * 100 : null;
    const dollarRoi = rec.posN >= minBets && rec.posInvested > 0 ? (rec.posPnl / rec.posInvested) * 100 : null;
    const wr = rec.picksN >= minBets ? (rec.picksWins / rec.picksN) * 100 : null;
    const flatOk = flatRoi != null && flatRoi > 0;
    const dollarOk = dollarRoi != null && dollarRoi > 0;
    const wr50Ok = wr != null && wr >= 50;
    if (flatOk && dollarOk) return 'CONFIRMED';
    if (flatOk) return 'FLAT';
    if (wr50Ok) return 'WR50';
    return null;
  }
  function provenCounts(map) {
    let confirmed = 0, flat = 0, wr50 = 0, none = 0;
    for (const rec of map.values()) {
      const t = classifyTier(rec);
      if (t === 'CONFIRMED') confirmed++;
      else if (t === 'FLAT') flat++;
      else if (t === 'WR50') wr50++;
      else none++;
    }
    return { confirmed, flat, wr50, none, proven: confirmed + flat, total: map.size };
  }

  // §13a — Current proven-winner roster snapshot per sport
  // `asOf` and `WINDOWS` were previously declared in old §12 (HC universal
  // monitor). After §12 was retired in the 2026-05-05 rewrite we redeclare
  // them here so the §5 wallet-roster routines (snapshot, growth deltas,
  // HC density) keep referencing the latest graded slate and the same
  // 3-day / 7-day / all-time windows.
  const asOf = meta.dateMax;
  const WINDOWS = [
    { id: 'd3',  label: '3-day',    days: 3 },
    { id: 'd7',  label: '7-day',    days: 7 },
    { id: 'all', label: 'All-time', days: null },
  ];
  out.push('### §5a. Current proven-winner roster (snapshot)');
  out.push('');
  out.push(`Roster as of **${asOf}** — wallets with ≥${MIN_BETS} bets in the sport.`);
  out.push('');
  out.push(mdHeader(['Sport', 'Wallets seen', `Eligible (≥${MIN_BETS})`, 'CONFIRMED', 'FLAT', 'Proven (C+F)', 'WR50 only', 'Conv %']));
  const snapshot = {};
  let provenAllSports = 0;
  for (const sport of sports) {
    const map = aggregateBySport(walletBets, positionRows, sport, null);
    const c = provenCounts(map);
    const eligible = [...map.values()].filter(r => r.picksN >= MIN_BETS).length;
    const conv = c.total > 0 ? (c.proven / c.total * 100).toFixed(1) : '—';
    snapshot[sport] = { map, counts: c, eligible };
    provenAllSports += c.proven;
    out.push(`| ${sport.toUpperCase()} | ${c.total} | ${eligible} | ${c.confirmed} | ${c.flat} | **${c.proven}** | ${c.wr50} | ${conv}% |`);
  }
  out.push(`| **ALL** | **—** | **—** | **—** | **—** | **${provenAllSports}** | **—** | **—** |`);
  out.push('');

  // §13b — Live whitelist drift check (script vs sharpWalletProfiles)
  out.push('### §5b. Live whitelist drift check');
  out.push('');
  out.push('Live `sharpWalletProfiles` is what the engine reads at lock time. Drift between script reconstruction (above) and live should be ≤ 1 day of position data — otherwise `exportWalletProfiles.js` is stale.');
  out.push('');
  const liveWhitelist = {};
  for (const [, rec] of profiles) {
    for (const [sport, sportRec] of Object.entries(rec.bySport || {})) {
      if (!liveWhitelist[sport]) liveWhitelist[sport] = { CONFIRMED: 0, FLAT: 0, WR50: 0 };
      const t = sportRec.whitelistTier;
      if (t === 'CONFIRMED') liveWhitelist[sport].CONFIRMED++;
      else if (t === 'FLAT') liveWhitelist[sport].FLAT++;
      else if (t === 'WR50') liveWhitelist[sport].WR50++;
    }
  }
  out.push(mdHeader(['Sport', 'CONFIRMED (live · script)', 'FLAT (live · script)', 'WR50 (live · script)', 'Drift']));
  for (const sport of sports) {
    const live = liveWhitelist[sport] || { CONFIRMED: 0, FLAT: 0, WR50: 0 };
    const c = snapshot[sport].counts;
    const drift = (live.CONFIRMED - c.confirmed) + (live.FLAT - c.flat);
    const driftLbl = drift === 0 ? 'in sync' : drift > 0 ? `+${drift} live` : `${drift} live`;
    out.push(`| ${sport.toUpperCase()} | ${live.CONFIRMED} · ${c.confirmed} | ${live.FLAT} · ${c.flat} | ${live.WR50} · ${c.wr50} | ${driftLbl} |`);
  }
  out.push('');

  // §13c — Proven roster growth: 3d / 7d / 30d / all-time deltas per sport
  out.push('### §5c. Roster growth — 3d / 7d / 30d / all-time deltas');
  out.push('');
  out.push(`Each cell is **net growth** in proven (CONFIRMED + FLAT) wallets in that window, with the absolute count at the start (\`+Δ from N\`). Negative = wallets demoted. Window endpoint = ${asOf}.`);
  out.push('');
  function provenAtDate(sport, asOfDate) {
    const m = aggregateBySport(walletBets, positionRows, sport, asOfDate);
    return provenCounts(m).proven;
  }
  function dateNDaysAgo(n) {
    const t = new Date(asOf + 'T00:00:00Z');
    return new Date(t.getTime() - n * 86400000).toISOString().slice(0, 10);
  }
  const growthWindows = [
    { id: 'd3',  label: '3-day',  days: 3 },
    { id: 'd7',  label: '7-day',  days: 7 },
    { id: 'd30', label: '30-day', days: 30 },
  ];
  out.push(mdHeader(['Sport', ...growthWindows.map(w => w.label), 'All-time (since cutover)']));
  for (const sport of sports) {
    const cells = [sport.toUpperCase()];
    const today = provenAtDate(sport, asOf);
    for (const w of growthWindows) {
      const baseDate = dateNDaysAgo(w.days);
      const base = baseDate < V6_CUTOVER ? 0 : provenAtDate(sport, baseDate);
      const delta = today - base;
      const sgn = delta >= 0 ? '+' : '';
      cells.push(`${sgn}${delta} from ${base}`);
    }
    cells.push(`+${today} from 0`);
    out.push(`| ${cells.join(' | ')} |`);
  }
  out.push('');
  out.push('A flat 7-day delta on a sport with healthy slate density = either the bubble pipeline has stalled (no wallets approaching the bar) or our cohort has saturated. Check §13d for the funnel diagnostic.');
  out.push('');

  // §13d — Pipeline funnel — where each sport leaks
  out.push('### §5d. Pipeline funnel — where each sport leaks');
  out.push('');
  out.push('Wallets surviving each gate, in order. The biggest %-drop tells you the bottleneck. Gates:');
  out.push('');
  out.push('1. **Seen** — placed ≥ 1 bet in the sport (any source)');
  out.push(`2. **Eligible** — ≥ ${MIN_BETS} graded picks in Source A (required for FLAT/CONFIRMED)`);
  out.push('3. **Flat-OK** — eligible AND flat ROI > 0 (becomes FLAT or better)');
  out.push(`4. **$-OK** — Flat-OK AND ≥${MIN_BETS} positions with dollar ROI > 0 (CONFIRMED)`);
  out.push('5. **Promoted** — final whitelisted = CONFIRMED + FLAT');
  out.push('');
  out.push(mdHeader(['Sport', '1·Seen', '2·Eligible (% of Seen)', '3·Flat-OK (% of Elig)', '4·$-OK (% of Flat)', '5·Promoted', 'Bottleneck']));
  for (const sport of sports) {
    const map = snapshot[sport].map;
    const seen = map.size;
    const eligible = [...map.values()].filter(r => r.picksN >= MIN_BETS).length;
    const flatOk   = [...map.values()].filter(r => r.picksN >= MIN_BETS && (r.flatPnl / r.picksN) > 0).length;
    const dollarOk = [...map.values()].filter(r => r.picksN >= MIN_BETS && (r.flatPnl / r.picksN) > 0
                                                    && r.posN >= MIN_BETS && r.posInvested > 0 && (r.posPnl / r.posInvested) > 0).length;
    const promoted = snapshot[sport].counts.proven;
    const drops = [
      { gate: 'sample (Seen→Eligible)', drop: seen > 0 ? 1 - eligible / seen : 0 },
      { gate: 'edge (Eligible→Flat-OK)', drop: eligible > 0 ? 1 - flatOk / eligible : 0 },
      { gate: 'data (Flat-OK→Promoted)', drop: flatOk > 0 ? 1 - promoted / flatOk : 0 },
    ];
    const worst = drops.reduce((a, b) => b.drop > a.drop ? b : a);
    const cellPct = (n, base) => base > 0 ? `${n} (${(n / base * 100).toFixed(0)}%)` : `${n} (—)`;
    out.push(`| ${sport.toUpperCase()} | ${seen} | ${cellPct(eligible, seen)} | ${cellPct(flatOk, eligible)} | ${cellPct(dollarOk, flatOk)} | **${promoted}** | ${worst.gate} ${(worst.drop * 100).toFixed(0)}% |`);
  }
  out.push('');

  // §13e — HC backing density on shipped picks (the fuel for HC margin)
  out.push('### §5e. HC backing density (the fuel for v7.3 HC margin)');
  out.push('');
  out.push('Every v7.x promotion is gated on `HC_m ≥ +1`, which requires at least one CONFIRMED wallet sized at `≥ 1.5×` average on the for-side. This table shows the share of shipped picks that *had any HC backing*, by sport, in each window. If HC density falls toward zero in a sport, the v7.3 floor cohorts (Σ=1, Σ=2 locks; HC rescues) will simply stop firing there.');
  out.push('');
  function hcDensitySummary(rows) {
    const elig = rows.filter(r => r.hcConfForEffective != null);
    const withHc = elig.filter(r => (r.hcConfForEffective ?? 0) >= 1);
    const margin1Plus = elig.filter(r => (r.hcMarginEffective ?? -99) >= 1);
    const margin2Plus = elig.filter(r => (r.hcMarginEffective ?? -99) >= 2);
    return {
      n: elig.length,
      anyHc: withHc.length,
      m1: margin1Plus.length,
      m2: margin2Plus.length,
      anyHcPct: elig.length ? (withHc.length / elig.length) * 100 : null,
      m1Pct: elig.length ? (margin1Plus.length / elig.length) * 100 : null,
      m2Pct: elig.length ? (margin2Plus.length / elig.length) * 100 : null,
    };
  }
  out.push(mdHeader(['Sport', 'Window', 'Picks (with HC stamp)', 'Any HC for-side', 'HC_m ≥ +1', 'HC_m ≥ +2']));
  for (const sport of sports) {
    const sportRows = pickRows.filter(r => r.sport === sport && r.inDashboard && !r.superseded);
    for (const w of WINDOWS) {
      const slice = rowsInWindow(sportRows, w.days, asOf);
      const d = hcDensitySummary(slice);
      out.push(`| ${sport.toUpperCase()} | ${w.label} | ${d.n} | ${d.anyHc} (${fmtPct(d.anyHcPct)}) | ${d.m1} (${fmtPct(d.m1Pct)}) | ${d.m2} (${fmtPct(d.m2Pct)}) |`);
    }
  }
  out.push('');
  out.push('Pooled across sports:');
  out.push('');
  out.push(mdHeader(['Window', 'Picks (with HC stamp)', 'Any HC for-side', 'HC_m ≥ +1', 'HC_m ≥ +2']));
  const allShipped = pickRows.filter(r => r.inDashboard && !r.superseded);
  for (const w of WINDOWS) {
    const slice = rowsInWindow(allShipped, w.days, asOf);
    const d = hcDensitySummary(slice);
    out.push(`| ${w.label} | ${d.n} | ${d.anyHc} (${fmtPct(d.anyHcPct)}) | ${d.m1} (${fmtPct(d.m1Pct)}) | ${d.m2} (${fmtPct(d.m2Pct)}) |`);
  }
  out.push('');

  // §13f — Bubble wallets (next-up graduations) per sport
  out.push('### §5f. Bubble wallets — next-up graduations');
  out.push('');
  out.push('Wallets currently NOT promoted but close. Two flavors:');
  out.push('');
  out.push(`- **One-bet-away** — won the only bet, needs one more positive bet to clear ≥${MIN_BETS}.`);
  out.push(`- **Just-under** — has ≥${MIN_BETS} bets but flat ROI is between −10% and 0% (one win flips them).`);
  out.push('');
  for (const sport of sports) {
    const map = snapshot[sport].map;
    const oneBet = [...map.values()].filter(r => r.picksN === 1 && r.picksWins === 1)
      .sort((a, b) => b.flatPnl - a.flatPnl).slice(0, 6);
    const justUnder = [...map.values()].filter(r => r.picksN >= MIN_BETS).map(r => {
      const fr = (r.flatPnl / r.picksN) * 100;
      return { ...r, flatRoi: fr };
    }).filter(r => r.flatRoi > -10 && r.flatRoi <= 0)
      .sort((a, b) => b.flatRoi - a.flatRoi).slice(0, 6);
    if (oneBet.length === 0 && justUnder.length === 0) continue;
    out.push(`#### ${sport.toUpperCase()}`);
    out.push('');
    if (oneBet.length) {
      out.push(`**One-bet-away** (${oneBet.length})`);
      out.push('');
      out.push(mdHeader(['wallet', 'picksN', 'flat PnL', 'pos N', 'pos $ROI']));
      for (const r of oneBet) {
        const dr = r.posN > 0 && r.posInvested > 0 ? `${(r.posPnl / r.posInvested * 100).toFixed(0)}%` : '—';
        out.push(`| \`${r.wallet.slice(0, 8)}…\` | ${r.picksN} | ${sign(r.flatPnl, 2)} | ${r.posN} | ${dr} |`);
      }
      out.push('');
    }
    if (justUnder.length) {
      out.push(`**Just-under** (${justUnder.length})`);
      out.push('');
      out.push(mdHeader(['wallet', 'picksN', 'WR', 'flat ROI', 'pos N', 'pos $ROI']));
      for (const r of justUnder) {
        const wr = (r.picksWins / r.picksN * 100).toFixed(0);
        const dr = r.posN > 0 && r.posInvested > 0 ? `${(r.posPnl / r.posInvested * 100).toFixed(0)}%` : '—';
        out.push(`| \`${r.wallet.slice(0, 8)}…\` | ${r.picksN} | ${wr}% | ${sign(r.flatRoi)}% | ${r.posN} | ${dr} |`);
      }
      out.push('');
    }
  }

  // §5 footer — interpretation
  out.push('### §5 — How to read');
  out.push('');
  out.push('- **Roster growth flat in 7-day** + **funnel bottleneck = `data`** → re-run `exportWalletProfiles.js`. The flat-positive wallets are stuck at FLAT because Source-B coverage hasn\'t caught up. CONFIRMED gate is data-bound, not skill-bound.');
  out.push('- **Roster growth flat in 7-day** + **funnel bottleneck = `sample`** → wallets aren\'t reaching `≥' + MIN_BETS + '` reps fast enough. This is a slate-density problem; consider a soft `MIN_BETS = 1` shadow lane to surface bubble wallets earlier.');
  out.push('- **Roster shrank** (negative delta) → a previously CONFIRMED wallet just dropped flat-positive (lost a recent bet). Variance, not failure — but worth noting if a sport loses ≥3 in a week.');
  out.push('- **HC density on a sport drops below ~30%** → v7.3 promotions there will starve. Either the proven roster needs more CONFIRMED-tier wallets sizing aggressively, or the HC_RATIO (1.5) needs a sport-specific tune.');
  out.push('');

  // ─── Footer ────────────────────────────────────────────────────────────────
  out.push('---');
  out.push('');
  out.push(`_Driven by \`scripts/dailyV6Report.js\` · regenerates daily via \`.github/workflows/daily-v6-report.yml\` · QUALITY_CONTRIB_CUT = ${QUALITY_CUT} · HC = CONFIRMED ∧ sizeRatio ≥ ${HC_RATIO} · inclusion mirrors live Pick Performance dashboard · §1–§3 use shipped picks · §4–§5 wallet/tracking growth mirror \`exportWalletProfiles.js\`_`);
  out.push('');

  const outPath = join(REPO_ROOT, 'DAILY_V6_REPORT.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nWrote ${outPath}  (${out.length} lines)`);

  // Console summary — kept lean now that the report itself is lean.
  const shippedAgg = finalizeAgg(shippedRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  SHARP INTEL v6 — DAILY MASTER REPORT (${nowET} ET)`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Sample:   scanned=${meta.totalSidesScanned}  graded=${pickRows.length}  shipped=${shippedRows.length}  dates=${allDates.length} (${meta.dateMin} → ${meta.dateMax})`);
  console.log(`SHIPPED (= dashboard):  N=${shippedAgg.n}  ${shippedAgg.w}-${shippedAgg.l}-${shippedAgg.p}  WR=${fmtPct(shippedAgg.wr)}  PnL_peak=${sign(shippedAgg.profitU, 2)}u  PnL_flat=${sign(shippedAgg.flatU, 2)}u`);
  if (yesterdayET) {
    const yAgg = finalizeAgg(yRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    console.log(`Yesterday (${yesterdayET}): N=${yAgg.n}  ${yAgg.w}-${yAgg.l}-${yAgg.p}  WR=${fmtPct(yAgg.wr)}  PnL_peak=${sign(yAgg.profitU, 2)}u`);
  }

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
