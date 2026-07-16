/**
 * exportWalletProfiles.js — build a full roster of every sharp wallet
 * we have data on, in a Firebase-ready shape.
 *
 * Inputs:
 *   - sharpFlow{Picks,Spreads,Totals} → v8Scoring.walletDetails[]   (Source A)
 *   - sharp_action_positions                                         (Source B)
 *
 * Outputs:
 *   - data/wallet-profiles.json  — full JSON keyed by walletShort, ready
 *     to upsert into a Firestore collection `sharpWalletProfiles`.
 *   - WALLET_ROSTER.md           — human-readable table of every wallet.
 *   - WALLET_PROFILES_SUMMARY.md — per-sport tier counts + churn vs prior run.
 *
 * Firebase sync (opt-in):
 *   --write-firebase      Upsert all profiles into collection
 *                         `sharpWalletProfiles` (default: skipped).
 *   --collection=xxx      Override target collection name.
 *
 * Usage:
 *   node scripts/exportWalletProfiles.js                    # JSON + MD only
 *   node scripts/exportWalletProfiles.js --write-firebase   # also push
 *
 * ─────────────────────────────────────────────────────────────────────
 * PROMOTION POLICY  (whitelistVersion: 2 — shipped 2026-05-10)
 * ─────────────────────────────────────────────────────────────────────
 * This script runs every 2h via .github/workflows/grade-sharp-actions.yml
 * (cron 0 3,5,7,9 * * * UTC). On every run it RE-CLASSIFIES ALL WALLETS
 * FROM SCRATCH using the gates below and upserts the result into the
 * `sharpWalletProfiles` collection that the live engine reads. The set
 * of qualifying wallets therefore evolves continuously — promotions and
 * demotions both happen automatically as bets settle.
 *
 * Per (wallet, sport), classifyWhitelistTier() resolves the tier as:
 *
 *   CONFIRMED — flat-positive (Source A OR B) AND $-positive (Source B)
 *   FLAT      — flat-positive (Source A OR B)
 *   WR50      — WR ≥ 50% (Source A OR B)
 *   null      — none of the above (wallet not whitelisted in this sport)
 *
 * Where:
 *   flatOkA   = picks.n      >= WHITELIST_MIN_BETS (2)  AND picks.flatRoi      > 0
 *   flatOkB   = positions.n  >= B_ONLY_MIN_BETS    (5)  AND positions.positionFlatRoi > 0
 *   dollarOk  = positions.n  >= WHITELIST_MIN_BETS (2)  AND positions.dollarRoi > 0
 *   wr50OkA   = picks.n      >= WHITELIST_MIN_BETS (2)  AND picks.wr      >= 50
 *   wr50OkB   = positions.n  >= B_ONLY_MIN_BETS    (5)  AND positions.wr  >= 50
 *
 * The Source-B-only paths (B_ONLY_MIN_BETS = 5) are NEW in v2. They let
 * us promote sharps who never appear on a featured pick (the historical
 * MLB/NHL coverage gap). The bar is intentionally higher (5 vs 2) since
 * these wallets have no independent featured-pick verification.
 *
 * Audit fields (v2):
 *   bySport[sport].whitelistSource    ∈ {'A', 'A+B', 'B', null}
 *   profile.whitelistSourceBySport    map of all sports → source
 *
 * Re-evaluation pinned for 2026-05-24 — see TWO_WEEK_REEVAL.md.
 * Roll-back path: set B_ONLY_MIN_BETS = Infinity (next cron reverts).
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = new Set(process.argv.slice(2));
const WRITE_FB = argv.has('--write-firebase');
const collectionArg = [...argv].find(a => a.startsWith('--collection='));
const TARGET_COLLECTION = collectionArg ? collectionArg.split('=')[1] : 'sharpWalletProfiles';

if (!admin.apps.length) {
  const sakPath = join(__dirname, '..', 'serviceAccountKey.json');
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
const V8_CUTOVER = '2026-04-18';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const OPPOSITE = { home: 'away', away: 'home', over: 'under', under: 'over' };

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
// Guard: 0 / null / NaN odds previously produced Infinity flat profit on won
// bets (100 / |0|), poisoning the whole-sport aggregate — 4 whitelisted
// wallets carried picks.flatRoi = Infinity, which rendered "+Infinity% ROI"
// on locked cards and auto-passed the flatRoi > 0 whitelist gate. A bet with
// no usable price contributes NO flat signal (null, excluded in picksAgg).
const flatProfit = (odds, won) => {
  if (!Number.isFinite(odds) || odds === 0) return null;
  return won ? americanToDecimal(odds) - 1 : -1;
};
const r2 = (v) => v == null ? null : Math.round(v * 100) / 100;
const r1 = (v) => v == null ? null : Math.round(v * 10) / 10;
const pct = (v) => v == null ? null : +(v * 100).toFixed(1);

// ── Load Source A (wallet-bets from walletDetails) ─────────────────
async function loadWalletBets() {
  const bets = [];
  for (const [col, market] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      const anyGraded = Object.values(sides).some(s => s.result?.outcome === 'WIN' || s.result?.outcome === 'LOSS');
      if (!anyGraded) continue;

      let winningSide = null;
      for (const sk of Object.keys(sides)) {
        const oc = sides[sk].result?.outcome;
        if (oc === 'WIN') { winningSide = sk; break; }
        if (oc === 'LOSS' && OPPOSITE[sk]) { winningSide = OPPOSITE[sk]; break; }
      }
      if (!winningSide) continue;

      const seen = new Map();
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails;
        if (!Array.isArray(wd)) continue;
        const oddsForThisSide = peak.odds ?? 0;
        for (const w of wd) {
          if (!w.wallet || !w.side) continue;
          if (seen.has(`${doc.id}_${w.wallet}`)) continue;
          seen.set(`${doc.id}_${w.wallet}`, true);
          const betOdds = sides[w.side]?.peak?.odds ?? sides[w.side]?.lock?.odds ?? oddsForThisSide;
          const won = w.side === winningSide ? 1 : 0;
          bets.push({
            gameKey: doc.id,
            date: d.date,
            sport: d.sport,
            market,
            wallet: w.wallet,
            side: w.side,
            odds: betOdds,
            invested: w.invested ?? 0,
            walletBase: w.walletBase ?? null,
            roiNorm: w.roiNorm ?? null,
            rankNorm: w.rankNorm ?? null,
            pnlNorm: w.pnlNorm ?? null,
            rank: w.rank ?? null,
            lifetimeRoi: w.roi ?? null,
            lifetimePnl: w.pnl ?? null,
            contribution: w.contribution ?? null,
            sizeRatio: w.sizeRatio ?? null,
            convictionMult: w.convictionMult ?? null,
            won,
            flat: flatProfit(betOdds, won === 1),
          });
        }
      }
    }
  }
  return bets;
}

// ── Load Source B (positions) ──────────────────────────────────────
async function loadPositions() {
  const snap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const rows = [];
  snap.forEach(doc => {
    const d = doc.data();
    if (!d.wallet) return;
    const invested = Number(d.invested ?? d.size ?? 0);
    const settledPnl = Number(d.settledPnl ?? d.positionPnl ?? 0);
    if (invested <= 0) return;
    const walletShort = d.walletShort || String(d.wallet).slice(0, 6);
    // Vault/Shadow tier — treat missing field (pre-shadow docs) as VAULT.
    const vaultQualified = d.vaultQualified !== false;
    // Per-position unit return — Source-B equivalent of Source A's `flat`.
    // settledPnl is already (settledPrice - avgPrice) * sharesHeld, so dividing
    // by `invested` (= avgPrice * sharesHeld) gives the unit return at the
    // Polymarket entry price. Mean across positions = position-flat ROI.
    const flat = invested > 0 ? settledPnl / invested : 0;
    rows.push({
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      walletShort,
      walletAddress: d.wallet,
      tier: d.tier,
      invested,
      settledPnl,
      flat,
      avgPrice: d.avgPrice,
      won: settledPnl > 0 ? 1 : 0,
      sportROI: d.sportROI,
      sportPnlTotal: d.sportPnlTotal,
      sportVol: d.sportVol,
      leaderboardRank: d.leaderboardRank,
      sportsLbPercentileTop: d.sportsLbPercentileTop,
      vaultQualified,
      qualificationTier: d.qualificationTier || (vaultQualified ? 'VAULT' : 'SHADOW'),
      // CLV inputs for causal %+CLV skill (same contract as walletClvSkill.js).
      // IMPORTANT: Number(null) === 0 — never coerce null through Number().
      clv: (d.clv != null && Number.isFinite(Number(d.clv))) ? Number(d.clv) : null,
      closingPinnacleOdds: d.closingPinnacleOdds ?? null,
      entryPinnacleOdds: d.entryPinnacleOdds ?? d.pinnacleOdds ?? null,
      entryAvgPrice: d.entryAvgPrice ?? d.avgPrice ?? null,
    });
  });
  return rows;
}

/** Implied prob from American odds — mirrors src/lib/walletClvSkill.js */
function impliedProb(odds) {
  if (odds == null || odds === 0 || !Number.isFinite(Number(odds))) return null;
  const o = Number(odds);
  return o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
}

/** Position CLV in probability points — mirrors computePositionClv */
function computePositionClv(pos) {
  if (!pos || typeof pos !== 'object') return null;
  if (pos.clv != null && Number.isFinite(Number(pos.clv))) return Number(pos.clv);
  const closeProb = impliedProb(pos.closingPinnacleOdds);
  if (closeProb == null) return null;
  if (pos.entryPinnacleOdds != null && impliedProb(pos.entryPinnacleOdds) != null) {
    return (closeProb - impliedProb(pos.entryPinnacleOdds)) * 100;
  }
  const entryPm = pos.entryAvgPrice;
  if (entryPm != null && entryPm > 0.01 && entryPm < 0.99) {
    return (closeProb - entryPm) * 100;
  }
  return null;
}

/**
 * Causal %+CLV skill: % of graded positions with CLV > 0 since CLV_HIST_FROM,
 * requiring ≥ CLV_SKILL_MIN_N events. Same definition the tape/netCLV cron uses.
 */
const CLV_HIST_FROM = '2026-04-01';
const CLV_SKILL_MIN_N = 5;
function computeClvSkill(posBets) {
  const events = [];
  for (const b of posBets || []) {
    if (!b?.date || b.date < CLV_HIST_FROM) continue;
    const clv = computePositionClv(b);
    if (clv == null || !Number.isFinite(clv)) continue;
    events.push({ date: b.date, clv });
  }
  if (events.length < CLV_SKILL_MIN_N) {
    return { pctPos: null, n: events.length, since: CLV_HIST_FROM };
  }
  const nPos = events.filter((e) => e.clv > 0).length;
  return {
    pctPos: Math.round((100 * nPos) / events.length * 10) / 10,
    n: events.length,
    since: CLV_HIST_FROM,
  };
}

// ── Aggregation helpers ────────────────────────────────────────────
function picksAgg(bets) {
  const n = bets.length;
  const wins = bets.filter(b => b.won === 1).length;
  // Flat stats run over bets with a usable price only (flat is null when the
  // bet had no odds). Excluding them from BOTH numerator and denominator
  // keeps flatRoi an honest per-priced-bet mean instead of diluting toward 0.
  const flatBets = bets.filter(b => Number.isFinite(b.flat));
  const flatPnl = flatBets.reduce((s, b) => s + b.flat, 0);
  return {
    n, wins, losses: n - wins,
    wr: n ? +(wins / n * 100).toFixed(1) : 0,
    flatPnl: r2(flatPnl),
    flatRoi: flatBets.length ? +((flatPnl / flatBets.length) * 100).toFixed(1) : 0,
  };
}
function positionsAgg(bets) {
  const n = bets.length;
  const wins = bets.filter(b => b.won === 1).length;
  const invested = bets.reduce((s, b) => s + b.invested, 0);
  const pnl = bets.reduce((s, b) => s + b.settledPnl, 0);
  // Position-flat ROI: equally-weighted unit return per bet (Source-B mirror
  // of Source A's `flatRoi`). Each `b.flat` is settledPnl/invested for that
  // position, so the mean is what flat-betting one unit per Source-B bet
  // would have returned at Polymarket prices.
  const flatSum = bets.reduce((s, b) => s + (b.flat ?? 0), 0);
  const positionFlatRoi = n ? +((flatSum / n) * 100).toFixed(1) : null;
  return {
    n, wins, losses: n - wins,
    wr: n ? +(wins / n * 100).toFixed(1) : 0,
    invested: Math.round(invested),
    settledPnl: Math.round(pnl),
    dollarRoi: invested > 0 ? +((pnl / invested) * 100).toFixed(1) : null,
    positionFlatRoi,
  };
}
function median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// ── Verdict logic ──────────────────────────────────────────────────
function verdict(picks, positions) {
  const MIN = 3;
  const aPos = picks.n >= MIN && picks.flatRoi > 0;
  const aNeg = picks.n >= MIN && picks.flatRoi < 0;
  const bPos = positions.n >= MIN && positions.dollarRoi != null && positions.dollarRoi > 0;
  const bNeg = positions.n >= MIN && positions.dollarRoi != null && positions.dollarRoi < 0;
  if (aPos && bPos) return 'CONFIRMED_WINNER';
  if (aNeg && bNeg) return 'CONFIRMED_BLEEDER';
  if (aPos && bNeg) return 'MIXED_PICKS_GOOD_$_BAD';
  if (aNeg && bPos) return 'MIXED_PICKS_BAD_$_GOOD';
  if (aPos && !bPos && !bNeg) return 'PICKS_ONLY_POSITIVE';
  if (aNeg && !bPos && !bNeg) return 'PICKS_ONLY_NEGATIVE';
  if (bPos && !aPos && !aNeg) return 'POSITIONS_ONLY_POSITIVE';
  if (bNeg && !aPos && !aNeg) return 'POSITIONS_ONLY_NEGATIVE';
  return 'INCONCLUSIVE';
}

// ── Whitelist tier classification (see WALLET_WHITELIST_BACKTEST.md) ──
// For each sport a wallet has activity in, assign one of:
//   CONFIRMED — positive in BOTH a flat-equivalent ROI AND $ ROI
//   FLAT      — positive flat-equivalent ROI
//   WR50      — WR ≥ 50%
//   null      — none of the above OR below MIN_BETS in that sport
// Precedence: CONFIRMED > FLAT > WR50.
//
// v2 (2026-05-10) — Source-B-only promotion enabled (2-week trial).
// Previously, FLAT/CONFIRMED required the wallet to have appeared on a
// featured pick (Source A). Many active sharps in MLB/NHL never trigger
// our featured-pick lookup but are profitable on-chain — they were
// invisible to the engine. We now accept either source for the flat-ROI
// and WR signals, with a stricter min-bets gate (B_ONLY_MIN_BETS = 5)
// for Source-B-only paths since those wallets have no independent
// featured-pick verification. Re-evaluate: 2026-05-24 — see
// TWO_WEEK_REEVAL.md.
const WHITELIST_MIN_BETS    = 2;   // Source A min (unchanged from v1)
const B_ONLY_MIN_BETS       = 5;   // Source-B-only min (new in v2)
const WHITELIST_VERSION     = 2;

// Source-attribution helper. Returns 'A', 'B', or 'A+B' for audit/reporting.
// Used to populate `bySport[sport].whitelistSource` so the 2-week re-eval
// can isolate the lift attributable to the new Source-B-only path.
function classifyWhitelistTierWithSource(picksInSport, positionsInSport) {
  const p = picksInSport || { n: 0 };
  const q = positionsInSport || { n: 0 };

  // Source A (featured-pick) signals — original v1 gates. Finite-guard:
  // a poisoned Infinity flatRoi must never auto-pass the profitability gate.
  const flatOkA   = p.n >= WHITELIST_MIN_BETS && Number.isFinite(p.flatRoi ?? 0) && (p.flatRoi ?? 0) > 0;
  const wr50OkA   = p.n >= WHITELIST_MIN_BETS && (p.wr ?? 0) >= 50;
  // Source B (on-chain position) signals — flat-ROI uses positionFlatRoi
  // (Polymarket unit return), WR uses settledPnl > 0 win rate, dollar-ROI
  // is the existing $-weighted measure used for CONFIRMED.
  const flatOkB   = q.n >= B_ONLY_MIN_BETS && (q.positionFlatRoi ?? 0) > 0;
  const wr50OkB   = q.n >= B_ONLY_MIN_BETS && (q.wr ?? 0) >= 50;
  const dollarOk  = q.n >= WHITELIST_MIN_BETS && q.dollarRoi != null && q.dollarRoi > 0;

  // Tier resolution — CONFIRMED requires flat + dollar; flat can come from
  // either source. Source-B-only also requires dollarRoi > 0 to claim
  // CONFIRMED (so the bar stays "profitable two ways").
  let tier = null;
  if ((flatOkA || flatOkB) && dollarOk) tier = 'CONFIRMED';
  else if (flatOkA || flatOkB)          tier = 'FLAT';
  else if (wr50OkA || wr50OkB)          tier = 'WR50';

  // Source attribution for the active flat/WR signal driving the tier.
  let source = null;
  if (tier === 'CONFIRMED' || tier === 'FLAT') {
    if (flatOkA && flatOkB) source = 'A+B';
    else if (flatOkA)       source = 'A';
    else if (flatOkB)       source = 'B';
  } else if (tier === 'WR50') {
    if (wr50OkA && wr50OkB) source = 'A+B';
    else if (wr50OkA)       source = 'A';
    else if (wr50OkB)       source = 'B';
  }
  return { tier, source };
}

// Back-compat shim — callers that only need the tier string.
function classifyWhitelistTier(picksInSport, positionsInSport) {
  return classifyWhitelistTierWithSource(picksInSport, positionsInSport).tier;
}

// ── Build per-wallet profile ───────────────────────────────────────
function buildProfile(walletShort, pickBets, posBets) {
  const latestPick = pickBets.length ? pickBets.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0] : null;
  const latestPos = posBets.length ? posBets.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0] : null;

  const picks = picksAgg(pickBets);
  const positions = positionsAgg(posBets);

  // Sport + market breakdowns
  const bySport = {};
  for (const sport of new Set([...pickBets.map(b => b.sport), ...posBets.map(b => b.sport)].filter(Boolean))) {
    const pp = pickBets.filter(b => b.sport === sport);
    const ps = posBets.filter(b => b.sport === sport);
    const picksInSport = picksAgg(pp);
    const positionsInSport = positionsAgg(ps);
    const { tier, source } = classifyWhitelistTierWithSource(picksInSport, positionsInSport);
    bySport[sport] = {
      picks: picksInSport,
      positions: positionsInSport,
      isFlatProfitable:   picksInSport.n >= WHITELIST_MIN_BETS && picksInSport.flatRoi > 0,
      isDollarProfitable: positionsInSport.n >= WHITELIST_MIN_BETS
                          && positionsInSport.dollarRoi != null
                          && positionsInSport.dollarRoi > 0,
      isWR50:             picksInSport.n >= WHITELIST_MIN_BETS && picksInSport.wr >= 50,
      // NEW (v2): Source-B-only signals — used to attribute the promotion path.
      isPositionFlatProfitable: positionsInSport.n >= B_ONLY_MIN_BETS
                                && (positionsInSport.positionFlatRoi ?? 0) > 0,
      isWR50_B:                 positionsInSport.n >= B_ONLY_MIN_BETS
                                && (positionsInSport.wr ?? 0) >= 50,
      whitelistTier:      tier,
      whitelistSource:    source,   // 'A' | 'B' | 'A+B' | null  (v2)
    };
  }
  const byMarket = {};
  for (const market of new Set([...pickBets.map(b => b.market), ...posBets.map(b => b.market)].filter(Boolean))) {
    const pp = pickBets.filter(b => b.market === market);
    const ps = posBets.filter(b => b.market === market);
    byMarket[market] = {
      picks: picksAgg(pp),
      positions: positionsAgg(ps),
    };
  }

  // Size signal from positions (own-median buckets) — VAULT-ONLY.
  // Shadow positions are structurally small (0.10×–0.75× avg) so they would
  // skew the own-median bucketing downward and break the "when this wallet
  // sizes UP, do they win?" semantic. Shadow rows are tracked separately
  // below in `shadowSignal` for visibility.
  const vaultPosBets = posBets.filter(b => b.vaultQualified);
  const shadowPosBets = posBets.filter(b => !b.vaultQualified);

  let sizeSignal = null;
  if (vaultPosBets.length >= 3) {
    const med = median(vaultPosBets.map(b => b.invested));
    const buckets = { routine: [], above: [], wayAbove: [] };
    for (const b of vaultPosBets) {
      const ratio = med > 0 ? b.invested / med : 1;
      if (ratio >= 2) buckets.wayAbove.push(b);
      else if (ratio >= 1.25) buckets.above.push(b);
      else buckets.routine.push(b);
    }
    sizeSignal = {
      medianInvested: Math.round(med),
      routine: positionsAgg(buckets.routine),
      above: positionsAgg(buckets.above),
      wayAbove: positionsAgg(buckets.wayAbove),
    };
  }

  // Shadow signal — aggregate of small-sized (SHADOW) positions only. A
  // wallet with negative shadow PnL but positive vault PnL is exactly the
  // pattern we expect from a sharp ("they win when they're sure, chase when
  // they're not"), so keeping these separate lets us see that.
  const shadowSignal = shadowPosBets.length >= 1 ? {
    ...positionsAgg(shadowPosBets),
    medianInvested: shadowPosBets.length ? Math.round(median(shadowPosBets.map(b => b.invested))) : null,
  } : null;

  // Causal %+CLV skill — % of prior graded positions that beat the close.
  // Surfaced on live cards as "beats close X%" / BEATS THE CLOSE battle row.
  const clvSkill = computeClvSkill(posBets);

  // Date spans
  const allDates = [...pickBets, ...posBets].map(b => b.date).filter(Boolean).sort();
  const firstDate = allDates[0] || null;
  const lastDate = allDates[allDates.length - 1] || null;

  // Top-level whitelist convenience arrays — O(1) reads for UI/scoring.
  // `flatSports` includes everything FLAT-or-better (FLAT and CONFIRMED).
  // `confirmedSports` is the strict subset that's also dollar-profitable.
  // `topSport` is the sport with the best flat ROI (ties broken by N).
  const flatSports = [];
  const confirmedSports = [];
  const wr50Sports = [];
  // NEW (v2) — per-sport map of which source path drove the active tier.
  // { MLB: 'B', NBA: 'A+B', NHL: 'A' }. Lets us audit Source-B impact post-trial.
  const whitelistSourceBySport = {};
  let topSport = null;
  let topFlatRoi = -Infinity;
  let topN = 0;
  for (const [sport, rec] of Object.entries(bySport)) {
    if (rec.whitelistTier === 'CONFIRMED') {
      confirmedSports.push(sport);
      flatSports.push(sport);
    } else if (rec.whitelistTier === 'FLAT') {
      flatSports.push(sport);
    } else if (rec.whitelistTier === 'WR50') {
      wr50Sports.push(sport);
    }
    if (rec.whitelistSource) whitelistSourceBySport[sport] = rec.whitelistSource;
    if (rec.picks.n >= WHITELIST_MIN_BETS) {
      const roi = rec.picks.flatRoi;
      if (roi > topFlatRoi || (roi === topFlatRoi && rec.picks.n > topN)) {
        topFlatRoi = roi;
        topN = rec.picks.n;
        topSport = sport;
      }
    }
  }

  return {
    walletShort,
    walletAddress: latestPos?.walletAddress || null,
    tier: latestPos?.tier || null,
    latestLbRank: latestPos?.leaderboardRank ?? latestPick?.rank ?? null,
    // Latest quality snapshot (from Source A if available)
    latest: latestPick ? {
      date: latestPick.date,
      walletBase: r1(latestPick.walletBase),
      roiNorm: r1(latestPick.roiNorm),
      rankNorm: r1(latestPick.rankNorm),
      pnlNorm: r1(latestPick.pnlNorm),
      rank: latestPick.rank,
      lifetimeRoi: r1(latestPick.lifetimeRoi),
      lifetimePnl: latestPick.lifetimePnl,
    } : null,
    // Positions context
    positionsContext: latestPos ? {
      sportROI: r2(latestPos.sportROI),
      sportPnlTotal: latestPos.sportPnlTotal,
      sportVol: latestPos.sportVol,
      sportsLbPercentileTop: latestPos.sportsLbPercentileTop,
    } : null,
    // Core stats
    picks,
    positions,           // ALL graded positions (VAULT + SHADOW) — feeds dollarRoi / WR
    sizeSignal,          // VAULT-only conviction bucketing
    shadowSignal,        // SHADOW-only tracking aggregate (may be null)
    clvSkill,            // causal %+CLV (beats the close) — null pctPos when n < 5
    bySport,
    byMarket,
    verdict: verdict(picks, positions),
    // Phase 1 whitelist — consumed by Phase 2 UI badge + walletConsensus.
    flatSports,
    confirmedSports,
    wr50Sports,
    topSport,
    // v2 (2026-05-10) — Source-B-only promotion attribution. Map: sport → 'A'|'B'|'A+B'.
    // Empty when wallet has no qualifying tier in any sport.
    whitelistSourceBySport,
    whitelistVersion: WHITELIST_VERSION,
    firstBetDate: firstDate,
    lastBetDate: lastDate,
  };
}

(async () => {
  console.log('Loading walletDetails from sharpFlow picks/spreads/totals…');
  const walletBets = await loadWalletBets();
  console.log(`  → ${walletBets.length} graded wallet-bets`);
  console.log('Loading sharp_action_positions…');
  const positions = await loadPositions();
  const vaultCt = positions.filter(p => p.vaultQualified).length;
  const shadowCt = positions.length - vaultCt;
  console.log(`  → ${positions.length} graded positions (VAULT=${vaultCt}, SHADOW=${shadowCt})`);

  // Union of all wallet short hashes
  const allWallets = new Set([
    ...walletBets.map(b => b.wallet),
    ...positions.map(p => p.walletShort),
  ]);
  console.log(`  → ${allWallets.size} unique wallets overall`);

  const profiles = {};
  for (const walletShort of allWallets) {
    const pickBets = walletBets.filter(b => b.wallet === walletShort);
    const posBets = positions.filter(p => p.walletShort === walletShort);
    profiles[walletShort] = buildProfile(walletShort, pickBets, posBets);
  }

  // ── Write JSON ───────────────────────────────────────────────────
  const dataDir = join(__dirname, '..', 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const jsonPath = join(dataDir, 'wallet-profiles.json');
  // Capture the prior snapshot FIRST so we can diff whitelist tiers after
  // we overwrite the file.  Resilient to missing / malformed prior state.
  let priorProfiles = {};
  if (existsSync(jsonPath)) {
    try {
      const prior = JSON.parse(readFileSync(jsonPath, 'utf8'));
      priorProfiles = prior?.profiles || {};
    } catch (e) {
      console.warn(`  (warning: could not parse prior ${jsonPath}: ${e.message})`);
    }
  }
  writeFileSync(jsonPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    v8Cutover: V8_CUTOVER,
    whitelistVersion: WHITELIST_VERSION,
    totals: {
      wallets: Object.keys(profiles).length,
      walletBets: walletBets.length,
      positions: positions.length,
    },
    profiles,
  }, null, 2));
  console.log(`Wrote ${jsonPath}`);

  // ── Write Markdown roster ────────────────────────────────────────
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  out.push('# Sharp Wallet Roster');
  out.push('');
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER} · whitelistVersion: ${WHITELIST_VERSION}`);
  out.push('');
  out.push('Every sharp wallet we have V8-era data on, sorted by combined conviction score. This is the **full roster** (no minimum-bets filter) — noisy at the tail, but that\'s the point for a tracking dataset. Verdict column reflects the ≥3-bet threshold.');
  out.push('');
  out.push(`> **Promotion policy (v${WHITELIST_VERSION}, continuous gate)**: rebuilt every 2h via \`grade-sharp-actions\`. Tier = CONFIRMED if flat-positive in either source AND $-positive in B; FLAT if flat-positive in either source; WR50 if WR ≥ 50% in either source. Source A min ${WHITELIST_MIN_BETS} bets, Source-B-only min ${B_ONLY_MIN_BETS} bets. \`whitelistSource\` (A/A+B/B) attributes which path drove each promotion. Roll-back: set \`B_ONLY_MIN_BETS = Infinity\` in \`scripts/exportWalletProfiles.js\`.`);
  out.push('');
  const verdictCounts = {};
  Object.values(profiles).forEach(p => {
    verdictCounts[p.verdict] = (verdictCounts[p.verdict] || 0) + 1;
  });
  out.push('**Roster breakdown by verdict:**');
  out.push('');
  for (const [v, c] of Object.entries(verdictCounts).sort((a, b) => b[1] - a[1])) {
    out.push(`- ${v}: ${c}`);
  }
  out.push('');

  const list = Object.values(profiles);
  // Sort: winners first (confirmed winners top), then bleeders last
  const verdictOrder = [
    'CONFIRMED_WINNER',
    'PICKS_ONLY_POSITIVE',
    'POSITIONS_ONLY_POSITIVE',
    'MIXED_PICKS_GOOD_$_BAD',
    'INCONCLUSIVE',
    'MIXED_PICKS_BAD_$_GOOD',
    'POSITIONS_ONLY_NEGATIVE',
    'PICKS_ONLY_NEGATIVE',
    'CONFIRMED_BLEEDER',
  ];
  list.sort((a, b) => {
    const va = verdictOrder.indexOf(a.verdict);
    const vb = verdictOrder.indexOf(b.verdict);
    if (va !== vb) return va - vb;
    const aScore = (a.picks.flatPnl ?? 0) + ((a.positions.settledPnl ?? 0) / 10000);
    const bScore = (b.picks.flatPnl ?? 0) + ((b.positions.settledPnl ?? 0) / 10000);
    return bScore - aScore;
  });

  out.push('## Full roster');
  out.push('');
  out.push('| Wallet | Verdict | Tier | Rank | A: N | A: WR% | A: flat ROI | A: flat PnL (u) | B: N | B: WR% | B: $ ROI | B: $ PnL | Base | roiNorm | LifetimeROI |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const p of list) {
    const flatPnl = p.picks.flatPnl;
    const pnlStr = flatPnl == null ? '—' : (flatPnl >= 0 ? '+' : '') + flatPnl.toFixed(2);
    const dRoi = p.positions.dollarRoi;
    const dRoiStr = dRoi == null ? '—' : (dRoi >= 0 ? '+' : '') + dRoi + '%';
    const dPnl = p.positions.settledPnl;
    const dPnlStr = dPnl == null ? '—' : (dPnl >= 0 ? '+' : '') + dPnl;
    const flatRoi = p.picks.flatRoi;
    const flatRoiStr = p.picks.n ? ((flatRoi >= 0 ? '+' : '') + flatRoi + '%') : '—';
    out.push(`| ${p.walletShort} | ${p.verdict} | ${p.tier || '—'} | ${p.latestLbRank ?? '—'} | ${p.picks.n} | ${p.picks.n ? p.picks.wr + '%' : '—'} | ${flatRoiStr} | ${pnlStr} | ${p.positions.n} | ${p.positions.n ? p.positions.wr + '%' : '—'} | ${dRoiStr} | ${dPnlStr} | ${p.latest?.walletBase ?? '—'} | ${p.latest?.roiNorm ?? '—'} | ${p.latest?.lifetimeRoi != null ? p.latest.lifetimeRoi + '%' : '—'} |`);
  }
  out.push('');

  // Highlighted winners / bleeders
  out.push('---');
  out.push('## Confirmed winners (≥3 bets in both sources, positive in both)');
  out.push('');
  const winners = list.filter(p => p.verdict === 'CONFIRMED_WINNER');
  if (!winners.length) out.push('_None at this sample size._');
  else {
    out.push('| Wallet | A bets | A flat ROI | B bets | B $ ROI | B $ PnL | walletBase | Lifetime ROI |');
    out.push('|---|---|---|---|---|---|---|---|');
    winners.forEach(p => {
      out.push(`| ${p.walletShort} | ${p.picks.n} | +${p.picks.flatRoi}% | ${p.positions.n} | +${p.positions.dollarRoi}% | +${p.positions.settledPnl} | ${p.latest?.walletBase ?? '—'} | ${p.latest?.lifetimeRoi ?? '—'}% |`);
    });
  }
  out.push('');
  out.push('## Confirmed bleeders (≥3 bets in both sources, negative in both)');
  out.push('');
  const bleeders = list.filter(p => p.verdict === 'CONFIRMED_BLEEDER');
  if (!bleeders.length) out.push('_None at this sample size._');
  else {
    out.push('| Wallet | A bets | A flat ROI | B bets | B $ ROI | B $ PnL | walletBase | Lifetime ROI |');
    out.push('|---|---|---|---|---|---|---|---|');
    bleeders.forEach(p => {
      out.push(`| ${p.walletShort} | ${p.picks.n} | ${p.picks.flatRoi}% | ${p.positions.n} | ${p.positions.dollarRoi}% | ${p.positions.settledPnl} | ${p.latest?.walletBase ?? '—'} | ${p.latest?.lifetimeRoi ?? '—'}% |`);
    });
  }
  out.push('');

  out.push('---');
  out.push('## Data model (for Firebase sync)');
  out.push('');
  out.push(`Profiles are written to \`data/wallet-profiles.json\`. When you're ready to push them to Firestore run:`);
  out.push('');
  out.push('```bash');
  out.push(`node scripts/exportWalletProfiles.js --write-firebase`);
  out.push('```');
  out.push('');
  out.push(`That upserts each profile into the \`${TARGET_COLLECTION}\` collection keyed by \`walletShort\`, so V8 can read it live.`);
  out.push('');
  out.push('Each profile document has this shape:');
  out.push('');
  out.push('```json');
  out.push('{');
  out.push('  "walletShort": "fcc12b",');
  out.push('  "walletAddress": "0x…",');
  out.push('  "verdict": "CONFIRMED_WINNER",');
  out.push('  "tier": "ELITE", "latestLbRank": 34,');
  out.push('  "picks":     { "n": 13, "wins": 8, "wr": 61.5, "flatRoi": 9.8, "flatPnl": 1.28 },');
  out.push('  "positions": { "n": 15, "wins": 8, "wr": 53.3, "invested": 944079, "settledPnl": 48627, "dollarRoi": 5.2 },');
  out.push('  "sizeSignal":  { "medianInvested": 42000, "routine": {…}, "above": {…}, "wayAbove": {…} },  // VAULT-only');
  out.push('  "shadowSignal":{ "n": 7, "dollarRoi": -3.1, "medianInvested": 4200 },  // SHADOW-only (may be null)');
  out.push('  "latest": { "walletBase": 77.8, "roiNorm": 67.8, "lifetimeRoi": 6.3, "rank": 34 },');
  out.push('  "bySport": { "MLB": {…}, "NBA": {…}, "NHL": {…} },');
  out.push('  "byMarket": { "ML": {…}, "SPREAD": {…}, "TOTAL": {…} },');
  out.push('  "firstBetDate": "2026-04-17", "lastBetDate": "2026-04-21"');
  out.push('}');
  out.push('```');
  out.push('');

  const mdPath = join(__dirname, '..', 'WALLET_ROSTER.md');
  writeFileSync(mdPath, out.join('\n'));
  console.log(`Wrote ${mdPath}`);

  // ── Write WALLET_PROFILES_SUMMARY.md ─────────────────────────────
  // Monitoring artifact for Phase 1: per-sport whitelist counts, top-10
  // FLAT wallets per sport, and churn vs. the prior run so we can see if
  // the whitelist is stable or flapping.
  const sum = [];
  sum.push('# Wallet Profiles Summary');
  sum.push('');
  sum.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER} · whitelistVersion: ${WHITELIST_VERSION}`);
  sum.push('');
  sum.push('Monitoring artifact for the nightly `sharpWalletProfiles` rebuild. Shows how many wallets qualify for each whitelist tier per sport, who the top performers are, and what changed since the last run.');
  sum.push('');
  sum.push(`**Population**: ${list.length} wallets · ${walletBets.length} graded picks · ${positions.length} graded positions.`);
  sum.push('');

  // Population by verdict
  sum.push('## Population by verdict');
  sum.push('');
  sum.push('| Verdict | Wallets |');
  sum.push('|---|---|');
  for (const [v, c] of Object.entries(verdictCounts).sort((a, b) => b[1] - a[1])) {
    sum.push(`| ${v} | ${c} |`);
  }
  sum.push('');

  // Whitelist tier counts per sport
  const allSports = [...new Set(list.flatMap(p => Object.keys(p.bySport)))].sort();
  sum.push('## Whitelist tiers per sport');
  sum.push('');
  sum.push(`Minimum ${WHITELIST_MIN_BETS} bets per sport. Precedence: CONFIRMED > FLAT > WR50. "FLAT-or-better" is the population Phase 2 uses for the green badge and Δ consensus math.`);
  sum.push('');
  sum.push('| Sport | CONFIRMED | FLAT-or-better | WR50-only | Active (≥2 bets) | Any activity |');
  sum.push('|---|---|---|---|---|---|');
  for (const sport of allSports) {
    let confirmed = 0, flatOrBetter = 0, wr50Only = 0, active = 0, anyActivity = 0;
    for (const p of list) {
      const rec = p.bySport[sport];
      if (!rec) continue;
      anyActivity++;
      if (rec.picks.n >= WHITELIST_MIN_BETS || rec.positions.n >= WHITELIST_MIN_BETS) active++;
      if (rec.whitelistTier === 'CONFIRMED') { confirmed++; flatOrBetter++; }
      else if (rec.whitelistTier === 'FLAT') flatOrBetter++;
      else if (rec.whitelistTier === 'WR50') wr50Only++;
    }
    sum.push(`| ${sport} | ${confirmed} | ${flatOrBetter} | ${wr50Only} | ${active} | ${anyActivity} |`);
  }
  sum.push('');

  // ── v2 promotion-source attribution (2026-05-10 trial) ──────────────
  // Per-sport breakdown of which path drove each FLAT-or-better wallet:
  //   A    = featured-pick flat ROI > 0 (legacy v1 path)
  //   B    = on-chain flat ROI > 0, no Source A signal (NEW in v2)
  //   A+B  = profitable in BOTH paths
  // The "B (new)" column is the lift attributable to the Source-B-only
  // expansion. Re-evaluate after 2026-05-24 — see TWO_WEEK_REEVAL.md.
  sum.push('## Promotion source mix (v2 — Source-B-only trial)');
  sum.push('');
  sum.push(`Per-sport breakdown of how each FLAT-or-better wallet earned its tier. **B (new)** column counts wallets that would have been excluded under v1 (Source-A-only). Re-evaluate after 2026-05-24.`);
  sum.push('');
  sum.push('| Sport | A | A+B | B (new) | FLAT-or-better total | % from B-only |');
  sum.push('|---|---|---|---|---|---|');
  for (const sport of allSports) {
    let a = 0, ab = 0, b = 0;
    for (const p of list) {
      const rec = p.bySport[sport];
      if (!rec) continue;
      if (rec.whitelistTier !== 'CONFIRMED' && rec.whitelistTier !== 'FLAT') continue;
      if (rec.whitelistSource === 'A') a++;
      else if (rec.whitelistSource === 'A+B') ab++;
      else if (rec.whitelistSource === 'B') b++;
    }
    const total = a + ab + b;
    const pctB = total > 0 ? +((b / total) * 100).toFixed(1) : 0;
    sum.push(`| ${sport} | ${a} | ${ab} | ${b} | ${total} | ${pctB}% |`);
  }
  sum.push('');

  // Top 10 FLAT-or-better wallets per sport
  sum.push('## Top FLAT-or-better wallets per sport');
  sum.push('');
  for (const sport of allSports) {
    const rows = list
      .filter(p => p.bySport[sport] && ['CONFIRMED', 'FLAT'].includes(p.bySport[sport].whitelistTier))
      .map(p => ({
        walletShort: p.walletShort,
        tier: p.bySport[sport].whitelistTier,
        picks: p.bySport[sport].picks,
        positions: p.bySport[sport].positions,
      }))
      .sort((a, b) => (b.picks.flatRoi ?? -Infinity) - (a.picks.flatRoi ?? -Infinity))
      .slice(0, 10);
    sum.push(`### ${sport}`);
    sum.push('');
    if (!rows.length) { sum.push('_No FLAT-or-better wallets yet._'); sum.push(''); continue; }
    sum.push('| # | Wallet | Tier | N | WR% | Flat ROI | Flat PnL (u) | $ ROI | $ PnL |');
    sum.push('|---|---|---|---|---|---|---|---|---|');
    rows.forEach((r, i) => {
      const flatPnlStr = (r.picks.flatPnl >= 0 ? '+' : '') + (r.picks.flatPnl?.toFixed(2) ?? '—');
      const roiStr = (r.picks.flatRoi >= 0 ? '+' : '') + (r.picks.flatRoi ?? '—') + '%';
      const dRoiStr = r.positions.dollarRoi == null ? '—' : ((r.positions.dollarRoi >= 0 ? '+' : '') + r.positions.dollarRoi + '%');
      const dPnlStr = r.positions.settledPnl == null ? '—' : ((r.positions.settledPnl >= 0 ? '+' : '') + r.positions.settledPnl);
      sum.push(`| ${i + 1} | ${r.walletShort} | ${r.tier} | ${r.picks.n} | ${r.picks.wr}% | ${roiStr} | ${flatPnlStr} | ${dRoiStr} | ${dPnlStr} |`);
    });
    sum.push('');
  }

  // Churn since last run
  sum.push('## Churn since last run');
  sum.push('');
  const churnRows = [];
  for (const walletShort of new Set([...Object.keys(profiles), ...Object.keys(priorProfiles)])) {
    const cur = profiles[walletShort];
    const old = priorProfiles[walletShort];
    const curSports = cur?.bySport || {};
    const oldSports = old?.bySport || {};
    const sports = new Set([...Object.keys(curSports), ...Object.keys(oldSports)]);
    for (const sport of sports) {
      const curTier = curSports[sport]?.whitelistTier || null;
      const oldTier = oldSports[sport]?.whitelistTier || null;
      if (curTier !== oldTier) {
        churnRows.push({
          walletShort,
          sport,
          from: oldTier ?? '—',
          to:   curTier ?? '—',
          isNew: !old,
          isLost: !cur,
        });
      }
    }
  }
  if (!Object.keys(priorProfiles).length) {
    sum.push('_First run — no prior state to diff against._');
  } else if (!churnRows.length) {
    sum.push('_No whitelist-tier changes vs. the prior run._');
  } else {
    sum.push(`**${churnRows.length}** wallet-sport tier changes since the prior run.`);
    sum.push('');
    sum.push('| Wallet | Sport | From | To | Notes |');
    sum.push('|---|---|---|---|---|');
    churnRows
      .sort((a, b) => a.walletShort.localeCompare(b.walletShort) || a.sport.localeCompare(b.sport))
      .forEach(r => {
        const note = r.isNew ? 'new wallet' : r.isLost ? 'wallet dropped' : '';
        sum.push(`| ${r.walletShort} | ${r.sport} | ${r.from} | ${r.to} | ${note} |`);
      });
  }
  sum.push('');
  sum.push('---');
  sum.push('*Generated by `scripts/exportWalletProfiles.js`.*');
  sum.push('');

  const summaryPath = join(__dirname, '..', 'WALLET_PROFILES_SUMMARY.md');
  writeFileSync(summaryPath, sum.join('\n'));
  console.log(`Wrote ${summaryPath}`);

  // ── Optional Firebase sync ───────────────────────────────────────
  if (WRITE_FB) {
    console.log(`Upserting ${Object.keys(profiles).length} profiles to Firestore collection \`${TARGET_COLLECTION}\`…`);
    const batch = db.batch();
    let count = 0;
    for (const [walletShort, p] of Object.entries(profiles)) {
      const ref = db.collection(TARGET_COLLECTION).doc(walletShort);
      batch.set(ref, {
        ...p,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      count++;
      if (count % 400 === 0) {
        await batch.commit();
        console.log(`  → committed ${count}`);
      }
    }
    await batch.commit();
    console.log(`✓ Upserted ${count} wallet profiles.`);
  } else {
    console.log('\n(Dry run — pass --write-firebase to push to Firestore.)');
  }

  process.exit(0);
})();
