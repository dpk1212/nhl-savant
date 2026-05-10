/**
 * walletPredictivenessBacktest.js — counterfactual replay of Sharp Intel
 * lock decisions under tier-weighted Δw rules informed by the Wallet
 * Feature Predictiveness study.
 *
 * Configs evaluated:
 *   v7_status_quo  — Δw = (CONF+FLAT)_for − (CONF+FLAT)_ag, lock if Σ ≥ 5
 *   A_drop_flat    — Δw = CONF_for − CONF_ag,             lock if Σ ≥ 5
 *   B_hc_weight    — Δw = (CONF+HC)_for − (CONF+HC)_ag,   lock if Σ ≥ 5
 *                    (HC = CONFIRMED wallet with sizeRatio ≥ 1.5×, double-counted)
 *   AB_combined    — drop FLAT + HC-weight CONFIRMED
 *   R1_pure_count  — lock if (CONF_for − CONF_ag) ≥ 2 (Δq ignored)
 *   R2_pure_hc     — lock if HC_for ≥ 1 ∧ HC_ag = 0  (Δq ignored)
 *   R3_replace     — lock if R1 OR R2                (Δq ignored)
 *
 * Two lenses applied to handle lookahead bias:
 *   L1 — today's whitelistTier (upper bound)
 *   L2 — point-in-time whitelistTier (the honest one)
 *
 * Output: WALLET_PREDICTIVENESS_BACKTEST.md
 *
 * Usage:
 *   node scripts/walletPredictivenessBacktest.js
 *   node scripts/walletPredictivenessBacktest.js --console-only
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

const argv = new Set(process.argv.slice(2));
const CONSOLE_ONLY = argv.has('--console-only');

// ── Constants ──────────────────────────────────────────────────────
const V6_CUTOVER  = '2026-04-18';
const QUALITY_CUT = 30;
const HC_RATIO    = 1.5;     // sizeRatio threshold for "HIGH-CONVICTION"
const MIN_BETS    = 2;       // matches WHITELIST_MIN_BETS in exportWalletProfiles

const PICK_COLS = [
  ['sharpFlowPicks',   'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals',  'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

// ── Tiny helpers ───────────────────────────────────────────────────
const sign  = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`);
const fmtSignPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${sign(v, d)}%`);
const americanToDecimal = (odds) => odds === 0 ? 1.91 : (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));

// ── Load profiles → walletKey → bySport → whitelistTier ────────────
async function loadProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  snap.forEach(doc => profiles.set(doc.id, doc.data()));
  return profiles;
}

// Look up a wallet's tier in a sport from the (current-state) profiles map.
// walletDetails store wallet as slice(-6), profiles are keyed by walletShort
// which is also slice(-6) for Source-A-derived wallets. For Source-B-only
// wallets the profile is keyed by slice(0,6) and our walletDetails lookup
// will simply miss → tier = null (NULL bucket), which is the right answer
// (an unknown wallet should not count toward Δw).
function tierTodayFor(walletKey, sport, profiles) {
  const p = profiles.get(walletKey);
  if (!p) return null;
  const rec = p.bySport?.[sport];
  return rec?.whitelistTier || null;
}

// ── Load every graded side since cutover ───────────────────────────
async function loadGradedSides() {
  const sides = [];
  for (const [col, market] of PICK_COLS) {
    const snap = await db.collection(col).where('date', '>=', V6_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sport = d.sport || 'UNK';
      const date  = d.date;
      const sidesMap = d.sides || {};
      for (const [sideKey, side] of Object.entries(sidesMap)) {
        const oc = side?.result?.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS' && oc !== 'PUSH') continue;

        const peak = side.peak || side.lock || {};
        const peakStars = peak?.stars ?? 0;
        const peakUnits = peak?.units || 1;
        const odds = side?.lock?.lockOdds ?? side?.peak?.peakOdds
                  ?? side?.lock?.odds     ?? side?.peak?.odds ?? null;

        const superseded   = !!side.superseded;
        const lockStage    = side.lockStage || null;
        const healthStatus = side.health?.status || null;

        // Match dailyV6Report's dashboard inclusion rule
        const cancelled = superseded
                       || healthStatus === 'CANCELLED'
                       || healthStatus === 'MUTED'
                       || lockStage === 'SHADOW';
        const inDashboard = !cancelled && peakStars >= 2.5;

        const dwFrozen = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
        const dqFrozen = (side.v8_walletConsensusQualityMargin != null) ? Number(side.v8_walletConsensusQualityMargin) : null;
        const wd = peak?.v8Scoring?.walletDetails;

        // Outcomes
        let profitU = 0;
        if (oc === 'WIN')  profitU = (side.result?.profit || 0);
        else if (oc === 'LOSS') profitU = -peakUnits;

        const flatProfit = (() => {
          if (oc === 'PUSH') return 0;
          if (oc === 'WIN') {
            if (odds == null) return 0.91;
            return odds > 0 ? odds / 100 : 100 / Math.abs(odds);
          }
          return -1;
        })();

        sides.push({
          docId: doc.id, market,
          date, sport, sideKey,
          superseded, lockStage, healthStatus, cancelled, inDashboard,
          peakStars, peakUnits, odds,
          dwFrozen, dqFrozen,
          walletDetails: Array.isArray(wd) ? wd : [],
          outcome: oc, profitU, flatProfit,
        });
      }
    }
  }
  return sides;
}

// ── Build point-in-time tier qualification timeline ────────────────
//
// For each (wallet × sport), accumulate Source A (walletDetails) +
// Source B (sharp_action_positions) bets chronologically and record
// the first date the wallet would have qualified for each tier.
//
// Source A contributes: pickRoiSum (flat 1u replay), pickN, pickWins
// Source B contributes: posInvested, posPnl, posN
async function buildTierTimeline(sides) {
  // Source A — derive from each side's walletDetails. We need to know
  // which side WON to credit each wallet's bet correctly.
  const aBets = [];   // { date, sport, wallet, won (0/1), odds }
  const winningSideByDoc = new Map();
  // Group sides by docId
  const sidesByDoc = new Map();
  for (const s of sides) {
    if (!sidesByDoc.has(s.docId)) sidesByDoc.set(s.docId, []);
    sidesByDoc.get(s.docId).push(s);
  }
  for (const [docId, ss] of sidesByDoc) {
    let winningSide = null;
    for (const s of ss) {
      if (s.outcome === 'WIN')  { winningSide = s.sideKey; break; }
      if (s.outcome === 'LOSS' && OPPOSITE[s.sideKey]) { winningSide = OPPOSITE[s.sideKey]; break; }
    }
    if (!winningSide) continue;
    winningSideByDoc.set(docId, winningSide);

    const seen = new Set();
    for (const s of ss) {
      const peakOddsBySide = new Map();
      for (const t of ss) peakOddsBySide.set(t.sideKey, t.odds);
      for (const w of s.walletDetails) {
        if (!w.wallet || !w.side) continue;
        const dedupe = `${docId}_${w.wallet}`;
        if (seen.has(dedupe)) continue;
        seen.add(dedupe);
        const betOdds = peakOddsBySide.get(w.side) ?? s.odds ?? 0;
        const won = w.side === winningSide ? 1 : 0;
        aBets.push({
          date: s.date,
          sport: s.sport,
          wallet: w.wallet,
          won,
          odds: betOdds,
        });
      }
    }
  }

  // Source B — graded sharp_action_positions
  const bSnap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const bBets = [];
  bSnap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    if (invested <= 0) return;
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    bBets.push({
      date: d.date,
      sport: d.sport,
      walletShort,
      invested,
      settledPnl,
    });
  });

  // Sort all events chronologically
  aBets.sort((x, y) => (x.date || '').localeCompare(y.date || ''));
  bBets.sort((x, y) => (x.date || '').localeCompare(y.date || ''));

  // Per (walletKey × sport) running stats
  // We track A and B keyed by their respective wallet identifiers;
  // when checking a pick contributor, we need to match BOTH on the
  // walletDetails.wallet form. Since exportWalletProfiles unions both
  // forms into a single profiles dict, we follow the same convention:
  // each "wallet identifier" here is whatever string was used at write time.
  //
  // For Source A wallets (the ones contributing to picks): wallet form
  // is walletDetails.wallet (slice(-6) of the full address per SharpFlow).
  // For Source B-only wallets: walletShort (slice(0,6)).
  // The two forms can refer to the SAME underlying address, but for the
  // purpose of "did this wallet's CONFIRMED qualification depend on
  // dollar-ROI in Source B?" we need to bridge them.
  //
  // Bridge: profiles include `walletAddress` (the full address from
  // latestPos). We build a map wallet-key (any form) → fullAddress, then
  // identify each (walletShort, walletDetails.wallet) pair that share a
  // full address.

  const profiles = await loadProfiles();
  const walletKeyToFull = new Map();   // either form → full address
  for (const [key, p] of profiles) {
    const full = p.walletAddress || null;
    if (full) {
      walletKeyToFull.set(key, full);
      // Also map slice(-6) and slice(0,6) of the full address to the
      // same canonical full → that lets us bridge A↔B even when the
      // profile is keyed by only one form.
      walletKeyToFull.set(full.slice(-6), full);
      walletKeyToFull.set(full.slice(0, 6), full);
    } else {
      walletKeyToFull.set(key, key);   // self-canonical
    }
  }

  // Accumulators keyed by canonical address × sport
  const stat = new Map(); // canonical|sport → { aN, aWins, aFlatPnl, bN, bInvested, bPnl, firstWR50, firstFlat, firstConfirmed }
  function getStat(canonical, sport) {
    const k = `${canonical}|${sport}`;
    let s = stat.get(k);
    if (!s) {
      s = {
        aN: 0, aWins: 0, aFlatPnl: 0,
        bN: 0, bInvested: 0, bPnl: 0,
        firstWR50: null, firstFlat: null, firstConfirmed: null,
      };
      stat.set(k, s);
    }
    return s;
  }

  function flatProfitOf(odds, won) {
    const dec = americanToDecimal(odds);
    return won ? (dec - 1) : -1;
  }

  // Merge A + B events into a single chronological stream.
  // Each event updates the running stat then checks if any "first ever
  // qualified" date should be stamped. Tiers are monotone: once
  // CONFIRMED, always CONFIRMED (in practice we track `firstX` per
  // tier — point-in-time tier on date D = highest tier whose first-date ≤ D).
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

  for (const e of events) {
    if (!e.sport || !e.canonical) continue;
    const s = getStat(e.canonical, e.sport);
    if (e.source === 'A') {
      s.aN += 1;
      s.aWins += e.payload.won;
      s.aFlatPnl += flatProfitOf(e.payload.odds, e.payload.won);
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

  // Build tierAsOf(canonical, sport, date) → 'CONFIRMED' | 'FLAT' | 'WR50' | null
  function tierAsOf(canonical, sport, date) {
    const k = `${canonical}|${sport}`;
    const s = stat.get(k);
    if (!s) return null;
    if (s.firstConfirmed && s.firstConfirmed <= date) return 'CONFIRMED';
    if (s.firstFlat      && s.firstFlat      <= date) return 'FLAT';
    if (s.firstWR50      && s.firstWR50      <= date) return 'WR50';
    return null;
  }

  return { profiles, walletKeyToFull, stat, tierAsOf, eventsCount: events.length };
}

// ── Score a pick under each config ─────────────────────────────────
function scorePickUnderConfig({ walletDetails, sideKey, sport, date, lensFn, profiles }) {
  // lensFn(walletKey, sport, date) → 'CONFIRMED' | 'FLAT' | 'WR50' | null
  let confFor = 0, confAg = 0;
  let flatFor = 0, flatAg = 0;
  let hcConfFor = 0, hcConfAg = 0;
  let qFor = 0, qAg = 0;
  for (const w of walletDetails) {
    if (!w.wallet || !w.side) continue;
    const isFor = w.side === sideKey;
    const tier = lensFn(w.wallet, sport, date);
    const sizeRatio = Number(w.sizeRatio ?? 0);
    const hc = sizeRatio >= HC_RATIO;
    if (tier === 'CONFIRMED') {
      if (isFor) { confFor++; if (hc) hcConfFor++; }
      else       { confAg++;  if (hc) hcConfAg++;  }
    } else if (tier === 'FLAT') {
      if (isFor) flatFor++; else flatAg++;
    }
    // Δq stays as-is — based on contribution ≥ T30, side-only
    if ((Number(w.contribution) || 0) >= QUALITY_CUT) {
      if (isFor) qFor++; else qAg++;
    }
  }

  const dq        = qFor - qAg;
  const dwLegacy  = (confFor + flatFor) - (confAg + flatAg);
  const dwA       = confFor - confAg;
  const dwB       = (confFor + hcConfFor) - (confAg + hcConfAg);
  const dwAB      = (confFor + hcConfFor) - (confAg + hcConfAg);   // dropping FLAT, HC-weighted (same as dwB since FLAT excluded)

  // Lock decisions
  function locked(dw, dq, useMatrix = true) {
    if (!useMatrix) return null;     // caller should branch
    return dw >= 1 && dq >= 1 && (dw + dq) >= 5;
  }

  const decisions = {
    v7_status_quo: locked(dwLegacy, dq),
    A_drop_flat:   locked(dwA, dq),
    B_hc_weight:   locked(dwB, dq),
    AB_combined:   locked(dwAB, dq),
    R1_pure_count: (confFor - confAg) >= 2,
    R2_pure_hc:    hcConfFor >= 1 && hcConfAg === 0,
    R3_replace:    ((confFor - confAg) >= 2) || (hcConfFor >= 1 && hcConfAg === 0),
  };

  // Σ values for diagnostics
  const sigmas = {
    v7_status_quo: dwLegacy + dq,
    A_drop_flat:   dwA + dq,
    B_hc_weight:   dwB + dq,
    AB_combined:   dwAB + dq,
  };

  return {
    counts: { confFor, confAg, flatFor, flatAg, hcConfFor, hcConfAg, qFor, qAg },
    deltas: { dq, dwLegacy, dwA, dwB, dwAB },
    sigmas,
    decisions,
  };
}

// ── Aggregate metrics for a set of "shipped" sides ─────────────────
function aggMetrics(rows) {
  let n = 0, wins = 0, losses = 0, pushes = 0;
  let flatSum = 0, profitUSum = 0;
  for (const r of rows) {
    if (r.outcome === 'WIN')  { wins++;   flatSum += r.flatProfit; profitUSum += r.profitU; }
    else if (r.outcome === 'LOSS') { losses++; flatSum += r.flatProfit; profitUSum += r.profitU; }
    else if (r.outcome === 'PUSH') { pushes++; }
    n++;
  }
  const settled = n - pushes;
  return {
    n, wins, losses, pushes,
    wr: settled ? wins / settled * 100 : null,
    flatRoi: settled ? (flatSum / settled) * 100 : null,
    flatPnl: flatSum,
    peakUnitPnl: profitUSum,
  };
}

// ── Main ───────────────────────────────────────────────────────────
(async () => {
  console.log('[1/4] Loading graded sides…');
  const sides = await loadGradedSides();
  console.log(`      ${sides.length} graded sides since ${V6_CUTOVER}`);

  console.log('[2/4] Building tier timeline (Source A + B chronological)…');
  const { profiles, walletKeyToFull, stat, tierAsOf, eventsCount } = await buildTierTimeline(sides);
  console.log(`      ${profiles.size} profiles, ${eventsCount} chronological events, ${stat.size} (wallet × sport) trajectories`);

  console.log('[3/4] Scoring every pick under each config × lens…');

  const lensToday = (walletKey, sport /*, date*/) => {
    // canonicalize the walletDetails.wallet form to the profiles' canonical
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    // Try direct profile lookup first by canonical, then by either short form
    let p = profiles.get(canonical);
    if (!p) p = profiles.get(walletKey);
    if (!p && canonical && canonical.length >= 6) {
      p = profiles.get(canonical.slice(-6)) || profiles.get(canonical.slice(0, 6));
    }
    if (!p) return null;
    return p.bySport?.[sport]?.whitelistTier || null;
  };

  const lensPIT = (walletKey, sport, date) => {
    const canonical = walletKeyToFull.get(walletKey) || walletKey;
    return tierAsOf(canonical, sport, date);
  };

  const CONFIGS = ['v7_status_quo', 'A_drop_flat', 'B_hc_weight', 'AB_combined', 'R1_pure_count', 'R2_pure_hc', 'R3_replace'];
  const LENSES  = [['L1', lensToday], ['L2', lensPIT]];

  // For each side, compute lock decisions under (lens × config)
  // and stash the original "shipped" status.
  const decoratedSides = sides.map(s => {
    const dec = {};
    const counts = {};
    const deltas = {};
    for (const [lensId, lensFn] of LENSES) {
      const r = scorePickUnderConfig({
        walletDetails: s.walletDetails, sideKey: s.sideKey,
        sport: s.sport, date: s.date, lensFn, profiles,
      });
      dec[lensId] = r.decisions;
      counts[lensId] = r.counts;
      deltas[lensId] = r.deltas;
    }
    // "Shipped" under v7 = inDashboard = not cancelled AND peakStars ≥ 2.5
    return {
      ...s,
      decisions: dec,
      counts,
      deltas,
    };
  });

  // ── Aggregate per (lens × config) ───────────────────────────────
  function shippedUnder(lensId, cfg, sides) {
    return sides.filter(s => {
      // Health gates always apply (we don't backtest cancellations / mute rules)
      if (s.cancelled) return false;
      if (cfg === 'v7_status_quo') return s.inDashboard;
      return !!s.decisions[lensId][cfg];
    });
  }

  // ── Confusion matrix vs status quo (per lens × config) ──────────
  function confusionVs(lensId, cfg, sides) {
    const buckets = {
      preserved:   [],   // SHIPPED in both
      avoided:     [],   // SHIPPED in v7, NOT in cfg → we'd dodge
      promoted:    [],   // NOT SHIPPED in v7, SHIPPED in cfg → we'd find
      stillExcluded: [], // NOT SHIPPED in either
    };
    for (const s of sides) {
      if (s.cancelled) continue;     // mute/cancel/superseded is out of scope
      const sq = s.inDashboard;
      const nx = !!s.decisions[lensId][cfg];
      if (sq && nx) buckets.preserved.push(s);
      else if (sq && !nx) buckets.avoided.push(s);
      else if (!sq && nx) buckets.promoted.push(s);
      else buckets.stillExcluded.push(s);
    }
    return buckets;
  }

  // ── Build report ────────────────────────────────────────────────
  const out = [];
  out.push('# WALLET PREDICTIVENESS BACKTEST');
  out.push('');
  out.push(`Generated: **${new Date().toISOString()}** · sample window starts ${V6_CUTOVER}`);
  out.push('');
  out.push('Counterfactual replay of every Sharp Intel lock decision since the v6 cutover under seven Δw rules informed by `WALLET_FEATURE_PREDICTIVENESS.md`. Each rule is evaluated under two lenses to control for lookahead bias.');
  out.push('');

  // §1 Sample inventory
  out.push('---');
  out.push('## §1. Sample inventory');
  out.push('');
  const totalSides = sides.length;
  const inDash = sides.filter(s => s.inDashboard).length;
  const cancelled = sides.filter(s => s.cancelled).length;
  out.push('| Bucket | N |');
  out.push('|---|---|');
  out.push(`| Total graded sides | ${totalSides} |`);
  out.push(`| Shipped under v7 (inDashboard) | ${inDash} |`);
  out.push(`| Cancelled / muted / superseded / shadow | ${cancelled} |`);
  out.push(`| Sports | ${[...new Set(sides.map(s => s.sport))].sort().join(' · ')} |`);
  out.push(`| Markets | ${[...new Set(sides.map(s => s.market))].sort().join(' · ')} |`);
  const dateMin = sides.map(s => s.date).filter(Boolean).sort()[0];
  const dateMax = sides.map(s => s.date).filter(Boolean).sort().slice(-1)[0];
  out.push(`| Date range | ${dateMin} → ${dateMax} |`);
  out.push('');

  // §1b — status-quo baseline
  out.push('### §1.1 Status-quo (v7) baseline');
  out.push('');
  const baseShipped = shippedUnder('L2', 'v7_status_quo', decoratedSides);
  const baseAgg = aggMetrics(baseShipped);
  out.push('| Metric | Value |');
  out.push('|---|---|');
  out.push(`| Shipped picks (LOCKED, peakStars ≥ 2.5) | ${baseAgg.n} |`);
  out.push(`| Win rate | ${fmtPct(baseAgg.wr)} (${baseAgg.wins}-${baseAgg.losses}-${baseAgg.pushes}) |`);
  out.push(`| Flat 1u ROI | ${fmtSignPct(baseAgg.flatRoi)} (${sign(baseAgg.flatPnl, 2)}u total) |`);
  out.push(`| Peak-unit PnL | ${sign(baseAgg.peakUnitPnl, 2)}u |`);
  out.push('');

  // Per-sport baseline
  out.push('### §1.2 Status-quo per sport');
  out.push('');
  out.push('| Sport | N | WR | Flat ROI | Peak-u PnL |');
  out.push('|---|---|---|---|---|');
  const sports = [...new Set(sides.map(s => s.sport))].sort();
  for (const sport of sports) {
    const rows = baseShipped.filter(s => s.sport === sport);
    const a = aggMetrics(rows);
    out.push(`| ${sport} | ${a.n} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${sign(a.peakUnitPnl, 2)}u |`);
  }
  out.push('');

  // §2 Per-config aggregate × lens
  out.push('---');
  out.push('## §2. Per-config aggregate (both lenses)');
  out.push('');
  out.push('"Shipped" = the set of sides this config would have allowed onto the dashboard (after the same health gates v7 applies). Status-quo row is identical across lenses.');
  out.push('');
  for (const lensId of ['L1', 'L2']) {
    const lensLabel = lensId === 'L1' ? 'L1 — today\'s tiers (upper bound)' : 'L2 — point-in-time tiers (the honest one)';
    out.push(`### ${lensLabel}`);
    out.push('');
    out.push('| Config | Shipped N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Peak-u PnL | Volume change |');
    out.push('|---|---|---|---|---|---|---|---|');
    const baseAggLens = aggMetrics(shippedUnder(lensId, 'v7_status_quo', decoratedSides));
    for (const cfg of CONFIGS) {
      const ship = shippedUnder(lensId, cfg, decoratedSides);
      const a = aggMetrics(ship);
      const dWR = (a.wr != null && baseAggLens.wr != null) ? a.wr - baseAggLens.wr : null;
      const dROI = (a.flatRoi != null && baseAggLens.flatRoi != null) ? a.flatRoi - baseAggLens.flatRoi : null;
      const volChg = baseAggLens.n ? ((a.n - baseAggLens.n) / baseAggLens.n) * 100 : null;
      out.push(`| \`${cfg}\` | ${a.n} | ${fmtPct(a.wr)} | ${fmtSignPct(dWR)} | ${fmtSignPct(a.flatRoi)} | ${fmtSignPct(dROI)} | ${sign(a.peakUnitPnl, 2)}u | ${fmtSignPct(volChg)} |`);
    }
    out.push('');
  }

  // §2.3 Per-sport (L2 only — the trustworthy lens)
  out.push('### §2.3 Per-sport breakdown (L2 only — the trustworthy lens)');
  out.push('');
  for (const cfg of CONFIGS) {
    if (cfg === 'v7_status_quo') continue;
    out.push(`#### \`${cfg}\``);
    out.push('');
    out.push('| Sport | N | WR | ΔWR vs v7 | Flat ROI | ΔROI vs v7 | Vol Δ |');
    out.push('|---|---|---|---|---|---|---|');
    for (const sport of sports) {
      const sqRows = shippedUnder('L2', 'v7_status_quo', decoratedSides).filter(s => s.sport === sport);
      const cfgRows = shippedUnder('L2', cfg, decoratedSides).filter(s => s.sport === sport);
      const sq = aggMetrics(sqRows);
      const a  = aggMetrics(cfgRows);
      const dWR  = (a.wr != null && sq.wr != null) ? a.wr - sq.wr : null;
      const dROI = (a.flatRoi != null && sq.flatRoi != null) ? a.flatRoi - sq.flatRoi : null;
      const volChg = sq.n ? ((a.n - sq.n) / sq.n) * 100 : null;
      out.push(`| ${sport} | ${a.n} | ${fmtPct(a.wr)} | ${fmtSignPct(dWR)} | ${fmtSignPct(a.flatRoi)} | ${fmtSignPct(dROI)} | ${fmtSignPct(volChg)} |`);
    }
    out.push('');
  }

  // §3 Confusion matrices (L2)
  out.push('---');
  out.push('## §3. Confusion matrices vs v7 status quo (L2)');
  out.push('');
  out.push('"AVOIDED" = picks v7 shipped that this config would have killed. Low WR here = real losers we\'d dodge. "PROMOTED" = picks v7 didn\'t ship that this config would. High WR here = hidden winners we\'d find.');
  out.push('');
  for (const cfg of CONFIGS) {
    if (cfg === 'v7_status_quo') continue;
    const buckets = confusionVs('L2', cfg, decoratedSides);
    const ag = (b) => aggMetrics(b);
    const pres = ag(buckets.preserved);
    const avd  = ag(buckets.avoided);
    const prm  = ag(buckets.promoted);
    out.push(`### \`${cfg}\``);
    out.push('');
    out.push('| Transition | N | WR | Flat ROI | Net flat |');
    out.push('|---|---|---|---|---|');
    out.push(`| PRESERVED (shipped in both) | ${pres.n} | ${fmtPct(pres.wr)} | ${fmtSignPct(pres.flatRoi)} | ${sign(pres.flatPnl, 2)}u |`);
    out.push(`| AVOIDED (shipped in v7 only) | ${avd.n} | ${fmtPct(avd.wr)} | ${fmtSignPct(avd.flatRoi)} | ${sign(avd.flatPnl, 2)}u |`);
    out.push(`| PROMOTED (shipped in cfg only) | ${prm.n} | ${fmtPct(prm.wr)} | ${fmtSignPct(prm.flatRoi)} | ${sign(prm.flatPnl, 2)}u |`);
    out.push('');
  }

  // §4 Pick-level diff for the most consequential transitions
  out.push('---');
  out.push('## §4. Pick-level diff — biggest L2 transitions');
  out.push('');

  // Pick the most actionable two configs to surface diffs for: AB and R3
  for (const cfg of ['AB_combined', 'R3_replace']) {
    out.push(`### \`${cfg}\` — AVOIDED picks (v7 shipped, cfg would kill)`);
    out.push('');
    const av = confusionVs('L2', cfg, decoratedSides).avoided
      .sort((a, b) => (a.outcome === 'LOSS' ? -1 : 1) - (b.outcome === 'LOSS' ? -1 : 1));
    out.push('| Date | Sport | Mkt | Pick | Outcome | Profit | v7 Δw/Δq | cfg Δw |');
    out.push('|---|---|---|---|---|---|---|---|');
    for (const s of av.slice(0, 25)) {
      const ld = s.deltas.L2;
      const dwCfg = cfg === 'AB_combined' ? ld.dwAB : (s.counts.L2.confFor - s.counts.L2.confAg);
      out.push(`| ${s.date} | ${s.sport} | ${s.market} | \`${s.docId}\` ${s.sideKey} | ${s.outcome} | ${sign(s.profitU, 2)}u | ${sign(ld.dwLegacy, 0)}/${sign(ld.dq, 0)} | ${sign(dwCfg, 0)} |`);
    }
    out.push('');
    out.push(`### \`${cfg}\` — PROMOTED picks (cfg ships, v7 didn't)`);
    out.push('');
    const pr = confusionVs('L2', cfg, decoratedSides).promoted
      .sort((a, b) => (b.outcome === 'WIN' ? 1 : 0) - (a.outcome === 'WIN' ? 1 : 0));
    out.push('| Date | Sport | Mkt | Pick | Outcome | Flat | v7 Δw/Δq | cfg Δw |');
    out.push('|---|---|---|---|---|---|---|---|');
    for (const s of pr.slice(0, 25)) {
      const ld = s.deltas.L2;
      const dwCfg = cfg === 'AB_combined' ? ld.dwAB : (s.counts.L2.confFor - s.counts.L2.confAg);
      out.push(`| ${s.date} | ${s.sport} | ${s.market} | \`${s.docId}\` ${s.sideKey} | ${s.outcome} | ${sign(s.flatProfit, 2)} | ${sign(ld.dwLegacy, 0)}/${sign(ld.dq, 0)} | ${sign(dwCfg, 0)} |`);
    }
    out.push('');
  }

  // §5 REPLACE-arm threshold sweep
  out.push('---');
  out.push('## §5. REPLACE-arm threshold sweep (L2)');
  out.push('');
  out.push('Sweeps the pure-tier-count rule across thresholds to find the WR / volume sweet spot.');
  out.push('');
  out.push('| Rule | N | WR | Flat ROI | Vol vs v7 |');
  out.push('|---|---|---|---|---|');
  const baseAgg2 = aggMetrics(shippedUnder('L2', 'v7_status_quo', decoratedSides));
  for (const k of [1, 2, 3]) {
    const rows = decoratedSides.filter(s => {
      if (s.cancelled) return false;
      return (s.counts.L2.confFor - s.counts.L2.confAg) >= k;
    });
    const a = aggMetrics(rows);
    const vol = baseAgg2.n ? ((a.n - baseAgg2.n) / baseAgg2.n) * 100 : null;
    out.push(`| (CONF_for − CONF_ag) ≥ ${k} | ${a.n} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${fmtSignPct(vol)} |`);
  }
  for (const k of [1, 2]) {
    const rows = decoratedSides.filter(s => {
      if (s.cancelled) return false;
      return s.counts.L2.hcConfFor >= k && s.counts.L2.hcConfAg === 0;
    });
    const a = aggMetrics(rows);
    const vol = baseAgg2.n ? ((a.n - baseAgg2.n) / baseAgg2.n) * 100 : null;
    out.push(`| HC_for ≥ ${k} ∧ HC_ag = 0 | ${a.n} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${fmtSignPct(vol)} |`);
  }
  for (const k of [1, 2, 3]) {
    const rows = decoratedSides.filter(s => {
      if (s.cancelled) return false;
      return ((s.counts.L2.confFor - s.counts.L2.confAg) >= k) || (s.counts.L2.hcConfFor >= 1 && s.counts.L2.hcConfAg === 0);
    });
    const a = aggMetrics(rows);
    const vol = baseAgg2.n ? ((a.n - baseAgg2.n) / baseAgg2.n) * 100 : null;
    out.push(`| (CONF_for − CONF_ag) ≥ ${k}  OR  (HC_for ≥ 1 ∧ HC_ag=0) | ${a.n} | ${fmtPct(a.wr)} | ${fmtSignPct(a.flatRoi)} | ${fmtSignPct(vol)} |`);
  }
  out.push('');

  // §6 Bias diagnostic
  out.push('---');
  out.push('## §6. Bias diagnostic — L1 vs L2 tier-mismatch');
  out.push('');
  out.push('For each pick we count how many contributors had a different tier on the pick date than they do today. If this is small, L1 ≈ L2 and we can trust either lens.');
  out.push('');
  let totalContribs = 0;
  let sameTier = 0;
  let l1HigherTier = 0;   // today the wallet looks better (lookahead bias risk)
  let l1LowerTier  = 0;   // today the wallet looks worse (decay)
  const tierRank = { CONFIRMED: 3, FLAT: 2, WR50: 1, null: 0 };
  for (const s of decoratedSides) {
    for (const w of s.walletDetails) {
      if (!w.wallet || !w.side) continue;
      const t1 = lensToday(w.wallet, s.sport, s.date) || null;
      const t2 = lensPIT(w.wallet, s.sport, s.date)   || null;
      totalContribs++;
      const r1 = tierRank[t1] ?? 0;
      const r2 = tierRank[t2] ?? 0;
      if (r1 === r2) sameTier++;
      else if (r1 > r2) l1HigherTier++;
      else l1LowerTier++;
    }
  }
  out.push('| Bucket | N contributors | % |');
  out.push('|---|---|---|');
  out.push(`| Same tier under L1 and L2 | ${sameTier} | ${fmtPct(100 * sameTier / Math.max(totalContribs, 1))} |`);
  out.push(`| L1 > L2 (today's tier higher → lookahead bias upward) | ${l1HigherTier} | ${fmtPct(100 * l1HigherTier / Math.max(totalContribs, 1))} |`);
  out.push(`| L1 < L2 (wallet decayed since the pick) | ${l1LowerTier} | ${fmtPct(100 * l1LowerTier / Math.max(totalContribs, 1))} |`);
  out.push('');
  out.push(`Total contributor rows: ${totalContribs}.`);
  out.push('');

  // §7 Pre-registered decision applied
  out.push('---');
  out.push('## §7. Decision applied (pre-registered rule)');
  out.push('');

  function applyDecision(cfg, lensId = 'L2') {
    const buckets = confusionVs(lensId, cfg, decoratedSides);
    const sq = aggMetrics(shippedUnder(lensId, 'v7_status_quo', decoratedSides));
    const cfgShipped = shippedUnder(lensId, cfg, decoratedSides);
    const a = aggMetrics(cfgShipped);
    const avd = aggMetrics(buckets.avoided);
    const prm = aggMetrics(buckets.promoted);
    const dWR = (a.wr != null && sq.wr != null) ? a.wr - sq.wr : null;
    const dROI = (a.flatRoi != null && sq.flatRoi != null) ? a.flatRoi - sq.flatRoi : null;
    const volChg = sq.n ? ((a.n - sq.n) / sq.n) * 100 : null;

    // Per-sport WR delta sign
    let positiveSports = 0;
    let evaluatedSports = 0;
    for (const sport of sports) {
      const sqS = aggMetrics(shippedUnder(lensId, 'v7_status_quo', decoratedSides).filter(s => s.sport === sport));
      const aS  = aggMetrics(cfgShipped.filter(s => s.sport === sport));
      if (sqS.wr == null || aS.wr == null) continue;
      evaluatedSports++;
      if (aS.wr - sqS.wr >= 0) positiveSports++;
    }

    let arm, gates;
    if (cfg === 'A_drop_flat' || cfg === 'AB_combined') {
      arm = 'TIGHTEN';
      gates = [
        ['AVOIDED bucket WR ≤ 45%', avd.wr != null && avd.wr <= 45, `${fmtPct(avd.wr)}`],
        ['Net WR delta ≥ +2pp', dWR != null && dWR >= 2, `${fmtSignPct(dWR)}`],
        ['Volume drop ≤ 30%', volChg != null && volChg >= -30, `${fmtSignPct(volChg)}`],
      ];
    } else if (cfg === 'B_hc_weight') {
      arm = 'LOOSEN';
      gates = [
        ['PROMOTED bucket WR ≥ 56%', prm.wr != null && prm.wr >= 56, prm.n > 0 ? `${fmtPct(prm.wr)}` : 'no promoted picks'],
        ['Net WR delta ≥ +1.5pp', dWR != null && dWR >= 1.5, `${fmtSignPct(dWR)}`],
      ];
    } else if (cfg.startsWith('R')) {
      arm = 'REPLACE';
      gates = [
        ['LOCKED WR ≥ 55%', a.wr != null && a.wr >= 55, `${fmtPct(a.wr)}`],
        ['Flat ROI ≥ +5%', a.flatRoi != null && a.flatRoi >= 5, `${fmtSignPct(a.flatRoi)}`],
        ['Volume within ±50% of v7', volChg != null && Math.abs(volChg) <= 50, `${fmtSignPct(volChg)}`],
        ['Holds in ≥ 2 of 3 sports', positiveSports >= 2, `${positiveSports}/${evaluatedSports} sports`],
      ];
    } else {
      arm = 'BASELINE';
      gates = [];
    }
    const passed = gates.length > 0 && gates.every(g => g[1]);
    return { arm, gates, passed };
  }

  out.push('| Config | Arm | Verdict | Gates |');
  out.push('|---|---|---|---|');
  for (const cfg of CONFIGS) {
    if (cfg === 'v7_status_quo') continue;
    const { arm, gates, passed } = applyDecision(cfg);
    const verdict = passed ? '**SHIP**' : 'KILL';
    const gateStr = gates.map(g => `${g[1] ? '✅' : '❌'} ${g[0]}: ${g[2]}`).join('<br/>');
    out.push(`| \`${cfg}\` | ${arm} | ${verdict} | ${gateStr} |`);
  }
  out.push('');
  out.push('Verdict computed against L2 (point-in-time) lens.');
  out.push('');

  out.push('---');
  out.push('## §8. Notes & caveats');
  out.push('');
  out.push('- Sample window since v6 cutover. WR / ROI confidence bands at this sample size are wide (±5–7pp at N=80–100); treat marginal verdicts with appropriate skepticism.');
  out.push('- Δq calculation is unchanged from v7 — based on contribution ≥ T30 cut. Only Δw inputs mutate across configs (or are ignored entirely in REPLACE).');
  out.push('- Health gates (CANCELLED, MUTED, superseded, SHADOW) always apply. We are backtesting promotion/lock decisions, not the mute engine.');
  out.push('- "Today\'s tiers" lens uses the current `sharpWalletProfiles` snapshot. "Point-in-time" lens replays Source A + B chronologically and stamps `firstFlatDate`, `firstConfirmedDate`, `firstWR50Date` per (wallet × sport).');
  out.push('- HC threshold = `sizeRatio ≥ 1.5×` (= `betMultiplier ≥ 1.5`). HC-CONFIRMED contributes 2 to Δw (counted as both CONFIRMED and HC).');
  out.push('');

  const md = out.join('\n');

  if (CONSOLE_ONLY) {
    console.log(md);
  } else {
    const outPath = join(REPO_ROOT, 'WALLET_PREDICTIVENESS_BACKTEST.md');
    writeFileSync(outPath, md);
    console.log(`[4/4] Wrote ${outPath}`);
  }

  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
