#!/usr/bin/env node
/**
 * Path D edge discovery — find additive volume the v12abc book is missing.
 *
 * Pool focus: MONITORING / 0u HC-muted sides with v12 score > 0 that are NOT
 * rescued by Path B (RANK 2-for-0) or retuned Path C (for≥3, odds>-150, $ROI≥10,
 * mean WR≥50/55). Also tests a few overlays that cut/upsize A/B incorrectly.
 *
 * Leak-free preference: stamped side fields + walletDetails frozen at scoring.
 * Profile reads (RANK eligibility / $ROI / picks.wr) use CURRENT profiles —
 * same mild optimism caveat as §5a reconstruction. Flagged in output.
 *
 * Usage: node scripts/_pathd_edge_discovery.mjs
 * Writes: scripts/_pathd_results.json
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

if (!admin.apps.length) {
  const sak = join(REPO_ROOT, 'serviceAccountKey.json');
  if (!existsSync(sak)) throw new Error('serviceAccountKey.json missing');
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(sak, 'utf8'))) });
}
const db = admin.firestore();

const V12_FROM = '2026-06-01';
const ABC_FROM = '2026-06-26'; // Path B live ~06-21; C live 06-26
const RANK_MIN_PICKS = 8;
const HC_RATIO = 1.5;
const HC_MINI_FLOOR = 1.0;

// Path C retune (2026-07-12) — comparison baseline, not production rewrite here
const C_MIN_QN = 8, C_MIN_QROI = 10, C_MIN_PN = 5, C_WR_BASE = 50, C_WR_PRIME = 55;
const C_MIN_FOR = 3, C_NO_CHALK = -150;

const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function americanToImplied(o) {
  const v = Number(o);
  if (!Number.isFinite(v) || v === 0) return null;
  return v < 0 ? Math.abs(v) / (Math.abs(v) + 100) : 100 / (v + 100);
}
function profitAt(units, odds, won) {
  if (!units) return 0;
  if (!won) return -units;
  const o = Number(odds) || 0;
  return o < 0 ? units * (100 / Math.abs(o)) : units * (o / 100);
}
function oddsCap(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}
function shortOf(w) {
  return String(w?.walletShort || w?.wallet || '').slice(-6).toLowerCase();
}
function isAgsu(promotedBy) {
  return typeof promotedBy === 'string' && promotedBy.startsWith('ags-unified');
}

function isRankEligible(profile, sport) {
  const rec = profile?.bySport?.[sport];
  if (!rec) return false;
  const tier = rec.whitelistTier;
  if (tier !== 'CONFIRMED' && tier !== 'FLAT' && tier !== 'WR50') return false;
  return (Number(rec.picks?.n) || 0) >= RANK_MIN_PICKS;
}

function computeRankSlice(wd, mySide, sport, profiles) {
  let backing = 0, against = 0;
  const seen = new Set();
  for (const w of wd || []) {
    const short = shortOf(w);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    const profile = profiles.get(short);
    if (!isRankEligible(profile, sport)) continue;
    if (w.side === mySide) backing++;
    else if (w.side) against++;
  }
  return { backing, against, qualifies: backing >= 2 && against === 0 };
}

function computeSharpQuality(wd, mySide, profiles, { minFor = C_MIN_FOR } = {}) {
  let forCount = 0, maxQRoi = -Infinity;
  const wrPool = [];
  const seen = new Set();
  for (const w of wd || []) {
    const short = shortOf(w);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    if (w.side !== mySide) continue;
    forCount++;
    const profile = profiles.get(short);
    if (!profile) continue;
    const q = profile.positions || {};
    if ((Number(q.n) || 0) >= C_MIN_QN && Number.isFinite(Number(q.dollarRoi))) {
      maxQRoi = Math.max(maxQRoi, Number(q.dollarRoi));
    }
    const pk = profile.picks || {};
    if ((Number(pk.n) || 0) >= C_MIN_PN && Number.isFinite(Number(pk.wr))) {
      wrPool.push(Number(pk.wr));
    }
  }
  const meanPWr = wrPool.length ? wrPool.reduce((s, x) => s + x, 0) / wrPool.length : null;
  const provenDollar = maxQRoi >= C_MIN_QROI;
  const qualifies = provenDollar && meanPWr != null && meanPWr >= C_WR_BASE && forCount >= minFor;
  const prime = qualifies && meanPWr >= C_WR_PRIME;
  return {
    forCount,
    maxQRoi: Number.isFinite(maxQRoi) ? maxQRoi : null,
    meanPWr,
    provenDollar,
    qualifies,
    prime,
  };
}

/** Against-side proven-$ (fade / anti-signal). */
function againstProvenDollar(wd, mySide, profiles) {
  let maxQRoi = -Infinity, agCount = 0;
  const seen = new Set();
  for (const w of wd || []) {
    const short = shortOf(w);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    if (!w.side || w.side === mySide) continue;
    agCount++;
    const profile = profiles.get(short);
    if (!profile) continue;
    const q = profile.positions || {};
    if ((Number(q.n) || 0) >= C_MIN_QN && Number.isFinite(Number(q.dollarRoi))) {
      maxQRoi = Math.max(maxQRoi, Number(q.dollarRoi));
    }
  }
  return {
    agCount,
    maxAgQRoi: Number.isFinite(maxQRoi) ? maxQRoi : null,
    agProvenDollar: Number.isFinite(maxQRoi) && maxQRoi >= C_MIN_QROI,
  };
}

function wdFeatures(wd, mySide) {
  const forW = [], agW = [];
  const seen = new Set();
  for (const w of wd || []) {
    const short = shortOf(w);
    if (!short || seen.has(short)) continue;
    seen.add(short);
    if (!w.side) continue;
    (w.side === mySide ? forW : agW).push(w);
  }
  const avg = (arr, fn) => {
    const xs = arr.map(fn).filter(Number.isFinite);
    return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
  };
  const sum = (arr, fn) => arr.reduce((s, w) => s + (Number(fn(w)) || 0), 0);
  const max = (arr, fn) => {
    let m = -Infinity;
    for (const w of arr) {
      const v = Number(fn(w));
      if (Number.isFinite(v)) m = Math.max(m, v);
    }
    return Number.isFinite(m) ? m : null;
  };
  const forAvgSize = avg(forW, w => Number(w.sizeRatio ?? w.v8_sizeRatio));
  const agAvgSize = avg(agW, w => Number(w.sizeRatio ?? w.v8_sizeRatio));
  const forContrib = sum(forW, w => w.contribution ?? w.v8_walletContribution);
  const agContrib = sum(agW, w => w.contribution ?? w.v8_walletContribution);
  const maxForContrib = max(forW, w => w.contribution ?? w.v8_walletContribution);
  const totalContrib = forContrib + agContrib;
  const maxShare = totalContrib > 0 && maxForContrib != null ? maxForContrib / totalContrib : null;
  const maxForSize = max(forW, w => w.sizeRatio ?? w.v8_sizeRatio);
  return {
    wdForCount: forW.length,
    wdAgCount: agW.length,
    forAvgSize,
    agAvgSize,
    sizeMargin: forAvgSize != null && agAvgSize != null ? forAvgSize - agAvgSize : null,
    forContrib,
    agContrib,
    contribMargin: forContrib - agContrib,
    maxForContrib,
    maxShare,
    maxForSize,
  };
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
  return {
    n, w, l,
    wr: n ? (100 * w) / n : null,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    roi: stake > 0 ? +((100 * pnl) / stake).toFixed(1) : null,
  };
}

function halfSplit(rows) {
  if (!rows.length) return { mid: null, a: [], b: [] };
  const dates = [...new Set(rows.map(r => r.date))].sort();
  const mid = dates[Math.floor(dates.length / 2)];
  // first half: date < mid; second: date >= mid (equal date volume-ish by calendar)
  // Better: split by pick count chronological
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date) || a.docId.localeCompare(b.docId));
  const cut = Math.floor(sorted.length / 2);
  return { mid: sorted[cut]?.date || mid, a: sorted.slice(0, cut), b: sorted.slice(cut) };
}

function bothHalvesGreen(rows, units) {
  const { a, b, mid } = halfSplit(rows);
  const sa = summarize(a, units);
  const sb = summarize(b, units);
  return {
    mid,
    halfA: sa,
    halfB: sb,
    bothGreen: sa.roi != null && sb.roi != null && sa.roi > 0 && sb.roi > 0,
    eitherGreen: (sa.roi != null && sa.roi > 0) || (sb.roi != null && sb.roi > 0),
  };
}

function evalHyp(name, rule, pool, notes = '') {
  const hits = pool.filter(rule);
  const m1 = summarize(hits, 1);
  const m2 = summarize(hits, 2);
  const h1 = bothHalvesGreen(hits, 1);
  const h2 = bothHalvesGreen(hits, 2);
  return {
    name,
    notes,
    n: hits.length,
    m1u: m1,
    m2u: m2,
    halves1u: h1,
    halves2u: h2,
    bothGreen1u: h1.bothGreen,
    bothGreen2u: h2.bothGreen,
    sportBreak: sportBreak(hits, 1),
    marketBreak: marketBreak(hits, 1),
  };
}

function sportBreak(rows, u) {
  const by = {};
  for (const r of rows) {
    by[r.sport] = by[r.sport] || [];
    by[r.sport].push(r);
  }
  const out = {};
  for (const [k, arr] of Object.entries(by)) out[k] = summarize(arr, u);
  return out;
}
function marketBreak(rows, u) {
  const by = {};
  for (const r of rows) {
    const k = `${r.sport}×${r.market}`;
    by[k] = by[k] || [];
    by[k].push(r);
  }
  const out = {};
  for (const [k, arr] of Object.entries(by)) out[k] = summarize(arr, u);
  return out;
}

async function loadProfiles() {
  const m = new Map();
  const snap = await db.collection('sharpWalletProfiles').get();
  for (const d of snap.docs) {
    const data = d.data();
    m.set(String(d.id).toLowerCase(), data);
    const short = String(data.walletShort || d.id).slice(-6).toLowerCase();
    if (short) m.set(short, data);
  }
  return m;
}

async function loadRows(profiles) {
  const rows = [];
  for (const [col, market] of COLS) {
    const snap = await db.collection(col).where('date', '>=', V12_FROM).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data.sides) continue;
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        if ((sd.status || data.status) !== 'COMPLETED') continue;
        if (!isAgsu(sd.promotedBy)) continue;
        const res = sd.result || data.result || {};
        const oc = res.outcome;
        if (oc !== 'WIN' && oc !== 'LOSS') continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const wd = peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [];
        const odds = Number(peak.odds ?? lock.odds ?? 0) || 0;
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? 0) || 0;
        const agsV12 = Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null;
        const hcStakeTier = sd.v8_hcStakeTier || null;
        const scoreTier = sd.v8_agsV12Tier || sd.v8_agsTier || null;
        const hcMargin = Number.isFinite(sd.v8_hcMargin)
          ? sd.v8_hcMargin
          : ((sd.v8_hcConfFor || 0) - (sd.v8_hcConfAg || 0));
        const miniHcMargin = Number.isFinite(sd.v8_miniHcMargin)
          ? sd.v8_miniHcMargin
          : ((sd.v8_miniHcConfFor || 0) - (sd.v8_miniHcConfAg || 0));

        const lockOdds = Number(lock.odds || odds) || 0;
        const closingOdds = sd.closingOdds != null ? Number(sd.closingOdds) : null;
        const lockPinnProb = americanToImplied(lock.pinnacleOdds || lockOdds);
        const closeProb = americanToImplied(closingOdds);
        const clv = (lockPinnProb != null && closeProb != null) ? closeProb - lockPinnProb : null;

        const feats = wdFeatures(wd, sideKey);
        const rank = computeRankSlice(wd, sideKey, data.sport, profiles);
        const sharpLegacy = computeSharpQuality(wd, sideKey, profiles, { minFor: 2 });
        const sharpRetune = computeSharpQuality(wd, sideKey, profiles, { minFor: C_MIN_FOR });
        const ag$ = againstProvenDollar(wd, sideKey, profiles);

        // Path C retune rescue would fire on muted + sharpRetune + soft odds
        const pathCRescue = sharpRetune.qualifies && !isSharpChalk(odds);
        const pathCRescueLegacy = sharpLegacy.qualifies; // pre-retune for≥2, chalk ok

        rows.push({
          docId: doc.id,
          date: data.date,
          sport: data.sport || 'UNK',
          market,
          sideKey,
          team: sd.team || sideKey,
          won: oc === 'WIN',
          odds,
          units,
          profit: Number.isFinite(res.profit) ? res.profit : profitAt(units, odds, oc === 'WIN'),
          agsV12,
          scoreTier,
          hcStakeTier,
          hcMargin,
          miniHcMargin,
          forMean: Number.isFinite(sd.v8_agsV12ForMean) ? sd.v8_agsV12ForMean : null,
          agMean: Number.isFinite(sd.v8_agsV12AgMean) ? sd.v8_agsV12AgMean : null,
          forCountV12: Number.isFinite(sd.v8_agsV12ForCount) ? sd.v8_agsV12ForCount : null,
          agCountV12: Number.isFinite(sd.v8_agsV12AgCount) ? sd.v8_agsV12AgCount : null,
          provenFor: sd.v8_agsProvenForCount ?? null,
          provenAg: sd.v8_agsProvenAgCount ?? null,
          clv,
          lockPinnProb,
          closeProb,
          ...feats,
          rank,
          sharpLegacy,
          sharpRetune,
          ...ag$,
          pathCRescue,
          pathCRescueLegacy,
          isUnderdog: odds > 0,
          isSoft: odds > C_NO_CHALK, // > -150
          isChalk: odds <= C_NO_CHALK,
        });
      }
    }
  }
  rows.sort((a, b) => a.date.localeCompare(b.date) || a.docId.localeCompare(b.docId));
  return rows;
}

function isSharpChalk(odds) {
  return Number.isFinite(odds) && odds <= C_NO_CHALK;
}

function fmt(m) {
  if (!m || !m.n) return '—';
  return `N=${m.n} ${m.w}-${m.l} WR=${m.wr?.toFixed(1)}% stake=${m.stake}u PnL=${m.pnl >= 0 ? '+' : ''}${m.pnl}u ROI=${m.roi >= 0 ? '+' : ''}${m.roi}%`;
}

async function main() {
  console.log('═══ Path D edge discovery ═══\n');
  const profiles = await loadProfiles();
  console.log(`Loaded ${profiles.size} profile keys`);
  const rows = await loadRows(profiles);
  console.log(`Loaded ${rows.length} graded AGS-U sides since ${V12_FROM}`);

  const v12 = rows.filter(r => r.agsV12 != null);
  const v12Pos = v12.filter(r => r.agsV12 > 0);
  const abc = rows.filter(r => r.date >= ABC_FROM);
  const abcPos = abc.filter(r => r.agsV12 != null && r.agsV12 > 0);

  // Staked book tiers
  const STAKED = new Set(['SUPER', 'TOP', 'TOP+', 'MINI', 'MINI-', 'CONFIRMED', 'RANK', 'SHARP', 'SHARP-PRIME']);
  const mon = abcPos.filter(r =>
    r.hcStakeTier === 'MONITORING'
    || (r.units === 0 && (!r.hcStakeTier || r.hcStakeTier === 'MONITORING'))
  );
  // Additive muted pool: MONITORING / 0u, score>0, NOT Path B RANK, NOT retuned Path C
  const mutedAdditive = abcPos.filter(r => {
    if (r.units > 0 && STAKED.has(r.hcStakeTier) && r.hcStakeTier !== 'MONITORING') return false;
    // prefer stamped MONITORING or units==0
    if (!(r.hcStakeTier === 'MONITORING' || r.units === 0)) return false;
    if (r.rank.qualifies) return false;           // Path B would take
    if (r.pathCRescue) return false;             // retuned Path C would take
    return true;
  });

  // Broader mute pool (ignore C/B exclusion for exploratory slices that redefine rescue)
  const mutedAll = abcPos.filter(r => r.hcStakeTier === 'MONITORING' || r.units === 0);

  console.log(`\nUniverse:`);
  console.log(`  v12 graded: ${v12.length}  score>0: ${v12Pos.length}`);
  console.log(`  abc (≥${ABC_FROM}) score>0: ${abcPos.length}`);
  console.log(`  MONITORING/0u stamped: ${mon.length}`);
  console.log(`  Additive mute pool (not B/C): ${mutedAdditive.length}`);
  console.log(`  All mute (incl B/C-eligible): ${mutedAll.length}`);

  // Path C live (stamped) vs retuned counterfactual on mute
  const pathCStamped = abc.filter(r => ['SHARP', 'SHARP-PRIME', 'TOP+', 'MINI-'].includes(r.hcStakeTier) && r.units > 0);
  const pathCRetuneRescues = mutedAll.filter(r => r.pathCRescue && !r.rank.qualifies);
  console.log(`\nPath C stamped (all levers): ${fmt(summarize(pathCStamped, r => r.units))}`);
  console.log(`Path C retune rescues (counterfactual @3/4u): ${fmt(summarize(pathCRetuneRescues, r => oddsCap(r.sharpRetune.prime ? 4 : 3, r.odds)))}`);
  console.log(`Kill (0u) on additive mute: PnL=0 by definition; flat-1u CF: ${fmt(summarize(mutedAdditive, 1))}`);

  // ── Hypotheses ──────────────────────────────────────────────────────────
  const H = [];

  // D1: High FOR sizeRatio on muted (conviction extreme)
  H.push(evalHyp(
    'D1_high_forAvgSize',
    r => r.forAvgSize != null && r.forAvgSize >= 2.0,
    mutedAdditive,
    'MONITORING & forAvgSize≥2.0 (FOR wallets sizing ≥2× their avg)',
  ));
  H.push(evalHyp(
    'D1b_maxForSize_ge_2.5',
    r => r.maxForSize != null && r.maxForSize >= 2.5,
    mutedAdditive,
    'MONITORING & max FOR sizeRatio≥2.5',
  ));

  // D2: RANK near-misses
  H.push(evalHyp(
    'D2_1for0_rank',
    r => r.rank.backing === 1 && r.rank.against === 0,
    mutedAdditive,
    '1-for-0 RANK-eligible (near-miss of 2-for-0)',
  ));
  H.push(evalHyp(
    'D2b_1for0_plus_highScore',
    r => r.rank.backing === 1 && r.rank.against === 0 && r.agsV12 >= 0.8,
    mutedAdditive,
    '1-for-0 + agsV12≥0.8',
  ));
  H.push(evalHyp(
    'D2c_3for1_rank',
    r => r.rank.backing >= 3 && r.rank.against === 1,
    mutedAdditive,
    '3-for-1 RANK-eligible (dissent=1)',
  ));
  H.push(evalHyp(
    'D2d_2for1_rank',
    r => r.rank.backing === 2 && r.rank.against === 1,
    mutedAdditive,
    '2-for-1 RANK-eligible',
  ));

  // D3: Positive CLV / lockProb edge
  H.push(evalHyp(
    'D3_pos_clv',
    r => r.clv != null && r.clv > 0,
    mutedAdditive,
    'Positive CLV (closeProb − lockPinnProb > 0) — NOTE: CLV is post-hoc, leaky for live stake',
  ));
  H.push(evalHyp(
    'D3b_lockProb_underdogish',
    r => r.lockPinnProb != null && r.lockPinnProb < 0.48 && r.odds >= -120,
    mutedAdditive,
    'lockPinnProb<0.48 & odds≥-120 (point-in-time underdogish)',
  ));

  // D4: sport×market
  H.push(evalHyp(
    'D4_MLB_TOTAL',
    r => r.sport === 'MLB' && r.market === 'TOTAL',
    mutedAdditive,
    'MLB totals in mute pool',
  ));
  H.push(evalHyp(
    'D4b_SOC_ML',
    r => r.sport === 'SOC' && r.market === 'ML',
    mutedAdditive,
    'Soccer ML in mute pool',
  ));
  H.push(evalHyp(
    'D4c_MLB_ML_underdog',
    r => r.sport === 'MLB' && r.market === 'ML' && r.odds > 0,
    mutedAdditive,
    'MLB ML underdogs in mute pool',
  ));

  // D5: wd agCount / contribMargin (report §17 flags)
  H.push(evalHyp(
    'D5_wdAgCount_ge3',
    r => r.wdAgCount >= 3,
    mutedAdditive,
    'wd agCount≥3 (report: high agCount correlated with +PnL)',
  ));
  H.push(evalHyp(
    'D5b_low_contribMargin',
    r => r.contribMargin != null && r.contribMargin <= 0,
    mutedAdditive,
    'contribMargin≤0 (inverse signal from §17 — low margin better)',
  ));
  H.push(evalHyp(
    'D5c_neg_contrib_and_pos_score',
    r => r.contribMargin != null && r.contribMargin < 0 && r.agsV12 >= 0.5,
    mutedAdditive,
    'contribMargin<0 + score≥0.5',
  ));

  // D6: underdog vs chalk on MUTED (not Path C)
  H.push(evalHyp(
    'D6_underdog',
    r => r.odds > 0,
    mutedAdditive,
    'American odds > 0 (underdog)',
  ));
  H.push(evalHyp(
    'D6b_soft_no_chalk',
    r => r.odds > C_NO_CHALK,
    mutedAdditive,
    'odds > -150 (soft / no heavy chalk)',
  ));
  H.push(evalHyp(
    'D6c_chalk_fade_skip',
    r => r.odds <= C_NO_CHALK,
    mutedAdditive,
    'odds ≤ -150 (heavy chalk) — expect bad; confirm',
  ));

  // D7: HC=0 but high agsV12
  H.push(evalHyp(
    'D7_highScore_hc0',
    r => (r.hcMargin || 0) === 0 && (r.miniHcMargin || 0) === 0 && r.agsV12 >= 0.9,
    mutedAdditive,
    'HC margin 0 & miniHC 0 & agsV12≥0.9',
  ));
  H.push(evalHyp(
    'D7b_elite_score_monitoring',
    r => r.agsV12 >= 0.95 && (r.scoreTier === 'ELITE' || r.agsV12 >= 0.95),
    mutedAdditive,
    'agsV12≥0.95 on MONITORING',
  ));
  H.push(evalHyp(
    'D7c_score_ge_0.7_soft',
    r => r.agsV12 >= 0.7 && r.odds > C_NO_CHALK,
    mutedAdditive,
    'agsV12≥0.7 & odds>-150',
  ));

  // D8: proven $ on AGAINST as fade-of-against (= bet FOR when against lacks $ / or skip when against has $)
  H.push(evalHyp(
    'D8_no_ag_provenDollar',
    r => !r.agProvenDollar,
    mutedAdditive,
    'AGAINST has no proven-$ backer',
  ));
  H.push(evalHyp(
    'D8b_ag_provenDollar_present',
    r => r.agProvenDollar,
    mutedAdditive,
    'AGAINST HAS proven-$ (expect worse — anti-signal check)',
  ));
  H.push(evalHyp(
    'D8c_for_proven_ag_none_for2',
    r => r.sharpLegacy.provenDollar && !r.agProvenDollar && r.sharpLegacy.forCount >= 2
      && r.sharpLegacy.meanPWr != null && r.sharpLegacy.meanPWr >= 50
      && !r.pathCRescue, // for=2 only (for≥3 already C)
    mutedAdditive,
    'for=2 proven-$ + WR≥50, no AGAINST proven-$, not Path C (for≥3)',
  ));

  // D9: concentration / dual-side
  H.push(evalHyp(
    'D9_low_maxShare',
    r => r.maxShare != null && r.maxShare < 0.45,
    mutedAdditive,
    'maxShare<0.45 (diversified FOR money)',
  ));
  H.push(evalHyp(
    'D9b_high_maxShare',
    r => r.maxShare != null && r.maxShare >= 0.70,
    mutedAdditive,
    'maxShare≥0.70 (concentrated single-wallet)',
  ));
  H.push(evalHyp(
    'D9c_wdFor_ge3_ag0',
    r => r.wdForCount >= 3 && r.wdAgCount === 0,
    mutedAdditive,
    '≥3 any-wallet FOR, 0 AGAINST (not necessarily RANK-eligible)',
  ));

  // D10: combo candidates from exploratory logic
  H.push(evalHyp(
    'D10_soft_highScore_noAg$',
    r => r.odds > C_NO_CHALK && r.agsV12 >= 0.8 && !r.agProvenDollar,
    mutedAdditive,
    'odds>-150 + score≥0.8 + no AGAINST proven-$',
  ));
  H.push(evalHyp(
    'D10b_1for0_soft_highScore',
    r => r.rank.backing === 1 && r.rank.against === 0 && r.odds > C_NO_CHALK && r.agsV12 >= 0.7,
    mutedAdditive,
    '1-for-0 RANK + soft odds + score≥0.7',
  ));
  H.push(evalHyp(
    'D10c_MLB_TOTAL_soft',
    r => r.sport === 'MLB' && r.market === 'TOTAL' && r.odds > C_NO_CHALK,
    mutedAdditive,
    'MLB TOTAL odds>-150',
  ));
  H.push(evalHyp(
    'D10d_for2_sharp_soft_noAg$',
    r => r.sharpLegacy.forCount === 2
      && r.sharpLegacy.provenDollar
      && r.sharpLegacy.meanPWr != null && r.sharpLegacy.meanPWr >= 50
      && r.odds > C_NO_CHALK
      && !r.agProvenDollar
      && !r.pathCRescue,
    mutedAdditive,
    'for=2 Path-C-near-miss: proven$+WR≥50+soft+no Ag$ (retune left these on floor)',
  ));
  H.push(evalHyp(
    'D10e_wdAg0_forAvgSize_ge1.5',
    r => r.wdAgCount === 0 && r.forAvgSize != null && r.forAvgSize >= 1.5,
    mutedAdditive,
    '0 AGAINST wallets + forAvgSize≥1.5',
  ));
  H.push(evalHyp(
    'D10f_low_contrib_soft',
    r => r.contribMargin != null && r.contribMargin <= 10 && r.odds > C_NO_CHALK && r.agsV12 >= 0.6,
    mutedAdditive,
    'contribMargin≤10 + soft + score≥0.6',
  ));

  // Overlay tests (on already-staked A/B) — cut/upsize
  const pathA = abc.filter(r => ['SUPER', 'TOP', 'MINI', 'CONFIRMED'].includes(r.hcStakeTier) && r.units > 0);
  const pathB = abc.filter(r => r.hcStakeTier === 'RANK' && r.units > 0);
  const mini = abc.filter(r => r.hcStakeTier === 'MINI' && r.units > 0);
  const top = abc.filter(r => (r.hcStakeTier === 'TOP' || r.hcStakeTier === 'TOP+') && r.units > 0);

  const overlayResults = [];
  // Cut MINI when chalk
  {
    const keep = mini.filter(r => r.odds > C_NO_CHALK);
    const cut = mini.filter(r => r.odds <= C_NO_CHALK);
    overlayResults.push({
      name: 'O1_MINI_cut_chalk',
      notes: 'Cut Path A MINI when odds≤-150',
      full: summarize(mini, r => r.units),
      keep: summarize(keep, r => r.units),
      cutCF0: summarize(cut, 0),
      bothGreenKeep: bothHalvesGreen(keep, r => r.units),
    });
  }
  // Cut RANK chalk
  {
    const keep = pathB.filter(r => r.odds > C_NO_CHALK);
    overlayResults.push({
      name: 'O2_RANK_cut_chalk',
      notes: 'Cut Path B RANK when odds≤-150',
      full: summarize(pathB, r => r.units),
      keep: summarize(keep, r => r.units),
      bothGreenKeep: bothHalvesGreen(keep, r => r.units),
    });
  }
  // Upsize CONFIRMED when soft high score
  {
    const conf = abc.filter(r => r.hcStakeTier === 'CONFIRMED' && r.units > 0);
    const boost = conf.filter(r => r.agsV12 >= 0.9 && r.odds > C_NO_CHALK);
    overlayResults.push({
      name: 'O3_CONFIRMED_upsize',
      notes: 'CONFIRMED → 2u when score≥0.9 & soft',
      full: summarize(conf, r => r.units),
      boostN: boost.length,
      boostAt2: summarize(boost, 2),
      bothGreen: bothHalvesGreen(boost, 2),
    });
  }

  // Rank hypotheses
  const ranked = [...H].sort((a, b) => {
    // Prefer both-halves-green, then ROI@1u, then N
    const ag = (a.bothGreen1u ? 1000 : 0) + (a.m1u.roi || -999) + Math.min(a.n, 40) * 0.05;
    const bg = (b.bothGreen1u ? 1000 : 0) + (b.m1u.roi || -999) + Math.min(b.n, 40) * 0.05;
    return bg - ag;
  });

  console.log('\n═══ HYPOTHESIS RESULTS (additive mute pool) ═══\n');
  for (const h of ranked) {
    const flag = h.bothGreen1u ? '🟢 BOTH HALVES' : (h.halves1u.eitherGreen ? '🟡 ONE HALF' : '🔴 NO HALF');
    console.log(`${flag}  ${h.name}`);
    console.log(`  ${h.notes}`);
    console.log(`  @1u: ${fmt(h.m1u)}`);
    console.log(`  @2u: ${fmt(h.m2u)}`);
    if (h.n >= 5) {
      console.log(`  halfA: ${fmt(h.halves1u.halfA)} | halfB: ${fmt(h.halves1u.halfB)} (mid≈${h.halves1u.mid})`);
    }
    console.log('');
  }

  console.log('\n═══ OVERLAY TESTS ═══\n');
  for (const o of overlayResults) {
    console.log(o.name, '—', o.notes);
    console.log('  full:', fmt(o.full));
    if (o.keep) console.log('  keep:', fmt(o.keep), 'bothGreen?', o.bothGreenKeep?.bothGreen);
    if (o.boostAt2) console.log('  boost@2u:', fmt(o.boostAt2), 'bothGreen?', o.bothGreen?.bothGreen);
    console.log('');
  }

  // Top 3 both-green with N>=12, else relax
  let top3 = ranked.filter(h => h.bothGreen1u && h.n >= 12);
  if (top3.length < 3) top3 = ranked.filter(h => h.bothGreen1u && h.n >= 8);
  if (top3.length < 3) top3 = ranked.filter(h => h.bothGreen1u && h.n >= 5);
  if (top3.length < 3) {
    top3 = [
      ...top3,
      ...ranked.filter(h => !top3.includes(h) && h.m1u.roi > 5 && h.n >= 10),
    ].slice(0, 3);
  }
  top3 = top3.slice(0, 3);

  // Non-overlap / additive volume check vs Path C retune
  const pathCIds = new Set(pathCRetuneRescues.map(r => `${r.docId}|${r.sideKey}`));
  const rankIds = new Set(mutedAll.filter(r => r.rank.qualifies).map(r => `${r.docId}|${r.sideKey}`));

  const top3Detail = top3.map(h => {
    const hits = mutedAdditive.filter(H.find(x => x.name === h.name) && (() => {
      // re-get rule by re-filtering via notes — better store hits
      return true;
    })());
    // recompute hits from name
    const ruleMap = Object.fromEntries([
      // rebuilt below via second pass
    ]);
    return h;
  });

  // Recompute hit sets for overlap analysis
  const hypRules = {
    D1_high_forAvgSize: r => r.forAvgSize != null && r.forAvgSize >= 2.0,
    'D1b_maxForSize_ge_2.5': r => r.maxForSize != null && r.maxForSize >= 2.5,
    D2_1for0_rank: r => r.rank.backing === 1 && r.rank.against === 0,
    D2b_1for0_plus_highScore: r => r.rank.backing === 1 && r.rank.against === 0 && r.agsV12 >= 0.8,
    D2c_3for1_rank: r => r.rank.backing >= 3 && r.rank.against === 1,
    D2d_2for1_rank: r => r.rank.backing === 2 && r.rank.against === 1,
    D3_pos_clv: r => r.clv != null && r.clv > 0,
    D3b_lockProb_underdogish: r => r.lockPinnProb != null && r.lockPinnProb < 0.48 && r.odds >= -120,
    D4_MLB_TOTAL: r => r.sport === 'MLB' && r.market === 'TOTAL',
    D4b_SOC_ML: r => r.sport === 'SOC' && r.market === 'ML',
    D4c_MLB_ML_underdog: r => r.sport === 'MLB' && r.market === 'ML' && r.odds > 0,
    D5_wdAgCount_ge3: r => r.wdAgCount >= 3,
    D5b_low_contribMargin: r => r.contribMargin != null && r.contribMargin <= 0,
    D5c_neg_contrib_and_pos_score: r => r.contribMargin != null && r.contribMargin < 0 && r.agsV12 >= 0.5,
    D6_underdog: r => r.odds > 0,
    D6b_soft_no_chalk: r => r.odds > C_NO_CHALK,
    D6c_chalk_fade_skip: r => r.odds <= C_NO_CHALK,
    D7_highScore_hc0: r => (r.hcMargin || 0) === 0 && (r.miniHcMargin || 0) === 0 && r.agsV12 >= 0.9,
    D7b_elite_score_monitoring: r => r.agsV12 >= 0.95,
    'D7c_score_ge_0.7_soft': r => r.agsV12 >= 0.7 && r.odds > C_NO_CHALK,
    D8_no_ag_provenDollar: r => !r.agProvenDollar,
    D8b_ag_provenDollar_present: r => r.agProvenDollar,
    D8c_for_proven_ag_none_for2: r => r.sharpLegacy.provenDollar && !r.agProvenDollar && r.sharpLegacy.forCount >= 2
      && r.sharpLegacy.meanPWr != null && r.sharpLegacy.meanPWr >= 50 && !r.pathCRescue,
    D9_low_maxShare: r => r.maxShare != null && r.maxShare < 0.45,
    D9b_high_maxShare: r => r.maxShare != null && r.maxShare >= 0.70,
    D9c_wdFor_ge3_ag0: r => r.wdForCount >= 3 && r.wdAgCount === 0,
    'D10_soft_highScore_noAg$': r => r.odds > C_NO_CHALK && r.agsV12 >= 0.8 && !r.agProvenDollar,
    D10b_1for0_soft_highScore: r => r.rank.backing === 1 && r.rank.against === 0 && r.odds > C_NO_CHALK && r.agsV12 >= 0.7,
    D10c_MLB_TOTAL_soft: r => r.sport === 'MLB' && r.market === 'TOTAL' && r.odds > C_NO_CHALK,
    'D10d_for2_sharp_soft_noAg$': r => r.sharpLegacy.forCount === 2
      && r.sharpLegacy.provenDollar
      && r.sharpLegacy.meanPWr != null && r.sharpLegacy.meanPWr >= 50
      && r.odds > C_NO_CHALK && !r.agProvenDollar && !r.pathCRescue,
    'D10e_wdAg0_forAvgSize_ge1.5': r => r.wdAgCount === 0 && r.forAvgSize != null && r.forAvgSize >= 1.5,
    D10f_low_contrib_soft: r => r.contribMargin != null && r.contribMargin <= 10 && r.odds > C_NO_CHALK && r.agsV12 >= 0.6,
  };

  for (const h of ranked) {
    const rule = hypRules[h.name];
    if (!rule) continue;
    const hits = mutedAdditive.filter(rule);
    const ids = hits.map(r => `${r.docId}|${r.sideKey}`);
    h.overlapC = ids.filter(id => pathCIds.has(id)).length;
    h.overlapB = ids.filter(id => rankIds.has(id)).length;
    h.additiveN = ids.length; // already in additive pool so overlap B/C should be ~0
    h.perDay = +(hits.length / Math.max(1, new Set(abc.map(r => r.date)).size)).toFixed(2);
  }

  // Secondary sweep: tighten top candidates with extra filters if both halves still green
  const refinements = [];
  const refineDefs = [
    {
      name: 'R1_D10d_plus_score70',
      parent: 'D10d_for2_sharp_soft_noAg$',
      rule: r => hypRules['D10d_for2_sharp_soft_noAg$'](r) && r.agsV12 >= 0.7,
      notes: 'for=2 sharp soft noAg$ + score≥0.7',
    },
    {
      name: 'R2_D7c_MLB',
      parent: 'D7c_score_ge_0.7_soft',
      rule: r => r.agsV12 >= 0.7 && r.odds > C_NO_CHALK && r.sport === 'MLB',
      notes: 'score≥0.7 soft MLB only',
    },
    {
      name: 'R3_D10e_soft',
      parent: 'D10e_wdAg0_forAvgSize_ge1.5',
      rule: r => r.wdAgCount === 0 && r.forAvgSize >= 1.5 && r.odds > C_NO_CHALK,
      notes: '0 AGAINST + size≥1.5 + soft',
    },
    {
      name: 'R4_D2b_soft',
      parent: 'D2b_1for0_plus_highScore',
      rule: r => r.rank.backing === 1 && r.rank.against === 0 && r.agsV12 >= 0.8 && r.odds > C_NO_CHALK,
      notes: '1-for-0 + score≥0.8 + soft',
    },
    {
      name: 'R5_D5b_soft_score',
      parent: 'D5b_low_contribMargin',
      rule: r => r.contribMargin != null && r.contribMargin <= 0 && r.odds > C_NO_CHALK && r.agsV12 >= 0.7,
      notes: 'contribMargin≤0 + soft + score≥0.7',
    },
    {
      name: 'R6_underdog_score80',
      parent: 'D6_underdog',
      rule: r => r.odds > 0 && r.agsV12 >= 0.8,
      notes: 'underdog + score≥0.8',
    },
    {
      name: 'R7_D9c_soft_score',
      parent: 'D9c_wdFor_ge3_ag0',
      rule: r => r.wdForCount >= 3 && r.wdAgCount === 0 && r.odds > C_NO_CHALK && r.agsV12 >= 0.7,
      notes: '≥3 FOR / 0 AG + soft + score≥0.7',
    },
    {
      name: 'R8_D4_TOTAL_score70',
      parent: 'D4_MLB_TOTAL',
      rule: r => r.sport === 'MLB' && r.market === 'TOTAL' && r.agsV12 >= 0.7 && r.odds > C_NO_CHALK,
      notes: 'MLB TOTAL + score≥0.7 + soft',
    },
  ];
  for (const d of refineDefs) {
    refinements.push(evalHyp(d.name, d.rule, mutedAdditive, d.notes));
  }
  console.log('\n═══ REFINEMENTS ═══\n');
  for (const h of refinements.sort((a, b) => (b.bothGreen1u ? 1 : 0) - (a.bothGreen1u ? 1 : 0) || (b.m1u.roi || 0) - (a.m1u.roi || 0))) {
    const flag = h.bothGreen1u ? '🟢' : '⚪';
    console.log(`${flag} ${h.name}: ${fmt(h.m1u)} | halves ${h.halves1u.bothGreen} | ${h.notes}`);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    universe: {
      v12: v12.length,
      v12Pos: v12Pos.length,
      abcPos: abcPos.length,
      monitoring: mon.length,
      mutedAdditive: mutedAdditive.length,
      mutedAll: mutedAll.length,
    },
    pathC: {
      stamped: summarize(pathCStamped, r => r.units),
      retuneRescueCF: summarize(pathCRetuneRescues, r => oddsCap(r.sharpRetune.prime ? 4 : 3, r.odds)),
    },
    killFlat1u: summarize(mutedAdditive, 1),
    hypotheses: ranked,
    refinements,
    overlays: overlayResults,
    top3Names: top3.map(h => h.name),
    caveat: 'RANK/$ROI/WR eligibility uses CURRENT sharpWalletProfiles (mildly optimistic vs point-in-time). CLV hypotheses are leaky for live staking.',
  };

  const outPath = join(__dirname, '_pathd_results.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outPath}`);
  console.log('Top-3 both-green (or best available):', top3.map(h => h.name).join(', ') || '(none)');
}

main().catch(e => { console.error(e); process.exit(1); });
