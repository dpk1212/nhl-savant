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

        pickRows.push({
          docId: doc.id, date, sport, market, sideKey,
          dwFrozen, dqFrozen, hcStamped,
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
          systemVersion: side.v8_systemVersion ?? null,
          promotedBy: side.promotedBy ?? null,
          v73HcRescue: !!side.v8_v73HcRescue,
        });
      }
    }
    return out;
  })).then(arrs => arrs.flat());
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

  console.log(`\nLoading today's LOCKED picks (${today})…`);
  const todayPicks = await loadTodayLocked(today, lens);
  if (!todayPicks.length) {
    console.log('No LOCKED picks for today.');
    process.exit(0);
  }

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
    pad('Cell ALL (Σ×HC)', 22) + ' | ' +
    pad(`Cell ${'<sport>'} (Σ×HC)`, 22) + ' | ' +
    pad('promotedBy', 18)
  );
  console.log('-'.repeat(170));
  todayPicks.forEach((p, i) => {
    const sportTag = `[${p.sport}]`;
    const pickStr = `${sportTag} ${p.market} ${p.team}`;
    const cellAllLbl   = fmtCell(p.cellAll);
    const cellSportLbl = fmtCell(p.cellSport);
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
    console.log(`         Historical evidence (${matrix.totalEligible} graded rows, v6+):`);
    console.log(`           • Cell  ALL · ${sb} ∧ ${hb}     :  ${fmtCell(p.cellAll)}`);
    console.log(`           • Cell  ${p.sport.padEnd(3)} · ${sb} ∧ ${hb}     :  ${fmtCell(p.cellSport)}`);
    console.log(`           • Σ band ALL · ${sb} (any HC)   :  ${fmtCell(p.bandSigmaAll)}`);
    console.log(`           • Σ band ${p.sport.padEnd(3)} · ${sb} (any HC)   :  ${fmtCell(p.bandSigmaSport)}`);
    console.log(`           • HC band ALL · ${hb} (any Σ)   :  ${fmtCell(p.bandHcAll)}`);
    console.log(`           • HC band ${p.sport.padEnd(3)} · ${hb} (any Σ)   :  ${fmtCell(p.bandHcSport)}`);
    if (p.v73HcRescue) console.log(`         · v7.3 RESCUED — HC margin overrode dw=0 / dq=0 / sum<3 mute (cohort: 11-2, +85% ROI, p=0.006)`);
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
      score: p.score,
      cellAll: p.cellAll, cellSport: p.cellSport,
      bandSigmaAll: p.bandSigmaAll, bandSigmaSport: p.bandSigmaSport,
      bandHcAll: p.bandHcAll, bandHcSport: p.bandHcSport,
    })),
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
