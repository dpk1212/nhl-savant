/**
 * Ticket-level dump: A/B arriving live sizing + leftover×arriving kills.
 *   node scripts/dumpArrivingAndLeftover.mjs
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
function band(u) {
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
function agg(rows, uKey = 'u', pKey = 'pnl') {
  let n = 0; let w = 0; let l = 0; let stake = 0; let pnl = 0;
  for (const r of rows) {
    n++; stake += r[uKey] || 0; pnl += Number.isFinite(r[pKey]) ? r[pKey] : 0;
    if (r.won === 1) w++; else l++;
  }
  const ci = wilson(w, n);
  return {
    n, w, l, stake: +stake.toFixed(2), pnl: +pnl.toFixed(2),
    wr: n ? +((w / n) * 100).toFixed(1) : null,
    wrLo: ci ? +(ci.lo * 100).toFixed(1) : null,
    roi: stake > 0 ? +((pnl / stake) * 100).toFixed(1) : null,
    meanU: n ? +(stake / n).toFixed(2) : null,
  };
}
function fmt(a) {
  if (!a || !a.n) return '—';
  const roi = a.roi == null ? '—' : `${a.roi >= 0 ? '+' : ''}${a.roi}%`;
  return `${a.n} · ${a.w}-${a.l} · ${a.wr}% (${a.wrLo}–) · ${a.stake.toFixed(1)}u · ${a.pnl >= 0 ? '+' : ''}${a.pnl.toFixed(2)}u · ${roi} · ${a.meanU}u/tix`;
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
const raw = JSON.parse(readFileSync(join(ROOT, 'data/wallet-profiles.json'), 'utf8'));
const profiles = raw.profiles || raw;
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
    if (!data.sides || data.date < '2026-08-19') continue;
    for (const [sideKey, sd] of Object.entries(data.sides)) {
      if (!sd || sd.superseded) continue;
      if ((sd.status || data.status) !== 'COMPLETED') continue;
      if (!isAgsu(sd.promotedBy)) continue;
      const res = sd.result || {};
      const won = res.outcome === 'WIN' ? 1 : res.outcome === 'LOSS' ? 0 : null;
      if (won == null) continue;
      const lock = sd.lock || {};
      const peak = sd.peak || lock;
      const u = Number(sd.finalUnits ?? sd.v8_agsUnitsApplied ?? peak.units ?? lock.units ?? 0) || 0;
      const tracked = res.tracked === true || u === 0;
      const live = !tracked && u > 0;
      const odds = Number(peak.odds || lock.odds || 0) || 0;
      const pnl = live ? (Number.isFinite(res.profit) ? res.profit : americanProfit(won, u, odds)) : 0;
      const preSteam = Number(sd.v8_unitsPreSteamTail);
      const preTape = Number(sd.v8_unitsPreTape);
      const preQ = Number(sd.v8_unitsPreQConv);
      let uPre = (Number.isFinite(preSteam) && preSteam > 0 ? preSteam : null)
        ?? (Number.isFinite(preQ) && preQ > 0 ? preQ : null)
        ?? (Number.isFinite(preTape) && preTape > 0 ? preTape : null)
        ?? (u > 0 ? u : 1);
      const tape = enrichTicketTapeFromSide(sd);
      const steamOn = !!tape.ticketTape?.steamOnLock;
      const steamOnFirst = !!tape.ticketTape?.steamOnFirst;
      const arriving = !steamOnFirst && steamOn;
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
      const sharpAB = forA + forB > 0;
      const edge = Number.isFinite(sd.v8_winnerAlignEdge) ? sd.v8_winnerAlignEdge : null;
      const leftoverFlags = [];
      const act = String(sd.v8_tapeAction || '').toUpperCase().replace(/-/g, '_');
      if (act === 'FAIL_OPEN') leftoverFlags.push('fail_open');
      const native4 = ['SUPER', 'TOP', 'TOP+', 'RANK'].includes(sd.v8_hcStakeTier);
      if (native4 && odds > 120) leftoverFlags.push('plus_native4');
      if (act === 'BOOST') leftoverFlags.push('tape_boost');
      if (edge != null && edge >= 10) leftoverFlags.push('edge_ge10');
      rows.push({
        date: data.date, sport, mkt, team: sd.team || sideKey,
        path: sd.v8_hcStakeTier || null, won, odds, u, pnl, uPre,
        pnlPre: americanProfit(won, uPre, odds),
        live, mutedBy: sd.mutedBy || null,
        steamAction: sd.v8_steamTailAction || null,
        steamReason: sd.v8_steamTailReason || null,
        tapeAction: sd.v8_tapeAction || null,
        arriving, steamOn, sharpAB, abArr: sharpAB && arriving,
        band: band(u), bandPre: band(uPre), edge,
        leftoverFlags, leftoverReason: leftoverFlags.join('+') || null,
      });
    }
  }
}

const out = [];
const p = (s = '') => { out.push(s); console.log(s); };
const live = rows.filter((r) => r.live);
const arr = live.filter((r) => r.abArr);
const noArr = live.filter((r) => !r.abArr);

p('A/B arriving LIVE  Aug 19+  vs rest of live book');
p(`arriving  ${fmt(agg(arr))}`);
p(`not arriving  ${fmt(agg(noArr))}`);
p('');
p('=== Arriving by LIVE unit band ===');
const bands = ['≤1u', '2–3u', '4u', '5u', '5.4u', '6u'];
for (const b of bands) {
  const rs = arr.filter((r) => r.band === b);
  const floors = rs.filter((r) => r.steamAction === 'FLOOR');
  p(`${b.padEnd(8)} ${fmt(agg(rs))}${floors.length ? `  (${floors.length} T floors 1→2)` : ''}`);
}
p('');
p('=== Mean units: arriving vs not, same path ===');
const paths = [...new Set(arr.map((r) => r.path || '(none)'))];
for (const path of paths) {
  const a = arr.filter((r) => (r.path || '(none)') === path);
  const b = noArr.filter((r) => (r.path || '(none)') === path);
  p(`${String(path).padEnd(18)} arriving ${fmt(agg(a))}`);
  p(`${''.padEnd(18)} other    ${fmt(agg(b))}`);
}
p('');
p('=== Ticket list: every live A/B arriving ===');
p('date sport mkt team u path result pnl odds steamAction');
for (const r of arr.slice().sort((a, b) => a.date.localeCompare(b.date) || a.u - b.u)) {
  p(`  ${r.date} ${r.sport} ${r.mkt.padEnd(6)} ${(r.team || '').slice(0, 24).padEnd(24)} ${String(r.u).padStart(4)}u  ${(r.path || '-').padEnd(16)} ${r.won ? 'W' : 'L'} ${(r.pnl >= 0 ? '+' : '') + r.pnl.toFixed(2)}  ${r.odds}  ${r.steamAction || '—'}  ${r.band}`);
}
p('');

function bumpTo(rs, targetFn) {
  let extraS = 0; let extraP = 0; let newS = 0; let newP = 0;
  for (const r of rs) {
    const nu = targetFn(r);
    const scale = r.u > 0 ? nu / r.u : 1;
    extraS += nu - r.u;
    extraP += r.pnl * (scale - 1);
    newS += nu;
    newP += r.pnl * scale;
  }
  return { extraS: +extraS.toFixed(2), extraP: +extraP.toFixed(2), newS: +newS.toFixed(2), newP: +newP.toFixed(2) };
}
p('=== Bump CFs on LIVE arriving only (same W/L) ===');
const midArr = arr.filter((r) => r.band === '2–3u' && r.steamAction !== 'FLOOR');
const floorArr = arr.filter((r) => r.steamAction === 'FLOOR');
const leanish = arr.filter((r) => r.u < 4);
p(`native 2–3u arriving n=${midArr.length} now ${fmt(agg(midArr))}`);
let x = bumpTo(midArr, (r) => Math.max(r.u, 4));
p(`  →4u   extra +${x.extraS}u stake  extra PnL ${x.extraP >= 0 ? '+' : ''}${x.extraP}u  new ${x.newS}u / ${x.newP >= 0 ? '+' : ''}${x.newP}u`);
x = bumpTo(midArr, (r) => Math.min(5, r.u + 1));
p(`  +1u cap5 extra +${x.extraS}u stake  extra PnL ${x.extraP >= 0 ? '+' : ''}${x.extraP}u`);
x = bumpTo(midArr, (r) => Math.max(r.u, 5));
p(`  →5u   extra +${x.extraS}u stake  extra PnL ${x.extraP >= 0 ? '+' : ''}${x.extraP}u`);
p(`T floors (1u→2u) n=${floorArr.length} now ${fmt(agg(floorArr))}`);
x = bumpTo(floorArr, (r) => 4);
p(`  those floors →4u extra +${x.extraS}u  extra PnL ${x.extraP >= 0 ? '+' : ''}${x.extraP}u`);
p(`all arriving <4u n=${leanish.length} now ${fmt(agg(leanish))}`);
x = bumpTo(leanish, (r) => Math.max(r.u, 4));
p(`  all <4u arriving →4u extra +${x.extraS}u  extra PnL ${x.extraP >= 0 ? '+' : ''}${x.extraP}u`);
const fatArr = arr.filter((r) => r.u >= 4);
p(`arriving already ≥4u n=${fatArr.length} ${fmt(agg(fatArr))}  (do not bump further — August 5.4u arriving was 1-1)`);
p('');

p('=== FINDING 1: leftover kills × arriving ===');
const mutes = rows.filter((r) => !r.live);
const bc = mutes.filter((r) => r.mutedBy === 'believed-cut');
const fo = mutes.filter((r) => r.mutedBy === 'fail-open-sub4');
const leftover = [...bc, ...fo];
p(`believed-cut all ${fmt(agg(bc, 'uPre', 'pnlPre'))}`);
p(`  no steam ${fmt(agg(bc.filter((r) => !r.steamOn), 'uPre', 'pnlPre'))}`);
p(`  already-on steam ${fmt(agg(bc.filter((r) => r.steamOn && !r.arriving && r.sharpAB), 'uPre', 'pnlPre'))}`);
p(`  A/B arriving ${fmt(agg(bc.filter((r) => r.abArr), 'uPre', 'pnlPre'))}`);
p(`fail-open-sub4 all ${fmt(agg(fo, 'uPre', 'pnlPre'))}`);
p(`  A/B arriving ${fmt(agg(fo.filter((r) => r.abArr), 'uPre', 'pnlPre'))}`);
p('');
p('Leftover + A/B arriving tickets (what leftover flag, what T would do next)');
p('If leftover had HOLDed: T would MUTE lean unless arriving (floor 2u), HOLD mid, MUTE unconfirmed 4u/fat unless A/B steam.');
for (const r of leftover.filter((r) => r.abArr).sort((a, b) => a.date.localeCompare(b.date))) {
  const tNext = r.uPre < 1.25 ? 'T would FLOOR to 2u (arriving lean)'
    : r.uPre < 3.5 ? 'T would HOLD (mid)'
    : r.uPre < 4.75 ? 'T would HOLD 4u (A/B steam on)'
    : r.uPre < 5.35 ? 'T would HOLD 5u always'
    : 'T would HOLD fat (A/B steam on)';
  p(`  ${r.date} ${r.sport} ${r.mkt} ${(r.team || '').slice(0, 26).padEnd(26)} pre ${r.uPre}u  ${r.path}  ${r.won ? 'W' : 'L'} ${r.pnlPre >= 0 ? '+' : ''}${r.pnlPre.toFixed(2)}  ${r.odds}`);
  p(`    mutedBy=${r.mutedBy}  tape=${r.tapeAction || '—'}  flags=${r.leftoverReason || '—'}  edge=${r.edge}  then: ${tNext}`);
}

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/arriving_leftover_dump.md', out.join('\n'));
console.error('wrote dump');
