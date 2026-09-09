/**
 * Steam-era pattern mine — doubled sample vs the August paper.
 *
 *   node scripts/analyzeSteamLeverage.mjs
 *
 * Universe: AGS-U COMPLETED WIN/LOSS Aug 19+ (live + every mute).
 * Discovery 08-19–08-30 (the paper). Hold-up 08-31+.
 * Hunt: undersized 2–3u slices, steam-saveable mutes, leftover size/mute
 * overlays that ignore steam.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { enrichTicketTapeFromSide, steamGoldLockLabel } from '../src/lib/ticketTapeCapture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nhl-savant';
const COLS = [
  ['sharpFlowPicks', 'ML'],
  ['sharpFlowSpreads', 'SPREAD'],
  ['sharpFlowTotals', 'TOTAL'],
];
const DISC_LO = '2026-08-19';
const DISC_HI = '2026-08-30';
const HOLD_LO = '2026-08-31';

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
function unitBand(u) {
  const x = Number(u) || 0;
  if (x <= 0) return '0u';
  if (x < 1.25) return '≤1u';
  if (x < 3.5) return '2–3u';
  if (x < 4.75) return '4u';
  if (x < 5.35) return '5u';
  if (x < 5.9) return '5.4u';
  return '6u';
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
function juiceBucket(odds) {
  if (!(odds < 0)) return 'plus';
  if (odds > -131) return 'fair';
  if (odds > -201) return 'moderate';
  if (odds > -376) return 'heavy';
  return 'juice375';
}
function agg(rows, uKey = 'uLive', pKey = 'pnlLive') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  const days = new Set();
  const sports = {};
  for (const r of rows) {
    if (r.won == null) continue;
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

const rawProfiles = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
const profiles = rawProfiles.profiles || rawProfiles;
function profileOf(short, sport) {
  const p = profiles[short] || profiles[String(short || '').toLowerCase()];
  if (!p) return null;
  return p.bySport?.[sport] || p.bySport?.[String(sport || '').toUpperCase()] || null;
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
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const uLive = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const tracked = res.tracked === true || uLive === 0;
      const isLive = !tracked && uLive > 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const pnlLive = uLive > 0
        ? (Number.isFinite(res.profit) ? res.profit : americanProfit(won, uLive, odds))
        : 0;
      const preSteam = Number(sd.v8_unitsPreSteamTail);
      const preClimate = Number(sd.v8_unitsPreClimate);
      const preUnlock = Number(sd.v8_unitsPreSportUnlock);
      const preTape = Number(sd.v8_unitsPreTape);
      const preQ = Number(sd.v8_unitsPreQConv);
      let uPre = (Number.isFinite(preSteam) && preSteam > 0 ? preSteam : null)
        ?? (Number.isFinite(preQ) && preQ > 0 ? preQ : null)
        ?? (Number.isFinite(preTape) && preTape > 0 ? preTape : null)
        ?? (uLive > 0 ? uLive : 0);
      if (!isLive && !(uPre > 0)) uPre = 1;
      const uClimate = Number.isFinite(preClimate) && preClimate > 0 ? preClimate : null;
      const uUnlock = Number.isFinite(preUnlock) && preUnlock > 0 ? preUnlock : null;
      const pnlPre = americanProfit(won, uPre, odds);
      const tape = enrichTicketTapeFromSide(sd);
      const goldLabel = steamGoldLockLabel(tape.ticketTape, tape.steam);
      const steamOn = !!tape.ticketTape?.steamOnLock;
      const steamOnFirst = !!tape.ticketTape?.steamOnFirst;
      const arriving = !steamOnFirst && steamOn;
      const already = steamOnFirst && steamOn;
      const dying = steamOnFirst && !steamOn;
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
      const climateHalf = sd.v8_climateAction === 'HALF';
      const unlockCap = sd.v8_sportUnlockAction === 'CAP';
      const restored = Math.max(uLive, uPre || 0, uClimate || 0, uUnlock || 0);
      rows.push({
        date: data.date,
        sport,
        mkt,
        team: sd.team || sideKey,
        path: sd.v8_hcStakeTier || null,
        won,
        odds,
        juice: juiceBucket(odds),
        uLive,
        pnlLive,
        uPre: uPre || 0,
        pnlPre,
        uClimate,
        uUnlock,
        restored,
        pnlRestored: americanProfit(won, restored, odds),
        live: isLive,
        mutedBy: sd.mutedBy || null,
        steamAction: sd.v8_steamTailAction || null,
        steamReason: sd.v8_steamTailReason || null,
        tapeAction: sd.v8_tapeAction || null,
        tapeScore: Number.isFinite(sd.v8_tapeScore) ? sd.v8_tapeScore : null,
        climateHalf,
        climateColor: sd.v8_climateColor || null,
        unlockCap,
        favJuiceAction: sd.v8_favJuiceAction || null,
        steamOn,
        arriving,
        already,
        dying,
        hasLog: (tape.ticketTape?.n || 0) > 0,
        goldLabel,
        gold: goldLabel === 'gold+limits' || goldLabel === 'gold-flat' || goldLabel === 'gold',
        goldConfirmed: goldLabel === 'gold+limits',
        limitsOnly: goldLabel === 'limits-only',
        sharpAB,
        abArr: sharpAB && arriving,
        abSteam: sharpAB && steamOn,
        bandLive: unitBand(uLive),
        bandPre: unitBand(uPre || 0),
        lastHour: Number.isFinite(tape.ticketTape?.lastHourLock) ? tape.ticketTape.lastHourLock : null,
        dEv: Number.isFinite(tape.ticketTape?.dEvFirstToLock) ? tape.ticketTape.dEvFirstToLock : null,
        evLock: Number.isFinite(tape.ticketTape?.evLock) ? tape.ticketTape.evLock : null,
      });
    }
  }
}

const win = (rs, lo, hi) => rs.filter((r) => r.date >= lo && r.date <= hi);
const era = rows.filter((r) => r.date >= DISC_LO);
const disc = win(era, DISC_LO, DISC_HI);
const hold = win(era, HOLD_LO, '2099-01-01');
const live = (rs) => rs.filter((r) => r.live);
const muted = (rs) => rs.filter((r) => !r.live);
const log = (rs) => rs.filter((r) => r.hasLog);
const midLive = (rs) => live(rs).filter((r) => r.bandLive === '2–3u' && r.steamAction !== 'FLOOR');
const bump4 = (rs) => {
  let extraStake = 0; let extraPnl = 0;
  for (const r of rs) {
    if (!(r.uLive > 0) || r.uLive >= 4) continue;
    const nu = 4;
    const scale = nu / r.uLive;
    extraStake += nu - r.uLive;
    extraPnl += r.pnlLive * (scale - 1);
  }
  return { extraStake: +extraStake.toFixed(2), extraPnl: +extraPnl.toFixed(2) };
};

const out = [];
const push = (s = '') => { out.push(s); console.log(s); };
const cell = (label, rs, keys) => {
  const a = agg(rs, keys?.u || 'uLive', keys?.p || 'pnlLive');
  push(`${label.padEnd(56)} ${fmt(a)}`);
  return a;
};
function bars(rs) {
  const a = agg(rs);
  const d = win(rs, DISC_LO, DISC_HI).length;
  const h = win(rs, HOLD_LO, '2099-01-01').length;
  const sports = Object.keys(a.sports || {});
  const bits = [
    a.n >= 20 ? 'n≥20' : `n=${a.n}<20`,
    a.wrLo != null && a.wrLo >= 50 ? `Wlo ${a.wrLo}≥50` : `Wlo ${a.wrLo}<50`,
    d >= 8 && h >= 8 ? `halves ${d}/${h}` : `halves ${d}/${h} thin`,
    sports.length >= 2 ? `sports ${sports.join(',')}` : `sports ${sports.join(',') || '—'}`,
  ];
  return bits.join(' · ');
}
function score(name, rs, kind) {
  const a = agg(rs, kind === 'mute' ? 'uPre' : 'uLive', kind === 'mute' ? 'pnlPre' : 'pnlLive');
  const d = win(rs, DISC_LO, DISC_HI);
  const h = win(rs, HOLD_LO, '2099-01-01');
  const da = agg(d, kind === 'mute' ? 'uPre' : 'uLive', kind === 'mute' ? 'pnlPre' : 'pnlLive');
  const ha = agg(h, kind === 'mute' ? 'uPre' : 'uLive', kind === 'mute' ? 'pnlPre' : 'pnlLive');
  const sports = Object.keys(a.sports || {});
  const shipN = a.n >= 20;
  const shipW = a.wrLo != null && a.wrLo >= 50;
  const shipH = d.length >= 8 && h.length >= 8;
  const shipS = sports.length >= 2;
  let bothPos = da.n >= 5 && ha.n >= 5 && da.pnl > 0 && ha.pnl > 0;
  let verdict = 'thin';
  if (a.n < 8) verdict = 'n too small';
  else if (!shipW && a.wrLo != null && a.wrLo < 45) verdict = 'Wilson too low';
  else if (kind === 'mute' && a.pnl <= 0) verdict = 'mute saved money — keep';
  else if (shipN && shipW && shipH && shipS && bothPos) verdict = 'PROCESS BAR — still paint/watch, not auto-ship';
  else if (bothPos && a.n >= 12 && a.roi != null && a.roi >= 20) verdict = 'WATCH — direction holds both halves';
  else if (a.n >= 12 && a.roi != null && a.roi >= 25 && !shipH) verdict = 'HOT sample — need the other half';
  else verdict = 'noted';
  return { name, kind, a, da, ha, sports, verdict, bothPos, bars: bars(rs) };
}

push(`Steam leverage mine  ·  ${new Date().toISOString()}`);
push('Steam era Aug 19 – now. Discovery = paper window. Hold-up = T live.');
push('Mute CFs priced at pre-policy units. Live stats at shipped units.');
push('');

push('=== 0. How much more data vs the August paper ===');
cell('Paper tape-log live (Aug 19–30)', log(live(disc)));
cell('Hold-up tape-log live (Aug 31+)', log(live(hold)));
cell('Combined tape-log live Aug 19+', log(live(era)));
cell('Combined ALL live Aug 19+ (log or not)', live(era));
cell('Combined muted graded Aug 19+', muted(era));
cell('Hold-up muted graded', muted(hold));
push(`Tape-log live n: paper ${log(live(disc)).length} → combined ${log(live(era)).length}  (${(log(live(era)).length / Math.max(1, log(live(disc)).length)).toFixed(2)}×)`);
push('');

push('=== 1. Known steam cells on the doubled tape-log live book ===');
const tlog = log(live(era));
cell('tape-log live', tlog);
cell('A/B arriving', tlog.filter((r) => r.abArr));
cell('A/B steam at lock', tlog.filter((r) => r.abSteam));
cell('A/B already-on', tlog.filter((r) => r.abSteam && r.already));
cell('A/B no steam', tlog.filter((r) => r.sharpAB && !r.steamOn));
cell('steam, no A/B', tlog.filter((r) => r.steamOn && !r.sharpAB));
cell('gold+limits', tlog.filter((r) => r.goldConfirmed));
cell('any gold', tlog.filter((r) => r.gold));
cell('limits-only', tlog.filter((r) => r.limitsOnly));
cell('steam dying on→off', tlog.filter((r) => r.dying));
cell('A/B + dying', tlog.filter((r) => r.sharpAB && r.dying));
push('');

push('=== 2. STEAM-SAVE: muted tickets × steam (CF at pre-policy u) ===');
push('Positive CF = left on the table. Negative = mute earned its keep.');
const M = muted(era);
const Mh = muted(hold);
const Md = muted(disc);
function muteBlock(label, rs) {
  push(`-- ${label} n=${rs.length} --`);
  cell('all (CF pre u)', rs, { u: 'uPre', p: 'pnlPre' });
  cell('  A/B arriving', rs.filter((r) => r.abArr), { u: 'uPre', p: 'pnlPre' });
  cell('  A/B steam at lock', rs.filter((r) => r.abSteam), { u: 'uPre', p: 'pnlPre' });
  cell('  A/B already-on', rs.filter((r) => r.abSteam && r.already), { u: 'uPre', p: 'pnlPre' });
  cell('  steam, no A/B', rs.filter((r) => r.steamOn && !r.sharpAB), { u: 'uPre', p: 'pnlPre' });
  cell('  no steam', rs.filter((r) => !r.steamOn), { u: 'uPre', p: 'pnlPre' });
}
muteBlock('ALL mutes steam-era', M);
push('');
muteBlock('ALL mutes HOLD (T live)', Mh);
push('');

const byMute = {};
for (const r of M) {
  const k = r.mutedBy || '(none)';
  byMute[k] = byMute[k] || [];
  byMute[k].push(r);
}
push('-- by mutedBy, steam-era CF --');
for (const [k, rs] of Object.entries(byMute).sort((a, b) => b[1].length - a[1].length)) {
  cell(k, rs, { u: 'uPre', p: 'pnlPre' });
  const abS = rs.filter((r) => r.abSteam);
  const abA = rs.filter((r) => r.abArr);
  if (abS.length) cell(`  ↳ A/B steam`, abS, { u: 'uPre', p: 'pnlPre' });
  if (abA.length) cell(`  ↳ A/B arriving`, abA, { u: 'uPre', p: 'pnlPre' });
}
push('');

push('-- steam-tail reasons × steam (should be empty for A/B steam on 4u/fat) --');
const st = M.filter((r) => r.mutedBy === 'steam-tail');
const byR = {};
for (const r of st) {
  const k = r.steamReason || '(none)';
  byR[k] = byR[k] || [];
  byR[k].push(r);
}
for (const [k, rs] of Object.entries(byR).sort((a, b) => b[1].length - a[1].length)) {
  cell(k, rs, { u: 'uPre', p: 'pnlPre' });
  cell(`  ↳ A/B steam (bug if 4u/fat)`, rs.filter((r) => r.abSteam), { u: 'uPre', p: 'pnlPre' });
  cell(`  ↳ A/B already-on (1u floor candidate?)`, rs.filter((r) => r.abSteam && r.already), { u: 'uPre', p: 'pnlPre' });
  cell(`  ↳ gold / limits`, rs.filter((r) => r.gold || r.limitsOnly), { u: 'uPre', p: 'pnlPre' });
}
push('');

push('=== 3. 1u already-on A/B — the floor we did NOT ship ===');
push('T floors arriving 1u→2u. Already-on 1u still dies. Doubled sample:');
const leanMuted = st.filter((r) => r.steamReason === 'lean_no_arriving');
cell('lean_no_arriving all', leanMuted, { u: 'uPre', p: 'pnlPre' });
cell('  A/B already-on (would-be extra floor)', leanMuted.filter((r) => r.abSteam && r.already), { u: 'uPre', p: 'pnlPre' });
cell('  A/B steam any (incl arriving — should be rare)', leanMuted.filter((r) => r.abSteam), { u: 'uPre', p: 'pnlPre' });
cell('  gold or limits-only', leanMuted.filter((r) => r.gold || r.limitsOnly), { u: 'uPre', p: 'pnlPre' });
cell('  no steam', leanMuted.filter((r) => !r.steamOn), { u: 'uPre', p: 'pnlPre' });
push('If we floored already-on 1u to 2u (CF = 2× pre PnL when pre≈1):');
{
  const cand = leanMuted.filter((r) => r.abSteam && r.already);
  const floored = cand.map((r) => {
    const u = Math.max(2, r.uPre);
    return { ...r, uF: u, pnlF: americanProfit(r.won, u, r.odds) };
  });
  cell('  CF at 2u floor', floored, { u: 'uF', p: 'pnlF' });
}
push('');

push('=== 4. Undersized 2–3u slices (LIVE native mid, not floors) ===');
const mid = midLive(era);
cell('all native 2–3u steam-era', mid);
push(`  ${bars(mid)}`);
push('');
const slices = [
  ['A/B arriving', (r) => r.abArr],
  ['A/B steam at lock', (r) => r.abSteam],
  ['A/B already-on', (r) => r.abSteam && r.already],
  ['A/B no steam', (r) => r.sharpAB && !r.steamOn],
  ['plus money', (r) => r.juice === 'plus'],
  ['plus + A/B steam', (r) => r.juice === 'plus' && r.abSteam],
  ['plus + A/B arriving', (r) => r.juice === 'plus' && r.abArr],
  ['fair juice (>-131)', (r) => r.juice === 'fair' || r.juice === 'plus'],
  ['heavy/juice <-200', (r) => r.juice === 'heavy' || r.juice === 'juice375'],
  ['ML', (r) => r.mkt === 'ML'],
  ['TOTAL', (r) => r.mkt === 'TOTAL'],
  ['SPREAD', (r) => r.mkt === 'SPREAD'],
  ['TOTAL + A/B steam', (r) => r.mkt === 'TOTAL' && r.abSteam],
  ['TOTAL + A/B arriving', (r) => r.mkt === 'TOTAL' && r.abArr],
  ['ML + A/B arriving', (r) => r.mkt === 'ML' && r.abArr],
  ['MLB', (r) => r.sport === 'MLB'],
  ['MLB TOTAL', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL'],
  ['MLB TOTAL + A/B arriving', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL' && r.abArr],
  ['MLB TOTAL + A/B steam', (r) => r.sport === 'MLB' && r.mkt === 'TOTAL' && r.abSteam],
  ['CONFIRMED-Q1', (r) => r.path === 'CONFIRMED-Q1'],
  ['CONFIRMED-Q1 + A/B steam', (r) => r.path === 'CONFIRMED-Q1' && r.abSteam],
  ['RANK', (r) => r.path === 'RANK'],
  ['RANK + A/B steam', (r) => r.path === 'RANK' && r.abSteam],
  ['MINI / TOP / SUPER', (r) => ['MINI', 'MINI-', 'TOP', 'TOP+', 'SUPER'].includes(r.path)],
  ['SHARP*', (r) => String(r.path || '').startsWith('SHARP')],
  ['tape BOOST', (r) => r.tapeAction === 'BOOST'],
  ['tape HOLD', (r) => r.tapeAction === 'HOLD'],
  ['tape MUTE (Q1 exempt shipped)', (r) => r.tapeAction === 'MUTE'],
  ['climate HALF (looks mid, was fatter)', (r) => r.climateHalf],
  ['climate HALF + A/B steam', (r) => r.climateHalf && r.abSteam],
  ['sport unlock CAP', (r) => r.unlockCap],
  ['sport unlock CAP + A/B steam', (r) => r.unlockCap && r.abSteam],
  ['gold', (r) => r.gold],
  ['limits-only', (r) => r.limitsOnly],
  ['live 2u (not 3u)', (r) => r.uLive >= 1.25 && r.uLive < 2.5],
  ['live 3u', (r) => r.uLive >= 2.5 && r.uLive < 3.5],
  ['2u + A/B arriving', (r) => r.uLive >= 1.25 && r.uLive < 2.5 && r.abArr],
  ['2u + A/B steam', (r) => r.uLive >= 1.25 && r.uLive < 2.5 && r.abSteam],
];
push('slice                                          live stats                                      extra if →4u');
for (const [name, fn] of slices) {
  const rs = mid.filter(fn);
  const a = agg(rs);
  const b = bump4(rs);
  const extra = rs.length ? `  Δu ${b.extraStake >= 0 ? '+' : ''}${b.extraStake}  Δpnl ${b.extraPnl >= 0 ? '+' : ''}${b.extraPnl}` : '';
  push(`${name.padEnd(42)} ${fmt(a)}${extra}`);
  if (rs.length >= 8) push(`  ${bars(rs)}`);
}
push('');

push('=== 5. Climate HALF sitting in live 2–3u — restore pre-climate? ===');
const halfLive = live(era).filter((r) => r.climateHalf);
cell('all climate HALF live', halfLive);
cell('  now 2–3u', halfLive.filter((r) => r.bandLive === '2–3u'));
cell('  A/B steam (T confirmed, still halved)', halfLive.filter((r) => r.abSteam));
cell('  A/B arriving', halfLive.filter((r) => r.abArr));
cell('  no steam', halfLive.filter((r) => !r.steamOn));
{
  const cand = halfLive.filter((r) => r.abSteam && r.uClimate && r.uClimate > r.uLive + 0.4);
  push(`Climate HALF + A/B steam with room to restore (preClimate > live+0.4): n=${cand.length}`);
  cell('  as shipped', cand);
  const restored = cand.map((r) => ({ ...r, uR: r.uClimate, pnlR: americanProfit(r.won, r.uClimate, r.odds) }));
  cell('  CF restore pre-climate', restored, { u: 'uR', p: 'pnlR' });
  for (const r of cand.sort((a, b) => a.date.localeCompare(b.date))) {
    push(`    ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 22).padEnd(22)} live ${r.uLive}u  preClim ${r.uClimate}u  ${r.path}  ${r.won ? 'W' : 'L'} ${r.odds}  ${r.abArr ? 'ARR' : (r.already ? 'ALR' : 'STM')}`);
  }
}
push('');

push('=== 6. Sport-unlock CAP + steam (NFL/CFB haircut) ===');
const capLive = live(era).filter((r) => r.unlockCap);
cell('unlock CAP live', capLive);
cell('  A/B steam', capLive.filter((r) => r.abSteam));
cell('  A/B arriving', capLive.filter((r) => r.abArr));
{
  const cand = capLive.filter((r) => r.abSteam && r.uUnlock && r.uUnlock > r.uLive + 0.4);
  cell('  CAP + A/B steam with room to restore', cand);
  const restored = cand.map((r) => ({ ...r, uR: r.uUnlock, pnlR: americanProfit(r.won, r.uUnlock, r.odds) }));
  cell('  CF restore pre-unlock', restored, { u: 'uR', p: 'pnlR' });
  for (const r of cand.sort((a, b) => a.date.localeCompare(b.date))) {
    push(`    ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 22).padEnd(22)} live ${r.uLive}u  preUnl ${r.uUnlock}u  ${r.path}  ${r.won ? 'W' : 'L'} ${r.odds}`);
  }
}
push('');

push('=== 7. Tape BOOST without A/B steam (August leak — did it hold?) ===');
const boost = live(era).filter((r) => r.tapeAction === 'BOOST');
cell('tape BOOST live steam-era', boost);
cell('  A/B steam', boost.filter((r) => r.abSteam));
cell('  no A/B steam', boost.filter((r) => !r.abSteam));
cell('DISC BOOST no A/B steam', live(disc).filter((r) => r.tapeAction === 'BOOST' && !r.abSteam));
cell('HOLD BOOST no A/B steam', live(hold).filter((r) => r.tapeAction === 'BOOST' && !r.abSteam));
push('');

push('=== 8. 5u always-ship — still right? ===');
const u5 = live(era).filter((r) => r.bandLive === '5u');
cell('5u live steam-era', u5);
cell('  A/B steam', u5.filter((r) => r.abSteam));
cell('  no A/B steam', u5.filter((r) => !r.abSteam));
cell('DISC 5u', live(disc).filter((r) => r.bandLive === '5u'));
cell('HOLD 5u', live(hold).filter((r) => r.bandLive === '5u'));
push('');

push('=== 9. Non-steam mutes that A/B steam would have saved ===');
push('Mutes other than steam-tail. If A/B steam printed, we left a confirmed ticket on the floor.');
const otherMutes = M.filter((r) => r.mutedBy && r.mutedBy !== 'steam-tail');
cell('non-T mutes all', otherMutes, { u: 'uPre', p: 'pnlPre' });
cell('  A/B arriving', otherMutes.filter((r) => r.abArr), { u: 'uPre', p: 'pnlPre' });
cell('  A/B steam', otherMutes.filter((r) => r.abSteam), { u: 'uPre', p: 'pnlPre' });
push('Ticket list: non-T mute + A/B steam');
for (const r of otherMutes.filter((r) => r.abSteam).sort((a, b) => a.date.localeCompare(b.date))) {
  push(`  ${r.date} ${r.sport} ${r.mkt.padEnd(6)} ${(r.team || '').slice(0, 22).padEnd(22)} pre ${String(r.uPre).padStart(4)}u  ${r.path || '-'}  ${r.won ? 'W' : 'L'} ${(r.pnlPre >= 0 ? '+' : '') + r.pnlPre.toFixed(2)}  ${r.mutedBy}  ${r.abArr ? 'ARR' : (r.already ? 'ALR' : 'STM')}  ${r.odds}`);
}
push('');

push('=== 10. Live leaks: juice 2–3u, SOC, steam dying ===');
cell('2–3u juice/heavy', mid.filter((r) => r.juice === 'heavy' || r.juice === 'juice375'));
cell('2–3u SOC', mid.filter((r) => r.sport === 'SOC'));
cell('live steam dying', live(era).filter((r) => r.dying));
cell('live A/B dying', live(era).filter((r) => r.sharpAB && r.dying));
cell('2–3u dying', mid.filter((r) => r.dying));
push('');

push('=== 11. Ranked watchlist (auto) ===');
const candidates = [];
function addCand(name, rs, kind) {
  if (!rs.length) return;
  candidates.push(score(name, rs, kind));
}
addCand('A/B arriving tape-log live', tlog.filter((r) => r.abArr), 'live');
addCand('A/B steam tape-log live', tlog.filter((r) => r.abSteam), 'live');
addCand('2–3u A/B arriving', mid.filter((r) => r.abArr), 'live');
addCand('2–3u A/B steam', mid.filter((r) => r.abSteam), 'live');
addCand('2–3u plus money', mid.filter((r) => r.juice === 'plus'), 'live');
addCand('2–3u plus + A/B steam', mid.filter((r) => r.juice === 'plus' && r.abSteam), 'live');
addCand('2–3u TOTAL + A/B arriving', mid.filter((r) => r.mkt === 'TOTAL' && r.abArr), 'live');
addCand('2–3u MLB TOTAL', mid.filter((r) => r.sport === 'MLB' && r.mkt === 'TOTAL'), 'live');
addCand('2–3u live 2u + A/B arriving', mid.filter((r) => r.uLive < 2.5 && r.abArr), 'live');
addCand('2–3u RANK', mid.filter((r) => r.path === 'RANK'), 'live');
addCand('2–3u Q1 + A/B steam', mid.filter((r) => r.path === 'CONFIRMED-Q1' && r.abSteam), 'live');
addCand('climate HALF + A/B steam live', halfLive.filter((r) => r.abSteam), 'live');
addCand('tape BOOST no A/B steam', boost.filter((r) => !r.abSteam), 'live');
addCand('5u no A/B steam', u5.filter((r) => !r.abSteam), 'live');
addCand('lean mute A/B already-on', leanMuted.filter((r) => r.abSteam && r.already), 'mute');
addCand('non-T mute + A/B steam', otherMutes.filter((r) => r.abSteam), 'mute');
addCand('non-T mute + A/B arriving', otherMutes.filter((r) => r.abArr), 'mute');
addCand('unconfirmed_fat mute', st.filter((r) => r.steamReason === 'unconfirmed_fat'), 'mute');
addCand('unconfirmed_4u mute', st.filter((r) => r.steamReason === 'unconfirmed_4u'), 'mute');
addCand('fav-juice mute', M.filter((r) => r.mutedBy === 'fav-juice'), 'mute');
addCand('ev-drift mute', M.filter((r) => r.mutedBy === 'ev-drift-edge'), 'mute');
addCand('believed-cut + A/B arriving', M.filter((r) => r.mutedBy === 'believed-cut' && r.abArr), 'mute');
addCand('fail-open-sub4 all', M.filter((r) => r.mutedBy === 'fail-open-sub4'), 'mute');
addCand('leftover + A/B arriving', M.filter((r) => (r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4') && r.abArr), 'mute');
addCand('2–3u ML', mid.filter((r) => r.mkt === 'ML'), 'live');
addCand('2–3u ML no steam', mid.filter((r) => r.mkt === 'ML' && !r.steamOn), 'live');
addCand('tape-weak mute', M.filter((r) => r.mutedBy === 'tape-weak'), 'mute');
addCand('gold+limits live', tlog.filter((r) => r.goldConfirmed), 'live');
addCand('limits-only live', tlog.filter((r) => r.limitsOnly), 'live');
addCand('steam dying live', live(era).filter((r) => r.dying), 'live');

for (const c of candidates.sort((a, b) => (b.a.n - a.a.n))) {
  push(`${c.verdict.padEnd(44)} ${c.name}`);
  push(`  ${fmt(c.a)}  [${c.kind}]`);
  push(`  disc ${fmt(c.da)}  hold ${fmt(c.ha)}`);
  push(`  ${c.bars}`);
}

push('=== 12. Detail: believed-cut / fail-open × arriving (the steam-save) ===');
{
  const bc = M.filter((r) => r.mutedBy === 'believed-cut');
  const fo = M.filter((r) => r.mutedBy === 'fail-open-sub4');
  const leftover = M.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4');
  cell('believed-cut all', bc, { u: 'uPre', p: 'pnlPre' });
  cell('  disc', win(bc, DISC_LO, DISC_HI), { u: 'uPre', p: 'pnlPre' });
  cell('  hold', win(bc, HOLD_LO, '2099-01-01'), { u: 'uPre', p: 'pnlPre' });
  cell('believed-cut + A/B arriving', bc.filter((r) => r.abArr), { u: 'uPre', p: 'pnlPre' });
  cell('  disc', win(bc.filter((r) => r.abArr), DISC_LO, DISC_HI), { u: 'uPre', p: 'pnlPre' });
  cell('  hold', win(bc.filter((r) => r.abArr), HOLD_LO, '2099-01-01'), { u: 'uPre', p: 'pnlPre' });
  cell('believed-cut + already-on', bc.filter((r) => r.abSteam && r.already), { u: 'uPre', p: 'pnlPre' });
  cell('believed-cut + no steam', bc.filter((r) => !r.steamOn), { u: 'uPre', p: 'pnlPre' });
  cell('fail-open-sub4 all', fo, { u: 'uPre', p: 'pnlPre' });
  push(`  sports ${Object.keys(agg(fo, 'uPre', 'pnlPre').sports).join(',')}`);
  cell('  disc', win(fo, DISC_LO, DISC_HI), { u: 'uPre', p: 'pnlPre' });
  cell('  hold', win(fo, HOLD_LO, '2099-01-01'), { u: 'uPre', p: 'pnlPre' });
  cell('fail-open-sub4 + A/B arriving', fo.filter((r) => r.abArr), { u: 'uPre', p: 'pnlPre' });
  cell('leftover (believed+failopen) + A/B arriving', leftover.filter((r) => r.abArr), { u: 'uPre', p: 'pnlPre' });
  cell('  disc', win(leftover.filter((r) => r.abArr), DISC_LO, DISC_HI), { u: 'uPre', p: 'pnlPre' });
  cell('  hold', win(leftover.filter((r) => r.abArr), HOLD_LO, '2099-01-01'), { u: 'uPre', p: 'pnlPre' });
  push('Tickets: believed-cut + A/B arriving');
  for (const r of bc.filter((r) => r.abArr).sort((a, b) => a.date.localeCompare(b.date))) {
    push(`  ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 28).padEnd(28)} pre ${r.uPre}u  ${r.path}  ${r.won ? 'W' : 'L'} ${r.pnlPre >= 0 ? '+' : ''}${r.pnlPre.toFixed(2)}  ${r.odds}`);
  }
  push('Tickets: fail-open-sub4 + A/B arriving');
  for (const r of fo.filter((r) => r.abArr).sort((a, b) => a.date.localeCompare(b.date))) {
    push(`  ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 28).padEnd(28)} pre ${r.uPre}u  ${r.path}  ${r.won ? 'W' : 'L'} ${r.pnlPre >= 0 ? '+' : ''}${r.pnlPre.toFixed(2)}  ${r.odds}`);
  }
}
push('');

push('=== 13. 2–3u ML (passes n/Wilson/halves — T-compatible?) ===');
{
  const ml = mid.filter((r) => r.mkt === 'ML');
  cell('2–3u ML', ml);
  cell('  disc', win(ml, DISC_LO, DISC_HI));
  cell('  hold', win(ml, HOLD_LO, '2099-01-01'));
  cell('  A/B steam (legal 4u bump)', ml.filter((r) => r.abSteam));
  cell('  A/B arriving', ml.filter((r) => r.abArr));
  cell('  no steam (4u bump would be muted)', ml.filter((r) => !r.steamOn));
  cell('  currently 2u', ml.filter((r) => r.uLive < 2.5));
  cell('  currently 3u', ml.filter((r) => r.uLive >= 2.5));
  const to3 = ml.filter((r) => r.uLive < 2.5);
  const extra3 = to3.reduce((s, r) => s + (3 - r.uLive), 0);
  const extra3p = to3.reduce((s, r) => s + r.pnlLive * ((3 / r.uLive) - 1), 0);
  push(`  floor 2u ML → 3u (stays T mid): extra stake +${extra3.toFixed(1)}u  extra PnL ${extra3p >= 0 ? '+' : ''}${extra3p.toFixed(2)}u  n=${to3.length}`);
}
push('');
mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/steam_leverage.md', out.join('\n'));
writeFileSync('/opt/cursor/artifacts/steam_leverage.json', JSON.stringify({
  generatedAt: new Date().toISOString(),
  nEra: era.length,
  nLive: live(era).length,
  nMuted: muted(era).length,
  nTapeLivePaper: log(live(disc)).length,
  nTapeLiveCombined: log(live(era)).length,
  candidates: candidates.map((c) => ({
    name: c.name, kind: c.kind, verdict: c.verdict, bars: c.bars,
    n: c.a.n, wl: `${c.a.w}-${c.a.l}`, wrLo: c.a.wrLo, roi: c.a.roi, pnl: c.a.pnl,
    discN: c.da.n, holdN: c.ha.n, discPnl: c.da.pnl, holdPnl: c.ha.pnl,
  })),
}, null, 2));
console.error('wrote artifacts');
