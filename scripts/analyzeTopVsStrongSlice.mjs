/**
 * Why 3u is beating 4–5.4u — mutes eating TOP, 3u slices that look like a bump.
 *
 *   node scripts/analyzeTopVsStrongSlice.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { analyzeTicketTapeLog } from '../src/lib/ticketTapeCapture.js';
import { agsV12UnitTierFromUnits } from '../src/lib/ags.js';
import { steamTailBand } from '../src/lib/steamTailPolicy.js';
import { fmt } from './analyzeUnitTierSteamBook.mjs';

const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const FROM = '2026-08-31';

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
    u.searchParams.set('pageSize', '100');
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
function num(x) {
  if (x == null || x === '') return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
function maxPos(...vals) {
  let m = 0;
  for (const v of vals) {
    const n = num(v);
    if (n != null && n > m) m = n;
  }
  return m;
}
function profitAt(odds, units, won) {
  if (!(units > 0) || won == null) return 0;
  if (!won) return -units;
  if (!Number.isFinite(odds) || odds === 0) return 0;
  return odds < 0 ? units * (100 / Math.abs(odds)) : units * (odds / 100);
}
function line(label, rows, opts) {
  const a = fmt(rows, opts);
  if (!a.n && !a.pending) return `${String(label).padEnd(36)}  —`;
  return `${String(label).padEnd(36)} ${String(a.n).padStart(4)}  ${String(a.w).padStart(3)}-${String(a.l).padEnd(3)}  ${a.wr.toFixed(1).padStart(5)}%  ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1).padStart(7)}u  roi=${a.roi.toFixed(1).padStart(6)}%`;
}
function bumpPnl(r, toUnits) {
  if (r.won == null) return 0;
  return profitAt(r.odds, toUnits, r.won);
}
function how4(r) {
  if (r.unitTierAction === 'PROMOTE') return 'unit-tier PROMOTE';
  if (r.steamTailAction === 'BOOST') return 'T arriving BOOST';
  if (r.steamTailAction === 'FLOOR') return 'T arriving FLOOR';
  if ((r.preSteam || 0) >= 3.5) return 'native 4u+ into T';
  if ((r.native || 0) >= 3.5) return 'native 4u+ later shrink';
  return 'other / leftover 4u';
}

function collect(packs) {
  const rows = [];
  for (const { mkt, docs } of packs) {
    for (const data of docs) {
      const sides = data.sides;
      if (!sides || typeof sides !== 'object') continue;
      const date = String(data.date || '');
      if (date < FROM) continue;
      const sport = data.sport || '?';
      for (const [side, sd] of Object.entries(sides)) {
        if (!sd || sd.superseded) continue;
        if (!isAgsu(sd.promotedBy)) continue;
        const res = sd.result || data.result || {};
        if (res.tracked === true && !(sd.mutedBy || (num(sd.finalUnits) || 0) <= 0)) continue;
        const outcome = res.outcome;
        const won = outcome === 'WIN' ? true : outcome === 'LOSS' ? false : null;
        const lock = sd.lock || {};
        const peak = sd.peak || lock;
        let actual = num(sd.finalUnits);
        if (actual == null) actual = num(sd.v8_agsUnitsApplied);
        if (actual == null) actual = num(peak.units) || 0;
        const odds = num(peak.odds) ?? num(lock.odds);
        let profit = num(res.profit);
        if (profit == null && won != null && actual > 0) profit = profitAt(odds, actual, won);
        if (profit == null) profit = 0;
        const tape = analyzeTicketTapeLog(sd.v8_ticketTapeLog || sd.ticketTapeLog || []);
        const preTape = num(sd.v8_unitsPreTape);
        const preFlinch = num(sd.v8_unitsPreFlinchFailOpen);
        const preClimate = num(sd.v8_unitsPreClimate);
        const preUnlock = num(sd.v8_unitsPreSportUnlock);
        const preSteam = num(sd.v8_unitsPreSteamTail);
        const preJuice = num(sd.v8_unitsPreFavJuice);
        const preOverlay = num(sd.v8_unitsPreUnitTierEvSteam);
        const preCrowd = num(sd.v8_unitsPreTopCrowded);
        const preEvDrift = num(sd.v8_unitsPreEvDrift);
        // Peak/lock units are HC raw (TOP=5 / SUPER=6) and inflate MINI/Q1.
        // Native = max stamped pre-policy size only.
        const native = maxPos(
          preTape, preFlinch, preCrowd, preEvDrift, preUnlock, preClimate,
          preSteam, preJuice, preOverlay, num(sd.v8_unitsPreEdgeBand), actual,
        );
        const intoT = maxPos(preSteam, preClimate, preUnlock, actual);
        const muted = actual <= 0;
        const cfAt = (u) => (won == null ? 0 : profitAt(odds, u, won));
        rows.push({
          date, sport, mkt,
          team: sd.team || side,
          units: actual,
          native,
          intoT,
          preSteam: preSteam || 0,
          preClimate: preClimate || 0,
          preUnlock: preUnlock || 0,
          preOverlay: preOverlay || 0,
          preCrowd: preCrowd || 0,
          odds,
          won,
          profit: muted ? 0 : profit,
          muted,
          mutedBy: sd.mutedBy || (muted ? 'muted-unstamped' : null),
          lockTier: String(sd.v8_lockTier || sd.v8_agsV12Tier || '—').toUpperCase(),
          path: sd.v8_hcStakeTier || '—',
          tile: agsV12UnitTierFromUnits(actual),
          nativeTile: agsV12UnitTierFromUnits(native),
          intoTTile: agsV12UnitTierFromUnits(intoT),
          band: steamTailBand(actual),
          nativeBand: steamTailBand(native),
          intoTBand: steamTailBand(intoT),
          steamOn: !!tape.steamOnLock,
          arriving: !!(tape.n && !tape.steamOnFirst && tape.steamOnLock),
          alreadyOn: !!(tape.n && tape.steamOnFirst && tape.steamOnLock),
          evLock: tape.evLock,
          lastHour: tape.lastHourLock,
          steamTailAction: sd.v8_steamTailAction || null,
          steamTailReason: sd.v8_steamTailReason || null,
          unitTierAction: sd.v8_unitTierEvSteamAction || null,
          climateAction: sd.v8_climateAction || null,
          unlockAction: sd.v8_sportUnlockAction || null,
          edgeBandAction: sd.v8_edgeBandAction || null,
          q1: !!sd.v8_confirmedQ1Promote,
          cfNative: cfAt(native),
          cf4: cfAt(4),
          cf3: cfAt(3),
        });
      }
    }
  }
  return rows;
}

function ticket(r, sizeKey = 'units') {
  const u = r[sizeKey] ?? r.units;
  const wl = r.won == null ? 'pend' : r.won ? 'W' : 'L';
  const pnl = r.muted && sizeKey !== 'units' ? r.cfNative : (r.muted ? 0 : r.profit);
  const sign = pnl >= 0 ? '+' : '';
  const steam = r.arriving ? 'ARR' : r.alreadyOn ? 'ON' : r.steamOn ? 'ON?' : 'off';
  const ev = r.evLock == null ? '—' : r.evLock;
  const lh = r.lastHour == null ? '—' : r.lastHour;
  return `  ${r.date} ${r.sport.padEnd(4)} ${String(r.team).padEnd(22)} ${String(u).padStart(4)}u  ${String(r.lockTier).padEnd(8)} ${String(r.path).padEnd(14)} ${steam.padEnd(4)} ev=${String(ev).padStart(5)} lh=${String(lh).padStart(5)} ${wl} ${sign}${Number(pnl).toFixed(1)}  ${r.mutedBy || how4(r)}`;
}

async function main() {
  console.log('Fetching Firestore…');
  const packs = [];
  for (const [col, mkt] of COLS) {
    const docs = await listCollection(col);
    console.log(`  ${col}: ${docs.length}`);
    packs.push({ mkt, docs });
  }
  const rows = collect(packs);
  const graded = rows.filter((r) => r.won != null);
  const shipped = graded.filter((r) => !r.muted);
  const muted = graded.filter((r) => r.muted);
  const top = shipped.filter((r) => r.tile === 'TOP');
  const strong = shipped.filter((r) => r.tile === 'STRONG');
  const cf = { unitsKey: 'native', pnlKey: 'cfNative' };

  const out = [];
  const push = (s = '') => { out.push(s); console.log(s); };

  push('# 3u vs 4–5.4u — what is eating TOP, what 3u looks like a bump');
  push('');
  push(`_Generated ${new Date().toISOString()} · AGSU Aug 31+ graded._`);
  push('');
  push('No production sizer change. WATCH ≠ bump.');
  push('');

  push('## 1. The inversion');
  push('```');
  push(line('shipped TOP 4–5.4u', top));
  push(line('shipped STRONG 3u', strong));
  push(line('  extra if every 3u → 4u', strong.map((r) => ({ ...r, profit: r.cf4, units: 4 }))));
  push('```');
  const topAs3 = top.map((r) => ({ ...r, profit: r.cf3, units: 3 }));
  push('If shipped TOP had stayed 3u: ' + line('TOP@3u', topAs3));
  push('The 4u tax on those 14 tickets vs 3u: '
    + `${(fmt(top).pnl - fmt(topAs3).pnl).toFixed(1)}u`);
  push('');

  push('## 2. How shipped TOP got to 4u+');
  push('```');
  const byHow = new Map();
  for (const r of top) {
    const k = how4(r);
    if (!byHow.has(k)) byHow.set(k, []);
    byHow.get(k).push(r);
  }
  for (const [k, rs] of [...byHow.entries()].sort((a, b) => b[1].length - a[1].length)) {
    push(line(k, rs));
  }
  push('```');
  push('Shipped TOP tickets:');
  for (const r of [...top].sort((a, b) => a.date.localeCompare(b.date) || String(a.team).localeCompare(b.team))) {
    push(ticket(r));
  }
  push('');

  push('## 3. Cuts / mutes that ate a native TOP-or-fatter ticket');
  push('Native = max pre-policy units (tape/leftover/crowd/T/overlay). These would have been 4–5.4u or 6u before the mute.');
  push('');
  const ateTop = muted.filter((r) => r.nativeTile === 'TOP' || r.nativeTile === 'MAX');
  push('```');
  push(line('ALL muted native TOP/MAX', ateTop, cf));
  const byCut = new Map();
  for (const r of ateTop) {
    const k = r.mutedBy || 'unstamped';
    if (!byCut.has(k)) byCut.set(k, []);
    byCut.get(k).push(r);
  }
  for (const [k, rs] of [...byCut.entries()].sort((a, b) => b[1].length - a[1].length)) {
    push(line(k, rs, cf));
    for (const b of ['u4', 'u5', 'fat']) {
      const sub = rs.filter((r) => r.nativeBand === b);
      if (sub.length) push(line(`  native ${b}`, sub, cf));
    }
  }
  push('```');
  push('Also muted with into-T already 4u+ (what Policy T actually saw):');
  const ateIntoT = muted.filter((r) => r.intoTTile === 'TOP' || r.intoTTile === 'MAX');
  push('```');
  push(line('muted into-T TOP/MAX', ateIntoT, { unitsKey: 'intoT', pnlKey: 'cfNative' }));
  const byCutT = new Map();
  for (const r of ateIntoT) {
    const k = r.mutedBy || 'unstamped';
    if (!byCutT.has(k)) byCutT.set(k, []);
    byCutT.get(k).push(r);
  }
  for (const [k, rs] of [...byCutT.entries()].sort((a, b) => b[1].length - a[1].length)) {
    push(line(k, rs, { unitsKey: 'intoT', pnlKey: 'cfNative' }));
  }
  push('```');

  push('## 4. Native TOP that shipped smaller (shrink, not mute)');
  const shrunk = shipped.filter((r) => (r.nativeTile === 'TOP' || r.nativeTile === 'MAX') && r.tile !== 'TOP' && r.tile !== 'MAX');
  push('```');
  push(line('native TOP/MAX → shipped smaller', shrunk));
  push(line('  → shipped 3u', shrunk.filter((r) => r.tile === 'STRONG')));
  push(line('  → shipped MID', shrunk.filter((r) => r.tile === 'MID')));
  push('```');
  if (shrunk.length) {
    push('Shrunk tickets:');
    for (const r of [...shrunk].sort((a, b) => a.date.localeCompare(b.date))) {
      push(`  ${r.date} ${r.sport} ${r.team} native=${r.native} ship=${r.units} ${r.lockTier}/${r.path} climate=${r.climateAction || '—'} unlock=${r.unlockAction || '—'} T=${r.steamTailAction || '—'} ${r.won ? 'W' : 'L'} ${r.profit >= 0 ? '+' : ''}${r.profit.toFixed(1)}`);
    }
  }
  push('');

  push('## 5. 3u slices — bump to 4u counterfactual');
  push('Delta = shipped@4u − shipped@3u on the same tickets. Positive = the bump would have paid.');
  const slices = [
    ['3u all', strong],
    ['3u ELITE', strong.filter((r) => r.lockTier === 'ELITE')],
    ['3u PREMIUM', strong.filter((r) => r.lockTier === 'PREMIUM')],
    ['3u LOCK', strong.filter((r) => r.lockTier === 'LOCK')],
    ['3u WEAK', strong.filter((r) => r.lockTier === 'WEAK')],
    ['3u LEAN', strong.filter((r) => r.lockTier === 'LEAN')],
    ['3u ELITE+PREMIUM', strong.filter((r) => r.lockTier === 'ELITE' || r.lockTier === 'PREMIUM')],
    ['3u arriving', strong.filter((r) => r.arriving)],
    ['3u already-on', strong.filter((r) => r.alreadyOn)],
    ['3u steam-on (any)', strong.filter((r) => r.steamOn)],
    ['3u steam off', strong.filter((r) => !r.steamOn)],
    ['3u lastHour ≥ 3', strong.filter((r) => r.lastHour != null && r.lastHour >= 3)],
    ['3u lastHour 0–<3', strong.filter((r) => r.lastHour != null && r.lastHour >= 0 && r.lastHour < 3)],
    ['3u lockEV ≥ 0', strong.filter((r) => r.evLock != null && r.evLock >= 0)],
    ['3u lockEV −1–0', strong.filter((r) => r.evLock != null && r.evLock >= -1 && r.evLock < 0)],
    ['3u lockEV < −1', strong.filter((r) => r.evLock != null && r.evLock < -1)],
    ['3u Q1 floor', strong.filter((r) => r.q1)],
    ['3u path RANK', strong.filter((r) => r.path === 'RANK')],
    ['3u path TOP/MINI/SUPER', strong.filter((r) => ['TOP', 'TOP+', 'MINI', 'SUPER'].includes(r.path))],
    ['3u path SHARP*', strong.filter((r) => String(r.path).startsWith('SHARP'))],
    ['3u ELITE/PREM + arriving', strong.filter((r) => (r.lockTier === 'ELITE' || r.lockTier === 'PREMIUM') && r.arriving)],
    ['3u ELITE/PREM + steam-on', strong.filter((r) => (r.lockTier === 'ELITE' || r.lockTier === 'PREMIUM') && r.steamOn)],
    ['3u ELITE/PREM + steam off', strong.filter((r) => (r.lockTier === 'ELITE' || r.lockTier === 'PREMIUM') && !r.steamOn)],
    ['3u WEAK + arriving', strong.filter((r) => r.lockTier === 'WEAK' && r.arriving)],
    ['3u WEAK + steam-on', strong.filter((r) => r.lockTier === 'WEAK' && r.steamOn)],
    ['3u timing promote (arr|lh≥3, not LEAN, ev≥−1)', strong.filter((r) => {
      if (r.lockTier === 'LEAN' || r.lockTier === 'FADE') return false;
      if (r.lastHour != null && r.lastHour < 0) return false;
      if (r.evLock != null && r.evLock < -1) return false;
      return r.arriving || (r.lastHour != null && r.lastHour >= 3);
    })],
    ['3u RANK EDGE-SOFT (4→3)', strong.filter((r) => r.path === 'RANK' && r.edgeBandAction === 'SOFT')],
    ['3u ELITE RANK', strong.filter((r) => r.lockTier === 'ELITE' && r.path === 'RANK')],
    ['3u ELITE MINI', strong.filter((r) => r.lockTier === 'ELITE' && r.path === 'MINI')],
    ['3u ELITE Q1', strong.filter((r) => r.lockTier === 'ELITE' && r.q1)],
    ['3u PREMIUM RANK', strong.filter((r) => r.lockTier === 'PREMIUM' && r.path === 'RANK')],
    ['3u not Q1, not LEAN', strong.filter((r) => !r.q1 && r.lockTier !== 'LEAN')],
  ];
  push('```');
  push(`${''.padEnd(36)}    n    W-L      WR         @3u        @4u     bumpΔ`);
  for (const [label, rs] of slices) {
    const a3 = fmt(rs);
    const a4 = fmt(rs.map((r) => ({ ...r, profit: r.cf4, units: 4 })));
    if (!a3.n) {
      push(`${label.padEnd(36)}  —`);
      continue;
    }
    const d = a4.pnl - a3.pnl;
    push(`${label.padEnd(36)} ${String(a3.n).padStart(4)}  ${String(a3.w).padStart(3)}-${String(a3.l).padEnd(3)}  ${a3.wr.toFixed(1).padStart(5)}%  ${a3.pnl >= 0 ? '+' : ''}${a3.pnl.toFixed(1).padStart(7)}u  ${a4.pnl >= 0 ? '+' : ''}${a4.pnl.toFixed(1).padStart(7)}u  ${d >= 0 ? '+' : ''}${d.toFixed(1)}u`);
  }
  push('```');

  push('');
  push('## 6. Read');
  push('Cuts eating native TOP are a different question from “should we bump 3u.”');
  push('A bump only pays if the 3u slice wins often enough that the extra 1u is +EV after juice.');

  const artifactDir = '/opt/cursor/artifacts';
  try { mkdirSync(artifactDir, { recursive: true }); } catch { /* ok */ }
  const text = out.join('\n');
  writeFileSync(`${artifactDir}/top_vs_strong_slice.md`, `${text}\n`);
  writeFileSync(`${artifactDir}/top_vs_strong_slice.json`, JSON.stringify({
    generatedAt: new Date().toISOString(),
    top: fmt(top),
    strong: fmt(strong),
    ateTopByCut: Object.fromEntries([...byCut.entries()].map(([k, rs]) => [k, fmt(rs, cf)])),
  }, null, 2));
  console.log('\nWrote /opt/cursor/artifacts/top_vs_strong_slice.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
