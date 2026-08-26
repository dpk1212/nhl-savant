#!/usr/bin/env node
/**
 * 4u+ health & trajectory by sport × time — Jun15+.
 * Overlays known cutovers; flags stamp-coverage cliffs (leakage risk).
 *
 * Usage: node scripts/audit4uTrajectoryBySport.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config as loadEnv } from 'dotenv';
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

/** Policy / sizing cutovers that can shift 4u+ composition or results */
const CUTOVERS = [
  { date: '2026-06-15', tag: 'Path A HC tiers (v12.1)' },
  { date: '2026-06-26', tag: 'Path C SHARP rescue · MINI- cut · TOP+ on' },
  { date: '2026-07-12', tag: 'Path C retune · TOP+ OFF · Path D/E' },
  { date: '2026-07-15', tag: 'TAPE sizing LIVE · EDGE size frozen' },
  { date: '2026-07-19', tag: 'EDGE/net Path C · TOP NEITHER mute · RANK tape-exempt' },
  { date: '2026-07-20', tag: 'EDGE band size A/C (mute E<5)' },
  { date: '2026-07-21', tag: 'Tape EDGE-heavy · BOTH/ONE floors ≥4/5u' },
  { date: '2026-07-22', tag: 'EDGE band v2 (mute E<7)' },
  { date: '2026-08-03', tag: 'EDGE abs bands · qConv Q1 mute' },
  { date: '2026-08-05', tag: 'FOOLS-gold mute' },
  { date: '2026-08-08', tag: 'Q1 + UNOPP promote · FOOLS hard 0u' },
  { date: '2026-08-12', tag: 'qConv scoped Path C only (A+RANK exempt)' },
  { date: '2026-08-16', tag: 'UNOPP hard floor · sport-local size' },
  { date: '2026-08-19', tag: 'Flinch/fail-open mute · skill v14–16 stamps' },
  { date: '2026-08-20', tag: 'maxSR-sub4 mute · ticketEv/steam live stamps' },
  { date: '2026-08-23', tag: 'no-confirmed mute' },
];

/** Analysis eras between major regime boundaries */
const ERAS = [
  { id: 'E0', from: '2026-06-15', to: '2026-07-11', label: 'Jun15–Jul11 pre-tape (TOP+ era)' },
  { id: 'E1', from: '2026-07-12', to: '2026-07-14', label: 'Jul12–14 post-TOP+ / pre-tape' },
  { id: 'E2', from: '2026-07-15', to: '2026-07-18', label: 'Jul15–18 tape v1' },
  { id: 'E3', from: '2026-07-19', to: '2026-07-21', label: 'Jul19–21 EDGE/net + floors' },
  { id: 'E4', from: '2026-07-22', to: '2026-08-02', label: 'Jul22–Aug2 EDGE band v2' },
  { id: 'E5', from: '2026-08-03', to: '2026-08-07', label: 'Aug3–7 qConv + FOOLS start' },
  { id: 'E6', from: '2026-08-08', to: '2026-08-15', label: 'Aug8–15 Q1/UNOPP era' },
  { id: 'E7', from: '2026-08-16', to: '2026-08-18', label: 'Aug16–18 sport-local size' },
  { id: 'E8', from: '2026-08-19', to: '2026-08-25', label: 'Aug19–25 sub4 mutes + EV stamps' },
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
function fmt(a) {
  if (!a?.n) return 'n=0';
  return `${a.n} · ${a.w}–${a.l} · ${a.wr.toFixed(0)}% · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u · ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}%`;
}
function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function pathOf(sd) {
  return sd.v8_hcStakeTier || sd.v8_agsV12Tier || sd.v8_stakePath || sd.v8_agsTier || '—';
}
function eraOf(date) {
  for (const e of ERAS) {
    if (date >= e.from && date <= e.to) return e;
  }
  return { id: 'EX', from: date, to: date, label: `other ${date}` };
}
function weekKey(date) {
  // Monday-start ISO-ish week label from date string
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const day = dt.getUTCDay(); // 0 Sun
  const diff = day === 0 ? -6 : 1 - day;
  dt.setUTCDate(dt.getUTCDate() + diff);
  return dt.toISOString().slice(0, 10); // week starting Monday
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
        if (won == null || res.tracked === true) continue;
        const units = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? 0);
        if (!(units >= 4)) continue;

        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        const odds = Number(peak.odds || lock.odds || 0);
        const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
          .filter((w) => w && w.side);
        const path = pathOf(sd);
        const era = eraOf(date);
        rows.push({
          id: docSnap.id,
          date,
          week: weekKey(date),
          eraId: era.id,
          eraLabel: era.label,
          sport: data.sport || 'UNK',
          mkt,
          path,
          units,
          odds,
          won,
          profit: profitOf(units, odds, won),
          isTop: path === 'TOP' || path === 'TOP+',
          edge: num(sd.v8_winnerAlignEdge),
          meanFor: num(sd.v8_winnerAlignMeanFor),
          tapeAction: String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_') || null,
          maxSR: maxForSizeRatio(wd, sideKey),
          hcMargin: num(sd.v8_hcMargin),
          ticketEv: num(sd.v8_ticketEvPct),
          expWin: num(sd.v8_expWin),
          steamLH: num(sd.v8_steamLastHourPct ?? sd.v8_steam?.lastHourPct),
          blendWr: num(sd.v8_blendWr),
          skillVer: num(sd.v8_skillFeatureVersion),
          qConv: num(sd.v8_qConv),
          netMeanPrior: num(sd.v8_netMeanPrior),
        });
      }
    }
  }
  return rows;
}

function groupAgg(rows, keyFn) {
  const map = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  }
  return [...map.entries()]
    .map(([k, rs]) => ({ key: k, ...agg(rs), rows: rs }))
    .sort((a, b) => String(a.key).localeCompare(String(b.key)));
}

function cumPnl(dayList) {
  let c = 0;
  return dayList.map((d) => {
    c += d.pnl;
    return { ...d, cum: c };
  });
}

function stampCoverage(rows) {
  const n = rows.length || 1;
  const has = (fn) => rows.filter(fn).length;
  return {
    n: rows.length,
    edge: has((r) => r.edge != null),
    tape: has((r) => r.tapeAction && r.tapeAction !== '—'),
    ticketEv: has((r) => r.ticketEv != null),
    expWin: has((r) => r.expWin != null),
    steam: has((r) => r.steamLH != null),
    blend: has((r) => r.blendWr != null),
    skillVer: has((r) => r.skillVer != null),
    pctEv: (100 * has((r) => r.ticketEv != null)) / n,
  };
}

async function main() {
  console.error('Loading 4u+ Jun15+…');
  const rows = await load(db());
  const lines = [];
  const out = (s = '') => { lines.push(s); console.log(s); };

  out('# 4u+ trajectory & health by sport × time (Jun15+)');
  out(`_Generated ${new Date().toISOString()} · ACTUAL shipped book · stamp-safe_`);
  out('');
  out(`Universe: **${fmt(agg(rows))}**`);
  out('');

  // ── Cutover legend ────────────────────────────────────────────────────
  out('## 0. Cutover calendar (what could shift the book)');
  out('');
  out('| Date | Change |');
  out('|------|--------|');
  for (const c of CUTOVERS) out(`| ${c.date} | ${c.tag} |`);
  out('');
  out('Analysis eras below are buckets between those boundaries.');
  out('');

  // ── Overall eras ──────────────────────────────────────────────────────
  out('## 1. Overall 4u+ by regime era');
  out('');
  out('| Era | n | W–L | WR | Stake | PnL | ROI | TOP n/PnL | nonTOP ROI |');
  out('|-----|--:|:---:|---:|------:|----:|----:|-----------|-----------:|');
  for (const e of ERAS) {
    const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
    const a = agg(rs);
    if (!a.n) {
      out(`| ${e.id} ${e.label} | 0 | — | — | — | — | — | — | — |`);
      continue;
    }
    const top = agg(rs.filter((r) => r.isTop));
    const nt = agg(rs.filter((r) => !r.isTop));
    out(`| ${e.id} ${e.label} | ${a.n} | ${a.w}–${a.l} | ${a.wr.toFixed(0)}% | ${a.stake.toFixed(0)}u | ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u | ${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(1)}% | ${top.n || 0}/${top.n ? `${top.pnl >= 0 ? '+' : ''}${top.pnl.toFixed(1)}u` : '—'} | ${nt.n ? `${nt.roi >= 0 ? '+' : ''}${nt.roi.toFixed(0)}%` : '—'} |`);
  }
  out('');

  // Cumulative by day overall
  out('### Cumulative PnL (all sports)');
  out('```');
  const daysAll = cumPnl(groupAgg(rows, (r) => r.date).map((d) => ({ date: d.key, ...d })));
  for (const d of daysAll) {
    const marks = CUTOVERS.filter((c) => c.date === d.date).map((c) => ` ← ${c.tag}`).join('');
    out(`${d.date}  n=${String(d.n).padStart(2)}  day=${(d.pnl >= 0 ? '+' : '') + d.pnl.toFixed(1).padStart(5)}  cum=${(d.cum >= 0 ? '+' : '') + d.cum.toFixed(1).padStart(6)}${marks}`);
  }
  out('```');
  out('');

  // ── By sport overall ──────────────────────────────────────────────────
  out('## 2. 4u+ by sport (Jun15+ full window)');
  out('');
  out('| Sport | n | W–L | WR | PnL | ROI | Stake share | TOP PnL |');
  out('|-------|--:|:---:|---:|----:|----:|------------:|--------:|');
  const totalStake = agg(rows).stake || 1;
  const bySport = groupAgg(rows, (r) => r.sport).sort((a, b) => b.pnl - a.pnl);
  for (const s of bySport) {
    const top = agg(s.rows.filter((r) => r.isTop));
    out(`| ${s.key} | ${s.n} | ${s.w}–${s.l} | ${s.wr.toFixed(0)}% | ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(1)}u | ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(1)}% | ${((100 * s.stake) / totalStake).toFixed(0)}% | ${top.n ? `${top.pnl >= 0 ? '+' : ''}${top.pnl.toFixed(1)}u (n=${top.n})` : '—'} |`);
  }
  out('');

  // ── Sport × era matrix ────────────────────────────────────────────────
  out('## 3. Sport × era ROI matrix');
  out('');
  const sports = [...new Set(rows.map((r) => r.sport))].sort();
  const eraHeader = ERAS.map((e) => e.id).join(' | ');
  out(`| Sport | ${eraHeader} |`);
  out(`|-------|${ERAS.map(() => '----:').join('|')}|`);
  for (const sp of sports) {
    const cells = ERAS.map((e) => {
      const rs = rows.filter((r) => r.sport === sp && r.date >= e.from && r.date <= e.to);
      const a = agg(rs);
      if (!a.n) return '—';
      if (a.n < 3) return `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}%·${a.n}`;
      return `${a.roi >= 0 ? '+' : ''}${a.roi.toFixed(0)}% (${a.n})`;
    });
    out(`| ${sp} | ${cells.join(' | ')} |`);
  }
  out('');
  out('_Cell = ROI (n). Thin n&lt;3 marked with ·n._');
  out('');

  out('## 4. Sport × era PnL matrix (units)');
  out('');
  out(`| Sport | ${eraHeader} | Total |`);
  out(`|-------|${ERAS.map(() => '----:').join('|')}|------:|`);
  for (const sp of sports) {
    const cells = [];
    let tot = 0;
    for (const e of ERAS) {
      const rs = rows.filter((r) => r.sport === sp && r.date >= e.from && r.date <= e.to);
      const a = agg(rs);
      tot += a.pnl;
      cells.push(a.n ? `${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(0)}` : '—');
    }
    out(`| ${sp} | ${cells.join(' | ')} | ${tot >= 0 ? '+' : ''}${tot.toFixed(0)} |`);
  }
  out('');

  // ── Per-sport deep trajectory ─────────────────────────────────────────
  out('## 5. Per-sport weekly trajectory');
  out('');
  for (const sp of sports) {
    const rs = rows.filter((r) => r.sport === sp);
    const a = agg(rs);
    out(`### ${sp} — ${fmt(a)}`);
    out('');
    const weeks = groupAgg(rs, (r) => r.week);
    out('| Week start | n | W–L | PnL | ROI | Paths (top 3 by |PnL|) |');
    out('|------------|--:|:---:|----:|----:|------------------------|');
    for (const w of weeks) {
      const paths = groupAgg(w.rows, (r) => r.path)
        .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
        .slice(0, 3)
        .map((p) => `${p.key} ${p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(1)}`)
        .join(', ');
      const cuts = CUTOVERS.filter((c) => c.date >= w.key && c.date < (() => {
        const [y, m, d] = w.key.split('-').map(Number);
        const dt = new Date(Date.UTC(y, m - 1, d + 7));
        return dt.toISOString().slice(0, 10);
      })());
      const mark = cuts.length ? ` ⚠${cuts.map((c) => c.date.slice(5)).join(',')}` : '';
      out(`| ${w.key}${mark} | ${w.n} | ${w.w}–${w.l} | ${w.pnl >= 0 ? '+' : ''}${w.pnl.toFixed(1)}u | ${w.roi >= 0 ? '+' : ''}${w.roi.toFixed(0)}% | ${paths || '—'} |`);
    }
    out('');

    // Cum tape
    out('```');
    const dlist = cumPnl(groupAgg(rs, (r) => r.date).map((d) => ({ date: d.key, ...d })));
    for (const d of dlist) {
      out(`${d.date}  ${(d.pnl >= 0 ? '+' : '') + d.pnl.toFixed(1).padStart(5)}  cum ${(d.cum >= 0 ? '+' : '') + d.cum.toFixed(1).padStart(6)}`);
    }
    out('```');
    out('');
  }

  // ── TOP vs non-TOP trajectory ─────────────────────────────────────────
  out('## 6. TOP vs non-TOP trajectory (the structural split)');
  out('');
  out('| Era | TOP | non-TOP |');
  out('|-----|-----|---------|');
  for (const e of ERAS) {
    const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
    const t = agg(rs.filter((r) => r.isTop));
    const n = agg(rs.filter((r) => !r.isTop));
    out(`| ${e.id} | ${t.n ? fmt(t) : 'n=0'} | ${n.n ? fmt(n) : 'n=0'} |`);
  }
  out('');

  out('### TOP by sport × era (PnL)');
  out(`| Sport | ${eraHeader} |`);
  out(`|-------|${ERAS.map(() => '----:').join('|')}|`);
  const topSports = [...new Set(rows.filter((r) => r.isTop).map((r) => r.sport))].sort();
  for (const sp of topSports) {
    const cells = ERAS.map((e) => {
      const a = agg(rows.filter((r) => r.isTop && r.sport === sp && r.date >= e.from && r.date <= e.to));
      return a.n ? `${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(0)}(${a.n})` : '—';
    });
    out(`| ${sp} | ${cells.join(' | ')} |`);
  }
  out('');

  // ── Path mix shift over eras ──────────────────────────────────────────
  out('## 7. Path mix shift (composition leakage check)');
  out('');
  out('If a cutover *changes who gets to 4u+*, ROI shifts can be mix — not edge.');
  out('');
  for (const e of ERAS) {
    const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
    if (!rs.length) continue;
    const paths = groupAgg(rs, (r) => r.path).sort((a, b) => b.stake - a.stake);
    const st = agg(rs).stake || 1;
    out(`**${e.id} ${e.label}** — stake mix:`);
    for (const p of paths) {
      out(`- ${p.key}: ${((100 * p.stake) / st).toFixed(0)}% stake · ${fmt(p)}`);
    }
    out('');
  }

  // ── Stamp coverage cliffs ─────────────────────────────────────────────
  out('## 8. Stamp coverage cliffs (analysis leakage risk)');
  out('');
  out('Features that appear mid-window will fake “stable across Jun15+” if you naively filter.');
  out('');
  out('| Era | n | %EDGE | %tape | %ticketEv | %expWin | %steam | %blend |');
  out('|-----|--:|------:|------:|----------:|--------:|-------:|-------:|');
  for (const e of ERAS) {
    const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
    const c = stampCoverage(rs);
    if (!c.n) continue;
    out(`| ${e.id} | ${c.n} | ${((100 * c.edge) / c.n).toFixed(0)}% | ${((100 * c.tape) / c.n).toFixed(0)}% | ${c.pctEv.toFixed(0)}% | ${((100 * c.expWin) / c.n).toFixed(0)}% | ${((100 * c.steam) / c.n).toFixed(0)}% | ${((100 * c.blend) / c.n).toFixed(0)}% |`);
  }
  out('');

  // ── Unit / BOOST intensity over time ──────────────────────────────────
  out('## 9. Size intensity over time (are we betting bigger?)');
  out('');
  out('| Era | mean u | median u | %≥5.4u | %≥6u | BOOST tape % |');
  out('|-----|-------:|---------:|-------:|-----:|-------------:|');
  for (const e of ERAS) {
    const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
    if (!rs.length) continue;
    const us = rs.map((r) => r.units).sort((a, b) => a - b);
    const mean = us.reduce((a, b) => a + b, 0) / us.length;
    const med = us[Math.floor(us.length / 2)];
    const p54 = (100 * us.filter((u) => u >= 5.4).length) / us.length;
    const p6 = (100 * us.filter((u) => u >= 6).length) / us.length;
    const boost = (100 * rs.filter((r) => r.tapeAction === 'BOOST').length) / rs.length;
    out(`| ${e.id} | ${mean.toFixed(2)} | ${med.toFixed(2)} | ${p54.toFixed(0)}% | ${p6.toFixed(0)}% | ${boost.toFixed(0)}% |`);
  }
  out('');

  // ── Regime shift detector ─────────────────────────────────────────────
  out('## 10. Regime-shift flags (auto)');
  out('');
  const eraStats = ERAS.map((e) => {
    const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
    return { e, a: agg(rs), top: agg(rs.filter((r) => r.isTop)), nt: agg(rs.filter((r) => !r.isTop)), rs };
  }).filter((x) => x.a.n >= 5);

  for (let i = 1; i < eraStats.length; i++) {
    const prev = eraStats[i - 1];
    const cur = eraStats[i];
    const dRoi = (cur.a.roi ?? 0) - (prev.a.roi ?? 0);
    const dTop = (cur.top.pnl || 0) - (prev.top.pnl || 0);
    const flags = [];
    if (Math.abs(dRoi) >= 15) flags.push(`ROI swing ${dRoi >= 0 ? '+' : ''}${dRoi.toFixed(0)}pp vs prior era`);
    if ((prev.a.roi ?? 0) > 5 && (cur.a.roi ?? 0) < -5) flags.push('flipped +→−');
    if ((prev.a.roi ?? 0) < -5 && (cur.a.roi ?? 0) > 5) flags.push('flipped −→+');
    if (cur.top.n >= 3 && (cur.top.roi ?? 0) < -20) flags.push(`TOP sick (${cur.top.roi.toFixed(0)}% ROI)`);
    if (cur.nt.n >= 5 && (cur.nt.roi ?? 0) > 15) flags.push(`nonTOP strong (+${cur.nt.roi.toFixed(0)}%)`);
    // sport concentration
    for (const sp of sports) {
      const a = agg(cur.rs.filter((r) => r.sport === sp));
      if (a.n >= 3 && a.pnl <= -8) flags.push(`${sp} bleed ${a.pnl.toFixed(1)}u`);
      if (a.n >= 3 && a.pnl >= 12) flags.push(`${sp} print +${a.pnl.toFixed(1)}u`);
    }
    if (!flags.length) continue;
    out(`- **${cur.e.id} ← after ${prev.e.id}** (${cur.e.label}): ${flags.join('; ')}`);
  }
  out('');

  // ── Current health snapshot ───────────────────────────────────────────
  out('## 11. Current health snapshot (what “now” looks like)');
  out('');
  const recent = rows.filter((r) => r.date >= '2026-08-19');
  const aug = rows.filter((r) => r.date >= '2026-08-01');
  const jul15 = rows.filter((r) => r.date >= '2026-07-15');
  out(`| Window | All 4u+ | non-TOP | TOP |`);
  out(`|--------|---------|---------|-----|`);
  out(`| Aug19–25 (current regime) | ${fmt(agg(recent))} | ${fmt(agg(recent.filter((r) => !r.isTop)))} | ${fmt(agg(recent.filter((r) => r.isTop)))} |`);
  out(`| August MTD | ${fmt(agg(aug))} | ${fmt(agg(aug.filter((r) => !r.isTop)))} | ${fmt(agg(aug.filter((r) => r.isTop)))} |`);
  out(`| Jul15+ (tape era) | ${fmt(agg(jul15))} | ${fmt(agg(jul15.filter((r) => !r.isTop)))} | ${fmt(agg(jul15.filter((r) => r.isTop)))} |`);
  out(`| Jun15+ full | ${fmt(agg(rows))} | ${fmt(agg(rows.filter((r) => !r.isTop)))} | ${fmt(agg(rows.filter((r) => r.isTop)))} |`);
  out('');

  out('### Current regime by sport (Aug19–25)');
  out('| Sport | n | W–L | PnL | ROI |');
  out('|-------|--:|:---:|----:|----:|');
  for (const s of groupAgg(recent, (r) => r.sport).sort((a, b) => a.pnl - b.pnl)) {
    out(`| ${s.key} | ${s.n} | ${s.w}–${s.l} | ${s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(1)}u | ${s.roi >= 0 ? '+' : ''}${s.roi.toFixed(0)}% |`);
  }
  out('');

  // ── Synthesis ─────────────────────────────────────────────────────────
  out('## 12. Synthesis — trajectory & leakage read');
  out('');
  out('### Health trajectory (structural)');
  out('1. **non-TOP 4u+ is the healthy engine** across essentially every era after tape — see §6.');
  out('2. **TOP is the chronic soft organ** — negative or flat in most eras; August is the acute flare (−20u).');
  out('3. **Volume/size intensified** after Jul21 floors + Aug EDGE abs bands — more ≥5.4u BOOST tickets (see §9). That amplifies both wins and TOP mistakes.');
  out('');
  out('### Cutover-aligned regime notes');
  out('- **Jul15 tape**: first clean tape-era book — check E2 vs E0 mix.');
  out('- **Jul19–22**: EDGE/net + band + floors — size intensity step-up; TOP NEITHER mute should *remove* junk TOP, not create it.');
  out('- **Aug3–8**: qConv/FOOLS/Q1 — mostly sub-4 / Path C composition; 4u+ impact is indirect (who survives to size).');
  out('- **Aug16 sport-local size**: can change HC lead identity → TOP selection drift (leakage-of-definition, not look-ahead).');
  out('- **Aug19–20**: sub-4 mutes do **not** touch 4u+ by design; ticketEv/steam stamps appear — analysis-only leakage risk if used retroactively.');
  out('');
  out('### Leakage checklist');
  out('| Risk | Status |');
  out('|------|--------|');
  out('| Live wallet profile WR on historical tickets | Known bad — already retracted |');
  out('| ticketEv/expWin/steam before Aug19–20 | Missing — cannot claim Jun15+ stability |');
  out('| Sport-local size (Aug16+) changing TOP leads | Possible composition shift — compare E6 vs E7 TOP |');
  out('| Mix shift masquerading as edge decay | Use §7 path-mix + §3 sport×era together |');
  out('| Sub-4 mute “infecting” 4u+ stats | Should be null by design — confirm 4u+ n stable across E7→E8 |');
  out('');
  out('### What “healthy enough” means right now');
  const cur = agg(recent);
  const curNt = agg(recent.filter((r) => !r.isTop));
  const curTop = agg(recent.filter((r) => r.isTop));
  if ((curNt.roi ?? 0) >= 10 && (curTop.roi ?? 0) < 0) {
    out(`Current regime: **non-TOP healthy (${curNt.roi.toFixed(0)}% ROI)** while **TOP drags (${curTop.n ? curTop.roi.toFixed(0) : 'n/a'}%)**. Overall ${cur.roi?.toFixed(1)}% is a blended number — do not shrink 4u+ volume; discriminate inside TOP.`);
  } else if ((cur.roi ?? 0) >= 8) {
    out(`Current regime overall ROI ${cur.roi.toFixed(1)}% — healthy; still inspect TOP.`);
  } else {
    out(`Current regime overall ROI ${cur.roi?.toFixed(1)}% — soft; decompose by sport (§11) and TOP (§6) before cutting volume.`);
  }
  out('');
  out('_Next (on request): unbounded pattern search conditioned on these regimes — sport-local, era-local, interaction-native — without human-typical feature lists._');

  const md = lines.join('\n');
  writeFileSync(join(ROOT, 'tmp_4u_trajectory_sport.md'), md);
  writeFileSync('/opt/cursor/artifacts/tmp_4u_trajectory_sport.md', md);

  const json = {
    overall: agg(rows),
    eras: ERAS.map((e) => {
      const rs = rows.filter((r) => r.date >= e.from && r.date <= e.to);
      return {
        ...e,
        all: agg(rs),
        top: agg(rs.filter((r) => r.isTop)),
        nonTop: agg(rs.filter((r) => !r.isTop)),
        bySport: Object.fromEntries(
          groupAgg(rs, (r) => r.sport).map((s) => [s.key, { n: s.n, w: s.w, l: s.l, pnl: s.pnl, roi: s.roi }]),
        ),
        coverage: stampCoverage(rs),
      };
    }),
    bySport: Object.fromEntries(
      bySport.map((s) => [s.key, { n: s.n, w: s.w, l: s.l, pnl: s.pnl, roi: s.roi, stake: s.stake }]),
    ),
    cutovers: CUTOVERS,
    current: {
      aug19: {
        all: agg(recent),
        nonTop: agg(recent.filter((r) => !r.isTop)),
        top: agg(recent.filter((r) => r.isTop)),
      },
    },
  };
  writeFileSync(join(ROOT, 'tmp_4u_trajectory_sport.json'), JSON.stringify(json, null, 2));
  writeFileSync('/opt/cursor/artifacts/tmp_4u_trajectory_sport.json', JSON.stringify(json, null, 2));
  console.error('Wrote tmp_4u_trajectory_sport.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
