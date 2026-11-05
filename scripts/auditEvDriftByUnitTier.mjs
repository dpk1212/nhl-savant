#!/usr/bin/env node
/**
 * Ev-drift by unit tier — WR / ROI / PnL ladder.
 * Shows whether first→lock ticketEv worsening is directional across
 * stake sizes (not a high-E BOOST-only anomaly).
 *
 * Tracking stamps only. No staking / mute code changes.
 *
 * Usage: node scripts/auditEvDriftByUnitTier.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';
import { analyzeTicketTapeLog } from '../src/lib/ticketTapeCapture.js';
import {
  maxForSizeRatio,
  leadForSizeRatio,
  meanForRoiNorm,
} from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
loadEnv({ path: join(ROOT, '.env.local') });
loadEnv({ path: join(ROOT, '.env') });

const FROM = '2026-06-15';
const AGSU = 'ags-unified';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const UNIT_TIERS = [
  { id: 'U0_2', label: '<2u', test: (u) => u > 0 && u < 2 },
  { id: 'U2_4', label: '2–<4u', test: (u) => u >= 2 && u < 4 },
  { id: 'U4_54', label: '4–<5.4u', test: (u) => u >= 4 && u < 5.4 },
  { id: 'U54', label: '≥5.4u BOOST', test: (u) => u >= 5.4 },
  { id: 'SUB4', label: 'ALL sub-4', test: (u) => u > 0 && u < 4 },
  { id: 'U4p', label: 'ALL 4u+', test: (u) => u >= 4 },
  { id: 'ALL', label: 'ALL ≥1u', test: (u) => u >= 1 },
];

const EDGE_SLICES = [
  { id: 'ALL_E', label: 'any EDGE', test: () => true },
  { id: 'E15', label: 'EDGE ≥15', test: (r) => r.edge != null && r.edge >= 15 },
  { id: 'E_lt15', label: 'EDGE <15', test: (r) => r.edge == null || r.edge < 15 },
];

const DRIFT_RULES = [
  { id: 'dEv_le_1', label: 'dEv ≤ −1', test: (r) => r.dEv != null && r.dEv <= -1 },
  { id: 'dEv_le_15', label: 'dEv ≤ −1.5', test: (r) => r.dEv != null && r.dEv <= -1.5 },
  { id: 'dEv_le_2', label: 'dEv ≤ −2', test: (r) => r.dEv != null && r.dEv <= -2 },
  {
    id: 'late_poison',
    label: 'late poison (first≥−0.5 → lock<−1)',
    test: (r) => r.firstEv != null && r.lockEv != null
      && r.firstEv >= -0.5 && r.lockEv < -1,
  },
  {
    id: 'improved',
    label: 'improved/flat dEv > −1',
    test: (r) => r.dEv != null && r.dEv > -1,
  },
];

function db() {
  return getFirestore(initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  }));
}

function profitOf(u, o, won) {
  if (!(u > 0) || !Number.isFinite(o) || !o) return 0;
  return won ? (o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100)) : -u;
}

function agg(rows) {
  let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rows) {
    if (!(r.units > 0)) continue;
    if (r.won) w += 1; else l += 1;
    stake += r.units;
    pnl += r.profit;
  }
  const n = w + l;
  return {
    n, w, l, stake, pnl,
    wr: n ? (100 * w) / n : null,
    roi: stake > 0 ? (100 * pnl) / stake : null,
  };
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function pathOf(sd) {
  return sd.v8_hcStakeTier || sd.v8_agsV12Tier || sd.v8_stakePath || sd.v8_agsTier || '—';
}

/** fair=0 is a known sentinel bug — treat Ev on that row as null. */
function cleanEv(row) {
  if (!row) return null;
  const fair = num(row.fair);
  const ev = num(row.evPct);
  if (fair === 0) return null;
  return ev;
}

function shippedTopCrowded(r) {
  if (!r.isTop) return false;
  if (r.leadSR != null && r.leadSR >= 3) return true;
  if (r.edge != null && r.edge < 10) return true;
  if (r.forRoiNormMean != null && r.leadSR != null
      && r.forRoiNormMean >= 42 && r.leadSR >= 2) return true;
  return false;
}

function fmt(a) {
  if (!a || !a.n) return '—';
  const wr = a.wr == null ? '—' : `${a.wr.toFixed(0)}%`;
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}%`;
  const pnl = `${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u`;
  return `${a.n} · ${a.w}–${a.l} · WR ${wr} · ROI ${roi} · ${pnl}`;
}

function fmtShort(a) {
  if (!a || !a.n) return '—';
  const wr = a.wr == null ? '—' : `${a.wr.toFixed(0)}%`;
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}%`;
  return `${a.n} ${a.w}–${a.l} ${wr} ${roi} ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u`;
}

function deltaStr(x) {
  if (x == null || !Number.isFinite(x)) return '—';
  return `${x >= 0 ? '+' : ''}${x.toFixed(1)}u`;
}

async function load(firestore) {
  const rows = [];
  for (const [col, mkt] of COLS) {
    const snap = await getDocs(collection(firestore, col));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() || {};
      const date = data.date;
      if (typeof date !== 'string' || date < FROM) continue;
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (!sd || sd.superseded) continue;
        if (!(typeof sd.promotedBy === 'string' && sd.promotedBy.startsWith(AGSU))) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result || {};
        let won = null;
        if (res.outcome === 'WIN' || res.outcome === 'W') won = true;
        else if (res.outcome === 'LOSS' || res.outcome === 'L') won = false;
        if (won == null || res.tracked === true) continue;
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        if (!(units > 0)) continue;

        const lockOdds = sd.lock || {};
        const peak = sd.peak || lockOdds;
        const odds = Number(peak.odds || lockOdds.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lockOdds.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const leadSR = leadForSizeRatio(wd, sideKey);
        const forRoiNormMean = meanForRoiNorm(wd, sideKey);
        const maxSR = maxForSizeRatio(wd, sideKey);
        const path = pathOf(sd);
        const isTop = path === 'TOP' || path === 'TOP+';
        const edge = num(sd.v8_winnerAlignEdge);

        const tape = analyzeTicketTapeLog(sd.v8_ticketTapeLog);
        const firstEv = cleanEv(tape.first);
        const lockEv = cleanEv(tape.lock);
        const dEv = (firstEv != null && lockEv != null)
          ? Math.round((lockEv - firstEv) * 10) / 10
          : null;
        if (firstEv == null || lockEv == null) continue;

        const row = {
          id: `${docSnap.id}:${sideKey}`,
          date,
          sport: data.sport || 'UNK',
          mkt,
          path,
          units,
          odds,
          won,
          profit: profitOf(units, odds, won),
          isTop,
          edge,
          leadSR,
          forRoiNormMean,
          maxSR,
          firstEv,
          lockEv,
          dEv,
          boost: units >= 5.4,
        };
        row.shippedCut = shippedTopCrowded(row);
        rows.push(row);
      }
    }
  }
  return rows;
}

function sectionTable(rows, title) {
  const lines = [];
  lines.push(`### ${title}`);
  if (!rows.length) {
    lines.push('_no tickets_');
    lines.push('');
    return lines;
  }
  const base = agg(rows);
  lines.push(`Base: **${fmt(base)}** · avgU ${(rows.reduce((s, r) => s + r.units, 0) / rows.length).toFixed(2)}`);
  lines.push('');
  lines.push('| Cohort | n | W–L | WR | ROI | PnL | mute Δ (cut→0) |');
  lines.push('|--------|--:|:---:|---:|----:|----:|---------------:|');
  for (const rule of DRIFT_RULES) {
    const cut = rows.filter(rule.test);
    const keep = rows.filter((r) => !rule.test(r));
    const c = agg(cut);
    const k = agg(keep);
    const muteDelta = c.n ? -c.pnl : null; // cutting losers adds their pnl back
    const wr = c.wr == null ? '—' : `${c.wr.toFixed(0)}%`;
    const roi = c.roi == null ? '—' : `${c.roi >= 0 ? '+' : ''}${c.roi.toFixed(0)}%`;
    const pnl = c.n ? `${c.pnl >= 0 ? '+' : ''}${c.pnl.toFixed(1)}u` : '—';
    const wl = c.n ? `${c.w}–${c.l}` : '—';
    lines.push(
      `| ${rule.label} | ${c.n || 0} | ${wl} | ${wr} | ${roi} | ${pnl} | ${deltaStr(muteDelta)} |`,
    );
    if (rule.id.startsWith('dEv') || rule.id === 'late_poison') {
      if (c.n && k.n) {
        lines.push(
          `| ↳ keep if muted | ${k.n} | ${k.w}–${k.l} | ${k.wr.toFixed(0)}% | ${k.roi >= 0 ? '+' : ''}${k.roi.toFixed(0)}% | ${k.pnl >= 0 ? '+' : ''}${k.pnl.toFixed(1)}u | — |`,
        );
      }
    }
  }
  lines.push('');
  return lines;
}

function directionalScore(rows, rule) {
  const cut = rows.filter(rule.test);
  const base = agg(rows);
  const c = agg(cut);
  if (!c.n || c.n < 2) return { ok: null, reason: 'thin' };
  const worseRoi = c.roi != null && base.roi != null && c.roi < base.roi - 5;
  const worseWr = c.wr != null && base.wr != null && c.wr < base.wr - 5;
  const muteHelps = -c.pnl > 0.5;
  return {
    ok: worseRoi || worseWr,
    muteHelps,
    cutRoi: c.roi,
    baseRoi: base.roi,
    cutWr: c.wr,
    baseWr: base.wr,
    n: c.n,
    delta: -c.pnl,
  };
}

async function main() {
  const firestore = db();
  console.log('Loading AGSU completed with first+lock Ev…');
  const all = await load(firestore);
  const residual = all.filter((r) => !r.shippedCut);

  const dates = [...new Set(all.map((r) => r.date))].sort();
  const md = [];
  md.push('# Ev drift by unit tier — WR / ROI / PnL');
  md.push(`_Generated ${new Date().toISOString()}_`);
  md.push('');
  md.push('## What this answers');
  md.push('Is **first→lock ticketEv worsening** (drift) a real directional leak on WR/ROI/PnL across unit tiers — or a small-sample quirk of high-EDGE BOOST?');
  md.push('');
  md.push('## Sample honesty');
  md.push('| Slice | n | Date span |');
  md.push('|-------|--:|-----------|');
  md.push(`| ALL AGSU ≥1u with first+lock Ev | ${all.length} | ${dates[0] || '—'} → ${dates[dates.length - 1] || '—'} |`);
  md.push(`| Residual (post TOP crowded mute) | ${residual.length} |`);
  md.push(`| Residual ∧ EDGE≥15 | ${residual.filter((r) => r.edge != null && r.edge >= 15).length} |`);
  md.push(`| Residual ∧ ≥5.4u | ${residual.filter((r) => r.units >= 5.4).length} |`);
  md.push('');
  md.push('Ev lifecycle stamps only exist ~Aug 19+. **One soft week.** Direction matters more than ship-readiness.');
  md.push('');
  md.push('`dEv = lockEv − firstEv` (more negative = fair moved against the ticket / we overpay more by lock).');
  md.push('`fair=0` sentinel rows excluded. Shipped TOP crowded mute removed from residual universe.');
  md.push('');

  // Compact matrix: unit tier × edge × dEv≤-1.5
  md.push('## Compact scoreboard — dEv ≤ −1.5 cut vs base');
  md.push('');
  md.push('Read across unit tiers. If drift is real, cut ROI should be worse than base and mute Δ should be positive **in the same direction** as stakes grow / EDGE rises.');
  md.push('');
  md.push('| Unit tier | EDGE slice | base n · WR · ROI · PnL | cut n · WR · ROI · PnL | mute Δ | direction? |');
  md.push('|-----------|------------|-------------------------|------------------------|-------:|:----------:|');

  const scoreRule = DRIFT_RULES.find((r) => r.id === 'dEv_le_15');
  const scoreboard = [];

  for (const tier of UNIT_TIERS) {
    for (const es of EDGE_SLICES) {
      const rows = residual.filter((r) => tier.test(r.units) && es.test(r));
      if (!rows.length) continue;
      const base = agg(rows);
      const cut = rows.filter(scoreRule.test);
      const c = agg(cut);
      const sc = directionalScore(rows, scoreRule);
      let dir = '—';
      if (sc.ok === null) dir = 'thin';
      else if (sc.ok && sc.muteHelps) dir = 'YES ↓';
      else if (sc.ok && !sc.muteHelps) dir = 'worse but +PnL cut?';
      else if (!sc.ok && sc.muteHelps) dir = 'mute+ but not worse?';
      else dir = 'NO / flat';
      md.push(
        `| ${tier.label} | ${es.label} | ${fmtShort(base)} | ${fmtShort(c)} | ${deltaStr(c.n ? -c.pnl : null)} | ${dir} |`,
      );
      scoreboard.push({
        tier: tier.id,
        tierLabel: tier.label,
        edge: es.id,
        edgeLabel: es.label,
        base,
        cut: c,
        muteDelta: c.n ? -c.pnl : null,
        direction: dir,
        sc,
      });
    }
  }
  md.push('');

  // Late poison compact
  md.push('## Compact scoreboard — late poison (first≥−0.5 → lock<−1)');
  md.push('');
  md.push('| Unit tier | EDGE slice | base | cut | mute Δ | direction? |');
  md.push('|-----------|------------|------|-----|-------:|:----------:|');
  const lateRule = DRIFT_RULES.find((r) => r.id === 'late_poison');
  for (const tier of UNIT_TIERS) {
    for (const es of EDGE_SLICES) {
      const rows = residual.filter((r) => tier.test(r.units) && es.test(r));
      if (!rows.length) continue;
      const base = agg(rows);
      const cut = rows.filter(lateRule.test);
      const c = agg(cut);
      const sc = directionalScore(rows, lateRule);
      let dir = '—';
      if (sc.ok === null) dir = 'thin';
      else if (sc.ok && sc.muteHelps) dir = 'YES ↓';
      else if (!sc.ok) dir = 'NO / flat';
      else dir = 'mixed';
      md.push(
        `| ${tier.label} | ${es.label} | ${fmtShort(base)} | ${fmtShort(c)} | ${deltaStr(c.n ? -c.pnl : null)} | ${dir} |`,
      );
    }
  }
  md.push('');

  // Full detail by unit tier (residual, any EDGE + E≥15)
  md.push('## Full ladder by unit tier (residual)');
  md.push('');
  for (const tier of UNIT_TIERS.filter((t) => !['SUB4', 'U4p', 'ALL'].includes(t.id) || t.id === 'ALL')) {
    const anyE = residual.filter((r) => tier.test(r.units));
    const hiE = residual.filter((r) => tier.test(r.units) && r.edge != null && r.edge >= 15);
    const loE = residual.filter((r) => tier.test(r.units) && (r.edge == null || r.edge < 15));
    md.push(...sectionTable(anyE, `${tier.label} · any EDGE`));
    md.push(...sectionTable(hiE, `${tier.label} · EDGE ≥15`));
    md.push(...sectionTable(loE, `${tier.label} · EDGE <15`));
  }

  // Ticket dump for drifted high-E cells
  md.push('## Ticket dump — residual ∧ EDGE≥15 ∧ dEv ≤ −1.5');
  md.push('');
  md.push('| Date | u | Path | Sport | E | first | lock | dEv | W/L | PnL |');
  md.push('|------|--:|------|-------|--:|------:|-----:|----:|:--:|----:|');
  const dump = residual
    .filter((r) => r.edge != null && r.edge >= 15 && r.dEv != null && r.dEv <= -1.5)
    .sort((a, b) => a.date.localeCompare(b.date) || b.units - a.units);
  for (const r of dump) {
    md.push(
      `| ${r.date} | ${r.units.toFixed(1)} | ${r.path} | ${r.sport} | ${r.edge.toFixed(1)} | ${r.firstEv.toFixed(1)} | ${r.lockEv.toFixed(1)} | ${r.dEv.toFixed(1)} | ${r.won ? 'W' : 'L'} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)} |`,
    );
  }
  if (!dump.length) md.push('| — | | | | | | | | | |');
  md.push('');

  md.push('## Ticket dump — residual ∧ EDGE≥15 ∧ late poison');
  md.push('');
  md.push('| Date | u | Path | Sport | E | first | lock | dEv | W/L | PnL |');
  md.push('|------|--:|------|-------|--:|------:|-----:|----:|:--:|----:|');
  const dump2 = residual
    .filter((r) => r.edge != null && r.edge >= 15 && lateRule.test(r))
    .sort((a, b) => a.date.localeCompare(b.date) || b.units - a.units);
  for (const r of dump2) {
    md.push(
      `| ${r.date} | ${r.units.toFixed(1)} | ${r.path} | ${r.sport} | ${r.edge.toFixed(1)} | ${r.firstEv.toFixed(1)} | ${r.lockEv.toFixed(1)} | ${r.dEv.toFixed(1)} | ${r.won ? 'W' : 'L'} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)} |`,
    );
  }
  if (!dump2.length) md.push('| — | | | | | | | | | |');
  md.push('');

  // Synthesis hints from data
  md.push('## Directional read (auto)');
  md.push('');
  const hiCells = scoreboard.filter((s) => s.edge === 'E15' && ['U0_2', 'U2_4', 'U4_54', 'U54'].includes(s.tier));
  const yes = hiCells.filter((s) => s.direction === 'YES ↓');
  const thin = hiCells.filter((s) => s.direction === 'thin');
  const no = hiCells.filter((s) => s.direction.startsWith('NO'));
  md.push(`On **EDGE≥15**, dEv≤−1.5 by unit tier:`);
  for (const s of hiCells) {
    md.push(`- **${s.tierLabel}**: ${s.direction} · cut ${fmtShort(s.cut)} · mute Δ ${deltaStr(s.muteDelta)}`);
  }
  md.push('');
  const loCells = scoreboard.filter((s) => s.edge === 'E_lt15' && ['U0_2', 'U2_4', 'U4_54', 'U54'].includes(s.tier));
  md.push(`On **EDGE<15**, same rule (control — should be weak/flat/hurt):`);
  for (const s of loCells) {
    md.push(`- **${s.tierLabel}**: ${s.direction} · cut ${fmtShort(s.cut)} · mute Δ ${deltaStr(s.muteDelta)}`);
  }
  md.push('');
  md.push(`High-E tiers showing YES ↓: **${yes.length}/${hiCells.length - thin.length}** scored (excl thin). Low-E YES ↓: **${loCells.filter((s) => s.direction === 'YES ↓').length}**.`);
  md.push('');
  md.push('### Interpretation guide');
  md.push('- If high-E shows YES ↓ across **multiple** unit tiers → drift is size-aware but not BOOST-only.');
  md.push('- If only ≥5.4u YES ↓ and sub-4 flat/thin → interaction is high-E × size, still usable as gated mute.');
  md.push('- If low-E also YES ↓ everywhere → broader cancel; product cost higher.');
  md.push('- Thin cells (n<2 cut) do not count as evidence either way.');
  md.push('');

  const outMd = join(ROOT, 'tmp_ev_drift_by_unit_tier.md');
  const outJson = join(ROOT, 'tmp_ev_drift_by_unit_tier.json');
  writeFileSync(outMd, md.join('\n'));
  writeFileSync(outJson, JSON.stringify({
    generated: new Date().toISOString(),
    nAll: all.length,
    nResidual: residual.length,
    dates: { from: dates[0], to: dates[dates.length - 1] },
    scoreboard,
    dump: dump.map((r) => ({
      date: r.date, units: r.units, path: r.path, sport: r.sport,
      edge: r.edge, firstEv: r.firstEv, lockEv: r.lockEv, dEv: r.dEv,
      won: r.won, profit: r.profit,
    })),
  }, null, 2));

  console.log(md.join('\n'));
  console.log(`\nWrote ${outMd}`);
  console.log(`Wrote ${outJson}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
