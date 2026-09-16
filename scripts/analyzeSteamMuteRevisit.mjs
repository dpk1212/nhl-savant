#!/usr/bin/env node
/**
 * Steam-tweak mute revisit — leftover (Aug 19) + Policy T (Aug 31) +
 * leftover×arriving HOLD / 2–3u→4u bump (Sep 9), with extra days after the
 * Sep 8 papers.
 *
 *   node scripts/analyzeSteamMuteRevisit.mjs
 *
 * Writes:
 *   /opt/cursor/artifacts/steam_mute_revisit.json
 *   /opt/cursor/artifacts/steam_mute_revisit.md
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
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

const LEFTOVER_FROM = '2026-08-19';
const T_FROM = '2026-08-31';
const SHIP_FROM = '2026-09-09'; // leftover A/B arriving HOLD + mid arriving → 4u
const DISC_HI = '2026-08-30';
const T_PRE_SHIP_HI = '2026-09-08';

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
function firstFinitePositive(...xs) {
  for (const x of xs) {
    const n = Number(x);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
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

function eraOf(date) {
  if (date < LEFTOVER_FROM) return 'pre_steam';
  if (date <= DISC_HI) return 'disc';          // leftover on, T off
  if (date <= T_PRE_SHIP_HI) return 't_pre';   // T on, leftover still kills arriving
  return 'post_ship';                           // leftover HOLD arriving + mid bump
}

/** What T would publish if leftover HOLDed this ticket (later mutes ignored). */
function tWouldShipUnits(r, { bumpLive = true } = {}) {
  const u = r.uPre;
  if (!(u > 0)) return 0;
  const abArr = !!r.abArr;
  const abSteam = !!(r.sharpAB && r.steamOn);
  if (u < 1.25) return abArr ? 2 : 0;
  if (u < 3.5) {
    if (abArr && bumpLive && r.date >= SHIP_FROM) return 4;
    return u;
  }
  if (u < 4.75) return abSteam ? u : 0;
  if (u < 5.35) return u;
  return abSteam ? u : 0;
}

function agg(rows, uKey = 'u', pKey = 'pnl') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  const days = new Set();
  for (const r of rows) {
    if (r.won == null) continue;
    n++;
    stake += Number(r[uKey]) || 0;
    pnl += Number.isFinite(Number(r[pKey])) ? Number(r[pKey]) : 0;
    if (r.won === 1) w++;
    else l++;
    if (r.date) days.add(r.date);
  }
  const ci = wilson(w, n);
  const dayN = days.size || 0;
  return {
    n, w, l,
    stake: +stake.toFixed(2),
    pnl: +pnl.toFixed(2),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    wrHi: ci ? +(ci.hi * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    days: dayN,
    perDay: dayN ? +(n / dayN).toFixed(2) : null,
    meanU: n ? +(stake / n).toFixed(2) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  const wr = a.wr == null ? '—' : `${a.wr}%`;
  const band = a.wrLo != null ? ` (${a.wrLo}–${a.wrHi})` : '';
  return `${a.n} · ${a.w}-${a.l} · ${wr}${band} · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi}`;
}
function fmtShort(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  return `${a.n} · ${a.w}-${a.l} · ${a.wr}% · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(1)}u · ${roi}`;
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
    if (!data.sides || data.date < LEFTOVER_FROM) continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const status = sd.status || data.status;
      const res = sd.result || {};
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const u = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const tracked = res.tracked === true || u === 0;
      const live = status === 'COMPLETED' && won != null && !tracked && u > 0;
      const mutedGraded = status === 'COMPLETED' && won != null && (tracked || u === 0);
      const pending = status !== 'COMPLETED' || (status === 'COMPLETED' && won == null);

      const preFlinch = Number(sd.v8_unitsPreFlinchFailOpen);
      const preSteam = Number(sd.v8_unitsPreSteamTail);
      const preQ = Number(sd.v8_unitsPreQConv);
      const preTape = Number(sd.v8_unitsPreTape);
      const preClimate = Number(sd.v8_unitsPreClimate);
      const uPre = firstFinitePositive(preFlinch, preSteam, preQ, preTape, preClimate, u > 0 ? u : null) ?? 1;
      const pnl = live ? (Number.isFinite(res.profit) ? res.profit : americanProfit(won, u, odds)) : 0;
      const pnlPre = won == null ? 0 : americanProfit(won, uPre, odds);

      const tape = enrichTicketTapeFromSide(sd);
      const steamOn = sd.v8_steamTailOnLock != null
        ? !!sd.v8_steamTailOnLock
        : !!tape.ticketTape?.steamOnLock;
      const steamOnFirst = tape.ticketTape?.n > 0
        ? !!tape.ticketTape.steamOnFirst
        : (sd.v8_steamTailArriving === true ? false : steamOn);
      const arriving = sd.v8_steamTailArriving != null
        ? !!sd.v8_steamTailArriving
        : (!steamOnFirst && steamOn);

      const sport = data.sport || 'NHL';
      let forA = 0; let forB = 0;
      const seen = new Set();
      const wd = (peak.v8Scoring?.walletDetails || lock.v8Scoring?.walletDetails || []);
      for (const w of wd) {
        if (!w || w.side !== sideKey) continue;
        const short = String(w.walletShort || w.wallet || '').slice(-6).toLowerCase();
        if (!short || seen.has(short)) continue;
        seen.add(short);
        const f = sourceFlags(profileOf(short, sport));
        if (f.a) forA++;
        if (f.b) forB++;
      }
      const reconAB = forA + forB > 0;
      const sharpAB = sd.v8_steamTailSharpAB != null ? !!sd.v8_steamTailSharpAB : reconAB;
      const abArr = !!(sharpAB && arriving);
      const alreadyOn = !!(steamOn && steamOnFirst);
      const steamCell = abArr
        ? 'ab_arriving'
        : (sharpAB && alreadyOn)
          ? 'ab_already_on'
          : (sharpAB && steamOn)
            ? 'ab_steam_on'
            : (sharpAB && !steamOn)
              ? 'ab_no_steam'
              : (steamOn ? 'steam_no_ab' : 'no_steam');

      const edge = Number.isFinite(sd.v8_winnerAlignEdge) ? sd.v8_winnerAlignEdge : null;
      const leftoverFlags = [];
      const act = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_');
      if (act === 'FAIL_OPEN') leftoverFlags.push('fail_open');
      const native4 = ['SUPER', 'TOP', 'TOP+', 'RANK'].includes(sd.v8_hcStakeTier);
      if (native4 && odds > 120) leftoverFlags.push('plus_native4');
      if (act === 'BOOST') leftoverFlags.push('tape_boost');
      if (edge != null && edge >= 10) leftoverFlags.push('edge_ge10');

      const tAtPaper = tWouldShipUnits({ date: '2026-09-01', uPre, abArr, sharpAB, steamOn }, { bumpLive: false });
      const tAtLive = tWouldShipUnits({ date: data.date, uPre, abArr, sharpAB, steamOn }, { bumpLive: true });
      const pnlTPaper = won == null ? 0 : americanProfit(won, tAtPaper, odds);
      const pnlTLive = won == null ? 0 : americanProfit(won, tAtLive, odds);

      rows.push({
        date: data.date,
        era: eraOf(data.date),
        sport,
        mkt,
        team: sd.team || sideKey,
        path: sd.v8_hcStakeTier || null,
        won,
        odds,
        u,
        pnl,
        uPre,
        pnlPre,
        live,
        mutedGraded,
        pending,
        mutedBy: sd.mutedBy || null,
        steamAction: sd.v8_steamTailAction || null,
        steamReason: sd.v8_steamTailReason || null,
        steamBand: sd.v8_steamTailBand || null,
        flinchAction: sd.v8_flinchFailOpenAction || null,
        flinchReason: sd.v8_flinchFailOpenReason || null,
        tapeAction: sd.v8_tapeAction || null,
        arriving,
        steamOn,
        steamOnFirst,
        alreadyOn,
        sharpAB,
        reconAB,
        abArr,
        steamCell,
        band: unitBand(u),
        bandPre: unitBand(uPre),
        edge,
        leftoverFlags,
        leftoverReason: leftoverFlags.join('+') || null,
        tAtPaper,
        tAtLive,
        pnlTPaper,
        pnlTLive,
      });
    }
  }
}

const graded = rows.filter((r) => r.won != null);
const win = (rs, lo, hi) => rs.filter((r) => r.date >= lo && r.date <= hi);
const era = (rs, name) => rs.filter((r) => r.era === name);
const liveOf = (rs) => rs.filter((r) => r.live);
const muteOf = (rs) => rs.filter((r) => r.mutedGraded);

const steamEra = win(graded, LEFTOVER_FROM, '2099-01-01');
const tEra = win(graded, T_FROM, '2099-01-01');
const post = era(graded, 'post_ship');
const tPre = era(graded, 't_pre');
const disc = era(graded, 'disc');
const paperWin = win(graded, LEFTOVER_FROM, T_PRE_SHIP_HI);

function muteCf(rs, uKey = 'uPre', pKey = 'pnlPre') {
  return agg(rs, uKey, pKey);
}

const leftoverMutes = (rs) => muteOf(rs).filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4');
const steamMutes = (rs) => muteOf(rs).filter((r) => r.mutedBy === 'steam-tail');
const byMuted = (rs) => {
  const m = new Map();
  for (const r of muteOf(rs)) {
    const k = r.mutedBy || '(none)';
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return [...m.entries()]
    .map(([k, v]) => ({ key: k, ...muteCf(v) }))
    .sort((a, b) => b.n - a.n);
};
const byReason = (rs) => {
  const m = new Map();
  for (const r of rs) {
    const k = r.steamReason || '(none)';
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return [...m.entries()]
    .map(([k, v]) => ({ key: k, ...muteCf(v) }))
    .sort((a, b) => b.n - a.n);
};

function ticketLine(r, extra = '') {
  const res = r.won == null ? 'PEND' : (r.won ? 'W' : 'L');
  const cf = r.pnlPre >= 0 ? `+${r.pnlPre.toFixed(2)}` : r.pnlPre.toFixed(2);
  return `  ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 26).padEnd(26)} pre ${String(r.uPre).padStart(4)}u → T ${String(r.tAtPaper).padStart(4)}u  ${(r.path || '-').padEnd(14)} ${res} CF ${cf.padStart(7)}  ${r.odds}  ${r.mutedBy || 'live'} ${r.steamReason || r.steamAction || ''} ${extra}`.trimEnd();
}

const out = [];
const p = (s = '') => { out.push(s); };

p('# Steam mute revisit — extra data after the Sep 8 papers');
p('');
p(`_Pulled ${new Date().toISOString()}. Graded AGS-U sides ${LEFTOVER_FROM}+. Leftover mute Aug 19. Policy T Aug 31. Leftover A/B arriving HOLD + native 2–3u arriving → 4u shipped Sep 9 (bc44b00d4d)._`);
p(`_Paper window for comparison: ${LEFTOVER_FROM}–${T_PRE_SHIP_HI}. New days: ${SHIP_FROM}+._`);
p('');
p('Sign of mute CF: **positive = we left money on the table** (over-mute). **Negative = the mute saved us.**');
p('');

function boardLine(label, rs) {
  const live = liveOf(rs);
  const mutes = muteOf(rs);
  const a = agg(live);
  p(`- **${label}**: live ${fmt(a)} · ${a.perDay || 0}/day · ${a.meanU || 0}u/tix · muted ${mutes.length} (${rs.length ? ((mutes.length / rs.length) * 100).toFixed(0) : 0}% of graded)`);
}

p('## 0. Live book vs the Sep 8 paper');
boardLine(`Paper window ${LEFTOVER_FROM}–${T_PRE_SHIP_HI}`, paperWin);
boardLine(`Discovery leftover, T off (${LEFTOVER_FROM}–${DISC_HI})`, disc);
boardLine(`T live, pre-ship (${T_FROM}–${T_PRE_SHIP_HI})`, tPre);
boardLine(`Post-ship ${SHIP_FROM}+`, post);
boardLine(`Full steam era ${LEFTOVER_FROM}+`, steamEra);
boardLine(`Full T era ${T_FROM}+`, tEra);
p('');

const livePost = liveOf(post);
const liveTPre = liveOf(tPre);
p(`Post-ship live mix: ${livePost.length} tickets on ${agg(livePost).days} nights.`);
p('');

p('## 1. Are we leaving too many muted? — mute CF by reason');
p('');
p('### 1a. Whole mute stack (graded, pre-policy units)');
function muteStack(rs, label) {
  p(`**${label}**`);
  p(`live ${fmt(agg(liveOf(rs)))}`);
  p(`all mutes CF ${fmt(muteCf(muteOf(rs)))}`);
  for (const row of byMuted(rs)) {
    p(`  ${row.key}: ${fmt(row)}`);
  }
  p('');
}
muteStack(paperWin, `Paper window through Sep 8`);
muteStack(post, `Post-ship Sep 9+`);
muteStack(tEra, `Full T era Aug 31+`);

p('### 1b. Policy T steam-tail mutes (the 1u / unconfirmed 4u / fat gates)');
function steamMuteBlock(rs, label) {
  const sm = steamMutes(rs);
  p(`**${label}** steam-tail CF ${fmt(muteCf(sm))}`);
  for (const row of byReason(sm)) p(`  ${row.key}: ${fmt(row)}`);
  p('');
}
steamMuteBlock(paperWin, 'Through Sep 8');
steamMuteBlock(post, 'Sep 9+');
steamMuteBlock(tEra, 'Full T era');

p('### 1c. Leftover mute (believed-cut + fail-open-sub4), split by steam cell');
function leftoverBlock(rs, label) {
  const lo = leftoverMutes(rs);
  const bc = lo.filter((r) => r.mutedBy === 'believed-cut');
  const fo = lo.filter((r) => r.mutedBy === 'fail-open-sub4');
  p(`**${label}**`);
  p(`leftover all CF ${fmt(muteCf(lo))}`);
  p(`  believed-cut ${fmt(muteCf(bc))}`);
  p(`    no steam ${fmt(muteCf(bc.filter((r) => r.steamCell === 'ab_no_steam' || r.steamCell === 'no_steam')))}`);
  p(`    A/B already-on ${fmt(muteCf(bc.filter((r) => r.steamCell === 'ab_already_on')))}`);
  p(`    A/B arriving ${fmt(muteCf(bc.filter((r) => r.abArr)))}`);
  p(`  fail-open-sub4 ${fmt(muteCf(fo))}`);
  p(`    no steam ${fmt(muteCf(fo.filter((r) => !r.steamOn)))}`);
  p(`    A/B arriving ${fmt(muteCf(fo.filter((r) => r.abArr)))}`);
  p(`    all steam-on ${fmt(muteCf(fo.filter((r) => r.steamOn)))}`);
  p('');
}
leftoverBlock(paperWin, 'Through Sep 8');
leftoverBlock(post, 'Sep 9+ (HOLD should have zeroed arriving leftovers)');
leftoverBlock(steamEra, 'Full leftover era Aug 19+');

p('### 1d. Leftover × arriving — tickets leftover killed that T would have shipped');
function leftoverArrivingList(rs, label) {
  const hits = leftoverMutes(rs).filter((r) => r.abArr);
  p(`**${label}** n=${hits.length}`);
  const atPre = muteCf(hits);
  const atT = agg(hits, 'tAtPaper', 'pnlTPaper');
  p(`  at leftover pre-units ${fmt(atPre)}`);
  p(`  at T would-ship size (2u floor on leans, mid HOLD, 4u/fat if A/B steam) ${fmt(atT)}`);
  for (const r of hits.slice().sort((a, b) => a.date.localeCompare(b.date))) {
    p(ticketLine(r, `tape=${r.tapeAction || '—'} flags=${r.leftoverReason || '—'}`));
  }
  p('');
  return hits;
}
const arrPre = leftoverArrivingList(paperWin, 'Through Sep 8 (the original 8)');
const arrPost = leftoverArrivingList(post, 'Sep 9+ (should be empty if HOLD is live)');

p('## 2. Did the Sep 9 leftover HOLD actually ship arriving leftovers?');
p('');
const postLeftoverArr = leftoverMutes(post).filter((r) => r.abArr);
const postLiveArr = liveOf(post).filter((r) => r.abArr);
const postLiveArrFloors = postLiveArr.filter((r) => r.steamAction === 'FLOOR');
const postLiveArrBoost = postLiveArr.filter((r) => r.steamAction === 'BOOST' || r.steamReason === 'arriving_mid_4u');
p(`Post-ship leftover×arriving still muted: **${postLeftoverArr.length}** (want 0).`);
p(`Post-ship live A/B arriving: ${fmt(agg(postLiveArr))}`);
p(`  T FLOOR (1u→2u): ${fmt(agg(postLiveArrFloors))}`);
p(`  T BOOST (2–3u→4u): ${fmt(agg(postLiveArrBoost))}`);
p(`  live arriving by band:`);
for (const b of ['≤1u', '2–3u', '4u', '5u', '5.4u', '6u']) {
  const rs = postLiveArr.filter((r) => r.band === b);
  if (rs.length) p(`    ${b} ${fmt(agg(rs))}  steamActions=${[...new Set(rs.map((r) => r.steamAction || '—'))].join(',')}`);
}
p('');
p('Post-ship live A/B arriving tickets:');
for (const r of postLiveArr.slice().sort((a, b) => a.date.localeCompare(b.date))) {
  p(`  ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 26).padEnd(26)} ${String(r.u).padStart(4)}u pre ${r.uPre}u ${(r.path || '-').padEnd(14)} ${r.won ? 'W' : 'L'} ${r.pnl >= 0 ? '+' : ''}${r.pnl.toFixed(2)}  ${r.steamAction || '—'} ${r.steamReason || ''} ${r.band}`);
}
p('');

p('## 3. Arriving still undersized? Live A/B arriving vs rest');
function arrivingVsRest(rs, label) {
  const live = liveOf(rs);
  const arr = live.filter((r) => r.abArr);
  const rest = live.filter((r) => !r.abArr);
  p(`**${label}**`);
  p(`  arriving ${fmt(agg(arr))} · ${agg(arr).meanU}u/tix`);
  p(`  not arriving ${fmt(agg(rest))} · ${agg(rest).meanU}u/tix`);
  const mid = arr.filter((r) => r.band === '2–3u' && r.steamAction !== 'FLOOR' && r.steamAction !== 'BOOST');
  const boosted = arr.filter((r) => r.steamAction === 'BOOST' || r.steamReason === 'arriving_mid_4u');
  p(`  native 2–3u arriving still sitting mid (not boosted) ${fmt(agg(mid))}`);
  p(`  boosted 2–3u→4u ${fmt(agg(boosted))}`);
  p('');
}
arrivingVsRest(paperWin, 'Through Sep 8');
arrivingVsRest(post, 'Sep 9+');
arrivingVsRest(steamEra, 'Full steam era');

p('## 4. Steam-tail 1u mute — still junk, or over-mute?');
function leanBlock(rs, label) {
  const lean = steamMutes(rs).filter((r) => r.steamReason === 'lean_no_arriving' || r.bandPre === '≤1u');
  p(`**${label}** lean_no_arriving CF ${fmt(muteCf(lean))}`);
  p(`  A/B no-steam ${fmt(muteCf(lean.filter((r) => r.steamCell === 'ab_no_steam' || r.steamCell === 'no_steam')))}`);
  p(`  already-on ${fmt(muteCf(lean.filter((r) => r.alreadyOn)))}`);
  p(`  arriving (should be floored, not muted) ${fmt(muteCf(lean.filter((r) => r.abArr)))}`);
  p('');
}
leanBlock(paperWin, 'Through Sep 8');
leanBlock(post, 'Sep 9+');
leanBlock(tEra, 'Full T era');

p('## 5. Unconfirmed 4u vs unconfirmed fat — still the split?');
function fatBlock(rs, label) {
  const sm = steamMutes(rs);
  const u4 = sm.filter((r) => r.steamReason === 'unconfirmed_4u');
  const fat = sm.filter((r) => r.steamReason === 'unconfirmed_fat');
  p(`**${label}**`);
  p(`  unconfirmed 4u MUTE CF ${fmt(muteCf(u4))}`);
  p(`  unconfirmed fat MUTE CF ${fmt(muteCf(fat))}`);
  const keepFat = liveOf(rs).filter((r) => r.u >= 5.35 && r.sharpAB && r.steamOn);
  p(`  fat WITH A/B steam (kept) ${fmt(agg(keepFat))}`);
  p(`  fat muted tickets:`);
  for (const r of fat.slice().sort((a, b) => a.date.localeCompare(b.date))) {
    p(ticketLine(r));
  }
  p(`  unconfirmed 4u tickets:`);
  for (const r of u4.slice().sort((a, b) => a.date.localeCompare(b.date))) {
    p(ticketLine(r));
  }
  p('');
}
fatBlock(paperWin, 'Through Sep 8');
fatBlock(post, 'Sep 9+');
fatBlock(tEra, 'Full T era');

p('## 6. FAIL_OPEN leftover — the “maybe too wide” watch');
function foBlock(rs, label) {
  const fo = muteOf(rs).filter((r) => r.mutedBy === 'fail-open-sub4');
  p(`**${label}** fail-open-sub4 CF ${fmt(muteCf(fo))}`);
  p(`  arriving ${fmt(muteCf(fo.filter((r) => r.abArr)))}`);
  p(`  not arriving ${fmt(muteCf(fo.filter((r) => !r.abArr)))}`);
  p(`  tickets:`);
  for (const r of fo.slice().sort((a, b) => a.date.localeCompare(b.date))) {
    p(ticketLine(r, `cell=${r.steamCell}`));
  }
  p('');
}
foBlock(paperWin, 'Through Sep 8');
foBlock(post, 'Sep 9+');
foBlock(steamEra, 'Full leftover era');

p('## 7. Other mutes that still eat steam tickets');
function otherMutes(rs, label) {
  const interesting = [
    'tape-weak', 'qconv-q1', 'fools-gold-flat', 'maxsr-sub4',
    'ev-drift-edge', 'fav-juice', 'winner_align_fade', 'top-crowded',
    'ags-quality-veto', 'no-confirmed',
  ];
  p(`**${label}**`);
  const steamOnMuted = muteOf(rs).filter((r) => r.steamOn || r.abArr);
  p(`  any mute with steam-on or arriving CF ${fmt(muteCf(steamOnMuted))}`);
  p(`  of those, leftover ${fmt(muteCf(steamOnMuted.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4')))}`);
  p(`  of those, steam-tail ${fmt(muteCf(steamOnMuted.filter((r) => r.mutedBy === 'steam-tail')))}`);
  p(`  of those, other ${fmt(muteCf(steamOnMuted.filter((r) => r.mutedBy !== 'believed-cut' && r.mutedBy !== 'fail-open-sub4' && r.mutedBy !== 'steam-tail')))}`);
  for (const k of interesting) {
    const hit = muteOf(rs).filter((r) => r.mutedBy === k);
    if (!hit.length) continue;
    const steamish = hit.filter((r) => r.steamOn || r.abArr);
    p(`  ${k}: all ${fmtShort(muteCf(hit))} · steam/arriving ${fmtShort(muteCf(steamish))}`);
  }
  p('');
}
otherMutes(tEra, 'Full T era');
otherMutes(post, 'Sep 9+');

p('## 8. Counterfactual menus (T era, extra days included)');
{
  const live = liveOf(tEra);
  const livePnl = agg(live);
  p(`Actual T-era live book: ${fmt(livePnl)}`);

  const add = (label, extra, uKey = 'uPre', pKey = 'pnlPre') => {
    const a = agg(extra, uKey, pKey);
    p(`  + ${label}: would add ${fmt(a)} → combined live ${livePnl.n + a.n} · ${(livePnl.pnl + a.pnl) >= 0 ? '+' : ''}${(livePnl.pnl + a.pnl).toFixed(1)}u`);
  };
  add('leftover×arriving at T size (through today)', leftoverMutes(tEra).filter((r) => r.abArr), 'tAtPaper', 'pnlTPaper');
  add('fail-open-sub4 that T would ship (2–3u / arriving floor)', muteOf(tEra).filter((r) => r.mutedBy === 'fail-open-sub4' && r.tAtPaper > 0), 'tAtPaper', 'pnlTPaper');
  add('ALL fail-open-sub4 at pre units', muteOf(tEra).filter((r) => r.mutedBy === 'fail-open-sub4'));
  add('unconfirmed fat', steamMutes(tEra).filter((r) => r.steamReason === 'unconfirmed_fat'));
  add('unconfirmed 4u', steamMutes(tEra).filter((r) => r.steamReason === 'unconfirmed_4u'));
  add('lean_no_arriving 1u', steamMutes(tEra).filter((r) => r.steamReason === 'lean_no_arriving'));
  add('believed-cut no-steam', leftoverMutes(tEra).filter((r) => r.mutedBy === 'believed-cut' && !r.steamOn));
  p('');
}

p('## 9. Daily live board (T era)');
p('| Date | Live | W-L | WR | PnL | Muted | steam-tail | leftover |');
p('| --- | --- | --- | --- | --- | --- | --- | --- |');
{
  const dates = [...new Set(tEra.map((r) => r.date))].sort();
  for (const d of dates) {
    const day = tEra.filter((r) => r.date === d);
    const live = liveOf(day);
    const a = agg(live);
    const mutes = muteOf(day);
    const st = mutes.filter((r) => r.mutedBy === 'steam-tail').length;
    const lo = mutes.filter((r) => r.mutedBy === 'believed-cut' || r.mutedBy === 'fail-open-sub4').length;
    if (!a.n && !mutes.length) continue;
    p(`| ${d} | ${a.n} | ${a.w}-${a.l} | ${a.wr ?? '—'}% | ${a.n ? (a.pnl >= 0 ? '+' : '') + a.pnl.toFixed(2) : '—'} | ${mutes.length} | ${st} | ${lo} |`);
  }
}
p('');

const payload = {
  generatedAt: new Date().toISOString(),
  nGraded: graded.length,
  nLive: liveOf(steamEra).length,
  nMuted: muteOf(steamEra).length,
  windows: {
    paper: { live: agg(liveOf(paperWin)), muted: muteCf(muteOf(paperWin)) },
    post: { live: agg(liveOf(post)), muted: muteCf(muteOf(post)) },
    tEra: { live: agg(liveOf(tEra)), muted: muteCf(muteOf(tEra)) },
  },
  leftoverArriving: {
    throughSep8: arrPre.map((r) => ({
      date: r.date, sport: r.sport, mkt: r.mkt, team: r.team, uPre: r.uPre,
      tAtPaper: r.tAtPaper, won: r.won, pnlPre: r.pnlPre, pnlTPaper: r.pnlTPaper,
      mutedBy: r.mutedBy, leftoverReason: r.leftoverReason, path: r.path, odds: r.odds,
    })),
    postShip: arrPost.map((r) => ({
      date: r.date, sport: r.sport, team: r.team, mutedBy: r.mutedBy, uPre: r.uPre, won: r.won,
    })),
  },
  postShipArrivingLive: postLiveArr.map((r) => ({
    date: r.date, sport: r.sport, team: r.team, u: r.u, uPre: r.uPre,
    steamAction: r.steamAction, steamReason: r.steamReason, won: r.won, pnl: r.pnl, path: r.path,
  })),
};

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/steam_mute_revisit.md', `${out.join('\n')}\n`);
writeFileSync('/opt/cursor/artifacts/steam_mute_revisit.json', JSON.stringify(payload, null, 2));
writeFileSync('/opt/cursor/artifacts/steam_mute_revisit_rows.json', JSON.stringify(graded.map((r) => ({
  date: r.date, era: r.era, sport: r.sport, mkt: r.mkt, team: r.team, path: r.path,
  won: r.won, odds: r.odds, u: r.u, pnl: r.pnl, uPre: r.uPre, pnlPre: r.pnlPre,
  live: r.live, mutedBy: r.mutedBy, steamAction: r.steamAction, steamReason: r.steamReason,
  arriving: r.arriving, steamOn: r.steamOn, sharpAB: r.sharpAB, abArr: r.abArr,
  steamCell: r.steamCell, band: r.band, bandPre: r.bandPre, leftoverReason: r.leftoverReason,
  tAtPaper: r.tAtPaper, pnlTPaper: r.pnlTPaper, tapeAction: r.tapeAction,
})), null, 2));
console.log(out.join('\n'));
console.error(`wrote artifacts · graded ${graded.length} live ${liveOf(steamEra).length} muted ${muteOf(steamEra).length}`);
