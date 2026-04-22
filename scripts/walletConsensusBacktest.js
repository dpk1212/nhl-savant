/**
 * walletConsensusBacktest.js
 *
 * Backtest V8 picks against the wallet-consensus signal.
 *
 * For every graded pick side (sharpFlowPicks / Spreads / Totals, status
 * === 'COMPLETED', lockStage in {LOCKED, SHADOW}, walletDetails present),
 * we:
 *   1. Recompute forW / agW / Δ using the CURRENT sharpWalletProfiles
 *      whitelist (CONFIRMED + FLAT only, per-sport).
 *   2. Join against side.result.{outcome, profit}.
 *   3. Bucket picks by Δ (FADE_STRONG ≤ −2 · FADE_WEAK = −1 · NEUTRAL = 0
 *      · LEAN_FOR = +1 · STRONG_FOR ≥ +2) and report WR / flat ROI /
 *      weighted ROI / P&L per bucket.
 *   4. Cross-tab Δ bucket × sport, × market, × regime, × stars, × contribTier.
 *   5. Also report "strength ratio" = forW / (forW + agW) — the share of
 *      whitelisted sharps that supported our pick when ≥1 whitelisted
 *      sharp is present on either side.
 *
 * Usage:
 *   node scripts/walletConsensusBacktest.js                       # all data
 *   node scripts/walletConsensusBacktest.js 2026-04-18 2026-04-21 # window
 *   node scripts/walletConsensusBacktest.js --md                  # write report MD
 */
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
const db = admin.firestore();

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const flags = process.argv.slice(2).filter(a => a.startsWith('--'));
const WRITE_MD = flags.includes('--md');
const START = args[0] || '2026-04-18';
const END = args[1] || '2026-12-31';

const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

function classifyDelta(forW, agW) {
  const delta = forW - agW;
  const verdict =
    delta >= 2 ? 'STRONG_FOR' :
    delta === 1 ? 'LEAN_FOR' :
    delta === 0 ? 'NEUTRAL' :
    delta === -1 ? 'FADE_WEAK' : 'FADE_STRONG';
  return { delta, verdict };
}

async function loadProfiles() {
  const snap = await db.collection('sharpWalletProfiles').get();
  const map = new Map();
  snap.forEach(d => map.set(d.id, d.data()));
  return map;
}

function isWhitelistedForSport(walletShort, sport, profiles) {
  const t = profiles.get(walletShort)?.bySport?.[sport]?.whitelistTier;
  return t === 'CONFIRMED' || t === 'FLAT';
}

async function loadRows(profiles) {
  const rows = [];
  for (const [col, mkt] of COLS) {
    const snap = await db.collection(col)
      .where('date', '>=', START)
      .where('date', '<=', END)
      .get();
    for (const d of snap.docs) {
      const data = d.data();
      const sport = data.sport;
      if (!data.sides) continue;
      for (const [sideKey, side] of Object.entries(data.sides)) {
        if (side.status !== 'COMPLETED') continue;
        if (side.superseded) continue;
        const stage = side.lockStage;
        // Only evaluate picks that were actually acted on (LOCKED or SHADOW)
        if (stage && stage !== 'LOCKED' && stage !== 'SHADOW') continue;
        const peak = side.peak || side.lock;
        if (!peak) continue;
        const wd = peak?.v8Scoring?.walletDetails || [];
        if (!wd.length) continue;
        const result = side.result || {};
        const outcome = result.outcome;
        if (!outcome || (outcome !== 'WIN' && outcome !== 'LOSS' && outcome !== 'PUSH')) continue;
        const profit = typeof result.profit === 'number' ? result.profit : null;
        if (profit == null) continue;
        const units = peak.units ?? side.lock?.units ?? 1;
        const consensusSide = peak?.v8Scoring?.consensusSide || sideKey;
        const forW_all = wd.filter(w => w.side === consensusSide).length;
        const agW_all = wd.filter(w => w.side && w.side !== consensusSide).length;
        const forW = wd.filter(w => w.side === consensusSide && isWhitelistedForSport(w.wallet, sport, profiles)).length;
        const agW  = wd.filter(w => w.side && w.side !== consensusSide && isWhitelistedForSport(w.wallet, sport, profiles)).length;
        const cls = classifyDelta(forW, agW);
        rows.push({
          docId: d.id,
          date: data.date,
          sport,
          market: mkt,
          side: sideKey,
          team: side.team,
          stage,
          promotedBy: side.promotedBy ?? null,
          contribTier: side.contribTier ?? null,
          regime: peak.regime ?? side.promotedRegime ?? null,
          stars: peak.stars ?? 0,
          units,
          odds: peak.odds ?? 0,
          outcome,
          profit,
          forW, agW, delta: cls.delta, verdict: cls.verdict,
          forW_all, agW_all,
          walletsTotal: wd.length,
        });
      }
    }
  }
  return rows;
}

function summarize(rows, label) {
  const w = rows.filter(r => r.outcome === 'WIN').length;
  const l = rows.filter(r => r.outcome === 'LOSS').length;
  const p = rows.filter(r => r.outcome === 'PUSH').length;
  const n = w + l + p;
  const wr = (w + l) > 0 ? (w / (w + l)) * 100 : 0;
  const flatRisked = n; // 1u per pick
  const flatProfit = rows.reduce((s, r) => s + signFlat(r), 0);
  const flatROI = flatRisked > 0 ? (flatProfit / flatRisked) * 100 : 0;
  const wtdRisked = rows.reduce((s, r) => s + (r.units || 0), 0);
  const wtdProfit = rows.reduce((s, r) => s + (r.profit || 0), 0);
  const wtdROI = wtdRisked > 0 ? (wtdProfit / wtdRisked) * 100 : 0;
  const avgStars = n > 0 ? rows.reduce((s, r) => s + (r.stars || 0), 0) / n : 0;
  return { label, n, w, l, p, wr, flatProfit, flatROI, wtdRisked, wtdProfit, wtdROI, avgStars };
}

// Flat-unit P&L: each pick risks 1u; profit depends on odds + outcome.
function signFlat(r) {
  if (r.outcome === 'PUSH') return 0;
  if (r.outcome === 'LOSS') return -1;
  // WIN at American odds
  const o = r.odds || 0;
  if (!o) return 0;
  return o > 0 ? o / 100 : 100 / Math.abs(o);
}

function fmt(s) { return (typeof s === 'number' ? s.toFixed(1) : String(s ?? '')); }

function line(s) {
  const {label, n, w, l, p, wr, flatProfit, flatROI, wtdRisked, wtdProfit, wtdROI, avgStars} = s;
  return [
    label.padEnd(22),
    String(n).padStart(4),
    `${w}-${l}-${p}`.padEnd(8),
    `${wr.toFixed(1)}%`.padStart(6),
    `${flatProfit >= 0 ? '+' : ''}${flatProfit.toFixed(2)}u`.padStart(9),
    `${flatROI >= 0 ? '+' : ''}${flatROI.toFixed(1)}%`.padStart(8),
    `${wtdProfit >= 0 ? '+' : ''}${wtdProfit.toFixed(2)}u`.padStart(9),
    `${wtdROI >= 0 ? '+' : ''}${wtdROI.toFixed(1)}%`.padStart(8),
    avgStars.toFixed(1).padStart(5),
  ].join(' | ');
}

function header() {
  return [
    'Bucket'.padEnd(22),
    '   N',
    'W-L-P   ',
    '   WR%',
    '  FlatP&L',
    ' FlatROI',
    '   WtdP&L',
    '  WtdROI',
    '  ★',
  ].join(' | ');
}

function groupBy(rows, fn) {
  const out = new Map();
  for (const r of rows) {
    const k = fn(r);
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(r);
  }
  return out;
}

function printSection(title, groups, order) {
  console.log(`\n### ${title}`);
  console.log(header());
  console.log('-'.repeat(105));
  const keys = order ?? [...groups.keys()];
  for (const k of keys) {
    const r = groups.get(k);
    if (!r || !r.length) continue;
    console.log(line(summarize(r, String(k))));
  }
}

function mdSection(title, groups, order) {
  const keys = order ?? [...groups.keys()];
  let md = `### ${title}\n\n`;
  md += `| Bucket | N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd P&L | Wtd ROI | Avg ★ |\n`;
  md += `|---|---:|---|---:|---:|---:|---:|---:|---:|\n`;
  for (const k of keys) {
    const r = groups.get(k);
    if (!r || !r.length) continue;
    const s = summarize(r, String(k));
    md += `| ${s.label} | ${s.n} | ${s.w}-${s.l}-${s.p} | ${s.wr.toFixed(1)}% | ${s.flatProfit >= 0 ? '+' : ''}${s.flatProfit.toFixed(2)}u | ${s.flatROI >= 0 ? '+' : ''}${s.flatROI.toFixed(1)}% | ${s.wtdProfit >= 0 ? '+' : ''}${s.wtdProfit.toFixed(2)}u | ${s.wtdROI >= 0 ? '+' : ''}${s.wtdROI.toFixed(1)}% | ${s.avgStars.toFixed(1)} |\n`;
  }
  return md + '\n';
}

(async () => {
  const profiles = await loadProfiles();
  const rows = await loadRows(profiles);
  console.log(`\n=== Wallet-Consensus V8 Pick Backtest ===`);
  console.log(`Window: ${START} → ${END}`);
  console.log(`Profiles loaded: ${profiles.size}`);
  console.log(`Graded pick sides with walletDetails: ${rows.length}`);

  const overall = summarize(rows, 'ALL (baseline)');
  console.log(`\n${header()}`);
  console.log('-'.repeat(105));
  console.log(line(overall));

  const deltaOrder = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  const deltaGroups = new Map();
  for (const r of rows) {
    const d = Math.max(-3, Math.min(6, r.delta)); // clip
    const key = d <= -2 ? '≤ −2 (FADE_STRONG)' : d === -1 ? '−1 (FADE_WEAK)' : d === 0 ? '0 (NEUTRAL)' : d === 1 ? '+1 (LEAN_FOR)' : '≥ +2 (STRONG_FOR)';
    if (!deltaGroups.has(key)) deltaGroups.set(key, []);
    deltaGroups.get(key).push(r);
  }
  const deltaKeys = ['≤ −2 (FADE_STRONG)', '−1 (FADE_WEAK)', '0 (NEUTRAL)', '+1 (LEAN_FOR)', '≥ +2 (STRONG_FOR)'];
  printSection('By Wallet-Consensus Δ (forW − agW, whitelisted only)', deltaGroups, deltaKeys);

  // Has ≥1 whitelisted sharp (either side)
  const withWl = rows.filter(r => r.forW + r.agW > 0);
  const noWl   = rows.filter(r => r.forW + r.agW === 0);
  const wlGroups = new Map([
    ['≥1 whitelisted sharp', withWl],
    ['no whitelisted sharps', noWl],
  ]);
  printSection('By whitelist activity', wlGroups, ['≥1 whitelisted sharp', 'no whitelisted sharps']);

  // Strength ratio: forW / (forW + agW), only when ≥1 whitelisted
  const srGroups = new Map([
    ['1.00 (all for, none ag)', []],
    ['[0.67, 1.00) mostly for', []],
    ['[0.34, 0.67) split',      []],
    ['(0, 0.34) mostly against',[]],
    ['0.00 (all against)',      []],
  ]);
  for (const r of withWl) {
    const t = r.forW / (r.forW + r.agW);
    if (t >= 1)       srGroups.get('1.00 (all for, none ag)').push(r);
    else if (t >= 0.67) srGroups.get('[0.67, 1.00) mostly for').push(r);
    else if (t >= 0.34) srGroups.get('[0.34, 0.67) split').push(r);
    else if (t > 0)   srGroups.get('(0, 0.34) mostly against').push(r);
    else              srGroups.get('0.00 (all against)').push(r);
  }
  printSection('By strength ratio  forW / (forW + agW)  [only picks with ≥1 WL]', srGroups, [...srGroups.keys()]);

  // By sport × Δ bucket (compact: only STRONG_FOR vs rest summary per sport)
  const sportGroups = groupBy(rows, r => r.sport);
  const sportKeys = [...sportGroups.keys()].sort();
  console.log(`\n### By sport — STRONG_FOR (Δ ≥ +2) vs rest`);
  console.log(header());
  console.log('-'.repeat(105));
  for (const sp of sportKeys) {
    const all = sportGroups.get(sp);
    const strong = all.filter(r => r.delta >= 2);
    const rest = all.filter(r => r.delta < 2);
    if (strong.length) console.log(line(summarize(strong, `${sp} STRONG_FOR`)));
    console.log(line(summarize(rest,   `${sp} rest`)));
  }

  // By market
  const marketGroups = groupBy(rows, r => r.market);
  printSection('By market type', marketGroups, ['ML', 'SPREAD', 'TOTAL']);

  // By lockStage
  const stageGroups = groupBy(rows, r => r.stage || 'LOCKED');
  printSection('By lock stage', stageGroups, ['LOCKED', 'SHADOW']);

  // Δ × regime
  const clearMoveRows = rows.filter(r => r.regime === 'CLEAR_MOVE');
  const nonClearRows  = rows.filter(r => r.regime !== 'CLEAR_MOVE');
  const regimeXDelta = new Map([
    ['CLEAR_MOVE · Δ ≥ +1', clearMoveRows.filter(r => r.delta >= 1)],
    ['CLEAR_MOVE · Δ ≤ 0',  clearMoveRows.filter(r => r.delta <= 0)],
    ['non-CLEAR · Δ ≥ +1',  nonClearRows.filter(r => r.delta >= 1)],
    ['non-CLEAR · Δ ≤ 0',   nonClearRows.filter(r => r.delta <= 0)],
  ]);
  printSection('Regime × wallet consensus', regimeXDelta, [...regimeXDelta.keys()]);

  // Δ × contribTier
  const tierXDelta = new Map([
    ['STRONG · Δ ≥ +1',  rows.filter(r => r.contribTier === 'STRONG' && r.delta >= 1)],
    ['STRONG · Δ ≤ 0',   rows.filter(r => r.contribTier === 'STRONG' && r.delta <= 0)],
    ['STANDARD · Δ ≥ +1', rows.filter(r => r.contribTier === 'STANDARD' && r.delta >= 1)],
    ['STANDARD · Δ ≤ 0',  rows.filter(r => r.contribTier === 'STANDARD' && r.delta <= 0)],
    ['LEAN · Δ ≥ +1',    rows.filter(r => r.contribTier === 'LEAN' && r.delta >= 1)],
    ['LEAN · Δ ≤ 0',     rows.filter(r => r.contribTier === 'LEAN' && r.delta <= 0)],
  ]);
  printSection('Contrib tier × wallet consensus', tierXDelta, [...tierXDelta.keys()]);

  // Δ × stars
  const starsXDelta = new Map([
    ['≥4★ · Δ ≥ +1', rows.filter(r => r.stars >= 4 && r.delta >= 1)],
    ['≥4★ · Δ ≤ 0',  rows.filter(r => r.stars >= 4 && r.delta <= 0)],
    ['3★ · Δ ≥ +1',  rows.filter(r => r.stars >= 3 && r.stars < 4 && r.delta >= 1)],
    ['3★ · Δ ≤ 0',   rows.filter(r => r.stars >= 3 && r.stars < 4 && r.delta <= 0)],
    ['<3★ · Δ ≥ +1', rows.filter(r => r.stars < 3 && r.delta >= 1)],
    ['<3★ · Δ ≤ 0',  rows.filter(r => r.stars < 3 && r.delta <= 0)],
  ]);
  printSection('Stars × wallet consensus', starsXDelta, [...starsXDelta.keys()]);

  // Individual picks that had Δ ≥ +2 (STRONG_FOR) — show each
  const strongForRows = rows.filter(r => r.delta >= 2);
  if (strongForRows.length) {
    console.log(`\n### Individual STRONG_FOR picks (Δ ≥ +2) — every completed pick`);
    console.log('Date       | Sport | Mkt    | Pick                          | ★   | Stage  | Regime        | Tier     | forW/agW Δ | Outcome | Profit');
    console.log('-'.repeat(135));
    strongForRows.sort((a, b) => a.date.localeCompare(b.date));
    for (const r of strongForRows) {
      console.log(
        `${r.date} | ${r.sport.padEnd(5)} | ${r.market.padEnd(6)} | ${(r.team || '').slice(0,28).padEnd(29)} | ${String(r.stars).padEnd(3)} | ${(r.stage || 'LOCKED').padEnd(6)} | ${(r.regime || '—').padEnd(13)} | ${(r.contribTier || '—').padEnd(8)} | ${r.forW}/${r.agW} Δ=+${r.delta}  | ${r.outcome.padEnd(7)} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}u`
      );
    }
  }

  // Individual picks that had Δ ≤ −1 (any FADE) — show each
  const fadeRows = rows.filter(r => r.delta <= -1);
  if (fadeRows.length) {
    console.log(`\n### Individual FADE picks (Δ ≤ −1) — every completed pick`);
    console.log('Date       | Sport | Mkt    | Pick                          | ★   | Stage  | Regime        | Tier     | forW/agW Δ  | Outcome | Profit');
    console.log('-'.repeat(135));
    fadeRows.sort((a, b) => a.date.localeCompare(b.date));
    for (const r of fadeRows) {
      console.log(
        `${r.date} | ${r.sport.padEnd(5)} | ${r.market.padEnd(6)} | ${(r.team || '').slice(0,28).padEnd(29)} | ${String(r.stars).padEnd(3)} | ${(r.stage || 'LOCKED').padEnd(6)} | ${(r.regime || '—').padEnd(13)} | ${(r.contribTier || '—').padEnd(8)} | ${r.forW}/${r.agW} Δ=${r.delta}   | ${r.outcome.padEnd(7)} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}u`
      );
    }
  }

  // Optional — write MD report
  if (WRITE_MD) {
    const path = join(__dirname, '..', 'WALLET_CONSENSUS_BACKTEST.md');
    const ts = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    let md = `# Wallet-Consensus V8 Pick Backtest\n\n`;
    md += `_Generated ${ts} ET · window: **${START} → ${END}** · N = ${rows.length} graded sides · profiles loaded = ${profiles.size}_\n\n`;
    md += `> Each row represents a V8 pick (ML / Spread / Total) that was **LOCKED or SHADOW-eligible** with graded outcome and stored \`walletDetails\`. For every pick, we recompute:\n`;
    md += `> - \`forW\` = # of sport-whitelisted (CONFIRMED / FLAT) wallets on our pick side\n`;
    md += `> - \`agW\` = # of sport-whitelisted wallets opposing our pick\n`;
    md += `> - \`Δ = forW − agW\` (ladder ≤ −2 / −1 / 0 / +1 / ≥ +2)\n`;
    md += `> Flat ROI = risk 1u / pick. Wtd ROI = risk \`peak.units\`. PUSH counts as 0.\n\n`;
    md += `## Baseline (all picks)\n\n`;
    md += `| N | W-L-P | WR% | Flat P&L | Flat ROI | Wtd ROI | Avg ★ |\n|---:|---|---:|---:|---:|---:|---:|\n`;
    md += `| ${overall.n} | ${overall.w}-${overall.l}-${overall.p} | ${overall.wr.toFixed(1)}% | ${overall.flatProfit >= 0 ? '+' : ''}${overall.flatProfit.toFixed(2)}u | ${overall.flatROI >= 0 ? '+' : ''}${overall.flatROI.toFixed(1)}% | ${overall.wtdROI >= 0 ? '+' : ''}${overall.wtdROI.toFixed(1)}% | ${overall.avgStars.toFixed(1)} |\n\n`;
    md += mdSection('By wallet-consensus Δ (forW − agW)', deltaGroups, deltaKeys);
    md += mdSection('By whitelist activity', wlGroups, ['≥1 whitelisted sharp', 'no whitelisted sharps']);
    md += mdSection('By strength ratio forW / (forW + agW) — only picks with ≥1 WL', srGroups, [...srGroups.keys()]);
    md += mdSection('By market type', marketGroups, ['ML', 'SPREAD', 'TOTAL']);
    md += mdSection('By lock stage', stageGroups, ['LOCKED', 'SHADOW']);
    md += mdSection('Regime × wallet consensus', regimeXDelta, [...regimeXDelta.keys()]);
    md += mdSection('Contrib tier × wallet consensus', tierXDelta, [...tierXDelta.keys()]);
    md += mdSection('Stars × wallet consensus', starsXDelta, [...starsXDelta.keys()]);
    if (strongForRows.length) {
      md += `## Every STRONG_FOR (Δ ≥ +2) pick\n\n`;
      md += `| Date | Sport | Market | Pick | ★ | Stage | Regime | Tier | forW / agW | Δ | Outcome | Profit |\n`;
      md += `|---|---|---|---|---:|---|---|---|---|---:|---|---:|\n`;
      strongForRows.sort((a, b) => a.date.localeCompare(b.date)).forEach(r => {
        md += `| ${r.date} | ${r.sport} | ${r.market} | ${r.team ?? '—'} | ${r.stars} | ${r.stage ?? 'LOCKED'} | ${r.regime ?? '—'} | ${r.contribTier ?? '—'} | ${r.forW}/${r.agW} | +${r.delta} | ${r.outcome} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}u |\n`;
      });
      md += '\n';
    }
    if (fadeRows.length) {
      md += `## Every FADE pick (Δ ≤ −1)\n\n`;
      md += `| Date | Sport | Market | Pick | ★ | Stage | Regime | Tier | forW / agW | Δ | Outcome | Profit |\n`;
      md += `|---|---|---|---|---:|---|---|---|---|---:|---|---:|\n`;
      fadeRows.sort((a, b) => a.date.localeCompare(b.date)).forEach(r => {
        md += `| ${r.date} | ${r.sport} | ${r.market} | ${r.team ?? '—'} | ${r.stars} | ${r.stage ?? 'LOCKED'} | ${r.regime ?? '—'} | ${r.contribTier ?? '—'} | ${r.forW}/${r.agW} | ${r.delta} | ${r.outcome} | ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(2)}u |\n`;
      });
      md += '\n';
    }
    writeFileSync(path, md, 'utf8');
    console.log(`\nReport written to ${path}`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
