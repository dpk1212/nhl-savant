#!/usr/bin/env node
/**
 * Proven $ share W/L ladder + refined % metrics.
 *
 *   node scripts/analyzeProvenShareLadder.mjs
 *   node scripts/analyzeProvenShareLadder.mjs --from-cache
 *
 * Default: refetch v12 tickets with all-$ / proven-$ / confirmed-$ / A/B-$ / count.
 * --from-cache: proven-$ ladder only from share_mute_threshold_rows.json.
 * Live book. No policy.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sourceFlagsFromSportRec, sportRecFromProfiles } from '../src/lib/steamTailPolicy.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FROM_CACHE = process.argv.includes('--from-cache');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const V12_FROM = '2026-06-01';
const STEAM_FROM = '2026-08-19';
const T_FROM = '2026-08-31';
const AUG24 = '2026-08-24';

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
    if (!r.live || r.won == null) continue;
    n++;
    stake += Number(r.u) || 0;
    pnl += Number.isFinite(Number(r.pnl)) ? Number(r.pnl) : 0;
    if (r.won) w++; else l++;
  }
  const ci = wilson(w, n);
  return {
    n, w, l,
    stake: +stake.toFixed(1),
    pnl: +pnl.toFixed(1),
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
  return `${a.n} · ${a.w}–${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u · ${roi}`;
}
function short(a) {
  if (!a || !a.n) return '—';
  return `${a.w}–${a.l} ${a.pnl >= 0 ? '+' : ''}${Math.round(a.pnl)}u / ${a.roi >= 0 ? '+' : ''}${a.roi}%`;
}
function mdTable(headers, body) {
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${body.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
}
function signed(n, d = 0) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `${x >= 0 ? '+' : ''}${x.toFixed(d)}`;
}
function med(xs) {
  const a = xs.filter(Number.isFinite).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function nfix(n, d = 0) {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(d);
}
function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function shareFine(p) {
  if (!Number.isFinite(p)) return 'no $';
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
  '40–45%', '45–50%', '50–60%', '60–80%', '80–100%', 'no $',
];

async function fetchRows() {
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
        let $forC = 0; let $agC = 0;
        let $forAB = 0; let $agAB = 0;
        let nFor = 0; let nAg = 0;
        let nForP = 0; let nAgP = 0;
        let nForC = 0; let nAgC = 0;
        let nForAB = 0; let nAgAB = 0;
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
          const conf = !!f.confirmed;
          const ab = !!(f.a || f.b);
          if (onOurs) {
            $for += inv; nFor++;
            if (proven) { $forP += inv; nForP++; }
            if (conf) { $forC += inv; nForC++; }
            if (ab) { $forAB += inv; nForAB++; }
          } else {
            $ag += inv; nAg++;
            if (proven) { $agP += inv; nAgP++; }
            if (conf) { $agC += inv; nAgC++; }
            if (ab) { $agAB += inv; nAgAB++; }
          }
        }
        const ratio = (a, b) => (a + b > 0 ? a / (a + b) : null);
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
          share: ratio($for, $ag),
          shareP: ratio($forP, $agP),
          shareC: ratio($forC, $agC),
          shareAB: ratio($forAB, $agAB),
          shareN: ratio(nFor, nAg),
          shareNP: ratio(nForP, nAgP),
          shareNC: ratio(nForC, nAgC),
          shareNAB: ratio(nForAB, nAgAB),
          $for, $ag, $forP, $agP, $forC, $agC, $forAB, $agAB,
          nFor, nAg, nForP, nAgP, nForC, nAgC, nForAB, nAgAB,
          wdN: seen.size,
        });
      }
    }
  }
  return rows;
}

function cacheRows() {
  const path = '/opt/cursor/artifacts/share_mute_threshold_rows.json';
  if (!existsSync(path)) throw new Error('no cache');
  return JSON.parse(readFileSync(path, 'utf8'));
}

const rows = FROM_CACHE ? cacheRows() : await fetchRows();
const hasRefined = rows.some((r) => 'shareC' in r);

const liveOf = (rs) => rs.filter((r) => r.live);
const win = (lo, hi) => liveOf(rows.filter((r) => r.date >= lo && r.date <= hi));

const dates = [...new Set(liveOf(rows).map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const last2Lo = dates.slice(-2)[0];
const last2Hi = dates[dates.length - 1];
const weekLo = addDays(lastDate, -6);

const windows = [
  ['Last 2', last2Lo, last2Hi],
  ['Last 7', weekLo, lastDate],
  ['T', T_FROM, lastDate],
  ['Steam', STEAM_FROM, lastDate],
  ['Aug 24+', AUG24, lastDate],
  ['Jun–Aug 18', V12_FROM, '2026-08-18'],
  ['v12', V12_FROM, lastDate],
];
const focus = [
  ['Last 7', weekLo, lastDate],
  ['T', T_FROM, lastDate],
  ['Steam', STEAM_FROM, lastDate],
  ['Aug 24+', AUG24, lastDate],
  ['v12', V12_FROM, lastDate],
];

function muteSaved(rs) {
  const a = agg(rs);
  return { ...a, actual: a.pnl, delta: +(-a.pnl).toFixed(1) };
}
function cutLine(hit, keep) {
  const m = muteSaved(hit);
  if (!m.n) return '—';
  const k = agg(keep);
  return `cut ${m.w}–${m.l} ${signed(m.actual)}u · save ${signed(m.delta)} · keep ${signed(k.pnl)}u · n=${m.n}`;
}

const METRICS = [
  ['all $', 'share', 'card % of board'],
  ['proven $', 'shareP', 'confirmed+flat $'],
];
if (hasRefined) {
  METRICS.push(
    ['confirmed $', 'shareC', 'CONFIRMED only, drop FLAT'],
    ['A/B $', 'shareAB', 'A or B $'],
    ['all count', 'shareN', 'wallet count, ignore $ size'],
    ['proven count', 'shareNP', 'confirmed+flat wallet count'],
  );
}

const out = [];
const p = (s = '') => out.push(s);

p('# Proven $ share ladder — same W/L style as all-$');
p('');
p(`_Pulled ${new Date().toISOString().slice(0, 10)}. Graded AGS-U **${V12_FROM}–${lastDate}**. Last 2 = ${last2Lo}–${last2Hi}._`);
p('_all $ = card “% of board.” proven $ = confirmed+flat invested only. confirmed $ = CONFIRMED whitelist, drop FLAT. A/B $ = source A or B invested. count = unique wallets, ignore $ size._');
p('_Live book. CF: mute shipped tickets matching the rule → **positive save = would have saved**. **No policy.**_');
p('');

p('## Direct answer');
p('');
p('_Numbers below. Human summary written after the run._');
p('');

p('## 0. Coverage');
p('');
{
  const body = windows.map(([n, lo, hi]) => {
    const rs = win(lo, hi);
    return [
      n,
      String(rs.length),
      String(rs.filter((r) => Number.isFinite(r.share)).length),
      String(rs.filter((r) => Number.isFinite(r.shareP)).length),
      hasRefined ? String(rs.filter((r) => Number.isFinite(r.shareC)).length) : '—',
      hasRefined ? String(rs.filter((r) => Number.isFinite(r.shareAB)).length) : '—',
      hasRefined ? String(rs.filter((r) => Number.isFinite(r.shareN)).length) : '—',
      hasRefined ? String(rs.filter((r) => Number.isFinite(r.shareNP)).length) : '—',
    ];
  });
  p(mdTable(
    ['Window', 'Live', 'all $', 'proven $', 'confirmed $', 'A/B $', 'all count', 'proven count'],
    body,
  ));
  p('');
}

p('## 1. Fine proven-$ bands (same cuts as all-$)');
p('');
p('This is the directionality table. Read left → right as proven % of the *proven* board rises.');
p('');
{
  p(mdTable(
    ['Proven-$ band', ...windows.map(([n]) => n)],
    FINE_ORDER.map((k) => [
      k,
      ...windows.map(([, lo, hi]) => fmt(agg(win(lo, hi).filter((r) => shareFine(r.shareP) === k)))),
    ]),
  ));
  p('');
}

p('## 2. Same fine bands, all-$ (control)');
p('');
{
  p(mdTable(
    ['All-$ band', ...windows.map(([n]) => n)],
    FINE_ORDER.map((k) => [
      k,
      ...windows.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => shareFine(r.share) === k)))),
    ]),
  ));
  p('');
}

p('## 3. Coarse proven-$ (mute-language cuts)');
p('');
{
  const tests = [
    ['prov <20%', (r) => Number.isFinite(r.shareP) && r.shareP < 0.20],
    ['prov <25%', (r) => Number.isFinite(r.shareP) && r.shareP < 0.25],
    ['prov 20–25%', (r) => r.shareP >= 0.20 && r.shareP < 0.25],
    ['**prov 25–40%**', (r) => r.shareP >= 0.25 && r.shareP < 0.40],
    ['prov 25–45%', (r) => r.shareP >= 0.25 && r.shareP < 0.45],
    ['prov 25–50%', (r) => r.shareP >= 0.25 && r.shareP < 0.50],
    ['prov 40–50%', (r) => r.shareP >= 0.40 && r.shareP < 0.50],
    ['prov 45–50%', (r) => r.shareP >= 0.45 && r.shareP < 0.50],
    ['prov 50–60%', (r) => r.shareP >= 0.50 && r.shareP < 0.60],
    ['prov ≥50%', (r) => r.shareP >= 0.50],
    ['prov ≥60%', (r) => r.shareP >= 0.60],
    ['prov 60–80%', (r) => r.shareP >= 0.60 && r.shareP < 0.80],
    ['prov 80–100%', (r) => r.shareP >= 0.80],
    ['no proven $', (r) => !Number.isFinite(r.shareP)],
  ];
  p(mdTable(
    ['Band', ...windows.map(([n]) => n)],
    tests.map(([name, fn]) => [name, ...windows.map(([, lo, hi]) => short(agg(win(lo, hi).filter(fn))))]),
  ));
  p('');
}

p('## 4. Mute-below-X on proven $ (floor rule)');
p('');
p('Mute every shipped ticket with **proven $ share < X**. Compare to the same floor on all-$.');
p('');
{
  const cuts = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.60];
  const eras = [
    ['T', T_FROM, lastDate],
    ['Steam', STEAM_FROM, lastDate],
    ['Aug 24+', AUG24, lastDate],
    ['v12', V12_FROM, lastDate],
  ];
  p('**Proven $ < X**');
  p('');
  p(mdTable(
    ['Mute proven < X', ...eras.map(([n]) => n)],
    cuts.map((x) => [
      `<${Math.round(x * 100)}%`,
      ...eras.map(([, lo, hi]) => {
        const rs = win(lo, hi);
        const hit = rs.filter((r) => Number.isFinite(r.shareP) && r.shareP < x);
        const rest = rs.filter((r) => !(Number.isFinite(r.shareP) && r.shareP < x));
        return cutLine(hit, rest);
      }),
    ]),
  ));
  p('');
  p('**All $ < X** (control)');
  p('');
  p(mdTable(
    ['Mute all-$ < X', ...eras.map(([n]) => n)],
    cuts.map((x) => [
      `<${Math.round(x * 100)}%`,
      ...eras.map(([, lo, hi]) => {
        const rs = win(lo, hi);
        const hit = rs.filter((r) => Number.isFinite(r.share) && r.share < x);
        const rest = rs.filter((r) => !(Number.isFinite(r.share) && r.share < x));
        return cutLine(hit, rest);
      }),
    ]),
  ));
  p('');
}

p('## 5. Mute-a-band on proven $');
p('');
{
  const bands = [
    [0.00, 0.20, '0–20%'],
    [0.20, 0.25, '20–25%'],
    [0.20, 0.40, '20–40%'],
    [0.25, 0.35, '25–35%'],
    [0.25, 0.40, '25–40%'],
    [0.25, 0.45, '25–45%'],
    [0.25, 0.50, '25–50%'],
    [0.40, 0.50, '40–50%'],
    [0.40, 0.60, '40–60%'],
    [0.45, 0.60, '45–60%'],
    [0.50, 0.60, '50–60%'],
  ];
  p(mdTable(
    ['Mute proven band', ...focus.map(([n]) => n)],
    bands.map(([loB, hiB, name]) => [
      name,
      ...focus.map(([, lo, hi]) => {
        const hit = win(lo, hi).filter((r) => Number.isFinite(r.shareP) && r.shareP >= loB && r.shareP < hiB);
        const m = muteSaved(hit);
        if (!m.n) return '—';
        return `${m.w}–${m.l} ${signed(m.actual)}u · save ${signed(m.delta)} · n=${m.n}`;
      }),
    ]),
  ));
  p('');
}

p('## 6. Directionality: as proven % rises, does the book print?');
p('');
p('Cumulative **keep ≥ X** (everything at or above the cut). If the metric is directional, keep-≥50 should beat keep-≥40 should beat the full book.');
p('');
{
  const cuts = [0, 0.25, 0.40, 0.45, 0.50, 0.60, 0.80];
  p(mdTable(
    ['Keep proven ≥ X', ...focus.map(([n]) => n)],
    cuts.map((x) => [
      x === 0 ? 'all with proven $' : `≥${Math.round(x * 100)}%`,
      ...focus.map(([, lo, hi]) => {
        const rs = win(lo, hi).filter((r) => Number.isFinite(r.shareP) && r.shareP >= x);
        const a = agg(rs);
        if (!a.n) return '—';
        return `${short(a)} · ${rs.length} tix`;
      }),
    ]),
  ));
  p('');
  p('Same cumulative keep, **all $**:');
  p('');
  p(mdTable(
    ['Keep all-$ ≥ X', ...focus.map(([n]) => n)],
    cuts.map((x) => [
      x === 0 ? 'all with $' : `≥${Math.round(x * 100)}%`,
      ...focus.map(([, lo, hi]) => {
        const rs = win(lo, hi).filter((r) => Number.isFinite(r.share) && r.share >= x);
        const a = agg(rs);
        if (!a.n) return '—';
        return `${short(a)} · ${rs.length} tix`;
      }),
    ]),
  ));
  p('');
}

p('## 7. Mute ≤45% all-$ except proven ≥ X  ← the lean');
p('');
p('Mute `all $ < 45%` unless `proven $ ≥ X`. The exception is what you keep shipping inside the dead pile.');
p('');
{
  const xs = [0.40, 0.50, 0.60, 0.80];
  const opts = [
    ['Mute all ≤45% (no exception)', (r) => r.share < 0.45],
    ...xs.map((x) => [
      `Mute ≤45% except proven ≥${Math.round(x * 100)}%`,
      (r) => r.share < 0.45 && !(Number.isFinite(r.shareP) && r.shareP >= x),
    ]),
    ['Mute ≤45% except 15–25% all-$', (r) => r.share < 0.45 && !(r.share >= 0.15 && r.share < 0.25)],
    ['Mute 25–45% only (keep <25%)', (r) => r.share >= 0.25 && r.share < 0.45],
    ['Mute 25–45% always + 0–15% if proven<50%', (r) => (r.share >= 0.25 && r.share < 0.45) || (r.share < 0.15 && Number.isFinite(r.shareP) && r.shareP < 0.50)],
    ['Mute 25–45% always; in <25% mute proven<50%', (r) => (r.share >= 0.25 && r.share < 0.45) || (r.share < 0.25 && Number.isFinite(r.shareP) && r.shareP < 0.50)],
  ];
  p(mdTable(
    ['If we mute…', ...focus.map(([n]) => n)],
    opts.map(([name, fn]) => [
      name,
      ...focus.map(([, lo, hi]) => {
        const rs = win(lo, hi).filter((r) => Number.isFinite(r.share));
        const hit = rs.filter(fn);
        const rest = rs.filter((r) => !fn(r));
        return cutLine(hit, rest);
      }),
    ]),
  ));
  p('');
}

p('## 8. What the ≥50% exception actually keeps (inside ≤45% all-$)');
p('');
p('Split the keep-set of “mute ≤45 except proven ≥50” into junk-against (`all <25%`) vs fake-save (`all 25–45%`).');
p('');
{
  const cells = [
    ['KEEP: all <25% AND proven ≥50% (junk-against)', (r) => r.share < 0.25 && r.shareP >= 0.50],
    ['KEEP: all 15–25% AND proven ≥50%', (r) => r.share >= 0.15 && r.share < 0.25 && r.shareP >= 0.50],
    ['KEEP: all 0–15% AND proven ≥50%', (r) => r.share < 0.15 && r.shareP >= 0.50],
    ['KEEP: all 25–45% AND proven ≥50% (fake save)', (r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.50],
    ['KEEP: all 25–45% AND proven ≥60%', (r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.60],
    ['MUTE: all <45% AND proven <50%', (r) => r.share < 0.45 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['MUTE: all <45% AND no proven $', (r) => r.share < 0.45 && !Number.isFinite(r.shareP)],
    ['all <45% AND proven ≥50% (whole exception)', (r) => r.share < 0.45 && r.shareP >= 0.50],
  ];
  p(mdTable(
    ['Cell', ...focus.map(([n]) => n)],
    cells.map(([name, fn]) => [
      name,
      ...focus.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => Number.isFinite(r.share) && fn(r))))),
    ]),
  ));
  p('');
}

p('## 9. Tickets the ≥50% exception keeps inside 25–45% (the fake save)');
p('');
{
  const eras = [
    ['T', T_FROM, lastDate],
    ['Aug 24+', AUG24, lastDate],
  ];
  for (const [name, lo, hi] of eras) {
    const hit = win(lo, hi)
      .filter((r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.50)
      .sort((a, b) => a.date.localeCompare(b.date) || String(a.team).localeCompare(String(b.team)));
    p(`**${name}** n=${hit.length}`);
    p('');
    if (!hit.length) {
      p('_none_');
      p('');
      continue;
    }
    p(mdTable(
      ['Date', 'Sport', 'Mkt', 'Side', 'u', 'W/L', 'pnl', 'all $', 'proven $'],
      hit.map((r) => [
        r.date,
        r.sport,
        r.mkt,
        String(r.team).slice(0, 28),
        String(r.u),
        r.won ? 'W' : 'L',
        signed(r.pnl, 1),
        `${(r.share * 100).toFixed(0)}%`,
        `${(r.shareP * 100).toFixed(0)}%`,
      ]),
    ));
    p('');
    p(`That cell: ${short(agg(hit))}`);
    p('');
  }
}

p('## 10. Tickets the ≥50% exception keeps under 25% (junk-against, the reason to except)');
p('');
{
  const hit = win(AUG24, lastDate)
    .filter((r) => r.share < 0.25 && r.shareP >= 0.50)
    .sort((a, b) => a.date.localeCompare(b.date));
  p(`**Aug 24+** n=${hit.length} · ${short(agg(hit))}`);
  p('');
  if (hit.length) {
    p(mdTable(
      ['Date', 'Sport', 'Mkt', 'Side', 'u', 'W/L', 'pnl', 'all $', 'proven $'],
      hit.map((r) => [
        r.date,
        r.sport,
        r.mkt,
        String(r.team).slice(0, 28),
        String(r.u),
        r.won ? 'W' : 'L',
        signed(r.pnl, 1),
        `${(r.share * 100).toFixed(0)}%`,
        `${(r.shareP * 100).toFixed(0)}%`,
      ]),
    ));
    p('');
  }
}

if (hasRefined) {
  p('## 11. Refined % metrics — same fine ladder');
  p('');
  p('If another % is cleaner than proven $, it shows a monotonic climb (low dogs, high printers) without a 50–60% hole.');
  p('');
  const eras = [
    ['T', T_FROM, lastDate],
    ['Aug 24+', AUG24, lastDate],
    ['v12', V12_FROM, lastDate],
  ];
  for (const [label, key] of METRICS) {
    p(`### ${label} (\`${key}\`)`);
    p('');
    p(mdTable(
      ['Band', ...eras.map(([n]) => n)],
      FINE_ORDER.map((k) => [
        k,
        ...eras.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => shareFine(r[key]) === k)))),
      ]),
    ));
    p('');
  }

  p('## 12. Which metric is actually directional?');
  p('');
  p('ROI of each fine band, Aug 24+ (current book). Blank = n<3.');
  p('');
  {
    const header = ['Band', ...METRICS.map(([n]) => n)];
    const body = FINE_ORDER.filter((k) => k !== 'no $').map((k) => [
      k,
      ...METRICS.map(([, key]) => {
        const a = agg(win(AUG24, lastDate).filter((r) => shareFine(r[key]) === k));
        if (!a.n || a.n < 3) return a.n ? `${short(a)} n=${a.n}` : '—';
        return `${a.roi >= 0 ? '+' : ''}${a.roi}% · ${a.w}–${a.l} n=${a.n}`;
      }),
    ]);
    p(mdTable(header, body));
    p('');
  }

  p('## 13. Mute ≤45% on each metric (no exception) vs except ≥50% on that same metric');
  p('');
  {
    const eras = [
      ['T', T_FROM, lastDate],
      ['Aug 24+', AUG24, lastDate],
      ['Steam', STEAM_FROM, lastDate],
    ];
    const body = [];
    for (const [label, key] of METRICS) {
      body.push([
        `Mute ${label} ≤45%`,
        ...eras.map(([, lo, hi]) => {
          const rs = win(lo, hi).filter((r) => Number.isFinite(r[key]));
          const hit = rs.filter((r) => r[key] < 0.45);
          const rest = rs.filter((r) => r[key] >= 0.45);
          return cutLine(hit, rest);
        }),
      ]);
      body.push([
        `Mute ${label} ≤45% except that metric ≥50%`,
        ...eras.map(([, lo, hi]) => {
          const rs = win(lo, hi).filter((r) => Number.isFinite(r[key]));
          const hit = rs.filter((r) => r[key] < 0.45 && !(r[key] >= 0.50));
          const rest = rs.filter((r) => !(r[key] < 0.45 && !(r[key] >= 0.50)));
          return cutLine(hit, rest);
        }),
      ]);
    }
    p(mdTable(['Rule', ...eras.map(([n]) => n)], body));
    p('');
  }

  p('## 14. Cross: all-$ ≤45 mute × each refined metric ≥50 exception');
  p('');
  p('Dale’s lean is mixed axes: mute on **all $**, except on **some other %**. Swap the exception metric.');
  p('');
  {
    const excepts = METRICS.filter(([, key]) => key !== 'share');
    const eras = [
      ['T', T_FROM, lastDate],
      ['Aug 24+', AUG24, lastDate],
      ['Steam', STEAM_FROM, lastDate],
    ];
    p(mdTable(
      ['Mute all-$ ≤45 except…', ...eras.map(([n]) => n)],
      excepts.map(([label, key]) => [
        `${label} ≥50%`,
        ...eras.map(([, lo, hi]) => {
          const rs = win(lo, hi).filter((r) => Number.isFinite(r.share));
          const hit = rs.filter((r) => r.share < 0.45 && !(Number.isFinite(r[key]) && r[key] >= 0.50));
          const rest = rs.filter((r) => !(r.share < 0.45 && !(Number.isFinite(r[key]) && r[key] >= 0.50)));
          return cutLine(hit, rest);
        }),
      ]),
    ));
    p('');
    p('What each exception keeps inside 25–45% all-$ (Aug 24+):');
    p('');
    p(mdTable(
      ['Exception metric ≥50% inside 25–45% all-$', 'Aug 24+', 'T', 'Steam'],
      excepts.map(([label, key]) => [
        label,
        ...[['2026-08-24', lastDate], [T_FROM, lastDate], [STEAM_FROM, lastDate]].map(([lo, hi]) =>
          short(agg(win(lo, hi).filter((r) => r.share >= 0.25 && r.share < 0.45 && Number.isFinite(r[key]) && r[key] >= 0.50)))),
      ]),
    ));
    p('');
    p('What each exception keeps under 25% all-$ (Aug 24+ junk-against):');
    p('');
    p(mdTable(
      ['Exception metric ≥50% inside <25% all-$', 'Aug 24+', 'T', 'Steam'],
      excepts.map(([label, key]) => [
        label,
        ...[['2026-08-24', lastDate], [T_FROM, lastDate], [STEAM_FROM, lastDate]].map(([lo, hi]) =>
          short(agg(win(lo, hi).filter((r) => r.share < 0.25 && Number.isFinite(r[key]) && r[key] >= 0.50)))),
      ]),
    ));
    p('');
  }
}

p('## 15. Median all-$ inside each proven band (are we just re-measuring majority boards?)');
p('');
{
  p(mdTable(
    ['Proven band', 'Aug 24+ n / med all-$ / med proven', 'T n / med all-$ / med proven', 'v12 n / med all-$ / med proven'],
    FINE_ORDER.filter((k) => k !== 'no $').map((k) => [
      k,
      ...[[AUG24, lastDate], [T_FROM, lastDate], [V12_FROM, lastDate]].map(([lo, hi]) => {
        const hit = win(lo, hi).filter((r) => shareFine(r.shareP) === k);
        if (!hit.length) return '—';
        const ma = med(hit.map((r) => r.share));
        const mp = med(hit.map((r) => r.shareP));
        return `n=${hit.length} · all ${nfix((ma || 0) * 100)}% · prov ${nfix((mp || 0) * 100)}% · ${short(agg(hit))}`;
      }),
    ]),
  ));
  p('');
}

const text = `${out.join('\n')}\n`;
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/PROVEN_SHARE_LADDER.md', text);
writeFileSync(join(ROOT, 'docs/PROVEN_SHARE_LADDER_2026-09-17.md'), text);
if (!FROM_CACHE) {
  const slim = rows.map((r) => ({
    date: r.date, sport: r.sport, mkt: r.mkt, team: r.team,
    live: r.live, won: r.won, u: r.u, pnl: r.pnl,
    share: r.share, shareP: r.shareP, shareC: r.shareC, shareAB: r.shareAB,
    shareN: r.shareN, shareNP: r.shareNP, shareNC: r.shareNC, shareNAB: r.shareNAB,
    wdN: r.wdN,
  }));
  writeFileSync('/opt/cursor/artifacts/proven_share_ladder_rows.json', JSON.stringify(slim));
}
console.log(text);
console.error(`wrote proven share ladder (refined=${hasRefined}, n=${rows.length}, last=${lastDate})`);
