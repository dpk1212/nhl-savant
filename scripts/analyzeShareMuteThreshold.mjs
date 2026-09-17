#!/usr/bin/env node
/**
 * Wallet $ share mute threshold — v12 from 2026-06-01.
 *
 *   node scripts/analyzeShareMuteThreshold.mjs
 *
 * Share = all walletDetails.invested on our side / (ours+against).
 * Live book first. Mute-below-X and band-mute CFs on shipped tickets.
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
function agg(rs, uKey = 'u', pKey = 'pnl') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rs) {
    if (r.won == null) continue;
    n++;
    stake += Number(r[uKey]) || 0;
    pnl += Number.isFinite(Number(r[pKey])) ? Number(r[pKey]) : 0;
    if (r.won === 1) w++;
    else l++;
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
  const wr = a.wr == null ? '—' : `${a.wr}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}–${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function shortFmt(a) {
  if (!a || !a.n) return '—';
  return `${a.w}–${a.l} ${a.pnl >= 0 ? '+' : ''}${Math.round(a.pnl)}u / ${a.roi >= 0 ? '+' : ''}${a.roi}%`;
}
function mdTable(headers, rows) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
}
function signed(n, d = 1) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)}`;
}
function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
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
      let $forP = 0; let $agP = 0;
      const seen = new Set();
      for (const w of wd) {
        if (!w) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        const onOurs = String(w.side) === String(sideKey);
        const inv = Number(w.invested) || 0;
        const f = flagsOf(short, sport);
        const proven = !!(f.confirmed || f.flat);
        if (onOurs) {
          $for += inv;
          if (proven) $forP += inv;
        } else {
          $ag += inv;
          if (proven) $agP += inv;
        }
      }
      const $tot = $for + $ag;
      const share = $tot > 0 ? $for / $tot : null;
      const $totP = $forP + $agP;
      const shareP = $totP > 0 ? $forP / $totP : null;

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
        shareP,
        $for,
        $ag,
        $forP,
        $agP,
        wdN: wd.length,
      });
    }
  }
}

const liveOf = (rs) => rs.filter((r) => r.live);
const hasShare = (rs) => rs.filter((r) => Number.isFinite(r.share));
const win = (rs, lo, hi) => rs.filter((r) => r.date >= lo && r.date <= hi);

const dates = [...new Set(rows.map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const liveDates = [...new Set(liveOf(rows).map((r) => r.date))].sort();
const last2Lo = liveDates.slice(-2)[0];
const last2Hi = liveDates[liveDates.length - 1];
const weekLo = addDays(lastDate, -6);

const windows = [
  ['June', win(rows, '2026-06-01', '2026-06-30')],
  ['July', win(rows, '2026-07-01', '2026-07-31')],
  ['Aug 1–18', win(rows, '2026-08-01', '2026-08-18')],
  ['Jun–Aug 18', win(rows, '2026-06-01', '2026-08-18')],
  ['Steam 8/19+', win(rows, STEAM_FROM, lastDate)],
  ['T 8/31+', win(rows, T_FROM, lastDate)],
  ['Last 7', win(rows, weekLo, lastDate)],
  ['Last 2', win(rows, last2Lo, last2Hi)],
  ['Full v12', win(rows, V12_FROM, lastDate)],
];

function shareFine(p) {
  if (!Number.isFinite(p)) return 'no $ split';
  const x = p * 100;
  if (x < 15) return '0–15%';
  if (x < 20) return '15–20%';
  if (x < 25) return '20–25%';
  if (x < 30) return '25–30%';
  if (x < 35) return '30–35%';
  if (x < 40) return '35–40%';
  if (x < 45) return '40–45%';
  if (x < 50) return '45–50%';
  if (x < 60) return '50–60%';
  if (x < 80) return '60–80%';
  return '80–100%';
}
const FINE_ORDER = [
  '0–15%', '15–20%', '20–25%', '25–30%', '30–35%', '35–40%',
  '40–45%', '45–50%', '50–60%', '60–80%', '80–100%', 'no $ split',
];

function muteSaved(rs) {
  const a = agg(rs);
  return { n: a.n, w: a.w, l: a.l, actual: a.pnl, delta: +(-a.pnl).toFixed(2), stake: a.stake, roi: a.roi, wr: a.wr };
}

const out = [];
const p = (s = '') => out.push(s);

p('# Wallet $ share mute threshold — v12 from June 1');
p('');
p(`_Pulled ${new Date().toISOString().slice(0, 10)}. Graded AGS-U **${V12_FROM}–${lastDate}**. Last 2 = ${last2Lo}–${last2Hi}._`);
p('_Share = all `walletDetails.invested` our side / (ours+against). Not proven-only. Matches the card “% of board.”_');
p('_Live book. CF: mute shipped tickets matching the rule → **positive delta = would have saved**. **No policy.**_');
p('');

{
  const v12 = win(rows, V12_FROM, lastDate);
  const live = liveOf(v12);
  const withS = live.filter((r) => Number.isFinite(r.share));
  const noWd = live.filter((r) => !r.wdN);
  p('## 0. Coverage');
  p('');
  p(mdTable(
    ['Window', 'Graded', 'Live', 'Live with $ share', 'Live no walletDetails'],
    windows.map(([n, rs]) => {
      const lv = liveOf(rs);
      return [
        n,
        String(rs.length),
        String(lv.length),
        String(lv.filter((r) => Number.isFinite(r.share)).length),
        String(lv.filter((r) => !r.wdN).length),
      ];
    }),
  ));
  p('');
  p(`Full v12 live ${live.length}, share stamp ${withS.length} (${live.length ? ((withS.length / live.length) * 100).toFixed(0) : 0}%), empty walletDetails ${noWd.length}.`);
  p('');
}

p('## 1. Headline live books');
p('');
p(mdTable(
  ['Window', 'Live (all)', 'Live with $ share'],
  windows.map(([n, rs]) => [n, fmt(agg(liveOf(rs))), fmt(agg(hasShare(liveOf(rs))))]),
));
p('');

p('## 2. Fine $ share bands (live)');
p('');
{
  const header = ['Band', ...windows.map(([n]) => n)];
  const body = FINE_ORDER.map((k) => [
    k,
    ...windows.map(([, rs]) => fmt(agg(liveOf(rs).filter((r) => shareFine(r.share) === k)))),
  ]);
  p(mdTable(header, body));
  p('');
}

p('## 3. Coarse bands (the September split, on the long book)');
p('');
{
  const tests = [
    ['<20%', (r) => Number.isFinite(r.share) && r.share < 0.20],
    ['<25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['20–25%', (r) => Number.isFinite(r.share) && r.share >= 0.20 && r.share < 0.25],
    ['**25–40%**', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['25–35%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.35],
    ['30–40%', (r) => Number.isFinite(r.share) && r.share >= 0.30 && r.share < 0.40],
    ['40–50%', (r) => Number.isFinite(r.share) && r.share >= 0.40 && r.share < 0.50],
    ['40–60%', (r) => Number.isFinite(r.share) && r.share >= 0.40 && r.share < 0.60],
    ['≥50%', (r) => Number.isFinite(r.share) && r.share >= 0.50],
    ['≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
    ['60–80%', (r) => Number.isFinite(r.share) && r.share >= 0.60 && r.share < 0.80],
    ['80–100%', (r) => Number.isFinite(r.share) && r.share >= 0.80],
  ];
  p(mdTable(
    ['Band', ...windows.map(([n]) => n)],
    tests.map(([name, fn]) => [name, ...windows.map(([, rs]) => shortFmt(agg(liveOf(rs).filter(fn))))]),
  ));
  p('');
}

p('## 4. Mute-below-X (floor rule) — CF on live tickets');
p('');
p('Mute every shipped ticket with share **< X**. Remaining book is everything else that shipped (including no-share).');
p('');
{
  const cuts = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.60];
  const focus = [
    ['Jun–Aug 18', win(rows, '2026-06-01', '2026-08-18')],
    ['Steam 8/19+', win(rows, STEAM_FROM, lastDate)],
    ['T 8/31+', win(rows, T_FROM, lastDate)],
    ['Full v12', win(rows, V12_FROM, lastDate)],
  ];
  const header = ['Mute share < X', ...focus.map(([n]) => n)];
  const body = cuts.map((x) => {
    const label = `<${Math.round(x * 100)}%`;
    return [
      label,
      ...focus.map(([, rs]) => {
        const live = liveOf(rs);
        const hit = live.filter((r) => Number.isFinite(r.share) && r.share < x);
        const rest = live.filter((r) => !(Number.isFinite(r.share) && r.share < x));
        const m = muteSaved(hit);
        const keep = agg(rest);
        if (!m.n) return '—';
        return `cut ${m.w}–${m.l} ${signed(m.actual, 0)}u · save ${signed(m.delta, 0)} · keep ${signed(keep.pnl, 0)}u`;
      }),
    ];
  });
  p(mdTable(header, body));
  p('');
}

p('## 5. Mute-a-band (the September hypothesis) — CF on live tickets');
p('');
p('Mute share in **[lo, hi)**. Leaves `<lo` and `≥hi` shipping. This is how 25–40% was framed.');
p('');
{
  const bands = [
    [0.00, 0.20, '0–20%'],
    [0.20, 0.25, '20–25%'],
    [0.20, 0.30, '20–30%'],
    [0.20, 0.40, '20–40%'],
    [0.25, 0.35, '25–35%'],
    [0.25, 0.40, '25–40%'],
    [0.25, 0.45, '25–45%'],
    [0.25, 0.50, '25–50%'],
    [0.30, 0.40, '30–40%'],
    [0.30, 0.45, '30–45%'],
    [0.30, 0.50, '30–50%'],
    [0.35, 0.45, '35–45%'],
    [0.40, 0.50, '40–50%'],
    [0.40, 0.60, '40–60%'],
  ];
  const focus = [
    ['June', win(rows, '2026-06-01', '2026-06-30')],
    ['July', win(rows, '2026-07-01', '2026-07-31')],
    ['Aug 1–18', win(rows, '2026-08-01', '2026-08-18')],
    ['Jun–Aug 18', win(rows, '2026-06-01', '2026-08-18')],
    ['Steam', win(rows, STEAM_FROM, lastDate)],
    ['T', win(rows, T_FROM, lastDate)],
    ['v12', win(rows, V12_FROM, lastDate)],
  ];
  p(mdTable(
    ['Mute band', ...focus.map(([n]) => n)],
    bands.map(([lo, hi, name]) => [
      name,
      ...focus.map(([, rs]) => {
        const hit = liveOf(rs).filter((r) => Number.isFinite(r.share) && r.share >= lo && r.share < hi);
        const m = muteSaved(hit);
        if (!m.n) return '—';
        return `${m.w}–${m.l} save ${signed(m.delta, 0)}`;
      }),
    ]),
  ));
  p('');
}

p('## 6. Keep the dead-pile, mute the contested band');
p('');
p('Mute `[lo, hi)` and **keep `<lo`**. September said `<25%` prints. Does June–July agree?');
p('');
{
  const rules = [
    ['mute 20–40, keep <20', 0.20, 0.40],
    ['mute 25–40, keep <25', 0.25, 0.40],
    ['mute 25–45, keep <25', 0.25, 0.45],
    ['mute 25–50, keep <25', 0.25, 0.50],
    ['mute 20–50, keep <20', 0.20, 0.50],
    ['mute 30–40, keep <30', 0.30, 0.40],
    ['mute 30–45, keep <30', 0.30, 0.45],
  ];
  const focus = [
    ['Jun–Aug 18', win(rows, '2026-06-01', '2026-08-18')],
    ['Steam', win(rows, STEAM_FROM, lastDate)],
    ['T', win(rows, T_FROM, lastDate)],
    ['v12', win(rows, V12_FROM, lastDate)],
  ];
  p(mdTable(
    ['Rule', ...focus.map(([n]) => n)],
    rules.map(([name, lo, hi]) => [
      name,
      ...focus.map(([, rs]) => {
        const live = liveOf(rs);
        const hit = live.filter((r) => Number.isFinite(r.share) && r.share >= lo && r.share < hi);
        const keepLo = live.filter((r) => Number.isFinite(r.share) && r.share < lo);
        const m = muteSaved(hit);
        const k = agg(keepLo);
        if (!m.n) return '—';
        return `cut ${m.w}–${m.l} save ${signed(m.delta, 0)} · kept-low ${k.n ? shortFmt(k) : '—'}`;
      }),
    ]),
  ));
  p('');
}

p('## 7. Month-by-month 25–40% (is it always a dog?)');
p('');
{
  const months = [];
  for (const d of dates) {
    const m = d.slice(0, 7);
    if (!months.includes(m)) months.push(m);
  }
  const tests = [
    ['<25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['40–60%', (r) => Number.isFinite(r.share) && r.share >= 0.40 && r.share < 0.60],
    ['≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
  ];
  p(mdTable(
    ['Month', 'Live', ...tests.map(([n]) => n)],
    months.map((m) => {
      const rs = liveOf(rows.filter((r) => r.date.startsWith(m)));
      return [m, fmt(agg(rs)), ...tests.map(([, fn]) => shortFmt(agg(rs.filter(fn))))];
    }),
  ));
  p('');
}

p('## 8. 25–40% × sport / market (v12 live)');
p('');
{
  const cell = liveOf(win(rows, V12_FROM, lastDate))
    .filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const pre = liveOf(win(rows, V12_FROM, '2026-08-18'))
    .filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const steam = liveOf(win(rows, STEAM_FROM, lastDate))
    .filter((r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40);
  const tests = [
    ['all 25–40%', () => true],
    ['MLB', (r) => r.sport === 'MLB'],
    ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
    ['MLB not TOTAL', (r) => r.sport === 'MLB' && r.mkt !== 'TOTAL'],
    ['NBA', (r) => r.sport === 'NBA'],
    ['NHL', (r) => r.sport === 'NHL'],
    ['WNBA', (r) => r.sport === 'WNBA'],
    ['CFB', (r) => r.sport === 'CFB'],
    ['NFL', (r) => r.sport === 'NFL'],
    ['SOC', (r) => r.sport === 'SOC' || r.sport === 'SOCCER'],
    ['UFC', (r) => r.sport === 'UFC'],
    ['TOTAL', (r) => r.mkt === 'TOTAL'],
    ['SPREAD', (r) => r.mkt === 'SPREAD'],
    ['ML', (r) => r.mkt === 'ML'],
    ['≤1u', (r) => r.u <= 1.25],
    ['2–3u', (r) => r.u > 1.25 && r.u < 3.5],
    ['4u+', (r) => r.u >= 3.5],
  ];
  p(mdTable(
    ['Inside 25–40%', 'Jun–Aug 18', 'Steam', 'Full v12'],
    tests.map(([name, fn]) => [
      name,
      fmt(agg(pre.filter(fn))),
      fmt(agg(steam.filter(fn))),
      fmt(agg(cell.filter(fn))),
    ]),
  ));
  p('');
}

p('## 9. Proven-only $ share vs all-wallet $ share (v12 live)');
p('');
p('Card “% of board” is all wallets. Proven-only is a sensitivity — would a confirmed-only split pick a different mute line?');
p('');
{
  const live = liveOf(win(rows, V12_FROM, lastDate));
  const tests = [
    ['all <25%', (r) => Number.isFinite(r.share) && r.share < 0.25],
    ['all 25–40%', (r) => Number.isFinite(r.share) && r.share >= 0.25 && r.share < 0.40],
    ['all ≥60%', (r) => Number.isFinite(r.share) && r.share >= 0.60],
    ['proven <25%', (r) => Number.isFinite(r.shareP) && r.shareP < 0.25],
    ['proven 25–40%', (r) => Number.isFinite(r.shareP) && r.shareP >= 0.25 && r.shareP < 0.40],
    ['proven ≥60%', (r) => Number.isFinite(r.shareP) && r.shareP >= 0.60],
  ];
  p(mdTable(
    ['Split', 'Jun–Aug 18', 'Steam', 'v12'],
    tests.map(([name, fn]) => [
      name,
      shortFmt(agg(liveOf(win(rows, V12_FROM, '2026-08-18')).filter(fn))),
      shortFmt(agg(liveOf(win(rows, STEAM_FROM, lastDate)).filter(fn))),
      shortFmt(agg(live.filter(fn))),
    ]),
  ));
  p('');
}

p('## 10. Integer cutoff scan — mute share < X, v12 save');
p('');
p('Looking for the floor that saves on **Jun–Aug 18 AND steam AND T**, not just last week.');
p('');
{
  const focus = [
    ['Jun–Aug 18', win(rows, '2026-06-01', '2026-08-18')],
    ['Steam', win(rows, STEAM_FROM, lastDate)],
    ['T', win(rows, T_FROM, lastDate)],
    ['v12', win(rows, V12_FROM, lastDate)],
  ];
  const rowsOut = [];
  for (let pct = 15; pct <= 55; pct += 5) {
    const x = pct / 100;
    rowsOut.push([
      `<${pct}%`,
      ...focus.map(([, rs]) => {
        const hit = liveOf(rs).filter((r) => Number.isFinite(r.share) && r.share < x);
        const m = muteSaved(hit);
        if (!m.n) return '—';
        return `${m.n} ${m.w}–${m.l} save ${signed(m.delta, 0)} (${m.roi >= 0 ? '+' : ''}${m.roi}%)`;
      }),
    ]);
  }
  p(mdTable(['Mute < X', ...focus.map(([n]) => n)], rowsOut));
  p('');
}

p('## 11. Best band scan — mute [lo,hi), require Jun–Aug 18 not a printer');
p('');
{
  const pre = liveOf(win(rows, V12_FROM, '2026-08-18'));
  const steam = liveOf(win(rows, STEAM_FROM, lastDate));
  const tEra = liveOf(win(rows, T_FROM, lastDate));
  const v12 = liveOf(win(rows, V12_FROM, lastDate));
  const candidates = [];
  const pts = [0, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const lo = pts[i];
      const hi = pts[j];
      if (hi - lo < 0.10) continue;
      if (hi - lo > 0.40) continue;
      const fn = (r) => Number.isFinite(r.share) && r.share >= lo && r.share < hi;
      const mPre = muteSaved(pre.filter(fn));
      const mSteam = muteSaved(steam.filter(fn));
      const mT = muteSaved(tEra.filter(fn));
      const mV = muteSaved(v12.filter(fn));
      if (!mV.n || mV.n < 20) continue;
      candidates.push({
        lo, hi,
        name: `${Math.round(lo * 100)}–${Math.round(hi * 100)}%`,
        pre: mPre, steam: mSteam, t: mT, v12: mV,
        score: (mPre.delta || 0) + (mSteam.delta || 0) * 0.5 + (mV.delta || 0),
      });
    }
  }
  candidates.sort((a, b) => b.v12.delta - a.v12.delta);
  p('Ranked by full-v12 save. A good mute band should also save (or at least not cost) Jun–Aug 18.');
  p('');
  p(mdTable(
    ['Band', 'Jun–Aug 18', 'Steam', 'T', 'v12', 'v12 n'],
    candidates.slice(0, 18).map((c) => [
      c.name,
      c.pre.n ? `${c.pre.w}–${c.pre.l} save ${signed(c.pre.delta, 0)}` : '—',
      c.steam.n ? `${c.steam.w}–${c.steam.l} save ${signed(c.steam.delta, 0)}` : '—',
      c.t.n ? `${c.t.w}–${c.t.l} save ${signed(c.t.delta, 0)}` : '—',
      c.v12.n ? `${c.v12.w}–${c.v12.l} save ${signed(c.v12.delta, 0)}` : '—',
      String(c.v12.n),
    ]),
  ));
  p('');
  const stable = candidates
    .filter((c) => (c.pre.delta || 0) >= 0 && (c.steam.delta || 0) >= 5 && (c.v12.delta || 0) >= 15)
    .sort((a, b) => b.v12.delta - a.v12.delta);
  p('Stable (Jun–Aug 18 save ≥0 **and** steam save ≥+5 **and** v12 save ≥+15):');
  p('');
  if (!stable.length) p('_None._');
  else {
    p(mdTable(
      ['Band', 'Jun–Aug 18', 'Steam', 'T', 'v12'],
      stable.slice(0, 12).map((c) => [
        c.name,
        `${c.pre.w}–${c.pre.l} save ${signed(c.pre.delta, 0)}`,
        `${c.steam.w}–${c.steam.l} save ${signed(c.steam.delta, 0)}`,
        c.t.n ? `${c.t.w}–${c.t.l} save ${signed(c.t.delta, 0)}` : '—',
        `${c.v12.w}–${c.v12.l} save ${signed(c.v12.delta, 0)}`,
      ]),
    ));
  }
  p('');
}

const text = `${out.join('\n')}\n`;
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/SHARE_MUTE_THRESHOLD.md', text);
writeFileSync(join(ROOT, 'docs/SHARE_MUTE_THRESHOLD_2026-09-17.md'), text);
writeFileSync('/opt/cursor/artifacts/share_mute_threshold_rows.json', JSON.stringify(rows.map((r) => ({
  date: r.date, sport: r.sport, mkt: r.mkt, team: r.team, live: r.live, won: r.won,
  u: r.u, pnl: r.pnl, share: r.share, shareP: r.shareP, wdN: r.wdN,
})), null, 2));
console.log(text);
console.error(`wrote share mute threshold · graded ${rows.length} live ${liveOf(rows).length} through ${lastDate}`);
