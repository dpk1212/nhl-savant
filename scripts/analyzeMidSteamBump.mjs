/**
 * Can we bump steam-aligned 2–3u tickets to 4–5u?
 *
 *   node scripts/analyzeMidSteamBump.mjs
 *
 * Universe: LIVE native 2–3u (finalUnits in [1.25, 3.5) = Policy T mid band).
 * Arriving floors (1u→2u) are listed separately — they are already a T bump.
 * Tickets tape already sent to 4u+ are not “2–3u plays.”
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { enrichTicketTapeFromSide } from '../src/lib/ticketTapeCapture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];

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
function agg(rows, uKey = 'u', pKey = 'pnl') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  const days = new Set();
  const sports = {};
  for (const r of rows) {
    n++;
    stake += r[uKey] || 0;
    pnl += Number.isFinite(r[pKey]) ? r[pKey] : 0;
    if (r.won === 1) w++; else l++;
    if (r.date) days.add(r.date);
    sports[r.sport] = (sports[r.sport] || 0) + 1;
  }
  const wr = n ? w / n : null;
  const ci = wilson(w, n);
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wrPct: wr != null ? +(wr * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    days: days.size,
    sports,
    perDay: days.size ? +(n / days.size).toFixed(2) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wrPct == null ? '—' : `${a.wrPct}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}-${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function sourceFlags(rec) {
  if (!rec) return { a: false, b: false };
  const tier = String(rec.whitelistTier || '').toUpperCase();
  const src = String(rec.whitelistSource || '').toUpperCase();
  const picksN = Number(rec.picks?.n) || 0;
  const posN = Number(rec.positions?.n) || 0;
  const a = src.includes('A') || (picksN >= 2 && src === '' && tier === 'CONFIRMED');
  const b = src.includes('B') || (posN >= 4 && src === '' && tier === 'CONFIRMED');
  return { a: tier === 'CONFIRMED' && a, b: tier === 'CONFIRMED' && b };
}

const profiles = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8')).profiles
  || JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
function profileOf(short, sport) {
  const p = profiles[short] || profiles[String(short || '').toLowerCase()];
  if (!p) return null;
  return p.bySport?.[sport] || null;
}

console.error('fetch…');
const packs = await Promise.all(COLS.map(async ([col, mkt]) => ({ mkt, docs: await listCollection(col) })));

const rows = [];
for (const { mkt, docs } of packs) {
  for (const data of docs) {
    if (!data.sides) continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if ((sd.status || data.status) !== 'COMPLETED') continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const res = sd.result || {};
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won == null) continue;
      if (res.tracked === true) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const uFinal = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const pnlFinal = Number.isFinite(res.profit) ? res.profit : americanProfit(won, uFinal, odds);
      const preSteam = Number(sd.v8_unitsPreSteamTail);
      const uPre = (Number.isFinite(preSteam) && preSteam > 0 ? preSteam : null)
        ?? (Number.isFinite(Number(sd.v8_unitsPreTape)) && Number(sd.v8_unitsPreTape) > 0 ? Number(sd.v8_unitsPreTape) : null)
        ?? (uFinal > 0 ? uFinal : 0);
      const tape = enrichTicketTapeFromSide(sd);
      const steamOn = !!tape.ticketTape?.steamOnLock;
      const steamOnFirst = !!tape.ticketTape?.steamOnFirst;
      const arriving = !steamOnFirst && steamOn;
      const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || [])
        .filter((w) => w && w.wallet && w.side);
      const sport = data.sport || 'NHL';
      let forA = 0; let forB = 0;
      const seen = new Set();
      for (const w of wd) {
        if (w.side !== sideKey) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        const f = sourceFlags(profileOf(short, sport));
        if (f.a) forA++;
        if (f.b) forB++;
      }
      const sharpAB = forA + forB > 0;
      rows.push({
        date: data.date,
        sport,
        mkt,
        team: sd.team || sideKey,
        path: sd.v8_hcStakeTier || null,
        won,
        odds,
        u: uFinal,
        pnl: pnlFinal,
        uPre,
        live: uFinal > 0,
        mutedBy: sd.mutedBy || null,
        steamAction: sd.v8_steamTailAction || null,
        tapeAction: sd.v8_tapeAction || null,
        steamOn,
        arriving,
        already: steamOnFirst && steamOn,
        hasLog: (tape.ticketTape?.n || 0) > 0,
        sharpAB,
        abArr: sharpAB && arriving,
        abSteam: sharpAB && steamOn,
      });
    }
  }
}

/** Policy T mid band: steamTailBand `x < 3.5`. */
const isLiveMid = (r) => r.u >= 1.25 && r.u < 3.5;
const juiceBucket = (odds) => {
  if (!(odds < 0)) return 'plus';
  if (odds > -131) return 'fair';
  if (odds > -201) return 'moderate';
  return 'juice';
};
const nativeLive = rows.filter((r) => r.live && isLiveMid(r) && r.steamAction !== 'FLOOR');
const floors = rows.filter((r) => r.live && r.steamAction === 'FLOOR');
const leakedFat = rows.filter((r) => r.live && r.u >= 3.5 && r.uPre >= 1.25 && r.uPre < 3.5);

function win(rs, lo, hi) {
  return rs.filter((r) => r.date >= lo && r.date <= hi);
}
const DISC = ['2026-08-19', '2026-08-30'];
const HOLD = ['2026-08-31', '2099-01-01'];
const ALLS = ['2026-08-19', '2099-01-01'];
const PRE = ['2026-06-01', '2026-08-18'];

function bump(rows, target) {
  return rows.map((r) => {
    const nu = typeof target === 'function' ? target(r) : Math.max(r.u, target);
    const scale = r.u > 0 ? nu / r.u : 1;
    return { ...r, uB: nu, pnlB: r.pnl * scale, extraU: nu - r.u, extraPnl: r.pnl * (scale - 1) };
  });
}
function bumpAgg(rows, target) {
  const b = bump(rows, target);
  const base = agg(rows);
  const next = agg(b, 'uB', 'pnlB');
  const extraStake = b.reduce((s, r) => s + r.extraU, 0);
  const extraPnl = b.reduce((s, r) => s + r.extraPnl, 0);
  return {
    base, next,
    extraStake: +extraStake.toFixed(2),
    extraPnl: +extraPnl.toFixed(2),
    extraRoi: extraStake > 0 ? +((extraPnl / extraStake) * 100).toFixed(1) : null,
  };
}

const out = [];
const push = (s = '') => { out.push(s); console.log(s); };
const cell = (label, rs) => push(`${label.padEnd(48)} ${fmt(agg(rs))}`);

push(`2–3u steam bump study  ·  ${new Date().toISOString()}`);
push('Native 2–3u = LIVE finalUnits in [1.25, 3.5) = Policy T mid band, not arriving-floor.');
push('Bump CF scales PnL linearly with units (same W/L, same odds). Cell WR does not change — extra stake × extra variance.');
push('Juice: plus / fair (>-131) / moderate (−131 to −200) / juice (< −200).');
push('');

push('=== Universe ===');
cell('Native 2–3u live ALL V12', nativeLive);
cell('Native 2–3u live Jun1–Aug18 (no steam stamps)', win(nativeLive, ...PRE));
cell('Native 2–3u live DISC Aug19–30', win(nativeLive, ...DISC));
cell('Native 2–3u live HOLD Aug31+', win(nativeLive, ...HOLD));
cell('Native 2–3u live STEAM ERA Aug19+', win(nativeLive, ...ALLS));
cell('Arriving floors 1u→2u (already a T bump)', floors);
cell('Tape-boosted out of mid (preTape 2–3u, live ≥3.5u) — NOT bump candidates', leakedFat);
cell('  ↳ of those, A/B steam at lock', leakedFat.filter((r) => r.abSteam));
cell('  ↳ of those, A/B arriving', leakedFat.filter((r) => r.abArr));
cell('  ↳ of those, no steam', leakedFat.filter((r) => !r.steamOn));
push('');

function steamSplit(label, rs) {
  push(`-- ${label} n=${rs.length} --`);
  cell('all native 2–3u', rs);
  cell('A/B + arriving', rs.filter((r) => r.abArr));
  cell('A/B + steam at lock (includes arriving)', rs.filter((r) => r.abSteam));
  cell('A/B + already-on (on→on)', rs.filter((r) => r.abSteam && r.already));
  cell('A/B + no steam', rs.filter((r) => r.sharpAB && !r.steamOn));
  cell('steam on, no A/B', rs.filter((r) => r.steamOn && !r.sharpAB));
  cell('no steam at lock', rs.filter((r) => !r.steamOn));
  cell('has tape log', rs.filter((r) => r.hasLog));
  cell('no tape log', rs.filter((r) => !r.hasLog));
}

steamSplit('DISC Aug 19–30', win(nativeLive, ...DISC));
push('');
steamSplit('HOLD Aug 31+', win(nativeLive, ...HOLD));
push('');
steamSplit('STEAM ERA Aug 19+', win(nativeLive, ...ALLS));
push('');

const era = win(nativeLive, ...ALLS);
const candArr = era.filter((r) => r.abArr);
const candSteam = era.filter((r) => r.abSteam);
const candAlready = era.filter((r) => r.abSteam && r.already);

push('=== Enough-data bars (from our own T paper) ===');
push('A/B arriving ANY size was n=24, Wilson lo 55%, +48% ROI — paper said DO NOT SIZE, paint only.');
push('A/B steam-at-lock ANY size was n=45, Wilson lo 50%, both halves n≥21 — paper said HOLDS, still not a new ladder.');
push('The one bump we shipped: arriving 1u→2u, n=13 of 9-4, because rest of 1u was −21%.');
push('');
function enough(name, rs) {
  const a = agg(rs);
  const lo = a.wrLo;
  const bars = [];
  bars.push(a.n >= 20 ? 'n≥20' : `n=${a.n}<20`);
  bars.push(lo != null && lo >= 50 ? `Wilson lo ${lo}≥50` : `Wilson lo ${lo}<50`);
  const discN = win(rs, ...DISC).length;
  const holdN = win(rs, ...HOLD).length;
  bars.push(discN >= 8 && holdN >= 8 ? `both halves ${discN}/${holdN}` : `halves ${discN}/${holdN} thin`);
  const sports = Object.keys(a.sports || {});
  bars.push(sports.length >= 2 ? `sports ${sports.join(',')}` : `sports ${sports.join(',') || '—'}`);
  push(`${name.padEnd(40)} ${fmt(a)}`);
  push(`  ${bars.join(' · ')}`);
}
enough('2–3u A/B arriving', candArr);
enough('2–3u A/B steam at lock', candSteam);
enough('2–3u A/B already-on', candAlready);
enough('2–3u no steam (control)', era.filter((r) => !r.steamOn));
push('');
push(`Arriving 2–3u rate: ${candArr.length} tickets / ${new Set(era.map((r) => r.date)).size} steam-era days ≈ ${(candArr.length / Math.max(1, new Set(era.map((r) => r.date)).size)).toFixed(2)}/day.`);
push('Paper still refused to size arriving at n=24 any-size. At this rate, 2–3u arriving hits n=24 in ~28 more days, n=20 in ~20 more days.');
push('');

push('=== Ticket list: 2–3u A/B steam at lock (the T-compatible bump set) ===');
push('T-compatible = already A/B + steam ON, so a 4u bump is NOT unconfirmed_4u.');
push('Bumping 2–3u WITHOUT A/B steam to 4u would be muted by T as unconfirmed_4u. Dead on arrival.');
for (const r of candSteam.slice().sort((a, b) => a.date.localeCompare(b.date))) {
  const tag = r.abArr ? 'ARRIVING' : (r.already ? 'ALREADY' : 'STEAM');
  const j = juiceBucket(r.odds);
  push(`  ${r.date} ${r.sport} ${r.mkt.padEnd(6)} ${(r.team || '').slice(0, 22).padEnd(22)} ${String(r.u).padStart(4)}u  ${r.path || '-'}  ${r.won ? 'W' : 'L'} ${(r.pnl >= 0 ? '+' : '') + r.pnl.toFixed(2)}  ${tag}  ${r.odds}  ${j}`);
}
push('');

push('=== Bump CFs on STEAM-ERA native 2–3u (Aug 19+) ===');
push('extra ROI = PnL on the *incremental* units only.');
function showBump(name, rs, target) {
  const x = bumpAgg(rs, target);
  const tgt = typeof target === 'function' ? 'fn' : target;
  push(`${name} → ${tgt}`);
  push(`  now    ${fmt(x.base)}`);
  push(`  bumped ${fmt(x.next)}`);
  push(`  extra stake ${x.extraStake >= 0 ? '+' : ''}${x.extraStake}u  extra PnL ${x.extraPnl >= 0 ? '+' : ''}${x.extraPnl}u  extra ROI ${x.extraRoi == null ? '—' : (x.extraRoi >= 0 ? '+' : '') + x.extraRoi + '%'}`);
}
showBump('A/B arriving', candArr, 4);
showBump('A/B arriving', candArr, 5);
showBump('A/B arriving', candArr, (r) => Math.min(5, r.u + 1));
showBump('A/B steam at lock', candSteam, 4);
showBump('A/B steam at lock', candSteam, 5);
showBump('A/B steam at lock', candSteam, (r) => Math.min(5, r.u + 1));
showBump('A/B steam ×1.35 (tape-boost analog, cap 5)', candSteam, (r) => Math.min(5, +(r.u * 1.35).toFixed(2)));
push('');
push('Split bump-to-4u by window (does it hold both halves?):');
showBump('DISC A/B steam →4u', win(candSteam, ...DISC), 4);
showBump('HOLD A/B steam →4u', win(candSteam, ...HOLD), 4);
showBump('DISC A/B arriving →4u', win(candArr, ...DISC), 4);
showBump('HOLD A/B arriving →4u', win(candArr, ...HOLD), 4);
push('');

push('=== Control: bumping 2–3u with NO steam to 4u (T would mute these) ===');
showBump('no steam 2–3u →4u (illegal under T)', era.filter((r) => !r.steamOn), 4);
push('');

const candFairSteam = candSteam.filter((r) => juiceBucket(r.odds) !== 'juice');
const candFairArr = candArr.filter((r) => juiceBucket(r.odds) !== 'juice');
push('=== Juice-stripped (drop odds < −200) — juice wins pay pennies on extra units ===');
showBump('A/B steam, no juice →4u', candFairSteam, 4);
showBump('A/B arriving, no juice →4u', candFairArr, 4);
push('');
push('=== Least-wrong experiment: A/B arriving + not juice → +1u cap 4 ===');
showBump('arriving, no juice, +1u cap 4', candFairArr, (r) => Math.min(4, r.u + 1));
push('');

push('=== Extra loss cost (losers only) ===');
function lossCost(rs, target) {
  const losers = rs.filter((r) => r.won === 0);
  const now = losers.reduce((s, r) => s + r.u, 0);
  const nxt = losers.reduce((s, r) => s + Math.max(r.u, target), 0);
  push(`  n=${losers.length} losers  stake now ${now.toFixed(1)}u  at ${target}u → ${nxt.toFixed(1)}u  extra heat ${(-(nxt - now)).toFixed(1)}u if they all lose again`);
}
push('A/B steam at lock losers:');
lossCost(candSteam, 4);
lossCost(candSteam, 5);
push('A/B arriving losers:');
lossCost(candArr, 4);
push('');

push('=== Juice mix on A/B steam 2–3u ===');
const byJ = {};
for (const r of candSteam) {
  const k = juiceBucket(r.odds);
  byJ[k] = byJ[k] || [];
  byJ[k].push(r);
}
for (const k of ['plus', 'fair', 'moderate', 'juice']) {
  if (byJ[k]) cell(k, byJ[k]);
}
push('');

push('=== Sport mix on A/B steam 2–3u ===');
const bySport = {};
for (const r of candSteam) {
  bySport[r.sport] = bySport[r.sport] || [];
  bySport[r.sport].push(r);
}
for (const [s, rs] of Object.entries(bySport).sort((a, b) => b[1].length - a[1].length)) {
  cell(s, rs);
}
push('');
push('=== Path mix on A/B steam 2–3u ===');
const byPath = {};
for (const r of candSteam) {
  const k = r.path || '(none)';
  byPath[k] = byPath[k] || [];
  byPath[k].push(r);
}
for (const [s, rs] of Object.entries(byPath).sort((a, b) => b[1].length - a[1].length)) {
  cell(s, rs);
}
push('');
push('=== Current size inside the candidate set ===');
const byU = {};
for (const r of candSteam) {
  const k = String(r.u);
  byU[k] = byU[k] || [];
  byU[k].push(r);
}
for (const k of Object.keys(byU).sort((a, b) => Number(a) - Number(b))) cell(`${k}u now`, byU[k]);

push('');
push('=== Book-level: T as-is vs T + bump A/B-steam 2–3u to 4u (HOLD window live book) ===');
const holdLive = rows.filter((r) => r.live && r.date >= '2026-08-31');
const holdBase = agg(holdLive);
const holdBumped = holdLive.map((r) => {
  if (isLiveMid(r) && r.steamAction !== 'FLOOR' && r.abSteam) {
    const nu = Math.max(r.u, 4);
    const scale = r.u > 0 ? nu / r.u : 1;
    return { ...r, u: nu, pnl: r.pnl * scale };
  }
  return r;
});
push(`HOLD live as shipped     ${fmt(holdBase)}`);
push(`HOLD + 2–3u A/B steam→4u ${fmt(agg(holdBumped))}`);
push(`Δ PnL ${(agg(holdBumped).pnl - holdBase.pnl).toFixed(2)}u  Δ stake ${(agg(holdBumped).stake - holdBase.stake).toFixed(2)}u`);

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/mid_steam_bump.md', out.join('\n'));
writeFileSync('/opt/cursor/artifacts/mid_steam_bump.json', JSON.stringify({
  generatedAt: new Date().toISOString(),
  nNative: nativeLive.length,
  candArr: agg(candArr),
  candSteam: agg(candSteam),
  candAlready: agg(candAlready),
  bumpArr4: bumpAgg(candArr, 4),
  bumpSteam5: bumpAgg(candSteam, 5),
  bumpSteam4: bumpAgg(candSteam, 4),
  bumpFairArr4: bumpAgg(candFairArr, 4),
  bumpFairSteam4: bumpAgg(candFairSteam, 4),
  leakedFat: agg(leakedFat),
  tickets: candSteam.map((r) => ({
    date: r.date, sport: r.sport, mkt: r.mkt, team: r.team, u: r.u, path: r.path,
    won: r.won, pnl: r.pnl, odds: r.odds, juice: juiceBucket(r.odds),
    arriving: r.abArr, already: r.already,
  })),
}, null, 2));
console.error('wrote artifacts');
