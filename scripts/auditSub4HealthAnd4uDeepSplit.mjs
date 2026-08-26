#!/usr/bin/env node
/**
 * (1) Sub-4 health trajectory — is it improving?
 * (2) Deep stamp-safe 4u+ W/L separator hunt — exhaustive + automated.
 *
 * SAFE ONLY: ticket v8_* stamps + peak/lock walletDetails / v8Scoring.
 * NO live sharpWalletProfiles sport WR/n/$ROI.
 *
 * Usage: node scripts/auditSub4HealthAnd4uDeepSplit.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';
import { HC_RATIO } from '../src/lib/ags.js';
import { maxForSizeRatio } from '../src/lib/walletClvSkill.js';
import {
  FLINCH_FAIL_OPEN_MUTE_FROM,
  MAX_SR_SUB4_MUTE_FROM,
} from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
loadEnv({ path: join(REPO_ROOT, '.env.local') });
loadEnv({ path: join(REPO_ROOT, '.env') });

const FROM = '2026-06-15';
const AGSU = 'ags-unified';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

// maxSR-sub4 mute from export — fall back if rename
const MAXSR_FROM = typeof MAX_SR_SUB4_MUTE_FROM === 'string' ? MAX_SR_SUB4_MUTE_FROM : '2026-08-20';
const FLINCH_FROM = FLINCH_FAIL_OPEN_MUTE_FROM || '2026-08-19';

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
function fmt(a) {
  if (!a?.n) return 'n=0';
  return `${a.n} · ${a.w}–${a.l} · ${a.wr.toFixed(0)}%WR · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u · ROI ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
}
function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function mean(xs) {
  const v = xs.filter(Number.isFinite);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}
function med(xs) {
  const v = xs.filter(Number.isFinite).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}
function pathOf(sd) {
  return sd.v8_hcStakeTier || sd.v8_agsV12Tier || sd.v8_stakePath || sd.v8_agsTier || '—';
}

async function loadAll(firestore) {
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
        if (won == null) continue;
        if (res.tracked === true) continue;
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        if (!(units > 0)) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const forWd = wd.filter((w) => String(w.side) === String(sideKey)
          && (w.direction == null || String(w.direction).toUpperCase() === 'FOR'));
        const hcLeads = forWd
          .filter((w) => Number(w.sizeRatio) >= HC_RATIO)
          .sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio)
            || Number(b.invested || 0) - Number(a.invested || 0));
        const lead = hcLeads[0] || forWd.slice().sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio))[0] || null;
        const scoring = peak.v8Scoring || lock.v8Scoring || {};
        const steam = sd.v8_steam && typeof sd.v8_steam === 'object' ? sd.v8_steam : {};
        const path = pathOf(sd);
        const tapeAction = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || '—';

        rows.push({
          id: docSnap.id,
          date,
          sport: data.sport || '',
          mkt,
          team: sd.team || sideKey,
          path,
          units,
          odds,
          won,
          profit: profitOf(units, odds, won),
          mutedBy: sd.mutedBy || '',
          // stamps
          edge: num(sd.v8_winnerAlignEdge),
          meanFor: num(sd.v8_winnerAlignMeanFor),
          meanAg: num(sd.v8_winnerAlignMeanAg),
          topFor: num(sd.v8_winnerAlignTopFor),
          topAg: num(sd.v8_winnerAlignTopAg),
          forN: num(sd.v8_winnerAlignForN),
          agN: num(sd.v8_winnerAlignAgN),
          hasBoth: sd.v8_winnerAlignHasBoth === true
            || (num(sd.v8_winnerAlignForN) > 0 && num(sd.v8_winnerAlignAgN) > 0),
          fadeTop: sd.v8_winnerAlignFadeTop60 === true,
          topUnopp: sd.v8_winnerAlignTopUnopp === true,
          tapeAction,
          tapeScore: num(sd.v8_tapeScore),
          tapeEdge: num(sd.v8_tapeEdgeTerm),
          tapeNet: num(sd.v8_tapeNetTerm),
          netMeanPrior: num(sd.v8_netMeanPrior),
          netFor: num(sd.v8_netClvMeanFor),
          netAg: num(sd.v8_netClvMeanAg),
          netNFor: num(sd.v8_netClvNFor),
          edgeBand: sd.v8_edgeBand || null,
          edgeNetBucket: sd.v8_edgeNetBucket || null,
          edgeNetSizeAction: String(sd.v8_edgeNetSizeAction || '').toUpperCase() || null,
          edgeBandAction: String(sd.v8_edgeBandAction || '').toUpperCase() || null,
          forTop2Pct: num(sd.v8_forTop2PctPos),
          forTop2N: num(sd.v8_forTop2NSkill),
          qConv: num(sd.v8_qConv),
          qConvAction: String(sd.v8_qConvAction || '').toUpperCase() || null,
          bestForTier: sd.v8_bestForTier || null,
          nForProven: num(sd.v8_nForProven),
          provenFor: num(sd.v8_agsProvenForCount),
          provenAg: num(sd.v8_agsProvenAgCount),
          agsV12: num(sd.v8_agsV12 ?? sd.v8_skillAgsV12),
          agsV12ForMean: num(sd.v8_agsV12ForMean),
          agsV12AgMean: num(sd.v8_agsV12AgMean),
          hcFor: num(sd.v8_hcConfFor),
          hcAg: num(sd.v8_hcConfAg),
          hcMargin: num(sd.v8_hcMargin),
          maxSR: maxForSizeRatio(wd, sideKey),
          sumSR: forWd.reduce((s, w) => {
            const sr = Number(w.sizeRatio);
            return s + (Number.isFinite(sr) ? sr : 0);
          }, 0),
          forWalletN: forWd.length,
          leadSR: lead ? num(lead.sizeRatio) : null,
          leadInvested: lead ? num(lead.invested) : null,
          leadContrib: lead ? num(lead.contribution) : null,
          leadRoi: lead ? num(lead.roi) : null,
          leadRoiNorm: lead ? num(lead.roiNorm) : null,
          leadPnlNorm: lead ? num(lead.pnlNorm) : null,
          leadWalletBase: lead ? num(lead.walletBase) : null,
          leadN: hcLeads.length,
          qualityFor: num(scoring.qualityForT30),
          qualityAg: num(scoring.qualityAgT30),
          deltaQuality: num(scoring.deltaQuality),
          walletPlayScore: num(scoring.walletPlayScore),
          topShare: num(scoring.topShare),
          netEdge: num(scoring.netEdge),
          // tracking-only but stamp-safe for research
          blendWr: num(sd.v8_blendWr),
          expWin: num(sd.v8_expWin),
          expWinFrozen: num(sd.v8_expWinFrozen),
          ticketEvPct: num(sd.v8_ticketEvPct),
          steamLastHour: num(sd.v8_steamLastHourPct ?? steam.lastHourPct),
          steamSinceOpen: num(sd.v8_steamSinceOpenPct ?? steam.sinceOpenPct),
          steamTier: sd.v8_steamTier || steam.tier || null,
          bothE10: String(sd.v8_bothE10TapeAction || '').toUpperCase() || null,
          bothE10Mode: sd.v8_bothE10TapeMode || null,
          fav: odds < 0,
          dog: odds > 0,
          plus120: odds > 120,
          chalk200: odds <= -200,
          isTop: path === 'TOP' || path === 'TOP+',
          is4u: units >= 4,
          isSub4: units > 0 && units < 4,
        });
      }
    }
  }
  return rows;
}

function dayRows(rows) {
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.date)) map.set(r.date, []);
    map.get(r.date).push(r);
  }
  return [...map.keys()].sort().map((d) => ({ date: d, ...agg(map.get(d)) }));
}

function rolling(dayList, win = 7) {
  const out = [];
  for (let i = 0; i < dayList.length; i++) {
    const slice = dayList.slice(Math.max(0, i - win + 1), i + 1);
    const n = slice.reduce((s, d) => s + d.n, 0);
    const w = slice.reduce((s, d) => s + d.w, 0);
    const l = slice.reduce((s, d) => s + d.l, 0);
    const stake = slice.reduce((s, d) => s + d.stake, 0);
    const pnl = slice.reduce((s, d) => s + d.pnl, 0);
    out.push({
      end: dayList[i].date,
      nDays: slice.length,
      n, w, l,
      wr: n ? (100 * w) / n : null,
      stake,
      pnl,
      roi: stake > 0 ? (100 * pnl) / stake : null,
    });
  }
  return out;
}

function weekBucket(date) {
  // ISO-ish Aug weeks for readability
  if (date < '2026-07-01') return 'Jun15–30';
  if (date < '2026-07-15') return 'Jul1–14';
  if (date < '2026-08-01') return 'Jul15–31';
  if (date < '2026-08-08') return 'Aug1–7';
  if (date < '2026-08-15') return 'Aug8–14';
  if (date < '2026-08-19') return 'Aug15–18';
  if (date < '2026-08-20') return 'Aug19 (flinch day)';
  if (date < '2026-08-26') return 'Aug20–25 (maxSR mute live)';
  return `Aug26+`;
}

// ── Automated rule search ──────────────────────────────────────────────────
function evalCut(rows, fn) {
  const cut = rows.filter(fn);
  const keep = rows.filter((r) => !fn(r));
  const c = agg(cut);
  const k = agg(keep);
  const base = agg(rows);
  if (!c.n || !k.n) return null;
  return {
    cutN: c.n, cutW: c.w, cutL: c.l, cutRoi: c.roi, cutPnl: c.pnl, cutWr: c.wr,
    keepN: k.n, keepW: k.w, keepL: k.l, keepRoi: k.roi, keepPnl: k.pnl, keepWr: k.wr,
    deltaPnl: k.pnl - base.pnl, // = -cut.pnl if cut all of match
    basePnl: base.pnl,
    baseRoi: base.roi,
    liftRoi: (k.roi ?? 0) - (base.roi ?? 0),
  };
}

function scoreRule(ev) {
  if (!ev) return -1e9;
  // Prefer: positive ΔPnL, cut ROI deeply negative, keep ROI up, decent cut n
  const cutBad = (ev.cutRoi ?? 0) < -5;
  const keepGood = (ev.keepRoi ?? 0) > (ev.baseRoi ?? 0);
  const sizeOk = ev.cutN >= 4 && ev.keepN >= 8;
  let s = ev.deltaPnl;
  if (cutBad) s += 3;
  if (keepGood) s += 2;
  if (sizeOk) s += 1;
  if (ev.cutN < 3) s -= 20;
  if (ev.keepN < 5) s -= 20;
  // Penalize tiny cuts that look like noise
  if (ev.cutN < 5 && ev.deltaPnl < 8) s -= 5;
  return s;
}

function thresholdSweep(rows, name, getter, thresholds, direction = 'cut_low') {
  const results = [];
  for (const t of thresholds) {
    const fn = direction === 'cut_low'
      ? (r) => { const v = getter(r); return v != null && v < t; }
      : (r) => { const v = getter(r); return v != null && v >= t; };
    const ev = evalCut(rows, fn);
    if (!ev) continue;
    results.push({
      name: direction === 'cut_low' ? `${name} < ${t}` : `${name} ≥ ${t}`,
      fn, ev, score: scoreRule(ev),
    });
  }
  return results;
}

function buildCandidateRules() {
  const rules = [];
  const add = (name, fn) => rules.push({ name, fn });

  // Path
  add('TOP/TOP+', (r) => r.isTop);
  add('SHARP', (r) => r.path === 'SHARP');
  add('SHARP-LEAN', (r) => r.path === 'SHARP-LEAN');
  add('RANK', (r) => r.path === 'RANK');
  add('MINI/MINI-', (r) => r.path === 'MINI' || r.path === 'MINI-');
  add('SUPER', (r) => r.path === 'SUPER');
  add('CONFIRMED-Q1', (r) => r.path === 'CONFIRMED-Q1');
  add('CONFIRMED-UNOPP', (r) => r.path === 'CONFIRMED-UNOPP');
  add('DISSENT', (r) => r.path === 'DISSENT');

  // Tape
  add('tape FAIL_OPEN', (r) => r.tapeAction === 'FAIL_OPEN');
  add('tape BOOST', (r) => r.tapeAction === 'BOOST');
  add('tape HOLD', (r) => r.tapeAction === 'HOLD');
  add('tape MUTE', (r) => r.tapeAction === 'MUTE');

  // EDGE / align
  add('EDGE missing', (r) => r.edge == null);
  add('EDGE < 0', (r) => r.edge != null && r.edge < 0);
  add('EDGE < 5', (r) => r.edge != null && r.edge < 5);
  add('EDGE < 7', (r) => r.edge != null && r.edge < 7);
  add('EDGE < 10', (r) => r.edge != null && r.edge < 10);
  add('EDGE ≥ 10', (r) => r.edge != null && r.edge >= 10);
  add('EDGE ≥ 15', (r) => r.edge != null && r.edge >= 15);
  add('EDGE ≥ 20', (r) => r.edge != null && r.edge >= 20);
  add('EDGE ≥ 25', (r) => r.edge != null && r.edge >= 25);
  add('EDGE ≥ 30', (r) => r.edge != null && r.edge >= 30);
  add('meanFor < 45', (r) => r.meanFor != null && r.meanFor < 45);
  add('meanFor < 50', (r) => r.meanFor != null && r.meanFor < 50);
  add('meanFor < 55', (r) => r.meanFor != null && r.meanFor < 55);
  add('meanFor ≥ 60', (r) => r.meanFor != null && r.meanFor >= 60);
  add('topFor < 50', (r) => r.topFor != null && r.topFor < 50);
  add('topFor < 55', (r) => r.topFor != null && r.topFor < 55);
  add('topFor ≥ 65', (r) => r.topFor != null && r.topFor >= 65);
  add('!hasBoth', (r) => !r.hasBoth);
  add('hasBoth', (r) => r.hasBoth);
  add('fadeTop60', (r) => r.fadeTop);
  add('agN = 0', (r) => r.agN === 0);
  add('forN ≤ 1', (r) => r.forN != null && r.forN <= 1);
  add('forN ≥ 4', (r) => r.forN != null && r.forN >= 4);

  // Size / lead
  add('maxSR < 0.5', (r) => r.maxSR != null && r.maxSR < 0.5);
  add('maxSR < 1', (r) => r.maxSR != null && r.maxSR < 1);
  add('maxSR < 1.5', (r) => r.maxSR != null && r.maxSR < 1.5);
  add('maxSR ≥ 1', (r) => r.maxSR != null && r.maxSR >= 1);
  add('maxSR ≥ 2', (r) => r.maxSR != null && r.maxSR >= 2);
  add('maxSR ≥ 3', (r) => r.maxSR != null && r.maxSR >= 3);
  add('leadSR ≥ 3', (r) => r.leadSR != null && r.leadSR >= 3);
  add('leadSR ≥ 4', (r) => r.leadSR != null && r.leadSR >= 4);
  add('leadSR < 1', (r) => r.leadSR != null && r.leadSR < 1);
  add('leadSR < 1.5', (r) => r.leadSR != null && r.leadSR < 1.5);
  add('leadN = 0 (no HC proxy)', (r) => r.leadN === 0);
  add('leadN ≥ 2', (r) => r.leadN >= 2);

  // Odds / market / sport
  add('fav ≤-200', (r) => r.chalk200);
  add('fav ≤-150', (r) => r.odds <= -150);
  add('dog', (r) => r.dog);
  add('plus>+120', (r) => r.plus120);
  add('plus>+150', (r) => r.odds > 150);
  add('WNBA', (r) => r.sport === 'WNBA');
  add('MLB', (r) => r.sport === 'MLB');
  add('NFL', (r) => r.sport === 'NFL');
  add('UFC', (r) => r.sport === 'UFC');
  add('MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL');
  add('MLB SPREAD', (r) => r.sport === 'MLB' && r.mkt === 'SPREAD');
  add('MLB ML', (r) => r.sport === 'MLB' && r.mkt === 'ML');
  add('TOTAL any', (r) => r.mkt === 'TOTAL');
  add('SPREAD any', (r) => r.mkt === 'SPREAD');

  // Units band
  add('units ≥ 5.4 (BOOST band)', (r) => r.units >= 5.4);
  add('units ≥ 6', (r) => r.units >= 6);
  add('units 4–4.99', (r) => r.units >= 4 && r.units < 5);
  add('units 5–5.39', (r) => r.units >= 5 && r.units < 5.4);

  // Net / qConv / bands
  add('netMeanPrior < 0', (r) => r.netMeanPrior != null && r.netMeanPrior < 0);
  add('netMeanPrior < 5', (r) => r.netMeanPrior != null && r.netMeanPrior < 5);
  add('edgeNet NEITHER', (r) => r.edgeNetBucket === 'NEITHER');
  add('edgeNet BOTH', (r) => r.edgeNetBucket === 'BOTH');
  add('edgeNet ONE', (r) => r.edgeNetBucket === 'ONE');
  add('edgeBand LT5', (r) => r.edgeBand === 'LT5' || r.edgeBand === 'LT7');
  add('edgeBand GE10/GE11', (r) => r.edgeBand === 'GE10' || r.edgeBand === 'GE11');
  add('edgeBand MISSING', (r) => r.edgeBand === 'MISSING');
  add('qConv < 0', (r) => r.qConv != null && r.qConv < 0);
  add('bestFor FLAT', (r) => r.bestForTier === 'FLAT');
  add('bestFor CONFIRMED', (r) => r.bestForTier === 'CONFIRMED');

  // Tracking stamps (research — not sizing inputs today)
  add('ticketEv < 0', (r) => r.ticketEvPct != null && r.ticketEvPct < 0);
  add('ticketEv < 1', (r) => r.ticketEvPct != null && r.ticketEvPct < 1);
  add('ticketEv ≥ 3', (r) => r.ticketEvPct != null && r.ticketEvPct >= 3);
  add('steam lastHour < 0', (r) => r.steamLastHour != null && r.steamLastHour < 0);
  add('steam lastHour ≥ 1', (r) => r.steamLastHour != null && r.steamLastHour >= 1);
  add('steam sinceOpen < 0', (r) => r.steamSinceOpen != null && r.steamSinceOpen < 0);
  add('blendWr < mkt (underdog vs blend)', (r) => {
    // blend vs implied — use odds rough: if blendWr and we have units
    return false;
  });
  add('expWin − mktImplied gap < 0', (r) => {
    // skip without implied stamp easily
    return false;
  });
  add('expWin < 50', (r) => r.expWin != null && r.expWin < 50);
  add('expWin ≥ 55', (r) => r.expWin != null && r.expWin >= 55);
  add('blendWr < 48', (r) => r.blendWr != null && r.blendWr < 48);
  add('blendWr ≥ 55', (r) => r.blendWr != null && r.blendWr >= 55);

  // Scoring
  add('deltaQuality < 0', (r) => r.deltaQuality != null && r.deltaQuality < 0);
  add('walletPlayScore < 0', (r) => r.walletPlayScore != null && r.walletPlayScore < 0);
  add('forTop2Pct < 50', (r) => r.forTop2Pct != null && r.forTop2Pct < 50);
  add('forTop2Pct ≥ 60', (r) => r.forTop2Pct != null && r.forTop2Pct >= 60);
  add('agsV12 < 0', (r) => r.agsV12 != null && r.agsV12 < 0);
  add('hcMargin = 1', (r) => r.hcMargin === 1);
  add('hcMargin ≥ 2', (r) => r.hcMargin != null && r.hcMargin >= 2);

  // Known TOP interactions
  add('TOP × leadSR≥3', (r) => r.isTop && r.leadSR != null && r.leadSR >= 3);
  add('TOP × EDGE<10', (r) => r.isTop && r.edge != null && r.edge < 10);
  add('TOP × (leadSR≥3 OR EDGE<10)', (r) => r.isTop && (
    (r.leadSR != null && r.leadSR >= 3) || (r.edge != null && r.edge < 10)
  ));
  add('TOP × maxSR≥3', (r) => r.isTop && r.maxSR != null && r.maxSR >= 3);
  add('TOP × FAIL_OPEN', (r) => r.isTop && r.tapeAction === 'FAIL_OPEN');
  add('TOP × BOOST', (r) => r.isTop && r.tapeAction === 'BOOST');
  add('TOP × dog', (r) => r.isTop && r.dog);
  add('TOP × MLB', (r) => r.isTop && r.sport === 'MLB');
  add('TOP × WNBA', (r) => r.isTop && r.sport === 'WNBA');

  // Path × size / edge infections outside TOP
  add('SHARP × EDGE≥25', (r) => r.path === 'SHARP' && r.edge != null && r.edge >= 25);
  add('SHARP × EDGE≥20', (r) => r.path === 'SHARP' && r.edge != null && r.edge >= 20);
  add('SHARP × maxSR<1', (r) => r.path === 'SHARP' && r.maxSR != null && r.maxSR < 1);
  add('SHARP × BOOST', (r) => r.path === 'SHARP' && r.tapeAction === 'BOOST');
  add('SHARP × units≥5.4', (r) => r.path === 'SHARP' && r.units >= 5.4);
  add('RANK × EDGE≥20', (r) => r.path === 'RANK' && r.edge != null && r.edge >= 20);
  add('RANK × maxSR<1', (r) => r.path === 'RANK' && r.maxSR != null && r.maxSR < 1);
  add('RANK × BOOST', (r) => r.path === 'RANK' && r.tapeAction === 'BOOST');
  add('RANK × units≥5.4', (r) => r.path === 'RANK' && r.units >= 5.4);
  add('MINI × EDGE≥20', (r) => (r.path === 'MINI' || r.path === 'MINI-') && r.edge != null && r.edge >= 20);
  add('MINI × BOOST', (r) => (r.path === 'MINI' || r.path === 'MINI-') && r.tapeAction === 'BOOST');
  add('MINI × units≥5.4', (r) => (r.path === 'MINI' || r.path === 'MINI-') && r.units >= 5.4);
  add('SHARP-LEAN × maxSR<1', (r) => r.path === 'SHARP-LEAN' && r.maxSR != null && r.maxSR < 1);
  add('SHARP-LEAN × BOOST', (r) => r.path === 'SHARP-LEAN' && r.tapeAction === 'BOOST');
  add('SHARP-LEAN × EDGE≥15', (r) => r.path === 'SHARP-LEAN' && r.edge != null && r.edge >= 15);
  add('BOOST × EDGE≥20', (r) => r.tapeAction === 'BOOST' && r.edge != null && r.edge >= 20);
  add('BOOST × EDGE≥25', (r) => r.tapeAction === 'BOOST' && r.edge != null && r.edge >= 25);
  add('BOOST × maxSR<1', (r) => r.tapeAction === 'BOOST' && r.maxSR != null && r.maxSR < 1);
  add('BOOST × leadSR≥3', (r) => r.tapeAction === 'BOOST' && r.leadSR != null && r.leadSR >= 3);
  add('BOOST × dog', (r) => r.tapeAction === 'BOOST' && r.dog);
  add('BOOST × WNBA', (r) => r.tapeAction === 'BOOST' && r.sport === 'WNBA');
  add('units≥5.4 × EDGE≥20', (r) => r.units >= 5.4 && r.edge != null && r.edge >= 20);
  add('units≥5.4 × EDGE≥25', (r) => r.units >= 5.4 && r.edge != null && r.edge >= 25);
  add('units≥5.4 × maxSR<1', (r) => r.units >= 5.4 && r.maxSR != null && r.maxSR < 1);
  add('units≥5.4 × !hasBoth', (r) => r.units >= 5.4 && !r.hasBoth);
  add('units≥5.4 × dog', (r) => r.units >= 5.4 && r.dog);
  add('units≥6 × EDGE≥20', (r) => r.units >= 6 && r.edge != null && r.edge >= 20);

  // Odds × path
  add('dog × TOP', (r) => r.dog && r.isTop);
  add('chalk≤-200 × any', (r) => r.chalk200);
  add('plus>+120 × BOOST', (r) => r.plus120 && r.tapeAction === 'BOOST');
  add('plus>+120 × EDGE≥15', (r) => r.plus120 && r.edge != null && r.edge >= 15);

  // Lead stamp quality
  add('leadRoiNorm < 0', (r) => r.leadRoiNorm != null && r.leadRoiNorm < 0);
  add('leadRoi < 0', (r) => r.leadRoi != null && r.leadRoi < 0);
  add('leadPnlNorm < 0', (r) => r.leadPnlNorm != null && r.leadPnlNorm < 0);
  add('qualityFor < 50', (r) => r.qualityFor != null && r.qualityFor < 50);

  return rules.filter((r) => r.name); // drop empty placeholders
}

function continuousSweeps(rows) {
  const sweeps = [];
  const specs = [
    ['EDGE', (r) => r.edge, [0, 5, 7, 10, 12, 15, 18, 20, 25, 30], 'both'],
    ['meanFor', (r) => r.meanFor, [45, 48, 50, 52, 55, 58, 60, 65], 'both'],
    ['topFor', (r) => r.topFor, [50, 55, 60, 65], 'both'],
    ['maxSR', (r) => r.maxSR, [0.5, 1, 1.5, 2, 2.5, 3, 4], 'both'],
    ['leadSR', (r) => r.leadSR, [1, 1.5, 2, 2.5, 3, 4, 5], 'both'],
    ['tapeScore', (r) => r.tapeScore, [0, 0.5, 1, 1.5, 2], 'both'],
    ['netMeanPrior', (r) => r.netMeanPrior, [-5, 0, 5, 10], 'both'],
    ['qConv', (r) => r.qConv, [-1, 0, 0.5, 1], 'both'],
    ['ticketEvPct', (r) => r.ticketEvPct, [-1, 0, 1, 2, 3, 5], 'both'],
    ['steamLastHour', (r) => r.steamLastHour, [-1, 0, 0.5, 1, 2], 'both'],
    ['steamSinceOpen', (r) => r.steamSinceOpen, [-2, -1, 0, 1, 2], 'both'],
    ['blendWr', (r) => r.blendWr, [45, 48, 50, 52, 55], 'both'],
    ['expWin', (r) => r.expWin, [48, 50, 52, 55], 'both'],
    ['forTop2Pct', (r) => r.forTop2Pct, [45, 50, 55, 60], 'both'],
    ['agsV12', (r) => r.agsV12, [-1, 0, 0.5, 1], 'both'],
    ['units', (r) => r.units, [5, 5.4, 6], 'cut_high'],
    ['odds', (r) => r.odds, [-200, -150, -120, 100, 120, 150, 200], 'both'],
    ['sumSR', (r) => r.sumSR, [1, 2, 3, 5], 'both'],
    ['forWalletN', (r) => r.forWalletN, [1, 2, 3, 4], 'both'],
    ['leadRoiNorm', (r) => r.leadRoiNorm, [-0.5, 0, 0.5], 'both'],
  ];
  for (const [name, getter, thrs, mode] of specs) {
    if (mode === 'both' || mode === 'cut_low') {
      sweeps.push(...thresholdSweep(rows, name, getter, thrs, 'cut_low'));
    }
    if (mode === 'both' || mode === 'cut_high') {
      sweeps.push(...thresholdSweep(rows, name, getter, thrs, 'cut_high'));
    }
  }
  return sweeps;
}

function pairwiseAnd(topUnary, rows, maxPairs = 80) {
  const out = [];
  const n = Math.min(topUnary.length, 18);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = topUnary[i];
      const b = topUnary[j];
      const fn = (r) => a.fn(r) && b.fn(r);
      const ev = evalCut(rows, fn);
      if (!ev || ev.cutN < 3) continue;
      out.push({
        name: `(${a.name}) AND (${b.name})`,
        fn, ev, score: scoreRule(ev),
      });
      if (out.length >= maxPairs) return out;
    }
  }
  return out;
}

function stabilityCheck(rule, windows) {
  const marks = [];
  for (const [label, rows] of windows) {
    const ev = evalCut(rows, rule.fn);
    if (!ev) {
      marks.push({ label, ok: false, note: 'n/a' });
      continue;
    }
    const ok = ev.deltaPnl > 0 && (ev.cutRoi ?? 0) < (ev.keepRoi ?? 0);
    marks.push({
      label,
      ok,
      deltaPnl: ev.deltaPnl,
      cutRoi: ev.cutRoi,
      keepRoi: ev.keepRoi,
      cutN: ev.cutN,
      keepN: ev.keepN,
    });
  }
  const okCount = marks.filter((m) => m.ok).length;
  return { marks, okCount, stable: okCount >= Math.min(2, windows.length) };
}

async function main() {
  console.error('Loading picks Jun15+…');
  const all = await loadAll(db());
  const sub4 = all.filter((r) => r.isSub4);
  const plus4 = all.filter((r) => r.is4u);
  const augSub4 = sub4.filter((r) => r.date >= '2026-08-01');
  const aug4 = plus4.filter((r) => r.date >= '2026-08-01');

  const lines = [];
  const out = (s = '') => { lines.push(s); console.log(s); };

  out('# Sub-4 health + deep 4u+ W/L separator hunt');
  out(`_Generated ${new Date().toISOString()} · stamp-safe only · no live wallet WR_`);
  out('');

  // ═══════════════════════════════════════════════════════════════════════
  out('## 1. Is sub-4 health improving?');
  out('');
  out(`Mute cutovers: flinch/fail-open **${FLINCH_FROM}**, maxSR-sub4 **${MAXSR_FROM}**.`);
  out('');

  const eras = [
    ['Jun15–Jul14', (r) => r.date >= '2026-06-15' && r.date < '2026-07-15'],
    ['Jul15–31', (r) => r.date >= '2026-07-15' && r.date < '2026-08-01'],
    ['Aug1–18 (pre-mute)', (r) => r.date >= '2026-08-01' && r.date < FLINCH_FROM],
    [`Aug19+ (flinch+)`, (r) => r.date >= FLINCH_FROM],
    [`Aug20+ (maxSR mute)`, (r) => r.date >= MAXSR_FROM],
    ['Aug1–25 all', (r) => r.date >= '2026-08-01' && r.date <= '2026-08-25'],
  ];
  out('| Era | n | W–L | WR | PnL | ROI |');
  out('|-----|--:|:---:|---:|----:|----:|');
  for (const [label, fn] of eras) {
    const a = agg(sub4.filter(fn));
    if (!a.n) continue;
    out(`| ${label} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(1)}% | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }
  out('');

  out('### August week buckets');
  out('| Week | n | W–L | WR | PnL | ROI |');
  out('|------|--:|:---:|---:|----:|----:|');
  const weekMap = new Map();
  for (const r of augSub4) {
    const w = weekBucket(r.date);
    if (!weekMap.has(w)) weekMap.set(w, []);
    weekMap.get(w).push(r);
  }
  for (const [w, rs] of [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const a = agg(rs);
    out(`| ${w} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(1)}% | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }
  out('');

  out('### August sub-4 day tape');
  out('```');
  const subDays = dayRows(augSub4);
  for (const d of subDays) {
    out(`${d.date}  ${String(d.n).padStart(2)}p  ${d.w}-${d.l}  ${(d.pnl >= 0 ? '+' : '') + d.pnl.toFixed(2)}u  ROI ${d.roi >= 0 ? '+' : ''}${d.roi.toFixed(0)}%`);
  }
  out('```');
  out('');

  out('### Rolling 7-day sub-4 ROI (Aug, by last day)');
  out('| End | n (7d) | W–L | PnL | ROI |');
  out('|-----|-------:|:---:|----:|----:|');
  const roll = rolling(subDays, 7);
  for (const r of roll) {
    if (r.nDays < 3) continue;
    out(`| ${r.end} | ${r.n} | ${r.w}–${r.l} | ${r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(1)}u | ${r.roi >= 0 ? '+' : ''}${r.roi.toFixed(1)}% |`);
  }
  out('');

  // Pre vs post mute actual (shipped book)
  const preMute = agg(augSub4.filter((r) => r.date < FLINCH_FROM));
  const postFlinch = agg(augSub4.filter((r) => r.date >= FLINCH_FROM));
  const postMax = agg(augSub4.filter((r) => r.date >= MAXSR_FROM));
  out('### Verdict — sub-4 improving?');
  out(`- Pre-mute Aug (1–18): **${fmt(preMute)}**`);
  out(`- Post flinch (19+): **${fmt(postFlinch)}**`);
  out(`- Post maxSR mute (20+): **${fmt(postMax)}**`);
  const improving = (postMax.roi ?? -999) > (preMute.roi ?? -999) + 5
    || ((postMax.pnl ?? 0) > 0 && (preMute.pnl ?? 0) < 0);
  const softImprove = (postMax.roi ?? -999) > (preMute.roi ?? -999);
  if (improving) {
    out('- **YES — clear improvement** post-mute vs early August.');
  } else if (softImprove) {
    out('- **Mildly improving** post-mute vs early August (ROI up, still watch).');
  } else {
    out('- **Not clearly improving yet** — post-mute ROI still soft vs early Aug, or sample thin.');
  }
  out('');

  // Path mix shift
  out('### Sub-4 path mix shift (pre vs post maxSR)');
  const pathMix = (rs) => {
    const m = {};
    for (const r of rs) {
      m[r.path] = m[r.path] || [];
      m[r.path].push(r);
    }
    return Object.entries(m).map(([k, v]) => [k, agg(v)]).sort((a, b) => a[1].pnl - b[1].pnl);
  };
  out('**Pre-mute paths (worst first):**');
  for (const [k, a] of pathMix(augSub4.filter((r) => r.date < FLINCH_FROM))) {
    if (a.n < 2) continue;
    out(`- ${k}: ${fmt(a)}`);
  }
  out('**Post maxSR paths:**');
  for (const [k, a] of pathMix(augSub4.filter((r) => r.date >= MAXSR_FROM))) {
    if (a.n < 2) continue;
    out(`- ${k}: ${fmt(a)}`);
  }
  out('');

  // ═══════════════════════════════════════════════════════════════════════
  out('## 2. Deep 4u+ W/L separator hunt (stamp-safe)');
  out('');
  out('Method: unary flags + continuous threshold sweeps + pairwise ANDs,');
  out('scored by ΔPnL if CUT match, requiring cut ROI soft and keep ROI lift.');
  out('Stability = helps in ≥2 of {Aug, Jul15+, Jun15+}.');
  out('');

  const winAug = aug4;
  const winJul = plus4.filter((r) => r.date >= '2026-07-15');
  const winJun = plus4.filter((r) => r.date >= '2026-06-15');
  const windows = [
    ['Aug1+', winAug],
    ['Jul15+', winJul],
    ['Jun15+', winJun],
  ];

  out(`Universe sizes: Aug ${fmt(agg(winAug))} · Jul15+ ${fmt(agg(winJul))} · Jun15+ ${fmt(agg(winJun))}`);
  out('');

  // W vs L continuous feature table (Aug)
  const wins = winAug.filter((r) => r.won);
  const losses = winAug.filter((r) => !r.won);
  out('### 2a. August 4u+ — continuous stamp features (W vs L)');
  out('| Feature | W mean | W med | L mean | L med | Δmean |');
  out('|---------|-------:|------:|-------:|------:|------:|');
  const contFeats = [
    ['EDGE', (r) => r.edge],
    ['meanFor', (r) => r.meanFor],
    ['meanAg', (r) => r.meanAg],
    ['topFor', (r) => r.topFor],
    ['forN', (r) => r.forN],
    ['agN', (r) => r.agN],
    ['tapeScore', (r) => r.tapeScore],
    ['netMeanPrior', (r) => r.netMeanPrior],
    ['qConv', (r) => r.qConv],
    ['maxSR', (r) => r.maxSR],
    ['leadSR', (r) => r.leadSR],
    ['leadRoiNorm', (r) => r.leadRoiNorm],
    ['sumSR', (r) => r.sumSR],
    ['forWalletN', (r) => r.forWalletN],
    ['units', (r) => r.units],
    ['odds', (r) => r.odds],
    ['ticketEvPct', (r) => r.ticketEvPct],
    ['steamLastHour', (r) => r.steamLastHour],
    ['steamSinceOpen', (r) => r.steamSinceOpen],
    ['blendWr', (r) => r.blendWr],
    ['expWin', (r) => r.expWin],
    ['forTop2Pct', (r) => r.forTop2Pct],
    ['agsV12', (r) => r.agsV12],
    ['deltaQuality', (r) => r.deltaQuality],
    ['walletPlayScore', (r) => r.walletPlayScore],
    ['hcMargin', (r) => r.hcMargin],
  ];
  for (const [name, fn] of contFeats) {
    const wv = wins.map(fn).filter(Number.isFinite);
    const lv = losses.map(fn).filter(Number.isFinite);
    if (wv.length < 5 && lv.length < 3) continue;
    const wm = mean(wv); const lm = mean(lv);
    const d = (wm ?? 0) - (lm ?? 0);
    const mark = Math.abs(d) >= 3 || (name.includes('SR') && Math.abs(d) >= 0.25) ? '◆' : ' ';
    out(`| ${mark} ${name} | ${wm?.toFixed(2) ?? '—'} | ${med(wv)?.toFixed(2) ?? '—'} | ${lm?.toFixed(2) ?? '—'} | ${med(lv)?.toFixed(2) ?? '—'} | ${d >= 0 ? '+' : ''}${d.toFixed(2)} |`);
  }
  out('');

  // Rank all unary + sweeps on August
  out('### 2b. Automated CUT ranking on August 4u+');
  const unary = buildCandidateRules().map((r) => {
    const ev = evalCut(winAug, r.fn);
    return ev ? { ...r, ev, score: scoreRule(ev) } : null;
  }).filter(Boolean);

  const sweeps = continuousSweeps(winAug);
  const allRules = [...unary, ...sweeps]
    .filter((r) => r.ev.deltaPnl > 0)
    .sort((a, b) => b.score - a.score || b.ev.deltaPnl - a.ev.deltaPnl);

  // Dedup by name
  const seen = new Set();
  const ranked = [];
  for (const r of allRules) {
    if (seen.has(r.name)) continue;
    seen.add(r.name);
    ranked.push(r);
  }

  out('| Rank | Rule (CUT if…) | Cut n/W–L/ROI/PnL | Keep ROI | ΔPnL |');
  out('|-----:|----------------|-------------------|---------:|-----:|');
  ranked.slice(0, 40).forEach((r, i) => {
    const e = r.ev;
    out(`| ${i + 1} | ${r.name} | ${e.cutN} ${e.cutW}–${e.cutL} ${e.cutRoi >= 0 ? '+' : ''}${e.cutRoi.toFixed(0)}% ${e.cutPnl >= 0 ? '+' : ''}${e.cutPnl.toFixed(1)}u | ${e.keepRoi >= 0 ? '+' : ''}${e.keepRoi.toFixed(1)}% | +${e.deltaPnl.toFixed(1)}u |`);
  });
  out('');

  // Pairwise on top unary by Aug ΔPnL
  const topUnary = unary
    .filter((r) => r.ev.deltaPnl > 2 && r.ev.cutN >= 3)
    .sort((a, b) => b.ev.deltaPnl - a.ev.deltaPnl)
    .slice(0, 16);
  const pairs = pairwiseAnd(topUnary, winAug)
    .filter((r) => r.ev.deltaPnl > 0)
    .sort((a, b) => b.ev.deltaPnl - a.ev.deltaPnl);

  out('### 2c. Top pairwise AND cuts (August)');
  out('| Rule | Cut | Keep ROI | ΔPnL |');
  out('|------|-----|---------:|-----:|');
  for (const r of pairs.slice(0, 25)) {
    const e = r.ev;
    out(`| ${r.name} | ${e.cutN} ${e.cutW}–${e.cutL} ${e.cutRoi >= 0 ? '+' : ''}${e.cutRoi.toFixed(0)}% ${e.cutPnl >= 0 ? '+' : ''}${e.cutPnl.toFixed(1)}u | ${e.keepRoi >= 0 ? '+' : ''}${e.keepRoi.toFixed(1)}% | +${e.deltaPnl.toFixed(1)}u |`);
  }
  out('');

  // Stability across windows for top candidates
  out('### 2d. Stability across windows (helps ≥2 eras)');
  const candidates = [];
  const pool = [...ranked.slice(0, 30), ...pairs.slice(0, 15)];
  const seen2 = new Set();
  for (const r of pool) {
    if (seen2.has(r.name)) continue;
    seen2.add(r.name);
    const st = stabilityCheck(r, windows);
    candidates.push({ ...r, st });
  }
  candidates.sort((a, b) => b.st.okCount - a.st.okCount || b.ev.deltaPnl - a.ev.deltaPnl);

  out('| Rule | Stable | Aug Δ | Jul15 Δ | Jun15 Δ |');
  out('|------|:------:|------:|--------:|--------:|');
  for (const r of candidates.filter((c) => c.st.okCount >= 2).slice(0, 25)) {
    const m = Object.fromEntries(r.st.marks.map((x) => [x.label, x]));
    const cell = (lab) => {
      const x = m[lab];
      if (!x || x.deltaPnl == null) return '—';
      return `${x.ok ? '✓' : '✗'}${x.deltaPnl >= 0 ? '+' : ''}${x.deltaPnl.toFixed(0)}u`;
    };
    out(`| ${r.name} | ${r.st.okCount}/3 | ${cell('Aug1+')} | ${cell('Jul15+')} | ${cell('Jun15+')} |`);
  }
  out('');

  // Within-path separators (non-TOP and TOP)
  out('### 2e. Within-path deep splits (August 4u+)');
  const paths = [...new Set(winAug.map((r) => r.path))];
  for (const p of paths.sort()) {
    const rs = winAug.filter((r) => r.path === p);
    if (rs.length < 6) continue;
    const base = agg(rs);
    out(`#### ${p} — base ${fmt(base)}`);
    const localRules = buildCandidateRules()
      .filter((r) => !r.name.startsWith(p) && r.name !== p && !r.name.includes('TOP/TOP+'))
      .map((r) => {
        const ev = evalCut(rs, r.fn);
        return ev && ev.cutN >= 2 && ev.keepN >= 3 && ev.deltaPnl > 0
          ? { ...r, ev, score: scoreRule(ev) }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.ev.deltaPnl - a.ev.deltaPnl)
      .slice(0, 8);
    if (!localRules.length) {
      out('_No cut with ΔPnL>0 and min n._');
      out('');
      continue;
    }
    out('| Local CUT | Cut | Keep ROI | ΔPnL |');
    out('|-----------|-----|---------:|-----:|');
    for (const r of localRules) {
      const e = r.ev;
      out(`| ${r.name} | ${e.cutN} ${e.cutW}–${e.cutL} ${e.cutRoi >= 0 ? '+' : ''}${e.cutRoi.toFixed(0)}% ${e.cutPnl >= 0 ? '+' : ''}${e.cutPnl.toFixed(1)}u | ${e.keepRoi >= 0 ? '+' : ''}${e.keepRoi.toFixed(1)}% | +${e.deltaPnl.toFixed(1)}u |`);
    }
    out('');
  }

  // Playbook stacks from stable rules
  out('### 2f. Recommended playbooks (stack stable cuts)');
  const stable = candidates.filter((c) => c.st.okCount >= 2 && c.ev.cutN >= 4);
  // Greedy: pick non-overlapping-ish high Δ rules
  const playbooks = [
    {
      name: 'P0. Known TOP inside-cut only (leadSR≥3 OR EDGE<10)',
      keep: (r) => !(r.isTop && ((r.leadSR != null && r.leadSR >= 3) || (r.edge != null && r.edge < 10))),
    },
    {
      name: 'P1. TOP inside-cut + BOOST×EDGE≥25',
      keep: (r) => {
        if (r.isTop && ((r.leadSR != null && r.leadSR >= 3) || (r.edge != null && r.edge < 10))) return false;
        if (r.tapeAction === 'BOOST' && r.edge != null && r.edge >= 25) return false;
        return true;
      },
    },
    {
      name: 'P2. TOP inside-cut + units≥5.4×EDGE≥25',
      keep: (r) => {
        if (r.isTop && ((r.leadSR != null && r.leadSR >= 3) || (r.edge != null && r.edge < 10))) return false;
        if (r.units >= 5.4 && r.edge != null && r.edge >= 25) return false;
        return true;
      },
    },
    {
      name: 'P3. Cut TOP entire path (baseline — do NOT ship)',
      keep: (r) => !r.isTop,
    },
    {
      name: 'P4. Cut maxSR≥3 on all 4u+ (global whale)',
      keep: (r) => !(r.maxSR != null && r.maxSR >= 3),
    },
    {
      name: 'P5. Cut leadSR≥3 on all 4u+',
      keep: (r) => !(r.leadSR != null && r.leadSR >= 3),
    },
    {
      name: 'P6. Cut EDGE≥25 on BOOST/5.4u+ only',
      keep: (r) => !(r.units >= 5.4 && r.edge != null && r.edge >= 25),
    },
    {
      name: 'P7. Cut dog × units≥5.4',
      keep: (r) => !(r.dog && r.units >= 5.4),
    },
    {
      name: 'P8. Cut WNBA 4u+',
      keep: (r) => r.sport !== 'WNBA',
    },
    {
      name: 'P9. Cut ticketEv<0 (if stamped)',
      keep: (r) => !(r.ticketEvPct != null && r.ticketEvPct < 0),
    },
    {
      name: 'P10. Cut steam lastHour<0 (if stamped)',
      keep: (r) => !(r.steamLastHour != null && r.steamLastHour < 0),
    },
  ];

  // Auto-add top stable unary as playbook
  for (const [i, r] of stable.slice(0, 5).entries()) {
    playbooks.push({
      name: `S${i}. Auto-stable: CUT ${r.name}`,
      keep: (x) => !r.fn(x),
    });
  }

  out('| Playbook | Aug keep | Aug ΔPnL | Jul15 Δ | Jun15 Δ |');
  out('|----------|----------|---------:|--------:|--------:|');
  for (const pb of playbooks) {
    const cells = [];
    let augDelta = null;
    let augKeep = '—';
    for (const [lab, rows] of windows) {
      const keepRows = rows.filter(pb.keep);
      const base = agg(rows);
      const k = agg(keepRows);
      const d = k.pnl - base.pnl;
      if (lab === 'Aug1+') {
        augDelta = d;
        augKeep = k.n ? `${k.n} ${k.w}–${k.l} ROI ${k.roi >= 0 ? '+' : ''}${k.roi.toFixed(0)}%` : 'n=0';
      }
      cells.push(`${d >= 0 ? '+' : ''}${d.toFixed(1)}u`);
    }
    out(`| ${pb.name} | ${augKeep} | ${augDelta >= 0 ? '+' : ''}${augDelta?.toFixed(1)}u | ${cells[1]} | ${cells[2]} |`);
  }
  out('');

  // Non-TOP residual hunt (after removing TOP bleed conceptually)
  out('### 2g. Non-TOP 4u+ only — residual losers');
  const nonTopAug = winAug.filter((r) => !r.isTop);
  out(`Base without TOP: **${fmt(agg(nonTopAug))}**`);
  out('');
  const nonTopRules = [...buildCandidateRules(), ...continuousSweeps(nonTopAug)]
    .map((r) => {
      const ev = evalCut(nonTopAug, r.fn);
      return ev && ev.deltaPnl > 1 && ev.cutN >= 3 ? { ...r, ev, score: scoreRule(ev) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.ev.deltaPnl - a.ev.deltaPnl);

  const ntSeen = new Set();
  out('| Rule on non-TOP | Cut | Keep ROI | ΔPnL |');
  out('|-----------------|-----|---------:|-----:|');
  let shown = 0;
  for (const r of nonTopRules) {
    if (ntSeen.has(r.name)) continue;
    ntSeen.add(r.name);
    const e = r.ev;
    out(`| ${r.name} | ${e.cutN} ${e.cutW}–${e.cutL} ${e.cutRoi >= 0 ? '+' : ''}${e.cutRoi.toFixed(0)}% ${e.cutPnl >= 0 ? '+' : ''}${e.cutPnl.toFixed(1)}u | ${e.keepRoi >= 0 ? '+' : ''}${e.keepRoi.toFixed(1)}% | +${e.deltaPnl.toFixed(1)}u |`);
    if (++shown >= 25) break;
  }
  out('');

  // Synthesis
  out('## 3. Synthesis — how to separate 4u+ W/L');
  out('');
  out('### Layer A — already known / high confidence');
  out('1. **Inside-TOP:** CUT if `leadSR ≥ 3 OR EDGE < 10` (stable Jun15+/Jul15+/Aug).');
  out('2. Do **not** blunt-extend sub-4 maxSR&lt;1 mute to 4u+ (opposite sign).');
  out('');
  out('### Layer B — August signals to validate (see rankings above)');
  const top5 = ranked.slice(0, 8).map((r) => r.name);
  out(`Top Aug ΔPnL cuts: ${top5.join('; ')}`);
  out('');
  out('### Layer C — non-TOP residual');
  out('If TOP inside-cut is applied, remaining bleed is often **oversize BOOST / extreme EDGE / sport pockets** — see 2g.');
  out('');
  out('### What did NOT separate cleanly');
  out('- FOOLS leak into live 4u+ (n≈0)');
  out('- FAIL_OPEN on 4u+ (often empty / not the infection)');
  out('- maxSR&lt;1 on 4u+ (wins — do not cut)');
  out('');

  const mdPath = join(REPO_ROOT, 'tmp_sub4_health_4u_deep.md');
  const artPath = '/opt/cursor/artifacts/tmp_sub4_health_4u_deep.md';
  const md = lines.join('\n');
  writeFileSync(mdPath, md);
  writeFileSync(artPath, md);

  // JSON for follow-up
  const json = {
    sub4: {
      preMute,
      postFlinch,
      postMax,
      days: subDays,
      rolling7: roll,
    },
    plus4Aug: agg(winAug),
    topCutsAug: ranked.slice(0, 40).map((r) => ({
      name: r.name,
      cutN: r.ev.cutN,
      cutRoi: r.ev.cutRoi,
      cutPnl: r.ev.cutPnl,
      keepRoi: r.ev.keepRoi,
      deltaPnl: r.ev.deltaPnl,
    })),
    stable: candidates.filter((c) => c.st.okCount >= 2).slice(0, 25).map((r) => ({
      name: r.name,
      okCount: r.st.okCount,
      marks: r.st.marks,
      augDelta: r.ev.deltaPnl,
    })),
  };
  writeFileSync(join(REPO_ROOT, 'tmp_sub4_health_4u_deep.json'), JSON.stringify(json, null, 2));
  writeFileSync('/opt/cursor/artifacts/tmp_sub4_health_4u_deep.json', JSON.stringify(json, null, 2));
  console.error(`Wrote ${mdPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
