#!/usr/bin/env node
/**
 * Path D refinement — deepen the both-halves-green candidates from
 * _pathd_edge_discovery.mjs and pick a shippable Path D #1.
 *
 * Focus candidates (from pass 1):
 *   D5  wdAgCount ≥ 3          (leak-free WD stamp)
 *   D8b AGAINST proven-$        (profile read — mild optimism)
 *   D6c odds ≤ -150 chalk       (leak-free odds)
 *   D1b maxForSize ≥ 2.5        (leak-free WD, small N)
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(readFileSync(join(REPO_ROOT, 'serviceAccountKey.json'), 'utf8'))),
  });
}
const db = admin.firestore();

const V12_FROM = '2026-06-01';
const ABC_FROM = '2026-06-26';
const C_NO_CHALK = -150;
const C_MIN_QN = 8, C_MIN_QROI = 10, C_MIN_PN = 5, C_WR_BASE = 50, C_WR_PRIME = 55, C_MIN_FOR = 3;
const RANK_MIN_PICKS = 8;
const COLS = [['sharpFlowPicks', 'ML'], ['sharpFlowSpreads', 'SPREAD'], ['sharpFlowTotals', 'TOTAL']];

function shortOf(w) { return String(w?.walletShort || w?.wallet || '').slice(-6).toLowerCase(); }
function isAgsu(p) { return typeof p === 'string' && p.startsWith('ags-unified'); }
function profitAt(units, odds, won) {
  if (!units) return 0;
  if (!won) return -units;
  return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
}
function oddsCap(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}
function summarize(rows, unitsFn) {
  let w = 0, l = 0, stake = 0, pnl = 0;
  for (const r of rows) {
    const u = typeof unitsFn === 'function' ? unitsFn(r) : unitsFn;
    const capped = oddsCap(u, r.odds);
    if (r.won) w++; else l++;
    stake += capped;
    pnl += profitAt(capped, r.odds, r.won);
  }
  const n = w + l;
  return { n, w, l, wr: n ? +(100 * w / n).toFixed(1) : null, stake: +stake.toFixed(2), pnl: +pnl.toFixed(2), roi: stake > 0 ? +((100 * pnl) / stake).toFixed(1) : null };
}
function halves(rows, u) {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date) || a.docId.localeCompare(b.docId));
  const cut = Math.floor(sorted.length / 2);
  const a = sorted.slice(0, cut), b = sorted.slice(cut);
  const sa = summarize(a, u), sb = summarize(b, u);
  return { mid: sorted[cut]?.date, a: sa, b: sb, both: sa.roi > 0 && sb.roi > 0 };
}
function fmt(m) {
  if (!m?.n) return '—';
  return `N=${m.n} ${m.w}-${m.l} ${m.wr}% PnL=${m.pnl >= 0 ? '+' : ''}${m.pnl}u ROI=${m.roi >= 0 ? '+' : ''}${m.roi}%`;
}

function isRankEligible(profile, sport) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return false;
  const tier = rec.whitelistTier;
  if (tier !== 'CONFIRMED' && tier !== 'FLAT' && tier !== 'WR50') return false;
  return (Number(rec.picks?.n) || 0) >= RANK_MIN_PICKS;
}
function rankSlice(wd, mySide, sport, profiles) {
  let backing = 0, against = 0;
  const seen = new Set();
  for (const w of wd || []) {
    const s = shortOf(w);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    if (!isRankEligible(profiles.get(s), sport)) continue;
    if (w.side === mySide) backing++;
    else if (w.side) against++;
  }
  return { backing, against, qualifies: backing >= 2 && against === 0 };
}
function sharpQ(wd, mySide, profiles, minFor) {
  let forCount = 0, maxQRoi = -Infinity;
  const wrPool = [];
  const seen = new Set();
  for (const w of wd || []) {
    const s = shortOf(w);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    if (w.side !== mySide) continue;
    forCount++;
    const p = profiles.get(s);
    if (!p) continue;
    const q = p.positions || {};
    if ((Number(q.n) || 0) >= C_MIN_QN && Number.isFinite(Number(q.dollarRoi))) maxQRoi = Math.max(maxQRoi, Number(q.dollarRoi));
    const pk = p.picks || {};
    if ((Number(pk.n) || 0) >= C_MIN_PN && Number.isFinite(Number(pk.wr))) wrPool.push(Number(pk.wr));
  }
  const meanPWr = wrPool.length ? wrPool.reduce((a, b) => a + b, 0) / wrPool.length : null;
  const provenDollar = maxQRoi >= C_MIN_QROI;
  const qualifies = provenDollar && meanPWr != null && meanPWr >= C_WR_BASE && forCount >= minFor;
  return { forCount, maxQRoi: Number.isFinite(maxQRoi) ? maxQRoi : null, meanPWr, provenDollar, qualifies, prime: qualifies && meanPWr >= C_WR_PRIME };
}
function agProven(wd, mySide, profiles) {
  let maxQRoi = -Infinity, agCount = 0;
  const seen = new Set();
  for (const w of wd || []) {
    const s = shortOf(w);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    if (!w.side || w.side === mySide) continue;
    agCount++;
    const p = profiles.get(s);
    if (!p) continue;
    const q = p.positions || {};
    if ((Number(q.n) || 0) >= C_MIN_QN && Number.isFinite(Number(q.dollarRoi))) maxQRoi = Math.max(maxQRoi, Number(q.dollarRoi));
  }
  return { agCount, maxAgQRoi: Number.isFinite(maxQRoi) ? maxQRoi : null, agProvenDollar: Number.isFinite(maxQRoi) && maxQRoi >= C_MIN_QROI };
}
function wdFeat(wd, mySide) {
  const forW = [], agW = [];
  const seen = new Set();
  for (const w of wd || []) {
    const s = shortOf(w);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    if (!w.side) continue;
    (w.side === mySide ? forW : agW).push(w);
  }
  const max = (arr, fn) => {
    let m = -Infinity;
    for (const w of arr) { const v = Number(fn(w)); if (Number.isFinite(v)) m = Math.max(m, v); }
    return Number.isFinite(m) ? m : null;
  };
  const avg = (arr, fn) => {
    const xs = arr.map(fn).filter(Number.isFinite);
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  };
  return {
    wdForCount: forW.length,
    wdAgCount: agW.length,
    maxForSize: max(forW, w => w.sizeRatio ?? w.v8_sizeRatio),
    forAvgSize: avg(forW, w => Number(w.sizeRatio ?? w.v8_sizeRatio)),
  };
}

async function main() {
  const profiles = new Map();
  (await db.collection('sharpWalletProfiles').get()).forEach(d => {
    const data = d.data();
    profiles.set(String(d.id).toLowerCase(), data);
    profiles.set(String(data.walletShort || d.id).slice(-6).toLowerCase(), data);
  });

  const rows = [];
  for (const [col, market] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V12_FROM).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      for (const [sideKey, sd] of Object.entries(data.sides || {})) {
        if (sd.superseded) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        if (!isAgsu(sd.promotedBy)) continue;
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        const lock = sd.lock || {}, peak = sd.peak || lock;
        const wd = peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [];
        const odds = Number(peak.odds ?? lock.odds ?? 0) || 0;
        const units = Number(sd.finalUnits ?? 0) || 0;
        const agsV12 = Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null;
        const hcStakeTier = sd.v8_hcStakeTier || null;
        const rank = rankSlice(wd, sideKey, data.sport, profiles);
        const sharpR = sharpQ(wd, sideKey, profiles, C_MIN_FOR);
        const pathCRescue = sharpR.qualifies && !(Number.isFinite(odds) && odds <= C_NO_CHALK);
        const ag$ = agProven(wd, sideKey, profiles);
        const wf = wdFeat(wd, sideKey);
        rows.push({
          docId: doc.id, date: data.date, sport: data.sport, market, sideKey,
          won: res.outcome === 'WIN', odds, units, agsV12, hcStakeTier, scoreTier: sd.v8_agsV12Tier,
          rank, sharpR, pathCRescue, ...ag$, ...wf,
          forCountV12: sd.v8_agsV12ForCount ?? null,
          agCountV12: sd.v8_agsV12AgCount ?? null,
          hcMargin: Number.isFinite(sd.v8_hcMargin) ? sd.v8_hcMargin : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0)),
        });
      }
    }
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));

  const abcPos = rows.filter(r => r.date >= ABC_FROM && r.agsV12 != null && r.agsV12 > 0);
  const mutedAdditive = abcPos.filter(r => {
    if (!(r.hcStakeTier === 'MONITORING' || r.units === 0)) return false;
    if (r.rank.qualifies) return false;
    if (r.pathCRescue) return false;
    return true;
  });

  console.log(`Additive mute pool: ${mutedAdditive.length}`);
  console.log(`Kill @1u: ${fmt(summarize(mutedAdditive, 1))}`);
  console.log(`Path C retune CF: ${fmt(summarize(abcPos.filter(r => (r.hcStakeTier === 'MONITORING' || r.units === 0) && r.pathCRescue && !r.rank.qualifies), r => oddsCap(r.sharpR.prime ? 4 : 3, r.odds)))}`);

  const cands = [
    { name: 'D5_agCount>=3', rule: r => r.wdAgCount >= 3, leak: 'free', notes: 'wdAgCount≥3' },
    { name: 'D5b_agCount>=2', rule: r => r.wdAgCount >= 2, leak: 'free', notes: 'wdAgCount≥2 (broader)' },
    { name: 'D5c_agCount==1', rule: r => r.wdAgCount === 1, leak: 'free', notes: 'wdAgCount==1 control' },
    { name: 'D5d_agCount==0', rule: r => r.wdAgCount === 0, leak: 'free', notes: 'wdAgCount==0 control' },
    { name: 'D8_agProven$', rule: r => r.agProvenDollar, leak: 'mild', notes: 'AGAINST proven-$ ≥10% $ROI' },
    { name: 'D6_chalk', rule: r => r.odds <= C_NO_CHALK, leak: 'free', notes: 'odds≤-150' },
    { name: 'D6b_chalk_-200', rule: r => r.odds <= -200, leak: 'free', notes: 'odds≤-200' },
    { name: 'D6c_chalk_-130', rule: r => r.odds <= -130, leak: 'free', notes: 'odds≤-130' },
    { name: 'D1_maxSize>=2.5', rule: r => r.maxForSize != null && r.maxForSize >= 2.5, leak: 'free', notes: 'maxForSize≥2.5' },
    // combos
    { name: 'C1_ag3_chalk', rule: r => r.wdAgCount >= 3 && r.odds <= C_NO_CHALK, leak: 'free', notes: 'agCount≥3 + chalk' },
    { name: 'C2_ag3_soft', rule: r => r.wdAgCount >= 3 && r.odds > C_NO_CHALK, leak: 'free', notes: 'agCount≥3 + soft (expect worse?)' },
    { name: 'C3_agProven_chalk', rule: r => r.agProvenDollar && r.odds <= C_NO_CHALK, leak: 'mild', notes: 'Ag$ + chalk' },
    { name: 'C4_agProven_ag3', rule: r => r.agProvenDollar && r.wdAgCount >= 3, leak: 'mild', notes: 'Ag$ + agCount≥3' },
    { name: 'C5_ag2_chalk', rule: r => r.wdAgCount >= 2 && r.odds <= C_NO_CHALK, leak: 'free', notes: 'agCount≥2 + chalk' },
    { name: 'C6_ag2_or_chalk', rule: r => r.wdAgCount >= 2 || r.odds <= C_NO_CHALK, leak: 'free', notes: 'agCount≥2 OR chalk' },
    { name: 'C7_ag3_score70', rule: r => r.wdAgCount >= 3 && r.agsV12 >= 0.7, leak: 'free', notes: 'agCount≥3 + score≥0.7' },
    { name: 'C8_ag3_score90', rule: r => r.wdAgCount >= 3 && r.agsV12 >= 0.9, leak: 'free', notes: 'agCount≥3 + score≥0.9' },
    { name: 'C9_chalk_score70', rule: r => r.odds <= C_NO_CHALK && r.agsV12 >= 0.7, leak: 'free', notes: 'chalk + score≥0.7' },
    { name: 'C10_chalk_score90', rule: r => r.odds <= C_NO_CHALK && r.agsV12 >= 0.9, leak: 'free', notes: 'chalk + score≥0.9' },
    { name: 'C11_agProven_score70', rule: r => r.agProvenDollar && r.agsV12 >= 0.7, leak: 'mild', notes: 'Ag$ + score≥0.7' },
    { name: 'C12_ag2_score80', rule: r => r.wdAgCount >= 2 && r.agsV12 >= 0.8, leak: 'free', notes: 'agCount≥2 + score≥0.8' },
    { name: 'C13_v12AgCount_ge2', rule: r => (r.agCountV12 || 0) >= 2, leak: 'free', notes: 'stamped v12 agCount≥2' },
    { name: 'C14_v12AgCount_ge1', rule: r => (r.agCountV12 || 0) >= 1, leak: 'free', notes: 'stamped v12 agCount≥1' },
    { name: 'C15_ag3_MLB', rule: r => r.wdAgCount >= 3 && r.sport === 'MLB', leak: 'free', notes: 'agCount≥3 MLB' },
    { name: 'C16_chalk_MLB', rule: r => r.odds <= C_NO_CHALK && r.sport === 'MLB', leak: 'free', notes: 'chalk MLB' },
    { name: 'C17_ag3_or_chalk', rule: r => r.wdAgCount >= 3 || r.odds <= C_NO_CHALK, leak: 'free', notes: 'agCount≥3 OR chalk (union Path D)' },
    { name: 'C18_agProven_or_chalk', rule: r => r.agProvenDollar || r.odds <= C_NO_CHALK, leak: 'mild', notes: 'Ag$ OR chalk' },
    { name: 'C19_ag2_size25', rule: r => r.wdAgCount >= 2 && r.maxForSize != null && r.maxForSize >= 2.5, leak: 'free', notes: 'ag≥2 + maxSize≥2.5' },
    { name: 'C20_chalk_not_dog', rule: r => r.odds <= C_NO_CHALK && r.odds >= -300, leak: 'free', notes: 'chalk band -150..-300' },
  ];

  const results = [];
  for (const c of cands) {
    const hits = mutedAdditive.filter(c.rule);
    const m1 = summarize(hits, 1);
    const m2 = summarize(hits, 2);
    const h1 = halves(hits, 1);
    const sport = {};
    for (const r of hits) {
      sport[r.sport] = sport[r.sport] || [];
      sport[r.sport].push(r);
    }
    const sportM = Object.fromEntries(Object.entries(sport).map(([k, v]) => [k, summarize(v, 1)]));
    const mkt = {};
    for (const r of hits) {
      const k = `${r.sport}×${r.market}`;
      mkt[k] = mkt[k] || [];
      mkt[k].push(r);
    }
    const mktM = Object.fromEntries(Object.entries(mkt).map(([k, v]) => [k, summarize(v, 1)]));
    results.push({ ...c, m1, m2, h1, sportM, mktM, perDay: +(hits.length / Math.max(1, new Set(abcPos.map(r => r.date)).size)).toFixed(2) });
  }

  results.sort((a, b) => {
    const as = (a.h1.both ? 500 : 0) + (a.m1.roi || -999) + Math.min(a.m1.n, 30) * 0.15;
    const bs = (b.h1.both ? 500 : 0) + (b.m1.roi || -999) + Math.min(b.m1.n, 30) * 0.15;
    return bs - as;
  });

  console.log('\n═══ REFINED CANDIDATES ═══\n');
  for (const r of results) {
    const flag = r.h1.both ? '🟢' : (r.h1.a.roi > 0 || r.h1.b.roi > 0 ? '🟡' : '🔴');
    console.log(`${flag} ${r.name} [${r.leak}] ${r.notes}`);
    console.log(`  @1u ${fmt(r.m1)}  @2u ROI=${r.m2.roi}%`);
    if (r.m1.n >= 5) console.log(`  halves: A ${fmt(r.h1.a)} | B ${fmt(r.h1.b)} mid=${r.h1.mid}`);
    if (r.m1.n >= 5) console.log(`  sports: ${Object.entries(r.sportM).map(([k, v]) => `${k}:${v.n}/${v.roi}%`).join(' ')}`);
    console.log('');
  }

  // Walk-forward stability: rolling calendar weeks for top leak-free both-green
  const top = results.filter(r => r.h1.both && r.leak === 'free' && r.m1.n >= 10);
  console.log('\n═══ TOP LEAK-FREE BOTH-GREEN (N≥10) ═══');
  for (const t of top) {
    console.log(`→ ${t.name}: ${fmt(t.m1)} halves both · ${t.perDay}/day`);
  }

  // Date-half by calendar midpoint (not pick-count) for robustness
  console.log('\n═══ CALENDAR MIDPOINT SPLIT (abc era) ═══');
  const dates = [...new Set(mutedAdditive.map(r => r.date))].sort();
  const calMid = dates[Math.floor(dates.length / 2)];
  for (const name of ['D5_agCount>=3', 'D6_chalk', 'C17_ag3_or_chalk', 'C9_chalk_score70', 'C5_ag2_chalk', 'D8_agProven$']) {
    const c = cands.find(x => x.name === name);
    if (!c) continue;
    const hits = mutedAdditive.filter(c.rule);
    const a = hits.filter(r => r.date < calMid);
    const b = hits.filter(r => r.date >= calMid);
    const sa = summarize(a, 1), sb = summarize(b, 1);
    console.log(`${name} calMid=${calMid}: A ${fmt(sa)} | B ${fmt(sb)} | both=${sa.roi > 0 && sb.roi > 0}`);
  }

  // Recommended Path D #1 detail dump
  const rec = mutedAdditive.filter(r => r.wdAgCount >= 3);
  console.log('\n═══ Path D #1 DETAIL: wdAgCount≥3 ═══');
  console.log(fmt(summarize(rec, 1)));
  console.log('@2u', fmt(summarize(rec, 2)));
  for (const r of rec.sort((a, b) => a.date.localeCompare(b.date))) {
    console.log(`  ${r.date} ${r.sport} ${r.market} ${r.sideKey} odds=${r.odds} score=${r.agsV12?.toFixed(3)} ag=${r.wdAgCount} ${r.won ? 'W' : 'L'} tier=${r.hcStakeTier}`);
  }

  // Alternate #1: chalk MONITORING
  const chalk = mutedAdditive.filter(r => r.odds <= C_NO_CHALK);
  console.log('\n═══ Alt Path D: chalk ≤-150 DETAIL ═══');
  console.log(fmt(summarize(chalk, 1)));
  for (const r of chalk.sort((a, b) => a.date.localeCompare(b.date))) {
    console.log(`  ${r.date} ${r.sport} ${r.market} ${r.sideKey} odds=${r.odds} score=${r.agsV12?.toFixed(3)} ag=${r.wdAgCount} ${r.won ? 'W' : 'L'}`);
  }

  // Union volume + overlap
  const union = mutedAdditive.filter(r => r.wdAgCount >= 3 || r.odds <= C_NO_CHALK);
  const inter = mutedAdditive.filter(r => r.wdAgCount >= 3 && r.odds <= C_NO_CHALK);
  console.log('\nUnion ag3|chalk:', fmt(summarize(union, 1)), 'halves', halves(union, 1));
  console.log('Intersect:', fmt(summarize(inter, 1)));

  // Compare vs Path C live stamped
  const pathC = abcPos.filter(r => ['SHARP', 'SHARP-PRIME', 'TOP+', 'MINI-'].includes(r.hcStakeTier) && r.units > 0);
  console.log('\nPath C stamped live:', fmt(summarize(pathC, r => r.units)));

  writeFileSync(join(__dirname, '_pathd_refine_results.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    poolN: mutedAdditive.length,
    kill1u: summarize(mutedAdditive, 1),
    results,
    pathD1: { rule: 'wdAgCount>=3', m1: summarize(rec, 1), m2: summarize(rec, 2), halves: halves(rec, 1), picks: rec.map(r => ({ date: r.date, sport: r.sport, market: r.market, side: r.sideKey, odds: r.odds, score: r.agsV12, won: r.won })) },
    pathD_alt_chalk: { rule: 'odds<=-150', m1: summarize(chalk, 1), halves: halves(chalk, 1) },
    union: summarize(union, 1),
  }, null, 2));
  console.log('\nWrote scripts/_pathd_refine_results.json');
}

main().catch(e => { console.error(e); process.exit(1); });
