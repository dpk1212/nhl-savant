#!/usr/bin/env node
/**
 * Quality of money — $ weighted by who, not just all-$ or proven-$.
 *
 *   node scripts/analyzeQualityShare.mjs
 *
 * Live book. No policy.
 * Q$      = invested × max(sport WR − 50, 0), n≥8 Source A
 * contrib = stamped v8 contribution (walletBase × conviction)
 * smart$  = $ from CONFIRMED or WR≥55 (n≥8) or WR50
 * junkAg  = against $ from wallets with no WR or WR<52
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sourceFlagsFromSportRec, sportRecFromProfiles } from '../src/lib/steamTailPolicy.js';
import { computeQConv, shortWalletId } from '../src/lib/walletClvSkill.js';
import { agsV12WalletQuality } from '../src/lib/ags.js';

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
const profilesObj = rawProfiles.profiles || rawProfiles;
const profileMap = new Map(Object.entries(profilesObj).map(([k, v]) => [String(k).toLowerCase(), v]));
function profileOf(short) {
  const k = String(short || '').toLowerCase();
  return profileMap.get(k) || profilesObj[k] || profilesObj[short] || null;
}
function flagsOf(short, sport) {
  return sourceFlagsFromSportRec(sportRecFromProfiles(profilesObj, short, sport));
}
function sportWr(short, sport) {
  const rec = sportRecFromProfiles(profilesObj, short, sport);
  const n = Number(rec?.picks?.n) || 0;
  const wr = Number(rec?.picks?.wr);
  if (n < 8 || !Number.isFinite(wr)) return null;
  return wr;
}
function sportRec(short, sport) {
  return sportRecFromProfiles(profilesObj, short, sport);
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
function pct(n) {
  if (!Number.isFinite(n)) return '—';
  return `${Math.round(n * 100)}%`;
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
function ratio(a, b) {
  const t = a + b;
  return t > 0 ? a / t : null;
}
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
      let qFor = 0; let qAg = 0;
      let cFor = 0; let cAg = 0;
      let bFor = 0; let bAg = 0;
      let smFor = 0; let smAg = 0;
      let v12For = 0; let v12Ag = 0;
      let $agJunk = 0; let $agWr50 = 0; let $agHi = 0; let $agScored = 0;
      let $forHi = 0; let $forScored = 0;
      let wrForSum = 0; let wrForN = 0;
      let wrAgSum = 0; let wrAgN = 0;
      const seen = new Set();
      for (const w of wd) {
        if (!w) continue;
        const short = shortWalletId(w.walletShort || w.wallet);
        if (!short || seen.has(short)) continue;
        seen.add(short);
        const onOurs = String(w.side) === String(sideKey);
        const inv = Number(w.invested) || 0;
        const contrib = Number(w.contribution);
        const base = Number(w.walletBase);
        const sr = Number(w.sizeRatio);
        const f = flagsOf(short, sport);
        const rec = sportRec(short, sport);
        const wr = sportWr(short, sport);
        const wr50 = rec?.whitelistTier === 'WR50' || rec?.isWR50 === true;
        const clv = Number(profileOf(short)?.clvSkill?.pctPos);
        const clvN = Number(profileOf(short)?.clvSkill?.n) || 0;
        const proven = !!(f.confirmed || f.flat);
        const hiWr = wr != null && wr >= 55;
        const smart = !!(f.confirmed || hiWr || wr50);
        const junk = wr == null || wr < 52;
        const q = wr != null ? inv * Math.max(wr - 50, 0) : 0;
        const c = Number.isFinite(contrib) ? contrib : (Number.isFinite(base) ? base : 0);
        const b = Number.isFinite(base) ? inv * base : 0;
        const v12q = agsV12WalletQuality({
          tier: rec?.whitelistTier || null,
          priorN: Number(rec?.picks?.n) || 0,
          priorRoi: Number(rec?.picks?.flatRoi) || 0,
          sizeRatio: Number.isFinite(sr) ? sr : 1,
        });
        if (onOurs) {
          $for += inv;
          if (proven) $forP += inv;
          qFor += q;
          cFor += c;
          bFor += b;
          if (smart) smFor += inv;
          v12For += v12q;
          if (wr != null) { $forScored += inv; wrForSum += wr; wrForN++; }
          if (hiWr) $forHi += inv;
        } else {
          $ag += inv;
          if (proven) $agP += inv;
          qAg += q;
          cAg += c;
          bAg += b;
          if (smart) smAg += inv;
          v12Ag += v12q;
          if (junk) $agJunk += inv;
          if (wr50) $agWr50 += inv;
          if (wr != null) { $agScored += inv; wrAgSum += wr; wrAgN++; }
          if (hiWr) $agHi += inv;
        }
      }
      const qConv = computeQConv(wd, sideKey, sport, profileMap);
      const edge = Number.isFinite(sd.v8_winnerAlignEdge) ? Number(sd.v8_winnerAlignEdge) : null;
      const qConvStamp = Number.isFinite(sd.v8_qConv) ? Number(sd.v8_qConv) : null;

      rows.push({
        date: data.date,
        sport,
        mkt,
        team: sd.team || sideKey,
        won, odds, u, pnl, live,
        share: ratio($for, $ag),
        shareP: ratio($forP, $agP),
        shareQ: ratio(qFor, qAg),
        shareC: ratio(cFor, cAg),
        shareB: ratio(bFor, bAg),
        shareS: ratio(smFor, smAg),
        shareV12: ratio(v12For, v12Ag),
        junkAg: $ag > 0 ? $agJunk / $ag : null,
        wr50Ag: $ag > 0 ? $agWr50 / $ag : null,
        hiAg: $ag > 0 ? $agHi / $ag : null,
        hiFor: $for > 0 ? $forHi / $for : null,
        meanWrFor: wrForN ? wrForSum / wrForN : null,
        meanWrAg: wrAgN ? wrAgSum / wrAgN : null,
        qConv: qConvStamp ?? qConv,
        edge,
        $for, $ag, $forP, $agP,
        qFor, qAg, smFor, smAg,
        wrForN, wrAgN,
        wdN: seen.size,
      });
    }
  }
}

const liveOf = (rs) => rs.filter((r) => r.live);
const win = (lo, hi) => liveOf(rows.filter((r) => r.date >= lo && r.date <= hi));
const dates = [...new Set(liveOf(rows).map((r) => r.date))].sort();
const lastDate = dates[dates.length - 1];
const last2Lo = dates.slice(-2)[0];
const weekLo = addDays(lastDate, -6);

const windows = [
  ['Last 2', last2Lo, lastDate],
  ['Last 7', weekLo, lastDate],
  ['T', T_FROM, lastDate],
  ['Steam', STEAM_FROM, lastDate],
  ['Aug 24+', AUG24, lastDate],
  ['v12', V12_FROM, lastDate],
];
const focus = [
  ['Last 7', weekLo, lastDate],
  ['T', T_FROM, lastDate],
  ['Steam', STEAM_FROM, lastDate],
  ['Aug 24+', AUG24, lastDate],
  ['v12', V12_FROM, lastDate],
];

const METRICS = [
  ['all $', 'share'],
  ['proven $', 'shareP'],
  ['Q$ (WR−50)×$', 'shareQ'],
  ['contrib share', 'shareC'],
  ['smart $', 'shareS'],
  ['v12 quality $', 'shareV12'],
  ['walletBase×$', 'shareB'],
];

const out = [];
const p = (s = '') => out.push(s);

p('# Quality of money — $ weighted by who');
p('');
p(`_Pulled ${new Date().toISOString().slice(0, 10)}. Graded AGS-U **${V12_FROM}–${lastDate}**. Last 2 = ${last2Lo}–${lastDate}._`);
p('_Q$ = invested × max(Source A sport WR − 50, 0), n≥8. Junk $ (WR&lt;50 or no WR) drops out. contrib = stamped v8 `contribution` (walletBase × conviction). smart $ = CONFIRMED or WR≥55 or WR50. v12 quality = `agsV12WalletQuality` (CONFIRMED=3, FLAT=2, WR50 gated to 0). junkAg = against $ with no WR or WR&lt;52 / against $._');
p('_Live book. CF: mute shipped tickets → **positive save = would have saved**. **No policy.**_');
p('');
p('## Direct answer');
p('');
p('_Numbers below. Human summary written after the run._');
p('');

p('## 0. Coverage');
p('');
p(mdTable(
  ['Window', 'Live', 'all $', 'proven $', 'Q$', 'contrib', 'smart $', 'v12Q'],
  windows.map(([n, lo, hi]) => {
    const rs = win(lo, hi);
    return [
      n,
      String(rs.length),
      String(rs.filter((r) => Number.isFinite(r.share)).length),
      String(rs.filter((r) => Number.isFinite(r.shareP)).length),
      String(rs.filter((r) => Number.isFinite(r.shareQ)).length),
      String(rs.filter((r) => Number.isFinite(r.shareC)).length),
      String(rs.filter((r) => Number.isFinite(r.shareS)).length),
      String(rs.filter((r) => Number.isFinite(r.shareV12)).length),
    ];
  }),
));
p('');

p('## 1. Pocket autopsy — do quality metrics split printers from dogs?');
p('');
p('Junk-against *should* be high quality on us / junk against. Fake-save *should* show quality on the against pile if “who” is the missing axis.');
p('');
{
  const cells = [
    ['Junk-against: all <25% AND proven ≥50%', (r) => r.share < 0.25 && r.shareP >= 0.50],
    ['Fake save: all 25–45% AND proven ≥50%', (r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.50],
    ['True buried: all <25% AND proven <50%', (r) => r.share < 0.25 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['True contested: all 25–45% AND proven <50%', (r) => r.share >= 0.25 && r.share < 0.45 && Number.isFinite(r.shareP) && r.shareP < 0.50],
    ['Proven 45–50% (prints)', (r) => r.shareP >= 0.45 && r.shareP < 0.50],
    ['Proven 50–60% (the hole)', (r) => r.shareP >= 0.50 && r.shareP < 0.60],
    ['Proven 20–25% (dog)', (r) => r.shareP >= 0.20 && r.shareP < 0.25],
    ['Proven 30–35% (pocket)', (r) => r.shareP >= 0.30 && r.shareP < 0.35],
    ['all 15–25%', (r) => r.share >= 0.15 && r.share < 0.25],
    ['all 25–45%', (r) => r.share >= 0.25 && r.share < 0.45],
  ];
  const eras = [
    ['Aug 24+', AUG24, lastDate],
    ['T', T_FROM, lastDate],
  ];
  for (const [ename, lo, hi] of eras) {
    const rs = win(lo, hi);
    p(`**${ename}**`);
    p('');
    p(mdTable(
      ['Cell', 'W/L', 'med all $', 'med proven', 'med Q$', 'med contrib', 'med smart $', 'med junkAg', 'med WR50-ag', 'med EDGE', 'med qConv'],
      cells.map(([name, fn]) => {
        const hit = rs.filter((r) => Number.isFinite(r.share) && fn(r));
        const a = agg(hit);
        if (!a.n) return [name, '—', '—', '—', '—', '—', '—', '—', '—', '—', '—'];
        return [
          name,
          short(a),
          pct(med(hit.map((r) => r.share))),
          pct(med(hit.map((r) => r.shareP))),
          pct(med(hit.map((r) => r.shareQ))),
          pct(med(hit.map((r) => r.shareC))),
          pct(med(hit.map((r) => r.shareS))),
          pct(med(hit.map((r) => r.junkAg))),
          pct(med(hit.map((r) => r.wr50Ag))),
          nfix(med(hit.map((r) => r.edge)), 1),
          nfix(med(hit.map((r) => r.qConv)), 1),
        ];
      }),
    ));
    p('');
  }
}

p('## 2. Fine bands — Q$ (the quality-weighted board)');
p('');
p('Read left → right as our share of *above-coin* dollars rises. Junk $ is gone from both sides.');
p('');
p(mdTable(
  ['Q$ band', ...windows.map(([n]) => n)],
  FINE_ORDER.map((k) => [
    k,
    ...windows.map(([, lo, hi]) => fmt(agg(win(lo, hi).filter((r) => shareFine(r.shareQ) === k)))),
  ]),
));
p('');

p('## 3. Fine bands — contrib share (causal v8 quality already on the card)');
p('');
p(mdTable(
  ['contrib band', ...focus.map(([n]) => n)],
  FINE_ORDER.map((k) => [
    k,
    ...focus.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => shareFine(r.shareC) === k)))),
  ]),
));
p('');

p('## 4. Fine bands — smart $ (CONFIRMED or WR≥55 or WR50)');
p('');
p(mdTable(
  ['smart $ band', ...focus.map(([n]) => n)],
  FINE_ORDER.map((k) => [
    k,
    ...focus.map(([, lo, hi]) => short(agg(win(lo, hi).filter((r) => shareFine(r.shareS) === k)))),
  ]),
));
p('');

p('## 5. Fine bands — against-junk % (high = the other side is junk $)');
p('');
{
  const jb = [
    ['junkAg <40%', (r) => Number.isFinite(r.junkAg) && r.junkAg < 0.40],
    ['junkAg 40–60%', (r) => r.junkAg >= 0.40 && r.junkAg < 0.60],
    ['junkAg 60–80%', (r) => r.junkAg >= 0.60 && r.junkAg < 0.80],
    ['junkAg ≥80%', (r) => r.junkAg >= 0.80],
    ['WR50-ag ≥25%', (r) => r.wr50Ag >= 0.25],
    ['WR50-ag ≥50%', (r) => r.wr50Ag >= 0.50],
    ['hiWR-ag ≥25% (WR≥55)', (r) => r.hiAg >= 0.25],
    ['hiWR-ag ≥50%', (r) => r.hiAg >= 0.50],
  ];
  p(mdTable(
    ['Against-side quality', ...focus.map(([n]) => n)],
    jb.map(([name, fn]) => [name, ...focus.map(([, lo, hi]) => short(agg(win(lo, hi).filter(fn))))]),
  ));
  p('');
}

p('## 6. Directionality — keep ≥ X on each quality metric');
p('');
p('If the metric is directional, keep-≥60 beats keep-≥50 beats the full book, and there is no 50–60% hole.');
p('');
{
  const cuts = [0, 0.40, 0.45, 0.50, 0.60, 0.80];
  const eras = [
    ['T', T_FROM, lastDate],
    ['Aug 24+', AUG24, lastDate],
  ];
  for (const [label, key] of METRICS) {
    p(`**${label}**`);
    p('');
    p(mdTable(
      ['Keep ≥ X', ...eras.map(([n]) => n)],
      cuts.map((x) => [
        x === 0 ? 'all with metric' : `≥${Math.round(x * 100)}%`,
        ...eras.map(([, lo, hi]) => {
          const rs = win(lo, hi).filter((r) => Number.isFinite(r[key]) && r[key] >= x);
          const a = agg(rs);
          if (!a.n) return '—';
          return `${short(a)} · ${rs.length} tix`;
        }),
      ]),
    ));
    p('');
  }
}

p('## 7. Mute ≤45% all-$ except quality-metric ≥50%');
p('');
p('Same mixed-axis lean, swap the exception from proven $ to a quality %.');
p('');
{
  const excepts = METRICS.filter(([, key]) => key !== 'share');
  p(mdTable(
    ['Mute all-$ ≤45 except…', ...focus.map(([n]) => n)],
    excepts.map(([label, key]) => [
      `${label} ≥50%`,
      ...focus.map(([, lo, hi]) => {
        const rs = win(lo, hi).filter((r) => Number.isFinite(r.share));
        const hit = rs.filter((r) => r.share < 0.45 && !(Number.isFinite(r[key]) && r[key] >= 0.50));
        const rest = rs.filter((r) => !(r.share < 0.45 && !(Number.isFinite(r[key]) && r[key] >= 0.50)));
        return cutLine(hit, rest);
      }),
    ]),
  ));
  p('');
  p('What each exception **keeps inside 25–45% all-$** (the fake-save test):');
  p('');
  p(mdTable(
    ['Exception ≥50% inside 25–45% all-$', ...focus.map(([n]) => n)],
    excepts.map(([label, key]) => [
      label,
      ...focus.map(([, lo, hi]) =>
        short(agg(win(lo, hi).filter((r) => r.share >= 0.25 && r.share < 0.45 && Number.isFinite(r[key]) && r[key] >= 0.50)))),
    ]),
  ));
  p('');
  p('What each exception **keeps under 25% all-$** (junk-against test):');
  p('');
  p(mdTable(
    ['Exception ≥50% inside <25% all-$', ...focus.map(([n]) => n)],
    excepts.map(([label, key]) => [
      label,
      ...focus.map(([, lo, hi]) =>
        short(agg(win(lo, hi).filter((r) => r.share < 0.25 && Number.isFinite(r[key]) && r[key] >= 0.50)))),
    ]),
  ));
  p('');
}

p('## 8. Mute-below-X on Q$ / contrib / smart (floor on the quality board)');
p('');
{
  const cuts = [0.25, 0.40, 0.45, 0.50, 0.60];
  const eras = [
    ['T', T_FROM, lastDate],
    ['Aug 24+', AUG24, lastDate],
    ['v12', V12_FROM, lastDate],
  ];
  for (const [label, key] of [['Q$', 'shareQ'], ['contrib', 'shareC'], ['smart $', 'shareS']]) {
    p(`**Mute ${label} < X**`);
    p('');
    p(mdTable(
      [`Mute ${label} < X`, ...eras.map(([n]) => n)],
      cuts.map((x) => [
        `<${Math.round(x * 100)}%`,
        ...eras.map(([, lo, hi]) => {
          const rs = win(lo, hi);
          const hit = rs.filter((r) => Number.isFinite(r[key]) && r[key] < x);
          const rest = rs.filter((r) => !(Number.isFinite(r[key]) && r[key] < x));
          return cutLine(hit, rest);
        }),
      ]),
    ));
    p('');
  }
}

p('## 9. Two-axis: all-$ band × Q$ ≥50 (does quality flip the board?)');
p('');
{
  const allc = [
    ['all 0–15%', (r) => r.share < 0.15],
    ['all 15–25%', (r) => r.share >= 0.15 && r.share < 0.25],
    ['all 25–45%', (r) => r.share >= 0.25 && r.share < 0.45],
    ['all 45–60%', (r) => r.share >= 0.45 && r.share < 0.60],
    ['all ≥60%', (r) => r.share >= 0.60],
  ];
  const rs = win(AUG24, lastDate);
  p('**Aug 24+**');
  p('');
  p(mdTable(
    ['All-$ band', 'all', 'Q$ ≥50%', 'Q$ <50%', 'smart ≥50%', 'smart <50%', 'contrib ≥50%', 'contrib <50%'],
    allc.map(([name, fn]) => {
      const hit = rs.filter((r) => Number.isFinite(r.share) && fn(r));
      return [
        name,
        short(agg(hit)),
        short(agg(hit.filter((r) => r.shareQ >= 0.50))),
        short(agg(hit.filter((r) => Number.isFinite(r.shareQ) && r.shareQ < 0.50))),
        short(agg(hit.filter((r) => r.shareS >= 0.50))),
        short(agg(hit.filter((r) => Number.isFinite(r.shareS) && r.shareS < 0.50))),
        short(agg(hit.filter((r) => r.shareC >= 0.50))),
        short(agg(hit.filter((r) => Number.isFinite(r.shareC) && r.shareC < 0.50))),
      ];
    }),
  ));
  p('');
  const t = win(T_FROM, lastDate);
  p('**T**');
  p('');
  p(mdTable(
    ['All-$ band', 'all', 'Q$ ≥50%', 'Q$ <50%', 'smart ≥50%', 'smart <50%'],
    allc.map(([name, fn]) => {
      const hit = t.filter((r) => Number.isFinite(r.share) && fn(r));
      return [
        name,
        short(agg(hit)),
        short(agg(hit.filter((r) => r.shareQ >= 0.50))),
        short(agg(hit.filter((r) => Number.isFinite(r.shareQ) && r.shareQ < 0.50))),
        short(agg(hit.filter((r) => r.shareS >= 0.50))),
        short(agg(hit.filter((r) => Number.isFinite(r.shareS) && r.shareS < 0.50))),
      ];
    }),
  ));
  p('');
}

p('## 10. Combined mute language (quality inside the dead pile)');
p('');
{
  const opts = [
    ['Mute all ≤45%', (r) => r.share < 0.45],
    ['Mute ≤45 except proven ≥50%', (r) => r.share < 0.45 && !(r.shareP >= 0.50)],
    ['Mute ≤45 except Q$ ≥50%', (r) => r.share < 0.45 && !(r.shareQ >= 0.50)],
    ['Mute ≤45 except Q$ ≥60%', (r) => r.share < 0.45 && !(r.shareQ >= 0.60)],
    ['Mute ≤45 except smart ≥50%', (r) => r.share < 0.45 && !(r.shareS >= 0.50)],
    ['Mute ≤45 except contrib ≥50%', (r) => r.share < 0.45 && !(r.shareC >= 0.50)],
    ['Mute 25–45 always; <25 keep Q$ ≥50%', (r) => (r.share >= 0.25 && r.share < 0.45) || (r.share < 0.25 && !(r.shareQ >= 0.50))],
    ['Mute 25–45 always; <25 keep proven ≥50%', (r) => (r.share >= 0.25 && r.share < 0.45) || (r.share < 0.25 && !(r.shareP >= 0.50))],
    ['Mute 25–45 AND junkAg <80% (keep high-junk contested)', (r) => r.share >= 0.25 && r.share < 0.45 && !(r.junkAg >= 0.80)],
    ['Mute 25–45 always', (r) => r.share >= 0.25 && r.share < 0.45],
    ['Mute Q$ <45%', (r) => Number.isFinite(r.shareQ) && r.shareQ < 0.45],
    ['Mute Q$ <50%', (r) => Number.isFinite(r.shareQ) && r.shareQ < 0.50],
    ['Mute smart <45%', (r) => Number.isFinite(r.shareS) && r.shareS < 0.45],
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

p('## 11. Tickets — junk-against vs fake-save with quality columns (Aug 24+)');
p('');
{
  const dump = (title, fn) => {
    const hit = win(AUG24, lastDate).filter((r) => Number.isFinite(r.share) && fn(r))
      .sort((a, b) => a.date.localeCompare(b.date));
    p(`**${title}** n=${hit.length} · ${short(agg(hit))}`);
    p('');
    if (!hit.length) return;
    p(mdTable(
      ['Date', 'Mkt', 'Side', 'u', 'W/L', 'all', 'prov', 'Q$', 'smart', 'contrib', 'junkAg', 'WR50ag', 'EDGE', 'qConv'],
      hit.map((r) => [
        r.date,
        `${r.sport} ${r.mkt}`,
        String(r.team).slice(0, 22),
        String(r.u),
        r.won ? 'W' : 'L',
        pct(r.share),
        pct(r.shareP),
        pct(r.shareQ),
        pct(r.shareS),
        pct(r.shareC),
        pct(r.junkAg),
        pct(r.wr50Ag),
        nfix(r.edge, 1),
        nfix(r.qConv, 1),
      ]),
    ));
    p('');
  };
  dump('Junk-against: all <25% AND proven ≥50%', (r) => r.share < 0.25 && r.shareP >= 0.50);
  dump('Fake save: all 25–45% AND proven ≥50%', (r) => r.share >= 0.25 && r.share < 0.45 && r.shareP >= 0.50);
}

p('## 12. ROI by fine band, Aug 24+ — which metric is actually directional?');
p('');
{
  p(mdTable(
    ['Band', ...METRICS.map(([n]) => n)],
    FINE_ORDER.filter((k) => k !== 'no $').map((k) => [
      k,
      ...METRICS.map(([, key]) => {
        const a = agg(win(AUG24, lastDate).filter((r) => shareFine(r[key]) === k));
        if (!a.n) return '—';
        if (a.n < 3) return `${short(a)} n=${a.n}`;
        return `${a.roi >= 0 ? '+' : ''}${a.roi}% · ${a.w}–${a.l} n=${a.n}`;
      }),
    ]),
  ));
  p('');
}

p('## 13. Median all-$ inside each Q$ band (is Q$ just majority boards again?)');
p('');
p(mdTable(
  ['Q$ band', 'Aug 24+', 'T', 'v12'],
  FINE_ORDER.filter((k) => k !== 'no $').map((k) => [
    k,
    ...[[AUG24, lastDate], [T_FROM, lastDate], [V12_FROM, lastDate]].map(([lo, hi]) => {
      const hit = win(lo, hi).filter((r) => shareFine(r.shareQ) === k);
      if (!hit.length) return '—';
      return `n=${hit.length} · all ${pct(med(hit.map((r) => r.share)))} · prov ${pct(med(hit.map((r) => r.shareP)))} · ${short(agg(hit))}`;
    }),
  ]),
));
p('');

const text = `${out.join('\n')}\n`;
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/QUALITY_SHARE.md', text);
writeFileSync(join(ROOT, 'docs/QUALITY_SHARE_2026-09-17.md'), text);
const slim = rows.filter((r) => r.live).map((r) => ({
  date: r.date, sport: r.sport, mkt: r.mkt, team: r.team,
  live: r.live, won: r.won, u: r.u, pnl: r.pnl,
  share: r.share, shareP: r.shareP, shareQ: r.shareQ, shareC: r.shareC,
  shareS: r.shareS, shareV12: r.shareV12, shareB: r.shareB,
  junkAg: r.junkAg, wr50Ag: r.wr50Ag, hiAg: r.hiAg,
  edge: r.edge, qConv: r.qConv,
}));
writeFileSync('/opt/cursor/artifacts/quality_share_rows.json', JSON.stringify(slim));
console.log(text);
console.error(`wrote quality share n=${rows.length} last=${lastDate}`);
