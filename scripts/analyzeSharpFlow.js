/**
 * Sharp Flow — Complete Performance Analysis
 *
 * Mirrors UI logic exactly:
 *   • Overall = picks with stars >= 2.5 (UI picks array)
 *   • Profit  = stored result.profit for wins, -units for losses
 *   • Stars   = peak.stars ?? estimateStarsFromSnap() for pre-2026-03-26 docs
 *   • Buckets = integer (5/4/3) AND half-star (5/4.5/4/3.5/3/2.5)
 *
 * Breakdowns:
 *   ① All Time / This Week / Yesterday / Today — each with half-star rows
 *   ② TOP PICK segment (Δ ≥ 1.0★) — same time/star breakdown
 *   ③ Complete signal analysis (EV, Pinnacle, Sharp count, Criteria, Odds)
 *   ④ Sport × Tier matrix
 *   ⑤ Daily trend (full history)
 *
 * Usage: node scripts/analyzeSharpFlow.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// ── Firebase init ─────────────────────────────────────────────────────────────
function initFirebase() {
  if (!admin.apps.length) {
    try {
      const sak = JSON.parse(readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8'));
      admin.initializeApp({ credential: admin.credential.cert(sak) });
    } catch {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: process.env.VITE_FIREBASE_PROJECT_ID,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
  return admin.firestore();
}
const db = initFirebase();

// ── Date helpers ──────────────────────────────────────────────────────────────
function etDate(offset = 0) {
  const now = new Date();
  const et  = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  et.setDate(et.getDate() + offset);
  return et.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}
function etMonday() {
  const now = new Date();
  const et  = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay();
  const diff = et.getDate() - day + (day === 0 ? -6 : 1);
  et.setDate(diff);
  return et.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

// ── Mirror: estimateStarsFromSnap ─────────────────────────────────────────────
function estimateStars(snap) {
  if (!snap) return 3;
  let pts = 0;
  const cg = snap.consensusStrength?.grade || '';
  if (cg === 'DOMINANT') pts += 3;
  else if (cg === 'STRONG') pts += 2;
  else if (cg === 'LEAN') pts += 0.5;
  const pinnConf = !!snap.criteria?.pinnacleConfirms;
  const lineWith = !!snap.criteria?.lineMovingWith;
  if (pinnConf && lineWith) pts += 3; else if (pinnConf) pts += 1.5; else if (lineWith) pts += 1.5;
  const sc = snap.sharpCount || 0;
  const inv = snap.totalInvested || 0;
  const avgInv = sc > 0 ? inv / sc : inv;
  const conv = avgInv > 0 ? Math.min(1, Math.max(0, (Math.log10(avgInv) - 2) / 2)) : 0;
  if (conv >= 0.8) pts += 1.5; else if (conv >= 0.5) pts += 1; else if (conv >= 0.25) pts += 0.5;
  const ev = snap.evEdge || 0;
  if (ev > 3) pts += 1; else if (ev > 1) pts += 0.5; else if (ev > 0) pts -= 0.5;
  if (snap.criteria?.predMarketAligns) pts += 0.5;
  return Math.min(5, Math.max(0.5, Math.round(((pts / 12) * 5) * 2) / 2));
}

const intBucket  = (s) => s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1;
const halfBucket = (s) => Math.round(s * 2) / 2;
const STARS_LIVE_DATE = '2026-03-26';

// ── Formatting helpers ────────────────────────────────────────────────────────
const W = { label: 40, n: 5, rec: 9, pct: 7, profit: 10, roi: 8 };
const DIVIDER = '─'.repeat(W.label + W.n + W.rec + W.pct + W.profit + W.roi + 14);

function fmt(v, d = 2) { return (v >= 0 ? '+' : '') + v.toFixed(d); }
function pct(w, n)     { return n > 0 ? (w / n * 100).toFixed(1) + '%' : '—'; }
function roi(p, u)     { return u > 0 ? (p / u * 100).toFixed(1) + '%' : '—'; }

function starGlyph(s) {
  const full = Math.floor(s), half = s % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
}

function printRow(label, bets, indent = '') {
  if (!bets.length) return;
  const w = bets.filter(b => b.outcome === 'WIN').length;
  const l = bets.filter(b => b.outcome === 'LOSS').length;
  const p = bets.filter(b => b.outcome === 'PUSH').length;
  const profit = +bets.reduce((s, b) => s + b.profit, 0).toFixed(2);
  const units  = bets.reduce((s, b) => s + b.units, 0);
  const icon   = profit >= 0 ? '🟢' : '🔴';
  const rec    = `${w}-${l}${p > 0 ? `-${p}` : ''}`;
  console.log(
    `${indent}${icon} ${label.padEnd(W.label)}` +
    `${String(w + l + p).padStart(W.n)}` +
    `  ${rec.padStart(W.rec)}` +
    `  ${pct(w, w + l).padStart(W.pct)}` +
    `  ${(fmt(profit) + 'u').padStart(W.profit)}` +
    `  ROI ${roi(profit, units).padStart(W.roi)}`
  );
}

function hdr(title) {
  console.log(`\n  ╔══ ${title} ${'═'.repeat(Math.max(1, 80 - title.length))}╗`);
  console.log(`  ${'  ' + ' '.repeat(W.label)}${'n'.padStart(W.n)}  ${'Record'.padStart(W.rec)}  ${'Win%'.padStart(W.pct)}  ${'Profit'.padStart(W.profit)}  ROI`);
  console.log(`  ${DIVIDER}`);
}

function sep(label = '') {
  if (label) console.log(`\n    ── ${label}`);
  else console.log('');
}

// ── Core stats from picks array ───────────────────────────────────────────────
function overall(bets) {
  const w = bets.filter(b => b.outcome === 'WIN').length;
  const l = bets.filter(b => b.outcome === 'LOSS').length;
  const p = bets.filter(b => b.outcome === 'PUSH').length;
  const profit = +bets.reduce((s, b) => s + b.profit, 0).toFixed(2);
  const units  = bets.reduce((s, b) => s + b.units, 0);
  const icon   = profit >= 0 ? '🟢' : '🔴';
  return { w, l, p, profit, units, icon,
    record: `${w}-${l}${p > 0 ? `-${p}` : ''}`,
    winPct: pct(w, w + l), roiStr: roi(profit, units) };
}

// ── Print star breakdown (integer + half) for a given slice ──────────────────
function printStarBreakdown(bets, indent = '  ') {
  sep('By conviction — integer tiers');
  for (const s of [5, 4, 3, 2]) {
    const label = s === 5 ? '  ★★★★★  5★ (≥4.5)' :
                  s === 4 ? '  ★★★★☆  4★ (3.5–4.4)' :
                  s === 3 ? '  ★★★☆☆  3★ (2.5–3.4)' :
                             '  ★★☆☆☆  2★ (1.5–2.4)';
    printRow(label, bets.filter(b => intBucket(b.stars) === s), indent);
  }

  sep('By half-star');
  for (const s of [5, 4.5, 4, 3.5, 3, 2.5]) {
    const bucket = bets.filter(b => halfBucket(b.stars) === s);
    if (!bucket.length) continue;
    printRow(`  ${starGlyph(s)}  ${s}★`, bucket, indent);
  }
}

// ── Print TOP PICK breakdown ──────────────────────────────────────────────────
function printTopPickBreakdown(bets, indent = '  ') {
  const withDelta = bets.filter(b => b.lockStars > 0);
  const tp15  = withDelta.filter(b => b.starDelta >= 1.5);
  const tp10  = withDelta.filter(b => b.starDelta >= 1.0 && b.starDelta < 1.5);
  const tpAny = withDelta.filter(b => b.starDelta >= 1.0);
  const noG   = withDelta.filter(b => b.starDelta < 1.0);
  const noLD  = bets.filter(b => !b.lockStars);

  printRow('🔥 TOP PICK +1u   (Δ ≥ 1.5★)', tp15, indent);
  printRow('⚡ TOP PICK +0.5u (Δ ≥ 1.0★, <1.5★)', tp10, indent);
  sep();
  printRow('Any TOP PICK (Δ ≥ 1.0★)', tpAny, indent);
  printRow('No growth   (Δ < 1.0★)',  noG, indent);
  if (noLD.length) printRow('No lock data (legacy)', noLD, indent);

  if (tpAny.length) {
    sep('TOP PICK by half-star');
    for (const s of [5, 4.5, 4, 3.5, 3, 2.5]) {
      const b = tpAny.filter(p => halfBucket(p.stars) === s);
      if (!b.length) continue;
      printRow(`  TOP PICK @ ${starGlyph(s)}  ${s}★`, b, indent);
    }
  }

  return { tpAny, noG, noLD };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const TODAY     = etDate(0);
  const YESTERDAY = etDate(-1);
  const MONDAY    = etMonday();
  const D7        = etDate(-7);
  const D14       = etDate(-14);
  const D30       = etDate(-30);

  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  console.log('\n');
  console.log('╔' + '═'.repeat(91) + '╗');
  console.log('║  SHARP FLOW — COMPLETE PERFORMANCE ANALYSIS' + ' '.repeat(47) + '║');
  console.log(`║  Generated: ${now}` + ' '.repeat(Math.max(1, 91 - 14 - now.length)) + '║');
  console.log('╚' + '═'.repeat(91) + '╝');

  // ── Fetch all docs ──────────────────────────────────────────────────────────
  const snap = await db.collection('sharpFlowPicks').get();

  // ── Build picks array (mirrors UI: stars >= 2.5 only) ─────────────────────
  const picks = [];
  snap.forEach(d => {
    const data = d.data();
    const isPost = data.date >= STARS_LIVE_DATE;

    const side = (sd) => {
      const best = sd.peak || sd.lock;
      const lock = sd.lock || best;
      const rawS = best?.stars ?? estimateStars(best);
      const pkS  = isPost ? (best?.stars ?? 0) : rawS;
      if (pkS < 2.5) return;
      const lkS  = lock?.stars ?? 0;
      const u    = best?.units || 1;
      const delta = +(pkS - lkS).toFixed(1);
      let outcome = null, profit = 0;
      if (sd.status === 'COMPLETED') {
        outcome = sd.result?.outcome || null;
        if (outcome === 'WIN')       profit = sd.result?.profit ?? 0;
        else if (outcome === 'LOSS') profit = -u;
      }
      picks.push({
        date: data.date, sport: data.sport || 'NHL',
        stars: pkS, lockStars: lkS, starDelta: delta, units: u,
        status: sd.status || 'PENDING', outcome, profit,
        evEdge: best?.evEdge ?? null, lockEV: lock?.evEdge ?? null,
        pinnConf: !!(best?.criteria?.pinnacleConfirms),
        lineWith: !!(best?.criteria?.lineMovingWith),
        invested7k: !!(best?.criteria?.invested7kPlus),
        predAligns: !!(best?.criteria?.predMarketAligns),
        sharpCount: best?.sharpCount ?? 0,
        criteriaMet: best?.criteriaMet ?? 0,
        odds: best?.odds ?? lock?.odds ?? null,
        clv: sd.result?.clv ?? null,
        hasOpposition: !!(sd.lock?.opposition?.sharpCount > 0),
      });
    };

    if (data.sides) {
      for (const sd of Object.values(data.sides)) side(sd);
    } else {
      const rawS = data.stars ?? estimateStars(data);
      const pkS  = isPost ? (data.stars ?? 0) : rawS;
      if (pkS < 2.5) return;
      const u    = data.units || 1;
      let outcome = null, profit = 0;
      if (data.status === 'COMPLETED') {
        outcome = data.result?.outcome || null;
        if (outcome === 'WIN')       profit = data.result?.profit ?? 0;
        else if (outcome === 'LOSS') profit = -u;
      }
      picks.push({
        date: data.date, sport: data.sport || 'NHL',
        stars: pkS, lockStars: 0, starDelta: 0, units: u,
        status: data.status || 'PENDING', outcome, profit,
        evEdge: null, lockEV: null, pinnConf: false, lineWith: false,
        invested7k: false, predAligns: false, sharpCount: 0, criteriaMet: 0,
        odds: data.odds ?? null, clv: null, hasOpposition: false,
      });
    }
  });

  const graded = picks.filter(p => p.outcome);
  const allDates = [...new Set(graded.map(p => p.date))].sort();

  console.log(`\n  Docs: ${snap.size}  |  Picks ≥2.5★: ${picks.length}  |  Graded: ${graded.length}`);
  console.log(`  Date range: ${allDates[0]} → ${allDates[allDates.length - 1]}`);
  console.log(`  Today: ${TODAY}  |  Yesterday: ${YESTERDAY}  |  Week from: ${MONDAY}\n`);

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 1 — PERFORMANCE BY TIME PERIOD (with star breakdown)
  // ════════════════════════════════════════════════════════════════════════════

  const periods = [
    { label: 'ALL TIME',       fn: () => true },
    { label: 'THIS WEEK',      fn: p => p.date >= MONDAY },
    { label: 'YESTERDAY',      fn: p => p.date === YESTERDAY },
    { label: 'TODAY',          fn: p => p.date === TODAY },
    { label: 'LAST 7 DAYS',    fn: p => p.date >= D7 },
    { label: 'LAST 14 DAYS',   fn: p => p.date >= D14 },
    { label: 'LAST 30 DAYS',   fn: p => p.date >= D30 },
  ];

  for (const period of periods) {
    const slice = graded.filter(period.fn);
    if (!slice.length) continue;

    const ov = overall(slice);
    console.log('\n' + '═'.repeat(93));
    console.log(`  ${ov.icon}  ${period.label} — ${slice.length} graded picks  |  ${ov.record}  ${ov.winPct} WR  ${fmt(ov.profit)}u profit  ROI ${ov.roiStr}`);
    console.log('═'.repeat(93));

    hdr('BY CONVICTION RATING');
    printStarBreakdown(slice);

    hdr('TOP PICK SEGMENT');
    printTopPickBreakdown(slice);
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 2 — SPORT BREAKDOWN
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(93));
  console.log('  SPORT BREAKDOWN — ALL TIME');
  console.log('═'.repeat(93));

  for (const sport of ['NHL', 'MLB', 'NBA', 'CBB']) {
    const s = graded.filter(p => p.sport === sport);
    if (!s.length) continue;
    const ov = overall(s);
    console.log(`\n  ${ov.icon}  ${sport}  ${ov.record}  ${ov.winPct} WR  ${fmt(ov.profit)}u  ROI ${ov.roiStr}`);
    hdr(`${sport} — BY HALF-STAR`);
    for (const stars of [5, 4.5, 4, 3.5, 3, 2.5]) {
      const b = s.filter(p => halfBucket(p.stars) === stars);
      if (!b.length) continue;
      printRow(`  ${starGlyph(stars)}  ${stars}★`, b);
    }
    hdr(`${sport} — TOP PICK SEGMENT`);
    printTopPickBreakdown(s);
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 3 — SIGNAL ANALYSIS
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(93));
  console.log('  COMPLETE SIGNAL ANALYSIS — ALL TIME');
  console.log('═'.repeat(93));

  hdr('EV EDGE');
  printRow('EV ≥ 3%  (prime)',          graded.filter(p => p.evEdge != null && p.evEdge >= 3));
  printRow('EV 1–3%  (solid)',          graded.filter(p => p.evEdge != null && p.evEdge >= 1 && p.evEdge < 3));
  printRow('EV 0–1%  (soft — trap?)',   graded.filter(p => p.evEdge != null && p.evEdge > 0 && p.evEdge < 1));
  printRow('EV ≤ 0   (negative)',       graded.filter(p => p.evEdge != null && p.evEdge <= 0));
  printRow('No EV data',                graded.filter(p => p.evEdge == null));

  hdr('PINNACLE CONFIRMATION');
  printRow('Pinnacle confirms',         graded.filter(p => p.pinnConf));
  printRow('No Pinnacle confirmation',  graded.filter(p => !p.pinnConf));
  sep('by star tier');
  for (const s of [5, 4, 3]) {
    printRow(`  Pinn ✓ @ ${s}★ bucket`,  graded.filter(p => intBucket(p.stars) === s && p.pinnConf));
    printRow(`  Pinn ✗ @ ${s}★ bucket`,  graded.filter(p => intBucket(p.stars) === s && !p.pinnConf));
  }

  hdr('LINE MOVEMENT');
  printRow('Line moving WITH pick',     graded.filter(p => p.lineWith));
  printRow('Line NOT moving with pick', graded.filter(p => !p.lineWith));

  hdr('INVESTMENT SIZE');
  printRow('$7K+ invested (heavy)',     graded.filter(p => p.invested7k));
  printRow('Under $7K',                graded.filter(p => !p.invested7k));

  hdr('PREDICTION MARKET');
  printRow('Pred market aligns',        graded.filter(p => p.predAligns));
  printRow('Pred market diverges',      graded.filter(p => !p.predAligns));

  hdr('SHARP COUNT');
  printRow('1–2 sharps',               graded.filter(p => p.sharpCount >= 1 && p.sharpCount <= 2));
  printRow('3–5 sharps',               graded.filter(p => p.sharpCount >= 3 && p.sharpCount <= 5));
  printRow('6–9 sharps',               graded.filter(p => p.sharpCount >= 6 && p.sharpCount <= 9));
  printRow('10–12 sharps',             graded.filter(p => p.sharpCount >= 10 && p.sharpCount <= 12));
  printRow('13+ sharps',               graded.filter(p => p.sharpCount >= 13));

  hdr('CRITERIA MET (out of 6)');
  for (const n of [6, 5, 4, 3, 2, 1]) {
    printRow(`${n}/6 criteria`,         graded.filter(p => p.criteriaMet === n));
  }

  hdr('ODDS RANGE');
  const wo = graded.filter(p => p.odds != null);
  printRow('Heavy fav  (≤ -200)',       wo.filter(p => p.odds <= -200));
  printRow('Favorite   (-199 to -120)', wo.filter(p => p.odds > -200 && p.odds <= -120));
  printRow('Slight fav (-119 to -101)', wo.filter(p => p.odds > -120 && p.odds < 0));
  printRow('Pick/near-even (0 to +130)',wo.filter(p => p.odds >= 0 && p.odds <= 130));
  printRow('Dog    (+131 to +200)',     wo.filter(p => p.odds > 130 && p.odds <= 200));
  printRow('Big dog (+201+)',           wo.filter(p => p.odds > 200));

  // ── Signal combos ────────────────────────────────────────────────────────
  hdr('KEY SIGNAL COMBINATIONS');
  const tp = graded.filter(p => p.lockStars > 0 && p.starDelta >= 1.0);
  const noTp = graded.filter(p => p.lockStars > 0 && p.starDelta < 1.0);
  printRow('TOP PICK + EV ≥ 1% + Pinn ✓',      tp.filter(p => p.evEdge >= 1 && p.pinnConf));
  printRow('TOP PICK + EV ≥ 1%',               tp.filter(p => p.evEdge >= 1));
  printRow('TOP PICK + Pinn ✓ + Line ✓',        tp.filter(p => p.pinnConf && p.lineWith));
  printRow('TOP PICK + EV 0–1% (trap zone)',    tp.filter(p => p.evEdge > 0 && p.evEdge < 1));
  sep();
  printRow('Non-TOP + EV ≥ 1% + Pinn ✓',      noTp.filter(p => p.evEdge >= 1 && p.pinnConf));
  printRow('Non-TOP + EV ≥ 1%',               noTp.filter(p => p.evEdge >= 1));
  printRow('Non-TOP + EV 0–1%',               noTp.filter(p => p.evEdge > 0 && p.evEdge < 1));
  printRow('Non-TOP + EV ≤ 0',                noTp.filter(p => p.evEdge <= 0));

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 4 — TOP PICK DEEP DIVE (all time)
  // ════════════════════════════════════════════════════════════════════════════

  const tpAll = graded.filter(p => p.lockStars > 0 && p.starDelta >= 1.0);
  if (tpAll.length) {
    console.log('\n' + '═'.repeat(93));
    console.log('  TOP PICK DEEP DIVE — ALL TIME');
    console.log('═'.repeat(93));
    const tpOv = overall(tpAll);
    console.log(`\n  ${tpOv.icon}  Overall: ${tpOv.record}  ${tpOv.winPct} WR  ${fmt(tpOv.profit)}u  ROI ${tpOv.roiStr}`);

    hdr('TOP PICK — DELTA TIER');
    printRow('Δ ≥ 2.0★ (massive upgrade)',  tpAll.filter(p => p.starDelta >= 2.0));
    printRow('Δ 1.5–2.0★',                 tpAll.filter(p => p.starDelta >= 1.5 && p.starDelta < 2.0));
    printRow('Δ 1.0–1.5★',                 tpAll.filter(p => p.starDelta >= 1.0 && p.starDelta < 1.5));

    hdr('TOP PICK — BY HALF-STAR (peak)');
    for (const s of [5, 4.5, 4, 3.5, 3, 2.5]) {
      const b = tpAll.filter(p => halfBucket(p.stars) === s);
      if (!b.length) continue;
      printRow(`  ${starGlyph(s)}  ${s}★`, b);
    }

    hdr('TOP PICK — BY SPORT');
    for (const sport of ['NHL', 'MLB', 'NBA', 'CBB']) {
      printRow(sport, tpAll.filter(p => p.sport === sport));
    }

    hdr('TOP PICK — SIGNAL VALIDATION');
    printRow('EV ≥ 1%',        tpAll.filter(p => p.evEdge >= 1));
    printRow('EV 0–1%',        tpAll.filter(p => p.evEdge > 0 && p.evEdge < 1));
    printRow('EV ≤ 0',         tpAll.filter(p => p.evEdge <= 0));
    sep();
    printRow('Pinn confirms ✓', tpAll.filter(p => p.pinnConf));
    printRow('Pinn absent  ✗',  tpAll.filter(p => !p.pinnConf));
    sep();
    printRow('Line moving ✓',   tpAll.filter(p => p.lineWith));
    printRow('Line NOT moving', tpAll.filter(p => !p.lineWith));
    sep();
    printRow('$7K+ invested',   tpAll.filter(p => p.invested7k));
    printRow('Under $7K',       tpAll.filter(p => !p.invested7k));

    hdr('TOP PICK — TIME WINDOWS');
    for (const period of [
      { label: 'This Week',    fn: p => p.date >= MONDAY },
      { label: 'Last 7 Days',  fn: p => p.date >= D7 },
      { label: 'Last 14 Days', fn: p => p.date >= D14 },
      { label: 'Last 30 Days', fn: p => p.date >= D30 },
    ]) {
      printRow(period.label, tpAll.filter(period.fn));
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 5 — CLV
  // ════════════════════════════════════════════════════════════════════════════

  const withCLV = graded.filter(p => p.clv != null);
  if (withCLV.length >= 5) {
    console.log('\n' + '═'.repeat(93));
    console.log('  CLOSING LINE VALUE (CLV)');
    console.log('═'.repeat(93));
    const avgCLV   = withCLV.reduce((s, p) => s + p.clv, 0) / withCLV.length;
    const beatClose = withCLV.filter(p => p.clv > 0).length;
    console.log(`\n  CLV picks: ${withCLV.length}  |  Avg CLV: ${(avgCLV * 100).toFixed(2)}%  |  Beat close: ${beatClose}/${withCLV.length} (${pct(beatClose, withCLV.length)})`);
    hdr('CLV BREAKDOWN');
    printRow('CLV positive (beat close)',     withCLV.filter(p => p.clv > 0));
    printRow('CLV negative (missed close)',   withCLV.filter(p => p.clv <= 0));
    printRow('TOP PICK + CLV positive',       withCLV.filter(p => p.clv > 0 && p.lockStars > 0 && p.starDelta >= 1.0));
    printRow('TOP PICK + CLV negative',       withCLV.filter(p => p.clv <= 0 && p.lockStars > 0 && p.starDelta >= 1.0));
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 6 — DAILY TREND (full history)
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(93));
  console.log('  DAILY TREND — FULL HISTORY (most recent first)');
  console.log('═'.repeat(93));
  console.log('\n  Date          ALL                         TOP PICK ONLY              Non-TOP');
  console.log('                Picks  Record    Win%   P/L    TP   Record   Win%   P/L    nTP  Win%   P/L');
  console.log('  ' + '─'.repeat(89));

  const allDatesRev = [...allDates].reverse();
  let runningProfit = 0;
  const runningByDate = {};

  // Calculate running totals forward
  for (const date of allDates) {
    const day = graded.filter(p => p.date === date);
    const dayProfit = day.reduce((s, p) => s + p.profit, 0);
    runningProfit += dayProfit;
    runningByDate[date] = +runningProfit.toFixed(2);
  }

  for (const date of allDatesRev) {
    const day  = graded.filter(p => p.date === date);
    const tp   = day.filter(p => p.lockStars > 0 && p.starDelta >= 1.0);
    const ntp  = day.filter(p => p.lockStars > 0 && p.starDelta < 1.0);

    const dw = day.filter(p => p.outcome === 'WIN').length;
    const dl = day.filter(p => p.outcome === 'LOSS').length;
    const dp = day.reduce((s, p) => s + p.profit, 0);
    const icon = dp >= 0 ? '🟢' : '🔴';

    const tpW = tp.filter(p => p.outcome === 'WIN').length;
    const tpL = tp.filter(p => p.outcome === 'LOSS').length;
    const tpP = tp.reduce((s, p) => s + p.profit, 0);

    const ntW = ntp.filter(p => p.outcome === 'WIN').length;
    const ntL = ntp.filter(p => p.outcome === 'LOSS').length;
    const ntP = ntp.reduce((s, p) => s + p.profit, 0);

    const r  = (w, l) => `${w}-${l}`.padStart(7);
    const pl = (v)    => (fmt(v, 2) + 'u').padStart(8);
    const pc = (w, n) => (n > 0 ? pct(w, w + (n - w)) : ' —').padStart(6);

    const ntTotal = ntW + ntL;
    const tpTotal = tpW + tpL;

    console.log(
      `  ${icon} ${date}` +
      `  ${String(day.length).padStart(4)}` +
      `  ${r(dw, dl)}` +
      `  ${pc(dw, dw + dl)}` +
      `  ${pl(dp)}` +
      `    ${String(tp.length).padStart(3)}` +
      `  ${r(tpW, tpL)}` +
      `  ${pc(tpW, tpTotal)}` +
      `  ${pl(tpP)}` +
      `    ${String(ntp.length).padStart(3)}` +
      `  ${pc(ntW, ntTotal)}` +
      `  ${pl(ntP)}` +
      `  [running: ${fmt(runningByDate[date])}u]`
    );
  }

  // ── Cumulative summary ───────────────────────────────────────────────────
  console.log('\n  ' + '─'.repeat(89));
  const finalOv = overall(graded);
  const tpFinal = graded.filter(p => p.lockStars > 0 && p.starDelta >= 1.0);
  const ntFinal = graded.filter(p => p.lockStars > 0 && p.starDelta < 1.0);
  const tpOvF   = overall(tpFinal);
  const ntOvF   = overall(ntFinal);

  console.log(`\n  TOTALS:   ${finalOv.icon} All: ${finalOv.record} ${finalOv.winPct} WR ${fmt(finalOv.profit)}u ROI ${finalOv.roiStr}`);
  if (tpFinal.length) console.log(`            🔥 TOP PICK: ${tpOvF.record} ${tpOvF.winPct} WR ${fmt(tpOvF.profit)}u ROI ${tpOvF.roiStr}`);
  if (ntFinal.length) console.log(`            📊 Non-TOP:  ${ntOvF.record} ${ntOvF.winPct} WR ${fmt(ntOvF.profit)}u ROI ${ntOvF.roiStr}`);

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION 7 — ROLLING WINDOWS TRACKER
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(93));
  console.log('  ROLLING WINDOW TRACKER — Is the edge alive, shifting, or dying?');
  console.log('═'.repeat(93));
  console.log(`\n  ${'Segment'.padEnd(38)}  ${'7d'.padStart(10)}  ${'14d'.padStart(10)}  ${'30d'.padStart(10)}  ${'All'.padStart(10)}`);
  console.log('  ' + '─'.repeat(80));

  function rollStat(bets, fn) {
    return [D7, D14, D30, '2000-01-01'].map(d => {
      const w = bets.filter(b => b.date >= d);
      const g = w.filter(b => b.outcome);
      if (g.length < 3) return null;
      return fn(g);
    });
  }

  function printRoll(label, vals, fmt2 = v => v.toFixed(1) + '%') {
    const cells = vals.map(v => (v == null ? '--' : fmt2(v)).padStart(10));
    const trend = vals[0] != null && vals[3] != null
      ? ((vals[0] - vals[3]) > 3 ? '↑ UP' : (vals[0] - vals[3]) < -3 ? '↓ DOWN' : '→ STABLE')
      : '';
    console.log(`  ${label.padEnd(38)}  ${cells.join('  ')}  ${trend}`);
  }

  printRoll('Overall Win%',
    rollStat(graded, g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('Overall ROI',
    rollStat(graded, g => {
      const profit = g.reduce((s, p) => s + p.profit, 0);
      const units  = g.reduce((s, p) => s + p.units, 0);
      return units > 0 ? profit / units * 100 : null;
    }), v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%');
  printRoll('4★ bucket Win%',
    rollStat(graded.filter(p => intBucket(p.stars) === 4), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('3★ bucket Win%',
    rollStat(graded.filter(p => intBucket(p.stars) === 3), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('3.5★ half-star Win%',
    rollStat(graded.filter(p => halfBucket(p.stars) === 3.5), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('3.0★ half-star Win%',
    rollStat(graded.filter(p => halfBucket(p.stars) === 3.0), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('TOP PICK Win%',
    rollStat(graded.filter(p => p.lockStars > 0 && p.starDelta >= 1.0), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('Non-TOP Win%',
    rollStat(graded.filter(p => p.lockStars > 0 && p.starDelta < 1.0), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('EV ≥ 1% Win%',
    rollStat(graded.filter(p => p.evEdge != null && p.evEdge >= 1), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('EV 0–1% Win%',
    rollStat(graded.filter(p => p.evEdge != null && p.evEdge > 0 && p.evEdge < 1), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('Pinn ✓ Win%',
    rollStat(graded.filter(p => p.pinnConf), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('MLB Win%',
    rollStat(graded.filter(p => p.sport === 'MLB'), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));
  printRoll('NHL Win%',
    rollStat(graded.filter(p => p.sport === 'NHL'), g => g.filter(p => p.outcome === 'WIN').length / g.length * 100));

  console.log('\n  Legend: ↑ UP = improving (>+3pp) | → STABLE | ↓ DOWN = declining (>-3pp)');

  console.log('\n' + '═'.repeat(93));
  console.log('  ANALYSIS COMPLETE — Sharp Flow Engine');
  console.log('═'.repeat(93) + '\n');

  process.exit(0);
}

run().catch(err => { console.error('Analysis failed:', err.message, err.stack); process.exit(1); });
