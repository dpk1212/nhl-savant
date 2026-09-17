#!/usr/bin/env node
/**
 * $ share volume + board composition over v12 (Jun 1+).
 *
 *   node scripts/analyzeShareVolume.mjs
 *
 * Did 25–40% go from a rare cell to a real slice of the book?
 * Are those tickets the same animal (wallet count / board $) as June's 9?
 * No policy.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sourceFlagsFromSportRec, sportRecFromProfiles } from '../src/lib/steamTailPolicy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const V12_FROM = '2026-06-01';
const STEAM_FROM = '2026-08-19';
const T_FROM = '2026-08-31';

function decodeValue(v) {
  if (v == null || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return decodeMap(v.mapValue?.fields || {});
  if ('arrayValue' in v) return (v.arrayValue?.values || []).map(decodeValue);
  return v;
}
function decodeMap(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) out[k] = decodeValue(v);
  return out;
}
async function listCollection(col) {
  const docs = [];
  let pageToken = '';
  for (;;) {
    const u = new URL(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${col}`);
    u.searchParams.set('pageSize', '300');
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    const res = await fetch(u);
    if (!res.ok) throw new Error(`${col} ${res.status} ${await res.text()}`);
    const body = await res.json();
    for (const d of body.documents || []) {
      docs.push({ id: String(d.name || '').split('/').pop(), ...decodeMap(d.fields || {}) });
    }
    pageToken = body.nextPageToken || '';
    if (!pageToken) break;
  }
  return docs;
}
function isAgsu(tag) {
  return typeof tag === 'string' && tag.startsWith('ags-unified-v');
}
function americanProfit(won, units, odds) {
  if (won == null || !(units > 0)) return 0;
  if (won) return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
  return -units;
}
function wilson(w, n, z = 1.96) {
  if (!(n > 0)) return null;
  const p = w / n;
  const z2 = z * z;
  const den = 1 + z2 / n;
  const mid = p + z2 / (2 * n);
  const half = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);
  return { lo: Math.max(0, (mid - half) / den), hi: Math.min(1, (mid + half) / den) };
}
function agg(rs) {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rs) {
    if (r.won == null) continue;
    n++;
    stake += Number(r.u) || 0;
    pnl += Number.isFinite(Number(r.pnl)) ? Number(r.pnl) : 0;
    if (r.won === 1) w++; else l++;
  }
  const ci = wilson(w, n);
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  return `${a.n} · ${a.w}–${a.l} · ${a.wr}% · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u · ${roi}`;
}
function mdTable(headers, rows) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
}
function median(xs) {
  const a = xs.filter((x) => Number.isFinite(x)).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function mean(xs) {
  const a = xs.filter((x) => Number.isFinite(x));
  if (!a.length) return null;
  return a.reduce((s, x) => s + x, 0) / a.length;
}
function money(n) {
  if (!Number.isFinite(n)) return '—';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}
function nfix(n, d = 1) {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(d);
}
function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function weekStart(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  const dow = d.getUTCDay(); // 0 Sun
  const back = (dow + 6) % 7; // Monday-start
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
}

function walletDetailsOf(sd, lock, peak) {
  const lists = [
    peak?.v8Scoring?.walletDetails,
    lock?.v8Scoring?.walletDetails,
    sd?.v8Scoring?.walletDetails,
    peak?.walletDetails,
    lock?.walletDetails,
    sd?.walletDetails,
  ];
  for (const x of lists) {
    if (Array.isArray(x) && x.length) return x;
  }
  return [];
}

const rawProfiles = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
const profiles = rawProfiles.profiles || rawProfiles;
function flagsOf(short, sport) {
  return sourceFlagsFromSportRec(sportRecFromProfiles(profiles, short, sport));
}

console.error('fetch…');
const packs = await Promise.all(COLS.map(async ([col, mkt]) => {
  const docs = await listCollection(col);
  console.error(`  ${col} ${docs.length}`);
  return { mkt, docs };
}));

const rows = [];
for (const { mkt, docs } of packs) {
  for (const data of docs) {
    if (!data.sides || data.date < V12_FROM) continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const status = sd.status || data.status;
      const res = sd.result || {};
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won == null) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const u = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const tracked = res.tracked === true || u === 0;
      const live = status === 'COMPLETED' && !tracked && u > 0;
      const pnl = live ? (Number.isFinite(res.profit) ? res.profit : americanProfit(won, u, odds)) : 0;

      const sport = data.sport || 'NHL';
      const wd = walletDetailsOf(sd, lock, peak);
      let $for = 0; let $ag = 0;
      let nFor = 0; let nAg = 0;
      let nForP = 0; let nAgP = 0;
      const shorts = [];
      const seen = new Set();
      for (const w of wd) {
        if (!w) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        shorts.push(short);
        const onOurs = String(w.side) === String(sideKey);
        const inv = Number(w.invested) || 0;
        const f = flagsOf(short, sport);
        const proven = !!(f.confirmed || f.flat);
        if (onOurs) {
          $for += inv;
          nFor++;
          if (proven) nForP++;
        } else {
          $ag += inv;
          nAg++;
          if (proven) nAgP++;
        }
      }
      const board = $for + $ag;
      const share = board > 0 ? $for / board : null;

      rows.push({
        date: data.date,
        sport,
        mkt,
        team: sd.team || sideKey,
        won,
        odds,
        u,
        pnl,
        live,
        share,
        board,
        nFor,
        nAg,
        nForP,
        nAgP,
        wdN: seen.size,
        shorts,
      });
    }
  }
}

const liveOf = (rs) => rs.filter((r) => r.live);
const win = (rs, lo, hi) => rs.filter((r) => r.date >= lo && r.date <= hi);
const dates = [...new Set(rows.map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const liveDates = [...new Set(liveOf(rows).map((r) => r.date))].sort();
const nDays = (lo, hi) => {
  const a = new Date(`${lo}T12:00:00Z`);
  const b = new Date(`${hi}T12:00:00Z`);
  return Math.round((b - a) / 86400000) + 1;
};

function band(r) {
  if (!Number.isFinite(r.share)) return 'no $';
  if (r.share < 0.25) return '<25%';
  if (r.share < 0.40) return '25–40%';
  if (r.share < 0.50) return '40–50%';
  if (r.share < 0.60) return '40–60%'.replace('40–60%', '50–60%');
  return '≥60%';
}

function bothSides(r) {
  return (r.nFor || 0) > 0 && (r.nAg || 0) > 0;
}

function uniqueWallets(rs) {
  const s = new Set();
  for (const r of rs) for (const x of r.shorts || []) s.add(x);
  return s.size;
}

function mix(rs) {
  const a = agg(rs);
  const days = new Set(rs.map((r) => r.date)).size;
  const perDay = days ? rs.length / days : 0;
  const pctBook = null;
  return {
    ...a,
    days,
    perDay,
    medWd: median(rs.map((r) => r.wdN)),
    meanWd: mean(rs.map((r) => r.wdN)),
    medBoard: median(rs.map((r) => r.board)),
    meanBoard: mean(rs.map((r) => r.board)),
    medFor: median(rs.map((r) => r.nFor)),
    medAg: median(rs.map((r) => r.nAg)),
    both: rs.filter(bothSides).length,
    uniq: uniqueWallets(rs),
  };
}

function volLine(m, bookN) {
  if (!m.n) return '—';
  const pct = bookN ? `${((m.n / bookN) * 100).toFixed(0)}% of book` : '';
  return `${m.n} (${pct}) · ${nfix(m.perDay, 2)}/day · med ${nfix(m.medWd, 0)} wallets · med board ${money(m.medBoard)}`;
}

const eras = [
  ['June', '2026-06-01', '2026-06-30'],
  ['July', '2026-07-01', '2026-07-31'],
  ['Aug 1–18', '2026-08-01', '2026-08-18'],
  ['Jun–Aug 18', '2026-06-01', '2026-08-18'],
  ['Aug 19–30', '2026-08-19', '2026-08-30'],
  ['Steam 8/19+', STEAM_FROM, lastDate],
  ['T 8/31+', T_FROM, lastDate],
  ['Last 7', addDays(lastDate, -6), lastDate],
  ['Full v12', V12_FROM, lastDate],
];

const BANDS = ['<25%', '25–40%', '40–50%', '50–60%', '≥60%'];

const out = [];
const p = (s = '') => out.push(s);

p('# $ share volume — did the board change?');
p('');
p(`_Pulled ${new Date().toISOString().slice(0, 10)}. Live AGS-U ${V12_FROM}–${lastDate}. Wallet count = unique shorts on \`walletDetails\`. Board $ = invested ours+against. **No policy.**_`);
p('');

p('## Direct answer');
p('');

{
  const jun = liveOf(win(rows, '2026-06-01', '2026-07-31'));
  const t = liveOf(win(rows, T_FROM, lastDate));
  const j2540 = jun.filter((r) => band(r) === '25–40%');
  const t2540 = t.filter((r) => band(r) === '25–40%');
  const jMix = mix(jun);
  const tMix = mix(t);
  const jC = mix(j2540);
  const tC = mix(t2540);
  p(`June–July live book: **${jMix.n}** tickets, **${jMix.uniq}** distinct wallets, median **${nfix(jMix.medWd, 0)}** wallets/ticket, median board **${money(jMix.medBoard)}**. 25–40% was **${jC.n}** tickets (**${((jC.n / jMix.n) * 100).toFixed(1)}%** of the book, **${nfix(jC.perDay, 2)}/day**).`);
  p('');
  p(`T live book: **${tMix.n}** tickets, **${tMix.uniq}** distinct wallets, median **${nfix(tMix.medWd, 0)}** wallets/ticket, median board **${money(tMix.medBoard)}**. 25–40% is **${tC.n}** tickets (**${((tC.n / tMix.n) * 100).toFixed(1)}%** of the book, **${nfix(tC.perDay, 2)}/day**).`);
  p('');
}

p('## 1. Share of the live book in each band (this is the volume change)');
p('');
{
  const header = ['Era', 'Live n', 'uniq wallets', 'med wallets/tix', 'med board', ...BANDS.map((b) => `${b} n (% / per day)`)];
  const body = eras.map(([name, lo, hi]) => {
    const rs = liveOf(win(rows, lo, hi));
    const m = mix(rs);
    return [
      name,
      String(rs.length),
      String(m.uniq),
      nfix(m.medWd, 0),
      money(m.medBoard),
      ...BANDS.map((b) => {
        const hit = rs.filter((r) => band(r) === b);
        const mm = mix(hit);
        if (!mm.n) return '—';
        return `${mm.n} · ${((mm.n / rs.length) * 100).toFixed(0)}% · ${nfix(mm.perDay, 2)}/d`;
      }),
    ];
  });
  p(mdTable(header, body));
  p('');
}

p('## 2. Weekly series — 25–40% and 40–50% as % of that week’s live book');
p('');
{
  const weeks = [];
  const seen = new Set();
  for (const d of liveDates) {
    const w = weekStart(d);
    if (!seen.has(w)) { seen.add(w); weeks.push(w); }
  }
  p(mdTable(
    ['Week (Mon)', 'Live', 'uniq wallets', 'med wd', 'med board', '<25%', '25–40%', '40–50%', '50–60%', '≥60%', '25–40% W/L', '40–50% W/L'],
    weeks.map((w) => {
      const hi = addDays(w, 6);
      const rs = liveOf(win(rows, w, hi > lastDate ? lastDate : hi));
      const m = mix(rs);
      const cell = (b) => {
        const hit = rs.filter((r) => band(r) === b);
        if (!hit.length) return '—';
        return `${hit.length} (${((hit.length / rs.length) * 100).toFixed(0)}%)`;
      };
      const wl = (b) => {
        const a = agg(rs.filter((r) => band(r) === b));
        if (!a.n) return '—';
        return `${a.w}–${a.l} ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(0)}u`;
      };
      return [
        w,
        String(rs.length),
        String(m.uniq),
        nfix(m.medWd, 0),
        money(m.medBoard),
        cell('<25%'),
        cell('25–40%'),
        cell('40–50%'),
        cell('50–60%'),
        cell('≥60%'),
        wl('25–40%'),
        wl('40–50%'),
      ];
    }),
  ));
  p('');
}

p('## 3. Are 25–40% tickets the same animal? (wallets + board $)');
p('');
{
  const header = ['Era', 'n', '% of book', '/day', 'W/L', 'med wallets', 'mean wallets', 'med FOR/AG', 'both-sides %', 'med board', 'mean board'];
  const body = eras.map(([name, lo, hi]) => {
    const book = liveOf(win(rows, lo, hi));
    const rs = book.filter((r) => band(r) === '25–40%');
    const m = mix(rs);
    if (!m.n) return [name, '—', '—', '—', '—', '—', '—', '—', '—', '—', '—'];
    return [
      name,
      String(m.n),
      `${((m.n / book.length) * 100).toFixed(1)}%`,
      nfix(m.perDay, 2),
      fmt(agg(rs)),
      nfix(m.medWd, 0),
      nfix(m.meanWd, 1),
      `${nfix(m.medFor, 0)}/${nfix(m.medAg, 0)}`,
      `${((m.both / m.n) * 100).toFixed(0)}%`,
      money(m.medBoard),
      money(m.meanBoard),
    ];
  });
  p(mdTable(header, body));
  p('');
}

p('## 4. Same composition table for 40–50% (the long-book dog)');
p('');
{
  const header = ['Era', 'n', '% of book', '/day', 'W/L', 'med wallets', 'mean wallets', 'med FOR/AG', 'both-sides %', 'med board'];
  const body = eras.map(([name, lo, hi]) => {
    const book = liveOf(win(rows, lo, hi));
    const rs = book.filter((r) => band(r) === '40–50%');
    const m = mix(rs);
    if (!m.n) return [name, '—', '—', '—', '—', '—', '—', '—', '—', '—'];
    return [
      name,
      String(m.n),
      `${((m.n / book.length) * 100).toFixed(1)}%`,
      nfix(m.perDay, 2),
      fmt(agg(rs)),
      nfix(m.medWd, 0),
      nfix(m.meanWd, 1),
      `${nfix(m.medFor, 0)}/${nfix(m.medAg, 0)}`,
      `${((m.both / m.n) * 100).toFixed(0)}%`,
      money(m.medBoard),
    ];
  });
  p(mdTable(header, body));
  p('');
}

p('## 5. Whole-book participation (all live tickets, any share)');
p('');
{
  p(mdTable(
    ['Era', 'Live', 'uniq wallets', 'med wallets/tix', 'mean wallets/tix', 'med board', 'mean board', '% both-sides', '% share <50%'],
    eras.map(([name, lo, hi]) => {
      const rs = liveOf(win(rows, lo, hi));
      const m = mix(rs);
      const lt50 = rs.filter((r) => Number.isFinite(r.share) && r.share < 0.50).length;
      return [
        name,
        String(m.n),
        String(m.uniq),
        nfix(m.medWd, 0),
        nfix(m.meanWd, 1),
        money(m.medBoard),
        money(m.meanBoard),
        `${((m.both / m.n) * 100).toFixed(0)}%`,
        `${((lt50 / m.n) * 100).toFixed(0)}%`,
      ];
    }),
  ));
  p('');
}

p('## 6. June–July 25–40% tickets vs T 25–40% tickets');
p('');
{
  const old = liveOf(win(rows, '2026-06-01', '2026-07-31')).filter((r) => band(r) === '25–40%');
  const neu = liveOf(win(rows, T_FROM, lastDate)).filter((r) => band(r) === '25–40%');
  p('June–July (the “printer”):');
  p('```');
  old.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach((r) => {
    p(`${r.date} ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 24).padEnd(24)} ${String(r.u).padStart(4)}u ${r.won ? 'W' : 'L'} ${String(Math.round(r.share * 100)).padStart(3)}%  wd ${String(r.wdN).padStart(2)}  ${String(r.nFor).padStart(2)}/${String(r.nAg).padStart(2)}  board ${money(r.board).padStart(7)}`);
  });
  p('```');
  p('');
  p('T-era (the dog):');
  p('```');
  neu.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach((r) => {
    p(`${r.date} ${(r.sport || '').padEnd(4)} ${(r.mkt || '').padEnd(6)} ${(r.team || '').slice(0, 24).padEnd(24)} ${String(r.u).padStart(4)}u ${r.won ? 'W' : 'L'} ${String(Math.round(r.share * 100)).padStart(3)}%  wd ${String(r.wdN).padStart(2)}  ${String(r.nFor).padStart(2)}/${String(r.nAg).padStart(2)}  board ${money(r.board).padStart(7)}`);
  });
  p('```');
  p('');
}

p('## 7. Mute CFs weighted by the current book, not summer n');
p('');
p('If the operating regime is T / steam volume, the June–July 16-ticket 25–40% cell is not a veto. Steam + T is the book that looks like today.');
p('');
{
  const rules = [
    ['mute 25–40%', (r) => band(r) === '25–40%'],
    ['mute 40–50%', (r) => band(r) === '40–50%'],
    ['mute 40–60%', (r) => band(r) === '50–60%' || band(r) === '40–50%'],
    ['mute 25–50%', (r) => band(r) === '25–40%' || band(r) === '40–50%'],
  ];
  const focus = [
    ['Jun–Jul (old regime)', liveOf(win(rows, '2026-06-01', '2026-07-31'))],
    ['Aug 1–18', liveOf(win(rows, '2026-08-01', '2026-08-18'))],
    ['Steam (new volume)', liveOf(win(rows, STEAM_FROM, lastDate))],
    ['T (current)', liveOf(win(rows, T_FROM, lastDate))],
  ];
  p(mdTable(
    ['Rule', ...focus.map(([n]) => n)],
    rules.map(([name, fn]) => [
      name,
      ...focus.map(([, rs]) => {
        const hit = rs.filter(fn);
        const a = agg(hit);
        if (!a.n) return '—';
        const pct = `${((hit.length / rs.length) * 100).toFixed(0)}% of book`;
        return `${a.w}–${a.l} ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(0)}u · ${pct} · mute save ${a.pnl >= 0 ? '−' : '+'}${Math.abs(a.pnl).toFixed(0)}u`;
      }),
    ]),
  ));
  p('');
}

const text = `${out.join('\n')}\n`;
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/SHARE_VOLUME.md', text);
writeFileSync(join(ROOT, 'docs/SHARE_VOLUME_2026-09-17.md'), text);
console.log(text);
console.error(`wrote share volume · live ${liveOf(rows).length} through ${lastDate}`);
