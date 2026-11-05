#!/usr/bin/env node
/**
 * Ev-drift by EDGE tier — WR / ROI / PnL (not unit-sliced).
 * Also: does high EDGE drift more often, or does the same drift hurt more?
 *
 * EDGE = mean(FOR sport WR) − (mean(AG sport WR) ?? 50)
 * It is the wallet-alignment conviction dial and the dominant TAPE input.
 *
 * Usage: node scripts/auditEvDriftByEdgeTier.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';
import { analyzeTicketTapeLog } from '../src/lib/ticketTapeCapture.js';
import {
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

/** EDGE bands aligned to sizing thresholds + the ≥15 poison cell. */
const EDGE_TIERS = [
  { id: 'MISS', label: 'EDGE missing', test: (e) => e == null },
  { id: 'LT5', label: 'EDGE <5', test: (e) => e != null && e < 5 },
  { id: 'E5_10', label: '5 ≤ EDGE <10', test: (e) => e != null && e >= 5 && e < 10 },
  { id: 'E10_15', label: '10 ≤ EDGE <15', test: (e) => e != null && e >= 10 && e < 15 },
  { id: 'E15_20', label: '15 ≤ EDGE <20', test: (e) => e != null && e >= 15 && e < 20 },
  { id: 'E20', label: 'EDGE ≥20', test: (e) => e != null && e >= 20 },
  { id: 'E_lt15', label: 'ALL EDGE <15 (incl miss)', test: (e) => e == null || e < 15 },
  { id: 'E15p', label: 'ALL EDGE ≥15', test: (e) => e != null && e >= 15 },
  { id: 'ALL', label: 'ALL with tape', test: () => true },
];

const DRIFT_RULES = [
  { id: 'dEv_le_1', label: 'dEv ≤ −1' },
  { id: 'dEv_le_15', label: 'dEv ≤ −1.5' },
  { id: 'dEv_le_2', label: 'dEv ≤ −2' },
  { id: 'late_poison', label: 'late poison (first≥−0.5 → lock<−1)' },
  { id: 'improved', label: 'improved/flat dEv > −1' },
];

function ruleTest(id, r) {
  if (id === 'dEv_le_1') return r.dEv != null && r.dEv <= -1;
  if (id === 'dEv_le_15') return r.dEv != null && r.dEv <= -1.5;
  if (id === 'dEv_le_2') return r.dEv != null && r.dEv <= -2;
  if (id === 'late_poison') {
    return r.firstEv != null && r.lockEv != null && r.firstEv >= -0.5 && r.lockEv < -1;
  }
  if (id === 'improved') return r.dEv != null && r.dEv > -1;
  return false;
}

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

function mean(arr) {
  const xs = arr.filter((x) => x != null && Number.isFinite(x));
  if (!xs.length) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function pct(n, d) {
  if (!(d > 0)) return null;
  return (100 * n) / d;
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

function n1(x) {
  return x == null ? '—' : x.toFixed(1);
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
        const path = pathOf(sd);
        const isTop = path === 'TOP' || path === 'TOP+';
        const edge = num(sd.v8_winnerAlignEdge);
        const meanFor = num(sd.v8_winnerAlignMeanFor);
        const meanAg = num(sd.v8_winnerAlignMeanAg);
        const tapeScore = num(sd.v8_tapeScore);
        const tapeAction = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || null;

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
          meanFor,
          meanAg,
          tapeScore,
          tapeAction,
          leadSR,
          forRoiNormMean,
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

function bandStats(rows) {
  const a = agg(rows);
  return {
    ...a,
    avgU: rows.length ? mean(rows.map((r) => r.units)) : null,
    pctBoost: pct(rows.filter((r) => r.boost).length, rows.length),
    meanEdge: mean(rows.map((r) => r.edge)),
    meanFirst: mean(rows.map((r) => r.firstEv)),
    meanLock: mean(rows.map((r) => r.lockEv)),
    meanDEv: mean(rows.map((r) => r.dEv)),
    driftRate15: pct(rows.filter((r) => ruleTest('dEv_le_15', r)).length, rows.length),
    lateRate: pct(rows.filter((r) => ruleTest('late_poison', r)).length, rows.length),
    meanFor: mean(rows.map((r) => r.meanFor)),
    meanAg: mean(rows.map((r) => r.meanAg)),
  };
}

async function main() {
  const firestore = db();
  console.log('Loading AGSU completed with first+lock Ev…');
  const all = await load(firestore);
  const residual = all.filter((r) => !r.shippedCut);
  const dates = [...new Set(all.map((r) => r.date))].sort();

  const md = [];
  md.push('# Ev drift by EDGE tier — WR / ROI / PnL');
  md.push(`_Generated ${new Date().toISOString()}_`);
  md.push('');
  md.push('## Why EDGE would matter (mechanism, not just correlation)');
  md.push('');
  md.push('**What EDGE is:** `mean(FOR sport WR) − (mean(AG sport WR) ?? 50)`.');
  md.push('It is our *internal* wallet-alignment conviction dial — how much better the wallets on our side have been historically vs the other side (or a 50 prior if unopposed).');
  md.push('');
  md.push('**How it sizes the book:** TAPE = `2·(EDGE/10) + 1.5·(netCLV/10)` (EDGE-heavy). EDGE≥10 also floors size (ONE→≥4u / BOTH+tape boost→≥5u). So high EDGE is exactly when we lean hard and bet big.');
  md.push('');
  md.push('**What Ev drift is:** first→lock change in ticket EV vs Pinnacle fair. Negative dEv = the *sharp market* moved against our price (we overpay more by lock).');
  md.push('');
  md.push('**Collision theory:** high EDGE = we believe our wallets are right. Negative drift = Pinny says the price is wrong. When those disagree, we are both (a) wrong on price and (b) sized up on that wrongness. Low EDGE tickets: same market move, but we were not leveraged into the belief — drift is closer to noise / sometimes even healthy price discovery we already sized small for.');
  md.push('');
  md.push('## Sample honesty');
  md.push('| Slice | n | Date span |');
  md.push('|-------|--:|-----------|');
  md.push(`| Residual with first+lock Ev | ${residual.length} | ${dates[0]} → ${dates[dates.length - 1]} |`);
  md.push('');
  md.push('One soft week. Direction > ship-readiness. fair=0 excluded. TOP crowded mute removed.');
  md.push('');

  // Profile of each EDGE band (selection: do they drift more?)
  md.push('## EDGE band profile — do high-E tickets drift more often?');
  md.push('');
  md.push('| EDGE tier | n | avgU | %BOOST | mean EDGE | mean firstEv | mean lockEv | mean dEv | % dEv≤−1.5 | % late poison | base WR/ROI/PnL |');
  md.push('|-----------|--:|-----:|-------:|----------:|-------------:|------------:|---------:|-----------:|--------------:|-----------------|');

  const profileRows = [];
  for (const tier of EDGE_TIERS) {
    const rows = residual.filter((r) => tier.test(r.edge));
    if (!rows.length && !['ALL', 'E_lt15', 'E15p'].includes(tier.id)) continue;
    const s = bandStats(rows);
    profileRows.push({ tier, rows, s });
    md.push(
      `| ${tier.label} | ${s.n} | ${n1(s.avgU)} | ${s.pctBoost == null ? '—' : `${s.pctBoost.toFixed(0)}%`} | ${n1(s.meanEdge)} | ${n1(s.meanFirst)} | ${n1(s.meanLock)} | ${n1(s.meanDEv)} | ${s.driftRate15 == null ? '—' : `${s.driftRate15.toFixed(0)}%`} | ${s.lateRate == null ? '—' : `${s.lateRate.toFixed(0)}%`} | ${fmtShort(s)} |`,
    );
  }
  md.push('');
  md.push('If **% dEv≤−1.5** rises with EDGE → selection (high-E tickets get worse prices more often).');
  md.push('If rate is flat but cut ROI collapses only at high EDGE → interaction (same drift, worse when conviction is high).');
  md.push('');

  // Main scoreboard: drift cut by EDGE tier
  md.push('## Compact scoreboard — dEv ≤ −1.5 by EDGE tier');
  md.push('');
  md.push('| EDGE tier | base | cut (drifted) | mute Δ | cut vs base ROI |');
  md.push('|-----------|------|---------------|-------:|----------------:|');
  for (const { tier, rows, s } of profileRows) {
    const cut = rows.filter((r) => ruleTest('dEv_le_15', r));
    const c = agg(cut);
    const muteDelta = c.n ? -c.pnl : null;
    const roiGap = (c.n && s.roi != null && c.roi != null) ? c.roi - s.roi : null;
    md.push(
      `| ${tier.label} | ${fmtShort(s)} | ${fmtShort(c)} | ${deltaStr(muteDelta)} | ${roiGap == null ? '—' : `${roiGap >= 0 ? '+' : ''}${roiGap.toFixed(0)}pp`} |`,
    );
  }
  md.push('');

  md.push('## Compact scoreboard — late poison by EDGE tier');
  md.push('');
  md.push('| EDGE tier | base | cut | mute Δ |');
  md.push('|-----------|------|-----|-------:|');
  for (const { tier, rows, s } of profileRows) {
    const cut = rows.filter((r) => ruleTest('late_poison', r));
    const c = agg(cut);
    md.push(`| ${tier.label} | ${fmtShort(s)} | ${fmtShort(c)} | ${deltaStr(c.n ? -c.pnl : null)} |`);
  }
  md.push('');

  // Full ladder for atomic EDGE bands only
  md.push('## Full ladder by EDGE tier (residual)');
  md.push('');
  for (const { tier, rows, s } of profileRows.filter(({ tier: t }) => !['ALL', 'E_lt15', 'E15p'].includes(t.id))) {
    md.push(`### ${tier.label}`);
    md.push(`Base: **${fmtShort(s)}** · avgU ${n1(s.avgU)} · BOOST ${s.pctBoost == null ? '—' : `${s.pctBoost.toFixed(0)}%`} · meanFor ${n1(s.meanFor)} · meanAg ${n1(s.meanAg)}`);
    md.push('');
    md.push('| Cohort | n | W–L | WR | ROI | PnL | mute Δ |');
    md.push('|--------|--:|:---:|---:|----:|----:|-------:|');
    for (const rule of DRIFT_RULES) {
      const cut = rows.filter((r) => ruleTest(rule.id, r));
      const keep = rows.filter((r) => !ruleTest(rule.id, r));
      const c = agg(cut);
      const k = agg(keep);
      const wr = c.wr == null ? '—' : `${c.wr.toFixed(0)}%`;
      const roi = c.roi == null ? '—' : `${c.roi >= 0 ? '+' : ''}${c.roi.toFixed(0)}%`;
      const pnl = c.n ? `${c.pnl >= 0 ? '+' : ''}${c.pnl.toFixed(1)}u` : '—';
      const wl = c.n ? `${c.w}–${c.l}` : '—';
      md.push(`| ${rule.label} | ${c.n || 0} | ${wl} | ${wr} | ${roi} | ${pnl} | ${deltaStr(c.n ? -c.pnl : null)} |`);
      if ((rule.id.startsWith('dEv') || rule.id === 'late_poison') && c.n && k.n) {
        md.push(
          `| ↳ keep if muted | ${k.n} | ${k.w}–${k.l} | ${k.wr.toFixed(0)}% | ${k.roi >= 0 ? '+' : ''}${k.roi.toFixed(0)}% | ${k.pnl >= 0 ? '+' : ''}${k.pnl.toFixed(1)}u | — |`,
        );
      }
    }
    md.push('');
  }

  // Ticket dump high-E drifted
  md.push('## Ticket dump — EDGE≥15 ∧ dEv ≤ −1.5');
  md.push('');
  md.push('| Date | u | Path | Sport | E | meanFor | meanAg | first | lock | dEv | W/L | PnL |');
  md.push('|------|--:|------|-------|--:|--------:|-------:|------:|-----:|----:|:--:|----:|');
  const dump = residual
    .filter((r) => r.edge != null && r.edge >= 15 && r.dEv != null && r.dEv <= -1.5)
    .sort((a, b) => b.edge - a.edge || a.date.localeCompare(b.date));
  for (const r of dump) {
    md.push(
      `| ${r.date} | ${r.units.toFixed(1)} | ${r.path} | ${r.sport} | ${r.edge.toFixed(1)} | ${n1(r.meanFor)} | ${n1(r.meanAg)} | ${r.firstEv.toFixed(1)} | ${r.lockEv.toFixed(1)} | ${r.dEv.toFixed(1)} | ${r.won ? 'W' : 'L'} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)} |`,
    );
  }
  md.push('');

  // Improved high-E control
  md.push('## Control — EDGE≥15 ∧ improved/flat (dEv > −1)');
  md.push('');
  md.push('| Date | u | Path | Sport | E | first | lock | dEv | W/L | PnL |');
  md.push('|------|--:|------|-------|--:|------:|-----:|----:|:--:|----:|');
  const ctrl = residual
    .filter((r) => r.edge != null && r.edge >= 15 && r.dEv != null && r.dEv > -1)
    .sort((a, b) => a.date.localeCompare(b.date));
  for (const r of ctrl) {
    md.push(
      `| ${r.date} | ${r.units.toFixed(1)} | ${r.path} | ${r.sport} | ${r.edge.toFixed(1)} | ${r.firstEv.toFixed(1)} | ${r.lockEv.toFixed(1)} | ${r.dEv.toFixed(1)} | ${r.won ? 'W' : 'L'} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)} |`,
    );
  }
  const ctrlA = agg(ctrl);
  md.push('');
  md.push(`Control aggregate: **${fmtShort(ctrlA)}**`);
  md.push('');

  md.push('## Read');
  md.push('');
  md.push('1. Walk the EDGE ladder on cut ROI / mute Δ — does poison intensify as EDGE rises?');
  md.push('2. Compare drift *rate* vs cut *severity* — selection vs interaction.');
  md.push('3. Control (high-E, no drift) should stay healthy if the story is collision, not “high EDGE is bad.”');
  md.push('');

  const outMd = join(ROOT, 'tmp_ev_drift_by_edge_tier.md');
  const outJson = join(ROOT, 'tmp_ev_drift_by_edge_tier.json');
  writeFileSync(outMd, md.join('\n'));
  writeFileSync(outJson, JSON.stringify({
    generated: new Date().toISOString(),
    nResidual: residual.length,
    dates: { from: dates[0], to: dates[dates.length - 1] },
    profile: profileRows.map(({ tier, s }) => ({ tier: tier.id, label: tier.label, ...s })),
  }, null, 2));
  console.log(md.join('\n'));
  console.log(`\nWrote ${outMd}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
