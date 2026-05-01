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
 * Sections:
 *   §1.  Sample summary — reconciles to the dashboard
 *   §2.  Daily PnL by lock-floor cohort (FROZEN deltas)
 *   §3.  Vault-Star bucket performance (FROZEN v8_vaultStar)
 *   §4.  Sharp Vault hidden-star performance (sharp_action_positions)
 *   §5.  Full (Δw × Δq) win matrix using FROZEN stamps
 *   §6.  RECONCILIATION & ANOMALIES — engine self-check
 *   §7.  Wallet roster growth & profitability
 *   §8.  Wallet winners — descriptive stats
 *   §9.  v7.1 HC dominance cohort (frozen v8_hcDominant)
 *   §10. v7.2 HC-margin tier cohort (frozen v7.2 stamps)
 *   §11. v7.3 HC-margin floor + MUTE override cohort (frozen v7.3 stamps)
 *   §12. HC-margin universal monitor — 3d/7d/all-time × sport × Σ × HC matrix
 *        (full graded set; rebuilds the v7.3 thesis check daily)
 *   §13. Proven-wallet roster growth & HC tracking — snapshot, drift,
 *        deltas, funnel, HC density, bubble pipeline
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
  out.push(`**Source of truth: this report mirrors the live Pick Performance dashboard.** Inclusion = \`lockStage ≠ SHADOW ∧ ¬superseded ∧ health ∉ {MUTED, CANCELLED} ∧ peak.stars ≥ 2.5\`. PnL is in **peak units** (the size shipped to users). Cohort tags (1/1, 2/2, …) come from frozen \`v8_walletConsensus*\` stamps written at last sync before the T-15 freeze. Nothing is recomputed against today's whitelist.`);
  out.push('');
  out.push(`v6 cutover: **${V6_CUTOVER}** · whitelist source: live \`sharpWalletProfiles\` (${profiles.size} profiles — display only) · quality cut: contribution ≥ ${QUALITY_CUT}.`);
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §1. SAMPLE SUMMARY (reconciles to dashboard)
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Sample summary');
  out.push('');
  out.push(mdHeader(['Metric', 'Value']));
  out.push(`| Graded sides scanned | ${meta.totalSidesScanned} |`);
  out.push(`| Graded sides w/ outcome | ${pickRows.length} |`);
  out.push(`| **SHIPPED (matches dashboard)** | **${shippedRows.length}** |`);
  out.push(`| · of which lockStage = LOCKED | ${shippedRows.filter(r => r.lockStage === 'LOCKED').length} |`);
  out.push(`| · of which lockStage = null/other | ${shippedRows.filter(r => r.lockStage !== 'LOCKED').length} |`);
  out.push(`| · with frozen Δw stamp | ${shippedRows.filter(r => r.dwSource === 'frozen').length} |`);
  out.push(`| · with frozen Δq stamp | ${shippedRows.filter(r => r.dqSource === 'frozen').length} |`);
  out.push(`| · Δq recomputed from walletDetails (contribution-only) | ${shippedRows.filter(r => r.dqSource === 'recomputed_from_wallet_details').length} |`);
  out.push(`| · uncategorized (no Δw stamp) | ${shippedRows.filter(r => r.dwFrozen == null).length} |`);
  out.push(`| Sharp Vault hidden-star positions | ${vaultRows.length} |`);
  out.push(`| Unique wallets observed | ${new Set(walletBets.map(b => b.wallet)).size} |`);
  out.push(`| Graded date range | ${meta.dateMin || '—'} … ${meta.dateMax || '—'} |`);
  out.push(`| Sports represented | ${sports.join(', ') || '—'} |`);
  out.push(`| Markets represented | ${markets.join(', ') || '—'} |`);
  out.push('');

  // Headline reconciliation: what we'd see on the dashboard.
  const allGradedAgg = finalizeAgg(pickRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
  const shippedAgg   = finalizeAgg(shippedRows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
  const lockableShipped = shippedRows.filter(r => r.dwFrozen != null && r.dqFrozen != null && r.dwFrozen >= 1 && r.dqFrozen >= 1);
  const lockableAgg = finalizeAgg(lockableShipped.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
  out.push(mdHeader(['Cohort', 'N', 'W-L-P', 'WR%', 'PnL (peak units)', 'PnL (flat 1u)']));
  out.push(`| All graded sides | ${allGradedAgg.n} | ${allGradedAgg.w}-${allGradedAgg.l}-${allGradedAgg.p} | ${fmtPct(allGradedAgg.wr)} | ${sign(allGradedAgg.profitU, 2)}u | ${sign(allGradedAgg.flatU, 2)}u |`);
  out.push(`| **SHIPPED (dashboard-equivalent)** | **${shippedAgg.n}** | **${shippedAgg.w}-${shippedAgg.l}-${shippedAgg.p}** | **${fmtPct(shippedAgg.wr)}** | **${sign(shippedAgg.profitU, 2)}u** | **${sign(shippedAgg.flatU, 2)}u** |`);
  out.push(`| · of shipped, frozen Δw≥+1 ∧ Δq≥+1 | ${lockableAgg.n} | ${lockableAgg.w}-${lockableAgg.l}-${lockableAgg.p} | ${fmtPct(lockableAgg.wr)} | ${sign(lockableAgg.profitU, 2)}u | ${sign(lockableAgg.flatU, 2)}u |`);
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §2. DAILY PnL BY (Δw × Δq) COHORT — frozen stamps, peak units
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Daily PnL by (frozen Δw × Δq) cohort');
  out.push('');
  out.push('Every column counts only **shipped** picks (the dashboard set). Cohort tag is the **frozen** Δw / Δq at last write before the T-15 freeze. Picks lacking a Δw stamp are lumped into `Uncat`. PnL in peak units. Cumulative running PnL is on the rightmost column.');
  out.push('');
  out.push(mdHeader([
    'Date',
    'TOTAL N · WR · PnL',
    'LOCK (1/1+) PnL',
    'SUPER TOP',
    'TOP',
    'FLOOR-A (1/1)',
    'FLOOR-B (1/≥2)',
    'SUB-FLOOR',
    'STALE Δw=0',
    'STALE Δw≤−1',
    'Uncat',
    'Cum Total PnL',
  ]));
  let cumTotalPnl = 0;
  for (const date of allDates) {
    const day = shippedRows.filter(r => r.date === date);
    if (!day.length) continue;
    const totalAgg = finalizeAgg(day.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    cumTotalPnl += (totalAgg.profitU || 0);

    const cohortAggs = {};
    for (const co of COHORTS) {
      const slice = day.filter(r => r.dwFrozen != null && co.f(r.dwFrozen, r.dqFrozen ?? 0));
      cohortAggs[co.id] = finalizeAgg(slice.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    }
    const uncat = day.filter(r => r.dwFrozen == null);
    const uncatAgg = finalizeAgg(uncat.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));

    const lockSlice = day.filter(r => {
      if (r.dwFrozen == null) return false;
      const co = cohortFor(r.dwFrozen, r.dqFrozen ?? 0);
      return co && LOCK_COHORT_IDS.has(co);
    });
    const lockDayAgg = finalizeAgg(lockSlice.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));

    const cell = (a) => a.n === 0 ? '—' : `${a.n} · ${fmtPct(a.wr, 0)} · ${sign(a.profitU, 2)}u`;
    out.push(`| ${date} | ${cell(totalAgg)} | **${cell(lockDayAgg)}** | ${cell(cohortAggs.super_top)} | ${cell(cohortAggs.top)} | ${cell(cohortAggs.floor_a)} | ${cell(cohortAggs.floor_b)} | ${cell(cohortAggs.sub_floor)} | ${cell(cohortAggs.mute_zero)} | ${cell(cohortAggs.mute_neg)} | ${cell(uncatAgg)} | ${sign(cumTotalPnl, 2)}u |`);
  }
  out.push('');
  out.push('### Cohort cumulative roll-up — shipped picks only');
  out.push('');
  out.push(mdHeader(['Cohort', 'N', 'W-L-P', 'WR%', 'PnL (peak units)', 'PnL (flat 1u)']));
  for (const co of COHORTS) {
    const slice = shippedRows.filter(r => r.dwFrozen != null && co.f(r.dwFrozen, r.dqFrozen ?? 0));
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    if (a.n === 0) { out.push(`| ${co.label} | 0 | — | — | — | — |`); continue; }
    const isLock = LOCK_COHORT_IDS.has(co.id) ? '**' : '';
    out.push(`| ${isLock}${co.label}${isLock} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u |`);
  }
  const uncatAll = shippedRows.filter(r => r.dwFrozen == null);
  if (uncatAll.length) {
    const a = finalizeAgg(uncatAll.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    out.push(`| Uncategorized (no Δw stamp) | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §3. FROZEN VAULT-STAR BUCKET PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. Frozen Vault-Star bucket performance');
  out.push('');
  out.push('Shipped picks bucketed by their frozen `v8_vaultStar` value (or by `peak.stars` when v8_vaultStar wasn\'t stamped). PnL in peak units.');
  out.push('');
  out.push(mdHeader([
    'Vault-Star bucket', 'N', 'W-L-P', 'WR%', 'PnL (peak u)', 'PnL (flat 1u)', 'Avg odds',
  ]));
  for (const b of STAR_BUCKETS) {
    const slice = shippedRows.filter(r => {
      const s = r.vaultStar != null ? r.vaultStar : r.peakStars;
      return s != null && s >= b.min && s <= b.max;
    });
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    if (a.n === 0) { out.push(`| ${b.label} | 0 | — | — | — | — | — |`); continue; }
    const oddsSlice = slice.map(r => r.odds).filter(v => v != null);
    const avgOdds = oddsSlice.length ? (oddsSlice.reduce((s, v) => s + v, 0) / oddsSlice.length) : null;
    out.push(`| ${b.label} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u | ${avgOdds == null ? '—' : sign(avgOdds, 0)} |`);
  }
  out.push('');

  out.push('### Elite (≥4.5★) by sport');
  out.push('');
  out.push(mdHeader(['Sport', 'N', 'W-L-P', 'WR%', 'PnL (peak u)', 'PnL (flat 1u)']));
  for (const sport of sports) {
    const slice = shippedRows.filter(r => {
      const s = r.vaultStar != null ? r.vaultStar : r.peakStars;
      return r.sport === sport && s != null && s >= 4.5;
    });
    const a = finalizeAgg(slice.reduce((acc, r) => { pushAgg(acc, r); return acc; }, emptyAgg()));
    if (a.n === 0) { out.push(`| ${sport.toUpperCase()} | 0 | — | — | — | — |`); continue; }
    out.push(`| ${sport.toUpperCase()} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u |`);
  }
  out.push('');

  out.push('### Daily Vault-Star PnL band');
  out.push('');
  out.push('Per-day peak-unit PnL split into three star bands.');
  out.push('');
  out.push(mdHeader(['Date', '5★ N · PnL', '4.5–4.0★ N · PnL', '≤3.5★ N · PnL', 'TOTAL PnL']));
  for (const date of allDates) {
    const day = shippedRows.filter(r => r.date === date);
    if (!day.length) continue;
    const starOf = (r) => r.vaultStar != null ? r.vaultStar : (r.peakStars ?? 0);
    const tier1 = day.filter(r => starOf(r) >= 5.0);
    const tier2 = day.filter(r => starOf(r) >= 4.0 && starOf(r) < 5.0);
    const tier3 = day.filter(r => starOf(r) <  4.0);
    const a1 = finalizeAgg(tier1.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const a2 = finalizeAgg(tier2.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const a3 = finalizeAgg(tier3.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));
    const tot = (a1.profitU || 0) + (a2.profitU || 0) + (a3.profitU || 0);
    const cell = (a) => a.n === 0 ? '—' : `${a.n} · ${sign(a.profitU, 2)}u`;
    out.push(`| ${date} | ${cell(a1)} | ${cell(a2)} | ${cell(a3)} | ${sign(tot, 2)}u |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §4. SHARP VAULT HIDDEN-STAR PERFORMANCE (separate analysis)
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Sharp Vault hidden-star performance (`sharp_action_positions.v8_stars`)');
  out.push('');
  out.push('This is the Sharp Vault-only check from the hidden `v8_stars` field on individual `sharp_action_positions`. It excludes `vaultQualified=false` shadow rows and includes only graded WIN/LOSS positions since the v6 cutover.');
  out.push('');
  out.push('### §4a. Hidden-star win rates');
  out.push('');
  out.push(mdHeader(['Hidden star band', 'N', 'W-L', 'WR%', 'Total invested', 'Total PnL', '$ ROI']));
  const vaultBands = ['5★', '4★', '3★', '2★', '<2★'];
  for (const band of vaultBands) {
    const slice = vaultRows.filter(r => vaultStarBand(r) === band);
    const a = finalizeVaultAgg(slice.reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
    if (!a.n) { out.push(`| ${band} | 0 | — | — | — | — | — |`); continue; }
    out.push(`| ${band} | ${a.n} | ${a.w}-${a.l} | ${fmtPct(a.wr)} | ${fmtMoneyShort(a.invested)} | ${fmtMoneyShort(a.pnl)} | ${fmtSignPct(a.dollarRoi)} |`);
  }
  const vaultElite = finalizeVaultAgg(vaultRows.filter(r => r.hiddenStars >= 4.0).reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
  const vaultNonElite = finalizeVaultAgg(vaultRows.filter(r => r.hiddenStars < 4.0).reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
  out.push(`| **4★+ combined** | **${vaultElite.n}** | **${vaultElite.w}-${vaultElite.l}** | **${fmtPct(vaultElite.wr)}** | **${fmtMoneyShort(vaultElite.invested)}** | **${fmtMoneyShort(vaultElite.pnl)}** | **${fmtSignPct(vaultElite.dollarRoi)}** |`);
  out.push(`| **<4★ combined** | **${vaultNonElite.n}** | **${vaultNonElite.w}-${vaultNonElite.l}** | **${fmtPct(vaultNonElite.wr)}** | **${fmtMoneyShort(vaultNonElite.invested)}** | **${fmtMoneyShort(vaultNonElite.pnl)}** | **${fmtSignPct(vaultNonElite.dollarRoi)}** |`);
  out.push('');

  out.push('### §4b. 5★ / 4★ hidden-star performance by sport');
  out.push('');
  out.push(mdHeader(['Sport', '5★ N · WR · $ROI · PnL', '4★ N · WR · $ROI · PnL', '4★+ combined']));
  const vaultCell = (rows) => {
    const a = finalizeVaultAgg(rows.reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
    if (!a.n) return '—';
    return `${a.n} · ${fmtPct(a.wr, 0)} · ${fmtSignPct(a.dollarRoi, 0)} · ${fmtMoneyShort(a.pnl)}`;
  };
  for (const sport of vaultSports) {
    const bySport = vaultRows.filter(r => r.sport === sport);
    out.push(`| ${sport.toUpperCase()} | ${vaultCell(bySport.filter(r => vaultStarBand(r) === '5★'))} | ${vaultCell(bySport.filter(r => vaultStarBand(r) === '4★'))} | **${vaultCell(bySport.filter(r => r.hiddenStars >= 4.0))}** |`);
  }
  out.push('');

  out.push('### §4c. Daily 4★+ Sharp Vault timeline');
  out.push('');
  out.push(mdHeader(['Date', '4★+ N', 'W-L', 'WR%', '$ ROI', 'PnL']));
  for (const date of [...new Set(vaultRows.map(r => r.date))].sort()) {
    const slice = vaultRows.filter(r => r.date === date && r.hiddenStars >= 4.0);
    const a = finalizeVaultAgg(slice.reduce((acc, r) => { pushVaultAgg(acc, r); return acc; }, emptyVaultAgg()));
    if (!a.n) continue;
    out.push(`| ${date} | ${a.n} | ${a.w}-${a.l} | ${fmtPct(a.wr)} | ${fmtSignPct(a.dollarRoi)} | ${fmtMoneyShort(a.pnl)} |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §5. FROZEN (Δw × Δq) WIN MATRIX — shipped picks only
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. Frozen Δw × Δq win matrix — shipped picks');
  out.push('');
  out.push(`Shipped picks only. Frozen \`v8_walletConsensusDelta\` (rows) × frozen \`v8_walletConsensusQualityMargin\` (columns). Cell format: \`N · W-L-P · WR% · ROI%\` (peak-units ROI). Extreme axes (±3) clamped. ROI hidden when N < ${MIN_N_FOR_ROI}. **Lock floor: Δw ≥ +1 ∧ Δq ≥ +1.**`);
  out.push('');
  function buildMatrix(rows) {
    const cells = {};
    for (const w of DW_BUCKETS) for (const q of DQ_BUCKETS) {
      cells[`${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`] = emptyAgg();
    }
    for (const r of rows) {
      if (r.dwFrozen == null) continue;
      const cw = clampDelta(r.dwFrozen, DW_BUCKETS[0], DW_BUCKETS[DW_BUCKETS.length - 1]);
      const cq = clampDelta(r.dqFrozen ?? 0, DQ_BUCKETS[0], DQ_BUCKETS[DQ_BUCKETS.length - 1]);
      const k = `${cw >= 0 ? '+' : ''}${cw},${cq >= 0 ? '+' : ''}${cq}`;
      pushAgg(cells[k], r);
    }
    return cells;
  }
  function mdMatrix(title, cells, n) {
    out.push(`### ${title} (N = ${n})`);
    out.push('');
    out.push('| | ' + DQ_BUCKETS.map(q => `**Δq${q >= 0 ? '+' : ''}${q}**`).join(' | ') + ' |');
    out.push('|---|' + DQ_BUCKETS.map(() => '---').join('|') + '|');
    for (const w of DW_BUCKETS) {
      const row = [`**Δw${w >= 0 ? '+' : ''}${w}**`];
      for (const q of DQ_BUCKETS) {
        const k = `${w >= 0 ? '+' : ''}${w},${q >= 0 ? '+' : ''}${q}`;
        const c = finalizeAgg(cells[k]);
        if (c.n === 0) { row.push('—'); continue; }
        const wrStr  = c.wr  == null ? '—' : `${c.wr.toFixed(0)}%`;
        const roi = c.n ? (c.profitU / c.n) * 100 : null;
        const roiStr = c.n >= MIN_N_FOR_ROI && roi != null ? ` \`${sign(roi, 0)}%\`` : '';
        row.push(`N=${c.n} · ${c.w}-${c.l}${c.p ? `-${c.p}` : ''} · ${wrStr}${roiStr}`);
      }
      out.push('| ' + row.join(' | ') + ' |');
    }
    out.push('');
  }
  const shippedWithDw = shippedRows.filter(r => r.dwFrozen != null);
  mdMatrix('All markets', buildMatrix(shippedWithDw), shippedWithDw.length);
  for (const sport of sports) {
    const slice = shippedWithDw.filter(r => r.sport === sport);
    if (!slice.length) continue;
    mdMatrix(`Sport — ${sport.toUpperCase()}`, buildMatrix(slice), slice.length);
  }
  for (const market of markets) {
    const slice = shippedWithDw.filter(r => r.market === market);
    if (!slice.length) continue;
    mdMatrix(`Market — ${market}`, buildMatrix(slice), slice.length);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §6. RECONCILIATION & ANOMALIES — engine self-check
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §6. Reconciliation & anomalies — engine self-check');
  out.push('');
  out.push('Where the live engine\'s **shipped state** disagrees with what the **frozen v6 stamps** say it should have shipped. Read these as bug indicators: each row is a side where the system either left a stale lock on the board or muted a pick that the v6 floor said was lockable. PnL is in peak units (the actual cost / benefit to users).');
  out.push('');

  // Anomaly classes.
  const stale = shippedRows.filter(r =>
    r.dwFrozen != null && r.dqFrozen != null &&
    !(r.dwFrozen >= 1 && r.dqFrozen >= 1)
  );
  const overMute = pickRows.filter(r =>
    !r.inDashboard && r.cancelled &&
    r.dwFrozen != null && r.dqFrozen != null &&
    r.dwFrozen >= 1 && r.dqFrozen >= 1
  );
  const shadowStrong = pickRows.filter(r =>
    r.lockStage === 'SHADOW' && !r.superseded &&
    r.dwFrozen != null && r.dqFrozen != null &&
    r.dwFrozen >= 2 && r.dqFrozen >= 2 &&
    (r.outcome === 'WIN' || r.outcome === 'LOSS' || r.outcome === 'PUSH')
  );
  const highStarLowDw = shippedRows.filter(r =>
    (r.peakStars >= 4.0) && r.dwFrozen != null && r.dwFrozen <= 0
  );

  const anomalyAgg = (rows) => finalizeAgg(rows.reduce((a, r) => { pushAgg(a, r); return a; }, emptyAgg()));

  out.push('### §6a. Anomaly counts');
  out.push('');
  out.push(mdHeader(['Anomaly', 'N', 'W-L-P', 'WR%', 'PnL (peak u)', 'Read as']));
  const aStale = anomalyAgg(stale);
  out.push(`| **Stale lock** — shipped LOCKED/ACTIVE, frozen Δw/Δq below floor | ${aStale.n} | ${aStale.w}-${aStale.l}-${aStale.p} | ${fmtPct(aStale.wr)} | ${sign(aStale.profitU, 2)}u | engine left a sub-floor pick on the board |`);
  const aOverMute = anomalyAgg(overMute);
  out.push(`| **Over-mute** — muted/cancelled by engine, frozen Δw≥+1 ∧ Δq≥+1 | ${aOverMute.n} | ${aOverMute.w}-${aOverMute.l}-${aOverMute.p} | ${fmtPct(aOverMute.wr)} | ${sign(aOverMute.profitU, 2)}u | engine killed a play that satisfied the floor |`);
  const aShadow = anomalyAgg(shadowStrong);
  out.push(`| **Shadow-strong** — stayed SHADOW even though frozen Δw≥+2 ∧ Δq≥+2 | ${aShadow.n} | ${aShadow.w}-${aShadow.l}-${aShadow.p} | ${fmtPct(aShadow.wr)} | ${sign(aShadow.profitU, 2)}u | engine never promoted a SUPER TOP-eligible pick |`);
  const aStarsNoDw = anomalyAgg(highStarLowDw);
  out.push(`| **Stars without margin** — peak stars ≥ 4.0★, frozen Δw ≤ 0 | ${aStarsNoDw.n} | ${aStarsNoDw.w}-${aStarsNoDw.l}-${aStarsNoDw.p} | ${fmtPct(aStarsNoDw.wr)} | ${sign(aStarsNoDw.profitU, 2)}u | star math diverged from delta math |`);
  out.push('');

  // Stale lock bucket breakdown — which sub-floor cohorts contributed.
  out.push('### §6b. Stale-lock cohort breakdown');
  out.push('');
  out.push('Of every shipped pick whose frozen deltas fall **below** the v6 lock floor, which cohort did it land in?');
  out.push('');
  out.push(mdHeader(['Cohort (frozen)', 'N', 'W-L-P', 'WR%', 'PnL (peak u)']));
  for (const co of COHORTS.filter(c => !LOCK_COHORT_IDS.has(c.id))) {
    const slice = stale.filter(r => co.f(r.dwFrozen, r.dqFrozen));
    const a = anomalyAgg(slice);
    if (!a.n) continue;
    out.push(`| ${co.label} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u |`);
  }
  out.push('');

  // Daily stale-lock cost — useful to spot whether bug is intermittent.
  out.push('### §6c. Daily stale-lock PnL drag');
  out.push('');
  out.push('Per-day cost of stale locks (the picks the engine left on the board even though their frozen Δw / Δq dropped below the lock floor). Compare to the day\'s shipped PnL.');
  out.push('');
  out.push(mdHeader(['Date', 'Shipped N · PnL', 'Stale-lock N · PnL', 'Stale share of shipped PnL']));
  for (const date of allDates) {
    const day = shippedRows.filter(r => r.date === date);
    if (!day.length) continue;
    const dayAgg = anomalyAgg(day);
    const dayStale = anomalyAgg(stale.filter(r => r.date === date));
    const share = dayAgg.profitU !== 0 ? `${(dayStale.profitU / dayAgg.profitU * 100).toFixed(0)}%` : '—';
    out.push(`| ${date} | ${dayAgg.n} · ${sign(dayAgg.profitU, 2)}u | ${dayStale.n} · ${sign(dayStale.profitU, 2)}u | ${share} |`);
  }
  out.push('');

  // Top stale-lock examples for inspection.
  out.push('### §6d. Top stale-lock examples (worst peak-unit losses)');
  out.push('');
  out.push('Last 20 graded sides where engine state and frozen deltas disagree most painfully. Useful for pulling individual docs and walking the audit.');
  out.push('');
  out.push(mdHeader(['Date', 'Doc', 'Side', 'Stage / Health', 'Stars · Units', 'Δw / Δq (frozen)', 'Outcome', 'PnL']));
  const staleSorted = [...stale].sort((a, b) => (a.profitU || 0) - (b.profitU || 0)).slice(0, 20);
  for (const r of staleSorted) {
    out.push(`| ${r.date} | \`${r.docId}\` | ${r.sideKey} | ${r.lockStage || '—'} / ${r.healthStatus || '—'} | ${r.peakStars?.toFixed?.(1) || '—'}★ · ${r.peakUnits}u | ${sign(r.dwFrozen, 0)} / ${sign(r.dqFrozen, 0)} | ${r.outcome} | ${sign(r.profitU, 2)}u |`);
  }
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §7. WALLET ROSTER GROWTH & PROFITABILITY (unchanged math)
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §7. Wallet roster growth & profitability');
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
  out.push('### §7a. Per-sport wallet snapshot');
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

  out.push('### §7b. Daily roster growth (cumulative through each date)');
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

  out.push('### §7c. Top 10 profitable wallets by sport');
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
  // §8. WALLET WINNERS DESCRIPTIVES
  // ═══════════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §8. Wallet winners — descriptive stats');
  out.push('');
  out.push(`Every (wallet × sport) row where the wallet has ≥ ${MIN_BETS} bets in the sport AND flat PnL > 0. A wallet can appear in multiple sports.`);
  out.push('');

  function buildWalletSportRows(rows, sport) {
    const slice = rows.filter(b => b.sport === sport);
    const byWallet = new Map();
    for (const b of slice) {
      if (!byWallet.has(b.wallet)) byWallet.set(b.wallet, []);
      byWallet.get(b.wallet).push(b);
    }
    const out = [];
    for (const [wallet, bs] of byWallet) {
      const n = bs.length;
      if (n < MIN_BETS) continue;
      const wins = bs.filter(b => b.won === 1).length;
      const sizes = bs.map(b => b.invested || 0);
      const sortedSizes = [...sizes].sort((a, b) => a - b);
      const avgSize = sizes.reduce((a, b) => a + b, 0) / n;
      const maxSize = Math.max(...sizes);
      const invested = sizes.reduce((a, b) => a + b, 0);
      const dollarPnl = bs.reduce((a, b) => a + (b.dollarPnl || 0), 0);
      const flatPnl = bs.reduce((a, b) => a + (b.flat || 0), 0);
      const flatRoi = (flatPnl / n) * 100;
      const dollarRoi = invested > 0 ? (dollarPnl / invested) * 100 : null;
      const dates = [...new Set(bs.map(b => b.date))].sort();
      const span = dayDiff(dates[0], dates[dates.length - 1]) + 1;
      const betsPerDay = n / span;
      out.push({
        wallet, sport,
        n, wins, losses: n - wins, wr: (wins / n) * 100,
        avgSize, medSize: quantile(sortedSizes, 0.5), maxSize, invested,
        dollarPnl, dollarRoi, flatPnl, flatRoi,
        firstDate: dates[0], lastDate: dates[dates.length - 1],
        daysActive: dates.length, span, betsPerDay,
      });
    }
    return out;
  }
  const winnerRows = [];
  for (const sport of sports) winnerRows.push(...buildWalletSportRows(walletBets, sport).filter(r => r.flatPnl > 0));

  out.push('### §8a. Winner cohort summary by sport');
  out.push('');
  out.push(mdHeader(['Sport', 'Winners', 'Σ bets', 'Σ invested', 'Σ $PnL', 'Mean WR%', 'Mean N', 'Mean avg $', 'Mean bets/day', 'Mean flat ROI']));
  for (const sport of sports) {
    const w = winnerRows.filter(r => r.sport === sport);
    if (!w.length) { out.push(`| ${sport.toUpperCase()} | 0 | — | — | — | — | — | — | — | — |`); continue; }
    const sumN = w.reduce((a, b) => a + b.n, 0);
    const sumInv = w.reduce((a, b) => a + b.invested, 0);
    const sumPnl = w.reduce((a, b) => a + b.dollarPnl, 0);
    const meanWr = w.reduce((a, b) => a + b.wr, 0) / w.length;
    const meanN = sumN / w.length;
    const meanSize = w.reduce((a, b) => a + b.avgSize, 0) / w.length;
    const meanBpd = w.reduce((a, b) => a + b.betsPerDay, 0) / w.length;
    const meanRoi = w.reduce((a, b) => a + b.flatRoi, 0) / w.length;
    out.push(`| ${sport.toUpperCase()} | ${w.length} | ${sumN} | ${fmtMoneyShort(sumInv)} | ${fmtMoneyShort(sumPnl)} | ${meanWr.toFixed(1)}% | ${meanN.toFixed(1)} | ${fmtMoneyShort(meanSize)} | ${meanBpd.toFixed(2)} | ${fmtSignPct(meanRoi)} |`);
  }
  if (winnerRows.length) {
    const sumN = winnerRows.reduce((a, b) => a + b.n, 0);
    const sumInv = winnerRows.reduce((a, b) => a + b.invested, 0);
    const sumPnl = winnerRows.reduce((a, b) => a + b.dollarPnl, 0);
    const meanWr = winnerRows.reduce((a, b) => a + b.wr, 0) / winnerRows.length;
    const meanN = sumN / winnerRows.length;
    const meanSize = winnerRows.reduce((a, b) => a + b.avgSize, 0) / winnerRows.length;
    const meanBpd = winnerRows.reduce((a, b) => a + b.betsPerDay, 0) / winnerRows.length;
    const meanRoi = winnerRows.reduce((a, b) => a + b.flatRoi, 0) / winnerRows.length;
    out.push(`| **ALL** | **${winnerRows.length}** | **${sumN}** | **${fmtMoneyShort(sumInv)}** | **${fmtMoneyShort(sumPnl)}** | **${meanWr.toFixed(1)}%** | **${meanN.toFixed(1)}** | **${fmtMoneyShort(meanSize)}** | **${meanBpd.toFixed(2)}** | **${fmtSignPct(meanRoi)}** |`);
  }
  out.push('');

  out.push('### §8b. Winner cohort — quartile distribution');
  out.push('');
  out.push('Spread across every winning (wallet × sport) row.');
  out.push('');
  const metrics = [
    ['N (bets)',       winnerRows.map(r => r.n),          (v) => v.toFixed(1)],
    ['WR %',           winnerRows.map(r => r.wr),         (v) => v.toFixed(1) + '%'],
    ['Flat ROI %',     winnerRows.map(r => r.flatRoi),    (v) => fmtSignPct(v)],
    ['$ ROI %',        winnerRows.map(r => r.dollarRoi).filter(v => v != null), (v) => fmtSignPct(v)],
    ['Avg bet ($)',    winnerRows.map(r => r.avgSize),    fmtMoneyShort],
    ['Median bet ($)', winnerRows.map(r => r.medSize),    fmtMoneyShort],
    ['Max bet ($)',    winnerRows.map(r => r.maxSize),    fmtMoneyShort],
    ['Σ invested',     winnerRows.map(r => r.invested),   fmtMoneyShort],
    ['$ PnL',          winnerRows.map(r => r.dollarPnl),  fmtMoneyShort],
    ['Days active',    winnerRows.map(r => r.daysActive), (v) => v.toFixed(1)],
    ['Span (days)',    winnerRows.map(r => r.span),       (v) => v.toFixed(1)],
    ['Bets / day',     winnerRows.map(r => r.betsPerDay), (v) => v.toFixed(2)],
  ];
  out.push(mdHeader(['Metric', 'Min', 'Q25', 'Median', 'Q75', 'Max', 'Mean']));
  for (const [name, vals, fmt] of metrics) {
    const d = distrib(vals);
    out.push(`| ${name} | ${d.min == null ? '—' : fmt(d.min)} | ${d.q25 == null ? '—' : fmt(d.q25)} | ${d.median == null ? '—' : fmt(d.median)} | ${d.q75 == null ? '—' : fmt(d.q75)} | ${d.max == null ? '—' : fmt(d.max)} | ${d.mean == null ? '—' : fmt(d.mean)} |`);
  }
  out.push('');

  out.push('### §8c. Winner cadence archetypes');
  out.push('');
  out.push('Where do our winners cluster? Snipers fire rarely but big; volume bettors grind everything.');
  out.push('');
  const archetype = (r) => {
    if (r.n <= 3)  return 'Sniper (≤3 bets)';
    if (r.n <= 6)  return 'Sharp (4–6 bets)';
    if (r.n <= 10) return 'Grinder (7–10 bets)';
    return 'Volume (>10 bets)';
  };
  const order = ['Sniper (≤3 bets)', 'Sharp (4–6 bets)', 'Grinder (7–10 bets)', 'Volume (>10 bets)'];
  const buckets = new Map(order.map(k => [k, []]));
  for (const r of winnerRows) buckets.get(archetype(r)).push(r);
  out.push(mdHeader(['Archetype', 'Winners', 'Σ bets', 'Mean WR%', 'Mean flat ROI', 'Mean avg $', 'Mean bets/day', 'Σ $ PnL']));
  for (const k of order) {
    const rs = buckets.get(k);
    if (!rs.length) { out.push(`| ${k} | 0 | — | — | — | — | — | — |`); continue; }
    const sumN = rs.reduce((a, b) => a + b.n, 0);
    const mWr = rs.reduce((a, b) => a + b.wr, 0) / rs.length;
    const mRoi = rs.reduce((a, b) => a + b.flatRoi, 0) / rs.length;
    const mSize = rs.reduce((a, b) => a + b.avgSize, 0) / rs.length;
    const mBpd = rs.reduce((a, b) => a + b.betsPerDay, 0) / rs.length;
    const sumPnl = rs.reduce((a, b) => a + b.dollarPnl, 0);
    out.push(`| ${k} | ${rs.length} | ${sumN} | ${mWr.toFixed(1)}% | ${fmtSignPct(mRoi)} | ${fmtMoneyShort(mSize)} | ${mBpd.toFixed(2)} | ${fmtMoneyShort(sumPnl)} |`);
  }
  out.push('');

  // ─── §9. v7.1 HC dominance cohort monitoring ─────────────────────────────
  // Live monitor for the v7.1 HC-dominance feature (LOCK floor lowered for
  // Σ ∈ {3,4} when (HC_for ≥ 1) ∧ (HC_ag = 0); units sized at 1.5×).
  // Cohort partition: HC vs non-HC × Σ bucket × system version.
  out.push('## §9. v7.1 HC dominance cohort');
  out.push('');
  out.push('Tracks the live performance of the v7.1 HC-dominance gate. Picks must be `inDashboard` and have a frozen `v8_hcDominant` stamp (i.e. stamped under v7.1). HC_PROMOTED rows are picks promoted out of LEAN (Σ ∈ {3,4}) by HC dominance — the new edge surface.');
  out.push('');
  const v71Rows = pickRows.filter(r => r.inDashboard && r.systemVersion === '7.1' && r.hcDominant !== null);
  if (!v71Rows.length) {
    out.push('_No v7.1-stamped picks in the sample yet. Re-run after the next slate completes._');
    out.push('');
  } else {
    const aggCohort = (rows) => {
      const n = rows.length;
      const w = rows.filter(r => r.outcome === 'WIN').length;
      const l = rows.filter(r => r.outcome === 'LOSS').length;
      const p = rows.filter(r => r.outcome === 'PUSH').length;
      const wr = n ? (100 * w / Math.max(1, w + l)) : null;
      const profitU = rows.reduce((a, b) => a + (b.profitU || 0), 0);
      const flatU   = rows.reduce((a, b) => a + (b.flatProfit || 0), 0);
      const flatRoi = n ? (100 * flatU / n) : null;
      return { n, w, l, p, wr, profitU, flatU, flatRoi };
    };
    out.push('### §9a. HC vs non-HC by Σ bucket (v7.1 only)');
    out.push('');
    out.push(mdHeader(['Σ bucket', 'HC dominant', 'N', 'W-L-P', 'WR%', 'PnL_peak', 'PnL_flat', 'flat ROI%']));
    const sumOf = (r) => (r.dwFrozen ?? 0) + (r.dqFrozen ?? 0);
    const buckets = [
      { label: '3',     pred: r => sumOf(r) === 3 },
      { label: '4',     pred: r => sumOf(r) === 4 },
      { label: '5',     pred: r => sumOf(r) === 5 },
      { label: '6',     pred: r => sumOf(r) === 6 },
      { label: '≥7',    pred: r => sumOf(r) >= 7 },
    ];
    for (const b of buckets) {
      for (const hc of [true, false]) {
        const rows = v71Rows.filter(r => b.pred(r) && r.hcDominant === hc);
        const a = aggCohort(rows);
        out.push(`| ${b.label} | ${hc ? 'YES' : 'NO'} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u | ${fmtSignPct(a.flatRoi)} |`);
      }
    }
    out.push('');
    out.push('### §9b. HC_PROMOTED cohort (Σ ∈ {3,4}, lifted out of LEAN by HC)');
    out.push('');
    const hcPromoted = v71Rows.filter(r => r.promotedBy === 'hc-dominance');
    const hcAll      = v71Rows.filter(r => r.hcDominant);
    const hcSig5     = v71Rows.filter(r => r.hcDominant && (r.dwFrozen ?? 0) + (r.dqFrozen ?? 0) >= 5);
    out.push(mdHeader(['Cohort', 'N', 'W-L-P', 'WR%', 'PnL_peak', 'PnL_flat', 'flat ROI%']));
    for (const [label, rows] of [
      ['HC_PROMOTED (Σ ∈ {3,4})', hcPromoted],
      ['HC ∧ Σ ≥ +5',             hcSig5],
      ['All HC dominant',          hcAll],
    ]) {
      const a = aggCohort(rows);
      out.push(`| ${label} | ${a.n} | ${a.w}-${a.l}-${a.p} | ${fmtPct(a.wr)} | ${sign(a.profitU, 2)}u | ${sign(a.flatU, 2)}u | ${fmtSignPct(a.flatRoi)} |`);
    }
    out.push('');
    out.push('### §9c. HC dominance per sport');
    out.push('');
    out.push(mdHeader(['Sport', 'HC_PROMOTED N', 'WR%', 'flat ROI%', 'All HC N', 'WR%', 'flat ROI%']));
    const sports = [...new Set(v71Rows.map(r => r.sport))].sort();
    for (const sp of sports) {
      const promo = aggCohort(hcPromoted.filter(r => r.sport === sp));
      const all   = aggCohort(hcAll.filter(r => r.sport === sp));
      out.push(`| ${sp} | ${promo.n} | ${fmtPct(promo.wr)} | ${fmtSignPct(promo.flatRoi)} | ${all.n} | ${fmtPct(all.wr)} | ${fmtSignPct(all.flatRoi)} |`);
    }
    out.push('');
    out.push(`_v7.1 picks since cutover: **${v71Rows.length}** (HC dominant: ${hcAll.length} · HC promoted: ${hcPromoted.length})_`);
    out.push('');
  }

  // ─── §10. v7.2 HC-margin tiered cohort monitoring ─────────────────────────
  // Mirrors §9's structure but partitions by HC_margin tier (the v7.2
  // continuous quality dial) instead of binary HC_DOM. Three tiers:
  //   HC_m ≤0  baseline (no upsize)
  //   HC_m =+1 standard HC tier (×1.5 multiplier)
  //   HC_m ≥+2 SUPER HC tier (×1.75 multiplier — proven 9-1 cohort)
  // Source backtest: WALLET_HC_MARGIN_ANALYSIS.md.
  const v72Rows = pickRows.filter(r =>
    r.systemVersion === '7.2' && r.inDashboard && !r.superseded
    && (r.outcome === 'WIN' || r.outcome === 'LOSS') && r.hcMargin != null
  );
  if (v72Rows.length === 0) {
    out.push('---');
    out.push('## §10. v7.2 HC-margin tier cohort');
    out.push('');
    out.push(`_No v7.2-stamped picks in the sample yet (cutover 2026-04-30). §10 will populate as v7.2 picks accumulate._`);
    out.push('');
  } else {
    out.push('---');
    out.push('## §10. v7.2 HC-margin tier cohort');
    out.push('');
    out.push('Tracks the live performance of the v7.2 HC-margin tiered gate (replaces v7.1 binary HC_DOM). Picks must be `inDashboard` and have a frozen `v8_hcMargin` stamp under v7.2.');
    out.push('');
    const sigmaBucket = (sum) => sum <= 2 ? 'Σ=2' : sum === 3 ? 'Σ=3' : sum === 4 ? 'Σ=4' : sum === 5 ? 'Σ=5' : sum === 6 ? 'Σ=6' : 'Σ≥7';
    const SIGMA_ORDER = ['Σ=2', 'Σ=3', 'Σ=4', 'Σ=5', 'Σ=6', 'Σ≥7'];

    out.push('### §10a. v7.2 HC margin tier × Σ bucket');
    out.push('');
    out.push('| HC_m \\ Σ | ' + SIGMA_ORDER.join(' | ') + ' | TOTAL |');
    out.push('|---|' + SIGMA_ORDER.map(() => '---').join('|') + '|---|');
    const margins = [
      ['≤0', r => r.hcMargin <= 0],
      ['+1', r => r.hcMargin === 1],
      ['≥+2', r => r.hcMargin >= 2],
    ];
    for (const [label, pred] of margins) {
      const rowCells = [`**HC_m ${label}**`];
      const filtered = v72Rows.filter(pred);
      for (const sb of SIGMA_ORDER) {
        const rs = filtered.filter(r => sigmaBucket((r.dwFrozen ?? 0) + (r.dqFrozen ?? 0)) === sb);
        const a = aggC(rs);
        rowCells.push(a.n ? `${a.n} · ${fmtPct(a.wr)} · ${fmtSignPct(a.flatRoi)}` : '—');
      }
      const tot = aggC(filtered);
      rowCells.push(tot.n ? `${tot.n} · ${fmtPct(tot.wr)} · ${fmtSignPct(tot.flatRoi)} · ${(tot.flatPnl >= 0 ? '+' : '')}${tot.flatPnl.toFixed(2)}u` : '—');
      out.push('| ' + rowCells.join(' | ') + ' |');
    }
    out.push('');

    out.push('### §10b. v7.2 promotion-source cohorts (out of LEAN / Σ=2)');
    out.push('');
    out.push('| Source | N | W-L | WR | flat ROI | flat PnL | peak PnL |');
    out.push('|---|---|---|---|---|---|---|');
    const sources = [
      ['v72-hc-margin (Σ ∈ {3,4})', r => r.promotedBy === 'v72-hc-margin'],
      ['v72-sigma2-lock (Σ=2 ∧ HC_m≥+2)', r => r.promotedBy === 'v72-sigma2-lock'],
      ['v72-sigma2-lean (Σ=2 ∧ HC_m=+1)', r => r.promotedBy === 'v72-sigma2-lean'],
      ['two-factor-floor (Σ ≥ +5)', r => r.promotedBy === 'two-factor-floor'],
    ];
    for (const [label, pred] of sources) {
      const a = aggC(v72Rows.filter(pred));
      if (!a.n) { out.push(`| ${label} | 0 | — | — | — | — | — |`); continue; }
      out.push(`| ${label} | ${a.n} | ${a.wins}-${a.losses} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${(a.flatPnl >= 0 ? '+' : '')}${a.flatPnl.toFixed(2)}u | ${(a.peakPnl >= 0 ? '+' : '')}${a.peakPnl.toFixed(2)}u |`);
    }
    out.push('');

    out.push('### §10c. SUPER-HC (HC_m ≥ +2) vs STANDARD (HC_m = +1) head-to-head');
    out.push('');
    out.push('| Cohort | N | W-L | WR | flat ROI | flat PnL | peak PnL |');
    out.push('|---|---|---|---|---|---|---|');
    const superHc = v72Rows.filter(r => r.hcMargin >= 2);
    const stdHc   = v72Rows.filter(r => r.hcMargin === 1);
    const noHc    = v72Rows.filter(r => r.hcMargin <= 0);
    for (const [label, rs] of [['HC_m ≥+2 (SUPER ×1.75)', superHc], ['HC_m =+1 (STANDARD ×1.5)', stdHc], ['HC_m ≤0 (no upsize)', noHc]]) {
      const a = aggC(rs);
      if (!a.n) { out.push(`| ${label} | 0 | — | — | — | — | — |`); continue; }
      out.push(`| ${label} | ${a.n} | ${a.wins}-${a.losses} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${(a.flatPnl >= 0 ? '+' : '')}${a.flatPnl.toFixed(2)}u | ${(a.peakPnl >= 0 ? '+' : '')}${a.peakPnl.toFixed(2)}u |`);
    }
    out.push('');
    out.push(`_v7.2 picks since cutover: **${v72Rows.length}** · SUPER-HC: ${superHc.length} · STANDARD-HC: ${stdHc.length} · no-HC: ${noHc.length}_`);
    out.push('');
  }

  // ─── §11. v7.3 HC-margin floor + MUTE override cohort ─────────────────────
  // Tracks the v7.3 promotion sources (sigma1-hc, sigma2-hc, hc-rescue) so
  // we can validate the analysis findings on real shipped samples:
  //   • WALLET_HC_MARGIN_ANALYSIS_FULL §2: MUTED ∧ HC_m ≥ +1 → 11-2 / +85% ROI
  //     → v73-hc-rescue cohort proves the override out (or doesn't).
  //   • WALLET_HC_MARGIN_ANALYSIS_FULL §4: Σ=2 ∧ HC_m ≥ +1 → +37% ROI
  //     → v73-sigma2-hc proves the floor lower out.
  //   • Σ=1 ∧ HC_m ≥ +1 → 50% / −3% (n=2, marginal)
  //     → v73-sigma1-hc tracked at 0.5u floor.
  const v73Rows = pickRows.filter(r =>
    r.systemVersion === '7.3' && r.inDashboard && !r.superseded
    && (r.outcome === 'WIN' || r.outcome === 'LOSS') && r.hcMargin != null
  );
  if (v73Rows.length === 0) {
    out.push('## §11. v7.3 HC-margin floor + MUTE override cohort');
    out.push('');
    out.push('_No v7.3-stamped picks in the sample yet (cutover 2026-04-30). §11 will populate as v7.3 picks accumulate._');
    out.push('');
  } else {
    out.push('## §11. v7.3 HC-margin floor + MUTE override cohort');
    out.push('');
    out.push('Tracks the live performance of the v7.3 floor lowering (Σ ∈ {1, 2} ∧ HC_m ≥ +1 → LOCK) and the MUTE override (HC_m ≥ +1 suppresses dw=0 / dq=0 / sum<3 mutes; CANCEL still fires). Picks must be `inDashboard` with `v8_systemVersion === \'7.3\'`.');
    out.push('');

    out.push('### §11a. v7.3 promotion-source cohorts');
    out.push('');
    out.push('| Promotion source | N | W-L | WR | flat ROI | flat PnL | peak PnL |');
    out.push('|---|---|---|---|---|---|---|');
    const v73Cohorts = [
      ['v73-sigma1-hc (Σ=1 ∧ HC_m ≥ +1)', r => r.promotedBy === 'v73-sigma1-hc'],
      ['v73-sigma2-hc (Σ=2 ∧ HC_m ≥ +1)', r => r.promotedBy === 'v73-sigma2-hc'],
      ['v73-hc-rescue (Σ ≥ +3 ∧ dw=0 ∨ dq=0)', r => r.promotedBy === 'v73-hc-rescue'],
      ['v72-hc-margin (Σ ∈ {3,4})',           r => r.promotedBy === 'v72-hc-margin'],
      ['v72-sigma2-lock (Σ=2 ∧ HC_m ≥ +2)',   r => r.promotedBy === 'v72-sigma2-lock'],
      ['two-factor-floor (Σ ≥ +5)',           r => r.promotedBy === 'two-factor-floor'],
    ];
    for (const [label, pred] of v73Cohorts) {
      const rs = v73Rows.filter(pred);
      const a = aggC(rs);
      if (!a.n) { out.push(`| ${label} | 0 | — | — | — | — | — |`); continue; }
      out.push(`| ${label} | ${a.n} | ${a.wins}-${a.losses} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${(a.flatPnl >= 0 ? '+' : '')}${a.flatPnl.toFixed(2)}u | ${(a.peakPnl >= 0 ? '+' : '')}${a.peakPnl.toFixed(2)}u |`);
    }
    out.push('');

    out.push('### §11b. v7.3 vs prior versions head-to-head');
    out.push('');
    out.push('| Cohort | N | W-L | WR | flat ROI | flat PnL | peak PnL |');
    out.push('|---|---|---|---|---|---|---|');
    const v73NewFloor = v73Rows.filter(r =>
      r.promotedBy === 'v73-sigma1-hc' || r.promotedBy === 'v73-sigma2-hc' || r.promotedBy === 'v73-hc-rescue'
    );
    const v73Established = v73Rows.filter(r =>
      r.promotedBy === 'v72-hc-margin' || r.promotedBy === 'v72-sigma2-lock'
        || r.promotedBy === 'hc-dominance' || r.promotedBy === 'two-factor-floor'
    );
    for (const [label, rs] of [
      ['v7.3 NEW (sigma1 + sigma2 + rescue)', v73NewFloor],
      ['v7.3 ESTABLISHED (Σ≥3 ∧ HC_m≥+1, Σ≥+5)', v73Established],
    ]) {
      const a = aggC(rs);
      if (!a.n) { out.push(`| ${label} | 0 | — | — | — | — | — |`); continue; }
      out.push(`| ${label} | ${a.n} | ${a.wins}-${a.losses} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${(a.flatPnl >= 0 ? '+' : '')}${a.flatPnl.toFixed(2)}u | ${(a.peakPnl >= 0 ? '+' : '')}${a.peakPnl.toFixed(2)}u |`);
    }
    out.push('');
    out.push(`_v7.3 picks since cutover: **${v73Rows.length}** · NEW v7.3 promotions: ${v73NewFloor.length} · established floor: ${v73Established.length}_`);
    out.push('');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // §12. HC-MARGIN UNIVERSAL MONITOR — the v7.3 core finding, refreshed daily
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // This section is THE live monitor for the v7.3 thesis: "HC margin ≥ +1
  // unilaterally lifts WR/ROI at every Σ bucket". We rebuild that table
  // every day across three windows (3-day rolling / 7-day rolling /
  // all-time since v6 cutover) × every sport × the full Σ × HC matrix.
  //
  // Universe: every graded side in the v6+ sample (LOCKED + LEAN + SHADOW
  // + MUTED + CANCELLED — i.e. NOT filtered on inDashboard). This mirrors
  // WALLET_HC_MARGIN_ANALYSIS_FULL — the universe we used to justify v7.3.
  // We need the rejected picks because the whole point of the override is
  // that the engine was rejecting picks the HC margin was telling us to
  // play.
  //
  // Lift = WR(HC_m ≥ +1) − WR(HC_m ≤ 0) within each Σ bucket. Two-prop
  // z-test p-value annotates each cell so we can see when a cohort
  // crosses statistical significance.
  out.push('---');
  out.push('## §12. HC-margin universal monitor (v7.3 core finding)');
  out.push('');
  out.push('Live re-run of the analysis that drove v7.3. Universe = **every graded side since v6 cutover** (`LOCKED + LEAN + SHADOW + MUTED + CANCELLED`). This mirrors `WALLET_HC_MARGIN_ANALYSIS_FULL`. Cell format: `N · WR · flat ROI`. Lift = `WR(HC_m≥+1) − WR(HC_m≤0)` with two-prop z-test p-value.');
  out.push('');
  out.push(`HC margin source split: **${stampedHc}** frozen (v7.1+ stamps) · **${recomputedHc}** recomputed via point-in-time tier lens · **${missingHc}** uncategorised (no walletDetails). Recompute uses the same CONFIRMED + sizeRatio ≥ ${HC_RATIO} rule the live engine applies.`);
  out.push('');
  const hcUniverse = pickRows.filter(r =>
    !r.superseded
    && r.hcMarginEffective != null
    && (r.outcome === 'WIN' || r.outcome === 'LOSS')
  );
  const asOf = meta.dateMax;
  const WINDOWS = [
    { id: 'd3',   label: '3-day',    days: 3 },
    { id: 'd7',   label: '7-day',    days: 7 },
    { id: 'all',  label: 'All-time', days: null },
  ];
  const fmtCell = (a) => a.n ? `${a.n} · ${fmtPct(a.wr)} · ${fmtSignPct(a.flatRoi)}` : '—';
  const fmtLift = (lift) => {
    if (lift.wr == null) return '—';
    const wrLbl  = `${(lift.wr  >= 0 ? '+' : '')}${lift.wr.toFixed(1)}pp`;
    const roiLbl = lift.roi == null ? '—' : `${(lift.roi >= 0 ? '+' : '')}${lift.roi.toFixed(1)}%`;
    const pLbl   = lift.p == null ? 'p=—' : (lift.p < 0.001 ? 'p<0.001' : `p=${lift.p.toFixed(3)}`);
    const sig    = lift.p != null && lift.p < 0.05 ? ' ★' : '';
    return `WR ${wrLbl} · ROI ${roiLbl} · ${pLbl}${sig}`;
  };

  function renderHcMatrix(rows, header) {
    const m = buildHcSigmaMatrix(rows);
    out.push(header);
    out.push('');
    if (m.totalEligible === 0) {
      out.push('_No eligible picks (rows need a frozen `v8_hcMargin` stamp). v7.1+ stamps this; older docs do not._');
      out.push('');
      return;
    }
    out.push(mdHeader(['HC_m \\ Σ', ...SIGMA_BUCKET_ORDER, 'TOTAL']));
    const margins = [
      ['≤0', (b) => b.byTier['≤0']],
      ['+1', (b) => b.byTier['+1']],
      ['≥+2', (b) => b.byTier['≥+2']],
    ];
    for (const [label, getCell] of margins) {
      const row = [`**HC_m ${label}**`];
      for (const sb of SIGMA_BUCKET_ORDER) {
        const bucket = m.sigmaBuckets.find(x => x.bucket === sb);
        row.push(fmtCell(getCell(bucket)));
      }
      // TOTAL across Σ for this HC margin band.
      const totRows = rows.filter(r => {
        if (r.outcome !== 'WIN' && r.outcome !== 'LOSS') return false;
        if (r.hcMarginEffective == null) return false;
        if (label === '≤0') return r.hcMarginEffective <= 0;
        if (label === '+1') return r.hcMarginEffective === 1;
        return r.hcMarginEffective >= 2;
      });
      const tWins = totRows.filter(r => r.outcome === 'WIN').length;
      const tFlat = totRows.reduce((s, r) => s + (r.flatProfit ?? 0), 0);
      const tWr = totRows.length ? tWins / totRows.length * 100 : null;
      const tRoi = totRows.length ? (tFlat / totRows.length) * 100 : null;
      row.push(totRows.length ? `${totRows.length} · ${fmtPct(tWr)} · ${fmtSignPct(tRoi)}` : '—');
      out.push('| ' + row.join(' | ') + ' |');
    }
    out.push('');
    // Lift table per Σ.
    out.push('**Lift per Σ (HC_m ≥ +1 vs HC_m ≤ 0):**');
    out.push('');
    out.push(mdHeader(['Σ bucket', 'N (HC≥+1)', 'WR (HC≥+1)', 'ROI (HC≥+1)', 'N (HC≤0)', 'WR (HC≤0)', 'ROI (HC≤0)', 'Lift']));
    for (const sb of SIGMA_BUCKET_ORDER) {
      const bucket = m.sigmaBuckets.find(x => x.bucket === sb);
      if (!bucket) continue;
      const inA  = bucket.in;
      const outA = bucket.out;
      if (inA.n === 0 && outA.n === 0) continue;
      out.push(`| ${sb} | ${inA.n} | ${fmtPct(inA.wr)} | ${fmtSignPct(inA.flatRoi)} | ${outA.n} | ${fmtPct(outA.wr)} | ${fmtSignPct(outA.flatRoi)} | ${fmtLift(bucket.lift)} |`);
    }
    out.push(`| **POOLED** | **${m.pooled.in.n}** | **${fmtPct(m.pooled.in.wr)}** | **${fmtSignPct(m.pooled.in.flatRoi)}** | **${m.pooled.out.n}** | **${fmtPct(m.pooled.out.wr)}** | **${fmtSignPct(m.pooled.out.flatRoi)}** | **${fmtLift(m.pooled.lift)}** |`);
    out.push('');
  }

  // §12a — All sports pooled, three windows
  out.push('### §12a. All sports pooled');
  out.push('');
  for (const w of WINDOWS) {
    const slice = rowsInWindow(hcUniverse, w.days, asOf);
    renderHcMatrix(slice, `#### ${w.label}${w.days ? ` (≤ ${w.days} calendar days through ${asOf})` : ` (${V6_CUTOVER} → ${asOf})`}`);
  }

  // §12b — Per-sport breakouts at every window (collapsed if N is too thin)
  for (const sport of sports) {
    out.push(`### §12${(['b','c','d','e','f','g'][sports.indexOf(sport)] || 'x')}. ${sport.toUpperCase()}`);
    out.push('');
    const sportRows = hcUniverse.filter(r => r.sport === sport);
    for (const w of WINDOWS) {
      const slice = rowsInWindow(sportRows, w.days, asOf);
      renderHcMatrix(slice, `#### ${sport.toUpperCase()} · ${w.label}${w.days ? ` (≤ ${w.days} days through ${asOf})` : ''}`);
    }
  }

  // §12 footer — leading-indicator interpretation
  out.push('### §12 — How to read');
  out.push('');
  out.push('- **Lift positive across every Σ bucket** = the v7.3 thesis is holding. The HC margin override + Σ ≤ 2 floor lowering are earning their keep at every part of the ladder.');
  out.push('- **Lift collapses (or flips) on a single Σ** = that bucket has either drifted (genuine signal decay) or is hostage to small-N variance. Cross-check the N column before reacting.');
  out.push('- **`★`** marks p < 0.05 (two-prop z-test). Sub-significant cells are still useful directionally but should not by themselves trigger a v7.x revision.');
  out.push('- **3-day window**: leading-indicator. If HC lift goes negative in the 3-day across multiple sports, raise alarm.');
  out.push('- **7-day window**: trend lens. Filters single-day variance; a 7-day collapse is a real signal.');
  out.push('- **All-time**: thesis check. Should match `WALLET_HC_MARGIN_ANALYSIS_FULL` within minor sample drift.');
  out.push('');

  // ═══════════════════════════════════════════════════════════════════════════
  // §13. PROVEN-WALLET GROWTH & TRACKING DESCRIPTIVES
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
  out.push('## §13. Proven-wallet roster growth & HC tracking');
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
  out.push('### §13a. Current proven-winner roster (snapshot)');
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
  out.push('### §13b. Live whitelist drift check');
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
  out.push('### §13c. Roster growth — 3d / 7d / 30d / all-time deltas');
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
  out.push('### §13d. Pipeline funnel — where each sport leaks');
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
  out.push('### §13e. HC backing density (the fuel for v7.3 HC margin)');
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
  out.push('### §13f. Bubble wallets — next-up graduations');
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

  // §13 footer — interpretation
  out.push('### §13 — How to read');
  out.push('');
  out.push('- **Roster growth flat in 7-day** + **funnel bottleneck = `data`** → re-run `exportWalletProfiles.js`. The flat-positive wallets are stuck at FLAT because Source-B coverage hasn\'t caught up. CONFIRMED gate is data-bound, not skill-bound.');
  out.push('- **Roster growth flat in 7-day** + **funnel bottleneck = `sample`** → wallets aren\'t reaching `≥' + MIN_BETS + '` reps fast enough. This is a slate-density problem; consider a soft `MIN_BETS = 1` shadow lane to surface bubble wallets earlier.');
  out.push('- **Roster shrank** (negative delta) → a previously CONFIRMED wallet just dropped flat-positive (lost a recent bet). Variance, not failure — but worth noting if a sport loses ≥3 in a week.');
  out.push('- **HC density on a sport drops below ~30%** → v7.3 promotions there will starve. Either the proven roster needs more CONFIRMED-tier wallets sizing aggressively, or the HC_RATIO (1.5) needs a sport-specific tune.');
  out.push('');

  // ─── Footer ────────────────────────────────────────────────────────────────
  out.push('---');
  out.push('');
  out.push(`_Driven by \`scripts/dailyV6Report.js\` · regenerates daily via \`.github/workflows/daily-v6-report.yml\` · WHITELIST_CONSENSUS_VERSION = 9 (v7.3) · QUALITY_CONTRIB_CUT = ${QUALITY_CUT} · inclusion mirrors live Pick Performance dashboard · cohort tags from frozen v6/v7.1/v7.2/v7.3 stamps · §12 HC universal monitor (3d/7d/all-time × sport) · §12 universe = full graded set (LOCKED+LEAN+SHADOW+MUTED+CANCELLED) · §13 proven-wallet roster mirrors \`exportWalletProfiles.js\`_`);
  out.push('');

  const outPath = join(REPO_ROOT, 'DAILY_V6_REPORT.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nWrote ${outPath}  (${out.length} lines)`);

  // Console summary.
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  SHARP INTEL v6 — DAILY MASTER REPORT (${nowET} ET)`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Sample:   scanned=${meta.totalSidesScanned}  graded=${pickRows.length}  shipped=${shippedRows.length}  dates=${allDates.length} (${meta.dateMin} → ${meta.dateMax})`);
  console.log(`SHIPPED (= dashboard):  N=${shippedAgg.n}  ${shippedAgg.w}-${shippedAgg.l}-${shippedAgg.p}  WR=${fmtPct(shippedAgg.wr)}  PnL_peak=${sign(shippedAgg.profitU, 2)}u  PnL_flat=${sign(shippedAgg.flatU, 2)}u`);
  console.log(`Lock-frozen subset:     N=${lockableAgg.n}  ${lockableAgg.w}-${lockableAgg.l}-${lockableAgg.p}  WR=${fmtPct(lockableAgg.wr)}  PnL_peak=${sign(lockableAgg.profitU, 2)}u  PnL_flat=${sign(lockableAgg.flatU, 2)}u`);
  console.log('\nAnomalies:');
  console.log(`  Stale lock              N=${stale.length}    PnL=${sign(aStale.profitU, 2)}u`);
  console.log(`  Over-mute               N=${overMute.length}    PnL=${sign(aOverMute.profitU, 2)}u (would-have)`);
  console.log(`  Shadow-strong           N=${shadowStrong.length}    PnL=${sign(aShadow.profitU, 2)}u (would-have)`);
  console.log(`  Stars without margin    N=${highStarLowDw.length}    PnL=${sign(aStarsNoDw.profitU, 2)}u`);
  console.log('\nSharp Vault hidden stars:');
  console.log(`  4★+ positions: ${vaultElite.n}   WR=${fmtPct(vaultElite.wr)}   $ROI=${fmtSignPct(vaultElite.dollarRoi)}   PnL=${fmtMoneyShort(vaultElite.pnl)}`);

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
