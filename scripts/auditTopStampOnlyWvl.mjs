#!/usr/bin/env node
/**
 * TOP W vs L — LEAKAGE-SAFE analysis.
 *
 * HONEST METHOD NOTE:
 * Prior lead-wallet report used live `sharpWalletProfiles` (current sport WR,
 * n, $ROI). That is FORWARD-LOOKING for historical tickets — do not trust
 * "sport WR < 50" from that pull as a deployable rule.
 *
 * This script uses ONLY fields frozen on the ticket at peak/lock / v8_* stamps.
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { HC_RATIO } from '../src/lib/ags.js';
import { maxForSizeRatio } from '../src/lib/walletClvSkill.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const FROM = '2026-06-15';
const AGSU = 'ags-unified';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
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
    n, w, l,
    wr: n ? (100 * w) / n : null,
    stake,
    pnl,
    roi: stake > 0 ? (100 * pnl) / stake : null,
  };
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
function fmt(a) {
  if (!a?.n) return 'n=0';
  return `${a.n} ${a.w}–${a.l} ${a.wr.toFixed(1)}% ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u ROI ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

async function load(firestore) {
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
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        if (!(units >= 4)) continue;
        if (res.tracked === true) continue;

        const path = pathOf(sd);
        const isTop = path === 'TOP' || path === 'TOP+';
        if (!isTop) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const forWd = wd.filter((w) => String(w.side) === String(sideKey));
        // Proxy HC leads from STAMP only: FOR + sizeRatio ≥ 1.5
        // (Cannot re-check live whitelistTier without leakage.)
        const hcLeads = forWd
          .filter((w) => Number(w.sizeRatio) >= HC_RATIO)
          .sort((a, b) => Number(b.sizeRatio) - Number(a.sizeRatio)
            || Number(b.invested || 0) - Number(a.invested || 0));
        const lead = hcLeads[0] || null;

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
          // --- stamped ticket features (safe) ---
          edge: num(sd.v8_winnerAlignEdge),
          meanFor: num(sd.v8_winnerAlignMeanFor),
          meanAg: num(sd.v8_winnerAlignMeanAg),
          topFor: num(sd.v8_winnerAlignTopFor),
          topAg: num(sd.v8_winnerAlignTopAg),
          forN: num(sd.v8_winnerAlignForN),
          agN: num(sd.v8_winnerAlignAgN),
          hasBoth: sd.v8_winnerAlignHasBoth === true,
          fadeTop: sd.v8_winnerAlignFadeTop60 === true,
          topUnopp: sd.v8_winnerAlignTopUnopp === true,
          tapeAction: String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || '—',
          tapeScore: num(sd.v8_tapeScore),
          tapeEdge: num(sd.v8_tapeEdgeTerm),
          tapeNet: num(sd.v8_tapeNetTerm),
          netMeanPrior: num(sd.v8_netMeanPrior),
          netFor: num(sd.v8_netClvMeanFor),
          netAg: num(sd.v8_netClvMeanAg),
          netNFor: num(sd.v8_netClvNFor),
          edgeBand: sd.v8_edgeBand || null,
          edgeNetBucket: sd.v8_edgeNetBucket || null,
          forTop2Pct: num(sd.v8_forTop2PctPos),
          forTop2N: num(sd.v8_forTop2NSkill),
          qConv: num(sd.v8_qConv),
          provenFor: num(sd.v8_agsProvenForCount),
          provenAg: num(sd.v8_agsProvenAgCount),
          agsV12: num(sd.v8_agsV12),
          agsV12ForMean: num(sd.v8_agsV12ForMean),
          agsV12AgMean: num(sd.v8_agsV12AgMean),
          hcFor: num(sd.v8_hcConfFor),
          hcAg: num(sd.v8_hcConfAg),
          hcMargin: num(sd.v8_hcMargin),
          maxSR: maxForSizeRatio(wd, sideKey),
          forWalletN: forWd.length,
          // stamped lead proxy
          leadSR: lead ? num(lead.sizeRatio) : null,
          leadInvested: lead ? num(lead.invested) : null,
          leadContrib: lead ? num(lead.contribution) : null,
          leadRoi: lead ? num(lead.roi) : null, // scoring roi at stamp — near-causal
          leadRoiNorm: lead ? num(lead.roiNorm) : null,
          leadPnlNorm: lead ? num(lead.pnlNorm) : null,
          leadWalletBase: lead ? num(lead.walletBase) : null,
          leadConv: lead ? num(lead.convictionMult) : null,
          leadN: hcLeads.length,
          scoring: peak.v8Scoring || {},
          qualityFor: num(peak.v8Scoring?.qualityForT30),
          qualityAg: num(peak.v8Scoring?.qualityAgT30),
          deltaQuality: num(peak.v8Scoring?.deltaQuality),
          walletPlayScore: num(peak.v8Scoring?.walletPlayScore),
          topShare: num(peak.v8Scoring?.topShare),
          netEdge: num(peak.v8Scoring?.netEdge),
        });
      }
    }
  }
  return rows;
}

function featTable(lines, wins, losses, feats) {
  lines.push('| Feature (STAMPED) | W n | W mean | W med | L n | L mean | L med | Δmean |');
  lines.push('|-------------------|----:|-------:|------:|----:|-------:|------:|------:|');
  for (const [name, fn] of feats) {
    const wv = wins.map(fn).filter(Number.isFinite);
    const lv = losses.map(fn).filter(Number.isFinite);
    if (!wv.length && !lv.length) continue;
    const wm = mean(wv); const lm = mean(lv);
    const d = (wm ?? 0) - (lm ?? 0);
    const mark = Math.abs(d) >= 5 || (name.includes('SR') && Math.abs(d) >= 0.3) ? '◆' : ' ';
    lines.push(`| ${mark} ${name} | ${wv.length} | ${wm?.toFixed(2) ?? '—'} | ${med(wv)?.toFixed(2) ?? '—'} | ${lv.length} | ${lm?.toFixed(2) ?? '—'} | ${med(lv)?.toFixed(2) ?? '—'} | ${d >= 0 ? '+' : ''}${d.toFixed(2)} |`);
  }
}

function flagTable(lines, rows, flags) {
  lines.push('| Flag (STAMPED only) | Match n/W–L/ROI/PnL | Rest |');
  lines.push('|--------------------|---------------------|------|');
  for (const { name, fn } of flags) {
    const m = rows.filter(fn);
    const o = rows.filter((r) => !fn(r));
    const a = agg(m); const b = agg(o);
    if (!a.n) continue;
    const mark = (a.roi ?? 0) <= -15 ? '🔴' : (a.roi ?? 0) >= 15 ? '🟢' : '  ';
    lines.push(`| ${mark} ${name} | ${a.n} ${a.w}–${a.l} ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}% ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u | ${b.n ? `${b.n} ${b.w}–${b.l} ${b.roi >= 0 ? '+' : ''}${b.roi.toFixed(0)}%` : '—'} |`);
  }
}

async function main() {
  const rows = await load(db());
  const lines = [];
  const out = (s = '') => { lines.push(s); console.log(s); };

  out('# TOP ≥4u — leakage audit + stamp-only W vs L');
  out(`Generated: ${new Date().toISOString()}`);
  out('');
  out('## Method honesty');
  out('');
  out('### What was LEAKY in the prior lead-wallet report');
  out('- Live `sharpWalletProfiles.bySport.*.picks.wr / n / dollarRoi` as of **today**');
  out('- Applied to June/July tickets → includes bets **after** the pick date');
  out('- **`sport WR < 50` from that pull is NOT deployable** until recomputed causal as-of pick date');
  out('- `firstBetDate` age is mostly tracking start, not true wallet age');
  out('');
  out('### What is SAFE (used below)');
  out('- Ticket `v8_*` stamps (EDGE, meanFor/Ag, tape, netCLV, forTop2Pct, qConv, HC counts, …)');
  out('- `peak.v8Scoring` / `walletDetails` frozen at score time (sizeRatio, invested, contribution, roi/roiNorm on detail)');
  out('- Stamped `sizeRatio ≥ 3` claim from before **was already safe**');
  out('');

  const windows = [
    ['Jun15+', (r) => r.date >= '2026-06-15'],
    ['Jul15+', (r) => r.date >= '2026-07-15'],
    ['Aug1+', (r) => r.date >= '2026-08-01'],
  ];

  const contFeats = [
    ['EDGE', (r) => r.edge],
    ['meanFor', (r) => r.meanFor],
    ['meanAg', (r) => r.meanAg],
    ['topFor', (r) => r.topFor],
    ['topAg', (r) => r.topAg],
    ['forN', (r) => r.forN],
    ['agN', (r) => r.agN],
    ['tapeScore', (r) => r.tapeScore],
    ['netMeanPrior', (r) => r.netMeanPrior],
    ['netCLV For', (r) => r.netFor],
    ['forTop2PctPos', (r) => r.forTop2Pct],
    ['qConv', (r) => r.qConv],
    ['agsV12', (r) => r.agsV12],
    ['agsV12 ForMean', (r) => r.agsV12ForMean],
    ['provenFor', (r) => r.provenFor],
    ['maxSR (FOR)', (r) => r.maxSR],
    ['lead sizeRatio', (r) => r.leadSR],
    ['lead invested', (r) => r.leadInvested],
    ['lead contrib', (r) => r.leadContrib],
    ['lead roi (stamp)', (r) => r.leadRoi],
    ['lead roiNorm', (r) => r.leadRoiNorm],
    ['lead pnlNorm', (r) => r.leadPnlNorm],
    ['lead walletBase', (r) => r.leadWalletBase],
    ['qualityForT30', (r) => r.qualityFor],
    ['deltaQuality', (r) => r.deltaQuality],
    ['walletPlayScore', (r) => r.walletPlayScore],
    ['topShare', (r) => r.topShare],
    ['odds', (r) => r.odds],
    ['units', (r) => r.units],
  ];

  const flags = [
    { name: 'lead sizeRatio ≥ 3 (SAFE — stamped)', fn: (r) => r.leadSR != null && r.leadSR >= 3 },
    { name: 'lead sizeRatio 1.5–2', fn: (r) => r.leadSR != null && r.leadSR >= 1.5 && r.leadSR < 2 },
    { name: 'maxSR < 1', fn: (r) => r.maxSR != null && r.maxSR < 1 },
    { name: 'maxSR ≥ 2', fn: (r) => r.maxSR != null && r.maxSR >= 2 },
    { name: 'EDGE < 10', fn: (r) => r.edge != null && r.edge < 10 },
    { name: 'EDGE ≥ 20', fn: (r) => r.edge != null && r.edge >= 20 },
    { name: 'EDGE ≥ 30', fn: (r) => r.edge != null && r.edge >= 30 },
    { name: 'meanFor < 50', fn: (r) => r.meanFor != null && r.meanFor < 50 },
    { name: 'meanFor ≥ 60', fn: (r) => r.meanFor != null && r.meanFor >= 60 },
    { name: 'topFor < 55', fn: (r) => r.topFor != null && r.topFor < 55 },
    { name: 'topAg ≥ 55', fn: (r) => r.topAg != null && r.topAg >= 55 },
    { name: '!hasBoth', fn: (r) => !r.hasBoth },
    { name: 'topUnopp', fn: (r) => r.topUnopp },
    { name: 'tape HOLD', fn: (r) => r.tapeAction === 'HOLD' },
    { name: 'tape BOOST', fn: (r) => r.tapeAction === 'BOOST' },
    { name: 'tape FAIL_OPEN', fn: (r) => r.tapeAction === 'FAIL_OPEN' },
    { name: 'tapeScore < 1', fn: (r) => r.tapeScore != null && r.tapeScore < 1 },
    { name: 'netMeanPrior < 0', fn: (r) => r.netMeanPrior != null && r.netMeanPrior < 0 },
    { name: 'netMeanPrior ≥ 5', fn: (r) => r.netMeanPrior != null && r.netMeanPrior >= 5 },
    { name: 'forTop2Pct < 55', fn: (r) => r.forTop2Pct != null && r.forTop2Pct < 55 },
    { name: 'forTop2Pct ≥ 65', fn: (r) => r.forTop2Pct != null && r.forTop2Pct >= 65 },
    { name: 'lead roiNorm < 20', fn: (r) => r.leadRoiNorm != null && r.leadRoiNorm < 20 },
    { name: 'lead roiNorm ≥ 40', fn: (r) => r.leadRoiNorm != null && r.leadRoiNorm >= 40 },
    { name: 'lead walletBase < 20', fn: (r) => r.leadWalletBase != null && r.leadWalletBase < 20 },
    { name: 'lead contrib < 20', fn: (r) => r.leadContrib != null && r.leadContrib < 20 },
    { name: 'qualityForT30 ≤ 1', fn: (r) => r.qualityFor != null && r.qualityFor <= 1 },
    { name: 'provenFor = 0', fn: (r) => r.provenFor === 0 },
    { name: 'odds ≤ -200 chalk', fn: (r) => r.odds <= -200 },
    { name: 'near pick -119..-100', fn: (r) => r.odds < 0 && r.odds >= -119 },
    { name: 'MLB TOTAL', fn: (r) => r.sport === 'MLB' && r.mkt === 'TOTAL' },
    { name: 'UFC ML', fn: (r) => r.sport === 'UFC' && r.mkt === 'ML' },
    { name: 'units 4–4.99', fn: (r) => r.units >= 4 && r.units < 5 },
    { name: 'units ≥ 5.4', fn: (r) => r.units >= 5.4 },
    // stacked safe candidates
    { name: 'meanFor<55 AND leadSR≥3', fn: (r) => r.meanFor != null && r.meanFor < 55 && r.leadSR != null && r.leadSR >= 3 },
    { name: 'EDGE<15 AND tape HOLD', fn: (r) => r.edge != null && r.edge < 15 && r.tapeAction === 'HOLD' },
    { name: 'forTop2Pct<60 AND leadSR≥3', fn: (r) => r.forTop2Pct != null && r.forTop2Pct < 60 && r.leadSR != null && r.leadSR >= 3 },
    { name: 'MLB TOTAL AND tape HOLD', fn: (r) => r.sport === 'MLB' && r.mkt === 'TOTAL' && r.tapeAction === 'HOLD' },
  ];

  for (const [label, fn] of windows) {
    const subset = rows.filter(fn);
    const wins = subset.filter((r) => r.won);
    const losses = subset.filter((r) => !r.won);
    out(`## ${label} — ${fmt(agg(subset))}`);
    out('');
    out('### Continuous (stamp-only)');
    out('');
    featTable(lines, wins, losses, contFeats);
    out('');
    out('### Flags (stamp-only)');
    out('');
    flagTable(lines, subset, flags);
    out('');
  }

  out('## Verdict');
  out('');
  out('1. Prior **profile WR/n/$ROI** separators → treat as **contaminated** until causal as-of rebuild.');
  out('2. **sizeRatio ≥ 3** on stamped lead remains a fair candidate (was never live-profile).');
  out('3. Hunt above for other stamped separators that survive Jun15+ and Jul15+.');
  out('4. To properly test thin/young/WR: need causal ledger as-of `date` (CLV skill style) or historical profile snapshots — not live profiles.');

  const path = join(REPO_ROOT, 'tmp_top_stamp_only_wvl.md');
  writeFileSync(path, `${lines.join('\n')}\n`);
  writeFileSync('/opt/cursor/artifacts/tmp_top_stamp_only_wvl.md', `${lines.join('\n')}\n`);
  writeFileSync(join(REPO_ROOT, 'tmp_top_stamp_only_wvl.json'), JSON.stringify({ rows, generated: new Date().toISOString() }, null, 2));
  console.log(`Wrote ${path}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
