#!/usr/bin/env node
/**
 * Is TOP 4u+ bleed new? What's the path? What's underneath?
 *
 * 1) TOP ≥4u by month / era since Path A cutover (2026-06-15)
 * 2) TOP vs peers with similar shapes (BOOST, chalk, totals, E≥10)
 * 3) Within TOP: W vs L drivers
 * 4) hcMargin==1 cohort even if path stamped differently (shouldn't happen often)
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

function fmt(a) {
  if (!a?.n) return 'n=0';
  return `${a.n}  ${a.w}–${a.l}  ${a.wr.toFixed(1)}%  ${a.stake.toFixed(1)}u  ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u  ROI ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
}

function pathOf(sd) {
  return sd.v8_hcStakeTier || sd.v8_agsV12Tier || sd.v8_stakePath || sd.v8_agsTier || '—';
}

function monthOf(d) { return d.slice(0, 7); }

function eraOf(d) {
  if (d < '2026-07-01') return 'Jun15–30 (early Path A)';
  if (d < '2026-07-15') return 'Jul1–14 (pre-tape)';
  if (d < '2026-07-19') return 'Jul15–18 (tape on)';
  if (d < '2026-07-22') return 'Jul19–21 (TOP NEITHER + EDGE band v1)';
  if (d < '2026-08-01') return 'Jul22–31 (EDGE band v2)';
  if (d < '2026-08-19') return 'Aug1–18 (pre leftover mute)';
  return 'Aug19+ (leftover mute era)';
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
        if (!(units > 0)) continue;
        if (res.tracked === true) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const path = pathOf(sd);
        const hcMargin = Number(sd.v8_hcMargin);
        const miniHc = Number(sd.v8_miniHcMargin);
        const tapeAction = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_');
        const edge = Number(sd.v8_winnerAlignEdge);
        const meanFor = Number(sd.v8_winnerAlignMeanFor);
        const meanAg = Number(sd.v8_winnerAlignMeanAg);
        const forN = Number(sd.v8_winnerAlignForN);
        const agN = Number(sd.v8_winnerAlignAgN);
        const tapeScore = Number(sd.v8_tapeScore);
        const hcFor = Number(sd.v8_hcConfFor);
        const hcAg = Number(sd.v8_hcConfAg);
        const maxSR = maxForSizeRatio(wd, sideKey);
        const team = sd.team || (sideKey === 'home' ? data.home : sideKey === 'away' ? data.away : sideKey);

        rows.push({
          id: docSnap.id,
          date,
          month: monthOf(date),
          era: eraOf(date),
          sport: data.sport || '',
          mkt,
          team,
          path,
          isTop: path === 'TOP' || path === 'TOP+',
          units,
          ge4: units >= 4,
          odds,
          won,
          profit: profitOf(units, odds, won),
          tapeAction: tapeAction || '—',
          edge: Number.isFinite(edge) ? edge : null,
          meanFor: Number.isFinite(meanFor) ? meanFor : null,
          meanAg: Number.isFinite(meanAg) ? meanAg : null,
          forN: Number.isFinite(forN) ? forN : null,
          agN: Number.isFinite(agN) ? agN : null,
          tapeScore: Number.isFinite(tapeScore) ? tapeScore : null,
          hcMargin: Number.isFinite(hcMargin) ? hcMargin : null,
          miniHc: Number.isFinite(miniHc) ? miniHc : null,
          hcFor: Number.isFinite(hcFor) ? hcFor : null,
          hcAg: Number.isFinite(hcAg) ? hcAg : null,
          maxSR,
          chalk200: odds <= -200,
          nearPick: odds < 0 && odds > -120,
          isTotal: mkt === 'TOTAL',
          isBoost: tapeAction === 'BOOST',
          isHold: tapeAction === 'HOLD',
        });
      }
    }
  }
  return rows;
}

function line(lines, s = '') { lines.push(s); console.log(s); }

function bucket(lines, rows, keyFn, title, minN = 1) {
  line(lines, `### ${title}`);
  line(lines, '');
  line(lines, '| Bucket | n | W–L | WR | Stake | PnL | ROI |');
  line(lines, '|--------|--:|:---:|---:|------:|----:|----:|');
  const map = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (k == null) continue;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  }
  const ents = [...map.entries()]
    .map(([k, rs]) => [k, agg(rs)])
    .filter(([, a]) => a.n >= minN)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  for (const [k, a] of ents) {
    const mark = (a.roi ?? 0) <= -15 ? '🔴' : (a.roi ?? 0) >= 15 ? '🟢' : '  ';
    line(lines, `| ${mark} ${k} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(1)}% | ${a.stake.toFixed(1)}u | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% |`);
  }
  line(lines, '');
}

async function main() {
  const rows = await load(db());
  const ge4 = rows.filter((r) => r.ge4);
  const top4 = ge4.filter((r) => r.isTop);
  const nonTop4 = ge4.filter((r) => !r.isTop);
  const lines = [];

  line(lines, '# TOP path — is the bleed new? What is it? What\'s underneath?');
  line(lines, `Generated: ${new Date().toISOString()}`);
  line(lines, `Universe: AGS-U live staked ≥ ${FROM}, focus **TOP/TOP+ with finalUnits ≥ 4**.`);
  line(lines, '');
  line(lines, '## What TOP is (live)');
  line(lines, '');
  line(lines, 'Path A **HC-1 model**:');
  line(lines, '- Count CONFIRMED wallets with sport-local size ≥ 1.5× usual (**full HC**)');
  line(lines, '- `hcMargin = (# HC FOR) − (# HC AG)`');
  line(lines, '- **`hcMargin === 1` → stake tier `TOP` @ 4u base** (UI: TOP PICK)');
  line(lines, '- `hcMargin === 2` → SUPER @ 6u; `≥3` → CONFIRMED @ 1u (pile-on shrinks)');
  line(lines, '- Then EDGE band (E≥10 ×1.25) + tape BOOST (×1.35) can push TOP to ~5 / 5.4u');
  line(lines, '- Hard mute: TOP + EDGE/net **NEITHER** → 0u (from 2026-07-19)');
  line(lines, '- `TOP+` ($ proven boost to 5u) **OFF since 2026-07-12**');
  line(lines, '');
  line(lines, 'So TOP is not “best pick.” It is **exactly one net full-HC wallet** on our side.');
  line(lines, '');

  line(lines, '## A) Is the TOP ≥4u bleed new?');
  line(lines, '');
  line(lines, `All ≥4u: ${fmt(agg(ge4))}`);
  line(lines, `TOP ≥4u: ${fmt(agg(top4))}`);
  line(lines, `non-TOP ≥4u: ${fmt(agg(nonTop4))}`);
  line(lines, '');

  bucket(lines, top4, (r) => r.month, 'TOP ≥4u by calendar month');
  bucket(lines, top4, (r) => r.era, 'TOP ≥4u by policy era');
  bucket(lines, ge4, (r) => `${r.month} · ${r.isTop ? 'TOP' : 'other'}`, '≥4u by month × TOP vs other', 2);

  // Rolling: last 14 / 30 / all
  const last = (days) => {
    const dates = [...new Set(ge4.map((r) => r.date))].sort();
    const end = dates[dates.length - 1];
    const startMs = Date.parse(end) - (days - 1) * 86400000;
    const start = new Date(startMs).toISOString().slice(0, 10);
    return top4.filter((r) => r.date >= start);
  };
  line(lines, '### TOP ≥4u trailing windows (by last graded day in sample)');
  line(lines, '');
  for (const d of [7, 14, 30, 60]) {
    line(lines, `- Last ~${d}d: ${fmt(agg(last(d)))}`);
  }
  line(lines, '');

  line(lines, '## B) Underneath TOP — W vs L (all TOP ≥4u since Jun15)');
  line(lines, '');
  const tw = top4.filter((r) => r.won);
  const tl = top4.filter((r) => !r.won);
  const feats = [
    ['hcMargin', (r) => r.hcMargin],
    ['hcFor', (r) => r.hcFor],
    ['hcAg', (r) => r.hcAg],
    ['EDGE', (r) => r.edge],
    ['tapeScore', (r) => r.tapeScore],
    ['meanFor', (r) => r.meanFor],
    ['meanAg', (r) => r.meanAg],
    ['maxSR', (r) => r.maxSR],
    ['odds', (r) => r.odds],
    ['units', (r) => r.units],
  ];
  line(lines, '| Feature | W mean | L mean | Δ |');
  line(lines, '|---------|-------:|-------:|--:|');
  for (const [name, fn] of feats) {
    const wv = tw.map(fn).filter(Number.isFinite);
    const lv = tl.map(fn).filter(Number.isFinite);
    if (!wv.length && !lv.length) continue;
    const wm = wv.reduce((a, b) => a + b, 0) / (wv.length || 1);
    const lm = lv.reduce((a, b) => a + b, 0) / (lv.length || 1);
    line(lines, `| ${name} | ${wm.toFixed(2)} | ${lm.toFixed(2)} | ${wm - lm >= 0 ? '+' : ''}${(wm - lm).toFixed(2)} |`);
  }
  line(lines, '');

  bucket(lines, top4, (r) => r.tapeAction, 'TOP ≥4u by tape');
  bucket(lines, top4, (r) => `${r.sport} ${r.mkt}`, 'TOP ≥4u by sport×market');
  bucket(lines, top4, (r) => {
    if (r.odds <= -200) return 'chalk ≤-200';
    if (r.odds < 0) return 'fav >-200';
    return 'dog';
  }, 'TOP ≥4u by odds class');
  bucket(lines, top4, (r) => {
    if (r.units >= 5.4) return '5.4u+ BOOST size';
    if (r.units >= 5) return '5–5.39u';
    return '4–4.99u base-ish';
  }, 'TOP ≥4u by size');
  bucket(lines, top4, (r) => `HC ${r.hcFor ?? '?'}–${r.hcAg ?? '?'} (m=${r.hcMargin ?? '?'})`, 'TOP ≥4u by HC FOR–AG stamp');

  line(lines, '## C) Is it the pathway — or a shape TOP concentrates?');
  line(lines, '');
  line(lines, 'Compare the **same underlying shape** on TOP vs non-TOP (≥4u, Jun15+):');
  line(lines, '');
  line(lines, '| Shape | TOP | non-TOP |');
  line(lines, '|-------|-----|---------|');
  const shapes = [
    ['All ≥4u', (r) => true],
    ['Tape BOOST', (r) => r.isBoost],
    ['Tape HOLD', (r) => r.isHold],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.isTotal],
    ['UFC ML', (r) => r.sport === 'UFC' && r.mkt === 'ML'],
    ['chalk ≤-200', (r) => r.chalk200],
    ['near -110 fav', (r) => r.nearPick],
    ['E≥10', (r) => r.edge != null && r.edge >= 10],
    ['BOOST + chalk≤-200', (r) => r.isBoost && r.chalk200],
    ['HOLD + MLB TOTAL', (r) => r.isHold && r.sport === 'MLB' && r.isTotal],
    ['BOOST + E≥20', (r) => r.isBoost && r.edge != null && r.edge >= 20],
    ['units 4–4.99', (r) => r.units >= 4 && r.units < 5],
    ['units ≥5.4', (r) => r.units >= 5.4],
  ];
  for (const [name, fn] of shapes) {
    const t = agg(top4.filter(fn));
    const o = agg(nonTop4.filter(fn));
    const tf = t.n ? `${t.n} ${t.w}–${t.l} ${t.roi >= 0 ? '+' : ''}${t.roi.toFixed(0)}% ${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(1)}u` : '—';
    const of = o.n ? `${o.n} ${o.w}–${o.l} ${o.roi >= 0 ? '+' : ''}${o.roi.toFixed(0)}% ${o.pnl >= 0 ? '+' : ''}${o.pnl.toFixed(1)}u` : '—';
    line(lines, `| ${name} | ${tf} | ${of} |`);
  }
  line(lines, '');

  line(lines, '### Peer paths that are also “model 4u+” (not sharp-rescue)');
  line(lines, '');
  bucket(lines, ge4.filter((r) => ['TOP', 'TOP+', 'SUPER', 'MINI', 'RANK'].includes(r.path)), (r) => r.path, 'Path A/B natives ≥4u');

  line(lines, '### August-only: TOP vs same shapes on non-TOP');
  line(lines, '');
  const augTop = top4.filter((r) => r.date >= '2026-08-01');
  const augOther = nonTop4.filter((r) => r.date >= '2026-08-01');
  line(lines, '| Shape | Aug TOP | Aug non-TOP |');
  line(lines, '|-------|---------|-------------|');
  for (const [name, fn] of shapes) {
    const t = agg(augTop.filter(fn));
    const o = agg(augOther.filter(fn));
    if (!t.n && !o.n) continue;
    const tf = t.n ? `${t.n} ${t.w}–${t.l} ${t.roi >= 0 ? '+' : ''}${t.roi.toFixed(0)}%` : '—';
    const of = o.n ? `${o.n} ${o.w}–${o.l} ${o.roi >= 0 ? '+' : ''}${o.roi.toFixed(0)}%` : '—';
    line(lines, `| ${name} | ${tf} | ${of} |`);
  }
  line(lines, '');

  line(lines, '## D) Read');
  line(lines, '');
  const jun = agg(top4.filter((r) => r.month === '2026-06'));
  const jul = agg(top4.filter((r) => r.month === '2026-07'));
  const aug = agg(top4.filter((r) => r.month === '2026-08'));
  line(lines, `- Jun TOP≥4: ${fmt(jun)}`);
  line(lines, `- Jul TOP≥4: ${fmt(jul)}`);
  line(lines, `- Aug TOP≥4: ${fmt(aug)}`);
  line(lines, '');
  line(lines, 'If Aug is uniquely bad vs Jun/Jul → trend is **new/regime**.');
  line(lines, 'If Jun/Jul also weak → TOP HC=1 has been a chronic soft path.');
  line(lines, 'If same shapes on non-TOP are fine → blame **pathway selection** (who gets hcMargin=1).');
  line(lines, 'If same shapes on non-TOP are also bad → blame **underlying shape** TOP happens to load.');

  // hcMargin==1 any path
  const hc1 = ge4.filter((r) => r.hcMargin === 1);
  line(lines, '');
  line(lines, `### Sanity: all ≥4u with stamped hcMargin===1: ${fmt(agg(hc1))}`);
  line(lines, `(Should mostly equal TOP; mismatches = later path overwrite or stamp gaps.)`);
  bucket(lines, hc1, (r) => r.path, 'hcMargin===1 by stamped path');

  const out = join(REPO_ROOT, 'tmp_top_path_diagnosis.md');
  writeFileSync(out, `${lines.join('\n')}\n`);
  writeFileSync(join(REPO_ROOT, 'tmp_top_path_diagnosis.json'), JSON.stringify({
    generated: new Date().toISOString(),
    top4, summary: { all: agg(ge4), top: agg(top4), nonTop: agg(nonTop4), jun, jul, aug },
  }, null, 2));
  line(lines, '');
  line(lines, `Wrote ${out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
