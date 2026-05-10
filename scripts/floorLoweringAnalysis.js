/**
 * floorLoweringAnalysis.js — should v7.0 lower its LOCK floor from
 * Σ ≥ +5 to Σ ≥ +4?
 *
 * The Σ = +4 cohort under v7.0 is currently LEAN (0u tracked, no badge,
 * no LOCK). Today's V6_FULL_ANALYSIS shows it goes 18p · 38.9% WR ·
 * −19.1% flat ROI on its own — clearly a loser at the cohort level.
 *
 * But "loser at the cohort level" isn't the question. The question is:
 *   — Is any sub-slice of Σ=+4 profitable enough to LOCK?
 *   — Could a single rescue gate (sport, regime, market, ΔbestRank,
 *     opposition) isolate a winning subset?
 *   — What does the combined floor look like at Σ ≥ +4 (with or
 *     without rescue gates)?
 *
 * Sections:
 *   §1. Σ=+4 decomposition          — by (Δw, Δq) cell, sport, market, regime
 *   §2. Rescue-gate candidates       — slice Σ=+4 by quality / opposition / context
 *   §3. Combined-floor projections   — what Σ ≥ +4 looks like under each rule
 *   §4. Per-day volume & PnL impact  — daily projection of lowering the floor
 *   §5. Verdict scaffolding
 *
 * Local-only — saves to FLOOR_LOWERING_ANALYSIS.md, no commit.
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const V6_CUTOVER = '2026-04-18';
const PICK_COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];
const QUALITY_CUT = 30;

const americanToDecimal = (o) => (o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o));
const flatProfit = (o, win) => (win ? americanToDecimal(o) - 1 : -1);
const sign = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (v >= 0 ? '+' : '') + v.toFixed(d);
const pct = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : v.toFixed(d) + '%';
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

// ── stats ─────────────────────────────────────────────────────────────
function mean(xs) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN; }
function stdev(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
}
function wilson(wins, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const p = wins / n;
  const denom = 1 + z * z / n;
  const center = (p + z * z / (2 * n)) / denom;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n) / denom;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
function tTestVsZero(xs) {
  const n = xs.length;
  if (n < 2) return { t: null, p: null, sig: false };
  const m = mean(xs);
  const s = stdev(xs);
  if (s === 0) return { t: null, p: null, sig: false };
  const t = m / (s / Math.sqrt(n));
  const p = 2 * (1 - normCdf(Math.abs(t)));
  return { t, p, sig: p < 0.05 };
}

// ── Per-pick aggregation from walletDetails (rank / quality / opposition) ──
function aggregateExtras(walletDetails, sideKey) {
  const out = {
    forW: 0, agW: 0,
    qFor: 0, qAg: 0,
    bestRank_for: null, bestRank_ag: null,
    sumBase_for: 0, sumBase_ag: 0,
  };
  if (!Array.isArray(walletDetails) || !sideKey) return out;
  for (const w of walletDetails) {
    if (!w?.side) continue;
    const isFor = w.side === sideKey;
    if (isFor) out.forW++; else out.agW++;
    const c = w.contribution ?? 0;
    if (c >= QUALITY_CUT) {
      if (isFor) out.qFor++; else out.qAg++;
    }
    const rank = (w.rank != null && Number.isFinite(w.rank)) ? Number(w.rank) : null;
    if (rank != null) {
      if (isFor) {
        if (out.bestRank_for == null || rank < out.bestRank_for) out.bestRank_for = rank;
      } else {
        if (out.bestRank_ag == null  || rank < out.bestRank_ag)  out.bestRank_ag = rank;
      }
    }
    const base = (w.walletBase != null && Number.isFinite(w.walletBase)) ? Number(w.walletBase) : 0;
    if (isFor) out.sumBase_for += base; else out.sumBase_ag += base;
  }
  out.dBestRank = (out.bestRank_ag ?? 999) - (out.bestRank_for ?? 999);
  out.dBase = out.sumBase_for - out.sumBase_ag;
  return out;
}

// ── Loader (mirrors v6FullAnalysis.js dashboard-truth filter) ─────────
async function loadPicks() {
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

        let dw = side.v8_walletConsensusDelta != null ? Number(side.v8_walletConsensusDelta) : null;
        let dq = side.v8_walletConsensusQualityMargin != null ? Number(side.v8_walletConsensusQualityMargin) : null;
        if (dq == null && Array.isArray(wd)) {
          let qf = 0, qa = 0;
          for (const w of wd) {
            if ((w?.contribution ?? 0) < QUALITY_CUT || !w?.side) continue;
            if (w.side === sideKey) qf++; else qa++;
          }
          dq = qf - qa;
        }
        if (dw == null || dq == null) continue;

        const extras = aggregateExtras(wd, sideKey);
        const regime = peak?.regime || null;

        const flat = odds != null ? flatProfit(odds, won === 1) : null;
        const peakPnl = won ? (peakUnits * (americanToDecimal(odds) - 1)) : -peakUnits;

        rows.push({
          date, sport, market, sideKey,
          dw, dq, sum: dw + dq,
          regime,
          ...extras,
          odds, won, peakUnits, peakPnl,
          flat: flat ?? 0,
        });
      }
    }
  }
  return rows;
}

function summarize(rows) {
  if (!rows.length) return { n: 0 };
  const wins = rows.filter(r => r.won === 1).length;
  const losses = rows.length - wins;
  const wr = (wins / rows.length) * 100;
  const flat = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flat / rows.length) * 100;
  const peak = rows.reduce((s, r) => s + r.peakPnl, 0);
  const [lo, hi] = wilson(wins, rows.length);
  const t = tTestVsZero(rows.map(r => r.flat));
  return { n: rows.length, wins, losses, wr, wrLo: lo * 100, wrHi: hi * 100, flat, flatRoi, peak, t: t.t, p: t.p, sig: t.sig };
}
function fmt(s) {
  if (!s || s.n === 0) return '—';
  const sigMark = s.sig ? ' ✓' : '';
  return `${s.n}p · ${s.wins}-${s.losses} · ${pct(s.wr)} · ${sign(s.flatRoi, 1)}%${sigMark}`;
}
function fmtFull(s) {
  if (!s || s.n === 0) return { n: 0, line: '0 | — | — | — | — | — | — |' };
  return {
    n: s.n,
    line: `${s.n} | ${pct(s.wr, 1)} (${pct(s.wrLo, 1)}–${pct(s.wrHi, 1)}) | ${sign(s.flatRoi, 1)}%${s.sig ? ' ✓' : ''} | ${sign(s.peak, 2)}u | ${s.t != null ? s.t.toFixed(2) : '—'} | ${s.p != null ? s.p.toFixed(3) : '—'}`,
  };
}

(async () => {
  console.log('Loading graded picks…');
  const all = await loadPicks();
  console.log(`  ${all.length} graded sides loaded.`);

  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const byDate = [...new Set(all.map(r => r.date))].sort();
  const dateMin = byDate[0];
  const dateMax = byDate[byDate.length - 1];

  // Cohorts
  const σ4 = all.filter(r => r.sum === 4 && r.dw >= 1 && r.dq >= 1);
  const σ5 = all.filter(r => r.sum === 5 && r.dw >= 1 && r.dq >= 1);
  const σ6plus = all.filter(r => r.sum >= 6 && r.dw >= 1 && r.dq >= 1);
  const v70Lock = all.filter(r => r.sum >= 5 && r.dw >= 1 && r.dq >= 1);
  const σ4plusLock = all.filter(r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1);

  out.push('# Floor-Lowering Analysis — Σ ≥ +4 vs Σ ≥ +5');
  out.push('');
  out.push(`Generated: ${nowET} ET · sample ${all.length} graded sides · ${dateMin} → ${dateMax} (${byDate.length} days)`);
  out.push('');
  out.push(`**Question.** Should we lower the v7.0 LOCK floor from \`Σ ≥ +5\` to \`Σ ≥ +4\`?  \nAt aggregate, Σ=+4 goes ${fmt(summarize(σ4))} — a clear loser. But that hides whether any sub-slice of Σ=+4 is rescuable. This report decomposes the cell completely and tests rescue gates.`);
  out.push('');
  out.push('**Inclusion mirrors live Pick Performance dashboard.** Stats convention: Wilson 95% CIs on WR. ✓ next to flat ROI = t-test against zero clears p < 0.05.');
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §1. Σ=+4 decomposition
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §1. Σ = +4 decomposition');
  out.push('');
  out.push(`Σ=+4 raw cohort: **${fmt(summarize(σ4))}**.  Reference cohorts:`);
  out.push(`- v7.0 LOCK baseline (Σ ≥ +5): **${fmt(summarize(v70Lock))}**`);
  out.push(`- Σ = +5 alone: ${fmt(summarize(σ5))}`);
  out.push(`- Σ ≥ +6 alone: ${fmt(summarize(σ6plus))}`);
  out.push(`- Combined Σ ≥ +4 (proposed new floor): **${fmt(summarize(σ4plusLock))}**`);
  out.push('');

  out.push('### §1a. By (Δw, Δq) cell — which Σ=+4 cells are which?');
  out.push('');
  out.push(mdHeader(['cell', '(Δw, Δq)', 'cohort']));
  for (const [dw, dq] of [[1,3], [2,2], [3,1]]) {
    const cell = σ4.filter(r => r.dw === dw && r.dq === dq);
    out.push(`| ${dw}/${dq} | (Δw=${dw}, Δq=${dq}) | ${fmt(summarize(cell))} |`);
  }
  out.push('');
  out.push('Reading: Σ=+4 is reachable via three cells. Their underlying mechanics differ — `Δw=+3 ∧ Δq=+1` is a high-winner-margin pick with thin quality, very different from `Δw=+1 ∧ Δq=+3` which is the inverse. If one cell is materially different from the others, that\'s a sign the Σ-only floor is lossy.');
  out.push('');

  out.push('### §1b. By sport');
  out.push('');
  out.push(mdHeader(['sport', 'cohort']));
  for (const sport of ['MLB', 'NBA', 'NHL']) {
    out.push(`| ${sport} | ${fmt(summarize(σ4.filter(r => r.sport === sport)))} |`);
  }
  out.push('');

  out.push('### §1c. By market');
  out.push('');
  out.push(mdHeader(['market', 'cohort']));
  for (const market of ['ML', 'SPREAD', 'TOTAL']) {
    out.push(`| ${market} | ${fmt(summarize(σ4.filter(r => r.market === market)))} |`);
  }
  out.push('');

  out.push('### §1d. By regime');
  out.push('');
  out.push(mdHeader(['regime', 'cohort']));
  const regimes = [...new Set(σ4.map(r => r.regime).filter(Boolean))].sort();
  for (const regime of regimes) {
    out.push(`| ${regime} | ${fmt(summarize(σ4.filter(r => r.regime === regime)))} |`);
  }
  out.push('');

  out.push('### §1e. By odds bucket');
  out.push('');
  out.push(mdHeader(['odds', 'cohort']));
  const oddsBuckets = [
    { label: '−400 or worse',   f: r => r.odds <= -400 },
    { label: '−200 to −151',    f: r => r.odds <= -151 && r.odds > -400 },
    { label: '−150 to −101',    f: r => r.odds <= -101 && r.odds > -151 },
    { label: '−100 to +120',    f: r => r.odds > -101 && r.odds <= 120 },
    { label: '+121 to +200',    f: r => r.odds > 120 && r.odds <= 200 },
    { label: '+201 or better',  f: r => r.odds > 200 },
  ];
  for (const b of oddsBuckets) {
    out.push(`| ${b.label} | ${fmt(summarize(σ4.filter(b.f)))} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §2. Rescue-gate candidates
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §2. Rescue-gate candidates inside Σ = +4');
  out.push('');
  out.push('Apply each gate to the Σ=+4 cohort. A useful rescue gate:  \n— keeps N ≥ 8 (otherwise too small to act on),  \n— lifts flat ROI above 0% (positive EV),  \n— ideally clears p < 0.05 (statistical noise filter).');
  out.push('');
  out.push(mdHeader(['Gate', 'N', 'WR (95% CI)', 'flat ROI', 'peak PnL', 't', 'p']));
  const gates = [
    { label: 'Σ=+4 (full, no gate)',                                                f: r => r.sum === 4 },
    { label: 'Σ=+4 ∧ ΔbestRank ≥ +10 (the v7.1 candidate)',                          f: r => r.sum === 4 && r.dBestRank >= 10 },
    { label: 'Σ=+4 ∧ ΔbestRank ≥ +50',                                              f: r => r.sum === 4 && r.dBestRank >= 50 },
    { label: 'Σ=+4 ∧ bestRank_for ≤ 25',                                            f: r => r.sum === 4 && r.bestRank_for != null && r.bestRank_for <= 25 },
    { label: 'Σ=+4 ∧ agW = 0 (no proven opposition)',                               f: r => r.sum === 4 && r.agW === 0 },
    { label: 'Σ=+4 ∧ qAg = 0 (no quality opposition)',                              f: r => r.sum === 4 && r.qAg === 0 },
    { label: 'Σ=+4 ∧ regime = CLEAR_MOVE',                                          f: r => r.sum === 4 && r.regime === 'CLEAR_MOVE' },
    { label: 'Σ=+4 ∧ regime ∈ {CLEAR_MOVE, NEAR_START}  (kill SMALL_MOVE bleeders)', f: r => r.sum === 4 && (r.regime === 'CLEAR_MOVE' || r.regime === 'NEAR_START') },
    { label: 'Σ=+4 ∧ market ∈ {ML, TOTAL}  (kill SPREAD bleeders)',                  f: r => r.sum === 4 && (r.market === 'ML' || r.market === 'TOTAL') },
    { label: 'Σ=+4 ∧ Δw = +3 (high winner margin only — Δw=+3 ∧ Δq=+1 cell)',         f: r => r.sum === 4 && r.dw === 3 },
    { label: 'Σ=+4 ∧ Δw = +2 (the middle cell — 2/2)',                                f: r => r.sum === 4 && r.dw === 2 },
    { label: 'Σ=+4 ∧ Δw = +1 ∧ Δq = +3 (high quality margin only)',                   f: r => r.sum === 4 && r.dw === 1 && r.dq === 3 },
    { label: 'Σ=+4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE',                         f: r => r.sum === 4 && r.dBestRank >= 10 && r.regime !== 'SMALL_MOVE' },
    { label: 'Σ=+4 ∧ ΔbestRank ≥ +10 ∧ market ∈ {ML, TOTAL}',                        f: r => r.sum === 4 && r.dBestRank >= 10 && (r.market === 'ML' || r.market === 'TOTAL') },
  ];
  for (const g of gates) {
    const s = summarize(all.filter(g.f));
    const f = fmtFull(s);
    out.push(`| ${g.label} | ${f.line} |`);
  }
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §3. Combined-floor projections
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §3. Combined-floor projections — what would each new floor LOOK like?');
  out.push('');
  out.push('Each row simulates a candidate v7.1 LOCK floor. The "vs v7.0" column compares against the current Σ ≥ +5 baseline.');
  out.push('');
  const baseS = summarize(v70Lock);

  out.push(mdHeader(['Floor', 'N', 'WR (95% CI)', 'flat ROI', 'peak PnL', 't', 'p', 'lift vs v7.0']));
  const floors = [
    { label: 'v7.0 baseline (Σ ≥ +5)',                                                              f: r => r.sum >= 5 && r.dw >= 1 && r.dq >= 1 },
    { label: 'Σ ≥ +4  (fully lower the floor — NO gate)',                                           f: r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1 },
    { label: 'Σ ≥ +4 ∧ ΔbestRank ≥ +10  (lower + v7.1 quality gate)',                              f: r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1 && r.dBestRank >= 10 },
    { label: 'Σ ≥ +4 ∧ regime ≠ SMALL_MOVE  (kill the SMALL_MOVE bleeder)',                          f: r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1 && r.regime !== 'SMALL_MOVE' },
    { label: 'Σ ≥ +4 ∧ market ≠ SPREAD',                                                            f: r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1 && r.market !== 'SPREAD' },
    { label: 'Σ ≥ +4 ∧ regime ≠ SMALL_MOVE ∧ market ≠ SPREAD',                                     f: r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1 && r.regime !== 'SMALL_MOVE' && r.market !== 'SPREAD' },
    { label: 'Σ ≥ +4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE',                                     f: r => r.sum >= 4 && r.dw >= 1 && r.dq >= 1 && r.dBestRank >= 10 && r.regime !== 'SMALL_MOVE' },
    { label: '"split floor": Σ ≥ +5 OR (Σ = +4 ∧ Δw = +3)  (only rescue 3/1 cell)',                  f: r => (r.sum >= 5 || (r.sum === 4 && r.dw === 3)) && r.dw >= 1 && r.dq >= 1 },
    { label: '"split floor": Σ ≥ +5 OR (Σ = +4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE)',           f: r => (r.sum >= 5 || (r.sum === 4 && r.dBestRank >= 10 && r.regime !== 'SMALL_MOVE')) && r.dw >= 1 && r.dq >= 1 },
  ];
  for (const fl of floors) {
    const slice = all.filter(fl.f);
    const s = summarize(slice);
    const lift = baseS.n ? s.flatRoi - baseS.flatRoi : 0;
    const f = fmtFull(s);
    out.push(`| ${fl.label} | ${f.line} | ${sign(lift, 1)}% |`);
  }
  out.push('');
  out.push(`Reading the table. v7.0 baseline is **N=${baseS.n} · ${pct(baseS.wr, 1)} WR · ${sign(baseS.flatRoi, 1)}% flat ROI**. A floor that adds N without crashing flat ROI is interesting; one that holds flat ROI roughly steady while bumping N is a real win. A floor that lifts ROI by gating Σ=+4 selectively (the "split floor" rows) is the most product-friendly option.`);
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §4. Per-day volume + PnL impact
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §4. Per-day volume / PnL impact of lowering the floor');
  out.push('');
  out.push('How many extra picks per day would land in LOCK if we lowered the floor, and what would they have produced? Flat-1u P&L is reported for the extra picks.');
  out.push('');
  out.push(mdHeader(['date', 'σ≥+5 N', 'σ≥+5 flat', 'extra σ=+4 N', 'extra σ=+4 flat', 'σ≥+4 (gated) N', 'σ≥+4 (gated) flat']));
  for (const date of byDate) {
    const day = all.filter(r => r.date === date && r.dw >= 1 && r.dq >= 1);
    const lock5 = day.filter(r => r.sum >= 5);
    const extra4 = day.filter(r => r.sum === 4);
    const gatedExtra = day.filter(r => r.sum === 4 && r.dBestRank >= 10 && r.regime !== 'SMALL_MOVE');

    const flat5 = lock5.reduce((s, r) => s + r.flat, 0);
    const flatExtra = extra4.reduce((s, r) => s + r.flat, 0);
    const gatedFlat = gatedExtra.reduce((s, r) => s + r.flat, 0);

    const lock4 = day.filter(r => r.sum >= 4 || (r.sum === 4 && r.dBestRank >= 10 && r.regime !== 'SMALL_MOVE'));
    const lock4Gated = lock5.length + gatedExtra.length;
    const flat4Gated = flat5 + gatedFlat;

    out.push(`| ${date} | ${lock5.length} | ${sign(flat5, 2)}u | ${extra4.length} | ${sign(flatExtra, 2)}u | ${lock4Gated} | ${sign(flat4Gated, 2)}u |`);
  }
  out.push('');
  out.push('"σ≥+4 (gated)" = `Σ ≥ +5 OR (Σ = +4 ∧ ΔbestRank ≥ +10 ∧ regime ≠ SMALL_MOVE)` — the most defensible split-floor candidate from §3.');
  out.push('');

  // ════════════════════════════════════════════════════════════════════
  // §5. Verdict scaffolding
  // ════════════════════════════════════════════════════════════════════
  out.push('---');
  out.push('## §5. Verdict scaffolding');
  out.push('');
  out.push('Read §1 + §2 first to know if any subset of Σ=+4 is rescuable, then §3 to compare candidate floors against the v7.0 baseline. Sanity rules:');
  out.push('');
  out.push('1. **Don\'t lower the floor unconditionally** if §3\'s `Σ ≥ +4 (no gate)` row drops flat ROI by more than 10pp vs v7.0 baseline — the volume gain isn\'t worth the ROI hit.');
  out.push('2. **Consider a split-floor (Σ ≥ +5 OR gated Σ=+4)** if §3\'s split rows hold flat ROI within 5pp of baseline AND add ≥ 5 picks. The gate must clear N ≥ 8 in §2 to be credible.');
  out.push('3. **Only act if §4 shows positive cumulative flat-1u PnL** on the extra picks across the sample. If the extras lose money in aggregate, the gate isn\'t doing its job.');
  out.push('4. If no candidate clears these bars, the conclusion is **keep Σ ≥ +5 LOCK; possibly tighten LEAN sizing to 0u**. The data isn\'t supporting volume expansion at this sample size.');
  out.push('');

  const outPath = join(__dirname, '..', 'FLOOR_LOWERING_ANALYSIS.md');
  writeFileSync(outPath, out.join('\n'));
  console.log(`\nReport written → ${outPath}`);
  console.log('');
  console.log('Key numbers:');
  console.log(`  Σ=+4 alone:       ${fmt(summarize(σ4))}`);
  console.log(`  Σ=+5 alone:       ${fmt(summarize(σ5))}`);
  console.log(`  Σ≥+6 alone:       ${fmt(summarize(σ6plus))}`);
  console.log(`  v7.0 LOCK (≥+5):  ${fmt(summarize(v70Lock))}`);
  console.log(`  Σ≥+4 (no gate):   ${fmt(summarize(σ4plusLock))}`);
  console.log('');
  console.log('Top floor candidates:');
  for (const fl of floors.slice(1)) {
    const s = summarize(all.filter(fl.f));
    console.log(`  ${fl.label.padEnd(80)} → ${fmt(s)}`);
  }

  process.exit(0);
})();
