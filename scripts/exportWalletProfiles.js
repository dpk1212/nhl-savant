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
 *                         `sharpWalletProfiles` + write `clvSkillLedger/current`
 *                         (default: skipped).
 *   --write-clv-ledger    Write only the materialised CLV ledger doc (cost fix;
 *                         syncPickState loads this instead of scanning GRADED).
 *   --collection=xxx      Override target collection name.
 *
 * Cadence: every 2h via `.github/workflows/grade-sharp-actions.yml`
 * (after gradeSharpActions + syncWalletBets). Always runs with
 * `--write-firebase` in CI so live UI + TAPE sizing share one profile.
 *
 * CRITICAL — profile.clvSkill (causal %+CLV / "beats the close"):
 *   Same definition as `src/lib/walletClvSkill.js` used by the TAPE cron
 *   (`computeNetMeanPrior` → `v8_netMeanPrior`). Rebuilt every cycle from
 *   graded positions so Sharp Flow cards and tape edge never drift.
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
 *   CONFIRMED — flat-positive (Source A OR B) AND ($-positive Source B
 *               OR recent-dollar rescue — see below)
 *   FLAT      — flat-positive (Source A OR B)
 *   WR50      — WR ≥ 50% (Source A OR B)
 *   null      — none of the above (wallet not whitelisted in this sport)
 *
 * Where:
 *   flatOkA   = picks.n      >= WHITELIST_MIN_BETS (2)  AND picks.flatRoi      > 0
 *   flatOkB   = positions.n  >= B_ONLY_MIN_BETS    (4)  AND positions.positionFlatRoi > 0
 *   dollarOk  = positions.n  >= WHITELIST_MIN_BETS (2)  AND positions.dollarRoi > 0
 *   wr50OkA   = picks.n      >= WHITELIST_MIN_BETS (2)  AND picks.wr      >= 50
 *   wr50OkB   = positions.n  >= B_ONLY_MIN_BETS    (4)  AND positions.wr  >= 50
 *
 * Recent-dollar rescue (v3, 2026-08-12) — FLAT → CONFIRMED when lifetime
 * Source B $ is ≤0 (sample can be thin / skewed) but last-30d Action $ is
 * green with skill floors:
 *   recentDollarOk = last-30d Action n ≥ 15 AND $ ROI > 0
 *                    AND lifetime positions.n ≥ 80
 *                    AND clvSkill n ≥ 50 AND pctPos ≥ 55
 * Stamp bySport[sport].whitelistRescue = 'recent-dollar-30d' when used.
 * Roll-back: set RECENT_DOLLAR_RESCUE_MIN_N = Infinity.
 *
 * Size-skill rescue (v4, 2026-08-12) — $ up / flat down → CONFIRMED when
 * wallet-level own-median size-up WR lift clears floors. Live Proven/Action
 * only when sizeRatio ≥ 1.0 (full/press). See src/lib/sizeSkillRescue.js.
 * Stamp whitelistRescue = 'size-skill'. Roll-back: SIZE_SKILL_BAND_MIN_N = Infinity.
 *
 * The Source-B-only paths (B_ONLY_MIN_BETS = 4 as of 2026-08-11; was 5) let
 * us promote sharps who never appear on a featured pick (the historical
 * MLB/NHL coverage gap). The bar stays above Source A (4 vs 2) since
 * these wallets have no independent featured-pick verification.
 *
 * Audit fields (v2+):
 *   bySport[sport].whitelistSource    ∈ {'A', 'A+B', 'B', null}
 *   bySport[sport].whitelistRescue    ∈ {'recent-dollar-30d', 'size-skill', null}
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
import {
  CLV_HIST_FROM,
  CLV_SKILL_MIN_N,
  CLV_LEDGER_COLLECTION,
  CLV_LEDGER_DOC_ID,
  buildClvLedgerFromPositions,
  causalPctPos,
  serializeClvLedger,
  shortWalletId,
} from '../src/lib/walletClvSkill.js';
import {
  WALLET_PROFILES_META_COLLECTION,
  WALLET_PROFILES_META_DOC_ID,
} from './lib/loadWalletProfiles.js';
import { buildSizeRatioBands } from '../src/lib/sizeRatioBands.js';
import {
  SIZE_SKILL_RESCUE,
  SIZE_SKILL_LIVE_MIN,
  SIZE_SKILL_WR_LIFT_MIN,
  SIZE_SKILL_BAND_MIN_N,
  SIZE_SKILL_HIGH_WR_MIN,
  SIZE_SKILL_SPORT_POS_MIN_N,
  SIZE_SKILL_SPORT_DOLLAR_ROI_MIN,
  evaluateSizeSkillLift,
  sizeSkillRescueOk,
} from '../src/lib/sizeSkillRescue.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = new Set(process.argv.slice(2));
const WRITE_FB = argv.has('--write-firebase');
// Materialise CLV ledger for syncPickState (1 read vs full GRADED scan).
// Always written with --write-firebase; also available standalone for cost fixes.
const WRITE_CLV_LEDGER = WRITE_FB || argv.has('--write-clv-ledger');
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

/** Canonical shipped stake units on a sharpFlow side (same ladder as tallySides). */
function sideStakeUnits(side) {
  const u = side?.finalUnits
    ?? side?.v8_agsUnitsApplied
    ?? side?.peak?.units
    ?? side?.lock?.units
    ?? 0;
  return Number(u) || 0;
}

/**
 * True featured / shipped lock — money on the ticket.
 * Mirrors SharpFlow tallySides: drop MUTED / CANCELLED / SHADOW / tracked / 0u.
 * MONITORING + hard-mute legs are graded for the record but were never featured.
 */
function isTrulyFeaturedSide(side) {
  if (!side) return false;
  if (side.superseded) return false;
  if (side.health?.status === 'CANCELLED' || side.health?.status === 'MUTED') return false;
  if (side.lockStage === 'SHADOW') return false;
  if (side.result?.tracked === true) return false;
  if (sideStakeUnits(side) <= 0) return false;
  return true;
}

// ── Load Source A (wallet-bets from walletDetails) ─────────────────
// IMPORTANT: do NOT drop muted/0u sides here — whitelist / Vault (CONFIRMED+FLAT)
// is rebuilt from this feed. Filtering unshipped locks belongs only in
// recentFeaturedLegs (Action expand UI). 2026-08-10 scoped filter demoted ~24 vault wallets.
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
          const playSide = sides[w.side] || side;
          const sidePeak = playSide?.peak || playSide?.lock || peak;
          const betOddsRaw = playSide?.peak?.odds ?? playSide?.lock?.odds ?? oddsForThisSide;
          const betOdds = Number.isFinite(Number(betOddsRaw)) && Number(betOddsRaw) !== 0
            ? Number(betOddsRaw)
            : null;
          const won = w.side === winningSide ? 1 : 0;
          // Line from this side's peak/lock (TOTAL 7.5 / SPREAD -1.5), else doc-level.
          const rawLine = sidePeak?.line ?? peak?.line ?? d.line ?? d.totalLine ?? d.spreadLine ?? null;
          const entryLine = Number.isFinite(Number(rawLine)) ? Number(rawLine) : null;
          // Expand "Their featured" only — wallet's side actually shipped units.
          const shippedFeatured = isTrulyFeaturedSide(playSide);
          bets.push({
            // Prefer sport gameKey (atl_nyy); fall back to doc id for legacy.
            gameKey: d.gameKey || doc.id,
            date: d.date,
            sport: d.sport,
            market,
            wallet: w.wallet,
            side: w.side,
            away: d.away || d.awayTeam || null,
            home: d.home || d.homeTeam || null,
            odds: betOdds,
            invested: w.invested ?? 0,
            entryLine,
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
            shippedFeatured,
            featuredUnits: shippedFeatured ? sideStakeUnits(playSide) : 0,
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
    // Join key is last-6 hex — same as shortWalletId / sharpWalletProfiles doc id.
    const walletShort = d.walletShort || shortWalletId(d.wallet);
    // Vault/Shadow tier — treat missing field (pre-shadow docs) as VAULT.
    const vaultQualified = d.vaultQualified !== false;
    // Per-position unit return — Source-B equivalent of Source A's `flat`.
    // settledPnl is already (settledPrice - avgPrice) * sharesHeld, so dividing
    // by `invested` (= avgPrice * sharesHeld) gives the unit return at the
    // Polymarket entry price. Mean across positions = position-flat ROI.
    const flat = invested > 0 ? settledPnl / invested : 0;
    const sizeRatio = Number.isFinite(Number(d.betMultiplier))
      ? Number(d.betMultiplier)
      : (Number.isFinite(Number(d.v8_sizeRatio)) ? Number(d.v8_sizeRatio) : null);
    rows.push({
      date: d.date,
      sport: d.sport,
      market: d.marketType,
      gameKey: d.gameKey || null,
      side: d.side || null,
      teamName: d.teamName || null,
      away: d.away || d.awayTeam || null,
      home: d.home || d.homeTeam || null,
      entryLine: d.entryLine ?? d.spreadLine ?? d.totalLine ?? null,
      sizeRatio,
      walletShort,
      walletAddress: d.wallet,
      tier: d.tier,
      invested,
      settledPnl,
      flat,
      avgPrice: d.avgPrice,
      pinnacleOdds: d.pinnacleOdds ?? d.entryPinnacleOdds ?? null,
      bestRetailOdds: d.bestRetailOdds ?? null,
      odds: d.odds ?? null,
      // Aggregate WR still treats non-profit as loss (legacy). Size-band builder
      // excludes ~0 settledPnl pushes via settledPnl when present.
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

/**
 * Causal %+CLV skill ("beats the close") — SINGLE SOURCE OF TRUTH with TAPE.
 * Uses buildClvLedgerFromPositions + causalPctPos from walletClvSkill.js so
 * profile.clvSkill.pctPos === the % the sync cron uses for netCLV / tape.
 *
 * asOf = tomorrow ET → include every graded event through today (profile is
 * the standing skill score; pick-time as-of is applied in the sync cron).
 */
function etTomorrowDateStr() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function computeClvSkill(clvLedger, walletShort) {
  const short = shortWalletId(walletShort);
  const asOf = etTomorrowDateStr();
  const pct = causalPctPos(clvLedger, short, asOf, { minN: CLV_SKILL_MIN_N });
  const arr = clvLedger?.get?.(short) || [];
  const nPos = arr.filter((e) => e.clv > 0).length;
  return {
    pctPos: pct == null ? null : Math.round(pct * 10) / 10,
    n: arr.length,
    nPos,
    since: CLV_HIST_FROM,
    minN: CLV_SKILL_MIN_N,
    // ISO date the score was rebuilt — UI/cron can detect freshness.
    asOfDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }),
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

/** ET calendar date string YYYY-MM-DD, `days` ago from now. */
function etDateMinusDays(days) {
  const ms = Date.now() - Math.max(0, days) * 86400000;
  return new Date(ms).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/** Action expand sparkline / recent lists — rolling calendar window. */
const FORM_CURVE_DAYS = 30;
const RECENT_LEGS_DAYS = 30;
/** Ticket list cap. Sparklines use full 30d action curves (not this slice). */
const RECENT_LEGS_MAX = 120;

/**
 * Trailing form + flat equity curve for Action desk (strength UI).
 * Prefer featured picks (Source A); fall back to positions with flat.
 * Equity curve = graded flat legs in the last FORM_CURVE_DAYS (ET).
 * L5/L10 stay last-N count windows (not calendar).
 */
function sportForm(bets) {
  const ordered = (bets || [])
    .filter((b) => b && (b.won === 0 || b.won === 1))
    .slice()
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  if (!ordered.length) return null;

  const lastN = (n) => {
    const slice = ordered.slice(-n);
    const w = slice.filter((b) => b.won === 1).length;
    const l = slice.length - w;
    return { w, l };
  };
  const l5 = ordered.length >= 1 ? lastN(Math.min(5, ordered.length)) : null;
  const l10 = ordered.length >= 1 ? lastN(Math.min(10, ordered.length)) : null;

  const cutoff = etDateMinusDays(FORM_CURVE_DAYS);
  const inWindow = ordered.filter((b) => b.date && String(b.date) >= cutoff);
  // Prefer calendar window; if thinner than 5 flat legs, fall back to last 20.
  const flatInWindow = inWindow.filter((b) => Number.isFinite(b.flat));
  const flatAll = ordered.filter((b) => Number.isFinite(b.flat));
  const curveSrc = flatInWindow.length >= 5
    ? flatInWindow
    : flatAll.slice(-20);
  let cum = 0;
  const flatCurve = curveSrc.map((b) => {
    cum += b.flat;
    return r2(cum);
  });
  // Actual $ curve — settledPnl when present, else invested × flat unit return.
  const dollarOf = (b) => {
    if (Number.isFinite(b.settledPnl)) return b.settledPnl;
    if (Number.isFinite(b.flat) && Number.isFinite(b.invested) && b.invested > 0) {
      return b.invested * b.flat;
    }
    return null;
  };
  const dollarInWindow = inWindow.filter((b) => dollarOf(b) != null);
  const dollarAll = ordered.filter((b) => dollarOf(b) != null);
  const dollarSrc = dollarInWindow.length >= 5 ? dollarInWindow : dollarAll.slice(-20);
  let dCum = 0;
  const dollarCurve = dollarSrc.map((b) => {
    dCum += dollarOf(b);
    return Math.round(dCum);
  });
  if (!l5 && !flatCurve.length && !dollarCurve.length) return null;
  return {
    l5,
    l10,
    flatCurve: flatCurve.length >= 5 ? flatCurve : [],
    flatEnd: flatCurve.length ? flatCurve[flatCurve.length - 1] : null,
    dollarCurve: dollarCurve.length >= 5 ? dollarCurve : [],
    dollarEnd: dollarCurve.length ? dollarCurve[dollarCurve.length - 1] : null,
    flatCurveDays: FORM_CURVE_DAYS,
    flatCurveFrom: curveSrc[0]?.date || null,
  };
}

/** Size band key — same thresholds as confirmedActionDesk.sizeBandFromRatio. */
function sizeBandKey(sr) {
  if (!Number.isFinite(sr)) return null;
  if (sr >= 1.5) return 'press';
  if (sr >= 1.0) return 'full';
  if (sr >= 0.5) return 'lean';
  return 'light';
}

function sideLabel(side) {
  if (!side) return null;
  const s = String(side).toLowerCase();
  if (s === 'over') return 'Over';
  if (s === 'under') return 'Under';
  if (s === 'draw') return 'Draw';
  if (s === 'away' || s === 'home') return s;
  return String(side);
}

/** "ATL @ NYY" from gameKey or team names. */
function matchupAbbrev(away, home, gameKey) {
  const gk = String(gameKey || '');
  // Letters-only codes (atl_nyy, …_kcr_det_total) — skip date fragments.
  const m = gk.match(/([a-z]{2,5})_([a-z]{2,5})(?:_(?:total|spread|ml))?$/i)
    || gk.match(/^([a-z]{2,5})_([a-z]{2,5})$/i);
  if (m) return `${m[1].toUpperCase()} @ ${m[2].toUpperCase()}`;
  const last = (t) => {
    if (!t) return null;
    const parts = String(t).trim().split(/\s+/);
    return parts[parts.length - 1] || null;
  };
  const a = last(away);
  const h = last(home);
  if (a && h) return `${a} @ ${h}`;
  return null;
}

/** American odds → display; null/0 omitted (never stamp fake zeros). */
function cleanAmericanOdds(odds) {
  const o = Number(odds);
  if (!Number.isFinite(o) || o === 0) return null;
  return Math.round(o);
}

function americanFromProb(p) {
  if (!Number.isFinite(p) || p <= 0 || p >= 1) return null;
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
}

/**
 * Featured tracked picks (Source A) in the last RECENT_LEGS_DAYS for expand Tab 1.
 * Capped at RECENT_LEGS_MAX so profile JSON stays small.
 * UI-only: shipped locks (units > 0, not muted/tracked) — does not affect whitelist.
 */
function recentFeaturedLegs(pickBets, sportUsualBet = null, { days = RECENT_LEGS_DAYS, maxLegs = RECENT_LEGS_MAX } = {}) {
  const cutoff = etDateMinusDays(days);
  const ordered = (pickBets || [])
    .filter((b) => b && (b.won === 0 || b.won === 1) && b.date && String(b.date) >= cutoff)
    .filter((b) => b.shippedFeatured === true)
    .slice()
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
    .slice(-maxLegs);
  return ordered.map((b) => {
    let sr = null;
    if (Number.isFinite(sportUsualBet) && sportUsualBet > 0 && Number.isFinite(b.invested) && b.invested > 0) {
      sr = +(b.invested / sportUsualBet).toFixed(2);
    } else if (Number.isFinite(b.sizeRatio)) {
      sr = Number(b.sizeRatio);
    }
    const line = Number.isFinite(Number(b.entryLine)) ? Number(b.entryLine) : null;
    const matchup = matchupAbbrev(b.away, b.home, b.gameKey);
    const invested = Number.isFinite(b.invested) ? Math.round(b.invested) : null;
    const flat = Number.isFinite(b.flat) ? r2(b.flat) : null;
    // Featured unit flat × stake ≈ dollar PnL at lock odds.
    const dollarPnl = (flat != null && invested != null && invested > 0)
      ? Math.round(invested * flat)
      : null;
    return {
      date: b.date || null,
      marketType: b.market || null,
      side: b.side || null,
      label: sideLabel(b.side),
      line,
      gameKey: b.gameKey || null,
      matchup,
      away: b.away || null,
      home: b.home || null,
      odds: cleanAmericanOdds(b.odds),
      invested,
      sizeRatio: sr,
      sizeBand: sizeBandKey(sr),
      won: b.won,
      flat,
      dollarPnl,
    };
  });
}

/**
 * Graded Action positions (Source B) in the last RECENT_LEGS_DAYS for expand Tab 2.
 */
function recentActionLegs(posBets, sportUsualBet = null, { days = RECENT_LEGS_DAYS, maxLegs = RECENT_LEGS_MAX } = {}) {
  const cutoff = etDateMinusDays(days);
  const ordered = (posBets || [])
    .filter((b) => b && (b.won === 0 || b.won === 1) && b.date && String(b.date) >= cutoff)
    .slice()
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
    .slice(-maxLegs);
  return ordered.map((b) => {
    let sr = null;
    if (Number.isFinite(sportUsualBet) && sportUsualBet > 0 && Number.isFinite(b.invested) && b.invested > 0) {
      sr = +(b.invested / sportUsualBet).toFixed(2);
    } else if (Number.isFinite(b.sizeRatio)) {
      sr = Number(b.sizeRatio);
    }
    const label = b.teamName || sideLabel(b.side);
    const matchup = matchupAbbrev(b.away, b.home, b.gameKey);
    let odds = cleanAmericanOdds(b.pinnacleOdds ?? b.bestRetailOdds ?? b.odds);
    if (odds == null && Number.isFinite(b.avgPrice)) {
      const p = Number(b.avgPrice);
      const prob = p > 1 && p <= 100 ? p / 100 : p;
      odds = americanFromProb(prob);
    }
    return {
      date: b.date || null,
      marketType: b.market || null,
      side: b.side || null,
      label: label || null,
      line: Number.isFinite(Number(b.entryLine)) ? Number(b.entryLine) : null,
      gameKey: b.gameKey || null,
      matchup,
      away: b.away || null,
      home: b.home || null,
      odds,
      invested: Math.round(Number(b.invested) || 0),
      sizeRatio: sr,
      sizeBand: sizeBandKey(sr),
      won: b.won,
      settledPnl: Math.round(Number(b.settledPnl) || 0),
      dollarPnl: Math.round(Number(b.settledPnl) || 0),
      flat: Number.isFinite(b.flat) ? r2(b.flat) : null,
    };
  });
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
//   CONFIRMED — flat-positive AND (lifetime $ ROI > 0 OR recent-dollar rescue)
//   FLAT      — positive flat-equivalent ROI
//   WR50      — WR ≥ 50%
//   null      — none of the above OR below MIN_BETS in that sport
// Precedence: CONFIRMED > FLAT > WR50.
//
// v2 (2026-05-10) — Source-B-only promotion enabled.
// v3 (2026-08-12) — recent-dollar rescue: FLAT → CONFIRMED when last-30d
// Action $ is green with pos/CLV floors (tracked sample can be skewed).
// v4 (2026-08-12) — size-skill rescue: $ up / flat down → CONFIRMED when
// own-median size-up WR lift ≥ +15pp; live proven only at sizeRatio ≥ 1.0.
// Was 5; lowered B_ONLY_MIN_BETS 2026-08-11 for B on-ramp
// ($-pos + flat-pos at n=4) without opening n=2 lottery books.
const WHITELIST_MIN_BETS    = 2;   // Source A min (unchanged from v1)
const B_ONLY_MIN_BETS       = 4;   // Source-B-only min (was 5; 2026-08-11)
const WHITELIST_VERSION     = 4;   // v4: size-skill rescue (2026-08-12)

/** Last-30d Action $ rescue — FLAT → CONFIRMED when lifetime $ sample is red. */
const RECENT_DOLLAR_RESCUE_DAYS = 30;
const RECENT_DOLLAR_RESCUE_MIN_N = 15;       // set Infinity to disable rescue
const RECENT_DOLLAR_RESCUE_POS_MIN_N = 80;   // lifetime Action positions in sport
const RECENT_DOLLAR_RESCUE_CLV_MIN_N = 50;
const RECENT_DOLLAR_RESCUE_CLV_MIN_PCT = 55;

/**
 * Graded Action $ book in the last `days` ET calendar window.
 * Same date window as recentActionLegs / form curves.
 */
function recentActionDollarWindow(posBets, {
  days = RECENT_DOLLAR_RESCUE_DAYS,
  minN = RECENT_DOLLAR_RESCUE_MIN_N,
} = {}) {
  const cutoff = etDateMinusDays(days);
  const legs = (posBets || []).filter(
    (b) => b && (b.won === 0 || b.won === 1) && b.date && String(b.date) >= cutoff,
  );
  const n = legs.length;
  const wins = legs.filter((b) => b.won === 1).length;
  let invested = 0;
  let settledPnl = 0;
  for (const b of legs) {
    if (Number.isFinite(b.invested)) invested += b.invested;
    if (Number.isFinite(b.settledPnl)) settledPnl += b.settledPnl;
  }
  const dollarRoi = invested > 0 ? +((settledPnl / invested) * 100).toFixed(1) : null;
  return {
    n,
    wins,
    losses: n - wins,
    wr: n ? +((wins / n) * 100).toFixed(1) : null,
    invested,
    settledPnl,
    dollarRoi,
    ok: n >= minN && dollarRoi != null && dollarRoi > 0,
  };
}

function recentDollarRescueOk(positionsInSport, recentWindow, clvSkill) {
  if (!(RECENT_DOLLAR_RESCUE_MIN_N < Infinity)) return false;
  const q = positionsInSport || { n: 0 };
  if ((q.n || 0) < RECENT_DOLLAR_RESCUE_POS_MIN_N) return false;
  if (!recentWindow?.ok) return false;
  const clvN = Number(clvSkill?.n) || 0;
  const clvPct = Number(clvSkill?.pctPos);
  if (clvN < RECENT_DOLLAR_RESCUE_CLV_MIN_N) return false;
  if (!Number.isFinite(clvPct) || clvPct < RECENT_DOLLAR_RESCUE_CLV_MIN_PCT) return false;
  return true;
}

// Source-attribution helper. Returns 'A', 'B', or 'A+B' for audit/reporting.
// Used to populate `bySport[sport].whitelistSource` so the 2-week re-eval
// can isolate the lift attributable to the new Source-B-only path.
function classifyWhitelistTierWithSource(picksInSport, positionsInSport, {
  recentWindow = null,
  clvSkill = null,
  sizeLiftEval = null,
} = {}) {
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
  const recentRescued = !dollarOk && recentDollarRescueOk(q, recentWindow, clvSkill);
  const sizeRescued = sizeSkillRescueOk(p, q, sizeLiftEval);

  // Tier resolution — CONFIRMED via flat+$ (or recent-$ rescue), OR size-skill.
  let tier = null;
  let whitelistRescue = null;
  if ((flatOkA || flatOkB) && (dollarOk || recentRescued)) {
    tier = 'CONFIRMED';
    if (recentRescued && !dollarOk) whitelistRescue = 'recent-dollar-30d';
  } else if (sizeRescued) {
    tier = 'CONFIRMED';
    whitelistRescue = SIZE_SKILL_RESCUE;
  } else if (flatOkA || flatOkB) {
    tier = 'FLAT';
  } else if (wr50OkA || wr50OkB) {
    tier = 'WR50';
  }

  // Source attribution for the active flat/WR signal driving the tier.
  // Size-skill has no flat path — attribute B when positions exist.
  let source = null;
  if (whitelistRescue === SIZE_SKILL_RESCUE) {
    source = 'B';
  } else if (tier === 'CONFIRMED' || tier === 'FLAT') {
    if (flatOkA && flatOkB) source = 'A+B';
    else if (flatOkA)       source = 'A';
    else if (flatOkB)       source = 'B';
  } else if (tier === 'WR50') {
    if (wr50OkA && wr50OkB) source = 'A+B';
    else if (wr50OkA)       source = 'A';
    else if (wr50OkB)       source = 'B';
  }
  return {
    tier,
    source,
    whitelistRescue,
  };
}

// Back-compat shim — callers that only need the tier string.
function classifyWhitelistTier(picksInSport, positionsInSport, opts) {
  return classifyWhitelistTierWithSource(picksInSport, positionsInSport, opts).tier;
}

// ── Build per-wallet profile ───────────────────────────────────────
function loadAvgSportBetByShort() {
  // sports_sharps.json — cross-sport usual for wallet-level sizeRatioBands only.
  // Action/featured history legs use sport-local usual (bySport.positions).
  const path = join(__dirname, '..', 'public', 'sports_sharps.json');
  const out = new Map();
  if (!existsSync(path)) return out;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    for (const [addr, row] of Object.entries(raw)) {
      if (!addr || addr.startsWith('_') || !row || typeof row !== 'object') continue;
      const avg = Number(row.avgSportBet);
      if (!Number.isFinite(avg) || avg <= 0) continue;
      const short = shortWalletId(addr);
      if (short) out.set(short, avg);
    }
  } catch (e) {
    console.warn('[sizeRatioBands] sports_sharps unreadable:', e.message);
  }
  return out;
}

function buildProfile(walletShort, pickBets, posBets, clvLedger, avgSportBet = null) {
  const latestPick = pickBets.length ? pickBets.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0] : null;
  const latestPos = posBets.length ? posBets.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0] : null;

  const picks = picksAgg(pickBets);
  const positions = positionsAgg(posBets);

  // CLV first — recent-dollar CONFIRMED rescue needs wallet-level skill floors.
  const clvSkill = computeClvSkill(clvLedger, walletShort);

  // Size signal BEFORE bySport — size-skill CONFIRMED rescue needs own-median lift.
  // VAULT-ONLY: shadow positions are structurally small and would skew medians.
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

  let sizeRatioBands = null;
  if (Number.isFinite(avgSportBet) && avgSportBet > 0) {
    const posBands = buildSizeRatioBands(posBets, avgSportBet);
    const pickBands = buildSizeRatioBands(pickBets, avgSportBet);
    if (posBands || pickBands) {
      sizeRatioBands = {
        usual: Math.round(avgSportBet),
        minN: posBands?.minN ?? pickBands?.minN ?? 30,
        positions: posBands,
        picks: pickBands,
      };
    }
  }

  const sizeLiftEval = evaluateSizeSkillLift(sizeSignal, sizeRatioBands);

  // Sport + market breakdowns
  const bySport = {};
  for (const sport of new Set([...pickBets.map(b => b.sport), ...posBets.map(b => b.sport)].filter(Boolean))) {
    const pp = pickBets.filter(b => b.sport === sport);
    const ps = posBets.filter(b => b.sport === sport);
    const picksInSport = picksAgg(pp);
    const positionsInSport = positionsAgg(ps);
    const recentWindow = recentActionDollarWindow(ps);
    const { tier, source, whitelistRescue } = classifyWhitelistTierWithSource(
      picksInSport,
      positionsInSport,
      { recentWindow, clvSkill, sizeLiftEval },
    );
    // Form: prefer featured picks; else positions (with flat = settledPnl/invested).
    // Recent ticket lists always stamp both sources for Action expand tabs.
    const sportUsual = (positionsInSport.n > 0 && positionsInSport.invested > 0)
      ? positionsInSport.invested / positionsInSport.n
      : null;
    const recentFeatured = recentFeaturedLegs(pp, sportUsual);
    const recentAction = recentActionLegs(ps, sportUsual);
    // Featured form (Source A when present) — row chips / "Their featured".
    let form = sportForm(pp.length ? pp : ps);
    // Action form always from Source B positions — Action tab spark = true L30 $.
    const actionForm = sportForm(ps);
    if (!form && (recentFeatured.length || recentAction.length || actionForm)) {
      form = {
        l5: null, l10: null,
        flatCurve: [], flatEnd: null,
        dollarCurve: [], dollarEnd: null,
        flatCurveDays: FORM_CURVE_DAYS,
      };
    }
    if (form) {
      form.recentFeatured = recentFeatured;
      form.recentAction = recentAction;
      form.recentActionTotalN = recentWindow.n;
      if (actionForm) {
        form.actionFlatCurve = actionForm.flatCurve || [];
        form.actionFlatEnd = actionForm.flatEnd;
        form.actionDollarCurve = actionForm.dollarCurve || [];
        form.actionDollarEnd = actionForm.dollarEnd;
        form.actionL5 = actionForm.l5;
        form.actionL10 = actionForm.l10;
      }
    }
    // Sport × market rollups for Action expand (MLB TOTAL, MLB ML, …).
    const byMarketInSport = {};
    for (const market of new Set([...pp.map((b) => b.market), ...ps.map((b) => b.market)].filter(Boolean))) {
      const mPos = ps.filter((b) => b.market === market);
      byMarketInSport[market] = {
        picks: picksAgg(pp.filter((b) => b.market === market)),
        positions: positionsAgg(mPos),
        recentActionWindow: recentActionDollarWindow(mPos, { minN: 1 }),
      };
    }
    bySport[sport] = {
      picks: picksInSport,
      positions: positionsInSport,
      byMarket: byMarketInSport,
      isFlatProfitable:   picksInSport.n >= WHITELIST_MIN_BETS && picksInSport.flatRoi > 0,
      isDollarProfitable: positionsInSport.n >= WHITELIST_MIN_BETS
                          && positionsInSport.dollarRoi != null
                          && positionsInSport.dollarRoi > 0,
      isRecentDollarProfitable: !!recentWindow?.ok,
      isSizeSkillRescue: whitelistRescue === SIZE_SKILL_RESCUE,
      isWR50:             picksInSport.n >= WHITELIST_MIN_BETS && picksInSport.wr >= 50,
      // NEW (v2): Source-B-only signals — used to attribute the promotion path.
      isPositionFlatProfitable: positionsInSport.n >= B_ONLY_MIN_BETS
                                && (positionsInSport.positionFlatRoi ?? 0) > 0,
      isWR50_B:                 positionsInSport.n >= B_ONLY_MIN_BETS
                                && (positionsInSport.wr ?? 0) >= 50,
      whitelistTier:      tier,
      whitelistSource:    source,   // 'A' | 'B' | 'A+B' | null  (v2)
      whitelistRescue:    whitelistRescue, // 'recent-dollar-30d' | 'size-skill' | null
      recentActionWindow: {
        days: RECENT_DOLLAR_RESCUE_DAYS,
        n: recentWindow.n,
        wins: recentWindow.wins,
        losses: recentWindow.losses,
        wr: recentWindow.wr,
        dollarRoi: recentWindow.dollarRoi,
        settledPnl: Number.isFinite(recentWindow.settledPnl)
          ? Math.round(recentWindow.settledPnl) : null,
      },
      ...(form ? { form } : {}),
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

  // Shadow signal — aggregate of small-sized (SHADOW) positions only. A
  // wallet with negative shadow PnL but positive vault PnL is exactly the
  // pattern we expect from a sharp ("they win when they're sure, chase when
  // they're not"), so keeping these separate lets us see that.
  const shadowSignal = shadowPosBets.length >= 1 ? {
    ...positionsAgg(shadowPosBets),
    medianInvested: shadowPosBets.length ? Math.round(median(shadowPosBets.map(b => b.invested))) : null,
  } : null;

  // sizeSignal / sizeRatioBands / sizeLiftEval computed above (size-skill rescue).

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
    sizeRatioBands,      // WR by size-vs-usual (avgSportBet); null when usual unknown
    sizeSkillLift: sizeLiftEval?.ok ? {
      source: sizeLiftEval.source,
      wrLift: sizeLiftEval.wrLift,
      highWr: sizeLiftEval.highWr,
      highDollarRoi: sizeLiftEval.highDollarRoi,
    } : null,
    clvSkill,            // TAPE input: causal %+CLV (beats the close); null pctPos when n < minN
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
  const avgByShort = loadAvgSportBetByShort();
  console.log(`  → avgSportBet for ${avgByShort.size} wallets (size-ratio bands)`);

  // Shared CLV ledger — built once (was rebuilt per-wallet inside computeClvSkill).
  // Also materialised to clvSkillLedger/current so syncPickState can load 1 doc
  // instead of scanning every GRADED sharp_action_positions row each cycle.
  const clvLedger = buildClvLedgerFromPositions(positions, { since: CLV_HIST_FROM });
  console.log(`  → CLV ledger: ${clvLedger.size} wallets · ${[...clvLedger.values()].reduce((n, a) => n + a.length, 0)} events`);

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
    profiles[walletShort] = buildProfile(
      walletShort, pickBets, posBets, clvLedger, avgByShort.get(walletShort) ?? null,
    );
  }

  // CLV skill coverage — must stay high; this feeds TAPE + live cards.
  const clvScored = Object.values(profiles).filter((p) => Number.isFinite(p.clvSkill?.pctPos));
  const clvAvg = clvScored.length
    ? clvScored.reduce((s, p) => s + p.clvSkill.pctPos, 0) / clvScored.length
    : null;
  console.log(
    `CLV skill (beats the close): ${clvScored.length}/${Object.keys(profiles).length} wallets scored`
    + (clvAvg != null ? ` · mean pctPos ${clvAvg.toFixed(1)}%` : '')
    + ` · minN=${CLV_SKILL_MIN_N} since ${CLV_HIST_FROM}`,
  );

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
  const profilesGeneratedAt = new Date().toISOString();
  writeFileSync(jsonPath, JSON.stringify({
    generatedAt: profilesGeneratedAt,
    v8Cutover: V8_CUTOVER,
    whitelistVersion: WHITELIST_VERSION,
    totals: {
      wallets: Object.keys(profiles).length,
      walletBets: walletBets.length,
      positions: positions.length,
      clvSkillScored: clvScored.length,
      clvSkillMeanPctPos: clvAvg != null ? +clvAvg.toFixed(1) : null,
      clvHistFrom: CLV_HIST_FROM,
      clvSkillMinN: CLV_SKILL_MIN_N,
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
  out.push(`> **Promotion policy (v${WHITELIST_VERSION}, continuous gate)**: rebuilt every 2h via \`grade-sharp-actions\`. Tier = CONFIRMED if flat-positive in either source AND (lifetime $-positive in B **or** recent-dollar rescue: last-${RECENT_DOLLAR_RESCUE_DAYS}d Action n≥${RECENT_DOLLAR_RESCUE_MIN_N} with $ ROI>0, lifetime pos n≥${RECENT_DOLLAR_RESCUE_POS_MIN_N}, CLV n≥${RECENT_DOLLAR_RESCUE_CLV_MIN_N} & pct≥${RECENT_DOLLAR_RESCUE_CLV_MIN_PCT}); **or** size-skill rescue ($ up / flat down, own-median size-up WR lift ≥ +${SIZE_SKILL_WR_LIFT_MIN}pp, high-band n≥${SIZE_SKILL_BAND_MIN_N} WR≥${SIZE_SKILL_HIGH_WR_MIN}% $+ , sport pos n≥${SIZE_SKILL_SPORT_POS_MIN_N} $ROI≥${SIZE_SKILL_SPORT_DOLLAR_ROI_MIN}% — live Proven/Action only at sizeRatio≥${SIZE_SKILL_LIVE_MIN}); FLAT if flat-positive in either source; WR50 if WR ≥ 50% in either source. Source A min ${WHITELIST_MIN_BETS} bets, Source-B-only min ${B_ONLY_MIN_BETS} bets. \`whitelistRescue\` ∈ {recent-dollar-30d, size-skill}. Roll-back: \`RECENT_DOLLAR_RESCUE_MIN_N = Infinity\`, \`SIZE_SKILL_BAND_MIN_N = Infinity\`, or \`B_ONLY_MIN_BETS = Infinity\`.`);
  out.push('');
  out.push(`> **TAPE / beats-the-close**: every profile carries \`clvSkill.pctPos\` — causal % of graded positions with CLV > 0 since ${CLV_HIST_FROM} (min n=${CLV_SKILL_MIN_N}). Same definition as \`walletClvSkill.js\` / netCLV. Rebuilt every cycle. Coverage this run: **${clvScored.length}/${Object.keys(profiles).length}** wallets scored${clvAvg != null ? ` · mean **${clvAvg.toFixed(1)}%**` : ''}.`);
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
  out.push('  "sizeRatioBands": { "usual": 3300, "positions": { bands: { light|lean|full|press } }, "picks": {…} },');
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

  // Causal %+CLV skill — TAPE input, rebuilt every cycle
  sum.push('## Causal %+CLV skill (beats the close) — TAPE input');
  sum.push('');
  sum.push(`Definition: \`causalPctPos\` from \`src/lib/walletClvSkill.js\` — % of graded positions since **${CLV_HIST_FROM}** with CLV > 0, requiring ≥ **${CLV_SKILL_MIN_N}** events. Stored on every profile as \`clvSkill\` and upserted to \`sharpWalletProfiles\` each \`grade-sharp-actions\` run.`);
  sum.push('');
  sum.push(`**Coverage:** ${clvScored.length} / ${list.length} wallets scored${clvAvg != null ? ` · mean pctPos **${clvAvg.toFixed(1)}%**` : ''}.`);
  sum.push('');
  const clvTop = [...clvScored]
    .sort((a, b) => (b.clvSkill.pctPos - a.clvSkill.pctPos) || (b.clvSkill.n - a.clvSkill.n))
    .slice(0, 15);
  if (clvTop.length) {
    sum.push('| # | Wallet | Beats close % | n (CLV grades) | nPos | Verdict |');
    sum.push('|---|---|---|---|---|---|');
    clvTop.forEach((p, i) => {
      sum.push(`| ${i + 1} | ${p.walletShort} | ${p.clvSkill.pctPos}% | ${p.clvSkill.n} | ${p.clvSkill.nPos ?? '—'} | ${p.verdict} |`);
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

  // ── CLV ledger artefact (local + optional Firestore) ─────────────
  // Stored as ledgerJson string (Firestore bans nested arrays). ~0.5MB today.
  const ledgerPayload = serializeClvLedger(clvLedger, { since: CLV_HIST_FROM });
  const ledgerPath = join(dataDir, 'clv-skill-ledger.json');
  writeFileSync(ledgerPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    version: ledgerPayload.version,
    since: ledgerPayload.since,
    walletCount: ledgerPayload.walletCount,
    eventCount: ledgerPayload.eventCount,
    ledgerJson: ledgerPayload.ledgerJson,
  }));
  console.log(`Wrote ${ledgerPath} (${ledgerPayload.walletCount} wallets, ${ledgerPayload.eventCount} events, ${ledgerPayload.ledgerJson.length} bytes)`);

  if (WRITE_CLV_LEDGER) {
    console.log(`Writing ${CLV_LEDGER_COLLECTION}/${CLV_LEDGER_DOC_ID}…`);
    await db.collection(CLV_LEDGER_COLLECTION).doc(CLV_LEDGER_DOC_ID).set({
      ...ledgerPayload,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✓ CLV skill ledger cached (${ledgerPayload.eventCount} events → 1 doc for syncPickState)`);
  }

  // ── Optional Firebase sync ───────────────────────────────────────
  if (WRITE_FB) {
    console.log(`Upserting ${Object.keys(profiles).length} profiles to Firestore collection \`${TARGET_COLLECTION}\`…`);
    let batch = db.batch();
    let count = 0;
    let batchOps = 0;
    for (const [walletShort, p] of Object.entries(profiles)) {
      const ref = db.collection(TARGET_COLLECTION).doc(walletShort);
      batch.set(ref, {
        ...p,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      count++;
      batchOps++;
      if (batchOps >= 400) {
        await batch.commit();
        console.log(`  → committed ${count}`);
        batch = db.batch();
        batchOps = 0;
      }
    }
    if (batchOps > 0) await batch.commit();
    console.log(`✓ Upserted ${count} wallet profiles.`);

    // Tiny meta doc — sync/writeSharpActions compare this (1 read) to the
    // checkout JSON so a failed git push still forces a Firestore reload.
    await db.collection(WALLET_PROFILES_META_COLLECTION).doc(WALLET_PROFILES_META_DOC_ID).set({
      generatedAt: profilesGeneratedAt,
      walletCount: count,
      whitelistVersion: WHITELIST_VERSION,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`✓ Wrote ${WALLET_PROFILES_META_COLLECTION}/${WALLET_PROFILES_META_DOC_ID}`);
  } else if (!WRITE_CLV_LEDGER) {
    console.log('\n(Dry run — pass --write-firebase or --write-clv-ledger to push to Firestore.)');
  }

  process.exit(0);
})();
