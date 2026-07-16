/**
 * _surplus_policy_deploy_sim.mjs — May-fit → June-deploy bakeoff
 *
 * Fit CLV quartile thresholds on May 10–31 ONLY (knowable before June 1).
 * Apply fixed policies unchanged to the actual June 1+ UI staked book.
 *
 * Policies:
 *   BASELINE
 *   DROP_CLV_LOW
 *   DROP_SHARP
 *   TOPVSTOP_1U
 *   COMBO_KILL          drop CLV-low + SHARP; topVsTop → min(1u, units)
 *   KEEP_CORE           only (TopUnopp∪RANK∪SUPER/TOP) ∩ !CLV-low ∩ !SHARP
 *   BOOST_KEEPCORE      COMBO_KILL + keepCore ×1.35 (cap 6u) then oddsCap
 *
 * Local-only. No Firestore writes.
 *   node scripts/_surplus_policy_deploy_sim.mjs
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  buildClvLedgerFromPositions,
  computeForTop2PctPos,
  shortWalletId,
  CLV_HIST_FROM,
} from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(readFileSync(join(root, 'serviceAccountKey.json'), 'utf8'))),
  });
}
const db = admin.firestore();

const HIST_FROM = '2026-04-01';
const FIT_FROM = '2026-05-10';
const DEPLOY = '2026-06-01';
const MIN_N = 8;
const GLOBAL_CAP = 6;

const mean = xs => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 2) => (!Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n);
const shortId = w => shortWalletId(w);

function impliedProb(odds) {
  if (!odds || !Number.isFinite(Number(odds))) return null;
  const o = Number(odds);
  return o < 0 ? Math.abs(o) / (Math.abs(o) + 100) : 100 / (o + 100);
}
function profitAt(u, o, won) {
  if (!u) return 0;
  if (!won) return -u;
  return o < 0 ? u * (100 / Math.abs(o)) : u * (o / 100);
}
function oddsCap(u, o) {
  if (!Number.isFinite(o) || o === 0) return u;
  if (o >= 200) return Math.min(u, 1);
  if (o >= 151) return Math.min(u, 1.5);
  if (o >= 100) return Math.min(u, 2.5);
  return u;
}
function expectedUnitProfit(u, odds, pMkt) {
  if (!u || pMkt == null) return 0;
  const payout = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  return u * (pMkt * payout - (1 - pMkt));
}
function qtile(arr, p) {
  const s = [...arr].filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return null;
  return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
}
function weekKey(date) {
  // ISO-ish week bucket by Monday of that week
  const d = new Date(date + 'T12:00:00Z');
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

function resolveAgsuTier(sd) {
  const t = sd.v8_agsTier || sd.v8_agsV12Tier || sd.v8_lockTier;
  return typeof t === 'string' && t && t !== 'UNKNOWN' ? t : null;
}

function isUiStaked(data, sd) {
  if (!data?.date || sd.superseded || sd.cancelled || data.cancelled) return false;
  if (sd.result?.tracked === true) return false;
  const out = sd.result?.outcome;
  if (out !== 'WIN' && out !== 'LOSS') return false;
  if (!resolveAgsuTier(sd)) return false;
  const units = Number(sd.finalUnits ?? sd.v8_agsV12UnitsApplied ?? sd.v8_agsUnitsApplied ?? 0) || 0;
  return units > 0;
}

(async () => {
  console.error('Loading CLV ledger…');
  const posSnap = await db.collection('sharp_action_positions').where('status', '==', 'GRADED').get();
  const clvLedger = buildClvLedgerFromPositions(posSnap.docs.map(d => d.data()), { since: CLV_HIST_FROM });

  console.error('Loading sharpFlow collections…');
  const cols = ['sharpFlowPicks', 'sharpFlowSpreads', 'sharpFlowTotals'];
  const events = []; // all graded W/L with wallets (for causal boards)
  const candidates = []; // UI staked May10+ (fit+deploy universe)

  for (const col of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data?.date || data.date < HIST_FROM || !data.sides) continue;
      const sport = data.sport || 'NHL';
      for (const [sideKey, sd] of Object.entries(data.sides)) {
        if (sd.superseded) continue;
        const res = sd.result || {};
        if (res.outcome !== 'WIN' && res.outcome !== 'LOSS') continue;
        const peak = sd.peak || {};
        const lock = sd.lock || {};
        const scor = peak.v8Scoring || lock.v8Scoring || {};
        const wd = scor.walletDetails || [];
        const wallets = [];
        const seen = new Set();
        for (const w of wd) {
          const id = shortId(w.walletShort || w.wallet);
          if (!id || seen.has(id) || !w.side) continue;
          seen.add(id);
          wallets.push({ id, side: w.side, sizeRatio: Number(w.sizeRatio ?? w.betMultiplier ?? 0) || 0 });
        }
        const odds = Number(lock.odds ?? sd.odds ?? peak.odds ?? 0) || 0;
        const units = Number(sd.finalUnits ?? sd.v8_agsV12UnitsApplied ?? sd.v8_agsUnitsApplied ?? 0) || 0;
        const won = res.outcome === 'WIN' ? 1 : 0;
        events.push({ date: data.date, sport, sideKey, won, wallets });

        if (data.date >= FIT_FROM && isUiStaked(data, sd) && wallets.length) {
          const tier = sd.v8_hcStakeTier || 'UNTIERED';
          let clvTop2 = sd.v8_forTop2PctPos != null ? Number(sd.v8_forTop2PctPos) : null;
          if (clvTop2 == null || !Number.isFinite(clvTop2)) {
            clvTop2 = computeForTop2PctPos(wd, sideKey, data.date, clvLedger).top2Pct;
          }
          candidates.push({
            key: `${data.date}|${sport}|${doc.id}|${sideKey}`,
            date: data.date,
            sport,
            sideKey,
            won,
            odds,
            units,
            profit: Number(res.profit ?? profitAt(units, odds, won === 1)) || 0,
            pMkt: impliedProb(odds),
            hcTier: tier,
            isRank: tier === 'RANK' ? 1 : 0,
            isSharp: tier === 'SHARP' || tier === 'SHARP-PRIME' ? 1 : 0,
            superTop: ['SUPER', 'TOP', 'TOP+'].includes(tier) ? 1 : 0,
            pathA: ['SUPER', 'TOP', 'TOP+', 'MINI', 'MINI-', 'CONFIRMED'].includes(tier) ? 1 : 0,
            clvTop2,
            stampedTopUnopp: sd.v8_winnerAlignTopUnopp,
            stampedTopVsTop: sd.v8_winnerAlignTopVsTop,
            wallets,
          });
        }
      }
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date));
  candidates.sort((a, b) => a.date.localeCompare(b.date));
  console.error(`events=${events.length} candidates May10+=${candidates.length}`);

  // Causal Top-5 as-of day for TopUnopp / TopVsTop
  const st = new Map();
  const S = (id, s) => {
    const k = `${id}|${s}`;
    if (!st.has(k)) st.set(k, { w: 0, l: 0 });
    return st.get(k);
  };
  const topIds = sport => {
    const rows = [];
    for (const [k, v] of st) {
      if (!k.endsWith(`|${sport}`)) continue;
      const n = v.w + v.l;
      if (n < MIN_N) continue;
      rows.push({ id: k.split('|')[0], wr: (100 * v.w) / n, n });
    }
    rows.sort((a, b) => b.wr - a.wr || b.n - a.n);
    return new Set(rows.slice(0, 5).map(r => r.id));
  };

  const byDateCand = new Map();
  for (const c of candidates) {
    if (!byDateCand.has(c.date)) byDateCand.set(c.date, []);
    byDateCand.get(c.date).push(c);
  }

  let ei = 0;
  const enriched = [];
  while (ei < events.length) {
    const d = events[ei].date;
    const day = [];
    while (ei < events.length && events[ei].date === d) day.push(events[ei++]);
    const topsBy = new Map();
    for (const e of day) if (!topsBy.has(e.sport)) topsBy.set(e.sport, topIds(e.sport));

    for (const c of byDateCand.get(d) || []) {
      const tops = topsBy.get(c.sport) || new Set();
      const forWd = c.wallets.filter(w => w.side === c.sideKey);
      const agWd = c.wallets.filter(w => w.side !== c.sideKey);
      const forTop = forWd.filter(w => tops.has(w.id)).length;
      const agTop = agWd.filter(w => tops.has(w.id)).length;
      let topUnopp = forTop >= 1 && agTop === 0 ? 1 : 0;
      let topVsTop = forTop >= 1 && agTop >= 1 ? 1 : 0;
      if (c.stampedTopUnopp === true || c.stampedTopUnopp === 1) topUnopp = 1;
      if (c.stampedTopUnopp === false || c.stampedTopUnopp === 0) topUnopp = 0;
      if (c.stampedTopVsTop === true || c.stampedTopVsTop === 1) topVsTop = 1;
      if (c.stampedTopVsTop === false || c.stampedTopVsTop === 0) topVsTop = 0;
      enriched.push({ ...c, topUnopp, topVsTop });
    }

    for (const e of day) {
      for (const w of e.wallets) {
        if (w.side !== e.sideKey) continue;
        const s = S(w.id, e.sport);
        if (e.won) s.w++;
        else s.l++;
      }
    }
  }

  const may = enriched.filter(r => r.date >= FIT_FROM && r.date < DEPLOY);
  const june = enriched.filter(r => r.date >= DEPLOY && r.pMkt != null);
  console.error(`mayFit=${may.length} juneDeploy=${june.length}`);

  const mayClv = may.map(r => r.clvTop2).filter(Number.isFinite);
  const TH = {
    clvLo: qtile(mayClv, 0.25),
    clvHi: qtile(mayClv, 0.75),
    mayN: may.length,
    mayClvN: mayClv.length,
  };
  console.error(`TH May CLV lo=${TH.clvLo} hi=${TH.clvHi} (n=${TH.mayClvN})`);

  function flags(r) {
    const clvLow = r.clvTop2 != null && Number.isFinite(r.clvTop2) && r.clvTop2 <= TH.clvLo;
    const clvHigh = r.clvTop2 != null && Number.isFinite(r.clvTop2) && r.clvTop2 >= TH.clvHi;
    const keepCore =
      (r.topUnopp === 1 || r.isRank === 1 || r.superTop === 1) && !clvLow && !r.isSharp;
    return { clvLow, clvHigh, keepCore };
  }

  const POL = {
    BASELINE: r => r.units,
    DROP_CLV_LOW: r => (flags(r).clvLow ? 0 : r.units),
    DROP_SHARP: r => (r.isSharp ? 0 : r.units),
    TOPVSTOP_1U: r => (r.topVsTop ? Math.min(1, r.units) : r.units),
    COMBO_KILL: r => {
      const f = flags(r);
      if (f.clvLow || r.isSharp) return 0;
      if (r.topVsTop) return Math.min(1, r.units);
      return r.units;
    },
    KEEP_CORE: r => (flags(r).keepCore ? r.units : 0),
    BOOST_KEEPCORE: r => {
      const f = flags(r);
      if (f.clvLow || r.isSharp) return 0;
      let u = r.units;
      if (r.topVsTop) u = Math.min(1, u);
      if (f.keepCore) u = Math.min(GLOBAL_CAP, u * 1.35);
      return u;
    },
  };

  function runPolicy(name, unitsFn) {
    let n = 0, w = 0, stake = 0, pnl = 0, surplus = 0, dropped = 0;
    const weekly = new Map();
    for (const r of june) {
      let u = unitsFn(r);
      u = oddsCap(Math.max(0, u), r.odds);
      if (u <= 0) {
        dropped++;
        continue;
      }
      n++;
      if (r.won) w++;
      const p = profitAt(u, r.odds, r.won === 1);
      const e = expectedUnitProfit(u, r.odds, r.pMkt);
      stake += u;
      pnl += p;
      surplus += p - e;
      const wk = weekKey(r.date);
      if (!weekly.has(wk)) weekly.set(wk, { stake: 0, pnl: 0, surplus: 0, n: 0 });
      const g = weekly.get(wk);
      g.stake += u;
      g.pnl += p;
      g.surplus += p - e;
      g.n++;
    }
    const weeks = [...weekly.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([week, g]) => ({
        week,
        n: g.n,
        stake: rnd(g.stake),
        pnl: rnd(g.pnl),
        surplus: rnd(g.surplus),
        roi: g.stake ? rnd((100 * g.pnl) / g.stake, 1) : null,
      }));
    // cumulative
    let cStake = 0, cPnl = 0;
    const cum = weeks.map(w => {
      cStake += w.stake;
      cPnl += w.pnl;
      return { week: w.week, cumStake: rnd(cStake), cumPnl: rnd(cPnl), cumRoi: cStake ? rnd((100 * cPnl) / cStake, 1) : null };
    });
    return {
      name,
      n,
      dropped,
      wr: n ? rnd((100 * w) / n, 1) : null,
      stake: rnd(stake),
      pnl: rnd(pnl),
      surplus: rnd(surplus),
      roi: stake ? rnd((100 * pnl) / stake, 1) : null,
      deltaPnl: null, // fill vs baseline later
      weeks,
      cum,
    };
  }

  const results = {};
  for (const [name, fn] of Object.entries(POL)) {
    results[name] = runPolicy(name, fn);
  }
  const basePnl = results.BASELINE.pnl;
  const baseSurplus = results.BASELINE.surplus;
  for (const r of Object.values(results)) {
    r.deltaPnl = rnd(r.pnl - basePnl);
    r.deltaSurplus = rnd(r.surplus - baseSurplus);
    r.deltaStake = rnd(r.stake - results.BASELINE.stake);
  }

  // Also: walk-forward — recompute CLV quartiles using all history before each June week (sensitivity)
  const wf = [];
  const juneWeeks = [...new Set(june.map(r => weekKey(r.date)))].sort();
  for (const wk of juneWeeks) {
    const prior = enriched.filter(r => r.date < wk && r.date >= FIT_FROM);
    const priorClv = prior.map(r => r.clvTop2).filter(Number.isFinite);
    const lo = qtile(priorClv, 0.25);
    const hi = qtile(priorClv, 0.75);
    const weekRows = june.filter(r => weekKey(r.date) === wk);
    const apply = (unitsFn) => {
      let stake = 0, pnl = 0, n = 0;
      for (const r of weekRows) {
        const clvLow = r.clvTop2 != null && lo != null && r.clvTop2 <= lo;
        const keepCore = (r.topUnopp === 1 || r.isRank === 1 || r.superTop === 1) && !clvLow && !r.isSharp;
        const ctx = { ...r, _clvLow: clvLow, _keepCore: keepCore };
        let u = unitsFn(ctx);
        u = oddsCap(Math.max(0, u), r.odds);
        if (u <= 0) continue;
        n++;
        stake += u;
        pnl += profitAt(u, r.odds, r.won === 1);
      }
      return { n, stake: rnd(stake), pnl: rnd(pnl), roi: stake ? rnd((100 * pnl) / stake, 1) : null };
    };
    wf.push({
      week: wk,
      clvLo: lo,
      clvHi: hi,
      priorN: prior.length,
      BASELINE: apply(r => r.units),
      BOOST_KEEPCORE: apply(r => {
        if (r._clvLow || r.isSharp) return 0;
        let u = r.units;
        if (r.topVsTop) u = Math.min(1, u);
        if (r._keepCore) u = Math.min(GLOBAL_CAP, u * 1.35);
        return u;
      }),
      COMBO_KILL: apply(r => {
        if (r._clvLow || r.isSharp) return 0;
        if (r.topVsTop) return Math.min(1, r.units);
        return r.units;
      }),
    });
  }

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      fitWindow: `${FIT_FROM} → ${DEPLOY} (exclusive)`,
      deployFrom: DEPLOY,
      thresholds: TH,
      note: 'CLV p25/p75 fit on May UI-staked book only. Policies frozen for June+.',
    },
    mayBook: {
      n: may.length,
      wr: may.length ? rnd((100 * sum(may.map(r => r.won))) / may.length, 1) : null,
      units: rnd(sum(may.map(r => r.units))),
      pnl: rnd(sum(may.map(r => r.profit))),
    },
    policies: results,
    walkForwardWeekly: wf,
    ranking: Object.values(results)
      .map(r => ({ name: r.name, pnl: r.pnl, surplus: r.surplus, roi: r.roi, deltaPnl: r.deltaPnl, n: r.n, stake: r.stake }))
      .sort((a, b) => b.pnl - a.pnl),
  };

  writeFileSync(join(root, 'tmp_surplus_policy_deploy_sim.json'), JSON.stringify(out, null, 2));

  const L = [];
  L.push('# Surplus Policy Deploy Sim — May-fit → June-deploy');
  L.push('');
  L.push(`Generated: ${out.meta.generatedAt}`);
  L.push('');
  L.push('## Discipline');
  L.push(`- Fit CLV quartiles on **${FIT_FROM} → ${DEPLOY}** only (May UI-staked n=${TH.mayN}, CLV n=${TH.mayClvN})`);
  L.push(`- Frozen thresholds: CLV-low ≤ **${rnd(TH.clvLo, 2)}** · CLV-high ≥ **${rnd(TH.clvHi, 2)}**`);
  L.push(`- Deploy on June 1+ actual UI staked book (n=${june.length})`);
  L.push('- Odds cap applied after policy (same production bands)');
  L.push('');
  L.push('## June+ policy bakeoff');
  L.push('| Policy | n | dropped | stake | WR | PnL | ROI | Surplus | ΔPnL |');
  L.push('|--------|---|---------|-------|----|-----|-----|---------|------|');
  for (const r of out.ranking) {
    const full = results[r.name];
    L.push(`| **${r.name}** | ${full.n} | ${full.dropped} | ${full.stake}u | ${full.wr}% | **${full.pnl}u** | ${full.roi}% | ${full.surplus}u | ${full.deltaPnl}u |`);
  }
  L.push('');
  L.push('## Weekly cumulative — BASELINE vs BOOST_KEEPCORE');
  L.push('| Week | Base cum PnL | Boost cum PnL | Base ROI | Boost ROI |');
  L.push('|------|--------------|---------------|----------|-----------|');
  const baseCum = results.BASELINE.cum;
  const boostCum = results.BOOST_KEEPCORE.cum;
  const weeks = baseCum.map(w => w.week);
  for (const wk of weeks) {
    const b = baseCum.find(x => x.week === wk);
    const g = boostCum.find(x => x.week === wk);
    L.push(`| ${wk} | ${b?.cumPnl}u | ${g?.cumPnl}u | ${b?.cumRoi}% | ${g?.cumRoi}% |`);
  }
  L.push('');
  L.push('## Walk-forward sensitivity (CLV thresholds refresh each week from prior history)');
  L.push('| Week | prior n | CLV lo | Base PnL | Combo PnL | Boost PnL |');
  L.push('|------|---------|--------|----------|-----------|-----------|');
  for (const w of wf) {
    L.push(`| ${w.week} | ${w.priorN} | ${rnd(w.clvLo, 1)} | ${w.BASELINE.pnl}u | ${w.COMBO_KILL.pnl}u | ${w.BOOST_KEEPCORE.pnl}u |`);
  }
  const wfBase = rnd(sum(wf.map(w => w.BASELINE.pnl)));
  const wfBoost = rnd(sum(wf.map(w => w.BOOST_KEEPCORE.pnl)));
  const wfCombo = rnd(sum(wf.map(w => w.COMBO_KILL.pnl)));
  L.push('');
  L.push(`Walk-forward totals: BASE **${wfBase}u** · COMBO_KILL **${wfCombo}u** · BOOST_KEEPCORE **${wfBoost}u**`);
  L.push('');
  L.push('## Verdict');
  const winner = out.ranking[0];
  L.push(`- Best June PnL: **${winner.name}** at **${winner.pnl}u** (Δ ${winner.deltaPnl}u vs baseline, ROI ${winner.roi}%)`);
  L.push(`- Walk-forward boost vs base: **${rnd(wfBoost - wfBase)}u**`);
  if (winner.deltaPnl > 0 && wfBoost >= wfBase) {
    L.push('- **PASS for further production design** — fixed May thresholds and walk-forward both non-negative vs baseline.');
  } else if (winner.deltaPnl > 0) {
    L.push('- **MIXED** — in-sample June with frozen May TH wins, but walk-forward weaker; do not ship boost blindly.');
  } else {
    L.push('- **FAIL** — policy does not beat baseline out of sample.');
  }
  L.push('');
  L.push('## Artifacts');
  L.push('- `tmp_surplus_policy_deploy_sim.json`');
  L.push('- `SURPLUS_POLICY_DEPLOY_SIM.md`');
  L.push('- `scripts/_surplus_policy_deploy_sim.mjs`');

  writeFileSync(join(root, 'SURPLUS_POLICY_DEPLOY_SIM.md'), L.join('\n'));

  console.log('\n========== DEPLOY SIM ==========');
  console.log(JSON.stringify({
    thresholds: TH,
    ranking: out.ranking,
    walkForwardTotals: { base: wfBase, combo: wfCombo, boost: wfBoost, boostMinusBase: rnd(wfBoost - wfBase) },
  }, null, 2));
  console.log('\nWrote tmp_surplus_policy_deploy_sim.json + SURPLUS_POLICY_DEPLOY_SIM.md');
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
