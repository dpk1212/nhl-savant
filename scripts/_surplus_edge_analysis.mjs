/**
 * _surplus_edge_analysis.mjs — Next research stack after additive winprob
 *
 * 1) SURPLUS label: residual = won − p_mkt (and $ surplus vs efficient market)
 * 2) Selection vs sizing: flat 1u vs actual units vs oracle keep-slices
 * 3) Kill-list ablation: dollar value of dropping/downsizing poison cells
 *
 * Reads tmp_additive_winprob_june1_rows.csv (June 1+ UI staked W/L book).
 * Local-only. No Firestore writes.
 *
 *   node scripts/_surplus_edge_analysis.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const mean = xs => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
const sum = xs => xs.reduce((s, x) => s + x, 0);
const rnd = (x, n = 2) => (!Number.isFinite(x) ? null : Math.round(x * 10 ** n) / 10 ** n);

function a2d(o) {
  return o > 0 ? 1 + o / 100 : 1 + 100 / Math.abs(o);
}
function flatProfit(odds, won) {
  return won ? a2d(odds) - 1 : -1;
}
/** Expected flat profit if market is efficient at pMkt. */
function expectedFlat(odds, pMkt) {
  const payout = a2d(odds) - 1;
  return pMkt * payout - (1 - pMkt);
}
function qtile(arr, p) {
  const s = [...arr].filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return null;
  return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
}

function parseCsv(text) {
  const lines = text.trim().split('\n');
  const hdr = lines[0].split(',');
  return lines.slice(1).map(line => {
    const p = line.split(',');
    const o = {};
    hdr.forEach((h, i) => { o[h] = p[i]; });
    const num = k => (o[k] === '' || o[k] == null ? null : Number(o[k]));
    return {
      date: o.date,
      sport: o.sport,
      mkt: o.mkt,
      won: Number(o.won),
      odds: Number(o.odds),
      units: Number(o.units),
      profit: Number(o.profit),
      pMkt: Number(o.pMkt),
      agsV12: num('agsV12'),
      conviction: num('conviction'),
      edge: num('edge'),
      clvTop2: num('clvTop2'),
      isRank: Number(o.isRank) || 0,
      isSharp: Number(o.isSharp) || 0,
      hcMargin: num('hcMargin') ?? 0,
      topUnopp: Number(o.topUnopp) || 0,
      topVsTop: Number(o.topVsTop) || 0,
      deltaQ: num('deltaQ') ?? 0,
      hcTier: o.hcTier || 'UNTIERED',
      agsTier: o.agsTier,
    };
  });
}

function enrich(r) {
  const flat = flatProfit(r.odds, r.won === 1);
  const eFlat = expectedFlat(r.odds, r.pMkt);
  const residual = r.won - r.pMkt; // pp later ×100
  const flatSurplus = flat - eFlat;
  const unitSurplus = r.profit - r.units * eFlat; // $ vs efficient at our size
  const pathA = ['SUPER', 'TOP', 'TOP+', 'MINI', 'MINI-', 'CONFIRMED'].includes(r.hcTier);
  const superTop = ['SUPER', 'TOP', 'TOP+'].includes(r.hcTier);
  return {
    ...r,
    flat,
    eFlat,
    residual,
    flatSurplus,
    unitSurplus,
    pathA: pathA ? 1 : 0,
    superTop: superTop ? 1 : 0,
  };
}

function metrics(xs, label) {
  if (!xs.length) return { label, n: 0 };
  const w = sum(xs.map(r => r.won));
  const units = sum(xs.map(r => r.units));
  const pnl = sum(xs.map(r => r.profit));
  const flatPnl = sum(xs.map(r => r.flat));
  const eFlatPnl = sum(xs.map(r => r.eFlat));
  const unitSurplus = sum(xs.map(r => r.unitSurplus));
  const flatSurplus = sum(xs.map(r => r.flatSurplus));
  return {
    label,
    n: xs.length,
    wr: rnd(100 * w / xs.length, 1),
    units: rnd(units, 1),
    pnl: rnd(pnl, 2),
    roi: rnd(units ? (100 * pnl) / units : 0, 1),
    flatPnl: rnd(flatPnl, 2),
    flatRoi: rnd(100 * flatPnl / xs.length, 1),
    residualPp: rnd(100 * mean(xs.map(r => r.residual)), 2),
    flatSurplus: rnd(flatSurplus, 2),
    unitSurplus: rnd(unitSurplus, 2),
    expectedFlatPnl: rnd(eFlatPnl, 2),
  };
}

/** Pearson corr of feature vs residual (surplus direction). */
function corr(xs, getX, getY = r => r.residual) {
  const pairs = xs.map(r => [getX(r), getY(r)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
  if (pairs.length < 30) return null;
  const mx = mean(pairs.map(p => p[0]));
  const my = mean(pairs.map(p => p[1]));
  let num = 0, dx = 0, dy = 0;
  for (const [a, b] of pairs) {
    num += (a - mx) * (b - my);
    dx += (a - mx) ** 2;
    dy += (b - my) ** 2;
  }
  const d = Math.sqrt(dx * dy) || 1;
  return { n: pairs.length, r: rnd(num / d, 4) };
}

/** Winsorize then ridge OLS on residual. Heavy λ — residual is tiny; avoid explosion. */
function ridgeSurplus(rows, names, lambda = 40) {
  const chron = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const nFolds = 3;
  const foldSize = Math.floor(chron.length / (nFolds + 1));
  const oos = [];
  const foldR2 = [];

  function winsor(xs, loP = 0.05, hiP = 0.95) {
    const s = [...xs].filter(Number.isFinite).sort((a, b) => a - b);
    if (s.length < 10) return { lo: -1e9, hi: 1e9 };
    return {
      lo: s[Math.floor(loP * (s.length - 1))],
      hi: s[Math.floor(hiP * (s.length - 1))],
    };
  }

  function fit(train) {
    const stats = {};
    for (const n of names) {
      const xs = train.map(r => Number(r[n])).filter(Number.isFinite);
      const { lo, hi } = winsor(xs);
      const clipped = xs.map(x => Math.max(lo, Math.min(hi, x)));
      const fill = clipped.length ? mean(clipped) : 0;
      const m0 = fill;
      const sd = Math.sqrt(mean(clipped.map(x => (x - m0) ** 2)) || 1) || 1;
      stats[n] = { m: m0, sd, fill, lo, hi };
    }
    const Z = r => names.map(n => {
      let v = Number.isFinite(Number(r[n])) ? Number(r[n]) : stats[n].fill;
      v = Math.max(stats[n].lo, Math.min(stats[n].hi, v));
      return (v - stats[n].m) / stats[n].sd;
    });
    const X = train.map(r => [1, ...Z(r)]);
    const y = train.map(r => r.residual);
    const p = names.length + 1;
    const A = Array.from({ length: p }, () => Array(p).fill(0));
    const b = Array(p).fill(0);
    for (let i = 0; i < X.length; i++) {
      for (let a = 0; a < p; a++) {
        b[a] += X[i][a] * y[i];
        for (let c = 0; c < p; c++) A[a][c] += X[i][a] * X[i][c];
      }
    }
    for (let a = 1; a < p; a++) A[a][a] += lambda;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let c = 0; c < p; c++) {
      let piv = c;
      for (let r = c + 1; r < p; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
      [M[c], M[piv]] = [M[piv], M[c]];
      const dv = M[c][c] || 1e-12;
      for (let cc = c; cc <= p; cc++) M[c][cc] /= dv;
      for (let r = 0; r < p; r++) {
        if (r === c) continue;
        const f = M[r][c];
        for (let cc = c; cc <= p; cc++) M[r][cc] -= f * M[c][cc];
      }
    }
    const beta = M.map(row => row[p]);
    return {
      beta,
      stats,
      predict(r) {
        const z = Z(r);
        let s = beta[0];
        for (let j = 0; j < z.length; j++) s += beta[j + 1] * z[j];
        // residual is in [-1,1]; clamp predictions
        return Math.max(-0.5, Math.min(0.5, s));
      },
    };
  }

  for (let f = 0; f < nFolds; f++) {
    const trainEnd = foldSize * (f + 2);
    const testEnd = Math.min(chron.length, trainEnd + foldSize);
    if (trainEnd < 80 || testEnd <= trainEnd) continue;
    const train = chron.slice(0, trainEnd);
    const test = chron.slice(trainEnd, testEnd);
    const m = fit(train);
    const preds = test.map(r => m.predict(r));
    const ys = test.map(r => r.residual);
    const sse = sum(preds.map((p, i) => (p - ys[i]) ** 2));
    const ybar = mean(ys);
    const sst = sum(ys.map(y => (y - ybar) ** 2)) || 1;
    foldR2.push(rnd(1 - sse / sst, 4));
    test.forEach((r, i) => oos.push({ ...r, predResidual: preds[i] }));
  }

  const holdCut = Math.floor(chron.length * 0.7);
  const final = fit(chron.slice(0, holdCut));
  const coefRank = names.map((n, j) => ({
    feature: n,
    beta_z: rnd(final.beta[j + 1], 4),
    abs: Math.abs(final.beta[j + 1]),
  })).sort((a, b) => b.abs - a.abs);
  coefRank.forEach((c, i) => { c.rank = i + 1; });

  return {
    meanOosR2: rnd(mean(foldR2), 4),
    foldR2,
    coefRank,
    intercept: rnd(final.beta[0], 4),
    oos,
    final,
  };
}

function main() {
  const raw = parseCsv(readFileSync(join(root, 'tmp_additive_winprob_june1_rows.csv'), 'utf8'));
  const data = raw.map(enrich);
  const clvHi = qtile(data.map(r => r.clvTop2), 0.75);
  const clvLo = qtile(data.map(r => r.clvTop2), 0.25);
  const convHi = qtile(data.map(r => r.conviction), 0.75);

  for (const r of data) {
    r.clvHigh = r.clvTop2 != null && r.clvTop2 >= clvHi ? 1 : 0;
    r.clvLow = r.clvTop2 != null && r.clvTop2 <= clvLo ? 1 : 0;
    r.convHigh = r.conviction != null && r.conviction >= convHi ? 1 : 0;
    r.keepCore = (r.topUnopp === 1 || r.isRank === 1 || r.superTop === 1) && r.clvLow !== 1 && r.isSharp !== 1 ? 1 : 0;
  }

  // ── 1) Book surplus + feature → residual correlations ──
  const book = metrics(data, 'ALL book');
  const featCorr = [
    ['conviction', r => r.conviction],
    ['clvTop2', r => r.clvTop2],
    ['topUnopp', r => r.topUnopp],
    ['topVsTop', r => r.topVsTop],
    ['hcMargin', r => r.hcMargin],
    ['agsV12', r => r.agsV12],
    ['edge', r => r.edge],
    ['isRank', r => r.isRank],
    ['isSharp', r => r.isSharp],
    ['pathA', r => r.pathA],
    ['superTop', r => r.superTop],
    ['deltaQ', r => r.deltaQ],
    ['pMkt', r => r.pMkt],
  ].map(([name, fn]) => {
    const c = corr(data, fn);
    return c ? { feature: name, ...c } : { feature: name, n: 0, r: null };
  }).sort((a, b) => Math.abs(b.r || 0) - Math.abs(a.r || 0));

  const FEATS = ['conviction', 'clvTop2', 'topUnopp', 'topVsTop', 'hcMargin', 'agsV12', 'edge', 'isRank', 'isSharp', 'deltaQ', 'pathA'];
  const surplusModel = ridgeSurplus(data, FEATS, 40);

  // Rule-based surplus score (interpretable tape score) — primary ranker
  for (const r of data) {
    r.tapeScore =
      2 * r.topUnopp +
      2 * r.clvHigh +
      1.5 * r.superTop +
      1.5 * r.isRank +
      1 * r.convHigh +
      1 * r.pathA -
      2 * r.clvLow -
      2 * r.isSharp -
      1.5 * r.topVsTop;
  }
  const byTape = [...data].sort((a, b) => a.tapeScore - b.tapeScore);
  const tapeBuckets = [];
  for (let q = 0; q < 5; q++) {
    const a = Math.floor((q * byTape.length) / 5);
    const b = Math.floor(((q + 1) * byTape.length) / 5);
    tapeBuckets.push(metrics(byTape.slice(a, b), q === 4 ? 'top_tapeScore' : q === 0 ? 'bot_tapeScore' : `tape_Q${q + 1}`));
  }

  // OOS surplus quintiles by predicted residual
  const oos = surplusModel.oos;
  const scored = [...oos].sort((a, b) => a.predResidual - b.predResidual);
  const nQ = 5;
  const surplusBuckets = [];
  for (let q = 0; q < nQ; q++) {
    const a = Math.floor((q * scored.length) / nQ);
    const b = Math.floor(((q + 1) * scored.length) / nQ);
    surplusBuckets.push(metrics(scored.slice(a, b), q === nQ - 1 ? 'top_pred_surplus' : q === 0 ? 'bot_pred_surplus' : `Q${q + 1}`));
  }

  // ── 2) Selection vs sizing ──
  const flat1uPnl = sum(data.map(r => r.flat));
  const flat1uSurplus = sum(data.map(r => r.flatSurplus));
  const actualPnl = sum(data.map(r => r.profit));
  const actualSurplus = sum(data.map(r => r.unitSurplus));
  const actualUnits = sum(data.map(r => r.units));

  // If we sized EVERY pick at book-average units
  const avgU = actualUnits / data.length;
  const evenSizePnl = sum(data.map(r => r.flat * avgU));
  const evenSizeSurplus = sum(data.map(r => r.flatSurplus * avgU));

  // Sizing skill = actual − even-size on same selection
  const sizingSkill = actualPnl - evenSizePnl;
  const selectionSkillFlat = flat1uSurplus; // surplus from WHICH picks at 1u

  const selSize = {
    flat1u: {
      n: data.length,
      pnl: rnd(flat1uPnl, 2),
      surplus: rnd(flat1uSurplus, 2),
      roi: rnd(100 * flat1uPnl / data.length, 1),
    },
    evenSizeAtAvgU: {
      avgU: rnd(avgU, 2),
      pnl: rnd(evenSizePnl, 2),
      surplus: rnd(evenSizeSurplus, 2),
      roi: rnd(100 * evenSizePnl / actualUnits, 1),
    },
    actual: {
      units: rnd(actualUnits, 1),
      pnl: rnd(actualPnl, 2),
      surplus: rnd(actualSurplus, 2),
      roi: rnd(100 * actualPnl / actualUnits, 1),
    },
    attribution: {
      selectionSurplus_flat1u: rnd(selectionSkillFlat, 2),
      sizingSkill_vsEven: rnd(sizingSkill, 2),
      note: 'selectionSurplus = flat1u surplus vs efficient market; sizingSkill = actual PnL − even-size PnL on same picks',
    },
  };

  // Oracle keep books (selection only, at actual units of kept picks)
  const oracles = [
    { id: 'keep_topUnopp', pred: r => r.topUnopp === 1 },
    { id: 'keep_clvHigh', pred: r => r.clvHigh === 1 },
    { id: 'keep_rank_or_superTop', pred: r => r.isRank === 1 || r.superTop === 1 },
    { id: 'keep_core', pred: r => r.keepCore === 1 },
    { id: 'keep_convHigh', pred: r => r.convHigh === 1 },
    { id: 'drop_nothing', pred: () => true },
  ].map(o => {
    const xs = data.filter(o.pred);
    const m = metrics(xs, o.id);
    const flatOnKept = sum(xs.map(r => r.flat));
    return {
      ...m,
      flat1uPnl: rnd(flatOnKept, 2),
      flat1uSurplus: rnd(sum(xs.map(r => r.flatSurplus)), 2),
      pctOfBookN: rnd(100 * xs.length / data.length, 1),
      pctOfBookUnits: rnd(100 * sum(xs.map(r => r.units)) / actualUnits, 1),
    };
  });

  // ── 3) Kill-list ablation (apply to actual book) ──
  function ablate(name, transform) {
    let units = 0, pnl = 0, n = 0, nDropped = 0, nDown = 0;
    let surplus = 0;
    for (const r of data) {
      const t = transform(r);
      if (!t || t.units <= 0) {
        nDropped++;
        continue;
      }
      n++;
      if (t.units < r.units - 1e-9) nDown++;
      const scale = t.units / r.units;
      // scale profit/surplus approximately by unit ratio (same outcome)
      const p = r.profit * scale;
      const s = r.unitSurplus * scale;
      units += t.units;
      pnl += p;
      surplus += s;
    }
    return {
      name,
      n,
      nDropped,
      nDownsized: nDown,
      units: rnd(units, 1),
      pnl: rnd(pnl, 2),
      roi: rnd(units ? (100 * pnl) / units : 0, 1),
      unitSurplus: rnd(surplus, 2),
      deltaPnl: rnd(pnl - actualPnl, 2),
      deltaSurplus: rnd(surplus - actualSurplus, 2),
      deltaUnits: rnd(units - actualUnits, 1),
    };
  }

  const ablations = [
    ablate('baseline', r => ({ units: r.units })),
    ablate('drop_clvLow', r => (r.clvLow ? null : { units: r.units })),
    ablate('drop_SHARP', r => (r.isSharp ? null : { units: r.units })),
    ablate('drop_topVsTop', r => (r.topVsTop ? null : { units: r.units })),
    ablate('topVsTop_to_1u', r => (r.topVsTop ? { units: Math.min(1, r.units) } : { units: r.units })),
    ablate('drop_clvLow_and_SHARP', r => (r.clvLow || r.isSharp ? null : { units: r.units })),
    ablate('combo_kill', r => {
      if (r.clvLow || r.isSharp) return null;
      if (r.topVsTop) return { units: Math.min(1, r.units) };
      return { units: r.units };
    }),
    ablate('only_keepCore', r => (r.keepCore ? { units: r.units } : null)),
    ablate('boost_keepCore_1p35', r => {
      if (r.clvLow || r.isSharp) return null;
      if (r.topVsTop) return { units: Math.min(1, r.units) };
      if (r.keepCore) return { units: Math.min(6, r.units * 1.35) };
      return { units: r.units };
    }),
  ];

  // Joint cells
  function cell(name, pred) {
    return metrics(data.filter(pred), name);
  }
  const joints = [
    cell('TopUnopp × CLV high', r => r.topUnopp && r.clvHigh),
    cell('TopUnopp × CLV low', r => r.topUnopp && r.clvLow),
    cell('TopUnopp × mid CLV', r => r.topUnopp && !r.clvHigh && !r.clvLow),
    cell('TopVsTop × any', r => r.topVsTop),
    cell('PathA × TopUnopp', r => r.pathA && r.topUnopp),
    cell('PathA × TopVsTop', r => r.pathA && r.topVsTop),
    cell('RANK × CLV high', r => r.isRank && r.clvHigh),
    cell('SHARP × CLV high', r => r.isSharp && r.clvHigh),
    cell('SHARP × CLV low', r => r.isSharp && r.clvLow),
    cell('SUPER/TOP × TopUnopp', r => r.superTop && r.topUnopp),
    cell('SUPER/TOP × TopVsTop', r => r.superTop && r.topVsTop),
    cell('keepCore', r => r.keepCore),
  ].filter(c => c.n > 0);

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'tmp_additive_winprob_june1_rows.csv',
      clvHi,
      clvLo,
      convHi,
      keepCoreDef: '(topUnopp OR RANK OR SUPER/TOP) AND NOT clvLow AND NOT SHARP',
    },
    book,
    selSize,
    featureCorrVsResidual: featCorr,
    surplusModel: {
      meanOosR2: surplusModel.meanOosR2,
      foldR2: surplusModel.foldR2,
      intercept: surplusModel.intercept,
      coefRank: surplusModel.coefRank,
      oosBuckets: surplusBuckets,
    },
    tapeScoreBuckets: tapeBuckets,
    oracles,
    ablations,
    joints,
  };

  writeFileSync(join(root, 'tmp_surplus_edge_june1.json'), JSON.stringify(out, null, 2));

  // Markdown
  const L = [];
  L.push('# Surplus Edge Analysis — June 1+ staked book');
  L.push('');
  L.push(`Generated: ${out.meta.generatedAt}`);
  L.push('');
  L.push('## 0 · Proof we beat the market');
  L.push(`- n=${book.n} · WR ${book.wr}% · actual PnL **${book.pnl}u** · ROI **${book.roi}%**`);
  L.push(`- Unit surplus vs efficient market: **${book.unitSurplus}u** (expected flat≈0 → this is pure edge)`);
  L.push(`- Mean residual (won − p_mkt): **${book.residualPp}pp**`);
  L.push('');
  L.push('## 1 · Selection vs sizing');
  L.push('| Book | PnL | Surplus | ROI |');
  L.push('|------|-----|---------|-----|');
  L.push(`| Flat 1u (selection only) | ${selSize.flat1u.pnl}u | ${selSize.flat1u.surplus}u | ${selSize.flat1u.roi}% |`);
  L.push(`| Even-size @ avg ${selSize.evenSizeAtAvgU.avgU}u | ${selSize.evenSizeAtAvgU.pnl}u | ${selSize.evenSizeAtAvgU.surplus}u | ${selSize.evenSizeAtAvgU.roi}% |`);
  L.push(`| **Actual sizing** | **${selSize.actual.pnl}u** | **${selSize.actual.surplus}u** | **${selSize.actual.roi}%** |`);
  L.push('');
  L.push(`- **Selection surplus** (flat 1u): ${selSize.attribution.selectionSurplus_flat1u}u`);
  L.push(`- **Sizing skill** (actual − even-size): ${selSize.attribution.sizingSkill_vsEven}u`);
  L.push('');
  L.push('### Oracle keep (at actual units of kept picks)');
  L.push('| Keep rule | n | %n | WR | ROI | PnL | Surplus |');
  L.push('|-----------|---|----|----|-----|-----|---------|');
  for (const o of oracles) {
    L.push(`| ${o.label} | ${o.n} | ${o.pctOfBookN}% | ${o.wr}% | ${o.roi}% | ${o.pnl}u | ${o.unitSurplus}u |`);
  }
  L.push('');
  L.push('## 2 · Feature ↔ residual correlation (direction of surplus)');
  L.push('| Feature | r(feature, won−p_mkt) | n |');
  L.push('|---------|----------------------|---|');
  for (const f of featCorr) {
    L.push(`| ${f.feature} | ${f.r} | ${f.n} |`);
  }
  L.push('');
  L.push('## 3 · Surplus model (ridge OLS on residual)');
  L.push(`- OOS mean R²: **${surplusModel.meanOosR2}** (folds: ${surplusModel.foldR2.join(', ')})`);
  L.push('| Rank | Feature | β_z |');
  L.push('|------|---------|-----|');
  for (const c of surplusModel.coefRank) {
    L.push(`| ${c.rank} | ${c.feature} | ${c.beta_z} |`);
  }
  L.push('');
  L.push('### OOS predicted-surplus quintiles (ridge)');
  L.push('| Bucket | n | WR | ROI | PnL | Residual pp | Surplus |');
  L.push('|--------|---|----|-----|-----|-------------|---------|');
  for (const b of surplusBuckets) {
    L.push(`| ${b.label} | ${b.n} | ${b.wr}% | ${b.roi}% | ${b.pnl}u | ${b.residualPp} | ${b.unitSurplus}u |`);
  }
  L.push('');
  L.push('### Tape score quintiles (rule: +TopUnopp +CLVhigh +SUPER/RANK −CLVlow −SHARP −topVsTop)');
  L.push('| Bucket | n | WR | ROI | PnL | Residual pp | Surplus |');
  L.push('|--------|---|----|-----|-----|-------------|---------|');
  for (const b of tapeBuckets) {
    L.push(`| ${b.label} | ${b.n} | ${b.wr}% | ${b.roi}% | ${b.pnl}u | ${b.residualPp} | ${b.unitSurplus}u |`);
  }
  L.push('');
  L.push('## 4 · Kill-list ablation (dollar value)');
  L.push('| Policy | n | dropped | units | PnL | ROI | Surplus | ΔPnL vs base |');
  L.push('|--------|---|---------|-------|-----|-----|---------|--------------|');
  for (const a of ablations) {
    L.push(`| ${a.name} | ${a.n} | ${a.nDropped} | ${a.units} | ${a.pnl}u | ${a.roi}% | ${a.unitSurplus}u | ${a.deltaPnl}u |`);
  }
  L.push('');
  L.push('## 5 · Joint cells');
  L.push('| Cell | n | WR | ROI | PnL | Residual pp | Surplus |');
  L.push('|------|---|----|-----|-----|-------------|---------|');
  for (const j of joints.sort((a, b) => (b.unitSurplus || 0) - (a.unitSurplus || 0))) {
    L.push(`| ${j.label} | ${j.n} | ${j.wr}% | ${j.roi}% | ${j.pnl}u | ${j.residualPp} | ${j.unitSurplus}u |`);
  }
  L.push('');
  L.push('## Takeaways');
  const bestAblate = [...ablations].filter(a => a.name !== 'baseline').sort((a, b) => b.deltaPnl - a.deltaPnl)[0];
  L.push(`- Best ΔPnL policy in this pass: **${bestAblate?.name}** (${bestAblate?.deltaPnl}u) at ROI ${bestAblate?.roi}%`);
  L.push('- Press cells with positive residual + surplus; kill CLV-low / SHARP / (downsize) topVsTop.');
  L.push('- Next deploy step: May-fit → June-holdout bakeoff on the winning ablation (not in-sample only).');
  L.push('');
  L.push('## Artifacts');
  L.push('- `tmp_surplus_edge_june1.json`');
  L.push('- `scripts/_surplus_edge_analysis.mjs`');
  L.push('- `SURPLUS_EDGE_REPORT.md`');

  writeFileSync(join(root, 'SURPLUS_EDGE_REPORT.md'), L.join('\n'));

  console.log(JSON.stringify({
    book: { pnl: book.pnl, surplus: book.unitSurplus, residualPp: book.residualPp, roi: book.roi },
    selSize: selSize.attribution,
    actual: selSize.actual,
    topCorr: featCorr.slice(0, 5),
    surplusR2: surplusModel.meanOosR2,
    topCoef: surplusModel.coefRank.slice(0, 5),
    topRidgeBucket: surplusBuckets[surplusBuckets.length - 1],
    topTapeBucket: tapeBuckets[tapeBuckets.length - 1],
    botTapeBucket: tapeBuckets[0],
    bestAblate,
    topJoints: joints.slice(0, 5),
  }, null, 2));
  console.log('\nWrote tmp_surplus_edge_june1.json + SURPLUS_EDGE_REPORT.md');
}

main();
