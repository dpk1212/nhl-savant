/**
 * backtestV8TwoFactor.js
 *
 * Phase 0 of the Sharp Intel Two-Factor Overhaul.
 *
 * Read-only backtest against graded V8 picks in:
 *   - sharpFlowPicks     (ML)
 *   - sharpFlowSpreads   (SPREAD)
 *   - sharpFlowTotals    (TOTAL)
 *
 * For every graded, non-superseded side we compute:
 *   Δ_winner  = unique whitelisted (CONFIRMED|FLAT) wallets on pick side
 *             − unique whitelisted wallets on the other side
 *   Δ_quality = wallets with contribution ≥ 30 on pick side
 *             − same on the other side
 *
 * Then we evaluate candidate floor rules (A–H) and report:
 *   N, W-L-P, WR%, Flat ROI%, unit P/L (flat 1u bets)
 *
 * We also produce:
 *   - 2-D heatmap across Δw × Δq buckets
 *   - Sport breakouts for the user-chosen floor candidates
 *
 * NO WRITES anywhere — this is a pure read / compute / print script.
 * Results are appended to V8_TWO_FACTOR_BACKTEST.md.
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sakPath = join(__dirname, '../serviceAccountKey.json');
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

const PICK_COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const QUALITY_CUT = 30; // T=30 contribution threshold (validated by V8 Contribution Edge report)

// ── Floor rule definitions ──────────────────────────────────────────────────
// Each rule takes { dw, dq, agW } and returns boolean (qualifies for lock).
const FLOORS = [
  { id: 'A', rule: 'Δw ≥ +2', test: ({ dw }) => dw >= 2 },
  { id: 'B', rule: 'Δw ≥ +2 OR (Δw ≥ +1 AND agW = 0)', test: ({ dw, agW }) => dw >= 2 || (dw >= 1 && agW === 0) },
  { id: 'C', rule: 'Δw ≥ +1 AND Δq ≥ +2', test: ({ dw, dq }) => dw >= 1 && dq >= 2 },
  { id: 'D', rule: '(Δw ≥ +1 AND Δq ≥ +2) OR Δw ≥ +2', test: ({ dw, dq }) => (dw >= 1 && dq >= 2) || dw >= 2 },
  { id: 'E', rule: 'Δw ≥ +2 AND Δq ≥ +1', test: ({ dw, dq }) => dw >= 2 && dq >= 1 },
  { id: 'F', rule: 'Δw ≥ +2 OR Δq ≥ +3', test: ({ dw, dq }) => dw >= 2 || dq >= 3 },
  { id: 'G', rule: 'Δw ≥ +1 AND Δq ≥ +1', test: ({ dw, dq }) => dw >= 1 && dq >= 1 },
  { id: 'H', rule: 'Δw ≥ +1 AND Δq ≥ +3', test: ({ dw, dq }) => dw >= 1 && dq >= 3 },
];

// ── Compute the two deltas from stored walletDetails + current profiles ─────
function computeDeltas(walletDetails, sideKey, sport, profiles) {
  if (!Array.isArray(walletDetails) || !sideKey) {
    return { dw: 0, dq: 0, forW: 0, agW: 0, qFor: 0, qAg: 0, hadDetails: false };
  }
  // Δ_winner: unique whitelisted wallets per side
  const forSet = new Set();
  const agSet = new Set();
  for (const d of walletDetails) {
    if (!d?.wallet || !d?.side) continue;
    const shortId = String(d.wallet).slice(-6);
    const tier = profiles.get(shortId)?.bySport?.[sport]?.whitelistTier;
    if (tier !== 'CONFIRMED' && tier !== 'FLAT') continue;
    if (d.side === sideKey) forSet.add(shortId);
    else agSet.add(shortId);
  }
  const forW = forSet.size;
  const agW = agSet.size;
  const dw = forW - agW;

  // Δ_quality: wallets with contribution >= 30 per side (not deduped — each
  // row in walletDetails is already per-wallet-per-side at the peak moment)
  let qFor = 0, qAg = 0;
  for (const d of walletDetails) {
    if ((d?.contribution ?? 0) < QUALITY_CUT) continue;
    if (d.side === sideKey) qFor++;
    else if (d.side) qAg++;
  }
  const dq = qFor - qAg;

  return { dw, dq, forW, agW, qFor, qAg, hadDetails: walletDetails.length > 0 };
}

// ── Per-side outcome extraction ─────────────────────────────────────────────
function extractOutcome(sideData) {
  const outcome = sideData?.result?.outcome || null;
  if (outcome !== 'WIN' && outcome !== 'LOSS' && outcome !== 'PUSH') return null;
  // We intentionally include picks that were MUTED / CANCELLED / SHADOW in the
  // original system, because we are redefining which picks should have been
  // locked. We do exclude superseded picks (side flipped — the original is
  // polluted).
  if (sideData.superseded) return null;
  const profit = sideData?.result?.profit ?? 0;
  // Approximate flat-1u P/L from outcome + odds if stored, else fall back to
  // stored profit normalized. For the backtest we use flat 1u: WIN @ odds
  // returns (profit / units) × 1u, but we don't always have clean units here.
  // Simplest and honest: flat 1u, use odds to derive if present.
  const odds = sideData?.lock?.lockOdds ?? sideData?.peak?.peakOdds ?? null;
  let flatProfit = 0;
  if (outcome === 'WIN') {
    if (odds != null) {
      flatProfit = odds >= 100 ? odds / 100 : 100 / Math.abs(odds);
    } else {
      flatProfit = 0.91; // default -110
    }
  } else if (outcome === 'LOSS') {
    flatProfit = -1.0;
  } // PUSH = 0
  return { outcome, storedProfit: profit, flatProfit, odds, units: sideData?.units || sideData?.lock?.units || 0 };
}

function bucket(v, min, max) {
  if (v <= min) return min;
  if (v >= max) return max;
  return v;
}

// ── Main ────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n=== V8 Two-Factor Floor Backtest ===\n');

  // Load whitelist profiles
  const profSnap = await db.collection('sharpWalletProfiles').get();
  const profiles = new Map();
  for (const d of profSnap.docs) profiles.set(d.id, d.data());
  console.log(`Loaded ${profiles.size} wallet profiles`);

  // Collect every graded side across the three collections
  const rows = []; // { mkt, sport, date, gameKey, sideKey, dw, dq, forW, agW, qFor, qAg, outcome, flatProfit, units, storedProfit }

  for (const [col, mkt] of PICK_COLS) {
    const snap = await db.collection(col).get();
    console.log(`${col}: ${snap.size} docs`);
    for (const doc of snap.docs) {
      const data = doc.data();
      const sport = data.sport;
      const date = data.date;
      const gameKey = doc.id;
      for (const [sideKey, side] of Object.entries(data.sides || {})) {
        const out = extractOutcome(side);
        if (!out) continue;
        const peak = side.peak || side.lock;
        const wd = peak?.v8Scoring?.walletDetails || [];
        if (!wd.length) continue;
        const { dw, dq, forW, agW, qFor, qAg, hadDetails } = computeDeltas(wd, sideKey, sport, profiles);
        if (!hadDetails) continue;
        rows.push({
          mkt, sport, date, gameKey, sideKey,
          dw, dq, forW, agW, qFor, qAg,
          outcome: out.outcome,
          flatProfit: out.flatProfit,
          storedProfit: out.storedProfit,
          odds: out.odds,
          units: out.units,
          originalLockStage: side.lockStage || 'UNKNOWN',
          originalHealth: side.health?.status || 'UNKNOWN',
          originalSuperseded: !!side.superseded,
        });
      }
    }
  }
  console.log(`\nCollected ${rows.length} graded, non-superseded sides with walletDetails.\n`);

  if (rows.length === 0) {
    console.error('No rows to backtest. Aborting.');
    process.exit(1);
  }

  // ── Sanity: Δw / Δq distributions ─────────────────────────────────────────
  const dwDist = new Map();
  const dqDist = new Map();
  for (const r of rows) {
    dwDist.set(r.dw, (dwDist.get(r.dw) || 0) + 1);
    dqDist.set(r.dq, (dqDist.get(r.dq) || 0) + 1);
  }
  const sortedDw = [...dwDist.entries()].sort((a, b) => a[0] - b[0]);
  const sortedDq = [...dqDist.entries()].sort((a, b) => a[0] - b[0]);
  console.log('Δ_winner distribution:');
  for (const [v, n] of sortedDw) console.log(`  Δw=${v >= 0 ? '+' : ''}${v}: ${n}`);
  console.log('\nΔ_quality distribution:');
  for (const [v, n] of sortedDq) console.log(`  Δq=${v >= 0 ? '+' : ''}${v}: ${n}`);

  // ── Evaluate each floor ──────────────────────────────────────────────────
  function evalCohort(cohort) {
    const n = cohort.length;
    const wins = cohort.filter(r => r.outcome === 'WIN').length;
    const losses = cohort.filter(r => r.outcome === 'LOSS').length;
    const pushes = cohort.filter(r => r.outcome === 'PUSH').length;
    const pnl = cohort.reduce((s, r) => s + (r.flatProfit || 0), 0);
    const wr = n === 0 ? 0 : (wins / (wins + losses || 1)) * 100;
    const roi = n === 0 ? 0 : (pnl / n) * 100;
    return { n, wins, losses, pushes, pnl, wr, roi };
  }

  console.log('\n──────────────────────────────────────────────────────────────');
  console.log('            FLOOR BACKTEST — OVERALL');
  console.log('──────────────────────────────────────────────────────────────');
  console.log('ID  Rule                                          N     W-L-P        WR%     ROI%    u P/L');
  const floorResults = [];
  for (const f of FLOORS) {
    const cohort = rows.filter(f.test);
    const r = evalCohort(cohort);
    floorResults.push({ ...f, ...r });
    console.log(
      `${f.id}   ${f.rule.padEnd(42)}  ${String(r.n).padStart(4)}  ${String(r.wins).padStart(3)}-${String(r.losses).padStart(3)}-${String(r.pushes).padStart(3)}   ${r.wr.toFixed(1).padStart(5)}   ${(r.roi >= 0 ? '+' : '') + r.roi.toFixed(1).padStart(5)}   ${(r.pnl >= 0 ? '+' : '') + r.pnl.toFixed(2).padStart(6)}u`
    );
  }

  // ── 2-D heatmap (Δw × Δq) ─────────────────────────────────────────────────
  console.log('\n──────────────────────────────────────────────────────────────');
  console.log('            2-D HEATMAP: W-L / WR% / ROI%  (Δw × Δq)');
  console.log('──────────────────────────────────────────────────────────────');
  const dwBuckets = [-3, -2, -1, 0, 1, 2, 3];
  const dqBuckets = [-3, -2, -1, 0, 1, 2, 3];
  const header = '        ' + dqBuckets.map(q => `Δq${q >= 0 ? '+' : ''}${q}`.padStart(10)).join('');
  console.log(header);
  for (const w of dwBuckets) {
    const label = `Δw${w >= 0 ? '+' : ''}${w}`.padEnd(8);
    const cells = dqBuckets.map(q => {
      const cohort = rows.filter(r => {
        const rw = w === 3 ? r.dw >= 3 : (w === -3 ? r.dw <= -3 : r.dw === w);
        const rq = q === 3 ? r.dq >= 3 : (q === -3 ? r.dq <= -3 : r.dq === q);
        return rw && rq;
      });
      if (cohort.length === 0) return '   .     '.padStart(10);
      const e = evalCohort(cohort);
      return `${e.wins}-${e.losses} ${e.wr.toFixed(0)}%`.padStart(10);
    });
    console.log(label + cells.join(''));
  }
  // ROI row per Δw × Δq
  console.log('\nROI% by cell (N≥3 only):');
  console.log(header);
  for (const w of dwBuckets) {
    const label = `Δw${w >= 0 ? '+' : ''}${w}`.padEnd(8);
    const cells = dqBuckets.map(q => {
      const cohort = rows.filter(r => {
        const rw = w === 3 ? r.dw >= 3 : (w === -3 ? r.dw <= -3 : r.dw === w);
        const rq = q === 3 ? r.dq >= 3 : (q === -3 ? r.dq <= -3 : r.dq === q);
        return rw && rq;
      });
      if (cohort.length < 3) return '   .     '.padStart(10);
      const e = evalCohort(cohort);
      return `${(e.roi >= 0 ? '+' : '') + e.roi.toFixed(0)}%`.padStart(10);
    });
    console.log(label + cells.join(''));
  }

  // ── Per-sport breakout for the top 4 candidate floors ────────────────────
  console.log('\n──────────────────────────────────────────────────────────────');
  console.log('            BY SPORT (candidates B / C / D / E)');
  console.log('──────────────────────────────────────────────────────────────');
  const sports = [...new Set(rows.map(r => r.sport))];
  for (const floorId of ['B', 'C', 'D', 'E']) {
    const f = FLOORS.find(x => x.id === floorId);
    console.log(`\n[${floorId}] ${f.rule}`);
    console.log('  sport   N     W-L-P       WR%     ROI%    u P/L');
    for (const sp of sports) {
      const cohort = rows.filter(r => r.sport === sp && f.test(r));
      if (cohort.length === 0) { console.log(`  ${sp.padEnd(6)}    0`); continue; }
      const e = evalCohort(cohort);
      console.log(
        `  ${sp.padEnd(6)} ${String(e.n).padStart(3)}  ${String(e.wins).padStart(3)}-${String(e.losses).padStart(3)}-${String(e.pushes).padStart(3)}   ${e.wr.toFixed(1).padStart(5)}   ${(e.roi >= 0 ? '+' : '') + e.roi.toFixed(1).padStart(5)}   ${(e.pnl >= 0 ? '+' : '') + e.pnl.toFixed(2).padStart(6)}u`
      );
    }
  }

  // ── What volume gain/loss vs current locks? ──────────────────────────────
  const wasLocked = rows.filter(r => r.originalLockStage === 'LOCKED' && r.originalHealth !== 'MUTED' && r.originalHealth !== 'CANCELLED');
  console.log('\n──────────────────────────────────────────────────────────────');
  console.log('            VOLUME vs CURRENT SYSTEM');
  console.log('──────────────────────────────────────────────────────────────');
  const currentE = evalCohort(wasLocked);
  console.log(`Current live locks (ACTIVE at grade):  N=${currentE.n}  WR=${currentE.wr.toFixed(1)}%  ROI=${(currentE.roi >= 0 ? '+' : '') + currentE.roi.toFixed(1)}%  u P/L=${(currentE.pnl >= 0 ? '+' : '') + currentE.pnl.toFixed(2)}u`);
  console.log('');
  console.log('Floor vs current volume & edge:');
  for (const fr of floorResults) {
    const delta = fr.n - currentE.n;
    console.log(`  ${fr.id}:  N=${String(fr.n).padStart(4)} (${delta >= 0 ? '+' : ''}${delta})    WR=${fr.wr.toFixed(1)}%  (${(fr.wr - currentE.wr) >= 0 ? '+' : ''}${(fr.wr - currentE.wr).toFixed(1)})   ROI=${(fr.roi >= 0 ? '+' : '') + fr.roi.toFixed(1)}%  (${(fr.roi - currentE.roi) >= 0 ? '+' : ''}${(fr.roi - currentE.roi).toFixed(1)})`);
  }

  // ── Write report to V8_TWO_FACTOR_BACKTEST.md ────────────────────────────
  let md = '# V8 Two-Factor Floor Backtest\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `**Sample:** ${rows.length} graded, non-superseded sides across sharpFlowPicks / sharpFlowSpreads / sharpFlowTotals with walletDetails available.\n\n`;
  md += `**Whitelist source:** sharpWalletProfiles (current snapshot, ${profiles.size} profiles)\n\n`;
  md += `**Quality cut:** contribution ≥ ${QUALITY_CUT} (T=30)\n\n`;
  md += `**Notes:** Flat 1u P/L per pick. Outcomes come from side.result.outcome. Picks originally MUTED / CANCELLED / SHADOW are INCLUDED (we are redefining which picks should have been locked). Only superseded picks are excluded.\n\n`;

  md += '## Δ distributions\n\n';
  md += '| Δw | N |\n|---|---|\n';
  for (const [v, n] of sortedDw) md += `| ${v >= 0 ? '+' : ''}${v} | ${n} |\n`;
  md += '\n| Δq | N |\n|---|---|\n';
  for (const [v, n] of sortedDq) md += `| ${v >= 0 ? '+' : ''}${v} | ${n} |\n`;

  md += '\n## Floor candidates — overall\n\n';
  md += '| ID | Rule | N | W-L-P | WR% | ROI% | u P/L |\n';
  md += '|---|---|---|---|---|---|---|\n';
  for (const fr of floorResults) {
    md += `| ${fr.id} | \`${fr.rule}\` | ${fr.n} | ${fr.wins}-${fr.losses}-${fr.pushes} | ${fr.wr.toFixed(1)}% | ${fr.roi >= 0 ? '+' : ''}${fr.roi.toFixed(1)}% | ${fr.pnl >= 0 ? '+' : ''}${fr.pnl.toFixed(2)}u |\n`;
  }

  md += '\n## Volume & edge vs current live locks\n\n';
  md += `Current ACTIVE-at-grade lock cohort: **N=${currentE.n}, WR=${currentE.wr.toFixed(1)}%, ROI=${currentE.roi >= 0 ? '+' : ''}${currentE.roi.toFixed(1)}%, ${currentE.pnl >= 0 ? '+' : ''}${currentE.pnl.toFixed(2)}u**\n\n`;
  md += '| Floor | ΔN | ΔWR% | ΔROI% |\n|---|---|---|---|\n';
  for (const fr of floorResults) {
    md += `| ${fr.id} | ${fr.n - currentE.n >= 0 ? '+' : ''}${fr.n - currentE.n} | ${(fr.wr - currentE.wr) >= 0 ? '+' : ''}${(fr.wr - currentE.wr).toFixed(1)} | ${(fr.roi - currentE.roi) >= 0 ? '+' : ''}${(fr.roi - currentE.roi).toFixed(1)} |\n`;
  }

  md += '\n## 2-D heatmap — WR% (Δw × Δq)\n\n';
  md += '|       | ' + dqBuckets.map(q => `Δq${q >= 0 ? '+' : ''}${q}`).join(' | ') + ' |\n';
  md += '|---|' + dqBuckets.map(() => '---').join('|') + '|\n';
  for (const w of dwBuckets) {
    const row = [`**Δw${w >= 0 ? '+' : ''}${w}**`];
    for (const q of dqBuckets) {
      const cohort = rows.filter(r => {
        const rw = w === 3 ? r.dw >= 3 : (w === -3 ? r.dw <= -3 : r.dw === w);
        const rq = q === 3 ? r.dq >= 3 : (q === -3 ? r.dq <= -3 : r.dq === q);
        return rw && rq;
      });
      if (cohort.length === 0) row.push('—');
      else {
        const e = evalCohort(cohort);
        row.push(`${e.wins}-${e.losses} ${e.wr.toFixed(0)}%`);
      }
    }
    md += '| ' + row.join(' | ') + ' |\n';
  }

  md += '\n## 2-D heatmap — ROI% (Δw × Δq) — N ≥ 3 only\n\n';
  md += '|       | ' + dqBuckets.map(q => `Δq${q >= 0 ? '+' : ''}${q}`).join(' | ') + ' |\n';
  md += '|---|' + dqBuckets.map(() => '---').join('|') + '|\n';
  for (const w of dwBuckets) {
    const row = [`**Δw${w >= 0 ? '+' : ''}${w}**`];
    for (const q of dqBuckets) {
      const cohort = rows.filter(r => {
        const rw = w === 3 ? r.dw >= 3 : (w === -3 ? r.dw <= -3 : r.dw === w);
        const rq = q === 3 ? r.dq >= 3 : (q === -3 ? r.dq <= -3 : r.dq === q);
        return rw && rq;
      });
      if (cohort.length < 3) row.push('—');
      else {
        const e = evalCohort(cohort);
        row.push(`${e.roi >= 0 ? '+' : ''}${e.roi.toFixed(0)}%`);
      }
    }
    md += '| ' + row.join(' | ') + ' |\n';
  }

  md += '\n## By sport — candidates B / C / D / E\n\n';
  for (const floorId of ['B', 'C', 'D', 'E']) {
    const f = FLOORS.find(x => x.id === floorId);
    md += `### [${floorId}] \`${f.rule}\`\n\n`;
    md += '| Sport | N | W-L-P | WR% | ROI% | u P/L |\n|---|---|---|---|---|---|\n';
    for (const sp of sports) {
      const cohort = rows.filter(r => r.sport === sp && f.test(r));
      if (cohort.length === 0) { md += `| ${sp} | 0 | — | — | — | — |\n`; continue; }
      const e = evalCohort(cohort);
      md += `| ${sp} | ${e.n} | ${e.wins}-${e.losses}-${e.pushes} | ${e.wr.toFixed(1)}% | ${e.roi >= 0 ? '+' : ''}${e.roi.toFixed(1)}% | ${e.pnl >= 0 ? '+' : ''}${e.pnl.toFixed(2)}u |\n`;
    }
    md += '\n';
  }

  const outPath = join(REPO_ROOT, 'V8_TWO_FACTOR_BACKTEST.md');
  writeFileSync(outPath, md);
  console.log(`\nReport written: ${outPath}\n`);

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
