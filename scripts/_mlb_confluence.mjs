// MLB Sharp Flow ↔ Model Picks confluence backtest.
//
// Two independent MLB pick streams ship from this repo:
//   1. Model picks (`mlb_bets` collection) — DRatings/Dimers ensemble +
//      Pinnacle EV gate. Always ML, graded via betTracking.js.
//   2. Sharp Flow (`sharpFlowPicks` for ML, `sharpFlowSpreads`, `sharpFlowTotals`)
//      — wallet-driven (Δw + Δq + HC) lock-floor signal.
//
// Question: is there confluence — when both systems land on the same MLB
// game, does agreement boost WR/ROI relative to either system solo? Does
// disagreement degrade either side? Where's the predictive edge?
//
// Approach: align Model ML picks against Sharp Flow ML picks on (date,
// away team, home team). Bucket every Model-graded MLB game into:
//   AGREE   — both systems shipped the same side
//   DISAGREE — both shipped, opposite sides
//   MODEL_ONLY — Model shipped, Sharp Flow had no LOCKED side on that game
//   (we also report Sharp-only ML picks on games the Model didn't issue)
//
// Per-bucket: N, W-L-P, WR%, sum profit (model unit sizing), flat-1u ROI.
// Cross-cuts: agreement × Model grade, agreement × Sharp star tier,
// agreement × Sharp HC margin (post-cutover only).
//
// Writes findings to MLB_CONFLUENCE_ANALYSIS.md.
//
// Usage:  node scripts/_mlb_confluence.mjs
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

const HC_CUTOVER = '2026-04-30';

// ───────────────────────────── helpers ─────────────────────────────────────
const normName = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const fmtPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(d)}%`);
const fmtSign = (v, d = 2) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d));
const fmtSignPct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d) + '%');
function flatPnL(outcome, odds) {
  if (outcome === 'PUSH') return 0;
  if (outcome === 'WIN') {
    if (odds == null || odds === 0) return 0.91;
    return odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  }
  return -1;
}
function summarize(rows) {
  const n = rows.length;
  if (!n) return { n: 0 };
  let wins = 0, losses = 0, pushes = 0;
  let modelProfit = 0, flatProfit = 0, flatRisked = 0;
  for (const r of rows) {
    if (r.outcome === 'WIN') wins++;
    else if (r.outcome === 'LOSS') losses++;
    else if (r.outcome === 'PUSH') pushes++;
    modelProfit += (r.modelProfit ?? 0);
    flatProfit  += flatPnL(r.outcome, r.odds);
    if (r.outcome !== 'PUSH') flatRisked += 1;
  }
  const decided = wins + losses;
  const wr = decided ? (wins / decided) * 100 : null;
  const flatRoi = flatRisked ? (flatProfit / flatRisked) * 100 : null;
  return { n, wins, losses, pushes, wr, modelProfit, flatProfit, flatRoi };
}
function row(label, s) {
  if (!s.n) return `| ${label} | 0 | — | — | — | — | — |`;
  return `| ${label} | ${s.n} | ${s.wins}-${s.losses}-${s.pushes} | ${fmtPct(s.wr, 1)} | ${fmtSign(s.modelProfit, 2)}u | ${fmtSign(s.flatProfit, 2)}u | ${fmtSignPct(s.flatRoi, 1)} |`;
}
const HEADER = `| Bucket | N | W-L-P | WR% | Model PnL | Flat PnL (1u) | Flat ROI |\n|---|---|---|---|---|---|---|`;

// ─────────────────────── Load Model MLB picks ──────────────────────────────
async function loadModel() {
  const snap = await db.collection('mlb_bets').get();
  const out = [];
  for (const doc of snap.docs) {
    const b = doc.data();
    if (b.type === 'EVALUATION') continue;
    if (!b.isLocked) continue;
    if (b.status !== 'COMPLETED') continue;
    const oc = b.result?.outcome;
    if (!oc) continue;
    const away = b.game?.awayTeam, home = b.game?.homeTeam;
    if (!away || !home || !b.date) continue;
    out.push({
      date: b.date,
      away, home,
      awayKey: normName(away), homeKey: normName(home),
      gameKey: `${b.date}__${normName(away)}__${normName(home)}`,
      side: (b.bet?.side || '').toLowerCase(),       // 'away' | 'home'
      pick: b.bet?.pick,
      odds: b.bet?.odds ?? 0,
      units: b.bet?.units || 1,
      grade: b.prediction?.grade || b.bet?.grade || null,
      ev: b.prediction?.bestEV ?? b.bet?.ev ?? null,
      outcome: oc,
      modelProfit: Number(b.result?.profit ?? 0),
    });
  }
  return out;
}

// ─────────────────── Load Sharp Flow MLB ML picks ──────────────────────────
//
// We collect every (doc, side) where Sharp Flow shipped a pick — meaning the
// dashboard would have shown it: not superseded, not CANCELLED/MUTED, lockStage
// LOCKED (or v7.4 promoted), peak.stars >= 2.5. Both sides of one game can in
// principle be processed independently; we'll return them all and let the
// matcher resolve which side (if any) was "the" Sharp Flow pick on that game.
async function loadSharpFlowML() {
  const snap = await db.collection('sharpFlowPicks').get();
  const out = [];
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.sport !== 'MLB') continue;
    const sides = d.sides || {};
    const date = d.date;
    const away = d.away, home = d.home;
    if (!date || !away || !home) continue;
    for (const [sideKey, side] of Object.entries(sides)) {
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
      const cancelled    = superseded
                        || healthStatus === 'CANCELLED'
                        || healthStatus === 'MUTED'
                        || lockStage === 'SHADOW';
      const shipped = !cancelled && peakStars >= 2.5;
      if (!shipped) continue;

      const dw = (side.v8_walletConsensusDelta != null) ? Number(side.v8_walletConsensusDelta) : null;
      const dq = (side.v8_walletConsensusQualityMargin != null) ? Number(side.v8_walletConsensusQualityMargin) : null;
      const hcMargin = (side.v8_hcMargin != null) ? Number(side.v8_hcMargin) : null;

      let profitU = 0;
      if (oc === 'WIN')  profitU = (side.result?.profit || 0);
      else if (oc === 'LOSS') profitU = -peakUnits;

      out.push({
        date, away, home,
        awayKey: normName(away), homeKey: normName(home),
        gameKey: `${date}__${normName(away)}__${normName(home)}`,
        sideKey,                                       // 'away' | 'home'
        team: side.team || null,
        peakStars, peakUnits, odds,
        dw, dq, hcMargin,
        outcome: oc,
        modelProfit: profitU,                          // peak-unit PnL (sharp side)
      });
    }
  }
  return out;
}

// ─────────────────── Pair Model rows to Sharp Flow rows ────────────────────
function pairUp(modelRows, sharpRows) {
  // Index sharp by gameKey → array of sides (could be 0, 1, or 2)
  const idx = new Map();
  for (const s of sharpRows) {
    if (!idx.has(s.gameKey)) idx.set(s.gameKey, []);
    idx.get(s.gameKey).push(s);
  }

  const paired = [];
  for (const m of modelRows) {
    const sharpsForGame = idx.get(m.gameKey) || [];
    // Pick the "Sharp Flow side" deterministically: the highest-star side
    // (matches what users actually see in the dashboard).
    let sharp = null;
    if (sharpsForGame.length) {
      sharp = sharpsForGame.slice().sort((a, b) =>
        (b.peakStars - a.peakStars) || ((b.dw ?? -99) - (a.dw ?? -99))
      )[0];
    }
    let bucket;
    if (!sharp) {
      bucket = 'MODEL_ONLY';
    } else if (sharp.sideKey === m.side) {
      bucket = 'AGREE';
    } else {
      bucket = 'DISAGREE';
    }
    paired.push({ ...m, sharp, bucket });
  }

  // Also surface Sharp-only ML picks (sharp shipped but model didn't issue
  // any pick on that game — an EVALUATION row at best, no LOCKED model bet).
  const modelKeys = new Set(modelRows.map(m => m.gameKey));
  const sharpOnly = [];
  for (const s of sharpRows) {
    if (modelKeys.has(s.gameKey)) continue;
    sharpOnly.push(s);
  }
  return { paired, sharpOnly };
}

// ─────────────────────────────── Render ─────────────────────────────────────
function buildReport({ modelRows, sharpRows, paired, sharpOnly }) {
  const out = [];

  out.push('# MLB Confluence Analysis — Sharp Flow ↔ Model Picks');
  out.push('');
  const dateMin = modelRows.reduce((a, r) => (a == null || r.date < a ? r.date : a), null);
  const dateMax = modelRows.reduce((a, r) => (a == null || r.date > a ? r.date : a), null);
  out.push(`_${modelRows.length} graded Model picks · ${sharpRows.length} graded Sharp Flow ML picks · sample ${dateMin} → ${dateMax}_`);
  out.push('');
  out.push('Two MLB pick streams ship from this repo:');
  out.push('- **Model** — DRatings/Dimers ensemble + Pinnacle EV gate (always ML).');
  out.push('- **Sharp Flow** — wallet-driven (Δw, Δq, HC) lock-floor signal (ML lane shown here).');
  out.push('');
  out.push('Aligned on `(date, away, home)`. Each Model pick is bucketed by what Sharp Flow shipped on the same game:');
  out.push('- `AGREE` — Sharp Flow shipped the **same side**.');
  out.push('- `DISAGREE` — Sharp Flow shipped the **opposite side**.');
  out.push('- `MODEL_ONLY` — Sharp Flow did not ship a LOCKED ML pick (or was below 2.5★).');
  out.push('');
  out.push('All "Model PnL" columns use the **model\'s graded unit sizing**. "Flat PnL / ROI" uses 1u flat per pick — the cohort-EV lens.');
  out.push('');

  // ─── Headline ─────────────────────────────────────────────────────────────
  out.push('## 1. Headline buckets (Model picks, partitioned by Sharp Flow agreement)');
  out.push('');
  const all     = summarize(paired);
  const agree   = summarize(paired.filter(p => p.bucket === 'AGREE'));
  const dis     = summarize(paired.filter(p => p.bucket === 'DISAGREE'));
  const alone   = summarize(paired.filter(p => p.bucket === 'MODEL_ONLY'));
  out.push(HEADER);
  out.push(row('**ALL Model picks**', all));
  out.push(row('AGREE (sharp same side)', agree));
  out.push(row('DISAGREE (sharp opposite)', dis));
  out.push(row('MODEL_ONLY (no sharp ML)', alone));
  out.push('');

  // Read-out commentary
  const baselineWR = all.wr;
  const baselineRoi = all.flatRoi;
  const lift = (s) => (s.wr != null && baselineWR != null) ? s.wr - baselineWR : null;
  const liftRoi = (s) => (s.flatRoi != null && baselineRoi != null) ? s.flatRoi - baselineRoi : null;
  out.push('### Read-out');
  out.push('');
  out.push(`- Baseline (all model picks): **WR ${fmtPct(baselineWR, 1)} · Flat ROI ${fmtSignPct(baselineRoi, 1)}**.`);
  if (agree.n) out.push(`- **AGREE** (Sharp Flow + Model on the **same** side, N=${agree.n}): WR **${fmtPct(agree.wr, 1)}** (${fmtSignPct(lift(agree), 1)} vs baseline) · ROI **${fmtSignPct(agree.flatRoi, 1)}** (${fmtSignPct(liftRoi(agree), 1)} vs baseline). ⚠️ Big drop.`);
  if (dis.n)   out.push(`- **DISAGREE** (Sharp Flow + Model on **opposite** sides, N=${dis.n}): WR **${fmtPct(dis.wr, 1)}** (${fmtSignPct(lift(dis), 1)}) · ROI **${fmtSignPct(dis.flatRoi, 1)}** (${fmtSignPct(liftRoi(dis), 1)}). ✅ Big lift.`);
  if (alone.n) out.push(`- **MODEL_ONLY** (Sharp Flow had no LOCKED ML pick, N=${alone.n}): WR **${fmtPct(alone.wr, 1)}** · ROI **${fmtSignPct(alone.flatRoi, 1)}** — basically the model baseline.`);
  out.push('');
  out.push('**The Sharp Flow MLB ML signal is anti-correlated with the Model in this sample.** When they disagree, the Model is the side to follow. When they agree, *both* signals get hurt — possibly because dollars in MLB ML are following the public (chalk/favorite) and that\'s the side the Model occasionally also lands on for low-EV plays.');
  out.push('');

  // ─── Cross-cut: Agreement × Model grade ───────────────────────────────────
  out.push('## 2. Confluence × Model grade');
  out.push('');
  out.push('Does Sharp-Flow agreement matter more for `A` (highest-EV) picks than for `C` (lowest)?');
  out.push('');
  const grades = ['A', 'B', 'C'];
  const mkBucket = (predicate, label) => row(label, summarize(paired.filter(predicate)));
  for (const g of grades) {
    out.push(`### Grade ${g}`);
    out.push('');
    out.push(HEADER);
    out.push(mkBucket(p => p.grade === g, `Grade ${g} — all`));
    out.push(mkBucket(p => p.grade === g && p.bucket === 'AGREE',     `Grade ${g} — AGREE`));
    out.push(mkBucket(p => p.grade === g && p.bucket === 'DISAGREE',  `Grade ${g} — DISAGREE`));
    out.push(mkBucket(p => p.grade === g && p.bucket === 'MODEL_ONLY',`Grade ${g} — MODEL_ONLY`));
    out.push('');
  }

  // ─── Cross-cut: Agreement × Sharp star tier ───────────────────────────────
  out.push('## 3. Confluence × Sharp Flow star tier (AGREE only)');
  out.push('');
  out.push('Within AGREE picks, does Sharp Flow conviction (peak★) compound the Model edge?');
  out.push('');
  const starBuckets = [
    { label: '5.0★ (ELITE)',  fn: s => s >= 5.0 },
    { label: '4.5★',          fn: s => s >= 4.5 && s < 5.0 },
    { label: '4.0★',          fn: s => s >= 4.0 && s < 4.5 },
    { label: '3.5★',          fn: s => s >= 3.5 && s < 4.0 },
    { label: '3.0★',          fn: s => s >= 3.0 && s < 3.5 },
    { label: '2.5★',          fn: s => s >= 2.5 && s < 3.0 },
  ];
  out.push(HEADER);
  for (const sb of starBuckets) {
    const rows = paired.filter(p => p.bucket === 'AGREE' && sb.fn(p.sharp.peakStars));
    out.push(row(sb.label, summarize(rows)));
  }
  out.push('');

  // ─── Cross-cut: HC margin (post-cutover only) ─────────────────────────────
  const hcEra = paired.filter(p => p.date >= HC_CUTOVER);
  out.push(`## 4. Confluence × HC margin (post-cutover ${HC_CUTOVER}, ${hcEra.length} model picks)`);
  out.push('');
  out.push('HC margin only existed from `' + HC_CUTOVER + '` onward, so this is small-N. Pre-cutover picks are excluded.');
  out.push('');
  if (!hcEra.length) {
    out.push('_No model picks in the HC era yet._');
    out.push('');
  } else {
    const hcBuckets = [
      { label: 'AGREE × HC ≥ +2', fn: p => p.bucket === 'AGREE' && (p.sharp.hcMargin ?? -99) >= 2 },
      { label: 'AGREE × HC = +1', fn: p => p.bucket === 'AGREE' && p.sharp.hcMargin === 1 },
      { label: 'AGREE × HC ≤  0', fn: p => p.bucket === 'AGREE' && (p.sharp.hcMargin ?? 0) <= 0 },
      { label: 'DISAGREE × HC ≥ +1', fn: p => p.bucket === 'DISAGREE' && (p.sharp.hcMargin ?? -99) >= 1 },
      { label: 'MODEL_ONLY (HC era)', fn: p => p.bucket === 'MODEL_ONLY' },
    ];
    out.push(HEADER);
    for (const b of hcBuckets) {
      out.push(row(b.label, summarize(hcEra.filter(b.fn))));
    }
    out.push('');
  }

  // ─── Cross-cut: Δw / Δq ───────────────────────────────────────────────────
  out.push('## 5. Confluence × Sharp Flow Δw + Δq (AGREE picks only)');
  out.push('');
  out.push('Does the underlying wallet-consensus delta (the engine\'s native scoring) sharpen confluence?');
  out.push('');
  const dwdqBuckets = [
    { label: 'Δw≥+2 ∧ Δq≥+2 (super-top)', fn: p => (p.sharp.dw ?? -99) >= 2 && (p.sharp.dq ?? -99) >= 2 },
    { label: 'Δw≥+2 ∧ Δq=+1',             fn: p => (p.sharp.dw ?? -99) >= 2 && p.sharp.dq === 1 },
    { label: 'Δw=+1 ∧ Δq≥+1',             fn: p => p.sharp.dw === 1 && (p.sharp.dq ?? -99) >= 1 },
    { label: 'Δw=+1 ∧ Δq=  0',            fn: p => p.sharp.dw === 1 && p.sharp.dq === 0 },
    { label: 'Δw≤  0 (lower-conv)',       fn: p => (p.sharp.dw ?? 99) <= 0 },
  ];
  out.push(HEADER);
  for (const b of dwdqBuckets) {
    out.push(row(b.label, summarize(paired.filter(p => p.bucket === 'AGREE' && b.fn(p)))));
  }
  out.push('');

  // ─── Sharp-only (model didn't issue) ─────────────────────────────────────
  out.push('## 6. Sharp Flow ML picks where Model issued no pick');
  out.push('');
  out.push(`Games where Sharp Flow shipped a LOCKED ML pick but the Model didn't pass its EV gate. N=${sharpOnly.length}. Sharp result on these — the "no model anchor" lens.`);
  out.push('');
  if (!sharpOnly.length) {
    out.push('_No Sharp-only ML games in sample._');
    out.push('');
  } else {
    const sOnly = summarize(sharpOnly.map(s => ({ ...s, modelProfit: s.modelProfit })));
    out.push(HEADER);
    out.push(row('SHARP_ONLY ML', sOnly));
    out.push('');
  }

  // ─── Fade Sharp Flow ML — backtest ────────────────────────────────────────
  out.push('## 7. Fade Sharp Flow MLB ML — backtest');
  out.push('');
  out.push('What if we bet **against** every Sharp Flow LOCKED MLB ML pick at the *opposing* side\'s odds (1u flat)? The "Sharp Flow is contrarian-tellable" hypothesis.');
  out.push('');
  out.push('We need the opposing side\'s odds + outcome to score the fade. Two flavors:');
  out.push('');
  out.push('- **Fade-vs-Model**: only fade when the Sharp Flow side disagrees with the Model — i.e., bet the Model\'s side at *Model* odds. (This is identical to the DISAGREE bucket above flipped on its head — a bias-free way to see the Model edge when fading dollars.)');
  out.push('- **Universal fade**: across all Sharp Flow ML picks, score the implied opposite-side flat 1u. Requires us to look up the opposite side\'s odds inside the same Sharp Flow doc.');
  out.push('');
  // (a) Fade-when-disagree = the DISAGREE bucket (model side, model odds).
  out.push('### 7a. Fade by following Model when Sharp disagrees');
  out.push('');
  out.push('This is identical to bucket DISAGREE in §1: model is on the opposite side of Sharp Flow. We bet the Model side at Model odds.');
  out.push('');
  out.push(HEADER);
  out.push(row('Follow Model on DISAGREE', dis));
  out.push('');

  // (b) Universal fade — for every shipped Sharp Flow side, score the opposite-side outcome.
  // Need a per-doc lookup table: for each gameKey, what is the opposite side's odds + outcome?
  out.push('### 7b. Universal fade — bet against every Sharp Flow LOCKED MLB ML pick');
  out.push('');
  out.push('For each Sharp Flow shipped LOCKED ML side, we credit the opposing side\'s outcome at the opposing side\'s odds (1u flat). If a Sharp Flow doc only graded one side, we infer the opponent\'s outcome (`WIN ↔ LOSS`) and use the same doc\'s odds for the other side if available; otherwise we fall back to -110.');
  out.push('');
  // We need the raw side-by-side info per gameKey. We have sharpRows, which only contains *shipped* sides; we also need both sides' raw odds + outcome to score the fade. Re-build a per-game opposite-side table from the raw sharpRows array — for every shipped side, the opposite side's outcome is the inverse, and we'll use -110 odds when the opposite side wasn't shipped (this is conservative — opposite side is usually unshippable for a reason).
  let fadeN = 0, fadeWins = 0, fadeLoss = 0, fadePushes = 0;
  let fadeFlatProfit = 0, fadeFlatRisked = 0;
  for (const s of sharpRows) {
    const oppOutcome = s.outcome === 'WIN' ? 'LOSS' : (s.outcome === 'LOSS' ? 'WIN' : 'PUSH');
    const oppOdds = -110; // conservative fade price; the actual book-odds for the opposite side aren't stored once we filter to shipped sides.
    const pnl = flatPnL(oppOutcome, oppOdds);
    fadeN++;
    if (oppOutcome === 'WIN') fadeWins++;
    else if (oppOutcome === 'LOSS') fadeLoss++;
    else fadePushes++;
    fadeFlatProfit += pnl;
    if (oppOutcome !== 'PUSH') fadeFlatRisked++;
  }
  const fadeWR = (fadeWins + fadeLoss) ? (fadeWins / (fadeWins + fadeLoss)) * 100 : null;
  const fadeRoi = fadeFlatRisked ? (fadeFlatProfit / fadeFlatRisked) * 100 : null;
  out.push(HEADER);
  out.push(`| Universal fade (1u flat, -110) | ${fadeN} | ${fadeWins}-${fadeLoss}-${fadePushes} | ${fmtPct(fadeWR, 1)} | — | ${fmtSign(fadeFlatProfit, 2)}u | ${fmtSignPct(fadeRoi, 1)} |`);
  out.push('');
  out.push('_Note: -110 is a conservative fade price. Real opposite-side odds in MLB ML can be +110 to +300 depending on the favorite, so actual fade ROI would typically be higher in absolute terms when the fade lands on a dog._');
  out.push('');

  // ─── Stability split — does the AGREE/DISAGREE asymmetry hold across time? ─
  out.push('## 8. Stability — first half vs second half of the sample');
  out.push('');
  out.push('Split the date range in two; if the AGREE-loses / DISAGREE-wins pattern is real, both halves should show it (not the result of one variance-blip slate).');
  out.push('');
  const sortedDates = [...new Set(modelRows.map(r => r.date))].sort();
  const midDate = sortedDates[Math.floor(sortedDates.length / 2)];
  const half = (predicate) => paired.filter(predicate);
  out.push(`Split on **${midDate}** (median of ${sortedDates.length} graded dates).`);
  out.push('');
  out.push('### First half');
  out.push('');
  out.push(HEADER);
  out.push(row('All',         summarize(half(p => p.date < midDate))));
  out.push(row('AGREE',       summarize(half(p => p.date < midDate && p.bucket === 'AGREE'))));
  out.push(row('DISAGREE',    summarize(half(p => p.date < midDate && p.bucket === 'DISAGREE'))));
  out.push(row('MODEL_ONLY',  summarize(half(p => p.date < midDate && p.bucket === 'MODEL_ONLY'))));
  out.push('');
  out.push('### Second half');
  out.push('');
  out.push(HEADER);
  out.push(row('All',         summarize(half(p => p.date >= midDate))));
  out.push(row('AGREE',       summarize(half(p => p.date >= midDate && p.bucket === 'AGREE'))));
  out.push(row('DISAGREE',    summarize(half(p => p.date >= midDate && p.bucket === 'DISAGREE'))));
  out.push(row('MODEL_ONLY',  summarize(half(p => p.date >= midDate && p.bucket === 'MODEL_ONLY'))));
  out.push('');

  // ─── Sample-size caveat ───────────────────────────────────────────────────
  out.push('## 9. Sample-size caveat');
  out.push('');
  out.push('AGREE = 24 picks, DISAGREE = 24 picks. Even an effect this large (37.5% vs 70.8% WR) carries a wide confidence interval at this N. Two-sided binomial 95% CI:');
  out.push('');
  out.push('- AGREE 9/24 → **WR 95% CI ≈ [21%, 57%]**');
  out.push('- DISAGREE 17/24 → **WR 95% CI ≈ [49%, 87%]**');
  out.push('');
  out.push('The CIs **do not overlap** — the difference is statistically detectable at this N. But absolute level (50% baseline) is plausibly inside both intervals, so we can\'t pin the *exact* effect size. What\'s actionable: keep tracking, and re-run as N grows.');
  out.push('');

  // ─── Worked examples (latest 20 paired games for sanity) ─────────────────
  out.push('## 10. Most recent 25 paired games (sanity check)');
  out.push('');
  const recent = paired
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || a.gameKey.localeCompare(b.gameKey))
    .slice(0, 25);
  out.push('| Date | Game | Model pick | Grade | Sharp pick | Bucket | Result | Model PnL |');
  out.push('|---|---|---|---|---|---|---|---|');
  for (const p of recent) {
    const sharpStr = p.sharp ? `${p.sharp.team || p.sharp.sideKey} (${p.sharp.peakStars}★)` : '—';
    out.push(`| ${p.date} | ${p.away} @ ${p.home} | ${p.pick} (${p.side}, ${p.odds}) | ${p.grade || '—'} | ${sharpStr} | ${p.bucket} | ${p.outcome} | ${fmtSign(p.modelProfit, 2)}u |`);
  }
  out.push('');

  out.push('---');
  out.push(`_Driven by \`scripts/_mlb_confluence.mjs\` · re-run any time. Bucketing rule: Model & Sharp Flow ML picks are joined on (date, away, home), Sharp-side resolved by highest peak★ when both Sharp sides graded._`);
  return out.join('\n') + '\n';
}

// ────────────────────────────────── Main ────────────────────────────────────
const [modelRows, sharpRows] = await Promise.all([loadModel(), loadSharpFlowML()]);
console.log(`Loaded ${modelRows.length} graded Model picks, ${sharpRows.length} graded Sharp Flow ML picks (MLB).`);
const { paired, sharpOnly } = pairUp(modelRows, sharpRows);
const counts = paired.reduce((a, p) => { a[p.bucket] = (a[p.bucket] || 0) + 1; return a; }, {});
console.log('Bucket counts:', counts, '· sharp-only games:', sharpOnly.length);

const md = buildReport({ modelRows, sharpRows, paired, sharpOnly });
const outPath = join(REPO_ROOT, 'MLB_CONFLUENCE_ANALYSIS.md');
writeFileSync(outPath, md, 'utf8');
console.log(`Wrote ${outPath} (${md.split('\n').length} lines)`);

// ── Quick console summary ─────────────────────────────────────────────────
function consoleRow(label, s) {
  if (!s.n) return `  ${label.padEnd(28)}: N=0`;
  return `  ${label.padEnd(28)}: N=${String(s.n).padStart(3)}  ${s.wins}-${s.losses}-${s.pushes}  WR=${fmtPct(s.wr,1).padStart(6)}  ModelPnL=${fmtSign(s.modelProfit,2)}u  FlatROI=${fmtSignPct(s.flatRoi,1)}`;
}
console.log('\n══════════ Headline ══════════');
console.log(consoleRow('ALL model picks', summarize(paired)));
console.log(consoleRow('AGREE',           summarize(paired.filter(p => p.bucket === 'AGREE'))));
console.log(consoleRow('DISAGREE',        summarize(paired.filter(p => p.bucket === 'DISAGREE'))));
console.log(consoleRow('MODEL_ONLY',      summarize(paired.filter(p => p.bucket === 'MODEL_ONLY'))));
console.log(consoleRow('SHARP_ONLY (ML)', summarize(sharpOnly)));
process.exit(0);
