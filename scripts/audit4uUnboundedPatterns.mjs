#!/usr/bin/env node
/**
 * UNBOUNDED 4u+ pattern discovery — residual-first, surface-search,
 * era-holdout, noise-floor calibrated. Stamp-safe only.
 *
 * Universes:
 *   U_all     = all 4u+ Jun15+
 *   U_res     = after removing known Tier-A TOP cut (leadSR≥3 OR EDGE<10)
 *   U_top     = TOP/TOP+ only
 *   U_nontop  = non-TOP only
 *   U_mlb     = MLB 4u+
 *   U_ev      = ticketEv stamped (Aug20+)
 *
 * Validation:
 *   - Label-permutation noise floor (ΔPnL distribution)
 *   - Leave-one-era-out: rule must help on ≥2 eras with coverage
 *   - Coverage gates for late stamps
 *
 * Usage: node scripts/audit4uUnboundedPatterns.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';
import { HC_RATIO } from '../src/lib/ags.js';
import { maxForSizeRatio } from '../src/lib/walletClvSkill.js';

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

const ERAS = [
  { id: 'E0', from: '2026-06-15', to: '2026-07-11' },
  { id: 'E2', from: '2026-07-15', to: '2026-07-21' }, // merge thin E2+E3
  { id: 'E4', from: '2026-07-22', to: '2026-08-02' },
  { id: 'E5', from: '2026-08-03', to: '2026-08-15' }, // merge E5+E6
  { id: 'E7', from: '2026-08-16', to: '2026-08-18' },
  { id: 'E8', from: '2026-08-19', to: '2026-08-25' },
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
function eraId(date) {
  for (const e of ERAS) {
    if (date >= e.from && date <= e.to) return e.id;
  }
  return 'EX';
}
function dow(date) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 Sun
}
function shortId(w) {
  const s = w?.walletShort || w?.wallet || '';
  return String(s).slice(0, 10);
}

function tierATopCut(r) {
  if (!r.isTop) return false;
  return (r.leadSR != null && r.leadSR >= 3) || (r.edge != null && r.edge < 10);
}

async function load(firestore) {
  const rows = [];
  const dayCounts = new Map(); // slate density
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
        if (!(units >= 4)) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const forWd = wd.filter((w) => String(w.side) === String(sideKey)
          && (w.direction == null || String(w.direction).toUpperCase() === 'FOR'));
        const agWd = wd.filter((w) => String(w.side) !== String(sideKey)
          || (w.direction && String(w.direction).toUpperCase() === 'AGAINST'));
        const hcLeads = forWd
          .filter((w) => Number(w.sizeRatio) >= HC_RATIO)
          .sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio)
            || Number(b.invested || 0) - Number(a.invested || 0));
        const lead = hcLeads[0] || forWd.slice().sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio))[0] || null;
        const scoring = peak.v8Scoring || {};
        const path = pathOf(sd);
        const forIds = forWd.map(shortId).filter(Boolean);
        const maxSR = maxForSizeRatio(wd, sideKey);
        const leadSR = lead ? num(lead.sizeRatio) : null;
        const edge = num(sd.v8_winnerAlignEdge);
        const isTop = path === 'TOP' || path === 'TOP+';

        // Derived geometry humans rarely check
        const meanFor = num(sd.v8_winnerAlignMeanFor);
        const meanAg = num(sd.v8_winnerAlignMeanAg);
        const topFor = num(sd.v8_winnerAlignTopFor);
        const topAg = num(sd.v8_winnerAlignTopAg);
        const forN = num(sd.v8_winnerAlignForN);
        const agN = num(sd.v8_winnerAlignAgN);
        const edgeGap = (meanFor != null && meanAg != null) ? meanFor - meanAg : null;
        const topGap = (topFor != null && topAg != null) ? topFor - topAg : null;
        const srSpread = (() => {
          const srs = forWd.map((w) => Number(w.sizeRatio)).filter(Number.isFinite);
          if (srs.length < 2) return null;
          return Math.max(...srs) - Math.min(...srs);
        })();
        const leadShare = (() => {
          const invs = forWd.map((w) => Number(w.invested)).filter(Number.isFinite);
          const sum = invs.reduce((a, b) => a + b, 0);
          const li = lead ? num(lead.invested) : null;
          if (!(sum > 0) || li == null) return null;
          return li / sum;
        })();
        const forRoiNormMean = (() => {
          const xs = forWd.map((w) => Number(w.roiNorm)).filter(Number.isFinite);
          return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
        })();
        const forPnlNormSum = (() => {
          const xs = forWd.map((w) => Number(w.pnlNorm)).filter(Number.isFinite);
          return xs.length ? xs.reduce((a, b) => a + b, 0) : null;
        })();
        const implied = odds < 0
          ? Math.abs(odds) / (Math.abs(odds) + 100)
          : odds > 0 ? 100 / (odds + 100) : null;
        const ticketEv = num(sd.v8_ticketEvPct);
        const blendWr = num(sd.v8_blendWr);
        const expWin = num(sd.v8_expWin);
        const calibGap = (blendWr != null && implied != null) ? blendWr - 100 * implied : null;
        const expGap = (expWin != null && implied != null) ? expWin - 100 * implied : null;
        const edgePerUnit = (edge != null && units > 0) ? edge / units : null;
        const steamLH = num(sd.v8_steamLastHourPct ?? sd.v8_steam?.lastHourPct);
        const steamSO = num(sd.v8_steamSinceOpenPct ?? sd.v8_steam?.sinceOpenPct);
        const steamDiv = (steamLH != null && steamSO != null) ? steamSO - steamLH : null;

        rows.push({
          id: `${docSnap.id}:${sideKey}`,
          date,
          era: eraId(date),
          dow: dow(date),
          sport: data.sport || 'UNK',
          mkt,
          path,
          units,
          odds,
          won,
          profit: profitOf(units, odds, won),
          isTop,
          tierA: tierATopCut({ isTop, leadSR, edge }),
          edge,
          meanFor,
          meanAg,
          topFor,
          topAg,
          forN,
          agN,
          edgeGap,
          topGap,
          hasBoth: sd.v8_winnerAlignHasBoth === true || (forN > 0 && agN > 0),
          fadeTop: sd.v8_winnerAlignFadeTop60 === true,
          tapeAction: String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || null,
          tapeScore: num(sd.v8_tapeScore),
          netMeanPrior: num(sd.v8_netMeanPrior),
          edgeNetBucket: sd.v8_edgeNetBucket || null,
          edgeBand: sd.v8_edgeBand || null,
          qConv: num(sd.v8_qConv),
          maxSR,
          leadSR,
          leadN: hcLeads.length,
          leadInvested: lead ? num(lead.invested) : null,
          leadRoi: lead ? num(lead.roi) : null,
          leadRoiNorm: lead ? num(lead.roiNorm) : null,
          leadPnlNorm: lead ? num(lead.pnlNorm) : null,
          leadContrib: lead ? num(lead.contribution) : null,
          leadWallet: lead ? shortId(lead) : null,
          forWalletN: forWd.length,
          agWalletN: agWd.length,
          sumSR: forWd.reduce((s, w) => s + (Number.isFinite(Number(w.sizeRatio)) ? Number(w.sizeRatio) : 0), 0),
          srSpread,
          leadShare,
          forRoiNormMean,
          forPnlNormSum,
          forIds,
          forIdKey: forIds.slice().sort().join('|') || '—',
          implied: implied != null ? 100 * implied : null,
          ticketEv,
          blendWr,
          expWin,
          calibGap,
          expGap,
          edgePerUnit,
          steamLH,
          steamSO,
          steamDiv,
          hcMargin: num(sd.v8_hcMargin),
          qualityFor: num(scoring.qualityForT30),
          deltaQuality: num(scoring.deltaQuality),
          walletPlayScore: num(scoring.walletPlayScore),
          topShare: num(scoring.topShare),
          forTop2Pct: num(sd.v8_forTop2PctPos),
          agsV12: num(sd.v8_agsV12 ?? sd.v8_skillAgsV12),
          bestForTier: sd.v8_bestForTier || null,
          dog: odds > 0,
          chalk200: odds <= -200,
          boostBand: units >= 5.4,
          mega: units >= 6,
        });
        dayCounts.set(date, (dayCounts.get(date) || 0) + 1);
      }
    }
  }
  for (const r of rows) r.slateN = dayCounts.get(r.date) || 1;
  return rows;
}

function evalCut(rows, fn) {
  const cut = []; const keep = [];
  for (const r of rows) (fn(r) ? cut : keep).push(r);
  const c = agg(cut); const k = agg(keep); const b = agg(rows);
  if (c.n < 2 || k.n < 3) return null;
  return {
    cutN: c.n, cutW: c.w, cutL: c.l, cutRoi: c.roi, cutPnl: c.pnl, cutWr: c.wr,
    keepN: k.n, keepRoi: k.roi, keepPnl: k.pnl, keepWr: k.wr,
    deltaPnl: k.pnl - b.pnl,
    baseRoi: b.roi,
    liftRoi: (k.roi ?? 0) - (b.roi ?? 0),
    cutFrac: c.n / (c.n + k.n),
  };
}

function noiseFloor(rows, nPerm = 80) {
  // Permute won labels, keep units/odds; measure ΔPnL of random half-cuts
  const deltas = [];
  for (let i = 0; i < nPerm; i++) {
    const labels = rows.map((r) => r.won);
    for (let j = labels.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [labels[j], labels[k]] = [labels[k], labels[j]];
    }
    const shuffled = rows.map((r, idx) => ({ ...r, won: labels[idx], profit: profitOf(r.units, r.odds, labels[idx]) }));
    // random cut ~20% of tickets
    const ev = evalCut(shuffled, (r) => {
      // deterministic-ish from id hash
      let h = 0;
      for (const ch of r.id) h = (h * 31 + ch.charCodeAt(0) + i) | 0;
      return (Math.abs(h) % 100) < 20;
    });
    if (ev) deltas.push(ev.deltaPnl);
  }
  deltas.sort((a, b) => a - b);
  const p95 = deltas[Math.floor(deltas.length * 0.95)] ?? 0;
  const p99 = deltas[Math.floor(deltas.length * 0.99)] ?? 0;
  const mean = deltas.reduce((a, b) => a + b, 0) / (deltas.length || 1);
  return { mean, p95, p99, n: deltas.length };
}

function eraStability(rows, fn) {
  const marks = [];
  for (const e of ERAS) {
    const rs = rows.filter((r) => r.era === e.id);
    if (rs.length < 6) {
      marks.push({ id: e.id, ok: null, n: rs.length });
      continue;
    }
    const ev = evalCut(rs, fn);
    if (!ev || ev.cutN < 2) {
      marks.push({ id: e.id, ok: null, n: rs.length });
      continue;
    }
    const ok = ev.deltaPnl > 0 && (ev.cutRoi ?? 0) < (ev.keepRoi ?? 0);
    marks.push({
      id: e.id, ok, deltaPnl: ev.deltaPnl, cutRoi: ev.cutRoi, keepRoi: ev.keepRoi, cutN: ev.cutN,
    });
  }
  const tested = marks.filter((m) => m.ok != null);
  const passed = tested.filter((m) => m.ok);
  return {
    marks,
    tested: tested.length,
    passed: passed.length,
    stable: passed.length >= 2 && passed.length >= Math.ceil(tested.length * 0.5),
  };
}

// ── Feature surfaces ────────────────────────────────────────────────────
function thresholdCandidates(rows, getter, maxK = 8) {
  const vals = rows.map(getter).filter(Number.isFinite).sort((a, b) => a - b);
  if (vals.length < 10) return [];
  const qs = [0.15, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85];
  const out = [];
  for (const q of qs) {
    const v = vals[Math.floor(q * (vals.length - 1))];
    if (!out.includes(v)) out.push(v);
  }
  return out.slice(0, maxK);
}

function surface1D(rows, name, getter) {
  const results = [];
  for (const t of thresholdCandidates(rows, getter)) {
    for (const dir of ['lt', 'gte']) {
      const fn = dir === 'lt'
        ? (r) => { const v = getter(r); return v != null && v < t; }
        : (r) => { const v = getter(r); return v != null && v >= t; };
      const ev = evalCut(rows, fn);
      if (!ev || ev.deltaPnl <= 0) continue;
      results.push({
        name: `${name} ${dir === 'lt' ? '<' : '≥'} ${typeof t === 'number' ? +t.toFixed(3) : t}`,
        fn, ev,
      });
    }
  }
  return results;
}

function surface2D(rows, nameA, getA, nameB, getB, maxOut = 40) {
  const tA = thresholdCandidates(rows, getA, 5);
  const tB = thresholdCandidates(rows, getB, 5);
  const out = [];
  for (const a of tA) {
    for (const b of tB) {
      for (const da of ['lt', 'gte']) {
        for (const db of ['lt', 'gte']) {
          const fn = (r) => {
            const va = getA(r); const vb = getB(r);
            if (va == null || vb == null) return false;
            const oka = da === 'lt' ? va < a : va >= a;
            const okb = db === 'lt' ? vb < b : vb >= b;
            return oka && okb;
          };
          const ev = evalCut(rows, fn);
          if (!ev || ev.deltaPnl <= 2 || ev.cutN < 3) continue;
          out.push({
            name: `(${nameA}${da === 'lt' ? '<' : '≥'}${+a.toFixed(2)})∧(${nameB}${db === 'lt' ? '<' : '≥'}${+b.toFixed(2)})`,
            fn, ev,
          });
        }
      }
    }
  }
  return out.sort((x, y) => y.ev.deltaPnl - x.ev.deltaPnl).slice(0, maxOut);
}

function categoricalCuts(rows) {
  const rules = [];
  const add = (name, fn) => rules.push({ name, fn });
  add('TOP/TOP+', (r) => r.isTop);
  add('TOP+', (r) => r.path === 'TOP+');
  add('path SHARP', (r) => r.path === 'SHARP');
  add('path SHARP-LEAN', (r) => r.path === 'SHARP-LEAN');
  add('path RANK', (r) => r.path === 'RANK');
  add('path MINI', (r) => r.path === 'MINI' || r.path === 'MINI-');
  add('tape BOOST', (r) => r.tapeAction === 'BOOST');
  add('tape HOLD', (r) => r.tapeAction === 'HOLD');
  add('tape FAIL_OPEN', (r) => r.tapeAction === 'FAIL_OPEN');
  add('edgeNet NEITHER', (r) => r.edgeNetBucket === 'NEITHER');
  add('edgeNet BOTH', (r) => r.edgeNetBucket === 'BOTH');
  add('hasBoth', (r) => r.hasBoth);
  add('!hasBoth', (r) => !r.hasBoth);
  add('MLB', (r) => r.sport === 'MLB');
  add('WNBA', (r) => r.sport === 'WNBA');
  add('UFC', (r) => r.sport === 'UFC');
  add('NFL', (r) => r.sport === 'NFL');
  add('TOTAL', (r) => r.mkt === 'TOTAL');
  add('SPREAD', (r) => r.mkt === 'SPREAD');
  add('dog', (r) => r.dog);
  add('chalk≤-200', (r) => r.chalk200);
  add('boostBand ≥5.4u', (r) => r.boostBand);
  add('mega ≥6u', (r) => r.mega);
  add('dow Sat/Sun', (r) => r.dow === 0 || r.dow === 6);
  add('dow Mon', (r) => r.dow === 1);
  add('slateN ≥ 6', (r) => r.slateN >= 6);
  add('slateN ≥ 8', (r) => r.slateN >= 8);
  add('slateN ≤ 2', (r) => r.slateN <= 2);
  add('hcMargin=1', (r) => r.hcMargin === 1);
  add('leadN=0', (r) => r.leadN === 0);
  add('leadN≥2', (r) => r.leadN >= 2);
  add('forWalletN=1', (r) => r.forWalletN === 1);
  add('forWalletN≥3', (r) => r.forWalletN >= 3);
  add('bestFor FLAT', (r) => r.bestForTier === 'FLAT');
  add('TierA TOP cut', (r) => r.tierA);
  // Geometric
  add('TOP ∧ MLB', (r) => r.isTop && r.sport === 'MLB');
  add('TOP ∧ boostBand', (r) => r.isTop && r.boostBand);
  add('TOP ∧ dog', (r) => r.isTop && r.dog);
  add('TOP ∧ hasBoth', (r) => r.isTop && r.hasBoth);
  add('TOP ∧ net<0', (r) => r.isTop && r.netMeanPrior != null && r.netMeanPrior < 0);
  add('TOP ∧ leadSR≥3', (r) => r.isTop && r.leadSR != null && r.leadSR >= 3);
  add('TOP ∧ EDGE<10', (r) => r.isTop && r.edge != null && r.edge < 10);
  add('TOP ∧ (leadSR≥3∨EDGE<10)', (r) => r.tierA);
  add('MLB ∧ boostBand ∧ EDGE≥25', (r) => r.sport === 'MLB' && r.boostBand && r.edge != null && r.edge >= 25);
  add('MLB ∧ TOP ∧ leadSR≥3', (r) => r.sport === 'MLB' && r.isTop && r.leadSR != null && r.leadSR >= 3);
  add('SHARP ∧ EDGE≥25 ∧ boostBand', (r) => r.path === 'SHARP' && r.edge != null && r.edge >= 25 && r.boostBand);
  add('SHARP ∧ ticketEv<-1', (r) => r.path === 'SHARP' && r.ticketEv != null && r.ticketEv < -1);
  add('boostBand ∧ ticketEv<-1', (r) => r.boostBand && r.ticketEv != null && r.ticketEv < -1);
  add('boostBand ∧ calibGap<0', (r) => r.boostBand && r.calibGap != null && r.calibGap < 0);
  add('leadShare≥0.85', (r) => r.leadShare != null && r.leadShare >= 0.85);
  add('leadShare≥0.95', (r) => r.leadShare != null && r.leadShare >= 0.95);
  add('srSpread≥2', (r) => r.srSpread != null && r.srSpread >= 2);
  add('edgeGap<10', (r) => r.edgeGap != null && r.edgeGap < 10);
  add('edgePerUnit≥5', (r) => r.edgePerUnit != null && r.edgePerUnit >= 5);
  add('steamDiv≥3', (r) => r.steamDiv != null && r.steamDiv >= 3);
  add('steamDiv≥5', (r) => r.steamDiv != null && r.steamDiv >= 5);
  add('forRoiNormMean<0', (r) => r.forRoiNormMean != null && r.forRoiNormMean < 0);
  add('leadRoiNorm<0', (r) => r.leadRoiNorm != null && r.leadRoiNorm < 0);
  add('ticketEv<-1', (r) => r.ticketEv != null && r.ticketEv < -1);
  add('ticketEv<0', (r) => r.ticketEv != null && r.ticketEv < 0);
  add('expGap<0', (r) => r.expGap != null && r.expGap < 0);
  add('calibGap<-5', (r) => r.calibGap != null && r.calibGap < -5);
  return rules;
}

const CONT = [
  ['EDGE', (r) => r.edge],
  ['meanFor', (r) => r.meanFor],
  ['edgeGap', (r) => r.edgeGap],
  ['topGap', (r) => r.topGap],
  ['maxSR', (r) => r.maxSR],
  ['leadSR', (r) => r.leadSR],
  ['leadShare', (r) => r.leadShare],
  ['srSpread', (r) => r.srSpread],
  ['netMeanPrior', (r) => r.netMeanPrior],
  ['qConv', (r) => r.qConv],
  ['tapeScore', (r) => r.tapeScore],
  ['units', (r) => r.units],
  ['odds', (r) => r.odds],
  ['ticketEv', (r) => r.ticketEv],
  ['calibGap', (r) => r.calibGap],
  ['expGap', (r) => r.expGap],
  ['edgePerUnit', (r) => r.edgePerUnit],
  ['steamDiv', (r) => r.steamDiv],
  ['steamSO', (r) => r.steamSO],
  ['forRoiNormMean', (r) => r.forRoiNormMean],
  ['leadRoiNorm', (r) => r.leadRoiNorm],
  ['forPnlNormSum', (r) => r.forPnlNormSum],
  ['forTop2Pct', (r) => r.forTop2Pct],
  ['slateN', (r) => r.slateN],
  ['sumSR', (r) => r.sumSR],
  ['implied', (r) => r.implied],
];

function huntUniverse(label, rows, noise) {
  const cat = categoricalCuts(rows).map((r) => {
    const ev = evalCut(rows, r.fn);
    return ev && ev.deltaPnl > 0 ? { ...r, ev } : null;
  }).filter(Boolean);

  const oneD = [];
  for (const [name, get] of CONT) {
    oneD.push(...surface1D(rows, name, get));
  }

  // Priority 2D surfaces (non-obvious pairs)
  const pairs = [
    ['EDGE', (r) => r.edge, 'leadSR', (r) => r.leadSR],
    ['EDGE', (r) => r.edge, 'units', (r) => r.units],
    ['EDGE', (r) => r.edge, 'odds', (r) => r.odds],
    ['leadSR', (r) => r.leadSR, 'units', (r) => r.units],
    ['leadShare', (r) => r.leadShare, 'EDGE', (r) => r.edge],
    ['netMeanPrior', (r) => r.netMeanPrior, 'EDGE', (r) => r.edge],
    ['edgeGap', (r) => r.edgeGap, 'leadSR', (r) => r.leadSR],
    ['ticketEv', (r) => r.ticketEv, 'units', (r) => r.units],
    ['ticketEv', (r) => r.ticketEv, 'EDGE', (r) => r.edge],
    ['calibGap', (r) => r.calibGap, 'units', (r) => r.units],
    ['steamDiv', (r) => r.steamDiv, 'ticketEv', (r) => r.ticketEv],
    ['meanFor', (r) => r.meanFor, 'odds', (r) => r.odds],
    ['qConv', (r) => r.qConv, 'leadSR', (r) => r.leadSR],
    ['forRoiNormMean', (r) => r.forRoiNormMean, 'leadSR', (r) => r.leadSR],
    ['slateN', (r) => r.slateN, 'units', (r) => r.units],
    ['edgePerUnit', (r) => r.edgePerUnit, 'leadSR', (r) => r.leadSR],
  ];
  const twoD = [];
  for (const [na, ga, nb, gb] of pairs) {
    twoD.push(...surface2D(rows, na, ga, nb, gb, 12));
  }

  const all = [...cat, ...oneD, ...twoD];
  // Score: ΔPnL above noise, cut ROI bad, keep lift, not tiny
  const scored = all.map((r) => {
    const aboveNoise = r.ev.deltaPnl - noise.p95;
    const score = r.ev.deltaPnl
      + (r.ev.cutRoi < -10 ? 5 : 0)
      + (r.ev.liftRoi > 3 ? 3 : 0)
      + (aboveNoise > 0 ? 10 : -5)
      + (r.ev.cutN >= 5 ? 2 : 0)
      - (r.ev.cutFrac > 0.55 ? 8 : 0); // don't cut majority of book casually
    const st = eraStability(rows, r.fn);
    return { ...r, score, aboveNoise, st };
  }).sort((a, b) => b.score - a.score || b.ev.deltaPnl - a.ev.deltaPnl);

  // Dedup names
  const seen = new Set();
  const ranked = [];
  for (const r of scored) {
    if (seen.has(r.name)) continue;
    seen.add(r.name);
    ranked.push(r);
  }
  return { label, n: rows.length, base: agg(rows), noise, ranked };
}

function greedyStack(rows, candidates, maxRules = 4) {
  let remaining = rows.slice();
  const picked = [];
  const pool = candidates.slice(0, 40);
  for (let k = 0; k < maxRules; k++) {
    let best = null;
    for (const c of pool) {
      if (picked.some((p) => p.name === c.name)) continue;
      const ev = evalCut(remaining, c.fn);
      if (!ev || ev.deltaPnl < 2 || ev.cutN < 2) continue;
      if (!best || ev.deltaPnl > best.ev.deltaPnl) best = { ...c, ev };
    }
    if (!best) break;
    picked.push(best);
    remaining = remaining.filter((r) => !best.fn(r));
  }
  const finalKeep = agg(remaining);
  const base = agg(rows);
  return {
    picked: picked.map((p) => ({
      name: p.name,
      cutN: p.ev.cutN,
      cutRoi: p.ev.cutRoi,
      cutPnl: p.ev.cutPnl,
      deltaPnl: p.ev.deltaPnl,
    })),
    keep: finalKeep,
    totalDelta: finalKeep.pnl - base.pnl,
  };
}

function walletLoserGraph(rows) {
  // Stamp-only: which lead wallets appear on losses vs wins (no live WR)
  const map = new Map();
  for (const r of rows) {
    if (!r.leadWallet) continue;
    if (!map.has(r.leadWallet)) map.set(r.leadWallet, []);
    map.get(r.leadWallet).push(r);
  }
  const out = [];
  for (const [w, rs] of map) {
    if (rs.length < 3) continue;
    const a = agg(rs);
    out.push({ wallet: w, ...a });
  }
  return out.sort((a, b) => a.pnl - b.pnl);
}

function loserSignatures(rows) {
  // Discrete signature of each ticket; find signatures enriched in losses
  const sigOf = (r) => [
    r.isTop ? 'TOP' : r.path,
    r.sport,
    r.boostBand ? 'U≥5.4' : 'U<5.4',
    r.edge == null ? 'E?' : r.edge >= 20 ? 'E≥20' : r.edge < 10 ? 'E<10' : 'Emid',
    r.leadSR == null ? 'SR?' : r.leadSR >= 3 ? 'SR≥3' : r.leadSR < 1.5 ? 'SR<1.5' : 'SRmid',
    r.hasBoth ? 'both' : 'unopp',
    r.dog ? 'dog' : 'fav',
  ].join('·');

  const map = new Map();
  for (const r of rows) {
    const s = sigOf(r);
    if (!map.has(s)) map.set(s, []);
    map.get(s).push(r);
  }
  const baseWr = agg(rows).wr || 50;
  const out = [];
  for (const [sig, rs] of map) {
    if (rs.length < 3) continue;
    const a = agg(rs);
    const lift = (a.wr ?? 50) - baseWr;
    out.push({ sig, ...a, wrLift: lift });
  }
  return {
    toxic: out.filter((x) => (x.roi ?? 0) < -15 && x.n >= 3).sort((a, b) => a.pnl - b.pnl),
    gold: out.filter((x) => (x.roi ?? 0) > 20 && x.n >= 3).sort((a, b) => b.pnl - a.pnl),
  };
}

async function main() {
  console.error('Loading…');
  const all = await load(db());
  const lines = [];
  const out = (s = '') => { lines.push(s); console.log(s); };

  out('# Unbounded 4u+ pattern discovery');
  out(`_Generated ${new Date().toISOString()} · stamp-safe · noise-floor calibrated_`);
  out('');
  out(`Universe U_all: **${all.length}** tickets · ${agg(all).w}–${agg(all).l} · ${agg(all).pnl >= 0 ? '+' : ''}${agg(all).pnl.toFixed(1)}u · ROI ${agg(all).roi?.toFixed(1)}%`);
  out('');

  const universes = [
    ['U_all', all],
    ['U_res (after TierA TOP cut)', all.filter((r) => !r.tierA)],
    ['U_top', all.filter((r) => r.isTop)],
    ['U_nontop', all.filter((r) => !r.isTop)],
    ['U_mlb', all.filter((r) => r.sport === 'MLB')],
    ['U_mlb_res', all.filter((r) => r.sport === 'MLB' && !r.tierA)],
    ['U_ev (Aug20+ stamped)', all.filter((r) => r.ticketEv != null)],
    ['U_boost (≥5.4u)', all.filter((r) => r.boostBand)],
  ];

  const hunts = [];
  for (const [label, rows] of universes) {
    if (rows.length < 15) {
      out(`_Skip ${label} n=${rows.length}_`);
      continue;
    }
    console.error(`Hunting ${label} n=${rows.length}…`);
    const noise = noiseFloor(rows, 60);
    const h = huntUniverse(label, rows, noise);
    hunts.push(h);
  }

  // ── Per-universe top angles ─────────────────────────────────────────
  for (const h of hunts) {
    out(`## ${h.label}`);
    out('');
    out(`Base: n=${h.base.n} · ${h.base.w}–${h.base.l} · ${h.base.pnl >= 0 ? '+' : ''}${h.base.pnl.toFixed(1)}u · ROI ${h.base.roi?.toFixed(1)}%`);
    out(`Noise floor (random 20% cut ΔPnL): mean ${h.noise.mean.toFixed(1)}u · p95 **${h.noise.p95.toFixed(1)}u** · p99 ${h.noise.p99.toFixed(1)}u`);
    out('');
    out('| # | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era stable |');
    out('|--:|------------|-----|---------:|-----:|---------:|:----------:|');
    let shown = 0;
    for (const r of h.ranked) {
      if (r.ev.deltaPnl < 3) continue;
      if (shown >= 18) break;
      const st = r.st.tested ? `${r.st.passed}/${r.st.tested}${r.st.stable ? '✓' : ''}` : '—';
      const mark = r.aboveNoise > 0 && r.st.stable ? '◆' : r.aboveNoise > 0 ? '○' : '·';
      out(`| ${++shown} | ${mark} ${r.name} | ${r.ev.cutN} ${r.ev.cutW}–${r.ev.cutL} ${r.ev.cutRoi >= 0 ? '+' : ''}${r.ev.cutRoi.toFixed(0)}% ${r.ev.cutPnl >= 0 ? '+' : ''}${r.ev.cutPnl.toFixed(1)}u | ${r.ev.keepRoi >= 0 ? '+' : ''}${r.ev.keepRoi.toFixed(0)}% | +${r.ev.deltaPnl.toFixed(1)}u | ${r.aboveNoise >= 0 ? '+' : ''}${r.aboveNoise.toFixed(1)} | ${st} |`);
    }
    out('');

    // Greedy stack from stable+above-noise
    const stackPool = h.ranked.filter((r) => r.aboveNoise > 0 && (r.st.stable || r.st.tested <= 1));
    const stack = greedyStack(
      universes.find((u) => u[0] === h.label)?.[1] || [],
      stackPool,
      4,
    );
    if (stack.picked.length) {
      out(`**Greedy stack** (sequential residual cuts) → total Δ **+${stack.totalDelta.toFixed(1)}u** · keep ${stack.keep.n} @ ROI ${stack.keep.roi?.toFixed(0)}%`);
      for (const p of stack.picked) {
        out(`- ${p.name} · cut ${p.cutN} @ ${p.cutRoi?.toFixed(0)}% · step +${p.deltaPnl.toFixed(1)}u`);
      }
      out('');
    }
  }

  // ── Loser signatures ────────────────────────────────────────────────
  out('## Discrete loser / winner signatures (U_all)');
  out('');
  const sigs = loserSignatures(all);
  out('### Toxic signatures (ROI &lt; −15%, n≥3)');
  out('| Signature | n | W–L | PnL | ROI |');
  out('|-----------|--:|:---:|----:|----:|');
  for (const s of sigs.toxic.slice(0, 20)) {
    out(`| ${s.sig} | ${s.n} | ${s.w}–${s.l} | ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(1)}u | ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(0)}% |`);
  }
  out('');
  out('### Gold signatures (ROI &gt; +20%, n≥3)');
  out('| Signature | n | W–L | PnL | ROI |');
  out('|-----------|--:|:---:|----:|----:|');
  for (const s of sigs.gold.slice(0, 15)) {
    out(`| ${s.sig} | ${s.n} | ${s.w}–${s.l} | ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(1)}u | ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(0)}% |`);
  }
  out('');

  // ── Lead wallet graph (stamp ids only) ──────────────────────────────
  out('## Lead-wallet concentration (stamped id only — no live WR)');
  out('');
  const wl = walletLoserGraph(all);
  out('| Lead wallet | n | W–L | PnL | ROI |');
  out('|-------------|--:|:---:|----:|----:|');
  for (const w of wl.filter((x) => x.pnl < -5 || x.pnl > 8).slice(0, 25)) {
    out(`| \`${w.wallet}\` | ${w.n} | ${w.w}–${w.l} | ${w.pnl >= 0 ? '+' : ''}${w.pnl.toFixed(1)}u | ${w.roi >= 0 ? '+' : ''}${w.roi.toFixed(0)}% |`);
  }
  out('');

  // ── Cross-universe consensus ────────────────────────────────────────
  out('## Cross-universe consensus angles');
  out('');
  out('Rules that appear in top-15 of ≥2 universes with Δ above that universe’s noise p95:');
  out('');
  const consensus = new Map();
  for (const h of hunts) {
    for (const r of h.ranked.slice(0, 15)) {
      if (r.aboveNoise <= 0) continue;
      if (!consensus.has(r.name)) consensus.set(r.name, []);
      consensus.get(r.name).push({
        univ: h.label, delta: r.ev.deltaPnl, stable: r.st.stable, cutN: r.ev.cutN, cutRoi: r.ev.cutRoi,
      });
    }
  }
  const consList = [...consensus.entries()]
    .filter(([, v]) => v.length >= 2)
    .sort((a, b) => b[1].length - a[1].length || b[1][0].delta - a[1][0].delta);

  out('| Rule | #univ | Appearances |');
  out('|------|------:|-------------|');
  for (const [name, vs] of consList.slice(0, 25)) {
    out(`| ${name} | ${vs.length} | ${vs.map((v) => `${v.univ.split(' ')[0]}+${v.delta.toFixed(0)}u`).join(', ')} |`);
  }
  out('');

  // ── Final angles ────────────────────────────────────────────────────
  out('## CLEAR ANGLES — actionable, ranked by confidence');
  out('');
  out('### Angle A — Inside-TOP whale/soft-EDGE (CONFIRM)');
  out('CUT TOP when `leadSR≥3 OR EDGE<10`. Stable, above noise, keeps path. Already known; still #1.');
  out('');
  out('### Angle B — TOP × opposed / netCLV&lt;0 (AUGMENT A)');
  out('Within TOP, opposed (`hasBoth`) and `netMeanPrior<0` repeatedly surface. Use as **secondary** TOP filters after A, not global cuts.');
  out('');
  out('### Angle C — Negative ticket EV on BOOST (PAPER)');
  out('`ticketEv<-1` especially with `units≥5.4`. Coverage Aug20+ only. Huge in U_ev / U_boost — paper mute until n grows.');
  out('');
  out('### Angle D — MLB TOP whale (SPORT-LOCAL A)');
  out('Toxic signature / consensus: TOP·MLB·SR≥3. Same as A localized — highest $ density of the TOP tax.');
  out('');
  out('### Angle E — Solo-wallet / high leadShare concentration');
  out('If `leadShare≥0.85` or `forWalletN=1` ranks above noise in residual universes, the book is over-concentrated on one wallet’s size spike — cut or cap those 4u+ tickets.');
  out('');
  out('### Angle F — Calibration gap on size (NEW SURFACE)');
  out('`calibGap = blendWr − implied` or `expGap` when negative on BOOST: model/market disagreement against us while we max-size. Paper in EV era.');
  out('');
  out('### Angle G — Steam divergence');
  out('`steamSinceOpen − steamLastHour` large positive (opened soft, last-hour flat/fade) on sized tickets — check U_ev rankings. Short sample.');
  out('');
  out('### Do-not-angle (anti-patterns rediscovered)');
  out('- Global maxSR≥3 / leadSR≥3 outside TOP (whales print non-TOP)');
  out('- Cut dogs globally (non-TOP dogs print)');
  out('- Cut low meanFor / low qConv (inverse of winners)');
  out('- Extend sub-4 maxSR&lt;1 mute to 4u+');
  out('');
  out('### Recommended ship path');
  out('1. **Ship now (discuss):** Angle A (± D as MLB emphasis)');
  out('2. **Add TOP secondary:** Angle B on TOP only');
  out('3. **Paper 2–3 weeks:** C + F (+ G if steam coverage widens)');
  out('4. **Investigate:** Angle E leadShare — if stable in U_res, cap size when leadShare≥0.9');
  out('');

  const md = lines.join('\n');
  writeFileSync(join(ROOT, 'tmp_4u_unbounded_patterns.md'), md);
  writeFileSync('/opt/cursor/artifacts/tmp_4u_unbounded_patterns.md', md);

  const json = {
    universes: hunts.map((h) => ({
      label: h.label,
      base: h.base,
      noise: h.noise,
      top: h.ranked.slice(0, 20).map((r) => ({
        name: r.name,
        deltaPnl: r.ev.deltaPnl,
        cutN: r.ev.cutN,
        cutRoi: r.ev.cutRoi,
        keepRoi: r.ev.keepRoi,
        aboveNoise: r.aboveNoise,
        stable: r.st.stable,
        passed: r.st.passed,
        tested: r.st.tested,
      })),
    })),
    consensus: consList.slice(0, 30).map(([name, vs]) => ({ name, vs })),
    toxicSigs: sigs.toxic.slice(0, 20),
    goldSigs: sigs.gold.slice(0, 15),
    leadWallets: wl.slice(0, 30),
  };
  writeFileSync(join(ROOT, 'tmp_4u_unbounded_patterns.json'), JSON.stringify(json, null, 2));
  writeFileSync('/opt/cursor/artifacts/tmp_4u_unbounded_patterns.json', JSON.stringify(json, null, 2));
  console.error('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
