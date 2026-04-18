/**
 * Regime Deep Analysis
 * Full factor profiling of WINS vs LOSSES within each regime bucket.
 *
 * Usage: node scripts/regimeDeepAnalysis.js
 */

import 'dotenv/config';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, writeFileSync } from 'fs';

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

function americanToImplied(odds) {
  if (!odds) return null;
  return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}

function profitFromOdds(odds, units) {
  if (odds > 0) return units * (odds / 100);
  return units * (100 / Math.abs(odds));
}

function oddsBand(odds) {
  if (odds == null) return 'COIN_FLIP';
  const p = americanToImplied(odds);
  if (p == null) return 'COIN_FLIP';
  if (p >= 0.70) return 'HEAVY_FAV';
  if (p >= 0.55) return 'SLIGHT_FAV';
  if (p >= 0.45) return 'COIN_FLIP';
  if (p >= 0.35) return 'SLIGHT_DOG';
  return 'LONG_DOG';
}

function pct(n, d) { return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '—'; }
function avg(arr) { return arr.length > 0 ? (arr.reduce((s, v) => s + v, 0) / arr.length) : 0; }
function med(arr) {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function sign(n) { return (n >= 0 ? '+' : '') + n.toFixed(2); }

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
        if (!res?.outcome || res.outcome === 'PUSH') continue;

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
        const lockUnits = lk?.units || 1;
        const unitDelta = units - lockUnits;

        const lockSC = lk?.sharpCount || 0;
        const lockInvested = lk?.totalInvested || 0;
        const lockAvgBet = lockSC > 0 ? lockInvested / lockSC : 0;
        const lockMoneyPct = lk?.consensusStrength?.moneyPct ?? 70;
        const lockWalletPct = lk?.consensusStrength?.walletPct ?? 60;
        const lockEvEdge = lk?.evEdge || 0;
        const counterSharp = Math.max(0, 100 - lockMoneyPct);
        const qualityProxy = pk?.qualityProxy ?? lk?.qualityProxy ?? 0;

        const opp = lk?.opposition || pk?.opposition || {};
        const oppSC = opp.sharpCount || 0;
        const oppInvested = opp.totalInvested || 0;

        const againstMoney = 100 - lockMoneyPct;
        const moneyEdge = Math.log((lockMoneyPct + 1) / (againstMoney + 1));
        const sharpEdge = Math.log((lockSC + 1) / (oppSC + 1));
        const mktDom = 0.6 * moneyEdge + 0.4 * sharpEdge;
        const hasBoth = oppSC > 0 && lockSC > 0;
        const disagreement = hasBoth && Math.sign(moneyEdge) !== Math.sign(sharpEdge) ? 1 : 0;

        const contra1 = (lockMoneyPct >= 80 && counterSharp >= 30) ? 1 : 0;
        const contra2 = (lockSC >= 7 && lockMoneyPct < 65) ? 1 : 0;
        const contradictions = contra1 + contra2;

        const pinnConf = !!(lk?.criteria?.pinnacleConfirms);
        const lineWith = !!(lk?.criteria?.lineMovingWith);
        const plusEV = !!(lk?.criteria?.plusEV);

        const won = res.outcome === 'WIN';
        const flatProfit = won ? 1 : -1;
        const modelProfit = won ? profitFromOdds(odds, units) : -units;

        picks.push({
          date: data.date, sport: data.sport || 'NHL', mktType, regime,
          won, flatProfit, modelProfit,
          lockStars, peakStars, starDelta, lockUnits, units, unitDelta,
          lockOdds, odds, ob: oddsBand(lockOdds),
          lockSC, lockInvested, lockAvgBet, lockMoneyPct, lockWalletPct, lockEvEdge,
          counterSharp, contradictions, qualityProxy,
          oppSC, oppInvested,
          moneyEdge, sharpEdge, mktDom, disagreement,
          pinnConf, lineWith, plusEV,
          clv,
        });
      }
    });
  }

  picks.sort((a, b) => a.date.localeCompare(b.date));
  const regimes = ['NO_MOVE', 'SMALL_MOVE', 'CLEAR_MOVE', 'NEAR_START'];
  const out = [];
  const p = (s) => { out.push(s); console.log(s); };

  p('# Regime Deep Analysis — What Makes Wins vs Losses');
  p(`**Total Completed Picks**: ${picks.length} | **Generated**: ${new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })}\n`);
  p('---\n');

  for (const reg of regimes) {
    const rs = picks.filter(r => r.regime === reg);
    if (rs.length < 3) continue;
    const wins = rs.filter(r => r.won);
    const losses = rs.filter(r => !r.won);

    p(`## ${reg} — ${rs.length} picks (${wins.length}W / ${losses.length}L, ${pct(wins.length, rs.length)} WR)\n`);

    const factors = [
      { name: 'Peak Stars', fn: r => r.peakStars },
      { name: 'Lock Stars', fn: r => r.lockStars },
      { name: 'Star Delta', fn: r => r.starDelta },
      { name: 'Units', fn: r => r.units },
      { name: 'Lock Units', fn: r => r.lockUnits },
      { name: 'Unit Delta', fn: r => r.unitDelta },
      { name: 'Sharp Count', fn: r => r.lockSC },
      { name: 'Total Invested', fn: r => r.lockInvested },
      { name: 'Avg Bet Size', fn: r => r.lockAvgBet },
      { name: 'Money %', fn: r => r.lockMoneyPct },
      { name: 'Wallet %', fn: r => r.lockWalletPct },
      { name: 'Counter Sharp %', fn: r => r.counterSharp },
      { name: 'EV Edge', fn: r => r.lockEvEdge },
      { name: 'Quality Proxy', fn: r => r.qualityProxy },
      { name: 'Money Edge', fn: r => r.moneyEdge },
      { name: 'Sharp Edge', fn: r => r.sharpEdge },
      { name: 'Mkt Dominance', fn: r => r.mktDom },
      { name: 'Opp Sharp Count', fn: r => r.oppSC },
      { name: 'Opp Invested', fn: r => r.oppInvested },
      { name: 'Contradictions', fn: r => r.contradictions },
      { name: 'Disagreement', fn: r => r.disagreement },
    ];

    p('### Factor Profile: Wins vs Losses\n');
    p('| Factor | WIN avg | WIN med | LOSS avg | LOSS med | Delta (avg) | Edge? |');
    p('|---|---|---|---|---|---|---|');
    for (const f of factors) {
      const wVals = wins.map(f.fn);
      const lVals = losses.map(f.fn);
      const wAvg = avg(wVals);
      const lAvg = avg(lVals);
      const wMed = med(wVals);
      const lMed = med(lVals);
      const delta = wAvg - lAvg;
      const edgeFlag = Math.abs(delta) > 0.1 * Math.max(Math.abs(wAvg), Math.abs(lAvg), 1)
        ? (delta > 0 ? 'WIN higher' : 'LOSS higher')
        : '~same';
      p(`| ${f.name} | ${wAvg.toFixed(2)} | ${wMed.toFixed(2)} | ${lAvg.toFixed(2)} | ${lMed.toFixed(2)} | ${sign(delta)} | ${edgeFlag} |`);
    }

    const wCLV = wins.filter(r => r.clv != null).map(r => r.clv);
    const lCLV = losses.filter(r => r.clv != null).map(r => r.clv);
    if (wCLV.length > 0 || lCLV.length > 0) {
      p(`\n**CLV**: WIN avg ${(avg(wCLV) * 100).toFixed(2)}% (${pct(wCLV.filter(c => c > 0).length, wCLV.length)} positive, n=${wCLV.length}) | LOSS avg ${(avg(lCLV) * 100).toFixed(2)}% (${pct(lCLV.filter(c => c > 0).length, lCLV.length)} positive, n=${lCLV.length})`);
    }

    p('\n### Criteria Flags: Win Rate by Flag\n');
    p('| Flag | With Flag | WR | Without Flag | WR |');
    p('|---|---|---|---|---|');
    for (const [name, fn] of [['Pinnacle Confirms', r => r.pinnConf], ['Line Moving With', r => r.lineWith], ['+EV', r => r.plusEV], ['Has Disagreement', r => r.disagreement], ['Has Contradictions', r => r.contradictions > 0]]) {
      const withF = rs.filter(fn);
      const withoutF = rs.filter(r => !fn(r));
      const wWith = withF.filter(r => r.won).length;
      const wWithout = withoutF.filter(r => r.won).length;
      p(`| ${name} | ${withF.length} | ${pct(wWith, withF.length)} | ${withoutF.length} | ${pct(wWithout, withoutF.length)} |`);
    }

    p('\n### By Star Bucket\n');
    p('| Stars | N | W-L | WR | Flat ROI | Model ROI | Avg MoneyPct | Avg SC | Avg QP |');
    p('|---|---|---|---|---|---|---|---|---|');
    for (const sb of [5, 4.5, 4, 3.5, 3, 2.5]) {
      const bucket = rs.filter(r => {
        if (sb === 5) return r.peakStars >= 4.5;
        if (sb === 4.5) return r.peakStars >= 4 && r.peakStars < 4.5;
        if (sb === 4) return r.peakStars >= 3.5 && r.peakStars < 4;
        if (sb === 3.5) return r.peakStars >= 3 && r.peakStars < 3.5;
        if (sb === 3) return r.peakStars >= 2.5 && r.peakStars < 3;
        return r.peakStars < 2.5;
      });
      if (bucket.length === 0) continue;
      const bW = bucket.filter(r => r.won).length;
      const bL = bucket.length - bW;
      const flatROI = ((bucket.reduce((s, r) => s + r.flatProfit, 0) / bucket.length) * 100).toFixed(1);
      const totalU = bucket.reduce((s, r) => s + r.units, 0);
      const modelP = bucket.reduce((s, r) => s + r.modelProfit, 0);
      const modelROI = totalU > 0 ? ((modelP / totalU) * 100).toFixed(1) : '0.0';
      p(`| ${sb}★ | ${bucket.length} | ${bW}-${bL} | ${pct(bW, bucket.length)} | ${flatROI}% | ${modelROI}% | ${avg(bucket.map(r => r.lockMoneyPct)).toFixed(1)} | ${avg(bucket.map(r => r.lockSC)).toFixed(1)} | ${avg(bucket.map(r => r.qualityProxy)).toFixed(2)} |`);
    }

    p('\n### By Sport\n');
    p('| Sport | N | W-L | WR | Flat ROI | Model P&L |');
    p('|---|---|---|---|---|---|');
    const sports = [...new Set(rs.map(r => r.sport))].sort();
    for (const sp of sports) {
      const srs = rs.filter(r => r.sport === sp);
      const sW = srs.filter(r => r.won).length;
      const sL = srs.length - sW;
      const flatROI = ((srs.reduce((s, r) => s + r.flatProfit, 0) / srs.length) * 100).toFixed(1);
      const modelP = srs.reduce((s, r) => s + r.modelProfit, 0);
      p(`| ${sp} | ${srs.length} | ${sW}-${sL} | ${pct(sW, srs.length)} | ${flatROI}% | ${sign(modelP)}u |`);
    }

    p('\n### By Market Type\n');
    p('| Market | N | W-L | WR | Flat ROI | Model P&L |');
    p('|---|---|---|---|---|---|');
    for (const mt of ['ML', 'SPREAD', 'TOTAL']) {
      const mrs = rs.filter(r => r.mktType === mt);
      if (mrs.length === 0) continue;
      const mW = mrs.filter(r => r.won).length;
      const mL = mrs.length - mW;
      const flatROI = ((mrs.reduce((s, r) => s + r.flatProfit, 0) / mrs.length) * 100).toFixed(1);
      const modelP = mrs.reduce((s, r) => s + r.modelProfit, 0);
      p(`| ${mt} | ${mrs.length} | ${mW}-${mL} | ${pct(mW, mrs.length)} | ${flatROI}% | ${sign(modelP)}u |`);
    }

    p('\n### By Odds Band\n');
    p('| Odds Band | N | W-L | WR | Flat ROI | Model ROI |');
    p('|---|---|---|---|---|---|');
    for (const ob of ['HEAVY_FAV', 'SLIGHT_FAV', 'COIN_FLIP', 'SLIGHT_DOG', 'LONG_DOG']) {
      const ors = rs.filter(r => r.ob === ob);
      if (ors.length === 0) continue;
      const oW = ors.filter(r => r.won).length;
      const oL = ors.length - oW;
      const flatROI = ((ors.reduce((s, r) => s + r.flatProfit, 0) / ors.length) * 100).toFixed(1);
      const totalU = ors.reduce((s, r) => s + r.units, 0);
      const modelP = ors.reduce((s, r) => s + r.modelProfit, 0);
      const modelROI = totalU > 0 ? ((modelP / totalU) * 100).toFixed(1) : '0.0';
      p(`| ${ob} | ${ors.length} | ${oW}-${oL} | ${pct(oW, ors.length)} | ${flatROI}% | ${modelROI}% |`);
    }

    p('\n### Lock vs Update Status\n');
    p('| Group | N | W-L | WR | Flat ROI | Model ROI | Avg StarDelta |');
    p('|---|---|---|---|---|---|---|');
    for (const [label, filter] of [['Upgraded', r => r.starDelta > 0], ['Unchanged', r => r.starDelta === 0], ['Downgraded', r => r.starDelta < 0]]) {
      const grp = rs.filter(filter);
      if (grp.length === 0) continue;
      const gW = grp.filter(r => r.won).length;
      const gL = grp.length - gW;
      const flatROI = ((grp.reduce((s, r) => s + r.flatProfit, 0) / grp.length) * 100).toFixed(1);
      const totalU = grp.reduce((s, r) => s + r.units, 0);
      const modelP = grp.reduce((s, r) => s + r.modelProfit, 0);
      const modelROI = totalU > 0 ? ((modelP / totalU) * 100).toFixed(1) : '0.0';
      const avgSD = avg(grp.map(r => r.starDelta)).toFixed(2);
      p(`| ${label} | ${grp.length} | ${gW}-${gL} | ${pct(gW, grp.length)} | ${flatROI}% | ${modelROI}% | ${avgSD} |`);
    }

    // Individual pick log for MOVE regimes (small sample — show every pick)
    if (reg !== 'NO_MOVE' && rs.length <= 40) {
      p('\n### Individual Pick Log\n');
      p('| Date | Sport | Mkt | Result | Peak★ | Lock★ | Delta★ | Units | Odds | SC | Invested | Money% | QP | CLV | OppSC |');
      p('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
      for (const r of rs) {
        const clvStr = r.clv != null ? (r.clv * 100).toFixed(2) + '%' : '—';
        p(`| ${r.date} | ${r.sport} | ${r.mktType} | ${r.won ? 'WIN' : 'LOSS'} | ${r.peakStars} | ${r.lockStars} | ${sign(r.starDelta)} | ${r.units.toFixed(2)} | ${r.lockOdds} | ${r.lockSC} | $${Math.round(r.lockInvested).toLocaleString()} | ${r.lockMoneyPct.toFixed(0)}% | ${r.qualityProxy.toFixed(1)} | ${clvStr} | ${r.oppSC} |`);
      }
    }

    p('\n---\n');
  }

  // ── MOVE vs NO_MOVE Aggregate ─────────────────────────────────────────────
  const movePicks = picks.filter(r => r.regime === 'CLEAR_MOVE' || r.regime === 'NEAR_START');
  const noMovePicks = picks.filter(r => r.regime === 'NO_MOVE');

  if (movePicks.length > 0 && noMovePicks.length > 0) {
    p('## MOVE vs NO_MOVE — Aggregate Factor Comparison\n');
    p('| Factor | MOVE avg | MOVE med | NO_MOVE avg | NO_MOVE med | Delta |');
    p('|---|---|---|---|---|---|');
    const compFactors = [
      { name: 'Peak Stars', fn: r => r.peakStars },
      { name: 'Lock Stars', fn: r => r.lockStars },
      { name: 'Star Delta', fn: r => r.starDelta },
      { name: 'Units', fn: r => r.units },
      { name: 'Sharp Count', fn: r => r.lockSC },
      { name: 'Total Invested', fn: r => r.lockInvested },
      { name: 'Avg Bet Size', fn: r => r.lockAvgBet },
      { name: 'Money %', fn: r => r.lockMoneyPct },
      { name: 'Counter Sharp %', fn: r => r.counterSharp },
      { name: 'EV Edge', fn: r => r.lockEvEdge },
      { name: 'Quality Proxy', fn: r => r.qualityProxy },
      { name: 'Money Edge', fn: r => r.moneyEdge },
      { name: 'Mkt Dominance', fn: r => r.mktDom },
      { name: 'Opp Sharp Count', fn: r => r.oppSC },
      { name: 'Contradictions', fn: r => r.contradictions },
    ];
    for (const f of compFactors) {
      const mV = movePicks.map(f.fn);
      const nV = noMovePicks.map(f.fn);
      p(`| ${f.name} | ${avg(mV).toFixed(2)} | ${med(mV).toFixed(2)} | ${avg(nV).toFixed(2)} | ${med(nV).toFixed(2)} | ${sign(avg(mV) - avg(nV))} |`);
    }

    p('\n### MOVE Wins vs NO_MOVE Wins — What separates them?\n');
    const moveWins = movePicks.filter(r => r.won);
    const noMoveWins = noMovePicks.filter(r => r.won);
    if (moveWins.length > 0 && noMoveWins.length > 0) {
      p('| Factor | MOVE WIN avg | NO_MOVE WIN avg | Delta |');
      p('|---|---|---|---|');
      for (const f of compFactors) {
        const mV = avg(moveWins.map(f.fn));
        const nV = avg(noMoveWins.map(f.fn));
        p(`| ${f.name} | ${mV.toFixed(2)} | ${nV.toFixed(2)} | ${sign(mV - nV)} |`);
      }
    }

    p('\n### MOVE Losses vs NO_MOVE Losses — Are MOVE losses different?\n');
    const moveLosses = movePicks.filter(r => !r.won);
    const noMoveLosses = noMovePicks.filter(r => !r.won);
    if (moveLosses.length > 0 && noMoveLosses.length > 0) {
      p('| Factor | MOVE LOSS avg | NO_MOVE LOSS avg | Delta |');
      p('|---|---|---|---|');
      for (const f of compFactors) {
        const mV = avg(moveLosses.map(f.fn));
        const nV = avg(noMoveLosses.map(f.fn));
        p(`| ${f.name} | ${mV.toFixed(2)} | ${nV.toFixed(2)} | ${sign(mV - nV)} |`);
      }
    }
  }

  p('\nDone.\n');

  writeFileSync(join(__dirname, '../REGIME_DEEP_ANALYSIS.md'), out.join('\n'));
  console.log('\nSaved to REGIME_DEEP_ANALYSIS.md');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
