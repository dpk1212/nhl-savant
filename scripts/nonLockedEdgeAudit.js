/**
 * nonLockedEdgeAudit.js — does the maxRoiN_F / meanBase_F edge hold up
 * in non-LOCKED picks, and should it become its own promotion path?
 *
 * Reads every V8-era side from sharpFlowPicks / Spreads / Totals, grades
 * using the stored outcome, and strafes the two confirmed-live continuous
 * edges across lockStage:
 *
 *    LOCKED    — baseline (what our production book is doing today)
 *    SHADOW    — tracked but not promoted; the pool we'd promote FROM
 *
 * Emits NONLOCKED_EDGE_AUDIT.md with:
 *   1. Edge-holds-up matrix (lockStage × maxRoi★ / meanBase★ / both)
 *   2. Counterfactual daily timeline: what if we'd also taken every SHADOW
 *      pick that hit the proposed edge filter?
 *   3. Intersection with existing promotion paths (regime, contribution)
 *      to make sure we're proposing something NEW, not a re-statement
 *   4. Live call-sheet: which currently-SHADOW sides on the board today
 *      would get promoted under the proposed elite-wallet path
 *   5. Concrete proposal + sample-size caveat
 *
 * Usage: node scripts/nonLockedEdgeAudit.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const V8_CUTOVER = '2026-04-18';
const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const americanToDecimal = (odds) => (odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds));
const flatProfit = (odds, won) => (won ? americanToDecimal(odds) - 1 : -1);
const sign = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d);
const mdHeader = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;

function classifyContribTier(qFor, qAg, margin, maxContribFor) {
  if (margin < 0) return 'MUTE';
  if ((qFor >= 3 && qAg === 0) || (qFor >= 2 && margin >= 1)) return 'STRONG';
  if (qFor >= 1 && margin >= 1 && maxContribFor >= 50) return 'STANDARD';
  return 'LEAN';
}

async function load() {
  const graded = [];
  const todaysOpen = [];                   // not yet graded, used for §4
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V8_CUTOVER).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      const sides = d.sides || {};
      for (const [sideKey, side] of Object.entries(sides)) {
        const peak = side.peak || side.lock;
        if (!peak) continue;
        const v8 = peak.v8Scoring || {};
        const wd = v8.walletDetails || [];
        const consensusSide = v8.consensusSide || sideKey;
        const forW = wd.filter(w => w.side === consensusSide);
        const agW = wd.filter(w => w.side && w.side !== consensusSide);
        const qFor50 = forW.filter(w => (w.contribution ?? 0) >= 50).length;
        const qAg50 = agW.filter(w => (w.contribution ?? 0) >= 50).length;
        const margin = qFor50 - qAg50;
        const maxContribFor = forW.reduce((m, w) => Math.max(m, w.contribution ?? 0), 0);
        const sumContribFor = forW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        const sumContribAg = agW.reduce((s, w) => s + (w.contribution ?? 0), 0);
        const maxRoiN_F = forW.reduce((m, w) => Math.max(m, w.roiNorm ?? 0), 0);
        const meanBase_F = forW.length ? forW.reduce((s, w) => s + (w.walletBase ?? 0), 0) / forW.length : 0;

        const base = {
          date: d.date,
          sport: d.sport,
          market: mkt,
          team: side.team,
          side: sideKey,
          regime: peak.regime ?? side.promotedRegime ?? 'UNKNOWN',
          lockStage: side.lockStage ?? null,
          promotedBy: side.promotedBy ?? null,
          stars: peak.stars ?? 0,
          units: peak.units ?? 0,
          odds: peak.odds ?? 0,
          contribTier: side.contribTier ?? classifyContribTier(qFor50, qAg50, margin, maxContribFor),
          qFor50, qAg50, margin, maxContribFor, sumContribFor, sumContribAg,
          maxRoiN_F, meanBase_F,
          maxRoiStar: maxRoiN_F >= 70,
          meanBaseStar: meanBase_F >= 55,
        };

        const outcome = side.result?.outcome ?? side.outcome ?? null;
        if (outcome === 'WIN' || outcome === 'LOSS') {
          base.won = outcome === 'WIN' ? 1 : 0;
          base.flat = flatProfit(peak.odds ?? 0, base.won === 1);
          graded.push(base);
        } else if (d.date === TODAY) {
          todaysOpen.push(base);
        }
      }
    }
  }
  graded.sort((a, b) => a.date.localeCompare(b.date));
  return { graded, todaysOpen };
}

function agg(rows) {
  if (!rows.length) return null;
  const n = rows.length;
  const wins = rows.filter(r => r.won === 1).length;
  const wr = (wins / n) * 100;
  const flatSum = rows.reduce((s, r) => s + r.flat, 0);
  const flatRoi = (flatSum / n) * 100;
  return { n, wr, flatSum, flatRoi };
}

function fmtCell(a) {
  if (!a || !a.n) return '—';
  return `N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}% · ${sign(a.flatSum, 1)}u`;
}

function edgeBucket(r) {
  if (r.maxRoiStar && r.meanBaseStar) return 'both★';
  if (r.maxRoiStar) return 'maxRoi★ only';
  if (r.meanBaseStar) return 'meanBase★ only';
  return 'neither';
}

(async () => {
  const { graded, todaysOpen } = await load();
  const out = [];
  const nowET = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  out.push(`# Non-LOCKED edge audit — do maxRoiN_F / meanBase_F deserve their own promotion path?`);
  out.push('');
  out.push(`Generated: ${nowET} ET · V8 cutover: ${V8_CUTOVER}`);
  out.push('');

  if (!graded.length) {
    out.push('No graded V8-era picks found.');
    writeFileSync(join(__dirname, '..', 'NONLOCKED_EDGE_AUDIT.md'), out.join('\n'));
    process.exit(0);
  }

  // Normalize lockStage: null/undefined → UNPROMOTED (separate bucket)
  graded.forEach(r => { r.lockStage = r.lockStage || 'UNPROMOTED'; });

  const baselineAll = agg(graded);
  out.push(`## Baseline — all graded V8-era game sides`);
  out.push('');
  out.push(mdHeader(['Segment', 'N', 'WR', 'flat ROI', 'flat PnL']));
  for (const stage of ['LOCKED', 'SHADOW', 'UNPROMOTED']) {
    const a = agg(graded.filter(r => r.lockStage === stage));
    if (a) out.push(`| ${stage} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.flatSum, 2)}u |`);
  }
  out.push(`| **All** | ${baselineAll.n} | ${baselineAll.wr.toFixed(1)}% | ${sign(baselineAll.flatRoi)}% | ${sign(baselineAll.flatSum, 2)}u |`);

  // ── 1. Edge-holds-up matrix ────────────────────────────────────
  out.push('\n---\n## 1. Does the edge survive outside the LOCKED universe?');
  out.push('');
  out.push('Rows: lockStage. Columns: which elite-wallet edges fired on that side. Cells: `N · WR · flat ROI · flat PnL`.');
  out.push('');
  out.push(`If the signal genuinely predicts winners, the rightmost "★" columns should beat "neither" **inside every lockStage row** — including SHADOW and UNPROMOTED. If it only works in LOCKED, it's probably just correlated with the existing promotion rules.`);
  out.push('');

  const edgeCols = ['both★', 'maxRoi★ only', 'meanBase★ only', 'neither'];
  out.push(`| lockStage | ${edgeCols.join(' | ')} | stage total |`);
  out.push(`|---|${edgeCols.map(() => '---|').join('')}---|`);
  for (const stage of ['LOCKED', 'SHADOW', 'UNPROMOTED']) {
    const inStage = graded.filter(r => r.lockStage === stage);
    if (!inStage.length) continue;
    const cells = edgeCols.map(eb => fmtCell(agg(inStage.filter(r => edgeBucket(r) === eb))));
    const total = fmtCell(agg(inStage));
    out.push(`| **${stage}** | ${cells.join(' | ')} | **${total}** |`);
  }
  // Column totals
  const colTotals = edgeCols.map(eb => fmtCell(agg(graded.filter(r => edgeBucket(r) === eb))));
  out.push(`| **ALL** | ${colTotals.join(' | ')} | **${fmtCell(baselineAll)}** |`);
  out.push('');

  // Narrative cut — isolate the "SHADOW or UNPROMOTED" subset because that's the
  // candidate promotion pool.
  out.push('### SHADOW + UNPROMOTED pool (the candidate promotion universe)');
  out.push('');
  const candidates = graded.filter(r => r.lockStage !== 'LOCKED');
  if (!candidates.length) {
    out.push('_Nothing outside LOCKED in the sample yet._');
  } else {
    out.push(mdHeader(['Edge state', 'N', 'WR', 'flat ROI', 'flat PnL']));
    for (const eb of edgeCols) {
      const a = agg(candidates.filter(r => edgeBucket(r) === eb));
      if (a) out.push(`| ${eb} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.flatSum, 2)}u |`);
    }
    const cTot = agg(candidates);
    out.push(`| **pool total** | ${cTot.n} | ${cTot.wr.toFixed(1)}% | ${sign(cTot.flatRoi)}% | ${sign(cTot.flatSum, 2)}u |`);
    out.push('');
    const hit = agg(candidates.filter(r => r.maxRoiStar || r.meanBaseStar));
    const miss = agg(candidates.filter(r => !r.maxRoiStar && !r.meanBaseStar));
    out.push(`**Proposed filter:** non-LOCKED side where \`maxRoiN_F ≥ 70\` **OR** \`meanBase_F ≥ 55\``);
    out.push('');
    out.push(mdHeader(['Subset', 'N', 'WR', 'flat ROI', 'flat PnL']));
    if (hit) out.push(`| filter hits (★) | ${hit.n} | ${hit.wr.toFixed(1)}% | ${sign(hit.flatRoi)}% | ${sign(hit.flatSum, 2)}u |`);
    if (miss) out.push(`| filter drops | ${miss.n} | ${miss.wr.toFixed(1)}% | ${sign(miss.flatRoi)}% | ${sign(miss.flatSum, 2)}u |`);
  }
  out.push('');

  // ── 2. Counterfactual daily timeline ────────────────────────────
  out.push('\n---\n## 2. Counterfactual — what if we promoted every non-LOCKED pick that hit the filter?');
  out.push('');
  out.push(`Column **Prod** = our actual LOCKED book as of each date. Column **Prod + elite-path** = Prod *plus* every non-LOCKED side that hit \`maxRoiN_F ≥ 70\` OR \`meanBase_F ≥ 55\`. Column **Delta** shows what the new promotion path adds (or removes) on top.`);
  out.push('');
  const dates = [...new Set(graded.map(r => r.date))].sort();
  out.push(mdHeader(['Date', 'Prod N · WR · ROI · PnL', 'Prod+elite N · WR · ROI · PnL', 'Δ picks', 'Δ PnL']));
  let cumDeltaN = 0, cumDeltaPnl = 0;
  for (const d of dates) {
    const day = graded.filter(r => r.date === d);
    const prod = day.filter(r => r.lockStage === 'LOCKED');
    const added = day.filter(r => r.lockStage !== 'LOCKED' && (r.maxRoiStar || r.meanBaseStar));
    const combined = [...prod, ...added];
    const aProd = agg(prod);
    const aCombo = agg(combined);
    const dPnl = (aCombo?.flatSum ?? 0) - (aProd?.flatSum ?? 0);
    cumDeltaN += added.length;
    cumDeltaPnl += dPnl;
    const fmt = a => a ? `N=${a.n} · ${a.wr.toFixed(0)}% · ${sign(a.flatRoi, 0)}% · ${sign(a.flatSum, 2)}u` : '—';
    out.push(`| ${d} | ${fmt(aProd)} | ${fmt(aCombo)} | +${added.length} | ${sign(dPnl, 2)}u |`);
  }
  out.push(`| **Total delta** | — | — | **+${cumDeltaN}** picks | **${sign(cumDeltaPnl, 2)}u** |`);
  out.push('');

  // ── 3. Is this a NEW path or a re-statement? ────────────────────
  out.push('\n---\n## 3. Is the elite-wallet filter actually new, or redundant with existing promotion paths?');
  out.push('');
  out.push(`The current promotion system uses two paths: **regime** (CLEAR_MOVE / NEAR_START) and **contribution** (STRONG contribTier). If the non-LOCKED filter hits are already flagged by one of those, we're not adding anything — we'd just be weakening the gate.`);
  out.push('');
  const elitePool = graded.filter(r => r.lockStage !== 'LOCKED' && (r.maxRoiStar || r.meanBaseStar));
  if (!elitePool.length) {
    out.push('_No non-LOCKED filter-hit picks in the sample yet._');
  } else {
    out.push(`**Elite-path candidate pool (non-LOCKED + edge hit): N=${elitePool.length}.**  Breaking down by whether they were *already eligible* under a current path:`);
    out.push('');
    out.push(mdHeader(['Category', 'N', 'WR', 'flat ROI', 'flat PnL']));

    const byRegime = elitePool.filter(r => r.regime === 'CLEAR_MOVE' || r.regime === 'NEAR_START');
    const byContrib = elitePool.filter(r => r.contribTier === 'STRONG');
    const eitherExisting = elitePool.filter(r => r.regime === 'CLEAR_MOVE' || r.regime === 'NEAR_START' || r.contribTier === 'STRONG');
    const novel = elitePool.filter(r => !(r.regime === 'CLEAR_MOVE' || r.regime === 'NEAR_START' || r.contribTier === 'STRONG'));

    const emit = (label, rows) => {
      const a = agg(rows);
      if (!a) return;
      out.push(`| ${label} | ${a.n} | ${a.wr.toFixed(1)}% | ${sign(a.flatRoi)}% | ${sign(a.flatSum, 2)}u |`);
    };
    emit('already regime-eligible (CLEAR_MOVE / NEAR_START)', byRegime);
    emit('already contribution-eligible (STRONG)', byContrib);
    emit('eligible under EITHER current path', eitherExisting);
    emit('**NOVEL** — only elite-path would have caught these', novel);
    out.push('');
    if (novel.length) {
      out.push(`**NOVEL picks** = what a new elite-wallet promotion path would uniquely add. These are the ones that matter for the "own promotion path" decision.`);
    }
  }
  out.push('');

  // ── 4. Today's live call sheet ──────────────────────────────────
  out.push('\n---\n## 4. Today\'s live candidates for the elite-wallet path');
  out.push('');
  out.push(`Currently-SHADOW or unpromoted sides on the board for ${TODAY} that would promote if we shipped the new path:`);
  out.push('');
  todaysOpen.forEach(r => { r.lockStage = r.lockStage || 'UNPROMOTED'; });
  const todaysCandidates = todaysOpen.filter(r => r.lockStage !== 'LOCKED' && (r.maxRoiStar || r.meanBaseStar));
  if (!todaysCandidates.length) {
    out.push(`_None._`);
  } else {
    out.push(mdHeader(['Pick', 'lockStage', 'regime', 'tier', 'maxRoiN_F', 'meanBase_F', 'margin', 'Δctrb']));
    todaysCandidates
      .sort((a, b) => ((b.maxRoiStar ? 1 : 0) + (b.meanBaseStar ? 1 : 0)) - ((a.maxRoiStar ? 1 : 0) + (a.meanBaseStar ? 1 : 0)))
      .forEach(r => {
        const pick = `${r.sport} ${r.market} — ${r.team}`;
        const dctrb = (r.sumContribFor - r.sumContribAg).toFixed(0);
        const maxStr = (r.maxRoiN_F ?? 0).toFixed(0) + (r.maxRoiStar ? '★' : '');
        const baseStr = (r.meanBase_F ?? 0).toFixed(0) + (r.meanBaseStar ? '★' : '');
        out.push(`| ${pick} | ${r.lockStage} | ${r.regime} | ${r.contribTier} | ${maxStr} | ${baseStr} | ${r.margin >= 0 ? '+' : ''}${r.margin} | ${dctrb} |`);
      });
  }
  out.push('');

  // ── 5. Verdict + proposal ───────────────────────────────────────
  out.push('\n---\n## 5. Verdict + proposal');
  out.push('');
  const novelSample = graded.filter(r =>
    r.lockStage !== 'LOCKED' &&
    (r.maxRoiStar || r.meanBaseStar) &&
    !(r.regime === 'CLEAR_MOVE' || r.regime === 'NEAR_START' || r.contribTier === 'STRONG')
  );
  const novelAgg = agg(novelSample);
  const shadowPool = agg(graded.filter(r => r.lockStage !== 'LOCKED'));
  const shadowHit = agg(graded.filter(r => r.lockStage !== 'LOCKED' && (r.maxRoiStar || r.meanBaseStar)));

  out.push('### Summary');
  out.push('');
  if (shadowPool && shadowHit) {
    out.push(`- **Non-LOCKED pool:** N=${shadowPool.n}, flat ROI ${sign(shadowPool.flatRoi)}%.`);
    out.push(`- **Non-LOCKED × edge hit:** N=${shadowHit.n}, flat ROI ${sign(shadowHit.flatRoi)}%, PnL ${sign(shadowHit.flatSum, 2)}u.`);
    if (novelAgg) {
      out.push(`- **NOVEL picks (filter catches them, current paths miss them):** N=${novelAgg.n}, flat ROI ${sign(novelAgg.flatRoi)}%, PnL ${sign(novelAgg.flatSum, 2)}u.`);
    } else {
      out.push(`- **NOVEL picks:** N=0 — everything the filter catches in the non-LOCKED pool is already eligible under regime or contribution paths.`);
    }
  }
  out.push('');
  out.push('### Decision criteria');
  out.push('');
  out.push(`1. Edge must survive with **flat ROI ≥ +10%** inside the non-LOCKED pool.`);
  out.push(`2. There must be **NOVEL picks** — filter catches non-LOCKED sides that regime/contribution paths miss.`);
  out.push(`3. NOVEL pick sample needs flat ROI ≥ +10% on **N ≥ 6** (min 2 full days) before shipping a real promotion rule.`);
  out.push('');
  out.push('### What to do next');
  out.push('');
  out.push(`- If criteria met → add a new \`elite-wallet\` promotion path in \`SharpFlow.jsx\` alongside \`regime\` and \`contribution\`, and track \`promotedBy = 'elite-wallet'\` for audit.`);
  out.push(`- If criteria not yet met but directionally positive → keep the signal on the **ranking dashboard** (\`rankTodayLocks.js\`) and re-audit weekly.`);
  out.push(`- If the filter underperforms in the non-LOCKED pool → keep meanBase_F / maxRoiN_F strictly as **sizing modifiers** (V8.3), not promotion gates.`);
  out.push('');
  out.push('---');
  out.push(`*Auto-generated by \`scripts/nonLockedEdgeAudit.js\`. Re-run via GH Actions to refresh \`NONLOCKED_EDGE_AUDIT.md\`.*`);
  out.push('');

  const filepath = join(__dirname, '..', 'NONLOCKED_EDGE_AUDIT.md');
  writeFileSync(filepath, out.join('\n'));
  console.log(`Wrote ${filepath}`);
  console.log(`Graded sample: N=${graded.length} (LOCKED=${graded.filter(r=>r.lockStage==='LOCKED').length}, SHADOW=${graded.filter(r=>r.lockStage==='SHADOW').length}, UNPROMOTED=${graded.filter(r=>r.lockStage==='UNPROMOTED').length})`);
  console.log(`Elite-hit candidates in non-LOCKED pool: N=${graded.filter(r => r.lockStage !== 'LOCKED' && (r.maxRoiStar || r.meanBaseStar)).length}`);
  if (novelAgg) {
    console.log(`NOVEL (filter catches, current paths miss): N=${novelAgg.n}, flat ROI ${sign(novelAgg.flatRoi)}%, PnL ${sign(novelAgg.flatSum, 2)}u`);
  }
  process.exit(0);
})();
