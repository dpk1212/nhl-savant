#!/usr/bin/env node
/**
 * Path C optimal-levels search.
 *
 * 1) Reload live graded sides since SHARP cutover.
 * 2) Grid-search qualification + sizing knobs on the Path C book.
 * 3) Walk-forward by date to penalize pure in-sample overfit.
 * 4) Emit recommended levels.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync, writeFileSync } from 'fs';

const firebaseConfig = {
  apiKey: 'AIzaSyCebVxfa6FmlE8Kuyey_0P1LMCquacjez0',
  authDomain: 'nhl-savant.firebaseapp.com',
  projectId: 'nhl-savant',
  storageBucket: 'nhl-savant.firebasestorage.app',
  messagingSenderId: '801983550873',
  appId: '1:801983550873:web:79681f2fff98afb9f7af08',
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CUTOFF = '2026-06-26';
const PATH_C = new Set(['SHARP', 'SHARP-PRIME', 'TOP+', 'MINI-']);

const rawProfiles = JSON.parse(readFileSync('/workspace/data/wallet-profiles.json', 'utf8'));
const profiles = new Map();
for (const [k, p] of Object.entries(rawProfiles.profiles || {})) {
  profiles.set(String(k).slice(-6).toLowerCase(), p);
  if (p.walletShort) profiles.set(String(p.walletShort).slice(-6).toLowerCase(), p);
}

function sharpQuality(wd, mySide, sport, opts = {}) {
  const minQN = opts.minQN ?? 8;
  const minQRoi = opts.minQRoi ?? 10;
  const minPN = opts.minPN ?? 5;
  const wrBase = opts.wrBase ?? 50;
  const wrPrime = opts.wrPrime ?? 55;
  const minFor = opts.minFor ?? 2;
  const useSport = !!opts.useSport;
  let forCount = 0;
  let maxQRoi = -Infinity;
  const wrPool = [];
  const seen = new Set();
  for (const w of wd || []) {
    const short = String(w.wallet || '').slice(-6).toLowerCase();
    if (!short || seen.has(short)) continue;
    seen.add(short);
    if (w.side !== mySide) continue;
    forCount++;
    const profile = profiles.get(short);
    if (!profile) continue;
    const q = useSport && sport && profile.bySport?.[sport]?.positions
      ? profile.bySport[sport].positions
      : (profile.positions || {});
    const pk = useSport && sport && profile.bySport?.[sport]?.picks
      ? profile.bySport[sport].picks
      : (profile.picks || {});
    if ((Number(q.n) || 0) >= minQN && Number.isFinite(Number(q.dollarRoi))) {
      maxQRoi = Math.max(maxQRoi, Number(q.dollarRoi));
    }
    if ((Number(pk.n) || 0) >= minPN && Number.isFinite(Number(pk.wr))) {
      wrPool.push(Number(pk.wr));
    }
  }
  const meanPWr = wrPool.length ? wrPool.reduce((s, x) => s + x, 0) / wrPool.length : null;
  const provenDollar = Number.isFinite(maxQRoi) && maxQRoi >= minQRoi;
  const qualifies = provenDollar && meanPWr != null && meanPWr >= wrBase && forCount >= minFor;
  const prime = qualifies && meanPWr >= wrPrime;
  return {
    forCount,
    maxQRoi: Number.isFinite(maxQRoi) ? maxQRoi : null,
    meanPWr,
    provenDollar,
    qualifies,
    prime,
  };
}

function oddsCap(units, odds) {
  if (!Number.isFinite(odds)) return units;
  if (odds >= 200) return Math.min(units, 1.0);
  if (odds >= 151) return Math.min(units, 1.5);
  if (odds >= 100) return Math.min(units, 2.5);
  return units;
}
function profitAt(units, odds, won) {
  if (!units) return 0;
  if (!won) return -units;
  return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
}

function summarize(bets) {
  let w = 0, l = 0, stake = 0, pnl = 0;
  for (const b of bets) {
    if (b.won) w++; else l++;
    stake += b.units;
    pnl += b.profit;
  }
  return {
    n: bets.length,
    w, l,
    record: `${w}-${l}`,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    roi: stake > 0 ? +((100 * pnl) / stake).toFixed(1) : null,
  };
}

// ── Load all graded Path-C-relevant sides ─────────────────────────────
const cols = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

const rows = [];
for (const [col, mkt] of cols) {
  process.stderr.write(`loading ${col}…\n`);
  const snap = await getDocs(collection(db, col));
  for (const d of snap.docs) {
    const data = d.data();
    if (!data.sides || !data.date || data.date < CUTOFF) continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (sd.superseded) continue;
      if ((sd.status || data.status) !== 'COMPLETED') continue;
      const res = sd.result || {};
      if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
      const tier = sd.v8_hcStakeTier || null;
      if (!tier) continue;
      // Keep Path C + parent HC tiers we might have boosted/cut from
      const keep = PATH_C.has(tier) || tier === 'TOP' || tier === 'MINI' || tier === 'SHARP' || tier === 'MONITORING';
      if (!keep) continue;
      const won = res.outcome === 'WIN';
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const units = Number(sd.finalUnits ?? sd.v8_agsV12UnitsApplied ?? peak.units ?? 0);
      const odds = Number(peak.odds || lock.odds || 0);
      const profit = Number.isFinite(res.profit) ? Number(res.profit) : profitAt(units, odds, won);
      const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
        .filter((w) => w && w.wallet && w.side);
      const sport = data.sport || '?';
      const q0 = sharpQuality(wd, sideKey, sport, {});
      rows.push({
        id: `${d.id}/${sideKey}`,
        date: data.date,
        sport,
        market: mkt,
        team: sd.team || sideKey,
        sideKey,
        tier,
        units,
        odds,
        won,
        profit,
        isFav: Number.isFinite(odds) && odds < 0,
        isDog: Number.isFinite(odds) && odds > 0,
        chalk: Number.isFinite(odds) && odds <= -150,
        heavyFav: Number.isFinite(odds) && odds <= -200,
        ags: Number.isFinite(sd.v8_agsV12) ? sd.v8_agsV12 : null,
        provenFor: Number(sd.v8_agsProvenForCount ?? NaN),
        wd: wd.map((w) => ({ wallet: w.wallet, side: w.side, invested: Number(w.invested) || 0 })),
        q0,
      });
    }
  }
}

const pathC = rows.filter((r) => PATH_C.has(r.tier));
const dates = [...new Set(pathC.map((r) => r.date))].sort();
const midDate = dates[Math.floor(dates.length / 2)] || CUTOFF;
process.stderr.write(`Path C n=${pathC.length} dates=${dates[0]}→${dates[dates.length - 1]} mid=${midDate}\n`);

const live = summarize(pathC);
process.stderr.write(`LIVE Path C: ${live.record} ${live.pnl}u ${live.roi}%\n`);

// ── Policy simulator on the live Path C set ───────────────────────────
// Because we only observe shipped Path C picks, threshold search can only
// DROP / RESIZE them — not invent new rescues. That is the right question
// for "optimal levels" of an already-too-loose gate.
function applyPolicy(list, policy) {
  const out = [];
  for (const r of list) {
    const q = sharpQuality(r.wd, r.sideKey, r.sport, {
      minQN: policy.minQN,
      minQRoi: policy.minQRoi,
      minPN: policy.minPN,
      wrBase: policy.wrBase,
      wrPrime: policy.wrPrime,
      minFor: policy.minFor,
      useSport: policy.useSport,
    });

    if (r.tier === 'MINI-') {
      if (policy.miniMode === 'drop') continue;
      if (policy.miniMode === 'uncut') {
        const u = oddsCap(policy.miniUnits ?? 3, r.odds);
        out.push({ ...r, units: u, profit: profitAt(u, r.odds, r.won), cfTier: 'MINI' });
      } else {
        // keep live cut
        const u = oddsCap(policy.miniCutUnits ?? 1, r.odds);
        out.push({ ...r, units: u, profit: profitAt(u, r.odds, r.won), cfTier: 'MINI-' });
      }
      continue;
    }

    if (r.tier === 'TOP+') {
      const canBoost = q.provenDollar
        && q.meanPWr != null
        && q.meanPWr >= (policy.topBoostWr ?? policy.wrBase)
        && q.forCount >= (policy.topBoostMinFor ?? policy.minFor)
        && (!policy.topBoostDogsOnly || r.isDog)
        && (!policy.noChalkBoost || !r.chalk)
        && (!policy.topBoostSports || policy.topBoostSports.includes(r.sport));
      if (policy.topMode === 'drop') continue;
      if (policy.topMode === 'demote' || !canBoost) {
        const u = oddsCap(policy.topUnits ?? 4, r.odds);
        out.push({ ...r, units: u, profit: profitAt(u, r.odds, r.won), cfTier: 'TOP' });
      } else {
        const u = oddsCap(policy.topBoostUnits ?? 5, r.odds);
        out.push({ ...r, units: u, profit: profitAt(u, r.odds, r.won), cfTier: 'TOP+' });
      }
      continue;
    }

    // SHARP / SHARP-PRIME rescues
    if (!q.qualifies) continue;
    if (policy.noMlbRescue && r.sport === 'MLB') continue;
    if (policy.sportsAllow && !policy.sportsAllow.includes(r.sport)) continue;
    if (policy.dogsOnly && !r.isDog) continue;
    if (policy.noChalk && r.chalk) continue;
    if (policy.noHeavyFav && r.heavyFav) continue;
    if (policy.noFavorites && r.isFav) continue;
    if (policy.minAgs != null && !(r.ags != null && r.ags >= policy.minAgs)) continue;
    if (policy.minProvenFor != null && !(r.provenFor >= policy.minProvenFor)) continue;

    const prime = q.prime && !policy.disablePrime;
    const baseU = prime ? (policy.primeUnits ?? 4) : (policy.sharpUnits ?? 3);
    const u = oddsCap(baseU, r.odds);
    out.push({ ...r, units: u, profit: profitAt(u, r.odds, r.won), cfTier: prime ? 'SHARP-PRIME' : 'SHARP' });
  }
  return out;
}

function scorePolicy(policy, list = pathC) {
  const bets = applyPolicy(list, policy);
  const s = summarize(bets);
  const early = summarize(applyPolicy(list.filter((r) => r.date < midDate), policy));
  const late = summarize(applyPolicy(list.filter((r) => r.date >= midDate), policy));
  // Stability: both halves non-terrible, prefer both green or early+late avg
  const bothGreen = (early.pnl ?? 0) > 0 && (late.pnl ?? 0) > 0;
  const halfFloor = Math.min(early.pnl ?? 0, late.pnl ?? 0);
  const wfPenalty = bothGreen ? 0 : Math.max(0, -halfFloor) * 0.5;
  // Prefer enough volume; penalize tiny books
  const nPenalty = s.n < 8 ? (8 - s.n) * 1.5 : 0;
  const objective = s.pnl - wfPenalty - nPenalty;
  return {
    ...s,
    earlyPnl: early.pnl,
    latePnl: late.pnl,
    earlyN: early.n,
    lateN: late.n,
    earlyRoi: early.roi,
    lateRoi: late.roi,
    bothGreen,
    halfFloor: +halfFloor.toFixed(2),
    objective: +objective.toFixed(2),
    policy,
  };
}

// ── Grid search ───────────────────────────────────────────────────────
const grid = [];
const minFors = [2, 3, 4];
const minQRois = [10, 15, 20, 25];
const wrBases = [50, 55, 60];
const wrPrimes = [55, 60, 65];
const minQNs = [8, 12];
const sharpUnitsOpts = [1, 1.5, 2, 3];
const primeUnitsOpts = [1.5, 2, 3, 4];
const topModes = ['boost', 'demote']; // boost=allow if gate passes; demote=always 4u
const miniModes = ['keep']; // always keep cut — known good
const structural = [
  { name: 'none' },
  { name: 'noMlbRescue', noMlbRescue: true },
  { name: 'dogsOnly', dogsOnly: true },
  { name: 'noChalk', noChalk: true },
  { name: 'noMlb+noChalk', noMlbRescue: true, noChalk: true },
  { name: 'noMlb+dogsOnly', noMlbRescue: true, dogsOnly: true },
];

let scanned = 0;
for (const minFor of minFors) {
  for (const minQRoi of minQRois) {
    for (const wrBase of wrBases) {
      for (const wrPrime of wrPrimes) {
        if (wrPrime < wrBase) continue;
        for (const minQN of minQNs) {
          for (const sharpUnits of sharpUnitsOpts) {
            for (const primeUnits of primeUnitsOpts) {
              if (primeUnits < sharpUnits) continue;
              for (const topMode of topModes) {
                for (const struct of structural) {
                  const policy = {
                    minFor,
                    minQRoi,
                    wrBase,
                    wrPrime,
                    minQN,
                    minPN: 5,
                    sharpUnits,
                    primeUnits,
                    topMode,
                    topUnits: 4,
                    topBoostUnits: 5,
                    topBoostWr: wrBase,
                    topBoostMinFor: minFor,
                    miniMode: 'keep',
                    miniCutUnits: 1,
                    disablePrime: false,
                    useSport: false,
                    ...struct,
                    structName: struct.name,
                  };
                  const scored = scorePolicy(policy);
                  grid.push(scored);
                  scanned++;
                }
              }
            }
          }
        }
      }
    }
  }
}

process.stderr.write(`Scanned ${scanned} policies\n`);

// Baseline live-as-is policy (approx)
const livePolicy = scorePolicy({
  minFor: 2, minQRoi: 10, wrBase: 50, wrPrime: 55, minQN: 8, minPN: 5,
  sharpUnits: 3, primeUnits: 4, topMode: 'boost', topUnits: 4, topBoostUnits: 5,
  topBoostWr: 50, topBoostMinFor: 2, miniMode: 'keep', miniCutUnits: 1,
  structName: 'live-defaults',
});

grid.sort((a, b) => b.objective - a.objective);

function policyKey(p) {
  return `for≥${p.minFor} $ROI≥${p.minQRoi} WR≥${p.wrBase}/${p.wrPrime} qn${p.minQN} ` +
    `u=${p.sharpUnits}/${p.primeUnits} top=${p.topMode} struct=${p.structName || 'none'}`;
}

console.log('\n=== LIVE BASELINE ===');
console.log(JSON.stringify({ ...live, midDate, dates: `${dates[0]}→${dates[dates.length - 1]}` }, null, 2));
console.log('\nLive-defaults reconstructed:', policyKey(livePolicy.policy), JSON.stringify({
  n: livePolicy.n, record: livePolicy.record, pnl: livePolicy.pnl, roi: livePolicy.roi,
  earlyPnl: livePolicy.earlyPnl, latePnl: livePolicy.latePnl, objective: livePolicy.objective,
}));

console.log('\n=== TOP 25 BY WALK-FORWARD OBJECTIVE ===');
const top25 = grid.slice(0, 25);
for (const s of top25) {
  console.log(
    `#${String(grid.indexOf(s) + 1).padStart(2)} obj=${String(s.objective).padStart(6)}  ` +
    `${s.record.padEnd(7)} n=${String(s.n).padStart(2)}  pnl=${String(s.pnl).padStart(6)}u  roi=${String(s.roi).padStart(5)}%  ` +
    `halves=${s.earlyPnl}/${s.latePnl}  ${policyKey(s.policy)}`,
  );
}

// Best with constraints
function bestWhere(label, pred) {
  const hit = grid.filter(pred)[0];
  if (!hit) {
    console.log(`\n${label}: none`);
    return null;
  }
  console.log(`\n${label}:`);
  console.log(`  ${policyKey(hit.policy)}`);
  console.log(`  ${hit.record} n=${hit.n} pnl=${hit.pnl}u roi=${hit.roi}%  halves ${hit.earlyPnl}/${hit.latePnl} obj=${hit.objective}`);
  return hit;
}

const bestOverall = bestWhere('BEST OVERALL (WF objective)', () => true);
const bestBothGreen = bestWhere('BEST BOTH HALVES GREEN', (s) => s.bothGreen);
const bestN20 = bestWhere('BEST WITH n≥20', (s) => s.n >= 20);
const bestN30 = bestWhere('BEST WITH n≥30', (s) => s.n >= 30);
const bestRoiN15 = bestWhere('BEST ROI WITH n≥15 & pnl>0', (s) => s.n >= 15 && s.pnl > 0 && s.roi != null);
// re-sort for ROI
const byRoi = [...grid].filter((s) => s.n >= 15 && s.pnl > 0).sort((a, b) => (b.roi ?? -999) - (a.roi ?? -999));
if (byRoi[0]) {
  console.log('\nBEST ROI n≥15 pnl>0:');
  console.log(`  ${policyKey(byRoi[0].policy)}`);
  console.log(`  ${byRoi[0].record} n=${byRoi[0].n} pnl=${byRoi[0].pnl}u roi=${byRoi[0].roi}% halves ${byRoi[0].earlyPnl}/${byRoi[0].latePnl}`);
}

// Marginal effect of each knob around live defaults (1D sweeps)
console.log('\n=== 1D SWEEPS AROUND LIVE DEFAULTS ===');
function oneD(label, values, setter) {
  console.log(`\n-- ${label} --`);
  for (const v of values) {
    const base = {
      minFor: 2, minQRoi: 10, wrBase: 50, wrPrime: 55, minQN: 8, minPN: 5,
      sharpUnits: 3, primeUnits: 4, topMode: 'boost', topUnits: 4, topBoostUnits: 5,
      topBoostWr: 50, topBoostMinFor: 2, miniMode: 'keep', miniCutUnits: 1,
      structName: 'none',
    };
    setter(base, v);
    const s = scorePolicy(base);
    console.log(`  ${String(v).padEnd(18)} ${s.record.padEnd(7)} n=${String(s.n).padStart(2)} pnl=${String(s.pnl).padStart(7)} roi=${String(s.roi).padStart(6)}% halves=${s.earlyPnl}/${s.latePnl} obj=${s.objective}`);
  }
}

oneD('minFor', [2, 3, 4, 5], (p, v) => { p.minFor = v; p.topBoostMinFor = v; });
oneD('minQRoi', [5, 10, 15, 20, 25, 30], (p, v) => { p.minQRoi = v; });
oneD('wrBase', [45, 50, 55, 60, 65], (p, v) => {
  p.wrBase = v; p.topBoostWr = v; if (p.wrPrime < v) p.wrPrime = v;
});
oneD('wrPrime', [50, 55, 60, 65, 70], (p, v) => { p.wrPrime = Math.max(v, p.wrBase); });
oneD('minQN', [5, 8, 10, 12, 15], (p, v) => { p.minQN = v; });
oneD('sharpUnits', [1, 1.5, 2, 2.5, 3], (p, v) => { p.sharpUnits = v; if (p.primeUnits < v) p.primeUnits = v; });
oneD('primeUnits', [2, 3, 4, 5], (p, v) => { p.primeUnits = Math.max(v, p.sharpUnits); });
oneD('topMode', ['boost', 'demote', 'drop'], (p, v) => { p.topMode = v; });
oneD('struct', structural.map((s) => s.name), (p, v) => {
  const s = structural.find((x) => x.name === v);
  p.structName = v;
  p.noMlbRescue = !!s.noMlbRescue;
  p.dogsOnly = !!s.dogsOnly;
  p.noChalk = !!s.noChalk;
});

// Recommend: prefer bothGreen + n≥15 if available, else best n≥20, else overall
const recommended = bestBothGreen && bestBothGreen.n >= 12
  ? bestBothGreen
  : (bestN20 || bestOverall);

console.log('\n=== RECOMMENDED ===');
console.log(JSON.stringify({
  key: policyKey(recommended.policy),
  stats: {
    n: recommended.n, record: recommended.record, pnl: recommended.pnl, roi: recommended.roi,
    earlyPnl: recommended.earlyPnl, latePnl: recommended.latePnl, objective: recommended.objective,
  },
  levels: {
    SHARP_MIN_FOR: recommended.policy.minFor,
    SHARP_MIN_QROI: recommended.policy.minQRoi,
    SHARP_WR_BASE: recommended.policy.wrBase,
    SHARP_WR_PRIME: recommended.policy.wrPrime,
    SHARP_MIN_QN: recommended.policy.minQN,
    SHARP_UNITS: recommended.policy.sharpUnits,
    SHARP_PRIME_UNITS: recommended.policy.primeUnits,
    TOP_MODE: recommended.policy.topMode,
    TOP_BOOST_UNITS: recommended.policy.topMode === 'boost' ? 5 : null,
    STRUCT: recommended.policy.structName,
    MINI_REDUCED_UNITS: 1,
  },
  vsLive: {
    deltaPnl: +(recommended.pnl - live.pnl).toFixed(2),
    deltaRoi: live.roi != null && recommended.roi != null ? +(recommended.roi - live.roi).toFixed(1) : null,
  },
}, null, 2));

// Also dump a compact Pareto front: pnl vs n
const pareto = [];
const byN = [...grid].filter((s) => s.pnl > 0).sort((a, b) => b.n - a.n || b.pnl - a.pnl);
let maxPnl = -Infinity;
for (const s of [...grid].filter((s) => s.n >= 8).sort((a, b) => b.pnl - a.pnl)) {
  if (s.pnl > maxPnl) {
    // not classic pareto; collect diverse good ones
  }
}
// true Pareto: maximize pnl and n
const cand = grid.filter((s) => s.n >= 8);
for (const s of cand) {
  const dominated = cand.some((o) =>
    (o.pnl >= s.pnl && o.n >= s.n && o.halfFloor >= s.halfFloor) &&
    (o.pnl > s.pnl || o.n > s.n || o.halfFloor > s.halfFloor));
  if (!dominated) pareto.push(s);
}
pareto.sort((a, b) => b.pnl - a.pnl);
console.log('\n=== PARETO (pnl, n, halfFloor) top 15 ===');
for (const s of pareto.slice(0, 15)) {
  console.log(`  pnl=${String(s.pnl).padStart(6)} n=${String(s.n).padStart(2)} halfFloor=${String(s.halfFloor).padStart(6)} roi=${String(s.roi).padStart(5)}%  ${policyKey(s.policy)}`);
}

writeFileSync('/tmp/pathc_optimal.json', JSON.stringify({
  live,
  midDate,
  dates,
  recommended: {
    key: policyKey(recommended.policy),
    ...recommended,
  },
  top25: top25.map((s) => ({ key: policyKey(s.policy), ...s, policy: s.policy })),
  pareto: pareto.slice(0, 30).map((s) => ({ key: policyKey(s.policy), ...s, policy: s.policy })),
  livePolicy,
}, null, 2));
console.log('\nWrote /tmp/pathc_optimal.json');
