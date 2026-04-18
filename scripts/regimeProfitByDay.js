/**
 * Regime Daily P&L Report — Since V7.1 Implementation (Apr 12)
 *
 * Usage: node scripts/regimeProfitByDay.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const V71_DATE = '2026-04-12';

function americanToImplied(odds) {
  if (!odds) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function profitFromOdds(odds, units) {
  if (odds > 0) return units * (odds / 100);
  return units * (100 / Math.abs(odds));
}

function pct(n, d) { return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—'; }
function pad(s, w) { return String(s).padStart(w); }
function padL(s, w) { return String(s).padEnd(w); }
function sign(n) { return n >= 0 ? '+' + n.toFixed(2) : n.toFixed(2); }

function aggregate(picks) {
  const n = picks.length;
  const w = picks.filter(p => p.won).length;
  const l = picks.filter(p => p.lost).length;
  const pu = picks.filter(p => p.push).length;
  const flatP = picks.reduce((s, p) => s + p.flatProfit, 0);
  const modelP = picks.reduce((s, p) => s + p.modelProfit, 0);
  const totalU = picks.reduce((s, p) => s + p.units, 0);
  const wr = (w + l) > 0 ? ((w / (w + l)) * 100).toFixed(1) : '—';
  const flatROI = n > 0 ? ((flatP / n) * 100).toFixed(1) : '0.0';
  const modelROI = totalU > 0 ? ((modelP / totalU) * 100).toFixed(1) : '0.0';
  const avgStars = n > 0 ? (picks.reduce((s, p) => s + p.stars, 0) / n).toFixed(1) : '—';
  const avgUnits = n > 0 ? (totalU / n).toFixed(2) : '—';
  const clvPicks = picks.filter(p => p.clv != null);
  const avgCLV = clvPicks.length > 0 ? (clvPicks.reduce((s, p) => s + p.clv, 0) / clvPicks.length * 100).toFixed(2) + '%' : '—';
  const clvPos = clvPicks.length > 0 ? pct(clvPicks.filter(p => p.clv > 0).length, clvPicks.length) : '—';
  const upgraded = picks.filter(p => p.starDelta > 0).length;
  const unchanged = picks.filter(p => p.starDelta === 0).length;
  return { n, w, l, pu, wr, flatP, modelP, totalU, flatROI, modelROI, avgStars, avgUnits, avgCLV, clvPos, upgraded, unchanged, record: `${w}-${l}${pu > 0 ? '-' + pu : ''}` };
}

async function run() {
  const collections = [
    ['sharpFlowPicks', 'ML'],
    ['sharpFlowSpreads', 'SPREAD'],
    ['sharpFlowTotals', 'TOTAL'],
  ];

  const picks = [];

  for (const [colName, mktType] of collections) {
    const snap = await db.collection(colName).get();
    snap.forEach(d => {
      const data = d.data();
      if (!data.sides) return;
      for (const [, sd] of Object.entries(data.sides)) {
        if (sd.superseded || sd.health?.status === 'CANCELLED') continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        const res = sd.result || data.result;
        if (!res?.outcome) continue;

        const lk = sd.lock || sd;
        const pk = sd.peak || lk;
        const regime = pk?.regime || lk?.regime || 'NO_MOVE';
        const units = pk?.units || lk?.units || 1;
        const odds = pk?.odds || lk?.odds || 0;
        const lockOdds = lk?.odds || 0;
        const lockPinn = lk?.pinnacleOdds || 0;
        const closingOdds = sd.closingOdds || null;
        const lockPinnProb = americanToImplied(lockPinn);
        const closingProb = closingOdds ? americanToImplied(closingOdds) : null;
        const clv = (lockPinnProb && closingProb) ? closingProb - lockPinnProb : null;

        const lockStars = lk?.stars || 0;
        const peakStars = pk?.stars || lockStars;
        const starDelta = peakStars - lockStars;

        const won = res.outcome === 'WIN';
        const lost = res.outcome === 'LOSS';
        const push = res.outcome === 'PUSH';
        const flatProfit = won ? 1 : push ? 0 : -1;
        const modelProfit = won ? profitFromOdds(odds, units) : push ? 0 : -units;

        picks.push({
          date: data.date,
          sport: data.sport || 'NHL',
          mktType,
          regime,
          units,
          odds,
          lockOdds,
          stars: peakStars,
          lockStars,
          starDelta,
          won, lost, push,
          flatProfit,
          modelProfit,
          clv,
        });
      }
    });
  }

  picks.sort((a, b) => a.date.localeCompare(b.date));

  const v71Picks = picks.filter(p => p.date >= V71_DATE);
  const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];
  const dates = [...new Set(v71Picks.map(p => p.date))].sort();

  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n# Regime Daily P&L Report');
  console.log(`**Since V7.1**: ${V71_DATE} | **Picks**: ${v71Picks.length} | **Generated**: ${new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })}\n`);
  console.log('---\n');

  // ── 1. Regime Summary Since V7.1 ──────────────────────────────────────────
  console.log('## 1. Regime Summary (Since V7.1)\n');
  console.log('| Regime | Picks | Record | WR | Flat ROI | Model P&L | Model ROI | Avg CLV | CLV+% | Avg★ | Avg Units | Upgrades |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const reg of regimes) {
    const rs = v71Picks.filter(p => p.regime === reg);
    if (rs.length === 0) { console.log(`| ${reg} | 0 | — | — | — | — | — | — | — | — | — | — |`); continue; }
    const a = aggregate(rs);
    console.log(`| ${reg} | ${a.n} | ${a.record} | ${a.wr}% | ${a.flatROI}% | ${sign(a.modelP)}u | ${a.modelROI}% | ${a.avgCLV} | ${a.clvPos} | ${a.avgStars} | ${a.avgUnits} | ${a.upgraded}/${a.n} |`);
  }
  const totA = aggregate(v71Picks);
  console.log(`| **TOTAL** | **${totA.n}** | **${totA.record}** | **${totA.wr}%** | **${totA.flatROI}%** | **${sign(totA.modelP)}u** | **${totA.modelROI}%** | **${totA.avgCLV}** | **${totA.clvPos}** | **${totA.avgStars}** | **${totA.avgUnits}** | **${totA.upgraded}/${totA.n}** |`);

  // ── 2. Daily P&L by Regime ────────────────────────────────────────────────
  console.log('\n---\n');
  console.log('## 2. Daily P&L by Regime\n');

  for (const date of dates) {
    const dayPicks = v71Picks.filter(p => p.date === date);
    const dayA = aggregate(dayPicks);
    console.log(`### ${date} — ${dayA.n} picks, ${dayA.record}, ${dayA.wr}% WR, ${sign(dayA.modelP)}u model\n`);
    console.log('| Regime | N | Record | WR | Flat P&L | Model P&L | Model ROI | Avg★ | Upgrades |');
    console.log('|---|---|---|---|---|---|---|---|---|');
    for (const reg of regimes) {
      const rs = dayPicks.filter(p => p.regime === reg);
      if (rs.length === 0) continue;
      const a = aggregate(rs);
      console.log(`| ${reg} | ${a.n} | ${a.record} | ${a.wr}% | ${sign(a.flatP)}u | ${sign(a.modelP)}u | ${a.modelROI}% | ${a.avgStars} | ${a.upgraded}/${a.n} |`);
    }
    console.log(`| **DAY TOTAL** | **${dayA.n}** | **${dayA.record}** | **${dayA.wr}%** | **${sign(dayA.flatP)}u** | **${sign(dayA.modelP)}u** | **${dayA.modelROI}%** | **${dayA.avgStars}** | **${dayA.upgraded}/${dayA.n}** |`);
    console.log('');
  }

  // ── 3. Regime × Star Bucket ───────────────────────────────────────────────
  console.log('---\n');
  console.log('## 3. Regime × Star Bucket (Since V7.1)\n');
  const starBuckets = [5, 4.5, 4, 3.5, 3, 2.5];
  console.log('| Regime | Stars | N | Record | WR | Flat ROI | Model ROI | Avg CLV |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const reg of regimes) {
    const regPicks = v71Picks.filter(p => p.regime === reg);
    if (regPicks.length === 0) continue;
    for (const sb of starBuckets) {
      const rs = regPicks.filter(p => {
        if (sb === 5) return p.stars >= 4.5;
        if (sb === 4.5) return p.stars >= 4 && p.stars < 4.5;
        if (sb === 4) return p.stars >= 3.5 && p.stars < 4;
        if (sb === 3.5) return p.stars >= 3 && p.stars < 3.5;
        if (sb === 3) return p.stars >= 2.5 && p.stars < 3;
        return p.stars < 2.5;
      });
      if (rs.length === 0) continue;
      const a = aggregate(rs);
      console.log(`| ${reg} | ${sb}★ | ${a.n} | ${a.record} | ${a.wr}% | ${a.flatROI}% | ${a.modelROI}% | ${a.avgCLV} |`);
    }
  }

  // ── 4. Regime × Sport ─────────────────────────────────────────────────────
  console.log('\n---\n');
  console.log('## 4. Regime × Sport (Since V7.1)\n');
  const sports = [...new Set(v71Picks.map(p => p.sport))].sort();
  console.log('| Regime | Sport | N | Record | WR | Flat ROI | Model P&L | Model ROI |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const reg of regimes) {
    const regPicks = v71Picks.filter(p => p.regime === reg);
    if (regPicks.length === 0) continue;
    for (const sport of sports) {
      const rs = regPicks.filter(p => p.sport === sport);
      if (rs.length === 0) continue;
      const a = aggregate(rs);
      console.log(`| ${reg} | ${sport} | ${a.n} | ${a.record} | ${a.wr}% | ${a.flatROI}% | ${sign(a.modelP)}u | ${a.modelROI}% |`);
    }
  }

  // ── 5. Regime × Market Type ───────────────────────────────────────────────
  console.log('\n---\n');
  console.log('## 5. Regime × Market Type (Since V7.1)\n');
  console.log('| Regime | Market | N | Record | WR | Flat ROI | Model P&L | Model ROI |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const reg of regimes) {
    const regPicks = v71Picks.filter(p => p.regime === reg);
    if (regPicks.length === 0) continue;
    for (const mt of ['ML', 'SPREAD', 'TOTAL']) {
      const rs = regPicks.filter(p => p.mktType === mt);
      if (rs.length === 0) continue;
      const a = aggregate(rs);
      console.log(`| ${reg} | ${mt} | ${a.n} | ${a.record} | ${a.wr}% | ${a.flatROI}% | ${sign(a.modelP)}u | ${a.modelROI}% |`);
    }
  }

  // ── 6. Regime × Lock vs Update ────────────────────────────────────────────
  console.log('\n---\n');
  console.log('## 6. Regime × Lock vs Update (Since V7.1)\n');
  console.log('| Regime | Group | N | Record | WR | Flat ROI | Model ROI | Avg★Δ |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const reg of regimes) {
    const regPicks = v71Picks.filter(p => p.regime === reg);
    if (regPicks.length === 0) continue;
    const upgraded = regPicks.filter(p => p.starDelta > 0);
    const unchanged = regPicks.filter(p => p.starDelta === 0);
    const downgraded = regPicks.filter(p => p.starDelta < 0);
    for (const [label, grp] of [['Upgraded', upgraded], ['Unchanged', unchanged], ['Downgraded', downgraded]]) {
      if (grp.length === 0) continue;
      const a = aggregate(grp);
      const avgDelta = (grp.reduce((s, p) => s + p.starDelta, 0) / grp.length).toFixed(2);
      console.log(`| ${reg} | ${label} | ${a.n} | ${a.record} | ${a.wr}% | ${a.flatROI}% | ${a.modelROI}% | ${avgDelta} |`);
    }
  }

  // ── 7. Cumulative Regime P&L Trend ────────────────────────────────────────
  console.log('\n---\n');
  console.log('## 7. Cumulative Model P&L by Regime\n');
  for (const reg of regimes) {
    const rs = v71Picks.filter(p => p.regime === reg);
    if (rs.length === 0) continue;
    let cum = 0;
    console.log(`**${reg}** (${rs.length} picks):`);
    for (const date of dates) {
      const dayReg = rs.filter(p => p.date === date);
      if (dayReg.length === 0) continue;
      const dayP = dayReg.reduce((s, p) => s + p.modelProfit, 0);
      cum += dayP;
      const dayW = dayReg.filter(p => p.won).length;
      const dayL = dayReg.filter(p => p.lost).length;
      console.log(`  ${date}  ${dayReg.length} picks  ${dayW}-${dayL}  day: ${sign(dayP)}u  cum: ${sign(cum)}u`);
    }
    console.log('');
  }

  // ── 8. "What If" — NO_MOVE filtered ───────────────────────────────────────
  console.log('---\n');
  console.log('## 8. What-If: Performance Without NO_MOVE\n');
  const noNM = v71Picks.filter(p => p.regime !== 'NO_MOVE');
  const onlyNM = v71Picks.filter(p => p.regime === 'NO_MOVE');
  const aNM = aggregate(noNM);
  const aOnlyNM = aggregate(onlyNM);
  console.log('| Subset | Picks | Record | WR | Flat ROI | Model P&L | Model ROI |');
  console.log('|---|---|---|---|---|---|---|');
  console.log(`| Only MOVE regimes | ${aNM.n} | ${aNM.record} | ${aNM.wr}% | ${aNM.flatROI}% | ${sign(aNM.modelP)}u | ${aNM.modelROI}% |`);
  console.log(`| Only NO_MOVE | ${aOnlyNM.n} | ${aOnlyNM.record} | ${aOnlyNM.wr}% | ${aOnlyNM.flatROI}% | ${sign(aOnlyNM.modelP)}u | ${aOnlyNM.modelROI}% |`);
  console.log(`| All regimes | ${totA.n} | ${totA.record} | ${totA.wr}% | ${totA.flatROI}% | ${sign(totA.modelP)}u | ${totA.modelROI}% |`);

  console.log('\nDone.\n');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
