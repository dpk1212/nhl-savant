#!/usr/bin/env node
/**
 * August 4u+ ACTUAL staked — shape hunt (W vs L), same spirit as sub-4 playbook.
 *
 * Universe: AGS-U promoted, COMPLETED WIN/LOSS, date in August 2026,
 *           finalUnits ≥ 4, not tracked. ACTUAL shipped book (no mute CF).
 *
 * Usage: node scripts/auditAug4uShapes.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { maxForSizeRatio } from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const FROM = '2026-08-01';
const TO = '2026-08-31';
const AGSU_PREFIX = 'ags-unified';
const PICK_COLLECTIONS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function initDb() {
  return getFirestore(initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  }));
}

function profitOf(units, odds, won) {
  if (!(units > 0) || !Number.isFinite(odds) || !odds) return 0;
  return won ? (odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100)) : -units;
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
    n, w, l,
    wr: n ? (100 * w) / n : null,
    stake,
    pnl,
    roi: stake > 0 ? (100 * pnl) / stake : null,
  };
}

function fmt(a) {
  if (!a || !a.n) return 'n=0';
  const wr = a.wr == null ? '—' : `${a.wr.toFixed(1)}%`;
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
  return `${String(a.n).padStart(3)}  ${String(a.w).padStart(2)}-${String(a.l).padStart(2)}  ${wr.padStart(6)}  ${a.stake.toFixed(1).padStart(7)}u  ${(a.pnl >= 0 ? '+' : '') + a.pnl.toFixed(2)}u`.padEnd(42) + `  ${roi.padStart(7)}`;
}

function mean(xs) {
  const v = xs.filter((x) => Number.isFinite(x));
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}
function med(xs) {
  const v = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

function pathOf(sd) {
  return sd.v8_hcStakeTier
    || sd.v8_agsV12Tier
    || sd.v8_stakePath
    || sd.v8_agsTier
    || '—';
}

function unitBand(u) {
  if (u >= 6) return '6u+';
  if (u >= 5.4) return '5.4u BOOST';
  if (u >= 5) return '5–5.39u';
  if (u >= 4) return '4–4.99u';
  return '<4';
}

async function load(db) {
  const rows = [];
  for (const [col, mkt] of PICK_COLLECTIONS) {
    const snap = await getDocs(collection(db, col));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() || {};
      const date = data.date;
      if (typeof date !== 'string' || date < FROM || date > TO) continue;
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (!sd || sd.superseded) continue;
        if (!(typeof sd.promotedBy === 'string' && sd.promotedBy.startsWith(AGSU_PREFIX))) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result || {};
        let won = null;
        if (res.outcome === 'WIN' || res.outcome === 'W') won = true;
        else if (res.outcome === 'LOSS' || res.outcome === 'L') won = false;
        if (won == null) continue;

        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        if (!(units >= 4)) continue;
        if (res.tracked === true) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const walletDetails = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const maxSR = maxForSizeRatio(walletDetails, sideKey);
        const forWallets = walletDetails.filter((w) => String(w.side) === String(sideKey)
          && (w.direction == null || String(w.direction).toUpperCase() === 'FOR'));
        const sumSR = forWallets.reduce((s, w) => {
          const sr = Number(w.sizeRatio ?? w.v8_sizeRatio ?? w.betMultiplier);
          return s + (Number.isFinite(sr) ? sr : 0);
        }, 0);

        const tapeAction = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_');
        const edge = Number(sd.v8_winnerAlignEdge);
        const tapeScore = Number(sd.v8_tapeScore);
        const meanFor = Number(sd.v8_winnerAlignMeanFor);
        const meanAg = Number(sd.v8_winnerAlignMeanAg);
        const forN = Number(sd.v8_winnerAlignForN);
        const agN = Number(sd.v8_winnerAlignAgN);
        const hasBoth = sd.v8_winnerAlignHasBoth === true
          || (Number.isFinite(forN) && forN > 0 && Number.isFinite(agN) && agN > 0);
        const qConv = Number(sd.v8_qConv);
        const hcMargin = Number(sd.v8_hcMargin);
        const path = pathOf(sd);
        const team = sd.team || (sideKey === 'home' ? data.home : sideKey === 'away' ? data.away : sideKey);

        rows.push({
          id: docSnap.id,
          date,
          sport: data.sport || '',
          mkt,
          team,
          side: sideKey,
          path,
          units,
          odds,
          won,
          profit: profitOf(units, odds, won),
          tapeAction: tapeAction || '—',
          tapeScore: Number.isFinite(tapeScore) ? tapeScore : null,
          edge: Number.isFinite(edge) ? edge : null,
          meanFor: Number.isFinite(meanFor) ? meanFor : null,
          meanAg: Number.isFinite(meanAg) ? meanAg : null,
          forN: Number.isFinite(forN) ? forN : null,
          agN: Number.isFinite(agN) ? agN : null,
          hasBoth,
          maxSR,
          sumSR,
          forWalletN: forWallets.length,
          qConv: Number.isFinite(qConv) ? qConv : null,
          hcMargin: Number.isFinite(hcMargin) ? hcMargin : null,
          mutedBy: sd.mutedBy || '',
          fav: odds < 0,
          dog: odds > 0,
          plus120: odds > 120,
        });
      }
    }
  }
  return rows;
}

function section(lines, title) {
  lines.push('', `## ${title}`, '');
}

function bucketTable(lines, rows, keyFn, label = 'bucket', minN = 1) {
  const map = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (k == null || k === '') continue;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  }
  const entries = [...map.entries()]
    .map(([k, rs]) => [k, agg(rs)])
    .filter(([, a]) => a.n >= minN)
    .sort((a, b) => (b[1].roi ?? -999) - (a[1].roi ?? -999));
  lines.push(`| ${label} | n | W–L | WR | Stake | PnL | ROI |`);
  lines.push(`|---------|--:|:---:|---:|------:|----:|----:|`);
  for (const [k, a] of entries) {
    const mark = (a.roi ?? 0) <= -15 ? '🔴' : (a.roi ?? 0) >= 15 ? '🟢' : '  ';
    lines.push(`| ${mark} ${k} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(1)}% | ${a.stake.toFixed(1)}u | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }
}

function ruleEval(lines, rows, rules) {
  lines.push('| Rule | Match n/W–L/ROI/PnL | Rest n/W–L/ROI/PnL | ΔPnL if cut match |');
  lines.push('|------|---------------------|--------------------|-------------------|');
  const base = agg(rows);
  for (const { name, fn, kind } of rules) {
    const match = rows.filter(fn);
    const rest = rows.filter((r) => !fn(r));
    const m = agg(match);
    const o = agg(rest);
    if (!m.n) continue;
    const cutDelta = kind === 'CUT' ? (o.pnl - base.pnl) : null;
    const keepNote = kind === 'CUT'
      ? `${cutDelta >= 0 ? '+' : ''}${cutDelta.toFixed(2)}u`
      : '—';
    const mf = `${m.n} ${m.w}–${m.l} ${m.roi >= 0 ? '+' : ''}${m.roi.toFixed(0)}% ${m.pnl >= 0 ? '+' : ''}${m.pnl.toFixed(1)}u`;
    const of = `${o.n} ${o.w}–${o.l} ${o.roi == null ? '—' : `${o.roi >= 0 ? '+' : ''}${o.roi.toFixed(0)}%`} ${o.pnl >= 0 ? '+' : ''}${o.pnl.toFixed(1)}u`;
    const mark = kind === 'CUT' && (m.roi ?? 0) <= -10 ? '🔴' : kind === 'KEEP' && (m.roi ?? 0) >= 15 ? '🟢' : '  ';
    lines.push(`| ${mark} ${kind}: ${name} | ${mf} | ${of} | ${keepNote} |`);
  }
}

async function main() {
  const rows = await load(initDb());
  const lines = [];
  const out = (s = '') => { lines.push(s); console.log(s); };

  const base = agg(rows);
  const winners = rows.filter((r) => r.won);
  const losers = rows.filter((r) => !r.won);

  out('# August 2026 — 4u+ ACTUAL staked shape hunt');
  out(`Universe: AGS-U COMPLETED, \`finalUnits ≥ 4\`, not tracked, dates **${FROM} → ${TO}** (actual shipped).`);
  out(`Generated: ${new Date().toISOString()}`);
  out('');
  out(`**Baseline: ${base.n} tickets · ${base.w}–${base.l} · ${base.wr.toFixed(1)}% WR · stake ${base.stake.toFixed(1)}u · PnL ${base.pnl >= 0 ? '+' : ''}${base.pnl.toFixed(2)}u · ROI ${base.roi >= 0 ? '+' : ''}${base.roi.toFixed(1)}%**`);
  out(`Winners n=${winners.length} · Losers n=${losers.length}`);

  section(lines, '1. Unit band');
  bucketTable(lines, rows, (r) => unitBand(r.units), 'band');

  section(lines, '2. Path (structure)');
  bucketTable(lines, rows, (r) => r.path, 'path');

  section(lines, '3. Continuous features — W mean vs L mean');
  const feats = [
    ['EDGE', (r) => r.edge],
    ['tapeScore', (r) => r.tapeScore],
    ['meanFor', (r) => r.meanFor],
    ['meanAg', (r) => r.meanAg],
    ['forN', (r) => r.forN],
    ['agN', (r) => r.agN],
    ['maxSR', (r) => r.maxSR],
    ['sumSR', (r) => r.sumSR],
    ['# FOR wallets', (r) => r.forWalletN],
    ['qConv', (r) => r.qConv],
    ['hcMargin', (r) => r.hcMargin],
    ['odds', (r) => r.odds],
    ['units', (r) => r.units],
  ];
  lines.push('| Feature | W n | W mean | W med | L n | L mean | L med | Δmean |');
  lines.push('|---------|----:|-------:|------:|----:|-------:|------:|------:|');
  for (const [name, fn] of feats) {
    const wv = winners.map(fn).filter((x) => Number.isFinite(x));
    const lv = losers.map(fn).filter((x) => Number.isFinite(x));
    const wm = mean(wv); const lm = mean(lv);
    if (wm == null && lm == null) continue;
    const d = (wm ?? 0) - (lm ?? 0);
    lines.push(`| ${name} | ${wv.length} | ${wm?.toFixed(2) ?? '—'} | ${med(wv)?.toFixed(2) ?? '—'} | ${lv.length} | ${lm?.toFixed(2) ?? '—'} | ${med(lv)?.toFixed(2) ?? '—'} | ${d >= 0 ? '+' : ''}${d.toFixed(2)} |`);
  }

  section(lines, '4. Tape action');
  bucketTable(lines, rows, (r) => r.tapeAction, 'tape');
  lines.push('');
  lines.push('HOLD by tapeScore band:');
  bucketTable(lines, rows.filter((r) => r.tapeAction === 'HOLD'), (r) => {
    if (r.tapeScore == null) return 'HOLD ?';
    if (r.tapeScore < 0.5) return 'HOLD low(<0.5)';
    if (r.tapeScore < 1.5) return 'HOLD mid';
    return 'HOLD high(≥1.5)';
  }, 'band');

  section(lines, '5. EDGE bands');
  bucketTable(lines, rows, (r) => {
    if (r.edge == null) return 'E ?';
    if (r.edge < -5) return 'E<-5';
    if (r.edge < 0) return 'E -5..0';
    if (r.edge < 5) return 'E 0..5';
    if (r.edge < 10) return 'E 5..10';
    return 'E≥10';
  }, 'EDGE');

  section(lines, '6. Odds bands');
  bucketTable(lines, rows, (r) => {
    const o = r.odds;
    if (!(o > 0) && !(o < 0)) return 'odds?';
    if (o <= -200) return '≤-200';
    if (o <= -150) return '-199..-150';
    if (o <= -120) return '-149..-120';
    if (o < 0) return '-119..-100';
    if (o <= 120) return '+100..+120';
    if (o <= 150) return '+121..+150';
    if (o <= 200) return '+151..+200';
    return '>+200';
  }, 'odds');
  lines.push('');
  lines.push(`favorites: ${fmt(agg(rows.filter((r) => r.fav)))}`);
  lines.push(`dogs:      ${fmt(agg(rows.filter((r) => r.dog)))}`);
  lines.push(`plus>+120: ${fmt(agg(rows.filter((r) => r.plus120)))}`);

  section(lines, '7. Sport × market');
  bucketTable(lines, rows, (r) => `${r.sport} ${r.mkt}`, 'sport×mkt');

  section(lines, '8. maxSR bands (FOR sizeRatio)');
  bucketTable(lines, rows, (r) => {
    if (r.maxSR == null) return 'maxSR missing';
    if (r.maxSR < 0.5) return 'maxSR <0.5';
    if (r.maxSR < 1) return 'maxSR 0.5–1';
    if (r.maxSR < 2) return 'maxSR 1–2';
    return 'maxSR ≥2';
  }, 'maxSR');

  section(lines, '9. Path × Tape');
  bucketTable(lines, rows, (r) => `${r.path} × ${r.tapeAction}`, 'path×tape', 2);

  section(lines, '10. Path × unit band');
  bucketTable(lines, rows, (r) => `${r.path} × ${unitBand(r.units)}`, 'path×u', 2);

  section(lines, '11. Path × maxSR&lt;1 vs ≥1');
  bucketTable(lines, rows.filter((r) => r.maxSR != null), (r) => `${r.path} × ${r.maxSR < 1 ? 'SR<1' : 'SR≥1'}`, 'path×SR', 2);

  section(lines, '12. Interaction hunt — CUT / KEEP rules');
  ruleEval(lines, rows, [
    { name: 'FAIL_OPEN', kind: 'CUT', fn: (r) => r.tapeAction === 'FAIL_OPEN' },
    { name: 'maxSR < 1', kind: 'CUT', fn: (r) => r.maxSR != null && r.maxSR < 1 },
    { name: 'maxSR < 0.5', kind: 'CUT', fn: (r) => r.maxSR != null && r.maxSR < 0.5 },
    { name: 'BOOST + maxSR < 1', kind: 'CUT', fn: (r) => r.tapeAction === 'BOOST' && r.maxSR != null && r.maxSR < 1 },
    { name: 'HOLD + maxSR < 1', kind: 'CUT', fn: (r) => r.tapeAction === 'HOLD' && r.maxSR != null && r.maxSR < 1 },
    { name: 'E≥10', kind: 'CUT', fn: (r) => r.edge != null && r.edge >= 10 },
    { name: 'BOOST + E≥10', kind: 'CUT', fn: (r) => r.tapeAction === 'BOOST' && r.edge != null && r.edge >= 10 },
    { name: 'TOP path', kind: 'CUT', fn: (r) => r.path === 'TOP' || r.path === 'TOP+' },
    { name: 'TOP × FAIL_OPEN', kind: 'CUT', fn: (r) => (r.path === 'TOP' || r.path === 'TOP+') && r.tapeAction === 'FAIL_OPEN' },
    { name: 'TOP × maxSR<1', kind: 'CUT', fn: (r) => (r.path === 'TOP' || r.path === 'TOP+') && r.maxSR != null && r.maxSR < 1 },
    { name: 'SHARP-LEAN', kind: 'CUT', fn: (r) => r.path === 'SHARP-LEAN' },
    { name: 'SHARP-LEAN × BOOST', kind: 'CUT', fn: (r) => r.path === 'SHARP-LEAN' && r.tapeAction === 'BOOST' },
    { name: 'SHARP-LEAN × maxSR<1', kind: 'CUT', fn: (r) => r.path === 'SHARP-LEAN' && r.maxSR != null && r.maxSR < 1 },
    { name: 'RANK × maxSR<1', kind: 'CUT', fn: (r) => r.path === 'RANK' && r.maxSR != null && r.maxSR < 1 },
    { name: 'SHARP × maxSR<1', kind: 'CUT', fn: (r) => r.path === 'SHARP' && r.maxSR != null && r.maxSR < 1 },
    { name: '!hasBoth (unopposed)', kind: 'CUT', fn: (r) => !r.hasBoth },
    { name: 'favorites ≤-200 chalk', kind: 'CUT', fn: (r) => r.odds <= -200 },
    { name: 'odds -199..-150', kind: 'CUT', fn: (r) => r.odds <= -150 && r.odds > -200 },
    { name: 'plus-money >+120', kind: 'CUT', fn: (r) => r.plus120 },
    { name: 'WNBA', kind: 'CUT', fn: (r) => r.sport === 'WNBA' },
    { name: 'MLB TOTAL', kind: 'CUT', fn: (r) => r.sport === 'MLB' && r.mkt === 'TOTAL' },
    { name: 'NFL', kind: 'CUT', fn: (r) => r.sport === 'NFL' },
    { name: 'meanFor < 50', kind: 'CUT', fn: (r) => r.meanFor != null && r.meanFor < 50 },
    { name: 'EDGE < 0', kind: 'CUT', fn: (r) => r.edge != null && r.edge < 0 },
    { name: 'MINI path', kind: 'KEEP', fn: (r) => r.path === 'MINI' },
    { name: 'SHARP path', kind: 'KEEP', fn: (r) => r.path === 'SHARP' },
    { name: 'SUPER path', kind: 'KEEP', fn: (r) => r.path === 'SUPER' },
    { name: 'BOOST (any)', kind: 'KEEP', fn: (r) => r.tapeAction === 'BOOST' },
    { name: 'maxSR ≥ 1', kind: 'KEEP', fn: (r) => r.maxSR != null && r.maxSR >= 1 },
    { name: 'maxSR ≥ 2', kind: 'KEEP', fn: (r) => r.maxSR != null && r.maxSR >= 2 },
    { name: 'hasBoth', kind: 'KEEP', fn: (r) => r.hasBoth },
    { name: 'UFC', kind: 'KEEP', fn: (r) => r.sport === 'UFC' },
  ]);

  section(lines, '13. Stacked playbooks (what lifts ROI if we cut losers)');
  const playbooks = [
    {
      name: 'A. Cut FAIL_OPEN only',
      keep: (r) => r.tapeAction !== 'FAIL_OPEN',
    },
    {
      name: 'B. Cut maxSR < 1',
      keep: (r) => !(r.maxSR != null && r.maxSR < 1),
    },
    {
      name: 'C. Cut FAIL_OPEN OR maxSR < 1',
      keep: (r) => r.tapeAction !== 'FAIL_OPEN' && !(r.maxSR != null && r.maxSR < 1),
    },
    {
      name: 'D. Cut TOP (all)',
      keep: (r) => r.path !== 'TOP' && r.path !== 'TOP+',
    },
    {
      name: 'E. Cut TOP × (FAIL_OPEN OR maxSR<1)',
      keep: (r) => !((r.path === 'TOP' || r.path === 'TOP+')
        && (r.tapeAction === 'FAIL_OPEN' || (r.maxSR != null && r.maxSR < 1))),
    },
    {
      name: 'F. Cut SHARP-LEAN × maxSR<1',
      keep: (r) => !(r.path === 'SHARP-LEAN' && r.maxSR != null && r.maxSR < 1),
    },
    {
      name: 'G. Cut chalk ≤-200',
      keep: (r) => !(r.odds <= -200),
    },
    {
      name: 'H. Keep only maxSR≥1 AND not FAIL_OPEN',
      keep: (r) => r.tapeAction !== 'FAIL_OPEN' && r.maxSR != null && r.maxSR >= 1,
    },
    {
      name: 'I. Keep MINI + SHARP + SUPER + RANK(SR≥1)',
      keep: (r) => r.path === 'MINI' || r.path === 'SHARP' || r.path === 'SUPER'
        || (r.path === 'RANK' && (r.maxSR == null || r.maxSR >= 1)),
    },
    {
      name: 'J. Cut WNBA 4u+',
      keep: (r) => r.sport !== 'WNBA',
    },
    {
      name: 'K. Cut BOOST+maxSR<1 (keep other BOOST)',
      keep: (r) => !(r.tapeAction === 'BOOST' && r.maxSR != null && r.maxSR < 1),
    },
    {
      name: 'L. Cut HOLD+maxSR<1 only (leave BOOST+SR<1)',
      keep: (r) => !(r.tapeAction === 'HOLD' && r.maxSR != null && r.maxSR < 1),
    },
  ];
  lines.push(`Baseline: ${fmt(base)}`);
  lines.push('');
  lines.push('| Playbook | KEEP n/W–L/ROI/PnL | DROP n/W–L/ROI/PnL | ΔPnL vs baseline |');
  lines.push('|----------|--------------------|--------------------|------------------|');
  for (const pb of playbooks) {
    const keep = rows.filter(pb.keep);
    const drop = rows.filter((r) => !pb.keep(r));
    const k = agg(keep);
    const d = agg(drop);
    const delta = k.pnl - base.pnl;
    lines.push(`| ${pb.name} | ${k.n} ${k.w}–${k.l} ${k.roi == null ? '—' : `${k.roi >= 0 ? '+' : ''}${k.roi.toFixed(0)}%`} ${k.pnl >= 0 ? '+' : ''}${k.pnl.toFixed(1)}u | ${d.n || 0} ${d.n ? `${d.w}–${d.l} ${d.roi >= 0 ? '+' : ''}${d.roi.toFixed(0)}% ${d.pnl >= 0 ? '+' : ''}${d.pnl.toFixed(1)}u` : '—'} | ${delta >= 0 ? '+' : ''}${delta.toFixed(2)}u |`);
  }

  section(lines, '14. Loser pick list (all August 4u+ losses)');
  lines.push('| Date | Sport | Pick | Path | U | Tape | maxSR | EDGE | Odds | PnL |');
  lines.push('|------|-------|------|------|--:|------|------:|-----:|-----:|----:|');
  for (const r of losers.sort((a, b) => a.date.localeCompare(b.date) || a.profit - b.profit)) {
    lines.push(`| ${r.date} | ${r.sport} | ${String(r.team).replace(/\|/g, '/')} | ${r.path} | ${r.units.toFixed(2)} | ${r.tapeAction} | ${r.maxSR == null ? '—' : r.maxSR.toFixed(2)} | ${r.edge == null ? '—' : r.edge.toFixed(1)} | ${r.odds} | ${r.profit.toFixed(2)}u |`);
  }

  section(lines, '15. Day-by-day 4u+');
  lines.push('| Date | n | W–L | PnL | ROI |');
  lines.push('|------|--:|:---:|----:|----:|');
  const byDay = new Map();
  for (const r of rows) {
    if (!byDay.has(r.date)) byDay.set(r.date, []);
    byDay.get(r.date).push(r);
  }
  for (const [d, rs] of [...byDay.entries()].sort()) {
    const a = agg(rs);
    lines.push(`| ${d} | ${a.n} | ${a.w}–${a.l} | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }

  // print + write
  for (const s of lines) console.log(s);
  const mdPath = join(REPO_ROOT, 'tmp_aug_4u_shapes.md');
  writeFileSync(mdPath, `${lines.join('\n')}\n`);
  const jsonPath = join(REPO_ROOT, 'tmp_aug_4u_shapes.json');
  writeFileSync(jsonPath, JSON.stringify({
    from: FROM, to: TO, generated: new Date().toISOString(), baseline: base, rows,
  }, null, 2));
  console.log(`\nWrote ${mdPath}`);
  console.log(`Wrote ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
