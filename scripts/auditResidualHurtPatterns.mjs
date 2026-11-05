#!/usr/bin/env node
/**
 * UNBOUNDED residual hurt-pattern hunt — AFTER shipped TOP crowded mute.
 * Stamp-safe only. Noise-floor + era holdout + August CF.
 *
 * Universes:
 *   R4     = 4u+ Jun15+ AFTER removing A∪A2 TOP cuts (the shipped mute)
 *   R4_aug = same, August only
 *   R4_mlb = R4 ∩ MLB
 *   R4_nt  = R4 ∩ non-TOP
 *   R4_ev  = R4 with ticketEv stamped (Aug20+)
 *   R4_b   = R4 ∩ units≥5.4
 *   WALL   = ALL AGSU completed ≥1u Jun15+ (whole book hurt organ)
 *   WALL_r = WALL after A∪A2 + after maxSR-sub4 + noConfirmed would-cut (approx)
 *   SUB4   = 0<u<4 Jun15+
 *   SUB4_r = SUB4 after maxSR-sub4 mute CF (maxSR<1 → cut)
 *
 * Usage: node scripts/auditResidualHurtPatterns.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';
import { HC_RATIO } from '../src/lib/ags.js';
import {
  maxForSizeRatio,
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
const ERAS = [
  { id: 'E0', from: '2026-06-15', to: '2026-07-11' },
  { id: 'E2', from: '2026-07-15', to: '2026-07-21' },
  { id: 'E4', from: '2026-07-22', to: '2026-08-02' },
  { id: 'E5', from: '2026-08-03', to: '2026-08-15' },
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
function shortId(w) {
  const s = w?.walletShort || w?.wallet || '';
  return String(s).slice(0, 10);
}

/** Shipped mute A∪A2 */
function shippedTopCrowded(r) {
  if (!r.isTop) return false;
  if (r.leadSR != null && r.leadSR >= 3) return true;
  if (r.edge != null && r.edge < 10) return true;
  if (r.forRoiNormMean != null && r.leadSR != null
      && r.forRoiNormMean >= 42 && r.leadSR >= 2) return true;
  return false;
}
function maxSrSub4Cut(r) {
  return r.units > 0 && r.units < 4 && r.maxSR != null && r.maxSR < 1;
}
function noConfirmedCut(r) {
  return r.units > 0 && (r.nConfirmed == null || r.nConfirmed <= 0);
}

async function load(firestore) {
  const rows = [];
  const dayCounts = new Map();
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

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const forWd = wd.filter((w) => String(w.side) === String(sideKey)
          && (w.direction == null || String(w.direction).toUpperCase() === 'FOR'));
        const leadSR = leadForSizeRatio(wd, sideKey);
        const forRoiNormMean = meanForRoiNorm(wd, sideKey);
        const maxSR = maxForSizeRatio(wd, sideKey);
        const path = pathOf(sd);
        const isTop = path === 'TOP' || path === 'TOP+';
        const edge = num(sd.v8_winnerAlignEdge);
        const scoring = peak.v8Scoring || {};
        const lead = (() => {
          const hc = forWd.filter((w) => Number(w.sizeRatio) >= HC_RATIO)
            .sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio)
              || Number(b.invested || 0) - Number(a.invested || 0));
          return hc[0] || forWd.slice().sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio))[0] || null;
        })();
        const leadShare = (() => {
          const invs = forWd.map((w) => Number(w.invested)).filter(Number.isFinite);
          const sum = invs.reduce((a, b) => a + b, 0);
          const li = lead ? num(lead.invested) : null;
          if (!(sum > 0) || li == null) return null;
          return li / sum;
        })();
        const implied = odds < 0
          ? Math.abs(odds) / (Math.abs(odds) + 100)
          : odds > 0 ? 100 / (odds + 100) : null;
        const ticketEv = num(sd.v8_ticketEvPct);
        const expWin = num(sd.v8_expWin);
        const expGap = (expWin != null && implied != null) ? expWin - 100 * implied : null;
        const steamLH = num(sd.v8_steamLastHourPct ?? sd.v8_steam?.lastHourPct);
        const steamSO = num(sd.v8_steamSinceOpenPct ?? sd.v8_steam?.sinceOpenPct);
        const steamDiv = (steamLH != null && steamSO != null) ? steamSO - steamLH : null;
        const meanFor = num(sd.v8_winnerAlignMeanFor);
        const meanAg = num(sd.v8_winnerAlignMeanAg);
        const forN = num(sd.v8_winnerAlignForN);
        const agN = num(sd.v8_winnerAlignAgN);
        // nConfirmed from stamp if present; else cannot invent — leave null
        const nConfirmed = num(sd.v8_nConfirmedFor);

        const row = {
          id: `${docSnap.id}:${sideKey}`,
          date,
          era: eraId(date),
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
          forN,
          agN,
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
          forRoiNormMean,
          leadShare,
          leadWallet: lead ? shortId(lead) : null,
          sumSR: forWd.reduce((s, w) => s + (Number.isFinite(Number(w.sizeRatio)) ? Number(w.sizeRatio) : 0), 0),
          forWalletN: forWd.length,
          ticketEv,
          expWin,
          expGap,
          edgePerUnit: (edge != null && units > 0) ? edge / units : null,
          steamLH,
          steamSO,
          steamDiv,
          implied: implied != null ? 100 * implied : null,
          bestForTier: sd.v8_bestForTier || null,
          mutedBy: sd.mutedBy || null,
          nConfirmed,
          dog: odds > 0,
          chalk200: odds <= -200,
          boostBand: units >= 5.4,
          mega: units >= 6,
          is4u: units >= 4,
          isSub4: units > 0 && units < 4,
          shippedCut: false,
          maxSrCut: false,
        };
        row.shippedCut = shippedTopCrowded(row);
        row.maxSrCut = maxSrSub4Cut(row);
        rows.push(row);
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

function noiseFloor(rows, nPerm = 100) {
  const deltas = [];
  for (let i = 0; i < nPerm; i++) {
    const labels = rows.map((r) => r.won);
    for (let j = labels.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [labels[j], labels[k]] = [labels[k], labels[j]];
    }
    const shuffled = rows.map((r, idx) => ({
      ...r, won: labels[idx], profit: profitOf(r.units, r.odds, labels[idx]),
    }));
    const ev = evalCut(shuffled, (r) => {
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

function buildRules(rows) {
  const rules = [];
  const add = (name, fn) => rules.push({ name, fn });

  // ── Known residual candidates (not the shipped mute) ──
  add('boost ∧ ticketEv<-1', (r) => r.boostBand && r.ticketEv != null && r.ticketEv < -1);
  add('boost ∧ ticketEv<-1.5', (r) => r.boostBand && r.ticketEv != null && r.ticketEv < -1.5);
  add('ticketEv<-1', (r) => r.ticketEv != null && r.ticketEv < -1);
  add('ticketEv<-1.5', (r) => r.ticketEv != null && r.ticketEv < -1.5);
  add('ticketEv<-2', (r) => r.ticketEv != null && r.ticketEv < -2);
  add('(ticketEv<-1)∧(EDGE≥12)', (r) => r.ticketEv != null && r.ticketEv < -1 && r.edge != null && r.edge >= 12);
  add('(ticketEv<-1)∧(EDGE≥15)', (r) => r.ticketEv != null && r.ticketEv < -1 && r.edge != null && r.edge >= 15);
  add('(ticketEv<-1.5)∧(EDGE≥15)', (r) => r.ticketEv != null && r.ticketEv < -1.5 && r.edge != null && r.edge >= 15);
  add('SHARP ∧ ticketEv<-1', (r) => String(r.path).startsWith('SHARP') && r.ticketEv != null && r.ticketEv < -1);
  add('expGap≥6.5', (r) => r.expGap != null && r.expGap >= 6.5);
  add('expGap≥7', (r) => r.expGap != null && r.expGap >= 7);

  // ── Path / sport organs ──
  add('TOP+', (r) => r.path === 'TOP+');
  add('TOP kept (post-mute residue)', (r) => r.isTop); // on residual these are keepers
  add('SHARP-LEAN', (r) => r.path === 'SHARP-LEAN');
  add('SHARP', (r) => r.path === 'SHARP');
  add('RANK', (r) => r.path === 'RANK');
  add('DISSENT', (r) => r.path === 'DISSENT' || r.path === 'PATH-D');
  add('MLB', (r) => r.sport === 'MLB');
  add('NFL', (r) => r.sport === 'NFL');
  add('WNBA', (r) => r.sport === 'WNBA');
  add('UFC', (r) => r.sport === 'UFC');
  add('SOCCER', (r) => r.sport === 'SOCCER' || r.sport === 'SOC');
  add('TOTAL', (r) => r.mkt === 'TOTAL');
  add('SPREAD', (r) => r.mkt === 'SPREAD');
  add('ML', (r) => r.mkt === 'ML');

  // ── Odds / chalk ──
  add('dog', (r) => r.dog);
  add('chalk≤-200', (r) => r.chalk200);
  add('odds∈[-150,-110]', (r) => r.odds <= -110 && r.odds >= -150);
  add('odds<-150', (r) => r.odds < -150);
  add('odds>-110', (r) => r.odds > -110);

  // ── Geometry ──
  add('unopposed', (r) => !r.hasBoth);
  add('opposed', (r) => r.hasBoth);
  add('fadeTop60', (r) => r.fadeTop);
  add('NEITHER bucket', (r) => r.edgeNetBucket === 'NEITHER');
  add('ONE bucket', (r) => r.edgeNetBucket === 'ONE');
  add('BOTH bucket', (r) => r.edgeNetBucket === 'BOTH');
  add('tape MUTE', (r) => r.tapeAction === 'MUTE');
  add('tape BOOST', (r) => r.tapeAction === 'BOOST');
  add('tape FAIL_OPEN', (r) => r.tapeAction === 'FAIL_OPEN');
  add('bestFOR=FLAT', (r) => r.bestForTier === 'FLAT');
  add('bestFOR=CONFIRMED', (r) => r.bestForTier === 'CONFIRMED');

  // ── Threshold sweeps ──
  const feats = [
    ['EDGE', (r) => r.edge],
    ['leadSR', (r) => r.leadSR],
    ['sumSR', (r) => r.sumSR],
    ['leadShare', (r) => r.leadShare],
    ['forRoiNormMean', (r) => r.forRoiNormMean],
    ['maxSR', (r) => r.maxSR],
    ['qConv', (r) => r.qConv],
    ['tapeScore', (r) => r.tapeScore],
    ['netMeanPrior', (r) => r.netMeanPrior],
    ['ticketEv', (r) => r.ticketEv],
    ['expGap', (r) => r.expGap],
    ['edgePerUnit', (r) => r.edgePerUnit],
    ['steamLH', (r) => r.steamLH],
    ['steamSO', (r) => r.steamSO],
    ['steamDiv', (r) => r.steamDiv],
    ['slateN', (r) => r.slateN],
    ['units', (r) => r.units],
    ['odds', (r) => r.odds],
    ['meanFor', (r) => r.meanFor],
  ];
  for (const [lab, get] of feats) {
    for (const thr of thresholdCandidates(rows, get)) {
      add(`${lab} < ${Number(thr).toFixed(3).replace(/\.?0+$/, '')}`, (r) => {
        const v = get(r); return v != null && v < thr;
      });
      add(`${lab} ≥ ${Number(thr).toFixed(3).replace(/\.?0+$/, '')}`, (r) => {
        const v = get(r); return v != null && v >= thr;
      });
    }
  }

  // ── Pairwise interactions (high-signal only) ──
  const edgeTs = thresholdCandidates(rows, (r) => r.edge, 5);
  const srTs = thresholdCandidates(rows, (r) => r.leadSR, 5);
  const evTs = thresholdCandidates(rows, (r) => r.ticketEv, 5);
  const shareTs = thresholdCandidates(rows, (r) => r.leadShare, 4);
  const rnTs = thresholdCandidates(rows, (r) => r.forRoiNormMean, 4);
  const oddsTs = thresholdCandidates(rows, (r) => r.odds, 4);
  const slateTs = thresholdCandidates(rows, (r) => r.slateN, 4);
  const steamTs = thresholdCandidates(rows, (r) => r.steamDiv, 4);

  for (const e of edgeTs) {
    for (const s of srTs) {
      add(`(EDGE<${e.toFixed(1)})∧(leadSR≥${s.toFixed(2)})`, (r) => r.edge != null && r.edge < e && r.leadSR != null && r.leadSR >= s);
      add(`(EDGE≥${e.toFixed(1)})∧(leadSR≥${s.toFixed(2)})`, (r) => r.edge != null && r.edge >= e && r.leadSR != null && r.leadSR >= s);
      add(`(EDGE≥${e.toFixed(1)})∧(leadSR<${s.toFixed(2)})`, (r) => r.edge != null && r.edge >= e && r.leadSR != null && r.leadSR < s);
    }
    for (const o of oddsTs) {
      add(`(EDGE<${e.toFixed(1)})∧(odds<${o.toFixed(0)})`, (r) => r.edge != null && r.edge < e && r.odds < o);
      add(`(EDGE<${e.toFixed(1)})∧(odds≥${o.toFixed(0)})`, (r) => r.edge != null && r.edge < e && r.odds >= o);
    }
  }
  for (const ev of evTs) {
    for (const e of edgeTs) {
      add(`(ticketEv<${ev.toFixed(1)})∧(EDGE≥${e.toFixed(1)})`, (r) => r.ticketEv != null && r.ticketEv < ev && r.edge != null && r.edge >= e);
    }
  }
  for (const sh of shareTs) {
    for (const e of edgeTs) {
      add(`(leadShare≥${sh.toFixed(2)})∧(EDGE<${e.toFixed(1)})`, (r) => r.leadShare != null && r.leadShare >= sh && r.edge != null && r.edge < e);
      add(`(leadShare≥${sh.toFixed(2)})∧(EDGE≥${e.toFixed(1)})`, (r) => r.leadShare != null && r.leadShare >= sh && r.edge != null && r.edge >= e);
    }
  }
  for (const rn of rnTs) {
    for (const s of srTs) {
      add(`(roiNorm≥${rn.toFixed(1)})∧(leadSR≥${s.toFixed(2)})`, (r) => r.forRoiNormMean != null && r.forRoiNormMean >= rn && r.leadSR != null && r.leadSR >= s);
      add(`(roiNorm<${rn.toFixed(1)})∧(leadSR<${s.toFixed(2)})`, (r) => r.forRoiNormMean != null && r.forRoiNormMean < rn && r.leadSR != null && r.leadSR < s);
    }
  }
  for (const sl of slateTs) {
    add(`(slateN≥${sl})∧(units<5.4)`, (r) => r.slateN >= sl && r.units < 5.4);
    add(`(slateN≥${sl})∧TOP`, (r) => r.slateN >= sl && r.isTop);
    add(`(slateN≥${sl})∧MLB`, (r) => r.slateN >= sl && r.sport === 'MLB');
  }
  for (const st of steamTs) {
    add(`steamDiv≥${st.toFixed(2)}`, (r) => r.steamDiv != null && r.steamDiv >= st);
    add(`steamDiv<${st.toFixed(2)}`, (r) => r.steamDiv != null && r.steamDiv < st);
  }

  // ── Sport × path toxins ──
  for (const sport of ['MLB', 'NFL', 'WNBA', 'UFC', 'NHL', 'NBA', 'CBB', 'SOCCER']) {
    for (const path of ['TOP', 'TOP+', 'RANK', 'SHARP', 'SHARP-LEAN', 'SHARP-PRIME']) {
      add(`${path}∧${sport}`, (r) => r.path === path && r.sport === sport);
    }
  }
  add('SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5', (r) => (
    r.path === 'SHARP-LEAN' && r.sport === 'MLB' && r.units < 5.4
    && r.edge != null && r.edge >= 20 && r.leadSR != null && r.leadSR < 1.5
  ));
  add('RANK∧MLB∧unopp∧U<5.4', (r) => r.path === 'RANK' && r.sport === 'MLB' && !r.hasBoth && r.units < 5.4);
  add('RANK∧MLB∧unopp∧fav∧SRmid', (r) => (
    r.path === 'RANK' && r.sport === 'MLB' && !r.hasBoth && !r.dog
    && r.leadSR != null && r.leadSR >= 1.5 && r.leadSR < 3 && r.units < 5.4
  ));

  // ── Sub-4 specific ──
  add('sub4 ∧ maxSR<1', (r) => r.isSub4 && r.maxSR != null && r.maxSR < 1);
  add('sub4 ∧ maxSR<0.5', (r) => r.isSub4 && r.maxSR != null && r.maxSR < 0.5);
  add('sub4 ∧ EDGE<5', (r) => r.isSub4 && r.edge != null && r.edge < 5);
  add('sub4 ∧ tape BOOST', (r) => r.isSub4 && r.tapeAction === 'BOOST');
  add('sub4 ∧ FAIL_OPEN', (r) => r.isSub4 && r.tapeAction === 'FAIL_OPEN');
  add('sub4 ∧ NEITHER', (r) => r.isSub4 && r.edgeNetBucket === 'NEITHER');
  add('sub4 ∧ dog', (r) => r.isSub4 && r.dog);
  add('sub4 ∧ chalk≤-200', (r) => r.isSub4 && r.chalk200);

  return rules;
}

function scoreUniverse(name, rows, { minDelta = 5, topK = 20 } = {}) {
  if (rows.length < 10) {
    return { name, skip: true, reason: `n=${rows.length}` };
  }
  const base = agg(rows);
  const noise = noiseFloor(rows);
  const rules = buildRules(rows);
  const scored = [];
  for (const rule of rules) {
    const ev = evalCut(rows, rule.fn);
    if (!ev) continue;
    if (ev.deltaPnl < minDelta) continue;
    if ((ev.cutRoi ?? 0) >= (ev.keepRoi ?? 0)) continue;
    const stab = eraStability(rows, rule.fn);
    const vsNoise = ev.deltaPnl - noise.p95;
    scored.push({
      name: rule.name,
      ...ev,
      vsNoise,
      stable: stab.stable,
      eraPassed: stab.passed,
      eraTested: stab.tested,
      mark: (vsNoise > 0 && stab.stable) ? '◆' : (vsNoise > 0 ? '○' : '·'),
    });
  }
  scored.sort((a, b) => b.deltaPnl - a.deltaPnl || b.vsNoise - a.vsNoise);

  // Greedy residual stack
  let residual = rows.slice();
  const stack = [];
  const used = new Set();
  for (let step = 0; step < 5; step++) {
    let best = null;
    for (const rule of rules) {
      if (used.has(rule.name)) continue;
      const ev = evalCut(residual, rule.fn);
      if (!ev || ev.deltaPnl < 3 || ev.cutN < 2) continue;
      if ((ev.cutRoi ?? 0) >= (ev.keepRoi ?? 0)) continue;
      if (!best || ev.deltaPnl > best.deltaPnl) best = { ...ev, name: rule.name, fn: rule.fn };
    }
    if (!best) break;
    used.add(best.name);
    stack.push(best);
    residual = residual.filter((r) => !best.fn(r));
  }

  return {
    name,
    skip: false,
    base,
    noise,
    top: scored.slice(0, topK),
    stack,
    stackKeep: agg(residual),
    stackDelta: stack.reduce((s, x) => s + x.deltaPnl, 0),
  };
}

function fmtAgg(a) {
  if (!a || !a.n) return '∅';
  return `n=${a.n} · ${a.w}–${a.l} · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u · ROI ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
}

function fmtRule(r) {
  const cut = `${r.cutN} ${r.cutW}–${r.cutL} ${r.cutRoi == null ? '—' : `${r.cutRoi >= 0 ? '+' : ''}${r.cutRoi.toFixed(0)}%`} ${r.cutPnl >= 0 ? '+' : ''}${r.cutPnl.toFixed(1)}u`;
  return `| ${r.mark} | ${r.name} | ${cut} | ${r.keepRoi >= 0 ? '+' : ''}${(r.keepRoi ?? 0).toFixed(0)}% | ${r.deltaPnl >= 0 ? '+' : ''}${r.deltaPnl.toFixed(1)}u | ${r.vsNoise >= 0 ? '+' : ''}${r.vsNoise.toFixed(1)} | ${r.eraPassed}/${r.eraTested}${r.stable ? '✓' : ''} |`;
}

function sliceBy(rows, pred) {
  return rows.filter(pred);
}

function toxicSigs(rows, minN = 3) {
  const buckets = new Map();
  for (const r of rows) {
    const eBand = r.edge == null ? 'E?' : r.edge < 10 ? 'E<10' : r.edge < 20 ? 'Emid' : 'E≥20';
    const srBand = r.leadSR == null ? 'SR?' : r.leadSR < 1.5 ? 'SR<1.5' : r.leadSR < 3 ? 'SRmid' : 'SR≥3';
    const uBand = r.units >= 5.4 ? 'U≥5.4' : 'U<5.4';
    const key = [
      r.path, r.sport, uBand, eBand, srBand,
      r.hasBoth ? 'both' : 'unopp',
      r.dog ? 'dog' : 'fav',
      r.mkt,
    ].join('·');
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(r);
  }
  const out = [];
  for (const [key, rs] of buckets) {
    if (rs.length < minN) continue;
    const a = agg(rs);
    out.push({ key, ...a });
  }
  return {
    toxic: out.filter((x) => (x.roi ?? 0) < -15).sort((a, b) => a.pnl - b.pnl),
    gold: out.filter((x) => (x.roi ?? 0) > 20).sort((a, b) => b.pnl - a.pnl),
  };
}

function leadWalletTable(rows, minN = 3) {
  const m = new Map();
  for (const r of rows) {
    if (!r.leadWallet) continue;
    if (!m.has(r.leadWallet)) m.set(r.leadWallet, []);
    m.get(r.leadWallet).push(r);
  }
  return [...m.entries()]
    .map(([id, rs]) => ({ id, ...agg(rs) }))
    .filter((x) => x.n >= minN)
    .sort((a, b) => a.pnl - b.pnl);
}

function augCf(rows, fn, label) {
  const aug = rows.filter((r) => r.date >= '2026-08-01' && r.date <= '2026-08-25');
  const cut = aug.filter(fn);
  const keep = aug.filter((r) => !fn(r));
  return {
    label,
    actual: agg(aug),
    cut: agg(cut),
    keep: agg(keep),
    delta: agg(keep).pnl - agg(aug).pnl,
    cutRows: cut.slice().sort((a, b) => a.date.localeCompare(b.date) || a.profit - b.profit),
  };
}

async function main() {
  console.log('Loading Firestore…');
  const all = await load(db());
  console.log(`Loaded ${all.length} AGSU completed tickets ≥1u from ${FROM}`);

  const u4 = all.filter((r) => r.is4u);
  const r4 = u4.filter((r) => !r.shippedCut);
  const sub4 = all.filter((r) => r.isSub4);
  const sub4r = sub4.filter((r) => !r.maxSrCut);

  const universes = [
    ['R4', r4],
    ['R4_aug', r4.filter((r) => r.date >= '2026-08-01')],
    ['R4_mlb', r4.filter((r) => r.sport === 'MLB')],
    ['R4_nt', r4.filter((r) => !r.isTop)],
    ['R4_top', r4.filter((r) => r.isTop)],
    ['R4_ev', r4.filter((r) => r.ticketEv != null && r.date >= '2026-08-20')],
    ['R4_b', r4.filter((r) => r.boostBand)],
    ['WALL', all],
    ['WALL_r', all.filter((r) => !r.shippedCut && !r.maxSrCut)],
    ['SUB4', sub4],
    ['SUB4_r', sub4r],
  ];

  const results = [];
  for (const [name, rows] of universes) {
    console.log(`Scoring ${name} n=${rows.length}…`);
    results.push(scoreUniverse(name, rows));
  }

  // Consensus: rules in top-15 of ≥2 residual universes with Δ > noise
  const residualNames = new Set(['R4', 'R4_aug', 'R4_mlb', 'R4_nt', 'R4_ev', 'R4_b', 'WALL_r', 'SUB4_r']);
  const appear = new Map();
  for (const res of results) {
    if (res.skip || !residualNames.has(res.name)) continue;
    for (const r of res.top.slice(0, 15)) {
      if (r.vsNoise <= 0) continue;
      if (!appear.has(r.name)) appear.set(r.name, []);
      appear.get(r.name).push({ univ: res.name, delta: r.deltaPnl, mark: r.mark, stable: r.stable });
    }
  }
  const consensus = [...appear.entries()]
    .filter(([, xs]) => xs.length >= 2)
    .map(([name, xs]) => ({
      name,
      nUniv: xs.length,
      totalDelta: xs.reduce((s, x) => s + x.delta, 0),
      xs,
      anyStable: xs.some((x) => x.stable),
    }))
    .sort((a, b) => b.totalDelta - a.totalDelta || b.nUniv - a.nUniv);

  // August CFs for top residual candidates
  const candidateFns = [
    ['boost ∧ ticketEv<-1', (r) => r.boostBand && r.ticketEv != null && r.ticketEv < -1],
    ['ticketEv<-1 (any units stamped)', (r) => r.ticketEv != null && r.ticketEv < -1],
    ['(ticketEv<-1)∧(EDGE≥15)', (r) => r.ticketEv != null && r.ticketEv < -1 && r.edge != null && r.edge >= 15],
    ['expGap≥6.5', (r) => r.expGap != null && r.expGap >= 6.5],
    ['SHARP-LEAN∧MLB∧U<5.4∧E≥20∧SR<1.5', (r) => (
      r.path === 'SHARP-LEAN' && r.sport === 'MLB' && r.units < 5.4
      && r.edge != null && r.edge >= 20 && r.leadSR != null && r.leadSR < 1.5
    )],
    ['RANK∧MLB∧unopp∧U<5.4', (r) => r.path === 'RANK' && r.sport === 'MLB' && !r.hasBoth && r.units < 5.4],
    ['(leadShare≥0.82)∧(EDGE<12)', (r) => r.leadShare != null && r.leadShare >= 0.82 && r.edge != null && r.edge < 12],
    ['TOP+ (residual)', (r) => r.path === 'TOP+'],
    ['(EDGE<12)∧(odds<-126)', (r) => r.edge != null && r.edge < 12 && r.odds < -126],
    ['(roiNorm<23)∧(leadSR<0.33)', (r) => r.forRoiNormMean != null && r.forRoiNormMean < 23 && r.leadSR != null && r.leadSR < 0.33],
  ];
  const cfs = candidateFns.map(([label, fn]) => augCf(r4, fn, label));

  // Whole-book organ health after shipped mutes
  const organ = {
    all: agg(all),
    afterShipped: agg(all.filter((r) => !r.shippedCut)),
    afterShippedAndMaxSr: agg(all.filter((r) => !r.shippedCut && !r.maxSrCut)),
    u4: agg(u4),
    r4: agg(r4),
    shippedCuts: agg(u4.filter((r) => r.shippedCut)),
    sub4: agg(sub4),
    sub4r: agg(sub4r),
    maxSrCuts: agg(sub4.filter((r) => r.maxSrCut)),
  };

  const sigsR4 = toxicSigs(r4);
  const leadsR4 = leadWalletTable(r4);

  // Markdown
  const lines = [];
  lines.push('# Residual hurt patterns — AFTER shipped TOP crowded mute');
  lines.push(`_Generated ${new Date().toISOString()} · stamp-safe · noise-calibrated_`);
  lines.push('');
  lines.push('Shipped baseline removed from 4u+: `TOP ∧ (leadSR≥3 ∨ EDGE<10 ∨ (roiNorm≥42 ∧ leadSR≥2))`.');
  lines.push('');
  lines.push('## Book organs');
  lines.push('');
  lines.push('| Slice | Stats |');
  lines.push('|-------|------:|');
  lines.push(`| ALL ≥1u | ${fmtAgg(organ.all)} |`);
  lines.push(`| − shipped TOP crowded | ${fmtAgg(organ.afterShipped)} |`);
  lines.push(`| − shipped − maxSR-sub4 | ${fmtAgg(organ.afterShippedAndMaxSr)} |`);
  lines.push(`| 4u+ actual | ${fmtAgg(organ.u4)} |`);
  lines.push(`| 4u+ residual (R4) | ${fmtAgg(organ.r4)} |`);
  lines.push(`| shipped cuts (CF) | ${fmtAgg(organ.shippedCuts)} |`);
  lines.push(`| sub-4 actual | ${fmtAgg(organ.sub4)} |`);
  lines.push(`| sub-4 residual (post maxSR) | ${fmtAgg(organ.sub4r)} |`);
  lines.push(`| maxSR-sub4 cuts (CF) | ${fmtAgg(organ.maxSrCuts)} |`);
  lines.push('');

  for (const res of results) {
    if (res.skip) {
      lines.push(`## ${res.name}`);
      lines.push(`Skipped: ${res.reason}`);
      lines.push('');
      continue;
    }
    lines.push(`## ${res.name}`);
    lines.push('');
    lines.push(`Base: ${fmtAgg(res.base)}`);
    lines.push(`Noise floor (random 20% cut ΔPnL): mean ${res.noise.mean.toFixed(1)}u · p95 **${res.noise.p95.toFixed(1)}u** · p99 ${res.noise.p99.toFixed(1)}u`);
    lines.push('');
    lines.push('| # | Mark | Rule (CUT) | Cut | Keep ROI | ΔPnL | vs noise | Era |');
    lines.push('|--:|:----:|------------|-----|---------:|-----:|---------:|:---:|');
    res.top.forEach((r, i) => {
      lines.push(`| ${i + 1} ${fmtRule(r).slice(1)}`);
    });
    lines.push('');
    if (res.stack.length) {
      lines.push(`**Greedy stack** → total Δ **${res.stackDelta >= 0 ? '+' : ''}${res.stackDelta.toFixed(1)}u** · keep ${fmtAgg(res.stackKeep)}`);
      for (const s of res.stack) {
        lines.push(`- ${s.name} · cut ${s.cutN} @ ${s.cutRoi >= 0 ? '+' : ''}${(s.cutRoi ?? 0).toFixed(0)}% · step ${s.deltaPnl >= 0 ? '+' : ''}${s.deltaPnl.toFixed(1)}u`);
      }
      lines.push('');
    }
  }

  lines.push('## Cross-universe consensus (residual only, Δ > noise)');
  lines.push('');
  lines.push('| Rule | #univ | Appearances |');
  lines.push('|------|------:|-------------|');
  for (const c of consensus.slice(0, 25)) {
    const apps = c.xs.map((x) => `${x.univ}${x.mark}${x.delta >= 0 ? '+' : ''}${x.delta.toFixed(0)}u`).join(', ');
    lines.push(`| ${c.anyStable ? '◆' : '○'} ${c.name} | ${c.nUniv} | ${apps} |`);
  }
  lines.push('');

  lines.push('## August CF on R4 (4u+ residual) — candidate mutes');
  lines.push('');
  for (const cf of cfs) {
    lines.push(`### ${cf.label}`);
    lines.push(`Actual ${fmtAgg(cf.actual)} → cut ${fmtAgg(cf.cut)} → keep ${fmtAgg(cf.keep)} · **Δ ${cf.delta >= 0 ? '+' : ''}${cf.delta.toFixed(2)}u**`);
    if (cf.cutRows.length && cf.cutRows.length <= 20) {
      lines.push('');
      lines.push('| Date | R | u | Path | Sport | EDGE | leadSR | ticketEv | PnL |');
      lines.push('|------|:-:|--:|------|-------|-----:|-------:|---------:|----:|');
      for (const r of cf.cutRows) {
        lines.push(`| ${r.date} | ${r.won ? 'W' : 'L'} | ${r.units} | ${r.path} | ${r.sport} | ${r.edge ?? '—'} | ${r.leadSR?.toFixed?.(2) ?? '—'} | ${r.ticketEv ?? '—'} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)} |`);
      }
    }
    lines.push('');
  }

  lines.push('## Toxic signatures on R4');
  lines.push('');
  lines.push('| Signature | n | W–L | PnL | ROI |');
  lines.push('|-----------|--:|:---:|----:|----:|');
  for (const t of sigsR4.toxic.slice(0, 15)) {
    lines.push(`| ${t.key} | ${t.n} | ${t.w}–${t.l} | ${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(1)}u | ${t.roi >= 0 ? '+' : ''}${t.roi.toFixed(0)}% |`);
  }
  lines.push('');
  lines.push('## Lead wallets still hurting on R4 (stamp id only)');
  lines.push('');
  lines.push('| Lead | n | W–L | PnL | ROI |');
  lines.push('|------|--:|:---:|----:|----:|');
  for (const w of leadsR4.filter((x) => x.pnl < 0).slice(0, 12)) {
    lines.push(`| \`${w.id}\` | ${w.n} | ${w.w}–${w.l} | ${w.pnl.toFixed(1)}u | ${w.roi.toFixed(0)}% |`);
  }
  lines.push('');

  // CLEAR ANGLES synthesis
  lines.push('## CLEAR ANGLES — residual hurt organs (ranked)');
  lines.push('');
  lines.push('See JSON for full rule tables. Human synthesis written by agent after run.');
  lines.push('');

  const md = lines.join('\n');
  writeFileSync(join(ROOT, 'tmp_residual_hurt_patterns.md'), md);
  writeFileSync(join(ROOT, 'tmp_residual_hurt_patterns.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    organ,
    results: results.map((r) => (r.skip ? r : {
      name: r.name,
      base: r.base,
      noise: r.noise,
      top: r.top,
      stack: r.stack.map(({ fn, ...rest }) => rest),
      stackKeep: r.stackKeep,
      stackDelta: r.stackDelta,
    })),
    consensus,
    cfs: cfs.map(({ cutRows, ...rest }) => ({
      ...rest,
      cutRows: cutRows.map((r) => ({
        date: r.date, won: r.won, units: r.units, path: r.path, sport: r.sport,
        edge: r.edge, leadSR: r.leadSR, ticketEv: r.ticketEv, profit: r.profit, id: r.id,
      })),
    })),
    toxicR4: sigsR4.toxic.slice(0, 20),
    goldR4: sigsR4.gold.slice(0, 15),
    leadsR4: leadsR4.slice(0, 20),
  }, null, 2));
  console.log('Wrote tmp_residual_hurt_patterns.md / .json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
