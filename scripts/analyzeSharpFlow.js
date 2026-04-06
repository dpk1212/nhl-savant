/**
 * Sharp Flow — COMPLETE Daily Intelligence Report
 *
 * All sections:
 *  ① Overall + time periods × half-star
 *  ② TOP PICK segment — all time periods, by half-star, by delta tier
 *  ③ Flip games (both sides locked — first vs second lock)
 *  ④ Opposition analysis — clean vs contested, sharp margin, money margin
 *  ⑤ EV edge granular (EV <0, 0-1%, 1-2%, 2-3%, 3-5%, 5%+)
 *  ⑥ Avg bet size buckets
 *  ⑦ Consensus grade (DOMINANT / STRONG / LEAN / CONTESTED)
 *  ⑧ Time before game (hoursOut)
 *  ⑨ Sharp count granular (1-2, 3, 4-5, 6-7, 8-9, 10-12, 13+)
 *  ⑩ 2-way & 3-way key signal combos
 *  ⑪ Pregame snapshot analysis (April 4+ data)
 *  ⑫ Lock → peak transformation
 *  ⑬ Composite V2 scoring (data-driven model)
 *  ⑭ Sport breakdown (half-star + top pick per sport)
 *  ⑮ Rolling window tracker
 *  ⑯ Full daily trend (ALL vs TOP PICK vs Non-TOP + running P/L)
 *
 * Usage: node scripts/analyzeSharpFlow.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';
import * as dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

function initFirebase() {
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
  return admin.firestore();
}
const db = initFirebase();

// ── Date helpers ──────────────────────────────────────────────────────────────
const etDate = (off = 0) => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  d.setDate(d.getDate() + off);
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
};
const etMonday = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
};

// ── estimateStarsFromSnap (mirrors UI) ────────────────────────────────────────
function estimateStars(snap) {
  if (!snap) return 3;
  let pts = 0;
  const cg = snap.consensusStrength?.grade || '';
  if (cg === 'DOMINANT') pts += 3; else if (cg === 'STRONG') pts += 2; else if (cg === 'LEAN') pts += 0.5;
  const pinnConf = !!snap.criteria?.pinnacleConfirms, lineWith = !!snap.criteria?.lineMovingWith;
  if (pinnConf && lineWith) pts += 3; else if (pinnConf) pts += 1.5; else if (lineWith) pts += 1.5;
  const avgInv = (snap.sharpCount || 0) > 0 ? (snap.totalInvested || 0) / snap.sharpCount : (snap.totalInvested || 0);
  const conv = avgInv > 0 ? Math.min(1, Math.max(0, (Math.log10(avgInv) - 2) / 2)) : 0;
  if (conv >= 0.8) pts += 1.5; else if (conv >= 0.5) pts += 1; else if (conv >= 0.25) pts += 0.5;
  const ev = snap.evEdge || 0;
  if (ev > 3) pts += 3.5; else if (ev > 2) pts += 2.5; else if (ev > 1) pts += 1.5; else if (ev > 0) pts += 0.5;
  if (snap.criteria?.predMarketAligns) pts += 0.5;
  return Math.min(5, Math.max(0.5, Math.round(((pts / 14.5) * 5) * 2) / 2));
}

const intBucket  = s => s >= 4.5 ? 5 : s >= 3.5 ? 4 : s >= 2.5 ? 3 : s >= 1.5 ? 2 : 1;
const halfBucket = s => Math.round(s * 2) / 2;
const STARS_LIVE = '2026-03-26';

// ── Composite V2 scoring (from analysis doc) ──────────────────────────────────
function compositeV2(pick) {
  let pts = 0;
  const odds = pick.odds;
  if (odds != null) {
    const impl = odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
    if (impl >= 0.75) pts += 3;
    else if (impl >= 0.55) pts += 1.5;
    else if (impl < 0.45) pts -= 1;
  }
  const ev = pick.evEdge;
  if (ev != null) {
    if (ev >= 3) pts += 3;
    else if (ev >= 1) pts += 2;
    else if (ev > 0 && ev < 1) pts -= 1;
  }
  if (pick.isContested) pts -= 3;
  if (pick.invested7k) pts += 1.5;
  const sc = pick.sharpCount;
  if (sc >= 1 && sc <= 5) pts += 1;
  else if (sc >= 13) pts += 1.5;
  else if (sc >= 10 && sc <= 12) pts -= 1;
  else if (sc >= 6 && sc <= 9) pts -= 0.5;
  const cm = pick.criteriaMet;
  if (cm === 4) pts += 1;
  else if (cm <= 2) pts += 1;
  else if (cm === 6) pts -= 2;
  else if (cm >= 5) pts -= 0.5;
  if (!pick.pinnConf) pts += 0.5;
  return pts;
}

// ── Display helpers ───────────────────────────────────────────────────────────
const W = { L: 38, n: 5, rec: 9, pct: 7, profit: 10, roi: 8 };
const LINE = '─'.repeat(W.L + W.n + W.rec + W.pct + W.profit + W.roi + 14);
const GLYPH = s => { const f = Math.floor(s), h = s % 1 >= 0.5; return '★'.repeat(f) + (h ? '½' : '') + '☆'.repeat(5 - f - (h ? 1 : 0)); };
const fmt = (v, d = 2) => (v >= 0 ? '+' : '') + v.toFixed(d);
const pct = (w, n) => n > 0 ? (w / n * 100).toFixed(1) + '%' : '—';
const roi = (p, u) => u > 0 ? (p / u * 100).toFixed(1) + '%' : '—';
const sgn = (v, d = 2) => fmt(v, d) + 'u';

// ── Statistical helpers (for §19 profile analysis) ─────────────────────────
function mean(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function catPct(arr, fn) {
  if (!arr.length) return '—';
  return (arr.filter(fn).length / arr.length * 100).toFixed(1) + '%';
}
function implProb(odds) {
  if (odds == null) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function pRow(label, bets, indent = '') {
  if (!bets.length) return;
  const w = bets.filter(b => b.outcome === 'WIN').length;
  const l = bets.filter(b => b.outcome === 'LOSS').length;
  const p = bets.filter(b => b.outcome === 'PUSH').length;
  const profit = +bets.reduce((s, b) => s + b.profit, 0).toFixed(2);
  const units  = bets.reduce((s, b) => s + b.units, 0);
  const icon   = profit >= 0 ? '🟢' : '🔴';
  const rec    = `${w}-${l}${p > 0 ? `-${p}` : ''}`;
  console.log(
    `${indent}${icon} ${label.padEnd(W.L)}` +
    `${String(w + l + p).padStart(W.n)}` +
    `  ${rec.padStart(W.rec)}  ${pct(w, w + l).padStart(W.pct)}` +
    `  ${(sgn(profit)).padStart(W.profit)}  ROI ${roi(profit, units).padStart(W.roi)}`
  );
}

function hdr(title) {
  console.log(`\n  ╔══ ${title} ${'═'.repeat(Math.max(1, 78 - title.length))}╗`);
  console.log(`  ${''.padEnd(W.L + 2)}${'n'.padStart(W.n)}  ${'Record'.padStart(W.rec)}  ${'Win%'.padStart(W.pct)}  ${'Profit'.padStart(W.profit)}  ROI`);
  console.log(`  ${LINE}`);
}
const sep = (t = '') => t ? console.log(`\n    ── ${t}`) : console.log('');
const banner = (label, n, ov) =>
  console.log(`  ${ov.icon}  ${label.padEnd(14)} ${n} picks  |  ${ov.record}  ${ov.winPct} WR  ${sgn(ov.profit)} profit  ROI ${ov.roiStr}`);

function ov(bets) {
  const w = bets.filter(b => b.outcome === 'WIN').length;
  const l = bets.filter(b => b.outcome === 'LOSS').length;
  const p = bets.filter(b => b.outcome === 'PUSH').length;
  const profit = +bets.reduce((s, b) => s + b.profit, 0).toFixed(2);
  const units  = bets.reduce((s, b) => s + b.units, 0);
  return { w, l, p, profit, units, icon: profit >= 0 ? '🟢' : '🔴',
    record: `${w}-${l}${p > 0 ? `-${p}` : ''}`, winPct: pct(w, w + l), roiStr: roi(profit, units) };
}

function starBlock(bets, label = '') {
  if (label) sep(label);
  sep('Integer tiers');
  for (const s of [5, 4, 3, 2]) {
    const lbl = s === 5 ? '  ★★★★★  5★ (≥4.5)' : s === 4 ? '  ★★★★☆  4★ (3.5–4.4)' : s === 3 ? '  ★★★☆☆  3★ (2.5–3.4)' : '  ★★☆☆☆  2★';
    pRow(lbl, bets.filter(b => intBucket(b.stars) === s));
  }
  sep('Half-star');
  for (const s of [5, 4.5, 4, 3.5, 3, 2.5]) {
    const b = bets.filter(p => halfBucket(p.stars) === s);
    if (b.length) pRow(`  ${GLYPH(s)}  ${s}★`, b);
  }
}

function topPickBlock(bets, indent = '  ') {
  const withDelta = bets.filter(b => b.lockStars > 0);
  const tp15  = withDelta.filter(b => b.starDelta >= 1.5);
  const tp10  = withDelta.filter(b => b.starDelta >= 1.0 && b.starDelta < 1.5);
  const tpAny = withDelta.filter(b => b.starDelta >= 1.0);
  const noG   = withDelta.filter(b => b.starDelta < 1.0);
  const noLD  = bets.filter(b => !b.lockStars);

  pRow('🔥 TOP PICK +1u   (Δ ≥ 1.5★)', tp15, indent);
  pRow('⚡ TOP PICK +0.5u (Δ 1.0–1.4★)', tp10, indent);
  sep();
  pRow('Any TOP PICK     (Δ ≥ 1.0★)', tpAny, indent);
  pRow('No growth        (Δ < 1.0★)',  noG, indent);
  if (noLD.length) pRow('No lock data (legacy)', noLD, indent);

  if (tpAny.length) {
    sep('TOP PICK by half-star');
    for (const s of [5, 4.5, 4, 3.5, 3, 2.5]) {
      const b = tpAny.filter(p => halfBucket(p.stars) === s);
      if (b.length) pRow(`  TOP PICK @ ${GLYPH(s)}  ${s}★`, b, indent);
    }
  }
  return { tpAny, noG, tp15, tp10 };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const TODAY     = etDate(0);
  const YESTERDAY = etDate(-1);
  const MONDAY    = etMonday();
  const D7        = etDate(-7);
  const D14       = etDate(-14);
  const D30       = etDate(-30);

  const nowStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  console.log('\n');
  console.log('╔' + '═'.repeat(93) + '╗');
  console.log('║  SHARP FLOW — COMPLETE DAILY INTELLIGENCE REPORT' + ' '.repeat(44) + '║');
  console.log(`║  Generated: ${nowStr}` + ' '.repeat(Math.max(1, 93 - 13 - nowStr.length)) + '║');
  console.log('╚' + '═'.repeat(93) + '╝');

  const snap = await db.collection('sharpFlowPicks').get();

  // ── Build picks array ──────────────────────────────────────────────────────
  const picks = [];
  const flipGames = []; // docs where both sides completed

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const isPost = data.date >= STARS_LIVE;
    const commenceMs = data.commenceTime
      ? (typeof data.commenceTime === 'number' ? data.commenceTime : new Date(data.commenceTime?.seconds ? data.commenceTime.seconds * 1000 : data.commenceTime).getTime())
      : null;

    const processSide = (sd, sideKey) => {
      const best = sd.peak || sd.lock;
      const lock = sd.lock || best;
      const rawS = best?.stars ?? estimateStars(best);
      const pkS  = isPost ? (best?.stars ?? 0) : rawS;
      if (pkS < 2.5) return null;

      const lkS     = lock?.stars ?? 0;
      const u       = best?.units || 1;
      const delta   = +(pkS - lkS).toFixed(1);
      const sc      = lock?.sharpCount ?? 0;
      const inv     = lock?.totalInvested ?? 0;
      const avgBet  = sc > 0 ? inv / sc : inv;
      const evEdge  = best?.evEdge ?? lock?.evEdge ?? null;
      const odds    = best?.odds ?? lock?.odds ?? null;
      const pinnConf  = !!(best?.criteria?.pinnacleConfirms ?? lock?.criteria?.pinnacleConfirms);
      const lineWith  = !!(best?.criteria?.lineMovingWith ?? lock?.criteria?.lineMovingWith);
      const invested7k = !!(best?.criteria?.invested7kPlus ?? lock?.criteria?.invested7kPlus);
      const predAligns = !!(best?.criteria?.predMarketAligns ?? lock?.criteria?.predMarketAligns);
      const criteriaMet = best?.criteriaMet ?? lock?.criteriaMet ?? 0;
      const consGrade = lock?.consensusStrength?.grade || best?.consensusStrength?.grade || '';

      // Opposition
      const opp = lock?.opposition || {};
      const oppSC  = opp.sharpCount ?? 0;
      const oppInv = opp.totalInvested ?? 0;
      const oppAvg = opp.avgBet ?? (oppSC > 0 ? oppInv / oppSC : 0);
      const isContested = oppSC > 0;
      const sharpMargin = sc - oppSC;
      const moneyMargin = inv - oppInv;

      // Pregame
      const pg = sd.pregame || null;
      const pgEvEdge   = pg?.evEdge ?? null;
      const pgStars    = pg?.stars ?? null;
      const pgOppSC    = pg?.opposition?.sharpCount ?? null;

      // Hours out
      const lockedAt = lock?.lockedAt ?? null;
      const hoursOut = commenceMs && lockedAt ? (commenceMs - lockedAt) / 3600000 : null;

      let outcome = null, profit = 0;
      if (sd.status === 'COMPLETED') {
        outcome = sd.result?.outcome || null;
        if (outcome === 'WIN')       profit = sd.result?.profit ?? 0;
        else if (outcome === 'LOSS') profit = -u;
      }

      const pick = {
        docId: docSnap.id, sideKey, date: data.date, sport: data.sport || 'NHL',
        stars: pkS, lockStars: lkS, starDelta: delta, units: u,
        status: sd.status || 'PENDING', outcome, profit,
        evEdge, lockEV: lock?.evEdge ?? null,
        maxEV: sd.maxEV ?? null, maxEVAt: sd.maxEVAt ?? null,
        pinnConf, lineWith, invested7k, predAligns, criteriaMet,
        odds, sharpCount: sc, totalInvested: inv, avgBet, consGrade,
        isContested, oppSC, oppInv, oppAvg, sharpMargin, moneyMargin,
        pgEvEdge, pgStars, pgOppSC, hasPregame: !!pg,
        hoursOut, clv: sd.result?.clv ?? null,
        lockedAt,
      };
      return pick;
    };

    if (data.sides) {
      const sideKeys = Object.keys(data.sides);
      const sidePicks = [];
      for (const sk of sideKeys) {
        const p = processSide(data.sides[sk], sk);
        if (p) { sidePicks.push(p); picks.push(p); }
      }

      // Flip detection: doc with 2+ completed sides
      const completedSides = sideKeys
        .map(sk => ({ sk, sd: data.sides[sk] }))
        .filter(x => x.sd.status === 'COMPLETED');
      if (completedSides.length >= 2) {
        const sorted = completedSides.sort((a, b) =>
          (a.sd.lock?.lockedAt ?? 0) - (b.sd.lock?.lockedAt ?? 0));
        const first  = sorted[0];
        const second = sorted[1];
        const firstPick  = sidePicks.find(p => p.sideKey === first.sk);
        const secondPick = sidePicks.find(p => p.sideKey === second.sk);
        if (firstPick && secondPick) {
          firstPick.flipOrder = 'first';
          secondPick.flipOrder = 'second';
          firstPick.isFlip = true;
          secondPick.isFlip = true;
          flipGames.push({ first: firstPick, second: secondPick, docId: docSnap.id, date: data.date, sport: data.sport });
        }
      }
    } else {
      const rawS = data.stars ?? estimateStars(data);
      const pkS  = isPost ? (data.stars ?? 0) : rawS;
      if (pkS < 2.5) return;
      const u = data.units || 1;
      let outcome = null, profit = 0;
      if (data.status === 'COMPLETED') {
        outcome = data.result?.outcome || null;
        if (outcome === 'WIN') profit = data.result?.profit ?? 0;
        else if (outcome === 'LOSS') profit = -u;
      }
      picks.push({
        docId: docSnap.id, sideKey: 'flat', date: data.date, sport: data.sport || 'NHL',
        stars: pkS, lockStars: 0, starDelta: 0, units: u,
        status: data.status || 'PENDING', outcome, profit,
        evEdge: null, lockEV: null, pinnConf: false, lineWith: false,
        invested7k: false, predAligns: false, criteriaMet: 0,
        odds: data.odds ?? null, sharpCount: 0, totalInvested: 0, avgBet: 0, consGrade: '',
        isContested: false, oppSC: 0, oppInv: 0, oppAvg: 0, sharpMargin: 0, moneyMargin: 0,
        pgEvEdge: null, pgStars: null, pgOppSC: null, hasPregame: false,
        hoursOut: null, clv: null, lockedAt: null,
        isFlip: false, flipOrder: null,
      });
    }
  });

  const graded = picks.filter(p => p.outcome);
  const allDates = [...new Set(graded.map(p => p.date))].sort();

  console.log(`\n  Docs: ${snap.size}  |  Picks ≥2.5★: ${picks.length}  |  Graded: ${graded.length}  |  Flip games: ${flipGames.length}`);
  console.log(`  Date range: ${allDates[0] || '—'} → ${allDates[allDates.length - 1] || '—'}`);
  console.log(`  Today: ${TODAY}  |  Yesterday: ${YESTERDAY}  |  Week from: ${MONDAY}`);

  // ════════════════════════════════════════════════════════════════════════════
  //  §1 — PERFORMANCE BY TIME PERIOD (star + top pick breakdown)
  // ════════════════════════════════════════════════════════════════════════════

  const periods = [
    { label: 'ALL TIME',     fn: () => true },
    { label: 'THIS WEEK',    fn: p => p.date >= MONDAY },
    { label: 'YESTERDAY',    fn: p => p.date === YESTERDAY },
    { label: 'TODAY',        fn: p => p.date === TODAY },
    { label: 'LAST 7 DAYS',  fn: p => p.date >= D7 },
    { label: 'LAST 14 DAYS', fn: p => p.date >= D14 },
    { label: 'LAST 30 DAYS', fn: p => p.date >= D30 },
  ];

  for (const period of periods) {
    const slice = graded.filter(period.fn);
    if (!slice.length) { console.log(`\n  [${period.label}: no data]`); continue; }
    const o = ov(slice);
    console.log('\n' + '═'.repeat(95));
    console.log(`  ${o.icon}  ${period.label} — ${slice.length} picks  ${o.record}  ${o.winPct} WR  ${sgn(o.profit)}  ROI ${o.roiStr}`);
    console.log('═'.repeat(95));
    hdr('BY CONVICTION RATING');
    starBlock(slice);
    hdr('TOP PICK SEGMENT');
    topPickBlock(slice);
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §2 — FLIP GAMES (both sides locked)
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log(`  FLIP GAMES — ${flipGames.length} games where both sides locked`);
  console.log('═'.repeat(95));

  if (flipGames.length === 0) {
    console.log('\n  No flip games found in graded set.');
  } else {
    const firstPicks  = flipGames.map(g => g.first);
    const secondPicks = flipGames.map(g => g.second);
    hdr('FIRST LOCK vs SECOND LOCK (THE FLIP)');
    pRow('1st Lock (original)', firstPicks);
    pRow('2nd Lock (the flip)', secondPicks);
    sep();
    // Winner analysis
    let higherStarWins = 0, higherStarTotal = 0;
    let higherAvgWins  = 0, higherAvgTotal  = 0;
    let higherMoneyWins = 0, higherMoneyTotal = 0;
    let favoriteWins = 0, favoriteTotal = 0;
    let higherEVWins = 0, higherEVTotal = 0;

    for (const { first, second } of flipGames) {
      if (!first.outcome || !second.outcome) continue;
      const fWon = first.outcome === 'WIN', sWon = second.outcome === 'WIN';
      if (first.stars !== second.stars) {
        higherStarTotal++;
        if ((first.stars > second.stars && fWon) || (second.stars > first.stars && sWon)) higherStarWins++;
      }
      if (first.avgBet !== second.avgBet) {
        higherAvgTotal++;
        if ((first.avgBet > second.avgBet && fWon) || (second.avgBet > first.avgBet && sWon)) higherAvgWins++;
      }
      if (first.totalInvested !== second.totalInvested) {
        higherMoneyTotal++;
        if ((first.totalInvested > second.totalInvested && fWon) || (second.totalInvested > first.totalInvested && sWon)) higherMoneyWins++;
      }
      if (first.odds != null && second.odds != null) {
        favoriteTotal++;
        const fImpl = first.odds < 0 ? Math.abs(first.odds) / (Math.abs(first.odds) + 100) : 100 / (first.odds + 100);
        const sImpl = second.odds < 0 ? Math.abs(second.odds) / (Math.abs(second.odds) + 100) : 100 / (second.odds + 100);
        if ((fImpl > sImpl && fWon) || (sImpl > fImpl && sWon)) favoriteWins++;
      }
      if (first.evEdge != null && second.evEdge != null && first.evEdge !== second.evEdge) {
        higherEVTotal++;
        if ((first.evEdge > second.evEdge && fWon) || (second.evEdge > first.evEdge && sWon)) higherEVWins++;
      }
    }

    console.log('\n  When BOTH sides locked — which side wins?');
    console.log(`  Higher star side:     ${pct(higherStarWins, higherStarTotal).padStart(6)} (${higherStarWins}/${higherStarTotal})`);
    console.log(`  Higher avg bet:       ${pct(higherAvgWins, higherAvgTotal).padStart(6)} (${higherAvgWins}/${higherAvgTotal})`);
    console.log(`  More total money:     ${pct(higherMoneyWins, higherMoneyTotal).padStart(6)} (${higherMoneyWins}/${higherMoneyTotal})`);
    console.log(`  Favorite side:        ${pct(favoriteWins, favoriteTotal).padStart(6)} (${favoriteWins}/${favoriteTotal})`);
    console.log(`  Higher EV side:       ${pct(higherEVWins, higherEVTotal).padStart(6)} (${higherEVWins}/${higherEVTotal})`);

    // Individual flip game log
    console.log('\n  FLIP GAME LOG:');
    console.log('  ' + '─'.repeat(85));
    for (const { first, second, date, sport } of flipGames.sort((a, b) => b.date.localeCompare(a.date))) {
      if (!first.outcome) continue;
      const fW = first.outcome === 'WIN', sW = second.outcome === 'WIN';
      console.log(`  ${date} ${sport.padEnd(4)}  ` +
        `1st: ${first.outcome?.padEnd(4)} ${fmt(first.profit)}u ${first.stars}★  |  ` +
        `2nd(flip): ${second.outcome?.padEnd(4)} ${fmt(second.profit)}u ${second.stars}★  ` +
        `${fW && !sW ? '← original won' : !fW && sW ? '← flip won' : '← both lost'}`);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §3 — OPPOSITION ANALYSIS
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  OPPOSITION ANALYSIS — Clean vs Contested');
  console.log('═'.repeat(95));

  const clean     = graded.filter(p => !p.isContested);
  const contested = graded.filter(p => p.isContested);

  hdr('CLEAN vs CONTESTED');
  pRow('Clean (no opposition)',    clean);
  pRow('Contested (has opposition)', contested);

  if (contested.length) {
    sep('Contested — margin breakdown (our sharps − their sharps)');
    pRow('They have MORE sharps (margin < 0)', contested.filter(p => p.sharpMargin < 0));
    pRow('TIED (margin = 0)',                  contested.filter(p => p.sharpMargin === 0));
    pRow('+1 more sharp',                      contested.filter(p => p.sharpMargin === 1));
    pRow('+2 more sharps',                     contested.filter(p => p.sharpMargin === 2));
    pRow('+3 more sharps',                     contested.filter(p => p.sharpMargin === 3));
    pRow('+4-5 more sharps',                   contested.filter(p => p.sharpMargin >= 4 && p.sharpMargin <= 5));
    pRow('+6+ more sharps',                    contested.filter(p => p.sharpMargin >= 6));

    sep('Contested — money margin (our $ − their $)');
    pRow('They have MORE money',               contested.filter(p => p.moneyMargin < 0));
    pRow('We have $0-5K more',                 contested.filter(p => p.moneyMargin >= 0 && p.moneyMargin < 5000));
    pRow('We have $5-15K more',                contested.filter(p => p.moneyMargin >= 5000 && p.moneyMargin < 15000));
    pRow('We have $15-30K more',               contested.filter(p => p.moneyMargin >= 15000 && p.moneyMargin < 30000));
    pRow('We have $30K+ more',                 contested.filter(p => p.moneyMargin >= 30000));

    sep('Contested — key combos');
    pRow('Contested + EV ≥1%',                 contested.filter(p => p.evEdge >= 1));
    pRow('Contested + EV 0-1% (trap)',          contested.filter(p => p.evEdge > 0 && p.evEdge < 1));
    pRow('Contested + EV ≤0',                  contested.filter(p => p.evEdge <= 0));
    sep();
    pRow('Contested + Pinn confirms',           contested.filter(p => p.pinnConf));
    pRow('Contested + NO Pinnacle',             contested.filter(p => !p.pinnConf));
  }

  // Clean sharp count sub-analysis
  sep('Clean games — by our sharp count');
  pRow('1-2 sharps (clean)',   clean.filter(p => p.sharpCount >= 1 && p.sharpCount <= 2));
  pRow('3-4 sharps (clean)',   clean.filter(p => p.sharpCount >= 3 && p.sharpCount <= 4));
  pRow('5-6 sharps (clean)',   clean.filter(p => p.sharpCount >= 5 && p.sharpCount <= 6));
  pRow('7-9 sharps (clean)',   clean.filter(p => p.sharpCount >= 7 && p.sharpCount <= 9));
  pRow('10+ sharps (clean)',   clean.filter(p => p.sharpCount >= 10));

  sep('Clean + EV cross');
  pRow('CLEAN + EV ≥1%',       clean.filter(p => p.evEdge >= 1));
  pRow('CLEAN + EV 0-1%',      clean.filter(p => p.evEdge > 0 && p.evEdge < 1));
  pRow('CLEAN + EV ≤0',        clean.filter(p => p.evEdge <= 0));

  // ════════════════════════════════════════════════════════════════════════════
  //  §4 — EV EDGE GRANULAR
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  EV EDGE — GRANULAR BREAKDOWN');
  console.log('═'.repeat(95));
  hdr('EV EDGE TIERS');
  pRow('EV 5%+    (max edge)',    graded.filter(p => p.evEdge != null && p.evEdge >= 5));
  pRow('EV 3-5%   (elite)',       graded.filter(p => p.evEdge != null && p.evEdge >= 3 && p.evEdge < 5));
  pRow('EV 2-3%   (strong)',      graded.filter(p => p.evEdge != null && p.evEdge >= 2 && p.evEdge < 3));
  pRow('EV 1-2%   (solid)',       graded.filter(p => p.evEdge != null && p.evEdge >= 1 && p.evEdge < 2));
  pRow('EV 0-1%   (trap zone)',   graded.filter(p => p.evEdge != null && p.evEdge > 0 && p.evEdge < 1));
  pRow('EV ≤0     (negative)',    graded.filter(p => p.evEdge != null && p.evEdge <= 0));
  pRow('No EV data',              graded.filter(p => p.evEdge == null));
  sep('EV by star tier');
  for (const tier of [5, 4, 3]) {
    const t = graded.filter(p => intBucket(p.stars) === tier);
    pRow(`  ${tier}★ — EV ≥1%`,      t.filter(p => p.evEdge >= 1));
    pRow(`  ${tier}★ — EV 0-1%`,     t.filter(p => p.evEdge > 0 && p.evEdge < 1));
    pRow(`  ${tier}★ — EV ≤0`,       t.filter(p => p.evEdge <= 0));
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §5 — AVG BET SIZE
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  AVG BET SIZE (totalInvested / sharpCount)');
  console.log('═'.repeat(95));
  hdr('AVG BET SIZE BUCKETS');
  pRow('avg < $1K  (low)',       graded.filter(p => p.avgBet > 0 && p.avgBet < 1000));
  pRow('avg $1-3K  (sweet)',     graded.filter(p => p.avgBet >= 1000 && p.avgBet < 3000));
  pRow('avg $3-5K  (high)',      graded.filter(p => p.avgBet >= 3000 && p.avgBet < 5000));
  pRow('avg $5-10K (very high)', graded.filter(p => p.avgBet >= 5000 && p.avgBet < 10000));
  pRow('avg $10K+  (whale)',     graded.filter(p => p.avgBet >= 10000));
  pRow('No avg bet data',        graded.filter(p => !p.avgBet));

  // ════════════════════════════════════════════════════════════════════════════
  //  §6 — CONSENSUS GRADE
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  CONSENSUS GRADE');
  console.log('═'.repeat(95));
  hdr('BY CONSENSUS GRADE');
  pRow('DOMINANT',               graded.filter(p => p.consGrade === 'DOMINANT'));
  pRow('STRONG',                 graded.filter(p => p.consGrade === 'STRONG'));
  pRow('LEAN',                   graded.filter(p => p.consGrade === 'LEAN'));
  pRow('CONTESTED',              graded.filter(p => p.consGrade === 'CONTESTED'));
  pRow('No grade data (legacy)', graded.filter(p => !p.consGrade));
  sep('Grade × EV combos');
  pRow('DOMINANT + EV ≥1%',     graded.filter(p => p.consGrade === 'DOMINANT' && p.evEdge >= 1));
  pRow('DOMINANT + NO Pinn',    graded.filter(p => p.consGrade === 'DOMINANT' && !p.pinnConf));
  pRow('STRONG + EV ≥1%',       graded.filter(p => p.consGrade === 'STRONG' && p.evEdge >= 1));
  pRow('LEAN + EV ≥1%',         graded.filter(p => p.consGrade === 'LEAN' && p.evEdge >= 1));

  // ════════════════════════════════════════════════════════════════════════════
  //  §7 — TIME BEFORE GAME
  // ════════════════════════════════════════════════════════════════════════════

  const withHours = graded.filter(p => p.hoursOut != null);
  if (withHours.length >= 5) {
    console.log('\n' + '═'.repeat(95));
    console.log('  TIME BEFORE GAME (lock → commence)');
    console.log('═'.repeat(95));
    hdr('HOURS OUT BUCKETS');
    pRow('<4h before game',      withHours.filter(p => p.hoursOut < 4));
    pRow('4-12h before game',    withHours.filter(p => p.hoursOut >= 4 && p.hoursOut < 12));
    pRow('12-24h before game',   withHours.filter(p => p.hoursOut >= 12 && p.hoursOut < 24));
    pRow('24h+ before game',     withHours.filter(p => p.hoursOut >= 24));
    sep('Time × EV');
    pRow('12h+ + EV ≥1%',       withHours.filter(p => p.hoursOut >= 12 && p.evEdge >= 1));
    pRow('<4h + EV ≥1%',        withHours.filter(p => p.hoursOut < 4 && p.evEdge >= 1));
    pRow('4-12h + EV 0-1%',     withHours.filter(p => p.hoursOut >= 4 && p.hoursOut < 12 && p.evEdge > 0 && p.evEdge < 1));
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §8 — SHARP COUNT GRANULAR
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  SHARP COUNT ANALYSIS');
  console.log('═'.repeat(95));
  hdr('BY SHARP COUNT');
  pRow('1-2 sharps (low)',       graded.filter(p => p.sharpCount >= 1 && p.sharpCount <= 2));
  pRow('3 sharps',               graded.filter(p => p.sharpCount === 3));
  pRow('4-5 sharps',             graded.filter(p => p.sharpCount >= 4 && p.sharpCount <= 5));
  pRow('6-7 sharps (danger)',     graded.filter(p => p.sharpCount >= 6 && p.sharpCount <= 7));
  pRow('8-9 sharps (danger)',     graded.filter(p => p.sharpCount >= 8 && p.sharpCount <= 9));
  pRow('10-12 sharps (danger)',   graded.filter(p => p.sharpCount >= 10 && p.sharpCount <= 12));
  pRow('13+ sharps (rebound)',    graded.filter(p => p.sharpCount >= 13));

  // ════════════════════════════════════════════════════════════════════════════
  //  §9 — 2-WAY & 3-WAY KEY COMBOS
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  KEY SIGNAL COMBINATIONS');
  console.log('═'.repeat(95));

  hdr('TOP 2-WAY COMBOS');
  pRow('NO Pinn + EV ≥1%',                      graded.filter(p => !p.pinnConf && p.evEdge >= 1));
  pRow('NO Pinn + DOMINANT',                     graded.filter(p => !p.pinnConf && p.consGrade === 'DOMINANT'));
  pRow('Pred aligns + EV ≥1%',                   graded.filter(p => p.predAligns && p.evEdge >= 1));
  pRow('EV ≥1% + Line moving',                   graded.filter(p => p.evEdge >= 1 && p.lineWith));
  pRow('EV ≥1% + Line NOT moving',               graded.filter(p => p.evEdge >= 1 && !p.lineWith));
  pRow('$7K+ + EV ≥1%',                          graded.filter(p => p.invested7k && p.evEdge >= 1));
  pRow('Clean + EV ≥1%  ← golden combo',         graded.filter(p => !p.isContested && p.evEdge >= 1));
  pRow('Clean + EV 0-1% ← trap',                 graded.filter(p => !p.isContested && p.evEdge > 0 && p.evEdge < 1));
  pRow('Contested + EV ≥1%',                     graded.filter(p => p.isContested && p.evEdge >= 1));
  pRow('Contested + EV 0-1%',                    graded.filter(p => p.isContested && p.evEdge > 0 && p.evEdge < 1));

  hdr('TOP 3-WAY COMBOS');
  pRow('NO Pinn + EV ≥1% + Pred aligns',         graded.filter(p => !p.pinnConf && p.evEdge >= 1 && p.predAligns));
  pRow('NO Pinn + EV ≥1% + Line moving',         graded.filter(p => !p.pinnConf && p.evEdge >= 1 && p.lineWith));
  pRow('NO Pinn + EV ≥1% + $7K+',               graded.filter(p => !p.pinnConf && p.evEdge >= 1 && p.invested7k));
  pRow('NO Pinn + DOMINANT + EV ≥1%',            graded.filter(p => !p.pinnConf && p.consGrade === 'DOMINANT' && p.evEdge >= 1));
  pRow('Clean + NO Pinn + EV ≥1%',               graded.filter(p => !p.isContested && !p.pinnConf && p.evEdge >= 1));
  pRow('Clean + NO Pinn + DOMINANT',              graded.filter(p => !p.isContested && !p.pinnConf && p.consGrade === 'DOMINANT'));
  pRow('TOP PICK + EV ≥1% + Clean',              graded.filter(p => p.starDelta >= 1 && p.evEdge >= 1 && !p.isContested));
  pRow('TOP PICK + NO Pinn + EV ≥1%',            graded.filter(p => p.starDelta >= 1 && !p.pinnConf && p.evEdge >= 1));

  // ════════════════════════════════════════════════════════════════════════════
  //  §10 — CRITERIA COUNT
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  CRITERIA COUNT (6 lock criteria)');
  console.log('═'.repeat(95));
  hdr('BY CRITERIA MET');
  for (const n of [6, 5, 4, 3, 2, 1]) pRow(`${n}/6 criteria`, graded.filter(p => p.criteriaMet === n));

  // ════════════════════════════════════════════════════════════════════════════
  //  §11 — ODDS / IMPLIED PROBABILITY
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  ODDS — IMPLIED PROBABILITY');
  console.log('═'.repeat(95));
  const withOdds = graded.filter(p => p.odds != null);
  hdr('ODDS RANGE');
  pRow('Heavy fav  ≤ -200',      withOdds.filter(p => p.odds <= -200));
  pRow('Fav   -199 to -120',     withOdds.filter(p => p.odds > -200 && p.odds <= -120));
  pRow('Slight fav -119 to -101',withOdds.filter(p => p.odds > -120 && p.odds < 0));
  pRow('Pick/near-even (0-130)', withOdds.filter(p => p.odds >= 0 && p.odds <= 130));
  pRow('Dog   +131 to +200',     withOdds.filter(p => p.odds > 130 && p.odds <= 200));
  pRow('Big dog +201+',          withOdds.filter(p => p.odds > 200));

  // ════════════════════════════════════════════════════════════════════════════
  //  §12 — PREGAME SNAPSHOT ANALYSIS (April 4+)
  // ════════════════════════════════════════════════════════════════════════════

  const withPG = graded.filter(p => p.hasPregame);
  if (withPG.length >= 5) {
    console.log('\n' + '═'.repeat(95));
    console.log(`  PREGAME SNAPSHOT ANALYSIS — ${withPG.length} picks (April 4+ data)`);
    console.log('═'.repeat(95));
    hdr('PREGAME EV');
    pRow('Pregame EV ≥1% (still hot)',    withPG.filter(p => p.pgEvEdge >= 1));
    pRow('Pregame EV 0-1% (evaporating)', withPG.filter(p => p.pgEvEdge > 0 && p.pgEvEdge < 1));
    pRow('Pregame EV ≤0 (gone)',          withPG.filter(p => p.pgEvEdge <= 0));

    sep('EV at lock vs pregame (lock→pregame transformation)');
    const ev1atLock  = withPG.filter(p => p.lockEV >= 1);
    const ev1stays   = ev1atLock.filter(p => p.pgEvEdge >= 1);
    const ev1evap    = ev1atLock.filter(p => p.pgEvEdge != null && p.pgEvEdge < 1);
    pRow('EV≥1% at lock AND pregame (sustained)',   ev1stays);
    pRow('EV≥1% at lock → <1% pregame (evaporated)', ev1evap);

    sep('Pregame opposition appeared');
    const cleanAtLock = withPG.filter(p => !p.isContested);
    const oppAppeared = cleanAtLock.filter(p => p.pgOppSC != null && p.pgOppSC > 0);
    const stayedClean = cleanAtLock.filter(p => p.pgOppSC === 0 || p.pgOppSC == null);
    pRow('Clean at lock — opp appeared by pregame', oppAppeared);
    pRow('Clean at lock — stayed clean at pregame', stayedClean);
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §13 — LOCK → PEAK TRANSFORMATION
  // ════════════════════════════════════════════════════════════════════════════

  const withBoth = graded.filter(p => p.lockStars > 0 && p.stars > 0);
  if (withBoth.length >= 10) {
    console.log('\n' + '═'.repeat(95));
    console.log('  LOCK → PEAK TRANSFORMATION');
    console.log('═'.repeat(95));
    hdr('STAR DELTA (peak − lock)');
    pRow('Stars GREW ≥ 1.5 (major upgrade)',  withBoth.filter(p => p.starDelta >= 1.5));
    pRow('Stars GREW 1.0–1.4',               withBoth.filter(p => p.starDelta >= 1.0 && p.starDelta < 1.5));
    pRow('Stars GREW 0.5',                   withBoth.filter(p => p.starDelta === 0.5));
    pRow('Stars UNCHANGED',                  withBoth.filter(p => p.starDelta === 0));
    pRow('Stars DROPPED 0.5',               withBoth.filter(p => p.starDelta === -0.5));
    pRow('Stars DROPPED ≥ 1.0 (fading)',    withBoth.filter(p => p.starDelta <= -1.0));
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §14 — COMPOSITE V2 MODEL
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  COMPOSITE V2 MODEL (data-driven scoring)');
  console.log('═'.repeat(95));
  console.log('  Score = implied prob + EV edge − opposition − criteria penalty + $7K bonus + sharp bracket');
  hdr('BY COMPOSITE V2 SCORE');
  pRow('ELITE   (≥8)',       graded.filter(p => compositeV2(p) >= 8));
  pRow('STRONG  (5–7)',      graded.filter(p => compositeV2(p) >= 5 && compositeV2(p) < 8));
  pRow('SOLID   (3–4)',      graded.filter(p => compositeV2(p) >= 3 && compositeV2(p) < 5));
  pRow('LEAN    (1–2)',      graded.filter(p => compositeV2(p) >= 1 && compositeV2(p) < 3));
  pRow('AVOID   (≤0)',       graded.filter(p => compositeV2(p) <= 0));
  sep('V2 vs TOP PICK cross');
  const posV2 = graded.filter(p => compositeV2(p) > 0);
  const negV2 = graded.filter(p => compositeV2(p) <= 0);
  pRow('V2 > 0 + TOP PICK', posV2.filter(p => p.starDelta >= 1));
  pRow('V2 > 0 + Non-TOP',  posV2.filter(p => p.starDelta < 1));
  pRow('V2 ≤ 0 + TOP PICK', negV2.filter(p => p.starDelta >= 1));
  pRow('V2 ≤ 0 + Non-TOP',  negV2.filter(p => p.starDelta < 1));

  // ════════════════════════════════════════════════════════════════════════════
  //  §15 — SPORT BREAKDOWN
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  SPORT BREAKDOWN — ALL TIME');
  console.log('═'.repeat(95));
  for (const sport of ['NHL', 'MLB', 'NBA', 'CBB']) {
    const s = graded.filter(p => p.sport === sport);
    if (!s.length) continue;
    const o = ov(s);
    console.log(`\n  ${o.icon}  ${sport}  ${o.record}  ${o.winPct} WR  ${sgn(o.profit)}  ROI ${o.roiStr}`);
    hdr(`${sport} — BY HALF-STAR`);
    for (const stars of [5, 4.5, 4, 3.5, 3, 2.5]) {
      const b = s.filter(p => halfBucket(p.stars) === stars);
      if (b.length) pRow(`  ${GLYPH(stars)}  ${stars}★`, b);
    }
    hdr(`${sport} — TOP PICK`);
    topPickBlock(s);
    hdr(`${sport} — KEY SIGNALS`);
    pRow('  EV ≥1%',   s.filter(p => p.evEdge >= 1));
    pRow('  EV 0-1%',  s.filter(p => p.evEdge > 0 && p.evEdge < 1));
    pRow('  Clean',    s.filter(p => !p.isContested));
    pRow('  Contested',s.filter(p => p.isContested));
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §16 — CLV
  // ════════════════════════════════════════════════════════════════════════════

  const withCLV = graded.filter(p => p.clv != null);
  if (withCLV.length >= 5) {
    console.log('\n' + '═'.repeat(95));
    console.log('  CLOSING LINE VALUE (CLV)');
    console.log('═'.repeat(95));
    const avgCLV = withCLV.reduce((s, p) => s + p.clv, 0) / withCLV.length;
    const beatClose = withCLV.filter(p => p.clv > 0).length;
    console.log(`\n  Picks: ${withCLV.length}  |  Avg CLV: ${(avgCLV * 100).toFixed(2)}%  |  Beat close: ${beatClose}/${withCLV.length} (${pct(beatClose, withCLV.length)})`);
    hdr('CLV BREAKDOWN');
    pRow('CLV positive  (beat close)',           withCLV.filter(p => p.clv > 0));
    pRow('CLV negative  (missed close)',         withCLV.filter(p => p.clv <= 0));
    pRow('TOP PICK + CLV positive',             withCLV.filter(p => p.clv > 0 && p.starDelta >= 1));
    pRow('TOP PICK + CLV negative',             withCLV.filter(p => p.clv <= 0 && p.starDelta >= 1));
    pRow('EV ≥1% + CLV positive',              withCLV.filter(p => p.evEdge >= 1 && p.clv > 0));
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  §17 — ROLLING WINDOW TRACKER
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  ROLLING WINDOW TRACKER — Is the edge alive, shifting, or dying?');
  console.log('═'.repeat(95));
  const COL = 11;
  console.log(`\n  ${'Signal'.padEnd(36)}  ${'7d'.padStart(COL)}  ${'14d'.padStart(COL)}  ${'30d'.padStart(COL)}  ${'All'.padStart(COL)}  Trend`);
  console.log('  ' + '─'.repeat(82));

  const rWin  = (arr, cutoff) => { const g = arr.filter(p => p.date >= cutoff); return g.length >= 3 ? g.filter(p => p.outcome === 'WIN').length / g.length * 100 : null; };
  const rROI  = (arr, cutoff) => { const g = arr.filter(p => p.date >= cutoff); if (g.length < 3) return null; const pr = g.reduce((s, p) => s + p.profit, 0), u = g.reduce((s, p) => s + p.units, 0); return u > 0 ? pr / u * 100 : null; };
  const trend = (v7, vAll) => v7 != null && vAll != null ? ((v7 - vAll) > 3 ? '↑ UP' : (v7 - vAll) < -3 ? '↓ DOWN' : '→ STABLE') : '--';

  function rollRow(label, arr) {
    const v7 = rWin(arr, D7), v14 = rWin(arr, D14), v30 = rWin(arr, D30);
    const vAll = arr.length >= 3 ? arr.filter(p => p.outcome === 'WIN').length / arr.length * 100 : null;
    const cells = [v7, v14, v30, vAll].map(v => (v == null ? '--' : v.toFixed(1) + '%').padStart(COL));
    console.log(`  ${label.padEnd(36)}  ${cells.join('  ')}  ${trend(v7, vAll)}`);
  }

  function rollROIRow(label, arr) {
    const v7 = rROI(arr, D7), v14 = rROI(arr, D14), v30 = rROI(arr, D30);
    const u = arr.reduce((s, p) => s + p.units, 0), pr = arr.reduce((s, p) => s + p.profit, 0);
    const vAll = u > 0 ? pr / u * 100 : null;
    const cells = [v7, v14, v30, vAll].map(v => (v == null ? '--' : (v >= 0 ? '+' : '') + v.toFixed(1) + '%').padStart(COL));
    console.log(`  ${label.padEnd(36)}  ${cells.join('  ')}  ${trend(v7, vAll)}`);
  }

  rollRow('Overall Win%',           graded);
  rollROIRow('Overall ROI',          graded);
  rollRow('4★ bucket Win%',         graded.filter(p => intBucket(p.stars) === 4));
  rollRow('3★ bucket Win%',         graded.filter(p => intBucket(p.stars) === 3));
  rollRow('3.5★ half-star Win%',    graded.filter(p => halfBucket(p.stars) === 3.5));
  rollRow('3.0★ half-star Win%',    graded.filter(p => halfBucket(p.stars) === 3.0));
  rollRow('2.5★ half-star Win%',    graded.filter(p => halfBucket(p.stars) === 2.5));
  rollRow('TOP PICK Win%',          graded.filter(p => p.lockStars > 0 && p.starDelta >= 1.0));
  rollRow('Non-TOP Win%',           graded.filter(p => p.lockStars > 0 && p.starDelta < 1.0));
  rollRow('EV ≥1% Win%',            graded.filter(p => p.evEdge >= 1));
  rollRow('EV 0-1% Win%',           graded.filter(p => p.evEdge > 0 && p.evEdge < 1));
  rollRow('Clean Win%',             clean);
  rollRow('Pinn ✓ Win%',            graded.filter(p => p.pinnConf));
  rollRow('NO Pinn Win%',           graded.filter(p => !p.pinnConf));
  rollRow('MLB Win%',               graded.filter(p => p.sport === 'MLB'));
  rollRow('NHL Win%',               graded.filter(p => p.sport === 'NHL'));
  rollRow('CBB Win%',               graded.filter(p => p.sport === 'CBB'));
  console.log('\n  Legend: ↑ UP = improving (>+3pp vs all-time) | → STABLE | ↓ DOWN = declining (>-3pp)');

  // ════════════════════════════════════════════════════════════════════════════
  //  §18 — FULL DAILY TREND
  // ════════════════════════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(95));
  console.log('  DAILY TREND — FULL HISTORY (most recent first)');
  console.log('═'.repeat(95));
  console.log('\n  Date        ALL picks          TOP PICK only      Non-TOP only       Running P/L');
  console.log('              n  Rec    Win% P/L  n  Rec   Win% P/L  n  Win%  P/L');
  console.log('  ' + '─'.repeat(90));

  let running = 0;
  const runMap = {};
  for (const d of allDates) {
    running += graded.filter(p => p.date === d).reduce((s, p) => s + p.profit, 0);
    runMap[d] = +running.toFixed(2);
  }

  const r8 = (w, l) => `${w}-${l}`.padStart(6);
  const p6 = (w, n) => (n > 0 ? pct(w, n) : '—').padStart(5);
  const p8 = v => (fmt(v, 1) + 'u').padStart(7);

  for (const date of [...allDates].reverse()) {
    const day = graded.filter(p => p.date === date);
    const tp  = day.filter(p => p.lockStars > 0 && p.starDelta >= 1.0);
    const ntp = day.filter(p => p.lockStars > 0 && p.starDelta < 1.0);
    const dW = day.filter(p => p.outcome === 'WIN').length, dL = day.filter(p => p.outcome === 'LOSS').length;
    const tW = tp.filter(p => p.outcome === 'WIN').length,  tL = tp.filter(p => p.outcome === 'LOSS').length;
    const nW = ntp.filter(p => p.outcome === 'WIN').length;
    const dP = day.reduce((s, p) => s + p.profit, 0);
    const tP = tp.reduce((s, p) => s + p.profit, 0);
    const nP = ntp.reduce((s, p) => s + p.profit, 0);
    const icon = dP >= 0 ? '🟢' : '🔴';
    console.log(
      `  ${icon} ${date}` +
      `  ${String(day.length).padStart(3)}` +
      `  ${r8(dW, dL)}` +
      `  ${p6(dW, dW + dL)}` +
      `  ${p8(dP)}` +
      `  ${String(tp.length).padStart(3)}` +
      `  ${r8(tW, tL)}` +
      `  ${p6(tW, tW + tL)}` +
      `  ${p8(tP)}` +
      `  ${String(ntp.length).padStart(3)}` +
      `  ${p6(nW, ntp.length)}` +
      `  ${p8(nP)}` +
      `  [${fmt(runMap[date])}u]`
    );
  }

  // ── Cumulative summary ───────────────────────────────────────────────────
  console.log('\n  ' + '─'.repeat(90));
  const finalOv  = ov(graded);
  const tpFinal  = graded.filter(p => p.lockStars > 0 && p.starDelta >= 1.0);
  const ntFinal  = graded.filter(p => p.lockStars > 0 && p.starDelta < 1.0);
  const tpOvF    = ov(tpFinal);
  const ntOvF    = ov(ntFinal);

  console.log(`\n  TOTALS:`);
  console.log(`    ${finalOv.icon} ALL:      ${finalOv.record}  ${finalOv.winPct} WR  ${sgn(finalOv.profit)}  ROI ${finalOv.roiStr}`);
  if (tpFinal.length) console.log(`    🔥 TOP PICK: ${tpOvF.record}  ${tpOvF.winPct} WR  ${sgn(tpOvF.profit)}  ROI ${tpOvF.roiStr}`);
  if (ntFinal.length) console.log(`    📊 NON-TOP:  ${ntOvF.record}  ${ntOvF.winPct} WR  ${sgn(ntOvF.profit)}  ROI ${ntOvF.roiStr}`);

  // ════════════════════════════════════════════════════════════════════════════
  //  §19 — TOP PICK vs NON-TOP PICK DEEP PROFILE
  //
  //  Purpose: Determine if Top Picks are structurally different from Non-Top-Picks
  //  in their measurable input features, or if the delta itself is the signal.
  //
  //  Key questions:
  //    1. Do Top Picks have systematically different EV, sharp count, odds, etc.?
  //    2. At the same star level, can you distinguish TP from Non-TP by features?
  //    3. Were Top Picks identifiable at lock time, or only after growth?
  //    4. Does the causal chain (sharps → Pinnacle moves → EV opens) explain growth?
  //
  //  Results go into SHARP_FLOW_ANALYSIS.md § "Top Pick Profile Analysis"
  //  Re-run weekly as sample grows. Key thresholds: n >= 30 per group for reliability.
  // ════════════════════════════════════════════════════════════════════════════

  const withLD = graded.filter(p => p.lockStars > 0);
  const tpAll  = withLD.filter(p => p.starDelta >= 1.0);
  const ntAll  = withLD.filter(p => p.starDelta < 1.0);

  if (tpAll.length >= 5 && ntAll.length >= 5) {
    console.log('\n' + '═'.repeat(95));
    console.log('  §19 — TOP PICK vs NON-TOP PICK: DEEP PROFILE ANALYSIS');
    console.log('═'.repeat(95));
    const tpO = ov(tpAll), ntO = ov(ntAll);
    console.log(`\n  TOP PICK (Δ ≥ 1.0★):  n=${tpAll.length}  ${tpO.record}  ${tpO.winPct} WR  ${sgn(tpO.profit)}  ROI ${tpO.roiStr}`);
    console.log(`  NON-TOP  (Δ < 1.0★):  n=${ntAll.length}  ${ntO.record}  ${ntO.winPct} WR  ${sgn(ntO.profit)}  ROI ${ntO.roiStr}`);

    // ── Section A: Distribution Statistics ──────────────────────────────────
    console.log('\n  ╔══ A. DISTRIBUTION STATISTICS (mean / median) ═══════════════════════════════════╗');
    const COL_L = 24, COL_V = 22;
    console.log(`  ${''.padEnd(COL_L)}  ${'TOP PICK'.padStart(COL_V)}  ${'NON-TOP'.padStart(COL_V)}  ${'Delta'.padStart(10)}`);
    console.log('  ' + '─'.repeat(COL_L + COL_V * 2 + 16));

    function distRow(label, tpArr, ntArr, decimals = 1, prefix = '', suffix = '') {
      const tpM = mean(tpArr), tpMd = median(tpArr);
      const ntM = mean(ntArr), ntMd = median(ntArr);
      const delta = tpM - ntM;
      const fmtV = (m, md) => `${prefix}${m.toFixed(decimals)}${suffix} / ${prefix}${md.toFixed(decimals)}${suffix}`;
      const dStr = (delta >= 0 ? '+' : '') + delta.toFixed(decimals);
      console.log(`  ${label.padEnd(COL_L)}  ${fmtV(tpM, tpMd).padStart(COL_V)}  ${fmtV(ntM, ntMd).padStart(COL_V)}  ${dStr.padStart(10)}`);
    }

    distRow('Peak Stars', tpAll.map(p => p.stars), ntAll.map(p => p.stars));
    distRow('Lock Stars', tpAll.map(p => p.lockStars), ntAll.map(p => p.lockStars));
    distRow('Star Delta', tpAll.map(p => p.starDelta), ntAll.map(p => p.starDelta));
    distRow('Sharp Count', tpAll.map(p => p.sharpCount), ntAll.map(p => p.sharpCount), 1);
    distRow('Total Invested', tpAll.map(p => p.totalInvested), ntAll.map(p => p.totalInvested), 0, '$');
    distRow('Avg Bet Size', tpAll.map(p => p.avgBet), ntAll.map(p => p.avgBet), 0, '$');
    distRow('EV Edge', tpAll.filter(p => p.evEdge != null).map(p => p.evEdge), ntAll.filter(p => p.evEdge != null).map(p => p.evEdge), 2, '', '%');
    distRow('Lock EV', tpAll.filter(p => p.lockEV != null).map(p => p.lockEV), ntAll.filter(p => p.lockEV != null).map(p => p.lockEV), 2, '', '%');
    distRow('Criteria Met', tpAll.map(p => p.criteriaMet), ntAll.map(p => p.criteriaMet), 1);

    const tpOdds = tpAll.filter(p => p.odds != null);
    const ntOdds = ntAll.filter(p => p.odds != null);
    if (tpOdds.length && ntOdds.length) {
      distRow('Odds', tpOdds.map(p => p.odds), ntOdds.map(p => p.odds), 0);
      distRow('Implied Prob', tpOdds.map(p => implProb(p.odds)).filter(Boolean), ntOdds.map(p => implProb(p.odds)).filter(Boolean), 3);
    }

    const tpH = tpAll.filter(p => p.hoursOut != null);
    const ntH = ntAll.filter(p => p.hoursOut != null);
    if (tpH.length && ntH.length) distRow('Hours Before Game', tpH.map(p => p.hoursOut), ntH.map(p => p.hoursOut), 1, '', 'h');

    const tpCLV = tpAll.filter(p => p.clv != null);
    const ntCLV = ntAll.filter(p => p.clv != null);
    if (tpCLV.length >= 3 && ntCLV.length >= 3) distRow('CLV', tpCLV.map(p => p.clv * 100), ntCLV.map(p => p.clv * 100), 2, '', '%');

    distRow('Units Risked', tpAll.map(p => p.units), ntAll.map(p => p.units), 2, '', 'u');

    // ── Section B: Categorical Feature Distributions ────────────────────────
    console.log('\n  ╔══ B. CATEGORICAL FEATURE DISTRIBUTIONS ══════════════════════════════════════════╗');
    console.log(`  ${''.padEnd(COL_L)}  ${'TOP PICK'.padStart(12)}  ${'NON-TOP'.padStart(12)}  ${'Delta (pp)'.padStart(12)}`);
    console.log('  ' + '─'.repeat(COL_L + 42));

    function catRow(label, tpArr, ntArr, fn) {
      const tpPct = tpArr.length ? tpArr.filter(fn).length / tpArr.length * 100 : 0;
      const ntPct = ntArr.length ? ntArr.filter(fn).length / ntArr.length * 100 : 0;
      const delta = tpPct - ntPct;
      const dStr = (delta >= 0 ? '+' : '') + delta.toFixed(1);
      console.log(`  ${label.padEnd(COL_L)}  ${(tpPct.toFixed(1) + '%').padStart(12)}  ${(ntPct.toFixed(1) + '%').padStart(12)}  ${(dStr + 'pp').padStart(12)}`);
    }

    catRow('Pinnacle Confirms', tpAll, ntAll, p => p.pinnConf);
    catRow('Line Moving With', tpAll, ntAll, p => p.lineWith);
    catRow('$7K+ Invested', tpAll, ntAll, p => p.invested7k);
    catRow('Pred Market Aligns', tpAll, ntAll, p => p.predAligns);
    catRow('+EV (any)', tpAll, ntAll, p => p.evEdge > 0);
    catRow('EV >= 1%', tpAll, ntAll, p => p.evEdge >= 1);
    catRow('EV 0-1% (trap)', tpAll, ntAll, p => p.evEdge > 0 && p.evEdge < 1);
    catRow('3+ Sharps', tpAll, ntAll, p => p.sharpCount >= 3);
    catRow('Clean (no opp)', tpAll, ntAll, p => !p.isContested);
    catRow('Contested', tpAll, ntAll, p => p.isContested);
    console.log('  ' + '─'.repeat(COL_L + 42));
    catRow('DOMINANT consensus', tpAll, ntAll, p => p.consGrade === 'DOMINANT');
    catRow('STRONG consensus', tpAll, ntAll, p => p.consGrade === 'STRONG');
    catRow('LEAN consensus', tpAll, ntAll, p => p.consGrade === 'LEAN');
    catRow('CONTESTED consensus', tpAll, ntAll, p => p.consGrade === 'CONTESTED');
    console.log('  ' + '─'.repeat(COL_L + 42));
    catRow('Heavy Fav (≤-200)', tpAll, ntAll, p => p.odds != null && p.odds <= -200);
    catRow('Fav (-199 to -120)', tpAll, ntAll, p => p.odds != null && p.odds > -200 && p.odds <= -120);
    catRow('Pick/Near-Even', tpAll, ntAll, p => p.odds != null && p.odds > -120 && p.odds <= 130);
    catRow('Dog (+131 to +200)', tpAll, ntAll, p => p.odds != null && p.odds > 130 && p.odds <= 200);
    catRow('Big Dog (+201+)', tpAll, ntAll, p => p.odds != null && p.odds > 200);
    console.log('  ' + '─'.repeat(COL_L + 42));
    catRow('NHL', tpAll, ntAll, p => p.sport === 'NHL');
    catRow('MLB', tpAll, ntAll, p => p.sport === 'MLB');
    catRow('CBB', tpAll, ntAll, p => p.sport === 'CBB');
    catRow('NBA', tpAll, ntAll, p => p.sport === 'NBA');

    // ── Section C: Same-Star-Tier Head-to-Head ──────────────────────────────
    console.log('\n  ╔══ C. SAME-STAR HEAD-TO-HEAD ════════════════════════════════════════════════════╗');
    console.log('  Can you tell the difference between a 4★ Top Pick and a 4★ Non-Top-Pick?\n');

    for (const tier of [5, 4, 3]) {
      const tpTier = tpAll.filter(p => intBucket(p.stars) === tier);
      const ntTier = ntAll.filter(p => intBucket(p.stars) === tier);
      if (!tpTier.length && !ntTier.length) continue;

      const tierLabel = tier === 5 ? '5★ (≥4.5)' : tier === 4 ? '4★ (3.5-4.4)' : '3★ (2.5-3.4)';
      console.log(`\n  ── ${tierLabel} ──────────────────────────────────────────────────────`);

      if (tpTier.length) { const o = ov(tpTier); console.log(`  TOP PICK ${tierLabel}:  n=${tpTier.length}  ${o.record}  ${o.winPct} WR  ${sgn(o.profit)}  ROI ${o.roiStr}`); }
      else console.log(`  TOP PICK ${tierLabel}:  n=0`);
      if (ntTier.length) { const o = ov(ntTier); console.log(`  NON-TOP  ${tierLabel}:  n=${ntTier.length}  ${o.record}  ${o.winPct} WR  ${sgn(o.profit)}  ROI ${o.roiStr}`); }
      else console.log(`  NON-TOP  ${tierLabel}:  n=0`);

      if (tpTier.length >= 3 && ntTier.length >= 3) {
        console.log(`\n  ${'Feature'.padEnd(COL_L)}  ${'TP mean'.padStart(12)}  ${'Non-TP mean'.padStart(12)}  ${'Delta'.padStart(10)}`);
        console.log('  ' + '─'.repeat(COL_L + 40));
        const feats = [
          ['Lock Stars', p => p.lockStars, 1],
          ['Star Delta', p => p.starDelta, 1],
          ['Sharp Count', p => p.sharpCount, 1],
          ['Total Invested', p => p.totalInvested, 0],
          ['Avg Bet', p => p.avgBet, 0],
          ['EV Edge', p => p.evEdge, 2],
          ['Criteria Met', p => p.criteriaMet, 1],
        ];
        for (const [lbl, fn, dec] of feats) {
          const tpV = tpTier.map(fn).filter(v => v != null);
          const ntV = ntTier.map(fn).filter(v => v != null);
          if (tpV.length && ntV.length) {
            const tM = mean(tpV), nM = mean(ntV), d = tM - nM;
            console.log(`  ${lbl.padEnd(COL_L)}  ${tM.toFixed(dec).padStart(12)}  ${nM.toFixed(dec).padStart(12)}  ${((d >= 0 ? '+' : '') + d.toFixed(dec)).padStart(10)}`);
          }
        }
        console.log(`\n  ${'Signal'.padEnd(COL_L)}  ${'TP %'.padStart(12)}  ${'Non-TP %'.padStart(12)}  ${'Delta'.padStart(10)}`);
        console.log('  ' + '─'.repeat(COL_L + 40));
        const signals = [
          ['Pinn Confirms', p => p.pinnConf],
          ['Line Moving', p => p.lineWith],
          ['EV >= 1%', p => p.evEdge >= 1],
          ['EV 0-1% (trap)', p => p.evEdge > 0 && p.evEdge < 1],
          ['Clean (no opp)', p => !p.isContested],
          ['$7K+ Invested', p => p.invested7k],
        ];
        for (const [lbl, fn] of signals) {
          const tpPc = tpTier.length ? (tpTier.filter(fn).length / tpTier.length * 100) : 0;
          const ntPc = ntTier.length ? (ntTier.filter(fn).length / ntTier.length * 100) : 0;
          const d = tpPc - ntPc;
          console.log(`  ${lbl.padEnd(COL_L)}  ${(tpPc.toFixed(1) + '%').padStart(12)}  ${(ntPc.toFixed(1) + '%').padStart(12)}  ${((d >= 0 ? '+' : '') + d.toFixed(1) + 'pp').padStart(10)}`);
        }
      }
    }

    // ── Section D: Lock-State Profile ────────────────────────────────────────
    console.log('\n  ╔══ D. LOCK-STATE PROFILE (what they looked like at lock time) ═══════════════════╗');
    console.log('  Were Top Picks identifiable at lock time, or only after growth?\n');

    console.log(`  ${'Lock Feature'.padEnd(COL_L)}  ${'TOP PICK'.padStart(COL_V)}  ${'NON-TOP'.padStart(COL_V)}  ${'Delta'.padStart(10)}`);
    console.log('  ' + '─'.repeat(COL_L + COL_V * 2 + 16));
    distRow('Lock Stars', tpAll.map(p => p.lockStars), ntAll.map(p => p.lockStars));
    distRow('Lock EV', tpAll.filter(p => p.lockEV != null).map(p => p.lockEV), ntAll.filter(p => p.lockEV != null).map(p => p.lockEV), 2, '', '%');
    distRow('Lock Sharp Count', tpAll.map(p => p.sharpCount), ntAll.map(p => p.sharpCount), 1);
    distRow('Lock Money', tpAll.map(p => p.totalInvested), ntAll.map(p => p.totalInvested), 0, '$');
    distRow('Lock Avg Bet', tpAll.map(p => p.avgBet), ntAll.map(p => p.avgBet), 0, '$');
    distRow('Lock Criteria Met', tpAll.map(p => p.criteriaMet), ntAll.map(p => p.criteriaMet), 1);

    console.log('\n  Lock-time signals:');
    console.log(`  ${'Signal at Lock'.padEnd(COL_L)}  ${'TOP PICK'.padStart(12)}  ${'NON-TOP'.padStart(12)}  ${'Delta (pp)'.padStart(12)}`);
    console.log('  ' + '─'.repeat(COL_L + 42));
    catRow('Pinn Confirms (lock)', tpAll, ntAll, p => !!(p.pinnConf));
    catRow('EV >= 1% (lock)', tpAll, ntAll, p => p.lockEV != null && p.lockEV >= 1);
    catRow('EV 0-1% trap (lock)', tpAll, ntAll, p => p.lockEV != null && p.lockEV > 0 && p.lockEV < 1);
    catRow('EV <= 0 (lock)', tpAll, ntAll, p => p.lockEV != null && p.lockEV <= 0);
    catRow('Clean at lock', tpAll, ntAll, p => !p.isContested);

    // ── Section E: Growth Profile (Top Picks only) ──────────────────────────
    console.log('\n  ╔══ E. GROWTH PROFILE — What changed from lock to peak (Top Picks only) ═════════╗');
    console.log('  Does the causal chain (sharps arrive → Pinnacle moves → EV opens) explain growth?\n');

    const tpWithEV = tpAll.filter(p => p.lockEV != null && p.evEdge != null);
    if (tpWithEV.length >= 3) {
      const evGrew    = tpWithEV.filter(p => p.evEdge - p.lockEV > 0.5);
      const evStable  = tpWithEV.filter(p => Math.abs(p.evEdge - p.lockEV) <= 0.5);
      const evDropped = tpWithEV.filter(p => p.evEdge - p.lockEV < -0.5);
      console.log(`  EV TRAJECTORY (lock → peak, n=${tpWithEV.length} Top Picks with EV data):`);
      pRow('  EV grew > +0.5%', evGrew, '    ');
      pRow('  EV stable (±0.5%)', evStable, '    ');
      pRow('  EV dropped > -0.5%', evDropped, '    ');

      const evNegToPos = tpWithEV.filter(p => p.lockEV <= 0 && p.evEdge >= 1);
      const evTrapToPos = tpWithEV.filter(p => p.lockEV > 0 && p.lockEV < 1 && p.evEdge >= 1);
      const evPosStayed = tpWithEV.filter(p => p.lockEV >= 1 && p.evEdge >= 1);
      const evPosLost = tpWithEV.filter(p => p.lockEV >= 1 && p.evEdge < 1);
      sep('EV state transitions (Top Picks)');
      pRow('  EV ≤0 at lock → ≥1% at peak', evNegToPos, '    ');
      pRow('  EV 0-1% at lock → ≥1% at peak', evTrapToPos, '    ');
      pRow('  EV ≥1% at lock → still ≥1%', evPosStayed, '    ');
      pRow('  EV ≥1% at lock → dropped <1%', evPosLost, '    ');

      const avgLockEV = mean(tpWithEV.map(p => p.lockEV));
      const avgPeakEV = mean(tpWithEV.map(p => p.evEdge));
      console.log(`\n  Avg EV at lock: ${avgLockEV.toFixed(2)}%  →  Avg EV at peak: ${avgPeakEV.toFixed(2)}%  (Δ ${(avgPeakEV - avgLockEV >= 0 ? '+' : '')}${(avgPeakEV - avgLockEV).toFixed(2)}%)`);
    }

    sep('Pinnacle chain confirmation');
    const tpNoPinnLock = tpAll.filter(p => {
      if (p.lockEV != null && p.evEdge != null) return p.lockEV < 0.5 && p.evEdge >= 1;
      return false;
    });
    console.log(`  Top Picks where EV was <0.5% at lock but ≥1% at peak: ${tpNoPinnLock.length}/${tpAll.length} (${catPct(tpAll, p => p.lockEV != null && p.lockEV < 0.5 && p.evEdge != null && p.evEdge >= 1)})`);
    console.log(`  → This represents the Pinnacle-move / retail-lag chain creating the EV window post-lock.`);

    if (tpNoPinnLock.length >= 3) {
      const chainO = ov(tpNoPinnLock);
      console.log(`  Performance of chain-confirmed Top Picks: ${chainO.record}  ${chainO.winPct} WR  ${sgn(chainO.profit)}  ROI ${chainO.roiStr}`);
    }

    sep('Star delta breakdown');
    console.log(`  Delta tier distribution within Top Picks (n=${tpAll.length}):`);
    pRow('  Δ 1.0',   tpAll.filter(p => p.starDelta >= 1.0 && p.starDelta < 1.5), '    ');
    pRow('  Δ 1.5',   tpAll.filter(p => p.starDelta >= 1.5 && p.starDelta < 2.0), '    ');
    pRow('  Δ 2.0+',  tpAll.filter(p => p.starDelta >= 2.0), '    ');

    // ── Section F: Summary Verdict ──────────────────────────────────────────
    console.log('\n  ╔══ F. PROFILE VERDICT ════════════════════════════════════════════════════════════╗');

    const tpEvPct = tpAll.filter(p => p.evEdge >= 1).length / tpAll.length * 100;
    const ntEvPct = ntAll.filter(p => p.evEdge >= 1).length / ntAll.length * 100;
    const tpPinnPct = tpAll.filter(p => p.pinnConf).length / tpAll.length * 100;
    const ntPinnPct = ntAll.filter(p => p.pinnConf).length / ntAll.length * 100;
    const tpCleanPct = tpAll.filter(p => !p.isContested).length / tpAll.length * 100;
    const ntCleanPct = ntAll.filter(p => !p.isContested).length / ntAll.length * 100;
    const tpAvgSC = mean(tpAll.map(p => p.sharpCount));
    const ntAvgSC = mean(ntAll.map(p => p.sharpCount));
    const tpAvgInv = mean(tpAll.map(p => p.totalInvested));
    const ntAvgInv = mean(ntAll.map(p => p.totalInvested));

    console.log(`\n  Biggest feature gaps (Top Pick − Non-Top):`);
    const gaps = [
      ['EV >= 1%', tpEvPct - ntEvPct, 'pp'],
      ['Pinn Confirms', tpPinnPct - ntPinnPct, 'pp'],
      ['Clean (no opp)', tpCleanPct - ntCleanPct, 'pp'],
      ['Avg Sharp Count', tpAvgSC - ntAvgSC, ''],
      ['Avg Invested', tpAvgInv - ntAvgInv, ''],
    ].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

    for (const [label, delta, unit] of gaps) {
      const dir = delta >= 0 ? '↑ TP higher' : '↓ TP lower';
      console.log(`    ${label.padEnd(20)}  ${(delta >= 0 ? '+' : '') + delta.toFixed(1)}${unit}  ${dir}`);
    }

    const avgLockStarsTP = mean(tpAll.map(p => p.lockStars));
    const avgLockStarsNT = mean(ntAll.map(p => p.lockStars));
    console.log(`\n  Lock-time identifiability:`);
    console.log(`    Avg lock stars — TP: ${avgLockStarsTP.toFixed(1)}  NT: ${avgLockStarsNT.toFixed(1)}  → ${Math.abs(avgLockStarsTP - avgLockStarsNT) < 0.3 ? 'SIMILAR at lock (not identifiable early)' : 'DIFFERENT at lock (identifiable early)'}`);

    console.log('\n  ' + '─'.repeat(90));
  }

  // ════════════════════════════════════════════════════════════════════════════
  // §20 — PINNACLE + EV QUADRANT MATRIX BY STAR LEVEL
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(95));
  hdr('PINNACLE + EV QUADRANT MATRIX BY STAR LEVEL');

  const pinnEVPicks = graded.filter(p => p.evEdge != null);
  const pinnDir = p => p.pinnConf || p.lineWith;
  const hasEV   = p => p.evEdge >= 1;

  const q1 = pinnEVPicks.filter(p => pinnDir(p) && hasEV(p));
  const q2 = pinnEVPicks.filter(p => pinnDir(p) && !hasEV(p));
  const q3 = pinnEVPicks.filter(p => !pinnDir(p) && hasEV(p));
  const q4 = pinnEVPicks.filter(p => !pinnDir(p) && !hasEV(p));

  sep('OVERALL QUADRANT SUMMARY (all star levels combined)');
  pRow('Q1: Pinn ✓ + EV ≥1%  (full chain)', q1);
  pRow('Q2: Pinn ✓ + EV <1%  (gap closed)',  q2);
  pRow('Q3: No Pinn + EV ≥1% (pre-mkt edge)',q3);
  pRow('Q4: No Pinn + No EV  (baseline)',     q4);
  pRow('ALL with EV data',                    pinnEVPicks);

  sep('STAR LEVEL × QUADRANT MATRIX');
  const starTiers = [5, 4.5, 4, 3.5, 3, 2.5];
  for (const tier of starTiers) {
    const tierPicks = pinnEVPicks.filter(p => p.stars === tier);
    if (tierPicks.length < 2) continue;
    console.log(`\n    ── ${tier}★ (n=${tierPicks.length}) ──`);
    pRow(`  ${tier}★ Q1: Pinn ✓ + EV ≥1%`, tierPicks.filter(p => pinnDir(p) && hasEV(p)), '  ');
    pRow(`  ${tier}★ Q2: Pinn ✓ + EV <1%`, tierPicks.filter(p => pinnDir(p) && !hasEV(p)), '  ');
    pRow(`  ${tier}★ Q3: No Pinn + EV ≥1%`,tierPicks.filter(p => !pinnDir(p) && hasEV(p)), '  ');
    pRow(`  ${tier}★ Q4: No Pinn + No EV`, tierPicks.filter(p => !pinnDir(p) && !hasEV(p)), '  ');
  }

  sep('BUCKETED STAR LEVEL × QUADRANT (larger sample sizes)');
  const starBuckets = [
    { label: '4-5★ (elite)',  fn: p => p.stars >= 4 },
    { label: '3-3.5★ (solid)',fn: p => p.stars >= 3 && p.stars < 4 },
    { label: '2.5★ (thresh)', fn: p => p.stars === 2.5 },
  ];
  for (const { label, fn } of starBuckets) {
    const bk = pinnEVPicks.filter(fn);
    if (bk.length < 2) continue;
    console.log(`\n    ── ${label} (n=${bk.length}) ──`);
    pRow(`  ${label} Q1: Pinn ✓ + EV ≥1%`, bk.filter(p => pinnDir(p) && hasEV(p)), '  ');
    pRow(`  ${label} Q2: Pinn ✓ + EV <1%`, bk.filter(p => pinnDir(p) && !hasEV(p)), '  ');
    pRow(`  ${label} Q3: No Pinn + EV ≥1%`,bk.filter(p => !pinnDir(p) && hasEV(p)), '  ');
    pRow(`  ${label} Q4: No Pinn + No EV`, bk.filter(p => !pinnDir(p) && !hasEV(p)), '  ');
  }

  sep('Q1 DEEP DIVE — EV GRANULARITY WHEN PINNACLE CONFIRMS');
  const q1Picks = pinnEVPicks.filter(p => pinnDir(p) && p.evEdge >= 1);
  pRow('Pinn ✓ + EV 1-2%', q1Picks.filter(p => p.evEdge >= 1 && p.evEdge < 2));
  pRow('Pinn ✓ + EV 2-3%', q1Picks.filter(p => p.evEdge >= 2 && p.evEdge < 3));
  pRow('Pinn ✓ + EV 3%+',  q1Picks.filter(p => p.evEdge >= 3));

  sep('Q2 DEEP DIVE — PINNACLE TYPE WHEN NO EV');
  const q2Picks = pinnEVPicks.filter(p => pinnDir(p) && !hasEV(p));
  pRow('Pinn confirms + line WITH (no EV)', q2Picks.filter(p => p.pinnConf && p.lineWith));
  pRow('Pinn confirms only (no EV)',        q2Picks.filter(p => p.pinnConf && !p.lineWith));
  pRow('Line moving WITH only (no EV)',     q2Picks.filter(p => !p.pinnConf && p.lineWith));

  sep('QUADRANT × TOP PICK CROSS');
  pRow('Q1 + Top Pick (δ≥1)',  q1.filter(p => p.starDelta >= 1));
  pRow('Q1 + Non-Top Pick',    q1.filter(p => p.starDelta < 1));
  pRow('Q2 + Top Pick (δ≥1)',  q2.filter(p => p.starDelta >= 1));
  pRow('Q2 + Non-Top Pick',    q2.filter(p => p.starDelta < 1));
  pRow('Q3 + Top Pick (δ≥1)',  q3.filter(p => p.starDelta >= 1));
  pRow('Q3 + Non-Top Pick',    q3.filter(p => p.starDelta < 1));

  sep('THE KEY QUESTION — Does Pinn without EV beat EV without Pinn?');
  pRow('Q2: Pinn ✓, No EV  (gap closed)',     q2);
  pRow('Q3: No Pinn, EV ≥1% (pre-mkt edge)',  q3);
  console.log('  → If Q3 > Q2: EV alone is more valuable than Pinnacle alone');
  console.log('  → If Q2 > Q3: Pinnacle movement itself carries predictive power beyond the gap');

  console.log('\n' + '═'.repeat(95));
  console.log('  SHARP FLOW ANALYSIS COMPLETE');
  console.log('═'.repeat(95) + '\n');
  process.exit(0);
}

run().catch(err => { console.error('Analysis failed:', err.message, '\n', err.stack); process.exit(1); });
